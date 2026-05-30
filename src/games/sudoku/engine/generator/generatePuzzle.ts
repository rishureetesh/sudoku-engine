import { CLUE_RANGES } from "../constants/difficulty.js";
import { BitGrid } from "../internal/bitgrid.js";
import type { Board } from "../types/board.js";
import {
  allCellCoordinates,
  countClues,
} from "../utils/board.js";
import { shuffle } from "../utils/random.js";
import {
  getTargetClueCount,
  isClueCountInRange,
} from "../difficulty/index.js";
import { countSolutionsBitGrid, hasUniqueSolution } from "../solver/countSolutions.js";
import type { Difficulty, GeneratedPuzzle } from "../types/difficulty.js";
import type { GeneratePuzzleOptions } from "../types/generator.js";
import { generateSolvedBoard } from "./generateSolvedBoard.js";
import { removeCells } from "./removeCells.js";
import { removeCellsSymmetric } from "./removeCellsSymmetric.js";

export function generatePuzzle(
  difficulty: Difficulty,
  options?: GeneratePuzzleOptions,
): GeneratedPuzzle | null {
  const maxAttempts = options?.maxAttempts ?? 12;
  const targetClues = getTargetClueCount(difficulty);
  const carve = options?.symmetric ? removeCellsSymmetric : removeCells;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const solution = generateSolvedBoard();
    const carved = carve(solution, targetClues, 200);
    if (!carved) {
      continue;
    }

    const clueCount = countClues(carved);
    if (
      !hasUniqueSolution(carved) ||
      !isClueCountInRange(difficulty, clueCount)
    ) {
      continue;
    }

    return {
      difficulty,
      puzzle: carved,
      solution,
      clueCount,
    };
  }

  return generatePuzzleFallback(difficulty, options?.symmetric);
}

function generatePuzzleFallback(
  difficulty: Difficulty,
  symmetric?: boolean,
): GeneratedPuzzle {
  const fallbackTarget = CLUE_RANGES[difficulty].max;

  for (let i = 0; i < 30; i++) {
    const solution = generateSolvedBoard();
    const cells = shuffle(allCellCoordinates());

    for (const target of [getTargetClueCount(difficulty), fallbackTarget]) {
      const puzzle = removeCellsRelaxed(solution, cells, target, symmetric);
      if (!puzzle) {
        continue;
      }

      const clues = countClues(puzzle);
      if (hasUniqueSolution(puzzle) && isClueCountInRange(difficulty, clues)) {
        return {
          difficulty,
          puzzle,
          solution,
          clueCount: clues,
        };
      }
    }
  }

  throw new Error("Could not generate a puzzle");
}

function removeCellsRelaxed(
  solution: Board,
  cells: { row: number; column: number }[],
  target: number,
  symmetric?: boolean,
): Board | null {
  if (symmetric) {
    return removeCellsSymmetric(solution, target, 200);
  }

  const grid = BitGrid.fromBoard(solution);
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

    if (countSolutionsBitGrid(grid, 2) === 1) {
      clues--;
    } else {
      grid.place(row, column, backup);
    }
  }

  return grid.toBoard();
}
