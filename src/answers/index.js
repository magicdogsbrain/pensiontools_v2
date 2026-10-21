/**
 * The answers V7 can work out, by question id. The shell's effects (runner, worker, test hooks) import this file
 * and nothing else from src/answers/ except schemas, validate.js and format.js.
 *
 * A and B are re-exported from their own files: the stubs of P0 first, then the real functions (P2, P3). D joined in
 * 6.39.0 (road-to-7.md step 7).
 */
import { SCHEMA_C } from './c/schema.js';
import { answerC } from './c/answer.js';
import { SCHEMA_A } from './a/schema.js';
import { answerA } from './a/answer.js';
import { SCHEMA_B } from './b/schema.js';
import { answerB } from './b/answer.js';
import { SCHEMA_D } from './d/schema.js';
import { answerD } from './d/answer.js';

export const ANSWERS = {
  c: { schema: SCHEMA_C, answer: answerC },
  a: { schema: SCHEMA_A, answer: answerA },
  b: { schema: SCHEMA_B, answer: answerB },
  // D (research/v7/answer-D.md; road-to-7.md step 7): A's "stop now" route, reused
  d: { schema: SCHEMA_D, answer: answerD }
};
