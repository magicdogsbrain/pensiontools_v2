/**
 * Longevity Model — how long people live, from the ONS cohort life tables (England and Wales, 2024-based; the data file
 * src/data/onsCohort2024.json is built by scripts/ons-cohort.py, provenance in research/v7/ons-life-tables.md).
 *
 * Planning to the average age means a 50% chance of outliving the plan, so the default plan-to age is the age with 1 in
 * 10 still alive (Kitces, Retirement Researcher), and the money is followed on to the age with 1 in 50 still alive.
 *
 *   LIFE_TABLE                          the file: { scale, firstBirthYear, lastBirthYear, ageTo, m: { '1935': [fromAge, q…] }, f }
 *   HORIZON                             { planToShare: 0.10, weightShare: 0.02, ageCap: 105 }
 *   sexKey(sex, fallback?)              'm' | 'f' from any way it is said; not said reads the women's figures
 *   q(age, by, sex, table?)             the chance someone born in year `by` (a fraction is read between two years of birth),
 *                                       alive at whole age `age`, dies before their next birthday
 *   survival(ageNow, by, sex, years, table?)   P(alive `years` on | alive at ageNow)
 *   jointSurvival(people, years, d?, table?)   P(at least one alive `years` from today | all alive `d` years from today)
 *   horizonYears(people, share, d?, table?)    years from today to the first whole month after `d` where that is ≤ share
 *   horizonEndAge({ people, today, d, table }) the plan-to age (1 in 10), the younger person's, rounded up
 *   weightToAge({ people, today, d, table })   the weighting age (1 in 50), rounded up
 *   longevityAge(age, sex, pct, today?)        the age `pct`% of people live beyond, rounded up (the planners' suggestion)
 *   suggestedDuration(age, sex, pct, today?)   years from now to it
 *
 * A person is { age, sex, by? }: `age` in years today (whole on the answers side, exact on the plan side), `by` the year
 * of birth (a fraction allowed; default the year of `today` less the age). Within a year of age deaths are spread evenly:
 * from u into the year, S(x+u → x+u+f) = (1 − (u+f)·q) / (1 − u·q). Only ×, + and ÷ are used on a figure, so every
 * engine gives the same bits.
 *
 * Clamps: born after the last year of birth reads it, before the first reads the first (the longer-lived side); an age
 * below a line's first age reads its first; above `ageTo`, q = 1.
 *
 * Pure: no clock unless `today` is left out of longevityAge / suggestedDuration (the classic planner's helper).
 */
import TABLE_2024 from '../data/onsCohort2024.json' with { type: 'json' };

export const LIFE_TABLE = TABLE_2024;

/** The two shares of people still alive the ages are read at, and the oldest age either may be. */
export const HORIZON = Object.freeze({ planToShare: 0.10, weightShare: 0.02, ageCap: 105 });

const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
/** The oldest age a horizon is looked for at (a table that runs further, as a test's, is not searched past it). */
const SEARCH_TO = 150;

/** 'm' or 'f': 'm'/'male' read the men's figures, 'f'/'female'/'notSaid' the women's; anything else `fallback`. */
export function sexKey(sex, fallback = 'f') {
  if (sex === 'm' || sex === 'male') return 'm';
  if (sex === 'f' || sex === 'female' || sex === 'notSaid') return 'f';
  return fallback === 'm' ? 'm' : 'f';
}

/** The year of a 'YYYY-MM-DD' day or a Date; the clock's year when there is none. */
function yearOf(today) {
  if (typeof today === 'string' && /^\d{4}/.test(today)) return Number(today.slice(0, 4));
  if (today instanceof Date && !Number.isNaN(today.getTime())) return today.getFullYear();
  return new Date().getFullYear();
}

/**
 * One person's line of death rates: x (a whole age) → q. A fractional year of birth is read on a straight line between
 * the two years either side; each is clamped to the file's years first.
 */
function lineOf(by, sex, table = LIFE_TABLE) {
  const s = sexKey(sex);
  const first = table.firstBirthYear, last = table.lastBirthYear;
  const b = Math.min(last, Math.max(first, isNum(by) ? by : last));
  const b0 = Math.floor(b);
  const frac = b - b0;
  const A = table[s][String(b0)];
  const B = frac > 0 ? table[s][String(Math.min(last, b0 + 1))] : A;
  const scale = table.scale, top = table.ageTo;
  const at = (arr, x) => arr[Math.min(arr.length - 1, 1 + Math.max(x, arr[0]) - arr[0])];
  return (x) => {
    if (x > top) return 1;
    const qa = at(A, x) / scale;
    if (B === A) return qa;
    return qa + (at(B, x) / scale - qa) * frac;
  };
}

/** P(alive at x0 + years | alive at x0) on one line: a product over the years of age, each (1 − (u+f)q) / (1 − uq). */
function survivalOn(line, x0, years) {
  if (!(years > 0)) return 1;
  const end = x0 + years;
  let x = x0;
  let s = 1;
  while (x < end) {
    const xi = Math.floor(x);
    const top = Math.min(xi + 1, end);
    const u = x - xi;
    const q = line(xi);
    const den = 1 - u * q;
    if (!(den > 0)) return 0;
    s *= (1 - (u + (top - x)) * q) / den;
    if (!(s > 0)) return 0;
    x = top;
  }
  return s;
}

/** The chance someone born in `by`, alive at whole age `age`, dies before their next birthday. */
export function q(age, by, sex, table = LIFE_TABLE) {
  return lineOf(by, sex, table)(Math.floor(age));
}

/** P(alive `years` from now | alive now at `ageNow`), for someone born in `by`. */
export function survival(ageNow, by, sex, years, table = LIFE_TABLE) {
  return survivalOn(lineOf(by, sex, table), ageNow, years);
}

/** People as the functions here read them: { age, by, sex } with `by` from `today` when not given. */
function peopleOf(people, today) {
  const list = (Array.isArray(people) ? people : [people]).filter((p) => p && isNum(p.age));
  if (!list.length) throw new Error('LongevityModel: no one with an age');
  const year = list.every((p) => isNum(p.by)) ? null : yearOf(today);
  return list.map((p) => ({ age: p.age, by: isNum(p.by) ? p.by : year - p.age, sex: sexKey(p.sex) }));
}

/** A household's joint survival as a function of t (years from today), conditional on all alive at d. */
function jointOn(people, d, table) {
  const lines = people.map((p) => lineOf(p.by, p.sex, table));
  return (t) => {
    if (!(t > d)) return 1;
    // 1 − Π(1 − S_j), added up one person at a time (J + S·(1 − J)): one person's is their own S to the bit, and a
    // second person never lowers it
    let joint = 0;
    for (let j = 0; j < people.length; j++) joint += survivalOn(lines[j], people[j].age + d, t - d) * (1 - joint);
    return joint;
  };
}

/**
 * P(at least one of `people` is alive `years` from today | all of them are alive `d` years from today). Lives are taken
 * as independent. One person: their own survival from d.
 * @param {{ age: number, by: number, sex: string }[]} people
 */
export function jointSurvival(people, years, d = 0, table = LIFE_TABLE) {
  return jointOn(peopleOf(people, null), d, table)(years);
}

/**
 * The joint survival as a function of t (years from today) for repeated reads (the weights of every month): the same
 * figure jointSurvival gives, with each person's line looked up once.
 */
export function jointSurvivalOf(people, d = 0, table = LIFE_TABLE) {
  return jointOn(peopleOf(people, null), d, table);
}

/**
 * Years from today to the first whole month after the drawing start `d` where the joint survival (from d) is at or below
 * `share`: t_H = d + m/12. The survival only falls with time, so the month is found by halving. Infinity if it never is
 * (a table where nobody dies).
 */
export function horizonYears(people, share, d = 0, table = LIFE_TABLE) {
  const ps = peopleOf(people, null);
  const S = jointOn(ps, d, table);
  const youngest = Math.min(...ps.map((p) => p.age + d));
  let hi = 12 * Math.max(1, Math.ceil(Math.min(table.ageTo, SEARCH_TO) + 2 - youngest));
  if (!(S(d + hi / 12) <= share)) return Infinity;
  let lo = 0;                                                    // S(d) = 1: never at or below a share under 1
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (S(d + mid / 12) <= share) hi = mid; else lo = mid;
  }
  return d + hi / 12;
}

/** Whole age, rounded up: a figure a hair over a whole number from binary fractions is read as that number. */
const upTo = (x) => Math.ceil(x - 1e-9);

/**
 * The plan-to age: the younger person's age at the 1-in-10 point (joint: fewer than 1 in 10 households with one of them
 * alive), rounded up, at least 5 years after the drawing start and at most 105.
 * @param {{ people: object[], today?: string, d?: number, table?: object }} o
 */
export function horizonEndAge({ people, today = null, d = 0, table = LIFE_TABLE } = {}) {
  const ps = peopleOf(people, today);
  const younger = Math.min(...ps.map((p) => p.age));
  const t = horizonYears(ps, HORIZON.planToShare, d, table);
  return Math.min(HORIZON.ageCap, Math.max(upTo(younger + d + 5), upTo(younger + t)));
}

/** The weighting age: the younger person's age at the 1-in-50 point, rounded up, at most 105. */
export function weightToAge({ people, today = null, d = 0, table = LIFE_TABLE } = {}) {
  const ps = peopleOf(people, today);
  const younger = Math.min(...ps.map((p) => p.age));
  return Math.min(HORIZON.ageCap, upTo(younger + horizonYears(ps, HORIZON.weightShare, d, table)));
}

/**
 * The age a person of `age` has a `pct`% chance of living beyond, rounded up (the planners' "Suggest" for the plan-to
 * age; 10, 25 or 50).
 * @param {number} age   age today (65 when not given)
 * @param {'m'|'f'|'male'|'female'|'notSaid'} [sex]   men's figures unless said otherwise (not said: women's)
 * @param {number} [pct]   10 unless a share between 0 and 100
 * @param {string|Date|null} [today]   the day (its year gives the year of birth); the clock when left out
 */
export function longevityAge(age, sex = 'm', pct = 10, today = null) {
  const a = isNum(age) && age > 0 ? age : 65;
  const share = isNum(pct) && pct > 0 && pct < 100 ? pct / 100 : 0.10;
  const t = horizonYears([{ age: a, by: yearOf(today) - a, sex: sexKey(sex, 'm') }], share, 0);
  return upTo(a + t);
}

/** Suggested plan duration (years) for the given person and survival percentile. */
export function suggestedDuration(age, sex = 'm', pct = 10, today = null) {
  return Math.max(1, longevityAge(age, sex, pct, today) - Math.round(age || 65));
}
