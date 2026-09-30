/**
 * Drawdown Strategy — the single tax-efficient withdrawal decision both engines will use.
 *
 * Given a target income, fixed income (State Pension + other), tax bands and an ISA pot,
 * decide how much to draw from the SIPP (taxable) and the ISA (tax-free) to deliver the
 * target NET income, using the research-backed band-management rule:
 *
 *   1. Draw SIPP up to the basic-rate limit (fills the personal allowance + basic band).
 *   2. Top the remaining NET gap up from the tax-free ISA (Option A: as much as needed;
 *      Option B: capped so the pot lasts across the pre-State-Pension years).
 *   3. If the ISA can't cover the gap, draw extra SIPP ABOVE the basic-rate limit and pay
 *      the higher-rate tax (Option A "use the ISA until we can't"). Income still hits
 *      target; the pot bears the cost.
 *
 * State-Pension-aware by construction: fixed income (incl. SP) fills the band first, so
 * once SP is in payment the SIPP-to-BRL room shrinks and the ISA/extra-SIPP covers less.
 *
 * Pure and annual-basis (tax bands are annual). Callers divide by 12 for monthly amounts
 * and track the ISA pot's depletion themselves.
 */

import { grossToNet, netToGross, taxKinks } from './TaxCalculator.js';
import { ISA_STRATEGIES } from './IsaDrawdown.js';

// The tax kinks for the bands last asked about. A simulation asks twelve months running with the
// same bands, so the list is worked out once a tax year, not once a month. (A remembered pure
// value: the same bands always give the same list.)
let kinksFor = { pa: NaN, brl: NaN, hrl: NaN, kinks: [] };
function kinksOf(pa, brl, hrl) {
  if (kinksFor.pa !== pa || kinksFor.brl !== brl || kinksFor.hrl !== hrl) {
    kinksFor = { pa, brl, hrl, kinks: taxKinks(pa, brl, hrl) };
  }
  return kinksFor.kinks;
}

/**
 * @param {object} p
 * @param {number} p.targetGross - desired gross-equivalent total income (annual)
 * @param {number} [p.fixedIncome=0] - taxable fixed income: State Pension + other (annual)
 * @param {number} p.pa - personal allowance
 * @param {number} p.brl - basic-rate limit
 * @param {number} p.hrl - higher-rate limit
 * @param {number} [p.isaBalance=0] - current ISA pot
 * @param {string} [p.strategy] - ISA_STRATEGIES value (default tax-efficient / Option A)
 * @param {number} [p.yearsUntilSp=0] - whole years until State Pension (for Option B leveling)
 * @returns {{sippGross:number, isaDraw:number, remainingIsa:number, taxable:number, tax:number, net:number}}
 */
export function planDrawdown({
  targetGross,
  fixedIncome = 0,
  pa,
  brl,
  hrl,
  isaBalance = 0,
  strategy = ISA_STRATEGIES.TAX_EFFICIENT,
  yearsUntilSp = 0,
  // Pension access method: 0 = crystallised drawdown (tax-free cash already taken; every
  // withdrawal fully taxable — the historical behaviour) or 0.25 = UFPLS (a quarter of each
  // withdrawal is tax-free). The f=0 branch below is the ORIGINAL code, byte-identical, so
  // every existing plan and golden fixture is untouched.
  taxFreeFraction = 0
}) {
  const f = Math.max(0, Math.min(0.75, taxFreeFraction || 0));

  if (f === 0) {
    const targetNet = grossToNet(targetGross, pa, brl, hrl);

    // Step 1: SIPP up to BRL (with fixed income), not exceeding the target.
    const sippToBrl = Math.max(0, Math.min(brl, targetGross) - fixedIncome);
    const netAtBrl = grossToNet(sippToBrl + fixedIncome, pa, brl, hrl);

    // Step 2: net gap the ISA should fill.
    const netGap = Math.max(0, targetNet - netAtBrl);

    // ISA cap: Option A uncapped; Option B levels the pot across the pre-SP years.
    const annualCap = strategy === ISA_STRATEGIES.HOLD ? 0
      : (strategy === ISA_STRATEGIES.LONGEVITY && yearsUntilSp > 0) ? isaBalance / yearsUntilSp
      : Infinity;
    const isaDraw = Math.max(0, Math.min(netGap, Math.max(0, isaBalance), annualCap));
    const remainingIsa = isaBalance - isaDraw;
    const uncovered = netGap - isaDraw;

    // Step 3: cover any remaining net gap with extra taxable SIPP above BRL.
    let sippGross = sippToBrl;
    if (uncovered > 0) {
      const totalTaxable = netToGross(netAtBrl + uncovered, pa, brl, hrl);
      sippGross = Math.max(sippToBrl, totalTaxable - fixedIncome);
    }

    const taxable = sippGross + fixedIncome;
    const netFromTaxable = grossToNet(taxable, pa, brl, hrl);
    return {
      sippGross,
      isaDraw,
      remainingIsa,
      taxable,
      tax: taxable - netFromTaxable,
      net: netFromTaxable + isaDraw, // == targetNet when the pots can cover it
      taxFree: 0
    };
  }

  // ---- UFPLS path (f > 0) --------------------------------------------------------------------
  // A gross draw G contributes taxable (1-f)·G and tax-free f·G. The net delivered by taxable
  // amount T (on top of fixed income F) is:
  //   net(T) = T·f/(1-f) + grossToNet(F+T) - grossToNet(F)
  // which is continuous and strictly increasing in T. Tax is a straight line between the incomes
  // where its slope changes (TaxCalculator.taxKinks: the allowance, the 20%/40%/45% edges and the
  // two ends of the £100,000 taper), so net(T) is a straight line between the matching values of
  // T — and "the T that delivers this net" is read off exactly: walk up the kinks to the first one
  // that delivers at least the net needed, and interpolate on that stretch. No search.
  // (Until 6.16.0 this was an 80-step bisection, run up to twice a month; tests/
  // DrawdownStrategy.closedForm.test.js keeps that search as the reference, equal within a penny.)
  const targetNet = grossToNet(targetGross, pa, brl, hrl);
  const netF = grossToNet(fixedIncome, pa, brl, hrl);
  const netOfTaxable = (T) => T * f / (1 - f) + grossToNet(fixedIncome + T, pa, brl, hrl) - netF;
  // The kinks above the fixed income, as taxable amounts T, with net(T) worked out only as far up
  // as a question needs (most months stop at the first or second) and kept for the second question.
  const kinks = kinksOf(pa, brl, hrl);
  const knotT = [0], knotNet = [0];
  let nextKink = 0;
  const solveTaxableForNet = (needNet) => {
    if (needNet <= 0) return 0;
    for (let i = 1; ; i++) {
      if (i === knotT.length) {
        // extend by one knot: the next kink above the fixed income, or — past the last kink, where
        // the line runs on for ever at the top rate — a point well beyond it to give the slope
        while (nextKink < kinks.length && kinks[nextKink] - fixedIncome <= knotT[i - 1]) nextKink++;
        const T = nextKink < kinks.length ? kinks[nextKink] - fixedIncome : knotT[i - 1] + 1e6;
        knotT.push(T);
        knotNet.push(netOfTaxable(T));
      }
      const beyondLast = nextKink >= kinks.length && i === knotT.length - 1;
      if (knotNet[i] >= needNet || beyondLast) {
        const t0 = knotT[i - 1], n0 = knotNet[i - 1];
        return t0 + (needNet - n0) * (knotT[i] - t0) / (knotNet[i] - n0);
      }
    }
  };

  // Step 1: SIPP whose TAXABLE part fills up to the BRL, clamped so net never overshoots the
  // target (the tax-free quarter means less taxable is needed than in the drawdown case).
  const bandTaxable = Math.max(0, brl - fixedIncome);
  const taxableForTarget = solveTaxableForNet(Math.max(0, targetNet - netF));
  const t1 = Math.min(bandTaxable, taxableForTarget);
  const sippToBrl = t1 / (1 - f);
  const netAtBrl = netF + netOfTaxable(t1);

  // Step 2: net gap the ISA should fill (only exists when the band ran out first).
  const netGap = Math.max(0, targetNet - netAtBrl);
  const annualCap = strategy === ISA_STRATEGIES.HOLD ? 0
    : (strategy === ISA_STRATEGIES.LONGEVITY && yearsUntilSp > 0) ? isaBalance / yearsUntilSp
    : Infinity;
  const isaDraw = Math.max(0, Math.min(netGap, Math.max(0, isaBalance), annualCap));
  const remainingIsa = isaBalance - isaDraw;
  const uncovered = netGap - isaDraw;

  // Step 3: cover any remainder with extra SIPP above the band (higher-rate on its taxable part).
  let taxableDrawn = t1;
  if (uncovered > 0) {
    taxableDrawn = solveTaxableForNet(Math.max(0, targetNet - netF - isaDraw));
  }
  const sippGross = taxableDrawn / (1 - f);

  const taxable = taxableDrawn + fixedIncome;
  const netFromTaxable = grossToNet(taxable, pa, brl, hrl);
  return {
    sippGross,
    isaDraw,
    remainingIsa,
    taxable,
    tax: taxable - netFromTaxable,
    net: netFromTaxable + sippGross * f + isaDraw,
    taxFree: sippGross * f
  };
}
