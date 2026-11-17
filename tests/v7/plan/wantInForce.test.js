/**
 * "What you want" on What you pay in edits the amount in force when you stop (7.12.0): a plan whose spending steps change
 * before the stop shows and edits that step, never the first amount. Fictional: Jo, 33, keeps a plan stopping at 60 on
 * £2,000 a month; on "What you spend" she adds a step from 55 of £1,800 a month. At 60 the step from 55 is in force, so
 * the box reads £1,800, and typing £2,100 there changes that step: the first amount stays £2,000.
 */
import { describe, it, expect } from 'vitest';
import { answerB } from '../../../src/answers/b/answer.js';
import { buildPlanSeed } from '../../../src/answers/keep/planSeed.js';
import { seedToScenario } from '../../../src/services/PlanFromSeed.js';
import { upgradeScenario } from '../../../src/firebase/scenarioMigration.js';
import { savedWant, savingPatch } from '../../../src/answers/plan/saving.js';
import { spendPatch, savedSpend } from '../../../src/answers/plan/spend.js';
import { applyPatch } from '../../../src/answers/plan/about.js';
import { noon } from './_plans.js';

const READ_ON = '2026-11-16';
const JO = () => ({ household: 'single', you: { pot: 22000, age: 33, statePension: { kind: 'full' }, finalSalary: { has: false }, payIn: { kind: 'share', pay: 38000, ownPct: 5, employerPct: 3 } },
  stop: { age: 60 }, spend: { kind: 'amount', amount: 2000 }, endAge: 95 });
function keptPlan(inputs, { id }) {
  const result = answerB(inputs, { today: READ_ON, futures: 100, seed: 0, detail: 'answer' });
  const seed = buildPlanSeed({ source: 'b', result, env: { today: READ_ON, appVersion: 'test' }, name: 'A plan', createdAt: READ_ON + 'T10:00:00.000Z' });
  const made = seedToScenario(seed, READ_ON).yours;
  made.id = id;
  return upgradeScenario(JSON.parse(JSON.stringify(made)), { now: noon(READ_ON) }).scenario;
}

describe('the wanted amount is the one in force at the stop', () => {
  const plan0 = keptPlan(JO(), { id: 'JoStep1' });
  // a later step: £1,800 a month from 65
  const s = spendPatch(plan0, { 'steps.ids': '0', 'steps.0.fromAge': '65', 'steps.0.amount': '1800', 'steps.0.then': 'level' }, { today: READ_ON });
  it('stopping at 60, the first amount (£2,000) is in force: the box reads it', () => {
    expect(s.ok, JSON.stringify(s.errors)).toBe(true);
    const plan = applyPatch(plan0, s.patch);
    const w = savedWant(plan, { today: READ_ON });
    expect(w.monthly).toBe(2000);
    expect(w.stepAge).toBe(null);
    expect(w.laterAge).toBe(65);
  });
  it('moving the stop to 66 and typing £2,100 in one save: the step from 65 is in force at 66, so it is that step that changes', () => {
    const plan = applyPatch(plan0, s.patch);
    const p = savingPatch(plan, { 'want.stopAge': '66', 'want.monthly': '2100' }, { today: READ_ON });
    expect(p.ok, JSON.stringify(p.errors)).toBe(true);
    const after = applyPatch(plan, p.patch);
    const sp = savedSpend(after, { today: READ_ON });
    const w = savedWant(after, { today: READ_ON });
    expect(w.stopAge).toBe(66);
    expect(w.monthly).toBe(2100);
    // the step in force at 66 is the one that changed; the first amount is as it was
    expect(sp.steps.find((x) => +x.fromAge === 65).monthly).toBe(2100);
    expect(sp.first.monthly).toBe(2000);
  });
});
