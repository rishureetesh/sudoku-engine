import { describe, expect, it } from "vitest";
import { ALL_VARIANTS, engineFor } from "./helpers/variants.js";
import { fixtureSolvedBoard, hyperSolvedBoard } from "./helpers/fixtures.js";
import { withVariantSeed } from "./helpers/seeded.js";

describe("validation by variant", () => {
  it.each(ALL_VARIANTS)("%s solved board is valid", (variant) => {
    const engine = engineFor(variant);
    const board =
      variant === "hyper" ? hyperSolvedBoard() : fixtureSolvedBoard(variant);
    expect(engine.validateBoard(board)).toBe(true);
  });

  it.each(ALL_VARIANTS)("%s duplicate in row is invalid", (variant) => {
    const engine = engineFor(variant);
    const board =
      variant === "hyper" ? hyperSolvedBoard() : fixtureSolvedBoard(variant);
    board[0]![1] = board[0]![0] ?? null;
    expect(engine.validateBoard(board)).toBe(false);
  });

  it.each(ALL_VARIANTS)("%s duplicate in column is invalid", (variant) => {
    const engine = engineFor(variant);
    const board =
      variant === "hyper" ? hyperSolvedBoard() : fixtureSolvedBoard(variant);
    board[1]![0] = board[0]![0] ?? null;
    expect(engine.validateBoard(board)).toBe(false);
  });

  it.each(ALL_VARIANTS)("%s duplicate in region is invalid", (variant) => {
    const engine = engineFor(variant);
    const board =
      variant === "hyper" ? hyperSolvedBoard() : fixtureSolvedBoard(variant);
    const { boxRows, boxCols } = engine.variant.grid;
    board[boxRows - 1]![boxCols - 1] = board[0]![0] ?? null;
    expect(engine.validateBoard(board)).toBe(false);
  });
});

describe("diagonal validation", () => {
  it("duplicate on main diagonal is invalid", () => {
    withVariantSeed("diagonal", () => {
      const engine = engineFor("diagonal");
      const board = fixtureSolvedBoard("diagonal");
      const size = engine.variant.grid.size;
      const main = board[0]![0]!;

      for (let i = 1; i < size; i++) {
        board[i]![i] = main;
        expect(engine.validateBoard(board)).toBe(false);
        return;
      }
    });
  });

  it("duplicate on anti diagonal is invalid", () => {
    withVariantSeed("diagonal", () => {
      const engine = engineFor("diagonal");
      const board = fixtureSolvedBoard("diagonal");
      const size = engine.variant.grid.size;
      const anchor = board[0]![size - 1]!;
      board[1]![size - 2] = anchor;
      expect(engine.validateBoard(board)).toBe(false);
    });
  });

  it("candidates on main diagonal exclude diagonal peers", () => {
    withVariantSeed("diagonal", () => {
      const engine = engineFor("diagonal");
      const solution = fixtureSolvedBoard("diagonal");
      const board = engine.cloneBoard(solution);
      board[4]![4] = null;

      const candidates = engine.getCandidates(board, 4, 4);
      for (let i = 0; i < 9; i++) {
        if (i === 4) continue;
        const peer = solution[i]![i]!;
        expect(candidates).not.toContain(peer);
      }
    });
  });
});

describe("hyper validation", () => {
  const hyperRegions = [
    { name: "top", cells: [[1, 3], [2, 4], [3, 5]] as const },
    { name: "left", cells: [[3, 1], [4, 2], [5, 3]] as const },
    { name: "right", cells: [[3, 7], [4, 6], [5, 5]] as const },
    { name: "bottom", cells: [[7, 5], [6, 4], [5, 3]] as const },
  ];

  it.each(hyperRegions)("duplicate in $name hyper region is invalid", ({ cells }) => {
    const engine = engineFor("hyper");
    const board = hyperSolvedBoard();
    const [anchorRow, anchorCol] = cells[0]!;
    const duplicate = board[anchorRow]![anchorCol]!;

    for (let i = 1; i < cells.length; i++) {
      const [row, column] = cells[i]!;
      board[row]![column] = duplicate;
      expect(engine.validateBoard(board)).toBe(false);
      return;
    }
  });

  it("candidates in hyper region exclude hyper peers", () => {
    const engine = engineFor("hyper");
    const solution = hyperSolvedBoard();
    const board = engine.cloneBoard(solution);
    board[2]![4] = null;

    const candidates = engine.getCandidates(board, 2, 4);
    expect(candidates).not.toContain(solution[1]![3]!);
    expect(candidates).not.toContain(solution[3]![4]!);
  });
});
