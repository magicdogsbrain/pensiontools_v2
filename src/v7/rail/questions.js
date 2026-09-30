/**
 * The six questions on the front door, in order (V7 build brief 4.7). Data only; the words are in copy/.
 * A question that is not built opens #/soon/<id>.
 */
import { QUESTION_C } from './c.js';

export const QUESTIONS = [
  { id: 'a', built: false }, { id: 'b', built: false }, { id: 'c', built: true },
  { id: 'd', built: false }, { id: 'e', built: false }, { id: 'f', built: false }
];

/** The step lists of the questions that are built, by id. */
export const BUILT = { c: QUESTION_C };
