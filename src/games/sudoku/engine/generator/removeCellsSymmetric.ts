import { allCellCoordinates, countClues } from "../utils/board.js";
import { shuffle } from "../utils/random.js";
import type { Board } from "../types/board.js";
import { BitGrid } from "../internal/bitgrid.js";
import { countSolutionsBitGrid } from "../solver/countSolutions.js";

const LAST = 8;

function mirror(row: number, column: number): { row: number; column: number } {
  return { row: LAST - row, column: LAST - column };
}

export function removeCellsSymmetric(
  solution: Board,
  targetClues: number,
  maxAttempts: number,
): Board | null {
  const grid = BitGrid.fromBoard(solution);
  const pairs: { row: number; column: number }[][] = [];
  const seen = new Set<string>();

  for (const cell of allCellCoordinates()) {
    const key = `${cell.row},${cell.column}`;
    const mate = mirror(cell.row, cell.column);
    const mateKey = `${mate.row},${mate.column}`;
    const pairKey = [key, mateKey].sort().join("|");
    if (seen.has(pairKey)) {
      continue;
    }
    seen.add(pairKey);
    if (key === mateKey) {
      pairs.push([cell]);
    } else {
      pairs.push([cell, mate]);
    }
  }

  const order = shuffle(pairs);
  let clues = countClues(solution);
  let attempts = 0;

  for (const group of order) {
    if (clues <= targetClues) {
      break;
    }

    const backups = group.map((c) => grid.cells[grid.index(c.row, c.column)]!);
    if (!backups.every((v) => v !== 0)) {
      continue;
    }

    for (const cell of group) {
      grid.clear(cell.row, cell.column);
    }
    attempts++;

    if (countSolutionsBitGrid(grid, 2) !== 1) {
      for (let i = 0; i < group.length; i++) {
        const cell = group[i]!;
        grid.place(cell.row, cell.column, backups[i]!);
      }
    } else {
      clues -= group.length;
    }

    if (attempts > maxAttempts) {
      break;
    }
  }

  return grid.toBoard();
}
