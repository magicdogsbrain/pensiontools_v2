/**
 * Holdings — "tickers in, proportions modelled" (6.7.0).
 *
 * The plan's holdings ledger IS the tagged-funds list on the Stress settings (`taggedFunds`: one row per
 * holding with wrapper, ticker or name, value; now also `ocf` % and `contribution` £/month). This module
 * turns it into what the Accumulation planner and the plan document need: the proportions by bucket and
 * wrapper, the value-weighted cost, the mix's expected real return, and where new money goes. It never
 * models a fund's own return — a world tracker is a world tracker.
 *
 * Pure: no DOM, no storage.
 */
import { tagPortfolio } from './PortfolioTagger.js';
import { SUB_ASSET_PROFILES, BUCKETS } from './SubAssetModel.js';

export const ASSUMED_CPI = 0.025;   // long-run CPI used to state expected returns in real terms (FCA-style)

const num = (v) => (Number.isFinite(+v) ? +v : 0);

/** Split multi-asset holdings the way the tagger does, returning one row per sub-class slice. */
export function slices(holdings) {
  const t = tagPortfolio(holdings || []);
  return t.tagged;   // already split by mix where the catalogue says so
}

/**
 * Proportions of the whole ledger (ALL wrappers — this is the saver's view, not the engine's taxable pools).
 * @returns {{ total, byWrapper: {SIPP, ISA, GIA, CASH}, buckets: {shares, bonds, diversifiers, cash} (fractions),
 *   bucketValues, subClasses: [{key, label, bucket, value, weight}], weightedOcf, expectedNominal, expectedReal,
 *   contributions: { monthly, byBucket: {…fractions}, byWrapper }, untagged: [] }}
 */
export function proportions(holdings) {
  const list = (holdings || []).filter((h) => h && (num(h.value) > 0 || num(h.contribution) > 0));
  const t = tagPortfolio(list.map((h) => ({ ...h, value: num(h.value) })));
  const byWrapper = { SIPP: 0, ISA: 0, GIA: 0, CASH: 0 };
  const bucketValues = { shares: 0, bonds: 0, diversifiers: 0, cash: 0 };
  const sub = {};
  let total = 0, ocfWeighted = 0, retWeighted = 0;
  for (const s of t.tagged) {
    const v = num(s.value); if (!(v > 0)) continue;
    total += v;
    const w = (s.wrapper || 'SIPP').toUpperCase(); byWrapper[w in byWrapper ? w : 'SIPP'] += v;
    bucketValues[s.bucket] = (bucketValues[s.bucket] || 0) + v;
    sub[s.subClass] = (sub[s.subClass] || 0) + v;
    ocfWeighted += v * (num(s.ocf) / 100);
    const p = SUB_ASSET_PROFILES[s.subClass]; retWeighted += v * (p ? num(p.nominalReturn) : 0);
  }
  const buckets = {}; for (const b of Object.keys(bucketValues)) buckets[b] = total > 0 ? bucketValues[b] / total : 0;
  const subClasses = Object.entries(sub).map(([key, value]) => ({ key, label: SUB_ASSET_PROFILES[key]?.label || key, bucket: SUB_ASSET_PROFILES[key]?.bucket || 'shares', value, weight: total > 0 ? value / total : 0 })).sort((a, b) => b.value - a.value);
  const weightedOcf = total > 0 ? ocfWeighted / total : 0;
  const expectedNominal = total > 0 ? retWeighted / total : 0;
  // Contributions: where new money goes (by the destination holding's bucket)
  const contribList = list.filter((h) => num(h.contribution) > 0);
  const tc = tagPortfolio(contribList.map((h) => ({ ...h, value: num(h.contribution) })));
  const cBucket = { shares: 0, bonds: 0, diversifiers: 0, cash: 0 }; let cTotal = 0; const cWrap = { SIPP: 0, ISA: 0, GIA: 0, CASH: 0 };
  for (const s of tc.tagged) { const v = num(s.value); cTotal += v; cBucket[s.bucket] = (cBucket[s.bucket] || 0) + v; const w = (s.wrapper || 'SIPP').toUpperCase(); cWrap[w in cWrap ? w : 'SIPP'] += v; }
  const byBucket = {}; for (const b of Object.keys(cBucket)) byBucket[b] = cTotal > 0 ? cBucket[b] / cTotal : 0;
  return {
    total, byWrapper, buckets, bucketValues, subClasses, weightedOcf, expectedNominal,
    expectedReal: expectedNominal - ASSUMED_CPI - weightedOcf,
    contributions: { monthly: cTotal, byBucket, byWrapper: cWrap },
    untagged: t.untagged.map((u) => ({ ticker: u.ticker || '', name: u.name || '', value: num(u.value) }))
  };
}

/** One-line description of the mix: "78% shares · 17% bonds · 5% cash; cost 0.18%/yr; ~4.3% a year real". */
export function describeMix(p) {
  if (!p || !(p.total > 0)) return 'No holdings entered yet.';
  const parts = [];
  for (const [b, label] of [['shares', 'shares'], ['bonds', 'bonds'], ['diversifiers', 'diversifiers'], ['cash', 'cash']]) if (p.buckets[b] > 0.004) parts.push(Math.round(p.buckets[b] * 100) + '% ' + label);
  return parts.join(' · ') + '; cost ' + (p.weightedOcf * 100).toFixed(2) + '%/yr; about ' + (p.expectedReal * 100).toFixed(1) + '% a year real after costs at long-run assumptions';
}

/** Ledger total for the pension pot the Accumulation planner projects (SIPP-wrapped holdings). */
export function pensionPotFromHoldings(holdings) {
  return (holdings || []).reduce((t, h) => t + (((h.wrapper || 'SIPP').toUpperCase() === 'SIPP') ? num(h.value) : 0), 0);
}
