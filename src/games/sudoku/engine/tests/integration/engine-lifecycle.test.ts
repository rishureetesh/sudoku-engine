import { describe, expect, it } from "vitest";
import { createEngine } from "../../core/engine.js";
import { listVariants } from "../../variants/registry.js";
import { ALL_VARIANTS } from "../helpers/variants.js";
import { fixtureSolvedBoard } from "../helpers/fixtures.js";

describe("integration: createEngine lifecycle", () => {
  it("registers all variants", () => {
    expect(listVariants().map((v) => v.id).sort()).toEqual(
      [...ALL_VARIANTS].sort(),
    );
  });

  it.each(ALL_VARIANTS)("%s init → solve → validate", (variant) => {
    const engine = createEngine({ variant });
    expect(engine.variantId).toBe(variant);
    expect(engine.variant.grid.size).toBeGreaterThan(0);

    const empty = engine.createEmptyBoard();
    expect(empty).toHaveLength(engine.variant.grid.size);

    const solved = fixtureSolvedBoard(variant);
    expect(engine.validateBoard(solved)).toBe(true);

    const partial = engine.cloneBoard(solved);
    partial[0]![0] = null;
    const result = engine.solve(partial);
    expect(result.solved).toBe(true);
    expect(engine.validateBoard(result.board)).toBe(true);
  });
});
