/**
 * A saver's check-in (research/saving-enough-and-check-in.md 5; release step R3): a regular moment to tell the plan where
 * you are — your pot, your pay and what goes in — and see whether you are still on course, how your pot stands against the
 * plan's saving path, what has changed since last time, and what would be enough from here, kept as a history.
 *
 * ONE TEST. The check-in's verdict is question B's own answer on the plan's figures with the check-in's own pot and pay-in
 * (saverInputs.js saverInputsOf with `checkIn`): the same count, the same incomes from the stop and the same "what would be
 * enough" as "Am I saving enough?" and "What you pay in". Its reading against the path is SaverReading.saverReading, the
 * function "Where you are" and the arrival check read a pot with. Nothing here is a second model.
 *
 * The data (5.1), under accumulationTool — the saver's home, outside the settings the lock holds, carried and wiped with
 * the plan and the account like everything else in it. Every key is optional; absent means the old behaviour:
 *   checkInEvery   'year' | 'quarter' | 'month' — chosen at the first check-in, changeable at any
 *   checkIns       [ { date, pot: { pension, isa, other }, pay, payIn: { kind, ownPct?, employerPct?, own?, employer?, total,
 *                    savingsIn, since? }, paused: { from, to } | null, note?, reading, recordedAt } ], newest last, at most
 *                    CHECKINS_KEPT. `total` is what lands in the pension a month; `paused.to` the month paying in started
 *                    again (null: not yet). `reading` is frozen and small (5.1): the path it was read against, the band
 *                    against it and the middle figure; B's band, the lives that failed out of 1,000, the aim tested, the two
 *                    incomes and the gap; what would be enough — every figure a month after tax at today's prices as the
 *                    test reads it (the gap a year), so the history reads as it was whatever is redrawn later
 *   path           an unlocked plan's saving path (5.3): SavingPath.buildSavingPath from the first check-in's own figures
 *   pathArchive    the paths it replaced, newest last, at most PATH_ARCHIVE_KEPT and PATH_ARCHIVE_BYTES in all
 * A check-in also writes its pot as that month's pot record (accumulationTool.history, the same month replaced): one ledger
 * for pot values, so the planner's monthly list and the arrival check read it with no change (the classic page's
 * equivalent, 5.9).
 *
 *   checkInsOf, cadenceOf, checkInDueOf, checkInState   when one is due and what the last said (checkInDue.js, the light
 *                                          part the rail and the plans list read; exported here too). `legacy`: a plan locked
 *                                          while saving that never chose, read as monthly from its pot records (5.2)
 *   checkCheckIn(plan, typed, { today })   text as typed → { ok, values, errors, applies, boxes, ... }
 *   checkInDraft(plan, typed, { today, plans })   → { ok, problem?, record, read }: the record before its reading, and the B
 *                                          inputs (`plans`, the plans at hand: money taken flexibly on a plan before this one)
 *   checkInPatch(plan, typed, { today, now, result, plans })  → { ok, patch, previous, line, record }: ONE write (CHECKIN_WRITES)
 *   restartPathPatch(plan, { today, now }) "Start the path again from today": an unlocked plan's path drawn again
 *   useInPlanPatch(plan, { today })        "Use these in my plan" (5.6): What you pay in's settings from the last check-in
 *   whatChanged(prev, cur, { isaCounted }) the pot's change between two check-ins, in parts that add up to the pound (5.5)
 *   calendarText({ month, today })         the calendar file: the date and "PensionTools check-in", nothing else
 *   checkInOf(entries, id, { today, typed, source })   everything the screen draws
 *
 * The limit on what goes in once money has been taken from a pension flexibly (research/plan-start.md §2 J): a plan carrying
 * the person's `flexibleAccess` says the rule beside the verdict (`allowance`, saving.js allowanceOf), read against what the
 * last check-in said lands a month (the plan's own figures before the first), as What you pay in says it.
 * A saving plan made on going back to work with the change-over still to come begins in a later month: until then the
 * months are the drawing plan's, so the check-in says when it begins and takes none (`notYet`; PlanClosed.notBegunOf, and
 * the store's successorRefusal behind it).
 *
 * Pure: no clock (the day and the moment arrive as `today` and `now`), no storage, no runs.
 */
import { effectiveStressSettings, planStage } from '../../services/PlanReading.js';
import { deriveTiming } from '../../services/PlanTiming.js';
import { saverReading, potRecordOf, pathCountsIsa, pathStart, savingPathVersion } from '../../services/SaverReading.js';
import { buildSavingPath } from '../../services/SavingPath.js';
import { checkInAllowed } from '../../services/LifeStage.js';
import { notBegunOf } from '../../services/PlanClosed.js';
import { contributionBreakdown } from '../../services/AccumulationEngine.js';
import { shareSettings } from '../../services/SaverPayIn.js';
import { payInParts } from '../shared/payIn.js';
import { lastedText } from '../shared/format.js';
import { saverInputsOf, planPayInOf } from './saverInputs.js';
import { savedSaving, allowanceOf } from './saving.js';
import { CADENCE_MONTHS, addMonths, checkInsOf, cadenceOf, checkInDueOf, checkInState } from './checkInDue.js';
import { CHECKIN_FIELDS, CHECKIN_WRITES, SAVING_WRITES, PAY_IN_KINDS } from './schema.js';
import { get, parseMonth as readMonth } from './about.js';
import { pounds } from './income.js';
import { dateOf, ym, monthWords, monthsBetween, localMonth } from './dates.js';

/** At most this many check-ins (5.11): 120 years yearly, 30 quarterly, 10 monthly. */
export const CHECKINS_KEPT = 120;
/** From this many, the screen says the oldest will be dropped to make room (5.11). */
export const CHECKINS_WARN_FROM = 110;
/** The note's length (5.4, 5.10): a few words, never a diary. */
export const NOTE_MAX = 280;
/** The paths kept after being replaced (5.11). */
export const PATH_ARCHIVE_KEPT = 5;
export const PATH_ARCHIVE_BYTES = 40 * 1024;
/** The run a check-in's verdict is read from: B's own, at the published lives (5.1: named once by the engine's version). */
export const CHECKIN_FUTURES = 1000;
export const CHECKIN_SEED = 0;
/** The pot records kept (saving.js RECORDS_KEPT: ScenarioRepository.saveActiveAccumulationHistory's own). */
const RECORDS_KEPT = 600;

const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
const num = (v) => (v == null || v === '' || !Number.isFinite(+v) ? null : +v);
const round2 = (n) => Math.round(n * 100) / 100;
const copy = (v) => (v === undefined ? undefined : JSON.parse(JSON.stringify(v)));
const blank = (v) => v === undefined || v === null || (typeof v === 'string' && v.trim() === '');
const isLocked = (plan) => !!(plan && plan.decisionTool && plan.decisionTool.settings && plan.decisionTool.settings.locked);
const nameOf = (plan) => (plan && plan.planDetails && typeof plan.planDetails.name === 'string' && plan.planDetails.name) || (plan && typeof plan.name === 'string' && plan.name) || '';
const accOf = (plan) => (plan && isObj(plan.accumulationTool) ? plan.accumulationTool : {});
export { CADENCE_MONTHS, addMonths, checkInsOf, cadenceOf, checkInDueOf, checkInState };
const keyOf = (p) => p.y + '-' + String(p.m).padStart(2, '0');
const monthOfDate = (d) => String(d || '').slice(0, 7);
/** UTF-8 bytes of a value as JSON (the archive's budget is in bytes, as Firestore counts them). */
const bytesOf = (v) => new TextEncoder().encode(JSON.stringify(v)).length;

function safeStage(plan, now) {
  try { return planStage(plan, { now }); } catch { return { key: 'unknown' }; }
}
function safeSettings(plan, now) {
  try { return effectiveStressSettings(plan, { now }); } catch { return (plan && plan.stressTool && plan.stressTool.settings) || {}; }
}

// ---- reading what is stored ----------------------------------------------------------------------------------------------

/**
 * The saving path a check-in is read against (5.3), as SaverReading takes it (a document with `accumulation`): a locked
 * plan's is its plan document's; an unlocked plan's is its own `accumulationTool.path`. Null when there is none yet.
 */
export function pathDocOf(plan) {
  if (isLocked(plan)) {
    const doc = plan && plan.planDocument;
    return isObj(doc) && isObj(doc.accumulation) ? { doc, source: 'document' } : null;
  }
  const p = accOf(plan).path;
  return isObj(p) ? { doc: { accumulation: p, createdAt: p.drawnAt || null }, source: 'saving' } : null;
}

// ---- the boxes ------------------------------------------------------------------------------------------------------------

/** What goes in as a check-in holds it, from B's pay-in: the kind and its parts, what lands. */
function payInRecordOf(p) {
  const parts = payInParts(p);
  if (p.kind === 'share') return { kind: 'share', ownPct: p.ownPct, employerPct: p.employerPct, total: parts.total };
  if (p.kind === 'split') return { kind: 'split', own: parts.own, employer: parts.employer, total: parts.total };
  return { kind: 'total', total: parts.total };
}

/** The boxes' starting text: what goes in and the pay from the last check-in, else from the plan; the pots never (5.4). */
export function checkInBoxesOf(plan, { today }) {
  const now = dateOf(today);
  const stage = safeStage(plan, now);
  const acc = accOf(plan);
  const s = isObj(acc.settings) ? acc.settings : {};
  const list = checkInsOf(plan);
  const last = list.length ? list[list.length - 1] : null;
  const out = {};
  const str = (v) => (isNum(v) ? String(v) : '');
  if (last && isObj(last.payIn) && PAY_IN_KINDS.includes(last.payIn.kind)) {
    const p = last.payIn;
    out['ci.kind'] = p.kind;
    if (p.kind === 'share') { out['ci.ownPct'] = str(p.ownPct); out['ci.employerPct'] = str(p.employerPct); }
    else if (p.kind === 'split') { out['ci.own'] = str(p.own); out['ci.employer'] = str(p.employer); }
    else out['ci.total'] = str(p.total);
    if (isNum(last.pay)) out['ci.pay'] = String(last.pay);
    if (isNum(p.savingsIn)) out['ci.savingsIn'] = String(p.savingsIn);
    // a pause still running at the last check-in is still running until the person says it ended
    if (isObj(last.paused) && typeof last.paused.from === 'string' && last.paused.to == null) { out['ci.paused'] = 'yes'; out['ci.pausedFrom'] = last.paused.from; }
  } else {
    const { payIn, share } = planPayInOf(plan);
    out['ci.kind'] = payIn.kind;
    if (payIn.kind === 'share') { out['ci.ownPct'] = str(payIn.ownPct); out['ci.employerPct'] = str(payIn.employerPct); }
    else if (payIn.kind === 'split') { out['ci.own'] = str(payIn.own); out['ci.employer'] = str(payIn.employer); }
    else out['ci.total'] = str(payIn.total);
    const pay = share ? share.pay : num(s.salary);
    if (pay > 0) out['ci.pay'] = String(pay);
    if (num(s.isaMonthly) > 0) out['ci.savingsIn'] = String(+s.isaMonthly);
  }
  if (!out['ci.paused']) out['ci.paused'] = 'no';
  const c = cadenceOf(plan, stage.key);
  // how often: as chosen; a plan locked while saving that never chose keeps "Each month"; anyone else, once a year (most people)
  out['ci.every'] = c.chosen ? c.every : c.legacy ? 'month' : 'year';
  return out;
}

function parseMoney(t, f) {
  if (blank(t)) return { error: f.required ? 'required' : null, value: null };
  const s = String(t).replace(/[£,\s]/g, '');
  if (!/^\d{1,9}(\.\d{1,2})?$/.test(s)) return { error: 'notANumber', value: null };
  const n = Math.round(+s * 100) / 100;
  if (n < f.min) return { error: 'tooLow', value: n };
  if (n > f.max) return { error: 'tooHigh', value: n };
  return { error: null, value: n };
}
function parsePercent(t, f) {
  if (blank(t)) return { error: f.required ? 'required' : null, value: null };
  const s = String(t).replace(/[%\s]/g, '');
  if (!/^\d{1,3}(\.\d{1,2})?$/.test(s)) return { error: 'notANumber', value: null };
  const n = +s;
  if (n < f.min || n > f.max) return { error: 'range', value: n };
  return { error: null, value: n };
}
/** A month as typed — '2027-03', 'March 2027', 'Mar 2027', '03/2027' — read as "About you and when" reads one (about.js). */
function parseMonth(t, f) {
  if (blank(t)) return { error: f.required ? 'required' : null, value: null };
  const p = readMonth(t);
  return p ? { error: null, value: keyOf(p) } : { error: 'notAMonth', value: null };
}
function parseField(raw, f) {
  if (f.type === 'money') return parseMoney(raw, f);
  if (f.type === 'percent') return parsePercent(raw, f);
  if (f.type === 'month') return parseMonth(raw, f);
  if (f.type === 'text') {
    const t = blank(raw) ? '' : String(raw).trim();
    return t.length > f.max ? { error: 'tooLong', value: t } : { error: null, value: t || null };
  }
  const v = blank(raw) ? f.default : String(raw);
  return f.options.includes(v) ? { error: null, value: v } : { error: 'notAnOption', value: null };
}
const appliesOf = (f, shown) => !f.when || Object.entries(f.when).every(([k, v]) => (Array.isArray(v) ? v.includes(shown[k]) : shown[k] === v));

/** Whether the path a check-in is read against counts ISAs and savings — or, before there is one, whether it will. */
function pathCounts(plan) {
  const p = pathDocOf(plan);
  return p ? pathCountsIsa(p.doc) : null;
}

/**
 * Text as typed → the checked values and the problems by path. The ISA box is needed when the path counts ISAs and
 * savings (the reading cannot be made without it); a share needs the pay it is of; the month a pay-in changed is after the
 * last check-in and not after this month; a pause starts before it ends; the note is at most NOTE_MAX characters.
 */
export function checkCheckIn(plan, typed, { today }) {
  const now = dateOf(today);
  const mon = localMonth(now);
  const boxes = { ...checkInBoxesOf(plan, { today }), ...(typed || {}) };
  const shown = {};
  for (const f of CHECKIN_FIELDS) shown[f.path] = blank(boxes[f.path]) ? (f.type === 'choice' ? f.default : '') : String(boxes[f.path]);
  const values = {}, errors = {}, applies = {};
  for (const f of CHECKIN_FIELDS) {
    applies[f.path] = appliesOf(f, shown);
    if (!applies[f.path]) continue;
    const r = parseField(boxes[f.path], f);
    if (r.error) errors[f.path] = r.error; else values[f.path] = r.value;
  }
  const counts = pathCounts(plan);
  if (counts === true && values['ci.isa'] == null && !errors['ci.isa']) errors['ci.isa'] = 'required';
  if (values['ci.kind'] === 'share' && values['ci.pay'] == null && !errors['ci.pay']) errors['ci.pay'] = 'required';
  // what lands a month, never past B's £10,000 a month a person
  if (values['ci.kind'] === 'split' && isNum(values['ci.own']) && isNum(values['ci.employer']) && values['ci.own'] + values['ci.employer'] > 10000) errors['ci.employer'] = 'overLimit';
  if (values['ci.kind'] === 'share' && isNum(values['ci.pay']) && isNum(values['ci.ownPct']) && isNum(values['ci.employerPct']) && payInParts({ kind: 'share', pay: values['ci.pay'], ownPct: values['ci.ownPct'], employerPct: values['ci.employerPct'] }).total > 10000) errors['ci.employerPct'] = 'overLimit';
  // the last check-in before this month's (a second check-in in the same month corrects the first, so it is not "the last")
  const prior = checkInsOf(plan).filter((c) => monthOfDate(c.date) !== mon);
  const lastMonth = prior.length ? monthOfDate(prior[prior.length - 1].date) : null;
  if (values['ci.since']) {
    if (values['ci.since'] > mon) errors['ci.since'] = 'inFuture';
    else if (lastMonth && values['ci.since'] <= lastMonth) errors['ci.since'] = 'beforeLast';
  }
  if (values['ci.pausedFrom'] && values['ci.pausedFrom'] > mon) errors['ci.pausedFrom'] = 'inFuture';
  if (values['ci.pausedTo']) {
    if (values['ci.pausedTo'] > mon) errors['ci.pausedTo'] = 'inFuture';
    else if (values['ci.pausedFrom'] && values['ci.pausedTo'] <= values['ci.pausedFrom']) errors['ci.pausedTo'] = 'beforeFrom';
  }
  return { ok: Object.keys(errors).length === 0, values, errors, applies, shown, boxes, isaNeeded: counts === true, mon, lastMonth };
}

// ---- the record --------------------------------------------------------------------------------------------------------

/** A pause still running at a check-in (nothing going in then): its `from`, or null. */
const pauseRunning = (r) => (isObj(r) && isObj(r.paused) && typeof r.paused.from === 'string' && r.paused.to == null ? r.paused : null);

/** The check-in as written, before its reading: the day, the pots, the pay, what goes in, a pause, the note. */
function recordOf(c, { today, now, last }) {
  const v = c.values;
  const kind = v['ci.kind'];
  const p = kind === 'share' ? { kind, pay: v['ci.pay'] || 0, ownPct: v['ci.ownPct'], employerPct: v['ci.employerPct'] }
    : kind === 'split' ? { kind, own: v['ci.own'], employer: v['ci.employer'] } : { kind: 'total', total: v['ci.total'] };
  const payIn = { ...payInRecordOf(p), savingsIn: isNum(v['ci.savingsIn']) ? v['ci.savingsIn'] : 0 };
  // the month what goes in began, kept only when it changed since the last check-in (5.1) — starting again after a pause
  // that was still running then is a change too, whatever the rate (from nothing going in to this)
  const lastPayIn = last && isObj(last.payIn) ? last.payIn : null;
  const pausedNow = v['ci.paused'] === 'yes' && v['ci.pausedFrom'] && !v['ci.pausedTo'];
  const changed = lastPayIn && (round2(lastPayIn.total) !== round2(payIn.total) || round2(lastPayIn.savingsIn || 0) !== round2(payIn.savingsIn) || (!!pauseRunning(last) && !pausedNow));
  if (changed && v['ci.since']) payIn.since = v['ci.since'];
  return {
    date: today,
    pot: { pension: v['ci.pension'], isa: isNum(v['ci.isa']) ? v['ci.isa'] : null, other: isNum(v['ci.other']) ? v['ci.other'] : null },
    pay: isNum(v['ci.pay']) ? v['ci.pay'] : null,
    payIn,
    paused: v['ci.paused'] === 'yes' && v['ci.pausedFrom'] ? { from: v['ci.pausedFrom'], to: v['ci.pausedTo'] || null } : null,
    ...(v['ci.note'] ? { note: v['ci.note'] } : {}),
    recordedAt: now.toISOString()
  };
}

/** What lands in the pension a month now: nothing while a pause runs. */
const landsNow = (r) => (isObj(r.paused) && r.paused.to == null ? 0 : (isNum(r.payIn && r.payIn.total) ? r.payIn.total : 0));
const savingsNow = (r) => (isObj(r.paused) && r.paused.to == null ? 0 : (isNum(r.payIn && r.payIn.savingsIn) ? r.payIn.savingsIn : 0));

/**
 * The check-in before its run: the boxes checked, the record, and question B's inputs on the plan's figures with the
 * check-in's (5.5: "the verdict from here"). Refused on a plan that is not still saving (5.8) or shown as saved, and on a
 * plan that has not begun yet ('notYet': a change-over still to come; its months are the previous plan's).
 */
export function checkInDraft(plan, typed, { today, now = null, plans = [] }) {
  const at = now instanceof Date ? now : dateOf(today);
  const stage = safeStage(plan, dateOf(today));
  if (!checkInAllowed(stage).ok) return { ok: false, problem: 'notSaving' };
  if (notBegunOf(plan, monthOfDate(today))) return { ok: false, problem: 'notYet' };
  const c = checkCheckIn(plan, typed, { today });
  if (!c.ok) return { ok: false, problem: 'problems', errors: c.errors };
  // what goes in is compared with the last check-in before this month's (one this month is being corrected)
  const prior = checkInsOf(plan).filter((x) => monthOfDate(x.date) !== monthOfDate(today));
  const last = prior.length ? prior[prior.length - 1] : null;
  const record = recordOf(c, { today, now: at, last });
  const read = saverInputsOf(plan, { today, checkIn: record, plans });
  return { ok: true, record, read, values: c.values, stage };
}

/**
 * The path drawn from a check-in's own figures (5.3: buildSavingPath's explicit inputs); null when there are no saving
 * years. A blank ISA box leaves ISAs and savings out of the path altogether (5.12: the box is optional before there is a
 * path, and decides whether it counts them): neither what is in them nor what goes into them. Counting what goes in from
 * £0 would make every later check-in ask for the ISA figure and read pension and ISA against a path whose ISA started at
 * nothing.
 */
function pathFrom(plan, record, now) {
  const settings = safeSettings(plan, now);
  let timing;
  try { timing = deriveTiming(settings, now); } catch { return null; }
  const acc = accOf(plan);
  const isaGiven = isNum(record.pot.isa);
  return buildSavingPath({
    settings, timing, accumulation: isObj(acc.settings) ? acc.settings : {}, holdings: plan.holdings || null, now,
    explicit: { potNow: record.pot.pension, isaNow: isaGiven ? record.pot.isa : 0, totalMonthly: landsNow(record), isaMonthly: isaGiven ? savingsNow(record) : 0 }
  });
}

/** The answer's figures, frozen small (5.1). B's band, the lives that failed, the aim, the incomes, the gap, what would be enough. */
function verdictPart(result) {
  const ok = !!result && result.status !== 'invalid' && isObj(result.verdict) && ['yes', 'close', 'no'].includes(result.verdict.band);
  if (!ok) return { band: null, fails: null, aim: null, bad: null, middling: null, gap: null, enough: null };
  const en = result.enough;
  const fig = (x) => (isObj(x) && isNum(x.payIn) ? x : null);
  const nine = en ? fig(en.nineInTen) : null, four = en ? fig(en.threeInFour) : null;
  return {
    band: result.verdict.band,
    fails: isObj(result.chance) && isNum(result.chance.fails) ? result.chance.fails : null,
    aim: isObj(result.spend) && isNum(result.spend.perMonth) ? result.spend.perMonth : null,
    bad: isObj(result.income) && isNum(result.income.bad) ? result.income.bad : null,
    middling: isObj(result.income) && isNum(result.income.middling) ? result.income.middling : null,
    gap: isObj(result.gap) && isNum(result.gap.year) ? result.gap.year : null,
    enough: en ? {
      nine: nine ? nine.payIn : null, ...(nine && isNum(nine.ownPct) ? { nineOwnPct: nine.ownPct, nineTotalPct: nine.totalPct } : {}),
      four: four ? four.payIn : null, ...(four && isNum(four.ownPct) ? { fourOwnPct: four.ownPct, fourTotalPct: four.totalPct } : {}),
      ...(en.threeInFourNow ? { fourNow: true } : {}), ...(en.outOfReach ? { outOfReach: true } : {})
    } : null
  };
}

/**
 * What puts a reading's lines into the pot's own pounds: a version-2 path (every plan locked before 6.22.0) is in the
 * prices of the day it was drawn, and saverReading turns the pot back into those prices to place it (`compared`, at the
 * 2.5% a year the path was deflated with); a version-3 path is in pounds of the day already (factor 1). The words set
 * the pot as typed beside the lines, so the lines are raised by the same factor: the sentence then agrees with the band.
 */
const toPotPounds = (pr) => (pr && pr.prices && isNum(pr.prices.factor) && pr.prices.factor > 0 ? pr.prices.factor : 1);

/** The reading frozen into the check-in: against the path (SaverReading's own), and the verdict from here. */
export function readingOf(record, pathDoc, result) {
  const month = monthOfDate(record.date);
  const pr = pathDoc ? saverReading(pathDoc.doc, { at: month, pension: record.pot.pension, isa: record.pot.isa }) : null;
  const start = pathDoc ? pathStart(pathDoc.doc).at : null;
  return {
    path: pathDoc ? { source: pathDoc.source, asOf: start ? keyOf(start) : null, version: savingPathVersion(pathDoc.doc) } : null,
    pathBand: pr && pr.band ? pr.band : null,
    // the middle figure in the pounds of the check-in's own month, as the pot it is set beside (toPotPounds)
    expected: pr && isNum(pr.expected) ? Math.round(pr.expected * toPotPounds(pr)) : null,
    ...verdictPart(result),
    engineVersion: result && isObj(result.basis) && typeof result.basis.engineVersion === 'string' ? result.basis.engineVersion : null
  };
}

/** The archive with `old` added, newest last: at most PATH_ARCHIVE_KEPT paths and PATH_ARCHIVE_BYTES in all, oldest out first. */
export function archiveWith(archive, old) {
  const out = (Array.isArray(archive) ? archive.filter(isObj) : []).concat(isObj(old) ? [old] : []);
  while (out.length > PATH_ARCHIVE_KEPT || (out.length && bytesOf(out) > PATH_ARCHIVE_BYTES)) out.shift();
  return out;
}

const declared = (patch) => { for (const k of Object.keys(patch)) if (!CHECKIN_WRITES.includes(k)) throw new Error('checkIn: "' + k + '" is not a declared field path'); return patch; };

/**
 * The check-in's ONE write (5.4 step 5, 5.8): the check-ins with this one added (one of this month replaced, the oldest
 * dropped past CHECKINS_KEPT), this month's pot record (the same month replaced, the last 600 kept), how often (when it
 * changed), and on an unlocked plan with no path yet the path drawn from this check-in's figures. Never a setting, never
 * the plan document. `result` is B's answer on checkInDraft's inputs (null: no verdict — no aim yet, or figures the test
 * cannot take; the check-in still records the pot and reads it against the path).
 */
export function checkInPatch(plan, typed, { today, now, result = null, plans = [] }) {
  const d = checkInDraft(plan, typed, { today, now, plans });
  if (!d.ok) return { ok: false, problem: d.problem, errors: d.errors || {}, patch: {}, previous: {} };
  const acc = accOf(plan);
  const month = monthOfDate(today);
  const list = checkInsOf(plan);
  // a second check-in in the same month corrects the first (the pot record's own rule)
  const kept = list.filter((c) => monthOfDate(c.date) !== month);
  const patch = {};
  let pathDoc = pathDocOf(plan);
  // the path an unlocked plan is read against is drawn at its first check-in (5.3) — or again when the only check-in so far
  // is the one being corrected this month — from the check-in's own figures; a locked plan reads its document's
  if (!isLocked(plan)) {
    const own = isObj(acc.path) ? acc.path : null;
    const redraw = own && !kept.length && own.asOf === month && own.potSource === 'check-in';
    if (!own || redraw) {
      const drawn = pathFrom(plan, d.record, now);
      if (drawn && Array.isArray(drawn.path) && drawn.path.length) {
        patch['accumulationTool.path'] = drawn;
        pathDoc = { doc: { accumulation: drawn, createdAt: drawn.drawnAt }, source: 'saving' };
      }
    }
  }
  const record = { ...d.record, reading: readingOf(d.record, pathDoc, result) };
  patch['accumulationTool.checkIns'] = kept.concat([record]).sort((a, b) => String(a.date).localeCompare(String(b.date))).slice(-CHECKINS_KEPT);
  // one ledger for pot values (5.1): the check-in's pot is this month's pot record
  const pot = potRecordOf({ date: month, sipp: d.record.pot.pension, isa: isNum(d.record.pot.isa) ? d.record.pot.isa : '', gia: d.record.pot.other || 0 }, now);
  if (pot) {
    const hist = Array.isArray(acc.history) ? acc.history.filter(isObj) : [];
    patch['accumulationTool.history'] = hist.filter((r) => r.date !== month).concat([pot]).sort((a, b) => String(a.date).localeCompare(String(b.date))).slice(-RECORDS_KEPT);
  }
  if (acc.checkInEvery !== d.values['ci.every']) patch['accumulationTool.checkInEvery'] = d.values['ci.every'];
  const previous = {};
  for (const k of Object.keys(patch)) previous[k] = copy(get(plan, k));
  return { ok: true, patch: declared(patch), previous, record, line: { id: 'checkedIn', slots: { month: monthWords(month) } } };
}

/**
 * "Start the path again from today" (5.3): an unlocked plan's path drawn again from its last check-in's figures; the old
 * one archived. Only in the month of that check-in: the path is drawn as of this month, so a pot from months ago would be
 * placed at today and every later check-in read against a path that far behind ('restartOld': check in first).
 */
export function restartPathPatch(plan, { today, now }) {
  if (!checkInAllowed(safeStage(plan, dateOf(today))).ok) return { ok: false, problem: 'notSaving', patch: {}, previous: {} };
  if (isLocked(plan)) return { ok: false, problem: 'locked', patch: {}, previous: {} };
  const list = checkInsOf(plan);
  const acc = accOf(plan);
  if (!list.length || !isObj(acc.path)) return { ok: false, problem: 'problems', patch: {}, previous: {} };
  if (monthOfDate(list[list.length - 1].date) !== monthOfDate(today)) return { ok: false, problem: 'restartOld', patch: {}, previous: {} };
  const drawn = pathFrom(plan, list[list.length - 1], now);
  if (!drawn || !Array.isArray(drawn.path) || !drawn.path.length) return { ok: false, problem: 'problems', patch: {}, previous: {} };
  const patch = { 'accumulationTool.path': drawn, 'accumulationTool.pathArchive': archiveWith(acc.pathArchive, acc.path) };
  const previous = {};
  for (const k of Object.keys(patch)) previous[k] = copy(get(plan, k));
  return { ok: true, patch: declared(patch), previous, line: { id: 'pathAgain', slots: { month: monthWords(monthOfDate(today)) } } };
}

/** What lands for £1 from take-home pay under the plan's scheme at this salary (AccumulationEngine.contributionBreakdown). */
function landsPerPound(salary, schemeType) {
  try { const g = contributionBreakdown({ netMonthly: 100, salary, schemeType, employerMonthly: 0 }).grossMonthly / 100; return g > 0 ? g : 1.25; } catch { return 1.25; }
}

/**
 * What the plan's own settings would hold for the last check-in's pay-in (5.6), or null when they already say it: a share
 * of pay as the share and the pounds it lands (SaverPayIn.shareSettings), pounds as what leaves take-home pay under the
 * plan's scheme, with what goes into ISAs and savings. The ages, the pot today and the yearly rise are left as What you
 * pay in's own Save writes them (saving.js savedSaving): the ages its own, else the budget's, else the Timing block's —
 * a saver placed by the Timing block holds none of its own, and £0 ages would be read as no saving years.
 * `ci` is { pay, payIn: { kind, ownPct, employerPct | own, employer | total, savingsIn } }, what lands a month: a check-in,
 * or "Use these in ‘…’" from question B's answer (useAnswer.js), which writes the same settings the same way.
 */
export function settingsFromCheckIn(plan, ci, today) {
  const s = isObj(accOf(plan).settings) ? accOf(plan).settings : {};
  const saved = savedSaving(plan, { today });
  const p = ci.payIn;
  const base = { ...s };
  let next;
  if (p.kind === 'share' && isNum(ci.pay) && ci.pay > 0) next = { ...base, ...shareSettings({ pay: ci.pay, ownPct: p.ownPct, employerPct: p.employerPct }) };
  else {
    const salary = isNum(ci.pay) ? ci.pay : (num(s.salary) || 0);
    const scheme = s.schemeType || 'ras';
    const own = p.kind === 'split' ? p.own : p.total;
    const employer = p.kind === 'split' ? p.employer : 0;
    next = { ...base, salary, schemeType: scheme, netMonthly: round2(own / landsPerPound(salary, scheme)), employerMonthly: round2(employer) };
  }
  next.isaMonthly = isNum(p.savingsIn) ? p.savingsIn : (num(s.isaMonthly) || 0);
  next.currentAge = num(saved.currentAge) || 0;
  next.retirementAge = num(saved.retirementAge) || 0;
  for (const k of ['potNow', 'escalationPct']) next[k] = num(s[k]) || 0;
  if (!next.schemeType) next.schemeType = 'ras';
  return next;
}

/** The plan's pay-in as the check-in compares it: what lands a month, the share while it agrees, what goes into savings. */
function planSays(plan) {
  const { payIn, share } = planPayInOf(plan);
  const s = isObj(accOf(plan).settings) ? accOf(plan).settings : {};
  return { kind: payIn.kind, total: payInParts(payIn).total, totalPct: share ? round2(share.ownPct + share.employerPct) : null, savingsIn: num(s.isaMonthly) || 0 };
}

/** "Use these in my plan" (5.6): What you pay in's settings from the last check-in, ONE write (SAVING_WRITES), outside the lock. */
export function useInPlanPatch(plan, { today }) {
  // a check-in's own buttons, so only while the plan is still saving (5.8), as the check-in itself: a drawing plan's
  // check-ins from its saving years are read, never written back into its settings
  if (!checkInAllowed(safeStage(plan, dateOf(today))).ok) return { ok: false, problem: 'notSaving', patch: {}, previous: {} };
  const list = checkInsOf(plan);
  if (!list.length) return { ok: false, problem: 'problems', patch: {}, previous: {} };
  const ci = list[list.length - 1];
  const next = settingsFromCheckIn(plan, ci, today);
  const cur = get(plan, 'accumulationTool.settings');
  if (JSON.stringify(cur) === JSON.stringify(next)) return { ok: true, patch: {}, previous: {}, line: { id: 'useSame', slots: {} } };
  const patch = { 'accumulationTool.settings': next };
  for (const k of Object.keys(patch)) if (!SAVING_WRITES.includes(k)) throw new Error('checkIn: "' + k + '" is not a declared field path');
  return { ok: true, patch, previous: { 'accumulationTool.settings': copy(cur) }, line: { id: 'usedInPlan', slots: {} } };
}

// ---- what changed (5.5) ------------------------------------------------------------------------------------------------

/**
 * Between two check-ins, the pot the path counts (the pension, plus ISAs and savings when it counts them): what was paid in
 * as recorded — each pay-in × the months it applied, from the earlier check-in's month up to (not including) this one's:
 * the earlier rate until this one's `since`, then this one's; months paused at £0 — and the rest, "markets, charges and
 * anything not recorded". In whole pounds; the parts add up to the change exactly.
 */
export function whatChanged(prev, cur, { isaCounted: pathIsa = false } = {}) {
  if (!isObj(prev) || !isObj(cur)) return null;
  const a = ym(prev.date), b = ym(cur.date);
  if (!a || !b) return null;
  // ISAs and savings are counted only when both check-ins say what was in them: a blank box is no figure, never £0 (a path
  // drawn at a lock after check-ins that left them out counts them); otherwise the change is the pension's alone
  const isaCounted = !!pathIsa && isNum(prev.pot && prev.pot.isa) && isNum(cur.pot && cur.pot.isa);
  const months = Math.max(0, monthsBetween(a, b));
  const potOf = (r) => r.pot.pension + (isaCounted ? (isNum(r.pot.isa) ? r.pot.isa : 0) : 0);
  const since = cur.payIn && typeof cur.payIn.since === 'string' ? cur.payIn.since : null;
  const paused = isObj(cur.paused) && typeof cur.paused.from === 'string' ? cur.paused : null;
  // A pause still running at the earlier check-in runs on until this one says it ended: the same pause given an end month,
  // or the month what goes in began again (`since`). With neither, starting again is not recorded, so nothing is counted
  // as paid in after it (it falls in "anything not recorded") — never the earlier rate, which the record said had stopped.
  const before = pauseRunning(prev);
  const carried = before && !(paused && paused.from === before.from) ? before : null;
  const runs = { pension: [], savings: [] };
  let m = keyOf(a);
  for (let i = 0; i < months; i++, m = addMonths(m, 1)) {
    const off = (paused && m >= paused.from && (paused.to == null || m < paused.to)) || (carried && m >= carried.from && !(since && m >= since));
    const r = since && m >= since ? cur : prev;
    // each pay-in in whole pounds, as the sentence says it: then "£317 a month for 1 month and £633 a month for 11 months"
    // multiplies out to the "in all" beside it, and the pennies fall in "anything not recorded"
    const pen = off ? 0 : (isNum(r.payIn && r.payIn.total) ? Math.round(r.payIn.total) : 0);
    const sav = off ? 0 : (isNum(r.payIn && r.payIn.savingsIn) ? Math.round(r.payIn.savingsIn) : 0);
    for (const [k, v] of [['pension', pen], ['savings', sav]]) {
      const list = runs[k];
      if (list.length && list[list.length - 1].perMonth === v) list[list.length - 1].months++;
      else list.push({ perMonth: v, months: 1 });
    }
  }
  const sum = (list) => list.reduce((t, x) => t + x.perMonth * x.months, 0);
  // the runs as the sentence names them: the months at £0 left out (a pause is said on its own line), and the stretches at
  // the same rate either side of one said once
  const paid = (list) => list.filter((x) => x.perMonth > 0).reduce((out, x) => {
    const tail = out[out.length - 1];
    if (tail && tail.perMonth === x.perMonth) tail.months += x.months; else out.push({ ...x });
    return out;
  }, []);
  const from = Math.round(potOf(prev)), to = Math.round(potOf(cur));
  const paidPension = sum(runs.pension);
  const paidSavings = isaCounted ? sum(runs.savings) : 0;
  return {
    from, to, months, isaCounted,
    pension: paid(runs.pension), paidPension,
    savings: isaCounted ? paid(runs.savings) : null, paidSavings: isaCounted ? paidSavings : null,
    rest: to - from - paidPension - paidSavings,
    pausedBefore: carried ? { from: carried.from, to: since } : null
  };
}

// ---- the calendar file (5.2) --------------------------------------------------------------------------------------------

/**
 * A short tag for the plan in the calendar file's UID, in letters only: the plan's id hashed (FNV-1a, 32 bits) and each
 * of its eight hex places written a to p. Calendar apps take a file with a UID they hold as an update to that event, so
 * two plans due in the same month (yours and your partner's) need two UIDs; the tag tells them apart and says nothing
 * about the plan — no id, no figure, no digit.
 */
function planTag(id) {
  let h = 0x811c9dc5;
  for (const ch of String(id == null ? '' : id)) { h ^= ch.codePointAt(0); h = Math.imul(h, 0x01000193) >>> 0; }
  return h.toString(16).padStart(8, '0').replace(/[0-9a-f]/g, (c) => String.fromCharCode(97 + parseInt(c, 16)));
}

/**
 * The calendar file "Add to my calendar" saves: one all-day event on the first day of the month the check-in falls due,
 * named "PensionTools check-in" — the date and those words, with what the calendar format itself needs (its version, who
 * made it, the day it was saved and an event id told apart by plan: planTag). No figures, no email, no reminder service.
 */
export function calendarText({ month, today, planId = '' }) {
  const p = ym(month);
  if (!p) return null;
  const day = keyOf(p).replace('-', '') + '01';
  const after = keyOf(p).replace('-', '') + '02';
  const stamp = String(today).replace(/-/g, '') + 'T000000Z';
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//PensionTools//Check-in//EN', 'CALSCALE:GREGORIAN', 'BEGIN:VEVENT',
    'UID:check-in-' + day + '-' + planTag(planId) + '@pensiontools.uk', 'DTSTAMP:' + stamp, 'DTSTART;VALUE=DATE:' + day, 'DTEND;VALUE=DATE:' + after,
    'SUMMARY:PensionTools check-in', 'END:VEVENT', 'END:VCALENDAR', ''].join('\r\n');
}
export const calendarFileName = (month) => 'pensiontools-check-in-' + String(month) + '.ics';

// ---- the screen -----------------------------------------------------------------------------------------------------------

/** How a pay-in reads in a row: the share and what lands, or what lands. */
function payInWords(r) {
  const p = r.payIn || {};
  const total = isNum(p.total) ? p.total : 0;
  if (p.kind === 'share' && isNum(p.ownPct) && isNum(p.employerPct)) return { id: 'share', slots: { pct: pctText(p.ownPct + p.employerPct), own: pctText(p.ownPct), employer: pctText(p.employerPct), amount: pounds(total) } };
  if (p.kind === 'split') return { id: 'split', slots: { amount: pounds(total), own: pounds(p.own), employer: pounds(p.employer) } };
  return { id: 'total', slots: { amount: pounds(total) } };
}
/** A percent as said: up to one decimal place, no trailing zero ("12", "6.5"). */
function pctText(v) {
  const n = Math.round((+v || 0) * 10) / 10;
  return String(n);
}
/** What would be enough, as a check-in froze it: a share of pay (in all), or pounds a month. */
function enoughWords(reading, which = 'nine') {
  const e = reading && reading.enough;
  if (!e) return null;
  if (e.outOfReach && which === 'nine' && !isNum(e.nine)) return { id: 'outOfReach', slots: {} };
  const amount = e[which];
  if (!isNum(amount)) return null;
  const pct = e[which + 'TotalPct'];
  return isNum(pct) ? { id: 'share', slots: { pct: pctText(pct), amount: pounds(amount) } } : { id: 'pounds', slots: { amount: pounds(amount) } };
}
/** The band against the path, as an id the words name (SaverReading's version-3 and version-2 bands). */
const PATH_BANDS = { 'below p10': 'below', 'p10–p50': 'lower', 'p50–p90': 'upper', 'above p90': 'above', start: 'start',
  'below the cautious line': 'below', 'below the locked path': 'lower', 'on or above the locked path': 'upper', 'above the strong line': 'above' };

/** One row of "Your check-ins" (5.7), newest first: exact figures only (a record). */
function rowOf(ci, before) {
  const r = ci.reading || {};
  const lasted = isNum(r.fails) ? lastedText(1 - r.fails / CHECKIN_FUTURES) : null;
  const pathKey = r.path ? (r.path.source || '') + ':' + (r.path.asOf || '') : null;
  const prevKey = before && before.reading && before.reading.path ? (before.reading.path.source || '') + ':' + (before.reading.path.asOf || '') : null;
  const pathChanged = !!pathKey && pathKey !== prevKey;
  return {
    date: ci.date, month: monthWords(monthOfDate(ci.date)),
    pension: pounds(ci.pot.pension), isa: isNum(ci.pot.isa) ? pounds(ci.pot.isa) : null, other: isNum(ci.pot.other) && ci.pot.other > 0 ? pounds(ci.pot.other) : null,
    pay: isNum(ci.pay) ? pounds(ci.pay) : null,
    payIn: payInWords(ci),
    savingsIn: isNum(ci.payIn && ci.payIn.savingsIn) && ci.payIn.savingsIn > 0 ? pounds(ci.payIn.savingsIn) : null,
    paused: isObj(ci.paused) && ci.paused.from ? { from: monthWords(ci.paused.from), to: ci.paused.to ? monthWords(ci.paused.to) : null } : null,
    path: r.pathBand ? { band: PATH_BANDS[r.pathBand] || 'start', expected: isNum(r.expected) ? pounds(r.expected) : null } : null,
    verdict: r.band ? { band: r.band, words: lasted } : null,
    enough: enoughWords(r, 'nine'),
    note: typeof ci.note === 'string' && ci.note ? ci.note : null,
    pathChanged: pathChanged ? { month: monthWords(r.path.asOf), why: r.path.source === 'document' ? 'lock' : !before ? 'first' : 'again' } : null
  };
}

/** The last check-in, read for the screen: its frozen verdict, its place against the path, what changed, then and now. */
function latestOf(list, { pathDoc }) {
  if (!list.length) return null;
  const ci = list[list.length - 1];
  const prev = list.length > 1 ? list[list.length - 2] : null;
  const r = ci.reading || {};
  const month = monthOfDate(ci.date);
  // the lines either side of the middle figure, from the path itself while it is still the one the check-in was read
  // against (5.1: the frozen reading keeps only the band and the middle figure)
  let lines = null;
  if (pathDoc && r.path) {
    const start = pathStart(pathDoc.doc).at;
    if (start && keyOf(start) === r.path.asOf && pathDoc.source === r.path.source) {
      const pr = saverReading(pathDoc.doc, { at: month, pension: ci.pot.pension, isa: ci.pot.isa });
      // the lines in the pot's own pounds (toPotPounds): a version-2 path's prices raised to the check-in's month, and said so
      const f = toPotPounds(pr);
      if (pr && isNum(pr.low) && isNum(pr.high)) {
        lines = { low: pounds(pr.low * f), high: pounds(pr.high * f), actual: isNum(pr.actual) ? pounds(pr.actual) : null,
          prices: Math.abs(f - 1) >= 0.0005 ? { from: monthWords(keyOf(start)), month: monthWords(month) } : null };
      }
    }
  }
  const isaCounted = pathDoc ? pathCountsIsa(pathDoc.doc) : (!!prev && isNum(prev.pot.isa) && isNum(ci.pot.isa));
  const ch = prev ? whatChanged(prev, ci, { isaCounted }) : null;
  const lasted = isNum(r.fails) ? lastedText(1 - r.fails / CHECKIN_FUTURES) : null;
  const pr0 = prev && prev.reading ? prev.reading : null;
  const lastedThen = pr0 && isNum(pr0.fails) ? lastedText(1 - pr0.fails / CHECKIN_FUTURES) : null;
  return {
    date: ci.date, month: monthWords(month),
    verdict: r.band ? { band: r.band, words: lasted, aim: isNum(r.aim) ? pounds(r.aim) : null, bad: isNum(r.bad) ? pounds(r.bad) : null, middling: isNum(r.middling) ? pounds(r.middling) : null, gap: isNum(r.gap) && r.gap > 0 ? pounds(r.gap) : null } : null,
    enough: enoughWords(r, 'nine'), four: r.enough && r.enough.fourNow ? { id: 'fourNow', slots: {} } : enoughWords(r, 'four'),
    path: r.pathBand ? { band: PATH_BANDS[r.pathBand] || 'start', expected: isNum(r.expected) ? pounds(r.expected) : null, ...(lines || {}), pension: !(pathDoc && pathCountsIsa(pathDoc.doc)) } : null,
    changed: ch ? {
      since: monthWords(monthOfDate(prev.date)), from: pounds(ch.from), to: pounds(ch.to), isaCounted: ch.isaCounted,
      pension: ch.pension.map((x) => ({ perMonth: pounds(x.perMonth), months: x.months })), paidPension: pounds(ch.paidPension),
      savings: ch.savings ? ch.savings.map((x) => ({ perMonth: pounds(x.perMonth), months: x.months })) : null, paidSavings: ch.paidSavings != null ? pounds(ch.paidSavings) : null,
      rest: pounds(ch.rest), restSign: ch.rest < 0 ? '−' : '+', raw: ch,
      pausedBefore: ch.pausedBefore ? { from: monthWords(ch.pausedBefore.from), to: ch.pausedBefore.to ? monthWords(ch.pausedBefore.to) : null } : null
    } : null,
    thenNow: prev && lastedThen && lasted ? { then: lastedThen, now: lasted, enoughThen: enoughWords(pr0, 'nine'), enoughNow: enoughWords(r, 'nine') } : null
  };
}

/**
 * Everything the check-in screen draws: whether a check-in is offered here (5.8), the boxes with their saved text and
 * problems, how often and when the next is due, the last check-in read, "Your check-ins" newest first, the path it is read
 * against, the buttons of 5.3 and 5.6, the calendar file and the size note (5.11).
 */
export function checkInOf(entries, id, { today, typed = null, source = 'account' } = {}) {
  const list0 = (entries || []).filter((e) => e && e.plan && typeof e.plan === 'object' && e.plan.id != null);
  const entry = list0.find((e) => String(e.plan.id) === String(id)) || null;
  if (!entry) return { found: false, id: String(id || '') };
  const plan = entry.plan;
  const now = dateOf(today);
  const readonly = !!(entry.newer || entry.failed);
  const stage = safeStage(plan, now);
  const allowed = checkInAllowed(stage).ok;
  // a saving plan whose change-over is still to come: it says when it begins, and takes no check-in until then
  const notYet = allowed && !readonly ? notBegunOf(plan, monthOfDate(today)) : null;
  const locked = isLocked(plan);
  const list = checkInsOf(plan);
  const c = checkCheckIn(plan, typed || {}, { today });
  const boxes = checkInBoxesOf(plan, { today });
  const fields = CHECKIN_FIELDS.map((f) => ({
    path: f.path, type: f.type === 'month' || f.type === 'text' ? 'text' : f.type === 'percent' ? 'money' : f.type, options: f.type === 'choice' ? f.options : null,
    applies: c.applies[f.path] !== false, shown: c.shown[f.path] || '', saved: f.path in boxes && !blank(boxes[f.path]) && !['ci.paused', 'ci.every', 'ci.kind'].includes(f.path) ? boxes[f.path] : null,
    error: c.errors[f.path] || null
  }));
  const due = checkInDueOf(plan, { today, stageKey: stage.key });
  // the last check-in before this month's said paying in had stopped: the month box asks when it started again
  const prior = list.filter((x) => monthOfDate(x.date) !== monthOfDate(today));
  const pausedBefore = !!pauseRunning(prior.length ? prior[prior.length - 1] : null);
  const pathDoc = pathDocOf(plan);
  const rows = list.map((ci, i) => rowOf(ci, i > 0 ? list[i - 1] : null)).reverse();
  const latest = latestOf(list, { pathDoc });
  const last = list.length ? list[list.length - 1] : null;
  // "Use these in my plan" (5.6): only when the last check-in's pay-in is not what the plan says
  let useInPlan = null;
  if (last && !readonly && allowed) {
    const says = planSays(plan);
    const nowTotal = last.payIn.total;
    const lastPct = last.payIn.kind === 'share' && isNum(last.payIn.ownPct) ? round2(last.payIn.ownPct + last.payIn.employerPct) : null;
    const pctDiff = lastPct != null && says.totalPct != null && lastPct !== says.totalPct;
    const totalDiff = Math.abs(round2(nowTotal) - round2(says.total)) >= 0.01;
    const savingsDiff = Math.abs(round2(last.payIn.savingsIn || 0) - round2(says.savingsIn)) >= 0.01;
    if (pctDiff) useInPlan = { id: 'share', slots: { now: pctText(lastPct), plan: pctText(says.totalPct) } };
    else if (totalDiff) useInPlan = { id: 'pounds', slots: { now: pounds(nowTotal), plan: pounds(says.total) } };
    else if (savingsDiff) useInPlan = { id: 'savings', slots: { now: pounds(last.payIn.savingsIn || 0), plan: pounds(says.savingsIn) } };
  }
  // "The path was drawn paying in £317 a month; you now pay in £380" (5.6)
  const head = pathDoc && isObj(pathDoc.doc.accumulation) ? pathDoc.doc.accumulation : null;
  const pathPaid = head && isNum(head.totalMonthly) ? head.totalMonthly : null;
  const pathDiffers = last && pathPaid != null && Math.abs(Math.round(landsNow(last)) - pathPaid) >= 1 ? { drawn: pounds(pathPaid), now: pounds(landsNow(last)) } : null;
  const pathStartAt = pathDoc ? pathStart(pathDoc.doc).at : null;
  // what the screen says beside the verdict, as What you pay in says it (saverInputsOf's notes): a couple's plan read on its
  // own, and the plan's own yearly rise in what goes in when it is not the price rise the test assumes — read with the last
  // check-in's pay-in (nothing going in, nothing to rise)
  const plain = readonly ? null : saverInputsOf(plan, { today, plans: list0 });
  const withLast = !plain || !last ? plain : saverInputsOf(plan, { today, checkIn: last, plans: list0 });
  const rise = withLast && withLast.ok && withLast.notes.rise ? { pct: pctText(withLast.notes.rise.pct), path: withLast.notes.rise.path } : null;
  const allowance = allowanceOf(plan, (last ? landsNow(last) : planSays(plan).total) * 12, list0);
  return {
    found: true, id: String(plan.id), name: nameOf(plan), readonly, editable: !readonly && allowed && !notYet, source, locked,
    allowed, notYet: notYet ? { month: notYet.month } : null, stageKey: stage.key, first: list.length === 0,
    fields, errors: c.errors, ok: c.ok, isaNeeded: c.isaNeeded, pausedBefore,
    // a check-in of this month already: another one this month replaces it (the pot record's own rule), and the form says so
    again: !!last && monthOfDate(last.date) === monthOfDate(today),
    cadence: { every: due.every, chosen: due.chosen, legacy: due.legacy, due: due.due, last: due.last ? monthWords(due.last) : null, next: due.next ? monthWords(due.next) : null },
    latest, rows, count: list.length,
    path: pathDoc ? { source: pathDoc.source, from: pathStartAt ? monthWords(keyOf(pathStartAt)) : null, isa: pathCountsIsa(pathDoc.doc) } : null,
    // only from a check-in of this month (restartPathPatch): the path it draws starts this month, from that check-in's pot
    restartable: !readonly && allowed && !locked && !!pathDoc && pathDoc.source === 'saving' && !!last && monthOfDate(last.date) === monthOfDate(today),
    useInPlan, pathDiffers,
    // the calendar file (5.2): once a check-in has said how often, for the month the next falls due
    calendar: due.chosen && due.next ? { month: due.next, words: monthWords(due.next), text: calendarText({ month: due.next, today, planId: plan.id }), name: calendarFileName(due.next) } : null,
    dropWarning: list.length >= CHECKINS_WARN_FROM,
    // no verdict can be read from the plan's figures (no aim yet, or figures the test cannot take): the check-in still
    // records the pot and reads it against the path (situation K)
    verdictWhy: readonly ? 'readonly' : plain.ok ? null : plain.why || 'invalid',
    notes: { couple: !!(plain && plain.ok && plain.notes.couple), rise },
    allowance
  };
}
