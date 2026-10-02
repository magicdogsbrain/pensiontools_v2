/**
 * The Budget's "Use as the start of my income shape" (and the walk-through's "Set as my plan's target"): what it writes
 * into the Stress settings. Moved out of index.html's applyBudgetToPlan in 6.20.2 (the inline script may only shrink);
 * the arithmetic is unchanged.
 *
 * The budget is TODAY'S spending: it seeds the FIRST step of the income shape only. The go-slow and no-go steps are the
 * person's to draw (Stress Settings → Your income shape); the budget's age bands and one-offs are not turned into a
 * schedule. The per-year schedule follows the steps' slopes (IncomeSchedule.amountAtAge). The budget's essentials go
 * into Floor & Flex's own put-away inputs (6.13.0), and into the live dials only when Floor & Flex is the plan's
 * strategy — no stray key for the others.
 *
 * Pure: no storage, no DOM. The caller checks the lock first (a locked plan's settings are frozen) and saves the patch.
 */
import { summariseBudget, grossUpAnnual, budgetRetirementAge, budgetAgeToday } from './BudgetModel.js';
import { amountAtAge } from './IncomeSchedule.js';

const copy = (v) => JSON.parse(JSON.stringify(v));

/**
 * @param {object} budget       the Budget (the page's working copy)
 * @param {object} stressNow    the plan's Stress settings as loaded
 * @param {number} gross        the budget's all-in total (plus any headroom) grossed up, £ a year before tax
 * @param {string} today        'YYYY-MM-DD', stamped on a Floor & Flex put-away it creates
 * @returns {{ patch: object, strategyState: object }} the Stress settings to save, and the strategies' put-away inputs
 */
export function budgetIncomeShapePatch(budget, stressNow, gross, today) {
  const s = summariseBudget(budget);
  // Income starts at retirement — or NOW if already retired (year 0 is today for a retiree). Placeholders are not an age (6.13.5).
  const ageNow = stressNow.shapeAgeNow || Math.max(budgetRetirementAge(budget) || 0, budgetAgeToday(budget) || 0) || 57;
  const steps = Array.isArray(stressNow.incomeSteps) && stressNow.incomeSteps.length ? copy(stressNow.incomeSteps) : [];
  if (steps.length) steps[0] = { fromAge: steps[0].fromAge || ageNow, amount: gross }; else steps.push({ fromAge: ageNow, amount: gross });
  const dur = stressNow.duration || 35;
  const targetSchedule = Array.from({ length: dur + 1 }, (_, y) => Math.round(amountAtAge(steps, ageNow + y, gross)));
  const essentialsGross = Math.round(grossUpAnnual(s.essentialAnnualNet || 0));
  const strategyState = copy(stressNow.strategyState || {});
  if (essentialsGross) {
    const ff = strategyState['floor-and-flex'] || (strategyState['floor-and-flex'] = { strategyParams: {}, allocMode: 'risk', taggedFunds: [], savedAt: today });
    if (!ff.strategyParams.essentialsAnnual) ff.strategyParams.essentialsAnnual = essentialsGross;
  }
  const strategyParams = { ...(stressNow.strategyParams || {}) };
  if (stressNow.strategyId === 'floor-and-flex' && !strategyParams.essentialsAnnual && essentialsGross) strategyParams.essentialsAnnual = essentialsGross;
  return {
    patch: { baseSalary: gross, incomeShape: 'phases', incomeSteps: steps, shapeAgeNow: ageNow, targetSchedule, strategyParams, strategyState },
    strategyState
  };
}
