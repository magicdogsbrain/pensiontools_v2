/**
 * L2 (research/v7/editing-in-v7.md 10.6) as one check: the worker's run is the planner's, to the pound. runLasts(plan,
 * { today }) — what the V7 worker runs — gives the figures oneAnswer gives on stressTestStrategy over the plan built as
 * index.html strategyPlanFor builds it (the repository's createSimulationConfigFromSettings, planFromSettings with the
 * real-yield curve, the same clock); a locked plan: the document's figure read back and today's test beside it. Used by
 * the corpus (lastsRun.test.js) and by a plan kept locally (localIdentity.local.test.js: gate 1's local half,
 * research/v7/switch-readiness.md). Not a test file.
 *
 *   isLocked(plan)                        the plan is locked
 *   plannerRun(plan, now)                 index.html strategyPlanFor + oneTestFor: { sid, p, r, a }
 *   expectLastsAsPlanner(plan, { today }) every figure of runLasts against the planner's, with vitest's expect
 */
import { expect } from 'vitest';
import { runLasts } from '../../../src/answers/plan/lastsRun.js';
import { effectiveStressSettings } from '../../../src/services/PlanReading.js';
import { createSimulationConfigFromSettings } from '../../../src/storage/StressRepository.js';
import { planFromSettings, stressTestStrategy } from '../../../src/strategies/stressTest.js';
import { realYieldForYear } from '../../../src/services/LinkerUniverse.js';
import { oneAnswer, worstStarts, earlierTestNote } from '../../../src/services/OneAnswer.js';
import { namedStartRows, SCENARIO_STARTS, decadeFigures, CONTRACT } from '../../../src/services/NamedStarts.js';
import { generateDrawdownSchedule } from '../../../src/services/DrawdownService.js';
import { generateGlidepathSchedule } from '../../../src/services/GlidepathService.js';
import { SCENARIOS } from '../../../src/constants.js';
import { noon } from './_plans.js';

export const isLocked = (p) => !!(p.decisionTool && p.decisionTool.settings && p.decisionTool.settings.locked);

/** index.html strategyPlanFor + oneTestFor, as tests/oneAnswer.slow.test.js has them: the plan every planner screen runs. */
export function plannerRun(plan, now) {
  const s = effectiveStressSettings(plan, { now });
  const sid = s.strategyId || 'pots-and-valves';
  const p = planFromSettings(s, createSimulationConfigFromSettings({}, s), { yieldForYear: realYieldForYear, startAge: +s.shapeAgeNow || 57, now });
  const r = stressTestStrategy(sid, p);
  return { sid, p, r, a: oneAnswer(r, p) };
}

/** Every figure the preview's run gives for the plan, against the planner's, on the day `today` ('YYYY-MM-DD', at noon). */
export function expectLastsAsPlanner(plan, { today }) {
  const now = noon(today);
  const progress = [];
  const t0 = performance.now();
  const out = runLasts(plan, { today, onProgress: (d, t) => progress.push([d, t]) });
  const ms = performance.now() - t0;
  // (7.8.0, weighing: a plan that ends before the weighting age makes one more run, followed on to it — three stages)
  const stages = progress.length ? progress[0][1] : 0;
  expect([2, 3]).toContain(stages);
  expect(progress).toEqual(Array.from({ length: stages }, (_, i) => [i, stages]));
  // wall-clock: only where timing means something (not shared CI runners — the rule of tests/v7/shared/speed.*)
  // (7.8.0: a plan that ends before the weighting age makes one more run, followed on to it — the budget is twice today's)
  if (!process.env.CI || process.env.TIMING_CHECKS === '1') expect(ms, 'a run takes well under ten seconds here (twice the five before 7.8.0)').toBeLessThan(10000);
  // plain data: it survives JSON and a worker boundary
  expect(JSON.parse(JSON.stringify(out))).toEqual(out);
  expect(() => structuredClone(out)).not.toThrow();
  const ref = plannerRun(plan, now);
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
}
