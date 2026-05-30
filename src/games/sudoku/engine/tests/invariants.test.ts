import { describe, expect, it } from "vitest";
import { DIFFICULTIES } from "../constants/index.js";
import { generatePuzzle } from "../generator/generatePuzzle.js";
import { solve } from "../solver/solve.js";
import { boardsEqual } from "../utils/board.js";

describe("invariants", () => {
  it.each(DIFFICULTIES)("solve matches solution for %s", (difficulty) => {
    const game = generatePuzzle(difficulty);
    expect(game).not.toBeNull();
    const result = solve(game!.puzzle);
    expect(result.solved).toBe(true);
    expect(boardsEqual(result.board, game!.solution)).toBe(true);
  });
});
