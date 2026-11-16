/**
 * One set of settings until the lock (7.12.0, src/services/DraftDecision.js, src/ui/draftPlanLine.js).
 *
 * An unlocked plan's Decision settings are read from its Stress settings, never the factory defaults a draft used to
 * carry (£250,000 / £200,000 / £50,000 pots, £30,000 income, no State Pension). A locked plan reads its stored copy.
 * Every person and figure here is made up.
 */
import { describe, it, expect, vi } from 'vitest';

vi.mock('../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));

import { seedToScenario } from '../src/services/PlanSeed.js';
import { decisionSettingsAsRead, planHasFigures } from '../src/services/DraftDecision.js';
import { draftLineOf, DRAFT_WORDS } from '../src/ui/draftPlanLine.js';
import { monthInputsOf } from '../src/services/MonthDecision.js';
import { effectiveStressSettings } from '../src/services/PlanReading.js';
import { getDefaultScenario } from '../src/storage/ScenarioRepository.js';
import { seedA, seedCNow } from './integration/fixtures/planSeeds.js';

const NOW = new Date(2026, 9, 2, 9, 30);
const potsOf = (s) => (+s.equityMin || 0) + (+s.bondMin || 0) + (+s.cashTarget || 0) + (+s.diversifierStart || 0);

/** Jo, 62, keeps "Will it last?": £250,000 in a pension, £20,000 in ISAs and savings, £1,800 a month from today. */
function jo() {
  const seed = seedCNow();
  seed.inputs.savings = 20000;
  seed.people[0].savings = { today: 20000, atStop: { careful: 20000, middling: 20000 } };
  seed.spend.perMonth = 1800;
  seed.people[0].takeHome = [{ fromAge: 62, perMonth: 1800 }];
  seed.name = { suggested: 'From 62 · £1,800 a month', chosen: 'From 62 · £1,800 a month' };
  return seedToScenario(seed, NOW).yours;
}

describe('an unlocked plan reads its Decision settings from its Stress settings', () => {
  it('Jo: the pots, the ISA, the income and the State Pension are the plan\'s, not the defaults', () => {
    const plan = jo();
    const ss = effectiveStressSettings(plan, { now: NOW });
    const d = decisionSettingsAsRead(plan, { now: NOW });
    expect(d.equityMin + d.bondMin + d.cashTarget + (d.diversifierStart || 0)).toBe(250000);
    expect(d.isaBalance).toBe(20000);
    expect(d.baseSalary).toBe(ss.baseSalary);
    expect(d.baseSalary).not.toBe(30000);
    expect(d.spWeeklyAmount).toBe(ss.spWeeklyAmount);
    expect(d.spWeeklyAmount).toBeGreaterThan(0);
    expect(d.locked).toBe(false);
    expect(d.configured).toBe(true);
    expect(planHasFigures(plan)).toBe(true);
  });

  it('the simple view\'s month page reads the same settings (before: the stored defaults, pots adding to 500,000)', () => {
    const plan = jo();
    const I = monthInputsOf(plan, { now: NOW });
    expect(potsOf(I.settings)).toBe(250000);
    expect(I.settings.isaBalance).toBe(20000);
  });

  it('a saver kept from "Will it last?" reads today\'s pots too', () => {
    const plan = seedToScenario(seedA(), NOW).yours;
    const d = decisionSettingsAsRead(plan, { now: NOW });
    expect(potsOf(d)).toBe(potsOf(plan.stressTool.settings));
    expect(potsOf(d)).not.toBe(500000);
  });

  it('a locked plan reads its stored copy, byte for byte', () => {
    const plan = jo();
    const stored = { ...plan.decisionTool.settings, equityMin: 111000, bondMin: 22000, cashTarget: 3000, baseSalary: 19999, locked: true };
    plan.decisionTool.settings = stored;
    const text = JSON.stringify(stored);
    expect(JSON.stringify(decisionSettingsAsRead(plan, { now: NOW }))).toBe(text);
    expect(JSON.stringify(plan.decisionTool.settings)).toBe(text);
  });

  it('reading writes nothing', () => {
    const plan = jo();
    const before = JSON.stringify(plan);
    decisionSettingsAsRead(plan, { now: NOW });
    monthInputsOf(plan, { now: NOW });
    expect(JSON.stringify(plan)).toBe(before);
  });
});

describe('what the Decision tool says on an unlocked plan', () => {
  it('Jo: the plan\'s figures, with no scold', () => {
    const plan = jo();
    const ss = effectiveStressSettings(plan, { now: NOW });
    const line = draftLineOf(plan, { stress: ss, stage: { key: 'draft-retired' } });
    expect(line.kind).toBe('figures');
    expect(line.text).toContain('This plan is not locked yet. Recording its first month locks it, and you are asked first.');
    expect(line.text).toContain('pension £250,000');
    expect(line.text).toContain('ISAs and savings £20,000');
    const gross = Array.isArray(ss.targetSchedule) && ss.targetSchedule.length ? ss.targetSchedule[0] : ss.baseSalary;
    expect(line.text).toContain('£' + Math.round(gross).toLocaleString('en-GB') + ' a year before tax.');
    for (const w of ['defaults', 'meaningless', 'recommendation']) expect(line.text).not.toContain(w);
    expect(line.btn).toBe('Open the Stress tester');
  });

  it('a plan straight from the full view\'s wizard has no figures yet', () => {
    const plan = getDefaultScenario('My plan');
    expect(planHasFigures(plan)).toBe(false);
    const line = draftLineOf(plan, { stress: plan.stressTool.settings, stage: { key: 'unknown' } });
    expect(line).toEqual({ kind: 'none', text: DRAFT_WORDS.none, btn: 'Open Stress tester settings' });
    expect(line.text).toBe('This plan has no figures yet. Add your pot and what you want to spend on Stress tester → Settings.');
    expect(decisionSettingsAsRead(plan, { now: NOW }).configured).toBe(false);
  });

  it('a saver, or a locked plan, has no line here', () => {
    const plan = jo();
    expect(draftLineOf(plan, { stage: { key: 'saving' } })).toBeNull();
    plan.decisionTool.settings.locked = true;
    expect(draftLineOf(plan, { stage: { key: 'running' } })).toBeNull();
  });
});
