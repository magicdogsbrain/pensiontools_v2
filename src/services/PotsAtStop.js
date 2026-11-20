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
 *     { sipp, isa, source: 'typed' }                           the person's own figure, kept as it is
 *     { sipp, isa, careful, good, source: 'worked',            today's prices, whole pounds; careful/good are the
 *       from: { pot, potFrom, potAt, monthly, isaMonthly, toAge },    pension and savings together; `lives`: the saving
 *       lives }                                                   years' own figures (SavingPath.savingCoreFrom), which the
 *                                                                 plan test draws each life's pots from (ruling 8)
 *
 * Typed: a stored `potAtRetirement` marked 'override' that is not the figure keeping an answer wrote (the plan's
 * `fromAnswer` holds the same middling pension and savings at the stop). Old plans are read as they are; nothing is written.
 * The last 8 workings are kept by their inputs and the month, so a page that reads the plan many times works it out once.
 *
 * Pure but for that small memo: no storage, no clock (the caller hands in `now`).
 */
import { deriveTiming } from './PlanTiming.js';
import { isLockedSettings } from './LockedPlanGuard.js';
import { buildSavingPath, savingCoreFrom } from './SavingPath.js';
import { saverFacts } from './SaverFacts.js';

const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
const monthKey = (d) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');

const MEMO = new Map();
const MEMO_SIZE = 8;
let builds = 0;
/** How many saving paths have been drawn here (for tests: a page that reads a plan many times draws it once). */
export const potsAtStopBuilds = () => builds;

/** Whether a stored 'override' is the figure keeping an answer wrote (the answer's middling pots at the stop). */
export function isAnswersOwnFigure(plan, stored) {
  const fa = plan && plan.fromAnswer;
  const p = isObj(fa) && Array.isArray(fa.people) && isObj(fa.people[0]) ? fa.people[0] : null;
  if (!p || !isObj(stored)) return false;
  const sippA = p.pension && p.pension.atStop && isNum(p.pension.atStop.middling) ? p.pension.atStop.middling : null;
  const isaA = p.savings && p.savings.atStop && isNum(p.savings.atStop.middling) ? p.savings.atStop.middling : null;
  const same = (a, b) => (a || 0) === (+b || 0);
  return sippA != null && same(sippA, stored.sipp) && same(isaA, stored.isa);
}

export function potsAtStopOf(plan, settings, { now = new Date(), env = {} } = {}) {
  const s = isObj(settings) ? settings : {};
  if (s.retired !== false) return null;
  const stored = isObj(s.potAtRetirement) ? s.potAtRetirement : null;
  if (stored && stored.source === 'override' && !isAnswersOwnFigure(plan, stored)) {
    return { sipp: +stored.sipp || 0, isa: +stored.isa || 0, source: 'typed' };
  }
  let timing;
  try { timing = deriveTiming(s, now); } catch { return null; }
  if (!timing || timing.mode !== 'future' || !(timing.currentAge > 0)) return null;
  const facts = saverFacts(plan, s, { now });
  const accumulation = plan && plan.accumulationTool && isObj(plan.accumulationTool.settings) ? plan.accumulationTool.settings : {};
  const explicit = { potNow: facts.pot.pension, isaNow: facts.pot.isa, totalMonthly: facts.payIn.total, isaMonthly: facts.isaMonthly };
  const phases = plan && plan.phases ? plan.phases : null;
  const holdings = plan && plan.holdings ? plan.holdings : null;
  const key = JSON.stringify([monthKey(now), timing.currentAge, timing.shapeAgeNow, explicit, s.chargesPct, s.isaGrowth, s.isaReturn, s.equityMin, s.bondMin, s.cashTarget, s.taggedFunds || null, s.allocMode || null,
    accumulation.savingMix || null, phases && phases.saving ? phases.saving : null, holdings, env && env.futureReturns ? 'env' : null]);
  let path = env && env.futureReturns ? null : MEMO.get(key);
  if (!path) {
    builds++;
    path = buildSavingPath({ settings: s, timing, accumulation, holdings, now, explicit, phases, env: env || {}, risePrices: true });
    if (!(env && env.futureReturns)) {
      MEMO.set(key, path);
      while (MEMO.size > MEMO_SIZE) MEMO.delete(MEMO.keys().next().value);
    }
  }
  const last = path && Array.isArray(path.path) && path.path.length ? path.path[path.path.length - 1] : null;
  if (!last) return null;
  // the saving years' own figures (SavingPath.savingCoreFrom): the plan test draws each life from its own pots with them
  // (stressTest.js stopLivesOf, lead4-engine.md ruling 8); plain data (a lock keeps it with the document's pots)
  // `mid`: the middle of these lives, the figures said below — what each life's pots are measured against, so a change to
  // the pots at the stop made after (a fall in shares tried on the plan) moves every life by the same share
  const { core } = savingCoreFrom({ settings: s, timing, accumulation, holdings, explicit, phases, risePrices: true });
  const mid = { sipp: Math.round(last.pension.real), isa: Math.round(last.isa.real) };
  return {
    sipp: mid.sipp, isa: mid.isa,
    careful: Math.round(last.real.careful), good: Math.round(last.real.good), source: 'worked',
    from: { pot: facts.pot.pension, potFrom: facts.pot.from, potAt: facts.pot.at, monthly: facts.payIn.total, isaMonthly: facts.isaMonthly, toAge: Math.round(timing.shapeAgeNow) },
    lives: { ...core, mid }
  };
}

/**
 * The full view's Timing block (index.html renderTiming): the pots at the stop worked out from the form's settings as they
 * stand, whatever the boxes below hold, in the shape its line reads (low and high: the careful and good cases).
 */
export function timingPotsAtStop(plan, settings, now = new Date()) {
  const w = potsAtStopOf(plan, { ...(settings || {}), potAtRetirement: null }, { now });
  const worked = w && w.source === 'worked' ? { ...w, low: w.careful, high: w.good, hasContributions: w.from.monthly > 0 } : null;
  // (7.12.0) a locked plan is priced on the pots it was locked with (PlanReading.withDerivedPots reads the same): said as
  // that, with today's middling case beside it as a second, labelled figure — never today's as "priced on"
  const locked = plan && plan.decisionTool && isLockedSettings(plan.decisionTool.settings) && plan.planDocument && plan.planDocument.pots ? plan.planDocument.pots.potAtRetirement : null;
  if (locked && typeof locked === 'object' && (+locked.sipp > 0 || +locked.isa > 0)) {
    return { sipp: Math.round(+locked.sipp || 0), isa: Math.round(+locked.isa || 0), source: 'locked', lockedAt: plan.planDocument.lockedAt || null, today: worked };
  }
  return worked;
}
