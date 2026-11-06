/**
 * Cross-validation: replay Stress-Tester Monte-Carlo trajectories through the Decision engine
 * and confirm they agree, over 50 seeds, Firebase-free.
 *
 * This is the correctness backstop for the two-tool design: because both engines draw through
 * the shared DrawdownStrategy (planDrawdown), the Decision Tool — driven month-by-month over a
 * real trajectory with the sim's own fund values, ISA balance, inflation, tax bands and State
 * Pension — must recommend the same monthly SIPP + ISA draw the Stress sim made. Divergence
 * would mean the two engines prepare their inputs inconsistently. See harness.js for the
 * stress→decision input translator (the "drive decision inputs from stress outputs" piece).
 *
 * Run:  npx vitest run tests/crossval/replay.test.js
 * Report only (no assertions noise):  CROSSVAL_REPORT=1 npx vitest run tests/crossval/replay.test.js
 */
import { describe, it, expect } from 'vitest';
import { stressConfigs } from '../golden/matrix.js';
import { replayStateless, summarize } from './harness.js';

const SEEDS = 50;
const EPS = 0.01; // £0.01 — floating-point tolerance; the draws are computed identically

// A funded-ISA, State-Pension-from-year-5 config: exercises band management + ISA depletion +
// the SP takeover, over a 30-year horizon. Protection is forced off (isolates drawdown math).
const baseIsaConfig = {
  ...stressConfigs.find(c => /ISA \(should beat/.test(c.name)).config,
  isaBalance: 200000, isaReturn: 0.03, isaDrawdownStrategy: 'minimiseEarlyTax'
};

async function runSeeds(config, seeds = SEEDS) {
  const all = [];
  let anyFailed = false, monthsTotal = 0;
  for (let seed = 0; seed < seeds; seed++) {
    const { rows, failed, months } = await replayStateless(config, seed);
    all.push(...rows);
    anyFailed = anyFailed || failed;
    monthsTotal += months;
  }
  return { summary: summarize(all), monthsTotal };
}

describe('cross-validation: decision engine reproduces the stress trajectory', () => {
  it(`agrees to the penny on SIPP + ISA draw across ${SEEDS} seeds (Option A / band management)`, async () => {
    const { summary, monthsTotal } = await runSeeds(baseIsaConfig);

    if (process.env.CROSSVAL_REPORT) {
      // eslint-disable-next-line no-console
      console.log(`\n[cross-val] ${SEEDS} seeds, ${monthsTotal} months compared`);
      // eslint-disable-next-line no-console
      console.log(`  max |Δ SIPP| = £${summary.maxAbsSippDivergence.toFixed(4)}` +
        `  max |Δ ISA| = £${summary.maxAbsIsaDivergence.toFixed(4)}`);
      if (summary.worst && summary.worst.mag > EPS) {
        // eslint-disable-next-line no-console
        console.log('  worst row:', JSON.stringify(summary.worst));
      }
    }

    expect(summary.nonFiniteRows).toBe(0);          // no NaN/Infinity leaked into a draw
    expect(summary.compared).toBe(monthsTotal);      // every month compared
    expect(summary.maxAbsSippDivergence).toBeLessThan(EPS);
    expect(summary.maxAbsIsaDivergence).toBeLessThan(EPS);
  });

  it('also agrees with no ISA (legacy allocation path, target below BRL binds)', async () => {
    // Lower target so the whole draw sits under BRL, and no ISA pot: exercises the non-ISA
    // branch of the decision engine against the sim's no-ISA draw.
    const noIsa = {
      ...stressConfigs.find(c => /lower target salary/.test(c.name)).config,
      isaBalance: 0
    };
    const { summary } = await runSeeds(noIsa, 20);
    expect(summary.nonFiniteRows).toBe(0);
    expect(summary.maxAbsSippDivergence).toBeLessThan(EPS);
    expect(summary.maxAbsIsaDivergence).toBeLessThan(EPS);
  });

  it('KNOWN GAP: maximiseLongevity + scarce ISA diverges (decision hardcodes yearsUntilSp=0)', async () => {
    // The Stress engine passes the real years-until-State-Pension into planDrawdown so Option B
    // (maximiseLongevity) rations the ISA at balance/yearsUntilSp. The Decision engine's ISA-pot
    // path hardcodes yearsUntilSp=0, making the ration cap Infinity — it spends the ISA freely.
    //
    // This is UNREACHABLE in the shipped Decision Tool (no UI selects the strategy; it is always
    // Option A / minimiseEarlyTax, for which yearsUntilSp is unused — see the byte-identical
    // tests above). It becomes a real bug only if the longevity strategy is later exposed there,
    // at which point the decision engine must forward a real yearsUntilSp and this test should be
    // tightened to `toBeLessThan(EPS)`. We pin it with a scarce-ISA + long-bridge config so the
    // ration cap actually binds and the divergence is deterministic.
    const scarce = {
      ...stressConfigs[0].config,
      baseSalary: 70000, spStartYear: 10, spWeeklyAmount: 230,
      isaBalance: 30000, isaReturn: 0.03, disableProtection: true,
      isaDrawdownStrategy: 'maximiseLongevity'
    };
    const { summary } = await runSeeds(scarce, 10);
    expect(summary.nonFiniteRows).toBe(0);
    expect(summary.maxAbsSippDivergence).toBeGreaterThan(1000); // ~£1.6k/mo, not floating noise
  });
});
