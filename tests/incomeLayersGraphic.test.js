import { describe, it, expect, vi } from 'vitest';
vi.mock('../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { incomeLayersSvg, incomeLayersRows } from '../src/ui/incomeLayersGraphic.js';
import { createSimulationConfigFromSettings } from '../src/storage/StressRepository.js';
import { planFromSettings, stressTestStrategy, lumpyByYear } from '../src/strategies/stressTest.js';
import { realYieldForYear } from '../src/services/LinkerUniverse.js';

const base = { duration: 20, other: 0, pa: 12570, brl: 50270, hrl: 125140, taxMode: 'inflates', protectionMult: 0.8, consecutiveLimit: 3, disableProtection: false, recoveryBuffer: 15000, isaReturn: 0.03, statePension: 11500, statePensionYear: 10,
  equityMin: 300000, bondMin: 150000, cashTarget: 50000, isaBalance: 0, baseSalary: 30000 };

describe('lumpy items reach every strategy through the plan', () => {
  it('DB income lowers the ladder need; an extra spend raises it in its year only', () => {
    const settings = { ...base, dbAmount: 6000, dbStartYear: 5, dbIndexation: 'cpi', extraWithdrawals: [{ label: 'car', amount: 20000, year: 3, years: 1 }] };
    const cfg = createSimulationConfigFromSettings({}, settings);
    expect(cfg.extraWithdrawals.length).toBe(1);
    const { otherIncomeByYear, extraNeedByYear } = lumpyByYear(settings, cfg, 20);
    expect(otherIncomeByYear[4]).toBe(0); expect(otherIncomeByYear[5]).toBe(6000);
    expect(extraNeedByYear[3]).toBe(20000); expect(extraNeedByYear[4]).toBe(0);
    const p = planFromSettings(settings, cfg, { yieldForYear: realYieldForYear });
    expect(p.targetSchedule[3]).toBe(50000);          // 30k + car
    expect(p.targetSchedule[6]).toBe(24000);          // 30k − DB
    expect(p.pnvCfg.targetSchedule).toBeNull();       // P&V engine applies DB/extras itself
    expect(p.needByYear[3]).toBe(50000);
  });

  it('a level (nominal) extra spend is worth less in later years', () => {
    const settings = { ...base, extraWithdrawals: [{ amount: 10000, year: 10, years: 1, indexation: 'level' }] };
    const cfg = createSimulationConfigFromSettings({}, settings);
    const { extraNeedByYear } = lumpyByYear(settings, cfg, 20);
    expect(extraNeedByYear[10]).toBeLessThan(10000); expect(extraNeedByYear[10]).toBeGreaterThan(7000);
  });
});

describe('incomeLayersRows / incomeLayersSvg', () => {
  const settings = { ...base, dbAmount: 5000, dbStartYear: 2 };
  const cfg = createSimulationConfigFromSettings({}, settings);
  const p = { ...planFromSettings(settings, cfg, { yieldForYear: realYieldForYear }), mcRuns: 40, stride: 12 };

  it('full IL gilt: everything is contract + SP + other; the market layer is empty', () => {
    const r = stressTestStrategy('full-il-gilt', p);
    const rows = incomeLayersRows(r, p);
    expect(rows.length).toBe(20);
    expect(rows[0].sp).toBe(0); expect(rows[10].sp).toBe(11500);
    expect(rows[1].other).toBe(0); expect(rows[2].other).toBe(5000);
    expect(rows[5].contract).toBeGreaterThan(0);
    expect(rows.every((x) => x.market < 1)).toBe(true);
    const svg = incomeLayersSvg({ rows });
    expect(svg).toContain('<svg'); expect(svg).toContain('State Pension'); expect(svg).toContain('By contract');
    expect(svg).not.toContain('From the market');
  });

  it('pots & valves: nothing by contract; the market layer carries the draw', () => {
    const r = stressTestStrategy('pots-and-valves', p);
    const rows = incomeLayersRows(r, p);
    expect(rows.every((x) => x.contract === 0)).toBe(true);
    expect(rows[0].market).toBeGreaterThan(10000);
  });

  it('renders nothing for a single row', () => { expect(incomeLayersSvg({ rows: [{ age: 60 }] })).toBe(''); });
});
