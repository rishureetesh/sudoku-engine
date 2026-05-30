import { BOX_SIZE } from "../constants/board.js";
import type { Board } from "../types/board.js";
import type { Digit } from "../types/cell.js";
import { isEmptyCell } from "../utils/cell.js";

export function validateBox(
  board: Board,
  boxRow: number,
  boxColumn: number,
): boolean {
  const seen = new Set<Digit>();
  for (let r = boxRow; r < boxRow + BOX_SIZE; r++) {
    for (let c = boxColumn; c < boxColumn + BOX_SIZE; c++) {
      const value = board[r]![c]!;
      if (isEmptyCell(value)) {
        continue;
      }
      if (seen.has(value)) {
        return false;
      }
      seen.add(value);
    }
  }
  return true;
}
