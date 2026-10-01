/**
 * The lives an answer about the saving years is tested against (step 4 brief 1, 4.4; saving-years-engine.md 1.1).
 *
 * One future is one life: future `i` of seed `s` is the market path from today to the end age,
 * bootstrapPaths(marketSeed(i, s), T × 12) put on the engine's yearly grid — question C's future, only longer. The
 * block bootstrap draws its blocks in order from one generator, so a shorter future is the first years of a longer
 * one: question C's future `i` is the first D years of life `i`, and every stop age is a cut of the same lives.
 *
 * Each life carries ONE bond stream: the engine's bond model (calculateBondReturn, fastEngine.js's copy of today's
 * engine) drawn once, month by month, from seededRng(engineSeed(i, s)) over all T × 12 months, on each year's
 * inflation and share return and the year before's inflation — in the order the engine draws it. The saving years
 * read months 0 … 12S − 1; the drawing years read on from 12S. At S = 0 it is the engine's own stream, to the bit.
 *
 *   lifeReturns(i, T, env)    { equity, inflation } for years 0 … T − 1 (env.futureReturns replaces the history, tests)
 *   livesList(count, T, env)  [{ id, years: T, returns, seed, stream }]
 *   bondStream(life)          the life's stream, drawn again (Float64Array of T × 12 monthly factors)
 *   sliceReturns(life, S, D)  years S … S + D − 1 re-keyed from 0 — what annualNominal(path, 12S, D) gives, bit for bit
 *
 * The list depends only on the seed, the count and T — never on any amount. Pure; no clock; no Math.random.
 */
import { seededRng } from '../../utils/MathUtils.js';
import { futureReturns, engineSeed } from './futures.js';
import { calculateBondReturn, monthly } from './fastEngine.js';

/** Yearly returns of life `i` for T years (question C's futureReturns, for the whole life). */
export function lifeReturns(i, T, env = {}) {
  return futureReturns(i, T, env);
}

/** The monthly bond factors of a life's whole length, drawn as the engine draws them (fastEngine.js prepareFuture). */
function drawStream(returns, years, seed) {
  const out = new Float64Array(years * 12);
  const rng = seededRng(seed);
  for (let y = 0; y < years; y++) {
    const inf = returns.inflation[y] || 0.025;
    const eq = returns.equity[y] || 0;
    const prevInf = y > 0 ? (returns.inflation[y - 1] || 0.025) : inf;
    for (let m = 0; m < 12; m++) out[12 * y + m] = monthly(calculateBondReturn(inf, eq, prevInf, rng));
  }
  return out;
}

/** The life's bond stream (the same numbers livesList put on it). */
export function bondStream(life) {
  return drawStream(life.returns, life.years, life.seed);
}

/**
 * Every life of an answer, built once.
 * @param {number} count   env.futures
 * @param {number} T       years from today to the end age: the most any stop age needs (max over the rows of S + D)
 * @param {{ seed?: number, futureReturns?: Function }} env
 */
export function livesList(count, T, env = {}) {
  const seed = env.seed || 0;
  const out = new Array(count);
  for (let i = 0; i < count; i++) {
    const returns = lifeReturns(i, T, env);
    const s = engineSeed(i, seed);
    out[i] = { id: i, years: T, returns, seed: s, stream: drawStream(returns, T, s) };
  }
  return out;
}

/** Years S … S + D − 1 of a life, re-keyed from 0: the drawing years after a stop S years from now. */
export function sliceReturns(life, S, D) {
  const equity = {};
  const inflation = {};
  for (let y = 0; y < D; y++) {
    equity[y] = life.returns.equity[S + y];
    inflation[y] = life.returns.inflation[S + y];
  }
  return { equity, inflation };
}
