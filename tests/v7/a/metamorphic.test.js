/**
 * Question A — metamorphic relations (step 4 brief 6, P2; answer-A-and-B.md 1.10, M-A2–M-A7 and M-A9; M-A1 is X1,
 * tests/v7/cross/questions.test.js and closedForm.test.js AF9). Each changes the inputs or the world in a way whose
 * effect on the answer is known, and checks exactly that.
 *
 * M-A4 (a later stop is not worse) is a finding on random cases (brief, conflict 52): printed, and recorded in
 * tests/v7/a/exceptions.md; on the four fixtures it is asserted to one step (£10 and one life).
 */
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { answerA, SCHEMA_A, TEST_ENV, checkAnswerA, ENGINE_READY, payInsFit, FIXTURE_FILES } from './invariants.js';
import { arbitraryInputs } from '../gen/arbitrary.mjs';

const RUNS = Number(process.env.FC_RUNS || 8);
const SEED = process.env.NIGHTLY ? undefined : 20261001;
const ENV = { ...TEST_ENV, futures: Number(process.env.V7_PROP_FUTURES || 20) };
const opts = (n = RUNS) => ({ seed: SEED, numRuns: n, verbose: 1 });
const THREE = ['careful', 'middling', 'good'];
const RANK = { no: 0, close: 1, yes: 2 };
const envFor = (inputs) => ({ ...ENV, ages: [inputs.stop.age] });
const run = (inputs, env = envFor(inputs)) => {
  const a = answerA(inputs, env);
  expect(a.status, JSON.stringify(a.problems)).not.toBe('invalid');
  const f = checkAnswerA(a, inputs, env);
  expect(f, f.join('\n')).toEqual([]);
  return a;
};
const named = arbitraryInputs(SCHEMA_A, ENV).filter((i) => i.stop.kind === 'age' && payInsFit(i)
  && [i.you, i.partner].every((p) => !p || !(p.finalSalary && p.finalSalary.has && p.finalSalary.yearly >= 85000)));
/** The household's figures of the shown row: what a swap or an empty partner must not move. */
const household = (a) => {
  const s = a.shown;
  return { verdict: s.verdict, lasted: s.lasted, runOutAge: s.runOutAge, monthly: s.monthly, yearly: s.yearly, lastedAt: s.lastedAt, runOutAgeAt: s.runOutAgeAt,
    pots: { careful: s.potAtStop.careful, middling: s.potAtStop.middling, good: s.potAtStop.good }, paidIn: s.paidIn.total, yearsSaving: s.yearsSaving,
    guaranteed: a.guaranteed, endAge: a.basis.endAge, takeHome: s.phases.map((p) => p.takeHome) };
};
const fixtures = FIXTURE_FILES.map((f) => JSON.parse(readFileSync(resolve(process.cwd(), 'tests/v7/fixtures/a', f), 'utf8')));

describe.skipIf(!ENGINE_READY)('A — metamorphic relations', () => {
  it('M-A2 more State Pension, more final-salary pension, or the same one from an earlier age: no lower, in any row', () => {
    fc.assert(fc.property(named.filter((i) => i.household === 'single'), fc.integer({ min: 100, max: 6000 }), fc.constantFrom('sp', 'fs', 'fsEarlier'), (inputs, extra, how) => {
      const you = JSON.parse(JSON.stringify(inputs.you));
      if (how === 'sp') {
        const current = you.statePension.kind === 'forecast' ? you.statePension.yearly : you.statePension.kind === 'none' ? 0 : 12547.6;
        fc.pre(current + extra <= 20000);
        you.statePension = { kind: 'forecast', yearly: current + extra };
      } else if (how === 'fs') {
        if (you.finalSalary.has) { fc.pre(you.finalSalary.yearly + extra <= 200000); you.finalSalary = { ...you.finalSalary, yearly: you.finalSalary.yearly + extra }; }
        else you.finalSalary = { has: true, yearly: extra, fromAge: 60 };
      } else {
        fc.pre(you.finalSalary.has && you.finalSalary.fromAge > 50);
        you.finalSalary = { ...you.finalSalary, fromAge: you.finalSalary.fromAge - 1 };
      }
      const a = run(inputs);
      const b = run({ ...inputs, you });
      for (const k of THREE) expect(b.shown.monthly[k], k).toBeGreaterThanOrEqual(a.shown.monthly[k]);
      expect(b.shown.lasted).toBeGreaterThanOrEqual(a.shown.lasted);
      expect(RANK[b.shown.verdict]).toBeGreaterThanOrEqual(RANK[a.shown.verdict]);
      expect(b.guaranteed.monthlyAfterTax).toBeGreaterThanOrEqual(a.guaranteed.monthlyAfterTax - 1e-9);
      expect(b.shown.potAtStop).toEqual(a.shown.potAtStop);
    }), opts());
  });

  it('M-A3 a higher spend never lasts more, and the band does not move at all', () => {
    fc.assert(fc.property(named.filter((i) => i.spend.kind === 'amount'), fc.integer({ min: 1, max: 3000 }), (inputs, more) => {
      fc.pre(inputs.spend.amount + more <= 50000);
      const a = run(inputs);
      const b = run({ ...inputs, spend: { kind: 'amount', amount: inputs.spend.amount + more } });
      expect(b.shown.lasted).toBeLessThanOrEqual(a.shown.lasted);
      expect(RANK[b.shown.verdict]).toBeLessThanOrEqual(RANK[a.shown.verdict]);
      expect(b.shown.runOutAge).toBeLessThanOrEqual(a.shown.runOutAge);
      for (const k of ['monthly', 'yearly', 'lastedAt', 'runOutAgeAt', 'potAtStop']) expect(b.shown[k], k).toEqual(a.shown[k]);
    }), opts());
  });

  it('M-A4 later is not worse — a finding on random cases (printed), asserted to one step on the fixtures', () => {
    const findings = [];
    fc.assert(fc.property(named, (inputs) => {
      const a = run(inputs, { ...ENV });
      const n = a.basis.futures;
      a.ages.forEach((r, i) => {
        const next = a.ages[i + 1];
        if (!next) return;
        if (next.monthly.careful < r.monthly.careful - 10 || next.lasted < r.lasted - 1 / n - 1e-12) findings.push({ inputs, from: r.age, to: next.age, careful: [r.monthly.careful, next.monthly.careful], lasted: [r.lasted, next.lasted] });
      });
    }), opts(4));
    if (findings.length) console.log(`M-A4: a later row worse by more than one step in ${findings.length} place(s); record them in tests/v7/a/exceptions.md`, JSON.stringify(findings.slice(0, 3)));
    const N = Number(process.env.V7_MA4_FUTURES || 100);
    for (const fx of fixtures) {
      const env = { ...TEST_ENV, ...fx.env, futures: N };
      const a = answerA(fx.inputs, env);
      a.ages.forEach((r, i) => {
        const next = a.ages[i + 1];
        if (!next) return;
        expect(next.monthly.careful, `${fx.id} ${r.age}→${next.age} careful`).toBeGreaterThanOrEqual(r.monthly.careful - 10);
        expect(next.lasted, `${fx.id} ${r.age}→${next.age} lasted`).toBeGreaterThanOrEqual(r.lasted - 1 / N - 1e-12);
      });
    }
  }, 120000);

  it('M-A5 a partner with nothing — no pot, nothing going in, no State Pension, no final-salary pension, the same age — is the single answer (an amount: a level is a couple\'s figure)', () => {
    fc.assert(fc.property(named.filter((i) => i.household === 'single' && i.spend.kind === 'amount' && !(i.savings > 0) && !(i.savingsIn > 0)), (single) => {
      const couple = { ...single, household: 'couple', partner: { age: single.you.age, pot: 0, payIn: { kind: 'total', total: 0 }, statePension: { kind: 'none' }, finalSalary: { has: false } } };
      const a = run(single);
      const b = run(couple);
      expect(household(b)).toEqual(household(a));
    }), opts());
  });

  it('M-A6 swapping "you" and "partner" leaves every household figure the same; only the labels move', () => {
    fc.assert(fc.property(named.filter((i) => i.household === 'couple' && !i.partTime.has), (inputs) => {
      const other = JSON.parse(JSON.stringify(inputs));
      [other.you, other.partner] = [other.partner, other.you];
      other.stop.age = inputs.stop.age - inputs.you.age + inputs.partner.age;
      fc.pre(other.stop.age >= other.you.age && other.stop.age <= 75);
      const a = run(inputs);
      const b = run(other);
      expect(household(b)).toEqual(household(a));
      expect(b.pensionOpens.you).toBe(a.pensionOpens.partner);
      expect(b.pensionOpens.partner).toBe(a.pensionOpens.you);
      expect(b.shown.gapYears).toBe(a.shown.gapYears);
    }), opts());
  });

  it('M-A7 the risk while saving only matters while saving: stopping today, changing it changes no figure', () => {
    fc.assert(fc.property(named, fc.constantFrom('cautious', 'balanced', 'adventurous'), (inputs, level) => {
      const now = { ...inputs, stop: { kind: 'age', age: inputs.you.age } };
      const a = run(now);
      const b = run({ ...now, savingRisk: level });
      expect(household(b)).toEqual(household(a));
      expect(b.shown).toEqual(a.shown);
    }), opts());
  });

  it('M-A9 the final pass never contradicts the first by more than one grade at any age (A1 at 100 and 1,000 lives)', () => {
    const fx = fixtures[0];
    const first = answerA(fx.inputs, { ...TEST_ENV, ...fx.env, futures: 100 });
    const final = answerA(fx.inputs, { ...TEST_ENV, ...fx.env, futures: Number(process.env.V7_FINAL_FUTURES || 1000) });
    expect(final.ages.map((r) => r.age)).toEqual(first.ages.map((r) => r.age));
    final.ages.forEach((r, i) => expect(Math.abs(RANK[r.verdict] - RANK[first.ages[i].verdict]), `${r.age}`).toBeLessThanOrEqual(1));
  }, 120000);
});
