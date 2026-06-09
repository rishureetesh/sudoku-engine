import { getClassicEngine } from "../core/engine.js";
import type { Board } from "../types/board.js";

const engine = getClassicEngine();

export function generateSolvedBoard(): Board {
  return engine.generateSolvedBoard();
}
