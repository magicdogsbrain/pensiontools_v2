/**
 * Question A's pairs list (step 4 brief 6, P2; test-plan-A-B.md 8.1): (a) the committed file is what the generator
 * makes today; (b) every pair of values is present, checked by this file's own double loop, not the generator's;
 * (c) every case — the pairs, the 48 core cases, the 13 stop-age cases and every case ever found by the random run —
 * is a valid input and passes checkAnswerA: the pairs and the stop ages at 20 futures on their own stop age only, the
 * core cases with the whole chart.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { answerA, SCHEMA_A, TEST_ENV, checkAnswerA, ENGINE_READY } from './invariants.js';
import { buildCasesA, casesTextA, CASES_PATH_A, DIMENSIONS_A, compatibleA } from '../gen/dimensionsA.mjs';
import { checkInputs } from '../../../src/answers/shared/validate.js';

const committed = JSON.parse(readFileSync(CASES_PATH_A, 'utf8'));
const found = JSON.parse(readFileSync(resolve(process.cwd(), 'tests/v7/a/found.cases.json'), 'utf8'));
const PAIRS_ENV = { ...TEST_ENV, futures: Number(process.env.V7_PAIRS_FUTURES || 20) };

describe('A — the pairs list', () => {
  it('is what the generator makes today (run node tests/v7/gen/dimensionsA.mjs after changing the input list)', () => {
    expect(casesTextA(buildCasesA())).toBe(readFileSync(CASES_PATH_A, 'utf8'));
  });

  it('holds every pair of values that can go together, and no impossible case', () => {
    const NA = 'n/a';
    const names = committed.pairs.map((c) => new Set(c.name.split('·')));
    const has = (c, dim, val) => (val.id === NA ? ![...c].some((n) => dim.values.some((x) => x.id === n && x.id !== NA)) : c.has(val.id));
    let pairs = 0;
    for (let i = 0; i < DIMENSIONS_A.length; i++) {
      for (let j = i + 1; j < DIMENSIONS_A.length; j++) {
        const A = DIMENSIONS_A[i];
        const B = DIMENSIONS_A[j];
        if ((A.name === 'household' && B.partner) || (A.partner && B.partner)) continue;
        for (const a of A.values) {
          for (const b of B.values) {
            if (!compatibleA(A, a, B, b)) continue;
            pairs++;
            expect(names.some((c) => has(c, A, a) && has(c, B, b)), `${A.name}=${a.id} with ${B.name}=${b.id}`).toBe(true);
          }
        }
      }
    }
    expect(pairs).toBeGreaterThan(1000);
    for (const c of committed.pairs) {
      expect(Boolean(c.inputs.partner), c.name).toBe(c.inputs.household === 'couple');
      expect(c.inputs.stop.age, c.name).toBeGreaterThanOrEqual(c.inputs.you.age);
    }
    expect(committed.pairs.length).toBeGreaterThanOrEqual(80);
    expect(committed.pairs.length).toBeLessThanOrEqual(130);
    expect(committed.core).toHaveLength(48);
    expect(committed.stops).toHaveLength(13);
  });

  const all = [
    ...committed.pairs.map((c) => ({ ...c, group: 'pairs', env: { ages: [c.inputs.stop.age] } })),
    ...committed.core.map((c) => ({ ...c, group: 'core' })),
    ...committed.stops.map((c) => ({ ...c, group: 'stops', env: { ages: [c.inputs.stop.age] } })),
    ...found.cases.map((c) => ({ ...c, group: 'found' }))
  ];

  it('every case is a valid input of SCHEMA_A', () => {
    for (const c of all) {
      const r = checkInputs(SCHEMA_A, c.inputs, PAIRS_ENV);
      expect(r.ok, `${c.group}: ${c.name} ${JSON.stringify(r.errors)}`).toBe(true);
    }
  });

  describe.skipIf(!ENGINE_READY)('every case passes every rule', () => {
    it.each(all.map((c) => [c.group + ': ' + c.name, c]))('%s', (_n, c) => {
      const env = c.env ? { ...PAIRS_ENV, ...c.env } : PAIRS_ENV;
      const a = answerA(c.inputs, env);
      expect(a.status, JSON.stringify(a.problems)).not.toBe('invalid');
      const failures = checkAnswerA(a, c.inputs, env);
      expect(failures, failures.join('\n')).toEqual([]);
      if (c.expect) for (const [k, v] of Object.entries(c.expect)) expect(k.split('.').reduce((o, key) => (o == null ? undefined : o[key]), a), k).toEqual(v);
    });
  });
});
