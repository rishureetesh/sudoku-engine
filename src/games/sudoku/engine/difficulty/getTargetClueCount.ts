import { getClassicEngine } from "../core/engine.js";
import type { Difficulty } from "../types/difficulty.js";

const engine = getClassicEngine();

export function getTargetClueCount(difficulty: Difficulty): number {
  return engine.getTargetClueCount(difficulty);
}

export function isClueCountInRange(
  difficulty: Difficulty,
  clueCount: number,
): boolean {
  return engine.isClueCountInRange(difficulty, clueCount);
}
