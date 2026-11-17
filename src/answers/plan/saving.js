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
 *
 * The limit on what goes in once money has been taken from a pension flexibly (research/plan-start.md §2 J;
 * services/FlexibleAccess.js): a plan carrying the person's `flexibleAccess` (a saving plan made on going back to work) says
 * the rule in plain words whatever is paid in (`allowance`: the month it began, and whether what goes in now is more), and
 * the warnings list leaves the planner's own two lines of it out (the allowance line says it); a plan without it is read by
 * its own records, as before (`warn.mpaa`).
 */
import { takenOfTarget } from '../../services/BeforeTax.js';
import { contributionBreakdown, contributionWarnings, projectAccumulation, FCA_RATES } from '../../services/AccumulationEngine.js';
import { proportions, pensionPotFromHoldings } from '../../services/Holdings.js';
import { potRecordOf, recordIsaOf } from '../../services/SaverReading.js';
import { projectedIsaRows, isaProjectionOf } from '../../services/PlanTiming.js';
import { chargesPctOf } from '../../services/Charges.js';
import { budgetAgeToday, budgetRetirementAge } from '../../services/BudgetModel.js';
import { planStage } from '../../services/PlanReading.js';
import { get, applyPatch, safeSettings, aboutPatch } from './about.js';
import { savedSpend, spendPatch } from './spend.js';
import { pounds } from './income.js';
import { SAVING_FIELDS, SAVING_WRITES, SCHEME_TYPES, SAVING_WANT_FIELDS, SAVING_WANT_WRITES } from './schema.js';
import { ACCUMULATION_V7_KEYS, payInSaid, payInShareOf } from '../../services/SaverPayIn.js';
import { saverInputsOf, saverRunKey, saverDraftOf } from './saverInputs.js';
import { SAVER_STAGES } from './steps.js';
import { dateOf, dayWords, monthWords } from './dates.js';
import { mpaaOf, flexibleAccessAlong, FLEXIBLE_ACCESS_LIMIT } from '../../services/FlexibleAccess.js';
import { notBegunOf } from '../../services/PlanClosed.js';
import { saverFacts } from '../../services/SaverFacts.js';
import { pensionTodayPatch } from '../../services/PensionToday.js';
import { shownPlanName } from '../../services/PlanName.js';

export { applyPatch };

const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const blank = (v) => v === undefined || v === null || (typeof v === 'string' && v.trim() === '');
const copy = (v) => (v === undefined ? undefined : JSON.parse(JSON.stringify(v)));
const text = (v) => (v === undefined ? '<absent>' : JSON.stringify(v));
/** The name a plan is shown by: the person's own, else one that follows the plan's present figures (services/PlanName.js). */
const nameOf = (plan, now) => shownPlanName(plan, { now });
const num = (v) => (v == null || v === '' || !Number.isFinite(+v) ? null : +v);
const r0 = (v) => Math.round(+v || 0);
const isLocked = (plan) => !!(plan && plan.decisionTool && plan.decisionTool.settings && plan.decisionTool.settings.locked);
/** The record list kept at most this long (ScenarioRepository.saveActiveAccumulationHistory). */
export const RECORDS_KEPT = 600;
/** The planner's nine keys, in its order (index.html readAccumulationInputs). */
export const SETTINGS_KEYS = Object.freeze(['currentAge', 'retirementAge', 'salary', 'potNow', 'netMonthly', 'schemeType', 'employerMonthly', 'escalationPct', 'isaMonthly']);
/**
 * The keys only V7 writes beside them (research/saving-enough-and-check-in.md 4.4, 4.5: a share of pay and a kept saving
 * mix; services/SaverPayIn.js). Save here keeps them as they are, as the planner's Save does: when the pounds change, the
 * share no longer agrees and is read as pounds — nothing is guessed and nothing is lost.
 */
export const V7_SETTINGS_KEYS = ACCUMULATION_V7_KEYS;

/** The saved facts. */
export function savedSaving(plan, { today }) {
  const now = dateOf(today);
  const s = (plan && plan.accumulationTool && isObj(plan.accumulationTool.settings)) ? plan.accumulationTool.settings : {};
  const ss = safeSettings(plan, now);
  const budget = (plan && plan.budgetTool && isObj(plan.budgetTool.settings)) ? plan.budgetTool.settings : null;
  // the saver's facts, one reader for every screen (services/SaverFacts.js): the age rolled forward to today, the age to
  // stop and the pot today; with no ages there, the planner's own, else the budget's (About's)
  const facts = saverFacts(plan, ss, { now });
  const currentAge = facts.age ?? num(s.currentAge) ?? budgetAgeToday(budget) ?? num(ss.currentAge);
  const retirementAge = facts.stopAge ?? num(s.retirementAge) ?? budgetRetirementAge(budget) ?? num(ss.retireAge);
  const holdingsPension = pensionPotFromHoldings(plan && plan.holdings);
  const hist = Array.isArray(plan && plan.accumulationTool && plan.accumulationTool.history) ? plan.accumulationTool.history.filter(isObj) : [];
  // the plan's own word on whether work has stopped (the Timing block's "retired"; LifeStage): then there are no saving years to work out
  let retired = false;
  try { retired = !!planStage(plan, { now }).retired; } catch { retired = false; }
  return {
    settings: s, ss, budget, currentAge, retirementAge, holdingsPension, hist, now, locked: isLocked(plan), retired, facts,
    source: { at: plan && plan.lastModified ? dayWords(plan.lastModified) : null }
  };
}

/** The boxes' starting text: the saved facts as a person would type them, by path. */
export function boxesOf(plan, { today }) {
  const saved = savedSaving(plan, { today });
  const s = saved.settings;
  const out = {};
  for (const k of ['netMonthly', 'employerMonthly', 'isaMonthly', 'salary']) if (num(s[k]) != null && +s[k] !== 0) out[k] = String(+s[k]);
  // the pot today as it is read (the newest figure you gave), so the box and the line above the table say one figure
  if (saved.facts.pot.from !== 'none' && saved.facts.pot.pension > 0) out.potNow = String(Math.round(saved.facts.pot.pension * 100) / 100);
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

// ---- "What you want" (7.12.0): the amount to spend and the stop age, beside what goes in -----------------------------------

const wantField = (path) => SAVING_WANT_FIELDS.find((f) => f.path === path);

/**
 * The saved want of a plan still saving: the amount a month after tax at today's prices (What you spend's first amount, the
 * figure spendPatch compares with) and the stop age (the saver's facts, as the verdict reads it); the age the spending first
 * changes later, when it does. `open` is false for a plan not saving, or with no stop age or no amount: then no section.
 */
export function savedWant(plan, { today }) {
  const saved = savedSaving(plan, { today });
  const f = saved.facts;
  let sp = null;
  try { sp = savedSpend(plan, { today }); } catch { sp = null; }
  const stopAge = f && f.saving && num(f.stopAge) > 0 ? Math.round(f.stopAge) : null;
  const ageNow = f && num(f.age) != null ? Math.floor(f.age) : null;
  // (7.12.0) the amount in force when you stop: the last step that starts at or before the stop (the first amount when
  // none does), and the box that edits it on "What you spend"
  const steps = sp && Array.isArray(sp.steps) ? sp.steps : [];
  const atStop = stopAge == null ? null : [...steps].filter((x) => num(x.fromAge) != null && +x.fromAge <= stopAge).sort((a, b) => +a.fromAge - +b.fromAge).pop() || null;
  const inForce = atStop || (sp && sp.first) || null;
  const monthly = inForce && inForce.monthly > 0 ? inForce.monthly : null;
  const path = atStop ? `steps.${atStop.id}.amount` : 'first.amount';
  const later = steps.map((x) => +x.fromAge).filter((a) => stopAge != null && a > stopAge).sort((a, b) => a - b)[0];
  return { open: !saved.retired && stopAge != null && monthly != null, locked: saved.locked, monthly, stopAge, ageNow, laterAge: later == null ? null : later,
    path, stepAge: atStop ? +atStop.fromAge : null };
}

/** The want's boxes as typed (blank: as saved) → { ok, errors, monthly, stopAge, changed: { monthly, stopAge } }. */
export function checkWant(plan, typed, { today }) {
  const w = savedWant(plan, { today });
  const t = typed || {};
  const none = { ok: true, errors: {}, monthly: w.monthly, stopAge: w.stopAge, changed: { monthly: false, stopAge: false }, saved: w };
  // nothing to change: a plan not saving, or locked (its want is said, never boxed)
  if (!w.open || w.locked) return none;
  const errors = {};
  let monthly = w.monthly, stopAge = w.stopAge;
  const m = t['want.monthly'];
  if (!blank(m)) {
    const s = String(m).replace(/[£,\s]/g, '');
    const fm = wantField('want.monthly');
    if (!/^\d{1,9}(\.\d{1,2})?$/.test(s)) errors['want.monthly'] = 'notANumber';
    else if (Math.round(+s) < fm.min) errors['want.monthly'] = 'tooLow';
    else if (Math.round(+s) > fm.max) errors['want.monthly'] = 'tooHigh';
    else monthly = Math.round(+s);
  }
  const a = t['want.stopAge'];
  if (!blank(a)) {
    const s = String(a).trim();
    const fa = wantField('want.stopAge');
    if (!/^\d{1,3}$/.test(s)) errors['want.stopAge'] = 'notANumber';
    else if (+s < fa.min) errors['want.stopAge'] = 'tooLow';
    else if (+s > fa.max) errors['want.stopAge'] = 'tooHigh';
    // a stop to come: after the age today
    else if (w.ageNow != null && +s <= w.ageNow) errors['want.stopAge'] = 'notAhead';
    else stopAge = +s;
  }
  const ok = Object.keys(errors).length === 0;
  return { ok, errors, monthly, stopAge, changed: { monthly: ok && monthly !== w.monthly, stopAge: ok && stopAge !== w.stopAge }, saved: w };
}

/**
 * The want's own writes (About's for the stop age, then What you spend's for the amount, each on the plan as the one before
 * leaves it) → { ok, errors, patch, plan } — `plan` with them folded on, for What you pay in's own write to be worked on.
 * Exported (7.12.0) for "Use these in ‘…’" on B's answer, which carries the age and the amount tried (answers/plan/useAnswer.js).
 */
export function wantWrites(plan, typed, { today }) {
  const w = checkWant(plan, typed, { today });
  if (!w.ok) return { ok: false, errors: w.errors, patch: {}, plan };
  let base = plan;
  const patch = {};
  if (w.changed.stopAge) {
    const a = aboutPatch(base, { stopped: 'age', stopAge: String(w.stopAge) }, { today });
    if (!a.ok) return { ok: false, errors: { 'want.stopAge': a.errors.stopAge || 'notWithAbout' }, patch: {}, plan };
    Object.assign(patch, a.patch);
    base = applyPatch(base, a.patch);
  }
  if (w.changed.monthly) {
    // the amount in force at the stop (with a new stop, at that stop): the first amount, or the step that starts by then
    const at = savedWant(base, { today });
    const path = at.path || 'first.amount';
    const s = spendPatch(base, { [path]: String(w.monthly) }, { today });
    if (!s.ok) return { ok: false, errors: { 'want.monthly': s.errors[path] || 'notWithSpend' }, patch: {}, plan };
    Object.assign(patch, s.patch);
    base = applyPatch(base, s.patch);
  }
  return { ok: true, errors: {}, patch, plan: base, want: w };
}

/**
 * The write (7.12.0): "What you want" and what goes in, ONE write. The want's paths (About's and What you spend's, written by
 * their own builders) and then What you pay in's own (ownSavingPatch, worked on the plan with the want folded on). A path
 * under `accumulationTool.settings` that About keeps in step is dropped when the whole settings object is written: that
 * object already carries it. `previous` is every path as the plan had it, so Undo puts all of it back.
 */
export function savingPatch(plan, typed, { today }) {
  const w = wantWrites(plan, typed, { today });
  const own = ownSavingPatch(w.plan, typed, { today });
  if (!w.ok || !own.ok) return { ok: false, errors: { ...(w.ok ? {} : w.errors), ...(own.ok ? {} : own.errors) }, patch: {}, previous: {} };
  if (!Object.keys(w.patch).length) return own;
  const patch = { ...w.patch, ...own.patch };
  if (patch['accumulationTool.settings']) for (const k of Object.keys(patch)) if (k.startsWith('accumulationTool.settings.')) delete patch[k];
  for (const k of Object.keys(patch)) if (!SAVING_WRITES.includes(k) && !SAVING_WANT_WRITES.includes(k)) throw new Error('saving: "' + k + '" is not a declared field path');
  const previous = {};
  for (const k of Object.keys(patch)) previous[k] = copy(get(plan, k));
  return { ok: true, errors: {}, patch, previous };
}

/**
 * What you pay in's own write: the whole settings object as the planner's Save writes it (saveActiveAccumulation:
 * readAccumulationInputs's nine keys, every number `+value || 0`), when any of them differs from what is stored. The
 * record's boxes are not settings.
 */
function ownSavingPatch(plan, typed, { today }) {
  const c = checkSaving(plan, typed, { today });
  const settingsErrors = Object.fromEntries(Object.entries(c.errors).filter(([k]) => !k.startsWith('record.')));
  if (Object.keys(settingsErrors).length) return { ok: false, errors: settingsErrors, patch: {}, previous: {} };
  const next = {};
  for (const k of SETTINGS_KEYS) next[k] = c.inputs[k];
  const cur = get(plan, 'accumulationTool.settings');
  if (isObj(cur)) for (const k of V7_SETTINGS_KEYS) if (cur[k] !== undefined) next[k] = copy(cur[k]);
  // the ages are About's, never typed here: the ones stored stay (the facts read the Timing block's first)
  if (isObj(cur)) for (const k of ['currentAge', 'retirementAge']) if (num(cur[k]) > 0) next[k] = cur[k];
  // the pot today: the box opens on the pot as read (boxesOf), so a box left as it opened keeps what is stored; a new figure
  // is written with this month's pot record in the same write (PensionToday.pensionTodayPatch), so it is the one read next
  const potRead = c.saved.facts.pot.from !== 'none' && c.saved.facts.pot.pension > 0 ? Math.round(c.saved.facts.pot.pension * 100) / 100 : 0;
  const potTyped = c.inputs.potNow;
  const potChanged = potTyped !== potRead && !(potTyped === 0 && potRead === 0);
  if (!potChanged) next.potNow = isObj(cur) && cur.potNow !== undefined ? cur.potNow : 0;
  const pot = potChanged && potTyped > 0 ? pensionTodayPatch(plan, potTyped, { now: c.saved.now, settings: next }) : {};
  const same = isObj(cur) && SETTINGS_KEYS.every((k) => text(cur[k] === undefined ? (k === 'schemeType' ? 'ras' : 0) : cur[k]) === text(next[k])) && Object.keys(cur).every((k) => SETTINGS_KEYS.includes(k) || V7_SETTINGS_KEYS.includes(k));
  if (same && !pot['accumulationTool.history']) return { ok: true, errors: {}, patch: {}, previous: {} };
  const patch = { 'accumulationTool.settings': next, ...(pot['accumulationTool.history'] ? { 'accumulationTool.history': pot['accumulationTool.history'] } : {}) };
  const previous = { 'accumulationTool.settings': copy(cur), ...(patch['accumulationTool.history'] ? { 'accumulationTool.history': copy(get(plan, 'accumulationTool.history')) } : {}) };
  return { ok: true, errors: {}, patch: declared(patch), previous };
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
  // a plan that carries a closed one on records no month before its first (a saving plan whose change-over is still to
  // come): that month is the previous plan's (PlanClosed.successorRefusal is the store's rule behind this)
  if (notBegunOf(plan, date)) return { ok: false, errors: { 'record.month': 'beforePlan' }, patch: {}, previous: {}, line: null };
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
  // the claim back from HMRC (7.12.0): on the pay above the higher-rate line only, said a year, with the pay it is on
  if (b.hrClaimMonthly > 0.5) lines.push({ id: 'relief.claim', slots: { salary: pounds(inputs.salary), above: pounds(Math.max(0, inputs.salary - 50270)), claim: pounds(Math.round(b.hrClaimMonthly * 12)) } });
  if (inputs.schemeType === 'salsac') lines.push({ id: 'relief.salsac', slots: {} });
  if (inputs.schemeType === 'ras' && inputs.salary > 0 && inputs.salary <= 12570) lines.push({ id: 'relief.nonTaxpayer', slots: {} });
  return lines;
}

/** The rule warnings (AccumulationEngine.contributionWarnings), by id. */
export function warningIds(w) {
  return w.filter((x) => x.code !== 'mpaa-carried' && x.code !== 'mpaa-carried-over')
    .map((x) => (/MPAA/.test(x.message) ? 'warn.mpaa' : /Annual Allowance/.test(x.message) ? 'warn.allowance' : /High income/.test(x.message) ? 'warn.taper' : /Access age/.test(x.message) ? 'warn.access' : 'warn.largePot'));
}

/**
 * The limit carried as the person's fact (services/FlexibleAccess.js), for the screens: { month: 'March 2029', over, yearly }
 * — `over` when what lands in the pension a year (`yearlyIn`, the tax added back and the employer's part counted) is more
 * than £10,000, compared as worked out (the planner's contributionWarnings compares the same figure, unrounded), and only the
 * words rounded — or null for a plan that does not carry it, stored or along the plans before it among `plans`.
 */
export function allowanceOf(plan, yearlyIn, plans = []) {
  const fa = mpaaOf(plan, null, plans).flexibleAccess;
  if (!fa) return null;
  const y = +yearlyIn || 0;
  return { month: monthWords(fa.since), over: y > FLEXIBLE_ACCESS_LIMIT, yearly: pounds(Math.round(y)) };
}

/**
 * What the rail's "Ask a question" links open filled from the plan (research/saving-enough-and-check-in.md 4.1): B with a
 * saver's own figures, as B's boxes hold them, and the plan's own mixes when its boxes can name them only by the nearest
 * level (saverInputs.js saverDraftOf), so B gives the answer the plan gives — `{ b: { values, mixes } }`, `mixes` null when
 * the levels are the plan's; `{}` for a plan that is not saving, or one B cannot read (no aim, no saving years), and then
 * B opens as it always has. The plan source puts it on the page reading (planSource.js viewFor), beside read.js planPage.
 * A plan that carries the person's fact of money taken flexibly (services/FlexibleAccess.js flexibleAccessAlong: a saving
 * plan made on going back to work) passes it on too (`flexibleAccess`), so a plan kept from that answer carries it.
 */
export function askFillOf(entries, id, { today } = {}) {
  const entry = (entries || []).find((e) => e && e.plan && e.plan.id != null && String(e.plan.id) === String(id)) || null;
  if (!entry) return {};
  try {
    if (!SAVER_STAGES.includes(planStage(entry.plan, { now: dateOf(today) }).key)) return {};
    const d = saverDraftOf(entry.plan, { today, plans: entries });
    const fa = d.ok ? flexibleAccessAlong(entry.plan, entries) : null;
    return d.ok ? { b: { values: d.values, mixes: d.mixes, ...(fa ? { flexibleAccess: fa } : {}) } } : {};
  } catch { return {}; }
}

/**
 * "You stop work in November 2048, at 67: 22 years of saving from age 45." Whole years are the months to the stop ÷ 12, rounded
 * down; months are said too under two years, and alone under one.
 */
export function agesLineOf(facts, inputs) {
  const months = facts && facts.monthsToStop != null ? facts.monthsToStop : Math.max(0, Math.round((inputs.retirementAge - inputs.currentAge) * 12));
  const y = Math.floor(months / 12), m = months % 12;
  const yw = y + ' year' + (y === 1 ? '' : 's'), mw = m + ' month' + (m === 1 ? '' : 's');
  const span = y === 0 ? mw : y < 2 && m > 0 ? yw + ' ' + mw : yw;
  const slots = { span, from: String(inputs.currentAge), to: String(inputs.retirementAge) };
  return facts && facts.stopMonth ? { id: 'ages', slots: { ...slots, month: monthWords(facts.stopMonth) } } : { id: 'agesNoMonth', slots };
}

/** The line above the table: where the pot today comes from (SaverFacts pot.from), with its figure. */
export function potLineOf(pot) {
  const p = pot || {};
  if (p.from === 'none' || !(p.pension > 0)) return { id: 'none', slots: {} };
  const value = pounds(p.pension);
  if (p.from === 'record' || p.from === 'checkIn') return { id: p.at ? 'record' : 'recordUndated', slots: { value, month: p.at ? monthWords(p.at) : '' } };
  if (p.from === 'answer') return { id: 'answer', slots: { value } };
  if (p.from === 'holdings' || p.from === 'plan') return { id: p.from, slots: { value } };
  return { id: 'saved', slots: { value } };
}

/**
 * What goes in now, said one way on every screen (services/SaverPayIn.js payInSaid; 7.12.0): what leaves take-home pay,
 * what lands in the pension with the tax added back, the employer's part and all of it — "you" never followed by a bare
 * amount. `settings` are the saving settings (the planner's nine keys, and a share when it agrees). → { id, slots }
 */
export function payInNowOf(settings) {
  const a = settings || {};
  const net = +a.netMonthly || 0, employer = +a.employerMonthly || 0, salary = +a.salary || 0, scheme = a.schemeType || 'ras';
  let landed = 0;
  try { landed = net > 0 ? contributionBreakdown({ netMonthly: net, salary, schemeType: scheme, employerMonthly: 0 }).grossMonthly : 0; } catch { landed = 0; }
  const said = payInSaid({ ownLanded: landed, employer, scheme, salary });
  const slots = { takeHome: pounds(Math.round(said.takeHome)), landed: pounds(Math.round(said.ownLanded)), employer: pounds(Math.round(said.employer)), total: pounds(Math.round(said.total)) };
  if (!(said.total > 0)) return { id: 'none', slots };
  const share = payInShareOf(a);
  if (share) return { id: 'share', slots: { ...slots, ownPct: String(share.ownPct), employerPct: String(share.employerPct) } };
  if (!(landed > 0)) return { id: 'employerOnly', slots };
  const before = scheme === 'netpay' || scheme === 'salsac';
  return { id: (before ? 'before' : 'pounds') + (employer > 0 ? 'Employer' : ''), slots };
}

/** "Are you paying in enough?" on the plan's figures as saved: the run's key, inputs and the words beside it. */
function verdictOf(plan, list, today) {
  const read = saverInputsOf(plan, { today, plans: list });
  // what goes in now, said one way (payInNowOf), with the pay and the whole a month, so a share of pay can be said beside it
  const acc = plan && plan.accumulationTool && isObj(plan.accumulationTool.settings) ? plan.accumulationTool.settings : {};
  const line = payInNowOf(acc);
  let total = 0;
  try { total = contributionBreakdown({ netMonthly: +acc.netMonthly || 0, salary: +acc.salary || 0, schemeType: acc.schemeType || 'ras', employerMonthly: +acc.employerMonthly || 0 }).totalMonthly; } catch { total = 0; }
  const now = { line, salary: +acc.salary || 0, total: Math.round(total * 100) / 100 };
  return read.ok
    ? { ok: true, key: saverRunKey(plan.id, read), inputs: read.inputs, env: read.env, now, notes: { ...read.notes, aimYearly: pounds(takenOfTarget(read.notes.aimYearly, plan && plan.stressTool && plan.stressTool.settings)), aimMonthly: pounds(read.notes.aimMonthly), stopAge: String(read.notes.stopAge), rise: read.notes.rise ? { pct: String(read.notes.rise.pct), path: read.notes.rise.path } : null } }
    : { ok: false, why: read.why || 'notSaving', key: null };
}

/**
 * The same verdict for the plan's home (7.12.0): the home of a plan still saving says the answer, under the same key, so the
 * one run serves both the home and "What you pay in". Null for a plan not saving or shown as saved.
 */
export function saverVerdictOf(entries, id, { today } = {}) {
  const list = (entries || []).filter((e) => e && e.plan && typeof e.plan === 'object' && e.plan.id != null);
  const entry = list.find((e) => String(e.plan.id) === String(id)) || null;
  if (!entry || entry.newer || entry.failed) return null;
  try {
    if (!SAVER_STAGES.includes(planStage(entry.plan, { now: dateOf(today) }).key)) return null;
    return verdictOf(entry.plan, list, today);
  } catch { return null; }
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
  // the pot today, as read (services/SaverFacts.js), unless a new figure is typed in the box and not yet saved
  const f = s.facts;
  const typedPot = typed && !blank(typed.potNow) && c.values.potNow != null;
  const potNow = typedPot ? inputs.potNow : f.pot.pension;
  const potLine = typedPot ? { id: 'typed', slots: { value: pounds(potNow) } } : potLineOf(f.pot);
  const agesLine = stillSaving ? agesLineOf(f, inputs) : null;
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
  const mpaa = mpaaOf(plan, null, list);
  const warnings = stillSaving && last ? warningIds(contributionWarnings({ annualGrossTotal: b.totalMonthly * 12, salary: inputs.salary, mpaaTriggered: mpaa.triggered, flexibleAccess: mpaa.flexibleAccess, currentAge: inputs.currentAge, retirementAge: inputs.retirementAge, projectedPotHigh: last.potHigh, now: s.now })) : [];
  const allowance = allowanceOf(plan, b.totalMonthly * 12, list);
  // a saving plan made on going back to work, its change-over still to come: it says when it begins, and its pot record
  // takes no month before then (recordPatch)
  const notYet = readonly ? null : notBegunOf(plan, String(today || '').slice(0, 7));
  const step = rows.length > 12 ? 5 : 1;
  const shownRows = [];
  for (let i = 0; i < rows.length; i += (i === 0 || i >= rows.length - step ? 1 : step)) {
    const r = rows[i];
    const ir = isaRows ? isaRows[Math.min(isaRows.length - 1, i)] : null;
    shownRows.push({ age: r.age, low: pounds(r.potLow), mid: pounds(r.potMid), high: pounds(r.potHigh), mix: hp ? pounds(r.potMix || 0) : null, paidIn: pounds(r.contributedToDate), isa: ir ? pounds(ir.potMid) : null, last: i === rows.length - 1, raw: { low: r0(r.potLow), mid: r0(r.potMid), high: r0(r.potHigh), mix: hp ? r0(r.potMix || 0) : null } });
  }
  const records = s.hist.slice().sort((a, b2) => String(a.date).localeCompare(String(b2.date))).reverse().slice(0, 36).map((r) => ({ month: monthWords(r.date), date: r.date, pension: pounds(r.sipp || 0), isa: recordIsaOf(r) == null ? null : pounds(r.isa), gia: pounds(r.gia || 0), total: pounds(r.total || 0) }));
  // "Are you paying in enough?" (research/saving-enough-and-check-in.md 4.1, 4.4; release step R2): the plan's own figures as
  // question B's inputs, worked out by B in the worker (effects/saver.js) under this key — never for a plan shown as saved
  // (its shape is newer than this code), and from the figures as saved, never from boxes not yet saved
  // "What you want" (7.12.0): the amount and the stop age beside what goes in, written by the one Save
  const wc = checkWant(plan, typed || {}, { today });
  const p = !readonly && c.ok ? savingPatch(plan, typed || {}, { today }) : { ok: false, patch: {}, previous: {} };
  // the answer follows what is typed: with a change ready to save, it is worked out on the plan as Save would leave it, and
  // said as "if you save this"; nothing typed, or a box with a problem, and it is the plan's as saved
  const typedPlan = !readonly && p.ok && Object.keys(p.patch).length ? applyPatch(plan, p.patch) : null;
  const verdict = readonly ? { ok: false, why: 'readonly', key: null }
    : typedPlan ? { ...verdictOf(typedPlan, list.map((e) => (e === entry ? { ...e, plan: typedPlan } : e)), today), ifSaved: true }
      : verdictOf(plan, list, today);
  const ws = wc.saved;
  const wantShown = (path, v) => (typed && typeof typed[path] === 'string' ? typed[path] : v == null ? '' : String(v));
  const want = !ws.open ? null : {
    locked: ws.locked,
    saved: { monthly: pounds(ws.monthly), stopAge: String(ws.stopAge) },
    laterAge: ws.laterAge != null ? String(ws.laterAge) : null,
    stepAge: ws.stepAge != null ? String(ws.stepAge) : null,
    fields: SAVING_WANT_FIELDS.map((f) => ({ path: f.path, type: f.type, options: null, applies: !ws.locked, shown: wantShown(f.path, f.path === 'want.monthly' ? ws.monthly : ws.stopAge), saved: null, error: (wc.errors[f.path] || (p.errors && p.errors[f.path])) || null }))
  };
  const wantSaid = (wc.changed.monthly || wc.changed.stopAge) ? { wantMonthly: pounds(wc.monthly), wantAge: String(wc.stopAge) } : null;
  const rec = typed && Object.keys(typed).some((k) => k.startsWith('record.')) ? recordPatch(plan, typed, { today }) : null;
  return {
    found: true, id: String(plan.id), name: nameOf(plan, s.now), readonly, editable: !readonly, source, locked: s.locked,
    savedAt: s.source.at,
    fields, errors: { ...c.errors, ...wc.errors }, ok: c.ok && wc.ok,
    ages: { currentAge: inputs.currentAge, retirementAge: inputs.retirementAge, years, stillSaving, known: ages, line: agesLine },
    relief: reliefLines(b, inputs), scheme: inputs.schemeType,
    potNow: { value: pounds(potNow), line: potLine },
    // the pot at the stop the plan uses (services/PotsAtStop.js, through the plan's settings as read), the middling case
    atStop: stillSaving && s.ss && s.ss.potAtRetirement && s.ss.potAtRetirement.source === 'worked' ? { value: pounds(Math.round(s.ss.potAtRetirement.sipp / 1000) * 1000), age: String(s.ss.potAtRetirement.from ? s.ss.potAtRetirement.from.toAge : inputs.retirementAge) } : null,
    rates: { low: pct1(FCA_RATES.low), mid: pct1(FCA_RATES.mid), high: pct1(FCA_RATES.high), mix: hp ? pct1(hp.expectedReal + 0.025) : null, charges: chargesPct > 0 ? String(Math.round(chargesPct * 100) / 100) : null },
    mix: hp ? { shares: String(Math.round(hp.buckets.shares * 100)), bonds: String(Math.round(hp.buckets.bonds * 100)), diversifiers: String(Math.round(hp.buckets.diversifiers * 100)), cash: String(Math.round(hp.buckets.cash * 100)), charge: (hp.weightedOcf * 100).toFixed(2) } : null,
    rows: shownRows, isaLine: !!isaRows, isaHow: isaRows ? (how.fromFunds && how.payIns ? 'funds' : how.kind || 'before') : null, isaMonthly: pounds(inputs.isaMonthly),
    warnings,
    allowance,
    notYet: notYet ? { month: notYet.month } : null,
    records, recordsCount: s.hist.length,
    changed: Object.keys(p.patch).length > 0, patch: p.patch, previous: p.previous,
    recordReady: !!(rec && rec.ok), recordProblem: rec && !rec.ok ? Object.values(rec.errors)[0] || null : null,
    savedLine: c.ok ? (() => { const n = payInNowOf({ ...(isObj(s.settings) ? s.settings : {}), ...inputs }); return wantSaid ? { id: 'savingWant.' + n.id, slots: { ...n.slots, ...wantSaid } } : { id: 'saving.' + n.id, slots: n.slots }; })() : null,
    want,
    verdict
  };
}
