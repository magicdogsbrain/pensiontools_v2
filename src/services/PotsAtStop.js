/**
 * The pots when you stop work, worked out when read, never frozen (7.12.0).
 *
 * Keeping an answer used to write the middling pot at the stop into the plan as if the person had typed it, and nothing
 * replaced it: not a later stop, not a new pay-in, not a check-in. Every run then tested a plan the person no longer had.
 * Now a plan still saving reads its pots at the stop from its own facts (services/SaverFacts.js) on the saving path
 * (services/SavingPath.js: the answer's lives, seed and mixes, what goes in rising with each future's own prices, as the
 * answer has it), so the figure is the answer's own "middling" pot for the same plan.
 *
 *   potsAtStopOf(plan, settings, { now, env }) →
 *     null                                                     not stopping later
 *     { sipp, sippLow, sippHigh, isa, careful, good,           today's prices, whole pounds: the pension's middle with its
 *       source: 'worked',                                      bad and good cases from the same lives; careful/good are
 *       from: { pot, potFrom, potAt, monthly, isaMonthly, toAge } }   the pension and savings together
 *
 * One model (lead4.md D4; step F1): a stored `potAtRetirement` — the answer's figure, a typed 'override', a projection the
 * full view's Timing block once saved — is never read here, for a figure shown or for a run; nothing is written.
 * The last 8 workings are kept by their inputs and the month, so a page that reads the plan many times works it out once.
 *
 * Pure but for that small memo: no storage, no clock (the caller hands in `now`).
 */
import { deriveTiming } from './PlanTiming.js';
import { buildSavingPath } from './SavingPath.js';
import { saverFacts } from './SaverFacts.js';

const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
const monthKey = (d) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');

const MEMO = new Map();
const MEMO_SIZE = 8;
let builds = 0;
/** How many saving paths have been drawn here (for tests: a page that reads a plan many times draws it once). */
export const potsAtStopBuilds = () => builds;

/**
 * The saving lives' path to `timing.shapeAgeNow` (services/SavingPath.js buildSavingPath, what goes in rising with each
 * future's own prices): the one model of the pot at a stop, for the plan's own stop (potsAtStopOf) and for another age the
 * "When could I retire?" spin asks about (services/RetireSweep.js). Memoised by its inputs and the month.
 */
export function savingPathAt({ settings = {}, timing, accumulation = {}, holdings = null, phases = null, explicit, now = new Date(), env = {} } = {}) {
  const s = settings || {};
  const key = JSON.stringify([monthKey(now), timing.currentAge, timing.shapeAgeNow, explicit, s.chargesPct, s.isaGrowth, s.isaReturn, s.equityMin, s.bondMin, s.cashTarget, s.taggedFunds || null, s.allocMode || null,
    (accumulation || {}).savingMix || null, phases && phases.saving ? phases.saving : null, holdings, env && env.futureReturns ? 'env' : null]);
  let path = env && env.futureReturns ? null : MEMO.get(key);
  if (!path) {
    builds++;
    path = buildSavingPath({ settings: s, timing, accumulation: accumulation || {}, holdings, now, explicit, phases, env: env || {}, risePrices: true, pensionBand: true });
    if (!(env && env.futureReturns)) {
      MEMO.set(key, path);
      while (MEMO.size > MEMO_SIZE) MEMO.delete(MEMO.keys().next().value);
    }
  }
  return path;
}

/**
 * What a plan's saving lives start from (its pension and ISA today, what goes into each a month: services/SaverFacts.js),
 * with the inputs savingPathAt reads besides — so a page can hand the spin's worker the plan's own figures, never a box's.
 */
export function savingInputsOf(plan, settings, { now = new Date() } = {}) {
  const facts = saverFacts(plan, settings || {}, { now });
  return {
    explicit: { potNow: facts.pot.pension, isaNow: facts.pot.isa, totalMonthly: facts.payIn.total, isaMonthly: facts.isaMonthly },
    potKnown: facts.pot.from !== 'none',
    accumulation: plan && plan.accumulationTool && isObj(plan.accumulationTool.settings) ? plan.accumulationTool.settings : {},
    holdings: plan && plan.holdings ? plan.holdings : null,
    phases: plan && plan.phases ? plan.phases : null
  };
}

export function potsAtStopOf(plan, settings, { now = new Date(), env = {} } = {}) {
  const s = isObj(settings) ? settings : {};
  if (s.retired !== false) return null;
  let timing;
  try { timing = deriveTiming(s, now); } catch { return null; }
  if (!timing || timing.mode !== 'future' || !(timing.currentAge > 0)) return null;
  const facts = saverFacts(plan, s, { now });
  const accumulation = plan && plan.accumulationTool && isObj(plan.accumulationTool.settings) ? plan.accumulationTool.settings : {};
  const explicit = { potNow: facts.pot.pension, isaNow: facts.pot.isa, totalMonthly: facts.payIn.total, isaMonthly: facts.isaMonthly };
  const path = savingPathAt({ settings: s, timing, accumulation, holdings: plan && plan.holdings ? plan.holdings : null, phases: plan && plan.phases ? plan.phases : null, explicit, now, env });
  const rows = path && Array.isArray(path.path) ? path.path : [];
  const last = rows.length ? rows[rows.length - 1] : null;
  if (!last) return null;
  return {
    // the year-by-year band the same lives give (the saving page's table in both views): the pension's bad, middle and good
    // cases in today's money, and the ISA's middle, from today's age to the stop
    rows: rows.map((r) => ({ age: Math.round(r.age), low: Math.round(r.pension.realCareful), middle: Math.round(r.pension.real), high: Math.round(r.pension.realGood), isa: Math.round(r.isa.real), paidIn: r.paidIn })),
    sipp: Math.round(last.pension.real), sippLow: Math.round(last.pension.realCareful), sippHigh: Math.round(last.pension.realGood), isa: Math.round(last.isa.real),
    careful: Math.round(last.real.careful), good: Math.round(last.real.good), source: 'worked',
    from: { pot: facts.pot.pension, potFrom: facts.pot.from, potAt: facts.pot.at, monthly: facts.payIn.total, isaMonthly: facts.isaMonthly, toAge: Math.round(timing.shapeAgeNow) }
  };
}
