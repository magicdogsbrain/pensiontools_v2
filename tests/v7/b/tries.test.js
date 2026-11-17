/**
 * A try on "Am I saving enough?" (7.12.0, the saver brief's P2.1): the slider, "Pay in ±", "Pay in more" and the grid try a
 * pay-in, and a one-off sum of your own can be tried, without ever writing over what was typed as now; "as now" is said
 * only of what was typed. Fictional people, worked by hand:
 *
 *   Sam, 45: £300 a month from take-home pay and £250 from the employer = 300 × 1.25 + 250 = £625 going in now. Trying £100
 *            more from pay: (300 + 100) × 1.25 + 250 = £750.
 *   Jo, 33:  £22,000 in the pension. £10,000 put in now from Jo's own money lands as 10,000 × 1.25 = £12,500, so Jo with
 *            that lump is asked exactly as Jo with a pot of 22,000 + 12,500 = £34,500.
 */
import { describe, it, expect } from 'vitest';
import { answerB, tryOf } from '../../../src/answers/b/answer.js';
import { tryPayInTo } from '../../../src/v7/components/payInTo.js';
import { answerSlider } from '../../../src/v7/state/select.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { initialState, emptySaverAnswer } from '../../../src/v7/state/initial.js';

const ENV = { today: '2026-11-16', futures: 40, seed: 0, trace: false, detail: 'answer' };
const SAM = { household: 'single', you: { age: 45, pot: 120000, payIn: { kind: 'split', own: 300, employer: 250, ownFrom: 'takeHome' } }, stop: { age: 65 }, spend: { kind: 'amount', amount: 2400 } };
const JO = { household: 'single', you: { age: 33, pot: 22000, payIn: { kind: 'share', pay: 38000, ownPct: 5, employerPct: 3 } }, stop: { age: 60 }, spend: { kind: 'amount', amount: 2000 } };

describe('a try never writes over what was typed as now', () => {
  it('Sam tries £100 more from take-home pay: £750 going in is tested, £625 is what Sam pays now', () => {
    const t = tryOf({ ...SAM, try: { payIn: 400 } });
    expect(t.inputs.you.payIn).toEqual({ kind: 'split', own: 400, employer: 250, ownFrom: 'takeHome' });
    expect(t.tried).toMatchObject({ payIn: true, now: 625, lump: 0 });
    const a = answerB({ ...SAM, try: { payIn: 400 } }, ENV);
    expect(a.payIn.now).toBe(750);
    expect(a.tried.now).toBe(625);
    expect(a.sentences.verdictLine.text).toMatch(/^Paying in £750 a month \(£400 a month from your take-home pay and £250 from your employer; £625 a month goes in now\), /);
    const all = JSON.stringify(a.sentences);
    expect(all).not.toMatch(/Paying in £[\d,]+ a month as now/);
  }, 120000);

  it('(7.12.0, the second walk) what goes in now beside a try names whose it is: never "you pay 8%" of a 5% and 3% scheme, never "you pay £625" of £375 and £250', () => {
    // Jo pays 5% and the employer 3%: 8% goes in now. Trying 13%: the sentence says 8% goes in now, Jo 5%, the employer 3%
    const jo = answerB({ ...JO, try: { payInPct: 10 } }, ENV);
    expect(jo.sentences.verdictLine.text).toContain('; 8% goes in now: you 5%, your employer 3%)');
    expect(jo.sentences.verdictLine.text).not.toMatch(/you pay 8%/);
    // Sam: £300 from take-home pay is £375 going in, with the employer's £250: £625 a month goes in now
    const sam = answerB({ ...SAM, try: { payIn: 400 } }, ENV);
    expect(sam.sentences.verdictLine.text).toMatch(/^Paying in £750 a month \(£400 a month from your take-home pay and £250 from your employer; £625 a month goes in now\), /);
  }, 120000);

  it('a try at what was typed is no try: the answer is the one for what was typed, said "as now"', () => {
    const a = answerB({ ...SAM, try: { payIn: 300 } }, ENV);
    expect(a.tried).toBeUndefined();
    expect(a.sentences.verdictLine.text).toMatch(/^Paying in £625 a month as now/);
  }, 120000);

  it('Jo with £10,000 of her own put in now is Jo with a pot of £34,500: the same count', () => {
    const lump = answerB({ ...JO, you: { ...JO.you, lump: 10000 } }, ENV);
    const pot = answerB({ ...JO, you: { ...JO.you, pot: 34500 } }, ENV);
    expect(lump.tried).toMatchObject({ payIn: false, lump: 10000, lumpLands: 12500 });
    expect(lump.chance).toEqual(pot.chance);
    expect(lump.payIn.needed).toBe(pot.payIn.needed);
    expect(lump.sentences.tryLump.text).toBe('Counting £10,000 put in now from your own money: £12,500 in your pension with the tax added back.');
  }, 120000);

  it('"Pay in more" and the stepper write the try in the unit typed: £750 in all is (750 − 250) × 0.8 = £400 from take-home pay', () => {
    expect(tryPayInTo(SAM.you.payIn, 750)).toEqual([{ type: 'draft/set', q: 'b', path: 'try.payIn', value: '400' }]);
    // a share: the least share that lands at least that much — 34% of £38,000 ÷ 12 is £1,076.67 from Jo, with the employer's
    // £95 that is £1,171.67; asked for £1,171.60, 33.5% lands only £1,155.83, so 34%
    expect(tryPayInTo({ ...JO.you.payIn }, 1171.6)).toEqual([{ type: 'draft/set', q: 'b', path: 'try.payInPct', value: '34' }]);
  });

  it('the slider tries a share, and reaches the share that would be enough (rounded up to 5%)', () => {
    const r = answerB(JO, ENV);
    const s = { ...initialState({ today: ENV.today, build: 'test' }) };
    s.draft = { ...s.draft, b: { ...s.draft.b, values: { 'you.payIn.kind': 'share', 'you.payIn.ownPct': '5' } } };
    s.answers = { ...s.answers, b: { ...emptySaverAnswer(), status: 'final', result: r } };
    const S = answerSlider(s, 'b');
    expect(S.path).toBe('try.payInPct');
    expect(S.max).toBeGreaterThanOrEqual(r.enough.atLevel.ownPct);
  }, 120000);

  it('typing a new pay-in as now lets the try go', () => {
    let s = initialState({ build: 'test', today: '2026-11-16' });
    s = reduce(s, { type: 'draft/set', q: 'b', path: 'try.payIn', value: '400' });
    expect(s.draft.b.values['try.payIn']).toBe('400');
    s = reduce(s, { type: 'draft/set', q: 'b', path: 'you.payIn.own', value: '320' });
    expect(s.draft.b.values['try.payIn']).toBeUndefined();
  });
});
