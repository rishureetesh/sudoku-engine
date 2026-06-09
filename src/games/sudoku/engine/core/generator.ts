import { BitGrid, maskToDigits } from "./bitgrid.js";
import {
  allCellCoordinates,
  countClues,
  mirrorCell,
  type Board,
} from "./board.js";
import type { Difficulty, GeneratedPuzzle } from "../types/difficulty.js";
import type { GeneratePuzzleOptions } from "../types/generator.js";
import type { SudokuVariant } from "./variant.js";
import {
  getTargetClueCount,
  isClueCountInRange,
} from "./difficulty.js";
import {
  countSolutionsOnGrid,
  solve,
} from "./solver.js";
import { shuffle } from "../utils/random.js";

export function generateSolvedBoard(variant: SudokuVariant): Board {
  const maxAttempts = variant.generation.tryFullClueRange ? 40 : 20;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const grid = BitGrid.empty(variant);

    for (const start of variant.seedRegionStarts) {
      fillRegion(grid, start.row, start.column);
    }

    if (hasDeadCell(grid)) {
      continue;
    }

    const result = solve(variant, grid.toBoard());
    if (result.solved) {
      return result.board;
    }
  }

  throw new Error("Could not fill a solved board");
}

function hasDeadCell(grid: BitGrid): boolean {
  const { size } = grid.variant.grid;
  for (let row = 0; row < size; row++) {
    for (let column = 0; column < size; column++) {
      if (grid.cells[grid.index(row, column)] === 0) {
        if (grid.candidateMaskAt(row, column) === 0) {
          return true;
        }
      }
    }
  }
  return false;
}

function fillRegion(
  grid: BitGrid,
  row: number,
  column: number,
): void {
  const { boxRows, boxCols, fullMask } = grid.variant.grid;
  const nums = shuffle(maskToDigits(grid.variant.grid, fullMask));
  let index = 0;
  for (let r = 0; r < boxRows; r++) {
    for (let c = 0; c < boxCols; c++) {
      grid.place(row + r, column + c, nums[index++]!);
    }
  }
}

export function removeCells(
  variant: SudokuVariant,
  solution: Board,
  targetClues: number,
  maxAttempts: number,
): Board | null {
  const grid = BitGrid.fromBoard(variant, solution);
  const order = shuffle(allCellCoordinates(variant));
  let clues = countClues(solution);
  let attempts = 0;

  for (const { row, column } of order) {
    if (clues <= targetClues) {
      break;
    }
    if (grid.cells[grid.index(row, column)] === 0) {
      continue;
    }

    const backup = grid.cells[grid.index(row, column)]!;
    grid.clear(row, column);
    attempts++;

    if (countSolutionsOnGrid(grid, 2) === 1) {
      clues--;
    } else {
      grid.place(row, column, backup);
    }

    if (attempts > maxAttempts) {
      break;
    }
  }

  return grid.toBoard();
}

export function removeCellsSymmetric(
  variant: SudokuVariant,
  solution: Board,
  targetClues: number,
  maxAttempts: number,
): Board | null {
  const grid = BitGrid.fromBoard(variant, solution);
  const pairs: { row: number; column: number }[][] = [];
  const seen = new Set<string>();

  for (const cell of allCellCoordinates(variant)) {
    const key = `${cell.row},${cell.column}`;
    const mate = mirrorCell(variant, cell.row, cell.column);
    const mateKey = `${mate.row},${mate.column}`;
    const pairKey = [key, mateKey].sort().join("|");
    if (seen.has(pairKey)) {
      continue;
    }
    seen.add(pairKey);
    if (key === mateKey) {
      pairs.push([cell]);
    } else {
      pairs.push([cell, mate]);
    }
  }

  const order = shuffle(pairs);
  let clues = countClues(solution);
  let attempts = 0;

  for (const group of order) {
    if (clues <= targetClues) {
      break;
    }

    const backups = group.map((c) => grid.cells[grid.index(c.row, c.column)]!);
    if (!backups.every((v) => v !== 0)) {
      continue;
    }

    for (const cell of group) {
      grid.clear(cell.row, cell.column);
    }
    attempts++;

    if (countSolutionsOnGrid(grid, 2) !== 1) {
      for (let i = 0; i < group.length; i++) {
        const cell = group[i]!;
        grid.place(cell.row, cell.column, backups[i]!);
      }
    } else {
      clues -= group.length;
    }

    if (attempts > maxAttempts) {
      break;
    }
  }

  return grid.toBoard();
}

export function generatePuzzle(
  variant: SudokuVariant,
  difficulty: Difficulty,
  options?: GeneratePuzzleOptions,
): GeneratedPuzzle | null {
  const profile = variant.generation;
  const maxAttempts = options?.maxAttempts ?? profile.puzzleMaxAttempts;
  const range = variant.clueRanges[difficulty];
  const targets = profile.tryFullClueRange
    ? [range.max, range.min, getTargetClueCount(variant, difficulty)]
    : [getTargetClueCount(variant, difficulty)];
  const carve = options?.symmetric ? removeCellsSymmetric : removeCells;
  const carveAttempts = profile.carveMaxAttempts;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const solution = generateSolvedBoard(variant);

    for (const targetClues of targets) {
      const carved = carve(variant, solution, targetClues, carveAttempts);
      if (!carved) {
        continue;
      }

      const clueCount = countClues(carved);
      if (!isClueCountInRange(variant, difficulty, clueCount)) {
        continue;
      }

      return {
        difficulty,
        puzzle: carved,
        solution,
        clueCount,
      };
    }
  }

  return generatePuzzleFallback(variant, difficulty, options?.symmetric);
}

function generatePuzzleFallback(
  variant: SudokuVariant,
  difficulty: Difficulty,
  symmetric?: boolean,
): GeneratedPuzzle | null {
  const range = variant.clueRanges[difficulty];
  const attempts = variant.generation.puzzleFallbackAttempts;

  for (let i = 0; i < attempts; i++) {
    const solution = generateSolvedBoard(variant);
    const cells = shuffle(allCellCoordinates(variant));

    for (const target of [range.max, range.min, getTargetClueCount(variant, difficulty)]) {
      const puzzle = removeCellsRelaxed(
        variant,
        solution,
        cells,
        target,
        symmetric,
      );
      if (!puzzle) {
        continue;
      }

      const clues = countClues(puzzle);
      if (isClueCountInRange(variant, difficulty, clues)) {
        return {
          difficulty,
          puzzle,
          solution,
          clueCount: clues,
        };
      }
    }
  }

  return null;
}

function removeCellsRelaxed(
  variant: SudokuVariant,
  solution: Board,
  cells: { row: number; column: number }[],
  target: number,
  symmetric?: boolean,
): Board | null {
  if (symmetric) {
    return removeCellsSymmetric(variant, solution, target, 200);
  }

  const grid = BitGrid.fromBoard(variant, solution);
  let clues = countClues(solution);

  for (const { row, column } of cells) {
    if (clues <= target) {
      break;
    }
    if (grid.cells[grid.index(row, column)] === 0) {
      continue;
    }

    const backup = grid.cells[grid.index(row, column)]!;
    grid.clear(row, column);

    if (countSolutionsOnGrid(grid, 2) === 1) {
      clues--;
    } else {
      grid.place(row, column, backup);
    }
  }

  return grid.toBoard();
}
