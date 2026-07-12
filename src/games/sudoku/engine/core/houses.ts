import {
  cellIndex,
  createGridSpec,
  regionIndex,
  type GridSpec,
} from "./grid-spec.js";

export interface House {
  readonly id: string;
  readonly kind: HouseKind;
  readonly cells: readonly number[];
}

export type HouseKind =
  | "row"
  | "column"
  | "region"
  | "diagonal"
  | "hyper"
  | "windoku"
  | "custom";

export interface HouseSet {
  readonly houses: readonly House[];
  readonly cellHouses: readonly (readonly number[])[];
}

export function buildRowHouses(grid: GridSpec): House[] {
  const houses: House[] = [];
  for (let row = 0; row < grid.size; row++) {
    const cells: number[] = [];
    for (let column = 0; column < grid.size; column++) {
      cells.push(cellIndex(grid, row, column));
    }
    houses.push({ id: `row-${row}`, kind: "row", cells });
  }
  return houses;
}

export function buildColumnHouses(grid: GridSpec): House[] {
  const houses: House[] = [];
  for (let column = 0; column < grid.size; column++) {
    const cells: number[] = [];
    for (let row = 0; row < grid.size; row++) {
      cells.push(cellIndex(grid, row, column));
    }
    houses.push({ id: `col-${column}`, kind: "column", cells });
  }
  return houses;
}

export function buildRegionHouses(grid: GridSpec): House[] {
  const count = (grid.size / grid.boxRows) * (grid.size / grid.boxCols);
  const cellsByRegion: number[][] = Array.from({ length: count }, () => []);

  for (let row = 0; row < grid.size; row++) {
    for (let column = 0; column < grid.size; column++) {
      const region = regionIndex(grid, row, column);
      cellsByRegion[region]!.push(cellIndex(grid, row, column));
    }
  }

  return cellsByRegion.map((cells, region) => ({
    id: `region-${region}`,
    kind: "region" as const,
    cells,
  }));
}

export function buildMainDiagonalHouse(grid: GridSpec): House {
  const cells: number[] = [];
  for (let i = 0; i < grid.size; i++) {
    cells.push(cellIndex(grid, i, i));
  }
  return { id: "diag-main", kind: "diagonal", cells };
}

export function buildAntiDiagonalHouse(grid: GridSpec): House {
  const cells: number[] = [];
  for (let i = 0; i < grid.size; i++) {
    cells.push(cellIndex(grid, i, grid.size - 1 - i));
  }
  return { id: "diag-anti", kind: "diagonal", cells };
}

export function buildCellHouseIndex(
  houses: readonly House[],
  cellCount: number,
): (readonly number[])[] {
  const index: number[][] = Array.from({ length: cellCount }, () => []);
  for (let houseIndex = 0; houseIndex < houses.length; houseIndex++) {
    for (const cell of houses[houseIndex]!.cells) {
      index[cell]!.push(houseIndex);
    }
  }
  return index;
}

export function composeHouses(
  grid: GridSpec,
  parts: readonly House[],
): HouseSet {
  const houses = [...parts];
  return {
    houses,
    cellHouses: buildCellHouseIndex(houses, grid.cellCount),
  };
}

export function standardSudokuHouses(grid: GridSpec): HouseSet {
  return composeHouses(grid, [
    ...buildRowHouses(grid),
    ...buildColumnHouses(grid),
    ...buildRegionHouses(grid),
  ]);
}

export function diagonalSudokuHouses(grid: GridSpec): HouseSet {
  return composeHouses(grid, [
    ...buildRowHouses(grid),
    ...buildColumnHouses(grid),
    ...buildRegionHouses(grid),
    buildMainDiagonalHouse(grid),
    buildAntiDiagonalHouse(grid),
  ]);
}

export function buildRectangularHouse(
  grid: GridSpec,
  id: string,
  topRow: number,
  leftColumn: number,
  height: number,
  width: number,
  kind: HouseKind = "custom",
): House {
  const cells: number[] = [];
  for (let row = topRow; row < topRow + height; row++) {
    for (let column = leftColumn; column < leftColumn + width; column++) {
      cells.push(cellIndex(grid, row, column));
    }
  }
  return { id, kind, cells };
}

/** Four 3×3 windows centered on each edge (standard Hyper Sudoku). */
export function buildHyperRegionHouses(grid: GridSpec): House[] {
  if (grid.size !== 9 || grid.boxRows !== 3 || grid.boxCols !== 3) {
    throw new Error("Hyper regions require a 9×9 grid with 3×3 boxes");
  }

  return [
    buildRectangularHouse(grid, "hyper-top", 1, 3, 3, 3, "hyper"),
    buildRectangularHouse(grid, "hyper-left", 3, 1, 3, 3, "hyper"),
    buildRectangularHouse(grid, "hyper-right", 3, 5, 3, 3, "hyper"),
    buildRectangularHouse(grid, "hyper-bottom", 5, 3, 3, 3, "hyper"),
  ];
}

export function hyperSudokuHouses(grid: GridSpec): HouseSet {
  return composeHouses(grid, [
    ...buildRowHouses(grid),
    ...buildColumnHouses(grid),
    ...buildRegionHouses(grid),
    ...buildHyperRegionHouses(grid),
  ]);
}

/** Four 3×3 windows at the corners of the inner 7×7 (standard Windoku). */
export function buildWindokuRegionHouses(grid: GridSpec): House[] {
  if (grid.size !== 9 || grid.boxRows !== 3 || grid.boxCols !== 3) {
    throw new Error("Windoku regions require a 9×9 grid with 3×3 boxes");
  }

  return [
    buildRectangularHouse(grid, "windoku-tl", 1, 1, 3, 3, "windoku"),
    buildRectangularHouse(grid, "windoku-tr", 1, 5, 3, 3, "windoku"),
    buildRectangularHouse(grid, "windoku-bl", 5, 1, 3, 3, "windoku"),
    buildRectangularHouse(grid, "windoku-br", 5, 5, 3, 3, "windoku"),
  ];
}

export function windokuSudokuHouses(grid: GridSpec): HouseSet {
  return composeHouses(grid, [
    ...buildRowHouses(grid),
    ...buildColumnHouses(grid),
    ...buildRegionHouses(grid),
    ...buildWindokuRegionHouses(grid),
  ]);
}

/**
 * Built-in irregular region map for the `jigsaw` preset.
 * Each entry is a region id 0–8; every region has exactly nine cells.
 */
export const DEFAULT_JIGSAW_REGION_MAP: readonly (readonly number[])[] = [
  [0, 0, 0, 0, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 1, 1, 2, 1],
  [3, 3, 3, 4, 4, 2, 2, 2, 1],
  [3, 3, 4, 4, 4, 2, 2, 2, 2],
  [3, 3, 4, 5, 5, 2, 6, 6, 6],
  [3, 4, 4, 5, 5, 5, 5, 6, 6],
  [3, 4, 7, 5, 5, 5, 8, 6, 6],
  [7, 7, 7, 7, 8, 8, 8, 6, 6],
  [7, 7, 7, 7, 8, 8, 8, 8, 8],
];

/**
 * Build region houses from a `size×size` map of region ids.
 * Expects exactly `size` regions, each with exactly `size` cells.
 */
export function buildIrregularRegionHouses(
  grid: GridSpec,
  regionMap: readonly (readonly number[])[],
): House[] {
  if (regionMap.length !== grid.size) {
    throw new Error(
      `Region map must have ${grid.size} rows, got ${regionMap.length}`,
    );
  }

  const cellsByRegion: number[][] = Array.from(
    { length: grid.size },
    () => [],
  );

  for (let row = 0; row < grid.size; row++) {
    const mapRow = regionMap[row];
    if (!mapRow || mapRow.length !== grid.size) {
      throw new Error(
        `Region map row ${row} must have ${grid.size} columns`,
      );
    }
    for (let column = 0; column < grid.size; column++) {
      const regionId = mapRow[column]!;
      if (regionId < 0 || regionId >= grid.size) {
        throw new Error(
          `Region id ${regionId} at (${row},${column}) is out of range`,
        );
      }
      cellsByRegion[regionId]!.push(cellIndex(grid, row, column));
    }
  }

  for (let regionId = 0; regionId < grid.size; regionId++) {
    const cells = cellsByRegion[regionId]!;
    if (cells.length !== grid.size) {
      throw new Error(
        `Region ${regionId} must have ${grid.size} cells, got ${cells.length}`,
      );
    }
  }

  return cellsByRegion.map((cells, regionId) => ({
    id: `region-${regionId}`,
    kind: "region" as const,
    cells,
  }));
}

export function jigsawSudokuHouses(
  grid: GridSpec,
  regionMap: readonly (readonly number[])[] = DEFAULT_JIGSAW_REGION_MAP,
): HouseSet {
  return composeHouses(grid, [
    ...buildRowHouses(grid),
    ...buildColumnHouses(grid),
    ...buildIrregularRegionHouses(grid, regionMap),
  ]);
}

export function validateHouseSet(
  grid: GridSpec,
  houseSet: HouseSet,
): void {
  if (houseSet.cellHouses.length !== grid.cellCount) {
    throw new Error("House index length must match cell count");
  }

  for (const house of houseSet.houses) {
    if (house.cells.length === 0) {
      throw new Error(`House ${house.id} has no cells`);
    }
  }
}

export const CLASSIC_GRID = createGridSpec(
  9,
  3,
  3,
  [1, 2, 3, 4, 5, 6, 7, 8, 9],
);

export const SIX_BY_SIX_GRID = createGridSpec(
  6,
  2,
  3,
  [1, 2, 3, 4, 5, 6],
);
