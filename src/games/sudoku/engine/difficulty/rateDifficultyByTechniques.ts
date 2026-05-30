import { GRID_SIZE } from "../constants/board.js";
import { getCandidates } from "../candidates/getCandidates.js";
import type { Board } from "../types/board.js";
import type { Digit } from "../types/cell.js";
import type { Difficulty } from "../types/difficulty.js";
import { cloneBoard } from "../utils/board.js";
import { countClues } from "../utils/board.js";
import { isEmptyCell } from "../utils/cell.js";
import { rateDifficulty } from "./rateDifficulty.js";

export interface TechniqueAnalysis {
  readonly clueBased: Difficulty;
  readonly techniqueBased: Difficulty;
  readonly singlesRequired: number;
  readonly maxCandidatesSeen: number;
}

export function rateDifficultyByTechniques(board: Board): Difficulty {
  return analyzeTechniques(board).techniqueBased;
}

export function analyzeTechniques(board: Board): TechniqueAnalysis {
  const clueBased = rateDifficulty(board);
  const working = cloneBoard(board);
  let singlesRequired = 0;
  let maxCandidatesSeen = 0;

  for (let row = 0; row < GRID_SIZE; row++) {
    for (let column = 0; column < GRID_SIZE; column++) {
      if (!isEmptyCell(working[row]![column]!)) {
        continue;
      }
      const candidates = getCandidates(working, row, column);
      maxCandidatesSeen = Math.max(maxCandidatesSeen, candidates.length);
    }
  }

  while (true) {
    let progressed = false;

    for (let row = 0; row < GRID_SIZE; row++) {
      for (let column = 0; column < GRID_SIZE; column++) {
        if (!isEmptyCell(working[row]![column]!)) {
          continue;
        }
        const candidates = getCandidates(working, row, column);
        if (candidates.length === 1) {
          working[row]![column] = candidates[0]! as Digit;
          singlesRequired++;
          progressed = true;
        }
      }
    }

    if (!progressed) {
      break;
    }
  }

  let techniqueBased: Difficulty;
  const clues = countClues(board);

  if (singlesRequired >= 40 && maxCandidatesSeen <= 3) {
    techniqueBased = "easy";
  } else if (singlesRequired >= 25 && maxCandidatesSeen <= 5) {
    techniqueBased = "medium";
  } else if (clues >= 26) {
    techniqueBased = "hard";
  } else {
    techniqueBased = "expert";
  }

  return {
    clueBased,
    techniqueBased,
    singlesRequired,
    maxCandidatesSeen,
  };
}
