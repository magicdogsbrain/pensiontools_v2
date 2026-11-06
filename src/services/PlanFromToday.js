/**
 * The plan as seen from today (research/plan-start.md §1, §3; 6.50.0).
 *
 * Every engine runs from ITS year 0 on the pots it is handed. A plan whose year 0 is behind it — someone who stopped
 * work some tax years ago and has drawn the plan since — has already lived the plan years before the current one, and the
 * pots entered today are today's, not year 0's. Running it from year 0 again buys the years already lived a second
 * time, from a pot that has already paid them. So the engines are handed the plan as it stands on the day of its pots
 * instead: the years lived by then (`elapsedYears`: which day, below) taken off the front — the income schedule sliced, the State
 * Pension, final-salary pension, income streams, one-off spends and lump sums moved that many years earlier (a lump sum
 * that has already arrived is in the pot and dropped; a stream or a spend wholly past is dropped), the horizon shortened,
 * a phased (UFPLS) start that is over ended, the bond tent read from the plan year it has reached, and the counts of years a
 * way of drawing gives from year 0 (COUNTS_FROM_YEAR0: a gilt ladder's and Bridge & engine's cash years, Ladder & ratchet's
 * ladder years) read as the years left of them (6.55.0) — and the run starts at the age reached this tax year
 * (stressTest.planFromSettings). Results then carry `yearOffset`, so the document, the
 * where-am-I strip, Month by month and the household place a run's year k at plan year yearOffset + k.
 *
 * Which day the pots belong to. The pots in the settings are the pots on the day they were entered, and the plan is seen
 * from that day — which the settings alone cannot tell, so the readers that hand a plan's settings to the engines
 * (PlanReading.effectiveStressSettings; StressRepository's load, for the planner) say it, as `potsAsOf` (potsAsOfFor):
 *  - a draft whose year 0 is behind it: 'today'. A draft is edited and its pots kept current with it (research/
 *    plan-start.md §6, decision 3), so it is seen from today: deriveTiming's elapsedYears and monthsIntoYear, read on the
 *    engine's own clock at every run, from the settings' own year 0.
 *  - a locked plan run from a later plan year than its year 0: that position, { elapsedYears, monthsIntoYear }, from the
 *    plan document its lock made (`pots.asOfPlanYear`, its timing's `monthsIntoYear`). A locked plan's settings — its pots
 *    among them — are frozen at the lock, so it is seen from where it stood that day, on every day it is read, and moves
 *    only when its pots are entered again (research/plan-start.md §4, "Move the plan's start").
 *  - a plan that says when work stopped (6.51.0) whose pots' day is in its year 0, after that year's 6 April: 'today' for a
 *    draft, { elapsedYears: 0, monthsIntoYear } for a locked plan. So does the plan that carries a closed plan on (6.56.0,
 *    services/PlanClosed.js `before`) once its first month has come, whether or not it says when work stopped: its pots are
 *    what was held when it was made, and the months of its year 0 before then were the closed plan's to pay. Nothing is shifted (no year was lived), but the pots are
 *    the plan's own, not pots waiting for its start: the ladder sets no cash aside to a first April that has passed
 *    (runUpCashSpent).
 *  - anything else — every plan locked in its year 0 or before (all of them until now), every plan that does not say when
 *    work stopped whose year 0 is this tax year or later, and settings handed in by any other route — no key: run from
 *    year 0, as every plan always was.
 * It is never saved (withoutPotsAsOf: ScenarioRepository.saveActiveStressSettings, and the preview's copies).
 *
 * The run's years. The run's year k is the twelve months from the pots' day plus k years, and carries plan year
 * elapsedYears + k's figures whole: its income, its State Pension and its other income. So a step, a State Pension or an
 * income that changes on 6 April changes in the run `monthsIntoYear` months later, and the pots are asked for the current
 * plan year's figure over the twelve months from their day — the same money in the same months when the figure does not
 * change at 6 April, and the way a plan in its year 0 read after April has always been run. Every engine, cone and
 * reading shares this one axis (the plan document reads its band on it: PlanDocument potReading); none is handed a part
 * of a year as if it were a whole one. A first run year shorter than twelve months would need every engine to run one.
 *
 * With no year lived (no `potsAsOf`, or one at year 0: every plan whose year 0 is this tax year or later, every plan
 * locked until now) planAsSeenFromToday and settingsAsSeenFromToday return what they are given, untouched, and
 * fullGiltTest does not call ladderAsSeenFromToday: every figure of every plan saved until now is byte-identical
 * (tests/planFromToday.identity.test.js).
 *
 * Pure: no storage, no clock (the caller's timing, or `now`, carries the date).
 */
import { parseStatePensionDate } from '../utils/StatePensionUtils.js';
import { taxYearStartOf, deriveTiming, stoppedWorkOf, monthKeyOf } from './PlanTiming.js';
import { beforeOf } from './PlanClosed.js';

const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const wholeMonths = (v) => Math.max(0, Math.min(11, Math.round(+v || 0)));

/** `potsAsOf` of a draft whose year 0 is behind it: its pots are today's (the module note). */
export const POTS_TODAY = 'today';

/**
 * Where in the plan the pots a run starts from belong (the module note): a locked plan's fixed position, today's place in
 * the plan for 'today' (`timing` is deriveTiming(settings, now) — the run's own clock), else year 0.
 * @returns {{ elapsedYears: number, monthsIntoYear: number }}
 */
export function runPositionOf(settings, timing) {
  const at = settings ? settings.potsAsOf : null;
  const from = isObj(at) ? at : (at === POTS_TODAY && timing ? timing : null);
  if (!from) return { elapsedYears: 0, monthsIntoYear: 0 };
  return { elapsedYears: Math.max(0, Math.round(+from.elapsedYears || 0)), monthsIntoYear: wholeMonths(from.monthsIntoYear) };
}

/**
 * The position a locked plan's pots belong to (the module note), or null: for a plan that is not locked, and for one locked
 * in its year 0 or before (it runs from year 0, as it always has). Read from the plan document the lock made, or — for a
 * lock that wrote none — from the position the lock recorded beside its flag (lockPositionOf).
 *
 * A plan locked with no document: the first Month-by-month record and a tax-year set-up lock the plan without writing one
 * (PlanLock.lockPlanIfNeeded), and a document may be written later. Its pots are the settings' as they stood on the day it
 * was locked, so from 6.51.0 that lock records where the plan stood that day (`decisionTool.settings.lockedPosition`): once
 * a year 0 in an earlier tax year can be saved, a plan locked in its year 2 would otherwise run from year 0 on its year-2
 * pots. A document written afterwards is run from the same position and records it. A lock made before 6.51.0 recorded
 * nothing and is read as it always was, from year 0 — never re-derived from its date, which would move the figures of a
 * plan locked under an earlier version.
 * @param {object} scenario  a saved plan
 * @returns {{ elapsedYears: number, monthsIntoYear: number }|null}
 */
export function lockedPotsAsOf(scenario) {
  const ds = scenario && scenario.decisionTool && scenario.decisionTool.settings;
  if (!(isObj(ds) && ds.locked)) return null;
  const doc = isObj(scenario.planDocument) ? scenario.planDocument : null;
  if (!doc) return positionOf(ds.lockedPosition);
  const pots = isObj(doc.pots) ? doc.pots : {};
  if (+pots.asOfPlanYear > 0) return { elapsedYears: Math.round(+pots.asOfPlanYear), monthsIntoYear: wholeMonths(doc.timing && doc.timing.monthsIntoYear) };
  // asOfPlanYear 0, written: a plan that says when work stopped, locked in its year 0 after that year's 6 April (6.51.0)
  return pots.asOfPlanYear === 0 ? { elapsedYears: 0, monthsIntoYear: wholeMonths(doc.timing && doc.timing.monthsIntoYear) } : null;
}

/** A recorded position ({ elapsedYears, monthsIntoYear }) read back, or null when there is none. */
function positionOf(v) {
  if (!isObj(v) || !Number.isFinite(+v.elapsedYears) || +v.elapsedYears < 0) return null;
  return { elapsedYears: Math.round(+v.elapsedYears), monthsIntoYear: wholeMonths(v.monthsIntoYear) };
}

/**
 * Does this plan carry a closed one on from a month already reached (services/PlanClosed.js `before`, 6.56.0)? Its pots are
 * what was held on the day it was made, in its year 0 — the change-over month's tax year — and the months of that year
 * before the change-over were paid by the plan it carries on: they are not this plan's to pay again.
 */
function carriesOnBy(plan, now) {
  const b = beforeOf(plan);
  return !!b && b.kind === 'plan' && b.from <= monthKeyOf(now);
}

/**
 * `potsAsOf` of a draft (the module note): 'today' when its pots, entered today, belong to a plan year already begun — a
 * year lived (every plan, 6.50.0), or year 0 itself for a plan that says when work stopped (6.51.0) or that carries a closed
 * plan on from a month already reached (6.56.0: whether or not it says when work stopped) — else null.
 * @param {object} settings  the draft's Stress settings
 * @param {Date} now
 * @param {object|null} [plan]  the saved plan the settings are of (for what came before it); absent, the settings alone decide
 */
export function draftPotsAsOf(settings, now, plan = null) {
  const t = deriveTiming(settings || {}, now);
  if (t.elapsedYears > 0) return POTS_TODAY;
  if (t.mode === 'future' || !(t.planYearNow >= 0)) return null;
  return !!stoppedWorkOf(settings) || carriesOnBy(plan, now) ? POTS_TODAY : null;
}

/**
 * What a lock that writes no plan document records beside its flag (PlanLock.lockPlanIfNeeded, 6.51.0) as
 * `decisionTool.settings.lockedPosition`: where the draft's pots stood on the lock's day (draftPotsAsOf), or null when they
 * belong to its year 0 or before — every lock until now, and then nothing is recorded and nothing moves.
 * @param {object} settings  the draft's Stress settings, as the engines read them
 * @param {Date} now  the lock's day
 * @param {object|null} [plan]  the saved plan (draftPotsAsOf: what came before it)
 * @returns {{ elapsedYears: number, monthsIntoYear: number }|null}
 */
export function lockPositionOf(settings, now, plan = null) {
  if (!draftPotsAsOf(withoutPotsAsOf(settings), now, plan)) return null;
  const t = deriveTiming(withoutPotsAsOf(settings) || {}, now);
  return { elapsedYears: t.elapsedYears, monthsIntoYear: wholeMonths(t.monthsIntoYear) };
}

/**
 * Has the gilt ladder's cash "until the plan's income starts" (strategyParams.bridgeCash) been spent by the day of the run's
 * pots (§6 decision 8)? That cash pays the months from the pots' day to the plan's first April. It is spent when the pots
 * belong to a plan year already begun — the settings say so with `potsAsOf` (the module note): a year lived, or, for a plan
 * that says when work stopped, its year 0. A plan locked before its year 0 keeps it on every later day (its pots, frozen at
 * the lock, still hold that cash), and so does every plan that does not say when work stopped, in its year 0 or before
 * (as every plan always has). Read by fullGiltTest, the plan document's assumptions and the dials that offer it.
 * @param {object} settings  effective Stress settings (with the `potsAsOf` a reader put on them)
 * @param {object} timing  deriveTiming(settings, now)
 */
export function runUpCashSpent(settings, timing) {
  if (!timing || timing.mode === 'future') return false;
  const at = settings ? settings.potsAsOf : null;
  return isObj(at) || (at === POTS_TODAY && timing.planYearNow >= 0);
}

/**
 * The day the run's pots belong to (the module note), when they belong to a plan year already begun: today for a draft
 * ('today'), the lock's day for a locked plan; null otherwise (a run from year 0 on pots waiting for it). The Decision tool
 * spreads the ladder's year that began before this day over the twelve months from it, as the engines run that year
 * (LadderPosition.ladderPosition `potsDay`).
 * @param {object} settings  effective Stress settings
 * @param {{ lockedAt?: string|null, now: Date }} o  the lock's date (a locked plan), and today (a draft)
 */
export function potsDayOf(settings, { lockedAt = null, now = null } = {}) {
  const at = settings ? settings.potsAsOf : null;
  if (at === POTS_TODAY) return now instanceof Date ? now : null;
  if (!isObj(at)) return null;
  const d = lockedAt ? new Date(lockedAt) : null;
  return d && Number.isFinite(d.getTime()) ? d : null;
}

/**
 * What a reader puts on a plan's settings as `potsAsOf` (the module note), or null for none.
 * @param {object} scenario  the saved plan the settings are read from
 * @param {object} settings  its effective Stress settings
 * @param {Date} now
 */
export function potsAsOfFor(scenario, settings, now) {
  const ds = scenario && scenario.decisionTool && scenario.decisionTool.settings;
  if (isObj(ds) && ds.locked) return lockedPotsAsOf(scenario);
  return draftPotsAsOf(settings, now, scenario);
}

/** The settings without the position a reader put on them (potsAsOfFor): what is saved. The same object when it has none. */
export function withoutPotsAsOf(settings) {
  if (!isObj(settings) || !('potsAsOf' in settings)) return settings;
  const rest = { ...settings };
  delete rest.potsAsOf;
  return rest;
}

/** The tax year the State Pension starts in (6 April boundary), or null without a date. */
function spTaxYearOf(settings) {
  const d = settings && settings.spStartDate ? parseStatePensionDate(settings.spStartDate) : null;
  return d ? taxYearStartOf(d) : null;
}

/** True when the plan's State Pension (by date) was already being paid before tax year `taxYear`: a run from then counts a whole year of it. */
export function spPaidBefore(settings, taxYear) {
  const ty = spTaxYearOf(settings);
  return ty != null && ty < taxYear;
}

/** A dated income stream ({ startYear, endYear }) moved `e` years earlier; null when it ended before today. */
function shiftStream(s, e) {
  if (!s || typeof s !== 'object') return s;
  const end = s.endYear == null ? null : +s.endYear - e;
  if (end != null && end < 0) return null;
  return { ...s, startYear: Math.max(0, (+s.startYear || 0) - e), ...(s.endYear == null ? {} : { endYear: end }) };
}
/** A one-off spend ({ year, years }) moved `e` years earlier, its years already gone taken off; null when wholly past. */
function shiftSpend(w, e) {
  if (!w || typeof w !== 'object' || w.year == null) return w;
  const runs = Math.max(1, +w.years || 1);
  const from = +w.year - e, last = from + runs - 1;
  if (last < 0) return null;
  if (from >= 0) return { ...w, year: from };
  return { ...w, year: 0, years: last + 1 };
}
/** A lump sum ({ year }) moved `e` years earlier; null once it has arrived (it is in the pot entered today). */
function shiftLump(w, e) {
  if (!w || typeof w !== 'object' || w.year == null) return w;
  const y = +w.year - e;
  return y < 0 ? null : { ...w, year: y };
}
const shiftList = (list, fn, e) => (Array.isArray(list) ? list.map((x) => fn(x, e)).filter((x) => x !== null) : list);
/** The schedule from plan year `e` on (index 0 = the current plan year); the last figure when the plan is past its end. */
function sliceSchedule(sched, e) {
  if (!Array.isArray(sched) || !sched.length) return sched;
  return e < sched.length ? sched.slice(e) : [sched[sched.length - 1]];
}

/**
 * The engine config (SimulationConfig.simulationConfigFromSettings) of the plan as seen from the day of its pots.
 * `timing` is deriveTiming(settings, now); the position is runPositionOf(settings, timing). Returns `cfg` itself when no
 * plan year had been lived by then (and for settings that do not say: the module note); otherwise a new config with
 * `yearOffset` (the years lived) and `monthsIntoYear` on it — stressTest.planFromSettings reads them, and a config that
 * carries them is never shifted twice.
 */
export function planAsSeenFromToday(cfg, settings, timing) {
  const { elapsedYears: e, monthsIntoYear: m } = runPositionOf(settings, timing);
  if (!(e > 0) || !cfg || cfg.yearOffset != null) return cfg;
  const s = settings || {};
  const out = { ...cfg, yearOffset: e, monthsIntoYear: m };
  const D = +s.duration > 0 ? +s.duration : (+cfg.duration > 0 ? +cfg.duration : 35);
  out.duration = Math.max(1, D - e);
  out.years = Math.max(1, (cfg.years != null ? +cfg.years : D) - e);
  // State Pension. By date: when the config counted it from the plan's year 0 (a saved first tax year — the branch
  // spSimConfigFromSettings takes), its plan year less the years lived, a whole year when it was already being paid before
  // this tax year. Counted from today (no saved first tax year), it is already as seen from today. The legacy year field
  // counts from year 0.
  if (cfg.spStartYear !== undefined) {
    const ty = spTaxYearOf(s);
    if (ty != null && +s.firstTaxYear > 0) {
      const raw = ty - (+s.firstTaxYear);
      out.spStartYear = Math.max(0, raw - e);
      if (raw < e) out.spFirstYearRatio = 1;
    }
  } else if (cfg.statePensionYear !== undefined) out.statePensionYear = Math.max(0, +cfg.statePensionYear - e);
  out.dbStartYear = Math.max(0, (+cfg.dbStartYear || 0) - e);
  out.extraIncomes = shiftList(cfg.extraIncomes, shiftStream, e);
  out.extraWithdrawals = shiftList(cfg.extraWithdrawals, shiftSpend, e);
  out.windfalls = shiftList(cfg.windfalls, shiftLump, e);
  // A phased (UFPLS) start counts its years from year 0: what is left of it, or none — its switch (and any tax-free lump at
  // the switch) is behind the pot entered today.
  if (cfg.accessMethod === 'ufpls' && +cfg.ufplsYears > 0) {
    const left = +cfg.ufplsYears - e;
    if (left > 0) out.ufplsYears = left;
    else { out.accessMethod = 'drawdown'; out.ufplsYears = null; out.ufplsThenPcls = false; }
  }
  // The bond tent glides from the plan's year 0: read from the plan year reached, over the plan's own length
  // (GlidepathService.glideShareForYear).
  if (cfg.equityGlide) out.equityGlide = { ...cfg.equityGlide, yearOffset: e, planDuration: D };
  // The schedule from the current plan year, each year whole (the module note, "The run's years"). A plan with no
  // schedule stays without one: each strategy keeps its own yearly figure.
  out.targetSchedule = sliceSchedule(cfg.targetSchedule, e);
  return out;
}

/**
 * Plan settings (the Decision copy the plan of record is projected from: PlanCommit.planOfRecordFor) as seen from today,
 * `e` plan years lived: the same moves as planAsSeenFromToday, on the settings' own keys — the schedule sliced, the
 * final-salary pension, the income streams, the one-off spends and the lump sums moved `e` years earlier (past ones
 * dropped), a phased start that is over ended, the duration shortened, and the first tax year moved to the current one so
 * the State Pension is counted from it (one already being paid before it is a whole year from the start: written as the
 * flat-figure fields the projection reads, `statePension` from year 0). Each tax year whole: the plan of record is a
 * yardstick for whole tax years, and a year's recorded draws are compared with the whole year. `e` 0: the settings
 * themselves.
 */
export function settingsAsSeenFromToday(settings, e) {
  const k = Math.max(0, Math.round(+e || 0));
  if (!(k > 0) || !settings) return settings;
  const s = settings;
  const out = { ...s, duration: Math.max(1, (+s.duration || 35) - k) };
  if (Array.isArray(s.targetSchedule)) out.targetSchedule = sliceSchedule(s.targetSchedule, k);
  if (+s.firstTaxYear > 0) {
    out.firstTaxYear = +s.firstTaxYear + k;
    if (spPaidBefore(s, out.firstTaxYear) && +s.spWeeklyAmount > 0) { out.spStartDate = null; out.statePension = +s.spWeeklyAmount * 52; out.statePensionYear = 0; }
  }
  // The year field counts from year 0 wherever the projection reads it: whenever the date cannot be (no date, or no weekly
  // amount with it — generateDrawdownSchedule's own test).
  if (!(s.spStartDate && +s.spWeeklyAmount > 0) && s.statePensionYear != null) out.statePensionYear = Math.max(0, +s.statePensionYear - k);
  if (s.dbStartYear != null) out.dbStartYear = Math.max(0, (+s.dbStartYear || 0) - k);
  if (Array.isArray(s.extraIncomes)) out.extraIncomes = shiftList(s.extraIncomes, shiftStream, k);
  if (Array.isArray(s.extraWithdrawals)) out.extraWithdrawals = shiftList(s.extraWithdrawals, shiftSpend, k);
  if (Array.isArray(s.windfalls)) out.windfalls = shiftList(s.windfalls, shiftLump, k);
  if (s.accessMethod === 'ufpls' && +s.ufplsYears > 0) {
    const left = +s.ufplsYears - k;
    if (left > 0) out.ufplsYears = left;
    else { out.accessMethod = 'drawdown'; out.ufplsYears = null; out.ufplsThenPcls = false; }
  }
  return out;
}

/**
 * The ways of drawing whose dials count years from the plan's year 0, and what each counts when it is not set: a number of
 * years, or the count worked out from the plan's length from year 0 (a function of it). One table for the two places that
 * read a plan from another year than its year 0: a move of the plan's start (PlanMove.laterParams: the same tax years
 * counted from an earlier year 0) and the run seen from today (countLeftFromToday: the years left of them).
 *  - A gilt ladder's cash years (the full ladder, and the ladder with rotation): its first rung pays the tax year year 0 +
 *    cashYears (GiltLadderPlan.buildGiltLadder). Seen from today ladderAsSeenFromToday counts them against the gilts that
 *    can still pay.
 *  - Bridge & engine's cash years (3 when not set: compareRunner): the bridge's first years, paid from cash.
 *  - Ladder & ratchet's ladder years: the years the base ladder pays. Not set, they are worked out from the plan's length
 *    from year 0 (ladderYearsFromYear0: up to 15, or half the plan when shorter) — the plan's whole length, not the years
 *    left of it, so a plan run from today keeps the ladder its year 0 gave it, and a move writes that count, k more.
 * The Decision tool's month reads Bridge & engine's and Ladder & ratchet's against the plan year (index.html
 * decisionStrategyOverlay, which reads the same ladder rule). Not counted from year 0, so read as they are: every age (a
 * bridge age, a floor age, a horizon,
 * the rotation's cut age — the run starts at the age reached), the rotation's disarm years (counted back from its cut age),
 * the cut dials and a bucket's band. A phased (UFPLS) start's years are a setting of the plan, not a way's dial:
 * planAsSeenFromToday and settingsAsSeenFromToday count what is left of them.
 */
export const COUNTS_FROM_YEAR0 = Object.freeze({
  'full-il-gilt': Object.freeze({ cashYears: 2 }), 'gilt-rotation': Object.freeze({ cashYears: 2 }),
  'bridge-and-engine': Object.freeze({ cashYears: 3 }), 'ladder-and-ratchet': Object.freeze({ ladderYears: (planYears) => ladderYearsFromYear0(null, planYears) })
});

/**
 * The plan's length from year 0 as a run reads its saved duration (stressTest.planFromSettings: 35 years when none is
 * saved, at most 45).
 */
export const planYearsOf = (duration) => Math.min(+duration > 0 ? +duration : 35, 45);

/**
 * Ladder & ratchet's ladder years from the plan's year 0 (compareRunner deriveCompareConfigs): the dial when it is set,
 * else up to 15, or half the plan when that is shorter — at least one, and short of the plan's last year. `planYears` is
 * the plan's whole length from year 0 (planYearsOf), never the years left of it: a plan run from today reads what is left
 * of this count (countLeftFromToday), and the Decision tool's month reads the count itself against the plan year.
 */
export function ladderYearsFromYear0(ladderYears, planYears) {
  return Math.max(1, Math.min(ladderYears || Math.min(15, Math.floor(planYears / 2)), planYears - 1));
}

/**
 * A count of years given from the plan's year 0 (COUNTS_FROM_YEAR0) as the years left of it in a run from plan year `lived`
 * (the run's year k is plan year lived + k): never below none — a ladder or cash that the years lived have used up is
 * over. With no year lived, the count itself, untouched.
 */
export function countLeftFromToday(count, lived) {
  const e = Math.max(0, Math.round(+lived || 0));
  return e > 0 ? Math.max(0, count - e) : count;
}

/**
 * Ladder & ratchet's calendar reviews (compareRunner: one every five years of the ladder, the last at its end when it falls
 * on one): the plan's own five-year marks within `ladderYears` from year 0, those still to come in a run from plan year
 * `lived`, as months of the run. With no year lived: 60, 120, … as they always were.
 */
export function reviewMonthsFromToday(ladderYears, lived, everyYears = 5) {
  const e = Math.max(0, Math.round(+lived || 0));
  return Array.from({ length: Math.floor(Math.max(0, +ladderYears || 0) / everyYears) }, (_, i) => ((i + 1) * everyYears - e) * 12).filter((t) => t > 0);
}

/** The first tax year a rung maturing on `iso` pays: a gilt maturing from 1 April of year Y−1 to 31 March of Y pays tax year Y (buildGiltLadder). */
const taxYearPaidBy = (iso) => +iso.slice(0, 4) + (iso.slice(5, 10) >= '04-01' ? 1 : 0);

/**
 * The gilt ladder of a plan already running, as fullGiltTest buys it (research/plan-start.md §3 "fullGiltTest", §6 decision
 * 8). A ladder's timing is the strategy's own, counted from the plan's year 0 and never from today: its first rung pays
 * plan year `cashYears`, the tax year planFirstTaxYear + cashYears, as it did on the day the plan was made. Seen from today
 * the ladder is bought from the current tax year (`runFirstTaxYear`), so no year already lived is bought a second time, and
 * its cash years are the years from today to that first rung. At least one: the current year's rung, if it had one, matured
 * before its 6 April and its money is cash now. For the same reason only gilts still to mature on `todayIso` are bought, and
 * a year that no such gilt can pay (its rung has matured since the plan was made, or none ever covered it) is paid from cash
 * — without that a running ladder would read as "not affordable" from the day each rung matures to the April it pays. No
 * run-up cash once the plan has started.
 * @param {{ planFirstTaxYear: number, runFirstTaxYear: number, cashYears?: number, linkers?: object[], todayIso: string }} a
 * @returns {{ firstTaxYear: number, cashYears: number, linkers: object[], bridgeCash: number }}  buildGiltLadder's inputs
 */
export function ladderAsSeenFromToday({ planFirstTaxYear, runFirstTaxYear, cashYears = 2, linkers = [], todayIso }) {
  const today = String(todayIso || '').slice(0, 10);
  const live = (Array.isArray(linkers) ? linkers : []).filter((g) => g && (!g.maturityDateIso || g.maturityDateIso > today));
  // The gilts the ladder builder can buy (buildGiltLadder's own filter): the first tax year any of them pays.
  const buyable = live.filter((g) => g.lag === 3 && g.cleanPrice != null && g.maturityDateIso).map((g) => g.maturityDateIso).sort();
  const firstPaid = buyable.length ? taxYearPaidBy(buyable[0]) : null;
  const toFirstRung = (+planFirstTaxYear || 0) + Math.max(0, +cashYears || 0) - (+runFirstTaxYear || 0);
  const toFirstPaid = firstPaid != null ? firstPaid - (+runFirstTaxYear || 0) : 0;
  return { firstTaxYear: +runFirstTaxYear, cashYears: Math.max(1, toFirstRung, toFirstPaid), linkers: live, bridgeCash: 0 };
}
