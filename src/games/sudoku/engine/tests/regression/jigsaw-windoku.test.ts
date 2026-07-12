import { describe, expect, it } from "vitest";
import {
  CLASSIC_GRID,
  DEFAULT_JIGSAW_REGION_MAP,
  buildIrregularRegionHouses,
  buildWindokuRegionHouses,
} from "../../core/houses.js";
import { createEngine } from "../../core/engine.js";
import { withVariantSeed } from "../helpers/seeded.js";

describe("regression: windoku regions", () => {
  it("defines four 3×3 windows at inner corners", () => {
    const regions = buildWindokuRegionHouses(CLASSIC_GRID);
    expect(regions).toHaveLength(4);
    expect(regions.map((r) => r.id)).toEqual([
      "windoku-tl",
      "windoku-tr",
      "windoku-bl",
      "windoku-br",
    ]);
    expect(regions.every((r) => r.cells.length === 9)).toBe(true);
  });

  it("rejects duplicate digits in a windoku window", () => {
    withVariantSeed("windoku", () => {
      const engine = createEngine({ variant: "windoku" });
      const board = engine.generateSolvedBoard();
      // Cell (1,1) and (1,2) are both in windoku-tl
      board[1]![2] = board[1]![1] ?? null;
      expect(engine.validateBoard(board)).toBe(false);
    });
  });

  it("candidates exclude windoku window peers", () => {
    withVariantSeed("windoku", () => {
      const engine = createEngine({ variant: "windoku" });
      const solution = engine.generateSolvedBoard();
      const board = engine.cloneBoard(solution);
      board[2]![2] = null;
      const candidates = engine.getCandidates(board, 2, 2);
      expect(candidates).not.toContain(solution[1]![1]!);
      expect(candidates).not.toContain(solution[3]![3]!);
    });
  });
});

describe("regression: jigsaw regions", () => {
  it("default region map partitions the board into nine regions of nine", () => {
    const houses = buildIrregularRegionHouses(
      CLASSIC_GRID,
      DEFAULT_JIGSAW_REGION_MAP,
    );
    expect(houses).toHaveLength(9);
    expect(houses.every((h) => h.cells.length === 9)).toBe(true);
  });

  it("rejects invalid region maps", () => {
    const bad = DEFAULT_JIGSAW_REGION_MAP.map((row) => [...row]);
    bad[0]![0] = 1; // unbalances region 0 and 1
    expect(() =>
      buildIrregularRegionHouses(CLASSIC_GRID, bad),
    ).toThrow(/Region 0 must have 9 cells/);
  });

  it("rejects duplicate digits in an irregular region", () => {
    withVariantSeed("jigsaw", () => {
      const engine = createEngine({ variant: "jigsaw" });
      const board = engine.generateSolvedBoard();
      // Find two cells in region-0
      const region0 = engine.variant.houses.houses.find(
        (h) => h.id === "region-0",
      )!;
      const a = region0.cells[0]!;
      const b = region0.cells[1]!;
      const size = engine.variant.grid.size;
      const ar = Math.floor(a / size);
      const ac = a % size;
      const br = Math.floor(b / size);
      const bc = b % size;
      board[br]![bc] = board[ar]![ac] ?? null;
      expect(engine.validateBoard(board)).toBe(false);
    });
  });

  it("standard 3×3 box is not a uniqueness house", () => {
    withVariantSeed("jigsaw", () => {
      const engine = createEngine({ variant: "jigsaw" });
      const board = engine.generateSolvedBoard();
      // Top-left 3×3 is not a jigsaw region; swapping may still break row/col/region.
      // Instead assert house list has no classic box regions from buildRegionHouses:
      // jigsaw uses region-0..8 only (plus rows/cols).
      const regionHouses = engine.variant.houses.houses.filter(
        (h) => h.kind === "region",
      );
      expect(regionHouses).toHaveLength(9);
      expect(regionHouses.every((h) => h.id.startsWith("region-"))).toBe(true);
      expect(engine.variant.houses.houses).toHaveLength(27);
      void board;
    });
  });
});
