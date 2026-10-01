/**
 * Fund and platform charges — ONE setting per plan, both apps (6.19.0; research/charges-setting.md).
 *
 * The owner's decision (1 Oct 2026): "Yes half a percent. But put it as a config parameter somewhere - like in the
 * various plan settings." So a plan carries `chargesPct` — a percent a year (0.5 means 0.5% a year), 0 to 3 in steps
 * of 0.05 — in its Stress settings (today's planner) or on its household (V7's preview).
 *
 * WHAT IS CHARGED. Every month, while saving AND while drawing, the money held in funds and cash inside pensions, ISAs
 * and taxable accounts: the shares, bonds, cash, diversifiers and break-glass reserve pots, the ISA, the taxable
 * account (GIA) — except the gilts it holds directly — and V7's savings. Each charged pot is multiplied by
 * monthlyChargeFactor(pct) = (1 − pct/100)^(1/12) straight after that month's growth, so twelve months take off exactly
 * pct% of what is held. NOT charged: State Pensions, final-salary pensions and annuities, which have no such charge,
 * and gilts held directly (a ladder's rungs, the GIA's gilt share), for which platforms usually charge a small fixed fee.
 *
 * ABSENT MEANS 0 — in every engine. A plan locked before charges were added has no stored value and must keep its
 * figures (the lock promises they do not move), so `chargesPctOf` reads a missing, null or invalid value as 0, and an
 * engine config without `chargesPct` runs exactly as it did before this module existed (the multiply is skipped). The
 * 0.5 default is WRITTEN — by the new-plan template, the schema v2 migration (unlocked plans only), unlock, and V7's
 * household model — never inferred here or inside an engine.
 *
 * Pure: no DOM, no storage, no clock.
 */

/** The default for a new plan, a migrated unlocked plan and every V7 answer: 0.5% a year. */
export const DEFAULT_CHARGES_PCT = 0.5;

/** The setting's range and step, as the screens offer it: 0% to 3% a year in steps of 0.05%. */
export const CHARGES_LIMITS = Object.freeze({ min: 0, max: 3, step: 0.05 });

const isFiniteNumber = (v) => typeof v === 'number' && Number.isFinite(v);

/** Whether `v` is a charge the engines take as given: a finite number of percent from 0 to 3. */
export function isChargesPct(v) {
  return isFiniteNumber(v) && v >= CHARGES_LIMITS.min && v <= CHARGES_LIMITS.max;
}

/**
 * The charge a plan's settings (or an engine config) carry, in percent a year — the stored value when it is a valid
 * one, otherwise 0. A locked plan from before charges has no key and so runs without them.
 * @param {object} settings   Stress settings, an engine config, or a V7 household — anything with `chargesPct`
 * @returns {number}
 */
export function chargesPctOf(settings) {
  const v = settings && typeof settings === 'object' ? settings.chargesPct : undefined;
  return isChargesPct(v) ? v : 0;
}

/**
 * The monthly factor a charged pot is multiplied by after the month's growth: exactly 1 at 0% (so a run without
 * charges is the run it always was, bit for bit), else (1 − pct/100)^(1/12). An invalid pct reads as 0.
 * @param {number} pct   percent a year (0.5 = 0.5%)
 */
export function monthlyChargeFactor(pct) {
  if (!isChargesPct(pct) || pct === 0) return 1;
  return Math.pow(1 - pct / 100, 1 / 12);
}

/**
 * A typed-in charge made fit to store: clamped to 0–3 and put on the 0.05 grid (to two decimals). null when it is not
 * a number at all — the caller keeps what was there.
 * @param {number|string} v
 * @returns {number|null}
 */
export function normaliseChargesPct(v) {
  const n = typeof v === 'string' ? (v.trim() === '' ? NaN : Number(v)) : v;
  if (!isFiniteNumber(n)) return null;
  const clamped = Math.min(CHARGES_LIMITS.max, Math.max(CHARGES_LIMITS.min, n));
  return Math.round(Math.round(clamped / CHARGES_LIMITS.step) * CHARGES_LIMITS.step * 100) / 100;
}

/**
 * The share of a pot left after `years` whole years of charges at `pct` — (1 − pct/100)^years, exactly 1 at 0%.
 * For the yearly projections (an ISA grown a year at a time) that have no monthly loop of their own.
 */
export function yearlyChargeFactor(pct, years = 1) {
  if (!isChargesPct(pct) || pct === 0 || !(years > 0)) return 1;
  return Math.pow(1 - pct / 100, years);
}
