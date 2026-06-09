# Architecture

This document describes how `@reetesh/sudoku-engine` supports multiple Sudoku variants and how to extend it.

## Design choice: presets + houses

We evaluated two APIs:

```ts
// A — named presets (public)
createEngine({ variant: "hyper" });

// B — constraint composition (future / advanced)
createEngine({
  constraints: [rowConstraint(), columnConstraint(), boxConstraint(), hyperConstraint()],
});
```

**Recommendation:** **named presets** publicly, implemented as **composed house sets** internally.

| Approach | Pros | Cons |
|----------|------|------|
| Presets only | Simple docs, stable semver, easy batch/daily | Every new variant needs a preset (or builder helper) |
| Raw constraints only | Maximum flexibility | Harder to document; easy to build invalid rule sets |
| **Hybrid (chosen)** | Presets for 99% of users; houses are the real model | Custom variants need `composeHouses` (advanced) |

Uniqueness constraints map to **houses**: fixed sets of cells where digits must be all different.

| Variant | Houses |
|---------|--------|
| Classic | 9 rows + 9 columns + 9 regions |
| 6×6 | Same pattern on 6×6 grid |
| Diagonal | Classic + main + anti diagonal |
| Hyper | Classic + four edge-centered 3×3 windows |

Future work that goes beyond simple uniqueness uses **meta-constraints** (cage sums, inequalities). `MetaConstraint` is defined in `core/variant.ts` but not wired yet.

## Layers

```
Public API
  ├─ createEngine({ variant })  → PuzzleEngine (all operations)
  └─ Classic top-level exports   → delegate to getClassicEngine()

PuzzleEngine
  └─ SudokuVariant (grid + houses + clue ranges + generation profile)

Core
  ├─ GridSpec        size, box shape, digits, bit mask
  ├─ HouseSet        uniqueness units + cell → house index
  ├─ BitGrid         mutable solver grid (house bitmasks + MRV)
  ├─ validation      house duplicate checks
  ├─ solver          backtracking + countSolutions
  ├─ generator       fill + carve + uniqueness
  └─ difficulty      clue + technique heuristics per variant

Variants (registry)
  ├─ classic   9×9, 3×3 boxes
  ├─ 6x6       6×6, 2×3 boxes
  ├─ diagonal  classic + diagonals
  └─ hyper     classic + four hyper regions
```

## BitGrid

Each house stores a bitmask of used digits. For a cell:

```
candidates = fullMask & ~(OR of house masks for that cell)
```

MRV picks the empty cell with the fewest candidates. Same algorithm for every variant; only the house list changes.

## Solver flow

1. `validateBoard` (shape + house duplicates)
2. `BitGrid.fromBoard`
3. MRV backtracking: pick cell, try each candidate bit, recurse
4. `countSolutions` uses the same search with a solution limit (typically 2 for uniqueness)

## Generator flow

1. Seed one or more disjoint regions with shuffled digits (`seedRegionStarts`)
2. Backtrack-fill remaining cells using `candidateMaskAt`
3. Carve clues: shuffle cell order, remove while `countSolutions === 1`
4. Retry with alternate target clue counts; return `null` if all attempts fail

Generation tuning lives on `SudokuVariant.generation` (`GenerationProfile`), not in `variant.id` switches:

| Field | Purpose |
|-------|---------|
| `puzzleMaxAttempts` | Outer retry loop |
| `puzzleFallbackAttempts` | Relaxed carving retries |
| `carveMaxAttempts` | Per-carve attempt budget |
| `tryFullClueRange` | Try max/min/mid clue targets (tight variants) |

Tight variants (diagonal, hyper) use a single corner-box seed; extra houses make multi-box seeds unreliable during fill.

## Hyper regions

Four 3×3 windows on a 9×9 grid (0-indexed):

| Region | Rows | Columns |
|--------|------|---------|
| Top | 1–3 | 3–5 |
| Left | 3–5 | 1–3 |
| Right | 3–5 | 5–7 |
| Bottom | 5–7 | 3–5 |

Built with `buildHyperRegionHouses` / `hyperSudokuHouses` in `core/houses.ts`.

## Board type

`Board` remains `(number | null)[][]`. Shape and digit range are validated through the active variant.

Classic 9×9 exports (`GRID_SIZE`, `Digit`, etc.) stay for backward compatibility.

## Adding a variant

1. Define `GridSpec` (`createGridSpec`).
2. Build houses (`standardSudokuHouses`, `diagonalSudokuHouses`, `hyperSudokuHouses`, or `composeHouses`).
3. Set `clueRanges`, `minClues`, `techniqueHeuristics`, `seedRegionStarts`, `generation`.
4. Register in `variants/registry.ts` and extend `VariantId`.
5. Add tests via `ALL_VARIANTS` in `tests/helpers/variants.ts`.

## Files

| Path | Role |
|------|------|
| `core/grid-spec.ts` | Grid dimensions and digit mask |
| `core/houses.ts` | House builders and composition |
| `core/bitgrid.ts` | Parameterized solver grid |
| `core/variant.ts` | Variant types and generation profiles |
| `core/engine.ts` | `createEngine`, `PuzzleEngine` |
| `variants/registry.ts` | Built-in variant presets |
