/**
 * The six questions on the front door, in order (V7 build brief 4.7; step 4 brief 4.12). Data only; the words are in copy/.
 * A question that is not built opens #/soon/<id>.
 *
 * Step 4: every question's step list is in STEP_LISTS; OPEN says which are open to a visitor. A question in OPEN is
 * `built` on the front door, its addresses (#/a/numbers …) are understood, its draft and answer are in the state
 * (state/initial.js) and #/soon/<id> is "not found". A and B join OPEN in the joining-up change — with P4's routes and
 * rail, P5's screens and C's "What next?" links — so that until then the front door, C's links and the reducer's
 * state stay as C's pinned states, pictures and tests have them. A package building A or B adds them to OPEN on its
 * own branch; the lead makes the change once on the joined-up branch.
 */
import { QUESTION_A } from './a.js';
import { QUESTION_B } from './b.js';
import { QUESTION_C } from './c.js';

/** Every question's step list that exists, by id. */
export const STEP_LISTS = { a: QUESTION_A, b: QUESTION_B, c: QUESTION_C };

/** The questions open to a visitor. Joining up (step 4 brief 5): ['a', 'b', 'c']. */
export const OPEN = Object.freeze(['a', 'b', 'c']);

export const QUESTIONS = ['a', 'b', 'c', 'd', 'e', 'f'].map((id) => ({ id, built: OPEN.includes(id) }));

/** The step lists of the questions that are open, by id. */
export const BUILT = Object.fromEntries(OPEN.map((id) => [id, STEP_LISTS[id]]));
