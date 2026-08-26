/**
 * Plan lock lifecycle — one notion: a plan locks when the first record depends on its settings,
 * unlock is always possible and archives the plan of record, entries recorded under earlier
 * settings are identifiable, and a duplicate is a draft.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

const store = { settings: { baseSalary: 40000, duration: 30, equityMin: 300000, bondMin: 150000, cashTarget: 50000 }, history: [], taxYears: {}, por: null, archive: [] };

vi.mock('../src/storage/DecisionRepository.js', () => ({
  getDecisionSettingsAsync: async () => ({ ...store.settings }),
  saveDecisionSettings: async (s) => { store.settings = { ...store.settings, ...s }; },
  getHistoryAsync: async () => store.history.slice(),
  getAllTaxYearsAsync: async () => store.taxYears,
  decisionSettingsChecksum: (s) => { if (!s) return ''; const { locked, lockedAt, lockedBy, unlockedAt, unlockCount, ...rest } = s; return JSON.stringify(rest); }
}));
vi.mock('../src/storage/ScenarioRepository.js', () => ({
  getActivePlanOfRecord: async () => store.por,
  saveActivePlanOfRecord: async (p) => { store.por = p; },
  archivePlanOfRecord: async () => { if (store.por) store.archive.push(store.por); store.por = null; }
}));
vi.mock('../src/services/DrawdownService.js', () => ({ generateDrawdownSchedule: () => [{ year: 0, sippDraw: 1, tax: 0, isaDraw: 0, isaBalance: 0, spendable: 1 }] }));
vi.mock('../src/services/GlidepathService.js', () => ({ generateGlidepathSchedule: () => [{ year: 0, totalMin: 1 }] }));

import { lockPlanIfNeeded, unlockPlan, planDependents, planHasRecords } from '../src/services/PlanLock.js';

const sum = (s) => { const { locked, lockedAt, lockedBy, unlockedAt, unlockCount, ...rest } = s; return JSON.stringify(rest); };

describe('plan lock lifecycle', () => {
  beforeEach(() => { store.settings = { baseSalary: 40000, duration: 30 }; store.history = []; store.taxYears = {}; store.por = null; store.archive = []; });

  it('a draft with no records stays a draft and has nothing depending on it', async () => {
    expect(await planHasRecords()).toBe(false);
    const d = await planDependents();
    expect(d.locked).toBe(false); expect(d.entriesUnderCurrent).toBe(0); expect(d.taxYearsSetUp).toEqual([]);
  });

  it('the first record locks the plan and freezes a plan of record; a second call is a no-op', async () => {
    store.history.push({ date: '2027-05', settingsChecksum: sum(store.settings) });
    expect(await lockPlanIfNeeded('first monthly entry')).toBe(true);
    expect(store.settings.locked).toBe(true);
    expect(store.settings.lockedBy).toBe('first monthly entry');
    expect(store.por).toBeTruthy();
    const porAt = store.por.savedAt;
    expect(await lockPlanIfNeeded()).toBe(false);
    expect(store.por.savedAt).toBe(porAt);
  });

  it('unlock archives the plan of record, clears the lock, and does NOT orphan entries by itself', async () => {
    store.history.push({ date: '2027-05', settingsChecksum: sum(store.settings) }, { date: '2027-06', settingsChecksum: sum(store.settings) });
    await lockPlanIfNeeded();
    await unlockPlan();
    expect(store.settings.locked).toBe(false);
    expect(store.settings.unlockCount).toBe(1);
    expect(store.archive.length).toBe(1); expect(store.por).toBeNull();
    const d = await planDependents();
    expect(d.entriesUnderCurrent).toBe(2);   // unlock bookkeeping never moves the checksum
    expect(d.entriesUnderPrevious).toBe(0);
    expect(d.firstDate).toBe('2027-05'); expect(d.lastDate).toBe('2027-06');
  });

  it('changing a plan-defining setting after unlock marks earlier entries as "under previous settings"', async () => {
    store.history.push({ date: '2027-05', settingsChecksum: sum(store.settings) });
    await lockPlanIfNeeded(); await unlockPlan();
    store.settings.baseSalary = 45000;
    const d = await planDependents();
    expect(d.entriesUnderCurrent).toBe(0); expect(d.entriesUnderPrevious).toBe(1);
    expect(await planHasRecords()).toBe(true);   // so a Save re-locks
  });

  it('a set-up tax year counts as a dependent record', async () => {
    store.taxYears = { '27/28': { yearSetupComplete: true }, '28/29': { yearSetupComplete: false } };
    const d = await planDependents();
    expect(d.taxYearsSetUp).toEqual(['27/28']);
    expect(await planHasRecords()).toBe(true);
  });
});
