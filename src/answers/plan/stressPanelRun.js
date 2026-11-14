/**
 * "Try the bad years" (7.9.0; the build spec's §1): one row, run. Loaded LAZILY, as lastsRun.js is (it is the engine's
 * door): the run is "Will it last?"'s own one test — the plan's effective settings, the row's settings, planFor, the row on
 * the plan (lastsRun.rowPlanOf: its shock to the futures, its lower returns, the real histories at one window),
 * stressTestStrategy, the run followed on to the weighting age with the same row (weightedOptsOf), oneAnswer — so As planned
 * is "Does it last?"'s answer on every figure the futures give. The held rows are the keep test's own inputs (keepTest.js
 * heldSettingsOf, ladderGapsOf; keepRun.js ladderWalk), imported, never changed. Nothing is written.
 *
 *   runStressRow(plan, { today, row }) → {
 *     id, key (stressPanel.stressKeyOf: the result is for this key only), runs,
 *     na: null | 'lockedLadder' | 'todaysPrices' | 'unaffordable' | 'notCounted',
 *     a: OneAnswer's figures for the row (weighted, sumW, n, fixedAge, share, chancePct, futures, planToAge, weightToAge,
 *        verdict, level, floor, left, typicalLeft, badCaseLeft, goodCaseLeft, coverage, cuts, failKind, reason, words) —
 *        never a figure of the real histories,
 *     shortfall: OneAnswer.planShortfallOf (when, how long, how much; a closed year on its own),
 *     ran: { family, cutsOn, cutPct, months }, closed?, basis: { today, strategyId }
 *   }
 * A locked ladder: As planned is its document's own figure (never priced again); the market rows are not tried; the held
 * rows walk its years as held (fixed-age only: its count, the bad case's ages).
 */
import { effectiveStressSettings } from '../../services/PlanReading.js';
import { stressTestStrategy } from '../../strategies/stressTest.js';
import { oneAnswer, planShortfallOf } from '../../services/OneAnswer.js';
import { normaliseHoldings } from '../../services/HoldingsRecord.js';
import { planToAgeOf } from '../../services/AgeConvention.js';
import { LEVEL_FAILS20 } from '../shared/rules.js';
import { planFor, rowPlanOf, weightedOptsOf, closedOf, weighing } from './lastsRun.js';
import { figuresOf, ladderWalk } from './keepRun.js';
import { heldSettingsOf, ladderGapsOf, keptAssetsOf } from './keepTest.js';
import { planLevelOf } from './life.js';
import { FAMILY } from './lasts.js';
import { ROW_IDS, MARKET_IDS, HELD_IDS, ROW_CHANGE, stressKeyOf, stressSpendOf, lockedLadderOf } from './stressPanel.js';
import { dateOf } from './dates.js';

const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const num = (v) => (Number.isFinite(+v) ? +v : 0);
const plain = (v) => JSON.parse(JSON.stringify(v, (k, x) => (typeof x === 'function' ? undefined : (typeof x === 'number' && !Number.isFinite(x)) ? null : x)));
const HISTORY = ['histories', 'histStrideMonths', 'histRanOutPct', 'histRanOutN', 'worst12'];

/** A row's figures: OneAnswer's, without a figure of the real histories (a row runs its futures only). */
function rowFigures(a) {
  if (!a) return null;
  const out = {};
  for (const [k, v] of Object.entries(a)) if (!HISTORY.includes(k)) out[k] = v;
  return out;
}

/**
 * @param {object} plan   a saved plan, brought up to date in memory
 * @param {{ today: string, row: string|{ id: string }, onProgress?: Function, weighted?: boolean }} o
 */
export function runStressRow(plan, { today, row, onProgress = null, weighted = undefined } = {}) {
  const id = typeof row === 'string' ? row : row && row.id;
  if (!ROW_IDS.includes(id)) throw new Error('runStressRow: no row called "' + id + '"');
  const now = dateOf(today);
  const tell = (done, total) => { if (typeof onProgress === 'function') onProgress(done, total); };
  const settings = effectiveStressSettings(plan, { now });
  const strategyId = settings.strategyId || 'pots-and-valves';
  const family = FAMILY.includes(strategyId);
  const weigh = weighing({ weighted });
  const key = stressKeyOf(plan, today);
  let runs = 0;
  const done = (o) => { tell(1, 1); return plain({ id, key, runs, na: null, ...o, basis: { today, strategyId } }); };
  const ran = (p) => {
    const cfg = (p && p.pnvCfg) || {};
    return { family, cutsOn: family && !cfg.disableProtection, cutPct: Math.round((1 - (cfg.protectionMult ?? 0.8)) * 100), months: cfg.consecutiveLimit ?? 3 };
  };
  tell(0, 1);
  const ladder = lockedLadderOf(plan, strategyId);
  if (MARKET_IDS.includes(id) && ladder) return done({ na: 'lockedLadder' });
  if (id === 'prices' && !family) return done({ na: 'todaysPrices' });
  const change = ROW_CHANGE[id];
  const doc = ladder ? plan.planDocument : null;

  // the one test on a copy of the settings, the row on it; weighing, the run followed on to the weighting age with the same row
  const one = (s, rowChange) => {
    const p = rowPlanOf(planFor(s, now), rowChange);
    const r = stressTestStrategy(strategyId, p);
    runs += 1;
    const a0 = oneAnswer(r, p);
    if (!a0) return { na: 'unaffordable' };
    let a = a0, opts = {};
    if (weigh) {
      const w = weightedOptsOf(plan, { settings: s, strategyId, p, r, now, row: rowChange });
      runs += w.runs;
      opts = w.opts;
      a = oneAnswer(r, p, w.opts);
    }
    const closed = closedOf(p);
    return { a: rowFigures(a), shortfall: planShortfallOf(r, p, a, opts), ran: ran(p), ...(closed ? { closed } : {}) };
  };

  if (HELD_IDS.includes(id)) {
    const rec = normaliseHoldings(plan && plan.holdings);
    const mine = keptAssetsOf(rec).filter((k) => k.as === 'mine');
    if (ladder) {
      if (change.held && !mine.some((k) => k.counted)) return done({ na: 'notCounted' });
      return done(heldLadder(plan, doc, { today, shock: change.held, level: planLevelOf(plan), count: () => { runs += 1; } }));
    }
    if (change.held && !mine.some((k) => k.counted && k.value > 0)) return done({ na: 'notCounted' });
    return done(one(heldSettingsOf(settings, rec, { withExpected: true, shock: change.held || null, now }), {}));
  }
  if (id === 'asPlanned' && ladder) {
    // a locked ladder is its document's own run (runLasts): never priced again; its weighted figure the one it was locked with
    const p = doc.strategy.p, r = doc.strategy.r;
    const a0 = oneAnswer(r, p);
    if (!a0) return done({ na: 'unaffordable' });
    let a = a0, opts = {};
    if (weigh) {
      const def = isObj(doc.assumptions) && isObj(doc.assumptions.success) ? doc.assumptions.success : null;
      const stored = { chance: def && isObj(def.weighted) && typeof def.weighted.chance === 'number' ? def.weighted.chance : null };
      const w = weightedOptsOf(plan, { settings, strategyId, p, r, now, stored });
      opts = w.opts;
      a = oneAnswer(r, p, w.opts);
    }
    return done({ a: rowFigures(a), shortfall: planShortfallOf(r, p, a, opts), ran: ran(p) });
  }
  const s = id === 'spend' ? stressSpendOf(settings, change.spend) : settings;
  return done(one(s, { shock: change.shock || null, returnDragPct: change.returnDragPct || 0 }));
}

/**
 * A locked ladder's years as held (the keep test's own walk: keepTest.ladderGapsOf, keepRun.ladderWalk, on the test's
 * futures): fixed-age only — the count no better than the document's, the bad case the earlier of the two (as the keep
 * test reads it), when it runs short. No weighted figure: the document holds none for what is held.
 */
function heldLadder(plan, doc, { today, shock, level, count }) {
  const p = doc.strategy.p, r = doc.strategy.r;
  const asLocked = figuresOf(r, p);
  const G = ladderGapsOf(plan, { today, withExpected: true, shock: shock || null });
  const W = ladderWalk(G, { chargesPct: num(p.chargesPct) });
  count();
  const n = Math.max(1, W.futures || 1);
  const share = Math.min(W.share, asLocked.share);
  const startAge = Math.round(num(p.startAge));
  const firstTY = Math.round(num(p.runFirstTaxYear || p.firstTaxYear));
  const toAge = planToAgeOf(startAge, num(p.durationYears));
  const fails = W.fail.slice().sort((x, y) => x - y);
  const idx = Math.floor(n / 10);
  const failY = W.deterministic ? (W.fail.length ? W.fail[0] : null) : (idx < fails.length ? fails[idx] : null);
  let worst = failY == null ? { lasts: true, age: toAge } : { lasts: false, age: startAge + (failY - firstTY) };
  if (asLocked.badCase && !asLocked.badCase.lasts && (worst.lasts || num(asLocked.badCase.age) < worst.age)) worst = { lasts: false, age: num(asLocked.badCase.age) };
  const failsN = Math.round((1 - share) * n);
  const t = LEVEL_FAILS20[level] ?? LEVEL_FAILS20.balanced;
  const verdict = failsN <= Math.floor((t * n) / 20) ? 'yes' : failsN <= Math.floor(((t + 1) * n) / 20) ? 'close' : 'no';
  const typicalY = fails.length ? fails[Math.floor((fails.length - 1) / 2)] : null;
  return {
    a: { strategyId: doc.strategy.id || null, share, chancePct: Math.round(share * 1000) / 10, futures: n, fixedAge: share, weighted: null, sumW: null, n: null,
      planToAge: toAge, level, verdict, lasts: verdict === 'yes', reason: 'stored', failKind: 'ran-out', floor: null, typicalLeft: null, badCaseLeft: null, goodCaseLeft: null, coverage: null, cuts: null },
    shortfall: fails.length || !worst.lasts ? { when: { typical: typicalY == null ? worst.age : startAge + (typicalY - firstTY), worst: worst.age, worstLasts: worst.lasts }, howLong: null, howMuch: null } : { when: null, howLong: null, howMuch: 1 },
    ran: { family: false, cutsOn: false, cutPct: 0, months: 0 },
    ladder: true
  };
}
