/**
 * "Assumptions and data" (research/v7/road-to-7.md step 11b, the ledger's strat.assumptions): the figures the planner's
 * Strategies → Assumptions & data page works out (index.html assumptionsPageHtml), as plain data read from the same tables
 * the engines use — the shares' return series and what it averages, the price series, how the futures are made, the cuts,
 * the charges, the gilt data's provenance and today's curve, the ladder's dealing costs, the tax bands, the share index's
 * snapshot. The preview's effect (src/v7/effects/assumptions.js) loads this file with import() when the page is opened, since it
 * reaches the gilt data; the answers never do. The words are the preview's own (src/v7/copy/assumptions.js). Nothing here is
 * advice: it describes a model.
 *
 *   assumptionsFacts(nowMs) → { app, engine, shares, prices, futures, cuts, charges, gilts, curve, ladder, tax, index }
 */
import { EQUITY_RETURNS, INFLATION, SIMULATION_DEFAULTS, DRAWDOWN_DEFAULTS, TAX_DEFAULTS, VERSION } from '../constants.js';
import { ENGINE_VERSION } from '../strategies/version.js';
import { MC_BLOCK_YEARS } from './SimulationEngine.js';
import { DECISION_ASSUMED_CPI } from './InflationModel.js';
import { DEFAULT_CHARGES_PCT } from './Charges.js';
import { LADDER_DEFAULTS } from '../strategies/GiltLadderPlan.js';
import { dataProvenance, realYieldForYear, nominalYieldForYear } from './LinkerUniverse.js';
import { equityProvenance } from './EquityIndex.js';

/** The world adjustment the planner applies to every year of the US series (its own page: −1.5 percentage points a year). */
export const WORLD_ADJUSTMENT_POINTS = 1.5;
/** The maturities the planner's page quotes today's curve at. */
export const CURVE_YEARS = Object.freeze([1, 2, 3, 5, 10, 15, 20, 25, 30]);

const geo = (vals) => Math.pow(vals.reduce((a, v) => a * (1 + v), 1), 1 / vals.length) - 1;

export function assumptionsFacts(nowMs = Date.now()) {
  const yrs = Object.keys(EQUITY_RETURNS).map(Number).sort((a, b) => a - b);
  const nominal = geo(yrs.map((y) => EQUITY_RETURNS[y]));
  const real = geo(yrs.map((y) => (1 + EQUITY_RETURNS[y]) / (1 + (INFLATION[y] ?? 0.025)) - 1));
  const prices = geo(yrs.map((y) => INFLATION[y] ?? 0.025));
  const worst = yrs.reduce((m, y) => (EQUITY_RETURNS[y] < EQUITY_RETURNS[m] ? y : m), yrs[0]);
  const best = yrs.reduce((m, y) => (EQUITY_RETURNS[y] > EQUITY_RETURNS[m] ? y : m), yrs[0]);
  let gilts = null;
  try {
    const p = dataProvenance(nowMs);
    gilts = { generated: String(p.generated_at || '').slice(0, 10) || null, asOf: p.as_of || null, source: typeof p.source === 'string' ? p.source : '', stale: !!p.stale, hasCurve: !!p.hasCurve, curveAsOf: p.curve_as_of || null, curvePoints: +p.curvePoints || 0 };
  } catch { gilts = null; }
  const curve = CURVE_YEARS.map((k) => {
    let r = null, n = null;
    try { r = realYieldForYear(k); } catch { r = null; }
    try { n = nominalYieldForYear(k); } catch { n = null; }
    return { years: k, real: Number.isFinite(r) ? r : null, nominal: Number.isFinite(n) ? n : null };
  });
  let index = null;
  try { const e = equityProvenance(); index = e ? { symbol: e.symbol || '', date: e.date || null, level: Number.isFinite(+e.level) ? +e.level : null, source: typeof e.source === 'string' ? e.source : '', stale: !!e.stale } : null; } catch { index = null; }
  return {
    app: VERSION, engine: ENGINE_VERSION,
    shares: { from: yrs[0], to: yrs[yrs.length - 1], years: yrs.length, nominal, real, worstYear: worst, worst: EQUITY_RETURNS[worst], bestYear: best, best: EQUITY_RETURNS[best], adjustment: WORLD_ADJUSTMENT_POINTS },
    prices: { mean: prices, monthByMonth: DECISION_ASSUMED_CPI },
    futures: { runs: SIMULATION_DEFAULTS.MONTE_CARLO_RUNS, blockYears: MC_BLOCK_YEARS || 5 },
    cuts: { mult: SIMULATION_DEFAULTS.PROTECTION_MULTIPLIER, months: DRAWDOWN_DEFAULTS.CONSECUTIVE_LIMIT, buffer: DRAWDOWN_DEFAULTS.RECOVERY_BUFFER },
    charges: DEFAULT_CHARGES_PCT,
    gilts, curve,
    ladder: { dealFee: LADDER_DEFAULTS.dealFee, spreadShort: LADDER_DEFAULTS.spreadShort, spreadMid: LADDER_DEFAULTS.spreadMid, spreadLong: LADDER_DEFAULTS.spreadLong },
    tax: { pa: TAX_DEFAULTS.PERSONAL_ALLOWANCE, brl: TAX_DEFAULTS.BASIC_RATE_LIMIT, hrl: TAX_DEFAULTS.HIGHER_RATE_LIMIT, taper: TAX_DEFAULTS.PA_TAPER_THRESHOLD },
    index
  };
}
