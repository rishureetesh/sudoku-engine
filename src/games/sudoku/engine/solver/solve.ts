import { getClassicEngine } from "../core/engine.js";
import type { Board } from "../types/board.js";
import type { SolverResult } from "../types/difficulty.js";

const engine = getClassicEngine();

export function solve(board: Board): SolverResult {
  return engine.solve(board);
}
