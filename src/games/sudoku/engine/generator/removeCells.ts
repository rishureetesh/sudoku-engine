import { allCellCoordinates, countClues } from "../utils/board.js";
import { shuffle } from "../utils/random.js";
import type { Board } from "../types/board.js";
import { BitGrid } from "../internal/bitgrid.js";
import { countSolutionsBitGrid } from "../solver/countSolutions.js";

export function removeCells(
  solution: Board,
  targetClues: number,
  maxAttempts: number,
): Board | null {
  const grid = BitGrid.fromBoard(solution);
  const cells = shuffle(allCellCoordinates());
  let clues = countClues(solution);
  let attempts = 0;

  for (const { row, column } of cells) {
    if (clues <= targetClues) {
      break;
    }
    if (grid.cells[grid.index(row, column)] === 0) {
      continue;
    }

    const backup = grid.cells[grid.index(row, column)]!;
    grid.clear(row, column);
    attempts++;

    if (countSolutionsBitGrid(grid, 2) !== 1) {
      grid.place(row, column, backup);
    } else {
      clues--;
    }

    if (attempts > maxAttempts) {
      break;
    }
  }

  return grid.toBoard();
}
