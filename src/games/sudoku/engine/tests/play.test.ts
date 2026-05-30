import { describe, expect, it } from "vitest";
import { generatePuzzle } from "../generator/generatePuzzle.js";
import { applyMove, isBoardComplete, isSolvedCorrectly } from "../play/index.js";
import { SudokuEngineError } from "../batch/errors.js";
import { assertInBounds } from "../utils/coordinates.js";

describe("play helpers", () => {
  const game = generatePuzzle("easy")!;
  const board = game.puzzle.map((row) => [...row]);

  it("applyMove rejects changes to givens", () => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (game.puzzle[row]![col] !== null) {
          const result = applyMove(board, row, col, 1, game.puzzle);
          expect(result.success).toBe(false);
          return;
        }
      }
    }
  });

  it("applyMove accepts a valid digit on an empty cell", () => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (game.puzzle[row]![col] === null) {
          const digit = game.solution[row]![col]!;
          const result = applyMove(board, row, col, digit, game.puzzle);
          expect(result.success).toBe(true);
          return;
        }
      }
    }
    throw new Error("expected an empty cell");
  });

  it("detects a complete correct grid", () => {
    expect(isSolvedCorrectly(game.solution, game.solution)).toBe(true);
    expect(isBoardComplete(game.solution)).toBe(true);
  });

  it("throws on out-of-bounds access", () => {
    expect(() => assertInBounds(9, 0)).toThrow(SudokuEngineError);
  });
});
