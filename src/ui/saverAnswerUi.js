/**
 * The full view's "Am I on course?" on the Accumulation tab (7.12.0, research P2.4): the same answer block as the simple
 * view's plan home — the same reader (v7/state/saverBlock.js saverBlockOf) on the same reading of the plan
 * (answers/plan/saving.js saverVerdictOf: question B on the plan's own figures) and the same run (question B at 1,000
 * futures, seed 0, as the simple view's runner asks it) — so the two views say the same words. The full view's own second
 * check (a fixed-rate table against a required pot) is gone. What you want and the age you stop are changed here too
 * (7.12.0: two boxes and Save, the same one write as the simple view's "What you pay in"), or there, one press away.
 *
 *   saverAnswerBlock(entries, planId, { today, answer })   the block, pure: null for a plan not saving
 *   saverBlockText(line)                                   one line's words
 *   saverBlockHtml(block, planId)                          the block as HTML (escaped)
 *   paintSaverAnswer(doc, deps)                            index.html: reads the plans, draws "Working…", runs B, draws the block
 *
 * Nothing is written but by the want's Save (deps.saveWant).
 */
import { saverVerdictOf, savedWant } from '../answers/plan/saving.js';
import { saverBlockOf } from '../v7/state/saverBlock.js';
import { HOME } from '../v7/copy/home.js';
import { SAVING } from '../v7/copy/saving.js';
import { entriesOf, dayOf, simpleLinkHref } from './homeBannerUi.js';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const fill = (text, slots) => String(text || '').replace(/\{(\w+)\}/g, (m, k) => (slots && slots[k] != null ? String(slots[k]) : m));
/** The run the simple view's runner makes (v7/effects/saver.js): 1,000 futures, the published seed, the answer's detail. */
export const SAVER_ENV = Object.freeze({ futures: 1000, seed: 0, trace: false, detail: 'answer' });

/** The block for a plan: its verdict reading and, when given, the answer function run on it. Null for a plan not saving. */
export function saverAnswerBlock(entries, planId, { today, answer = null }) {
  const v = saverVerdictOf(entries, planId, { today });
  if (!v) return null;
  if (!v.ok || typeof answer !== 'function') return saverBlockOf(v, v.ok ? { status: 'working', result: null } : null);
  let result = null;
  try { result = answer(v.inputs, { today, ...SAVER_ENV, ...(v.env || {}) }); } catch (e) { return saverBlockOf(v, { status: 'failed', result: null, reason: null }); }
  return saverBlockOf(v, { status: 'final', result });
}

/** One line's words: one of the answer's sentences as it is, or the block's own words filled. */
export function saverBlockText(l) {
  if (l.s) return l.s.text || '';
  if (l.id.startsWith('now.')) return fill(SAVING.payInNow[l.id.slice(4)], l.slots);
  return fill(HOME.saver.lines[l.id], l.slots);
}

/** (7.12.0) The full view's own words for a plan with no income yet: where it is added there. */
export const FULL_VIEW = Object.freeze({
  addIncome: 'Add what you want a year on Stress tester → Settings, under “Your income shape”.',
  openSettings: 'Open Stress tester settings'
});

/**
 * (7.12.0) What you want, changed here: the amount a month from the stop and the age you stop, in two boxes with Save —
 * the same one write as What you pay in (ScenarioRepository.saveActiveWant). `want` is savedWant's; nothing when the plan
 * is locked or not saving.
 */
export function wantFormHtml(want, problem = null) {
  if (!want || !want.open || want.locked) return '';
  const F = SAVING.want.fields;
  const E = SAVING.want.errors;
  const box = (id, path, value) => '<label class="hint" style="display:flex;flex-direction:column;gap:2px;">' + esc(F[path].label)
    + '<input type="text" inputmode="numeric" id="' + id + '" data-testid="' + id + '" value="' + esc(value) + '" style="width:130px;">'
    + (problem && problem[path] ? '<span class="error" role="alert">' + esc(E[path][problem[path]] || '') + '</span>' : '') + '</label>';
  return '<div data-testid="ac.want" style="display:flex;flex-wrap:wrap;gap:12px;align-items:flex-end;margin:10px 0 0;">'
    + box('acWantMonthly', 'want.monthly', String(Math.round(want.monthly))) + box('acWantStopAge', 'want.stopAge', String(want.stopAge))
    + '<button type="button" class="btn btn-secondary" id="acWantSave" data-testid="ac.want.save">' + esc(HOME.saver.wantSave) + '</button></div>';
}

export function saverBlockHtml(block, planId, form = '') {
  const W = HOME.saver;
  const link = form + '<p style="margin:8px 0 0;"><a href="' + esc(simpleLinkHref(planId).replace(/#\/plan\/([^/]+)$/, '#/plan/$1/saving')) + '" data-testid="ac.saver.change">' + esc(W.change) + '</a></p>';
  if (!block) return '';
  // no income yet: said, and the full view's own place to add one (7.12.0; the want boxes need a want to change)
  if (block.state === 'noAim') return '<div data-testid="ac.saver" data-why="noAim"><p>' + esc(W.noAim) + '</p><p>' + esc(FULL_VIEW.addIncome) + ' <button type="button" class="risk-btn" data-testid="ac.saver.addIncome" data-on-click="openStressSettingsTab()">' + esc(FULL_VIEW.openSettings) + '</button></p></div>';
  const lines = block.lines.map((l) => '<p data-line="' + esc(l.id) + '"' + (l.id === 'head' ? ' style="font-weight:600;font-size:15px;"' : '') + '>' + esc(saverBlockText(l)) + '</p>').join('');
  const tail = block.state === 'working' ? '<p role="status">' + esc(W.working) + '</p>'
    : block.state === 'failed' ? '<div class="alert alert-warning">' + esc(W.failed) + '</div>'
      : block.state === 'invalid' ? '<p>' + esc(W.invalid) + '</p>' : '';
  return '<div data-testid="ac.saver" data-verdict="' + esc(block.band || '') + '">' + lines + tail + link + '</div>';
}

/**
 * index.html: the Accumulation tab's answer. `deps`: listScenariosAsync, getActiveScenarioId, now (optional). The answer
 * function is loaded only when it is needed, as the worker's lanes load theirs.
 */
export async function paintSaverAnswer(doc, deps, problem = null) {
  const el = doc.getElementById('acOnTrack');
  if (!el) return null;
  try {
    const now = deps.now ? deps.now() : new Date();
    const today = dayOf(now);
    const [plans, id] = await Promise.all([deps.listScenariosAsync(), deps.getActiveScenarioId()]);
    const entries = entriesOf(plans, now);
    const first = saverAnswerBlock(entries, id, { today });
    if (!first) { el.innerHTML = '<p style="font-size:13px;color:var(--text-muted);">' + esc(SAVING.stopped) + '</p>'; return null; }
    // what you want, changeable here (7.12.0): the boxes, and Save through the one write (deps.saveWant)
    const entry = entries.find((e) => e && e.plan && String(e.plan.id) === String(id));
    let want = null; try { want = entry ? savedWant(entry.plan, { today }) : null; } catch { want = null; }
    const form = deps.saveWant ? wantFormHtml(want, problem) : '';
    const wire = () => {
      const btn = doc.getElementById('acWantSave');
      if (!btn || !deps.saveWant) return;
      btn.addEventListener('click', async () => {
        const typed = { 'want.monthly': (doc.getElementById('acWantMonthly') || {}).value || '', 'want.stopAge': (doc.getElementById('acWantStopAge') || {}).value || '' };
        let r = null; try { r = await deps.saveWant(typed); } catch { r = { ok: false, errors: {} }; }
        await paintSaverAnswer(doc, deps, r && !r.ok ? r.errors : null);
        if (r && r.ok && r.written && typeof deps.afterSave === 'function') deps.afterSave();
      });
    };
    el.innerHTML = saverBlockHtml(first, id, form); wire();
    if (first.state !== 'working') return first;
    await new Promise((r) => setTimeout(r, 30));   // let "Working…" paint
    const { answerB } = await import('../answers/b/answer.js');
    const block = saverAnswerBlock(entries, id, { today, answer: answerB });
    el.innerHTML = saverBlockHtml(block, id, form); wire();
    return block;
  } catch (e) {
    el.innerHTML = '<div class="alert alert-warning">' + esc(HOME.saver.failed) + '</div>';
    return null;
  }
}
