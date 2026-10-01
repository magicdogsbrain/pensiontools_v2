/**
 * The create path from a plan seed, through the REAL FirestoreService with Firestore itself mocked
 * (research/v7/save-as-plan.md C.2, "Writes"): only createScenario writes plans, and it always makes a NEW document;
 * the one write to an existing plan is the `isActive` flag that making the new plan active moves (Q12). A locked plan
 * is never opened for writing: every key of it but `isActive` is byte-identical afterwards.
 *
 * The in-memory Firestore below records every write with its path. A signed-in, verified user; no network.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

const store = { docs: new Map(), writes: [], nextId: 1, failAddOn: null, adds: 0 };

vi.mock('firebase/firestore', () => {
  const path = (parts) => parts.join('/');
  const docRef = (p) => ({ path: p, id: p.split('/').pop() });
  return {
    doc: (db, ...parts) => docRef(path(parts)),
    collection: (db, ...parts) => ({ path: path(parts) }),
    query: (coll, ...w) => ({ path: coll.path, where: w }),
    where: (field, op, value) => ({ field, op, value }),
    getDoc: async (ref) => ({ id: ref.id, exists: () => store.docs.has(ref.path), data: () => JSON.parse(JSON.stringify(store.docs.get(ref.path))) }),
    getDocs: async (q) => {
      const prefix = q.path + '/';
      const hits = [...store.docs.entries()].filter(([k]) => k.startsWith(prefix) && !k.slice(prefix.length).includes('/'));
      return { forEach: (fn) => hits.forEach(([k, v]) => fn({ id: k.slice(prefix.length), ref: docRef(k), data: () => JSON.parse(JSON.stringify(v)) })) };
    },
    addDoc: async (coll, data) => {
      store.adds++;
      if (store.failAddOn === store.adds) throw new Error('offline');
      const id = 'doc' + store.nextId++;
      const p = coll.path + '/' + id;
      if (store.docs.has(p)) throw new Error('addDoc reused an id');
      store.writes.push({ op: 'add', path: p });
      store.docs.set(p, JSON.parse(JSON.stringify(data)));
      return { id, path: p };
    },
    setDoc: async (ref, data) => { store.writes.push({ op: 'set', path: ref.path, data }); store.docs.set(ref.path, JSON.parse(JSON.stringify(data))); },
    updateDoc: async (ref, data) => { store.writes.push({ op: 'update', path: ref.path, data }); store.docs.set(ref.path, { ...store.docs.get(ref.path), ...data }); },
    deleteDoc: async (ref) => { store.writes.push({ op: 'delete', path: ref.path }); store.docs.delete(ref.path); },
    writeBatch: () => {
      const ops = [];
      return {
        update: (ref, data) => ops.push(['update', ref, data]),
        set: (ref, data) => ops.push(['set', ref, data]),
        delete: (ref) => ops.push(['delete', ref]),
        commit: async () => {
          for (const [op, ref, data] of ops) {
            store.writes.push({ op: 'batch.' + op, path: ref.path, data });
            if (op === 'delete') store.docs.delete(ref.path);
            else if (op === 'update') store.docs.set(ref.path, { ...store.docs.get(ref.path), ...data });
            else store.docs.set(ref.path, JSON.parse(JSON.stringify(data)));
          }
        }
      };
    }
  };
});
vi.mock('../../src/firebase/config.js', () => ({ db: {}, auth: null, app: null, default: {}, isFirebaseConfigured: () => true }));
vi.mock('../../src/firebase/AuthService.js', () => {
  const user = { uid: 'u1', email: 'someone@example.invalid', emailVerified: true };
  return {
    getCurrentUser: () => user, isLoggedIn: () => true, isGuest: () => false, onAuthStateChange: () => () => {},
    enterGuestMode: () => user, leaveGuestMode: () => {}, initAuthStateListener: () => {}
  };
});

import { createScenario, setActiveScenarioDoc, deleteScenarioDoc, loadAllScenarios } from '../../src/firebase/FirestoreService.js';
import { createPlansFromSeed, confirmAndCreate, SEED_KEY } from '../../src/services/PlanSeed.js';
import { SCHEMA_VERSION } from '../../src/storage/schema.js';
import { seedA, seedBCouple, memoryStorage } from './fixtures/planSeeds.js';

const SAVED_ON = new Date(2026, 9, 1, 15, 0);
const BASE = 'users/u1/scenarios/';
const realStore = { create: createScenario, setActive: setActiveScenarioDoc, remove: deleteScenarioDoc };

/** A locked plan with a recorded month and a plan document, as the person had it before saving from V7. */
const LOCKED = {
  schemaVersion: SCHEMA_VERSION, planDetails: { name: 'My real plan', description: '' }, enabledTools: ['stress', 'decision'], isActive: true,
  strategy: { id: 'pots-and-valves', params: {}, lockedAt: '2026-09-12T10:00:00.000Z', engineVersion: '6.17.0' },
  decisionTool: { settings: { locked: true, lockedAt: '2026-09-12T10:00:00.000Z', duration: 30, baseSalary: 42000 }, history: [{ date: '2026-09', settingsChecksum: 'abc' }], taxYears: {} },
  stressTool: { settings: { currentAge: 61, retired: true, firstTaxYear: 2026, equityMin: 300000, bondMin: 200000, cashTarget: 50000 } },
  planDocument: { version: 1, madeAt: '2026-09-12' },
  createdAt: '2026-01-01T00:00:00.000Z', lastModified: '2026-09-12T10:00:00.000Z'
};
const DRAFT = { ...JSON.parse(JSON.stringify(LOCKED)), planDetails: { name: 'Stop at 60 · £1,800 a month', description: '' }, isActive: false, decisionTool: { settings: {}, history: [], taxYears: {} }, planDocument: undefined };

const snapshot = () => new Map([...store.docs.entries()].map(([k, v]) => [k, JSON.stringify(v)]));
const without = (json, key) => { const o = JSON.parse(json); delete o[key]; return JSON.stringify(o); };

beforeEach(() => {
  store.docs = new Map([[BASE + 'locked1', JSON.parse(JSON.stringify(LOCKED))], [BASE + 'draft1', JSON.parse(JSON.stringify(DRAFT))]]);
  store.writes = []; store.nextId = 1; store.failAddOn = null; store.adds = 0;
});

describe('saving from a seed never writes an existing plan', () => {
  it('one person: one new document; the only touch on the locked plan is its isActive flag', async () => {
    const before = snapshot();
    const made = await createPlansFromSeed({ seed: seedA(), name: 'Stop at 60 · £1,800 a month', today: SAVED_ON, takenNames: (await loadAllScenarios()).map((s) => s.planDetails.name) }, realStore);
    expect(made.yours.name).toBe('Stop at 60 · £1,800 a month (2)');   // the draft already has that name
    expect(made.activeError).toBeNull();

    const newPath = BASE + made.yours.id;
    expect(before.has(newPath)).toBe(false);
    const toExisting = store.writes.filter((w) => before.has(w.path));
    expect(toExisting).toEqual([{ op: 'batch.update', path: BASE + 'locked1', data: { isActive: false } }]);
    expect(store.writes.filter((w) => w.op === 'add').map((w) => w.path)).toEqual([newPath]);
    expect(store.writes.some((w) => w.op === 'set' || w.op === 'update' || w.op === 'delete')).toBe(false);

    // the locked plan: byte-identical except the flag that says which plan is open
    expect(without(JSON.stringify(store.docs.get(BASE + 'locked1')), 'isActive')).toBe(without(before.get(BASE + 'locked1'), 'isActive'));
    expect(store.docs.get(BASE + 'locked1').isActive).toBe(false);
    expect(store.docs.get(BASE + 'draft1')).toEqual(JSON.parse(before.get(BASE + 'draft1')));

    const made1 = store.docs.get(newPath);
    expect(made1.isActive).toBe(true);
    expect(made1.schemaVersion).toBe(SCHEMA_VERSION);
    expect(made1).not.toHaveProperty('id');
    expect(typeof made1.createdAt).toBe('string');
  });

  it('a couple: two new documents, the partner\'s first; yours links to it and is the open one', async () => {
    const before = snapshot();
    const made = await createPlansFromSeed({ seed: seedBCouple(), name: 'Our try', today: SAVED_ON, takenNames: [] }, realStore);
    const adds = store.writes.filter((w) => w.op === 'add').map((w) => w.path);
    expect(adds).toEqual([BASE + made.partner.id, BASE + made.yours.id]);
    expect(adds.every((p) => !before.has(p))).toBe(true);
    expect(store.docs.get(BASE + made.yours.id).household).toEqual({ partnerScenarioId: made.partner.id });
    expect(store.docs.get(BASE + made.yours.id).isActive).toBe(true);
    expect(store.docs.get(BASE + made.partner.id).isActive).toBe(false);
    expect(store.writes.filter((w) => before.has(w.path)).map((w) => [w.op, w.path, w.data])).toEqual([['batch.update', BASE + 'locked1', { isActive: false }]]);
  });

  it('two saves give two plans (four for a couple), each under its own new id', async () => {
    await createPlansFromSeed({ seed: seedA(), name: 'Try', today: SAVED_ON }, realStore);
    const names = (await loadAllScenarios()).map((s) => s.planDetails.name);
    await createPlansFromSeed({ seed: seedA(), name: 'Try', today: SAVED_ON, takenNames: names }, realStore);
    const all = await loadAllScenarios();
    expect(all.length).toBe(4);
    expect(all.filter((s) => s.planDetails.name.startsWith('Try')).map((s) => s.planDetails.name).sort()).toEqual(['Try', 'Try (2)']);
    expect(all.filter((s) => s.isActive).length).toBe(1);
    expect(new Set(store.writes.filter((w) => w.op === 'add').map((w) => w.path)).size).toBe(2);
  });

  it('your plan fails to save: the partner plan just made is deleted again, and no existing plan was touched', async () => {
    const before = snapshot();
    store.failAddOn = 2;
    await expect(createPlansFromSeed({ seed: seedBCouple(), name: 'Our try', today: SAVED_ON }, realStore)).rejects.toThrow('offline');
    expect(snapshot()).toEqual(before);
    const writes = store.writes.map((w) => w.op);
    expect(writes).toEqual(['add', 'delete']);
    expect(store.writes[1].path).toBe(store.writes[0].path);
  });

  it('the confirm step over the real store: the seed goes only when the plan is made; "Not now" makes nothing', async () => {
    const storage = memoryStorage({ [SEED_KEY]: JSON.stringify(seedA()) });
    const before = snapshot();
    const notNow = await confirmAndCreate(seedA(), { ...realStore, storage, listNames: async () => [], ask: async () => null, warn: () => {}, now: () => SAVED_ON });
    expect(notNow).toEqual({ outcome: 'notNow' });
    expect(snapshot()).toEqual(before);
    expect(storage.has(SEED_KEY)).toBe(false);

    const storage2 = memoryStorage({ [SEED_KEY]: JSON.stringify(seedA()) });
    store.failAddOn = 1;
    const warned = [];
    const answers = ['Mine', 'Mine'];
    const r = await confirmAndCreate(seedA(), { ...realStore, storage: storage2, listNames: async () => (await loadAllScenarios()).map((s) => s.planDetails.name), ask: async () => answers.shift(), warn: (m) => { warned.push(m); expect(storage2.has(SEED_KEY)).toBe(true); }, now: () => SAVED_ON });
    expect(warned).toEqual(['Could not save the plan: offline. Your figures are still waiting; try again.']);
    expect(r.outcome).toBe('made');
    expect(storage2.has(SEED_KEY)).toBe(false);
    expect((await loadAllScenarios()).length).toBe(3);
  });
});
