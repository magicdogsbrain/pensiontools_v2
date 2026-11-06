/**
 * v6.2.1: the income steps carry their own slope (per-step decline % or a glide to the next step),
 * replacing the separate "spending profile"; and Buckets in order cuts spending on the whole SIPP
 * against the whole glidepath track, not on the cash-draw streak that its ordering always satisfies.
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));

import { amountAtAge, compileSteps, smileToSteps, scheduleFromSteps } from '../src/services/IncomeSchedule.js';
import { spendingSmileFactor } from '../src/services/SpendingModel.js';
import { simulate } from '../src/services/SimulationEngine.js';

describe('per-step decline and glide', () => {
  const steps = [{ fromAge: 60, amount: 60000, decline: 1 }, { fromAge: 72, amount: 50000, glideToNext: true }, { fromAge: 80, amount: 40000, decline: 2 }];
  it('a step declines by its own % per year, compounding, until the next step starts', () => {
    expect(amountAtAge(steps, 60)).toBe(60000);
    expect(amountAtAge(steps, 61)).toBeCloseTo(59400, 6);
    expect(amountAtAge(steps, 62)).toBeCloseTo(58806, 6);
    expect(amountAtAge(steps, 71)).toBeCloseTo(60000 * Math.pow(0.99, 11), 6);
  });
  it('glide walks in a straight line to the next step\'s amount, arriving as it starts', () => {
    expect(amountAtAge(steps, 72)).toBe(50000);
    expect(amountAtAge(steps, 76)).toBeCloseTo(45000, 6);
    expect(amountAtAge(steps, 79)).toBeCloseTo(50000 - 10000 * 7 / 8, 6);
    expect(amountAtAge(steps, 80)).toBe(40000);
  });
  it('the last step can only decline; a level step is level; before the first step the fallback applies', () => {
    expect(amountAtAge(steps, 85)).toBeCloseTo(40000 * Math.pow(0.98, 5), 6);
    expect(amountAtAge([{ fromAge: 60, amount: 30000 }], 90)).toBe(30000);
    expect(amountAtAge(steps, 55, 12345)).toBe(12345);
  });
  it('compileSteps builds the per-year schedule every engine reads; a saved schedule still wins in scheduleFromSteps', () => {
    const settings = { incomeShape: 'phases', incomeSteps: steps, shapeAgeNow: 60, duration: 30 };
    const sched = compileSteps(settings);
    expect(sched.length).toBe(31);
    expect(sched[0]).toBe(60000); expect(sched[16]).toBeCloseTo(45000, 6); expect(sched[25]).toBeCloseTo(40000 * Math.pow(0.98, 5), 6);
    expect(scheduleFromSteps({ ...settings, targetSchedule: [1, 2, 3] })).toEqual([1, 2, 3]);
    expect(compileSteps({ incomeShape: 'level', baseSalary: 40000 })).toBeNull();
  });
});

describe('migration: the old "Declining with age" profile becomes steps', () => {
  it('reproduces the Blanchett smile exactly on a level plan', () => {
    const ageNow = 60, base = 40000;
    const migrated = smileToSteps([{ fromAge: ageNow, amount: base }], ageNow);
    const sched = compileSteps({ incomeShape: 'phases', incomeSteps: migrated, shapeAgeNow: ageNow, duration: 35 });
    for (let y = 0; y <= 35; y++) expect(sched[y], 'year ' + y).toBeCloseTo(base * spendingSmileFactor(y, 'declining'), 0);
  });
  it('and on a stepped plan, step by step', () => {
    const ageNow = 57, steps = [{ fromAge: 57, amount: 60000 }, { fromAge: 72, amount: 50000 }, { fromAge: 80, amount: 40000 }];
    const migrated = smileToSteps(steps, ageNow);
    const sched = compileSteps({ incomeShape: 'phases', incomeSteps: migrated, shapeAgeNow: ageNow, duration: 38 });
    const old = (y) => amountAtAge(steps, ageNow + y) * spendingSmileFactor(y, 'declining');
    for (let y = 0; y <= 38; y++) expect(sched[y], 'year ' + y).toBeCloseTo(old(y), 0);
  });
});

describe('Buckets in order: spending cuts judged on the whole SIPP against the whole track', () => {
  const flat = (years, r) => { const eq = {}, inf = {}; for (let i = 0; i < years; i++) { eq[i] = r(i); inf[i] = 0.025; } return { equity: eq, inflation: inf }; };
  const cfg = { equityStart: 400000, bondStart: 200000, cashStart: 100000, equityMin: 400000, bondMin: 200000, cashTarget: 100000, duration: 33, years: 12,
    baseSalary: 30000, other: 0, statePension: 0, statePensionYear: 99, pa: 12570, brl: 50270, hrl: 125140, taxMode: 'inflates',
    disableProtection: false, protectionMult: 0.8, consecutiveLimit: 3, recoveryBuffer: 15000, hodlEnabled: false, hodlValue: 0, sourcingMode: 'ordered', bucketBand: 0.1 };
  it('a benign market no longer cuts spending just because cash is drawn first', () => {
    const r = simulate(cfg, flat(12, () => 0.06), 7);
    expect(r.failed).toBe(false);
    expect(r.protMonths).toBeLessThan(12);
  });
  it('a real slump still cuts, and the same slump under Pots & Valves cuts too', () => {
    const crash = flat(12, (i) => (i < 2 ? -0.35 : 0.04));
    const b = simulate(cfg, crash, 7);
    expect(b.protMonths).toBeGreaterThan(6);
    const pv = simulate({ ...cfg, sourcingMode: undefined, bucketBand: undefined }, crash, 7);
    expect(pv.protMonths).toBeGreaterThan(0);
  });
});

import { amountAtAge as graphicAmount, incomeStaircaseSvg } from '../src/ui/incomeShapeGraphic.js';
describe('floors and the picture', () => {
  it('a decline never goes below zero, a glide never below the next step', () => {
    expect(amountAtAge([{ fromAge: 60, amount: 30000, decline: 50 }], 120)).toBeGreaterThanOrEqual(0);
    expect(amountAtAge([{ fromAge: 60, amount: 30000, glideToNext: true }, { fromAge: 70, amount: 20000 }], 69.99)).toBeGreaterThanOrEqual(20000);
  });
  it('the graphic uses the engines\' definition of £-at-an-age and floors at guaranteed income', () => {
    expect(graphicAmount).toBe(amountAtAge);
    const steps = [{ fromAge: 60, amount: 30000, decline: 5 }];
    const svg = incomeStaircaseSvg({ steps, ageNow: 60, horizonAge: 79, floorVals: Array.from({ length: 20 }, (_, y) => (y >= 7 ? 12000 : 0)) });
    const vals = svg.match(/data-vals="([^"]+)"/)[1].split(',').map(Number);
    expect(vals[0]).toBe(30000);
    expect(vals[1]).toBe(28500);
    expect(Math.min(...vals.slice(7))).toBeGreaterThanOrEqual(12000);   // never below the State Pension once it pays
    expect(vals[19]).toBe(12000);                                        // 30000 × 0.95^19 ≈ 11,300 → floored
    expect(svg).toMatch(/data-line="1"/); expect(svg).toMatch(/data-pot="1"/);
  });
});

describe('the picture shows streams as layers and lump sums / spends as markers', () => {
  it('draws a marker per dated event and a layer for a stream', () => {
    const svg = incomeStaircaseSvg({ steps: [{ fromAge: 60, amount: 40000 }], ageNow: 60, horizonAge: 89,
      other: [{ annual: 14000, fromAge: 60, toAge: 65, label: 'rent' }],
      events: [{ age: 65, amount: 600000, label: 'house sale', kind: 'in' }, { age: 62, amount: 30000, label: 'car', kind: 'out', years: 1 }] });
    expect(svg).toMatch(/▲ £600k house sale/);
    expect(svg).toMatch(/▼ £30k car/);
    expect((svg.match(/data-event="1"/g) || []).length).toBe(2);
    expect(svg).toMatch(/other income £14k/);          // the rent layer in a bar's title
  });
});

import { buildGiltLadder, cashCostFactor } from '../src/strategies/GiltLadderPlan.js';
import { activeLinkers } from '../src/services/LinkerUniverse.js';
describe('cash years in the gilt ladder are not free', () => {
  it('£1 of need k years out costs 1.01^(k−1) of cash today; fifteen cash years cost more than two', () => {
    expect(cashCostFactor(1)).toBe(1); expect(cashCostFactor(2)).toBeCloseTo(1.01, 9); expect(cashCostFactor(15)).toBeCloseTo(Math.pow(1.01, 14), 9);
    const base = { pot: 2000000, startAge: 60, durationYears: 30, amountAtAge: () => 40000, spAnnual: 0, spStartAge: 99, firstTaxYear: 2027, linkers: activeLinkers().gilts, todayIso: '2026-09-08' };
    const two = buildGiltLadder({ ...base, cashYears: 2 }), fifteen = buildGiltLadder({ ...base, cashYears: 15 });
    expect(fifteen.cash).toBeGreaterThan(40000 * 15);                 // more than face
    expect(fifteen.cash).toBeCloseTo(40000 * Array.from({ length: 15 }, (_, i) => cashCostFactor(i + 1)).reduce((a, b) => a + b, 0), 3);
    if (two.affordable && fifteen.affordable) expect(fifteen.total).toBeGreaterThanOrEqual(two.total * 0.98);   // cash is at least as dear as short linkers at today's real yields
  });
});
