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
    // (everything but the plan read, env.fromPlan.plan — the plan with its window, which is what the drawing years run on)
    const noPlan = (r) => JSON.stringify({ ...r, env: { ...r.env, fromPlan: { ...r.env.fromPlan, plan: null } } });
    expect(noPlan(saverInputsOf(windowOnly, { today: TODAY }))).toBe(noPlan(read0));
    const other = ['cautious', 'balanced', 'adventurous'].find((l) => l !== read0.inputs.savingRisk) || 'adventurous';
    const read1 = saverInputsOf(withLevel(plan, other), { today: TODAY });
    expect(read1.inputs.savingRisk).toBe(other);
    expect(read1.env.savingMix.equity).toBeCloseTo(RISK_PRESETS[other].equity, 12);
    // only the saving mix moves: the mix at the stop, the pot and the pay-in are the plan's
    expect(read1.inputs.risk).toBe(read0.inputs.risk);
    expect(read1.inputs.you).toEqual(read0.inputs.you);
  });

  it('a plan kept from answer B: a level chosen since is the verdict\'s saving level too, as the path reads it; with none, B\'s own', async () => {
    const { answerB } = await import('../../../src/answers/b/answer.js');
    const { buildPlanSeed } = await import('../../../src/answers/keep/planSeed.js');
    const { seedToScenario } = await import('../../../src/services/PlanFromSeed.js');
    const { upgradeScenario } = await import('../../../src/firebase/scenarioMigration.js');
    const KEPT_ON = '2026-11-04';
    const ENV = { today: KEPT_ON, futures: 100, seed: 0, detail: 'answer' };
    const b = { household: 'single', you: { pot: 62000, age: 41, statePension: { kind: 'full' }, finalSalary: { has: false }, payIn: { kind: 'total', total: 417.07 } }, stop: { age: 63 }, spend: { kind: 'amount', amount: 1810 }, endAge: 95, savingRisk: 'balanced', risk: 'balanced' };
    const seed = buildPlanSeed({ source: 'b', result: answerB(b, ENV), env: { today: KEPT_ON, appVersion: 'test' }, name: 'Sam saving', createdAt: KEPT_ON + 'T10:00:00.000Z', payIn: 'now' });
    const made = seedToScenario(seed, KEPT_ON).yours; made.id = 'SamSaving01';
    const plan = upgradeScenario(copy(made), { now: noon(KEPT_ON) }).scenario;
    const r0 = saverInputsOf(plan, { today: KEPT_ON });
    expect(r0.inputs.savingRisk).toBe('balanced');
    // 7.12.0: how the tax is added back, so take-home pay is said exactly; and the plan itself, whose drawing years the
    // verdict runs on (the lead's ruling 10): its stop, the amount read at it and its charge. The mixes are the levels'.
    expect(r0.env).toEqual({ scheme: { kind: 'ras', salary: 0 }, fromPlan: { plan, stopAge: 63, monthly: 1810, charge: 0.5 } });
    const chose = { ...plan, ...phasesPatch(plan, 'saving.level', 'adventurous', { at: KEPT_ON + 'T12:00:00.000Z' }) };
    const r1 = saverInputsOf(chose, { today: KEPT_ON });
    expect(r1.inputs.savingRisk).toBe('adventurous');
    expect(r1.inputs.risk).toBe(r0.inputs.risk);   // the mix at the stop stays the answer's
    const ss = effectiveStressSettings(chose, { now: noon(KEPT_ON) });
    const path = savingPathMixes(ss, null, chose.accumulationTool.settings, chose.phases);
    expect(path.fromLevel).toBe('adventurous');
    expect(RISK_PRESETS[r1.inputs.savingRisk].equity).toBeCloseTo(path.saving.equity, 12);
    // the verdict moves with it
    expect(answerB(r1.inputs, { ...ENV, ...r1.env }).chance.fails).not.toBe(answerB(r0.inputs, { ...ENV, ...r0.env }).chance.fails);
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
