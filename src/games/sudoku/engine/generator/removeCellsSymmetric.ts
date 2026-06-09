import { getClassicEngine } from "../core/engine.js";
import type { Board } from "../types/board.js";

const engine = getClassicEngine();

export function removeCellsSymmetric(
  solution: Board,
  targetClues: number,
  maxAttempts: number,
): Board | null {
  return engine.removeCellsSymmetric(solution, targetClues, maxAttempts);
}
