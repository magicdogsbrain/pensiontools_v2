/**
 * Question C's words for couples who stop in different years (research/v7/couples-different-years.md 2.4, 5.3), on real
 * answers: the sub-line from when you have both stopped, with what the pay covers until then in its three settings; the
 * first "what it is made of" row; the start of each person's money; the pay-in of the one still working; the pay line,
 * the partner who has stopped and the savings with the first stopper under what was assumed; the 2028 line (section 12);
 * either of you as "you"; and, with one start for both, none of it. Every word passes the banned list in C's scopes — the
 * "retired" rules included. Made-up figures only.
 */
import { describe, it, expect } from 'vitest';
import { answerC, checkAnswer } from './invariants.js';
import { bannedHits } from '../render/checkScreen.js';
import { money } from '../../../src/answers/shared/format.js';

const ENV = { today: '2026-09-30', futures: 20, seed: 0, trace: false };
const SCOPES = ['all', 'first', 'planner', 'retired', 'result'];
const ids = (list) => list.map((x) => x.id);
const textsOf = (c) => Object.values(c.sentences).flatMap((v) => (Array.isArray(v) ? v : [v])).filter((s) => s && typeof s.text === 'string')
  .concat(c.assumed, c.warnings).map((s) => s.text);
const run = (inputs) => {
  const c = answerC(inputs, ENV);
  expect(c.status, JSON.stringify(c.problems)).toBe('ok');
  expect(checkAnswer(c, inputs)).toEqual([]);
  const texts = textsOf(c);
  const whole = texts.join(' ');
  for (const t of texts) expect(bannedHits(t, SCOPES, { context: whole }), t).toEqual([]);
  return c;
};
const line = (c, id) => c.assumed.find((x) => x.id === id);

/** You stopped some years ago and draw from now; your partner, 55, pays in and stops at 56. */
const YOU_FIRST = { household: 'couple', you: { age: 61, pot: 180000 }, partner: { age: 55, pot: 260000, payIn: { has: 'yes', kind: 'split', own: 400, employer: 300 }, stop: { kind: 'age', age: 56 } },
  savings: 40000, start: { kind: 'now' } };
/** The same couple from the other chair: you stop at 56, your partner has already stopped. */
const PARTNER_FIRST = { household: 'couple', you: { age: 55, pot: 260000, payIn: { has: 'yes', kind: 'split', own: 400, employer: 300 } }, partner: { age: 61, pot: 180000, stop: { kind: 'already' } },
  savings: 40000, start: { kind: 'age', age: 56 } };

describe('C — the words of couples who stop in different years', () => {
  it('the sub-line: from when you have both stopped, and what the pay covers until then (Half, the default)', () => {
    const c = run(PARTNER_FIRST);
    expect(c.apart).toMatchObject({ first: 'partner', years: 1, stops: { you: { age: 56, already: false }, partner: { age: 61, already: true } }, payCovers: 0.5, coversGap: true });
    expect(c.sentences.sub).toMatchObject({ id: 'c.sub.apart',
      text: "after tax, for the two of you, from when you have both stopped (you at 56) until the younger of you is 95, going up each year with prices. Until then, half of it comes from your partner's money and your pay covers the rest." });
    expect(c.sentences.line.text).toContain(', the two of you could have about ' + money(c.monthly.careful) + ' a month after tax, from when you have both stopped until the younger of you is 95.');
    const half = money(c.monthly.careful / 2);
    expect(c.sentences.madeOf[0]).toMatchObject({ id: 'c.madeOf.apart', text: `Until you are 56, while you are still working: ${half} from your partner's money + ${half} from your pay.` });
    expect(c.phases[0].fromPay).toBe(c.monthly.careful / 2);
  });

  it('what was assumed: the pay line with Change, the partner who has stopped, the savings with them, each person\'s start, the pay-in', () => {
    const c = run(PARTNER_FIRST);
    expect(line(c, 'stop-apart')).toMatchObject({ field: 'untilBothStop', source: 'default', value: 'half',
      text: "Your partner has already stopped and you stop at 56. Until then, your pay covers half of what you spend; the other half comes from your partner's money. You keep paying in until you stop." });
    expect(line(c, 'stop-apart-cover').text).toBe("If the money of the one who has stopped cannot pay its part (say their pension cannot be touched yet), the other's pay covers the rest.");
    expect(line(c, 'partner-already')).toMatchObject({ field: 'partner.stop.kind', source: 'entered', value: 'already',
      text: 'Your partner has already stopped, so nothing more goes into their pension, and their money is drawn on from now.' });
    expect(line(c, 'savings-first').text).toBe("Your savings between you go with your partner's money: they stop first.");
    expect(line(c, 'start').text).toBe('Your money is taken from when you are 56.');
    expect(line(c, 'pay-in').text).toBe('£700 a month goes into your pension until you stop at 56, rising with prices.');
    expect(line(c, 'pot-invested').text).toBe('Until each of you stops, your money stays invested, kept at its mix of shares, bonds and cash every month.');
    expect(c.sentences.pot.text).toMatch(/^Taking each of you at your own stop, your pots and savings could be about £[\d,]+\./);
    for (const id of ['both-stop-together', 'savings-split']) expect(ids(c.assumed)).not.toContain(id);
  });

  it('"All of it" and "None of it": their own sub-line, first row and pay line; the cover line only under Half', () => {
    const all = run({ ...PARTNER_FIRST, untilBothStop: 'all' });
    expect(all.sentences.sub.text).toBe('after tax, for the two of you, from when you have both stopped (you at 56) until the younger of you is 95, going up each year with prices. Until then, your pay covers all of it.');
    expect(all.sentences.madeOf[0].text).toBe(`Until you are 56, while you are still working: ${money(all.monthly.careful)} a month, all from your pay.`);
    expect(line(all, 'stop-apart')).toMatchObject({ source: 'entered', value: 'all' });
    expect(line(all, 'partner-already').text).toBe('Your partner has already stopped, so nothing more goes into their pension.');
    expect(ids(all.assumed)).not.toContain('stop-apart-cover');
    const none = run({ ...PARTNER_FIRST, untilBothStop: 'none' });
    expect(none.sentences.sub.text).toBe("after tax, for the two of you, from when you have both stopped (you at 56) until the younger of you is 95, going up each year with prices. Until then, all of it comes from your partner's money.");
    expect(none.sentences.madeOf[0].text).toBe(`Until you are 56, while you are still working: ${money(none.monthly.careful)} from your partner's money.`);
    expect(line(none, 'stop-apart').text).toBe("Your partner has already stopped and you stop at 56. Until then, your partner's money pays all of what you spend. You keep paying in until you stop.");
    expect(ids(none.assumed)).not.toContain('stop-apart-cover');
    // the pay that covers more never pays less (couples-different-years.md 9.3 P3), to one step
    const half = run(PARTNER_FIRST);
    expect(none.monthly.careful).toBeLessThanOrEqual(half.monthly.careful + 10);
    expect(half.monthly.careful).toBeLessThanOrEqual(all.monthly.careful + 10);
  });

  it('either of you can be "you": the same figures, and the words follow whoever is the one still working', () => {
    const x = run(YOU_FIRST);
    const y = run(PARTNER_FIRST);
    expect(x.monthly).toEqual(y.monthly);
    expect(x.lasted).toEqual(y.lasted);
    expect(x.sentences.sub.text).toBe("after tax, for the two of you, from when you have both stopped (your partner at 56) until the younger of you is 95, going up each year with prices. Until then, half of it comes from your money and your partner's pay covers the rest.");
    const half = money(x.monthly.careful / 2);
    expect(x.sentences.madeOf[0].text).toBe(`Until you are 62, while your partner is still working: ${half} from your money + ${half} from your partner's pay.`);
    expect(line(x, 'stop-apart').text).toBe('You have already stopped and your partner stops at 56. Until then, their pay covers half of what you spend; the other half comes from your money. They keep paying in until they stop.');
    expect(line(x, 'savings-first').text).toBe('Your savings between you go with your money: you stop first.');
    expect(line(x, 'start').text).toBe('Your money is taken from now.');
    expect(line(x, 'pay-in-partner').text).toBe("£700 a month goes into your partner's pension until they stop at 56, rising with prices.");
    expect(x.sentences.payIn.text).toMatch(/^Paying in £700 a month into your partner's pension until your partner stops at 56, rising with prices;/);
  });

  it('money moved into drawdown before 6 April 2028 at 55 or 56: one line, for the person it touches (section 12)', () => {
    expect(run(PARTNER_FIRST).warnings.find((w) => w.id === 'drawdown-2028'))
      .toMatchObject({ severity: 'note', text: 'Move into drawdown what you will need before 57 by 5 April 2028: after that, nothing new can be taken until you are 57.' });
    expect(run(YOU_FIRST).warnings.find((w) => w.id === 'drawdown-2028').text)
      .toBe('For your partner: move into drawdown what they will need before 57 by 5 April 2028: after that, nothing new can be taken until they are 57.');
    // the one still working at 58: their pension opens at 57 after the rule has moved, so nothing to say
    expect(ids(run({ ...PARTNER_FIRST, you: { ...PARTNER_FIRST.you, age: 58 }, start: { kind: 'age', age: 60 } }).warnings)).not.toContain('drawdown-2028');
  });

  it('a bad case that leans on the pay: the stopped partner\'s money cannot pay its half — said with the age', () => {
    // your partner stopped at 53, their pension closed until 57 and little cash; you work on to 60
    const c = run({ household: 'couple', you: { age: 57, pot: 400000, payIn: { has: 'yes', kind: 'total', total: 800 } }, partner: { age: 53, pot: 200000, stop: { kind: 'already' } },
      savings: 10000, start: { kind: 'age', age: 60 } });
    expect(c.apart.coverUsed).toEqual({ who: 'partner', fromAge: expect.any(Number) });
    expect(c.warnings.find((w) => w.id === 'apart-cover-used')).toMatchObject({ severity: 'important',
      text: `In a bad case (the worst 1 in 10), your partner's money cannot pay its half from when they are ${c.apart.coverUsed.fromAge}, so your pay would need to cover all of what you spend until you stop at 60.` });
  });

  it('one start for both: none of these words', () => {
    const c = run({ ...YOU_FIRST, partner: { age: 55, pot: 260000 } });
    expect(c.apart).toBeUndefined();
    expect(c.sentences.sub.id).toBe('c.sub.couple');
    expect(ids(c.assumed)).toEqual(expect.arrayContaining(['both-stop-together', 'savings-split']));
    for (const id of ['stop-apart', 'stop-apart-cover', 'partner-already', 'you-already', 'savings-first']) expect(ids(c.assumed)).not.toContain(id);
    for (const id of ['apart-cover-used', 'drawdown-2028']) expect(ids(c.warnings)).not.toContain(id);
    expect(ids(c.sentences.madeOf)).not.toContain('c.madeOf.apart');
  });
});
