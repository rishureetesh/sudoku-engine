import { SudokuEngineError } from "../batch/errors.js";
import type { ApplyMoveResult } from "../play/applyMove.js";
import type { Board } from "./board.js";
import { cloneBoard, isInBounds } from "./board.js";
import type { SudokuVariant } from "./variant.js";
import { isValidMove } from "./validation.js";

export function assertInBounds(
  variant: SudokuVariant,
  row: number,
  column: number,
): void {
  if (!isInBounds(variant, row, column)) {
    throw new SudokuEngineError(
      `Row/column out of range (0–${variant.grid.size - 1}): (${row}, ${column})`,
    );
  }
}

export function applyMove(
  variant: SudokuVariant,
  board: Board,
  row: number,
  column: number,
  value: number | null,
  puzzle?: Board,
): ApplyMoveResult {
  assertInBounds(variant, row, column);

  if (puzzle && puzzle[row]![column] !== null) {
    return {
      success: false,
      board,
      reason: "That cell is a given.",
    };
  }

  if (value !== null && !variant.grid.digits.includes(value)) {
    return {
      success: false,
      board,
      reason: `Value must be ${variant.grid.digits.join("–")} or null.`,
    };
  }

  if (value !== null && !isValidMove(variant, board, row, column, value)) {
    return {
      success: false,
      board,
      reason: "Digit conflicts with a house (row, column, box, or diagonal).",
    };
  }

  const next = cloneBoard(board);
  next[row]![column] = value;
  return { success: true, board: next };
}

export function isBoardComplete(variant: SudokuVariant, board: Board): boolean {
  for (let row = 0; row < variant.grid.size; row++) {
    for (let column = 0; column < variant.grid.size; column++) {
      if (board[row]![column] === null) {
        return false;
      }
    }
  }
  return true;
}

export function isSolvedCorrectly(
  variant: SudokuVariant,
  board: Board,
  solution: Board,
): boolean {
  return isBoardComplete(variant, board) && boardsEqual(board, solution);
}

function boardsEqual(a: Board, b: Board): boolean {
  for (let row = 0; row < a.length; row++) {
    for (let column = 0; column < a[row]!.length; column++) {
      if (a[row]![column] !== b[row]![column]) {
        return false;
      }
    }
  }
  return true;
}
