/**
 * Model example portfolios — ILLUSTRATION, NOT ADVICE.
 *
 * For each risk preset (and its diversifiers-sleeve variant) this expands the bucket weights the
 * simulations actually use into ONE example fund per modelled sub-class, so a user can see what
 * "Balanced" might look like as real tickers. The bond split mirrors DEFAULT_BOND_WEIGHTS
 * (30% short gilts / 20% longer gilts / 20% index-linked / 30% IG corporate) and the
 * diversifiers sleeve mirrors DEFAULT_DIVERSIFIER_WEIGHTS (50% gold / 50% trend-macro).
 * Every ticker is in the app's fund catalogue with the same sub-class tag, so tagging exactly
 * these funds in "Use my own funds" reproduces the preset.
 */

import { DEFAULT_BOND_WEIGHTS, DEFAULT_DIVERSIFIER_WEIGHTS } from './SubAssetReturns.js';

// Bucket weights per preset — MUST match the two tables in index.html (plain + diversifiers).
const PRESETS = {
  plain: {
    cautious:    { equity: 0.30, bond: 0.45, cash: 0.25, diversifiers: 0 },
    balanced:    { equity: 0.50, bond: 0.40, cash: 0.10, diversifiers: 0 },
    adventurous: { equity: 0.70, bond: 0.25, cash: 0.05, diversifiers: 0 }
  },
  sleeve: {
    cautious:    { equity: 0.30, bond: 0.45, cash: 0.13, diversifiers: 0.12 },
    balanced:    { equity: 0.50, bond: 0.30, cash: 0.05, diversifiers: 0.15 },
    adventurous: { equity: 0.65, bond: 0.15, cash: 0.05, diversifiers: 0.15 }
  }
};

// One example instrument per modelled job. All present in the fund catalogue.
const EXAMPLES = {
  equity:      { ticker: 'VWRP', name: 'Vanguard FTSE All-World (acc)', job: 'World shares — the whole growth engine in one fund' },
  shortGilts:  { ticker: 'IGLS', name: 'iShares UK Gilts 0–5yr', job: 'Short gilts — stability, low rate risk' },
  longGilts:   { ticker: 'IGLT', name: 'iShares Core UK Gilts', job: 'Longer gilts — crash ballast, more rate risk' },
  indexLinked: { ticker: 'INXG', name: 'iShares £ Index-Linked Gilts', job: 'Inflation-linked gilts — inflation protection' },
  corporateIG: { ticker: 'SLXX', name: 'iShares £ Corporate Bond', job: 'Investment-grade credit — extra yield over gilts' },
  cash:        { ticker: 'CSH2', name: 'Amundi Smart Overnight Return', job: 'Cash-like — money-market rate, near-zero swings' },
  gold:        { ticker: 'SGLN', name: 'iShares Physical Gold', job: 'Gold — crisis hedge, no income' },
  trendMacro:  { ticker: 'PNL / CGT', name: 'Personal Assets / Capital Gearing Trust', job: 'Wealth-preserver trusts — defensive multi-asset' }
};

/**
 * @param {'cautious'|'balanced'|'adventurous'} risk
 * @param {{diversifiers?: boolean}} opts
 * @returns {{rows: Array<{ticker,name,job,pct}>, note: string}}
 */
export function modelPortfolio(risk, { diversifiers = false } = {}) {
  const w = (diversifiers ? PRESETS.sleeve : PRESETS.plain)[risk] || PRESETS.plain.balanced;
  const rows = [];
  const pct = (x) => Math.round(x * 100);
  rows.push({ ...EXAMPLES.equity, pct: pct(w.equity) });
  for (const [k, share] of Object.entries(DEFAULT_BOND_WEIGHTS)) {
    rows.push({ ...EXAMPLES[k], pct: pct(w.bond * share) });
  }
  rows.push({ ...EXAMPLES.cash, pct: pct(w.cash) });
  if (diversifiers && w.diversifiers > 0) {
    rows.push({ ...EXAMPLES.gold, pct: pct(w.diversifiers * DEFAULT_DIVERSIFIER_WEIGHTS.gold) });
    rows.push({ ...EXAMPLES.trendMacro, pct: pct(w.diversifiers * DEFAULT_DIVERSIFIER_WEIGHTS.trendMacro) });
  }
  // Rounding drift: pin the total to 100 by adjusting the largest row.
  const total = rows.reduce((t, r) => t + r.pct, 0);
  if (total !== 100 && rows.length) {
    rows.reduce((a, b) => (a.pct >= b.pct ? a : b)).pct += 100 - total;
  }
  return {
    rows,
    note: 'An example of the KIND of funds matching this mix — not a recommendation. Any similar fund doing the same job works; compare ongoing charges, and prefer £-hedged bond share classes. Tagging exactly these funds in "Use my own funds" reproduces this preset.'
  };
}
