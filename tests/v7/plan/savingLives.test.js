/**
 * WHOLE LIVES in the plan test of a plan still saving (lead4-engine.md ruling 8): each life saves its own pot on its own
 * markets and then draws from that pot on the same life's markets from the stop. The plan no longer draws every future from
 * one middling pot. The pot shown at the stop is the middle of those same lives, with their low and high.
 *
 * Sam (made up): 45, £60,000 in a pension, £500 a month in plus £300 from the employer, £10,000 savings, stopping at 60,
 * £2,000 a month, kept from "Am I paying in enough?" (keep's own two steps), read on 30 September 2026.
 *
 * Hand-worked (the life sum the plan reads, saving.js): with shares flat, prices flat, no charge and all in shares, a pot of
 * £10,000 with £100 a month paid in for 5 years is 10,000 + 5 × 12 × 100 = £16,000 at the stop, in every life.
 */
import { describe, it, expect } from 'vitest';
import { answerB } from '../b/_b.js';
import { keptPlansOf } from '../../../src/answers/keep/keptPlan.js';
import { lastsOf, runForDocument, afterFall, planFor } from '../../../src/answers/plan/lastsRun.js';
import { stressTestStrategy } from '../../../src/strategies/stressTest.js';
import { lockPatch, applyPatch } from '../../../src/answers/plan/lock.js';
import { effectiveStressSettings } from '../../../src/services/PlanReading.js';
import { stopPotsByLife, savingCoreFrom } from '../../../src/services/SavingPath.js';
import { simulate } from '../../../src/services/SimulationEngine.js';
import { bootstrapPaths, annualNominal } from '../../../src/strategies/ladderEngine.js';
import { bandIndexes } from '../../../src/answers/shared/band.js';
import { dateOf } from '../../../src/answers/plan/dates.js';

const TODAY = '2026-09-30';
const N = 40;
const ENV = { today: TODAY, futures: N, seed: 0, trace: false };
const SAM = { household: 'single', you: { age: 45, pot: 60000, statePension: { kind: 'full' }, finalSalary: { has: false }, payIn: { kind: 'split', own: 500, employer: 300 } },
  savings: 10000, savingsIn: 0, savingRisk: 'balanced', risk: 'balanced', charge: 0.5, endAge: 95 };
const samPlan = () => keptPlansOf('b', answerB({ ...SAM, spend: { kind: 'amount', amount: 2000 }, stop: { age: 60 }, confidence: 'balanced' }, { ...ENV, detail: 'answer' }), ENV).yours;

describe('the saving lives (hand-worked)', () => {
  it('£10,000 with £100 a month for 5 years, flat shares and prices, no charge: £16,000 at the stop in every life', () => {
    const core = savingCoreFrom({ settings: { chargesPct: 0, isaGrowth: 'invested', equityMin: 1, bondMin: 0, cashTarget: 0 }, timing: { mode: 'future', currentAge: 50, shapeAgeNow: 55 },
      explicit: { potNow: 10000, isaNow: 0, totalMonthly: 100, isaMonthly: 0 }, risePrices: true }).core;
    expect(core.years).toBe(5);
    const flat = () => ({ equity: Array(10).fill(0), inflation: Array(10).fill(0) });
    const at = stopPotsByLife(core, 3, { futureReturns: flat });
    expect(Array.from(at.pension).map((v) => Math.round(v * 100) / 100)).toEqual([16000, 16000, 16000]);
  });
});

describe('the plan test of a plan still saving runs whole lives (ruling 8)', () => {
  const plan = samPlan();
  const now = dateOf(TODAY);
  const settings = effectiveStressSettings(plan, { now });
  const at = settings.potAtRetirement;

  it('the pots at the stop shown are the middle of the same lives, with the 1-in-10 low and high of pension and savings together', () => {
    expect(at.source).toBe('worked');
    expect(at.lives.years).toBe(15);
    const lives = stopPotsByLife(at.lives, 1000);
    const sorted = (a) => Array.from(a).sort((x, y) => x - y);
    const idx = bandIndexes(1000);
    expect(Math.round(sorted(lives.pension)[idx.middling])).toBe(at.sipp);
    expect(Math.round(sorted(lives.savings)[idx.middling])).toBe(at.isa);
    const tot = sorted(lives.pension.map((v, i) => v + lives.savings[i]));
    expect([Math.round(tot[idx.careful]), Math.round(tot[idx.good])]).toEqual([at.careful, at.good]);
  });

  it('future i draws life i\'s own pots on life i\'s markets from the stop: each run is the engine\'s on them, run for run', () => {
    const { p, r } = lastsOf(plan, { today: TODAY, futures: N, histories: false, weighted: false });
    const lives = stopPotsByLife(at.lives, N);
    const off = 12 * 15;
    const END = 12 * p.durationYears;
    const c = p.pnvCfg;
    let differ = 0;
    for (let i = 0; i < N; i++) {
      const k = lives.pension[i] / at.sipp, kI = lives.savings[i] / at.isa;
      const cfg = { ...c, equityStart: c.equityStart * k, bondStart: c.bondStart * k, cashStart: c.cashStart * k, equityMin: c.equityMin * k, bondMin: c.bondMin * k, cashTarget: c.cashTarget * k, isaBalance: c.isaBalance * kI, years: p.durationYears };
      const path = bootstrapPaths(i * 7919 + 3, off + END);
      const s = simulate(cfg, annualNominal(path.rtr, path.cpi, off, p.durationYears), i);
      expect(r.survivedMc[i]).toBe(!s.failed);
      if (Math.abs(r.futuresMc.terminal[i] - (s.failed ? 0 : s.finalReal + (s.finalIsa || 0) / (s.cumInflation || 1))) > 1e-6) differ++;
    }
    expect(differ).toBe(0);
  });

  it('the lives start from their own pots: year 0\'s wealth is not one figure in every future', () => {
    const { r } = lastsOf(plan, { today: TODAY, futures: N, histories: false, weighted: false });
    const w0 = r.cones.wealth;
    expect(w0.p90[0]).toBeGreaterThan(w0.p10[0] * 1.2);
  });

  it('a plan locked now runs the same lives as when it was locked: its document keeps their figures with its pots', () => {
    const run = runForDocument(plan, { today: TODAY });
    const lp = lockPatch(plan, { now, run });
    expect(lp.ok).toBe(true);
    const locked = applyPatch(plan, lp.patch);
    expect(locked.planDocument.pots.potAtRetirement.lives).toEqual(at.lives);
    const live = lastsOf(plan, { today: TODAY, futures: N, histories: false, weighted: false });
    const read = lastsOf(locked, { today: TODAY, futures: N, histories: false, weighted: false });
    expect(read.r.survivedMc).toEqual(live.r.survivedMc);
    expect(read.r.futuresMc.terminal).toEqual(live.r.futuresMc.terminal);
  });

  it('"What if shares fell by a fifth?": every life\'s pots at the stop fall by the same share the pots said fall by', () => {
    // the pension's shares part falls by a fifth: with a share s of the pension in shares, each life's pension at the stop
    // is (1 − 0.2 × s) of what it was, as the middle said on the plan is
    const f = afterFall(settings);
    const k = f.settings.potAtRetirement.sipp / at.sipp;
    expect(k).toBeCloseTo(1 - 0.2 * f.equityShare, 2);
    const run = (s) => { const p = planFor(s, now); p.mcRuns = N; p.stride = 1e9; return { p, r: stressTestStrategy(s.strategyId || 'pots-and-valves', p) }; };
    const before = run(settings), after = run(f.settings);
    const pen = (x) => x.p.pnvCfg.equityStart + x.p.pnvCfg.bondStart + x.p.pnvCfg.cashStart;
    expect(pen(after) / pen(before)).toBeCloseTo(k, 9);
    // with the savings untouched or falling too, year 0's wealth falls in every future, by no more than the pension's share
    for (const q of ['p10', 'p50', 'p90']) {
      expect(after.r.cones.wealth[q][0]).toBeLessThan(before.r.cones.wealth[q][0]);
      expect(after.r.cones.wealth[q][0] / before.r.cones.wealth[q][0]).toBeGreaterThan(k - 1e-9);
    }
  });

  it('a pot the person typed at the stop is one pot: every future starts from it', () => {
    const typed = JSON.parse(JSON.stringify(plan));
    typed.stressTool.settings.potAtRetirement = { sipp: 300000, isa: 20000, source: 'override' };
    const { r } = lastsOf(typed, { today: TODAY, futures: N, histories: false, weighted: false });
    expect(r.cones.wealth.p90[0]).toBeCloseTo(r.cones.wealth.p10[0], 6);
  });
});
