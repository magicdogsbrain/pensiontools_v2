/**
 * Cross-validation v2 (full fidelity): replay a trajectory through the Decision engine with
 * PROTECTION ON, building up the Decision history + tax years exactly as the tool would show
 * them. Feeds the sim's own monthly fund values (per the chosen approach).
 *
 * Findings this pins — the two engines agree to the penny on the tax-efficient DRAWDOWN, but
 * their downturn overlays diverge in two ways:
 *   (A) Protection entry/exit uses different rules (sim: N consecutive cash draws, exit at
 *       min+£5k; decision: growth<min AND N cash draws, exit at min+recoveryBuffer), so they
 *       disagree on whether a given month is "protected".
 *   (B) During protection the sim scales the ISA top-up by the protection factor; the decision
 *       engine reduces only the SIPP and keeps the ISA top-up full. So even on months both agree
 *       are protected, the ISA draw differs.
 * This test:
 *   1. asserts every draw is finite,
 *   2. asserts that on HEALTHY months (neither in protection, neither boosting) both SIPP and
 *      ISA match to the penny (⇒ ALL divergence is the protection/boost overlay, never the
 *      shared drawdown math), and
 *   3. reports the protection-divergence rate, the ISA-scaling divergence, and the worst month
 *      (CROSSVAL_REPORT=1).
 *
 * Run:  npx vitest run tests/crossval/replay-full.test.js
 * Report: CROSSVAL_REPORT=1 npx vitest run tests/crossval/replay-full.test.js
 */
import { describe, it, expect } from 'vitest';
import { stressConfigs } from '../golden/matrix.js';
import { replayStateful, summarize } from './harness.js';

const SEEDS = 20;
const EPS = 0.01;

// base / SP-from-year-5, protection ENABLED (disableProtection false), plus a funded ISA.
const config = {
  ...stressConfigs[0].config,
  isaBalance: 200000, isaReturn: 0.03, isaDrawdownStrategy: 'minimiseEarlyTax'
};

describe('cross-validation v2: full replay with protection on', () => {
  it('draws stay finite; drawdown math agrees whenever the protection/boost overlays agree', async () => {
    const all = [];
    const perSeed = [];
    for (let seed = 0; seed < SEEDS; seed++) {
      const res = await replayStateful(config, seed);
      all.push(...res.rows);
      perSeed.push(res);
    }

    // (1) finiteness
    const summary = summarize(all);
    expect(summary.nonFiniteRows).toBe(0);

    // (2) on HEALTHY months (neither in protection, neither boosting) both SIPP and ISA must
    //     match to the penny — isolating all divergence to the protection/boost overlays.
    let healthy = 0, healthyMax = 0;
    for (const r of all) {
      const bothHealthy = !r.simProt && !r.decProt && r.simBoost < 50 && r.decBoost < 50;
      if (!bothHealthy) continue;
      healthy++;
      healthyMax = Math.max(healthyMax, Math.abs(r.dSipp), Math.abs(r.dIsa));
    }
    expect(healthy).toBeGreaterThan(0);
    expect(healthyMax).toBeLessThan(EPS);

    // (3) report the overlay-divergence characteristics
    if (process.env.CROSSVAL_REPORT) {
      let protMismatch = 0, bothProt = 0, isaScaleDiv = 0;
      for (const r of all) {
        if (r.simProt !== r.decProt) protMismatch++;
        if (r.simProt && r.decProt) { bothProt++; if (Math.abs(r.dIsa) > EPS) isaScaleDiv++; }
      }
      /* eslint-disable no-console */
      console.log(`\n[cross-val v2] ${SEEDS} seeds, ${all.length} months, protection ON`);
      console.log(`  healthy months (both agree, no boost): ${healthy}  max |Δ| there = £${healthyMax.toFixed(4)} (drawdown math)`);
      console.log(`  (A) protection-state mismatches: ${protMismatch} (${(100 * protMismatch / all.length).toFixed(1)}% of months)`);
      console.log(`  (B) both-protected months: ${bothProt}, of which ISA draw differs (sim scales, decision doesn't): ${isaScaleDiv}`);
      console.log(`  overall max |Δ SIPP| = £${summary.maxAbsSippDivergence.toFixed(0)}  mean |Δ SIPP| = £${summary.meanAbsSippDivergence.toFixed(2)}`);
      if (summary.worst) {
        const w = summary.worst;
        console.log(`  worst month ${w.date}: sim £${w.simSipp.toFixed(0)} (prot ${w.simProt}) vs decision £${w.decSipp.toFixed(0)} (prot ${w.decProt})`);
      }
      /* eslint-enable no-console */
    }
  });

  it('produces a Decision history + tax-year set for inspection (the "fully filled out retiree")', async () => {
    const res = await replayStateful(config, 0);
    // A full-term run yields one history row per month and one tax-year config per year.
    expect(res.history.length).toBe(res.months);
    expect(Object.keys(res.taxYears).length).toBeGreaterThanOrEqual(Math.floor(res.months / 12));
    // History rows carry the fields the Decision Tool renders (source, protection, SIPP, ISA).
    const h = res.history[0];
    expect(h).toHaveProperty('date');
    expect(h).toHaveProperty('source');
    expect(h).toHaveProperty('sipp');
    expect(h).toHaveProperty('isa');
    expect(h).toHaveProperty('taxYear');
  });
});
