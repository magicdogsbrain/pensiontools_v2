/**
 * The State Pension, worked by hand (2026/27). Sources: the full new State Pension for 2026/27, £241.30 a week; the
 * State Pension age timetable of the Pensions Acts 2007 and 2014 (67 for anyone born 6 March 1961 to 5 April 1977; 68
 * for anyone born on or after 6 April 1978; the year between rises a month at a time and is not worked here).
 */
export const FULL_WEEKLY = 241.30;
/** 241.30 × 52 = 12,547.60 a year. */
export const FULL_YEARLY = FULL_WEEKLY * 52;
/** 12,547.60 ÷ 12 = 1,045.63 a month, shown as £1,046. */
export const FULL_MONTHLY = FULL_YEARLY / 12;

/** State Pension age from a date of birth ('YYYY-MM-DD'), or null for the year the law moves a month at a time. */
export function statePensionAge(dob) {
  const d = String(dob);
  if (d >= '1961-03-06' && d <= '1977-04-05') return 67;
  if (d >= '1978-04-06') return 68;
  if (d < '1961-03-06') throw new Error('statePensionAge: born before 6 March 1961 is not worked here');
  return null;
}

/**
 * State Pension age from an age today, for someone whose birthday is not known: the two ages it can be. A person of
 * `age` on `today` was born in one of two calendar years; both must give the same age for the answer to be certain.
 */
export function statePensionAgeFromAge(age, today = '2026-11-16') {
  const y = Number(today.slice(0, 4));
  const latest = `${y - age}-${today.slice(5)}`;          // born on this day: just turned `age`
  const earliest = `${y - age - 1}-${today.slice(5)}`;    // a year earlier, the day after: about to turn age + 1
  const a = statePensionAge(latest);
  const b = statePensionAge(earliest);
  return a === b ? a : null;
}
