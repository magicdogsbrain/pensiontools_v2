/**
 * "The mix" runs (research/v7/way-and-mix.md 3.2b, 3.2d, 3.2e; road-to-7.md step 8b): the one test with the diversifiers
 * sleeve or the bond tent the other way ("What it does in a bad case"), and "Which mix lasts best?" — the eight cells of
 * compareRunner.compareMixes (the plan's own mix with the tent off and on, then the three levels with the tent off and on),
 * each through stressTestStrategy on the plan the one test builds. Nothing is reimplemented: the plan is lastsRun.js
 * planFor's (the bundled yield curve), the runs stressTestStrategy's, the figures OneAnswer's.
 *
 * Loaded LAZILY, like lastsRun.js and waysRun.js (a dynamic import in effects/answerWorker.js, the worker's alone): this
 * file is a door from V7 to the strategies, so the shell and the plan pages' chunk never carry them.
 *
 *   runMixTry(plan, { today, kind: 'sleeve'|'tent', base, onProgress }) → {
 *     kind, on (the try has the sleeve / the tent ON), affordable, a: { share, chancePct, typicalLeft, badCaseLeft, years },
 *     base: the plan's own figures (handed in from "Does it last?" when held, else run here: then `basis.runs` is 2),
 *     basis: { today, engine: 'one-test', runs }
 *   }
 *   runMixCompare(plan, { today, onProgress }) → {
 *     cells: [{ key, tent, affordable, share, chancePct, typicalLeft, badCaseLeft, amounts: { equity, bond, cash, div } } × 8],
 *     basis: { today, engine: 'one-test', runs: 8 }
 *   }
 *
 * Plain data in, plain data out; no live gilt or share prices; the date arrives as `today`.
 */
import { effectiveStressSettings } from '../../services/PlanReading.js';
import { stressTestStrategy } from '../../strategies/stressTest.js';
import { compareMixes } from '../../strategies/compareRunner.js';
import { oneAnswer } from '../../services/OneAnswer.js';
import { planFor, pickFigures } from './lastsRun.js';
import { sleeveOtherOf, tentOtherOf } from './mix.js';
import { dateOf } from './dates.js';

const plain = (v) => JSON.parse(JSON.stringify(v, (k, x) => (typeof x === 'function' ? undefined : (typeof x === 'number' && !Number.isFinite(x)) ? null : x)));
const r0 = (v) => Math.round(+v || 0);
export const MIX_TRY_KINDS = Object.freeze(['sleeve', 'tent']);

/** One run of the one test on some settings: the figures every screen reads, or null when the way cannot be bought. */
function one(settings, now) {
  const sid = settings.strategyId || 'pots-and-valves';
  const p = planFor(settings, now);
  const r = stressTestStrategy(sid, p);
  return pickFigures(oneAnswer(r, p));
}

/**
 * @param {object} plan   a saved plan, brought up to date in memory
 * @param {{ today: string, kind: 'sleeve'|'tent', base?: object|null, onProgress?: Function }} o
 */
export function runMixTry(plan, { today, kind, base = null, onProgress = null } = {}) {
  if (!MIX_TRY_KINDS.includes(kind)) throw new Error('runMixTry: no try called "' + kind + '"');
  const now = dateOf(today);
  const tell = (done, total) => { if (typeof onProgress === 'function') onProgress(done, total); };
  const settings = effectiveStressSettings(plan, { now });
  const other = kind === 'sleeve' ? sleeveOtherOf(settings) : tentOtherOf(settings);
  const on = kind === 'sleeve' ? r0(other.diversifierStart) > 0 : !!other.equityGlideEnabled;
  const needBase = !(base && typeof base === 'object' && typeof base.badCaseLeft === 'number');
  const total = needBase ? 2 : 1;
  let runs = 0;
  tell(0, total);
  const at = one(other, now); runs += 1;
  tell(runs, total);
  let own = needBase ? null : { share: +base.share, chancePct: +base.chancePct, typicalLeft: r0(base.typicalLeft), badCaseLeft: r0(base.badCaseLeft) };
  if (needBase) { own = one(settings, now); runs += 1; tell(runs, total); }
  return plain({ kind, on, affordable: !!at, a: at, base: own, basis: { today, engine: 'one-test', runs } });
}

/**
 * @param {object} plan
 * @param {{ today: string, onProgress?: Function }} o
 */
export function runMixCompare(plan, { today, onProgress = null } = {}) {
  const now = dateOf(today);
  const tell = (done, total) => { if (typeof onProgress === 'function') onProgress(done, total); };
  const settings = effectiveStressSettings(plan, { now });
  const out = compareMixes(settings, { own: true, planFor: (s) => planFor(s, now), onProgress: (i, n) => tell(i, n) });
  tell(out.length, out.length);
  const cells = out.map((c) => {
    const a = pickFigures(oneAnswer(c.r, c.p));
    const s = c.settings;
    return { key: c.key, tent: !!c.tent, affordable: !!a, share: a ? a.share : null, chancePct: a ? a.chancePct : null, typicalLeft: a ? a.typicalLeft : null, badCaseLeft: a ? a.badCaseLeft : null, amounts: { equity: r0(s.equityMin), bond: r0(s.bondMin), cash: r0(s.cashTarget), div: r0(s.diversifierStart) } };
  });
  return plain({ cells, basis: { today, engine: 'one-test', runs: cells.length } });
}
