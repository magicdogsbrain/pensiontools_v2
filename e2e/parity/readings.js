/**
 * The reading's own value of a fact, formatted as the page should show it (lead4.md G3 (c)): held against every place
 * that shows the fact. One entry per fact the shared reading layer (src/reading/) gives today; each later step that moves a
 * figure onto the reading adds its fact here (the hook is what this step builds; the plan's name is its first use).
 */
import { shownPlanName } from '../../src/services/PlanName.js';

/** [{ fact, want }] for a plan on the day both views run on. */
export function readingsFor(plan, { now }) {
  const out = [];
  const name = shownPlanName(plan, { now });
  if (typeof name === 'string' && name) out.push({ fact: 'plan.name', want: name });
  return out;
}
