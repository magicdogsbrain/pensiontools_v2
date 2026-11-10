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
import { isClosedPlan } from '../services/PlanClosed.js';
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
 * The page's memory of the re-test (never the plan's): the result, for ONE plan as it was when the test ran (its id and its
 * stamp, `lastModified` — as V7 files its result under the plan's run key), whether one is under way, whether the confirm is
 * open, and the last agreement's Undo (the list before it, and the list it wrote). Another plan, or the plan changed since,
 * and the result is not read: the test is run again. Opening the tab runs nothing and writes nothing.
 */
const memory = { planId: null, stamp: null, result: null, status: 'idle', confirm: false, undo: null };
const idOf = (sc) => (sc && sc.id != null ? String(sc.id) : null);
const stampOf = (sc) => (sc && sc.lastModified != null ? String(sc.lastModified) : null);
/** The memory is for this plan: another plan empties it. */
function forPlan(sc) {
  const id = idOf(sc);
  if (memory.planId !== id) Object.assign(memory, { planId: id, stamp: null, result: null, status: 'idle', confirm: false, undo: null });
}
/** The result held, when it is for this plan as it is now (its stamp); else none. */
const resultFor = (sc) => (memory.result && memory.planId === idOf(sc) && memory.stamp === stampOf(sc) ? memory.result : null);
const listOf = (sc) => JSON.stringify(Array.isArray(sc && sc.planAmendments) ? sc.planAmendments : []);

/** For the tests: the memory emptied, as a new page has it. */
export function resetKeepTestMemory() { Object.assign(memory, { planId: null, stamp: null, result: null, status: 'idle', confirm: false, undo: null }); }

/** The reading the Transition tab draws: V7's (answers/plan/keepTest.js keepTestOf) with this page's re-test. Null on a plan that keeps nothing. */
export function transitionKeepTest(scenario, rec) {
  if (!scenario) return null;
  try {
    forPlan(scenario);
    const plan = { ...scenario, holdings: rec || scenario.holdings };
    const result = resultFor(scenario);
    const fresh = !!(result && result.fingerprint === keepFingerprint(plan.holdings));
    const v = keepTestOf(plan, { result, run: { status: fresh ? 'done' : memory.status === 'working' || memory.status === 'failed' ? memory.status : 'idle', reason: null } });
    // Undo, while the list is still the one the last agreement (or withdraw) wrote
    const undo = memory.undo && memory.undo.after === listOf(scenario) ? { id: memory.undo.id } : null;
    // a closed plan is kept to read: no test, no agreement, no withdraw (the store refuses them too), as V7
    return v ? { ...v, closed: isClosedPlan(scenario), confirmOpen: memory.confirm, undo } : null;
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
 * of agreements), withdrawKeepRisk (the list without its last), undoKeepRisk (the list as it was before either). Each refuses
 * on a closed plan, and the agreement only takes a result for this plan as it is now. `scenario()` is the plan as stored,
 * `persist(list)` the shell's one save, `rerender()` the tab drawn again, `toast(text, kind)` its message.
 */
export function installKeepTestHandlers(w, { scenario, persist, rerender, toast }) {
  const closed = (sc) => { if (!isClosedPlan(sc)) return false; toast(HOLD.problems.readonly, 'error'); return true; };
  w.runKeepTest = async () => {
    if (memory.status === 'working') return;
    const sc0 = await scenario();
    if (!sc0 || closed(sc0)) return;
    forPlan(sc0);
    memory.status = 'working'; memory.result = null; memory.confirm = false;
    await rerender();
    try {
      const sc = await scenario();
      forPlan(sc);
      const { runKeepRetest } = await import('../answers/plan/keepRun.js');
      await new Promise((r) => setTimeout(r, 30));   // let the page say it is testing before the engine takes the thread
      memory.result = runKeepRetest(sc, { today: dayOf(new Date()) });
      memory.stamp = stampOf(sc);
      memory.status = 'done';
    } catch (e) { memory.status = 'failed'; memory.result = null; toast(KEEPTEST.failed, 'error'); }
    await rerender();
  };
  w.askKeepRisk = () => { memory.confirm = true; rerender(); };
  w.cancelKeepRisk = () => { memory.confirm = false; rerender(); };
  w.acceptKeepRisk = async () => {
    try {
      const sc = await scenario();
      if (!sc || closed(sc)) return;
      forPlan(sc);
      // the result is for this plan as it is now, or nothing is written (the plan changed since the test: run it again)
      const p = amendPatch(sc, resultFor(sc), { at: new Date().toISOString() });
      if (!p.ok) { memory.confirm = false; toast(HOLD.problems[p.problem] || KEEPTEST.failed, 'error'); await rerender(); return; }
      await persist(p.patch.planAmendments);
      memory.confirm = false;
      memory.undo = { id: 'agreed', before: p.previous.planAmendments, after: JSON.stringify(p.patch.planAmendments) };
      toast(HOLD.toast.agreed.replace('{date}', p.line.slots.date), 'success');
    } catch (e) { toast('Could not save: ' + e.message, 'error'); }
    await rerender();
  };
  w.withdrawKeepRisk = async () => {
    try {
      const sc = await scenario();
      if (!sc || closed(sc)) return;
      forPlan(sc);
      const p = withdrawPatch(sc);
      if (!p.ok) return;
      await persist(p.patch.planAmendments);
      memory.undo = { id: 'withdrawn', before: p.previous.planAmendments, after: JSON.stringify(p.patch.planAmendments) };
      toast(HOLD.toast.withdrawn.replace('{date}', p.line.slots.date), 'success');
    } catch (e) { toast('Could not save: ' + e.message, 'error'); }
    await rerender();
  };
  // Undo: the list put back as it was before the last agreement or withdraw — ONE save, only while nothing else changed it
  w.undoKeepRisk = async () => {
    try {
      const sc = await scenario();
      if (!sc || closed(sc)) return;
      forPlan(sc);
      const u = memory.undo;
      if (!u || u.after !== listOf(sc)) { memory.undo = null; await rerender(); return; }
      await persist(Array.isArray(u.before) ? u.before : []);
      memory.undo = null;
      toast(HOLD.toast.undone, 'success');
    } catch (e) { toast('Could not save: ' + e.message, 'error'); }
    await rerender();
  };
}
