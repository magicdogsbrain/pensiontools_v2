/**
 * How ISAs and savings grow — ONE setting per plan, both apps (6.22.0; research/saver-lock-and-savings-growth.md 3).
 *
 * The owner's decision (2 Oct 2026): every ISA grew at a fixed 3% a year whatever prices did. A plan now says how its
 * ISA and savings grow, with two choices:
 *   - 'cash'     "Mostly cash" (the default for new plans and V7): the ISA grows each month exactly as the pension's cash
 *                does — last year's rise in prices less 1%, never below nothing (SimulationEngine's cash model, FCA-based);
 *   - 'invested' "Invested like my pension": each month the pension's own three factors — shares, bonds, cash — weighted
 *                by the pension's mix, on the same future. No new random draw (the bonds factor is the one the pension's
 *                bonds drew), which is why this is not the tagged-funds path (`isaMix`), which draws its own bond returns.
 *                The diversifiers and the break-glass reserve are the pension's crisis reserve, not its mix: left out.
 *
 * NO SETTING MEANS TODAY'S FIXED RATE — in every engine. A plan locked before the choice existed has no stored value and
 * must keep its figures, so `isaGrowthOf` reads a missing or invalid value as null, and an engine config without
 * `isaGrowth` grows the ISA at `isaReturn` (ISA_DEFAULTS.RETURN, 3%) exactly as before this module. The default ('cash') is
 * WRITTEN — by the new-plan template, the V7 seed and household, the schemaVersion 3 migration (unlocked plans only),
 * reset, an unlocked copy and unlock — never inferred here or inside an engine, and never put in the defaults merged under
 * stored plans (that would hand it to every locked plan).
 *
 * The tagged ISA funds still win: a plan whose fund list holds ISA-wrapped funds runs its ISA at those funds
 * (`config.isaMix`) whatever this setting says.
 *
 * Pure: no DOM, no storage, no clock. Imported by both engines (SimulationEngine.simulate, answers/shared/fastEngine.js),
 * which call the SAME functions below so their arithmetic is the same to the bit.
 */

/** The two choices. */
export const ISA_GROWTH = Object.freeze({ CASH: 'cash', INVESTED: 'invested' });

/** The two choices in the order the screens offer them ("Mostly cash" first). */
export const ISA_GROWTH_VALUES = Object.freeze([ISA_GROWTH.CASH, ISA_GROWTH.INVESTED]);

/** The choice a new plan, a migrated unlocked plan and every V7 answer start with: "Mostly cash". */
export const DEFAULT_ISA_GROWTH = ISA_GROWTH.CASH;

/** SimulationEngine.CASH_REAL_SPREAD, as written there (this module cannot import the engine that imports it). */
export const ISA_CASH_SPREAD = -0.01;

/** Whether `v` is one of the two choices. */
export const isIsaGrowth = (v) => v === ISA_GROWTH.CASH || v === ISA_GROWTH.INVESTED;

/**
 * The plan's choice, or null when it has none — a plan locked before the choice existed (the engines then run today's
 * fixed rate).
 * @param {object} settings   Stress settings, an engine config, or a V7 household — anything with `isaGrowth`
 * @returns {'cash' | 'invested' | null}
 */
export function isaGrowthOf(settings) {
  const v = settings && typeof settings === 'object' ? settings.isaGrowth : undefined;
  return isIsaGrowth(v) ? v : null;
}

const finiteNonNeg = (v) => typeof v === 'number' && Number.isFinite(v) && v >= 0;

/** Whether `m` is a mix the "invested" weights can be read from: three finite shares, none below nought, some above. */
export function isIsaGrowthMix(m) {
  return Boolean(m) && typeof m === 'object' && finiteNonNeg(m.equity) && finiteNonNeg(m.bond) && finiteNonNeg(m.cash)
    && m.equity + m.bond + m.cash > 0;
}

/**
 * "Invested like my pension": the weights of the month's three factors, as shares of the whole, worked out once per run.
 * An explicit mix (`config.isaGrowthMix` — V7 always passes one, because a savings-only run has no pension) wins;
 * otherwise the run's own pension pots at the start (shares : bonds : cash), so the optimiser's trial mixes and the
 * pots-at-retirement scaling carry the ISA with them; with no pension at all, all cash.
 * @param {object} config   an engine config
 * @returns {{ equity: number, bond: number, cash: number }}
 */
export function isaGrowthWeights(config) {
  const c = config || {};
  if (isIsaGrowthMix(c.isaGrowthMix)) {
    const m = c.isaGrowthMix;
    const t = m.equity + m.bond + m.cash;
    return { equity: m.equity / t, bond: m.bond / t, cash: m.cash / t };
  }
  const e = finiteNonNeg(c.equityStart) ? c.equityStart : 0;
  const b = finiteNonNeg(c.bondStart) ? c.bondStart : 0;
  const k = finiteNonNeg(c.cashStart) ? c.cashStart : 0;
  const t = e + b + k;
  if (!(t > 0)) return { equity: 0, bond: 0, cash: 1 };
  return { equity: e / t, bond: b / t, cash: k / t };
}

/**
 * The weights in a year of the rising-equity glidepath ("bond tent"): the shares-and-bonds part re-split by the year's
 * share, as the pension's growth pots are; cash unchanged. `glideShare` null (no tent): the weights as they are.
 */
export function glidedIsaWeights(w, glideShare) {
  if (glideShare === null || glideShare === undefined) return w;
  const growth = w.equity + w.bond;
  return { equity: growth * glideShare, bond: growth * (1 - glideShare), cash: w.cash };
}

/**
 * The month's "invested" factor: wE × the shares factor + wB × the bonds factor + wC × the cash factor, summed in that
 * order. Both engines call this one function, so the figure is the same to the bit.
 */
export function investedIsaFactor(w, fE, fB, fC) {
  return w.equity * fE + w.bond * fB + w.cash * fC;
}

/**
 * The yearly nominal rate the deterministic projections (the Timing block's pots at retirement, the retire-at-what-age
 * sweep) grow a "Mostly cash" ISA at: the cash rule at an assumed rise in prices, max(0, cpi − 1%) — 1.5% a year at the
 * planner's 2.5%.
 */
export function cashProjectionRate(cpi = 0.025) {
  return Math.max(0, cpi + ISA_CASH_SPREAD);
}
