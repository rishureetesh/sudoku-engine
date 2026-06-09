export type Digit = number;

export type CellValue = Digit | null;

export interface EmptyCell {
  readonly row: number;
  readonly column: number;
}
