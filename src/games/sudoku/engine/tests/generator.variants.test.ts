import { describe, expect, it } from "vitest";
import { ALL_VARIANTS, engineFor } from "./helpers/variants.js";
import { testDifficulty, withVariantSeed } from "./helpers/seeded.js";

describe("generator by variant", () => {
  it.each(ALL_VARIANTS)("%s puzzle meets invariants", (variant) => {
    withVariantSeed(variant, () => {
      const engine = engineFor(variant);
      const game = engine.generatePuzzle(testDifficulty(variant, "medium"));
      expect(game).not.toBeNull();

      expect(engine.validateBoard(game!.puzzle)).toBe(true);
      expect(engine.countSolutions(game!.puzzle, 2)).toBe(1);

      for (let row = 0; row < engine.variant.grid.size; row++) {
        for (let column = 0; column < engine.variant.grid.size; column++) {
          const clue = game!.puzzle[row]![column];
          if (clue !== null) {
            expect(game!.solution[row]![column]).toBe(clue);
          }
        }
      }

      const board = engine.generateSolvedBoard();
      expect(engine.validateBoard(board)).toBe(true);
      expect(engine.countSolutions(board, 2)).toBe(1);
    });
  });
});
