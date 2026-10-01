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
 *
 * THE SEARCH (the fast path, from v6.18). "Future i lasts at k" is monotone in k (a household that lasts on
 * £1,400 lasts on £1,390), so each of the three amounts is fixed by the brackets alone: k is the amount when
 * at most j futures can fail at k (every future with lo < k counted) and more than j must fail at k + 1
 * (every future with hi ≤ k + 1). Whatever order the runs are made in, the brackets settle on the same three
 * amounts — bandReference.js is the earlier search, kept as the reference the identity test checks against.
 * The order chosen here keeps the runs few:
 *   1. an estimate of the three amounts — from the previous pass on the same household (the first figure's
 *      100 futures are the first 100 of the final 1,000), else from a search over the first few futures;
 *   2. every future is run at a point just below the middling estimate, and those that last at a point just
 *      above it: a future outside that gap is settled for the middling amount by one or two runs, and only the
 *      futures inside the gap are bisected;
 *   3. the careful amount is then found among the futures that fail at the middling amount (the rest last at it),
 *      the good amount among those that last there — each the same way;
 *   4. the months the failing futures run out at each amount are read from the runs already made, and made
 *      only where a run is missing.
 * The engine runs themselves go through fastEngine.js (today's engine, with everything an amount does not
 * change worked out once per future).
 */
import { simulate } from '../../services/SimulationEngine.js';
import { configsAt } from './toEngine.js';
import { createFastRunner } from './fastEngine.js';

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
 * Runs every person's engine for one future at one set of configs — today's engine as it is, or `run(r, config)`
 * when given (the solver passes its own runner).
 * @param {object[]} configs   from configsAt
 * @param {{ returns: object, seed: number }} future
 * @param {boolean} needMonth  run every person (for the earliest month anyone ran out); else stop at the first failure
 * @returns {{ failed: boolean, failMonth: number|null }}
 */
export function runFuture(configs, future, needMonth = false, run = null) {
  let failed = false;
  let failMonth = null;
  for (let r = 0; r < configs.length; r++) {
    const res = run ? run(r, configs[r].config) : simulate(configs[r].config, future.returns, future.seed);
    if (res.failed) {
      failed = true;
      if (failMonth === null || res.failMonth < failMonth) failMonth = res.failMonth;
      if (!needMonth) break;
    }
  }
  return { failed, failMonth };
}

/**
 * How wide the gap around an estimate is opened, as a share of the estimate (the spread of the futures' mosts
 * grows with the pot) and never under a few steps, by how the estimate was made.
 */
const GAP = { previousPass: { share: 0.02, least: 3 }, sample: { share: 0.03, least: 5 } };
const gapFor = (g, k) => Math.max(g.least, Math.round(Math.abs(k) * g.share));

/**
 * The search over every future at once. `k` is an amount in steps of £10 a month; the household take-home a year
 * is k × 120, never below the guaranteed take-home at the start (an amount under that is the same plan).
 *
 * @param {object} plan                 enginePlan(...)
 * @param {object[]} futures            futuresList(...)
 * @param {{ onProgress?: (done: number, total: number) => void, estimate?: { careful: number, middling: number, good: number } | null,
 *           runner?: { run: (r: number, i: number, config: object) => { failed: boolean, failMonth: number|null } },
 *           configsFor?: (k: number, i: number) => object[] }} [opts]
 *   `estimate`: the three amounts in steps from an earlier pass on the same household (a hint: it changes nothing
 *   but the order of the runs). `runner`: the engine runner (default: the fast path). `configsFor` (questions A and B,
 *   step 4 brief 4.6): the configsAt entries at step k for future i — a couple's shares differ by future when the
 *   pots do; the caller keeps its own cache. k may be a fraction of a step (runOutMonthsAtMonthly). Default:
 *   configsAt(plan, k × STEP × 12), the same for every future.
 */
export function createBandSolver(plan, futures, opts = {}) {
  const n = futures.length;
  const kLow = Math.floor(plan.guaranteedAtStartAYear / 12 / STEP + 1e-9);        // lasts in every future: the pots pay nothing
  const kMax = kLow + Math.ceil(plan.totalPots / STEP) + 12;                     // fails in every future of two months or more
  const lo = new Int32Array(n).fill(kLow);                                       // known to last
  const hi = new Float64Array(n).fill(Infinity);                                 // known to fail
  const runner = opts.runner || createFastRunner(plan, futures);
  const configCache = new Map();                                                 // k → configs
  const results = new Map();                                                     // k → [per future: [per run: { failed, failMonth }]]
  let evaluations = 0;                                                           // future-evaluations (one or more engine runs)
  let engineRuns = 0;
  const progressTotal = Math.max(1, Math.round(n * 3.4));                        // about what a search takes
  let finished = false;                                                          // once "done" is told, nothing goes back
  const tell = () => { if (opts.onProgress && !finished && evaluations % 25 === 0) opts.onProgress(Math.min(evaluations, progressTotal - 1), progressTotal); };

  const configsFor = opts.configsFor
    ? (k, i) => opts.configsFor(k, i)
    : (k) => {
      let c = configCache.get(k);
      if (!c) { c = configsAt(plan, k * STEP * 12); configCache.set(k, c); }
      return c;
    };
  const slotsAt = (k) => {
    let s = results.get(k);
    if (!s) { s = new Array(n); results.set(k, s); }
    return s;
  };

  /**
   * Runs future i at k: each person in turn, stopping at the first who runs out unless the month is wanted (then
   * every person, for the earliest month). A run already made at (k, i, person) is not made again. The bracket
   * is moved by what is found.
   * @returns {{ failed: boolean, failMonth: number|null }}
   */
  const evaluate = (i, k, needMonth) => {
    const configs = configsFor(k, i);
    const slots = slotsAt(k);
    let per = slots[i];
    if (!per) per = slots[i] = new Array(configs.length);
    let failed = false;
    let failMonth = null;
    let ran = false;
    for (let r = 0; r < configs.length; r++) {
      let res = per[r];
      if (!res) { res = per[r] = runner.run(r, i, configs[r].config); engineRuns++; ran = true; }
      if (res.failed) {
        failed = true;
        if (failMonth === null || res.failMonth < failMonth) failMonth = res.failMonth;
        if (!needMonth) break;
      }
    }
    if (ran) { evaluations++; tell(); }
    if (failed) { if (k < hi[i]) hi[i] = k; } else if (k > lo[i]) lo[i] = k;
    return { failed, failMonth };
  };

  /** Whether future i lasts at k, from the bracket when it says, else by running it. */
  const lastsAt = (i, k) => {
    if (k <= lo[i]) return true;
    if (k >= hi[i]) return false;
    return !evaluate(i, k, false).failed;
  };

  /** Certainly failing at k (hi ≤ k) and possibly failing at k (lo < k). */
  const bounds = (k) => {
    let sure = 0, maybe = 0;
    for (let i = 0; i < n; i++) { if (hi[i] <= k) sure++; if (lo[i] < k) maybe++; }
    return { sure, maybe };
  };

  /** Runs every future whose bracket does not settle k, at k. Afterwards fails(k) is exact. */
  const settle = (k) => {
    for (let i = 0; i < n; i++) if (lo[i] < k && k < hi[i]) evaluate(i, k, false);
  };

  /** How many futures fail at k, running whatever the brackets do not settle. */
  const failsAt = (k) => {
    settle(k);
    return bounds(k).sure;
  };

  /**
   * Whether fails(k) ≤ j — exactly, but running as few futures as the answer needs: stopping once more than j
   * are known to fail, or once too few are left unsettled to pass j. The unsettled futures are run in the
   * order of how likely they are to fail at k (where k sits in the bracket), likeliest first when the answer is
   * expected to be no, likeliest to last first when it is expected to be yes.
   */
  const atMost = (j, k, expectNo) => {
    let { sure, maybe } = bounds(k);
    if (sure > j) return false;
    if (maybe <= j) return true;
    const open = [];
    for (let i = 0; i < n; i++) if (lo[i] < k && k < hi[i]) open.push(i);
    const p = (i) => (k - lo[i]) / ((Number.isFinite(hi[i]) ? hi[i] : kMax + 1) - lo[i]);
    open.sort((a, b) => (expectNo ? p(b) - p(a) : p(a) - p(b)) || a - b);
    let unsettled = open.length;
    for (const i of open) {
      if (evaluate(i, k, false).failed) sure++;
      unsettled--;
      if (sure > j) return false;
      if (sure + unsettled <= j) return true;
    }
    return sure <= j;
  };

  /**
   * The largest k with fails(k) ≤ j among good..top: good is known to satisfy it, top + 1 is known not to.
   * `guess` says where to look first; `gap` how far either side of it the search opens. Every future is settled
   * at the answer when this returns.
   */
  const threshold = (j, good, top, guess, gap) => {
    let g = good;                                          // known yes
    let b = top + 1;                                       // known no
    const clamp = (k) => Math.max(g, Math.min(top, k));
    // 1. A point just under the guess that says yes, every unsettled future run there: the futures that fail
    //    there are settled (they fail at the answer too), and the rest are bounded below.
    let k = clamp(guess - gap);
    let down = 2 * gap;
    while (k > g) {
      if (failsAt(k) <= j) { g = k; break; }
      b = k; k = clamp(k - down); down *= 2;
    }
    // 2. A point just over the guess that says no, every unsettled future run there: the futures that last there
    //    are settled, and the rest are bounded above. Only the futures inside the gap are left.
    let step = 2 * gap;
    k = Math.min(b - 1, Math.max(g + gap, guess + gap));
    while (k > g && k < b) {
      if (failsAt(k) <= j) { g = k; k = Math.min(b - 1, k + step); step *= 2; }
      else { b = k; break; }
    }
    // 3. Bisect the gap.
    while (b - g > 1) {
      const mid = Math.floor((g + b) / 2);
      if (atMost(j, mid, mid > guess)) g = mid; else b = mid;
    }
    settle(g);
    return g;
  };

  /**
   * An estimate of the three amounts when no earlier pass gave one: the same search over the first few futures
   * alone (their brackets stay for the search proper). The sample's three amounts are its own careful, middling
   * and good, read off with bandIndexes on the sample size.
   */
  const sampleEstimate = () => {
    const s = Math.min(n, Math.max(20, Math.round(Math.sqrt(n) * 2)));
    if (s >= n) return null;
    const atS = bandIndexes(s);
    const fails = (k, j) => { let f = 0; for (let i = 0; i < s; i++) if (!lastsAt(i, k)) { f++; if (f > j) return f; } return f; };
    const quantile = (j, good, bad, guess) => {
      let g = good, b = bad;
      if (!Number.isFinite(b)) {
        let k = Math.max(good + 1, Math.min(guess, kMax));
        let step = Math.max(1, Math.round((k - good) / 2));
        for (;;) {
          if (fails(k, j) <= j) { g = k; if (k >= kMax) { b = kMax + 1; break; } k = Math.min(kMax, k + step); step *= 2; }
          else { b = k; break; }
        }
      }
      while (b - g > 1) { const mid = Math.floor((g + b) / 2); if (fails(mid, j) <= j) g = mid; else b = mid; }
      return g;
    };
    const guess = kLow + Math.max(1, Math.round((plan.totalPots * 0.04) / 12 / STEP));
    const middling = quantile(atS.middling, kLow, Infinity, guess);
    const careful = atS.careful === atS.middling ? middling : quantile(atS.careful, kLow, middling + 1, Math.max(kLow + 1, Math.round(middling * 0.85)));
    const good = atS.good === atS.middling ? middling : quantile(atS.good, middling, Infinity, Math.round(middling * 1.15) + 1);
    return { careful, middling, good };
  };

  /** Run-out month of every future at k (null = lasted), running only what is missing. */
  const runOutMonthsAt = (k) => futures.map((f, i) => {
    if (k <= lo[i]) return null;
    return evaluate(i, k, true).failMonth;
  });

  return {
    kLow, kMax, n,
    /** The three amounts, in steps: careful, middling, good; and each one's count of failing futures. */
    solve() {
      const at = bandIndexes(n);
      const e = opts.estimate && Number.isFinite(opts.estimate.middling) ? opts.estimate : null;
      const est = e || sampleEstimate();
      const gap = e ? GAP.previousPass : GAP.sample;
      let middling, careful, good;
      if (est) {
        const clampK = (k) => Math.max(kLow, Math.min(kMax, k));
        middling = threshold(at.middling, kLow, kMax, clampK(est.middling), gapFor(gap, est.middling - kLow));
        careful = at.careful === at.middling ? middling : threshold(at.careful, kLow, middling, clampK(Math.min(est.careful, middling)), gapFor(gap, est.careful - kLow));
        good = at.good === at.middling ? middling : threshold(at.good, middling, kMax, clampK(Math.max(est.good, middling)), gapFor(gap, est.good - kLow));
      } else {
        // a handful of futures: the plain search
        const guess = kLow + Math.max(1, Math.round((plan.totalPots * 0.04) / 12 / STEP));
        middling = threshold(at.middling, kLow, kMax, guess, Math.max(2, Math.round(guess / 4)));
        careful = at.careful === at.middling ? middling : threshold(at.careful, kLow, middling, Math.max(kLow + 1, Math.round(middling * 0.85)), Math.max(2, Math.round(middling / 10)));
        good = at.good === at.middling ? middling : threshold(at.good, middling, kMax, Math.round(middling * 1.15) + 1, Math.max(2, Math.round(middling / 10)));
      }
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
      const configs = opts.configsFor ? null : configsAt(plan, H);
      return futures.map((f, i) => {
        if (kEquivalent <= lo[i]) return null;
        evaluations++; tell();
        const r = runFuture(configs || opts.configsFor(kEquivalent, i), f, true, (r, config) => { engineRuns++; return runner.run(r, i, config); });
        return r.failed ? r.failMonth : null;
      });
    },
    /** The most one future could take, in steps, searched inside what is already known of it. */
    most(i) {
      let g = lo[i];
      let b = Number.isFinite(hi[i]) ? hi[i] : kMax + 1;
      if (!Number.isFinite(hi[i])) {
        // no amount known to fail: widen upwards from what lasts, doubling, until one does (or the top holds)
        let step = Math.max(4, Math.round((g - kLow) / 4));
        for (let k = Math.min(kMax, g + step); ; k = Math.min(kMax, k + step), step *= 2) {
          if (lastsAt(i, k)) { g = k; if (k >= kMax) return kMax; } else { b = k; break; }
        }
      }
      while (b - g > 1) {
        const mid = Math.floor((g + b) / 2);
        if (lastsAt(i, mid)) g = mid; else b = mid;
      }
      return g;
    },
    get evaluations() { return evaluations; },
    get engineRuns() { return engineRuns; },
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
