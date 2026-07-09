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

  it('BUG pinned: silently dropping State Pension worsens the success rate', () => {
    const base = fixtures.cases['base / SP from year 5'].mc.successRate;
    const dropped = fixtures.cases['DROPPED-SP BUG: legacy statePension set but no spStartYear'].mc.successRate;
    expect(dropped).toBeLessThan(base); // SP wrongly ignored → more SIPP drawn → looks worse
  });
});
