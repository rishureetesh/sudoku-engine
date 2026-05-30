import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: false,
    include: ["src/games/**/engine/tests/**/*.test.ts"],
    testTimeout: 20_000,
  },
});
