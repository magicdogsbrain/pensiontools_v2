/**
 * "Am I saving enough?" says what goes in now in the person's own parts (7.12.0): what leaves take-home pay and the
 * employer's part, beside "as now"; and what would be on course in a sentence of its own that also says what leaves
 * take-home pay for it. Fictional people, worked by hand:
 *
 *   Jo, 33: £38,000 pay, 5% and the employer 3%. In all 8% × 38,000 ÷ 12 = 253.33, £253; Jo's 5% is 158.33 going in,
 *           × 0.8 = 126.67, about £127 from take-home pay; the employer's 3% is £95.
 *   Sam, 45: £300 a month from take-home pay and £250 from the employer: 300 × 1.25 + 250 = £625 a month in all.
 *           For £X a month going in, (X − 250) × 0.8 leaves take-home pay.
 */
import { describe, it, expect } from 'vitest';
import { answerB } from '../../../src/answers/b/answer.js';

const ENV = { today: '2026-11-16', futures: 40, seed: 0, trace: false, detail: 'answer' };
const JO = { household: 'single', you: { age: 33, pot: 22000, payIn: { kind: 'share', pay: 38000, ownPct: 5, employerPct: 3 } }, stop: { age: 60 }, spend: { kind: 'amount', amount: 2000 } };
const SAM = { household: 'single', you: { age: 45, pot: 120000, payIn: { kind: 'split', own: 300, employer: 250, ownFrom: 'takeHome' } }, stop: { age: 65 }, spend: { kind: 'amount', amount: 2400 } };
const money = (t) => Number(String(t).replace(/[£,]/g, ''));

describe('the answer says what goes in now, in the person\'s own parts', () => {
  it('Jo: 8% of pay as now is £253 a month in all, about £127 from take-home pay and £95 from the employer', () => {
    const a = answerB(JO, ENV);
    expect(a.sentences.verdictLine.text).toMatch(/^Paying in 8% of your pay as now \(£253 a month in all: about £127 from your take-home pay and £95 from your employer\), /);
  }, 120000);

  it('Sam: £625 a month as now, £300 from take-home pay and £250 from the employer; never "not on course" in the head', () => {
    const a = answerB(SAM, ENV);
    expect(a.sentences.verdictLine.text).toMatch(/^Paying in £625 a month as now \(£300 from your take-home pay and £250 from your employer\), /);
    expect(a.sentences.verdictHead.text).toBe('Not enough for £2,400 a month from 65');
  }, 120000);

  it('what would be on course is a sentence of its own, saying what leaves take-home pay: (going in − 250) × 0.8', () => {
    const a = answerB(SAM, ENV);
    const t = a.sentences.verdictEnough.text;
    const m = /^£([\d,]+) a month going into your pension \(£([\d,]+) from your take-home pay\) would put you on course/.exec(t);
    expect(m, t).not.toBeNull();
    expect(Math.abs(money(m[2]) - (money(m[1]) - 250) * 0.8)).toBeLessThanOrEqual(1);
    expect(a.sentences.verdictLine.text).not.toMatch(/on course/);
    expect(a.sentences.enoughHead.text).toMatch(/take-home pay/);
  }, 120000);

  it('Jo: the share that would be enough says Jo\'s share, the total in all going in, and what leaves take-home pay', () => {
    const a = answerB(JO, ENV);
    expect(a.sentences.verdictEnough.text).toMatch(/^[\d.]+% of your pay in all \(you [\d.]+%; £[\d,]+ a month in all going into your pension, about £[\d,]+ from your take-home pay\) would put you on course/);
  }, 120000);
});
