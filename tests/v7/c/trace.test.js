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
    for (const k of ['who', 'm', 'age', 'potStart', 'growth', 'charge', 'draw', 'taxFree', 'taxable', 'statePension', 'finalSalary', 'tax', 'afterTax', 'potEnd', 'priceIndex']) expect(row, k).toHaveProperty(k);
    expect(a.trace.futures).toHaveLength(ENV.futures);
    expect(a.trace.futures.map((f) => f.id)).toEqual([...Array(ENV.futures).keys()]);
  });

  it('the month rows show the charge on its own (6.19.0): never hidden in growth; 0.5% of what is held a year, none at 0%', () => {
    const at = (charge) => answerC({ ...fixtures[0].inputs, charge }, ENV).trace.atCareful.rows;
    const rows = at(0.5);
    expect(rows.every((r) => r.charge >= 0)).toBe(true);
    // the first month: the pot after its growth, times 1 − (0.995)^(1/12), to the penny
    const r0 = rows[0];
    const grown = r0.potStart + r0.growth;
    expect(Math.abs(r0.charge - grown * (1 - Math.pow(0.995, 1 / 12)))).toBeLessThan(0.01);
    expect(r0.charge).toBeGreaterThan(0);
    // twelve months take off about 0.5% of what was held (the pot moves with growth and what is drawn)
    const year = rows.filter((r) => r.m < 12);
    const held = year.reduce((t, r) => t + r.potStart + r.growth, 0) / year.length;
    expect(year.reduce((t, r) => t + r.charge, 0) / held).toBeGreaterThan(0.0045);
    expect(year.reduce((t, r) => t + r.charge, 0) / held).toBeLessThan(0.0055);
    expect(at(0).every((r) => r.charge === 0)).toBe(true);
    for (const r of rows) expect(Math.abs(r.potStart + r.growth - r.charge - r.draw - r.potEnd)).toBeLessThan(0.01);
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
