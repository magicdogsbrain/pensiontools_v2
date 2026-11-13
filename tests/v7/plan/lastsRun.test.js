/**
 * L2 (research/v7/editing-in-v7.md 10.6): the worker's run is the planner's, to the pound. For every corpus plan,
 * runLasts(plan, { today }) — what the V7 worker runs — gives the figures oneAnswer gives on stressTestStrategy over the
 * plan built as index.html strategyPlanFor builds it (the repository's createSimulationConfigFromSettings, planFromSettings
 * with the real-yield curve, the same clock). A locked plan: the document's figure read back and today's test beside it,
 * the note '' when they agree. The result is plain data and crosses a worker boundary. Full runs: about half a second a
 * plan on the reference machine. The check itself is _l2.js's, which a plan kept locally runs too (localIdentity.local.test.js).
 */
import { describe, it, expect } from 'vitest';
import { runLasts, planFor, runForDocument, savingPathFor, documentAccumulationOf, documentHoldingsOf, documentSuccessOf } from '../../../src/answers/plan/lastsRun.js';
import { buildPlanDocument, trimPlan, trimResult } from '../../../src/services/PlanDocument.js';
import { savingPathForLock } from '../../../src/ui/savingPathForLock.js';
import { lockPatch, LOCKED_BY } from '../../../src/answers/plan/lock.js';
import { effectiveStressSettings } from '../../../src/services/PlanReading.js';
import { createSimulationConfigFromSettings } from '../../../src/storage/StressRepository.js';
import { planFromSettings, stressTestStrategy } from '../../../src/strategies/stressTest.js';
import { realYieldForYear } from '../../../src/services/LinkerUniverse.js';
import { oneAnswer } from '../../../src/services/OneAnswer.js';
import { corpus, entryOf, TODAY, noon } from './_plans.js';
import { isLocked, expectLastsAsPlanner } from './_l2.js';

const C = corpus();
const now = noon(TODAY);

describe('L2 — the one test in the preview equals the planner\'s, to the pound', { timeout: 120_000 }, () => {
  for (const [name, raw] of Object.entries(C)) {
    it(`${name}${isLocked(raw) ? ' (locked)' : ''}`, () => {
      expectLastsAsPlanner(entryOf(raw).plan, { today: TODAY });
    });
  }
  it('planFor is index.html strategyPlanFor: the same plan object, field for field, but the clock and the pricing function', () => {
    const plan = entryOf(C['12-lumpy-db-gia']).plan;
    const s = effectiveStressSettings(plan, { now });
    const mine = planFor(s, now);
    const theirs = planFromSettings(s, createSimulationConfigFromSettings({}, s), { yieldForYear: realYieldForYear, startAge: +s.shapeAgeNow || 57, now });
    const plain = (p) => JSON.parse(JSON.stringify(p, (k, v) => (typeof v === 'function' ? undefined : v)));
    expect(plain(mine)).toEqual(plain(theirs));
  });
  it('the result for a changed cut dial differs from the saved plan\'s, so a save is followed by a run that means something', () => {
    const plan = entryOf(C['02-pnv-draft']).plan;
    const changed = JSON.parse(JSON.stringify(plan));
    changed.stressTool.settings.protectionMult = 0.7;
    changed.stressTool.settings.consecutiveLimit = 4;
    const a = runLasts(plan, { today: TODAY }).a, b = runLasts(changed, { today: TODAY }).a;
    expect([a.chancePct, a.typicalLeft, a.cuts && a.cuts.typicalCutPerYear]).not.toEqual([b.chancePct, b.typicalLeft, b.cuts && b.cuts.typicalCutPerYear]);
  });
});


/**
 * "Lock the plan" (research/v7/road-to-7.md step 6): the document the preview writes equals the planner's buildPlanDocument on
 * the same plan — index.html buildPlanDocumentNow's run (strategyPlanFor with the budget's essentials, stressTestStrategy live,
 * savingPathForLock) built with the same clock — to the byte, trimPlan and trimResult applied the same way.
 */
describe('the document\'s run in the preview equals the planner\'s document, to the byte', { timeout: 180_000 }, () => {
  async function plannerDocument(plan, { essentials = 0, budgetGross = 0, lockedAt, lockedBy }) {
    const s = effectiveStressSettings(plan, { now });
    const sid = s.strategyId || 'pots-and-valves';
    const ess = essentials > 0 ? essentials : undefined;
    // index.html strategyPlanFor(settings, essentialsOverride) + stressTestStrategy, the same clock
    // the config on the same clock: the planner's runs it at the moment of the lock, which a draft seen from today (18's successor,
    // 6.56.0: its year 0 behind it) reads for where in the year its pots are
    const p = planFromSettings(s, createSimulationConfigFromSettings({}, s, now), { yieldForYear: realYieldForYear, essentialsAnnual: ess, startAge: +s.shapeAgeNow || 57, now });
    const r = stressTestStrategy(sid, p);
    const accumulation = (plan.accumulationTool && plan.accumulationTool.settings) || {};
    const savingPath = await savingPathForLock({ settings: s, accumulation, holdings: documentHoldingsOf(plan), now });
    // (7.8.0: the definition it is tested under, as index.html works it out from the live result: documentSuccessOf)
    const success = documentSuccessOf(plan, { settings: s, strategyId: sid, p, r, now, essentials: ess });
    return buildPlanDocument({ planName: plan.planDetails.name || 'My plan', holdings: documentHoldingsOf(plan), settings: s, p, r, lockedAt, lockedBy, budgetGross, essentials, journey: plan.journey || [], accumulation, now, savingPath, success });
  }
  for (const [name, raw] of Object.entries(C)) {
    if (isLocked(raw)) continue;
    it(`${name}: lockPatch's document is the planner's`, async () => {
      const plan = entryOf(raw).plan;
      const run = runForDocument(plan, { today: TODAY });
      expect(JSON.parse(JSON.stringify(run))).toEqual(run);
      expect(run.p).toEqual(trimPlan(run.p));
      expect(run.r).toEqual(trimResult(run.r));
      const P = lockPatch(plan, { now, run, entries: [{ plan }] });
      const theirs = await plannerDocument(plan, { lockedAt: P.lockedAt, lockedBy: LOCKED_BY });
      expect(P.patch.planDocument).toEqual(theirs);
      expect(JSON.stringify(P.patch.planDocument)).toBe(JSON.stringify(theirs));
    });
  }
  it('with the budget\'s essentials (a plan with a budget line): the plan is built with them, as strategyPlanFor builds it for the document and not for the one test', async () => {
    const plan = entryOf(C['02-pnv-draft']).plan;
    const withBudget = JSON.parse(JSON.stringify(plan));
    withBudget.budgetTool.settings = { ...withBudget.budgetTool.settings, lines: [{ id: 'l1', heading: 'Home', label: 'Rent', annual: 30000, tier: 'essential' }] };
    const P = lockPatch(withBudget, { now, run: runForDocument(withBudget, { today: TODAY, essentials: 34358 }), entries: [{ plan: withBudget }] });
    const theirs = await plannerDocument(withBudget, { essentials: 34358, budgetGross: 34358, lockedAt: P.lockedAt, lockedBy: LOCKED_BY });
    // the plan's essentials line reaches p (planFromSettings essentialsAnnual) and the layers
    expect(P.patch.planDocument.strategy.p.essentialsAnnual).toBe(34358);
    expect(P.patch.planDocument.layers.essentials).toBe(34358);
    expect(P.patch.planDocument.strategy).toEqual(theirs.strategy);
    const one = runLasts(withBudget, { today: TODAY });
    expect(one.a).toBeTruthy();
  });
  it('a saver\'s run carries the saving path the planner draws (10), none for a plan already retired (02)', () => {
    const saver = entryOf(C['10-couple-b']).plan;
    const run = runForDocument(saver, { today: TODAY });
    expect(run.savingPath).toBeTruthy();
    expect(run.savingPath.version).toBe(3);
    expect(savingPathFor({ settings: effectiveStressSettings(saver, { now }), accumulation: documentAccumulationOf(saver), holdings: documentHoldingsOf(saver), now })).toEqual(run.savingPath);
    expect('savingPath' in runForDocument(entryOf(C['02-pnv-draft']).plan, { today: TODAY })).toBe(false);
  });
});
