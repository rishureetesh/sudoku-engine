import { describe, expect, it } from "vitest";
import { getCandidates } from "../candidates/getCandidates.js";
import { createEmptyBoard } from "../utils/board.js";

describe("getCandidates", () => {
  it("returns a single candidate when only one digit fits", () => {
    const board = createEmptyBoard();
    board[0] = [1, 2, 3, 4, 5, 6, 7, 8, null];
    expect(getCandidates(board, 0, 8)).toEqual([9]);
  });

  it("returns multiple candidates on an empty cell", () => {
    const board = createEmptyBoard();
    const candidates = getCandidates(board, 4, 4);
    expect(candidates.length).toBeGreaterThan(1);
    expect(candidates.every((n) => n >= 1 && n <= 9)).toBe(true);
  });

  it("returns no candidates for a filled cell", () => {
    const board = createEmptyBoard();
    board[0]![0] = 5;
    expect(getCandidates(board, 0, 0)).toEqual([]);
  });

  it("returns no candidates when all digits are blocked", () => {
    const board = createEmptyBoard();
    for (let column = 0; column < 8; column++) {
      board[0]![column] = column + 1;
    }
    for (let row = 1; row < 9; row++) {
      board[row]![8] = 9;
    }
    expect(getCandidates(board, 0, 8)).toEqual([]);
  });
});
