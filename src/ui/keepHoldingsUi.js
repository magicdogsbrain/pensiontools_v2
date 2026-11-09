/**
 * "Keep this" and money expected later in the classic planner's Transition tab (7.6.0). The shell's inline script only
 * shrinks, so its handlers live here: each change is ONE save of the record (HoldingsRecord.holdingsWith, the very change V7
 * makes through answers/plan/hold.js holdPatch), and the gaps are V7's reading (answers/plan/gaps.js), so both apps say the
 * same thing.
 */
import { holdingsWith } from '../services/HoldingsRecord.js';
import { taxYearStartOf } from '../services/PlanTiming.js';
import { gapsOf, gapsView } from '../answers/plan/gaps.js';

const pad = (n) => String(n).padStart(2, '0');
const dayOf = (d) => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());

/** "2027/28, 2028" → [2027, 2028]: the April each tax year starts. */
export function parseTaxYears(text) {
  return [...new Set(String(text || '').split(/[,;\s]+/).map((t) => { const m = /^(20\d{2})/.exec(t.trim()); return m ? +m[1] : null; }).filter(Boolean))];
}

/** The keep a choice in the "Keep this" box makes: '' none, 'rung' (the years it had, else this tax year), 'mine', 'mineGaps'. */
export function keepOfChoice(value, was, today = new Date()) {
  if (value === 'rung') return { as: 'rung', taxYears: was && was.as === 'rung' && Array.isArray(was.taxYears) && was.taxYears.length ? was.taxYears : [taxYearStartOf(today)] };
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
  w.keepHolding = (i, v) => { const d = draft(); if (!d || !d.lines || !d.lines[i]) return; save({ kind: 'keep', index: i, keep: keepOfChoice(v, d.lines[i].keep) }); };
  w.keepHoldingYears = (i, text) => { const ys = parseTaxYears(text); if (!ys.length) { toast('Type at least one tax year, like 2027/28.', 'error'); return; } save({ kind: 'keep', index: i, keep: { as: 'rung', taxYears: ys } }); };
  w.addExpected = () => {
    const g = (id) => { const el = w.document && w.document.getElementById(id); return el ? String(el.value || '').trim() : ''; };
    const amount = +g('hlExpAmount');
    if (!(amount > 0)) { toast('Type the amount you expect.', 'error'); return; }
    save({ kind: 'expected', op: 'add', item: { label: g('hlExpLabel') || null, amount, by: g('hlExpBy') || null, wrapper: 'SIPP' } });
  };
  w.removeExpected = (id) => save({ kind: 'expected', op: 'remove', id });
}
