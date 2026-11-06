/**
 * Gate 8a (research/v7/way-and-mix.md 1; road-to-7.md step 8): the nine cards equal the planner's ranking on the twelve
 * fixtures. On every unlocked corpus plan, runWays — what the V7 worker runs — gives, for each way, the same ruin.mc,
 * terminal, coverage and affordable as the planner's own loop: index.html cmpRun's strategyPlanFor (the repository's
 * createSimulationConfigFromSettings, planFromSettings with the real-yield curve, the same clock) followed by
 * compareRunner.compareAll over STRATEGY_NAMES — the same function, the same inputs, both sides priced on the bundled curve
 * (as tests/v7/plan/lastsRun.test.js L2 pins it: no live gilt data is loaded here). And the order of the cards equals the
 * planner's Overview order under the same "Rank by" (OneAnswer.rankWays on scoreStrategy's scores, the unaffordable last).
 * Slow in sum (about three seconds a plan a side); every figure to the pound.
 */
import { describe, it, expect } from 'vitest';
import { runWays, runWay } from '../../../src/answers/plan/waysRun.js';
import { rankedIds, wayOf, cardsOf } from '../../../src/answers/plan/way.js';
import { effectiveStressSettings } from '../../../src/services/PlanReading.js';
import { createSimulationConfigFromSettings } from '../../../src/storage/StressRepository.js';
import { planFromSettings, stressTestStrategy, scoreStrategy, STRATEGY_NAMES } from '../../../src/strategies/stressTest.js';
import { compareAll, deriveCompareConfigs } from '../../../src/strategies/compareRunner.js';
import { realYieldForYear } from '../../../src/services/LinkerUniverse.js';
import { rankWays, oneAnswer } from '../../../src/services/OneAnswer.js';
import { restoredParamsFor, dialParams } from '../../../src/services/PlanCommit.js';
import { RANK_BYS, WAY_IDS } from '../../../src/answers/plan/schema.js';
import { corpus, entryOf, TODAY, noon } from './_plans.js';

const C = corpus();
const isLocked = (p) => !!(p.decisionTool && p.decisionTool.settings && p.decisionTool.settings.locked);
const now = noon(TODAY);
const UNLOCKED = Object.entries(C).filter(([, raw]) => !isLocked(raw));

/** index.html cmpRun, inline: strategyPlanFor, then the one loop over the nine (compareAll), and the Overview's scoring. */
function plannerRun(plan) {
  const s = effectiveStressSettings(plan, { now });
  const p = planFromSettings(s, createSimulationConfigFromSettings({}, s), { yieldForYear: realYieldForYear, startAge: +s.shapeAgeNow || 57, now });
  const ids = Object.keys(STRATEGY_NAMES);
  const all = compareAll(p, ids);
  const S = all.strategies;
  const scored = ids.map((id) => ({ id, r: S[id], sc: S[id].affordable ? scoreStrategy(S[id], p) : null })).filter((x) => x.sc);
  const unaffordable = ids.filter((id) => !S[id].affordable);
  return { p, all, scored, unaffordable, ids };
}

describe('gate 8a — the nine ways in the preview equal the planner\'s ranking, on every unlocked fixture', { timeout: 600_000 }, () => {
  expect(UNLOCKED.length).toBeGreaterThanOrEqual(8);
  for (const [name, raw] of UNLOCKED) {
    it(`${name}: per way the same ruin, terminal, coverage and affordability; the cards in the Overview's order under every "Rank by"`, () => {
      const plan = entryOf(raw).plan;
      const progress = [];
      const out = runWays(plan, { today: TODAY, onProgress: (d, t) => progress.push([d, t]) });
      expect(progress).toEqual([...Array.from({ length: 9 }, (_, i) => [i, 9]), [9, 9]]);
      expect(JSON.parse(JSON.stringify(out))).toEqual(out);                                       // plain data
      expect(() => structuredClone(out)).not.toThrow();
      expect(out.ways.map((w) => w.id)).toEqual(WAY_IDS);
      expect(out.basis.runs).toBe(9);
      const ref = plannerRun(plan);
      for (const w of out.ways) {
        const r = ref.all.strategies[w.id];
        expect(w.affordable, w.id).toBe(!!r.affordable);
        if (!r.affordable) { expect(w.a).toBe(null); expect(w.reason && w.reason.why, w.id).toBeTruthy(); continue; }
        expect(w.ruin.mc, w.id).toBe(r.ruin.mc);
        expect(w.ruin.hist, w.id).toBe(r.ruin.hist);
        expect(Math.round(w.terminal.p10), w.id).toBe(Math.round(r.terminal.p10));
        expect(Math.round(w.terminal.p50), w.id).toBe(Math.round(r.terminal.p50));
        expect(Math.round(w.terminal.p90), w.id).toBe(Math.round(r.terminal.p90));
        expect(w.coverage, w.id).toBe(r.coverage == null ? null : r.coverage);
        // the figures the card says are the one answer's (OneAnswer.oneAnswer on the same result)
        const a = oneAnswer(r, ref.p);
        expect(w.a.chancePct, w.id).toBe(a.chancePct);
        expect(Math.round(w.a.typicalLeft), w.id).toBe(Math.round(a.typicalLeft));
        expect(Math.round(w.a.badCaseLeft), w.id).toBe(Math.round(a.badCaseLeft));
        // the score the table shows is scoreStrategy's
        const sc = scoreStrategy(r, ref.p);
        expect(w.vac, w.id).toBe(sc.vac);
        expect(w.coverageRatio, w.id).toBe(sc.coverageRatio);
        expect(w.vol, w.id).toBe(sc.vol);
      }
      // the order: the planner's rankingCardHtml sorts `scored` by rankWays and lists the unaffordable after — so does the card list
      for (const by of RANK_BYS) {
        const theirs = [...rankWays(ref.scored, by).map((x) => x.id), ...ref.unaffordable];
        expect(rankedIds(out.ways, by), by).toEqual(theirs);
      }
      // the page's cards: the plan's own first, then the other eight in that order
      const reading = wayOf([{ plan }], plan.id, { today: TODAY });
      const page = cardsOf(reading, { key: reading.runKey, status: 'done', result: out, open: null, dials: {}, tried: {}, rankBy: 'lasts' });
      const lasts = [...rankWays(ref.scored, 'lasts').map((x) => x.id), ...ref.unaffordable];
      expect(page.cards.map((c) => c.id)).toEqual([reading.strategyId, ...lasts.filter((id) => id !== reading.strategyId)]);
      expect(page.cards.map((c) => c.rank)).toEqual(page.cards.map((c) => lasts.indexOf(c.id)));
      // the plan's own card needs no run: its dials are the values the comparison ran it with
      expect(page.cards[0].needsRun).toBe(false);
    });
  }
  it('one way tried on its dials is the planner\'s strategy page what-if (specStrategyPageHtml): the way named, its restored params with the dials on top, the cut dials onto the settings', () => {
    const plan = entryOf(C['07-pre-6.13-flat-params']).plan;
    const s = effectiveStressSettings(plan, { now });
    const check = (id, dials, stratDials) => {
      const mine = runWay(plan, { today: TODAY, id, dials });
      const { params, patch } = dialParams(id, stratDials);
      const prm = { ...restoredParamsFor(s, id), ...params };
      const over = { ...s, strategyId: id, strategyParams: prm, ...patch };
      const p = planFromSettings(over, createSimulationConfigFromSettings({}, over), { yieldForYear: realYieldForYear, essentialsAnnual: prm.essentialsAnnual, startAge: +over.shapeAgeNow || 57, now });
      const r = stressTestStrategy(id, p, deriveCompareConfigs(p));
      expect(mine.affordable).toBe(!!r.affordable);
      if (r.affordable) { expect(mine.ruin.mc).toBe(r.ruin.mc); expect(Math.round(mine.terminal.p50)).toBe(Math.round(r.terminal.p50)); }
      expect(mine.basis.runs).toBe(1);
      expect(mine.tried).toBe(true);
    };
    check('floor-to-age', { floorToAge: 84 }, { floorToAge: 84 });
    check('gilt-rotation', { cashYears: 1, rotateCutAge: 78, rotateDisarmYears: 6, spareGrowth: 'invested' }, { cashYears: 1, rotateCutAge: 78, rotateDisarmYears: 6, spareGrowth: true });
    check('floor-and-flex', { sleeveRatePct: 3.5, treatsRule: 'fixed' }, { sleeveRatePct: 3.5, treatsRule: 'fixed' });
    check('pots-and-valves', { protectionOn: 'no' }, { protectionOn: false });
    check('buckets-in-order', { bucketBand: 20, cutPct: 30, consecutiveLimit: 4 }, { bucketBand: 20, cutPct: 30, consecutiveLimit: 4 });
  });
});
