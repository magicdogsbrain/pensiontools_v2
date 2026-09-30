/**
 * Metamorphic relations (test plan 2.2: M5–M7, M13, M15; M14 as "swapping the gilt file changes nothing").
 * Each changes the inputs or the world in a way whose effect on the answer is known, and checks exactly that.
 */
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { SCHEMA_C, TEST_ENV } from './_c.js';
import { answerC, checkAnswer } from './invariants.js';
import { arbitraryInputs } from '../gen/arbitrary.mjs';
import { frozen, at, diffPaths, plain } from '../../helpers/clock.js';
import gilts from '../../../src/data/giltsSnapshot.js';

const RUNS = Number(process.env.FC_RUNS || 12);
const SEED = process.env.NIGHTLY ? undefined : 20260930;
const ENV = { ...TEST_ENV, futures: Number(process.env.V7_PROP_FUTURES || 20) };
const opts = (n = RUNS) => ({ seed: SEED, numRuns: n, verbose: 1 });
const ok = (a, inputs) => { const f = checkAnswer(a, inputs); expect(f, f.join('\n')).toEqual([]); return a; };
const household = (a) => ({ monthly: a.monthly, yearly: a.yearly, lasted: a.lasted, runOutAge: a.runOutAge, guaranteed: a.guaranteed, take: a.take, status: a.status,
  phases: a.phases.map((p) => ({ takeHome: p.takeHome, fromPots: p.fromPots, statePension: p.statePension, finalSalary: p.finalSalary, tax: p.tax, shown: p.shown, beforeStatePension: p.beforeStatePension })),
  years: a.basis.years, endAge: a.basis.endAge, failuresAllowed: a.basis.failuresAllowed });

/** The two people swapped, with the start kept on the same date. */
function swapped(inputs) {
  const out = JSON.parse(JSON.stringify(inputs));
  [out.you, out.partner] = [out.partner, out.you];
  if (out.start.kind === 'age') out.start.age = out.start.age - inputs.you.age + inputs.partner.age;
  return out;
}

describe('C — metamorphic relations', () => {
  const couples = arbitraryInputs(SCHEMA_C, ENV).filter((i) => i.household === 'couple');

  it('M5 swapping "you" and "partner" leaves every household figure the same; only the labels move', () => {
    fc.assert(fc.property(couples, (inputs) => {
      const other = swapped(inputs);
      fc.pre(other.start.kind !== 'age' || other.start.age >= other.you.age);
      const a = ok(answerC(inputs, ENV), inputs);
      const b = answerC(other, ENV);
      fc.pre(b.status !== 'invalid');
      ok(b, other);
      expect(household(b)).toEqual(household(a));
      a.phases.forEach((p, i) => {
        expect(b.phases[i].ages.you).toEqual(p.ages.partner);
        expect(b.phases[i].ages.partner).toEqual(p.ages.you);
        const by = (ph, who) => ph.byPerson.find((x) => x.who === who);
        expect({ ...by(b.phases[i], 'you'), who: null }).toEqual({ ...by(p, 'partner'), who: null });
      });
    }), opts());
  });

  it('M6 a partner with nothing — no pot, no State Pension, no final-salary pension, the same age — is the single answer, to the penny', () => {
    // no savings: a couple's savings are split between them, so a partner would then have something
    fc.assert(fc.property(arbitraryInputs(SCHEMA_C, ENV).filter((i) => i.household === 'single' && !(i.savings > 0)), (single) => {
      const couple = { ...single, household: 'couple', partner: { age: single.you.age, pot: 0, statePension: { kind: 'none' }, finalSalary: { has: false } } };
      const a = ok(answerC(single, ENV), single);
      const b = ok(answerC(couple, ENV), couple);
      const strip = (h) => ({ ...h, phases: h.phases.map(({ shown, ...p }) => p) });
      expect(strip(household(b))).toEqual(strip(household(a)));
      expect(b.phases.map((p) => p.takeHome)).toEqual(a.phases.map((p) => p.takeHome));
    }), opts());
  });

  it('M7 the same pension in two names against one name, same ages: the even split is no lower', () => {
    // pensions only: it is the second tax allowance that makes the difference. With savings on top, the pots drain in a
    // fixed ratio and the two shapes can differ by a £10 step either way. Below the £100,000 point: above it the
    // allowance is withdrawn from each of two incomes where one income lost it once, and two names can be worse.
    fc.assert(fc.property(arbitraryInputs(SCHEMA_C, ENV).filter((i) => i.household === 'single' && i.you.pot >= 20 && i.you.pot % 2 === 0 && !(i.savings > 0)
      && !(i.you.finalSalary.has && i.you.finalSalary.yearly > 60000)), (single) => {
      const P = single.you.pot;
      const twin = (pot) => ({ age: single.you.age, pot, statePension: single.you.statePension, finalSalary: single.you.finalSalary });
      const oneName = { ...single, household: 'couple', you: twin(P), partner: twin(0) };
      const evenSplit = { ...single, household: 'couple', you: twin(P / 2), partner: twin(P / 2) };
      const a = ok(answerC(oneName, ENV), oneName);
      const b = ok(answerC(evenSplit, ENV), evenSplit);
      // to a £10 step: two pots searched separately can land a step apart from one pot (a large final-salary pension beside them makes the pots' part small)
      for (const k of ['careful', 'middling', 'good']) expect(b.monthly[k], k).toBeGreaterThanOrEqual(a.monthly[k] - 10);
    }), opts());
  });

  it('M13 the day moves from 4 to 8 April 2027, the age typed stays the same: only the date in the basis moves', () => {
    fc.assert(fc.property(arbitraryInputs(SCHEMA_C, { ...ENV, today: '2027-04-04' }), (inputs) => {
      // Ages whose birthday, moved four days, crosses a rule's date: 54 turns 55 either side of 6 April 2028, when the
      // earliest pension age becomes 57; 49, 50, 66 and 67 are born either side of 6 April 1978, 6 April 1977, 6 March
      // 1961 and 6 April 1960, where the State Pension age steps. Another answer, by the rule.
      const onARule = (age) => [49, 50, 54, 66, 67].includes(age);
      fc.pre(!onARule(inputs.you.age) && !(inputs.partner && onARule(inputs.partner.age)));
      const a = answerC(inputs, { ...ENV, today: '2027-04-04' });
      const b = answerC(inputs, { ...ENV, today: '2027-04-08' });
      fc.pre(a.status !== 'invalid' && b.status !== 'invalid');
      const changed = diffPaths(plain(a), plain(b));
      // basis.accessAge is the earliest pension age ON THE START DATE: a start a year on crosses 6 April 2028 between the two days
      expect(changed.filter((p) => !['basis.today', 'basis.accessAge'].includes(p))).toEqual([]);
    }), opts());
  });

  it('M14 the gilt file is not read: changing every figure in it changes nothing', () => {
    const inputs = { household: 'couple', you: { pot: 400000, age: 62, finalSalary: { has: true, yearly: 9000, fromAge: 65 } }, partner: { age: 60, pot: 150000 }, savings: 20000 };
    const before = answerC(inputs, ENV);
    const saved = JSON.stringify(gilts);
    try {
      gilts.reference_rpi = 9999;
      gilts.as_of = '1999-01-01';
      for (const k of Object.keys(gilts)) if (Array.isArray(gilts[k])) gilts[k].length = 0;
      expect(answerC(inputs, ENV)).toEqual(before);
    } finally {
      Object.assign(gilts, JSON.parse(saved));
    }
  });

  it('M15 the wall clock moved to 2031 with env.today unchanged: identical', () => {
    const inputs = { you: { pot: 250000, age: 58 }, take: 1200 };
    const first = plain(answerC(inputs, ENV));
    expect(plain(frozen(at(2031, 1, 15), () => answerC(inputs, ENV)))).toEqual(first);
    expect(plain(frozen(at(2019, 6, 1), () => answerC(inputs, ENV)))).toEqual(first);
  });

  it('the same futures for every input: the market of future i depends on the seed and the years, never on an amount', () => {
    const a = answerC({ you: { pot: 100000, age: 60 } }, { ...ENV, trace: true });
    const b = answerC({ you: { pot: 900000, age: 60 }, savings: 50000, risk: 'adventurous' }, { ...ENV, trace: true });
    expect(a.trace.atCareful.rows.map((r) => r.priceIndex).slice(0, 12)).toEqual(b.trace.atCareful.rows.filter((r) => r.m < 12 && r.who === 'you').map((r) => r.priceIndex));
    expect(a.basis.seed).toBe(b.basis.seed);
    expect(a.basis.futures).toBe(b.basis.futures);
    // a different seed is a different market
    const c = answerC({ you: { pot: 100000, age: 60 } }, { ...ENV, seed: 1 });
    expect(c.basis.seed).toBe(1);
    expect(c.monthly).not.toEqual(a.monthly);
  });
});
