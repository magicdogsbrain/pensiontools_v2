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
 * finalValue PERCENTILES (p5..p95, min) are pinned; `avg` and `max` are excluded because
 * they are dominated by the return model's fat right tail — with S&P-with-replacement
 * sampling a lucky run compounds to absurd values (£60bn+), which makes avg/max volatile
 * and uninformative. (The tail itself is a known model issue — see the S&P-optimism note
 * in the model review; taming it belongs to the MarketModel work, not the golden master.)
 * The median (p50) is the meaningful "typical final".
 */
export function pickStress(analysis) {
  const { total, successCount, failCount, successRate, survival, finalValue, protection, hodl } = analysis;
  const { avg, max, ...finalValuePercentiles } = finalValue;
  return canonical({
    total, successCount, failCount, successRate, survival, finalValue: finalValuePercentiles, protection, hodl
  });
}
