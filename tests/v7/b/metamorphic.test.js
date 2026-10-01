/**
 * Metamorphic relations of question B (step 4 brief 6, P3: answer-A-and-B.md 2.10, M-B1–M-B6 and M-B9–M-B11 with the
 * brief's fields). Each changes the inputs in a way whose effect on the answer is known, and checks exactly that.
 * M-B10 (stop paying in from an age) has no field in this slice (brief 8) and is not here; M-B7 promises no sign
 * and is a rule of checkAnswerB (moreRisk.helps says the truth); M-B8 is X3 (roundTrip.test.js).
 */
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { SCHEMA_B, TEST_ENV, answerB, checkAnswerB, withinCeiling } from './invariants.js';
import { arbitraryInputs } from '../gen/arbitrary.mjs';
import { fullStatePensionYearly } from '../../../src/answers/shared/rules.js';

const RUNS = Number(process.env.FC_RUNS || 8);
const SEED = process.env.NIGHTLY ? undefined : 20261001;
const ENV = { ...TEST_ENV, futures: Number(process.env.V7_PROP_FUTURES || 20) };
const opts = (n = RUNS) => ({ seed: SEED, numRuns: n, verbose: 1 });
const ok = (a, inputs) => { const f = checkAnswerB(a, inputs); expect(f, f.join('\n')).toEqual([]); return a; };
const THREE = ['careful', 'middling', 'good'];
const belowTaper = (i) => [i.you, i.partner].every((p) => !p || !(p.finalSalary && p.finalSalary.has && p.finalSalary.yearly >= 85000));
const singles = arbitraryInputs(SCHEMA_B, ENV).filter(withinCeiling).filter((i) => i.household === 'single' && belowTaper(i));
/** The household figures: what does not depend on whose name a thing is in. */
const household = (a) => ({ status: a.status, number: a.number && { careful: a.number.careful, middling: a.number.middling, good: a.number.good },
  chance: a.chance, onCourse: a.onCourse, payIn: { now: a.payIn.now, at: a.payIn.at, needed: a.payIn.needed, outside: a.payIn.outside },
  potAtStop: a.potAtStop, short: a.short, monthlyIfShort: a.monthlyIfShort, wholeLife: a.wholeLife, outside: a.outside, years: a.years,
  guaranteed: a.guaranteed, endAge: a.basis.endAge, levers: a.levers });

describe('B — metamorphic relations', () => {
  it('M-B1 more never needs more: more State Pension, a final-salary pension, or more from the employer never raises the number or the pay-ins', () => {
    fc.assert(fc.property(singles, fc.integer({ min: 100, max: 6000 }), fc.constantFrom('sp', 'fs', 'employer'), (inputs, extra, how) => {
      const you = JSON.parse(JSON.stringify(inputs.you));
      if (how === 'sp') {
        const current = you.statePension.kind === 'forecast' ? you.statePension.yearly : you.statePension.kind === 'none' ? 0 : fullStatePensionYearly();
        fc.pre(current + extra <= 20000);
        you.statePension = { kind: 'forecast', yearly: Math.round(current + extra) };
      } else if (how === 'fs') {
        if (you.finalSalary.has) { fc.pre(you.finalSalary.yearly + extra <= 60000); you.finalSalary = { ...you.finalSalary, yearly: you.finalSalary.yearly + extra }; }
        else you.finalSalary = { has: true, yearly: extra, fromAge: Math.min(75, Math.max(50, inputs.stop.age)) };
      } else {
        const add = Math.round(extra / 10);
        const own = you.payIn.kind === 'split' ? you.payIn.own : you.payIn.total;
        const employer = (you.payIn.kind === 'split' ? you.payIn.employer : 0) + add;
        fc.pre(own + employer <= 10000);
        you.payIn = { kind: 'split', own, employer };
      }
      const a = ok(answerB(inputs, ENV), inputs);
      const more = { ...inputs, you };
      const b = ok(answerB(more, ENV), more);
      if (a.number === null) return;
      expect(b.number).not.toBeNull();
      for (const k of THREE) expect(b.number[k], k).toBeLessThanOrEqual(a.number[k]);
      for (const k of ['nineInTen', 'threeInFour']) if (a.payIn.at[k] !== null) expect(b.payIn.at[k], k).toBeLessThanOrEqual(a.payIn.at[k]);
      if (how === 'employer') expect(b.chance.lasted).toBeGreaterThanOrEqual(a.chance.lasted);
    }), opts());
  });

  it('M-B2 / M-B5 a lower spend never needs more: the number and the pay-ins no higher', () => {
    fc.assert(fc.property(arbitraryInputs(SCHEMA_B, ENV).filter(withinCeiling).filter(belowTaper), fc.integer({ min: 10, max: 1000 }), (inputs, less) => {
      fc.pre(inputs.spend.kind === 'amount' && inputs.spend.amount - less >= 1);
      const a = ok(answerB(inputs, ENV), inputs);
      const lower = { ...inputs, spend: { kind: 'amount', amount: inputs.spend.amount - less } };
      const b = ok(answerB(lower, ENV), lower);
      if (a.number === null) return;
      for (const k of THREE) expect(b.number[k], k).toBeLessThanOrEqual(a.number[k]);
      for (const k of ['nineInTen', 'threeInFour']) if (a.payIn.at[k] !== null) expect(b.payIn.at[k]).toBeLessThanOrEqual(a.payIn.at[k]);
    }), opts());
  });

  it('M-B4 and M-B6: 3 in 4 never needs more than 9 in 10; more pay-in never reaches the number in fewer lives (the grid, row by row)', () => {
    fc.assert(fc.property(arbitraryInputs(SCHEMA_B, ENV).filter(withinCeiling), (inputs) => {
      const a = ok(answerB(inputs, { ...ENV, detail: 'grid' }), inputs);
      if (a.payIn.at.nineInTen !== null) expect(a.payIn.at.threeInFour).toBeLessThanOrEqual(a.payIn.at.nineInTen);
      for (const row of a.grid.ages) row.cells.forEach((c, j) => { if (j) expect(c.lasted).toBeGreaterThanOrEqual(row.cells[j - 1].lasted); });
    }), opts(4));
  });

  it('M-B9 fed back: paying in the pay-in that gets there (and the savings the closed years need) is on course — the whole life lasts in 9 lives out of 10; £10 less does not', () => {
    fc.assert(fc.property(singles, (inputs) => {
      const a = ok(answerB({ ...inputs, confidence: 'nineInTen' }, ENV));
      fc.pre(a.status === 'ok' && a.payIn.needed !== null && a.payIn.needed > 0);
      const savingsIn = a.payIn.outside !== null && a.payIn.outside > a.payIn.savingsNow ? a.payIn.outside : inputs.savingsIn;
      const at = (total) => answerB({ ...inputs, savingsIn, confidence: 'nineInTen', you: { ...inputs.you, payIn: { kind: 'total', total } } }, ENV);
      expect(at(a.payIn.needed).onCourse).toBe(true);
      expect(at(a.payIn.needed - 10).onCourse).toBe(false);
    }), opts());
  });

  it('M-B11 swapping "you" and "partner" (the stop in the same year) leaves every household figure the same', () => {
    const couples = arbitraryInputs(SCHEMA_B, ENV).filter(withinCeiling).filter((i) => i.household === 'couple' && belowTaper(i));
    fc.assert(fc.property(couples, (inputs) => {
      const other = JSON.parse(JSON.stringify(inputs));
      [other.you, other.partner] = [other.partner, other.you];
      other.stop.age = inputs.stop.age - inputs.you.age + inputs.partner.age;
      fc.pre(other.stop.age > other.you.age && other.stop.age <= 75);
      const a = ok(answerB(inputs, ENV), inputs);
      const b = answerB(other, ENV);
      fc.pre(b.status !== 'invalid');
      ok(b, other);
      // stop later is searched to 75 by the first person's age, so it is the one figure the order of the two can move
      const strip = (h) => ({ ...h, levers: { ...h.levers, stopLater: null } });
      expect(strip(household(b))).toEqual(strip(household(a)));
      expect(b.number && b.number.byPerson.map((x) => x.pot).reverse()).toEqual(a.number && a.number.byPerson.map((x) => x.pot));
    }), opts());
  });

  // The nightly run, 1 Oct 2026 (seed of run 3): a number of £55,000 split 6.25% / 93.75% is £3,437.50 / £51,562.50; rounding
  // the first person's part and giving the other the rest put the half pound with whoever was "you" — £3,438 one way round,
  // £3,437 the other. The larger part is rounded now, the smaller is the rest, whichever of the two is "you".
  it('M-B11 a number that splits on a half pound: each person\'s part is the same whichever of the two is "you"', () => {
    const inputs = { household: 'couple', you: { pot: 10000, age: 55, statePension: { kind: 'full' }, finalSalary: { has: false }, payIn: { kind: 'total', total: 100 }, alreadyDrawing: false },
      stop: { age: 58 }, spend: { kind: 'amount', amount: 1867 }, partner: { age: 62, pot: 150000, statePension: { kind: 'full' }, finalSalary: { has: false }, payIn: { kind: 'total', total: 1500 }, alreadyDrawing: false },
      savings: 0, savingsIn: 1667, savingRisk: 'cautious', risk: 'adventurous', charge: 1, endAge: 75, confidence: 'nineInTen' };
    const other = JSON.parse(JSON.stringify(inputs));
    [other.you, other.partner] = [other.partner, other.you];
    other.stop.age = inputs.stop.age - inputs.you.age + inputs.partner.age;
    const a = ok(answerB(inputs, ENV), inputs);
    const b = ok(answerB(other, ENV), other);
    expect(a.number.careful).toBe(b.number.careful);
    expect(b.number.byPerson.map((x) => x.pot).reverse()).toEqual(a.number.byPerson.map((x) => x.pot));
    expect(a.number.byPerson.reduce((t, x) => t + x.pot, 0)).toBe(a.number.careful);
  });

  // ONE TEST (step 4 brief J9): the whole life is taxed person by person, so a pay-in the couple would split between them
  // (when nothing goes in now it is split evenly) is not the single's. With something going in now it is all the first
  // person's, as the single's is: then the partner with nothing changes nothing.
  it('M-B11 a partner with nothing — no pot, nothing paid in, no State Pension or final-salary pension, the same age — is the single answer, while all that goes in is the first person\'s', () => {
    fc.assert(fc.property(singles.filter((i) => !(i.savings > 0) && !(i.savingsIn > 0) && i.spend.kind === 'amount' && (i.you.payIn.kind === 'split' ? i.you.payIn.own + i.you.payIn.employer : i.you.payIn.total) > 0), (single) => {   // a level is a couple's figure for a couple
      const couple = { ...single, household: 'couple', partner: { age: single.you.age, pot: 0, payIn: { kind: 'total', total: 0 }, statePension: { kind: 'none' }, finalSalary: { has: false } } };
      const a = ok(answerB(single, ENV), single);
      // before a pension opens the savings a month are split between the two of you (two ISAs): not the single's question
      fc.pre(a.outside === null);
      const b = ok(answerB(couple, ENV), couple);
      const h = (x) => { const y = household(x); return { ...y, levers: null }; };
      expect(h(b)).toEqual(h(a));
    }), opts());
  });
});

describe('M-B3 stopping later needs no more — on the fixtures (a finding on random cases: exceptions.md)', () => {
  const FIX = ['B1-my-number', 'B3-late-start'].map((f) => JSON.parse(readFileSync(resolve(process.cwd(), `tests/v7/fixtures/b/${f}.json`), 'utf8')));
  it.each(FIX.map((f) => [f.id, f]))('%s: the number and the pay-in at 9 in 10, one to three years later, to one step', (_id, fx) => {
    const env = { ...TEST_ENV, futures: 200 };
    const base = answerB(fx.inputs, env);
    let prev = base;
    for (let later = 1; later <= 3; later++) {
      const inputs = { ...fx.inputs, stop: { age: fx.inputs.stop.age + later } };
      const a = ok(answerB(inputs, env), inputs);
      expect(a.number.careful, `number at +${later}`).toBeLessThanOrEqual(prev.number.careful + 1000);
      if (prev.payIn.at.nineInTen !== null) expect(a.payIn.at.nineInTen, `pay-in at +${later}`).toBeLessThanOrEqual(prev.payIn.at.nineInTen + 10);
      prev = a;
    }
  }, 120000);
});
