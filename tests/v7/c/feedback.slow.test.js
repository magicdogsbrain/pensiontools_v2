/**
 * The solved figure, fed back through today's saved-plan path (answer-C-and-household.md 2.9 rule 3; build brief 6, P2):
 * the careful amount, saved in today's settings shape and run through createSimulationConfigFromSettings →
 * planFromSettings → stressTestStrategy('pots-and-valves') at the same number of futures, fails in at most 10% of
 * them; and a figure £50 a month higher fails in more than 10%.
 *
 * The two paths count years differently. The answer's plan years run from today (the birthday, since the age is
 * all it knows), so the State Pension starts on a plan-year boundary and is paid for the whole of its first year.
 * A saved plan's years are TAX years from 6 April, so the same State Pension (starting on the birthday) is paid
 * for about 52% of its first plan year (30 September → 6 April). On the same first-year share the two paths agree
 * future for future; on the saved plan's own share the answer's careful amount fails in about 12 futures in 100
 * (answer-C-and-household.md 1.5 measured the same: "from 1 future in 10 failing to 1.2 in 10"). Both are asserted.
 *
 * Also: the adapter's config against today's function on the same settings, field by field.
 */
import { describe, it, expect } from 'vitest';
import { createSimulationConfigFromSettings } from '../../../src/storage/StressRepository.js';
import { planFromSettings, stressTestStrategy } from '../../../src/strategies/stressTest.js';
import { enginePlan, configsAt } from '../../../src/answers/shared/toEngine.js';
import { toHousehold } from '../../../src/answers/c/toHousehold.js';
import { checkInputs } from '../../../src/answers/shared/validate.js';
import { RULES, addYears } from '../../../src/answers/shared/rules.js';
import { at } from '../../helpers/clock.js';
import { SCHEMA_C, TEST_ENV } from './_c.js';
import { answerC } from './invariants.js';

const N = Number(process.env.V7_FEEDBACK_FUTURES || 300);
const ENV = { ...TEST_ENV, futures: N };
const NOW = at(2026, 9, 30);

/** The answer's plan for a single person, saved the way today's app saves a plan (answer-C-and-household.md 1.6). */
function settingsFor(inputs, monthly) {
  const env = { today: ENV.today };
  const checked = checkInputs(SCHEMA_C, inputs, env).inputs;
  const plan = enginePlan(toHousehold(checked, env).household, env);
  const [{ config }] = configsAt(plan, monthly * 12);
  const you = plan.people[0];
  return {
    plan, config,
    settings: {
      equityMin: config.equityMin, bondMin: config.bondMin, cashTarget: config.cashTarget, duration: plan.years,
      baseSalary: config.baseSalary, other: 0, targetSchedule: config.targetSchedule, incomeShape: 'phases',
      spStartDate: addYears(ENV.today, you.statePension.startAge - you.ageToday), spWeeklyAmount: you.statePension.amount / 52,
      currentAge: you.ageToday, currentAgeAsOf: ENV.today, retired: true, firstTaxYear: 2026,
      pa: RULES.personalAllowance, brl: RULES.basicRateLimit, hrl: RULES.higherRateLimit, taxMode: 'inflates',
      protectionMult: 0.8, consecutiveLimit: 3, disableProtection: true, hodlEnabled: false, hodlValue: 25000,
      isaBalance: you.isa, isaReturn: undefined, strategyId: 'pots-and-valves', accessMethod: 'ufpls',
      // the adapter tells the engine a final-salary pension rises in full (toEngine.js: the pot's job is its own share); none here
      dbAmount: 0, dbStartYear: 0, dbIndexation: 'cpi', spendingProfile: 'flat', equityGlideEnabled: false, diversifierStart: 0, taggedFunds: [],
      seededFrom: 'v7-household'
    }
  };
}

function ruinOf(settings, plan, { firstYearShare = null } = {}) {
  const cfg = createSimulationConfigFromSettings({}, settings);
  const p = planFromSettings(settings, cfg, { now: NOW, startAge: plan.startAge });
  const q = firstYearShare === null ? p : { ...p, spFirstYearRatio: firstYearShare, pnvCfg: { ...p.pnvCfg, spFirstYearRatio: firstYearShare } };
  const r = stressTestStrategy('pots-and-valves', { ...q, mcRuns: N });
  return { cfg, p, ruin: r.ruin.mc, survived: r.survivedMc };
}

describe('the careful amount fed back through today\'s saved-plan path', () => {
  const inputs = { you: { pot: 250000, age: 58 } };
  const answer = answerC(inputs, ENV);

  it('on the same first-year share of the State Pension: at most 1 future in 10 fails, the same futures as the answer; £50 a month more fails in more', () => {
    expect(answer.status).toBe('ok');
    const { settings, plan } = settingsFor(inputs, answer.monthly.careful);
    const same = ruinOf(settings, plan, { firstYearShare: 1 });
    expect(same.p.durationYears).toBe(plan.years);
    expect(same.p.spStartYear).toBe(9);
    expect(same.survived).toHaveLength(N);
    expect(same.ruin).toBeLessThanOrEqual(10);
    expect(Math.round((100 - same.ruin) / 100 * N) / N).toBeCloseTo(answer.lasted.careful, 9);
    const higher = settingsFor(inputs, answer.monthly.careful + 50);
    expect(ruinOf(higher.settings, higher.plan, { firstYearShare: 1 }).ruin).toBeGreaterThan(10);
  }, 120000);

  it('on the saved plan\'s own share (about 52% of the first tax year): about 1.2 futures in 10, as the household plan measured', () => {
    const { settings, plan } = settingsFor(inputs, answer.monthly.careful);
    const saved = ruinOf(settings, plan);
    expect(saved.p.spFirstYearRatio).toBeGreaterThan(0.4);
    expect(saved.p.spFirstYearRatio).toBeLessThan(0.6);
    expect(saved.ruin).toBeGreaterThanOrEqual(10 - 1);
    expect(saved.ruin).toBeLessThanOrEqual(15);
  }, 120000);

  it('the adapter builds the config today\'s function builds from the same settings, but for the first-year share of the State Pension', () => {
    const { settings, config } = settingsFor(inputs, answer.monthly.careful);
    const theirs = createSimulationConfigFromSettings({}, settings);
    for (const key of ['equityStart', 'bondStart', 'cashStart', 'equityMin', 'bondMin', 'cashTarget', 'years', 'duration', 'baseSalary', 'other', 'spStartYear', 'spWeeklyAmount',
      'pa', 'brl', 'hrl', 'taxMode', 'protectionMult', 'consecutiveLimit', 'disableProtection', 'hodlEnabled', 'isaBalance', 'strategyId', 'accessMethod', 'dbAmount', 'dbStartYear', 'dbIndexation', 'spendingProfile', 'targetSchedule']) {
      expect(theirs[key], key).toEqual(config[key]);
    }
    expect(theirs.spFirstYearRatio).toBeLessThan(1);
    expect(config.spFirstYearRatio).toBe(1);
  });
});
