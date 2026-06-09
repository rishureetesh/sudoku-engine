import { describe, expect, it } from "vitest";
import { generatePuzzle } from "../generator/generatePuzzle.js";
import { solve } from "../solver/solve.js";
import { withClassicSeed } from "./helpers/seeded.js";

describe("speed", () => {
  it("solves a medium puzzle in under 100ms", () => {
    withClassicSeed(() => {
      const { puzzle } = generatePuzzle("medium")!;
      const start = performance.now();
      const result = solve(puzzle);
      const elapsed = performance.now() - start;
      expect(result.solved).toBe(true);
      expect(elapsed).toBeLessThan(100);
    });
  });

  it("generates hard in under 500ms", () => {
    withClassicSeed(() => {
      const start = performance.now();
      const puzzle = generatePuzzle("hard");
      const elapsed = performance.now() - start;
      expect(puzzle).not.toBeNull();
      expect(elapsed).toBeLessThan(500);
    });
  });
});
