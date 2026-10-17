/**
 * Ask before a Decision month locks the plan — everyone, not only savers (v6 usability audit, decision 3, 17 Oct 2026;
 * the words: LifeStage.decisionLockQuestion).
 *
 * Until now the first monthly entry, or its tax-year set-up, locked an unlocked plan without a word (only a saver was
 * asked, 6.20.2) — and locked it on the Decision tool's own defaults, with no plan document. Now:
 *  - index.html asks on Calculate (setting up the month's tax year locks the plan too) and again on Save, as a safety net;
 *  - "Yes" runs the FULL lock, the same as Stress settings → "Lock plan & create the plan document": the Stress settings
 *    copied across to the Decision tool, the plan locked, the plan document written (index.html's commitPlanLock, passed
 *    in as `lock`). Only then does the month go ahead. If the lock fails, the month does not go ahead either;
 *  - "Not now" stops: the month is left unrecorded, and the question is asked again next time.
 * A plan locked this way needs no second question (the lock is on the stored plan), but the page's copy of the stage
 * may lag, so a "yes" is also remembered for that plan until the page is reloaded.
 */
import { decisionLockQuestion } from '../services/LifeStage.js';
import { getActiveScenarioId } from '../storage/ScenarioRepository.js';

const said = new Set();   // plans locked through this question during this visit

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** The dialog's body: a heading and plain paragraphs. */
export function decisionLockQuestionHtml(q) {
  return '<h3 style="margin:0 0 10px;">' + esc(q.title) + '</h3>' + q.paragraphs.map((p) => '<p style="font-size:14px;margin:0 0 8px;">' + esc(p) + '</p>').join('');
}

/** The reason stamped on the lock (decisionTool.settings.lockedBy) when it is made from this question. */
export const LOCKED_FROM_DECISION = 'first monthly entry';

/**
 * @param {object|null} stage  the plan's life stage (LifeStage.deriveStage)
 * @param {{ planId?: string|null, confirm?: Function, lock?: Function, say?: Function }} [opts]  for the tests; by default
 *   the open plan, the page's own appConfirm, its commitPlanLock (the full lock) and showToast
 * @returns {Promise<boolean>} true to carry on (nothing to ask, or the plan is now locked); false to stop
 */
export async function askBeforeMonthLocks(stage, opts = {}) {
  const q = decisionLockQuestion(stage);
  if (!q) return true;
  const planId = 'planId' in opts ? opts.planId : await getActiveScenarioId().catch(() => null);
  if (planId != null && said.has(planId)) return true;
  const confirm = opts.confirm || window.appConfirm;
  const yes = await confirm({ html: decisionLockQuestionHtml(q) }, { okLabel: q.okLabel, cancelLabel: q.cancelLabel });
  if (!yes) return false;
  const lock = opts.lock || window.commitPlanLock;
  if (typeof lock !== 'function') return false;   // no way to lock from here: never record against an unlocked plan
  try {
    await lock(LOCKED_FROM_DECISION);
  } catch (e) {
    const say = opts.say || window.showToast;
    if (typeof say === 'function') say('The plan could not be locked, so this month was not recorded: ' + (e && e.message ? e.message : e), 'error', 8000);
    return false;
  }
  if (planId != null) said.add(planId);
  return true;
}
