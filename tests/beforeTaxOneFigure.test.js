/**
 * "A year before tax" is ONE figure everywhere (ruling Z1): what is TAKEN before tax (services/BeforeTax.js takenOfTarget,
 * src/reading/income.js incomeStepsOf), with the plan's own tax-free share and the income that comes in anyway that year.
 * The stored step (the target, grossed up as if every pound were taxed) is an engine input and is never shown as "before
 * tax", "gross", "needs" or "a year".
 *
 * Made-up people, worked by hand on the bands £12,570 / £50,270 (20% between):
 *   Jo wants £1,800 a month after tax (£21,600.40 a year): stored as 23,858 (21,600.40 = 23,858 − 20% × (23,858 − 12,570)).
 *     With a quarter of each payment tax-free and nothing else coming in, a draw G leaves 0.25G + 0.75G − 20% × (0.75G −
 *     12,570) = 0.85G + 2,514 after tax, so G = (21,600.40 − 2,514) ÷ 0.85 = 22,454.6: £22,455 a year before tax.
 *   Sam wants £16,914 a year after tax: stored as 18,000; taken (16,914 − 2,514) ÷ 0.85 = £16,941.
 *   Every pound taxed (no tax-free share): the stored figure is what is taken (Kim: 28,000).
 */
import { describe, it, expect } from 'vitest';
import { householdIncomeTimeline } from '../src/services/HouseholdService.js';
import { householdYearsOf } from '../src/answers/plan/household.js';

const NOW = new Date(2026, 10, 25, 12);
const jo = { retired: true, currentAge: 60, shapeAgeNow: 60, spStartDate: '2034-05-06', spWeeklyAmount: 230.25, baseSalary: 23858, duration: 30, other: 0, accessMethod: 'ufpls', pa: 12570, brl: 50270, hrl: 125140 };
const sam = { retired: true, currentAge: 62, shapeAgeNow: 62, spStartDate: '2032-05-06', spWeeklyAmount: 230.25, baseSalary: 18000, duration: 30, other: 0, accessMethod: 'ufpls', pa: 12570, brl: 50270, hrl: 125140 };
const kim = { ...sam, baseSalary: 28000, accessMethod: 'drawdown' };

describe('the household table: what each needs is the year before tax as taken', () => {
  it('Jo needs £22,455 and Sam £16,941 (were the stored 23,858 and 18,000); the pots find both', () => {
    const r0 = householdIncomeTimeline(jo, sam, 3, NOW)[0];
    expect(Math.round(r0.needA)).toBe(22455);
    expect(Math.round(r0.needB)).toBe(16941);
    expect([r0.targetA, r0.targetB]).toEqual([23858, 18000]);
    expect(Math.round(r0.drawNeed)).toBe(22455 + 16941);
    const y = householdYearsOf([r0], 2026)[0];
    expect([y.needA, y.needB]).toEqual(['£22,455', '£16,941']);
  });
  it('every pound taxed: the stored figure, as it always was', () => {
    const r0 = householdIncomeTimeline(kim, sam, 3, NOW)[0];
    expect(Math.round(r0.needA)).toBe(28000);
  });
});

/**
 * The plan document (a record, never rewritten): Pat locked £2,200 a month after tax, stored as 29,858 a year, a quarter
 * of each payment tax-free, the State Pension £12,548 a year paid from the plan's start; year 0 has 5 months. The page
 * converts as it draws: a whole year 29,858 with 12,548 coming in anyway is taken as 28,840 (the steps table's figure);
 * year 0's record is 29,858 × 5 ÷ 12 = 12,441 with £5,228 of State Pension, taken 28,840 × 5 ÷ 12 = 12,017, so the pot
 * pays 12,017 − 5,228 = 6,789 (the year table's year 0). An archived version (no reading) says the figure as locked.
 */
import { planDocumentHtml, firstStepText } from '../src/ui/components/PlanDocumentView.js';
import { yearTakenOf } from '../src/reading/income.js';
import { takenOfTarget } from '../src/services/BeforeTax.js';

describe('the plan document says the year before tax as taken', () => {
  const doc = {
    timing: { mode: 'retired', firstTaxYear: 2026, shapeAgeNow: 66 }, lockedAt: '2026-11-25T12:00:00.000Z', planName: 'Pat retired',
    steps: [{ fromAge: 66, amount: 29858, taxYear: '2026/27' }],
    timeline: [{ y: 0, taxYear: '2026/27', age: 66, gross: 12441, sp: 5228, other: 0, lump: 0, contract: 0, market: 0 },
      { y: 1, taxYear: '2027/28', age: 67, gross: 29858, sp: 12548, other: 0, lump: 0, contract: 0, market: 0 }],
    strategy: { id: 'pots-and-valves', p: { year0Months: 5, spAnnual: 12548, spStartYear: 0 } },
    assumptions: { pa: 12570, brl: 50270, hrl: 125140 }, pots: { sipp: 400000 }
  };
  const settings = { accessMethod: 'ufpls' };
  const taken = takenOfTarget(29858, settings, { fixed: 12548 });
  it('the rule: 29,858 with the State Pension coming in anyway is taken as 28,840', () => {
    expect(taken).toBe(28840);
    expect(Math.abs(yearTakenOf(12441, { p: doc.strategy.p, k: 0, share: 0.25, bands: doc.assumptions, fixed: 5228 }) - 12017)).toBeLessThanOrEqual(2);
  });
  it('the header: "First step £28,840 a year before tax" (was £29,858/yr); archived, as locked and labelled', () => {
    expect(firstStepText(doc, [{ beforeTax: 28840, monthAfterTax: 2200 }])).toBe('£28,840 a year before tax, from age 66');
    expect(firstStepText(doc, null)).toBe('£29,858 a year from age 66, as locked, counted as if every pound were taxed');
  });
  it('the year table: income before tax as taken, its year 0 for its 5 months, the pot paying the rest', () => {
    const h = planDocumentHtml(doc, { steps: [{ beforeTax: 28840, monthAfterTax: 2200 }], taxFreeShare: 0.25 });
    expect(h).toContain('Income before tax');
    expect(h).not.toContain('Gross income');
    expect(h).not.toContain('£29,858');
    expect(h).toMatch(/£12,01[6-8]/);
    expect(h).toContain('£28,840');
    expect(h).toMatch(/£6,78[8-9]|£6,790/);
    expect(h).toContain('5 months');
    const old = planDocumentHtml(doc, {});
    expect(old).toContain('Income as locked (every pound counted as taxed)');
    expect(old).toContain('£29,858');
  });
});

import { incomeLayersRows } from '../src/ui/incomeLayersGraphic.js';
import { MONTH } from '../src/v7/copy/month.js';

describe('the full view\'s "What pays you": the need line is the year before tax as taken', () => {
  // Pat's plan as the run holds it: 29,858 a year held, the State Pension 12,548 from year 0, year 0 of 5 months
  const p = { durationYears: 3, startAge: 66, targetAnnual: 29858, targetSchedule: [29858, 29858, 29858], spAnnual: 12548, spStartYear: 0, spFirstYearRatioTaxYear: 5 / 12, year0Months: 5,
    pnvCfg: { accessMethod: 'ufpls', pa: 12570, brl: 50270, hrl: 125140 } };
  const cones = { income: { p50: [12017, 28840, 28840], p10: [12017, 28840, 28840] } };
  it('a way that draws (Pots & Valves): 28,840 a year, year 0 for its months (was 29,858 and 12,441)', () => {
    const rows = incomeLayersRows({ strategyId: 'pots-and-valves', cones }, p);
    expect(Math.round(rows[1].need)).toBe(28840);
    expect(Math.abs(rows[0].need - 12017)).toBeLessThanOrEqual(2);
  });
  it('a way that buys its income pays the figure as held: 29,858', () => {
    const rows = incomeLayersRows({ strategyId: 'floor-the-schedule', cones: { income: { p50: [12441, 29858, 29858], p10: [12441, 29858, 29858] } } }, p);
    expect(Math.round(rows[1].need)).toBe(29858);
  });
});

describe('Month by month\'s set-up says which year its figure is for', () => {
  const S = MONTH.setUp.suggestion;
  it('never "raised to this year\'s prices" for a figure that is not a price rise', () => {
    expect(JSON.stringify(S)).not.toMatch(/this year’s prices/);
    const lead = S.scheduleLead.replace(/\{year\}/g, '2026/27');
    expect(S['budget-schedule'].replace('{lead}', lead).replace('{amount}', '£28,367')).toBe('Your plan’s income for 2026/27, with the income that comes in anyway in 2026/27: £28,367 a year before tax.');
    expect(S.scheduleLeadPrices).toContain('raised with prices since the plan began');
  });
});
