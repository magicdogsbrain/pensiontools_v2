/**
 * Tax-Boost Strategy — the single "catch up after a downturn" decision both engines use.
 *
 * During protection the SIPP draw is reduced, leaving a shortfall against the standard draw.
 * Once the portfolio recovers, spread that shortfall back over the rest of the tax year — but
 * only while it stays tax-efficient (under the basic-rate limit) and there's growth surplus to
 * fund it. Crucially, cap the catch-up PER MONTH so it can never cram a whole year's shortfall
 * into the final month (the old decision-engine behaviour produced "draw £17k this March").
 *
 * Pure. Returns the extra SIPP to add THIS month (0 if no boost is warranted).
 */

export const BOOST_DEFAULTS = {
  MAX_FRACTION: 0.5,      // per-month cap = this fraction of the standard monthly draw
  MIN_BOOST: 50,          // ignore trivially small boosts
  SURPLUS_BUFFER: 15000   // growth must exceed min by this before any boost is funded
};

/**
 * @param {object} p
 * @param {number} p.shortfall - protection shortfall still to recover this tax year (>0 to boost)
 * @param {number} p.standardMonthly - the standard monthly SIPP draw (basis for the per-month cap)
 * @param {number} p.remainingMonths - months left in the tax year, incl. this one (>=1)
 * @param {number} p.surplus - growth surplus above (min + buffer) available to fund the boost
 * @param {number} [p.brlHeadroom=Infinity] - basic-rate-limit headroom on projected annual taxable;
 *        the boost is spread within this so annual income stays basic-rate. Infinity to skip.
 * @param {number} [p.maxFraction] - per-month cap as a fraction of the standard draw
 * @param {number} [p.minBoost]
 * @returns {number} extra SIPP to draw this month (0 if none)
 */
export function planTaxBoost({
  shortfall,
  standardMonthly,
  remainingMonths,
  surplus,
  brlHeadroom = Infinity,
  maxFraction = BOOST_DEFAULTS.MAX_FRACTION,
  minBoost = BOOST_DEFAULTS.MIN_BOOST
}) {
  if (!(shortfall > 0) || !(surplus > 0) || remainingMonths < 1) return 0;

  // Spread the shortfall and the available surplus over the remaining months...
  const candidates = [shortfall / remainingMonths, surplus / remainingMonths];
  // ...keep it basic-rate (spread the BRL headroom too)...
  if (Number.isFinite(brlHeadroom)) {
    if (brlHeadroom <= 0) return 0;
    candidates.push(brlHeadroom / remainingMonths);
  }
  // ...but never exceed the absolute per-month cap (this is what stops the end-of-year cram).
  candidates.push(standardMonthly * maxFraction);

  const boost = Math.min(...candidates);
  return boost > minBoost ? boost : 0;
}

// ---------------------------------------------------------------------------------------------
// Band-fill-and-recycle — deliberately draw SIPP up to the basic-rate limit even when the
// spending target doesn't need it, and move the net surplus into the ISA. Pays 20% now to
// avoid a potentially higher (or simply certain) tax charge on the same money later; the user
// opts in per plan. Only meaningful when withdrawals are fully taxable (taxFreeFraction 0):
// during a UFPLS phase the tax-free quarter already does better than recycling.
// ---------------------------------------------------------------------------------------------

export const RECYCLE_DEFAULTS = {
  ISA_ANNUAL_ALLOWANCE: 20000,  // net cap per tax year on what can be recycled INTO the ISA
  MIN_RECYCLE: 50               // ignore trivially small monthly recycles
};

/**
 * Monthly band-fill recycle decision. Pure; both engines call this.
 * @param {object} p
 * @param {number} p.brlHeadroom - unused basic-rate headroom on the year's projected taxable
 * @param {number} p.remainingMonths - months left in the tax year, incl. this one (>=1)
 * @param {number} p.isaAllowanceLeft - net ISA subscription room left this tax year
 * @param {number} [p.basicRate=0.20]
 * @returns {{gross: number, net: number}} extra SIPP gross to draw this month and the net
 *          amount (after basic-rate tax) to contribute to the ISA. {0,0} if not worthwhile.
 */
export function planBandFillRecycle({ brlHeadroom, remainingMonths, isaAllowanceLeft, basicRate = 0.20 }) {
  if (!(brlHeadroom > 0) || !(remainingMonths >= 1) || !(isaAllowanceLeft > 0)) return { gross: 0, net: 0 };
  let gross = brlHeadroom / remainingMonths;
  let net = gross * (1 - basicRate);
  const netCap = isaAllowanceLeft / remainingMonths;
  if (net > netCap) { net = netCap; gross = net / (1 - basicRate); }
  if (net < RECYCLE_DEFAULTS.MIN_RECYCLE) return { gross: 0, net: 0 };
  return { gross, net };
}
