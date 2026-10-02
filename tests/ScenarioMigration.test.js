import { describe, it, expect, vi, beforeEach } from 'vitest';

// A fake Firestore for the read/write path at the bottom of this file (6.15.0): documents by path, every
// call recorded. The pure normalizeScenario tests above it do not touch it.
const fs = vi.hoisted(() => {
  const clone = (v) => (v === undefined ? undefined : JSON.parse(JSON.stringify(v)));
  const state = { docs: new Map(), calls: [], n: 0, failSetDoc: false };
  const setPath = (obj, path, value) => { const parts = path.split('.'); let cur = obj; for (let i = 0; i < parts.length - 1; i++) { if (!cur[parts[i]] || typeof cur[parts[i]] !== 'object') cur[parts[i]] = {}; cur = cur[parts[i]]; } cur[parts[parts.length - 1]] = value; };
  const snap = (path) => ({ id: path.split('/').pop(), exists: () => state.docs.has(path), data: () => clone(state.docs.get(path)) });
  const api = {
    doc: (db, ...segs) => ({ path: segs.join('/') }),
    collection: (db, ...segs) => ({ path: segs.join('/') }),
    getDoc: async (ref) => { state.calls.push({ op: 'getDoc', path: ref.path }); return snap(ref.path); },
    getDocs: async (coll) => { const found = [...state.docs.keys()].filter((k) => k.startsWith(coll.path + '/') && !k.slice(coll.path.length + 1).includes('/')); return { forEach: (fn) => found.forEach((k) => fn(snap(k))) }; },
    setDoc: async (ref, data, options) => { state.calls.push({ op: 'setDoc', path: ref.path, data: clone(data), options }); if (state.failSetDoc) throw new Error('offline'); state.docs.set(ref.path, options && options.merge ? { ...(state.docs.get(ref.path) || {}), ...clone(data) } : clone(data)); },
    updateDoc: async (ref, data) => { state.calls.push({ op: 'updateDoc', path: ref.path, data: clone(data) }); if (!state.docs.has(ref.path)) throw new Error('not-found'); const cur = clone(state.docs.get(ref.path)); for (const [k, v] of Object.entries(data)) setPath(cur, k, clone(v)); state.docs.set(ref.path, cur); },
    addDoc: async (coll, data) => { const id = 'new' + (++state.n); state.calls.push({ op: 'addDoc', path: coll.path + '/' + id, data: clone(data) }); state.docs.set(coll.path + '/' + id, clone(data)); return { id }; },
    deleteDoc: async (ref) => { state.docs.delete(ref.path); },
    writeBatch: () => { const ops = []; return { update: (ref, data) => ops.push(() => api.updateDoc(ref, data)), delete: (ref) => ops.push(() => api.deleteDoc(ref)), commit: async () => { for (const o of ops) await o(); } }; },
    query: (c) => c, where: () => null
  };
  return { state, api, clone };
});
vi.mock('firebase/firestore', () => fs.api);
vi.mock('../src/firebase/config.js', () => ({ db: {}, auth: null, app: null, isFirebaseConfigured: () => true }));
vi.mock('../src/firebase/AuthService.js', () => ({ getCurrentUser: () => ({ uid: 'u1' }), isGuest: () => false }));

import { normalizeScenario, upgradeScenario } from '../src/firebase/scenarioMigration.js';
import { loadAllScenarios, loadScenario, saveScenario, createScenario, setActiveScenarioDoc, isScenarioNewerThanApp, scenarioUpgradeError } from '../src/firebase/FirestoreService.js';
import { SCHEMA_VERSION, PLAN_NEWER_MESSAGE, PLAN_NEWER_CODE, PLAN_NEWER_EVENT } from '../src/storage/schema.js';
import { MIGRATIONS } from '../src/storage/migrations.js';
import { handoffPayload } from '../src/services/GuestMeter.js';

describe('normalizeScenario', () => {
  it('leaves a clean nested scenario untouched (migrated=false)', () => {
    const clean = {
      id: 'a',
      isActive: true,
      enabledTools: ['stress', 'decision'],
      planDetails: { name: 'Plan', description: 'd' },
      decisionTool: { settings: { equityMin: 1 }, history: [{ m: 1 }], taxYears: { '26/27': {} } },
      stressTool: { settings: { equityMin: 2 } }
    };
    const { scenario, migrated } = normalizeScenario(clean);
    expect(migrated).toBe(false);
    expect(scenario).toBe(clean);
  });

  it('recovers data from phantom dot-notation fields (the persistence bug)', () => {
    // What the buggy setDoc(merge) writes: nested map holds creation defaults,
    // while the user's real edits sit in literal "decisionTool.settings" fields.
    const raw = {
      id: 'x',
      isActive: true,
      enabledTools: ['decision'],
      createdAt: 't0',
      lastModified: 't1',
      planDetails: { name: 'Orig', description: '' },
      decisionTool: { settings: { equityMin: 250000 }, history: [], taxYears: {} },
      stressTool: { settings: { equityMin: 0 } },
      // phantom fields = the user's actual saved edits
      'decisionTool.settings': { equityMin: 600000 },
      'decisionTool.history': [{ month: '2026-07' }],
      'decisionTool.taxYears': { '26/27': { pa: 12570 } },
      'stressTool.settings': { equityMin: 999 },
      'planDetails.name': 'Renamed Plan'
    };
    const { scenario, migrated } = normalizeScenario(raw);
    expect(migrated).toBe(true);
    // phantom (latest) wins over nested (creation defaults)
    expect(scenario.decisionTool.settings.equityMin).toBe(600000);
    expect(scenario.decisionTool.history).toEqual([{ month: '2026-07' }]);
    expect(scenario.decisionTool.taxYears['26/27'].pa).toBe(12570);
    expect(scenario.stressTool.settings.equityMin).toBe(999);
    expect(scenario.planDetails.name).toBe('Renamed Plan');
    // metadata preserved, id kept, no dotted keys remain
    expect(scenario.id).toBe('x');
    expect(scenario.createdAt).toBe('t0');
    expect(Object.keys(scenario).some((k) => k.includes('.'))).toBe(false);
  });

  it('migrates a legacy-schema scenario into the nested shape', () => {
    const legacy = {
      id: 'old',
      isActive: false,
      enabledTools: ['stress', 'decision'],
      createdAt: 't0',
      lastModified: 't1',
      name: 'Legacy Plan',
      description: 'from before restructure',
      decisionSettings: { equityMin: 300000 },
      stressSettings: { equityMin: 400000 },
      taxYears: { '25/26': { pa: 12570 } }
    };
    const { scenario, migrated } = normalizeScenario(legacy);
    expect(migrated).toBe(true);
    expect(scenario.planDetails.name).toBe('Legacy Plan');
    expect(scenario.planDetails.description).toBe('from before restructure');
    expect(scenario.decisionTool.settings.equityMin).toBe(300000);
    expect(scenario.decisionTool.history).toEqual([]);
    expect(scenario.decisionTool.taxYears['25/26'].pa).toBe(12570);
    expect(scenario.stressTool.settings.equityMin).toBe(400000);
    // legacy top-level keys are gone from the cleaned object
    expect('decisionSettings' in scenario).toBe(false);
    expect('name' in scenario).toBe(false);
  });

  it('handles null/invalid input gracefully', () => {
    expect(normalizeScenario(null)).toEqual({ scenario: null, migrated: false });
  });

  it('a migrated document keeps EVERY other root key and the rest of decisionTool/stressTool (6.13.0)', () => {
    // Before: the rebuild used a fixed key list, so a plan with one phantom field lost its strategy, plan
    // document, journey, transition, holdings, accumulation, budget, household and plan of record — and the
    // follow-up setDoc (no merge) made that permanent.
    const raw = {
      id: 'k', isActive: true, enabledTools: ['stress'], createdAt: 't0', lastModified: 't1',
      planDetails: { name: 'Kept', description: 'd' },
      decisionTool: { settings: { equityMin: 1 }, history: [], taxYears: {}, planOfRecord: { rows: [1] }, planOfRecordArchive: [{ rows: [] }] },
      stressTool: { settings: { equityMin: 2 } },
      strategy: { id: 'full-il-gilt', params: { cashYears: 3 } },
      planDocument: { version: 2, holdingsAtLock: { lines: [] } }, planDocumentArchive: [{ version: 1 }],
      journey: [{ stage: 'saving', at: 't0' }], transition: { done: { 'gilt:TR29': '2026-09-01' } },
      holdings: { version: 1, updatedAt: '2026-09-16', source: 'typed', offerDismissed: false, lines: [{ ticker: 'TR29', wrapper: 'SIPP', value: 39690 }] },
      accumulationTool: { settings: { potNow: 5 }, history: [{ date: '2026-08', sipp: 1 }] },
      budgetTool: { settings: { version: 3 } }, household: { partnerScenarioId: 'p1' },
      // the phantom fields that trigger the migration
      'stressTool.settings': { equityMin: 999 },
      'accumulationTool.history': [{ date: '2026-08', sipp: 1 }, { date: '2026-09', sipp: 2 }],
      'household.partnerScenarioId': 'p2'
    };
    const { scenario, migrated } = normalizeScenario(raw);
    expect(migrated).toBe(true);
    expect(scenario.stressTool.settings.equityMin).toBe(999);                 // phantom wins
    expect(scenario.decisionTool.settings.equityMin).toBe(1);                 // nested kept
    expect(scenario.decisionTool.planOfRecord).toEqual({ rows: [1] });        // the rest of decisionTool kept
    expect(scenario.decisionTool.planOfRecordArchive.length).toBe(1);
    for (const k of ['strategy', 'planDocument', 'planDocumentArchive', 'journey', 'transition', 'holdings', 'budgetTool']) expect(scenario[k]).toEqual(raw[k]);
    expect(scenario.accumulationTool.settings).toEqual({ potNow: 5 });
    expect(scenario.accumulationTool.history.length).toBe(2);                 // phantom folded onto its path
    expect(scenario.household.partnerScenarioId).toBe('p2');
    expect(scenario.id).toBe('k'); expect(scenario.createdAt).toBe('t0'); expect(scenario.enabledTools).toEqual(['stress']);
    expect(Object.keys(scenario).some((k) => k.includes('.'))).toBe(false);
    // the raw document was not mutated
    expect(raw.stressTool.settings.equityMin).toBe(2);
    expect(raw.accumulationTool.history.length).toBe(1);
  });

  it('a phantom path under a root key that does not exist yet is created', () => {
    const { scenario } = normalizeScenario({ id: 'z', decisionTool: {}, stressTool: {}, 'household.partnerScenarioId': 'p9', 'planDetails.name': 'N' });
    expect(scenario.household).toEqual({ partnerScenarioId: 'p9' });
    expect(scenario.planDetails).toEqual({ name: 'N', description: '' });
    expect(scenario.decisionTool).toEqual({ settings: {}, history: [], taxYears: {} });
    expect(scenario.isActive).toBe(false);
  });
});


// ============================================================================
// 6.15.0 — the schema version on the read and write paths (fake Firestore above)
// ============================================================================

const PATH = (id) => 'users/u1/scenarios/' + id;
const put = (id, data) => fs.state.docs.set(PATH(id), fs.clone(data));
const stored = (id) => fs.clone(fs.state.docs.get(PATH(id)));
const callsOf = (op) => fs.state.calls.filter((c) => c.op === op);

/** A version-0 plan carrying EVERY root key the app writes, one nobody has heard of, and no phantom fields. */
const fullPlan = () => ({
  isActive: true, enabledTools: ['stress', 'decision'], createdAt: '2026-01-01T00:00:00.000Z', lastModified: '2026-02-01T00:00:00.000Z',
  planDetails: { name: 'Everything', description: 'd' },
  strategy: { id: 'full-il-gilt', params: { cashYears: 3 }, lockedAt: 't', engineVersion: '6.4.0' },
  decisionTool: { settings: { equityMin: 1, locked: true, lockedAt: 't' }, history: [{ date: '2026-08', settingsChecksum: 'abc' }], taxYears: { '26/27': { yearSetupComplete: true } }, planOfRecord: { savedAt: 't', drawdown: [1] }, planOfRecordArchive: [{ savedAt: 's' }] },
  stressTool: { settings: { equityMin: 2, strategyId: 'full-il-gilt', strategyParams: { cashYears: 3 } } },
  budgetTool: { settings: { version: 1, lines: [{ id: 'l1', amount: 5 }] } },
  accumulationTool: { settings: { potNow: 5 }, history: [{ date: '2026-08', sipp: 1 }] },
  holdings: { version: 1, updatedAt: '2026-09-16', source: 'typed', offerDismissed: false, lines: [{ wrapper: 'SIPP', ticker: 'TR29', name: null, sedol: null, units: null, value: 39690, ocf: null, contribution: null, subClass: null, kind: 'gilt', asOf: null }] },
  planDocument: { version: 2, planName: 'Everything', strategy: { r: { cones: [1, 2, 3] } } },
  planDocumentArchive: [{ version: 1, archivedAt: 'a' }],
  journey: [{ stage: 'saving', at: 't0' }], transition: { done: { 'gilt:TR29': '2026-09-01' } },
  household: { partnerScenarioId: 'p1' },
  somethingFromTheFuture: { keep: ['me'] }
});

describe('the read path stamps and writes back, and drops nothing (6.15.0)', () => {
  beforeEach(() => { fs.state.docs.clear(); fs.state.calls.length = 0; fs.state.failSetDoc = false; });

  it('a version-0 plan is rewritten ONCE as a full replace, with every root key and sub-key it had', async () => {
    const plan = fullPlan(); put('a', plan);
    const [loaded] = await loadAllScenarios();
    expect(loaded.id).toBe('a');
    expect(loaded.schemaVersion).toBe(SCHEMA_VERSION);
    const writes = callsOf('setDoc');
    expect(writes.length).toBe(1);
    expect(writes[0].path).toBe(PATH('a'));
    expect(writes[0].options).toBeUndefined();            // no merge: a full replace
    const after = stored('a');
    expect('id' in after).toBe(false);                    // the doc id is never written into the document
    expect(after).toEqual({ ...plan, schemaVersion: SCHEMA_VERSION });   // nothing dropped, nothing else changed
    expect(JSON.stringify(after.planDocument)).toBe(JSON.stringify(plan.planDocument));
    expect(after.lastModified).toBe(plan.lastModified);   // an upgrade is not an edit by the person
    // every later load: nothing to do, nothing written
    fs.state.calls.length = 0;
    const again = await loadScenario('a');
    expect(again).toEqual({ id: 'a', ...after });
    expect(callsOf('setDoc').length).toBe(0);
  });

  it('a plan with phantom dotted fields is repaired and stamped in the same single write', async () => {
    put('b', { ...fullPlan(), 'stressTool.settings': { equityMin: 999 }, 'household.partnerScenarioId': 'p2' });
    const loaded = await loadScenario('b');
    expect(callsOf('setDoc').length).toBe(1);
    const after = stored('b');
    expect(Object.keys(after).some((k) => k.includes('.'))).toBe(false);
    expect(after.schemaVersion).toBe(SCHEMA_VERSION);
    expect(after.stressTool.settings).toEqual({ equityMin: 999 });
    expect(after.household.partnerScenarioId).toBe('p2');
    for (const k of ['strategy', 'planDocument', 'planDocumentArchive', 'journey', 'transition', 'holdings', 'budgetTool', 'accumulationTool', 'decisionTool', 'somethingFromTheFuture']) expect(after[k], k).toEqual(fullPlan()[k]);
    expect(loaded.stressTool.settings.equityMin).toBe(999);
  });

  it('a failed write-back still opens the upgraded plan; the stored one is as it was and the next load tries again', async () => {
    const plan = fullPlan(); put('c', plan);
    fs.state.failSetDoc = true;
    const loaded = await loadScenario('c');
    expect(loaded.schemaVersion).toBe(SCHEMA_VERSION);
    expect(stored('c')).toEqual(plan);
    fs.state.failSetDoc = false;
    await loadScenario('c');
    expect(stored('c').schemaVersion).toBe(SCHEMA_VERSION);
  });

  it('a migration that throws leaves the stored plan untouched and opens it as it is — never an empty list', async () => {
    const plan = fullPlan(); put('d', plan);
    const dotted = { ...fullPlan(), 'planDetails.name': 'Renamed' }; put('e', dotted);
    const orig = MIGRATIONS[0].up;
    MIGRATIONS[0].up = () => { throw new Error('boom'); };
    try {
      const all = await loadAllScenarios();
      expect(all.length).toBe(2);
      expect(callsOf('setDoc').length).toBe(0);
      expect(stored('d')).toEqual(plan);
      expect(stored('e')).toEqual(dotted);                 // not even the phantom-field repair is written
      const d = all.find((x) => x.id === 'd');
      expect(d).toEqual({ id: 'd', ...plan });
      expect('schemaVersion' in d).toBe(false);
      expect(all.find((x) => x.id === 'e').planDetails.name).toBe('Renamed');   // still readable: normalised in memory
      expect(scenarioUpgradeError('d')).toBeInstanceOf(Error);
      expect(scenarioUpgradeError('d').message).toBe('boom');
      // it can still be saved as an ordinary version-0 plan
      await saveScenario('d', { 'planDetails.name': 'Still mine' });
      expect(stored('d').planDetails.name).toBe('Still mine');
    } finally { MIGRATIONS[0].up = orig; }
    await loadAllScenarios();                                // the fixed code upgrades it on the next load
    expect(scenarioUpgradeError('d')).toBeNull();
    expect(stored('d').schemaVersion).toBe(SCHEMA_VERSION);
    expect(stored('e').schemaVersion).toBe(SCHEMA_VERSION);
  });
});

describe('a plan newer than this code is never written to (6.15.0)', () => {
  beforeEach(() => { fs.state.docs.clear(); fs.state.calls.length = 0; fs.state.failSetDoc = false; });

  it('loading one writes nothing, flags it, and every save of it is refused with the plain message', async () => {
    const plan = { ...fullPlan(), schemaVersion: SCHEMA_VERSION + 1, 'planDetails.name': 'phantom' }; put('n', plan);
    const events = []; const on = (e) => events.push(e.detail.scenarioId);
    window.addEventListener(PLAN_NEWER_EVENT, on);
    try {
      expect(isScenarioNewerThanApp('n')).toBe(false);
      const loaded = await loadScenario('n');
      expect(loaded.schemaVersion).toBe(SCHEMA_VERSION + 1);
      expect(callsOf('setDoc').length).toBe(0);
      expect(isScenarioNewerThanApp('n')).toBe(true);
      await loadScenario('n');
      expect(events).toEqual(['n']);                       // told once
      let err = null;
      try { await saveScenario('n', { 'stressTool.settings': { equityMin: 0 } }); } catch (e) { err = e; }
      expect(err && err.code).toBe(PLAN_NEWER_CODE);
      expect(err.message).toBe(PLAN_NEWER_MESSAGE);
      expect(err.scenarioId).toBe('n');
      expect(callsOf('updateDoc').length).toBe(0);
      expect(stored('n')).toEqual(plan);
    } finally { window.removeEventListener(PLAN_NEWER_EVENT, on); }
  });

  it('a tab left open across a deploy: the plan was current when loaded, was upgraded elsewhere, and the save is refused', async () => {
    // A draft: since 6.20.2 the store also refuses a change to a LOCKED plan's settings (tests/lockedPlanStore.test.js).
    put('s', { ...fullPlan(), schemaVersion: SCHEMA_VERSION, decisionTool: { ...fullPlan().decisionTool, settings: { equityMin: 1 } } });
    await loadScenario('s');
    expect(isScenarioNewerThanApp('s')).toBe(false);
    await saveScenario('s', { 'stressTool.settings': { equityMin: 5 } });        // an ordinary save goes through
    expect(stored('s').stressTool.settings).toEqual({ equityMin: 5 });
    expect(stored('s').decisionTool.settings).toEqual({ equityMin: 1 });           // a dotted key is a nested path
    const newer = { ...stored('s'), schemaVersion: SCHEMA_VERSION + 1, stressTool: { settings: { movedKey: 1 } } };
    put('s', newer);                                                               // the new version, in another tab
    fs.state.calls.length = 0;
    await expect(saveScenario('s', { 'stressTool.settings': { equityMin: 6 } })).rejects.toMatchObject({ code: PLAN_NEWER_CODE, message: PLAN_NEWER_MESSAGE });
    expect(callsOf('updateDoc').length).toBe(0);
    expect(callsOf('getDoc').length).toBe(1);                                      // refused outright, not retried
    expect(stored('s')).toEqual(newer);
    expect(isScenarioNewerThanApp('s')).toBe(true);
    fs.state.calls.length = 0;
    await expect(saveScenario('s', { holdings: { lines: [] } })).rejects.toMatchObject({ code: PLAN_NEWER_CODE });
    expect(fs.state.calls.length).toBe(0);                                         // known now: not even a read
  });

  it('the person can still switch to another plan', async () => {
    put('n', { ...fullPlan(), schemaVersion: SCHEMA_VERSION + 1, isActive: true });
    put('o', { ...fullPlan(), schemaVersion: SCHEMA_VERSION, isActive: false });
    await loadAllScenarios();
    await saveScenario('n', { isActive: false });
    expect(stored('n').isActive).toBe(false);
    put('n', { ...stored('n'), isActive: true });
    await setActiveScenarioDoc('o');
    expect(stored('n').isActive).toBe(false);
    expect(stored('o').isActive).toBe(true);
    expect(stored('n').schemaVersion).toBe(SCHEMA_VERSION + 1);
    expect(stored('n').stressTool).toEqual(fullPlan().stressTool);
  });
});

describe('a plan is created in today\'s shape — new, duplicated or handed over from guest mode (6.15.0)', () => {
  beforeEach(() => { fs.state.docs.clear(); fs.state.calls.length = 0; fs.state.failSetDoc = false; });

  it('a guest plan stashed under an older version arrives in the account upgraded, with everything it had', async () => {
    const guestPlan = { ...fullPlan(), id: 'guest-abc', 'planDetails.name': 'Typed as a guest' };
    delete guestPlan.strategy;
    const { scenarios } = handoffPayload([guestPlan], '2026-09-30T00:00:00.000Z');
    expect('id' in scenarios[0]).toBe(false);
    const id = await createScenario({ ...scenarios[0], isActive: true });            // what importGuestHandoff does
    const after = stored(id);
    expect(after.schemaVersion).toBe(SCHEMA_VERSION);
    expect(Object.keys(after).some((k) => k.includes('.'))).toBe(false);
    expect(after.planDetails.name).toBe('Typed as a guest');                           // the phantom (latest) name wins
    expect(after.strategy.id).toBe('pots-and-valves');
    for (const k of ['planDocument', 'planDocumentArchive', 'journey', 'transition', 'holdings', 'budgetTool', 'accumulationTool', 'decisionTool', 'somethingFromTheFuture']) expect(after[k], k).toEqual(fullPlan()[k]);
    fs.state.calls.length = 0;
    await loadScenario(id);
    expect(callsOf('setDoc').length).toBe(0);                                          // already current: no rewrite on first load
  });

  it('the hand-off payload carries the version of a current guest plan', () => {
    const { scenarios } = handoffPayload([{ id: 'guest-1', isActive: true, schemaVersion: SCHEMA_VERSION, planDetails: { name: 'G' } }], 't');
    expect(scenarios[0].schemaVersion).toBe(SCHEMA_VERSION);
  });

  it('upgradeScenario is what both do: normalise, then the chain', () => {
    const u = upgradeScenario({ id: 'x', name: 'Legacy', decisionSettings: { equityMin: 3 }, stressSettings: { pacwMin: 4 } }, { now: new Date('2026-09-30T08:00:00Z') });
    expect(u.write).toBe(true); expect(u.from).toBe(0); expect(u.to).toBe(SCHEMA_VERSION); expect(u.error).toBeNull(); expect(u.newer).toBe(false);
    expect(u.scenario.planDetails.name).toBe('Legacy');
    expect(u.scenario.stressTool.settings).toEqual({ pacwMin: 4, equityMin: 4, chargesPct: 0.5 });   // 6.19.0: unlocked → the default charge
    expect(u.scenario.decisionTool.settings).toEqual({ equityMin: 3 });
    expect(u.scenario.schemaVersion).toBe(SCHEMA_VERSION);
  });
});
