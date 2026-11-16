/**
 * A year's need against money held, at today's value: what the years a plan pays from cash need, and what is held
 * outside a ladder to pay them.
 */

/** The need to the end of the cash years: the months left this tax year × the monthly draw, then each later year whole. */
export function cashYearsNeed({ monthsLeft, perMonth, laterYears = [] }) {
  return monthsLeft * perMonth + laterYears.reduce((s, y) => s + y, 0);
}

/** What is held outside the ladder at today's value: the sum of its lines. */
export const heldOutside = (values) => values.reduce((s, v) => s + v, 0);

/** Held against need: { spare } when there is enough, { short } when there is not. One of the two is 0. */
export function againstNeed(held, need) {
  return held >= need ? { spare: held - need, short: 0 } : { spare: 0, short: need - held };
}

/** Units still to buy of a gilt: what the plan holds less what is held, never below 0. */
export const unitsToBuy = (planUnits, heldUnits) => Math.max(0, planUnits - heldUnits);
