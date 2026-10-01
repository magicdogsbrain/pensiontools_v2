/**
 * B's pairs list (step 4 brief 6, P3; the test plan's 8.2): (a) the committed file is what the generator makes today;
 * (b) every pair of values is present, checked by this file's own double loop, not the generator's; (c) every case —
 * the pairs, the 48 core cases, the 12 stop-age cases and every case ever found by the random run — passes checkAnswerB.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { TEST_ENV, answerB, checkAnswerB } from './invariants.js';
import { buildCasesB, casesTextB, CASES_B_PATH, DIMENSIONS_B } from '../gen/dimensionsB.mjs';
import { compatible } from '../gen/pairs.mjs';

const committed = JSON.parse(readFileSync(CASES_B_PATH, 'utf8'));
const found = JSON.parse(readFileSync(resolve(process.cwd(), 'tests/v7/b/found.cases.json'), 'utf8'));
const PAIRS_ENV = { ...TEST_ENV, futures: Number(process.env.V7_PAIRS_FUTURES || 20) };

describe('B — the pairs list', () => {
  it('is what the generator makes today (run node tests/v7/gen/dimensionsB.mjs after changing the input list)', () => {
    expect(casesTextB(buildCasesB())).toBe(readFileSync(CASES_B_PATH, 'utf8'));
  });

  it('holds every pair of values that can go together, and no impossible case', () => {
    const NA = 'n/a';
    const names = committed.pairs.map((c) => new Set(c.name.split('·')));
    const has = (c, dim, val) => (val.id === NA ? ![...c].some((n) => dim.values.some((x) => x.id === n && x.id !== NA)) : c.has(val.id));
    let pairs = 0;
    for (let i = 0; i < DIMENSIONS_B.length; i++) {
      for (let j = i + 1; j < DIMENSIONS_B.length; j++) {
        const A = DIMENSIONS_B[i];
        const B = DIMENSIONS_B[j];
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
    expect(pairs).toBeGreaterThan(900);
    for (const c of committed.pairs) {
      expect(Boolean(c.inputs.partner), c.name).toBe(c.inputs.household === 'couple');
      expect(c.inputs.stop.age, c.name).toBeGreaterThan(c.inputs.you.age);
    }
    expect(committed.pairs.length).toBeGreaterThanOrEqual(80);
    expect(committed.pairs.length).toBeLessThanOrEqual(130);
    expect(committed.core).toHaveLength(48);
    expect(committed.ages).toHaveLength(12);
  });

  const all = [
    ...committed.pairs.map((c) => ({ ...c, group: 'pairs' })),
    ...committed.core.map((c) => ({ ...c, group: 'core' })),
    ...committed.ages.map((c) => ({ ...c, group: 'ages' })),
    ...found.cases.map((c) => ({ ...c, group: 'found' }))
  ];
  describe('every case passes every rule', () => {
    it.each(all.map((c) => [c.group + ': ' + c.name, c]))('%s', (_n, c) => {
      const env = { ...PAIRS_ENV, ...(c.env || {}), trace: true };
      const a = answerB(c.inputs, env);
      expect(a.status, JSON.stringify(a.problems)).not.toBe('invalid');
      const failures = checkAnswerB(a, c.inputs);
      expect(failures, failures.join('\n')).toEqual([]);
      if (c.expect) for (const [k, v] of Object.entries(c.expect)) expect(k.split('.').reduce((o, key) => (o == null ? undefined : o[key]), a), k).toEqual(v);
    });
  });
});
