import { describe, expect, it } from "vitest";
import { generatePuzzle } from "../generator/generatePuzzle.js";
import {
  puzzleFromString,
  validateImportedPuzzle,
} from "../import/index.js";
import { boardToString } from "../utils/board.js";

describe("import puzzle", () => {
  it("parses and validates a generated puzzle string", () => {
    const game = generatePuzzle("medium")!;
    const text = boardToString(game.puzzle);
    const parsed = puzzleFromString(text);
    expect(parsed).not.toBeNull();
    const result = validateImportedPuzzle(parsed!);
    expect(result.valid).toBe(true);
    expect(result.unique).toBe(true);
    expect(result.solvable).toBe(true);
  });

  it("rejects an invalid string length", () => {
    expect(puzzleFromString("123")).toBeNull();
  });
});
