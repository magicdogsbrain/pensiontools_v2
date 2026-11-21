/**
 * "Keep this" and money expected later in the classic planner's Transition tab (7.6.0). The shell's inline script only
 * shrinks, so its handlers live here: each change is ONE save of the record (HoldingsRecord.holdingsWith, the very change V7
 * makes through answers/plan/hold.js holdPatch), and the gaps are V7's reading (answers/plan/gaps.js), so both apps say the
 * same thing.
 */
import { holdingsWith } from '../services/HoldingsRecord.js';
import { standInPays } from '../services/TransitionPlanner.js';
import { gapsOf, gapsView, lifeOf } from '../answers/plan/gaps.js';
import { heldPhase } from '../services/Phases.js';
import { PLAN } from '../v7/copy/plan.js';
import { moveOf, opensAtOf } from '../answers/plan/move.js';
import { planStage } from '../services/PlanReading.js';
import { keepTestOf, amendPatch, withdrawPatch, sayKeep } from '../answers/plan/keepTest.js';
import { sayHeldPatch, agreeWithdrawPatch } from '../answers/plan/agree.js';
import { MOVE } from '../v7/copy/move.js';
import { keepFingerprint } from '../services/PlanAmendments.js';
import { isClosedPlan } from '../services/PlanClosed.js';
import { KEEPTEST } from '../v7/copy/keepTest.js';
import { HOLD } from '../v7/copy/hold.js';
import { esc } from './components/ReleaseNotesView.js';
import { isStaleBuildError } from '../utils/staleBuild.js';
import { staleWordsText } from './staleBuildPage.js';
import { todayOf, dayKeyOf } from '../reading/clock.js';
import { runInWorker, workerAvailable } from '../workers/engineClient.js';

const pad = (n) => String(n).padStart(2, '0');
const dayOf = (d) => dayKeyOf(todayOf(d));   // the one clock (src/reading/clock.js)

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

/**
 * The full view's name for its Transition tab (7.11.1): "Your plan’s mix" while the plan is what is held (living on it, or
 * Moving once what is held was accepted: the phase V7's home reads), else "Transition" — a retired person is never shown a
 * move phase by the tab's name.
 */
export function transitionTabName(scenario, today = todayOf()) {
  try { return scenario && heldPhase(lifeOf(scenario, new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12))) ? PLAN.steps.move.short : 'Transition'; } catch { return 'Transition'; }
}

/**
 * The month a saver's move window opens, for the full view's schedule (move.js opensAtOf: the reading the simple view's
 * schedule and home use). Null when there is none, or the plan cannot be read.
 */
export function transitionOpensAt(scenario, today = todayOf()) {
  try { const now = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12); return scenario ? opensAtOf(scenario, planStage(scenario, { now }), now) : null; } catch { return null; }
}

/** Names the full view's Transition tab in `doc` by the phase (transitionTabName); `read()` gives the stored plan. The name. */
export async function nameTransitionTab(doc, read, fallback = null, today = todayOf()) {
  let plan = null; try { plan = (await read()) || fallback; } catch { plan = fallback; }
  const name = transitionTabName(plan, today);
  const tb = doc && doc.querySelector ? doc.querySelector('.tab[data-tab="transition"]') : null;
  if (tb) tb.textContent = name;
  return name;
}

/** The gaps as the Transition tab draws them: V7's reading of the plan with this record (by the phase the home reads: 7.12.0, nothing in the held phase); null when there is nothing to read. */
export function transitionGaps(scenario, rec, today = todayOf()) {
  if (!scenario) return null;
  try { return gapsView(gapsOf({ ...scenario, holdings: rec }, { today: dayOf(today) })); } catch { return null; }
}

/**
 * "Your plan's mix" by phase (7.11.1): V7's reading of the move (answers/plan/move.js moveOf) for the plan with this record,
 * in the phase the plan's home reads — { mode, heldInfo, heldView, phase }. `mode` 'held' (Living on it, or Moving once what
 * is held was accepted): the tab draws what is held as information, never Buy or Sell; on a ladder (7.12.0) `heldView` is
 * "Your plan's mix" as both views draw it (answers/plan/held.js). Null when it cannot be read.
 */
export function transitionHeld(scenario, rec, today = todayOf(), entries = null) {
  if (!scenario) return null;
  try {
    const plan = { ...scenario, holdings: rec || scenario.holdings };
    // the account's plans when the caller has them (a successor, a partner), as the simple view's page reads them
    const others = Array.isArray(entries) ? entries.filter((e) => e && e.plan && String(e.plan.id) !== String(plan.id)) : [];
    const v = moveOf([{ plan }, ...others], plan.id, { today: dayOf(today) });
    // 7.12.0: and the move's readings both views word the same way — the one status, the pace, what pays for the buys, what is
    // held that the plan does not use, the totals and the cash to hold now (answers/plan/moveWords.js through moveOf)
    // step F6: and the page's ONE diff (moveOf's `raw`: target, diff, progress, schedule), the order sheet with its bought column
    // and the gaps, so the tab draws every list and count from the reading the simple view draws — never a diff of its own
    return v && v.found ? { mode: v.mode || null, heldInfo: v.heldInfo || null, heldView: v.heldView || null, phase: v.phase || null,
      status: v.status || null, totalsOnly: !!v.totalsOnly, pace: v.pace || null, paying: v.paying || null, outside: v.outside || [], ladderTotals: v.ladderTotals || null, cash: v.cash || null, isa: v.isa || null,
      sayHeld: v.sayHeld || null, saidHeld: v.saidHeld || null, sayHeldOpen: sayHeldMemory.open && sayHeldMemory.planId === String(plan.id),
      waiting: v.mode === 'waiting' ? { opens: v.opens || null, yearsToStart: v.yearsToStart || '0', startsAround: v.startsAround || '', newMoney: v.newMoney || null, planMix: v.planMix || null, held: v.held || null } : null,
      sheet: v.sheet || [], spGate: v.spGate || null, pricedOn: v.pricedOn || null, gaps: v.gaps || null, ladder: !!v.ladder, raw: v.raw || null } : null;
  } catch { return null; }
}

/**
 * Why a gilt cannot stand in for the years typed (7.12.0 round 3): when every year typed ends before the gilt matures, the words
 * that say so ("This gilt pays on 7 June 2028, after 2027/28 ends, so it cannot pay for 2027/28."); else null. Its maturity is
 * the bundled list's, or its name's (TransitionPlanner.standInPays); a line with none is never refused.
 */
export function tooEarlyWords(line, years) {
  let m = null; try { m = standInPays(line, { today: todayOf() }).matures; } catch { m = null; }
  if (!m || !years.length) return null;
  const early = years.filter((Y) => (Y + 1) + '-04-05' < m);
  if (early.length < years.length) return null;
  const [y, mo, d] = m.split('-').map(Number);
  const day = d + ' ' + ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][mo - 1] + ' ' + y;
  const ys = early.map((Y) => Y + '/' + String(Y + 1).slice(2)).join(', ');
  return 'This gilt pays on ' + day + ', after ' + ys + ' end' + (early.length === 1 ? 's' : '') + ', so it cannot pay for ' + ys + '.';
}

/**
 * The handlers the Transition tab's markup names (TransitionView.js): keepHolding, keepHoldingYears, keepHoldingFor,
 * addExpected, removeExpected. `draft()` is the record on screen, `persist(record)` the shell's one save, `toast(text, kind)` its
 * message. Saves are queued (7.12.0): each change is applied to the record as the previous change left it, and each save waits
 * for the one before, so several changes made quickly all land — never the last one alone over the record on screen.
 */
export function installKeepHandlers(w, { draft, persist, toast }) {
  let pending = null, inFlight = 0, queue = Promise.resolve();
  const save = (change) => {
    const d = pending || draft(); if (!d) return;
    const next = holdingsWith(d, change, { today: todayOf() });
    pending = next; inFlight++;
    queue = queue.then(() => persist(next)).catch((e) => toast('Could not save what you hold: ' + e.message, 'error')).finally(() => { inFlight--; if (!inFlight) pending = null; });
  };
  w.keepHolding = (i, v, firstYear) => {
    const d = draft(); if (!d || !d.lines || !d.lines[i]) return;
    const keep = keepOfChoice(v, d.lines[i].keep, firstYear);
    // nothing is saved until a year is typed in the box beside the choice (7.12.0 round 3): no message, nothing changes
    if (keep && keep.wait) return;
    save({ kind: 'keep', index: i, keep });
  };
  w.keepHoldingYears = (i, text) => {
    const ys = parseTaxYears(text); if (!ys.length) { toast('Type at least one tax year, like 2027/28.', 'error'); return; }
    // a gilt cannot pay for a year that ends before it matures (7.12.0 round 3, walker 5): said beside the choice, not saved
    const d = pending || draft(); const why = d && d.lines && d.lines[i] ? tooEarlyWords(d.lines[i], ys) : null;
    if (why) { toast(why, 'error'); return; }
    save({ kind: 'keep', index: i, keep: { as: 'rung', taxYears: ys } });
  };
  // living on a ladder (7.12.0): the one optional box — the years typed are the person's label; emptied, the keep comes off
  w.keepHoldingFor = (i, text) => {
    const d = pending || draft(); if (!d || !d.lines || !d.lines[i]) return;
    if (!String(text || '').trim()) { const k = d.lines[i].keep; if (k && k.as === 'rung') save({ kind: 'keep', index: i, keep: null }); return; }
    const ys = parseTaxYears(text);
    if (!ys.length) { toast('A tax year, like 2028/29.', 'error'); return; }
    save({ kind: 'keep', index: i, keep: { as: 'rung', taxYears: ys } });
  };
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
    const v = keepTestOf(plan, { result, run: { status: fresh ? 'done' : memory.status === 'working' || memory.status === 'failed' ? memory.status : 'idle', reason: null }, today: dayKeyOf(todayOf()) });
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
    const v = keepTestOf(scenario, { today: dayKeyOf(todayOf()) });
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
/** The full view's confirm for "This is how I want to hold it" (7.12.0): page memory only, for the plan it was opened on. */
const sayHeldMemory = { open: false, planId: null };

export function installKeepTestHandlers(w, { scenario, persist, rerender, toast, persistPhases = null, run = runInWorker, canRun = workerAvailable, marketReady = () => w._marketReady, today = () => dayKeyOf(todayOf()) }) {
  // "This is how I want to hold it" and "Take this back" (7.12.0): the same one write as V7 (agree.js), the shell's save of `phases`
  const dayIso = today;   // the one clock (src/reading/clock.js)
  w.askSayHeld = async () => { const sc = await scenario(); sayHeldMemory.open = true; sayHeldMemory.planId = sc ? String(sc.id) : null; rerender(); };
  w.cancelSayHeld = () => { sayHeldMemory.open = false; rerender(); };
  w.sayHeldFull = async () => {
    try {
      const sc = await scenario();
      if (!sc || closed(sc) || !persistPhases) return;
      const p = sayHeldPatch(sc, { today: dayIso(), at: new Date().toISOString() });
      if (!p.ok) { toast(MOVE.problems[p.problem] || MOVE.problems.failed, 'error'); return; }
      await persistPhases(p.patch.phases);
      sayHeldMemory.open = false;
    } catch (e) { toast('Could not save: ' + e.message, 'error'); }
    await rerender();
  };
  w.takeBackSayHeld = async () => {
    try {
      const sc = await scenario();
      if (!sc || closed(sc) || !persistPhases) return;
      const p = agreeWithdrawPatch(sc, { at: new Date().toISOString() });
      if (!p.ok) return;
      await persistPhases(p.patch.phases);
      if (JSON.stringify(p.patch.planAmendments || []) !== JSON.stringify(Array.isArray(sc.planAmendments) ? sc.planAmendments : [])) await persist(p.patch.planAmendments);
    } catch (e) { toast('Could not save: ' + e.message, 'error'); }
    await rerender();
  };
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
      const day = today();
      // the simple view's own run (answers/plan/keepRun.js) in the engine worker, which loads the one market for the job; a
      // page without workers runs it here once the day's prices are in (window._marketReady), never on the built-in copy
      if (canRun()) memory.result = await run('keepRetest', { plan: sc, today: day });
      else {
        await marketReady();
        const { runKeepRetest } = await import('../answers/plan/keepRun.js');
        await new Promise((r) => setTimeout(r, 30));   // let the page say it is testing before the engine takes the thread
        memory.result = runKeepRetest(sc, { today: day });
      }
      memory.stamp = stampOf(sc);
      memory.status = 'done';
    } catch (e) { memory.status = 'failed'; memory.result = null; toast(isStaleBuildError(e) ? staleWordsText() : KEEPTEST.failed, 'error'); }   // a page older than the site: src/ui/staleBuildPage.js
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
