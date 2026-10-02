/**
 * Ask before a Decision month locks a saver's plan (6.20.2; the rule and the words: LifeStage.decisionLockQuestion).
 *
 * index.html asks on Calculate (setting up the month's tax year locks the plan too) and again on Save, as a safety net.
 * A "yes" is remembered for that plan until the page is reloaded, so the person is asked once, not at every step;
 * "Not now" stops and asks again next time.
 */
import { decisionLockQuestion } from '../services/LifeStage.js';
import { getActiveScenarioId } from '../storage/ScenarioRepository.js';

const said = new Set();   // plans whose owner chose "Lock the plan and carry on" during this visit

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** The dialog's body: a heading and plain paragraphs. */
export function decisionLockQuestionHtml(q) {
  return '<h3 style="margin:0 0 10px;">' + esc(q.title) + '</h3>' + q.paragraphs.map((p) => '<p style="font-size:14px;margin:0 0 8px;">' + esc(p) + '</p>').join('');
}

/**
 * @param {object|null} stage  the plan's life stage (LifeStage.deriveStage)
 * @param {{ planId?: string|null, confirm?: Function }} [opts]  for the tests; by default the open plan and the page's
 *   own appConfirm
 * @returns {Promise<boolean>} true to carry on (nothing to ask, or the person said yes); false to stop
 */
export async function askBeforeMonthLocks(stage, opts = {}) {
  const q = decisionLockQuestion(stage);
  if (!q) return true;
  const planId = 'planId' in opts ? opts.planId : await getActiveScenarioId().catch(() => null);
  if (planId != null && said.has(planId)) return true;
  const confirm = opts.confirm || window.appConfirm;
  const yes = await confirm({ html: decisionLockQuestionHtml(q) }, { okLabel: q.okLabel, cancelLabel: q.cancelLabel });
  if (yes && planId != null) said.add(planId);
  return !!yes;
}
