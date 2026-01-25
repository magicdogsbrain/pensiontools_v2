/**
 * Protection Service
 * Manages protection mode logic for market downturns
 */

import { DRAWDOWN_DEFAULTS } from '../constants.js';

/**
 * Determines if protection mode should be active
 *
 * Protection mode activates when:
 * 1. Growth funds (equity + bond) fall below glidepath minimums
 * 2. AND we've had consecutive cash draws >= consecutiveLimit
 *
 * Protection mode exits when:
 * 1. Growth funds recover above minimums + recovery buffer
 *
 * @param {object} params - Protection check parameters
 * @returns {object} Protection status
 */
export function checkProtectionStatus(params) {
  const {
    // Current fund values
    equity,
    bond,
    cash,

    // Glidepath minimums
    adjEquityMin,
    adjBondMin,
    adjCashTarget,

    // History
    priorHistory = [],

    // Settings
    consecutiveLimit = DRAWDOWN_DEFAULTS.CONSECUTIVE_LIMIT,
    recoveryBuffer = DRAWDOWN_DEFAULTS.RECOVERY_BUFFER,
    disableProtection = false
  } = params;

  // If protection is disabled, never enter
  if (disableProtection) {
    return {
      inProtection: false,
      reason: 'Protection disabled',
      consecutiveCashDraws: 0,
      growthDeficit: 0,
      canExitProtection: false
    };
  }

  // Calculate growth fund status
  const totalGrowth = equity + bond;
  const minGrowth = adjEquityMin + adjBondMin;
  const growthSurplus = totalGrowth - minGrowth;
  const growthDeficit = Math.max(0, -growthSurplus);

  // Count consecutive cash draws from history
  let consecutiveCashDraws = 0;
  for (let i = priorHistory.length - 1; i >= 0; i--) {
    if (priorHistory[i].source === 'Cash') {
      consecutiveCashDraws++;
    } else {
      break;
    }
  }

  // Check if last entry was in protection
  const lastEntry = priorHistory[priorHistory.length - 1];
  const wasInProtection = lastEntry ? lastEntry.inProtection : false;

  // Determine protection status
  let inProtection = false;
  let reason = '';

  if (wasInProtection) {
    // Already in protection - check if we can exit
    const canExit = totalGrowth >= minGrowth + recoveryBuffer;

    if (canExit) {
      inProtection = false;
      reason = 'Exiting protection - growth funds recovered';
    } else {
      inProtection = true;
      reason = `Continuing protection - need £${Math.round(minGrowth + recoveryBuffer - totalGrowth).toLocaleString()} more to exit`;
    }
  } else {
    // Not in protection - check if we should enter
    const shouldEnter = growthDeficit > 0 && consecutiveCashDraws + 1 >= consecutiveLimit;

    if (shouldEnter) {
      inProtection = true;
      reason = `Entering protection - ${consecutiveCashDraws + 1} consecutive cash draws with growth below minimum`;
    } else if (growthDeficit > 0) {
      reason = `Growth below minimum but only ${consecutiveCashDraws} consecutive cash draws (limit: ${consecutiveLimit})`;
    } else {
      reason = 'Growth funds healthy';
    }
  }

  return {
    inProtection,
    reason,
    consecutiveCashDraws,
    wasInProtection,

    // Fund status
    totalGrowth,
    minGrowth,
    growthSurplus,
    growthDeficit,

    // Exit conditions
    recoveryTarget: minGrowth + recoveryBuffer,
    amountToRecover: inProtection ? Math.max(0, minGrowth + recoveryBuffer - totalGrowth) : 0,
    canExitProtection: wasInProtection && totalGrowth >= minGrowth + recoveryBuffer
  };
}

/**
 * Determines the source of withdrawal
 *
 * In normal mode: Draw from growth funds (proportionally from surplus)
 * In protection mode: Draw from cash
 *
 * @param {object} params - Source determination parameters
 * @returns {object} Withdrawal source and amounts
 */
export function determineWithdrawalSource(params) {
  const {
    drawAmount,
    equity,
    bond,
    cash,
    adjEquityMin,
    adjBondMin,
    adjCashTarget,
    inProtection
  } = params;

  // Calculate surpluses
  const equitySurplus = Math.max(0, equity - adjEquityMin);
  const bondSurplus = Math.max(0, bond - adjBondMin);
  const totalGrowthSurplus = equitySurplus + bondSurplus;
  const cashSurplus = Math.max(0, cash - adjCashTarget);

  if (inProtection) {
    // In protection: draw from cash
    return {
      source: 'Cash',
      fromEquity: 0,
      fromBond: 0,
      fromCash: Math.min(drawAmount, cash),
      shortfall: Math.max(0, drawAmount - cash),
      reason: 'Protection mode - preserving growth funds'
    };
  }

  // Normal mode: can we draw from growth surplus?
  if (totalGrowthSurplus >= drawAmount) {
    // Proportional draw from equity and bond surplus
    const equityProportion = equitySurplus / totalGrowthSurplus;
    const bondProportion = bondSurplus / totalGrowthSurplus;

    return {
      source: 'Growth',
      fromEquity: drawAmount * equityProportion,
      fromBond: drawAmount * bondProportion,
      fromCash: 0,
      shortfall: 0,
      reason: 'Drawing proportionally from growth surplus'
    };
  }

  // Not enough growth surplus - need to use cash
  const fromGrowth = totalGrowthSurplus;
  const fromCash = Math.min(drawAmount - fromGrowth, cash);

  return {
    source: 'Mixed',
    fromEquity: equitySurplus,
    fromBond: bondSurplus,
    fromCash,
    shortfall: Math.max(0, drawAmount - fromGrowth - fromCash),
    reason: 'Insufficient growth surplus - using cash supplement'
  };
}

/**
 * Recommends rebalancing actions
 * @param {object} params - Rebalancing parameters
 * @returns {object[]} Array of rebalancing recommendations
 */
export function recommendRebalancing(params) {
  const {
    equity,
    bond,
    cash,
    adjEquityMin,
    adjBondMin,
    adjCashTarget,
    inProtection
  } = params;

  const actions = [];

  // Check cash level
  const cashSurplus = cash - adjCashTarget;
  if (cashSurplus < 0) {
    actions.push({
      priority: 'high',
      action: 'Top up cash',
      amount: Math.abs(cashSurplus),
      reason: `Cash £${Math.round(Math.abs(cashSurplus)).toLocaleString()} below target`
    });
  } else if (cashSurplus > adjCashTarget * 0.5) {
    actions.push({
      priority: 'low',
      action: 'Consider investing excess cash',
      amount: cashSurplus - adjCashTarget * 0.25,
      reason: `Cash £${Math.round(cashSurplus).toLocaleString()} above target`
    });
  }

  // Check equity/bond balance (only if not in protection)
  if (!inProtection) {
    const equitySurplus = equity - adjEquityMin;
    const bondSurplus = bond - adjBondMin;
    const totalGrowthSurplus = equitySurplus + bondSurplus;

    if (totalGrowthSurplus > 0) {
      const targetEquityRatio = adjEquityMin / (adjEquityMin + adjBondMin);
      const actualEquityRatio = equity / (equity + bond);

      const imbalance = Math.abs(actualEquityRatio - targetEquityRatio);

      if (imbalance > 0.1) { // More than 10% off target
        if (actualEquityRatio > targetEquityRatio) {
          actions.push({
            priority: 'medium',
            action: 'Consider rebalancing equity to bonds',
            amount: (actualEquityRatio - targetEquityRatio) * (equity + bond),
            reason: `Equity ${Math.round(actualEquityRatio * 100)}% vs target ${Math.round(targetEquityRatio * 100)}%`
          });
        } else {
          actions.push({
            priority: 'medium',
            action: 'Consider rebalancing bonds to equity',
            amount: (targetEquityRatio - actualEquityRatio) * (equity + bond),
            reason: `Equity ${Math.round(actualEquityRatio * 100)}% vs target ${Math.round(targetEquityRatio * 100)}%`
          });
        }
      }
    }
  }

  return actions;
}
