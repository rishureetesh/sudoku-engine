import type { Board } from "../types/board.js";
import type { SolverResult } from "../types/difficulty.js";
import { BitGrid, maskToDigits } from "../internal/bitgrid.js";
import { cloneBoard } from "../utils/board.js";
import { validateBoard } from "../validation/validateBoard.js";

export function solve(board: Board): SolverResult {
  const working = cloneBoard(board);

  if (!validateBoard(working)) {
    return { solved: false, board: working };
  }

  const grid = BitGrid.fromBoard(working);
  const solved = solveRecursive(grid);
  return { solved, board: grid.toBoard() };
}

function solveRecursive(grid: BitGrid): boolean {
  const next = grid.findMrv();
  if (!next) {
    return grid.isComplete();
  }

  const { row, column, mask } = next;
  for (const digit of maskToDigits(mask)) {
    grid.place(row, column, digit);
    if (solveRecursive(grid)) {
      return true;
    }
    grid.clear(row, column);
  }

  return false;
}
