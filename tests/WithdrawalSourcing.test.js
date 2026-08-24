import { describe, it, expect } from 'vitest';
import { planSourcing } from '../src/services/WithdrawalSourcing.js';
import { protectionMultForStreak, PROTECTION_ESCALATE_MONTHS } from '../src/services/ProtectionStrategy.js';

const base = { equity: 300000, bond: 200000, cash: 50000, eqMin: 250000, bdMin: 180000, csTarget: 40000, inProtection: false };

describe('planSourcing — the shared valves', () => {
  it('healthy month: proportional growth draw + cash refill from remaining surplus', () => {
    const r = planSourcing({ ...base, cash: 20000, draw: 3000 });
    expect(r.source).toBe('Growth');
    expect(r.fromEquity + r.fromBond).toBeCloseTo(3000, 6);
    expect(r.fromEquity / r.fromBond).toBeCloseTo(50000 / 20000, 6); // surplus proportions
    expect(r.replenish).toBeGreaterThan(0);                          // cash below target refills
    expect(r.replenish).toBeLessThanOrEqual((40000 - 20000) * 0.3 + 1e-9);
  });

  it('MIXED month (the Guyton-Klinger cascade): growth part-funds, cash covers the rest', () => {
    const r = planSourcing({ ...base, equity: 251000, bond: 181000, draw: 5000 });
    expect(r.source).toBe('Mixed');
    expect(r.fromEquity + r.fromBond).toBeCloseTo(2000, 6);   // all the surplus, no more
    expect(r.fromCash).toBeCloseTo(3000, 6);                  // remainder cascades
    expect(r.shortfall).toBe(0);
  });

  it('protection: growth untouched even with surplus; cash pays', () => {
    const r = planSourcing({ ...base, inProtection: true, draw: 3000 });
    expect(r.fromEquity + r.fromBond).toBe(0);
    expect(r.fromCash).toBeCloseTo(3000, 6);
    expect(r.source).toBe('Cash');
  });

  it('overweight-ranked spill: the sleeve that held its value sells first', () => {
    // Diversifiers at 2× their flat target (they rallied) vs bonds just at floor:
    const r = planSourcing({ ...base, cash: 1000, equity: 250000, bond: 180000,
      diversifier: 40000, diversifierTarget: 20000, draw: 5000 });
    expect(r.fromCash).toBeCloseTo(1000, 6);
    expect(r.fromDiversifier).toBeCloseTo(4000, 6);           // most overweight pays
    expect(r.fromEquity + r.fromBond).toBe(0);
  });

  it('bonds sell before depressed equity when bonds are the overweight sleeve', () => {
    // No diversifiers; equity crashed BELOW its floor (ratio <1), bonds above theirs.
    const r = planSourcing({ ...base, cash: 0, equity: 150000, eqMin: 250000,
      bond: 200000, bdMin: 180000, draw: 6000, inProtection: true });
    expect(r.fromBond).toBeCloseTo(6000, 6);
    expect(r.fromEquity).toBe(0);
  });

  it('HODL is strictly last, then shortfall', () => {
    const r = planSourcing({ equity: 0, bond: 0, cash: 500, eqMin: 0, bdMin: 0, csTarget: 0,
      diversifier: 0, hodl: 1000, inProtection: false, draw: 2000 });
    expect(r.fromCash).toBe(500);
    expect(r.fromHodl).toBe(1000);
    expect(r.shortfall).toBeCloseTo(500, 6);
    expect(r.source).toBe('HODL');
  });
});

describe('protectionMultForStreak — G-K-aligned escalation', () => {
  it('first year of an episode cuts half as deep; persistent stress reaches the configured cut', () => {
    expect(protectionMultForStreak(0, 0.8)).toBeCloseTo(0.9, 9);
    expect(protectionMultForStreak(PROTECTION_ESCALATE_MONTHS - 1, 0.8)).toBeCloseTo(0.9, 9);
    expect(protectionMultForStreak(PROTECTION_ESCALATE_MONTHS, 0.8)).toBeCloseTo(0.8, 9);
    expect(protectionMultForStreak(0, 0.7)).toBeCloseTo(0.85, 9);
  });
});
