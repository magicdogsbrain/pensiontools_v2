/**
 * A retired draft stored with a later start than it should have (7.4.0): every save of its settings in V7 writes the reading
 * the site makes of it, so a step's figures read from the earlier start are never written against the later one.
 *
 *   laterDraftPatch(plan, { now })        the paths that write that reading, with the values they had
 *   withLaterDraft(plan, p, { now })      a step's write with the reading's paths under its own
 *
 * The move of a LOCKED plan's start under its lock (6.53.0 to 7.9.0, "Move the plan's start…") is gone from 7.10.0: a locked
 * plan's start changes by unlocking it, changing it on "About you and when" and locking it again (research/v7/replan-nov-2026.md
 * §2 principle 13). A locked plan stored with a later start is still read from where its months are (PlanMove.withLockedStart).
 * Pure: no engine, no write, no clock.
 */
import { laterDraftReading } from '../../services/PlanReading.js';
import { REANCHOR_STRESS_KEYS } from '../../services/PlanMove.js';

const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const copy = (v) => (v === undefined ? undefined : JSON.parse(JSON.stringify(v)));
const text = (v) => (v === undefined ? '<absent>' : JSON.stringify(v));

/**
 * A retired draft read from an earlier start than it saved (7.4.0, PlanMove.laterDraftOf; PlanReading.laterDraftReading):
 * the paths that write that reading — year 0, and every key the transform moved — with the values they had. Every save of
 * the draft's settings in V7 carries them under its own (effects/planWrite.js), as the planner's Save writes its whole
 * form: a step's figures, read from the earlier start, are never written against the later one. The Decision copy's year 0
 * follows when it holds one. Empty for every other plan.
 * @returns {{ patch: object, previous: object }}
 */
export function laterDraftPatch(plan, { now }) {
  const patch = {}, previous = {};
  let r = null; try { r = laterDraftReading(plan, { now }); } catch { r = null; }
  if (!r) return { patch, previous };
  const stored = (plan.stressTool && isObj(plan.stressTool.settings)) ? plan.stressTool.settings : {};
  const keys = r.legacy ? ['firstTaxYear', 'legacyFirstTaxYear'] : REANCHOR_STRESS_KEYS;
  for (const k of keys) {
    if (text(r.settings[k]) === text(r.before[k]) || text(r.settings[k]) === text(stored[k])) continue;
    patch['stressTool.settings.' + k] = copy(r.settings[k]); previous['stressTool.settings.' + k] = copy(stored[k]);
  }
  const ds = (plan.decisionTool && isObj(plan.decisionTool.settings)) ? plan.decisionTool.settings : {};
  if (!r.legacy && +ds.firstTaxYear > 0 && +ds.firstTaxYear !== r.to) { patch['decisionTool.settings.firstTaxYear'] = r.to; previous['decisionTool.settings.firstTaxYear'] = copy(ds.firstTaxYear); }
  return { patch, previous };
}

/**
 * A step's write `p` ({ ok, patch, previous, … }) on a draft read from an earlier start (laterDraftPatch): the reading's
 * paths under the step's own (the step's value wins where both write a path), and their previous values with its own, so
 * Undo puts the plan back byte for byte. Any write that touches no setting, and every other plan: `p` as it is.
 */
export function withLaterDraft(plan, p, { now }) {
  if (!p || !p.ok || !isObj(p.patch)) return p;
  if (!Object.keys(p.patch).some((k) => k.startsWith('stressTool.settings.') || k.startsWith('decisionTool.settings.'))) return p;
  const ld = laterDraftPatch(plan, { now });
  if (!Object.keys(ld.patch).length) return p;
  return { ...p, patch: { ...ld.patch, ...p.patch }, previous: { ...ld.previous, ...(p.previous || {}) } };
}
