/**
 * Shared bits for the bug-replay suite (research/bug-replay-catalogue.md).
 *
 * Every test here replays ONE bug a person found by hand in September 2026 (the QA audit and the release
 * notes' "corrections"), through the real modules, and would fail if the bug came back. The bug id from the
 * catalogue is the first word of each test name, so `npx vitest run tests/replay -t P13` finds it.
 *
 * Dates are pinned: a replay that passes today and fails on 1 January is the very bug class 6.4.0 fixed.
 */
import { vi } from 'vitest';

/** Local noon on a calendar day (month 1-based) — the same day under local and UTC reads. */
export const at = (y, m, d) => new Date(y, m - 1, d, 12, 0, 0, 0);

/** The day most of the September walk-throughs happened on. */
export const SEPT_2026 = at(2026, 9, 10);

/** Freeze only Date (timers and promises keep working) for code that still reads the wall clock. */
export async function frozenAt(date, fn) {
  vi.useFakeTimers({ toFake: ['Date'], now: date });
  try { return await fn(); } finally { vi.useRealTimers(); }
}

/** Firestore refuses `undefined` anywhere in a document: true when a value carries one. */
export function hasUndefined(v) {
  if (v === undefined) return true;
  if (Array.isArray(v)) return v.some(hasUndefined);
  if (v && typeof v === 'object') return Object.values(v).some(hasUndefined);
  return false;
}

/** UK income tax on a gross figure below £100k — written out here so the replays do not mark their own homework. */
export function ukTax(gross, pa = 12570, brl = 50270) {
  if (gross <= pa) return 0;
  return gross <= brl ? (gross - pa) * 0.2 : (brl - pa) * 0.2 + (gross - brl) * 0.4;
}
