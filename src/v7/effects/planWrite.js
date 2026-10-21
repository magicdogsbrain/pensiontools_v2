/**
 * The plan write — the ONLY file in V7 that writes a plan (research/v7/editing-in-v7.md 1). Started by effects/planSource.js
 * on the plan pages only, with that file's Firestore handle and signed-in user (no second Firebase app), a way to read
 * the account's plans again just before a write, and the worker client (for the lock).
 *
 * What it does, on `plan/save` (ui.saving.kind 'save') and `plan/undo` (kind 'undo'):
 *   - finds the plan in page memory (state.plans); not there: nothing is written ('notHere');
 *   - nobody signed in and the plans are not this window's: nothing is written ('nobody'); this window's plans with the
 *     free time used up (pt_guest_minutes, read as planSource reads it): nothing is written ('usedUp');
 *   - signed in: the account's plans are read again first (one getDocs, planSource's own), so a plan locked from another
 *     device since this page opened is seen as locked;
 *   - the lock guard (services/LockedPlanGuard.js) runs on the plan as read: a locked plan is refused whatever the screen did;
 *   - the pure writer of the step the page is on (answers/plan/about.js aboutPatch; answers/plan/income.js incomePatch for
 *     "Money that comes in anyway", editing-in-v7.md 7; spend.js spendPatch; pots.js potsPatch for "Your pots and tax", 9;
 *     lasts.js lastsPatch for the cut and reserve dials of "Does it last?", 10 — the run itself writes nothing)
 *     turns the draft into the dotted field paths that change; every
 *     path must be one the steps declare (answers/plan/schema.js ALL_WRITES) or the write is refused outright;
 *   - the write is ONE updateDoc of those paths plus the planner's stamp (lastModified, as FirestoreService.saveScenario
 *     stamps every save) — or, for this window's plans, the same patch folded onto the one plan in pt_guest_scenarios and
 *     the list written back, every other plan byte-identical;
 *   - then plan/saved (the Undo toast, with the values to put back), the plans read again, and the toast closed after a while.
 * Undo is the same write with the previous values, the plan's last-changed stamp among them (so the plan is byte-identical
 * afterwards); a key the plan did not have goes back as null on an account (updateDoc cannot delete without deleteField,
 * which is not an allowed name) and is deleted in the window's text.
 *
 * "Lock the plan" (research/v7/road-to-7.md step 6), the same one write, three more kinds:
 *   - `plan/lock` (kind 'lock'): the plan's own test runs in the worker first (client.document: lastsRun.js runForDocument,
 *     the run the planner's own document is built from), then answers/plan/lock.js lockPatch — the Decision tool seeded from
 *     the Stress settings, the lock's flags, the plan of record, the plan document and the journey, the planner's
 *     commitPlanLock field for field — goes as ONE write to an unlocked plan, past the guard like every write; then the page
 *     moves to "Your plan as locked" with the Undo toast. Undo of a lock, within the toast's time, is the exact reverse: it
 *     is the one write the guard is not asked about, and only when the stored plan is locked by this page at that very
 *     moment (lock.js isLockReversal); after the toast, unlocking is the way back.
 *   - `plan/unlock` (kind 'unlock'): lock.js unlockPatch, the planner's unlockPlan field for field (the archives, the flag,
 *     the unlock's date and count, the defaults an unlock gives), ONE write to a locked plan: the guard allows it because
 *     it IS an unlock (LockedPlanGuard.isUnlock) and carries nothing else.
 *   - `plan/newVersion` (kind 'document'): the run again, then lock.js documentPatch (the current document archived, a new
 *     one written), ONE write to a locked plan: the guard allows it because the document is not a setting.
 *   Without a worker (client.document rejects with NO_WORKER) the lock and the new version are refused ('noWorker'): the
 *   document is never built from a lesser run.
 *
 * The names imported from the Firebase package are `doc` and `updateDoc` and nothing else; the boundary test
 * (tests/v7/boundaries.test.js) fails on any other, anywhere V7 can reach.
 *
 *   GUEST_PLANS_KEY     'pt_guest_scenarios' (the one V7 file that may write it)
 *   TOAST_MS            how long the Undo toast stays
 *   startPlanWrite(store, { win, session, local, now, fb, client, handles }) → stop()
 */
import { doc, updateDoc } from 'firebase/firestore/lite';
import { A } from '../state/actions.js';
import { parse, href } from '../router/routes.js';
import { aboutPatch, applyPatch } from '../../answers/plan/about.js';
import { incomePatch } from '../../answers/plan/income.js';
import { spendPatch } from '../../answers/plan/spend.js';
import { potsPatch } from '../../answers/plan/pots.js';
import { lastsPatch } from '../../answers/plan/lasts.js';
import { lockPatch, unlockPatch, documentPatch, isLockReversal, shapeRefsOf } from '../../answers/plan/lock.js';
import { ALL_WRITES } from '../../answers/plan/schema.js';
import { isLockedSettings, lockedPlanWriteRefusal } from '../../services/LockedPlanGuard.js';
import { getDefaultStressSettings } from '../../storage/stressDefaults.js';
import { readMinutes, isBlocked } from '../../services/GuestMeter.js';
import { NO_WORKER } from './workerClient.js';

export const GUEST_PLANS_KEY = 'pt_guest_scenarios';
export const TOAST_MS = 15000;
const ALLOWED = new Set(ALL_WRITES);

/** The patch checked against the declared paths: anything else is a fault in the code, never sent. */
function declaredOnly(data) {
  for (const k of Object.keys(data)) if (!ALLOWED.has(k)) throw new Error('planWrite: "' + k + '" is not a declared field path');
  return data;
}

/**
 * @param {{ getState, dispatch, subscribe }} store
 * @param {object} o
 * @param {Window|null} [o.win]        for the toast's timer only
 * @param {Storage|null} [o.session]   sessionStorage (this window's plans)
 * @param {Storage|null} [o.local]     localStorage (the free-time count)
 * @param {() => Date} [o.now]
 * @param {{ doc, updateDoc }|null} [o.fb]   the two Firebase functions (the tests hand in fakes); the real ones otherwise
 * @param {{ document }|null} [o.client]     the worker client: the lock's and the new version's run (none: 'noWorker')
 * @param {() => { db, user, reread }} o.handles   planSource's Firestore handle, signed-in user and "read the account again"
 */
export function startPlanWrite(store, { win = null, session = null, local = null, now = () => new Date(), fb = null, client = null, handles }) {
  const F = fb || { doc, updateDoc };
  let stopped = false;
  let busy = false;
  let timer = null;
  const dispatch = (a) => { if (!stopped) store.dispatch(a); };
  const fail = (planId, problem) => dispatch({ type: A.PLAN_SAVE_FAILED, planId, problem });
  const later = (fn) => { if (!win || typeof win.setTimeout !== 'function') return; if (timer) win.clearTimeout(timer); timer = win.setTimeout(() => { timer = null; fn(); }, TOAST_MS); };

  /** Where the plan is, and whether a write may go there at all. */
  function placeOf(state, planId) {
    const plans = state.plans;
    const entry = plans && Array.isArray(plans.list) ? plans.list.find((e) => e && e.plan && String(e.plan.id) === String(planId)) : null;
    if (!entry) return { problem: 'notHere' };
    if (entry.newer || entry.failed) return { problem: 'readonly' };
    const h = handles() || {};
    if (state.session.kind === 'in' && h.user && h.db && plans.source === 'account') return { kind: 'account', entry, db: h.db, uid: h.user.uid, reread: h.reread };
    if (state.session.kind === 'nobody' && plans.source === 'window') {
      if (isBlocked(readMinutes(local))) return { problem: 'usedUp' };
      return { kind: 'window', entry };
    }
    return { problem: 'nobody' };
  }

  /** The lock guard on the plan as read (6.20.2's rules, the plan as stored): what a write may still change on a locked plan. */
  function lockedRefusal(plan, data) {
    return !!lockedPlanWriteRefusal(plan, data, getDefaultStressSettings());
  }

  /** ONE write: an account's plan by its field paths, or this window's plan folded and the list written back. */
  async function write(place, planId, data) {
    if (place.kind === 'account') {
      await F.updateDoc(F.doc(place.db, 'users', place.uid, 'scenarios', String(planId)), data);
      return true;
    }
    let text = null;
    try { text = session ? session.getItem(GUEST_PLANS_KEY) : null; } catch { return false; }
    let list = null;
    try { list = JSON.parse(text); } catch { list = null; }
    if (!Array.isArray(list)) return false;
    const i = list.findIndex((p) => p && String(p.id) === String(planId));
    if (i < 0) return false;
    list[i] = applyPatch(list[i], data);
    const next = JSON.stringify(list);
    try { session.setItem(GUEST_PLANS_KEY, next); return session.getItem(GUEST_PLANS_KEY) === next; } catch { return false; }
  }

  /** Which editing step the page is on when Save is pressed (editing-in-v7.md 7): its pure writer and its reading. */
  function stepOf(state) {
    const r = state.route;
    const step = r && r.screen === 'plan' && (r.step === 'income' || r.step === 'spend' || r.step === 'pots' || r.step === 'lasts') ? r.step : 'about';
    return { step, patchOf: step === 'income' ? incomePatch : step === 'spend' ? spendPatch : step === 'pots' ? potsPatch : step === 'lasts' ? lastsPatch : aboutPatch };
  }

  /** The plan as read, after the fresh read of the account: { place, plan, state } or null after a failure already told. */
  async function placed(planId) {
    let state = store.getState();
    let place = placeOf(state, planId);
    if (place.problem) { fail(planId, place.problem); return null; }
    if (place.kind === 'account') {
      // the plans as stored, read just before the write: the guard then sees a lock made elsewhere since this page opened
      try { await place.reread(); } catch { /* the read failed: the copy in memory is the best there is */ }
      if (stopped) return null;
      state = store.getState();
      place = placeOf(state, planId);
      if (place.problem) { fail(planId, place.problem); return null; }
    }
    return { place, plan: place.entry.plan, state };
  }

  /** The one write, then the toast and the read again; false when it failed (already told). */
  async function send(place, planId, data) {
    let written = false;
    try { written = await write(place, planId, data); } catch { written = false; }
    if (stopped) return false;
    if (!written) { fail(planId, place.kind === 'window' ? 'storage' : 'failed'); return false; }
    return true;
  }

  async function save(planId) {
    const got = await placed(planId);
    if (!got) return;
    const { place, plan, state } = got;
    const { step, patchOf } = stepOf(state);
    const pd = state.draft.plan && state.draft.plan.id === String(planId) ? state.draft.plan : null;
    const typed = pd ? pd.values : {};
    if (isLockedSettings(plan.decisionTool && plan.decisionTool.settings)) { fail(planId, 'locked'); return; }
    const p = patchOf(plan, typed, { today: state.env.today });
    if (!p.ok) { fail(planId, p.errors.plan === 'locked' ? 'locked' : 'problems'); return; }
    const about = state.plans.view && state.plans.view.page && state.plans.view.page[step] && state.plans.view.page.forId === String(planId) ? state.plans.view.page[step] : null;
    const line = about && about.savedLine ? about.savedLine : null;
    if (!Object.keys(p.patch).length) { dispatch({ type: A.PLAN_SAVED, planId, previous: {}, line }); later(() => dispatch({ type: A.PLAN_TOAST_CLOSE })); return; }
    const data = declaredOnly({ ...p.patch, lastModified: now().toISOString() });
    if (lockedRefusal(plan, data)) { fail(planId, 'locked'); return; }
    if (!(await send(place, planId, data))) return;
    // Undo puts the plan back as it was, its last-changed stamp included (editing-in-v7.md 3): byte-identical afterwards
    dispatch({ type: A.PLAN_SAVED, planId, previous: { ...p.previous, lastModified: plan.lastModified }, line });
    dispatch({ type: A.PLANS_READING });
    later(() => dispatch({ type: A.PLAN_TOAST_CLOSE }));
  }

  /** The run a plan document is built from, in the worker (lastsRun.js runForDocument); null after a failure already told. */
  async function runFor(planId, plan, state) {
    if (!client || typeof client.document !== 'function') { fail(planId, 'noWorker'); return null; }
    const essentials = shapeRefsOf(plan, state.plans.list).essentials;
    try {
      const run = await client.document(plan, { today: state.env.today, essentials });
      if (stopped) return null;
      if (!run || typeof run !== 'object') { fail(planId, 'noRun'); return null; }
      return run;
    } catch (e) {
      if (!stopped) fail(planId, e && e.code === NO_WORKER ? 'noWorker' : 'failed');
      return null;
    }
  }

  /** The lock (the header): the run, the one write, then "Your plan as locked" with the Undo toast. */
  async function lock(planId) {
    const got = await placed(planId);
    if (!got) return;
    const { place, plan, state } = got;
    if (isLockedSettings(plan.decisionTool && plan.decisionTool.settings)) { fail(planId, 'locked'); return; }
    const run = await runFor(planId, plan, state);
    if (!run) return;
    const at = now();
    const p = lockPatch(plan, { now: at, run, entries: state.plans.list });
    if (!p.ok) { fail(planId, p.errors.plan || 'failed'); return; }
    const data = declaredOnly({ ...p.patch, lastModified: at.toISOString() });
    if (lockedRefusal(plan, data)) { fail(planId, 'locked'); return; }
    if (!(await send(place, planId, data))) return;
    dispatch({ type: A.PLAN_SAVED, planId, previous: { ...p.previous, lastModified: plan.lastModified }, line: p.line, op: 'lock', lockedAt: p.lockedAt });
    dispatch({ type: A.PLANS_READING });
    // the page goes to "Your plan as locked"; the toast stays (it belongs to the same plan)
    dispatch({ type: A.ROUTE_SET, route: parse(href.plan(String(planId), 'plan')) });
    later(() => dispatch({ type: A.PLAN_TOAST_CLOSE }));
  }

  /** The unlock (the header): one write to a locked plan, the guard's own allowance for an unlock. */
  async function unlock(planId) {
    const got = await placed(planId);
    if (!got) return;
    const { place, plan } = got;
    const at = now();
    const p = unlockPatch(plan, { now: at });
    if (!p.ok) { fail(planId, p.errors.plan || 'failed'); return; }
    const data = declaredOnly({ ...p.patch, lastModified: at.toISOString() });
    if (lockedRefusal(plan, data)) { fail(planId, 'locked'); return; }
    if (!(await send(place, planId, data))) return;
    dispatch({ type: A.PLAN_SAVED, planId, previous: { ...p.previous, lastModified: plan.lastModified }, line: p.line, op: 'unlock' });
    dispatch({ type: A.PLANS_READING });
    later(() => dispatch({ type: A.PLAN_TOAST_CLOSE }));
  }

  /** A new version of the document (the header): the run, then one write to a locked plan (the document is not a setting). */
  async function newVersion(planId) {
    const got = await placed(planId);
    if (!got) return;
    const { place, plan, state } = got;
    if (!isLockedSettings(plan.decisionTool && plan.decisionTool.settings)) { fail(planId, 'notLocked'); return; }
    const run = await runFor(planId, plan, state);
    if (!run) return;
    const at = now();
    const p = documentPatch(plan, { now: at, run, entries: state.plans.list });
    if (!p.ok) { fail(planId, p.errors.plan || 'failed'); return; }
    const data = declaredOnly({ ...p.patch, lastModified: at.toISOString() });
    if (lockedRefusal(plan, data)) { fail(planId, 'locked'); return; }
    if (!(await send(place, planId, data))) return;
    dispatch({ type: A.PLAN_SAVED, planId, previous: { ...p.previous, lastModified: plan.lastModified }, line: p.line, op: 'document' });
    dispatch({ type: A.PLANS_READING });
    later(() => dispatch({ type: A.PLAN_TOAST_CLOSE }));
  }

  async function undo(planId, previous, op = null, lockedAt = null) {
    const state = store.getState();
    const place = placeOf(state, planId);
    if (place.problem) { fail(planId, place.problem); return; }
    const plan = place.entry.plan;
    // the previous values back: a key the plan did not have goes back as null on an account, and is deleted in the window's text
    const back = {};
    for (const [k, v] of Object.entries(previous || {})) back[k] = v === undefined && place.kind === 'account' ? null : v;
    if (!('lastModified' in back) || back.lastModified == null) back.lastModified = now().toISOString();
    const data = declaredOnly(back);
    const asSent = Object.fromEntries(Object.entries(data).map(([k, v]) => [k, v === undefined ? null : v]));
    if (op === 'lock') {
      // the exact reverse of a lock this page made, within the toast's time (lock.js isLockReversal): never anything else
      if (!isLockReversal(plan, asSent, lockedAt)) { fail(planId, 'locked'); return; }
    } else if (op === 'unlock' || op === 'document') {
      // the reverse of an unlock goes to an unlocked plan; of a new version, to a locked plan whose settings it leaves alone
      if (lockedRefusal(plan, asSent)) { fail(planId, 'locked'); return; }
    } else {
      // an editing step's undo: a locked plan is refused outright, as its save is
      if (isLockedSettings(plan.decisionTool && plan.decisionTool.settings) || lockedRefusal(plan, asSent)) { fail(planId, 'locked'); return; }
    }
    if (!(await send(place, planId, data))) return;
    dispatch({ type: A.PLAN_UNDO_DONE, planId });
    dispatch({ type: A.PLANS_READING });
    later(() => dispatch({ type: A.PLAN_TOAST_CLOSE }));
  }

  const off = store.subscribe((state, action) => {
    if (busy) return;
    const s = state.ui.saving;
    if (!s) return;
    const run = (fn) => { busy = true; fn().catch(() => fail(s.planId, 'failed')).finally(() => { busy = false; }); };
    if (action.type === A.PLAN_SAVE && s.kind === 'save') run(() => save(s.planId));
    else if (action.type === A.PLAN_UNDO && s.kind === 'undo') run(() => undo(s.planId, s.previous, s.op || null, s.lockedAt || null));
    else if (action.type === A.PLAN_LOCK && s.kind === 'lock') run(() => lock(s.planId));
    else if (action.type === A.PLAN_UNLOCK && s.kind === 'unlock') run(() => unlock(s.planId));
    else if (action.type === A.PLAN_DOCUMENT && s.kind === 'document') run(() => newVersion(s.planId));
  });
  return () => { stopped = true; off(); if (timer && win) win.clearTimeout(timer); };
}
