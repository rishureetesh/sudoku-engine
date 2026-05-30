import type { Board } from "../types/board.js";
import type { CellValue } from "../types/cell.js";
import { digitBit, peerUsedMask } from "../internal/bitgrid.js";
import { assertInBounds } from "../utils/coordinates.js";
import { isDigit } from "../utils/cell.js";

export function isValidMove(
  board: Board,
  row: number,
  column: number,
  value: number,
): boolean {
  assertInBounds(row, column);

  if (!isDigit(value as CellValue)) {
    return false;
  }

  const current = board[row]![column];
  if (current !== null && current !== value) {
    return false;
  }

  let used = peerUsedMask(board, row, column);
  if (current !== null) {
    used &= ~digitBit(current);
  }

  return (used & digitBit(value)) === 0;
}
