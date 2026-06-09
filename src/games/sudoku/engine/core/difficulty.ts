import type { Difficulty } from "../types/difficulty.js";
import type { Board } from "./board.js";
import { countClues } from "./board.js";
import type { SudokuVariant } from "./variant.js";
import { randomInt } from "../utils/random.js";
import { getCandidates } from "./candidates.js";
import { cloneBoard } from "./board.js";

export interface TechniqueAnalysis {
  readonly clueBased: Difficulty;
  readonly techniqueBased: Difficulty;
  readonly singlesRequired: number;
  readonly maxCandidatesSeen: number;
}

export function getTargetClueCount(
  variant: SudokuVariant,
  difficulty: Difficulty,
): number {
  const range = variant.clueRanges[difficulty];
  return range.min + randomInt(range.max - range.min + 1);
}

export function isClueCountInRange(
  variant: SudokuVariant,
  difficulty: Difficulty,
  clueCount: number,
): boolean {
  const range = variant.clueRanges[difficulty];
  return clueCount >= range.min && clueCount <= range.max;
}

export function rateDifficultyByTechniques(
  variant: SudokuVariant,
  board: Board,
): Difficulty {
  return analyzeTechniques(variant, board).techniqueBased;
}

export function analyzeTechniques(
  variant: SudokuVariant,
  board: Board,
): TechniqueAnalysis {
  const clueBased = rateDifficulty(variant, board);
  const working = cloneBoard(board);
  let singlesRequired = 0;
  let maxCandidatesSeen = 0;
  const { size } = variant.grid;

  for (let row = 0; row < size; row++) {
    for (let column = 0; column < size; column++) {
      if (working[row]![column] !== null) {
        continue;
      }
      const candidates = getCandidates(variant, working, row, column);
      maxCandidatesSeen = Math.max(maxCandidatesSeen, candidates.length);
    }
  }

  while (true) {
    let progressed = false;

    for (let row = 0; row < size; row++) {
      for (let column = 0; column < size; column++) {
        if (working[row]![column] !== null) {
          continue;
        }
        const candidates = getCandidates(variant, working, row, column);
        if (candidates.length === 1) {
          working[row]![column] = candidates[0]!;
          singlesRequired++;
          progressed = true;
        }
      }
    }

    if (!progressed) {
      break;
    }
  }

  const clues = countClues(board);
  const h = variant.techniqueHeuristics;
  let techniqueBased: Difficulty;

  if (
    singlesRequired >= h.easy.singlesMin &&
    maxCandidatesSeen <= h.easy.maxCandidates
  ) {
    techniqueBased = "easy";
  } else if (
    singlesRequired >= h.medium.singlesMin &&
    maxCandidatesSeen <= h.medium.maxCandidates
  ) {
    techniqueBased = "medium";
  } else if (clues >= h.hardClueFloor) {
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

export function rateDifficulty(
  variant: SudokuVariant,
  board: Board,
): Difficulty {
  const clueCount = countClues(board);
  if (clueCount >= variant.clueRanges.easy.min) {
    return "easy";
  }
  if (clueCount >= variant.clueRanges.medium.min) {
    return "medium";
  }
  if (clueCount >= variant.clueRanges.hard.min) {
    return "hard";
  }
  return "expert";
}
