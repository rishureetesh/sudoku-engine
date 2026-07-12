import { describe, expect, it } from "vitest";

import type { Difficulty } from "../../types/difficulty.js";
import type { VariantId } from "../../types/variant.js";
import { ALL_VARIANTS, engineFor } from "../helpers/variants.js";
import { testDifficulty, withVariantSeed } from "../helpers/seeded.js";

const PROFILE: Record<VariantId, { runs: number; difficulty: Difficulty }> = {
  classic: { runs: 3, difficulty: "medium" },
  "6x6": { runs: 3, difficulty: "medium" },
  diagonal: { runs: 2, difficulty: "medium" },
  hyper: { runs: 1, difficulty: "easy" },
  windoku: { runs: 1, difficulty: "easy" },
  jigsaw: { runs: 1, difficulty: "easy" },
};

describe("property: generated puzzles", () => {
  it.each(ALL_VARIANTS)("%s random samples stay valid and unique", (variant) => {
    withVariantSeed(variant, () => {
      const engine = engineFor(variant);
      const { runs, difficulty } = PROFILE[variant];
      const level = testDifficulty(variant, difficulty);

      for (let i = 0; i < runs; i++) {
        const game = engine.generatePuzzle(level);
        expect(game).not.toBeNull();
        expect(engine.validateBoard(game!.puzzle)).toBe(true);
        expect(engine.countSolutions(game!.puzzle, 2)).toBe(1);

        const solved = engine.solve(game!.puzzle);
        expect(solved.solved).toBe(true);
        expect(engine.boardsEqual(solved.board, game!.solution)).toBe(true);
      }
    });
  });
});

describe("property: isValidMove consistency", () => {
  it.each(ALL_VARIANTS)("%s rejected moves leave board invalid or unchanged", (variant) => {
    withVariantSeed(variant, () => {
      const engine = engineFor(variant);
      const { difficulty } = PROFILE[variant];
      const game = engine.generatePuzzle(testDifficulty(variant, difficulty));
      expect(game).not.toBeNull();

      const board = engine.cloneBoard(game!.puzzle);
      for (let row = 0; row < engine.variant.grid.size; row++) {
        for (let column = 0; column < engine.variant.grid.size; column++) {
          if (board[row]![column] !== null) continue;
          const candidates = engine.getCandidates(board, row, column);
          const bad = candidates[0] === 1 ? 2 : 1;
          if (candidates.includes(bad)) continue;
          expect(engine.isValidMove(board, row, column, bad)).toBe(false);
        }
      }
    });
  });
});
