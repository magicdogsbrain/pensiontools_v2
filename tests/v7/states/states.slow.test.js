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
