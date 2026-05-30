import { describe, expect, it } from "vitest";
import { CLUE_RANGES, DIFFICULTIES } from "../constants/index.js";
import { isClueCountInRange, rateDifficulty } from "../difficulty/index.js";
import { generatePuzzle, generateSolvedBoard } from "../generator/index.js";
import { countSolutions, solve } from "../solver/index.js";
import type { Difficulty } from "../types/difficulty.js";
import { boardsEqual, countClues } from "../utils/board.js";
import { validateBoard } from "../validation/validateBoard.js";

describe("generateSolvedBoard", () => {
  it("generates a complete valid board", () => {
    const board = generateSolvedBoard();
    expect(validateBoard(board)).toBe(true);
    expect(board.every((row) => row.every((cell) => cell !== null))).toBe(true);
  });
});

describe("generatePuzzle", () => {
  it.each(DIFFICULTIES)(
    "generates a unique %s puzzle in clue range",
    (difficulty: Difficulty) => {
      const result = generatePuzzle(difficulty);
      expect(result).not.toBeNull();
      expect(result!.difficulty).toBe(difficulty);
      expect(isClueCountInRange(difficulty, result!.clueCount)).toBe(true);
      expect(countSolutions(result!.puzzle)).toBe(1);
      expect(validateBoard(result!.puzzle)).toBe(true);

      const solved = solve(result!.puzzle);
      expect(solved.solved).toBe(true);
      expect(boardsEqual(solved.board, result!.solution)).toBe(true);
      expect(rateDifficulty(result!.puzzle)).toBe(difficulty);
    },
    20_000,
  );

  it("preserves givens in the solution", () => {
    const result = generatePuzzle("medium")!;
    for (let row = 0; row < 9; row++) {
      for (let column = 0; column < 9; column++) {
        const clue = result.puzzle[row]![column];
        if (clue !== null) {
          expect(result.solution[row]![column]).toBe(clue);
        }
      }
    }
  });
});

describe("rateDifficulty", () => {
  it("classifies by clue count", () => {
    const puzzle = generatePuzzle("hard")!;
    expect(rateDifficulty(puzzle.puzzle)).toBe("hard");
    expect(countClues(puzzle.puzzle)).toBeGreaterThanOrEqual(
      CLUE_RANGES.hard.min,
    );
  });
});
