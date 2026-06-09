import { describe, expect, it } from "vitest";
import {
  DIAGONAL_VARIANT,
  HYPER_VARIANT,
} from "../../variants/registry.js";
import { TIGHT_GENERATION, DEFAULT_GENERATION } from "../../core/variant.js";

describe("regression: generation profile", () => {
  it("tight variants use expanded retry budgets without id checks in generator", () => {
    expect(DIAGONAL_VARIANT.generation).toEqual(TIGHT_GENERATION);
    expect(HYPER_VARIANT.generation).toEqual(TIGHT_GENERATION);
    expect(DIAGONAL_VARIANT.generation.tryFullClueRange).toBe(true);
    expect(HYPER_VARIANT.generation.tryFullClueRange).toBe(true);
    expect(TIGHT_GENERATION.puzzleMaxAttempts).toBe(24);
    expect(TIGHT_GENERATION.puzzleFallbackAttempts).toBe(20);
  });

  it("classic uses default generation profile", () => {
    expect(DEFAULT_GENERATION.tryFullClueRange).toBe(false);
    expect(DEFAULT_GENERATION.puzzleMaxAttempts).toBeLessThan(
      TIGHT_GENERATION.puzzleMaxAttempts,
    );
  });
});
