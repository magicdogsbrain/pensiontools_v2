/**
 * Question B's words for couples who stop work in different years (research/v7/couples-different-years.md 2.4, 5.3), on
 * real answers: the number is the pensions of those still saving, each at their own stop — "You need about £410,000 in
 * pensions between you: yours when you stop at 60 and your partner's when they stop at 62", "… in your pension when you
 * stop at 60, with your partner's money as you gave it", "Your partner needs about £300,000 in their pension when they
 * stop at 56, with your money as you gave it" — the pay-in that gets there goes only to those still saving, the pay line
 * is under what was assumed, and a couple who have both stopped have no saving question. Made-up figures only.
 */
import { describe, it, expect } from 'vitest';
import { answerB, checkAnswerB, sentencesOf } from './invariants.js';
import { bannedHits } from '../render/checkScreen.js';
import { pot } from '../../../src/answers/shared/format.js';

const ENV = { today: '2026-09-30', futures: 20, seed: 0, trace: false, detail: 'answer' };
// B's scopes, and the saver and retired rules too: "I've already stopped" is answered in words a retired person reads
const SCOPES = ['all', 'first', 'planner', 'result', 'saver', 'retired'];
const ids = (list) => list.map((x) => x.id);
const run = (inputs, env = ENV) => {
  const b = answerB(inputs, env);
  expect(b.status, JSON.stringify(b.problems)).not.toBe('invalid');
  expect(checkAnswerB(b, inputs)).toEqual([]);
  const texts = sentencesOf(b).map((s) => s.text).concat(b.assumed.map((x) => x.text), b.warnings.map((x) => x.text));
  const whole = texts.join(' ');
  for (const t of texts) expect(bannedHits(t, SCOPES, { context: whole }), t).toEqual([]);
  return b;
};

const BASE = { household: 'couple', savings: 30000, spend: { kind: 'amount', amount: 2800 } };
/** You save until 60; your partner has stopped and draws now. */
const PARTNER_STOPPED = { ...BASE, you: { age: 52, pot: 150000, payIn: { kind: 'total', total: 600 } }, partner: { age: 59, pot: 160000, stop: { kind: 'already' } }, stop: { age: 60 } };
/** The same couple from the other chair: you have stopped, your partner saves until 60. */
const YOU_STOPPED = { ...BASE, you: { age: 59, pot: 160000 }, partner: { age: 52, pot: 150000, payIn: { kind: 'total', total: 600 }, stop: { kind: 'age', age: 60 } }, stop: { kind: 'already' } };
/** Both still saving, each until their own stop. */
const BOTH_SAVING = { ...BASE, you: { age: 50, pot: 120000, payIn: { kind: 'total', total: 500 } }, partner: { age: 48, pot: 60000, payIn: { kind: 'total', total: 250 }, stop: { kind: 'age', age: 56 } }, stop: { age: 60 } };

describe('B — the words of couples who stop in different years', () => {
  it('your partner has stopped: the number is your pension at your stop, with your partner\'s money as you gave it', () => {
    const b = run(PARTNER_STOPPED);
    expect(b.apart).toMatchObject({ first: 'partner', stops: { you: { age: 60 }, partner: { age: 59, already: true } } });
    expect(b.number.byPerson.find((x) => x.who === 'partner').pot).toBe(0);
    expect(b.saving.map((x) => [x.who, x.yearsSaving, x.stopAge])).toEqual([['you', 8, 60], ['partner', 0, 59]]);
    if (b.status === 'ok' && !b.onCourse && b.number.careful > 0) {
      expect(b.sentences.head.text).toBe(`About ${pot(b.number.careful)} by age 60`);
      expect(b.sentences.line.text).toBe(`You need about ${pot(b.number.careful)} in your pension when you stop at 60, with your partner's money as you gave it. With exactly that, the money lasted in 9 futures out of 10.`);
    }
    expect(b.assumed.find((x) => x.id === 'pay-in').text).toBe('£600 a month goes into your pension until you stop at 60, rising with prices.');
    expect(b.assumed.find((x) => x.id === 'stop-apart')).toMatchObject({ field: 'untilBothStop', source: 'default', value: 'half' });
    for (const id of ['stop-together', 'pay-in-split', 'savings-split']) expect(ids(b.assumed)).not.toContain(id);
    expect(ids(b.assumed)).toEqual(expect.arrayContaining(['partner-already', 'savings-first', 'stop-apart-cover']));
    // the pay-in that gets there goes into your pension only: £10,000 a month at most, for the one still saving
    expect(b.basis.payInCeiling).toBe(10000);
  });

  it('"I\'ve already stopped": the answer is about your partner, whose pension the number is', () => {
    const b = run(YOU_STOPPED);
    expect(b.askedAbout).toBe('partner');
    expect(b.stop.age).toBe(60);
    if (b.onCourse) expect(b.sentences.head.text).toBe('Your partner is on course for 60');
    else if (b.status === 'ok' && b.number.careful > 0) {
      expect(b.sentences.head.text).toBe(`About ${pot(b.number.careful)} by the time your partner is 60`);
      expect(b.sentences.line.text).toBe(`Your partner needs about ${pot(b.number.careful)} in their pension when they stop at 60, with your money as you gave it. With exactly that, the money lasted in 9 futures out of 10.`);
    }
    expect(b.assumed.find((x) => x.id === 'stop-age')).toMatchObject({ field: 'partner.stop.age', value: 60, text: 'Your partner stops working at 60, and nothing more goes into their pension from then.' });
    expect(b.assumed.find((x) => x.id === 'pay-in')).toMatchObject({ field: 'partner.payIn.total', text: "£600 a month goes into your partner's pension until they stop at 60, rising with prices." });
    expect(ids(b.assumed)).toContain('you-already');
    expect(b.sentences.change.text).toMatch(/^Now: (not )?on course for your partner at 60, /);
  });

  it('either of you can be "you": the two chairs give one number, one count and one pay-in (couples-different-years.md 9.3 P2)', () => {
    const x = run(PARTNER_STOPPED);
    const y = run(YOU_STOPPED);
    expect(y.number.careful).toBe(x.number.careful);
    expect(y.chance).toEqual(x.chance);
    expect(y.payIn.at).toEqual(x.payIn.at);
    expect(y.wholeLife).toEqual(x.wholeLife);
  });

  it('both still saving, each until their own stop: the pensions between you at your own stops', () => {
    const b = run(BOTH_SAVING);
    expect(b.apart).toMatchObject({ first: 'partner', years: 2, stops: { you: { age: 60 }, partner: { age: 56 } } });
    if (b.status === 'ok' && !b.onCourse && b.number.careful > 0) {
      expect(b.sentences.head.text).toBe(`About ${pot(b.number.careful)} between you by the time you have both stopped`);
      expect(b.sentences.line.text).toBe(`You need about ${pot(b.number.careful)} in pensions between you: yours when you stop at 60 and your partner's when they stop at 56. With exactly that, the money lasted in 9 futures out of 10.`);
      expect(b.sentences.payInSub.text).toMatch(/from now until each of you stops, going up each year with prices$/);
    }
    expect(b.assumed.find((x) => x.id === 'pay-in').text).toBe('£750 a month goes in between you, each until your own stop, rising with prices.');
    expect(ids(b.assumed)).toContain('pay-in-split');
    expect(b.basis.payInCeiling).toBe(20000);
  });

  it('a couple who have both stopped have no saving question: invalid, with the words that send them to "What is that a month?"', () => {
    const b = answerB({ ...YOU_STOPPED, partner: { ...YOU_STOPPED.partner, stop: { kind: 'already' } } }, ENV);
    expect(b).toEqual({ status: 'invalid', problems: [{ field: 'partner.stop.kind', messageId: 'partner-stop-after-now' }] });
  });

  it('the pensions cover it from when you have both stopped, the pay making up the rest before: no pot is needed, said from then', () => {
    // your partner has stopped with a final-salary pension; you, with nothing in a pension, stop at 58
    const G = { household: 'couple', you: { age: 50, pot: 0, payIn: { kind: 'total', total: 0 } }, partner: { age: 60, pot: 0, finalSalary: { has: true, yearly: 30000, fromAge: 60 }, stop: { kind: 'already' } },
      savings: 0, spend: { kind: 'amount', amount: 1000 }, stop: { age: 58 } };
    const b = run(G);
    expect(b.status).toBe('guaranteed-only');
    expect(b.number).toMatchObject({ careful: 0, middling: 0, good: 0 });
    expect(b.sentences.sub.text).toBe('your State Pensions and final-salary pension cover it after tax from when you have both stopped until the younger of you is 95, going up each year with prices');
    // a partner with nothing at all but their State Pension, years away: the pay makes up their half until then — the same
    // status, and the bad case that leans on the pay said with the age (a NIGHTLY=1 run, 1 Oct 2026: "ok" with a number of
    // nought and no savings before)
    const lean = run({ ...G, partner: { age: 62, pot: 0, stop: { kind: 'already' } }, spend: { kind: 'amount', amount: 100 }, you: { age: 30, pot: 0, payIn: { kind: 'total', total: 0 } }, stop: { age: 54 } });
    expect(lean.status).toBe('guaranteed-only');
    expect(lean.apart.coverUsed).toEqual({ who: 'partner', fromAge: 62 });
    expect(lean.warnings.find((w) => w.id === 'apart-cover-used').text)
      .toBe("In a bad case (the worst 1 in 10), your partner's money cannot pay its half from when they are 62, so your pay would need to cover all of what you spend until you stop at 54.");
  });

  it('one stop for both: none of these words', () => {
    const b = run({ ...BOTH_SAVING, partner: { ...BOTH_SAVING.partner, stop: undefined } });
    expect(b.apart).toBeUndefined();
    expect(ids(b.assumed)).toContain('stop-together');
    for (const id of ['stop-apart', 'stop-apart-cover', 'partner-already', 'you-already', 'savings-first']) expect(ids(b.assumed)).not.toContain(id);
    expect(['b.line', 'b.line.couple', 'b.line.zero']).toContain(b.sentences.line.id);
  });
});
