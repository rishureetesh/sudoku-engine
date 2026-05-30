import type { Board } from "../types/board.js";
import { isValidBoardShape, stringToBoard } from "../utils/board.js";
import { validateBoard } from "../validation/validateBoard.js";
import { countSolutions } from "../solver/countSolutions.js";
import { solve } from "../solver/solve.js";

export interface ImportedPuzzle {
  readonly puzzle: Board;
  readonly solution: Board;
  readonly clueCount: number;
}

export interface ImportValidationResult {
  readonly valid: boolean;
  readonly unique: boolean;
  readonly solvable: boolean;
  readonly puzzle?: ImportedPuzzle;
  readonly error?: string;
}

export function puzzleFromString(serialized: string): Board | null {
  return stringToBoard(serialized);
}

export function validateImportedPuzzle(board: Board): ImportValidationResult {
  if (!isValidBoardShape(board)) {
    return {
      valid: false,
      unique: false,
      solvable: false,
      error: "Expected a 9×9 board with 1–9 or empty cells.",
    };
  }

  if (!validateBoard(board)) {
    return {
      valid: false,
      unique: false,
      solvable: false,
      error: "Duplicate digit in a row, column, or box.",
    };
  }

  const solutions = countSolutions(board, 2);
  if (solutions === 0) {
    return {
      valid: false,
      unique: false,
      solvable: false,
      error: "No solution.",
    };
  }

  if (solutions > 1) {
    return {
      valid: false,
      unique: false,
      solvable: true,
      error: "More than one solution.",
    };
  }

  const solved = solve(board);
  if (!solved.solved) {
    return {
      valid: false,
      unique: true,
      solvable: false,
      error: "Solver failed.",
    };
  }

  let clueCount = 0;
  for (let row = 0; row < 9; row++) {
    for (let column = 0; column < 9; column++) {
      if (board[row]![column] !== null) {
        clueCount++;
      }
    }
  }

  return {
    valid: true,
    unique: true,
    solvable: true,
    puzzle: {
      puzzle: board,
      solution: solved.board,
      clueCount,
    },
  };
}
