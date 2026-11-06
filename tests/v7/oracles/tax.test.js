/**
 * Tax: HMRC's rules as a table (test plan 3.2), run against the hand-written oracle itself, against today's
 * calculateTax, and against the answer's own tax step (planDrawdown as the adapter calls it, and the trace rows).
 * The rows above £100,000 went red on the code before v6.16.0; they are the reason P0 shipped first.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { ukTax, pocketFromPot, potForPocket, TODAY } from './ukTax.mjs';
import { calculateTax, grossToNet, netToGross } from '../../../src/services/TaxCalculator.js';
import { planDrawdown } from '../../../src/services/DrawdownStrategy.js';
import { RULES, BAND } from '../../../src/answers/shared/rules.js';
import { BANDS } from '../../../src/answers/shared/toEngine.js';
import { TEST_ENV } from '../c/_c.js';
import { answerC } from '../c/invariants.js';

const table = JSON.parse(readFileSync(resolve(process.cwd(), 'tests/v7/oracles/hmrc-income-tax-2026-27.json'), 'utf8'));
const pence = (x) => Math.round(x * 100);

describe('the answers use the published figures', () => {
  it('rules.js and the adapter carry the table\'s thresholds', () => {
    expect(RULES.personalAllowance).toBe(table.rules.personalAllowance);
    expect(RULES.basicRateLimit).toBe(table.rules.basicRateLimit);
    expect(RULES.higherRateLimit).toBe(table.rules.higherRateLimit);
    expect(RULES.taxFreeShare).toBe(table.rules.taxFreeShare);
    expect(RULES.taxFreeLimit).toBe(table.rules.taxFreeLimit);
    expect(BANDS).toEqual({ pa: RULES.personalAllowance, brl: RULES.basicRateLimit, hrl: RULES.higherRateLimit });
    expect(TODAY.pa).toBe(RULES.personalAllowance);
    expect(BAND).toEqual({ careful: 0.9, middling: 0.5, good: 0.1 });
  });
});

describe('income tax 2026/27 — the oracle, the app and the answer agree to the penny', () => {
  for (const row of table.income) {
    it(`£${row.gross} → £${row.tax} (${row.working})`, () => {
      expect(pence(ukTax(row.gross))).toBe(pence(row.tax));
      expect(pence(calculateTax(row.gross, BANDS.pa, BANDS.brl, BANDS.hrl))).toBe(pence(row.tax));
      expect(pence(grossToNet(row.gross, BANDS.pa, BANDS.brl, BANDS.hrl))).toBe(pence(row.gross - row.tax));
      expect(netToGross(row.gross - row.tax, BANDS.pa, BANDS.brl, BANDS.hrl)).toBeCloseTo(row.gross, 4);
    });
  }
  it('the oracle scales with the bands, as the answer\'s bands rise with prices', () => {
    const k = 1.37;
    const bands = { pa: TODAY.pa * k, brl: TODAY.brl * k, hrl: TODAY.hrl * k };
    for (const row of table.income) expect(ukTax(row.gross * k, bands, { taperFrom: TODAY.taperFrom * k })).toBeCloseTo(row.tax * k, 6);
  });
});

describe('from the pot to the pocket — a quarter tax-free, the rest taxed with other income', () => {
  for (const row of table.potToPocket) {
    const opts = { taxFreeUsedUp: !!row.taxFreeUsedUp };
    it(`other £${row.other}, taken £${row.taken} → pocket £${row.pocket}${row.note ? ` (${row.note})` : ''}`, () => {
      const o = pocketFromPot(row.taken, row.other, opts);
      expect(pence(o.taxed)).toBe(pence(row.taxed));
      expect(pence(o.tax)).toBe(pence(row.tax));
      expect(pence(o.pocket)).toBe(pence(row.pocket));
      // the answer's own step: planDrawdown as the adapter calls it, asked for exactly this pocket
      const targetNet = row.pocket;
      const plan = planDrawdown({ targetGross: netToGross(targetNet, BANDS.pa, BANDS.brl, BANDS.hrl), fixedIncome: row.other, pa: BANDS.pa, brl: BANDS.brl, hrl: BANDS.hrl, isaBalance: 0, taxFreeFraction: row.taxFreeUsedUp ? 0 : 0.25 });
      expect(Math.abs(plan.sippGross - row.taken)).toBeLessThan(0.01);
      expect(Math.abs(plan.tax - row.tax)).toBeLessThan(0.01);
      expect(Math.abs(plan.net - row.pocket)).toBeLessThan(0.01);
      // and backwards through the oracle
      expect(Math.abs(potForPocket(row.pocket, row.other, opts) - row.taken)).toBeLessThan(0.01);
    });
  }
  it('two allowances against one name', () => {
    const [two, one] = table.couple;
    expect(pence(pocketFromPot(two.each).pocket * 2)).toBe(pence(two.pocketTogether));
    expect(pence(pocketFromPot(one.one).tax)).toBe(pence(one.tax));
    expect(pence(pocketFromPot(one.one).pocket)).toBe(pence(one.pocket));
  });
});

describe('the answer\'s trace pays the table\'s tax', () => {
  it('a flat future: every month\'s tax is the oracle\'s tax on that month\'s income, annualised', () => {
    const env = { ...TEST_ENV, futures: 1, trace: true, futureReturns: () => ({ equity: {}, inflation: {} }), mix: { equity: 0, bond: 0, cash: 1 } };
    const a = answerC({ you: { pot: 900000, age: 60, finalSalary: { has: true, yearly: 9000, fromAge: 60 } } }, env);
    expect(a.status).toBe('ok');
    let checked = 0;
    for (const r of a.trace.atCareful.rows) {
      const bands = { pa: BANDS.pa * r.priceIndex, brl: BANDS.brl * r.priceIndex, hrl: BANDS.hrl * r.priceIndex };
      expect(Math.abs(r.tax * 12 - ukTax(12 * (r.taxable + r.statePension + r.finalSalary), bands))).toBeLessThan(0.01);
      checked++;
    }
    expect(checked).toBe(35 * 12);
    expect(a.phases[0].tax).toBeGreaterThan(0);
  });
});
