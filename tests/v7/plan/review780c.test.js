/**
 * 7.8.0 second review, the plan side and the classic planner, while weighing:
 *   - "Am I on course?" reads the plan's own person, as "Does it last?" and the verdict block do: the sex its answer kept,
 *     and no weighted figure for a couple's or a linked plan (the count to the plan's age, as the verdict block)
 *   - a saver plan's check-in reads the kept sex and level from whatever answer the plan was kept from
 * Fictional figures only (Sam).
 */
import { describe, it, expect } from 'vitest';
import { onCourseOptsOf, weightedOptsOf, planFor } from '../../../src/answers/plan/lastsRun.js';
import { lifeOf } from '../../../src/answers/plan/life.js';
import { saverInputsOf } from '../../../src/answers/plan/saverInputs.js';
import { answerA } from '../../../src/answers/a/answer.js';
import { answerB } from '../../../src/answers/b/answer.js';
import { buildPlanSeed } from '../../../src/answers/keep/planSeed.js';
import { seedToScenario } from '../../../src/services/PlanFromSeed.js';
import { effectiveStressSettings } from '../../../src/services/PlanReading.js';
import { corpus, entryOf, TODAY, noon } from './_plans.js';

const C = corpus();
const now = noon(TODAY);
const copy = (o) => JSON.parse(JSON.stringify(o));
const personOf = (plan) => {
  const settings = effectiveStressSettings(plan, { now });
  const sid = settings.strategyId || 'pots-and-valves';
  const p = planFor(settings, now);
  const onCourse = onCourseOptsOf(settings, p, sid, now, { weighted: true, plan });
  const fake = { affordable: true, survivedMc: [], futuresMc: { failYear: [] } };
  const run = weightedOptsOf(plan, { settings, strategyId: sid, p, r: fake, now, stored: { chance: null } }).opts;
  return { onCourse, run, own: lifeOf(plan, now, { settings, startAge: p.startAge }) };
};

describe('"Am I on course?" reads the plan\'s own person', () => {
  it('a linked couple\'s plan: no weighted run, the reason said, as "Does it last?"', () => {
    const { onCourse, run } = personOf(entryOf(copy(C['09-couple-a'])).plan);
    expect(onCourse.life.reason).toBe('linked');
    expect(onCourse.life.reason).toBe(run.life.reason);
    expect(onCourse.planW).toBe(null);
  });

  it('a plan kept from an answer that said "the figures for men" reads the men\'s figures', () => {
    const plan = entryOf(copy(C['05-saver-committed'])).plan;
    plan.fromAnswer = { ...(plan.fromAnswer || {}), source: 'a', household: 'single', who: 'you', inputs: { household: 'single', you: { age: 50, sex: 'male' } } };
    const { onCourse, run, own } = personOf(plan);
    expect(onCourse.life.sex).toBe('m');
    expect(onCourse.life.sexGiven).toBe(true);
    expect(onCourse.life.sex).toBe(run.life.sex);
    expect(onCourse.life.planToAge).toBe(own.planToAge);
    expect(onCourse.life.weightToAge).toBe(own.weightToAge);
  });

  it('a plan made from a couple\'s answer: no weighted run', () => {
    const plan = entryOf(copy(C['02-pnv-draft'])).plan;
    plan.fromAnswer = { source: 'c', household: 'couple', who: 'you', inputs: { household: 'couple', you: { age: 62, sex: 'female' }, partner: { age: 60, sex: 'male' } } };
    const { onCourse, run } = personOf(plan);
    expect(onCourse.life.reason).toBe('couple');
    expect(run.life.reason).toBe('couple');
    expect(onCourse.planW).toBe(null);
  });

  it('with no plan at hand, the settings alone (not said: the women\'s figures)', () => {
    const plan = entryOf(copy(C['02-pnv-draft'])).plan;
    const settings = effectiveStressSettings(plan, { now });
    const p = planFor(settings, now);
    const o = onCourseOptsOf(settings, p, 'pots-and-valves', now, { weighted: true });
    expect(o.life.sex).toBe('f');
    expect(o.life.reason).toBe(null);
  });
});

describe('a saver plan\'s check-in reads the kept sex and level from any answer', { timeout: 120_000 }, () => {
  const env = { today: '2026-09-30', futures: 20, seed: 0 };
  const you = { pot: 150000, age: 50, sex: 'male', payIn: { kind: 'total', total: 900 } };
  for (const [q, fn, ins] of [
    ['a', answerA, { you, stop: { kind: 'age', age: 62 }, spend: { kind: 'amount', amount: 2000 }, confidence: 'bold' }],
    ['b', answerB, { you, stop: { age: 62 }, spend: { kind: 'amount', amount: 2000 }, confidence: 'bold' }]
  ]) {
    it('kept from ' + q.toUpperCase() + ': the men\'s figures and Bold, in the check-in as in "Does it last?"', () => {
      const r = fn(ins, env);
      const seed = buildPlanSeed({ source: q, result: r, env: { today: env.today, appVersion: 'x' }, name: 'Sam plan', createdAt: '2026-09-30T10:00:00.000Z' });
      const plan = seedToScenario(seed, env.today).yours;
      plan.id = 'SamPlan01';
      const si = saverInputsOf(plan, { today: env.today });
      expect(si.ok).toBe(true);
      expect(si.inputs.you.sex).toBe('male');
      expect(si.inputs.confidence).toBe('bold');
      const at = new Date(2026, 8, 30, 12);
      expect(lifeOf(plan, at, { settings: effectiveStressSettings(plan, { now: at }) }).sex).toBe('m');
    });
  }
});
