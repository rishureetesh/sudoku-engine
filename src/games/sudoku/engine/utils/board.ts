import { CELL_COUNT, GRID_SIZE } from "../constants/board.js";
import type { Board } from "../types/board.js";
import type { CellValue, Digit } from "../types/cell.js";
import { isDigit } from "./cell.js";

export function createEmptyBoard(): Board {
  return Array.from({ length: GRID_SIZE }, () =>
    Array.from<CellValue>({ length: GRID_SIZE }).fill(null),
  );
}

export function cloneBoard(board: Board): Board {
  return board.map((row) => [...row]);
}

export function isValidBoardShape(board: unknown): board is Board {
  if (!Array.isArray(board) || board.length !== GRID_SIZE) {
    return false;
  }
  return board.every(
    (row) =>
      Array.isArray(row) &&
      row.length === GRID_SIZE &&
      row.every(
        (cell) =>
          cell === null ||
          (typeof cell === "number" && isDigit(cell as CellValue)),
      ),
  );
}

export function countClues(board: Board): number {
  let count = 0;
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (board[r]![c] !== null) {
        count++;
      }
    }
  }
  return count;
}

export function boardsEqual(a: Board, b: Board): boolean {
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (a[r]![c] !== b[r]![c]) {
        return false;
      }
    }
  }
  return true;
}

export function allCellCoordinates(): { row: number; column: number }[] {
  const coords: { row: number; column: number }[] = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let column = 0; column < GRID_SIZE; column++) {
      coords.push({ row, column });
    }
  }
  return coords;
}

export function boardToString(board: Board): string {
  return board
    .map((row) =>
      row.map((cell) => (cell === null ? "0" : String(cell))).join(""),
    )
    .join("");
}

export function stringToBoard(serialized: string): Board | null {
  const flat = serialized.replace(/[^0-9.]/g, "").replace(/\./g, "0");
  if (flat.length !== CELL_COUNT) {
    return null;
  }

  const board = createEmptyBoard();
  for (let i = 0; i < CELL_COUNT; i++) {
    const ch = flat[i]!;
    const row = Math.floor(i / GRID_SIZE);
    const column = i % GRID_SIZE;
    if (ch === "0") {
      board[row]![column] = null;
      continue;
    }
    const digit = Number(ch);
    if (!isDigit(digit as CellValue)) {
      return null;
    }
    board[row]![column] = digit as Digit;
  }
  return board;
}
