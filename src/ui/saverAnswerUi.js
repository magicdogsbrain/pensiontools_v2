/**
 * The full view's "Am I on course?" on the Accumulation tab (7.12.0, research P2.4): the same answer block as the simple
 * view's plan home — the same reader (v7/state/saverBlock.js saverBlockOf) on the same reading of the plan
 * (answers/plan/saving.js saverVerdictOf: question B on the plan's own figures) and the same run (question B at 1,000
 * futures, seed 0, as the simple view's runner asks it) — so the two views say the same words. The full view's own second
 * check (a fixed-rate table against a required pot) is gone. What you want and the age you stop are changed on the simple
 * view's "What you pay in", one press away.
 *
 *   saverAnswerBlock(entries, planId, { today, answer })   the block, pure: null for a plan not saving
 *   saverBlockText(line)                                   one line's words
 *   saverBlockHtml(block, planId)                          the block as HTML (escaped)
 *   paintSaverAnswer(doc, deps)                            index.html: reads the plans, draws "Working…", runs B, draws the block
 *
 * Nothing is written.
 */
import { saverVerdictOf } from '../answers/plan/saving.js';
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

export function saverBlockHtml(block, planId) {
  const W = HOME.saver;
  const link = '<p style="margin:8px 0 0;"><a href="' + esc(simpleLinkHref(planId).replace(/#\/plan\/([^/]+)$/, '#/plan/$1/saving')) + '" data-testid="ac.saver.change">' + esc(W.change) + '</a></p>';
  if (!block) return '';
  if (block.state === 'noAim') return '<div data-testid="ac.saver" data-why="noAim"><p>' + esc(W.noAim) + '</p>' + link + '</div>';
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
export async function paintSaverAnswer(doc, deps) {
  const el = doc.getElementById('acOnTrack');
  if (!el) return null;
  try {
    const now = deps.now ? deps.now() : new Date();
    const today = dayOf(now);
    const [plans, id] = await Promise.all([deps.listScenariosAsync(), deps.getActiveScenarioId()]);
    const entries = entriesOf(plans, now);
    const first = saverAnswerBlock(entries, id, { today });
    if (!first) { el.innerHTML = '<p style="font-size:13px;color:var(--text-muted);">' + esc(SAVING.stopped) + '</p>'; return null; }
    el.innerHTML = saverBlockHtml(first, id);
    if (first.state !== 'working') return first;
    await new Promise((r) => setTimeout(r, 30));   // let "Working…" paint
    const { answerB } = await import('../answers/b/answer.js');
    const block = saverAnswerBlock(entries, id, { today, answer: answerB });
    el.innerHTML = saverBlockHtml(block, id);
    return block;
  } catch (e) {
    el.innerHTML = '<div class="alert alert-warning">' + esc(HOME.saver.failed) + '</div>';
    return null;
  }
}
