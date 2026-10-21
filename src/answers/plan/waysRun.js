/**
 * "How the money is taken" (research/v7/way-and-mix.md 1, 2; road-to-7.md step 8a): the nine ways of drawing, each through
 * the one test on THIS plan — the planner's Overview run, line for line (index.html cmpRun: strategyPlanFor, then
 * compareRunner.compareAll over STRATEGY_NAMES in order, the configs derived once so every way reads the ACTIVE way's
 * parameter bag) — and one way tried on its own dials (index.html specStrategyPageHtml's what-if). Nothing is reimplemented:
 * the plan is lastsRun.js planFor's (the bundled yield curve), the runs are stressTestStrategy's, the figures OneAnswer's and
 * scoreStrategy's.
 *
 * Loaded LAZILY, like lastsRun.js (a dynamic import in effects/answerWorker.js, the worker's alone): this file is a door
 * from V7 to the strategies, so the shell and the plan pages' chunk never carry them (tests/v7/boundaries.test.js).
 *
 *   runWays(plan, { today, onProgress }) → {
 *     strategyId, priced: 'bundled', ways: [wayResult × 9 in WAY_IDS order], basis: { today, engine: 'one-test', runs: 9 }
 *   }
 *   runWay(plan, { today, id, dials, onProgress }) → the same wayResult for ONE way run on `dials` (dial units, way.js) over
 *     the way's restored params, the plan's cut dials set from them for the Pots & Valves family — "Tried in 1 run"
 *
 *   wayResult: { id, affordable, reason: { why: 'cost' | 'noGilt', cost, short } | null, a: oneAnswer or null,
 *                ruin: { mc, hist }, terminal: { p10, p50, p90 }, coverage, spentMedian, worst12, vol, vac, coverageRatio,
 *                cost, left, bought, dials: { defaults, ranWith } }
 *     `dials`: for each of the way's dials (schema.js WAY_DIALS) the ENGINE's default on this plan and the value the run
 *     read (the active bag's, else the default), in dial units — so the screen can say which values a figure is for.
 *
 * Plain data in, plain data out (the plan after the in-memory upgrade; the result through cloneSafe in the worker). No live
 * gilt or share prices: a ladder is priced on the bundled curve. Pure but for the engine's own deterministic futures; the
 * date arrives as `today`.
 */
import { effectiveStressSettings } from '../../services/PlanReading.js';
import { stressTestStrategy, scoreStrategy, STRATEGY_NAMES } from '../../strategies/stressTest.js';
import { deriveCompareConfigs, compareAll } from '../../strategies/compareRunner.js';
import { oneAnswer } from '../../services/OneAnswer.js';
import { restoredParamsFor, dialParams } from '../../services/PlanCommit.js';
import { planFor } from './lastsRun.js';
import { dateOf } from './dates.js';
import { WAY_IDS, WAY_DIALS } from './schema.js';
import { stratDialsOf, dialUnitsOf } from './way.js';

const plain = (v) => JSON.parse(JSON.stringify(v, (k, x) => (typeof x === 'function' ? undefined : (typeof x === 'number' && !Number.isFinite(x)) ? null : x)));
const num = (v) => (typeof v === 'number' && Number.isFinite(v) ? v : null);
const r0 = (v) => Math.round(+v || 0);

/** The money a bought way may spend (stressTest.js availablePot): the pension and the ISA, unless the ISA is held aside. */
const availablePot = (p) => (+p.pot || 0) + (p.isaHold ? 0 : (+p.isa || 0));

/**
 * The ENGINE's default of each dial on this plan (way-and-mix.md 2.3: what runs when the key is absent — compareRunner.js
 * deriveCompareConfigs, stressTest.js), in dial units. `cutsOf(p)`: the plan's own cut dials, the same for every way.
 */
export function dialDefaults(id, p) {
  const N = Math.max(1, Math.round(+p.durationYears || 0));
  const start = +p.startAge || 57;
  const spAge = (p.spStartYear != null && p.spStartYear > 0) ? start + p.spStartYear : start + Math.min(10, N - 1);
  const cfg = p.pnvCfg || {};
  const all = {
    protectionOn: 'yes', cutPct: 20, consecutiveLimit: 3,
    bucketBand: 10,
    ladderYears: Math.max(1, Math.min(Math.min(15, Math.floor(N / 2)), N - 1)),
    drawAnnual: r0(p.targetAnnual),
    triggerMode: 'band', bandThreshold: 1.2,
    bridgeAge: Math.max(start + 1, Math.min(spAge, start + N - 1)),
    cashYears: id === 'bridge-and-engine' ? 3 : 2,
    essentialsAnnual: r0((+p.targetAnnual || 0) * 0.55),
    horizonAge: start + N,
    sleeveRatePct: 4, ratchet: 'off', treatsRule: 'share',
    floorToAge: Math.max(start + 1, Math.min(80, start + N - 1)),
    bridgeCash: 0, spareGrowth: 'kept',
    rotateCutAge: Math.max(start + 1, Math.min(75, start + N - 2)),
    rotateTrigger: 30, rotateDisarmYears: 8
  };
  void cfg;
  const out = {};
  for (const d of WAY_DIALS[id] || []) out[d.key] = all[d.key];
  return out;
}

/** The plan's own cut dials, as the run reads them (p.pnvCfg: the engine's config), in dial units. */
export function cutsOf(p) {
  const cfg = (p && p.pnvCfg) || {};
  return { protectionOn: cfg.disableProtection ? 'no' : 'yes', cutPct: Math.round((1 - (cfg.protectionMult ?? 0.8)) * 100), consecutiveLimit: cfg.consecutiveLimit ?? 3 };
}

/** The value the comparison read for each of the way's dials: the active bag's (p.params, as planFromSettings copied it), else the default. */
export function ranWith(id, p, defaults) {
  const bag = (p && p.params) || {};
  const cuts = cutsOf(p);
  const out = {};
  for (const d of WAY_DIALS[id] || []) {
    if (d.cut) { out[d.key] = cuts[d.key]; continue; }
    const stored = d.key === 'sleeveRatePct' ? bag.sleeveRate : d.key === 'essentialsAnnual' ? p.essentialsAnnual : bag[d.key];
    const v = dialUnitsOf(d, stored);
    out[d.key] = v == null ? defaults[d.key] : v;
  }
  return out;
}

/** What a bought way costs today (index.html strategyOverviewHtml costOf), 0 for the Pots & Valves family. */
function costOf(r) {
  const sg = (r && r.signature) || {};
  switch (r && r.strategyId) {
    case 'full-il-gilt': case 'gilt-rotation': return num(sg.total) || 0;
    case 'bridge-and-engine': return num(sg.bridgeCost) || 0;
    case 'floor-the-schedule': case 'floor-to-age': case 'floor-and-flex': return num(sg.floorCost) || 0;
    case 'ladder-and-ratchet': return num(sg.baseLadderCost) || 0;
    default: return 0;
  }
}

/** Why a way cannot be bought: the cost the configs priced (or the ladder's own) against the pot, or no gilt long enough. */
function unaffordableReason(id, r, p, configs) {
  const c = configs || {};
  const cost = id === 'ladder-and-ratchet' ? c.baseLadderCost : id === 'floor-and-flex' ? c.ffFloorCost : id === 'floor-the-schedule' ? c.fsFloorCost : id === 'floor-to-age' ? c.faFloorCost : id === 'bridge-and-engine' ? c.beCost : (r && r.plan && num(r.plan.total));
  const pot = availablePot(p);
  if (num(cost) != null && cost > pot) return { why: 'cost', cost: r0(cost), short: r0(cost - pot) };
  return { why: 'noGilt', cost: num(cost) != null ? r0(cost) : null, short: null };
}

const BOUGHT = ['ladder-and-ratchet', 'bridge-and-engine', 'floor-and-flex', 'floor-the-schedule', 'floor-to-age', 'full-il-gilt', 'gilt-rotation'];

/** One way's result as plain data: the figures every planner screen reads (OneAnswer, scoreStrategy) and the cost line. */
export function wayResult(id, r, p, configs = null) {
  const defaults = dialDefaults(id, p);
  const dials = { defaults, ranWith: ranWith(id, p, defaults) };
  if (!r || !r.affordable) return { id, affordable: false, reason: unaffordableReason(id, r, p, configs), a: null, bought: BOUGHT.includes(id), dials };
  const a = oneAnswer(r, p);
  const sc = scoreStrategy(r, p);
  const cost = costOf(r);
  const bought = BOUGHT.includes(id);
  const spare = r.signature && num(r.signature.spare);
  const left = !bought ? null : (id === 'full-il-gilt' || id === 'gilt-rotation') && spare != null ? r0(spare) : r0(Math.max(0, availablePot(p) - cost));
  return {
    id, affordable: true, reason: null, a, bought,
    ruin: { mc: num(r.ruin && r.ruin.mc) ?? 0, hist: num(r.ruin && r.ruin.hist) ?? 0 },
    terminal: { p10: num(r.terminal && r.terminal.p10) ?? 0, p50: num(r.terminal && r.terminal.p50) ?? 0, p90: num(r.terminal && r.terminal.p90) ?? 0 },
    coverage: r.coverage == null ? null : num(r.coverage),
    spentMedian: r.spentMedian == null ? null : num(r.spentMedian),
    worst12: num(r.worst12 && r.worst12.min),
    vol: sc ? sc.vol : null, vac: sc ? sc.vac : null, coverageRatio: sc ? sc.coverageRatio : null,
    cost: bought ? r0(cost) : 0, left, ruinLabel: r.ruinLabel || null,
    dials
  };
}

/**
 * The nine ways on this plan (index.html cmpRun): the plan as the one test builds it, the configs once, every way in order.
 * @param {object} plan   a saved plan, brought up to date in memory
 * @param {{ today: string, onProgress?: (done: number, total: number) => void }} o
 */
export function runWays(plan, { today, onProgress = null } = {}) {
  const now = dateOf(today);
  const tell = (done, total) => { if (typeof onProgress === 'function') onProgress(done, total); };
  const settings = effectiveStressSettings(plan, { now });
  const strategyId = settings.strategyId || 'pots-and-valves';
  const p = planFor(settings, now);
  const ids = Object.keys(STRATEGY_NAMES);
  const all = compareAll(p, ids, { onProgress: (i, n) => tell(i, n) });
  tell(ids.length, ids.length);
  const ways = ids.map((id) => wayResult(id, all.strategies[id], p, all.configs));
  return plain({ strategyId, priced: 'bundled', ways, basis: { today, engine: 'one-test', runs: ids.length } });
}

/**
 * One way on its own dials (index.html specStrategyPageHtml: the what-if names its strategy and its params; the cut dials go
 * onto the Stress settings), over the way's restored params (restoredParamsFor). `dials` in dial units (way.js), checked.
 * @param {object} plan
 * @param {{ today: string, id: string, dials: object, onProgress?: Function }} o
 */
export function runWay(plan, { today, id, dials = {}, onProgress = null } = {}) {
  if (!WAY_IDS.includes(id)) throw new Error('runWay: no way called "' + id + '"');
  const now = dateOf(today);
  const tell = (done, total) => { if (typeof onProgress === 'function') onProgress(done, total); };
  const settings = effectiveStressSettings(plan, { now });
  const { params, patch } = dialParams(id, stratDialsOf(id, dials));
  const prm = { ...restoredParamsFor(settings, id), ...params };
  const over = { ...settings, strategyId: id, strategyParams: prm, ...patch };
  tell(0, 1);
  const p = planFor(over, now, prm.essentialsAnnual);
  const configs = deriveCompareConfigs(p);
  const r = stressTestStrategy(id, p, configs);
  tell(1, 1);
  return plain({ ...wayResult(id, r, p, configs), tried: true, basis: { today, engine: 'one-test', runs: 1 } });
}
