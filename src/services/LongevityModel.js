/**
 * Longevity Model — "plan to what age?" from ONS-style cohort life expectancies.
 *
 * The consensus best practice (Kitces, Retirement Researcher) is a FIXED horizon set from a
 * SURVIVAL PERCENTILE rather than the average: planning to average life expectancy means a
 * 50% chance of outliving the plan. The default suggestion here is the 10%-survival age
 * ("1-in-10 chance of living beyond") — deliberately conservative, per the app's
 * slightly-pessimistic preference. Users can pick 25% or 50% instead.
 *
 * FIGURES: approximate UK cohort estimates in the style of the ONS "How long will my pension
 * need to last?" calculator (2020s-era cohort tables, rounded to whole years). They are
 * deliberately coarse — a one-year error in the horizon is well inside the uncertainty the
 * Monte Carlo already models. Table keyed by current age (55–75, interpolated between rows).
 */

const TABLE = {
  //        male:  [p50, p25, p10]   female: [p50, p25, p10]
  55: { m: [84, 91, 96], f: [87, 93, 97] },
  60: { m: [85, 91, 96], f: [87, 93, 97] },
  65: { m: [85, 92, 96], f: [88, 93, 98] },
  70: { m: [86, 92, 96], f: [88, 94, 98] },
  75: { m: [87, 92, 97], f: [89, 94, 98] }
};
const P_INDEX = { 50: 0, 25: 1, 10: 2 };

/**
 * Age a person of `age`/`sex` has roughly a `percentile`% chance of living beyond.
 * @param {number} age - current age (clamped to the 55–75 table range)
 * @param {'m'|'f'} sex
 * @param {50|25|10} percentile - survival probability
 * @returns {number} target planning age (whole years)
 */
export function longevityAge(age, sex = 'm', percentile = 10) {
  const idx = P_INDEX[percentile] ?? 2;
  const s = sex === 'f' ? 'f' : 'm';
  const a = Math.max(55, Math.min(75, age || 65));
  const lo = Math.floor(a / 5) * 5;
  const hi = Math.min(75, lo + 5);
  const vLo = TABLE[lo][s][idx];
  const vHi = TABLE[hi][s][idx];
  const t = hi === lo ? 0 : (a - lo) / (hi - lo);
  return Math.round(vLo + (vHi - vLo) * t);
}

/** Suggested plan duration (years) for the given person and survival percentile. */
export function suggestedDuration(age, sex = 'm', percentile = 10) {
  return Math.max(1, longevityAge(age, sex, percentile) - Math.round(age || 65));
}
