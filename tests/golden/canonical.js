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

/** Select the meaningful, compact stress metrics (drops per-run `failures` noise). */
export function pickStress(analysis) {
  const { total, successCount, failCount, successRate, survival, finalValue, protection, hodl } = analysis;
  return canonical({ total, successCount, failCount, successRate, survival, finalValue, protection, hodl });
}
