import type { Board } from "../types/board.js";
import { cellIndex, type GridSpec } from "./grid-spec.js";
import { isValidDigit } from "./mask.js";
import type { SudokuVariant } from "./variant.js";

export type { Board };

export function createEmptyBoard(variant: SudokuVariant): Board {
  return Array.from({ length: variant.grid.size }, () =>
    Array.from<number | null>({ length: variant.grid.size }).fill(null),
  );
}

export function cloneBoard(board: Board): Board {
  return board.map((row) => [...row]);
}

export function isValidBoardShape(
  variant: SudokuVariant,
  board: unknown,
): board is Board {
  if (!Array.isArray(board) || board.length !== variant.grid.size) {
    return false;
  }

  return board.every(
    (row) =>
      Array.isArray(row) &&
      row.length === variant.grid.size &&
      row.every(
        (cell) =>
          cell === null ||
          (typeof cell === "number" && isValidDigit(variant.grid, cell)),
      ),
  );
}

export function countClues(board: Board): number {
  let count = 0;
  for (const row of board) {
    for (const cell of row) {
      if (cell !== null) {
        count++;
      }
    }
  }
  return count;
}

export function boardsEqual(a: Board, b: Board): boolean {
  if (a.length !== b.length) {
    return false;
  }

  for (let row = 0; row < a.length; row++) {
    if (a[row]!.length !== b[row]!.length) {
      return false;
    }
    for (let column = 0; column < a[row]!.length; column++) {
      if (a[row]![column] !== b[row]![column]) {
        return false;
      }
    }
  }

  return true;
}

export function allCellCoordinates(
  variant: SudokuVariant,
): { row: number; column: number }[] {
  const coords: { row: number; column: number }[] = [];
  for (let row = 0; row < variant.grid.size; row++) {
    for (let column = 0; column < variant.grid.size; column++) {
      coords.push({ row, column });
    }
  }
  return coords;
}

export function boardToString(variant: SudokuVariant, board: Board): string {
  return board
    .map((row) =>
      row.map((cell) => (cell === null ? "0" : String(cell))).join(""),
    )
    .join("");
}

export function stringToBoard(
  variant: SudokuVariant,
  serialized: string,
): Board | null {
  const flat = serialized.replace(/[^0-9.]/g, "").replace(/\./g, "0");
  if (flat.length !== variant.grid.cellCount) {
    return null;
  }

  const board = createEmptyBoard(variant);
  for (let index = 0; index < variant.grid.cellCount; index++) {
    const ch = flat[index]!;
    const row = Math.floor(index / variant.grid.size);
    const column = index % variant.grid.size;
    if (ch === "0") {
      board[row]![column] = null;
      continue;
    }
    const digit = Number(ch);
    if (!isValidDigit(variant.grid, digit)) {
      return null;
    }
    board[row]![column] = digit;
  }

  return board;
}

export function isInBounds(
  variant: SudokuVariant,
  row: number,
  column: number,
): boolean {
  return (
    Number.isInteger(row) &&
    Number.isInteger(column) &&
    row >= 0 &&
    row < variant.grid.size &&
    column >= 0 &&
    column < variant.grid.size
  );
}

export function mirrorCell(
  variant: SudokuVariant,
  row: number,
  column: number,
): { row: number; column: number } {
  const last = variant.grid.size - 1;
  return { row: last - row, column: last - column };
}

export function cellCoordinatesFromIndex(
  grid: GridSpec,
  index: number,
): { row: number; column: number } {
  return {
    row: Math.floor(index / grid.size),
    column: index % grid.size,
  };
}

export function indexFromCell(
  grid: GridSpec,
  row: number,
  column: number,
): number {
  return cellIndex(grid, row, column);
}
