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
