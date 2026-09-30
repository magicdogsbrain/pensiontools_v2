/**
 * Properties between two answers (test plan 2.2: M1–M4, M8, M16; M10–M12 on `take`), each a fast-check
 * property over random valid inputs, on the same futures for both runs.
 *
 * Every push: a fixed seed and a small count, so a red run is the code's fault and can be repeated exactly.
 * Nightly: NIGHTLY=1 (a fresh seed, printed on failure) and FC_RUNS large.
 */
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { SCHEMA_C, TEST_ENV } from './_c.js';
import { answerC, checkAnswer } from './invariants.js';
import { arbitraryInputs, arbitraryTyped } from '../gen/arbitrary.mjs';
import { accessAgeOn } from '../../../src/answers/shared/rules.js';

const RUNS = Number(process.env.FC_RUNS || 12);
const SEED = process.env.NIGHTLY ? undefined : 20260930;
const ENV = { ...TEST_ENV, futures: Number(process.env.V7_PROP_FUTURES || 20) };
const LIMIT = SCHEMA_C.fields.find((f) => f.path === 'you.pot').max;
const THREE = ['careful', 'middling', 'good'];
const opts = (n = RUNS) => ({ seed: SEED, numRuns: n, verbose: 1 });

const ok = (a, inputs) => { const f = checkAnswer(a, inputs); expect(f, f.join('\n')).toEqual([]); return a; };
/**
 * Below the £100,000 point where the allowance is withdrawn. The engine keeps that point fixed in pounds of the day
 * (the tax-rules line says so): a person whose final-salary pension alone reaches it is taxed a little more each year
 * of a plan run through the engine than one counted outside it (no pot), so a first pound in the pot, or more pension
 * beside it, can read a step lower. The relations below are asserted for everyone else.
 */
const belowTaper = (i) => [i.you, i.partner].every((p) => !p || !(p.finalSalary && p.finalSalary.has && p.finalSalary.yearly >= 85000));
const noLower = (a, b) => { for (const k of THREE) expect(b.monthly[k], k).toBeGreaterThanOrEqual(a.monthly[k]); };
const noHigher = (a, b) => { for (const k of THREE) expect(b.monthly[k], k).toBeLessThanOrEqual(a.monthly[k]); };
const sameFutures = (a, b) => { expect(b.basis.seed).toBe(a.basis.seed); expect(b.basis.futures).toBe(a.basis.futures); };

describe('C — properties between two answers', () => {
  it('M1 more in the pot never gives a smaller answer; the guaranteed income is not the pot\'s business', () => {
    fc.assert(fc.property(arbitraryInputs(SCHEMA_C, ENV).filter(belowTaper), fc.integer({ min: 1, max: 500_000 }), (inputs, extra) => {
      fc.pre(inputs.you.pot + extra <= LIMIT);
      const richer = { ...inputs, you: { ...inputs.you, pot: inputs.you.pot + extra } };
      const a = ok(answerC(inputs, ENV), inputs);
      const b = answerC(richer, ENV);
      fc.pre(b.status !== 'invalid');              // a first pound in the pot brings the earliest-pension-age rule to a start that was fine without it
      ok(b, richer);
      fc.pre(b.status === a.status);               // no pot → a pot: the three amounts change meaning (the pensions' take-home → the level the pots can hold)
      sameFutures(a, b);
      fc.pre(b.basis.start === a.basis.start);     // a pot that opens the household's start (household.js startWhenPensionsOpen) is another question
      // a couple: to a £10 step — two pots drained in a fixed ratio, and a shift in the ratio can move a future's most by a step
      if (inputs.household === 'couple') { for (const k of THREE) expect(b.monthly[k], k).toBeGreaterThanOrEqual(a.monthly[k] - 10); }
      else noLower(a, b);
      if (a.take && b.take) {
        expect(b.take.runOutAge).toBeGreaterThanOrEqual(a.take.runOutAge);
        if (a.take.covered) expect(b.take.covered).toBe(true);
      }
      expect(b.guaranteed.monthlyAfterTax).toBe(a.guaranteed.monthlyAfterTax);
    }), opts());
  });

  it('M1b more in the partner\'s pot never gives a smaller answer, whether their pension is open or not', () => {
    fc.assert(fc.property(arbitraryInputs(SCHEMA_C, ENV).filter((i) => i.household === 'couple' && belowTaper(i)), fc.integer({ min: 1, max: 500_000 }), (inputs, extra) => {
      fc.pre(inputs.partner.pot + extra <= LIMIT);
      const richer = { ...inputs, partner: { ...inputs.partner, pot: inputs.partner.pot + extra } };
      const a = ok(answerC(inputs, ENV), inputs);
      const b = ok(answerC(richer, ENV), richer);
      fc.pre(b.status === a.status);
      sameFutures(a, b);
      fc.pre(b.basis.start === a.basis.start);
      // to a £10 step: the partner's pot is one of two or three pots drained in a fixed ratio, and a shift in the ratio can move a future's most by a step
      for (const k of THREE) expect(b.monthly[k], k).toBeGreaterThanOrEqual(a.monthly[k] - 10);
      expect(b.guaranteed.monthlyAfterTax).toBe(a.guaranteed.monthlyAfterTax);
    }), opts());
  });

  it('M2 more State Pension, more final-salary pension, or the same one from an earlier age: no lower', () => {
    fc.assert(fc.property(arbitraryInputs(SCHEMA_C, ENV).filter(belowTaper), fc.integer({ min: 100, max: 6000 }), fc.constantFrom('sp', 'fs', 'fsEarlier'), (inputs, extra, how) => {
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
      const more = { ...inputs, you };
      const a = ok(answerC(inputs, ENV), inputs);
      const b = ok(answerC(more, ENV), more);
      sameFutures(a, b);
      noLower(a, b);
      expect(b.guaranteed.monthlyAfterTax).toBeGreaterThanOrEqual(a.guaranteed.monthlyAfterTax - 1e-9);
    }), opts());
  });

  it('M3 a longer life to cover (endAge + 1): no higher', () => {
    fc.assert(fc.property(arbitraryInputs(SCHEMA_C, ENV), (inputs) => {
      fc.pre(inputs.endAge < 105);
      const longer = { ...inputs, endAge: inputs.endAge + 1 };
      const a = ok(answerC(inputs, ENV), inputs);
      const b = ok(answerC(longer, ENV), longer);
      sameFutures(a, b);
      noHigher(a, b);
    }), opts());
  });

  it('M4 one year older, same pot, same end age, both ages at or past the earliest pension age: no lower', () => {
    fc.assert(fc.property(arbitraryInputs(SCHEMA_C, ENV), (inputs) => {
      fc.pre(inputs.household === 'single' && inputs.start.kind === 'now' && inputs.you.age >= accessAgeOn(ENV.today) && inputs.you.age + 1 < inputs.endAge && inputs.you.age < 100);
      const older = { ...inputs, you: { ...inputs.you, age: inputs.you.age + 1 } };
      const a = ok(answerC(inputs, ENV), inputs);
      const b = ok(answerC(older, ENV), older);
      sameFutures(a, b);
      noLower(a, b);
    }), opts());
  });

  it('M8 a field that does not apply changes nothing, byte for byte', () => {
    fc.assert(fc.property(arbitraryInputs(SCHEMA_C, ENV), fc.integer({ min: 1, max: 100000 }), (inputs, noise) => {
      const messy = JSON.parse(JSON.stringify(inputs));
      if (!messy.you.finalSalary.has) { messy.you.finalSalary.yearly = noise; messy.you.finalSalary.fromAge = 61; }
      if (messy.you.statePension.kind !== 'forecast') messy.you.statePension.yearly = noise;
      if (messy.start.kind === 'now') messy.start.age = 70;
      if (messy.household === 'single') messy.partner = { age: 62, pot: noise, statePension: { kind: 'forecast', yearly: 5000 }, finalSalary: { has: true, yearly: noise, fromAge: 60 } };
      const a = answerC(inputs, ENV);
      const b = answerC(messy, ENV);
      expect(JSON.stringify(b)).toBe(JSON.stringify(a));
    }), opts());
  });

  it('M16 the same input gives the same output twice; and an answer from typed inputs equals one from checked inputs', () => {
    fc.assert(fc.property(arbitraryTyped(SCHEMA_C, ENV), ({ typed, inputs }) => {
      const a = ok(answerC(typed, ENV), typed);
      expect(JSON.stringify(answerC(typed, ENV))).toBe(JSON.stringify(a));
      expect(JSON.stringify(answerC(inputs, ENV))).toBe(JSON.stringify(a));
    }), opts());
  });

  describe('feeding the answer back through `take`', () => {
    const withPots = arbitraryInputs(SCHEMA_C, ENV).filter((i) => i.you.pot > 0 || (i.partner && i.partner.pot > 0) || i.savings > 0);

    it('M10 take = the careful amount: covered, and it lasts to the end age in a bad case', () => {
      fc.assert(fc.property(withPots, (inputs) => {
        const a = ok(answerC({ ...inputs, take: null }, ENV), inputs);
        fc.pre(a.status === 'ok' && a.monthly.careful > 0 && a.monthly.careful <= 50000);
        const b = ok(answerC({ ...inputs, take: a.monthly.careful }, ENV), inputs);
        expect(b.take.covered).toBe(true);
        expect(b.take.runOutAge).toBe(a.basis.endAge);
        expect(b.take.lasted).toBe(a.lasted.careful);
        // M9 in this brief: giving a take changes nothing else
        const { take: t1, sentences: s1, inputs: i1, ...restA } = a;
        const { take: t2, sentences: s2, inputs: i2, ...restB } = b;
        expect(JSON.stringify(restB)).toBe(JSON.stringify(restA));
        expect({ ...i2, take: null }).toEqual(i1);
        expect(s2.head).toEqual(s1.head);
        expect(s2.line).toEqual(s1.line);
      }), opts());
    });

    it('M11 take = the careful amount + £50: not covered, and a bad case runs out before the end age', () => {
      fc.assert(fc.property(withPots, (inputs) => {
        const a = answerC({ ...inputs, take: null }, ENV);
        fc.pre(a.status === 'ok' && a.monthly.careful % 10 === 0 && a.monthly.careful + 50 <= 50000);
        const b = ok(answerC({ ...inputs, take: a.monthly.careful + 50 }, ENV), inputs);
        expect(b.take.covered).toBe(false);
        expect(b.take.runOutAge).toBeLessThan(a.basis.endAge);
      }), opts());
    });

    it('M12 take = the middling amount: the same run-out age by both routes', () => {
      fc.assert(fc.property(withPots, (inputs) => {
        const a = answerC({ ...inputs, take: null }, ENV);
        fc.pre(a.status === 'ok' && a.monthly.middling <= 50000);
        const b = ok(answerC({ ...inputs, take: a.monthly.middling }, ENV), inputs);
        expect(b.take.runOutAge).toBe(a.runOutAge.middling);
        expect(b.take.lasted).toBe(a.lasted.middling);
      }), opts());
    });
  });
});
