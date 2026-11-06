/**
 * "Move the plan's start" on a locked plan (research/plan-start.md §4 "Migration of existing plans", §6 decisions 4–7, 12):
 * the move services/PlanMove.js works out, as ONE write — the planner's action (index.html moveLockedPlanStart) sends it,
 * and from 6.55.0 the preview's (effects/planWrite.js moveStart, from a locked plan's "About you and when").
 * Pure: a plan already brought up to date in memory, the clock as `now`, and the strategy's run of the MOVED plan in (the
 * planner's own run, or lastsRun.js runForDocument on movedPlanOf's plan); the exact dotted field paths out, every one
 * declared in schema.js MOVE_START_WRITES.
 *
 *   movedPlanOf(plan, { now })              the plan as the move leaves it, in memory, for the run: both copies of the
 *                                           settings moved, where the lock's pots stood said again (`lockedPosition`), and
 *                                           no document — so every reader (PlanFromToday.lockedPotsAsOf) reads the plan from
 *                                           that position, as it will once the new document is written
 *   movePatch(plan, { now, run, entries })  the write, in the order of research/plan-start.md §4:
 *     1. the plan document and the plan of record into their archives (the last ten kept), as an unlock archives them —
 *        the lock is not lifted and no default of an unlock is written (PlanCommit.unlockPatchesOf is not called);
 *     2. both copies of the settings, each key the move changes, and the strategy block's counts of years from year 0 (the
 *        guard's `reAnchor` allowance checks every one);
 *     3–4. the recorded months re-stamped, their fields that name the old year 0 rewritten (PlanMove.reAnchorRecords);
 *     5. the plan of record from the moved Decision settings, from where the lock's pots stood (the years lived before
 *        then rows of the plan's own schedule), and the plan document from the run: the ladder bought from the tax year the
 *        pots belong to, no year lived bought again, no cash set aside to a start that has passed;
 *     6. one journey entry — which the new document carries too, so it says why it was written again.
 * Nothing here runs the engine, writes, or reads a clock.
 */
import { planStage } from '../../services/PlanReading.js';
import { planOfRecordFor } from '../../services/PlanCommit.js';
import { planMoveOf, moveJourneyEntry, REANCHOR_STRESS_KEYS, REANCHOR_DECISION_KEYS } from '../../services/PlanMove.js';
import { taxYearLabel } from '../../services/PlanTiming.js';
import { MOVE_START_WRITES } from './schema.js';
import { applyPatch } from './about.js';
import { documentFor, archived } from './documentFor.js';

const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const copy = (v) => (v === undefined ? undefined : JSON.parse(JSON.stringify(v)));
const text = (v) => (v === undefined ? '<absent>' : JSON.stringify(v));
const refused = (why) => ({ ok: false, errors: { plan: why }, patch: {}, previous: {}, line: null });
const runOk = (run) => !!(run && isObj(run) && isObj(run.p) && isObj(run.r));

/**
 * Why the plan was written again after its lock, naming the new start: plan vs actual's heading reads it from the plan of
 * record (`rewrittenFor`, planStartUi.planVsActualWords). The new document keeps it as its `note`, for the record only (no
 * page shows it: the document says why through its journey entry and "As written on …"), and as `lockedBy` when the lock
 * named none.
 */
export const noteMoved = (to) => 'start moved to ' + taxYearLabel(to);

/** The settings keys the move changes, as dotted paths (only those that change). */
function settingsPatch(plan, move) {
  const patch = {}, previous = {};
  const ss = (plan.stressTool && isObj(plan.stressTool.settings)) ? plan.stressTool.settings : {};
  const ds = (plan.decisionTool && isObj(plan.decisionTool.settings)) ? plan.decisionTool.settings : {};
  for (const k of REANCHOR_STRESS_KEYS) if (text(move.stress[k]) !== text(ss[k])) { patch['stressTool.settings.' + k] = copy(move.stress[k]); previous['stressTool.settings.' + k] = copy(ss[k]); }
  for (const k of REANCHOR_DECISION_KEYS) if (text(move.decision[k]) !== text(ds[k])) { patch['decisionTool.settings.' + k] = copy(move.decision[k]); previous['decisionTool.settings.' + k] = copy(ds[k]); }
  return { patch, previous };
}

/**
 * The plan as the move leaves it, in memory (the module note), and the move itself; null when the plan is not offered one
 * (PlanMove.moveOfferOf: locked, says when work stopped, and that tax year is earlier than its year 0).
 * @returns {null | { move: object, plan: object }}
 */
export function movedPlanOf(plan, { now }) {
  if (!plan || !isObj(plan)) return null;
  const move = planMoveOf(plan, now);
  if (!move) return null;
  return { move, plan: applyPatch(plan, { ...settingsPatch(plan, move).patch, planDocument: null }) };
}

/**
 * The move, as one patch (the module note). `run` is the strategy's run of movedPlanOf's plan ({ p, r }, plain data).
 * @returns {{ ok: boolean, errors: object, patch: object, previous: object, line: object|null, move?: object }}
 */
export function movePatch(plan, { now, run, entries = [] }) {
  if (!plan || !isObj(plan)) return refused('notHere');
  const mp = movedPlanOf(plan, { now });
  if (!mp) return refused('noMove');
  if (!runOk(run)) return refused('noRun');
  const { move } = mp;
  const at = now.toISOString();
  const dt = plan.decisionTool || {};
  const ds = isObj(dt.settings) ? dt.settings : {};
  const patch = {}, previous = {};
  const set = (k, v, was) => { patch[k] = v; previous[k] = copy(was); };
  // 1. the document and the plan of record into their archives (written whole below)
  // 2. the settings
  const sp = settingsPatch(plan, move);
  Object.assign(patch, sp.patch); Object.assign(previous, sp.previous);
  if (text(move.strategy) !== text(plan.strategy)) set('strategy.params', copy(move.strategy.params), plan.strategy && plan.strategy.params);
  // 3–4. the recorded months
  if (Array.isArray(dt.history) && dt.history.length) set('decisionTool.history', move.history, dt.history);
  // 5. the plan of record, counted from where the lock's pots stood (its rows keep their plan-year index), dated today
  const lockDay = ds.lockedAt && Number.isFinite(new Date(ds.lockedAt).getTime()) ? new Date(ds.lockedAt) : now;
  set('decisionTool.planOfRecordArchive', archived(dt.planOfRecordArchive, dt.planOfRecord || null, at), dt.planOfRecordArchive);
  // `rewrittenFor` says why it was written after the lock (plan vs actual's heading: planStartUi.planVsActualWords)
  set('decisionTool.planOfRecord', { ...planOfRecordFor(move.decision, lockDay), savedAt: at, rewrittenFor: noteMoved(move.to) }, dt.planOfRecord);
  // 6. one journey entry, at the stage the move leaves the plan in (the stage does not hang on the document)
  const stage = planStage(mp.plan, { now });
  const journey = [...(Array.isArray(plan.journey) ? plan.journey : []), moveJourneyEntry(move, stage.key, now)].slice(-40);
  set('journey', journey, plan.journey);
  // …and the plan document from the run of the moved plan, its journey with the move in it (the document keeps the journey:
  // it says why it was written again); the lock's date and who made it kept
  const doc = documentFor({ ...mp.plan, journey }, { now, run, entries, lockedAt: ds.lockedAt || null, lockedBy: ds.lockedBy || noteMoved(move.to) });
  doc.note = noteMoved(move.to);
  set('planDocumentArchive', archived(plan.planDocumentArchive, plan.planDocument || null, at), plan.planDocumentArchive);
  set('planDocument', doc, plan.planDocument);
  for (const k of Object.keys(patch)) if (!MOVE_START_WRITES.includes(k)) throw new Error('movePatch: "' + k + '" is not a declared field path');
  return { ok: true, errors: {}, patch, previous, line: { id: 'moved', slots: { year: taxYearLabel(move.to) } }, move };
}
