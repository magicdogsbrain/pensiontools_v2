/**
 * A locked plan's start, in the planner (6.53.0, research/plan-start.md §4 "Migration of existing plans"). A locked plan's
 * Stress settings form is frozen, but the month work stopped is the person's own fact and changes no figure by itself: it
 * is asked once, on a line under the Timing block's summary that the freeze leaves live ("Leave it" remembered, and the
 * month still sayable there, folded), and once said it stays changeable there ("Change the month you stopped work"). Once
 * it is said, and its tax year is earlier than the plan's first, the line offers "Move the plan's start…": a confirm that
 * says exactly what changes, then ONE write under the lock (answers/plan/moveStart.js movePatch; the guard's
 * `reAnchor`) — the plan is never unlocked by it. The rules are services/PlanMove.js; the words src/ui/planStartUi.js.
 *
 *   installLockedStart(win, doc, deps)   the line's handlers, on `win` (the page's inline handlers call them by name):
 *                                        renderLockedStart, saveLockedStopMonth, leaveLockedStopMonth, moveLockedPlanStart
 *   fillPlanStart()                      the plan's first month, for the Monthly Entry's fill (MonthFill.planFillStart): a
 *                                        plan whose start is behind what is recorded reaches its lived months
 *   decisionPotsYear()                   the plan year the Decision tool's pot floors start from
 *   startLaterOfActive()                 the open plan stored with its start later than it should be (PlanMove.startLaterOf):
 *                                        the next-step banner's one thing to do, the move of its start (7.3.3)
 *
 * "Move to a new plan" and a closed plan's line (6.56.0) are src/ui/planCloseUi.js: installed with this, drawn with the line
 * (renderLockedStart draws both), and its helpers handed on to index.html from here, so the page keeps one import.
 *
 * index.html keeps one call for each (tests/v7/shellRatchet.test.js: its inline script may only get shorter).
 */
import { activePlanLocked, getActiveScenarioAsStored, saveActivePlanMove } from '../storage/ScenarioRepository.js';
import { saveStressSettings, getStressSettingsAsync } from '../storage/StressRepository.js';
import { getDecisionSettingsAsync, getAllTaxYearsAsync } from '../storage/DecisionRepository.js';
import { loadAllScenarios } from '../firebase/FirestoreService.js';
import { effectiveStressSettings } from '../services/PlanReading.js';
import { stopAskOf, stopLeftOf, moveOfferOf, moveBlockedOf, stopChangeOf, planMoveOf, moveAnchorOf, moveFactsOf, startLaterOf } from '../services/PlanMove.js';
import { cleanSteps } from '../services/IncomeSchedule.js';
import { lockedStopAnswer } from '../answers/plan/about.js';
import { stoppedWorkOf, monthName, decisionAnchorYear, deriveTiming } from '../services/PlanTiming.js';
import { runPositionOf } from '../services/PlanFromToday.js';
import { planFillStart } from '../services/MonthFill.js';
import { movedPlanOf, movePatch } from '../answers/plan/moveStart.js';
import { lockedStartHtml, moveStartQuestion, moveStartDoneWords, LOCKED_STOP_REFUSED } from './planStartUi.js';
import { installPlanClose, planReadDay, stressLockBannerHtml, successorNameOf, plansInListOrder, planListDesc, decisionLockBannerHtml, planDocumentMay, planDocumentEmptyHtml, paintPlanDocumentTools, planNoticeHtml, drawClosedTransition, taxYearTabsFor, householdPickerFor, closedTimingSummary } from './planCloseUi.js';
import { beforeOf, closedAtOf, isClosedPlan, partnerCandidates, BEFORE_KINDS } from '../services/PlanClosed.js';

export { planReadDay, stressLockBannerHtml, successorNameOf, plansInListOrder, planListDesc, decisionLockBannerHtml, planDocumentMay, planDocumentEmptyHtml, paintPlanDocumentTools, planNoticeHtml, drawClosedTransition, taxYearTabsFor, householdPickerFor, closedTimingSummary, partnerCandidates };

/** Is the plan's income in steps (the words then speak of its first step), or one yearly figure? */
const incomeInSteps = (s) => !!s && s.incomeShape === 'phases' && cleanSteps(s.incomeSteps).length > 0;

/**
 * The plan year the pots the Decision tool's floors start from belong to (legacyDecision `potsYear`): where the plan's pots
 * stand as the engines read them (PlanFromToday.runPositionOf) — year 0 for a plan locked in its year 0 or before, a later
 * year for one locked in it or whose start was moved back under its lock.
 */
export async function decisionPotsYear() {
  try { const ss = await getStressSettingsAsync(); return runPositionOf(ss, deriveTiming(ss)).elapsedYears; } catch (e) { return 0; }
}

/** The open plan, read as PlanMove.startLaterOf reads it (as stored): null for every plan with nothing to move or ask. */
export async function startLaterOfActive() {
  try { return startLaterOf(await getActiveScenarioAsStored(), new Date()); } catch (e) { return null; }
}

/**
 * The plan's first month the Monthly Entry's fill may reach back to: its first tax year's April, or the month work stopped
 * when later — and, on the plan that carries a closed one on (6.56.0), never before its first month: those are the
 * previous plan's.
 */
export async function fillPlanStart() {
  const ss = await getStressSettingsAsync();
  const start = planFillStart(decisionAnchorYear(await getDecisionSettingsAsync(), await getAllTaxYearsAsync(), null, ss), stoppedWorkOf(ss));
  const { floor } = await fillPlanBounds();
  return start && floor && start < floor ? floor : start;
}

/** The first and last months the open plan may record (monthFillEntry's planBounds; services/PlanClosed.js). */
export async function fillPlanBounds() {
  try {
    const sc = await getActiveScenarioAsStored();
    const b = beforeOf(sc);
    return { floor: b && BEFORE_KINDS.includes(b.kind) ? b.from : null, ceiling: closedAtOf(sc) };   // either reason: a new plan, or back to work
  } catch (e) { return { floor: null, ceiling: null }; }
}

/**
 * @param {Window} win
 * @param {Document} doc
 * @param {object} deps  what only the page has: loadStressSettings, loadDecisionSettings, updatePlanLockChip, showLoading,
 *   hideLoading, and the planner's own strategy run for a plan document (strategyResultForDocument, strategyPlanFor)
 */
export function installLockedStart(win, doc, deps) {
  const toast = (m, t, ms) => win.showToast(m, t, ms);
  installPlanClose(win, doc, { showLoading: deps.showLoading, hideLoading: deps.hideLoading });

  async function renderLockedStart() {
    const el = doc.getElementById('tmLockedStart'); if (!el) return;
    let html = '', asking = false;
    try {
      const sc = await getActiveScenarioAsStored(), now = new Date();
      // a closed plan's start is never moved, nor its stop month asked (its lock banner says it is closed): nothing here
      if (sc && !isClosedPlan(sc) && await activePlanLocked()) {
        const offer = sc ? moveOfferOf(sc, now) : null;
        const move = offer ? planMoveOf(sc, now) : null;
        const ask = !offer && !!sc && stopAskOf(sc, now), left = !offer && !ask && !!sc && stopLeftOf(sc, now);
        const ss = (sc && sc.stressTool && sc.stressTool.settings) || {};
        html = lockedStartHtml({ ask, offer, start: sc ? moveAnchorOf(ss, sc.decisionTool?.settings) : null, stepAge: move ? move.stress.shapeAgeNow : null,
          stepped: incomeInSteps(ss), income: +ss.baseSalary || null, blocked: sc && !offer ? moveBlockedOf(sc, now) : null, stopped: sc ? stopChangeOf(sc, now) : null, left });
        asking = ask || left;
      }
    } catch (e) { html = ''; asking = false; }
    el.innerHTML = html; el.style.display = html ? 'flex' : 'none';
    // while the line asks the month, the form's own box (frozen, and empty: the plan says no month) is hidden, so one box asks
    const frozen = doc.getElementById('tmStopWrap'); if (frozen) frozen.style.display = asking ? 'none' : 'flex';
    // the line beside the lock: "Move to a new plan", or a closed plan's (planCloseUi.js)
    if (typeof win.renderPlanClose === 'function') await win.renderPlanClose();
  }
  win.renderLockedStart = renderLockedStart;

  win.saveLockedStopMonth = async function () {
    // the rules of V7's own box (about.js lockedStopAnswer): a month this one or earlier, after the age of 16
    let age = null; try { age = deriveTiming(await getStressSettingsAsync()).currentAge; } catch (e) { age = null; }
    const a = lockedStopAnswer(doc.getElementById('tmLockedStopMonth')?.value || '', new Date(), age);
    if (a.error) { toast(LOCKED_STOP_REFUSED[a.error] || LOCKED_STOP_REFUSED.notAMonth, 'warning', 5000); return; }
    const v = a.value;
    try { await saveStressSettings({ stoppedWork: v }); }
    catch (e) { toast('Could not save the month: ' + e.message, 'error'); return; }
    await deps.loadStressSettings();   // the month box, the summary and the line under it, from what was saved
    toast('Saved: you stopped work in ' + monthName(v) + '.', 'success', 4000);
    if (typeof win.updateNextStepBanner === 'function') win.updateNextStepBanner();   // the to-do moves on from "say when" to the move
  };

  win.leaveLockedStopMonth = async function () {
    try { await saveStressSettings({ stopMonthLeft: true }); }
    catch (e) { toast('Could not save that choice: ' + e.message, 'error'); return; }
    await renderLockedStart();
    toast('Left as it is. You will not be asked again; you can still say it under “Say when you stopped work”.', 'success', 5000);
    if (typeof win.updateNextStepBanner === 'function') win.updateNextStepBanner();
  };

  win.moveLockedPlanStart = async function () {
    const now = new Date();
    let sc = null; try { sc = await getActiveScenarioAsStored(); } catch (e) { sc = null; }
    const mp = sc ? movedPlanOf(sc, { now }) : null;
    if (!mp) { await renderLockedStart(); toast('This plan\'s start cannot be moved: it is not locked, or it does not say a month you stopped work earlier than its first tax year.', 'info', 6000); return; }
    const m = mp.move, st = m.stress;
    // what the confirm states: the same facts the preview's confirm reads (PlanMove.moveFactsOf)
    const q = moveStartQuestion(m, moveFactsOf(sc, m));
    if (!(await win.appConfirm({ html: q.html }, { okLabel: q.okLabel, cancelLabel: q.cancelLabel, danger: false }))) return;
    deps.showLoading('Moving the plan\'s start and writing the plan document again…');
    let moved = false;
    try {
      // the run of the plan AS MOVED (its settings, read from where the lock's pots stood): the planner's own run
      const settings = effectiveStressSettings(mp.plan, { now });
      const r = await deps.strategyResultForDocument(settings);
      const p = deps.strategyPlanFor(settings, (win._shapeRefs && win._shapeRefs.essentials) || undefined);
      let entries = []; try { entries = (await loadAllScenarios()).map((plan) => ({ plan })); } catch (e) { entries = []; }
      const out = movePatch(sc, { now, run: { p, r }, entries });
      if (!out.ok) throw new Error('the move could not be worked out (' + (out.errors.plan || 'unknown') + ').');
      await saveActivePlanMove(out.patch);
      moved = true;
      win._planDocLast = out.patch.planDocument;
      // The form's start age is the moved one before the form is read again: the Timing block keeps the end age when the start
      // age it holds changes, and the move has already lengthened the plan to keep it. The record labels' year 0 likewise,
      // until the Decision pages read it again.
      const sa = doc.getElementById('shapeAgeNow'); if (sa && +st.shapeAgeNow > 0) sa.value = st.shapeAgeNow;
      win._decisionAnchor = m.to;
      await deps.loadStressSettings();
      try { await deps.loadDecisionSettings(); } catch (e) { /* form not built yet */ }
      try { await win.refreshLifeStage(); deps.updatePlanLockChip(); } catch (e) { /* chip optional */ }
      toast(moveStartDoneWords(m), 'success', 7000);
      if (typeof win.updateNextStepBanner === 'function') win.updateNextStepBanner();   // the plan's start moved: nothing left to do
    } catch (e) {
      console.error('Move the plan start:', e);
      toast(moved ? 'The plan\'s start was moved, but the page could not show it: reload the page.' : 'Could not move the plan\'s start: ' + e.message + ' Nothing was changed.', 'error', 7000);
    } finally { deps.hideLoading(); }
  };
}
