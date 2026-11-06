/**
 * Cases with an exact answer (test plan 3.3, CF1–CF7): one made-up future, prices flat, every investment
 * returning exactly 0%, the pots held as cash (env.mix), so the sums can be done by hand. "0% on everything" includes the
 * fund and platform charge (`charge: 0`, 6.19.0); CF8 puts one back and does the sum with it.
 */
import { describe, it, expect } from 'vitest';
import { TEST_ENV } from './_c.js';
import { answerC, checkAnswer } from './invariants.js';
import { RULES } from '../../../src/answers/shared/rules.js';

const FLAT = { ...TEST_ENV, futures: 1, trace: true, futureReturns: () => ({ equity: {}, inflation: {} }), mix: { equity: 0, bond: 0, cash: 1 } };
const NO_SP = { kind: 'none' };
const rows = (a, who = 'you') => a.trace.atCareful.rows.filter((r) => r.who === who);

describe('closed forms: a flat future, 0% on everything, all in cash', () => {
  it('CF1 pot ÷ years: 65, £300,000, no State Pension, to 95 → £10,000 a year, no tax, £830 a month', () => {
    const a = answerC({ charge: 0, you: { pot: 300000, age: 65, statePension: NO_SP } }, FLAT);
    expect(a.status).toBe('ok');
    expect(checkAnswer(a)).toEqual([]);
    expect(a.basis.years).toBe(30);
    expect(a.monthly).toEqual({ careful: 830, middling: 830, good: 830 });        // 833.33 rounded down to £10
    expect(a.lasted).toEqual({ careful: 1, middling: 1, good: 1 });
    expect(a.phases).toHaveLength(1);
    expect(a.phases[0].tax).toBe(0);
    expect(a.phases[0].takeHome).toBe(830);
    expect(a.phases[0].shown).toEqual({ takeHome: 830, fromPots: 830, statePension: 0, finalSalary: 0 });
    const r = rows(a);
    expect(r).toHaveLength(360);
    expect(r.every((x) => x.tax === 0 && x.statePension === 0 && x.finalSalary === 0)).toBe(true);
    expect(r.every((x) => Math.abs(x.afterTax - 830) < 0.005)).toBe(true);
    expect(r.every((x) => Math.abs(x.growth) < 1e-6)).toBe(true);
    expect(r[0].potStart).toBeCloseTo(300000, 6);
    const last = r[r.length - 1].potEnd;
    expect(last).toBeGreaterThanOrEqual(0);
    expect(last).toBeLessThan(3.34 * 360 + 1);                                     // what £10-a-month rounding leaves
    expect(a.trace.futures[0].most).toBe(830);
    expect(a.sentences.head.text).toBe('About £830 a month');
  });

  it('CF2 the same with tax: £603,360 → £20,112 a year, tax £502.80, £1,634.10 in the pocket → £1,630', () => {
    const a = answerC({ charge: 0, you: { pot: 603360, age: 65, statePension: NO_SP } }, FLAT);
    expect(checkAnswer(a)).toEqual([]);
    expect(a.monthly.careful).toBe(1630);
    expect(a.monthly.good).toBe(1630);
    // At the exact figure the search stops at: gross G with 0.85G + 2,514 = 19,560 → G = 20,054.12, tax £494.12
    const ph = a.phases[0];
    expect(ph.takeHome).toBe(1630);
    expect(ph.fromPension * 12).toBeCloseTo((1630 * 12 - 0.2 * RULES.personalAllowance) / 0.85, 0);
    expect(ph.tax * 12).toBeCloseTo(0.2 * (0.75 * ph.fromPension * 12 - RULES.personalAllowance), 0);
    const r = rows(a);
    expect(r.every((x) => Math.abs(x.afterTax - 1630) < 0.005)).toBe(true);
    expect(r.every((x) => Math.abs(x.taxFree - 0.25 * x.fromPension) < 1e-6)).toBe(true);
    // The hand sum at £20,112 a year: £1,634.10 a month lasts, £1,640 does not
    expect(a.trace.futures[0].most).toBe(1630);
  });

  it('CF3 run-out age: 57, £600,000, taking £28,000 a year (£29,984 from the pot less £1,984 tax: 240 months) → runs out at 77', () => {
    // The plan's £28,014 (exactly £30,000 a year) sits on the knife-edge of month 240; a pound less a month keeps the sum honest.
    const a = answerC({ charge: 0, you: { pot: 600000, age: 57, statePension: NO_SP }, take: 28000 / 12 }, FLAT);
    expect(checkAnswer(a)).toEqual([]);
    expect(a.take.perMonth).toBeCloseTo(2333.33, 2);
    expect(a.take.runOutAge).toBe(77);
    expect(a.take.covered).toBe(false);
    expect(a.take.lasted).toBe(0);
    expect(a.sentences.take.text).toContain('run out at age 77');
  });

  it('CF4 no pot: 67, full State Pension → the State Pension ÷ 12, no tax, one phase, nothing drawn', () => {
    const a = answerC({ charge: 0, you: { pot: 0, age: 67 } }, FLAT);
    expect(a.status).toBe('guaranteed-only');
    expect(checkAnswer(a)).toEqual([]);
    const sp = Math.round((RULES.fullStatePensionWeekly * 52) / 12 * 100) / 100;
    expect(a.monthly).toEqual({ careful: sp, middling: sp, good: sp });
    expect(a.phases).toHaveLength(1);
    expect(a.phases[0].tax).toBe(0);
    expect(a.phases[0].fromPots).toBe(0);
    expect(a.sentences.nothing.id).toBe('c.nothing.pensions');
    expect(a.sentences.nothing.text).toContain('£1,046 a month after tax');
    expect(a.trace).toBeUndefined();
  });

  it('CF5 the tax-free limit: 65, £1,073,100 then £1,073,101 → tax-free cash reaches, and never passes, £268,275', () => {
    const at = answerC({ charge: 0, you: { pot: 1073100, age: 65, statePension: NO_SP } }, FLAT);
    expect(checkAnswer(at)).toEqual([]);
    const sumAt = rows(at).reduce((s, r) => s + r.taxFree, 0);
    expect(sumAt).toBeLessThanOrEqual(RULES.taxFreeLimit + 1e-6);
    expect(sumAt).toBeGreaterThan(RULES.taxFreeLimit - 0.25 * 12 * 360 - 1);       // a quarter of what £10-a-month (about £12 before tax) rounding leaves
    const over = answerC({ charge: 0, you: { pot: 1073101, age: 65, statePension: NO_SP } }, FLAT);
    expect(checkAnswer(over)).toEqual([]);
    expect(rows(over).reduce((s, r) => s + r.taxFree, 0)).toBeLessThanOrEqual(RULES.taxFreeLimit + 1e-6);
    expect(over.warnings.some((w) => w.id === 'tax-free-limit')).toBe(true);
    expect(at.warnings.some((w) => w.id === 'tax-free-limit')).toBe(false);
  });

  it('CF6 nothing at all: 60, no pot, no State Pension → every figure 0 and the "nothing to work out" sentence', () => {
    const a = answerC({ charge: 0, you: { pot: 0, age: 60, statePension: NO_SP } }, FLAT);
    expect(a.status).toBe('none');
    expect(checkAnswer(a)).toEqual([]);
    expect(a.monthly).toEqual({ careful: 0, middling: 0, good: 0 });
    expect(a.guaranteed.monthlyAfterTax).toBe(0);
    expect(a.sentences.nothing.id).toBe('c.nothing');
    expect(a.sentences.line.id).toBe('c.nothing');
    const texts = [...Object.values(a.sentences).flatMap((s) => (Array.isArray(s) ? s : [s])), ...a.assumed, ...a.warnings].map((s) => s.text).join('\n');
    expect(texts).not.toMatch(/-£0|£0 a month until/);
  });

  it('CF7 a couple is two singles: both CF1 → exactly twice CF1', () => {
    const one = answerC({ charge: 0, you: { pot: 300000, age: 65, statePension: NO_SP } }, FLAT);
    const two = answerC({ charge: 0, household: 'couple', you: { pot: 300000, age: 65, statePension: NO_SP }, partner: { pot: 300000, age: 65, statePension: NO_SP } }, FLAT);
    expect(checkAnswer(two)).toEqual([]);
    expect(two.monthly).toEqual({ careful: 1660, middling: 1660, good: 1660 });
    expect(two.phases[0].takeHome).toBe(2 * one.phases[0].takeHome);
    expect(two.phases[0].fromPension).toBeCloseTo(2 * one.phases[0].fromPension, 2);
    expect(two.basis.split).toEqual([{ who: 'you', share: 0.5 }, { who: 'partner', share: 0.5 }]);
    expect(rows(two, 'partner')).toHaveLength(360);
    expect(rows(two, 'you').every((r) => Math.abs(r.afterTax - 830) < 0.005)).toBe(true);
  });

  // CF8 (6.19.0): the charge comes off every month after the month's growth (none here) and before the draw, so with
  // Q = (1 − c)^(1/12) the pot after n months is P·Qⁿ − D·(1 − Qⁿ)/(1 − Q), and the most that lasts 360 months is
  // D = P·Q³⁶⁰·(1 − Q)/(1 − Q³⁶⁰) — CF1's £833.33 at c = 0; £772.09 at 0.5%; £658.23 at 1.5%; £509.14 at 3% (no tax)
  it.each([[0.5, 770], [1.5, 650], [3, 500]])('CF8 a charge of %s%% a year on CF1: the careful amount is the closed form, and every month shows its charge', (c, want) => {
    const a = answerC({ charge: c, you: { pot: 300000, age: 65, statePension: NO_SP } }, FLAT);
    expect(checkAnswer(a)).toEqual([]);
    const Q = Math.pow(1 - c / 100, 1 / 12);
    const D = 300000 * Math.pow(Q, 360) * (1 - Q) / (1 - Math.pow(Q, 360));
    expect(Math.floor(D / 10) * 10).toBe(want);
    expect(a.monthly).toEqual({ careful: want, middling: want, good: want });
    expect(a.phases[0].tax).toBe(0);
    const r = rows(a);
    expect(r).toHaveLength(360);
    expect(Math.abs(r[0].charge - 300000 * (1 - Q))).toBeLessThan(1e-6);
    for (const x of r) {
      expect(Math.abs(x.growth)).toBeLessThan(1e-6);
      expect(Math.abs(x.charge - x.potStart * (1 - Q))).toBeLessThan(1e-6);
      expect(Math.abs(x.potStart - x.charge - x.draw - x.potEnd)).toBeLessThan(1e-6);
    }
    expect(r[r.length - 1].potEnd).toBeGreaterThanOrEqual(0);
    // (0.5 typed is the default's value, so C lists it as the default — with Change either way)
    expect(a.assumed.find((x) => x.id === 'charges')).toMatchObject({ field: 'charge', source: c === 0.5 ? 'default' : 'entered', value: c });
  });

  it('a made-up future with flat prices is read as flat, not as 2.5% (the engine\'s "not given")', () => {
    const a = answerC({ charge: 0, you: { pot: 300000, age: 65, statePension: NO_SP } }, FLAT);
    const r = rows(a);
    expect(r[r.length - 1].priceIndex).toBeCloseTo(1, 6);
  });
});
