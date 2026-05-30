import { beforeAll, describe, expect, it } from "vitest";
import { generatePuzzle } from "../generator/generatePuzzle.js";
import { countSolutions, solve } from "../solver/index.js";
import { findEmptyCell } from "../solver/findEmptyCell.js";
import type { GeneratedPuzzle } from "../types/difficulty.js";
import { boardsEqual, createEmptyBoard } from "../utils/board.js";

describe("findEmptyCell", () => {
  it("returns coordinates for the first empty cell", () => {
    const board = createEmptyBoard();
    board[0]![0] = 1;
    expect(findEmptyCell(board)).toEqual({ row: 0, column: 1 });
  });

  it("returns null for a complete board", () => {
    const board = generatePuzzle("easy")!.solution;
    expect(findEmptyCell(board)).toBeNull();
  });
});

describe("solve", () => {
  let easy: GeneratedPuzzle;
  let expert: GeneratedPuzzle;

  beforeAll(() => {
    easy = generatePuzzle("easy")!;
    expert = generatePuzzle("expert")!;
  });

  it("solves an easy puzzle", () => {
    const result = solve(easy.puzzle);
    expect(result.solved).toBe(true);
    expect(boardsEqual(result.board, easy.solution)).toBe(true);
  });

  it("solves an expert puzzle", () => {
    const result = solve(expert.puzzle);
    expect(result.solved).toBe(true);
    expect(boardsEqual(result.board, expert.solution)).toBe(true);
  });

  it("reports unsolvable for contradictory boards", () => {
    const board = createEmptyBoard();
    board[0]![0] = 1;
    board[0]![1] = 2;
    board[1]![0] = 2;
    board[1]![1] = 1;
    const result = solve(board);
    expect(result.solved).toBe(false);
  });

  it("is deterministic for the same input", () => {
    const first = solve(easy.puzzle);
    const second = solve(easy.puzzle);
    expect(first).toEqual(second);
  });
});

describe("countSolutions", () => {
  it("returns 0 for invalid boards", () => {
    const board = createEmptyBoard();
    board[0]![0] = 1;
    board[0]![1] = 1;
    expect(countSolutions(board)).toBe(0);
  });

  it("returns 1 for a generated puzzle", () => {
    const { puzzle } = generatePuzzle("medium")!;
    expect(countSolutions(puzzle)).toBe(1);
  });

  it("returns more than one for under-constrained boards", () => {
    const board = createEmptyBoard();
    board[0]![0] = 1;
    board[1]![1] = 2;
    expect(countSolutions(board, 3)).toBeGreaterThan(1);
  });
});
