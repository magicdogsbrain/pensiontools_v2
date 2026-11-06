/**
 * How ISAs and savings grow, in the saving-years projections (research/saver-lock-and-savings-growth.md 2c, test 8): the
 * Timing block's pots at retirement (projectedPotAtRetirement), the retire-at-what-age sweep's ISA (isaAtAge), and the
 * one new option on projectAccumulation (`fixedNominal`, the cash line).
 *
 *   - No choice on the plan (a plan locked before it): every projection is today's, figure for figure — the ISA at the FCA
 *     middle band in the Timing block, at 2% a year after prices in the sweep, nothing paid in.
 *   - "Mostly cash": the cash rule at the planner's 2.5% prices, max(0, 2.5% − 1%) = 1.5% a year, less charges.
 *   - "Invested like my pension": the pension's own line — its mix line when holdings are tagged, else the middle band.
 *   - With a choice, what goes into ISAs and savings each month (accumulation.isaMonthly) is paid in, rising with the
 *     planner's "Raise contributions by"; the pension's side never moves.
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { projectAccumulation, FCA_RATES } from '../src/services/AccumulationEngine.js';
import { projectedPotAtRetirement } from '../src/services/PlanTiming.js';
import { potAtAge, isaAtAge } from '../src/services/RetireSweep.js';
import { proportions } from '../src/services/Holdings.js';
import { monthlyChargeFactor, yearlyChargeFactor } from '../src/services/Charges.js';

const rel = (a, b) => Math.abs(a - b) / Math.max(1, Math.abs(a), Math.abs(b));
const NOW = new Date(2026, 8, 10);

describe('projectAccumulation: the cash line (fixedNominal)', () => {
  const base = { currentAge: 50, retirementAge: 62, potNow: 250000, totalMonthly: 900, escalationPct: 2, mixRealReturn: 0.035 };
  it('without it, today\'s projection, row for row', () => {
    const a = projectAccumulation(base);
    expect(projectAccumulation({ ...base, fixedNominal: null })).toEqual(a);
    expect(projectAccumulation({ ...base, fixedNominal: undefined })).toEqual(a);
    expect(projectAccumulation({ ...base, fixedNominal: 'x' })).toEqual(a);
  });
  it('with it, every line at the one nominal rate (a twelfth root a month), no mix line; nothing paid in: pot × (q × m)^(12y) / 1.025^y', () => {
    for (const pct of [0, 0.5]) {
      const r = 0.015, years = 12, m = monthlyChargeFactor(pct), q = Math.pow(1 + r, 1 / 12);
      const rows = projectAccumulation({ currentAge: 50, retirementAge: 50 + years, potNow: 40000, totalMonthly: 0, chargesPct: pct, fixedNominal: r, mixRealReturn: 0.04 });
      for (const y of [1, 6, years]) {
        const want = 40000 * Math.pow(q * m, 12 * y) / Math.pow(1.025, y);
        for (const k of ['potLow', 'potMid', 'potHigh']) expect(rel(rows[y][k], want), `${k} y${y} at ${pct}%`).toBeLessThan(1e-12);
        expect('potMix' in rows[y]).toBe(false);
      }
    }
  });
  it('with it and a payment: the payment goes in at the end of each month and rises once a year, as the other lines\' do', () => {
    const r = 0.015, years = 3, q = Math.pow(1 + r, 1 / 12);
    const rows = projectAccumulation({ currentAge: 0, retirementAge: years, potNow: 1000, totalMonthly: 100, escalationPct: 10, fixedNominal: r });
    let pot = 1000, pay = 100;
    for (let y = 0; y < years; y++) { for (let k = 0; k < 12; k++) pot = pot * q + pay; pay *= 1.1; }
    expect(rel(rows[years].potMid, pot / Math.pow(1.025, years))).toBeLessThan(1e-12);
    expect(rows[years].contributedToDate).toBeCloseTo(1200 + 1320 + 1452, 6);
  });
});

describe('the Timing block\'s pots at retirement (projectedPotAtRetirement)', () => {
  const pre = { currentAge: 50, currentAgeAsOf: '2026-09-09', retired: false, retireAge: 60, equityMin: 300000, bondMin: 150000, cashTarget: 50000, isaBalance: 40000, chargesPct: 0.5 };
  const acc = { netMonthly: 800, salary: 60000, schemeType: 'ras', employerMonthly: 400, escalationPct: 2, isaMonthly: 250 };

  it('no choice: today\'s figures, the ISA box ignored (nothing paid in), whatever the Accumulation planner says', () => {
    const { isaMonthly, ...accWithout } = acc;
    void isaMonthly;
    const a = projectedPotAtRetirement(pre, accWithout, NOW);
    expect(projectedPotAtRetirement(pre, acc, NOW)).toEqual(a);
    expect(projectedPotAtRetirement({ ...pre, isaGrowth: 'Cash' }, acc, NOW)).toEqual(a);
    const years = a.years, m = monthlyChargeFactor(0.5);
    expect(Math.abs(a.isa - 40000 * Math.pow((1 + FCA_RATES.mid / 12) * m, 12 * years) / Math.pow(1.025, years))).toBeLessThanOrEqual(0.5);
  });

  it('"Mostly cash", nothing paid in: 1.5% a year less charges, in today\'s money; the pension side unchanged', () => {
    const { isaMonthly, ...accWithout } = acc;
    void isaMonthly;
    const a = projectedPotAtRetirement(pre, accWithout, NOW);
    const c = projectedPotAtRetirement({ ...pre, isaGrowth: 'cash' }, accWithout, NOW);
    const years = c.years, m = monthlyChargeFactor(0.5);
    expect(Math.abs(c.isa - 40000 * Math.pow(Math.pow(1.015, 1 / 12) * m, 12 * years) / Math.pow(1.025, years))).toBeLessThanOrEqual(0.5);
    expect(c.isa).toBeLessThan(40000);                                    // about 1% a year of buying power lost, and the charge
    expect([c.sipp, c.low, c.high, c.years, c.source, c.hasContributions]).toEqual([a.sipp, a.low, a.high, a.years, a.source, a.hasContributions]);
  });

  it('"Invested like my pension", nothing paid in: the middle band, as before the choice', () => {
    const { isaMonthly, ...accWithout } = acc;
    void isaMonthly;
    expect(projectedPotAtRetirement({ ...pre, isaGrowth: 'invested' }, accWithout, NOW)).toEqual(projectedPotAtRetirement(pre, accWithout, NOW));
  });

  it('with a choice, what goes into ISAs each month is paid in (rising with the planner\'s raise): the ISA is the projection with it', () => {
    for (const isaGrowth of ['cash', 'invested']) {
      const p = projectedPotAtRetirement({ ...pre, isaGrowth }, acc, NOW);
      const rows = projectAccumulation({ currentAge: 0, retirementAge: p.years, potNow: 40000, totalMonthly: 250, escalationPct: 2, chargesPct: 0.5, ...(isaGrowth === 'cash' ? { fixedNominal: 0.015 } : {}) });
      expect(p.isa, isaGrowth).toBe(Math.round(rows[rows.length - 1].potMid));
      expect(p.isa).toBeGreaterThan(projectedPotAtRetirement({ ...pre, isaGrowth }, { ...acc, isaMonthly: 0 }, NOW).isa);
    }
    // "invested" ahead of "cash" at the FCA middle band (5% against 1.5%)
    expect(projectedPotAtRetirement({ ...pre, isaGrowth: 'invested' }, acc, NOW).isa).toBeGreaterThan(projectedPotAtRetirement({ ...pre, isaGrowth: 'cash' }, acc, NOW).isa);
    // a negative or nonsense box pays in nothing
    expect(projectedPotAtRetirement({ ...pre, isaGrowth: 'cash' }, { ...acc, isaMonthly: -50 }, NOW)).toEqual(projectedPotAtRetirement({ ...pre, isaGrowth: 'cash' }, { ...acc, isaMonthly: 0 }, NOW));
  });

  it('retired: today\'s pots, whatever the choice', () => {
    const retired = { ...pre, retired: true, retireAge: null };
    expect(projectedPotAtRetirement({ ...retired, isaGrowth: 'cash' }, acc, NOW)).toEqual(projectedPotAtRetirement(retired, acc, NOW));
  });
});

describe('the retire-at-what-age sweep\'s ISA (isaAtAge)', () => {
  const ledger = [
    { ticker: 'VLS80', value: 300000, wrapper: 'SIPP', ocf: 0.22, contribution: 1500 },
    { ticker: 'CSH2', value: 20000, wrapper: 'SIPP', ocf: 0.10 }
  ];
  const acc = { netMonthly: 800, salary: 60000, schemeType: 'ras', employerMonthly: 400, isaMonthly: 300, escalationPct: 0 };

  it('no choice: today\'s rule exactly — the ISA × 1.02^years × the charge, nothing paid in', () => {
    for (const pct of [undefined, 0.5]) {
      const settings = { isaBalance: 60000, ...(pct ? { chargesPct: pct } : {}) };
      const got = isaAtAge({ settings, accumulation: acc, currentAge: 55, age: 62, holdings: ledger });
      expect(got.isa).toBe(Math.round(60000 * Math.pow(1.02, 7) * yearlyChargeFactor(pct || 0, 7)));
      expect(got.basis).toBe(null);
    }
    expect(isaAtAge({ settings: { isaBalance: 0 }, accumulation: acc, currentAge: 55, age: 62 }).isa).toBe(0);
  });

  it('"Mostly cash": 1.5% a year less charges with the ISA box paid in', () => {
    const settings = { isaBalance: 60000, chargesPct: 0.5, isaGrowth: 'cash' };
    const got = isaAtAge({ settings, accumulation: acc, currentAge: 55, age: 62, holdings: ledger });
    const rows = projectAccumulation({ currentAge: 0, retirementAge: 7, potNow: 60000, totalMonthly: 300, chargesPct: 0.5, fixedNominal: 0.015 });
    expect(got.isa).toBe(Math.round(rows[7].potMid));
    expect(got.basis).toBe('cash');
  });

  it('"Invested like my pension": the pension\'s own line — the holdings\' mix line when tagged, else the middle band', () => {
    const settings = { isaBalance: 60000, chargesPct: 0.5, isaGrowth: 'invested' };
    const tagged = isaAtAge({ settings, accumulation: acc, currentAge: 55, age: 62, holdings: ledger });
    const prop = proportions(ledger);
    const want = projectAccumulation({ currentAge: 0, retirementAge: 7, potNow: 60000, totalMonthly: 300, mixRealReturn: prop.expectedReal, chargesPct: 0.5, mixOcf: prop.weightedOcf });
    expect(tagged.isa).toBe(Math.round(want[7].potMix));
    expect(tagged.basis).toBe(potAtAge({ settings, accumulation: acc, currentAge: 55, age: 62, holdings: ledger }).basis);
    const untagged = isaAtAge({ settings, accumulation: acc, currentAge: 55, age: 62 });
    const mid = projectAccumulation({ currentAge: 0, retirementAge: 7, potNow: 60000, totalMonthly: 300, chargesPct: 0.5 });
    expect(untagged.isa).toBe(Math.round(mid[7].potMid));
    expect(untagged.basis).toBe('FCA middle band');
  });

  it('with a choice and only what is paid in (no ISA today): the pay-ins alone', () => {
    const got = isaAtAge({ settings: { isaBalance: 0, isaGrowth: 'cash' }, accumulation: acc, currentAge: 55, age: 60 });
    expect(got.isa).toBeGreaterThan(5 * 12 * 300 * 0.9);
  });
});
