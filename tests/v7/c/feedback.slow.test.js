/**
 * The solved figure, fed back through the saved-plan path (answer-C-and-household.md 2.9 rule 3; build brief 6, P2; the
 * lead's ruling D22, step P): the amount at a level, kept as a plan (answers/keep/keptPlan.js keptPlansOf, the keep's own
 * two steps) and run through "Does it last?" (answers/plan/lastsRun.js lastsOf: effective settings → planFromSettings →
 * the plan test) at the same number of futures, gives the SAME figures as the answer: the same count of futures that last
 * to the plan-to age, the same weighted chance, so the same verdict "yes" at the level; £10 a month more is not "yes".
 *
 * Until 7.12.0 the answer ran its own household model and this test allowed the kept plan to fail in up to 15 futures in
 * 100 where the answer promised 10 (the State Pension's first year whole against the saved plan's tax-year share, and
 * more). One person from now is on the plan path, so the two are one run and the test is equality.
 */
import { describe, it, expect } from 'vitest';
import { keptPlansOf } from '../../../src/answers/keep/keptPlan.js';
import { lastsOf } from '../../../src/answers/plan/lastsRun.js';
import { TEST_ENV, answerC } from './_c.js';

const N = Number(process.env.V7_FEEDBACK_FUTURES || 300);
const ENV = { ...TEST_ENV, futures: N };

const reading = (plan) => {
  const { a } = lastsOf(plan, { today: ENV.today, futures: N, histories: false });
  return { lasted: Math.round(a.fixedAge * N), weighted: a.weighted, verdict: a.verdict, planToAge: a.planToAge };
};

describe('the amount at each level fed back through the saved-plan path', () => {
  const inputs = { you: { pot: 250000, age: 58 } };
  for (const level of ['careful', 'balanced']) {
    it(`${level}: the kept plan's "Does it last?" is the answer, future for future; £10 a month more is not "yes"`, () => {
      const c = answerC({ ...inputs, confidence: level }, ENV);
      expect(c.status).toBe('ok');
      const m = c.levels[level].monthly;
      const plan = reading(keptPlansOf('c', c, ENV).yours);
      expect(plan).toEqual({ lasted: N - c.chance.fails, weighted: c.chance.weighted, verdict: 'yes', planToAge: c.chance.planToAge });
      const more = reading(keptPlansOf('c', answerC({ ...inputs, confidence: level, take: m + 10 }, ENV), ENV, { take: 'tried' }).yours);
      expect(more.verdict).not.toBe('yes');
    }, 120000);
  }
});
