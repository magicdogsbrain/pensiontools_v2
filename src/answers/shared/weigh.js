/**
 * The chance the money lasts as long as you do (research/v7/replan-nov-2026.md 5; 7.8.0): each future that runs out
 * counts by the chance that someone in the household is still alive when it does.
 *
 *   weigherOf(plan, inputs, env)     the weights of one engine plan, built once: byMonth[m] = round(S(d + m/12) × 2^30),
 *                                    m the month of the drawing years a future runs out in (0 … 12·years), S the joint
 *                                    survival from the drawing start d = plan.yearsFromNow (dying before money is drawn
 *                                    never counts as the money lasting). Each lookup is O(1).
 *   weightOf(weigher, m)             one future's weight: 0 when it lasted (m null)
 *   weightedFails(weigher, months)   the whole-number sum over the futures that ran out
 *   weightedChance(weigher, months)  1 − sum / (n × 2^30): the chance, weighted
 *   failsBound(n, t)                 floor(t·n/20): the count a level's twentieths allow when every weight is whole
 *   levelT(level)                    a level's twentieths (LEVEL_FAILS20), from any value said for one (levelOf)
 *   passes(sumW, n, t)               the one test (rules.js)
 *
 * Every weight is a whole number no bigger than 2^30, so a sum of up to 1,000 is exact whatever the order it is added in,
 * and the test is the same on every engine. With SUCCESS.weighted false (the rollback) every weight is 2^30: one whole
 * future, the count before 7.8.0.
 *
 * env.today: the day (its year gives each person's year of birth). For tests only: env.weighted (true or false, in place
 * of SUCCESS.weighted), env.lifeTable (another table in LongevityModel's shape), env.weightToAge (the weighting age).
 *
 * Pure: no clock, no storage. The people's sex is read from the inputs (`you.sex`, `partner.sex`); not said reads the
 * women's figures.
 */
import { SUCCESS, WEIGHT_ONE, passes, LEVEL_FAILS20, levelOf } from './rules.js';
import { LIFE_TABLE, jointSurvivalOf, horizonEndAge, weightToAge, sexKey } from '../../services/LongevityModel.js';

export { passes, WEIGHT_ONE };

const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
const yearOf = (today) => Number(String(today || '').slice(0, 4));

/** Whether this env weighs: env.weighted (tests) or SUCCESS.weighted. */
export const weighs = (env) => (env && typeof env.weighted === 'boolean' ? env.weighted : SUCCESS.weighted);

/** A level's whole twentieths of weighted failure. */
export const levelT = (level) => LEVEL_FAILS20[levelOf(level)];

/** floor(t·n/20) in whole numbers: what a level allows when every weight is one whole future. */
export const failsBound = (n, t) => Math.floor((t * n) / 20);

/** The sex an answer's inputs say for `who`, as the tables read it ('m' | 'f'; not said: 'f'). */
export const sexOfInputs = (inputs, who) => sexKey(inputs && inputs[who] ? inputs[who].sex : undefined);

/**
 * The people of an engine plan as the life tables read them: age today (whole), year of birth (today's year less the
 * age), sex from the inputs. In plan order.
 */
export function lifePeopleOf(plan, inputs, today) {
  const year = yearOf(today || plan.today);
  return plan.people.map((p) => ({ who: p.who, age: p.ageToday, by: year - p.ageToday, sex: sexOfInputs(inputs, p.who) }));
}

/**
 * The weights of one engine plan (enginePlan's: people with ageToday, yearsFromNow, years).
 * @returns {{ weighted: boolean, byMonth: Float64Array, months: number, d: number, years: number, people: object[],
 *   planToAge: number, weightToAge: number }}
 *   months: the last month a run reaches (12 × years); planToAge / weightToAge: the two ages from the tables (the run's
 *   end age when not weighing)
 */
export function weigherOf(plan, inputs, env = {}) {
  const weighted = weighs(env);
  const table = (env && env.lifeTable) || LIFE_TABLE;
  const d = isNum(plan.yearsFromNow) ? plan.yearsFromNow : 0;
  const months = 12 * plan.years;
  const byMonth = new Float64Array(months + 1);
  const people = lifePeopleOf(plan, inputs, env && env.today);
  let planToAge, toAge;
  if (!weighted) {
    byMonth.fill(WEIGHT_ONE);
    planToAge = plan.endAge;
    toAge = plan.endAge;
  } else {
    const S = jointSurvivalOf(people, d, table);
    for (let m = 0; m <= months; m++) byMonth[m] = Math.round(S(d + m / 12) * WEIGHT_ONE);
    planToAge = horizonEndAge({ people, d, table });
    toAge = isNum(env.weightToAge) ? env.weightToAge : weightToAge({ people, d, table });
  }
  return { weighted, byMonth, months, d, years: plan.years, people, planToAge, weightToAge: toAge, tablesVersion: table.tablesVersion || null };
}

/**
 * One future's weight from the month it ran out in (null: it lasted, 0). A month past the run's end reads the last; a
 * failure with no month counts whole (the cautious side).
 */
export function weightOf(weigher, m) {
  if (m === null || m === undefined) return 0;
  const w = weigher.byMonth;
  if (!isNum(m) || m <= 0) return w[0];
  return w[Math.min(weigher.months, Math.floor(m))];
}

/** The whole-number sum of the weights of the futures that ran out (null = lasted). */
export function weightedFails(weigher, months) {
  let sum = 0;
  for (let i = 0; i < months.length; i++) sum += weightOf(weigher, months[i]);
  return sum;
}

/** The weighted chance the money lasts: 1 − sum / (n × 2^30). */
export function weightedChance(weigher, months) {
  const n = months.length;
  return n ? 1 - weightedFails(weigher, months) / (n * WEIGHT_ONE) : 1;
}
