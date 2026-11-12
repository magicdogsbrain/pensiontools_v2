/**
 * How long the money has to last, on a saved plan (7.8.0, research/v7/replan-nov-2026.md 5; the build spec's section 6
 * "Plan 'Does it last?'"). The answers weigh each future by the chance someone is still alive when it runs out
 * (src/answers/shared/weigh.js); a saved plan does the same here, on one life:
 *
 *   lifeOfSettings(settings, now, { sex, startAge })   the person as the life tables read them, from the plan's effective
 *                         settings: the exact age today (the whole age the plan keeps, and the part of a year since the
 *                         birthday it knows), the year of birth as a fraction (decimal year of `now` less that age: the
 *                         tables are read between two years of birth), the sex (not said reads the women's figures), the
 *                         drawing start d (years from today to the run's first year, never below 0), and the two ages the
 *                         tables give from there: the plan-to age (fewer than 1 in 10 still alive) and the weighting age
 *                         (fewer than 1 in 50)
 *   lifeOf(plan, now, { settings, startAge })   the same for a saved plan, its sex from the answer it was kept from
 *                         (`fromAnswer.inputs[who].sex`, for any source and household); `reason` says why the plan has no
 *                         weighted figure yet: 'couple' (a plan made from a couple's answer) or 'linked' (two plans paired
 *                         as a household) — joint weighting reaches the plan side in 7.14.0. It writes nothing.
 *   planLevelOf(plan)     the level the plan is judged at: the kept answer's, when the person chose it there
 *                         (`fromAnswer.answer.levelChosen`), else Balanced. Saving a level on a plan is 7.9.0's.
 *   STRATEGY_LIFE / DURATION_SHAPED   every way of drawing, classed: 'extends' when a run followed on past the plan's
 *                         end gives the same futures within the plan's years (the weighted run can follow it on), and
 *                         'durationShaped' when what it buys is set by the plan's length (a longer run would buy something
 *                         else, so it has no weighted figure when the plan ends before the weighting age; 7.9.0)
 *   weightedReasonOf(life, strategyId, p)   null, or why there is no weighted figure ('couple', 'linked', 'durationShaped')
 *   weightedYearsOf(life, p)   { years, capped, extend }: the run years that reach the weighting age (at most
 *                         RULES.maxDrawYears), whether that cap cut it short, and whether the plan's own run falls short of it
 *   floorAt(settings, p, runYear, now)   what comes in anyway in a run year, after tax with the plan's own bands: the State
 *                         Pension, a final-salary pension, the income streams (the planner's guaranteedAtYear); a one-off
 *                         lump is never part of it
 *
 * Pure: no storage, no clock (the day arrives as `now`).
 */
import { LIFE_TABLE, jointSurvivalOf, horizonEndAge, weightToAge, sexKey } from '../../services/LongevityModel.js';
import { ageOnDate, birthdayOf, deriveTiming } from '../../services/PlanTiming.js';
import { grossToNet } from '../../services/TaxCalculator.js';
import { RULES, LEVEL_DEFAULT, levelOf } from '../shared/rules.js';
import { guaranteedAtYear } from './spend.js';

const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const isNum = (v) => typeof v === 'number' && Number.isFinite(v);

/**
 * Every way of drawing in the registry, classed (tests/v7/plan/life.test.js holds the list to the registry and checks the
 * 'extends' ones: a run followed on to the weighting age gives every future the same first failed year within the plan's
 * years). What each buys:
 *   pots-and-valves, buckets-in-order   one portfolio drawn by rules; the floors glide to the plan's end and are kept on
 *                                       its own length in the longer run, which then draws on from what is left
 *   ladder-and-ratchet                  a base ladder and ratchet rungs to the plan's last year
 *   floor-and-flex                      an essentials floor bought to the plan's end (or its own horizon age)
 *   floor-the-schedule                  the whole income bought to the plan's end
 *   floor-to-age                        the floor to an age, then the rest of the plan's years bought or cut there
 *   bridge-and-engine                   the years to the bridge age bought, kept inside the plan's length
 *   full-il-gilt, gilt-rotation         every year of the plan bought as gilts (GiltLadderPlan; the rotation is built on it)
 */
export const STRATEGY_LIFE = Object.freeze({
  'pots-and-valves': 'extends',
  'buckets-in-order': 'extends',
  'ladder-and-ratchet': 'durationShaped',
  'bridge-and-engine': 'durationShaped',
  'floor-and-flex': 'durationShaped',
  'floor-the-schedule': 'durationShaped',
  'floor-to-age': 'durationShaped',
  'full-il-gilt': 'durationShaped',
  'gilt-rotation': 'durationShaped'
});
export const DURATION_SHAPED = Object.freeze(Object.keys(STRATEGY_LIFE).filter((k) => STRATEGY_LIFE[k] === 'durationShaped'));

/** The decimal year of a day: 2026-07-02 → 2026.5. Local calendar days, as the plan's dates are kept. */
function decimalYear(at) {
  const y = at.getFullYear();
  const from = new Date(y, 0, 1).getTime(), to = new Date(y + 1, 0, 1).getTime();
  return y + (at.getTime() - from) / (to - from);
}

/** The part of a year since the last birthday the settings know (0 when they know none: the age was given today). */
function sinceBirthday(settings, at) {
  const bd = birthdayOf(settings, at);
  if (bd.source === 'today') return 0;
  let last = new Date(at.getFullYear(), bd.month, bd.day);
  if (last.getTime() > at.getTime()) last = new Date(at.getFullYear() - 1, bd.month, bd.day);
  const next = new Date(last.getFullYear() + 1, bd.month, bd.day);
  return Math.max(0, Math.min(0.999999, (at.getTime() - last.getTime()) / (next.getTime() - last.getTime())));
}

/** 'm' | 'f' from how a sex is said, and whether it was said at all (not said reads the women's figures). */
const SAID = new Set(['m', 'f', 'male', 'female']);

/**
 * The person on one plan's settings as the life tables read them (see the header).
 * @param {object} settings   the plan's effective Stress settings
 * @param {Date} now
 * @param {{ sex?: string|null, startAge?: number|null, table?: object }} o   `startAge`: the run's first-year age (p.startAge);
 *   it is also the age today on a plan that keeps none
 */
export function lifeOfSettings(settings, now, { sex = null, startAge = null, table = LIFE_TABLE } = {}) {
  const s = settings || {};
  const at = now instanceof Date ? now : new Date(now);
  const whole = ageOnDate(s, at, at);
  let ageNow;
  let ageKnown = true;
  if (whole != null) ageNow = whole + sinceBirthday(s, at);
  else {
    ageKnown = false;
    const t = (() => { try { return deriveTiming(s, at); } catch { return null; } })();
    ageNow = isNum(startAge) ? startAge : t && isNum(t.shapeAgeNow) ? t.shapeAgeNow : 57;
  }
  const key = sexKey(sex);
  const by = decimalYear(at) - ageNow;
  const first = isNum(startAge) ? startAge : ageNow;
  const d = Math.max(0, first - ageNow);
  const people = [{ age: ageNow, by, sex: key }];
  return {
    people, ageNow, ageKnown, by, sex: key, sexGiven: SAID.has(sex), d,
    planToAge: horizonEndAge({ people, d, table }), weightToAge: weightToAge({ people, d, table }),
    joint: false, tablesVersion: table.tablesVersion || null, reason: null
  };
}

/** The sex the answer a plan was kept from says for its person ('m', 'f' or null: not said). */
function keptSexOf(plan) {
  const fa = plan && plan.fromAnswer;
  if (!isObj(fa) || !isObj(fa.inputs)) return null;
  const who = fa.who === 'partner' ? 'partner' : 'you';
  const v = isObj(fa.inputs[who]) ? fa.inputs[who].sex : null;
  return v === 'male' || v === 'm' ? 'm' : v === 'female' || v === 'f' ? 'f' : null;
}

/** Why a saved plan has no weighted figure in 7.8.0 whatever its strategy: a couple's answer, or two plans paired. */
function householdReasonOf(plan) {
  if (plan && isObj(plan.household) && typeof plan.household.partnerScenarioId === 'string' && plan.household.partnerScenarioId) return 'linked';
  const fa = plan && plan.fromAnswer;
  if (isObj(fa) && (fa.household === 'couple' || (isObj(fa.inputs) && fa.inputs.household === 'couple'))) return 'couple';
  return null;
}

/**
 * A saved plan's person (see the header). Writes nothing.
 * @param {object} plan   a saved plan, brought up to date in memory
 * @param {Date} now
 * @param {{ settings: object, startAge?: number|null, table?: object }} o   `settings`: the plan's effective Stress settings
 */
export function lifeOf(plan, now, { settings, startAge = null, table = LIFE_TABLE } = {}) {
  const life = lifeOfSettings(settings, now, { sex: keptSexOf(plan), startAge, table });
  return { ...life, reason: householdReasonOf(plan) };
}

/** The level a saved plan is judged at: the kept answer's when the person chose one there, else Balanced. */
export function planLevelOf(plan) {
  const row = plan && isObj(plan.fromAnswer) && isObj(plan.fromAnswer.answer) ? plan.fromAnswer.answer : null;
  return row && row.levelChosen === true ? levelOf(row.level, { stored: true }) : LEVEL_DEFAULT;
}

/** Why there is no weighted figure: the household's reason, else a strategy whose purchases follow the plan's length when the plan ends early. */
export function weightedReasonOf(life, strategyId, p) {
  if (life && life.reason) return life.reason;
  const w = weightedYearsOf(life, p);
  if (w.extend && STRATEGY_LIFE[strategyId] !== 'extends') return 'durationShaped';
  return null;
}

/**
 * The run years that reach the weighting age from the run's first year (whole years, at most RULES.maxDrawYears):
 * `extend` when the plan's own run is shorter, `capped` when the cap stops short of the weighting age.
 */
export function weightedYearsOf(life, p) {
  const start = isNum(p && p.startAge) ? p.startAge : life.ageNow;
  const own = isNum(p && p.durationYears) ? p.durationYears : 0;
  const want = Math.max(1, Math.ceil(life.weightToAge - start - 1e-9));
  const years = Math.min(want, RULES.maxDrawYears);
  return { years: Math.max(own, years), capped: want > RULES.maxDrawYears, extend: own < years };
}

/**
 * The weights of a run's futures (7.8.0, the build spec's section 1), from the run year each first failed (`headYear`,
 * services/OneAnswer.js reads it): a future that failed in run year y counts by the chance someone is still alive at the
 * start of that year (age p.startAge + y), given alive at the drawing start. Whole numbers (round(S × 2^30)).
 */
export function survivalFrom(life, table = LIFE_TABLE) {
  return jointSurvivalOf(life.people, life.d, table);
}

/**
 * What comes in anyway in run year `k` of the plan's run, after tax with the plan's bands (the floor line): the planner's
 * guaranteedAtYear on the plan year reached (the years lived before the run plus k).
 */
export function floorAt(settings, p, k, now) {
  const s = settings || {};
  const pa = isNum(+s.pa) && +s.pa > 0 ? +s.pa : 12570, brl = +s.brl > 0 ? +s.brl : 50270, hrl = +s.hrl > 0 ? +s.hrl : 125140;
  // the run's own figures (planFromSettings): the State Pension it pays — the one entered, or the one it assumes when none
  // is (p.spAssumed), as a weekly amount or a yearly one — from its run year, and the other income it pays each run year
  // (a final-salary pension, income streams, other income; one-off sums left out). So the floor is what the run paid.
  if (p && (isNum(p.spAnnual) || Array.isArray(p.otherIncomeByYear))) {
    const sp = isNum(p.spAnnual) && p.spAnnual > 0 && k >= (isNum(p.spStartYear) ? p.spStartYear : 99) ? p.spAnnual : 0;
    const o = Array.isArray(p.otherIncomeByYear) && p.otherIncomeByYear.length ? p.otherIncomeByYear : null;
    const other = o ? +o[Math.max(0, Math.min(k, o.length - 1))] || 0 : 0;
    const g = sp + other;
    return g > 0 ? Math.round(grossToNet(g, pa, brl, hrl)) : 0;
  }
  let timing;
  try { timing = deriveTiming(s, now); } catch { return null; }
  const lived = p && p.yearOffset > 0 ? p.yearOffset : 0;
  const gross = guaranteedAtYear(s, timing, timing.shapeAgeNow || (p && p.startAge) || 57, lived + k, now);
  return gross > 0 ? Math.round(grossToNet(gross, pa, brl, hrl)) : 0;
}
