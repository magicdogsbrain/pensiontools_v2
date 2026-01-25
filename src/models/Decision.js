/**
 * Decision Model
 * Represents a monthly drawdown decision with all calculations
 */

/**
 * Creates a Decision result object
 * @param {object} params - Decision parameters
 * @returns {object} Decision object
 */
export function createDecision(params = {}) {
  return {
    // Context
    date: params.date || null,
    taxYear: params.taxYear || null,
    yearNumber: params.yearNumber ?? 0,
    monthInTaxYear: params.monthInTaxYear ?? 0,
    remainingMonths: params.remainingMonths ?? 12,

    // Fund values (current)
    equity: params.equity ?? 0,
    bond: params.bond ?? 0,
    cash: params.cash ?? 0,
    isa: params.isa ?? 0,

    // Glidepath minimums (adjusted for inflation and depletion)
    adjEquityMin: params.adjEquityMin ?? 0,
    adjBondMin: params.adjBondMin ?? 0,
    adjCashTarget: params.adjCashTarget ?? 0,

    // Tax thresholds (current year)
    pa: params.pa ?? 0,
    brl: params.brl ?? 0,
    hrl: params.hrl ?? 0,

    // Income sources
    other: params.other ?? 0,           // Monthly other pension
    statePension: params.statePension ?? 0, // Monthly state pension

    // Calculated draws
    sippDraw: params.sippDraw ?? 0,     // Recommended SIPP withdrawal
    isaDraw: params.isaDraw ?? 0,       // Recommended ISA top-up
    totalMonthlyNet: params.totalMonthlyNet ?? 0,

    // Tax efficiency metrics
    taxEfficient: params.taxEfficient ?? true,
    annualTaxableSoFar: params.annualTaxableSoFar ?? 0,
    projectedAnnualTaxable: params.projectedAnnualTaxable ?? 0,
    headroomToBRL: params.headroomToBRL ?? 0,

    // Protection status
    inProtection: params.inProtection ?? false,
    protectionReason: params.protectionReason || null,
    consecutiveCashDraws: params.consecutiveCashDraws ?? 0,

    // Tax boost (catch-up)
    boostAmount: params.boostAmount ?? 0,
    boostEligible: params.boostEligible ?? false,

    // Withdrawal source
    source: params.source || 'Growth',  // 'Growth', 'Cash', 'ISA'
    drawFromEquity: params.drawFromEquity ?? 0,
    drawFromBond: params.drawFromBond ?? 0,
    drawFromCash: params.drawFromCash ?? 0,

    // Rebalancing
    rebalanceNeeded: params.rebalanceNeeded ?? false,
    rebalanceActions: params.rebalanceActions || [],

    // Warnings and alerts
    alerts: params.alerts || [],

    // Debug information
    calculationDetails: params.calculationDetails || {},

    // NEW: Year-level ISA/Savings tracking
    yearlyIsaSavingsAllocation: params.yearlyIsaSavingsAllocation ?? 0,
    cumulativeIsaSavingsUsed: params.cumulativeIsaSavingsUsed ?? 0,
    isTaxEfficientYear: params.isTaxEfficientYear ?? true,

    // NEW: Tax tracking (monthly, YTD, projected)
    taxPaidYTD: params.taxPaidYTD ?? 0,
    taxProjectedAnnual: params.taxProjectedAnnual ?? 0,
    taxSavedMonthly: params.taxSavedMonthly ?? 0,
    taxSavedYTD: params.taxSavedYTD ?? 0,
    taxSavedProjectedAnnual: params.taxSavedProjectedAnnual ?? 0,

    // NEW: Protection-induced tax efficiency
    protectionInducedTaxEfficiency: params.protectionInducedTaxEfficiency ?? false
  };
}

/**
 * Creates a history record from a Decision
 * @param {object} decision - Decision object
 * @returns {object} History record for storage
 */
export function decisionToHistory(decision) {
  // Calculate tax on taxable income (SIPP + Other + State)
  const monthlyTaxable = (decision.sippDraw || 0) + (decision.other || 0) + (decision.statePension || 0);
  const annualTaxable = monthlyTaxable * 12;
  const pa = decision.pa || 12570;
  const brl = decision.brl || 50270;
  const hrl = decision.hrl || 125140;

  let annualTax = 0;
  if (annualTaxable > pa) {
    if (annualTaxable <= brl) {
      annualTax = (annualTaxable - pa) * 0.2;
    } else if (annualTaxable <= hrl) {
      annualTax = (brl - pa) * 0.2 + (annualTaxable - brl) * 0.4;
    } else {
      annualTax = (brl - pa) * 0.2 + (hrl - brl) * 0.4 + (annualTaxable - hrl) * 0.45;
    }
  }
  const monthlyTax = annualTax / 12;
  const monthlyNet = monthlyTaxable - monthlyTax + (decision.isaDraw || 0);

  return {
    // Date and context
    date: decision.date,
    taxYear: decision.taxYear,
    yearNum: decision.yearNumber,

    // Fund balances at time of decision
    equity: decision.equity,
    bond: decision.bond,
    cash: decision.cash,
    total: decision.equity + decision.bond + decision.cash,

    // Glidepath minimums
    adjEquity: decision.adjEquityMin,
    adjBond: decision.adjBondMin,
    adjCash: decision.adjCashTarget,

    // Withdrawal source
    source: decision.source,
    dEquity: decision.drawFromEquity || 0,
    dBond: decision.drawFromBond || 0,
    dCash: decision.drawFromCash || 0,

    // Income amounts (monthly)
    sipp: decision.sippDraw,
    isa: decision.isaDraw,
    other: decision.other,
    state: decision.statePension,

    // Tax calculation
    pa: pa,
    brl: brl,
    monthlyTax: monthlyTax,
    monthlyNet: monthlyNet,

    // Mode and status
    mode: decision.taxEfficient ? 'Tax-Efficient' : 'Standard',
    inProtection: decision.inProtection,
    reason: decision.protectionReason || '',
    consecutiveDraws: decision.consecutiveCashDraws || 0,

    // Boost
    boostAmount: decision.boostAmount,
    boostEligible: decision.boostEligible || false,

    // Rebalancing
    rebal: decision.rebalanceActions ? decision.rebalanceActions.join('; ') : '',

    // NEW: ISA/Savings tracking
    yearlyIsaSavingsAllocation: decision.yearlyIsaSavingsAllocation || 0,
    isaSavingsUsedThisMonth: decision.isaDraw || 0,
    cumulativeIsaSavingsUsed: decision.cumulativeIsaSavingsUsed || 0,

    // NEW: Tax tracking (monthly, YTD, projected)
    taxPaidMonthly: monthlyTax,
    taxPaidYTD: decision.taxPaidYTD || monthlyTax,
    taxProjectedAnnual: decision.taxProjectedAnnual || annualTax,
    taxSavedMonthly: decision.taxSavedMonthly || 0,
    taxSavedYTD: decision.taxSavedYTD || 0,
    taxSavedProjectedAnnual: decision.taxSavedProjectedAnnual || 0,

    // NEW: Year-level tax efficiency flags
    isTaxEfficientYear: decision.isTaxEfficientYear ?? true,
    protectionInducedTaxEfficiency: decision.protectionInducedTaxEfficiency || false,

    // Context
    remainingMonths: decision.remainingMonths || 12
  };
}

/**
 * Alert severity levels
 */
export const AlertSeverity = {
  INFO: 'info',
  WARNING: 'warning',
  DANGER: 'danger',
  SUCCESS: 'success'
};

/**
 * Creates an alert object
 * @param {string} message - Alert message
 * @param {string} severity - Alert severity
 * @param {string} code - Alert code for identification
 * @returns {object} Alert object
 */
export function createAlert(message, severity = AlertSeverity.INFO, code = null) {
  return { message, severity, code };
}
