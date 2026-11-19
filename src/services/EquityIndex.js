/**
 * Equity index level + all-time high — the rotation trigger's data. Same three-layer pattern as
 * LinkerUniverse: bundled snapshot (build time), the day's equity.json (refreshed nightly by
 * scripts/fetch-gilt-data.mjs) set by the one market loader (src/reading/market.js), optional test override. The rotation rule
 * (research/rotation-plan-aug-2026.md) fires when the index closes >=30% below its all-time high.
 */
import snapshot from '../data/equitySnapshot.js';

let _live = null;
let _override = null;

export function activeEquity() { return _override || _live || snapshot; }
export function setEquityOverride(o) { _override = o; }   // tests / what-ifs only

/** The day's file, as the one market loader (src/reading/market.js loadMarket) found it; null puts the built-in copy back. */
export function setLiveEquity(data) { _live = data || null; }
/** The copy built into the site. */
export const BUNDLED_EQUITY = snapshot;

/** Drawdown from the all-time high (negative number, e.g. -0.31). */
export function equityDrawdown() { const e = activeEquity(); return e && e.ath > 0 ? e.level / e.ath - 1 : null; }

/** Stale after a week — the index only updates on trading days and the fetch runs Tue-Sat. */
export function isEquityStale(nowMs = Date.now()) {
  const e = activeEquity(); if (!e || !e.generated_at) return true;
  return (nowMs - Date.parse(e.generated_at)) > 7 * 24 * 3600 * 1000;
}

export function equityProvenance() {
  const e = activeEquity();
  return e ? { symbol: e.symbol, date: e.date, level: e.level, ath: e.ath, athDate: e.athDate, source: e.source, stale: isEquityStale() } : null;
}
