/**
 * ISA Drawdown — pure primitives for ISA as a depleting pot (see design/settings-model.md).
 *
 * The tax-efficient core (band management) lives in the drawdown engine: draw SIPP up to
 * the basic-rate limit, then top income up with tax-free ISA. These helpers govern HOW
 * MUCH ISA to draw for that top-up and how the pot evolves. Two strategies:
 *
 *   - Option A `minimiseEarlyTax` (default): draw whatever the net gap needs, up to the
 *     balance — deplete the pot as needed to stay tax-efficient ("use the ISA until we
 *     can't"). Uncapped.
 *   - Option B `maximiseLongevity`: cap the draw so the pot lasts — level it across the
 *     remaining pre-State-Pension months (the biggest-gap window); once SP has started it
 *     is uncapped, because SP takes up the slack.
 *   - Option C `hold`: never draw the ISA for income, even when that means paying higher-rate
 *     tax on SIPP withdrawals — the ISA is a separate pot the user is keeping dry (e.g. equity
 *     upside outside a fully-guaranteed gilt plan). The engines still let it rescue a plan
 *     whose SIPP has actually run out, rather than declare failure with money in the ISA.
 *
 * Pure and engine-agnostic: both the Decision Tool and the Stress Tester call these.
 */

export const ISA_STRATEGIES = {
  TAX_EFFICIENT: 'minimiseEarlyTax',
  LONGEVITY: 'maximiseLongevity',
  HOLD: 'hold'
};

/**
 * The per-period ceiling on the ISA draw for the chosen strategy.
 * @param {string} strategy - ISA_STRATEGIES value
 * @param {object} p
 * @param {number} p.isaBalance - current pot
 * @param {number|null} p.monthsUntilSp - whole months until State Pension starts
 *   (0 or null = SP already in payment → uncapped)
 * @returns {number} cap (Infinity when uncapped)
 */
export function strategyMonthlyCap(strategy, { isaBalance, monthsUntilSp }) {
  if (strategy === ISA_STRATEGIES.HOLD) return 0;               // Option C: never for income
  if (strategy !== ISA_STRATEGIES.LONGEVITY) return Infinity; // Option A: uncapped
  if (monthsUntilSp == null || monthsUntilSp <= 0) return Infinity; // SP started: uncapped
  return isaBalance / monthsUntilSp; // level the pot across the pre-SP bridge window
}

/**
 * Draw ISA for one period to fill a net-income gap, bounded by the balance and the cap.
 * @param {object} p
 * @param {number} p.netGap - net income still needed after SIPP-to-BRL (>= 0)
 * @param {number} p.isaBalance - current ISA pot
 * @param {number} [p.cap=Infinity] - per-period ceiling (from strategyMonthlyCap)
 * @returns {{isaDraw:number, remainingBalance:number, shortfall:number}}
 *   shortfall = gap the ISA could NOT cover (the engine then draws more SIPP or accepts
 *   lower income).
 */
export function isaDrawForPeriod({ netGap, isaBalance, cap = Infinity }) {
  const want = Math.max(0, netGap);
  const draw = Math.max(0, Math.min(want, Math.max(0, isaBalance), cap));
  return {
    isaDraw: draw,
    remainingBalance: isaBalance - draw,
    shortfall: want - draw
  };
}

/**
 * Grow the ISA pot by one month at the money-market (nominal annual) rate.
 * @param {number} balance
 * @param {number} annualReturn - e.g. ISA_DEFAULTS.RETURN
 * @returns {number}
 */
export function applyIsaGrowthMonthly(balance, annualReturn) {
  if (balance <= 0) return balance;
  return balance * Math.pow(1 + annualReturn, 1 / 12);
}
