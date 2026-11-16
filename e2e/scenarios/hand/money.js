/**
 * Money worked by hand for the scenario tests (2026/27). Nothing here comes from the app: tax is the hand-written oracle
 * (tests/v7/oracles/ukTax.mjs, which imports nothing from src/), everything else is a sum written out below.
 *
 *   relief at source     what leaves take-home pay × 1.25 goes into the pension; going in × 0.8 leaves take-home pay
 *   a share of pay       pct % × yearly pay ÷ 12, a month
 *   the 20% band         net = 0.8 × gross + 2,514 for income that is all taxable (2,514 = 20% of the £12,570 allowance)
 *                        net = 0.85 × gross + 2,514 when a quarter of each withdrawal is tax-free (0.75 × 20% = 15%)
 */
import { ukTax, pocketFromPot, TODAY } from '../../../tests/v7/oracles/ukTax.mjs';

export { ukTax, pocketFromPot, TODAY };

/** The personal allowance and the 20% band's top, 2026/27. */
export const ALLOWANCE = 12570;
export const BASIC_TOP = 50270;
/** 20% of the allowance: what the allowance is worth a year to someone paying basic-rate tax. */
export const ALLOWANCE_WORTH = 0.2 * ALLOWANCE;               // 2,514

/** Rounded to the penny, as a person would write a sum down. */
export const pence = (x) => Math.round(x * 100) / 100;
/** Rounded to the pound, as the site shows money. */
export const pounds = (x) => Math.round(x);

/** A yearly sum a month. */
export const monthly = (yearly) => yearly / 12;
/** A monthly sum a year. */
export const yearly = (perMonth) => perMonth * 12;
/** pct % of a yearly pay, a month. */
export const shareOfPay = (pct, pay) => (pct / 100) * pay / 12;

/** Relief at source: what goes into the pension for an amount that leaves take-home pay. */
export const goingIn = (fromTakeHome) => fromTakeHome * 1.25;
/** Relief at source, backwards: what leaves take-home pay for an amount going in. */
export const fromTakeHome = (goingInAmount) => goingInAmount * 0.8;

/** Months × a monthly amount. */
export const months = (n, perMonth) => n * perMonth;

/** Before tax, a year, for `net` after tax when everything is taxable and inside the 20% band: (net − 2,514) ÷ 0.8. */
export function grossAllTaxable(net) {
  const g = (net - ALLOWANCE_WORTH) / 0.8;
  if (g > BASIC_TOP) throw new Error(`grossAllTaxable: £${net} after tax is above the 20% band; use ukTax`);
  return g;
}

/** Before tax, a year, for `net` after tax when a quarter of each withdrawal is tax-free (inside the 20% band): (net − 2,514) ÷ 0.85. */
export function grossQuarterFree(net) {
  const g = (net - ALLOWANCE_WORTH) / 0.85;
  if (g * 0.75 > BASIC_TOP) throw new Error(`grossQuarterFree: £${net} after tax is above the 20% band; use ukTax`);
  return g;
}

/**
 * What reaches a person from one month's withdrawal when the year's allowance is already used (by pay earned earlier
 * in the tax year): a quarter tax-free, the rest at 20%.  taken − 0.75 × taken × 0.2.
 */
export const reachesWhenAllowanceUsed = (taken, { quarterFree = true } = {}) => taken - (quarterFree ? 0.75 : 1) * taken * 0.2;

/** What to take a month for `net` to reach a person when the allowance is used and a quarter is tax-free: net ÷ 0.85. */
export const takeForWhenAllowanceUsed = (net) => net / 0.85;

/** Tax on one month of a steady yearly income, all taxable: (yearly − 12,570) × 0.2 ÷ 12 inside the 20% band. */
export const monthlyTaxAllTaxable = (yearlyGross) => Math.max(0, yearlyGross - ALLOWANCE) * 0.2 / 12;

/** Extra relief a higher-rate payer can claim on a year's pay-in going in: 20% of the part of it that sits in the 40% band. */
export function higherRateClaim(pay, goingInYear) {
  const above = Math.max(0, pay - BASIC_TOP);
  return 0.2 * Math.min(above, goingInYear);
}
