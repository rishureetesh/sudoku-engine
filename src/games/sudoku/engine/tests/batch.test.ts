import { describe, expect, it } from "vitest";
import { MAX_BATCH_SIZE } from "../constants/difficulty.js";
import {
  SudokuEngine,
  generateBatch,
  generateOne,
  resolveDistribution,
} from "../batch/index.js";
import { SudokuEngineError } from "../batch/errors.js";
import { isClueCountInRange } from "../difficulty/index.js";
import { countSolutions } from "../solver/countSolutions.js";
import type { Difficulty } from "../types/difficulty.js";

describe("batch", () => {
  it("generates one puzzle per difficulty", () => {
    const difficulties: Difficulty[] = ["easy", "medium", "hard", "expert"];
    for (const difficulty of difficulties) {
      const puzzle = generateOne({ difficulty, seed: 42 + difficulty.length });
      expect(puzzle.difficulty).toBe(difficulty);
      expect(isClueCountInRange(difficulty, puzzle.clueCount)).toBe(true);
      expect(countSolutions(puzzle.puzzle)).toBe(1);
    }
  });

  it("is reproducible with the same seed", () => {
    const a = generateOne({ difficulty: "hard", seed: 999 });
    const b = generateOne({ difficulty: "hard", seed: 999 });
    expect(a.puzzle).toEqual(b.puzzle);
    expect(a.solution).toEqual(b.solution);
  });

  it("splits batch evenly by default", () => {
    const engine = new SudokuEngine({ seed: 100 });
    const batch = engine.generateBatch({ count: 4 });
    expect(batch).toHaveLength(4);
    const counts = { easy: 0, medium: 0, hard: 0, expert: 0 };
    for (const item of batch) {
      counts[item.difficulty]++;
    }
    expect(counts).toEqual({ easy: 1, medium: 1, hard: 1, expert: 1 });
  });

  it("rejects batch count over maximum", () => {
    expect(() => generateBatch({ count: MAX_BATCH_SIZE + 1 })).toThrow(
      SudokuEngineError,
    );
  });

  it("rejects invalid distribution sums", () => {
    expect(() =>
      resolveDistribution(10, { easy: 5, medium: 5, hard: 5, expert: 5 }),
    ).toThrow(SudokuEngineError);
  });
});
