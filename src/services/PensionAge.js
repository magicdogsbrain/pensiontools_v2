/**
 * The minimum pension age: the one rule both apps read (7.4.1). A defined-contribution pension (a SIPP, a personal or
 * workplace pot, and the tax-free lump from it) cannot be taken before it: 55, rising to 57 on 6 April 2028 for anyone
 * who is not 55 by then. Final-salary pensions and the State Pension are not touched by it; they start when they start.
 *
 * The figures lived in the answers' rules (answers/shared/rules.js, which now reads them from here) and as loose copies in
 * the planner; one copy now, so a change to the rule is made once. Pure data and arithmetic: no imports, no clock.
 */

export const PENSION_ACCESS = Object.freeze({ before: 55, from: 57, changesOn: '2028-04-06' });

/** The earliest age a pension can be touched on a given day ('YYYY-MM-DD'): 55 before 6 April 2028, 57 from then. */
export function accessAgeOn(isoDate) {
  return String(isoDate) < PENSION_ACCESS.changesOn ? PENSION_ACCESS.before : PENSION_ACCESS.from;
}

/** The last day of the old rule (5 April 2028), as a local date: a person's age on it decides their own access age. */
export function lastDayBeforeChange() {
  const [y, m, d] = PENSION_ACCESS.changesOn.split('-').map(Number);
  return new Date(y, m - 1, d - 1);
}

/**
 * A person's own minimum pension age from their age on the last day before the change: 55 when they are 55 by then (it
 * does not rise for them), 57 otherwise. Null without an age.
 */
export function accessAgeFromAgeBeforeChange(ageThen) {
  if (ageThen == null || !Number.isFinite(+ageThen)) return null;
  return +ageThen >= PENSION_ACCESS.before ? PENSION_ACCESS.before : PENSION_ACCESS.from;
}
