import { GRID_SIZE } from "../constants/board.js";
import type { Board } from "../types/board.js";
import type { Digit } from "../types/cell.js";
import { isEmptyCell } from "../utils/cell.js";

export function validateColumn(board: Board, column: number): boolean {
  const seen = new Set<Digit>();
  for (let row = 0; row < GRID_SIZE; row++) {
    const value = board[row]![column]!;
    if (isEmptyCell(value)) {
      continue;
    }
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
  }
  return true;
}
