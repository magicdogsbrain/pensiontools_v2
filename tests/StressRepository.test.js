import { describe, it, expect, vi } from 'vitest';

// Avoid pulling in real Firebase at import time.
vi.mock('../src/firebase/index.js', () => ({
  isFirebaseConfigured: () => false,
  isLoggedIn: () => false
}));

import { createSimulationConfigFromSettings } from '../src/storage/StressRepository.js';

const base = {
  equityMin: 600000, bondMin: 480000, cashTarget: 120000,
  duration: 30, baseSalary: 59450, other: 0,
  pa: 12570, brl: 50270, hrl: 125140, taxMode: 'inflates',
  protectionMult: 0.8, consecutiveLimit: 3, disableProtection: false,
  hodlEnabled: false, hodlValue: 0
};

describe('createSimulationConfigFromSettings — State Pension wiring', () => {
  it('BUG FIX: legacy statePension/statePensionYear are honoured when no date is set', () => {
    // The default stress settings ship statePension:12000/statePensionYear:12 and no
    // spStartDate. Previously the builder forced spStartYear:999, so the sim's new-format
    // branch won for every run and the £12k SP was silently dropped.
    const cfg = createSimulationConfigFromSettings({}, {
      ...base, statePension: 12000, statePensionYear: 12
    });
    expect(cfg.spStartYear).toBeUndefined();      // no new-format field → legacy branch runs
    expect(cfg.statePension).toBe(12000);
    expect(cfg.statePensionYear).toBe(12);
  });

  it('uses date-based SP when spStartDate + spWeeklyAmount are set', () => {
    const cfg = createSimulationConfigFromSettings({}, {
      ...base, spStartDate: '6 April 2040', spWeeklyAmount: 230
    });
    expect(cfg.spWeeklyAmount).toBe(230);
    expect(cfg.spStartYear).toBeTypeOf('number');
    expect(cfg.statePension).toBeUndefined();     // legacy fields not used
  });

  it('REGRESSION: parses the dash format "21-4-2037" (the optimizer bug) → SP not dropped', () => {
    // The optimizer used a separate inline parser (parseSpDate) that had no dash-format
    // branch, so "21-4-2037" → null → spStartYear:999 → State Pension silently dropped,
    // scoring the current allocation far below the headline Monte Carlo. The shared
    // builder uses parseStatePensionDate, which handles it.
    const cfg = createSimulationConfigFromSettings({}, {
      ...base, spStartDate: '21-4-2037', spWeeklyAmount: 230
    });
    expect(cfg.spWeeklyAmount).toBe(230);
    expect(cfg.spStartYear).toBeTypeOf('number');
    expect(cfg.spStartYear).toBeLessThan(999); // not the "dropped" sentinel
  });

  it('means no SP when neither date-based nor legacy fields are set', () => {
    const cfg = createSimulationConfigFromSettings({}, { ...base });
    // legacy fallback with no legacy fields → statePensionYear sentinel, statePension 0
    expect(cfg.statePension).toBe(0);
    expect(cfg.spStartYear).toBeUndefined();
  });
});
