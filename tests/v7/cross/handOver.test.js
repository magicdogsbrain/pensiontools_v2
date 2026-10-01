/**
 * The hand-overs carry the inputs, never a projected pot (step 4 brief section 10, J10; the reviewers' findings: A → C
 * brought "£326,105" over, and errored for a stop before 57). Through the real reducer (draft/carry over state/carry.js),
 * with the real answers: what C is handed parses, and C's careful figure at that age is A's — and B's careful amount
 * paying in as now — whenever C asks nothing more than they do (handOver.c.same).
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../../../src/v7/rail/questions.js', async () => (await import('../shell/_allOpen.js')).allOpen());

import { reduce } from '../../../src/v7/state/reduce.js';
import { A } from '../../../src/v7/state/actions.js';
import { parsedDraft, currentKey } from '../../../src/v7/state/select.js';
import { fresh, run, set } from '../shell/_open.js';
import { answerA } from '../a/_a.js';
import { answerB } from '../b/_b.js';
import { answerC } from '../c/_c.js';

const ENV = { today: '2026-09-30', futures: 40, seed: 0, trace: false };
const typed = (q, values) => run(fresh(), ...Object.entries(values).map(([path, v]) => set(q, path, v)));
/** The state with q's answer worked out for what is typed, held as final. */
function answered(state, q, answer, detail) {
  const p = parsedDraft(state, q);
  expect(p.ok, JSON.stringify(p.errors)).toBe(true);
  const result = answer(p.inputs, { ...ENV, detail });
  return run(state, { type: A.ANSWER_WORKING, q, inputsKey: currentKey(state, q) }, { type: A.ANSWER_FINAL, q, inputsKey: currentKey(state, q), result });
}
const carry = (state, from, to) => reduce(state, { type: A.DRAFT_CARRY, from, to });

describe('A → C: the inputs as typed, the age the answer shows; C gives A\'s careful figure', () => {
  const CASES = [
    { name: '50, £250,000, £600 a month, £40,000 savings, stop at 60', values: { 'you.age': '50', 'you.pot': '250,000', 'you.payIn.total': '600', savings: '40,000', 'stop.age': '60', 'spend.amount': '1,900' } },
    { name: 'a split pay-in: £400 own + £250 employer, stop at 60', values: { 'you.age': '45', 'you.pot': '120,000', 'you.payIn.kind': 'split', 'you.payIn.own': '400', 'you.payIn.employer': '250', 'stop.age': '60', 'spend.amount': '2,500' } },
    { name: 'stopping at 53, before the pension opens, on savings (the link used to error)', values: { 'you.age': '47', 'you.pot': '60,000', savings: '360,000', 'stop.age': '53', 'spend.amount': '2,000' } },
    { name: 'a couple, 58 and 56, savings £80,000, stop at 62', values: { household: 'couple', 'you.age': '58', 'you.pot': '310,000', 'you.payIn.total': '1,000', 'partner.age': '56', 'partner.pot': '150,000', 'partner.payIn.total': '500', savings: '80,000', 'stop.age': '62', 'spend.amount': '3,500' } },
    { name: '"show me ages": the age shown is C\'s from-age', values: { 'you.age': '50', 'you.pot': '300,000', 'you.payIn.total': '800', savings: '40,000', 'stop.kind': 'ages', 'spend.amount': '2,000' } }
  ];

  it.each(CASES.map((x) => [x.name, x]))('%s', (_n, x) => {
    const s = answered(typed('a', x.values), 'a', answerA, 'chart');
    const a = s.answers.a.result;
    expect(a.handOver.c).toEqual({ ok: true, same: true });
    const c = carry(s, 'a', 'c');
    const p = parsedDraft(c, 'c');
    expect(p.ok, JSON.stringify(p.errors)).toBe(true);
    // the inputs, never a pot worked out of them
    expect(p.inputs.you.pot).toBe(a.inputs.you.pot);
    expect(p.inputs.savings).toBe(a.inputs.savings);
    expect(p.inputs.start).toEqual({ kind: 'age', age: a.shown.age });
    const r = answerC(p.inputs, ENV);
    expect(r.status).toBe('ok');
    expect(r.payIn.total).toBe(a.saving.reduce((t, x) => t + x.payIn.total, 0));
    expect(r.monthly.careful, 'C\'s careful figure is A\'s at the age shown').toBe(a.shown.monthly.careful);
    expect(r.monthly).toEqual(a.shown.monthly);
    // no note that the pot leaves out growth or what goes in (it does not), and no one-name note made by the hand-over
    const ids = r.warnings.map((w) => w.id);
    expect(ids).not.toContain('start-later');
    if (a.inputs.household === 'couple') expect(ids).not.toContain('one-name');
  });

  it('a stop before 57 with nothing else to live on: C cannot take it, and the answer says so (handOver.c.ok false)', () => {
    const s = answered(typed('a', { 'you.age': '47', 'you.pot': '400,000', 'you.payIn.total': '2,500', 'stop.age': '55', 'spend.amount': '1,800' }), 'a', answerA, 'chart');
    expect(s.answers.a.result.handOver.c.ok).toBe(false);
    const p = parsedDraft(carry(s, 'a', 'c'), 'c');
    expect(p.errors['start.age']).toBe('start-not-before-access');
  });

  it('what C asks beyond A — a saving risk of its own, savings going in, part-time work — is said (handOver.c.same false)', () => {
    const base = { 'you.age': '50', 'you.pot': '250,000', 'you.payIn.total': '600', 'stop.age': '60', 'spend.amount': '1,900' };
    for (const extra of [{ savingRisk: 'adventurous' }, { savingsIn: '200' }, { 'partTime.has': true, 'partTime.yearly': '12,000', 'partTime.years': '2' }]) {
      const s = answered(typed('a', { ...base, ...extra }), 'a', answerA, 'chart');
      expect(s.answers.a.result.handOver.c, JSON.stringify(extra)).toEqual({ ok: true, same: false });
    }
  });
});

/*
 * Fund and platform charges (6.19.0): C asks the charge too, and it is carried, so a charge other than 0.5% no longer
 * makes C's figure differ — the hand-over is the same at 0%, 0.5%, 1.25% and 1.5% (research/charges-setting.md T12).
 */
describe('the charge is carried into C, and C still gives A\'s and B\'s figure', () => {
  const A_BASE = { 'you.age': '50', 'you.pot': '250,000', 'you.payIn.total': '600', savings: '40,000', 'stop.age': '60', 'spend.amount': '1,900' };
  it.each(['0', '0.5', '1.25', '1.5'])('A → C at %s%%: handOver.c.same, and C\'s careful figure is A\'s', (charge) => {
    const s = answered(typed('a', { ...A_BASE, charge }), 'a', answerA, 'chart');
    const a = s.answers.a.result;
    expect(a.inputs.charge).toBe(Number(charge));
    expect(a.handOver.c).toEqual({ ok: true, same: true });
    const p = parsedDraft(carry(s, 'a', 'c'), 'c');
    expect(p.ok, JSON.stringify(p.errors)).toBe(true);
    expect(p.inputs.charge).toBe(Number(charge));
    const r = answerC(p.inputs, ENV);
    expect(r.monthly).toEqual(a.shown.monthly);
  });
  it.each(['0', '1.5'])('B → C at %s%%: C\'s careful figure is B\'s paying in as now', (charge) => {
    const s = answered(typed('b', { 'you.age': '50', 'you.pot': '120,000', 'you.payIn.total': '700', 'stop.age': '60', 'spend.amount': '2,000', charge }), 'b', answerB, 'answer');
    const b = s.answers.b.result;
    expect(b.handOver.c).toEqual({ ok: true, same: true });
    const p = parsedDraft(carry(s, 'b', 'c'), 'c');
    expect(p.inputs.charge).toBe(Number(charge));
    expect(answerC(p.inputs, ENV).monthly.careful).toBe(b.monthlyIfShort);
  });
  it('a higher charge, a lower careful figure: 1.5% gives less than 0.5%, which gives less than 0% (A\'s row, at 60)', () => {
    const at = (charge) => answered(typed('a', { ...A_BASE, charge }), 'a', answerA, 'chart').answers.a.result.shown.monthly.careful;
    const [c0, c05, c15] = ['0', '0.5', '1.5'].map(at);
    expect(c05).toBeLessThan(c0);
    expect(c15).toBeLessThan(c05);
  });
});

describe('B → C: the inputs as typed, the stop age; C gives B\'s careful amount paying in as now', () => {
  it.each([
    ['one person, 50, £120,000, £450 + £250, stop at 60', { 'you.age': '50', 'you.pot': '120,000', 'you.payIn.kind': 'split', 'you.payIn.own': '450', 'you.payIn.employer': '250', 'stop.age': '60', 'spend.amount': '2,000' }],
    ['a couple, 50 and 48, stop at 60', { household: 'couple', 'you.age': '50', 'you.pot': '250,000', 'you.payIn.total': '700', 'partner.age': '48', 'partner.pot': '150,000', 'partner.payIn.total': '300', 'stop.age': '60', 'spend.amount': '3,200' }]
  ])('%s', (_n, values) => {
    const s = answered(typed('b', values), 'b', answerB, 'answer');
    const b = s.answers.b.result;
    expect(b.handOver.c).toEqual({ ok: true, same: true });
    const p = parsedDraft(carry(s, 'b', 'c'), 'c');
    expect(p.ok, JSON.stringify(p.errors)).toBe(true);
    expect(p.inputs.you.pot).toBe(b.inputs.you.pot);
    const r = answerC(p.inputs, ENV);
    expect(r.monthly.careful).toBe(b.monthlyIfShort);
  });
});

describe('A → B: the age the answer shows', () => {
  it('after "show me ages" B\'s stop age is the earliest that worked (the stop box was empty)', () => {
    const s = answered(typed('a', { 'you.age': '50', 'you.pot': '300,000', 'you.payIn.total': '800', savings: '40,000', 'stop.kind': 'ages', 'spend.amount': '2,000' }), 'a', answerA, 'chart');
    const a = s.answers.a.result;
    expect(a.headline.kind).toBe('earliest');
    const b = carry(s, 'a', 'b');
    expect(b.draft.b.values['stop.age']).toBe(String(a.shown.age));
    expect(parsedDraft(b, 'b').ok).toBe(true);
  });
});
