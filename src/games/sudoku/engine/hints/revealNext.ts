import { getClassicEngine } from "../core/engine.js";
import type { Board } from "../types/board.js";
import type { RevealResult } from "./revealCell.js";

const engine = getClassicEngine();

export function revealNext(
  board: Board,
  solution: Board,
  puzzle?: Board,
): RevealResult | null {
  const result = engine.revealNext(board, solution, puzzle);
  if (!result) {
    return null;
  }
  return result as RevealResult;
}
