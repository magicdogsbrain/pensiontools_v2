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
 *     lasts.js lastsPatch for the cut and reserve dials of "Does it last?", 10 — the run itself writes nothing; on a LOCKED
 *     plan's "About you and when", about.js stopAskPatch: the answer to "When did you stop work?" alone, 6.53.0)
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
 *   - `plan/moveStart` (kind 'moveStart', 6.55.0): "Move the plan's start" on a locked plan's "About you and when" — the
 *     run of the plan as moved (answers/plan/moveStart.js movedPlanOf), then movePatch, the planner's moveLockedPlanStart
 *     field for field, ONE write to a locked plan: the guard allows it because it is exactly that move (its `reAnchor`
 *     allowance). The plan stays locked. No Undo, as in the planner.
 *   Without a worker (client.document rejects with NO_WORKER) the lock, the new version and the move are refused
 *   ('noWorker'): the document is never built from a lesser run.
 *
 * "Use this way of drawing" (research/v7/way-and-mix.md 2.4), the same one write, one more kind:
 *   - `plan/useWay` (kind 'way'): answers/plan/way.js wayPatch — the planner's strategy switch field for field
 *     (services/PlanCommit.js switchPatch: the stash, the restore, the dials typed on the card, the pots a restored funds
 *     list gives, the cut dials, and the root strategy block) — goes as ONE write to an unlocked plan, past the guard like
 *     every write (a locked plan is refused before anything is sent, whatever the screen drew); then plan/saved with op
 *     'way' (the Undo toast; the reducer clears "Does it last?"'s result, which was the old way's) and the plans read again.
 *     Undo is an editing step's undo: the previous values back, byte-identical; a locked plan refused.
 *
 * "Your household" (research/v7/road-to-7.md step 9), the same one write, four more kinds and the step's own save:
 *   - `plan/linkPartner` (kind 'link'): answers/plan/household.js linkPatch — the partner link as the planner's
 *     setHouseholdPartnerId writes it, on this plan only (null unlinks); past the guard (the link is outside the lock, as the
 *     planner's own rule has it: LockedPlanGuard.js); then plan/saved with op 'link' and Undo.
 *   - `plan/useSplit` (kind 'split'): household.js splitPatches — on two unlocked plans, ONE write per plan of exactly the
 *     five keys the split's income shape changes (HouseholdSplitApply.settingsWithSchedule), each past the guard, the
 *     partner's previous values riding on the toast (`others`) so Undo puts both back; when either plan is locked, a copy
 *     of each with those settings through the ONE create (`add`), the copies linked to each other, never locked — the
 *     planner's rule: a locked plan is never changed (applySplit's copies).
 *   - `plan/keepAsIs` (kind 'dismiss'): household.js dismissPatch — "Keep things as they are" / "Show it again", on this plan.
 *   - `plan/shareBudget` (kind 'budgetShare'): household.js shareBudgetPatches — "Share this plan's budget" / "Keep a separate
 *     budget": the write on the PARTNER's plan, as ScenarioRepository.shareBudgetWith / stopSharingBudget write it.
 *   - `plan/save` on the household step: household.js whoPaysPatches — the budget's who-pays, written where the lines live
 *     (this plan, or the household's plan when the budget is shared), as the planner's Budget page saves it.
 *
 * "What you hold" and "Moving to your plan's mix" (research/v7/holdings-and-move.md §2.2, §3.8; road-to-7.md step 10), the
 * same one write, two more kinds — the two writes the planner's guard leaves open on a LOCKED plan (what is true today, not the plan):
 *   - `plan/hold` (kind 'hold'): answers/plan/hold.js holdPatch — ONE change of the record (a line added, edited or removed, a
 *     paste merged: HoldingsRecord.holdingsWith / HoldingsPaste.applyPaste, the planner's own handlers lifted) written as the
 *     whole `holdings` field, past the guard; Undo puts the previous record back whole.
 *   - `plan/tick` (kind 'tick'): answers/plan/move.js tickPatch — one tick-off (TransitionPlanner.tickMove / untickMove) written
 *     as the whole `transition` object (never deleteField), past the guard; Undo the same.
 *   - `plan/amend` (kind 'amend', 7.7.0): answers/plan/keepTest.js amendPatch / withdrawPatch — "I accept this risk" (the re-test
 *     of what is kept, held in page memory for this plan as it is now) or "Withdraw this", written as the whole `planAmendments`
 *     list, past the guard (outside the settings; refused on a closed plan); Undo puts the previous list back whole.
 *     7.9.0: with a kind ('stress' | 'confidence') and a row, "I accept this risk" on a row of "Try the bad years"
 *     (answers/plan/stressPanel.js stressAmendPatch / stressWithdrawPatch: the row's result held in page memory for this plan as
 *     it is now, on any plan, locked or not), the same one write of the whole list.
 *
 * "Move to a new plan" (6.56.0, research/plan-start.md §2 I; services/PlanClose.js), on a plan someone has lived on: kind 'close'.
 *   - the new plan first, through the ONE create (addDoc; or appended to this window's plans): the old plan's figures with its
 *     year 0 at the change-over month's tax year, its pots what is held today (or the figures given), never locked;
 *   - then ONE write to the old plan: `closedAt` and `nextPlanId` (and the lock's flags on a plan that was not locked), past
 *     the guard — which lets exactly these through, once (PlanClosed.closureRefusal); the guard is asked before the create, so
 *     a plan the guard would refuse makes no new plan;
 *   - then, when the person said so, ONE write to the partner's plan: its link (and the budget it reads) to the new plan;
 *   - then, when the closed plan was the main plan, the new plan made the main one (makeMain's writes: the planner's close
 *     opens the new plan, which makes it so).
 *   No Undo: the planner's own menu deletes a plan, and a closed plan stays closed.
 *   "I'm going back to work" (research/plan-start.md §2 J) is the same kind with `reason: 'working'`: the same close and the
 *   same writes, the new plan a saving plan stopping again at the month or age the box was given (PlanClose.workingStopOf,
 *   checked here against the plan before anything is made), and the close's own lock words.
 * "Check in" (research/saving-enough-and-check-in.md 5; release step R3), the same one write, three more kinds — all outside
 * the settings the lock holds, so a locked saver checks in too and the plan stays locked:
 *   - `plan/checkIn` (kind 'checkIn'): refused on a plan that is not still saving (LifeStage.checkInAllowed); the boxes
 *     checked (answers/plan/checkIn.js checkInDraft); question B run in the worker on the plan's figures with the check-in's
 *     own (client.checkIn: B's answer at 1,000 futures, seed 0 — the check-in's verdict is that one test); then checkInPatch
 *     — the check-ins, this month's pot record, how often, and an unlocked plan's first path — as ONE write, past the guard
 *     AND held to the check-in's own keys (LockedPlanGuard.checkInWriteRefusal: three on a locked plan). Without a worker
 *     nothing is written ('noWorker'): a check-in's verdict is never a lesser run. Then checkin/shown (the answer, for the
 *     result drawn under it) and plan/saved with op 'checkIn' and Undo.
 *   - `plan/useCheckIn` (kind 'useCheckIn'): "Use these in my plan" (5.6) — What you pay in's settings from the last
 *     check-in (useInPlanPatch), ONE write as the step's own Save, op 'saving'.
 *   - `plan/restartPath` (kind 'restartPath'): "Start the path again from today" on an unlocked plan (restartPathPatch) —
 *     the path and the paths it replaced, ONE write, op 'checkIn'.
 *
 * Month by month (research/v7/months-in-v7.md §3, 7.2.0), the same one write, two more kinds — records and tax years, outside the
 * settings the lock holds, so a locked plan takes its months and its settings stay as they are:
 *   - `plan/monthRecord` (kind 'month'): answers/plan/month.js monthRecordPatch — this month and the months filled in before
 *     it, worked out in order by the classic engine, and the tax years with the ISA used worked out again (and, with the
 *     arrival check outside the plan's margin, the journey) — ONE write past the guard AND held to Month by month's own keys
 *     (LockedPlanGuard.monthWriteRefusal). Refused on a plan not locked ('notLocked': the lock is its own step). Then
 *     plan/saved with op 'month' and Undo (the records and tax years as they were).
 *   - `plan/taxYear` (kind 'taxYear'): month.js taxYearPatch — the year's set-up as the classic set-up stores it, ONE write of
 *     the tax years, the same checks; op 'taxYear' and Undo.
 *
 * "Keep this as a plan" (research/v7/road-to-7.md step 7; save-as-plan.md Contract C.3 for the shape): the preview makes
 * the plan itself, here, on `keep/save` (state.keep[q].saving) — the hand-over of a seed to the planner is retired:
 *   - the seed is built from the answer on screen (answers/keep/planSeed.js buildPlanSeed), the plan documents from it
 *     exactly as the planner makes them (answers/keep/planCreate.js plansFromSeed → services/PlanFromSeed.js seedToScenario,
 *     the lifted mapping), each brought up to date by today's own upgrade and checked (planProblems: nothing Firestore
 *     refuses; never locked) before anything is written;
 *   - signed in (email confirmed), the plans read: the account's plans are read again first (the names, and whether this
 *     is the first plan); then ONE addDoc per plan on users/{uid}/scenarios — the partner's plan first for a couple, then
 *     yours with the link to it (household.partnerScenarioId). If yours cannot be made the partner's plan stays: V7
 *     never deletes ('partial' says so). `isActive` is true only for the first plan in the account; no other plan's
 *     flag is ever touched. Not confirmed: 'unverified'. The plans not readable: 'failed'.
 *   - nobody signed in: the window's plans (pt_guest_scenarios), with ids as the planner's guest store gives them
 *     ('guest-' and eight random characters), written back as ONE setItem with every other plan byte-identical; refused
 *     when the window holds its three plans already ('full': services/GuestPlans.js guestHasRoom, the example plan not
 *     counted; a couple needs room for two), or when the free time is used up ('usedUp');
 *   - then keep/made (the plan's id, name and where it is: the panel says "Kept as …" and offers its lock step) and the
 *     plans read again. There is no Undo for a plan made: the planner's own menu removes a plan.
 * A keep pressed before this file was loaded (it comes with the plan source) is picked up at start.
 *   Each account create carries a stamp chosen once (its createdAt), kept in the tab's draft until the plan is told as made
 *   (keep/sending): after a lost answer the account is read again and the plan found; a retry, even after a reload, finds it
 *   too and never makes a second; while the account cannot be read nothing more is made ('unsure').
 * "Use these in ‘…’" (6.59.0) on question B's answer, kind 'useAnswer': trying figures there writes nothing; this press writes
 * the answer's saving figures onto the plan B was opened from (or kept as) — answers/plan/useAnswer.js, What you pay in's own
 * settings, ONE write, op 'saving', with Undo. A new plan is made only by an explicit keep.
 *
 * The names imported from the Firebase package are `doc`, `updateDoc`, `addDoc` and `collection` and nothing else; the
 * boundary test (tests/v7/boundaries.test.js) fails on any other, anywhere V7 can reach, and holds `updateDoc` and
 * `addDoc` to one call each in this file.
 *
 *   GUEST_PLANS_KEY     'pt_guest_scenarios' (the one V7 file that may write it)
 *   TOAST_MS            how long the Undo toast stays
 *   KEEP_WAIT_MS        how long a keep waits for the sign-in check and the plans before giving up ('failed')
 *   guestPlanId(rand, taken)   a window plan's id, as the planner's guest store makes them, not among `taken`
 *   startPlanWrite(store, { win, session, local, now, fb, client, handles, rand }) → stop()
 */
import { doc, updateDoc, addDoc, deleteDoc, collection } from 'firebase/firestore/lite';
import { A } from '../state/actions.js';
import { keepView } from '../state/select.js';
import { parse, href } from '../router/routes.js';
import { buildPlanSeed } from '../../answers/keep/planSeed.js';
import { plansFromSeed, withPartnerId, planProblems, stillSavingOf } from '../../answers/keep/planCreate.js';
import { upgradeScenario } from '../../firebase/scenarioMigration.js';
import { guestOwnPlans, GUEST_MAX_PLANS, isExamplePlan, DEMO_PLANS, EXAMPLE_PLAN_KEY, EXAMPLE_PLAN_DESCRIPTION } from '../../services/GuestPlans.js';
import { copyOf, hasRecords } from '../../services/PlanCopy.js';
import { closeQuestionOf, successorOf, closeWrite, partnerWrites, successorName, workingStopOf, linkedPartnerOf } from '../../services/PlanClose.js';
import { monthWordsOf } from '../../services/PlanClosed.js';
import { withoutPotsAsOf } from '../../services/PlanFromToday.js';
import { stripIdentity } from '../../services/PlanExport.js';
import { handoffPayload } from '../../services/GuestMeter.js';
import { aboutPatch, applyPatch, stalePatch, stopAskPatch, parseMonth } from '../../answers/plan/about.js';
import { incomePatch } from '../../answers/plan/income.js';
import { spendPatch } from '../../answers/plan/spend.js';
import { potsPatch } from '../../answers/plan/pots.js';
import { lastsPatch, tryPatch, tryCopyOf, runKeyOf } from '../../answers/plan/lasts.js';
import { lockPatch, unlockPatch, documentPatch, isLockReversal, shapeRefsOf } from '../../answers/plan/lock.js';
import { movedPlanOf, movePatch, withLaterDraft } from '../../answers/plan/moveStart.js';
import { dateOf } from '../../answers/plan/dates.js';
import { wayPatch } from '../../answers/plan/way.js';
import { mixPatch, useMixPatch } from '../../answers/plan/mix.js';
import { partnerOf, linkPatch, dismissPatch, splitPatches, shareBudgetPatches, whoPaysPatches } from '../../answers/plan/household.js';
import { holdPatch } from '../../answers/plan/hold.js';
import { tickPatch } from '../../answers/plan/move.js';
import { amendPatch, withdrawPatch } from '../../answers/plan/keepTest.js';
import { stressAmendPatch, stressWithdrawPatch, stressKeyOf, sameAs, referenceOf } from '../../answers/plan/stressPanel.js';
import { budgetPatch } from '../../answers/plan/budget.js';
import { savingPatch, recordPatch } from '../../answers/plan/saving.js';
import { checkInDraft, checkInPatch, restartPathPatch, useInPlanPatch, CHECKIN_FUTURES, CHECKIN_SEED } from '../../answers/plan/checkIn.js';
import { answerInPlanPatch } from '../../answers/plan/useAnswer.js';
import { monthRecordPatch, taxYearPatch } from '../../answers/plan/month.js';
import { uniqueName, getDefaultScenario } from '../../services/PlanFromSeed.js';
import { ALL_WRITES } from '../../answers/plan/schema.js';
import { isLockedSettings, lockedPlanWriteRefusal, checkInWriteRefusal, monthWriteRefusal } from '../../services/LockedPlanGuard.js';
import { getDefaultStressSettings } from '../../storage/stressDefaults.js';
import { readMinutes, isBlocked } from '../../services/GuestMeter.js';
import { NO_WORKER } from './workerClient.js';

export const GUEST_PLANS_KEY = 'pt_guest_scenarios';
/** The mark on each name brought in from this window after a sign-in (copy/guest.js bringIn.suffix says the same). */
export const WINDOW_SUFFIX = ' (from this window)';
/** What an opened file's plan is named: "{name} (opened)". */
export const OPENED_SUFFIX = ' (opened)';
/** A downloaded copy bigger than this is refused before it is read: a plan is at most one Firestore document (1 MiB), and the file is written with spaces. */
export const OPEN_FILE_MAX_BYTES = 4 * 1024 * 1024;
export const TOAST_MS = 15000;
export const KEEP_WAIT_MS = 20000;
const ALLOWED = new Set(ALL_WRITES);
const BASE36 = '0123456789abcdefghijklmnopqrstuvwxyz';

/** A window plan's id as the planner's guest store makes them: 'guest-' and eight characters of base 36, not among `taken`. */
export function guestPlanId(rand, taken = new Set()) {
  for (let tries = 0; tries < 1000; tries++) {
    let id = 'guest-';
    for (let i = 0; i < 8; i++) id += BASE36[Math.min(35, Math.floor(rand() * 36))];
    if (!taken.has(id)) return id;
  }
  throw new Error('planWrite: no free id');
}

/** The name a plan was kept under, as the readers take it (answers/plan/read.js nameOf). */
const nameOf = (plan) => (plan && plan.planDetails && typeof plan.planDetails.name === 'string' && plan.planDetails.name) || (plan && typeof plan.name === 'string' && plan.name) || '';

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
 * @param {{ doc, updateDoc, addDoc, collection }|null} [o.fb]   the four Firebase functions (the tests hand in fakes); the real ones otherwise
 * @param {{ document }|null} [o.client]     the worker client: the lock's and the new version's run (none: 'noWorker')
 * @param {() => { db, user, reread }} o.handles   planSource's Firestore handle, signed-in user and "read the account again"
 * @param {() => number} [o.rand]           the window plans' ids (the tests hand in their own)
 */
export function startPlanWrite(store, { win = null, session = null, local = null, now = () => new Date(), fb = null, client = null, handles, rand = Math.random }) {
  const F = fb || { doc, updateDoc, addDoc, deleteDoc, collection };
  let stopped = false;
  let busy = false;
  let timer = null;
  const dispatch = (a) => { if (!stopped) store.dispatch(a); };
  const fail = (planId, problem, detail = null) => dispatch({ type: A.PLAN_SAVE_FAILED, planId, problem, ...(detail ? { detail } : {}) });
  const later = (fn) => { if (!win || typeof win.setTimeout !== 'function') return; if (timer) win.clearTimeout(timer); timer = win.setTimeout(() => { timer = null; fn(); }, TOAST_MS); };
  /** The day the screens read the plan on (state.env.today), as a date; the clock when it cannot be read. */
  const todayOf = (state) => { try { return dateOf(state.env.today); } catch { return now(); } };

  /** Where the plan is, and whether a write may go there at all. The example plan (GuestPlans.js) is read-only: only a copy, a download and a delete may name it. */
  function placeOf(state, planId, { allowExample = false } = {}) {
    const plans = state.plans;
    const entry = plans && Array.isArray(plans.list) ? plans.list.find((e) => e && e.plan && String(e.plan.id) === String(planId)) : null;
    if (!entry) return { problem: 'notHere' };
    if (entry.newer || entry.failed) return { problem: 'readonly' };
    if (!allowExample && isExamplePlan(entry.plan)) return { problem: 'example' };
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
    return !!lockedPlanWriteRefusal(plan, data, getDefaultStressSettings(), { now: now() });
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
    const step = r && r.screen === 'plan' && (r.step === 'income' || r.step === 'spend' || r.step === 'pots' || r.step === 'lasts' || r.step === 'mix' || r.step === 'saving') ? r.step : 'about';
    return { step, patchOf: step === 'income' ? incomePatch : step === 'spend' ? spendPatch : step === 'pots' ? potsPatch : step === 'lasts' ? lastsPatch : step === 'mix' ? mixPatch : step === 'saving' ? savingPatch : aboutPatch };
  }

  /** The plan as read, after the fresh read of the account: { place, plan, state } or null after a failure already told. */
  async function placed(planId, opts = {}) {
    let state = store.getState();
    let place = placeOf(state, planId, opts);
    if (place.problem) { fail(planId, place.problem); return null; }
    if (place.kind === 'account') {
      // the plans as stored, read just before the write: the guard then sees a lock made elsewhere since this page opened
      try { await place.reread(); } catch { /* the read failed: the copy in memory is the best there is */ }
      if (stopped) return null;
      state = store.getState();
      place = placeOf(state, planId, opts);
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
    if (state.route && state.route.screen === 'plan' && state.route.step === 'household') { await saveWhoPays(planId, place, plan, state); return; }
    const { step, patchOf } = stepOf(state);
    const pd = state.draft.plan && state.draft.plan.id === String(planId) ? state.draft.plan : null;
    const typed = pd ? pd.values : {};
    // "What you pay in" (road-to-7.md step 11b) is outside the lock, as the planner's Accumulation page is: the guard alone decides.
    // On a locked plan's "About you and when", the one write is the answer to "When did you stop work?" (6.53.0, about.js
    // stopAskPatch): the month, or "Leave it" — keys the guard lets a locked plan write.
    const lockedPlan = isLockedSettings(plan.decisionTool && plan.decisionTool.settings);
    const lockedAbout = step === 'about' && lockedPlan;
    if (step !== 'saving' && lockedPlan && !lockedAbout) { fail(planId, 'locked'); return; }
    // a draft read from an earlier start than it saved (7.4.0): its settings are written as read, with the step's (withLaterDraft)
    const p = lockedAbout ? stopAskPatch(plan, typed, { today: state.env.today }) : withLaterDraft(plan, patchOf(plan, typed, { today: state.env.today }), { now: todayOf(state) });
    if (!p.ok) { fail(planId, p.errors.plan === 'locked' || p.errors.plan === 'notLocked' ? 'locked' : 'problems'); return; }
    const about = state.plans.view && state.plans.view.page && state.plans.view.page[step] && state.plans.view.page.forId === String(planId) ? state.plans.view.page[step] : null;
    const line = lockedAbout ? p.line : about && about.savedLine ? about.savedLine : null;
    if (!Object.keys(p.patch).length) { dispatch({ type: A.PLAN_SAVED, planId, previous: {}, line }); later(() => dispatch({ type: A.PLAN_TOAST_CLOSE })); return; }
    const data = declaredOnly({ ...p.patch, lastModified: now().toISOString() });
    if (lockedRefusal(plan, data)) { fail(planId, 'locked'); return; }
    if (!(await send(place, planId, data))) return;
    // Undo puts the plan back as it was, its last-changed stamp included (editing-in-v7.md 3): byte-identical afterwards.
    // "What you pay in" marks its toast (op 'saving'): its Undo is judged by what was written, wherever the person is by then
    dispatch({ type: A.PLAN_SAVED, planId, previous: { ...p.previous, lastModified: plan.lastModified }, line, ...(step === 'saving' ? { op: 'saving' } : {}) });
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

  /**
   * "Move the plan's start" on a locked plan (6.55.0; the planner's moveLockedPlanStart, field for field): the run of the plan
   * AS MOVED in the worker (moveStart.js movedPlanOf: both copies moved, no document, read from where the lock's pots stood),
   * then movePatch as ONE write past the guard — its `reAnchor` allowance lets exactly that move through, under the lock.
   * The plan stays locked. No Undo, as in the planner: the toast says it is done.
   */
  async function moveStart(planId, how = {}) {
    const got = await placed(planId);
    if (!got) return;
    const { place, plan, state } = got;
    if (!isLockedSettings(plan.decisionTool && plan.decisionTool.settings)) { fail(planId, 'notLocked'); return; }
    const at = now();
    // how (7.4.0): to this tax year with no month said, and the State Pension's date where the plan gives only its plan year
    const h = { thisYear: !!(how && how.thisYear), spStartDate: (how && how.spStartDate) || null };
    const mp = movedPlanOf(plan, { now: at, ...h });
    if (!mp) { fail(planId, 'noMove'); return; }
    const run = await runFor(planId, mp.plan, state);
    if (!run) return;
    const p = movePatch(plan, { now: at, run, entries: state.plans.list, ...h });
    if (!p.ok) { fail(planId, p.errors.plan === 'noMove' || p.errors.plan === 'noRun' || p.errors.plan === 'notHere' ? p.errors.plan : 'failed'); return; }
    const data = declaredOnly({ ...p.patch, lastModified: at.toISOString() });
    if (lockedRefusal(plan, data)) { fail(planId, 'locked'); return; }
    if (!(await send(place, planId, data))) return;
    dispatch({ type: A.PLAN_SAVED, planId, previous: {}, line: p.line, op: 'moveStart' });
    dispatch({ type: A.PLANS_READING });
    later(() => dispatch({ type: A.PLAN_TOAST_CLOSE }));
  }

  /** "Use this way of drawing" (way-and-mix.md 2.4): the switch as one write to an unlocked plan; the dials typed on the card go with it. */
  async function useWay(planId, id) {
    const got = await placed(planId);
    if (!got) return;
    const { place, plan, state } = got;
    if (isLockedSettings(plan.decisionTool && plan.decisionTool.settings)) { fail(planId, 'locked'); return; }
    const W = state.ways || {};
    const page = state.plans.view && state.plans.view.page && state.plans.view.page.forId === String(planId) ? state.plans.view.page.way : null;
    const typed = (W.dials && W.dials[id]) || {};
    const run = W.result && Array.isArray(W.result.ways) ? W.result.ways.find((x) => x && x.id === id) : null;
    if (!page || !page.found || !run || W.key !== page.runKey) { fail(planId, 'noRun'); return; }
    const at = now();
    const p = withLaterDraft(plan, wayPatch(plan, id, typed, { today: state.env.today, at: at.toISOString(), defaults: run.dials ? run.dials.defaults : {} }), { now: todayOf(state) });
    if (!p.ok) { fail(planId, p.errors.plan === 'locked' ? 'locked' : 'problems'); return; }
    if (!Object.keys(p.patch).length) { dispatch({ type: A.PLAN_SAVED, planId, previous: {}, line: p.line, op: 'way' }); later(() => dispatch({ type: A.PLAN_TOAST_CLOSE })); return; }
    const data = declaredOnly({ ...p.patch, lastModified: at.toISOString() });
    if (lockedRefusal(plan, data)) { fail(planId, 'locked'); return; }
    if (!(await send(place, planId, data))) return;
    dispatch({ type: A.PLAN_SAVED, planId, previous: { ...p.previous, lastModified: plan.lastModified }, line: p.line, op: 'way' });
    dispatch({ type: A.PLANS_READING });
    later(() => dispatch({ type: A.PLAN_TOAST_CLOSE }));
  }

  /** "Use this mix" (way-and-mix.md 3.2e): the amounts a cell of the comparison ran with, the mode and the tent, as one write to an unlocked plan. */
  async function useMix(planId, cell) {
    const got = await placed(planId);
    if (!got) return;
    const { place, plan, state } = got;
    if (isLockedSettings(plan.decisionTool && plan.decisionTool.settings)) { fail(planId, 'locked'); return; }
    const M = state.mix || {};
    const page = state.plans.view && state.plans.view.page && state.plans.view.page.forId === String(planId) ? state.plans.view.page.mix : null;
    if (!page || !page.found || M.key !== page.runKey || M.compare.status !== 'done') { fail(planId, 'noRun'); return; }
    const at = now();
    const p = withLaterDraft(plan, useMixPatch(plan, cell, { today: state.env.today }), { now: todayOf(state) });
    if (!p.ok) { fail(planId, p.errors.plan === 'locked' ? 'locked' : 'problems'); return; }
    const line = { id: 'use', slots: { key: cell.key, tent: cell.tent ? 'on' : 'off' } };
    if (!Object.keys(p.patch).length) { dispatch({ type: A.PLAN_SAVED, planId, previous: {}, line, op: 'mix' }); later(() => dispatch({ type: A.PLAN_TOAST_CLOSE })); return; }
    const data = declaredOnly({ ...p.patch, lastModified: at.toISOString() });
    if (lockedRefusal(plan, data)) { fail(planId, 'locked'); return; }
    if (!(await send(place, planId, data))) return;
    dispatch({ type: A.PLAN_SAVED, planId, previous: { ...p.previous, lastModified: plan.lastModified }, line, op: 'mix' });
    dispatch({ type: A.PLANS_READING });
    later(() => dispatch({ type: A.PLAN_TOAST_CLOSE }));
  }

  /** The tried change held for this plan's run (way-and-mix.md 4), or null (told as 'noRun'). */
  function triedOf(state, planId) {
    const L = state.lasts || {};
    const page = state.plans.view && state.plans.view.page && state.plans.view.page.forId === String(planId) ? state.plans.view.page.lasts : null;
    if (!page || !page.found || L.key !== page.runKey || !L.tried || L.tried.status !== 'done' || !L.tried.boxes) return null;
    return L.tried.boxes;
  }

  /** "Use this" on a tried change (way-and-mix.md 4): ONE write of exactly the fields that differ, composed from the steps' lists, to an unlocked plan. */
  async function useTry(planId) {
    const got = await placed(planId);
    if (!got) return;
    const { place, plan, state } = got;
    if (isLockedSettings(plan.decisionTool && plan.decisionTool.settings)) { fail(planId, 'locked'); return; }
    const boxes = triedOf(state, planId);
    if (!boxes) { fail(planId, 'noRun'); return; }
    const at = now();
    const p = withLaterDraft(plan, tryPatch(plan, boxes, { today: state.env.today, at: at.toISOString() }), { now: todayOf(state) });
    if (!p.ok) { fail(planId, p.errors.plan === 'locked' ? 'locked' : 'problems'); return; }
    if (!Object.keys(p.patch).length) { dispatch({ type: A.PLAN_SAVED, planId, previous: {}, line: p.line, op: 'try' }); later(() => dispatch({ type: A.PLAN_TOAST_CLOSE })); return; }
    const data = declaredOnly({ ...p.patch, lastModified: at.toISOString() });
    if (lockedRefusal(plan, data)) { fail(planId, 'locked'); return; }
    if (!(await send(place, planId, data))) return;
    dispatch({ type: A.PLAN_SAVED, planId, previous: { ...p.previous, lastModified: plan.lastModified }, line: p.line, op: 'try' });
    dispatch({ type: A.PLANS_READING });
    later(() => dispatch({ type: A.PLAN_TOAST_CLOSE }));
  }

  /**
   * "Keep as a separate plan" (way-and-mix.md 4): the tried settings as a NEW plan — a copy of the plan with the copy's
   * settings (lasts.js tryCopyOf), named "{name} · tried" made unique, never active, never locked (a locked plan's copy is
   * made unlocked, its document, record and archive not carried — the planner's rule for a copy), through the one create.
   */
  async function keepCopy(planId) {
    const got = await placed(planId);
    if (!got) return;
    const { place, plan, state } = got;
    const boxes = triedOf(state, planId);
    if (!boxes) { fail(planId, 'noRun'); return; }
    if (place.kind === 'account' && state.session.kind !== 'in') { fail(planId, 'unverified'); return; }
    const at = now();
    const plans = state.plans.list.map((e) => e.plan);
    if (place.kind === 'window' && guestOwnPlans(plans).length + 1 > GUEST_MAX_PLANS) { fail(planId, 'full'); return; }
    let doc;
    try {
      const copy = tryCopyOf(plan, boxes, state.env.today);
      const { id, createdAt, lastModified, ...rest } = copy; void id; void createdAt; void lastModified;
      const name = uniqueName((nameOf(plan) || 'Plan') + ' · tried', plans.map(nameOf).filter(Boolean));
      rest.planDetails = { ...(rest.planDetails || {}), name };
      rest.isActive = false;
      // never locked, nothing recorded against it: the lock's record, the document and the archives stay with the original
      if (rest.decisionTool) {
        rest.decisionTool = { ...rest.decisionTool, settings: { ...(rest.decisionTool.settings || {}), locked: false }, history: [], taxYears: {} };
        delete rest.decisionTool.settings.lockedAt; delete rest.decisionTool.settings.lockedBy; delete rest.decisionTool.settings.unlockedAt; delete rest.decisionTool.settings.unlockCount;
        delete rest.decisionTool.planOfRecord; delete rest.decisionTool.planOfRecordArchive;
      }
      delete rest.planDocument; delete rest.planDocumentArchive; delete rest.journey;
      const stamp = at.toISOString();
      doc = { plan: readyPlan({ ...rest, createdAt: stamp, lastModified: stamp }, at), name };
    } catch { fail(planId, 'failed'); return; }
    let made;
    if (place.kind === 'account') {
      try { made = { id: await add(scenariosOf(place), doc.plan) }; } catch { fail(planId, 'failed'); return; }
    } else {
      made = createOneInWindow(doc.plan);
      if (made.problem) { fail(planId, made.problem); return; }
    }
    if (stopped) return;
    dispatch({ type: A.TRY_KEPT, planId, id: made.id, name: doc.name, where: place.kind });
    dispatch({ type: A.PLANS_READING });
  }

  async function undo(planId, previous, op = null, lockedAt = null, others = []) {
    const state = store.getState();
    const place = placeOf(state, planId);
    if (place.problem) { fail(planId, place.problem); return; }
    const plan = place.entry.plan;
    // a write that touched the partner's plan too (road-to-7.md step 9): its previous values go back first, each past the guard
    for (const o of Array.isArray(others) ? others : []) {
      const op2 = placeOf(state, o.planId);
      if (op2.problem) { fail(planId, op2.problem); return; }
      const back2 = {};
      for (const [k, v] of Object.entries(o.previous || {})) back2[k] = v === undefined && op2.kind === 'account' ? null : v;
      if (!('lastModified' in back2) || back2.lastModified == null) back2.lastModified = now().toISOString();
      const data2 = declaredOnly(back2);
      if (lockedRefusal(op2.entry.plan, Object.fromEntries(Object.entries(data2).map(([k, v]) => [k, v === undefined ? null : v])))) { fail(planId, 'locked'); return; }
      if (!(await send(op2, o.planId, data2))) return;
    }
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
    } else if (op === 'checkIn') {
      // a check-in, or its path drawn again, put back: the same keys it wrote, past the guard (release step R3)
      if (lockedRefusal(plan, asSent) || checkInWriteRefusal(plan, asSent)) { fail(planId, 'locked'); return; }
    } else if (op === 'month' || op === 'taxYear') {
      // a month recorded (with its fill) or a tax year set up, put back: the records and the tax years as they were, past the guard (7.2.0)
      if (lockedRefusal(plan, asSent) || monthWriteRefusal(asSent)) { fail(planId, 'locked'); return; }
    } else if (op === 'link' || op === 'dismiss' || op === 'budgetShare' || op === 'split' || op === 'whoPays' || op === 'hold' || op === 'tick' || op === 'amend' || op === 'budget' || op === 'saving' || op === 'potRecord' || op === 'stale') {
      // the household's writes (road-to-7.md step 9), the record and the tick-offs (step 10), the budget, "What you pay in", the pot record and
      // "Leave it" (step 11b) go where the planner's go: the guard alone decides — by the write's own mark, never by the step the person has since moved to
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

  // ---- Month by month (research/v7/months-in-v7.md §3, 7.2.0): a month recorded, a tax year set up ----------------------------

  /** "Record" or "Set up 2026/27": the step's pure writer on the boxes as typed, ONE write of the records and tax years only. */
  async function monthWrite(planId, kind) {
    const got = await placed(planId);
    if (!got) return;
    const { place, plan, state } = got;
    const pd = state.draft.plan && state.draft.plan.id === String(planId) ? state.draft.plan : null;
    const typed = pd ? pd.values : {};
    const at = now();
    const p = kind === 'taxYear' ? taxYearPatch(plan, typed, { today: state.env.today }) : monthRecordPatch(plan, typed, { today: state.env.today, nowIso: at.toISOString() });
    if (!p.ok) { fail(planId, p.problem === 'notLocked' || p.problem === 'notSetUp' || p.problem === 'refused' || p.problem === 'setUpAlready' || p.problem === 'noMonth' ? p.problem : p.problem === 'problems' ? 'problems' : 'failed'); return; }
    const data = declaredOnly({ ...p.patch, lastModified: at.toISOString() });
    if (lockedRefusal(plan, data) || monthWriteRefusal(data)) { fail(planId, 'locked'); return; }
    if (!(await send(place, planId, data))) return;
    dispatch({ type: A.PLAN_SAVED, planId, previous: { ...p.previous, lastModified: plan.lastModified }, line: p.line, op: kind === 'taxYear' ? 'taxYear' : 'month' });
    dispatch({ type: A.PLANS_READING });
    later(() => dispatch({ type: A.PLAN_TOAST_CLOSE }));
  }

  // ---- "Your household" (road-to-7.md step 9): the link, the split, "Keep things as they are", the budget shared, who pays ----

  /** The partner's plan as read, from the list the page holds; null when none is linked (told as 'noPartner'). */
  function partnerIn(state, plan) {
    const e = partnerOf(state.plans.list, plan);
    return e ? e.plan : null;
  }

  /** ONE write per plan of exactly the declared paths plus the stamp, each past the guard; the first plan's toast carries the others' previous values. */
  async function sendAll(place, planId, writes, { line, op }) {
    const at = now();
    const plan = place.entry.plan;
    const state = store.getState();
    const stamped = [];
    for (const w of writes) {
      if (!Object.keys(w.patch).length) continue;
      const pl = String(w.planId) === String(planId) ? place : placeOf(state, w.planId);
      if (pl.problem) { fail(planId, pl.problem); return false; }
      const data = declaredOnly({ ...w.patch, lastModified: at.toISOString() });
      if (lockedRefusal(pl.entry.plan, data)) { fail(planId, 'locked'); return false; }
      stamped.push({ place: pl, planId: String(w.planId), data, previous: { ...w.previous, lastModified: pl.entry.plan.lastModified } });
    }
    if (!stamped.length) { dispatch({ type: A.PLAN_SAVED, planId, previous: {}, line, op }); later(() => dispatch({ type: A.PLAN_TOAST_CLOSE })); return true; }
    for (const w of stamped) if (!(await send(w.place, w.planId, w.data))) return false;
    const mine = stamped.find((w) => w.planId === String(planId));
    const others = stamped.filter((w) => w.planId !== String(planId)).map((w) => ({ planId: w.planId, previous: w.previous }));
    dispatch({ type: A.PLAN_SAVED, planId, previous: mine ? mine.previous : { lastModified: plan.lastModified }, line, op, others });
    dispatch({ type: A.PLANS_READING });
    later(() => dispatch({ type: A.PLAN_TOAST_CLOSE }));
    return true;
  }

  /** The partner link (the planner's setHouseholdPartnerId): this plan only; the partner named must be in the same store. */
  async function link(planId, partnerId) {
    const got = await placed(planId);
    if (!got) return;
    const { place, plan, state } = got;
    if (partnerId && !state.plans.list.some((e) => e && e.plan && String(e.plan.id) === String(partnerId))) { fail(planId, 'notHere'); return; }
    const p = linkPatch(plan, partnerId);
    if (!p.ok) { fail(planId, 'problems'); return; }
    await sendAll(place, planId, [{ planId: String(planId), patch: p.patch, previous: p.previous }], { line: p.line, op: 'link' });
  }

  /** "Keep things as they are" / "Show it again" (the planner's setHouseholdSplitDismissed): this plan, for this partner and this state of both. */
  async function dismiss(planId, keep) {
    const got = await placed(planId);
    if (!got) return;
    const { place, plan, state } = got;
    const partner = partnerIn(state, plan);
    const H = state.household || {};
    const page = state.plans.view && state.plans.view.page && state.plans.view.page.forId === String(planId) ? state.plans.view.page.household : null;
    if (!partner || !page || !page.found) { fail(planId, 'noPartner'); return; }
    const fingerprint = keep ? (H.key === page.runKey && H.status === 'done' && H.result && H.result.split ? H.result.split.fingerprint : null) : (page.split && page.split.fingerprint) || null;
    if (keep && !fingerprint) { fail(planId, 'noRun'); return; }
    const p = dismissPatch(plan, partner.id, fingerprint || '', { at: now().toISOString() }, keep);
    await sendAll(place, planId, [{ planId: String(planId), patch: p.patch, previous: p.previous }], { line: p.line, op: 'dismiss' });
  }

  /** "Share this plan's budget" / "Keep a separate budget" (the planner's shareBudgetWith / stopSharingBudget): the write on the partner's plan. */
  async function shareBudget(planId, share) {
    const got = await placed(planId);
    if (!got) return;
    const { place, plan, state } = got;
    const partner = partnerIn(state, plan);
    if (!partner) { fail(planId, 'noPartner'); return; }
    // "Keep a separate budget" on THIS plan's own reading (it points at the partner's): the write is on this plan instead
    const readsTheirs = plan.budgetTool && plan.budgetTool.sharedFrom === String(partner.id);
    const p = !share && readsTheirs ? shareBudgetPatches(partner, plan, false, { source: partner }) : shareBudgetPatches(plan, partner, share, { source: plan });
    if (!p.ok) { fail(planId, 'problems'); return; }
    await sendAll(place, planId, p.writes, { line: p.line, op: 'budgetShare' });
  }

  /** The budget's who-pays (the planner's saveBudget): the step's own save, written where the lines live. */
  async function saveWhoPays(planId, place, plan, state) {
    const pd = state.draft.plan && state.draft.plan.id === String(planId) ? state.draft.plan : null;
    const p = whoPaysPatches(plan, state.plans.list, pd ? pd.values : {}, { today: state.env.today });
    if (!p.ok) { fail(planId, 'problems'); return; }
    await sendAll(place, planId, p.writes, { line: p.line, op: null });
  }

  /**
   * "Use this split" (the planner's applySplit): on two unlocked plans one write each of the split's income shape; when
   * either is locked, a copy of each through the ONE create, linked to each other, never locked, the originals untouched.
   */
  async function useSplit(planId) {
    const got = await placed(planId);
    if (!got) return;
    const { place, plan, state } = got;
    const partner = partnerIn(state, plan);
    if (!partner) { fail(planId, 'noPartner'); return; }
    const H = state.household || {};
    const page = state.plans.view && state.plans.view.page && state.plans.view.page.forId === String(planId) ? state.plans.view.page.household : null;
    if (!page || !page.found || H.key !== page.runKey || H.status !== 'done' || !H.result || !H.result.ok || !H.result.split || !H.result.split.applies) { fail(planId, 'noRun'); return; }
    const p = splitPatches(plan, partner, H.result.split, { today: state.env.today });
    if (!p.ok) { fail(planId, 'problems'); return; }
    if (p.mode === 'write') { await sendAll(place, planId, p.writes, { line: p.line, op: 'split' }); return; }
    if (place.kind === 'account' && state.session.kind !== 'in') { fail(planId, 'unverified'); return; }
    const plans = state.plans.list.map((e) => e.plan);
    if (place.kind === 'window' && guestOwnPlans(plans).length + 2 > GUEST_MAX_PLANS) { fail(planId, 'full'); return; }
    const at = now();
    let docs;
    try {
      const taken = plans.map(nameOf).filter(Boolean);
      docs = p.copies.map((c) => { const name = uniqueName(c.name, taken); taken.push(name); return { plan: copyPlanOf(c.source, c.settings, name, at), name }; });
    } catch { fail(planId, 'failed'); return; }
    let made;
    if (place.kind === 'account') {
      // the copies linked to each other: the first made without its link (its partner's id is not known yet), then the second with it, then the first's link as one write
      let idA, idB;
      try { idA = await add(scenariosOf(place), docs[0].plan); } catch { fail(planId, 'failed'); return; }
      if (stopped) return;
      try { idB = await add(scenariosOf(place), readyPlan({ ...docs[1].plan, household: { ...(docs[1].plan.household || {}), partnerScenarioId: idA } }, at)); } catch { fail(planId, 'partial'); return; }
      if (stopped) return;
      const link = declaredOnly({ 'household.partnerScenarioId': idB, lastModified: at.toISOString() });
      let linked = false;
      try { linked = await write(place, idA, link); } catch { linked = false; }
      if (!linked) { fail(planId, 'partial'); return; }
      made = { ids: { a: idA, b: idB } };
    } else {
      made = createPairInWindow(docs.map((d) => d.plan));
      if (made.problem) { fail(planId, made.problem); return; }
    }
    if (stopped) return;
    dispatch({ type: A.SPLIT_KEPT, planId, ids: made.ids, names: { a: docs[0].name, b: docs[1].name }, where: place.kind });
    dispatch({ type: A.PLANS_READING });
  }

  // ---- "What you hold" and "Moving to your plan's mix" (research/v7/holdings-and-move.md §2.2, §3.8; road-to-7.md step 10) ----

  /**
   * ONE change of the record (hold.js holdPatch: HoldingsRecord.holdingsWith / HoldingsPaste.applyPaste, the planner's own),
   * written as the whole `holdings` field plus the stamp, past the guard — which lets it through on a locked plan, as the
   * planner's own save does (LockedPlanGuard.js: what you hold is outside the lock). Undo puts the previous record back whole.
   */
  async function saveHold(planId, change) {
    const got = await placed(planId);
    if (!got) return;
    const { place, plan, state } = got;
    const at = now();
    const p = holdPatch(plan, change, { today: state.env.today });
    if (!p.ok) { fail(planId, 'problems'); return; }
    const data = declaredOnly({ ...p.patch, lastModified: at.toISOString() });
    if (lockedRefusal(plan, data)) { fail(planId, 'locked'); return; }
    if (!(await send(place, planId, data))) return;
    dispatch({ type: A.PLAN_SAVED, planId, previous: { ...p.previous, lastModified: plan.lastModified }, line: p.line, op: 'hold' });
    dispatch({ type: A.PLANS_READING });
    later(() => dispatch({ type: A.PLAN_TOAST_CLOSE }));
  }

  /** One tick-off (move.js tickPatch: TransitionPlanner.tickMove / untickMove): the whole `transition` object plus the stamp, past the guard. */
  async function tick(planId, key, done) {
    const got = await placed(planId);
    if (!got) return;
    const { place, plan, state } = got;
    const at = now();
    const p = tickPatch(plan, key, { today: state.env.today, done });
    if (!p.ok) { fail(planId, p.errors.plan === 'notLocked' ? 'notLocked' : 'problems'); return; }
    const data = declaredOnly({ ...p.patch, lastModified: at.toISOString() });
    if (lockedRefusal(plan, data)) { fail(planId, 'locked'); return; }
    if (!(await send(place, planId, data))) return;
    dispatch({ type: A.PLAN_SAVED, planId, previous: { ...p.previous, lastModified: plan.lastModified }, line: p.line, op: 'tick' });
    dispatch({ type: A.PLANS_READING });
    later(() => dispatch({ type: A.PLAN_TOAST_CLOSE }));
  }

  /**
   * "I accept this risk" (7.7.0, keepTest.js amendPatch): the re-test in page memory for THIS plan as it is now (its run key and
   * what is kept), written into the whole `planAmendments` list with the new agreement on the end, plus the stamp, past the
   * guard — ONE write, never the settings or the plan document. "Withdraw this" (withdrawPatch): the list without its last
   * agreement. Undo puts the previous list back whole.
   */
  async function amend(planId, op, kind = null, testId = null) {
    const got = await placed(planId);
    if (!got) return;
    const { place, plan, state } = got;
    const at = now();
    let p;
    if (kind === 'stress' || kind === 'confidence') {
      // a row of "Try the bad years" (7.9.0): its result held for this plan as it is now, and whether it changes nothing
      if (op === 'withdraw') p = stressWithdrawPatch(plan, testId);
      else {
        const Sp = state.stressPanel || null;
        const key = stressKeyOf(plan, state.env.today);
        const held = Sp && Sp.key === key && Sp.planId === String(planId) ? Sp.rows : {};
        const ref = referenceOf(testId);
        const result = held[testId] || null;
        const same = !!(result && ref && held[ref] && !held[ref].na && !result.na && sameAs(result, held[ref]));
        p = stressAmendPatch(plan, { id: testId, result, same }, { at: at.toISOString(), today: state.env.today });
      }
      if (!p.ok) { fail(planId, ['oldResult', 'same', 'nothingFails', 'noResult', 'none'].includes(p.problem) ? p.problem : 'problems'); return; }
      const data = declaredOnly({ ...p.patch, lastModified: at.toISOString() });
      if (lockedRefusal(plan, data)) { fail(planId, 'locked'); return; }
      if (!(await send(place, planId, data))) return;
      const line = op === 'withdraw' ? { id: 'stressWithdrawn', slots: p.line ? p.line.slots : {} } : { id: 'stressAgreed', slots: p.line ? p.line.slots : {} };
      dispatch({ type: A.PLAN_SAVED, planId, previous: { ...p.previous, lastModified: plan.lastModified }, line, op: 'amend' });
      dispatch({ type: A.PLANS_READING });
      later(() => dispatch({ type: A.PLAN_TOAST_CLOSE }));
      return;
    }
    if (op === 'withdraw') p = withdrawPatch(plan);
    else {
      const Kt = state.keepTest || null;
      const result = Kt && Kt.status === 'done' && Kt.key === runKeyOf(plan) ? Kt.result : null;
      p = amendPatch(plan, result, { today: state.env.today, at: at.toISOString() });
    }
    if (!p.ok) { fail(planId, ['notLocked', 'stale', 'nothingKept', 'noResult', 'none'].includes(p.problem) ? p.problem : 'problems'); return; }
    const data = declaredOnly({ ...p.patch, lastModified: at.toISOString() });
    if (lockedRefusal(plan, data)) { fail(planId, 'locked'); return; }
    if (!(await send(place, planId, data))) return;
    dispatch({ type: A.PLAN_SAVED, planId, previous: { ...p.previous, lastModified: plan.lastModified }, line: p.line, op: 'amend' });
    dispatch({ type: A.PLANS_READING });
    later(() => dispatch({ type: A.PLAN_TOAST_CLOSE }));
  }

  // ---- the budget on a saved plan (research/v7/road-to-7.md step 11b) ----------------------------------------------------------

  /**
   * ONE change of the budget (budget.js budgetPatch: the planner's own handler lifted, the whole `budgetTool.settings` written as
   * the planner's saveBudget writes it), to the plan whose lines they are — a shared budget's lines to the household's plan and
   * this plan's own side here, each past the guard (the budget is outside the lock, as the planner's guard has it). Undo puts
   * each previous object back whole.
   */
  /** "Leave it" on an out-of-date draft (road-to-7.md step 11b; about.js stalePatch): the planner's own key, ONE write past the guard. */
  async function leaveStale(planId) {
    const got = await placed(planId);
    if (!got) return;
    const { place, plan, state } = got;
    const p = stalePatch(plan, { today: state.env.today });
    if (!p.ok) { fail(planId, 'failed'); return; }
    await sendAll(place, planId, [{ planId: String(planId), patch: p.patch, previous: p.previous }], { line: p.line, op: 'stale' });
  }

  async function saveBudgetChange(planId, change) {
    const got = await placed(planId);
    if (!got) return;
    const { place, plan, state } = got;
    const p = budgetPatch(plan, state.plans.list, change, { today: state.env.today });
    if (!p.ok) { fail(planId, 'problems'); return; }
    await sendAll(place, planId, p.writes, { line: p.line, op: 'budget' });
  }

  /**
   * "Record this month's pot" (road-to-7.md step 11b; saving.js recordPatch: the planner's recordAccumulationMonth line for line):
   * the whole record list with this month's record added, ONE write past the guard (the record is outside the lock, as the
   * planner's is); nothing is ever deleted. Undo puts the previous list back whole.
   */
  async function recordPot(planId) {
    const got = await placed(planId);
    if (!got) return;
    const { place, plan, state } = got;
    const pd = state.draft.plan && state.draft.plan.id === String(planId) ? state.draft.plan : null;
    const at = now();
    const p = recordPatch(plan, pd ? pd.values : {}, { today: state.env.today, now: at });   // stamped at the moment of the write, as the planner's record is
    if (!p.ok) { fail(planId, 'problems'); return; }
    const data = declaredOnly({ ...p.patch, lastModified: at.toISOString() });
    if (lockedRefusal(plan, data)) { fail(planId, 'locked'); return; }
    if (!(await send(place, planId, data))) return;
    dispatch({ type: A.PLAN_SAVED, planId, previous: { ...p.previous, lastModified: plan.lastModified }, line: p.line, op: 'potRecord' });
    dispatch({ type: A.PLANS_READING });
    later(() => dispatch({ type: A.PLAN_TOAST_CLOSE }));
  }

  /**
   * "Check in" (the header): the boxes checked, B run in the worker on the check-in's figures, then ONE write of the
   * check-in's own keys, past the guard; the answer is held for the result, with Undo.
   */
  async function checkIn(planId) {
    const got = await placed(planId);
    if (!got) return;
    const { place, plan, state } = got;
    const today = state.env.today;
    const pd = state.draft.plan && state.draft.plan.id === String(planId) ? state.draft.plan : null;
    const typed = pd ? pd.values : {};
    // the plans at hand: money taken flexibly on a plan before this one is read too (services/FlexibleAccess.js)
    const plans = state.plans.list;
    const d = checkInDraft(plan, typed, { today, now: now(), plans });
    // not still saving; or a saving plan whose change-over is still to come (its months are the previous plan's until then)
    if (!d.ok) { fail(planId, d.problem === 'notSaving' || d.problem === 'notYet' ? d.problem : 'problems'); return; }
    // the verdict from here (5.5): B on the plan's figures with the check-in's own; none when the plan has no aim yet or
    // figures the test cannot take — the check-in still records the pot and reads it against the path
    let result = null;
    if (d.read.ok) {
      if (!client || typeof client.checkIn !== 'function') { fail(planId, 'noWorker'); return; }
      try {
        result = await client.checkIn(d.read.inputs, { today, futures: CHECKIN_FUTURES, seed: CHECKIN_SEED, trace: false, detail: 'answer', ...(d.read.env || {}) });
      } catch (e) {
        if (!stopped) fail(planId, e && e.code === NO_WORKER ? 'noWorker' : 'failed');
        return;
      }
      if (stopped) return;
      if (!result || typeof result !== 'object') { fail(planId, 'noRun'); return; }
    }
    const at = now();
    const p = checkInPatch(plan, typed, { today, now: at, result, plans });
    if (!p.ok) { fail(planId, p.problem === 'notSaving' || p.problem === 'notYet' ? p.problem : 'problems'); return; }
    const data = declaredOnly({ ...p.patch, lastModified: at.toISOString() });
    if (lockedRefusal(plan, data) || checkInWriteRefusal(plan, data)) { fail(planId, 'locked'); return; }
    if (!(await send(place, planId, data))) return;
    dispatch({ type: A.CHECKIN_SHOWN, planId: String(planId), date: p.record.date, result });
    dispatch({ type: A.PLAN_SAVED, planId, previous: { ...p.previous, lastModified: plan.lastModified }, line: p.line, op: 'checkIn' });
    dispatch({ type: A.PLANS_READING });
    later(() => dispatch({ type: A.PLAN_TOAST_CLOSE }));
  }

  /** "Use these in my plan" (5.6) and "Start the path again from today" (5.3): ONE write each, outside the lock. */
  async function fromCheckIn(planId, kind) {
    const got = await placed(planId);
    if (!got) return;
    const { place, plan, state } = got;
    const at = now();
    const p = kind === 'useCheckIn' ? useInPlanPatch(plan, { today: state.env.today }) : restartPathPatch(plan, { today: state.env.today, now: at });
    if (!p.ok) { fail(planId, ['locked', 'restartOld', 'notSaving'].includes(p.problem) ? p.problem : 'problems'); return; }
    const op = kind === 'useCheckIn' ? 'saving' : 'checkIn';
    if (!Object.keys(p.patch).length) { dispatch({ type: A.PLAN_SAVED, planId, previous: {}, line: p.line, op }); later(() => dispatch({ type: A.PLAN_TOAST_CLOSE })); return; }
    const data = declaredOnly({ ...p.patch, lastModified: at.toISOString() });
    if (lockedRefusal(plan, data) || (kind === 'restartPath' && checkInWriteRefusal(plan, data))) { fail(planId, 'locked'); return; }
    if (!(await send(place, planId, data))) return;
    dispatch({ type: A.PLAN_SAVED, planId, previous: { ...p.previous, lastModified: plan.lastModified }, line: p.line, op });
    dispatch({ type: A.PLANS_READING });
    later(() => dispatch({ type: A.PLAN_TOAST_CLOSE }));
  }

  /**
   * "Use these in ‘…’" (6.59.0; answers/plan/useAnswer.js): question B's answer, at the pay-in the person chose, onto the plan B
   * came from (or was kept as) — What you pay in's own settings, ONE write as its Save makes, past the guard (outside the
   * lock, as the planner's Accumulation page is), with Undo; nothing else in the plan changes. The answer page says what
   * changed (keep/used); the plans are read again, so the plan's pages show it.
   */
  async function useAnswer(planId, q, payIn) {
    const got = await placed(planId);
    if (!got) return;
    const { place, plan, state } = got;
    const a = state.answers[q];
    const p = answerInPlanPatch(plan, a && a.result, { today: state.env.today, payIn });
    if (!p.ok) { fail(planId, p.problem === 'notSaving' ? 'notSaving' : 'problems'); return; }
    const told = () => dispatch({ type: A.KEEP_USED, q, planId: String(planId), name: nameOf(plan), line: p.line });
    if (!Object.keys(p.patch).length) { told(); dispatch({ type: A.PLAN_SAVED, planId, previous: {}, line: p.line, op: 'saving' }); later(() => dispatch({ type: A.PLAN_TOAST_CLOSE })); return; }
    const data = declaredOnly({ ...p.patch, lastModified: now().toISOString() });
    if (lockedRefusal(plan, data)) { fail(planId, 'locked'); return; }
    if (!(await send(place, planId, data))) return;
    told();
    dispatch({ type: A.PLAN_SAVED, planId, previous: { ...p.previous, lastModified: plan.lastModified }, line: p.line, op: 'saving' });
    dispatch({ type: A.PLANS_READING });
    later(() => dispatch({ type: A.PLAN_TOAST_CLOSE }));
  }

  /** A spreadsheet chosen: its text read on the page (never sent anywhere) into the draft's import box, where the reading reads it. */
  async function readBudgetFile(planId, file) {
    let text = null;
    try { text = file && typeof file.text === 'function' && !(typeof file.size === 'number' && file.size > OPEN_FILE_MAX_BYTES) ? await file.text() : null; } catch { text = null; }
    if (stopped) return;
    dispatch({ type: A.PLAN_BUDGET_FILE_READ, planId, text: typeof text === 'string' ? text : null });
  }

  /** A copy of a plan with the split's settings (step 7's rule for a copy: never locked, nothing recorded, no document, record or archive). */
  function copyPlanOf(source, settings, name, at) {
    const out = JSON.parse(JSON.stringify(source));
    const { id, createdAt, lastModified, ...rest } = out; void id; void createdAt; void lastModified;
    rest.stressTool = { ...(rest.stressTool || {}), settings: withoutPotsAsOf(settings) };   // a new draft: no lock's position
    rest.planDetails = { ...(rest.planDetails || {}), name };
    rest.isActive = false;
    if (rest.decisionTool) {
      rest.decisionTool = { ...rest.decisionTool, settings: { ...(rest.decisionTool.settings || {}), locked: false }, history: [], taxYears: {} };
      delete rest.decisionTool.settings.lockedAt; delete rest.decisionTool.settings.lockedBy; delete rest.decisionTool.settings.unlockedAt; delete rest.decisionTool.settings.unlockCount;
      delete rest.decisionTool.planOfRecord; delete rest.decisionTool.planOfRecordArchive;
    }
    delete rest.planDocument; delete rest.planDocumentArchive; delete rest.journey;
    delete rest.household;
    const stamp = at.toISOString();
    return readyPlan({ ...rest, createdAt: stamp, lastModified: stamp }, at);
  }

  /** This window: TWO plans appended to pt_guest_scenarios with guest ids, linked to each other, written back as one setItem; every other plan byte-identical. */
  function createPairInWindow(pair) {
    if (!session) return { problem: 'storage' };
    let text = null;
    try { text = session.getItem(GUEST_PLANS_KEY); } catch { return { problem: 'storage' }; }
    let stored = [];
    if (text) { try { stored = JSON.parse(text); } catch { return { problem: 'storage' }; } }
    if (!Array.isArray(stored)) return { problem: 'storage' };
    const taken = new Set(stored.map((p) => (p && p.id != null ? String(p.id) : '')));
    const idA = guestPlanId(rand, taken); taken.add(idA);
    const idB = guestPlanId(rand, taken);
    const out = JSON.stringify([...stored, { ...pair[0], household: { partnerScenarioId: idB }, id: idA }, { ...pair[1], household: { partnerScenarioId: idA }, id: idB }]);
    try { session.setItem(GUEST_PLANS_KEY, out); if (session.getItem(GUEST_PLANS_KEY) !== out) return { problem: 'storage' }; } catch { return { problem: 'storage' }; }
    return { ids: { a: idA, b: idB } };
  }

  // ---- "Keep this as a plan" (road-to-7.md step 7): a NEW plan, in the account or in this window -----------------------

  const keepFail = (q, problem, name = null) => dispatch({ type: A.KEEP_FAILED, q, problem, ...(name ? { name } : {}) });

  /** Where a new plan goes, once the sign-in check and the plans are in: the account or this window; a problem; or null while not yet known. */
  function placeForNew(state) {
    const k = state.session.kind;
    if (k === 'unverified') return { problem: 'unverified' };
    if (k !== 'in' && k !== 'nobody') return null;
    const plans = state.plans;
    if (!plans) return null;
    if (plans.status === 'failed') return { problem: 'failed' };
    if (plans.status !== 'read') return null;
    const h = handles() || {};
    if (k === 'in') return h.user && h.db && plans.source === 'account' ? { kind: 'account', plans, db: h.db, uid: h.user.uid, reread: h.reread } : null;
    if (plans.source !== 'window') return null;
    if (isBlocked(readMinutes(local))) return { problem: 'usedUp' };
    return { kind: 'window', plans };
  }

  /** The place, as soon as it is known — or 'failed' after KEEP_WAIT_MS (the sign-in check never answered). */
  function whenPlaced() {
    return new Promise((resolve) => {
      const first = placeForNew(store.getState());
      if (first) { resolve(first); return; }
      let off = null;
      let t = null;
      const done = (v) => { if (off) off(); off = null; if (t && win) win.clearTimeout(t); resolve(v); };
      off = store.subscribe((state) => { if (stopped) { done({ problem: 'failed' }); return; } const p = placeForNew(state); if (p) done(p); });
      if (win && typeof win.setTimeout === 'function') t = win.setTimeout(() => done({ problem: 'failed' }), KEEP_WAIT_MS);
    });
  }

  /**
   * A plan document ready to be written: brought up to date by today's own upgrade, nothing Firestore refuses, never locked —
   * but for a copy made with its records (services/PlanCopy.js: locked 'copied with records', the planner's own rule), and a
   * plan brought in from this window as it was (`mayBeLocked`).
   */
  function readyPlan(plan, at, { mayBeLocked = false } = {}) {
    const u = upgradeScenario(plan, { now: at });
    if (u.error || u.newer || !u.scenario || typeof u.scenario !== 'object') throw new Error('planWrite: the plan would not upgrade');
    const p = u.scenario;
    if (!mayBeLocked && isLockedSettings(p.decisionTool && p.decisionTool.settings)) throw new Error('planWrite: a new plan is never locked');
    const problems = planProblems(p);
    if (problems.length) throw new Error('planWrite: ' + problems[0]);
    return p;
  }

  /** The ONE create: addDoc on users/{uid}/scenarios; the new document's id. */
  async function add(coll, plan) {
    const ref = await F.addDoc(coll, plan);
    if (!ref || typeof ref.id !== 'string' || !ref.id) throw new Error('planWrite: no id');
    return ref.id;
  }
  /** The account's plans, the one place the collection is named. */
  const scenariosOf = (place) => F.collection(place.db, 'users', place.uid, 'scenarios');

  /** This window: ONE plan appended to pt_guest_scenarios with a guest id, written back as one setItem; every other plan byte-identical. */
  function createOneInWindow(plan) {
    if (!session) return { problem: 'storage' };
    let text = null;
    try { text = session.getItem(GUEST_PLANS_KEY); } catch { return { problem: 'storage' }; }
    let stored = [];
    if (text) { try { stored = JSON.parse(text); } catch { return { problem: 'storage' }; } }
    if (!Array.isArray(stored)) return { problem: 'storage' };
    const taken = new Set(stored.map((p) => (p && p.id != null ? String(p.id) : '')));
    const id = guestPlanId(rand, taken);
    const out = JSON.stringify([...stored, { ...plan, id }]);
    try { session.setItem(GUEST_PLANS_KEY, out); if (session.getItem(GUEST_PLANS_KEY) !== out) return { problem: 'storage' }; } catch { return { problem: 'storage' }; }
    return { id };
  }

  /**
   * The account: the partner's plan first (a couple), then yours with the link; the partner's stays if yours fails. A partner's
   * plan an earlier try already made (`partner`: { id, name }) is linked to, never made again. `sent` marks a failure after a
   * create went out: the server may have made the plan though no answer came back (keep reads the account to see).
   */
  async function createInAccount(place, made, at, partner = null) {
    const coll = scenariosOf(place);
    let partnerId = partner ? partner.id : null;
    const partnerName = partner ? partner.name : made.names.partner;
    if (made.partner && !partner) {
      let ready;
      try { ready = readyPlan(made.partner, at); } catch { return { problem: 'failed' }; }
      try { partnerId = await add(coll, ready); } catch { return { problem: 'failed', sent: true }; }
      if (stopped) return { problem: 'failed', sent: true };
    }
    let yours;
    try { yours = readyPlan(partnerId ? withPartnerId(made.yours, partnerId) : made.yours, at); } catch { return partnerId ? { problem: 'partial', name: partnerName } : { problem: 'failed' }; }
    try {
      const id = await add(coll, yours);
      return { id, partnerId, partnerName: partnerId ? partnerName : null };
    } catch {
      return partnerId ? { problem: 'partial', name: partnerName, sent: true } : { problem: 'failed', sent: true };
    }
  }

  /**
   * The plans a keep made, found in the account by the stamp they were made with (their createdAt: one per keep, kept in the
   * draft until the plan is told as made) — yours, and a couple's partner's plan; null when there is none.
   */
  function keptAt(list, at) {
    if (!at) return null;
    const found = list.filter((p) => p && p.createdAt === at && p.fromAnswer && typeof p.fromAnswer === 'object');
    if (!found.length) return null;
    const partner = found.find((p) => p.fromAnswer.who === 'partner') || null;
    return { yours: found.find((p) => p !== partner) || null, partner };
  }

  /** This window: the new plan(s) appended to pt_guest_scenarios, written back as one setItem; every other plan byte-identical. */
  function createInWindow(made, at) {
    if (!session) return { problem: 'storage' };
    let text = null;
    try { text = session.getItem(GUEST_PLANS_KEY); } catch { return { problem: 'storage' }; }
    let stored = [];
    if (text) { try { stored = JSON.parse(text); } catch { return { problem: 'storage' }; } }
    if (!Array.isArray(stored)) return { problem: 'storage' };
    const taken = new Set(stored.map((p) => (p && p.id != null ? String(p.id) : '')));
    const next = stored.slice();
    let partnerId = null;
    let yours;
    try {
      if (made.partner) { partnerId = guestPlanId(rand, taken); taken.add(partnerId); next.push({ ...readyPlan(made.partner, at), id: partnerId }); }
      yours = readyPlan(partnerId ? withPartnerId(made.yours, partnerId) : made.yours, at);
    } catch { return { problem: 'failed' }; }
    const id = guestPlanId(rand, taken);
    next.push({ ...yours, id });
    const out = JSON.stringify(next);
    try { session.setItem(GUEST_PLANS_KEY, out); if (session.getItem(GUEST_PLANS_KEY) !== out) return { problem: 'storage' }; } catch { return { problem: 'storage' }; }
    return { id, partnerId };
  }

  /** The same figures, whatever order their keys came back in (a stored map's keys are not kept in order). */
  function sameFigures(a, b) {
    const canon = (v) => (Array.isArray(v) ? v.map(canon) : v && typeof v === 'object' ? Object.fromEntries(Object.keys(v).sort().map((k) => [k, canon(v[k])])) : v);
    try { return JSON.stringify(canon(a)) === JSON.stringify(canon(b)); } catch { return false; }
  }

  /** The account read again; its plans as stored, or null when they could not be read. */
  async function accountNow(place) {
    try { await place.reread(); } catch { /* told by the plans' status */ }
    if (stopped) return null;
    const p = placeForNew(store.getState());
    return p && !p.problem && p.kind === 'account' ? p : null;
  }

  async function keep(q) {
    const k0 = store.getState().keep && store.getState().keep[q];
    if (!k0 || !k0.saving) return;
    const v0 = keepView(store.getState(), q);
    if (!v0.can || !v0.check.ok) { keepFail(q, 'notReady'); return; }
    // an earlier create from this answer that went out with no answer back (its stamp, kept until the plan is told as made):
    // only the account as stored can say whether it made the plan, so while it cannot be read nothing is made, and that is said
    const pending = k0.pending || null;
    const unread = (problem) => (problem === 'failed' && pending ? 'unsure' : problem);
    let place = await whenPlaced();
    if (stopped) return;
    const h0 = handles() || {};
    // signed in with the plans unread (the line was down when they were read): the account as stored is read once more
    const unreadAccount = place.problem === 'failed' && store.getState().session.kind === 'in' && typeof h0.reread === 'function';
    if (place.problem && !unreadAccount) { keepFail(q, unread(place.problem)); return; }
    if (unreadAccount || place.kind === 'account') {
      // the account as stored, read just before the create: the names taken, whether this is the first plan, and that plan
      try { await (unreadAccount ? h0.reread() : place.reread()); } catch { /* the read failed: the copy in memory is the best there is */ }
      if (stopped) return;
      place = placeForNew(store.getState()) || place;
      if (place.problem) { keepFail(q, unread(place.problem)); return; }
    }
    const state = store.getState();
    const view = keepView(state, q);
    if (!view.can || !view.check.ok) { keepFail(q, 'notReady'); return; }
    const plans = place.plans.list.map((e) => e.plan);
    const before = place.kind === 'account' ? keptAt(plans, pending) : null;
    // ONE stamp for all of a keep's creates: a couple's partner plan an earlier try made is joined by yours under the same
    // stamp, so a later try (or the read after a lost answer) finds both, and never makes the partner's plan again
    const at = before && before.partner && !before.yours ? new Date(pending) : now();
    let made, seed;
    try {
      // B: the pay-in the person chose to keep — as now, or what would be on course (saving-enough-and-check-in.md 3.6)
      const k = state.keep && state.keep[q];
      seed = buildPlanSeed({
        source: q, result: state.answers[q].result, env: state.env, name: { suggested: view.suggested, chosen: view.check.name },
        budget: state.budget || null, spendHow: (state.draft[q] && state.draft[q].spendHow) || null, createdAt: at.toISOString(),
        payIn: k && k.payIn === 'enough' && view.payIn ? 'enough' : 'now'
      });
      // this window holds three plans of its own at most (the example not counted); a couple needs room for two
      if (place.kind === 'window' && guestOwnPlans(plans).length + (seed.household === 'couple' ? 2 : 1) > GUEST_MAX_PLANS) { keepFail(q, 'full'); return; }
      // B opened from a plan that carries the person's fact of money taken flexibly: the plan kept carries it too
      const fa = q === 'b' && state.draft.b ? state.draft.b.flexibleAccess || null : null;
      // a couple's partner plan an earlier try made is linked to, so it is not counted as a plan already there
      const others = before && before.partner ? plans.filter((p) => p !== before.partner) : plans;
      made = plansFromSeed(seed, { now: at, takenNames: plans.map(nameOf).filter(Boolean), first: others.length === 0, flexibleAccess: fa });
    } catch {
      keepFail(q, 'notReady');
      return;
    }
    // "Am I saving enough?": the plan made for whoever is still saving, whose "What you pay in" the panel opens first (4.3)
    const saving = q === 'b' ? stillSavingOf(seed) : null;
    const told = (yours, partner, where) => {
      const saverId = saving === 'yours' ? String(yours.id) : saving === 'partner' && partner ? String(partner.id) : null;
      dispatch({ type: A.KEEP_MADE, q, id: String(yours.id), name: yours.name, where, partnerId: partner ? String(partner.id) : null, partnerName: partner ? partner.name : null, separate: view.separate === true, ...(saverId ? { saverId } : {}), ...(yours.earlier ? { earlier: true } : {}) });
      dispatch({ type: A.PLANS_READING });
    };
    const named = (p) => (p ? { id: p.id, name: nameOf(p) } : null);
    // the plan an earlier try made is the plan kept: told as made, never made again — and, when the figures on screen are no
    // longer the ones it was made from, told so (a keep of these is another press, under "Keep as another new plan")
    if (before && before.yours) {
      const was = before.yours.fromAnswer && before.yours.fromAnswer.inputs;
      told({ ...named(before.yours), earlier: !sameFigures(was, seed.inputs) }, named(before.partner), 'account');
      return;
    }
    // the stamp goes into the draft before the create goes out: a reload or a retry after a lost answer finds what it made
    if (place.kind === 'account') dispatch({ type: A.KEEP_SENDING, q, at: at.toISOString() });
    const done = place.kind === 'account' ? await createInAccount(place, made, at, named(before && before.partner)) : createInWindow(made, at);
    if (stopped) return;
    if (done.problem && done.sent) {
      // the create went out and no answer came back: the account as stored says whether the plan was made — only "Nothing was
      // kept" when it was not, and only "could not tell" (with a retry that cannot make a second) when it cannot be read
      const after = await accountNow(place);
      if (stopped) return;
      if (!after) { keepFail(q, 'unsure'); return; }
      const found = keptAt(after.plans.list.map((e) => e.plan), at.toISOString());
      if (found && found.yours) { told(named(found.yours), named(found.partner), 'account'); return; }
      if (found && found.partner) { keepFail(q, 'partial', nameOf(found.partner)); return; }
    }
    if (done.problem) { keepFail(q, done.problem, done.name || null); return; }
    told({ id: done.id, name: made.names.yours }, done.partnerId ? { id: done.partnerId, name: done.partnerName || made.names.partner } : null, place.kind);
  }

  // ---- "Your plans": the plan menu (research/v7/road-to-7.md step 11) ------------------------------------------------------

  const planNames = (state, but = null) => state.plans.list.map((e) => e.plan).filter((p) => but === null || String(p.id) !== String(but)).map(nameOf).filter(Boolean);
  const finished = (planId, op, slots, extra = {}) => { dispatch({ type: A.PLAN_ACTION_DONE, planId, op, slots, ...extra }); dispatch({ type: A.PLANS_READING }); later(() => dispatch({ type: A.PLAN_TOAST_CLOSE })); };

  /** Rename (the planner's renameScenario): ONE write of planDetails.name, made unique against the account's other names, plus the stamp. The name is outside the lock. */
  async function rename(planId, name) {
    const got = await placed(planId);
    if (!got) return;
    const { place, plan, state } = got;
    const unique = uniqueName(name, planNames(state, planId));
    if (unique === nameOf(plan)) { finished(planId, 'renamed', { name: unique }); return; }
    const data = declaredOnly({ 'planDetails.name': unique, lastModified: now().toISOString() });
    if (lockedRefusal(plan, data)) { fail(planId, 'locked'); return; }
    if (!(await send(place, planId, data))) return;
    finished(planId, 'renamed', { name: unique });
  }

  /** Make a copy (the planner's duplicateScenario, lifted: services/PlanCopy.js), as it is or with its records (then locked), through the ONE create. */
  async function makeCopy(planId, carry) {
    const got = await placed(planId, { allowExample: true });
    if (!got) return;
    const { place, plan, state } = got;
    if (place.kind === 'account' && state.session.kind !== 'in') { fail(planId, 'unverified'); return; }
    const plans = state.plans.list.map((e) => e.plan);
    if (place.kind === 'window' && guestOwnPlans(plans).length + 1 > GUEST_MAX_PLANS) { fail(planId, 'full'); return; }
    const at = now();
    let made;
    let name;
    let locked = false;
    try {
      name = uniqueName((nameOf(plan) || 'Plan') + ' (copy)', planNames(state));
      const stamp = at.toISOString();
      const copy = readyPlan({ ...copyOf(plan, name, { carryHistory: carry === true, now: at }), createdAt: stamp, lastModified: stamp }, at, { mayBeLocked: true });
      locked = isLockedSettings(copy.decisionTool && copy.decisionTool.settings);
      made = copy;
    } catch { fail(planId, 'failed'); return; }
    let id;
    if (place.kind === 'account') {
      try { id = await add(scenariosOf(place), made); } catch { fail(planId, 'failed'); return; }
    } else {
      const r = createOneInWindow(made);
      if (r.problem) { fail(planId, r.problem); return; }
      id = r.id;
    }
    if (stopped) return;
    finished(planId, locked ? 'copiedLocked' : 'copied', { name, id });
  }

  /**
   * The new plan an earlier "Move to a new plan" on this plan made, from the same month and for the same reason, whose close
   * then failed: it names this plan as the one before it, the plan itself is still open (a close happens once, and names
   * its new plan), and nothing has been changed in it since it was made. null when there is none.
   */
  function successorMadeFor(plans, planId, month, reason) {
    return plans.find((p) => p && String(p.previousPlanId) === String(planId) && p.before && p.before.from === month
      && (p.before.kind === 'working') === (reason === 'working') && typeof p.createdAt === 'string' && p.lastModified === p.createdAt) || null;
  }

  /**
   * Move to a new plan (the module note): the new plan through the ONE create, then the close, then the partner's link. A try
   * whose answers were lost is carried on with, never repeated: a new plan made for this very move (found by its stamp after a
   * lost create, or as the plan an earlier try made) is the new plan; a close that landed though its answer was lost is seen
   * in the account read again, and a retry of a move whose close landed does what was left — the partner's link and the main
   * plan. In this window the plans are taken as stored, which hold a plan made before the list on the page was read again.
   */
  async function closePlan(planId, s) {
    const got = await placed(planId);
    if (!got) return;
    const { place, plan, state } = got;
    if (place.kind === 'account' && state.session.kind !== 'in') { fail(planId, 'unverified'); return; }
    const plans = state.plans.list.map((e) => e.plan);
    const pool = place.kind === 'window' ? (storedWindowList() || plans) : plans;
    const reason = s.reason === 'working' ? 'working' : 'plan';
    // the new plan an earlier try made for this very move, when its close then failed (or its answer was lost): carried on
    // with, never made again
    const earlier = successorMadeFor(pool, planId, s.month, reason);
    // that try's close landed: this plan is closed onto it — what was left is done now, and nothing is made
    if (earlier && plan.closedAt && String(plan.nextPlanId) === String(earlier.id)) {
      await afterMove(place, plan, planId, { id: String(earlier.id), name: nameOf(earlier), partner: s.partner === true ? linkedPartnerOf(plan, pool) : null, reason, month: s.month });
      return;
    }
    if (!earlier && place.kind === 'window' && guestOwnPlans(pool).length + 1 > GUEST_MAX_PLANS) { fail(planId, 'full'); return; }
    const at = now();
    let q = null;
    try { q = closeQuestionOf(plan, { now: at, plans }); } catch { q = null; }
    if (!q || !q.choices.includes(s.month)) { fail(planId, 'notClosable'); return; }
    // the pots the box sent (always asked, filled in from closePotsOf); none sent reads as the box left as filled in
    if (s.pots && !Number.isFinite(s.pots.pension)) { fail(planId, 'noPots'); return; }
    // the close the guard is asked about before anything is made (its id stands in for the new plan's)
    if (lockedRefusal(plan, closeWrite(plan, { month: s.month, nextPlanId: planId + '-next', now: at }))) { fail(planId, 'locked'); return; }
    const keepPartner = !!(q.partner && s.partner === true);
    // going back to work: the second stop as typed — a month in words or numbers, else a whole age — checked against the plan
    let stop = null;
    if (reason === 'working') {
      if (!q.working) { fail(planId, 'noAge'); return; }
      const said = s.stop || {};
      const pm = said.month ? parseMonth(said.month) : null;
      if (said.month && !pm) { fail(planId, 'stopMonth'); return; }
      stop = pm ? { month: pm.y + '-' + String(pm.m).padStart(2, '0') } : { age: said.age && /^\d{1,3}$/.test(String(said.age).trim()) ? +said.age : said.age || null };
      const w = workingStopOf(plan, { month: s.month, stop, now: at });
      if (!w.ok) { fail(planId, { noStop: 'stopNone', notAMonth: 'stopMonth', notAnAge: 'stopAge', stopTooSoon: 'stopSoon', stopAgeTooSoon: 'stopAgeSoon', stopTooLate: 'stopLate', noAge: 'noAge' }[w.problem] || 'failed'); return; }
    }
    let made, name;
    let id = earlier ? String(earlier.id) : null;
    if (earlier) name = nameOf(earlier);
    else {
      const stamp = at.toISOString();
      try {
        name = uniqueName((s.name || '').trim() || successorName(plan, s.month, reason), planNames(state));
        made = readyPlan({ ...successorOf(plan, { month: s.month, name, now: at, pots: s.pots || null, keepPartner, reason, stop, plans }), createdAt: stamp, lastModified: stamp }, at);
      } catch { fail(planId, 'failed'); return; }
      if (place.kind === 'account') {
        try { id = await add(scenariosOf(place), made); } catch {
          // the create may have landed with its answer lost: the account read again says — the plan this move made, by its stamp
          const after = await plansNow(place);
          if (stopped) return;
          const found = after ? successorMadeFor(after.filter((p) => p.createdAt === stamp), planId, s.month, reason) : null;
          if (!found) { fail(planId, 'failed'); return; }
          id = String(found.id);
        }
      } else {
        const r = createOneInWindow(made);
        if (r.problem) { fail(planId, r.problem); return; }
        id = r.id;
      }
    }
    if (stopped) return;
    const data = declaredOnly({ ...closeWrite(plan, { month: s.month, nextPlanId: id, now: at, reason }), lastModified: at.toISOString() });
    if (lockedRefusal(plan, data)) { fail(planId, 'locked'); return; }
    let closed = false;
    try { closed = await write(place, planId, data); } catch { closed = false; }
    if (stopped) return;
    if (!closed && place.kind === 'account') {
      // the close may have landed with its answer lost: the account read again says whether this plan is closed onto the new one
      const after = await plansNow(place);
      if (stopped) return;
      const old = after ? after.find((p) => String(p.id) === String(planId)) : null;
      closed = !!(old && old.closedAt && String(old.nextPlanId) === String(id));
    }
    // the new plan is made but this one could not be closed: said so, by name; trying again carries on with that plan. The
    // plans are read again, so the list shows the plan made.
    if (!closed) { fail(planId, 'madeNotClosed', name); dispatch({ type: A.PLANS_READING }); return; }
    await afterMove(place, plan, planId, { id, name, partner: keepPartner ? plans.find((p) => String(p.id) === q.partner.id) || null : null, reason, month: s.month, at });
  }

  /** The account read again: its plans as stored, or null when they could not be read. */
  async function plansNow(place) {
    try { await place.reread(); } catch { /* told by the plans' status */ }
    if (stopped) return null;
    const st = store.getState();
    return st.plans && st.plans.status === 'read' && Array.isArray(st.plans.list) ? st.plans.list.map((e) => e.plan) : null;
  }

  /** A move's close done: the partner's link moved to the new plan, the main plan moved with it, then said. */
  async function afterMove(place, plan, planId, { id, name, partner, reason, month, at = now() }) {
    const pw = partner ? partnerWrites(partner, { oldId: plan.id, newId: id }) : null;
    if (pw) {
      const pp = placeOf(store.getState(), partner.id, { allowExample: true });
      const d2 = declaredOnly({ ...pw, lastModified: at.toISOString() });
      if (!pp.problem && !lockedRefusal(partner, d2)) await send(pp, partner.id, d2);
    }
    if (stopped) return;
    // the closed plan was the main plan: the plan that carries it on is now (the planner's close opens it, which makes it so)
    if (plan.isActive === true && !(await moveMainTo(place, store.getState(), id, planId))) return;
    if (stopped) return;
    finished(planId, reason === 'working' ? 'closedWorking' : 'closed', { name, id, old: nameOf(plan), month: monthWordsOf(month) });
  }

  /**
   * The main plan moved to `planId`: the old main plan's flag off, this one's on — two writes of `isActive` alone on an
   * account, one setItem in this window (every other plan byte-identical). `failId` is the plan whose action is being saved
   * (a refusal is said on its row). True when done.
   */
  async function moveMainTo(place, state, planId, failId = planId) {
    const olds = state.plans.list.map((e) => e.plan).filter((p) => p.isActive === true && String(p.id) !== String(planId));
    // the two patches, declared once for both places; the guard on every plan touched (the flag is outside the lock, so it passes)
    const on = declaredOnly({ isActive: true });
    const off = declaredOnly({ isActive: false });
    for (const o of olds) if (lockedRefusal(o, off)) { fail(failId, 'locked'); return false; }
    if (place.kind === 'account') {
      for (const o of olds) {
        const op = placeOf(state, o.id, { allowExample: true });
        if (op.problem) { fail(failId, op.problem); return false; }
        if (!(await send(op, o.id, off))) return false;
      }
      if (!(await send(place, planId, on))) return false;
    } else {
      let text = null;
      try { text = session ? session.getItem(GUEST_PLANS_KEY) : null; } catch { fail(failId, 'storage'); return false; }
      let list = null;
      try { list = JSON.parse(text); } catch { list = null; }
      if (!Array.isArray(list)) { fail(failId, 'storage'); return false; }
      const next = list.map((p) => (p && String(p.id) === String(planId) ? applyPatch(p, on) : p && p.isActive === true ? applyPatch(p, off) : p));
      const out = JSON.stringify(next);
      try { session.setItem(GUEST_PLANS_KEY, out); if (session.getItem(GUEST_PLANS_KEY) !== out) { fail(failId, 'storage'); return false; } } catch { fail(failId, 'storage'); return false; }
    }
    return true;
  }

  /** Make this my main plan (the planner's setActiveScenarioDoc): moveMainTo, after the guard on this plan. */
  async function makeMain(planId) {
    const got = await placed(planId);
    if (!got) return;
    const { place, plan, state } = got;
    const olds = state.plans.list.map((e) => e.plan).filter((p) => p.isActive === true && String(p.id) !== String(planId));
    if (plan.isActive === true && !olds.length) { finished(planId, 'main', { name: nameOf(plan) }); return; }
    if (lockedRefusal(plan, declaredOnly({ isActive: true }))) { fail(planId, 'locked'); return; }
    if (!(await moveMainTo(place, state, planId))) return;
    if (stopped) return;
    finished(planId, 'main', { name: nameOf(plan) });
  }

  /**
   * Delete (the planner's deleteScenario): never the last plan; if the plan was the main one another becomes main first (one
   * write of `isActive`); then the ONE deleteDoc of users/{uid}/scenarios/{id} — or, in this window, the list without it, one
   * setItem. Only after the confirm(s) on screen (the reducer: plan/delete, or plans/deleteSeveral). Never undone.
   * { ok: true, name, example } or { problem, name, example }; nothing is said here (remove and removeSeveral say it).
   * `gone`: the plans a "Delete several" has deleted already, which this window's list in page memory still holds until it is
   * read again; `ticked`: every plan that "Delete several" is deleting, none of which takes over as the main plan. In this
   * window the plans are taken as stored (an earlier delete may have made one of them the main plan since they were read).
   */
  async function removeOne(planId, { gone = new Set(), ticked = new Set() } = {}) {
    let state = store.getState();
    const nameIn = (st) => { const e = st.plans && Array.isArray(st.plans.list) ? st.plans.list.find((x) => x && x.plan && String(x.plan.id) === String(planId)) : null; return e ? nameOf(e.plan) : ''; };
    const exampleIn = (st) => { const e = st.plans && Array.isArray(st.plans.list) ? st.plans.list.find((x) => x && x.plan && String(x.plan.id) === String(planId)) : null; return !!(e && isExamplePlan(e.plan)); };
    let place = placeOf(state, planId, { allowExample: true });
    if (place.problem) return { problem: place.problem, name: nameIn(state), example: exampleIn(state) };
    if (place.kind === 'account') {
      // the plans as stored, read just before the delete: the last plan is seen as the last, a main plan as the main one
      try { await place.reread(); } catch { /* the read failed: the copy in memory is the best there is */ }
      if (stopped) return { problem: 'failed', name: '' };
      state = store.getState();
      place = placeOf(state, planId, { allowExample: true });
      if (place.problem) return { problem: place.problem, name: nameIn(state), example: exampleIn(state) };
    }
    // this window: the list as stored is the one the delete writes back, and the one that says which plan is main now
    const stored = place.kind === 'window' ? storedWindowList() : null;
    if (place.kind === 'window' && !stored) return { problem: 'storage', name: nameIn(state), example: exampleIn(state) };
    const pool = stored || state.plans.list.map((e) => e.plan);
    const plan = (stored && stored.find((p) => p && String(p.id) === String(planId))) || place.entry.plan;
    const name = nameOf(plan);
    const example = isExamplePlan(plan);
    const others = pool.filter((p) => p && String(p.id) !== String(planId) && !gone.has(String(p.id)));
    if (!others.length) return { problem: 'lastPlan', name, example };
    // the planner takes the first other plan; here the first that is not the example, when there is one — and never a plan
    // that is itself being deleted, while one that stays is there
    const staying = others.filter((p) => !ticked.has(String(p.id)));
    const from = staying.length ? staying : others;
    const heir = plan.isActive === true ? (from.find((p) => !isExamplePlan(p)) || from[0]) : null;
    // the heir's patch, declared once for both places; the guard on the heir (the flag is outside the lock, so it passes)
    const on = declaredOnly({ isActive: true });
    if (heir && lockedRefusal(heir, on)) return { problem: 'locked', name, example };
    if (place.kind === 'account') {
      if (heir) {
        const hp = placeOf(state, heir.id, { allowExample: true });
        if (hp.problem) return { problem: hp.problem, name };
        let ok = false;
        try { ok = await write(hp, heir.id, on); } catch { ok = false; }
        if (!ok) return { problem: 'failed', name, example };
      }
      try { await F.deleteDoc(F.doc(place.db, 'users', place.uid, 'scenarios', String(planId))); } catch { return { problem: 'failed', name, example }; }
    } else {
      const next = stored.filter((p) => !(p && String(p.id) === String(planId))).map((p) => (heir && p && String(p.id) === String(heir.id) ? applyPatch(p, on) : p));
      const out = JSON.stringify(next);
      try { session.setItem(GUEST_PLANS_KEY, out); if (session.getItem(GUEST_PLANS_KEY) !== out) return { problem: 'storage', name, example }; } catch { return { problem: 'storage', name, example }; }
    }
    return { ok: true, name, example };
  }

  /** This window's plans as stored (pt_guest_scenarios), or null when they cannot be read as a list. */
  function storedWindowList() {
    let text = null;
    try { text = session ? session.getItem(GUEST_PLANS_KEY) : null; } catch { return null; }
    let list = null;
    try { list = JSON.parse(text); } catch { list = null; }
    return Array.isArray(list) ? list : null;
  }

  /** Delete one plan (the row's confirm): removeOne, then said. */
  async function remove(planId) {
    const r = await removeOne(planId);
    if (stopped) return;
    if (!r.ok) { fail(planId, r.problem); return; }
    finished(planId, 'deleted', { name: r.name });
  }

  /**
   * "Delete several" (6.59.0): the plans ticked, after ONE confirm that names each — each through the same delete, with its
   * own refusals (never the last plan; a main plan's heir past the guard), one after another; a plan refused is named with
   * why and the rest go on; nothing not ticked is touched. Then what was deleted and what was not, and the plans read again.
   */
  async function removeSeveral(planIds) {
    const deleted = [];
    const refused = [];
    const gone = new Set();
    const ids = Array.isArray(planIds) ? planIds.map(String) : [];
    const ticked = new Set(ids);
    for (const planId of ids) {
      const r = await removeOne(planId, { gone, ticked });
      if (stopped) return;
      const said = { id: planId, name: r.name || '', ...(r.example ? { example: true } : {}) };
      if (r.ok) { deleted.push(said); gone.add(planId); } else refused.push({ ...said, problem: r.problem });
    }
    dispatch({ type: A.PLANS_SEVERAL_DONE, deleted, refused });
    dispatch({ type: A.PLANS_READING });
  }

  /**
   * Open a downloaded copy: a file too big to be a plan refused before it is read (OPEN_FILE_MAX_BYTES); the file's text parsed,
   * identity stripped (never its id, uid, example or isActive; nor the ids of other plans it names — the partner link and a
   * shared budget's source — which are the file's, not this account's), brought up to date by today's own upgrade and checked
   * (planProblems); made a plan of its own by the copy's rules (services/PlanCopy.js, the records carried), named "{name}
   * (opened)" made unique, never the main plan; through the ONE create. Any problem is said in words and nothing is written.
   */
  async function openFile(file) {
    const bad = (problem, detail = null) => fail(null, problem, detail);
    if (!file || typeof file.text !== 'function') { bad('badFile'); return; }
    if (typeof file.size === 'number' && file.size > OPEN_FILE_MAX_BYTES) { bad('fileTooBig'); return; }
    let text = null;
    try { text = await file.text(); } catch { text = null; }
    if (stopped) return;
    if (typeof text !== 'string') { bad('badFile'); return; }
    let raw = null;
    try { raw = JSON.parse(text); } catch { raw = null; }
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) { bad('badFile'); return; }
    let place = await whenPlaced();
    if (stopped) return;
    if (place.problem) { bad(place.problem); return; }
    if (place.kind === 'account') {
      try { await place.reread(); } catch { /* the copy in memory is the best there is */ }
      if (stopped) return;
      place = placeForNew(store.getState()) || place;
      if (place.problem) { bad(place.problem); return; }
    }
    const state = store.getState();
    const plans = place.plans.list.map((e) => e.plan);
    if (place.kind === 'window' && guestOwnPlans(plans).length + 1 > GUEST_MAX_PLANS) { bad('full'); return; }
    const at = now();
    let made;
    let name;
    try {
      const { id, uid, example, isActive, ...rest } = stripIdentity(raw);
      void id; void uid; void example; void isActive;
      // the file's links to other plans are not this account's: the opened copy stands alone until it is linked here
      if (rest.household && typeof rest.household === 'object') { const { partnerScenarioId, ...household } = rest.household; void partnerScenarioId; rest.household = household; }
      if (rest.budgetTool && typeof rest.budgetTool === 'object') { const { sharedFrom, ...budgetTool } = rest.budgetTool; void sharedFrom; rest.budgetTool = budgetTool; }
      const u = upgradeScenario(rest, { now: at });
      if (u.error || !u.scenario || typeof u.scenario !== 'object') { bad('badFile'); return; }
      if (u.newer) { bad('fileProblems', 'the file was made by a newer version of this page'); return; }
      const problems = planProblems(u.scenario);
      if (problems.length) { bad('fileProblems', problems[0]); return; }
      name = uniqueName((nameOf(u.scenario) || 'Plan') + OPENED_SUFFIX, plans.map(nameOf).filter(Boolean));
      const stamp = at.toISOString();
      made = readyPlan({ ...copyOf(u.scenario, name, { carryHistory: true, now: at }), createdAt: stamp, lastModified: stamp }, at, { mayBeLocked: true });
    } catch (e) { bad('fileProblems', e && e.message ? String(e.message).replace(/^planWrite: /, '') : null); return; }
    void state;
    let id;
    if (place.kind === 'account') {
      try { id = await add(scenariosOf(place), made); } catch { bad('failed'); return; }
    } else {
      const r = createOneInWindow(made);
      if (r.problem) { bad(r.problem); return; }
      id = r.id;
    }
    if (stopped) return;
    finished(id, 'opened', { name, id });
  }

  /**
   * "Look around an example" (the planner's startGuest with a demo key): the planner's DEMO_PLANS['1m'] made through the planner's
   * own default plan (services/PlanFromSeed.js getDefaultScenario) with the demo's settings laid over — in this window flagged
   * `example: true` (read-only from then on: placeOf; not counted in the three: GuestPlans.guestOwnPlans), or, signed in, an
   * ordinary plan of the person's own, as the planner does. A window that holds the example already just opens it.
   */
  async function makeExample() {
    const demo = DEMO_PLANS[EXAMPLE_PLAN_KEY];
    let place = await whenPlaced();
    if (stopped) return;
    if (place.problem) {
      fail(null, place.problem);
      // 7.5.0: the stop that explains used-up free time is drawn on the plan pages only (select.js METERED_SCREENS), so a
      // visitor who asked for the example from the front door is taken to "Your plans", where it says why and how to go on
      if (place.problem === 'usedUp') { const r = store.getState().route; if (!r || (r.screen !== 'plans' && r.screen !== 'plan')) dispatch({ type: A.ROUTE_SET, route: parse(href.plans()) }); }
      return;
    }
    if (place.kind === 'account') {
      try { await place.reread(); } catch { /* the copy in memory is the best there is */ }
      if (stopped) return;
      place = placeForNew(store.getState()) || place;
      if (place.problem) { fail(null, place.problem); return; }
    }
    const plans = place.plans.list.map((e) => e.plan);
    const have = place.kind === 'window' ? plans.find((p) => isExamplePlan(p) && nameOf(p) === demo.name) : null;
    if (have) { dispatch({ type: A.PLAN_ACTION_DONE, planId: String(have.id), op: 'example', slots: { name: demo.name } }); dispatch({ type: A.ROUTE_SET, route: parse(href.plan(String(have.id))) }); return; }
    const at = now();
    let made;
    let name;
    try {
      name = place.kind === 'window' ? demo.name : uniqueName(demo.name, plans.map(nameOf).filter(Boolean));
      const base = getDefaultScenario(name, place.kind === 'window' ? EXAMPLE_PLAN_DESCRIPTION : '', ['stress', 'decision'], at.toISOString());
      base.stressTool.settings = { ...base.stressTool.settings, ...demo.stress };
      const stamp = at.toISOString();
      made = readyPlan({ ...base, isActive: plans.length === 0, createdAt: stamp, lastModified: stamp }, at);
      if (place.kind === 'window') made = { ...made, example: true };
    } catch { fail(null, 'failed'); return; }
    let id;
    if (place.kind === 'account') {
      try { id = await add(scenariosOf(place), made); } catch { fail(null, 'failed'); return; }
    } else {
      const r = createOneInWindow(made);
      if (r.problem) { fail(null, r.problem); return; }
      id = r.id;
    }
    if (stopped) return;
    dispatch({ type: A.PLAN_ACTION_DONE, planId: id, op: 'example', slots: { name } });
    dispatch({ type: A.PLANS_READING });
    dispatch({ type: A.ROUTE_SET, route: parse(href.plan(id)) });
  }

  /**
   * "Bring in what you built without an account?" after a sign-in (the planner's importGuestHandoff): this window's plans of the
   * person's own (never the example: GuestMeter.handoffPayload), each through the ONE create as the planner's hand-off packages
   * them (ids, the flag and the stamps dropped, the names marked), `isActive` for the first only when the account has no plans;
   * then this window's list without them, one setItem. A plan that cannot be made stops the hand-over there; the rest stay here.
   * A couple made in this window is brought in as a couple: the plan that names its partner goes after the partner and is made
   * with the id the account gave it (as createInAccount makes a couple), so no plan in the account names a window id — the
   * planner's own hand-off leaves the window's ids in place. Two plans naming each other: the first made is re-pointed after,
   * one write of the link.
   */
  async function bringIn() {
    let place = await whenPlaced();
    if (stopped) return;
    if (place.problem) { fail(null, place.problem); return; }
    if (place.kind !== 'account') { fail(null, 'nobody'); return; }
    try { await place.reread(); } catch { /* the copy in memory is the best there is */ }
    if (stopped) return;
    place = placeForNew(store.getState()) || place;
    if (place.problem) { fail(null, place.problem); return; }
    let text = null;
    try { text = session ? session.getItem(GUEST_PLANS_KEY) : null; } catch { fail(null, 'storage'); return; }
    let list = null;
    try { list = JSON.parse(text); } catch { list = null; }
    if (!Array.isArray(list)) { fail(null, 'storage'); return; }
    const own = guestOwnPlans(list.filter((p) => p && typeof p === 'object' && p.id != null));
    if (!own.length) { fail(null, 'notHere'); return; }
    const at = now();
    const stamp = at.toISOString();
    const accountPlans = place.plans.list.map((e) => e.plan);
    const taken = accountPlans.map(nameOf).filter(Boolean);
    const payload = handoffPayload(own, stamp, WINDOW_SUFFIX).scenarios;   // payload[i] is own[i], packaged
    const oldIds = own.map((p) => String(p.id));
    const partnerOldId = (p) => (p && p.household && p.household.partnerScenarioId != null ? String(p.household.partnerScenarioId) : null);
    // the order: a plan whose partner is being brought in too comes after its partner (a pair naming each other: the first as it comes)
    const order = [];
    const left = oldIds.map((_, i) => i);
    while (left.length) {
      const k = left.findIndex((i) => { const pid = partnerOldId(own[i]); return !pid || !oldIds.includes(pid) || order.includes(oldIds.indexOf(pid)); });
      order.push(left.splice(k >= 0 ? k : 0, 1)[0]);
    }
    const newIdOf = new Map();          // the window's id → the id the account gave
    const unresolved = [];              // made while its partner was not yet in the account (a pair naming each other)
    const brought = [];
    for (const i of order) {
      let made;
      const pid = partnerOldId(payload[i]);
      try {
        const name = uniqueName(nameOf(payload[i]) || 'Plan', taken);
        taken.push(name);
        const linked = pid && newIdOf.has(pid) ? { ...payload[i], household: { ...payload[i].household, partnerScenarioId: newIdOf.get(pid) } } : payload[i];
        made = readyPlan({ ...linked, planDetails: { ...(linked.planDetails || {}), name }, isActive: accountPlans.length === 0 && i === 0, createdAt: stamp, lastModified: stamp }, at, { mayBeLocked: true });
      } catch { fail(null, 'failed'); return; }
      let id;
      try { id = await add(scenariosOf(place), made); } catch { fail(null, 'failed'); return; }
      if (stopped) return;
      newIdOf.set(oldIds[i], id);
      if (pid && oldIds.includes(pid) && !newIdOf.has(pid)) unresolved.push(i);
      brought.push(oldIds[i]);
    }
    // a pair naming each other: the one made first still names the window's id of the other — one write of the link, now both are here
    for (const i of unresolved) {
      const pid = partnerOldId(payload[i]);
      if (!newIdOf.has(pid)) continue;
      try { await write(place, newIdOf.get(oldIds[i]), declaredOnly({ 'household.partnerScenarioId': newIdOf.get(pid) })); } catch { /* both plans are in the account; the link can be made again on "Your household" */ }
      if (stopped) return;
    }
    // the window's list without the plans now in the account (the example stays), one setItem
    const next = list.filter((p) => !(p && brought.includes(String(p.id))));
    const out = JSON.stringify(next);
    try { session.setItem(GUEST_PLANS_KEY, out); } catch { /* the plans are in the account either way */ }
    if (stopped) return;
    // `moved`: each plan's id in this window and the id the account gave it, for the way back after a sign-in (effects/place.js)
    finished(null, 'brought', { n: brought.length, s: brought.length === 1 ? '' : 's' }, { moved: brought.map((old) => [old, newIdOf.get(old)]) });
  }

  // one keep at a time, each after the last; a keep that throws is told as 'failed' (the figures are still there)
  let keeps = Promise.resolve();
  const queueKeep = (q) => { keeps = keeps.then(() => keep(q)).catch(() => keepFail(q, 'failed')); };
  // a keep pressed before this file was loaded (it comes with the plan source): picked up now
  for (const [q, k] of Object.entries(store.getState().keep || {})) if (k && k.saving) queueKeep(q);
  // "Look around an example" pressed on the front door, before this file was loaded: picked up now
  { const s0 = store.getState().ui.saving; if (s0 && s0.kind === 'example') { busy = true; makeExample().catch(() => fail(null, 'failed')).finally(() => { busy = false; }); } }

  const off = store.subscribe((state, action) => {
    if (action.type === A.KEEP_SAVE) { const k = state.keep && state.keep[action.q]; if (k && k.saving) queueKeep(action.q); return; }
    if (busy) return;
    const s = state.ui.saving;
    if (!s) return;
    const run = (fn) => { busy = true; fn().catch(() => fail(s.planId, 'failed')).finally(() => { busy = false; }); };
    if (action.type === A.PLAN_SAVE && s.kind === 'save') run(() => save(s.planId));
    else if (action.type === A.PLAN_UNDO && s.kind === 'undo') run(() => undo(s.planId, s.previous, s.op || null, s.lockedAt || null, s.others || []));
    else if (action.type === A.PLAN_LOCK && s.kind === 'lock') run(() => lock(s.planId));
    else if (action.type === A.PLAN_UNLOCK && s.kind === 'unlock') run(() => unlock(s.planId));
    else if (action.type === A.PLAN_DOCUMENT && s.kind === 'document') run(() => newVersion(s.planId));
    else if (action.type === A.PLAN_MOVE_START && s.kind === 'moveStart') run(() => moveStart(s.planId, s.how || {}));
    else if (action.type === A.PLAN_WAY && s.kind === 'way') run(() => useWay(s.planId, s.way));
    else if (action.type === A.PLAN_MIX && s.kind === 'mix') run(() => useMix(s.planId, s.cell));
    else if (action.type === A.PLAN_TRY && s.kind === 'try') run(() => useTry(s.planId));
    else if (action.type === A.TRY_KEEP && s.kind === 'tryKeep') run(() => keepCopy(s.planId));
    else if (action.type === A.PLAN_LINK && s.kind === 'link') run(() => link(s.planId, s.partnerId));
    else if (action.type === A.PLAN_SPLIT && s.kind === 'split') run(() => useSplit(s.planId));
    else if (action.type === A.PLAN_DISMISS && s.kind === 'dismiss') run(() => dismiss(s.planId, s.dismiss !== false));
    else if (action.type === A.PLAN_BUDGET_SHARE && s.kind === 'budgetShare') run(() => shareBudget(s.planId, s.share !== false));
    else if (action.type === A.PLAN_HOLD && s.kind === 'hold') run(() => saveHold(s.planId, s.change));
    else if (action.type === A.PLAN_TICK && s.kind === 'tick') run(() => tick(s.planId, s.key, s.done !== false));
    // "I accept this risk" / "Withdraw this" (7.7.0)
    else if (action.type === A.PLAN_AMEND && s.kind === 'amend') run(() => amend(s.planId, s.op, s.amend || null, s.testId || null));
    // the budget on a saved plan (road-to-7.md step 11b)
    else if (action.type === A.PLAN_BUDGET && s.kind === 'budget') run(() => saveBudgetChange(s.planId, s.change));
    else if (action.type === A.PLAN_BUDGET_FILE && s.kind === 'budgetFile') run(() => readBudgetFile(s.planId, action.file));
    else if (action.type === A.PLAN_RECORD && s.kind === 'potRecord') run(() => recordPot(s.planId));
    else if (action.type === A.PLAN_STALE_LEAVE && s.kind === 'staleLeave') run(() => leaveStale(s.planId));
    // a saver's check-in (release step R3)
    else if (action.type === A.PLAN_CHECK_IN && s.kind === 'checkIn') run(() => checkIn(s.planId));
    else if ((action.type === A.PLAN_USE_CHECKIN && s.kind === 'useCheckIn') || (action.type === A.PLAN_RESTART_PATH && s.kind === 'restartPath')) run(() => fromCheckIn(s.planId, s.kind));
    // Month by month (7.2.0)
    else if ((action.type === A.PLAN_MONTH_RECORD && s.kind === 'month') || (action.type === A.PLAN_TAX_YEAR && s.kind === 'taxYear')) run(() => monthWrite(s.planId, s.kind));
    // "Use these in ‘…’" on question B's answer (6.59.0)
    else if (action.type === A.KEEP_USE && s.kind === 'useAnswer') run(() => useAnswer(s.planId, s.q, s.payIn));
    // the plan menu (road-to-7.md step 11)
    else if (action.type === A.PLAN_RENAME && s.kind === 'rename') run(() => rename(s.planId, s.name));
    else if (action.type === A.PLAN_COPY && s.kind === 'copy') run(() => makeCopy(s.planId, s.carry === true));
    else if (action.type === A.PLAN_MAIN && s.kind === 'main') run(() => makeMain(s.planId));
    else if (action.type === A.PLAN_DELETE && s.kind === 'delete') run(() => remove(s.planId));
    else if (action.type === A.PLANS_DELETE_SEVERAL && s.kind === 'deleteSeveral') run(() => removeSeveral(s.planIds));
    else if (action.type === A.PLAN_CLOSE && s.kind === 'close') run(() => closePlan(s.planId, s));
    else if (action.type === A.PLAN_OPEN_FILE && s.kind === 'open') run(() => openFile(action.file));
    else if (action.type === A.PLAN_EXAMPLE && s.kind === 'example') run(() => makeExample());
    else if (action.type === A.GUEST_BRING_IN && s.kind === 'bringIn') run(() => bringIn());
  });
  return () => { stopped = true; off(); if (timer && win) win.clearTimeout(timer); };
}
