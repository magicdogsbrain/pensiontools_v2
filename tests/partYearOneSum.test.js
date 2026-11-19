/**
 * A part year is the same sum in every way of drawing (7.12.0, step E8). ONE function (services/PaidYear.js paidYearOf)
 * gives, for a plan year that has m of its 12 months, the spending for those months, the income that actually arrives in
 * them, and so the need from the pots or the contract. Every way reads it.
 *
 * A fictional plan: Jo is saving and stops work in November 2027; the plan pays £28,000 a year before tax; Jo's State
 * Pension is £12,000 a year from 6 January 2028. Jo's first plan year is the tax year 2027/28. Prices flat. Worked by hand,
 * in whole months (the State Pension's first month counts whole):
 *   the months year 0 has          November to March = 5
 *   spending for them              28,000 × 5 ÷ 12 = 11,666.67
 *   the State Pension's months     January, February, March = 3
 *   the State Pension in them      12,000 × 3 ÷ 12 = 3,000
 *   from the pots or the contract  11,666.67 − 3,000 = 8,666.67
 * Before this step three figures were in use for the same months: the gilt ladder 8,666.67; the floors, Bridge & engine
 * and Ladder & Ratchet (28,000 − 12,000) × 5 ÷ 12 = 6,666.67 (a whole year's State Pension taken off, then scaled); and
 * their income cones 6,666.67 + 12,000 = 18,666.67 for year 0, the full ladder's cone 28,000.
 *
 * Year 1 (2028/29) is whole: 28,000 − 12,000 = 16,000 from the pots or the contract, 28,000 in all.
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));

import { createSimulationConfigFromSettings } from '../src/storage/StressRepository.js';
import { planFromSettings, stressTestStrategy } from '../src/strategies/stressTest.js';
import { deriveCompareConfigs } from '../src/strategies/compareRunner.js';
import { simulate } from '../src/services/SimulationEngine.js';
import { paidYearOf } from '../src/services/PaidYear.js';
import { rotationPathsCtx } from '../src/strategies/GiltRotation.js';

const NOW = new Date(2026, 8, 30, 12);
const jo = {
  configured: true, duration: 30, other: 0, pa: 12570, brl: 50270, hrl: 125140, taxMode: 'inflates',
  protectionMult: 0.8, consecutiveLimit: 3, disableProtection: true, recoveryBuffer: 0,
  hodlEnabled: false, hodlValue: 0, isaReturn: 0.03, spStartDate: '2028-01-06', spWeeklyAmount: 12000 / 52, statePension: 0,
  dbAmount: 0, dbStartYear: 0, dbIndexation: 'cpi',
  // pots large enough for every way to be bought
  equityMin: 950000, bondMin: 200000, cashTarget: 100000, isaBalance: 0, baseSalary: 28000,
  incomeShape: 'phases', incomeSteps: [{ fromAge: 65, amount: 28000 }],
  currentAge: 64, currentAgeAsOf: '2026-09-30', retired: false, retireAge: 65, stoppedWork: '2027-11', firstTaxYear: 2027,
  strategyParams: { essentialsAnnual: 28000 }
};
const p = planFromSettings(jo, createSimulationConfigFromSettings({}, jo), { now: NOW });
const NEED0 = 28000 * 5 / 12 - 3000;            // 8,666.67
const flat = { equity: Array(40).fill(0), inflation: Array(40).fill(1e-12) };   // 0 would read as "none given" (2.5%)

describe('one function for a part year', () => {
  it('year 0: 5 months, £11,666.67 spent, £3,000 of State Pension, £8,666.67 from the pots or the contract', () => {
    expect(p.year0Months).toBe(5);
    const y0 = paidYearOf(p, 0);
    expect(y0.months).toBe(5);
    expect(y0.spending).toBeCloseTo(11666.67, 2);
    expect(y0.sp).toBeCloseTo(3000, 6);
    expect(y0.need).toBeCloseTo(NEED0, 2);
    const y1 = paidYearOf(p, 1);
    expect([y1.months, y1.sp]).toEqual([12, expect.closeTo(12000, 6)]);
    expect(y1.need).toBeCloseTo(16000, 6);
  });
});

describe('every way asks the pots or the contract for the same year-0 need', () => {
  it('Pots & Valves (and the quick engine on its config): 5 months of draws add to £8,666.67', () => {
    const t = simulate({ ...p.pnvCfg, years: 30, trace: true, disableProtection: true }, flat, 1).trace;
    const drawn = t.slice(0, 12).reduce((s, r) => s + (r.effectiveSipp || 0) + (r.effectiveIsa || 0), 0);
    expect(drawn).toBeCloseTo(NEED0, 0);
  });
  it('the floors, Bridge & engine, Floor & Flex and Ladder & Ratchet: £8,666.67 for year 0, £16,000 for year 1', () => {
    const c = deriveCompareConfigs(p);
    for (const draw of [c.fs.floorDraw, c.fa.floorDraw, c.be.floorDraw, c.ff.floorDraw, c.lr.drawNetOfSp]) {
      expect(draw(1)).toBeCloseTo(NEED0, 2);
      expect(draw(2)).toBeCloseTo(16000, 6);
    }
  });
  it('the full gilt ladder and the rotation built on it: £8,666.67', () => {
    const r = stressTestStrategy('full-il-gilt', { ...p, mcRuns: 10, stride: 24 });
    expect(r.affordable).toBe(true);
    expect(r.plan.years[0].need).toBeCloseTo(NEED0, 2);
    expect(r.plan.years[0].sp).toBeCloseTo(3000, 6);
    const ctx = rotationPathsCtx(r.plan, p, { cutAge: 75, trigger: 0.3 });
    expect(ctx.needAt(0)).toBeCloseTo(NEED0, 2);
    expect(ctx.spAtY(0)).toBeCloseTo(3000, 6);
  });
});

describe('every way\'s income cone shows the part year; none reads it as the worst 12 months', () => {
  const ways = ['full-il-gilt', 'floor-the-schedule', 'floor-to-age', 'bridge-and-engine', 'ladder-and-ratchet', 'floor-and-flex', 'gilt-rotation', 'pots-and-valves'];
  for (const id of ways) {
    it(id + ': year 0 income £11,666.67 (its 5 months); the worst 12 months never that', () => {
      const r = stressTestStrategy(id, { ...p, mcRuns: 20, stride: 24 });
      expect(r.affordable).toBe(true);
      // Floor & Flex pays its treats from the sleeve on top of the bought essentials: at least the months' spending
      if (id === 'floor-and-flex') expect(r.cones.income.p50[0]).toBeGreaterThanOrEqual(11666.67 - 1);
      else expect(r.cones.income.p50[0]).toBeCloseTo(11666.67, -1);
      expect(r.cones.income.p50[1]).toBeGreaterThanOrEqual(28000 - 1);
      expect(r.worst12.min).toBeGreaterThan(11666.67 + 1);
    });
  }
});

import { buildTimeline, shapeLayersFromSettings } from '../src/services/PlanDocument.js';
import { deriveTiming } from '../src/services/PlanTiming.js';

describe('the plan document\'s year table says the same year 0 as its cone', () => {
  // Jo's 2027/28 row: £11,667 for the 5 months (28,000 × 5 ÷ 12), of which £3,000 State Pension (12,000 × 3 ÷ 12) — it
  // said £28,000 and a State Pension of the tax year's share by days.
  for (const id of ['pots-and-valves', 'full-il-gilt']) {
    it(id + ': row 0 is £11,667 with £3,000 of State Pension; row 1 £28,000 with £12,000', () => {
      const r = { ...stressTestStrategy(id, { ...p, mcRuns: 20, stride: 24 }), strategyId: id };
      const timing = deriveTiming(jo, NOW);
      const rows = buildTimeline({ settings: jo, timing, p, r, layers: shapeLayersFromSettings(jo, timing, { now: NOW }) });
      expect([rows[0].taxYear, rows[0].gross, rows[0].sp]).toEqual([expect.stringMatching(/2027/), 11667, 3000]);
      expect(Math.round(r.cones.income.p50[0])).toBeCloseTo(rows[0].gross, -1);
      expect([rows[1].gross, rows[1].sp]).toEqual([28000, 12000]);
    });
  }
});

describe('one axis for the current plan year: a plan two years in and the same plan made today agree (ruling C)', () => {
  // Kim (fictional) is 66, retired, wants £40,000 a year before tax from the pots (no State Pension in this sketch), and is
  // read on 30 September 2026. Plan A started in 2024/25 and has lived two years (its pots are today's: potsAsOf 'today');
  // plan B is the same plan made today, its year 0 2026/27. Worked by hand, the same for both:
  //   the months of the current year   September to March = 7 (April to August were paid before the pots were counted)
  //   from the pots in them             40,000 × 7 ÷ 12 = 23,333.33 (A took the twelve months from September, 40,000)
  //   next year                          40,000
  const kim = {
    configured: true, duration: 30, other: 0, pa: 12570, brl: 50270, hrl: 125140, taxMode: 'inflates',
    protectionMult: 0.8, consecutiveLimit: 3, disableProtection: true, recoveryBuffer: 0, hodlEnabled: false, hodlValue: 0,
    isaReturn: 0.03, spStartDate: null, spWeeklyAmount: 0, statePension: 0, dbAmount: 0, dbStartYear: 0, dbIndexation: 'cpi',
    equityMin: 950000, bondMin: 200000, cashTarget: 100000, isaBalance: 0, baseSalary: 40000,
    incomeShape: 'phases', incomeSteps: [{ fromAge: 60, amount: 40000 }], currentAge: 66, currentAgeAsOf: '2026-09-30', retired: true
  };
  const A = planFromSettings({ ...kim, firstTaxYear: 2024, potsAsOf: 'today' }, createSimulationConfigFromSettings({}, { ...kim, firstTaxYear: 2024 }), { now: NOW });
  const B = planFromSettings({ ...kim, firstTaxYear: 2026 }, createSimulationConfigFromSettings({}, { ...kim, firstTaxYear: 2026 }), { now: NOW });
  it('both run 7 months of the current year; both draw £23,333.33 in them; the bought ways and the ladder buy the same', () => {
    expect([A.yearOffset, A.year0Months, B.yearOffset, B.year0Months]).toEqual([2, 7, undefined, 7]);
    const drawn = (q) => simulate({ ...q.pnvCfg, years: 30, trace: true, disableProtection: true }, flat, 1).trace.slice(0, 12)
      .reduce((s, r) => s + (r.effectiveSipp || 0) + (r.effectiveIsa || 0), 0);
    expect(drawn(A)).toBeCloseTo(40000 * 7 / 12, 0);
    expect(drawn(B)).toBeCloseTo(40000 * 7 / 12, 0);
    const [cA, cB] = [deriveCompareConfigs(A), deriveCompareConfigs(B)];
    expect([cA.fs.floorDraw(1), cA.fs.floorDraw(2)]).toEqual([cB.fs.floorDraw(1), cB.fs.floorDraw(2)]);
    expect(cA.fs.floorDraw(1)).toBeCloseTo(23333.33, 2);
    const gA = stressTestStrategy('full-il-gilt', { ...A, mcRuns: 10, stride: 24 }), gB = stressTestStrategy('full-il-gilt', { ...B, mcRuns: 10, stride: 24 });
    expect(gA.plan.years[0].need).toBeCloseTo(23333.33, 2);
    expect(gA.plan.years[0].need).toBeCloseTo(gB.plan.years[0].need, 6);
  });
});

import { otherIn } from '../src/services/PaidYear.js';

describe('money paid before the pots pays the months a part year 0 has, net of the State Pension (check of E8, fault 1)', () => {
  // Jo again (stop November 2027; £28,000 a year; State Pension £12,000 a year from 6 January 2028). Year 0 asks the pots,
  // or whatever pays before them, for 11,666.67 − 3,000 = 8,666.67; year 1 for 28,000 − 12,000 = 16,000 (as above).
  // Money paid before the pots pays THAT need, in its months: it was charged a whole year's need before the State Pension
  // (28,000), while the ways took only its five months (11,666.67) as arriving, so the rest of the year was lost.
  const planOf = (s) => planFromSettings(s, createSimulationConfigFromSettings({}, s), { now: NOW });
  const bought = (q) => { const c = deriveCompareConfigs(q); return [c.fs.floorDraw, c.fa.floorDraw, c.be.floorDraw, c.ff.floorDraw, c.lr.drawNetOfSp]; };

  it('a general account of £50,000: it pays 8,666.67 in year 0 and 16,000 in years 1 and 2; 41,333.33, 25,333.33, 9,333.33 left', () => {
    // 50,000 − 8,666.67 = 41,333.33; − 16,000 = 25,333.33; − 16,000 = 9,333.33; year 3 it pays the last 9,333.33
    const q = planOf({ ...jo, taxableStart: 50000 });
    expect(q.windfallCarryByYear.slice(0, 4).map((v) => +v.toFixed(2))).toEqual([41333.33, 25333.33, 9333.33, 0]);
    expect(otherIn(q, 0)).toBeCloseTo(8666.67, 2);
    expect(otherIn(q, 1)).toBeCloseTo(16000, 6);
    for (const draw of bought(q)) { expect(draw(1)).toBeCloseTo(0, 6); expect(draw(2)).toBeCloseTo(0, 6); expect(draw(4)).toBeCloseTo(16000 - 9333.33, 1); }
    // the year's income is the months' spending, not the State Pension on top of a whole need
    const r = stressTestStrategy('floor-the-schedule', { ...q, mcRuns: 10, stride: 24 });
    expect(r.cones.income.p50[0]).toBeCloseTo(11666.67, 1);
    expect(r.cones.income.p50[1]).toBeCloseTo(28000, 1);
  });

  it('a lump sum of £10,000 in year 0: it pays the 8,666.67, and 1,333.33 of year 1; the pots 0, then 14,666.67', () => {
    const q = planOf({ ...jo, windfalls: [{ amount: 10000, year: 0 }] });
    expect(q.windfallCarryByYear.slice(0, 2).map((v) => +v.toFixed(2))).toEqual([1333.33, 0]);
    for (const draw of bought(q)) { expect(draw(1)).toBeCloseTo(0, 6); expect(draw(2)).toBeCloseTo(16000 - 1333.33, 1); }
  });

  it('a pension still closed in year 0: the ISA pays the 5 months, 10,380.83 after tax, as Pots & Valves takes from it', () => {
    // Pat (fictional), 53, stops at 54 in November 2027; the pension opens the next tax year; ISA £200,000; State Pension
    // far off. Year 0: 28,000 × 5 ÷ 12 = 11,666.67 before tax. The ISA pays what the pension's pounds would have left after
    // tax, the year's tax on the year's rate: 28,000 − 20% × (28,000 − 12,570) = 24,914 a year, × 5 ÷ 12 = 10,380.83.
    // It set aside 24,914 (a whole year): 14,533.17 too much.
    const s = { ...jo, currentAge: 53, retireAge: 54, incomeSteps: [{ fromAge: 54, amount: 28000 }], spStartDate: '2040-01-06', isaBalance: 200000 };
    const q = planOf(s);
    expect(q.pensionLock.years).toBe(1);
    expect(q.pensionLock.paid[0]).toBeCloseTo(11666.67, 2);
    expect(q.pensionLock.unpaid[0]).toBeCloseTo(0, 6);
    expect(q.isa).toBeCloseTo(200000 - 10380.83, 1);
    expect(otherIn(q, 0)).toBeCloseTo(11666.67, 2);
    const t = simulate({ ...q.pnvCfg, years: 30, trace: true, disableProtection: true }, flat, 1).trace;
    expect(t.slice(0, 12).reduce((a, r) => a + (r.effectiveIsa || 0), 0)).toBeCloseTo(10380.83, 1);
  });
});

describe('Floor & Flex\'s floor takes off the income that comes anyway, as every other way does (check of E8, fault 2)', () => {
  const planOf = (s) => planFromSettings(s, createSimulationConfigFromSettings({}, s), { now: NOW });
  it('a final-salary pension of £6,000 from year 0: 6,166.67 then 10,000, as the others ask', () => {
    // essentials £28,000 (Jo's strategyParams): year 0 (28,000 − 6,000) × 5 ÷ 12 − 3,000 = 6,166.67; year 1 22,000 − 12,000
    const q = planOf({ ...jo, dbAmount: 6000, dbStartYear: 0 });
    const c = deriveCompareConfigs(q);
    expect(c.ff.floorDraw(1)).toBeCloseTo(6166.67, 2);
    expect(c.ff.floorDraw(2)).toBeCloseTo(10000, 6);
    expect(c.ff.floorDraw(1)).toBeCloseTo(c.fs.floorDraw(1), 6);
  });
  it('a general account of £50,000: nothing bought in years 0 and 1, as the others', () => {
    const c = deriveCompareConfigs(planOf({ ...jo, taxableStart: 50000 }));
    expect([c.ff.floorDraw(1), c.ff.floorDraw(2)]).toEqual([0, 0]);
  });
});

describe('the State Pension\'s first year is whole months in every year, not only a part year 0 (check of E8, fault 3)', () => {
  // State Pension from 6 January 2028: its first tax year (2027/28) pays January, February and March, 3 × 1,000 = 3,000, the
  // first month counted whole (ruling C). It was 91 ÷ 366 × 12,000 = 2,983.61 whenever 2027/28 was a whole year.
  const planOf = (s) => planFromSettings(s, createSimulationConfigFromSettings({}, s), { now: NOW });
  it('stop May 2027 (11 months) and stop April 2027 (12): 3,000 of State Pension in 2027/28 both times', () => {
    expect(paidYearOf(planOf({ ...jo, stoppedWork: '2027-05' }), 0).sp).toBeCloseTo(3000, 6);
    const q = planOf({ ...jo, stoppedWork: '2027-04' });
    expect(paidYearOf(q, 0).sp).toBeCloseTo(3000, 6);
    // 28,000 − 3,000 = 25,000 from the pots or the contract, in every way and in Pots & Valves' twelve months
    for (const draw of [...Object.values(deriveCompareConfigs(q)).filter((c) => c && typeof c.floorDraw === 'function').map((c) => c.floorDraw), deriveCompareConfigs(q).lr.drawNetOfSp]) expect(draw(1)).toBeCloseTo(25000, 6);
    const t = simulate({ ...q.pnvCfg, years: 30, trace: true, disableProtection: true }, flat, 1).trace;
    expect(t.slice(0, 12).reduce((a, r) => a + (r.effectiveSipp || 0) + (r.effectiveIsa || 0), 0)).toBeCloseTo(25000, 0);
  });
  it('stop March 2027 (year 0 is 2026/27, one month): year 1 asks 25,000', () => {
    const q = planOf({ ...jo, stoppedWork: '2027-03', firstTaxYear: 2026 });
    expect(paidYearOf(q, 1).need).toBeCloseTo(25000, 6);
    expect(deriveCompareConfigs(q).fs.floorDraw(2)).toBeCloseTo(25000, 6);
  });
});

import { simulateFastFrom, prepareFutureFull } from '../src/answers/shared/fastEngine.js';
import { runFlexWindows } from '../src/strategies/FloorAndFlex.js';
import { runLadderWindows } from '../src/strategies/LadderAndRatchet.js';
import { getRtr } from '../src/strategies/ladderEngine.js';
import { spareGrowthPath, runRotationPath } from '../src/strategies/GiltRotation.js';

describe('the months of year 0 before the pots\' day give the pots nothing (check 2 of E8)', () => {
  // Kim (fictional), 66, retired, £40,000 a year from the pots, is read on 15 November 2026 with that day's pots. Year 0
  // (2026/27) pays November to March, 5 months; April to October, 7 months, went before the pots were counted. The pots
  // are that day's, in today's money: in those 7 months they take no return and no charge. They move only with prices,
  // the twelfth of the rise the engine counts at the start of year 1 each month, so at year 1 their worth in today's money
  // is what the 5 months from the pots' day gave. A future with shares up 12% a year and prices up 3% in year 1:
  //   at the first paying month (November), was    600,000 × 1.12^(7/12) = 641,006 (7 months of a 12% year)
  //   now                                          600,000 × 1.03^(7/12) = 610,435 (prices only), £0 of charges
  //   in today's money                             610,435 ÷ 1.03^(7/12) = 600,000: the pots' day's worth
  // Every way does the same: a bought way's reserve (a real index) is flat in the 7 months and grows the 5; with the
  // index at r[m], the reserve at year 1 is E0 × r[12] ÷ r[7] (was E0 × r[12] ÷ r[0]).
  const NOV = new Date(2026, 10, 15, 12);
  const kim = {
    configured: true, duration: 30, other: 0, pa: 12570, brl: 50270, hrl: 125140, taxMode: 'inflates',
    protectionMult: 0.8, consecutiveLimit: 3, disableProtection: true, recoveryBuffer: 0, hodlEnabled: false, hodlValue: 0,
    isaReturn: 0.03, spStartDate: null, spWeeklyAmount: 0, statePension: 0, dbAmount: 0, dbStartYear: 0, dbIndexation: 'cpi',
    equityMin: 600000, bondMin: 200000, cashTarget: 100000, isaBalance: 50000, baseSalary: 40000, chargesPct: 0.6,
    incomeShape: 'phases', incomeSteps: [{ fromAge: 60, amount: 40000 }], currentAge: 66, currentAgeAsOf: '2026-11-15',
    retired: true, firstTaxYear: 2026
  };
  const q = planFromSettings(kim, createSimulationConfigFromSettings({}, kim), { now: NOV });
  const cfg = { ...q.pnvCfg, years: 30, disableProtection: true };
  const returns = { equity: Array(30).fill(0.12), inflation: Array(30).fill(1e-12).map((v, i) => (i === 1 ? 0.03 : v)) };
  const t = simulate({ ...cfg, trace: true }, returns, 1).trace;

  it('the plan: 5 months in year 0, its pots that day\'s', () => {
    expect(q.year0Months).toBe(5);
    expect(cfg.equityStart).toBe(600000);
    expect(cfg.chargesPct).toBe(0.6);
  });
  it('Pots & Valves: November\'s pots are the pots\' day\'s, moved only by prices: 610,435, not 641,006', () => {
    const f = Math.pow(1.03, 7 / 12);
    expect(t[7].equityStart).toBeCloseTo(600000 * f, 6);
    expect(t[7].bondStart).toBeCloseTo(cfg.bondStart * f, 6);
    expect(t[7].cashStart).toBeCloseTo(cfg.cashStart * f, 6);
    expect(t[7].isaStart).toBeCloseTo(50000 * f, 6);
    expect(Math.round(t[7].equityStart)).toBe(610435);
    for (let m = 0; m < 7; m++) expect(t[m].charge).toBe(0);
    expect(t[7].charge).toBeGreaterThan(0);   // the first paying month is charged, as every month after it
  });
  it('the quick engine: the same pots, to the bit, at every month to year 2', () => {
    // (the quick engine reads the State Pension by its plan year: none here)
    const fc = { ...cfg, spStartYear: 99, spWeeklyAmount: 0 };
    const ft = simulate({ ...fc, trace: true }, returns, 1).trace;
    const pf = prepareFutureFull({ returns, seed: 1 }, 30);
    expect(ft[7].equityStart).toBe(t[7].equityStart);
    for (const m of [1, 7, 8, 12, 24]) {
      const r = simulateFastFrom(fc, pf, { until: m });
      expect(r).not.toBe(null);
      expect([r.equity, r.bond, r.cash, r.isa]).toEqual([ft[m].equityStart, ft[m].bondStart, ft[m].cashStart, ft[m].isaStart]);
    }
  });
  it('the floors, Floor & Flex and Bridge & engine: the reserve at year 1 is E0 × r[12] ÷ r[7]', () => {
    const c = deriveCompareConfigs(q);
    const r = getRtr();
    for (const id of ['fs', 'fa', 'be']) {
      const w = runFlexWindows(c[id]).windows;
      for (const s of [0, 600, 1200]) expect(w[s].sleeveByYear[1]).toBeCloseTo(c[id].E0 * (r[s + 12] / r[s + 7]) * Math.pow(c[id].chargeM, 5), 4);
    }
  });
  it('Ladder & Ratchet: the sleeve at year 1 is E0 × r[12] ÷ r[7] in a window that buys nothing in year 0', () => {
    const c = deriveCompareConfigs(q);
    const r = getRtr();
    const w = runLadderWindows(c.lr).windows;
    let n = 0;
    for (const s of [0, 300, 600, 900, 1200]) {
      if (w[s].trades.some((x) => x.t <= 12)) continue;
      n++;
      expect(w[s].sleeveByYear[1]).toBeCloseTo(c.lr.E0 * (r[s + 12] / r[s + 7]) * Math.pow(c.lr.chargeM, 5), 4);
    }
    expect(n).toBeGreaterThan(2);
  });
  it('the gilt ladder\'s money left over in shares, and the rotation\'s: flat in the 7 months', () => {
    const series = Array.from({ length: 400 }, (_, i) => Math.pow(1.01, i));
    expect(spareGrowthPath(series, 0, 30, 1000, 1, 7)[1]).toBeCloseTo(1000 * Math.pow(1.01, 5), 9);
    const ctx = {
      N: 30, startAge: 66, cutAge: 75, trigger: 0.3, split: { soldOrders: [] }, keptWealthByYear: Array(31).fill(0),
      blockWealthByYear: Array(31).fill(0), needAt: () => 0, otherAtY: () => 0, spAtY: () => 0, lastRotateYear: 0,
      spare: 1000, spareGrowth: true, notYetMonths: 7
    };
    // the rotation's wealth counts the spare's gain on top of the ladder's own figures (which hold the spare itself)
    expect(runRotationPath(series, 0, ctx).wealth[1]).toBeCloseTo(1000 * Math.pow(1.01, 5) - 1000, 9);
  });
});

import { rowPlanOf } from '../src/answers/plan/lastsRun.js';
import { ROW_CHANGE } from '../src/answers/plan/stressPanel.js';
import { shockRtr } from '../src/strategies/ladderEngine.js';

describe('"Try the bad years" starts its fall in the first month that pays (check 2 of E8)', () => {
  // Kim (above), read 15 November: April to October give the pots nothing, so a fall "at the start" that began in April
  // would spend 7 of its 12 months where nothing is held, and only (1 − 0.30)^(5/12) of it, a 13.8% fall, would reach the
  // pots. It starts in November (month 7): over November to the next October the shares lose the whole 30%.
  const NOV = new Date(2026, 10, 15, 12);
  const kim = {
    configured: true, duration: 30, other: 0, pa: 12570, brl: 50270, hrl: 125140, taxMode: 'inflates',
    protectionMult: 0.8, consecutiveLimit: 3, disableProtection: true, recoveryBuffer: 0, hodlEnabled: false, hodlValue: 0,
    isaReturn: 0.03, spStartDate: null, spWeeklyAmount: 0, statePension: 0, dbAmount: 0, dbStartYear: 0, dbIndexation: 'cpi',
    equityMin: 600000, bondMin: 200000, cashTarget: 100000, isaBalance: 0, baseSalary: 40000,
    incomeShape: 'phases', incomeSteps: [{ fromAge: 60, amount: 40000 }], currentAge: 66, currentAgeAsOf: '2026-11-15',
    retired: true, firstTaxYear: 2026
  };
  const q = planFromSettings(kim, createSimulationConfigFromSettings({}, kim), { now: NOV });
  it('the fall and the faster prices start at month 7; a whole year 0 keeps month 0', () => {
    expect(rowPlanOf(q, ROW_CHANGE.fall).shock).toEqual({ kind: 'fall', share: 0.3, from: 7 });
    expect(rowPlanOf(q, ROW_CHANGE.prices).shock.from).toBe(7);
    const whole = planFromSettings(kim, createSimulationConfigFromSettings({}, kim), { now: new Date(2026, 3, 20, 12) });
    expect(whole.year0Months).toBeUndefined();
    expect(rowPlanOf(whole, ROW_CHANGE.fall).shock.from).toBe(0);
  });
  it('on a rising market the shares are 30% down over the twelve months from November', () => {
    const rtr = Array.from({ length: 400 }, (_, i) => Math.pow(1.005, i));
    const s = shockRtr(rtr, rowPlanOf(q, ROW_CHANGE.fall).shock);
    expect(s[19] / s[7]).toBeCloseTo(0.7, 12);
    expect(s[7]).toBe(rtr[7]);
  });
});
