/**
 * "About you and when" shows the age today (7.12.0): the age typed, a year older for each birthday since the day it was
 * typed — read, never written; it is saved only when the person saves. Fictional: Sam keeps a plan at 44 on 12 November
 * 2025; the plan's State Pension date (a birthday) falls on 12 November, so on 16 November 2026 Sam is 44 + 1 = 45.
 */
import { describe, it, expect } from 'vitest';
import { answerB } from '../../../src/answers/b/answer.js';
import { buildPlanSeed } from '../../../src/answers/keep/planSeed.js';
import { seedToScenario } from '../../../src/services/PlanFromSeed.js';
import { upgradeScenario } from '../../../src/firebase/scenarioMigration.js';
import { boxesOf, aboutPatch } from '../../../src/answers/plan/about.js';
import { planPage } from '../../../src/answers/plan/read.js';

const KEPT_ON = '2025-11-12';
const copy = (v) => JSON.parse(JSON.stringify(v));
const noon = (d) => new Date(d + 'T12:00:00');
const SAM = { household: 'single', you: { age: 44, pot: 120000, statePension: { kind: 'full' }, finalSalary: { has: false }, payIn: { kind: 'split', own: 300, employer: 250, ownFrom: 'takeHome' } },
  stop: { age: 65 }, spend: { kind: 'amount', amount: 2400 } };

function samPlan(readOn) {
  const result = answerB(SAM, { today: KEPT_ON, futures: 100, seed: 0, trace: false, detail: 'answer' });
  const seed = buildPlanSeed({ source: 'b', result, env: { today: KEPT_ON, appVersion: 'test' }, name: 'Sam saving', createdAt: KEPT_ON + 'T10:00:00.000Z', payIn: 'now' });
  const made = seedToScenario(seed, KEPT_ON).yours;
  made.id = 'SamAge01';
  return upgradeScenario(copy(made), { now: noon(readOn) }).scenario;
}

describe('the age box says the age today', () => {
  it('kept at 44 on 12 November 2025, read on 16 November 2026: 45; read on 1 November 2026: still 44', () => {
    expect(boxesOf(samPlan('2026-11-16'), { today: '2026-11-16' }).age).toBe('45');
    expect(boxesOf(samPlan('2026-11-01'), { today: '2026-11-01' }).age).toBe('44');
  });

  it('opening it writes nothing; saving today\'s age keeps the age as typed and its day', () => {
    const plan = samPlan('2026-11-16');
    const typed = boxesOf(plan, { today: '2026-11-16' });
    const p = aboutPatch(plan, typed, { today: '2026-11-16' });
    const ages = Object.entries(p.patch || {}).filter(([k]) => /currentAge/.test(k));
    for (const [k, v] of ages) {
      if (/AsOf$/.test(k)) expect(v, k).toBe(KEPT_ON);
      else expect(v, k).toBe(44);
    }
  });

  it('Your plan says the same age today: 45', () => {
    const plan = samPlan('2026-11-16');
    const rows = planPage([{ plan, newer: false, failed: false }], plan.id, 'plan', { today: '2026-11-16' });
    const flat = JSON.stringify(rows);
    expect(flat).toMatch(/"ageToday":45\b/);
    expect(flat).not.toMatch(/"ageToday":44\b/);
  });
});
