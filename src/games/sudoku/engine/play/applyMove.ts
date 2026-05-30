import type { Board } from "../types/board.js";
import type { CellValue } from "../types/cell.js";
import { assertInBounds } from "../utils/coordinates.js";
import { boardsEqual, cloneBoard } from "../utils/board.js";
import { isDigit, isEmptyCell } from "../utils/cell.js";
import { isGiven } from "../hints/isGiven.js";
import { isValidMove } from "../validation/isValidMove.js";

export interface ApplyMoveResult {
  readonly success: boolean;
  readonly board: Board;
  readonly reason?: string;
}

export function applyMove(
  board: Board,
  row: number,
  column: number,
  value: CellValue,
  puzzle?: Board,
): ApplyMoveResult {
  assertInBounds(row, column);

  if (puzzle && isGiven(puzzle, row, column)) {
    return {
      success: false,
      board,
      reason: "That cell is a given.",
    };
  }

  if (value !== null && !isDigit(value)) {
    return {
      success: false,
      board,
      reason: "Value must be 1–9 or null.",
    };
  }

  if (value !== null && !isValidMove(board, row, column, value)) {
    return {
      success: false,
      board,
      reason: "Digit already in that row, column, or box.",
    };
  }

  const next = cloneBoard(board);
  next[row]![column] = value;
  return { success: true, board: next };
}

export function isBoardComplete(board: Board): boolean {
  for (let row = 0; row < 9; row++) {
    for (let column = 0; column < 9; column++) {
      if (isEmptyCell(board[row]![column]!)) {
        return false;
      }
    }
  }
  return true;
}

export function isSolvedCorrectly(board: Board, solution: Board): boolean {
  return isBoardComplete(board) && boardsEqual(board, solution);
}
