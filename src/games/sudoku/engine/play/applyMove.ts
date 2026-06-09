import { getClassicEngine } from "../core/engine.js";
import type { Board } from "../types/board.js";
import type { CellValue } from "../types/cell.js";

export interface ApplyMoveResult {
  readonly success: boolean;
  readonly board: Board;
  readonly reason?: string;
}

const engine = getClassicEngine();

export function applyMove(
  board: Board,
  row: number,
  column: number,
  value: CellValue,
  puzzle?: Board,
): ApplyMoveResult {
  return engine.applyMove(board, row, column, value, puzzle);
}

export function isBoardComplete(board: Board): boolean {
  return engine.isBoardComplete(board);
}

export function isSolvedCorrectly(board: Board, solution: Board): boolean {
  return engine.isSolvedCorrectly(board, solution);
}
