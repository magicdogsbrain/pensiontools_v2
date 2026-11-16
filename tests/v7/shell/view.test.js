/**
 * The view PensionTools opens in (7.11.0; research/v7/replan-nov-2026.md §8): the simple view (V7) or the full view (the
 * classic page). One choice for the account (users/{uid}/profile/settings `view`), written only from Your account through
 * the account effect's one settings write; this browser's copy (pt_view) opens the full view at the site's root before
 * anything is drawn; "Back to the simple view" changes only the place, never the choice. Nothing is written when a page is
 * opened.
 *
 * Moved on purpose (7.11.1): someone signed in whose account holds no choice opens in the full view (services/ViewChoice.js
 * openingView) — the landing, this browser's copy, Your account and the full view's sign-in read it so; only the choice of
 * the simple view keeps the simple view. The strip that asked "open in the full view from now on?" is retired: with the full
 * view the default it had nothing left to ask. Guests and the front door are as they were.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { h, render } from 'preact';
import { App } from '../../../src/v7/App.jsx';
import { createStore } from '../../../src/v7/effects/store.js';
import { initialState } from '../../../src/v7/state/initial.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { A } from '../../../src/v7/state/actions.js';
import { parse, format } from '../../../src/v7/router/routes.js';
import { startView, fullViewForward, VIEW_KEY, ASKED_KEY } from '../../../src/v7/effects/view.js';
import { startPlace, landingFor, placeFor, afterSignInFor, TO_FULL, SIGNED_IN_KEY } from '../../../src/v7/effects/place.js';
import { startAccount } from '../../../src/v7/effects/account.js';
import { upgradedList, viewFor } from '../../../src/v7/effects/planSource.js';
import * as SELECT from '../../../src/v7/state/select.js';
import { ACCOUNT } from '../../../src/v7/copy/account.js';
import { COMMON } from '../../../src/v7/copy/common.js';
import { LAYOUTS } from '../../../src/appLayout.js';
import { corpus } from '../plan/_plans.js';
import { visibleText, bannedHits } from '../render/checkScreen.js';
const { accountView } = SELECT;

const ROOT = process.cwd();
const TODAY = '2026-10-02';
const NOW = new Date('2026-10-02T14:03:00.000Z');
const C = corpus();
const tick = async (n = 8) => { for (let i = 0; i < n; i++) await new Promise((r) => setTimeout(r, 0)); };

/** A storage stand-in that counts every write. */
function storage(start = {}) {
  const map = new Map(Object.entries(start));
  const writes = [];
  return {
    map, writes,
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => { writes.push(['set', k]); map.set(k, String(v)); },
    removeItem: (k) => { writes.push(['remove', k]); map.delete(k); },
    clear: () => { writes.push(['clear']); map.clear(); }
  };
}
const throwing = { getItem: () => { throw new Error('blocked'); }, setItem: () => { throw new Error('blocked'); }, removeItem: () => { throw new Error('blocked'); } };
const plan = (id, more = {}) => ({ id, planDetails: { name: 'Alex’s plan ' + id }, ...more });
const fresh = () => initialState({ today: TODAY, build: 'test' });
const signedIn = (s, email = 'alex@example.test') => reduce(s, { type: A.SESSION_SET, session: { kind: 'in', email } });
const withPlans = (s, plans) => reduce(s, { type: A.PLANS_SET, list: upgradedList(plans, NOW), source: 'account', readAt: '14:03' });
const withProfile = (s, profile, more = {}) => reduce(s, { type: A.PROFILE_SET, profile, ...more });

function viewPage({ local = storage(), hash = '#/plan/P1' } = {}) {
  const store = createStore(fresh(), reduce);
  store.dispatch({ type: A.ROUTE_SET, route: parse(hash) });
  const actions = [];
  store.subscribe((s, a) => actions.push(a));
  const stop = startView(store, { local });
  return { store, local, actions, stop };
}

describe('fullViewForward: the site\'s root opens the full view before anything is drawn', () => {
  const at = (hash, search = '') => ({ hash, search });
  const chose = () => storage({ [SIGNED_IN_KEY]: '1', [VIEW_KEY]: 'full' });
  it('only with no address of its own, no query, the signed-in note and this browser\'s copy saying full', () => {
    expect(fullViewForward(at(''), chose())).toBe('./classic/');
    expect(fullViewForward(at('#'), chose())).toBe('./classic/');
    expect(fullViewForward(at('#/'), chose())).toBe(null);
    expect(fullViewForward(at('#/plans'), chose())).toBe(null);
    expect(fullViewForward(at('', '?x=1'), chose())).toBe(null);
    expect(fullViewForward(at(''), storage({ [VIEW_KEY]: 'full' }))).toBe(null);                       // no signed-in note
    expect(fullViewForward(at(''), storage({ [SIGNED_IN_KEY]: '1' }))).toBe(null);                     // no copy
    for (const other of ['simple', 'Full', '1', '']) expect(fullViewForward(at(''), storage({ [SIGNED_IN_KEY]: '1', [VIEW_KEY]: other })), other).toBe(null);
    expect(fullViewForward(at(''), throwing)).toBe(null);
    expect(fullViewForward(at(''), null)).toBe(null);
  });
  it('in the rollback layout it goes to the classic page at the root', () => {
    expect(fullViewForward(at(''), chose(), LAYOUTS.preview)).toBe('../');
  });
  it('main.jsx asks it before anything is drawn, and replaces the page', () => {
    const main = readFileSync(join(ROOT, 'src/v7/main.jsx'), 'utf8');
    const at = main.indexOf('fullViewForward(window.location, localStore(window))');
    expect(at).toBeGreaterThan(-1);
    expect(at).toBeLessThan(main.indexOf('render(<App'));
    expect(at).toBeLessThan(main.indexOf('startEffects('));
    expect(main.slice(at, at + 200)).toMatch(/if \(forward\) \{ window\.location\.replace\(forward\); return; \}/);
  });
});

describe('landing: someone signed in lands in the full view unless the account says the simple view', () => {
  const plans = [plan('P1'), plan('P2'), plan('P3', { closedAt: '2026-08', nextPlanId: 'P2' })];
  const state = ({ kind = 'in', profile, read = true } = {}) => {
    let s = reduce(fresh(), { type: A.SESSION_SET, session: { kind, email: null } });
    if (profile !== undefined) s = withProfile(s, profile);
    if (read) s = withPlans(s, plans);
    return s;
  };
  const where = { lastSeenVersion: null, lastLocation: { planId: 'P2', step: 'about' } };
  it('the table: nobody or unverified stay; not known yet waits; full, or no choice, is TO_FULL with plans or without; simple is the place', () => {
    expect(landingFor(state({ kind: 'nobody', read: false }))).toBe(null);
    expect(landingFor(state({ kind: 'unverified', read: false }))).toBe(null);
    expect(landingFor(state({ kind: 'checking', read: false }))).toBe(undefined);
    expect(landingFor(state({ profile: undefined }))).toBe(undefined);                                // the settings not read yet
    expect(landingFor(state({ profile: { ...where, view: 'full' } }))).toBe(TO_FULL);
    expect(landingFor(state({ profile: { ...where, view: 'full' }, read: false }))).toBe(TO_FULL);  // the plans not read: still the full view
    let none = withPlans(reduce(fresh(), { type: A.SESSION_SET, session: { kind: 'in', email: null } }), []);
    none = withProfile(none, { lastSeenVersion: null, view: 'full' });
    expect(landingFor(none)).toBe(TO_FULL);                                                           // no plans: the full view starts its set-up
    // 7.11.1: no choice stored is the full view, with plans or without
    expect(landingFor(state({ profile: where }))).toBe(TO_FULL);
    expect(landingFor(state({ profile: where, read: false }))).toBe(TO_FULL);
    let bare = withPlans(reduce(fresh(), { type: A.SESSION_SET, session: { kind: 'in', email: null } }), []);
    bare = withProfile(bare, { lastSeenVersion: null });
    expect(landingFor(bare)).toBe(TO_FULL);
    for (const profile of [{ ...where, view: 'simple' }]) {
      const s = state({ profile });
      expect(landingFor(s)).toEqual(placeFor(s));
      expect(landingFor(s)).toBe('#/plan/P2/about');
      expect(landingFor(s, { planId: 'P1', step: 'spend' })).toBe('#/plan/P1/spend');
    }
    // settings that could not be read are no choice of either: the simple view's place, as before
    const unread = withPlans(withProfile(reduce(fresh(), { type: A.SESSION_SET, session: { kind: 'in', email: null } }), {}, { read: false }), plans);
    expect(landingFor(unread)).toBe('#/plans');
  });
  it('afterSignInFor reads the simple view\'s place whatever the view: a closed plan, or plans not read, as before', () => {
    for (const view of [undefined, 'simple', 'full']) {
      const v = view ? { view } : {};
      expect(afterSignInFor(state({ profile: { ...where, ...v } })), String(view)).toBe('#/plan/P2');
      expect(afterSignInFor(state({ profile: { lastSeenVersion: null, lastLocation: { planId: 'P3', step: null }, ...v } })), String(view)).toBe(null);
      expect(afterSignInFor(state({ profile: { ...where, ...v }, read: false })), String(view)).toBe(undefined);
    }
  });
  it('startPlace: a landing for someone whose account says full, or nothing, opens the full view (no address is set); simple, or without the option, nothing', () => {
    const run = (o, view = 'full') => {
      const store = createStore(fresh(), reduce);
      store.dispatch({ type: A.ROUTE_SET, route: parse('') });
      const opened = [];
      const stop = startPlace(store, { session: storage(), local: storage(), landing: true, ...(o ? { full: () => opened.push('full') } : {}) });
      store.dispatch({ type: A.SESSION_SET, session: { kind: 'in', email: 'alex@example.test' } });
      store.dispatch({ type: A.PROFILE_SET, profile: { lastSeenVersion: null, lastLocation: { planId: 'P1', step: 'about' }, ...(view ? { view } : {}) } });
      store.dispatch({ type: A.PLANS_SET, list: upgradedList([plan('P1')], NOW), source: 'account', readAt: '14:03' });
      const r = format(store.getState().route);
      stop();
      return { opened, r };
    };
    expect(run(true)).toEqual({ opened: ['full'], r: '#/' });
    expect(run(true, null)).toEqual({ opened: ['full'], r: '#/' });
    expect(run(true, 'simple')).toEqual({ opened: [], r: '#/plan/P1/about' });
    expect(run(false)).toEqual({ opened: [], r: '#/' });
  });
  it('effects/index.js starts the view before the place, and gives the place the full view\'s address', () => {
    const src = readFileSync(join(ROOT, 'src/v7/effects/index.js'), 'utf8');
    expect(src.indexOf('startView(store, { local: localStore(win) })')).toBeGreaterThan(-1);
    expect(src.indexOf('startView(store')).toBeLessThan(src.indexOf('startPlace(store'));
    expect(src).toMatch(/startPlace\(store, \{ session: sessionStore\(win\), local: localStore\(win\), landing, full: \(\) => win\.location\.replace\(PLANNER\) \}\)/);
  });
});

describe('the reducer: the choice, and the settings let go on sign-out', () => {
  const inWith = (profile) => withProfile(signedIn(fresh()), profile);
  it('profile/set keeps a view that is one; anything else leaves no view key, as before', () => {
    expect(inWith({ lastSeenVersion: null, view: 'full' }).ui.profile).toEqual({ lastSeenVersion: null, view: 'full' });
    expect(inWith({ lastSeenVersion: null, view: 'simple' }).ui.profile).toEqual({ lastSeenVersion: null, view: 'simple' });
    for (const bad of ['expert', 1, null, 'Full']) expect(inWith({ lastSeenVersion: '7.10.0', view: bad }).ui.profile, String(bad)).toEqual({ lastSeenVersion: '7.10.0' });
  });
  it('profile/set with read: false is marked unread; a good read has no unread key', () => {
    expect(withProfile(signedIn(fresh()), { lastSeenVersion: null }, { read: false }).ui.profile).toEqual({ lastSeenVersion: null, unread: true });
    expect('unread' in inWith({ lastSeenVersion: null }).ui.profile).toBe(false);
  });
  it('view/set: refuses another view; nothing while signed out or before the settings are read; a new state on every press', () => {
    expect(() => reduce(inWith({ lastSeenVersion: null }), { type: A.VIEW_SET, view: 'other', from: 'account' })).toThrow(/view\/set/);
    const out = fresh();
    expect(reduce(out, { type: A.VIEW_SET, view: 'full', from: 'account' })).toBe(out);
    const unreadYet = signedIn(fresh());
    expect(reduce(unreadYet, { type: A.VIEW_SET, view: 'full', from: 'account' })).toBe(unreadYet);
    const s = inWith({ lastSeenVersion: null, view: 'full' });
    const again = reduce(s, { type: A.VIEW_SET, view: 'full', from: 'account' });
    expect(again).not.toBe(s);
    expect(again.ui.profile).toEqual({ lastSeenVersion: null, view: 'full' });
    expect(again.ui.viewStrip).toBe(undefined);
    // a press while the settings could not be read is the choice, and the profile is read from then on
    const u = withProfile(signedIn(fresh()), {}, { read: false });
    expect(reduce(u, { type: A.VIEW_SET, view: 'simple', from: 'account' }).ui.profile).toEqual({ lastSeenVersion: null, view: 'simple' });
  });
  it('session/set to any kind but in lets ui.profile go (from in, and from checking); view/set is then nothing', () => {
    const s = inWith({ lastSeenVersion: null, view: 'full', lastLocation: { planId: 'P1', step: null } });
    for (const kind of ['nobody', 'unverified', 'checking', 'failed']) {
      const out = reduce(s, { type: A.SESSION_SET, session: { kind, email: null } });
      expect(out.ui.profile, kind).toBe(null);
      expect(reduce(out, { type: A.VIEW_SET, view: 'simple', from: 'account' }), kind).toBe(out);
    }
    const checking = reduce(fresh(), { type: A.SESSION_SET, session: { kind: 'checking', email: null } });
    const ui = checking.ui;
    expect(reduce(checking, { type: A.SESSION_SET, session: { kind: 'nobody', email: null } }).ui).toBe(ui);   // nothing to let go: the same ui
    // signed in again: the settings are read again, so the next read is a change
    const back = withProfile(signedIn(reduce(s, { type: A.SESSION_SET, session: { kind: 'nobody', email: null } })), { lastSeenVersion: null, view: 'full' });
    expect(back.ui.profile).toEqual({ lastSeenVersion: null, view: 'full' });
  });
  it('the strip is retired (7.11.1): no action, no reader and no word of it; the stored and first states carry none', () => {
    expect(A.VIEW_STRIP).toBe(undefined);
    expect(SELECT.viewStripView).toBe(undefined);
    expect(COMMON.viewStrip).toBe(undefined);
    expect('viewStrip' in fresh().ui).toBe(false);
    expect(() => reduce(fresh(), { type: 'view/strip', to: 'offer' })).toThrow();
  });
});

describe('the account effect: the choice through the one settings write', () => {
  function fakeFb({ profile = { lastSeenVersion: '7.10.0' }, failRead = false } = {}) {
    const calls = [];
    return {
      calls,
      doc: (db, ...path) => ({ path: path.join('/') }),
      collection: (db, ...path) => ({ path: path.join('/') }),
      getDocs: (ref) => {
        calls.push(['getDocs', ref.path]);
        if (failRead) return Promise.reject(Object.assign(new Error('x'), { code: 'unavailable' }));
        return Promise.resolve({ forEach: (fn) => { if (profile) fn({ id: 'settings', data: () => profile }); } });
      },
      setDoc: (ref, data, opts) => { calls.push(['setDoc', ref.path, JSON.parse(JSON.stringify(data)), opts]); return Promise.resolve(); },
      signOut: () => Promise.resolve()
    };
  }
  function page({ fb = fakeFb(), local = storage(), withView = false } = {}) {
    const store = createStore(fresh(), reduce);
    store.dispatch({ type: A.ROUTE_SET, route: parse('#/account') });
    const user = { uid: 'u1', email: 'alex@example.test', emailVerified: true };
    store.dispatch({ type: A.SESSION_SET, session: { kind: 'in', email: user.email } });
    const actions = [];
    store.subscribe((s, a) => actions.push(a));
    const stops = [];
    if (withView) stops.push(startView(store, { local }));
    stops.push(startAccount(store, { win: {}, local, session: storage(), now: () => NOW, fb, handles: () => ({ auth: {}, db: {}, user }) }));
    return { store, fb, local, actions, stop: () => stops.forEach((f) => f()), setDocs: () => fb.calls.filter(([c]) => c === 'setDoc') };
  }
  it('one press on Full: ONE setDoc of { view: "full" }, merged; a second identical press, a second write', async () => {
    const p = page();
    await tick();
    p.store.dispatch({ type: A.VIEW_SET, view: 'full', from: 'account' });
    await tick();
    expect(p.setDocs()).toEqual([['setDoc', 'users/u1/profile/settings', { view: 'full' }, { merge: true }]]);
    p.store.dispatch({ type: A.VIEW_SET, view: 'full', from: 'account' });
    await tick();
    expect(p.setDocs().length).toBe(2);
    p.stop();
  });
  it('reading the settings, a sign-out and moving between pages write nothing', async () => {
    const p = page({ fb: fakeFb({ profile: { lastSeenVersion: '7.10.0', view: 'full' } }) });
    await tick();
    expect(p.store.getState().ui.profile).toEqual({ lastSeenVersion: '7.10.0', view: 'full' });
    p.store.dispatch({ type: A.ROUTE_SET, route: parse('#/plans') });
    p.store.dispatch({ type: A.ROUTE_SET, route: parse('#/') });
    p.store.dispatch({ type: A.SESSION_SET, session: { kind: 'nobody', email: null } });
    await tick();
    expect(p.setDocs()).toEqual([]);
    p.stop();
  });
  it('a read that throws says read: false; a good read for someone who never chose is exactly as before', async () => {
    const p = page({ fb: fakeFb({ failRead: true }) });
    await tick();
    expect(p.actions.filter((a) => a.type === A.PROFILE_SET)).toEqual([{ type: A.PROFILE_SET, profile: { lastSeenVersion: null, lastLocation: null }, read: false }]);
    expect(p.store.getState().ui.profile).toEqual({ lastSeenVersion: null, unread: true });
    p.stop();
    const q = page();
    await tick();
    expect(q.actions.filter((a) => a.type === A.PROFILE_SET)).toEqual([{ type: A.PROFILE_SET, profile: { lastSeenVersion: '7.10.0', lastLocation: null } }]);
    q.stop();
  });
  it('a tab that read an older value still records a press: the settings said full, another tab removed the copy, a press on Full writes once and puts the copy back', async () => {
    const local = storage({ [SIGNED_IN_KEY]: '1' });
    const p = page({ fb: fakeFb({ profile: { lastSeenVersion: '7.10.0', view: 'full' } }), local, withView: true });
    await tick();
    expect(local.getItem(VIEW_KEY)).toBe('full');
    local.map.delete(VIEW_KEY);                       // another tab chose the simple view
    p.store.dispatch({ type: A.VIEW_SET, view: 'full', from: 'account' });
    await tick();
    expect(p.setDocs()).toEqual([['setDoc', 'users/u1/profile/settings', { view: 'full' }, { merge: true }]]);
    expect(local.getItem(VIEW_KEY)).toBe('full');
    p.stop();
  });
});

describe('view.js: this browser\'s copy, written only when it differs', () => {
  const read = (p, profile, more = {}) => { p.store.dispatch({ type: A.SESSION_SET, session: { kind: 'in', email: 'alex@example.test' } }); p.store.dispatch({ type: A.PROFILE_SET, profile, ...more }); };
  // Moved on purpose (7.11.1): someone who never chose opens in the full view, so this browser's copy says so; still nothing
  // is written to the account
  it('someone who never chose: the copy is set once; a browser already in step writes nothing', () => {
    const p = viewPage();
    read(p, { lastSeenVersion: null });
    p.store.dispatch({ type: A.ROUTE_SET, route: parse('#/plans') });
    expect(p.local.getItem(VIEW_KEY)).toBe('full');
    expect(p.local.writes).toEqual([['set', VIEW_KEY]]);
    p.stop();
    const q = viewPage({ local: storage({ [VIEW_KEY]: 'full' }) });
    read(q, { lastSeenVersion: null });
    expect(q.local.writes).toEqual([]);
    q.stop();
  });
  it('the settings read: full sets the copy, simple removes it (another device chose), a failed read leaves it', () => {
    const p = viewPage();
    read(p, { lastSeenVersion: null, view: 'full' });
    expect(p.local.getItem(VIEW_KEY)).toBe('full');
    p.stop();
    const q = viewPage({ local: storage({ [VIEW_KEY]: 'full' }) });
    read(q, { lastSeenVersion: null, view: 'simple' });
    expect(q.local.getItem(VIEW_KEY)).toBe(null);
    q.stop();
    const r = viewPage({ local: storage({ [VIEW_KEY]: 'full' }) });
    read(r, {}, { read: false });
    expect(r.local.getItem(VIEW_KEY)).toBe('full');
    expect(r.local.writes).toEqual([]);
    r.stop();
  });
  it('a press: full sets the copy once, simple removes it', () => {
    const p = viewPage();
    read(p, { lastSeenVersion: null, view: 'simple' });
    p.store.dispatch({ type: A.VIEW_SET, view: 'full', from: 'account' });
    p.store.dispatch({ type: A.VIEW_SET, view: 'full', from: 'account' });
    expect(p.local.writes).toEqual([['set', VIEW_KEY]]);
    p.store.dispatch({ type: A.VIEW_SET, view: 'simple', from: 'account' });
    expect(p.local.getItem(VIEW_KEY)).toBe(null);
    expect(p.local.writes).toEqual([['set', VIEW_KEY], ['remove', VIEW_KEY]]);
    p.stop();
  });
  it('nobody signed in: the copy and "Not now" go — from in, and from checking (a fresh page)', () => {
    const p = viewPage({ local: storage({ [VIEW_KEY]: 'full', [ASKED_KEY]: '1' }) });
    read(p, { lastSeenVersion: null, view: 'full' });
    p.store.dispatch({ type: A.SESSION_SET, session: { kind: 'nobody', email: null } });
    expect(p.local.getItem(VIEW_KEY)).toBe(null);
    expect(p.local.getItem(ASKED_KEY)).toBe(null);
    p.stop();
    const q = viewPage({ local: storage({ [VIEW_KEY]: 'full', [ASKED_KEY]: '1' }) });
    q.store.dispatch({ type: A.SESSION_SET, session: { kind: 'checking', email: null } });
    q.store.dispatch({ type: A.SESSION_SET, session: { kind: 'nobody', email: null } });
    expect(q.local.getItem(VIEW_KEY)).toBe(null);
    expect(q.local.getItem(ASKED_KEY)).toBe(null);
    q.stop();
    const r = viewPage();
    r.store.dispatch({ type: A.SESSION_SET, session: { kind: 'nobody', email: null } });
    expect(r.local.writes).toEqual([]);                // nothing there: nothing removed
    r.stop();
  });
  it('a storage that refuses: nothing breaks', () => {
    const p = viewPage({ local: throwing });
    read(p, { lastSeenVersion: null, view: 'full' });
    p.store.dispatch({ type: A.VIEW_SET, view: 'simple', from: 'account' });
    p.store.dispatch({ type: A.SESSION_SET, session: { kind: 'nobody', email: null } });
    expect(p.store.getState().ui.profile).toBe(null);
    p.stop();
  });
});

describe('the shell: the line naming the view, and no strip under it (7.11.1)', () => {
  const PLAN = C['01-fresh-default'];
  function stateAt(address, { profile = { lastSeenVersion: null } } = {}) {
    let s = reduce(fresh(), { type: A.ROUTE_SET, route: parse(address) });
    s = signedIn(s);
    s = withPlans(s, [{ ...PLAN, id: 'P1' }]);
    s = reduce(s, { type: A.PLANS_VIEW, view: viewFor(s) });
    if (profile) s = withProfile(s, profile);
    return s;
  }
  function draw(state) {
    const root = document.createElement('div');
    root.id = 'app';
    render(h(App, { state, dispatch: () => {} }), root);
    return { root };
  }
  it('the header draws both spans of the line naming the view, with their testids', () => {
    const { root } = draw(stateAt('#/plans'));
    expect(root.querySelector('.view-line .view-long [data-testid="nav.everything"]').textContent).toBe(COMMON.view.link);
    expect(root.querySelector('.view-line .view-short [data-testid="nav.everythingShort"]').textContent).toBe(COMMON.view.shortLink);
  });
  it('no page draws a strip asking which view to open in, whatever the account says', () => {
    for (const profile of [{ lastSeenVersion: null }, { lastSeenVersion: null, view: 'simple' }, { lastSeenVersion: null, view: 'full' }]) {
      for (const address of ['#/', '#/plans', '#/plan/P1']) expect(draw(stateAt(address, { profile })).root.querySelector('[data-testid^="view.strip"]'), address).toBe(null);
    }
  });
});

describe('Your account: the view PensionTools opens in', () => {
  function accountAt({ profile = { lastSeenVersion: null }, read = true } = {}) {
    let s = reduce(fresh(), { type: A.ROUTE_SET, route: parse('#/account') });
    s = signedIn(s);
    if (profile) s = withProfile(s, profile, read ? {} : { read: false });
    const root = document.createElement('div');
    root.id = 'app';
    const actions = [];
    render(h(App, { state: s, dispatch: (a) => actions.push(a) }), root);
    const btn = (v) => root.querySelector(`[data-testid="account.view.${v}"]`);
    return { root, actions, btn, state: s, section: root.querySelector('[data-section="view"]'), now: root.querySelector('[data-testid="account.view.now"]') };
  }
  it('absent until the account\'s settings are read', () => {
    const p = accountAt({ profile: null });
    expect(p.section).toBe(null);
    expect(accountView(p.state).view).toBe(null);
  });
  it('after the email and before the password; its words', () => {
    const p = accountAt();
    expect(p.section.previousElementSibling.getAttribute('data-testid')).toBe('account.email');
    expect(p.section.nextElementSibling.getAttribute('data-section')).toBe('password');
    expect(p.section.querySelector('h2').textContent).toBe(ACCOUNT.view.title);
    expect(p.section.textContent).toContain(ACCOUNT.view.note);
    expect(p.btn('simple').textContent).toBe(ACCOUNT.view.simple);
    expect(p.btn('full').textContent).toBe(ACCOUNT.view.full);
    expect(p.now.getAttribute('role')).toBe('status');
  });
  // Moved on purpose (7.11.1): with no choice made the site opens in the full view, so Your account says so
  it('the pressed button follows the choice, the full view when none was made; the line says which', () => {
    for (const [profile, pressed, line] of [
      [{ lastSeenVersion: null }, 'full', ACCOUNT.view.nowFull],
      [{ lastSeenVersion: null, view: 'simple' }, 'simple', ACCOUNT.view.nowSimple],
      [{ lastSeenVersion: null, view: 'full' }, 'full', ACCOUNT.view.nowFull]
    ]) {
      const p = accountAt({ profile });
      expect(p.btn('simple').getAttribute('aria-pressed'), JSON.stringify(profile)).toBe(pressed === 'simple' ? 'true' : 'false');
      expect(p.btn('full').getAttribute('aria-pressed'), JSON.stringify(profile)).toBe(pressed === 'full' ? 'true' : 'false');
      expect(p.now.textContent).toBe(line);
      expect(accountView(p.state).view).toEqual({ pressed, unread: false });
    }
  });
  it('its words pass the banned list', () => {
    for (const read of [true, false]) {
      const p = accountAt({ read });
      for (const hit of bannedHits(visibleText(p.section), ['all', 'first', 'planner', 'retired', 'saver', 'record'])) expect(hit).toBe('');
    }
  });
  it('each press dispatches view/set from the account', () => {
    const p = accountAt();
    p.btn('full').click();
    p.btn('simple').click();
    expect(p.actions).toEqual([{ type: 'view/set', view: 'full', from: 'account' }, { type: 'view/set', view: 'simple', from: 'account' }]);
  });
  it('the settings could not be read: the line says so, neither is pressed, and a press still dispatches', () => {
    const p = accountAt({ profile: { lastSeenVersion: null }, read: false });
    expect(p.now.textContent).toBe(ACCOUNT.view.unread);
    expect(p.btn('simple').getAttribute('aria-pressed')).toBe('false');
    expect(p.btn('full').getAttribute('aria-pressed')).toBe('false');
    expect(accountView(p.state).view).toEqual({ pressed: null, unread: true });
    p.btn('full').click();
    expect(p.actions).toEqual([{ type: 'view/set', view: 'full', from: 'account' }]);
  });
});
