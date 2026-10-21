/**
 * The stand-in for src/v7/rail/questions.js with A, B, C and D open, as the joined-up branch has it (see _open.js; D with
 * road-to-7.md step 7).
 * Imports nothing of the shell but the real questions.js, so the mock cannot go round in a circle. Not a test file.
 */
import { vi } from 'vitest';

export async function allOpen() {
  const real = await vi.importActual('../../../src/v7/rail/questions.js');
  const OPEN = Object.freeze(['a', 'b', 'c', 'd']);
  return {
    ...real,
    OPEN,
    QUESTIONS: ['a', 'b', 'c', 'd', 'e', 'f'].map((id) => ({ id, built: OPEN.includes(id) })),
    BUILT: Object.fromEntries(OPEN.map((id) => [id, real.STEP_LISTS[id]]))
  };
}
