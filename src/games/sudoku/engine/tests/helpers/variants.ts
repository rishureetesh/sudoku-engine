import { createEngine, type PuzzleEngine } from "../../core/engine.js";
import type { VariantId } from "../../types/variant.js";

export const ALL_VARIANTS: VariantId[] = ["classic", "6x6", "diagonal", "hyper"];

export function engineFor(variant: VariantId): PuzzleEngine {
  return createEngine({ variant });
}
