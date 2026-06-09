import { describe, expect, it } from "vitest";
import { CLASSIC_GRID, buildHyperRegionHouses } from "../../core/houses.js";

describe("regression: hyper region layout", () => {
  it("defines four disjoint-edge 3×3 windows on a 9×9 grid", () => {
    const regions = buildHyperRegionHouses(CLASSIC_GRID);
    expect(regions).toHaveLength(4);
    expect(regions.every((house) => house.cells.length === 9)).toBe(true);

    const top = new Set(regions[0]!.cells);
    const left = new Set(regions[1]!.cells);
    expect(top.has(1 * 9 + 3)).toBe(true);
    expect(top.has(3 * 9 + 5)).toBe(true);
    expect(left.has(3 * 9 + 1)).toBe(true);
    expect(left.has(5 * 9 + 3)).toBe(true);
  });
});
