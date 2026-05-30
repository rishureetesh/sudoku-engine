import { describe, expect, it } from "vitest";
import { generatePuzzle } from "../generator/generatePuzzle.js";
import {
  analyzeTechniques,
  rateDifficultyByTechniques,
} from "../difficulty/rateDifficultyByTechniques.js";

describe("technique difficulty", () => {
  it("rates generated puzzles", () => {
    const game = generatePuzzle("easy")!;
    const rated = rateDifficultyByTechniques(game.puzzle);
    expect(["easy", "medium", "hard", "expert"]).toContain(rated);
  });

  it("returns analysis metadata", () => {
    const game = generatePuzzle("hard")!;
    const analysis = analyzeTechniques(game.puzzle);
    expect(analysis.clueBased).toBeDefined();
    expect(analysis.singlesRequired).toBeGreaterThan(0);
    expect(analysis.maxCandidatesSeen).toBeGreaterThanOrEqual(1);
  });
});
