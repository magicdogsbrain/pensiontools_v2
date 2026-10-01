/**
 * Properties between two B answers (step 4 brief 6, P3: the test plan's PB1–PB8), each a fast-check property over
 * random valid inputs of SCHEMA_B, on the same lives for both runs.
 *
 * Every push: a fixed seed and a small count, so a red run is the code's fault and can be repeated exactly.
 * Nightly: NIGHTLY=1 (a fresh seed, printed on failure) and FC_RUNS large.
 *
 * A couple's number is split between the two by their middling pots at the stop (brief conflict 18); anything that
 * moves those pots (the pay-in, the pot today) can move a couple's number by a step, so the relations that hold the
 * number fixed are asserted for one person and to a step for two.
 */
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { SCHEMA_B, TEST_ENV, answerB, checkAnswerB, withinCeiling } from './invariants.js';
import { arbitraryInputs } from '../gen/arbitrary.mjs';
import { frozen, at, diffPaths, plain } from '../../helpers/clock.js';

const RUNS = Number(process.env.FC_RUNS || 8);
const SEED = process.env.NIGHTLY ? undefined : 20261001;
const ENV = { ...TEST_ENV, futures: Number(process.env.V7_PROP_FUTURES || 20) };
const opts = (n = RUNS) => ({ seed: SEED, numRuns: n, verbose: 1 });
const ok = (a, inputs) => { const f = checkAnswerB(a, inputs); expect(f, f.join('\n')).toEqual([]); return a; };
const inputsB = arbitraryInputs(SCHEMA_B, ENV).filter(withinCeiling);
const singles = inputsB.filter((i) => i.household === 'single');
/** Below the £100,000 point where the allowance is withdrawn (C's belowTaper): a large final-salary pension is taxed a step differently inside a run. */
const belowTaper = (i) => [i.you, i.partner].every((p) => !p || !(p.finalSalary && p.finalSalary.has && p.finalSalary.yearly >= 85000));
const totalOf = (p) => (p.payIn.kind === 'split' ? p.payIn.own + p.payIn.employer : p.payIn.total);
const withPayIn = (inputs, total) => ({ ...inputs, you: { ...inputs.you, payIn: { kind: 'total', total } } });
const THREE = ['careful', 'middling', 'good'];

describe('B — properties between two answers', () => {
  it('PB1 more pay-in: the same number and the same pay-ins needed; reached in no fewer lives; the pots at the stop no lower', () => {
    fc.assert(fc.property(singles, fc.integer({ min: 10, max: 2000 }), (inputs, extra) => {
      const now = totalOf(inputs.you);
      fc.pre(now + extra <= 10000);
      const a = ok(answerB(inputs, ENV), inputs);
      const more = withPayIn(inputs, now + extra);
      const b = ok(answerB(more, ENV), more);
      expect(b.number).toEqual(a.number);
      expect(b.payIn.at).toEqual(a.payIn.at);
      expect(b.chance.lasted).toBeGreaterThanOrEqual(a.chance.lasted);
      for (const k of THREE) expect(b.potAtStop.now[k]).toBeGreaterThanOrEqual(a.potAtStop.now[k]);
      expect(b.wholeLife.lasted).toBeGreaterThanOrEqual(a.wholeLife.lasted);
    }), opts());
  });

  it('PB2 more in the pot today: the same number; reached in no fewer lives; no more to pay in', () => {
    fc.assert(fc.property(singles, fc.integer({ min: 1, max: 500_000 }), (inputs, extra) => {
      fc.pre(inputs.you.pot + extra <= 10_000_000);
      const a = ok(answerB(inputs, ENV), inputs);
      const richer = { ...inputs, you: { ...inputs.you, pot: inputs.you.pot + extra } };
      const b = ok(answerB(richer, ENV), richer);
      expect(b.number).toEqual(a.number);
      expect(b.chance.lasted).toBeGreaterThanOrEqual(a.chance.lasted);
      for (const k of ['nineInTen', 'threeInFour']) if (a.payIn.at[k] !== null) expect(b.payIn.at[k]).toBeLessThanOrEqual(a.payIn.at[k]);
    }), opts());
  });

  it('PB4 a higher spend: a number no lower, pay-ins no lower, reached in no more lives (for a couple too)', () => {
    fc.assert(fc.property(inputsB.filter(belowTaper), fc.integer({ min: 10, max: 1500 }), (inputs, extra) => {
      // spends that keep the household under the point where the allowance is withdrawn (belowTaper's reason: the £100,000
      // point is fixed in pounds of the day, tests/v7/c/exceptions.md 1; the nightly run's £10,000 a month moved the guide
      // number down £3,000 for £10 more)
      fc.pre(inputs.spend.kind === 'amount' && inputs.spend.amount + extra <= 5000);
      const a = ok(answerB(inputs, ENV), inputs);
      const more = { ...inputs, spend: { kind: 'amount', amount: inputs.spend.amount + extra } };
      const b = ok(answerB(more, ENV), more);
      if (a.number === null) { expect(b.number).toBeNull(); return; }
      if (b.number === null) return;                                  // out of reach: the most there is
      for (const k of THREE) expect(b.number[k], k).toBeGreaterThanOrEqual(a.number[k]);
      for (const k of ['nineInTen', 'threeInFour']) if (a.payIn.at[k] !== null && b.payIn.at[k] !== null) expect(b.payIn.at[k]).toBeGreaterThanOrEqual(a.payIn.at[k]);
      expect(b.chance.lasted).toBeLessThanOrEqual(a.chance.lasted);
      expect(b.wholeLife.lasted).toBeLessThanOrEqual(a.wholeLife.lasted);
    }), opts());
  });

  it('PB5 3 in 4 instead of 9 in 10: the same number and chance; the pay-in needed no higher', () => {
    fc.assert(fc.property(inputsB, (inputs) => {
      const nine = ok(answerB({ ...inputs, confidence: 'nineInTen' }, ENV));
      const four = ok(answerB({ ...inputs, confidence: 'threeInFour' }, ENV));
      expect(four.number).toEqual(nine.number);
      expect(four.chance).toEqual(nine.chance);
      expect(four.payIn.at).toEqual(nine.payIn.at);
      if (nine.payIn.needed !== null) expect(four.payIn.needed).toBeLessThanOrEqual(nine.payIn.needed);
    }), opts());
  });

  it('PB6 paying in what is needed (9 in 10) is on course, exactly the count', () => {
    fc.assert(fc.property(singles, (inputs) => {
      const a = ok(answerB({ ...inputs, confidence: 'nineInTen' }, ENV));
      fc.pre(a.status === 'ok' && a.payIn.needed !== null);
      const savingsShort = a.payIn.outside !== null && a.payIn.outside > a.payIn.savingsNow;
      const fed = { ...withPayIn(inputs, a.payIn.needed), confidence: 'nineInTen', ...(savingsShort ? { savingsIn: a.payIn.outside } : {}) };
      const b = ok(answerB(fed, ENV), fed);
      if (!a.outside) expect(b.number).toEqual(a.number);       // the guide number does not move with the pay-in (before 57 the savings floor can)
      expect(b.onCourse).toBe(true);
      expect(b.chance.fails).toBeLessThanOrEqual(b.basis.failuresAllowed);
      expect(b.levers.payMore).toBeNull();
    }), opts());
  });

  it('PB8 a level against the same amount typed: the same answer but for the spend\'s kind and its assumed line', () => {
    fc.assert(fc.property(inputsB, fc.constantFrom('minimum', 'moderate', 'comfortable'), (inputs, level) => {
      const byLevel = { ...inputs, spend: { kind: 'level', level } };
      const a = ok(answerB(byLevel, ENV), byLevel);
      const byAmount = { ...inputs, spend: { kind: 'amount', amount: a.spend.perMonth } };
      const b = ok(answerB(byAmount, ENV), byAmount);
      const strip = (x) => ({ ...x, inputs: null, spend: { ...x.spend, kind: null, level: null }, assumed: x.assumed.filter((l) => l.id !== 'spend-level') });
      expect(plain(strip(b))).toEqual(plain(strip(a)));
    }), opts());
  });

  it('PB8 a field that does not apply changes nothing: a partner\'s figures for one person, the split parts when the total is given', () => {
    fc.assert(fc.property(singles, (inputs) => {
      const a = answerB(inputs, ENV);
      const noisy = { ...inputs, partner: { age: 40, pot: 99999, payIn: { kind: 'total', total: 333 } }, you: { ...inputs.you, payIn: { ...inputs.you.payIn, ...(inputs.you.payIn.kind === 'total' ? { own: 1, employer: 2 } : { total: 5 }) } } };
      expect(answerB(noisy, ENV)).toEqual(a);
    }), opts());
  });

  it('PB8 the same answer twice, with the wall clock in 2031 and env.today unchanged', () => {
    fc.assert(fc.property(inputsB, (inputs) => {
      const a = answerB(inputs, ENV);
      const b = frozen(at(2031, 7, 1), () => answerB(inputs, ENV));
      expect(b).toEqual(a);
      expect(answerB(inputs, ENV)).toEqual(a);
    }), opts(4));
  });

  // 50 in 2027: born either side of 6 April 1977, where the State Pension age steps from 67 to 67 and a month (68 in
  // whole years); 53 to 56: the stop crosses 6 April 2028, where the earliest pension age rises — both are real moves
  it('PB8 the day moves from 4 to 8 April 2027 with the ages as typed: only the date moves', () => {
    fc.assert(fc.property(singles.filter((i) => ![50, 53, 54, 55, 56].includes(i.you.age)), (inputs) => {
      const a = plain(answerB(inputs, { ...ENV, today: '2027-04-04' }));
      const b = plain(answerB(inputs, { ...ENV, today: '2027-04-08' }));
      const moved = diffPaths(a, b).filter((p) => !/^basis\.today$|^assumed\.\d+\.(text|parts|value)|^warnings\.\d+\.(text|parts)/.test(p) && !/\.parts\.\d+\.fixed$/.test(p));
      expect(moved).toEqual([]);
    }), opts(4));
  });
});
