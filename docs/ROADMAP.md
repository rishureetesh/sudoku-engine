# Roadmap

## Shipped (2.x)

| Variant | Status |
|---------|--------|
| Classic 9×9 | Stable |
| 6×6 | Stable |
| Diagonal (Sudoku X) | Stable |
| Hyper Sudoku | Stable |

## Planned variants

| Variant | Approach | Notes |
|---------|----------|-------|
| Jigsaw / Irregular | Replace `buildRegionHouses` with custom region map | Same house model |
| Windoku | Four overlapping 3×3 windows (different layout than Hyper) | House composition |
| Samurai | Multiple grids + overlapping regions | Needs multi-grid `GridSpec` |
| Killer | Houses + `MetaConstraint` cage sums | Requires sum validation, not just uniqueness |
| Thermo | Meta-constraints on ordered cells | Inequality along a path |
| Kropki | Meta-constraints on adjacent pairs | Dot/color rules |

## Architecture

### Near term

- Remove legacy `internal/` and classic-only duplicate modules
- Deprecation warnings on top-level `validateRow` / `validateBox` when used outside classic
- Per-variant technique heuristics for diagonal/hyper (currently reuse classic thresholds)

### Medium term

- Optional constraint builder API for advanced users:

```ts
createEngine({
  houses: composeHouses(grid, [
    ...buildRowHouses(grid),
    ...buildHyperRegionHouses(grid),
  ]),
});
```

Presets remain the default; builders are for custom rule sets.

### Long term

- Wire `MetaConstraint` into validation and candidate pruning
- Runtime variant registration for plugins (if demand exists)

## Non-goals (for now)

- UI components
- Puzzle databases / import formats beyond string serialization
- Full human-solving technique engine (only heuristic difficulty rating)

## How to contribute a variant

1. Add house builders in `core/houses.ts` if reusable.
2. Register preset in `variants/registry.ts`.
3. Extend `ALL_VARIANTS` tests.
4. Document rules in `docs/OVERVIEW.md`.
5. Add benchmark budgets in `tests/performance/benchmarks.test.ts` if generation is slow.

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the house model.
