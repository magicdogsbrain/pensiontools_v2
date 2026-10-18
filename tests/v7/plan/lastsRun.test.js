/**
 * L2 (research/v7/editing-in-v7.md 10.6): the worker's run is the planner's, to the pound. For every corpus plan,
 * runLasts(plan, { today }) — what the V7 worker runs — gives the figures oneAnswer gives on stressTestStrategy over the
 * plan built as index.html strategyPlanFor builds it (the repository's createSimulationConfigFromSettings, planFromSettings
 * with the real-yield curve, the same clock). A locked plan: the document's figure read back and today's test beside it,
 * the note '' when they agree. The result is plain data and crosses a worker boundary. Full runs: about half a second a
 * plan on the reference machine.
 */
import { describe, it, expect } from 'vitest';
import { runLasts, planFor } from '../../../src/answers/plan/lastsRun.js';
import { effectiveStressSettings } from '../../../src/services/PlanReading.js';
import { createSimulationConfigFromSettings } from '../../../src/storage/StressRepository.js';
import { planFromSettings, stressTestStrategy } from '../../../src/strategies/stressTest.js';
import { realYieldForYear } from '../../../src/services/LinkerUniverse.js';
import { oneAnswer, worstStarts, earlierTestNote } from '../../../src/services/OneAnswer.js';
import { namedStartRows } from '../../../src/services/NamedStarts.js';
import { corpus, entryOf, TODAY, noon } from './_plans.js';

const C = corpus();
const isLocked = (p) => !!(p.decisionTool && p.decisionTool.settings && p.decisionTool.settings.locked);
const now = noon(TODAY);

/** index.html strategyPlanFor + oneTestFor, as tests/oneAnswer.slow.test.js has them: the plan every planner screen runs. */
function plannerRun(plan) {
  const s = effectiveStressSettings(plan, { now });
  const sid = s.strategyId || 'pots-and-valves';
  const p = planFromSettings(s, createSimulationConfigFromSettings({}, s), { yieldForYear: realYieldForYear, startAge: +s.shapeAgeNow || 57, now });
  const r = stressTestStrategy(sid, p);
  return { sid, p, r, a: oneAnswer(r, p) };
}

describe('L2 — the one test in the preview equals the planner\'s, to the pound', { timeout: 120_000 }, () => {
  for (const [name, raw] of Object.entries(C)) {
    it(`${name}${isLocked(raw) ? ' (locked)' : ''}`, () => {
      const plan = entryOf(raw).plan;
      const progress = [];
      const t0 = performance.now();
      const out = runLasts(plan, { today: TODAY, onProgress: (d, t) => progress.push([d, t]) });
      const ms = performance.now() - t0;
      expect(progress).toEqual([[0, 2], [1, 2]]);
      expect(ms, 'a run takes well under five seconds here').toBeLessThan(5000);
      // plain data: it survives JSON and a worker boundary
      expect(JSON.parse(JSON.stringify(out))).toEqual(out);
      expect(() => structuredClone(out)).not.toThrow();
      const ref = plannerRun(plan);
      expect(out.strategyId).toBe(ref.sid);
      const ladderLocked = isLocked(plan) && plan.planDocument && plan.planDocument.strategy && plan.planDocument.strategy.r && plan.planDocument.strategy.r.plan && Array.isArray(plan.planDocument.strategy.r.plan.years);
      if (ladderLocked) {
        // a locked gilt ladder is the document's own, never re-priced (index.html oneTestFor): the figure is the document's
        const doc = oneAnswer(plan.planDocument.strategy.r, plan.planDocument.strategy.p);
        expect(out.a.chancePct).toBe(doc.chancePct);
        expect(out.a.typicalLeft).toBe(doc.typicalLeft);
        expect(out.stored.note).toBe('');
        return;
      }
      if (!ref.a) { expect(out.a).toBe(null); expect(out.reason).toBe(ref.r.reason || null); return; }
      const a = out.a;
      expect(a.chancePct).toBeCloseTo(ref.a.chancePct, 9);
      expect(a.share).toBeCloseTo(ref.a.share, 12);
      expect(a.outOfTen).toEqual(ref.a.outOfTen);
      expect(Math.round(a.typicalLeft)).toBe(Math.round(ref.a.typicalLeft));
      expect(Math.round(a.badCaseLeft)).toBe(Math.round(ref.a.badCaseLeft));
      expect(Math.round(a.goodCaseLeft)).toBe(Math.round(ref.a.goodCaseLeft));
      expect(a.futures).toBe(ref.a.futures);
      expect(a.histories).toBe(ref.a.histories);
      expect(a.histRanOutN).toBe(ref.a.histRanOutN);
      expect(a.years).toBe(ref.a.years);
      expect(a.cuts).toEqual(ref.a.cuts);
      expect(Math.round(a.worst12)).toBe(Math.round(ref.a.worst12));
      // the history: the same worst starts and named starts the planner's History tab reads from the same run
      expect(out.history.worst.map((w) => [w.year, w.month, !!w.failed, Math.round(w.terminal || 0)])).toEqual(worstStarts(ref.r.histWindows, 5).map((w) => [w.year, w.month, !!w.failed, Math.round(w.terminal || 0)]));
      expect(out.history.named.map((x) => [x.year, x.kind, !!x.available, !!x.failed, Math.round(x.terminal || 0)])).toEqual(namedStartRows(ref.sid, ref.p).map((x) => [x.year, x.kind, !!x.available, !!x.failed, Math.round(x.terminal || 0)]));
      // the cuts setting the run used, in the words' slots
      const cfg = ref.p.pnvCfg || {};
      expect(out.ran).toEqual({ family: ['pots-and-valves', 'buckets-in-order'].includes(ref.sid), cutsOn: ['pots-and-valves', 'buckets-in-order'].includes(ref.sid) && !cfg.disableProtection, cutPct: Math.round((1 - (cfg.protectionMult ?? 0.8)) * 100), months: cfg.consecutiveLimit ?? 3 });
      // a locked plan with a document: the document's figure and the one line of 6.24.0
      if (isLocked(plan) && plan.planDocument && plan.planDocument.strategy && plan.planDocument.strategy.r) {
        expect(out.stored.a.chancePct).toBe(oneAnswer(plan.planDocument.strategy.r, plan.planDocument.strategy.p).chancePct);
        expect(out.stored.note).toBe(earlierTestNote(plan.planDocument.strategy.r, ref.r));
      } else expect(out.stored).toBe(null);
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
