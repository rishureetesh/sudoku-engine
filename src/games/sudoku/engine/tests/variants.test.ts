import { describe, expect, it } from "vitest";
import { SudokuEngine } from "../batch/SudokuEngine.js";
import { createEngine } from "../core/engine.js";
import { validateBoard } from "../core/validation.js";
import { fixturePuzzle } from "./helpers/fixtures.js";
import { withVariantSeed } from "./helpers/seeded.js";

function diagonalValues(
  board: (number | null)[][],
  main: boolean,
): number[] {
  const size = board.length;
  const values: number[] = [];
  for (let i = 0; i < size; i++) {
    const column = main ? i : size - 1 - i;
    const value = board[i]![column];
    if (value != null) {
      values.push(value);
    }
  }
  return values;
}

function hyperRegionValues(
  board: (number | null)[][],
  region: readonly (readonly [number, number])[],
): number[] {
  return region
    .map(([row, column]) => board[row]![column])
    .filter((value): value is number => value !== null);
}

const HYPER_TOP: readonly (readonly [number, number])[] = [
  [1, 3],
  [1, 4],
  [1, 5],
  [2, 3],
  [2, 4],
  [2, 5],
  [3, 3],
  [3, 4],
  [3, 5],
];

describe("variants", () => {
  it("classic engine keeps 9x9 behavior", () => {
    const engine = createEngine({ variant: "classic" });
    expect(engine.variant.grid.size).toBe(9);
    const game = fixturePuzzle("classic", "medium");
    expect(engine.countSolutions(game.puzzle)).toBe(1);
    expect(engine.validateBoard(game.puzzle)).toBe(true);
  });

  it("6x6 engine generates valid puzzles", () => {
    const engine = createEngine({ variant: "6x6" });
    expect(engine.variant.grid.size).toBe(6);
    expect(engine.variant.grid.boxRows).toBe(2);
    expect(engine.variant.grid.boxCols).toBe(3);

    const game = fixturePuzzle("6x6", "medium");
    expect(game.puzzle).toHaveLength(6);
    expect(game.puzzle.every((row) => row.length === 6)).toBe(true);
    expect(engine.countSolutions(game.puzzle)).toBe(1);
    expect(engine.rateDifficulty(game.puzzle)).toBe("medium");

    const solved = engine.solve(game.puzzle);
    expect(solved.solved).toBe(true);
    expect(engine.boardsEqual(solved.board, game.solution)).toBe(true);

    const analysis = engine.analyzeTechniques(game.puzzle);
    expect(analysis.clueBased).toBeDefined();
    expect(analysis.maxCandidatesSeen).toBeGreaterThanOrEqual(2);
  });

  it("diagonal engine enforces both diagonals", () => {
    const engine = createEngine({ variant: "diagonal" });
    const game = fixturePuzzle("diagonal", "medium");

    const { puzzle, solution } = game;
    expect(engine.countSolutions(puzzle, 2)).toBe(1);
    expect(validateBoard(engine.variant, solution)).toBe(true);
    expect(new Set(diagonalValues(solution, true)).size).toBe(9);
    expect(new Set(diagonalValues(solution, false)).size).toBe(9);

    const board = engine.cloneBoard(puzzle);
    let targetRow = 0;
    let targetColumn = 0;
    for (let i = 0; i < 9; i++) {
      if (board[i]![i] === null) {
        targetRow = i;
        targetColumn = i;
        break;
      }
    }

    const duplicate = solution[0]![0]!;
    board[targetRow]![targetColumn] = duplicate;
    if (targetRow === 0 && targetColumn === 0) {
      board[1]![1] = duplicate;
    }

    expect(engine.validateBoard(board)).toBe(false);
  });

  it("hyper engine enforces four extra regions", () => {
    const engine = createEngine({ variant: "hyper" });
    const game = fixturePuzzle("hyper", "easy");

    const { puzzle, solution } = game;
    expect(engine.countSolutions(puzzle, 2)).toBe(1);
    expect(validateBoard(engine.variant, solution)).toBe(true);
    expect(new Set(hyperRegionValues(solution, HYPER_TOP)).size).toBe(9);

    const board = engine.cloneBoard(solution);
    board[2]![4] = null;
    board[2]![4] = solution[1]![3]!;
    expect(engine.validateBoard(board)).toBe(false);
  });

  it("6x6 batch engine respects variant", () => {
    withVariantSeed("6x6", () => {
      const engine = createEngine({ variant: "6x6" });
      const batch = new SudokuEngine({ variant: "6x6", seed: 100 }).generateBatch({
        count: 4,
      });

      expect(batch).toHaveLength(4);
      for (const item of batch) {
        expect(item.puzzle).toHaveLength(6);
        expect(engine.countSolutions(item.puzzle)).toBe(1);
      }
    });
  });
});
