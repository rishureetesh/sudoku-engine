import { describe, expect, it } from "vitest";
import { createEmptyBoard } from "../utils/board.js";
import {
  validateBoard,
  validateBox,
  validateColumn,
  validateRow,
} from "../validation/index.js";

describe("validateRow", () => {
  it("accepts a valid row", () => {
    const board = createEmptyBoard();
    board[0] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    expect(validateRow(board, 0)).toBe(true);
  });

  it("rejects duplicate values in a row", () => {
    const board = createEmptyBoard();
    board[0] = [1, 1, null, null, null, null, null, null, null];
    expect(validateRow(board, 0)).toBe(false);
  });

  it("ignores null cells", () => {
    const board = createEmptyBoard();
    board[0] = [1, null, null, null, null, null, null, null, null];
    expect(validateRow(board, 0)).toBe(true);
  });
});

describe("validateColumn", () => {
  it("accepts a valid column", () => {
    const board = createEmptyBoard();
    for (let row = 0; row < 9; row++) {
      board[row]![0] = row + 1;
    }
    expect(validateColumn(board, 0)).toBe(true);
  });

  it("rejects duplicate values in a column", () => {
    const board = createEmptyBoard();
    board[0]![0] = 5;
    board[1]![0] = 5;
    expect(validateColumn(board, 0)).toBe(false);
  });
});

describe("validateBox", () => {
  it("accepts a valid box", () => {
    const board = createEmptyBoard();
    board[0]![0] = 1;
    board[0]![1] = 2;
    board[0]![2] = 3;
    board[1]![0] = 4;
    board[1]![1] = 5;
    board[1]![2] = 6;
    board[2]![0] = 7;
    board[2]![1] = 8;
    board[2]![2] = 9;
    expect(validateBox(board, 0, 0)).toBe(true);
  });

  it("rejects duplicate values in a box", () => {
    const board = createEmptyBoard();
    board[0]![0] = 4;
    board[1]![1] = 4;
    expect(validateBox(board, 0, 0)).toBe(false);
  });
});

describe("validateBoard", () => {
  it("validates a consistent partial board", () => {
    const board = createEmptyBoard();
    board[0]![0] = 5;
    board[0]![4] = 7;
    board[4]![4] = 3;
    expect(validateBoard(board)).toBe(true);
  });

  it("rejects conflicting placements", () => {
    const board = createEmptyBoard();
    board[0]![0] = 2;
    board[0]![1] = 2;
    expect(validateBoard(board)).toBe(false);
  });
});
