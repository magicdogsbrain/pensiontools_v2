/**
 * "Try the bad years" in the classic planner's Scenarios page (7.9.0; the build spec's §2.3). The shell's inline script only
 * shrinks, so the panel lives here: the rows are V7's (answers/plan/stressPanel.js stressPanelView, filled with
 * src/v7/copy/stressPanel.js STRESS), run in the planner's engine worker one row at a time (src/workers/engineWorker.js
 * 'stressRow', which loads answers/plan/stressPanelRun.js only then) on the plan as stored — so both apps give the same rows,
 * the same words and the same agreements. "I accept this risk" is ONE save of the whole list of agreements after a confirm on
 * the page (stressAmendPatch / stressWithdrawPatch); the held rows show the keep agreement's state and never write (that is
 * accepted on What you hold, the Transition tab). Opening the page runs nothing and writes nothing: the rows run only on the
 * button, which also draws the named stresses below them (the shell's runScenariosUI, told the rows are shown).
 *
 *   stressPanelHtml(scenario, { today })   the panel's rows, or the agreements and the keep line before anything is tried
 *   installStressPanel(w, deps)            the button and the handlers the markup names; the panel drawn when the page opens
 *   resetStressPanelMemory()               for the tests: a new page's memory
 */
import { stressPanelView, stressAmendPatch, stressWithdrawPatch, stressKeyOf, sayStress } from '../answers/plan/stressPanel.js';
import { sayKeep } from '../answers/plan/keepTest.js';
import { isClosedPlan } from '../services/PlanClosed.js';
import { STRESS as STRESS_ON } from '../answers/shared/rules.js';
import { STRESS } from '../v7/copy/stressPanel.js';
import { KEEPTEST } from '../v7/copy/keepTest.js';
import { LASTS } from '../v7/copy/lasts.js';
import { HOLD } from '../v7/copy/hold.js';
import { runInWorker, workerAvailable } from '../workers/engineClient.js';
import { esc } from './components/ReleaseNotesView.js';

const pad = (n) => String(n).padStart(2, '0');
const dayOf = (d) => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
const say = (part) => esc(sayStress(part, STRESS));

/** The Scenarios card's own words when the panel is switched off (rules.js STRESS.panel false: the page as before 7.9.0). */
export const PANEL_OFF = Object.freeze({
  title: 'Stress Scenarios',
  lead: 'The named stresses — the Great Depression, the 1970s inflation, the lost decade, 2008 — explained: what each decade did, and what retiring into it would have done to this plan, read from the one test\'s own history. No second figure.',
  run: 'Show the named stresses'
});

/**
 * The page's memory (never the plan's): the rows tried, filed under the plan's key as it was when they ran (stressKeyOf: a
 * result for another key is not read), the run's status, the row whose confirm is open, the last save's Undo and its problem.
 * Another plan empties it.
 */
const fresh = () => ({ planId: null, key: null, rows: {}, status: 'idle', reason: null, order: [], confirm: null, undo: null, problem: null });
const memory = fresh();
const idOf = (sc) => (sc && sc.id != null ? String(sc.id) : null);
const listOf = (sc) => JSON.stringify(Array.isArray(sc && sc.planAmendments) ? sc.planAmendments : []);
function forPlan(sc) { if (memory.planId !== idOf(sc)) Object.assign(memory, fresh(), { planId: idOf(sc) }); }

/** For the tests: the memory emptied, as a new page has it. */
export function resetStressPanelMemory() { Object.assign(memory, fresh()); }

/** The panel's reading for this plan today, with the rows this page holds for it. Null with no plan or the panel off. */
export function stressPanelOf(scenario, { today }) {
  if (!STRESS_ON.panel || !scenario) return null;
  forPlan(scenario);
  const v = stressPanelView(scenario, memory.rows, { today });
  const mine = memory.key === v.key;
  const status = mine ? memory.status : 'idle';
  return { ...v, run: { status, reason: mine ? memory.reason : null, done: mine ? memory.order.filter((id) => memory.rows[id] && memory.rows[id].key === v.key).length : 0, total: mine ? memory.order.length : 0 } };
}

const lineHtml = (l) => {
  const mark = l.mark === 'weighted' ? ' data-weighted="1"' : l.mark === 'fixed' ? ' data-fixed="age"' : '';
  return '<p class="stress-line" data-line="' + esc(l.id) + '"' + mark + '>' + say(l) + '</p>';
};

/** What was accepted on a row: the date and the figures, the weighted one beside its fixed-age count; out of date said. */
function acceptedHtml(p, id) {
  if (!p) return '';
  const body = p.fixed ? '<span data-weighted="1">' + say(p) + '</span><span data-fixed="age">' + say(p.fixed) + '</span>' : say(p);
  return '<p class="' + (p.stale ? 'alert alert-warning' : 'hint') + ' stress-accepted" id="' + esc(id) + '" data-status="' + (p.stale ? 'stale' : 'agreed') + '">' + body + (p.stale ? ' ' + esc(STRESS.agreement.stale) : '') + '</p>';
}

const button = (label, call, { id = '', quiet = false, disabled = false } = {}) =>
  '<button type="button"' + (quiet ? ' class="risk-btn"' : '') + (id ? ' id="' + esc(id) + '"' : '') + ' data-on-click="' + esc(call) + '"' + (disabled ? ' disabled' : '') + '>' + esc(label) + '</button>';
const actions = (inner) => '<div class="row-flex stress-actions" style="gap:8px;">' + inner + '</div>';

/** One row: its title and what it changes; its figures (or why there are none); the agreement. */
function rowHtml(row, v) {
  const p = row.parts;
  const can = !v.closed;
  const T = 'stressRow-' + row.id;
  const verdict = row.a && row.status === 'done' && !row.na && !row.same ? ' <span class="stress-verdict is-' + esc(row.a.verdict) + '" data-verdict="' + esc(row.a.verdict) + '">' + esc(LASTS.verdict.word[row.a.verdict] || '') + '</span>' : '';
  let h = '<li class="stress-row" id="' + T + '" data-row="' + esc(row.id) + '" data-status="' + esc(row.status) + '" data-same="' + (row.same ? '1' : '0') + '">';
  h += '<h3 class="stress-title">' + say(p.title) + verdict + '</h3>';
  h += p.what.map((w) => '<p class="hint">' + say(w) + '</p>').join('');
  if (p.na) h += '<p class="hint" data-na="' + esc(row.na || 'same') + '">' + (p.na.id === 'na.notCounted' ? esc(STRESS.na.notCounted) : say(p.na)) + '</p>';
  h += p.lines.map(lineHtml).join('');
  if (row.id === 'fall') h += '<p class="hint"><a href="#" id="stressBadStarts" data-on-click="showBadStarts(); return false">' + esc(STRESS.handOver) + '</a></p>';
  if (!row.kind && p.keepLine) {
    h += '<p class="' + (row.keep && row.keep.status === 'agreed' ? 'hint' : 'alert alert-info') + '" data-keep="' + esc(row.keep ? row.keep.status : '') + '">' + esc(sayKeep(p.keepLine, KEEPTEST)) + '</p>';
    h += '<p class="hint"><a href="#" data-on-click="switchToTab(\'transition\'); return false">' + esc(STRESS.held.onHold) + '</a></p>';
  }
  h += acceptedHtml(p.accepted, T + '-accepted');
  if (can && row.agreement && row.agreement.entry) h += actions(button(STRESS.agreement.withdraw, 'withdrawStressRisk(\'' + row.id + '\')', { id: T + '-withdraw', quiet: true }));
  if (can && row.canAccept && memory.confirm !== row.id) h += actions(button(STRESS.agreement.accept, 'askStressRisk(\'' + row.id + '\')', { id: T + '-accept' }));
  if (can && row.canAccept && memory.confirm === row.id && p.confirm) {
    const [before, after] = STRESS.agreement.confirm.split('{figures}');
    const f = p.confirm.figures;
    const figures = f.weighted ? '<span data-weighted="1">' + esc(f.weighted) + '</span>; <span data-fixed="age">' + esc(f.fixed) + '</span>' : esc(f.fixed);
    h += '<div class="alert alert-info stress-confirm" id="' + T + '-confirm"><p style="margin:0 0 6px;">' + esc(before) + figures + esc(after) + '</p>'
      + actions(button(STRESS.agreement.yes, 'acceptStressRisk(\'' + row.id + '\')', { id: T + '-yes' }) + button(STRESS.agreement.no, 'cancelStressRisk()', { id: T + '-no', quiet: true })) + '</div>';
  }
  return h + '</li>';
}

/** The agreements on the plan before anything is tried, each with its date, its figures and Withdraw (no run needed). */
function agreementsHtml(v) {
  if (!v.agreements.length) return '';
  let h = '<div class="stress-agreed" id="stressAgreements"><div class="section-title" style="margin-top:12px;">' + esc(STRESS.acceptedTitle) + '</div><ul class="stress-rows">';
  for (const g of v.agreements) {
    h += '<li class="stress-row" data-row="' + esc(g.id) + '" id="stressAgreement-' + esc(g.id) + '"><h3 class="stress-title">' + say(g.parts.title) + '</h3>'
      + acceptedHtml({ ...g.parts.accepted, stale: g.parts.stale }, 'stressAgreement-' + g.id + '-line')
      + (v.closed ? '' : actions(button(STRESS.agreement.withdraw, 'withdrawStressRisk(\'' + g.id + '\')', { id: 'stressAgreement-' + g.id + '-withdraw', quiet: true }))) + '</li>';
  }
  return h + '</ul></div>';
}

/** The panel (see the header): what is accepted and the keep line before the press; then the rows as they come in. */
export function stressPanelHtml(scenario, { today = dayOf(new Date()) } = {}) {
  const v = (() => { try { return stressPanelOf(scenario, { today }); } catch (e) { return null; } })();
  if (!v) return '';
  const run = v.run;
  const tried = run.status !== 'idle' || v.rows.some((r) => r.status === 'done');
  let h = '<div id="stressPanel" class="stress-panel" data-status="' + esc(run.status) + '" data-key="' + esc(v.key || '') + '">';
  if (!tried && v.keep && v.keep.line) h += '<p class="hint" id="stressKeepLine" data-status="' + esc(v.keep.status) + '">' + esc(sayKeep(v.keep.line, KEEPTEST)) + ' <a href="#" data-on-click="switchToTab(\'transition\'); return false">' + esc(STRESS.held.onHold) + '</a></p>';
  if (!tried) h += agreementsHtml(v);
  if (run.status === 'working') h += '<p class="hint" role="status" id="stressWorking">' + say({ id: 'working', slots: { i: String(Math.min(run.total, run.done + 1)), n: String(run.total) } }) + '</p>';
  if (run.status === 'failed' && run.reason !== 'stopped') h += '<p class="alert alert-warning" role="alert" id="stressFailed">' + esc(run.reason === 'noWorker' ? STRESS.noWorker : STRESS.failed) + '</p>';
  if (tried) h += '<ul class="stress-rows" id="stressRows">' + v.rows.map((row) => rowHtml(row, v)).join('') + '</ul>';
  if (memory.problem) h += '<p class="alert alert-warning" role="alert" id="stressProblem" data-problem="' + esc(memory.problem) + '">' + esc(STRESS.agreement.problems[memory.problem] || STRESS.agreement.problems.failed) + '</p>';
  if (!v.closed && memory.undo && memory.undo.after === listOf(scenario)) h += actions(button(LASTS.buttons.undo, 'undoStressRisk()', { id: 'stressUndo', quiet: true }));
  return h + '</div>';
}

/**
 * The button and the handlers the markup names: runStressPanel (the rows, one row at a time in the engine worker, As planned
 * first, then the named stresses below), askStressRisk / cancelStressRisk (the confirm on the page), acceptStressRisk (ONE
 * save of the whole list), withdrawStressRisk, undoStressRisk (the list as it was before either), showBadStarts (the real
 * starts, one at a time, on the History page). Each refuses on a closed plan. The panel is drawn when the Scenarios page
 * opens. `scenario()` is the plan as stored, `persist(list)` the shell's one save, `toast(text, kind)` its message,
 * `named(rowsShown)` the shell's named stresses, `run(type, payload)` the engine worker (engineClient.runInWorker).
 */
export function installStressPanel(w, { scenario, persist, toast, named = null, run = runInWorker, canRun = workerAvailable, today = () => dayOf(new Date()) }) {
  const doc = w.document;
  const el = (id) => (doc ? doc.getElementById(id) : null);
  const draw = async () => {
    const box = el('stressPanelRows');
    if (!box) return;
    let sc = null;
    try { sc = await scenario(); } catch (e) { sc = null; }
    box.innerHTML = stressPanelHtml(sc, { today: today() });
    const btn = el('stressPanelRun');
    if (btn) { const busy = memory.status === 'working'; btn.disabled = busy; btn.textContent = !STRESS_ON.panel ? PANEL_OFF.run : Object.keys(memory.rows).length ? STRESS.again : STRESS.run; }
  };
  // the card's own words: STRESS's, or the page as it was with the panel switched off
  const words = STRESS_ON.panel ? { title: STRESS.title, lead: STRESS.lead, run: STRESS.run } : PANEL_OFF;
  for (const [id, k] of [['stressPanelTitle', 'title'], ['stressPanelLead', 'lead'], ['stressPanelRun', 'run']]) { const x = el(id); if (x) x.textContent = words[k]; }
  const closed = (sc) => { if (!isClosedPlan(sc)) return false; toast(HOLD.problems.readonly, 'error'); return true; };

  w.drawStressPanel = draw;
  w.showBadStarts = () => { const t = doc && doc.querySelector('.sub-tab[data-stresstab="historical"]'); if (t) t.click(); };
  w.runStressPanel = async () => {
    if (!STRESS_ON.panel) { if (named) await named(false); return; }
    if (memory.status === 'working') return;
    const sc0 = await scenario();
    if (!sc0) { if (named) await named(false); return; }
    if (closed(sc0)) return;
    forPlan(sc0);
    const day = today();
    const v = stressPanelView(sc0, {}, { today: day });
    Object.assign(memory, { key: v.key, rows: {}, status: 'working', reason: null, order: v.order.slice(), confirm: null, problem: null });
    await draw();
    const namedRun = named ? Promise.resolve().then(() => named(true)).catch(() => {}) : null;   // the named stresses below, told the rows are above
    try {
      if (!canRun()) throw Object.assign(new Error('no worker'), { code: 'noWorker' });
      for (const id of v.order) {
        const sc = await scenario();
        // another plan, or this one changed under the run (its key moved): stopped; the rows so far stay under their key
        if (idOf(sc) !== memory.planId || stressKeyOf(sc, day) !== v.key || memory.key !== v.key) { if (memory.key === v.key) memory.status = 'idle'; break; }
        const result = await run('stressRow', { plan: sc, today: day, row: id });
        if (memory.key !== v.key) break;
        if (!result || typeof result !== 'object') throw new Error('no result');
        memory.rows[id] = result;
        await draw();
      }
      if (memory.key === v.key && memory.status === 'working') memory.status = 'done';
    } catch (e) {
      if (memory.key === v.key) { memory.status = 'failed'; memory.reason = e && e.code === 'noWorker' ? 'noWorker' : null; }
    }
    await draw();
    if (namedRun) await namedRun;
  };
  w.askStressRisk = (id) => { memory.confirm = id; memory.problem = null; draw(); };
  w.cancelStressRisk = () => { memory.confirm = null; draw(); };
  w.acceptStressRisk = async (id) => {
    try {
      const sc = await scenario();
      if (!sc || closed(sc)) return;
      forPlan(sc);
      const day = today();
      const v = stressPanelView(sc, memory.rows, { today: day });
      const row = v.rows.find((r) => r.id === id);
      // the result is for this plan as it is now, or nothing is written (the plan changed since: try the lines again)
      const p = stressAmendPatch(sc, { id, result: memory.rows[id], same: !!(row && row.same) }, { at: new Date().toISOString(), today: day });
      memory.confirm = null;
      if (!p.ok) { memory.problem = p.problem; await draw(); return; }
      await persist(p.patch.planAmendments);
      memory.problem = null;
      memory.undo = { before: p.previous.planAmendments, after: JSON.stringify(p.patch.planAmendments) };
      toast(sayStress({ id: 'agreement.acceptedNow', slots: p.line.slots }, STRESS), 'success');
    } catch (e) { toast(STRESS.agreement.problems.failed, 'error'); }
    await draw();
  };
  w.withdrawStressRisk = async (id) => {
    try {
      const sc = await scenario();
      if (!sc || closed(sc)) return;
      forPlan(sc);
      const p = stressWithdrawPatch(sc, id);
      if (!p.ok) return;
      await persist(p.patch.planAmendments);
      memory.problem = null;
      memory.undo = { before: p.previous.planAmendments, after: JSON.stringify(p.patch.planAmendments) };
      toast(sayStress({ id: 'agreement.withdrawn', slots: p.line.slots }, STRESS), 'success');
    } catch (e) { toast(STRESS.agreement.problems.failed, 'error'); }
    await draw();
  };
  // Undo: the list put back as it was before the last accept or withdraw — ONE save, only while nothing else changed it
  w.undoStressRisk = async () => {
    try {
      const sc = await scenario();
      if (!sc || closed(sc)) return;
      forPlan(sc);
      const u = memory.undo;
      if (!u || u.after !== listOf(sc)) { memory.undo = null; await draw(); return; }
      await persist(Array.isArray(u.before) ? u.before : []);
      memory.undo = null;
      toast(LASTS.toast.undone, 'success');
    } catch (e) { toast(STRESS.agreement.problems.failed, 'error'); }
    await draw();
  };
  // the panel drawn (no run, no write) whenever the Scenarios page opens
  const tab = doc && doc.querySelector('.sub-tab[data-stresstab="scenarios"]');
  if (tab) tab.addEventListener('click', () => { draw(); });
}
