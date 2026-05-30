import { MAX_BATCH_SIZE } from "../constants/difficulty.js";

export class SudokuEngineError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SudokuEngineError";
  }
}

export function assertBatchCount(count: number): void {
  if (!Number.isInteger(count) || count < 1 || count > MAX_BATCH_SIZE) {
    throw new SudokuEngineError(
      `Batch size must be 1–${MAX_BATCH_SIZE}, got ${count}`,
    );
  }
}
