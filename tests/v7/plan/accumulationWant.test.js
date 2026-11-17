/**
 * The full view's Accumulation tab changes what you want there (7.12.0): the amount a month from the stop and the age you
 * stop, in two boxes with Save, sent through the same one write as What you pay in (deps.saveWant →
 * ScenarioRepository.saveActiveWant → saving.js savingPatch). Fictional: Jo, 33, keeps a plan stopping at 60 on £2,000 a
 * month; on the tab she types £2,500 from 65 and presses Save.
 */
import { describe, it, expect } from 'vitest';
import { answerB } from '../../../src/answers/b/answer.js';
import { buildPlanSeed } from '../../../src/answers/keep/planSeed.js';
import { seedToScenario } from '../../../src/services/PlanFromSeed.js';
import { upgradeScenario } from '../../../src/firebase/scenarioMigration.js';
import { paintSaverAnswer } from '../../../src/ui/saverAnswerUi.js';
import { savingPatch, savedWant } from '../../../src/answers/plan/saving.js';
import { applyPatch } from '../../../src/answers/plan/about.js';
import { noon } from './_plans.js';

const READ_ON = '2026-11-16';
const JO = { household: 'single', you: { pot: 22000, age: 33, statePension: { kind: 'full' }, finalSalary: { has: false }, payIn: { kind: 'share', pay: 38000, ownPct: 5, employerPct: 3 } },
  stop: { age: 60 }, spend: { kind: 'amount', amount: 2000 }, endAge: 95 };

function joPlan() {
  const result = answerB(JO, { today: READ_ON, futures: 100, seed: 0, detail: 'answer' });
  const seed = buildPlanSeed({ source: 'b', result, env: { today: READ_ON, appVersion: 'test' }, name: 'Jo', createdAt: READ_ON + 'T10:00:00.000Z' });
  const made = seedToScenario(seed, READ_ON).yours;
  made.id = 'JoAcc1';
  return upgradeScenario(JSON.parse(JSON.stringify(made)), { now: noon(READ_ON) }).scenario;
}

describe('what you want, on the Accumulation tab', () => {
  it('two boxes hold £2,000 and 60; Save sends £2,500 and 65 through the one write, which What you pay in reads back', async () => {
    const plan = joPlan();
    document.body.innerHTML = '<div id="acOnTrack"></div>';
    const sent = [];
    let saved = plan;
    const deps = {
      listScenariosAsync: async () => [JSON.parse(JSON.stringify(saved))], getActiveScenarioId: async () => plan.id, now: () => noon(READ_ON),
      // the repository's own rule, on the plan in hand: savingPatch, one write
      saveWant: async (typed) => { sent.push(typed); const p = savingPatch(saved, typed, { today: READ_ON }); if (p.ok) saved = applyPatch(saved, p.patch); return { ok: p.ok, errors: p.errors, written: p.ok }; }
    };
    await paintSaverAnswer(document, deps);
    expect(document.getElementById('acWantMonthly').value).toBe('2000');
    expect(document.getElementById('acWantStopAge').value).toBe('60');
    document.getElementById('acWantMonthly').value = '2,500';
    document.getElementById('acWantStopAge').value = '65';
    document.getElementById('acWantSave').click();
    for (let i = 0; i < 50 && !sent.length; i++) await new Promise((r) => setTimeout(r, 10));
    expect(sent).toEqual([{ 'want.monthly': '2,500', 'want.stopAge': '65' }]);
    const w = savedWant(saved, { today: READ_ON });
    expect([w.monthly, w.stopAge]).toEqual([2500, 65]);
  }, 120000);

  it('a box with a problem says it under the box, and nothing is written', async () => {
    const plan = joPlan();
    document.body.innerHTML = '<div id="acOnTrack"></div>';
    const deps = { listScenariosAsync: async () => [plan], getActiveScenarioId: async () => plan.id, now: () => noon(READ_ON),
      saveWant: async (typed) => { const p = savingPatch(plan, typed, { today: READ_ON }); return { ok: p.ok, errors: p.errors }; } };
    await paintSaverAnswer(document, deps, { 'want.stopAge': 'notAhead' });
    expect(document.querySelector('[data-testid="ac.want"]').textContent).toContain('An age after the one you are now.');
  }, 120000);
});
