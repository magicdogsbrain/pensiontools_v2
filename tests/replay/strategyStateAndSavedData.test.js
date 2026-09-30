/**
 * Bug replays — what is saved with a plan: each strategy's own inputs, the lock's hand-over to the Decision tool,
 * the save itself, and the household reading of "retired". Ids are from research/bug-replay-catalogue.md.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

// Firestore at the seam FirestoreService writes through: `updateDoc` is whatever the test makes it.
const fs = vi.hoisted(() => ({ updateDoc: null, calls: 0 }));
vi.mock('firebase/firestore', () => ({
  doc: (...path) => ({ path }), updateDoc: (...a) => { fs.calls++; return fs.updateDoc(...a); },
  getDoc: async () => ({ exists: () => false }), setDoc: async () => {}, deleteDoc: async () => {}, collection: () => ({}), getDocs: async () => ({ docs: [] }),
  addDoc: async () => ({ id: 'x' }), writeBatch: () => ({ commit: async () => {} }), query: () => ({}), where: () => ({})
}));
vi.mock('../../src/firebase/config.js', () => ({ db: {}, auth: {}, app: {}, isFirebaseConfigured: () => true, default: {} }));
vi.mock('../../src/firebase/AuthService.js', () => ({ getCurrentUser: () => ({ uid: 'qa' }), isGuest: () => false, isLoggedIn: () => true }));

import { saveScenario } from '../../src/firebase/FirestoreService.js';
import { switchStrategy, activeParams, sortLegacyParams } from '../../src/services/StrategyState.js';
import { seedDecisionFromStress } from '../../src/storage/ScenarioRepository.js';
import { householdIncomeTimeline } from '../../src/services/HouseholdService.js';
import { at } from './_replay.js';

afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); });

describe('saving', () => {
  it('B11 — a write that never settles fails after 20 seconds and one retry; it does not say "Saving…" for ever', async () => {
    vi.useFakeTimers();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    fs.calls = 0;
    fs.updateDoc = () => new Promise(() => {});                    // the stalled write the audit saw
    let outcome = 'pending';
    saveScenario('plan1', { 'stressTool.settings': { duration: 30 } }).then(() => { outcome = 'saved'; }, (e) => { outcome = e.message; });
    await vi.advanceTimersByTimeAsync(19000);
    expect(outcome).toBe('pending');
    await vi.advanceTimersByTimeAsync(2000);                       // 21 s: the first attempt has timed out, the retry is in flight
    expect(fs.calls).toBe(2);
    expect(outcome).toBe('pending');
    await vi.advanceTimersByTimeAsync(20000);                      // 41 s: the retry has timed out too
    expect(outcome).toMatch(/Saving took too long/);
  });

  it('B11 — a write that fails once and then succeeds is saved', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    fs.calls = 0;
    fs.updateDoc = () => (fs.calls === 1 ? Promise.reject(new Error('unavailable')) : Promise.resolve());
    await expect(saveScenario('plan1', { name: 'x' })).resolves.toBeUndefined();
    expect(fs.calls).toBe(2);
  });
});

describe('each strategy keeps its own inputs', () => {
  const funds = [{ ticker: 'VWRP', value: 600000, wrapper: 'SIPP' }, { ticker: 'IGLT', value: 300000, wrapper: 'SIPP' }];
  // A plan that tried Floor-to-an-age, then the ladders: one flat bag holding every strategy's dials.
  const saved = { strategyId: 'floor-to-age', allocMode: 'funds', taggedFunds: funds, equityMin: 300000, bondMin: 800000, cashTarget: 79422,
    strategyParams: { floorToAge: 80, borrowedFloor: { soldAt: '2026-09-01', tidms: ['T40'] }, sippTotal: 1179422, isaTotal: 60000, essentialsAnnual: 40000, cashYears: 3, rotateCutAge: 75 } };

  it('R6.13.0-b — nothing from a deselected strategy reaches the one you switch to', () => {
    const gilt = switchStrategy(saved, 'full-il-gilt', { savedAt: '2026-09-16T10:00:00.000Z' });
    expect(Object.keys(gilt.strategyParams).sort()).toEqual(['isaTotal', 'sippTotal']);     // only the shared pot totals travel
    const pv = switchStrategy(saved, 'pots-and-valves', { savedAt: 't' });
    expect(pv.strategyParams).toEqual({});                                                 // Pots & Valves runs on the allocation alone
    expect(activeParams(saved)).toEqual({ floorToAge: 80, borrowedFloor: saved.strategyParams.borrowedFloor, sippTotal: 1179422, isaTotal: 60000 });
  });

  it('R6.13.0-c — adopting Pots & Valves no longer loses the fund list: switching back restores it and the dials', () => {
    const pv = switchStrategy(saved, 'pots-and-valves', { savedAt: 't1' });
    expect(pv.taggedFunds).toEqual([]);                            // P&V starts on its own (empty) list…
    const back = switchStrategy(pv, 'floor-to-age', { savedAt: 't2' });
    expect(back.taggedFunds).toEqual(funds);                       // …and the old strategy's list is still there
    expect(back.allocMode).toBe('funds');
    expect(back.strategyParams.floorToAge).toBe(80);
  });

  it('R6.13.0-b — a plan saved before 6.13.0 has its one bag sorted into per-strategy backups, nothing dropped', () => {
    const sorted = sortLegacyParams(saved);
    expect(sorted.strategyState['full-il-gilt'].strategyParams).toMatchObject({ cashYears: 3 });
    expect(sorted.strategyState['gilt-rotation'].strategyParams).toMatchObject({ rotateCutAge: 75, cashYears: 3 });
    expect(sorted.strategyState['floor-and-flex'].strategyParams).toMatchObject({ essentialsAnnual: 40000 });
  });
});

describe('locking from the Stress tester', () => {
  // P5 itself was WIRING: the Lock button never called this function (index.html, lockPlanFromStress) — that needs the
  // browser layer. What is pinned here is the half the button relies on: given the Stress plan, the Decision settings
  // that come back are the plan's, whatever defaults were there before.
  it('P5-seed — handed the Stress plan, the Decision settings are the plan\'s own pots and floors, not the defaults', () => {
    // "QA Retiring now tight": a £380k cautious Buckets plan. The Decision side still held its creation defaults.
    const stress = { equityMin: 114000, bondMin: 171000, cashTarget: 95000, duration: 30, baseSalary: 22000, isaBalance: 20000, isaDrawdownStrategy: 'minimiseEarlyTax',
      spStartDate: '1 June 2033', spWeeklyAmount: 230, protectionMult: 0.8, strategyId: 'buckets-in-order', strategyParams: { bucketBand: 0.1 }, currentAge: 61, currentAgeAsOf: '2026-09-11', retired: true, firstTaxYear: 2026 };
    const defaults = { equityMin: 250000, bondMin: 200000, cashTarget: 50000, baseSalary: 30000, strategyId: 'pots-and-valves' };
    const seeded = seedDecisionFromStress(stress, defaults);
    expect([seeded.equityMin, seeded.bondMin, seeded.cashTarget]).toEqual([114000, 171000, 95000]);
    expect(seeded.baseSalary).toBe(22000);
    expect(seeded.isaBalance).toBe(20000);
    expect(seeded.spStartDate).toBe('1 June 2033');
    expect(seeded.strategyId).toBe('buckets-in-order');
    expect(seeded.protectionFactor).toBe(20);
    expect(seeded.firstTaxYear).toBe(2026);
  });
});

describe('household', () => {
  it('R6.12.5-a — someone already retired whose ladder starts next April is not "still working" this year', () => {
    const today = at(2026, 9, 16);
    const chris = { retired: true, currentAge: 56, currentAgeAsOf: '2026-09-16', shapeAgeNow: 57, baseSalary: 83650, duration: 35, spStartDate: '21 April 2037', spWeeklyAmount: 230 };
    const wendy = { retired: false, currentAge: 55, currentAgeAsOf: '2026-09-16', shapeAgeNow: 56, baseSalary: 30000, duration: 35, spStartDate: '1 June 2038', spWeeklyAmount: 230 };
    const rows = householdIncomeTimeline(chris, wendy, 3, today);
    expect(rows[0].workingA).toBe(false);
    expect(rows[0].needA).toBe(83650);             // his run-up need counts from today
    expect(rows[0].workingB).toBe(true);           // a partner who really is still working keeps "still working"
    expect(rows[0].needB).toBe(0);
    expect(rows[1].workingB).toBe(false);
  });
});
