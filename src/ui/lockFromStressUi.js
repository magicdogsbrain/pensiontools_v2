/**
 * "Lock plan & create the plan document" on the full view's Stress settings (7.12.0, lifted out of index.html): signed in, not
 * locked already, the question, a change still waiting to go sent (the boxes save themselves, lead4.md R3), then the plan run
 * once — and a way of drawing that cannot be paid for (PlanCommit.lockFitOf, the same reading V7's lock uses) is refused with
 * the one sentence (plannerWords.lockFitWords), and nothing is locked or written. Otherwise the run is handed to the shell's
 * commitPlanLock, so the document is built from it, in the lock's ONE write (step F5).
 * The lock never runs the Settings save: that wrote the whole form as it stood, a second write the simple view's lock does
 * not make. The shell's own functions are passed in (as homeBannerUi.js takes them); nothing here touches storage itself.
 *
 *   installLockFromStress(w, d)        window.lockPlanFromStress
 *   settleBeforeLock({ autosave, flushAll, showToast, outcomeWords, fixBox })   true when nothing typed is left unsaved: a
 *       box with a problem is said beside it and stops the lock; a change waiting to go is sent (the Settings form's,
 *       the Accumulation plan's and the Budget's, as leaving the page sends them); one that could not be written says why
 *       and stops the lock
 */
import { lockFitOf } from '../services/PlanCommit.js';
import { lockFitWords, lockFromStressQuestion } from './plannerWords.js';
import { LOCK } from '../v7/copy/lock.js';
import { esc } from './components/ReleaseNotesView.js';

/** What a waiting change came to (settingsAutosave.js flush): these let the lock go on. */
const SETTLED = new Set(['saved', 'nothing', undefined, null]);

/** The header. */
export async function settleBeforeLock({ autosave = null, flushAll = null, showToast = () => {}, outcomeWords = {}, fixBox = '' } = {}) {
  if (autosave && typeof autosave.checkNow === 'function' && !autosave.checkNow()) { showToast(fixBox, 'error', 8000); return false; }
  const outs = typeof flushAll === 'function' ? await flushAll() : (autosave ? [await autosave.flush()] : []);
  const bad = (Array.isArray(outs) ? outs : [outs]).find((o) => !SETTLED.has(o));
  if (bad) { showToast(outcomeWords[bad] || outcomeWords.notSaved || '', 'error', 8000); return false; }
  return true;
}

/**
 * @param {object} w   the window
 * @param {{ isLoggedIn, planIsLocked, appConfirm, settle, runPlan, commitPlanLock, showToast, openPlanDocument, showIncome? }} d
 *   settle() → true when nothing typed is left unsaved (settleBeforeLock)
 *   runPlan() → { p, r, savingPath, success }: the plan document's run (lastsRun.js runForDocument; step F5), the one the
 *   document is built from
 */
export function installLockFromStress(w, d) {
  w.lockPlanFromStress = async function () {
    if (!d.isLoggedIn()) { d.showToast('Please sign in first', 'error'); return; }
    if (await d.planIsLocked()) { d.showToast('This plan is already locked.', 'info'); return; }
    const q = lockFromStressQuestion();
    if (!(await d.appConfirm({ html: q.html }, { okLabel: q.okLabel, cancelLabel: q.cancelLabel }))) return;
    try {
      if (!(await d.settle())) return;   // a box with a problem, or a change that could not be saved: said, nothing locked
      const run = await d.runPlan();
      const fit = lockFitOf(run);
      if (fit) {
        const U = LOCK.unaffordable;
        const go = await d.appConfirm({ html: '<p style="font-size:14px;margin:0;">' + esc(lockFitWords(fit)) + '</p>' }, { okLabel: U.income, cancelLabel: U.close, danger: false });
        if (go && d.showIncome) d.showIncome();
        return;
      }
      const fresh = await d.commitPlanLock('locked from Stress settings', run);   // the run the fit was read from: the document is built from it (step F5)
      d.showToast('Plan locked' + (fresh ? '' : ' (it was already locked)') + ' — plan document written.', 'success', 5000);
      d.openPlanDocument();
    } catch (e) { console.error('Lock from Stress:', e); d.showToast('Could not lock: ' + e.message, 'error'); }
  };
}
