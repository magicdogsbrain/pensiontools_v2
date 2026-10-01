/**
 * The list of possible futures an answer is tested against (build brief 4.3 point 2).
 *
 * Future `i` of seed `s` is  bootstrapPaths((s × 100003 + i) × 7919 + 3, years × 12)  then  annualNominal(...).
 * With the published seed (0) that is the same market, future for future, that the strategy comparison uses
 * (stressTest.js: seed i × 7919 + 3), so this answer and "Answer in full detail" agree on every future.
 *
 * The list depends only on the seed, the number of futures and the number of years — never on any amount.
 * That is what makes "more in the pot never gives less" true, and two people comparing notes get the same markets.
 *
 * Bundled market history only: no live prices are read.
 */
import { bootstrapPaths, annualNominal, dataMeta, getEquityHaircut } from '../../strategies/ladderEngine.js';

/** The engine reads a rise in prices of exactly nought as "not given" and uses 2.5%. This is the smallest rise it takes as given. */
const FLAT_PRICES = 1e-12;

/** The seed of the market for future `i`. */
export function marketSeed(i, seed = 0) {
  return (seed * 100003 + i) * 7919 + 3;
}

/** The seed the engine's own bond model uses for future `i` (the strategy comparison uses `i`). */
export function engineSeed(i, seed = 0) {
  return seed * 100003 + i;
}

/** A made-up future, made fit for the engine: every year present, and flat prices kept flat. */
function madeUp(raw, years) {
  const equity = {};
  const inflation = {};
  for (let y = 0; y < years; y++) {
    const e = raw && raw.equity ? raw.equity[y] : 0;
    const inf = raw && raw.inflation ? raw.inflation[y] : 0;
    equity[y] = Number.isFinite(e) ? e : 0;
    inflation[y] = Number.isFinite(inf) && inf !== 0 ? inf : FLAT_PRICES;
  }
  return { equity, inflation };
}

/**
 * Yearly returns for future `i`: { equity: { [year]: return }, inflation: { [year]: rise in prices } }.
 * `env.futureReturns(i, years)`, when given (tests only), replaces the market history.
 */
export function futureReturns(i, years, env = {}) {
  if (typeof env.futureReturns === 'function') return madeUp(env.futureReturns(i, years), years);
  const path = bootstrapPaths(marketSeed(i, env.seed || 0), years * 12);
  return annualNominal(path.rtr, path.cpi, 0, years);
}

/**
 * Every future of a run, built once: [{ id, returns, seed }].
 * @param {number} count  env.futures
 */
export function futuresList(count, years, env = {}) {
  const out = new Array(count);
  for (let i = 0; i < count; i++) out[i] = { id: i, returns: futureReturns(i, years, env), seed: engineSeed(i, env.seed || 0) };
  return out;
}

/** The last month of the bundled market history, 'YYYY-MM'. */
export function historyEnd() {
  return dataMeta().end;
}

/** The first year of the bundled market history. */
export function historyStartYear() {
  return Number(String(dataMeta().start).slice(0, 4));
}

/**
 * The level of prices at the start of each year of a future, as the engine counts it: 1 in the first year,
 * then multiplied by that year's own rise as each later year begins. Length `years`.
 */
export function priceIndexByYear(returns, years) {
  const out = [1];
  for (let y = 1; y < years; y++) out.push(out[y - 1] * (1 + (returns.inflation[y] || 0.025)));
  return out;
}

/** The same, for an income that rises with prices up to a cap each year (a final-salary pension: 5%). */
export function cappedIndexByYear(returns, years, cap = 0.05) {
  const out = [1];
  for (let y = 1; y < years; y++) out.push(out[y - 1] * (1 + Math.min(returns.inflation[y] || 0.025, cap)));
  return out;
}

/**
 * What the futures are made of, said where every answer lists what it assumed (the reviewers' finding, 1 Oct 2026: the
 * first thing a reader asks): stretches of US share returns (the S&P, dividends in) and US price rises from the bundled
 * Shiller history, the share returns cut by this much a year to stand for shares around the world (ladderEngine.js
 * WORLD_EQUITY_HAIRCUT) — as a percentage to one place: '1.5'.
 */
export function shareCutPercent() {
  return (getEquityHaircut() * 100).toFixed(1);
}
