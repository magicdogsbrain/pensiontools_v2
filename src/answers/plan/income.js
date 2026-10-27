/**
 * "Money that comes in anyway" (research/v7/editing-in-v7.md 7): the second editing step of a saved plan in V7. Pure: a plan
 * already brought up to date in memory, today's date and what was typed in; the boxes and cards with their saved values and
 * sources, the problems, the derived figures, and the exact field paths and values a save writes out. Nothing here writes,
 * runs a future, or reads a clock.
 *
 *   savedIncome(plan, { today })             the saved facts: the State Pension (full, forecast, none — or assumed, the
 *                                            planner's fallback), the final-salary pensions, other income, income for some
 *                                            years and lump sums, every plan year turned into an age
 *   boxesOf(plan, { today })                 the same as text by path (what the draft starts from): "fs.ids", "fs.0.amount" …
 *   checkIncome(plan, typed, { today })      text as typed → { ok, values, lists, errors, applies, offered, saved }
 *   incomePatch(plan, typed, { today })      → { ok, errors, patch, previous }: the dotted paths that change (7.3)
 *   incomeOf(entries, id, { today, typed })  everything the screen draws
 *   ageOfYear / yearOfAge                    the planner's one rule: plan year = age − the plan's start age
 *   note2028(ss, timing, now)                the April 2028 note's rule, on the plan's own dated age (7.1)
 *
 * Every path written is in schema.js INCOME_WRITES (tested); a block is written only when its boxes changed, so a plan saved
 * as it is writes nothing.
 */
import { taxYearStartOf, taxYearLabel, ageOnDate } from '../../services/PlanTiming.js';
import { spSimConfigFromSettings, parseStatePensionDate, validateStatePensionDate } from '../../utils/StatePensionUtils.js';
import { defaultSpYear } from '../../services/IncomeSchedule.js';
import { routeWindfall, GIA_DEFAULTS } from '../../services/TaxableSleeve.js';
import { sippTodayOf } from '../../services/PotsAtRetirement.js';
import { bornFromAge, wholeStatePensionAge } from '../shared/household.js';
import { RULES, addYears } from '../shared/rules.js';
import { get, applyPatch, safeSettings, safeTiming } from './about.js';
import { INCOME_FIELDS, INCOME_LISTS, INCOME_LIST_IDS, INCOME_WRITES, RISES, WRAPPERS, isCardId } from './schema.js';
import { dateOf, dayWords, localDay } from './dates.js';

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
const r2 = (v) => Math.round(v * 100) / 100;
const unique = (list) => [...new Set(list)];

/** '£11,973' (to the pound) and '£230.25' (to the penny, always two figures). */
export const pounds = (n) => '£' + String(Math.abs(Math.round(Number(n) || 0))).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
export const poundsPence = (n) => { const v = Math.abs(Number(n) || 0); const whole = Math.floor(v + 1e-9); const p = Math.round((v - whole) * 100); return pounds(whole) + '.' + String(p).padStart(2, '0'); };

/** The label V7 gives a second or third final-salary pension in the planner's "income for some years" list (7.1). */
export const FS_LABEL = 'Final-salary pension';
const isFsLabel = (s) => /^\s*final[\s-]?salary(\s+pension)?\s*$/i.test(String(s == null ? '' : s));
const isFull = (weekly) => Math.abs(+weekly - RULES.fullStatePensionWeekly) < 0.005;

/** The planner's one rule for ages (dbStartSetting.dbStartYearOfAge; PlanDocument.shapeLayersFromSettings): plan year = age − start age. */
export const yearOfAge = (age, ageNow) => Math.round(+age) - Math.round(+ageNow);
export const ageOfYear = (year, ageNow) => Math.round(+ageNow) + Math.round(+year || 0);
/** The age a plan's saved final-salary start means (dbStartSetting.dbStartAgeOf): the age when saved, else the start age plus the year. */
const dbStartAgeOf = (ss, ageNow) => (+ss.dbStartAge > 0 ? Math.round(+ss.dbStartAge) : ageOfYear(+ss.dbStartYear || 0, ageNow));

/**
 * The State Pension date for a plan that has none (7.1): the day the person reaches their State Pension age as V7's answers
 * work it out (household.js), counted from the day their age was recorded — the day the planner already takes as their
 * birthday (PlanTiming.birthdayOf), so no age moves. 'YYYY-MM-DD', as PlanSeed writes it; null without a recorded age.
 */
export function derivedSpDate(ss, today) {
  const age = Math.floor(+ss.currentAge || 0);
  if (!(age > 0)) return null;
  const asOf = /^\d{4}-\d{2}-\d{2}/.test(String(ss.currentAgeAsOf || '')) ? String(ss.currentAgeAsOf).slice(0, 10) : today;
  const spAge = wholeStatePensionAge(bornFromAge(age, asOf));
  return addYears(asOf, spAge - age);
}

/**
 * The April 2028 note (7.1; apart.js before2028 on the plan's own dated age): a pension pot, a stop (or money already being
 * taken) before 6 April 2028, and 55 or 56 on that day.
 */
export function note2028(ss, timing, now) {
  if (!(num(ss.currentAge) > 0)) return false;
  const [y, m, d] = RULES.pensionAccess.changesOn.split('-').map(Number);
  const on = new Date(y, m - 1, d);
  if (now.getTime() >= on.getTime()) return false;
  let stop = now;
  if (timing.mode === 'future' && timing.startMonth) { const [sy, sm] = String(timing.startMonth).split('-').map(Number); if (sy > 0 && sm > 0) stop = new Date(sy, sm - 1, 1); }
  if (stop.getTime() >= on.getTime()) return false;
  let pension = false;
  try { pension = sippTodayOf(ss) > 0; } catch { pension = false; }
  pension = pension || num(ss.potAtRetirement && ss.potAtRetirement.sipp) > 0 || num(ss.strategyParams && ss.strategyParams.sippTotal) > 0;
  if (!pension) return false;
  const ageOn = ageOnDate(ss, on, now);
  return ageOn != null && ageOn >= RULES.pensionAccess.before && ageOn < RULES.pensionAccess.from;
}

/** The State Pension as the plan uses it (7.1): what every run reads from a date and a weekly amount, or the planner's fallback. */
function spView(ss, timing, ageNow, { dateText, weekly, now }) {
  const parsed = dateText ? parseStatePensionDate(String(dateText)) : null;
  if (weekly > 0 && parsed) {
    const cfg = spSimConfigFromSettings({ ...ss, spStartDate: dateText, spWeeklyAmount: weekly, firstTaxYear: timing.firstTaxYear, shapeAgeNow: ageNow }, now);
    const ty = taxYearStartOf(parsed);
    const fromAge = ageOfYear(cfg ? cfg.spStartYear : 0, ageNow);
    return { kind: isFull(weekly) ? 'full' : 'forecast', weekly, yearly: r2(weekly * 52), date: String(dateText), dateWords: dayWords(localDay(parsed)), fromAge, taxYear: ty, beforeStart: ty < timing.firstTaxYear, dated: true };
  }
  if (weekly > 0) {
    // a weekly amount with no date: the engine falls back to its yearly figure from the planner's default year (IncomeSchedule.defaultSpYear)
    const y = defaultSpYear({ ...ss, shapeAgeNow: ageNow });
    return { kind: isFull(weekly) ? 'full' : 'forecast', weekly, yearly: r2(weekly * 52), date: null, dateWords: null, fromAge: y === 999 ? null : ageOfYear(y, ageNow), taxYear: y === 999 ? null : timing.firstTaxYear + y, beforeStart: false, dated: false };
  }
  const legacy = num(ss.statePension) || 0;
  if (legacy > 0) {
    const y = defaultSpYear({ ...ss, shapeAgeNow: ageNow });
    return { kind: 'assumed', weekly: null, yearly: legacy, date: dateText ? String(dateText) : null, dateWords: null, fromAge: y === 999 ? null : ageOfYear(y, ageNow), taxYear: y === 999 ? null : timing.firstTaxYear + y, beforeStart: false, dated: false };
  }
  return { kind: 'none', weekly: null, yearly: 0, date: dateText ? String(dateText) : null, dateWords: null, fromAge: null, taxYear: null, beforeStart: false, dated: false };
}

/**
 * The saved facts (7.1), every plan year turned into an age; from the effective settings and the timing the planner derives
 * — or, locked, the State Pension from the plan document's assumptions.
 */
export function savedIncome(plan, { today }) {
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
  const source = locked ? { kind: 'locked', at: dayWords(lockedAtOf(plan)) } : { kind: 'saved', at: plan && plan.lastModified ? dayWords(plan.lastModified) : null };

  const dateText = doc && isObj(doc.assumptions) ? (doc.assumptions.spStartDate || null) : (ss.spStartDate || null);
  const weekly = doc && isObj(doc.assumptions) ? (num(doc.assumptions.spWeeklyAmount) || 0) : (num(ss.spWeeklyAmount) || 0);
  const sp = spView(ss, timing, ageNow, { dateText, weekly, now });

  const rows = Array.isArray(stored.extraIncomes) ? stored.extraIncomes : (Array.isArray(ss.extraIncomes) ? ss.extraIncomes : []);
  const wrows = Array.isArray(stored.windfalls) ? stored.windfalls : (Array.isArray(ss.windfalls) ? ss.windfalls : []);
  const fs = [], streams = [], lumps = [];
  if (num(ss.dbAmount) > 0) fs.push({ id: '0', amount: num(ss.dbAmount), fromAge: dbStartAgeOf(ss, ageNow), rises: RISES.includes(ss.dbIndexation) ? ss.dbIndexation : 'lpi5', from: 'db', row: null });
  rows.forEach((r, i) => {
    if (!isObj(r) || !(num(r.annual) > 0)) return;
    const card = { amount: num(r.annual), fromAge: ageOfYear(num(r.startYear) || 0, ageNow), rises: RISES.includes(r.indexation) ? r.indexation : 'lpi5', from: 'row', row: i };
    if (r.endYear == null && isFsLabel(r.label)) fs.push({ ...card, id: String(fs.length) });
    else streams.push({ ...card, id: String(streams.length), label: typeof r.label === 'string' ? r.label : '', toAge: r.endYear == null ? null : ageOfYear(num(r.endYear) || 0, ageNow) });
  });
  wrows.forEach((r, i) => {
    if (!isObj(r) || !(num(r.amount) > 0) || num(r.year) == null) return;
    lumps.push({ id: String(lumps.length), label: typeof r.label === 'string' ? r.label : '', amount: num(r.amount), atAge: ageOfYear(num(r.year), ageNow), wrapper: WRAPPERS.includes(r.wrapper) ? r.wrapper : 'cash', from: 'row', row: i });
  });
  return {
    locked, lockedOn: locked ? dayWords(lockedAtOf(plan)) : null, ss, stored, timing, duration, ageNow, endAge, source,
    sp, fs, other: num(ss.other) || 0, streams, lumps, rows, wrows,
    note2028: note2028(ss, timing, now)
  };
}

/** The boxes' starting text: the saved facts as a person would type them, by path (7.2). */
export function boxesOf(plan, { today }) {
  const s = savedIncome(plan, { today });
  const out = { spKind: s.sp.kind };
  if (s.sp.weekly != null) out.spWeekly = String(s.sp.weekly);
  if (s.sp.date) out.spDate = String(s.sp.date);
  if (s.other > 0) out.other = String(s.other);
  for (const L of INCOME_LIST_IDS) {
    out[L + '.ids'] = s[L].map((c) => c.id).join(',');
    for (const c of s[L]) for (const f of INCOME_LISTS[L].fields) { const v = c[f.path]; if (v == null || v === '') continue; out[`${L}.${c.id}.${f.path}`] = String(v); }
  }
  return out;
}

const field = (path) => INCOME_FIELDS.find((f) => f.path === path);
function parseAge(t, f) {
  if (blank(t)) return { error: f.required ? 'required' : null, value: null };
  const s = String(t).trim();
  if (!/^\d{1,3}$/.test(s)) return { error: 'notANumber', value: null };
  const n = +s;
  if (n < f.min) return { error: 'tooLow', value: n };
  if (n > f.max) return { error: 'tooHigh', value: n };
  return { error: null, value: n };
}
/** Money as people write it: "£", commas and spaces are let through; pence only in full figures; no short forms. */
function parseMoney(t, f) {
  if (blank(t)) return { error: f.required ? 'required' : null, value: null };
  const s = String(t).replace(/[£,\s]/g, '');
  if (!/^\d{1,9}(\.\d{1,2})?$/.test(s)) return { error: 'notANumber', value: null };
  const n = r2(+s);
  if (n < f.min) return { error: 'tooLow', value: n };
  if (n > f.max) return { error: 'tooHigh', value: n };
  return { error: null, value: n };
}
function parseField(raw, f) {
  if (f.type === 'age') return parseAge(raw, f);
  if (f.type === 'money') return parseMoney(raw, f);
  if (f.type === 'choice') { const v = blank(raw) ? f.default : String(raw); return f.options.includes(v) ? { error: null, value: v } : { error: 'notAnOption', value: null }; }
  const s = blank(raw) ? '' : String(raw).trim();
  if (f.max && s.length > f.max) return { error: 'tooLong', value: null };
  return { error: null, value: s };
}

/** The State Pension choices offered: the three, and "as assumed" only while that is the saved state (7.1). */
export function spChoices(saved) {
  return saved.sp.kind === 'assumed' ? ['full', 'forecast', 'none', 'assumed'] : ['full', 'forecast', 'none'];
}

/**
 * Text as typed → the checked values, the cards, the errors by path (a card's as "fs.0.fromAge"), which fields apply, and
 * the State Pension as it would be saved. `typed` holds text (or a choice) by path; a path not typed takes the saved value.
 */
export function checkIncome(plan, typed, { today }) {
  const now = dateOf(today);
  const saved = savedIncome(plan, { today });
  const boxes = { ...boxesOf(plan, { today }), ...(typed || {}) };
  const values = {};
  const errors = {};
  const applies = { spKind: true, spWeekly: false, other: true };
  const offered = spChoices(saved);

  const kind = blank(boxes.spKind) ? null : String(boxes.spKind);
  if (!kind) errors.spKind = 'required';
  else if (!offered.includes(kind)) errors.spKind = 'notAnOption';
  else values.spKind = kind;
  applies.spWeekly = kind === 'forecast';
  if (applies.spWeekly) { const m = parseMoney(boxes.spWeekly, field('spWeekly')); if (m.error) errors.spWeekly = m.error; else values.spWeekly = m.value; }
  else if (kind === 'full') values.spWeekly = RULES.fullStatePensionWeekly;
  // the start date from the forecast letter (inc.state-pension-date): the planner's own parser and checks; blank keeps the saved date,
  // or the one V7 works out from the State Pension age (derivedSpDate)
  applies.spDate = kind === 'full' || kind === 'forecast';
  if (applies.spDate && !blank(boxes.spDate)) {
    const v = validateStatePensionDate(String(boxes.spDate), { now });
    if (!v.valid) errors.spDate = /date of birth/i.test(v.error || '') ? 'looksLikeBirth' : 'notADate';
    else values.spDate = localDay(v.date);
  }
  { const m = parseMoney(boxes.other, field('other')); if (m.error) errors.other = m.error; else values.other = m.value == null ? 0 : m.value; }

  const lists = {};
  for (const L of INCOME_LIST_IDS) {
    const idsText = boxes[L + '.ids'];
    const ids = unique((blank(idsText) ? [] : String(idsText).split(',')).map((x) => x.trim()).filter((x) => isCardId(x)));
    const cards = ids.map((id) => {
      const savedCard = saved[L].find((c) => c.id === id) || null;
      const card = { id, saved: savedCard, values: {}, fields: [] };
      for (const f of INCOME_LISTS[L].fields) {
        const path = `${L}.${id}.${f.path}`;
        const raw = boxes[path];
        const r = parseField(raw, f);
        // a choice left blank shows its default (what the check takes it as), so a new card's radios start on it
        card.fields.push({ path, type: f.type, options: f.options || null, applies: true, shown: blank(raw) ? (f.type === 'choice' ? f.default : '') : String(raw), saved: savedCard && savedCard[f.path] != null && savedCard[f.path] !== '' ? String(savedCard[f.path]) : null, error: r.error });
        if (r.error) errors[path] = r.error; else card.values[f.path] = r.value;
      }
      const v = card.values;
      const mark = (f, e) => { errors[`${L}.${id}.${f}`] = e; const b = card.fields.find((x) => x.path === `${L}.${id}.${f}`); if (b) b.error = e; delete v[f]; };
      if (L === 'fs' && v.fromAge != null && v.fromAge > saved.endAge) mark('fromAge', 'afterEnd');
      if (L === 'streams' && v.fromAge != null && v.fromAge > saved.endAge) mark('fromAge', 'afterEnd');
      if (L === 'streams' && v.fromAge != null && v.toAge != null && v.toAge < v.fromAge) mark('toAge', 'beforeFrom');
      if (L === 'lumps' && v.atAge != null && v.atAge < saved.ageNow) mark('atAge', 'beforeStart');
      if (L === 'lumps' && v.atAge != null && v.atAge > saved.endAge) mark('atAge', 'afterEnd');
      card.ok = INCOME_LISTS[L].fields.every((f) => !errors[`${L}.${id}.${f.path}`]);
      return card;
    });
    lists[L] = { ids, cards };
  }

  // the State Pension as it would be saved (7.3): the saved date when there is one, else the one V7 works out
  let sp = saved.sp;
  if (kind === 'none') sp = spView(saved.ss, saved.timing, saved.ageNow, { dateText: saved.sp.date, weekly: 0, now }), sp = { ...sp, kind: 'none', yearly: 0 };
  else if ((kind === 'full' || kind === 'forecast') && values.spWeekly != null) sp = spView(saved.ss, saved.timing, saved.ageNow, { dateText: values.spDate || saved.sp.date || derivedSpDate(saved.ss, today), weekly: values.spWeekly, now });
  const ok = Object.keys(errors).length === 0;
  return { ok, values, lists, errors, applies, offered, saved, sp };
}

/** The saved State Pension date as a day ('YYYY-MM-DD'), whatever form the planner stored it in; null when none or unreadable. */
function savedSpDay(text) {
  if (!text) return null;
  const d = parseStatePensionDate(String(text));
  return d && !isNaN(d.getTime()) ? localDay(d) : null;
}

/**
 * Where a lump sum lands (inc.lump-sums; the planner's note under each, index.html incomeShapeLumps): an inherited pension
 * joins the pension, an inherited ISA the ISA; a cash lump sum goes as TaxableSleeve.routeWindfall sends it — the ISA
 * allowance (none while the ISA is on hold), the pension within its limit (this year's earnings), the rest a taxable account
 * held as the plan's taxable mix (or the row's own). The line's id names the parts it has; null without an amount.
 */
export function landingOf(ss, lump) {
  if (!lump || !(num(lump.amount) > 0)) return null;
  if (lump.wrapper === 'pension') return { id: 'lump.pension', slots: {} };
  if (lump.wrapper === 'isa') return { id: 'lump.isa', slots: {} };
  let r;
  try {
    r = routeWindfall({ amount: num(lump.amount), wrapper: 'cash', toIsa: lump.toIsa }, { isaAllowanceLeft: ss.isaDrawdownStrategy === 'hold' ? 0 : GIA_DEFAULTS.ISA_ALLOWANCE, relevantEarnings: num(ss.relevantEarnings) || 0 });
  } catch { return null; }
  const mix = typeof lump.mix === 'string' && lump.mix ? lump.mix : (typeof ss.taxableMix === 'string' && ss.taxableMix ? ss.taxableMix : 'equity');
  const parts = (r.toIsa > 0 ? 'i' : '') + (r.toSipp > 0 ? 'p' : '') + (r.toGia > 0 ? 't' : '');
  return { id: 'lump.cash.' + (parts || 't'), slots: { isa: pounds(r.toIsa), pension: pounds(r.toSipp), taxable: pounds(r.toGia), mix } };
}

const FIELDS_OF = { fs: ['amount', 'fromAge', 'rises'], streams: ['label', 'amount', 'fromAge', 'toAge', 'rises'], lumps: ['label', 'amount', 'atAge', 'wrapper'] };
const sameCard = (card, savedCard, L) => !!savedCard && FIELDS_OF[L].every((f) => text(card.values[f] == null ? null : card.values[f]) === text(savedCard[f] == null ? null : savedCard[f]));
/** A card as the planner's own row (7.3), merged onto the stored row when there is one (its other keys kept). */
function rowFor(L, card, storedRow, ageNow) {
  const v = card.values;
  if (L === 'lumps') return { ...(storedRow || {}), label: v.label || '', amount: v.amount, year: yearOfAge(v.atAge, ageNow), wrapper: v.wrapper };
  if (L === 'fs') return { ...(storedRow || {}), label: storedRow && typeof storedRow.label === 'string' && storedRow.label ? storedRow.label : FS_LABEL, annual: v.amount, startYear: yearOfAge(v.fromAge, ageNow), endYear: null, indexation: v.rises };
  return { ...(storedRow || {}), label: v.label || '', annual: v.amount, startYear: yearOfAge(v.fromAge, ageNow), endYear: v.toAge == null ? null : yearOfAge(v.toAge, ageNow), indexation: v.rises };
}
/**
 * The planner's list rebuilt from the cards, in the cards' order: a stored row kept byte for byte where its card is
 * unchanged, an edited card merged onto its row, a new card a new row. Each list's rows take the places of the rows the
 * step showed in that list (so rows it does not show — nothing in them — and the other list's rows stay where they were),
 * removed cards' rows go, and cards beyond those places are appended, list by list. Reading the result back gives each
 * list's cards in the order typed.
 * @param {object[]} storedRows
 * @param {{ slots: Set<number>, placed: { card, L, ageNow }[] }[]} groups   one per list sharing the array
 */
function rebuilt(storedRows, groups) {
  const seqs = groups.map((g) => ({ slots: g.slots, k: 0, seq: g.placed.map(({ card, L, ageNow }) => {
    const sc = card.saved;
    if (sc && sc.from === 'row') return sameCard(card, sc, L) ? storedRows[sc.row] : rowFor(L, card, storedRows[sc.row], ageNow);
    return rowFor(L, card, null, ageNow);
  }) }));
  const out = [];
  storedRows.forEach((r, i) => {
    const g = seqs.find((x) => x.slots.has(i));
    if (!g) out.push(r);
    else if (g.k < g.seq.length) out.push(g.seq[g.k++]);
  });
  for (const g of seqs) out.push(...g.seq.slice(g.k));
  return out;
}

/**
 * The write (7.3): every declared path whose value would change, with the new value and the one it had. `previous` holds
 * `undefined` for a key the plan did not have. Nothing for a locked plan or typed text with a problem.
 */
export function incomePatch(plan, typed, { today }) {
  const c = checkIncome(plan, typed, { today });
  if (!c.ok) return { ok: false, errors: c.errors, patch: {}, previous: {} };
  if (c.saved.locked) return { ok: false, errors: { plan: 'locked' }, patch: {}, previous: {} };
  const s = c.saved, ageNow = s.ageNow;
  const want = {};
  // the State Pension: only when its choice or its weekly amount changed
  const kind = c.values.spKind;
  const spChanged = kind !== 'assumed' && (kind !== s.sp.kind || (kind === 'forecast' && c.values.spWeekly !== s.sp.weekly));
  if (spChanged) {
    if (kind === 'none') { want.spWeeklyAmount = 0; want.statePension = 0; }
    else {
      want.spWeeklyAmount = c.values.spWeekly;
      want.statePension = r2(c.values.spWeekly * 52);
      if (!s.sp.date) { const d = derivedSpDate(s.ss, today); if (d) want.spStartDate = d; }
    }
  }
  // the date typed from the forecast letter: written when it is not the saved date (the saved text read by the same parser), as the day
  if (kind !== 'none' && kind !== 'assumed' && c.values.spDate && c.values.spDate !== savedSpDay(s.sp.date)) want.spStartDate = c.values.spDate;
  if (c.values.other !== (num(s.ss.other) || 0)) want.other = c.values.other;
  // the final-salary pensions: the first is the planner's own keys, the rest rows of its list
  const fsCards = c.lists.fs.cards;
  const first = fsCards[0] || null;
  if (!first) { if (num(s.ss.dbAmount) > 0) want.dbAmount = 0; }
  else if (!(first.saved && first.saved.from === 'db' && sameCard(first, first.saved, 'fs'))) {
    want.dbAmount = first.values.amount;
    want.dbStartYear = yearOfAge(first.values.fromAge, ageNow);
    want.dbStartAge = first.values.fromAge;
    want.dbIndexation = first.values.rises;
  }
  const rows = rebuilt(s.rows, [
    { slots: new Set(s.fs.filter((x) => x.from === 'row').map((x) => x.row)), placed: fsCards.slice(1).map((card) => ({ card, L: 'fs', ageNow })) },
    { slots: new Set(s.streams.map((x) => x.row)), placed: c.lists.streams.cards.map((card) => ({ card, L: 'streams', ageNow })) }
  ]);
  if (text(rows) !== text(s.rows)) want.extraIncomes = rows;
  const wrows = rebuilt(s.wrows, [{ slots: new Set(s.lumps.map((x) => x.row)), placed: c.lists.lumps.cards.map((card) => ({ card, L: 'lumps', ageNow })) }]);
  if (text(wrows) !== text(s.wrows)) want.windfalls = wrows;

  const patch = {}, previous = {};
  for (const path of INCOME_WRITES) {
    const key = path.split('.').pop();
    if (!(key in want)) continue;
    const cur = get(plan, path);
    // the Decision tool's own copy of the date (its own box in the planner): kept in step only where it already exists — an absent setting means the old behaviour
    if (path === 'decisionTool.settings.spStartDate' && cur === undefined) continue;
    const val = want[key];
    if (text(cur) === text(val)) continue;
    if (cur === undefined && (val === null || val === 0)) continue;   // absent, null and 0 read alike here (every engine reads `x || 0`): no key is added for nothing
    patch[path] = copy(val);
    previous[path] = copy(cur);
  }
  return { ok: true, errors: {}, patch, previous };
}

const yearOf = (timing, ageNow, age) => taxYearLabel(timing.firstTaxYear + (age - ageNow));
const yearsWords = (n) => (n === 1 ? '1 year' : String(n) + ' years');

/** The derived figures (7.1), as line ids with their slots: from the facts as they would be saved, or as saved. */
export function derivedLines(f) {
  const { sp, fs, other, streams, lumps, ageNow, timing } = f;
  const lines = [];
  if (sp.kind === 'none') lines.push({ id: 'sp.none', slots: {} });
  else if (sp.kind === 'assumed') lines.push({ id: sp.fromAge != null ? 'sp.assumed' : 'sp.assumedNoAge', slots: { yearly: pounds(sp.yearly), age: sp.fromAge } });
  else if (sp.beforeStart) lines.push({ id: 'sp.before', slots: { yearly: pounds(sp.yearly), date: sp.dateWords } });
  else if (sp.fromAge != null) lines.push({ id: sp.dated ? 'sp.paid' : 'sp.noDate', slots: { yearly: pounds(sp.yearly), age: sp.fromAge, year: taxYearLabel(sp.taxYear) } });
  else lines.push({ id: 'sp.noDateNoAge', slots: { yearly: pounds(sp.yearly) } });
  fs.forEach((p, i) => {
    if (p.fromAge < ageNow) lines.push({ id: 'fs.before', slots: { n: i + 1, amount: pounds(p.amount), age: p.fromAge, ageNow, rises: p.rises } });
    else lines.push({ id: 'fs.line', slots: { n: i + 1, amount: pounds(p.amount), age: p.fromAge, year: yearOf(timing, ageNow, p.fromAge), rises: p.rises } });
  });
  if (other > 0) lines.push({ id: 'other.line', slots: { amount: pounds(other) } });
  for (const st of streams) {
    const label = st.label || 'Income for some years';
    if (st.toAge == null) lines.push({ id: 'stream.life', slots: { label, amount: pounds(st.amount), from: st.fromAge, rises: st.rises } });
    else lines.push({ id: 'stream.line', slots: { label, amount: pounds(st.amount), from: st.fromAge, to: st.toAge, years: yearsWords(st.toAge - st.fromAge + 1), rises: st.rises } });
  }
  for (const lp of lumps) lines.push({ id: 'lump.line', slots: { label: lp.label || 'Lump sum', amount: pounds(lp.amount), age: lp.atAge, year: yearOf(timing, ageNow, lp.atAge), what: lp.wrapper } });
  if (f.note2028) lines.push({ id: 'drawdown2028', slots: { from: RULES.pensionAccess.from, day: '5 April ' + RULES.pensionAccess.changesOn.slice(0, 4) } });
  return lines;
}

/** The settings of this step a strategy ignores (7.1): none today — every strategy reads all of them (stressTest.lumpyByYear). */
export function notUsedBy(strategyId) {
  void strategyId;
  return [];
}

/** The facts as checked (cards' values) in the shape derivedLines takes; the saved facts where a card has a problem. */
function factsOf(c) {
  const s = c.saved;
  const cards = (L) => c.lists[L].cards.filter((x) => x.ok).map((x) => ({ ...x.values }));
  return { sp: c.sp, fs: cards('fs'), other: c.values.other == null ? s.other : c.values.other, streams: cards('streams'), lumps: cards('lumps'), ageNow: s.ageNow, timing: s.timing, note2028: s.note2028 };
}

/**
 * Everything the screen draws (7.1, 7.4). `typed` is the draft's values for this plan (text by path), or null.
 */
export function incomeOf(entries, id, { today, typed = null } = {}) {
  const list = (entries || []).filter((e) => e && e.plan && typeof e.plan === 'object' && e.plan.id != null);
  const entry = list.find((e) => String(e.plan.id) === String(id)) || null;
  if (!entry) return { found: false, id: String(id || '') };
  const plan = entry.plan;
  const readonly = !!(entry.newer || entry.failed);
  const saved = savedIncome(plan, { today });
  const editable = !saved.locked && !readonly;
  const boxes = boxesOf(plan, { today });
  const c = checkIncome(plan, typed || {}, { today });
  const shown = { ...boxes, ...(typed || {}) };
  const fields = INCOME_FIELDS.map((f) => ({
    path: f.path, type: f.type, options: f.type === 'choice' ? (f.path === 'spKind' ? c.offered : f.options) : null,
    applies: c.applies[f.path] !== false,
    shown: blank(shown[f.path]) ? '' : String(shown[f.path]),
    saved: f.path in boxes ? boxes[f.path] : null,
    error: c.errors[f.path] || null
  }));
  const lists = {};
  for (const L of INCOME_LIST_IDS) {
    lists[L] = { ids: c.lists[L].ids, cards: c.lists[L].cards.map((card) => {
      const out = { id: card.id, saved: !!card.saved, fields: card.fields };
      // under a lump sum: where it lands (inc.lump-sums), from the card as typed (its stored row's own mix and ISA choice kept)
      if (L === 'lumps') { const row = card.saved && card.saved.from === 'row' ? saved.wrows[card.saved.row] : null; out.landing = landingOf(saved.ss, { ...(row || {}), ...(card.ok ? card.values : (card.saved || {})) }); }
      return out;
    }) };
  }
  const facts = factsOf(c);
  const derived = derivedLines(facts);
  const sid = (plan.planDocument && plan.planDocument.strategy && plan.planDocument.strategy.id) || saved.ss.strategyId || 'pots-and-valves';
  const partners = list.filter((e) => e.plan.id !== plan.id && (e.plan.id === partnerIdOf(plan) || partnerIdOf(e.plan) === plan.id)).map((e) => ({ id: String(e.plan.id), name: nameOf(e.plan) }));
  const p = editable && c.ok ? incomePatch(plan, typed || {}, { today }) : { ok: false, patch: {}, previous: {} };
  const spSlot = facts.sp.kind === 'none' ? { sp: 'none' } : facts.sp.kind === 'assumed' ? { sp: 'assumed', yearly: pounds(facts.sp.yearly), age: facts.sp.fromAge } : facts.sp.fromAge != null ? { sp: 'paid', yearly: pounds(facts.sp.yearly), age: facts.sp.fromAge } : { sp: 'paidNoAge', yearly: pounds(facts.sp.yearly) };
  return {
    found: true, id: String(plan.id), name: nameOf(plan), locked: saved.locked, lockedOn: saved.lockedOn, readonly, editable,
    source: saved.source, ageNow: saved.ageNow, endAge: saved.endAge,
    fullYearly: pounds(RULES.fullStatePensionWeekly * 52),
    spSaved: { kind: saved.sp.kind, weekly: saved.sp.weekly == null ? null : poundsPence(saved.sp.weekly), yearly: pounds(saved.sp.yearly), age: saved.sp.fromAge, dateWords: saved.sp.dateWords },
    assumed: saved.sp.kind === 'assumed' ? { yearly: pounds(saved.sp.yearly), age: saved.sp.fromAge } : null,
    fields, lists, errors: c.errors, ok: c.ok, derived, notUsed: notUsedBy(sid), partners,
    changed: Object.keys(p.patch).length > 0, patch: p.patch, previous: p.previous,
    // the one sentence the toast says after a save
    savedLine: c.ok ? { id: 'income', slots: { ...spSlot, fs: facts.fs.length, streams: facts.streams.length, lumps: facts.lumps.length } } : null
  };
}
