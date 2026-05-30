# sudoku-engine

Sudoku generator and solver for TypeScript. You pass a 9×9 grid (`null` for blanks); it generates puzzles, checks moves, solves, and has helpers for hints and imports. No UI included.

Runs on Node 18+, in the browser, or in a bundler. No runtime dependencies.

## Install

```bash
npm install @reetesh/sudoku-engine
```

```ts
import { generatePuzzle, solve } from "@reetesh/sudoku-engine";

// Or only the sudoku module:
import { generatePuzzle } from "@reetesh/sudoku-engine/sudoku";
```

## Quick start

```ts
import { generatePuzzle, solve, isSolvedCorrectly } from "@reetesh/sudoku-engine";

const { puzzle, solution, difficulty, clueCount } = generatePuzzle("medium");
const playerBoard = puzzle.map((row) => [...row]);

const { solved, board: solvedBoard } = solve(puzzle);
console.log(solved, difficulty, clueCount);

isSolvedCorrectly(solvedBoard, solution);
```

- `puzzle` — what you show at the start (givens + blanks)
- `solution` — full answer; keep server-side if you care about cheating
- `playerBoard` — copy of `puzzle` that the player edits

Generated puzzles have one solution.

## Internals

The API is a `Board`: `(1–9 | null)[][]`.

Inside, row/column/box masks track which digits are used (9 bits each). Candidates come from those masks. The solver uses MRV (pick the cell with fewest options) and backtracking. Generation builds a full grid, removes cells, and checks uniqueness with the same solver.

You only work with `Board`; conversion to bitmasks is internal.

## Boards

```ts
type Board = (1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | null)[][];
```

```ts
import { createEmptyBoard, boardToString, stringToBoard } from "@reetesh/sudoku-engine";

createEmptyBoard();
boardToString(board);
stringToBoard("530070000600195000...");
```

## Difficulty

Givens per level:

| Level  | Givens |
|--------|--------|
| easy   | 40–45  |
| medium | 32–39  |
| hard   | 26–31  |
| expert | 22–25  |

```ts
generatePuzzle("expert");
generatePuzzle("medium", { symmetric: true });
generateOne({ difficulty: "hard", seed: 20260530 });
dailyPuzzle("2026-05-30", "hard");
```

By clue count: `rateDifficulty(board)`

By how far naked singles get you: `rateDifficultyByTechniques(board)`, `analyzeTechniques(board)`

## Validate and solve

```ts
import {
  validateBoard,
  isValidMove,
  getCandidates,
  solve,
  countSolutions,
  hasUniqueSolution,
} from "@reetesh/sudoku-engine";

validateBoard(board);
isValidMove(board, row, column, value);
getCandidates(board, row, column);

const { solved, board } = solve(board);
countSolutions(board);
hasUniqueSolution(board);
```

`isValidMove` only checks row/column/box conflicts, not whether the puzzle is still solvable.

## Play

```ts
import { applyMove, isBoardComplete, isSolvedCorrectly } from "@reetesh/sudoku-engine";

const result = applyMove(board, row, column, 5, puzzle);
if (result.success) {
  board = result.board;
}

isBoardComplete(board);
isSolvedCorrectly(board, solution);
```

Pass `puzzle` into `applyMove` so givens stay fixed.

## Hints

```ts
isGiven(puzzle, row, column);
getGivenCells(puzzle);
getCellDisplayState(puzzle, board, solution, row, column);

revealCell(board, solution, row, column, puzzle);
revealNext(board, solution, puzzle);
revealRandom(board, solution, puzzle);
```

`getCellDisplayState`: `"given"` | `"empty"` | `"player"` | `"incorrect"`

## Import

```ts
import { puzzleFromString, validateImportedPuzzle } from "@reetesh/sudoku-engine";

const board = puzzleFromString("530070000600195000...");
const result = validateImportedPuzzle(board);

if (result.valid) {
  result.puzzle;
  result.solution;
}
```

## Coordinates

Rows and columns are `0`–`8`. Bad indices throw `SudokuEngineError`.

```ts
isInBounds(row, column);
assertInBounds(row, column);
```

## Batch

Up to 1000 per call. Default: split evenly across easy/medium/hard/expert.

```ts
generateBatch({ count: 100 });

generateBatch({
  count: 50,
  distribution: { easy: 20, medium: 15, hard: 10, expert: 5 },
});
```

## Example

```bash
cd examples/react
npm install
npm run dev
```

Small React app: new game, daily puzzle, hints, cell states.

## API

[docs/API.md](docs/API.md). Types in `dist/index.d.ts` after `npm run build`.

## Size

Roughly 18 KB minified (ESM entry), tree-shakeable.

## Dev

```bash
npm install
npm test
npm run typecheck
npm run lint
npm run build
```

Tests: `src/games/sudoku/engine/tests/`

## Changelog

[CHANGELOG.md](CHANGELOG.md) — **1.0.0**

## License

MIT © [Reetesh Kumar](https://github.com/reeteshkumar/sudoku-engine)
