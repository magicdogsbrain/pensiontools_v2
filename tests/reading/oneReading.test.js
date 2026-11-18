import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
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
vi.mock('../../src/firebase/config.js', () => ({ db: {}, auth: null, app: null, default: {}, isFirebaseConfigured: () => true }));
vi.mock('../../src/firebase/AuthService.js', () => {
  const user = { uid: 'u1', email: 'someone@example.invalid', emailVerified: true };
  return {
    getCurrentUser: () => user, isLoggedIn: () => true, isGuest: () => false, onAuthStateChange: () => () => {},
    enterGuestMode: () => user, leaveGuestMode: () => {}, initAuthStateListener: () => {}
  };
});

import { invalidateScenarioCache, getActiveScenarioAsync } from '../../src/storage/ScenarioRepository.js';
import { getStressSettingsAsync, saveStressSettings, invalidateStressCache, stressReadingKeyOf, sameStressReadingKey } from '../../src/storage/StressRepository.js';
import { invalidateCache as invalidateDecisionCache } from '../../src/storage/DecisionRepository.js';
import { effectiveStressSettings } from '../../src/services/PlanReading.js';
import { upgradeScenario } from '../../src/firebase/scenarioMigration.js';
import { todayOf, dayKeyOf } from '../../src/reading/clock.js';
import { settingsOrFault, READ_FAULT_WORDS, PlanReadError, isPlanReadError } from '../../src/reading/readFault.js';

const PATH = 'users/u1/scenarios/p1';
const fixture = (name) => { const { id, ...p } = JSON.parse(readFileSync('tests/fixtures/plans/' + name + '.json', 'utf8')); return p; };
const fresh = () => { invalidateScenarioCache(); invalidateStressCache(); invalidateDecisionCache(); };
const storedPlan = () => fs.clone(fs.state.docs.get(PATH));
async function open(plan) {
  fs.state.docs = new Map([[PATH, { ...plan, isActive: true }]]);
  fs.state.calls = [];
  fresh();
  return getActiveScenarioAsync();
}

beforeEach(() => { fs.state.docs = new Map(); fs.state.calls = []; fresh(); });

describe('the one clock (src/reading/clock.js)', () => {
  it('is the local day at noon, as the simple view reads its today', () => {
    const d = todayOf(new Date(2026, 10, 18, 23, 59, 0));
    expect([d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes()]).toEqual([2026, 10, 18, 12, 0]);
    expect(dayKeyOf(d)).toBe('2026-11-18');
    expect(todayOf(new Date(2026, 0, 1, 0, 0, 1)).getDate()).toBe(1);
  });
});

describe('a plan that cannot be read (src/reading/readFault.js)', () => {
  it('gives empty settings that say so, never what was stored', () => {
    expect(settingsOrFault(() => ({ baseSalary: 1 }))).toEqual({ settings: { baseSalary: 1 }, fault: null });
    const bad = settingsOrFault(() => { throw new Error('x'); });
    expect(bad).toEqual({ settings: { readFault: true }, fault: READ_FAULT_WORDS });
    const e = new PlanReadError(new Error('x'));
    expect(isPlanReadError(e)).toBe(true);
    expect(e.message).toBe(READ_FAULT_WORDS);
    expect(READ_FAULT_WORDS).not.toMatch(/should|recommend/i);
  });
});

describe('the full view reads a plan as the simple view does (lead4.md D1)', () => {
  for (const name of ['02-pnv-draft', '03-gilt-ladder-locked', '05-saver-committed', '06-pre-6.4-no-timing', '12-lumpy-db-gia', '01-fresh-default']) {
    it(name + ': getStressSettingsAsync is PlanReading.effectiveStressSettings on the one clock', async () => {
      const raw = fixture(name);
      await open(raw);
      const got = await getStressSettingsAsync();
      const plan = upgradeScenario(fs.clone({ id: 'p1', ...raw, isActive: true })).scenario;
      expect(got).toEqual(effectiveStressSettings(plan, { now: todayOf() }));
    });
  }

  it('opening writes nothing', async () => {
    await open(fixture('02-pnv-draft'));
    await getStressSettingsAsync();
    expect(fs.state.calls.filter((c) => c.op === 'updateDoc' || c.op === 'setDoc')).toEqual([]);
  });

  it('a reading that throws is said in plain words, never the stored or factory settings', async () => {
    const plan = await open(fixture('02-pnv-draft'));
    // a plan whose settings cannot be read: a getter that throws on the stored copy
    Object.defineProperty(plan.stressTool, 'settings', { get() { throw new Error('broken'); }, configurable: true });
    await expect(getStressSettingsAsync()).rejects.toMatchObject({ code: 'plan-read-fault', message: READ_FAULT_WORDS });
  });

  it('the reading is kept for the same plan on the same day, and made again when the plan or the day moves', () => {
    const p = { id: 'a', lastModified: 'x', stressTool: { settings: {} } };
    const k = stressReadingKeyOf(p, todayOf(new Date(2026, 10, 18)));
    expect(sameStressReadingKey(k, stressReadingKeyOf(p, todayOf(new Date(2026, 10, 18, 20))))).toBe(true);
    expect(sameStressReadingKey(k, stressReadingKeyOf(p, todayOf(new Date(2026, 10, 19))))).toBe(false);
    expect(sameStressReadingKey(k, stressReadingKeyOf({ ...p, lastModified: 'y' }, todayOf(new Date(2026, 10, 18))))).toBe(false);
    p.stressTool.settings = { baseSalary: 1 };   // a save in this tab replaces the object
    expect(sameStressReadingKey(k, stressReadingKeyOf(p, todayOf(new Date(2026, 10, 18))))).toBe(false);
  });
});

describe('a save writes only the change, onto the plan as stored (lead4.md D1, R3)', () => {
  it('a draft: the change and nothing of the reading (no defaults, no folded age, no worked pots)', async () => {
    const raw = fixture('05-saver-committed');
    const lockedRaw = raw.decisionTool && raw.decisionTool.settings && raw.decisionTool.settings.locked;
    if (lockedRaw) raw.decisionTool.settings = { ...raw.decisionTool.settings, locked: false };
    raw.stressTool = { settings: { currentAge: 50, currentAgeAsOf: '2026-01-10', retired: false, retireAge: 60, baseSalary: 24000 } };
    await open(raw);
    const read = await getStressSettingsAsync();
    expect(read.pa).toBeGreaterThan(0);   // the reading carries the defaults merged under the plan
    await saveStressSettings({ baseSalary: 26000 });
    const stored = storedPlan().stressTool.settings;
    expect(stored.baseSalary).toBe(26000);
    for (const k of ['pa', 'brl', 'hrl', 'statePension', 'statePensionYear', 'hodlValue', 'equityMin', 'potAtRetirement', 'potsAsOf', 'potsNotSet', 'incomeNotSet']) expect(stored).not.toHaveProperty(k);
    expect(stored.currentAge).toBe(50);
  });

  it('the next read is made from the plan as saved', async () => {
    const raw = fixture('02-pnv-draft');
    await open(raw);
    const before = await getStressSettingsAsync();
    await saveStressSettings({ baseSalary: (+before.baseSalary || 0) + 1000 });
    expect((await getStressSettingsAsync()).baseSalary).toBe((+before.baseSalary || 0) + 1000);
  });
});

describe('the simple view\'s screens read the same way (PlanReading.settingsForScreen)', () => {
  it('a plan that cannot be read gives empty settings that say so, never the stored copy', async () => {
    const { settingsForScreen } = await import('../../src/services/PlanReading.js');
    const plan = upgradeScenario(fs.clone({ id: 'p1', ...fixture('02-pnv-draft') })).scenario;
    expect(settingsForScreen(plan, { now: todayOf() })).toEqual(effectiveStressSettings(plan, { now: todayOf() }));
    Object.defineProperty(plan.stressTool, 'settings', { get() { throw new Error('broken'); }, configurable: true });
    expect(settingsForScreen(plan, { now: todayOf() })).toEqual({ readFault: true });
  });
});
