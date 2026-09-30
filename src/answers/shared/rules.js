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
  maxYears: 45,
  smallPot: 30000
};

/** The share of futures each amount must last in. */
export const BAND = { careful: 0.9, middling: 0.5, good: 0.1 };

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
