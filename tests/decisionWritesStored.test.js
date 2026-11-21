/**
 * A Decision write stores only what was asked (lead4.md R3, D1, D2). An unlocked plan's Decision settings are READ from its
 * Stress settings (services/DraftDecision.js), with the factory defaults under them; a write onto that reading stored the
 * defaults and the worked figures in the plan as if the person had typed them. Now every Decision write goes onto the
 * settings AS STORED: the keys given, nothing else. A key given as undefined is taken out.
 *
 * The REAL FirestoreService and repositories, with Firestore replaced by an in-memory one (as tests/lockedPlanStore.test.js).
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

import { invalidateScenarioCache, getActiveScenarioAsync } from '../src/storage/ScenarioRepository.js';
import { getStressSettingsAsync, saveStressSettings, invalidateStressCache, timingPinSettled } from '../src/storage/StressRepository.js';
import { getDecisionSettingsAsync, saveDecisionSettings, saveTaxYearConfig, invalidateCache as invalidateDecisionCache } from '../src/storage/DecisionRepository.js';
import { settingsWithPatch } from '../src/services/DraftDecision.js';

const PATH = 'users/u1/scenarios/p1';
const fixture = (name) => { const { id, ...p } = JSON.parse(readFileSync('tests/fixtures/plans/' + name + '.json', 'utf8')); return p; };
const storedPlan = () => fs.clone(fs.state.docs.get(PATH));
const fresh = () => { invalidateScenarioCache(); invalidateStressCache(); invalidateDecisionCache(); };

/** A draft as stored: its Stress settings, and a Decision copy holding only `decision` (none when undefined). */
async function openDraft(decision) {
  const p = fixture('02-pnv-draft');
  p.decisionTool = { ...p.decisionTool, history: [], taxYears: {} };
  if (decision === undefined) delete p.decisionTool.settings; else p.decisionTool.settings = decision;
  fs.state.docs = new Map([[PATH, { ...p, isActive: true }]]);
  fs.state.calls = [];
  fresh();
  await getActiveScenarioAsync(); await getStressSettingsAsync(); await getDecisionSettingsAsync(); await timingPinSettled();
}

beforeEach(() => { fs.state.docs = new Map(); fs.state.calls = []; fresh(); });

describe('a Decision write on a draft stores only the keys given', () => {
  it('a draft with no Decision copy stores the one figure, not the defaults or the reading under it', async () => {
    await openDraft(undefined);
    const read = await getDecisionSettingsAsync();
    expect(read.protectionFactor).toBeDefined();   // the reading has the defaults under it...
    await saveDecisionSettings({ baseSalary: 39000 });
    expect(storedPlan().decisionTool.settings).toEqual({ baseSalary: 39000 });   // ...the plan stores only what was given
  });

  it('a draft with a Decision copy keeps it as it was, with the one figure changed', async () => {
    await openDraft({ protectionFactor: 30, baseSalary: 20000 });
    await saveDecisionSettings({ baseSalary: 39000 });
    expect(storedPlan().decisionTool.settings).toEqual({ protectionFactor: 30, baseSalary: 39000 });
  });

  it('a key given as undefined is taken out (an Undo of a key that was not there)', async () => {
    await openDraft({ protectionFactor: 30, baseSalary: 20000 });
    await saveDecisionSettings({ baseSalary: undefined });
    expect(storedPlan().decisionTool.settings).toEqual({ protectionFactor: 30 });
  });

  it('a tax year saved on a draft leaves the Decision settings as stored', async () => {
    await openDraft({ protectionFactor: 30 });
    await saveTaxYearConfig('27/28', { cpi: 0.031 });
    expect(storedPlan().decisionTool.settings).toEqual({ protectionFactor: 30 });
    expect(storedPlan().decisionTool.taxYears['27/28'].cpi).toBe(0.031);
  });

  it('the reading after a write is the plan read again: the figure given, and the Stress settings for the rest', async () => {
    await openDraft(undefined);
    const ss = await getStressSettingsAsync();
    await saveDecisionSettings({ targetSchedule: [1, 2, 3] });
    const read = await getDecisionSettingsAsync();
    expect(read.targetSchedule).toEqual([1, 2, 3]);
    expect(read.equityMin).toBe(ss.equityMin);
  });

  it('a Stress write with a key given as undefined takes that key out', async () => {
    await openDraft(undefined);
    await saveStressSettings({ shapeAgeNow: 61 });
    expect(storedPlan().stressTool.settings.shapeAgeNow).toBe(61);
    await saveStressSettings({ shapeAgeNow: undefined });
    expect('shapeAgeNow' in storedPlan().stressTool.settings).toBe(false);
  });
});

describe('settingsWithPatch', () => {
  it('the stored settings with the patch on top; undefined takes a key out; the stored copy is not changed', () => {
    const stored = { a: 1, b: { c: 2 } };
    expect(settingsWithPatch(stored, { a: 3, d: undefined, b: undefined, e: null })).toEqual({ a: 3, e: null });
    expect(stored).toEqual({ a: 1, b: { c: 2 } });
    expect(settingsWithPatch(undefined, { x: 1 })).toEqual({ x: 1 });
  });
});
