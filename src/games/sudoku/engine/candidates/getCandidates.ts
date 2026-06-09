import { getClassicEngine } from "../core/engine.js";
import type { Board } from "../types/board.js";

const engine = getClassicEngine();

export function getCandidates(
  board: Board,
  row: number,
  column: number,
): number[] {
  return engine.getCandidates(board, row, column);
}
