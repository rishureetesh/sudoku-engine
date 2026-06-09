import { describe, expect, it } from "vitest";
import { ALL_VARIANTS, engineFor } from "../helpers/variants.js";
import { fixturePuzzle } from "../helpers/fixtures.js";

describe("integration: generate → validate → solve → validate", () => {
  it.each(ALL_VARIANTS)("%s pipeline", (variant) => {
    const engine = engineFor(variant);
    const game = fixturePuzzle(variant, "medium");

    expect(engine.validateBoard(game.puzzle)).toBe(true);
    expect(engine.countSolutions(game.puzzle, 2)).toBe(1);

    const result = engine.solve(game.puzzle);
    expect(result.solved).toBe(true);
    expect(engine.validateBoard(result.board)).toBe(true);
    expect(engine.boardsEqual(result.board, game.solution)).toBe(true);
  });
});

describe("integration: generate → rate → solve", () => {
  it.each(ALL_VARIANTS)("%s rating matches clue band", (variant) => {
    const engine = engineFor(variant);
    const game = fixturePuzzle(variant, "easy");

    expect(engine.rateDifficulty(game.puzzle)).toBe("easy");
    expect(engine.isClueCountInRange("easy", game.clueCount)).toBe(true);
    expect(engine.solve(game.puzzle).solved).toBe(true);
  });
});
