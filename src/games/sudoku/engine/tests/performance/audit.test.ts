/**
 * Optional deep-dive timing report. NOT part of `npm test`.
 * Run: npm run perf:audit
 *
 * Generates one puzzle per variant, then times each operation once.
 */
import { describe, it, beforeAll } from "vitest";
import type { GeneratedPuzzle } from "../../types/difficulty.js";
import type { VariantId } from "../../types/variant.js";
import { setGlobalSeed, clearGlobalSeed } from "../../utils/random.js";
import { ALL_VARIANTS, engineFor } from "../helpers/variants.js";
import type { PuzzleEngine } from "../../core/engine.js";

const SEEDS: Record<VariantId, number> = {
  classic: 42,
  "6x6": 42,
  diagonal: 42,
  hyper: 103,
};

function once(run: () => void): number {
  const t0 = performance.now();
  run();
  return performance.now() - t0;
}

describe("performance audit (report only)", () => {
  for (const variant of ALL_VARIANTS) {
    describe(variant, () => {
      let engine: PuzzleEngine;
      let puzzle: GeneratedPuzzle;

      beforeAll(() => {
        setGlobalSeed(SEEDS[variant]);
        engine = engineFor(variant);
        const game = engine.generatePuzzle(variant === "hyper" ? "easy" : "medium");
        if (!game) {
          throw new Error(`generatePuzzle returned null for ${variant}`);
        }
        puzzle = game;
        clearGlobalSeed();
      });

      it("prints timings", () => {
        setGlobalSeed(SEEDS[variant]);
        engine.generateSolvedBoard();
        const size = engine.variant.grid.size;
        const row: Record<string, number> = {
          houses: engine.variant.houses.houses.length,
          generateSolvedBoard: once(() => engine.generateSolvedBoard()),
          generatePuzzle: once(() => {
            const g = engine.generatePuzzle(
              variant === "hyper" ? "easy" : "medium",
            );
            if (!g) throw new Error("null");
          }),
          solve: once(() => engine.solve(puzzle.puzzle)),
          validateBoard: once(() => engine.validateBoard(puzzle.puzzle)),
          hasUniqueSolution: once(() =>
            engine.hasUniqueSolution(puzzle.puzzle),
          ),
          countSolutions: once(() =>
            engine.countSolutions(puzzle.puzzle, 2),
          ),
          getCandidatesFull: once(() => {
            for (let r = 0; r < size; r++) {
              for (let c = 0; c < size; c++) {
                engine.getCandidates(puzzle.puzzle, r, c);
              }
            }
          }),
          rateDifficulty: once(() => engine.rateDifficulty(puzzle.puzzle)),
          analyzeTechniques: once(() =>
            engine.analyzeTechniques(puzzle.puzzle),
          ),
        };

        console.log(JSON.stringify({ variant, size, ms: row }));
        clearGlobalSeed();
      });
    });
  }
});
