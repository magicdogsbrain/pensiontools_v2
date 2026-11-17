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
import { pinTiming } from './PlanTiming.js';
import { budgetAgesKnown, defaultBudget } from './BudgetModel.js';
import { DEFAULT_CHARGES_PCT } from './Charges.js';
import { DEFAULT_ISA_GROWTH } from './IsaGrowth.js';
import { isLockedSettings } from './LockedPlanGuard.js';
import { deriveStage } from './LifeStage.js';
import { whereAmI, buildTargetMix, CONTRACT_STRATEGIES } from './PlanDocument.js';
import { documentLadder, ladderPosition } from './LadderPosition.js';
import { targetHoldings, diffHoldings, progress, yearNeedsOf } from './TransitionPlanner.js';
import { normaliseHoldings } from './HoldingsRecord.js';
import { potsAsOfFor, withoutPotsAsOf, lockedPotsAsOf, potsDayOf } from './PlanFromToday.js';
import { readDayOf } from './PlanClosed.js';
import { laterDraftOf, withLockedStart } from './PlanMove.js';
import { potsAtStopOf } from './PotsAtStop.js';
import { planHasFigures } from './PlanFigures.js';
import { pensionTodayOf } from './PensionToday.js';
import { sippTodayOf } from './PotsAtRetirement.js';

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
 * @param {{ beforePin?: (settings: object) => object }} [o]  applied to the merged settings just before the timing is
 *   derived and pinned: a locked plan's own start (PlanMove.withLockedStart, 7.4.0), filled where the pin used to add it
 * @returns {object} Migrated database
 */
export function migrateStressSettings(db, now = new Date(), { beforePin = null } = {}) {
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
  if (typeof beforePin === 'function') migrated.settings = beforePin(migrated.settings);
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
 * A plan whose pots belong to a later plan year than its year 0 carries `potsAsOf` (6.50.0, PlanFromToday.potsAsOfFor): a
 * draft whose year 0 is behind it, 'today'; a locked plan, where it stood when its pots were frozen — so every engine runs
 * it from there, and a locked plan as committed whatever the day. So does a plan that says when work stopped whose pots
 * are its year 0's, after that year's April (6.51.0: nothing is shifted; its ladder sets no cash aside). Never saved.
 * @param {object} scenario  a saved plan, upgraded (scenarioMigration.upgradeScenario)
 * @param {{ now?: Date }} [o]
 */
export function effectiveStressSettings(scenario, { now = new Date(), env = {} } = {}) {
  let out = migratedStressSettings(scenario, now);
  // A retired draft saved with a later start than it should have (7.4.0, PlanMove.laterDraftOf) is read from the tax year
  // work stopped, or this one, every figure counted from year 0 keeping its age and tax year: written only by its next Save.
  const later = laterDraftOf(scenario, out, now);
  if (later) out = later.settings;
  out = withDerivedPots(scenario, out, now, env);
  const potsAsOf = potsAsOfFor(scenario, out, now);
  return potsAsOf ? { ...out, potsAsOf } : out;
}

/**
 * The pots when you stop, as read (7.12.0; services/PotsAtStop.js), in memory only: a plan still saving and not locked
 * reads them worked out from its own facts (or the person's own typed figure); a locked plan reads the figure its plan
 * document was locked with; anything else as stored. Nothing is written.
 */
export function withDerivedPots(scenario, settings, now = new Date(), env = {}) {
  const s = withPensionToday(scenario, settings || {}, now);
  if (s.retired !== false) return s;
  if (isLockedScenario(scenario)) {
    const doc = scenario && scenario.planDocument;
    const locked = doc && doc.pots && doc.pots.potAtRetirement;
    return locked && typeof locked === 'object' ? { ...s, potAtRetirement: { ...locked } } : s;
  }
  let worked = null;
  try { worked = potsAtStopOf(scenario, s, { now, env }); } catch (e) { worked = null; }
  // the person's own figure stays exactly as stored (marked 'override', as every reader of it expects)
  return worked && worked.source === 'worked' ? { ...s, potAtRetirement: worked } : s;
}

/** A plan's income as read when nobody has given one: none, said so (`incomeNotSet`, stripped before any save). */
const INCOME_NOT_SET = Object.freeze({ baseSalary: 0, incomeSteps: [], targetSchedule: null, incomeNotSet: true });

/**
 * A plan with no figures (PlanFigures.planHasFigures: straight from the full view's wizard, its pots the defaults) reads no
 * default as a figure (7.12.0): neither its income (none, `incomeNotSet`) nor its pots. When a pension today is known elsewhere (services/PensionToday.js: a pot record, What you
 * hold, the pot saved with what you pay in), its pots are that pension, split as stored; with none known, `potsNotSet`
 * says so (in memory only, stripped before any save like `potsAsOf`), so the full view shows the boxes empty. A plan with
 * figures, or locked, is read as stored.
 */
export function withPensionToday(scenario, settings, now = new Date()) {
  if (!scenario || planHasFigures(scenario)) return settings || {};
  // (7.12.0, decision 2) its income is the default too: never read as the person's. In memory only, like `potsNotSet`.
  const s = { ...(settings || {}), ...INCOME_NOT_SET };
  const known = pensionTodayOf(scenario, { now, settings: s });
  if (known.value == null) return { ...s, potsNotSet: true };
  const parts = ['bondMin', 'cashTarget', 'diversifierStart'];
  const total = sippTodayOf(s);
  const v = Math.max(0, Math.round(known.value));
  if (!(total > 0)) return { ...s, equityMin: v, bondMin: 0, cashTarget: 0, diversifierStart: 0 };
  const out = { ...s };
  let rest = v;
  for (const k of parts) { out[k] = Math.round(v * (+s[k] || 0) / total); rest -= out[k]; }
  out.equityMin = rest;
  return out;
}

/**
 * A draft read from an earlier start than it saved (PlanMove.laterDraftOf on the effective settings before it): the move
 * of its year 0 and the settings before and after it, or null. The Save that writes it (answers/plan/moveStart.js
 * laterDraftPatch) and the words that say it once read this.
 * @returns {null | { from, to, years, stopMonth, legacy, settings, before }}
 */
export function laterDraftReading(scenario, { now = new Date() } = {}) {
  const before = migratedStressSettings(scenario, now);
  const later = laterDraftOf(scenario, before, now);
  return later ? { ...later, before } : null;
}

/** The stored Stress settings with the load-time migrations (and the Budget's newer age) in memory, as the planner loads them. */
function migratedStressSettings(scenario, now) {
  const stressSettings = storedStressSettings(scenario);
  // "Age today" is maintained on the Budget page; a copy frozen in the Stress settings at the last save goes stale every
  // birthday. Prefer the newer figure — but only an age a person gave (budgetAgesKnown, 6.13.5).
  const b = (scenario && scenario.budgetTool && scenario.budgetTool.settings) || defaultBudget();
  if (b && budgetAgesKnown(b) && +b.currentAge > (+stressSettings.currentAge || 0)) {
    stressSettings.currentAge = +b.currentAge;
    stressSettings.currentAgeAsOf = b.currentAgeAsOf || stressSettings.currentAgeAsOf || null;
  }
  // A locked plan that never saved its year 0 keeps the year it was locked with (7.4.0, PlanMove.withLockedStart), filled
  // where the pin used to add it, so every other key keeps its place.
  const beforePin = (s) => withLockedStart(scenario, s, now);
  // Re-derived on every read, from the lock alone: a copy that once carried it and was saved by mistake decides nothing.
  return withoutPotsAsOf(migrateStressSettings({ settings: stressSettings, budget: b || null, lastModified: null, checksum: null }, now, { beforePin }).settings);
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
    // a first year begun before the pots' day is paid over twelve months from it, as the planner's reading does (6.51.0)
    const potsDay = potsDayOf({ potsAsOf: lockedPotsAsOf(sc) }, { lockedAt: doc.lockedAt || null, now });
    ladderPos = plan ? ladderPosition(plan, { today: now, potsDay, records: history }) : null;   // the months recorded this tax year (7.12.0)
  }
  const accHistory = doc && doc.accumulation && Array.isArray(sc.accumulationTool && sc.accumulationTool.history) ? sc.accumulationTool.history : [];
  const holdings = normaliseHoldings(sc.holdings);
  const taxYears = (sc.decisionTool && sc.decisionTool.taxYears) || null;
  return { today: now, history, ladderPos, accHistory, holdings, taxYears, ladderInDocument: !!(doc && documentLadder(doc, doc.strategy && doc.strategy.id || null)) };
}

/**
 * whereAmI on the plan document, with the inputs above; null when the plan has no document. A closed plan (PlanClosed.js)
 * is read as at the end of its last month (readDayOf): where it stood when it closed, not where it would be today.
 */
export function whereAmIFor(scenario, { now = new Date() } = {}) {
  const doc = scenario && scenario.planDocument;
  if (!doc) return null;
  const { ladderInDocument, ...inputs } = whereAmIInputs(scenario, { now: readDayOf(scenario, now) });
  return whereAmI(doc, inputs);
}

/**
 * The Transition page's inputs (index.html loadTransitionUI): the target from the plan document with the live strategy
 * dials, what you hold against it, and the tick-offs.
 * `roles` (7.11.1): the diff also carries each line's part (TransitionPlanner.diffHoldings `roles`), for the reading of what
 * is covered (answers/plan/gaps.js); no other caller asks.
 * `fromSettings` (7.10.0): on a plan with no document, a target built in memory from the effective settings — their
 * year-0 mix (PlanDocument.buildTargetMix) on the pension money in play today, no rungs — so the review and the home's
 * drift line can read an unlocked plan too. Never stored. An unlocked ladder has no rungs to read: its target is 'none'
 * (`ladderLater`). Only the review reader and the home's drift line pass it; every other caller reads as before.
 * @returns {{ target, diff, prog, fromSettings?: true, ladderLater?: true }|null}  null without a plan document (and
 *   without `fromSettings`)
 */
// `planMoney` (7.12.0): { pension, isa, from } — the plan's own money when nothing is listed in its accounts, for a ladder's
// "Paying for it". Read here from the one pension-today reader (planMoneyOf) unless the caller gives it.
export function moveInputs(scenario, { now = new Date(), fromSettings = false, roles = false, planMoney = null } = {}) {
  const sc = scenario || {};
  const doc = sc.planDocument || null;
  if (!doc) return fromSettings ? settingsMoveInputs(sc, { now }) : null;
  const ss = effectiveStressSettings(sc, { now });
  const target = targetHoldings(doc, { today: now, params: ss.strategyParams || null });
  if (!planMoney) planMoney = planMoneyOf(sc, { now, settings: ss });
  const rec = normaliseHoldings(sc.holdings);
  // the document's needs by year and today: read only when the record keeps something (7.6.0); each line's part only when
  // asked (7.11.1, `roles`: the reading of what is covered) — every other caller's diff is as before
  const diff = diffHoldings(rec.lines || [], target, { needs: yearNeedsOf(doc), today: now, asOf: rec.updatedAt || null, ...(roles ? { roles: true } : {}), ...(planMoney ? { planMoney } : {}) });
  const done = (sc.transition && sc.transition.done) || {};
  const prog = progress(diff, done);
  return { target, diff, prog, strategyParams: ss.strategyParams || null };
}

/** Where a pension today came from, in the move's words (MOVE.paying.from): a record, a check-in, else the plan's own figure. */
const MONEY_FROM = { checkIn: 'checkIn', record: 'record' };

/**
 * The plan's own money for the move when nothing is listed (7.12.0, the moving brief D3): the one pension today
 * (services/PensionToday.js pensionTodayOf: a check-in, the newest pot record, What you hold, the saved pot, the plan's own
 * pension total) with the ISA beside it (the record's, else the plan's), or null when no pension is known. Pure.
 * @returns {{ pension: number, isa: number, from: 'plan'|'checkIn'|'record' }|null}
 */
export function planMoneyOf(scenario, { now = new Date(), settings = null } = {}) {
  const ss = settings || effectiveStressSettings(scenario, { now });
  const t = pensionTodayOf(scenario, { now, settings: ss });
  if (!(t && t.value > 0)) return null;
  const isa = t.isa != null ? +t.isa || 0 : +(ss && ss.isaBalance) || 0;
  return { pension: t.value, isa, from: MONEY_FROM[t.from] || 'plan' };
}

/** moveInputs on an unlocked plan (no document): the settings' own year-0 mix, in memory only (see moveInputs). */
function settingsMoveInputs(sc, { now }) {
  const ss = effectiveStressSettings(sc, { now });
  const strategyParams = ss.strategyParams || null;
  const none = { kind: 'none', lines: [], paid: [], sold: [], rotated: false, cash: null, running: false, thisTaxYear: null, firstTaxYear: null, note: 'The ladder\'s years show once the plan is locked.' };
  if (CONTRACT_STRATEGIES.includes(ss.strategyId)) return { target: none, diff: null, prog: null, strategyParams, fromSettings: true, ladderLater: true };
  const mix = buildTargetMix(ss, Math.max(1, Math.round(+ss.duration || 1)));
  const allocation = { equityMin: +ss.equityMin || 0, bondMin: +ss.bondMin || 0, cashTarget: +ss.cashTarget || 0, diversifierStart: +ss.diversifierStart || 0 };
  const pot = allocation.equityMin + allocation.bondMin + allocation.cashTarget + allocation.diversifierStart;
  if (!mix.length || !(pot > 0)) return null;
  const target = targetHoldings({ targetMix: [mix[0]], pots: { sipp: pot, allocation } }, { today: now, params: strategyParams });
  const rec = normaliseHoldings(sc.holdings);
  const diff = diffHoldings(rec.lines || [], target, { today: now });
  return { target, diff, prog: progress(diff, {}), strategyParams, fromSettings: true };
}
