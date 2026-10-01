/**
 * B's number is C's inverse, and B's whole-life count is A's row (step 4 brief 6, P3: the test plan's 5.1; brief 7
 * point 5, X2 and X3). Named apart from tests/v7/b/roundTrip.test.js, which is P5's form round trip (the brief gives
 * both packages that file name).
 *
 * X2. The number is the least whole £1,000 of pension at the stop that pays the spend in 9 lives out of 10. Handed to
 *     question C as the pot of a person who is the stop age on the stop date, C's careful amount is at least the spend,
 *     and £1,000 less is under it — exactly, because it is the same search on the same drawing years. Two things make
 *     "the same drawing years" true here: C is asked on the stop date (env.today moved on by the saving years, so the
 *     person has the same birthday, State Pension age and earliest pension age), and the made-up lives return the same
 *     every year (so the drawing years of a life, which start at the stop, are C's future, which starts at C's today)
 *     and hold no bonds (the life's bond stream continues across the stop; C's starts afresh).
 *     Below the earliest pension age C moves its start, so there the number goes back through A's stop-now row, on the
 *     stop date, with the savings the closed years need (skipped while A is P0's stub).
 * X3. B's whole-life count (today's pay-in, then the spend) is A's row at the stop age, exactly (skipped while A is the stub).
 */
import { describe, it, expect } from 'vitest';
import { TEST_ENV, answerB, checkAnswerB } from './invariants.js';
import { answerC } from '../c/_c.js';
import { answerA } from '../a/_a.js';
import { addYears } from '../../../src/answers/shared/rules.js';

const NO_BONDS = { equity: 0.6, bond: 0, cash: 0.4 };
/** Twenty made-up lives, each the same every year: shares from −2% to +7.5% a year, prices from 2% to 3.9%. */
const steady = (i, years) => {
  const equity = {};
  const inflation = {};
  for (let y = 0; y < years; y++) { equity[y] = -0.02 + 0.005 * i; inflation[y] = 0.02 + 0.001 * i; }
  return { equity, inflation };
};
const ENV = { ...TEST_ENV, futures: 20, futureReturns: steady, mix: NO_BONDS, savingMix: NO_BONDS };
const ok = (a, given) => { const f = checkAnswerB(a, given); expect(f, f.join('\n')).toEqual([]); return a; };
const onStopDate = (a) => ({ ...ENV, today: addYears(ENV.today, a.years.saving) });

const OPEN = [
  ['50, stop at 60, £2,000, full State Pension', { you: { age: 50, pot: 120000, payIn: { total: 700 } }, stop: { age: 60 }, spend: { amount: 2000 } }],
  ['45, stop at 62, £1,500, no State Pension, cautious once stopped', { you: { age: 45, pot: 60000, payIn: { total: 400 }, statePension: { kind: 'none' } }, stop: { age: 62 }, spend: { amount: 1500 }, risk: 'cautious' }],
  ['40, stop at 67, £3,000, a final-salary pension from 65, to 100', { you: { age: 40, pot: 30000, payIn: { total: 900 }, finalSalary: { has: true, yearly: 8000, fromAge: 65 } }, stop: { age: 67 }, spend: { amount: 3000 }, endAge: 100 }]
];

describe('X2 — the number round-trips through C at or after the earliest pension age', () => {
  it.each(OPEN)('%s', (_name, given) => {
    const b = ok(answerB(given, ENV), given);
    expect(b.status).toBe('ok');
    expect(b.gapYears).toBe(0);
    const env = onStopDate(b);
    const cOf = (pot) => answerC({
      you: { age: b.stop.age, pot, statePension: given.you.statePension || { kind: 'full' }, finalSalary: given.you.finalSalary || { has: false } },
      risk: b.inputs.risk, endAge: b.inputs.endAge
    }, env);
    const spend = b.spend.perMonth;
    for (const k of ['careful', 'middling', 'good']) {
      expect(b.number[k] % 1000).toBe(0);
      const at = cOf(b.number[k]);
      expect(at.basis.start, 'C did not move its start').toBe(env.today.slice(0, 7));
      expect(at.monthly[k], `${k} at the number`).toBeGreaterThanOrEqual(spend);
      if (b.number[k] > 0) expect(cOf(b.number[k] - 1000).monthly[k], `${k} at £1,000 less`).toBeLessThan(spend);
    }
    // what the bad-case pot pays, as C would say it
    expect(cOf(b.potAtStop.now.careful).monthly.careful).toBe(b.monthlyIfShort);
  });

  it('the confidence never moves the number; 3 in 4 never needs more than 9 in 10', () => {
    const [, given] = OPEN[0];
    const nine = answerB(given, ENV);
    const four = answerB({ ...given, confidence: 'threeInFour' }, ENV);
    expect(four.number).toEqual(nine.number);
    expect(four.payIn.needed).toBeLessThanOrEqual(nine.payIn.needed);
  });
});

/** A real answerA, not P0's stub (whose figures do not follow the inputs). */
const aIsReal = (() => {
  try {
    const one = answerA({ you: { age: 50, pot: 100000 }, stop: { age: 60 }, spend: { amount: 1500 } }, { ...TEST_ENV, futures: 10 });
    const two = answerA({ you: { age: 50, pot: 900000 }, stop: { age: 60 }, spend: { amount: 1500 } }, { ...TEST_ENV, futures: 10 });
    return JSON.stringify(one.shown) !== JSON.stringify(two.shown);
  } catch { return false; }
})();

/** B's inputs as A's: the same household, the same stop age, the same spend; B's confidence is not A's. */
function asA(inputs) {
  const { confidence, ...rest } = JSON.parse(JSON.stringify(inputs));
  return { ...rest, stop: { kind: 'age', age: inputs.stop.age } };
}

describe.skipIf(!aIsReal)('X2 below the earliest pension age, through A\'s stop-now row on the stop date', () => {
  it('47, stopping at 55 (closed until 57): the number with the savings the closed years need in 9 lives out of 10 (outside.careful) lasts in 9 lives out of 10; £1,000 less does not', () => {
    const given = { you: { age: 47, pot: 150000, payIn: { total: 800 } }, stop: { age: 55 }, spend: { amount: 1800 } };
    const b = ok(answerB(given, ENV), given);
    expect(b.gapYears).toBe(2);
    expect(b.outside).not.toBeNull();
    const env = { ...onStopDate(b), ages: [b.stop.age] };
    const aOf = (pot) => answerA({ you: { age: b.stop.age, pot, payIn: { total: 0 } }, savings: b.outside.careful, stop: { kind: 'age', age: b.stop.age }, spend: given.spend }, env);
    expect(aOf(b.number.careful).shown.verdict).toBe('yes');
    expect(aOf(b.number.careful - 1000).shown.verdict).not.toBe('yes');
  });
});

describe.skipIf(!aIsReal)('X3 — B\'s whole-life count is A\'s row at the stop age', () => {
  const REAL = { ...TEST_ENV, futures: 40 };
  it.each([
    ['short at 60', { you: { age: 50, pot: 120000, payIn: { kind: 'split', own: 450, employer: 250 } }, stop: { age: 60 }, spend: { amount: 2000 } }],
    ['a couple', { household: 'couple', you: { age: 52, pot: 200000, payIn: { total: 600 } }, partner: { age: 50, pot: 80000, payIn: { total: 300 } }, stop: { age: 60 }, spend: { kind: 'level', level: 'moderate' } }],
    ['stopping at 55 with savings', { you: { age: 45, pot: 200000, payIn: { total: 700 } }, savings: 40000, savingsIn: 300, stop: { age: 55 }, spend: { amount: 1600 } }]
  ])('%s', (_name, given) => {
    const b = ok(answerB(given, REAL), given);
    const a = answerA(asA(b.inputs), { ...REAL, ages: [b.stop.age] });
    const row = a.ages.find((r) => r.age === b.stop.age);
    expect(row.lasted).toBe(b.wholeLife.lasted);
    expect(row.runOutAge).toBe(b.wholeLife.runOutAge);
  });
});
