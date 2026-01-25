/**
 * Simulation Configuration Model
 * Represents settings for Monte Carlo and historical simulations
 */

import { SIMULATION_DEFAULTS, DRAWDOWN_DEFAULTS } from '../constants.js';

/**
 * Creates a SimulationConfig object
 * @param {object} params - Configuration parameters
 * @returns {object} SimulationConfig
 */
export function createSimulationConfig(params = {}) {
  return {
    // Starting fund values
    equityStart: params.equityStart ?? DRAWDOWN_DEFAULTS.EQUITY_MIN,
    bondStart: params.bondStart ?? DRAWDOWN_DEFAULTS.BOND_MIN,
    cashStart: params.cashStart ?? DRAWDOWN_DEFAULTS.CASH_TARGET,

    // Glidepath minimums
    equityMin: params.equityMin ?? DRAWDOWN_DEFAULTS.EQUITY_MIN,
    bondMin: params.bondMin ?? DRAWDOWN_DEFAULTS.BOND_MIN,
    cashTarget: params.cashTarget ?? DRAWDOWN_DEFAULTS.CASH_TARGET,

    // Simulation duration
    years: params.years ?? SIMULATION_DEFAULTS.YEARS,
    duration: params.duration ?? SIMULATION_DEFAULTS.YEARS,

    // Income parameters
    baseSalary: params.baseSalary ?? DRAWDOWN_DEFAULTS.BASE_SALARY,
    other: params.other ?? 0,
    statePension: params.statePension ?? 0,
    statePensionYear: params.statePensionYear ?? 12,

    // Tax settings
    pa: params.pa ?? 12570,
    brl: params.brl ?? 50270,
    hrl: params.hrl ?? 125140,
    taxMode: params.taxMode ?? 'inflates', // 'inflates' or 'frozen'

    // Protection settings
    protectionMult: params.protectionMult ?? SIMULATION_DEFAULTS.PROTECTION_MULTIPLIER,
    consecutiveLimit: params.consecutiveLimit ?? DRAWDOWN_DEFAULTS.CONSECUTIVE_LIMIT,
    disableProtection: params.disableProtection ?? false,

    // HODL (emergency reserve) settings
    hodlEnabled: params.hodlEnabled ?? SIMULATION_DEFAULTS.HODL_ENABLED,
    hodlValue: params.hodlValue ?? SIMULATION_DEFAULTS.HODL_VALUE
  };
}

/**
 * Creates simulation config from stress settings
 * @param {object} stressSettings - Stress tester settings
 * @returns {object} SimulationConfig
 */
export function fromStressSettings(stressSettings) {
  return createSimulationConfig({
    equityStart: stressSettings.equityMin,
    bondStart: stressSettings.bondMin,
    cashStart: stressSettings.cashTarget,
    equityMin: stressSettings.equityMin,
    bondMin: stressSettings.bondMin,
    cashTarget: stressSettings.cashTarget,
    years: stressSettings.duration,
    duration: stressSettings.duration,
    baseSalary: stressSettings.baseSalary,
    other: stressSettings.other,
    statePension: stressSettings.statePension,
    statePensionYear: stressSettings.statePensionYear,
    pa: stressSettings.pa,
    brl: stressSettings.brl,
    hrl: stressSettings.hrl,
    taxMode: stressSettings.taxMode,
    protectionMult: stressSettings.protectionMult,
    consecutiveLimit: stressSettings.consecutiveLimit,
    disableProtection: stressSettings.disableProtection,
    hodlEnabled: stressSettings.hodlEnabled,
    hodlValue: stressSettings.hodlValue
  });
}
