/**
 * The account page (research/v7/road-to-7.md step 11): the account effect with fakes, so every call to the sign-in service
 * and to Firestore is seen — sign in (empty boxes refused; the service's reason in words; the password never in the state),
 * sign up (the confirmation email sent after), Google, the reset email (the session's email when signed in), the "Confirm
 * your email" gate (reload, a fresh token, the session read again when confirmed; "not yet"; "Send it again"; "Sign out"),
 * the settings document read once per sign-in and its ONE write on news/seen (a missing document left alone), "Download
 * everything" (one file: every plan identity-stripped and the settings), and "Delete my account" — the two confirms the
 * reducer insists on, then the planner's order document by document (every plan, the settings document, the person's
 * fund-suggestion rows), this site's storage cleared, deleteUser; auth/requires-recent-login signs out and says the data is
 * gone; a document that will not delete stops everything there. Then the screen: the forms, the gate, the signed-in page,
 * never a "Delete my account" for a visitor, the words.
 */
import { describe, it, expect } from 'vitest';
import { h, render } from 'preact';
import { App } from '../../../src/v7/App.jsx';
import { startAccount, everythingFileName, everythingJson, EVERYTHING_FILE_PREFIX } from '../../../src/v7/effects/account.js';
import { upgradedList, viewFor } from '../../../src/v7/effects/planSource.js';
import { createStore } from '../../../src/v7/effects/store.js';
import { initialState } from '../../../src/v7/state/initial.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { A } from '../../../src/v7/state/actions.js';
import { parse } from '../../../src/v7/router/routes.js';
import { accountView } from '../../../src/v7/state/select.js';
import { stripIdentity } from '../../../src/services/PlanExport.js';
import { VERSION } from '../../../src/constants.js';
import { visibleText, bannedHits } from '../render/checkScreen.js';
import { ACCOUNT } from '../../../src/v7/copy/account.js';
import { corpus } from '../plan/_plans.js';

const C = corpus();
const TODAY = '2026-10-02';
const NOW = new Date('2026-10-02T14:03:00.000Z');
const tick = async (n = 8) => { for (let i = 0; i < n; i++) await new Promise((r) => setTimeout(r, 0)); };
const copy = (v) => JSON.parse(JSON.stringify(v));
const DRAFT = C['02-pnv-draft'];
const LADDER = C['03-gilt-ladder-runup'];

function storage(start = {}) {
  const map = new Map(Object.entries(start));
  const calls = [];
  return {
    calls, map,
    getItem(k) { calls.push(['getItem', k]); return map.has(k) ? map.get(k) : null; },
    setItem(k, v) { calls.push(['setItem', k]); map.set(k, String(v)); },
    removeItem(k) { calls.push(['removeItem', k]); map.delete(k); },
    clear() { calls.push(['clear']); map.clear(); }
  };
}
const err = (code) => Object.assign(new Error(code), { code });

/**
 * The fake sign-in service and Firestore: every call recorded in order. `fails` names calls that reject (with a code);
 * `docs` the scenario ids in the account; `profile` the settings document ({} for none); `suggestions` the person's rows.
 */
function fakeFb({ fails = {}, docs = [], profile = { lastSeenVersion: '6.40.0' }, suggestions = [], verifiedAfterReload = true } = {}) {
  const calls = [];
  const rec = (name, ...args) => { calls.push([name, ...args]); if (fails[name]) return Promise.reject(err(fails[name])); return null; };
  const F = {
    calls,
    signInWithEmailAndPassword: (auth, email, password) => rec('signInWithEmailAndPassword', email, password) || Promise.resolve({ user: { uid: 'u1', email } }),
    createUserWithEmailAndPassword: (auth, email, password) => rec('createUserWithEmailAndPassword', email, password) || Promise.resolve({ user: { uid: 'u2', email, emailVerified: false } }),
    signInWithPopup: (auth, provider) => rec('signInWithPopup', provider && provider.kind) || Promise.resolve({ user: { uid: 'u3' } }),
    GoogleAuthProvider: class { constructor() { this.kind = 'google'; } },
    sendEmailVerification: (user) => rec('sendEmailVerification', user && user.email) || Promise.resolve(),
    sendPasswordResetEmail: (auth, email) => rec('sendPasswordResetEmail', email) || Promise.resolve(),
    deleteUser: (user) => rec('deleteUser', user && user.uid) || Promise.resolve(),
    signOut: () => rec('signOut') || Promise.resolve(),
    reload: (user) => { const r = rec('reload', user && user.uid); if (r) return r; if (verifiedAfterReload) user.emailVerified = true; return Promise.resolve(); },
    doc: (db, ...path) => ({ path: path.join('/') }),
    collection: (db, ...path) => ({ path: path.join('/') }),
    query: (coll, w) => ({ path: coll.path, where: w }),
    where: (field, op, value) => ({ field, op, value }),
    getDocs: (ref) => {
      const r = rec('getDocs', ref.path, ref.where ? ref.where.value : undefined);
      if (r) return r;
      if (ref.path === 'users/u1/scenarios') return Promise.resolve({ forEach: (fn) => docs.forEach((id) => fn({ id, data: () => ({}) })) });
      if (ref.path === 'users/u1/profile') return Promise.resolve({ forEach: (fn) => { if (profile) fn({ id: 'settings', data: () => profile }); } });
      if (ref.path === 'fundSuggestions') return Promise.resolve({ forEach: (fn) => suggestions.forEach((id) => fn({ id, ref: { path: 'fundSuggestions/' + id } })) });
      return Promise.resolve({ forEach: () => {} });
    },
    deleteDoc: (ref) => rec('deleteDoc', ref.path) || Promise.resolve(),
    updateDoc: (ref, data) => rec('updateDoc', ref.path, copy(data)) || Promise.resolve()
  };
  return F;
}
/** A window that records what was offered to save. */
function fakeWin() {
  const saved = [];
  const win = {
    saved,
    Blob: class { constructor(parts, opts) { this.text = parts.join(''); this.type = opts && opts.type; win.lastBlob = this; } },
    URL: { createObjectURL: () => 'blob:x', revokeObjectURL: () => {} },
    document: { body: { appendChild: () => {} }, createElement: () => { const a = { click() { saved.push({ name: a.download, text: win.lastBlob.text }); }, remove() {} }; return a; } },
    setTimeout: (fn) => fn(), clearTimeout: () => {}
  };
  return win;
}

/** A page on #/account: the session as given; signed in, the plans read; the effect started with planSource's handles. */
function page({ session = 'nobody', raws = [DRAFT], fb = fakeFb(), win = fakeWin(), local = storage({ pt_lastActivity: '1' }), sess = storage({ pt_v7_draft: '{}' }), verified = true } = {}) {
  const store = createStore(initialState({ today: TODAY, build: 'test' }), reduce);
  store.dispatch({ type: A.ROUTE_SET, route: parse('#/account') });
  const user = session === 'nobody' ? null : { uid: 'u1', email: 'a@b.c', emailVerified: session === 'in' && verified, getIdToken: () => Promise.resolve('t') };
  store.dispatch({ type: A.SESSION_SET, session: { kind: session, email: user ? user.email : null } });
  if (session === 'in') { store.dispatch({ type: A.PLANS_SET, list: upgradedList(raws, NOW), source: 'account', readAt: '14:03' }); store.dispatch({ type: A.PLANS_VIEW, view: viewFor(store.getState()) }); }
  const actions = [];
  store.subscribe((s, a) => actions.push(a));
  const auth = { name: 'auth' };
  const handles = () => ({ auth, db: { name: 'db' }, user, reread: () => Promise.resolve() });
  const stop = startAccount(store, { win, local, session: sess, now: () => NOW, fb, handles });
  const ask = (what, extra = {}) => store.dispatch({ type: A.ACCOUNT_ASK, what, ...extra });
  return { store, fb, win, local, sess, actions, stop, ask, user, acc: () => store.getState().ui.account, types: () => actions.map((a) => a.type) };
}

describe('sign in, sign up, Google, the reset email: the planner\'s AuthService through the account effect; the password never in the state', () => {
  it('sign in: the service called with the boxes\' email and password; the state holds busy, then done — never the password', async () => {
    const p = page();
    p.ask('signIn', { email: ' a@b.c ', password: 'secret-pw' });
    expect(p.acc().busy).toBe('signIn');
    expect(JSON.stringify(p.store.getState())).not.toContain('secret-pw');
    await tick();
    expect(p.fb.calls).toEqual([['signInWithEmailAndPassword', 'a@b.c', 'secret-pw']]);
    expect(p.acc()).toMatchObject({ busy: null, problem: null, note: { what: 'signIn', slots: {} } });
    expect(JSON.stringify(p.store.getState())).not.toContain('secret-pw');
    expect(p.local.calls.filter(([c]) => c === 'setItem')).toEqual([]);
    p.stop();
  });
  it('empty boxes are refused before the service is asked; the service\'s reason comes back as its code, for the words', async () => {
    const p = page({ fb: fakeFb({ fails: { signInWithEmailAndPassword: 'auth/wrong-password' } }) });
    p.ask('signIn', { email: 'a@b.c', password: '' });
    await tick();
    expect(p.fb.calls).toEqual([]);
    expect(p.acc().problem).toEqual({ what: 'signIn', code: 'empty' });
    p.ask('signIn', { email: 'a@b.c', password: 'x' });
    await tick();
    expect(p.acc().problem).toEqual({ what: 'signIn', code: 'auth/wrong-password' });
    expect(ACCOUNT.problems['auth/wrong-password']).toBeTypeOf('string');
    // a second ask while one is under way is ignored by the reducer
    p.ask('signIn', { email: 'a@b.c', password: 'x' });
    const s = p.store.getState();
    expect(reduce(s, { type: A.ACCOUNT_ASK, what: 'google' })).toBe(s);
    p.stop();
  });
  it('sign up: the account made, then the confirmation email (the planner\'s signUpWithEmail); its failure is not a failed sign-up', async () => {
    const p = page();
    p.ask('signUp', { email: 'new@b.c', password: 'longer-pw' });
    await tick();
    expect(p.fb.calls).toEqual([['createUserWithEmailAndPassword', 'new@b.c', 'longer-pw'], ['sendEmailVerification', 'new@b.c']]);
    expect(p.acc().note).toEqual({ what: 'signUp', slots: { email: 'new@b.c' } });
    const q = page({ fb: fakeFb({ fails: { sendEmailVerification: 'auth/too-many-requests' } }) });
    q.ask('signUp', { email: 'new@b.c', password: 'longer-pw' });
    await tick();
    expect(q.acc().note).toEqual({ what: 'signUp', slots: { email: 'new@b.c' } });
    const r = page({ fb: fakeFb({ fails: { createUserWithEmailAndPassword: 'auth/email-already-in-use' } }) });
    r.ask('signUp', { email: 'new@b.c', password: 'longer-pw' });
    await tick();
    expect(r.acc().problem).toEqual({ what: 'signUp', code: 'auth/email-already-in-use' });
    expect(r.fb.calls.length).toBe(1);
    p.stop(); q.stop(); r.stop();
  });
  it('Google: a pop-up with a GoogleAuthProvider; closed by the person, its code', async () => {
    const p = page();
    p.ask('google');
    await tick();
    expect(p.fb.calls).toEqual([['signInWithPopup', 'google']]);
    const q = page({ fb: fakeFb({ fails: { signInWithPopup: 'auth/popup-closed-by-user' } }) });
    q.ask('google');
    await tick();
    expect(q.acc().problem).toEqual({ what: 'google', code: 'auth/popup-closed-by-user' });
    p.stop(); q.stop();
  });
  it('the reset email: to the email typed when nobody is signed in (an empty box refused), to the account\'s own when signed in', async () => {
    const p = page();
    p.ask('reset', { email: '' });
    await tick();
    expect(p.acc().problem).toEqual({ what: 'reset', code: 'emptyEmail' });
    p.ask('reset', { email: 'a@b.c' });
    await tick();
    expect(p.fb.calls).toEqual([['sendPasswordResetEmail', 'a@b.c']]);
    expect(p.acc().note).toEqual({ what: 'reset', slots: { email: 'a@b.c' } });
    const q = page({ session: 'in' });
    q.ask('reset');
    await tick();
    expect(q.fb.calls).toEqual([['getDocs', 'users/u1/profile', undefined], ['sendPasswordResetEmail', 'a@b.c']]);
    p.stop(); q.stop();
  });
});

describe('"Confirm your email": the same gate as the planner', () => {
  it('"I\'ve confirmed": the user reloaded and the token refreshed; confirmed → the session becomes "in" and the plans are read; not → "notYet"', async () => {
    const p = page({ session: 'unverified', fb: fakeFb({ verifiedAfterReload: false }) });
    p.ask('verifyCheck');
    await tick();
    expect(p.fb.calls).toEqual([['reload', 'u1']]);
    expect(p.acc().problem).toEqual({ what: 'verifyCheck', code: 'notYet' });
    expect(p.store.getState().session.kind).toBe('unverified');
    const q = page({ session: 'unverified' });
    q.ask('verifyCheck');
    await tick();
    expect(q.store.getState().session).toEqual({ kind: 'in', email: 'a@b.c', signingOut: false });
    expect(q.types()).toContain(A.PLANS_READING);
    p.stop(); q.stop();
  });
  it('"Send it again" sends the confirmation email to the signed-in user; "Sign out" on the gate signs out through the service (the session is not "in", so the plan source\'s own sign-out does not apply)', async () => {
    const p = page({ session: 'unverified' });
    p.ask('verifySend');
    await tick();
    expect(p.fb.calls).toEqual([['sendEmailVerification', 'a@b.c']]);
    expect(p.acc().note).toEqual({ what: 'verifySend', slots: {} });
    p.ask('signOut');
    await tick();
    expect(p.fb.calls[1]).toEqual(['signOut']);
    expect(reduce(p.store.getState(), { type: A.SESSION_OUT })).toBe(p.store.getState());   // the reducer's SESSION_OUT is for 'in' only
    p.stop();
  });
});

describe('the settings document: read once per sign-in into ui.profile; its ONE write on news/seen; a missing document left alone', () => {
  it('signed in: getDocs of users/{uid}/profile, the settings document\'s lastSeenVersion into the state; none → null; the read failing → null, never a write', async () => {
    const p = page({ session: 'in' });
    await tick();
    expect(p.fb.calls).toEqual([['getDocs', 'users/u1/profile', undefined]]);
    expect(p.store.getState().ui.profile).toEqual({ lastSeenVersion: '6.40.0' });
    const q = page({ session: 'in', fb: fakeFb({ profile: null }) });
    await tick();
    expect(q.store.getState().ui.profile).toEqual({ lastSeenVersion: null });
    const r = page({ session: 'in', fb: fakeFb({ fails: { getDocs: 'permission-denied' } }) });
    await tick();
    expect(r.store.getState().ui.profile).toEqual({ lastSeenVersion: null });
    expect(r.fb.calls.filter(([c]) => c === 'updateDoc')).toEqual([]);
    p.stop(); q.stop(); r.stop();
  });
  it('news/seen: ONE updateDoc of users/{uid}/profile/settings { lastSeenVersion }; not-found is swallowed (nothing is made); nobody signed in: nothing', async () => {
    const p = page({ session: 'in' });
    await tick();
    p.store.dispatch({ type: A.NEWS_SEEN, version: VERSION });
    await tick();
    expect(p.fb.calls[1]).toEqual(['updateDoc', 'users/u1/profile/settings', { lastSeenVersion: VERSION }]);
    const q = page({ session: 'in', fb: fakeFb({ fails: { updateDoc: 'not-found' } }) });
    await tick();
    q.store.dispatch({ type: A.NEWS_SEEN, version: VERSION });
    await tick();
    expect(q.fb.calls.filter(([c]) => c === 'updateDoc').length).toBe(1);
    expect(q.store.getState().ui.news.seen).toBe(VERSION);
    const r = page();
    r.store.dispatch({ type: A.NEWS_SEEN, version: VERSION });
    await tick();
    expect(r.fb.calls).toEqual([]);
    p.stop(); q.stop(); r.stop();
  });
});

describe('"Download everything": one file with every plan (identity stripped) and the settings document; nothing is sent anywhere', () => {
  it('the file, its name and its shape', async () => {
    const withUid = { ...copy(LADDER), uid: 'u1' };
    const p = page({ session: 'in', raws: [DRAFT, withUid] });
    await tick();
    p.ask('download');
    await tick();
    expect(p.win.saved.length).toBe(1);
    expect(p.win.saved[0].name).toBe(everythingFileName(NOW));
    expect(p.win.saved[0].name).toBe(EVERYTHING_FILE_PREFIX + '2026-10-02.json');
    const plans = p.store.getState().plans.list.map((e) => e.plan);
    expect(p.win.saved[0].text).toBe(everythingJson(plans, { lastSeenVersion: '6.40.0' }, { now: NOW }));
    const parsed = JSON.parse(p.win.saved[0].text);
    expect(parsed.app).toBe('Drawdown Planner');
    expect(parsed.version).toBe(VERSION);
    expect(parsed.plans.length).toBe(2);
    expect(parsed.plans[1]).toEqual(stripIdentity(plans[1]));
    expect(JSON.stringify(parsed)).not.toContain('"uid"');
    expect(parsed.profile).toEqual({ lastSeenVersion: '6.40.0' });
    expect(p.acc().note).toEqual({ what: 'download', slots: { file: everythingFileName(NOW) } });
    expect(p.fb.calls.filter(([c]) => c !== 'getDocs')).toEqual([]);
    expect(p.sess.calls.filter(([c]) => c !== 'getItem')).toEqual([]);
    // nobody signed in: refused
    const q = page();
    q.ask('download');
    await tick();
    expect(q.acc().problem).toEqual({ what: 'download', code: 'notSignedIn' });
    expect(q.win.saved).toEqual([]);
    p.stop(); q.stop();
  });
});

describe('"Delete my account": the two confirms, then the planner\'s order document by document, the storage cleared, the sign-in deleted', () => {
  it('the reducer: no deletion without the second confirm on screen; the confirms open and close; nothing while something is under way', () => {
    const s0 = page({ session: 'in' }).store.getState();
    expect(reduce(s0, { type: A.ACCOUNT_ASK, what: 'delete' })).toBe(s0);
    const s1 = reduce(s0, { type: A.ACCOUNT_CONFIRM, step: 1 });
    expect(s1.ui.account.confirm).toBe(1);
    expect(reduce(s1, { type: A.ACCOUNT_ASK, what: 'delete' })).toBe(s1);
    const s2 = reduce(s1, { type: A.ACCOUNT_CONFIRM, step: 2 });
    expect(reduce(s2, { type: A.ACCOUNT_CONFIRM, step: null }).ui.account.confirm).toBe(null);
    const s3 = reduce(s2, { type: A.ACCOUNT_ASK, what: 'delete' });
    expect(s3.ui.account.busy).toBe('delete');
    expect(reduce(s3, { type: A.ACCOUNT_CONFIRM, step: 1 })).toBe(s3);
  });
  it('the order: every plan read again and deleted one by one, the settings document, the person\'s fund-suggestion rows (a query by uid), localStorage and sessionStorage cleared, then deleteUser; the state says the sign-in is gone', async () => {
    const p = page({ session: 'in', fb: fakeFb({ docs: ['P1', 'P2'], suggestions: ['S1'] }) });
    await tick();
    p.fb.calls.length = 0;
    p.store.dispatch({ type: A.ACCOUNT_CONFIRM, step: 1 });
    p.store.dispatch({ type: A.ACCOUNT_CONFIRM, step: 2 });
    p.ask('delete');
    await tick(12);
    expect(p.fb.calls).toEqual([
      ['getDocs', 'users/u1/scenarios', undefined],
      ['deleteDoc', 'users/u1/scenarios/P1'],
      ['deleteDoc', 'users/u1/scenarios/P2'],
      ['deleteDoc', 'users/u1/profile/settings'],
      ['getDocs', 'fundSuggestions', 'u1'],
      ['deleteDoc', 'fundSuggestions/S1'],
      ['deleteUser', 'u1']
    ]);
    expect(p.local.calls).toContainEqual(['clear']);
    expect(p.sess.calls).toContainEqual(['clear']);
    expect(p.local.map.size).toBe(0);
    expect(p.acc()).toMatchObject({ busy: null, confirm: null, deleted: { signInGone: true } });
    expect(p.types()).toContain(A.PLANS_CLEAR);
    p.stop();
  });
  it('auth/requires-recent-login: the data is already gone; the person is signed out and told to sign in again and press once more; a second round deletes the sign-in', async () => {
    const fb = fakeFb({ docs: ['P1'], fails: { deleteUser: 'auth/requires-recent-login' } });
    const p = page({ session: 'in', fb });
    await tick();
    fb.calls.length = 0;
    p.store.dispatch({ type: A.ACCOUNT_CONFIRM, step: 1 });
    p.store.dispatch({ type: A.ACCOUNT_CONFIRM, step: 2 });
    p.ask('delete');
    await tick(12);
    expect(fb.calls.map((c) => c[0])).toEqual(['getDocs', 'deleteDoc', 'deleteDoc', 'getDocs', 'deleteUser', 'signOut']);
    expect(p.acc().deleted).toEqual({ signInGone: false });
    expect(ACCOUNT.remove.needsSignIn).toContain('have been deleted');
    // signed in again (the fresh sign-in the service wants): the second round finds nothing to delete and removes the sign-in
    const fb2 = fakeFb({ docs: [] });
    const q = page({ session: 'in', fb: fb2 });
    await tick();
    fb2.calls.length = 0;
    q.store.dispatch({ type: A.ACCOUNT_CONFIRM, step: 1 });
    q.store.dispatch({ type: A.ACCOUNT_CONFIRM, step: 2 });
    q.ask('delete');
    await tick(12);
    expect(fb2.calls.map((c) => c[0])).toEqual(['getDocs', 'deleteDoc', 'getDocs', 'deleteUser']);
    expect(q.acc().deleted).toEqual({ signInGone: true });
    p.stop(); q.stop();
  });
  it('a document that will not delete stops the deletion there: nothing more is deleted, the storage is not cleared, the sign-in stays, and the page says so; an older rule refusing the suggestions read does not stop it', async () => {
    const fb = fakeFb({ docs: ['P1', 'P2'], fails: { deleteDoc: 'permission-denied' } });
    const p = page({ session: 'in', fb });
    await tick();
    fb.calls.length = 0;
    p.store.dispatch({ type: A.ACCOUNT_CONFIRM, step: 1 });
    p.store.dispatch({ type: A.ACCOUNT_CONFIRM, step: 2 });
    p.ask('delete');
    await tick(12);
    expect(fb.calls.map((c) => c[0])).toEqual(['getDocs', 'deleteDoc']);
    expect(p.local.calls).not.toContainEqual(['clear']);
    expect(p.acc().problem).toEqual({ what: 'delete', code: 'deleteFailed' });
    expect(p.acc().deleted).toBe(null);
    const fb2 = fakeFb({ docs: ['P1'] });
    const realGetDocs = fb2.getDocs;
    fb2.getDocs = (ref) => (ref.path === 'fundSuggestions' ? Promise.reject(err('permission-denied')) : realGetDocs(ref));
    const q = page({ session: 'in', fb: fb2 });
    await tick();
    fb2.calls.length = 0;
    q.store.dispatch({ type: A.ACCOUNT_CONFIRM, step: 1 });
    q.store.dispatch({ type: A.ACCOUNT_CONFIRM, step: 2 });
    q.ask('delete');
    await tick(12);
    expect(fb2.calls.map((c) => c[0])).toEqual(['getDocs', 'deleteDoc', 'deleteDoc', 'deleteUser']);
    expect(q.acc().deleted).toEqual({ signInGone: true });
    p.stop(); q.stop();
  });
});

// ---- the screen -----------------------------------------------------------------------------------------------------------

function draw(state) {
  const root = document.createElement('div');
  root.id = 'app';
  const actions = [];
  render(h(App, { state, dispatch: (a) => actions.push(a) }), root);
  return { root, actions, text: visibleText(root) };
}
function accountState(session, { ui = {}, plans = null } = {}) {
  let s = initialState({ today: TODAY, build: 'test' });
  s = reduce(s, { type: A.ROUTE_SET, route: parse('#/account') });
  s = reduce(s, { type: A.SESSION_SET, session: { kind: session, email: session === 'none' || session === 'nobody' ? null : 'someone@example.com' } });
  if (plans) s = reduce(s, { type: A.PLANS_SET, list: upgradedList(plans, NOW), source: 'account', readAt: '14:03' });
  return { ...s, ui: { ...s.ui, ...ui, account: { ...s.ui.account, ...(ui.account || {}) } } };
}
const q = (root, sel) => root.querySelector(sel);
const SCOPES = ['all', 'first', 'planner', 'retired', 'saver', 'record'];

describe('the screen: the forms, the gate, the signed-in page', () => {
  it('nobody signed in: the sign-in form by default (email, password, Google, to sign up, forgotten); the boxes are the shell\'s own (uncontrolled, labelled); never "Delete my account"; the words', () => {
    const { root, text, actions } = draw(accountState('nobody'));
    expect(q(root, 'main').getAttribute('data-screen')).toBe('account');
    expect(q(root, 'h1').textContent).toBe(ACCOUNT.title);
    expect(q(root, '[data-testid="account.signIn"]')).not.toBe(null);
    for (const id of ['account.email', 'account.password']) {
      const box = q(root, `[data-testid="${id}"]`);
      expect(box.getAttribute('data-shell-box')).toBeTruthy();
      expect(q(root, `label[for="${id}"]`).textContent).toBeTruthy();
      expect(box.getAttribute('value')).toBe(null);
    }
    expect(q(root, '[data-testid="account.password"]').type).toBe('password');
    expect(q(root, '[data-testid="account.google"]')).not.toBe(null);
    expect(text).not.toContain(ACCOUNT.remove.button);
    expect(q(root, '[data-testid="account.delete"]')).toBe(null);
    for (const hit of bannedHits(text, SCOPES)) expect(hit).toBe('');
    // the form submits with the boxes' text; the state never holds the password
    const form = q(root, '[data-testid="account.signIn"]');
    q(root, '[data-testid="account.email"]').value = 'a@b.c';
    q(root, '[data-testid="account.password"]').value = 'secret-pw';
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    expect(actions).toEqual([{ type: 'account/ask', what: 'signIn', email: 'a@b.c', password: 'secret-pw' }]);
    expect(JSON.stringify(reduce(accountState('nobody'), actions[0]))).not.toContain('secret-pw');
    q(root, '[data-testid="account.toSignUp"]').click();
    expect(actions[1]).toEqual({ type: 'account/mode', mode: 'signUp' });
  });
  it('the sign-up and forgotten-password forms; a problem and a note in words; busy rests the buttons', () => {
    const up = draw(accountState('nobody', { ui: { account: { mode: 'signUp' } } }));
    expect(q(up.root, '[data-testid="account.signUp"]')).not.toBe(null);
    expect(q(up.root, '[data-testid="account.password"]').getAttribute('autocomplete')).toBe('new-password');
    const reset = draw(accountState('nobody', { ui: { account: { mode: 'reset', note: { what: 'reset', slots: { email: 'a@b.c' } } } } }));
    expect(q(reset.root, '[data-testid="account.reset"]')).not.toBe(null);
    expect(q(reset.root, '[data-testid="account.password"]')).toBe(null);
    expect(q(reset.root, '[data-testid="account.note"]').textContent).toContain('a@b.c');
    const bad = draw(accountState('nobody', { ui: { account: { problem: { what: 'signIn', code: 'auth/wrong-password' } } } }));
    expect(q(bad.root, '[data-testid="account.problem"]').textContent).toBe(ACCOUNT.problems['auth/wrong-password']);
    const unknown = draw(accountState('nobody', { ui: { account: { problem: { what: 'signIn', code: 'auth/some-new-code' } } } }));
    expect(q(unknown.root, '[data-testid="account.problem"]').textContent).toBe(ACCOUNT.problems.failed);
    const busy = draw(accountState('nobody', { ui: { account: { busy: 'signIn' } } }));
    expect(q(busy.root, '[data-testid="account.signIn.submit"]').getAttribute('aria-disabled')).toBe('true');
    expect(q(busy.root, '[data-testid="account.signIn.submit"]').textContent).toBe(ACCOUNT.forms.working);
  });
  it('the email not confirmed: the gate with its three buttons, each dispatching its ask; "not yet" in words', () => {
    const { root, actions, text } = draw(accountState('unverified'));
    expect(q(root, '[data-testid="account.verify"]')).not.toBe(null);
    expect(text).toContain('someone@example.com');
    q(root, '[data-testid="account.verify.check"]').click();
    q(root, '[data-testid="account.verify.send"]').click();
    q(root, '[data-testid="account.verify.signOut"]').click();
    expect(actions.map((a) => a.what)).toEqual(['verifyCheck', 'verifySend', 'signOut']);
    const notYet = draw(accountState('unverified', { ui: { account: { problem: { what: 'verifyCheck', code: 'notYet' } } } }));
    expect(q(notYet.root, '[data-testid="account.problem"]').textContent).toBe(ACCOUNT.verify.notYet);
    expect(q(root, '[data-testid="account.delete"]')).toBe(null);
  });
  it('signed in: the email and "confirmed", the reset button, Download everything, Delete my account through its two confirms, Sign out, the privacy policy; after the deletion the notes', () => {
    const s = accountState('in', { plans: [DRAFT] });
    const { root, actions, text } = draw(s);
    expect(q(root, '[data-testid="account.email"]').textContent).toContain('someone@example.com');
    expect(text).toContain(ACCOUNT.confirmed);
    q(root, '[data-testid="account.reset.send"]').click();
    q(root, '[data-testid="account.download"]').click();
    q(root, '[data-testid="account.delete"]').click();
    expect(actions).toEqual([{ type: 'account/ask', what: 'reset' }, { type: 'account/ask', what: 'download' }, { type: 'account/confirm', step: 1 }]);
    expect(q(root, '[data-testid="account.privacy"]').getAttribute('href')).toBe('../privacy.html');
    q(root, '[data-testid="account.signOut"]').click();
    expect(actions[3]).toEqual({ type: 'session/out' });
    const c1 = draw(reduce(s, { type: A.ACCOUNT_CONFIRM, step: 1 }));
    expect(q(c1.root, '[data-testid="account.delete.confirm1"]').textContent).toContain(ACCOUNT.remove.ask1);
    q(c1.root, '[data-testid="account.delete.yes1"]').click();
    expect(c1.actions).toEqual([{ type: 'account/confirm', step: 2 }]);
    const c2 = draw(reduce(reduce(s, { type: A.ACCOUNT_CONFIRM, step: 1 }), { type: A.ACCOUNT_CONFIRM, step: 2 }));
    expect(q(c2.root, '[data-testid="account.delete.confirm2"]').textContent).toContain(ACCOUNT.remove.ask2);
    q(c2.root, '[data-testid="account.delete.yes2"]').click();
    expect(c2.actions).toEqual([{ type: 'account/ask', what: 'delete' }]);
    q(c2.root, '[data-testid="account.delete.no"]').click();
    expect(c2.actions[1]).toEqual({ type: 'account/confirm', step: null });
    const again = draw(accountState('in', { plans: [], ui: { account: { deleted: { signInGone: false } } } }));
    expect(q(again.root, '[data-testid="account.deleted.again"]').textContent).toBe(ACCOUNT.remove.needsSignIn);
    const gone = draw(accountState('nobody', { ui: { account: { deleted: { signInGone: true } } } }));
    expect(q(gone.root, '[data-testid="account.deleted.done"]').textContent).toBe(ACCOUNT.remove.done);
    for (const hit of bannedHits(text, SCOPES)) expect(hit).toBe('');
    expect(accountView(s).email).toBe('someone@example.com');
  });
  it('checking: a waiting line, no form, no button', () => {
    const { root } = draw(accountState('checking'));
    expect(q(root, '[data-testid="account.opening"]')).not.toBe(null);
    expect(q(root, 'input')).toBe(null);
    expect(q(root, '[data-testid="account.delete"]')).toBe(null);
  });
});
