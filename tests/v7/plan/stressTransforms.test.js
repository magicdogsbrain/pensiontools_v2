/**
 * 7.9.0 "Try the bad years" — the transforms a row runs on (research/v7/replan-nov-2026.md §5; the build spec's §1.1):
 *  - ladderEngine.shockPath / shockRtr: a fall at the start (shares lose at least 30% after prices in the twelve months
 *    from `from`) and prices rising 2% a year faster; a null shock is the object given; no month is ever above the
 *    future's own; histories are never shocked;
 *  - Charges.monthlyCostFactor and GiltLadderPlan.cashCostFactor: "lower returns" as a field of its own beside the charge;
 *    absent or 0, every factor is the one before, bit for bit; a charge at the 3% cap still takes the drag;
 *  - lastsRun.rowPlanOf: a row on the plan, and on the run followed on to the weighting age; PlanDocument.trimPlan drops it;
 *  - the static rule: every charge site reads monthlyCostFactor, every cash-year site passes the drag, every futures
 *    bootstrap in the strategies goes through a shock transform.
 * Fictional plans only (the test corpus).
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { shockPath, shockRtr, bootstrapPaths, bootstrapRtr, annualNominal, getRtr } from '../../../src/strategies/ladderEngine.js';
import { monthlyCostFactor, monthlyChargeFactor } from '../../../src/services/Charges.js';
import { cashCostFactor, LADDER_DEFAULTS } from '../../../src/strategies/GiltLadderPlan.js';
import { futureReturns } from '../../../src/answers/shared/futures.js';
import { rowPlanOf, planFor, weightedOptsOf, WEIGHTED_HIST_STRIDE } from '../../../src/answers/plan/lastsRun.js';
import { trimPlan } from '../../../src/services/PlanDocument.js';
import { stressTestStrategy } from '../../../src/strategies/stressTest.js';
import { oneAnswer } from '../../../src/services/OneAnswer.js';
import { effectiveStressSettings } from '../../../src/services/PlanReading.js';
import { simulate } from '../../../src/services/SimulationEngine.js';
import { corpus, entryOf, TODAY, noon } from './_plans.js';
import { checkInputs } from '../../../src/answers/shared/validate.js';
import { SCHEMA_C } from '../../../src/answers/c/schema.js';
import { toHousehold } from '../../../src/answers/c/toHousehold.js';
import { enginePlan, configsAt } from '../../../src/answers/shared/toEngine.js';
import { pnvFamilyPlan } from '../../../src/strategies/stressTest.js';

const FALL = { kind: 'fall', share: 0.3, from: 0 };
const PRICES = { kind: 'prices', add: 0.02, from: 0 };
const months = 40 * 12;

describe('the shocks: a null shock is the object given; a fall is at least 30% in its year, and never lifts a month', () => {
  it('null, an unknown kind and a fall on a path that already fell more give back the very object', () => {
    const path = bootstrapPaths(3, months);
    expect(shockPath(path, null)).toBe(path);
    expect(shockPath(path, undefined)).toBe(path);
    expect(shockPath(path, { kind: 'other' })).toBe(path);
    expect(shockRtr(path.rtr, null)).toBe(path.rtr);
    expect(shockRtr(path.rtr, PRICES)).toBe(path.rtr);   // prices leave real returns as they are
  });
  it('the fall year\'s real return is min(R, 0.70) to 1e-12; every later month\'s return is the future\'s own; rtr′ ≤ rtr at every month', () => {
    let fell = 0, already = 0;
    for (const from of [0, 60]) {
      for (let i = 0; i < 300; i++) {
        const path = bootstrapPaths(i * 7919 + 3, months);
        const s = shockPath(path, { ...FALL, from });
        const R = path.rtr[from + 12] / path.rtr[from];
        const R2 = s.rtr[from + 12] / s.rtr[from];
        expect(Math.abs(R2 - Math.min(R, 0.7))).toBeLessThan(1e-12);
        if (R <= 0.7) { already++; expect(s).toBe(path); continue; }
        fell++;
        for (let m = 0; m <= from; m++) expect(s.rtr[m]).toBe(path.rtr[m]);
        for (let m = from + 13; m <= months; m++) expect(Math.abs(s.rtr[m] / s.rtr[m - 1] - path.rtr[m] / path.rtr[m - 1])).toBeLessThan(1e-12);
        for (let m = 0; m <= months; m++) expect(s.rtr[m]).toBeLessThanOrEqual(path.rtr[m]);
        expect(s.cpi).toBe(path.cpi);
      }
    }
    expect(fell).toBeGreaterThan(500);
    expect(already).toBeGreaterThan(0);   // a future that already lost more is left as it is
  });
  it('the strategies\' own bootstrap (real returns only) takes the same fall', () => {
    const rtr = bootstrapRtr(7, months);
    const s = shockRtr(rtr, FALL);
    expect(Math.abs(s[12] / s[0] - Math.min(rtr[12] / rtr[0], 0.7))).toBeLessThan(1e-12);
    expect(rtr[12]).toBe(bootstrapRtr(7, months)[12]);   // the path given is never changed
  });
  it('prices: 2% a year faster from `from`, real share returns unchanged', () => {
    const path = bootstrapPaths(11, months);
    const s = shockPath(path, { ...PRICES, from: 24 });
    expect(s.rtr).toBe(path.rtr);
    const a = annualNominal(path.rtr, path.cpi, 0, 40), b = annualNominal(s.rtr, s.cpi, 0, 40);
    for (let y = 0; y < 40; y++) {
      expect(Math.abs((1 + b.equity[y]) / (1 + b.inflation[y]) - (1 + a.equity[y]) / (1 + a.inflation[y]))).toBeLessThan(1e-12);
      if (y < 2) expect(b.inflation[y]).toBe(a.inflation[y]);
      else expect(Math.abs((1 + b.inflation[y]) - (1 + a.inflation[y]) * 1.02)).toBeLessThan(1e-12);
    }
  });
  it('an answer\'s futures take the shock from the month the caller sets (on lives at S = 5: the saving years bit-identical, year 5 the fall)', () => {
    for (let i = 0; i < 50; i++) {
      const own = futureReturns(i, 30, { seed: 0 });
      const at5 = futureReturns(i, 30, { seed: 0, shock: { ...FALL, from: 60 } });
      for (let y = 0; y < 5; y++) { expect(at5.equity[y]).toBe(own.equity[y]); expect(at5.inflation[y]).toBe(own.inflation[y]); }
      const real = (r, y) => (1 + r.equity[y]) / (1 + r.inflation[y]);
      expect(Math.abs(real(at5, 5) - Math.min(real(own, 5), 0.7))).toBeLessThan(1e-9);
      for (let y = 6; y < 30; y++) expect(Math.abs(real(at5, y) - real(own, y))).toBeLessThan(1e-9);
    }
    // no shock: the futures as they were, object for object in their figures
    expect(JSON.stringify(futureReturns(4, 30, { seed: 0, shock: null }))).toBe(JSON.stringify(futureReturns(4, 30, { seed: 0 })));
  });
});

describe('lower returns: a field of its own beside the charge', () => {
  it('absent, 0 or not a number: every factor is the charge\'s own, bit for bit', () => {
    for (const c of [undefined, 0, 0.05, 0.5, 1.25, 3, 3.5, -1, 'x']) {
      for (const d of [undefined, 0, null, NaN, -1, 'x']) expect(monthlyCostFactor({ chargesPct: c, returnDragPct: d })).toBe(monthlyChargeFactor(c));
    }
    expect(monthlyCostFactor(null)).toBe(1);
    expect(monthlyCostFactor({ returnDragPct: 1 })).toBe(Math.pow(0.99, 1 / 12));
  });
  it('a charge at the 3% cap still takes the drag (a larger charge would have read as none)', () => {
    expect(monthlyCostFactor({ chargesPct: 3, returnDragPct: 1 })).toBe(monthlyChargeFactor(3) * Math.pow(0.99, 1 / 12));
    expect(monthlyCostFactor({ chargesPct: 3, returnDragPct: 1 })).toBeLessThan(monthlyChargeFactor(3));
    expect(monthlyChargeFactor(4)).toBe(1);   // why the drag is not added to the charge
  });
  it('the cash years: with d = 0 exactly the factor before; with d, ((1 + drag)/((1 − c)(1 − d)))^(k − 1)', () => {
    for (const k of [1, 2, 3, 7, 15]) for (const c of [0, 0.5, 3]) {
      const before = c === 0 ? Math.pow(1 + LADDER_DEFAULTS.cashRealDrag, k - 1) : Math.pow((1 + LADDER_DEFAULTS.cashRealDrag) / (1 - c / 100), k - 1);
      expect(cashCostFactor(k, undefined, c)).toBe(before);
      expect(cashCostFactor(k, undefined, c, 0)).toBe(before);
      expect(cashCostFactor(k, undefined, c, undefined)).toBe(before);
      expect(cashCostFactor(k, undefined, c, 1)).toBe(Math.pow((1 + LADDER_DEFAULTS.cashRealDrag) / ((1 - c / 100) * 0.99), k - 1));
    }
  });
  it('an answer\'s household carries the drag to every run\'s config, and only when it has one', () => {
    const env = { today: '2026-09-30', futures: 10, seed: 0 };
    const checked = checkInputs(SCHEMA_C, { you: { pot: 300000, age: 66 }, savings: 20000 }, env);
    const { household } = toHousehold(checked.inputs, env);
    const plain = configsAt(enginePlan(household, env), 24000);
    const dragged = configsAt(enginePlan({ ...household, returnDragPct: 1 }, env), 24000);
    for (const { config } of plain) expect(config).not.toHaveProperty('returnDragPct');
    for (const { config } of dragged) expect(config.returnDragPct).toBe(1);
    expect(dragged.map(({ config }) => ({ ...config, returnDragPct: undefined }))).toEqual(plain.map(({ config }) => ({ ...config, returnDragPct: undefined })));
  });
  it('the engine: a run with the drag ends lower than one without, on the same future', () => {
    const path = bootstrapPaths(3, 30 * 12);
    const returns = annualNominal(path.rtr, path.cpi, 0, 30);
    const cfg = { years: 30, equityStart: 300000, bondStart: 100000, cashStart: 50000, equityMin: 300000, bondMin: 100000, cashTarget: 50000, targetSchedule: Array(31).fill(20000), chargesPct: 3 };
    const a = simulate(cfg, returns, 1), b = simulate({ ...cfg, returnDragPct: 1 }, returns, 1);
    expect(b.finalReal).toBeLessThan(a.finalReal);
    expect(simulate({ ...cfg, returnDragPct: 0 }, returns, 1)).toEqual(a);
  });
});

describe('a row on the plan (lastsRun.rowPlanOf), and never on a document', () => {
  const C = corpus();
  const now = noon(TODAY);
  const planOf = (name) => { const plan = entryOf(C[name]).plan; const s = effectiveStressSettings(plan, { now }); return { plan, s, p: planFor(s, now) }; };
  it('no row: the plan itself; any row: the futures only (histories at one window); the shock and the drag where the engines read them', () => {
    const { p } = planOf('02-pnv-draft');
    expect(rowPlanOf(p, null)).toBe(p);
    const plain = rowPlanOf(p, {});
    expect(plain).toEqual({ ...p, stride: WEIGHTED_HIST_STRIDE, perFutureCuts: true });
    const fall = rowPlanOf(p, { shock: FALL });
    expect(fall.shock).toEqual(FALL);
    expect(fall).not.toHaveProperty('returnDragPct');
    expect(fall.pnvCfg).toBe(p.pnvCfg);
    const lower = rowPlanOf(p, { returnDragPct: 1 });
    expect(lower.returnDragPct).toBe(1);
    expect(lower.pnvCfg).toEqual({ ...p.pnvCfg, returnDragPct: 1 });
    expect(p).not.toHaveProperty('shock');
    expect(p.pnvCfg).not.toHaveProperty('returnDragPct');
    // a document never holds a run's own fields
    const t = trimPlan(rowPlanOf(p, { shock: FALL, returnDragPct: 1 }));
    expect(t).not.toHaveProperty('shock');
    expect(t).not.toHaveProperty('returnDragPct');
    expect(t).not.toHaveProperty('perFutureCuts');
    expect(JSON.stringify(t)).not.toMatch(/returnDragPct|"shock"|perFutureCuts/);
  });
  it('the futures take the shock, the real histories never do; the weighted run followed on carries the row too', { timeout: 120_000 }, () => {
    const { plan, s, p } = planOf('02-pnv-draft');
    const base = rowPlanOf(p, {});
    const r0 = stressTestStrategy('pots-and-valves', base);
    const rf = stressTestStrategy('pots-and-valves', rowPlanOf(p, { shock: FALL }));
    expect(rf.histWindows).toEqual(r0.histWindows);
    expect(rf.ruin.hist).toBe(r0.ruin.hist);
    expect(rf.ruin.mc).toBeGreaterThanOrEqual(r0.ruin.mc);
    expect(pnvFamilyPlan('buckets-in-order', rowPlanOf(p, { shock: FALL })).shock).toEqual(FALL);   // the buckets row moves too
    expect(r0.futuresMc.cutReal).toHaveLength(r0.survivedMc.length);   // a row keeps each future's cut (planShortfallOf)
    expect(stressTestStrategy('pots-and-valves', { ...p, stride: WEIGHTED_HIST_STRIDE }).futuresMc).not.toHaveProperty('cutReal');
    // a plan that ends before the weighting age: the run followed on carries the drag, and counts more weighted failures
    const w0 = weightedOptsOf(plan, { settings: s, strategyId: 'pots-and-valves', p: base, r: r0, now, row: {} });
    expect(w0.runs).toBe(1);
    const lower = rowPlanOf(p, { returnDragPct: 1 });
    const rl = stressTestStrategy('pots-and-valves', lower);
    const wl = weightedOptsOf(plan, { settings: s, strategyId: 'pots-and-valves', p: lower, r: rl, now, row: { returnDragPct: 1 } });
    expect(wl.pW.pnvCfg.returnDragPct).toBe(1);
    expect(wl.pW.returnDragPct).toBe(1);
    expect(w0.pW.pnvCfg).not.toHaveProperty('returnDragPct');
    const a0 = oneAnswer(r0, base, w0.opts), al = oneAnswer(rl, lower, wl.opts);
    expect(al.sumW).toBeGreaterThan(a0.sumW);
  });
});

describe('the static rule: one factor, the drag on every cash year, a shock on every bootstrap', () => {
  const read = (f) => readFileSync(join(process.cwd(), f), 'utf8');
  it('the five charge sites read monthlyCostFactor, never monthlyChargeFactor', () => {
    for (const f of ['src/services/SimulationEngine.js', 'src/answers/shared/fastEngine.js', 'src/strategies/compareRunner.js', 'src/strategies/GiltRotation.js', 'src/strategies/stressTest.js']) {
      const code = read(f);
      expect(code, f).toMatch(/monthlyCostFactor\(/);
      expect(code, f).not.toMatch(/monthlyChargeFactor\(/);
    }
  });
  it('the three cash-year sites pass the drag', () => {
    expect(read('src/strategies/compareRunner.js')).toMatch(/cashCostFactor\(k, undefined, p\.chargesPct, p\.returnDragPct\)/);
    expect(read('src/strategies/stressTest.js')).toMatch(/cashCostFactor\(k - y, undefined, p\.chargesPct, p\.returnDragPct\)/);
    expect(read('src/strategies/GiltLadderPlan.js')).toMatch(/cashCostFactor\(k, o\.cashRealDrag, p\.chargesPct, p\.returnDragPct\)/);
    expect(read('src/strategies/stressTest.js')).toMatch(/returnDragPct: p\.returnDragPct/);   // into buildGiltLadder's options
  });
  it('every futures bootstrap in the strategies goes through a shock (runPnvMonteCarlo, which has no caller, allowed by name)', () => {
    for (const f of ['src/strategies/stressTest.js', 'src/strategies/LadderAndRatchet.js', 'src/strategies/FloorAndFlex.js', 'src/strategies/GiltRotation.js', 'src/strategies/compareRunner.js']) {
      const code = read(f);
      const lines = code.split('\n').filter((l) => /bootstrap(Paths|Rtr)\(/.test(l) && !/^\s*(\/\/|\*)/.test(l) && !/import \{/.test(l));
      for (const l of lines) {
        if (f.endsWith('compareRunner.js') && /bootstrapPaths\(i \* 31337 \+ 11, END\)/.test(l)) continue;   // runPnvMonteCarlo's own (no caller)
        expect(/shock(Path|Rtr)\(/.test(l), `${f}: ${l.trim()}`).toBe(true);
      }
    }
    // the runner with no caller: listed, so a new caller of it is noticed
    expect(read('src/strategies/compareRunner.js')).toMatch(/export function runPnvMonteCarlo/);
    expect(getRtr().length).toBeGreaterThan(1000);
  });
});
