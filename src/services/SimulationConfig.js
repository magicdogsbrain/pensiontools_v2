/**
 * The engine config of a plan's Stress settings — what every run of the Pots & Valves engine and every strategy test
 * is built from (stressTest.planFromSettings takes it with the settings). Moved here from storage/StressRepository.js
 * (6.31.0, "Does it last?" in the preview: research/v7/editing-in-v7.md 10.1) so the preview's run can reach it without
 * the repository, which imports the store. The repository keeps createSimulationConfigFromSettings as a wrapper that
 * fills the settings from its cache, so nothing the planner calls changes; the body is the same, line for line.
 *
 *   simulationConfigFromSettings(overrides, settings)   the config for these settings (settings required)
 *
 * Pure: no storage, no DOM, no clock.
 */
import { DRAWDOWN_DEFAULTS, SIMULATION_DEFAULTS } from '../constants.js';
import { spSimConfigFromSettings } from '../utils/StatePensionUtils.js';
import { tentGlideForSettings } from './GlidepathService.js';
import { deriveIsaMix } from './IsaFunds.js';
import { scheduleFromSteps, defaultSpYear } from './IncomeSchedule.js';
import { potScaleOf, isaAtRetirementOf } from './PlanTiming.js';
import { chargesPctOf } from './Charges.js';
import { isaGrowthOf } from './IsaGrowth.js';

/**
 * Creates simulation config from stress settings
 * @param {object} overrides - Optional overrides
 * @param {object} settings - The plan's Stress settings (the effective settings the planner's loader reads)
 * @returns {object} Simulation config
 */
export function simulationConfigFromSettings(overrides = {}, settings) {
  if (!settings || typeof settings !== 'object') throw new Error('simulationConfigFromSettings: settings are required');

  // Prefer date-based SP; fall back to the legacy statePension/statePensionYear fields so
  // a plan configured only with those (e.g. the defaults) is not silently ignored.
  const spConfig = spSimConfigFromSettings(settings);
  const spFields = spConfig
    ? { spStartYear: spConfig.spStartYear, spWeeklyAmount: spConfig.spWeeklyAmount, spFirstYearRatio: spConfig.spFirstYearRatio }
    : { statePension: settings.statePension || 0, statePensionYear: defaultSpYear(settings) };

  // ISA composition (own-funds mode): when the plan has tagged ISA-wrapped holdings, model the
  // ISA pool at THEIR asset mix (same driver machinery as the taxable pots) instead of the flat
  // conservative rate. Re-wrapped as SIPP for tagging because tagPortfolio deliberately keeps
  // ISA-wrapped holdings out of the buckets. Absent => engine keeps the legacy flat-rate path
  // (and an untouched RNG stream — golden-safe).
  const isaMix = deriveIsaMix(settings.taggedFunds);

  // Retiring later (6.4.0 Timing block): the pots entered are today's; the plan runs from retirement
  // on the pots projected to then (today's money), so everything pot-shaped is scaled by the same
  // factor — starts, glidepath floors, the ISA — exactly as requiredPotForStrategy scales a plan.
  // Already retired / no projection → 1, byte-identical to before.
  const ps = potScaleOf(settings);
  const kS = (v) => (v == null ? v : v * ps.sipp);

  return {
    ...(isaMix ? { isaMix } : {}),
    equityStart: kS(overrides.equityStart ?? settings.equityMin),
    bondStart: kS(overrides.bondStart ?? settings.bondMin),
    cashStart: kS(overrides.cashStart ?? settings.cashTarget),
    equityMin: kS(settings.equityMin),
    bondMin: kS(settings.bondMin),
    cashTarget: kS(settings.cashTarget),
    years: overrides.years ?? settings.duration,
    duration: settings.duration,
    baseSalary: settings.baseSalary,
    other: settings.other,
    // State pension - date-based, or legacy fallback (see spFields above)
    ...spFields,
    pa: settings.pa,
    brl: settings.brl,
    hrl: settings.hrl,
    taxMode: settings.taxMode,
    protectionMult: settings.protectionMult,
    protectionEscalateMonths: settings.protectionEscalateMonths ?? 12
      ?? (settings.protectionFactor != null ? 1 - settings.protectionFactor / 100 : SIMULATION_DEFAULTS.PROTECTION_MULTIPLIER),
    consecutiveLimit: settings.consecutiveLimit,
    disableProtection: settings.disableProtection,
    hodlEnabled: settings.hodlEnabled,
    hodlValue: settings.hodlValue,
    // ISA pot (tax-free top-up drawn via band management; see DrawdownStrategy). Retiring later: today's ISA scaled to the
    // ISA at retirement — or, with no ISA today but money going into one, that ISA itself (a scale cannot lift £0; review of
    // 6.22.0, PlanTiming.isaAtRetirementOf). A plan without the ISA choice: exactly as before.
    isaBalance: isaAtRetirementOf(settings),
    isaReturn: settings.isaReturn,
    // Tax bands from settings (previously only supplied by UI call-site overrides — configs
    // built without overrides had pa/brl/hrl undefined, which NaN'd every draw).
    strategyId: settings.strategyId || 'pots-and-valves',
    // Buckets in order runs the same engine with ordered sourcing and no rebalancing.
    sourcingMode: settings.strategyId === 'buckets-in-order' ? 'ordered' : undefined,
    bucketBand: settings.strategyId === 'buckets-in-order' ? ((settings.strategyParams && settings.strategyParams.bucketBand > 0) ? settings.strategyParams.bucketBand / 100 : 0.10) : undefined,
    pa: settings.pa ?? 12570,
    brl: settings.brl ?? 50270,
    hrl: settings.hrl ?? 125140,
    accessMethod: settings.accessMethod || 'drawdown',
    // Protection knobs — pass the USER'S values through (previously recoveryBuffer was never
    // emitted, so the engine always used its default regardless of settings). protectionMult
    // falls back to the Decision-side protectionFactor (one unit, translated at this seam).
    recoveryBuffer: settings.recoveryBuffer ?? DRAWDOWN_DEFAULTS.RECOVERY_BUFFER,
    ufplsYears: settings.ufplsYears || null,
    ufplsThenPcls: !!settings.ufplsThenPcls,
    bandFillRecycle: !!settings.bandFillRecycle,
    targetSchedule: scheduleFromSteps(settings),
    dbAmount: settings.dbAmount || 0,
    dbStartYear: settings.dbStartYear || 0,
    dbIndexation: settings.dbIndexation || 'lpi5',
    // Lumpy income (user-defined): income streams with start/end years + one-off lump sums.
    extraIncomes: Array.isArray(settings.extraIncomes) ? settings.extraIncomes : [],
    windfalls: Array.isArray(settings.windfalls) ? settings.windfalls : [],
    // Taxable sleeve (GIA): where a lump sum actually has to live, because the ISA takes £20k/yr
    // and a retiree's SIPP £3,600/yr. Default mix is equities unless the plan says otherwise;
    // a GIA holding gilts is near tax-free (CGT-exempt uplift) and the engine models that.
    taxableStart: +settings.taxableStart || 0,
    taxableMix: settings.taxableMix || null,        // 'equity' | 'gilt' | 'bond' | 'cash' | 'balanced' | { equity, bond, gilt, cash }
    giaTaxBand: settings.giaTaxBand || 'basic',
    bedAndIsa: settings.bedAndIsa !== false,
    relevantEarnings: +settings.relevantEarnings || 0,
    extraWithdrawals: Array.isArray(settings.extraWithdrawals) ? settings.extraWithdrawals : [],
    isaDrawdownStrategy: settings.isaDrawdownStrategy,
    // Spending profile: 'flat' (level real spend, default) or 'declining' (spending drifts down
    // with age — Blanchett's spending smile). See SimulationEngine.spendingFactor.
    spendingProfile: settings.spendingProfile || 'flat',
    // Rising-equity glidepath (bond tent): the equity share rises over the early years UP TO the chosen
    // split (the ENDGAME/destination) and then holds — so the chosen allocation is where it settles, and
    // the tent's time-average equity is BELOW it (more cautious early). Derived from the equity:bond
    // ratio (scale-invariant, so passing the raw £ minimums is fine). Opt-in.
    equityGlide: settings.equityGlideEnabled ? tentGlideForSettings(settings) : undefined,
    // Diversifiers sleeve (gold + trend/macro), opt-in. When set, the engine runs the 4-bucket
    // sub-asset path (subAsset present) and holds this pot flat, tapping it first in a downturn.
    // Absent/0 → legacy 3-bucket path, byte-identical.
    diversifierStart: kS(overrides.diversifierStart ?? (settings.diversifierStart || undefined)),
    subAsset: settings.subAsset || undefined,
    // Fund and platform charges (6.19.0, services/Charges.js): the plan's percent a year, taken off every charged pot
    // each month by every engine and strategy. Only when there is one — absent, 0 or invalid (a plan locked before
    // charges) leaves the config exactly as it always was, so its figures cannot move.
    ...(chargesPctOf(settings) > 0 ? { chargesPct: chargesPctOf(settings) } : {}),
    // How the ISA grows (6.22.0, services/IsaGrowth.js): 'cash' or 'invested', only when the plan has the choice — without
    // it (a plan locked before the choice) the ISA grows at isaReturn, exactly as before. No mix is passed: "invested"
    // reads the run's own pension pots, so the optimiser and the pots-at-retirement scaling carry the ISA with them.
    ...(isaGrowthOf(settings) ? { isaGrowth: isaGrowthOf(settings) } : {})
  };
}
