import { CLUE_RANGES } from "../constants/difficulty.js";
import { countClues } from "../utils/board.js";
import type { Board } from "../types/board.js";
import type { Difficulty } from "../types/difficulty.js";

export function rateDifficulty(board: Board): Difficulty {
  const clueCount = countClues(board);
  if (clueCount >= CLUE_RANGES.easy.min) {
    return "easy";
  }
  if (clueCount >= CLUE_RANGES.medium.min) {
    return "medium";
  }
  if (clueCount >= CLUE_RANGES.hard.min) {
    return "hard";
  }
  return "expert";
}
