/**
 * UK figures the answers use (V7 build brief 4.2). Pure data plus two small date helpers.
 * tests/v7/c/schema.test.js asserts the figures shared with today's engine are equal to the engine's own.
 */
export const RULES = {
  taxYear: '2026/27',
  // Checked against https://www.gov.uk/new-state-pension/what-youll-get on 30 Sep 2026: £241.30 a week.
  // Update every April (the yearly update checklist).
  fullStatePensionWeekly: 241.30,
  pensionAccess: { before: 55, from: 57, changesOn: '2028-04-06' },
  taxFreeShare: 0.25,
  taxFreeLimit: 268275,                // = LUMP_SUM_ALLOWANCE in PensionAccess.js
  personalAllowance: 12570, basicRateLimit: 50270, higherRateLimit: 125140,   // = TAX_DEFAULTS
  taperFrom: 100000,                   // = TAX_DEFAULTS.PA_TAPER_THRESHOLD: the engine keeps this point fixed while the bands rise with prices
  savingsGrowth: 0.03,                 // = ISA_DEFAULTS.RETURN: savings (ISA money) grow at this fixed rate a year in the engine
  maxYears: 45,
  smallPot: 30000,

  // The saving years (step 4 brief 4.2). tests/v7/a/schema.test.js asserts these against today's engine and BudgetModel.
  annualAllowance: 60000,              // = ACCUMULATION_RULES.ANNUAL_ALLOWANCE while that file exists
  moneyPurchaseAllowance: 10000,       // = ACCUMULATION_RULES.MPAA
  isaAllowance: 20000,
  largePot: 1073100,                   // = ACCUMULATION_RULES.LSA_POT_THRESHOLD
  // PLSA Retirement Living Standards 2024, £ a year: = BudgetModel.js PLSA_2024. Update with them (the yearly update checklist).
  plsa: {
    single: { minimum: 14400, moderate: 31300, comfortable: 43100 },
    couple: { minimum: 22400, moderate: 43100, comfortable: 59000 }
  },
  stopAgeMax: 75
};

/** The share of futures each amount must last in. */
export const BAND = { careful: 0.9, middling: 0.5, good: 0.1 };

/** The saving years' constants (step 4 brief 4.2): the default charge a year, the slide to the drawing mix, the ceilings and steps of the searches. */
export const SAVING = { charge: 0.005, slideYears: 10, payInCeiling: 10000, potStep: 1000, potMax: 5_000_000, laterYears: 10 };

/**
 * The lives the years before a pension opens may fail in, when B sets aside the savings that carry them (step 4 brief
 * section 10, J9): none. The savings and the pension are one life, and the one test allows floor(n / 10) failures in
 * all; the savings set aside for the closed years must not spend that allowance on their own.
 */
export const CLOSED_YEARS_FAILS = 0;

/** The share of lives that may fail: yes = floor(n × 0.10), close = floor(n × 0.25) (conflict 16: counts, not shares). */
export const VERDICT = { yes: 0.10, close: 0.25 };

/** 'yes' | 'close' | 'no' from the number of lives that failed out of n. */
export const verdictOf = (fails, n) => (fails <= Math.floor(n * VERDICT.yes) ? 'yes' : fails <= Math.floor(n * VERDICT.close) ? 'close' : 'no');

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

/** The earliest age a pension can be touched on a given day: 55 before 6 April 2028, 57 from then. */
export function accessAgeOn(isoDate) {
  return String(isoDate) < RULES.pensionAccess.changesOn ? RULES.pensionAccess.before : RULES.pensionAccess.from;
}

/**
 * The first age at which a person who is `age` on `today` (the birthday taken to be today) can touch a pension:
 * 55 if they are 55 before 6 April 2028, otherwise 57. Someone already past that age gets the age that applies today.
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
