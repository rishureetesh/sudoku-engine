import type {
  Difficulty,
  GeneratedPuzzle,
  SolverResult,
} from "../types/difficulty.js";
import type { GeneratePuzzleOptions } from "../types/generator.js";
import type { ApplyMoveResult } from "../play/applyMove.js";
import type { RevealResult, CellDisplayState } from "../hints/index.js";
import type { ImportValidationResult } from "../import/validateImportedPuzzle.js";
import type { TechniqueAnalysis } from "./difficulty.js";
import type { Board } from "./board.js";
import {
  allCellCoordinates,
  boardToString,
  boardsEqual,
  cloneBoard,
  countClues,
  createEmptyBoard,
  isInBounds,
  isValidBoardShape,
  stringToBoard,
} from "./board.js";
import { getCandidates } from "./candidates.js";
import {
  analyzeTechniques,
  getTargetClueCount,
  isClueCountInRange,
  rateDifficulty,
  rateDifficultyByTechniques,
} from "./difficulty.js";
import {
  generatePuzzle,
  generateSolvedBoard,
  removeCells,
  removeCellsSymmetric,
} from "./generator.js";
import {
  getCellDisplayState,
  getGivenCells,
  isGiven,
  revealCell,
  revealNext,
  revealRandom,
} from "./hints.js";
import { puzzleFromString, validateImportedPuzzle } from "./import.js";
import {
  applyMove,
  assertInBounds,
  isBoardComplete,
  isSolvedCorrectly,
} from "./play.js";
import {
  countSolutions,
  findEmptyCell,
  hasUniqueSolution,
  solve,
} from "./solver.js";
import { validateBoard, isValidMove } from "./validation.js";
import type { CreateEngineOptions, SudokuVariant, VariantId } from "./variant.js";
import { getVariant } from "../variants/registry.js";

export interface PuzzleEngine {
  readonly variant: SudokuVariant;
  readonly variantId: VariantId;

  createEmptyBoard(): Board;
  cloneBoard(board: Board): Board;
  isValidBoardShape(board: unknown): board is Board;
  countClues(board: Board): number;
  boardsEqual(a: Board, b: Board): boolean;
  allCellCoordinates(): { row: number; column: number }[];
  boardToString(board: Board): string;
  stringToBoard(serialized: string): Board | null;
  isInBounds(row: number, column: number): boolean;
  assertInBounds(row: number, column: number): void;

  validateBoard(board: Board): boolean;
  isValidMove(board: Board, row: number, column: number, value: number): boolean;
  getCandidates(board: Board, row: number, column: number): number[];

  solve(board: Board): SolverResult;
  countSolutions(board: Board, limit?: number): number;
  hasUniqueSolution(board: Board): boolean;
  findEmptyCell(board: Board): { row: number; column: number } | null;

  generateSolvedBoard(): Board;
  generatePuzzle(
    difficulty: Difficulty,
    options?: GeneratePuzzleOptions,
  ): GeneratedPuzzle | null;
  removeCells(
    solution: Board,
    targetClues: number,
    maxAttempts: number,
  ): Board | null;
  removeCellsSymmetric(
    solution: Board,
    targetClues: number,
    maxAttempts: number,
  ): Board | null;

  rateDifficulty(board: Board): Difficulty;
  getTargetClueCount(difficulty: Difficulty): number;
  isClueCountInRange(difficulty: Difficulty, clueCount: number): boolean;
  rateDifficultyByTechniques(board: Board): Difficulty;
  analyzeTechniques(board: Board): TechniqueAnalysis;

  applyMove(
    board: Board,
    row: number,
    column: number,
    value: number | null,
    puzzle?: Board,
  ): ApplyMoveResult;
  isBoardComplete(board: Board): boolean;
  isSolvedCorrectly(board: Board, solution: Board): boolean;

  isGiven(puzzle: Board, row: number, column: number): boolean;
  getGivenCells(puzzle: Board): { row: number; column: number }[];
  revealCell(
    board: Board,
    solution: Board,
    row: number,
    column: number,
    puzzle?: Board,
  ): RevealResult | null;
  revealNext(
    board: Board,
    solution: Board,
    puzzle?: Board,
  ): RevealResult | null;
  revealRandom(
    board: Board,
    solution: Board,
    puzzle?: Board,
  ): RevealResult | null;
  getCellDisplayState(
    puzzle: Board,
    board: Board,
    solution: Board,
    row: number,
    column: number,
  ): CellDisplayState;

  puzzleFromString(serialized: string): Board | null;
  validateImportedPuzzle(board: Board): ImportValidationResult;
}

class PuzzleEngineImpl implements PuzzleEngine {
  readonly variant: SudokuVariant;
  readonly variantId: VariantId;

  constructor(variant: SudokuVariant) {
    this.variant = variant;
    this.variantId = variant.id;
  }

  createEmptyBoard(): Board {
    return createEmptyBoard(this.variant);
  }

  cloneBoard(board: Board): Board {
    return cloneBoard(board);
  }

  isValidBoardShape(board: unknown): board is Board {
    return isValidBoardShape(this.variant, board);
  }

  countClues(board: Board): number {
    return countClues(board);
  }

  boardsEqual(a: Board, b: Board): boolean {
    return boardsEqual(a, b);
  }

  allCellCoordinates(): { row: number; column: number }[] {
    return allCellCoordinates(this.variant);
  }

  boardToString(board: Board): string {
    return boardToString(this.variant, board);
  }

  stringToBoard(serialized: string): Board | null {
    return stringToBoard(this.variant, serialized);
  }

  isInBounds(row: number, column: number): boolean {
    return isInBounds(this.variant, row, column);
  }

  assertInBounds(row: number, column: number): void {
    assertInBounds(this.variant, row, column);
  }

  validateBoard(board: Board): boolean {
    return validateBoard(this.variant, board);
  }

  isValidMove(
    board: Board,
    row: number,
    column: number,
    value: number,
  ): boolean {
    return isValidMove(this.variant, board, row, column, value);
  }

  getCandidates(board: Board, row: number, column: number): number[] {
    return getCandidates(this.variant, board, row, column);
  }

  solve(board: Board): SolverResult {
    return solve(this.variant, board);
  }

  countSolutions(board: Board, limit?: number): number {
    return countSolutions(this.variant, board, limit);
  }

  hasUniqueSolution(board: Board): boolean {
    return hasUniqueSolution(this.variant, board);
  }

  findEmptyCell(board: Board): { row: number; column: number } | null {
    return findEmptyCell(this.variant, board);
  }

  generateSolvedBoard(): Board {
    return generateSolvedBoard(this.variant);
  }

  generatePuzzle(
    difficulty: Difficulty,
    options?: GeneratePuzzleOptions,
  ): GeneratedPuzzle | null {
    return generatePuzzle(this.variant, difficulty, options);
  }

  removeCells(
    solution: Board,
    targetClues: number,
    maxAttempts: number,
  ): Board | null {
    return removeCells(this.variant, solution, targetClues, maxAttempts);
  }

  removeCellsSymmetric(
    solution: Board,
    targetClues: number,
    maxAttempts: number,
  ): Board | null {
    return removeCellsSymmetric(
      this.variant,
      solution,
      targetClues,
      maxAttempts,
    );
  }

  rateDifficulty(board: Board): Difficulty {
    return rateDifficulty(this.variant, board);
  }

  getTargetClueCount(difficulty: Difficulty): number {
    return getTargetClueCount(this.variant, difficulty);
  }

  isClueCountInRange(difficulty: Difficulty, clueCount: number): boolean {
    return isClueCountInRange(this.variant, difficulty, clueCount);
  }

  rateDifficultyByTechniques(board: Board): Difficulty {
    return rateDifficultyByTechniques(this.variant, board);
  }

  analyzeTechniques(board: Board): TechniqueAnalysis {
    return analyzeTechniques(this.variant, board);
  }

  applyMove(
    board: Board,
    row: number,
    column: number,
    value: number | null,
    puzzle?: Board,
  ): ApplyMoveResult {
    return applyMove(this.variant, board, row, column, value, puzzle);
  }

  isBoardComplete(board: Board): boolean {
    return isBoardComplete(this.variant, board);
  }

  isSolvedCorrectly(board: Board, solution: Board): boolean {
    return isSolvedCorrectly(this.variant, board, solution);
  }

  isGiven(puzzle: Board, row: number, column: number): boolean {
    return isGiven(puzzle, row, column);
  }

  getGivenCells(puzzle: Board): { row: number; column: number }[] {
    return getGivenCells(this.variant, puzzle);
  }

  revealCell(
    board: Board,
    solution: Board,
    row: number,
    column: number,
    puzzle?: Board,
  ): RevealResult | null {
    return revealCell(this.variant, board, solution, row, column, puzzle);
  }

  revealNext(
    board: Board,
    solution: Board,
    puzzle?: Board,
  ): RevealResult | null {
    return revealNext(this.variant, board, solution, puzzle);
  }

  revealRandom(
    board: Board,
    solution: Board,
    puzzle?: Board,
  ): RevealResult | null {
    return revealRandom(this.variant, board, solution, puzzle);
  }

  getCellDisplayState(
    puzzle: Board,
    board: Board,
    solution: Board,
    row: number,
    column: number,
  ): CellDisplayState {
    return getCellDisplayState(puzzle, board, solution, row, column);
  }

  puzzleFromString(serialized: string): Board | null {
    return puzzleFromString(this.variant, serialized);
  }

  validateImportedPuzzle(board: Board): ImportValidationResult {
    return validateImportedPuzzle(this.variant, board);
  }
}

let classicEngine: PuzzleEngine | null = null;

export function createEngine(options?: CreateEngineOptions): PuzzleEngine {
  const variantId = options?.variant ?? "classic";
  return new PuzzleEngineImpl(getVariant(variantId));
}

export function getClassicEngine(): PuzzleEngine {
  if (!classicEngine) {
    classicEngine = createEngine({ variant: "classic" });
  }
  return classicEngine;
}

export type { TechniqueAnalysis };
