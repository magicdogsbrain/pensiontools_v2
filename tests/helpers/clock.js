/**
 * One place for pinned dates in tests (V7 step 1, "safety net").
 *
 * Two tools, in order of preference:
 *  1. INJECT — pass one of these Dates as the module's `now` / `today` argument. Every pure module under
 *     src/services and src/strategies takes one (tests/determinism.test.js scans for a bare `new Date()`).
 *  2. FREEZE — `frozen(date, fn)` swaps the global Date for the duration of fn. Needed only for code that
 *     cannot take a clock yet (src/storage: createSimulationConfigFromSettings → State Pension start year).
 *     Only Date is faked: timers and promises keep working.
 *
 * Dates are LOCAL NOON: the app's tax-year maths reads local getMonth()/getDate(), the gilt pricing reads the
 * UTC date (toISOString) — noon gives the same calendar day under both in any UK/CI time zone.
 */
import { vi } from 'vitest';

export const at = (y, m, d, h = 12) => new Date(y, m - 1, d, h, 0, 0, 0);

/** Either side of the tax-year boundary (6 April 2027): 2026/27 then 2027/28. */
export const BEFORE_TAX_YEAR = at(2027, 4, 4);
export const AFTER_TAX_YEAR = at(2027, 4, 8);
/** The default "today" for a fixture that just needs a fixed day. */
export const PINNED_NOW = at(2026, 9, 10);

/** Nest-safe: an inner frozen() sets its own day and hands the outer one back (useFakeTimers alone would keep the outer time). */
export function frozen(date, fn) {
  const nested = vi.isFakeTimers();
  const outer = nested ? new Date() : null;
  if (!nested) vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(date);
  try { return fn(); } finally { if (nested) vi.setSystemTime(outer); else vi.useRealTimers(); }
}

/** Data only, as it would be saved: drops functions/undefined so closures never make two equal results look different. */
export const plain = (x) => JSON.parse(JSON.stringify(x, (k, v) => (typeof v === 'number' && !Number.isFinite(v) ? String(v) : v)));

/** Dotted paths at which two plain values differ (arrays by index). [] = identical. */
export function diffPaths(a, b, path = '', out = []) {
  if (Object.is(a, b)) return out;
  const obj = (v) => v !== null && typeof v === 'object';
  if (!obj(a) || !obj(b) || Array.isArray(a) !== Array.isArray(b)) { out.push(path || '(root)'); return out; }
  for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) diffPaths(a[k], b[k], path ? path + '.' + k : k, out);
  return out;
}

/**
 * diffPaths for "the day asked moves inside one tax year" (A's PA12, B's PB8, C's M13), by the lead's ruling K (20 Nov
 * 2026): a person who gives only an age is that age on the day they ask, so the kept plan's year of birth moves with the
 * day by a few days of a year, and the life tables' weights with it. Every figure holds exactly but a WEIGHTED chance
 * (a key named `weighted`), which may move by less than 0.001; the verdict word is a path of its own and stays exact.
 * No other tolerance.
 */
export function dayMovedPaths(a, b) {
  const at = (o, p) => p.split('.').reduce((x, k) => (x == null ? x : x[k]), o);
  return diffPaths(a, b).filter((p) => !(/(^|\.)weighted$/.test(p) && typeof at(a, p) === 'number' && typeof at(b, p) === 'number'
    && Math.abs(at(a, p) - at(b, p)) < 0.001));
}
