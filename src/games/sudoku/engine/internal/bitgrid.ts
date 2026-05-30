import { BOX_SIZE, GRID_SIZE } from "../constants/board.js";
import type { Board } from "../types/board.js";
import type { Digit } from "../types/cell.js";
import { createEmptyBoard } from "../utils/board.js";

export const FULL_MASK = 0x1ff;

export function digitBit(digit: number): number {
  return 1 << (digit - 1);
}

export function boxIndex(row: number, column: number): number {
  return Math.floor(row / BOX_SIZE) * BOX_SIZE + Math.floor(column / BOX_SIZE);
}

export function popcount(mask: number): number {
  let count = 0;
  let m = mask;
  while (m) {
    count++;
    m &= m - 1;
  }
  return count;
}

export function maskToDigits(mask: number): number[] {
  const digits: number[] = [];
  for (let d = 1; d <= 9; d++) {
    if (mask & digitBit(d)) {
      digits.push(d);
    }
  }
  return digits;
}

export function peerUsedMask(board: Board, row: number, column: number): number {
  let used = 0;
  for (let c = 0; c < GRID_SIZE; c++) {
    const v = board[row]![c] ?? null;
    if (v !== null) {
      used |= digitBit(v);
    }
  }
  for (let r = 0; r < GRID_SIZE; r++) {
    const v = board[r]![column] ?? null;
    if (v !== null) {
      used |= digitBit(v);
    }
  }
  const br = Math.floor(row / BOX_SIZE) * BOX_SIZE;
  const bc = Math.floor(column / BOX_SIZE) * BOX_SIZE;
  for (let r = br; r < br + BOX_SIZE; r++) {
    for (let c = bc; c < bc + BOX_SIZE; c++) {
      const v = board[r]![c] ?? null;
      if (v !== null) {
        used |= digitBit(v);
      }
    }
  }
  return used;
}

export function candidateMask(board: Board, row: number, column: number): number {
  if (board[row]![column] !== null) {
    return 0;
  }
  return FULL_MASK & ~peerUsedMask(board, row, column);
}

export class BitGrid {
  readonly cells = new Uint8Array(81);
  readonly rows = new Uint16Array(9);
  readonly cols = new Uint16Array(9);
  readonly boxes = new Uint16Array(9);

  static empty(): BitGrid {
    return new BitGrid();
  }

  static fromBoard(board: Board): BitGrid {
    const grid = BitGrid.empty();
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let column = 0; column < GRID_SIZE; column++) {
        const value = board[row]![column] ?? null;
        if (value !== null) {
          grid.place(row, column, value);
        }
      }
    }
    return grid;
  }

  toBoard(): Board {
    const board = createEmptyBoard();
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let column = 0; column < GRID_SIZE; column++) {
        const value = this.cells[this.index(row, column)]!;
        if (value !== 0) {
          board[row]![column] = value as Digit;
        }
      }
    }
    return board;
  }

  index(row: number, column: number): number {
    return row * GRID_SIZE + column;
  }

  place(row: number, column: number, digit: number): void {
    const bit = digitBit(digit);
    const box = boxIndex(row, column);
    this.cells[this.index(row, column)] = digit;
    this.rows[row] = (this.rows[row]! | bit) as number;
    this.cols[column] = (this.cols[column]! | bit) as number;
    this.boxes[box] = (this.boxes[box]! | bit) as number;
  }

  clear(row: number, column: number): void {
    const digit = this.cells[this.index(row, column)]!;
    if (digit === 0) {
      return;
    }
    const bit = digitBit(digit);
    const box = boxIndex(row, column);
    this.cells[this.index(row, column)] = 0;
    this.rows[row] = (this.rows[row]! & ~bit) as number;
    this.cols[column] = (this.cols[column]! & ~bit) as number;
    this.boxes[box] = (this.boxes[box]! & ~bit) as number;
  }

  candidateMaskAt(row: number, column: number): number {
    if (this.cells[this.index(row, column)] !== 0) {
      return 0;
    }
    const used =
      this.rows[row]! | this.cols[column]! | this.boxes[boxIndex(row, column)]!;
    return FULL_MASK & ~used;
  }

  findMrv(): { row: number; column: number; mask: number } | null {
    let bestRow = 0;
    let bestColumn = 0;
    let bestMask = 0;
    let bestSize = 10;

    for (let row = 0; row < GRID_SIZE; row++) {
      for (let column = 0; column < GRID_SIZE; column++) {
        if (this.cells[this.index(row, column)] !== 0) {
          continue;
        }
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
    }

    if (bestSize === 10) {
      return null;
    }
    return { row: bestRow, column: bestColumn, mask: bestMask };
  }

  isComplete(): boolean {
    for (let i = 0; i < 81; i++) {
      if (this.cells[i] === 0) {
        return false;
      }
    }
    return true;
  }

  clone(): BitGrid {
    const copy = BitGrid.empty();
    copy.cells.set(this.cells);
    copy.rows.set(this.rows);
    copy.cols.set(this.cols);
    copy.boxes.set(this.boxes);
    return copy;
  }
}
