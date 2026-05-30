import { useMemo, useState } from "react";
import {
  dailyPuzzle,
  generatePuzzle,
  getCellDisplayState,
  isGiven,
  isSolvedCorrectly,
  isValidMove,
  revealNext,
  revealRandom,
  type Board,
  type CellValue,
  type Difficulty,
} from "@reetesh/sudoku-engine";

const DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard", "expert"];

export function App() {
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [useDaily, setUseDaily] = useState(false);
  const [game, setGame] = useState(() => generatePuzzle("medium")!);
  const [board, setBoard] = useState<Board>(() =>
    game.puzzle.map((row) => [...row]),
  );

  const won = useMemo(
    () => isSolvedCorrectly(board, game.solution),
    [board, game.solution],
  );

  function newGame() {
    const next = useDaily
      ? dailyPuzzle(new Date(), difficulty)
      : generatePuzzle(difficulty)!;
    setGame(next);
    setBoard(next.puzzle.map((row) => [...row]));
  }

  function onCellChange(row: number, col: number, raw: string) {
    if (isGiven(game.puzzle, row, col)) return;
    const value = raw === "" ? null : Number(raw);
    if (value !== null && !isValidMove(board, row, col, value)) return;
    const next = board.map((r) => [...r]);
    next[row]![col] = value as CellValue;
    setBoard(next);
  }

  function hintNext() {
    const hint = revealNext(board, game.solution, game.puzzle);
    if (hint) setBoard(hint.board);
  }

  function hintRandom() {
    const hint = revealRandom(board, game.solution, game.puzzle);
    if (hint) setBoard(hint.board);
  }

  return (
    <main className="app">
      <h1>Sudoku demo</h1>
      <div className="toolbar">
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value as Difficulty)}
        >
          {DIFFICULTIES.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <label>
          <input
            type="checkbox"
            checked={useDaily}
            onChange={(e) => setUseDaily(e.target.checked)}
          />
          Daily puzzle
        </label>
        <button type="button" onClick={newGame}>
          New game
        </button>
        <button type="button" onClick={hintNext}>
          Reveal next
        </button>
        <button type="button" onClick={hintRandom}>
          Random hint
        </button>
      </div>
      {won && <p className="win">Solved!</p>}
      <div className="grid">
        {board.map((row, r) =>
          row.map((cell, c) => {
            const state = getCellDisplayState(
              game.puzzle,
              board,
              game.solution,
              r,
              c,
            );
            return (
              <input
                key={`${r}-${c}`}
                className={`cell cell-${state}`}
                value={cell ?? ""}
                disabled={isGiven(game.puzzle, r, c)}
                onChange={(e) => onCellChange(r, c, e.target.value)}
              />
            );
          }),
        )}
      </div>
    </main>
  );
}
