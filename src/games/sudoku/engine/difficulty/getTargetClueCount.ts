import { CLUE_RANGES } from "../constants/difficulty.js";
import { randomInt } from "../utils/random.js";
import type { Difficulty } from "../types/difficulty.js";

export function getTargetClueCount(difficulty: Difficulty): number {
  const range = CLUE_RANGES[difficulty];
  const span = range.max - range.min + 1;
  return range.min + randomInt(span);
}

export function isClueCountInRange(
  difficulty: Difficulty,
  clueCount: number,
): boolean {
  const range = CLUE_RANGES[difficulty];
  return clueCount >= range.min && clueCount <= range.max;
}
