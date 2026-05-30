import { BOX_SIZE, GRID_SIZE } from "../constants/board.js";
import { BitGrid, maskToDigits } from "../internal/bitgrid.js";
import { shuffle } from "../utils/random.js";

export function fillDiagonalBoxes(grid: BitGrid): void {
  for (let box = 0; box < GRID_SIZE; box += BOX_SIZE) {
    fillBox(grid, box, box);
  }
}

function fillBox(grid: BitGrid, row: number, column: number): void {
  const nums = shuffle(maskToDigits(0x1ff));
  let index = 0;
  for (let r = 0; r < BOX_SIZE; r++) {
    for (let c = 0; c < BOX_SIZE; c++) {
      grid.place(row + r, column + c, nums[index++]!);
    }
  }
}

export function fillRemaining(
  grid: BitGrid,
  row: number,
  column: number,
): boolean {
  if (row === GRID_SIZE) {
    return true;
  }
  if (column === GRID_SIZE) {
    return fillRemaining(grid, row + 1, 0);
  }
  if (grid.cells[grid.index(row, column)] !== 0) {
    return fillRemaining(grid, row, column + 1);
  }

  const digits = shuffle(maskToDigits(grid.candidateMaskAt(row, column)));
  for (const digit of digits) {
    grid.place(row, column, digit);
    if (fillRemaining(grid, row, column + 1)) {
      return true;
    }
    grid.clear(row, column);
  }

  return false;
}
