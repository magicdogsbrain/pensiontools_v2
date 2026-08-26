import { describe, it, expect, vi } from 'vitest';
vi.mock('../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { floorToAgeSvg, ftaDecadesSvg, FTA_FRAMES } from '../src/ui/floorToAgeGraphic.js';
import { createSimulationConfigFromSettings } from '../src/storage/StressRepository.js';
import { stressTestStrategy, planFromSettings } from '../src/strategies/stressTest.js';
import { realYieldForYear } from '../src/services/LinkerUniverse.js';

const settings = { equityMin: 720000, bondMin: 360000, cashTarget: 120000, isaBalance: 60000, duration: 35, baseSalary: 60000, other: 0,
  pa: 12570, brl: 50270, hrl: 125140, taxMode: 'inflates', protectionMult: 0.8, consecutiveLimit: 3, disableProtection: true, recoveryBuffer: 15000,
  hodlEnabled: false, hodlValue: 0, isaReturn: 0.03, statePension: 12480, statePensionYear: 10, incomeShape: 'phases', shapeAgeNow: 57,
  incomeSteps: [{ fromAge: 57, amount: 60000 }, { fromAge: 73, amount: 50000 }, { fromAge: 80, amount: 40000 }], strategyParams: { floorToAge: 80 } };

describe('floor-to-age graphic', () => {
  const cfg = createSimulationConfigFromSettings({}, settings);
  const p = { ...planFromSettings(settings, cfg, { yieldForYear: realYieldForYear }), mcRuns: 120, stride: 6 };
  const r = stressTestStrategy('floor-to-age', p);
  const sg = r.signature;
  const d = { years: sg.amountsByAge, startAge: 57, A: sg.A, floorToAge: 80, reserveCone: sg.reserveCone, restCostFull: sg.restCostFull, canBuy: sg.canBuy, levelIfCut: sg.levelIfCut, pot: 1260000, floorCost: sg.floorCost, sleeveE0: sg.sleeveE0 };
  it('the signature now carries the reserve band to A and the amounts by age', () => {
    expect(sg.reserveCone.length).toBe(sg.A + 1);
    expect(sg.reserveCone[0].p50).toBeCloseTo(sg.sleeveE0, -2);
    expect(sg.reserveCone[sg.A].p50).toBeCloseTo(sg.sleeveAtA.p50, -2);
    expect(sg.amountsByAge.length).toBe(35);
    expect(sg.amountsByAge[0]).toEqual({ age: 57, gross: 60000, sp: 0 });
  });
  it('four frames reveal: bars → contract + decision line → reserve band → the price at A', () => {
    expect(FTA_FRAMES.length).toBe(4);
    const f = [1, 2, 3, 4].map((n) => floorToAgeSvg(d, n));
    expect(f[0]).not.toContain('age 80');
    expect(f[1]).toContain('age 80');
    expect(f[1]).not.toContain('<polygon');
    expect(f[2]).toContain('<polygon');
    expect(f[3]).toContain('the rest of the schedule costs');
    expect(f[3]).toContain('decide here');
  });
  it('the three-starts chart draws one line per start and the cost line', () => {
    const svg = ftaDecadesSvg({ A: 23, floorToAge: 80, startAge: 57, paths: { 'from Jan 1966': Array(24).fill(300000), 'from Jan 1985': Array(24).fill(900000) }, restCostFull: 400000 });
    expect((svg.match(/<polyline/g) || []).length).toBe(2);
    expect(svg).toContain('what the rest of the schedule costs at 80');
  });
});
