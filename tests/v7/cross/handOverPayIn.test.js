/**
 * The hand-over from "Am I saving enough?" to "What is my pot worth a month?" changes the question, so it says so: the
 * link names a different question, and C's answer says on arrival where its figures came from, what it asks instead, and
 * that "Back to" shows what the figures support. The pay-in goes as typed (a share of pay keeps its two parts: the saver
 * brief's carry, tests/v7/plan/saverScenarios.test.js "step 6", holds the plan it seeds).
 *
 * Fictional: Jo, 33, pay £38,000, pays 5% and the employer 3%, pot £22,000, wants £2,500 a month from 65.
 */
import { describe, it, expect } from 'vitest';
import { fresh, run, set, answered } from '../shell/_open.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { A as ACT } from '../../../src/v7/state/actions.js';
import { parsedDraft } from '../../../src/v7/state/select.js';
import { answerC } from '../../../src/answers/c/answer.js';
import { draw } from '../render/checkScreen.js';
import { A } from '../../../src/v7/copy/a.js';
import { B } from '../../../src/v7/copy/b.js';

const TODAY = '2026-09-30';

function joInC() {
  let st = run(fresh({ today: TODAY }), set('b', 'you.age', '33'), set('b', 'you.pot', '22,000'), set('b', 'you.payIn.kind', 'share'), set('b', 'you.payIn.pay', '38,000'),
    set('b', 'you.payIn.ownPct', '5'), set('b', 'you.payIn.employerPct', '3'), set('b', 'stop.age', '65'), set('b', 'spend.amount', '2,500'));
  st = answered(st, 'b', { status: 'ok', saving: [{ who: 'you', payIn: { total: 253.33 } }] });
  st = reduce(st, { type: ACT.DRAFT_CARRY, from: 'b', to: 'c' });
  return st;
}

describe('the hand-over to C says it is a different question', () => {
  it('the link from A and B names a different question', () => {
    for (const words of [A.answer, B.answer]) {
      expect(`${words.toCStart} 65${words.toCEnd}`).toBe('What could my pot pay a month from 65? (a different question: it starts from your pot, not from what you want)');
    }
  });

  it('Jo carried into C: the pay-in keeps its two parts, and the answer says where the figures came from', () => {
    let st = joInC();
    expect(st.draft.c.carriedFrom).toBe('b');
    expect(st.draft.c.values).toMatchObject({ 'you.payIn.kind': 'share', 'you.payIn.ownPct': '5', 'you.payIn.employerPct': '3' });
    expect(Number(String(st.draft.c.values.take).replace(/,/g, ''))).toBe(2500);
    const parsed = parsedDraft(st, 'c');
    expect(parsed.ok).toBe(true);
    // 38,000 × (5% + 3%) ÷ 12 = 253.33 a month lands in the pension
    expect(parsed.inputs.you.payIn).toMatchObject({ kind: 'share', pay: 38000, ownPct: 5, employerPct: 3 });
    const result = answerC(parsed.inputs, { today: TODAY, futures: 100, seed: 0, trace: false });
    st = answered(st, 'c', result);
    st = reduce(st, { type: ACT.ROUTE_SET, route: { screen: 'step', q: 'c', step: 'answer', planId: null, focus: null } });
    const { root } = draw(st);
    const line = root.querySelector('[data-testid="c.answer.carried"]');
    expect(line).not.toBeNull();
    const level = result.levels[result.level].monthly;
    const pounds = (n) => '£' + Math.round(n).toLocaleString('en-GB');
    expect(line.textContent).toBe(`Your figures are brought over from "Am I saving enough?". This page asks a different question: what your pot and what you pay in could pay. It starts on £2,500 a month, the amount you want. "Back to ${pounds(level)}" shows what they support.`);
  });
});
