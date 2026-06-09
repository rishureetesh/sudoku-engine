import { describe, expect, it } from "vitest";
import { BitGrid } from "../../core/bitgrid.js";
import { CLASSIC_VARIANT } from "../../variants/registry.js";

describe("regression: BitGrid.place overwrites safely", () => {
  it("replacing a cell keeps candidate masks consistent", () => {
    const grid = BitGrid.empty(CLASSIC_VARIANT);
    grid.place(0, 0, 1);
    grid.place(0, 0, 2);

    expect(grid.cells[0]).toBe(2);
    expect(grid.candidateMaskAt(0, 1) & (1 << 1)).toBe(0);
  });
});
