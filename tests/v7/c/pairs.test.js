/**
 * The pairs list (test plan 1.4): (a) the committed file is what the generator makes today; (b) every pair of
 * values is present, checked by this file's own double loop, not the generator's; (c) every case — the pairs,
 * the 48 core cases, the 10 age-boundary cases and every case ever found by the random run — passes checkAnswer.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { TEST_ENV } from './_c.js';
import { answerC, checkAnswer } from './invariants.js';
import { buildCases, casesText, CASES_PATH } from '../gen/build-cases.mjs';
import { DIMENSIONS, compatible } from '../gen/pairs.mjs';

const committed = JSON.parse(readFileSync(CASES_PATH, 'utf8'));
const found = JSON.parse(readFileSync(resolve(process.cwd(), 'tests/v7/c/found.cases.json'), 'utf8'));
const PAIRS_ENV = { ...TEST_ENV, futures: Number(process.env.V7_PAIRS_FUTURES || 20) };

describe('the pairs list', () => {
  it('is what the generator makes today (run npm run v7:cases after changing the input list)', () => {
    expect(casesText(buildCases())).toBe(readFileSync(CASES_PATH, 'utf8'));
  });

  it('holds every pair of values that can go together, and no impossible case', () => {
    const NA = 'n/a';
    const names = committed.pairs.map((c) => new Set(c.name.split('·')));
    const has = (c, dim, val) => (val.id === NA ? ![...c].some((n) => dim.values.some((v) => v.id === n && v.id !== NA)) : c.has(val.id));
    let pairs = 0;
    for (let i = 0; i < DIMENSIONS.length; i++) {
      for (let j = i + 1; j < DIMENSIONS.length; j++) {
        const A = DIMENSIONS[i];
        const B = DIMENSIONS[j];
        if ((A.name === 'household' && B.partner) || (A.partner && B.partner)) continue;
        for (const a of A.values) {
          for (const b of B.values) {
            if (!compatible(A, a, B, b)) continue;
            pairs++;
            expect(names.some((c) => has(c, A, a) && has(c, B, b)), `${A.name}=${a.id} with ${B.name}=${b.id}`).toBe(true);
          }
        }
      }
    }
    expect(pairs).toBeGreaterThan(500);
    for (const c of committed.pairs) {
      const couple = c.inputs.household === 'couple';
      expect(Boolean(c.inputs.partner), c.name).toBe(couple);
    }
    expect(committed.pairs.length).toBeGreaterThanOrEqual(60);
    expect(committed.pairs.length).toBeLessThanOrEqual(90);
    expect(committed.core).toHaveLength(48);
    expect(committed.ages).toHaveLength(10);
  });

  const all = [
    ...committed.pairs.map((c) => ({ ...c, group: 'pairs' })),
    ...committed.core.map((c) => ({ ...c, group: 'core' })),
    ...committed.ages.map((c) => ({ ...c, group: 'ages' })),
    ...found.cases.map((c) => ({ ...c, group: 'found' }))
  ];
  describe('every case passes every rule', () => {
    it.each(all.map((c) => [c.group + ': ' + c.name, c]))('%s', (_n, c) => {
      const env = c.env ? { ...PAIRS_ENV, ...c.env } : PAIRS_ENV;
      const a = answerC(c.inputs, env);
      expect(a.status, JSON.stringify(a.problems)).not.toBe('invalid');
      const failures = checkAnswer(a, c.inputs);
      expect(failures, failures.join('\n')).toEqual([]);
      if (c.expect) for (const [k, v] of Object.entries(c.expect)) expect(k.split('.').reduce((o, key) => (o == null ? undefined : o[key]), a), k).toEqual(v);
    });
  });
});
