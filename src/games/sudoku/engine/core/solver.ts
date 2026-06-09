import { BitGrid, maskToDigits } from "./bitgrid.js";
import { popcount } from "./mask.js";
import type { Board } from "./board.js";
import type { SudokuVariant } from "./variant.js";
import type { SolverResult } from "../types/difficulty.js";
import { cloneBoard } from "./board.js";
import { validateBoard } from "./validation.js";

export function solve(variant: SudokuVariant, board: Board): SolverResult {
  const working = cloneBoard(board);

  if (!validateBoard(variant, working)) {
    return { solved: false, board: working };
  }

  const grid = BitGrid.fromBoard(variant, working);
  const solved = solveRecursive(grid);
  return { solved, board: grid.toBoard() };
}

function solveRecursive(grid: BitGrid): boolean {
  const next = grid.findMrv();
  if (!next) {
    return grid.isComplete();
  }

  const { row, column, mask } = next;
  for (const digit of maskToDigits(grid.variant.grid, mask)) {
    grid.place(row, column, digit);
    if (solveRecursive(grid)) {
      return true;
    }
    grid.clear(row, column);
  }

  return false;
}

export function countSolutionsBitGrid(
  grid: BitGrid,
  limit?: number,
): number {
  return countSolutionsRecursive(
    grid.clone(),
    0,
    limit ?? Number.POSITIVE_INFINITY,
  );
}

/** Counts solutions while mutating `grid`; caller must undo or discard changes. */
export function countSolutionsOnGrid(grid: BitGrid, limit = 2): number {
  return countSolutionsRecursive(grid, 0, limit);
}

function countSolutionsRecursive(
  grid: BitGrid,
  found: number,
  limit: number,
): number {
  if (found >= limit) {
    return found;
  }

  const next = grid.findMrv();
  if (!next) {
    return found + 1;
  }

  const { row, column, mask } = next;
  if (popcount(mask) === 0) {
    return found;
  }

  for (const digit of maskToDigits(grid.variant.grid, mask)) {
    grid.place(row, column, digit);
    found = countSolutionsRecursive(grid, found, limit);
    if (found >= limit) {
      grid.clear(row, column);
      return found;
    }
    grid.clear(row, column);
  }

  return found;
}

export function countSolutions(
  variant: SudokuVariant,
  board: Board,
  limit?: number,
): number {
  if (!validateBoard(variant, board)) {
    return 0;
  }

  return countSolutionsBitGrid(BitGrid.fromBoard(variant, board), limit);
}

export function hasUniqueSolution(
  variant: SudokuVariant,
  board: Board,
): boolean {
  return countSolutions(variant, board, 2) === 1;
}

export function findEmptyCell(
  variant: SudokuVariant,
  board: Board,
): { row: number; column: number } | null {
  for (let row = 0; row < variant.grid.size; row++) {
    for (let column = 0; column < variant.grid.size; column++) {
      if (board[row]![column] === null) {
        return { row, column };
      }
    }
  }
  return null;
}
