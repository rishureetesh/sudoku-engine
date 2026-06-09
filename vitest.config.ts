import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: false,
    include: ["src/games/**/engine/tests/**/*.test.ts"],
    setupFiles: ["src/games/sudoku/engine/tests/setup/warm-fixtures.ts"],
    testTimeout: 20_000,
    hookTimeout: 20_000,
    isolate: false,
    maxWorkers: 1,
    coverage: {
      provider: "v8",
      include: ["src/games/sudoku/engine/**/*.ts"],
      exclude: [
        "src/games/sudoku/engine/tests/**",
        "src/games/sudoku/engine/**/index.ts",
        // Legacy classic-only modules superseded by core/* (kept for compat)
        "src/games/sudoku/engine/internal/**",
        "src/games/sudoku/engine/generator/fillBoard.ts",
        "src/games/sudoku/engine/generator/removeCells.ts",
        "src/games/sudoku/engine/generator/removeCellsSymmetric.ts",
        "src/games/sudoku/engine/solver/findEmptyCellMrv.ts",
        "src/games/sudoku/engine/validation/isSolvedBoard.ts",
        "src/games/sudoku/engine/types/**",
      ],
      reporter: ["text", "text-summary", "html"],
      thresholds: {
        lines: 80,
        branches: 75,
        functions: 80,
        statements: 80,
      },
    },
  },
});
