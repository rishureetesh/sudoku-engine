import { getClassicEngine } from "../core/engine.js";
import type { Board } from "../types/board.js";
import type { EmptyCell } from "../types/cell.js";

const engine = getClassicEngine();

export function findEmptyCell(board: Board): EmptyCell | null {
  return engine.findEmptyCell(board);
}
