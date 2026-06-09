import { getClassicEngine } from "../core/engine.js";
import type { Board } from "../types/board.js";

const engine = getClassicEngine();

export function removeCells(
  solution: Board,
  targetClues: number,
  maxAttempts: number,
): Board | null {
  return engine.removeCells(solution, targetClues, maxAttempts);
}
