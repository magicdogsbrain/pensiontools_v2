/**
 * Where "Try a strategy"'s boxes start (lead4.md D3, D10; steps F1, F3): ONE function for each, both views.
 *   tryStartOf          the pension and ISA boxes: a thin re-export of answers/plan/lasts.js tryStartOf (the pension and ISA
 *                       today on a plan still saving, a locked plan's last record, else the pension its runs start from, a
 *                       diversifiers sleeve included; with the base "What's different" reads)
 *   tryIncomeStartOf    the flat-income box, a month after tax, and tryIncomeYearOf the way back (src/reading/tryIncome.js)
 */
export { tryStartOf } from '../answers/plan/lasts.js';
export { tryIncomeStartOf, tryIncomeYearOf } from './tryIncome.js';
