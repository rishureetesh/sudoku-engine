import { describe, expect, it } from "vitest";
import { getVariant, listVariants } from "../variants/registry.js";
import { SudokuEngineError } from "../batch/errors.js";
import type { VariantId } from "../types/variant.js";

describe("variant registry", () => {
  it("lists all presets", () => {
    const variants = listVariants();
    expect(variants.map((v) => v.id).sort()).toEqual([
      "6x6",
      "classic",
      "diagonal",
      "hyper",
    ]);
  });

  it("throws on unknown variant id", () => {
    expect(() => getVariant("nonexistent" as VariantId)).toThrow(
      SudokuEngineError,
    );
    expect(() => getVariant("nonexistent" as VariantId)).toThrow(
      /Unknown variant/,
    );
  });
});
