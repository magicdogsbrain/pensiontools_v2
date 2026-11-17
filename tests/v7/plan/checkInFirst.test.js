/**
 * A first check-in says what was paid in since the plan last had the pot, what markets and the rest added, and the tax
 * relief to claim back after a pay rise (7.12.0). Fictional, worked by hand:
 *
 *   Sam, 44 on 12 November 2025: £120,000 in the pension, £300 a month from take-home pay (£375 going in with the tax added
 *   back) and £250 from the employer — £625 a month in all — pay £52,000, stopping at 65 on £2,400 a month.
 *   16 November 2026, the first check-in: £131,000, pay £55,000.
 *     paid in        November 2025 to October 2026 is 12 months: 625 × 12 = 7,500
 *     markets        131,000 − 120,000 − 7,500 = 3,500
 *     relief         55,000 − 50,270 = 4,730 of pay in the 40% band; 375 × 12 = 4,500 going in from Sam; 20% × 4,500 = 900
 */
import { describe, it, expect } from 'vitest';
import { answerB } from '../../../src/answers/b/answer.js';
import { buildPlanSeed } from '../../../src/answers/keep/planSeed.js';
import { seedToScenario } from '../../../src/services/PlanFromSeed.js';
import { upgradeScenario } from '../../../src/firebase/scenarioMigration.js';
import { checkInPatch, checkInOf } from '../../../src/answers/plan/checkIn.js';
import { applyPatch } from '../../../src/answers/plan/about.js';

const KEPT_ON = '2025-11-12';
const TODAY = '2026-11-16';
const copy = (v) => JSON.parse(JSON.stringify(v));
const noon = (d) => new Date(d + 'T12:00:00');
const SAM = { household: 'single', you: { age: 44, pot: 120000, statePension: { kind: 'full' }, finalSalary: { has: false }, payIn: { kind: 'split', own: 300, employer: 250, ownFrom: 'takeHome' } },
  stop: { age: 65 }, spend: { kind: 'amount', amount: 2400 } };

function samPlan() {
  const result = answerB(SAM, { today: KEPT_ON, futures: 100, seed: 0, trace: false, detail: 'answer' });
  const seed = buildPlanSeed({ source: 'b', result, env: { today: KEPT_ON, appVersion: 'test' }, name: 'Sam saving', createdAt: KEPT_ON + 'T10:00:00.000Z', payIn: 'now' });
  const made = seedToScenario(seed, KEPT_ON).yours;
  made.id = 'SamFirst01';
  // the pay Sam gives on What you pay in after keeping it
  made.accumulationTool.settings = { ...made.accumulationTool.settings, salary: 52000 };
  return upgradeScenario(copy(made), { now: noon(TODAY) }).scenario;
}

describe('a first check-in reads from where the plan stood before it', () => {
  const plan = samPlan();
  const typed = { 'ci.pension': '131000', 'ci.isa': '0', 'ci.pay': '55000', 'ci.kind': 'split', 'ci.own': '375', 'ci.employer': '250', 'ci.savingsIn': '0' };
  const p = checkInPatch(plan, typed, { today: TODAY, now: noon(TODAY), result: null });

  it('the plan keeps £300 from take-home pay as £375 going in: £625 a month', () => {
    expect(plan.accumulationTool.settings.netMonthly).toBe(300);
    expect(plan.accumulationTool.settings.employerMonthly).toBe(250);
  });

  it('paid in since November 2025: 625 × 12 = £7,500; markets and the rest: 131,000 − 120,000 − 7,500 = £3,500', () => {
    expect(p.ok, JSON.stringify(p.errors)).toBe(true);
    const after = applyPatch(plan, p.patch);
    const v = checkInOf([{ plan: after }], after.id, { today: TODAY });
    const c = v.latest.changed;
    expect(c).not.toBe(null);
    expect(c.first).toBe(true);
    expect(c.since).toBe('November 2025');
    expect(c.paidPension).toBe('£7,500');
    expect(c.rest).toBe('£3,500');
    expect(c.restSign).toBe('+');
  });

  it('the relief to claim back at £55,000: 20% × 4,500 = £900 a year', () => {
    const after = applyPatch(plan, p.patch);
    const v = checkInOf([{ plan: after }], after.id, { today: TODAY });
    expect(v.claim).toEqual({ salary: '£55,000', above: '£4,730', claim: '£900' });
  });
});
