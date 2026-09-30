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
