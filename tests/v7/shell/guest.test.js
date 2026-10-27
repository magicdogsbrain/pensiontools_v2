/**
 * The visitor without an account in V7's shell (research/v7/road-to-7.md step 11): the meter through services/GuestMeter.js
 * only — a minute counted when the page is shown and the person was active, for a visitor with plans of their own in this
 * window (never signed in, never the example alone, never on the question pages); the four reminders at the planner's
 * milestones, each once; the stop when the three hours are used up — and the hand-over after a sign-in: the offer (the plan
 * source, on nobody → in, with plans of the person's own in this window; the example never counted), "Yes" through the one
 * create (handoffPayload: ids, the flag and the stamps dropped, the names marked, `isActive` for the first only when the
 * account is empty; the example never handed over — the planner's own bug, fixed in GuestMeter.js), the window's list
 * without them; "No" leaves them. Then the shell's boxes drawn: the reminder, the stop, the offer, the banner.
 */
import { describe, it, expect } from 'vitest';
import { h, render } from 'preact';
import { App } from '../../../src/v7/App.jsx';
import { startGuestMeter, counting, TICK_MS } from '../../../src/v7/effects/guestMeter.js';
import { startPlanSource, upgradedList, viewFor, GUEST_PLANS_KEY } from '../../../src/v7/effects/planSource.js';
import { startPlanWrite, WINDOW_SUFFIX } from '../../../src/v7/effects/planWrite.js';
import { createStore } from '../../../src/v7/effects/store.js';
import { initialState } from '../../../src/v7/state/initial.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { A } from '../../../src/v7/state/actions.js';
import { parse } from '../../../src/v7/router/routes.js';
import { guestView } from '../../../src/v7/state/select.js';
import { ACTIVITY_KEY } from '../../../src/v7/effects/activity.js';
import { KEY_MINUTES, KEY_NAG, GUEST_NAG_MINUTES, GUEST_ALLOWANCE_MINUTES, handoffPayload, HANDOFF_SUFFIX } from '../../../src/services/GuestMeter.js';
import { guestOwnPlans } from '../../../src/services/GuestPlans.js';
import { planProblems } from '../../../src/answers/keep/planCreate.js';
import { visibleText, bannedHits } from '../render/checkScreen.js';
import { GUEST } from '../../../src/v7/copy/guest.js';
import { corpus } from '../plan/_plans.js';

const C = corpus();
const TODAY = '2026-10-02';
const NOW = new Date('2026-10-02T14:03:00.000Z');
const tick = async (n = 8) => { for (let i = 0; i < n; i++) await new Promise((r) => setTimeout(r, 0)); };
const copy = (v) => JSON.parse(JSON.stringify(v));
const DRAFT = C['02-pnv-draft'];
const FRESH = C['01-fresh-default'];
const LADDER = C['03-gilt-ladder-runup'];
const EXAMPLE = { ...copy(C['11-guest-demo']), id: 'guest-example1', example: true, isActive: false };
const notActive = (p) => ({ ...copy(p), isActive: false });

function storage(start = {}) {
  const map = new Map(Object.entries(start));
  const calls = [];
  return { calls, map, getItem(k) { calls.push(['getItem', k]); return map.has(k) ? map.get(k) : null; }, setItem(k, v) { calls.push(['setItem', k]); map.set(k, String(v)); }, removeItem(k) { calls.push(['removeItem', k]); map.delete(k); }, raw: (k) => map.get(k) };
}
function fakeWin({ visible = 'visible' } = {}) {
  const timers = [];
  return { timers, setInterval: (fn, ms) => { timers.push({ fn, ms }); return timers.length; }, clearInterval: () => {}, document: { visibilityState: visible }, addEventListener() {}, removeEventListener() {} };
}
function meterPage({ session = 'nobody', raws = [DRAFT], local = storage(), win = fakeWin(), nowMs = Date.parse(NOW.toISOString()) } = {}) {
  const store = createStore(initialState({ today: TODAY, build: 'test' }), reduce);
  store.dispatch({ type: A.ROUTE_SET, route: parse('#/plans') });
  store.dispatch({ type: A.SESSION_SET, session: { kind: session, email: session === 'in' ? 'a@b.c' : null } });
  if (session === 'in' || session === 'nobody') store.dispatch({ type: A.PLANS_SET, list: upgradedList(raws, NOW), source: session === 'in' ? 'account' : 'window', readAt: '14:03' });
  let t = nowMs;
  const stop = startGuestMeter(store, { win, local, now: () => t });
  return { store, local, win, stop, minute: () => { t += 60000; win.timers[0].fn(); }, guest: () => store.getState().ui.guest, at: (ms) => { t = ms; }, active: () => local.setItem(ACTIVITY_KEY, String(t + 60000)) };
}

describe('the meter: GuestMeter.js\'s own count, ticked once a minute for a visitor with plans of their own', () => {
  it('counts a minute with the page shown and activity in the last two minutes; says the count on every tick; never names a key of its own', () => {
    const local = storage({ [ACTIVITY_KEY]: String(Date.parse(NOW.toISOString())) });
    const p = meterPage({ local });
    expect(p.win.timers[0].ms).toBe(TICK_MS);
    expect(p.guest()).toEqual({ minutes: 0, usedUp: false, nag: null });
    p.local.setItem(ACTIVITY_KEY, String(Date.parse(NOW.toISOString()) + 60000));
    p.minute();
    expect(p.guest()).toEqual({ minutes: 1, usedUp: false, nag: null });
    expect(p.local.raw(KEY_MINUTES)).toBe('1');
    // idle for three minutes: no count; hidden: no count
    p.at(Date.parse(NOW.toISOString()) + 5 * 60000);
    p.minute();
    expect(p.guest().minutes).toBe(1);
    p.local.setItem(ACTIVITY_KEY, String(Date.parse(NOW.toISOString()) + 6 * 60000));
    p.win.document.visibilityState = 'hidden';
    p.minute();
    expect(p.guest().minutes).toBe(1);
    p.stop();
  });
  it('counts only a visitor with plans of their own: not signed in, not an empty window, not the example alone, not before the plans are read', () => {
    const fresh = (session, raws) => { let s = initialState({ today: TODAY, build: 'test' }); s = reduce(s, { type: A.SESSION_SET, session: { kind: session, email: session === 'in' ? 'a@b.c' : null } }); if (raws) s = reduce(s, { type: A.PLANS_SET, list: upgradedList(raws, NOW), source: session === 'in' ? 'account' : 'window', readAt: '14:03' }); return s; };
    expect(counting(fresh('nobody', [DRAFT]))).toBe(true);
    expect(counting(fresh('nobody', [DRAFT, EXAMPLE]))).toBe(true);
    expect(counting(fresh('nobody', [EXAMPLE]))).toBe(false);
    expect(counting(fresh('nobody', []))).toBe(false);
    expect(counting(fresh('nobody', null))).toBe(false);
    expect(counting(fresh('in', [DRAFT]))).toBe(false);
    expect(counting(fresh('none', null))).toBe(false);
    const p = meterPage({ session: 'in', local: storage({ [ACTIVITY_KEY]: String(Date.parse(NOW.toISOString())) }) });
    p.minute();
    expect(p.local.raw(KEY_MINUTES)).toBeUndefined();
    p.stop();
  });
  it('the four reminders at 15, 45, 90 and 150 minutes, each once (GuestMeter.js markNagShown), with the minutes left; the stop at 180', () => {
    const local = storage({ [KEY_MINUTES]: String(GUEST_NAG_MINUTES[0] - 1) });
    const p = meterPage({ local });
    p.active();
    p.minute();
    expect(p.guest()).toEqual({ minutes: 15, usedUp: false, nag: { level: 1, left: GUEST_ALLOWANCE_MINUTES - 15 } });
    expect(p.local.raw(KEY_NAG)).toBe('1');
    p.store.dispatch({ type: A.GUEST_NAG_CLOSE });
    p.active();
    p.minute();
    expect(p.guest().nag).toBe(null);
    for (const [level, at] of [[2, 45], [3, 90], [4, 150]]) {
      p.local.setItem(KEY_MINUTES, String(at - 1));
      p.active();
      p.minute();
      expect(p.guest().nag).toEqual({ level, left: GUEST_ALLOWANCE_MINUTES - at });
      p.store.dispatch({ type: A.GUEST_NAG_CLOSE });
    }
    p.local.setItem(KEY_MINUTES, String(GUEST_ALLOWANCE_MINUTES - 1));
    p.active();
    p.minute();
    expect(p.guest()).toMatchObject({ minutes: GUEST_ALLOWANCE_MINUTES, usedUp: true });
    expect(guestView(p.store.getState()).stop).toBe(true);
    // the hours already used up when the page opens: said at once, before any tick
    const q = meterPage({ local: storage({ [KEY_MINUTES]: '200' }) });
    expect(q.guest()).toEqual({ minutes: 200, usedUp: true, nag: null });
    p.stop(); q.stop();
  });
  it('the stop is drawn on every page but the account page while nobody is signed in; the visitor\'s reminders in V7\'s words', () => {
    let s = initialState({ today: TODAY, build: 'test' });
    s = reduce(s, { type: A.SESSION_SET, session: { kind: 'nobody', email: null } });
    s = reduce(s, { type: A.GUEST_TICK, minutes: 181, usedUp: true });
    expect(guestView(s).stop).toBe(true);
    expect(guestView(reduce(s, { type: A.ROUTE_SET, route: parse('#/account') })).stop).toBe(false);
    expect(guestView(reduce(s, { type: A.SESSION_SET, session: { kind: 'in', email: 'a@b.c' } })).stop).toBe(false);
    expect(guestView(reduce(s, { type: A.SESSION_SET, session: { kind: 'none', email: null } })).stop).toBe(false);
    for (const level of [1, 2, 3, 4]) expect(GUEST.reminders[level]).not.toMatch(/guest/i);
  });
});

// ---- the hand-over after a sign-in --------------------------------------------------------------------------------------

/** The plan source with a fake Firebase whose user can change, so a sign-in can be made with plans in the window. */
function sourcePage({ windowPlans, docs = [] }) {
  const store = createStore(initialState({ today: TODAY, build: 'test' }), reduce);
  store.dispatch({ type: A.ROUTE_SET, route: parse('#/account') });
  let listener = null;
  let user = null;
  const calls = [];
  const fb = {
    isFirebaseConfigured: () => true, initializeApp: () => ({}), getAuth: () => ({}), setPersistence: () => Promise.resolve(), browserLocalPersistence: 'LOCAL',
    onAuthStateChanged: (auth, fn) => { listener = fn; Promise.resolve().then(() => fn(user)); return () => {}; },
    signOut: () => Promise.resolve(), getFirestore: () => ({}), collection: (db, ...path) => ({ path: path.join('/') }),
    getDocs: (ref) => { calls.push(['getDocs', ref.path]); return Promise.resolve({ forEach: (fn) => docs.forEach((d) => fn({ id: d.id, data: () => { const { id, ...rest } = d; return rest; } })) }); }
  };
  const session = storage({ [GUEST_PLANS_KEY]: JSON.stringify(windowPlans) });
  const listeners = {};
  const win = { addEventListener: (e, fn) => { (listeners[e] ||= []).push(fn); }, removeEventListener() {}, setInterval: () => 1, clearInterval() {}, document: { visibilityState: 'visible', addEventListener() {}, removeEventListener() {} }, setTimeout: () => 1, clearTimeout() {} };
  const actions = [];
  store.subscribe((s, a) => actions.push(a));
  const adds = [];
  const fbWrite = { doc: (db, ...path) => ({ path: path.join('/') }), updateDoc: () => Promise.resolve(), deleteDoc: () => Promise.resolve(), collection: (db, ...path) => ({ path: path.join('/') }), addDoc: (coll, data) => { adds.push({ path: coll.path, data: copy(data) }); return Promise.resolve({ id: 'New' + adds.length + 'PlanId' }); } };
  const fbAccount = { getDocs: fb.getDocs, collection: fb.collection, doc: fbWrite.doc, updateDoc: () => Promise.resolve(), deleteDoc: () => Promise.resolve(), query: (c) => c, where: () => ({}), signOut: () => Promise.resolve(), reload: () => Promise.resolve(), signInWithEmailAndPassword: () => Promise.resolve(), createUserWithEmailAndPassword: () => Promise.resolve(), signInWithPopup: () => Promise.resolve(), GoogleAuthProvider: class {}, sendEmailVerification: () => Promise.resolve(), sendPasswordResetEmail: () => Promise.resolve(), deleteUser: () => Promise.resolve() };
  const stop = startPlanSource(store, { win, local: storage(), session, now: () => NOW, fb, fbWrite, fbAccount });
  return { store, session, adds, actions, stop, signIn: () => { user = { uid: 'u1', email: 'a@b.c', emailVerified: true }; listener(user); }, types: () => actions.map((a) => a.type) };
}

describe('the hand-over: offered on a sign-in with plans of the person\'s own in this window; made through the one create', () => {
  it('nobody → in with two plans of the person\'s own and the example: the offer counts two; without any of their own: no offer', async () => {
    const p = sourcePage({ windowPlans: [DRAFT, notActive(FRESH), EXAMPLE] });
    await tick();
    expect(p.store.getState().session.kind).toBe('nobody');
    p.signIn();
    await tick();
    expect(p.store.getState().session.kind).toBe('in');
    expect(p.store.getState().ui.bringIn).toEqual({ count: 2, busy: false });
    const q = sourcePage({ windowPlans: [EXAMPLE] });
    await tick();
    q.signIn();
    await tick();
    expect(q.store.getState().ui.bringIn).toBe(null);
    p.stop(); q.stop();
  });
  it('"Yes, bring them in": ONE addDoc per plan of their own as handoffPayload packages them — the example never (the planner\'s bug, fixed in GuestMeter.js) — isActive for the first only when the account is empty; then the window\'s list without them (the example stays); the toast counts them', async () => {
    const p = sourcePage({ windowPlans: [DRAFT, EXAMPLE, notActive(LADDER)] });
    await tick();
    p.signIn();
    await tick();
    p.store.dispatch({ type: A.GUEST_BRING_IN });
    expect(p.store.getState().ui.saving).toEqual({ planId: null, kind: 'bringIn' });
    await tick(16);
    expect(p.adds.length).toBe(2);
    const payload = handoffPayload([DRAFT, EXAMPLE, LADDER], NOW.toISOString(), WINDOW_SUFFIX).scenarios;
    expect(payload.length).toBe(2);
    expect(p.adds[0].data.planDetails.name).toBe(DRAFT.planDetails.name + WINDOW_SUFFIX);
    expect(p.adds[1].data.planDetails.name).toBe(LADDER.planDetails.name + WINDOW_SUFFIX);
    expect(p.adds[0].data.isActive).toBe(true);
    expect(p.adds[1].data.isActive).toBe(false);
    expect(p.adds[1].data.decisionTool.settings.locked).toBe(true);   // brought in as it was
    for (const a of p.adds) { expect('id' in a.data).toBe(false); expect(a.data.createdAt).toBe(NOW.toISOString()); expect(planProblems(a.data)).toEqual([]); expect(a.data.example).toBeUndefined(); }
    const left = JSON.parse(p.session.raw(GUEST_PLANS_KEY));
    expect(left.map((x) => x.id)).toEqual([EXAMPLE.id]);
    expect(JSON.stringify(left[0])).toBe(JSON.stringify(EXAMPLE));
    expect(p.store.getState().ui.bringIn).toBe(null);
    expect(p.store.getState().ui.toast).toMatchObject({ kind: 'done', op: 'brought', slots: { n: 2, s: 's' } });
    expect(p.session.calls.filter(([c]) => c === 'removeItem')).toEqual([]);
    p.stop();
  });
  it('an account with plans already: no plan brought in is made the main one; "No, leave them here" closes the offer and the window keeps its plans', async () => {
    const p = sourcePage({ windowPlans: [DRAFT], docs: [{ ...copy(FRESH), id: 'InAccount001' }] });
    await tick();
    p.signIn();
    await tick();
    p.store.dispatch({ type: A.GUEST_BRING_IN });
    await tick(16);
    expect(p.adds.length).toBe(1);
    expect(p.adds[0].data.isActive).toBe(false);
    const q = sourcePage({ windowPlans: [DRAFT] });
    await tick();
    q.signIn();
    await tick();
    q.store.dispatch({ type: A.GUEST_OFFER_CLOSE });
    expect(q.store.getState().ui.bringIn).toBe(null);
    expect(JSON.parse(q.session.raw(GUEST_PLANS_KEY)).length).toBe(1);
    expect(q.adds).toEqual([]);
    p.stop(); q.stop();
  });
  it('the planner\'s hand-off (GuestMeter.handoffPayload) leaves the example out too, and keeps its own "(from guest)" mark', () => {
    const p = handoffPayload([DRAFT, EXAMPLE]);
    expect(p.scenarios.length).toBe(1);
    expect(p.scenarios[0].planDetails.name).toBe(DRAFT.planDetails.name + HANDOFF_SUFFIX);
    expect(HANDOFF_SUFFIX).toBe(' (from guest)');
    expect(guestOwnPlans([DRAFT, EXAMPLE]).length).toBe(1);
    expect(GUEST.bringIn.suffix).toBe(WINDOW_SUFFIX);
  });
  it('the hand-over refused when nobody is signed in or a plan cannot be made: the offer stays, nothing partial is said as done', async () => {
    const store = createStore(initialState({ today: TODAY, build: 'test' }), reduce);
    store.dispatch({ type: A.ROUTE_SET, route: parse('#/plans') });
    store.dispatch({ type: A.SESSION_SET, session: { kind: 'nobody', email: null } });
    store.dispatch({ type: A.PLANS_SET, list: upgradedList([DRAFT], NOW), source: 'window', readAt: '14:03' });
    store.dispatch({ type: A.GUEST_OFFER, count: 1 });
    const session = storage({ [GUEST_PLANS_KEY]: JSON.stringify([DRAFT]) });
    const stop = startPlanWrite(store, { session, local: storage(), now: () => NOW, fb: { doc() {}, updateDoc() {}, addDoc() {}, deleteDoc() {}, collection() {} }, client: null, handles: () => ({ db: null, user: null, reread: () => Promise.resolve() }) });
    store.dispatch({ type: A.GUEST_BRING_IN });
    await tick(12);
    expect(store.getState().ui.saveProblem).toEqual({ planId: null, problem: 'nobody' });
    expect(store.getState().ui.bringIn).toEqual({ count: 1, busy: false });
    stop();
  });
});

// ---- the shell's boxes drawn --------------------------------------------------------------------------------------------

function draw(state) {
  const root = document.createElement('div');
  root.id = 'app';
  const actions = [];
  render(h(App, { state, dispatch: (a) => actions.push(a) }), root);
  return { root, actions, text: visibleText(root) };
}
const q = (root, sel) => root.querySelector(sel);
function shellState(hash, { session = 'nobody', raws = null, ui = {} } = {}) {
  let s = initialState({ today: TODAY, build: 'test' });
  s = reduce(s, { type: A.ROUTE_SET, route: parse(hash) });
  s = reduce(s, { type: A.SESSION_SET, session: { kind: session, email: session === 'in' ? 'someone@example.com' : null } });
  if (raws) { s = reduce(s, { type: A.PLANS_SET, list: upgradedList(raws, NOW), source: session === 'in' ? 'account' : 'window', readAt: '14:03' }); s = reduce(s, { type: A.PLANS_VIEW, view: viewFor(s) }); }
  return { ...s, ui: { ...s.ui, ...ui } };
}
const SCOPES = ['all', 'first', 'planner', 'retired', 'saver', 'record'];

describe('the shell draws the visitor\'s boxes', () => {
  it('the stop on the front door and the plans page for a visitor whose hours are used up, never on the account page, never for an account; its buttons lead to the account page and the questions', () => {
    const s = reduce(shellState('#/', { session: 'nobody' }), { type: A.GUEST_TICK, minutes: 185, usedUp: true });
    const { root, text } = draw(s);
    const box = q(root, '[data-testid="guest.stop"]');
    expect(box).not.toBe(null);
    expect(box.textContent).toContain(GUEST.stop.title);
    expect(q(box, '[data-testid="guest.stop.signIn"]').getAttribute('href')).toBe('#/account');
    expect(q(box, '[data-testid="guest.stop.ask"]').getAttribute('href')).toBe('#/');
    for (const hit of bannedHits(text, SCOPES)) expect(hit).toBe('');
    expect(q(draw(reduce(s, { type: A.ROUTE_SET, route: parse('#/account') })).root, '[data-testid="guest.stop"]')).toBe(null);
    expect(q(draw(reduce(s, { type: A.SESSION_SET, session: { kind: 'in', email: 'a@b.c' } })).root, '[data-testid="guest.stop"]')).toBe(null);
  });
  it('a gentle reminder is a line with "Got it"; a firm one a box with the two ways in and "Not yet"; each closes through guest/nagClose; the minutes left in words', () => {
    const s = shellState('#/plans', { raws: [DRAFT] });
    const gentle = draw(reduce(s, { type: A.GUEST_TICK, minutes: 15, usedUp: false, nag: { level: 1, left: 165 } }));
    expect(q(gentle.root, '[data-testid="guest.reminder"]').getAttribute('data-level')).toBe('1');
    expect(q(gentle.root, '[data-testid="guest.remindBox"]')).toBe(null);
    q(gentle.root, '[data-testid="guest.reminder.gotIt"]').click();
    expect(gentle.actions).toEqual([{ type: 'guest/nagClose' }]);
    const two = draw(reduce(s, { type: A.GUEST_TICK, minutes: 45, usedUp: false, nag: { level: 2, left: 135 } }));
    expect(q(two.root, '[data-testid="guest.reminder"]').textContent).toContain('2.3 hours');
    const firm = draw(reduce(s, { type: A.GUEST_TICK, minutes: 150, usedUp: false, nag: { level: 4, left: 30 } }));
    const box = q(firm.root, '[data-testid="guest.remindBox"]');
    expect(box.textContent).toContain('30 minutes');
    expect(q(box, '[data-testid="guest.remind.signUp"]').getAttribute('href')).toBe('#/account');
    q(box, '[data-testid="guest.remind.notYet"]').click();
    expect(firm.actions).toEqual([{ type: 'guest/nagClose' }]);
    for (const hit of bannedHits(firm.text, SCOPES)) expect(hit).toBe('');
  });
  it('"Bring in what you built without an account?": the count, "Yes" and "No", the working line, the problem in words', () => {
    const s = shellState('#/account', { session: 'in', raws: [] });
    const one = draw(reduce(s, { type: A.GUEST_OFFER, count: 1 }));
    const box = q(one.root, '[data-testid="guest.bringIn"]');
    expect(box.textContent).toContain(GUEST.bringIn.one);
    q(box, '[data-testid="guest.bringIn.yes"]').click();
    q(box, '[data-testid="guest.bringIn.no"]').click();
    expect(one.actions).toEqual([{ type: 'guest/bringIn' }, { type: 'guest/offerClose' }]);
    const many = draw(reduce(s, { type: A.GUEST_OFFER, count: 3 }));
    expect(q(many.root, '[data-testid="guest.bringIn"]').textContent).toContain('3 plans');
    const busy = draw(reduce(reduce(s, { type: A.GUEST_OFFER, count: 3 }), { type: A.GUEST_BRING_IN }));
    expect(q(busy.root, '[data-testid="guest.bringIn.working"]')).not.toBe(null);
    expect(q(busy.root, '[data-testid="guest.bringIn.yes"]')).toBe(null);
    const failed = draw(reduce(reduce(reduce(s, { type: A.GUEST_OFFER, count: 3 }), { type: A.GUEST_BRING_IN }), { type: A.PLAN_SAVE_FAILED, planId: null, problem: 'failed' }));
    expect(q(failed.root, '[data-testid="guest.bringIn.problem"]').textContent).toBe(GUEST.bringIn.failed);
    expect(q(failed.root, '[data-testid="guest.bringIn.yes"]')).not.toBe(null);
    for (const hit of bannedHits(failed.text, SCOPES)) expect(hit).toBe('');
  });
  it('the banner on "Your plans" for a visitor says the one rule and the hours used; an account sees no banner', () => {
    const s = reduce(shellState('#/plans', { raws: [DRAFT] }), { type: A.GUEST_TICK, minutes: 72, usedUp: false });
    const { root } = draw(s);
    const banner = q(root, '[data-testid="plans.banner"]');
    expect(banner.textContent).toBe('Without an account: kept in this browser window until you close it. Make a free account to keep it for good. 1.2 h of your 3 free hours used.');
    const acc = draw(shellState('#/plans', { session: 'in', raws: [DRAFT] }));
    expect(q(acc.root, '[data-testid="plans.banner"]')).toBe(null);
  });
});
