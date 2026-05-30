import type { Board } from "../types/board.js";
import { candidateMask, maskToDigits } from "../internal/bitgrid.js";
import { assertInBounds } from "../utils/coordinates.js";

export function getCandidates(
  board: Board,
  row: number,
  column: number,
): number[] {
  assertInBounds(row, column);
  return maskToDigits(candidateMask(board, row, column));
}
