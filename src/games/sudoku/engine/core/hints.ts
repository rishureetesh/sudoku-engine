import { randomInt } from "../utils/random.js";
import type { CellDisplayState } from "../hints/cellState.js";
import type { RevealResult } from "../hints/revealCell.js";
import type { Board } from "./board.js";
import { assertInBounds } from "./play.js";
import { cloneBoard } from "./board.js";
import type { SudokuVariant } from "./variant.js";

export function isGiven(
  puzzle: Board,
  row: number,
  column: number,
): boolean {
  return puzzle[row]![column] !== null;
}

export function getGivenCells(
  variant: SudokuVariant,
  puzzle: Board,
): { row: number; column: number }[] {
  const cells: { row: number; column: number }[] = [];
  for (let row = 0; row < variant.grid.size; row++) {
    for (let column = 0; column < variant.grid.size; column++) {
      if (isGiven(puzzle, row, column)) {
        cells.push({ row, column });
      }
    }
  }
  return cells;
}

export function revealCell(
  variant: SudokuVariant,
  board: Board,
  solution: Board,
  row: number,
  column: number,
  puzzle?: Board,
): RevealResult | null {
  assertInBounds(variant, row, column);

  if (puzzle && isGiven(puzzle, row, column)) {
    return null;
  }

  const value = solution[row]![column] ?? null;
  if (value === null || board[row]![column] === value) {
    return null;
  }

  const next = cloneBoard(board);
  next[row]![column] = value;

  return { board: next, row, column, value };
}

export function revealNext(
  variant: SudokuVariant,
  board: Board,
  solution: Board,
  puzzle?: Board,
): RevealResult | null {
  for (let row = 0; row < variant.grid.size; row++) {
    for (let column = 0; column < variant.grid.size; column++) {
      if (puzzle && isGiven(puzzle, row, column)) {
        continue;
      }
      if (board[row]![column] !== solution[row]![column]) {
        return revealCell(variant, board, solution, row, column, puzzle);
      }
    }
  }
  return null;
}

export function revealRandom(
  variant: SudokuVariant,
  board: Board,
  solution: Board,
  puzzle?: Board,
): RevealResult | null {
  const candidates: { row: number; column: number }[] = [];

  for (let row = 0; row < variant.grid.size; row++) {
    for (let column = 0; column < variant.grid.size; column++) {
      if (puzzle && isGiven(puzzle, row, column)) {
        continue;
      }
      if (board[row]![column] !== solution[row]![column]) {
        candidates.push({ row, column });
      }
    }
  }

  if (candidates.length === 0) {
    return null;
  }

  const pick = candidates[randomInt(candidates.length)]!;
  return revealCell(
    variant,
    board,
    solution,
    pick.row,
    pick.column,
    puzzle,
  );
}

export function getCellDisplayState(
  puzzle: Board,
  board: Board,
  solution: Board,
  row: number,
  column: number,
): CellDisplayState {
  if (isGiven(puzzle, row, column)) {
    return "given";
  }

  const value = board[row]![column];
  if (value === null) {
    return "empty";
  }

  if (value !== solution[row]![column]) {
    return "incorrect";
  }

  return "player";
}
