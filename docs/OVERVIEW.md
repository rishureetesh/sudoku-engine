# Overview

`sudoku-engine` is a TypeScript library for generating, solving, and validating Sudoku puzzles. It ships without UI — you render grids yourself.

## Variants

### Classic Sudoku (9×9)

- Grid: 9 rows × 9 columns
- Digits: 1–9
- Regions: nine 3×3 boxes
- Rules: each digit appears once per row, column, and box

Default for all top-level exports (`generatePuzzle`, `solve`, …).

### 6×6 Sudoku

- Grid: 6×6
- Digits: 1–6
- Regions: six 2×3 boxes (2 rows, 3 columns each)
- Rules: same as classic, smaller grid
- Difficulty uses separate clue ranges (36 cells total)

Use: `createEngine({ variant: "6x6" })`

### Diagonal Sudoku (Sudoku X)

- Grid: 9×9, same boxes as classic
- Extra rules: main diagonal and anti-diagonal must also contain unique digits
- Higher clue counts when generating (extra houses constrain carving)

Use: `createEngine({ variant: "diagonal" })`

### Hyper Sudoku

- Grid: 9×9, same boxes as classic
- Extra rules: four additional 3×3 regions (centered on each edge) must contain unique digits
- Same generation profile as diagonal (tighter carving, more retries)

Use: `createEngine({ variant: "hyper" })`

## Which API to use

| Need | API |
|------|-----|
| Classic 9×9 only | Top-level imports (`solve`, `generatePuzzle`, …) |
| Other variants | `createEngine({ variant })` → `PuzzleEngine` |
| Batch with variant | `new SudokuEngine({ variant, seed })` |

Top-level helpers always target **classic 9×9**. They do not validate 6×6 boards, diagonals, or hyper regions.

## Quick examples

```ts
import { createEngine } from "@reetesh/sudoku-engine";

const classic = createEngine({ variant: "classic" });
const mini = createEngine({ variant: "6x6" });
const sudokuX = createEngine({ variant: "diagonal" });
const hyper = createEngine({ variant: "hyper" });

classic.generatePuzzle("medium");
mini.generatePuzzle("easy");
sudokuX.validateBoard(board);
hyper.generatePuzzle("hard");
```

## Limitations

- Top-level `validateRow` / `validateBox` are classic 9×9 only
- Killer, Thermo, and Kropki variants are not implemented (see [ROADMAP.md](./ROADMAP.md))
- No runtime variant registration — new presets are added in `variants/registry.ts`

See [ARCHITECTURE.md](./ARCHITECTURE.md), [API.md](./API.md), [MIGRATION.md](./MIGRATION.md), and [ROADMAP.md](./ROADMAP.md).
