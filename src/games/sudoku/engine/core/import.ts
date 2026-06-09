import type { ImportValidationResult } from "../import/validateImportedPuzzle.js";
import type { Board } from "./board.js";
import { countClues, isValidBoardShape, stringToBoard } from "./board.js";
import type { SudokuVariant } from "./variant.js";
import { validateBoard } from "./validation.js";
import { countSolutions, solve } from "./solver.js";

export function puzzleFromString(
  variant: SudokuVariant,
  serialized: string,
): Board | null {
  return stringToBoard(variant, serialized);
}

export function validateImportedPuzzle(
  variant: SudokuVariant,
  board: Board,
): ImportValidationResult {
  const sizeLabel = `${variant.grid.size}×${variant.grid.size}`;
  const digitLabel = variant.grid.digits.join("–");

  if (!isValidBoardShape(variant, board)) {
    return {
      valid: false,
      unique: false,
      solvable: false,
      error: `Expected a ${sizeLabel} board with ${digitLabel} or empty cells.`,
    };
  }

  if (!validateBoard(variant, board)) {
    return {
      valid: false,
      unique: false,
      solvable: false,
      error: "Duplicate digit in a house.",
    };
  }

  const solutions = countSolutions(variant, board, 2);
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

  const solved = solve(variant, board);
  if (!solved.solved) {
    return {
      valid: false,
      unique: true,
      solvable: false,
      error: "Solver failed.",
    };
  }

  return {
    valid: true,
    unique: true,
    solvable: true,
    puzzle: {
      puzzle: board,
      solution: solved.board,
      clueCount: countClues(board),
    },
  };
}
