import { getClassicEngine } from "../core/engine.js";
import type { Board } from "../types/board.js";

export interface ImportedPuzzle {
  readonly puzzle: Board;
  readonly solution: Board;
  readonly clueCount: number;
}

export interface ImportValidationResult {
  readonly valid: boolean;
  readonly unique: boolean;
  readonly solvable: boolean;
  readonly puzzle?: ImportedPuzzle;
  readonly error?: string;
}

const engine = getClassicEngine();

export function puzzleFromString(serialized: string): Board | null {
  return engine.puzzleFromString(serialized);
}

export function validateImportedPuzzle(board: Board): ImportValidationResult {
  return engine.validateImportedPuzzle(board);
}
