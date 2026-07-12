# Changelog

## 2.1.0 — 2026-07-12

### Variants

- **Windoku** (`createEngine({ variant: "windoku" })`) — classic houses plus four inner 3×3 windows at `(1,1)`, `(1,5)`, `(5,1)`, `(5,5)` (distinct from Hyper’s edge-centered windows)
- **Jigsaw** (`createEngine({ variant: "jigsaw" })`) — rows, columns, and a built-in irregular 9-region map (no standard 3×3 boxes)
- Public helpers: `buildWindokuRegionHouses`, `buildIrregularRegionHouses`, `jigsawSudokuHouses`, `windokuSudokuHouses`, `DEFAULT_JIGSAW_REGION_MAP`
- Optional `seedHouseIds` on `SudokuVariant` for irregular-region seeding
- Budgeted shuffled MRV fill + carve uniqueness budgets (`fillNodeBudget` / `carveNodeBudget`)
- `JIGSAW_GENERATION` profile to keep irregular generation bounded across seeds

### Docs

- Overview, API, architecture, and roadmap updated for Windoku and Jigsaw

## 2.0.0 — 2026-05-30

Major release: variant framework with **classic**, **6×6**, **diagonal** (Sudoku X), and **hyper** Sudoku.

### Variants

- `createEngine({ variant })` with presets: `"classic"`, `"6x6"`, `"diagonal"`, `"hyper"`
- House-based constraint model; shared MRV solver, validator, and generator
- `GenerationProfile` on `SudokuVariant` for per-variant generation tuning
- Classic top-level API unchanged (`generatePuzzle`, `solve`, …)

### Hardening

- Validation rejects malformed/ragged boards
- `BitGrid` safe overwrite and shape checks
- `generatePuzzle` returns `null` on exhaustion (was throw in some paths)
- Seeded RNG for `revealRandom`
- Integration, regression, property, and performance test suites

### Docs

- [OVERVIEW](docs/OVERVIEW.md), [ARCHITECTURE](docs/ARCHITECTURE.md), [API](docs/API.md), [MIGRATION](docs/MIGRATION.md), [ROADMAP](docs/ROADMAP.md)

See [MIGRATION.md](docs/MIGRATION.md) for upgrade notes from 1.x.

## 1.0.1 — 2026-05-30

- Minified publish build (no source maps)
- Broader npm keywords and description for search
- CI: Node 22, fix flaky technique difficulty test

## 1.0.0 — 2026-05-30

First release.

Generate and solve 9×9 puzzles with easy/medium/hard/expert clue ranges, batch up to 1000, optional seeds and daily puzzles, symmetric layout option, validation and candidates, play/hint/import helpers, technique-based difficulty rating, bitmask + MRV solver, `@reetesh/sudoku-engine/sudoku` subpath, React example, CI.
