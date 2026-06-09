import { ALL_VARIANTS } from "../helpers/variants.js";
import {
  fixturePuzzle,
  fixtureSolvedBoard,
  hyperSolvedBoard,
} from "../helpers/fixtures.js";

/** Pre-warm expensive variant fixtures once per worker before any test file runs. */
for (const variant of ALL_VARIANTS) {
  fixturePuzzle(variant, "easy");
  fixturePuzzle(variant, "medium");
  fixtureSolvedBoard(variant);
}
hyperSolvedBoard();
