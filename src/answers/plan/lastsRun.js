/**
 * The one "will it last" test of a saved plan, run for "Does it last?" (research/v7/editing-in-v7.md 10.1, 10.4) — the
 * planner's own run, line for line (index.html strategyPlanFor + oneTestFor, 6.24.0): the effective settings its loader
 * reads, the engine config, the plan every strategy is judged on, stressTestStrategy on the plan's own strategy, then the
 * figures every planner screen reads through OneAnswer.js. Nothing is reimplemented here.
 *
 * Loaded LAZILY (a dynamic import in effects/answerWorker.js, and on the page only when no worker can start): this file
 * is the one door from V7 to the strategy registry, the nine strategies, the market history and the gilt data, so the
 * shell and the worker's own chunk never carry them (tests/v7/boundaries.test.js).
 *
 *   runLasts(plan, { today, onProgress }) → {
 *     strategyId, ran: { family, cutsOn, cutPct, months }, priced: 'bundled' | null,
 *     a: OneAnswer.oneAnswer(r, p) or null (not affordable), reason,
 *     history: { worst: OneAnswer.worstStarts(…), named: NamedStarts.namedStartRows(…) },
 *     stored: { a, note } | null      a locked plan: the document's figure and the one line of 6.24.0 when today's differs
 *   }
 *   runForDocument(plan, { today, essentials, onProgress }) → { p, r, savingPath, basis }
 *     the run the plan document is built from on a lock, or on "Write a new version from today's settings" (6.38.0,
 *     research/v7/road-to-7.md step 6): index.html buildPlanDocumentNow's run, line for line — the same effective settings,
 *     the plan built WITH the budget's essentials (strategyPlanFor's second argument, index.html _shapeRefs), the strategy run
 *     live (never the document's own: a new version re-prices a ladder at today's bundled curve, as the planner's does at
 *     the day's prices), `p` and `r` trimmed as PlanDocument.buildPlanDocument trims them (trimPlan, trimResult: no samples,
 *     no per-future lists, no functions), and a saver's path drawn on the saving-years engine (src/ui/savingPathForLock.js:
 *     absent unless the plan stops later). The document itself is built on the page (answers/plan/lock.js) with these.
 *
 *   runLever(plan, { today, lever, onProgress }) → the three levers of "Will it last?" on a saved plan (research/v7/answer-D.md
 *     3.5–3.7, 3.9; road-to-7.md step 7), each the same one test on a COPY of the plan's effective settings, nothing written:
 *       { kind: 'spendMore' }                  the most the plan's income can be scaled by and still last in 9 futures out of
 *                                              10 — a bounded search (SPEND_SEARCH_STEPS halvings between 1 and SPEND_MORE_MAX,
 *                                              or between SPEND_LESS_MIN and 1 when it does not last as it is), the base run
 *                                              first: at most 1 + SPEND_SEARCH_STEPS runs, the cost said in the result (`runs`)
 *       { kind: 'work', yearly, years }        earnings added through the engine's own extra incomes (settings.extraIncomes:
 *                                              a row from the plan's first year for `years` years, rising with prices, taxed as
 *                                              income) — one run; `field` names the row
 *       { kind: 'fall' }                       shares fall by a fifth tomorrow: the shares part of the pension (equityMin, which
 *                                              is also where the engine starts), of an ISA invested like the pension, of a taxable
 *                                              account held in shares, and of a saver's projected pot — one run; the mix is kept
 *     Every figure comes from stressTestStrategy through OneAnswer.oneAnswer, as the one test's do.
 *
 * Plain data in, plain data out (the plan after the in-memory upgrade; the result through cloneSafe in the worker). No
 * live gilt or share prices are loaded: a ladder is priced on the bundled curve (10.1). Pure but for the engine's own
 * deterministic futures; the date arrives as `today`.
 */
import { effectiveStressSettings } from '../../services/PlanReading.js';
import { simulationConfigFromSettings } from '../../services/SimulationConfig.js';
import { planFromSettings, stressTestStrategy } from '../../strategies/stressTest.js';
import { realYieldForYear } from '../../services/LinkerUniverse.js';
import { oneAnswer, worstStarts, earlierTestNote } from '../../services/OneAnswer.js';
import { namedStartRows } from '../../services/NamedStarts.js';
import { documentLadder } from '../../services/LadderPosition.js';
import { normaliseHoldings, emptyHoldings } from '../../services/HoldingsRecord.js';
import { trimPlan, trimResult } from '../../services/PlanDocument.js';
import { deriveTiming } from '../../services/PlanTiming.js';
import { buildSavingPath } from '../../services/SavingPath.js';
import { ON_COURSE_SHARE } from '../../services/OnCourse.js';
import { dateOf } from './dates.js';
import { FAMILY } from './lasts.js';

const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const isLocked = (plan) => !!(plan && plan.decisionTool && plan.decisionTool.settings && plan.decisionTool.settings.locked);
const plain = (v) => JSON.parse(JSON.stringify(v, (k, x) => (typeof x === 'function' ? undefined : (typeof x === 'number' && !Number.isFinite(x)) ? null : x)));

/**
 * index.html strategyPlanFor: the plan every screen runs, built from the settings the planner's loader reads. The one test
 * passes no essentials (oneTestFor: essentialsAnnual undefined); the plan document's run passes the budget's (buildPlanDocumentNow).
 */
export function planFor(settings, now, essentialsAnnual = undefined) {
  return planFromSettings(settings, simulationConfigFromSettings({}, settings), { yieldForYear: realYieldForYear, essentialsAnnual, startAge: +settings.shapeAgeNow || 57, now });
}

/** What the planner hands the document builder for the Accumulation tool (ScenarioRepository.getActiveAccumulation): its settings, {} for none. */
export const documentAccumulationOf = (plan) => (plan && plan.accumulationTool && plan.accumulationTool.settings) || {};
/** … and for what you hold (ScenarioRepository.getActiveHoldings): the record normalised, the empty record for none. */
export const documentHoldingsOf = (plan) => (plan && plan.holdings && typeof plan.holdings === 'object' ? normaliseHoldings(plan.holdings) : emptyHoldings());

/**
 * src/ui/savingPathForLock.js, without its lazy import: a saver's path on the saving-years engine, undefined for a plan that
 * is not stopping later (buildPlanDocument then draws the FCA path, as before 6.22.0).
 */
export function savingPathFor({ settings, accumulation = null, holdings = null, now }) {
  const timing = deriveTiming(settings || {}, now);
  if (timing.mode !== 'future' || !(timing.currentAge > 0)) return undefined;
  return buildSavingPath({ settings, timing, accumulation, holdings, now });
}

/**
 * The run a plan document is built from (index.html buildPlanDocumentNow): see the header.
 * @param {object} plan   a saved plan, brought up to date in memory
 * @param {{ today: string, essentials?: number, onProgress?: Function }} o   `essentials`: the budget's essentials a year
 *   before tax (lock.js shapeRefsOf), 0 or absent for none — the plan is then built as the one test builds it
 */
export function runForDocument(plan, { today, essentials = 0, onProgress = null } = {}) {
  const now = dateOf(today);
  const tell = (done, total) => { if (typeof onProgress === 'function') onProgress(done, total); };
  const settings = effectiveStressSettings(plan, { now });
  const strategyId = settings.strategyId || 'pots-and-valves';
  const ess = +essentials > 0 ? +essentials : undefined;
  tell(0, 2);
  const p = planFor(settings, now, ess);
  const r = stressTestStrategy(strategyId, p);
  tell(1, 2);
  // what the planner hands in (index.html buildPlanDocumentNow): the Accumulation tool's settings ({} for none) and the
  // holdings record normalised (ScenarioRepository.getActiveAccumulation, getActiveHoldings)
  const savingPath = savingPathFor({ settings, accumulation: documentAccumulationOf(plan), holdings: documentHoldingsOf(plan), now });
  return plain({ p: trimPlan(p), r: trimResult(r), savingPath, basis: { today, engine: 'one-test', essentials: ess || 0 } });
}

/**
 * @param {object} plan   a saved plan, brought up to date in memory (scenarioMigration.upgradeScenario)
 * @param {{ today: string, onProgress?: (done: number, total: number) => void }} o
 */
export function runLasts(plan, { today, onProgress = null } = {}) {
  const now = dateOf(today);
  const tell = (done, total) => { if (typeof onProgress === 'function') onProgress(done, total); };
  const settings = effectiveStressSettings(plan, { now });
  const strategyId = settings.strategyId || 'pots-and-valves';
  const family = FAMILY.includes(strategyId);
  const locked = isLocked(plan);
  const doc = locked && isObj(plan.planDocument) ? plan.planDocument : null;
  const storedR = doc && doc.strategy && isObj(doc.strategy.r) ? doc.strategy.r : null;
  let p, r;
  // a locked gilt ladder is the document's own (6.13.5, index.html oneTestFor): never re-priced
  const ladder = doc && documentLadder(doc, strategyId);
  tell(0, 2);
  if (ladder && doc.strategy.p) {
    p = doc.strategy.p; r = storedR;
  } else {
    p = planFor(settings, now);
    r = stressTestStrategy(strategyId, p);
  }
  tell(1, 2);
  const a = oneAnswer(r, p);
  const history = a
    ? { worst: worstStarts(r.histWindows, 5), named: namedStartRows(strategyId, p) }
    : { worst: [], named: [] };
  const stored = storedR && doc.strategy.id === strategyId ? { a: oneAnswer(storedR, doc.strategy.p || {}), note: earlierTestNote(storedR, r) } : null;
  const cfg = (p && p.pnvCfg) || {};
  return plain({
    strategyId,
    ran: { family, cutsOn: family && !cfg.disableProtection, cutPct: Math.round((1 - (cfg.protectionMult ?? 0.8)) * 100), months: cfg.consecutiveLimit ?? 3 },
    priced: !family && !(ladder && doc.strategy.p) ? 'bundled' : null,
    a, reason: a ? null : (r && r.reason) || null,
    history,
    stored,
    basis: { today, engine: 'one-test' }
  });
}

// ---- the three levers on a saved plan (research/v7/answer-D.md 3.5–3.7; road-to-7.md step 7) ---------------------------------

export const LEVER_KINDS = Object.freeze(['spendMore', 'work', 'fall']);
/** "Could I spend more?": the search's bounds and its halvings (at most 1 + SPEND_SEARCH_STEPS runs). */
export const SPEND_MORE_MAX = 2;
export const SPEND_LESS_MIN = 0.5;
export const SPEND_SEARCH_STEPS = 6;
/** "What if shares fell?": by a fifth (answer-D.md 3.7). */
export const FALL_SHARE = 0.2;
/** "Would some work help?": the row's limits (SCHEMA_D's work.yearly and work.years). */
export const WORK_LIMITS = Object.freeze({ yearlyMin: 1, yearlyMax: 200_000, yearsMin: 1, yearsMax: 5 });
export const WORK_LABEL = 'Work';

const num = (v) => (typeof v === 'number' && Number.isFinite(v) ? v : null);
/** The figures of one run every lever reports: the planner's own (OneAnswer), to the pound. */
export function pickFigures(a) {
  if (!a) return null;
  return { share: a.share, chancePct: a.chancePct, typicalLeft: Math.round(a.typicalLeft || 0), badCaseLeft: Math.round(a.badCaseLeft || 0), years: Math.round(a.years || 0), lasts: a.share >= ON_COURSE_SHARE - 1e-12 };
}

/**
 * The plan's effective settings with its income scaled by `f`: the base income, each step's amount when the income is in
 * phases, and the saved per-year schedule the engine reads first (IncomeSchedule.scheduleFromSteps: the saved schedule wins).
 */
export function scaledIncome(settings, f) {
  const out = { ...settings, baseSalary: Math.round((+settings.baseSalary || 0) * f) };
  if (Array.isArray(settings.incomeSteps)) out.incomeSteps = settings.incomeSteps.map((s) => (s && typeof s === 'object' && num(+s.amount) !== null ? { ...s, amount: Math.round(+s.amount * f) } : s));
  if (Array.isArray(settings.targetSchedule)) out.targetSchedule = settings.targetSchedule.map((v) => (num(+v) !== null ? Math.round(+v * f) : v));
  return out;
}

/** The settings with the work added as a row of extra income from the plan's first year (the engine's own mechanism). */
export function withWork(settings, { yearly, years }) {
  const rows = Array.isArray(settings.extraIncomes) ? settings.extraIncomes : [];
  return { ...settings, extraIncomes: [...rows, { label: WORK_LABEL, startYear: 0, endYear: Math.max(0, Math.round(years) - 1), annual: Math.round(yearly), indexation: 'cpi' }] };
}

/** The share of the pension in shares, by the plan's floors; 0 with no pots. */
const equityShareOf = (s) => { const eq = +s.equityMin || 0; const total = eq + (+s.bondMin || 0) + (+s.cashTarget || 0); return total > 0 ? eq / total : 0; };
const mixShare = (mix) => (mix === 'equity' ? 1 : mix === 'balanced' ? 0.5 : mix && typeof mix === 'object' && num(+mix.equity) !== null ? Math.max(0, Math.min(1, +mix.equity)) : 0);

/** The settings after shares fall by `share`: every shares part cut, the mix kept. Returns the settings and the pots before and after. */
export function afterFall(settings, share = FALL_SHARE) {
  const eq = +settings.equityMin || 0;
  const eqShare = equityShareOf(settings);
  const out = { ...settings, equityMin: Math.round(eq * (1 - share)) };
  const isa = +settings.isaBalance || 0;
  const invested = settings.isaGrowth === 'invested';
  if (invested && isa > 0) out.isaBalance = Math.round(isa * (1 - share * eqShare));
  const gia = +settings.taxableStart || 0;
  const giaShare = mixShare(settings.taxableMix || 'equity');
  if (gia > 0 && giaShare > 0) out.taxableStart = Math.round(gia * (1 - share * giaShare));
  // a saver's projected pots (PlanTiming: { sipp, isa, source }): the pension's shares part, and the ISA's where invested
  const projected = settings.potAtRetirement && typeof settings.potAtRetirement === 'object' ? settings.potAtRetirement : null;
  if (projected) {
    out.potAtRetirement = { ...projected };
    if (num(+projected.sipp) !== null && +projected.sipp > 0) out.potAtRetirement.sipp = Math.round(+projected.sipp * (1 - share * eqShare));
    if (invested && num(+projected.isa) !== null && +projected.isa > 0) out.potAtRetirement.isa = Math.round(+projected.isa * (1 - share * eqShare));
  }
  const before = eq + (+settings.bondMin || 0) + (+settings.cashTarget || 0) + isa + gia;
  const after = (+out.equityMin || 0) + (+settings.bondMin || 0) + (+settings.cashTarget || 0) + (+out.isaBalance || 0) + (+out.taxableStart || 0);
  return { settings: out, potBefore: Math.round(before), potAfter: Math.round(after), equityShare: Math.round(eqShare * 100) / 100 };
}

/**
 * One lever, run on a copy of the plan's effective settings (the plan itself is never changed, and nothing is written):
 * @param {object} plan   a saved plan, brought up to date in memory
 * @param {{ today: string, lever: { kind: 'spendMore' | 'work' | 'fall', yearly?: number, years?: number }, onProgress?: Function }} o
 * @returns {object}  { kind, ok, runs, base, at, … } — `base` the plan as it is, `at` with the lever; `ok: false` with a `reason`
 *   ('unaffordable': this way of drawing cannot be bought with the pots; 'lever': the lever itself will not do)
 */
export function runLever(plan, { today, lever, onProgress = null } = {}) {
  const now = dateOf(today);
  const tell = (done, total) => { if (typeof onProgress === 'function') onProgress(done, total); };
  const settings = effectiveStressSettings(plan, { now });
  const strategyId = settings.strategyId || 'pots-and-valves';
  const kind = lever && lever.kind;
  if (!LEVER_KINDS.includes(kind)) throw new Error('runLever: no lever called "' + kind + '"');
  let runs = 0;
  const one = (s) => { runs += 1; const p = planFor(s, now); const r = stressTestStrategy(strategyId, p); return pickFigures(oneAnswer(r, p)); };
  const monthly = Math.round((+settings.baseSalary || 0) / 12);

  if (kind === 'work') {
    const yearly = num(+lever.yearly), years = num(+lever.years);
    if (yearly === null || years === null || yearly < WORK_LIMITS.yearlyMin || yearly > WORK_LIMITS.yearlyMax || years < WORK_LIMITS.yearsMin || years > WORK_LIMITS.yearsMax || !Number.isInteger(years)) {
      return plain({ kind, ok: false, reason: 'lever', runs: 0, basis: { today } });
    }
    tell(0, 1);
    const at = one(withWork(settings, { yearly, years }));
    tell(1, 1);
    return plain({ kind, ok: !!at, reason: at ? null : 'unaffordable', runs, yearly: Math.round(yearly), years: Math.round(years), field: 'extraIncomes', at, basis: { today, strategyId } });
  }
  if (kind === 'fall') {
    tell(0, 1);
    const f = afterFall(settings);
    const at = one(f.settings);
    tell(1, 1);
    return plain({ kind, ok: !!at, reason: at ? null : 'unaffordable', runs, share: FALL_SHARE, potBefore: f.potBefore, potAfter: f.potAfter, equityShare: f.equityShare, at, basis: { today, strategyId } });
  }
  // "Could I spend more?": the base run, then the bounded search for the largest scale that still lasts in 9 futures out of 10
  const total = 1 + SPEND_SEARCH_STEPS;
  tell(0, total);
  const base = one(settings);
  tell(1, total);
  if (!base) return plain({ kind, ok: false, reason: 'unaffordable', runs, basis: { today, strategyId } });
  const up = base.lasts;
  let lo = up ? 1 : SPEND_LESS_MIN;          // the largest scale known (or assumed) to last
  let hi = up ? SPEND_MORE_MAX : 1;          // the smallest scale known not to
  let atLo = up ? base : null;
  let hiLasts = null;                        // upward: whether even the cap lasts (then the search stops there)
  for (let i = 0; i < SPEND_SEARCH_STEPS; i++) {
    if (up && i === 0) {
      const top = one(settings === null ? settings : scaledIncome(settings, SPEND_MORE_MAX));
      tell(1 + i + 1, total);
      if (top && top.lasts) { lo = SPEND_MORE_MAX; atLo = top; hiLasts = true; break; }
      hiLasts = false;
      continue;
    }
    const mid = (lo + hi) / 2;
    const a = one(scaledIncome(settings, mid));
    tell(1 + i + 1, total);
    if (a && a.lasts) { lo = mid; atLo = a; } else hi = mid;
  }
  if (!up && atLo === null) {
    // downward: nothing between half and the whole lasted — try the floor itself once more is not needed: say so
    return plain({ kind, ok: true, reason: null, runs, factor: null, perMonth: null, baseMonthly: monthly, capped: false, evenHalf: true, base, at: null, basis: { today, strategyId } });
  }
  const factor = Math.round(lo * 100) / 100;
  const perMonth = Math.round(monthly * (factor - 1) / 10) * 10;
  return plain({ kind, ok: true, reason: null, runs, factor, perMonth, baseMonthly: monthly, capped: hiLasts === true, evenHalf: false, base, at: atLo, basis: { today, strategyId } });
}
