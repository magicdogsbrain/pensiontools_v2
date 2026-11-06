/**
 * Money taken from a pension flexibly, as the person's own fact (research/plan-start.md §2 J, §8): `flexibleAccess` at the
 * plan's root, `{ since: 'YYYY-MM', fromPlanId }`.
 *
 * Why it is a fact of the person and not of a plan: once taxable money has been taken from a pension pot flexibly (income
 * drawn from it, or a slice taken partly tax-free), what that person and their employer pay into pensions in a tax year is
 * limited to £10,000 before tax charges apply — the Money Purchase Annual Allowance — for good, whichever plan they are on.
 * The planner used to read it from the open plan's own Month by month alone (a record with a tax-free slice), so a person
 * who closed a drawing plan and went back to work (a saving plan with no months of its own) was shown the £60,000
 * allowance again. Now the close writes the fact on the new plan, and every later close copies it:
 *   - written by the close (services/PlanClose.js successorOf, either reason) when the plan being closed carries it, or has
 *     any taxable draw recorded — income from the pension in any month, not only a slice taken partly tax-free (the
 *     widening the design notes: drawing income from a pension is flexible access too) — or when a plan before it does;
 *   - `since` is the first month recorded with such a draw (or the carried one's), `fromPlanId` the plan it was recorded on;
 *   - absent means what it always meant: the open plan's own records decide, by the test the planner has always made
 *     (mpaaOf), so nothing moves for a plan that was never closed.
 * The stored fact is what the close saw. A closed plan's months up to its close can still be recorded after it (a month
 * missed and filled in, or the months before a change-over set up ahead), and a plan closed before the fact was carried (a
 * 6.56.0 move) carries none, so the readers also follow `previousPlanId` through the plans at hand and take the earliest
 * taxable draw recorded along that chain (flexibleAccessAlong). A reader with no plans at hand reads the stored fact alone.
 * The readers: the planner's Accumulation page (index.html recalcAccumulation through AccumulationEngine.contributionWarnings),
 * and the preview's "What you pay in", the check-in and "Am I saving enough?" opened from the plan (answers/plan/saving.js,
 * checkIn.js, saverInputs.js). They say what the rule is, never what to do.
 *
 * Pure: no storage, no DOM, no clock.
 */

const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const MONTH = /^(\d{4})-(0[1-9]|1[0-2])$/;
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** The limit once money has been taken flexibly (AccumulationEngine.ACCUMULATION_RULES.MPAA, the same figure). */
export const FLEXIBLE_ACCESS_LIMIT = 10000;

/** The fact as stored, checked: { since, fromPlanId } (fromPlanId null when not said), or null. */
export function flexibleAccessOf(plan) {
  const f = plan && plan.flexibleAccess;
  if (!isObj(f) || typeof f.since !== 'string' || !MONTH.test(f.since.trim())) return null;
  return { since: f.since.trim(), fromPlanId: typeof f.fromPlanId === 'string' && f.fromPlanId ? f.fromPlanId : null };
}

/** Does a recorded month take taxable money from the pension: income drawn from it, or a slice taken partly tax-free? */
export function isTaxableDraw(h) {
  return isObj(h) && ((+h.sipp || 0) > 0 || (+h.taxFree || 0) > 0);
}

/** The first month recorded on the plan's Month by month with a taxable draw ('YYYY-MM'), or null. */
export function firstTaxableDrawMonth(plan) {
  const hist = plan && plan.decisionTool && Array.isArray(plan.decisionTool.history) ? plan.decisionTool.history : [];
  let first = null;
  for (const h of hist) {
    if (!isTaxableDraw(h) || typeof h.date !== 'string') continue;
    const m = h.date.slice(0, 7);
    if (MONTH.test(m) && (!first || m < first)) first = m;
  }
  return first;
}

const planOfEntry = (e) => (e && isObj(e.plan) ? e.plan : e);
const previousIdOf = (p) => (typeof p.previousPlanId === 'string' && p.previousPlanId ? p.previousPlanId
  : isObj(p.before) && typeof p.before.planId === 'string' && p.before.planId ? p.before.planId : null);
/** The earlier of two facts (the first when they share a month), either of which may be null. */
const earlier = (a, b) => (!a ? b : !b ? a : b.since < a.since ? b : a);

/**
 * The plans that came before `plan`, nearest first: the one its `previousPlanId` names (or `before.planId`), then the one
 * that plan names, and so on — each found among `plans` (plans, or entries { plan }), each once; the chain stops at a plan
 * not at hand.
 */
export function earlierPlansOf(plan, plans = []) {
  const list = (Array.isArray(plans) ? plans : []).map(planOfEntry).filter(isObj);
  const seen = new Set(plan && plan.id != null ? [String(plan.id)] : []);
  const out = [];
  let p = plan;
  while (isObj(p)) {
    const id = previousIdOf(p);
    if (!id || seen.has(id)) break;
    seen.add(id);
    p = list.find((x) => x.id != null && String(x.id) === id) || null;
    if (p) out.push(p);
  }
  return out;
}

/** One plan's own part: its stored fact (named by the plan it was recorded on, else this one) or its first taxable draw. */
function ownFact(plan) {
  const id = plan && plan.id != null ? String(plan.id) : null;
  const own = flexibleAccessOf(plan);
  const draw = firstTaxableDrawMonth(plan);
  return earlier(own ? { since: own.since, fromPlanId: own.fromPlanId != null ? own.fromPlanId : id } : null, draw && id ? { since: draw, fromPlanId: id } : null);
}

/** The earliest fact of the plans before this one (earlierPlansOf), each read by ownFact; null when none has one. */
function earlierFact(plan, plans) {
  let best = null;
  for (const p of earlierPlansOf(plan, plans)) best = earlier(best, ownFact(p));
  return best;
}

/**
 * The fact a close writes on the new plan: the earliest of the closed plan's own (its stored fact, else its first taxable
 * draw recorded) and of every plan before it among `plans` — so a plan made by an earlier move that carried nothing still
 * passes the draws of the plan it came from on. Null when there is none: never on a plan closed with no draw anywhere.
 */
export function carriedFlexibleAccess(plan, plans = []) {
  return earlier(ownFact(plan), earlierFact(plan, plans));
}

/**
 * The fact as the readers read it: the plan's stored one, and every plan before it among `plans` (their stored facts and
 * their taxable draws recorded, those recorded after the close among them), the earliest; null when none. The plan's own
 * records are left to the planner's own test (mpaaOf), as they always were.
 */
export function flexibleAccessAlong(plan, plans = []) {
  return earlier(flexibleAccessOf(plan), earlierFact(plan, plans));
}

/**
 * Has the limit been set off, as the readers read it? The fact when there is one (flexibleAccessAlong: stored, or along the
 * plans before this one); else the planner's own test of the plan's records, unchanged — a record with a tax-free slice
 * (index.html's MPAA cross-check, as it always was).
 * @param {object} plan
 * @param {object[]|null} [history]  the records to test when they come apart from the plan (the planner's getHistoryAsync)
 * @param {object[]} [plans]  the plans at hand (plans, or entries { plan }), to follow `previousPlanId` through
 * @returns {{ triggered: boolean, flexibleAccess: { since, fromPlanId }|null }}
 */
export function mpaaOf(plan, history = null, plans = []) {
  const fa = flexibleAccessAlong(plan, plans);
  if (fa) return { triggered: true, flexibleAccess: fa };
  const hist = Array.isArray(history) ? history : plan && plan.decisionTool && Array.isArray(plan.decisionTool.history) ? plan.decisionTool.history : [];
  return { triggered: hist.some((h) => h && (h.taxFree || 0) > 0), flexibleAccess: null };
}

/** 'March 2029' for '2029-03'. */
export function sinceWords(since) {
  const m = MONTH.exec(String(since || ''));
  return m ? MONTH_NAMES[+m[2] - 1] + ' ' + m[1] : '';
}

/**
 * The rule in words (both apps): "Since you took money from your pension flexibly in March 2029, what you and …". The limit
 * is on money paid into pension pots (the Money Purchase Annual Allowance); a final-salary pension's building up is not
 * counted against it, so the words say pots. V7's copies of the sentence (copy/saving.js, copy/checkin.js, copy/plan.js)
 * say the same, held to it by a test.
 */
export function flexibleAccessWords(since) {
  return 'Since you took money from your pension flexibly in ' + sinceWords(since) + ', what you and your employer pay into pension pots in a tax year is limited to £10,000 before tax charges apply.';
}
