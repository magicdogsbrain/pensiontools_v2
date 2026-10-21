/**
 * "Your household" runs (research/v7/road-to-7.md step 9; v6-usability-audit.md 2.10): the planner's Household tab, line for
 * line — both plans through the ONE test each way (as they are, and drawing together), paired future for future, pooled
 * by HouseholdService.combineHouseholdStrategies with the split HouseholdDraw.householdDrawSplit sets; the survivor check
 * (runSurvivorCheck) and the care check (runCareCheck), each plan through its own way of drawing. Nothing is
 * reimplemented: the plan is lastsRun.js planFor's (the bundled yield curve), the runs stressTestStrategy's, the pooling
 * and the split the planner's own functions, the figures OneAnswer's.
 *
 * Loaded LAZILY, like lastsRun.js, waysRun.js and mixRun.js (a dynamic import in effects/answerWorker.js, the worker's
 * alone): this file is a door from V7 to the strategies, so the shell and the plan pages' chunk never carry them.
 *
 *   runHousehold(plan, partner, { today, limit, onProgress }) → {
 *     ok, reason ('partnerNotSet' | 'unaffordable'), which, why,
 *     names, offsets: { a, b }, split (householdDrawSplit's, less its settings and profiles), own: { combined, rA, rB },
 *     together: the same drawing together (when the split applies) or null, fig: comparisonFigures's or null,
 *     timeline: householdIncomeTimeline's rows, basis: { today, engine: 'one-test', runs }
 *   }
 *   runSurvivor(plan, partner, { today, who, atAge, spendPct, dbPct, onProgress }) → runSurvivorCheck's result less the
 *     what-if settings, with who, atAge, deathYear (the planner's years from now), spendPct, dbPct and the basis
 *   runCare(plan, partner, { today, who, fromAge, years, cost, onProgress }) → runCareCheck's result less the what-if settings,
 *     with who ('A' | 'B'), fromAge, startYear, years, annualCost and the basis
 *
 * Plain data in, plain data out; no live gilt or share prices; the date arrives as `today`. The "years from now" the
 * planner's boxes take are made here from the ages V7 asks: the age at death less the person's age today, whole years.
 */
import { effectiveStressSettings } from '../../services/PlanReading.js';
import { stressTestStrategy } from '../../strategies/stressTest.js';
import { simulationConfigFromSettings } from '../../services/SimulationConfig.js';
import { runHouseholdWays, runSurvivorCheck, runCareCheck, householdIncomeTimeline, startOffset } from '../../services/HouseholdService.js';
import { householdDrawSplit, comparisonFigures } from '../../services/HouseholdDraw.js';
import { planFor } from './lastsRun.js';
import { ageNowOf } from './household.js';
import { dateOf } from './dates.js';

const plain = (v) => JSON.parse(JSON.stringify(v, (k, x) => (typeof x === 'function' ? undefined : (typeof x === 'number' && !Number.isFinite(x)) ? null : x)));
const nameOf = (plan) => (plan && plan.planDetails && typeof plan.planDetails.name === 'string' && plan.planDetails.name) || (plan && typeof plan.name === 'string' && plan.name) || '';
const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const configured = (plan) => !!(plan && plan.stressTool && isObj(plan.stressTool.settings) && plan.stressTool.settings.configured);

/** One plan through its own way's one test (what the planner's engine worker hands HouseholdService): { r, p }. */
const testOf = (now) => (settings, cfg, strategyId) => { void cfg; const p = planFor(settings, now); return { r: stressTestStrategy(strategyId, p), p }; };
const idOf = (s) => (s && s.strategyId) || 'pots-and-valves';
const settingsOf = (plan, partner, now) => ({ a: effectiveStressSettings(plan, { now }), b: effectiveStressSettings(partner, { now }) });
const namesOf = (plan, partner) => ({ a: nameOf(plan) || 'You', b: nameOf(partner) || 'Partner' });
/** The planner's "years from now" from an age V7 asks: never before this year. */
export const yearsFromAge = (age, ageNow) => Math.max(0, Math.round((+age || 0) - (ageNow == null ? +age || 0 : ageNow)));

/** The split without what the page rebuilds itself (its settings) or does not read (the profiles' rows, the year rows). */
function compactSplit(split) {
  const { settings, profiles, rows, ...rest } = split;
  void settings; void profiles; void rows;
  return rest;
}

/**
 * @param {object} plan      this plan, brought up to date in memory
 * @param {object} partner   the partner's plan
 * @param {{ today: string, limit?: object|null, onProgress?: Function }} o   `limit`: HouseholdDraw.limitFrom's object or null
 */
export function runHousehold(plan, partner, { today, limit = null, onProgress = null } = {}) {
  const now = dateOf(today);
  const tell = (done, total) => { if (typeof onProgress === 'function') onProgress(done, total); };
  const names = namesOf(plan, partner);
  if (!configured(partner)) return plain({ ok: false, reason: 'partnerNotSet', which: 'b', names, basis: { today, engine: 'one-test', runs: 0 } });
  const s = settingsOf(plan, partner, now);
  const offsets = { a: startOffset(s.a, now), b: startOffset(s.b, now) };
  const split = householdDrawSplit({ settings: s.a, name: names.a }, { settings: s.b, name: names.b }, { limit: limit || null, now });
  const cfgOf = (st) => simulationConfigFromSettings({}, st);
  const ways = { own: { settingsA: s.a, cfgA: cfgOf(s.a), settingsB: s.b, cfgB: cfgOf(s.b) } };
  if (split.applies) ways.together = { settingsA: split.settings.a, cfgA: cfgOf(split.settings.a), settingsB: split.settings.b, cfgB: cfgOf(split.settings.b) };
  const total = split.applies ? 4 : 2;
  let runs = 0;
  tell(0, total);
  const test = testOf(now);
  const counted = (settings, cfg, id) => { const out = test(settings, cfg, id); runs += 1; tell(runs, total); return out; };
  const res = runHouseholdWays(ways, split.needs, idOf(s.a), idOf(s.b), counted);
  const bad = [['a', res.own.rA], ['b', res.own.rB]].find(([, x]) => x && !x.affordable);
  if (bad) return plain({ ok: false, reason: 'unaffordable', which: bad[0], why: bad[1].reason || '', names, basis: { today, engine: 'one-test', runs } });
  const fig = split.applies && res.together && res.together.combined ? comparisonFigures(split, res) : null;
  const timeline = householdIncomeTimeline(s.a, s.b, null, now);
  return plain({ ok: true, names, offsets, split: compactSplit(split), own: res.own, together: res.together || null, fig, timeline, basis: { today, engine: 'one-test', runs } });
}

/**
 * @param {{ today: string, who: 'a'|'b', atAge: number, spendPct: number, dbPct: number, onProgress?: Function }} o   `who` dies
 */
export function runSurvivor(plan, partner, { today, who = 'a', atAge, spendPct = 70, dbPct = 50, onProgress = null } = {}) {
  const now = dateOf(today);
  const tell = (done, total) => { if (typeof onProgress === 'function') onProgress(done, total); };
  const s = settingsOf(plan, partner, now);
  const names = namesOf(plan, partner);
  const deceased = who === 'b' ? s.b : s.a, survivor = who === 'b' ? s.a : s.b;
  const deathYear = Math.max(1, yearsFromAge(atAge, ageNowOf(deceased, now)));
  let runs = 0;
  tell(0, 3);
  const test = testOf(now);
  const counted = (settings, cfg, id) => { const out = test(settings, cfg, id); runs += 1; tell(Math.min(runs, 3), 3); return out; };
  const r = runSurvivorCheck({ survivorSettings: survivor, deceasedSettings: deceased, deathYear, spendFraction: spendPct / 100, dbSurvivorPct: dbPct / 100, now }, counted);
  const { settings, ...rest } = r;
  void settings;
  return plain({ ...rest, who, atAge, deathYear, spendPct, dbPct, names, basis: { today, engine: 'one-test', runs } });
}

/**
 * @param {{ today: string, who: 'a'|'b', fromAge: number, years: number, cost: number, onProgress?: Function }} o   `who` needs care
 */
export function runCare(plan, partner, { today, who = 'a', fromAge, years = 3, cost = 90000, onProgress = null } = {}) {
  const now = dateOf(today);
  const tell = (done, total) => { if (typeof onProgress === 'function') onProgress(done, total); };
  const s = settingsOf(plan, partner, now);
  const names = namesOf(plan, partner);
  const cared = who === 'b' ? s.b : s.a;
  const startYear = yearsFromAge(fromAge, ageNowOf(cared, now));
  // each plan's draw need by plan year (the planner hands in its split's needs.own): the pooled verdict asks the other pot to cover it
  const needs = householdDrawSplit({ settings: s.a, name: names.a }, { settings: s.b, name: names.b }, { now }).needs.own;
  let runs = 0;
  tell(0, 3);
  const test = testOf(now);
  const counted = (settings, cfg, id) => { const out = test(settings, cfg, id); runs += 1; tell(Math.min(runs, 3), 3); return out; };
  const r = runCareCheck({ setA: s.a, setB: s.b, who: who === 'b' ? 'B' : 'A', startYear, years, annualCost: cost, needs, now }, counted);
  const { settings, ...rest } = r;
  void settings;
  return plain({ ...rest, fromAge, startYear, years, annualCost: cost, names, basis: { today, engine: 'one-test', runs } });
}
