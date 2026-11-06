/**
 * Fixes from the 7 Sep 2026 QA audit (research/qa-audit-7-sep-2026.md). Each test pins the number
 * a user actually sees in the ranked comparison or the panel.
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));

import { createSimulationConfigFromSettings } from '../src/storage/StressRepository.js';
import { stressTestStrategy, planFromSettings } from '../src/strategies/stressTest.js';
import { formatCurrency } from '../src/utils/FormatUtils.js';

const base = {
  configured: true, duration: 30, other: 0, pa: 12570, brl: 50270, hrl: 125140, taxMode: 'inflates',
  protectionMult: 0.8, consecutiveLimit: 3, disableProtection: false, recoveryBuffer: 15000,
  hodlEnabled: false, hodlValue: 0, isaReturn: 0.03, spStartDate: '2036-04-06', spWeeklyAmount: 230,
  equityMin: 480000, bondMin: 240000, cashTarget: 80000, isaBalance: 0, baseSalary: 40000,
  incomeShape: 'phases', incomeSteps: [{ fromAge: 60, amount: 40000 }], shapeAgeNow: 60, currentAge: 60
};
const FAST = { mcRuns: 60, stride: 12 };
const plan = (settings) => { const cfg = createSimulationConfigFromSettings({}, settings); return { ...planFromSettings(settings, cfg), ...FAST }; };

describe('B4 — the Pots & Valves row is P&V even when the plan is saved on Buckets in order', () => {
  it('a Buckets plan\'s P&V and Buckets rows differ', () => {
    const p = plan({ ...base, strategyId: 'buckets-in-order' });
    expect(p.pnvCfg.sourcingMode).toBe('ordered');                         // the saved strategy's config
    const pnv = stressTestStrategy('pots-and-valves', p), bk = stressTestStrategy('buckets-in-order', p);
    expect(pnv.terminal.p50).not.toBeCloseTo(bk.terminal.p50, 0);
    const p2 = plan({ ...base, strategyId: 'pots-and-valves' });
    expect(stressTestStrategy('pots-and-valves', p2).terminal.p50).toBeCloseTo(pnv.terminal.p50, 0);   // same P&V whatever was saved
  });
});

describe('B7 — worst 12 months for bought strategies is the income received, not the bought amount', () => {
  it('a lump sum that pays a year does not read as £0 income', () => {
    const p = plan({ ...base, windfalls: [{ year: 5, amount: 150000 }] });
    expect(p.targetSchedule[5]).toBe(0);                                      // the bought schedule IS zero that year…
    const r = stressTestStrategy('floor-the-schedule', p);
    expect(r.affordable).toBe(true);
    expect(r.worst12.min).toBeGreaterThanOrEqual(39999);                      // …but the income is the full target
    const lr = stressTestStrategy('ladder-and-ratchet', p);
    if (lr.affordable) expect(lr.worst12.median).toBeGreaterThanOrEqual(39999);
  });
  it('a DB pension is income, not a discount on the worst year', () => {
    const p = plan({ ...base, dbAmount: 12000, dbStartYear: 0 });
    const r = stressTestStrategy('floor-the-schedule', p);
    expect(r.affordable).toBe(true);
    expect(r.worst12.min).toBeGreaterThanOrEqual(39999);                      // was £28,000
  });
});

describe('G4 — a State Pension the user never entered is flagged as an assumption', () => {
  it('flags the legacy default and says so in the P&V guarantee line', () => {
    const p = plan({ ...base, spStartDate: null, spWeeklyAmount: 0, statePension: 12000 });
    expect(p.spAssumed).toBe(true);
    expect(stressTestStrategy('pots-and-valves', p).guaranteedToAge).toMatch(/assumed/);
    expect(plan(base).spAssumed).toBe(false);
  });
});

describe('C1 — zero is £0, small amounts keep their pence', () => {
  it('formats', () => { expect(formatCurrency(0)).toBe('£0'); expect(formatCurrency(45.4)).toBe('£45.40'); expect(formatCurrency(32000)).toBe('£32,000'); });
});
