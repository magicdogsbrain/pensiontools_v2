import { describe, it, expect, vi } from 'vitest';
vi.mock('../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { otherIncomeFromStress } from '../src/services/TaxYearWizardService.js';
describe('wizard other-income prefill from the Stress plan', () => {
  const ss = { other: 0, dbAmount: 8000, dbStartYear: 7, extraIncomes: [{ annual: 12000, startYear: 0, endYear: 2 }] };
  it('26/27 and 28/29 carry the part-time £12k; 29/30 nothing; 33/34 the DB £8k', () => {
    expect(otherIncomeFromStress(ss, '26/27')).toBe(12000);
    expect(otherIncomeFromStress(ss, '28/29')).toBe(12000);
    expect(otherIncomeFromStress(ss, '29/30')).toBe(0);
    expect(otherIncomeFromStress(ss, '33/34')).toBe(8000);
    expect(otherIncomeFromStress(null, '26/27')).toBe(0);
  });
});
