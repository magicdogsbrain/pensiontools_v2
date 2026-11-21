/**
 * The full view's "Am I on course?" on the Accumulation tab (7.12.0, research P2.4): the same answer block as the simple
 * view's plan home — the same reader (v7/state/saverBlock.js saverBlockOf) on the same reading of the plan
 * (answers/plan/saving.js saverVerdictOf: question B on the plan's own figures) and the same run (question B once, at the
 * futures and seed of src/reading/runs.js SAVER_RUN, as the simple view's runner asks it; in the engine worker, deps.run,
 * when the page has one) — so the two views say the same words. It runs when the tab opens: nothing to press. The full view's own second
 * check (a fixed-rate table against a required pot) is gone. What you want and the age you stop are changed here too
 * (7.12.0: two boxes and Save, the same one write as the simple view's "What you pay in"), or there, one press away.
 *
 *   saverAnswerBlock(entries, planId, { today, answer })   the block, pure: null for a plan not saving
 *   saverBlockText(line)                                   one line's words
 *   saverBlockHtml(block, planId)                          the block as HTML (escaped)
 *   paintSaverAnswer(doc, deps)                            index.html: reads the plans, draws "Working…", runs B (deps.run), draws the block
 *
 * Nothing is written but by the want's Save (deps.saveWant).
 */
import { saverVerdictOf, savedWant } from '../answers/plan/saving.js';
import { saverBlockOf } from '../v7/state/saverBlock.js';
import { HOME } from '../v7/copy/home.js';
import { SAVING } from '../v7/copy/saving.js';
import { entriesOf, dayOf, simpleLinkHref } from './homeBannerUi.js';
import { SAVER_MARKS, saverSlotsOf, sentenceHtml } from '../reading/sentenceMarks.js';
import { markFact } from '../reading/mark.js';
import { fieldAttrOf } from '../reading/fields.js';
import { SAVER_RUN } from '../reading/runs.js';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const fill = (text, slots) => String(text || '').replace(/\{(\w+)\}/g, (m, k) => (slots && slots[k] != null ? String(slots[k]) : m));
/** The run the simple view's runner makes (v7/effects/saver.js): the one SAVER_RUN of both views. */
export const SAVER_ENV = SAVER_RUN;

/**
 * (7.12.0) One run per plan as it stands: question B's answer on the plan's figures, kept for the page's life by what it
 * was run on, so the Accumulation tab's answer and the Stress tester's "Will it last?" read the same run (one chance).
 * `run(inputs, env)` is the page's (index.html: the engine worker's 'saver' job, else B on the page); by default B on the
 * page, loaded when first needed.
 */
const RUNS = new Map();
// B on the page as every caller asks it (answers/index.js answerFor; the worker's 'saver' lane too): on the plan path, so a
// saved plan's verdict is that plan's own drawing years (env.fromPlan; the lead's ruling 10)
const onPage = async (inputs, env) => (await import('../answers/index.js')).answerFor('b', inputs, env);
function keptRun(run = onPage) {
  return (inputs, env) => {
    const key = JSON.stringify([inputs, env]);   // (env.fromPlan: the plan read, so a change to it asks again)
    if (RUNS.has(key)) return RUNS.get(key);
    const out = Promise.resolve().then(() => run(inputs, env));
    out.catch(() => RUNS.delete(key));
    if (RUNS.size >= 8) RUNS.delete(RUNS.keys().next().value);
    RUNS.set(key, out);
    return out;
  };
}

/**
 * (7.12.0, lead decision 3) The chance a plan still saving lasts as long as you do — the one What you pay in, the home and
 * the Accumulation tab say — for the full view's "Will it last?" to lead with. Null for a plan not saving, one that cannot
 * be read, or one whose own way of drawing buys its income (`family`: the run draws from pots, as the plan's way must).
 */
export async function savingChanceFor(plans, id, now, { family = true, run = undefined } = {}) {
  if (!family) return null;
  try {
    const entries = entriesOf(plans, now);
    const v = saverVerdictOf(entries, id, { today: dayOf(now) });
    if (!v || !v.ok) return null;
    const res = await keptRun(run)(v.inputs, { today: dayOf(now), ...SAVER_ENV, ...(v.env || {}) });
    const w = res && res.verdict && res.verdict.weighted;
    return typeof w === 'number' && Number.isFinite(w) ? w : null;
  } catch { return null; }
}

/** The block for a plan: its verdict reading and, when given, the answer function run on it. Null for a plan not saving. */
export async function saverAnswerBlock(entries, planId, { today, answer = null }) {
  const v = saverVerdictOf(entries, planId, { today });
  if (!v) return null;
  if (!v.ok || typeof answer !== 'function') return saverBlockOf(v, v.ok ? { status: 'working', result: null } : null);
  let result = null;
  try { result = await answer(v.inputs, { today, ...SAVER_ENV, ...(v.env || {}) }); } catch (e) { return saverBlockOf(v, { status: 'failed', result: null, reason: null }); }
  return saverBlockOf(v, { status: 'final', result });
}

/** One line's words: one of the answer's sentences as it is, or the block's own words filled. */
export function saverBlockText(l) {
  if (l.s) return l.s.text || '';
  if (l.id.startsWith('now.')) return fill(SAVING.payInNow[l.id.slice(4)], l.slots);
  return fill(HOME.saver.lines[l.id], l.slots);
}

/** One line as HTML, its figures marked as the simple view marks them (src/reading/sentenceMarks.js; lead4.md G1). */
export function saverLineHtml(l, result) {
  if (l.s) {
    const html = result ? sentenceHtml(l.s, result, SAVER_MARKS[l.id] || null, esc) : esc(l.s.text || '');
    return l.id === 'head' ? markFact('saver.verdict', html) : html;
  }
  const text = l.id.startsWith('now.') ? SAVING.payInNow[l.id.slice(4)] : HOME.saver.lines[l.id];
  const marks = saverSlotsOf(l.id);
  return String(text || '').split(/(\{\w+\})/).map((piece) => {
    const m = /^\{(\w+)\}$/.exec(piece);
    if (!m) return esc(piece);
    const v = l.slots && l.slots[m[1]] != null ? String(l.slots[m[1]]) : piece;
    return marks[m[1]] && v !== piece ? markFact(marks[m[1]], esc(v)) : esc(v);
  }).join('');
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
    + '<input type="text" inputmode="numeric" id="' + id + '" data-testid="' + id + '"' + fieldAttrOf('saving.' + path) + ' value="' + esc(value) + '" style="width:130px;">'
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
  const lines = block.lines.map((l) => '<p data-line="' + esc(l.id) + '"' + (l.id === 'head' ? ' style="font-weight:600;font-size:15px;"' : '') + '>' + saverLineHtml(l, block.result) + '</p>').join('');
  const tail = block.state === 'working' ? '<p role="status">' + esc(W.working) + '</p>'
    : block.state === 'failed' ? '<div class="alert alert-warning">' + esc(W.failed) + '</div>'
      : block.state === 'invalid' ? '<p>' + esc(W.invalid) + '</p>' : '';
  return '<div data-testid="ac.saver" data-verdict="' + esc(block.band || '') + '">' + lines + tail + link + '</div>';
}

/**
 * index.html: the Accumulation tab's answer, drawn when the tab opens. `deps`: listScenariosAsync, getActiveScenarioId, now
 * and run (optional: B in the engine worker; without it B runs on the page, loaded only when needed).
 */
export async function paintSaverAnswer(doc, deps, problem = null) {
  const el = doc.getElementById('acOnTrack');
  if (!el) return null;
  try {
    const now = deps.now ? deps.now() : new Date();
    const today = dayOf(now);
    const [plans, id] = await Promise.all([deps.listScenariosAsync(), deps.getActiveScenarioId()]);
    const entries = entriesOf(plans, now);
    const first = await saverAnswerBlock(entries, id, { today });
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
    // the one run (deps.run: the engine worker), never a first pass on fewer futures; "Working…" stands until it lands
    const block = await saverAnswerBlock(entries, id, { today, answer: keptRun(deps.run) });
    el.innerHTML = saverBlockHtml(block, id, form); wire();
    return block;
  } catch (e) {
    el.innerHTML = '<div class="alert alert-warning">' + esc(HOME.saver.failed) + '</div>';
    return null;
  }
}
