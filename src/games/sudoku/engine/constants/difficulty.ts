import type { Difficulty } from "../types/difficulty.js";

export const MIN_CLUES = 17;
export const MAX_BATCH_SIZE = 1000;

export const DIFFICULTIES: readonly Difficulty[] = [
  "easy",
  "medium",
  "hard",
  "expert",
] as const;

export const CLUE_RANGES: Readonly<
  Record<Difficulty, { readonly min: number; readonly max: number }>
> = {
  easy: { min: 40, max: 45 },
  medium: { min: 32, max: 39 },
  hard: { min: 26, max: 31 },
  expert: { min: 22, max: 25 },
};
