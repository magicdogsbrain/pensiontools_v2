/**
 * L2 (research/v7/editing-in-v7.md 10.6): the worker's run is the planner's, to the pound. For every corpus plan,
 * runLasts(plan, { today }) — what the V7 worker runs — gives the figures oneAnswer gives on stressTestStrategy over the
 * plan built as index.html strategyPlanFor builds it (the repository's createSimulationConfigFromSettings, planFromSettings
 * with the real-yield curve, the same clock). A locked plan: the document's figure read back and today's test beside it,
 * the note '' when they agree. The result is plain data and crosses a worker boundary. Full runs: about half a second a
 * plan on the reference machine.
 */
import { describe, it, expect } from 'vitest';
import { runLasts, planFor, runForDocument, savingPathFor, documentAccumulationOf, documentHoldingsOf } from '../../../src/answers/plan/lastsRun.js';
import { buildPlanDocument, trimPlan, trimResult } from '../../../src/services/PlanDocument.js';
import { savingPathForLock } from '../../../src/ui/savingPathForLock.js';
import { lockPatch } from '../../../src/answers/plan/lock.js';
import { effectiveStressSettings } from '../../../src/services/PlanReading.js';
import { createSimulationConfigFromSettings } from '../../../src/storage/StressRepository.js';
import { planFromSettings, stressTestStrategy } from '../../../src/strategies/stressTest.js';
import { realYieldForYear } from '../../../src/services/LinkerUniverse.js';
import { oneAnswer, worstStarts, earlierTestNote } from '../../../src/services/OneAnswer.js';
import { namedStartRows, SCENARIO_STARTS, decadeFigures, CONTRACT } from '../../../src/services/NamedStarts.js';
import { generateDrawdownSchedule } from '../../../src/services/DrawdownService.js';
import { generateGlidepathSchedule } from '../../../src/services/GlidepathService.js';
import { SCENARIOS } from '../../../src/constants.js';
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
      // wall-clock: only where timing means something (not shared CI runners — the rule of tests/v7/shared/speed.*)
      if (!process.env.CI || process.env.TIMING_CHECKS === '1') expect(ms, 'a run takes well under five seconds here').toBeLessThan(5000);
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
        // a contract plan: each named stress carries the planner's inflation table (oneAnswerView.js scenariosTabHtml, lifted as contractCash):
        // prices after ten years, the cash the rungs would pay in the first and the tenth year under that decade's prices, the tenth year's real income unchanged
        const years = plan.planDocument.strategy.r.plan.years;
        const cashFor = (sc) => { const cp = [1]; for (let i = 1; i < years.length; i++) cp.push(cp[i - 1] * (1 + (sc.inflation[i - 1] ?? 0.025))); return { prices10: cp[10] - 1, cashFirst: Math.round(years[0].gross), cashTenth: Math.round(years[9].gross * cp[9]), realTenth: Math.round(years[9].gross), ageFirst: years[0].age, ageTenth: years[9].age }; };
        expect(out.extras.scenarios.length).toBe(SCENARIO_STARTS.length);
        for (const row of out.extras.scenarios) { expect(row.kind).toBe('contract'); expect(row.cash).toEqual(cashFor(SCENARIOS[row.key])); }
        expect(out.extras.synthetic.cash).toEqual(cashFor(SCENARIOS.SYNTHETIC_WORST));
        expect(out.extras.scenarios.find((row) => row.key === 'STAGFLATION_70S').cash.cashTenth).toBeGreaterThan(years[9].gross * 1.9);   // the 1970s: prices more than doubled over the decade
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
      // the year-by-year tables and the named stresses (road-to-7.md step 11b): read off this run and the plan's own settings, no second run —
      // the planner's Drawdown and Glidepath pages (Pots & Valves) or the strategy's own table from the cones, and its Scenarios page
      const x = out.extras;
      expect(x).not.toBe(null);
      const s = effectiveStressSettings(plan, { now });
      const dur = Math.max(1, Math.round(+s.duration || 35));
      expect(x.prices).toBe(0.025);
      if (ref.sid === 'pots-and-valves') {
        const dd = generateDrawdownSchedule({ ...s, duration: dur }, dur, 0.025, now);
        expect(x.schedule.map((r) => [r.year, r.pension, r.state, r.tax, r.isa, r.spendable, r.isaLeft])).toEqual(dd.map((r) => [r.year, Math.round(r.sippDraw), Math.round(r.statePension), Math.round(r.tax), Math.round(r.isaDraw), Math.round(r.spendable), Math.round(r.isaBalance)]));
        const gp = generateGlidepathSchedule({ ...s, duration: dur }, 0.025);
        expect(x.glidepath.rows.map((r) => [r.year, r.shares, r.bonds, r.cash, r.total, r.sharesPct])).toEqual(gp.map((r) => [r.year, Math.round(r.equityMin), Math.round(r.bondMin), Math.round(r.cashTarget), Math.round(r.totalMin), Math.round((r.equityShareOfPot || 0) * 100)]));
        expect(x.glidepath.tent).toBe(!!s.equityGlideEnabled);
        expect(x.own).toBe(null);
      } else {
        expect(x.schedule).toBe(null);
        expect(x.glidepath).toBe(null);
        expect(x.own.map((r) => [r.year, r.age, r.incomeMid, r.incomeBad, r.leftMid])).toEqual(Array.from({ length: ref.p.durationYears }, (_, y) => [y + 1, ref.p.startAge + y, Math.round(ref.r.cones.income.p50[y]), Math.round(ref.r.cones.income.p10[y]), Math.round(ref.r.cones.wealth.p50[y])]));
      }
      expect(x.scenarios.map((r) => [r.key, r.year, r.kind, !!r.available, !!r.failed])).toEqual(namedStartRows(ref.sid, ref.p, SCENARIO_STARTS).map((r, i) => [SCENARIO_STARTS[i].key, r.year, r.kind, !!r.available, !!r.failed]));
      expect(x.scenarios.map((r) => r.decade)).toEqual(SCENARIO_STARTS.map((st) => decadeFigures(SCENARIOS[st.key])));
      // the inflation figures are a contract plan's alone
      for (const row of x.scenarios) expect('cash' in row, ref.sid).toBe(CONTRACT.includes(ref.sid) && !!(ref.r && ref.r.plan && Array.isArray(ref.r.plan.years)));
      expect(x.synthetic.name).toBe(SCENARIOS.SYNTHETIC_WORST.name);
      expect(x.synthetic.hardest).toEqual(worstStarts(ref.r.histWindows, 1).map((w) => ({ year: w.year, month: w.month || null }))[0] || null);
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
    const p = planFromSettings(s, createSimulationConfigFromSettings({}, s), { yieldForYear: realYieldForYear, essentialsAnnual: ess, startAge: +s.shapeAgeNow || 57, now });
    const r = stressTestStrategy(sid, p);
    const accumulation = (plan.accumulationTool && plan.accumulationTool.settings) || {};
    const savingPath = await savingPathForLock({ settings: s, accumulation, holdings: documentHoldingsOf(plan), now });
    return buildPlanDocument({ planName: plan.planDetails.name || 'My plan', holdings: documentHoldingsOf(plan), settings: s, p, r, lockedAt, lockedBy, budgetGross, essentials, journey: plan.journey || [], accumulation, now, savingPath });
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
      const theirs = await plannerDocument(plan, { lockedAt: P.lockedAt, lockedBy: 'locked in the preview' });
      expect(P.patch.planDocument).toEqual(theirs);
      expect(JSON.stringify(P.patch.planDocument)).toBe(JSON.stringify(theirs));
    });
  }
  it('with the budget\'s essentials (a plan with a budget line): the plan is built with them, as strategyPlanFor builds it for the document and not for the one test', async () => {
    const plan = entryOf(C['02-pnv-draft']).plan;
    const withBudget = JSON.parse(JSON.stringify(plan));
    withBudget.budgetTool.settings = { ...withBudget.budgetTool.settings, lines: [{ id: 'l1', heading: 'Home', label: 'Rent', annual: 30000, tier: 'essential' }] };
    const P = lockPatch(withBudget, { now, run: runForDocument(withBudget, { today: TODAY, essentials: 34358 }), entries: [{ plan: withBudget }] });
    const theirs = await plannerDocument(withBudget, { essentials: 34358, budgetGross: 34358, lockedAt: P.lockedAt, lockedBy: 'locked in the preview' });
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
