/**
 * Metamorphic relations (test plan 2.2: M5–M7, M13, M15; M14 as "swapping the gilt file changes nothing").
 * Each changes the inputs or the world in a way whose effect on the answer is known, and checks exactly that.
 */
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { fcOptions } from '../oracles/fcOptions.mjs';
import { SCHEMA_C, TEST_ENV } from './_c.js';
import { answerC, checkAnswer } from './invariants.js';
import { arbitraryInputs } from '../gen/arbitrary.mjs';
import { frozen, at, diffPaths, plain } from '../../helpers/clock.js';
import gilts from '../../../src/data/giltsSnapshot.js';

const RUNS = Number(process.env.FC_RUNS || 12);
const SEED = process.env.NIGHTLY ? undefined : 20260930;
const ENV = { ...TEST_ENV, futures: Number(process.env.V7_PROP_FUTURES || 20) };
const opts = (n = RUNS) => fcOptions({ seed: SEED, runs: n });
const ok = (a, inputs) => { const f = checkAnswer(a, inputs); expect(f, f.join('\n')).toEqual([]); return a; };
const household = (a) => ({ monthly: a.monthly, yearly: a.yearly, lasted: a.lasted, runOutAge: a.runOutAge, guaranteed: a.guaranteed, take: a.take, status: a.status,
  phases: a.phases.map((p) => ({ takeHome: p.takeHome, fromPots: p.fromPots, statePension: p.statePension, finalSalary: p.finalSalary, tax: p.tax, shown: p.shown, beforeStatePension: p.beforeStatePension })),
  years: a.basis.years, endAge: a.basis.endAge, failuresAllowed: a.basis.failuresAllowed });

/**
 * The two people swapped, with the start kept on the same date. Couples who stop in different years (couples-different-
 * years.md 5.1, 9.3 P2): each keeps their own stop — your start becomes the partner's stop, and their stop your start
 * ("you from now, your partner at 56" is "you at 56, your partner already stopped").
 */
function swapped(inputs) {
  const out = JSON.parse(JSON.stringify(inputs));
  [out.you, out.partner] = [out.partner, out.you];
  const theirs = inputs.partner && inputs.partner.stop;
  delete out.you.stop;
  if (out.partner) delete out.partner.stop;
  if (theirs && (theirs.kind === 'already' || theirs.kind === 'age')) {
    // ("now" while still paying in, with no pension open, is moved to the day one opens: not a stop a partner can be given)
    if (inputs.start.kind === 'now' && inputs.you.payIn && inputs.you.payIn.has === 'yes') return null;
    // The start's KIND is kept across the swap, so the household stays on one of C's two paths: a start typed as the age
    // you are now is answered on the lives (A's model, where a pension closed at the start is held locked inside its
    // holder's one run while their savings pay — step4-build-brief.md section 2, conflict 1; c/onLives.js usesLives), and
    // "now" by C's own rule (the closed pension's holder's savings a run of their own for the whole plan — exceptions.md,
    // engine behaviour 5). The two agree to the pound without a closed pension beside savings and differ with one (a
    // NIGHTLY=1 run, 27 Oct 2026, seed -1023306806: you 57 with £3,000,000 from 57, your partner 18 with £1,073,100 already
    // stopped, £10,000,000 of savings — careful £29,240 on the lives, £26,710 from now). So "from the age you are now" with
    // a partner already stopped swaps to "from the age THEY are now" with you stopping at your age now (both on the
    // lives), and "now" with a partner stopping at the age they are now swaps to "now" with the partner already stopped
    // (both from now). The household is the same either way; only the path would have moved (exceptions.md, "Narrowed").
    const atAgeNow = inputs.start.kind === 'age' && inputs.start.age === inputs.you.age;
    const theirsNow = theirs.kind === 'age' && theirs.age === inputs.partner.age;
    if (atAgeNow && theirs.kind === 'already') {
      // the tax-free part is asked of you from "now" only (schemaParts.js taxFreeFields) and of a partner with "already":
      // a partner who has had theirs can move to "you" only as "now", which is the other path — no swap keeps both, so
      // there is none to test (a NIGHTLY=1 run at 300, 27 Oct 2026: you 54 with nothing from 54, your partner 45 with
      // £150,000 closed until 57 and the tax-free part had, £150,000 of savings — swapped to an age the flag is dropped and
      // the phases' tax moves £31 a month with the band unchanged; swapped to "now" the start moves twelve years)
      if (inputs.partner.taxFreeTaken === true) return null;
      out.start = { kind: 'age', age: inputs.partner.age }; out.partner.stop = { kind: 'age', age: inputs.start.age }; return out;
    }
    if (inputs.start.kind === 'now' && theirsNow) { out.start = { kind: 'now' }; out.partner.stop = { kind: 'already' }; return out; }
    out.start = theirs.kind === 'already' ? { kind: 'now' } : { kind: 'age', age: theirs.age };
    out.partner.stop = inputs.start.kind === 'now' ? { kind: 'already' } : { kind: 'age', age: inputs.start.age };
    return out;
  }
  if (theirs) out.partner.stop = { ...theirs };
  // you from now with the tax-free part already had: the partner it moves to has stopped too — "they already have", the
  // same household as when you both start now (couples-different-years.md 9.1 I3), and the one way C asks it of a partner
  // — unless someone still pays in: "now" then moves to the day a pension opens, a stop the partner cannot be given with
  // the tax-free part had (a NIGHTLY=1 run, 1 Oct 2026, seed 906230088: you 18 from now, your partner paying in £500)
  if (inputs.start.kind === 'now' && inputs.you.taxFreeTaken === true) {
    if ([inputs.you, inputs.partner].some((p) => p.payIn && p.payIn.has === 'yes')) return null;
    out.partner.stop = { kind: 'already' };
  }
  if (out.start.kind === 'age') out.start.age = out.start.age - inputs.you.age + inputs.partner.age;
  return out;
}

describe('C — metamorphic relations', () => {
  const couples = arbitraryInputs(SCHEMA_C, ENV).filter((i) => i.household === 'couple');

  it('M5 swapping "you" and "partner" leaves every household figure the same; only the labels move', () => {
    fc.assert(fc.property(couples, (inputs) => {
      const other = swapped(inputs);
      fc.pre(other !== null && (other.start.kind !== 'age' || other.start.age >= other.you.age));
      const a = ok(answerC(inputs, ENV), inputs);
      const b = answerC(other, ENV);
      fc.pre(b.status !== 'invalid');
      ok(b, other);
      // "now" is moved to the day a pension opens where an age is not (household.js startWhenPensionsOpen): a start at
      // your age today, swapped to "now" for the other, can be moved — another question (a NIGHTLY=1 run, 1 Oct 2026:
      // you 24 from 24 with nothing, your partner 18, stopped, with £1)
      fc.pre(b.basis.start === a.basis.start);
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
      // Below the £100,000 point in fact, not only in the final-salary pension: what the pot pays on top counts too. A
      // household taking home no more than £60,000 a year (£5,000 a month) keeps each of the two well under it for the
      // whole plan, even with prices rising against the point's fixed pounds (tests/v7/c/exceptions.md 1). Above it the
      // relation is false, and the answer right: two NIGHTLY=1 runs, 1 Oct 2026 — one person of 74 with £250,000, a
      // £50,270 final-salary pension, cautious, to 75 (seed 1588601866): one year drawing £250,000 in one name loses one
      // personal allowance, in two names two, so the even split takes home £160 a month less (£21,440 against £21,600);
      // and 58 with a £20,000 State Pension forecast beside the same, £110,000 a year in all (seed -2110052139): the
      // middling £60 a month less.
      fc.pre(a.yearly.good <= 60_000);
      const b = ok(answerC(evenSplit, ENV), evenSplit);
      // to a £10 step: two pots searched separately can land a step apart from one pot (a large final-salary pension beside them makes the pots' part small)
      for (const k of ['careful', 'middling', 'good']) expect(b.monthly[k], k).toBeGreaterThanOrEqual(a.monthly[k] - 10);
    }), opts());
  });

  it('M13 the day moves from 4 to 8 April 2027, the age typed stays the same: only the date in the basis moves', () => {
    fc.assert(fc.property(arbitraryInputs(SCHEMA_C, { ...ENV, today: '2027-04-04' }), (inputs) => {
      // Ages whose birthday, moved four days, crosses a rule's date: 54 turns 55 either side of 6 April 2028, when the
      // earliest pension age becomes 57; 49, 50, 66 and 67 are born either side of 6 April 1978, 6 April 1977, 6 March
      // 1961 and 6 April 1960, where the State Pension age steps. Another answer, by the rule. And 56 turns 57 either side
      // of 6 April 2028: born 4 April 1971 is 57 on the day, born 8 April 1971 is 56, so the 2028 note (apart.js before2028,
      // for everyone since 2 Oct 2026: nothing new from a pension until 57 after 5 April 2028) is right on one side only —
      // the one thing that moved between the two days (a NIGHTLY=1 run, 27 Oct 2026, seed -993484821: 56 with £1 from now).
      const onARule = (age) => [49, 50, 54, 56, 66, 67].includes(age);
      fc.pre(!onARule(inputs.you.age) && !(inputs.partner && onARule(inputs.partner.age)));
      const a = answerC(inputs, { ...ENV, today: '2027-04-04' });
      const b = answerC(inputs, { ...ENV, today: '2027-04-08' });
      fc.pre(a.status !== 'invalid' && b.status !== 'invalid');
      const changed = diffPaths(plain(a), plain(b));
      // basis.accessAge is the earliest pension age ON THE START DATE: a start a year on crosses 6 April 2028 between the two days.
      // (The second call's band search does not start from the first's amounts — only a pass over fewer futures is a hint,
      // c/answer.js — so the band is the same to the pound where today's engine is not monotone too.)
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
