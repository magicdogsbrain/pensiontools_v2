/**
 * Year 0 is ONE sum on every page (ruling Z2). A plan's current year pays for the months it has (services/PaidYear.js):
 * the spending of those months, the income that arrives in them, and so what the pots pay. The Pots & Valves year table
 * (src/reading/yearTable.js → DrawdownService.generateDrawdownSchedule) and the projection frozen at the lock (PlanCommit
 * planOfRecordFor, which the Decision tool's History reads as "planned draw") gave year 0 the State Pension of its months
 * but a whole year's spending, so they took too much from the pension.
 *
 * A fictional plan (tests/partYearOneSum.test.js's Jo): Jo stops work in November 2027; the plan pays £28,000 a year
 * before tax, every pound taxed; Jo's State Pension is £12,000 a year from 6 January 2028. Bands £12,570 / £50,270.
 * Worked by hand:
 *   the months year 0 has               November to March = 5
 *   the State Pension in them           January to March = 3 months: 12,000 × 3 ÷ 12 = 3,000
 *   as a rate a year                    3,000 × 12 ÷ 5 = 7,200
 *   from the pension, a rate a year     28,000 − 7,200 = 20,800 (the year's figure, all of it taxed)
 *   tax, a rate a year                  (28,000 − 12,570) × 20% = 3,086
 *   to spend, a rate a year             28,000 − 3,086 = 24,914
 *   year 0 for its 5 months             pension 20,800 × 5 ÷ 12 = 8,666.67 (PaidYear's need: 11,666.67 − 3,000);
 *                                       tax 3,086 × 5 ÷ 12 = 1,285.83; to spend 24,914 × 5 ÷ 12 = 10,380.83
 * Before the fix the row said: pension 25,000, State Pension 3,000, tax 3,086, to spend 24,914 (a whole year's spending).
 * History's planned draw for a month of year 0: 8,666.67 ÷ 5 = 1,733.33 (was the year's draw ÷ 12).
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));

import { createSimulationConfigFromSettings } from '../src/storage/StressRepository.js';
import { planFromSettings } from '../src/strategies/stressTest.js';
import { paidYearOf } from '../src/services/PaidYear.js';
import { generateDrawdownSchedule } from '../src/services/DrawdownService.js';
import { yearTablesOf, yearTablesText, partYearOf } from '../src/reading/yearTable.js';
import { recordPartYear } from '../src/services/PlanLock.js';
import { planOfRecordFor, seedDecisionFromStress } from '../src/services/PlanCommit.js';
import { yearRowHtml } from '../src/ui/planStartUi.js';

const NOW = new Date(2026, 8, 30, 12);
const jo = {
  configured: true, duration: 30, other: 0, pa: 12570, brl: 50270, hrl: 125140, taxMode: 'frozen',
  protectionMult: 0.8, consecutiveLimit: 3, disableProtection: true, recoveryBuffer: 0,
  hodlEnabled: false, hodlValue: 0, isaReturn: 0.03, spStartDate: '2028-01-06', spWeeklyAmount: 12000 / 52, statePension: 0,
  dbAmount: 0, dbStartYear: 0, dbIndexation: 'cpi', accessMethod: 'drawdown',
  equityMin: 950000, bondMin: 200000, cashTarget: 100000, isaBalance: 0, isaStart: 0, baseSalary: 28000,
  incomeShape: 'phases', incomeSteps: [{ fromAge: 65, amount: 28000 }],
  currentAge: 64, currentAgeAsOf: '2026-09-30', retired: false, retireAge: 65, stoppedWork: '2027-11', firstTaxYear: 2027,
  strategyId: 'pots-and-valves', shapeAgeNow: 65
};
const p = planFromSettings(jo, createSimulationConfigFromSettings({}, jo), { now: NOW });
const gbp = (v) => '£' + Math.round(v).toLocaleString('en-GB');

describe('the year table: year 0 for the months it has', () => {
  it('the plan: 5 months, PaidYear need £8,666.67', () => {
    expect(p.year0Months).toBe(5);
    expect(paidYearOf(p, 0).need).toBeCloseTo(8666.67, 2);
    expect(partYearOf(p)).toEqual({ partYear: { year: 0, months: 5, spFirstYearRatio: p.spFirstYearRatioTaxYear } });
  });

  it('the schedule: pension £8,666.67, State Pension £3,000, tax £1,285.83, to spend £10,380.83', () => {
    const [y0, y1] = generateDrawdownSchedule(jo, 2, 0, NOW, partYearOf(p));
    expect(y0.months).toBe(5);
    expect(y0.sippDraw).toBeCloseTo(8666.67, 2);
    expect(y0.statePension).toBeCloseTo(3000, 2);
    expect(y0.tax).toBeCloseTo(1285.83, 2);
    expect(y0.spendable).toBeCloseTo(10380.83, 2);
    expect(y0.netIncome).toBeCloseTo(y0.sippDraw + y0.statePension - y0.tax, 6);
    // year 1 is a whole year: the State Pension in full, £16,000 from the pension
    expect(y1.months).toBeUndefined();
    expect(y1.statePension).toBeCloseTo(12000, 2);
    expect(y1.sippDraw).toBeCloseTo(16000, 2);
  });

  it('the year table both views draw: the same row, its year cell says the months', () => {
    const t = yearTablesOf({ settings: jo, strategyId: 'pots-and-valves', p, now: NOW, prices: 0 });
    expect(t.schedule[0]).toMatchObject({ year: 0, months: 5, pension: 8667, state: 3000, tax: 1286, net: 10381, spendable: 10381 });
    expect(t.schedule[1].months).toBeUndefined();
    const text = yearTablesText(t);
    expect(text.rows[0].cells.year).toBe('0 (5 months)');
    expect(text.rows[1].cells.year).toBe('1');
  });

  it('without the plan: every row a whole year, as before', () => {
    const [y0] = generateDrawdownSchedule(jo, 1, 0, NOW);
    expect(y0.months).toBeUndefined();
    expect(y0.sippDraw).toBeCloseTo(25000, 2);
  });
});

describe('the projection frozen at the lock, and History', () => {
  const ds = seedDecisionFromStress(jo, {});
  const por = planOfRecordFor({ ...ds }, NOW, { stress: jo, ...partYearOf(p, { fromToday: true }) });
  it('the lock (the run\'s plan) and the Decision tool\'s first record (the Stress settings) give it the same months', () => {
    expect(recordPartYear(jo, NOW)).toEqual(partYearOf(p, { fromToday: true }));
  });
  it('its year 0 is the 5 months: £8,667 from the pension', () => {
    expect(por.drawdown[0].months).toBe(5);
    expect(por.drawdown[0].sippDraw).toBe(8667);
    expect(por.drawdown[1].months).toBeUndefined();
  });
  it('History: a month recorded as the plan said is on plan (£1,733 a month planned)', () => {
    const recs = [{ sipp: 8666.67 / 5, taxPaidMonthly: 1285.83 / 5, isaBalance: 0 }];
    const row = yearRowHtml(0, recs, por.drawdown[0], null, 0, gbp);
    expect(row).toContain('£1,733/mo</td>');
    expect(row).toContain('(+£0)');
    expect(row).toContain('of a 5-month first year');
    expect(row).toContain('£1,286<span class="hint"> for 5 mo');
  });
  it('a record frozen before (no months) is read as it was: its year over twelve', () => {
    const row = yearRowHtml(0, [{ sipp: 2000 }], { sippDraw: 24000, tax: 2000, isaBalance: 0 }, null, 0, gbp);
    expect(row).toContain('£2,000/mo</td>');
  });
});

/**
 * The walk's case, made up from scratch: Pat is retired at 66 with the State Pension (£12,548 a year) from 25 November
 * 2026, a quarter of each pension payment tax-free, and wants £26,400 a year after tax (£2,200 a month; held as the
 * engines read it, £29,858 a year as if every pound were taxed). On 25 November 2026 the plan's year 0 has November to
 * March, 5 months. By hand: to spend 26,400 × 5 ÷ 12 = 11,000; the State Pension 12,548 × 5 ÷ 12 = 5,228.33; a year
 * before tax as taken with the State Pension as it comes, 28,840 (BeforeTax.takenOfTarget), so the pension pays
 * 28,840 − 12,548 = 16,292 a year, for 5 months 6,788 — £1,358 a month, what the month's own page asks. Before the fix the
 * row said: from the pension £23,181, State Pension £5,228, to spend £26,400.
 */
describe('a retired plan whose year 0 has 5 months (the walk)', () => {
  const day = new Date(2026, 10, 25, 12);
  const pat = {
    configured: true, duration: 33, other: 0, pa: 12570, brl: 50270, hrl: 125140, taxMode: 'frozen',
    protectionMult: 0.8, consecutiveLimit: 3, disableProtection: true, recoveryBuffer: 0,
    hodlEnabled: false, hodlValue: 0, spStartDate: '2026-11-25', spWeeklyAmount: 12548 / 52, statePension: 0,
    dbAmount: 0, dbStartYear: 0, dbIndexation: 'cpi', accessMethod: 'ufpls', isaDrawdownStrategy: 'hold',
    equityMin: 300000, bondMin: 70000, cashTarget: 30000, isaBalance: 50000, isaStart: 50000, baseSalary: 29858,
    incomeShape: 'phases', incomeSteps: [{ fromAge: 66, amount: 29858 }],
    currentAge: 66, currentAgeAsOf: '2026-11-25', retired: true, stoppedWork: '2026-06', firstTaxYear: 2026,
    strategyId: 'pots-and-valves', shapeAgeNow: 66
  };
  const pp = planFromSettings(pat, createSimulationConfigFromSettings({}, pat, day), { now: day });
  it('year 0: to spend £11,000, State Pension £5,228, from the pension about £6,788 (£1,358 a month)', () => {
    expect(pp.year0Months).toBe(5);
    const t = yearTablesOf({ settings: pat, strategyId: 'pots-and-valves', p: pp, now: day });
    const y0 = t.schedule[0];
    expect(y0).toMatchObject({ months: 5, state: 5228, spendable: 11000 });
    expect(Math.abs(y0.pension - 6788)).toBeLessThanOrEqual(2);
    expect(Math.abs(y0.pension / 5 - 1358)).toBeLessThanOrEqual(1);
    const por = planOfRecordFor({ ...seedDecisionFromStress(pat, {}) }, day, { stress: pat, ...recordPartYear(pat, day) });
    expect(por.drawdown[0].months).toBe(5);
    expect(Math.abs(por.drawdown[0].sippDraw / 5 - 1358)).toBeLessThanOrEqual(1);
  });
});
