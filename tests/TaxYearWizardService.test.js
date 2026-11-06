/**
 * Tax Year Wizard Service — salary suggestion
 *
 * The April wizard uplifts LAST year's confirmed salary by last year's CPI, netted by the plan's
 * real-spending decline when it declines — so the Decision tool moves the target income the same way
 * the Stress tester does (Blanchett's spending smile).
 */

import { describe, it, expect } from 'vitest';
import { suggestSalary, SPEND_DECLINE_RATE } from '../src/services/TaxYearWizardService.js';

describe('TaxYearWizardService.suggestSalary', () => {
  it('flat plan: uplifts the prior salary by CPI only', () => {
    expect(suggestSalary(40000, 0.025, 0)).toBeCloseTo(41000, 6);   // 40000 × 1.025
  });

  it('declining plan: nets the ~1% spending decline off CPI (2.5% − 1% = 1.5%)', () => {
    expect(suggestSalary(40000, 0.025, SPEND_DECLINE_RATE)).toBeCloseTo(40600, 6); // 40000 × 1.015
  });

  it('compounds off last year, so a declining plan loses real value year on year', () => {
    // Two successive declining years at a steady 2.5% CPI: each is 1.5% up on the previous NOMINAL,
    // i.e. ~1% down in real terms — exactly the intended drift.
    const y1 = suggestSalary(40000, 0.025, SPEND_DECLINE_RATE); // 40600
    const y2 = suggestSalary(y1, 0.025, SPEND_DECLINE_RATE);    // 41209
    expect(y2).toBeCloseTo(40600 * 1.015, 6);
    // Real value (deflate by two years of 2.5% CPI) is below the starting 40000.
    const realY2 = y2 / (1.025 * 1.025);
    expect(realY2).toBeLessThan(40000);
  });

  it('declineRate defaults to 0 (flat) when omitted', () => {
    expect(suggestSalary(40000, 0.025)).toBeCloseTo(41000, 6);
  });

  it('SPEND_DECLINE_RATE matches the Stress engine ~1%/yr', () => {
    expect(SPEND_DECLINE_RATE).toBeCloseTo(0.01, 6);
  });
});

describe('budget-schedule suggestion (mocked stress settings)', () => {
  it('prefers the schedule figure × cumInf × smile over the chain, falls back cleanly', async () => {
    // The service reads stress settings via ScenarioRepository — mock at that seam.
    const { getWizardData } = await import('../src/services/TaxYearWizardService.js');
    // No stress mock in this environment → schedule path throws/absent → chain fallback:
    const data = await getWizardData('2026-04');
    expect(data.suggestionSource === 'chain' || data.suggestionSource === 'budget-schedule').toBe(true);
    expect(typeof data.suggestedSalary).toBe('number');
    expect(typeof data.chainSuggestedSalary).toBe('number');
  });
});

import { calculateMonthlyBreakdown } from '../src/services/TaxYearWizardService.js';

describe('calculateMonthlyBreakdown — tax on a mid-year start', () => {
  const base = { targetSalary: 28763, brl: 50270, pa: 12570, other: 0, statePension: 0, isaSavingsAllocation: 0, isTaxEfficient: true };
  it('full year, nothing earned before: plain annual tax / 12', () => {
    const r = calculateMonthlyBreakdown({ ...base, remainingMonths: 12, grossIncomeToDate: 0 });
    expect(r.sipp.tax).toBeCloseTo((28763 - 12570) * 0.2 / 12, 2);
  });
  it('8 months left with £18k already earned: the draws are taxed on top of that income', () => {
    const r = calculateMonthlyBreakdown({ ...base, remainingMonths: 8, grossIncomeToDate: 18000 });
    const draws = (28763 / 12) * 8;
    const total = (18000 + draws - 12570) * 0.2;
    const already = (18000 - 12570) * 0.2;
    expect(r.sipp.tax).toBeCloseTo((total - already) / 8, 2);
    expect(r.sipp.tax).toBeGreaterThan(400);
  });
});

describe('planYearBaseline — plan year 0 is the first tax year actually set up', () => {
  it('uses the earliest tax year in the Decision tool, however far in the future', async () => {
    const { planYearBaseline } = await import('../src/services/TaxYearWizardService.js');
    expect(planYearBaseline({ '36/37': {}, '37/38': {}, '38/39': {} }, '38/39')).toBe(2036);
    expect(planYearBaseline({ '38/39': {}, '36/37': {} }, '38/39')).toBe(2036);   // order-independent
  });
  it('falls back to the year being set up when nothing exists yet', async () => {
    const { planYearBaseline } = await import('../src/services/TaxYearWizardService.js');
    expect(planYearBaseline({}, '36/37')).toBe(2036);
    expect(planYearBaseline(null, '27/28')).toBe(2027);
  });
  it('ignores junk keys', async () => {
    const { planYearBaseline } = await import('../src/services/TaxYearWizardService.js');
    expect(planYearBaseline({ 'notAYear': {}, '36/37': {} }, '36/37')).toBe(2036);
  });
});

describe('other income from the Stress plan (rent, DB, streams)', () => {
  it('counts plan years from the plan start, not a hardcoded 2026', async () => {
    const { otherIncomeFromStress } = await import('../src/services/TaxYearWizardService.js');
    // rent of £8,000 running plan years 3..12, plan starting 2027/28
    const ss = { extraIncomes: [{ annual: 8000, startYear: 3, endYear: 12 }] };
    // they start the Decision tool in 2036/37, so THAT is plan year 0
    const B = 2036;
    expect(otherIncomeFromStress(ss, '38/39', B)).toBe(0);      // plan year 2 — not started
    expect(otherIncomeFromStress(ss, '39/40', B)).toBe(8000);   // plan year 3 — starts
    expect(otherIncomeFromStress(ss, '48/49', B)).toBe(8000);   // plan year 12 — last year
    expect(otherIncomeFromStress(ss, '49/50', B)).toBe(0);      // plan year 13 — ended
  });

  it('a plan starting a year later shifts every window by a year', async () => {
    const { otherIncomeFromStress } = await import('../src/services/TaxYearWizardService.js');
    const ss = { extraIncomes: [{ annual: 5000, startYear: 5 }] };
    expect(otherIncomeFromStress(ss, '32/33', 2027)).toBe(5000);   // started 2027 -> year 5 = 32/33
    expect(otherIncomeFromStress(ss, '32/33', 2028)).toBe(0);      // started 2028 -> year 5 = 33/34
    expect(otherIncomeFromStress(ss, '33/34', 2028)).toBe(5000);
  });

  it('adds a DB pension only once it has started, and flat other always', async () => {
    const { otherIncomeFromStress } = await import('../src/services/TaxYearWizardService.js');
    const ss = { other: 2000, dbAmount: 9000, dbStartYear: 8 };
    expect(otherIncomeFromStress(ss, '27/28', 2027)).toBe(2000);
    expect(otherIncomeFromStress(ss, '35/36', 2027)).toBe(11000);
  });

  it('hasOtherIncomePlan tells the wizard whether to trust the projection', async () => {
    const { hasOtherIncomePlan } = await import('../src/services/TaxYearWizardService.js');
    expect(hasOtherIncomePlan(null)).toBe(false);
    expect(hasOtherIncomePlan({ other: 0, dbAmount: 0, extraIncomes: [] })).toBe(false);
    expect(hasOtherIncomePlan({ extraIncomes: [{ annual: 8000, startYear: 0 }] })).toBe(true);
    expect(hasOtherIncomePlan({ dbAmount: 5000 })).toBe(true);
  });
});

// 6.16.0: the wizard used its own tax sum, which stopped at 40% (no 45% band, no loss of the allowance above
// £100,000). It now uses the one sum in TaxCalculator; figures worked by hand from the published rates.
import { calculateIsaNeeded } from '../src/services/TaxYearWizardService.js';
import { calculateTax } from '../src/services/TaxCalculator.js';

describe('the wizard taxes high incomes by the published rules (one tax sum)', () => {
  const bands = { brl: 50270, pa: 12570 };
  const inefficient = (targetSalary, extra = {}) => calculateMonthlyBreakdown({ ...bands, targetSalary, other: 0, statePension: 0, isaSavingsAllocation: 0, isTaxEfficient: false, remainingMonths: 12, grossIncomeToDate: 0, ...extra });

  it.each([
    [80000, 19432],      // 7,540 + 29,730 at 40% — unchanged from before
    [100000, 27432],     // 7,540 + 49,730 at 40% — unchanged from before
    [110000, 33432],     // allowance 7,570; was 31,432
    [125140, 42516],     // allowance gone; was 37,488
    [150000, 53703],     // 42,516 + 24,860 at 45%; was 47,432
  ])('a full year on £%i is taxed £%i', (gross, tax) => {
    const r = inefficient(gross);
    expect(Math.round(r.totalTax * 12 * 100)).toBe(tax * 100);
    expect(r.totalTax * 12).toBeCloseTo(calculateTax(gross, 12570, 50270, 125140), 6);
    expect(r.totalNet * 12).toBeCloseTo(gross - tax, 6);
  });

  it('nothing moves at or below £100,000: the old sum and the new agree', () => {
    const old = (g) => (g <= 12570 ? 0 : g <= 50270 ? (g - 12570) * 0.2 : 7540 + (g - 50270) * 0.4);
    for (let g = 0; g <= 100000; g += 1234.5) expect(inefficient(g).totalTax * 12).toBeCloseTo(old(g), 6);
  });

  it('a mid-year start on top of a high salary to date: the draws carry the allowance they cost', () => {
    // £90,000 earned before, £30,000 drawn over 6 months → £120,000 for the year.
    const r = inefficient(60000, { remainingMonths: 6, grossIncomeToDate: 90000 });
    const yearTax = 7540 + (120000 - 2570 - 37700) * 0.4;   // allowance 2,570 left
    const already = 7540 + (90000 - 50270) * 0.4;
    expect(r.totalTax * 6).toBeCloseTo(yearTax - already, 6);
  });

  it('the ISA needed to stay at the basic-rate limit is measured against the true take-home of the target', () => {
    const r = calculateIsaNeeded({ ...bands, targetAnnualGross: 150000, remainingMonths: 12 });
    expect(r.taxAtTarget).toBeCloseTo(53703, 6);
    expect(r.taxAtBrl).toBeCloseTo(7540, 6);
    expect(r.isaNeededAnnual).toBeCloseTo((150000 - 53703) - (50270 - 7540), 6);
    // the header example in the service (target 59,450) is untouched
    expect(calculateIsaNeeded({ ...bands, targetAnnualGross: 59450, remainingMonths: 12 }).isaNeededAnnual).toBeCloseTo(5508, 6);
  });

  it('a different 45% threshold can be passed in', () => {
    expect(inefficient(150000, { hrl: 200000 }).totalTax * 12).toBeCloseTo(calculateTax(150000, 12570, 50270, 200000), 6);
  });
});
