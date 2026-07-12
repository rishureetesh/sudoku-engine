import { describe, expect, it } from "vitest";
import {
  DIAGONAL_VARIANT,
  HYPER_VARIANT,
  WINDOKU_VARIANT,
  JIGSAW_VARIANT,
} from "../../variants/registry.js";
import {
  TIGHT_GENERATION,
  DEFAULT_GENERATION,
  JIGSAW_GENERATION,
} from "../../core/variant.js";

describe("regression: generation profile", () => {
  it("tight variants use expanded retry budgets without id checks in generator", () => {
    expect(DIAGONAL_VARIANT.generation).toEqual(TIGHT_GENERATION);
    expect(HYPER_VARIANT.generation).toEqual(TIGHT_GENERATION);
    expect(WINDOKU_VARIANT.generation).toEqual(TIGHT_GENERATION);
    expect(JIGSAW_VARIANT.generation).toEqual(JIGSAW_GENERATION);
    expect(JIGSAW_VARIANT.seedHouseIds).toEqual(["region-0"]);
    expect(JIGSAW_VARIANT.seedRegionStarts).toEqual([]);
    expect(DIAGONAL_VARIANT.generation.tryFullClueRange).toBe(true);
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
