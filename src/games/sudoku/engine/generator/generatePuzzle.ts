import { getClassicEngine } from "../core/engine.js";
import type { Board } from "../types/board.js";
import type { Difficulty, GeneratedPuzzle } from "../types/difficulty.js";
import type { GeneratePuzzleOptions } from "../types/generator.js";

const engine = getClassicEngine();

export function generatePuzzle(
  difficulty: Difficulty,
  options?: GeneratePuzzleOptions,
): GeneratedPuzzle | null {
  return engine.generatePuzzle(difficulty, options);
}

export function removeCells(
  solution: Board,
  targetClues: number,
  maxAttempts: number,
): Board | null {
  return engine.removeCells(solution, targetClues, maxAttempts);
}

export function removeCellsSymmetric(
  solution: Board,
  targetClues: number,
  maxAttempts: number,
): Board | null {
  return engine.removeCellsSymmetric(solution, targetClues, maxAttempts);
}
