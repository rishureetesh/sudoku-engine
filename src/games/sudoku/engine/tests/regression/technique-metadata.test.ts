import { describe, expect, it } from "vitest";
import { createEngine } from "../../core/engine.js";
import { withClassicSeed } from "../helpers/seeded.js";

describe("regression: technique analysis allows zero naked singles", () => {
  it("hard puzzle may report singlesRequired of 0", () => {
    withClassicSeed(() => {
      const engine = createEngine({ variant: "classic" });
      const game = engine.generatePuzzle("hard");
      expect(game).not.toBeNull();

      const analysis = engine.analyzeTechniques(game!.puzzle);
      expect(analysis.singlesRequired).toBeGreaterThanOrEqual(0);
      expect(analysis.maxCandidatesSeen).toBeGreaterThanOrEqual(1);
      expect(analysis.clueBased).toBe("hard");
    });
  });
});
