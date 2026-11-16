/**
 * A locked plan's start, in the planner (6.53.0, research/plan-start.md §4 "Migration of existing plans"). A locked plan's
 * Stress settings form is frozen, but the month work stopped is the person's own fact and changes no figure by itself: it
 * is asked once, on a line under the Timing block's summary that the freeze leaves live ("Leave it" remembered, and the
 * month still sayable there, folded), and once said it stays changeable there ("Change the month you stopped work"). The
 * move of the plan's start under its lock ("Move the plan's start…", 6.53.0 to 7.9.0) is gone in 7.10.0: a plan stored with
 * a later start is told how its start changes — unlock, change it under Timing, lock again. The rules are
 * services/PlanMove.js; the words src/ui/planStartUi.js.
 *
 *   installLockedStart(win, doc, deps)   the line's handlers, on `win` (the page's inline handlers call them by name):
 *                                        renderLockedStart, saveLockedStopMonth, leaveLockedStopMonth
 *   fillPlanStart()                      the plan's first month, for the Monthly Entry's fill (MonthFill.planFillStart): a
 *                                        plan whose start is behind what is recorded reaches its lived months
 *   decisionPotsYear()                   the plan year the Decision tool's pot floors start from
 *   startLaterOfActive()                 the open plan stored with its start later than it should be (PlanMove.startLaterOf):
 *                                        the next-step banner's one thing to do, the move of its start (7.3.3)
 *   startDraftOfActive()                 a draft still set to start later than this tax year (PlanMove.laterDraftLeftOf, 7.4.0)
 *
 * "Move to a new plan" and a closed plan's line (6.56.0) are src/ui/planCloseUi.js: installed with this, drawn with the line
 * (renderLockedStart draws both), and its helpers handed on to index.html from here, so the page keeps one import.
 *
 * index.html keeps one call for each (tests/v7/shellRatchet.test.js: its inline script may only get shorter).
 */
import { activePlanLocked, getActiveScenarioAsStored } from '../storage/ScenarioRepository.js';
import { saveStressSettings, getStressSettingsAsync } from '../storage/StressRepository.js';
import { getDecisionSettingsAsync, getAllTaxYearsAsync } from '../storage/DecisionRepository.js';
import { effectiveStressSettings } from '../services/PlanReading.js';
import { stopAskOf, stopLeftOf, stopChangeOf, moveAnchorOf, startLaterOf, laterDraftOf, laterDraftLeftOf } from '../services/PlanMove.js';
import { lockedStopAnswer, bandsOf, netOf, firstStepGross } from '../answers/plan/about.js';
import { stoppedWorkOf, monthName, decisionAnchorYear, deriveTiming, taxYearStartOf } from '../services/PlanTiming.js';
import { runPositionOf } from '../services/PlanFromToday.js';
import { planFillStart } from '../services/MonthFill.js';
import { lockedStartHtml, LOCKED_STOP_REFUSED } from './planStartUi.js';
import { installPlanClose, planReadDay, stressLockBannerHtml, successorNameOf, plansInListOrder, planListDesc, decisionLockBannerHtml, planDocumentMay, planDocumentEmptyHtml, paintPlanDocumentTools, planNoticeHtml, drawClosedTransition, taxYearTabsFor, householdPickerFor, closedTimingSummary } from './planCloseUi.js';
import { beforeOf, closedAtOf, isClosedPlan, partnerCandidates, BEFORE_KINDS } from '../services/PlanClosed.js';

export { planReadDay, stressLockBannerHtml, successorNameOf, plansInListOrder, planListDesc, decisionLockBannerHtml, planDocumentMay, planDocumentEmptyHtml, paintPlanDocumentTools, planNoticeHtml, drawClosedTransition, taxYearTabsFor, householdPickerFor, closedTimingSummary, partnerCandidates };

const gbp = (v) => '£' + Math.round(+v || 0).toLocaleString('en-GB');

/**
 * The full view's Monthly Entry on a plan not locked yet (7.12.0): in place of the form, that months are recorded once the
 * plan is locked, and the plan as it stands in the figures the simple view shows (the effective Stress settings: the pension,
 * the ISA when there is one, the first income a month after tax). Nothing reads the Decision tool's own settings before the
 * lock. Pure.
 */
export function lockFirstText(ss) {
  const s = ss || {};
  const p = s.strategyParams && typeof s.strategyParams === 'object' ? s.strategyParams : {};
  const pension = +p.sippTotal > 0 ? +p.sippTotal : (+s.equityMin || 0) + (+s.bondMin || 0) + (+s.cashTarget || 0) + (+s.diversifierStart || 0);
  const isa = p.isaTotal != null ? +p.isaTotal || 0 : +s.isaBalance || 0;
  const net = netOf(firstStepGross(s), bandsOf(s)) / 12;
  const parts = [gbp(pension) + ' pension', ...(isa > 0 ? [gbp(isa) + ' ISA'] : []), gbp(net) + ' a month after tax'];
  return 'Months are recorded once the plan is locked. Your plan: ' + parts.join(', ') + '.';
}

/**
 * Draws the lock-first panel (#dsLockFirst) on the Monthly Entry tab of a plan not locked, and hides the form beside it; a
 * locked (or closed) plan gets the form back. The link opens Stress tester → Settings, where the plan is locked.
 */
export async function paintLockFirst(doc = typeof document === 'undefined' ? null : document) {
  const panel = doc && doc.getElementById('dsLockFirst');
  if (!panel) return;
  const form = panel.parentElement ? panel.parentElement.querySelector('.grid-2') : null;
  let sc = null; try { sc = await getActiveScenarioAsStored(); } catch (e) { sc = null; }
  const locked = !sc || isClosedPlan(sc) || !!(sc.decisionTool && sc.decisionTool.settings && sc.decisionTool.settings.locked);
  if (locked) { panel.style.display = 'none'; panel.innerHTML = ''; if (form) form.style.display = ''; return; }
  let ss = {}; try { ss = effectiveStressSettings(sc, { now: new Date() }); } catch (e) { ss = (sc.stressTool && sc.stressTool.settings) || {}; }
  const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  panel.innerHTML = '<div class="alert alert-info"><p style="margin:0;">' + esc(lockFirstText(ss)) + '</p>'
    + '<p style="margin:8px 0 0;"><a href="#" class="itemise-link" data-on-click="openToolSettingsTab(\'stress\'); return false;">Lock the plan</a></p></div>';
  panel.style.display = '';
  if (form) form.style.display = 'none';
}

/**
 * The plan year the pots the Decision tool's floors start from belong to (legacyDecision `potsYear`): where the plan's pots
 * stand as the engines read them (PlanFromToday.runPositionOf) — year 0 for a plan locked in its year 0 or before, a later
 * year for one locked in it or whose start was moved back under its lock.
 */
export async function decisionPotsYear() {
  try { const ss = await getStressSettingsAsync(); return runPositionOf(ss, deriveTiming(ss)).elapsedYears; } catch (e) { return 0; }
}

/**
 * Before a lock (index.html commitPlanLock): a draft read from an earlier start than it saved (7.4.0, PlanMove.laterDraftOf)
 * is saved as it reads first, so the plan locked is the plan the Decision tool is seeded from and the document is written
 * of. The Stress settings' own save writes the copy in memory, which holds that reading. Nothing for any other plan.
 */
export async function saveLaterDraftFirst() {
  let sc = null; try { sc = await getActiveScenarioAsStored(); } catch (e) { sc = null; }
  const ss = sc && sc.stressTool && sc.stressTool.settings;
  if (!sc || !laterDraftOf(sc, ss || {}, new Date())) return;
  await saveStressSettings({});
}

/** The open plan, read as PlanMove.startLaterOf reads it (as stored): null for every plan with nothing to move or ask. */
export async function startLaterOfActive() {
  try { return startLaterOf(await getActiveScenarioAsStored(), new Date()); } catch (e) { return null; }
}

/**
 * The open draft still set to start later than this tax year (7.4.0, PlanMove.laterDraftLeftOf), read on its effective
 * settings as the form holds them: the next-step banner's one thing to do, its start chosen under Timing. Null otherwise.
 */
export async function startDraftOfActive() {
  try { const sc = await getActiveScenarioAsStored(); const now = new Date(); return sc ? laterDraftLeftOf(sc, effectiveStressSettings(sc, { now }), now) : null; } catch (e) { return null; }
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
 * @param {object} deps  what only the page has: loadStressSettings, showLoading, hideLoading
 */
export function installLockedStart(win, doc, deps) {
  const toast = (m, t, ms) => win.showToast(m, t, ms);
  installPlanClose(win, doc, { showLoading: deps.showLoading, hideLoading: deps.hideLoading });

  async function renderLockedStart() {
    const el = doc.getElementById('tmLockedStart'); if (!el) return;
    let html = '', asking = false;
    try {
      const sc = await getActiveScenarioAsStored(), now = new Date();
      // a closed plan's start is never asked about (its lock banner says it is closed): nothing here
      if (sc && !isClosedPlan(sc) && await activePlanLocked()) {
        const sl = startLaterOf(sc, now);
        // stored with a start later than this tax year (7.10.0): said, with how it changes; never moved under the lock
        const later = sl && sl.start > taxYearStartOf(now) ? sl.start : null;
        const ask = stopAskOf(sc, now), left = !ask && stopLeftOf(sc, now);
        const ss = (sc && sc.stressTool && sc.stressTool.settings) || {};
        html = lockedStartHtml({ ask, start: moveAnchorOf(ss, sc.decisionTool?.settings), stopped: stopChangeOf(sc, now), left, later });
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
    if (typeof win.updateNextStepBanner === 'function') win.updateNextStepBanner();
  };

  win.leaveLockedStopMonth = async function () {
    try { await saveStressSettings({ stopMonthLeft: true }); }
    catch (e) { toast('Could not save that choice: ' + e.message, 'error'); return; }
    await renderLockedStart();
    toast('Left as it is. You will not be asked again; you can still say it under “Say when you stopped work”.', 'success', 5000);
    if (typeof win.updateNextStepBanner === 'function') win.updateNextStepBanner();
  };
}
