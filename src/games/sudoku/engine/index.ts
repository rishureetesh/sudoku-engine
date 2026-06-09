export type {
  Board,
  CellValue,
  Digit,
  Difficulty,
  DifficultyDistribution,
  EmptyCell,
  GenerateBatchOptions,
  GenerateOneOptions,
  GeneratePuzzleOptions,
  GeneratedPuzzle,
  SolverResult,
  SudokuEngineOptions,
  VariantId,
} from "./types/index.js";

export type { RevealResult, CellDisplayState } from "./hints/index.js";
export type { ApplyMoveResult } from "./play/index.js";
export type {
  ImportedPuzzle,
  ImportValidationResult,
} from "./import/index.js";
export type { TechniqueAnalysis } from "./difficulty/index.js";
export type {
  SudokuVariant,
  CreateEngineOptions,
  MetaConstraint,
  ClueRange,
  ClueRanges,
  GenerationProfile,
} from "./core/variant.js";
export type { PuzzleEngine } from "./core/engine.js";
export type { GridSpec } from "./core/grid-spec.js";
export type { House, HouseKind, HouseSet } from "./core/houses.js";

export { createEngine, getClassicEngine } from "./core/engine.js";
export {
  CLASSIC_VARIANT,
  SIX_BY_SIX_VARIANT,
  DIAGONAL_VARIANT,
  HYPER_VARIANT,
  getVariant,
  listVariants,
} from "./variants/registry.js";

export {
  BOX_SIZE,
  CELL_COUNT,
  CLUE_RANGES,
  DIFFICULTIES,
  DIGITS,
  GRID_SIZE,
  MAX_BATCH_SIZE,
  MIN_CLUES,
} from "./constants/index.js";

export {
  allCellCoordinates,
  boardToString,
  boardsEqual,
  cloneBoard,
  countClues,
  createEmptyBoard,
  isValidBoardShape,
  stringToBoard,
} from "./utils/board.js";

export { isInBounds, assertInBounds } from "./utils/coordinates.js";

export {
  validateBoard,
  validateRow,
  validateColumn,
  validateBox,
  isValidMove,
} from "./validation/index.js";

export { getCandidates } from "./candidates/index.js";

export {
  findEmptyCell,
  solve,
  countSolutions,
  hasUniqueSolution,
} from "./solver/index.js";

export {
  generateSolvedBoard,
  removeCells,
  removeCellsSymmetric,
  generatePuzzle,
} from "./generator/index.js";

export {
  rateDifficulty,
  getTargetClueCount,
  isClueCountInRange,
  rateDifficultyByTechniques,
  analyzeTechniques,
} from "./difficulty/index.js";

export {
  isGiven,
  getGivenCells,
  revealCell,
  revealNext,
  revealRandom,
  getCellDisplayState,
} from "./hints/index.js";

export {
  applyMove,
  isBoardComplete,
  isSolvedCorrectly,
} from "./play/index.js";

export {
  puzzleFromString,
  validateImportedPuzzle,
} from "./import/index.js";

export { dailyPuzzle, dateToSeed } from "./daily/index.js";

export {
  SudokuEngine,
  SudokuEngineError,
  generateBatch,
  generateOne,
  resolveDistribution,
} from "./batch/index.js";

export { clearGlobalSeed, setGlobalSeed } from "./utils/random.js";
