/**
 * "Lock plan & create the plan document" on the full view's Stress settings (7.12.0, lifted out of index.html): signed in, not
 * locked already, the question, the settings saved, then the plan run once — and a way of drawing that cannot be paid for
 * (PlanCommit.lockFitOf, the same reading V7's lock uses) is refused with the one sentence (plannerWords.lockFitWords), and
 * nothing is locked or written. Otherwise the run is handed to the shell's commitPlanLock, so the document is built from it.
 * The shell's own functions are passed in (as homeBannerUi.js takes them); nothing here touches storage itself.
 */
import { lockFitOf } from '../services/PlanCommit.js';
import { lockFitWords, lockFromStressQuestion } from './plannerWords.js';
import { LOCK } from '../v7/copy/lock.js';
import { esc } from './components/ReleaseNotesView.js';

/**
 * @param {object} w   the window
 * @param {{ isLoggedIn, planIsLocked, appConfirm, saveStressSettingsUI, runPlan, commitPlanLock, showToast, openPlanDocument, showIncome? }} d
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
      if (!(await d.saveStressSettingsUI())) return;   // the form refused (a date, a figure): say nothing more, lock nothing
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
