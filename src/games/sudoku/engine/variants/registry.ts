import { SudokuEngineError } from "../batch/errors.js";
import {
  CLASSIC_GRID,
  SIX_BY_SIX_GRID,
  standardSudokuHouses,
  diagonalSudokuHouses,
  hyperSudokuHouses,
  validateHouseSet,
} from "../core/houses.js";
import type {
  ClueRanges,
  GenerationProfile,
  SudokuVariant,
  TechniqueHeuristics,
  VariantId,
} from "../core/variant.js";
import {
  DEFAULT_GENERATION,
  TIGHT_GENERATION,
} from "../core/variant.js";

const CLASSIC_CLUE_RANGES: ClueRanges = {
  easy: { min: 40, max: 45 },
  medium: { min: 32, max: 39 },
  hard: { min: 26, max: 31 },
  expert: { min: 22, max: 25 },
};

const SIX_BY_SIX_CLUE_RANGES: ClueRanges = {
  easy: { min: 24, max: 26 },
  medium: { min: 20, max: 23 },
  hard: { min: 16, max: 19 },
  expert: { min: 12, max: 15 },
};

const TIGHT_CLUE_RANGES: ClueRanges = {
  easy: { min: 40, max: 45 },
  medium: { min: 34, max: 39 },
  hard: { min: 28, max: 33 },
  expert: { min: 24, max: 29 },
};

const CLASSIC_TECHNIQUES: TechniqueHeuristics = {
  easy: { singlesMin: 40, maxCandidates: 3 },
  medium: { singlesMin: 25, maxCandidates: 5 },
  hardClueFloor: 26,
};

const SIX_BY_SIX_TECHNIQUES: TechniqueHeuristics = {
  easy: { singlesMin: 14, maxCandidates: 3 },
  medium: { singlesMin: 9, maxCandidates: 4 },
  hardClueFloor: 16,
};

function buildVariant(
  id: VariantId,
  label: string,
  grid: typeof CLASSIC_GRID,
  houses: ReturnType<typeof standardSudokuHouses>,
  clueRanges: ClueRanges,
  minClues: number,
  techniqueHeuristics: TechniqueHeuristics,
  seedRegionStarts: readonly { row: number; column: number }[],
  generation: GenerationProfile = DEFAULT_GENERATION,
): SudokuVariant {
  validateHouseSet(grid, houses);
  return {
    id,
    label,
    grid,
    houses,
    clueRanges,
    minClues,
    techniqueHeuristics,
    generation,
    seedRegionStarts,
  };
}

export const CLASSIC_VARIANT = buildVariant(
  "classic",
  "Classic 9×9",
  CLASSIC_GRID,
  standardSudokuHouses(CLASSIC_GRID),
  CLASSIC_CLUE_RANGES,
  17,
  CLASSIC_TECHNIQUES,
  [
    { row: 0, column: 0 },
    { row: 3, column: 3 },
    { row: 6, column: 6 },
  ],
);

export const SIX_BY_SIX_VARIANT = buildVariant(
  "6x6",
  "6×6 Sudoku",
  SIX_BY_SIX_GRID,
  standardSudokuHouses(SIX_BY_SIX_GRID),
  SIX_BY_SIX_CLUE_RANGES,
  9,
  SIX_BY_SIX_TECHNIQUES,
  [
    { row: 0, column: 0 },
    { row: 4, column: 3 },
  ],
);

export const DIAGONAL_CLUE_RANGES: ClueRanges = TIGHT_CLUE_RANGES;

export const DIAGONAL_VARIANT = buildVariant(
  "diagonal",
  "Sudoku X (diagonal)",
  CLASSIC_GRID,
  diagonalSudokuHouses(CLASSIC_GRID),
  DIAGONAL_CLUE_RANGES,
  17,
  CLASSIC_TECHNIQUES,
  [{ row: 0, column: 0 }],
  TIGHT_GENERATION,
);

export const HYPER_CLUE_RANGES: ClueRanges = TIGHT_CLUE_RANGES;

export const HYPER_VARIANT = buildVariant(
  "hyper",
  "Hyper Sudoku",
  CLASSIC_GRID,
  hyperSudokuHouses(CLASSIC_GRID),
  HYPER_CLUE_RANGES,
  17,
  CLASSIC_TECHNIQUES,
  [{ row: 0, column: 0 }],
  TIGHT_GENERATION,
);

const VARIANTS: Record<VariantId, SudokuVariant> = {
  classic: CLASSIC_VARIANT,
  "6x6": SIX_BY_SIX_VARIANT,
  diagonal: DIAGONAL_VARIANT,
  hyper: HYPER_VARIANT,
};

export function getVariant(id: VariantId): SudokuVariant {
  const variant = VARIANTS[id];
  if (!variant) {
    throw new SudokuEngineError(`Unknown variant: ${String(id)}`);
  }
  return variant;
}

export function listVariants(): readonly SudokuVariant[] {
  return Object.values(VARIANTS);
}
