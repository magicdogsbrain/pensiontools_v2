import { describe, it, expect, vi } from 'vitest';
vi.mock('../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { otherIncomeFromStress } from '../src/services/TaxYearWizardService.js';
describe('wizard other-income prefill from the Stress plan', () => {
  const ss = { other: 0, dbAmount: 8000, dbStartYear: 7, extraIncomes: [{ annual: 12000, startYear: 0, endYear: 2 }] };
  // Plan year 0 is now passed in explicitly (the first tax year the user set up in the Decision
  // tool) rather than assumed to be 2026/27. This user started in 26/27, so the windows are
  // unchanged from before the fix.
  const B = 2026;
  it('26/27 and 28/29 carry the part-time £12k; 29/30 nothing; 33/34 the DB £8k', () => {
    expect(otherIncomeFromStress(ss, '26/27', B)).toBe(12000);
    expect(otherIncomeFromStress(ss, '28/29', B)).toBe(12000);
    expect(otherIncomeFromStress(ss, '29/30', B)).toBe(0);
    expect(otherIncomeFromStress(ss, '33/34', B)).toBe(8000);
    expect(otherIncomeFromStress(null, '26/27', B)).toBe(0);
  });

  it('the same plan started in 2036 shifts every window ten years', () => {
    const B36 = 2036;
    expect(otherIncomeFromStress(ss, '36/37', B36)).toBe(12000);
    expect(otherIncomeFromStress(ss, '38/39', B36)).toBe(12000);
    expect(otherIncomeFromStress(ss, '39/40', B36)).toBe(0);
    expect(otherIncomeFromStress(ss, '43/44', B36)).toBe(8000);
  });
});
