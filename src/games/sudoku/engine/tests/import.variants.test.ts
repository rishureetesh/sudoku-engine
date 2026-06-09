import { describe, expect, it } from "vitest";
import { isSolvedBoard } from "../core/validation.js";
import { ALL_VARIANTS, engineFor } from "./helpers/variants.js";
import { fixturePuzzle, fixtureSolvedBoard } from "./helpers/fixtures.js";

describe("validateImportedPuzzle", () => {
  it.each(ALL_VARIANTS)("accepts a generated puzzle (%s)", (variant) => {
    const engine = engineFor(variant);
    const game = fixturePuzzle(variant, "easy");

    const result = engine.validateImportedPuzzle(game.puzzle);
    expect(result).toEqual({
      valid: true,
      unique: true,
      solvable: true,
      puzzle: {
        puzzle: game.puzzle,
        solution: game.solution,
        clueCount: game.clueCount,
      },
    });
  });

  it.each(ALL_VARIANTS)("rejects malformed shape (%s)", (variant) => {
    const engine = engineFor(variant);
    const bad = [[1, 2, 3]] as unknown as ReturnType<
      typeof engine.createEmptyBoard
    >;
    const result = engine.validateImportedPuzzle(bad);
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/Expected a \d+×\d+ board/);
  });

  it.each(ALL_VARIANTS)("rejects duplicate digits in a house (%s)", (variant) => {
    const engine = engineFor(variant);
    const board = engine.createEmptyBoard();
    board[0]![0] = 1;
    board[0]![1] = 1;
    const result = engine.validateImportedPuzzle(board);
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Duplicate digit in a house.");
  });

  it("classic rejects unsolvable partial", () => {
    const engine = engineFor("classic");
    const board = engine.createEmptyBoard();
    for (let column = 0; column < 8; column++) {
      board[0]![column] = column + 1;
    }
    board[1]![8] = 9;
    const result = engine.validateImportedPuzzle(board);
    expect(result.valid).toBe(false);
    expect(result.solvable).toBe(false);
    expect(result.error).toBe("No solution.");
  });

  it("classic rejects ambiguous puzzle", () => {
    const engine = engineFor("classic");
    const board = engine.createEmptyBoard();
    const result = engine.validateImportedPuzzle(board);
    expect(result.valid).toBe(false);
    expect(result.unique).toBe(false);
    expect(result.solvable).toBe(true);
    expect(result.error).toBe("More than one solution.");
  });
});

describe("isSolvedBoard (core)", () => {
  it.each(ALL_VARIANTS)("true for generated solution (%s)", (variant) => {
    const engine = engineFor(variant);
    const game = fixturePuzzle(variant, "easy");
    expect(isSolvedBoard(engine.variant, game.solution)).toBe(true);
  });

  it("false when a cell is empty", () => {
    const engine = engineFor("classic");
    const board = engine.createEmptyBoard();
    expect(isSolvedBoard(engine.variant, board)).toBe(false);
  });

  it("false for invalid digit on 6x6", () => {
    const engine = engineFor("6x6");
    const board = fixtureSolvedBoard("6x6");
    board[0]![0] = 9;
    expect(isSolvedBoard(engine.variant, board)).toBe(false);
  });
});

describe("puzzleFromString per variant", () => {
  it.each(ALL_VARIANTS)("round-trips generated puzzle (%s)", (variant) => {
    const engine = engineFor(variant);
    const game = fixturePuzzle(variant, "medium");
    const text = engine.boardToString(game.puzzle);
    const parsed = engine.puzzleFromString(text);
    expect(parsed).not.toBeNull();
    expect(engine.boardsEqual(parsed!, game.puzzle)).toBe(true);
  });
});
