/**
 * The full view's Accumulation tab, saved as its boxes change (7.12.0, lead decision 1): ONE write of what the boxes show,
 * built by the same builders the simple view uses, so "Work it out", the answer block, the projection table and Stress
 * tester → Settings all read the figures the boxes show.
 *
 * The ages are the plan's own (About: the Timing block every screen reads first), so an age or a stop typed here goes
 * through About's write (aboutPatch), never only into the tab's own copy, which the next read would put back over it. The
 * rest is What you pay in's own write (savingPatch, with no change of what you want).
 *
 *   ACCUMULATION_BOXES                       box id → the key it is typed as
 *   accumulationTabPatch(plan, boxes, { today })
 *     boxes: { acAge, acRetireAge, acSalary, acPotNow, acNetMonthly, acScheme, acEmployerMonthly, acEscalation, acIsaMonthly }
 *            as typed (text)
 *     → { ok, errors: { <box id>: error id }, patch, previous }   nothing to write: ok with an empty patch
 *
 * Pure.
 */
import { aboutPatch, applyPatch, get } from './about.js';
import { savingPatch, savedSaving } from './saving.js';

export const ACCUMULATION_BOXES = Object.freeze({
  acSalary: 'salary', acPotNow: 'potNow', acNetMonthly: 'netMonthly', acScheme: 'schemeType',
  acEmployerMonthly: 'employerMonthly', acEscalation: 'escalationPct', acIsaMonthly: 'isaMonthly'
});

const blank = (v) => v == null || String(v).trim() === '';
const copy = (v) => (v === undefined ? undefined : JSON.parse(JSON.stringify(v)));
const whole = (v) => { const n = Number(String(v).trim()); return Number.isFinite(n) ? n : null; };

export function accumulationTabPatch(plan, boxes, { today }) {
  const b = boxes || {};
  const saved = savedSaving(plan, { today });
  const errors = {};
  let base = plan;
  let about = { patch: {} };

  // the ages: through About, only when a box says something other than the plan
  const age = blank(b.acAge) ? null : whole(b.acAge);
  const stop = blank(b.acRetireAge) ? null : whole(b.acRetireAge);
  const ageChanged = age != null && Math.floor(age) !== Math.floor(+saved.currentAge || 0);
  const stopChanged = stop != null && Math.round(stop) !== Math.round(+saved.retirementAge || 0);
  if (ageChanged || stopChanged) {
    const typed = {};
    if (ageChanged) typed.age = String(b.acAge).trim();
    if (stopChanged) { typed.stopped = 'age'; typed.stopAge = String(b.acRetireAge).trim(); }
    about = aboutPatch(plan, typed, { today });
    if (!about.ok) {
      if (about.errors.age) errors.acAge = about.errors.age;
      if (about.errors.stopAge) errors.acRetireAge = about.errors.stopAge;
      if (about.errors.plan) errors.plan = about.errors.plan;
      if (!Object.keys(errors).length) errors[stopChanged ? 'acRetireAge' : 'acAge'] = Object.values(about.errors)[0] || 'notWithAbout';
      return { ok: false, errors, patch: {}, previous: {} };
    }
    base = applyPatch(plan, about.patch);
  }

  // what goes in and the pot today: What you pay in's own write, what you want unchanged
  const typed = { 'want.monthly': '', 'want.stopAge': '' };
  for (const [id, key] of Object.entries(ACCUMULATION_BOXES)) if (b[id] !== undefined) typed[key] = b[id] == null ? '' : String(b[id]);
  const own = savingPatch(base, typed, { today });
  if (!own.ok) {
    for (const [id, key] of Object.entries(ACCUMULATION_BOXES)) if (own.errors[key]) errors[id] = own.errors[key];
    if (!Object.keys(errors).length) Object.assign(errors, own.errors);
    return { ok: false, errors, patch: {}, previous: {} };
  }

  const patch = { ...about.patch, ...own.patch };
  // the whole settings object already carries the ages About keeps in step
  if (patch['accumulationTool.settings']) for (const k of Object.keys(patch)) if (k.startsWith('accumulationTool.settings.')) delete patch[k];
  const previous = {};
  for (const k of Object.keys(patch)) previous[k] = copy(get(plan, k));
  return { ok: true, errors: {}, patch, previous };
}
