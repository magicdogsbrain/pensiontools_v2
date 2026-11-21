/**
 * The full view's lock and unlock (step F5, lead4.md D18): the simple view's ONE write path, so a plan locked or unlocked
 * in either view is written the same, field for field. Until now the full view locked in three writes (the Decision
 * settings seeded, then PlanLock.lockPlanIfNeeded's flags and position, then the document built from the page: its name
 * from the page, its budget essentials from a page global) and unlocked in two.
 *
 *   documentRunOf(plan, entries, { today, runInWorker, inline })   the run the document is built from: lastsRun.js
 *       runForDocument on the plan and the day, in the page's worker (the 'document' job), inline when there is no worker;
 *       the budget's essentials read from the plan (lock.js shapeRefsOf), as the simple view's lock reads them
 *   lockWrite({ planId, plan, entries, now, run, save })     lock.js lockPatch (the Decision tool seeded, the flags, the plan
 *       of record, the document from documentFor, the journey) in ONE write; refused as the simple view refuses it
 *   unlockWrite({ planId, plan, now, save })                 lock.js unlockPatch in ONE write
 *   documentWrite({ planId, plan, entries, now, run, save }) lock.js documentPatch ("a new version"): the current document
 *       archived and a new one built by documentFor, in ONE write
 *
 * `plan` is the plan as the reading sees it (brought up to date in memory, homeBannerUi.entriesOf), `save(id, patch)` the
 * store's one write (FirestoreService.saveScenario: dotted paths). Nothing here reads a clock, the page or a repository.
 */
import { lockPatch, unlockPatch, documentPatch, shapeRefsOf } from '../answers/plan/lock.js';

/** The run the plan document is built from (the header). */
export async function documentRunOf(plan, entries, { today, runInWorker = null, inline = null } = {}) {
  const essentials = shapeRefsOf(plan, entries || []).essentials;
  if (typeof runInWorker === 'function') {
    try { const out = await runInWorker('document', { plan, today, essentials }); if (out && out.p && out.r) return out; } catch (e) { /* inline below */ }
  }
  return typeof inline === 'function' ? inline(plan, { today, essentials }) : null;
}

/** The lock in one write (the header). @returns lockPatch's result, written when ok */
export async function lockWrite({ planId, plan, entries = [], now, run, save }) {
  const p = lockPatch(plan, { now, run, entries });
  if (!p.ok) return p;
  await save(planId, p.patch);
  return p;
}

/** The unlock in one write (the header). @returns unlockPatch's result, written when ok */
export async function unlockWrite({ planId, plan, now, save }) {
  const p = unlockPatch(plan, { now });
  if (!p.ok) return p;
  await save(planId, p.patch);
  return p;
}

/** A new version of the plan document in one write (the header). @returns documentPatch's result, written when ok */
export async function documentWrite({ planId, plan, entries = [], now, run, save }) {
  const p = documentPatch(plan, { now, run, entries });
  if (!p.ok) return p;
  await save(planId, p.patch);
  return p;
}

/** A refusal in words for a toast (lock.js's reasons). */
export const LOCK_REFUSALS = Object.freeze({
  locked: 'This plan is already locked.', notLocked: 'This plan is not locked.', closed: 'A closed plan is kept as it was.',
  noRun: 'The plan could not be worked out, so nothing was locked.', unaffordable: 'This way of drawing cannot be paid for from the pots, so nothing was locked.',
  notHere: 'The plan could not be read, so nothing was changed.'
});
