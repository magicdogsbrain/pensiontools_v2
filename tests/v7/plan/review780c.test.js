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

describe('"How careful?" on a plan says what it changes', () => {
  it('a plan with a weighted figure: the verdict changes, the figures are the plan\'s; with none: judged on the count to the plan\'s age', async () => {
    const { h, render } = await import('preact');
    const { PlanLevelStrip } = await import('../../../src/v7/screens/plan/LastsScreen.jsx');
    const { LEVELS_WORDS } = await import('../../../src/v7/copy/common.js');
    const draw = (v) => { const root = document.createElement('div'); render(h(PlanLevelStrip, { v, dispatch: () => {} }), root); return root; };
    const single = draw({ level: 'balanced', weighted: { level: 'balanced', chance: 0.83, fixedAge: 0.55, planToAge: 98, reason: null } });
    expect(single.querySelector('[data-testid="plan.lasts.level.help"]').textContent).toBe(LEVELS_WORDS.planHelp);
    expect(single.textContent).not.toMatch(/changes every figure/);
    const couple = draw({ level: 'balanced', weighted: { level: 'balanced', chance: null, fixedAge: 0.8, planToAge: 99, reason: 'couple' } });
    expect(couple.querySelector('[data-testid="plan.lasts.level.help"]').textContent).toBe(LEVELS_WORDS.planHelpFixed);
    expect(LEVELS_WORDS.planHelpFixed).toMatch(/last to the age your plan runs to/);
  });
});

describe('the classic "Am I on course?" names the test it ran', { timeout: 600_000 }, () => {
  it('weighing: the level, the other two levels\' pots, the chance at the pot and its count to the plan\'s age; Careful ≥ the level ≥ Bold', async () => {
    const { onCourseFind } = await import('../../../src/answers/plan/lastsRun.js');
    const { onCourseBasisHtml, onCourseChanceHtml } = await import('../../../src/services/OnCourse.js');
    const { onCourseCheckHtml } = await import('../../../src/ui/accumulationProjection.js');
    const plan = entryOf(copy(C['02-pnv-draft'])).plan;
    const settings = effectiveStressSettings(plan, { now });
    const p = planFor(settings, now);
    const { found, reason } = onCourseFind(settings, p, 'pots-and-valves', now, { weighted: true, level: 'balanced' });
    expect(found.level).toBe('balanced');
    expect(found.weighted).toBe(true);
    expect(found.levels.careful).toBeGreaterThanOrEqual(found.levels.balanced);
    expect(found.levels.balanced).toBe(found.requiredPot);
    expect(found.levels.bold).toBeLessThanOrEqual(found.levels.balanced);
    expect(found.chance.weighted).toBeGreaterThanOrEqual(0.9 - 1e-9);
    expect(found.planToAge).toBe(Math.round(p.startAge + p.durationYears));   // 7.9.0: to that birthday
    const basis = onCourseBasisHtml({ strategyId: 'pots-and-valves', name: 'Pots & Valves', found });
    expect(basis).toMatch(/^to be on course at <strong>Balanced<\/strong> \(Careful £[\d,]+, Bold £[\d,]+\) with <strong>Pots &amp; Valves<\/strong>/);
    expect(basis).not.toMatch(/9 futures out of 10/);
    const chance = onCourseChanceHtml(found, { strategyId: 'pots-and-valves', reason });
    document.body.innerHTML = onCourseCheckHtml({ requiredPot: found.requiredPot, basis, rows: [{ potLow: 1, potMid: 2, potHigh: 3 }], chance });
    const w = document.querySelector('[data-weighted]');
    expect(w.textContent).toMatch(/^Counting how long people your age live, with exactly that the money lasts as long as you do (\d+ times|more than 19 times) in 20: on course at Balanced\.$/);
    const f = w.closest('.chance-block').querySelector('[data-fixed]');
    expect(f.textContent).toMatch(new RegExp(`^With exactly that: if you live to ${found.planToAge}, the money lasts that long `));
    document.body.innerHTML = '';
  });

  it('a couple\'s plan: the count to the plan\'s age at the level, and why it has no weighted figure', async () => {
    const { onCourseFind } = await import('../../../src/answers/plan/lastsRun.js');
    const { onCourseChanceHtml } = await import('../../../src/services/OnCourse.js');
    const plan = entryOf(copy(C['09-couple-a'])).plan;
    const settings = effectiveStressSettings(plan, { now });
    const sid = settings.strategyId || 'pots-and-valves';
    const p = planFor(settings, now);
    const { found, reason } = onCourseFind(settings, p, sid, now, { weighted: true, plan });
    expect(reason).toBe('linked');
    expect(found.weighted).toBe(false);
    const html = onCourseChanceHtml(found, { strategyId: sid, reason });
    if (sid === 'full-il-gilt' || sid === 'floor-the-schedule') expect(html).toBe('');
    else {
      expect(html).not.toMatch(/data-weighted/);
      expect(html).toMatch(/two plans linked as a household/);
      expect(html).toMatch(/data-fixed/);
    }
  });

  it('the rollback: 9 futures in 10 as before, no level, no range', async () => {
    const { onCourseFind } = await import('../../../src/answers/plan/lastsRun.js');
    const { onCourseBasisHtml, onCourseChanceHtml } = await import('../../../src/services/OnCourse.js');
    const { requiredPotForStrategy } = await import('../../../src/strategies/stressTest.js');
    const { ON_COURSE_SHARE } = await import('../../../src/services/OnCourse.js');
    const plan = entryOf(copy(C['02-pnv-draft'])).plan;
    const settings = effectiveStressSettings(plan, { now });
    const p = planFor(settings, now);
    const { found } = onCourseFind(settings, p, 'pots-and-valves', now, { weighted: false });
    expect(found).toEqual(requiredPotForStrategy('pots-and-valves', p, ON_COURSE_SHARE));
    expect(onCourseBasisHtml({ strategyId: 'pots-and-valves', name: 'Pots & Valves', found })).toMatch(/^to last in 9 futures out of 10/);
    expect(onCourseChanceHtml(found, { strategyId: 'pots-and-valves' })).toBe('');
  });
});
