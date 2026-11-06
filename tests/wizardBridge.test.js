import { describe, it, expect, vi } from 'vitest';
vi.mock('../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
// A Stress plan as the wizard sees it (Alex, fictional): retired, plan starts 2027/28, £20k bridge cash to April,
// first step £46,000 including a £5,200 DB. Mocked at the one seam the service reads Stress settings through.
const alexStress = {
  currentAge: 62, currentAgeAsOf: '2026-03-01', retired: true, firstTaxYear: 2027, shapeAgeNow: 64,
  spStartDate: '12 June 2030', spWeeklyAmount: 230, baseSalary: 46000, duration: 30, dbAmount: 5200,
  incomeShape: 'phases', incomeSteps: [{ fromAge: 64, amount: 46000 }, { fromAge: 67, amount: 39000 }],
  targetSchedule: [46000, 46000, 46000, 39000, 39000],
  strategyId: 'gilt-rotation', strategyParams: { cashYears: 2, bridgeCash: 20000 }
};
vi.mock('../src/storage/ScenarioRepository.js', async (orig) => ({ ...(await orig()), getActiveStressSettings: async () => alexStress }));
import { getWizardData } from '../src/services/TaxYearWizardService.js';

// Re-written in 6.51.0 (research/plan-start.md §2 D, §7): these bridge years are a start CHOSEN for later — the plan's
// income starts 2027/28 although work stopped earlier — which is the only way a retiree's months come before year 0 now.
// Someone whose year 0 is the tax year they stopped in has plan years where these were bridge years: the block after.
describe('tax-year wizard: the years before a later start (6.4.0; a chosen later start since 6.51.0)', () => {
  it('September 2026 is before the start: the first step is suggested, with the cover of the cash set aside', async () => {
    const d = await getWizardData('2026-09');
    expect(d.taxYear).toBe('26/27');
    expect(d.planStartYear).toBe(2027);
    expect(d.planYear).toBe(-1);
    expect(d.bridgeYear).toBe(true);
    expect(d.remainingMonths).toBe(7);   // September's payment plus October–March
    expect(d.suggestionSource).toBe('bridge');
    expect(d.suggestedSalary).toBe(46000);
    // £20,000 bridge cash at (46,000 − 5,200 DB) / 12 = £3,400 a month from the pot covers 5 payments
    expect(d.bridgeCoverMonths).toBe(5);
  });
  it('"this month already paid" = plan from October: 6 payments to come, income to date includes September', async () => {
    const d = await getWizardData('2026-10');
    expect(d.remainingMonths).toBe(6);
    expect(d.bridgeYear).toBe(true);
    expect(d.suggestedSalary).toBe(46000);
  });
  it('April 2027 is plan year 0: the first step, from the schedule', async () => {
    const d = await getWizardData('2027-04');
    expect(d.planYear).toBe(0);
    expect(d.bridgeYear).toBe(false);
    expect(d.suggestionSource).toBe('budget-schedule');
    expect(d.suggestedSalary).toBe(46000);
  });
  it('April 2030 reads plan year 3 — the £39,000 step lands in the right April', async () => {
    const d = await getWizardData('2030-04');
    expect(d.planYear).toBe(3);
    expect(d.suggestedSalary).toBeGreaterThan(39000);          // uplifted by the assumed CPI chain
    expect(d.suggestedSalary).toBeLessThan(46000);
  });
});

describe('a year 0 in an earlier tax year (6.51.0): the months are plan months, on the schedule path', () => {
  it('stopped in October 2025 with year 0 = 2025/26: September 2026 is plan year 1, not before the start', async () => {
    const saved = { firstTaxYear: alexStress.firstTaxYear, shapeAgeNow: alexStress.shapeAgeNow, stoppedWork: alexStress.stoppedWork };
    Object.assign(alexStress, { firstTaxYear: 2025, shapeAgeNow: 62, stoppedWork: '2025-10' });
    try {
      const d = await getWizardData('2026-09');
      expect(d.planStartYear).toBe(2025);
      expect(d.planYear).toBe(1);
      expect(d.bridgeYear).toBe(false);
      expect(d.bridgeCoverMonths).toBeNull();
      expect(d.suggestionSource).toBe('budget-schedule');   // the plan's own schedule for year 1, not the first step's cover
    } finally { Object.assign(alexStress, saved); }
  });
});

describe('run-up cover months count income streams running at year 0 (6.11.4)', () => {
  it('rent of £12,000 a year lowers what the cash to April has to cover', async () => {
    alexStress.extraIncomes = [{ label: 'rent', annual: 12000, startYear: 0, endYear: 3 }];
    try {
      const d = await getWizardData('2026-09');
      // £20,000 at (46,000 − 5,200 DB − 12,000 rent) / 12 = £2,400 a month covers 8 payments (5 without the rent)
      expect(d.bridgeCoverMonths).toBe(8);
    } finally { delete alexStress.extraIncomes; }
  });
});
