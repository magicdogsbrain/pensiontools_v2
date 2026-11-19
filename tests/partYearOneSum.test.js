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
