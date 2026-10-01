/**
 * Both sides of the contract together (research/v7/save-as-plan.md C.1–C.3): the seeds V7's own builder makes
 * (src/answers/keep/planSeed.js, buildPlanSeed) from the pinned answers of its named states are read by today's side
 * (src/services/PlanSeed.js) without a problem, and the plans made from them hold the "must hold" rules that do not
 * need a hand-written seed: no write on first open, the planner's start pot is the answer's, every take-home row nets
 * back from its target, and the plan is plain data.
 *
 * V7's side is built separately. While its builder or its named states are not there, this file says so and passes.
 */
import { describe, it, expect, vi } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

vi.mock('../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));

import { checkSeed, seedToScenario, targetAtAge, localDate } from '../src/services/PlanSeed.js';
import { upgradeScenario } from '../src/firebase/scenarioMigration.js';
import { pinTiming, timingPinPatch } from '../src/services/PlanTiming.js';
import { createSimulationConfigFromSettings } from '../src/storage/StressRepository.js';
import { grossToNet } from '../src/services/TaxCalculator.js';

const BUILDER = resolve(__dirname, '../src/answers/keep/planSeed.js');
const STATES_DIR = resolve(__dirname, 'v7/states');
const STATES = [
  ['c', 'answer-F1'], ['c', 'answer-F2'], ['c', 'answer-F3'], ['c', 'answer-paying-in'],
  ['a', 'answer-A1'], ['a', 'answer-A2-couple'], ['a', 'answer-A3-part-time'], ['a', 'answer-A4'], ['a', 'answer-stop-now'], ['a', 'answer-no'],
  ['b', 'answer-B1'], ['b', 'answer-B2-on-course'], ['b', 'answer-B4-before-57'], ['b', 'answer-B5-couple']
].filter(([q, f]) => existsSync(join(STATES_DIR, q, f + '.json')));
const READY = existsSync(BUILDER) && STATES.length > 0;

const ENV = { today: '2026-09-30', appVersion: '6.17.0' };
const AT = '2026-09-30T14:03:22.511Z';
const NOW_MS = Date.parse(AT) + 60000;
const net = (g) => grossToNet(g, 12570, 50270, 125140) / 12;

describe.skipIf(!READY)('V7\'s seeds, read and mapped by today\'s side', () => {
  let build = null;
  const seedOf = async (q, f, more = {}) => {
    if (!build) build = (await import('../src/answers/keep/planSeed.js')).buildPlanSeed;
    const result = JSON.parse(readFileSync(join(STATES_DIR, q, f + '.json'), 'utf8')).answers[q].result;
    return build({ source: q, result, env: ENV, name: { chosen: 'My try' }, createdAt: AT, ...more });
  };

  it.each(STATES)('%s %s', async (q, f) => {
    const seed = await seedOf(q, f);
    expect(seed, "V7 keeps every one of these answers (tests/v7/keep/planSeed.test.js)").not.toBeNull();
    expect(checkSeed(seed, NOW_MS)).toEqual({ ok: true });
    const { yours, partner } = seedToScenario(seed, new Date(2026, 8, 30, 15, 0));
    expect(!!partner).toBe(seed.household === 'couple');
    for (const [plan, p] of [[yours, seed.people[0]], ...(partner ? [[partner, seed.people[1]]] : [])]) {
      const S = plan.stressTool.settings;
      expect(upgradeScenario(plan).write).toBe(false);
      expect(timingPinPatch(S, pinTiming(S, plan.budgetTool.settings, localDate(seed.today)))).toBeNull();
      const cfg = createSimulationConfigFromSettings({}, S);
      const later = seed.stop.kind === 'later';
      expect(Math.abs(cfg.equityStart + cfg.bondStart + cfg.cashStart - (later ? p.pension.atStop.middling : p.pension.today))).toBeLessThanOrEqual(3);
      expect(Math.abs(cfg.isaBalance - (later ? p.savings.atStop.middling : p.savings.today))).toBeLessThanOrEqual(3);
      for (const row of p.takeHome) {
        const age = row === p.takeHome[0] ? S.shapeAgeNow : row.fromAge;
        expect(Math.abs(net(targetAtAge(S, age)) - row.perMonth), 'row from ' + row.fromAge).toBeLessThanOrEqual(0.5);
      }
      expect(JSON.parse(JSON.stringify(plan))).toEqual(plan);
      expect(plan.stressTool.settings.taggedFunds).toEqual([]);
      expect(plan.decisionTool.history).toEqual([]);
    }
  });
});

describe.skipIf(READY)('V7\'s seed builder', () => {
  it('is not here yet: the cross-check waits for src/answers/keep/planSeed.js and the named states', () => {
    expect(READY).toBe(false);
  });
});
