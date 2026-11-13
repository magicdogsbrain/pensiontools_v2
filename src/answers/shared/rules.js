/**
 * UK figures the answers use (V7 build brief 4.2). Pure data plus two small date helpers.
 * tests/v7/c/schema.test.js asserts the figures shared with today's engine are equal to the engine's own.
 */
import { DEFAULT_CHARGES_PCT } from '../../services/Charges.js';
import { DEFAULT_ISA_GROWTH } from '../../services/IsaGrowth.js';
import { PENSION_ACCESS, accessAgeOn } from '../../services/PensionAge.js';

export const RULES = {
  taxYear: '2026/27',
  // Checked against https://www.gov.uk/new-state-pension/what-youll-get on 30 Sep 2026: £241.30 a week.
  // Update every April (the yearly update checklist).
  fullStatePensionWeekly: 241.30,
  // The minimum pension age: the one rule both apps read (services/PensionAge.js, 7.4.1)
  pensionAccess: PENSION_ACCESS,
  taxFreeShare: 0.25,
  taxFreeLimit: 268275,                // = LUMP_SUM_ALLOWANCE in PensionAccess.js
  personalAllowance: 12570, basicRateLimit: 50270, higherRateLimit: 125140,   // = TAX_DEFAULTS
  taperFrom: 100000,                   // = TAX_DEFAULTS.PA_TAPER_THRESHOLD: the engine keeps this point fixed while the bands rise with prices
  savingsGrowth: 0.03,                 // = ISA_DEFAULTS.RETURN: the fixed rate a year savings (ISA money) grow at in a run with no choice
                                       // (a household made by hand); every household the model makes has one (isaGrowthDefault)
  // How savings grow when the answer does not say (6.22.0): today's planner's one default, "Mostly cash" (services/IsaGrowth.js)
  isaGrowthDefault: DEFAULT_ISA_GROWTH,
  maxYears: 45,
  // 7.8.0: the most drawing years a run goes to while weighing (105 − 45): the runs follow each future on to the
  // weighting age (drawYearsCap)
  maxDrawYears: 60,
  smallPot: 30000,

  // The saving years (step 4 brief 4.2). tests/v7/a/schema.test.js asserts these against today's engine and BudgetModel.
  annualAllowance: 60000,              // = ACCUMULATION_RULES.ANNUAL_ALLOWANCE while that file exists
  moneyPurchaseAllowance: 10000,       // = ACCUMULATION_RULES.MPAA
  // the tax added back is on what a person pays in up to all of their pay in the year, or this much when that is less
  reliefFloor: 3600,                   // = GIA_DEFAULTS.SIPP_NO_EARNINGS_GROSS (services/TaxableSleeve.js)
  isaAllowance: 20000,
  largePot: 1073100,                   // = ACCUMULATION_RULES.LSA_POT_THRESHOLD
  // PLSA Retirement Living Standards 2024, £ a year: = BudgetModel.js PLSA_2024. Update with them (the yearly update checklist).
  plsa: {
    single: { minimum: 14400, moderate: 31300, comfortable: 43100 },
    couple: { minimum: 22400, moderate: 43100, comfortable: 59000 }
  },
  stopAgeMax: 75
};

/**
 * The spread of the futures (7.8.0: the spread only, not the levels): the worst 1 in 10, the middling and the best 1 in
 * 10 of the pots, the ages and the amounts (bandIndexes, badCaseOf, the pot paths). The keys keep their names:
 * `potNow.careful` is the worst 1 in 10 of the spread, not a level.
 */
export const BAND = { careful: 0.9, middling: 0.5, good: 0.1 };

/**
 * The chance the money lasts as long as you do (research/v7/replan-nov-2026.md 5; 7.8.0). `weighted`: each future that
 * runs out counts by the chance of being alive when it does (shared/weigh.js). false is the rollback: every weight is
 * one whole future, the runs and the plan-to age follow the end-age rule before 7.8.0, and the verdicts are
 * legacyVerdictOf's — so Balanced is the figure and the verdict before 7.8.0, byte for byte.
 */
export const SUCCESS = { weighted: true };

/**
 * The most drawing years a run goes to: RULES.maxDrawYears while weighing (env.weighted in tests, else SUCCESS.weighted),
 * RULES.maxYears before 7.8.0 and in the rollback.
 */
export const drawYearsCap = (env) => ((env && typeof env.weighted === 'boolean' ? env.weighted : SUCCESS.weighted) ? RULES.maxDrawYears : RULES.maxYears);

/** The three levels a person picks from: the whole twentieths of weighted failure each lets through. Never a float. */
export const LEVEL_FAILS20 = Object.freeze({ careful: 1, balanced: 2, bold: 6 });
/** The same as a share that lasts, for words only (.95 / .90 / .70). */
export const LEVELS = Object.freeze(Object.fromEntries(Object.entries(LEVEL_FAILS20).map(([k, t]) => [k, 1 - t / 20])));
export const LEVEL_DEFAULT = 'balanced';
/** Each level and the line just under it (close): the lines the weighted words never round across. */
export const LEVEL_LINES = Object.freeze([0.95, 0.90, 0.85, 0.70, 0.65]);

/**
 * The old `confidence` values (B before 7.8.0) as levels. Typed (a URL, a draft): "9 in 10" was a choice → Careful;
 * "3 in 4" → Balanced. Stored (a seed's or a plan's inputs): B stored "9 in 10" for everyone by default, so both are
 * Balanced; a stored level is the person's own only when `levelChosen` says so.
 */
export const LEGACY_LEVEL = Object.freeze({
  typed: Object.freeze({ nineInTen: 'careful', threeInFour: 'balanced' }),
  stored: Object.freeze({ nineInTen: 'balanced', threeInFour: 'balanced' })
});

const own = (o, k) => typeof k === 'string' && Object.prototype.hasOwnProperty.call(o, k);

/** A level from any value said for one: a level as it is, an old value by where it came from, anything else Balanced. */
export function levelOf(v, { stored = false } = {}) {
  if (own(LEVEL_FAILS20, v)) return v;
  const old = stored ? LEGACY_LEVEL.stored : LEGACY_LEVEL.typed;
  return own(old, v) ? old[v] : LEVEL_DEFAULT;
}

/** One whole future's weight: a weight is round(S × 2^30), so sums of up to 1,000 are exact whatever their order. */
export const WEIGHT_ONE = 2 ** 30;

/**
 * THE one test of a level: the weighted failures `sumW` (whole numbers, see WEIGHT_ONE) of n futures are within t
 * twentieths. 20·sumW ≤ t·n·2^30, in whole numbers. Every verdict, solver and word guard calls this. With every weight
 * one whole future it is fails ≤ floor(t·n/20).
 */
export const passes = (sumW, n, t) => 20 * sumW <= t * n * WEIGHT_ONE;

/**
 * 'yes' | 'close' | 'no' at a level from the weighted failures: yes within its twentieths, close within one more. With
 * SUCCESS.weighted false (or `weighted` false), the verdict before 7.8.0 on the count (sumW / 2^30 failures).
 */
export function verdictAtLevel(sumW, n, level, weighted = SUCCESS.weighted) {
  if (!weighted) return legacyVerdictOf(sumW / WEIGHT_ONE, n);
  const t = LEVEL_FAILS20[levelOf(level)];
  return passes(sumW, n, t) ? 'yes' : passes(sumW, n, t + 1) ? 'close' : 'no';
}

/**
 * The saving years' constants (step 4 brief 4.2): the default charge a year, the slide to the drawing mix, the ceilings
 * and steps of the searches. The charge is today's planner's one default (services/Charges.js DEFAULT_CHARGES_PCT, 6.19.0):
 * `chargesPct` in percent (0.5), `charge` the same as a share (0.005 — the form saving.js and the households used first).
 * From 6.19.0 it is taken off while drawing as well as while saving (household.chargesPct; fastEngine.js, saving.js).
 */
// the age a plan runs to, one convention for both apps (7.9.0): services/AgeConvention.js, here for the answers' readers
export { planToAgeOf, TO_AGE_RULE, toAgeAsWritten } from '../../services/AgeConvention.js';

export const SAVING = { chargesPct: DEFAULT_CHARGES_PCT, charge: DEFAULT_CHARGES_PCT / 100, slideYears: 10, payInCeiling: 10000, potStep: 1000, potMax: 5_000_000, laterYears: 10 };

/**
 * The most probes one search may make (7.8.0). Every search the answers make is on whole steps over a fixed range — £1,000
 * pots to SAVING.potMax, £10 pay-ins to the ceiling, £10 amounts a month to the band's top — widened by doubling and then
 * halved, so none needs more than about 60 probes. A search that reaches SEARCH_PROBES has gone wrong: it stops there and
 * says only what it has verified — a pot, a pay-in or a sum it has not found is null (out of reach), an amount a month is
 * the most it found to pass. `probeCounter` counts one search's probes and throws OUT_OF_PROBES past its limit; the search
 * catches it (`bounded`) and answers so.
 */
export const SEARCH_PROBES = 100;
export const OUT_OF_PROBES = Object.freeze({ outOfProbes: true });
export function probeCounter(max = SEARCH_PROBES) {
  let left = Number.isFinite(max) ? max : SEARCH_PROBES;
  return () => { if (left-- <= 0) throw OUT_OF_PROBES; };
}
/** Runs a search; past its probes, `stopped()` is the answer (OUT_OF_PROBES is caught, anything else thrown on). */
export function bounded(search, stopped) {
  try {
    return search();
  } catch (e) {
    if (e === OUT_OF_PROBES) return stopped();
    throw e;
  }
}

/**
 * The lives the years before a pension opens may fail in, when B sets aside the savings that carry them (step 4 brief
 * section 10, J9): none. The savings and the pension are one life, and the one test allows floor(n / 10) failures in
 * all; the savings set aside for the closed years must not spend that allowance on their own.
 */
export const CLOSED_YEARS_FAILS = 0;

/**
 * Before 7.8.0 (and the rollback, old readings and old documents): the share of lives that may fail, yes = floor(n ×
 * 0.10), close = floor(n × 0.25) (conflict 16: counts, not shares).
 */
export const LEGACY_VERDICT = { yes: 0.10, close: 0.25 };

/** 'yes' | 'close' | 'no' from the number of lives that failed out of n, by LEGACY_VERDICT. */
export const legacyVerdictOf = (fails, n) => (fails <= Math.floor(n * LEGACY_VERDICT.yes) ? 'yes' : fails <= Math.floor(n * LEGACY_VERDICT.close) ? 'close' : 'no');

/** The full State Pension for a year: weekly × 52, to the penny. */
export const fullStatePensionYearly = () => Math.round(RULES.fullStatePensionWeekly * 52 * 100) / 100;

/** 'YYYY-MM-DD' moved on by a whole number of years (29 February lands on 28 February). Text in, text out: no clock. */
export function addYears(isoDate, years) {
  const [y, m, d] = String(isoDate).split('-').map(Number);
  const year = y + years;
  const leap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const day = m === 2 && d === 29 && !leap ? 28 : d;
  return `${String(year).padStart(4, '0')}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

/** The earliest age a pension can be touched on a given day: 55 before 6 April 2028, 57 from then (services/PensionAge.js). */
export { accessAgeOn };

/**
 * The first age at which a person who is `age` on `today` (the birthday taken to be today) can touch a pension:
 * 55 if they are 55 before 6 April 2028, otherwise 57. Someone already past that age gets the age that applies today: this
 * reads someone who has not started drawing, so after 5 April 2028 a 55- or 56-year-old reads 57. A plan's engines read the
 * same rule for someone already drawing (services/PensionAge.js says both, and the assumption between them).
 */
export function firstAccessAge(age, today) {
  const { before, from } = RULES.pensionAccess;
  if (age >= before) return accessAgeOn(today);
  return accessAgeOn(addYears(today, before - age)) === before ? before : from;
}

/**
 * Whether the rise from 55 to 57 on 6 April 2028 touches a person (the access-age-rises note, A and B): the rise is
 * still to come, they will not be 55 by then (so they wait until 57, where the old rule said 55), and they stop before
 * 57 (so the wait matters to this answer). A person already 55, or 56 today, is not touched; nor is anyone stopping at
 * 57 or later.
 */
export function accessRiseAffects(age, today, ageAtStop) {
  if (!(String(today) < RULES.pensionAccess.changesOn)) return false;
  return firstAccessAge(age, today) === RULES.pensionAccess.from && age < RULES.pensionAccess.before && ageAtStop < RULES.pensionAccess.from;
}
