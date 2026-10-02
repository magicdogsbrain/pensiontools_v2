/**
 * The named states of A and B hold the real answers (step 4 brief, joining up 2): each pinned result is what
 * answerA / answerB give today for its own inputs. When this fails, the answer function moved: run
 * `node tests/v7/states/build-states.mjs --question a` (and `b`), read the difference, and have it approved.
 *
 * Slow (about a minute at 1,000 futures), so it is a *.slow.test.js: `npm run test:fast` leaves it out, CI runs it.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { answerA } from '../../../src/answers/a/answer.js';
import { answerB } from '../../../src/answers/b/answer.js';
import { answerC } from '../../../src/answers/c/answer.js';
import { SCHEMA_C } from '../../../src/answers/c/schema.js';
import { parseDraft } from '../../../src/answers/shared/validate.js';

const ANSWER = { a: answerA, b: answerB };

for (const q of ['a', 'b']) {
  const dir = join(process.cwd(), 'tests/v7/states', q);
  const names = readdirSync(dir).filter((f) => f.endsWith('.json') && !f.startsWith('_')).map((f) => f.slice(0, -5)).sort();
  const withResult = names.filter((n) => JSON.parse(readFileSync(join(dir, `${n}.json`), 'utf8')).answers[q].result);

  describe(`${q.toUpperCase()}'s named states hold today's answer`, () => {
    it('there are states with answers to check', () => expect(withResult.length).toBeGreaterThan(8));
    it.each(withResult)('%s', (name) => {
      const r = JSON.parse(readFileSync(join(dir, `${name}.json`), 'utf8')).answers[q].result;
      const env = { today: r.basis.today, futures: r.basis.futures, seed: r.basis.seed, trace: false, detail: r.basis.detail };
      expect(ANSWER[q](r.inputs, env)).toEqual(r);
    }, 120000);
  });
}

/**
 * B1 (research/v7/couples-different-years.md 9.7): the two named states of a couple who stop in different years —
 * numbers-apart and answer-apart, question C — give the same figures with either of them as "you". The state is you 56,
 * stopped, from now, and your partner 55 stopping at 56; the same household from the other chair is you 55 stopping at
 * 56 (the money from then) and your partner already stopped. At the state's own 1,000 futures.
 */
describe('B1 — the apart states give the same figures with either of you as "you"', () => {
  const load = (name) => JSON.parse(readFileSync(join(process.cwd(), 'tests/v7/states/c', `${name}.json`), 'utf8'));
  const figures = (r) => ({ status: r.status, monthly: r.monthly, yearly: r.yearly, lasted: r.lasted, runOutAge: r.runOutAge, guaranteed: r.guaranteed,
    years: r.basis.years, endAge: r.basis.endAge, payIn: r.payIn.total, takeHome: r.phases.map((ph) => ph.takeHome) });

  it('numbers-apart holds the very figures answer-apart was worked out from', () => {
    const typed = load('numbers-apart');
    const answered = load('answer-apart');
    expect(typed.draft.c.values).toEqual(answered.draft.c.values);
    const parsed = parseDraft(SCHEMA_C, typed.draft.c.values, typed.env);
    expect(parsed.ok, JSON.stringify(parsed.errors)).toBe(true);
    expect(parsed.inputs).toEqual(answered.answers.c.result.inputs);
  });

  it('answer-apart, swapped: you 55 stopping at 56, your partner already stopped — every figure the same', () => {
    const state = load('answer-apart');
    const r = state.answers.c.result;
    const v = state.draft.c.values;
    const swapped = {
      household: 'couple', 'you.age': v['partner.age'], 'you.pot': v['partner.pot'], 'start.kind': 'age', 'start.age': v['partner.stop.age'],
      'you.payIn.has': 'yes', 'you.payIn.kind': v['partner.payIn.kind'], 'you.payIn.own': v['partner.payIn.own'], 'you.payIn.employer': v['partner.payIn.employer'],
      'partner.age': v['you.age'], 'partner.pot': v['you.pot'], 'partner.stop.kind': 'already', savings: v.savings
    };
    const parsed = parseDraft(SCHEMA_C, swapped, state.env);
    expect(parsed.ok, JSON.stringify(parsed.errors)).toBe(true);
    const other = answerC(parsed.inputs, { today: state.env.today, futures: r.basis.futures, seed: r.basis.seed, trace: false });
    expect(figures(other)).toEqual(figures(r));
    expect(other.apart.first).toBe('partner');
    expect(r.apart.first).toBe('you');
  }, 120000);
});
