/**
 * Coming back to where you were (7.1.0; research/v7/after-7.md J2): effects/place.js and state/place.js.
 *
 *   - places and ways back are checked: a plan id and a step name, or an answer's step; nothing else is kept;
 *   - keep → sign in → back: "account/return" keeps the way back in the window and opens "Your account"; signed in, an
 *     answer's way back opens it again; a plan kept in the window is brought in at once and opened by its new id at its
 *     step; leaving the account page first lets the way back go; the header's "Your account" alone changes nothing;
 *   - land where you left off: the window's place first, then the account's, a closed or gone plan passed over for "Your
 *     plans"; nobody signed in, or any address of its own: the questions; the place is kept while signed in (window and
 *     account), the signed-in note set and cleared;
 *   - the plan source uses the default Firebase app (the classic planner's), and carries a sign-in kept under the old name.
 */
import { describe, it, expect } from 'vitest';
import { createStore } from '../../../src/v7/effects/store.js';
import { initialState } from '../../../src/v7/state/initial.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { A } from '../../../src/v7/state/actions.js';
import { parse, format } from '../../../src/v7/router/routes.js';
import { cleanPlace, cleanBack, backHref, placeHref } from '../../../src/v7/state/place.js';
import { startPlace, landingFor, hasSignedInHint, RETURN_KEY, PLACE_KEY, SIGNED_IN_KEY } from '../../../src/v7/effects/place.js';
import { startPlanSource, upgradedList, OLD_APP_NAME } from '../../../src/v7/effects/planSource.js';

const TODAY = '2026-10-02';
const NOW = new Date('2026-10-02T14:03:00.000Z');
const tick = async (n = 8) => { for (let i = 0; i < n; i++) await new Promise((r) => setTimeout(r, 0)); };
function storage(init = {}) {
  const m = new Map(Object.entries(init));
  return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k), m };
}
const plan = (id, more = {}) => ({ id, planDetails: { name: 'Alex’s plan ' + id }, ...more });
const route = (store) => format(store.getState().route);

function setUp({ hash = '#/', session = null, local = null, landing = false } = {}) {
  const store = createStore(initialState({ today: TODAY, build: 'test' }), reduce);
  store.dispatch({ type: A.ROUTE_SET, route: parse(hash) });
  const s = session || storage();
  const l = local || storage();
  const stop = startPlace(store, { session: s, local: l, landing });
  return { store, session: s, local: l, stop };
}
const signedIn = (store, plans = [plan('P1')], profile = { lastSeenVersion: null }) => {
  store.dispatch({ type: A.SESSION_SET, session: { kind: 'in', email: 'alex@example.test' } });
  store.dispatch({ type: A.PROFILE_SET, profile });
  store.dispatch({ type: A.PLANS_SET, list: upgradedList(plans, NOW), source: 'account', readAt: '14:03' });
};

describe('places and ways back: a plan id and a step, or an answer\'s step; nothing else', () => {
  it('cleans what it is given', () => {
    expect(cleanPlace({ planId: 'P1', step: 'about' })).toEqual({ planId: 'P1', step: 'about' });
    expect(cleanPlace({ planId: 'P1' })).toEqual({ planId: 'P1', step: null });
    for (const bad of [null, 'P1', { planId: 'a b' }, { planId: 'P1', step: 'nowhere' }, { planId: 'P1', step: '£100' }]) expect(cleanPlace(bad)).toBe(null);
    expect(cleanBack({ planId: 'W1', step: 'saving', kept: true })).toEqual({ planId: 'W1', step: 'saving', kept: true });
    expect(cleanBack({ q: 'b', step: 'answer' })).toEqual({ q: 'b', step: 'answer' });
    for (const bad of [{ q: 'z', step: 'answer' }, { q: 'b', step: 'nowhere' }, { planId: 'W1' }, { planId: 'W1', step: 'nope', kept: true }]) expect(cleanBack(bad)).toBe(null);
    expect(placeHref({ planId: 'P1', step: null })).toBe('#/plan/P1');
    expect(backHref({ planId: 'W1', step: 'saving', kept: true }, 'N1')).toBe('#/plan/N1/saving');
    expect(backHref({ planId: 'W1', step: 'saving', kept: true }, null)).toBe('#/plans');
    expect(backHref({ q: 'c', step: 'answer' })).toBe('#/c/answer');
  });
  it('the reducer holds a way back (ui.returnTo) and a place asked to be kept (ui.place), and refuses anything else', () => {
    let s = initialState({ today: TODAY, build: 'test' });
    s = reduce(s, { type: A.ACCOUNT_RETURN, back: { q: 'b', step: 'answer' } });
    expect(s.ui.returnTo).toEqual({ q: 'b', step: 'answer' });
    s = reduce(s, { type: A.ACCOUNT_RETURN, back: null });
    expect(s.ui.returnTo).toBe(null);
    expect(() => reduce(s, { type: A.ACCOUNT_RETURN, back: { q: 'b', step: 'nowhere' } })).toThrow(/account\/return/);
    s = reduce(s, { type: A.PLACE_KEEP, place: { planId: 'P1', step: 'about' } });
    expect(s.ui.place).toEqual({ planId: 'P1', step: 'about' });
    expect(reduce(s, { type: A.PROFILE_SET, profile: { lastSeenVersion: '7.0.0', lastLocation: { planId: 'P1', step: 'spend' } } }).ui.profile).toEqual({ lastSeenVersion: '7.0.0', lastLocation: { planId: 'P1', step: 'spend' } });
    expect(reduce(s, { type: A.PROFILE_SET, profile: { lastSeenVersion: '7.0.0', lastLocation: { planId: 'no good!' } } }).ui.profile).toEqual({ lastSeenVersion: '7.0.0' });
  });
});

describe('keep → sign in → back', () => {
  it('a way back to an answer: kept in the window, "Your account" opened; signed in, back on the answer, the way back used', () => {
    const p = setUp({ hash: '#/b/answer' });
    p.store.dispatch({ type: A.ACCOUNT_RETURN, back: { q: 'b', step: 'answer' } });
    expect(route(p.store)).toBe('#/account');
    expect(JSON.parse(p.session.getItem(RETURN_KEY))).toEqual({ q: 'b', step: 'answer' });
    p.store.dispatch({ type: A.SESSION_SET, session: { kind: 'nobody', email: null } });
    expect(route(p.store)).toBe('#/account');
    p.store.dispatch({ type: A.SESSION_SET, session: { kind: 'in', email: 'alex@example.test' } });
    expect(route(p.store)).toBe('#/b/answer');
    expect(p.store.getState().ui.returnTo).toBe(null);
    expect(p.session.getItem(RETURN_KEY)).toBe(null);
    p.stop();
  });
  it('a plan kept in this window: brought in as soon as it is offered, then opened by the id the account gave it, at its step', () => {
    const p = setUp({ hash: '#/b/answer' });
    p.store.dispatch({ type: A.ACCOUNT_RETURN, back: { planId: 'W1', step: 'saving', kept: true } });
    p.store.dispatch({ type: A.SESSION_SET, session: { kind: 'in', email: 'alex@example.test' } });
    expect(route(p.store)).toBe('#/account');                         // waits for the plans to come in
    p.store.dispatch({ type: A.GUEST_OFFER, count: 1 });
    expect(p.store.getState().ui.saving).toEqual({ planId: null, kind: 'bringIn' });
    p.store.dispatch({ type: A.PLAN_ACTION_DONE, planId: null, op: 'brought', slots: { n: 1, s: '' }, moved: [['W1', 'N1']] });
    expect(route(p.store)).toBe('#/plan/N1/saving');
    expect(p.store.getState().ui.returnTo).toBe(null);
    p.stop();
  });
  it('the account page left before signing in lets the way back go; "Your account" from the header alone changes nothing on a sign-in', () => {
    const p = setUp({ hash: '#/c/answer' });
    p.store.dispatch({ type: A.ACCOUNT_RETURN, back: { q: 'c', step: 'answer' } });
    p.store.dispatch({ type: A.ROUTE_SET, route: parse('#/') });
    expect(p.store.getState().ui.returnTo).toBe(null);
    p.store.dispatch({ type: A.ROUTE_SET, route: parse('#/account') });
    p.store.dispatch({ type: A.SESSION_SET, session: { kind: 'in', email: 'alex@example.test' } });
    p.store.dispatch({ type: A.GUEST_OFFER, count: 1 });
    expect(route(p.store)).toBe('#/account');
    expect(p.store.getState().ui.saving).toBe(null);                     // the offer is the person's to answer
    p.stop();
  });
  it('a way back kept in the window survives a reload of the account page, and is let go anywhere else', () => {
    const kept = storage({ [RETURN_KEY]: JSON.stringify({ q: 'a', step: 'answer' }) });
    const p = setUp({ hash: '#/account', session: kept });
    expect(p.store.getState().ui.returnTo).toEqual({ q: 'a', step: 'answer' });
    p.stop();
    const again = storage({ [RETURN_KEY]: JSON.stringify({ q: 'a', step: 'answer' }) });
    const q = setUp({ hash: '#/plans', session: again });
    expect(q.store.getState().ui.returnTo || null).toBe(null);
    expect(again.getItem(RETURN_KEY)).toBe(null);
    q.stop();
  });
});

describe('land where you left off', () => {
  const state = (plans, profile, kind = 'in') => {
    let s = initialState({ today: TODAY, build: 'test' });
    s = reduce(s, { type: A.SESSION_SET, session: { kind, email: null } });
    if (profile !== undefined) s = reduce(s, { type: A.PROFILE_SET, profile });
    if (plans) s = reduce(s, { type: A.PLANS_SET, list: upgradedList(plans, NOW), source: 'account', readAt: '14:03' });
    return s;
  };
  it('landingFor: the window\'s place, then the account\'s; a closed or gone plan passed over for "Your plans"; nobody: stay', () => {
    const plans = [plan('P1'), plan('P2'), plan('P3', { closedAt: '2026-08', nextPlanId: 'P2' })];
    const profile = { lastSeenVersion: null, lastLocation: { planId: 'P2', step: 'about' } };
    expect(landingFor(state(plans, profile), { planId: 'P1', step: 'spend' })).toBe('#/plan/P1/spend');
    expect(landingFor(state(plans, profile), null)).toBe('#/plan/P2/about');
    expect(landingFor(state(plans, profile), { planId: 'P3', step: null })).toBe('#/plan/P2/about');
    expect(landingFor(state(plans, { lastSeenVersion: null, lastLocation: { planId: 'Gone', step: null } }), null)).toBe('#/plans');
    expect(landingFor(state(plans, { lastSeenVersion: null }), null)).toBe('#/plans');
    expect(landingFor(state([], { lastSeenVersion: null }), null)).toBe(null);
    expect(landingFor(state(null, undefined, 'nobody'), null)).toBe(null);
    expect(landingFor(state(plans, undefined), null)).toBe(undefined);   // the settings not read yet
    expect(landingFor(state(null, profile), null)).toBe(undefined);      // the plans not read yet
  });
  it('opened at the root with the note: taken to the place once everything is read; with any address of its own, or moved already: left alone', () => {
    const p = setUp({ hash: '#/', landing: true, session: storage({ [PLACE_KEY]: JSON.stringify({ planId: 'P2', step: 'income' }) }) });
    signedIn(p.store, [plan('P1'), plan('P2')]);
    expect(route(p.store)).toBe('#/plan/P2/income');
    p.stop();
    const q = setUp({ hash: '#/', landing: false });
    signedIn(q.store, [plan('P1')], { lastSeenVersion: null, lastLocation: { planId: 'P1', step: 'about' } });
    expect(route(q.store)).toBe('#/');
    q.stop();
    const r = setUp({ hash: '#/', landing: true });
    r.store.dispatch({ type: A.ROUTE_SET, route: parse('#/c/numbers') });
    signedIn(r.store, [plan('P1')], { lastSeenVersion: null, lastLocation: { planId: 'P1', step: 'about' } });
    expect(route(r.store)).toBe('#/c/numbers');
    r.stop();
  });
  it('while signed in the place is kept in the window and asked of the account when it changes; the note is set, and cleared on sign-out with the window\'s place', () => {
    const p = setUp({ hash: '#/plans' });
    signedIn(p.store, [plan('P1')], { lastSeenVersion: null, lastLocation: { planId: 'P1', step: 'about' } });
    expect(hasSignedInHint(p.local)).toBe(true);
    const kept = [];
    p.store.subscribe((s, a) => { if (a.type === A.PLACE_KEEP) kept.push(a.place); });
    p.store.dispatch({ type: A.ROUTE_SET, route: parse('#/plan/P1/about') });     // the account's own place: not sent again
    p.store.dispatch({ type: A.ROUTE_SET, route: parse('#/plan/P1/spend') });
    p.store.dispatch({ type: A.ROUTE_SET, route: parse('#/plan/P1/spend') });
    expect(kept).toEqual([{ planId: 'P1', step: 'spend' }]);
    expect(JSON.parse(p.session.getItem(PLACE_KEY))).toEqual({ planId: 'P1', step: 'spend' });
    p.store.dispatch({ type: A.SESSION_SET, session: { kind: 'nobody', email: null } });
    expect(hasSignedInHint(p.local)).toBe(false);
    expect(p.local.getItem(SIGNED_IN_KEY)).toBe(null);
    expect(p.session.getItem(PLACE_KEY)).toBe(null);
    p.stop();
  });
});

describe('the plan source shares the classic planner\'s stored sign-in', () => {
  /** A fake Firebase whose apps keep their own user, as Firebase keeps one per app name. */
  function fakeFirebase({ defaultUser = null, oldUser = null } = {}) {
    const calls = [];
    const apps = { '[DEFAULT]': { user: defaultUser }, [OLD_APP_NAME]: { user: oldUser } };
    const F = {
      isFirebaseConfigured: () => true,
      initializeApp: (config, name = '[DEFAULT]') => { calls.push(['initializeApp', name]); return { name }; },
      initializeAuth: (app) => {
        const a = { app: app.name, get currentUser() { return apps[app.name].user; }, authStateReady: () => Promise.resolve() };
        return a;
      },
      indexedDBLocalPersistence: 'IDB', browserLocalPersistence: 'LOCAL', browserSessionPersistence: 'SESSION',
      onAuthStateChanged: (auth, fn) => { calls.push(['listen', auth.app]); Promise.resolve().then(() => fn(apps[auth.app].user)); return () => {}; },
      signOut: (auth) => { calls.push(['signOut', auth.app]); apps[auth.app].user = null; return Promise.resolve(); },
      updateCurrentUser: (auth, user) => { calls.push(['updateCurrentUser', auth.app, user.uid]); apps[auth.app].user = { ...user }; return Promise.resolve(); },
      getFirestore: () => ({}), collection: (db, ...path) => ({ path: path.join('/') }),
      getDocs: () => Promise.resolve({ forEach: () => {} })
    };
    return { F, calls, apps };
  }
  const win = { addEventListener() {}, removeEventListener() {}, setInterval: () => 1, clearInterval() {}, document: { visibilityState: 'visible', addEventListener() {}, removeEventListener() {} }, setTimeout: () => 1, clearTimeout() {} };
  const start = (F) => {
    const store = createStore(initialState({ today: TODAY, build: 'test' }), reduce);
    store.dispatch({ type: A.ROUTE_SET, route: parse('#/plans') });
    const stop = startPlanSource(store, { win, local: storage(), session: storage(), now: () => NOW, fb: F, fbWrite: {}, fbAccount: {} });
    return { store, stop };
  };
  const alex = { uid: 'u1', email: 'alex@example.test', emailVerified: true };

  it('the default app — the classic planner\'s — is the one listened to, so a sign-in made on either page is seen on both', async () => {
    const { F, calls } = fakeFirebase({ defaultUser: alex });
    const p = start(F);
    await tick();
    expect(calls[0]).toEqual(['initializeApp', '[DEFAULT]']);
    expect(calls.filter(([c]) => c === 'listen')).toEqual([['listen', '[DEFAULT]']]);
    expect(p.store.getState().session.kind).toBe('in');
    expect(calls.filter(([c]) => c === 'updateCurrentUser')).toEqual([]);
    p.stop();
  });
  it('a sign-in kept under the old name is carried over once, before anyone is told who is signed in, and the old copy forgotten', async () => {
    const { F, calls, apps } = fakeFirebase({ oldUser: alex });
    const p = start(F);
    await tick();
    expect(calls.filter(([c]) => c !== 'initializeApp')).toEqual([['updateCurrentUser', '[DEFAULT]', 'u1'], ['signOut', OLD_APP_NAME], ['listen', '[DEFAULT]']]);
    expect(apps[OLD_APP_NAME].user).toBe(null);
    expect(p.store.getState().session).toMatchObject({ kind: 'in', email: 'alex@example.test' });
    p.stop();
  });
  it('signed in under both names: the default app\'s user stays; the old copy is forgotten', async () => {
    const sam = { uid: 'u2', email: 'sam@example.test', emailVerified: true };
    const { F, calls, apps } = fakeFirebase({ defaultUser: sam, oldUser: alex });
    const p = start(F);
    await tick();
    expect(calls.filter(([c]) => c === 'updateCurrentUser')).toEqual([]);
    expect(apps[OLD_APP_NAME].user).toBe(null);
    expect(p.store.getState().session.email).toBe('sam@example.test');
    p.stop();
  });
});
