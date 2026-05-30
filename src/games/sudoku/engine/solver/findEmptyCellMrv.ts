import type { Board } from "../types/board.js";
import type { EmptyCell } from "../types/cell.js";
import { candidateMask, popcount } from "../internal/bitgrid.js";
import { GRID_SIZE } from "../constants/board.js";
import { isEmptyCell } from "../utils/cell.js";

export function findEmptyCellMrv(board: Board): EmptyCell | null {
  let best: EmptyCell | null = null;
  let minCandidates = 10;

  for (let row = 0; row < GRID_SIZE; row++) {
    for (let column = 0; column < GRID_SIZE; column++) {
      if (!isEmptyCell(board[row]![column]!)) {
        continue;
      }
      const size = popcount(candidateMask(board, row, column));
      if (size < minCandidates) {
        minCandidates = size;
        best = { row, column };
        if (size <= 1) {
          return best;
        }
      }
    }
  }

  return best;
}
