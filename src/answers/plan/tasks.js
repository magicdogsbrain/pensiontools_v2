/**
 * The home's to-dos put off or done (7.10.0; research/v7/replan-nov-2026.md §6.4): stored on the plan, so a partner's device,
 * a second window and the classic page all see the same quiet home. "Not now" puts a to-do off until next month; "I have
 * done this", "I have seen this" and "Not this time" put it away for good — for that occurrence only, when the to-do has one
 * (the month to record, the tax year, the review's date), so the next one still comes.
 *
 *   tasks: { of: createdAt, dismissed: { '<id>[@<occurrence>]': { at, until: 'YYYY-MM' | null } } }   // at most TASKS_MAX
 *
 *   taskKeyOf(id, occurrence)          the key a to-do is stored under
 *   dismissedOf(plan)                  the dismissals that belong to this plan (a copy)
 *   isPutOff(plan, key, { now })       is that to-do put off or done?
 *   taskPatch(plan, key, kind, { at }) ONE dismissal, written from the root as stored: { tasks } (schema.js TASK_WRITES)
 *
 * Belonging (Phases.belongsTo): a copy made by a 7.9.0 tab keeps the source's `tasks`; when `of` differs from the plan's own
 * `createdAt` every dismissal is read as absent, and the next write drops them. A write first drops the dismissals that have
 * run out; at TASKS_MAX it then drops the oldest whose occurrence is in the past (then the oldest). Only a write does that.
 *
 * Pure: no storage, no clock of its own (`now` and `at` come in).
 */
import { TASKS_MAX, belongsTo } from '../../services/Phases.js';
import { DISMISS, DISMISS_KINDS, isTaskKey } from './schema.js';

export { DISMISS, DISMISS_KINDS, isTaskKey };
/** What a dismissal stores: put off until next month, or done (for its occurrence). */
export const TASK_KINDS = Object.freeze(['notNow', 'done']);
const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const copy = (v) => JSON.parse(JSON.stringify(v));
const pad = (n) => String(n).padStart(2, '0');
const monthKeyOf = (d) => d.getFullYear() + '-' + pad(d.getMonth() + 1);
const MONTH = /^\d{4}-(0[1-9]|1[0-2])$/;

/** The key a to-do is stored under: its id, and '@' and its occurrence when it has one. */
export const taskKeyOf = (id, occurrence = null) => (occurrence == null || occurrence === '' ? String(id) : String(id) + '@' + String(occurrence));

const whenOf = (at) => {
  if (at instanceof Date && Number.isFinite(at.getTime())) return at;
  if (typeof at === 'string' && Number.isFinite(Date.parse(at))) return new Date(at);
  throw new Error('tasks: the moment comes in as a date');
};
const nextMonthOf = (d) => (d.getMonth() === 11 ? (d.getFullYear() + 1) + '-01' : d.getFullYear() + '-' + pad(d.getMonth() + 2));

/** The last month an occurrence covers: a month, a day's month, a tax year's March; null when it is not a date (a plan id). */
function occurrenceEnd(key) {
  const at = String(key).indexOf('@');
  if (at < 0) return null;
  const o = String(key).slice(at + 1);
  if (MONTH.test(o)) return o;
  if (/^\d{4}-\d{2}-\d{2}$/.test(o) && MONTH.test(o.slice(0, 7))) return o.slice(0, 7);
  const ty = /^(\d{4})\/\d{2}$/.exec(o);
  if (ty) return (Number(ty[1]) + 1) + '-03';
  return null;
}

/** An entry as stored, checked: { at, until } with `until` a month or null. Else null. */
const entryOrNull = (e) => (isObj(e) && typeof e.at === 'string' && (e.until === null || (typeof e.until === 'string' && MONTH.test(e.until))) ? { at: e.at, until: e.until } : null);

/** The dismissals that belong to this plan (a copy; {} when none). */
export function dismissedOf(plan) {
  const t = plan && isObj(plan.tasks) ? plan.tasks : null;
  if (!t || !belongsTo(t, plan) || !isObj(t.dismissed)) return {};
  const out = {};
  for (const [k, v] of Object.entries(t.dismissed)) { const e = entryOrNull(v); if (isTaskKey(k) && e) out[k] = e; }
  return out;
}

/** Is the to-do under `key` put off (until a month still to come) or done? `now`: the day it is read on (a Date). */
export function isPutOff(plan, key, { now } = {}) {
  const e = dismissedOf(plan)[key];
  if (!e) return false;
  return e.until === null || monthKeyOf(whenOf(now)) < e.until;
}

/**
 * ONE dismissal, written from the root as stored: `{ tasks }`, the whole root (TASK_WRITES — no stamp). `kind`: 'notNow'
 * (until the 1st of next month) or 'done' (for good, for this key's occurrence).
 * @param {object} plan  the plan as stored
 * @param {string} key   taskKeyOf(id, occurrence)
 * @param {'notNow'|'done'} kind
 * @param {{ at: Date|string }} o
 * @returns {{ tasks: object, until: string|null }}
 */
export function taskPatch(plan, key, kind, { at } = {}) {
  if (!isTaskKey(key)) throw new Error('taskPatch: ' + key + ' is not a to-do');
  if (!TASK_KINDS.includes(kind)) throw new Error('taskPatch: ' + kind + ' is not how a to-do is put away');
  const when = whenOf(at);
  const thisMonth = monthKeyOf(when);
  const kept = dismissedOf(plan);
  // the dismissals that have run out go first
  const live = Object.entries(kept).filter(([k, e]) => k !== key && (e.until === null || thisMonth < e.until));
  const until = kind === 'notNow' ? nextMonthOf(when) : null;
  let list = [...live, [key, { at: when.toISOString(), until }]];
  if (list.length > TASKS_MAX) {
    // at the cap: the oldest whose occurrence is in the past, then the oldest — never the one just made
    const byAge = (a, b) => String(a[1].at).localeCompare(String(b[1].at));
    const past = list.filter(([k]) => k !== key && occurrenceEnd(k) != null && occurrenceEnd(k) < thisMonth).sort(byAge);
    const drop = new Set();
    for (const [k] of past) { if (list.length - drop.size <= TASKS_MAX) break; drop.add(k); }
    for (const [k] of list.filter(([k]) => k !== key).sort(byAge)) { if (list.length - drop.size <= TASKS_MAX) break; drop.add(k); }
    list = list.filter(([k]) => !drop.has(k));
  }
  const of = plan && typeof plan.createdAt === 'string' && plan.createdAt ? plan.createdAt : null;
  const dismissed = Object.fromEntries(list);
  return { tasks: copy(of ? { of, dismissed } : { dismissed }), until };
}
