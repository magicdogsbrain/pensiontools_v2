/**
 * Without an account (guest mode, the tab's own store): a plan made from a seed goes where guest plans go today,
 * two saves give two plans (the one-plan gate and startGuest's clear-out are not on this path — Contract Q13), a
 * locked plan already in the tab is untouched but for its isActive flag, and the app's own load path then opens the
 * new plan WITHOUT writing anything back (must hold 2, through the real repositories rather than the functions alone).
 */
import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { enterGuestMode, isGuest } from '../../src/firebase/AuthService.js';
import { createScenario, setActiveScenarioDoc, deleteScenarioDoc, loadAllScenarios, clearGuestData } from '../../src/firebase/FirestoreService.js';
import { getActiveScenarioAsync, invalidateScenarioCache } from '../../src/storage/ScenarioRepository.js';
import { getStressSettingsAsync, invalidateStressCache, timingPinSettled, createSimulationConfigFromSettings } from '../../src/storage/StressRepository.js';
import { loadDecisionDBAsync, invalidateCache as invalidateDecisionCache } from '../../src/storage/DecisionRepository.js';
import { confirmAndCreate, SEED_KEY } from '../../src/services/PlanSeed.js';
import { authSettled, GUEST_KEY } from '../fixtures/plans/checks.mjs';
import { SCHEMA_VERSION } from '../../src/storage/schema.js';
import { seedA, seedBCouple, memoryStorage } from './fixtures/planSeeds.js';

const SAVED_ON = new Date(2026, 9, 1, 15, 0);
const LOCKED = {
  id: 'guest-locked', schemaVersion: 1, planDetails: { name: 'My real plan', description: '' }, enabledTools: ['stress', 'decision'], isActive: true,
  strategy: { id: 'pots-and-valves', params: {}, lockedAt: '2026-09-12T10:00:00.000Z', engineVersion: '6.17.0' },
  decisionTool: { settings: { locked: true, duration: 30 }, history: [{ date: '2026-09', settingsChecksum: 'abc' }], taxYears: {} },
  stressTool: { settings: { currentAge: 61, retired: true, firstTaxYear: 2026 } },
  planDocument: { version: 1 }, createdAt: '2026-01-01T00:00:00.000Z', lastModified: '2026-09-12T10:00:00.000Z'
};
const tab = () => JSON.parse(sessionStorage.getItem(GUEST_KEY) || '[]');
/** This browser's storage holding the seed, as V7 left it (the planner reads it again just before it makes anything). */
const holding = (seed) => memoryStorage({ [SEED_KEY]: JSON.stringify(seed) });
const withoutActive = (p) => { const { isActive, ...rest } = p; return rest; };
const app = (storage, answers) => ({
  create: createScenario, setActive: setActiveScenarioDoc, remove: deleteScenarioDoc, storage, now: () => SAVED_ON,
  listNames: async () => (await loadAllScenarios()).map((s) => s.planDetails.name),
  ask: async () => answers.shift(), warn: (m) => { throw new Error('unexpected warning: ' + m); }
});

beforeAll(async () => { await authSettled(); });
beforeEach(() => {
  enterGuestMode(); clearGuestData();
  sessionStorage.setItem(GUEST_KEY, JSON.stringify([LOCKED]));
  invalidateScenarioCache(); invalidateStressCache(); invalidateDecisionCache();
});

describe('a plan from a seed, without an account', () => {
  it('lands in the tab\'s store as the open plan; the locked plan is unchanged but for isActive', async () => {
    const storage = memoryStorage({ [SEED_KEY]: JSON.stringify(seedA()) });
    const r = await confirmAndCreate(seedA(), app(storage, ['Stop at 60 · £1,800 a month']));
    expect(r.outcome).toBe('made');
    expect(isGuest()).toBe(true);
    const list = tab();
    expect(list.length).toBe(2);
    // 6.19.0: read by today's chain, the version-1 locked plan moves to the current version and NOTHING else moves —
    // a locked plan gets no charge (rule 3); its settings, history and plan document are byte-identical.
    expect(withoutActive(list.find((p) => p.id === 'guest-locked'))).toEqual({ ...withoutActive(LOCKED), schemaVersion: SCHEMA_VERSION });
    const made = list.find((p) => p.id === r.made.yours.id);
    expect(made.id.startsWith('guest-')).toBe(true);
    expect(made.isActive).toBe(true);
    expect(list.filter((p) => p.isActive).length).toBe(1);
    expect(storage.has(SEED_KEY)).toBe(false);
  });

  it('two saves give two plans, the second named " (2)"; a couple adds two linked plans', async () => {
    await confirmAndCreate(seedA(), app(holding(seedA()), ['Try']));
    await confirmAndCreate(seedA(), app(holding(seedA()), ['Try']));
    await confirmAndCreate(seedBCouple(), app(holding(seedBCouple()), ['Us']));
    const list = tab();
    expect(list.map((p) => p.planDetails.name)).toEqual(['My real plan', 'Try', 'Try (2)', 'Us · partner', 'Us']);
    const us = list.find((p) => p.planDetails.name === 'Us');
    expect(list.find((p) => p.id === us.household.partnerScenarioId).planDetails.name).toBe('Us · partner');
    expect(us.isActive).toBe(true);
  });

  it('two windows holding the same seed make ONE plan: the second finds it gone, says so, and leaves its tab a "refused" receipt', async () => {
    const storage = holding(seedA());
    const tab1 = memoryStorage(), tab2 = memoryStorage();
    const first = await confirmAndCreate(seedA(), { ...app(storage, ['Two tabs']), session: tab1 });
    expect(first.outcome).toBe('made');
    const warned = [];
    const second = await confirmAndCreate(seedA(), { ...app(storage, ['Two tabs']), session: tab2, warn: (m) => warned.push(m) });
    expect(second).toEqual({ outcome: 'gone' });
    expect(warned).toEqual(['These figures were used or replaced in another window, so no plan was made here. Go back to the question and press Save again if you want this plan.']);
    expect(tab().filter((p) => p.planDetails.name.startsWith('Two tabs')).length).toBe(1);
    expect(JSON.parse(tab1.getItem('pt_v7_plan_receipt'))[seedA().createdAt]).toEqual({ outcome: 'made', name: 'Two tabs' });
    expect(JSON.parse(tab2.getItem('pt_v7_plan_receipt'))[seedA().createdAt]).toEqual({ outcome: 'refused' });
  });

  it('the app then opens it through its own repositories and writes nothing back', async () => {
    await confirmAndCreate(seedA(), app(holding(seedA()), ['Stop at 60 · £1,800 a month']));
    invalidateScenarioCache(); invalidateStressCache(); invalidateDecisionCache();
    const before = sessionStorage.getItem(GUEST_KEY);
    const active = await getActiveScenarioAsync();
    expect(active.planDetails.name).toBe('Stop at 60 · £1,800 a month');
    const S = await getStressSettingsAsync();
    await timingPinSettled();
    await loadDecisionDBAsync();
    expect(sessionStorage.getItem(GUEST_KEY)).toBe(before);                      // no upgrade, no timing pin, nothing
    expect([S.firstTaxYear, S.shapeAgeNow, S.retireAge, S.currentAge]).toEqual([2030, 60, 60, 56]);
    const cfg = createSimulationConfigFromSettings({}, S);
    expect(Math.round(cfg.equityStart + cfg.bondStart + cfg.cashStart)).toBe(341000);
    expect(Math.round(cfg.isaBalance)).toBe(23000);
  });
});
