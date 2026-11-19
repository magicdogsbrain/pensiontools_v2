/**
 * The closed and before readings of a plan (moved out of services/PlanClosed.js in step F1, so that file stays a leaf the
 * simple view's shell can import without the plan reading): the plan that carries a closed one on, and the plan a successor
 * came from, each named as it is shown everywhere (PlanName.shownPlanName on `now`), never by its stored name.
 *
 *   closedReading(plan, plans, now) → { closedAt, month, next: { id, name }|null, ahead, working } | null
 *   beforeReading(plan, plans, now) → { from, fromMonth, until, previous: { id, name }|null, kind } | null
 */
import { closedAtOf, nextPlanIdOf, previousPlanIdOf, beforeOf, BEFORE_KINDS, monthWordsOf, monthBefore, closesAhead } from './PlanClosed.js';
import { shownPlanName } from './PlanName.js';

const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);

/**
 * A closed plan's one line, and the plan that carries it on, found among `plans` (a list of plans, or of { plan }):
 * { closedAt, month: 'March 2029', next: { id, name }|null, ahead, working }. `ahead` while its last month is still to come
 * (closesAhead): the words then say it closes, not that it closed. `working` when the plan that carries it on is a saving
 * spell (back to work: its `before.kind` is 'working') — the reason lives on that plan, so the close writes nothing more on
 * this one; with that plan not at hand the reason is not known and not said. Null for a plan that is not closed.
 */
export function closedReading(plan, plans = [], now = new Date()) {
  const c = closedAtOf(plan);
  if (!c) return null;
  const id = nextPlanIdOf(plan);
  const list = (Array.isArray(plans) ? plans : []).map((e) => (e && e.plan ? e.plan : e)).filter(isObj);
  const next = id ? list.find((p) => String(p.id) === id) || null : null;
  const working = !!next && (beforeOf(next) || {}).kind === 'working';
  // the name it is shown by everywhere (PlanName.shownPlanName, step F1), never the stored one
  return { closedAt: c, month: monthWordsOf(c), next: next ? { id: String(next.id), name: shownPlanName(next, { now }) } : null, ahead: closesAhead(plan, now), working };
}

/**
 * A successor's one line about what came before it: { from, until: 'March 2029', previous: { id, name }|null, kind }, the
 * previous plan found among `plans`. Either reason (a new plan, or a saving spell after going back to work) says the same:
 * the previous plan's months are there. Null for a plan that came from nowhere (no `before` of a known kind).
 */
export function beforeReading(plan, plans = [], now = new Date()) {
  const b = beforeOf(plan);
  if (!b || !BEFORE_KINDS.includes(b.kind)) return null;
  const id = b.planId || previousPlanIdOf(plan);
  const list = (Array.isArray(plans) ? plans : []).map((e) => (e && e.plan ? e.plan : e)).filter(isObj);
  const prev = id ? list.find((p) => String(p.id) === id) || null : null;
  return { from: b.from, fromMonth: monthWordsOf(b.from), until: monthWordsOf(monthBefore(b.from)), previous: prev ? { id: String(prev.id), name: shownPlanName(prev, { now }) } : null, kind: b.kind };
}
