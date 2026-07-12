import {
  fixturePuzzle,
  fixtureSolvedBoard,
} from "../helpers/fixtures.js";

/** Warm cheap classic-family fixtures; tight variants generate lazily. */
for (const variant of ["classic", "6x6", "diagonal"] as const) {
  fixturePuzzle(variant, "easy");
  fixturePuzzle(variant, "medium");
  fixtureSolvedBoard(variant);
}
