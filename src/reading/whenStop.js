/**
 * "When could I stop?" on a kept plan (lead4.md D11, R6): ONE function, answer A's whole-life function (src/answers/a), and
 * ONE input gatherer, used by both views. The full view's "When could I retire?" runs answer A on exactly these inputs in its
 * engine worker; the simple view's "When can I afford to stop work?" link on a saving plan opens A with the same figures in
 * its boxes and runs it on the same mixes (saving.js askFillOf → draft/load; select.js planMixOf). The full view's own spin
 * (RetireSweep: its own pot, its own reshaped steps, its own bar) is gone.
 *
 *   whenStopOf(plan, { today, plans }) → { ok: true, inputs, env, values, mixes } | { ok: false, why }
 *     inputs   A's checked inputs: the plan read as a saver (answers/plan/saverInputs.js saverInputsOf, the one adapter the
 *              saver's verdict uses), with "show me ages" in place of the stop age
 *     env      the run's env: the day, WHEN_STOP_RUN (futures, seed, every age) and the plan's own mixes when its boxes can
 *              name them only by the nearest level
 *     values   the same inputs as the text of A's boxes (validate.js draftTextOf: parseDraft reads them back to `inputs`)
 *     mixes    what draft/load is handed beside the values (the levels the boxes hold, the plan's mixes), or null
 *   why: 'notSaving' (a plan that has stopped: nothing to ask), 'noAim' (no income given), 'invalid'
 *
 * Pure: no DOM, no storage, no clock of its own (`today` is the one clock's day).
 */
import { saverInputsOf } from '../answers/plan/saverInputs.js';
import { SCHEMA_A } from '../answers/a/schema.js';
import { checkInputs, draftTextOf } from '../answers/shared/validate.js';
import { WHEN_STOP_RUN } from './runs.js';

export function whenStopOf(plan, { today, plans = [] } = {}) {
  let read;
  try { read = saverInputsOf(plan, { today, plans }); } catch { return { ok: false, why: 'notSaving' }; }
  if (!read || !read.ok) return { ok: false, why: (read && read.why) || 'notSaving' };
  const { stop, ...rest } = read.inputs;
  void stop;
  const checked = checkInputs(SCHEMA_A, { ...rest, stop: { kind: 'ages' } }, { today });
  if (!checked.ok) return { ok: false, why: 'invalid', errors: checked.errors };
  const inputs = checked.inputs;
  const e = read.env || {};
  // the plan's own mixes and access method, as B opened from the plan runs on them (saverInputs.js saverDraftOf)
  const exact = { ...(e.mix ? { mix: e.mix, savingMix: e.savingMix || e.mix } : {}), ...(e.taxFreeTaken ? { taxFreeTaken: true } : {}) };
  const mixes = Object.keys(exact).length ? { risk: inputs.risk, savingRisk: inputs.savingRisk, ...exact } : null;
  return { ok: true, inputs, env: { today, ...WHEN_STOP_RUN, ...exact }, values: draftTextOf(SCHEMA_A, inputs), mixes };
}
