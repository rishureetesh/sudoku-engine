import { GRID_SIZE } from "../constants/board.js";
import type { Board } from "../types/board.js";
import { isGiven } from "./isGiven.js";
import { revealCell, type RevealResult } from "./revealCell.js";

export function revealNext(
  board: Board,
  solution: Board,
  puzzle?: Board,
): RevealResult | null {
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let column = 0; column < GRID_SIZE; column++) {
      if (puzzle && isGiven(puzzle, row, column)) {
        continue;
      }
      if (board[row]![column] !== solution[row]![column]) {
        return revealCell(board, solution, row, column, puzzle);
      }
    }
  }
  return null;
}
