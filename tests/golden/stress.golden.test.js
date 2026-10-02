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

import { stressConfigs, chargedStressConfigs, CHARGED_PCT, isaGrowthStressConfigs, ISA_GROWTH_TWINS } from './matrix.js';
import { pickStress } from './canonical.js';
import { runMonteCarlo, runHistorical, analyzeResults } from '../../src/services/SimulationEngine.js';

const baseConfig = stressConfigs[0].config;

const here = dirname(fileURLToPath(import.meta.url));
const fixtures = JSON.parse(readFileSync(join(here, 'fixtures/stress.json'), 'utf8'));

describe('golden-master: stress engine', () => {
  it('every config reproduces its committed fixture exactly', () => {
    expect(Object.keys(fixtures.cases).length).toBe(stressConfigs.length + chargedStressConfigs.length + isaGrowthStressConfigs.length);
    for (const c of [...stressConfigs, ...chargedStressConfigs, ...isaGrowthStressConfigs]) {
      const mc = pickStress(analyzeResults(runMonteCarlo(c.config, fixtures.mcRuns)));
      const hist = pickStress(analyzeResults(runHistorical(c.config)));
      expect({ mc, hist }, `config: ${c.name}`).toEqual(fixtures.cases[c.name]);
    }
  });

  // Fund and platform charges (6.19.0): a new or migrated unlocked plan carries 0.5% a year; a plan locked before
  // charges carries none and runs as the configs above. Both are live, so both are pinned: every config has a charged
  // twin, which is the same config with the charge and nothing else, and whose figures are lower.
  it('every config has a charged twin: the same config at 0.5% a year, pinned beside it, with a lower typical end pot', () => {
    expect(CHARGED_PCT).toBe(0.5);
    expect(chargedStressConfigs.map((c) => c.name)).toEqual(stressConfigs.map((c) => c.name + ' · charges 0.5%'));
    chargedStressConfigs.forEach((t, i) => {
      const { chargesPct, ...rest } = t.config;
      expect(chargesPct, t.name).toBe(0.5);
      expect(rest, t.name).toEqual(stressConfigs[i].config);
      const plain = fixtures.cases[stressConfigs[i].name], charged = fixtures.cases[t.name];
      for (const kind of ['mc', 'hist']) {
        expect(charged[kind].finalValue.p50, `${t.name} ${kind}`).toBeLessThan(plain[kind].finalValue.p50);
        expect(charged[kind].successRate, `${t.name} ${kind}`).toBeLessThanOrEqual(plain[kind].successRate);
      }
    });
  });

  // How the ISA grows (6.22.0): a new or migrated unlocked plan carries 0.5% charges AND the ISA choice ("Mostly cash" by
  // default); a plan locked before the choice carries none and its ISA grows at the fixed 3%. Every config has a twin at
  // each choice, the charged sibling with the choice and nothing else. With no ISA the choice has nothing to grow: the
  // twin IS its sibling, figure for figure. With an ISA it moves (both ways: see the moved-by table in the report).
  it('every config has a twin at each ISA choice: its charged sibling plus the choice; with no ISA the same figures, with one different', () => {
    expect(ISA_GROWTH_TWINS.map((t) => t.isaGrowth)).toEqual(['cash', 'invested']);
    expect(isaGrowthStressConfigs).toHaveLength(2 * stressConfigs.length);
    for (const t of isaGrowthStressConfigs) {
      const sibling = chargedStressConfigs.find((c) => c.name === t.sibling);
      expect(sibling, t.name).toBeTruthy();
      const { isaGrowth, ...rest } = t.config;
      expect(isaGrowth, t.name).toBe(t.isaGrowth);
      expect(rest, t.name).toEqual(sibling.config);
      const plain = fixtures.cases[t.sibling], twin = fixtures.cases[t.name];
      if (!(t.config.isaBalance > 0)) expect(twin, t.name).toEqual(plain);
      else expect(twin, t.name).not.toEqual(plain);
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

  it('ISA helps the SIPP hold up: a funded ISA raises the success rate over no-ISA', () => {
    // With a target above BRL, the sim draws the full target: no ISA → taxable SIPP above
    // BRL (harder); a funded ISA covers the above-BRL gap tax-free so the SIPP stays at BRL.
    const base = fixtures.cases['base / SP from year 5'].mc.successRate;
    const withIsa = fixtures.cases['base + £200k ISA (should beat base)'].mc.successRate;
    expect(withIsa).toBeGreaterThan(base);
  });

  it('declining spending smile beats the flat base (less drawn mid-retirement)', () => {
    // Same starting pot; the smile draws less through years 5-24, so the pot lasts better.
    const base = fixtures.cases['base / SP from year 5'].mc.successRate;
    const declining = fixtures.cases['declining spending smile (should beat flat base)'].mc.successRate;
    expect(declining).toBeGreaterThanOrEqual(base);
  });

  it('FIXED (was NaN-blowup): every run now has a finite final value', () => {
    // Regression test for the bond (1+r)^(1/12), r<-1 → NaN bug. Previously the seed-0
    // run reported failed=false with a NaN final (miscounted as a successful survival);
    // returns are now clamped to > -100% before monthly compounding.
    const results = runMonteCarlo(baseConfig, 50);
    for (const r of results) {
      expect(Number.isFinite(r.final), `seed ${r.seed}`).toBe(true);
    }
  });
});
