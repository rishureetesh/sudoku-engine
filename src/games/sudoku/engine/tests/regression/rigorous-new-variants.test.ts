import { describe, expect, it } from "vitest";
import { createEngine } from "../../core/engine.js";
import {
  DEFAULT_JIGSAW_REGION_MAP,
  buildIrregularRegionHouses,
  buildWindokuRegionHouses,
  CLASSIC_GRID,
} from "../../core/houses.js";
import { SudokuEngine } from "../../batch/SudokuEngine.js";
import { listVariants, getVariant } from "../../variants/registry.js";
import { setGlobalSeed, clearGlobalSeed } from "../../utils/random.js";
import type { VariantId } from "../../types/variant.js";

const NEW_VARIANTS: VariantId[] = ["windoku", "jigsaw"];
const SEEDS = [42, 103, 107, 200, 999, 2026, 7, 77];

describe("rigorous: windoku + jigsaw", () => {
  it("registry exposes both presets", () => {
    const ids = listVariants().map((v) => v.id);
    expect(ids).toContain("windoku");
    expect(ids).toContain("jigsaw");
    expect(getVariant("windoku").houses.houses.length).toBe(31);
    expect(getVariant("jigsaw").houses.houses.length).toBe(27);
  });

  it("windoku windows differ from hyper windows", () => {
    const windoku = buildWindokuRegionHouses(CLASSIC_GRID).map((h) =>
      [...h.cells].sort((a, b) => a - b).join(","),
    );
    const hyper = getVariant("hyper")
      .houses.houses.filter((h) => h.kind === "hyper")
      .map((h) => [...h.cells].sort((a, b) => a - b).join(","));
    for (const w of windoku) {
      expect(hyper).not.toContain(w);
    }
  });

  it("jigsaw map is a valid partition", () => {
    const houses = buildIrregularRegionHouses(
      CLASSIC_GRID,
      DEFAULT_JIGSAW_REGION_MAP,
    );
    const seen = new Set<number>();
    for (const h of houses) {
      expect(h.cells).toHaveLength(9);
      for (const cell of h.cells) {
        expect(seen.has(cell)).toBe(false);
        seen.add(cell);
      }
    }
    expect(seen.size).toBe(81);
  });

  it.each(NEW_VARIANTS)(
    "%s generates unique valid puzzles across many seeds",
    (variant) => {
      const engine = createEngine({ variant });
      for (const seed of SEEDS) {
        setGlobalSeed(seed);
        try {
          const game = engine.generatePuzzle("easy");
          expect(game, `null puzzle for ${variant} seed ${seed}`).not.toBeNull();
          expect(engine.validateBoard(game!.puzzle)).toBe(true);
          expect(engine.validateBoard(game!.solution)).toBe(true);
          expect(engine.countSolutions(game!.puzzle, 2)).toBe(1);
          expect(engine.isClueCountInRange("easy", game!.clueCount)).toBe(true);

          const solved = engine.solve(game!.puzzle);
          expect(solved.solved).toBe(true);
          expect(engine.boardsEqual(solved.board, game!.solution)).toBe(true);

          for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
              const clue = game!.puzzle[r]![c];
              if (clue !== null) {
                expect(game!.solution[r]![c]).toBe(clue);
              }
            }
          }
        } finally {
          clearGlobalSeed();
        }
      }
    },
    60_000,
  );

  it("windoku enforces window uniqueness on all four windows", () => {
    setGlobalSeed(42);
    try {
      const engine = createEngine({ variant: "windoku" });
      const solution = engine.generateSolvedBoard();
      const windows = buildWindokuRegionHouses(CLASSIC_GRID);
      for (const window of windows) {
        const board = solution.map((row) => [...row]);
        const a = window.cells[0]!;
        const b = window.cells[1]!;
        const ar = Math.floor(a / 9);
        const ac = a % 9;
        const br = Math.floor(b / 9);
        const bc = b % 9;
        board[br]![bc] = board[ar]![ac] ?? null;
        expect(engine.validateBoard(board), window.id).toBe(false);
      }
    } finally {
      clearGlobalSeed();
    }
  });

  it("jigsaw enforces every irregular region", () => {
    setGlobalSeed(107);
    try {
      const engine = createEngine({ variant: "jigsaw" });
      const solution = engine.generateSolvedBoard();
      const regions = engine.variant.houses.houses.filter(
        (h) => h.kind === "region",
      );
      expect(regions).toHaveLength(9);
      for (const region of regions) {
        const board = solution.map((row) => [...row]);
        const a = region.cells[0]!;
        const b = region.cells[1]!;
        board[Math.floor(b / 9)]![b % 9] =
          board[Math.floor(a / 9)]![a % 9] ?? null;
        expect(engine.validateBoard(board), region.id).toBe(false);
      }
    } finally {
      clearGlobalSeed();
    }
  });

  it("batch generation works for both variants", () => {
    for (const variant of NEW_VARIANTS) {
      const engine = new SudokuEngine({ variant, seed: 100 });
      const batch = engine.generateBatch({ count: 4 });
      expect(batch).toHaveLength(4);
      const puzzleEngine = createEngine({ variant });
      for (const item of batch) {
        expect(puzzleEngine.countSolutions(item.puzzle, 2)).toBe(1);
        expect(puzzleEngine.validateBoard(item.puzzle)).toBe(true);
      }
    }
  }, 90_000);
});
