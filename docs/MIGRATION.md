# Migration guide (2.0)

## Summary

Version 2.0 introduces a **variant system**. Classic 9×9 behavior is unchanged for existing imports.

## What stays the same

All existing top-level APIs still work and default to **classic 9×9**:

```ts
import { generatePuzzle, solve, validateBoard } from "@reetesh/sudoku-engine";

generatePuzzle("medium");
solve(board);
```

Constants `GRID_SIZE`, `BOX_SIZE`, `CLUE_RANGES`, etc. still describe classic sudoku.

## New API

```ts
import { createEngine } from "@reetesh/sudoku-engine";

const classic = createEngine({ variant: "classic" });
const mini = createEngine({ variant: "6x6" });
const sudokuX = createEngine({ variant: "diagonal" });
const hyper = createEngine({ variant: "hyper" });

mini.generatePuzzle("easy");
sudokuX.validateBoard(board);
hyper.generatePuzzle("hard");
```

`PuzzleEngine` exposes the same operations as the classic helpers, bound to one variant.

## Batch generation with variants

```ts
import { SudokuEngine } from "@reetesh/sudoku-engine";

new SudokuEngine({ variant: "6x6", seed: 42 }).generateBatch({ count: 8 });
```

## Breaking changes

**Type:** `Digit` is now `number` (was `1 | … | 9`). Runtime validation uses the active variant’s digit list.

**Behavior:** `generatePuzzle` returns `null` when generation fails after all retries (previously some paths threw). Wrap batch/custom callers accordingly.

**Classic-only facade:** Top-level `stringToBoard`, `validateImportedPuzzle`, etc. only accept classic 9×9.

**Implicit assumptions to avoid:**

- Hard-coding board length `9` in UI — use `engine.variant.grid.size`.
- Assuming digits are always 1–9 — 6×6 uses 1–6.
- Using `validateRow` / `validateBox` alone for Sudoku X — use `engine.validateBoard` so diagonals are checked.

## Upgrade checklist

1. Bump to `@reetesh/sudoku-engine@2.0.0`.
2. Run tests — classic suite should pass unchanged.
3. If you render grids dynamically, read size from the engine variant.
4. Opt in to 6×6, diagonal, or hyper via `createEngine`.

## Future variants

See [ROADMAP.md](./ROADMAP.md). Windoku and Jigsaw shipped in 2.1; Killer / Thermo / Kropki still need meta-constraints ([ARCHITECTURE.md](./ARCHITECTURE.md)).
