/**
 * "Are you paying in enough?" on a plan locked while saving (ruling 10: B's drawing years are the plan's own at every stop
 * and amount it asks, keep/planPath.js planAtStop, "a reading of the plan with the change, never written, locked or not").
 * Before this, a locked saver's plan could not be read at another amount (What you spend's own write refuses a locked plan),
 * so B threw and neither view drew the verdict. Fictional person only (Sam), made here.
 */
import { describe, it, expect } from 'vitest';
import { answerB } from '../b/_b.js';
import { buildPlanSeed } from '../../../src/answers/keep/planSeed.js';
import { seedToScenario } from '../../../src/services/PlanFromSeed.js';
import { upgradeScenario } from '../../../src/firebase/scenarioMigration.js';
import { saverInputsOf } from '../../../src/answers/plan/saverInputs.js';
import { wantWrites, savedWant } from '../../../src/answers/plan/saving.js';
import { applyPatch } from '../../../src/answers/plan/about.js';
import { lockPatch } from '../../../src/answers/plan/lock.js';
import { runForDocument } from '../../../src/answers/plan/lastsRun.js';
import { planAtStop } from '../../../src/answers/keep/planPath.js';

const DAY = '2026-10-01';
const noon = (day) => { const [y, m, d] = day.split('-').map(Number); return new Date(y, m - 1, d, 12); };
const copy = (v) => JSON.parse(JSON.stringify(v));
const ENV = { today: DAY, futures: 40, seed: 0, trace: false, detail: 'answer' };

/** Sam, 52, saving to 63, £2,100 a month wanted: B's answer kept as a plan, then locked as the plan page locks it. */
function lockedSam() {
  const inputs = { household: 'single', you: { pot: 210000, age: 52, statePension: { kind: 'full' }, finalSalary: { has: false }, payIn: { kind: 'split', own: 400, employer: 300 } },
    stop: { age: 63 }, spend: { kind: 'amount', amount: 2100 }, endAge: 95 };
  const result = answerB(inputs, ENV);
  const seed = buildPlanSeed({ source: 'b', result, env: { today: DAY, appVersion: 'test' }, name: { chosen: 'Sam saving' }, createdAt: DAY + 'T10:00:00.000Z', payIn: 'now' });
  const made = { ...seedToScenario(seed, DAY).yours, id: 'SamLocked01' };
  const plan = upgradeScenario(copy(made), { now: noon(DAY) }).scenario;
  const run = runForDocument(plan, { today: DAY });
  const lock = lockPatch(plan, { now: noon(DAY), run, entries: [{ plan }] });
  expect(lock.ok).toBe(true);
  return applyPatch(plan, lock.patch);
}

describe('a plan locked while saving: the verdict is still the plan\'s own', () => {
  const plan = lockedSam();

  it('a try at another amount reads the plan with the change and keeps the lock; a write still changes nothing', () => {
    expect(savedWant(plan, { today: DAY }).locked).toBe(true);
    const tried = wantWrites(plan, { 'want.monthly': '1500' }, { today: DAY, tryOnly: true });
    expect(tried.ok).toBe(true);
    expect(tried.plan.decisionTool.settings.locked).toBe(true);
    // the settings the runs read carry the change (the page's own reading of a locked plan is its document, unchanged)
    const opened = { ...tried.plan, decisionTool: { ...tried.plan.decisionTool, settings: { ...tried.plan.decisionTool.settings, locked: false } } };
    expect(Object.keys(tried.patch).length).toBeGreaterThan(0);
    expect(savedWant(opened, { today: DAY }).monthly).toBe(1500);
    expect(savedWant(plan, { today: DAY }).monthly).toBe(2100);           // the plan itself untouched
    // a write on a locked plan changes nothing, as before (its want is said, never boxed)
    expect(wantWrites(plan, { 'want.monthly': '1500' }, { today: DAY }).patch).toEqual({});
  });

  it('planAtStop reads the locked plan at another amount, and B answers on it (it threw before)', () => {
    const read = saverInputsOf(plan, { today: DAY, plans: [plan] });
    expect(read.ok).toBe(true);
    expect(() => planAtStop(read.env.fromPlan, 63, 1500 * 12, DAY)).not.toThrow();
    const res = answerB(read.inputs, { ...ENV, ...read.env });
    expect(res.status).toBe('ok');
    expect(['yes', 'close', 'no']).toContain(res.verdict.band);
    expect(res.sentences.verdictHead).toBeTruthy();
  });
});
