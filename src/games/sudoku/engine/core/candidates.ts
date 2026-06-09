import { candidateMask, maskToDigits } from "./bitgrid.js";
import type { Board } from "./board.js";
import type { SudokuVariant } from "./variant.js";

export function getCandidates(
  variant: SudokuVariant,
  board: Board,
  row: number,
  column: number,
): number[] {
  return maskToDigits(variant.grid, candidateMask(variant, board, row, column));
}
