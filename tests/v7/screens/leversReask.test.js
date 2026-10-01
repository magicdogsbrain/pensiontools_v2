/**
 * B's "Try" buttons put exactly what each lever means into the numbers, so asking again gives the lever's own figure
 * (the review of 1 Oct 2026: "levers must match what re-asking gives"). The actions are the screen's own
 * (leverActions, the button's onClick), applied through the real reducer to a typed draft, then asked again of the real
 * answer: the stop-later age, the pay-in and the lower spending each make the money last in 9 futures out of 10 —
 * on course — and more risk while saving, where it helps, needs the pay-in it named.
 *
 * Households: one stopping when the pension is open (60), one before it (55, with savings), and a couple.
 */
import { describe, it, expect } from 'vitest';
import { initialState } from '../../../src/v7/state/initial.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { parsedDraft } from '../../../src/v7/state/select.js';
import { answerB } from '../../../src/answers/b/answer.js';
import { leverActions, LEVERS } from '../../../src/v7/components/Levers.jsx';

const TODAY = '2026-09-30';
const ENV = { today: TODAY, futures: 40, seed: 0, trace: false, detail: 'answer' };

const HOUSEHOLDS = {
  'stop at 60': { 'you.age': '50', 'you.pot': '120,000', 'you.payIn.kind': 'split', 'you.payIn.own': '450', 'you.payIn.employer': '250', 'stop.age': '60', 'spend.amount': '2,000' },
  'stop at 55, before the pension opens': { 'you.age': '47', 'you.pot': '150,000', 'you.payIn.total': '800', savings: '30,000', 'stop.age': '55', 'spend.amount': '1,800' },
  'a couple': { household: 'couple', 'you.age': '50', 'you.pot': '250,000', 'you.payIn.total': '700', 'partner.age': '48', 'partner.pot': '150,000', 'partner.payIn.total': '300', 'stop.age': '60', 'spend.amount': '3,200' }
};

/** A state with B's draft typed. */
function typed(values) {
  const s = initialState({ today: TODAY, build: 'test' });
  return { ...s, draft: { ...s.draft, b: { ...s.draft.b, values: { ...values } } } };
}
const ask = (state) => {
  const parsed = parsedDraft(state, 'b');
  expect(parsed.ok, JSON.stringify(parsed.errors)).toBe(true);
  return answerB(parsed.inputs, ENV);
};

describe.each(Object.entries(HOUSEHOLDS))('%s: each lever, tried and asked again, gives its own figure', (name, values) => {
  const start = typed(values);
  const result = ask(start);

  it('the answer is short, with levers to try', () => {
    expect(['ok', 'out-of-reach']).toContain(result.status);
    expect(result.onCourse).toBe(false);
    const tryable = LEVERS.filter((id) => id !== 'accept' && result.levers[id] && leverActions(id, result));
    expect(tryable.length, `levers with a "Try": ${tryable}`).toBeGreaterThanOrEqual(2);
  });

  it.each(LEVERS.filter((id) => id !== 'accept'))('%s', (id) => {
    const lever = result.levers && result.levers[id];
    const actions = lever ? leverActions(id, result) : null;
    if (!actions) return;                                         // not found, not for a couple, or does not help: no "Try"
    const tried = actions.reduce((s, a) => reduce(s, a), start);
    expect(parsedDraft(tried, 'b').ok).toBe(true);
    const again = ask(tried);
    if (id === 'moreRisk') {
      expect(again.payIn.needed, 'more risk: the pay-in it named').toBe(lever.payIn);
      return;
    }
    // stop later, pay in more, spend less: each makes the money last in 9 futures out of 10 — on course
    expect(again.onCourse, `${id}: on course once tried`).toBe(true);
    expect(again.chance.lasted).toBe(lever.lasted);
  });
});
