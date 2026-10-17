/**
 * The one "will it last" test of a saved plan, run for "Does it last?" (research/v7/editing-in-v7.md 10.1, 10.4) — the
 * planner's own run, line for line (index.html strategyPlanFor + oneTestFor, 6.24.0): the effective settings its loader
 * reads, the engine config, the plan every strategy is judged on, stressTestStrategy on the plan's own strategy, then the
 * figures every planner screen reads through OneAnswer.js. Nothing is reimplemented here.
 *
 * Loaded LAZILY (a dynamic import in effects/answerWorker.js, and on the page only when no worker can start): this file
 * is the one door from V7 to the strategy registry, the nine strategies, the market history and the gilt data, so the
 * shell and the worker's own chunk never carry them (tests/v7/boundaries.test.js).
 *
 *   runLasts(plan, { today, onProgress }) → {
 *     strategyId, ran: { family, cutsOn, cutPct, months }, priced: 'bundled' | null,
 *     a: OneAnswer.oneAnswer(r, p) or null (not affordable), reason,
 *     history: { worst: OneAnswer.worstStarts(…), named: NamedStarts.namedStartRows(…) },
 *     stored: { a, note } | null      a locked plan: the document's figure and the one line of 6.24.0 when today's differs
 *   }
 *
 * Plain data in, plain data out (the plan after the in-memory upgrade; the result through cloneSafe in the worker). No
 * live gilt or share prices are loaded: a ladder is priced on the bundled curve (10.1). Pure but for the engine's own
 * deterministic futures; the date arrives as `today`.
 */
import { effectiveStressSettings } from '../../services/PlanReading.js';
import { simulationConfigFromSettings } from '../../services/SimulationConfig.js';
import { planFromSettings, stressTestStrategy } from '../../strategies/stressTest.js';
import { realYieldForYear } from '../../services/LinkerUniverse.js';
import { oneAnswer, worstStarts, earlierTestNote } from '../../services/OneAnswer.js';
import { namedStartRows } from '../../services/NamedStarts.js';
import { documentLadder } from '../../services/LadderPosition.js';
import { dateOf } from './dates.js';
import { FAMILY } from './lasts.js';

const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const isLocked = (plan) => !!(plan && plan.decisionTool && plan.decisionTool.settings && plan.decisionTool.settings.locked);
const plain = (v) => JSON.parse(JSON.stringify(v, (k, x) => (typeof x === 'function' ? undefined : (typeof x === 'number' && !Number.isFinite(x)) ? null : x)));

/** index.html strategyPlanFor: the plan every screen runs, built from the settings the planner's loader reads. */
export function planFor(settings, now) {
  return planFromSettings(settings, simulationConfigFromSettings({}, settings), { yieldForYear: realYieldForYear, startAge: +settings.shapeAgeNow || 57, now });
}

/**
 * @param {object} plan   a saved plan, brought up to date in memory (scenarioMigration.upgradeScenario)
 * @param {{ today: string, onProgress?: (done: number, total: number) => void }} o
 */
export function runLasts(plan, { today, onProgress = null } = {}) {
  const now = dateOf(today);
  const tell = (done, total) => { if (typeof onProgress === 'function') onProgress(done, total); };
  const settings = effectiveStressSettings(plan, { now });
  const strategyId = settings.strategyId || 'pots-and-valves';
  const family = FAMILY.includes(strategyId);
  const locked = isLocked(plan);
  const doc = locked && isObj(plan.planDocument) ? plan.planDocument : null;
  const storedR = doc && doc.strategy && isObj(doc.strategy.r) ? doc.strategy.r : null;
  let p, r;
  // a locked gilt ladder is the document's own (6.13.5, index.html oneTestFor): never re-priced
  const ladder = doc && documentLadder(doc, strategyId);
  tell(0, 2);
  if (ladder && doc.strategy.p) {
    p = doc.strategy.p; r = storedR;
  } else {
    p = planFor(settings, now);
    r = stressTestStrategy(strategyId, p);
  }
  tell(1, 2);
  const a = oneAnswer(r, p);
  const history = a
    ? { worst: worstStarts(r.histWindows, 5), named: namedStartRows(strategyId, p) }
    : { worst: [], named: [] };
  const stored = storedR && doc.strategy.id === strategyId ? { a: oneAnswer(storedR, doc.strategy.p || {}), note: earlierTestNote(storedR, r) } : null;
  const cfg = (p && p.pnvCfg) || {};
  return plain({
    strategyId,
    ran: { family, cutsOn: family && !cfg.disableProtection, cutPct: Math.round((1 - (cfg.protectionMult ?? 0.8)) * 100), months: cfg.consecutiveLimit ?? 3 },
    priced: !family && !(ladder && doc.strategy.p) ? 'bundled' : null,
    a, reason: a ? null : (r && r.reason) || null,
    history,
    stored,
    basis: { today, engine: 'one-test' }
  });
}
