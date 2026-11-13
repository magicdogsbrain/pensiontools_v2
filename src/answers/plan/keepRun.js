/**
 * "Test what you keep against your plan" (7.7.0): the plan's own one test, run with what the person actually holds — the
 * plan as locked side by side with the plan as held. Generic: any strategy, anything kept that the plan did not have.
 * Nothing is reimplemented: a pot plan (any strategy but a bought ladder) is lastsRun.js planFor + stressTestStrategy on its
 * locked settings and on those settings as held (keepTest.js heldSettingsOf); a bought ladder (full index-linked ladder,
 * ladder + rotation, floored schedule) is read as "Does it last?" reads it — the document's own result, never re-priced —
 * and as held, the years its rungs and stand-ins do not cover (keepTest.js ladderGapsOf) paid from what is kept and counted
 * toward them, its shares on the test's own futures (the futures every ladder's money left over in shares rides:
 * ladderEngine.bootstrapPaths with seed i × 7919 + 3, the plan's charge), the rest at its value, and the money expected in
 * the year it arrives.
 *
 * Loaded LAZILY (a dynamic import in effects/answerWorker.js; the classic planner imports it on its Transition tab): this
 * file is a door to the strategies, so the shell and the plan pages' chunk never carry them.
 *
 *   runKeepRetest(plan, { today, onProgress }) → {
 *     fingerprint, recordKey, strategyId, ladder, engineVersion,       recordKey: the record exactly as read (a result is for it only)
 *     asLocked, asHeld, withoutExpected | null,          each { affordable, share, chancePct, badCase: { lasts, age, year }, endAge }
 *     shock: { half, nothing | null, counted } | null,    what is kept by choice worth half (one company's shares: nothing)
 *     firstShort: { Y, gap } | null,                     a ladder's first tax year not covered before what is kept or expected
 *     kept: [{ label, wrapper, value, as, counted, bucket, single }], runs, basis
 *   }
 *
 * Plain data in, plain data out; no live prices; the date arrives as `today`. Nothing is written.
 */
import { effectiveStressSettings } from '../../services/PlanReading.js';
import { stressTestStrategy } from '../../strategies/stressTest.js';
import { bootstrapPaths } from '../../strategies/ladderEngine.js';
import { ENGINE_VERSION } from '../../strategies/version.js';
import { monthlyChargeFactor } from '../../services/Charges.js';
import { documentLadder } from '../../services/LadderPosition.js';
import { oneAnswer } from '../../services/OneAnswer.js';
import { normaliseHoldings, expectedOf } from '../../services/HoldingsRecord.js';
import { keepFingerprint, holdingsKeyOf } from '../../services/PlanAmendments.js';
import { planFor } from './lastsRun.js';
import { heldSettingsOf, ladderGapsOf, keptAssetsOf } from './keepTest.js';
import { dateOf } from './dates.js';

const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const num = (v) => (Number.isFinite(+v) ? +v : 0);
const plain = (v) => JSON.parse(JSON.stringify(v, (k, x) => (typeof x === 'function' ? undefined : (typeof x === 'number' && !Number.isFinite(x)) ? null : x)));
const isLocked = (plan) => !!(plan && plan.decisionTool && plan.decisionTool.settings && plan.decisionTool.settings.locked);

/** The futures a ladder's money is tried on: as many as the one test's (the plan's mcRuns). */
const FUTURES = 1000;
/** The worst 1 in 10: the bad case every screen says (OneAnswer: the 10th percentile, never the worst of 1,000). */
const BAD = 0.1;

/**
 * One run's figures: the chance (OneAnswer), the bad case — the worst 1 in 10 of the futures, read from the per-future fail
 * year the test keeps (futuresMc.failYear), else from the 1-in-10 wealth line — as the age and tax year it first runs short,
 * or lasting to the plan's end — its age as both apps say it ("to 97" = to the 97th birthday, rules.js planToAgeOf).
 */
export function figuresOf(r, p) {
  const startAge = Math.round(num(p && p.startAge));
  const N = Math.max(1, Math.round(num(p && p.durationYears)));
  const firstTY = Math.round(num(p && (p.runFirstTaxYear || p.firstTaxYear)));
  const endAge = startAge + N;
  const a = oneAnswer(r, p);
  if (!a) return { affordable: false, share: 0, chancePct: 0, badCase: { lasts: false, age: startAge, year: firstTY || null }, endAge };
  let failY = null;
  const fy = r.futuresMc && Array.isArray(r.futuresMc.failYear) && r.futuresMc.failYear.length > 1 ? r.futuresMc.failYear : null;
  if (fy) {
    const sorted = fy.map((v) => (v == null ? Infinity : +v)).sort((x, y) => x - y);
    const v = sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * BAD))];
    failY = Number.isFinite(v) ? v : null;
  } else if (a.share < 1 - BAD && r.cones && r.cones.wealth && Array.isArray(r.cones.wealth.p10)) {
    const k = r.cones.wealth.p10.findIndex((v, y) => y < N && !(v > 1));
    failY = k >= 0 ? k : null;
  }
  return { affordable: true, share: a.share, chancePct: a.chancePct, badCase: failY == null ? { lasts: true, age: endAge, year: null } : { lasts: false, age: startAge + failY, year: firstTY ? firstTY + failY : null }, endAge };
}

/**
 * A ladder's years as held, on the test's futures: each year's gap paid from the money counted toward it (the money expected
 * first as it arrives, then what holds its value, then the shares), a future failing in the first year it cannot pay.
 * @returns {{ share, fail: number[] (tax years, one per failed future) }}
 */
export function ladderWalk(G, { futures = FUTURES, chargesPct = 0 } = {}) {
  const years = [];
  for (let Y = G.firstYear; Y <= G.lastYear; Y++) years.push(Y);
  const gapOf = (Y) => num(G.gaps[Y]);
  if (!years.some((Y) => gapOf(Y) > 0)) return { share: 1, fail: [], futures: 1 };
  const c = monthlyChargeFactor(chargesPct);
  const walk = (series) => {
    // money that arrived before the first year is waiting by then (ladderGapsOf folds it in; a walk given it otherwise still counts it)
    let flat = num(G.fund.flat) + Object.entries(G.arrivals || {}).filter(([Y]) => +Y < G.firstYear).reduce((t, [, v]) => t + num(v), 0), shares = num(G.fund.shares);
    for (let k = 0; k < years.length; k++) {
      const Y = years[k];
      flat += num(G.arrivals[Y]);
      let d = gapOf(Y);
      const a = Math.min(flat, d); flat -= a; d -= a;
      const b = Math.min(shares, d); shares -= b; d -= b;
      if (d > 1) return Y;
      if (series && shares > 0) for (let m = 12 * k; m < 12 * (k + 1) && m + 1 < series.length; m++) { shares *= series[m + 1] / series[m]; if (c !== 1) shares *= c; }
    }
    return null;
  };
  // money that never moves (nothing in shares) gives one answer in every future
  if (!(num(G.fund.shares) > 0)) { const Y = walk(null); return { share: Y == null ? 1 : 0, fail: Y == null ? [] : [Y], futures: 1, deterministic: true }; }
  const months = (years.length + 1) * 12;
  const fail = [];
  let lasted = 0;
  for (let i = 0; i < futures; i++) {
    const Y = walk(bootstrapPaths(i * 7919 + 3, months + 1, 60).rtr);
    if (Y == null) lasted++; else fail.push(Y);
  }
  return { share: lasted / futures, fail, futures };
}

/** A ladder walk's figures beside the document's: the chance no better than the document's, the bad case the earlier of the two. */
function ladderFigures(W, locked, { startAge, firstTY, endAge }) {
  const n = W.futures;
  const failsSorted = W.fail.slice().sort((a, b) => a - b);
  // the worst 1 in 10 of the futures, as the one test reads it
  const idx = Math.floor(n * BAD);
  const failYear = W.deterministic ? (W.fail.length ? W.fail[0] : null) : (idx < failsSorted.length ? failsSorted[idx] : null);
  const share = Math.min(W.share, locked ? locked.share : 1);
  let badCase = failYear == null ? { lasts: true, age: endAge, year: null } : { lasts: false, age: startAge + (failYear - firstTY), year: failYear };
  if (locked && locked.badCase && !locked.badCase.lasts && (badCase.lasts || num(locked.badCase.age) < num(badCase.age))) badCase = { ...locked.badCase };
  return { affordable: true, share, chancePct: Math.round(share * 1000) / 10, badCase, endAge };
}

/**
 * @param {object} plan   a saved plan, brought up to date in memory
 * @param {{ today: string, onProgress?: Function }} o
 */
export function runKeepRetest(plan, { today, onProgress = null } = {}) {
  const now = dateOf(today);
  const tell = (done, total) => { if (typeof onProgress === 'function') onProgress(done, total); };
  const rec = normaliseHoldings(plan && plan.holdings);
  const fingerprint = keepFingerprint(rec);
  const settings = effectiveStressSettings(plan, { now });
  const strategyId = settings.strategyId || 'pots-and-valves';
  const doc = isLocked(plan) && isObj(plan.planDocument) ? plan.planDocument : null;
  const kept = keptAssetsOf(rec);
  const mine = kept.filter((k) => k.as === 'mine');
  const anySingle = mine.some((k) => k.single);
  const hasExpected = expectedOf(rec).length > 0;
  const base = { fingerprint, recordKey: holdingsKeyOf(rec), strategyId, engineVersion: ENGINE_VERSION, kept };
  const ladder = doc && documentLadder(doc, strategyId) && doc.strategy.p ? doc : null;
  let runs = 0;
  if (ladder) {
    const p = doc.strategy.p, r = doc.strategy.r;
    const asLocked = figuresOf(r, p);
    const startAge = Math.round(num(p.startAge));
    const firstTY = Math.round(num(p.runFirstTaxYear || p.firstTaxYear));
    const at = { startAge, firstTY, endAge: asLocked.endAge };
    const chargesPct = num(p.chargesPct);
    const steps = 1 + (hasExpected ? 1 : 0) + (mine.length ? 1 : 0) + (anySingle ? 1 : 0);
    let done = 0;
    tell(done, steps);
    const one = (o) => { const G = ladderGapsOf(plan, { today, ...o }); const W = ladderWalk(G, { chargesPct }); runs += 1; tell(++done, steps); return { G, f: ladderFigures(W, asLocked, at) }; };
    const held = one({ withExpected: true });
    const without = hasExpected ? one({ withExpected: false }).f : null;
    const half = mine.length ? one({ withExpected: true, shock: 'half' }).f : null;
    const nothing = anySingle ? one({ withExpected: true, shock: 'nothing' }).f : null;
    return plain({ ...base, ladder: true, asLocked, asHeld: held.f, withoutExpected: without,
      shock: mine.length ? { half, nothing, counted: mine.some((k) => k.counted) } : null,
      firstShort: held.G.firstShort, runs, basis: { today, engine: 'one-test' } });
  }
  // every other plan: the one test on the locked settings and on those settings as held. What is kept by choice and counted
  // toward the plan is in the plan's money in whichever wrapper it sits (heldSettingsOf: the pension's pots, the ISA's or the
  // taxable account's balance), so a fall in it is tested wherever it is
  const counted = mine.some((k) => k.counted && k.value > 0);
  const steps = 2 + (hasExpected ? 1 : 0) + (mine.length && counted ? 1 : 0) + (anySingle && counted ? 1 : 0);
  let done = 0;
  tell(done, steps);
  const one = (s) => { const p = planFor(s, now); const r = stressTestStrategy(strategyId, p); runs += 1; tell(++done, steps); return figuresOf(r, p); };
  const asLocked = one(settings);
  const asHeld = one(heldSettingsOf(settings, rec, { withExpected: true, now }));
  const withoutExpected = hasExpected ? one(heldSettingsOf(settings, rec, { withExpected: false, now })) : null;
  // a shock to what is kept by choice changes what the plan pays only when it is counted toward the plan
  const half = mine.length ? (counted ? one(heldSettingsOf(settings, rec, { withExpected: true, shock: 'half', now })) : asHeld) : null;
  const nothing = anySingle ? (counted ? one(heldSettingsOf(settings, rec, { withExpected: true, shock: 'nothing', now })) : asHeld) : null;
  return plain({ ...base, ladder: false, asLocked, asHeld, withoutExpected, shock: mine.length ? { half, nothing, counted } : null, firstShort: null, runs, basis: { today, engine: 'one-test' } });
}
