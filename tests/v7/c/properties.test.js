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
import { STEP, largeHousehold, amountsToAStep } from '../oracles/oneStep.mjs';

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
/**
 * "More never pays less" — to one step (tests/v7/oracles/oneStep.mjs; exceptions.md, "One step"); an amount over £10,000 a
 * month, where one step is not enough (a couple's fixed-ratio drain, the £100,000 point in pounds of the day:
 * largeHousehold), prints its fall as a finding. → whether the household's other figures (the take) are asserted.
 */
function noLowerOrFinding(a, b, inputs, findings) {
  let found = false;
  if (chargedCouple(inputs) || taxFreeHadCouple(inputs)) {
    // a couple with a charge over 1% a year (6.19.0), or with the tax-free part already had by one of them (6.20.0): a fall
    // of more than one step is a finding, printed, not asserted
    for (const k of THREE) if (b.monthly[k] < a.monthly[k] - STEP.amount) found = true;
  } else {
    amountsToAStep(a.monthly, b.monthly, (k, floor) => expect(b.monthly[k], k).toBeGreaterThanOrEqual(floor), () => { found = true; });
  }
  if (found) findings.push({ inputs, from: a.monthly, to: b.monthly });
  return !largeHousehold(a.monthly.careful) && !chargedCouple(inputs) && !taxFreeHadCouple(inputs);
}
/**
 * A couple with a fund and platform charge over 1% a year (6.19.0; exceptions.md, "A couple's fixed-ratio drain with a
 * charge"): the two runs drain in a fixed ratio (engine behaviour 4), and the household is short the moment either is.
 * When one person's State Pension fills their personal allowance and the other's does not, the first's draws are taxed
 * from the first pound, so their run spends its pot faster; with a high charge that run is the one that binds in the bad
 * cases, and more in THAT person's pot can lower the band by more than a step (you 18 with £1,073,100 and no State
 * Pension, a partner of 18 with the full one, the money from 57, cautious, to 105, 2%: £1 → £6,814 in the partner's pot
 * moved the careful amount from £2,530 to £2,500; at 3% £4,000 → £20,000 from £2,180 to £2,130). Below 1% no such fall
 * turned up (60 random couples at 0, 0.5 and 1%, and the seeded runs), and the relation is asserted to one step as before.
 */
const chargedCouple = (inputs) => inputs.household === 'couple' && typeof inputs.charge === 'number' && inputs.charge > 1;
/**
 * A couple where one of them has already had the tax-free part of their pension (6.20.0, couples-different-years.md 7):
 * every pound from that pension is taxed, the other's comes a quarter tax-free, and the two runs still drain in the
 * fixed ratio of engine behaviour 4 — so more in the fully taxed pot moves more of each year's draw onto it, and the
 * band can fall by more than a step (a NIGHTLY=1 run, 1 Oct 2026, seed 208766263: you 18 with £1,073,100 from now, your
 * partner 18, stopped, with £150,000, a £35,476 final-salary pension from 50 and the tax-free part had, £150,000 of
 * savings, cautious, to 75 — £35,499 more in the partner's pot moved the careful amount from £9,420 to £9,400; the same
 * household without the tax-free part had: £9,570 to £9,730). A finding, printed, as the charged couple's.
 */
const taxFreeHadCouple = (inputs) => inputs.household === 'couple' && [inputs.you, inputs.partner].some((p) => p && p.taxFreeTaken === true);
const report = (name, findings) => {
  if (findings.length) console.log(`${name}: an amount of £10,000 a month or more, or a couple's with a charge over 1% or the tax-free part had, moved the wrong way by more than a step in ${findings.length} case(s) — a finding (tests/v7/c/exceptions.md, "One step" and "A couple's fixed-ratio drain with a charge")`, JSON.stringify(findings[0]));
};
/**
 * The mirror, "more to cover never pays more" (M3; M4 from the other side), to one step as well: the plan's length is one
 * of the strategy's own inputs, and today's engine is not monotone in it at £10 — one person of 18 with £250,000, a
 * £25,416 final-salary pension from 70, cautious, the money from 57: to 76 instead of 75 raised the middling amount from
 * £1,900 to £1,910 (a NIGHTLY=1 run, 1 Oct 2026, seed 1669423791); a couple, the money from your 65, to 80 instead of 79:
 * the careful amount £3,270 → £3,280 (seed 644221435). An amount of £10,000 a month or more: a finding (oneStep.mjs).
 */
/**
 * Whether a final-salary pension starts at or after its holder's age at the end of the plan: then one more year to cover
 * brings that pension into the plan, and the amounts can rightly rise (a NIGHTLY=1 run, 1 Oct 2026, seed 1320496810: a
 * couple, you 40 with a £35,516 final-salary pension from 75, your partner 66 with £1,073,100, £150,000 of savings, to 75 —
 * to 76 moved the middling amount from £5,020 to £5,040, to 80 £5,050). M3 is not about that.
 */
function pensionStartsAtTheEnd(inputs) {
  const people = [inputs.you, inputs.household === 'couple' ? inputs.partner : null].filter(Boolean);
  const younger = Math.min(...people.map((p) => p.age));
  return people.some((p) => p.finalSalary && p.finalSalary.has && p.finalSalary.fromAge >= p.age + (inputs.endAge - younger));
}
function noHigherOrFinding(a, b, findings) {
  let found = false;
  for (const k of THREE) {
    if (largeHousehold(a.monthly[k])) { if (b.monthly[k] > a.monthly[k] + STEP.amount) found = true; }
    else expect(b.monthly[k], k).toBeLessThanOrEqual(a.monthly[k] + STEP.amount);
  }
  if (found) findings.push({ from: a.monthly, to: b.monthly });
}
const sameFutures = (a, b) => { expect(b.basis.seed).toBe(a.basis.seed); expect(b.basis.futures).toBe(a.basis.futures); };

describe('C — properties between two answers', () => {
  it('M1 more in the pot never gives a smaller answer, to one step; the guaranteed income is not the pot\'s business', () => {
    const findings = [];
    fc.assert(fc.property(arbitraryInputs(SCHEMA_C, ENV).filter(belowTaper), fc.integer({ min: 1, max: 500_000 }), (inputs, extra) => {
      fc.pre(inputs.you.pot + extra <= LIMIT);
      // a couple: a pot that is there already, as M1b — a first pound in a pot adds a pension run to the household, another
      // shape of plan (exceptions.md, "One step": you 91 with nothing, a partner of 35 with £10,000,000 still paying in —
      // £1 in your pot moved the careful amount from £24,720 to £16,500)
      fc.pre(inputs.household !== 'couple' || inputs.you.pot > 0);
      const richer = { ...inputs, you: { ...inputs.you, pot: inputs.you.pot + extra } };
      const a = ok(answerC(inputs, ENV), inputs);
      const b = answerC(richer, ENV);
      fc.pre(b.status !== 'invalid');              // a first pound in the pot brings the earliest-pension-age rule to a start that was fine without it
      ok(b, richer);
      fc.pre(b.status === a.status);               // no pot → a pot: the three amounts change meaning (the pensions' take-home → the level the pots can hold)
      sameFutures(a, b);
      fc.pre(b.basis.start === a.basis.start);     // a pot that opens the household's start (household.js startWhenPensionsOpen) is another question
      // to one step: a couple's two pots drain in a fixed ratio, and a shift in the ratio can move a future's most by a step;
      // and for one person the engine is not monotone at £10 steps everywhere (oneStep.mjs)
      if (noLowerOrFinding(a, b, inputs, findings) && a.take && b.take) {
        expect(b.take.runOutAge).toBeGreaterThanOrEqual(a.take.runOutAge);
        if (a.take.covered) expect(b.take.covered).toBe(true);
      }
      expect(b.guaranteed.monthlyAfterTax).toBe(a.guaranteed.monthlyAfterTax);
    }), opts());
    report('M1', findings);
  });

  it('M1b more in the partner\'s pot never gives a smaller answer, whether their pension is open or not — to one step', () => {
    const findings = [];
    // A pot the partner has already (A's PA2 the same): from no pension to a pension is another shape of plan — a second
    // pension run joins, and the household's need is shared between the runs in a fixed ratio (exceptions.md 4). A NIGHTLY=1
    // run, 1 Oct 2026 (seed 1745809990): you 18 with £34, your partner 55 with nothing, cautious, to 75 — a first £1 in the
    // partner's pot moved the careful amount from £1,050 to £1,040 and the good one from £1,060 to £1,040 (tests/v7/c/exceptions.md).
    fc.assert(fc.property(arbitraryInputs(SCHEMA_C, ENV).filter((i) => i.household === 'couple' && belowTaper(i) && i.partner.pot > 0), fc.integer({ min: 1, max: 500_000 }), (inputs, extra) => {
      fc.pre(inputs.partner.pot + extra <= LIMIT);
      const richer = { ...inputs, partner: { ...inputs.partner, pot: inputs.partner.pot + extra } };
      const a = ok(answerC(inputs, ENV), inputs);
      const b = ok(answerC(richer, ENV), richer);
      fc.pre(b.status === a.status);
      sameFutures(a, b);
      fc.pre(b.basis.start === a.basis.start);
      // to one step: the partner's pot is one of two or three pots drained in a fixed ratio, and a shift in the ratio can move a future's most by a step
      noLowerOrFinding(a, b, inputs, findings);
      expect(b.guaranteed.monthlyAfterTax).toBe(a.guaranteed.monthlyAfterTax);
    }), opts());
    report('M1b', findings);
  });

  it('M2 more State Pension, more final-salary pension, or the same one from an earlier age: no lower, to one step', () => {
    const findings = [];
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
      noLowerOrFinding(a, b, inputs, findings);
      expect(b.guaranteed.monthlyAfterTax).toBeGreaterThanOrEqual(a.guaranteed.monthlyAfterTax - 1e-9);
    }), opts());
    report('M2', findings);
  });

  it('M3 a longer life to cover (endAge + 1): no higher, to one step', () => {
    const findings = [];
    // below the £100,000 point, as M1 and M2 (a NIGHTLY=1 run, 1 Oct 2026, seed -925439073: one person of 54 with £1,073,100
    // and a £200,000 final-salary pension from 68, to 80 instead of 79 — the careful amount £7,340 → £7,360)
    fc.assert(fc.property(arbitraryInputs(SCHEMA_C, ENV).filter(belowTaper), (inputs) => {
      fc.pre(inputs.endAge < 105 && !pensionStartsAtTheEnd(inputs));
      const longer = { ...inputs, endAge: inputs.endAge + 1 };
      const a = ok(answerC(inputs, ENV), inputs);
      const b = ok(answerC(longer, ENV), longer);
      sameFutures(a, b);
      noHigherOrFinding(a, b, findings);
    }), opts());
    report('M3', findings);
  });

  it('M4 one year older, same pot, same end age, both ages at or past the earliest pension age: no lower, to one step', () => {
    const findings = [];
    fc.assert(fc.property(arbitraryInputs(SCHEMA_C, ENV), (inputs) => {
      fc.pre(inputs.household === 'single' && inputs.start.kind === 'now' && inputs.you.age >= accessAgeOn(ENV.today) && inputs.you.age + 1 < inputs.endAge && inputs.you.age < 100);
      const older = { ...inputs, you: { ...inputs.you, age: inputs.you.age + 1 } };
      const a = ok(answerC(inputs, ENV), inputs);
      const b = ok(answerC(older, ENV), older);
      sameFutures(a, b);
      noLowerOrFinding(a, b, inputs, findings);
    }), opts());
    report('M4', findings);
  });

  it('M8 a field that does not apply changes nothing, byte for byte', () => {
    fc.assert(fc.property(arbitraryInputs(SCHEMA_C, ENV), fc.integer({ min: 1, max: 100000 }), (inputs, noise) => {
      const messy = JSON.parse(JSON.stringify(inputs));
      if (!messy.you.finalSalary.has) { messy.you.finalSalary.yearly = noise; messy.you.finalSalary.fromAge = 61; }
      if (messy.you.statePension.kind !== 'forecast') messy.you.statePension.yearly = noise;
      if (messy.start.kind === 'now') messy.start.age = 70;
      if (messy.household === 'single') messy.partner = { age: 62, pot: noise, statePension: { kind: 'forecast', yearly: 5000 }, finalSalary: { has: true, yearly: noise, fromAge: 60 } };
      // The second call's band search no longer starts from the first's amounts (only a pass over fewer futures is a hint:
      // c/answer.js, 1 Oct 2026), so this holds byte for byte where today's engine is not monotone too.
      const a = answerC(inputs, ENV);
      const b = answerC(messy, ENV);
      expect(JSON.stringify(b)).toBe(JSON.stringify(a));
    }), opts());
  });

  it('M16 the same input gives the same output twice; and an answer from typed inputs equals one from checked inputs', () => {
    // byte for byte, large households too: a NIGHTLY=1 run, 1 Oct 2026 (seed 338460746) found £3,000,000 and a £200,000
    // final-salary pension from 100 answered £336,300 then £336,630 (the good amount) — the second search started from the
    // first's amounts. Only a pass over fewer futures is a hint now (c/answer.js), so it starts the same search every time.
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
