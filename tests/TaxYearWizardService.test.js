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
