import type { CellValue, Digit } from "../types/cell.js";

export function isDigit(value: CellValue): value is Digit {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= 1 &&
    value <= 9
  );
}

export function isEmptyCell(value: CellValue): value is null {
  return value === null;
}
