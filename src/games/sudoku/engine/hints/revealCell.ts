import { getClassicEngine } from "../core/engine.js";
import type { Board } from "../types/board.js";
import type { Digit } from "../types/cell.js";

export interface RevealResult {
  readonly board: Board;
  readonly row: number;
  readonly column: number;
  readonly value: Digit;
}

const engine = getClassicEngine();

export function revealCell(
  board: Board,
  solution: Board,
  row: number,
  column: number,
  puzzle?: Board,
): RevealResult | null {
  const result = engine.revealCell(board, solution, row, column, puzzle);
  if (!result) {
    return null;
  }
  return {
    ...result,
    value: result.value as Digit,
  };
}
