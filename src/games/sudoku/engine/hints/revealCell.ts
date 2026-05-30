import type { Board } from "../types/board.js";
import type { Digit } from "../types/cell.js";
import { assertInBounds } from "../utils/coordinates.js";
import { cloneBoard } from "../utils/board.js";
import { isGiven } from "./isGiven.js";

export interface RevealResult {
  readonly board: Board;
  readonly row: number;
  readonly column: number;
  readonly value: Digit;
}

export function revealCell(
  board: Board,
  solution: Board,
  row: number,
  column: number,
  puzzle?: Board,
): RevealResult | null {
  assertInBounds(row, column);

  if (puzzle && isGiven(puzzle, row, column)) {
    return null;
  }

  const value = solution[row]![column] ?? null;
  if (value === null) {
    return null;
  }

  if (board[row]![column] === value) {
    return null;
  }

  const next = cloneBoard(board);
  next[row]![column] = value as Digit;

  return { board: next, row, column, value: value as Digit };
}
