/**
 * Question A — properties between two answers (step 4 brief 6, P2; test-plan-A-B.md 6.1, PA1–PA13 with the brief's
 * fields). Each is a fast-check property over random valid inputs of SCHEMA_A, on the same lives for both runs.
 * PA8 (swap the people) and PA9 (a partner with nothing) are M-A6 and M-A5 in metamorphic.test.js.
 *
 * "No worse" means ≥ on the shown row's monthly.*, lasted, runOutAge and potAtStop.* together, and a verdict no lower
 * (no → close → yes); a couple to one £10 step and one life (two pots drained in a fixed ratio, as C's M1).
 *
 * Every push: a fixed seed and a small count. Nightly: NIGHTLY=1 (a fresh seed, printed on failure) and FC_RUNS large.
 */
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { answerA, SCHEMA_A, TEST_ENV, checkAnswerA, ENGINE_READY, payInsFit } from './invariants.js';
import { arbitraryInputs, arbitraryTyped } from '../gen/arbitrary.mjs';
import { frozen, at, diffPaths, plain } from '../../helpers/clock.js';
import { RULES } from '../../../src/answers/shared/rules.js';

const RUNS = Number(process.env.FC_RUNS || 8);
const SEED = process.env.NIGHTLY ? undefined : 20261001;
const ENV = { ...TEST_ENV, futures: Number(process.env.V7_PROP_FUTURES || 20) };
const opts = (n = RUNS) => ({ seed: SEED, numRuns: n, verbose: 1 });
const THREE = ['careful', 'middling', 'good'];
const RANK = { no: 0, close: 1, yes: 2 };

/** One stop age (the row the inputs name) keeps each run to one row. */
const envFor = (inputs) => ({ ...ENV, ages: [inputs.stop.age] });
const run = (inputs, env = envFor(inputs)) => {
  const a = answerA(inputs, env);
  expect(a.status, JSON.stringify(a.problems)).not.toBe('invalid');
  const f = checkAnswerA(a, inputs, env);
  expect(f, f.join('\n')).toEqual([]);
  return a;
};
/** Named stop ages only, below the point where the allowance is withdrawn (C's belowTaper, for the same reason). */
const named = arbitraryInputs(SCHEMA_A, ENV).filter((i) => i.stop.kind === 'age' && payInsFit(i)
  && [i.you, i.partner].every((p) => !p || !(p.finalSalary && p.finalSalary.has && p.finalSalary.yearly >= 85000))
  && !(i.partTime.has && i.partTime.yearly >= 85000));

function noWorse(a, b, couple) {
  const n = a.basis.futures;
  const x = a.shown;
  const y = b.shown;
  const step = couple ? 10 : 0;
  for (const k of THREE) expect(y.monthly[k], `monthly.${k}`).toBeGreaterThanOrEqual(x.monthly[k] - step);
  expect(y.lasted, 'lasted').toBeGreaterThanOrEqual(x.lasted - (couple ? 1 / n : 0) - 1e-12);
  if (!couple) {
    expect(y.runOutAge, 'runOutAge').toBeGreaterThanOrEqual(x.runOutAge);
    expect(RANK[y.verdict], 'verdict').toBeGreaterThanOrEqual(RANK[x.verdict]);
  }
}
const potsNoLower = (a, b) => { for (const k of THREE) expect(b.shown.potAtStop[k], `potAtStop.${k}`).toBeGreaterThanOrEqual(a.shown.potAtStop[k]); };
const sameFutures = (a, b) => { expect(b.basis.seed).toBe(a.basis.seed); expect(b.basis.futures).toBe(a.basis.futures); };

describe.skipIf(!ENGINE_READY)('A — properties between two answers', () => {
  it('PA1 more going in (under the ceiling) is no worse; the pots at the stop are no lower; the pensions\' take-home is not its business', () => {
    fc.assert(fc.property(named, fc.integer({ min: 1, max: 2000 }), (inputs, extra) => {
      const more = JSON.parse(JSON.stringify(inputs));
      const p = more.you.payIn;
      // the limit is on the person's two parts together (pay-in-over-limit, J14), not on one box
      if (p.kind === 'split') { fc.pre(p.own + p.employer + extra <= 10000); p.own += extra; } else { fc.pre(p.total + extra <= 10000); p.total += extra; }
      const a = run(inputs);
      const b = run(more);
      sameFutures(a, b);
      potsNoLower(a, b);
      noWorse(a, b, inputs.household === 'couple');
      expect(b.guaranteed).toEqual(a.guaranteed);
      if (a.shown.yearsSaving > 0) expect(b.shown.paidIn.total).toBeGreaterThan(a.shown.paidIn.total);
      else expect(b.shown.paidIn.total).toBe(0);
    }), opts());
  });

  it('PA2 more in the pot today is no worse', () => {
    fc.assert(fc.property(named, fc.integer({ min: 1, max: 500_000 }), (inputs, extra) => {
      // a pot that is there already: from no pension to a pension is another shape of plan (a pension run joins the
      // savings; with part-time pay or a partner the split and the tax move) — a finding, tests/v7/a/exceptions.md
      fc.pre(inputs.you.pot > 0 && inputs.you.pot + extra <= 10_000_000);
      const more = { ...inputs, you: { ...inputs.you, pot: inputs.you.pot + extra } };
      const a = run(inputs);
      const b = run(more);
      fc.pre(b.status === a.status);                  // no pot → a pot: the amounts change meaning (C's M1)
      sameFutures(a, b);
      potsNoLower(a, b);
      noWorse(a, b, inputs.household === 'couple');
    }), opts());
  });

  it('PA3 a later stop is one row of the same answer: the new shown row is the old answer\'s row for that age, byte for byte', () => {
    fc.assert(fc.property(named, (inputs) => {
      const later = inputs.stop.age + 1;
      const younger = inputs.household === 'couple' ? Math.min(inputs.you.age, inputs.partner.age) : inputs.you.age;
      fc.pre(later <= RULES.stopAgeMax && inputs.endAge > younger + (later - inputs.you.age));
      const b = run({ ...inputs, stop: { kind: 'age', age: later } }, { ...ENV, ages: [inputs.stop.age, later] });
      const a = run(inputs, { ...ENV, ages: [inputs.stop.age, later] });
      const strip = ({ phases, oneMoreYear, ...row }) => row;
      expect(strip(b.shown)).toEqual(strip(a.ages.find((r) => r.age === later)));
      expect(b.ages).toEqual(a.ages.map((r) => ({ ...r, phases: r.age === later ? b.shown.phases : null })));
    }), opts());
  });

  it('PA4 a lower spend: the verdict and the count no lower, the band and the pots identical (they do not depend on the spend)', () => {
    fc.assert(fc.property(named.filter((i) => i.spend.kind === 'amount'), fc.integer({ min: 1, max: 2000 }), (inputs, less) => {
      fc.pre(inputs.spend.amount - less >= 1);
      const a = run(inputs);
      const b = run({ ...inputs, spend: { kind: 'amount', amount: inputs.spend.amount - less } });
      expect(RANK[b.shown.verdict]).toBeGreaterThanOrEqual(RANK[a.shown.verdict]);
      expect(b.shown.lasted).toBeGreaterThanOrEqual(a.shown.lasted);
      expect(b.shown.runOutAge).toBeGreaterThanOrEqual(a.shown.runOutAge);
      for (const k of ['monthly', 'yearly', 'lastedAt', 'runOutAgeAt', 'potAtStop', 'paidIn']) expect(b.shown[k], k).toEqual(a.shown[k]);
    }), opts());
  });

  it('PA5 part-time work: the answer without it is the "without" of the answer with it, and with it is no worse', () => {
    fc.assert(fc.property(named.filter((i) => !i.partTime.has), fc.constantFrom(6000, 12570, 30000), fc.integer({ min: 1, max: 10 }), (inputs, yearly, years) => {
      const a = run(inputs);
      const b = run({ ...inputs, partTime: { has: true, yearly, years } });
      expect(b.partTime.without).toEqual({ verdict: a.shown.verdict, lasted: a.shown.lasted, runOutAge: a.shown.runOutAge, monthly: { careful: a.shown.monthly.careful } });
      noWorse(a, b, inputs.household === 'couple');
      for (const k of ['potAtStop', 'paidIn']) expect(b.shown[k], k).toEqual(a.shown[k]);
    }), opts());
  });

  it('PA6 a level against the same amount typed: the same answer but for the spending\'s kind and its line under what was assumed', () => {
    fc.assert(fc.property(named, fc.constantFrom('minimum', 'moderate', 'comfortable'), (inputs, level) => {
      const byLevel = { ...inputs, spend: { kind: 'level', level } };
      const a = run(byLevel);
      const byAmount = { ...inputs, spend: { kind: 'amount', amount: a.spend.perMonth } };
      const b = run(byAmount);
      const strip = ({ inputs: _i, spend, assumed, ...rest }) => ({ ...rest, spend: { perMonth: spend.perMonth, perYear: spend.perYear } });
      expect(strip(b)).toEqual(strip(a));
      expect(a.assumed.map((x) => x.id)).toContain('spend-level');
      expect(b.assumed.map((x) => x.id)).not.toContain('spend-level');
    }), opts());
  });

  it('PA7 a field that does not apply changes nothing, byte for byte', () => {
    fc.assert(fc.property(named, fc.integer({ min: 1, max: 9000 }), (inputs, noise) => {
      const messy = JSON.parse(JSON.stringify(inputs));
      if (!messy.you.finalSalary.has) { messy.you.finalSalary.yearly = noise; messy.you.finalSalary.fromAge = 61; }
      if (messy.you.statePension.kind !== 'forecast') messy.you.statePension.yearly = noise;
      if (messy.you.payIn.kind === 'total') { messy.you.payIn.own = noise; messy.you.payIn.employer = noise; } else messy.you.payIn.total = noise;
      if (!messy.partTime.has) { messy.partTime.yearly = noise; messy.partTime.years = 3; }
      if (messy.spend.kind === 'amount') messy.spend.level = 'comfortable'; else messy.spend.amount = noise;
      if (messy.household === 'single') messy.partner = { age: 62, pot: noise, payIn: { kind: 'total', total: noise }, statePension: { kind: 'forecast', yearly: 5000 }, finalSalary: { has: true, yearly: noise, fromAge: 60 } };
      const env = envFor(inputs);
      // Where the answer depends on where the search starts (today's engine not monotone at £10 steps for this household:
      // tests/v7/c/exceptions.md, engine behaviour 6 — the nightly run's £10,000,000 household), two calls of the same
      // inputs differ, so there is nothing to compare; everywhere else the messy inputs give the same answer, byte for byte.
      const first = JSON.stringify(answerA(inputs, env));
      const again = JSON.stringify(answerA(inputs, env));
      fc.pre(first === again);
      expect(JSON.stringify(answerA(messy, env))).toBe(again);
    }), opts());
  });

  it('PA10 a longer life to cover (endAge + 1): the band and the count no higher', () => {
    fc.assert(fc.property(named, (inputs) => {
      fc.pre(inputs.endAge < 105);
      const a = run(inputs);
      const b = run({ ...inputs, endAge: inputs.endAge + 1 });
      sameFutures(a, b);
      for (const k of THREE) expect(b.shown.monthly[k], k).toBeLessThanOrEqual(a.shown.monthly[k]);
      expect(b.shown.lasted).toBeLessThanOrEqual(a.shown.lasted);
    }), opts());
  });

  it('PA11 the same input gives the same output twice, from typed or checked inputs, and with the wall clock moved', () => {
    fc.assert(fc.property(arbitraryTyped(SCHEMA_A, ENV).filter(({ inputs }) => inputs.stop.kind === 'age'), ({ typed, inputs }) => {
      const env = envFor(inputs);
      const a = answerA(typed, env);
      expect(JSON.stringify(answerA(typed, env))).toBe(JSON.stringify(a));
      expect(JSON.stringify(answerA(inputs, env))).toBe(JSON.stringify(a));
    }), opts(4));
    const inputs = { you: { age: 50, pot: 250000, payIn: { total: 600 } }, savings: 40000, stop: { age: 60 }, spend: { amount: 2000 } };
    const first = plain(answerA(inputs, ENV));
    expect(plain(frozen(at(2031, 1, 15), () => answerA(inputs, ENV)))).toEqual(first);
    expect(plain(frozen(at(2019, 6, 1), () => answerA(inputs, ENV)))).toEqual(first);
  });

  it('PA12 the day moves from 4 to 8 April 2027, the ages typed stay the same: only the date in the basis moves', () => {
    fc.assert(fc.property(arbitraryInputs(SCHEMA_A, { ...ENV, today: '2027-04-04' }).filter((i) => i.stop.kind === 'age'), (inputs) => {
      // Ages whose birthday, moved four days, crosses a rule's date (C's M13), and a stop a year on, which lands either
      // side of 6 April 2028 when the earliest pension age becomes 57: another answer, by the rule.
      const onARule = (age) => [49, 50, 53, 54, 55, 56, 66, 67].includes(age);
      fc.pre(!onARule(inputs.you.age) && !(inputs.partner && onARule(inputs.partner.age)) && inputs.stop.age - inputs.you.age !== 1);
      const a = answerA(inputs, { ...envFor(inputs), today: '2027-04-04' });
      const b = answerA(inputs, { ...envFor(inputs), today: '2027-04-08' });
      fc.pre(a.status !== 'invalid' && b.status !== 'invalid');
      expect(diffPaths(plain(a), plain(b)).filter((p) => p !== 'basis.today')).toEqual([]);
    }), opts());
  });

  it('PA13 more risk while saving: nothing asserted about direction; the pensions\' take-home and the years covered do not move', () => {
    const findings = [];
    fc.assert(fc.property(named.filter((i) => i.savingRisk !== 'adventurous'), (inputs) => {
      const up = inputs.savingRisk === 'cautious' ? 'balanced' : 'adventurous';
      const a = run(inputs);
      const b = run({ ...inputs, savingRisk: up });
      expect(b.guaranteed).toEqual(a.guaranteed);
      expect(b.basis.endAge).toBe(a.basis.endAge);
      if (a.shown.yearsSaving > 0 && b.shown.potAtStop.good < a.shown.potAtStop.good) findings.push({ inputs, from: a.shown.potAtStop, to: b.shown.potAtStop });
      if (a.shown.yearsSaving === 0) expect(b.shown.potAtStop).toEqual(a.shown.potAtStop);
    }), opts());
    if (findings.length) console.log(`PA13: more shares while saving lowered the good-case pot in ${findings.length} case(s) — reported, not asserted`, JSON.stringify(findings[0]));
  });
});
