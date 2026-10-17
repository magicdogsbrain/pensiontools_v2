/**
 * Reading a saved plan the way the planner reads it, without the repositories (research/v7/your-plan.md 2.1, 4.2).
 *
 * The planner works a plan's life stage out on its EFFECTIVE Stress settings — the stored copy after the defaults are
 * merged under it, old field names are renamed, the old "declining" profile is folded into steps, the Budget's newer age
 * is folded in, and the plan's start is pinned (index.html refreshLifeStage; StressRepository.loadStressDBAsync and
 * migrateStressDB). Until 6.26 those steps lived in the repository, whose load path also WRITES the start pin. They are
 * here now, as one pure function both apps call: the repository (which still writes the pin) and the preview (which
 * never writes anything).
 *
 *   getDefaultStressDB()                       the defaults merged UNDER every stored plan on load (never the charge)
 *   migrateStressSettings(db)                  the load-time migration of one Stress db ({ settings, budget, … })
 *   effectiveStressSettings(scenario, { now }) the settings the planner's stage, where-am-I and transition page read
 *   planStage(scenario, { now })               deriveStage on those settings
 *   whereAmIInputs(scenario, { now })          exactly what the planner's whereAmINow gathers
 *   whereAmIFor(scenario, { now })             whereAmI on the plan document, or null without one
 *   moveInputs(scenario, { now })              the Transition page's target, diff and progress
 *   thisMonth(now)                             'YYYY-MM': the month Monthly Entry opens on
 *
 * Pure: no storage, no DOM, no clock of its own (`now` is handed in; it defaults to the clock only for the planner's
 * own callers, as the repositories always have).
 */
import { DRAWDOWN_DEFAULTS, TAX_DEFAULTS, SIMULATION_DEFAULTS } from '../constants.js';
import { getDefaultStressSettings } from '../storage/stressDefaults.js';
import { smileToSteps, compileSteps } from './IncomeSchedule.js';
import { pinTiming, taxYearStartOf, taxYearKey } from './PlanTiming.js';
import { budgetAgesKnown, defaultBudget } from './BudgetModel.js';
import { DEFAULT_CHARGES_PCT } from './Charges.js';
import { DEFAULT_ISA_GROWTH } from './IsaGrowth.js';
import { isLockedSettings } from './LockedPlanGuard.js';
import { deriveStage } from './LifeStage.js';
import { whereAmI } from './PlanDocument.js';
import { documentLadder, ladderPosition } from './LadderPosition.js';
import { targetHoldings, diffHoldings, progress } from './TransitionPlanner.js';
import { normaliseHoldings } from './HoldingsRecord.js';

/**
 * Default stress database structure.
 * It is merged UNDER every stored plan on load (migrateStressSettings), so it never carries the fund and platform charge
 * (6.19.0): a locked plan from before charges must keep reading none, which every engine takes as 0%.
 */
export function getDefaultStressDB() {
  return {
    settings: {
      // Fund minimums
      equityMin: DRAWDOWN_DEFAULTS.EQUITY_MIN,
      bondMin: DRAWDOWN_DEFAULTS.BOND_MIN,
      cashTarget: DRAWDOWN_DEFAULTS.CASH_TARGET,
      duration: DRAWDOWN_DEFAULTS.DURATION_YEARS,

      // Income
      baseSalary: DRAWDOWN_DEFAULTS.BASE_SALARY,
      other: 0,
      statePension: 12000,
      statePensionYear: 12,

      // Tax
      pa: TAX_DEFAULTS.PERSONAL_ALLOWANCE,
      brl: TAX_DEFAULTS.BASIC_RATE_LIMIT,
      hrl: TAX_DEFAULTS.HIGHER_RATE_LIMIT,
      taxMode: 'inflates',

      // Protection
      protectionMult: SIMULATION_DEFAULTS.PROTECTION_MULTIPLIER,
      consecutiveLimit: DRAWDOWN_DEFAULTS.CONSECUTIVE_LIMIT,
      disableProtection: false,

      // HODL (emergency reserve)
      hodlEnabled: SIMULATION_DEFAULTS.HODL_ENABLED,
      hodlValue: SIMULATION_DEFAULTS.HODL_VALUE,

      // Spending profile ('flat' default; 'declining' = spending drifts down with age)
      spendingProfile: 'flat',
      // Rising-equity glidepath / bond tent (opt-in)
      equityGlideEnabled: false,
      // Diversifiers sleeve (gold + trend/macro), opt-in — 0 = off (legacy 3-bucket)
      diversifierStart: 0,
      // Tagged fund holdings (from "Build from my funds"), reused across tabs
      taggedFunds: []
    },
    lastModified: null,
    checksum: null
  };
}

/**
 * Migrates old database formats to current version (StressRepository.migrateStressDB until 6.26, unchanged).
 * @param {{ settings?: object, budget?: object|null, lastModified?: *, checksum?: * }} db
 * @param {Date} [now]
 * @returns {object} Migrated database
 */
export function migrateStressSettings(db, now = new Date()) {
  const migrated = { ...getDefaultStressDB() };

  // Merge settings
  if (db.settings) {
    migrated.settings = { ...migrated.settings, ...db.settings };

    // Migrate old field names
    if (db.settings.pacwMin !== undefined && db.settings.equityMin === undefined) {
      migrated.settings.equityMin = db.settings.pacwMin;
    }
    if (db.settings.cgtMin !== undefined && db.settings.bondMin === undefined) {
      migrated.settings.bondMin = db.settings.cgtMin;
    }
    if (db.settings.csh2Target !== undefined && db.settings.cashTarget === undefined) {
      migrated.settings.cashTarget = db.settings.csh2Target;
    }

    // Ensure HODL fields exist
    if (migrated.settings.hodlEnabled === undefined) {
      migrated.settings.hodlEnabled = false;
    }
    if (migrated.settings.hodlValue === undefined) {
      migrated.settings.hodlValue = 25000;
    }
  }

  // The separate "Declining with age" spending profile (v6.2.0 and earlier) is now expressed on the
  // income steps themselves (per-step decline / glide). Bake it in once so the compiled schedule is
  // identical and the plan stops carrying a multiplier nothing shows any more.
  const ms = migrated.settings;
  if (ms.spendingProfile === 'declining') {
    const ageNow = +ms.shapeAgeNow || 57;
    const steps = (ms.incomeShape === 'phases' && Array.isArray(ms.incomeSteps) && ms.incomeSteps.length) ? ms.incomeSteps : [{ fromAge: ageNow, amount: +ms.baseSalary || 0 }];
    ms.incomeShape = 'phases';
    ms.incomeSteps = smileToSteps(steps, ageNow);
    ms.shapeAgeNow = ageNow;
    ms.targetSchedule = compileSteps(ms, ageNow);
    ms.spendingProfile = 'flat';
    ms.spendingMigratedFrom = 'declining';
  }
  // 6.4.0: the plan's start (first tax year, retired / retire-at-age) is saved rather than implied by
  // today's date. Derived once from the age today + the income shape's start age; written back by the planner's load
  // path the first time (6.13.5 — StressRepository.loadStressDBAsync), never by the preview.
  migrated.settings = pinTiming(migrated.settings, db.budget || null, now);

  migrated.lastModified = db.lastModified;
  migrated.checksum = db.checksum;

  return migrated;
}

const copy = (v) => (v === undefined ? undefined : JSON.parse(JSON.stringify(v)));
const isLockedScenario = (scenario) => !!(scenario && scenario.decisionTool && isLockedSettings(scenario.decisionTool.settings));

/**
 * The Stress settings a plan has saved, as the planner's readers hand them out (ScenarioRepository.getActiveStressSettings):
 * the defaults, with the default charge and "Mostly cash" only when the plan is not locked, for a plan with none.
 */
export function storedStressSettings(scenario) {
  const s = scenario && scenario.stressTool && scenario.stressTool.settings;
  if (s && typeof s === 'object') return copy(s);
  return scenario && !isLockedScenario(scenario) ? { ...getDefaultStressSettings(), chargesPct: DEFAULT_CHARGES_PCT, isaGrowth: DEFAULT_ISA_GROWTH } : getDefaultStressSettings();
}

/**
 * The settings the planner's stage, where-am-I strip and transition page read (StressRepository.loadStressDBAsync +
 * migrateStressDB, in memory). The plan is not changed.
 * @param {object} scenario  a saved plan, upgraded (scenarioMigration.upgradeScenario)
 * @param {{ now?: Date }} [o]
 */
export function effectiveStressSettings(scenario, { now = new Date() } = {}) {
  const stressSettings = storedStressSettings(scenario);
  // "Age today" is maintained on the Budget page; a copy frozen in the Stress settings at the last save goes stale every
  // birthday. Prefer the newer figure — but only an age a person gave (budgetAgesKnown, 6.13.5).
  const b = (scenario && scenario.budgetTool && scenario.budgetTool.settings) || defaultBudget();
  if (b && budgetAgesKnown(b) && +b.currentAge > (+stressSettings.currentAge || 0)) {
    stressSettings.currentAge = +b.currentAge;
    stressSettings.currentAgeAsOf = b.currentAgeAsOf || stressSettings.currentAgeAsOf || null;
  }
  return migrateStressSettings({ settings: stressSettings, budget: b || null, lastModified: null, checksum: null }, now).settings;
}

/** deriveStage on the effective settings, as the planner's refreshLifeStage does. */
export function planStage(scenario, { now = new Date() } = {}) {
  const sc = scenario || {};
  const ss = effectiveStressSettings(sc, { now });
  return deriveStage({ ...sc, stressTool: { ...(sc.stressTool || {}), settings: ss } }, now);
}

/** 'YYYY-MM' of `now`, local: the month Monthly Entry opens on. */
export function thisMonth(now = new Date()) {
  return now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
}

/** The Decision history ascending by date, at most `limit` (the planner's getHistoryAsync({ sortDesc: false, limit: 500 })). */
export function historyAscending(scenario, limit = 500) {
  const h = Array.isArray(scenario && scenario.decisionTool && scenario.decisionTool.history) ? scenario.decisionTool.history : [];
  return h.filter((x) => x && typeof x === 'object').slice().sort((a, b) => String(a.date || '').localeCompare(String(b.date || ''))).slice(-limit);
}

/**
 * Exactly what the planner's whereAmINow gathers (index.html): the history ascending (at most 500), the ladder from the
 * plan document only (never rebuilt at today's prices), the saver's pot records when the document holds a path, what you
 * hold, and the tax years' set-ups.
 */
export function whereAmIInputs(scenario, { now = new Date() } = {}) {
  const sc = scenario || {};
  const doc = sc.planDocument || null;
  const history = historyAscending(sc);
  let ladderPos = null;
  if (doc && doc.strategy && doc.strategy.contract) {
    const plan = documentLadder(doc, doc.strategy.id || null);
    ladderPos = plan ? ladderPosition(plan, { today: now }) : null;
  }
  const accHistory = doc && doc.accumulation && Array.isArray(sc.accumulationTool && sc.accumulationTool.history) ? sc.accumulationTool.history : [];
  const holdings = normaliseHoldings(sc.holdings);
  const taxYears = (sc.decisionTool && sc.decisionTool.taxYears) || null;
  return { today: now, history, ladderPos, accHistory, holdings, taxYears, ladderInDocument: !!(doc && documentLadder(doc, doc.strategy && doc.strategy.id || null)) };
}

/** whereAmI on the plan document, with the inputs above; null when the plan has no document. */
export function whereAmIFor(scenario, { now = new Date() } = {}) {
  const doc = scenario && scenario.planDocument;
  if (!doc) return null;
  const { ladderInDocument, ...inputs } = whereAmIInputs(scenario, { now });
  return whereAmI(doc, inputs);
}

/**
 * The Transition page's inputs (index.html loadTransitionUI): the target from the plan document with the live strategy
 * dials, the run-up cash sized by this tax year's expected pension draw (else the last recorded month), what you hold
 * against it, and the tick-offs.
 * @returns {{ target, diff, prog }|null}  null without a plan document
 */
export function moveInputs(scenario, { now = new Date() } = {}) {
  const sc = scenario || {};
  const doc = sc.planDocument || null;
  if (!doc) return null;
  const ss = effectiveStressSettings(sc, { now });
  let runUpMonthly = 0;
  const key = taxYearKey(taxYearStartOf(now));
  const cfg = sc.decisionTool && sc.decisionTool.taxYears && sc.decisionTool.taxYears[key];
  runUpMonthly = +(cfg && cfg.expectedMonthly && cfg.expectedMonthly.sipp && cfg.expectedMonthly.sipp.gross) || 0;
  if (!runUpMonthly) {
    const hist = historyAscending(sc);
    const last = hist.length ? hist[hist.length - 1] : null;
    runUpMonthly = last ? (+last.sippDraw || +last.sipp || 0) : 0;
  }
  const target = targetHoldings(doc, { today: now, params: ss.strategyParams || null, runUpMonthly });
  const rec = normaliseHoldings(sc.holdings);
  const diff = diffHoldings(rec.lines || [], target);
  const done = (sc.transition && sc.transition.done) || {};
  const prog = progress(diff, done);
  return { target, diff, prog };
}
