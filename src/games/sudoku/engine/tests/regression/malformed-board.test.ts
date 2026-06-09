import { describe, expect, it } from "vitest";
import { createEngine } from "../../core/engine.js";

describe("regression: malformed boards must not validate", () => {
  const engine = createEngine({ variant: "classic" });

  it("rejects ragged rows", () => {
    const board = Array.from({ length: 9 }, (_, row) =>
      Array.from({ length: row === 8 ? 3 : 9 }, () => null),
    );
    expect(engine.isValidBoardShape(board)).toBe(false);
    expect(engine.validateBoard(board as never)).toBe(false);
  });

  it("rejects short outer array", () => {
    const board = engine.createEmptyBoard().slice(0, 5);
    expect(engine.validateBoard(board as never)).toBe(false);
  });

  it("rejects out-of-range digits on 6x6", () => {
    const mini = createEngine({ variant: "6x6" });
    const board = mini.createEmptyBoard();
    board[0]![0] = 9;
    expect(mini.validateBoard(board)).toBe(false);
  });
});
