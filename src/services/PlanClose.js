/**
 * "Move to a new plan from a month you choose" (research/plan-start.md §2 I, §3, §6 decisions 10 and 11): the rules of the
 * close, shared by the planner (src/ui/planCloseUi.js) and V7 (src/v7/effects/planWrite.js, kind 'close'). What closed means
 * for every tool, and the data, are services/PlanClosed.js.
 *
 * Someone who has lived on a plan moves to another one from a month they choose (the change-over month). Two writes, each
 * the one write its app already makes for a plan:
 *   1. the NEW plan, created (successorOf): a copy of the old one's figures (PlanCopy.copyOf, without its records) — a draft,
 *      never locked, with no plan document, no plan of record, no records and no tax year set up — whose year 0 is the tax
 *      year the change-over month is in (decision 10). Every figure the plan counts from year 0 is moved with it so that it
 *      keeps its tax year and its age (successorSettings): the plan still ends at the same age. The month work stopped is
 *      copied (it is the person's, not the plan's). Its pots are what the person says is held today, asked in the close's
 *      question in boxes filled in from what is known (closePotsOf): the holdings record per kind of account, read into the
 *      plan's mix the way "Moving to your plan's mix" reads it (TransitionPlanner.ledgerView), the latest month recorded
 *      when it is newer, else the plan's own figures. It says what came before it: `previousPlanId` and
 *      `before: { kind: 'plan', planId, from }`. What you hold travels with it; the partner link and a shared budget follow
 *      it when the person says so (decision 11).
 *   2. the OLD plan, closed (closeWrite): `closedAt` (the month before the change-over month) and `nextPlanId`, at its root,
 *      outside both settings maps — the lock guard lets exactly these two keys be written, once (PlanClosed.closureRefusal).
 *      A plan that is not locked (unlocked after its records) is locked by the same write (lockedBy 'closed'): a closed plan
 *      reads as locked in every tool, and nothing else of it changes.
 *   and, when the person says so, the partner's plan re-pointed (partnerWrites): its link, and the budget it reads from the
 *   old plan, to the new one. A partner's plan may be locked; the link and the budget are outside the lock.
 * Two reasons, one close (CLOSE_REASONS): "Move to a new plan" ('plan', above), and "I'm going back to work" ('working',
 * research/plan-start.md §2 J). Going back to work closes the drawing plan the same way — the same `closedAt` and
 * `nextPlanId`, the same guard allowance — and the plan that carries it on is a SAVING SPELL, case A of the design: not
 * retired (`retired: false`), stopping again at a month or an age the person gives (`stoppedWork` the month when given, the
 * age reached then as `retireAge`; an age alone leaves `stoppedWork` blank), its year 0 the tax year of that second stop with
 * every figure counted from year 0 moved to it as for a new plan (so the income steps keep their ages and the plan ends at
 * the same age), `before: { kind: 'working', from }` and `previousPlanId`, the pots what is held today, and the Accumulation
 * planner's figures to start from — the ages, the pot today and this month's pot record (workingSettings); what goes in is
 * asked where a saver says it, on "What you pay in" (the saver's pages), as for any saver. When the person stops again, the
 * same plan is locked as any saver's is, and its "stopped work" month is the second stop.
 * Every close carries the person's own facts (CARRIED_FACTS): `flexibleAccess` (services/FlexibleAccess.js), written on the
 * new plan when the closed plan carries it or has any taxable draw recorded, never on a plan closed with no draw, and never
 * on the closed plan (the close writes only its two keys there).
 *
 * Pure: no storage, no DOM, no clock of its own (`now` comes in).
 */
import { deriveTiming, taxYearOfMonth, monthKeyOf, ageOnDate, retirementMonth, projectedPotAtRetirement } from './PlanTiming.js';
import { copyOf, hasRecords } from './PlanCopy.js';
import { reAnchorCopy, moveAnchorOf } from './PlanMove.js';
import { settingsAsSeenFromToday, withoutPotsAsOf, lockPositionOf } from './PlanFromToday.js';
import { effectiveStressSettings } from './PlanReading.js';
import { normaliseHoldings, holdingsLines } from './HoldingsRecord.js';
import { ledgerView } from './TransitionPlanner.js';
import { deriveStage } from './LifeStage.js';
import { isClosedPlan, monthAfter, monthBefore, monthWordsOf, lastRecordedMonth, planNameOf } from './PlanClosed.js';
import { carriedFlexibleAccess } from './FlexibleAccess.js';
import { potRecordOf } from './SaverReading.js';

const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const num = (v) => (v === null || v === undefined || v === '' || !Number.isFinite(+v) ? null : +v);
const r0 = (v) => Math.round(+v || 0);
const settingsOf = (plan, kind) => { const t = plan && plan[kind === 'stress' ? 'stressTool' : 'decisionTool']; return t && isObj(t.settings) ? t.settings : {}; };

/** How far ahead the change-over month may be: twelve months from this one (a move from next April, say). */
export const MONTHS_AHEAD = 12;
/**
 * The person's facts a close carries to the new plan besides the month work stopped (which is in its settings, copied whole):
 * money taken from a pension flexibly (services/FlexibleAccess.js carriedFlexibleAccess), carried by every close to every
 * later plan.
 */
export const CARRIED_FACTS = Object.freeze(['flexibleAccess']);
/** Why a plan is closed: moving to a new plan, or going back to work (a saving spell follows: §2 J). */
export const CLOSE_REASONS = Object.freeze(['plan', 'working']);
/** The shortest plan a saving spell may leave from its second stop to the age the plan ends at (About's MIN_YEARS). */
export const WORKING_MIN_YEARS = 5;
/** The oldest age a second stop may be given at (About's stop age box). */
export const WORKING_MAX_AGE = 85;

/** The plan's year 0 as the tools read it: the Decision copy's, then the Stress copy's, then the one the timing derives. */
export function planAnchorOf(plan, now) {
  const ss = settingsOf(plan, 'stress'), ds = settingsOf(plan, 'decision');
  return moveAnchorOf(ss, ds) || deriveTiming(ss, now).firstTaxYear;
}

/** The partner's plan this plan is linked to (its id), or null. */
export const partnerIdOf = (plan) => (plan && plan.household && typeof plan.household.partnerScenarioId === 'string' && plan.household.partnerScenarioId) || null;

/** The months from `a` to `b`, both 'YYYY-MM', in order. */
function monthsFromTo(a, b) {
  const out = [];
  for (let m = a; m <= b && out.length < 600; m = monthAfter(m)) out.push(m);
  return out;
}

/**
 * Is this plan offered "Move to a new plan", and from which months? Offered on a plan someone has lived on: a LOCKED plan of
 * someone who has stopped work (or whose plan does not say: an old plan with no age), and a plan unlocked after its records
 * that still has them. Not on a draft with nothing recorded (change it, or copy it), not on a plan still to stop (its months
 * have not begun), not on the read-only example, and not on a plan already closed. The change-over month is any month after
 * the last one recorded (a recorded month is never left past the close) — this month when nothing is recorded — up to twelve
 * months ahead; suggested: this month, or the first month after the records when they reach it. Going back to work is offered
 * on the same plans when the plan knows the person's age (`working`): the second stop is asked as a month or an age.
 * @returns {null | { locked: boolean, choices: string[], suggested: string, lastRecorded: string|null, from: number, working: boolean, ageNow: number|null }}
 */
export function closeOfferOf(plan, now) {
  if (!isObj(plan) || plan.example === true || isClosedPlan(plan) || plan.closedAt != null) return null;
  const ss = settingsOf(plan, 'stress'), ds = settingsOf(plan, 'decision');
  const locked = !!ds.locked;
  if (!locked && !hasRecords(plan)) return null;
  const t = deriveTiming(ss, now);
  if (t.mode === 'future') return null;
  const thisMonth = monthKeyOf(now);
  const lastRecorded = lastRecordedMonth(plan);
  const first = lastRecorded ? monthAfter(lastRecorded) : thisMonth;
  let last = thisMonth; for (let i = 0; i < MONTHS_AHEAD; i++) last = monthAfter(last);
  if (first > last) return null;
  const choices = monthsFromTo(first, last);
  const suggested = first > thisMonth ? first : thisMonth;
  const ageNow = +t.currentAge > 0 ? Math.floor(+t.currentAge) : null;
  return { locked, choices, suggested, lastRecorded, from: planAnchorOf(plan, now), working: ageNow != null, ageNow };
}

// ---- the new plan's pots ---------------------------------------------------------------------------------------------

/**
 * What is held today, read as the plan's pots: the pension by bucket the way "Moving to your plan's mix" reads the record
 * (TransitionPlanner.ledgerView: a gilt is bonds, money-market funds and cash are cash, a fund its catalogue bucket, else
 * shares), the ISAs and the ordinary account by their totals. Bank and savings money (the CASH type of account) is not one
 * of the plan's pots, as everywhere else. `has` says which kinds of account the record holds at all (a record of the
 * pension's funds alone says nothing of the ISAs: closePotsOf then takes the plan's figure for them). Null when the record
 * holds nothing in a pension, an ISA or an ordinary account.
 * @returns {null | { from: 'holdings', asOf: string|null, pension: number, isa: number, gia: number, split: { equity, bond, cash, div }, has: { pension, isa, gia } }}
 */
export function heldPotsOf(plan) {
  const rec = normaliseHoldings(plan && plan.holdings);
  const view = ledgerView(holdingsLines(rec));
  const split = { equity: 0, bond: 0, cash: 0, div: 0 };
  let isa = 0, gia = 0;
  const has = { pension: false, isa: false, gia: false };
  const bucketKey = { shares: 'equity', bonds: 'bond', cash: 'cash', diversifiers: 'div' };
  for (const h of view) {
    if (!(h.value > 0)) continue;
    if (h.wrapper === 'SIPP') { split[bucketKey[h.bucket] || 'equity'] += h.value; has.pension = true; }
    else if (h.wrapper === 'ISA') { isa += h.value; has.isa = true; }
    else if (h.wrapper === 'GIA') { gia += h.value; has.gia = true; }
  }
  if (!has.pension && !has.isa && !has.gia) return null;
  const s = { equity: r0(split.equity), bond: r0(split.bond), cash: r0(split.cash), div: r0(split.div) };
  return { from: 'holdings', asOf: rec.updatedAt || null, pension: s.equity + s.bond + s.cash + s.div, isa: r0(isa), gia: r0(gia), split: s, has };
}

/** The latest month recorded with its pension pots (Month by month's equity, bonds and cash), or null. */
export function recordedPotsOf(plan) {
  const hist = plan && plan.decisionTool && Array.isArray(plan.decisionTool.history) ? plan.decisionTool.history : [];
  let best = null;
  for (const h of hist) {
    const m = h && typeof h.date === 'string' ? h.date.slice(0, 7) : null;
    if (!m || !/^\d{4}-\d{2}$/.test(m) || !['equity', 'bond', 'cash'].some((k) => num(h[k]) != null)) continue;
    if (!best || m > best.month) best = { month: m, h };
  }
  if (!best) return null;
  const split = { equity: r0(best.h.equity), bond: r0(best.h.bond), cash: r0(best.h.cash), div: 0 };
  return { month: best.month, pension: split.equity + split.bond + split.cash, split };
}

/**
 * The new plan's pots as the close's question fills them in — always boxes, each figure the person's to change — and where
 * each came from. Each pot is taken from the What you hold record only when the record holds that kind of account (a record
 * of the pension's funds alone says nothing of the ISAs), else from the plan's own figure. The pension is taken from the
 * latest month recorded instead when that month is later than the record (a record made long ago is not what is held today).
 * @returns {{ pension, isa, gia, split, from: { pension, isa, gia }, asOf: { pension, isa, gia } }}  from: 'holdings' |
 *   'record' | 'plan'; asOf: the record's date ('YYYY-MM-DD'), the month recorded ('YYYY-MM'), or null
 */
export function closePotsOf(plan) {
  const own = planPotsOf(plan), held = heldPotsOf(plan), rec = recordedPotsOf(plan);
  const heldMonth = held && held.asOf ? String(held.asOf).slice(0, 7) : null;
  const out = { pension: own.pension, isa: own.isa, gia: own.gia, split: own.split, from: { pension: 'plan', isa: 'plan', gia: 'plan' }, asOf: { pension: null, isa: null, gia: null } };
  if (held && held.has.pension) Object.assign(out, { pension: held.pension, split: held.split }), out.from.pension = 'holdings', out.asOf.pension = held.asOf;
  if (rec && rec.pension > 0 && (!(held && held.has.pension) || !heldMonth || rec.month > heldMonth)) Object.assign(out, { pension: rec.pension, split: rec.split }), out.from.pension = 'record', out.asOf.pension = rec.month;
  if (held && held.has.isa) { out.isa = held.isa; out.from.isa = 'holdings'; out.asOf.isa = held.asOf; }
  if (held && held.has.gia) { out.gia = held.gia; out.from.gia = 'holdings'; out.asOf.gia = held.asOf; }
  return out;
}

/** The pots as the plan holds them (its Stress settings, as entered): what the question offers when nothing is recorded as held. */
export function planPotsOf(plan) {
  const s = settingsOf(plan, 'stress');
  const split = { equity: r0(s.equityMin), bond: r0(s.bondMin), cash: r0(s.cashTarget), div: r0(s.diversifierStart) };
  return { from: 'plan', asOf: null, pension: split.equity + split.bond + split.cash + split.div, isa: r0(s.isaBalance), gia: r0(s.taxableStart), split };
}

/** A pension total in the shares of `split` (the plan's own mix; half shares, 40% bonds, 10% cash when it has none). */
function splitOf(total, split) {
  const sum = split ? split.equity + split.bond + split.cash + split.div : 0;
  const sh = sum > 0 ? { equity: split.equity / sum, bond: split.bond / sum, cash: split.cash / sum, div: split.div / sum } : { equity: 0.5, bond: 0.4, cash: 0.1, div: 0 };
  const t = r0(total);
  const equity = Math.round(t * sh.equity), bond = Math.round(t * sh.bond), div = sh.div > 0 ? Math.round(t * sh.div) : 0;
  return { equity, bond, div, cash: t - equity - bond - div };
}

/**
 * The new plan's pots, as settings keys: the pension by bucket (as held, or a given total in the plan's own mix), the ISAs and
 * the ordinary account. A mix read from the funds list ('funds') becomes a mix in pounds ('risk'), since the pounds are now
 * what is held, not what the list says; the pots at a future stop are cleared (the plan's person has stopped).
 * @param {object} base  the old plan's Stress settings
 * @param {{ pension: number, isa?: number, gia?: number, split?: object|null }} pots
 */
export function potsSettings(base, pots) {
  const s = isObj(base) ? base : {};
  const split = pots.split && (pots.split.equity + pots.split.bond + pots.split.cash + pots.split.div) === r0(pots.pension) ? pots.split : splitOf(pots.pension, { equity: r0(s.equityMin), bond: r0(s.bondMin), cash: r0(s.cashTarget), div: r0(s.diversifierStart) });
  const out = { equityMin: split.equity, bondMin: split.bond, cashTarget: split.cash, isaBalance: r0(pots.isa), potAtRetirement: null };
  if (split.div > 0 || s.diversifierStart != null) out.diversifierStart = split.div;
  if (r0(pots.gia) > 0 || s.taxableStart != null) out.taxableStart = r0(pots.gia);
  if (s.allocMode === 'funds') out.allocMode = 'risk';
  return out;
}

// ---- the new plan's settings -----------------------------------------------------------------------------------------

/** Is the State Pension given by a date (with a weekly amount)? Then the engines count it from the new year 0 by themselves. */
const spByDate = (s) => !!(s && s.spStartDate && +s.spWeeklyAmount > 0);

/**
 * One copy of the settings (Stress or Decision) with its year 0 moved to `to`, `k` tax years from where it was (k > 0 later,
 * k < 0 earlier), and every figure counted from year 0 moved with it so that it keeps its tax year and its age:
 *  - later (the usual case: a plan lived on for some years): the plan as seen from k years in (PlanFromToday.
 *    settingsAsSeenFromToday) — the income by year from then on, the final-salary pension, income streams, one-off spends
 *    and lump sums k years earlier (those wholly past dropped: a lump sum that has arrived is in the pots), a phased start
 *    that is over ended, the length k years shorter — with the age the income starts at k years older, so the plan ends at
 *    the same age and every step keeps its age. A State Pension given by a date stays a date (the engines count it from the
 *    new year 0), and the planner's "at 67" default (year 12 with a start age) stays the default, which follows the age;
 *  - earlier (a plan closed before its income started, say): the move of a plan's start (PlanMove.reAnchorCopy);
 *  - none: only year 0 is written.
 * A way of drawing's own counts of years (a ladder's cash years, say) are its timing from the new plan's year 0, and are left
 * as the dials say: the new plan buys its own.
 */
export function successorSettings(settings, k, to, kind = 'stress') {
  const s = isObj(settings) ? withoutPotsAsOf(settings) : {};
  if (k < 0) return reAnchorCopy(s, -k, to, kind);
  if (!(k > 0)) return { ...s, firstTaxYear: to };
  const out = settingsAsSeenFromToday({ ...s, firstTaxYear: to - k }, k);
  if (spByDate(s)) for (const key of ['spStartDate', 'statePension', 'statePensionYear']) { if (s[key] === undefined) delete out[key]; else out[key] = s[key]; }
  else if (kind === 'stress' && s.statePensionYear === 12 && +s.shapeAgeNow > 0) out.statePensionYear = 12;
  if (+s.shapeAgeNow > 0) out.shapeAgeNow = +s.shapeAgeNow + k;
  out.firstTaxYear = to;
  return out;
}

// ---- back to work: the saving spell (§2 J) ---------------------------------------------------------------------------

const MONTH_RE = /^(\d{4})-(0[1-9]|1[0-2])$/;

/**
 * When the person expects to stop work again, checked: a month ('YYYY-MM', after the change-over month and after this one) —
 * the age reached by its last day is the age the plan stops saving at, as About's "a month" does — or, with no month, an
 * age (above the age today, at most WORKING_MAX_AGE) whose birthday month comes after the change-over month. The plan must
 * still run at least WORKING_MIN_YEARS from that stop to the age it ends at (the closed plan's last age, kept).
 * @param {object} plan  the plan being closed
 * @param {{ month: string, stop: { month?: string|null, age?: number|string|null }, now: Date }} o
 * @returns {{ ok: true, stoppedWork: string|null, retireAge: number, firstTaxYear: number, shapeAgeNow: number, startMonth: string, endAge: number }
 *   | { ok: false, problem: 'noAge'|'noStop'|'notAMonth'|'stopTooSoon'|'notAnAge'|'stopAgeTooSoon'|'stopTooLate' }}
 *   (an age is refused as an age — 'stopAgeTooSoon' — when it is not above the age today or its birthday month is not after
 *   the change-over month, so the words say the age is the problem, not a month)
 */
export function workingStopOf(plan, { month, stop, now }) {
  const ss = settingsOf(plan, 'stress');
  const ageNow = ageOnDate(ss, now, now);
  if (!(ageNow > 0)) return { ok: false, problem: 'noAge' };
  const thisMonth = monthKeyOf(now);
  const given = isObj(stop) ? stop : {};
  const m = typeof given.month === 'string' ? given.month.trim() : '';
  const a = given.age === null || given.age === undefined || String(given.age).trim() === '' ? null : Number(String(given.age).trim());
  let stoppedWork = null, retireAge = null;
  if (m) {
    const p = MONTH_RE.exec(m);
    if (!p) return { ok: false, problem: 'notAMonth' };
    if (m <= month || m <= thisMonth) return { ok: false, problem: 'stopTooSoon' };
    stoppedWork = m;
    retireAge = ageOnDate({ ...ss, retired: false }, new Date(+p[1], +p[2], 0), now);   // the age reached by the month's last day (About)
  } else if (a != null) {
    if (!Number.isInteger(a) || a > WORKING_MAX_AGE) return { ok: false, problem: 'notAnAge' };
    if (!(a > ageNow)) return { ok: false, problem: 'stopAgeTooSoon' };
    const at = retirementMonth(ss, a, now);
    if (!at || at <= month || at <= thisMonth) return { ok: false, problem: 'stopAgeTooSoon' };
    retireAge = a;
  } else return { ok: false, problem: 'noStop' };
  const t = deriveTiming({ ...ss, retired: false, retireAge, stoppedWork }, now);
  if (t.mode !== 'future') return { ok: false, problem: 'noAge' };
  const endAge = (+ss.shapeAgeNow > 0 ? +ss.shapeAgeNow : deriveTiming(ss, now).shapeAgeNow) + Math.max(1, +ss.duration || 35) - 1;
  if (endAge - t.shapeAgeNow + 1 < WORKING_MIN_YEARS) return { ok: false, problem: 'stopTooLate' };
  return { ok: true, stoppedWork, retireAge, firstTaxYear: t.firstTaxYear, shapeAgeNow: t.shapeAgeNow, startMonth: t.startMonth, endAge };
}

/**
 * The saving spell's own keys, laid over a new plan made the way a new plan is (successorOf): not retired, the second stop,
 * its year 0 and start age as the timing derives them for a saver, the length that keeps the closed plan's last age, the pots
 * at the stop projected as the planner's Save projects a saver's (PlanTiming.projectedPotAtRetirement, from the Accumulation
 * figures below); the budget's copy of the ages; and the Accumulation planner's figures to start from — the age today, the
 * age it stops at and the pension pot today — with this month's pot record from the pots given, once the spell has begun
 * (a change-over still to come has no month of its own yet). Nothing is guessed of what goes in: "What you pay in" asks it.
 * The plan's record of the answer it was kept from describes the spell before, so it is not carried.
 */
function workingSettings(data, w, given, { month, now }) {
  const st = data.stressTool.settings;
  const ageNow = ageOnDate(st, now, now);
  const ss = { ...st, retired: false, retireAge: w.retireAge, stoppedWork: w.stoppedWork, firstTaxYear: w.firstTaxYear, shapeAgeNow: w.shapeAgeNow,
    duration: Math.max(WORKING_MIN_YEARS, w.endAge - w.shapeAgeNow + 1) };
  const acc = { currentAge: ageNow, retirementAge: w.retireAge, potNow: r0(given.pension) };
  const projected = projectedPotAtRetirement(ss, acc, now);
  ss.potAtRetirement = { sipp: projected.sipp, isa: projected.isa, source: 'accumulation' };
  data.stressTool = { ...data.stressTool, settings: ss };
  if (isObj(data.decisionTool)) {
    data.decisionTool = { ...data.decisionTool, settings: { ...data.decisionTool.settings, firstTaxYear: w.firstTaxYear, shapeAgeNow: w.shapeAgeNow, duration: ss.duration } };
  }
  if (data.budgetTool && isObj(data.budgetTool.settings)) data.budgetTool = { ...data.budgetTool, settings: { ...data.budgetTool.settings, retired: false, retirementAge: w.retireAge } };
  const thisMonth = monthKeyOf(now);
  const rec = thisMonth >= month ? potRecordOf({ date: thisMonth, sipp: r0(given.pension), isa: r0(given.isa), gia: r0(given.gia) }, now) : null;
  data.accumulationTool = { settings: acc, history: rec ? [rec] : [] };
  if (Array.isArray(data.enabledTools) && !data.enabledTools.includes('accumulation')) data.enabledTools = [...data.enabledTools, 'accumulation'];
  delete data.fromAnswer;
  return data;
}

/** The Decision copy's lock record and the position a lock recorded: a new plan has never been locked. */
const LOCK_RECORD = ['locked', 'lockedAt', 'lockedBy', 'unlockedAt', 'unlockCount', 'lockedPosition'];

/**
 * The new plan, ready to create (no id, no stamps): the module note, step 1.
 * @param {object} plan  the old plan, as read (normalised and upgraded)
 * @param {{ month: string, name: string, now: Date, pots?: object|null, keepPartner?: boolean, reason?: string, stop?: object|null }} o
 *   `month` the change-over month (one of closeOfferOf's choices); `name` the new plan's name (made unique by the caller);
 *   `pots` what is held today when the plan has no holdings record ({ pension, isa, gia }; heldPotsOf's when it has one);
 *   `keepPartner` the partner link follows the new plan (decision 11; asked); `reason` 'plan' (a new plan) or 'working'
 *   (back to work: a saving spell), with `stop` the second stop, { month } or { age } (workingStopOf); `plans` the plans at
 *   hand, so money taken flexibly on a plan before this one is carried too (FlexibleAccess.carriedFlexibleAccess)
 */
export function successorOf(plan, { month, name, now, pots = null, keepPartner = true, reason = 'plan', stop = null, plans = [] }) {
  if (!(now instanceof Date)) throw new Error('successorOf: the moment comes in as `now`');
  if (!CLOSE_REASONS.includes(reason)) throw new Error('successorOf: ' + reason + ' is not a reason to close a plan');
  const offer = closeOfferOf(plan, now);
  if (!offer) throw new Error('successorOf: this plan is not offered a move to a new plan');
  if (!offer.choices.includes(month)) throw new Error('successorOf: ' + month + ' is not a month this plan can move from');
  const w = reason === 'working' ? workingStopOf(plan, { month, stop, now }) : null;
  if (w && !w.ok) throw new Error('successorOf: the second stop is not one the plan can take (' + w.problem + ')');
  // the figures the person gave (the question's boxes, filled in from closePotsOf); the pension in the mix it came with when
  // it was left as filled in (potsSettings keeps a split only when it adds up to the pension), else in the plan's own mix
  const filled = closePotsOf(plan);
  if (pots && num(pots.pension) == null) throw new Error('successorOf: no pension pot given');
  const given = pots ? { pension: r0(pots.pension), isa: r0(pots.isa), gia: r0(pots.gia), split: filled.split } : filled;
  // year 0: the change-over month's tax year for a new plan; for a saving spell, the tax year it stops in again
  const to = w ? w.firstTaxYear : taxYearOfMonth(month);
  const k = to - offer.from;
  // the copy's own rules (PlanCopy.copyOf): a draft, what you hold carried, no document, record or archive — made from the plan
  // with nothing recorded and no tax year set up, so it is never a copy "with records" (which would be locked)
  const dt = isObj(plan.decisionTool) ? plan.decisionTool : null;
  const bare = { ...plan, ...(dt ? { decisionTool: { ...dt, history: [], taxYears: {} } } : {}) };
  const data = copyOf(bare, name, { carryHistory: false, now });
  // the copy carries none of the close's links (PlanCopy.copyOf); the tick-offs and the journey are the old plan's
  for (const key of ['transition', 'journey']) delete data[key];
  if (!keepPartner && data.household) { const { partnerScenarioId, splitDismissed, ...rest } = data.household; void partnerScenarioId; void splitDismissed; data.household = rest; }
  const potKeys = potsSettings(settingsOf(plan, 'stress'), given);
  const st = isObj(data.stressTool) ? data.stressTool : {};
  const ss = { ...successorSettings(st.settings, k, to, 'stress'), ...potKeys };
  delete ss.staleDraftDismissedFor; delete ss.stopMonthLeft;
  data.stressTool = { ...st, settings: ss };
  if (isObj(data.decisionTool)) {
    // the Decision copy takes the new pots only where it holds them (a lock seeds the rest from the Stress copy)
    const d0 = successorSettings(data.decisionTool.settings, k, to, 'decision');
    const ds = { ...d0, ...Object.fromEntries(Object.entries(potKeys).filter(([key]) => key in d0)) };
    for (const key of LOCK_RECORD) delete ds[key];
    ds.locked = false;
    data.decisionTool = { ...data.decisionTool, settings: ds, history: [], taxYears: {} };
  }
  // the person's facts every close carries (CARRIED_FACTS): money taken from a pension flexibly, when it has been — on this
  // plan, or on a plan before it among `plans` (one an earlier move made, which may carry nothing of its own)
  delete data.flexibleAccess;
  const fa = carriedFlexibleAccess(plan, plans);
  if (fa) data.flexibleAccess = fa;
  if (w) workingSettings(data, w, given, { month, now });
  data.previousPlanId = String(plan.id);
  data.before = w ? { kind: 'working', from: month } : { kind: 'plan', planId: String(plan.id), from: month };
  const stage = deriveStage(data, now);
  const note = w ? 'Back to work from ' + monthWordsOf(month) + ': made from ‘' + planNameOf(plan) + '’, which closed at the end of ' + monthWordsOf(monthBefore(month)) + '.'
    : 'Made from ‘' + planNameOf(plan) + '’, which closed at the end of ' + monthWordsOf(monthBefore(month)) + '.';
  data.journey = [{ stage: stage.key, label: stage.label, at: now.toISOString(), note }];
  return data;
}

/**
 * The close's write on the old plan (the module note, step 2): `closedAt`, the month before the change-over month, and
 * `nextPlanId`; with the lock's flags too on a plan that is not locked — and, as every lock that writes no plan document
 * records (PlanLock.lockPlanIfNeeded), where its pots stood that day (`lockedPosition`, PlanFromToday.lockPositionOf). An
 * unlocked plan lived on for some years is seen from today, its pots today's; locked with no position it would be read from
 * year 0 on those pots and live its past years again. With the position, its run is the same the day after the close as the
 * day before. Null is written too, so a position left by an earlier lock never comes back. Dotted field paths.
 */
export function closeWrite(plan, { month, nextPlanId, now, reason = 'plan' }) {
  const out = { closedAt: monthBefore(month), nextPlanId: String(nextPlanId) };
  if (!settingsOf(plan, 'decision').locked) {
    let position = null;
    try { position = lockPositionOf(effectiveStressSettings(plan, { now }), now, plan); } catch (e) { position = null; }
    out['decisionTool.settings.locked'] = true;
    out['decisionTool.settings.lockedAt'] = now.toISOString();
    out['decisionTool.settings.lockedBy'] = reason === 'working' ? 'closed when going back to work' : 'closed when moving to a new plan';
    out['decisionTool.settings.lockedPosition'] = position;
  }
  return out;
}

/**
 * The partner's plan re-pointed to the new plan (decision 11), when the person says so: its link, and — when it reads its
 * budget from the old plan — the budget too ("shared forward"). The household's lines travelled with the copy. Null when the
 * partner's plan is not linked to the old one.
 */
export function partnerWrites(partner, { oldId, newId }) {
  if (!isObj(partner)) return null;
  const linked = partnerIdOf(partner) === String(oldId);
  const shared = !!(partner.budgetTool && partner.budgetTool.sharedFrom === String(oldId));
  if (!linked && !shared) return null;
  return { ...(linked ? { 'household.partnerScenarioId': String(newId) } : {}), ...(shared ? { 'budgetTool.sharedFrom': String(newId) } : {}) };
}

/** The new plan's default name: "{old name} from {month}"; going back to work, "{old name}, back to work from {month}". */
export const successorName = (plan, month, reason = 'plan') => (planNameOf(plan) || 'My plan') + (reason === 'working' ? ', back to work from ' : ' from ') + monthWordsOf(month);

/**
 * The partner's plan linked with this one, either way (V7's household.partnerOf reads it so): this plan's own link, else a
 * plan whose link — or whose shared budget — points at this one. Never a closed plan. Null when none is here.
 */
export function linkedPartnerOf(plan, list) {
  const id = plan && plan.id != null ? String(plan.id) : null;
  const others = (Array.isArray(list) ? list : []).filter((p) => isObj(p) && p.id != null && String(p.id) !== id && !isClosedPlan(p));
  const pid = partnerIdOf(plan);
  return (pid && others.find((p) => String(p.id) === pid)) || others.find((p) => partnerIdOf(p) === id || (p.budgetTool && p.budgetTool.sharedFrom === id)) || null;
}

/** Where each pot of the question came from, in words: "What you hold (8 November 2024) for the ISAs; …" (both apps). */
export function potsFromWords(pots) {
  const names = { pension: 'the pension', isa: 'the ISAs', gia: 'the ordinary investment account' };
  const day = (v) => { const m = /^(\d{4})-(\d{2})(?:-(\d{2}))?/.exec(String(v || '')); return m ? (m[3] ? (+m[3]) + ' ' : '') + monthWordsOf(m[1] + '-' + m[2]) : ''; };
  const what = (k) => pots.from[k] === 'holdings' ? 'What you hold' + (pots.asOf[k] ? ' (' + day(pots.asOf[k]) + ')' : '')
    : pots.from[k] === 'record' ? 'your record for ' + day(pots.asOf[k]) : 'this plan’s own figure';
  const groups = [];
  for (const k of ['pension', 'isa', 'gia']) { const w = what(k); const g = groups.find((x) => x.w === w); if (g) g.ks.push(names[k]); else groups.push({ w, ks: [names[k]] }); }
  const and = (xs) => (xs.length > 1 ? xs.slice(0, -1).join(', ') + ' and ' + xs[xs.length - 1] : xs[0]);
  return groups.length === 1 ? groups[0].w + ' for every pot' : groups.map((g) => g.w + ' for ' + and(g.ks)).join('; ');
}

/**
 * Everything the close's question says, worked out (both apps draw it in their own words): the months, the suggested one,
 * the tax year each starts, the pots and where they came from (always asked, filled in), the partner's plan linked with this
 * one either way (when present in `plans`), and the counts of what stays.
 */
export function closeQuestionOf(plan, { now, plans = [] }) {
  const offer = closeOfferOf(plan, now);
  if (!offer) return null;
  const list = (Array.isArray(plans) ? plans : []).map((e) => (e && e.plan ? e.plan : e)).filter(isObj);
  const partner = linkedPartnerOf(plan, list);
  const pots = closePotsOf(plan);
  const hist = plan.decisionTool && Array.isArray(plan.decisionTool.history) ? plan.decisionTool.history : [];
  const fa = carriedFlexibleAccess(plan, list);
  return {
    ...offer,
    // back to work: the money taken flexibly the new plan will carry (said in the question), and the age today the stop is asked from
    flexibleAccess: fa ? { since: fa.since, month: monthWordsOf(fa.since) } : null,
    name: planNameOf(plan),
    months: offer.choices.map((m) => ({ month: m, words: monthWordsOf(m), taxYear: taxYearOfMonth(m) })),
    // always asked, in boxes filled in as closePotsOf has them: the person says what they hold today
    pots,
    potsFrom: potsFromWords(pots),
    asked: true,
    held: !!heldPotsOf(plan),
    partner: partner ? { id: String(partner.id), name: planNameOf(partner) } : null,
    records: hist.length
  };
}
