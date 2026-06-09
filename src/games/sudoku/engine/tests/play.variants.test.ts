import { describe, expect, it } from "vitest";
import { SudokuEngineError } from "../batch/errors.js";
import { ALL_VARIANTS, engineFor } from "./helpers/variants.js";
import { fixturePuzzle, fixtureSolvedBoard, hyperSolvedBoard } from "./helpers/fixtures.js";
import { withVariantSeed } from "./helpers/seeded.js";

describe("applyMove (variants)", () => {
  it.each(ALL_VARIANTS)("rejects out-of-range coordinates (%s)", (variant) => {
    const engine = engineFor(variant);
    const board = engine.createEmptyBoard();
    expect(() =>
      engine.applyMove(board, -1, 0, 1),
    ).toThrow(SudokuEngineError);
    expect(() =>
      engine.applyMove(board, 0, engine.variant.grid.size, 1),
    ).toThrow(SudokuEngineError);
  });

  it("6x6 rejects digit outside 1–6", () => {
    const engine = engineFor("6x6");
    const board = engine.createEmptyBoard();
    const result = engine.applyMove(board, 0, 0, 7);
    expect(result.success).toBe(false);
    expect(result.reason).toMatch(/1–2–3–4–5–6/);
  });

  it("allows overwriting same cell with same digit", () => {
    const engine = engineFor("classic");
    const game = fixturePuzzle("classic", "easy");
    const board = engine.cloneBoard(game.puzzle);
    for (let row = 0; row < 9; row++) {
      for (let column = 0; column < 9; column++) {
        if (game.puzzle[row]![column] !== null) {
          const digit = game.puzzle[row]![column]!;
          const result = engine.applyMove(board, row, column, digit);
          expect(result.success).toBe(true);
          return;
        }
      }
    }
  });

  it("diagonal rejects digit conflicting with main diagonal", () => {
    withVariantSeed("diagonal", () => {
      const engine = engineFor("diagonal");
      const solution = fixtureSolvedBoard("diagonal");
      const board = engine.cloneBoard(solution);
      const size = engine.variant.grid.size;
      board[0]![0] = null;
      const diagonalPeer = solution[1]![1]!;
      const result = engine.applyMove(board, 0, 0, diagonalPeer);
      expect(result.success).toBe(false);
      expect(result.reason).toMatch(/house/);
      expect(size).toBe(9);
    });
  });

  it("hyper rejects digit conflicting with a hyper region", () => {
    const engine = engineFor("hyper");
    const solution = hyperSolvedBoard();
    const board = engine.cloneBoard(solution);
    board[2]![4] = null;
    const peer = solution[1]![3]!;
    const result = engine.applyMove(board, 2, 4, peer);
    expect(result.success).toBe(false);
    expect(result.reason).toMatch(/house/);
  });
});
