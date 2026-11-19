/**
 * The Budget's "Use £X a month as my spending" (and the walk-through's "Use £X a month as my spending & finish"): what
 * it writes into the plan, what it asks first, and how it is undone. Moved out of index.html's applyBudgetToPlan in
 * 6.20.2 (the inline script may only shrink); reshaped in 6.23.0 (research/v7/v6-usability-audit.md decision 6).
 *
 * The budget is a guide. Only this button changes the plan, and it writes ONE thing: the plan's spending figure — the
 * first step of the income shape (and so the per-year schedule that follows the steps' slopes, IncomeSchedule.amountAtAge)
 * and the plan's spending target (Stress baseSalary and the Decision tool's year-0 target, which are one figure). It
 * never touches the Floor & Flex essentials, the strategy's dials, or any other setting. The go-slow and no-go steps are
 * the person's to draw (Stress Settings → Your income shape); the budget's age bands and one-offs are not turned into a
 * schedule.
 *
 * Pure: no storage, no DOM. The caller checks the lock first (a locked plan's settings are frozen) and saves the patch.
 */
import { budgetRetirementAge, budgetAgeToday } from './BudgetModel.js';
import { amountAtAge } from './IncomeSchedule.js';

const copy = (v) => JSON.parse(JSON.stringify(v));

/** The Stress settings keys the button writes — and so the keys Undo puts back. (No age: an age worked out from the plan is never stored as if typed.) */
export const SPENDING_KEYS = Object.freeze(['baseSalary', 'incomeShape', 'incomeSteps', 'targetSchedule']);

/**
 * @param {object} budget       the Budget (the page's working copy)
 * @param {object} stored       the plan's Stress settings AS STORED (the steps the person gave; never the reading's)
 * @param {number} gross        the figure to use, grossed up: £ a year before tax
 * @param {object} [reading]    the plan's Stress settings as read (PlanReading.effectiveStressSettings): the age at the
 *                              plan's start and its length, which the schedule is worked over (default: `stored`)
 * @returns {object} the Stress settings patch to save (SPENDING_KEYS only)
 */
export function budgetSpendingPatch(budget, stored, gross, reading = stored) {
  const st = stored || {}, rd = reading || {};
  // Income starts at retirement — or NOW if already retired (year 0 is today for a retiree). Placeholders are not an age (6.13.5).
  const ageNow = rd.shapeAgeNow || st.shapeAgeNow || Math.max(budgetRetirementAge(budget) || 0, budgetAgeToday(budget) || 0) || 57;
  const steps = Array.isArray(st.incomeSteps) && st.incomeSteps.length ? copy(st.incomeSteps) : [];
  if (steps.length) steps[0] = { ...steps[0], fromAge: steps[0].fromAge || ageNow, amount: gross }; else steps.push({ fromAge: ageNow, amount: gross });
  const dur = rd.duration || st.duration || 35;
  const targetSchedule = Array.from({ length: dur + 1 }, (_, y) => Math.round(amountAtAge(steps, ageNow + y, gross)));
  return { baseSalary: gross, incomeShape: 'phases', incomeSteps: steps, targetSchedule };
}

/**
 * What Undo puts back, from the plan AS STORED: the same keys as they were before the button (a key that was not there is
 * undefined, which the repositories take out again — never a null stored as if typed), and the Decision tool's target.
 * @returns {{ stress: object, decision: { baseSalary: number|undefined } }}
 */
export function spendingBefore(storedStress, storedDecision) {
  const stress = {};
  for (const k of SPENDING_KEYS) stress[k] = storedStress && storedStress[k] !== undefined ? copy(storedStress[k]) : undefined;
  return { stress, decision: { baseSalary: storedDecision && storedDecision.baseSalary !== undefined ? storedDecision.baseSalary : undefined } };
}

/** The "+10%" button: the figure with a tenth on top, to the pound. */
export function plusTenth(monthly) {
  return Math.round((+monthly || 0) * 1.1);
}

/** A monthly figure in words: "£2,264 a month". */
export function aMonth(monthly, money) {
  return money(Math.round(+monthly || 0)) + ' a month';
}

/**
 * The words on the page and in the question it asks first.
 * @param {{ monthly: number, wasMonthly: number|null, plusTen: boolean }} f   the figure to use (take-home, a month), the
 *   plan's spending today (take-home, a month; null when the plan has none yet), whether the tenth is on
 * @param {(n: number) => string} money
 */
export function useSpendingWords(f, money) {
  const figure = aMonth(f.monthly, money);
  const was = f.wasMonthly != null && f.wasMonthly > 0 ? aMonth(f.wasMonthly, money) : null;
  return {
    button: 'Use ' + figure + ' as my spending',
    plusTen: f.plusTen ? '+10% on (' + figure + ')' : '+10%',
    ask: 'Use ' + figure + ' as your spending?' + (f.plusTen ? ' That is your budget with a tenth on top.' : '')
      + (was ? ' It replaces the plan\'s spending figure (was ' + was + ').' : ' It becomes the plan\'s spending figure.')
      + ' Nothing else in the plan changes, and you can undo it for a few seconds afterwards.',
    done: 'Your spending is now ' + figure + ' take-home' + (was ? ' (was ' + was + ')' : '') + '.',
    undone: 'Put back: your spending is ' + (was || 'as it was') + ' again.'
  };
}
