import { GRID_SIZE } from "../constants/board.js";
import type { Board } from "../types/board.js";
import { isDigit } from "../utils/cell.js";
import { isValidMove } from "./isValidMove.js";

export function isSolvedBoard(board: Board): boolean {
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let column = 0; column < GRID_SIZE; column++) {
      const value = board[row]![column]!;
      if (!isDigit(value) || !isValidMove(board, row, column, value)) {
        return false;
      }
    }
  }
  return true;
}
