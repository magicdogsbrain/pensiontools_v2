/**
 * A plan year as the plan pays it (7.12.0, step E8): ONE reading for every way of drawing.
 *
 * A plan year has the months it pays for: twelve, or — the run's first year, when it starts part-way through a tax year
 * (stressTest.planFromSettings `year0Months`: from the month work stops, or from the month of the pots' day) — the months
 * from then to March. For a year of m months:
 *  - the spending is the year's figure × m/12;
 *  - the income that comes anyway arrives in those months only: other income (a final-salary pension, an annuity, income
 *    streams, and money paid before the pots — PlanNeed.js charges it for the year's months; p.otherIncomeByYear, a rate a
 *    year) × m/12, and the State Pension from its start, its first year counted as the share of the
 *    tax year it is paid in (p.spFirstYearRatioTaxYear, whole months from its month to March), never more than the year's
 *    own months;
 *  - so the need from the pots or the contract is the spending less the State Pension (the yearly figures the bought ways
 *    read, p.targetSchedule, are already net of the other income).
 * Pots & Valves and Buckets run the same months in their monthly engine (SimulationEngine `year0Months`, its State Pension
 * share set from the same months: planFromSettings), and tests/partYearOneSum.test.js proves the engine draws the need
 * given here.
 *
 * `p` is the plan from planFromSettings (or its shape: year0Months, spAnnual, spStartYear, spFirstYearRatioTaxYear,
 * spFirstYearRatio, otherIncomeByYear, targetSchedule, targetAnnual).
 */

/** The months plan year `y` of the run pays for: year 0 its months when fewer than twelve, else 12. */
export const monthsOf = (p, y) => (y === 0 && p && p.year0Months > 0 && p.year0Months < 12 ? Math.round(p.year0Months) : 12);

/** The State Pension that arrives in plan year `y` (today's money): none before its start; its first year's share; else the year's months. */
export function spIn(p, y) {
  const a = p && p.spAnnual > 0 ? p.spAnnual : 0;
  const s = p ? (p.spStartYear ?? 99) : 99;
  if (!a || !(y >= s)) return 0;
  const share = monthsOf(p, y) / 12;
  if (y !== s) return a * share;
  const first = p.spFirstYearRatioTaxYear ?? p.spFirstYearRatio ?? 1;
  return a * Math.min(first, share);
}

/** The other income (final-salary pension, annuity, income streams, a lump sum's use) that arrives in plan year `y`. */
export const otherIn = (p, y) => ((p && p.otherIncomeByYear && p.otherIncomeByYear[y]) || 0) * monthsOf(p, y) / 12;

/** The plan's yearly figure for year `y`, net of its other income (the bought ways' schedule). */
export const rateOf = (p, y) => {
  const s = Array.isArray(p.targetSchedule) && p.targetSchedule.length ? p.targetSchedule : null;
  return s ? (s[Math.min(y, s.length - 1)] ?? p.targetAnnual) : p.targetAnnual;
};

/**
 * Plan year `y`: { months, spending, sp, other, need }. `rate` is the year's figure the way asks for, net of other income
 * (absent: the plan's schedule, rateOf). spending = what the months spend (rate × m/12 + the other income in them);
 * need = what the pots or the contract pay (rate × m/12 − the State Pension in them, never below nothing).
 */
export function paidYearOf(p, y, rate = rateOf(p, y)) {
  const months = monthsOf(p, y);
  const asked = (+rate || 0) * months / 12;
  const sp = spIn(p, y), other = otherIn(p, y);
  return { months, spending: asked + other, sp, other, need: Math.max(0, asked - sp) };
}

/** The need alone (paidYearOf's), for a way's yearly draw: `k` is 1-based (plan year k − 1), as the bought ways count. */
export const needAtK = (p, k, rate) => paidYearOf(p, k - 1, rate).need;
