import type { Difficulty, GeneratedPuzzle } from "../types/difficulty.js";
import { generateOne } from "../batch/SudokuEngine.js";

export function dateToSeed(date: string | Date): number {
  const text =
    typeof date === "string" ? date : date.toISOString().slice(0, 10);
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
  }
  return hash || 1;
}

export function dailyPuzzle(
  date: string | Date,
  difficulty: Difficulty = "medium",
): GeneratedPuzzle {
  return generateOne({ difficulty, seed: dateToSeed(date) });
}
