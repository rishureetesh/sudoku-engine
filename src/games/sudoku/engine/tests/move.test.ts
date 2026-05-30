import { describe, expect, it } from "vitest";
import { createEmptyBoard } from "../utils/board.js";
import { isValidMove } from "../validation/isValidMove.js";

describe("isValidMove", () => {
  it("allows a valid move", () => {
    const board = createEmptyBoard();
    board[0]![0] = 5;
    expect(isValidMove(board, 0, 1, 3)).toBe(true);
  });

  it("rejects a duplicate in the same row", () => {
    const board = createEmptyBoard();
    board[0]![0] = 5;
    expect(isValidMove(board, 0, 1, 5)).toBe(false);
  });

  it("rejects a duplicate in the same column", () => {
    const board = createEmptyBoard();
    board[0]![0] = 5;
    expect(isValidMove(board, 3, 0, 5)).toBe(false);
  });

  it("rejects a duplicate in the same box", () => {
    const board = createEmptyBoard();
    board[0]![0] = 5;
    expect(isValidMove(board, 1, 1, 5)).toBe(false);
  });

  it("rejects out-of-range values", () => {
    const board = createEmptyBoard();
    expect(isValidMove(board, 0, 0, 0)).toBe(false);
    expect(isValidMove(board, 0, 0, 10)).toBe(false);
  });
});
