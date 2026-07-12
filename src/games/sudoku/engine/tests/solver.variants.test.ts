import { describe, expect, it } from "vitest";
import { ALL_VARIANTS, engineFor } from "./helpers/variants.js";
import { fixturePuzzle, fixtureSolvedBoard } from "./helpers/fixtures.js";

describe("solver by variant", () => {
  it.each(ALL_VARIANTS)("%s solves generated medium puzzle", (variant) => {
    const engine = engineFor(variant);
    const game = fixturePuzzle(variant, "medium");
    const result = engine.solve(game.puzzle);
    expect(result.solved).toBe(true);
    expect(engine.boardsEqual(result.board, game.solution)).toBe(true);
  });

  it.each(ALL_VARIANTS)("%s already solved board stays solved", (variant) => {
    const engine = engineFor(variant);
    const board = fixtureSolvedBoard(variant);
    const result = engine.solve(board);
    expect(result.solved).toBe(true);
    expect(engine.boardsEqual(result.board, board)).toBe(true);
  });

  it.each(ALL_VARIANTS)("%s invalid board is not solved", (variant) => {
    const engine = engineFor(variant);
    const board = fixtureSolvedBoard(variant);
    board[0]![1] = board[0]![0] ?? null;
    const result = engine.solve(board);
    expect(result.solved).toBe(false);
  });

  it.each(ALL_VARIANTS)("%s empty board is solvable", (variant) => {
    const engine = engineFor(variant);
    // Empty irregular layouts with fixed digit-order search are pathological.
    if (variant === "jigsaw") {
      const solved = fixtureSolvedBoard(variant);
      const board = engine.cloneBoard(solved);
      board[0]![0] = null;
      const result = engine.solve(board);
      expect(result.solved).toBe(true);
      return;
    }
    const result = engine.solve(engine.createEmptyBoard());
    expect(result.solved).toBe(true);
  });
});

describe("solver difficulty bands", () => {
  it.each(["easy", "medium", "hard", "expert"] as const)(
    "classic %s puzzle solvable",
    (difficulty) => {
      const engine = engineFor("classic");
      const game = fixturePuzzle("classic", difficulty);
      expect(engine.solve(game.puzzle).solved).toBe(true);
    },
  );
});
