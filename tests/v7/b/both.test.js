/**
 * "Both together", worked out (7.12.0): when neither stopping later (up to the latest age tried) nor spending less from
 * the stop lasts on its own, the answer says a later age and an amount that do, together — the latest age tried and what
 * could be spent a month from then, paying in as now — and asked again at exactly those two, it is on course with the
 * same count. Fictional: Lee, 50, nothing saved yet, 5% and 3% of £20,000, wanting £3,000 a month from 55.
 */
import { describe, it, expect } from 'vitest';
import { answerB } from '../../../src/answers/b/answer.js';

const ENV = { today: '2026-11-16', futures: 40, seed: 0, trace: false, detail: 'answer' };
const LEE = { household: 'single', you: { age: 50, pot: 0, payIn: { kind: 'share', pay: 20000, ownPct: 5, employerPct: 3 } }, stop: { age: 55 }, spend: { kind: 'amount', amount: 3000 } };
const money = (n) => '£' + Math.round(n).toLocaleString('en-GB');

describe('both together, as figures', () => {
  it('neither alone lasts: a later age and an amount that do, said in the enough block, and on course when asked again', () => {
    const a = answerB(LEE, ENV);
    expect(a.levers.stopLater).toBe(null);
    expect(a.levers.spendLess).toBe(null);
    const both = a.levers.both;
    expect(both).toBeTruthy();
    expect(both.age).toBeGreaterThan(55);
    expect(both.spend).toBeGreaterThan(0);
    expect(both.spend).toBeLessThan(3000);
    expect(a.sentences.enoughLine.text).toBe(`Neither stopping later nor spending less does it on its own. Both together could: stopping at ${both.age} and spending ${money(both.spend)} a month from then, paying in as now, and your money lasts as long as you do 18 times in 20.`);
    const again = answerB({ ...LEE, stop: { age: both.age }, spend: { kind: 'amount', amount: both.spend } }, ENV);
    expect(again.onCourse).toBe(true);
    expect(again.chance.fixedAge).toBe(both.lasted);
  }, 300000);

  it('when one way works alone, there is no "both"', () => {
    const a = answerB({ ...LEE, you: { ...LEE.you, pot: 200000 }, spend: { kind: 'amount', amount: 2000 } }, ENV);
    expect(a.levers.both).toBeUndefined();
  }, 300000);
});
