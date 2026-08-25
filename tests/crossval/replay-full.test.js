/**
 * Cross-validation v2 (full fidelity): replay a trajectory through the Decision engine with
 * PROTECTION ON, building up the Decision history + tax years exactly as the tool would show
 * them. Feeds the sim's own monthly fund values (per the chosen approach).
 *
 * Findings this pins — the two engines agree to the penny on the tax-efficient DRAWDOWN. On the
 * downturn overlay:
 *   (A) OPEN: protection entry/exit uses different rules (sim: N consecutive cash draws, exit at
 *       min+£5k; decision: growth<min AND N cash draws, exit at min+recoveryBuffer), so they
 *       disagree on whether a given month is "protected" (~2.8% of months), which also drives
 *       different tax-boost catch-up downstream.
 *   (B) RESOLVED: protection now reduces only the SIPP (the draw on the stressed growth/cash
 *       pots) and keeps the ISA top-up — a stable money-market fund — at its full value, in
 *       BOTH engines. (The sim used to scale the ISA too; fixed to match the Decision engine.)
 *   (C) RESOLVED: the tax-boost catch-up is one shared planTaxBoost with a per-month cap, and
 *       the sim's tax year is aligned to its simulation year — so no more end-of-tax-year "draw
 *       £17k this month" cram. Residual mean |Δ SIPP| fell from ~£50 to ~£6.
 * Remaining divergence is only (A): the residual 0.3% of months where protection state differs
 * (pre- vs post-return timing between a forward-simulator and a point-in-time advisor), plus the
 * boost's dependence on that state — an inherent floor, not a rule mismatch.
 * This test:
 *   1. asserts every draw is finite,
 *   2. asserts that on HEALTHY months (neither in protection, neither boosting) both SIPP and
 *      ISA match to the penny (⇒ ALL remaining divergence is the protection-state overlay (A)),
 *   3. asserts (B) stays resolved: on both-protected months the ISA draw matches to the penny,
 *   4. asserts the overall mean SIPP divergence stays small (regression guard for (C)),
 *   5. reports the residual (A) protection-divergence rate and worst month (CROSSVAL_REPORT=1).
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

    // (3) finding (B) stays resolved: on both-protected months the ISA draw matches to the penny
    //     (the SIPP is reduced by protection in both engines; the ISA top-up is not).
    let bothProt = 0, bothProtIsaMax = 0;
    for (const r of all) {
      if (r.simProt && r.decProt) { bothProt++; bothProtIsaMax = Math.max(bothProtIsaMax, Math.abs(r.dIsa)); }
    }
    expect(bothProt).toBeGreaterThan(0);
    expect(bothProtIsaMax).toBeLessThan(EPS);

    // (4) regression guard for (C): with the shared tax-boost + aligned tax year, the overall
    //     mean SIPP divergence is small (~£6). Was ~£50 before boost unification.
    expect(summary.meanAbsSippDivergence).toBeLessThan(20)   // overlay-timing mismatch share; rose 15→18% when the equity series moved to world data;

    // (5) report the residual (A) protection-state divergence
    if (process.env.CROSSVAL_REPORT) {
      let protMismatch = 0;
      for (const r of all) if (r.simProt !== r.decProt) protMismatch++;
      /* eslint-disable no-console */
      console.log(`\n[cross-val v2] ${SEEDS} seeds, ${all.length} months, protection ON`);
      console.log(`  healthy months (both agree, no boost): ${healthy}  max |Δ| there = £${healthyMax.toFixed(4)} (drawdown math)`);
      console.log(`  (A) protection-state mismatches: ${protMismatch} (${(100 * protMismatch / all.length).toFixed(1)}% of months)`);
      console.log(`  (B) ISA-on-protection now unified: both-protected months ${bothProt}, ISA max |Δ| = £${bothProtIsaMax.toFixed(4)}`);
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
