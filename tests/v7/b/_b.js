/**
 * The adapter for question B (step 4 brief 4.14) — the ONLY test file that knows real paths for B.
 * Every other test under tests/v7/b/ imports the answer, the input list and the screen from here.
 */
import { SCHEMA_B } from '../../../src/answers/b/schema.js';
import { readForm as readFormFor } from '../a/_a.js';

import { answerB as answerOnEnv } from '../../../src/answers/b/answer.js';
import * as planPath from '../../../src/answers/keep/planPath.js';

/**
 * B as every caller asks it (src/answers/index.js answerFor): one person runs its drawing years on the kept plan, handed in
 * as env.planPath — here the module itself, as the worker hands it after its lazy import.
 */
export const withPlanPath = (env) => (env && env.planPath ? env : { ...(env || {}), planPath });
export const answerB = (inputs, env) => answerOnEnv(inputs, withPlanPath(env));
export { SCHEMA_B };
export const TEST_ENV = { today: '2026-09-30', futures: 40, seed: 0, trace: false, detail: 'answer' };
export { get, renderScreen } from '../c/_c.js';

/** { [path]: value } read back from the boxes of a drawn B form, by data-testid="b.<path>" (A's reader over B's list). */
export function readForm(root, q = 'b') {
  return readFormFor(root, q, SCHEMA_B);
}
