/**
 * Shared by speed.identity.test.js and speed.identity.slow.test.js: an answer as text, and both paths on the same
 * inputs asserted equal.
 */
import { expect } from 'vitest';
import { answerC } from './invariants.js';

/** The result as text, the trace's evaluation count aside (it counts a different search). */
export const asText = (answer) => {
  const c = JSON.parse(JSON.stringify(answer));
  if (c.trace) delete c.trace.evaluations;
  return JSON.stringify(c);
};

/** The reference solver and the fast path on the same inputs and env: the texts must be equal. Returns the fast result. */
export function bothWays(inputs, env) {
  const reference = answerC(inputs, { ...env, solver: 'reference' });
  const fast = answerC(inputs, env);
  expect(asText(fast)).toBe(asText(reference));
  return fast;
}

/*
 * Step 4: the engine seams for the new shapes (tests/v7/c/speed.identity.test.js, the step 4 block).
 */
import { checkInputs } from '../../../src/answers/shared/validate.js';
import { SCHEMA_C } from '../../../src/answers/c/schema.js';
import { toHousehold } from '../../../src/answers/c/toHousehold.js';
import { enginePlan, configsAt } from '../../../src/answers/shared/toEngine.js';
import { futuresList } from '../../../src/answers/shared/futures.js';
import { runFuture, STEP } from '../../../src/answers/shared/band.js';
import { sliceReturns } from '../../../src/answers/shared/lives.js';

/** C's runs for a household at a few amounts (k steps above the lowest) over its futures, or null when it has no pots. */
export function identityCases(inputs, env, n, ks) {
  const checked = checkInputs(SCHEMA_C, inputs, env);
  if (!checked.ok) return null;
  const { household } = toHousehold(checked.inputs, env);
  const plan = enginePlan(household, env);
  if (!(plan.totalPots > 0)) return null;
  const futures = futuresList(n, plan.years, env);
  const kLow = Math.floor(plan.guaranteedAtStartAYear / 12 / STEP + 1e-9);
  return { plan, futures, configsAtK: ks.map((dk) => configsAt(plan, (kLow + dk) * STEP * 12)) };
}

/**
 * The band of a stop plan read off every life on its own, each life's most found by bisection with today's engine
 * (`simulate`) on configsAt(plan, H, that life's pots) and the life's drawing years — the definition, run the slow way.
 * Valid where `simulate` is the replica: no locked run; and with S > 0 only on an all-shares mix (the bond stream).
 */
export function perLifeBandReference(sp, runner, S) {
  const plan = runner.plan;
  const kLow = Math.floor(plan.guaranteedAtStartAYear / 12 / STEP + 1e-9);
  const kMax = kLow + Math.ceil(plan.totalPots / STEP) + 12;
  const most = sp.lives.map((life, i) => {
    const future = { returns: sliceReturns(life, S, sp.D), seed: life.seed };
    const lasts = (k) => !runFuture(configsAt(plan, k * STEP * 12, runner.potsOf(i)), future).failed;
    if (lasts(kMax)) return kMax * STEP;
    let g = kLow, b = kMax;
    while (b - g > 1) { const mid = Math.floor((g + b) / 2); if (lasts(mid)) g = mid; else b = mid; }
    return g * STEP;
  }).sort((a, b) => a - b);
  const n = most.length;
  return { careful: most[Math.floor(n / 10)], middling: most[Math.floor(n / 2)], good: most[n - Math.ceil(n / 10)] };
}
