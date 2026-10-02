/**
 * Closed forms for a spending shape (research/v7/spending-shape.md 9.3): one made-up future, prices flat, every investment
 * returning exactly 0%, the pot held as cash, no charge, every year under the personal allowance (no tax) — so the pot
 * pays exactly the sum of what the shape asks of it, and the careful amount is the largest whole £10 at the start whose
 * shape that sum fits in.
 *
 *   CF-SS1  £S until 80, then £S/2: the pot pays 12S × 15 + 6S × 15 = 270S over 30 years
 *   CF-SS2  falls 1% a year from the start: the pot pays Σ 12S × 0.99^y, y = 0 … 29
 *   CF-SS3  moves evenly from £S at 65 to £S/2 at 80, then the same: 12S × (Σ (1 − y/30), y = 0 … 14) + 6S × 15
 *   CF-SS4  a State Pension above a late step: the pots pay nothing from that year, and the note says so from that age
 * C answers each; A at the same stop (now) gives the same careful start.
 */
import { describe, it, expect } from 'vitest';
import { answerC } from '../c/_c.js';
import { answerA } from '../a/_a.js';

const FLAT = { today: '2026-09-30', futures: 1, seed: 0, trace: false, futureReturns: () => ({ equity: {}, inflation: {} }), mix: { equity: 0, bond: 0, cash: 1 } };
const NO_SP = { kind: 'none' };
const base = (pot, shape, more = {}) => ({ charge: 0, you: { pot, age: 65, statePension: NO_SP, ...more }, start: { kind: 'now' }, shape });
/** The largest whole £10 a month at the start whose shape the pot covers, from the shape's yearly multiple of the start. */
const carefulOf = (pot, multiple) => Math.floor(pot / multiple / 10) * 10;

describe('CF-SS — a flat future, 0% on everything, all in cash, no tax', () => {
  it('CF-SS1 a step to half at 80: 270 × the start a month over 30 years → £250,000 gives £920 a month at the start, £460 from 80', () => {
    const a = answerC(base(250000, { steps: [{ fromAge: 80, share: 50, then: 'level' }] }), FLAT);
    expect(a.status).toBe('ok');
    expect(a.monthly.careful).toBe(carefulOf(250000, 270));
    expect(a.monthly.careful).toBe(920);
    expect(a.shapeAt.careful.map((s) => [s.fromAge, s.perMonth])).toEqual([[65, 920], [80, 460]]);
    expect(a.sentences.shape.text).toBe('That is at the start. Then, as you set it: £460 from 80.');
    // the year-by-year rows: 15 years at £920 and 15 at £460, and what they draw adds up to no more than the pot
    expect(a.byYear).toHaveLength(30);
    expect(a.byYear.slice(0, 15).every((r) => r.spend === 920)).toBe(true);
    expect(a.byYear.slice(15).every((r) => r.spend === 460)).toBe(true);
    expect(a.byYear.reduce((t, r) => t + r.fromPots * 12, 0)).toBeLessThanOrEqual(250000);
  });

  it('CF-SS2 falls 1% a year: Σ 12 × 0.99^y over 30 years (312.36…) → £250,000 gives £800 a month at the start, about £595 at 94', () => {
    const multiple = Array.from({ length: 30 }, (_, y) => 12 * Math.pow(0.99, y)).reduce((t, v) => t + v, 0);
    const a = answerC(base(250000, { then: 'falls', fallsPct: 1 }), FLAT);
    expect(a.monthly.careful).toBe(carefulOf(250000, multiple));
    expect(a.monthly.careful).toBe(800);
    expect(a.shapeAt.careful).toEqual([{ fromAge: 65, perMonth: 800, then: 'falls', fallsPct: 1, endAge: 94, endPerMonth: 595 }]);   // 800 × 0.99^29 = 597.3, rounded down to £5
    expect(a.sentences.shape.text).toBe('That is at the start, falling 1% a year to £595 at 94.');
  });

  it('CF-SS3 moves evenly to half by 80, then the same: (11.5 + 7.5) × 12 = 228 × the start → £200,000 gives £870 a month', () => {
    const a = answerC(base(200000, { then: 'glides', steps: [{ fromAge: 80, share: 50, then: 'level' }] }), FLAT);
    expect(a.monthly.careful).toBe(carefulOf(200000, 228));
    expect(a.monthly.careful).toBe(870);
    expect(a.byYear.slice(0, 16).map((r) => r.spend)).toEqual(Array.from({ length: 16 }, (_, y) => Math.round(870 * (1 - 0.5 * Math.min(y, 15) / 15) * 100) / 100));
  });

  it('CF-SS4 a State Pension of £9,000 a year from 67 above a step to 40% at 80: the pots pay 12 × (15S − 9,750) → £60,000 gives £980; from 80 nothing, and the note says so', () => {
    const a = answerC({ ...base(60000, { steps: [{ fromAge: 80, share: 40, then: 'level' }] }), you: { pot: 60000, age: 65, statePension: { kind: 'forecast', yearly: 9000 } } }, FLAT);
    // years 65–66: 12S from the pot; 67–79: 12(S − 750); from 80: 0.4S < £750 → nothing
    expect(a.monthly.careful).toBe(Math.floor((60000 / 12 + 13 * 750) / 15 / 10) * 10);
    expect(a.monthly.careful).toBe(980);
    expect(a.byYear.slice(15).every((r) => r.fromPots === 0 && r.takeHome === 750)).toBe(true);
    expect(a.shapeNotes.belowIncome).toEqual({ age: 80, perMonth: 750 });
    const note = a.warnings.find((w) => w.id === 'shape-below-income');
    expect(note.text).toBe('From 80 your State Pension and other pensions pay more than this, after tax (about £750 a month): you would have that, and nothing would be taken from your pension or savings.');
  });

  it('A at the same stop (now) and the same shape in pounds gives the same careful start (C, A one test)', () => {
    const c = answerC(base(250000, { steps: [{ fromAge: 80, share: 50, then: 'level' }] }), FLAT);
    const a = answerA({ charge: 0, you: { age: 65, pot: 250000, statePension: NO_SP }, stop: { kind: 'age', age: 65 },
      spend: { kind: 'amount', amount: 1000, steps: [{ fromAge: 80, perMonth: 500, then: 'level' }] } }, { ...FLAT, detail: 'chart', ages: [65], savingMix: { equity: 0, bond: 0, cash: 1 } });
    expect(a.status).toBe('ok');
    expect(a.shown.monthly.careful).toBe(c.monthly.careful);
    // A's verdict at £1,000 a month, then £500: 270 × 1,000 = £270,000 > £250,000 — it runs out
    expect(a.shown.verdict).toBe('no');
  });
});
