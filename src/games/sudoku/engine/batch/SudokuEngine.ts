import { DIFFICULTIES } from "../constants/difficulty.js";
import { generatePuzzle } from "../generator/generatePuzzle.js";
import {
  clearGlobalSeed,
  setGlobalSeed,
} from "../utils/random.js";
import type {
  Difficulty,
  DifficultyDistribution,
  GenerateBatchOptions,
  GenerateOneOptions,
  GeneratedPuzzle,
  SudokuEngineOptions,
} from "../types/difficulty.js";
import { assertBatchCount, SudokuEngineError } from "./errors.js";

export function resolveDistribution(
  count: number,
  partial?: Partial<DifficultyDistribution>,
): DifficultyDistribution {
  if (!partial) {
    const base = Math.floor(count / DIFFICULTIES.length);
    let remainder = count % DIFFICULTIES.length;
    const distribution = {} as Record<Difficulty, number>;
    for (const difficulty of DIFFICULTIES) {
      distribution[difficulty] = base + (remainder > 0 ? 1 : 0);
      if (remainder > 0) {
        remainder--;
      }
    }
    return distribution;
  }

  const distribution = {} as Record<Difficulty, number>;
  let sum = 0;
  for (const difficulty of DIFFICULTIES) {
    const value = partial[difficulty] ?? 0;
    if (!Number.isInteger(value) || value < 0) {
      throw new SudokuEngineError(
        `"${difficulty}" count must be a non-negative integer.`,
      );
    }
    distribution[difficulty] = value;
    sum += value;
  }

  if (sum !== count) {
    throw new SudokuEngineError(
      `Counts must add up to ${count} (got ${sum}).`,
    );
  }

  return distribution;
}

export class SudokuEngine {
  private readonly seed?: number;

  constructor(options?: SudokuEngineOptions) {
    this.seed = options?.seed;
  }

  generateOne(options: GenerateOneOptions): GeneratedPuzzle {
    const seed = options.seed ?? this.seed;
    if (seed !== undefined) {
      setGlobalSeed(seed);
    }

    try {
      return this.generateOneWithRetries(options.difficulty, 40);
    } finally {
      if (seed !== undefined) {
        clearGlobalSeed();
      }
    }
  }

  generateBatch(options: GenerateBatchOptions): GeneratedPuzzle[] {
    assertBatchCount(options.count);
    const distribution = resolveDistribution(
      options.count,
      options.distribution,
    );

    const results: GeneratedPuzzle[] = [];
    for (const difficulty of DIFFICULTIES) {
      const needed = distribution[difficulty];
      for (let i = 0; i < needed; i++) {
        const batchSeed =
          this.seed !== undefined ? this.seed + results.length : undefined;
        results.push(
          this.generateOne({
            difficulty,
            seed: batchSeed,
          }),
        );
      }
    }

    return results;
  }

  private generateOneWithRetries(
    difficulty: Difficulty,
    maxRetries: number,
  ): GeneratedPuzzle {
    for (let i = 0; i < maxRetries; i++) {
      const puzzle = generatePuzzle(difficulty);
      if (puzzle && puzzle.difficulty === difficulty) {
        return puzzle;
      }
    }
    throw new SudokuEngineError(
      `Gave up generating ${difficulty} after ${maxRetries} tries.`,
    );
  }
}

export function generateOne(options: GenerateOneOptions): GeneratedPuzzle {
  return new SudokuEngine({ seed: options.seed }).generateOne(options);
}

export function generateBatch(options: GenerateBatchOptions): GeneratedPuzzle[] {
  return new SudokuEngine().generateBatch(options);
}
