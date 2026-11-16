/**
 * Calendar sums for the scenario tests. A month is 'YYYY-MM'; a date is 'YYYY-MM-DD'. UK tax years run 6 April to 5 April.
 */
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const ym = (m) => { const [y, mm] = String(m).slice(0, 7).split('-').map(Number); return { y, mm }; };

/** Whole months from month `a` to month `b` (b later): 2026-11 to 2038-02 is 135. */
export function monthsBetween(a, b) {
  const x = ym(a); const z = ym(b);
  return (z.y - x.y) * 12 + (z.mm - x.mm);
}

/** The month `n` months after `m` (n may be negative). */
export function addMonths(m, n) {
  const { y, mm } = ym(m);
  const i = y * 12 + (mm - 1) + n;
  return `${Math.floor(i / 12)}-${String((i % 12) + 1).padStart(2, '0')}`;
}

/** '2038-02' as a person reads it: 'February 2038'. */
export const monthName = (m) => { const { y, mm } = ym(m); return `${MONTHS[mm - 1]} ${y}`; };
/** 'February 2038' back to '2038-02', or null. */
export function monthFromName(text) {
  const m = /\b(January|February|March|April|May|June|July|August|September|October|November|December) (\d{4})\b/.exec(String(text));
  return m ? `${m[2]}-${String(MONTHS.indexOf(m[1]) + 1).padStart(2, '0')}` : null;
}

/** 135 months → { years: 11, months: 3 }. */
export const yearsAndMonths = (n) => ({ years: Math.floor(n / 12), months: n % 12 });

/** The tax year a date falls in, as '2026/27'. 5 April belongs to the year before. */
export function taxYearOf(date) {
  const d = String(date);
  const y = Number(d.slice(0, 4));
  const start = d.slice(5, 10) >= '04-06' ? y : y - 1;
  return `${start}/${String((start + 1) % 100).padStart(2, '0')}`;
}

/**
 * The months of a tax year from a month on, counting that month: from November 2026, November to March is 5. The
 * site counts a tax year's months as April to March (each month's draw on its calendar month).
 */
export function monthsLeftInTaxYear(m) {
  const { y, mm } = ym(m);
  const endYear = mm >= 4 ? y + 1 : y;
  return monthsBetween(m, `${endYear}-03`) + 1;
}

/** Age on a date for a date of birth (both 'YYYY-MM-DD'). */
export function ageOn(dob, date) {
  const b = String(dob); const d = String(date);
  let age = Number(d.slice(0, 4)) - Number(b.slice(0, 4));
  if (d.slice(5, 10) < b.slice(5, 10)) age -= 1;
  return age;
}
