import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    sudoku: "src/games/sudoku/index.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: false,
  minify: true,
  clean: true,
  splitting: false,
  treeshake: true,
});
