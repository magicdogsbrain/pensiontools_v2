/**
 * "What you pay in" on a saved plan (research/v7/road-to-7.md step 11b: the ledger's save.relief, save.escalation, save.own-mix,
 * save.pot-record): the planner's Accumulation page as a step of the plan — `#/plan/<id>/saving`. Pure: the plans already
 * brought up to date in memory, today's date and what was typed in; out come the boxes with their saved values, what each
 * month's payment becomes once the tax the government adds back is counted (AccumulationEngine.contributionBreakdown, the
 * planner's own sum), what the pot could be by the stop at the regulator's three rates and at the mix you hold (projectAccumulation,
 * Holdings.proportions — the planner's "Your mix" line), the ISA and savings line (PlanTiming.projectedIsaRows), the rule
 * warnings, the monthly pot records, and the exact writes. Nothing here writes, runs a future, or reads a clock.
 *
 *   savedSaving(plan, { today })             the saved facts: the planner's settings object (index.html readAccumulationInputs),
 *                                            the ages (the planner's: its own, else the budget's), the pot today (its own, else
 *                                            the pension lines under "What you hold")
 *   boxesOf(plan, { today })                 the boxes' starting text
 *   checkSaving(plan, typed, { today })      text as typed → { ok, values, errors, applies, saved }
 *   savingPatch(plan, typed, { today })      → { ok, errors, patch, previous }: the whole accumulationTool.settings, written as
 *                                            saveActiveAccumulation writes it (the planner's nine keys), or nothing when unchanged
 *   recordPatch(plan, typed, { today, now }) → { ok, errors, patch, previous, line }: "Record this month's pot" — the record
 *                                            list with this month's record added (recordAccumulationMonth, line for line:
 *                                            potRecordOf stamped at `now`, the moment of the record; the same month replaced,
 *                                            sorted, the last 600 kept); nothing deleted
 *   savingOf(entries, id, { today, typed })  everything the screen draws
 *
 * Every path written is in schema.js SAVING_WRITES (tested). Both writes are outside the lock (LockedPlanGuard.js), as the
 * planner's are: a locked saver still records a month and still changes what they pay in.
 */
import { contributionBreakdown, contributionWarnings, projectAccumulation, FCA_RATES } from '../../services/AccumulationEngine.js';
import { proportions, pensionPotFromHoldings } from '../../services/Holdings.js';
import { potRecordOf, recordIsaOf } from '../../services/SaverReading.js';
import { projectedIsaRows, isaProjectionOf } from '../../services/PlanTiming.js';
import { chargesPctOf } from '../../services/Charges.js';
import { budgetAgeToday, budgetRetirementAge } from '../../services/BudgetModel.js';
import { planStage } from '../../services/PlanReading.js';
import { get, applyPatch, safeSettings } from './about.js';
import { pounds } from './income.js';
import { SAVING_FIELDS, SAVING_WRITES, SCHEME_TYPES } from './schema.js';
import { dateOf, dayWords, monthWords } from './dates.js';

export { applyPatch };

const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const blank = (v) => v === undefined || v === null || (typeof v === 'string' && v.trim() === '');
const copy = (v) => (v === undefined ? undefined : JSON.parse(JSON.stringify(v)));
const text = (v) => (v === undefined ? '<absent>' : JSON.stringify(v));
const nameOf = (plan) => (plan && plan.planDetails && typeof plan.planDetails.name === 'string' && plan.planDetails.name) || (plan && typeof plan.name === 'string' && plan.name) || '';
const num = (v) => (v == null || v === '' || !Number.isFinite(+v) ? null : +v);
const r0 = (v) => Math.round(+v || 0);
const isLocked = (plan) => !!(plan && plan.decisionTool && plan.decisionTool.settings && plan.decisionTool.settings.locked);
/** The record list kept at most this long (ScenarioRepository.saveActiveAccumulationHistory). */
export const RECORDS_KEPT = 600;
/** The planner's nine keys, in its order (index.html readAccumulationInputs). */
export const SETTINGS_KEYS = Object.freeze(['currentAge', 'retirementAge', 'salary', 'potNow', 'netMonthly', 'schemeType', 'employerMonthly', 'escalationPct', 'isaMonthly']);

/** The saved facts. */
export function savedSaving(plan, { today }) {
  const now = dateOf(today);
  const s = (plan && plan.accumulationTool && isObj(plan.accumulationTool.settings)) ? plan.accumulationTool.settings : {};
  const ss = safeSettings(plan, now);
  const budget = (plan && plan.budgetTool && isObj(plan.budgetTool.settings)) ? plan.budgetTool.settings : null;
  // the ages as the planner fills its boxes (loadAccumulationUI): its own, else the budget's — the budget's being About's (ABOUT_WRITES)
  const currentAge = num(s.currentAge) ?? budgetAgeToday(budget) ?? num(ss.currentAge);
  const retirementAge = num(s.retirementAge) ?? budgetRetirementAge(budget) ?? num(ss.retireAge);
  const holdingsPension = pensionPotFromHoldings(plan && plan.holdings);
  const hist = Array.isArray(plan && plan.accumulationTool && plan.accumulationTool.history) ? plan.accumulationTool.history.filter(isObj) : [];
  // the plan's own word on whether work has stopped (the Timing block's "retired"; LifeStage): then there are no saving years to work out
  let retired = false;
  try { retired = !!planStage(plan, { now }).retired; } catch { retired = false; }
  return {
    settings: s, ss, budget, currentAge, retirementAge, holdingsPension, hist, now, locked: isLocked(plan), retired,
    source: { at: plan && plan.lastModified ? dayWords(plan.lastModified) : null }
  };
}

/** The boxes' starting text: the saved facts as a person would type them, by path. */
export function boxesOf(plan, { today }) {
  const s = savedSaving(plan, { today }).settings;
  const out = {};
  for (const k of ['netMonthly', 'employerMonthly', 'isaMonthly', 'salary', 'potNow']) if (num(s[k]) != null && +s[k] !== 0) out[k] = String(+s[k]);
  if (num(s.escalationPct) != null && +s.escalationPct !== 0) out.escalationPct = String(+s.escalationPct);
  out.schemeType = SCHEME_TYPES.includes(s.schemeType) ? s.schemeType : 'ras';
  return out;
}

function parseMoney(t, f) {
  if (blank(t)) return { error: f.required ? 'required' : null, value: f.default != null ? f.default : null };
  const s = String(t).replace(/[£,\s]/g, '');
  if (!/^\d{1,9}(\.\d{1,2})?$/.test(s)) return { error: 'notANumber', value: null };
  const n = Math.round(+s * 100) / 100;
  if (n < f.min) return { error: 'tooLow', value: n };
  if (n > f.max) return { error: 'tooHigh', value: n };
  return { error: null, value: n };
}
function parsePercent(t, f) {
  if (blank(t)) return { error: f.required ? 'required' : null, value: f.default != null ? f.default : null };
  const s = String(t).replace(/[%\s]/g, '');
  if (!/^\d{1,2}(\.\d{1,2})?$/.test(s)) return { error: 'notANumber', value: null };
  const n = +s;
  if (n < f.min || n > f.max) return { error: 'range', value: n };
  return { error: null, value: n };
}
function parseMonth(t) {
  if (blank(t)) return { error: null, value: null };
  const s = String(t).trim();
  const m = /^(\d{4})-(\d{2})$/.exec(s);
  if (!m || +m[2] < 1 || +m[2] > 12) return { error: 'notAMonth', value: null };
  return { error: null, value: s };
}
const field = (path) => SAVING_FIELDS.find((f) => f.path === path);
function parseField(raw, f) {
  if (f.type === 'money') return parseMoney(raw, f);
  if (f.type === 'percent') return parsePercent(raw, f);
  if (f.type === 'month') return parseMonth(raw);
  const v = blank(raw) ? f.default : String(raw);
  return f.options.includes(v) ? { error: null, value: v } : { error: 'notAnOption', value: null };
}

/** Text as typed → the checked values, the errors by path. The record's boxes are checked here too (recordPatch reads them). */
export function checkSaving(plan, typed, { today }) {
  const saved = savedSaving(plan, { today });
  const boxes = { ...boxesOf(plan, { today }), ...(typed || {}) };
  const values = {}, errors = {}, applies = {};
  for (const f of SAVING_FIELDS) {
    applies[f.path] = true;
    const r = parseField(boxes[f.path], f);
    if (r.error) errors[f.path] = r.error; else values[f.path] = r.value;
  }
  // the ages are About's: never typed here
  const inputs = {
    currentAge: saved.currentAge || 0, retirementAge: saved.retirementAge || 0,
    salary: values.salary || 0, potNow: values.potNow || 0, netMonthly: values.netMonthly || 0, schemeType: values.schemeType || 'ras',
    employerMonthly: values.employerMonthly || 0, escalationPct: values.escalationPct || 0, isaMonthly: values.isaMonthly || 0
  };
  return { ok: Object.keys(errors).length === 0, values, errors, applies, saved, inputs };
}

const declared = (patch) => { for (const k of Object.keys(patch)) if (!SAVING_WRITES.includes(k)) throw new Error('saving: "' + k + '" is not a declared field path'); return patch; };

/**
 * The write: the whole settings object as the planner's Save writes it (saveActiveAccumulation: readAccumulationInputs's nine
 * keys, every number `+value || 0`), when any of them differs from what is stored. The record's boxes are not settings.
 */
export function savingPatch(plan, typed, { today }) {
  const c = checkSaving(plan, typed, { today });
  const settingsErrors = Object.fromEntries(Object.entries(c.errors).filter(([k]) => !k.startsWith('record.')));
  if (Object.keys(settingsErrors).length) return { ok: false, errors: settingsErrors, patch: {}, previous: {} };
  const next = {};
  for (const k of SETTINGS_KEYS) next[k] = c.inputs[k];
  const cur = get(plan, 'accumulationTool.settings');
  const same = isObj(cur) && SETTINGS_KEYS.every((k) => text(cur[k] === undefined ? (k === 'schemeType' ? 'ras' : 0) : cur[k]) === text(next[k])) && Object.keys(cur).every((k) => SETTINGS_KEYS.includes(k));
  if (same) return { ok: true, errors: {}, patch: {}, previous: {} };
  return { ok: true, errors: {}, patch: declared({ 'accumulationTool.settings': next }), previous: { 'accumulationTool.settings': copy(cur) } };
}

/**
 * "Record this month's pot" (index.html recordAccumulationMonth, line for line): the month and the three pots → one record
 * (SaverReading.potRecordOf: a blank ISA box is no figure, not £0), stamped at `now` — the moment of the record, the planner's
 * `new Date()`, handed in by the one write file (noon of `today` only when none is given) — the list without that month's old
 * record, this one added, sorted by month, the last 600 kept — the whole list as ONE write. Nothing is ever deleted here.
 */
export function recordPatch(plan, typed, { today, now = null }) {
  const c = checkSaving(plan, typed, { today });
  const errors = Object.fromEntries(Object.entries(c.errors).filter(([k]) => k.startsWith('record.')));
  if (Object.keys(errors).length) return { ok: false, errors, patch: {}, previous: {}, line: null };
  const date = c.values['record.month'];
  if (!date) return { ok: false, errors: { 'record.month': 'required' }, patch: {}, previous: {}, line: null };
  const at = now instanceof Date && Number.isFinite(now.getTime()) ? now : c.saved.now;
  const rec = potRecordOf({ date, sipp: c.values['record.pension'], isa: c.values['record.isa'] == null ? '' : c.values['record.isa'], gia: c.values['record.gia'] }, at);
  if (!rec) return { ok: false, errors: { 'record.pension': 'nothingToRecord' }, patch: {}, previous: {}, line: null };
  const list = c.saved.hist.filter((r) => r.date !== date).concat([rec]).sort((a, b) => String(a.date).localeCompare(String(b.date))).slice(-RECORDS_KEPT);
  const cur = get(plan, 'accumulationTool.history');
  return { ok: true, errors: {}, patch: declared({ 'accumulationTool.history': list }), previous: { 'accumulationTool.history': copy(cur) }, line: { id: 'recorded', slots: { month: monthWords(date), total: pounds(rec.total) } } };
}

// ---- the words ------------------------------------------------------------------------------------------------------------

const pct1 = (v) => (Math.round((+v || 0) * 1000) / 10).toFixed(1);

/** What each month's payment becomes (AccumulationEngine.contributionBreakdown), as line ids with slots. */
export function reliefLines(b, inputs) {
  const lines = [];
  const you = pounds(inputs.netMonthly);
  if (!(inputs.netMonthly > 0) && !(inputs.employerMonthly > 0)) { lines.push({ id: 'relief.none', slots: {} }); return lines; }
  lines.push({ id: b.reliefMonthly > 0.5 ? (b.niSavedMonthly > 0.5 ? 'relief.monthNi' : 'relief.month') : 'relief.monthNone', slots: { you, gross: pounds(Math.round(b.grossMonthly)), relief: pounds(Math.round(b.reliefMonthly)), ni: pounds(Math.round(b.niSavedMonthly)) } });
  if (b.employerMonthly > 0) lines.push({ id: 'relief.employer', slots: { employer: pounds(b.employerMonthly) } });
  lines.push({ id: 'relief.total', slots: { total: pounds(Math.round(b.totalMonthly)), pence: String(Math.round(b.costPerPound * 100)) } });
  if (b.hrClaimMonthly > 0.5) lines.push({ id: 'relief.claim', slots: { claim: pounds(Math.round(b.hrClaimMonthly)), pence: String(Math.max(0, Math.round((inputs.netMonthly - b.hrClaimMonthly) / b.totalMonthly * 100))) } });
  if (inputs.schemeType === 'salsac') lines.push({ id: 'relief.salsac', slots: {} });
  if (inputs.schemeType === 'ras' && inputs.salary > 0 && inputs.salary <= 12570) lines.push({ id: 'relief.nonTaxpayer', slots: {} });
  return lines;
}

/** The rule warnings (AccumulationEngine.contributionWarnings), by id. */
export function warningIds(w) {
  return w.map((x) => (/MPAA/.test(x.message) ? 'warn.mpaa' : /Annual Allowance/.test(x.message) ? 'warn.allowance' : /High income/.test(x.message) ? 'warn.taper' : /Access age/.test(x.message) ? 'warn.access' : 'warn.largePot'));
}

/** Everything the screen draws. `typed` is the draft's values for this plan (text by path), or null. */
export function savingOf(entries, id, { today, typed = null, source = 'account' } = {}) {
  const list = (entries || []).filter((e) => e && e.plan && typeof e.plan === 'object' && e.plan.id != null);
  const entry = list.find((e) => String(e.plan.id) === String(id)) || null;
  if (!entry) return { found: false, id: String(id || '') };
  const plan = entry.plan;
  const readonly = !!(entry.newer || entry.failed);
  const c = checkSaving(plan, typed || {}, { today });
  const s = c.saved;
  const boxes = boxesOf(plan, { today });
  const shown = { ...boxes, ...(typed || {}) };
  const fields = SAVING_FIELDS.map((f) => ({
    path: f.path, type: f.type === 'month' ? 'text' : f.type === 'percent' ? 'money' : f.type, options: f.type === 'choice' ? f.options : null, applies: true,
    shown: blank(shown[f.path]) ? (f.type === 'choice' && f.default != null ? f.default : '') : String(shown[f.path]),
    saved: f.path in boxes ? boxes[f.path] : null,
    error: c.errors[f.path] || null
  }));
  const inputs = c.inputs;
  const ages = inputs.currentAge > 0 && inputs.retirementAge > 0;
  const years = ages ? Math.round(inputs.retirementAge - inputs.currentAge) : 0;
  const stillSaving = ages && years > 0 && !s.retired;
  // the pot today: the box, else the pension lines under "What you hold" (the planner fills the empty box from them)
  const potNow = inputs.potNow > 0 ? inputs.potNow : s.holdingsPension;
  const b = contributionBreakdown({ netMonthly: inputs.netMonthly, salary: inputs.salary, schemeType: inputs.schemeType, employerMonthly: inputs.employerMonthly });
  // "Your mix" (6.7.0): the expected real return of what you hold, net of its costs; the plan's charge replaces the funds' own
  let hp = null;
  try { const p = proportions(plan.holdings); if (p.total > 0) hp = p; } catch { hp = null; }
  const chargesPct = chargesPctOf(s.ss);
  const rows = stillSaving ? projectAccumulation({ currentAge: inputs.currentAge, retirementAge: inputs.retirementAge, potNow, totalMonthly: b.totalMonthly, escalationPct: inputs.escalationPct, mixRealReturn: hp ? hp.expectedReal : null, chargesPct, mixOcf: hp ? hp.weightedOcf : null }) : [];
  const last = rows.length ? rows[rows.length - 1] : null;
  const isaToday = Math.max(0, +(s.ss && s.ss.isaBalance) || 0);
  const how = isaProjectionOf(s.ss);
  const isaRows = stillSaving && (isaToday > 0 || (how.payIns && inputs.isaMonthly > 0)) ? projectedIsaRows(s.ss, inputs, years, isaToday) : null;
  const mpaaTriggered = Array.isArray(plan.decisionTool && plan.decisionTool.history) && plan.decisionTool.history.some((h) => h && (h.taxFree || 0) > 0);
  const warnings = stillSaving && last ? warningIds(contributionWarnings({ annualGrossTotal: b.totalMonthly * 12, salary: inputs.salary, mpaaTriggered, currentAge: inputs.currentAge, retirementAge: inputs.retirementAge, projectedPotHigh: last.potHigh, now: s.now })) : [];
  const step = rows.length > 12 ? 5 : 1;
  const shownRows = [];
  for (let i = 0; i < rows.length; i += (i === 0 || i >= rows.length - step ? 1 : step)) {
    const r = rows[i];
    const ir = isaRows ? isaRows[Math.min(isaRows.length - 1, i)] : null;
    shownRows.push({ age: r.age, low: pounds(r.potLow), mid: pounds(r.potMid), high: pounds(r.potHigh), mix: hp ? pounds(r.potMix || 0) : null, paidIn: pounds(r.contributedToDate), isa: ir ? pounds(ir.potMid) : null, last: i === rows.length - 1, raw: { low: r0(r.potLow), mid: r0(r.potMid), high: r0(r.potHigh), mix: hp ? r0(r.potMix || 0) : null } });
  }
  const records = s.hist.slice().sort((a, b2) => String(a.date).localeCompare(String(b2.date))).reverse().slice(0, 36).map((r) => ({ month: monthWords(r.date), date: r.date, pension: pounds(r.sipp || 0), isa: recordIsaOf(r) == null ? null : pounds(r.isa), gia: pounds(r.gia || 0), total: pounds(r.total || 0) }));
  const p = !readonly && c.ok ? savingPatch(plan, typed || {}, { today }) : { ok: false, patch: {}, previous: {} };
  const rec = typed && Object.keys(typed).some((k) => k.startsWith('record.')) ? recordPatch(plan, typed, { today }) : null;
  return {
    found: true, id: String(plan.id), name: nameOf(plan), readonly, editable: !readonly, source, locked: s.locked,
    savedAt: s.source.at,
    fields, errors: c.errors, ok: c.ok,
    ages: { currentAge: inputs.currentAge, retirementAge: inputs.retirementAge, years, stillSaving, known: ages },
    relief: reliefLines(b, inputs), scheme: inputs.schemeType,
    potNow: { value: pounds(potNow), fromHoldings: !(inputs.potNow > 0) && s.holdingsPension > 0 },
    rates: { low: pct1(FCA_RATES.low), mid: pct1(FCA_RATES.mid), high: pct1(FCA_RATES.high), mix: hp ? pct1(hp.expectedReal + 0.025) : null, charges: chargesPct > 0 ? String(Math.round(chargesPct * 100) / 100) : null },
    mix: hp ? { shares: String(Math.round(hp.buckets.shares * 100)), bonds: String(Math.round(hp.buckets.bonds * 100)), diversifiers: String(Math.round(hp.buckets.diversifiers * 100)), cash: String(Math.round(hp.buckets.cash * 100)), charge: (hp.weightedOcf * 100).toFixed(2) } : null,
    rows: shownRows, isaLine: !!isaRows, isaHow: isaRows ? (how.fromFunds && how.payIns ? 'funds' : how.kind || 'before') : null, isaMonthly: pounds(inputs.isaMonthly),
    warnings,
    records, recordsCount: s.hist.length,
    changed: Object.keys(p.patch).length > 0, patch: p.patch, previous: p.previous,
    recordReady: !!(rec && rec.ok), recordProblem: rec && !rec.ok ? Object.values(rec.errors)[0] || null : null,
    savedLine: c.ok ? { id: 'saving', slots: { you: pounds(inputs.netMonthly), employer: pounds(inputs.employerMonthly), total: pounds(Math.round(b.totalMonthly)) } } : null
  };
}
