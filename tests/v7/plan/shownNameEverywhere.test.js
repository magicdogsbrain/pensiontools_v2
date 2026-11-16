/**
 * One shown name on every page (7.12.0, the saver brief's D7, joined at integration): a plan kept from an answer under the
 * name the answer suggested ("Stop at 65 · £2,400 a month · paying £…") whose stop and aim then changed is shown by the
 * name that follows its present figures, "Stop at 67 · £2,200 a month", on every page of the simple view that names it, not
 * only on "Your plan" and the plans list. A name the person typed is never changed. Nothing is written.
 *
 * Fictional Sam (as tests/v7/plan/saverScenarios.test.js step 7). By hand: the stop moved from 65 to 67; the aim from £2,400
 * to £2,200 a month; the name built from those, without the pay-in: "Stop at 67 · £2,200 a month".
 */
import { describe, it, expect } from 'vitest';
import { answerB } from '../../../src/answers/b/answer.js';
import { buildPlanSeed } from '../../../src/answers/keep/planSeed.js';
import { seedToScenario } from '../../../src/services/PlanFromSeed.js';
import { upgradeScenario } from '../../../src/firebase/scenarioMigration.js';
import { boxesOf as aboutBoxes, aboutPatch, applyPatch, aboutOf } from '../../../src/answers/plan/about.js';
import { boxesOf as spendBoxes, spendPatch, spendOf } from '../../../src/answers/plan/spend.js';
import { potsOf } from '../../../src/answers/plan/pots.js';
import { incomeOf } from '../../../src/answers/plan/income.js';
import { lastsOf } from '../../../src/answers/plan/lasts.js';
import { budgetOf } from '../../../src/answers/plan/budget.js';
import { mixOf } from '../../../src/answers/plan/mix.js';
import { wayOf } from '../../../src/answers/plan/way.js';
import { monthOf } from '../../../src/answers/plan/month.js';
import { noon } from './_plans.js';

const ON = '2025-11-12', READ_ON = '2026-11-16';
const copy = (v) => JSON.parse(JSON.stringify(v));
const SHOWN = 'Stop at 67 · £2,200 a month';

function sam() {
  const inputs = { household: 'single', you: { pot: 120000, age: 44, statePension: { kind: 'full' }, finalSalary: { has: false }, payIn: { kind: 'split', own: 375, employer: 250 } },
    stop: { age: 65 }, spend: { kind: 'amount', amount: 2400 }, endAge: 95 };
  const result = answerB(inputs, { today: ON, futures: 100, seed: 0, detail: 'answer' });
  const seed = buildPlanSeed({ source: 'b', result, env: { today: ON, appVersion: 'test' }, name: 'x', createdAt: ON + 'T10:00:00.000Z' });
  const made = seedToScenario(seed, ON).yours;
  made.id = 'Sam07';
  let plan = upgradeScenario(copy(made), { now: noon(READ_ON) }).scenario;
  plan.planDetails.name = plan.fromAnswer.name.suggested;
  plan = applyPatch(plan, aboutPatch(plan, { ...aboutBoxes(plan, { today: READ_ON }), stopAge: '67' }, { today: READ_ON }).patch);
  plan = applyPatch(plan, spendPatch(plan, { ...spendBoxes(plan, { today: READ_ON }), 'first.amount': '2200' }, { today: READ_ON }).patch);
  return plan;
}

describe('the name that follows the plan, on every page that names it', () => {
  const plan = sam();
  const list = [{ plan, newer: false, failed: false }];
  const pages = { aboutOf, spendOf, potsOf, incomeOf, lastsOf, budgetOf, mixOf, wayOf, monthOf };
  for (const [name, read] of Object.entries(pages)) {
    it(name + ' shows "' + SHOWN + '"', () => {
      const before = JSON.stringify(plan);
      const v = read(list, plan.id, { today: READ_ON });
      expect(v.name).toBe(SHOWN);
      expect(JSON.stringify(plan)).toBe(before);
    }, 60000);
  }
  it('a name the person typed stays as typed', () => {
    const named = copy(plan);
    named.planDetails.name = 'Sam’s plan';
    expect(aboutOf([{ plan: named }], named.id, { today: READ_ON }).name).toBe('Sam’s plan');
  });
});
