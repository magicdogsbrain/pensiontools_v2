/**
 * "What you spend" (research/v7/editing-in-v7.md 8): the third editing step of a saved plan in V7. Pure: a plan already
 * brought up to date in memory, today's date and what was typed in; the first row and the later steps (a month after tax,
 * at today's prices; what happens from each age), the one-off costs by age, the budget as a guide, the picture of every
 * year, the problems, the derived figures, and the exact field paths and values a save writes out. Nothing here writes,
 * runs a future, or reads a clock.
 *
 *   savedSpend(plan, { today })              the saved facts: the steps (the planner's before-tax rows read back a month
 *                                            after tax through the planner's own tax sum), the costs, the budget guide
 *   boxesOf(plan, { today })                 the same as text by path: "first.amount", "steps.ids", "steps.0.fromAge" …
 *   checkSpend(plan, typed, { today })       text as typed → { ok, values, lists, errors, saved, shape, schedule }
 *   spendPatch(plan, typed, { today })       → { ok, errors, patch, previous }: the dotted paths that change (8.3)
 *   spendOf(entries, id, { today, typed })   everything the screen draws
 *   compiledSchedule(…) / guaranteedAtYear   the planner's own rule for the figure every engine reads (8.1)
 *   suggestion(…)                            the planner's own "Suggest go-slow & no-go" rule, as edits to the draft
 *
 * Every path written is in schema.js SPEND_WRITES (tested); the shape block is written only when the first row or a step
 * changed, the costs only when a cost changed, so a plan saved as it is writes nothing.
 *
 * A lift that fills the boxes (lumpEdits: the planner's own rows before tax) hands the draft each row's before-tax figure
 * beside the box ("first.gross", "steps.<id>.gross" — paths with no box of their own, schema.js isSpendPath); the write takes
 * that figure while the box still says its month after tax (liftedGross), so the steps written are the planner's to the pound
 * and not the month's rounding grossed up again. A figure typed over the box is grossed up as ever.
 */
import { taxYearLabel } from '../../services/PlanTiming.js';
import { amountAtAge, cleanSteps, lumpIntoSteps } from '../../services/IncomeSchedule.js';
import { spSimConfigFromSettings } from '../../utils/StatePensionUtils.js';
import { get, applyPatch, safeSettings, safeTiming, bandsOf, netOf, grossOf } from './about.js';
import { pounds } from './income.js';
import { SPEND_FIELDS, SPEND_LISTS, SPEND_LIST_IDS, SPEND_WRITES, THENS, isCardId } from './schema.js';
import { dateOf, dayWords } from './dates.js';

export { applyPatch };

const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const num = (v) => (v == null || v === '' || !Number.isFinite(+v) ? null : +v);
const blank = (v) => v === undefined || v === null || (typeof v === 'string' && v.trim() === '');
const isLocked = (plan) => !!(plan && plan.decisionTool && plan.decisionTool.settings && plan.decisionTool.settings.locked);
const lockedAtOf = (plan) => (plan && plan.decisionTool && plan.decisionTool.settings && plan.decisionTool.settings.lockedAt) || (plan && plan.planDocument && plan.planDocument.lockedAt) || null;
const nameOf = (plan) => (plan && plan.planDetails && typeof plan.planDetails.name === 'string' && plan.planDetails.name) || (plan && typeof plan.name === 'string' && plan.name) || '';
const partnerIdOf = (plan) => (plan && plan.household && typeof plan.household.partnerScenarioId === 'string' && plan.household.partnerScenarioId) || null;
const copy = (v) => (v === undefined ? undefined : JSON.parse(JSON.stringify(v)));
const text = (v) => (v === undefined ? '<absent>' : JSON.stringify(v));
const unique = (list) => [...new Set(list)];
const r0 = (v) => Math.round(+v || 0);

/** A month after tax, to the pound, from a year before tax (8.1): the planner's own tax sum at the plan's own bands. */
export const monthlyNet = (gross, bands) => Math.round(netOf(gross, bands) / 12);
/** A year before tax, to the pound, from a month after tax: the planner's own gross-up (BudgetModel.grossUpAnnual). */
export const yearlyGross = (monthly, bands) => Math.round(grossOf(monthly * 12, bands));
/** What a step does, in the planner's keys: decline (a % a year) and glideToNext. */
const thenOf = (row, hasNext) => (row.glideToNext && hasNext ? 'glides' : +row.decline > 0 ? 'falls' : 'level');
/**
 * The before-tax figure a lift handed the draft beside an amount box ("first.gross", "steps.<id>.gross": lumpEdits — the
 * planner's own rows, whole pounds): read only while the box still says that figure's month after tax, so the lift's row is
 * written as the planner writes it and a figure the person typed over it is grossed up as ever. Null otherwise.
 */
function liftedGross(raw, monthly, bands) {
  if (blank(raw) || monthly == null) return null;
  const s = String(raw).trim();
  if (!/^\d{1,9}$/.test(s)) return null;
  const g = +s;
  return g >= 1 && monthlyNet(g, bands) === monthly ? g : null;
}
/** A row's figure before tax: the lift's own while it rides with the box, else the saved row's when the box is as saved, else the box grossed up. */
const grossOfRow = (v, sv, bands) => (v.gross != null ? v.gross : sv && v.amount === sv.monthly ? sv.amount : yearlyGross(v.amount, bands));

/**
 * The planner's "never below the income you get anyway" (index.html guaranteedAtYear, 8.1): the State Pension from its
 * plan year (weekly × 52), other income, the final-salary pension from its start year, every income stream in range.
 */
export function guaranteedAtYear(ss, timing, ageNow, y, now) {
  let total = num(ss.other) || 0;
  const wk = num(ss.spWeeklyAmount) || 0;
  if (wk > 0) {
    let cfg = null;
    try { cfg = spSimConfigFromSettings({ ...ss, spWeeklyAmount: wk, shapeAgeNow: ageNow, currentAge: num(ss.currentAge) || ageNow, firstTaxYear: timing.firstTaxYear }, now); } catch { cfg = null; }
    if (cfg && y >= (cfg.spStartYear ?? 99)) total += wk * 52;
  }
  const db = num(ss.dbAmount) || 0;
  if (db > 0 && y >= (num(ss.dbStartYear) || 0)) total += db;
  for (const r of (Array.isArray(ss.extraIncomes) ? ss.extraIncomes : [])) if (isObj(r) && +r.annual > 0 && y >= (+r.startYear || 0) && (r.endYear == null || y <= +r.endYear)) total += +r.annual;
  return total;
}

/** The planner's compiled schedule (index.html compiledTargetSchedule): duration + 1 figures, each floored and rounded. */
export function compiledSchedule(steps, base, ss, timing, ageNow, duration, now) {
  return Array.from({ length: duration + 1 }, (_, y) => Math.round(Math.max(0, amountAtAge(steps, ageNow + y, base), guaranteedAtYear(ss, timing, ageNow, y, now))));
}

/** The planner's own "Suggest go-slow & no-go steps" (incomeShapeGraphic.suggestSteps), on before-tax figures. */
export function plannerSuggest(first, ageNow, essentials = 0) {
  const a = +first || 0;
  const floor = (v) => Math.max(v, essentials || 0);
  const out = [{ fromAge: ageNow, amount: a }];
  if (ageNow < 75) out.push({ fromAge: 75, amount: Math.round(floor(a * 0.85) / 500) * 500 });
  if (ageNow < 85) out.push({ fromAge: 85, amount: Math.round(floor(a * 0.70) / 500) * 500 });
  return out;
}

/** The budget as the plan holds it (8.1): read only, from the cached totals the planner's own chip reads. */
function budgetOf(plan, now) {
  const b = (plan && plan.budgetTool && isObj(plan.budgetTool.settings)) ? plan.budgetTool.settings : {};
  const d = isObj(b.derived) ? b.derived : {};
  const total = r0(d.allInComfortableMonthly || d.comfortableMonthlyNet);
  const essentials = r0(d.essentialMonthlyNet);
  const lines = Array.isArray(b.lines) ? b.lines.filter((l) => l && (num(l.amount) > 0 || num(l.annual) > 0)).length : 0;
  const workedOut = total > 0 && lines > 0;
  void now;
  return { workedOut, total: workedOut ? total : null, essentials: workedOut && essentials > 0 ? essentials : null, essentialsAnnualNet: workedOut ? (num(d.essentialAnnualNet) || 0) : 0, at: plan && plan.lastModified ? dayWords(plan.lastModified) : null };
}

/**
 * The saved facts (8.2): the first row and the later steps from the planner's rows (the document's when locked), each a
 * month after tax; the costs; the budget guide; the timing. Rows keep their index (`row`) so a write can keep them byte
 * for byte.
 */
export function savedSpend(plan, { today }) {
  const now = dateOf(today);
  const locked = isLocked(plan);
  const doc = locked ? plan.planDocument : null;
  const ss = safeSettings(plan, now);
  const stored = (plan && plan.stressTool && isObj(plan.stressTool.settings)) ? plan.stressTool.settings : {};
  let timing = safeTiming(ss, now);
  let duration = num(ss.duration) || 35;
  if (doc && isObj(doc.timing)) {
    const dt = doc.timing;
    timing = { ...timing, mode: dt.mode || timing.mode, firstTaxYear: num(dt.firstTaxYear) || timing.firstTaxYear, shapeAgeNow: num(dt.shapeAgeNow) || timing.shapeAgeNow, startMonth: dt.startMonth || timing.startMonth };
    duration = (Array.isArray(doc.timeline) && doc.timeline.length) || num(doc.assumptions && doc.assumptions.duration) || duration;
  }
  const ageNow = timing.shapeAgeNow;
  const endAge = ageNow + duration - 1;
  const bands = bandsOf(ss);
  const source = locked ? { kind: 'locked', at: dayWords(lockedAtOf(plan)) } : { kind: 'saved', at: plan && plan.lastModified ? dayWords(plan.lastModified) : null };

  // the rows: the document's steps when locked; else the planner's own (effective) rows, in age order, with their index
  let rows = [];
  if (doc && Array.isArray(doc.steps) && doc.steps.length) rows = doc.steps.map((s, i) => ({ fromAge: +s.fromAge, amount: +s.amount, decline: +s.decline || 0, glideToNext: !!s.glideToNext, row: i }));
  else {
    const list = ss.incomeShape === 'phases' && Array.isArray(ss.incomeSteps) ? ss.incomeSteps : [];
    const clean = cleanSteps(list.map((s, i) => (isObj(s) ? { ...s, row: i } : null)));
    rows = clean.map((s) => ({ fromAge: +s.fromAge, amount: +s.amount, decline: +s.decline || 0, glideToNext: !!s.glideToNext, row: s.row }));
  }
  const flat = rows.length === 0;
  if (flat) rows = [{ fromAge: ageNow, amount: r0(Array.isArray(ss.targetSchedule) && ss.targetSchedule.length ? ss.targetSchedule[0] : ss.baseSalary), decline: 0, glideToNext: false, row: null }];
  const steps = rows.map((s, i) => ({ ...s, then: thenOf(s, i < rows.length - 1), fallsPct: +s.decline > 0 ? +s.decline : null, monthly: monthlyNet(s.amount, bands) }));
  const first = { ...steps[0], id: 'first' };
  const later = steps.slice(1).map((s, i) => ({ ...s, id: String(i) }));
  // the schedule the engines read now (IncomeSchedule.scheduleFromSteps: the saved one, else the steps compiled)
  const base = first.amount;
  const plainSteps = rows.map((s) => ({ fromAge: s.fromAge, amount: s.amount, decline: s.decline, glideToNext: s.glideToNext }));
  const schedule = Array.isArray(ss.targetSchedule) && ss.targetSchedule.length ? ss.targetSchedule.map((v) => +v || 0) : compiledSchedule(plainSteps, base, ss, timing, ageNow, duration, now);
  // the one-off costs: the planner's rows, each at an age, a year after tax on top of that year's figure
  const xrows = Array.isArray(stored.extraWithdrawals) ? stored.extraWithdrawals : (Array.isArray(ss.extraWithdrawals) ? ss.extraWithdrawals : []);
  const costs = [];
  xrows.forEach((r, i) => {
    if (!isObj(r) || !(num(r.amount) > 0) || num(r.year) == null) return;
    const y = Math.round(num(r.year));
    const grossYear = schedule[Math.min(Math.max(0, y), schedule.length - 1)] || 0;
    const net = Math.round(netOf(grossYear + num(r.amount), bands) - netOf(grossYear, bands));
    costs.push({ id: String(costs.length), label: typeof r.label === 'string' ? r.label : '', amount: net, gross: num(r.amount), atAge: ageNow + y, years: Math.max(1, Math.round(num(r.years) || 1)), prices: r.indexation === 'level' ? 'fixed' : 'rise', row: i });
  });
  // the lump sums coming in (income.js lumps: the planner's windfalls), money that pays for the shape — offered as income
  // (income.lump-to-steps: "Turn a lump sum into income"); only those falling inside the plan's years
  const wrows = Array.isArray(stored.windfalls) ? stored.windfalls : (Array.isArray(ss.windfalls) ? ss.windfalls : []);
  const lumps = [];
  wrows.forEach((r, i) => {
    if (!isObj(r) || !(num(r.amount) > 0) || num(r.year) == null) return;
    const atAge = ageNow + Math.round(num(r.year));
    if (atAge < ageNow || atAge > endAge) return;
    lumps.push({ id: String(lumps.length), label: typeof r.label === 'string' ? r.label : '', amount: num(r.amount), atAge, row: i });
  });
  const sid = (plan && plan.planDocument && plan.planDocument.strategy && plan.planDocument.strategy.id) || ss.strategyId || 'pots-and-valves';
  return {
    locked, lockedOn: locked ? dayWords(lockedAtOf(plan)) : null, ss, stored, timing, duration, ageNow, endAge, bands, source, flat,
    first, steps: later, plainSteps, base, schedule, costs, xrows, lumps, budget: budgetOf(plan, now), strategyId: sid, now
  };
}

const nextNewId = (ids) => { const used = ids.filter((x) => /^n\d+$/.test(x)).map((x) => +x.slice(1)); return 'n' + ((used.length ? Math.max(...used) : 0) + 1); };
const thenOfRow = (row) => (row.glideToNext ? 'glides' : +row.decline > 0 ? 'falls' : 'level');

/**
 * "Turn a lump sum into income" (income.lump-to-steps): the draft edits that make the cards equal the steps the planner's own
 * spendLumpSum makes (IncomeSchedule.lumpIntoSteps, lifted) — the first row's figure, each later step's by its age, a new card
 * for a step that did not exist; a card stays a card. Each amount box gets the month after tax and, beside it, the planner's
 * before-tax figure itself ("…gross"), so Save writes that row to the pound. The person then saves, or cancels to put the steps back.
 */
export function lumpEdits(c, rows, bands) {
  const sorted = rows.slice().sort((x, y) => +x.fromAge - +y.fromAge);
  const before = c.shape;
  const cards = c.lists.steps.cards;
  const ids = [...c.lists.steps.ids];
  const edits = [];
  const first = sorted[0], firstBefore = before[0];
  if (+first.amount !== +firstBefore.amount) edits.push({ path: 'first.amount', value: String(monthlyNet(first.amount, bands)) }, { path: 'first.gross', value: String(r0(first.amount)) });
  if (thenOfRow(first) !== thenOfRow(firstBefore)) edits.push({ path: 'first.then', value: thenOfRow(first) });
  for (const row of sorted.slice(1)) {
    const card = cards.find((x) => x.values.fromAge === +row.fromAge);
    const old = before.find((x) => +x.fromAge === +row.fromAge);
    if (card) {
      if (!old || +old.amount !== +row.amount) edits.push({ path: `steps.${card.id}.amount`, value: String(monthlyNet(row.amount, bands)) }, { path: `steps.${card.id}.gross`, value: String(r0(row.amount)) });
      if (old && thenOfRow(old) !== thenOfRow(row)) edits.push({ path: `steps.${card.id}.then`, value: thenOfRow(row) });
    } else {
      const id = nextNewId(ids);
      ids.push(id);
      edits.push({ path: `steps.${id}.fromAge`, value: String(row.fromAge) }, { path: `steps.${id}.amount`, value: String(monthlyNet(row.amount, bands)) }, { path: `steps.${id}.gross`, value: String(r0(row.amount)) }, { path: `steps.${id}.then`, value: thenOfRow(row) });
      if (+row.decline > 0) edits.push({ path: `steps.${id}.fallsPct`, value: String(+row.decline) });
    }
  }
  if (ids.length !== c.lists.steps.ids.length) edits.unshift({ path: 'steps.ids', value: ids.join(',') });
  return edits;
}

/** The boxes' starting text: the saved facts as a person would type them, by path (7.2). */
export function boxesOf(plan, { today }) {
  const s = savedSpend(plan, { today });
  const out = { 'first.amount': String(s.first.monthly), 'first.then': s.first.then };
  if (s.first.fallsPct != null) out['first.fallsPct'] = String(s.first.fallsPct);
  out['steps.ids'] = s.steps.map((c) => c.id).join(',');
  for (const c of s.steps) { out[`steps.${c.id}.fromAge`] = String(c.fromAge); out[`steps.${c.id}.amount`] = String(c.monthly); out[`steps.${c.id}.then`] = c.then; if (c.fallsPct != null) out[`steps.${c.id}.fallsPct`] = String(c.fallsPct); }
  out['costs.ids'] = s.costs.map((c) => c.id).join(',');
  for (const c of s.costs) for (const f of SPEND_LISTS.costs.fields) { const v = c[f.path]; if (v == null || v === '') continue; out[`costs.${c.id}.${f.path}`] = String(v); }
  return out;
}

function parseInt3(t, f) {
  if (blank(t)) return { error: f.required ? 'required' : null, value: f.default != null ? f.default : null };
  const s = String(t).trim();
  if (!/^\d{1,3}$/.test(s)) return { error: 'notANumber', value: null };
  const n = +s;
  if (n < f.min) return { error: 'tooLow', value: n };
  if (n > f.max) return { error: 'tooHigh', value: n };
  return { error: null, value: n };
}
/** Money as people write it: "£", commas and spaces are let through; whole pounds. */
function parseMoney(t, f) {
  if (blank(t)) return { error: f.required ? 'required' : null, value: null };
  const s = String(t).replace(/[£,\s]/g, '');
  if (!/^\d{1,9}(\.\d{1,2})?$/.test(s)) return { error: 'notANumber', value: null };
  const n = Math.round(+s);
  if (n < f.min) return { error: 'tooLow', value: n };
  if (n > f.max) return { error: 'tooHigh', value: n };
  return { error: null, value: n };
}
/** A fall, % a year: 0.25 to 10 in quarter points (the planner's slider in its own steps, to twice its reach). */
function parsePercent(t, f) {
  if (blank(t)) return { error: f.required ? 'required' : null, value: null };
  const s = String(t).replace(/[%\s]/g, '');
  if (!/^\d{1,2}(\.\d{1,2})?$/.test(s)) return { error: 'range', value: null };
  const n = +s;
  if (n < f.min || n > f.max || Math.abs(n / f.step - Math.round(n / f.step)) > 1e-9) return { error: 'range', value: n };
  return { error: null, value: n };
}
function parseField(raw, f) {
  if (f.type === 'age' || f.type === 'count') return parseInt3(raw, f);
  if (f.type === 'money') return parseMoney(raw, f);
  if (f.type === 'percent') return parsePercent(raw, f);
  if (f.type === 'choice') { const v = blank(raw) ? f.default : String(raw); return f.options.includes(v) ? { error: null, value: v } : { error: 'notAnOption', value: null }; }
  const s = blank(raw) ? '' : String(raw).trim();
  if (f.max && s.length > f.max) return { error: 'tooLong', value: null };
  return { error: null, value: s };
}
const field = (path) => SPEND_FIELDS.find((f) => f.path === path);

/**
 * Text as typed → the checked values, the cards, the errors by path, the steps as they would be saved (before tax, in age
 * order) and the schedule they compile to. `typed` holds text (or a choice) by path; a path not typed takes the saved value.
 */
export function checkSpend(plan, typed, { today }) {
  const saved = savedSpend(plan, { today });
  const boxes = { ...boxesOf(plan, { today }), ...(typed || {}) };
  const values = { first: {} };
  const errors = {};
  const b = saved.bands;

  // the first row
  const fa = parseMoney(boxes['first.amount'], field('first.amount'));
  if (fa.error) errors['first.amount'] = fa.error; else values.first.amount = fa.value;
  const fg = liftedGross(boxes['first.gross'], values.first.amount, b);
  if (fg != null) values.first.gross = fg;
  const ft = parseField(boxes['first.then'], field('first.then'));
  if (ft.error) errors['first.then'] = ft.error; else values.first.then = ft.value;
  const applies = { 'first.amount': true, 'first.then': true, 'first.fallsPct': values.first.then === 'falls' };
  if (applies['first.fallsPct']) { const p = parsePercent(boxes['first.fallsPct'], field('first.fallsPct')); if (p.error) errors['first.fallsPct'] = p.error; else values.first.fallsPct = p.value; }

  // the lists
  const lists = {};
  for (const L of SPEND_LIST_IDS) {
    const idsText = boxes[L + '.ids'];
    const ids = unique((blank(idsText) ? [] : String(idsText).split(',')).map((x) => x.trim()).filter((x) => isCardId(x)));
    const cards = ids.map((id) => {
      const savedCard = saved[L].find((c) => c.id === id) || null;
      const card = { id, saved: savedCard, values: {}, fields: [] };
      for (const f of SPEND_LISTS[L].fields) {
        const path = `${L}.${id}.${f.path}`;
        const raw = boxes[path];
        const on = !f.when || Object.entries(f.when).every(([k, v]) => (blank(boxes[`${L}.${id}.${k}`]) ? SPEND_LISTS[L].fields.find((x) => x.path === k).default : String(boxes[`${L}.${id}.${k}`])) === v);
        const r = on ? parseField(raw, f) : { error: null, value: null };
        card.fields.push({ path, type: f.type, options: f.options || null, applies: on, shown: blank(raw) ? (f.type === 'choice' || f.default != null ? String(f.default) : '') : String(raw), saved: savedCard && savedCard[f.path] != null && savedCard[f.path] !== '' ? String(savedCard[f.path]) : null, error: r.error });
        if (r.error) errors[path] = r.error; else if (on) card.values[f.path] = r.value;
      }
      if (L === 'steps') { const g = liftedGross(boxes[`steps.${id}.gross`], card.values.amount, b); if (g != null) card.values.gross = g; }
      const v = card.values;
      const mark = (f, e) => { errors[`${L}.${id}.${f}`] = e; const bx = card.fields.find((x) => x.path === `${L}.${id}.${f}`); if (bx) bx.error = e; delete v[f]; };
      if (L === 'steps' && v.fromAge != null && v.fromAge <= saved.first.fromAge) mark('fromAge', 'beforeStart');
      if (L === 'steps' && v.fromAge != null && v.fromAge > saved.endAge) mark('fromAge', 'afterEnd');
      if (L === 'costs' && v.atAge != null && v.atAge < saved.ageNow) mark('atAge', 'beforeStart');
      if (L === 'costs' && v.atAge != null && v.atAge > saved.endAge) mark('atAge', 'afterEnd');
      if (L === 'costs' && v.atAge != null && v.years != null && v.years > saved.endAge - v.atAge + 1) mark('years', 'tooManyYears');
      return card;
    });
    if (L === 'steps') {
      // no two steps from the same age; "moves evenly" needs a later step
      const count = new Map();
      for (const card of cards) if (card.values.fromAge != null) count.set(card.values.fromAge, (count.get(card.values.fromAge) || 0) + 1);
      for (const card of cards) { const a = card.values.fromAge; if (a == null || count.get(a) < 2) continue; errors[`steps.${card.id}.fromAge`] = 'sameAge'; card.fields.find((x) => x.path === `steps.${card.id}.fromAge`).error = 'sameAge'; delete card.values.fromAge; }
      const last = cards.filter((c) => c.values.fromAge != null).sort((x, y) => x.values.fromAge - y.values.fromAge).pop();
      if (last && last.values.then === 'glides') { errors[`steps.${last.id}.then`] = 'glidesLast'; last.fields.find((x) => x.path === `steps.${last.id}.then`).error = 'glidesLast'; delete last.values.then; }
      if (!cards.length && values.first.then === 'glides') { errors['first.then'] = 'glidesLast'; delete values.first.then; }
    }
    for (const card of cards) card.ok = SPEND_LISTS[L].fields.every((f) => !errors[`${L}.${card.id}.${f.path}`]);
    lists[L] = { ids, cards };
  }

  const ok = Object.keys(errors).length === 0;
  // the steps as they would be saved (8.3): before tax, in age order; and the schedule they compile to
  let shape = null, schedule = null;
  if (ok) {
    // a lift's row keeps its before-tax figure; an amount left as saved keeps its saved one (the planner's own row); a changed one is grossed up
    const toRow = (v, fromAge, sv) => ({ fromAge, amount: grossOfRow(v, sv, b), decline: v.then === 'falls' ? v.fallsPct : 0, glideToNext: v.then === 'glides' });
    const rows = [toRow(values.first, saved.first.fromAge, saved.first), ...lists.steps.cards.map((c) => toRow(c.values, c.values.fromAge, c.saved))].sort((x, y) => x.fromAge - y.fromAge);
    shape = rows;
    schedule = compiledSchedule(rows, rows[0].amount, saved.ss, saved.timing, saved.ageNow, saved.duration, saved.now);
  }
  return { ok, values, lists, errors, applies, saved, shape, schedule };
}

const STEP_KEYS = ['fromAge', 'amount', 'then', 'fallsPct'];
const COST_KEYS = ['label', 'amount', 'atAge', 'years', 'prices'];
const sameOn = (keys, a, b) => keys.every((k) => text(a[k] == null ? null : a[k]) === text(b[k] == null ? null : b[k]));

/** A step's row as the planner keeps it: merged onto the stored row (other keys kept), or new. */
function stepRow(v, fromAge, storedRow, bands, sc = null) {
  const amount = grossOfRow(v, sc, bands);
  const decline = v.then === 'falls' ? v.fallsPct : 0;
  const glide = v.then === 'glides';
  const out = { ...(storedRow || {}), fromAge, amount };
  if (decline > 0 || (storedRow && 'decline' in storedRow)) out.decline = decline;
  if (glide || (storedRow && 'glideToNext' in storedRow)) out.glideToNext = glide;
  return out;
}
/** A cost's row as the planner keeps it: the before-tax amount on top of that year's figure (8.1). */
function costRow(v, storedRow, ageNow, schedule, bands) {
  const year = v.atAge - ageNow;
  const grossYear = schedule[Math.min(Math.max(0, year), schedule.length - 1)] || 0;
  const gross = Math.round(grossOf(netOf(grossYear, bands) + v.amount, bands) - grossOf(netOf(grossYear, bands), bands));
  return { ...(storedRow || {}), label: v.label || '', amount: Math.max(1, gross), year, years: v.years == null ? 1 : v.years, indexation: v.prices === 'fixed' ? 'level' : 'cpi' };
}

/**
 * The write (8.3): every declared path whose value would change, with the new value and the one it had. The shape block
 * (the steps, the schedule, the first figure, the Decision copies) when the first row or a step changed; the costs when a
 * cost changed. Nothing for a locked plan or typed text with a problem.
 */
export function spendPatch(plan, typed, { today }) {
  const c = checkSpend(plan, typed, { today });
  if (!c.ok) return { ok: false, errors: c.errors, patch: {}, previous: {} };
  if (c.saved.locked) return { ok: false, errors: { plan: 'locked' }, patch: {}, previous: {} };
  const s = c.saved, b = s.bands;
  const want = {};
  const firstSame = sameOn(['amount', 'then', 'fallsPct'], { amount: c.values.first.amount, then: c.values.first.then, fallsPct: c.values.first.fallsPct == null ? null : c.values.first.fallsPct }, { amount: s.first.monthly, then: s.first.then, fallsPct: s.first.fallsPct });
  const cards = c.lists.steps.cards;
  const stepsSame = cards.length === s.steps.length && cards.every((card, i) => card.saved && card.saved.id === s.steps[i].id && sameOn(STEP_KEYS, { ...card.values, fallsPct: card.values.fallsPct == null ? null : card.values.fallsPct }, { fromAge: card.saved.fromAge, amount: card.saved.monthly, then: card.saved.then, fallsPct: card.saved.fallsPct }));
  // the planner's own rows as it holds them when it saves (effectiveStressSettings: an old "declining" profile already baked in)
  const storedSteps = Array.isArray(s.ss.incomeSteps) ? s.ss.incomeSteps : [];
  if (!firstSame || !stepsSame) {
    const rowOf = (card, fromAge) => {
      const sc = card.saved;
      if (sc && sc.row != null && sameOn(STEP_KEYS, { ...card.values, fallsPct: card.values.fallsPct == null ? null : card.values.fallsPct }, { fromAge: sc.fromAge, amount: sc.monthly, then: sc.then, fallsPct: sc.fallsPct })) return storedSteps[sc.row];
      return stepRow(card.values, fromAge, sc && sc.row != null ? storedSteps[sc.row] : null, b, sc);
    };
    const firstRow = firstSame && s.first.row != null ? storedSteps[s.first.row] : stepRow(c.values.first, s.first.fromAge, s.first.row != null ? storedSteps[s.first.row] : null, b, s.first);
    const rows = [firstRow, ...cards.map((card) => rowOf(card, card.values.fromAge))].sort((x, y) => +x.fromAge - +y.fromAge);
    const base = +rows[0].amount;
    const schedule = compiledSchedule(rows, base, s.ss, s.timing, s.ageNow, s.duration, s.now);
    want['stressTool.settings.incomeShape'] = 'phases';
    want['stressTool.settings.incomeSteps'] = rows;
    want['stressTool.settings.targetSchedule'] = schedule;
    want['stressTool.settings.baseSalary'] = base;
    want['stressTool.settings.spendingProfile'] = 'flat';   // the planner's Save writes it with the steps: the taper lives on them now
    want['decisionTool.settings.baseSalary'] = base;
    want['decisionTool.settings.targetSchedule'] = schedule;
  }
  const ccards = c.lists.costs.cards;
  const costsSame = ccards.length === s.costs.length && ccards.every((card, i) => card.saved && card.saved.id === s.costs[i].id && sameOn(COST_KEYS, card.values, card.saved));
  if (!costsSame) {
    const schedule = want['stressTool.settings.targetSchedule'] || s.schedule;
    const placed = new Set(s.costs.map((x) => x.row));
    const seq = ccards.map((card) => {
      const sc = card.saved;
      if (sc && sameOn(COST_KEYS, card.values, sc)) return s.xrows[sc.row];
      return costRow(card.values, sc ? s.xrows[sc.row] : null, s.ageNow, schedule, b);
    });
    const out = [];
    let k = 0;
    s.xrows.forEach((r, i) => { if (!placed.has(i)) out.push(r); else if (k < seq.length) out.push(seq[k++]); });
    out.push(...seq.slice(k));
    want['stressTool.settings.extraWithdrawals'] = out;
  }
  const patch = {}, previous = {};
  for (const path of SPEND_WRITES) {
    if (!(path in want)) continue;
    const cur = get(plan, path);
    const val = want[path];
    if (text(cur) === text(val)) continue;
    if (cur === undefined && path.endsWith('.spendingProfile') && val === 'flat') continue;   // absent reads as 'flat' (StressRepository): no key is added for nothing
    patch[path] = copy(val);
    previous[path] = copy(cur);
  }
  return { ok: true, errors: {}, patch, previous };
}

/** The lines a sentence and the picture read: the step in force at the start and each later step inside the plan. */
export function stepLines(rows, ageNow, duration, bands) {
  const list = cleanSteps(rows);
  if (!list.length) return [];
  const endAge = ageNow + duration - 1;
  const at = (age) => monthlyNet(amountAtAge(list, age, list[0].amount), bands);
  const inForce = list.reduce((k, s, i) => (+s.fromAge <= ageNow ? i : k), 0);
  const shown = list.map((s, i) => ({ s, i })).filter(({ s, i }) => i === inForce || (+s.fromAge > ageNow && +s.fromAge <= endAge));
  return shown.map(({ s, i }, k) => {
    const from = Math.max(ageNow, +s.fromAge);
    const then = s.glideToNext && list[i + 1] ? 'glides' : +s.decline > 0 ? 'falls' : 'level';
    const out = { fromAge: from, perMonth: at(from), yearly: Math.round(amountAtAge(list, from, list[0].amount)), then };
    if (then === 'falls') { out.fallsPct = +s.decline; const next = shown[k + 1]; out.endAge = next ? +next.s.fromAge - 1 : endAge; out.endPerMonth = at(out.endAge); }
    else if (then === 'glides') { out.endAge = +list[i + 1].fromAge; out.endPerMonth = out.endAge <= endAge ? at(out.endAge) : monthlyNet(+list[i + 1].amount, bands); }
    return out;
  });
}

/**
 * The picture (8.2; way-and-mix.md 5): one bar a year from the compiled schedule, the pensions' part lighter (the layers while
 * the steps are set), the budget's essentials dashed and its total a mark at the left (a guide), lump sums and one-off costs
 * as marks at their ages (`costs`: the cards as typed, else as saved), and the first age the income you get anyway pays
 * more than the step (`floorFrom`, the planner's own "held there" note, said while the steps are set).
 */
export function chartOf(rows, schedule, saved, costs = null) {
  const { ageNow, duration, bands, ss, timing, now } = saved;
  const ess = saved.budget.essentials;
  let floorFrom = null;
  const years = Array.from({ length: duration }, (_, y) => {
    const gross = schedule[y] || 0;
    const value = monthlyNet(gross, bands);
    const guaranteed = guaranteedAtYear(ss, timing, ageNow, y, now);
    const floor = Math.min(gross, guaranteed);
    const income = monthlyNet(floor, bands);
    if (floorFrom === null && guaranteed > amountAtAge(cleanSteps(rows), ageNow + y, rows.length ? +rows[0].amount : 0) + 0.5) floorFrom = { age: ageNow + y, amount: monthlyNet(guaranteed, bands) };
    return { age: ageNow + y, partnerAge: null, value, income, pots: Math.max(0, value - income), below: ess != null && value < ess - 0.005 };
  });
  const firstBelow = years.find((y) => y.below);
  const endAge = ageNow + duration - 1;
  const marks = [];
  for (const w of (Array.isArray(ss.windfalls) ? ss.windfalls : [])) {
    if (!isObj(w) || !(num(w.amount) > 0) || num(w.year) == null) continue;
    const age = ageNow + Math.round(num(w.year));
    if (age >= ageNow && age <= endAge) marks.push({ kind: 'in', age, amount: r0(w.amount), label: typeof w.label === 'string' && w.label ? w.label : 'Lump sum', years: 1 });
  }
  for (const c of (Array.isArray(costs) ? costs : saved.costs)) {
    if (!c || !(num(c.amount) > 0) || num(c.atAge) == null) continue;
    const age = Math.round(num(c.atAge));
    if (age >= ageNow && age <= endAge) marks.push({ kind: 'out', age, amount: r0(c.amount), label: typeof c.label === 'string' && c.label ? c.label : 'One-off cost', years: Math.max(1, Math.round(num(c.years) || 1)) });
  }
  marks.sort((a, b) => a.age - b.age || (a.kind === 'in' ? -1 : 1));
  return {
    chart: { unit: 'perMonth', years, essentials: ess, layers: true, couple: false, gap: null, bands: { goSlow: 75, noGo: 85 }, list: stepLines(rows, ageNow, duration, bands),
      budgetMark: saved.budget.workedOut && saved.budget.total > 0 ? saved.budget.total : null, marks },
    below: firstBelow ? { age: firstBelow.age, amount: ess } : null,
    floorFrom
  };
}

const yearOf = (timing, ageNow, age) => taxYearLabel(timing.firstTaxYear + (age - ageNow));

/** The derived figures (8.2), as line ids with their slots. */
export function derivedLines(rows, schedule, costs, saved) {
  const { ageNow, timing, bands, ss, now, duration } = saved;
  const lines = [];
  const list = stepLines(rows, ageNow, duration, bands);
  list.forEach((st, i) => {
    const slots = { age: st.fromAge, monthly: pounds(st.perMonth), yearly: pounds(st.yearly) };
    if (st.then === 'falls') lines.push({ id: i === 0 ? 'first.falls' : 'step.falls', slots: { ...slots, pct: String(st.fallsPct), endMonthly: pounds(st.endPerMonth), endAge: st.endAge } });
    else if (st.then === 'glides') lines.push({ id: i === 0 ? 'first.glides' : 'step.glides', slots: { ...slots, toMonthly: pounds(st.endPerMonth), toAge: st.endAge } });
    else lines.push({ id: i === 0 ? 'first.level' : 'step.level', slots });
  });
  // "never below the income you get anyway" (T12): the first year the pensions pay more than the shape
  const clean = cleanSteps(rows);
  for (let y = 0; y < duration; y++) {
    const wanted = amountAtAge(clean, ageNow + y, clean.length ? clean[0].amount : 0);
    const floor = guaranteedAtYear(ss, timing, ageNow, y, now);
    if (floor > wanted + 0.5) { lines.push({ id: 'floor.from', slots: { age: ageNow + y, monthly: pounds(monthlyNet(floor, bands)) } }); break; }
  }
  for (const c of costs) {
    const year = c.atAge - ageNow;
    const grossYear = schedule[Math.min(Math.max(0, year), schedule.length - 1)] || 0;
    const gross = c.gross != null ? c.gross : Math.round(grossOf(netOf(grossYear, bands) + c.amount, bands) - grossOf(netOf(grossYear, bands), bands));
    lines.push({ id: c.years > 1 ? 'cost.years' : 'cost.once', slots: { label: c.label || 'One-off cost', net: pounds(c.amount), age: c.atAge, year: yearOf(timing, ageNow, c.atAge), years: c.years, gross: pounds(gross), prices: c.prices } });
  }
  if (saved.strategyId === 'floor-and-flex') lines.push({ id: 'ff.note', slots: {} });
  return lines;
}

/** The go-go, go-slow and no-go suggestion (8.2) as edits to the draft: the planner's own rule on the before-tax figures. */
export function suggestion(firstGross, saved) {
  const ess = saved.budget.workedOut ? Math.round(grossOf(saved.budget.essentialsAnnualNet, saved.bands)) : 0;
  const rows = plannerSuggest(firstGross, saved.ageNow, ess).slice(1);
  const edits = [{ path: 'steps.ids', value: rows.map((_, i) => 'n' + (i + 1)).join(',') }];
  rows.forEach((r, i) => { const id = 'n' + (i + 1); edits.push({ path: `steps.${id}.fromAge`, value: String(r.fromAge) }, { path: `steps.${id}.amount`, value: String(monthlyNet(r.amount, saved.bands)) }, { path: `steps.${id}.then`, value: 'level' }); });
  const floored = ess > 0 && rows.some((r, i) => r.amount > Math.round((i === 0 ? 0.85 : 0.70) * firstGross / 500) * 500);
  return { edits, age75: saved.ageNow < 75 ? 75 : null, age85: saved.ageNow < 85 ? 85 : null, floor: floored ? monthlyNet(ess, saved.bands) : null };
}

/** The settings of this step a strategy ignores: none — every strategy reads the schedule and the costs. */
export function notUsedBy(strategyId) {
  void strategyId;
  return [];
}

/**
 * Everything the screen draws (8.2, 8.4). `typed` is the draft's values for this plan (text by path), or null.
 */
export function spendOf(entries, id, { today, typed = null } = {}) {
  const list = (entries || []).filter((e) => e && e.plan && typeof e.plan === 'object' && e.plan.id != null);
  const entry = list.find((e) => String(e.plan.id) === String(id)) || null;
  if (!entry) return { found: false, id: String(id || '') };
  const plan = entry.plan;
  const readonly = !!(entry.newer || entry.failed);
  const saved = savedSpend(plan, { today });
  const editable = !saved.locked && !readonly;
  const boxes = boxesOf(plan, { today });
  const c = checkSpend(plan, typed || {}, { today });
  const shown = { ...boxes, ...(typed || {}) };
  const b = saved.bands;
  const fields = SPEND_FIELDS.map((f) => ({
    path: f.path, type: f.type, options: f.type === 'choice' ? (f.path === 'first.then' ? THENS.filter((o) => o !== 'glides' || c.lists.steps.cards.length > 0 || shown['first.then'] === 'glides') : f.options) : null,
    applies: c.applies[f.path] !== false,
    shown: blank(shown[f.path]) ? (f.path === 'first.then' ? 'level' : '') : String(shown[f.path]),
    saved: f.path in boxes ? boxes[f.path] : null,
    error: c.errors[f.path] || null
  }));
  // beside each amount box: the before-tax figure the plan saves, and a later step's share of the start (and of the budget)
  const firstMonthly = c.values.first.amount != null ? c.values.first.amount : saved.first.monthly;
  const firstGross = c.values.first.gross != null ? c.values.first.gross : c.values.first.amount != null && c.values.first.amount !== saved.first.monthly ? yearlyGross(c.values.first.amount, b) : saved.first.amount;
  const share = (m, of) => (of > 0 && m != null ? Math.round((m / of) * 100) : null);
  const lists = {};
  for (const L of SPEND_LIST_IDS) {
    lists[L] = { ids: c.lists[L].ids, cards: c.lists[L].cards.map((card) => {
      const extra = {};
      if (L === 'steps' && card.values.amount != null) extra.gross = pounds(grossOfRow(card.values, card.saved, b));
      if (L === 'steps' && card.values.amount != null) { extra.ofStart = share(card.values.amount, firstMonthly); extra.ofBudget = saved.budget.total ? share(card.values.amount, saved.budget.total) : null; }
      if (L === 'steps') { const lastByAge = c.lists.steps.cards.filter((x) => x.values.fromAge != null).sort((x, y) => x.values.fromAge - y.values.fromAge).pop(); extra.last = !!lastByAge && lastByAge.id === card.id; }
      if (L === 'costs' && card.values.amount != null && card.values.atAge != null) {
        const schedule = c.schedule || saved.schedule;
        const year = card.values.atAge - saved.ageNow;
        const grossYear = schedule[Math.min(Math.max(0, year), schedule.length - 1)] || 0;
        extra.gross = pounds(Math.round(grossOf(netOf(grossYear, b) + card.values.amount, b) - grossOf(netOf(grossYear, b), b)));
      }
      return { id: card.id, saved: !!card.saved, fields: card.fields, ...extra };
    }) };
  }
  // the picture and the derived lines: from the steps as they would be saved, or as saved
  const rows = c.ok ? c.shape : saved.plainSteps;
  const schedule = c.ok ? c.schedule : saved.schedule;
  const costs = c.ok ? c.lists.costs.cards.map((card) => ({ ...card.values, years: card.values.years == null ? 1 : card.values.years, gross: null })) : saved.costs;
  const { chart, below, floorFrom } = chartOf(rows, schedule, saved, costs);
  const derived = derivedLines(rows, schedule, costs, saved);
  const partners = list.filter((e) => e.plan.id !== plan.id && (e.plan.id === partnerIdOf(plan) || partnerIdOf(e.plan) === plan.id)).map((e) => ({ id: String(e.plan.id), name: nameOf(e.plan) }));
  const p = editable && c.ok ? spendPatch(plan, typed || {}, { today }) : { ok: false, patch: {}, previous: {} };
  const sug = editable ? suggestion(firstGross, saved) : null;
  // each lump sum coming in: what it could support a year over the years left, and the edits that add that to the steps (income.lump-to-steps)
  const lumps = saved.lumps.map((l) => {
    const r = lumpIntoSteps(c.ok ? c.shape : saved.plainSteps, { ageNow: saved.ageNow, duration: saved.duration, amount: l.amount, year: l.atAge - saved.ageNow });
    if (!r) return null;
    return { id: l.id, label: l.label || 'Lump sum', amount: pounds(l.amount), age: r.age, years: r.years, perYear: pounds(r.perYear), perYearValue: r.perYear, edits: editable && c.ok ? lumpEdits(c, r.steps, b) : null };
  }).filter(Boolean);
  return {
    found: true, id: String(plan.id), name: nameOf(plan), locked: saved.locked, lockedOn: saved.lockedOn, readonly, editable,
    source: saved.source, ageNow: saved.ageNow, endAge: saved.endAge, startAge: saved.first.fromAge, flat: saved.flat,
    firstGross: pounds(firstGross), firstGrossSaved: pounds(saved.first.amount), firstMonthly: pounds(firstMonthly),
    budget: { workedOut: saved.budget.workedOut, total: saved.budget.total != null ? pounds(saved.budget.total) : null, totalValue: saved.budget.total, essentials: saved.budget.essentials != null ? pounds(saved.budget.essentials) : null, at: saved.budget.at },
    fields, lists, errors: c.errors, ok: c.ok, derived, chart, below: below ? { age: below.age, amount: pounds(below.amount) } : null,
    floorFrom: floorFrom ? { age: floorFrom.age, amount: pounds(floorFrom.amount) } : null,
    notUsed: notUsedBy(saved.strategyId), floorAndFlex: saved.strategyId === 'floor-and-flex', partners, suggestion: sug, lumps,
    changed: Object.keys(p.patch).length > 0, patch: p.patch, previous: p.previous,
    // the one sentence the toast says after a save
    savedLine: c.ok ? { id: 'spend', slots: { age: saved.first.fromAge, monthly: pounds(firstMonthly), steps: c.lists.steps.cards.length, costs: c.lists.costs.cards.length } } : null
  };
}
