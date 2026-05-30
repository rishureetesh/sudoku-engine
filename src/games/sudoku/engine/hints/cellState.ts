import type { Board } from "../types/board.js";
import { isGiven } from "./isGiven.js";

export type CellDisplayState =
  | "given"
  | "empty"
  | "player"
  | "incorrect";

export function getCellDisplayState(
  puzzle: Board,
  board: Board,
  solution: Board,
  row: number,
  column: number,
): CellDisplayState {
  if (isGiven(puzzle, row, column)) {
    return "given";
  }

  const value = board[row]![column];
  if (value === null) {
    return "empty";
  }

  if (value !== solution[row]![column]) {
    return "incorrect";
  }

  return "player";
}
