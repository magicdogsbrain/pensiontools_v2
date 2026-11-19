/**
 * The budget's spending line (lead4.md D6; step F2, deliverable 4): ONE function for "essentials" and "all in" a month after
 * tax, used by both views wherever the budget's figures are drawn. The rule is the one the budget page itself shows in both
 * views: the plan holder's share (BudgetModel.summariseBudget: on a budget shared with a partner, your share; otherwise
 * the whole budget), never the household's lines summed at one age.
 *
 *   budgetLineOf(budget) → { workedOut, essentials, total, essentialsAnnualNet, shared }   whole pounds a month after tax
 *
 * Pure.
 */
import { summariseBudget } from '../services/BudgetModel.js';

export function budgetLineOf(budget) {
  let d = null;
  try { d = budget ? summariseBudget(budget) : null; } catch { d = null; }
  if (!d) return { workedOut: false, essentials: 0, total: 0, essentialsAnnualNet: 0, shared: false };
  const workedOut = d.allInComfortableMonthly > 0 || d.householdComfortableMonthly > 0;
  return { workedOut, essentials: Math.round(+d.essentialMonthlyNet || 0), total: Math.round(+d.allInComfortableMonthly || 0), essentialsAnnualNet: +d.essentialAnnualNet || 0, shared: !!d.sharedWithPartner };
}
