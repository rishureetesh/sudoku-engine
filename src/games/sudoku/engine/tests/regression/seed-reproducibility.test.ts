import { describe, expect, it } from "vitest";
import { generateOne } from "../../batch/SudokuEngine.js";
import { dailyPuzzle, dateToSeed } from "../../daily/dailyPuzzle.js";
import { setGlobalSeed, clearGlobalSeed } from "../../utils/random.js";
import { createEngine } from "../../core/engine.js";

describe("regression: seeded generation is reproducible", () => {
  it("generateOne with same seed", () => {
    const a = generateOne({ difficulty: "hard", seed: 999 });
    const b = generateOne({ difficulty: "hard", seed: 999 });
    expect(a.puzzle).toEqual(b.puzzle);
    expect(a.solution).toEqual(b.solution);
  });

  it("daily puzzle matches generateOne seed", () => {
    const seed = dateToSeed("2026-01-01");
    const daily = dailyPuzzle("2026-01-01", "medium");
    const direct = generateOne({ difficulty: "medium", seed });
    expect(daily.puzzle).toEqual(direct.puzzle);
  });

  it("revealRandom respects global seed", () => {
    const engine = createEngine({ variant: "classic" });
    const game = engine.generatePuzzle("easy")!;
    const board = engine.cloneBoard(game.puzzle);

    setGlobalSeed(4242);
    const a = engine.revealRandom(board, game.solution, game.puzzle);
    setGlobalSeed(4242);
    const b = engine.revealRandom(board, game.solution, game.puzzle);
    clearGlobalSeed();

    expect(a).toEqual(b);
  });
});
