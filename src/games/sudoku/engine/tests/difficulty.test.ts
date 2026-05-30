import { describe, expect, it } from "vitest";
import { CLUE_RANGES } from "../constants/difficulty.js";
import {
  getTargetClueCount,
  isClueCountInRange,
  rateDifficulty,
} from "../difficulty/index.js";
import { generatePuzzle } from "../generator/generatePuzzle.js";

describe("difficulty helpers", () => {
  it("clue ranges", () => {
    expect(CLUE_RANGES.easy).toEqual({ min: 40, max: 45 });
    expect(CLUE_RANGES.expert).toEqual({ min: 22, max: 25 });
  });

  it("targets clues within range", () => {
    for (let i = 0; i < 20; i++) {
      const target = getTargetClueCount("medium");
      expect(target).toBeGreaterThanOrEqual(CLUE_RANGES.medium.min);
      expect(target).toBeLessThanOrEqual(CLUE_RANGES.medium.max);
    }
  });

  it("expert puzzle rates as expert", () => {
    const puzzle = generatePuzzle("expert")!;
    expect(isClueCountInRange("expert", puzzle.clueCount)).toBe(true);
    expect(rateDifficulty(puzzle.puzzle)).toBe("expert");
  });
});
