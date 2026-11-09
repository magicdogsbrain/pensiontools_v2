/**
 * "Keep this" and money expected later in the classic planner's Transition tab (7.6.0). The shell's inline script only
 * shrinks, so its handlers live here: each change is ONE save of the record (HoldingsRecord.holdingsWith, the very change V7
 * makes through answers/plan/hold.js holdPatch), and the gaps are V7's reading (answers/plan/gaps.js), so both apps say the
 * same thing.
 */
import { holdingsWith } from '../services/HoldingsRecord.js';
import { gapsOf, gapsView } from '../answers/plan/gaps.js';
import { keepTestOf, amendPatch, withdrawPatch, sayKeep } from '../answers/plan/keepTest.js';
import { keepFingerprint } from '../services/PlanAmendments.js';
import { KEEPTEST } from '../v7/copy/keepTest.js';
import { HOLD } from '../v7/copy/hold.js';
import { esc } from './components/ReleaseNotesView.js';

const pad = (n) => String(n).padStart(2, '0');
const dayOf = (d) => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());

/** "2027/28, 2028" → [2027, 2028]: the April each tax year starts. */
export function parseTaxYears(text) {
  return [...new Set(String(text || '').split(/[,;\s]+/).map((t) => { const m = /^(20\d{2})/.exec(t.trim()); return m ? +m[1] : null; }).filter(Boolean))];
}

/**
 * The keep a choice in the "Keep this" box makes: '' none, 'rung' (the years it had, else `firstYear` — the plan's year the
 * gilt matures in, or its first open year, which the page works out), 'mine', 'mineGaps'. A 'rung' with no year to name is
 * nothing to save (null with `wait`).
 */
export function keepOfChoice(value, was, firstYear = null) {
  if (value === 'rung') {
    if (was && was.as === 'rung' && Array.isArray(was.taxYears) && was.taxYears.length) return { as: 'rung', taxYears: was.taxYears };
    return +firstYear > 2000 ? { as: 'rung', taxYears: [+firstYear] } : { wait: true };
  }
  if (value === 'mine') return { as: 'mine', fundsGaps: false };
  if (value === 'mineGaps') return { as: 'mine', fundsGaps: true };
  return null;
}

/** The gaps as the Transition tab draws them: V7's reading of the plan with this record; null when it keeps nothing. */
export function transitionGaps(scenario, rec, today = new Date()) {
  if (!scenario) return null;
  try { return gapsView(gapsOf({ ...scenario, holdings: rec }, { today: dayOf(today) })); } catch { return null; }
}

/**
 * The handlers the Transition tab's markup names (TransitionView.js): keepHolding, keepHoldingYears, addExpected,
 * removeExpected. `draft()` is the record on screen, `persist(record)` the shell's one save, `toast(text, kind)` its message.
 */
export function installKeepHandlers(w, { draft, persist, toast }) {
  const save = (change) => { const d = draft(); if (!d) return; Promise.resolve().then(() => persist(holdingsWith(d, change, { today: new Date() }))).catch((e) => toast('Could not save what you hold: ' + e.message, 'error')); };
  w.keepHolding = (i, v, firstYear) => {
    const d = draft(); if (!d || !d.lines || !d.lines[i]) return;
    const keep = keepOfChoice(v, d.lines[i].keep, firstYear);
    if (keep && keep.wait) { toast('Type the tax years it stands in for, like 2027/28.', 'error'); return; }
    save({ kind: 'keep', index: i, keep });
  };
  w.keepHoldingYears = (i, text) => { const ys = parseTaxYears(text); if (!ys.length) { toast('Type at least one tax year, like 2027/28.', 'error'); return; } save({ kind: 'keep', index: i, keep: { as: 'rung', taxYears: ys } }); };
  w.addExpected = () => {
    const g = (id) => { const el = w.document && w.document.getElementById(id); return el ? String(el.value || '').trim() : ''; };
    const amount = +g('hlExpAmount');
    if (!(amount > 0)) { toast('Type the amount you expect.', 'error'); return; }
    save({ kind: 'expected', op: 'add', item: { label: g('hlExpLabel') || null, amount, by: g('hlExpBy') || null, wrapper: 'SIPP' } });
  };
  w.removeExpected = (id) => save({ kind: 'expected', op: 'remove', id });
}

// ---- "Test what you keep against your plan" and "I accept this risk" (7.7.0) -------------------------------------------------

/**
 * The page's memory of the re-test (never the plan's): the result for the plan as it is now (its fingerprint), whether one is
 * under way, and whether the confirm is open. Opening the tab runs nothing and writes nothing.
 */
const memory = { result: null, status: 'idle', confirm: false };

/** The reading the Transition tab draws: V7's (answers/plan/keepTest.js keepTestOf) with this page's re-test. Null on a plan that keeps nothing. */
export function transitionKeepTest(scenario, rec) {
  if (!scenario) return null;
  try {
    const plan = { ...scenario, holdings: rec || scenario.holdings };
    const fresh = !!(memory.result && memory.result.fingerprint === keepFingerprint(plan.holdings));
    const v = keepTestOf(plan, { result: memory.result, run: { status: fresh ? 'done' : memory.status === 'working' || memory.status === 'failed' ? memory.status : 'idle', reason: null } });
    return v ? { ...v, confirmOpen: memory.confirm } : null;
  } catch { return null; }
}

/** One sentence of the shared words (src/v7/copy/keepTest.js), filled — the same words V7 says. */
export const keepWords = (part) => sayKeep(part, KEEPTEST);

/** The one line the plan document's "Where you are" says about what is kept and agreed (nothing on a plan that keeps nothing). */
export function keepLineHtml(scenario) {
  if (!scenario) return '';
  try {
    const v = keepTestOf(scenario, {});
    if (!v || !v.line) return '';
    return '<p class="hint pd-keep" id="planDocKeepLine" data-status="' + esc(v.status) + '" style="margin:6px 0 0;">' + esc(keepWords(v.line)) + '</p>';
  } catch { return ''; }
}

/**
 * The handlers the Transition tab's keep-test block names: runKeepTest (the plan's own test as locked and as held, on the
 * engine loaded only now), askKeepRisk / cancelKeepRisk (the confirm on the page), acceptKeepRisk (ONE save of the whole list
 * of agreements), withdrawKeepRisk (the list without its last). `scenario()` is the plan as stored, `persist(list)` the shell's
 * one save, `rerender()` the tab drawn again, `toast(text, kind)` its message.
 */
export function installKeepTestHandlers(w, { scenario, persist, rerender, toast }) {
  w.runKeepTest = async () => {
    if (memory.status === 'working') return;
    memory.status = 'working'; memory.result = null; memory.confirm = false;
    await rerender();
    try {
      const sc = await scenario();
      const { runKeepRetest } = await import('../answers/plan/keepRun.js');
      await new Promise((r) => setTimeout(r, 30));   // let the page say it is testing before the engine takes the thread
      memory.result = runKeepRetest(sc, { today: dayOf(new Date()) });
      memory.status = 'done';
    } catch (e) { memory.status = 'failed'; memory.result = null; toast(KEEPTEST.failed, 'error'); }
    await rerender();
  };
  w.askKeepRisk = () => { memory.confirm = true; rerender(); };
  w.cancelKeepRisk = () => { memory.confirm = false; rerender(); };
  w.acceptKeepRisk = async () => {
    try {
      const sc = await scenario();
      const p = amendPatch(sc, memory.result, { at: new Date().toISOString() });
      if (!p.ok) { toast(HOLD.problems[p.problem] || KEEPTEST.failed, 'error'); return; }
      await persist(p.patch.planAmendments);
      memory.confirm = false;
      toast(HOLD.toast.agreed.replace('{date}', p.line.slots.date), 'success');
    } catch (e) { toast('Could not save: ' + e.message, 'error'); }
    await rerender();
  };
  w.withdrawKeepRisk = async () => {
    try {
      const sc = await scenario();
      const p = withdrawPatch(sc);
      if (!p.ok) return;
      await persist(p.patch.planAmendments);
      toast(HOLD.toast.withdrawn.replace('{date}', p.line.slots.date), 'success');
    } catch (e) { toast('Could not save: ' + e.message, 'error'); }
    await rerender();
  };
}
