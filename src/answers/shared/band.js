/**
 * The band: the most a household could take in each future, and the three amounts read off the spread
 * (build brief 4.3 points 4–6; answer-C-and-household.md 2.3 steps 5–7).
 *
 * Amounts are searched in whole £10 a month (£120 a year), and every future is the same for every amount.
 *
 *   bandIndexes(n)           the positions in the sorted spread: careful floor(n/10), middling floor(n/2), good n − ceil(n/10)
 *   bandFrom(sortedMost)     the three amounts from the sorted most-per-future list
 *   badCaseAge(ages)         the age in a bad case: sort upwards, take position floor(n/10)
 *   mostPerFuture(...)       the most one future could take, searched to £10 a month
 *   createBandSolver(...)    the search over all futures at once, sharing what each run taught it
 *
 * The solver finds the same three amounts as sorting every future's most (bandFrom), without finding every
 * future's most: the careful amount is the largest amount that fails in at most floor(n/10) futures, and
 * "future i lasts at k" is learnt once per bracket. Each future keeps a bracket [lo, hi): known to last at lo,
 * known to fail at hi. A run is only made when the amount asked about falls inside the bracket.
 */
import { simulate } from '../../services/SimulationEngine.js';
import { configsAt } from './toEngine.js';

/** £ a month per step of the search. */
export const STEP = 10;

/** The positions in a sorted spread of n figures. */
export function bandIndexes(n) {
  return { careful: Math.floor(n / 10), middling: Math.floor(n / 2), good: n - Math.ceil(n / 10) };
}

/** Whole £10 a month, rounded down. */
export const downToTen = (m) => Math.floor(m / STEP + 1e-9) * STEP;

/** The three amounts from the sorted (upwards) list of what each future could take, £ a month. Each rounded down to £10. */
export function bandFrom(sortedMost) {
  const n = sortedMost.length;
  const at = bandIndexes(n);
  return { careful: downToTen(sortedMost[at.careful]), middling: downToTen(sortedMost[at.middling]), good: downToTen(sortedMost[at.good]) };
}

/** The age in a bad case (the worst 1 in 10): sort the run-out ages upwards and take position floor(n/10). */
export function badCaseAge(ages) {
  const s = [...ages].sort((a, b) => a - b);
  return s[Math.floor(s.length / 10)];
}

/**
 * Runs every person's engine for one future at one set of configs.
 * @param {object[]} configs   from configsAt
 * @param {{ returns: object, seed: number }} future
 * @param {boolean} needMonth  run every person (for the earliest month anyone ran out); else stop at the first failure
 * @returns {{ failed: boolean, failMonth: number|null }}
 */
export function runFuture(configs, future, needMonth = false) {
  let failed = false;
  let failMonth = null;
  for (const c of configs) {
    const r = simulate(c.config, future.returns, future.seed);
    if (r.failed) {
      failed = true;
      if (failMonth === null || r.failMonth < failMonth) failMonth = r.failMonth;
      if (!needMonth) break;
    }
  }
  return { failed, failMonth };
}

/**
 * The search over every future at once. `k` is an amount in steps of £10 a month; the household take-home a year
 * is k × 120, never below the guaranteed take-home at the start (an amount under that is the same plan).
 *
 * @param {object} plan                 enginePlan(...)
 * @param {object[]} futures            futuresList(...)
 * @param {{ onProgress?: (done: number, total: number) => void }} [opts]
 */
export function createBandSolver(plan, futures, opts = {}) {
  const n = futures.length;
  const kLow = Math.floor(plan.guaranteedAtStartAYear / 12 / STEP + 1e-9);        // lasts in every future: the pots pay nothing
  const kMax = kLow + Math.ceil(plan.totalPots / STEP) + 12;                     // fails in every future of two months or more
  const lo = new Int32Array(n).fill(kLow);                                       // known to last
  const hi = new Float64Array(n).fill(Infinity);                                 // known to fail
  const configCache = new Map();                                                 // k → configs
  const failMonths = new Map();                                                  // `${k}:${i}` → month a run at k failed
  let evaluations = 0;
  const progressTotal = Math.max(1, n * 6);
  let finished = false;                                                          // once "done" is told, nothing goes back
  const tell = () => { if (opts.onProgress && !finished && evaluations % 25 === 0) opts.onProgress(Math.min(evaluations, progressTotal - 1), progressTotal); };

  const configsFor = (k) => {
    let c = configCache.get(k);
    if (!c) { c = configsAt(plan, k * STEP * 12); configCache.set(k, c); }
    return c;
  };

  /** Runs future i at k when its bracket does not already say; returns true when it lasts. */
  const lastsAt = (i, k, needMonth = false) => {
    if (k <= lo[i]) return true;
    if (k >= hi[i] && !needMonth) return false;
    if (needMonth && failMonths.has(`${k}:${i}`)) return false;
    evaluations++; tell();
    const r = runFuture(configsFor(k), futures[i], needMonth);
    if (r.failed) { hi[i] = Math.min(hi[i], k); if (needMonth) failMonths.set(`${k}:${i}`, r.failMonth); }
    else lo[i] = Math.max(lo[i], k);
    return !r.failed;
  };

  /** How many futures fail at k. */
  const failsAt = (k) => {
    let fails = 0;
    for (let i = 0; i < n; i++) if (!lastsAt(i, k)) fails++;
    return fails;
  };

  /**
   * The largest k, with fails(k) ≤ j, in [good, bad): good is known to satisfy it; bad (or Infinity) is known not to.
   * Starts from `guess` and widens before it narrows.
   */
  const quantile = (j, good, bad, guess) => {
    let g = good;
    let b = bad;
    if (!Number.isFinite(b)) {
      let k = Math.max(good + 1, Math.min(guess, kMax));
      let step = Math.max(1, Math.round((k - good) / 2));
      for (;;) {
        if (failsAt(k) <= j) { g = k; if (k >= kMax) { b = kMax + 1; break; } k = Math.min(kMax, k + step); step *= 2; }
        else { b = k; break; }
      }
    }
    while (b - g > 1) {
      const mid = Math.floor((g + b) / 2);
      if (failsAt(mid) <= j) g = mid; else b = mid;
    }
    return g;
  };

  /** Run-out month of every future at k (null = lasted), running only what the brackets do not settle. */
  const runOutMonthsAt = (k) => futures.map((f, i) => {
    if (lastsAt(i, k, true)) return null;
    return failMonths.get(`${k}:${i}`) ?? null;
  });

  return {
    kLow, kMax, n,
    /** The three amounts, in steps: careful, middling, good; and each one's count of failing futures. */
    solve() {
      const at = bandIndexes(n);
      const guess = kLow + Math.max(1, Math.round((plan.totalPots * 0.04) / 12 / STEP));
      const middling = quantile(at.middling, kLow, Infinity, guess);
      const careful = at.careful === at.middling ? middling : quantile(at.careful, kLow, middling + 1, Math.max(kLow + 1, Math.round(middling * 0.85)));
      const good = at.good === at.middling ? middling : quantile(at.good, middling, Infinity, Math.round(middling * 1.15) + 1);
      const fails = { careful: failsAt(careful), middling: failsAt(middling), good: failsAt(good) };
      finished = true;
      if (opts.onProgress) opts.onProgress(progressTotal, progressTotal);
      return { k: { careful, middling, good }, fails };
    },
    failsAt,
    runOutMonthsAt,
    /** Run-out month of every future at any £ a month (null = lasted). */
    runOutMonthsAtMonthly(monthly) {
      const H = monthly * 12;
      const kEquivalent = H / 12 / STEP;
      const configs = configsAt(plan, H);
      return futures.map((f, i) => {
        if (kEquivalent <= lo[i]) return null;
        evaluations++; tell();
        const r = runFuture(configs, f, true);
        return r.failed ? r.failMonth : null;
      });
    },
    /** The most one future could take, in steps, searched inside what is already known of it. */
    most(i) {
      let g = lo[i];
      let b = Number.isFinite(hi[i]) ? hi[i] : kMax + 1;
      if (!Number.isFinite(hi[i]) && lastsAt(i, kMax)) return kMax;
      while (b - g > 1) {
        const mid = Math.floor((g + b) / 2);
        if (lastsAt(i, mid)) g = mid; else b = mid;
      }
      return g;
    },
    get evaluations() { return evaluations; },
    configsFor
  };
}

/**
 * The most one future could take, £ a month, searched to £10 (the brief's per-future definition, on its own).
 * @param {object} plan
 * @param {object} future        { returns, seed }
 * @param {{ kLow?: number, kMax?: number }} [range]
 */
export function mostPerFuture(plan, future, range = {}) {
  const kLow = range.kLow ?? Math.floor(plan.guaranteedAtStartAYear / 12 / STEP + 1e-9);
  const kMax = range.kMax ?? kLow + Math.ceil(plan.totalPots / STEP) + 12;
  const lasts = (k) => !runFuture(configsAt(plan, k * STEP * 12), future).failed;
  if (lasts(kMax)) return kMax * STEP;
  let g = kLow;
  let b = kMax;
  while (b - g > 1) {
    const mid = Math.floor((g + b) / 2);
    if (lasts(mid)) g = mid; else b = mid;
  }
  return g * STEP;
}
