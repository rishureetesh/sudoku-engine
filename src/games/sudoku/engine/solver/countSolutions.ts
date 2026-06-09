export { countSolutionsBitGrid } from "../core/solver.js";
import { getClassicEngine } from "../core/engine.js";
import type { Board } from "../types/board.js";

const engine = getClassicEngine();

export function countSolutions(board: Board, limit?: number): number {
  return engine.countSolutions(board, limit);
}

export function hasUniqueSolution(board: Board): boolean {
  return engine.hasUniqueSolution(board);
}
