export type Digit = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type CellValue = Digit | null;

export interface EmptyCell {
  readonly row: number;
  readonly column: number;
}
