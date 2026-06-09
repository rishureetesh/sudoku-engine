import type { GridSpec } from "./grid-spec.js";

export function digitBit(digit: number): number {
  return 1 << (digit - 1);
}

export function popcount(mask: number): number {
  let count = 0;
  let value = mask;
  while (value) {
    count++;
    value &= value - 1;
  }
  return count;
}

export function maskToDigits(grid: GridSpec, mask: number): number[] {
  const digits: number[] = [];
  for (const digit of grid.digits) {
    if (mask & digitBit(digit)) {
      digits.push(digit);
    }
  }
  return digits;
}

export function isValidDigit(grid: GridSpec, value: number): boolean {
  return grid.digits.includes(value);
}
