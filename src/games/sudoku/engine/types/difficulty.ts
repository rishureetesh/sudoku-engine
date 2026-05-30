import type { Board } from "./board.js";

export type Difficulty = "easy" | "medium" | "hard" | "expert";

export interface SolverResult {
  readonly solved: boolean;
  readonly board: Board;
}

export interface GeneratedPuzzle {
  readonly difficulty: Difficulty;
  readonly puzzle: Board;
  readonly solution: Board;
  readonly clueCount: number;
}

export type DifficultyDistribution = Readonly<Record<Difficulty, number>>;

export interface GenerateBatchOptions {
  readonly count: number;
  readonly distribution?: Partial<DifficultyDistribution>;
}

export interface GenerateOneOptions {
  readonly difficulty: Difficulty;
  readonly seed?: number;
}

export interface SudokuEngineOptions {
  readonly seed?: number;
}
