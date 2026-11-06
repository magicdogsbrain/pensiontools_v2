/**
 * Fund and platform charges in today's monthly engine (SimulationEngine.simulate; research/charges-setting.md T2, T3).
 *
 *   - A config WITHOUT `chargesPct`, or with 0, or with an invalid value, is the run it always was — the whole result
 *     object, every golden config, Monte Carlo and history (a locked plan from before charges keeps its figures).
 *   - Closed forms with nothing drawn: every charged pot ends at what it would have been × (1 − c)^years — shares,
 *     bonds, cash, the ISA, the break-glass reserve, the diversifiers; the taxable account only on its non-gilt share.
 *     The random stream is untouched (the bonds' and the reserve's random returns are the same with and without).
 *   - More charge never gives more money (one pot, any future) and never fewer failures (the golden base config).
 *   - The trace carries what the charge took each month, and money is conserved with it.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { simulate, runMonteCarlo, runHistorical, analyzeResults, monteCarloReturns } from '../src/services/SimulationEngine.js';
import { monthlyChargeFactor } from '../src/services/Charges.js';
import { chargeSleeve, newSleeve } from '../src/services/TaxableSleeve.js';
import { stressConfigs } from './golden/matrix.js';
import { pickStress } from './golden/canonical.js';

const here = dirname(fileURLToPath(import.meta.url));
const goldens = JSON.parse(readFileSync(join(here, 'golden/fixtures/stress.json'), 'utf8'));
const asText = (x) => JSON.stringify(x);
const rel = (a, b) => Math.abs(a - b) / Math.max(1, Math.abs(a), Math.abs(b));

describe('absent, 0 or invalid: the run it always was', () => {
  it('every golden config: Monte Carlo and history, the whole result objects, absent = 0 = invalid', () => {
    for (const c of stressConfigs) {
      const plain = runMonteCarlo(c.config, 40);
      for (const v of [0, null, '0.5', -1, 3.5, NaN]) {
        expect(asText(runMonteCarlo({ ...c.config, chargesPct: v }, 40)), `${c.name} at ${v}`).toBe(asText(plain));
      }
      expect(asText(runHistorical({ ...c.config, chargesPct: 0 })), c.name).toBe(asText(runHistorical(c.config)));
    }
  }, 60_000);

  it('at 0 every golden config still reproduces its committed fixture exactly', () => {
    for (const c of stressConfigs) {
      const cfg = { ...c.config, chargesPct: 0 };
      const mc = pickStress(analyzeResults(runMonteCarlo(cfg, goldens.mcRuns)));
      const hist = pickStress(analyzeResults(runHistorical(cfg)));
      expect({ mc, hist }, c.name).toEqual(goldens.cases[c.name]);
    }
  }, 60_000);

  it('with the trace on, a 0% run\'s every month carries a charge of 0', () => {
    const r = simulate({ ...stressConfigs[0].config, trace: true }, monteCarloReturns(stressConfigs[0].config, 3), 3);
    expect(r.trace.length).toBeGreaterThan(0);
    expect(r.trace.every((row) => row.charge === 0 && row.chargeIsa === 0)).toBe(true);
  });

  it('a charged run differs (the setting is read at all)', () => {
    const c = stressConfigs[0].config;
    const a = simulate(c, monteCarloReturns(c, 5), 5);
    const b = simulate({ ...c, chargesPct: 0.5 }, monteCarloReturns(c, 5), 5);
    expect(b.potByYear[1]).toBeLessThan(a.potByYear[1]);
  });
});

/** A plan that draws nothing: every pot just grows (or not) and is charged. No floors, no cash target, no protection. */
function idle(over = {}) {
  return {
    equityStart: 300000, bondStart: 200000, cashStart: 50000,
    equityMin: 0, bondMin: 0, cashTarget: 0,
    duration: 20, years: 20, baseSalary: 0, other: 0,
    spStartYear: 99, spWeeklyAmount: 0,
    pa: 12570, brl: 50270, hrl: 125140, taxMode: 'frozen',
    disableProtection: true, protectionMult: 0.8, consecutiveLimit: 3, recoveryBuffer: 15000,
    hodlEnabled: true, hodlValue: 40000,
    diversifierStart: 60000,
    isaBalance: 80000, isaReturn: 0,
    taxableStart: 0, bedAndIsa: false,
    ...over
  };
}
/** Every year: shares 0%, prices 1% (so cash earns max(0, 1% − 1%) = 0). */
function flat(years) {
  const p = { equity: {}, inflation: {} };
  for (let y = 0; y < years; y++) { p.equity[y] = 0; p.inflation[y] = 0.01; }
  return p;
}

describe('closed forms with nothing drawn', () => {
  for (const pct of [0.05, 0.5, 1.35, 3]) {
    it(`at ${pct}%: shares, cash and the ISA end at start × (1 − c)^years; bonds, the reserve and the diversifiers at the uncharged run × (1 − c)^years`, () => {
      const years = 20;
      const keep = Math.pow(1 - pct / 100, years);
      const r0 = simulate(idle(), flat(years), 11);
      const r = simulate(idle({ chargesPct: pct }), flat(years), 11);
      expect(r.failed).toBe(false);
      // 0% growth exactly: the pot × (1 − c)^(months/12)
      expect(rel(r.finalEquity, 300000 * keep)).toBeLessThan(1e-12);
      expect(rel(r.finalCash, 50000 * keep)).toBeLessThan(1e-12);
      expect(rel(r.finalIsa, 80000 * keep)).toBeLessThan(1e-12);
      expect(r0.finalEquity).toBe(300000);
      // random growth, the same random stream: the uncharged run × (1 − c)^years
      expect(rel(r.finalBond, r0.finalBond * keep)).toBeLessThan(1e-12);
      expect(rel(r.finalHodl, r0.finalHodl * keep)).toBeLessThan(1e-12);
      expect(rel(r.finalDiversifier, r0.finalDiversifier * keep)).toBeLessThan(1e-12);
      expect(r0.finalBond).not.toBe(200000);                 // the bonds did move: the stream is being compared, not two constants
    });
  }

  it('with growth g, the yearly compounding is of (1 + g)(1 − c)', () => {
    const years = 10, pct = 0.75, g = 0.07;
    const path = flat(years); for (let y = 0; y < years; y++) path.equity[y] = g;
    const r = simulate(idle({ chargesPct: pct, bondStart: 0, cashStart: 0, hodlEnabled: false, diversifierStart: 0, isaBalance: 0, years, duration: years }), path, 1);
    expect(rel(r.finalEquity, 300000 * Math.pow((1 + g) * (1 - pct / 100), years))).toBeLessThan(1e-12);
  });

  it('the taxable account is charged on its non-gilt share only; an all-gilt account not at all', () => {
    const years = 15, pct = 1;
    const m = monthlyChargeFactor(pct);
    const run = (mix, chargesPct) => simulate(idle({ taxableStart: 10000, taxableMix: mix, chargesPct, years, duration: years }), flat(years), 4).finalGia;
    // all shares at 0%: exactly the start × (1 − c)^years (dividends of £200 a year are under the £500 allowance)
    expect(rel(run('equity', pct), 10000 * Math.pow(1 - pct / 100, years))).toBeLessThan(1e-12);
    // all gilts: untouched
    expect(run('gilt', pct)).toBe(run('gilt', 0));
    // half gilts: the uncharged run × (1 − (1 − m) × ½) a month
    const half = { equity: 0.5, bond: 0, gilt: 0.5, cash: 0 };
    expect(rel(run(half, pct), run(half, 0) * Math.pow(1 - (1 - m) * 0.5, 12 * years))).toBeLessThan(1e-12);
  });

  it('chargeSleeve keeps the cost basis (the gain is what falls) and leaves an all-gilt sleeve alone', () => {
    const s = newSleeve(10000, { equity: 0.6, bond: 0, gilt: 0.4, cash: 0 }, 8000);
    chargeSleeve(s, 0.99);
    expect(s.value).toBeCloseTo(10000 * (1 - 0.01 * 0.6), 9);
    expect(s.basis).toBe(8000);
    const g = newSleeve(5000, 'gilt');
    chargeSleeve(g, 0.9);
    expect(g.value).toBe(5000);
    const one = newSleeve(5000, 'equity');
    chargeSleeve(one, 1);
    expect(one.value).toBe(5000);
  });

  it('the ISA at the flat rate (no own-funds mix) is charged too', () => {
    const years = 8, pct = 0.5;
    const r0 = simulate(idle({ isaReturn: 0.03, years, duration: years }), flat(years), 2);
    const r = simulate(idle({ isaReturn: 0.03, chargesPct: pct, years, duration: years }), flat(years), 2);
    expect(rel(r.finalIsa, r0.finalIsa * Math.pow(1 - pct / 100, years))).toBeLessThan(1e-12);
  });
});

describe('more charge never gives more money', () => {
  it('one pot (shares only, no ISA), every future of 200: the end pot never rises and the run never lasts longer as the charge rises', () => {
    const cfg = { ...idle({ bondStart: 0, cashStart: 0, hodlEnabled: false, diversifierStart: 0, isaBalance: 0 }), equityStart: 600000, baseSalary: 38000, years: 35, duration: 35, taxMode: 'inflates' };
    const charges = [0, 0.05, 0.5, 1, 2, 3];
    for (let i = 0; i < 200; i++) {
      const returns = monteCarloReturns(cfg, i);
      let last = null;
      for (const pct of charges) {
        const r = simulate({ ...cfg, chargesPct: pct }, returns, i);
        const lasted = r.failed ? r.failMonth : Infinity;
        if (last) {
          expect(r.final, `future ${i} at ${pct}%`).toBeLessThanOrEqual(last.final);
          expect(lasted, `future ${i} at ${pct}%`).toBeLessThanOrEqual(last.lasted);
        }
        last = { final: r.final, lasted };
      }
    }
  }, 60_000);

  it('the golden base config: the share of futures that last never rises, the typical end pot falls', () => {
    const base = stressConfigs[0].config;
    let lastRate = Infinity, lastMedian = Infinity;
    for (const pct of [0, 0.5, 1, 2]) {
      const a = analyzeResults(runMonteCarlo({ ...base, chargesPct: pct }, 200));
      expect(a.successRate).toBeLessThanOrEqual(lastRate);
      const finals = runMonteCarlo({ ...base, chargesPct: pct }, 200).map((r) => r.final).sort((x, y) => x - y);
      const median = finals[100];
      expect(median).toBeLessThan(lastMedian);
      lastRate = a.successRate; lastMedian = median;
    }
  }, 60_000);
});

describe('the trace and conservation', () => {
  it('start − Σ draws − Σ charges = end, exactly as for draws alone (deterministic path, one pot, the ISA beside it)', () => {
    const years = 10, pct = 0.8;
    const EPS = 1e-9;
    const path = { equity: {}, inflation: {} };
    for (let y = 0; y < years; y++) { path.equity[y] = 0; path.inflation[y] = EPS; }
    const cfg = {
      equityStart: 2000000, bondStart: 0, cashStart: 0, equityMin: 100000, bondMin: 0, cashTarget: 0,
      duration: 35, years, baseSalary: 110000, other: 0, statePension: 0, statePensionYear: 99,
      pa: 12570, brl: 50270, hrl: 125140, taxMode: 'frozen', disableProtection: true, protectionMult: 0.8,
      hodlEnabled: false, hodlValue: 0, isaBalance: 500000, isaReturn: 0, chargesPct: pct, trace: true
    };
    const r = simulate(cfg, path, 1);
    expect(r.failed).toBe(false);
    const draws = r.trace.reduce((s, t) => s + t.effectiveSipp, 0);
    const isaDraws = r.trace.reduce((s, t) => s + t.effectiveIsa, 0);
    const charges = r.trace.reduce((s, t) => s + t.charge, 0);
    const isaCharges = r.trace.reduce((s, t) => s + t.chargeIsa, 0);
    expect(charges).toBeGreaterThan(0);
    expect(isaCharges).toBeGreaterThan(0);
    const potsFinal = r.finalEquity + r.finalBond + r.finalCash;
    expect(Math.abs(potsFinal - (2000000 - draws - (charges - isaCharges)))).toBeLessThan(1e-4);
    expect(Math.abs(r.finalIsa - (500000 - isaDraws - isaCharges))).toBeLessThan(1e-4);
  });

  it('each month\'s charge is what came off the pots after that month\'s growth: (1 − m) × the grown pots', () => {
    const years = 3, pct = 2;
    const m = monthlyChargeFactor(pct);
    const r = simulate({ ...idle({ chargesPct: pct, hodlEnabled: false, diversifierStart: 0, bondStart: 0 }), years, duration: years, trace: true }, flat(years), 0);
    // with 0% growth everywhere the grown pots are the start-of-month pots
    for (const t of r.trace) {
      const grown = t.equityStart + t.bondStart + t.cashStart + t.isaStart;
      expect(rel(t.charge, grown * (1 - m))).toBeLessThan(1e-9);
      expect(rel(t.chargeIsa, t.isaStart * (1 - m))).toBeLessThan(1e-9);
    }
  });
});
