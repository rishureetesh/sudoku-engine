import { describe, expect, it } from "vitest";
import { ALL_VARIANTS, engineFor } from "./helpers/variants.js";
import { fixturePuzzle, fixtureSolvedBoard, hyperSolvedBoard } from "./helpers/fixtures.js";

describe("candidates by variant", () => {
  it.each(ALL_VARIANTS)("%s empty board has candidates everywhere", (variant) => {
    const engine = engineFor(variant);
    const board = engine.createEmptyBoard();
    const size = engine.variant.grid.size;

    for (let row = 0; row < size; row++) {
      for (let column = 0; column < size; column++) {
        const candidates = engine.getCandidates(board, row, column);
        expect(candidates.length).toBeGreaterThan(0);
      }
    }
  });

  it.each(ALL_VARIANTS)("%s partial puzzle has constrained candidates", (variant) => {
    const engine = engineFor(variant);
    const game = fixturePuzzle(variant, "medium");

    let checked = false;
    for (let row = 0; row < engine.variant.grid.size; row++) {
      for (let column = 0; column < engine.variant.grid.size; column++) {
        if (game.puzzle[row]![column] !== null) continue;
        const candidates = engine.getCandidates(game.puzzle, row, column);
        expect(candidates.length).toBeGreaterThan(0);
        expect(candidates.length).toBeLessThanOrEqual(
          engine.variant.grid.digitCount,
        );
        checked = true;
      }
    }
    expect(checked).toBe(true);
  });

  it.each(ALL_VARIANTS)("%s solved board has no candidates on filled cells", (variant) => {
    const engine = engineFor(variant);
    const board =
      variant === "hyper" ? hyperSolvedBoard() : fixtureSolvedBoard(variant);
    expect(engine.getCandidates(board, 0, 0)).toEqual([]);
  });
});
