import { BOX_SIZE, GRID_SIZE } from "../constants/board.js";
import type { Board } from "../types/board.js";
import { validateBox } from "./validateBox.js";
import { validateColumn } from "./validateColumn.js";
import { validateRow } from "./validateRow.js";

export function validateBoard(board: Board): boolean {
  if (!Array.isArray(board) || board.length !== GRID_SIZE) {
    return false;
  }

  for (let row = 0; row < GRID_SIZE; row++) {
    if (!validateRow(board, row)) {
      return false;
    }
  }

  for (let column = 0; column < GRID_SIZE; column++) {
    if (!validateColumn(board, column)) {
      return false;
    }
  }

  for (let boxRow = 0; boxRow < GRID_SIZE; boxRow += BOX_SIZE) {
    for (let boxColumn = 0; boxColumn < GRID_SIZE; boxColumn += BOX_SIZE) {
      if (!validateBox(board, boxRow, boxColumn)) {
        return false;
      }
    }
  }

  return true;
}
