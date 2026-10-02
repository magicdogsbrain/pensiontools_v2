/**
 * How ISAs and savings grow, in today's monthly engine (SimulationEngine.simulate; research/saver-lock-and-savings-growth.md
 * 3.2, tests 2 and 3).
 *
 *   - A config WITHOUT `isaGrowth` (or with a value that is not one of the two) is the run it always was: the ISA grows at
 *     the fixed `isaReturn` (3% unless set) — every golden config, Monte Carlo and history, the whole result object. A plan
 *     locked before the choice existed keeps its figures.
 *   - 'cash' ("Mostly cash"): the ISA grows each month by the month's cash factor, the very number the pension's cash gets
 *     — last year's rise in prices less 1%, never below nothing.
 *   - 'invested' ("Invested like my pension"): wE × the shares factor + wB × the bonds factor + wC × the cash factor, the
 *     pension's own three factors that month, weighted by its mix (its own pots, or `isaGrowthMix`), the bond tent
 *     re-splitting shares and bonds. No new random draw.
 *   - The tagged ISA funds (`isaMix`) still win; nothing changes for a run with no ISA; the charge comes off after either.
 *   - The trace carries the month's ISA factor; money is conserved with it.
 */
import { describe, it, expect } from 'vitest';
import { simulate, runMonteCarlo, runHistorical, monteCarloReturns, analyzeResults } from '../src/services/SimulationEngine.js';
import { glideShareForYear } from '../src/services/GlidepathService.js';
import { monthlyChargeFactor } from '../src/services/Charges.js';
import { stressConfigs } from './golden/matrix.js';

const asText = (x) => JSON.stringify(x);
const rel = (a, b) => Math.abs(a - b) / Math.max(1, Math.abs(a), Math.abs(b));
const monthlyOf = (r) => Math.pow(1 + r, 1 / 12);

describe('no choice (absent or not one of the two): the run it always was', () => {
  it('every golden config, Monte Carlo and history: the whole result objects equal with a wrong value as without one', () => {
    for (const c of stressConfigs) {
      const plain = asText(runMonteCarlo(c.config, 30));
      for (const v of [undefined, null, 'Cash', 'shares', 0.03, true]) {
        expect(asText(runMonteCarlo({ ...c.config, isaGrowth: v }, 30)), `${c.name} at ${v}`).toBe(plain);
      }
      expect(asText(runHistorical({ ...c.config, isaGrowth: 'mixed' })), c.name).toBe(asText(runHistorical(c.config)));
    }
  }, 60_000);

  it('a run with no ISA is the same run under either choice (the pension, the random stream, every figure)', () => {
    for (const c of stressConfigs.filter((x) => !(x.config.isaBalance > 0))) {
      const plain = asText(runMonteCarlo(c.config, 25));
      expect(asText(runMonteCarlo({ ...c.config, isaGrowth: 'cash' }, 25)), c.name).toBe(plain);
      expect(asText(runMonteCarlo({ ...c.config, isaGrowth: 'invested' }, 25)), c.name).toBe(plain);
    }
  }, 60_000);

  it('the tagged ISA funds (isaMix) still win: the choice is not read', () => {
    const cfg = { ...stressConfigs[0].config, isaBalance: 150000, isaMix: { shares: 0.6, bonds: 0.3, cash: 0.1 } };
    const plain = asText(runMonteCarlo(cfg, 25));
    expect(asText(runMonteCarlo({ ...cfg, isaGrowth: 'cash' }, 25))).toBe(plain);
    expect(asText(runMonteCarlo({ ...cfg, isaGrowth: 'invested' }, 25))).toBe(plain);
  });

  it('a choice is read at all: the ISA differs from the fixed rate', () => {
    const cfg = { ...stressConfigs[0].config, isaBalance: 200000 };
    const returns = monteCarloReturns(cfg, 4);
    const fixed = simulate(cfg, returns, 4);
    expect(simulate({ ...cfg, isaGrowth: 'cash' }, returns, 4).isaByYear[2]).not.toBe(fixed.isaByYear[2]);
    expect(simulate({ ...cfg, isaGrowth: 'invested' }, returns, 4).isaByYear[2]).not.toBe(fixed.isaByYear[2]);
  });
});

/** A plan that draws nothing: every pot just grows. No floors, no cash target, no protection, no reserve. */
function idle(over = {}) {
  return {
    equityStart: 300000, bondStart: 200000, cashStart: 50000,
    equityMin: 0, bondMin: 0, cashTarget: 0,
    duration: 20, years: 20, baseSalary: 0, other: 0,
    spStartYear: 99, spWeeklyAmount: 0,
    pa: 12570, brl: 50270, hrl: 125140, taxMode: 'frozen',
    disableProtection: true, protectionMult: 0.8, consecutiveLimit: 3, recoveryBuffer: 15000,
    hodlEnabled: false, hodlValue: 0,
    isaBalance: 80000,
    taxableStart: 0, bedAndIsa: false,
    ...over
  };
}
/** Every year: shares `g`, prices `pi` (a list, one a year, or one figure for all). */
function path(years, g = 0, pi = 0.01) {
  const p = { equity: {}, inflation: {} };
  for (let y = 0; y < years; y++) { p.equity[y] = Array.isArray(g) ? g[y] : g; p.inflation[y] = Array.isArray(pi) ? pi[y] : pi; }
  return p;
}

describe('closed forms with nothing drawn', () => {
  it('"Mostly cash" at flat prices π: start × (1 + max(0, π − 1%))^years, and × (1 − c)^years with a charge', () => {
    for (const pi of [0.005, 0.01, 0.025, 0.04, 0.08]) {
      for (const pct of [0, 0.5, 1.35]) {
        const years = 15;
        const r = simulate(idle({ isaGrowth: 'cash', chargesPct: pct, years, duration: years }), path(years, 0.05, pi), 3);
        const want = 80000 * Math.pow(1 + Math.max(0, pi - 0.01), years) * Math.pow(1 - pct / 100, years);
        expect(rel(r.finalIsa, want), `π ${pi} c ${pct}`).toBeLessThan(1e-12);
      }
    }
  });

  it('"Mostly cash" on a moving path: each year at last year\'s rise less 1% (the first year at its own), never below nothing', () => {
    const pis = [0.02, 0.09, 0.12, 0.004, 0.03, 0.06, 0.0, 0.015];
    const years = pis.length;
    const r = simulate(idle({ isaGrowth: 'cash', years, duration: years }), path(years, 0.04, pis), 9);
    let want = 80000;
    for (let y = 0; y < years; y++) {
      const prev = y > 0 ? (pis[y - 1] || 0.025) : (pis[0] || 0.025);    // 0 reads as unset (2.5%), as the engine reads it
      want *= Math.pow(monthlyOf(Math.max(0, prev - 0.01)), 12);
    }
    expect(rel(r.finalIsa, want)).toBeLessThan(1e-12);
    // the cash in the pension grew by exactly the same factors: the two end on the same multiple of their start
    expect(rel(r.finalIsa / 80000, r.finalCash / 50000)).toBeLessThan(1e-12);
  });

  it('"Invested like my pension" with an all-shares pension follows the shares exactly: start × (1 + g)^years', () => {
    const years = 12, g = 0.07;
    const r = simulate(idle({ isaGrowth: 'invested', bondStart: 0, cashStart: 0, years, duration: years }), path(years, g, 0.02), 5);
    expect(rel(r.finalIsa, 80000 * Math.pow(1 + g, years))).toBeLessThan(1e-12);
    expect(rel(r.finalIsa / 80000, r.finalEquity / 300000)).toBeLessThan(1e-12);
  });

  it('"Invested" with an all-cash pension is "Mostly cash", to the bit (the whole result)', () => {
    const years = 20;
    const cfg = idle({ equityStart: 0, bondStart: 0, cashStart: 400000, years, duration: years });
    for (let i = 0; i < 10; i++) {
      const returns = monteCarloReturns(cfg, i);
      expect(asText(simulate({ ...cfg, isaGrowth: 'invested' }, returns, i)), `future ${i}`).toBe(asText(simulate({ ...cfg, isaGrowth: 'cash' }, returns, i)));
    }
  });

  it('"Invested" with an explicit mix ignores the pots: { equity: 1 } follows the shares though the pension is all cash', () => {
    const years = 10, g = 0.06;
    const r = simulate(idle({ isaGrowth: 'invested', isaGrowthMix: { equity: 1, bond: 0, cash: 0 }, equityStart: 0, bondStart: 0, cashStart: 100000, years, duration: years }), path(years, g, 0.02), 1);
    expect(rel(r.finalIsa, 80000 * Math.pow(1 + g, years))).toBeLessThan(1e-12);
  });

  it('"Invested" with a mixed pension: each month\'s ISA factor is wE × fE + wB × fB + wC × fC of the pension\'s own pots — no new random draw', () => {
    const years = 6;
    const cfg = idle({ isaGrowth: 'invested', years, duration: years, trace: true });
    const plain = simulate({ ...cfg, isaGrowth: undefined }, monteCarloReturns(cfg, 7), 7);
    const r = simulate(cfg, monteCarloReturns(cfg, 7), 7);
    // the random stream is untouched: the bonds (which draw it) end where they end without the choice
    expect(r.finalBond).toBe(plain.finalBond);
    expect(r.finalEquity).toBe(plain.finalEquity);
    const t = r.trace;
    for (let m = 0; m + 1 < t.length; m++) {
      const fE = t[m + 1].equityStart / t[m].equityStart, fB = t[m + 1].bondStart / t[m].bondStart, fC = t[m + 1].cashStart / t[m].cashStart;
      const want = (300000 * fE + 200000 * fB + 50000 * fC) / 550000;
      expect(rel(t[m].isaFactor, want), `month ${m}`).toBeLessThan(1e-12);
      expect(rel(t[m + 1].isaStart, t[m].isaStart * t[m].isaFactor), `month ${m}`).toBeLessThan(1e-12);
    }
  });

  it('the bond tent re-splits the ISA\'s shares and bonds by the year\'s share, as it does the pension\'s', () => {
    const years = 30;
    const equityGlide = { start: 0.3, end: 0.8 };
    const cfg = idle({ isaGrowth: 'invested', equityStart: 300000, bondStart: 300000, cashStart: 100000, equityGlide, years, duration: years, trace: true });
    const r = simulate(cfg, path(years, 0.08, 0.03), 2);
    const fE = monthlyOf(0.08), fC = monthlyOf(0.02);
    for (const m of [0, 25, 70, 200, 359]) {
      const row = r.trace[m];
      const share = glideShareForYear(equityGlide, row.year, years);
      const growth = 600000 / 700000, cashW = 100000 / 700000;
      // the bonds factor is the month's own draw: read it from the pension's bonds (no withdrawals, no floors)
      const next = r.trace[m + 1] || null;
      if (!next || row.monthInYear === 11) continue;                     // the tent rebalances at the turn of the year
      const fB = next.bondStart / row.bondStart;
      const want = growth * share * fE + growth * (1 - share) * fB + cashW * fC;
      expect(rel(row.isaFactor, want), `month ${m}`).toBeLessThan(1e-12);
    }
  });

  it('the charge comes off after either kind of growth', () => {
    const years = 8, pct = 0.75;
    for (const isaGrowth of ['cash', 'invested']) {
      const returns = path(years, 0.05, 0.03);
      const r0 = simulate(idle({ isaGrowth, years, duration: years }), returns, 2);
      const r = simulate(idle({ isaGrowth, chargesPct: pct, years, duration: years }), returns, 2);
      expect(rel(r.finalIsa, r0.finalIsa * Math.pow(1 - pct / 100, years)), isaGrowth).toBeLessThan(1e-12);
    }
  });
});

describe('sense checks', () => {
  it('flat prices: "Mostly cash" ends below the fixed 3% when prices rise less than 4%, above when more — and level at 4%', () => {
    const years = 20;
    for (const pi of [0.01, 0.02, 0.035, 0.045, 0.06, 0.1]) {
      const cash = simulate(idle({ isaGrowth: 'cash', years, duration: years }), path(years, 0, pi), 1).finalIsa;
      const fixed = simulate(idle({ years, duration: years }), path(years, 0, pi), 1).finalIsa;
      if (pi < 0.04) expect(cash, `π ${pi}`).toBeLessThan(fixed); else expect(cash, `π ${pi}`).toBeGreaterThan(fixed);
    }
    const at4cash = simulate(idle({ isaGrowth: 'cash', years, duration: years }), path(years, 0, 0.04), 1).finalIsa;
    const at4fixed = simulate(idle({ years, duration: years }), path(years, 0, 0.04), 1).finalIsa;
    expect(rel(at4cash, at4fixed)).toBeLessThan(1e-12);
  });

  it('"Mostly cash" loses about 1% a year of buying power when prices rise faster than 1%, and holds its pounds otherwise', () => {
    const years = 25;
    for (const pi of [0.02, 0.05, 0.1]) {
      const r = simulate(idle({ isaGrowth: 'cash', years, duration: years }), path(years, 0, pi), 1);
      const real = r.finalIsa / Math.pow(1 + pi, years - 1);              // the engine applies a year's rise at its start, from year 1
      const want = 80000 * Math.pow(1 + pi - 0.01, years) / Math.pow(1 + pi, years - 1);
      expect(rel(real, want)).toBeLessThan(1e-12);
      expect(real).toBeLessThan(80000 * (1 + pi));
    }
    expect(rel(simulate(idle({ isaGrowth: 'cash' }), path(20, 0, 0.004), 1).finalIsa, 80000)).toBeLessThan(1e-15);
  });

  it('"Invested": more shares in the mix, more ISA, when shares beat cash (shares 7%, prices 2%, bonds left out)', () => {
    const years = 15;
    let last = -Infinity;
    for (const e of [0, 0.2, 0.5, 0.8, 1]) {
      const r = simulate(idle({ isaGrowth: 'invested', isaGrowthMix: { equity: e, bond: 0, cash: 1 - e }, years, duration: years }), path(years, 0.07, 0.02), 1);
      expect(r.finalIsa, `shares ${e}`).toBeGreaterThan(last);
      last = r.finalIsa;
    }
  });

  it('over 200 futures, an idle ISA: "Invested" with an all-cash mix equals "Mostly cash" in every one; with shares its spread is wider', () => {
    const cfg = idle({ years: 25, duration: 25 });
    const ends = { cash: [], shares: [] };
    for (let i = 0; i < 200; i++) {
      const returns = monteCarloReturns(cfg, i);
      const c = simulate({ ...cfg, isaGrowth: 'cash' }, returns, i).finalIsa;
      expect(simulate({ ...cfg, isaGrowth: 'invested', isaGrowthMix: { equity: 0, bond: 0, cash: 1 } }, returns, i).finalIsa).toBe(c);
      ends.cash.push(c);
      ends.shares.push(simulate({ ...cfg, isaGrowth: 'invested', isaGrowthMix: { equity: 1, bond: 0, cash: 0 } }, returns, i).finalIsa);
    }
    const spread = (v) => { const s = [...v].sort((a, b) => a - b); return s[180] / s[20]; };
    expect(spread(ends.shares)).toBeGreaterThan(spread(ends.cash));
  });
});

describe('the trace and conservation', () => {
  const EPS = 1e-9;
  const det = (years) => path(years, 0, EPS);
  const cfgOf = (isaGrowth, chargesPct = 0) => ({
    equityStart: 2000000, bondStart: 0, cashStart: 0, equityMin: 100000, bondMin: 0, cashTarget: 0,
    duration: 35, years: 10, baseSalary: 110000, other: 0, statePension: 0, statePensionYear: 99,
    pa: 12570, brl: 50270, hrl: 125140, taxMode: 'frozen', disableProtection: true, protectionMult: 0.8,
    hodlEnabled: false, hodlValue: 0, isaBalance: 500000, chargesPct, trace: true,
    ...(isaGrowth ? { isaGrowth } : {})
  });

  for (const isaGrowth of [null, 'cash', 'invested']) {
    for (const pct of [0, 0.5]) {
      it(`${isaGrowth || 'no choice'}${pct ? ', charged' : ''}: each month the ISA is start × factor − charge − what it paid, to the penny`, () => {
        const r = simulate(cfgOf(isaGrowth, pct), det(10), 1);
        expect(r.failed).toBe(false);
        const t = r.trace;
        let paid = 0;
        for (let m = 0; m + 1 < t.length; m++) {
          const grown = t[m].isaStart * t[m].isaFactor;
          expect(Math.abs(t[m].chargeIsa - (pct ? grown * (1 - monthlyChargeFactor(pct)) : 0)), `month ${m}`).toBeLessThan(1e-6);
          expect(Math.abs(t[m + 1].isaStart - (grown - t[m].chargeIsa - t[m].effectiveIsa)), `month ${m}`).toBeLessThan(1e-6);
          paid += t[m].effectiveIsa;
        }
        expect(paid).toBeGreaterThan(0);
        // the factor is the choice's: fixed 3% / cash at max(0, ε − 1%) = 0 / the all-shares pension's 0%
        const want = isaGrowth === null ? monthlyOf(0.03) : 1;
        expect(t.every((row) => row.isaFactor === want)).toBe(true);
      });
    }
  }

  it('an empty ISA\'s factor reads 1 (nothing grew)', () => {
    const r = simulate({ ...cfgOf('cash'), isaBalance: 0 }, det(3), 1);
    expect(r.trace.every((row) => row.isaFactor === 1)).toBe(true);
  });
});

describe('a drawing plan moves both ways (the release note must not say figures simply fall)', () => {
  it('the golden base + £200k ISA: every choice runs, each gives a different typical end', () => {
    const cfg = { ...stressConfigs[0].config, isaBalance: 200000 };
    const p50 = (rs) => { const s = rs.map((r) => r.final + r.finalIsa).sort((a, b) => a - b); return s[Math.floor(s.length / 2)]; };
    const fixed = runMonteCarlo(cfg, 100), cash = runMonteCarlo({ ...cfg, isaGrowth: 'cash' }, 100), inv = runMonteCarlo({ ...cfg, isaGrowth: 'invested' }, 100);
    expect(new Set([p50(fixed), p50(cash), p50(inv)]).size).toBe(3);
    expect(p50(inv)).toBeGreaterThan(p50(cash));
    for (const rs of [fixed, cash, inv]) expect(analyzeResults(rs).successRate).toBeGreaterThan(0);
  });
});
