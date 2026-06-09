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
}

export const DEFAULT_GENERATION: GenerationProfile = {
  puzzleMaxAttempts: 12,
  puzzleFallbackAttempts: 30,
  carveMaxAttempts: 200,
  tryFullClueRange: false,
};

export const TIGHT_GENERATION: GenerationProfile = {
  puzzleMaxAttempts: 24,
  puzzleFallbackAttempts: 20,
  carveMaxAttempts: 400,
  tryFullClueRange: true,
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
