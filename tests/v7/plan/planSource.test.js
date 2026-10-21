/**
 * T3, T6, T13 (research/v7/your-plan.md 9): the plan source reads and never writes. The Firebase functions are fakes
 * handed in, so every call is seen: no write function is ever called (there is none to call: the fakes hold only the
 * read-only names, and a call to anything else would throw). The upgrade runs in memory; its `write` flag is ignored.
 * Nobody signed in: the window's plans are read with getItem only. Signing out, idle and pagehide clear the plans. The
 * plans never reach the draft store. (The hand-over seed a sign-out used to delete is retired: road-to-7.md step 7.)
 */
import { describe, it, expect, vi } from 'vitest';
import { startPlanSource, upgradedList, windowPlans, GUEST_PLANS_KEY } from '../../../src/v7/effects/planSource.js';
import { draftOf, saveDraft } from '../../../src/v7/effects/draftStore.js';
import { createStore } from '../../../src/v7/effects/store.js';
import { initialState } from '../../../src/v7/state/initial.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { A } from '../../../src/v7/state/actions.js';
import { ACTIVITY_KEY } from '../../../src/v7/effects/activity.js';
import { corpus, TODAY } from './_plans.js';

const C = corpus();

/** A storage that records every call, so a write is seen. */
function storage(start = {}) {
  const map = new Map(Object.entries(start));
  const calls = [];
  return {
    calls,
    getItem(k) { calls.push(['getItem', k]); return map.has(k) ? map.get(k) : null; },
    setItem(k, v) { calls.push(['setItem', k]); map.set(k, String(v)); },
    removeItem(k) { calls.push(['removeItem', k]); map.delete(k); },
    has: (k) => map.has(k), raw: (k) => map.get(k)
  };
}

/** Fake Firebase: only the read-only names exist. `user` is what onAuthStateChanged reports; `docs` what getDocs returns. */
function fakeFirebase({ user = null, docs = [], fail = false } = {}) {
  const calls = [];
  let listener = null;
  const fb = {
    calls,
    isFirebaseConfigured: () => true,
    initializeApp: (cfg, name) => { calls.push(['initializeApp', name]); return { cfg, name }; },
    getAuth: (app) => { calls.push(['getAuth']); return { app, currentUser: null }; },
    setPersistence: (auth, p) => { calls.push(['setPersistence', p]); return Promise.resolve(); },
    browserLocalPersistence: 'LOCAL',
    onAuthStateChanged: (auth, fn) => { calls.push(['onAuthStateChanged']); listener = fn; Promise.resolve().then(() => fn(user)); return () => { listener = null; }; },
    signOut: (auth) => { calls.push(['signOut']); user = null; if (listener) listener(null); return Promise.resolve(); },
    getFirestore: (app) => { calls.push(['getFirestore']); return { app }; },
    collection: (db, ...path) => { calls.push(['collection', path.join('/')]); return { path: path.join('/') }; },
    getDocs: (ref) => { calls.push(['getDocs', ref.path]); if (fail) return Promise.reject(new Error('offline')); return Promise.resolve({ forEach: (fn) => docs.forEach((d) => fn({ id: d.id, data: () => { const { id, ...rest } = d; return rest; } })) }); },
    report: (u) => { user = u; if (listener) listener(u); }
  };
  return fb;
}

function page({ fb, local = storage(), session = storage(), hash = '#/plans' } = {}) {
  const store = createStore(initialState({ today: TODAY, build: 'test' }), reduce);
  const listeners = {};
  const win = {
    addEventListener: (e, fn) => { (listeners[e] ||= []).push(fn); },
    removeEventListener: (e, fn) => { listeners[e] = (listeners[e] || []).filter((f) => f !== fn); },
    setInterval: (fn) => { listeners.interval = fn; return 1; },
    clearInterval: () => { listeners.interval = null; },
    document: { visibilityState: 'visible', addEventListener: (e, fn) => { (listeners['doc:' + e] ||= []).push(fn); }, removeEventListener: () => {} }
  };
  const fire = (e, ev = {}) => (listeners[e] || []).forEach((fn) => fn(ev));
  const nowMs = Date.parse(TODAY + 'T14:03:00');
  const stop = startPlanSource(store, { win, local, session, now: () => new Date(nowMs), fb });
  return { store, win, fire, listeners, stop, local, session };
}
const tick = () => new Promise((r) => setTimeout(r, 0));
const WRITE_NAMES = ['setDoc', 'updateDoc', 'addDoc', 'deleteDoc', 'writeBatch', 'runTransaction', 'doc'];

describe('the adapter is read-only (T3)', () => {
  it('signed in with a confirmed email: one getDocs of users/{uid}/scenarios, the plans brought up to date in memory, nothing written', async () => {
    const fb = fakeFirebase({ user: { uid: 'u1', email: 'a@b.c', emailVerified: true }, docs: Object.values(C) });
    const { store, stop } = page({ fb });
    expect(store.getState().session.kind).toBe('checking');
    await tick(); await tick();
    expect(store.getState().session).toEqual({ kind: 'in', email: 'a@b.c', signingOut: false });
    const plans = store.getState().plans;
    expect(plans.status).toBe('read');
    expect(plans.source).toBe('account');
    expect(plans.readAt).toBe('14:03');
    expect(plans.list.length).toBe(12);
    // the upgrade ran in memory: every committed plan lacks a schemaVersion and comes back current, but nothing is written back
    for (const e of plans.list) { expect(e.plan.schemaVersion).toBe(3); expect(e.newer).toBe(false); expect(e.failed).toBe(false); }
    expect(fb.calls.filter((c) => c[0] === 'getDocs')).toEqual([['getDocs', 'users/u1/scenarios']]);
    for (const c of fb.calls) expect(WRITE_NAMES, `the adapter called ${c[0]}`).not.toContain(c[0]);
    for (const n of WRITE_NAMES) expect(fb[n]).toBeUndefined();
    stop();
  });
  it('an unconfirmed email: no read is attempted', async () => {
    const fb = fakeFirebase({ user: { uid: 'u1', email: 'a@b.c', emailVerified: false }, docs: Object.values(C) });
    const { store, stop } = page({ fb });
    await tick(); await tick();
    expect(store.getState().session.kind).toBe('unverified');
    expect(store.getState().plans).toBe(null);
    expect(fb.calls.some((c) => c[0] === 'getDocs')).toBe(false);
    stop();
  });
  it('the read fails: "could not read", nothing changed; "Try again" reads again', async () => {
    const fb = fakeFirebase({ user: { uid: 'u1', email: 'a@b.c', emailVerified: true }, fail: true });
    const { store, stop } = page({ fb });
    await tick(); await tick();
    expect(store.getState().plans.status).toBe('failed');
    store.dispatch({ type: A.PLANS_READING });
    await tick(); await tick();
    expect(fb.calls.filter((c) => c[0] === 'getDocs').length).toBe(2);
    stop();
  });
  it('a plan newer than this code, and one whose upgrade fails, are shown as saved', () => {
    const plan = C['03-gilt-ladder-runup'];
    const list = upgradedList([{ ...plan, schemaVersion: 99 }, { ...plan, id: 'bad', stressTool: 'not an object' }, null, { noId: true }], new Date(TODAY + 'T12:00:00'));
    expect(list.length).toBe(2);
    expect(list[0].newer).toBe(true);
    expect(list[0].plan.schemaVersion).toBe(99);
    expect(typeof list[1].failed).toBe('boolean');
  });
});

describe('nobody signed in: the window\'s plans, read with getItem only (owner question 5)', () => {
  it('reads pt_guest_scenarios as text, upgrades in memory, and never writes it', async () => {
    const text = JSON.stringify([C['03-gilt-ladder-runup'], C['11-guest-demo']]);
    const session = storage({ [GUEST_PLANS_KEY]: text });
    const fb = fakeFirebase({ user: null });
    const { store, stop } = page({ fb, session });
    await tick(); await tick();
    expect(store.getState().session.kind).toBe('nobody');
    const plans = store.getState().plans;
    expect(plans.source).toBe('window');
    expect(plans.list.map((e) => e.plan.id)).toEqual([C['03-gilt-ladder-runup'].id, 'guest-k3v9x1qa']);
    expect(plans.usedUp).toBe(false);
    expect(session.calls.filter((c) => c[1] === GUEST_PLANS_KEY).every((c) => c[0] === 'getItem')).toBe(true);
    expect(session.raw(GUEST_PLANS_KEY)).toBe(text);
    stop();
  });
  it('the free time used up is said; unreadable text is an empty window', async () => {
    const local = storage({ pt_guest_minutes: '180' });
    const session = storage({ [GUEST_PLANS_KEY]: '{not json' });
    const { store, stop } = page({ fb: fakeFirebase({ user: null }), local, session });
    await tick(); await tick();
    expect(store.getState().plans.list).toEqual([]);
    expect(store.getState().plans.usedUp).toBe(true);
    expect(windowPlans(null)).toEqual([]);
    expect(windowPlans({ getItem() { throw new Error('denied'); } })).toEqual([]);
    stop();
  });
});

describe('memory only (T6): pagehide, becoming nobody, sign-out and idle clear the plans; the plans never reach the draft', () => {
  const signedIn = () => fakeFirebase({ user: { uid: 'u1', email: 'a@b.c', emailVerified: true }, docs: [C['03-gilt-ladder-runup']] });
  it('pagehide clears; pageshow from the cache reads again', async () => {
    const fb = signedIn();
    const { store, fire, stop } = page({ fb });
    await tick(); await tick();
    expect(store.getState().plans.list.length).toBe(1);
    fire('pagehide');
    expect(store.getState().plans).toBe(null);
    expect(store.getState().session.kind).toBe('checking');
    fire('pageshow', { persisted: true });
    await tick(); await tick();
    expect(store.getState().session.kind).toBe('in');
    expect(store.getState().plans.list.length).toBe(1);
    stop();
  });
  it('the person becoming nobody (signed out in the planner) clears the plans at once; nothing in storage is touched', async () => {
    const fb = signedIn();
    const local = storage({ pt_other: '1' });
    const session = storage({ pt_other: '1' });
    const { store, stop } = page({ fb, local, session });
    await tick(); await tick();
    fb.report(null);
    expect(store.getState().plans.list).toEqual([]);           // the window's (empty) plans now
    expect(store.getState().session.kind).toBe('nobody');
    expect(local.calls.filter(([c]) => c !== 'getItem')).toEqual([]);
    expect(session.calls.filter(([c]) => c !== 'getItem')).toEqual([]);
    stop();
  });
  it('"Sign out" signs out here; the idle sign-out does the same after an hour with no activity anywhere; neither writes or removes anything in storage', async () => {
    const fb = signedIn();
    const local = storage({ [ACTIVITY_KEY]: String(Date.parse(TODAY + 'T14:03:00') - 61 * 60 * 1000) });
    const { store, listeners, stop } = page({ fb, local });
    await tick(); await tick();
    expect(store.getState().plans.list.length).toBe(1);
    listeners.interval();                                       // the idle check: the last activity was 61 minutes ago
    await tick(); await tick();
    expect(fb.calls.some((c) => c[0] === 'signOut')).toBe(true);
    expect(store.getState().session.kind).toBe('nobody');
    expect(local.calls.filter(([c]) => c !== 'getItem')).toEqual([]);
    stop();
    const fb2 = signedIn();
    const local2 = storage({ [ACTIVITY_KEY]: String(Date.parse(TODAY + 'T14:02:00')) });
    const p2 = page({ fb: fb2, local: local2 });
    await tick(); await tick();
    p2.listeners.interval();                                    // a minute ago: nothing happens
    expect(fb2.calls.some((c) => c[0] === 'signOut')).toBe(false);
    p2.store.dispatch({ type: A.SESSION_OUT });
    await tick(); await tick();
    expect(fb2.calls.some((c) => c[0] === 'signOut')).toBe(true);
    expect(local2.calls.filter(([c]) => c !== 'getItem')).toEqual([]);
    expect(p2.store.getState().session.kind).toBe('nobody');
    p2.stop();
  });
  it('the plans never reach the draft store (your-plan.md 3.8)', async () => {
    const fb = signedIn();
    const { store, stop } = page({ fb });
    await tick(); await tick();
    const state = store.getState();
    expect(Object.keys(draftOf(state))).not.toContain('plans');
    const session = storage();
    saveDraft(session, draftOf(state));
    expect(session.has('pt_v7_draft')).toBe(false);            // nothing typed: nothing written
    expect(JSON.stringify(session.raw('pt_v7_draft') || '')).not.toContain('planDocument');
    stop();
  });
  it('without Firebase configured: nobody, and the window\'s plans', async () => {
    const fb = { ...fakeFirebase({ user: null }), isFirebaseConfigured: () => false };
    const { store, stop } = page({ fb });
    expect(store.getState().session.kind).toBe('nobody');
    expect(store.getState().plans.source).toBe('window');
    expect(fb.calls.some((c) => c[0] === 'initializeApp')).toBe(false);
    stop();
  });
});
