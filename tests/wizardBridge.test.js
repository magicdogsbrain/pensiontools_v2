import { describe, it, expect, vi } from 'vitest';
vi.mock('../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
// Chris's Stress plan as the wizard sees it: retired, plan starts 2027/28, £50k bridge cash to April,
// first step £83,650. Mocked at the one seam the service reads Stress settings through.
const chrisStress = {
  currentAge: 56, currentAgeAsOf: '2026-09-09', retired: true, firstTaxYear: 2027, shapeAgeNow: 57,
  spStartDate: '21 April 2037', spWeeklyAmount: 230, baseSalary: 83650, duration: 35,
  incomeShape: 'phases', incomeSteps: [{ fromAge: 57, amount: 83650 }, { fromAge: 60, amount: 68650 }],
  targetSchedule: [83650, 83650, 83650, 68650, 68650],
  strategyId: 'gilt-rotation', strategyParams: { cashYears: 3, bridgeCash: 50000 }
};
vi.mock('../src/storage/ScenarioRepository.js', async (orig) => ({ ...(await orig()), getActiveStressSettings: async () => chrisStress }));
import { getWizardData } from '../src/services/TaxYearWizardService.js';

describe('tax-year wizard: bridge years before the plan starts (6.4.0)', () => {
  it('September 2026 is a bridge year: bridge cash spread over the 7 months left, annualised', async () => {
    const d = await getWizardData('2026-09');
    expect(d.taxYear).toBe('26/27');
    expect(d.planStartYear).toBe(2027);
    expect(d.planYear).toBe(-1);
    expect(d.bridgeYear).toBe(true);
    expect(d.remainingMonths).toBe(7);
    expect(d.suggestionSource).toBe('bridge');
    expect(d.suggestedSalary).toBe(Math.round(50000 * 12 / 7));   // ≈ £85,714
  });
  it('April 2027 is plan year 0: the first step, from the schedule', async () => {
    const d = await getWizardData('2027-04');
    expect(d.planYear).toBe(0);
    expect(d.bridgeYear).toBe(false);
    expect(d.suggestionSource).toBe('budget-schedule');
    expect(d.suggestedSalary).toBe(83650);
  });
  it('April 2030 reads plan year 3 — the £68,650 step lands in the right April', async () => {
    const d = await getWizardData('2030-04');
    expect(d.planYear).toBe(3);
    expect(d.suggestedSalary).toBeGreaterThan(68650);          // uplifted by the assumed CPI chain
    expect(d.suggestedSalary).toBeLessThan(83650);
  });
});
