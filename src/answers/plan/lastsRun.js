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
 *   runForDocument(plan, { today, essentials, onProgress }) → { p, r, savingPath, basis }
 *     the run the plan document is built from on a lock, or on "Write a new version from today's settings" (6.38.0,
 *     research/v7/road-to-7.md step 6): index.html buildPlanDocumentNow's run, line for line — the same effective settings,
 *     the plan built WITH the budget's essentials (strategyPlanFor's second argument, index.html _shapeRefs), the strategy run
 *     live (never the document's own: a new version re-prices a ladder at today's bundled curve, as the planner's does at
 *     the day's prices), `p` and `r` trimmed as PlanDocument.buildPlanDocument trims them (trimPlan, trimResult: no samples,
 *     no per-future lists, no functions), and a saver's path drawn on the saving-years engine (src/ui/savingPathForLock.js:
 *     absent unless the plan stops later). The document itself is built on the page (answers/plan/lock.js) with these.
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
import { normaliseHoldings, emptyHoldings } from '../../services/HoldingsRecord.js';
import { trimPlan, trimResult } from '../../services/PlanDocument.js';
import { deriveTiming } from '../../services/PlanTiming.js';
import { buildSavingPath } from '../../services/SavingPath.js';
import { dateOf } from './dates.js';
import { FAMILY } from './lasts.js';

const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const isLocked = (plan) => !!(plan && plan.decisionTool && plan.decisionTool.settings && plan.decisionTool.settings.locked);
const plain = (v) => JSON.parse(JSON.stringify(v, (k, x) => (typeof x === 'function' ? undefined : (typeof x === 'number' && !Number.isFinite(x)) ? null : x)));

/**
 * index.html strategyPlanFor: the plan every screen runs, built from the settings the planner's loader reads. The one test
 * passes no essentials (oneTestFor: essentialsAnnual undefined); the plan document's run passes the budget's (buildPlanDocumentNow).
 */
export function planFor(settings, now, essentialsAnnual = undefined) {
  return planFromSettings(settings, simulationConfigFromSettings({}, settings), { yieldForYear: realYieldForYear, essentialsAnnual, startAge: +settings.shapeAgeNow || 57, now });
}

/** What the planner hands the document builder for the Accumulation tool (ScenarioRepository.getActiveAccumulation): its settings, {} for none. */
export const documentAccumulationOf = (plan) => (plan && plan.accumulationTool && plan.accumulationTool.settings) || {};
/** … and for what you hold (ScenarioRepository.getActiveHoldings): the record normalised, the empty record for none. */
export const documentHoldingsOf = (plan) => (plan && plan.holdings && typeof plan.holdings === 'object' ? normaliseHoldings(plan.holdings) : emptyHoldings());

/**
 * src/ui/savingPathForLock.js, without its lazy import: a saver's path on the saving-years engine, undefined for a plan that
 * is not stopping later (buildPlanDocument then draws the FCA path, as before 6.22.0).
 */
export function savingPathFor({ settings, accumulation = null, holdings = null, now }) {
  const timing = deriveTiming(settings || {}, now);
  if (timing.mode !== 'future' || !(timing.currentAge > 0)) return undefined;
  return buildSavingPath({ settings, timing, accumulation, holdings, now });
}

/**
 * The run a plan document is built from (index.html buildPlanDocumentNow): see the header.
 * @param {object} plan   a saved plan, brought up to date in memory
 * @param {{ today: string, essentials?: number, onProgress?: Function }} o   `essentials`: the budget's essentials a year
 *   before tax (lock.js shapeRefsOf), 0 or absent for none — the plan is then built as the one test builds it
 */
export function runForDocument(plan, { today, essentials = 0, onProgress = null } = {}) {
  const now = dateOf(today);
  const tell = (done, total) => { if (typeof onProgress === 'function') onProgress(done, total); };
  const settings = effectiveStressSettings(plan, { now });
  const strategyId = settings.strategyId || 'pots-and-valves';
  const ess = +essentials > 0 ? +essentials : undefined;
  tell(0, 2);
  const p = planFor(settings, now, ess);
  const r = stressTestStrategy(strategyId, p);
  tell(1, 2);
  // what the planner hands in (index.html buildPlanDocumentNow): the Accumulation tool's settings ({} for none) and the
  // holdings record normalised (ScenarioRepository.getActiveAccumulation, getActiveHoldings)
  const savingPath = savingPathFor({ settings, accumulation: documentAccumulationOf(plan), holdings: documentHoldingsOf(plan), now });
  return plain({ p: trimPlan(p), r: trimResult(r), savingPath, basis: { today, engine: 'one-test', essentials: ess || 0 } });
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
