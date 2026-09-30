/**
 * The headline worked out again from the month-by-month trace (test plan 3.1), on the three fixtures, the 48 core
 * cases and the 10 age-boundary cases, with env.trace on. The oracle (tests/v7/oracles/fromTrace.mjs) imports
 * nothing from src/.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { TEST_ENV } from './_c.js';
import { answerC, checkAnswer } from './invariants.js';
import { checkTrace, recompute } from '../oracles/fromTrace.mjs';

const cases = JSON.parse(readFileSync(resolve(process.cwd(), 'tests/v7/c/cases.pairs.json'), 'utf8'));
const fixtures = ['F1-forum-guest', 'F2-couple', 'F3-retired'].map((f) => JSON.parse(readFileSync(resolve(process.cwd(), `tests/v7/fixtures/c/${f}.json`), 'utf8')));
const ENV = { ...TEST_ENV, trace: true };

describe('the trace agrees with the headline', () => {
  const all = [
    ...fixtures.map((f) => [f.id, f.inputs]),
    ...cases.core.map((c) => [c.name, c.inputs]),
    ...cases.ages.map((c) => [c.name, c.inputs])
  ];
  it.each(all)('%s', (_name, inputs) => {
    const a = answerC(inputs, ENV);
    expect(a.status).toBe('ok');
    const rules = checkAnswer(a, inputs);
    expect(rules, rules.join('\n')).toEqual([]);
    const problems = checkTrace(a);
    expect(problems, problems.join('\n')).toEqual([]);
  });

  it('the trace is plain data, and rows carry every field of the contract', () => {
    const a = answerC(fixtures[0].inputs, ENV);
    expect(JSON.parse(JSON.stringify(a.trace))).toEqual(a.trace);
    const row = a.trace.atCareful.rows[0];
    for (const k of ['who', 'm', 'age', 'potStart', 'growth', 'draw', 'taxFree', 'taxable', 'statePension', 'finalSalary', 'tax', 'afterTax', 'potEnd', 'priceIndex']) expect(row, k).toHaveProperty(k);
    expect(a.trace.futures).toHaveLength(ENV.futures);
    expect(a.trace.futures.map((f) => f.id)).toEqual([...Array(ENV.futures).keys()]);
  });

  it('with the trace off the answer is the same, byte for byte, without the trace', () => {
    const on = answerC(fixtures[1].inputs, ENV);
    const off = answerC(fixtures[1].inputs, { ...ENV, trace: false });
    const { trace, ...rest } = on;
    expect(off).toEqual(rest);
    expect(off.trace).toBeUndefined();
  });

  it('a couple: both people are traced, each on their own pot, and the household adds up', () => {
    const a = answerC(fixtures[1].inputs, ENV);
    const r = recompute(a.trace.atCareful, a);
    expect(r.problems).toEqual([]);
    const whos = new Set(a.trace.atCareful.rows.map((x) => x.who));
    expect([...whos].sort()).toEqual(['partner', 'you']);
  });
});
