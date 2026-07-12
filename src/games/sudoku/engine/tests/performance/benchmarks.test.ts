import { describe, expect, it } from "vitest";
import type { Difficulty } from "../../types/difficulty.js";
import type { VariantId } from "../../types/variant.js";
import { setGlobalSeed, clearGlobalSeed } from "../../utils/random.js";
import { ALL_VARIANTS, engineFor } from "../helpers/variants.js";
import { VARIANT_TEST_SEEDS } from "../helpers/seeded.js";
import { medianMs, PERF_LIMITS } from "./limits.js";

const GENERATE_DIFFICULTY: Record<VariantId, Difficulty> = {
  classic: "medium",
  "6x6": "medium",
  diagonal: "medium",
  hyper: "easy",
  windoku: "easy",
  jigsaw: "easy",
};

describe("performance benchmarks", () => {
  it.each(ALL_VARIANTS)("%s solve under budget", (variant) => {
    setGlobalSeed(VARIANT_TEST_SEEDS[variant]);
    try {
      const engine = engineFor(variant);
      const game = engine.generatePuzzle(GENERATE_DIFFICULTY[variant])!;
      const elapsed = medianMs(() => {
        const result = engine.solve(game.puzzle);
        expect(result.solved).toBe(true);
      });
      expect(elapsed).toBeLessThan(PERF_LIMITS[variant].solve);
    } finally {
      clearGlobalSeed();
    }
  });

  it.each(ALL_VARIANTS)("%s generate under budget", (variant) => {
    setGlobalSeed(VARIANT_TEST_SEEDS[variant]);
    try {
      const engine = engineFor(variant);
      const elapsed = medianMs(() => {
        const game = engine.generatePuzzle(GENERATE_DIFFICULTY[variant]);
        expect(game).not.toBeNull();
      });
      expect(elapsed).toBeLessThan(PERF_LIMITS[variant].generate);
    } finally {
      clearGlobalSeed();
    }
  });

  it.each(ALL_VARIANTS)("%s candidates under budget", (variant) => {
    setGlobalSeed(VARIANT_TEST_SEEDS[variant]);
    try {
      const engine = engineFor(variant);
      const game = engine.generatePuzzle("easy")!;
      const elapsed = medianMs(() => {
        for (let row = 0; row < engine.variant.grid.size; row++) {
          for (let column = 0; column < engine.variant.grid.size; column++) {
            engine.getCandidates(game.puzzle, row, column);
          }
        }
      });
      expect(elapsed).toBeLessThan(PERF_LIMITS[variant].candidates);
    } finally {
      clearGlobalSeed();
    }
  });
});
