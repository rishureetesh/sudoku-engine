import { GRID_SIZE } from "../constants/board.js";
import type { Board } from "../types/board.js";
import type { EmptyCell } from "../types/cell.js";
import { isEmptyCell } from "../utils/cell.js";

export function findEmptyCell(board: Board): EmptyCell | null {
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let column = 0; column < GRID_SIZE; column++) {
      if (isEmptyCell(board[row]![column]!)) {
        return { row, column };
      }
    }
  }
  return null;
}
