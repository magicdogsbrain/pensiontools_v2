/**
 * Question A: cases the random runs found that have no answer to give (found.cases.json holds the ones that do, and
 * pairs.test.js runs them through checkAnswerA). Each is kept for ever with the seed and the reason.
 */
import { describe, it, expect } from 'vitest';
import { answerA, SCHEMA_A, TEST_ENV } from './invariants.js';
import { checkInputs } from '../../../src/answers/shared/validate.js';

describe('A — found by the random runs', () => {
  // tests/v7/a/reuse.test.js R1 (seed 20261001, 1 Oct 2026): "show me ages" for someone of 76. The form takes the age
  // (C's field, to 100), but A shows stop ages up to 75 only, so there is no row at all; livesList was asked for a life of
  // -Infinity years and threw. Now it is a problem the answer names, and the form names it first (the rule
  // stop-ages-past-75, on "When do you have in mind?", with words in copy/a.js), so the answer is never asked.
  it.each([[76, 77, 0], [76, 95, 200000], [80, 95, 200000], [100, 105, 50000]])('"show me ages" at %i (to %i, a pot of £%i): no row to show, said as a problem, never thrown', (age, endAge, pot) => {
    const inputs = { you: { age, pot }, stop: { kind: 'ages' }, spend: { kind: 'amount', amount: 1500 }, endAge };
    expect(checkInputs(SCHEMA_A, inputs, TEST_ENV).errors).toEqual({ 'stop.kind': 'stop-ages-past-75' });
    for (const detail of ['chart', 'all']) {
      const a = answerA(inputs, { ...TEST_ENV, futures: 20, detail });
      expect(a).toEqual({ status: 'invalid', problems: [{ field: 'stop.kind', messageId: 'stop-ages-past-75' }] });
    }
  });

  it('at 75 there is one row, stopping now', () => {
    const a = answerA({ you: { age: 75, pot: 200000 }, stop: { kind: 'ages' }, spend: { kind: 'amount', amount: 1500 } }, { ...TEST_ENV, futures: 20 });
    expect(a.status).toBe('ok');
    expect(a.ages.map((r) => r.age)).toEqual([75]);
  });
});
