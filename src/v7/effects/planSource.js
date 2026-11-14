/**
 * The plan source — the ONLY file in V7 that talks to Firebase, and it only reads (research/v7/your-plan.md 4.1, 4.3,
 * 4.4). Loaded with import() by effects/index.js on the plan pages only (#/plans, #/plan/…), so the front door and the
 * questions never wait for a sign-in check.
 *
 * What it does:
 *   - the same project and the same sign-in persistence as the planner (src/firebase/projectConfig.js), so a sign-in
 *     made in the planner carries over; Firestore "Lite", which keeps no cache: no plan data is left on the device;
 *   - who is signed in → session/set: 'checking' until Firebase answers; 'in' (email confirmed), 'unverified' (the
 *     server would refuse the read, so none is tried), 'nobody';
 *   - signed in: ONE read of users/{uid}/scenarios (getDocs), each plan brought up to date IN MEMORY by today's own
 *     pure upgrade (scenarioMigration.upgradeScenario); its `write` flag is ignored — nothing is ever written back;
 *   - nobody signed in: the plans this window kept without an account, read from sessionStorage['pt_guest_scenarios']
 *     with getItem only, parsed as text, upgraded the same way; whether the free time is used up (pt_guest_minutes, read);
 *   - read again when the page is shown again (coming back from the planner) and on "Read again" (plans/reading);
 *   - the plans leave the page's memory on pagehide, on sign-out, and when the person becomes nobody;
 *   - "Sign out" (session/out) signs out here, as the planner's menu does; the idle sign-out does the same after an hour
 *     with no activity in any window (localStorage['pt_lastActivity'], recorded by effects/activity.js). (The hand-over
 *     seed a sign-out used to delete is retired: road-to-7.md step 7 — V7 makes the plan itself, through planWrite.js.)
 *   - the hand-over offer (road-to-7.md step 11): whenever the session becomes 'in' from 'nobody' or 'unverified' while
 *     this page is open — a sign-in seen by onAuthStateChanged, or "I've confirmed" after a sign-up (effects/account.js
 *     verifyCheck, which sets the session itself: Firebase does not call the listener again for the same user) — with
 *     plans of the person's own in this window, "Bring in what you built without an account?" (guest/offer); never on
 *     the page's first known session (a page opened already signed in), the example plan never counted.
 *
 * Nothing here can write a plan: the names imported from the Firebase packages are read-only ones, and the boundary test
 * (tests/v7/boundaries.test.js) fails on any other.
 *
 * The reading for the screen (src/answers/plan/read.js: the list's rows, the route's plan on its step) is done here too, as
 * data (plans/view), whenever the plans, the address or the date change — so the reading code loads with this file, on
 * the plan pages only, and the front door's shell carries none of it (your-plan.md 4.5).
 *
 *   GUEST_PLANS_KEY                     'pt_guest_scenarios' (getItem only, never setItem)
 *   viewFor(state)                      the reading for a state: { today, rows, page } (page: the route's plan and step)
 *   upgradedList(raws, now)             the entries the readers take: [{ plan, newer, failed }]
 *   startPlanSource(store, { win, local, session, now, fb, fbWrite, client }) → stop()
 *
 * Editing (research/v7/editing-in-v7.md 1): the ONE file that writes a plan, effects/planWrite.js, is started from here with
 * this file's Firestore handle and signed-in user (no second Firebase app) and a way to read the account's plans again just
 * before a write, so the lock is checked on the plan as stored. "Keep this as a plan" makes a NEW plan through the same file
 * (road-to-7.md step 7), so this file is loaded on the keep steps and on "Will it last?" as well as on the plan pages. The reading for the editing step ("About you and when") is
 * done here too, with what was typed (state.draft.plan) laid over the saved values.
 */
import { initializeApp } from 'firebase/app';
import { initializeAuth, indexedDBLocalPersistence, browserLocalPersistence, browserSessionPersistence, onAuthStateChanged, signOut, connectAuthEmulator, updateCurrentUser } from 'firebase/auth';
import { getFirestore, collection, getDocs, connectFirestoreEmulator } from 'firebase/firestore/lite';
import { firebaseConfig, isFirebaseConfigured, EMULATOR_HOSTS } from '../../firebase/projectConfig.js';
import { upgradeScenario } from '../../firebase/scenarioMigration.js';
import { readMinutes, isBlocked } from '../../services/GuestMeter.js';
import { guestOwnPlans } from '../../services/GuestPlans.js';
import { A } from '../state/actions.js';
import { lastActivity, IDLE_MS } from './activity.js';
import { planRows, planPage } from '../../answers/plan/read.js';
import { homeOf } from '../../answers/plan/home.js';
import { aboutOf } from '../../answers/plan/about.js';
import { incomeOf } from '../../answers/plan/income.js';
import { spendOf } from '../../answers/plan/spend.js';
import { potsOf } from '../../answers/plan/pots.js';
import { lastsOf, verdictOf, leverViews, tryViews, runKeyOf } from '../../answers/plan/lasts.js';
import { wayOf, cardsOf } from '../../answers/plan/way.js';
import { mixOf } from '../../answers/plan/mix.js';
import { householdOf } from '../../answers/plan/household.js';
import { holdOf } from '../../answers/plan/hold.js';
import { keepTestOf } from '../../answers/plan/keepTest.js';
import { stressPanelView } from '../../answers/plan/stressPanel.js';
import { isClosedPlan } from '../../services/PlanClosed.js';
import { moveOf } from '../../answers/plan/move.js';
import { budgetOf } from '../../answers/plan/budget.js';
import { savingOf, askFillOf } from '../../answers/plan/saving.js';
import { checkInOf } from '../../answers/plan/checkIn.js';
import { monthOf } from '../../answers/plan/month.js';
import { startPlanWrite } from './planWrite.js';
import { startAccount } from './account.js';

export const GUEST_PLANS_KEY = 'pt_guest_scenarios';
/**
 * The name this file's Firebase app had until 7.1.0. A Firebase app keeps its sign-in under a key that holds the app's
 * name (`firebase:authUser:<key>:<name>`), and the classic planner's app is the default one: so a sign-in made here was
 * never seen by the classic planner, and the hand-over from a plan ("Record November", "Set up the tax year", "Change
 * this") opened it on its landing page, as if nobody were signed in (found 5 Nov 2026, the first signed-in browser test).
 * Since 7.1.0 this file uses the default app too — one stored sign-in for both pages — and a sign-in kept under the old
 * name is carried over once (carryOldSignIn below).
 */
export const OLD_APP_NAME = 'pt-preview';
const IDLE_CHECK_MS = 60 * 1000;

/** The plans as the readers take them: brought up to date in memory; a plan newer than this code, or one whose upgrade failed, is shown as saved. */
export function upgradedList(raws, now) {
  const out = [];
  for (const raw of raws) {
    if (!raw || typeof raw !== 'object' || raw.id == null) continue;
    let u;
    try { u = upgradeScenario(raw, { now }); } catch (e) { u = { scenario: raw, newer: false, error: e }; }
    out.push({ plan: u.scenario && typeof u.scenario === 'object' ? u.scenario : raw, newer: !!u.newer, failed: !!u.error });
  }
  return out;
}

/** The window's plans kept without an account, as text, parsed afresh (never the planner's own objects). */
export function windowPlans(session) {
  if (!session) return [];
  let text = null;
  try { text = session.getItem(GUEST_PLANS_KEY); } catch { return []; }
  if (!text) return [];
  try { const v = JSON.parse(text); return Array.isArray(v) ? v : []; } catch { return []; }
}

const clock = (d) => String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');

/** The reading for the screen: the rows always; the page for the route's plan and step when the route is a plan's. */
export function viewFor(state) {
  const plans = state.plans;
  if (!plans || plans.status !== 'read') return null;
  const today = state.env.today;
  // the to-dos put off with "Not now" in this window (7.3.0; effects/place.js keeps them in session storage, never the plan)
  const notNow = Array.isArray(state.ui.notNow) ? state.ui.notNow : [];
  const rows = planRows(plans.list, { today, source: plans.source, notNow }).groups;
  const r = state.route;
  let page = null;
  if (r && r.screen === 'plan' && r.planId) {
    // the rail's B link opens B with a saver's own figures (saving-enough-and-check-in.md 4.1: saving.js askFillOf)
    page = { ...planPage(plans.list, r.planId, r.step, { today, source: plans.source, notNow }), askFill: askFillOf(plans.list, r.planId, { today }), forId: r.planId, forStep: r.step || null };
    // the plan's own address is its home (7.3.0, research/v7/one-product-design.md "The plan home"): what is due, where you
    // are, then everything else — read from the same reading as the rail, so the two can never disagree
    if (!r.step && page.found) page.home = homeOf(plans.list, r.planId, { today, source: plans.source, notNow, page });
    // "Test what you keep against your plan" (7.7.0): the agreement's state, the line the home, About, What you hold and the move
    // say, and the re-test held in page memory (state.keepTest) for THIS plan as it is now — null on a plan that keeps nothing
    if (page.found) {
      const entry = plans.list.find((e) => e && e.plan && String(e.plan.id) === String(r.planId));
      const Kt = state.keepTest || null;
      const key = entry ? runKeyOf(entry.plan) : null;
      const mine = Kt && key && Kt.key === key ? Kt : null;
      try { page.keepTest = entry && !entry.newer && !entry.failed ? keepTestOf(entry.plan, { result: mine && mine.status === 'done' ? mine.result : null, run: mine ? { status: mine.status, reason: mine.reason, progress: mine.progress } : null }) : null; } catch { page.keepTest = null; }
      if (page.keepTest) page.keepTest = { ...page.keepTest, runKey: key, planId: String(r.planId), closed: isClosedPlan(entry.plan) };
    }
    // the editing step (editing-in-v7.md 2): the saved facts, what was typed for THIS plan, the problems, the derived figures, the write
    // "How the money is taken" (way-and-mix.md 2.2): the reading, then the cards from the nine-way run held in page memory (state.ways)
    if (r.step === 'way') {
      const reading = wayOf(plans.list, r.planId, { today });
      page.way = { ...reading, ...cardsOf(reading, state.ways) };
    }
    // "Your household" (road-to-7.md step 9): the partner, the other plans here, the boxes, the runs held in page memory (state.household), the writes
    if (r.step === 'household') {
      const pd = state.draft && state.draft.plan && state.draft.plan.id === r.planId ? state.draft.plan : null;
      const typed = pd ? pd.values : {};
      page.household = { ...householdOf(plans.list, r.planId, { today, typed, H: state.household, source: plans.source }), draftKey: JSON.stringify(typed) };
    }
    // "What you hold" (road-to-7.md step 10; holdings-and-move.md §2): the record line by line, the add box, the paste read, with what was typed
    if (r.step === 'hold') {
      const pd = state.draft && state.draft.plan && state.draft.plan.id === r.planId ? state.draft.plan : null;
      const typed = pd ? pd.values : {};
      page.hold = { ...holdOf(plans.list, r.planId, { today, typed, source: plans.source }), draftKey: JSON.stringify(typed) };
    }
    // the budget on a saved plan (road-to-7.md step 11b): the lines, the one-offs, the totals, the spreadsheet opened, with what was typed
    if (r.step === 'budget') {
      const pd = state.draft && state.draft.plan && state.draft.plan.id === r.planId ? state.draft.plan : null;
      const typed = pd ? pd.values : {};
      page.budget = { ...budgetOf(plans.list, r.planId, { today, typed, source: plans.source }), draftKey: JSON.stringify(typed) };
    }
    // "Moving to your plan's mix" (§3): the lists, the schedule, the sheet, the watch with the index the effect fetched (state.move.index), the one run held
    if (r.step === 'move') {
      const Mv = state.move || null;
      page.move = { ...moveOf(plans.list, r.planId, { today, index: Mv ? Mv.index : null, M: Mv, source: plans.source }), draftKey: '{}' };
    }
    // "What you pay in" (road-to-7.md step 11b): the Accumulation form's boxes, the relief sum, what the pot could be, the records, with what was typed
    if (r.step === 'saving') {
      const pd = state.draft && state.draft.plan && state.draft.plan.id === r.planId ? state.draft.plan : null;
      const typed = pd ? pd.values : {};
      page.saving = { ...savingOf(plans.list, r.planId, { today, typed, source: plans.source }), draftKey: JSON.stringify(typed) };
    }
    // "Check in" (research/saving-enough-and-check-in.md 5; release step R3), on its own address and on the pot step's old one:
    // the boxes with what was typed, how often, the last check-in read, the history
    if (r.step === 'checkin' || r.step === 'pot') {
      const pd = state.draft && state.draft.plan && state.draft.plan.id === r.planId ? state.draft.plan : null;
      const typed = pd ? pd.values : {};
      page.checkin = { ...checkInOf(plans.list, r.planId, { today, typed, source: plans.source }), draftKey: JSON.stringify(typed) };
    }
    // Month by month (research/v7/months-in-v7.md, 7.2.0): the month, its tax year's set-up, the pots, what to draw, the fill, with what was typed
    // (on its own address: since 7.3.0 the plan's own address is its home, which links here)
    if (r.step === 'month') {
      const pd = state.draft && state.draft.plan && state.draft.plan.id === r.planId ? state.draft.plan : null;
      const typed = pd ? pd.values : {};
      page.month = { ...monthOf(plans.list, r.planId, { today, typed, source: plans.source }), draftKey: JSON.stringify(typed) };
    }
    if (r.step === 'about' || r.step === 'income' || r.step === 'spend' || r.step === 'pots' || r.step === 'lasts' || r.step === 'mix') {
      const pd = state.draft && state.draft.plan && state.draft.plan.id === r.planId ? state.draft.plan : null;
      const typed = pd ? pd.values : {};
      // "Money that comes in anyway" (editing-in-v7.md 7), "What you spend" (8), "Your pots and tax" (9), "Does it last?" (10) and "The mix" (way-and-mix.md 3) read the same way
      const L = state.lasts;
      if (r.step === 'mix') {
        // "The mix": the tries and the comparison held in page memory (state.mix) and the plan's own test (state.lasts), read here with the plan (3.2)
        const entry = plans.list.find((e) => e && e.plan && String(e.plan.id) === String(r.planId));
        const key = entry ? runKeyOf(entry.plan) : null;
        const base = L && key && L.key === key && L.status === 'done' ? L.result : null;
        page.mix = { ...mixOf(plans.list, r.planId, { today, typed, M: state.mix, base }), draftKey: JSON.stringify(typed) };
      } else {
        const read = r.step === 'about' ? aboutOf : r.step === 'income' ? incomeOf : r.step === 'spend' ? spendOf : r.step === 'pots' ? potsOf : lastsOf;
        page[r.step] = { ...read(plans.list, r.planId, { today, typed }), draftKey: JSON.stringify(typed) };
      }
      // "Does it last?": the words of the one test's result held in page memory (state.lasts), read here with the plan (10.2)
      if (r.step === 'lasts' && page.lasts.found) {
        const pl = page.lasts;
        // (the page's own level when one was picked here — ui.level, never saved — else the plan's: the run's)
        pl.verdict = L && L.result ? verdictOf(L.result, pl, { level: state.ui && state.ui.level }) : null;
        // a locked plan: the document's own figure (10.5), and the one line of 6.24.0 when today's run differs
        pl.documentVerdict = pl.document ? verdictOf({ a: pl.document.a, strategyId: pl.strategyId, ran: pl.document.ran, history: null }, pl) : null;
        pl.note = L && L.result && L.key === pl.runKey && L.result.stored && typeof L.result.stored.note === 'string' && L.result.stored.note ? L.result.stored.note : null;
        // the three levers tried on this plan (road-to-7.md step 7), in words — only for the run held for THIS plan's key
        pl.levers = leverViews(L && L.key === pl.runKey ? L.levers : null, { verdict: pl.verdict, documentVerdict: pl.documentVerdict, lockedOn: pl.lockedOn, workDraft: L ? L.workDraft : null });
        // Try a change (way-and-mix.md 4): the boxes as typed, the try held for THIS plan's key in words, the copy it was kept as
        const entry = plans.list.find((e) => e && e.plan && String(e.plan.id) === String(r.planId));
        pl.try = entry ? tryViews(entry.plan, typed, L && L.key === pl.runKey ? L.tried : null, L ? L.kept : null, { today, editable: pl.editable, saved: pl }) : null;
        // "Try the bad years" (7.9.0): the rows, the agreements and the keep agreement's state, read with the rows held in page
        // memory (state.stressPanel) for THIS plan as it is now — every row at the page's level, no run
        const Sp = state.stressPanel || null;
        try {
          const held = Sp && Sp.planId === String(r.planId) ? Sp.rows : null;
          const sv = entry && !entry.newer && !entry.failed ? stressPanelView(entry.plan, held, { level: state.ui && state.ui.level, today }) : null;
          const mine = sv && Sp && Sp.key === sv.key ? Sp : null;
          pl.stressPanel = sv ? { ...sv, planId: String(r.planId), run: { status: mine ? mine.status : 'idle', reason: mine ? mine.reason : null, done: mine ? mine.order.filter((id) => mine.rows[id]).length : 0, total: mine ? mine.order.length : 0 } } : null;
        } catch { pl.stressPanel = null; }
      }
    }
  }
  return { today, rows, page };
}

/**
 * @param {{ getState, dispatch, subscribe }} store
 * @param {object} o
 * @param {Window} o.win
 * @param {Storage|null} o.local      localStorage (activity, the free-time count)
 * @param {Storage|null} o.session    sessionStorage (the window's plans)
 * @param {() => Date} [o.now]
 * @param {object} [o.fb]             the Firebase functions (the tests hand in fakes); the real ones otherwise
 * @param {object} [o.client]         the worker client (effects/workerClient.js): the lock runs the plan's own test in it before its one write
 */
export function startPlanSource(store, { win, local = null, session = null, now = () => new Date(), fb = null, fbWrite = null, fbAccount = null, client = null }) {
  const F = fb || { initializeApp, initializeAuth, indexedDBLocalPersistence, browserLocalPersistence, browserSessionPersistence, onAuthStateChanged, signOut, getFirestore, collection, getDocs, isFirebaseConfigured, connectAuthEmulator, connectFirestoreEmulator, updateCurrentUser };
  const stops = [];
  let user = undefined;          // undefined: not known yet; null: nobody
  let stopped = false;
  const dispatch = (a) => { if (!stopped) store.dispatch(a); };

  dispatch({ type: A.SESSION_SET, session: { kind: 'checking', email: null } });

  /** The window's plans, when nobody is signed in (design question 5). */
  function readWindow() {
    const list = upgradedList(windowPlans(session), now());
    dispatch({ type: A.PLANS_SET, list, source: 'window', readAt: clock(now()), usedUp: isBlocked(readMinutes(local)) });
  }

  const persistence = () => [F.indexedDBLocalPersistence, F.browserLocalPersistence, F.browserSessionPersistence];
  let auth = null, db = null;
  if (!F.isFirebaseConfigured()) {
    user = null;
    dispatch({ type: A.SESSION_SET, session: { kind: 'nobody', email: null } });
    readWindow();
  } else {
    // The default app, as the classic planner's (src/firebase/config.js): the two pages share one stored sign-in (OLD_APP_NAME).
    const app = F.initializeApp(firebaseConfig);
    // Without the pop-up resolver: getAuth() would hand Firebase its browserPopupRedirectResolver, which on Safari, iPhone
    // and iPad loads Google's sign-in iframe (apis.google.com) as soon as the plans are read — a request to Google from a
    // visitor who never signs in (the night run of 1 Nov 2026: WebKit, C's answer page). The account effect hands the
    // resolver to signInWithPopup, the one place it is needed. The persistence list is getAuth()'s own, as the planner's
    // (config.js): IndexedDB first, then local storage, then session storage, so a sign-in stored by either page, before or
    // after 6.46.0, is found here — a list naming local storage alone signed everyone out once (3 Nov 2026).
    auth = F.initializeAuth(app, { persistence: [F.indexedDBLocalPersistence, F.browserLocalPersistence, F.browserSessionPersistence] });
    db = F.getFirestore(app);
    // The signed-in browser tests' build only (projectConfig.js EMULATOR_HOSTS): the local emulators of a demo- project,
    // connected before anything is read. Null in every other build, so the published bundle carries none of it.
    if (EMULATOR_HOSTS && F.connectAuthEmulator && F.connectFirestoreEmulator) {
      F.connectAuthEmulator(auth, EMULATOR_HOSTS.auth, { disableWarnings: true });
      F.connectFirestoreEmulator(db, EMULATOR_HOSTS.firestoreHost, EMULATOR_HOSTS.firestorePort);
    }
  }

  /**
   * A sign-in kept under this file's old app name (OLD_APP_NAME, before 7.1.0) is carried over to the default app once, so
   * nobody who signed in here is signed out by the change: the old app's user is copied (updateCurrentUser, which takes a
   * user of the same project) unless the default app has one already, and the old app's own copy is then signed out, which
   * only forgets it on this device. Anything that fails leaves the person to sign in again, as on a new device.
   */
  async function carryOldSignIn() {
    try {
      const oldAuth = F.initializeAuth(F.initializeApp(firebaseConfig, OLD_APP_NAME), { persistence: persistence() });
      if (EMULATOR_HOSTS && F.connectAuthEmulator) F.connectAuthEmulator(oldAuth, EMULATOR_HOSTS.auth, { disableWarnings: true });
      await Promise.all([auth.authStateReady(), oldAuth.authStateReady()]);
      if (!oldAuth.currentUser) return;
      if (!auth.currentUser) await F.updateCurrentUser(auth, oldAuth.currentUser);
      await F.signOut(oldAuth);
    } catch { /* signed in again by hand, as on a new device */ }
  }

  /** One read of the account's plans. Nothing is written back, whatever the upgrade says. */
  async function readAccount() {
    if (!user || !db) return;
    const uid = user.uid;
    try {
      const snap = await F.getDocs(F.collection(db, 'users', uid, 'scenarios'));
      const raws = [];
      snap.forEach((d) => { raws.push({ id: d.id, ...d.data() }); });
      if (stopped || !user || user.uid !== uid) return;
      dispatch({ type: A.PLANS_SET, list: upgradedList(raws, now()), source: 'account', readAt: clock(now()) });
    } catch {
      if (!stopped) dispatch({ type: A.PLANS_FAILED });
    }
  }

  function read() {
    if (user === undefined) return;
    if (user === null) readWindow();
    else if (user.emailVerified) readAccount();
  }

  async function signOutNow() {
    dispatch({ type: A.PLANS_CLEAR });
    try { if (auth) await F.signOut(auth); } catch { /* the session is gone from the page either way */ }
    if (!stopped && user) { user = null; dispatch({ type: A.SESSION_SET, session: { kind: 'nobody', email: null } }); readWindow(); }
  }

  // Who is signed in is listened for once any sign-in kept under the old name has been carried over (carryOldSignIn), so the
  // first word is the person's, never a "nobody" just before them.
  const listen = () => {
    if (stopped) return;
    const off = F.onAuthStateChanged(auth, (u) => {
      if (stopped) return;
      user = u || null;
      if (!u) {
        dispatch({ type: A.SESSION_SET, session: { kind: 'nobody', email: null } });
        readWindow();                                           // a signed-in person becoming nobody is a sign-out: the plans left already
      } else if (!u.emailVerified) {
        dispatch({ type: A.SESSION_SET, session: { kind: 'unverified', email: u.email || null } });
      } else {
        dispatch({ type: A.SESSION_SET, session: { kind: 'in', email: u.email || null } });
        readAccount();
      }
    });
    stops.push(() => { try { off(); } catch { /* already gone */ } });
  };
  if (auth) {
    if (F.updateCurrentUser && typeof auth.authStateReady === 'function') carryOldSignIn().then(listen, listen);
    else listen();
  }

  // The reading for the screen: after every change of the plans, the address, the date or the plan draft (never of the view itself).
  let lastRead = null;
  const refresh = (state) => {
    const key = state.plans && state.plans.status === 'read' ? [state.plans.list, state.route, state.env.today, state.draft && state.draft.plan, state.lasts && state.lasts.result, state.lasts && state.lasts.levers, state.lasts && state.lasts.workDraft, state.ways, state.mix, state.lasts && state.lasts.tried, state.lasts && state.lasts.kept, state.household, state.move, state.keepTest, state.stressPanel, state.ui.notNow, state.ui.level] : null;
    if (!key) { lastRead = null; return; }
    if (lastRead && key.every((v, i) => v === lastRead[i])) return;
    lastRead = key;
    let view = null;
    try { view = viewFor(state); } catch { view = { today: state.env.today, rows: [], page: null }; }
    if (view) dispatch({ type: A.PLANS_VIEW, view });
  };
  refresh(store.getState());

  // Editing (editing-in-v7.md 1): the one write file, with this file's handle, user and a fresh read before an account write.
  const handles = () => ({ auth, db, user: user || null, reread: () => (user && db ? readAccount() : Promise.resolve()) });
  stops.push(startPlanWrite(store, { win, session, local, now, fb: fbWrite, client, handles }));
  // The account page and What's new (road-to-7.md step 11): the account effect, with the same handles.
  stops.push(startAccount(store, { win, local, session, now, fb: fbAccount, handles }));

  // "Read again" / "Try again" (plans/reading), "Sign out" (session/out) — and the hand-over offer (road-to-7.md step 11) on
  // every way the session becomes 'in' while this page is open: the listener's sign-in, or "I've confirmed" after a sign-up
  // (account.js sets the session itself). Never on the page's first known session; the example plan never counts.
  let sessionKind = store.getState().session.kind;
  stops.push(store.subscribe((state, action) => {
    if (action.type === A.SESSION_SET) {
      const was = sessionKind;
      sessionKind = state.session.kind;
      if (sessionKind === 'in' && (was === 'nobody' || was === 'unverified')) {
        const own = guestOwnPlans(windowPlans(session));
        if (own.length) dispatch({ type: A.GUEST_OFFER, count: own.length });
      }
    }
    if (action.type === A.PLANS_READING) read();
    if (action.type === A.SESSION_OUT && state.session.signingOut) signOutNow();
    refresh(state);
  }));

  // Coming back (bfcache or the tab shown again): read again; leaving: the plans leave the page's memory (3.8, 4.3).
  const onHide = () => dispatch({ type: A.PLANS_CLEAR });
  const onShow = (e) => { if (e && e.persisted) { if (user !== undefined) dispatch({ type: A.SESSION_SET, session: user ? { kind: user.emailVerified ? 'in' : 'unverified', email: user.email || null } : { kind: 'nobody', email: null } }); read(); } };
  const onVisible = () => { if (win.document && win.document.visibilityState === 'visible' && store.getState().plans === null) read(); };
  win.addEventListener('pagehide', onHide);
  win.addEventListener('pageshow', onShow);
  if (win.document) win.document.addEventListener('visibilitychange', onVisible);
  stops.push(() => { win.removeEventListener('pagehide', onHide); win.removeEventListener('pageshow', onShow); if (win.document) win.document.removeEventListener('visibilitychange', onVisible); });

  // The idle sign-out: an hour with no activity in any window (the planner's rule, shared through local storage).
  const timer = win.setInterval(() => {
    if (!user || !local) return;
    const last = lastActivity(local);
    if (last && now().getTime() - last > IDLE_MS) signOutNow();
  }, IDLE_CHECK_MS);
  stops.push(() => win.clearInterval(timer));

  return () => { stopped = true; stops.splice(0).forEach((fn) => fn()); };
}
