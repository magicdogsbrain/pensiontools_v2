import { describe, it, expect } from 'vitest';
import { activeEquity, setEquityOverride, equityDrawdown, isEquityStale } from '../src/services/EquityIndex.js';

describe('EquityIndex', () => {
  it('bundled snapshot has a level and an all-time high', () => {
    const e = activeEquity();
    expect(e.level).toBeGreaterThan(0);
    expect(e.ath).toBeGreaterThanOrEqual(e.level);
  });
  it('drawdown is level/ath - 1 and the override wins', () => {
    setEquityOverride({ level: 70, ath: 100, generated_at: new Date().toISOString() });
    expect(equityDrawdown()).toBeCloseTo(-0.30, 6);
    expect(isEquityStale()).toBe(false);
    setEquityOverride(null);
  });
});
