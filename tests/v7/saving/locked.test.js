/**
 * The locked run (step 4 brief 4.5, conflict 1): a pension closed for its first L years inside its holder's one run.
 * The replica draws nothing from the pension sleeves while closed, the run's own ISA pays the target as a
 * savings-only run pays it, and the ordinary path takes over the month it opens.
 *   - equal to a two-stage chain of today's `simulate` (chain.mjs) on the all-shares mix, for L ∈ {1, 2, 4};
 *   - lockedMonths 0 is today's runFast, byte for byte;
 *   - no savings → the run fails in month 0; an ISA that lasts the L years → the pension opens on time.
 */
import { describe, it, expect } from 'vitest';
import {
  stopAtPlan, createStopRunner, verdictAt, configsAt, simulateFast, fastEligible, enginePlan, futuresList, TEST_ENV
} from './_saving.js';
import { saver } from './invariants.js';
import { chainRun } from './chain.mjs';

const SHARES = { equity: 1, bond: 0, cash: 0 };
const close = (a, b) => Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));

describe('the locked run is the chain of today\'s engine (all-shares mix)', () => {
  // A person of 50 today reaches 55 after 6 April 2028, so their pension opens at 57.
  for (const [stopAge, L] of [[56, 1], [55, 2], [53, 4]]) {
    it(`a stop at ${stopAge}, the pension closed for ${L} year(s): failed, the month and the end pots equal the chain in every life`, () => {
      const env = { ...TEST_ENV, futures: 30, mix: SHARES, savingMix: SHARES };
      for (const extra of [{}, { finalSalary: { yearly: 8_000, fromAge: 55 } }, { work: { yearly: 14_000, years: 2 } }]) {
        const h = saver({ age: 50, pot: 250_000, isa: 70_000, payIn: 400, savingsIn: 150, stopAge, mix: SHARES, ...extra });
        const sp = stopAtPlan(h, stopAge, env);
        expect(sp.plan.lockedUntil).toEqual([{ who: 'you', untilAge: 57, years: L }]);
        const runner = createStopRunner(sp);
        let failedInLock = 0, failedAfter = 0, lasted = 0;
        for (const H of [15_000, 26_000, 40_000]) {
          for (let i = 0; i < sp.n; i++) {
            const [{ config }] = configsAt(sp.plan, H, sp.potsOf(i));
            expect(config.lockedMonths).toBe(12 * L);
            const fast = runner.run(0, i, runner.configsAtH(H, i)[0].config);
            const chain = chainRun(config, sp.lives[i], sp.S);
            expect([fast.failed, fast.failMonth], `H ${H} life ${i}`).toEqual([chain.failed, chain.failMonth]);
            if (!fast.failed) {
              expect(close(fast.equity, chain.equity), `equity ${fast.equity} vs ${chain.equity}`).toBe(true);
              expect(close(fast.isa, chain.isa), `isa ${fast.isa} vs ${chain.isa}`).toBe(true);
              lasted++;
            } else if (fast.failMonth < 12 * L) failedInLock++; else failedAfter++;
          }
        }
        expect(lasted).toBeGreaterThan(0);
        expect(failedInLock + failedAfter).toBeGreaterThan(0);
      }
    }, 30_000);
  }

  it('the chain differs from the replica only by the stream when bonds are in the mix: the locked run is deterministic', () => {
    const env = { ...TEST_ENV, futures: 10 };
    const h = saver({ age: 50, pot: 250_000, isa: 70_000, stopAge: 53 });
    const a = verdictAt(stopAtPlan(h, 53, env), createStopRunner(stopAtPlan(h, 53, env)), 26_000);
    const b = verdictAt(stopAtPlan(h, 53, env), createStopRunner(stopAtPlan(h, 53, env)), 26_000);
    expect(a).toEqual(b);
  });
});

describe('lockedMonths 0 is today\'s runFast, line for line', () => {
  it('C\'s configs with lockedMonths 0 (and a schedule) give the same outcome and end pots to the bit', () => {
    const env = { today: TEST_ENV.today, seed: 0 };
    const h = saver({ age: 62, pot: 400_000, isa: 50_000, stopAge: 62, partner: { age: 60, pot: 150_000 } });
    const plan = enginePlan(h, env);
    const futures = futuresList(20, plan.years, env);
    for (const H of [20_000, 40_000, 60_000]) {
      for (const { config } of configsAt(plan, H)) {
        const zero = { ...config, lockedMonths: 0, lockedSchedule: new Array(config.years).fill(0) };
        expect(fastEligible(zero)).toBe(true);
        for (const f of futures) expect(simulateFast(zero, f)).toEqual(simulateFast(config, f));
      }
    }
  });
});

describe('what the savings must do while the pension is closed', () => {
  it('no ISA, no savings, nothing going into savings: every life fails in month 0', () => {
    const sp = stopAtPlan(saver({ age: 50, pot: 400_000, isa: 0, payIn: 800, stopAge: 53 }), 53, { ...TEST_ENV, futures: 20 });
    const v = verdictAt(sp, createStopRunner(sp), 20_000);
    expect(v.fails).toBe(20);
    expect(v.runOutMonths.every((m) => m === 0)).toBe(true);
    expect(v.runOutAge).toBe(53);
    expect(v.verdict).toBe('no');
  });

  it('an ISA that lasts the four closed years: no life fails before the pension opens, and a modest spend lasts in all', () => {
    const sp = stopAtPlan(saver({ age: 50, pot: 800_000, isa: 150_000, stopAge: 53 }), 53, { ...TEST_ENV, futures: 20 });
    const v = verdictAt(sp, createStopRunner(sp), 20_000);
    expect(v.runOutMonths.every((m) => m === null || m >= 48)).toBe(true);
    expect(v.fails).toBe(0);
  });

  it('an ISA too small for the closed years runs out while the pension is closed, and the run-out is a real one', () => {
    const sp = stopAtPlan(saver({ age: 50, pot: 800_000, isa: 20_000, stopAge: 53 }), 53, { ...TEST_ENV, futures: 20 });
    const v = verdictAt(sp, createStopRunner(sp), 20_000);
    expect(v.fails).toBe(20);
    expect(v.runOutMonths.every((m) => m !== null && m < 48)).toBe(true);
    expect(v.runOutAge).toBeLessThan(57);
  });

  it('a couple: while one pension is closed and the other open, the open pension pays; the closed one waits', () => {
    const h = saver({ age: 50, pot: 300_000, isa: 0, stopAge: 54, partner: { age: 58, pot: 500_000 } });
    const sp = stopAtPlan(h, 54, { ...TEST_ENV, futures: 20 });
    expect(sp.plan.lockedUntil.map((l) => l.who)).toEqual(['you']);
    const v = verdictAt(sp, createStopRunner(sp), 20_000);
    expect(v.fails).toBe(0);
  });
});
