/**
 * The budget on a saved plan (research/v7/road-to-7.md step 11b; budget-step.md "The rule"): the planner's Budget page,
 * line by line, as a step of the plan — `#/plan/<id>/budget`. THE RULE holds here as everywhere in V7: the budget is a guide;
 * nothing it holds flows into any figure the plan runs on. Pure: the plans already brought up to date in memory, today's
 * date and what was typed in; out come the lines by group with their boxes, hints and nudges, the one-off costs, who pays
 * (a shared budget), the totals against the national guide levels, what is missing, a spreadsheet read, and the exact
 * writes each change carries. Nothing here writes, runs anything, or reads a clock.
 *
 *   savedBudget(plan, entries, { today })         the budget as the plan reads it (its own, or the household's lines with its
 *                                                 own side of who pays), normalised as the planner's page holds it (every
 *                                                 line with an id), the plan whose lines they are, the totals
 *   checkBudget(plan, entries, typed, { today })  text as typed → every box checked, the change a left box carries, the
 *                                                 spreadsheet opened read
 *   budgetOf(entries, id, { today, typed })       everything the screen draws
 *   budgetPatch(plan, entries, change, { today }) → { ok, writes: [{ planId, patch, previous }], line }: ONE change of the
 *                                                 budget, the whole `budgetTool.settings` written as the planner's own
 *                                                 saveBudget writes it (BudgetModel.budgetToSave over cleanBudgetForSave;
 *                                                 a shared budget split as ScenarioRepository.saveActiveBudget splits it)
 *     change = { kind: 'line', id, field, value } | { kind: 'part', id, i, field, value } | { kind: 'partAdd', id }
 *            | { kind: 'partRemove', id, i } | { kind: 'partToggle', id } | { kind: 'ages', id, open }
 *            | { kind: 'add', tier, label } | { kind: 'remove', id } | { kind: 'duplicate', id }
 *            | { kind: 'oneOff', id, field, value } | { kind: 'addOneOff', label } | { kind: 'removeOneOff', id } | { kind: 'duplicateOneOff', id }
 *            | { kind: 'suggest', label } | { kind: 'fill' } | { kind: 'tier', tier } | { kind: 'reset' }
 *            | { kind: 'spreadsheet', text } | { kind: 'phaseAdd' } | { kind: 'phase', i, field, value } | { kind: 'phaseRemove', i }
 *
 * Every path written is in schema.js BUDGET_WRITES (tested). The budget is outside the lock (LockedPlanGuard.js), so a
 * locked plan's budget is still the person's to change, as it is in the planner.
 */
import { defaultBudget, summariseBudget, typicalMonthlyFor, typicalSanityFlag, missingSuggestions, evalAmountExpr, breakdownAnnual, parseBudgetCsv, budgetToCsv, plsaTierOf, PLSA_2024,
  cleanBudgetForSave, budgetToSave, idMaker, blankLine, blankOneOff, fillTypicalAmounts, partnerCopyOf, resetBudgetLines, withSuggestion, importedBudget } from '../../services/BudgetModel.js';
import { budgetSharedFromOf, sharedBudgetView, sharedBudgetWrites } from '../../services/PlanCommit.js';
import { pounds } from './income.js';
import { applyPatch } from './about.js';
import { BUDGET_WRITES, BUDGET_PERIODS, BUDGET_TIERS, BUDGET_GROUPS, PAID_BYS } from './schema.js';
import { dateOf, dayWords } from './dates.js';

export { applyPatch };

const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const blank = (v) => v === undefined || v === null || (typeof v === 'string' && v.trim() === '');
const copy = (v) => (v === undefined ? undefined : JSON.parse(JSON.stringify(v)));
const nameOf = (plan) => (plan && plan.planDetails && typeof plan.planDetails.name === 'string' && plan.planDetails.name) || (plan && typeof plan.name === 'string' && plan.name) || '';
const r0 = (v) => Math.round(+v || 0);
const r2 = (v) => Math.round((+v || 0) * 100) / 100;
const num = (v) => (v == null || v === '' || !Number.isFinite(+v) ? null : +v);
const text = (v) => (v === undefined ? '<absent>' : JSON.stringify(v));

/** A line's period as the planner reads it: 'yr' when absent (index.html budgetLineRowHtml). */
const periodOf = (line) => (line && line.period === 'mo' ? 'mo' : 'yr');
/** The amount shown for a line: a month (to the pound, the planner's Math.round) or a year. */
const shownAmount = (line) => (line.annual == null || line.annual === '' ? '' : String(periodOf(line) === 'mo' ? Math.round(+line.annual / 12) : +line.annual));

/** The budget this plan reads (ScenarioRepository.getActiveBudget): its own, or the household's with its own side of who pays. */
export function readBudget(plan, entries) {
  const own = (plan && plan.budgetTool && isObj(plan.budgetTool.settings)) ? plan.budgetTool.settings : {};
  const from = budgetSharedFromOf(plan);
  const source = from ? (entries || []).map((e) => e && e.plan).find((p) => p && String(p.id) === String(from)) : null;
  const theirs = source && source.budgetTool && isObj(source.budgetTool.settings) ? source.budgetTool.settings : null;
  return theirs ? { budget: sharedBudgetView(theirs, own, from), holder: source, shared: true } : { budget: own, holder: plan, shared: false };
}

/** The budget as the planner's page holds it (index.html loadBudgetUI): the defaults under it, every line and one-off with an id. */
export function normalisedBudget(budget) {
  const out = { ...defaultBudget(), ...(budget || {}) };
  const idOf = idMaker(out);
  out.lines = (Array.isArray(out.lines) ? out.lines : []).filter(isObj).map((l) => (l.id != null && l.id !== '' ? l : { id: idOf(), ...l }));
  out.oneOffs = (Array.isArray(out.oneOffs) ? out.oneOffs : []).filter(isObj).map((o) => (o.id != null && o.id !== '' ? o : { id: idOf(), ...o }));
  return out;
}

/** The saved facts: the budget as read and normalised, whose lines they are, the plans that read this plan's budget. */
export function savedBudget(plan, entries, { today }) {
  const now = dateOf(today);
  const list = (entries || []).filter((e) => e && e.plan && typeof e.plan === 'object' && e.plan.id != null);
  const read = readBudget(plan, list);
  const B = normalisedBudget(read.budget);
  const readers = list.map((e) => e.plan).filter((p) => String(p.id) !== String(plan.id) && budgetSharedFromOf(p) === String(plan.id)).map((p) => ({ id: String(p.id), name: nameOf(p) }));
  const stamp = read.holder && read.holder.lastModified ? dayWords(read.holder.lastModified) : null;
  return { budget: B, holder: read.holder, shared: read.shared, holderName: read.shared ? nameOf(read.holder) : null, readers, now, stampWords: stamp, thisYear: now.getFullYear() };
}

// ---- the boxes ------------------------------------------------------------------------------------------------------------

function parseAmount(t) {
  if (blank(t)) return { error: null, value: null };
  const s = String(t).replace(/[£\s]/g, '');
  if (s.length > 40) return { error: 'notANumber', value: null };
  const n = evalAmountExpr(s);
  if (n == null) return { error: 'notANumber', value: null };
  if (n < 0) return { error: 'tooLow', value: null };
  if (n > 10000000) return { error: 'tooHigh', value: null };
  return { error: null, value: n };
}
/** An age as the planner reads it (index.html budAgeFromInput): blank is none; a year above 1000 becomes an age from the budget's age today. */
function parseAge(t, budget, thisYear) {
  if (blank(t)) return { error: null, value: null };
  const s = String(t).trim();
  if (!/^\d{1,4}$/.test(s)) return { error: 'notANumber', value: null };
  const n = +s;
  if (n > 1000) { const birthYear = thisYear - (+budget.currentAge || 0); return { error: null, value: Math.max(0, n - birthYear) }; }
  if (n > 120) return { error: 'tooHigh', value: null };
  return { error: null, value: n };
}
function parseWhole(t, max) {
  if (blank(t)) return { error: null, value: null };
  const s = String(t).trim();
  if (!/^\d{1,3}$/.test(s)) return { error: 'notANumber', value: null };
  const n = +s;
  if (n > max) return { error: 'tooHigh', value: null };
  return { error: null, value: n };
}
const parseText = (t) => ({ error: null, value: blank(t) ? '' : String(t).slice(0, 200) });
const parsePeriod = (t) => (BUDGET_PERIODS.includes(t) ? { error: null, value: t } : { error: 'notAnOption', value: null });
const parsePaidBy = (t) => (PAID_BYS.includes(t) ? { error: null, value: t } : { error: 'notAnOption', value: null });

/**
 * One box of a line, a one-off, a part or a phase: the text shown (typed, else saved), the saved text, the problem, and the
 * change the box carries once left (null while unchanged or wrong).
 */
function box(path, typed, saved, parse, change) {
  const raw = Object.prototype.hasOwnProperty.call(typed, path) ? typed[path] : null;
  const shown = raw == null ? saved : String(raw);
  const p = raw == null ? { error: null, value: undefined } : parse(raw);
  const changed = raw != null && !p.error && String(p.value == null ? '' : p.value) !== saved;
  return { path, shown, saved, error: p.error, changed, change: changed ? change(p.value) : null };
}

/** Text as typed → every box checked with the change it carries, the spreadsheet opened read, the typed state of the toggles. */
export function checkBudget(plan, entries, typed, { today }) {
  const s = savedBudget(plan, entries, { today });
  const B = s.budget;
  const t = typed || {};
  const errors = {};
  const note = (b) => { if (b.error) errors[b.path] = b.error; return b; };
  const lines = B.lines.map((l) => {
    const id = String(l.id);
    const base = 'line.' + id;
    const period = periodOf(l);
    const fields = {
      label: note(box(base + '.label', t, l.label == null ? '' : String(l.label), parseText, (v) => ({ kind: 'line', id, field: 'label', value: v }))),
      amount: note(box(base + '.amount', t, shownAmount(l), parseAmount, (v) => ({ kind: 'line', id, field: 'amount', value: v }))),
      period: note(box(base + '.period', t, period, parsePeriod, (v) => ({ kind: 'line', id, field: 'period', value: v }))),
      essential: { path: base + '.essential', shown: t[base + '.essential'] != null ? t[base + '.essential'] === '1' : l.tier === 'essential', saved: l.tier === 'essential' },
      fromAge: note(box(base + '.fromAge', t, l.fromAge == null ? '' : String(l.fromAge), (v) => parseAge(v, B, s.thisYear), (v) => ({ kind: 'line', id, field: 'fromAge', value: v }))),
      toAge: note(box(base + '.toAge', t, l.toAge == null ? '' : String(l.toAge), (v) => parseAge(v, B, s.thisYear), (v) => ({ kind: 'line', id, field: 'toAge', value: v }))),
      paidBy: note(box(base + '.paidBy', t, l.paidBy || (B.sharedWithPartner ? 'shared' : 'me'), parsePaidBy, (v) => ({ kind: 'line', id, field: 'paidBy', value: v }))),
      mySharePct: note(box(base + '.mySharePct', t, l.mySharePct == null || l.mySharePct === '' ? '' : String(l.mySharePct), (v) => parseWhole(v, 100), (v) => ({ kind: 'line', id, field: 'mySharePct', value: v })))
    };
    // the age range: open when the line has an age of its own (the planner's budLineIsBanded: an age other than the budget's own ends), or opened on the page
    const explicit = (v, d) => v != null && v !== '' && +v !== d;
    const banded = explicit(l.fromAge, +B.retirementAge) || explicit(l.toAge, +B.endAge);
    const agesOpen = t[base + '.ages'] != null ? t[base + '.ages'] === '1' : banded;
    const parts = (Array.isArray(l.breakdown) ? l.breakdown : []).map((r, i) => {
      const pb = base + '.part.' + i;
      return {
        i,
        label: note(box(pb + '.label', t, r && r.label != null ? String(r.label) : '', parseText, (v) => ({ kind: 'part', id, i, field: 'label', value: v }))),
        amount: note(box(pb + '.amount', t, r && r.amount != null && r.amount !== '' ? String(r.amount) : '', parseAmount, (v) => ({ kind: 'part', id, i, field: 'amount', value: v }))),
        period: note(box(pb + '.period', t, r && r.period === 'mo' ? 'mo' : 'yr', parsePeriod, (v) => ({ kind: 'part', id, i, field: 'period', value: v })))   // no period saved reads as a year: BudgetModel.breakdownAnnual sums it so, the planner's panel shows it so
      };
    });
    const partsOpen = t[base + '.open'] != null ? t[base + '.open'] === '1' : !!l.breakdownOpen;
    const typical = typicalMonthlyFor(l.label, B);
    return { id, label: l.label == null ? '' : String(l.label), tier: l.tier === 'essential' ? 'essential' : 'discretionary', period, hint: typeof l.hint === 'string' ? l.hint : '',
      typical: typical == null ? null : (period === 'mo' ? typical : typical * 12), sanity: typicalSanityFlag(l.label, l.annual, B), annual: num(l.annual),
      fields, agesOpen, banded, partsOpen, parts, partsTotal: parts.length ? breakdownAnnual(l.breakdown) : 0, starter: !!(l.hint && typicalMonthlyFor(l.label, B) != null) };
  });
  const oneOffs = B.oneOffs.map((o) => {
    const id = String(o.id);
    const base = 'oneOff.' + id;
    return { id, label: o.label == null ? '' : String(o.label), hint: typeof o.hint === 'string' ? o.hint : '', fields: {
      label: note(box(base + '.label', t, o.label == null ? '' : String(o.label), parseText, (v) => ({ kind: 'oneOff', id, field: 'label', value: v }))),
      amount: note(box(base + '.amount', t, o.amount == null || o.amount === '' ? '' : String(o.amount), parseAmount, (v) => ({ kind: 'oneOff', id, field: 'amount', value: v }))),
      atAge: note(box(base + '.atAge', t, o.atAge == null ? '' : String(o.atAge), (v) => parseAge(v, B, s.thisYear), (v) => ({ kind: 'oneOff', id, field: 'atAge', value: v }))),
      everyYears: note(box(base + '.everyYears', t, o.everyYears == null || o.everyYears === '' ? '' : String(o.everyYears), (v) => parseWhole(v, 99), (v) => ({ kind: 'oneOff', id, field: 'everyYears', value: v }))),
      paidBy: note(box(base + '.paidBy', t, o.paidBy || (B.sharedWithPartner ? 'shared' : 'me'), parsePaidBy, (v) => ({ kind: 'oneOff', id, field: 'paidBy', value: v }))),
      mySharePct: note(box(base + '.mySharePct', t, o.mySharePct == null || o.mySharePct === '' ? '' : String(o.mySharePct), (v) => parseWhole(v, 100), (v) => ({ kind: 'oneOff', id, field: 'mySharePct', value: v })))
    } };
  });
  const phases = (Array.isArray(B.splitPhases) ? B.splitPhases : []).map((p, i) => ({ i,
    fromAge: note(box('phase.' + i + '.fromAge', t, p && p.fromAge != null && p.fromAge !== '' ? String(p.fromAge) : '', (v) => parseAge(v, B, s.thisYear), (v) => ({ kind: 'phase', i, field: 'fromAge', value: v }))),
    mySharePct: note(box('phase.' + i + '.mySharePct', t, p && p.mySharePct != null && p.mySharePct !== '' ? String(p.mySharePct) : '', (v) => parseWhole(v, 100), (v) => ({ kind: 'phase', i, field: 'mySharePct', value: v })))
  }));
  // a new line or one-off cost is named first (its box beside the button): the change it carries once the name is typed
  const adds = {};
  for (const tier of BUDGET_GROUPS) adds[tier] = note(box('add.' + tier, t, '', parseText, (v) => ({ kind: 'add', tier, label: v })));
  adds.oneOff = note(box('add.oneOff', t, '', parseText, (v) => ({ kind: 'addOneOff', label: v })));
  // the spreadsheet opened (budget.spreadsheet): read as the planner reads it, nothing written until "Replace the budget with it"
  const importText = typeof t['import.text'] === 'string' ? t['import.text'] : '';
  let imported = null;
  if (importText.trim()) {
    const r = parseBudgetCsv(importText, s.now);
    imported = { lines: r.lines.length, oneOffs: r.oneOffs.length, warnings: r.warnings.slice(0, 6), canImport: r.lines.length + r.oneOffs.length > 0 };
  }
  return { ok: Object.keys(errors).length === 0, errors, lines, oneOffs, phases, adds, imported, importText, saved: s };
}

// ---- the writes ---------------------------------------------------------------------------------------------------------

const declared = (patch) => { for (const k of Object.keys(patch)) if (!BUDGET_WRITES.includes(k)) throw new Error('budget: "' + k + '" is not a declared field path'); return patch; };
const lineNamed = (l) => (l && l.label && String(l.label).trim()) || 'this line';

/** The budget after one change: the planner's own handler, lifted, on a copy; null for a change that cannot be applied. */
export function budgetAfter(B, change, { now }) {
  const c = change && typeof change === 'object' ? change : {};
  const b = JSON.parse(JSON.stringify(B));
  const idOf = idMaker(b);
  const lineAt = (id) => b.lines.find((l) => String(l.id) === String(id)) || null;
  const oneOffAt = (id) => b.oneOffs.find((o) => String(o.id) === String(id)) || null;
  const recompute = (l) => { if ((l.breakdown || []).some((r) => +r.amount)) l.annual = breakdownAnnual(l.breakdown); };
  if (c.kind === 'line') {
    const l = lineAt(c.id); if (!l) return null;
    const f = c.field, v = c.value;
    if (f === 'label') l.label = String(v == null ? '' : v);
    else if (f === 'amount') { if (v == null || v === '') l.annual = null; else { const n = +v; if (!Number.isFinite(n)) return null; l.annual = periodOf(l) === 'mo' ? n * 12 : n; } }
    else if (f === 'period') { if (!BUDGET_PERIODS.includes(v)) return null; l.period = v; }
    else if (f === 'essential') l.tier = v ? 'essential' : 'discretionary';
    else if (f === 'fromAge' || f === 'toAge') l[f] = v == null || v === '' ? null : +v;
    else if (f === 'paidBy') { if (!PAID_BYS.includes(v)) return null; l.paidBy = v; }
    else if (f === 'mySharePct') l.mySharePct = v == null || v === '' ? null : +v;
    else return null;
    return { b, line: { id: 'line', slots: { name: lineNamed(l) } } };
  }
  if (c.kind === 'part' || c.kind === 'partAdd' || c.kind === 'partRemove' || c.kind === 'partToggle') {
    const l = lineAt(c.id); if (!l) return null;
    if (c.kind === 'partToggle') {
      l.breakdownOpen = !l.breakdownOpen;
      if (l.breakdownOpen && !Array.isArray(l.breakdown)) l.breakdown = [{ label: '', amount: null, period: 'mo' }, { label: '', amount: null, period: 'mo' }];
      return { b, line: { id: l.breakdownOpen ? 'partsOpen' : 'partsClosed', slots: { name: lineNamed(l) } } };
    }
    if (c.kind === 'partAdd') { (l.breakdown = l.breakdown || []).push({ label: '', amount: null, period: 'mo' }); return { b, line: { id: 'partAdded', slots: { name: lineNamed(l) } } }; }
    if (!Array.isArray(l.breakdown) || !(c.i >= 0 && c.i < l.breakdown.length)) return null;
    if (c.kind === 'partRemove') { l.breakdown.splice(c.i, 1); recompute(l); return { b, line: { id: 'partRemoved', slots: { name: lineNamed(l) } } }; }
    const r = l.breakdown[c.i];
    if (c.field === 'label') r.label = String(c.value == null ? '' : c.value);
    else if (c.field === 'amount') { if (c.value == null || c.value === '') r.amount = null; else { const n = +c.value; if (!Number.isFinite(n)) return null; r.amount = n; } }
    else if (c.field === 'period') { if (!BUDGET_PERIODS.includes(c.value)) return null; r.period = c.value; }
    else return null;
    recompute(l);
    return { b, line: { id: 'line', slots: { name: lineNamed(l) } } };
  }
  if (c.kind === 'ages') {
    const l = lineAt(c.id); if (!l) return null;
    if (c.open === false) { l.fromAge = null; l.toAge = null; }
    return { b, line: { id: c.open === false ? 'agesClosed' : 'line', slots: { name: lineNamed(l) } } };
  }
  if (c.kind === 'add') {
    // named first: a line with no name and no amount is left out by the save (cleanBudgetForSave, the planner's budCleanForSave),
    // and here every change is a save — so the name is asked for beside the button, and the line is written with it
    const tier = BUDGET_GROUPS.includes(c.tier) ? c.tier : 'discretionary';
    const label = String(c.label == null ? '' : c.label).trim().slice(0, 200);
    if (!label) return null;
    const l = { ...blankLine(tier, idOf()), label };
    b.lines.push(l);
    return { b, line: { id: 'added', slots: { name: label } }, focus: 'line.' + l.id + '.amount' };
  }
  if (c.kind === 'remove') {
    const i = b.lines.findIndex((l) => String(l.id) === String(c.id)); if (i < 0) return null;
    const [gone] = b.lines.splice(i, 1);
    return { b, line: { id: 'removed', slots: { name: lineNamed(gone) } } };
  }
  if (c.kind === 'duplicate') {
    const l = lineAt(c.id); if (!l) return null;
    b.lines.splice(b.lines.indexOf(l) + 1, 0, partnerCopyOf(l, idOf()));
    return { b, line: { id: 'duplicated', slots: { name: lineNamed(l) } } };
  }
  if (c.kind === 'oneOff') {
    const o = oneOffAt(c.id); if (!o) return null;
    const f = c.field, v = c.value;
    if (f === 'label') o.label = String(v == null ? '' : v);
    else if (f === 'amount' || f === 'everyYears' || f === 'mySharePct') { if (v == null || v === '') o[f] = null; else { const n = +v; if (!Number.isFinite(n)) return null; o[f] = n; } }
    else if (f === 'atAge') o.atAge = v == null || v === '' ? null : +v;
    else if (f === 'paidBy') { if (!PAID_BYS.includes(v)) return null; o.paidBy = v; }
    else return null;
    return { b, line: { id: 'oneOff', slots: { name: lineNamed(o) } } };
  }
  if (c.kind === 'addOneOff') {
    const label = String(c.label == null ? '' : c.label).trim().slice(0, 200);
    if (!label) return null;
    const o = { ...blankOneOff(idOf()), label };
    b.oneOffs.push(o);
    return { b, line: { id: 'oneOffAdded', slots: { name: label } }, focus: 'oneOff.' + o.id + '.amount' };
  }
  if (c.kind === 'removeOneOff') {
    const i = b.oneOffs.findIndex((o) => String(o.id) === String(c.id)); if (i < 0) return null;
    const [gone] = b.oneOffs.splice(i, 1);
    return { b, line: { id: 'oneOffRemoved', slots: { name: lineNamed(gone) } } };
  }
  if (c.kind === 'duplicateOneOff') {
    const o = oneOffAt(c.id); if (!o) return null;
    b.oneOffs.splice(b.oneOffs.indexOf(o) + 1, 0, partnerCopyOf(o, idOf()));
    return { b, line: { id: 'duplicated', slots: { name: lineNamed(o) } } };
  }
  if (c.kind === 'suggest') {
    const next = withSuggestion(b, String(c.label || ''), idOf);
    if (next === b) return null;
    return { b: next, line: { id: 'suggested', slots: { name: String(c.label) } } };
  }
  if (c.kind === 'fill') { const r = fillTypicalAmounts(b); return { b: r.budget, line: { id: r.n ? 'filled' : 'filledNone', slots: { n: String(r.n), s: r.n === 1 ? '' : 's' } } }; }
  if (c.kind === 'tier') { if (!BUDGET_TIERS.includes(c.tier)) return null; b.plsaTier = c.tier; return { b, line: { id: 'tier', slots: { tier: c.tier } } }; }
  if (c.kind === 'reset') return { b: resetBudgetLines(b, idOf), line: { id: 'reset', slots: {} } };
  if (c.kind === 'spreadsheet') {
    const r = parseBudgetCsv(String(c.text || ''), now);
    if (!r.lines.length && !r.oneOffs.length) return null;
    return { b: importedBudget(b, r, idOf), line: { id: 'imported', slots: { lines: String(r.lines.length), oneOffs: String(r.oneOffs.length) } } };
  }
  if (c.kind === 'phaseAdd') { (b.splitPhases = b.splitPhases || []).push({ fromAge: '', mySharePct: '' }); return { b, line: { id: 'phaseAdded', slots: {} } }; }
  if (c.kind === 'phase' || c.kind === 'phaseRemove') {
    if (!Array.isArray(b.splitPhases) || !(c.i >= 0 && c.i < b.splitPhases.length)) return null;
    if (c.kind === 'phaseRemove') { b.splitPhases.splice(c.i, 1); return { b, line: { id: 'phaseRemoved', slots: {} } }; }
    if (c.field !== 'fromAge' && c.field !== 'mySharePct') return null;
    b.splitPhases[c.i][c.field] = c.value === '' || c.value == null ? '' : +c.value;   // the planner keeps a blank as '' (updateSplitPhase)
    return { b, line: { id: 'phase', slots: {} } };
  }
  return null;
}

/**
 * ONE change of the budget: the budget after it, cleaned and with its totals worked out again (BudgetModel.budgetToSave over
 * cleanBudgetForSave — what the planner's saveBudget writes), as the whole `budgetTool.settings` of the plan whose lines they are;
 * a shared budget split as the planner splits it (PlanCommit.sharedBudgetWrites: the lines to the household's plan, the own
 * side of who pays here). Undo puts each previous object back whole.
 */
export function budgetPatch(plan, entries, change, { today }) {
  const s = savedBudget(plan, entries, { today });
  const fail = (why) => ({ ok: false, errors: { change: why }, writes: [], line: null });
  let after;
  try { after = budgetAfter(s.budget, change, { now: s.now }); } catch (e) { return fail(e && e.message ? e.message : 'failed'); }
  if (!after) return fail('unknown');
  const next = budgetToSave(cleanBudgetForSave(after.b));
  const settingsOf = (p) => (p && p.budgetTool && Object.prototype.hasOwnProperty.call(p.budgetTool, 'settings') ? copy(p.budgetTool.settings) : undefined);
  const writes = [];
  if (!s.shared) {
    writes.push({ planId: String(plan.id), patch: declared({ 'budgetTool.settings': next }), previous: { 'budgetTool.settings': settingsOf(plan) } });
  } else {
    const { holder, own } = sharedBudgetWrites(plan, s.holder, next);
    if (holder) writes.push({ planId: String(s.holder.id), patch: declared({ 'budgetTool.settings': holder }), previous: { 'budgetTool.settings': settingsOf(s.holder) } });
    writes.push({ planId: String(plan.id), patch: declared({ 'budgetTool.settings': own }), previous: { 'budgetTool.settings': settingsOf(plan) } });
  }
  // a write that changes nothing is not sent (a box left as it was)
  const real = writes.filter((w) => text(w.patch['budgetTool.settings']) !== text(w.previous['budgetTool.settings']));
  return { ok: true, errors: {}, writes: real, line: after.line, focus: after.focus || null, budget: next };
}

// ---- the words --------------------------------------------------------------------------------------------------------------

/** The totals as the planner's summary says them (index.html updateBudgetSummary), in slots. */
export function totalsOf(B) {
  const d = summariseBudget(B);
  const shared = !!d.sharedWithPartner;
  const plsa = shared ? PLSA_2024.couple : PLSA_2024.single;
  const plsaSpend = shared ? d.householdComfortableAnnual : d.allInComfortableAnnual;
  const where = plsaSpend >= plsa.comfortable ? 'aboveComfortable' : plsaSpend >= plsa.moderate ? 'moderateToComfortable' : plsaSpend >= plsa.minimum ? 'minimumToModerate' : 'belowMinimum';
  const recurring = (B.oneOffs || []).filter((o) => (+o.everyYears || 0) > 0 && (+o.amount || 0) > 0).map((o) => ({ label: o.label || 'item', amount: pounds(o.amount), every: String(+o.everyYears), perYear: pounds((+o.amount) / (+o.everyYears)), perMonth: pounds((+o.amount) / (+o.everyYears) / 12) }));
  const singles = (B.oneOffs || []).filter((o) => !((+o.everyYears || 0) > 0) && (+o.amount || 0) > 0).map((o) => ({ label: o.label || 'item', amount: pounds(o.amount), age: o.atAge ? String(+o.atAge) : null }));
  return {
    has: d.allInComfortableMonthly > 0 || d.householdComfortableMonthly > 0,
    shared,
    monthly: pounds(d.allInComfortableMonthly), yearly: pounds(d.allInComfortableAnnual),
    essentials: pounds(d.essentialMonthlyNet), recurringMonthly: pounds(d.comfortableMonthlyNet), periodicMonthly: pounds(d.periodicMonthlyAverage), hasPeriodic: d.periodicMonthlyAverage > 0,
    partnerMonthly: pounds(d.partnerAllInMonthly), partnerYearly: pounds(d.partnerAllInAnnual), householdMonthly: pounds(d.householdComfortableMonthly),
    levels: { minimum: pounds(plsa.minimum / 12), moderate: pounds(plsa.moderate / 12), comfortable: pounds(plsa.comfortable / 12) },
    where, plsaSpendYearly: pounds(plsaSpend),
    recurring, singles,
    raw: { monthly: r2(d.allInComfortableMonthly), yearly: r2(d.allInComfortableAnnual), essentials: r2(d.essentialMonthlyNet) }
  };
}

/** Everything the screen draws. `typed` is the draft's values for this plan (text by path), or null. */
export function budgetOf(entries, id, { today, typed = null, source = 'account' } = {}) {
  const list = (entries || []).filter((e) => e && e.plan && typeof e.plan === 'object' && e.plan.id != null);
  const entry = list.find((e) => String(e.plan.id) === String(id)) || null;
  if (!entry) return { found: false, id: String(id || '') };
  const plan = entry.plan;
  const readonly = !!(entry.newer || entry.failed);
  const c = checkBudget(plan, list, typed || {}, { today });
  const s = c.saved;
  const B = s.budget;
  const groups = BUDGET_GROUPS.map((tier) => ({ tier, lines: c.lines.filter((l) => l.tier === tier), monthly: pounds(c.lines.filter((l) => l.tier === tier && l.annual > 0).reduce((t, l) => t + l.annual, 0) / 12) }));
  const missing = missingSuggestions(B).map((m) => ({ label: m.label, hint: m.hint || '', tier: m.tier }));
  return {
    found: true, id: String(plan.id), name: nameOf(plan), readonly, editable: !readonly, source,
    locked: !!(plan.decisionTool && plan.decisionTool.settings && plan.decisionTool.settings.locked),
    shared: s.shared, holderName: s.holderName, holderId: s.shared ? String(s.holder.id) : null, readers: s.readers, sharedWithPartner: !!B.sharedWithPartner,
    stampWords: s.stampWords,
    ages: { currentAge: r0(B.currentAge), retirementAge: r0(B.retirementAge), endAge: r0(B.endAge) },
    tier: plsaTierOf(B), tiers: BUDGET_TIERS.slice(),
    groups, oneOffs: c.oneOffs, phases: c.phases, adds: c.adds, missing,
    totals: totalsOf(B),
    imported: c.imported, importText: c.importText,
    csvText: budgetToCsv(B),
    errors: c.errors, ok: c.ok,
    count: c.lines.length
  };
}
