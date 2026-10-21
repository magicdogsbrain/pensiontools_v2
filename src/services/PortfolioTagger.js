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

import { SUB_ASSET_PROFILES, FUND_TAG_MAP, FUND_CATALOGUE, BUCKETS } from './SubAssetModel.js';

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

  // Multi-asset funds (6.7.0): a catalogue entry with `mix` is split into one slice per sub-class so a
  // LifeStrategy 80 counts as 80% shares and 20% bonds, not as one line.
  const expanded = [];
  for (const h of holdings) {
    const entry = h.mix ? { mix: h.mix } : (h.ticker && !h.subClass ? FUND_CATALOGUE.find((f) => f.ticker === String(h.ticker).toUpperCase().trim()) : null);
    if (entry && entry.mix && typeof entry.mix === 'object') {
      const total = Object.values(entry.mix).reduce((s, w) => s + (+w || 0), 0) || 1;
      for (const [sc, w] of Object.entries(entry.mix)) if (+w > 0) expanded.push({ ...h, subClass: sc, value: (+h.value || 0) * (+w / total), mixOf: h.ticker || null });
    } else expanded.push(h);
  }
  for (const h of expanded) {
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
 * The mix a "funds to test" list makes (index.html rebuildCustomAllocFromFunds, lifted pure in 6.41.0 — research/v7/
 * way-and-mix.md 3.2c, 6; the planner calls it): the rows with a ticker and a value tagged and rolled up, the custom
 * allocation the planner keeps for the surface (the four shares of the pot and the four £ amounts, the sub-class mix), the
 * pot the list sets (the taxable side only) and the ISA the ISA-wrapped lines fill. null for an empty list.
 * @param {Array<{ ticker?: string, value?: number, wrapper?: string, subClass?: string }>} rows
 * @returns {{ tagged: object, custom: object, pot: number, isaBalance: number, diversifiers: boolean }|null}
 */
export function mixFromFunds(rows) {
  const holdings = (Array.isArray(rows) ? rows : []).filter(f => f && f.ticker && f.value > 0);
  if (!holdings.length) return null;
  const t = tagPortfolio(holdings);
  const alloc = allocationFromTags(t);
  return {
    tagged: t,
    custom: {
      label: 'Funds to test',
      equity: t.total ? t.buckets.shares / t.total : 0,
      bond: t.total ? t.buckets.bonds / t.total : 0,
      diversifiers: t.total ? t.buckets.diversifiers / t.total : 0,
      cash: t.total ? t.buckets.cash / t.total : 0,
      equityMin: alloc.equityStart, bondMin: alloc.bondStart, cashTarget: alloc.cashStart,
      diversifierStart: alloc.diversifierStart || 0, subAsset: alloc.subAsset || null
    },
    pot: Math.round(t.total - t.isaTotal),
    isaBalance: Math.round(t.isaTotal || 0),
    diversifiers: (alloc.diversifierStart || 0) > 0
  };
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
