/**
 * Question D is A's "stop now" route and C's "from now", reused (research/v7/answer-D.md 1, 11.1; road-to-7.md step 7):
 *
 *  I-D1  D's band = C from now: for a household whose pensions are open today, with the same tax-free answer and the
 *        same savings choice, `monthly`, `lastedAt` and `runOutAgeAt` are equal to the bit; so are the phases (read as
 *        C's) and the guaranteed income.
 *  I-D2  D at the spend = C's take at the same figure: `lasted` and `runOutAge` equal, and verdict 'yes' exactly when
 *        C's take is covered (≤ one in ten failing).
 *  I-D3  D = A stopping now: with stop.age = you.age, verdict, lasted, run-out age and band are equal.
 *  I-D4  Work: D with N years at W = A stopping now with partTime { yearly: W, years: N } — A's shown row is D's work
 *        block; A's `without` is D's answer.
 *  I-D5  Fall: D's fall = D on the smaller pots typed in, figure for figure.
 *  I-D7  (a couple) both stopped = C from now with "they already have", to the bit.
 *
 * Every household is made up (Alex and Sam, round figures). At 40 futures and, for the worked example, 400.
 */
import { describe, it, expect } from 'vitest';
import { answerD, TEST_ENV, D1, D2, D3, D7 } from './_d.js';
import { answerC } from '../c/_c.js';
import { answerA } from '../a/_a.js';
import { fallInputs, fallFactorOf } from '../../../src/answers/d/toHousehold.js';
import { toHousehold } from '../../../src/answers/d/toHousehold.js';
import { stopsOf } from '../../../src/answers/shared/household.js';

const ENV = TEST_ENV;
const copy = (v) => JSON.parse(JSON.stringify(v));
const PERSON = ['age', 'pot', 'statePension', 'finalSalary'];
const personOf = (p) => Object.fromEntries(PERSON.filter((k) => p && p[k] !== undefined).map((k) => [k, copy(p[k])]));
const taxFree = (p) => (p && (p.taxFreeTaken === 'yes' || p.taxFreeTaken === 'some') ? { taxFreeTaken: true } : {});

/** D's household as C's inputs, from now, taking `take` a month. */
function asC(d, take = null) {
  const c = { household: d.household || 'single', you: { ...personOf(d.you), ...taxFree(d.you) }, savings: d.savings || 0, start: { kind: 'now' }, risk: d.risk || 'balanced', charge: d.charge === undefined ? 0.5 : d.charge, endAge: d.endAge || 95, take };
  if (d.isaGrowth) c.isaGrowth = d.isaGrowth;
  if (c.household === 'couple') c.partner = { ...personOf(d.partner), stop: { kind: 'already' }, ...taxFree(d.partner) };
  return c;
}
/** D's household as A's inputs, stopping today, spending `spend`, with D's work as A's part-time. */
function asA(d) {
  const a = { household: d.household || 'single', you: { ...personOf(d.you), payIn: { kind: 'total', total: 0 }, ...taxFree(d.you) }, savings: d.savings || 0, stop: { kind: 'age', age: d.you.age },
    spend: copy(d.spend), partTime: d.work && d.work.has ? { has: true, yearly: d.work.yearly, years: d.work.years } : { has: false }, savingRisk: d.risk || 'balanced', risk: d.risk || 'balanced', charge: d.charge === undefined ? 0.5 : d.charge, endAge: d.endAge || 95 };
  if (d.isaGrowth) a.isaGrowth = d.isaGrowth;
  if (a.household === 'couple') a.partner = { ...personOf(d.partner), payIn: { kind: 'total', total: 0 }, stop: { kind: 'already' }, ...taxFree(d.partner) };
  return a;
}
/** A's phase read as C's: every field C's phase has, at the same place (tests/v7/cross/questions.test.js asCPhase). */
function asCPhase(aPhase, cPhase) {
  const pick = (a, c) => {
    if (c === null || typeof c !== 'object' || a === null || typeof a !== 'object') return a;
    const out = Array.isArray(c) ? [] : {};
    for (const k of Object.keys(c)) out[k] = pick(a[k], c[k]);
    return out;
  };
  return pick(aPhase, cPhase);
}
const band = (r) => ({ monthly: r.monthly, lastedAt: r.lastedAt, runOutAgeAt: r.runOutAgeAt });

describe('I-D1, I-D2 — D is question C from now', () => {
  it.each([['D1 (the worked example)', D1], ['D2 (a couple, both stopped)', D2], ['D3 (an invested ISA larger than the pension)', D3]])('%s', (name, d) => {
    const D = answerD(d, ENV);
    const C = answerC(asC(d, d.spend.amount), ENV);
    expect(D.status).toBe('ok');
    expect(C.status).toBe('ok');
    // I-D1: the band, to the bit
    expect(band(D)).toEqual({ monthly: C.monthly, lastedAt: C.lasted, runOutAgeAt: C.runOutAge });
    expect(D.guaranteed).toEqual(C.guaranteed);
    // the phases are at the spend (C's are at its careful amount): the same shape, the same stretches of years
    expect(D.phases.map((ph) => [ph.fromAge, ph.toAge])).toEqual(C.phases.map((ph) => [ph.fromAge, ph.toAge]));
    D.phases.forEach((ph, i) => expect(Object.keys(asCPhase(ph, C.phases[i])).sort()).toEqual(Object.keys(C.phases[i]).sort()));
    // I-D2: the verdict at the spend is C's take
    expect(D.lasted).toBe(C.take.lasted);
    expect(D.runOutAge).toBe(C.take.runOutAge);
    expect(D.verdict === 'yes').toBe(C.take.covered);
  });
  it('the worked example at 400 futures: the same, and the design\'s shape of figures (careful ≈ £2,000, a bad case in the 90s)', () => {
    const env = { ...ENV, futures: 400 };
    const D = answerD(D1, env);
    const C = answerC(asC(D1, 2100), env);
    expect(band(D)).toEqual({ monthly: C.monthly, lastedAt: C.lasted, runOutAgeAt: C.runOutAge });
    expect(D.lasted).toBe(C.take.lasted);
    expect(D.monthly.careful).toBeGreaterThan(1500);
    expect(D.monthly.careful).toBeLessThan(2500);
    expect(D.runOutAge).toBeGreaterThanOrEqual(85);
    expect(D.runOutAge).toBeLessThanOrEqual(95);
  }, 60000);
});

describe('I-D3, I-D4 — D is question A stopping now', () => {
  // (A asks the tax-free part only after "I've already stopped", a couple: for one person it cannot say "had", so the
  // A rows are compared with the tax-free part not had — D7 says "some", which A has no box for)
  const D7_NO = { ...D7, you: { ...D7.you, taxFreeTaken: 'no' } };
  const D2_NO = { ...D2, you: { ...D2.you, taxFreeTaken: 'no' } };
  it.each([['D1', D1], ['D2 (a couple; the partner\'s tax-free part had, as A asks it)', D2_NO], ['D7 (with work: £15,000 a year for 3 years)', D7_NO]])('%s', (name, d) => {
    const D = answerD(d, ENV);
    const A = answerA(asA(d), { ...ENV, detail: 'chart', ages: [d.you.age] });
    expect(A.status).toBe('ok');
    const shown = A.shown;
    if (d.work && d.work.has) {
      // I-D4: A's shown row carries the work; its `without` is D's answer; D's work block is A's row
      expect(D.work).toMatchObject({ yearly: d.work.yearly, years: d.work.years, fromAge: d.you.age, toAge: d.you.age + d.work.years });
      expect([D.work.verdict, D.work.lasted, D.work.runOutAge, D.work.monthly.careful]).toEqual([shown.verdict, shown.lasted, shown.runOutAge, shown.monthly.careful]);
      expect([D.verdict, D.lasted, D.runOutAge, D.monthly.careful]).toEqual([A.partTime.without.verdict, A.partTime.without.lasted, A.partTime.without.runOutAge, A.partTime.without.monthly.careful]);
      // the row for N years in byYears is the same figure
      const row = D.work.byYears.find((r) => r.years === d.work.years);
      expect([row.verdict, row.lasted, row.runOutAge]).toEqual([shown.verdict, shown.lasted, shown.runOutAge]);
      // one more year of work: A's oneMore is D's next row
      const next = D.work.byYears.find((r) => r.years === d.work.years + 1);
      if (next) expect([next.lasted, next.runOutAge]).toEqual([A.partTime.oneMore.lasted, A.partTime.oneMore.runOutAge]);
    } else {
      // I-D3: the verdict, lasted, run-out age and band; the phases at the spend, A's own shape
      expect([D.verdict, D.lasted, D.runOutAge]).toEqual([shown.verdict, shown.lasted, shown.runOutAge]);
      expect(band(D)).toEqual({ monthly: shown.monthly, lastedAt: shown.lastedAt, runOutAgeAt: shown.runOutAgeAt });
      expect(D.phases).toEqual(shown.phases);
    }
    expect(D.guaranteed).toEqual(A.guaranteed);
  });
});

describe('I-D5 — the fall lever is D on the smaller pots typed in', () => {
  it.each([['D1 (Balanced: × 0.9)', D1, 0.9], ['D3 (an invested ISA falls too)', D3, 0.9], ['D2 (a couple)', D2, 0.9]])('%s', (name, d, factor) => {
    expect(fallFactorOf(d, ENV)).toBeCloseTo(factor, 12);
    const withFall = answerD({ ...d, fall: { has: true } }, ENV);
    const typed = answerD(fallInputs(d, ENV), ENV);
    expect(withFall.fall).toMatchObject({ share: 0.2, factor });
    expect([withFall.fall.verdict, withFall.fall.lasted, withFall.fall.runOutAge, withFall.fall.monthly.careful]).toEqual([typed.verdict, typed.lasted, typed.runOutAge, typed.monthly.careful]);
    expect(withFall.fall.drop).toBe(Math.max(0, withFall.monthly.careful - typed.monthly.careful));
    // the answer itself is untouched by the lever
    const plain = answerD(d, ENV);
    expect([withFall.verdict, withFall.lasted, withFall.runOutAge, withFall.monthly]).toEqual([plain.verdict, plain.lasted, plain.runOutAge, plain.monthly]);
    // an exact mix (tests): all shares falls by the full fifth
    expect(fallFactorOf(d, { ...ENV, mix: { equity: 1, bond: 0, cash: 0 } })).toBeCloseTo(0.8, 12);
    // cash savings do not fall; invested ones do
    expect(fallInputs({ ...D1, isaGrowth: 'cash' }, ENV).savings).toBe(D1.savings);
    expect(fallInputs(D3, ENV).savings).toBeCloseTo(D3.savings * 0.9, 6);
  });
});

describe('the household D makes', () => {
  it('everyone has stopped today, nothing goes in, the work is A\'s part-time from today', () => {
    const { household, stopAge } = toHousehold({ ...D7, endAge: 95, risk: 'balanced', charge: 0.5 }, ENV);
    expect(stopAge).toBe(66);
    expect(household.people[0].stopWork).toEqual({ kind: 'already' });
    expect(household.people[0].saving.payIn.total).toBe(0);
    expect(household.people[0].otherIncome).toEqual([{ label: 'Work', kind: 'work', amountPerYear: 15000, fromAge: 66, toAge: 69 }]);
    expect(household.people[0].pensionTaxFreeCash).toBe('alreadyTaken');
    expect(stopsOf(household, ENV.today).map((s) => s.S)).toEqual([0]);
    const couple = toHousehold({ ...D2, endAge: 95, risk: 'balanced', charge: 0.5 }, ENV).household;
    expect(couple.people.map((p) => p.stopWork)).toEqual([{ kind: 'already' }, { kind: 'already' }]);
    expect(stopsOf(couple, ENV.today).map((s) => s.S)).toEqual([0, 0]);
    expect(couple.people.map((p) => p.pots.isa)).toEqual([15000, 15000]);
  });
});
