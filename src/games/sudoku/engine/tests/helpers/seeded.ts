import type { Difficulty } from "../../types/difficulty.js";
import type { VariantId } from "../../types/variant.js";
import { clearGlobalSeed, setGlobalSeed } from "../../utils/random.js";

/** Deterministic seeds — avoid pathological unseeded generation in tests. */
export const VARIANT_TEST_SEEDS: Record<VariantId, number> = {
  classic: 42,
  "6x6": 42,
  diagonal: 42,
  hyper: 103,
  windoku: 42,
  jigsaw: 107,
};

export const CLASSIC_TEST_SEED = 42;

export function withVariantSeed<T>(variant: VariantId, fn: () => T): T {
  setGlobalSeed(VARIANT_TEST_SEEDS[variant]);
  try {
    return fn();
  } finally {
    clearGlobalSeed();
  }
}

export function withClassicSeed<T>(fn: () => T): T {
  setGlobalSeed(CLASSIC_TEST_SEED);
  try {
    return fn();
  } finally {
    clearGlobalSeed();
  }
}

/** Tight variants: prefer easy/medium in tests to keep CI fast. */
export function testDifficulty(
  variant: VariantId,
  preferred: Difficulty,
): Difficulty {
  if (variant === "hyper" || variant === "windoku" || variant === "jigsaw") {
    return "easy";
  }
  if (variant === "diagonal" && preferred === "hard") return "medium";
  return preferred;
}
