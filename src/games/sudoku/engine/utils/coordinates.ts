import { GRID_SIZE } from "../constants/board.js";
import { SudokuEngineError } from "../batch/errors.js";

export function isInBounds(row: number, column: number): boolean {
  return (
    Number.isInteger(row) &&
    Number.isInteger(column) &&
    row >= 0 &&
    row < GRID_SIZE &&
    column >= 0 &&
    column < GRID_SIZE
  );
}

export function assertInBounds(row: number, column: number): void {
  if (!isInBounds(row, column)) {
    throw new SudokuEngineError(
      `Row/column out of range (0–${GRID_SIZE - 1}): (${row}, ${column})`,
    );
  }
}
