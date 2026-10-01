/**
 * Cases with an exact answer (step 4 brief 6, P2; test-plan-A-B.md 4.2, AF1–AF10 with the brief's paths): one made-up
 * future, prices flat, every investment returning exactly 0%, the pots held as cash while saving and after
 * (env.savingMix, env.mix), savings growing at 0% once stopped (env.savingsGrowth), no charge — so the sums can be
 * done by hand. The pay-in is what lands in the pension (conflict 11), so the pot at the stop is the pot plus
 * 12 × S × the pay-in.
 *
 * The pots are chosen a little off the knife-edge (£120,100, not £120,000): at exactly £500 a month for 420 months
 * the last month would decide on the last penny.
 *
 * AF4–AF6 go through the locked run: the pension closed until 57, the savings paying until then (conflict 1).
 * AF9 is X1 at 40 real futures: stopping today is question C.
 */
import { describe, it, expect } from 'vitest';
import { answerA, checkAnswerA, ENGINE_READY, TEST_ENV } from './invariants.js';
import { answerC } from '../c/_c.js';

const CASH = { equity: 0, bond: 0, cash: 1 };
const FLAT = { ...TEST_ENV, futures: 1, futureReturns: () => ({ equity: {}, inflation: {} }), mix: CASH, savingMix: CASH, savingsGrowth: 0 };
const NO_SP = { kind: 'none' };
const ok = (a, inputs, env) => { expect(a.status, JSON.stringify(a.problems)).not.toBe('invalid'); const f = checkAnswerA(a, inputs, env); expect(f, f.join('\n')).toEqual([]); return a; };
const three = (v) => ({ careful: v, middling: v, good: v });
const AF1 = { you: { age: 45, pot: 120100, payIn: { total: 500 }, statePension: NO_SP }, stop: { age: 60 }, spend: { amount: 1000 }, charge: 0 };
const AF4 = { you: { age: 47, pot: 300000, statePension: NO_SP }, savings: 60000, stop: { age: 55 }, spend: { amount: 1300 }, charge: 0 };
const rowOf = (a, age) => a.ages.find((r) => r.age === age);

describe.skipIf(!ENGINE_READY)('A — closed forms: a flat future, 0% on everything, all in cash', () => {
  it('AF1 the sum: 45, £120,100 + £500 a month for 15 years = £210,100 at 60; £1,000 a month runs out at 77; the careful amount is £500', () => {
    const env = { ...FLAT, ages: [60] };
    const a = ok(answerA(AF1, env), AF1, env);
    expect(a.status).toBe('ok');
    expect(a.shown.age).toBe(60);
    expect(a.shown.yearsSaving).toBe(15);
    expect(a.shown.potAtStop).toMatchObject(three(210100));
    expect(a.shown.paidIn.total).toBe(90000);
    expect(a.saving[0].potAtStop.pension).toEqual(three(210100));
    expect(a.saving[0].potAtStop.savings).toEqual(three(0));
    expect(a.shown.verdict).toBe('no');
    expect(a.shown.lasted).toBe(0);
    expect(a.shown.runOutAge).toBe(77);                                  // 210,100 ÷ 1,000 = 210 months paid, month 211 short: age 60 + 17
    expect(a.shown.monthly).toEqual(three(500));                         // 210,100 ÷ 420 = 500.24, whole £10 down; a quarter tax-free keeps it under the allowance
    expect(a.shown.gapYears).toBe(0);
    expect(a.headline).toMatchObject({ kind: 'named', age: 60, verdict: 'no', runOutAge: 77 });
    expect(a.sentences.head.text).toBe('Not at 60 on these figures');
    expect(a.sentences.bad.text).toContain('run out at age 77');
  });

  it('AF2 yes: the same with £500 a month → every future, lasting to 95', () => {
    const inputs = { ...AF1, spend: { amount: 500 } };
    const env = { ...FLAT, ages: [60] };
    const a = ok(answerA(inputs, env), inputs, env);
    expect(a.shown.verdict).toBe('yes');
    expect(a.shown.lasted).toBe(1);
    expect(a.shown.runOutAge).toBe(95);
    expect(a.shown.spare).toBe(0);
    expect(a.sentences.head.text).toBe('Yes — you could stop at 60');
  });

  it('AF3 the range: stopping at 58–62, each row its own sum; one more year from 60 buys £20 a month', () => {
    const env = { ...FLAT, ages: [58, 59, 60, 61, 62] };
    const a = ok(answerA(AF1, env), AF1, env);
    expect(a.ages.map((r) => r.age)).toEqual([58, 59, 60, 61, 62]);
    expect(a.ages.map((r) => r.potAtStop.middling)).toEqual([198100, 204100, 210100, 216100, 222100]);
    // 198,100 ÷ 444 = 446.2 · 204,100 ÷ 432 = 472.5 · 210,100 ÷ 420 = 500.2 · 216,100 ÷ 408 = 529.7 · 222,100 ÷ 396 = 560.9
    expect(a.ages.map((r) => r.monthly.careful)).toEqual([440, 470, 500, 520, 560]);
    expect(a.shown.oneMoreYear).toMatchObject({ toAge: 61, extraMonthly: 20, sameish: true, potExtra: 6000 });
    expect(a.ages[4].oneMoreYear).toBeNull();
    expect(a.earliest).toEqual({ yes: null, close: null });
    expect(a.warnings.some((w) => w.id === 'not-in-range')).toBe(true);
    expect(a.sentences.chart).toHaveLength(5);
  });

  it('AF4 from savings before 57: 47 stopping at 55 — the pension is closed until 57, the savings pay £31,200 of it, then it runs out at 78', () => {
    const env = { ...FLAT, ages: [55] };
    const a = ok(answerA(AF4, env), AF4, env);
    expect(a.pensionOpens.you).toBe(57);                                   // 55 on 30 Sep 2034, after 6 April 2028
    expect(a.shown.gapYears).toBe(2);
    expect(a.gapYears).toBe(2);
    const first = a.shown.phases[0];
    expect(first).toMatchObject({ fromAge: 55, toAge: 57, pensionOpen: false, fromPension: 0 });
    expect(first.fromSavings).toBeCloseTo(1300, 2);
    expect(first.byPerson[0].locked).toBe(true);
    expect(a.shown.phases[1]).toMatchObject({ fromAge: 57, pensionOpen: true });
    expect(a.savingsNeeded).toEqual({ amount: 31200, untilAge: 57 });     // 24 × £1,300: the savings at 57 are 60,000 − 31,200 = 28,800
    expect(a.shown.runOutAge).toBe(78);                                   // (300,000 + 28,800) ÷ 1,300 = 252.9 months from 57
    expect(a.shown.verdict).toBe('no');
    expect(a.warnings.map((w) => w.id)).toContain('pension-closed');
    expect(a.warnings.map((w) => w.id)).not.toContain('savings-run-short');
    expect(a.assumed.map((x) => x.id)).toContain('pension-closed-until');
    expect(a.sentences.savingsNeeded.text).toContain('£31,000');
  });

  it('AF5 not enough savings: £20,000 runs out at 56, before the pension opens at 57; stopping at 57 or 58 draws on the whole sum', () => {
    const inputs = { ...AF4, savings: 20000 };
    const env = { ...FLAT, ages: [55, 56, 57, 58] };
    const a = ok(answerA(inputs, env), inputs, env);
    expect(rowOf(a, 55).runOutAge).toBe(56);                              // 20,000 ÷ 1,300 = 15.4 months: short in the 16th
    expect(a.warnings.map((w) => w.id)).toContain('savings-run-short');
    expect(rowOf(a, 56).runOutAge).toBe(76);                              // 4,400 left at 57, then 304,400 ÷ 1,300 = 234.2 months
    expect(rowOf(a, 57).runOutAge).toBe(77);                              // 320,000 ÷ 1,300 = 246.2 months from 57
    expect(rowOf(a, 58).runOutAge).toBe(78);
    expect(rowOf(a, 57).gapYears).toBe(0);
    expect(a.earliest.yes).toBeNull();
  });

  it('AF6 nothing open: no savings at all → no, it runs out at 55, and the warning names 57', () => {
    const inputs = { ...AF4, savings: 0 };
    const env = { ...FLAT, ages: [55] };
    const a = ok(answerA(inputs, env), inputs, env);
    expect(a.shown.verdict).toBe('no');
    expect(a.shown.runOutAge).toBe(55);
    const w = a.warnings.find((x) => x.id === 'no-savings-for-gap');
    expect(w).toBeDefined();
    expect(w.text).toContain('57');
  });

  it('AF7 the State Pension pays the rest: 60, £84,100, £1,000 a month to 67 from the pot, then the State Pension covers it', () => {
    const inputs = { you: { age: 60, pot: 84100 }, stop: { age: 60 }, spend: { amount: 1000 }, charge: 0 };
    const env = { ...FLAT, ages: [60] };
    const a = ok(answerA(inputs, env), inputs, env);
    expect(a.shown.verdict).toBe('yes');
    expect(a.shown.lasted).toBe(1);
    expect(a.shown.phases).toHaveLength(2);
    expect(a.shown.phases[0]).toMatchObject({ fromAge: 60, toAge: 67, tax: 0, beforeStatePension: true, pensionOpen: true });
    expect(a.shown.phases[0].fromPension).toBeCloseTo(1000, 2);
    expect(a.shown.phases[1].fromPots).toBe(0);
    expect(a.guaranteed.monthlyAfterTax).toBeCloseTo(1045.63, 2);
    expect(a.shown.potAtStop).toMatchObject(three(84100));
    expect(a.shown.paidIn.total).toBe(0);
  });

  it('AF8 part-time: £12,570 a year for 3 years covers £1,047.50 a month with nothing drawn; a bad case moves from 76 to 79', () => {
    const inputs = { ...AF1, spend: { amount: 1047.5 }, partTime: { has: true, yearly: 12570, years: 3 } };
    const env = { ...FLAT, ages: [60] };
    const a = ok(answerA(inputs, env), inputs, env);
    expect(a.partTime).toMatchObject({ yearly: 12570, years: 3, fromAge: 60, toAge: 63, runOutWithout: 76, runOutWith: 79 });
    expect(a.partTime.oneMore).toMatchObject({ years: 4, runOutAge: 80 });
    expect(a.shown.runOutAge).toBe(79);
    const first = a.shown.phases[0];
    expect(first.fromWork).toBeCloseTo(1047.5, 2);
    expect(first.fromPots).toBeCloseTo(0, 2);
    expect(a.assumed.map((x) => x.id)).toContain('work-tax');
  });

  it('AF9 stopping today is question C: the same band, the same bad case, the same phases (40 real futures)', () => {
    const env = { ...TEST_ENV, futures: 40 };
    const c = answerC({ you: { pot: 250000, age: 60 } }, env);
    const inputs = { you: { pot: 250000, age: 60 }, stop: { age: 60 }, spend: { amount: c.monthly.careful } };
    const a = ok(answerA(inputs, { ...env, ages: [60] }), inputs, { ...env, ages: [60] });
    expect(a.shown.yearsSaving).toBe(0);
    expect(a.shown.monthly).toEqual(c.monthly);
    expect(a.shown.yearly).toEqual(c.yearly);
    expect(a.shown.lastedAt).toEqual(c.lasted);
    expect(a.shown.runOutAgeAt).toEqual(c.runOutAge);
    expect(a.guaranteed).toEqual(c.guaranteed);
    const cFields = (p) => ({ fromAge: p.fromAge, toAge: p.toAge, ages: p.ages, takeHome: p.takeHome, fromPension: p.fromPension, fromSavings: p.fromSavings, fromPots: p.fromPots, statePension: p.statePension, finalSalary: p.finalSalary, tax: p.tax, beforeStatePension: p.beforeStatePension });
    expect(a.shown.phases.map(cFields)).toEqual(c.phases.map(cFields));
    expect(a.shown.lasted).toBe(c.lasted.careful);
    // with a spend of £1,000 against C's `take` of £1,000: the same count and the same bad case
    const c2 = answerC({ you: { pot: 250000, age: 60 }, take: 1000 }, env);
    const a2 = answerA({ ...inputs, spend: { amount: 1000 } }, { ...env, ages: [60] });
    expect(a2.shown.lasted).toBe(c2.take.lasted);
    expect(a2.shown.runOutAge).toBe(c2.take.runOutAge);
  });

  it('AF10 a couple is two singles: both AF2, stopping together → £1,000 a month between them, half each', () => {
    const one = { age: 45, pot: 120100, payIn: { total: 500 }, statePension: NO_SP };
    const inputs = { household: 'couple', you: one, partner: one, stop: { age: 60 }, spend: { amount: 1000 }, charge: 0 };
    const env = { ...FLAT, ages: [60] };
    const a = ok(answerA(inputs, env), inputs, env);
    expect(a.shown.monthly.careful).toBe(1000);
    expect(a.shown.verdict).toBe('yes');
    expect(a.shown.potAtStop.middling).toBe(420200);
    expect(a.basis.split).toEqual([{ who: 'you', share: 0.5 }, { who: 'partner', share: 0.5 }]);
    expect(a.saving.map((x) => x.potAtStop.pension.middling)).toEqual([210100, 210100]);
    expect(a.sentences.head.id).toBe('a.head.couple');
  });

  it('stopping today pays nothing in: £1,000 a month going in and a stop at today\'s age leaves the pot as typed', () => {
    const inputs = { you: { age: 60, pot: 250000, payIn: { total: 1000 }, statePension: NO_SP }, stop: { age: 60 }, spend: { amount: 900 }, charge: 0 };
    const env = { ...FLAT, ages: [60, 61] };
    const a = ok(answerA(inputs, env), inputs, env);
    expect(rowOf(a, 60).paidIn.total).toBe(0);
    expect(rowOf(a, 60).potAtStop.middling).toBe(250000);
    expect(rowOf(a, 61).paidIn.total).toBe(12000);
    expect(rowOf(a, 61).potAtStop.middling).toBe(262000);
  });

  it('a charge while saving: 0.5% a year on £120,100 for 15 years with nothing paid in is the closed form (CF-S2), to the pound', () => {
    const inputs = { you: { age: 45, pot: 120100, statePension: NO_SP }, stop: { age: 60 }, spend: { amount: 500 }, charge: 0.5 };
    const env = { ...FLAT, ages: [60] };
    const a = ok(answerA(inputs, env), inputs, env);
    const Q = Math.pow(1 - 0.005, 1 / 12);
    expect(a.shown.potAtStop.middling).toBe(Math.round(120100 * Math.pow(Q, 180)));
    expect(a.saving[0].chargeAYear).toBe(0.005);
  });
});
