/**
 * The hand-over to C through the shell (one test everywhere, step 4 brief section 10): "What could I spend a month from
 * 60?" on A's or B's answer carries the inputs — the pot as typed, what goes in, the savings, the age — and C, asked
 * from the draft the carry wrote, shows the same careful figure as the answer it came from: A's careful amount at the
 * age shown, B's "about £X a month from 60" (monthlyIfShort). Only where the answer says C takes that age and asks
 * nothing it was given beyond it (handOver.c: ok and same).
 *
 * Runs the real answers at 40 futures; the carry is the reducer's draft/carry, exactly as the link sends it.
 */
import { describe, it, expect } from 'vitest';
import { initialState } from '../../../src/v7/state/initial.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { parsedDraft, currentKey } from '../../../src/v7/state/select.js';
import { answerA } from '../../../src/answers/a/answer.js';
import { answerB } from '../../../src/answers/b/answer.js';
import { answerC } from '../../../src/answers/c/answer.js';

const TODAY = '2026-09-30';
const ENV = { today: TODAY, futures: 40, seed: 0, trace: false };
const ANSWER = { a: answerA, b: answerB };

/** A state with question q's draft typed and its answer worked out (final) for what is typed. */
function answered(q, values, detail) {
  const s0 = initialState({ today: TODAY, build: 'test' });
  const s = { ...s0, draft: { ...s0.draft, [q]: { ...s0.draft[q], values: { ...values } } } };
  const parsed = parsedDraft(s, q);
  expect(parsed.ok, JSON.stringify(parsed.errors)).toBe(true);
  const result = ANSWER[q](parsed.inputs, { ...ENV, detail });
  const key = currentKey(s, q);
  const t = reduce(reduce(s, { type: 'answer/working', q, inputsKey: key }), { type: 'answer/final', q, inputsKey: key, result });
  return { state: t, result };
}

/** C, asked from the draft draft/carry wrote. */
function carriedToC(state, from) {
  const s = reduce(state, { type: 'draft/carry', from, to: 'c' });
  const parsed = parsedDraft(s, 'c');
  expect(parsed.ok, JSON.stringify(parsed.errors)).toBe(true);
  return answerC(parsed.inputs, ENV);
}

const CASES_A = {
  'single, 50, paying in, stop at 60': { 'you.age': '50', 'you.pot': '250,000', 'you.payIn.total': '600', savings: '40,000', 'stop.age': '60', 'spend.amount': '1,900' },
  'single, 55, split pay-in, stop at 60': { 'you.age': '55', 'you.pot': '300,000', 'you.payIn.kind': 'split', 'you.payIn.own': '400', 'you.payIn.employer': '400', 'stop.age': '60', 'spend.amount': '2,000' },
  'single, 60, stopping now': { 'you.age': '60', 'you.pot': '480,000', savings: '40,000', 'stop.age': '60', 'spend.amount': '2,000' },
  'a couple, both paying in, stop at 60': { household: 'couple', 'you.age': '55', 'you.pot': '420,000', 'you.payIn.total': '600', 'partner.age': '53',
    'partner.pot': '180,000', 'partner.payIn.total': '300', savings: '40,000', 'stop.age': '60', 'spend.amount': '3,000' }
};

describe('A → C: C shows A\'s careful figure for the age shown', () => {
  it.each(Object.entries(CASES_A))('%s', (name, values) => {
    const { state, result } = answered('a', values, 'chart');
    const hand = result.handOver && result.handOver.c;
    expect(hand, 'these households ask C nothing beyond it, at an age C takes').toEqual({ ok: true, same: true });
    const c = carriedToC(state, 'a');
    expect(c.status).toBe('ok');
    expect(c.monthly.careful, name).toBe(result.shown.monthly.careful);
  });
});

const CASES_B = {
  'single, 50, short at 60': { 'you.age': '50', 'you.pot': '120,000', 'you.payIn.kind': 'split', 'you.payIn.own': '450', 'you.payIn.employer': '250', 'stop.age': '60', 'spend.amount': '2,000' },
  'single, 48, on course at 60': { 'you.age': '48', 'you.pot': '350,000', 'you.payIn.total': '1,400', savings: '20,000', 'stop.age': '60', 'spend.amount': '2,000' }
};

describe('B → C: C shows what B says the pay-in now gives from the stop age', () => {
  it.each(Object.entries(CASES_B))('%s', (name, values) => {
    const { state, result } = answered('b', values, 'answer');
    const hand = result.handOver && result.handOver.c;
    expect(hand).toEqual({ ok: true, same: true });
    const c = carriedToC(state, 'b');
    expect(c.status).toBe('ok');
    expect(c.monthly.careful, name).toBe(result.monthlyIfShort);
  });
});
