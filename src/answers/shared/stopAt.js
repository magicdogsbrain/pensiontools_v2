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
 *   phasesAt(sp, spendAYear, pots?, opts?)        → Phase[] (C's phases, plus fromWork, work, pensionOpen, shown.fromWork);
 *                                                   opts.yearly: one a year (a shaped answer's rows, spending-shape.md 5.6)
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
 *
 * Couples who stop work in different years (research/v7/couples-different-years.md 4.3): each person's stop is read from
 * the household (saving.js stopYearsFor), never overwritten; `stopAge` is the stop the answer is about and must be one
 * of the two. S is the household's start (the first stop), D and T as before; each person saves to their own stop and
 * their pots are at it; the drivers are kept per (life, offset). A life is still ONE evaluation: the stop runner runs a
 * 'joined' entry as the first stopper's run with the hand-over at the second stop, then the joiner's from their stop
 * (only as far as could still matter), and reports the earlier run-out on the household's clock. The pot needed scales
 * the pensions of the people still saving, each at their own stop; the money of someone who has stopped stays as it is.
 * With one stop for everyone every function here is what it was, figure for figure (tests/v7/shared/apart.identity).
 */
import { enginePlan, configsAt, breakdownAt, joinAt, passOnAt, unpaidOf, amountInYear, yearlyPlan } from './toEngine.js';
import { createFastRunner, prepareFutureFrom } from './fastEngine.js';
import { createBandSolver, STEP, runFuture } from './band.js';
import { livesList, sliceReturns } from './lives.js';
import { savingPlan, savingKernel, kernelPasses, stopYearsFor } from './saving.js';
import { RULES, SAVING, verdictOf } from './rules.js';

const round2 = (x) => Math.round(x * 100) / 100;

/** The bad case of a list of ages: sorted upwards, position floor(n/10) (C's). */
function badCaseOf(ages) {
  const s = [...ages].sort((a, b) => a - b);
  return s[Math.floor(s.length / 10)];
}

/**
 * The engine plan of the drawing years for given per-person pots (the largest over the lives: the band's ceiling). Each
 * person stops `own[j]` years from today (stopYearsFor: everyone at the one stop, or each at their own); only the pots
 * are put in.
 */
function drawingPlan(household, own, env, maxes) {
  const h = {
    ...household,
    portfolio: env && env.mix ? { kind: 'mix', equity: env.mix.equity || 0, bond: env.mix.bond || 0, cash: env.mix.cash || 0 } : household.portfolio,
    people: household.people.map((p, j) => ({
      ...p,
      pots: { ...p.pots, pension: maxes[j].pension, isa: maxes[j].isa },
      stopWork: { kind: 'age', age: p.age + own[j] }
    }))
  };
  return enginePlan(h, env, { start: 'asGiven', pots: 'perFuture' });
}

/**
 * Everything about one stop age that does not depend on the amount: the lives (built, or the ones given — every stop
 * age of an answer is a cut of the same lives), the saving years' kernels and each person's pots at the stop in every
 * life, and the drawing years' plan.
 * @param {import('./household.js').Household} household   the full form, ages today (A's / B's toHousehold)
 * @param {number} stopAge   the stop the answer is about: the first person's age at it when both stop in the same year
 *   (everyone moves to it); for a couple apart, the age at their own stop of the person the answer is about
 * @param {object} env       C's env (today, futures, seed, futureReturns, mix) plus savingMix, savingsGrowth (tests)
 * @param {object[]} [lives] livesList(...) at least S + D years long
 * @returns {object}   sp. Besides today's fields: `stops` ([{ who, S, join }] per person, household order: their own
 *   years until they stop, and the year their money joins on the household's clock) and `stillSaving` (per person: their
 *   pension is what the pot needed scales — everyone when they stop together, only those still working when apart).
 */
export function stopAtPlan(household, stopAge, env, lives = null) {
  const people = household.people;
  const own = stopYearsFor(household, stopAge, env.today);
  const S = own.S;
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
  // The pot needed (4.3 m) scales the pensions of the people still saving, split by their middling pots: everyone when
  // they stop together (today's arithmetic exactly); a couple apart, only those not yet stopped.
  const stillSaving = own.apart ? own.own.map((s) => s > 0) : people.map(() => true);
  const scaled = stillSaving.filter(Boolean).length;
  const midTotal = middling.reduce((s, q, j) => s + (stillSaving[j] ? q.pension : 0), 0);
  const split = middling.map((q, j) => (!stillSaving[j] ? 0 : midTotal > 0 ? q.pension / midTotal : 1 / scaled));

  const plan = drawingPlan(household, own.own, env, maxes);
  const years = plan.years;
  // each life's drivers, read from the stop of the run: the household's (offset 0) and, apart, the joiner's (offset g)
  const drivers = new Array(n).fill(null);
  const driversAt = new Map();
  const driversFor = (i, offset = 0) => {
    if (!(offset > 0)) return drivers[i] || (drivers[i] = prepareFutureFrom(L[i], 12 * S, years));
    let byLife = driversAt.get(offset);
    if (!byLife) { byLife = new Array(n).fill(null); driversAt.set(offset, byLife); }
    return byLife[i] || (byLife[i] = prepareFutureFrom(L[i], 12 * (S + offset), years - offset));
  };
  // `simulate`'s view of each life's drawing years, for a config the fast path does not cover (never one of the adapter's)
  const drawFutures = L.map((life) => ({ id: life.id, seed: life.seed, returns: sliceReturns(life, S, years) }));

  return {
    S, D: years, T, stopAge, n, household, env, plan, saving, lives: L, kernels, pots, maxes, middling, split,
    driversFor, drawFutures, kernelPasses: kernelPasses(saving),
    stops: people.map((p, j) => ({ who: p.who, S: own.own[j], join: own.own[j] - S })), stillSaving,
    /** Life i's pots at the stop, per person in plan order: [{ pension, isa }], today's prices. */
    potsOf: (i) => pots.map((q) => ({ pension: q.pension[i], isa: q.savings[i] })),
    /** The drawing years' plan for other per-person pots (the pot-needed search, a fixed pension). */
    planFor: (m) => drawingPlan(household, own.own, env, m)
  };
}

/**
 * The runner of one stop age: each life's pots (the kernels × what is paid in, or `opts` in their place), the life's
 * drivers from the stop, the fast path. A couple's configs are made per life (their shares follow their pots).
 * @param {object} sp   stopAtPlan(...)
 * @param {{ pensionOf?: (i: number, j: number) => number, savingsOf?: (i: number, j: number) => number, parts?: boolean }} [opts]
 *   life i's pension / savings of person j (plan order) at the stop, in place of the projected ones. `parts` (tests): a
 *   joined run's result keeps the joiner's config the hand-over made (parts.join.config).
 * @returns {{ plan, run, potsFor, potsOf, configsFor, configsAtH, fastRun, evaluations, months }}
 *   run(r, i, config): one configsAt entry's config in life i → { failed, failMonth } on the household's clock (a couple
 *   apart: a 'joined' entry also gives `parts` — { first, atJoin, shares, join }: each run's result, the first stopper's
 *   money at the second stop at today's prices, the shares the hand-over set). `months`: engine months run (the work bound).
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
  let months = 0;
  /** One engine run, counted in months (the work bound: couples-different-years.md 10); a resumed run from its month. */
  const fastRun = (r, i, config, hook = null, until = null, more = null) => {
    const res = fast.run(r, i, config, hook, until, more);
    const all = 12 * config.years;
    const from = more && more.resume ? more.resume.month : 0;
    months += (res.failed ? res.failMonth + 1 : (until === null ? all : Math.min(until, all))) - from;
    return res;
  };
  // couples apart: the first stopper's state at the top of each month from the second stop (the pass-on resumes it there)
  const record = plan.apart ? { from: 12 * plan.apart.years, buf: new Float64Array(5 * 12 * plan.years) } : null;

  /**
   * A couple apart, one entry in life i. 'unpaid': the need falls on nobody's money in a month the pay does not make up.
   * A plain run: its own clock, so a run-out is moved by its offset onto the household's. 'joined': the first stopper's
   * run with the hand-over at the second stop, then the joiner's from their stop; a run-out of the first stopper before
   * the join ends the life there. After the join the household runs out only when both have (the pass-on, toEngine.js
   * passOnAt): when the first stopper's money runs out first, the joiner's run pays all from that month (a hook); when
   * the joiner's does, the first stopper's run is resumed at that month from its record and pays all from then.
   */
  const runApart = (r, i, config) => {
    if (config.unpaid) return { failed: config.failMonth !== null, failMonth: config.failMonth };
    if (!config.joined) {
      const res = fastRun(r, i, config);
      const g = plan.runs[r].offset;
      if (!(g > 0) || !res.failed) return res;
      return { ...res, failMonth: res.failMonth + 12 * g };
    }
    const { first, join, month, H, pots } = config.joined;
    let hand = null;
    const hook = { month, retarget: (state) => { hand = joinAt(plan, H, pots, state, config.config); return hand.first; } };
    const f = fastRun(first, i, config.config, hook, null, { record });
    if (!hand) return { failed: true, failMonth: f.failMonth, parts: { first: f, atJoin: null, shares: null, join: null, last: null, passOn: null } };
    const mf = f.failed ? f.failMonth : null;                            // the household's clock (the first stopper's)
    // the joiner from their stop — paying all from the month the first stopper's money ran out, if it did
    const passToJoin = mf === null ? null : { month: mf - month, retarget: () => passOnAt(plan, H, join, mf, hand.join.config) };
    const j = fastRun(join, i, hand.join.config, passToJoin);
    const mj = j.failed ? j.failMonth + month : null;
    let failMonth = mj;
    let last = null;
    let passOn = mf !== null && (mj === null || mf <= mj) ? { to: 'join', month: mf } : null;
    if (mj !== null && (mf === null || mj < mf)) {
      // the joiner's money ran out first: the first stopper's run, resumed at that month, pays all from then
      const o = 5 * (mj - record.from);
      const b = record.buf;
      const resume = { month: mj, equity: b[o], bond: b[o + 1], cash: b[o + 2], isa: b[o + 3], lsa: b[o + 4], ...passOnAt(plan, H, first, mj, hand.first),
        ...(f.coveredFrom !== undefined ? { coveredFrom: f.coveredFrom } : {}) };
      last = fastRun(first, i, config.config, null, null, { resume });
      failMonth = last.failed ? last.failMonth : null;
      passOn = { to: 'first', month: mj };
    }
    const joinPart = opts.parts ? { ...j, config: hand.join.config } : j;
    return { failed: failMonth !== null, failMonth, parts: { first: f, atJoin: hand.atJoin, shares: hand.shares, join: joinPart, last, passOn } };
  };
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
    plan, potsFor, potsOf, configsFor, configsAtH, fastRun,
    run(r, i, config) { evaluations++; return plan.apart ? runApart(r, i, config) : fastRun(r, i, config); },
    get evaluations() { return evaluations; },
    get months() { return months; }
  };
}

/** The run-out month of every life at a household take-home of H a year when there is no pot to draw on. */
function withoutRuns(plan, H, n) {
  // a couple apart: the pots' share of what is spent, the years the pay makes up gaps not counted (toEngine.js unpaidOf)
  if (plan.apart) return new Array(n).fill(unpaidOf(plan, H).failMonth);
  if (plan.shape && plan.shape.r) {
    // a shape: the first YEAR whose take-home the incomes you get anyway fall short of (spending-shape.md 5.3)
    const per = (y) => plan.periods.find((p) => p.from <= y && y < p.to);
    for (let y = 0; y < plan.years; y++) if (per(y).netTotal < amountInYear(plan, H, y) - 1e-6) return new Array(n).fill(y * 12);
    return new Array(n).fill(null);
  }
  const short = plan.periods.find((per) => per.netTotal < H - 1e-6);
  return new Array(n).fill(short ? short.from * 12 : null);
}

/**
 * Couples apart: when the pay of the one still working makes up what the stopped person's money cannot pay before the
 * second stop (the warning 'apart-cover-used'), at a household take-home of H a year. One part-run per life, to the
 * second stop. → { who, fromAge, months }: the first stopper, the age (theirs) from which it happens in a bad case (the
 * worst 1 in 10: the floor(n/10)-th earliest over the lives; null when fewer lives than that need it), and each life's
 * first such month on the household's clock (null when never). null for a plan whose people stop together.
 */
export function coverAt(sp, runner, H) {
  const plan = runner.plan;
  if (!plan.apart) return null;
  const G = plan.apart.years;
  const firstPerson = plan.people[plan.apart.firstIndex];
  const n = sp.n;
  const out = new Array(n).fill(null);
  for (let i = 0; i < n; i++) {
    const entries = runner.configsAtH(H, i);
    let m = unpaidOf(plan, H, runner.potsOf(i)).coveredFrom;
    const joined = entries.find((e) => e.role === 'joined');
    const r = joined ? joined.config.joined.first : plan.runs.findIndex((run) => run.offset === 0);
    if (r >= 0 && plan.runs[r].base.coverMonths > 0) {
      const config = joined ? joined.config.config : entries[r].config;
      const res = runner.fastRun(r, i, config, null, 12 * G);
      if (res.coveredFrom !== null && res.coveredFrom !== undefined && (m === null || res.coveredFrom < m)) m = res.coveredFrom;
    }
    out[i] = m;
  }
  const ages = out.map((m) => (m === null ? Infinity : firstPerson.ageAtStart + Math.floor(m / 12))).sort((a, b) => a - b);
  const bad = ages[Math.floor(n / 10)];
  return { who: firstPerson.who, fromAge: Number.isFinite(bad) ? bad : null, months: out };
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

/**
 * Life i's pension of person j with the household's pension at the stop at a total P: P split by the middling pots
 * between the people still saving (everyone when they stop together); the pension of someone who has stopped as it is.
 */
const pensionAtTotal = (sp, P) => (i, j) => (sp.stillSaving[j] ? P * sp.split[j] : sp.pots[j].pension[i]);

/** A runner with every life's pension at a household total P, split between the people by their middling pots. */
function runnerAtPot(sp, P, opts = {}) {
  return createStopRunner(sp, sp.lives, sp.kernels, { pensionOf: pensionAtTotal(sp, P), savingsOf: opts.savingsOf });
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
 * not enough on its own: in the drawing years savings grow as the household says (6.22.0: "Mostly cash" — last year's
 * rise in prices less 1% — unless chosen; a household made by hand without a choice, at the engine's fixed rate), so in a
 * life with prices rising faster than they grow the same pounds pay fewer months. null when four times `from` is still
 * not enough.
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
    ? pensionAtTotal(sp, opts.pensionAt)
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
  // `from` itself first, with or without a hint: where `ok` is not monotone at a few pounds (a first pound into a pension
  // that was empty adds a pension run to a couple's plan, and the two drain in a fixed ratio) a bracket from the lives'
  // own figures can miss it — a NIGHTLY=1 run, 1 Oct 2026: B said "on course" paying in nothing, and that the pay-in that
  // gets there was £80 (tests/v7/cross/oneTest.test.js OT2, seed -191910654)
  if (ok(lo0 * 10)) return lo0 * 10;
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
  } else if (top <= lo0 || !ok(top * 10)) return null;
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
 * Couples apart: the first stopper's money at the second stop, as the phases show it (4.3 j) — their run at H on these
 * pots for the G years apart, once in every life (one part-run each), its pots at the join at today's prices, and the
 * middling of them (by the total; the lower life of a tie). null when the first stopper has no run.
 */
function middlingAtJoin(sp, plan, H, q) {
  const r = plan.runs.findIndex((run) => run.offset === 0);
  if (r < 0) return null;
  const G = plan.apart.years;
  const mix = plan.mix;
  const own = q[plan.runs[r].index];
  const pension = plan.runs[r].role === 'pension' ? own.pension : 0;
  const start = { equity: pension * mix.equity, bond: pension * mix.bond, cash: pension * mix.cash, isa: own.isa };
  const fast = createFastRunner(plan, sp.drawFutures, { potsFor: () => start, driversFor: sp.driversFor });
  const entries = configsAt(plan, H, q);
  const joined = entries.find((e) => e.role === 'joined');
  const config = joined ? joined.config.config : entries[r].config;
  const at = [];
  for (let i = 0; i < sp.n; i++) {
    const res = fast.run(r, i, config, null, 12 * G);
    const c = sp.driversFor(i, 0).cumInf[G];
    at.push(res.failed ? { pension: 0, isa: 0 } : { pension: (res.equity + res.bond + res.cash) / c, isa: res.isa / c });
  }
  const order = at.map((x, i) => i).sort((a, b) => (at[a].pension + at[a].isa) - (at[b].pension + at[b].isa) || a - b);
  return at[order[Math.floor(order.length / 2)]];
}

/**
 * The phases of a spend from the stop (C's phasesOf on breakdownAt), at the middling pots or the pots given (per person,
 * plan order, { pension, isa }): £ a month at today's prices. Added for A and B: `work` (part-time earnings before
 * tax), `fromWork` (what they add after tax), `pensionOpen` (false while a pension is closed: nothing from it), and
 * `shown.fromWork`; shown.takeHome = fromPots + statePension + finalSalary + fromWork, whole pounds.
 * Couples apart (4.3 j), only then: before the second stop each phase carries `fromPay` (what the worker's pay covers)
 * and `shown.fromPay`, each person `working`; the years after it are shared on the first stopper's middling money at
 * the join (middlingAtJoin). shown.takeHome = fromPots + statePension + finalSalary + fromWork (+ fromPay).
 */
export function phasesAt(sp, spendAYear, pots = null, opts = {}) {
  const q = pots || sp.middling;
  const plan = pots ? sp.planFor(q.map((x) => ({ pension: x.pension, isa: x.isa }))) : sp.plan;
  if (plan.apart) return apartPhases(sp, plan, spendAYear, q, opts);
  // `opts.yearly` (a shaped answer's per-year rows, spending-shape.md 5.6): one phase a year, the same figures year by year
  const per = breakdownAt(opts.yearly ? yearlyPlan(plan) : plan, spendAYear, q);
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

/** phasesAt for a couple apart: the same phases, plus what the worker's pay covers before the second stop. */
function apartPhases(sp, plan, spendAYear, q, opts = {}) {
  const per = breakdownAt(opts.yearly ? yearlyPlan(plan) : plan, spendAYear, q, middlingAtJoin(sp, plan, spendAYear, q));
  return per.map((p) => {
    const ages = {};
    for (const person of plan.people) ages[person.who] = { from: person.ageAtStart + p.from, to: person.ageAtStart + p.to };
    const raw = p.byPerson.map((b) => ({
      who: b.who, statePension: b.statePension / 12, finalSalary: b.finalSalary / 12, work: (b.work || 0) / 12, fromWork: (b.workAfterTax || 0) / 12,
      fromPension: b.fromPension / 12, fromSavings: b.fromSavings / 12, tax: b.tax / 12, takeHome: b.takeHome / 12
    }));
    const byPerson = raw.map((b, i) => {
      const out = {
        ...Object.fromEntries(Object.entries(b).map(([k, v]) => [k, typeof v === 'number' ? round2(v) : v])),
        higherRate: Boolean(p.byPerson[i].higherRate),
        locked: Boolean(p.byPerson[i].locked),
        pensionOpen: p.byPerson[i].pensionOpen !== false
      };
      if (p.byPerson[i].working !== undefined) out.working = p.byPerson[i].working;
      return out;
    });
    const sum = (f) => raw.reduce((s, b) => s + b[f], 0);
    const takeHome = round2(p.takeHome / 12);
    const statePension = round2(sum('statePension'));
    const finalSalary = round2(sum('finalSalary'));
    const fromWork = round2(sum('fromWork'));
    const paying = p.fromPay !== undefined;
    const fromPay = paying ? round2(p.fromPay / 12) : 0;
    const shownTake = Math.round(takeHome);
    let shownSp = Math.round(statePension);
    let shownFs = Math.round(finalSalary);
    let shownWork = Math.round(fromWork);
    let shownPay = Math.round(fromPay);
    let shownPots = shownTake - shownSp - shownFs - shownWork - shownPay;
    if (shownPots < 0) { const cut = Math.min(-shownPots, shownFs); shownFs -= cut; shownPots += cut; }
    if (shownPots < 0) { const cut = Math.min(-shownPots, shownSp); shownSp -= cut; shownPots += cut; }
    if (shownPots < 0) { const cut = Math.min(-shownPots, shownWork); shownWork -= cut; shownPots += cut; }
    if (shownPots < 0) { shownPay += shownPots; shownPots = 0; }
    const phase = {
      fromAge: plan.startAge + p.from, toAge: plan.startAge + p.to, ages,
      takeHome, fromPension: round2(sum('fromPension')), fromSavings: round2(sum('fromSavings')), fromPots: round2(sum('fromPension') + sum('fromSavings')),
      statePension, finalSalary, tax: round2(sum('tax')), work: round2(sum('work')), fromWork,
      byPerson,
      beforeStatePension: p.beforeStatePension,
      pensionOpen: byPerson.every((b) => b.pensionOpen),
      shown: { takeHome: shownTake, fromPots: shownPots, statePension: shownSp, finalSalary: shownFs, fromWork: shownWork }
    };
    if (paying) { phase.fromPay = fromPay; phase.shown.fromPay = shownPay; }
    return phase;
  });
}
