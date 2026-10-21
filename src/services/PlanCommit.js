/**
 * The lock as a commit, and the unlock — the pure parts (6.38.0, "Lock the plan" in the preview: research/v7/road-to-7.md
 * step 6). Lifted, line for line, out of the repositories the preview may not reach (tests/v7/boundaries.test.js rule 3a):
 *
 *   from storage/ScenarioRepository.js   getDefaultDecisionSettings, seedDecisionFromStress, chargesPatchOnUnlock,
 *                                        unlockPatchesOf, budgetSharedFromOf, BUDGET_OWN_SIDE, ownSideOf, sharedBudgetView
 *   from storage/DecisionRepository.js   decisionSettingsChecksum
 *   from services/PlanLock.js            the body of buildPlanOfRecord, as planOfRecordFor(decisionSettings, now)
 *
 * Each repository keeps its name as a re-export, so nothing the planner calls changes (the precedent:
 * services/SimulationConfig.js lifted out of StressRepository.js in 6.31.0).
 *
 * Pure: no storage, no DOM, no clock — the date arrives as `now`.
 */
import { DRAWDOWN_DEFAULTS, ISA_DEFAULTS } from '../constants.js';
import { deriveTiming } from './PlanTiming.js';
import { DEFAULT_CHARGES_PCT, isChargesPct } from './Charges.js';
import { DEFAULT_ISA_GROWTH, isIsaGrowth } from './IsaGrowth.js';
import { simpleHash } from '../utils/MathUtils.js';
import { generateDrawdownSchedule } from './DrawdownService.js';
import { generateGlidepathSchedule } from './GlidepathService.js';
import { ENGINE_VERSION } from '../strategies/version.js';

/**
 * Default decision settings for a new scenario
 */
export function getDefaultDecisionSettings() {
  return {
    equityMin: DRAWDOWN_DEFAULTS.EQUITY_MIN,
    bondMin: DRAWDOWN_DEFAULTS.BOND_MIN,
    cashTarget: DRAWDOWN_DEFAULTS.CASH_TARGET,
    duration: DRAWDOWN_DEFAULTS.DURATION_YEARS,
    baseSalary: DRAWDOWN_DEFAULTS.BASE_SALARY,
    protectionFactor: DRAWDOWN_DEFAULTS.PROTECTION_FACTOR,
    recoveryBuffer: DRAWDOWN_DEFAULTS.RECOVERY_BUFFER,
    consecutiveLimit: DRAWDOWN_DEFAULTS.CONSECUTIVE_LIMIT,
    spStartDate: null,
    spWeeklyAmount: 0,
    statePension: 0,
    statePensionYear: 0,
    // ISA as a depleting pot (see design/settings-model.md). read by both engines.
    isaBalance: 0,
    isaReturn: ISA_DEFAULTS.RETURN,
    isaMin: ISA_DEFAULTS.MIN,
    isaDrawdownStrategy: ISA_DEFAULTS.DRAWDOWN_STRATEGY,
    // Taxable sleeve (GIA): an existing unwrapped account today, what it holds (drives the tax it
    // suffers — gilts are CGT-free), the holder's marginal rate, whether to bed-and-ISA £20k/yr,
    // and relevant UK earnings (sets the SIPP room for a windfall). Read by both engines.
    taxableStart: 0,
    taxableMix: 'equity',
    giaTaxBand: 'basic',
    bedAndIsa: true,
    relevantEarnings: 0
  };
}

/**
 * Seed DECISION settings from the Stress Tester's current settings — the reverse direction:
 * "I've found a plan that survives the stress tests; run the Decision Tool on these settings."
 * Converts the protection unit (Stress multiplier → Decision percent).
 * Does NOT set `locked` — the user still reviews and saves (which locks as usual).
 * @param {object} stressSettings
 * @param {object} [currentDecision={}] - existing Decision settings to overlay onto
 * @returns {object} new Decision settings
 */
export function seedDecisionFromStress(stressSettings, currentDecision = {}) {
  const s = stressSettings || {};
  return {
    ...getDefaultDecisionSettings(),
    ...currentDecision,
    equityMin: s.equityMin,
    bondMin: s.bondMin,
    cashTarget: s.cashTarget,
    duration: s.duration,
    baseSalary: s.baseSalary,
    spStartDate: s.spStartDate ?? currentDecision.spStartDate ?? null,
    spWeeklyAmount: s.spWeeklyAmount ?? currentDecision.spWeeklyAmount ?? 0,
    consecutiveLimit: s.consecutiveLimit ?? currentDecision.consecutiveLimit,
    recoveryBuffer: s.recoveryBuffer ?? currentDecision.recoveryBuffer,
    disableProtection: s.disableProtection ?? currentDecision.disableProtection ?? false,
    // protection unit: Stress multiplier → Decision percent (0.8 → 20)
    protectionEscalateMonths: s.protectionEscalateMonths ?? currentDecision.protectionEscalateMonths ?? 12,
    protectionFactor: s.protectionMult != null
      ? Math.round((1 - s.protectionMult) * 100)
      : currentDecision.protectionFactor,
    isaBalance: s.isaBalance ?? 0,
    isaReturn: s.isaReturn ?? ISA_DEFAULTS.RETURN,
    isaMin: s.isaMin ?? ISA_DEFAULTS.MIN,
    isaDrawdownStrategy: s.isaDrawdownStrategy ?? ISA_DEFAULTS.DRAWDOWN_STRATEGY,
    taggedFunds: (s.taggedFunds || []).map((f) => ({ ...f })),
    allocMode: s.allocMode ?? currentDecision.allocMode,
    subAsset: s.subAsset ?? null,
    diversifierStart: s.diversifierStart ?? 0,
    glideEndgame: s.glideEndgame ?? null,
    equityGlideEnabled: s.equityGlideEnabled ?? false,
    spendingProfile: s.spendingProfile ?? currentDecision.spendingProfile ?? 'flat',
    accessMethod: s.accessMethod ?? currentDecision.accessMethod ?? 'drawdown',
    ufplsYears: s.ufplsYears ?? currentDecision.ufplsYears ?? null,
    ufplsThenPcls: s.ufplsThenPcls ?? currentDecision.ufplsThenPcls ?? false,
    bandFillRecycle: s.bandFillRecycle ?? currentDecision.bandFillRecycle ?? false,
    // The plan's strategy travels with the copy. Without this the Decision tool runs pure
    // Pots & Valves against pot floors the user never chose for that strategy (see
    // research/rotation-plan-aug-2026.md, audit item D1).
    strategyId: s.strategyId ?? currentDecision.strategyId ?? 'pots-and-valves',
    strategyParams: s.strategyParams ? { ...s.strategyParams } : (currentDecision.strategyParams || {}),
    incomeShape: s.incomeShape ?? currentDecision.incomeShape ?? null,
    incomeSteps: Array.isArray(s.incomeSteps) ? s.incomeSteps.map((x) => ({ ...x })) : (currentDecision.incomeSteps || null),
    shapeAgeNow: s.shapeAgeNow ?? currentDecision.shapeAgeNow ?? null,
    // The plan's start (6.4.0): the Decision tool's plan year 0 is the Stress plan's first tax year,
    // derived from age today + retirement status. A legacy plan (no age today) leaves it unset and the
    // Decision tool falls back to the first tax year set up.
    firstTaxYear: (s.firstTaxYear > 0 || s.currentAge > 0) ? deriveTiming(s).firstTaxYear : (currentDecision.firstTaxYear ?? null),
    // Taxable sleeve (GIA) + the plan's windfalls: the Decision tool draws the sleeve before the
    // ISA, taxes it, and advises where each lump sum can legally go in its year. An explicit list
    // (like everything above) — a key missing here is silently dropped (audit item D1).
    taxableStart: s.taxableStart ?? currentDecision.taxableStart ?? 0,
    taxableMix: s.taxableMix ?? currentDecision.taxableMix ?? 'equity',
    giaTaxBand: s.giaTaxBand ?? currentDecision.giaTaxBand ?? 'basic',
    bedAndIsa: s.bedAndIsa ?? currentDecision.bedAndIsa ?? true,
    relevantEarnings: s.relevantEarnings ?? currentDecision.relevantEarnings ?? 0,
    windfalls: Array.isArray(s.windfalls) ? s.windfalls.map((w) => ({ ...w })) : (currentDecision.windfalls || []),
    configured: true,   // a full copy IS a configuration — routing can go straight to the tool
    seededFrom: 'stress'
  };
}

/**
 * Unlocking a plan that was locked before charges were added (6.19.0, D2): it then gets the default, as every unlocked
 * plan has, so its figures from now on take the charge off. Returns the Stress-settings patch to save, or null when the
 * plan already carries a valid charge (0 included). Pure.
 * @param {object} stressSettings
 * @returns {{ chargesPct: number }|null}
 */
export function chargesPatchOnUnlock(stressSettings) {
  return isChargesPct(stressSettings && stressSettings.chargesPct) ? null : { chargesPct: DEFAULT_CHARGES_PCT };
}

/**
 * Everything unlocking writes into a plan locked before a setting existed (6.22.0): the default charge (6.19.0, D2) and
 * "Mostly cash" for a plan with no choice of how its ISA grows (owner D4) — the defaults every unlocked plan has. One
 * Stress-settings patch, or null when the plan already carries both. Pure.
 * @returns {{ chargesPct?: number, isaGrowth?: string }|null}
 */
export function unlockPatchesOf(stressSettings) {
  const patch = { ...(chargesPatchOnUnlock(stressSettings) || {}), ...(isIsaGrowth(stressSettings && stressSettings.isaGrowth) ? {} : { isaGrowth: DEFAULT_ISA_GROWTH }) };
  return Object.keys(patch).length ? patch : null;
}

/** The plan whose budget this plan reads (budgetTool.sharedFrom), or null. */
export function budgetSharedFromOf(scenario) {
  const v = scenario?.budgetTool?.sharedFrom;
  return typeof v === 'string' && v && v !== scenario?.id ? v : null;
}
/** The fields of a budget that stay each plan's own when the budget is shared: who pays, and whose ages. */
export const BUDGET_OWN_SIDE = Object.freeze(['mySharePct', 'splitPhases', 'currentAge', 'retirementAge', 'retired', 'partnerAge', 'partnerRetirementAge', 'partnerRetired']);
/** A shared plan's own side of a budget: who pays and whose ages, nothing else (it holds no second copy of the lines). */
export function ownSideOf(budget) {
  const out = { sharedWithPartner: true };
  for (const k of BUDGET_OWN_SIDE) if (budget && budget[k] !== undefined) out[k] = budget[k];
  return out;
}
/** The household's budget as the partner's plan reads it: the lines are theirs, the side of who pays is ours. */
export function sharedBudgetView(theirs, own, from) {
  const out = { ...theirs, sharedWithPartner: true, sharedFrom: from };
  for (const k of BUDGET_OWN_SIDE) if (own && own[k] !== undefined) out[k] = own[k];
  if ((!own || own.mySharePct === undefined) && Number.isFinite(+theirs.mySharePct)) out.mySharePct = 100 - +theirs.mySharePct;
  return out;
}

// ---- the Decision settings' checksum (storage/DecisionRepository.js) ---------------------------------------------------

function stableSort(v) {
  if (Array.isArray(v)) return v.map(stableSort);
  if (v && typeof v === 'object') return Object.keys(v).sort().reduce((o, k) => { if (v[k] !== undefined) o[k] = stableSort(v[k]); return o; }, {});
  return v;
}

export function decisionSettingsChecksum(settings) {
  if (!settings) return '';
  // Lock bookkeeping is volatile: it must never move the checksum (an unlock alone would otherwise
  // mark every entry as "under previous settings").
  const { locked, lockedAt, lockedBy, unlockedAt, unlockCount, ...planDefining } = settings;
  // Key-order independent: Firestore hands objects back with keys in a different order from the
  // in-memory object they were saved from, and JSON.stringify would hash them differently.
  return simpleHash(stableSort(planDefining));
}

// ---- the plan of record (services/PlanLock.js buildPlanOfRecord) -----------------------------------------------------

export const PLAN_OF_RECORD_CPI = 0.04;   // decision-side assumed CPI: slightly pessimistic by design

/**
 * A frozen projection of the Decision settings — the yardstick "plan vs actual" uses. The body of PlanLock.buildPlanOfRecord,
 * with the clock handed in: PlanLock calls this with the settings it has read and `new Date()`.
 * @param {object} s    the Decision settings (after the seed from the Stress settings, on a lock)
 * @param {Date} now
 */
export function planOfRecordFor(s, now) {
  const assumedCpi = PLAN_OF_RECORD_CPI;
  return {
    savedAt: now.toISOString(),
    engineVersion: ENGINE_VERSION,
    assumedCpi,
    baseSalary: s.baseSalary,
    settingsChecksum: decisionSettingsChecksum(s),
    // Frozen bands by default: the Decision tool draws to the tax-year wizard's fixed BRL, so a plan of
    // record with inflating bands drifted above the actual draw every year (persona test B34).
    // No fund and platform charges on the yardstick (6.19.0, D6): it is built from the Decision settings, frozen at lock,
    // and "plan vs actual" reads it as it was — so 0 explicitly, whatever the settings carry.
    drawdown: generateDrawdownSchedule({ ...s, taxMode: s.taxMode || 'frozen', pa: s.pa || 12570, brl: s.brl || 50270, hrl: s.hrl || 125140 }, s.duration || 35, assumedCpi, undefined, { chargesPct: 0 })
      .map((r) => ({ year: r.year, sippDraw: Math.round(r.sippDraw), tax: Math.round(r.tax), isaDraw: Math.round(r.isaDraw), isaBalance: Math.round(r.isaBalance), spendable: Math.round(r.spendable) })),
    glidepath: generateGlidepathSchedule(s, assumedCpi).map((r) => ({ year: r.year, totalMin: Math.round(r.totalMin) }))
  };
}
