import { describe, expect, it } from "vitest";
import { generatePuzzle } from "../generator/generatePuzzle.js";
import {
  getCellDisplayState,
  getGivenCells,
  isGiven,
  revealCell,
  revealNext,
  revealRandom,
} from "../hints/index.js";
import { boardsEqual } from "../utils/board.js";

describe("hints", () => {
  const game = generatePuzzle("medium")!;
  const { puzzle, solution } = game;
  const board = puzzle.map((row) => [...row]);

  it("marks givens from the puzzle", () => {
    expect(isGiven(puzzle, 0, 0)).toBe(puzzle[0]![0] !== null);
    expect(getGivenCells(puzzle).length).toBe(game.clueCount);
  });

  it("reveals one cell from the solution", () => {
    let emptyRow = 0;
    let emptyCol = 0;
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (puzzle[r]![c] === null) {
          emptyRow = r;
          emptyCol = c;
          break;
        }
      }
    }

    const result = revealCell(board, solution, emptyRow, emptyCol, puzzle);
    expect(result).not.toBeNull();
    expect(result!.value).toBe(solution[emptyRow]![emptyCol]);
    expect(result!.board[emptyRow]![emptyCol]).toBe(result!.value);
  });

  it("skips givens on reveal", () => {
    const given = getGivenCells(puzzle)[0]!;
    expect(revealCell(board, solution, given.row, given.column, puzzle)).toBeNull();
  });

  it("revealNext fills the first wrong or empty cell", () => {
    const result = revealNext(board, solution, puzzle);
    expect(result).not.toBeNull();
    expect(result!.board[result!.row]![result!.column]).toBe(result!.value);
  });

  it("getCellDisplayState", () => {
    expect(getCellDisplayState(puzzle, board, solution, 0, 0)).toBe(
      puzzle[0]![0] === null ? "empty" : "given",
    );
  });

  it("revealRandom fills a cell", () => {
    const result = revealRandom(board, solution, puzzle);
    expect(result).not.toBeNull();
  });

  it("returns null when the board matches the solution", () => {
    const solved = solution.map((row) => [...row]);
    expect(revealNext(solved, solution, puzzle)).toBeNull();
    expect(boardsEqual(solved, solution)).toBe(true);
  });
});
