import { getClassicEngine } from "../core/engine.js";
import type { Board } from "../types/board.js";

const engine = getClassicEngine();

export function isGiven(puzzle: Board, row: number, column: number): boolean {
  return engine.isGiven(puzzle, row, column);
}

export function getGivenCells(puzzle: Board): { row: number; column: number }[] {
  return engine.getGivenCells(puzzle);
}
