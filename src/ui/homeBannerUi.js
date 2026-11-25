/**
 * The classic page's next-step banner (7.10.0; research/v7/replan-nov-2026.md §6.4, spec-7100 §5): the very reading the new
 * app's plan home makes (answers/plan/home.js homeOf), so the two apps never give different to-dos. The banner shows the
 * home's first thing due, in the new app's words (the rail's next sentence, its button):
 *   - a month or a tax year to record → the Decision tab (a partner's month opens that plan);
 *   - the review, off course, "did you stop work?", an age, a partner's plan → that page of the new app ({ kind: 'v7' });
 *   - a closed plan's way on → the plan that carries it on ({ kind: 'plan' }).
 * With nothing due: a plan Moving by its agreement says so, as the new app's home does ("You accepted what you hold on …");
 * any other plan not locked gets the onboarding chain (NextStep.nextStepFor); a locked one its stage's sentence, as
 * information.
 *
 * Every plan in the account is read (as the new app reads them: upgraded, a newer or unreadable one marked), so a linked
 * partner and a closed plan's successor are found as the new app finds them. Nothing is written on open.
 *
 * The ×: on a to-do that may be put away, "Not now", stored on the plan (ScenarioRepository.saveActivePlanTasks: the stored
 * plan read afresh, one key added, no stamp) — the new app's home and a partner's device then see the same; on anything else,
 * and on the onboarding chain, the page's own "hide guidance for this plan" (localStorage nextStepDismissed:<id>), as before.
 *
 * The full view's "Back to the simple view" (#classicToSimple, 7.11.0) follows the plan that is open: it leads to that plan's
 * page in the simple view, else to the simple view's front door.
 *
 *   homeBannerOf(entries, activeId, { today, stage, budget, stress, decision, fromAnswer })   the banner, pure (or null)
 *   updateHomeBanner(win, doc, deps)                       index.html's updateNextStepBanner: the newer-plan banner, the stage,
 *                                                          then showHomeBanner, in that order
 *   showHomeBanner(win, doc, deps)                         points #classicToSimple at the open plan, reads the plans and draws
 *                                                          the banner
 *   simpleLinkHref(id)                                     the simple view's page of a plan ('#/' with no plan id)
 *   openingTabOf(deps, now)                                { tab, sub } the full view opens on: LifeStage.openingTab, with the
 *                                                          phase the plan home reads, whether What you hold has lines and
 *                                                          whether the plan has figures
 *   pressOpeningSub(win, doc, opening)                     presses the opening's sub-tab once the tab has drawn
 *   installHomeBanner(win, doc, deps)                      win.dismissNextStep, the ×
 */
import { homeOf } from '../answers/plan/home.js';
import { upgradeScenario } from '../firebase/scenarioMigration.js';
import { nextStepFor, nextStepAction } from '../services/NextStep.js';
import { openingTab } from '../services/LifeStage.js';
import { holdingsSummary, normaliseHoldings } from '../services/HoldingsRecord.js';
import { planHasFigures } from '../services/DraftDecision.js';
import { pressIfClosed } from './stressSubTabs.js';
import { planHasSavingFigures } from '../services/PlanFigures.js';
import { leaveForView } from './viewSwitch.js';
import { PLAN_ID } from '../services/OpenPlace.js';
import { PLAN } from '../v7/copy/plan.js';
import { HOME } from '../v7/copy/home.js';
import { LAYOUT } from '../appLayout.js';

/** The key the page's own "hide guidance for this plan" is kept under (as before 7.10.0). */
export const DISMISSED_KEY = 'nextStepDismissed:';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const fill = (text, slots) => String(text || '').replace(/\{(\w+)\}/g, (m, k) => (slots && slots[k] != null ? String(slots[k]) : m));
const pad = (n) => String(n).padStart(2, '0');
/** A day as the readers take it: 'YYYY-MM-DD', local. */
export const dayOf = (d) => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());

/** The plans as the new app reads them: each brought up to date in memory, a newer or unreadable one marked (never written). */
export function entriesOf(plans, now) {
  return (Array.isArray(plans) ? plans : []).filter((p) => p && typeof p === 'object' && p.id != null).map((p) => {
    try { const u = upgradeScenario(p, { now }); return { plan: u.scenario, newer: !!u.newer, failed: !!u.error }; } catch (e) { return { plan: p, newer: false, failed: true }; }
  });
}

/** What the banner's button does for the home's first thing due. */
function actionOf(it) {
  if (it.planId) return { kind: 'plan', planId: it.planId };                       // a partner's month: that plan
  const b = it.button || {};
  // a month to record: its own month, on Monthly Entry (the walk: "Record October" opened on November)
  if ((it.id === 'month.record' || it.id === 'month.gap') && /^\d{4}-\d{2}$/.test(String(b.month || ''))) return { kind: 'tab', tab: 'decision', sub: 'entry', month: b.month };
  if (it.id.startsWith('month.')) return { kind: 'tab', tab: 'decision' };
  if (it.id === 'closed.next') return { kind: 'plan', planId: String(b.href || '').replace(/^#\/plan\//, '') };
  return b.href ? { kind: 'v7', href: LAYOUT.classic.v7 + b.href } : { kind: 'tab', tab: 'decision' };
}

/**
 * The banner for the active plan: the home's first thing due, in the new app's words, or (nothing due) the onboarding chain on
 * a plan not locked and the stage's sentence on a locked one. `dismiss` says what the × does: { kind: 'task', key } ("Not
 * now", stored on the plan) or { kind: 'banner' } (the page's own "hide guidance"). Null when there is nothing to say. Pure.
 * @returns {{ html: string, btn: string, action: object, dismiss: { kind: 'task', key: string } | { kind: 'banner' }, id: string|null } | null}
 */
export function homeBannerOf(entries, activeId, { today, stage = null, budget = {}, stress = {}, decision = {}, fromAnswer = false } = {}) {
  let h = null;
  try { h = homeOf(entries, activeId, { today }); } catch (e) { h = null; }
  const it = h && h.found && h.todo && h.todo.items.length ? h.todo.items[0] : null;
  if (it) {
    const b = it.button || null;
    const words = it.planId
      ? fill(HOME.partnerItem, { title: fill((HOME.items[it.id] || {}).title, it.slots), name: it.name })
      : fill(PLAN.next[it.pid], it.slots);
    const label = b ? fill(PLAN.buttons[b.id] || b.id, it.id === 'month.gap' && it.slots && it.slots.month ? { ...b.slots, month: it.slots.month } : b.slots) : HOME.items[it.id] ? fill(HOME.items[it.id].title, it.slots) : '';
    return { html: esc(words), btn: label, action: actionOf(it), dismiss: it.dismiss && !it.planId ? { kind: 'task', key: it.key } : { kind: 'banner' }, id: it.id };
  }
  if (h && h.readonly) return null;
  // nothing due on a plan Moving by its agreement: the new app's own line ("You accepted what you hold on …"), as information,
  // with the way to its review — never the onboarding chain's "moving what you hold come when you are ready"
  const mw = h && h.found ? h.moveWindow : null;
  if (mw && (mw.id === 'agreed' || mw.id === 'agreedAsItStands') && HOME.moveWindow[mw.id]) {
    const href = h.review && h.review.href ? h.review.href : '#/plan/' + h.id + '/review';
    return { html: esc(fill(HOME.moveWindow[mw.id], mw.slots)), btn: HOME.review.link, action: { kind: 'v7', href: LAYOUT.classic.v7 + href }, dismiss: { kind: 'banner' }, id: null };
  }
  // nothing due: the onboarding chain on a plan not locked; a locked plan's stage, as information
  const step = nextStepFor({ stage, budget, stress, decision, fromAnswer: !!fromAnswer });
  // (7.12.0) and, as the home says it, the month of the next review: what is due next is the same in both views
  const next = h && h.found && h.review && h.review.next ? ' ' + esc(fill(HOME.quiet.review, { month: h.review.next }).replace(/^Nothing due\. /, '')) : '';
  return step ? { ...step, html: step.html + next, dismiss: { kind: 'banner' }, id: null } : null;
}

/**
 * index.html's updateNextStepBanner, its three steps in their order: the newer-plan banner; the life stage, worked out on
 * every load BEFORE anything can return early (a plan with the banner dismissed never got a stage — tabs not hidden, chip
 * without it — found 10 Sep); then the banner itself. `deps`: showPlanNewerBanner, refreshLifeStage and showHomeBanner's.
 */
export async function updateHomeBanner(win, doc, deps) {
  deps.showPlanNewerBanner();
  let stage = null; try { stage = await deps.refreshLifeStage(); } catch (e) { stage = null; }
  return showHomeBanner(win, doc, { ...deps, stage });
}

/** The simple view's page of a plan, from the full view: '#/plan/<id>', or the front door '#/' when the id is not one. */
export function simpleLinkHref(id) {
  return LAYOUT.classic.v7 + (PLAN_ID.test(String(id || '')) ? '#/plan/' + id : '#/');
}

/**
 * The tab and sub-tab the full view opens on (index.html's showMainApp): LifeStage.openingTab of the stage, with the phase the
 * plan home reads for the open plan (homeOf's stage key), whether What you hold has lines, and whether the plan has figures.
 * No phase, nothing held and figures assumed when the plans cannot be read. `deps`: refreshLifeStage, getActiveScenarioId,
 * listScenariosAsync. Reads only.
 * @returns {Promise<{ tab: string, sub: string|null }>}
 */
export async function openingTabOf(deps, now = new Date()) {
  const stage = await deps.refreshLifeStage();
  let phase = null, held = false, figures = true;
  try {
    const plans = await deps.listScenariosAsync();
    const id = await deps.getActiveScenarioId();
    const h = homeOf(entriesOf(plans, now), id, { today: dayOf(now) });
    phase = h && h.found && h.stage ? h.stage.key || null : null;
    const raw = Array.isArray(plans) ? plans.find((p) => p && p.id === id) : null;
    // 7.12.0: Moving opens on Transition only when What you hold has a line (a named line, as the record reads it)
    if (raw) { held = holdingsSummary(normaliseHoldings(raw.holdings)).count > 0; figures = planHasFigures(raw) || planHasSavingFigures(raw); }
  } catch (e) { phase = null; held = false; figures = true; }
  return openingTab(stage, phase, { held, figures });
}

/** Presses the opening's sub-tab (Stress tester → Settings, Decision → Plan document or History) once its tab has drawn. */
export function pressOpeningSub(win, doc, opening) {
  if (!opening || !opening.sub) return;
  const attr = opening.tab === 'stress' ? 'stresstab' : 'decisiontab';
  // only when it is not open yet: a person who pressed it already may have typed there (the second walk's race hunt)
  win.setTimeout(() => pressIfClosed(doc.querySelector('.sub-tab[data-' + attr + '="' + opening.sub + '"]')), 400);
}

/**
 * Reads every plan and draws the banner (updateHomeBanner shows the newer-plan banner and works out the stage first).
 * `deps`: the page's own readers — getActiveScenarioId, listScenariosAsync, getBudgetAsync, getStressSettingsAsync,
 * getDecisionSettingsAsync, planFromAnswer — and the stage it worked out. First it points the full view's "Back to the
 * simple view" (#classicToSimple) at the plan that is open, whatever the banner then shows.
 */
export async function showHomeBanner(win, doc, deps) {
  const banner = doc.getElementById('nextStepBanner');
  if (!banner) return null;
  try {
    const activeId = await deps.getActiveScenarioId();
    const back = doc.getElementById('classicToSimple');
    // the link is a choice (7.12.0); a figure typed and the link pressed at once is saved first (wrap-up: viewSwitch.js leaveForView)
    if (back) { const to = simpleLinkHref(activeId); back.setAttribute('href', to); back.onclick = (e) => { leaveForView(e, 'simple', to, { flush: deps.flush || win.flushSettings, go: (h) => win.location.assign(h) }); }; }
    if (!activeId) { banner.style.display = 'none'; return null; }
    const now = deps.now ? deps.now() : new Date();
    const [plans, budget, stress, decision, fromAnswer] = await Promise.all([deps.listScenariosAsync(), deps.getBudgetAsync(), deps.getStressSettingsAsync(), deps.getDecisionSettingsAsync(), deps.planFromAnswer()]);
    const step = homeBannerOf(entriesOf(plans, now), activeId, { today: dayOf(now), stage: deps.stage || null, budget, stress, decision, fromAnswer: !!fromAnswer });
    let hidden = false;
    try { hidden = !!(win.localStorage && win.localStorage.getItem(DISMISSED_KEY + activeId)); } catch (e) { hidden = false; }
    // the page's own "hide guidance" hides only what it hid before; a to-do put away is the plan's own (its tasks)
    if (!step || (step.dismiss.kind === 'banner' && hidden)) { banner.style.display = 'none'; win._nextStepDismiss = null; return step; }
    doc.getElementById('nextStepText').innerHTML = step.html;
    const b = doc.getElementById('nextStepBtn');
    b.textContent = step.btn;
    b.onclick = nextStepAction(step.action, win);
    const x = banner.querySelector('[data-on-click="dismissNextStep()"]');
    if (x) x.title = step.dismiss.kind === 'task' ? HOME.dismiss.notNow : 'Hide guidance for this plan';
    win._nextStepDismiss = { ...step.dismiss, planId: activeId };
    banner.style.display = 'flex';
    return step;
  } catch (e) { banner.style.display = 'none'; return null; }
}

/**
 * The ×: "Not now" on a to-do that may be put away (stored on the plan, deps.saveActivePlanTasks), else the page's own "hide
 * guidance for this plan". A refused or failed write leaves the banner as it was.
 */
export function installHomeBanner(win, doc, deps) {
  win.dismissNextStep = async function () {
    const d = win._nextStepDismiss || null;
    const banner = doc.getElementById('nextStepBanner');
    if (d && d.kind === 'task' && d.key) {
      try { await deps.saveActivePlanTasks(d.key); } catch (e) { return; }
      if (banner) banner.style.display = 'none';
      if (typeof win.updateNextStepBanner === 'function') win.updateNextStepBanner();
      return;
    }
    try { win.localStorage.setItem(DISMISSED_KEY + await deps.getActiveScenarioId(), '1'); } catch (e) { /* private mode: hidden for now only */ }
    if (banner) banner.style.display = 'none';
  };
}
