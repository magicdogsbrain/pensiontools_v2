/**
 * The minimum pension age: the one rule both apps read (7.4.1). A defined-contribution pension (a SIPP, a personal or
 * workplace pot, and the tax-free lump from it) cannot be taken before it: 55, rising to 57 on 6 April 2028 for anyone
 * who is not 55 by then. Final-salary pensions and the State Pension are not touched by it; they start when they start.
 *
 * The figures lived in the answers' rules (answers/shared/rules.js, which now reads them from here) and as loose copies in
 * the planner; one copy now, so a change to the rule is made once. Pure data and arithmetic: no imports, no clock.
 *
 * Two readings of the rule, on purpose, and the one assumption between them:
 *  - A plan's own access age (PlanTiming.accessAgeOf, which every engine reads through PensionLock): 55 for someone who is 55
 *    by 5 April 2028, 57 otherwise; the plan then draws from the first tax year that starts with them at that age. For
 *    someone who is 55 or 56 on 6 April 2028 the engines assume they have moved into drawdown before then what they will
 *    draw before 57: the law lets a pension already being drawn carry on, but nothing new can be taken until 57 by anyone
 *    who had not started. Both apps say so in their 2028 notes (answers/plan/income.js drawdown2028, the D answer's
 *    d-2028 warning, HouseholdDraw.pensionAgeNote), which tell that person to do it.
 *  - The answers' first age a pension can be touched (answers/shared/rules.js firstAccessAge, apart.js): for someone who
 *    has not started, read on a day — so after 5 April 2028 a 55- or 56-year-old reads 57, the rule as it stands for them.
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

/**
 * A pension still closed, said as the plan takes it (the lead's ruling G, 20 Nov 2026): the law's age and the plan's own
 * first open year, both facts, never one against the other. Every plan opens the pension from the first tax year that STARTS
 * with the person at or over the access age (PensionLock.js), so it is said as that: "You can take money from your pension
 * from 57. This plan takes it from April 2031, the first tax year you start at 57 or over; until then your ISA and savings
 * pay." The one builder of these words (no imports, so every caller can read it): the plan pages (PlanTiming's Timing words and
 * earlyPensionDrawWords, PensionLock.closedYearsWords, the month's alert, the V7 home and Does it last?) and the answers (D's warning, assumption and closed stretch, as parts) read it.
 * Pieces: strings, { age } for the access age and { date } for the month the plan first takes from the pension.
 *   law        "You can take money from your pension from 57."
 *   plan       "This plan takes it from April 2031, the first tax year you start at 57 or over"
 *   meanwhile  "; until then your ISA and savings pay."
 * @param {{ accessAge: number, opensTaxYear: number }} o
 */
export function pensionOpensPieces(o) {
  const date = 'April ' + o.opensTaxYear;
  const age = { age: o.accessAge };
  return {
    date,
    law: ['You can take money from your pension from ', age, '.'],
    plan: ['This plan takes it from ', { date }, ', the first tax year you start at ', age, ' or over'],
    meanwhile: ['; until then your ISA and savings pay.']
  };
}

/** pensionOpensPieces as one string: the law, then the plan, and what pays meanwhile (unless `meanwhile` is false). */
export function pensionOpensSentence(o, { meanwhile = true } = {}) {
  const w = pensionOpensPieces(o);
  const text = (list) => list.map((x) => (typeof x === 'string' ? x : x.date || String(x.age))).join('');
  return text(w.law) + ' ' + text(w.plan) + (meanwhile ? text(w.meanwhile) : '.');
}
