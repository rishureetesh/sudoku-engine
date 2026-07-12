import type { Board } from "../../core/board.js";
import { createEngine } from "../../core/engine.js";
import type { GeneratedPuzzle } from "../../types/difficulty.js";
import type { Difficulty } from "../../types/difficulty.js";
import type { VariantId } from "../../types/variant.js";
import { testDifficulty, withVariantSeed } from "./seeded.js";

interface FixtureStore {
  puzzles: Map<string, GeneratedPuzzle>;
  hyperSolved: Board | null;
}

function store(): FixtureStore {
  const key = "__sudokuEngineFixtures__" as const;
  const g = globalThis as typeof globalThis & { [key]?: FixtureStore };
  if (!g[key]) {
    g[key] = { puzzles: new Map(), hyperSolved: null };
  }
  return g[key]!;
}

function clonePuzzle(game: GeneratedPuzzle): GeneratedPuzzle {
  return {
    difficulty: game.difficulty,
    clueCount: game.clueCount,
    puzzle: game.puzzle.map((row) => [...row]),
    solution: game.solution.map((row) => [...row]),
  };
}

export function hyperSolvedBoard(): Board {
  const cache = store();
  if (!cache.hyperSolved) {
    withVariantSeed("hyper", () => {
      cache.hyperSolved = createEngine({ variant: "hyper" }).generateSolvedBoard();
    });
  }
  return cache.hyperSolved!.map((row) => [...row]);
}

/** One seeded puzzle per variant/difficulty — shared across test files in the same worker. */
export function fixturePuzzle(
  variant: VariantId,
  preferred: Difficulty = "medium",
): GeneratedPuzzle {
  const difficulty = testDifficulty(variant, preferred);
  const key = `${variant}:${difficulty}`;
  const cache = store();
  let game = cache.puzzles.get(key);
  if (!game) {
    withVariantSeed(variant, () => {
      game = createEngine({ variant }).generatePuzzle(difficulty)!;
    });
    cache.puzzles.set(key, game!);
  }
  return clonePuzzle(game!);
}

export function fixtureSolvedBoard(variant: VariantId): Board {
  if (variant === "hyper") {
    return hyperSolvedBoard();
  }
  const key = `${variant}:solved`;
  const cache = store();
  let game = cache.puzzles.get(key);
  if (!game) {
    // Prefer reusing an already-warmed easy puzzle solution (avoids a second fill).
    const easy = cache.puzzles.get(`${variant}:easy`);
    if (easy) {
      game = {
        difficulty: "easy",
        clueCount: 0,
        puzzle: easy.solution,
        solution: easy.solution,
      };
    } else {
      withVariantSeed(variant, () => {
        const board = createEngine({ variant }).generateSolvedBoard();
        game = {
          difficulty: "easy",
          clueCount: 0,
          puzzle: board,
          solution: board,
        };
      });
    }
    cache.puzzles.set(key, game!);
  }
  return game!.solution.map((row) => [...row]);
}
