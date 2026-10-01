/**
 * Cases with an exact answer (step 4 brief 6, P3: the test plan's BF1–BF6 with the brief's paths). Made-up lives:
 * prices flat, every investment returning exactly 0% (or a fixed −10% a year while saving, BF3), no charge while
 * saving (`charge: 0`), the money held as cash (env.mix, env.savingMix), so every figure can be worked out by hand.
 *
 * The pay-in is what lands in the pension (brief conflict 11): the pot at the stop is pot + 12 × S × pay-in, and the
 * pay-in that gets there is the least whole £10 `p` with pot + 12 × S × p ≥ the number — the test works it out from
 * that sum, it does not copy a figure.
 */
import { describe, it, expect } from 'vitest';
import { TEST_ENV, answerB, checkAnswerB } from './invariants.js';
import { RULES, SAVING } from '../../../src/answers/shared/rules.js';

const CASH = { equity: 0, bond: 0, cash: 1 };
const SHARES = { equity: 1, bond: 0, cash: 0 };
const flat = () => ({ equity: {}, inflation: {} });
const FLAT = { ...TEST_ENV, futures: 1, trace: true, futureReturns: flat, mix: CASH, savingMix: CASH, savingsGrowth: 0 };
const NO_SP = { kind: 'none' };
const ok = (a, given) => { const f = checkAnswerB(a, given); expect(f, f.join('\n')).toEqual([]); return a; };

/** BF1's person: 45, £120,000, £500 a month lands in the pension, stop at 60, £990 a month, no State Pension, no charge. */
const BF1 = { you: { age: 45, pot: 120000, payIn: { total: 500 }, statePension: NO_SP }, stop: { age: 60 }, spend: { amount: 990 }, charge: 0 };

/** The least whole £1,000 P with P ≥ spend × 12 × years (0% on everything, no tax under the allowance): the pot a flat future needs. */
const flatNumber = (spend, years) => Math.ceil((spend * 12 * years) / 1000) * 1000;
/** The least whole £10 p with pot + months × p ≥ target. */
const flatPayIn = (pot, months, target) => Math.max(0, Math.ceil((target - pot) / months / 10) * 10);

describe('B closed forms: flat lives, 0% on everything, no charge', () => {
  it('BF1 the number: 416,000 is the least whole £1,000 that pays £990 a month from 60 to 95; the pay-in that reaches it is the least £10 with 120,000 + 180p ≥ 416,000', () => {
    const a = ok(answerB(BF1, FLAT), BF1);
    expect(a.status).toBe('ok');
    // 416,000 / 420 months = 990.48 a month: it lasts; 415,000 / 420 = 988.10: it does not
    expect(a.number).toMatchObject({ careful: 416000, middling: 416000, good: 416000 });
    expect(a.number.careful).toBe(flatNumber(990, 35));
    expect(a.years).toEqual({ saving: 15, drawing: 35 });
    // the pot at 60: 120,000 + 180 × 500 = 210,000 in every future
    expect(a.potAtStop.now).toEqual({ careful: 210000, middling: 210000, good: 210000 });
    expect(a.saving[0].paidIn.total).toBe(90000);
    expect(a.chance.lasted).toBe(0);
    expect(a.onCourse).toBe(false);
    expect(a.already).toBe(false);
    const p = flatPayIn(120000, 180, 416000);
    expect(p).toBe(1650);                                          // p ≥ 1,644.44
    expect(a.payIn.at).toEqual({ nineInTen: p, threeInFour: p });
    expect(a.payIn.needed).toBe(p);
    expect(a.payIn.extra).toBe(p - 500);
    expect(a.potAtStop.needed.careful).toBe(120000 + 180 * p);
    expect(a.short).toBe(416000 - 210000);
    // what the bad-case pot pays: 210,000 over 420 months is £500 a month exactly — the knife-edge of the last month, on
    // which the engine runs out in month 419 (C's CF3 note) — so the careful amount is the £10 below: £490, whose number
    // is the least £1,000 over 490 × 420 = 205,800
    expect(a.monthlyIfShort).toBe(490);
    // (one life, so the careful amount paying in as now lasts in it: lasted 1)
    expect(a.levers.spendLess).toEqual({ spend: 490, lasted: 1 });
    expect(a.levers.payMore).toEqual({ payIn: p, savingsIn: null, lasted: 1 });
    expect(a.levers.accept).toEqual({ lasted: 0, short: 206000, monthlyIfShort: 490 });
    // stop later: the least age to 75 at which £500 a month as now makes the whole life last — one flat life, so the age
    // whose pot at the stop pays £990 a month to 95, from the same sums (step 4 brief J9: searched to 75, A's earliest age)
    let later = null;
    for (let age = 61; age <= 75 && later === null; age++) if (120000 + 12 * (age - 45) * 500 >= flatNumber(990, 95 - age)) later = age;
    expect(later).toBe(72);                                         // 120,000 + 324 × 500 = 282,000 ≥ 274,000; at 71, 276,000 < 286,000
    expect(a.levers.stopLater).toEqual({ age: later, lasted: 1 });
    expect(a.wholeLife.lasted).toBe(0);
    // the whole life: 210,000 at £990 a month lasts 212 months from 60 → runs out at 77
    expect(a.wholeLife.runOutAge).toBe(60 + Math.floor(210000 / 990 / 12));
    expect(a.sentences.head.text).toBe('About £416,000 by age 60');
    expect(a.sentences.payInHead.text).toBe('About £1,650 a month into your pension');
    expect(a.warnings.map((w) => w.id)).not.toContain('annual-allowance');
  });

  it('BF1 the saving months add up: at the start of each month the pay-in goes in, and nothing grows', () => {
    const a = answerB(BF1, FLAT);
    const rows = a.trace.saving.atCareful.rows;
    expect(rows).toHaveLength(180);
    rows.forEach((r, m) => {
      expect(r.paidIn.total).toBeCloseTo(500, 6);
      expect(r.growth).toBeCloseTo(0, 6);
      expect(r.potEnd).toBeCloseTo(r.potStart + r.paidIn.total + r.growth - r.charge, 6);
      if (m > 0) expect(r.potStart).toBeCloseTo(rows[m - 1].potEnd, 6);
    });
    expect(rows[0].potStart).toBeCloseTo(120000, 6);
    expect(rows.at(-1).potEnd).toBeCloseTo(210000, 4);
    expect(rows.at(-1).age).toBe(59);
  });

  it('BF2 already there: a pot of £417,000 and nothing paid in reaches the number in every future; nothing more is needed; no lever applies', () => {
    const given = { ...BF1, you: { ...BF1.you, pot: 417000, payIn: { total: 0 } } };
    const a = ok(answerB(given, FLAT), given);
    expect(a.number.careful).toBe(416000);
    expect(a.chance.lasted).toBe(1);
    expect(a.onCourse).toBe(true);
    expect(a.already).toBe(true);
    expect(a.payIn.needed).toBe(0);
    expect(a.payIn.at).toEqual({ nineInTen: 0, threeInFour: 0 });
    expect(a.levers).toEqual({ stopLater: null, payMore: null, spendLess: null, moreRisk: null, accept: { lasted: 1, short: 0, monthlyIfShort: a.monthlyIfShort } });
    expect(a.sentences.head.id).toBe('b.head.onCourse');
    expect(a.sentences.have.id).toBe('b.have');
    expect(a.sentences.payInHead).toBeUndefined();
    expect(a.assumed.map((x) => x.id)).toContain('nothing-paid-in');
  });

  it('BF3 the confidence: ten lives, five flat and five falling 10% a year while saving — 9 in 10 and 3 in 4 both land on the falling lives\' figure; the number does not move', () => {
    const lives = (i, years) => {
      const equity = {};
      for (let y = 0; y < years; y++) equity[y] = i >= 5 && y < 15 ? -0.10 : 0;
      return { equity, inflation: {} };
    };
    const env = { ...FLAT, futures: 10, futureReturns: lives, mix: SHARES, savingMix: SHARES };
    // falling: each month × q, q = 0.9^(1/12), the pay-in at the start of the month (the kernel is annuity-due)
    const q = Math.pow(0.9, 1 / 12);
    const zero = 120000 * Math.pow(q, 180);
    const perPound = q * (Math.pow(q, 180) - 1) / (q - 1);
    const falling = Math.ceil(((416000 - zero) / perPound) / 10) * 10;
    for (const confidence of ['nineInTen', 'threeInFour']) {
      const given = { ...BF1, confidence };
      const a = ok(answerB(given, env), given);
      expect(a.number.careful, confidence).toBe(416000);            // the drawing years are flat in every life
      expect(a.payIn.needed, confidence).toBe(falling);
      expect(a.payIn.confidence).toBe(confidence);
    }
    // at the flat lives' figure (£1,650) half the lives reach it: the flat five
    const half = { ...BF1, you: { ...BF1.you, payIn: { total: 1650 } } };
    const h = ok(answerB(half, env), half);
    expect(h.chance.lasted).toBe(0.5);
    expect(h.chance.fails).toBe(5);
    expect(h.onCourse).toBe(false);
    expect(h.potAtStop.now.good).toBe(120000 + 180 * 1650);
    expect(h.potAtStop.now.careful).toBe(Math.round(zero + 1650 * perPound));
  });

  it('BF4 the pensions alone: 60, stop at 67, £1,000 a month, the full State Pension from 67 → no pot is needed, nothing to pay in', () => {
    const given = { you: { age: 60, pot: 0, payIn: { total: 0 } }, stop: { age: 67 }, spend: { amount: 1000 }, charge: 0 };
    const a = ok(answerB(given, FLAT), given);
    expect(a.status).toBe('guaranteed-only');
    expect(a.number).toMatchObject({ careful: 0, middling: 0, good: 0 });
    expect(a.payIn.needed).toBe(0);
    expect(a.onCourse).toBe(true);
    expect(a.guaranteed.monthlyAfterTax).toBeCloseTo(RULES.fullStatePensionWeekly * 52 / 12, 2);
    expect(a.sentences.nothing.id).toBe('b.nothing');
    expect(a.warnings.map((w) => w.id)).toContain('target-below-pensions');
  });

  it('BF5 out of reach: £50,000 a month from 60 needs more than £5,000,000 → no number, and the ways that are left', () => {
    const given = { ...BF1, spend: { amount: 50000 } };
    const a = ok(answerB(given, FLAT), given);
    expect(a.status).toBe('out-of-reach');
    expect(a.number).toBeNull();
    expect(a.payIn.needed).toBeNull();
    expect(a.warnings.map((w) => w.id)).toContain('out-of-reach');
    expect(a.sentences.none).toBeDefined();
    expect(a.levers.spendLess).toMatchObject({ spend: 490 });      // what the pot £500 a month reaches does pay (BF1's knife-edge)
    expect(a.levers.accept.monthlyIfShort).toBe(490);
    expect(SAVING.potMax).toBe(5000000);
  });

  it('BF6 a couple is two of BF1: £1,980 a month needs £832,000 between them, split by their pots; one household pay-in, split as now', () => {
    const given = { household: 'couple', you: BF1.you, partner: { age: 45, pot: 120000, payIn: { total: 500 }, statePension: NO_SP }, stop: { age: 60 }, spend: { amount: 1980 }, charge: 0 };
    const a = ok(answerB(given, FLAT), given);
    expect(a.number.careful).toBe(832000);
    expect(a.number.byPerson).toEqual([{ who: 'you', pot: 416000 }, { who: 'partner', pot: 416000 }]);
    expect(a.payIn.now).toBe(1000);
    expect(a.potAtStop.now.careful).toBe(420000);
    const p = flatPayIn(240000, 180, 832000);
    expect(p).toBe(3290);
    expect(a.payIn.needed).toBe(p);
    expect(a.basis.split).toEqual([{ who: 'you', share: 0.5 }, { who: 'partner', share: 0.5 }]);
    expect(a.assumed.map((x) => x.id)).toEqual(expect.arrayContaining(['stop-together', 'pay-in-split', 'both-alive']));
    expect(a.sentences.head.id).toBe('b.head.couple');
  });

  it('a pay-in over £60,000 a year warns, as does the pay-in that gets there; over £10,000 after taking pension money, the other limit', () => {
    const big = { ...BF1, you: { ...BF1.you, payIn: { total: 5001 } } };
    expect(answerB(big, FLAT).warnings.map((w) => w.id)).toContain('annual-allowance');
    const needsBig = { ...BF1, you: { ...BF1.you, pot: 0 }, spend: { amount: 3000 } };           // a number near £1,400,000, reached by about £7,800 a month
    const n = answerB(needsBig, FLAT);
    expect(n.payIn.needed * 12).toBeGreaterThan(RULES.annualAllowance);
    expect(n.warnings.map((w) => w.id)).toContain('annual-allowance');
    const drawing = { ...BF1, you: { ...BF1.you, alreadyDrawing: true, payIn: { total: 900 } } };
    expect(answerB(drawing, FLAT).warnings.map((w) => w.id)).toContain('mpaa');
    const isa = { ...BF1, savingsIn: 1700 };
    expect(answerB(isa, FLAT).warnings.map((w) => w.id)).toContain('isa-allowance');
  });
});
