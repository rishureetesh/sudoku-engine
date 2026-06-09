import { getClassicEngine } from "../core/engine.js";
import type { Board } from "../types/board.js";

const engine = getClassicEngine();

export function isValidMove(
  board: Board,
  row: number,
  column: number,
  value: number,
): boolean {
  return engine.isValidMove(board, row, column, value);
}
