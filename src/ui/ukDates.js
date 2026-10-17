/**
 * Dates in UK words (v6 usability audit, problem 3 / section 2.4, 17 Oct 2026): nothing the planner shows is an ISO
 * stamp ("2026-09", "2027-04-06") or in US order. These take what the plan stores and give back "September 2026" or
 * "6 April 2027". Anything they cannot read is returned as it was, so a free-text date ("21 April 2037") is left alone.
 *
 * Pure: no DOM, no clock.
 */
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const parts = (s) => /^(\d{4})-(\d{2})(?:-(\d{2}))?(?:T.*)?$/.exec(String(s ?? '').trim());

/** 'YYYY-MM' or 'YYYY-MM-DD' (or an ISO instant) → 'September 2026'. Else the input as a string ('' for nothing). */
export function ukMonth(s) {
  const m = parts(s);
  if (!m || +m[2] < 1 || +m[2] > 12) return s == null ? '' : String(s);
  return MONTHS[+m[2] - 1] + ' ' + m[1];
}

/** 'YYYY-MM-DD' (or an ISO instant, read as its calendar day in UTC) → '6 April 2027'; 'YYYY-MM' → 'April 2027'. */
export function ukDate(s) {
  const m = parts(s);
  if (!m || +m[2] < 1 || +m[2] > 12) return s == null ? '' : String(s);
  if (!m[3]) return MONTHS[+m[2] - 1] + ' ' + m[1];
  return +m[3] + ' ' + MONTHS[+m[2] - 1] + ' ' + m[1];
}

/** A Date (or anything Date() reads) → '6 April 2027' in the LOCAL calendar; '' when it is not a date. */
export function ukDay(d) {
  const dt = d instanceof Date ? d : new Date(d);
  if (!Number.isFinite(dt.getTime())) return '';
  return dt.getDate() + ' ' + MONTHS[dt.getMonth()] + ' ' + dt.getFullYear();
}
