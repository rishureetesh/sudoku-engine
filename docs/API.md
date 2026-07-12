# API reference

Build first: `npm run build` → types in `dist/index.d.ts`.

## Imports

| Path | Notes |
|------|--------|
| `@reetesh/sudoku-engine` | Main entry |
| `@reetesh/sudoku-engine/sudoku` | Same exports |

Public types use `Board` (`null` = empty). Solver/generator use bitmasks internally.

## Variants

```ts
import {
  createEngine,
  listVariants,
  getVariant,
  CLASSIC_VARIANT,
  SIX_BY_SIX_VARIANT,
  DIAGONAL_VARIANT,
} from "@reetesh/sudoku-engine";

const engine = createEngine({ variant: "classic" | "6x6" | "diagonal" | "hyper" | "windoku" | "jigsaw" });
listVariants(); // readonly SudokuVariant[]
getVariant("diagonal"); // SudokuVariant metadata
```

Top-level exports (`solve`, `generatePuzzle`, …) always target **classic 9×9**. Use `createEngine` for other variants.

See [OVERVIEW.md](./OVERVIEW.md) and [ARCHITECTURE.md](./ARCHITECTURE.md).

---

## `createEngine(options?)`

Creates a variant-scoped `PuzzleEngine`.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `options.variant` | `"classic" \| "6x6" \| "diagonal" \| "hyper" \| "windoku" \| "jigsaw"` | `"classic"` | Preset ruleset |

**Returns:** `PuzzleEngine`

**Errors:** `SudokuEngineError` if `variant` is unknown (should not happen with typed `VariantId`).

```ts
const mini = createEngine({ variant: "6x6" });
mini.generatePuzzle("easy");
```

---

## `PuzzleEngine`

All methods use the engine’s variant (grid size, digits, houses).

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `variant` | `SudokuVariant` | Grid spec, houses, clue ranges, heuristics |
| `variantId` | `VariantId` | Shorthand id string |

### Board helpers

| Method | Parameters | Returns | Errors |
|--------|------------|---------|--------|
| `createEmptyBoard()` | — | `Board` | — |
| `cloneBoard(board)` | `Board` | `Board` | — |
| `isValidBoardShape(board)` | `unknown` | `board is Board` | — |
| `countClues(board)` | `Board` | `number` | — |
| `boardsEqual(a, b)` | `Board`, `Board` | `boolean` | — |
| `allCellCoordinates()` | — | `{ row, column }[]` | — |
| `boardToString(board)` | `Board` | `string` (digits + `.` for empty) | — |
| `stringToBoard(serialized)` | `string` | `Board \| null` | `null` if length ≠ size² |
| `isInBounds(row, column)` | `number`, `number` | `boolean` | — |
| `assertInBounds(row, column)` | `number`, `number` | `void` | `SudokuEngineError` if OOB |

### Validation

| Method | Parameters | Returns | Notes |
|--------|------------|---------|-------|
| `validateBoard(board)` | `Board` | `boolean` | Shape + all houses (rows, columns, regions, diagonals when applicable) |
| `isValidMove(board, row, column, value)` | `Board`, coords, digit | `boolean` | Ignores empty peers; allows same digit already in cell |

### Candidates

| Method | Parameters | Returns |
|--------|------------|---------|
| `getCandidates(board, row, column)` | `Board`, coords | `number[]` | Digits legal for that cell |

### Solver

| Method | Parameters | Returns |
|--------|------------|---------|
| `solve(board)` | `Board` | `SolverResult` `{ solved, board }` |
| `countSolutions(board, limit?)` | `Board`, `number?` | `number` | Stops after `limit` solutions (default 2) |
| `hasUniqueSolution(board)` | `Board` | `boolean` | Exactly one solution |
| `findEmptyCell(board)` | `Board` | `{ row, column } \| null` | First empty cell |

### Generator

| Method | Parameters | Returns | Notes |
|--------|------------|---------|-------|
| `generateSolvedBoard()` | — | `Board` | Full valid grid |
| `generatePuzzle(difficulty, options?)` | `Difficulty`, `GeneratePuzzleOptions?` | `GeneratedPuzzle \| null` | `null` if retries exhausted |
| `removeCells(solution, targetClues, maxAttempts)` | `Board`, `number`, `number` | `Board \| null` | Carve puzzle from solution |
| `removeCellsSymmetric(...)` | same | `Board \| null` | 180° symmetric removal |

`GeneratePuzzleOptions`: `{ maxAttempts?, symmetric? }`

`GeneratedPuzzle`: `{ difficulty, puzzle, solution, clueCount }`

### Difficulty

| Method | Parameters | Returns |
|--------|------------|---------|
| `rateDifficulty(board)` | `Board` | `Difficulty` (clue-count bands) |
| `getTargetClueCount(difficulty)` | `Difficulty` | `number` |
| `isClueCountInRange(difficulty, clueCount)` | `Difficulty`, `number` | `boolean` |
| `rateDifficultyByTechniques(board)` | `Board` | `Difficulty` |
| `analyzeTechniques(board)` | `Board` | `TechniqueAnalysis` |

### Play

| Method | Parameters | Returns |
|--------|------------|---------|
| `applyMove(board, row, column, value, puzzle?)` | `Board`, coords, digit\|null, optional givens | `ApplyMoveResult` |
| `isBoardComplete(board)` | `Board` | `boolean` |
| `isSolvedCorrectly(board, solution)` | `Board`, `Board` | `boolean` |

`ApplyMoveResult`: `{ success, board, reason? }` — `reason` set when `success === false`.

### Hints

| Method | Parameters | Returns |
|--------|------------|---------|
| `isGiven(puzzle, row, column)` | `Board`, coords | `boolean` |
| `getGivenCells(puzzle)` | `Board` | `{ row, column }[]` |
| `revealCell(board, solution, row, column, puzzle?)` | … | `RevealResult \| null` |
| `revealNext(board, solution, puzzle?)` | … | `RevealResult \| null` |
| `revealRandom(board, solution, puzzle?)` | … | `RevealResult \| null` |
| `getCellDisplayState(puzzle, board, solution, row, column)` | … | `CellDisplayState` |

### Import

| Method | Parameters | Returns |
|--------|------------|---------|
| `puzzleFromString(serialized)` | `string` | `Board \| null` |
| `validateImportedPuzzle(board)` | `Board` | `ImportValidationResult` |

`ImportValidationResult`: `{ valid, unique, solvable, error?, puzzle? }`

---

## Classic top-level functions

These delegate to `getClassicEngine()` (9×9 only).

| Area | Exports |
|------|---------|
| Generate | `generatePuzzle`, `generateSolvedBoard`, `generateOne`, `generateBatch`, `SudokuEngine` |
| Solve | `solve`, `countSolutions`, `hasUniqueSolution`, `findEmptyCell` |
| Validate | `validateBoard`, `validateRow`, `validateColumn`, `validateBox`, `isValidMove` |
| Candidates | `getCandidates` |
| Play | `applyMove`, `isBoardComplete`, `isSolvedCorrectly` |
| Hints | `isGiven`, `getGivenCells`, `revealCell`, `revealNext`, `revealRandom`, `getCellDisplayState` |
| Import | `puzzleFromString`, `validateImportedPuzzle` |
| Daily | `dailyPuzzle`, `dateToSeed` |
| Difficulty | `rateDifficulty`, `rateDifficultyByTechniques`, `analyzeTechniques`, `getTargetClueCount`, `isClueCountInRange` |
| Board | `createEmptyBoard`, `cloneBoard`, `boardsEqual`, `countClues`, `boardToString`, `stringToBoard`, `isValidBoardShape` |
| Coordinates | `isInBounds`, `assertInBounds` |
| Constants | `GRID_SIZE`, `BOX_SIZE`, `CLUE_RANGES`, `DIFFICULTIES`, `MAX_BATCH_SIZE`, `MIN_CLUES` |
| Seeding | `setGlobalSeed`, `clearGlobalSeed` |

### `SudokuEngine`

```ts
new SudokuEngine({ seed?: number; variant?: VariantId });
engine.generateBatch({ count, distribution?, symmetric? });
engine.generateOne({ difficulty, symmetric? });
```

**Errors:** `SudokuEngineError` for invalid batch size, unknown variant, or generation failure in strict paths.

---

## Types

| Type | Description |
|------|-------------|
| `Board` | `(Digit \| null)[][]` |
| `Digit` | `number` (variant-specific: 1–9 or 1–6) |
| `Difficulty` | `"easy" \| "medium" \| "hard" \| "expert"` |
| `VariantId` | `"classic" \| "6x6" \| "diagonal" \| "hyper" \| "windoku" \| "jigsaw"` |
| `SudokuVariant` | Full variant metadata |
| `PuzzleEngine` | Variant-scoped API surface |
| `SolverResult` | `{ solved: boolean; board: Board }` |
| `GeneratedPuzzle` | Puzzle + solution + metadata |
| `RevealResult` | Updated board + revealed cell |
| `CellDisplayState` | UI hint state enum |
| `ApplyMoveResult` | Move outcome |
| `ImportValidationResult` | Import pipeline result |
| `TechniqueAnalysis` | Technique counts for difficulty |
| `GridSpec`, `House`, `HouseSet` | Advanced / extension types |

---

## Error handling

| Situation | Behavior |
|-----------|----------|
| Out-of-bounds row/column | `SudokuEngineError` from `assertInBounds` / batch APIs |
| Unknown variant | `SudokuEngineError` from `getVariant` |
| Invalid board shape for `BitGrid.fromBoard` | `SudokuEngineError` |
| Generation failure | `generatePuzzle` returns `null` |
| Invalid import string | `puzzleFromString` returns `null` |
| Invalid player move | `applyMove` returns `{ success: false, reason }` |

---

## Usage examples

```ts
createEngine({ variant: "classic" });
createEngine({ variant: "6x6" });
createEngine({ variant: "diagonal" });
createEngine({ variant: "hyper" });
createEngine({ variant: "windoku" });
createEngine({ variant: "jigsaw" });
```

Full pipeline:

```ts
const engine = createEngine({ variant: "diagonal" });
const game = engine.generatePuzzle("medium");
if (!game) throw new Error("generation failed");

engine.validateBoard(game.puzzle); // true
engine.solve(game.puzzle); // { solved: true, board: game.solution }
```

See [MIGRATION.md](./MIGRATION.md) for 2.0 upgrade notes.
