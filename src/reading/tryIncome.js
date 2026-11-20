/**
 * The flat-income box of "Try a strategy" / "Try a change", in both views (lead4.md D6, D10; step F3): ONE function to fill
 * it and ONE to read it back.
 *
 *   tryIncomeStartOf(plan, ctx)          the plan's current income step a month after tax (the step in force at the age
 *                                        today, else the first), as the person types it everywhere, through the one income
 *                                        reading (src/reading/income.js incomeStepsOf); null when the plan was given no
 *                                        income (the box empty, never a default)
 *   tryIncomeYearOf(month, plan, ctx)    what the run takes for a month after tax typed in that box: a year before tax, on
 *                                        the bands the box was filled from (the one way back)
 *
 * A what-if never writes: these only fill and read a box.
 */
import { incomeStepsOf, bandsFor } from './income.js';
import { ageToday } from './timing.js';
import { yearlyGross } from '../answers/plan/spend.js';

const num = (v) => (v == null || v === '' || !Number.isFinite(+v) ? null : +v);

/** The plan's current income step, a month after tax; null when it has none. */
export function tryIncomeStartOf(plan, ctx = {}) {
  let r = null;
  try { r = incomeStepsOf(plan, ctx); } catch { r = null; }
  const steps = r && Array.isArray(r.steps) ? r.steps : [];
  if (!steps.length) return null;
  let age = null;
  try { age = ageToday(plan, ctx); } catch { age = null; }
  let cur = steps[0];
  if (age != null) for (const s of steps) if (num(s.fromAge) != null && s.fromAge <= age) cur = s;
  return num(cur.monthAfterTax);
}

/** A month after tax typed in the flat-income box, as the run takes it: a year before tax on the plan's own bands. */
export function tryIncomeYearOf(month, plan, ctx = {}) {
  const m = num(month);
  if (m == null || m <= 0) return 0;
  return yearlyGross(m, bandsFor(plan, ctx));
}
