/**
 * Fund and platform charges in the saving-years projections and the deterministic tables (research/charges-setting.md
 * T5, R4, D6): projectAccumulation (the Accumulation planner, the Timing block's pots at retirement, the plan document's
 * accumulation path, the retire-at-what-age sweep), the sweep's ISA, and the drawdown schedule's ISA line.
 *
 *   - Without a charge (absent or 0) every projection is today's, row for row.
 *   - With a charge c and nothing paid in, each FCA line is pot × ((1 + r/12) × (1 − c)^(1/12))^(12y), deflated.
 *   - The "your mix" line: the holdings list's own fund charges (OCF) are already taken off the mix's return; with a
 *     plan charge the plan's ONE setting replaces them (R4) — never both.
 *   - The Decision tool's plan of record (D6) does not take the Stress setting off, even if handed it.
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { projectAccumulation, FCA_RATES } from '../src/services/AccumulationEngine.js';
import { projectedPotAtRetirement, deriveTiming } from '../src/services/PlanTiming.js';
import { potAtAge } from '../src/services/RetireSweep.js';
import { buildAccumulationPath, buildPlanDocument } from '../src/services/PlanDocument.js';
import { generateDrawdownSchedule } from '../src/services/DrawdownService.js';
import { proportions } from '../src/services/Holdings.js';
import { monthlyChargeFactor } from '../src/services/Charges.js';

const rel = (a, b) => Math.abs(a - b) / Math.max(1, Math.abs(a), Math.abs(b));
const ledger = [
  { ticker: 'VLS80', value: 300000, wrapper: 'SIPP', ocf: 0.22, contribution: 1500 },
  { ticker: 'VWRP', value: 100000, wrapper: 'ISA', ocf: 0.22 },
  { ticker: 'CSH2', value: 20000, wrapper: 'SIPP', ocf: 0.10 }
];

describe('projectAccumulation', () => {
  const base = { currentAge: 50, retirementAge: 62, potNow: 250000, totalMonthly: 900, escalationPct: 2, mixRealReturn: 0.035 };
  it('without a charge (absent or 0) it is today\'s projection, row for row', () => {
    const a = projectAccumulation(base);
    expect(projectAccumulation({ ...base, chargesPct: 0 })).toEqual(a);
    expect(projectAccumulation({ ...base, chargesPct: 0, mixOcf: 0.002 })).toEqual(a);   // the OCF only matters when the plan charge replaces it
    expect(projectAccumulation({ ...base, chargesPct: 'x' })).toEqual(a);
  });
  it('nothing paid in: each FCA line is pot × ((1 + r/12) × (1 − c)^(1/12))^(12y), in today\'s money', () => {
    const pct = 0.5, years = 15, m = monthlyChargeFactor(pct);
    const rows = projectAccumulation({ currentAge: 50, retirementAge: 50 + years, potNow: 100000, totalMonthly: 0, chargesPct: pct });
    for (const [key, r] of [['potLow', FCA_RATES.low], ['potMid', FCA_RATES.mid], ['potHigh', FCA_RATES.high]]) {
      for (const y of [1, 7, years]) {
        expect(rel(rows[y][key], 100000 * Math.pow((1 + r / 12) * m, 12 * y) / Math.pow(1.025, y)), `${key} y${y}`).toBeLessThan(1e-12);
      }
    }
  });
  it('a charge only lowers the lines, and more charge lowers them more', () => {
    let last = projectAccumulation(base);
    for (const pct of [0.25, 0.5, 1, 3]) {
      const rows = projectAccumulation({ ...base, chargesPct: pct });
      const L = rows.length - 1;
      for (const k of ['potLow', 'potMid', 'potHigh', 'potMix']) expect(rows[L][k], `${k} at ${pct}%`).toBeLessThan(last[L][k]);
      expect(rows[L].contributedToDate).toBe(last[L].contributedToDate);   // what is paid in is what is paid in
      last = rows;
    }
  });
  it('the mix line: the plan\'s charge replaces the funds\' own charges (mixOcf) — the mix is grown before them, then charged', () => {
    const pct = 0.6, ocf = 0.0022;
    const replaced = projectAccumulation({ ...base, chargesPct: pct, mixOcf: ocf });
    const asIfGross = projectAccumulation({ ...base, mixRealReturn: base.mixRealReturn + ocf, chargesPct: pct });
    expect(replaced.map((r) => r.potMix)).toEqual(asIfGross.map((r) => r.potMix));
    // and the FCA lines are unaffected by mixOcf
    expect(replaced.map((r) => r.potMid)).toEqual(asIfGross.map((r) => r.potMid));
  });
});

describe('the callers pass the plan\'s charge', () => {
  const NOW = new Date(2026, 8, 10);
  const pre = { currentAge: 50, currentAgeAsOf: '2026-09-09', retired: false, retireAge: 60, equityMin: 300000, bondMin: 150000, cashTarget: 50000, isaBalance: 100000 };
  const acc = { netMonthly: 800, salary: 60000, schemeType: 'ras', employerMonthly: 400 };

  it('projectedPotAtRetirement (the Timing block): lower SIPP and ISA at a charge; the same without', () => {
    const a = projectedPotAtRetirement(pre, acc, NOW);
    expect(projectedPotAtRetirement({ ...pre, chargesPct: 0 }, acc, NOW)).toEqual(a);
    const b = projectedPotAtRetirement({ ...pre, chargesPct: 0.5 }, acc, NOW);
    expect(b.sipp).toBeLessThan(a.sipp);
    expect(b.isa).toBeLessThan(a.isa);
    expect(b.low).toBeLessThan(a.low);
    expect(b.high).toBeLessThan(a.high);
    // nothing paid into the ISA: exactly the FCA middle band less the charge, to the pound
    const years = b.years, m = monthlyChargeFactor(0.5);
    expect(Math.abs(b.isa - 100000 * Math.pow((1 + FCA_RATES.mid / 12) * m, 12 * years) / Math.pow(1.025, years))).toBeLessThanOrEqual(0.5);
  });

  it('potAtAge (the retire-at-what-age sweep): lower at a charge, the same without; the mix line drops the list\'s OCF for the plan charge', () => {
    const settings = { currentAge: 55 };
    const a = potAtAge({ settings, accumulation: acc, currentAge: 55, age: 62, holdings: ledger });
    expect(potAtAge({ settings: { ...settings, chargesPct: 0 }, accumulation: acc, currentAge: 55, age: 62, holdings: ledger })).toEqual(a);
    const b = potAtAge({ settings: { ...settings, chargesPct: 0.5 }, accumulation: acc, currentAge: 55, age: 62, holdings: ledger });
    expect(b.basis).toBe('your mix');
    expect(b.low).toBeLessThan(a.low);
    expect(b.high).toBeLessThan(a.high);
    const prop = proportions(ledger);
    const want = projectAccumulation({ currentAge: 0, retirementAge: 7, potNow: a.potNow, totalMonthly: a.totalMonthly, mixRealReturn: prop.expectedReal + prop.weightedOcf, chargesPct: 0.5 });
    expect(b.pot).toBe(Math.round(want[7].potMix));
  });

  it('buildAccumulationPath (the plan document): the path takes the charge; the document records it', () => {
    const settings = { currentAge: 58, currentAgeAsOf: '2026-09-10', retired: false, retireAge: 60, equityMin: 500000, bondMin: 200000, cashTarget: 50000, baseSalary: 40000, duration: 30, incomeShape: 'phases', incomeSteps: [{ fromAge: 60, amount: 40000 }] };
    const t = deriveTiming(settings, NOW);
    const a = buildAccumulationPath({ settings, timing: t, accumulation: acc, holdings: ledger });
    expect(buildAccumulationPath({ settings: { ...settings, chargesPct: 0 }, timing: t, accumulation: acc, holdings: ledger }).path).toEqual(a.path);
    const b = buildAccumulationPath({ settings: { ...settings, chargesPct: 0.5 }, timing: t, accumulation: acc, holdings: ledger });
    expect(b.chargesPct).toBe(0.5);
    expect(b.path[2].potMid).toBeLessThan(a.path[2].potMid);
    expect(b.path[2].potMix).toBeLessThan(a.path[2].potMix + 1);   // the OCF replaced by a larger plan charge
    const doc = buildPlanDocument({ settings: { ...settings, chargesPct: 0.75 }, now: NOW });
    expect(doc.assumptions.chargesPct).toBe(0.75);
    expect(buildPlanDocument({ settings, now: NOW }).assumptions.chargesPct).toBe(0);
  });
});

describe('the drawdown schedule (the Stress tester\'s deterministic table)', () => {
  const settings = { baseSalary: 70000, isaBalance: 150000, pa: 12570, brl: 50270, hrl: 125140, taxMode: 'frozen', spStartDate: null, statePension: 0, statePensionYear: 99, accessMethod: 'drawdown' };
  it('the ISA line takes the plan\'s charge from the settings; none (or 0) is today\'s table', () => {
    const a = generateDrawdownSchedule(settings, 20, 0.03);
    expect(generateDrawdownSchedule({ ...settings, chargesPct: 0 }, 20, 0.03)).toEqual(a);
    const b = generateDrawdownSchedule({ ...settings, chargesPct: 1 }, 20, 0.03);
    expect(b[1].isaBalance).toBeCloseTo((a[0].isaBalance - a[0].isaDraw) * (1 + 0.02) * 0.99, 6);
    expect(b.some((r, i) => r.isaBalance < a[i].isaBalance)).toBe(true);
    expect(b.every((r, i) => r.isaBalance <= a[i].isaBalance + 1e-9)).toBe(true);
  });
  it('an explicit chargesPct option wins over the settings (the plan of record passes 0: D6)', () => {
    const a = generateDrawdownSchedule(settings, 20, 0.03);
    expect(generateDrawdownSchedule({ ...settings, chargesPct: 2 }, 20, 0.03, undefined, { chargesPct: 0 })).toEqual(a);
    expect(generateDrawdownSchedule(settings, 20, 0.03, undefined, { chargesPct: 1 })).toEqual(generateDrawdownSchedule({ ...settings, chargesPct: 1 }, 20, 0.03));
  });
});
