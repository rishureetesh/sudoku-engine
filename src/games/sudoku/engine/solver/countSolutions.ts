import type { Board } from "../types/board.js";
import {
  BitGrid,
  maskToDigits,
  popcount,
} from "../internal/bitgrid.js";
import { validateBoard } from "../validation/validateBoard.js";

export function countSolutions(board: Board, limit?: number): number {
  if (!validateBoard(board)) {
    return 0;
  }

  return countSolutionsBitGrid(BitGrid.fromBoard(board), limit);
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

  for (const digit of maskToDigits(mask)) {
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

export function hasUniqueSolution(board: Board): boolean {
  return countSolutions(board, 2) === 1;
}
