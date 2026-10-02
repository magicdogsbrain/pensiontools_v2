/**
 * 6.20.2 (review) — the lock is checked against the plan AS STORED, signed in.
 *
 * The repositories check a tab's own copy of the plan, taken when it loaded. A tab or device that loaded the plan before
 * it was locked elsewhere (the first month recorded on the phone; a desktop tab left open) still thinks it is a draft.
 * FirestoreService.saveScenario already reads the stored plan before every write (the newer-version check, 6.15.0); the
 * same read now refuses a change to a locked plan's Stress or Decision settings or its strategy, whoever sends it.
 *
 * The REAL FirestoreService and repositories, with Firestore itself replaced by an in-memory one that records every call.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';

const fs = vi.hoisted(() => {
  const clone = (v) => (v === undefined ? undefined : JSON.parse(JSON.stringify(v)));
  const state = { docs: new Map(), calls: [], failGetDoc: false };
  const setPath = (obj, path, value) => { const parts = path.split('.'); let cur = obj; for (let i = 0; i < parts.length - 1; i++) { if (!cur[parts[i]] || typeof cur[parts[i]] !== 'object') cur[parts[i]] = {}; cur = cur[parts[i]]; } cur[parts[parts.length - 1]] = value; };
  const snap = (path) => ({ id: path.split('/').pop(), exists: () => state.docs.has(path), data: () => clone(state.docs.get(path)) });
  const api = {
    doc: (db, ...segs) => ({ path: segs.join('/') }),
    collection: (db, ...segs) => ({ path: segs.join('/') }),
    getDoc: async (ref) => { state.calls.push({ op: 'getDoc', path: ref.path }); if (state.failGetDoc) throw new Error('offline'); return snap(ref.path); },
    getDocs: async (coll) => { const found = [...state.docs.keys()].filter((k) => k.startsWith(coll.path + '/') && !k.slice(coll.path.length + 1).includes('/')); return { forEach: (fn) => found.forEach((k) => fn(snap(k))) }; },
    setDoc: async (ref, data) => { state.calls.push({ op: 'setDoc', path: ref.path, data: clone(data) }); state.docs.set(ref.path, clone(data)); },
    updateDoc: async (ref, data) => { state.calls.push({ op: 'updateDoc', path: ref.path, data: clone(data) }); if (!state.docs.has(ref.path)) throw new Error('not-found'); const cur = clone(state.docs.get(ref.path)); for (const [k, v] of Object.entries(data)) setPath(cur, k, clone(v)); state.docs.set(ref.path, cur); },
    addDoc: async () => { throw new Error('not used'); },
    deleteDoc: async (ref) => { state.docs.delete(ref.path); },
    writeBatch: () => { const ops = []; return { update: (ref, data) => ops.push(() => api.updateDoc(ref, data)), delete: (ref) => ops.push(() => api.deleteDoc(ref)), commit: async () => { for (const o of ops) await o(); } }; },
    query: (c) => c, where: () => null
  };
  return { state, api, clone };
});
vi.mock('firebase/firestore', () => fs.api);
vi.mock('../src/firebase/config.js', () => ({ db: {}, auth: null, app: null, default: {}, isFirebaseConfigured: () => true }));
vi.mock('../src/firebase/AuthService.js', () => {
  const user = { uid: 'u1', email: 'someone@example.invalid', emailVerified: true };
  return {
    getCurrentUser: () => user, isLoggedIn: () => true, isGuest: () => false, onAuthStateChange: () => () => {},
    enterGuestMode: () => user, leaveGuestMode: () => {}, initAuthStateListener: () => {}
  };
});

import { invalidateScenarioCache, getActiveScenarioAsync, activePlanLocked, setActiveStrategy, saveActiveJourney } from '../src/storage/ScenarioRepository.js';
import { getStressSettingsAsync, saveStressSettings, invalidateStressCache, timingPinSettled } from '../src/storage/StressRepository.js';
import { getDecisionSettingsAsync, saveDecisionSettings, saveTaxYearConfig, decisionSettingsChecksum, invalidateCache as invalidateDecisionCache } from '../src/storage/DecisionRepository.js';
import { unlockPlan } from '../src/services/PlanLock.js';
import { budgetIncomeShapePatch } from '../src/services/BudgetToPlan.js';
import { defaultBudget } from '../src/services/BudgetModel.js';
import { PLAN_LOCKED_CODE, PLAN_LOCKED_MESSAGE } from '../src/services/LockedPlanGuard.js';
import { TIMING_PIN_KEYS } from '../src/services/PlanTiming.js';

const PATH = 'users/u1/scenarios/p1';
const fixture = (name) => { const { id, ...p } = JSON.parse(readFileSync('tests/fixtures/plans/' + name + '.json', 'utf8')); return p; };
const fresh = () => { invalidateScenarioCache(); invalidateStressCache(); invalidateDecisionCache(); };
const storedPlan = () => fs.clone(fs.state.docs.get(PATH));
const frozen = () => { const p = storedPlan(); return { stress: JSON.stringify(p.stressTool && p.stressTool.settings), decision: JSON.stringify(p.decisionTool.settings), checksum: decisionSettingsChecksum(p.decisionTool.settings), strategy: JSON.stringify(p.strategy), history: JSON.stringify(p.decisionTool.history), taxYears: JSON.stringify(p.decisionTool.taxYears) }; };
const writesTo = () => fs.state.calls.filter((c) => c.path === PATH && (c.op === 'updateDoc' || c.op === 'setDoc'));

/** Open a plan as the app does on load (upgrade write-back, the timing pin), signed in. */
async function open(plan) {
  fs.state.docs = new Map([[PATH, { ...plan, isActive: true }]]);
  fs.state.calls = []; fs.state.failGetDoc = false;
  fresh();
  await getActiveScenarioAsync(); await getStressSettingsAsync(); await getDecisionSettingsAsync(); await timingPinSettled();
}

/** Another device records the first month: the stored plan is locked; this tab's copy is not told. */
function lockElsewhere() {
  const p = storedPlan();
  p.decisionTool.settings = { ...p.decisionTool.settings, locked: true, lockedAt: '2026-10-02T07:30:00.000Z', lockedBy: 'first monthly entry' };
  p.decisionTool.history = [...(p.decisionTool.history || []), { date: '2026-10', taxYear: '26/27', sipp: 900000, settingsChecksum: decisionSettingsChecksum(p.decisionTool.settings) }];
  fs.state.docs.set(PATH, p);
  fs.state.calls = [];
}

beforeEach(() => { fs.state.docs = new Map(); fs.state.calls = []; fs.state.failGetDoc = false; fresh(); });

describe('signed in: a tab that loaded the plan before it was locked on another device', () => {
  it('Budget → "Use as the start of my income shape": refused by the stored plan, no write sent, not retried', async () => {
    await open(fixture('02-pnv-draft'));
    expect(await activePlanLocked()).toBe(false);
    lockElsewhere();
    const before = frozen();
    const st = await getStressSettingsAsync();
    const budget = { ...defaultBudget(61, 61), lines: [{ id: 'a', label: 'Food', annual: 7200, tier: 'essential' }] };
    const { patch } = budgetIncomeShapePatch(budget, st, 39000, '2026-10-02');
    await expect(saveStressSettings(patch)).rejects.toMatchObject({ code: PLAN_LOCKED_CODE, message: PLAN_LOCKED_MESSAGE });
    expect(writesTo()).toEqual([]);
    expect(fs.state.calls.filter((c) => c.op === 'getDoc' && c.path === PATH).length).toBe(1);   // a refusal is not a connection problem
    await expect(saveDecisionSettings({ baseSalary: 39000 })).rejects.toMatchObject({ code: PLAN_LOCKED_CODE });
    expect(writesTo()).toEqual([]);
    expect(frozen()).toEqual(before);
    expect(await activePlanLocked()).toBe(true);   // the tab dropped its old copy and reads the plan as stored
  });

  it('the reviewer\'s case: one figure saved from the old copy — refused; the stored figure stays', async () => {
    await open(fixture('02-pnv-draft'));
    lockElsewhere();
    const before = frozen();
    await expect(saveStressSettings({ baseSalary: 77777 })).rejects.toMatchObject({ code: PLAN_LOCKED_CODE });
    expect(storedPlan().stressTool.settings.baseSalary).not.toBe(77777);
    expect(frozen()).toEqual(before);
  });

  it('the strategy switch from the old copy: not written', async () => {
    await open(fixture('02-pnv-draft'));
    lockElsewhere();
    const before = frozen();
    await expect(setActiveStrategy('floor-and-flex', {})).rejects.toMatchObject({ code: PLAN_LOCKED_CODE });
    expect(writesTo()).toEqual([]);
    expect(frozen()).toEqual(before);
  });

  it('a tax-year save from the old copy: the settings it carries would lift the lock — nothing is written, the lock stays', async () => {
    await open(fixture('02-pnv-draft'));
    lockElsewhere();
    const before = frozen();
    await expect(saveTaxYearConfig('27/28', { cpi: 0.031 })).rejects.toMatchObject({ code: PLAN_LOCKED_CODE });
    expect(writesTo()).toEqual([]);
    expect(storedPlan().decisionTool.settings.locked).toBe(true);
    expect(frozen()).toEqual(before);
  });

  it('writes that are not settings still go from that tab (the journey)', async () => {
    await open(fixture('02-pnv-draft'));
    lockElsewhere();
    const before = frozen();
    await saveActiveJourney([{ stage: 'drafting', label: 'x', at: '2026-10-02T00:00:00.000Z' }]);
    expect(writesTo().length).toBe(1);
    expect(frozen()).toEqual(before);
  });

  it('a failed read of the stored plan (offline) does not block a draft\'s save: the tab\'s own check stands, as before', async () => {
    await open(fixture('02-pnv-draft'));
    fs.state.failGetDoc = true;
    await saveStressSettings({ baseSalary: 12345 });
    expect(storedPlan().stressTool.settings.baseSalary).toBe(12345);
  });
});

describe('signed in: the bookkeeping a locked plan still makes passes the stored plan\'s check', () => {
  it('the plan\'s start pinned on load, on a locked plan with no Stress settings saved (it reads the defaults)', async () => {
    const plan = fixture('05-saver-committed');
    delete plan.stressTool;
    await open(plan);
    const saved = storedPlan().stressTool && storedPlan().stressTool.settings;
    expect(saved && typeof saved.retired).toBe('boolean');
    expect(storedPlan().decisionTool.settings.locked).toBe(true);
    const pinOnly = Object.keys(saved).filter((k) => saved[k] !== null && TIMING_PIN_KEYS.includes(k));
    expect(pinOnly.length).toBeGreaterThan(0);
  });

  it('the unlock, then the draft saves again', async () => {
    await open(fixture('05-saver-committed'));
    expect(await activePlanLocked()).toBe(true);
    await unlockPlan();
    expect(storedPlan().decisionTool.settings.locked).toBe(false);
    expect(storedPlan().decisionTool.settings.unlockCount).toBe(1);
    await saveStressSettings({ equityMin: 111000 });
    expect(storedPlan().stressTool.settings.equityMin).toBe(111000);
  });

  it('a recorded month\'s tax-year save on the locked plan, from a tab that knows it is locked', async () => {
    await open(fixture('05-saver-committed'));
    const before = frozen();
    await saveTaxYearConfig('27/28', { cpi: 0.031 });
    expect(storedPlan().decisionTool.taxYears['27/28'].cpi).toBe(0.031);
    expect({ ...frozen(), taxYears: null }).toEqual({ ...before, taxYears: null });
  });
});
