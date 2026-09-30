/**
 * Bug replays — the simulation engine, the strategy comparison and the figures it puts on the cards.
 * Ids are from research/bug-replay-catalogue.md. (B4, B7 and G4 are replayed by tests/qaFixes.test.js, written
 * with the fix; they run a full comparison each and are not repeated here.)
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));

import { simulate, analyzeResults } from '../../src/services/SimulationEngine.js';
import { buildGiltLadder, cashCostFactor } from '../../src/strategies/GiltLadderPlan.js';
import { activeLinkers } from '../../src/services/LinkerUniverse.js';
import { amountAtAge } from '../../src/services/IncomeSchedule.js';
import { amountAtAge as pictureAmount, incomeStaircaseSvg } from '../../src/ui/incomeShapeGraphic.js';
import { formatCurrency } from '../../src/utils/FormatUtils.js';

/** A hand-written market: the same return every year except where `r` says otherwise; 2.5% inflation. */
const market = (years, r) => { const equity = {}, inflation = {}; for (let i = 0; i < years; i++) { equity[i] = r(i); inflation[i] = 0.025; } return { equity, inflation }; };
// The usual preset shape: floors equal to the starting pots (the reason "protection engaged" is nearly universal).
const plan = { equityStart: 400000, bondStart: 200000, cashStart: 100000, equityMin: 400000, bondMin: 200000, cashTarget: 100000, duration: 33, years: 12,
  baseSalary: 30000, other: 0, statePension: 0, statePensionYear: 99, pa: 12570, brl: 50270, hrl: 125140, taxMode: 'inflates',
  disableProtection: false, protectionMult: 0.8, consecutiveLimit: 3, recoveryBuffer: 15000, hodlEnabled: false, hodlValue: 0 };

describe('spending cuts', () => {
  // TODO(live finding, 30 Sep 2026 — not fixed here, src is out of this step's scope): G3's fix (6.2.1, "fairer cuts for
  // Buckets in order") cannot be replayed, because putting the old rule back does not make things worse — it makes them
  // better. Evidence, from the engines themselves (git archive of the commit before 6.2.1 against 6.2.1, 300 seeded
  // futures each, floors equal to the pots, 30 years, spending cuts on):
  //     plan                 before 6.2.1                      6.2.1 (and today)
  //     £600k / £32k a year  64% of futures, 64 months each    70% of futures, 89 months each
  //     £700k / £30k         59%, 37 months                    67%, 61 months
  //     £1m   / £35k         56%, 30 months                    64%, 43 months
  // and in hand-written markets: a flat 5% a year (2.5% real) gave 0 protection months before and 15 now; a flat 4%
  // gave 0 before and 114 now. The release note promised "fewer cut months". The guard written with the fix
  // (tests/incomeTaper.test.js, "a benign market no longer cuts…", flat 6%) passes on BOTH rules, so it guards nothing.
  // The audit's own plan (P2: UFPLS, recycling, a declining spend) may still have improved — that was never pinned.
  // Needs the owner's ruling on what the rule should be before a replay can assert it.
  it.skip('G3 (LIVE) — Buckets in order does not cut spending in a benign market just because it draws cash first', () => {
    const r = simulate({ ...plan, sourcingMode: 'ordered', bucketBand: 0.1 }, market(12, () => 0.05), 7);
    expect(r.failed).toBe(false);
    expect(r.protMonths).toBe(0);                   // today: 15. The rule it replaced: 0.
  });

  it('P13 — "had to cut back" counts futures where income went unpaid, not futures where protection engaged', () => {
    const f = (o) => ({ failed: false, years: 30, duration: 30, final: 100000, finalReal: 50000, finalIsa: 0, cumInflation: 2, startIsa: 0, isaLastedYears: 0, higherRateYears: 0, totalTaxReal: 0, isaByYear: [], maxConsec: 3, avgInflation: 0.02, avgEquityReturn: 0.05, earlyEquityReturn: 0.05, cutYears: 0, cutReal: 0, ...o });
    // Three futures, protection engaged in all of them; income was actually short in one, and one ran out.
    const a = analyzeResults([f({ protMonths: 14 }), f({ protMonths: 30, cutYears: 2, cutReal: 4000 }), f({ protMonths: 60, failed: true, years: 22 })]);
    expect(a.protection.pctWithProtection).toBe(100);                  // the old tile: "100 in 100"
    expect(a.cuts.runsWithCut).toBe(2);
    expect(a.cuts.pctWithCut).toBeCloseTo(200 / 3, 5);                 // the honest one: 67 in 100
  });

  it('P13 — the engine records a cut only for a tax year left more than 1% short; with protection off there is none', () => {
    const slump = market(12, (i) => (i < 2 ? -0.35 : 0.04)), calm = market(12, () => 0.08);
    const on = simulate(plan, slump, 7);
    expect(on.protMonths).toBeGreaterThan(0);
    expect(on.cutYears).toBeGreaterThan(0);
    expect(on.cutYears).toBeLessThanOrEqual(12);
    expect(on.cutReal).toBeGreaterThan(0);
    const off = simulate({ ...plan, disableProtection: true }, slump, 7);
    expect([off.cutYears, off.cutReal]).toEqual([0, 0]);
    const fine = simulate(plan, calm, 7);
    expect([fine.protMonths, fine.cutYears, fine.cutReal]).toEqual([0, 0, 0]);
  });
});

describe('what is left at the end', () => {
  it('P14 — counts every pot: a plan with £400k in its ISA is not "£0 typically left"', () => {
    const f = (o) => ({ failed: false, years: 10, duration: 10, finalReal: 0, finalIsa: 0, cumInflation: 1, startIsa: 1000, isaLastedYears: 10, higherRateYears: 0, totalTaxReal: 0, isaByYear: [], protMonths: 0, maxConsec: 0, avgInflation: 0.02, avgEquityReturn: 0.05, earlyEquityReturn: 0.05, ...o });
    // The Downsizer: pension pot drawn to nil in every future, the house money sitting in the ISA.
    const a = analyzeResults([f({ finalIsa: 800000, cumInflation: 2 }), f({ finalIsa: 900000, cumInflation: 2 }), f({ finalIsa: 1260000, cumInflation: 2 })]);
    expect(a.finalReal.p50).toBe(0);                   // the pension pot alone — what the headline used to show
    expect(a.finalAllReal.p50).toBe(450000);           // today's money, ISA included
    expect(a.finalAllReal.min).toBe(400000);
  });
});

describe('the gilt ladder\'s cash years', () => {
  it('R6.2.7 — cash set aside for later years costs inflation less 1% a year; it is not free', () => {
    expect(cashCostFactor(1)).toBe(1);
    expect(cashCostFactor(2)).toBeCloseTo(1.01, 9);
    const base = { pot: 2000000, startAge: 60, durationYears: 30, amountAtAge: () => 40000, spAnnual: 0, spStartAge: 99, firstTaxYear: 2027, linkers: activeLinkers().gilts, todayIso: '2026-09-08' };
    const fifteen = buildGiltLadder({ ...base, cashYears: 15 });
    const face = 40000 * 15;
    expect(fifteen.cash).toBeGreaterThan(face * 1.05);                 // about 7% dearer than face, as the release note says
    expect(fifteen.cash).toBeCloseTo(40000 * Array.from({ length: 15 }, (_, i) => 1.01 ** i).reduce((a, b) => a + b, 0), 3);
  });
});

describe('the income-shape picture', () => {
  it('R6.2.4-a — draws the slopes the engines run, not its own flat steps', () => {
    expect(pictureAmount).toBe(amountAtAge);           // one definition of £-at-an-age
    const svg = incomeStaircaseSvg({ steps: [{ fromAge: 60, amount: 30000, decline: 5 }], ageNow: 60, horizonAge: 64 });
    const vals = svg.match(/data-vals="([^"]+)"/)[1].split(',').map(Number);
    expect(vals).toEqual([30000, 28500, 27075, 25721, 24435]);
  });

  it('R6.2.4-c — the shape never dips below the guaranteed income of the year', () => {
    const svg = incomeStaircaseSvg({ steps: [{ fromAge: 60, amount: 30000, decline: 5 }], ageNow: 60, horizonAge: 79, floorVals: Array.from({ length: 20 }, (_, y) => (y >= 7 ? 12000 : 0)) });
    const vals = svg.match(/data-vals="([^"]+)"/)[1].split(',').map(Number);
    expect(vals[19]).toBe(12000);                      // 30,000 × 0.95^19 ≈ 11,300 → held at the State Pension
    expect(Math.min(...vals.slice(7))).toBeGreaterThanOrEqual(12000);
  });

  it('R6.2.5 — income streams are drawn as layers, lump sums and one-off spends as markers', () => {
    const svg = incomeStaircaseSvg({ steps: [{ fromAge: 60, amount: 40000 }], ageNow: 60, horizonAge: 89,
      other: [{ annual: 14000, fromAge: 60, toAge: 65, label: 'rent' }],
      events: [{ age: 65, amount: 600000, label: 'house sale', kind: 'in' }, { age: 62, amount: 30000, label: 'car', kind: 'out', years: 1 }] });
    expect(svg).toMatch(/other income £14k/);
    expect((svg.match(/data-event="1"/g) || []).length).toBe(2);
  });
});

describe('money on screen', () => {
  it('C1 — nothing is "£0.00"; small amounts keep their pence', () => {
    expect(formatCurrency(0)).toBe('£0');
    expect(formatCurrency(45.4)).toBe('£45.40');
    expect(formatCurrency(32000)).toBe('£32,000');
  });
});
