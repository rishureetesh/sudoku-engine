import type { Board } from "../types/board.js";
import { BitGrid } from "../internal/bitgrid.js";
import { fillDiagonalBoxes, fillRemaining } from "./fillBoard.js";

export function generateSolvedBoard(): Board {
  const grid = BitGrid.empty();
  fillDiagonalBoxes(grid);
  if (!fillRemaining(grid, 0, 0)) {
    return generateSolvedBoard();
  }
  return grid.toBoard();
}
