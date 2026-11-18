/**
 * The one clock (lead4.md R5). Both views see a plan from the same day: the simple view reads the date once at start-up
 * (src/v7/effects/clock.js `today`) and works every figure from `dateOf(today)`, a local Date at noon; the full view asks
 * `todayOf()` here and hands that Date to every run, worker job and reading, so both views see the same instant of the
 * same day. Pure apart from the one read of the real date when no date is given.
 *
 *   todayOf(now?)    the local day of `now` (default: the real date) at noon, as dateOf('YYYY-MM-DD') gives it
 *   dayKeyOf(date)   'YYYY-MM-DD' of a Date, local (what a cache keyed to the day compares)
 */
export function todayOf(now = new Date()) {
  const d = now instanceof Date ? now : new Date(now);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12, 0, 0, 0);
}

const pad = (n) => String(n).padStart(2, '0');

export function dayKeyOf(date) {
  const d = date instanceof Date ? date : todayOf();
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
}
