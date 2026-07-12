import type { Difficulty } from "../types/difficulty.js";
import type { VariantId } from "../types/variant.js";
import type { GridSpec } from "./grid-spec.js";
import type { HouseSet } from "./houses.js";

export type { VariantId };

export interface ClueRange {
  readonly min: number;
  readonly max: number;
}

export type ClueRanges = Readonly<Record<Difficulty, ClueRange>>;

export interface TechniqueHeuristics {
  readonly easy: { readonly singlesMin: number; readonly maxCandidates: number };
  readonly medium: {
    readonly singlesMin: number;
    readonly maxCandidates: number;
  };
  readonly hardClueFloor: number;
}

export interface GenerationProfile {
  readonly puzzleMaxAttempts: number;
  readonly puzzleFallbackAttempts: number;
  readonly carveMaxAttempts: number;
  readonly tryFullClueRange: boolean;
  /** Max MRV nodes when filling a solved board; exhausted budget retries. */
  readonly fillNodeBudget: number;
  /** Max MRV nodes per uniqueness check while carving; exhausted ⇒ keep clue. */
  readonly carveNodeBudget: number;
}

export const DEFAULT_GENERATION: GenerationProfile = {
  puzzleMaxAttempts: 12,
  puzzleFallbackAttempts: 30,
  carveMaxAttempts: 200,
  tryFullClueRange: false,
  fillNodeBudget: 50_000,
  carveNodeBudget: 100_000,
};

export const TIGHT_GENERATION: GenerationProfile = {
  puzzleMaxAttempts: 24,
  puzzleFallbackAttempts: 20,
  carveMaxAttempts: 400,
  tryFullClueRange: true,
  fillNodeBudget: 50_000,
  carveNodeBudget: 80_000,
};

/** Irregular regions: prefer more fill retries, fewer carve probes per board. */
export const JIGSAW_GENERATION: GenerationProfile = {
  puzzleMaxAttempts: 32,
  puzzleFallbackAttempts: 24,
  carveMaxAttempts: 100,
  tryFullClueRange: true,
  fillNodeBudget: 25_000,
  carveNodeBudget: 25_000,
};

export interface SudokuVariant {
  readonly id: VariantId;
  readonly label: string;
  readonly grid: GridSpec;
  readonly houses: HouseSet;
  readonly clueRanges: ClueRanges;
  readonly minClues: number;
  readonly techniqueHeuristics: TechniqueHeuristics;
  readonly generation: GenerationProfile;
  readonly seedRegionStarts: readonly { readonly row: number; readonly column: number }[];
  /** When set, seed by filling these houses instead of rectangular boxes. */
  readonly seedHouseIds?: readonly string[];
}

export interface CreateEngineOptions {
  readonly variant?: VariantId;
}

/**
 * Extension point for future meta-constraints (killer cages, thermometers, kropki).
 * These sit on top of house uniqueness and are not implemented yet.
 */
export interface MetaConstraint {
  readonly id: string;
  readonly kind:
    | "cage-sum"
    | "thermometer"
    | "inequality"
    | "custom";
  validate?(board: unknown): boolean;
}

export interface VariantBuilderOptions {
  readonly includeDiagonals?: boolean;
  readonly metaConstraints?: readonly MetaConstraint[];
}
