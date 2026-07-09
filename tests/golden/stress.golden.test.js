/**
 * Golden-master: the stress engine (SimulationEngine) must keep reproducing the
 * committed fixtures. Deterministic via seededRng (no Math.random / Date). During the
 * unification refactor, the unified engine runs against these; drift is reviewed.
 *
 * Regenerate fixtures with:  node tests/golden/generate.mjs
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { stressConfigs } from './matrix.js';
import { pickStress } from './canonical.js';
import { runMonteCarlo, runHistorical, analyzeResults } from '../../src/services/SimulationEngine.js';

const baseConfig = stressConfigs[0].config;

const here = dirname(fileURLToPath(import.meta.url));
const fixtures = JSON.parse(readFileSync(join(here, 'fixtures/stress.json'), 'utf8'));

describe('golden-master: stress engine', () => {
  it('every config reproduces its committed fixture exactly', () => {
    expect(Object.keys(fixtures.cases).length).toBe(stressConfigs.length);
    for (const c of stressConfigs) {
      const mc = pickStress(analyzeResults(runMonteCarlo(c.config, fixtures.mcRuns)));
      const hist = pickStress(analyzeResults(runHistorical(c.config)));
      expect({ mc, hist }, `config: ${c.name}`).toEqual(fixtures.cases[c.name]);
    }
  });

  it('BUG pinned: legacy State Pension is silently ignored (identical to no-SP)', () => {
    // The default-style config sets legacy statePension=12000/statePensionYear=12, but the
    // engine only pays SP when spWeeklyAmount>0 AND takes the new-format branch when
    // spStartYear is defined — so the legacy fields are wholly ignored. This assertion
    // FLIPS the moment the bug is fixed (honouring legacy SP would raise the success rate),
    // unlike a "dropped < base" comparison which conflates two different SP schedules.
    const dropped = fixtures.cases['DROPPED-SP BUG: legacy statePension set but no spStartYear'].mc;
    const noSP = fixtures.cases['no State Pension configured (spWeeklyAmount 0)'].mc;
    expect(dropped.successRate).toBe(noSP.successRate);
    expect(dropped).toEqual(noSP); // byte-identical: legacy SP contributes nothing
  });

  it('BUG pinned: a NaN-blowup run is counted as a successful full-term survival', () => {
    // Seed-0 Monte-Carlo run: the bond model computes (1+r)^(1/12) with r < -1 → NaN,
    // which propagates to `final`; Math.max(0, NaN) never trips the depletion check, so the
    // run reports failed=false / full years with a NaN final value (and poisons the
    // finalValue.avg/min metrics — see canonical.pickStress). Pinned so the unification
    // fix (clamp returns > -1 / treat non-finite as failed) produces a reviewed change.
    const r0 = runMonteCarlo(baseConfig, 1)[0];
    expect(Number.isNaN(r0.final)).toBe(true);
    expect(r0.failed).toBe(false);
    expect(r0.years).toBe(baseConfig.years);
  });
});
