import type { Board } from "../types/board.js";
import { GRID_SIZE } from "../constants/board.js";
import { shuffle } from "../utils/random.js";
import { isGiven } from "./isGiven.js";
import { revealCell, type RevealResult } from "./revealCell.js";

export function revealRandom(
  board: Board,
  solution: Board,
  puzzle?: Board,
): RevealResult | null {
  const targets: { row: number; column: number }[] = [];

  for (let row = 0; row < GRID_SIZE; row++) {
    for (let column = 0; column < GRID_SIZE; column++) {
      if (puzzle && isGiven(puzzle, row, column)) {
        continue;
      }
      if (board[row]![column] !== solution[row]![column]) {
        targets.push({ row, column });
      }
    }
  }

  if (targets.length === 0) {
    return null;
  }

  const pick = shuffle(targets)[0]!;
  return revealCell(board, solution, pick.row, pick.column, puzzle);
}
