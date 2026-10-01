/**
 * The full proof that the fast path is the reference (see speed.identity.test.js for the sample that runs on every
 * push): every named state and every fixture at the published 1,000 futures, 200 random households at 20 futures
 * and 12 more at 100 then 1,000, each through the reference solver (today's engine run by run) and the fast path,
 * byte for byte. Minutes, not seconds: test:all and the nightly run.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import fc from 'fast-check';
import { SCHEMA_C, TEST_ENV } from './_c.js';
import { arbitraryInputs } from '../gen/arbitrary.mjs';
import { bothWays, asText } from './identity.js';
import { answerC } from './invariants.js';

const FIXTURES = resolve(process.cwd(), 'tests/v7/fixtures/c');
const STATES = resolve(process.cwd(), 'tests/v7/states/c');
const SEED = 20260930;
const LONG = 20 * 60_000;

const fixtures = readdirSync(FIXTURES).filter((f) => f.endsWith('.json')).map((f) => JSON.parse(readFileSync(resolve(FIXTURES, f), 'utf8')));
const states = readdirSync(STATES).filter((f) => f.endsWith('.json')).map((f) => ({ name: f, state: JSON.parse(readFileSync(resolve(STATES, f), 'utf8')) }))
  .filter(({ state }) => state.answers && state.answers.c && state.answers.c.result && state.answers.c.result.inputs);

describe('the fast path is the reference, byte for byte — the whole set', () => {
  it('every named state at its own futures (1,000 as published): the reference, the fast path and the pinned result agree', () => {
    for (const { name, state } of states) {
      const r = state.answers.c.result;
      const env = { today: state.env.today, futures: r.basis.futures, seed: r.basis.seed, trace: false };
      const fast = bothWays(r.inputs, env);
      // The pinned state was made by the path of the day it was built; a state made by the reference pins the reference.
      if (r.basis.engineVersion === fast.basis.engineVersion && !state.answers.c.patched) expect(asText(fast), name).toBe(asText(r));
    }
  }, LONG);

  it('the three fixtures at 1,000 futures, with the trace', () => {
    for (const fx of fixtures) bothWays(fx.inputs, { ...TEST_ENV, ...fx.env, futures: 1000, trace: true });
  }, LONG);

  it('200 random households at 20 futures', () => {
    for (const inputs of fc.sample(arbitraryInputs(SCHEMA_C, TEST_ENV), { seed: SEED, numRuns: 200 })) bothWays(inputs, { ...TEST_ENV, futures: 20 });
  }, LONG);

  // 12, not more: this case costs ~7 s a household here (the reference at 1,000 futures on pots up to £10m), and
  // test.yml runs the whole suite under a 15-minute job limit on a slower runner. The named states above are the
  // full-size check on real households.
  it('12 random households at 100 futures, then the same 12 at 1,000 with the amounts remembered from the 100', () => {
    for (const inputs of fc.sample(arbitraryInputs(SCHEMA_C, TEST_ENV), { seed: SEED + 1, numRuns: 12 })) {
      bothWays(inputs, { ...TEST_ENV, futures: 100 });
      const reference = answerC(inputs, { ...TEST_ENV, futures: 1000, solver: 'reference' });
      answerC(inputs, { ...TEST_ENV, futures: 100 });
      expect(asText(answerC(inputs, { ...TEST_ENV, futures: 1000 }))).toBe(asText(reference));
    }
  }, LONG);
});

/*
 * Step 4: per-future pots at full size — the stop runner's band against each life's most found with today's engine
 * (identity.js perLifeBandReference), on random saver households: a stop now in any mix with every life's pot different,
 * and a stop after saving years on the all-shares mix (where `simulate`'s fresh bond stream plays no part).
 */
import { stopAtPlan, createStopRunner, bandAt } from '../saving/_saving.js';
import { saver } from '../saving/invariants.js';
import { perLifeBandReference } from './identity.js';

describe('per-future pots: the stop runner is today\'s engine, life by life — the whole set', () => {
  const people = fc.record({
    age: fc.integer({ min: 40, max: 70 }), gap: fc.integer({ min: 0, max: 15 }),
    pot: fc.constantFrom(30_000, 150_000, 600_000, 2_000_000), isa: fc.constantFrom(0, 25_000, 120_000), payIn: fc.constantFrom(0, 300, 1500),
    risk: fc.constantFrom('cautious', 'balanced', 'adventurous'),
    fs: fc.option(fc.record({ yearly: fc.constantFrom(6_000, 20_000), fromAge: fc.constantFrom(60, 65) }), { freq: 3 }),
    partner: fc.option(fc.record({ age: fc.integer({ min: 40, max: 70 }), pot: fc.constantFrom(0, 80_000, 400_000), isa: fc.constantFrom(0, 30_000) }), { freq: 2 })
  });

  it('40 random households stopping now at 40 lives, every life\'s pot different, any mix', () => {
    for (const k of fc.sample(people, { seed: SEED + 2, numRuns: 40 })) {
      const h = saver({ age: k.age, pot: k.pot, isa: k.isa, stopAge: k.age, risk: k.risk, finalSalary: k.fs, partner: k.partner });
      const sp = stopAtPlan(h, k.age, { ...TEST_ENV, futures: 40 });
      if (sp.plan.lockedUntil.length || !sp.plan.runs.length) continue;
      const runner = createStopRunner(sp, sp.lives, sp.kernels, { pensionOf: (i, j) => sp.potsOf(i)[j].pension * (0.25 + (i * 7919 % 23) / 10) });
      expect(perLifeBandReference(sp, runner, 0)).toEqual(bandAt(sp, runner).monthly);
    }
  }, LONG);

  it('30 random households after saving years at 40 lives, all-shares mix (pensions open at the stop)', () => {
    const SHARES = { equity: 1, bond: 0, cash: 0 };
    for (const k of fc.sample(people, { seed: SEED + 3, numRuns: 30 })) {
      const stopAge = Math.max(58, Math.min(75, k.age + k.gap));
      const partner = k.partner ? { ...k.partner, age: Math.max(k.partner.age, 58 - (stopAge - k.age)) } : null;
      const h = saver({ age: k.age, pot: k.pot, isa: k.isa, payIn: k.payIn, stopAge, mix: SHARES, finalSalary: k.fs, partner });
      const sp = stopAtPlan(h, stopAge, { ...TEST_ENV, futures: 40, mix: SHARES, savingMix: SHARES });
      if (sp.plan.lockedUntil.length || !sp.plan.runs.length) continue;
      const runner = createStopRunner(sp);
      expect(perLifeBandReference(sp, runner, sp.S)).toEqual(bandAt(sp, runner).monthly);
    }
  }, LONG);
});
