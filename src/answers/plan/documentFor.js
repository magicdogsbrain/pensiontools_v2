/**
 * The plan document as the planner builds it, and the archives it is kept in — the parts the lock's writes (lock.js) and the
 * move of a locked plan's start (moveStart.js) share. Lifted out of lock.js (6.53.0), so the move does not reach the lock's
 * writer, which only the one write file may (tests/v7/boundaries.test.js). Pure: the run arrives as data.
 *
 *   documentFor(plan, { now, run, entries, lockedAt, lockedBy })   index.html buildPlanDocumentNow on the run's p and r
 *   archived(list, current, at)                                    an archive with one more entry (the last ten kept)
 *   shapeRefsOf(plan, entries)                                     the budget's essentials and total a year before tax
 */
import { effectiveStressSettings } from '../../services/PlanReading.js';
import { buildPlanDocument } from '../../services/PlanDocument.js';
import { budgetSharedFromOf, sharedBudgetView } from '../../services/PlanCommit.js';
import { summariseBudget, grossUpAnnual, defaultBudget } from '../../services/BudgetModel.js';
import { normaliseHoldings, emptyHoldings } from '../../services/HoldingsRecord.js';

/** How many past versions an archive keeps (ScenarioRepository.archivePlanDocument / archivePlanOfRecord: the last nine kept plus the one archived). */
export const ARCHIVE_KEEP = 10;

const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const nameOf = (plan) => (plan && plan.planDetails && typeof plan.planDetails.name === 'string' && plan.planDetails.name) || (plan && typeof plan.name === 'string' && plan.name) || '';
/** What the planner hands the document builder (ScenarioRepository.getActiveAccumulation, getActiveHoldings). */
const accumulationOf = (plan) => (plan && plan.accumulationTool && plan.accumulationTool.settings) || {};
const holdingsOf = (plan) => (plan && plan.holdings && typeof plan.holdings === 'object' ? normaliseHoldings(plan.holdings) : emptyHoldings());

/**
 * The budget's figures the plan document carries (index.html _shapeRefs): essentials and the all-in total, each a year
 * before tax, only when the budget has a line above zero; the household's shared budget read as the planner reads it
 * (ScenarioRepository.getActiveBudget: the partner's lines, this plan's own side).
 * @returns {{ essentials: number, budgetGross: number }}
 */
export function shapeRefsOf(plan, entries = []) {
  const own = (plan && plan.budgetTool && isObj(plan.budgetTool.settings)) ? plan.budgetTool.settings : defaultBudget();
  const from = budgetSharedFromOf(plan);
  let b = own;
  if (from) {
    const src = (entries || []).find((e) => e && e.plan && String(e.plan.id) === from);
    const theirs = src && src.plan.budgetTool && isObj(src.plan.budgetTool.settings) ? src.plan.budgetTool.settings : null;
    if (theirs) b = sharedBudgetView(theirs, own, from);
  }
  b = { ...defaultBudget(), ...(b || {}) };
  if (!(Array.isArray(b.lines) ? b.lines : []).some((l) => l && +l.annual > 0)) return { essentials: 0, budgetGross: 0 };
  const sm = summariseBudget(b);
  return { essentials: Math.round(grossUpAnnual(sm.essentialAnnualNet || 0)), budgetGross: Math.round(grossUpAnnual(sm.allInComfortableAnnual || 0)) };
}

/** The plan document, built as index.html buildPlanDocumentNow builds it, from the worker's run. */
export function documentFor(plan, { now, run, entries, lockedAt, lockedBy }) {
  const settings = effectiveStressSettings(plan, { now });
  const refs = shapeRefsOf(plan, entries);
  return buildPlanDocument({
    planName: nameOf(plan) || 'My plan',
    holdings: holdingsOf(plan),
    settings,
    p: run.p, r: run.r,
    lockedAt: lockedAt || null, lockedBy,
    budgetGross: refs.budgetGross, essentials: refs.essentials,
    journey: Array.isArray(plan.journey) ? plan.journey : [],
    accumulation: accumulationOf(plan),
    now,
    savingPath: run.savingPath
  });
}

/** The archive of a document or a record with one more entry: the last nine kept, the current one dated (the repository's slice(-9) + push). */
export function archived(list, current, at) {
  const kept = Array.isArray(list) ? list.slice(-(ARCHIVE_KEEP - 1)) : [];
  return current ? [...kept, { ...current, archivedAt: at }] : kept;
}
