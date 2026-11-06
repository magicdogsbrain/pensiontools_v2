/**
 * Question A's figures fed back through today's saved-plan path (step 4 brief 6, P2; test-plan-A-B.md 7.3, the C
 * pattern of tests/v7/c/feedback.slow.test.js): the plan saved in today's settings shape and run through
 * createSimulationConfigFromSettings → planFromSettings → stressTestStrategy('pots-and-valves') at the same number of
 * futures. This is the only place A's figures meet the old engine's own plan path.
 *
 *  1. Stopping today is question C: A's careful amount, saved as a plan, fails in at most 10 futures in 100 on the same
 *     first-year share of the State Pension, and £50 a month more fails in more (C's own feedback rule, through A).
 *  2. With saving years the pot at the stop differs life by life, and the saved-plan path holds one pot in every
 *     future, so the figure is bracketed: holding the good-case pot (the best 1 in 10) in every future, A's careful
 *     amount fails in at most 15 in 100 (it is the worst 1 in 10 of lives that mostly hold less); holding the bad-case
 *     pot (the worst 1 in 10), it fails at least as often as that.
 *
 * The saved plan starts at the stop age with today's markets, not with the life's own markets from the stop: a
 * different sample of the same history, which is why 2 is a bracket and not an equality.
 */
import { describe, it, expect } from 'vitest';
import { createSimulationConfigFromSettings } from '../../../src/storage/StressRepository.js';
import { planFromSettings, stressTestStrategy } from '../../../src/strategies/stressTest.js';
import { enginePlan, configsAt } from '../../../src/answers/shared/toEngine.js';
import { toHousehold as toHouseholdC } from '../../../src/answers/c/toHousehold.js';
import { SCHEMA_C } from '../../../src/answers/c/schema.js';
import { checkInputs } from '../../../src/answers/shared/validate.js';
import { RULES, addYears } from '../../../src/answers/shared/rules.js';
import { at } from '../../helpers/clock.js';
import { answerA, TEST_ENV, ENGINE_READY } from './invariants.js';

const N = Number(process.env.V7_FEEDBACK_FUTURES || 300);
const ENV = { ...TEST_ENV, futures: N };
const NOW = at(2026, 9, 30);

/** A single person of `age` with `pot` (pension only), taking `monthly`, saved the way today's app saves a plan. */
function settingsFor(age, pot, monthly) {
  const env = { today: ENV.today };
  const checked = checkInputs(SCHEMA_C, { you: { pot, age } }, env).inputs;
  const plan = enginePlan(toHouseholdC(checked, env).household, env);
  const [{ config }] = configsAt(plan, monthly * 12);
  const you = plan.people[0];
  return {
    plan,
    settings: {
      equityMin: config.equityMin, bondMin: config.bondMin, cashTarget: config.cashTarget, duration: plan.years,
      baseSalary: config.baseSalary, other: 0, targetSchedule: config.targetSchedule, incomeShape: 'phases',
      spStartDate: addYears(ENV.today, you.statePension.startAge - you.ageToday), spWeeklyAmount: you.statePension.amount / 52,
      currentAge: you.ageToday, currentAgeAsOf: ENV.today, retired: true, firstTaxYear: 2026,
      pa: RULES.personalAllowance, brl: RULES.basicRateLimit, hrl: RULES.higherRateLimit, taxMode: 'inflates',
      protectionMult: 0.8, consecutiveLimit: 3, disableProtection: true, hodlEnabled: false, hodlValue: 25000,
      isaBalance: 0, isaReturn: undefined, strategyId: 'pots-and-valves', accessMethod: 'ufpls',
      dbAmount: 0, dbStartYear: 0, dbIndexation: 'cpi', spendingProfile: 'flat', equityGlideEnabled: false, diversifierStart: 0, taggedFunds: [],
      seededFrom: 'v7-household',
      // the household's one fund and platform charge (6.19.0), as a plan made from the answer carries it
      chargesPct: config.chargesPct
    }
  };
}

function ruinOf(age, pot, monthly, { firstYearShare = 1 } = {}) {
  const { settings, plan } = settingsFor(age, pot, monthly);
  const cfg = createSimulationConfigFromSettings({}, settings);
  const p = planFromSettings(settings, cfg, { now: NOW, startAge: plan.startAge });
  const q = firstYearShare === null ? p : { ...p, spFirstYearRatio: firstYearShare, pnvCfg: { ...p.pnvCfg, spFirstYearRatio: firstYearShare } };
  return stressTestStrategy('pots-and-valves', { ...q, mcRuns: N }).ruin.mc;
}

describe.skipIf(!ENGINE_READY)('A — the answer fed back through today\'s saved-plan path', () => {
  it('stopping today: the careful amount fails in at most 10 futures in 100, and £50 a month more fails in more', () => {
    const inputs = { you: { pot: 250000, age: 58 }, stop: { age: 58 }, spend: { amount: 1200 } };
    const a = answerA(inputs, { ...ENV, ages: [58] });
    expect(a.status).toBe('ok');
    const careful = a.shown.monthly.careful;
    expect(ruinOf(58, 250000, careful)).toBeLessThanOrEqual(10);
    expect(ruinOf(58, 250000, careful + 50)).toBeGreaterThan(10);
  }, 180000);

  it('with saving years: bracketed by the good-case and the bad-case pot at the stop', () => {
    const inputs = { you: { pot: 300000, age: 55, payIn: { total: 800 } }, stop: { age: 60 }, spend: { amount: 2000 } };
    const a = answerA(inputs, { ...ENV, ages: [60] });
    expect(a.status).toBe('ok');
    const careful = a.shown.monthly.careful;
    const good = ruinOf(60, a.shown.potAtStop.good, careful);
    const bad = ruinOf(60, a.shown.potAtStop.careful, careful);
    expect(good).toBeLessThanOrEqual(15);
    expect(bad).toBeGreaterThanOrEqual(good);
  }, 180000);
});
