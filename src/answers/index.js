/**
 * The answers V7 can work out, by question id. The shell's effects (runner, worker, test hooks) import this file
 * and nothing else from src/answers/ except schemas, validate.js and format.js.
 *
 * A and B are re-exported from their own files: the stubs of P0 first, then the real functions (P2, P3). D joined in
 * 6.39.0 (road-to-7.md step 7).
 *
 * The plan path (7.12.0, one answer for the same household): a question in ON_PLAN_PATH runs its "will it last" on the
 * plan keeping it would write (keep/planPath.js), handed to it as env.planPath. That module reaches the strategies, so it
 * is loaded only with import() — the worker's own chunk and the shell never carry it (tests/v7/boundaries.test.js) — and
 * answerFor is the one way every caller (the worker, the page without a worker, the test hooks) asks such a question.
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

/** The questions whose runs are the kept plan's, for one person (keep/planPath.js; C from now; A's and B's drawing years). */
export const ON_PLAN_PATH = Object.freeze(['a', 'b', 'c', 'd']);

/** The plan path, loaded lazily (its own chunk, with the engine). */
export const loadPlanPath = () => import('./keep/planPath.js');

/** env with the plan path for a question on it (loaded when the env does not carry it already). */
export async function envFor(q, env) {
  if (!ON_PLAN_PATH.includes(q) || (env && env.planPath)) return env;
  return { ...(env || {}), planPath: await loadPlanPath() };
}

/** Question `q` answered with what it needs (envFor). */
export async function answerFor(q, inputs, env, answers = ANSWERS) {
  return answers[q].answer(inputs, await envFor(q, env));
}
