/**
 * The account effect — the THIRD and last V7 file that talks to Firebase (research/v7/road-to-7.md step 11; the rules in
 * tests/v7/boundaries.test.js 3b, 3c): the sign-in, sign-up, Google, password-reset and email-confirmation flows of the
 * planner's AuthService.js and AuthScreen.js; the account's settings document (profile) read and its one write; the
 * account's deletion; "Download everything". Started by effects/planSource.js with that file's auth and Firestore handles
 * (no second Firebase app) and its signed-in user, on the pages that need the plans (the plan pages, the account page,
 * What's new).
 *
 * What it does, on `account/ask` (ui.account.busy = what), each told as account/done or account/failed:
 *   - signIn: signInWithEmailAndPassword; signUp: createUserWithEmailAndPassword then sendEmailVerification (the planner's
 *     signUpWithEmail — Firestore's rules require a confirmed email, so the account is closed until then); google:
 *     signInWithPopup with a GoogleAuthProvider; reset: sendPasswordResetEmail (the planner has no in-app password change:
 *     the reset email is the way). The password lives in the action only — never in the state, never in storage.
 *     Who is signed in then comes from the plan source's onAuthStateChanged, as every sign-in does.
 *   - verifyCheck: the user reloaded (AuthService.reloadCurrentUser: reload, then a fresh ID token so the server sees
 *     email_verified) — confirmed: the session becomes 'in' and the plans are read; not: 'notYet'. verifySend: the email again.
 *   - download: ONE file — every plan in the account as read (identity stripped, services/PlanExport.js stripIdentity)
 *     and the settings document — saved on the person's own computer (effects/download.js saveFile). Nothing is sent anywhere.
 *   - delete (after its two confirms on screen, which the reducer insists on): what the planner's wipeAllUserData deletes,
 *     deleted here one document at a time — every users/{uid}/scenarios/{id} (read again first: getDocs), then
 *     users/{uid}/profile/settings, then every fundSuggestions document whose uid is the person's (a query; an older rule
 *     may refuse the read, and the deletion still goes on, as the planner's does); then this browser's storage for this
 *     site cleared (localStorage and sessionStorage, as the planner's Delete Account clears localStorage); then deleteUser.
 *     On auth/requires-recent-login the data is already gone: the person is signed out and asked to sign in again on the
 *     page and press "Delete my account" once more (account/deleted with signInGone false). A document that would not
 *     delete stops the deletion there: nothing more is changed, and the page says so ('deleteFailed').
 *   - signOut from the "Confirm your email" gate (the session is not 'in', so the plan source's own sign-out does not
 *     apply): signOut; the plan source then sees nobody.
 * The settings document (users/{uid}/profile/settings) is read once per sign-in with getDocs of the profile collection
 * (no getDoc: the reader's allowed names) into ui.profile, for What's new; `news/seen` (effects/whatsNew.js) writes
 * lastSeenVersion to it with the ONE updateDoc of this file — a document that does not exist yet is left alone (updateDoc
 * fails with not-found; nothing is created: no setDoc anywhere V7 can reach).
 *
 * The names imported from the Firebase packages are exactly the ones below; the boundary test holds them, and holds
 * `F.deleteDoc(` to the three call sites here and `F.updateDoc(` to one.
 *
 *   EVERYTHING_FILE_PREFIX   'drawdown-planner-everything-'
 *   everythingFileName(now)  'drawdown-planner-everything-<YYYY-MM-DD>.json' (the local day)
 *   everythingJson(plans, profile, { version, now })   the file's text
 *   startAccount(store, { win, local, session, now, fb, handles }) → stop()
 */
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, sendEmailVerification, sendPasswordResetEmail, deleteUser, signOut, reload } from 'firebase/auth';
import { doc, deleteDoc, getDocs, collection, query, where, updateDoc } from 'firebase/firestore/lite';
import { A } from '../state/actions.js';
import { VERSION } from '../../constants.js';
import { stripIdentity } from '../../services/PlanExport.js';
import { saveFile } from './download.js';

export const EVERYTHING_FILE_PREFIX = 'drawdown-planner-everything-';

/** 'drawdown-planner-everything-<YYYY-MM-DD>.json', the date the LOCAL day (as PlanExport.planExportFileName). */
export function everythingFileName(now = new Date()) {
  const day = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
  return EVERYTHING_FILE_PREFIX + day + '.json';
}

/** The file's text: every plan as read (identity stripped), the settings document, when and by which version. */
export function everythingJson(plans, profile, { version = VERSION, now = new Date() } = {}) {
  const file = {
    app: 'Drawdown Planner', version, exportedAt: now.toISOString(),
    plans: (Array.isArray(plans) ? plans : []).map((p) => stripIdentity(p)),
    profile: profile && typeof profile === 'object' ? stripIdentity(profile) : null
  };
  return JSON.stringify(file, null, 1);
}

const codeOf = (e) => (e && typeof e.code === 'string' ? e.code : '');

/**
 * @param {{ getState, dispatch, subscribe }} store
 * @param {object} o
 * @param {Window|null} [o.win]        the download, and the page's storage to clear on deletion
 * @param {Storage|null} [o.local]     localStorage (cleared on deletion)
 * @param {Storage|null} [o.session]   sessionStorage (cleared on deletion)
 * @param {() => Date} [o.now]
 * @param {object|null} [o.fb]         the Firebase functions (the tests hand in fakes); the real ones otherwise
 * @param {() => { auth, db, user, reread }} o.handles   planSource's handles: the auth and Firestore handles, the signed-in user, "read the account again"
 */
export function startAccount(store, { win = null, local = null, session = null, now = () => new Date(), fb = null, handles }) {
  const F = fb || { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, sendEmailVerification, sendPasswordResetEmail, deleteUser, signOut, reload, doc, deleteDoc, getDocs, collection, query, where, updateDoc };
  let stopped = false;
  let profileFor = null;                 // the uid whose settings document was read (once per sign-in)
  const dispatch = (a) => { if (!stopped) store.dispatch(a); };
  const done = (what, slots = {}) => dispatch({ type: A.ACCOUNT_DONE, what, slots });
  const fail = (what, problem) => dispatch({ type: A.ACCOUNT_FAILED, what, problem });
  const H = () => handles() || {};

  /** The account's settings document, read with getDocs of the profile collection (the reader's names): { lastSeenVersion } or {} when there is none. */
  async function readProfile(db, uid) {
    const snap = await F.getDocs(F.collection(db, 'users', uid, 'profile'));
    let settings = {};
    snap.forEach((d) => { if (d.id === 'settings') settings = d.data() || {}; });
    return settings;
  }

  async function profileOnSignIn(state) {
    const h = H();
    if (!state.session || state.session.kind !== 'in' || !h.user || !h.db) return;
    if (profileFor === h.user.uid) return;
    profileFor = h.user.uid;
    const uid = h.user.uid;
    let profile = null;
    try { profile = await readProfile(h.db, uid); } catch { profile = {}; }
    if (stopped || profileFor !== uid) return;
    dispatch({ type: A.PROFILE_SET, profile: { lastSeenVersion: typeof profile.lastSeenVersion === 'string' ? profile.lastSeenVersion : null } });
  }

  async function signIn(email, password) {
    const h = H();
    if (!h.auth) { fail('signIn', 'failed'); return; }
    if (!email || !password) { fail('signIn', 'empty'); return; }
    try { await F.signInWithEmailAndPassword(h.auth, email, password); done('signIn'); } catch (e) { fail('signIn', codeOf(e) || 'failed'); }
  }
  async function signUp(email, password) {
    const h = H();
    if (!h.auth) { fail('signUp', 'failed'); return; }
    if (!email || !password) { fail('signUp', 'empty'); return; }
    let cred;
    try { cred = await F.createUserWithEmailAndPassword(h.auth, email, password); } catch (e) { fail('signUp', codeOf(e) || 'failed'); return; }
    // the confirmation email, as the planner sends it: a failure here is not a failed sign-up ("Send it again" is on the gate)
    try { if (cred && cred.user) await F.sendEmailVerification(cred.user); } catch { /* the gate offers it again */ }
    done('signUp', { email });
  }
  async function google() {
    const h = H();
    if (!h.auth) { fail('google', 'failed'); return; }
    try { await F.signInWithPopup(h.auth, new F.GoogleAuthProvider()); done('google'); } catch (e) { fail('google', codeOf(e) || 'failed'); }
  }
  async function reset(email) {
    const h = H();
    const to = email || (store.getState().session && store.getState().session.email) || '';
    if (!h.auth) { fail('reset', 'failed'); return; }
    if (!to) { fail('reset', 'emptyEmail'); return; }
    try { await F.sendPasswordResetEmail(h.auth, to); done('reset', { email: to }); } catch (e) { fail('reset', codeOf(e) || 'failed'); }
  }
  async function verifyCheck() {
    const h = H();
    if (!h.user) { fail('verifyCheck', 'notSignedIn'); return; }
    try {
      await F.reload(h.user);
      // the rules read email_verified from the ID token, which reload does not refresh (AuthService.reloadCurrentUser)
      try { if (typeof h.user.getIdToken === 'function') await h.user.getIdToken(true); } catch { /* offline: the next request refreshes */ }
    } catch (e) { fail('verifyCheck', codeOf(e) || 'failed'); return; }
    if (stopped) return;
    if (!h.user.emailVerified) { fail('verifyCheck', 'notYet'); return; }
    done('verifyCheck');
    dispatch({ type: A.SESSION_SET, session: { kind: 'in', email: h.user.email || null } });
    dispatch({ type: A.PLANS_READING });
  }
  async function verifySend() {
    const h = H();
    if (!h.user) { fail('verifySend', 'notSignedIn'); return; }
    try { await F.sendEmailVerification(h.user); done('verifySend'); } catch (e) { fail('verifySend', codeOf(e) || 'failed'); }
  }
  async function signOutNow() {
    const h = H();
    try { if (h.auth) await F.signOut(h.auth); } catch { /* the session is gone from the page either way */ }
  }

  async function download() {
    const h = H();
    const state = store.getState();
    if (!state.session || state.session.kind !== 'in' || !h.user || !h.db) { fail('download', 'notSignedIn'); return; }
    const plans = state.plans && state.plans.status === 'read' && state.plans.source === 'account' ? state.plans.list.map((e) => e.plan) : null;
    if (!plans) { fail('download', 'failed'); return; }
    let profile = null;
    try { profile = await readProfile(h.db, h.user.uid); } catch { profile = null; }
    if (stopped) return;
    const name = everythingFileName(now());
    if (!saveFile(win, name, everythingJson(plans, profile, { now: now() }))) { fail('download', 'failed'); return; }
    done('download', { file: name });
  }

  /** The deletion, in the planner's order, one document at a time; nothing automatic, nothing before the two confirms. */
  async function remove() {
    const h = H();
    const state = store.getState();
    if (!state.session || state.session.kind !== 'in' || !h.user || !h.db || !h.auth) { fail('delete', 'notSignedIn'); return; }
    const uid = h.user.uid;
    const user = h.user;
    try {
      const snap = await F.getDocs(F.collection(h.db, 'users', uid, 'scenarios'));
      const ids = [];
      snap.forEach((d) => ids.push(d.id));
      for (const id of ids) await F.deleteDoc(F.doc(h.db, 'users', uid, 'scenarios', id));
      await F.deleteDoc(F.doc(h.db, 'users', uid, 'profile', 'settings'));
    } catch { fail('delete', 'deleteFailed'); return; }
    // the only personal data outside users/{uid}: the fund-suggestion rows this person filed (they carry the uid)
    try {
      const rows = await F.getDocs(F.query(F.collection(h.db, 'fundSuggestions'), F.where('uid', '==', uid)));
      const refs = [];
      rows.forEach((d) => refs.push(d.ref));
      for (const ref of refs) await F.deleteDoc(ref);
    } catch { /* an older rule may refuse the read; the account's deletion still goes on, as the planner's does */ }
    if (stopped) return;
    try { if (local) local.clear(); } catch { /* private mode */ }
    try { if (session) session.clear(); } catch { /* private mode */ }
    dispatch({ type: A.PLANS_CLEAR });
    try {
      await F.deleteUser(user);
      dispatch({ type: A.ACCOUNT_DELETED, signInGone: true });
    } catch (e) {
      if (codeOf(e) === 'auth/requires-recent-login') {
        // the data is gone; the sign-in itself needs a fresh sign-in: sign out, so the page offers the form, and say so
        await signOutNow();
        dispatch({ type: A.ACCOUNT_DELETED, signInGone: false });
      } else fail('delete', codeOf(e) || 'failed');
    }
  }

  async function markSeen(version) {
    const h = H();
    const state = store.getState();
    if (!state.session || state.session.kind !== 'in' || !h.user || !h.db) return;
    try { await F.updateDoc(F.doc(h.db, 'users', h.user.uid, 'profile', 'settings'), { lastSeenVersion: version }); } catch { /* no settings document yet: nothing is made (no setDoc) */ }
  }

  profileOnSignIn(store.getState());
  const off = store.subscribe((state, action) => {
    if (action.type === A.SESSION_SET) { if (state.session.kind !== 'in') profileFor = null; profileOnSignIn(state); return; }
    if (action.type === A.NEWS_SEEN) { markSeen(action.version); return; }
    if (action.type !== A.ACCOUNT_ASK) return;
    const acc = state.ui.account;
    if (!acc || acc.busy !== action.what) return;
    const email = typeof action.email === 'string' ? action.email.trim() : '';
    const password = typeof action.password === 'string' ? action.password : '';
    const run = (fn) => fn().catch(() => fail(action.what, 'failed'));
    if (action.what === 'signIn') run(() => signIn(email, password));
    else if (action.what === 'signUp') run(() => signUp(email, password));
    else if (action.what === 'google') run(google);
    else if (action.what === 'reset') run(() => reset(email));
    else if (action.what === 'verifyCheck') run(verifyCheck);
    else if (action.what === 'verifySend') run(verifySend);
    else if (action.what === 'download') run(download);
    else if (action.what === 'delete') run(remove);
    else if (action.what === 'signOut') run(async () => { await signOutNow(); done('signOut'); });
  });
  return () => { stopped = true; off(); };
}
