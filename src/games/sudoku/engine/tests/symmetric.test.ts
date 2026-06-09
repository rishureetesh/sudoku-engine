import { describe, expect, it } from "vitest";
import { generatePuzzle } from "../generator/generatePuzzle.js";
import { hasUniqueSolution } from "../solver/countSolutions.js";

function isEmpty(value: number | null): boolean {
  return value === null;
}

describe("symmetric generation", () => {
  it("mirrors empty cells around the center", () => {
    const game = generatePuzzle("medium", { symmetric: true });
    expect(game).not.toBeNull();
    expect(hasUniqueSolution(game!.puzzle)).toBe(true);

    const { puzzle } = game!;
    for (let row = 0; row < 9; row++) {
      for (let column = 0; column < 9; column++) {
        const mirrorRow = 8 - row;
        const mirrorCol = 8 - column;
        expect(isEmpty(puzzle[row]![column] ?? null)).toBe(
          isEmpty(puzzle[mirrorRow]![mirrorCol] ?? null),
        );
      }
    }
  });
});
