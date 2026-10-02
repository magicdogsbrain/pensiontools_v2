/**
 * Default Stress tester settings (moved here from ScenarioRepository in 6.20.2, unchanged; ScenarioRepository re-exports
 * it). Pure: the store's lock check (FirestoreService.saveScenario) reads it for a locked plan with no Stress settings
 * saved — such a plan reads these defaults (ScenarioRepository.getActiveStressSettings) — without importing the
 * repository, which imports the store.
 */
import { DRAWDOWN_DEFAULTS, TAX_DEFAULTS, SIMULATION_DEFAULTS, ISA_DEFAULTS } from '../constants.js';

/**
 * Default stress settings for a new scenario.
 *
 * NOT the fund and platform charge (6.19.0): this map is also the fallback merged UNDER a stored plan's settings
 * (seedStressFromDecision), and a locked plan from before charges must keep reading none (0%). The default charge is
 * written by getDefaultScenario (every new plan) and by the readers in ScenarioRepository that know the plan is unlocked.
 */
export function getDefaultStressSettings() {
  return {
    equityMin: DRAWDOWN_DEFAULTS.EQUITY_MIN,
    bondMin: DRAWDOWN_DEFAULTS.BOND_MIN,
    cashTarget: DRAWDOWN_DEFAULTS.CASH_TARGET,
    duration: DRAWDOWN_DEFAULTS.DURATION_YEARS,
    baseSalary: DRAWDOWN_DEFAULTS.BASE_SALARY,
    other: 0,
    statePension: 12000,
    statePensionYear: 12,
    // Timing (6.4.0, see services/PlanTiming.js): age today + retired / retire-at-age → the saved
    // first tax year the plan starts in. Null until the Timing block or the setup wizard sets them;
    // a plan without an age today keeps the old implicit "starts next April".
    currentAge: null,
    currentAgeAsOf: null,
    retired: null,
    retireAge: null,
    firstTaxYear: null,
    potAtRetirement: null,
    pa: TAX_DEFAULTS.PERSONAL_ALLOWANCE,
    brl: TAX_DEFAULTS.BASIC_RATE_LIMIT,
    hrl: TAX_DEFAULTS.HIGHER_RATE_LIMIT,
    taxMode: 'inflates',
    protectionMult: SIMULATION_DEFAULTS.PROTECTION_MULTIPLIER,
    consecutiveLimit: DRAWDOWN_DEFAULTS.CONSECUTIVE_LIMIT,
    disableProtection: false,
    recoveryBuffer: DRAWDOWN_DEFAULTS.RECOVERY_BUFFER,
    hodlEnabled: SIMULATION_DEFAULTS.HODL_ENABLED,
    hodlValue: SIMULATION_DEFAULTS.HODL_VALUE,
    // ISA as a depleting pot (see design/settings-model.md) — read by BOTH engines
    // (SimulationEngine + legacyDecision via planDrawdown).
    isaBalance: 0,
    isaReturn: ISA_DEFAULTS.RETURN,
    isaMin: ISA_DEFAULTS.MIN,
    isaDrawdownStrategy: ISA_DEFAULTS.DRAWDOWN_STRATEGY
  };
}
