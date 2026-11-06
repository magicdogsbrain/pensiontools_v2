/**
 * "Lock the plan" in V7 (research/v7/road-to-7.md step 6; v6-usability-audit.md 2.6; your-plan.md 1.3, 7 and design
 * question 4(a); the write rules of editing-in-v7.md 1). Pure: a plan already brought up to date in memory, the clock as
 * `now`, and the worker's run (lastsRun.js runForDocument) in; the exact dotted field paths the three writes send out —
 * the planner's own lock, unlock and "new version", field for field:
 *
 *   lockPatch(plan, { now, run, entries })      index.html commitPlanLock in ONE write: the Decision tool seeded from the
 *                                               Stress settings (PlanCommit.seedDecisionFromStress, one path per key that
 *                                               changes), the lock's flags (locked, lockedAt, lockedBy), the plan of record
 *                                               when the plan has none (PlanCommit.planOfRecordFor, the planner's own
 *                                               builder), the plan document (PlanDocument.buildPlanDocument on the run's
 *                                               p and r, the budget's figures as index.html _shapeRefs makes them) and the
 *                                               journey (LifeStage.journeyAppend of the stage the lock causes)
 *   unlockPatch(plan, { now })                  PlanLock.unlockPlan + the repository's two archives + the Stress defaults an
 *                                               unlock gives a plan locked before a setting existed (PlanCommit.unlockPatchesOf)
 *   documentPatch(plan, { now, run, entries })  index.html createPlanDocumentNow: the current document into the archive
 *                                               (the last ten kept), a new one built from today's settings; on a locked
 *                                               plan with no document yet, the document written for the first time
 *   isLockReversal(stored, data, lockedAt)      the one write the lock guard is not asked about: Undo of a lock THIS page
 *                                               made (within the toast's time), the exact reverse of lockPatch
 *   shapeRefsOf(plan, entries)                  the budget's essentials and total a year before tax, as the planner's
 *                                               _shapeRefs reads them (the household's shared budget included)
 *
 * Every path is declared in schema.js (LOCK_WRITES, UNLOCK_WRITES, DOCUMENT_WRITES) and the effect refuses any other.
 * Nothing here runs the engine (the run arrives as data), writes, or reads a clock.
 */
import { effectiveStressSettings, planStage } from '../../services/PlanReading.js';
import { journeyAppend } from '../../services/LifeStage.js';
import { isLockedSettings } from '../../services/LockedPlanGuard.js';
import { isClosedPlan } from '../../services/PlanClosed.js';
import { seedDecisionFromStress, planOfRecordFor, unlockPatchesOf } from '../../services/PlanCommit.js';
import { DECISION_SEED_KEYS, LOCK_WRITES, UNLOCK_WRITES, DOCUMENT_WRITES, BOOKKEEPING_WRITES } from './schema.js';
import { applyPatch } from './about.js';
import { dayWords } from './dates.js';
// the plan document as the planner builds it, the archives and the budget's figures (6.53.0: shared with moveStart.js)
import { documentFor, archived, shapeRefsOf, ARCHIVE_KEEP } from './documentFor.js';

export { applyPatch, shapeRefsOf, ARCHIVE_KEEP };

/**
 * Who made the lock (decisionTool.settings.lockedBy): a free label the classic planner shows in its lock banner, "(since
 * 21/10/2026, locked in PensionTools)", and "Show every setting" here shows beside "By". A new lock says where it was made
 * by the site's name (7.1.0: PensionTools).
 */
export const LOCKED_BY = 'locked in PensionTools';
/** The label a lock made here carried in 7.0, when the site's name was "Drawdown Planner": kept on those plans, as every saved value is. */
export const LOCKED_BY_7_0 = 'locked in Drawdown Planner';
/**
 * The label a lock made here carried before 7.0, when this page was the preview. A plan locked then keeps it, as every saved
 * value is kept (nothing rewrites it), and its banner still says so; Undo of such a lock (isLockReversal) still works.
 */
export const LOCKED_BY_BEFORE_7 = 'locked in the preview';
/** Every label a lock made here has carried (a tab opened before 7.1.0 may still be the one pressing Undo). */
export const LOCKED_BY_HERE = Object.freeze([LOCKED_BY, LOCKED_BY_7_0, LOCKED_BY_BEFORE_7]);
/** The note a new version carries (index.html createPlanDocumentNow), and the one a first document on a plan locked earlier carries. */
export const NOTE_REFRESHED = 'document refreshed';
export const NOTE_CREATED = 'document created after lock';

const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const copy = (v) => (v === undefined ? undefined : JSON.parse(JSON.stringify(v)));
const text = (v) => (v === undefined ? '<absent>' : JSON.stringify(v));
const isLocked = (plan) => !!(plan && plan.decisionTool && isLockedSettings(plan.decisionTool.settings));
const decisionOf = (plan) => ((plan && plan.decisionTool && isObj(plan.decisionTool.settings)) ? plan.decisionTool.settings : {});
const refused = (why) => ({ ok: false, errors: { plan: why }, patch: {}, previous: {}, line: null });

const runOk = (run) => !!(run && isObj(run) && isObj(run.p) && isObj(run.r));

/**
 * The lock, as one patch (the header). `run` is lastsRun.js runForDocument's result for this plan (plain data).
 * @returns {{ ok: boolean, errors: object, patch: object, previous: object, line: object|null, lockedAt?: string }}
 */
export function lockPatch(plan, { now, run, entries = [] }) {
  if (!plan || !isObj(plan)) return refused('notHere');
  if (isLocked(plan)) return refused('locked');
  if (!runOk(run)) return refused('noRun');
  const ss = effectiveStressSettings(plan, { now });
  const ds = decisionOf(plan);
  const patch = {};
  const previous = {};
  // 1. the Decision tool seeded from the Stress settings: one path per key that changes (a key the seed leaves undefined is left as it is)
  const seeded = seedDecisionFromStress(ss, ds);
  for (const k of DECISION_SEED_KEYS) {
    const v = seeded[k];
    if (v === undefined || text(v) === text(ds[k])) continue;
    patch['decisionTool.settings.' + k] = copy(v);
    previous['decisionTool.settings.' + k] = copy(ds[k]);
  }
  // 2. the lock's flags
  const lockedAt = now.toISOString();
  for (const [k, v] of [['locked', true], ['lockedAt', lockedAt], ['lockedBy', LOCKED_BY]]) {
    patch['decisionTool.settings.' + k] = v;
    previous['decisionTool.settings.' + k] = copy(ds[k]);
  }
  // 3. the plan of record, when the plan has none (PlanLock.lockPlanIfNeeded), from the settings as seeded — before the flags, as the planner reads them
  if (!(plan.decisionTool && plan.decisionTool.planOfRecord)) {
    patch['decisionTool.planOfRecord'] = planOfRecordFor({ ...ds, ...seeded }, now);
    previous['decisionTool.planOfRecord'] = copy(plan.decisionTool && plan.decisionTool.planOfRecord);
  }
  // 4. the plan document (its journey is the plan's as it stands: the planner reads it before the stage moves)
  patch.planDocument = documentFor(plan, { now, run, entries, lockedAt, lockedBy: LOCKED_BY });
  previous.planDocument = copy(plan.planDocument);
  // 5. the journey: the stage the lock causes, dated (index.html refreshLifeStage after the lock)
  const after = applyPatch(plan, patch);
  const journey = Array.isArray(plan.journey) ? plan.journey : [];
  const next = journeyAppend(journey, planStage(after, { now }), now);
  if (next !== journey) { patch.journey = next; previous.journey = copy(plan.journey); }
  for (const k of Object.keys(patch)) if (!LOCK_WRITES.includes(k)) throw new Error('lockPatch: "' + k + '" is not a declared field path');
  return { ok: true, errors: {}, patch, previous, line: { id: 'locked', slots: { date: dayWords(lockedAt) } }, lockedAt };
}

/**
 * The unlock, as one patch (the header): the document and the plan of record each archived and cleared, the flag off,
 * the unlock dated and counted, and the Stress defaults a plan locked before a setting existed gets.
 */
export function unlockPatch(plan, { now }) {
  if (!plan || !isObj(plan)) return refused('notHere');
  if (!isLocked(plan)) return refused('notLocked');
  // a closed plan is kept as it was and never unlocked (6.56.0, PlanClosed.js): the guard refuses it too
  if (isClosedPlan(plan)) return refused('closed');
  const ds = decisionOf(plan);
  const at = now.toISOString();
  const patch = {};
  const previous = {};
  const set = (k, v, was) => { patch[k] = v; previous[k] = copy(was); };
  set('planDocumentArchive', archived(plan.planDocumentArchive, plan.planDocument || null, at), plan.planDocumentArchive);
  set('planDocument', null, plan.planDocument);
  const dt = plan.decisionTool || {};
  set('decisionTool.planOfRecordArchive', archived(dt.planOfRecordArchive, dt.planOfRecord || null, at), dt.planOfRecordArchive);
  set('decisionTool.planOfRecord', null, dt.planOfRecord);
  set('decisionTool.settings.locked', false, ds.locked);
  set('decisionTool.settings.unlockedAt', at, ds.unlockedAt);
  set('decisionTool.settings.unlockCount', (+ds.unlockCount || 0) + 1, ds.unlockCount);
  // the defaults an unlock writes (index.html unlockDecisionSettings: unlockPatchesOf on the settings the loader reads)
  const stored = (plan.stressTool && isObj(plan.stressTool.settings)) ? plan.stressTool.settings : {};
  const defaults = unlockPatchesOf(effectiveStressSettings(plan, { now })) || {};
  for (const [k, v] of Object.entries(defaults)) set('stressTool.settings.' + k, v, stored[k]);
  for (const k of Object.keys(patch)) if (!UNLOCK_WRITES.includes(k)) throw new Error('unlockPatch: "' + k + '" is not a declared field path');
  return { ok: true, errors: {}, patch, previous, line: { id: 'unlocked', slots: { date: dayWords(at), versions: String(patch.planDocumentArchive.length) } } };
}

/**
 * "Write a new version from today's settings", as one patch (the header): the current document archived and a new one
 * written; on a locked plan with no document yet, the first one (index.html createPlanDocumentNow).
 */
export function documentPatch(plan, { now, run, entries = [] }) {
  if (!plan || !isObj(plan)) return refused('notHere');
  if (!isLocked(plan)) return refused('notLocked');
  if (isClosedPlan(plan)) return refused('closed');   // its document stays as it was when it closed (6.56.0)
  if (!runOk(run)) return refused('noRun');
  const ds = decisionOf(plan);
  const prev = isObj(plan.planDocument) ? plan.planDocument : null;
  const at = now.toISOString();
  const reason = prev ? NOTE_REFRESHED : NOTE_CREATED;
  const doc = documentFor(plan, { now, run, entries, lockedAt: ds.lockedAt || null, lockedBy: ds.lockedBy || reason });
  if (reason && ds.lockedBy && reason !== ds.lockedBy) doc.note = reason;
  const patch = {};
  const previous = {};
  if (prev) { patch.planDocumentArchive = archived(plan.planDocumentArchive, prev, at); previous.planDocumentArchive = copy(plan.planDocumentArchive); }
  patch.planDocument = doc;
  previous.planDocument = copy(plan.planDocument);
  for (const k of Object.keys(patch)) if (!DOCUMENT_WRITES.includes(k)) throw new Error('documentPatch: "' + k + '" is not a declared field path');
  return { ok: true, errors: {}, patch, previous, line: { id: prev ? 'newVersion' : 'firstVersion', slots: { date: dayWords(at), versions: String(patch.planDocumentArchive ? patch.planDocumentArchive.length : 0) } } };
}

/**
 * Is `data` the exact reverse of a lock this page made at `lockedAt` (Undo within the toast's time)? The stored plan must be
 * locked here (either label, LOCKED_BY_HERE: a tab opened before 7.0 may still be the one pressing Undo) at that very moment; the write may carry only the lock's own paths and the stamp; it must put the
 * flag back off and remove the lock's date and label, the document and the plan of record. Anything else is not a reversal,
 * and goes to the lock guard like every other write.
 */
export function isLockReversal(stored, data, lockedAt) {
  const ds = decisionOf(stored);
  if (!isLockedSettings(ds) || !LOCKED_BY_HERE.includes(ds.lockedBy) || !lockedAt || ds.lockedAt !== lockedAt) return false;
  if (!data || !isObj(data)) return false;
  const keys = Object.keys(data);
  if (!keys.length || !keys.every((k) => LOCK_WRITES.includes(k) || BOOKKEEPING_WRITES.includes(k))) return false;
  if (!('decisionTool.settings.locked' in data) || data['decisionTool.settings.locked']) return false;
  if (data['decisionTool.settings.lockedAt'] != null || data['decisionTool.settings.lockedBy'] != null) return false;
  if (data.planDocument != null || data['decisionTool.planOfRecord'] != null) return false;
  return true;
}

/** The writes a lock-reversal may carry, for the tests. */
export const REVERSAL_WRITES = Object.freeze([...LOCK_WRITES, ...BOOKKEEPING_WRITES]);
