import { getClassicEngine } from "../core/engine.js";
import type { Board } from "../types/board.js";
import type { Difficulty } from "../types/difficulty.js";
import type { TechniqueAnalysis } from "../core/difficulty.js";

export type { TechniqueAnalysis } from "../core/difficulty.js";

const engine = getClassicEngine();

export function rateDifficultyByTechniques(board: Board): Difficulty {
  return engine.rateDifficultyByTechniques(board);
}

export function analyzeTechniques(board: Board): TechniqueAnalysis {
  return engine.analyzeTechniques(board);
}
