/**
 * "What if I keep what I hold?" (research/v7/holdings-and-move.md §3.3; road-to-7.md step 10): ONE run of the one test on
 * a copy of the plan with the pension's mix AS HELD — the proportions of the record's pension lines on the same pot, the
 * way of drawing and everything else unchanged (move.js heldMixSettings). Nothing is reimplemented: the plan is lastsRun.js
 * planFor's (the bundled yield curve), the run stressTestStrategy's, the figures OneAnswer's. Nothing is written.
 *
 * Loaded LAZILY, like lastsRun.js and mixRun.js (a dynamic import in effects/answerWorker.js, the worker's alone): this file
 * is a door from V7 to the strategies, so the shell and the plan pages' chunk never carry them.
 *
 *   runHeld(plan, { today, onProgress }) → {
 *     affordable, a: { share, chancePct, typicalLeft, badCaseLeft, years, lasts } | null, reason,
 *     held: { pcts: { shares, bonds, diversifiers, cash }, pot, fromPension } | null,
 *     basis: { today, engine: 'one-test', runs: 1 }
 *   }
 *
 * Plain data in, plain data out; no live gilt or share prices; the date arrives as `today`.
 */
import { stressTestStrategy } from '../../strategies/stressTest.js';
import { oneAnswer } from '../../services/OneAnswer.js';
import { planFor, pickFigures } from './lastsRun.js';
import { heldMixSettings } from './move.js';
import { dateOf } from './dates.js';

const plain = (v) => JSON.parse(JSON.stringify(v, (k, x) => (typeof x === 'function' ? undefined : (typeof x === 'number' && !Number.isFinite(x)) ? null : x)));

/**
 * @param {object} plan   a saved plan, brought up to date in memory
 * @param {{ today: string, onProgress?: Function }} o
 */
export function runHeld(plan, { today, onProgress = null } = {}) {
  const now = dateOf(today);
  const tell = (done, total) => { if (typeof onProgress === 'function') onProgress(done, total); };
  const held = heldMixSettings(plan, { today });
  tell(0, 1);
  if (!held) return plain({ affordable: false, a: null, reason: 'nothingRecorded', held: null, basis: { today, engine: 'one-test', runs: 0 } });
  const settings = held.settings;
  const sid = settings.strategyId || 'pots-and-valves';
  const p = planFor(settings, now);
  const r = stressTestStrategy(sid, p);
  const a = pickFigures(oneAnswer(r, p));
  tell(1, 1);
  return plain({ affordable: !!a, a, reason: a ? null : (r && r.reason) || null, held: { pcts: held.pcts, pot: held.pot, fromPension: held.fromPension }, basis: { today, engine: 'one-test', runs: 1 } });
}
