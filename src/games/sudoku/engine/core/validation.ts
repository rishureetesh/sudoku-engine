import type { Board } from "./board.js";
import { isValidBoardShape } from "./board.js";
import type { SudokuVariant } from "./variant.js";
import { isInBounds } from "./board.js";
function houseHasDuplicates(
  variant: SudokuVariant,
  board: Board,
  houseIndex: number,
): boolean {
  const seen = new Set<number>();
  for (const cell of variant.houses.houses[houseIndex]!.cells) {
    const row = Math.floor(cell / variant.grid.size);
    const column = cell % variant.grid.size;
    const rowData = board[row];
    if (!rowData || rowData.length !== variant.grid.size) {
      return true;
    }
    const value = rowData[column];
    if (value === null || value === undefined) {
      continue;
    }
    if (seen.has(value)) {
      return true;
    }
    seen.add(value);
  }
  return false;
}

export function validateHouse(
  variant: SudokuVariant,
  board: Board,
  houseIndex: number,
): boolean {
  return !houseHasDuplicates(variant, board, houseIndex);
}

export function validateBoard(variant: SudokuVariant, board: Board): boolean {
  if (!isValidBoardShape(variant, board)) {
    return false;
  }

  for (let houseIndex = 0; houseIndex < variant.houses.houses.length; houseIndex++) {    if (!validateHouse(variant, board, houseIndex)) {
      return false;
    }
  }

  return true;
}

export function isValidMove(
  variant: SudokuVariant,
  board: Board,
  row: number,
  column: number,
  value: number,
): boolean {
  if (!isInBounds(variant, row, column)) {
    return false;
  }

  if (!variant.grid.digits.includes(value)) {    return false;
  }

  const current = board[row]![column];
  if (current !== null && current !== value) {
    return false;
  }

  const cell = row * variant.grid.size + column;
  for (const houseIndex of variant.houses.cellHouses[cell]!) {
    for (const peerCell of variant.houses.houses[houseIndex]!.cells) {
      if (peerCell === cell) {
        continue;
      }
      const peerRow = Math.floor(peerCell / variant.grid.size);
      const peerColumn = peerCell % variant.grid.size;
      if (board[peerRow]![peerColumn] === value) {
        return false;
      }
    }
  }

  return true;
}

export function isSolvedBoard(variant: SudokuVariant, board: Board): boolean {
  for (let row = 0; row < variant.grid.size; row++) {
    for (let column = 0; column < variant.grid.size; column++) {
      const rowData = board[row];
    if (!rowData) {
      return false;
    }
    const value = rowData[column];
      if (value === null || value === undefined) {
        return false;
      }
      if (!variant.grid.digits.includes(value)) {
        return false;
      }
    }
  }
  return validateBoard(variant, board);
}
