/**
 * Portfolio Tagger — turn a list of real fund holdings into a 4-bucket allocation the engine can run.
 * =============================================================================
 * "Tell me what bucket my asset is in." Each holding {ticker, value, wrapper} is tagged to a
 * sub-class via FUND_TAG_MAP, rolled up to the four buckets (shares / bonds / diversifiers / cash),
 * and — crucially — the WITHIN-BUCKET sub-class weights are derived from the tagged £ amounts, so the
 * engine models THIS portfolio's actual bond and diversifier mix (not the defaults).
 *
 * Note: the engine models equity (the shares bucket) as a single series, so shares sub-class tags are
 * informational only; the bond and diversifier sub-weights genuinely drive the returns.
 */

import { SUB_ASSET_PROFILES, FUND_TAG_MAP, BUCKETS } from './SubAssetModel.js';

/**
 * Tag a list of holdings and roll them up.
 * @param {Array<{ticker?:string, subClass?:string, value:number, wrapper?:string}>} holdings
 *   ticker resolves via FUND_TAG_MAP; or pass subClass directly. wrapper: 'ISA' | 'SIPP' (default SIPP).
 * @returns {{buckets, subClassTotals, bondWeights, diversifierWeights, total, isaTotal, tagged, untagged}}
 */
export function tagPortfolio(holdings) {
  const buckets = { [BUCKETS.SHARES]: 0, [BUCKETS.BONDS]: 0, [BUCKETS.DIVERSIFIERS]: 0, [BUCKETS.CASH]: 0 };
  const subClassTotals = {};
  const tagged = [];
  const untagged = [];
  let total = 0, isaTotal = 0;

  for (const h of holdings) {
    const value = +h.value || 0;
    const key = h.subClass || (h.ticker ? FUND_TAG_MAP[h.ticker] : undefined);
    const profile = key ? SUB_ASSET_PROFILES[key] : null;
    if (!profile) { untagged.push({ ...h }); continue; }
    total += value;
    tagged.push({ ...h, subClass: key, bucket: profile.bucket, label: profile.label });
    // ISA-wrapped holdings are the engine's SEPARATE tax-free pool (isaBalance) — they must NOT
    // also land in the taxable buckets or the pot is double-counted (one £60k ISA became £120k
    // of simulated wealth). They're kept out of the sub-class weights too: the ISA pool grows at
    // its own flat return, not through the sub-asset model.
    if ((h.wrapper || '').toUpperCase() === 'ISA') { isaTotal += value; continue; }
    buckets[profile.bucket] += value;
    subClassTotals[key] = (subClassTotals[key] || 0) + value;
  }

  return {
    buckets,
    subClassTotals,
    bondWeights: normaliseBucketWeights(subClassTotals, BUCKETS.BONDS),
    diversifierWeights: normaliseBucketWeights(subClassTotals, BUCKETS.DIVERSIFIERS),
    total,
    isaTotal,
    tagged,
    untagged
  };
}

/** Normalise the sub-class £ totals within one bucket to weights summing to 1 (empty → {}). */
function normaliseBucketWeights(subClassTotals, bucket) {
  const entries = Object.entries(subClassTotals).filter(([k]) => SUB_ASSET_PROFILES[k].bucket === bucket);
  const sum = entries.reduce((s, [, v]) => s + v, 0);
  if (sum <= 0) return {};
  const w = {};
  for (const [k, v] of entries) w[k] = v / sum;
  return w;
}

/**
 * Convert a tagged portfolio into the engine's starting-balance + sub-asset config inputs.
 * @param {ReturnType<typeof tagPortfolio>} tagged
 * @returns {{equityStart, bondStart, cashStart, diversifierStart, isaBalance, subAsset}}
 */
export function allocationFromTags(tagged) {
  const diversifierStart = tagged.buckets[BUCKETS.DIVERSIFIERS] || 0;
  const config = {
    equityStart: tagged.buckets[BUCKETS.SHARES] || 0,
    bondStart: tagged.buckets[BUCKETS.BONDS] || 0,
    cashStart: tagged.buckets[BUCKETS.CASH] || 0,
    isaBalance: tagged.isaTotal || 0
  };
  if (diversifierStart > 0) {
    config.diversifierStart = diversifierStart;
    config.subAsset = {};
  }
  // Always drive the bond bucket by the tagged mix when we have one (still the sub-asset path).
  if (Object.keys(tagged.bondWeights).length) {
    config.subAsset = config.subAsset || {};
    config.subAsset.bondWeights = tagged.bondWeights;
  }
  if (Object.keys(tagged.diversifierWeights).length) {
    config.subAsset = config.subAsset || {};
    config.subAsset.diversifierWeights = tagged.diversifierWeights;
  }
  return config;
}

/**
 * The real £1.3M "Retirement Income Portfolio Report.pdf" holdings, verbatim from the PDF
 * (July 2026 snapshot). Used as a worked example / regression fixture.
 */
export const PDF_PORTFOLIO = Object.freeze([
  // Bucket 1 — Income Engine (£660k, SIPP)
  { ticker: 'UKW',  value: 100000, wrapper: 'SIPP', name: 'Greencoat UK Wind' },
  { ticker: 'HICL', value: 110000, wrapper: 'SIPP', name: 'HICL Infrastructure' },
  { ticker: 'SEQI', value: 90000,  wrapper: 'SIPP', name: 'Sequoia Economic Infrastructure' },
  { ticker: 'CTY',  value: 125000, wrapper: 'SIPP', name: 'City of London Investment Trust' },
  { ticker: 'MYI',  value: 125000, wrapper: 'SIPP', name: 'Murray International Trust' },
  { ticker: 'LWDB', value: 110000, wrapper: 'SIPP', name: 'Law Debenture Corporation' },
  // Bucket 2 — Defensive Bunker (£540k; the £60k IGLS is the ISA bridge)
  { ticker: 'IGLS', value: 60000,  wrapper: 'ISA',  name: 'iShares UK Gilts 0-5yr (ISA bridge)' },
  { ticker: 'IGLS', value: 85000,  wrapper: 'SIPP', name: 'iShares UK Gilts 0-5yr (buffer)' },
  { ticker: 'CGT',  value: 90000,  wrapper: 'SIPP', name: 'Capital Gearing Trust' },
  { ticker: 'SGLN', value: 85000,  wrapper: 'SIPP', name: 'iShares Physical Gold' },
  { ticker: 'IBTM', value: 80000,  wrapper: 'SIPP', name: 'iShares $ Treasury 7-10yr' },
  { ticker: 'TI5G', value: 70000,  wrapper: 'SIPP', name: 'iShares $ TIPS 0-5 (GBP-hedged)' },
  { ticker: 'BHMG', value: 70000,  wrapper: 'SIPP', name: 'BH Macro' },
  // Bucket 3 — Legacy (£100k, SIPP)
  { ticker: 'PACW', value: 100000, wrapper: 'SIPP', name: 'Amundi Prime All Country World' }
]);
