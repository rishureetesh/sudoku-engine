import { describe, expect, it } from "vitest";
import { dailyPuzzle, dateToSeed } from "../daily/index.js";
import { generateOne } from "../batch/SudokuEngine.js";

describe("daily puzzle", () => {
  it("is stable for the same date", () => {
    const a = dailyPuzzle("2026-05-30", "hard");
    const b = dailyPuzzle("2026-05-30", "hard");
    expect(a.puzzle).toEqual(b.puzzle);
  });

  it("matches generateOne with the same seed", () => {
    const seed = dateToSeed("2026-01-01");
    const daily = dailyPuzzle("2026-01-01", "medium");
    const direct = generateOne({ difficulty: "medium", seed });
    expect(daily.puzzle).toEqual(direct.puzzle);
  });
});
