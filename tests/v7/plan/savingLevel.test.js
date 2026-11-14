/**
 * The saving level (7.10.0, spec-7100 §6): a level the person chose for the saving years (`phases.saving.strategy.level`)
 * decides the pension's saving mix — in the verdict (saverInputs), the check-in's first path and the lock's path — and only
 * when it is stored. A level the plan is only read at (derived, Phases.phasesOf) is shown, never read by the engine, so a
 * plan with no `phases` is read exactly as before. The fixtures are fictional.
 */
import { describe, it, expect } from 'vitest';
import { savingPathMixes, storedSavingLevelOf, buildSavingPath } from '../../../src/services/SavingPath.js';
import { RISK_PRESETS } from '../../../src/services/GlidepathService.js';
import { saverInputsOf } from '../../../src/answers/plan/saverInputs.js';
import { phasesPatch, phasesOf } from '../../../src/services/Phases.js';
import { deriveTiming } from '../../../src/services/PlanTiming.js';
import { effectiveStressSettings } from '../../../src/services/PlanReading.js';
import { corpus, entryOf, noon, TODAY } from './_plans.js';

const C = corpus();
const copy = (v) => JSON.parse(JSON.stringify(v));
const AT = TODAY + 'T12:00:00.000Z';
const withLevel = (plan, level) => ({ ...plan, ...phasesPatch(plan, 'saving.level', level, { at: AT }) });

describe('the saving level the person chose decides the saving mix; nothing derived is read', () => {
  it('savingPathMixes: no phases, or phases with no level, reads as before; a chosen level is its preset mix', () => {
    const s = { equityMin: 300000, bondMin: 150000, cashTarget: 50000 };
    const prop = { total: 100, buckets: { shares: 0.9, bonds: 0.05, diversifiers: 0, cash: 0.05 } };
    const before = savingPathMixes(s, prop, null);
    expect(savingPathMixes(s, prop, null, null)).toEqual(before);
    expect(savingPathMixes(s, prop, null, { moving: { window: { years: 4, at: AT } } })).toEqual(before);
    expect(savingPathMixes(s, prop, null, { saving: { strategy: { level: 'somewhere' } } })).toEqual(before);
    for (const level of ['cautious', 'balanced', 'adventurous']) {
      const m = savingPathMixes(s, prop, { savingMix: { equity: 0.2, bond: 0.8, cash: 0 } }, { saving: { strategy: { level, endTarget: 'drawdown', at: AT } } });
      const P = RISK_PRESETS[level];
      expect(m.saving.equity).toBeCloseTo(P.equity, 12);
      expect(m.saving.bond).toBeCloseTo(P.bond, 12);
      expect(m.saving.cash).toBeCloseTo(P.cash, 12);
      expect(m.fromLevel).toBe(level);
      expect(m.fromHoldings).toBe(false);
      expect(m.drawing).toEqual(before.drawing);   // the mix at the stop is the plan's own, whatever the level
    }
    expect(storedSavingLevelOf(null)).toBe(null);
    expect(storedSavingLevelOf({ saving: { strategy: { level: 'adventurous' } } })).toBe('adventurous');
  });

  it('the verdict\'s inputs: the stored level in place of the held mix; a derived level changes nothing', () => {
    const raw = copy(C['05-saver-committed']);
    const plan = entryOf(raw).plan;
    const read0 = saverInputsOf(plan, { today: TODAY });
    // the level phasesOf derives is shown only: passing a plan whose phases hold no level reads the same
    const derived = phasesOf(plan, { now: noon(TODAY) }).saving.strategy.level;
    expect(['cautious', 'balanced', 'adventurous']).toContain(derived);
    const windowOnly = { ...plan, ...phasesPatch(plan, 'window', 4, { at: AT }) };
    expect(JSON.stringify(saverInputsOf(windowOnly, { today: TODAY }))).toBe(JSON.stringify(read0));
    const other = ['cautious', 'balanced', 'adventurous'].find((l) => l !== read0.inputs.savingRisk) || 'adventurous';
    const read1 = saverInputsOf(withLevel(plan, other), { today: TODAY });
    expect(read1.inputs.savingRisk).toBe(other);
    expect(read1.env.savingMix.equity).toBeCloseTo(RISK_PRESETS[other].equity, 12);
    // only the saving mix moves: the mix at the stop, the pot and the pay-in are the plan's
    expect(read1.inputs.risk).toBe(read0.inputs.risk);
    expect(read1.inputs.you).toEqual(read0.inputs.you);
  });

  it('a path drawn for a lock reads the stored level; with none it is drawn as before', () => {
    const raw = copy(C['10-couple-b']);
    const plan = entryOf(raw).plan;
    const now = noon(TODAY);
    const settings = effectiveStressSettings(plan, { now });
    const timing = deriveTiming(settings, now);
    if (timing.mode !== 'future') return;   // (the fixture is a saver: it stops later)
    const a = { settings, timing, accumulation: plan.accumulationTool && plan.accumulationTool.settings, holdings: plan.holdings || null, now, lives: 50 };
    const before = buildSavingPath(a);
    expect(JSON.stringify(buildSavingPath({ ...a, phases: null }))).toBe(JSON.stringify(before));
    const chosen = buildSavingPath({ ...a, phases: { saving: { strategy: { level: 'cautious', endTarget: 'drawdown', at: AT } } } });
    expect(chosen.mixes.saving.equity).toBeCloseTo(RISK_PRESETS.cautious.equity, 12);
  });
});
