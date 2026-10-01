/**
 * The answers V7 can work out, by question id. The shell's effects (runner, worker, test hooks) import this file
 * and nothing else from src/answers/ except schemas, validate.js and format.js.
 *
 * A and B are re-exported from their own files: the stubs of P0 first, then the real functions (P2, P3) — this file
 * does not change again (step 4 brief 3).
 */
import { SCHEMA_C } from './c/schema.js';
import { answerC } from './c/answer.js';
import { SCHEMA_A } from './a/schema.js';
import { answerA } from './a/answer.js';
import { SCHEMA_B } from './b/schema.js';
import { answerB } from './b/answer.js';

export const ANSWERS = {
  c: { schema: SCHEMA_C, answer: answerC },
  a: { schema: SCHEMA_A, answer: answerA },
  b: { schema: SCHEMA_B, answer: answerB }
};
