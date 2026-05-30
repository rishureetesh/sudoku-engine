# API reference

Build first: `npm run build` → types in `dist/index.d.ts`.

## Imports

| Path | Notes |
|------|--------|
| `@reetesh/sudoku-engine` | Main entry |
| `@reetesh/sudoku-engine/sudoku` | Same exports |

Public types use `Board` (`null` = empty). Solver/generator use bitmasks internally.

## Functions

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

## Types

`Board`, `CellValue`, `Digit`, `Difficulty`, `SolverResult`, `GeneratedPuzzle`, `RevealResult`, `CellDisplayState`, `ApplyMoveResult`, `ImportValidationResult`, `TechniqueAnalysis`, plus generator/batch option types.
