/**
 * Tax Calculator Service
 * Handles all UK income tax calculations
 */

import { TAX_DEFAULTS } from '../constants.js';

/**
 * Calculates income tax on a gross amount
 * @param {number} gross - Gross taxable income
 * @param {number} pa - Personal Allowance
 * @param {number} brl - Basic Rate Limit
 * @param {number} hrl - Higher Rate Limit: taxable income above which the additional rate applies
 * @returns {number} Total tax payable
 */
export function calculateTax(gross, pa, brl, hrl = TAX_DEFAULTS.HIGHER_RATE_LIMIT) {
  if (gross <= 0) return 0;

  // The personal allowance is withdrawn for high incomes: £1 for every £2 above £100,000.
  let effectivePA = pa;
  if (gross > TAX_DEFAULTS.PA_TAPER_THRESHOLD) {
    const reduction = (gross - TAX_DEFAULTS.PA_TAPER_THRESHOLD) * TAX_DEFAULTS.PA_TAPER_RATE;
    effectivePA = Math.max(0, pa - reduction);
  }

  // Taxable income after the (possibly reduced) allowance
  const taxable = Math.max(0, gross - effectivePA);

  // The bands are widths of TAXABLE income and do NOT move when the allowance is withdrawn:
  //   20% on the first (brl - pa) of taxable income — £37,700 on the standard figures;
  //   40% from there up to `hrl` of taxable income (£125,140);
  //   45% above that.
  // So as the allowance shrinks, the point where 40% starts falls with it (gov.uk/income-tax-rates).
  // Until 6.15.0 the 20% band was widened by the allowance lost (brl - effectivePA), which
  // understated tax on every income above £100,000 (by £1,000 at £110,000; £2,514 from £125,140).
  const basicBand = Math.max(0, brl - pa);
  const additionalFrom = Math.max(basicBand, hrl);

  let tax = Math.min(taxable, basicBand) * TAX_DEFAULTS.BASIC_RATE;
  if (taxable > basicBand) {
    tax += (Math.min(taxable, additionalFrom) - basicBand) * TAX_DEFAULTS.HIGHER_RATE;
  }
  if (taxable > additionalFrom) {
    tax += (taxable - additionalFrom) * TAX_DEFAULTS.ADDITIONAL_RATE;
  }

  return tax;
}

/**
 * Every gross income at which the slope of calculateTax can change, in ascending order (duplicates
 * and points on a straight stretch are harmless). Between two neighbouring values the tax — and so
 * grossToNet — is an exact straight line, which is what lets a "gross for this net" question be
 * answered by one interpolation instead of a search (see DrawdownStrategy.planDrawdown).
 * @returns {number[]}
 */
export function taxKinks(pa, brl, hrl = TAX_DEFAULTS.HIGHER_RATE_LIMIT) {
  const ts = TAX_DEFAULTS.PA_TAPER_THRESHOLD, r = TAX_DEFAULTS.PA_TAPER_RATE;
  const te = ts + pa / r;                       // the allowance is all gone from here
  const basicBand = Math.max(0, brl - pa);
  const additionalFrom = Math.max(basicBand, hrl);
  // gross at which taxable income reaches x: below the taper, inside it, and beyond it
  const at = (x) => [x + pa, (x + pa + r * ts) / (1 + r), x];
  return [ts, te, ...at(0), ...at(basicBand), ...at(additionalFrom)]
    .filter((g) => g > 0 && Number.isFinite(g))
    .sort((a, b) => a - b);
}

/**
 * Calculates net income from gross
 * @param {number} gross - Gross income
 * @param {number} pa - Personal Allowance
 * @param {number} brl - Basic Rate Limit
 * @param {number} hrl - Higher Rate Limit
 * @returns {number} Net income after tax
 */
export function grossToNet(gross, pa, brl, hrl = TAX_DEFAULTS.HIGHER_RATE_LIMIT) {
  return gross - calculateTax(gross, pa, brl, hrl);
}

// The straight stretches of grossToNet for the bands last asked about: the kinks (taxKinks) with the net at each,
// and one point well past the last kink (the line runs on at the top rate). A simulation asks many times a year
// with the same bands, so this is worked out once per set of bands. (A remembered pure value.)
let knotsFor = { pa: NaN, brl: NaN, hrl: NaN, t: null, n: null };
function knotsOf(pa, brl, hrl) {
  if (knotsFor.pa !== pa || knotsFor.brl !== brl || knotsFor.hrl !== hrl) {
    const t = [0], n = [0];
    for (const k of taxKinks(pa, brl, hrl)) if (k > t[t.length - 1]) { t.push(k); n.push(grossToNet(k, pa, brl, hrl)); }
    const last = t[t.length - 1] + 1e6;
    t.push(last); n.push(grossToNet(last, pa, brl, hrl));
    knotsFor = { pa, brl, hrl, t, n };
  }
  return knotsFor;
}

/** The gross for `net` read off the straight stretch it falls on — exact but for rounding (a few units in the last place). */
function grossOnTheLine(net, pa, brl, hrl) {
  const { t, n } = knotsOf(pa, brl, hrl);
  let i = 1;
  while (i < t.length - 1 && n[i] < net) i++;
  return t[i - 1] + (net - n[i - 1]) * (t[i] - t[i - 1]) / (n[i] - n[i - 1]);
}

/**
 * Inverts grossToNet: finds the gross taxable income needed to achieve a target net.
 * grossToNet is continuous and monotonically increasing, so we invert by bisection —
 * this stays correct across the PA taper and all rate bands without band-by-band algebra.
 *
 * Faster, same answer to the last binary digit (6.18.0): the gross is first read off the straight stretch of
 * grossToNet it lies on (grossOnTheLine). Every step of the search whose midpoint is further than about 2^-44 of
 * the gross from that point — hundreds of times the rounding of either sum — already knows which way it goes, so
 * only the last dozen or so steps work the tax out. The steps, and so the result, are the ones the plain search
 * takes: tests/taxNetToGross.identity.test.js holds the plain search as the reference and compares bit for bit.
 * (NaN or odd bands make every step work the tax out, as before.)
 * @param {number} net - Desired net (after-tax) income
 * @param {number} pa - Personal Allowance
 * @param {number} brl - Basic Rate Limit
 * @param {number} hrl - Higher Rate Limit
 * @returns {number} Gross taxable income that yields `net` after tax
 */
export function netToGross(net, pa, brl, hrl = TAX_DEFAULTS.HIGHER_RATE_LIMIT) {
  if (net <= 0) return 0;

  let lo = net;          // gross is always >= net (tax >= 0)
  let hi = net + 1;
  // Expand the upper bound until it nets at least the target.
  while (grossToNet(hi, pa, brl, hrl) < net && hi < 1e12) {
    hi *= 2;
  }
  const g = grossOnTheLine(net, pa, brl, hrl);
  const margin = Math.abs(g) * 2 ** -44 + 1e-7;
  const below = g - margin, above = g + margin;
  // ~60 iterations converges well below a penny.
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    const short = mid < below ? true : mid > above ? false : grossToNet(mid, pa, brl, hrl) < net;
    if (short) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

/**
 * Marginal tax on an incremental slice of income stacked on top of existing income.
 * (e.g. the taxable 75% of a UFPLS withdrawal, or an extra SIPP draw.)
 * @param {number} amount - The incremental (marginal) taxable amount
 * @param {number} existingIncome - Taxable income already received this year
 * @param {number} pa - Personal Allowance
 * @param {number} brl - Basic Rate Limit
 * @param {number} hrl - Higher Rate Limit
 * @returns {number} Tax attributable to `amount` at the margin
 */
export function marginalTaxOn(amount, existingIncome, pa, brl, hrl = TAX_DEFAULTS.HIGHER_RATE_LIMIT) {
  if (amount <= 0) return 0;
  return calculateTax(existingIncome + amount, pa, brl, hrl) - calculateTax(existingIncome, pa, brl, hrl);
}

/**
 * Resolves the tax bands for a given year — unifying the two mechanisms in the codebase:
 * explicit per-year thresholds (Decision Tool: pass cumulativeInflation=1) and
 * inflate-from-base (Stress Tester / schedules: taxMode 'inflates' scales all bands by
 * cumulativeInflation; 'frozen' leaves them fixed). Note: this inflates PA, BRL AND HRL
 * consistently (the live stress engine currently omits HRL — that gets fixed on wiring).
 * @param {object} p
 * @param {number} p.pa
 * @param {number} p.brl
 * @param {number} [p.hrl]
 * @param {number} [p.cumulativeInflation=1]
 * @param {'inflates'|'frozen'} [p.taxMode='inflates']
 * @returns {{pa:number, brl:number, hrl:number}}
 */
export function bandsForTaxYear({
  pa,
  brl,
  hrl = TAX_DEFAULTS.HIGHER_RATE_LIMIT,
  cumulativeInflation = 1,
  taxMode = 'inflates'
}) {
  const f = taxMode === 'frozen' ? 1 : cumulativeInflation;
  return { pa: pa * f, brl: brl * f, hrl: hrl * f };
}

/**
 * Calculates BRL headroom (how much more can be withdrawn at basic rate)
 * @param {number} currentAnnualTaxable - Current year-to-date taxable income
 * @param {number} brl - Basic Rate Limit
 * @returns {number} Remaining headroom to BRL
 */
export function calculateBRLHeadroom(currentAnnualTaxable, brl) {
  return Math.max(0, brl - currentAnnualTaxable);
}
