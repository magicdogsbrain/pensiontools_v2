/**
 * The join (step 4 brief 1, 4.5): the saving years handed to today's engine, life by life, at one stop age.
 *
 *   stopAtPlan(household, stopAge, env, lives?)   → sp: the lives, each person's kernels and pots at the stop, and the
 *                                                   drawing years' plan: enginePlan(…, { start: 'asGiven', pots: 'perFuture' })
 *   createStopRunner(sp, lives?, kernels?, opts?) → { plan, run(r, i, config), potsFor(r, i), potsOf(i), configsFor(k, i),
 *                                                     configsAtH(H, i), evaluations }
 *   verdictAt(sp, runner, spendAYear)             → { fails, lasted, verdict, runOutAge, runOutMonths }   one run per life
 *   bandAt(sp, runner, estimate?)                 → C's band at this stop age: { k, fails, monthly, yearly, lastedAt, runOutAgeAt, … }
 *   potNeeded(sp, runner, spendAYear, fails, opts?) → the least whole £1,000 household pension at the stop that lasts with
 *                                                   at most `fails` lives failing; null above SAVING.potMax
 *   verdictAtPot(sp, spendAYear, P, opts?)        → verdictAt with every life's pension at P (split by the middling pots)
 *   phasesAt(sp, spendAYear, pots?)               → Phase[] (C's phases, plus fromWork, work, pensionOpen, shown.fromWork)
 *   monthlyAt(sp, runner, potsFixed, opts?)       → the careful amount with every life's pension at a given household total
 *
 * The drawing years: the start is the stop and never moves; a pension still closed at the stop is closed inside its
 * holder's one run (the fast path's locked run) and the run's own ISA pays meanwhile — a run-out while it is closed is
 * a run-out. Each life's pots are its own (the kernels × what is paid in); the life's drivers are read on from the stop
 * (prepareFutureFrom: the price level from 1, the bond stream continued, the first year's cash from the true previous
 * year). At a stop of today's age this is question C's band on question C's futures, to the bit.
 *
 * Pure: no clock, no storage, no Math.random. The objects here hold typed arrays and functions; nothing of them reaches
 * a result.
 */
import { enginePlan, configsAt, breakdownAt } from './toEngine.js';
import { createFastRunner, prepareFutureFrom } from './fastEngine.js';
import { createBandSolver, STEP, runFuture } from './band.js';
import { livesList, sliceReturns } from './lives.js';
import { savingPlan, savingKernel, kernelPasses } from './saving.js';
import { RULES, SAVING, verdictOf } from './rules.js';

const round2 = (x) => Math.round(x * 100) / 100;

/** The bad case of a list of ages: sorted upwards, position floor(n/10) (C's). */
function badCaseOf(ages) {
  const s = [...ages].sort((a, b) => a - b);
  return s[Math.floor(s.length / 10)];
}

/** The engine plan of the drawing years for given per-person pots (the largest over the lives: the band's ceiling). */
function drawingPlan(household, S, env, maxes) {
  const h = {
    ...household,
    portfolio: env && env.mix ? { kind: 'mix', equity: env.mix.equity || 0, bond: env.mix.bond || 0, cash: env.mix.cash || 0 } : household.portfolio,
    people: household.people.map((p, j) => ({
      ...p,
      pots: { ...p.pots, pension: maxes[j].pension, isa: maxes[j].isa },
      stopWork: { kind: 'age', age: p.age + S }
    }))
  };
  return enginePlan(h, env, { start: 'asGiven', pots: 'perFuture' });
}

/**
 * Everything about one stop age that does not depend on the amount: the lives (built, or the ones given — every stop
 * age of an answer is a cut of the same lives), the saving years' kernels and each person's pots at the stop in every
 * life, and the drawing years' plan.
 * @param {import('./household.js').Household} household   the full form, ages today (A's / B's toHousehold)
 * @param {number} stopAge   the first person's age at the stop; both people stop in the same year
 * @param {object} env       C's env (today, futures, seed, futureReturns, mix) plus savingMix, savingsGrowth (tests)
 * @param {object[]} [lives] livesList(...) at least S + D years long
 */
export function stopAtPlan(household, stopAge, env, lives = null) {
  const people = household.people;
  const S = Math.max(0, Math.round(stopAge - people[0].age));
  const youngest = Math.min(...people.map((p) => p.age));
  const D = Math.max(1, Math.min(RULES.maxYears, household.planToAge - (youngest + S)));
  const T = S + D;
  const saving = savingPlan(household, stopAge, env);
  const L = lives || livesList(env.futures, T, env);
  for (const life of L) if (!(life.years >= T)) throw new Error(`stopAtPlan: a life of ${life.years} years is shorter than the ${T} this stop needs`);
  const n = L.length;

  const kernels = saving.people.map((p) => ({ who: p.who, pension: savingKernel(saving, p, L, 'pension'), savings: savingKernel(saving, p, L, 'savings') }));
  const pots = saving.people.map((p, j) => {
    const kp = kernels[j].pension, ks = kernels[j].savings;
    const pension = new Float64Array(n), savings = new Float64Array(n);
    for (let i = 0; i < n; i++) {
      pension[i] = kp.A[i] + p.payIn.total * kp.B[i];
      savings[i] = ks.A[i] + p.payIn.savings * ks.B[i];
    }
    return { who: p.who, pension, savings };
  });
  const maxOf = (a) => { let m = 0; for (let i = 0; i < a.length; i++) if (a[i] > m) m = a[i]; return m; };
  const midOf = (a) => { const s = Array.from(a).sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : 0; };
  const maxes = pots.map((q) => ({ pension: maxOf(q.pension), isa: maxOf(q.savings) }));
  const middling = pots.map((q) => ({ pension: midOf(q.pension), isa: midOf(q.savings) }));
  const midTotal = middling.reduce((s, q) => s + q.pension, 0);
  const split = middling.map((q) => (midTotal > 0 ? q.pension / midTotal : 1 / middling.length));

  const plan = drawingPlan(household, S, env, maxes);
  const years = plan.years;
  const drivers = new Array(n).fill(null);
  const driversFor = (i) => drivers[i] || (drivers[i] = prepareFutureFrom(L[i], 12 * S, years));
  // `simulate`'s view of each life's drawing years, for a config the fast path does not cover (never one of the adapter's)
  const drawFutures = L.map((life) => ({ id: life.id, seed: life.seed, returns: sliceReturns(life, S, years) }));

  return {
    S, D: years, T, stopAge, n, household, env, plan, saving, lives: L, kernels, pots, maxes, middling, split,
    driversFor, drawFutures, kernelPasses: kernelPasses(saving),
    /** Life i's pots at the stop, per person in plan order: [{ pension, isa }], today's prices. */
    potsOf: (i) => pots.map((q) => ({ pension: q.pension[i], isa: q.savings[i] })),
    /** The drawing years' plan for other per-person pots (the pot-needed search, a fixed pension). */
    planFor: (m) => drawingPlan(household, S, env, m)
  };
}

/**
 * The runner of one stop age: each life's pots (the kernels × what is paid in, or `opts` in their place), the life's
 * drivers from the stop, the fast path. A couple's configs are made per life (their shares follow their pots).
 * @param {object} sp   stopAtPlan(...)
 * @param {{ pensionOf?: (i: number, j: number) => number, savingsOf?: (i: number, j: number) => number }} [opts]
 *   life i's pension / savings of person j (plan order) at the stop, in place of the projected ones.
 */
export function createStopRunner(sp, lives = sp.lives, kernels = sp.kernels, opts = {}) {
  if (lives !== sp.lives) throw new Error('createStopRunner: the lives are the stop plan\'s');
  void kernels;                                                      // the pots are worked out from them in stopAtPlan
  const n = sp.n;
  const pensionOf = opts.pensionOf || ((i, j) => sp.pots[j].pension[i]);
  const savingsOf = opts.savingsOf || ((i, j) => sp.pots[j].savings[i]);
  let plan = sp.plan;
  if (opts.pensionOf || opts.savingsOf) {
    const maxes = sp.pots.map((q, j) => {
      let pension = 0, isa = 0;
      for (let i = 0; i < n; i++) { pension = Math.max(pension, pensionOf(i, j)); isa = Math.max(isa, savingsOf(i, j)); }
      return { pension, isa };
    });
    plan = sp.planFor(maxes);
  }
  const potsCache = new Array(n).fill(null);
  const potsOf = (i) => potsCache[i] || (potsCache[i] = sp.pots.map((q, j) => ({ pension: pensionOf(i, j), isa: savingsOf(i, j) })));
  const mix = plan.mix;
  const potsFor = (r, i) => {
    const run = plan.runs[r];
    const q = potsOf(i)[run.index];
    const pension = run.role === 'savings' ? 0 : q.pension;
    return { equity: pension * mix.equity, bond: pension * mix.bond, cash: pension * mix.cash, isa: q.isa };
  };
  const fast = createFastRunner(plan, sp.drawFutures, { potsFor, driversFor: sp.driversFor });
  const perLife = plan.runs.length > 1;                              // two people: the shares of the need differ by life
  const byK = new Map();
  const byH = new Map();
  let evaluations = 0;
  const configsAtH = (H, i) => {
    if (perLife) return configsAt(plan, H, potsOf(i));
    let c = byH.get(H);
    if (!c) { c = configsAt(plan, H); byH.set(H, c); }
    return c;
  };
  const configsFor = (k, i) => {
    let c = byK.get(k);
    if (!perLife) {
      if (!c) { c = configsAt(plan, k * STEP * 12); byK.set(k, c); }
      return c;
    }
    if (!c) { c = new Array(n).fill(null); byK.set(k, c); }
    return c[i] || (c[i] = configsAt(plan, k * STEP * 12, potsOf(i)));
  };
  return {
    plan, potsFor, potsOf, configsFor, configsAtH,
    run(r, i, config) { evaluations++; return fast.run(r, i, config); },
    get evaluations() { return evaluations; }
  };
}

/** The run-out month of every life at a household take-home of H a year when there is no pot to draw on. */
function withoutRuns(plan, H, n) {
  const short = plan.periods.find((per) => per.netTotal < H - 1e-6);
  return new Array(n).fill(short ? short.from * 12 : null);
}

/**
 * The verdict at a stop age and a spend: one run per life (every person's, for the earliest month anyone ran out).
 * @param {number} spendAYear   household take-home a year, today's prices
 */
export function verdictAt(sp, runner, spendAYear) {
  const plan = runner.plan;
  const n = sp.n;
  let months;
  if (!plan.runs.length) months = withoutRuns(plan, spendAYear, n);
  else {
    months = new Array(n);
    for (let i = 0; i < n; i++) {
      const res = runFuture(runner.configsAtH(spendAYear, i), null, true, (r, config) => runner.run(r, i, config));
      months[i] = res.failed ? res.failMonth : null;
    }
  }
  const fails = months.filter((m) => m !== null).length;
  const ageOf = (m) => (m === null ? plan.endAge : plan.startAge + Math.floor(m / 12));
  return { fails, lasted: (n - fails) / n, verdict: verdictOf(fails, n), runOutAge: badCaseOf(months.map(ageOf)), runOutMonths: months };
}

/**
 * C's band at this stop age through createBandSolver on the stop runner: the careful, middling and good amounts (whole
 * £10 a month), the share of lives each lasted in, and the bad-case run-out age at each.
 * @param {{ careful: number, middling: number, good: number } | null} [estimate]   steps from a previous age or pass (a hint)
 */
export function bandAt(sp, runner = createStopRunner(sp), estimate = null, opts = {}) {
  const plan = runner.plan;
  const n = sp.n;
  const ageOf = (m) => (m === null ? plan.endAge : plan.startAge + Math.floor(m / 12));
  const three = (f) => ({ careful: f('careful'), middling: f('middling'), good: f('good') });
  if (!plan.runs.length) {
    // nothing to draw on: every amount up to the lowest guaranteed take-home lasts, and nothing above it
    const k = Math.floor(plan.guaranteedAtStartAYear / 12 / STEP + 1e-9);
    const monthly = k * STEP;
    return { k: three(() => k), fails: three(() => 0), monthly: three(() => monthly), yearly: three(() => monthly * 12),
      lastedAt: three(() => 1), runOutAgeAt: three(() => plan.endAge), runOutMonths: three(() => new Array(n).fill(null)), solver: null, engineRuns: 0, evaluations: 0 };
  }
  const solver = createBandSolver(plan, sp.lives, { runner, estimate, configsFor: runner.configsFor, onProgress: opts.onProgress });
  const { k, fails } = solver.solve();
  const runOutMonths = three((w) => solver.runOutMonthsAt(k[w]));
  return {
    k, fails,
    monthly: three((w) => k[w] * STEP),
    yearly: three((w) => round2(k[w] * STEP * 12)),
    lastedAt: three((w) => (n - fails[w]) / n),
    runOutAgeAt: three((w) => badCaseOf(runOutMonths[w].map(ageOf))),
    runOutMonths, solver, engineRuns: solver.engineRuns, evaluations: solver.evaluations
  };
}

/**
 * Whether at most `allowed` lives fail at a spend: the same question as verdictAt(...).fails ≤ allowed, but it stops
 * as soon as the answer is known (more than `allowed` have failed, or too few lives are left to fail). Exact — it
 * assumes nothing about one life from another. → { ok, fails } where fails is the count so far (> allowed when not ok).
 */
function withinFails(sp, runner, spendAYear, allowed) {
  const plan = runner.plan;
  const n = sp.n;
  if (!plan.runs.length) {
    const fails = withoutRuns(plan, spendAYear, n).filter((m) => m !== null).length;
    return { ok: fails <= allowed, fails };
  }
  let fails = 0;
  for (let i = 0; i < n; i++) {
    const res = runFuture(runner.configsAtH(spendAYear, i), null, false, (r, config) => runner.run(r, i, config));
    if (res.failed && ++fails > allowed) return { ok: false, fails };
    if ((n - 1 - i) + fails <= allowed) return { ok: true, fails };
  }
  return { ok: fails <= allowed, fails };
}

/** A runner with every life's pension at a household total P, split between the people by their middling pots. */
function runnerAtPot(sp, P, opts = {}) {
  return createStopRunner(sp, sp.lives, sp.kernels, { pensionOf: (i, j) => P * sp.split[j], savingsOf: opts.savingsOf });
}

/** The verdict with every life's pension at a household total of P at the stop (split by the middling pots); savings as projected. */
export function verdictAtPot(sp, spendAYear, P, opts = {}) {
  return verdictAt(sp, runnerAtPot(sp, P, opts), spendAYear);
}

/**
 * The pot needed (conflict 15): the least whole £1,000 P — the household's pension at the stop, the same in every life,
 * split between two people in the proportion of their middling pots; each life's savings as projected (or
 * `opts.savingsOf`) — at which the spend fails in at most `fails` lives. A lower-bound search over 0 … SAVING.potMax in
 * SAVING.potStep: 13 verdicts, each stopping as soon as it is settled. null when SAVING.potMax is not enough.
 * @param {{ savingsOf?: (i: number, j: number) => number, onStep?: (P: number, fails: number) => void }} [opts]
 *   onStep: each verdict's pot and its failures — counted until the verdict was settled (more than `fails` when it failed).
 */
export function potNeeded(sp, runner, spendAYear, fails, opts = {}) {
  void runner;                                                       // each step has its own pots, so its own runner
  const step = SAVING.potStep;
  const top = Math.round(SAVING.potMax / step);
  let lo = 0, hi = top + 1;
  if (Number.isFinite(opts.guess) && opts.guess >= 0) {
    // a bracket around a guess (a hint: the search settles on the same £1,000 with or without it), widened until it
    // holds — enough at its top, not enough below its bottom — then halved as below
    const ok = (k) => { const v = withinFails(sp, runnerAtPot(sp, k * step, opts), spendAYear, fails); if (opts.onStep) opts.onStep(k * step, v.fails); return v.ok; };
    const spread = Number.isFinite(opts.guessSpread) ? opts.guessSpread : 0.05;
    let h = Math.min(top, Math.max(0, Math.ceil(opts.guess * (1 + spread) / step)));
    let l = Math.max(0, Math.min(h, Math.floor(opts.guess * (1 - spread) / step)));
    let width = Math.max(1, h - l);
    while (!ok(h)) { if (h >= top) return null; l = h + 1; h = Math.min(top, h + width); width *= 2; }
    width = Math.max(1, h - l);
    while (l > 0 && ok(l - 1)) { h = l - 1; l = Math.max(0, l - 1 - width); width *= 2; }
    lo = l; hi = h;
  }
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    const v = withinFails(sp, runnerAtPot(sp, mid * step, opts), spendAYear, fails);
    if (opts.onStep) opts.onStep(mid * step, v.fails);
    if (v.ok) hi = mid; else lo = mid + 1;
  }
  return lo > top ? null : lo * step;
}

/**
 * The savings the years before a pension opens need (B, brief conflict 38): the least whole £1,000 F, no less than
 * `from`, such that with every life's savings at the stop at least F (split between the people as the pension is) and
 * a pension of SAVING.potMax behind it, the spend fails in at most `fails` lives. The deterministic draw (`from`) is
 * not enough on its own: in the drawing years savings grow at the engine's fixed rate, so in a life with prices rising
 * faster the same pounds pay fewer months. null when four times `from` is still not enough.
 */
export function savingsNeeded(sp, spendAYear, fails, from) {
  const step = SAVING.potStep;
  const at = (k) => withinFails(sp, runnerAtPot(sp, SAVING.potMax, { savingsOf: (i, j) => Math.max(sp.pots[j].savings[i], k * step * sp.split[j]) }), spendAYear, fails).ok;
  let lo = Math.max(0, Math.ceil(from / step));
  if (at(lo)) return lo * step;
  // the top of the search: a little above the draw first (it is usually within a tenth of it), then further out
  const last = Math.max(lo + 1, Math.ceil((4 * from) / step) + 10);
  let hi = null;
  for (const f of [1.1, 1.25, 1.5, 2]) {
    const k = Math.min(last, Math.max(lo + 1, Math.ceil((f * from) / step)));
    if (k <= lo) continue;
    if (at(k)) { hi = k; break; }
    lo = k;
  }
  if (hi === null) { if (!at(last)) return null; hi = last; }
  lo += 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (at(mid)) hi = mid; else lo = mid + 1;
  }
  return lo * step;
}

/**
 * Whether the pot needed at `fails` is no more than P — potNeeded(...) ≤ P — with one verdict at P (stopping early)
 * in place of the search. Exact wherever potNeeded's bisection is (the count of failures does not rise with the pot).
 */
export function potNeededWithin(sp, spendAYear, fails, P, opts = {}) {
  if (!(P >= 0)) return false;
  const k = Math.min(Math.floor(P / SAVING.potStep), Math.round(SAVING.potMax / SAVING.potStep));
  return withinFails(sp, runnerAtPot(sp, k * SAVING.potStep, opts), spendAYear, fails).ok;
}

/**
 * potNeeded at several fail counts at once (B's careful, middling and good numbers). Each life's own least pot — the
 * least whole £1,000 at which that life lasts, by bisection over 0 … SAVING.potMax with one run per step — is found
 * once; the number at `fails` f is then the (n − 1 − f)-th of them in order. That rests on each life lasting at every
 * pot above its own least, the assumption potNeeded's bisection makes for the count; so each figure is checked with
 * potNeeded's own test (it holds at the figure and not £1,000 below), and any figure that fails the check is found by
 * potNeeded itself. The result is potNeeded's, in about a third of the runs.
 * @param {number[]} failsList
 * @param {{ savingsOf?: Function, onLeast?: (least: Int32Array) => void }} [opts]   onLeast: each life's own least pot, in
 *   whole £1,000 (SAVING.potMax / step + 1 where nothing up to SAVING.potMax lasts) — B brackets its pay-in search with it
 * @returns {(number|null)[]}   in the order of failsList
 */
export function potNeededAt(sp, spendAYear, failsList, opts = {}) {
  const step = SAVING.potStep;
  const top = Math.round(SAVING.potMax / step);
  const n = sp.n;
  const runners = new Map();
  const runnerAt = (k) => { let r = runners.get(k); if (!r) { r = runnerAtPot(sp, k * step, opts); runners.set(k, r); } return r; };
  const lastsAt = (k, i) => {
    const runner = runnerAt(k);
    if (!runner.plan.runs.length) return !withoutRuns(runner.plan, spendAYear, 1)[0];
    return !runFuture(runner.configsAtH(spendAYear, i), null, false, (r, config) => runner.run(r, i, config)).failed;
  };
  const least = new Int32Array(n);
  for (let i = 0; i < n; i++) {
    let lo = 0, hi = top + 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (lastsAt(mid, i)) hi = mid; else lo = mid + 1;
    }
    least[i] = lo;
  }
  if (typeof opts.onLeast === 'function') opts.onLeast(least);
  const sorted = Array.from(least).sort((a, b) => a - b);
  return failsList.map((f) => {
    const k = f >= n ? 0 : sorted[n - 1 - f];
    if (k > top) return potNeeded(sp, null, spendAYear, f, opts);
    const holds = withinFails(sp, runnerAt(k), spendAYear, f).ok && (k === 0 || !withinFails(sp, runnerAt(k - 1), spendAYear, f).ok);
    return holds ? k * step : potNeeded(sp, null, spendAYear, f, opts);
  });
}

// ---- the one test at another pay-in (step 4 brief section 10, J9) --------------------------------------------------

/**
 * A runner with each person's pots at the stop worked out of their kernels at other monthly pay-ins: in life i, person
 * j's pension is A_j,i + pension_j × B_j,i and their savings A^s_j,i + savings_j × B^s_j,i — exactly what stopAtPlan
 * would hold for inputs paying those amounts in (the same arithmetic, so at today's pay-ins it IS the stop plan's own
 * runner). `pensionAt` (optional) puts every life's pension at a household total instead, split as the number is.
 * @param {{ pension: number, savings: number }[]} payIns   per person, plan order, £ a month at today's prices
 */
export function runnerAtPayIns(sp, payIns, opts = {}) {
  const today = sp.saving.people.every((p, j) => payIns[j].pension === p.payIn.total && payIns[j].savings === p.payIn.savings);
  if (today && !(opts.pensionAt >= 0)) return createStopRunner(sp);
  const kp = sp.kernels.map((k) => k.pension);
  const ks = sp.kernels.map((k) => k.savings);
  const pensionOf = opts.pensionAt >= 0
    ? (i, j) => opts.pensionAt * sp.split[j]
    : (i, j) => kp[j].A[i] + payIns[j].pension * kp[j].B[i];
  return createStopRunner(sp, sp.lives, sp.kernels, { pensionOf, savingsOf: (i, j) => ks[j].A[i] + payIns[j].savings * ks[j].B[i] });
}

/** Whether at most `allowed` lives fail at a spend with these pay-ins (stops as soon as it is settled). */
export function lastsWithin(sp, spendAYear, payIns, allowed, opts = {}) {
  return withinFails(sp, runnerAtPayIns(sp, payIns, opts), spendAYear, allowed).ok;
}

/** The one test in full at a spend with these pay-ins: verdictAt on that runner (one run per life). */
export function verdictAtPayIns(sp, spendAYear, payIns, opts = {}) {
  return verdictAt(sp, runnerAtPayIns(sp, payIns, opts), spendAYear);
}

/**
 * The one test in full at a spend for a rising list of pay-ins (B's grid row): the count of lives that lasted at each.
 * A life that lasts at one pay-in lasts at every higher one (more is paid in, so every pot at the stop is larger), so
 * each column runs only the lives that ran out in the column before. → [{ fails, lasted, verdict }] in the list's order.
 * @param {{ pension: number, savings: number }[][]} payInsList   per column, per person (plan order)
 */
export function countsAtPayIns(sp, spendAYear, payInsList) {
  const n = sp.n;
  let open = Array.from({ length: n }, (_, i) => i);          // the lives not yet known to last
  return payInsList.map((payIns) => {
    const runner = runnerAtPayIns(sp, payIns);
    const plan = runner.plan;
    const still = [];
    if (!plan.runs.length) {
      const failing = Boolean(withoutRuns(plan, spendAYear, 1)[0] !== null);
      if (failing) still.push(...open);
    } else {
      for (const i of open) {
        const res = runFuture(runner.configsAtH(spendAYear, i), null, false, (r, config) => runner.run(r, i, config));
        if (res.failed) still.push(i);
      }
    }
    open = still;
    const fails = still.length;
    return { fails, lasted: (n - fails) / n, verdict: verdictOf(fails, n) };
  });
}

/**
 * The least whole £10 a month `c` in [from, ceiling] at which `ok(c)` holds — the pay-in that makes the money last in
 * enough lives — by bisection on £10 steps; null when the ceiling is not enough. `ok` is the one test at that pay-in
 * (more paid in never makes a life fail that lasted, so the lives that last only grow with `c`). The figure found holds
 * and £10 less does not (or it is `from`).
 */
export function leastPayIn(ok, ceiling, from = 0, guess = null) {
  const lo0 = Math.max(0, Math.ceil(from / 10 - 1e-9));
  const top = Math.floor(ceiling / 10 + 1e-9);
  let lo = lo0, hi = top;
  if (guess && Number.isFinite(guess.lo) && Number.isFinite(guess.hi)) {
    // a bracket from each life's own figure (a hint: the search settles on the same £10 with or without it). Widen it
    // until it holds — ok at its top, not ok at its bottom — then halve it as below.
    let h = Math.min(top, Math.max(lo0, Math.ceil(guess.hi / 10 - 1e-9)));
    let l = Math.max(lo0, Math.min(h, Math.floor(guess.lo / 10 + 1e-9)) - 1);
    let step = Math.max(1, h - l);
    while (!ok(h * 10)) { if (h >= top) return null; l = h; h = Math.min(top, h + step); step *= 2; }
    step = Math.max(1, h - l);
    while (l >= lo0 && ok(l * 10)) { h = l; if (l === lo0) return lo0 * 10; l = Math.max(lo0, l - step); step *= 2; }
    lo = l; hi = h;
    if (lo < lo0) return hi * 10;
  } else {
    if (ok(lo0 * 10)) return lo0 * 10;
    if (top <= lo0 || !ok(top * 10)) return null;
  }
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (ok(mid * 10)) hi = mid; else lo = mid;
  }
  return hi * 10;
}

/** The careful amount (£ a month) with every life's pension at a household total `potsFixed` (B's monthlyIfShort). */
export function monthlyAt(sp, runner, potsFixed, opts = {}) {
  void runner;
  return bandAt(sp, runnerAtPot(sp, potsFixed, opts), opts.estimate || null).monthly.careful;
}

/**
 * The phases of a spend from the stop (C's phasesOf on breakdownAt), at the middling pots or the pots given (per person,
 * plan order, { pension, isa }): £ a month at today's prices. Added for A and B: `work` (part-time earnings before
 * tax), `fromWork` (what they add after tax), `pensionOpen` (false while a pension is closed: nothing from it), and
 * `shown.fromWork`; shown.takeHome = fromPots + statePension + finalSalary + fromWork, whole pounds.
 */
export function phasesAt(sp, spendAYear, pots = null) {
  const q = pots || sp.middling;
  const plan = pots ? sp.planFor(q.map((x) => ({ pension: x.pension, isa: x.isa }))) : sp.plan;
  const per = breakdownAt(plan, spendAYear, q);
  return per.map((p) => {
    const ages = {};
    for (const person of plan.people) ages[person.who] = { from: person.ageAtStart + p.from, to: person.ageAtStart + p.to };
    const raw = p.byPerson.map((b) => ({
      who: b.who, statePension: b.statePension / 12, finalSalary: b.finalSalary / 12, work: (b.work || 0) / 12, fromWork: (b.workAfterTax || 0) / 12,
      fromPension: b.fromPension / 12, fromSavings: b.fromSavings / 12, tax: b.tax / 12, takeHome: b.takeHome / 12
    }));
    const byPerson = raw.map((b, i) => ({
      ...Object.fromEntries(Object.entries(b).map(([k, v]) => [k, typeof v === 'number' ? round2(v) : v])),
      higherRate: Boolean(p.byPerson[i].higherRate),
      locked: Boolean(p.byPerson[i].locked),
      pensionOpen: p.byPerson[i].pensionOpen !== false
    }));
    const sum = (f) => raw.reduce((s, b) => s + b[f], 0);
    const takeHome = round2(p.takeHome / 12);
    const statePension = round2(sum('statePension'));
    const finalSalary = round2(sum('finalSalary'));
    const fromWork = round2(sum('fromWork'));
    const shownTake = Math.round(takeHome);
    let shownSp = Math.round(statePension);
    let shownFs = Math.round(finalSalary);
    let shownWork = Math.round(fromWork);
    let shownPots = shownTake - shownSp - shownFs - shownWork;
    if (shownPots < 0) { const cut = Math.min(-shownPots, shownFs); shownFs -= cut; shownPots += cut; }
    if (shownPots < 0) { const cut = Math.min(-shownPots, shownSp); shownSp -= cut; shownPots += cut; }
    if (shownPots < 0) { shownWork += shownPots; shownPots = 0; }
    return {
      fromAge: plan.startAge + p.from, toAge: plan.startAge + p.to, ages,
      takeHome, fromPension: round2(sum('fromPension')), fromSavings: round2(sum('fromSavings')), fromPots: round2(sum('fromPension') + sum('fromSavings')),
      statePension, finalSalary, tax: round2(sum('tax')), work: round2(sum('work')), fromWork,
      byPerson,
      beforeStatePension: p.beforeStatePension,
      pensionOpen: byPerson.every((b) => b.pensionOpen),
      shown: { takeHome: shownTake, fromPots: shownPots, statePension: shownSp, finalSalary: shownFs, fromWork: shownWork }
    };
  });
}
