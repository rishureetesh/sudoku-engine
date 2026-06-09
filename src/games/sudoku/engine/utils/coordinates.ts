import { getClassicEngine } from "../core/engine.js";

const engine = getClassicEngine();

export function isInBounds(row: number, column: number): boolean {
  return engine.isInBounds(row, column);
}

export function assertInBounds(row: number, column: number): void {
  engine.assertInBounds(row, column);
}
