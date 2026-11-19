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

import { invalidateScenarioCache, getActiveScenarioAsync, listScenariosAsync } from '../../src/storage/ScenarioRepository.js';
import { getStressSettingsAsync, invalidateStressCache } from '../../src/storage/StressRepository.js';
import { invalidateCache as invalidateDecisionCache } from '../../src/storage/DecisionRepository.js';
import { upgradeScenario } from '../../src/firebase/scenarioMigration.js';
import { FIXTURES, PARITY_DAY } from '../../e2e/parity/fixtures/plans.js';
import { contextFor } from '../../src/reading/context.js';
import { lastsInputOf, waysInputOf, stressRowInputOf, enginePlanOf } from '../../src/reading/gather.js';
import { cloneSafe } from '../../src/utils/cloneSafe.js';

/**
 * One gatherer per question (lead4.md R6; step M deliverable 5): for every parity fixture, the full view's gatherer (the
 * plan read through its repositories, as index.html reads the open plan, on the page's one clock) and the simple view's
 * (the plan as its worker is handed it) give the engine the SAME input for "does it last", the ways list and the stress
 * rows — deep equal, after the trip across a worker boundary (cloneSafe) — and the engine's plan built from each is the
 * same plan. Both views build that input with src/reading/gather.js; no other gatherer is left.
 */
const noon = (day) => { const [y, m, d] = day.split('-').map(Number); return new Date(y, m - 1, d, 12); };
const NOW = noon(PARITY_DAY);
const plain = (v) => JSON.parse(JSON.stringify(v, (k, x) => (typeof x === 'function' ? '[fn]' : x)));

async function openAll(plans, subject) {
  fs.state.docs = new Map(plans.map((p) => [ 'users/u1/scenarios/' + p.id, { ...p, isActive: p.id === subject } ]));
  invalidateScenarioCache(); invalidateStressCache(); invalidateDecisionCache();
}

beforeEach(() => { fs.state.docs = new Map(); fs.state.calls = []; });

describe('one gatherer: both views hand the engine the same input, for every parity fixture', () => {
  it.each(FIXTURES.map((f) => [f.key, f]))('%s', async (key, f) => {
    const raw = f.plans();
    await openAll(raw, f.subject);
    vi.useFakeTimers({ toFake: ['Date'] }); vi.setSystemTime(NOW);
    try {
      // the full view: the open plan through its repositories, the context on the page's clock (index.html oneTestFor, cmpRun)
      const sc = await getActiveScenarioAsync();
      const list = await listScenariosAsync();
      const ctxF = contextFor(sc, { now: NOW, plans: list });
      const fullSettings = await getStressSettingsAsync();
      const fullLasts = cloneSafe(lastsInputOf(sc, ctxF));
      const fullWays = cloneSafe(waysInputOf(sc, ctxF));
      const fullRow = cloneSafe(stressRowInputOf(sc, ctxF, 'asPlanned'));
      // the simple view: the plan as stored, upgraded in memory, as its worker is handed it (answers/plan/lastsRun.js runLasts)
      const stored = upgradeScenario(JSON.parse(JSON.stringify(raw.find((p) => p.id === f.subject))), { now: NOW }).scenario;
      const ctxS = contextFor(stored, { today: PARITY_DAY, plans: raw });
      const simpleLasts = lastsInputOf(stored, ctxS);
      // the one clock, the one level, the one partner
      expect(ctxF.now.getTime()).toBe(ctxS.now.getTime());
      expect(ctxF.level).toBe(ctxS.level);
      expect(ctxF.partnerPlan && ctxF.partnerPlan.id).toBe(ctxS.partnerPlan && ctxS.partnerPlan.id);
      // the settings the full view's repository reads ARE the gatherer's
      expect(plain(fullLasts.settings)).toEqual(plain(fullSettings));
      expect(fullLasts).toEqual(plain(simpleLasts));
      expect(fullWays).toEqual(plain(waysInputOf(stored, ctxS)));
      expect(plain(fullRow.today)).toBe(ctxS.today);
      expect(fullRow.row).toBe('asPlanned');
      // nothing is lost on the trip to a worker: the engine's plan from the input as sent is the plan from the input as made
      if (!fullLasts.settings.readFault) {
        expect(plain(enginePlanOf(fullLasts))).toEqual(plain(enginePlanOf(simpleLasts)));
      }
    } finally { vi.useRealTimers(); }
  }, 120_000);
});
