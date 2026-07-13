/**
 * Sub-Asset-Class Model — DATA + PURE HELPERS ONLY (NOT yet wired into any engine).
 * =============================================================================
 * Phase: asset-class sub-modelling. See docs/asset-class-research.md for the sourced
 * numbers and the modelling decision behind this file.
 *
 * MODELLING APPROACH (decided 2026-07): DRIVER / FACTOR DECOMPOSITION.
 * The engine replays two primitives — the EQUITY path and the INFLATION path
 * (constants.EQUITY_RETURNS / INFLATION). Every sub-asset below is modelled as a
 * TRANSFORM of those primitives plus a small idiosyncratic residual, so each sub-class
 * stays automatically consistent with historical replay AND every named scenario
 * (2022 / 1970s / 2008 / Japan) — its crisis behaviour EMERGES from the same equity+
 * inflation path the engine already replays, rather than being hard-coded.
 *
 * The one derived primitive this phase adds is a GILT-YIELD path, itself derived from
 * the inflation driver (decision: derive-from-inflation, not a new historical series):
 *     yieldLevel_t = anchor + k * inflationExpectation_t
 *     dYield_t     = yieldLevel_t - yieldLevel_{t-1}          // driven by inflation surprises
 * Bond-family capital return then = carry - duration * dYield_t (+ inflation uplift for linkers,
 * + an equity-linked credit-spread term for corporates). Long gilts crash in 2022 because the
 * 2022 inflation spike drives dYield up and their duration is large; short gilts barely move.
 *
 * This module is intentionally INERT: exported as data + pure functions, imported by nothing
 * in the engine yet. Wiring it in is a later, opt-in, golden-safe step gated on a config flag.
 */

// -----------------------------------------------------------------------------
// Feature flag — OFF. Nothing reads this yet; it exists so the later wiring can gate
// on a single switch and keep the golden fixtures byte-identical when disabled.
// -----------------------------------------------------------------------------
export const SUB_ASSET_ENABLED = false;

// -----------------------------------------------------------------------------
// The four buckets. Names Cautious/Balanced/Adventurous are preserved elsewhere;
// this phase adds DIVERSIFIERS as a 4th bucket held FLAT (like cash — not glided by
// the bond tent, which continues to de-risk only the equity<->bond growth sleeve).
// -----------------------------------------------------------------------------
export const BUCKETS = Object.freeze({
  SHARES: 'shares',
  BONDS: 'bonds',
  DIVERSIFIERS: 'diversifiers',
  CASH: 'cash'
});

// -----------------------------------------------------------------------------
// Sub-class driver profiles.
//   Anchors (nominalReturn / yield / vol / eqCorr) come from docs/asset-class-research.md
//   (BlackRock/JPM/Vanguard CMAs central case; DMS/AQR for diversifiers).
//   Driver loadings are the transform coefficients for the factor decomposition:
//     duration      — years; capital return sensitivity to dYield (known bond math)
//     inflationBeta — loading on realised inflation (linkers ~1; gold small +ve)
//     creditBeta    — loading on the equity-linked credit-spread term (corporates)
//     crisisBeta    — extra return in the flight-to-quality / crash regime the engine
//                     already detects (equityBondRho's -0.3 regime); gold > 0, long UST > 0
//     momentumBeta  — loading on trailing path momentum (trend-following only; path-dependent)
//     idioVol       — idiosyncratic annual vol, set so total modelled vol ≈ the CMA vol anchor
//   All figures NOMINAL unless noted; real yields flagged. These are calibration seeds, not
//   final tuned values — the wiring step calibrates idioVol to hit each vol anchor exactly.
// -----------------------------------------------------------------------------
export const SUB_ASSET_PROFILES = Object.freeze({
  // ---- SHARES ----------------------------------------------------------------
  ukEquityIncome:   { bucket: BUCKETS.SHARES, label: 'UK equity income',        nominalReturn: 0.068, yield: 0.040, vol: 0.16, eqCorr: 0.90, duration: 0,   inflationBeta: 0,   creditBeta: 0,   crisisBeta: 0,    idioVol: 0.07 },
  globalEquityIncome:{ bucket: BUCKETS.SHARES, label: 'Global equity income',    nominalReturn: 0.070, yield: 0.030, vol: 0.16, eqCorr: 0.95, duration: 0,   inflationBeta: 0,   creditBeta: 0,   crisisBeta: 0,    idioVol: 0.05 },
  worldGrowth:      { bucket: BUCKETS.SHARES, label: 'World growth / tracker',   nominalReturn: 0.070, yield: 0.020, vol: 0.17, eqCorr: 1.00, duration: 0,   inflationBeta: 0,   creditBeta: 0,   crisisBeta: 0,    idioVol: 0.00 },

  // ---- BONDS -----------------------------------------------------------------
  shortGilts:       { bucket: BUCKETS.BONDS,  label: 'Short gilts 0-5y (buffer)', nominalReturn: 0.043, yield: 0.043, vol: 0.026, eqCorr: 0.10, duration: 2.5, inflationBeta: 0,   creditBeta: 0,   crisisBeta: 0,    idioVol: 0.01 },
  longGilts:        { bucket: BUCKETS.BONDS,  label: 'Long gilts 15y+',           nominalReturn: 0.064, yield: 0.055, vol: 0.108, eqCorr: 0.20, duration: 15,  inflationBeta: 0,   creditBeta: 0,   crisisBeta: 0,    idioVol: 0.02 },
  indexLinked:      { bucket: BUCKETS.BONDS,  label: 'Index-linked gilts (long)', nominalReturn: 0.047, yieldReal: 0.023, vol: 0.10, eqCorr: 0.33, duration: 15,  inflationBeta: 1.0, creditBeta: 0,   crisisBeta: 0,    idioVol: 0.03, realYield: true },
  corporateIG:      { bucket: BUCKETS.BONDS,  label: '£ IG corporate',            nominalReturn: 0.053, yield: 0.052, vol: 0.065, eqCorr: 0.41, duration: 6.5, inflationBeta: 0,   creditBeta: 0.4, crisisBeta: 0,    idioVol: 0.03 },
  globalAggHedged:  { bucket: BUCKETS.BONDS,  label: 'Global-agg £-hedged',       nominalReturn: 0.045, yield: 0.045, vol: 0.053, eqCorr: 0.30, duration: 6,   inflationBeta: 0,   creditBeta: 0.2, crisisBeta: 0,    idioVol: 0.02 },
  usTreasHedged:    { bucket: BUCKETS.BONDS,  label: 'US treasuries £-hedged',    nominalReturn: 0.040, yield: 0.040, vol: 0.068, eqCorr: 0.10, duration: 7,   inflationBeta: 0,   creditBeta: 0,   crisisBeta: 0.15, idioVol: 0.02 },
  infraDebt:        { bucket: BUCKETS.BONDS,  label: 'Infrastructure debt',       nominalReturn: 0.064, yield: 0.060, vol: 0.07,  eqCorr: 0.30, duration: 8,   inflationBeta: 0.3, creditBeta: 0.3, crisisBeta: 0,    idioVol: 0.03, note: 'IG + ~115bps illiquidity premium' },

  // ---- CASH ------------------------------------------------------------------
  moneyMarket:      { bucket: BUCKETS.CASH,   label: 'Money-market fund',         nominalReturn: 0.034, yield: 0.034, vol: 0.002, eqCorr: 0.00, duration: 0.1, inflationBeta: 0, creditBeta: 0, crisisBeta: 0, idioVol: 0.00, note: 'FCA -1% real; = engine cash model' },
  savings:          { bucket: BUCKETS.CASH,   label: 'Savings / NS&I',            nominalReturn: 0.034, yield: 0.034, vol: 0.001, eqCorr: 0.00, duration: 0,   inflationBeta: 0, creditBeta: 0, crisisBeta: 0, idioVol: 0.00 },

  // ---- DIVERSIFIERS ----------------------------------------------------------
  // The two sleeves {equity, inflation, yield} don't fully explain — the real tail hedges.
  gold:             { bucket: BUCKETS.DIVERSIFIERS, label: 'Gold',               nominalReturn: 0.055, yield: 0.000, vol: 0.155, eqCorr: 0.05, duration: 0, inflationBeta: 0.3, creditBeta: 0, crisisBeta: 0.5, idioVol: 0.14, note: 'near-uncorrelated; rises when stocks AND bonds fall (2022)' },
  trendMacro:       { bucket: BUCKETS.DIVERSIFIERS, label: 'Trend / macro',      nominalReturn: 0.045, yield: 0.000, vol: 0.12,  eqCorr: 0.07, duration: 0, inflationBeta: 0,   creditBeta: 0, crisisBeta: 0,   momentumBeta: 0.6, idioVol: 0.10, note: 'lagged path-momentum; pays in prolonged 2008/2022, whipsaws in V-shaped 2020' }
});

// -----------------------------------------------------------------------------
// PDF fund -> sub-class tag map (the user's "tell me what bucket my asset is in").
// From the real £1.3M Retirement Income Portfolio Report. Labels only — tagging real
// funds to a modelled sub-class so it feels like the user's own portfolio.
// -----------------------------------------------------------------------------
// Curated catalogue of common UK-listed funds/ETFs/investment trusts, each with a DEFAULT sub-class.
// These are SUGGESTIONS only — the tagging UI lets the user override the sub-class per holding and add
// funds not listed here. Not financial advice; illustrative categorisation. UKW/HICL are infrastructure
// EQUITY income (renewable + social infra, RPI-linked payouts) → shares; SEQI is infra DEBT → bonds;
// CGT (Capital Gearing) is defensive multi-asset — defaulted to diversifier but commonly re-tagged bonds.
export const FUND_CATALOGUE = Object.freeze([
  // ---- Shares: world growth / tracker ----
  { ticker: 'VWRL', name: 'Vanguard FTSE All-World (Dist)',        subClass: 'worldGrowth' },
  { ticker: 'VWRP', name: 'Vanguard FTSE All-World (Acc)',         subClass: 'worldGrowth' },
  { ticker: 'VEVE', name: 'Vanguard FTSE Developed World',         subClass: 'worldGrowth' },
  { ticker: 'SWDA', name: 'iShares Core MSCI World',               subClass: 'worldGrowth' },
  { ticker: 'HMWO', name: 'HSBC MSCI World',                       subClass: 'worldGrowth' },
  { ticker: 'VUSA', name: 'Vanguard S&P 500',                      subClass: 'worldGrowth' },
  { ticker: 'PACW', name: 'Amundi Prime All Country World',        subClass: 'worldGrowth' },
  // ---- Shares: UK equity income ----
  { ticker: 'CTY',  name: 'City of London Investment Trust',       subClass: 'ukEquityIncome' },
  { ticker: 'LWDB', name: 'Law Debenture Corporation',             subClass: 'ukEquityIncome' },
  { ticker: 'FGT',  name: 'Finsbury Growth & Income Trust',        subClass: 'ukEquityIncome' },
  { ticker: 'MRCH', name: 'Merchants Trust',                       subClass: 'ukEquityIncome' },
  { ticker: 'ISF',  name: 'iShares Core FTSE 100',                 subClass: 'ukEquityIncome' },
  { ticker: 'VUKE', name: 'Vanguard FTSE 100',                     subClass: 'ukEquityIncome' },
  { ticker: 'UKW',  name: 'Greencoat UK Wind',                     subClass: 'ukEquityIncome' },
  { ticker: 'HICL', name: 'HICL Infrastructure',                   subClass: 'ukEquityIncome' },
  { ticker: 'TRIG', name: 'The Renewables Infrastructure Group',   subClass: 'ukEquityIncome' },
  // ---- Shares: global equity income ----
  { ticker: 'MYI',  name: 'Murray International Trust',            subClass: 'globalEquityIncome' },
  { ticker: 'VHYL', name: 'Vanguard FTSE All-World High Div Yld',  subClass: 'globalEquityIncome' },
  { ticker: 'JGGI', name: 'JPMorgan Global Growth & Income',       subClass: 'globalEquityIncome' },
  // ---- Bonds ----
  { ticker: 'IGLS', name: 'iShares UK Gilts 0-5yr',               subClass: 'shortGilts' },
  { ticker: 'IGLT', name: 'iShares Core UK Gilts',               subClass: 'longGilts' },
  { ticker: 'VGOV', name: 'Vanguard UK Gilt',                    subClass: 'longGilts' },
  { ticker: 'INXG', name: 'iShares £ Index-Linked Gilts',        subClass: 'indexLinked' },
  { ticker: 'TI5G', name: 'iShares $ TIPS 0-5 (GBP Hedged)',     subClass: 'indexLinked' },
  { ticker: 'SLXX', name: 'iShares Core £ Corp Bond',            subClass: 'corporateIG' },
  { ticker: 'VAGP', name: 'Vanguard Global Aggregate Bond (GBP Hedged)', subClass: 'globalAggHedged' },
  { ticker: 'IBTM', name: 'iShares $ Treasury Bond 7-10yr',      subClass: 'usTreasHedged' },
  { ticker: 'SEQI', name: 'Sequoia Economic Infrastructure',     subClass: 'infraDebt' },
  // ---- Cash / money market ----
  { ticker: 'CSH2', name: 'Amundi Smart Overnight Return',       subClass: 'moneyMarket' },
  { ticker: 'ERNS', name: 'iShares £ Ultrashort Bond',          subClass: 'moneyMarket' },
  // ---- Diversifiers ----
  { ticker: 'SGLN', name: 'iShares Physical Gold',              subClass: 'gold' },
  { ticker: 'PHGP', name: 'WisdomTree Physical Gold (GBP)',     subClass: 'gold' },
  { ticker: 'BHMG', name: 'BH Macro',                          subClass: 'trendMacro' },
  { ticker: 'CGT',  name: 'Capital Gearing Trust',             subClass: 'trendMacro' },
  { ticker: 'PNL',  name: 'Personal Assets Trust',            subClass: 'trendMacro' },
  { ticker: 'RICA', name: 'Ruffer Investment Company',        subClass: 'trendMacro' }
]);

// Ticker -> default sub-class (derived from the catalogue). tagPortfolio honours a per-holding
// `subClass` override ahead of this, so users can re-categorise any fund.
export const FUND_TAG_MAP = Object.freeze(
  Object.fromEntries(FUND_CATALOGUE.map(f => [f.ticker, f.subClass]))
);

/** Catalogue entry for a ticker (case-insensitive), or null. */
export function catalogueEntry(ticker) {
  const t = (ticker || '').toUpperCase().trim();
  return FUND_CATALOGUE.find(f => f.ticker === t) || null;
}

/** Sub-class options grouped by bucket, for the tagging category dropdown. */
export function subClassOptionsByBucket() {
  const groups = {};
  for (const [key, p] of Object.entries(SUB_ASSET_PROFILES)) {
    (groups[p.bucket] = groups[p.bucket] || []).push({ key, label: p.label });
  }
  return groups;
}

// -----------------------------------------------------------------------------
// Directional 4-bucket preset grid (shares / bonds / diversifiers / cash), from the
// research. Keeps the Cautious/Balanced/Adventurous NAMES; makes each a 4-way split.
// Weights are illustrative seeds; not wired into GlidepathService.RISK_PRESETS yet.
// -----------------------------------------------------------------------------
export const RISK_PRESETS_4WAY = Object.freeze({
  cautious:    { shares: 0.30, bonds: 0.45, diversifiers: 0.12, cash: 0.13 },
  balanced:    { shares: 0.50, bonds: 0.30, diversifiers: 0.15, cash: 0.05 },
  adventurous: { shares: 0.65, bonds: 0.15, diversifiers: 0.15, cash: 0.05 }
});

// -----------------------------------------------------------------------------
// FCA-regulated conservative option (offered alongside the market CMAs above).
// COBS-13 Annex 2 caps are by PRODUCT, not asset class. FCA/PwC 2017 per-asset reals.
// See docs/asset-class-research.md §2.
// -----------------------------------------------------------------------------
export const FCA_PROJECTION_CAPS = Object.freeze({
  pension: { lower: 0.02, intermediate: 0.05, higher: 0.08 },  // personal/stakeholder pension
  other:   { lower: 0.015, intermediate: 0.045, higher: 0.075 }
});
export const FCA_PER_ASSET_REAL = Object.freeze({
  cash: -0.01,        // midpoint; VALIDATES the engine's cash = max(0, prevInf - 1%)
  gilts: -0.005,      // midpoint of -1% to 0%
  corporateIG: 0.003  // +0.6-1% over gilts -> real 0.1-0.5%, midpoint
});

// -----------------------------------------------------------------------------
// Pure helpers (safe to unit-test; not called by the engine yet).
// -----------------------------------------------------------------------------

/** Sub-class keys belonging to a bucket. */
export function subClassesInBucket(bucket) {
  return Object.entries(SUB_ASSET_PROFILES)
    .filter(([, p]) => p.bucket === bucket)
    .map(([key]) => key);
}

/** Resolve a real-world fund ticker to its modelled sub-class profile (or null). */
export function profileForFund(ticker) {
  const key = FUND_TAG_MAP[ticker];
  return key ? SUB_ASSET_PROFILES[key] : null;
}
