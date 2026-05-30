import type { Board } from "../types/board.js";
import type { EmptyCell } from "../types/cell.js";
import { GRID_SIZE } from "../constants/board.js";
import { assertInBounds } from "../utils/coordinates.js";

export function isGiven(puzzle: Board, row: number, column: number): boolean {
  assertInBounds(row, column);
  return puzzle[row]![column] !== null;
}

export function getGivenCells(puzzle: Board): EmptyCell[] {
  const cells: EmptyCell[] = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let column = 0; column < GRID_SIZE; column++) {
      if (isGiven(puzzle, row, column)) {
        cells.push({ row, column });
      }
    }
  }
  return cells;
}
