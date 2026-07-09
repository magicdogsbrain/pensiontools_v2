/**
 * Canonicalise engine output for stable golden fixtures: round every finite number to
 * 2 dp (kills insignificant float noise while catching real changes) and sort object
 * keys so the JSON diff is deterministic.
 */
export function canonical(obj) {
  if (typeof obj === 'number') {
    return Number.isFinite(obj) ? Math.round(obj * 100) / 100 : String(obj);
  }
  if (Array.isArray(obj)) return obj.map(canonical);
  if (obj && typeof obj === 'object') {
    const out = {};
    for (const k of Object.keys(obj).sort()) out[k] = canonical(obj[k]);
    return out;
  }
  return obj;
}

/**
 * Select the meaningful, compact, deterministic stress metrics.
 *
 * `finalValue` is intentionally EXCLUDED: a seed-0 Monte-Carlo run produces a NaN final
 * (bond model computes (1+r)^(1/12) with r < -1; the NaN is then counted as a successful
 * run), which poisons finalValue.avg → NaN and masks finalValue.min → 0 across every
 * config. That engine defect is pinned separately (see stress.golden.test.js "NaN final")
 * and logged in the bug register; once fixed, finalValue can be re-added here.
 */
export function pickStress(analysis) {
  const { total, successCount, failCount, successRate, survival, protection, hodl } = analysis;
  return canonical({ total, successCount, failCount, successRate, survival, protection, hodl });
}
