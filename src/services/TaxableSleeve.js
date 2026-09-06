/**
 * Taxable sleeve (a GIA — "general investment account").
 *
 * WHY THIS EXISTS. A lump sum in retirement — downsizing, an inheritance, a maturing policy —
 * cannot legally be put in a pension or an ISA at any speed that matters:
 *   • SIPP: TWO caps apply and the LOWER wins.
 *       (a) relief is capped at 100% of RELEVANT UK EARNINGS, or £3,600 gross if lower; and
 *       (b) the Annual Allowance — £60,000 normally, but only £10,000 (the MPAA) once you have
 *           flexibly accessed a DC pension, which anyone drawing taxable pension income has.
 *     So a retiree with no earnings can put in £3,600 a year; a retiree still earning £30,000
 *     is capped at £10,000 by the MPAA, NOT at their earnings.
 *   • ISA: £20,000 a year.
 * Everything else has to sit unwrapped and taxable. Before this module the app had nowhere to
 * put it, so windfalls were dropped straight into the SIPP or ISA and grew tax-free — which
 * overstated outcomes for anyone who entered one.
 *
 * TAX MODELLED (not a flat drag, because the drag differs enormously by asset):
 *   • Income: dividend yield on equities, coupon on bonds/gilts, interest on cash — taxed at the
 *     holder's marginal rate above the £500 dividend / £1,000 savings allowances.
 *   • Growth: CGT on realisation only, above the £3,000 annual exemption, tracking cost basis.
 *   • GILTS ARE SPECIAL and this is the point: UK gilts are exempt from CGT, so the whole
 *     inflation uplift on an index-linked gilt is tax-free and only the (tiny) coupon is taxed.
 *     A GIA gilt ladder therefore suffers almost no drag, while a GIA equity portfolio suffers
 *     real drag. A flat haircut would get this exactly backwards.
 */

export const GIA_DEFAULTS = {
  DIVIDEND_ALLOWANCE: 500,
  SAVINGS_ALLOWANCE_BASIC: 1000,
  SAVINGS_ALLOWANCE_HIGHER: 500,
  CGT_EXEMPTION: 3000,
  CGT_RATE_BASIC: 0.18,
  CGT_RATE_HIGHER: 0.24,
  DIV_RATE_BASIC: 0.0875,
  DIV_RATE_HIGHER: 0.3375,
  ISA_ALLOWANCE: 20000,
  SIPP_NO_EARNINGS_GROSS: 3600,   // relief is capped at 100% of relevant UK earnings, or this
  ANNUAL_ALLOWANCE: 60000,        // before any flexible access
  MPAA: 10000,                    // AFTER flexible access — which a drawdown plan has, by definition
  EQUITY_YIELD: 0.02,             // income thrown off, taxed as dividends
  BOND_YIELD: 0.04,               // corporate/convential bond coupon, taxed as savings income
  GILT_COUPON: 0.005              // index-linked gilt coupons are tiny; the uplift is CGT-FREE
};

/** A fresh sleeve. `basis` is the cost of what's held — gains above it are what CGT bites on. */
export function newSleeve(value = 0, mix = null) {
  return { value, basis: value, mix: mix || { equity: 1, bond: 0, gilt: 0, cash: 0 } };
}

/** Taxable income thrown off in a year, split by how HMRC treats it. */
export function sleeveIncome(sleeve) {
  const m = sleeve.mix, v = Math.max(0, sleeve.value);
  return {
    dividends: v * (m.equity || 0) * GIA_DEFAULTS.EQUITY_YIELD,
    savings: v * ((m.bond || 0) * GIA_DEFAULTS.BOND_YIELD + (m.gilt || 0) * GIA_DEFAULTS.GILT_COUPON + (m.cash || 0) * GIA_DEFAULTS.BOND_YIELD)
  };
}

/** Tax on a year's sleeve income, given the holder's marginal rate ('basic' | 'higher'). */
export function incomeTaxOnSleeve(sleeve, band = 'basic') {
  const { dividends, savings } = sleeveIncome(sleeve);
  const higher = band === 'higher';
  const divTaxable = Math.max(0, dividends - GIA_DEFAULTS.DIVIDEND_ALLOWANCE);
  const savAllow = higher ? GIA_DEFAULTS.SAVINGS_ALLOWANCE_HIGHER : GIA_DEFAULTS.SAVINGS_ALLOWANCE_BASIC;
  const savTaxable = Math.max(0, savings - savAllow);
  return divTaxable * (higher ? GIA_DEFAULTS.DIV_RATE_HIGHER : GIA_DEFAULTS.DIV_RATE_BASIC)
       + savTaxable * (higher ? 0.40 : 0.20);
}

/**
 * Withdraw `amount` of CASH from the sleeve, paying CGT on the realised gain.
 * Gilts are CGT-exempt, so only the non-gilt share of the gain is chargeable.
 * @returns {{ taken, cgt, net }} — `net` is what reaches the pocket after CGT.
 */
export function withdrawFromSleeve(sleeve, amount, band = 'basic', cgtUsed = 0) {
  const take = Math.min(Math.max(0, amount), sleeve.value);
  if (take <= 0) return { taken: 0, cgt: 0, net: 0, cgtUsed };
  const share = take / sleeve.value;                        // sell a slice pro-rata
  const basisSold = sleeve.basis * share;
  const gain = Math.max(0, take - basisSold);
  const chargeableShare = 1 - (sleeve.mix.gilt || 0);        // gilts exempt from CGT
  const chargeable = gain * chargeableShare;
  const exemptLeft = Math.max(0, GIA_DEFAULTS.CGT_EXEMPTION - cgtUsed);
  const taxable = Math.max(0, chargeable - exemptLeft);
  const cgt = taxable * (band === 'higher' ? GIA_DEFAULTS.CGT_RATE_HIGHER : GIA_DEFAULTS.CGT_RATE_BASIC);
  sleeve.value -= take;
  sleeve.basis -= basisSold;
  return { taken: take, cgt, net: take - cgt, cgtUsed: cgtUsed + Math.min(chargeable, exemptLeft) };
}

/** Add money (a windfall, or a contribution). New money carries its own cost basis. */
export function addToSleeve(sleeve, amount) {
  if (!(amount > 0)) return sleeve;
  sleeve.value += amount; sleeve.basis += amount;
  return sleeve;
}

/** Grow the sleeve by a real/nominal factor. Basis does NOT grow — that is where the gain accrues. */
export function growSleeve(sleeve, factor) { sleeve.value *= factor; return sleeve; }

/**
 * Bed-and-ISA: move up to the ISA allowance out of the sleeve, realising CGT on the way.
 * @returns {{ moved, cgt }}
 */
export function bedAndIsa(sleeve, allowance = GIA_DEFAULTS.ISA_ALLOWANCE, band = 'basic', cgtUsed = 0) {
  const r = withdrawFromSleeve(sleeve, Math.min(allowance, sleeve.value), band, cgtUsed);
  return { moved: r.net, cgt: r.cgt, cgtUsed: r.cgtUsed };
}

/**
 * How a lump sum can legally be split in the year it arrives.
 * Returns what goes where — the remainder is stuck in the GIA whether the user likes it or not.
 */
export function sippRoomFor({ relevantEarnings = 0, mpaaTriggered = true } = {}) {
  // Earnings cap: 100% of relevant UK earnings, with a £3,600 gross floor for the earnings-less.
  const earningsCap = Math.max(GIA_DEFAULTS.SIPP_NO_EARNINGS_GROSS, +relevantEarnings || 0);
  // Allowance cap: £10,000 once a DC pension has been flexibly accessed, else £60,000.
  const allowanceCap = mpaaTriggered ? GIA_DEFAULTS.MPAA : GIA_DEFAULTS.ANNUAL_ALLOWANCE;
  return Math.min(earningsCap, allowanceCap);
}

export function shelterLumpSum(amount, { isaAllowanceLeft = GIA_DEFAULTS.ISA_ALLOWANCE, relevantEarnings = 0, mpaaTriggered = true } = {}) {
  const toIsa = Math.min(amount, Math.max(0, isaAllowanceLeft));
  const toSipp = Math.min(amount - toIsa, sippRoomFor({ relevantEarnings, mpaaTriggered }));
  return { toIsa, toSipp, toGia: Math.max(0, amount - toIsa - toSipp) };
}
