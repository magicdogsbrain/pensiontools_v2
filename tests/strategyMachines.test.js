import { describe, it, expect, vi } from 'vitest';
vi.mock('../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { ladderRatchetSvg, floorFlexSvg, floorScheduleSvg, potsValvesSvg, LR_FRAMES, FF_FRAMES, FS_FRAMES, PV_FRAMES } from '../src/ui/strategyMachines.js';
import { createSimulationConfigFromSettings } from '../src/storage/StressRepository.js';
import { stressTestStrategy, planFromSettings, pnvDecadeSeries } from '../src/strategies/stressTest.js';
import { realYieldForYear } from '../src/services/LinkerUniverse.js';

const settings = { equityMin: 720000, bondMin: 360000, cashTarget: 120000, isaBalance: 60000, duration: 35, baseSalary: 60000, other: 0,
  pa: 12570, brl: 50270, hrl: 125140, taxMode: 'inflates', protectionMult: 0.8, consecutiveLimit: 3, disableProtection: false, recoveryBuffer: 15000,
  hodlEnabled: false, hodlValue: 0, isaReturn: 0.03, statePension: 12480, statePensionYear: 10, incomeShape: 'phases', shapeAgeNow: 57,
  incomeSteps: [{ fromAge: 57, amount: 60000 }, { fromAge: 73, amount: 50000 }, { fromAge: 80, amount: 40000 }] };
const cfg = createSimulationConfigFromSettings({}, settings);
const p = { ...planFromSettings(settings, cfg, { yieldForYear: realYieldForYear }), mcRuns: 120, stride: 6 };
const svgOk = (s) => s.startsWith('<svg') && s.endsWith('</svg>');

describe('the four remaining machines draw from the engine signatures', () => {
  it('Ladder & Ratchet: sleeve band, glide line, base rungs, ratchet rungs, cliff', () => {
    const r = stressTestStrategy('ladder-and-ratchet', p); const sg = r.signature;
    expect(sg.sleeveCone.length).toBe(36); expect(sg.securedByYear.length).toBe(36); expect(sg.drawNet.length).toBe(35);
    const d = { years: sg.drawNet.map((draw, k) => ({ age: 57 + k, draw })), ladderYears: sg.ladderYears, sleeveCone: sg.sleeveCone, glide: sg.glide, securedByYear: sg.securedByYear, failAgeP10: sg.failAgeP10 };
    const f = [1, 2, 3, 4].map((n) => ladderRatchetSvg(d, n)); f.forEach((s) => expect(svgOk(s)).toBe(true));
    expect(f[1]).toContain('base ladder rung'); expect(f[2]).toContain('trigger'); expect(LR_FRAMES.length).toBe(4);
  });
  it('Floor & Flex: essentials bought, sleeve band, treats band with lean years', () => {
    const r = stressTestStrategy('floor-and-flex', p); const sg = r.signature;
    expect(sg.treatsCone.length).toBe(36); expect(sg.amountsByAge.length).toBe(35);
    const d = { amountsByAge: sg.amountsByAge, horizonAge: sg.horizonAge, sleeveCone: sg.sleeveCone, treatsCone: sg.treatsCone, rate: sg.rate, sleeveE0: sg.sleeveE0 };
    const f = [1, 2, 3, 4].map((n) => floorFlexSvg(d, n)); f.forEach((s) => expect(svgOk(s)).toBe(true));
    expect(f[3]).toContain('treats'); expect(FF_FRAMES.length).toBe(4);
  });
  it('Floor the schedule: all bought, reserve band, the rule', () => {
    const r = stressTestStrategy('floor-the-schedule', p); const sg = r.signature;
    expect(sg.reserveCone.length).toBe(36);
    const d = { amountsByAge: sg.amountsByAge, reserveCone: sg.reserveCone, sleeveE0: sg.sleeveE0 };
    const f = [1, 2, 3, 4].map((n) => floorScheduleSvg(d, n)); f.forEach((s) => expect(svgOk(s)).toBe(true));
    expect(f[3]).toContain('2× the line'); expect(FS_FRAMES.length).toBe(4);
  });
  it('Pots & Valves: tanks with floors, wealth band, income vs plan; and a decade helper', () => {
    const r = stressTestStrategy('pots-and-valves', p); const sg = r.signature;
    expect(sg.pots.equity).toBe(720000); expect(sg.protection.cutPct).toBe(20);
    const d = { pots: sg.pots, floors: sg.floors, protection: sg.protection, wealthCone: r.cones.wealth, incomeCone: r.cones.income, planIncome: 60000, startAge: 57 };
    const f = [1, 2, 3, 4].map((n) => potsValvesSvg(d, n)); f.forEach((s) => expect(svgOk(s)).toBe(true));
    expect(f[1]).toContain('floor'); expect(f[3]).toContain('1-in-10 bad future'); expect(PV_FRAMES.length).toBe(4);
    const w = pnvDecadeSeries(p, 1966, 1); expect(w.wealthByYear.length).toBe(36); expect(typeof w.failed).toBe('boolean');
  });
});
