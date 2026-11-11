/**
 * "About you and when" (research/v7/editing-in-v7.md 2, 3, 4): the first editing step of a saved plan in V7. Pure: a plan
 * already brought up to date in memory, today's date and what was typed in; the boxes with their saved values and sources,
 * the problems, the derived figures, and the exact field paths and values a save writes out. Nothing here writes, runs a
 * future, or reads a clock.
 *
 *   savedAbout(plan, { today })             the saved facts: age, stopped or stopping, the start year, the end age — from the
 *                                           effective settings (or the plan document when locked), with the timing derived
 *   boxesOf(plan, { today })                the same as text for the boxes (what the draft starts from)
 *   checkAbout(plan, typed, { today })      text as typed → { ok, values, errors, applies, next, timing, duration }
 *   aboutPatch(plan, typed, { today })      → { ok, errors, patch, previous }: the dotted paths that change, with their
 *                                           new values and the values they had (editing-in-v7.md 3)
 *   applyPatch(plan, patch)                 a copy of the plan with the patch folded on (a test's, and the window's, way)
 *   aboutOf(entries, id, { today, typed })  everything the screen draws
 *   answerAge(plan, settings)               the stale-answer rule (4): the plan's stored "will it last" answer is older than
 *                                           its inputs when the settings no longer match the answer's own record
 *   parseMonth(text)                        '2030-06' | 'June 2030' | 'Jun 2030' → { y, m } or null
 *
 * Every path written is in schema.js ABOUT_WRITES (tested); a key is sent only when its value changes.
 */
import { deriveTiming, taxYearStartOf, taxYearLabel, ageOnDate, staleDraft, stoppedWorkOf, taxYearOfMonth, hasStopped } from '../../services/PlanTiming.js';
import { effectiveStressSettings, historyAscending, laterDraftReading } from '../../services/PlanReading.js';
import { accumulationAgesOf } from '../../services/LifeStage.js';
import { longevityAge } from '../../services/LongevityModel.js';
import { grossToNet } from '../../services/TaxCalculator.js';
import { grossUpAnnual, DEFAULT_TAX_BANDS } from '../../services/BudgetModel.js';
import { cleanSteps } from '../../services/IncomeSchedule.js';
import { stopAskOf, stopLeftOf, moveOfferOf, moveBlockedOf, stopChangeOf, planMoveOf, moveFactsOf, startLaterOf, spDateOf, spPlanTaxYearOf } from '../../services/PlanMove.js';
import { money } from '../shared/format.js';
import { ABOUT_FIELDS, ABOUT_WRITES, MIN_YEARS } from './schema.js';
import { dateOf, dayWords, monthWords, localDay, localMonth, MONTHS } from './dates.js';

const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);

// ---- the planner's own tax sum, at the plan's own bands (editing-in-v7.md 8.1; spend.js and the stale rule read these) ----
/** The plan's tax bands as the engine taxes with them; the planner's defaults where a key is missing. */
export function bandsOf(ss) {
  const n = (v, d) => (v == null || v === '' || !Number.isFinite(+v) || +v <= 0 ? d : +v);
  return { pa: n(ss && ss.pa, DEFAULT_TAX_BANDS.pa), brl: n(ss && ss.brl, DEFAULT_TAX_BANDS.brl), hrl: n(ss && ss.hrl, DEFAULT_TAX_BANDS.hrl) };
}
/** A year after tax from a year before tax (TaxCalculator.grossToNet). */
export const netOf = (gross, b) => grossToNet(Math.max(0, +gross || 0), b.pa, b.brl, b.hrl);
/** A year before tax from a year after tax (BudgetModel.grossUpAnnual: the planner's own gross-up; exact within the allowance). */
export const grossOf = (net, b) => grossUpAnnual(Math.max(0, +net || 0), b);
/** The plan's first figure before tax, as "Your plan" reads it: the first step, else the saved schedule's first year, else the flat target. */
export function firstStepGross(ss) {
  const steps = ss && ss.incomeShape === 'phases' ? cleanSteps(ss.incomeSteps) : [];
  if (steps.length) return +steps[0].amount;
  if (Array.isArray(ss && ss.targetSchedule) && ss.targetSchedule.length) return +ss.targetSchedule[0] || 0;
  return +(ss && ss.baseSalary) || 0;
}
const num = (v) => (v == null || v === '' || !Number.isFinite(+v) ? null : +v);
const blank = (v) => v === undefined || v === null || (typeof v === 'string' && v.trim() === '');
const isLocked = (plan) => !!(plan && plan.decisionTool && plan.decisionTool.settings && plan.decisionTool.settings.locked);
const lockedAtOf = (plan) => (plan && plan.decisionTool && plan.decisionTool.settings && plan.decisionTool.settings.lockedAt) || (plan && plan.planDocument && plan.planDocument.lockedAt) || null;
const nameOf = (plan) => (plan && plan.planDetails && typeof plan.planDetails.name === 'string' && plan.planDetails.name) || (plan && typeof plan.name === 'string' && plan.name) || '';
const partnerIdOf = (plan) => (plan && plan.household && typeof plan.household.partnerScenarioId === 'string' && plan.household.partnerScenarioId) || null;
const copy = (v) => (v === undefined ? undefined : JSON.parse(JSON.stringify(v)));
const text = (v) => (v === undefined ? '<absent>' : JSON.stringify(v));

/** The value at a dotted path, or undefined. */
export function get(obj, path) {
  return String(path).split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
}
function setPath(obj, path, value) {
  const parts = String(path).split('.');
  let o = obj;
  for (let i = 0; i < parts.length - 1; i++) { if (!isObj(o[parts[i]])) o[parts[i]] = {}; o = o[parts[i]]; }
  o[parts[parts.length - 1]] = value;
}
function deletePath(obj, path) {
  const parts = String(path).split('.');
  let o = obj;
  for (let i = 0; i < parts.length - 1; i++) { if (!isObj(o[parts[i]])) return; o = o[parts[i]]; }
  delete o[parts[parts.length - 1]];
}

/** '2030-06', '2030-6', 'June 2030', 'jun 2030', '06/2030' → { y, m }; anything else null. */
export function parseMonth(s) {
  const t = String(s == null ? '' : s).trim();
  let m = /^(\d{4})[-/](\d{1,2})$/.exec(t);
  if (m) return +m[2] >= 1 && +m[2] <= 12 ? { y: +m[1], m: +m[2] } : null;
  m = /^(\d{1,2})[-/](\d{4})$/.exec(t);
  if (m) return +m[1] >= 1 && +m[1] <= 12 ? { y: +m[2], m: +m[1] } : null;
  m = /^([A-Za-z]{3,9})\s+(\d{4})$/.exec(t);
  if (m) {
    const i = MONTHS.findIndex((name) => name.toLowerCase().startsWith(m[1].toLowerCase().slice(0, 3)) && name.toLowerCase().startsWith(m[1].toLowerCase()));
    return i >= 0 ? { y: +m[2], m: i + 1 } : null;
  }
  return null;
}
const monthKey = (p) => p.y + '-' + String(p.m).padStart(2, '0');

/** The effective settings, or the stored ones when the planner's reading throws (income.js reads these too). */
export function safeSettings(plan, now) {
  try { return effectiveStressSettings(plan, { now }); } catch { return (plan && plan.stressTool && plan.stressTool.settings) || {}; }
}
export function safeTiming(ss, now) {
  // a plan the timing cannot be read from starts this tax year, as a plan with no age does (7.4.0)
  try { return deriveTiming(ss, now); } catch { const ty = taxYearStartOf(now); return { mode: 'legacy', firstTaxYear: ty, shapeAgeNow: num(ss.shapeAgeNow) || 57, currentAge: null, retireAge: null, startMonth: ty + '-04', yearsToStart: 0 }; }
}

/**
 * The saved facts (2): from the effective settings and the timing the planner derives — or, locked, from the plan document.
 * @returns {{ locked, lockedOn, readonly, ss, stored, timing, duration, values: { age, stopped, stopAge, startWhen, endAge }, source }}
 */
export function savedAbout(plan, { today }) {
  const now = dateOf(today);
  const locked = isLocked(plan);
  const doc = locked ? plan.planDocument : null;
  const ss = safeSettings(plan, now);
  const stored = (plan && plan.stressTool && isObj(plan.stressTool.settings)) ? plan.stressTool.settings : {};
  let timing = safeTiming(ss, now);
  let duration = num(ss.duration) || 35;
  if (doc && isObj(doc.timing)) {
    const dt = doc.timing;
    timing = { ...timing, mode: dt.mode || timing.mode, currentAge: num(dt.currentAge), retireAge: num(dt.retireAge), firstTaxYear: num(dt.firstTaxYear) || timing.firstTaxYear, shapeAgeNow: num(dt.shapeAgeNow) || timing.shapeAgeNow, startMonth: dt.startMonth || timing.startMonth };
    duration = (Array.isArray(doc.timeline) && doc.timeline.length) || num(doc.assumptions && doc.assumptions.duration) || duration;
  }
  const thisTY = taxYearStartOf(now);
  // the age as recorded, with its date (the planner's box shows the same; the engines age it forward from the date)
  const age = timing.mode === 'legacy' ? null : (doc && isObj(doc.timing) ? num(doc.timing.currentAge) : num(ss.currentAge));
  const ageAsOf = doc && isObj(doc.timing) ? (doc.timing.currentAgeAsOf || null) : (ss.currentAgeAsOf || null);
  // the month work stopped or stops (6.51.0), as saved (locked: as the document has it)
  const stopMonth = (doc && isObj(doc.timing) ? stoppedWorkOf(doc.timing) : null) || stoppedWorkOf(ss);
  const stopAhead = !!stopMonth && !hasStopped(stopMonth, now);
  const stopped = age == null ? null : timing.mode === 'future' ? (stopMonth && stopAhead ? 'month' : 'age') : 'yes';
  const fty = timing.firstTaxYear;
  const startWhen = stopped === 'yes' ? whenOf(fty, thisTY, stopped === 'yes' && stopMonth && !stopAhead ? stopMonth : null) : null;
  const endAge = timing.shapeAgeNow + duration - 1;
  const source = locked ? { kind: 'locked', at: dayWords(lockedAtOf(plan)) } : { kind: 'saved', at: plan && plan.lastModified ? dayWords(plan.lastModified) : null };
  const ageSource = locked ? source : { kind: 'saved', at: ageAsOf ? dayWords(ageAsOf) : source.at };
  return {
    locked, lockedOn: locked ? dayWords(lockedAtOf(plan)) : null, ss, stored, timing, duration, thisTY,
    values: { age, stopped, stopAge: stopped === 'age' ? num(timing.retireAge) : null, stopMonth: (stopped === 'yes' && !stopAhead) || stopped === 'month' ? stopMonth : null, startWhen, endAge, savedYear: stopped === 'yes' && startWhen === 'saved' ? fty : null },
    // whether that year was really saved (or fixed by the lock), or is only the derived start of a plan that has saved none:
    // the choice is then named by its year alone, never "as saved" (7.3.3)
    savedYearIsSet: doc && isObj(doc.timing) ? num(doc.timing.firstTaxYear) > 0 : num(stored.firstTaxYear) > 0 || num(stored.legacyFirstTaxYear) > 0,
    source, ageSource
  };
}

/** The boxes' starting text: the saved facts as a person would type them. */
export function boxesOf(plan, { today }) {
  const s = savedAbout(plan, { today });
  const v = s.values;
  const out = {};
  if (v.age != null) out.age = String(v.age);
  if (v.stopped) out.stopped = v.stopped;
  if (v.stopAge != null) out.stopAge = String(v.stopAge);
  if (v.stopMonth) out.stopMonth = monthWords(v.stopMonth);
  if (v.startWhen) out.startWhen = v.startWhen;
  if (Number.isFinite(v.endAge)) out.endAge = String(v.endAge);
  // a plan placed by the Accumulation tab's ages alone (LifeStage 4.6): those ages start the boxes, so Save writes them
  // into the Timing block through the one write path — the next sentence asks for exactly this (P.agesFromSaving)
  if (v.age == null && !s.locked) {
    const acc = accumulationAgesOf(plan);
    if (acc) { out.age = String(acc.currentAge); out.stopped = 'age'; out.stopAge = String(acc.retirementAge); }
  }
  return out;
}

const field = (path) => ABOUT_FIELDS.find((f) => f.path === path);
function parseAge(t, f) {
  if (blank(t)) return { error: f.required ? 'required' : null, value: null };
  const s = String(t).trim();
  if (!/^\d{1,3}$/.test(s)) return { error: 'notANumber', value: null };
  const n = +s;
  if (n < f.min) return { error: 'tooLow', value: n };
  if (n > f.max) return { error: 'tooHigh', value: n };
  return { error: null, value: n };
}

/**
 * Which choice a year 0 is, for someone who has stopped: the tax year they stopped in ('stop'), a year between it and this
 * one ('y2024'), this tax year, or another year as saved. A later year is never offered (nobody retired has months before
 * their plan): one saved before that changed is shown as saved.
 */
function whenOf(fty, thisTY, stopMonth) {
  const stopTY = stopMonth ? taxYearOfMonth(stopMonth) : null;
  if (fty === thisTY) return 'now';
  if (stopTY != null && fty === stopTY) return 'stop';
  if (stopTY != null && fty > stopTY && fty < thisTY) return 'y' + fty;
  return 'saved';
}
/** A 'y<YYYY>' choice's year, or null. */
export const choiceYear = (w) => { const m = /^y(\d{4})$/.exec(String(w || '')); return m ? +m[1] : null; };

/**
 * The start-year choices offered: with the month work stopped (6.51.0), the tax year it is in and every year from it to
 * this one (the planner's own range, PlanTiming.startYearChoices); this tax year; and the saved year when it is none of
 * those. No later year is offered: a retired person's plan starts in the tax year they stopped or the one they pick it up
 * from, never after it.
 */
export function startChoices(saved, stopMonth = null) {
  const out = [];
  const stopTY = stopMonth ? taxYearOfMonth(stopMonth) : null;
  if (stopTY != null && stopTY < saved.thisTY) { out.push('stop'); for (let y = stopTY + 1; y < saved.thisTY; y++) out.push('y' + y); }
  out.push('now');
  const sy = saved.values.savedYear;
  if (sy && sy !== saved.thisTY && !(stopTY != null && sy >= stopTY && sy < saved.thisTY)) out.push('saved');
  return out;
}

/**
 * The boxes as the check reads them: the saved ones, what was typed over them, and — when a month work stopped is typed
 * and no year chosen — the plan's income starting in that month's tax year (the default, research/plan-start.md §6
 * decision 2), or this tax year when it is this one.
 */
function boxesFor(plan, typed, { today }) {
  const saved = savedAbout(plan, { today });
  const boxes = { ...boxesOf(plan, { today }), ...(typed || {}) };
  const t = typed || {};
  if (!blank(t.stopMonth) && blank(t.startWhen) && String(boxes.stopped) === 'yes') {
    const p = parseMonth(t.stopMonth);
    const key = p ? monthKey(p) : null;
    if (key && key !== saved.values.stopMonth && key <= localMonth(dateOf(today))) boxes.startWhen = taxYearOfMonth(key) < saved.thisTY ? 'stop' : 'now';
  }
  return { saved, boxes };
}

/**
 * Text as typed → the checked values, the errors by path, which fields apply, and the settings as they would be saved.
 * `typed` holds text (or a choice) by path; a path not typed takes the saved value (boxesOf).
 */
export function checkAbout(plan, typed, { today }) {
  const now = dateOf(today);
  const { saved, boxes } = boxesFor(plan, typed, { today });
  const values = {};
  const errors = {};
  const applies = { age: true, stopped: true, endAge: true, sex: true, chance: true, stopAge: false, stopMonth: false, startWhen: false };

  const age = parseAge(boxes.age, field('age'));
  if (age.error) errors.age = age.error; else values.age = age.value;

  const stopped = blank(boxes.stopped) ? null : String(boxes.stopped);
  if (!stopped) errors.stopped = 'required';
  else if (!field('stopped').options.includes(stopped)) errors.stopped = 'notAnOption';
  else values.stopped = stopped;
  applies.stopAge = stopped === 'age'; applies.stopMonth = stopped === 'month' || stopped === 'yes'; applies.startWhen = stopped === 'yes';

  if (applies.stopAge) {
    const a = parseAge(boxes.stopAge, field('stopAge'));
    if (a.error) errors.stopAge = a.error;
    else if (values.age != null && a.value < values.age) errors.stopAge = 'stop-before-age';
    else values.stopAge = a.value;
  }
  if (applies.stopMonth) {
    // A stop to come: required, and after this month. Stopped already (6.51.0): optional — a month this one or earlier,
    // however long ago; left blank, the plan does not say (as every plan saved before).
    const past = stopped === 'yes';
    if (blank(boxes.stopMonth)) { if (past) values.stopMonth = null; else errors.stopMonth = 'required'; }
    else {
      const p = parseMonth(boxes.stopMonth);
      if (!p) errors.stopMonth = 'notAMonth';
      else if (past && monthKey(p) > localMonth(now)) errors.stopMonth = 'month-ahead';
      else if (past && values.age != null && (now.getFullYear() - p.y) + (now.getMonth() + 1 - p.m) / 12 > values.age - 16) errors.stopMonth = 'too-early';
      else if (!past && monthKey(p) <= localMonth(now)) errors.stopMonth = 'month-passed';
      else values.stopMonth = monthKey(p);
    }
  }
  const offered = startChoices(saved, stopped === 'yes' ? values.stopMonth || null : null);
  if (applies.startWhen && !errors.stopMonth) {   // the choices hang on the month: one problem at a time
    const w = blank(boxes.startWhen) ? null : String(boxes.startWhen);
    if (!w) errors.startWhen = 'required';
    else if (!offered.includes(w)) errors.startWhen = 'notAnOption';
    else values.startWhen = w;
  }
  for (const p of ['sex', 'chance']) {
    const f = field(p);
    const v = blank(boxes[p]) ? f.default : String(boxes[p]);
    if (!f.options.includes(v)) errors[p] = 'notAnOption'; else values[p] = v;
  }

  // The settings as they would be saved (editing-in-v7.md 3), from what is valid so far.
  let next = null, timing = null, duration = null, stopAgeFromMonth = null;
  const core = values.age != null && values.stopped && !errors.stopAge && !errors.stopMonth && !errors.startWhen;
  if (core) {
    const ss = saved.ss, stored = saved.stored;
    next = { ...stored };
    const agePrev = Math.floor(+ss.currentAge || 0);
    const asOfPrev = ss.currentAgeAsOf || stored.currentAgeAsOf || null;
    next.currentAge = values.age;
    next.currentAgeAsOf = values.age === agePrev && asOfPrev ? asOfPrev : localDay(now);
    const retired = values.stopped === 'yes';
    next.retired = retired;
    let retireAge = null;
    if (values.stopped === 'age') retireAge = values.stopAge;
    if (values.stopped === 'month') {
      const [y, m] = values.stopMonth.split('-').map(Number);
      retireAge = ageOnDate({ ...next, retired: false }, new Date(y, m, 0), now);   // the age reached by the month's last day
      stopAgeFromMonth = retireAge;
    }
    next.retireAge = retired ? null : retireAge;
    // The month work stopped or stops (6.51.0): kept when given, cleared for a stop at an age (the age decides then).
    next.stoppedWork = values.stopped === 'age' ? null : (values.stopMonth || null);
    const w = values.startWhen;
    next.firstTaxYear = retired ? (w === 'now' ? saved.thisTY : w === 'stop' ? taxYearOfMonth(values.stopMonth) : choiceYear(w) || saved.values.savedYear) : null;
    timing = safeTiming(next, now);
    // what the planner's Save writes (index.html timingFieldsForSave): the derived start age, and the derived first tax year
    // in every mode but legacy (stopping later: the year the stop age is reached)
    next.shapeAgeNow = timing.shapeAgeNow;
    if (timing.mode !== 'legacy') next.firstTaxYear = timing.firstTaxYear;
  }
  // never below the box's own lowest age: a plan whose income started when work stopped at 16 or 17 (6.51.0) would
  // otherwise be offered an end age the box refuses
  const minEnd = timing ? Math.max(field('endAge').min, timing.shapeAgeNow + MIN_YEARS - 1) : field('endAge').min;
  const e = parseAge(boxes.endAge, field('endAge'));
  if (e.error) errors.endAge = e.error;
  else if (e.value < minEnd) errors.endAge = 'too-short';
  else values.endAge = e.value;
  if (next && values.endAge != null) { duration = Math.max(MIN_YEARS, values.endAge - timing.shapeAgeNow + 1); next.duration = duration; }

  const ok = Object.keys(errors).length === 0 && next !== null && duration !== null;
  return { ok, values, errors, applies, offered, next: ok ? next : null, timing: ok ? timing : null, duration, stopAgeFromMonth, saved, minEnd };
}

/** The budget's copy of the ages, as the planner keeps it in step (index.html syncBudgetAgeFromTiming). */
function budgetWant(plan, next, timing) {
  if (!(plan && plan.budgetTool && isObj(plan.budgetTool.settings))) return {};
  const retireAge = next.retired === false && +next.retireAge > 0 ? +next.retireAge : timing.shapeAgeNow;
  return {
    'budgetTool.settings.currentAge': next.currentAge,
    'budgetTool.settings.currentAgeAsOf': next.currentAgeAsOf,
    'budgetTool.settings.retired': next.retired,
    'budgetTool.settings.retirementAge': retireAge
  };
}

/**
 * The Accumulation tab's copy of the ages, kept in step the same way (research/saving-enough-and-check-in.md 4.4): "What
 * you pay in" draws what the pot could be by the stop from those ages, and the plan's verdict reads the stop from the
 * timing, so a stop moved here and not there showed two stops on one page. Only on a plan that has the section, and only
 * while work is still ahead: once the plan says work has stopped, the saving figures are left as they were.
 */
function accumulationWant(plan, next) {
  if (!(plan && plan.accumulationTool && isObj(plan.accumulationTool.settings))) return {};
  if (!(next.retired === false && +next.retireAge > 0 && +next.currentAge > 0)) return {};
  return {
    'accumulationTool.settings.currentAge': next.currentAge,
    'accumulationTool.settings.retirementAge': +next.retireAge
  };
}

/**
 * The write (3): every declared path whose value would change, with the new value and the one it had. `previous` holds
 * `undefined` for a key the plan did not have. Nothing for a locked plan, a plan shown as saved, or typed text with a
 * problem.
 */
export function aboutPatch(plan, typed, { today }) {
  const c = checkAbout(plan, typed, { today });
  if (!c.ok) return { ok: false, errors: c.errors, patch: {}, previous: {} };
  if (c.saved.locked) return { ok: false, errors: { plan: 'locked' }, patch: {}, previous: {} };
  const next = c.next, t = c.timing;
  const want = {
    'stressTool.settings.currentAge': next.currentAge,
    'stressTool.settings.currentAgeAsOf': next.currentAgeAsOf,
    'stressTool.settings.retired': next.retired,
    'stressTool.settings.retireAge': next.retireAge,
    'stressTool.settings.stoppedWork': next.stoppedWork,
    'stressTool.settings.firstTaxYear': next.firstTaxYear,
    'stressTool.settings.shapeAgeNow': next.shapeAgeNow,
    'stressTool.settings.duration': next.duration,
    'decisionTool.settings.firstTaxYear': t.firstTaxYear,
    ...budgetWant(plan, next, t),
    ...accumulationWant(plan, next)
  };
  const patch = {}, previous = {};
  for (const path of ABOUT_WRITES) {
    if (!(path in want)) continue;
    const cur = get(plan, path);
    const val = want[path];
    if (text(cur) === text(val)) continue;
    if (cur === undefined && val === null) continue;      // absent and null read alike: no key is added for nothing
    patch[path] = copy(val);
    previous[path] = copy(cur);
  }
  return { ok: true, errors: {}, patch, previous };
}

/**
 * An out-of-date draft (road-to-7.md step 11b, the ledger's timing.stale-draft; PlanTiming.staleDraft, the planner's own rule):
 * the start year has passed, the plan is not locked and nothing is recorded. "Update it" sets the boxes as the planner's update
 * sets its form — stopped, starting this tax year — and the ordinary save writes the timing, so the steps, the per-year figures
 * and the Decision tool's first year all move with it. Null when there is nothing to offer, or "Leave it" was chosen for that year.
 */
export function staleOf(plan, { today }) {
  const now = dateOf(today);
  const s = savedAbout(plan, { today });
  let hasRecords = false;
  try { hasRecords = historyAscending(plan).length > 0; } catch { hasRecords = false; }
  let sd = null;
  try { sd = staleDraft(s.ss, { locked: s.locked, hasRecords, now }); } catch { sd = null; }
  if (!sd) return null;
  return { savedYear: sd.savedYear, yearSaved: sd.savedLabel, suggestedYear: sd.suggestedYear, year: sd.suggestedLabel, mode: sd.mode,
    edits: [{ path: 'stopped', value: 'yes' }, { path: 'startWhen', value: 'now' }] };
}

/** "Leave it": the planner's own key, the saved year remembered so the offer is not made again for it; nothing else written. */
export function stalePatch(plan, { today }) {
  const sd = staleOf(plan, { today });
  if (!sd) return { ok: false, errors: { stale: 'none' }, patch: {}, previous: {}, line: null };
  const path = 'stressTool.settings.staleDraftDismissedFor';
  return { ok: true, errors: {}, patch: { [path]: sd.savedYear }, previous: { [path]: copy(get(plan, path)) }, line: { id: 'staleLeft', slots: { yearSaved: sd.yearSaved } } };
}

/**
 * A locked plan's start on this step (6.53.0, research/plan-start.md §4). Locked, the step is read-only, but the month work
 * stopped is the person's own fact, which the lock guard lets a locked plan write (LockedPlanGuard.LOCKED_BOOKKEEPING):
 *  - `ask`: the plan does not say it (PlanMove.stopAskOf) — asked once, here and in the planner's Timing block; "Leave it"
 *    is remembered (stressTool.settings.stopMonthLeft);
 *  - `move`: it does, and that tax year is earlier than the plan's first (PlanMove.moveOfferOf) — the move is offered, and
 *    from 6.55.0 made here (the parity ledger's timing.move-start row): `confirm` is what its confirm says, line by line
 *    (moveConfirmOf: the facts the planner's own confirm states), before the one write (moveStart.js movePatch, sent by
 *    effects/planWrite.js moveStart). `stepped`: the plan's income is in steps (the words then speak of its first step),
 *    else one yearly figure;
 *  - `blocked`: it does, earlier than the plan's first, but the move cannot keep its figures (PlanMove.moveBlockedOf);
 *  - `change`: the month it says, in words — changeable while the plan is locked (PlanMove.stopChangeOf), so a month typed
 *    wrongly is not kept for good;
 *  - `left`: "Leave it" was said and no month (PlanMove.stopLeftOf) — not asked again, but the month can still be said,
 *    folded, without unlocking.
 * From 7.4.0, on a plan stored with its start later than this tax year (PlanMove.startLaterOf), "Leave it" no longer puts the
 * question away: the plan has something to move, so the month is asked whatever was said before (`leave` false), and
 *  - `nowMove`: with no month said, "I'm already drawing: start it this tax year" — the move to this tax year, its confirm
 *    line by line as the move's (`how` { thisYear: true });
 *  - `spAsk` on `move` or `nowMove`: the plan gives its State Pension only as a plan year, which the move cannot carry; its
 *    start date is asked (typed as `moveSpDate`) and written in the same move. The confirm, and the move, wait for a date.
 * `blocked` stays only for a plan a date cannot carry either (none today: PlanMove.moveBlockedOf's `spFix`).
 * @returns {{ ask: boolean, leave: boolean, move: null | { yearStop, yearStart, month, stepped, spAsk, confirm, how },
 *   nowMove: null | { yearStop, yearStart, stepped, spAsk, confirm, how }, blocked: null | { yearStart: string, month: string },
 *   change: string|null, left: boolean, spShown: string, spError: string|null, spPlanYear: string|null }}
 */
export function lockedStartOf(plan, { today, typed = null }) {
  const now = dateOf(today);
  const spShown = typed && typeof typed.moveSpDate === 'string' ? typed.moveSpDate : '';
  const spDate = spDateOf(spShown);
  const spError = !blank(spShown) && !spDate ? 'notADate' : null;
  let offer = null, ask = false, blocked = null, change = null, left = false, later = null;
  try {
    later = startLaterOf(plan, now);
    offer = moveOfferOf(plan, now);
    blocked = offer ? null : moveBlockedOf(plan, now);
    // a move whose State Pension date is asked (7.4.0): offered with the date typed, or waiting for one — and, waiting, it
    // keeps the month the recorded months begin (7.4.3), so its words say why it goes to that year before any date is typed
    const spMove = !offer && blocked && blocked.spFix ? (spDate ? moveOfferOf(plan, now, { spStartDate: spDate })
      : { stopMonth: blocked.stopMonth, from: blocked.from, to: blocked.to, ...(blocked.recordsFrom ? { recordsFrom: blocked.recordsFrom } : {}) }) : null;
    if (spMove) { offer = { ...spMove, spAsk: true }; blocked = null; }
    ask = !offer && (stopAskOf(plan, now) || (!!later && later.kind === 'ask' && !!later.thisYear));
    change = ask ? null : stopChangeOf(plan, now);
    left = !offer && !ask && stopLeftOf(plan, now);
  } catch { offer = null; ask = false; blocked = null; change = null; left = false; later = null; }
  const ss = (plan && plan.stressTool && plan.stressTool.settings) || {};
  const stepped = ss.incomeShape === 'phases' && cleanSteps(ss.incomeSteps).length > 0;
  const nowHow = later && later.kind === 'ask' && later.thisYear ? { thisYear: true, ...(later.spAsk && spDate ? { spStartDate: spDate } : {}) } : null;
  const moveHow = offer && offer.spAsk ? (spDate ? { spStartDate: spDate } : null) : {};
  return {
    ask,
    // "Leave it" only where nothing is to move: the plain question of a plan whose start is where it should be
    leave: ask && !(later && later.kind === 'ask' && later.thisYear),
    // `records` (7.4.3): the plan's recorded months begin later than work stopped, or no month is said — it starts when they do
    move: offer ? { yearStop: taxYearLabel(offer.to), yearStart: taxYearLabel(offer.from), month: monthWords(offer.stopMonth), stepped, spAsk: !!offer.spAsk,
      records: offer.recordsFrom ? monthWords(offer.recordsFrom) : null, start: 'April ' + offer.from,
      confirm: moveHow ? moveConfirmOf(plan, now, moveHow) : [], how: moveHow } : null,
    nowMove: nowHow ? { yearStop: taxYearLabel(later.thisYear), yearStart: taxYearLabel(later.start), stepped, spAsk: !!later.spAsk,
      confirm: !later.spAsk || spDate ? moveConfirmOf(plan, now, nowHow) : [], how: !later.spAsk || spDate ? nowHow : null } : null,
    blocked: blocked ? { yearStart: taxYearLabel(blocked.from), month: monthWords(blocked.stopMonth), records: blocked.recordsFrom ? monthWords(blocked.recordsFrom) : null, start: 'April ' + blocked.from } : null,
    change: change ? monthWords(change) : null,
    left, spShown, spError,
    // where the State Pension's date is asked, the tax year the plan pays it from as it stands, named beside the box
    spPlanYear: (offer && offer.spAsk) || (nowHow && later.spAsk) ? (() => { let y = null; try { y = spPlanTaxYearOf(plan); } catch { y = null; } return y ? taxYearLabel(y) : null; })() : null
  };
}

/**
 * What the confirm of the move says, line by line, each `{ id, slots }` (the words: copy/about.js lockedStart.confirm):
 * the planner's own confirm (src/ui/planStartUi.js moveStartQuestion), from the same facts (PlanMove.moveFactsOf) — the
 * new first tax year and the old, the plan staying locked; the income (the first step keeps its amount and the later
 * steps their ages, or the one yearly figure) and the age the plan still ends at; the dated figures keeping their tax
 * years; the recorded months, counted from the new start; the plan document and plan
 * vs actual written again (a ladder bought from the tax year the run starts in); the State Pension's count and the years
 * the plan counts; the months not recorded; and what is not affected. A choice of words per count, so no line says
 * "1 years". Empty when the plan is offered no move.
 */
function moveConfirmOf(plan, now, how = {}) {
  const m = planMoveOf(plan, now, how);
  if (!m) return [];
  const f = moveFactsOf(plan, m);
  const yearStop = taxYearLabel(m.to);
  const age = +m.stress.shapeAgeNow > 0 ? String(+m.stress.shapeAgeNow) : null;
  const amount = f.stepAmount > 0 ? money(f.stepAmount) : null;
  const one = (n) => (n === 1 ? 'One' : '');
  // the move to this tax year names no month (7.4.0); a State Pension date given is said as written
  // the move to the tax year the recorded months begin in (7.4.3) names their first month, and says they are read against it
  const lines = [m.recordsFrom ? { id: 'firstRecords', slots: { yearStop, records: monthWords(m.recordsFrom), yearStart: taxYearLabel(m.from) } }
    : m.stopMonth ? { id: 'first', slots: { yearStop, month: monthWords(m.stopMonth), yearStart: taxYearLabel(m.from) } } : { id: 'firstNow', slots: { yearStop, yearStart: taxYearLabel(m.from) } }];
  if (m.spStartDate) lines.push({ id: 'spDate', slots: { date: m.spStartDate } });
  // a date in another tax year than the plan paid it from: said, as the date then moves it there
  if (m.spStartDate && m.spDateYear > 0 && m.spPlanYear > 0 && m.spDateYear !== m.spPlanYear) lines.push({ id: 'spDateMoved', slots: { dateTaxYear: taxYearLabel(m.spDateYear), paidFrom: taxYearLabel(m.spPlanYear) } });
  lines.push({ id: (f.stepped ? 'steps' : 'level') + (amount && age ? '' : 'Bare'), slots: { yearStop, ...(amount ? { amount } : {}), ...(age ? { age } : {}) } });
  if (f.endAge > 0) lines.push({ id: 'ends' + one(m.years), slots: { endAge: String(f.endAge), n: String(m.years) } });
  if (f.dated) lines.push({ id: 'dated', slots: {} });
  const ms = f.months.slice().sort();
  if (ms.length) {
    lines.push(ms.length === 1 ? { id: 'monthOne', slots: { first: monthWords(ms[0]), yearStop } } : { id: 'months', slots: { n: String(ms.length), first: monthWords(ms[0]), last: monthWords(ms[ms.length - 1]), yearStop } });
  }
  lines.push(f.ladder && f.runYear ? { id: 'documentLadder', slots: { runYear: taxYearLabel(f.runYear) } } : { id: 'document', slots: {} });
  if (f.sp) lines.push(f.sp.before != null && f.sp.before >= 0 ? { id: 'sp', slots: { spYear: taxYearLabel(f.sp.taxYear), after: String(f.sp.after), before: String(f.sp.before) } } : { id: 'spNoBefore', slots: { spYear: taxYearLabel(f.sp.taxYear), after: String(f.sp.after) } });
  lines.push({ id: (f.ladder ? 'moreLadder' : 'more') + one(m.years), slots: { n: String(m.years) } });
  if (m.stopMonth && !m.recordsFrom) lines.push({ id: 'fill', slots: {} });
  lines.push({ id: 'notAffected', slots: {} });
  return lines;
}

/**
 * The month typed for a locked plan's stop (lockedStartOf's question, its change; the planner's own box, lockedStartUi.js): a
 * month this one or earlier, however long ago, after 16 (the step's own box's rule). `age`: the age today, when known.
 * @returns {{ error: null, value: string } | { error: 'required'|'notAMonth'|'month-ahead'|'too-early' }}
 */
export function lockedStopAnswer(t, now, age) {
  return stopAnswer(t, now, age);
}
function stopAnswer(t, now, age) {
  if (blank(t)) return { error: 'required' };
  const p = parseMonth(t);
  if (!p) return { error: 'notAMonth' };
  if (monthKey(p) > localMonth(now)) return { error: 'month-ahead' };
  if (age != null && (now.getFullYear() - p.y) + (now.getMonth() + 1 - p.m) / 12 > age - 16) return { error: 'too-early' };
  return { error: null, value: monthKey(p) };
}

/**
 * The write lockedStartOf's question makes (the one write this step makes on a locked plan: effects/planWrite.js save):
 * the month typed (`stopMonth`) as stressTool.settings.stoppedWork, or "Leave it" (`stopAskLeft` typed 'yes') as
 * stressTool.settings.stopMonthLeft. Nothing else; refused when the plan is not locked, or neither asks nor says the month.
 * @returns {{ ok: boolean, errors: object, patch: object, previous: object, line: object|null }}
 */
export function stopAskPatch(plan, typed, { today }) {
  const no = (errors) => ({ ok: false, errors, patch: {}, previous: {}, line: null });
  if (!isLocked(plan)) return no({ plan: 'notLocked' });
  const now = dateOf(today);
  const ls = lockedStartOf(plan, { today });
  if (!ls.ask && !ls.change && !ls.left) return no({ plan: 'locked' });
  const t = typed || {};
  // anything else typed is a box of the unlocked step, and a locked plan's: refused as locked, as before; nothing typed writes nothing
  if (Object.keys(t).some((k) => k !== 'stopMonth' && k !== 'stopAskLeft' && k !== 'moveSpDate' && !blank(t[k]))) return no({ plan: 'locked' });
  if (ls.ask && ls.leave && String(t.stopAskLeft || '') === 'yes') {
    const path = 'stressTool.settings.stopMonthLeft';
    return { ok: true, errors: {}, patch: { [path]: true }, previous: { [path]: copy(get(plan, path)) }, line: { id: 'stopLeft', slots: {} } };
  }
  if (blank(t.stopMonth)) return no({ plan: 'locked' });
  const a = stopAnswer(t.stopMonth, now, savedAbout(plan, { today }).values.age);
  if (a.error) return no({ stopMonth: a.error });
  const path = 'stressTool.settings.stoppedWork';
  return { ok: true, errors: {}, patch: { [path]: a.value }, previous: { [path]: copy(get(plan, path)) }, line: { id: 'stopSaved', slots: { month: monthWords(a.value) } } };
}

/** A copy of the plan with a patch folded on: a dotted path set to its value, or removed when the value is undefined. */
export function applyPatch(plan, patch) {
  const out = JSON.parse(JSON.stringify(plan));
  for (const [path, v] of Object.entries(patch || {})) { if (v === undefined) deletePath(out, path); else setPath(out, path, copy(v)); }
  return out;
}

/**
 * The derived figures (2), as line ids with their slots; from the timing as it would be saved, or as saved. A plan that says
 * when work stopped says so; one that has started says where today stands in it ("plan year 3 of 30"). A plan stored with
 * its start later than the stop says nothing of the months before it: its home asks to move the start.
 */
export function derivedLines(timing, duration, { stopAgeFromMonth = null } = {}) {
  if (!timing || timing.mode === 'legacy') return [{ id: 'noAge', slots: {} }];
  const endAge = timing.shapeAgeNow + duration - 1;
  const lines = [];
  if (timing.mode === 'future') {
    if (stopAgeFromMonth != null) lines.push({ id: 'monthAs', slots: { age: timing.retireAge, month: monthWords(timing.startMonth) } });
    else lines.push({ id: 'stopIn', slots: { month: monthWords(timing.startMonth), age: timing.retireAge } });
  } else if (timing.stoppedWork) lines.push({ id: 'stoppedIn', slots: { month: monthWords(timing.stoppedWork) } });
  lines.push({ id: 'firstYear', slots: { year: taxYearLabel(timing.firstTaxYear), y: timing.firstTaxYear } });
  if (timing.mode !== 'future' && timing.planYearNow > 0) lines.push({ id: 'started', slots: { year: taxYearLabel(timing.firstTaxYear), yearNow: taxYearLabel(timing.firstTaxYear + timing.planYearNow), ageNow: timing.shapeAgeNow + timing.planYearNow } });
  lines.push({ id: 'runs', slots: { years: duration, from: timing.mode === 'future' ? monthWords(timing.startMonth) : 'April ' + timing.firstTaxYear, endAge } });
  lines.push({ id: 'stepsFrom', slots: { age: timing.shapeAgeNow } });
  return lines;
}

/** The settings of this step a strategy ignores (2): none today, for every strategy. A later step fills it. */
export function notUsedBy(strategyId) {
  void strategyId;
  return [];
}

/**
 * The stale-answer rule (4). A plan made from a V7 answer carries the answer's own record of its inputs (PlanSeed.js
 * fromAnswer): the age today, whether and when they stop, and the years. When the settings no longer match, the stored
 * "will it last" answer was worked out before the change.
 * @returns {null | { workedOutOn: string, changedOn: string|null, lasted: number|null, diffs: string[] }}
 */
export function answerAge(plan, settings) {
  const fa = plan && plan.fromAnswer;
  if (!isObj(fa) || !isObj(fa.answer) || !Array.isArray(fa.people) || !isObj(fa.people[0])) return null;
  const ss = settings || {};
  const p = fa.people[0];
  const stop = isObj(p.stop) ? p.stop : isObj(fa.stop) ? fa.stop : null;
  const later = stop ? stop.kind === 'later' : num(p.ageAtStop) != null && num(p.ageToday) != null && p.ageAtStop > p.ageToday;
  const years = num(p.years) != null ? num(p.years) : num(fa.years);
  const diffs = [];
  if (num(p.ageToday) != null && num(ss.currentAge) !== num(p.ageToday)) diffs.push('age');
  if ((ss.retired === false) !== later) diffs.push('stopped');
  if (later && ss.retired === false && num(ss.retireAge) !== num(p.ageAtStop)) diffs.push('stopAge');
  if (years != null && num(ss.duration) !== years) diffs.push('years');
  // "Money that comes in anyway" (editing-in-v7.md 7.4): the State Pension and the final-salary pension a year, when the
  // answer's record carries them (null in the record means none); a record without them is judged on the facts above
  if (p.statePension === null || (isObj(p.statePension) && num(p.statePension.yearly) != null)) {
    const recorded = p.statePension === null ? 0 : Math.round(num(p.statePension.yearly));
    const now = +ss.spWeeklyAmount > 0 && ss.spStartDate ? Math.round(+ss.spWeeklyAmount * 52) : 0;
    if (recorded !== now) diffs.push('statePension');
  }
  if (p.finalSalary === null || (isObj(p.finalSalary) && num(p.finalSalary.yearly) != null)) {
    const recorded = p.finalSalary === null ? 0 : Math.round(num(p.finalSalary.yearly));
    if (recorded !== Math.round(num(ss.dbAmount) || 0)) diffs.push('finalSalary');
  }
  // "What you spend" (editing-in-v7.md 8.4): the first take-home row a month against the plan's first figure read back
  // through the planner's own tax sum, within £1 (the seed grossed it up at the planner's default bands)
  if (Array.isArray(p.takeHome) && isObj(p.takeHome[0]) && num(p.takeHome[0].perMonth) != null) {
    const recorded = Math.round(num(p.takeHome[0].perMonth));
    const now = Math.round(netOf(firstStepGross(ss), bandsOf(ss)) / 12);
    if (Math.abs(recorded - now) > 1) diffs.push('spend');
  }
  // "Your pots and tax" (editing-in-v7.md 9.4): the pension pot the seed wrote (today's, or the middling pot at the stop when
  // today's was £0 on a plan stopping later — PlanSeed's own rule) against the pots the plan draws from, and the savings
  // today against the ISA, each to the pound
  if (isObj(p.pension) && num(p.pension.today) != null) {
    const atStop = isObj(p.pension.atStop) ? num(p.pension.atStop.middling) : null;
    const seeded = later && !(num(p.pension.today) > 0) && atStop != null ? atStop : num(p.pension.today);
    const now = (num(ss.equityMin) || 0) + (num(ss.bondMin) || 0) + (num(ss.cashTarget) || 0) + (num(ss.diversifierStart) || 0);
    if (Math.round(seeded) !== Math.round(now)) diffs.push('pension');
  }
  if (isObj(p.savings) && num(p.savings.today) != null && Math.round(num(p.savings.today)) !== Math.round(num(ss.isaBalance) || 0)) diffs.push('isa');
  if (!diffs.length) return null;
  const savedOn = typeof fa.savedOn === 'string' ? fa.savedOn : '';
  const changed = plan.lastModified && String(plan.lastModified) > savedOn ? dayWords(plan.lastModified) : null;
  return { workedOutOn: dayWords(savedOn), changedOn: changed, lasted: isObj(fa.answer) ? num(isObj(fa.answer.chance) ? fa.answer.chance.fixedAge : fa.answer.lasted) : null, diffs };
}

/**
 * Everything the screen draws (2, 4). `typed` is the draft's values for this plan (text by path), or null.
 */
export function aboutOf(entries, id, { today, typed = null } = {}) {
  const list = (entries || []).filter((e) => e && e.plan && typeof e.plan === 'object' && e.plan.id != null);
  const entry = list.find((e) => String(e.plan.id) === String(id)) || null;
  if (!entry) return { found: false, id: String(id || '') };
  const plan = entry.plan;
  const readonly = !!(entry.newer || entry.failed);
  const saved = savedAbout(plan, { today });
  const editable = !saved.locked && !readonly;
  const boxes = boxesOf(plan, { today });
  const c = checkAbout(plan, typed || {}, { today });
  const shown = boxesFor(plan, typed, { today }).boxes;
  const fields = ABOUT_FIELDS.map((f) => ({
    path: f.path, type: f.type, options: f.type === 'choice' ? (f.path === 'startWhen' ? c.offered : f.options) : null,
    applies: c.applies[f.path] !== false,
    shown: blank(shown[f.path]) ? '' : String(shown[f.path]),
    saved: f.path in boxes ? boxes[f.path] : null,
    error: c.errors[f.path] || null
  }));
  const derived0 = c.ok ? derivedLines(c.timing, c.duration, { stopAgeFromMonth: c.stopAgeFromMonth }) : derivedLines(saved.timing, saved.duration);
  // a draft saved with a later start than it should have (7.4.0): read from the earlier year, said once, until it is saved
  let later = null; try { later = laterDraftReading(plan, { now: dateOf(today) }); } catch { later = null; }
  // said for a plan with no age too (it starts this tax year), as the planner's Timing summary says it: one rule in both apps
  const derived = later ? [{ id: later.stopMonth ? 'laterStop' : 'laterNow', slots: { year: taxYearLabel(later.to) } }, ...derived0] : derived0;
  const sid = (plan.planDocument && plan.planDocument.strategy && plan.planDocument.strategy.id) || saved.ss.strategyId || 'pots-and-valves';
  const partners = list.filter((e) => e.plan.id !== plan.id && (e.plan.id === partnerIdOf(plan) || partnerIdOf(e.plan) === plan.id)).map((e) => ({ id: String(e.plan.id), name: nameOf(e.plan) }));
  let suggestion = null;
  if (c.values.age != null) {
    // 7.8.0: not said reads the women's figures (LongevityModel.sexKey), as every weighted figure does
    const sex = c.values.sex === 'm' ? 'm' : 'f';
    const endAge = longevityAge(c.values.age, sex, +(c.values.chance || '10'), today);
    suggestion = { endAge, applied: String(shown.endAge || '') === String(endAge), slots: { age: endAge, who: sex === 'f' ? 'women' : 'men', ageNow: c.values.age, chance: c.values.chance || '10' }, notSaid: c.values.sex !== 'm' && c.values.sex !== 'f' };
  }
  const p = editable && c.ok ? aboutPatch(plan, typed || {}, { today }) : { ok: false, patch: {}, previous: {} };
  const slots = { years: saved.duration, endAge: saved.values.endAge };
  // an out-of-date draft (timing.stale-draft): offered only where the step can be edited
  const stale = editable ? staleOf(plan, { today }) : null;
  // a locked plan's start (6.53.0): "When did you stop work?" once, or the move, confirmed and made here (6.55.0)
  let lockedStart = null;
  if (saved.locked && !readonly) {
    const ls = lockedStartOf(plan, { today, typed });
    if (ls.ask || ls.move || ls.nowMove || ls.blocked || ls.change || ls.left) {
      const shown = typed && typeof typed.stopMonth === 'string' ? typed.stopMonth : '';
      const answer = (ls.ask || ls.change || ls.left) && !blank(shown) ? stopAnswer(shown, dateOf(today), saved.values.age) : null;
      lockedStart = { ...ls, shown, error: answer && answer.error ? answer.error : null };
    }
  }
  return {
    found: true, id: String(plan.id), name: nameOf(plan), locked: saved.locked, lockedOn: saved.lockedOn, readonly, editable, stale, lockedStart,
    source: saved.source, ageSource: saved.ageSource, thisTY: saved.thisTY, yearNow: taxYearLabel(saved.thisTY),
    yearSaved: saved.values.savedYear ? taxYearLabel(saved.values.savedYear) : null, yearSavedIsSet: saved.savedYearIsSet,
    // the tax year work stopped in, for the 'stop' choice (as typed, else as saved), and each 'y<YYYY>' choice's year in words
    yearStop: (() => { const m = c.values.stopMonth || saved.values.stopMonth; return m ? taxYearLabel(taxYearOfMonth(m)) : null; })(),
    // work stopped this tax year: the 'now' choice is the tax year work stopped, and says so
    stopThisYear: (() => { const m = c.values.stopMonth || saved.values.stopMonth; return !!m && taxYearOfMonth(m) === saved.thisTY; })(),
    yearChoices: Object.fromEntries((c.offered || []).filter((o) => choiceYear(o)).map((o) => [o, taxYearLabel(choiceYear(o))])),
    fields, errors: c.errors, ok: c.ok, derived, notUsed: notUsedBy(sid), partners, suggestion, endAgeMin: c.minEnd, minYears: MIN_YEARS,
    changed: Object.keys(p.patch).length > 0, patch: p.patch, previous: p.previous, savedSlots: slots,
    // the one sentence the toast says after a save: what the plan now runs to
    savedLine: c.ok ? { id: 'runsTo', slots: { endAge: c.values.endAge, years: c.duration } } : null
  };
}
