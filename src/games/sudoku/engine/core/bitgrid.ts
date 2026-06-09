import { SudokuEngineError } from "../batch/errors.js";
import { cellIndex, indexToColumn, indexToRow, type GridSpec } from "./grid-spec.js";
import { digitBit, isValidDigit, maskToDigits, popcount } from "./mask.js";
import type { SudokuVariant } from "./variant.js";
import { createEmptyBoard, isValidBoardShape, type Board } from "./board.js";
export class BitGrid {
  readonly cells: Uint8Array;
  readonly houseMasks: Uint16Array;

  private constructor(
    readonly variant: SudokuVariant,
    cells: Uint8Array,
    houseMasks: Uint16Array,
  ) {
    this.cells = cells;
    this.houseMasks = houseMasks;
  }

  static empty(variant: SudokuVariant): BitGrid {
    return new BitGrid(
      variant,
      new Uint8Array(variant.grid.cellCount),
      new Uint16Array(variant.houses.houses.length),
    );
  }

  static fromBoard(variant: SudokuVariant, board: Board): BitGrid {
    if (!isValidBoardShape(variant, board)) {
      throw new SudokuEngineError("Board shape or digit range is invalid.");
    }

    const grid = BitGrid.empty(variant);
    for (let row = 0; row < variant.grid.size; row++) {
      for (let column = 0; column < variant.grid.size; column++) {
        const value = board[row]![column] ?? null;
        if (value !== null) {
          grid.place(row, column, value);
        }
      }
    }
    return grid;
  }
  get grid(): GridSpec {
    return this.variant.grid;
  }

  index(row: number, column: number): number {
    return cellIndex(this.variant.grid, row, column);
  }

  toBoard(): Board {
    const board = createEmptyBoard(this.variant);
    for (let row = 0; row < this.variant.grid.size; row++) {
      for (let column = 0; column < this.variant.grid.size; column++) {
        const value = this.cells[this.index(row, column)]!;
        if (value !== 0) {
          board[row]![column] = value;
        }
      }
    }
    return board;
  }

  place(row: number, column: number, digit: number): void {
    if (!isValidDigit(this.variant.grid, digit)) {
      throw new SudokuEngineError(`Digit must be one of ${this.variant.grid.digits.join(", ")}.`);
    }

    const cell = this.index(row, column);
    if (this.cells[cell] !== 0) {
      this.clear(row, column);
    }

    const bit = digitBit(digit);
    this.cells[cell] = digit;
    for (const houseIndex of this.variant.houses.cellHouses[cell]!) {
      this.houseMasks[houseIndex] = (this.houseMasks[houseIndex]! | bit) as number;
    }
  }

  clear(row: number, column: number): void {
    const cell = this.index(row, column);
    const digit = this.cells[cell]!;
    if (digit === 0) {
      return;
    }

    const bit = digitBit(digit);
    this.cells[cell] = 0;

    for (const houseIndex of this.variant.houses.cellHouses[cell]!) {
      this.houseMasks[houseIndex] = (this.houseMasks[houseIndex]! & ~bit) as number;
    }
  }

  candidateMaskAt(row: number, column: number): number {
    const cell = this.index(row, column);
    if (this.cells[cell] !== 0) {
      return 0;
    }

    let used = 0;
    for (const houseIndex of this.variant.houses.cellHouses[cell]!) {
      used |= this.houseMasks[houseIndex]!;
    }

    return this.variant.grid.fullMask & ~used;
  }

  findMrv(): { row: number; column: number; mask: number } | null {
    let bestRow = 0;
    let bestColumn = 0;
    let bestMask = 0;
    let bestSize = this.variant.grid.digitCount + 1;

    for (let index = 0; index < this.variant.grid.cellCount; index++) {
      if (this.cells[index] !== 0) {
        continue;
      }

      const row = indexToRow(this.variant.grid, index);
      const column = indexToColumn(this.variant.grid, index);
      const mask = this.candidateMaskAt(row, column);
      const size = popcount(mask);

      if (size < bestSize) {
        bestSize = size;
        bestRow = row;
        bestColumn = column;
        bestMask = mask;
        if (size <= 1) {
          return { row, column, mask };
        }
      }
    }

    if (bestSize === this.variant.grid.digitCount + 1) {
      return null;
    }

    return { row: bestRow, column: bestColumn, mask: bestMask };
  }

  isComplete(): boolean {
    for (let index = 0; index < this.variant.grid.cellCount; index++) {
      if (this.cells[index] === 0) {
        return false;
      }
    }
    return true;
  }

  clone(): BitGrid {
    return new BitGrid(
      this.variant,
      new Uint8Array(this.cells),
      new Uint16Array(this.houseMasks),
    );
  }
}

export function peerUsedMask(
  variant: SudokuVariant,
  board: Board,
  row: number,
  column: number,
): number {
  let used = 0;
  const cell = cellIndex(variant.grid, row, column);

  for (const houseIndex of variant.houses.cellHouses[cell]!) {
    for (const peerCell of variant.houses.houses[houseIndex]!.cells) {
      if (peerCell === cell) {
        continue;
      }
      const peerRow = indexToRow(variant.grid, peerCell);
      const peerColumn = indexToColumn(variant.grid, peerCell);
      const value = board[peerRow]![peerColumn] ?? null;
      if (value !== null) {
        used |= digitBit(value);
      }
    }
  }

  return used;
}

export function candidateMask(
  variant: SudokuVariant,
  board: Board,
  row: number,
  column: number,
): number {
  if (board[row]![column] !== null) {
    return 0;
  }
  return variant.grid.fullMask & ~peerUsedMask(variant, board, row, column);
}

export { maskToDigits };
