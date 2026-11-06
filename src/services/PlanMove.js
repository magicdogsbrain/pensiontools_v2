/**
 * Move a locked plan's start to the tax year work stopped (research/plan-start.md §2 C, §4 "Migration of existing plans",
 * §6 decisions 4–7 and 12).
 *
 * Until 6.51.0 a retiree's plan started next April, and the months until then were "before the plan's income starts".
 * Someone who locked such a plan, and has since said when they stopped work (earlier than that start), has lived on the
 * plan from the stop: its year 0 is the tax year they stopped in. A draft moves by its ordinary Save. A locked plan is never
 * changed by a Save, a load or a migration (LockedPlanGuard.js; storage/migrations.js), so this is one deliberate,
 * confirmed action, made under the lock: the plan stays locked and is moved, never unlocked — an unlock would give a plan
 * locked before a setting existed that setting's default (PlanCommit.unlockPatchesOf) and count an unlock.
 *
 * What a move changes, and nothing else (answers/plan/moveStart.js movePatch puts it in ONE write; the guard's `reAnchor`
 * allowance, reAnchorAllowance below, lets exactly that through):
 *  - Year 0, in both copies — the Stress settings' and the Decision settings', which the Decision tool prefers
 *    (PlanTiming.decisionAnchorYear) — to the same tax year, the stop's.
 *  - Every figure the plan counts from year 0, so that each keeps its tax year and its age (reAnchorCopy): the age the
 *    income starts at and the plan's length (the plan still ends at the same age), the first income step's amount, which
 *    now also pays the years from the stop's tax year while every step keeps its age and its slope (§6 decision 4), the
 *    income by year the engines read, the dated figures — a final-salary pension, the State Pension by year (only where no
 *    date is given), income streams, one-off spends and lump sums — and the counts of years from year 0: a phased (UFPLS)
 *    start, a gilt ladder's or Bridge & engine's cash years, Ladder & ratchet's ladder years (in the settings, every way's
 *    stash, and the plan's strategy block, which the Decision tool's month reads first).
 *  - Where the pots stood when the plan was locked, counted from the new year 0 (`lockedPosition`, PlanFromToday.js): the
 *    pots in a locked plan's settings are the pots of the day it was locked, so a plan whose new year 0 is behind that day
 *    is run from there, as seen from that day, and never buys a year it has lived.
 *  - The recorded months: kept, figure for figure, and re-stamped as months of this plan (§6 decision 6); only the fields
 *    that name the old year 0 are rewritten (reAnchorRecords).
 *  - The plan document and the plan of record: archived and written again (the move's caller runs the strategy).
 *  - One journey entry.
 * `unlockCount` stays as it is.
 *
 * Pure: no storage, no DOM, no clock (`now` is handed in).
 */
import { stoppedWorkOf, taxYearOfMonth, hasStopped, planYearOf, taxYearLabel, monthName, deriveTiming, taxYearStartOf } from './PlanTiming.js';
import { parseStatePensionDate } from '../utils/StatePensionUtils.js';
import { compileSteps, cleanSteps, amountAtAge, smileToSteps, defaultSpYear } from './IncomeSchedule.js';
import { spendingSmileFactor } from './SpendingModel.js';
import { lockPositionOf, COUNTS_FROM_YEAR0, planYearsOf } from './PlanFromToday.js';
import { beforeOf } from './PlanClosed.js';
import { decisionSettingsChecksum } from './PlanCommit.js';

const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const num = (v) => (v === null || v === undefined || v === '' || !Number.isFinite(+v) ? null : +v);
function sortKeys(v) {
  if (Array.isArray(v)) return v.map(sortKeys);
  if (isObj(v)) return Object.keys(v).sort().reduce((o, k) => { if (v[k] !== undefined) o[k] = sortKeys(v[k]); return o; }, {});
  return v;
}
/** Text for a value, key order not counted (Firestore hands objects back in its own order); undefined is "absent". */
const text = (v) => (v === undefined ? '<absent>' : JSON.stringify(sortKeys(v)));

/**
 * The keys a move rewrites in both copies besides year 0 (reAnchorCopy) — each one only as the move works it out. The
 * Stress copy also takes the month work stopped; the Decision copy the position its lock recorded.
 */
export const REANCHOR_KEYS = Object.freeze(['shapeAgeNow', 'duration', 'incomeShape', 'incomeSteps', 'targetSchedule', 'spendingProfile', 'spendingMigratedFrom', 'dbStartYear', 'statePensionYear', 'ufplsYears', 'strategyParams', 'strategyState', 'extraIncomes', 'extraWithdrawals', 'windfalls']);
export const REANCHOR_STRESS_KEYS = Object.freeze(['firstTaxYear', 'stoppedWork', ...REANCHOR_KEYS]);
export const REANCHOR_DECISION_KEYS = Object.freeze(['firstTaxYear', 'lockedPosition', ...REANCHOR_KEYS]);
/** The lock's own record, which a move never touches (it is not an unlock). */
const LOCK_RECORD = ['locked', 'lockedAt', 'lockedBy', 'unlockedAt', 'unlockCount'];

/**
 * One way's dials (`params`, its strategyParams) counted from a year 0 `k` years earlier: the same tax years. The dials that
 * count years from year 0, and what each counts when it is not set, are PlanFromToday.COUNTS_FROM_YEAR0 — the one table the
 * run seen from today reads too: a gilt ladder's cash years, Bridge & engine's cash years and Ladder & ratchet's ladder
 * years. An unset one is written as the count it gave, k more: Bridge & engine's 3, and Ladder & ratchet's ladder years as
 * worked out from the plan's length before the move (`duration`, the copy's saved one: PlanFromToday.ladderYearsFromYear0)
 * — the moved plan is longer, so left unset they would be worked out again from its new length and end in another year.
 */
function laterParams(id, params, k, duration) {
  const rule = COUNTS_FROM_YEAR0[id || 'pots-and-valves'];
  if (!rule) return params;
  const p = isObj(params) ? params : {};
  const out = { ...p };
  for (const [key, unset] of Object.entries(rule)) {
    if (num(p[key]) != null) out[key] = +p[key] + k;
    else if (unset != null) out[key] = (typeof unset === 'function' ? unset(planYearsOf(duration)) : unset) + k;
  }
  return out;
}
/** The per-way stashes (StrategyState: { [id]: { strategyParams, … } }), each way's dials moved by its own rule. */
function laterStashes(state, k, duration) {
  if (!isObj(state)) return state;
  const out = {};
  for (const [id, e] of Object.entries(state)) out[id] = isObj(e) && isObj(e.strategyParams) ? { ...e, strategyParams: laterParams(id, e.strategyParams, k, duration) } : e;
  return out;
}

/**
 * Where a ladder month recorded before the plan's income started under the old year 0 is said to have come from, once it
 * is a month of the plan: the cash the plan's first years are paid from (LadderPosition.ladderMonthAdvice's own label for a
 * cash year). It names no year, so it cannot go out of date when the start moves again.
 */
export const MOVED_SOURCE = 'the cash years bucket';
export const MOVED_NOTE = 'This month came from your cash; nothing was sold.';
/**
 * The words a month before the plan's income started was stamped with, saying where it was paid from: the run-up's (before
 * 6.51.0: "SIPP cash (the plan's year 0 is 2028/29)", "Run-up to your plan …") and a ladder month before the ladder's first
 * year (LadderPosition.ladderMonthAdvice). Only these name the old start; any other way of drawing's words (the essentials
 * rung, the engine, a matured rung) stay as they were.
 */
function runUpWords(h) {
  const src = typeof h.strategySource === 'string' ? h.strategySource : '', note = typeof h.strategyNote === 'string' ? h.strategyNote : '';
  return src.startsWith('SIPP cash (the plan') || note.startsWith('Run-up to your plan')
    || src === 'cash, before the ladder\'s first year' || note.startsWith('Before the ladder\'s first year');
}

const settingsOf = (scenario, kind) => {
  const t = scenario && scenario[kind === 'stress' ? 'stressTool' : 'decisionTool'];
  return t && isObj(t.settings) ? t.settings : {};
};
const lockedSettings = (ds) => !!(isObj(ds) && ds.locked);

/** The plan's year 0 as the Decision tool reads it: its own copy first, then the Stress copy; null when neither is saved. */
export function moveAnchorOf(stress, decision) {
  const d = num(decision && decision.firstTaxYear), s = num(stress && stress.firstTaxYear);
  return d > 0 ? d : s > 0 ? s : null;
}

/**
 * Has this locked retired plan not yet said when work stopped, and not been told "Leave it"? Then the planner's Timing block
 * and V7's About step ask, once (`stopMonthLeft` remembers "Leave it"). A plan that is not locked asks in its own form.
 * @param {object} scenario  the saved plan
 * @param {Date} now
 */
export function stopAskOf(scenario, now) {
  const ds = settingsOf(scenario, 'decision'), ss = settingsOf(scenario, 'stress');
  if (!lockedSettings(ds) || stoppedWorkOf(ss) || ss.stopMonthLeft === true) return false;
  return deriveTiming(ss, now).mode === 'retired';
}

/**
 * Has this locked retired plan been told "Leave it", and still not said when work stopped? It is not asked again, but the
 * month stays the person's to say (folded, "Say when you stopped work"): a locked plan could otherwise only say it by being
 * unlocked, which is what the move is there to spare.
 */
export function stopLeftOf(scenario, now) {
  const ds = settingsOf(scenario, 'decision'), ss = settingsOf(scenario, 'stress');
  if (!lockedSettings(ds) || stoppedWorkOf(ss) || ss.stopMonthLeft !== true) return false;
  return deriveTiming(ss, now).mode === 'retired';
}

/**
 * The month a locked retired plan says work stopped. It stays changeable under the lock (LockedPlanGuard's bookkeeping): a
 * month typed wrongly would otherwise be kept for good, and the move offered to the wrong tax year. Null when the plan says
 * none, is not locked, or is still to retire.
 */
export function stopChangeOf(scenario, now) {
  const ds = settingsOf(scenario, 'decision'), ss = settingsOf(scenario, 'stress');
  const stop = stoppedWorkOf(ss);
  if (!lockedSettings(ds) || !stop || ss.retired === false) return null;
  return deriveTiming(ss, now).mode === 'retired' ? stop : null;
}

/**
 * The move's parts on a locked plan that says when work stopped, earlier than its year 0; null otherwise (moveOfferOf).
 * Never on a closed plan (6.56.0, PlanClosed.js: kept as it was), nor on the plan that carries one on: its year 0 is the
 * change-over month's tax year, and the months before it — back to the stop — are the previous plan's.
 */
function moveParts(scenario, now) {
  const ds = settingsOf(scenario, 'decision'), ss = settingsOf(scenario, 'stress');
  if (!lockedSettings(ds) || ss.retired === false) return null;
  if (scenario && (scenario.closedAt != null || (beforeOf(scenario) || {}).kind === 'plan')) return null;
  const stop = stoppedWorkOf(ss);
  if (!stop || !hasStopped(stop, now)) return null;
  if (deriveTiming(ss, now).mode !== 'retired') return null;
  const from = moveAnchorOf(ss, ds), to = taxYearOfMonth(stop);
  if (!(from > to)) return null;
  return { ss, ds, stop, from, to };
}

/**
 * The move a locked plan is offered: it says when work stopped (a month that has come), and that tax year is earlier than
 * the plan's year 0. Null otherwise — every plan that does not say when work stopped, every plan whose income starts in the
 * tax year work stopped or earlier, every draft (its Save moves it), every plan still to stop, and a plan the move cannot
 * carry figure for figure (moveBlockedOf).
 * @returns {null | { stopMonth: string, from: number, to: number, years: number }}
 */
export function moveOfferOf(scenario, now) {
  const m = moveParts(scenario, now);
  if (!m || blockedMove(m.ss, m.ds, m.from, m.to)) return null;
  return { stopMonth: m.stop, from: m.from, to: m.to, years: m.from - m.to };
}

/**
 * A plan that would be offered the move but whose figures the move cannot keep: its State Pension, given as a plan year
 * with no date, would land on the year the planner reads as "at 67" (IncomeSchedule.defaultSpYear) — nothing then says
 * the year it starts in. Unlocking is the way to change its start. Null for every other plan.
 * @returns {null | { stopMonth: string, from: number, to: number, why: 'statePension' }}
 */
export function moveBlockedOf(scenario, now) {
  const m = moveParts(scenario, now);
  const why = m ? blockedMove(m.ss, m.ds, m.from, m.to) : null;
  return why ? { stopMonth: m.stop, from: m.from, to: m.to, why } : null;
}

/**
 * A locked retired plan stored the old way, read as ONE thing to do (both apps: the planner's next-step banner and the V7
 * plan home). Until 6.51.0 a retired person's plan started at the next April by default, and the months until then were
 * named instead of removed; nobody retired has months "before the plan", so such a plan is shown as what it is — a plan
 * whose start is later than it should be — and the person is asked to move it (the move above, after its own confirm;
 * never automatic, never on open). Nothing is written by this reading.
 *
 *  - `kind: 'move'`: the plan says when work stopped, and that tax year is earlier than the plan's year 0 (moveParts). The
 *    to-do opens the move; `blocked` says the move cannot keep the plan's figures under the lock (moveBlockedOf), so the
 *    place it opens explains that instead.
 *  - `kind: 'ask'`: the plan does not say when work stopped, and its year 0 is later than this tax year, or a recorded month
 *    still carries the old mark (`bridgeYear`). The to-do asks the month; once said, the move follows.
 * Null for every other plan: a draft (its own Save moves it), a saver, a closed plan, the plan that carries a closed one on
 * (its year 0 is a hand-over the old plan pays up to), a plan with no age (it has no tax year to read), and a locked plan
 * whose year 0 is the stop's tax year, this tax year, or earlier.
 * @returns {null | { kind: 'move'|'ask', start: number, stopMonth?: string, to?: number, blocked?: boolean }}
 */
export function startLaterOf(scenario, now = new Date()) {
  const ds = settingsOf(scenario, 'decision'), ss = settingsOf(scenario, 'stress');
  if (!lockedSettings(ds) || ss.retired === false) return null;
  if (scenario && (scenario.closedAt != null || (beforeOf(scenario) || {}).kind === 'plan')) return null;
  let t = null; try { t = deriveTiming(ss, now); } catch { t = null; }
  if (!t || t.mode !== 'retired') return null;
  const start = moveAnchorOf(ss, ds);
  if (!(start > 0)) return null;
  const m = moveParts(scenario, now);
  if (m) return { kind: 'move', start: m.from, stopMonth: m.stop, to: m.to, blocked: !!blockedMove(m.ss, m.ds, m.from, m.to) };
  const stop = stoppedWorkOf(ss);
  if (stop && hasStopped(stop, now)) return null;
  const hist = scenario && scenario.decisionTool && Array.isArray(scenario.decisionTool.history) ? scenario.decisionTool.history : [];
  const marked = hist.some((h) => h && h.bridgeYear === true);
  return start > taxYearStartOf(now) || marked ? { kind: 'ask', start } : null;
}

/** The years one copy moves back: from its own year 0, or the plan's when it has none saved. */
function yearsMoved(copy, from, to) {
  const own = num(copy && copy.firstTaxYear);
  return (own > 0 ? own : from) - to;
}

/** A dated income stream ({ startYear, endYear }) counted from a year 0 `k` years earlier: the same tax years. */
function laterStream(r, k) {
  if (!isObj(r)) return r;
  return { ...r, ...(num(r.startYear) != null ? { startYear: +r.startYear + k } : {}), ...(num(r.endYear) != null ? { endYear: +r.endYear + k } : {}) };
}
/** A dated spend or lump sum ({ year }) counted from a year 0 `k` years earlier. */
function laterOne(w, k) {
  return isObj(w) && num(w.year) != null ? { ...w, year: +w.year + k } : w;
}

/**
 * The income steps after a move (§6 decision 4): every step keeps its age and its slope, and the figure the income started at
 * under the old year 0 (`y0`) also pays the k years before it, so nothing from the old start on changes. A level step in
 * force at the old start simply starts k years younger. One that falls year by year, or moves evenly to the next, keeps its
 * slope where it was — moving its start would move the whole slope k years earlier — and a level step at `y0` goes in front
 * (a step that began before the old start is restated from there, at the figure it had reached). A step that had already
 * given way before the old start (it paid no year of the plan) is dropped when it would now fall inside it. With no step at
 * or before the old start, the plan's first years were paid at its yearly figure, and so are the new ones: nothing changes.
 */
function stepsAfterMove(steps, oldAge, newAge, y0) {
  const st = cleanSteps(steps);
  let i = -1;
  st.forEach((x, j) => { if (+x.fromAge <= oldAge) i = j; });
  if (i < 0) return steps;
  const cur = st[i], next = st[i + 1];
  const level = !(+cur.decline > 0) && !(cur.glideToNext && next);
  const head = level ? [{ ...cur, fromAge: Math.min(+cur.fromAge, newAge) }]
    : [{ fromAge: newAge, amount: y0 }, +cur.fromAge === oldAge ? cur : { ...cur, fromAge: oldAge, amount: y0 }];
  const out = [];
  for (const x of steps) {
    if (x === cur) out.push(...head);
    else if (!(st.includes(x) && +x.fromAge >= newAge && +x.fromAge <= oldAge)) out.push(x);
  }
  return out;
}

/**
 * The State Pension's year field after a move of `k` years, where it is read (no date with a weekly amount; an amount a
 * year): `{ value }`, `{ keep: true }` (as it is), or `{ blocked: true }` when no value keeps its tax year. The Decision copy
 * is read as the plan year it says (DrawdownService, the plan of record): k later. The Stress copy is read by
 * IncomeSchedule.defaultSpYear, for which 12, with a start age, is not a year but "at 67" (the planner's default): that
 * rule follows the start age, which the move moves, so it is kept; and a year that would become 12 would be read as "at
 * 67" — unless 67 falls in that very year, nothing can then say it.
 */
function spYearAfter(s, newAge, k, kind) {
  if ((s.spStartDate && +s.spWeeklyAmount > 0) || !(+s.statePension > 0) || num(s.statePensionYear) == null) return { keep: true };
  const v = +s.statePensionYear;
  if (kind !== 'stress') return { value: v + k };
  if (s.statePensionYear === 12 && +s.shapeAgeNow > 0) return { keep: true };
  if (v + k === 12 && +newAge > 0 && defaultSpYear({ statePensionYear: 12, shapeAgeNow: +newAge }) !== 12) return { blocked: true };
  return { value: v + k };
}

/**
 * A copy that still carries the old "Declining with age" profile (before 6.2.1), fixed as every reader fixes it on read —
 * the Stress copy into its steps and income by year (PlanReading.migrateStressSettings), the Decision copy into its income
 * by year (DecisionRepository; the guard's isDecliningBake). The profile counts its years from year 0, so read after a move
 * it would fall k years earlier; fixed first, at the old start, the move keeps its figures like any other step's.
 */
function withProfileFixed(s, kind) {
  if (s.spendingProfile !== 'declining') return s;
  if (kind === 'stress') {
    const ageNow = +s.shapeAgeNow || 57;
    const steps = (s.incomeShape === 'phases' && Array.isArray(s.incomeSteps) && s.incomeSteps.length) ? s.incomeSteps : [{ fromAge: ageNow, amount: +s.baseSalary || 0 }];
    const out = { ...s, incomeShape: 'phases', incomeSteps: smileToSteps(steps, ageNow), shapeAgeNow: ageNow };
    out.targetSchedule = compileSteps(out, ageNow);
    return { ...out, spendingProfile: 'flat', spendingMigratedFrom: 'declining' };
  }
  const ts = s.targetSchedule;
  return { ...s, targetSchedule: Array.isArray(ts) && ts.length ? ts.map((v, y) => Math.round((+v || 0) * spendingSmileFactor(y, 'declining'))) : ts, spendingProfile: 'flat', spendingMigratedFrom: 'declining' };
}

/** reAnchorCopy's work, and whether the State Pension's year could not be kept (spYearAfter). */
function reAnchorWork(settings, k, to, kind) {
  const s0 = isObj(settings) ? settings : {};
  if (!(k > 0)) return { out: { ...s0, firstTaxYear: to }, blocked: false };
  const s = withProfileFixed(s0, kind);
  const out = { ...s, firstTaxYear: to };
  const oldAge = num(s.shapeAgeNow) > 0 ? +s.shapeAgeNow : null;
  if (oldAge) out.shapeAgeNow = oldAge - k;
  if (num(s.duration) > 0) out.duration = +s.duration + k;
  if (oldAge && Array.isArray(s.incomeSteps) && s.incomeSteps.length) out.incomeSteps = stepsAfterMove(s.incomeSteps, oldAge, oldAge - k, amountAtAge(s.incomeSteps, oldAge, +s.baseSalary || 0));
  if (Array.isArray(s.targetSchedule) && s.targetSchedule.length) out.targetSchedule = [...Array(k).fill(s.targetSchedule[0]), ...s.targetSchedule];
  if (+s.dbAmount > 0 && num(s.dbStartYear) != null) out.dbStartYear = +s.dbStartYear + k;
  const sp = spYearAfter(s, out.shapeAgeNow, k, kind);
  if (sp.value != null) out.statePensionYear = sp.value;
  if (s.accessMethod === 'ufpls' && num(s.ufplsYears) > 0) out.ufplsYears = +s.ufplsYears + k;
  if (COUNTS_FROM_YEAR0[s.strategyId || 'pots-and-valves']) out.strategyParams = laterParams(s.strategyId, s.strategyParams, k, s.duration);
  if (isObj(s.strategyState)) out.strategyState = laterStashes(s.strategyState, k, s.duration);
  if (Array.isArray(s.extraIncomes)) out.extraIncomes = s.extraIncomes.map((r) => laterStream(r, k));
  if (Array.isArray(s.extraWithdrawals)) out.extraWithdrawals = s.extraWithdrawals.map((w) => laterOne(w, k));
  if (Array.isArray(s.windfalls)) out.windfalls = s.windfalls.map((w) => laterOne(w, k));
  return { out, blocked: !!sp.blocked };
}

/**
 * One copy of the settings (Stress or Decision, `kind`) with its year 0 moved `k` tax years earlier, to `to`, and every
 * figure counted from year 0 moved with it so that it keeps its tax year and its age (the module note). Clock-free, so the
 * guard can work it out again from the plan as stored. `k` 0: only year 0 is written.
 *  - an old "Declining with age" profile is fixed first, at the old start (withProfileFixed);
 *  - shapeAgeNow: the age reached in the new year 0 (k fewer); duration: k more, so the plan ends at the same age;
 *  - incomeSteps: every step's age and slope kept, the starting figure paying the new years (stepsAfterMove);
 *  - targetSchedule (the income by year every engine reads, the saved one winning over the steps): its first figure k more
 *    times in front, so every year from the old start on is the figure it was, byte for byte;
 *  - dbStartYear (with a final-salary pension), statePensionYear (spYearAfter), ufplsYears (a phased start), the ways'
 *    counts of years (laterParams: strategyParams and every stash in strategyState), extraIncomes, extraWithdrawals,
 *    windfalls: k later, the same tax years.
 */
export function reAnchorCopy(settings, k, to, kind = 'stress') {
  return reAnchorWork(settings, k, to, kind).out;
}

/** Can the move not keep the plan's figures (spYearAfter)? 'statePension', else null. */
function blockedMove(ss, ds, from, to) {
  return reAnchorWork(ss, yearsMoved(ss, from, to), to, 'stress').blocked || reAnchorWork(ds, yearsMoved(ds, from, to), to, 'decision').blocked ? 'statePension' : null;
}

/**
 * The plan's strategy block (ScenarioRepository.setActiveStrategy: { id, params, … }) after a move of `k` years: its dials
 * counted from year 0 moved, as in the settings, when it is the block the plan reads — the Decision tool's month reads its
 * params over the settings' (index.html decisionStrategyOverlay; ScenarioRepository.strategyOf). `duration`: the Stress
 * copy's saved duration before the move, which an unset ladder's years are worked out from (laterParams). Any other block
 * as it is.
 */
export function strategyBlockAfterMove(block, strategyId, k, duration) {
  const id = strategyId || 'pots-and-valves';
  if (!isObj(block) || block.id !== id || !COUNTS_FROM_YEAR0[id] || !(k > 0)) return block;
  return { ...block, params: laterParams(id, block.params, k, duration) };
}

/**
 * Where the pots of a locked plan stood under its moved year 0: the day it was locked (its pots are that day's), read with
 * the moved Stress settings (PlanFromToday.lockPositionOf). Null when that day comes before the new year 0's months — the
 * plan then runs from year 0, as every plan locked before its start does — or when the lock is not dated.
 */
export function positionAfterMove(stressMoved, lockedAt) {
  const d = lockedAt ? new Date(lockedAt) : null;
  if (!d || !Number.isFinite(d.getTime())) return null;
  return lockPositionOf(stressMoved, d);
}

/** Was the plan unlocked and saved since this record was made (PlanLock.planDependents' own rule)? */
const underPrevious = (h, ds, cur) => (+ds.unlockCount || 0) > 0 && h.settingsChecksum !== undefined && h.settingsChecksum !== cur;

/**
 * The recorded months after a move to year 0 `to` (§4 steps 3 and 4). Each keeps every figure, date and tax year; only what
 * names the old year 0 is rewritten:
 *  - `yearNum`: the record's plan year from the new year 0 (0 for a month still before it, as the engine stamps it);
 *  - a month stamped as before the plan's income started (`bridgeYear`) that is now a month of the plan loses the mark and the
 *    year it named (`planStartYear`), and when its words about where it was paid from are the run-up's (strategySource,
 *    strategyNote: runUpWords) they are replaced by words that name no year (MOVED_SOURCE, MOVED_NOTE) — any other words
 *    stay byte for byte; a month still before the new year 0 keeps the mark and names the new year;
 *  - `settingsChecksum`: the record was made under this plan, only its count of years moved, so it is stamped with the
 *    moved settings' checksum — except a record made under settings the plan was unlocked from (it stays as it was, still
 *    "recorded under previous settings"), and a record with no stamp (read as this plan's already).
 * @param {object[]} history
 * @param {{ to: number, decisionBefore: object, decisionAfter: object }} o
 */
export function reAnchorRecords(history, { to, decisionBefore, decisionAfter }) {
  const before = isObj(decisionBefore) ? decisionBefore : {};
  const cur = decisionSettingsChecksum(before), next = decisionSettingsChecksum(decisionAfter || {});
  return (Array.isArray(history) ? history : []).map((h) => {
    if (!isObj(h)) return h;
    const out = { ...h };
    const at = typeof h.taxYear === 'string' && h.taxYear ? h.taxYear : (typeof h.date === 'string' ? h.date.slice(0, 7) : null);
    const y = at ? planYearOf(at, to) : NaN;
    if (Number.isFinite(y)) {
      out.yearNum = Math.max(0, y);
      if (h.bridgeYear === true && y >= 0) {
        delete out.bridgeYear; delete out.planStartYear;
        if (runUpWords(h)) {
          if (h.strategySource != null) out.strategySource = MOVED_SOURCE;
          if (h.strategyNote != null) out.strategyNote = MOVED_NOTE;
        }
      } else if (h.bridgeYear === true) out.planStartYear = to;
    }
    if (h.settingsChecksum !== undefined && !underPrevious(h, before, cur)) out.settingsChecksum = next;
    return out;
  });
}

/**
 * The move worked out on the plan as stored: both copies of the settings as they will be saved, where the pots stood, the
 * recorded months, and the plan's strategy block (as stored when the move leaves it alone). Null when the plan is not
 * offered one (moveOfferOf).
 * @returns {null | { stopMonth, from, to, years, stress, decision, position, history, strategy }}
 */
export function planMoveOf(scenario, now) {
  const offer = moveOfferOf(scenario, now);
  if (!offer) return null;
  const ss = settingsOf(scenario, 'stress'), ds = settingsOf(scenario, 'decision');
  const stress = { ...reAnchorCopy(ss, yearsMoved(ss, offer.from, offer.to), offer.to, 'stress'), stoppedWork: offer.stopMonth };
  const position = positionAfterMove(stress, ds.lockedAt);
  const decision = { ...reAnchorCopy(ds, yearsMoved(ds, offer.from, offer.to), offer.to, 'decision'), lockedPosition: position };
  const dt = scenario && scenario.decisionTool;
  const history = reAnchorRecords(dt && dt.history, { to: offer.to, decisionBefore: ds, decisionAfter: decision });
  const strategy = strategyBlockAfterMove(scenario && scenario.strategy, ss.strategyId, offer.from - offer.to, ss.duration);
  return { ...offer, stress, decision, position, history, strategy };
}

/**
 * The guard's `reAnchor` allowance (LockedPlanGuard.lockedPlanWriteRefusal): is the change from `before` to `after` (each
 * { stress, decision, strategy }, the settings and the strategy block as stored and as they would stand) exactly a move of
 * this locked plan's start? Then the keys each copy may change (and whether the strategy block does), else null. Exactly:
 * the plan locked before and after with its lock record untouched, and not saying it is still to retire; the Stress copy
 * saying a month work stopped; BOTH copies of year 0 moved to that month's tax year, earlier than the year 0 they had; every
 * key the move rewrites (REANCHOR_KEYS) at exactly the value reAnchorCopy works out from the copy as stored, and a move it
 * can work out (moveBlockedOf); the Decision copy's `lockedPosition` exactly where the lock's day stands under the new
 * year 0; and the strategy block as it was or exactly as strategyBlockAfterMove moves it. Clock-free, it does not ask
 * whether the month work stopped has come: the offer does (moveOfferOf), and nothing else sends this write.
 * @returns {null | { stress: string[], decision: string[], strategy: boolean }}
 */
export function reAnchorAllowance(before, after) {
  const s0 = isObj(before && before.stress) ? before.stress : {}, d0 = isObj(before && before.decision) ? before.decision : {};
  const s1 = isObj(after && after.stress) ? after.stress : null, d1 = isObj(after && after.decision) ? after.decision : null;
  if (!s1 || !d1 || !lockedSettings(d0) || !lockedSettings(d1) || s0.retired === false) return null;
  if (LOCK_RECORD.some((k) => text(d0[k]) !== text(d1[k]))) return null;
  const stop = stoppedWorkOf(s1);
  if (!stop || s1.stoppedWork !== stop) return null;
  const to = taxYearOfMonth(stop);
  if (num(s1.firstTaxYear) !== to || num(d1.firstTaxYear) !== to) return null;
  const from = moveAnchorOf(s0, d0);
  if (!(from > to)) return null;
  const ws = reAnchorWork(s0, yearsMoved(s0, from, to), to, 'stress'), wd = reAnchorWork(d0, yearsMoved(d0, from, to), to, 'decision');
  if (ws.blocked || wd.blocked) return null;
  if (REANCHOR_KEYS.some((k) => text(s1[k]) !== text(ws.out[k]) || text(d1[k]) !== text(wd.out[k]))) return null;
  if (text(d1.lockedPosition ?? null) !== text(positionAfterMove(s1, d0.lockedAt))) return null;
  // the plan's strategy block: as it was, or exactly as the move moves it
  const b0 = before ? before.strategy : undefined, b1 = after ? after.strategy : undefined;
  const strategy = text(b1) !== text(b0);
  if (strategy && text(b1) !== text(strategyBlockAfterMove(b0, s0.strategyId, from - to, s0.duration))) return null;
  return { stress: REANCHOR_STRESS_KEYS.slice(), decision: REANCHOR_DECISION_KEYS.slice(), strategy };
}

/** The journey entry a move adds (§4 step 6): the stage it leaves the plan in, the new start in words, and why. */
export function moveJourneyEntry(move, stageKey, now) {
  return {
    stage: stageKey,
    label: 'The plan’s start moved to ' + taxYearLabel(move.to) + ', the tax year you stopped work',
    at: now.toISOString(),
    note: 'You stopped work in ' + monthName(move.stopMonth) + '; the plan’s income had been set to start in ' + taxYearLabel(move.from) + '. The plan document and plan vs actual were written again from the new start; the earlier ones are kept.'
  };
}

/**
 * The State Pension's start, before and after a move, in the plan's count of years: its tax year (by date, or the year field
 * as the planner reads it: IncomeSchedule.defaultSpYear) and the plan year that is from each start. Null with no State
 * Pension, or one already paid before the new start.
 * @param {object} before  the Stress settings as stored
 * @param {object} after   as the move leaves them
 */
export function spCountOf(before, after) {
  const b = before || {}, a = after || {};
  let ty = null;
  const d = b.spStartDate && +b.spWeeklyAmount > 0 ? parseStatePensionDate(b.spStartDate) : null;
  if (d) ty = taxYearStartOf(d);
  else if (+b.statePension > 0 && +b.firstTaxYear > 0) ty = +b.firstTaxYear + defaultSpYear(b);
  if (!(ty > 0) || !(+a.firstTaxYear > 0) || ty < +a.firstTaxYear) return null;
  return { taxYear: ty, before: +b.firstTaxYear > 0 ? ty - +b.firstTaxYear : null, after: ty - +a.firstTaxYear };
}

/** The ways of drawing that buy a gilt ladder: the move's confirm names the tax year the ladder is bought from for them. */
const LADDER_WAYS = ['full-il-gilt', 'gilt-rotation', 'floor-the-schedule'];

/**
 * What the move's confirm says, as figures (6.55.0: one set for the planner's confirm, src/ui/planStartUi.js
 * moveStartQuestion, and the preview's, answers/plan/about.js lockedStartOf), read from the plan as stored and the move
 * (planMoveOf): the first income step's amount (or the yearly income) and whether the income is in steps, the age the plan
 * still ends at, the recorded months and how many of them stop being marked as before the plan's income starts, the tax
 * year the run starts in, whether the way of drawing buys a gilt ladder, whether the plan has dated figures (lump sums,
 * one-off spends, other income, a final-salary pension) that keep their tax years, and the State Pension's count
 * (spCountOf).
 * @returns {{ stepAmount: number|null, stepped: boolean, endAge: number|null, months: string[], bridged: number,
 *   runYear: number, ladder: boolean, dated: boolean, sp: object|null }}
 */
export function moveFactsOf(scenario, move) {
  const st = move.stress;
  const steps = cleanSteps(st.incomeSteps), stepped = st.incomeShape === 'phases' && steps.length > 0;
  const history = scenario && scenario.decisionTool && Array.isArray(scenario.decisionTool.history) ? scenario.decisionTool.history : [];
  const bridgedIn = (list) => (Array.isArray(list) ? list : []).filter((h) => h && h.bridgeYear === true).length;
  return {
    stepAmount: stepped ? +steps[0].amount : (+st.baseSalary || null), stepped,
    endAge: +st.shapeAgeNow > 0 && +st.duration > 0 ? +st.shapeAgeNow + +st.duration - 1 : null,
    months: history.map((h) => String((h && h.date) || '').slice(0, 7)).filter(Boolean),
    bridged: bridgedIn(history) - bridgedIn(move.history),
    runYear: move.to + (move.position ? move.position.elapsedYears : 0),
    ladder: LADDER_WAYS.includes(st.strategyId || 'pots-and-valves'),
    dated: [st.windfalls, st.extraWithdrawals, st.extraIncomes].some((l) => Array.isArray(l) && l.length) || +st.dbAmount > 0,
    sp: spCountOf(scenario && scenario.stressTool && scenario.stressTool.settings, st)
  };
}
