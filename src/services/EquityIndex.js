/**
 * Equity index level + all-time high — the rotation trigger's data. Same three-layer pattern as
 * LinkerUniverse: bundled snapshot (build time), live fetch of ./data/equity.json (refreshed
 * nightly by scripts/fetch-gilt-data.mjs), optional test override. The rotation rule
 * (research/rotation-plan-aug-2026.md) fires when the index closes >=30% below its all-time high.
 */
import snapshot from '../data/equitySnapshot.js';

let _live = null;
let _override = null;

export function activeEquity() { return _override || _live || snapshot; }
export function setEquityOverride(o) { _override = o; }   // tests / what-ifs only

export async function loadLiveEquity(url = './data/equity.json') {
  try {
    const r = await fetch(url, { cache: 'no-cache' });
    if (!r.ok) return null;
    const data = await r.json();
    if (!data || !Number.isFinite(data.level) || !Number.isFinite(data.ath)) return null;
    if (!snapshot.generated_at || data.generated_at >= snapshot.generated_at) _live = data;
    return _live;
  } catch (e) { return null; }
}

/** Drawdown from the all-time high (negative number, e.g. -0.31). */
export function equityDrawdown() { const e = activeEquity(); return e && e.ath > 0 ? e.level / e.ath - 1 : null; }

/** Stale after a week — the index only updates on trading days and the fetch runs Tue-Sat. */
export function isEquityStale() {
  const e = activeEquity(); if (!e || !e.generated_at) return true;
  return (Date.now() - Date.parse(e.generated_at)) > 7 * 24 * 3600 * 1000;
}

export function equityProvenance() {
  const e = activeEquity();
  return e ? { symbol: e.symbol, date: e.date, level: e.level, ath: e.ath, athDate: e.athDate, source: e.source, stale: isEquityStale() } : null;
}
