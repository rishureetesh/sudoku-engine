import { getClassicEngine } from "../core/engine.js";
import type { Board } from "../types/board.js";
import type { Difficulty } from "../types/difficulty.js";

const engine = getClassicEngine();

export function rateDifficulty(board: Board): Difficulty {
  return engine.rateDifficulty(board);
}
