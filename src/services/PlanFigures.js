/**
 * Whether a plan holds figures someone gave it (7.12.0), read by DraftDecision.js and PlanReading.js alike: Stress settings
 * saved (`configured`), an older plan whose income is not the factory one (before the flag: 30,000 is the default, and a
 * net-first figure never lands on it), a locked plan, or a plan kept from an answer. A plan straight from the full view's
 * wizard has none: its pots and income are the defaults, never a figure.
 *
 * Pure.
 */
import { isLockedSettings } from './LockedPlanGuard.js';

const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);

/** Is the plan locked, as stored? */
export const planLocked = (plan) => isLockedSettings(plan && plan.decisionTool && isObj(plan.decisionTool.settings) ? plan.decisionTool.settings : undefined);

export function planHasFigures(plan) {
  if (!plan) return false;
  if (isObj(plan.fromAnswer)) return true;
  if (planLocked(plan)) return true;
  const s = plan.stressTool && isObj(plan.stressTool.settings) ? plan.stressTool.settings : null;
  if (!s) return false;
  return s.configured === true || (!!s.baseSalary && +s.baseSalary !== 30000);
}

/**
 * Whether the Accumulation planner holds figures someone typed (7.12.0): a pension today or a pay above nothing. A saver who
 * came in by the saver's door types there only; the full view then opens on the Accumulation planner, never on "no figures
 * yet" (LifeStage.openingTab). Ages alone are not figures.
 */
export function planHasSavingFigures(plan) {
  const a = plan && isObj(plan.accumulationTool) && isObj(plan.accumulationTool.settings) ? plan.accumulationTool.settings : null;
  return !!a && ((+a.potNow || 0) > 0 || (+a.salary || 0) > 0);
}

/**
 * What a plan, as read, still needs before a test can say anything (7.12.0, decision 2): a pot (its pension or ISA today, the
 * pots when work stops, or a bought strategy's own total) and an income someone gave. `settings` are the plan's effective
 * settings (PlanReading.effectiveStressSettings), which read a plan nobody gave figures as having none.
 */
export function figuresMissingOf(settings) {
  const s = isObj(settings) ? settings : {};
  const at = isObj(s.potAtRetirement) ? (+s.potAtRetirement.sipp || 0) + (+s.potAtRetirement.isa || 0) : 0;
  const bought = isObj(s.strategyParams) ? (+s.strategyParams.sippTotal || 0) + (+s.strategyParams.isaTotal || 0) : 0;
  const today = (+s.equityMin || 0) + (+s.bondMin || 0) + (+s.cashTarget || 0) + (+s.diversifierStart || 0) + (+s.isaBalance || 0) + (+s.taxableStart || 0);
  const pot = !s.potsNotSet && today + at + bought > 0;
  const steps = Array.isArray(s.incomeSteps) && s.incomeSteps.some((x) => x && +x.amount > 0);
  const schedule = Array.isArray(s.targetSchedule) && s.targetSchedule.some((v) => +v > 0);
  const income = !s.incomeNotSet && ((+s.baseSalary || 0) > 0 || steps || schedule);
  return { pot: !pot, income: !income };
}

/**
 * Whether a plan can be tested, as the household check asks (7.12.0, decision 12): figures given anywhere — Stress settings
 * saved, kept from an answer, locked, or a pension or pay on the Accumulation tab — and, as read, a pot and an income.
 * → { ready, missing: null | 'both' | 'pot' | 'income' }
 */
export function testReadyOf(plan, settings) {
  if (!plan || !(planHasFigures(plan) || planHasSavingFigures(plan))) return { ready: false, missing: 'both' };
  const m = figuresMissingOf(settings);
  const missing = m.pot && m.income ? 'both' : m.pot ? 'pot' : m.income ? 'income' : null;
  return { ready: !missing, missing };
}
