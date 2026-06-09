import { getClassicEngine } from "../core/engine.js";
import type { Board } from "../types/board.js";

const engine = getClassicEngine();

export function createEmptyBoard(): Board {
  return engine.createEmptyBoard();
}

export function cloneBoard(board: Board): Board {
  return engine.cloneBoard(board);
}

export function isValidBoardShape(board: unknown): board is Board {
  return engine.isValidBoardShape(board);
}

export function countClues(board: Board): number {
  return engine.countClues(board);
}

export function boardsEqual(a: Board, b: Board): boolean {
  return engine.boardsEqual(a, b);
}

export function allCellCoordinates(): { row: number; column: number }[] {
  return engine.allCellCoordinates();
}

export function boardToString(board: Board): string {
  return engine.boardToString(board);
}

export function stringToBoard(serialized: string): Board | null {
  return engine.stringToBoard(serialized);
}
