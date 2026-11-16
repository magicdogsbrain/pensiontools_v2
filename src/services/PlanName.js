/**
 * The name a plan is shown by (7.12.0). A name the person did not type follows the plan: keeping an answer suggested one
 * from that day's figures ("Stop at 65 · £2,400 a month · paying £630"), and nothing renamed it when the stop, the aim or
 * what goes in changed, so the name could contradict the page under it.
 *
 *   shownPlanName(plan, { now }) → string
 *     the person's own name (the stored name, less a trailing " (from this window)", " (opened)" or " (n)", differs from
 *     the suggestion the answer made, or the plan was not kept from an answer): the stored name, unchanged;
 *     otherwise built from the plan's present figures by the same pattern, without the pay-in — "Stop at 67 · £2,200 a
 *     month" while saving (the stop age and the aim a month after tax as "Are you paying in enough?" reads them, to the
 *     nearest £10); "From 62 · £2,400 a month" once stopped — the " (n)" kept.
 *
 * Nothing is written: the stored name is still what a rename edits. A couple's plan keeps its stored name.
 */
import { effectiveStressSettings } from './PlanReading.js';
import { saverInputsOf } from '../answers/plan/saverInputs.js';
import { bandsOf, netOf } from '../answers/plan/about.js';
import { PLAN_NAME } from '../answers/shared/planName.js';

const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const num = (v) => (v == null || v === '' || !Number.isFinite(+v) ? null : +v);
const pad = (n) => String(n).padStart(2, '0');
const dayOf = (d) => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
const tenner = (n) => '£' + (Math.round(Number(n) / 10) * 10).toLocaleString('en-GB');

/** The name as stored. */
export function storedPlanName(plan) {
  return (plan && plan.planDetails && typeof plan.planDetails.name === 'string' && plan.planDetails.name) || (plan && typeof plan.name === 'string' && plan.name) || '';
}

/** The stored name split: the name itself, and the " (n)" that tells two of a name apart. */
function partsOf(name) {
  let base = String(name || '');
  let n = '';
  const dup = / \(\d+\)$/.exec(base);
  if (dup) { n = dup[0]; base = base.slice(0, -n.length); }
  base = base.replace(/ \((?:from this window|opened)\)$/, '');
  const dup2 = / \(\d+\)$/.exec(base);
  if (!n && dup2) { n = dup2[0]; base = base.slice(0, -n.length); }
  return { base, n };
}

export function shownPlanName(plan, { now = new Date() } = {}) {
  const stored = storedPlanName(plan);
  const fa = plan && isObj(plan.fromAnswer) ? plan.fromAnswer : null;
  const suggested = fa && isObj(fa.name) && typeof fa.name.suggested === 'string' ? fa.name.suggested : null;
  if (!suggested || fa.household === 'couple') return stored;
  const { base, n } = partsOf(stored);
  if (base !== suggested) return stored;
  let derived = null;
  try {
    const read = saverInputsOf(plan, { today: dayOf(now) });
    if (read.ok) derived = `Stop at ${read.notes.stopAge}${PLAN_NAME.sep}${tenner(read.notes.aimMonthly)} a month`;
    else if (read.why === 'notSaving') {
      const ss = effectiveStressSettings(plan, { now });
      const gross = Array.isArray(ss.targetSchedule) && ss.targetSchedule.length ? num(ss.targetSchedule[0]) : num(ss.baseSalary);
      const age = num(ss.shapeAgeNow);
      if (gross > 0 && age > 0 && ss.retired !== false) derived = `From ${Math.round(age)}${PLAN_NAME.sep}${tenner(netOf(gross, bandsOf(ss)) / 12)} a month`;
    }
  } catch { derived = null; }
  return derived ? derived + n : stored;
}

/** shownPlanName on a day given as a Date or as 'YYYY-MM-DD' (a page's `today`, read at noon); the clock's day otherwise. */
export function shownPlanNameOn(plan, when) {
  const m = typeof when === 'string' ? /^(\d{4})-(\d{2})-(\d{2})/.exec(when) : null;
  const now = when instanceof Date ? when : m ? new Date(+m[1], +m[2] - 1, +m[3], 12) : new Date();
  return shownPlanName(plan, { now });
}
