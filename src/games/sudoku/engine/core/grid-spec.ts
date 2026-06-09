export interface GridSpec {
  readonly size: number;
  readonly boxRows: number;
  readonly boxCols: number;
  readonly digits: readonly number[];
  readonly cellCount: number;
  readonly digitCount: number;
  readonly fullMask: number;
}

export function createGridSpec(
  size: number,
  boxRows: number,
  boxCols: number,
  digits: readonly number[],
): GridSpec {
  if (size % boxRows !== 0 || size % boxCols !== 0) {
    throw new Error(
      `Grid size ${size} must be divisible by box ${boxRows}x${boxCols}`,
    );
  }

  const digitCount = digits.length;
  let fullMask = 0;
  for (const digit of digits) {
    fullMask |= 1 << (digit - 1);
  }

  return {
    size,
    boxRows,
    boxCols,
    digits,
    cellCount: size * size,
    digitCount,
    fullMask,
  };
}

export function cellIndex(grid: GridSpec, row: number, column: number): number {
  return row * grid.size + column;
}

export function indexToRow(grid: GridSpec, index: number): number {
  return Math.floor(index / grid.size);
}

export function indexToColumn(grid: GridSpec, index: number): number {
  return index % grid.size;
}

export function regionIndex(
  grid: GridSpec,
  row: number,
  column: number,
): number {
  const boxesPerRow = grid.size / grid.boxCols;
  return (
    Math.floor(row / grid.boxRows) * boxesPerRow +
    Math.floor(column / grid.boxCols)
  );
}

export function regionCount(grid: GridSpec): number {
  return (grid.size / grid.boxRows) * (grid.size / grid.boxCols);
}
