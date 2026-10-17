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
import { deriveTiming, taxYearStartOf, taxYearLabel, ageOnDate } from '../../services/PlanTiming.js';
import { effectiveStressSettings } from '../../services/PlanReading.js';
import { longevityAge } from '../../services/LongevityModel.js';
import { ABOUT_FIELDS, ABOUT_WRITES, MIN_YEARS } from './schema.js';
import { dateOf, dayWords, monthWords, localDay, localMonth, MONTHS } from './dates.js';

const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
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

function safeSettings(plan, now) {
  try { return effectiveStressSettings(plan, { now }); } catch { return (plan && plan.stressTool && plan.stressTool.settings) || {}; }
}
function safeTiming(ss, now) {
  try { return deriveTiming(ss, now); } catch { return { mode: 'legacy', firstTaxYear: now.getFullYear() + 1, shapeAgeNow: num(ss.shapeAgeNow) || 57, currentAge: null, retireAge: null, startMonth: (now.getFullYear() + 1) + '-04', yearsToStart: 0, bridgeMonths: 0 }; }
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
  const stopped = age == null ? null : timing.mode === 'future' ? 'age' : 'yes';
  const fty = timing.firstTaxYear;
  const startWhen = stopped === 'yes' ? (fty === thisTY ? 'now' : fty === thisTY + 1 ? 'april' : 'saved') : null;
  const endAge = timing.shapeAgeNow + duration - 1;
  const source = locked ? { kind: 'locked', at: dayWords(lockedAtOf(plan)) } : { kind: 'saved', at: plan && plan.lastModified ? dayWords(plan.lastModified) : null };
  const ageSource = locked ? source : { kind: 'saved', at: ageAsOf ? dayWords(ageAsOf) : source.at };
  return {
    locked, lockedOn: locked ? dayWords(lockedAtOf(plan)) : null, ss, stored, timing, duration, thisTY,
    values: { age, stopped, stopAge: stopped === 'age' ? num(timing.retireAge) : null, startWhen, endAge, savedYear: stopped === 'yes' && startWhen === 'saved' ? fty : null },
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
  if (v.startWhen) out.startWhen = v.startWhen;
  if (Number.isFinite(v.endAge)) out.endAge = String(v.endAge);
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

/** The start-year choices offered (this tax year, next April, and the saved year when it is neither). */
export function startChoices(saved) {
  const out = ['now', 'april'];
  if (saved.values.savedYear) out.push('saved');
  return out;
}

/**
 * Text as typed → the checked values, the errors by path, which fields apply, and the settings as they would be saved.
 * `typed` holds text (or a choice) by path; a path not typed takes the saved value (boxesOf).
 */
export function checkAbout(plan, typed, { today }) {
  const now = dateOf(today);
  const saved = savedAbout(plan, { today });
  const boxes = { ...boxesOf(plan, { today }), ...(typed || {}) };
  const values = {};
  const errors = {};
  const applies = { age: true, stopped: true, endAge: true, sex: true, chance: true, stopAge: false, stopMonth: false, startWhen: false };

  const age = parseAge(boxes.age, field('age'));
  if (age.error) errors.age = age.error; else values.age = age.value;

  const stopped = blank(boxes.stopped) ? null : String(boxes.stopped);
  if (!stopped) errors.stopped = 'required';
  else if (!field('stopped').options.includes(stopped)) errors.stopped = 'notAnOption';
  else values.stopped = stopped;
  applies.stopAge = stopped === 'age'; applies.stopMonth = stopped === 'month'; applies.startWhen = stopped === 'yes';

  if (applies.stopAge) {
    const a = parseAge(boxes.stopAge, field('stopAge'));
    if (a.error) errors.stopAge = a.error;
    else if (values.age != null && a.value < values.age) errors.stopAge = 'stop-before-age';
    else values.stopAge = a.value;
  }
  if (applies.stopMonth) {
    if (blank(boxes.stopMonth)) errors.stopMonth = 'required';
    else {
      const p = parseMonth(boxes.stopMonth);
      if (!p) errors.stopMonth = 'notAMonth';
      else if (monthKey(p) <= localMonth(now)) errors.stopMonth = 'month-passed';
      else values.stopMonth = monthKey(p);
    }
  }
  const offered = startChoices(saved);
  if (applies.startWhen) {
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
    next.firstTaxYear = retired ? (values.startWhen === 'now' ? saved.thisTY : values.startWhen === 'april' ? saved.thisTY + 1 : saved.values.savedYear) : null;
    timing = safeTiming(next, now);
    // what the planner's Save writes (index.html timingFieldsForSave): the derived start age, and the derived first tax year
    // in every mode but legacy (stopping later: the year the stop age is reached)
    next.shapeAgeNow = timing.shapeAgeNow;
    if (timing.mode !== 'legacy') next.firstTaxYear = timing.firstTaxYear;
  }
  const minEnd = timing ? timing.shapeAgeNow + MIN_YEARS - 1 : field('endAge').min;
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
    'stressTool.settings.firstTaxYear': next.firstTaxYear,
    'stressTool.settings.shapeAgeNow': next.shapeAgeNow,
    'stressTool.settings.duration': next.duration,
    'decisionTool.settings.firstTaxYear': t.firstTaxYear,
    ...budgetWant(plan, next, t)
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

/** A copy of the plan with a patch folded on: a dotted path set to its value, or removed when the value is undefined. */
export function applyPatch(plan, patch) {
  const out = JSON.parse(JSON.stringify(plan));
  for (const [path, v] of Object.entries(patch || {})) { if (v === undefined) deletePath(out, path); else setPath(out, path, copy(v)); }
  return out;
}

/** The derived figures (2), as line ids with their slots; from the timing as it would be saved, or as saved. */
export function derivedLines(timing, duration, { stopAgeFromMonth = null } = {}) {
  if (!timing || timing.mode === 'legacy') return [{ id: 'noAge', slots: {} }];
  const endAge = timing.shapeAgeNow + duration - 1;
  const lines = [];
  if (timing.mode === 'future') {
    if (stopAgeFromMonth != null) lines.push({ id: 'monthAs', slots: { age: timing.retireAge, month: monthWords(timing.startMonth) } });
    else lines.push({ id: 'stopIn', slots: { month: monthWords(timing.startMonth), age: timing.retireAge } });
  }
  lines.push({ id: 'firstYear', slots: { year: taxYearLabel(timing.firstTaxYear), y: timing.firstTaxYear } });
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
  if (!diffs.length) return null;
  const savedOn = typeof fa.savedOn === 'string' ? fa.savedOn : '';
  const changed = plan.lastModified && String(plan.lastModified) > savedOn ? dayWords(plan.lastModified) : null;
  return { workedOutOn: dayWords(savedOn), changedOn: changed, lasted: isObj(fa.answer) ? num(fa.answer.lasted) : null, diffs };
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
  const shown = { ...boxes, ...(typed || {}) };
  const fields = ABOUT_FIELDS.map((f) => ({
    path: f.path, type: f.type, options: f.type === 'choice' ? (f.path === 'startWhen' ? c.offered : f.options) : null,
    applies: c.applies[f.path] !== false,
    shown: blank(shown[f.path]) ? '' : String(shown[f.path]),
    saved: f.path in boxes ? boxes[f.path] : null,
    error: c.errors[f.path] || null
  }));
  const derived = c.ok ? derivedLines(c.timing, c.duration, { stopAgeFromMonth: c.stopAgeFromMonth }) : derivedLines(saved.timing, saved.duration);
  const sid = (plan.planDocument && plan.planDocument.strategy && plan.planDocument.strategy.id) || saved.ss.strategyId || 'pots-and-valves';
  const partners = list.filter((e) => e.plan.id !== plan.id && (e.plan.id === partnerIdOf(plan) || partnerIdOf(e.plan) === plan.id)).map((e) => ({ id: String(e.plan.id), name: nameOf(e.plan) }));
  let suggestion = null;
  if (c.values.age != null) {
    const endAge = longevityAge(c.values.age, c.values.sex || 'm', +(c.values.chance || '10'));
    suggestion = { endAge, applied: String(shown.endAge || '') === String(endAge), slots: { age: endAge, who: c.values.sex === 'f' ? 'women' : 'men', ageNow: c.values.age, chance: c.values.chance || '10' } };
  }
  const p = editable && c.ok ? aboutPatch(plan, typed || {}, { today }) : { ok: false, patch: {}, previous: {} };
  const slots = { years: saved.duration, endAge: saved.values.endAge };
  return {
    found: true, id: String(plan.id), name: nameOf(plan), locked: saved.locked, lockedOn: saved.lockedOn, readonly, editable,
    source: saved.source, ageSource: saved.ageSource, thisTY: saved.thisTY, yearNow: taxYearLabel(saved.thisTY), yearApril: taxYearLabel(saved.thisTY + 1),
    yearSaved: saved.values.savedYear ? taxYearLabel(saved.values.savedYear) : null,
    fields, errors: c.errors, ok: c.ok, derived, notUsed: notUsedBy(sid), partners, suggestion, endAgeMin: c.minEnd, minYears: MIN_YEARS,
    changed: Object.keys(p.patch).length > 0, patch: p.patch, previous: p.previous, savedSlots: slots,
    // the one sentence the toast says after a save: what the plan now runs to
    savedLine: c.ok ? { id: 'runsTo', slots: { endAge: c.values.endAge, years: c.duration } } : null
  };
}
