/**
 * Dates in words for the plan pages (research/v7/your-plan.md 3; editing-in-v7.md 2). Pure; no clock. Shared by read.js
 * and about.js (about.js cannot import read.js: read.js reads the stale-answer rule from it).
 *
 *   dateOf(today)        'YYYY-MM-DD' → a local Date at noon (never midnight: a clock change cannot move the day)
 *   monthWords('2026-10') → 'October 2026'; monthName → 'October'
 *   dayWords('2026-07-01T08:15:00.000Z' | '2026-07-01') → '1 July 2026' (the calendar day as written)
 *   localDay(date)       a Date's LOCAL calendar day as 'YYYY-MM-DD' (the form currentAgeAsOf is saved in)
 */
export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function dateOf(today) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(today || ''));
  if (!m) throw new Error('planRead needs today as YYYY-MM-DD');
  return new Date(+m[1], +m[2] - 1, +m[3], 12, 0, 0, 0);
}
export const ym = (s) => { const m = /^(\d{4})-(\d{2})/.exec(String(s || '')); return m ? { y: +m[1], m: +m[2] } : null; };
export const monthWords = (s) => { const p = ym(s); return p && p.m >= 1 && p.m <= 12 ? MONTHS[p.m - 1] + ' ' + p.y : ''; };
export const monthName = (s) => { const p = ym(s); return p && p.m >= 1 && p.m <= 12 ? MONTHS[p.m - 1] : ''; };
export const dayWords = (s) => { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(s || '')); return m && +m[2] >= 1 && +m[2] <= 12 ? +m[3] + ' ' + MONTHS[+m[2] - 1] + ' ' + m[1] : monthWords(s); };
export const monthsBetween = (a, b) => (b.y - a.y) * 12 + (b.m - a.m);
const pad = (n) => String(n).padStart(2, '0');
export const localDay = (d) => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
export const localMonth = (d) => d.getFullYear() + '-' + pad(d.getMonth() + 1);
