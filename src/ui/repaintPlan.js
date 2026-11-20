/**
 * The full view's one entry after any change of plan (lead4.md R2), moved out of index.html's inline script.
 *
 * repaintPlan(reason) — after load, switch, new plan, delete, lock, unlock: whatever was typed has gone to the plan it was
 * typed in (flushSettings, before the plan changed: changePlan). Then every cache goes with the page's state for the plan
 * (src/ui/planState.js), every form of every tab is filled from the plan as read (an empty value empties its box), the
 * open tab is drawn again — or, when the plan does not offer it, the plan's own first tab — and every other tab draws again
 * when it is opened (each tab's loader runs on its press: drawTab).
 *
 * repaintAfterWrite(reason) — the same plan written from the page (a box saved, a month recorded): what is on screen stays
 * as typed; every figure worked out from the plan as it was goes, and the other tabs draw again when opened.
 *
 * noteJourney() — the stage a lock or a month moved the plan to, written once with that write (never on reading).
 *
 *   installRepaint(win, doc, deps) → { repaintPlan, repaintPlanNow, repaintForms, changePlan, repaintAfterWrite, drawTab,
 *                                      drawDecisionSub, noteJourney, sayReadFault }
 * deps: the page's own loaders that are not on `win` (planState, resetCurrentDecision, clearStressResults, resetStressSubTabs,
 * resetDecisionSubTabs, renderHistory, renderTaxYears, initializeAllInputsFromSettings, loadBudgetUI, renderScenarioSelector,
 * refreshDecisionLock, loadHouseholdUI, loadStressSettings, loadTransitionUI, loadDecisionSettings, updateDraftLines).
 */
import { trackBusy } from '../reading/busy.js';
import { todayOf } from '../reading/clock.js';
import { planKeyOf } from './planState.js';
import { planStage } from '../services/PlanReading.js';
import { journeyAppend } from '../services/LifeStage.js';
import { invalidateScenarioCache, getActiveScenarioAsync, getActiveScenarioId, listScenariosAsync, saveActiveJourney } from '../storage/ScenarioRepository.js';
import { invalidateStressCache } from '../storage/StressRepository.js';
import { invalidateCache } from '../storage/DecisionRepository.js';
import { openingTabOf } from './homeBannerUi.js';
import { emptyPlanBoxes } from './emptyPlanBoxes.js';
import { READ_FAULT_WORDS } from '../reading/readFault.js';

const SAME_PLAN = ['lock', 'unlock'];

export function installRepaint(win, doc, d) {
  const st = d.planState;
  const call = async (fn, ...a) => { try { if (typeof fn === 'function') return await fn(...a); } catch (e) { /* that part is optional */ } return undefined; };
  const clear = (id) => { const el = doc.getElementById(id); if (el) el.innerHTML = ''; };

  /**
   * The plan cannot be read: the same plain words as the simple view, at the top of the page (or nothing). Every box is
   * emptied with them (never the plan open before's figures under the words), the budget is bound to no plan (nothing typed
   * there is saved) and the two Settings forms take the empty boxes as their baseline, so nothing emptied here is written.
   */
  const faultSaid = () => !!doc.getElementById('planReadFault');
  function sayReadFault(words) {
    let el = doc.getElementById('planReadFault');
    if (!words) { if (el) el.remove(); return; }
    if (!el) { el = doc.createElement('div'); el.id = 'planReadFault'; el.className = 'alert alert-warning'; el.setAttribute('role', 'alert'); el.style.margin = '8px 0'; doc.getElementById('mainApp')?.prepend(el); }
    el.textContent = words;
    holdForFault();
  }
  function holdForFault() {
    emptyPlanBoxes(doc);
    st.budLoaded = false; st.budFor = null;
    for (const a of [win._ssAutosave, win._acAutosave]) { try { if (a) a.loaded(); } catch (e) { /* nothing to hold */ } }
  }

  /** Every cache dropped and every form filled from the plan open now (the first half of repaintPlan; the page's load uses it). */
  async function repaintForms(reason) {
    invalidateCache(); invalidateStressCache();
    st.reset(null); st.markAllStale();   // at once, before anything is awaited: a page pressed meanwhile draws for the plan now open
    let plan = null, unread = false; try { plan = await getActiveScenarioAsync(); } catch (e) { plan = null; unread = true; }
    st.key = planKeyOf(plan);
    win._holdingsLines = []; win._planDocLast = null; d.resetCurrentDecision();
    doc.getElementById('openPlaceNote')?.remove();   // a note that names a plan names the plan it was written for
    { const n = doc.getElementById('seedNote'); if (n) n.style.display = 'none'; }   // on every repaint: the plan just kept from an answer shows its note AFTER the page opens on it (NewPlanFromSeed.keepIfWaiting)
    clear('acOnTrack'); clear('acSweepResult');   // "Am I on course?" and "when could I stop" are answered for the plan open, when asked
    sayReadFault(null);
    d.clearStressResults();
    if (!SAME_PLAN.includes(reason)) { d.resetStressSubTabs(); d.resetDecisionSubTabs(); }   // another plan opens on each tool's first page; a lock or unlock stays where it was asked
    await d.renderHistory(); await d.renderTaxYears();
    await d.initializeAllInputsFromSettings();
    if (win._ssAutosave) await win._ssAutosave.loaded();   // the Settings form as just filled is this plan's: no baseline of another survives
    await call(win.loadAccumulationUI); await call(d.loadBudgetUI);
    await d.renderScenarioSelector();
    await call(d.refreshDecisionLock); await call(win.updateNextStepBanner); await call(d.loadHouseholdUI);
    if (unread) sayReadFault(READ_FAULT_WORDS);   // the plan itself could not be read
    else if (faultSaid()) holdForFault();          // a loader could not read it: whatever a later loader drew goes too
  }

  /** A Decision page drawn from the plan open now (its press, and every repaint of the open tab). */
  async function drawDecisionSub(sub) {
    if (sub === 'decisionsettings') await d.loadDecisionSettings();
    if (sub === 'entry') await win.loadCadenceUI();
    if (sub === 'history') await d.renderHistory();
    if (sub === 'plandoc') await win.renderPlanDocumentPage();
    if (sub === 'taxyears') await d.renderTaxYears();
  }

  /** A tab drawn from the plan open now: its loader (every tab draws itself afresh on each press and on every repaint). */
  async function drawTab(name) {
    st.takeStale(name);
    if (name === 'stress') { await d.loadStressSettings(); win.updateStrategyNote(); }
    if (name === 'budget') await d.loadBudgetUI();
    if (name === 'decision') { await win.renderDecisionStrategyPanel(); await drawDecisionSub(doc.querySelector('.sub-tab.active[data-decisiontab]')?.dataset.decisiontab || 'entry'); }
    if (name === 'accumulation') await win.loadAccumulationUI();
    if (name === 'transition') await d.loadTransitionUI();
    if (name === 'household') await d.loadHouseholdUI();
    if (name === 'strategies') await win.loadStrategiesPage();
    win.updateNextStepBanner();
    d.updateDraftLines();
    if (faultSaid()) holdForFault();   // a tab drawn while the plan cannot be read shows no figures
  }

  /** The tab on screen drawn again for the plan open now; a tab this plan does not offer gives way to the plan's first tab. */
  async function drawOpenTab() {
    let tab = doc.querySelector('.tab.active');
    if (!tab || tab.dataset.stageHidden || tab.style.display === 'none') {
      const opening = await openingTabOf({ refreshLifeStage: win.refreshLifeStage, getActiveScenarioId, listScenariosAsync });
      tab = doc.querySelector(`.tab[data-tab="${opening.tab}"]`) || doc.querySelector('.tab[data-tab="decision"]');
      doc.querySelectorAll('.tab').forEach((t) => t.classList.remove('active'));
      doc.querySelectorAll('.tab-content').forEach((c) => c.classList.remove('active'));
      if (tab) { tab.classList.add('active'); doc.getElementById(`${tab.dataset.tab}-content`)?.classList.add('active'); }
    }
    if (tab) await drawTab(tab.dataset.tab);
  }

  async function repaintPlanNow(reason) { await repaintForms(reason); await drawOpenTab(); }
  /**
   * One change at a time (the lead's ruling on step S): a repaint or a change of plan asked for while another is still
   * drawing waits for it, so two repaints never run at once and none reads "the active plan" while another change moves it.
   * A change that fails does not hold up the next.
   */
  let queue = Promise.resolve();
  const inTurn = (fn) => { const run = queue.then(fn, fn); queue = run.catch(() => {}); return run; };
  const repaintPlan = (reason) => trackBusy(inTurn(() => repaintPlanNow(reason)), 'repaint');

  /** A change of plan, made safely: anything typed goes to the plan it was typed in, then the change, then the repaint. */
  async function changePlanNow(reason, change) {
    await win.flushSettings();
    const out = await change();
    await repaintPlanNow(reason);
    return out;
  }
  const changePlan = (reason, change) => trackBusy(inTurn(() => changePlanNow(reason, change)), 'repaint');   // busy from the press on

  async function repaintAfterWrite() {
    invalidateCache(); invalidateStressCache(); st.dropWorked(); st.markAllStale();
    d.clearStressResults();
    await call(d.renderScenarioSelector); await call(win.updateNextStepBanner);
  }

  async function noteJourney() {
    try {
      invalidateScenarioCache(); invalidateStressCache();
      const sc = await getActiveScenarioAsync(); if (!sc || !sc.id) return;
      const now = todayOf(), j = Array.isArray(sc.journey) ? sc.journey : [];
      const next = journeyAppend(j, planStage(sc, { now }), now);   // the stage as the one reading gives it (PlanReading.planStage)
      if (next !== j) await saveActiveJourney(next);
    } catch (e) { /* the journey is optional */ }
  }

  const api = { repaintPlan, repaintPlanNow, repaintForms, changePlan, repaintAfterWrite, drawTab, drawDecisionSub, noteJourney, sayReadFault };
  Object.assign(win, { repaintPlan, changePlan, repaintAfterWrite });
  return api;
}
