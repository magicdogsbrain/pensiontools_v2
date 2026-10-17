/**
 * The plan write — the ONLY file in V7 that writes a plan (research/v7/editing-in-v7.md 1). Started by effects/planSource.js
 * on the plan pages only, with that file's Firestore handle and signed-in user (no second Firebase app), and a way to read
 * the account's plans again just before a write.
 *
 * What it does, on `plan/save` (ui.saving.kind 'save') and `plan/undo` (kind 'undo'):
 *   - finds the plan in page memory (state.plans); not there: nothing is written ('notHere');
 *   - nobody signed in and the plans are not this window's: nothing is written ('nobody'); this window's plans with the
 *     free time used up (pt_guest_minutes, read as planSource reads it): nothing is written ('usedUp');
 *   - signed in: the account's plans are read again first (one getDocs, planSource's own), so a plan locked from another
 *     device since this page opened is seen as locked;
 *   - the lock guard (services/LockedPlanGuard.js) runs on the plan as read: a locked plan is refused whatever the screen did;
 *   - the pure writer of the step the page is on (answers/plan/about.js aboutPatch; answers/plan/income.js incomePatch for
 *     "Money that comes in anyway", editing-in-v7.md 7; spend.js spendPatch; pots.js potsPatch for "Your pots and tax", 9)
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
 * The names imported from the Firebase package are `doc` and `updateDoc` and nothing else; the boundary test
 * (tests/v7/boundaries.test.js) fails on any other, anywhere V7 can reach.
 *
 *   GUEST_PLANS_KEY     'pt_guest_scenarios' (the one V7 file that may write it)
 *   TOAST_MS            how long the Undo toast stays
 *   startPlanWrite(store, { win, session, local, now, fb, handles }) → stop()
 */
import { doc, updateDoc } from 'firebase/firestore/lite';
import { A } from '../state/actions.js';
import { aboutPatch, applyPatch } from '../../answers/plan/about.js';
import { incomePatch } from '../../answers/plan/income.js';
import { spendPatch } from '../../answers/plan/spend.js';
import { potsPatch } from '../../answers/plan/pots.js';
import { ALL_WRITES } from '../../answers/plan/schema.js';
import { isLockedSettings, lockedPlanWriteRefusal } from '../../services/LockedPlanGuard.js';
import { getDefaultStressSettings } from '../../storage/stressDefaults.js';
import { readMinutes, isBlocked } from '../../services/GuestMeter.js';

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
 * @param {() => { db, user, reread }} o.handles   planSource's Firestore handle, signed-in user and "read the account again"
 */
export function startPlanWrite(store, { win = null, session = null, local = null, now = () => new Date(), fb = null, handles }) {
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

  /** The lock, on the plan as read (6.20.2's rules): refused before anything is sent. */
  function lockedRefusal(plan, data) {
    if (isLockedSettings(plan && plan.decisionTool && plan.decisionTool.settings)) return true;
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
    const step = r && r.screen === 'plan' && (r.step === 'income' || r.step === 'spend' || r.step === 'pots') ? r.step : 'about';
    return { step, patchOf: step === 'income' ? incomePatch : step === 'spend' ? spendPatch : step === 'pots' ? potsPatch : aboutPatch };
  }

  async function save(planId) {
    let state = store.getState();
    const { step, patchOf } = stepOf(state);
    let place = placeOf(state, planId);
    if (place.problem) { fail(planId, place.problem); return; }
    if (place.kind === 'account') {
      // the plans as stored, read just before the write: the guard then sees a lock made elsewhere since this page opened
      try { await place.reread(); } catch { /* the read failed: the copy in memory is the best there is */ }
      if (stopped) return;
      state = store.getState();
      place = placeOf(state, planId);
      if (place.problem) { fail(planId, place.problem); return; }
    }
    const plan = place.entry.plan;
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
    let written = false;
    try { written = await write(place, planId, data); } catch { written = false; }
    if (stopped) return;
    if (!written) { fail(planId, place.kind === 'window' ? 'storage' : 'failed'); return; }
    // Undo puts the plan back as it was, its last-changed stamp included (editing-in-v7.md 3): byte-identical afterwards
    dispatch({ type: A.PLAN_SAVED, planId, previous: { ...p.previous, lastModified: plan.lastModified }, line });
    dispatch({ type: A.PLANS_READING });
    later(() => dispatch({ type: A.PLAN_TOAST_CLOSE }));
  }

  async function undo(planId, previous) {
    const state = store.getState();
    const place = placeOf(state, planId);
    if (place.problem) { fail(planId, place.problem); return; }
    const plan = place.entry.plan;
    // the previous values back: a key the plan did not have goes back as null on an account, and is deleted in the window's text
    const back = {};
    for (const [k, v] of Object.entries(previous || {})) back[k] = v === undefined && place.kind === 'account' ? null : v;
    if (!('lastModified' in back) || back.lastModified == null) back.lastModified = now().toISOString();
    const data = declaredOnly(back);
    if (lockedRefusal(plan, Object.fromEntries(Object.entries(data).map(([k, v]) => [k, v === undefined ? null : v])))) { fail(planId, 'locked'); return; }
    let written = false;
    try { written = await write(place, planId, data); } catch { written = false; }
    if (stopped) return;
    if (!written) { fail(planId, place.kind === 'window' ? 'storage' : 'failed'); return; }
    dispatch({ type: A.PLAN_UNDO_DONE, planId });
    dispatch({ type: A.PLANS_READING });
    later(() => dispatch({ type: A.PLAN_TOAST_CLOSE }));
  }

  const off = store.subscribe((state, action) => {
    if (busy) return;
    const s = state.ui.saving;
    if (!s) return;
    if (action.type === A.PLAN_SAVE && s.kind === 'save') { busy = true; save(s.planId).catch(() => fail(s.planId, 'failed')).finally(() => { busy = false; }); }
    else if (action.type === A.PLAN_UNDO && s.kind === 'undo') { busy = true; undo(s.planId, s.previous).catch(() => fail(s.planId, 'failed')).finally(() => { busy = false; }); }
  });
  return () => { stopped = true; off(); if (timer && win) win.clearTimeout(timer); };
}
