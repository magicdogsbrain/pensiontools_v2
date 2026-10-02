/**
 * Question A's words for couples who stop work in different years (research/v7/couples-different-years.md 2.4), on real
 * answers: the headline about the person the answer is about ("Yes — your partner could stop at 56"), the sentence that
 * names both stops, the first "what it is made of" row with the pay, the pay line under what was assumed in its three
 * settings, the bad case that leans on the pay, the line for money moved into drawdown before 6 April 2028 — and, with
 * one stop for both, none of it. Every word passes the banned list in A's scopes; no figure of a real person is used.
 */
import { describe, it, expect } from 'vitest';
import { answerA, checkAnswerA, scopesForA, allSentences } from './invariants.js';
import { bannedHits } from '../render/checkScreen.js';
import { money, outOfTen, underNine } from '../../../src/answers/shared/format.js';

const ENV = { today: '2026-09-30', futures: 20, seed: 0, trace: false, detail: 'chart' };
const ids = (list) => list.map((x) => x.id);
const run = (inputs, ages) => {
  const env = { ...ENV, ages };
  const a = answerA(inputs, env);
  expect(a.status, JSON.stringify(a.problems)).toBe('ok');
  expect(checkAnswerA(a, inputs, env)).toEqual([]);
  const all = allSentences(a);
  const context = all.map((s) => s.text).join(' ');
  for (const s of all) expect(bannedHits(s.text, scopesForA(a.inputs), { context }), `${s.id}: ${s.text}`).toEqual([]);
  return a;
};
const count = (lasted) => (underNine(lasted) ? 'in just under 9 futures out of 10' : outOfTen(lasted).words);

/** Your partner has stopped and draws now; you stop at 58 (made-up figures). */
const PARTNER_STOPPED = { household: 'couple', you: { age: 55, pot: 300000, payIn: { kind: 'total', total: 600 } }, partner: { age: 61, pot: 200000, stop: { kind: 'already' } },
  savings: 40000, stop: { kind: 'age', age: 58 }, spend: { kind: 'amount', amount: 2500 } };
/** The same couple from the other chair: you have stopped, your partner stops at 58. */
const YOU_STOPPED = { household: 'couple', you: { age: 61, pot: 200000 }, partner: { age: 55, pot: 300000, payIn: { kind: 'total', total: 600 }, stop: { kind: 'age', age: 58 } },
  savings: 40000, stop: { kind: 'already' }, spend: { kind: 'amount', amount: 2500 } };

describe('A — the words of couples who stop in different years', () => {
  it('you stop at 58, your partner has stopped: the headline is yours, the sentence names both, the first row says what the pay covers', () => {
    const a = run(PARTNER_STOPPED, [58]);
    expect(a.askedAbout).toBeUndefined();
    expect(a.apart).toMatchObject({ first: 'partner', years: 3, stops: { you: { age: 58, already: false }, partner: { age: 61, already: true } }, payCovers: 0.5, coversGap: true });
    const verdictWords = { yes: 'Yes — you could stop at 58', close: 'Close — stopping at 58 is tight', no: 'Not at 58 on these figures' };
    expect(a.sentences.head.text).toBe(verdictWords[a.shown.verdict]);
    expect(a.sentences.sub.text).toBe('spending £2,500 a month after tax between you, from now until the younger of you is 95, going up each year with prices');
    expect(a.sentences.line.text).toBe(`Stopping at 58, with your partner already stopped, and spending £2,500 a month between you, the money lasted until the younger of you was 95 ${count(a.shown.lasted)}.`);
    const first = a.sentences.pays[0];
    expect(first.id).toBe('a.pays.apart');
    expect(first.text).toMatch(/^From when you are 55 until 58, while you are still working: £1,250 from your partner's (money|savings) \+ £1,250 from your pay\./);
    expect(a.shown.phases[0].fromPay).toBe(1250);
    expect(a.shown.phases[0].byPerson.find((b) => b.who === 'you').working).toBe(true);
  });

  it('what was assumed: the pay line (with Change), what it means, the partner who has stopped, the savings with them; no same-year line', () => {
    const a = run(PARTNER_STOPPED, [58]);
    const line = (id) => a.assumed.find((x) => x.id === id);
    expect(line('stop-apart')).toMatchObject({ field: 'untilBothStop', source: 'default', value: 'half',
      text: "Your partner has already stopped and you stop at 58. Until then, your pay covers half of what you spend; the other half comes from your partner's money. You keep paying in until you stop." });
    expect(line('stop-apart-cover').text).toBe("If the money of the one who has stopped cannot pay its part (say their pension cannot be touched yet), the other's pay covers the rest.");
    expect(line('partner-already')).toMatchObject({ field: 'partner.stop.kind', source: 'entered', value: 'already',
      text: 'Your partner has already stopped, so nothing more goes into their pension, and their money is drawn on from now.' });
    expect(line('savings-first').text).toBe("Your savings between you go with your partner's money: they stop first.");
    expect(line('pay-in').text).toBe('£600 a month goes into your pension until you stop at 58, going up with prices.');
    for (const id of ['stop-together', 'savings-split', 'pay-in-partner', 'nothing-paid-in-partner']) expect(ids(a.assumed)).not.toContain(id);
  });

  it('"All of it" and "None of it" have their own sentences, and the cover line is said only while the stopped money has a part to pay', () => {
    const all = run({ ...PARTNER_STOPPED, untilBothStop: 'all' }, [58]);
    expect(all.assumed.find((x) => x.id === 'stop-apart')).toMatchObject({ source: 'entered', value: 'all',
      text: "Your partner has already stopped and you stop at 58. Until then, your pay covers all of what you spend, and your partner's money is left alone. You keep paying in until you stop." });
    expect(ids(all.assumed)).not.toContain('stop-apart-cover');
    expect(all.sentences.pays[0].text).toBe("From when you are 55 until 58, while you are still working: £2,500 a month, all from your pay.");
    const none = run({ ...PARTNER_STOPPED, untilBothStop: 'none' }, [58]);
    expect(none.assumed.find((x) => x.id === 'stop-apart').text).toBe("Your partner has already stopped and you stop at 58. Until then, your partner's money pays all of what you spend. You keep paying in until you stop.");
    expect(ids(none.assumed)).not.toContain('stop-apart-cover');
    expect(none.apart.coversGap).toBe(false);
  });

  it('"I\'ve already stopped": the answer is about your partner — headline, sentence, rows, try-a-change — and "you" stays you', () => {
    const a = run(YOU_STOPPED, [57, 58, 59]);
    expect(a.askedAbout).toBe('partner');
    const verdictWords = { yes: 'Yes — your partner could stop at 58', close: 'Close — your partner stopping at 58 is tight', no: 'Your partner could not stop at 58 on these figures' };
    expect(a.sentences.head.text).toBe(verdictWords[a.shown.verdict]);
    expect(a.sentences.line.text).toBe(`With you already stopped, your partner stopping at 58, and spending £2,500 a month between you, the money lasted until the younger of you was 95 ${count(a.shown.lasted)}.`);
    expect(a.sentences.chart.map((s) => s.text.slice(0, 29))).toEqual(['Your partner stopping at 57, ', 'Your partner stopping at 58, ', 'Your partner stopping at 59, ']);
    expect(a.sentences.change.text).toMatch(/^Now: (yes|close|not) at 58 for your partner, /);
    expect(a.sentences.oneMore.text).toMatch(/^Your partner working until 59 instead of 58 /);
    expect(a.assumed.find((x) => x.id === 'stop-age')).toMatchObject({ field: 'partner.stop.age', value: 58, text: 'Your partner stops at 58, and nothing more goes into their pension from then.' });
    expect(a.assumed.find((x) => x.id === 'you-already')).toMatchObject({ field: 'stop.kind', value: 'already' });
    expect(a.assumed.find((x) => x.id === 'pay-in-partner').text).toBe("£600 a month goes into your partner's pension until they stop at 58, going up with prices.");
    for (const id of ['no-part-time', 'work-tax', 'pay-in']) expect(ids(a.assumed)).not.toContain(id);
    // the rows are your partner's stops; each row's ages are each person's own
    expect(a.ages.map((r) => r.ages)).toEqual([{ you: 61, partner: 57 }, { you: 61, partner: 58 }, { you: 61, partner: 59 }]);
  });

  it('"show me ages" for your partner: the earliest age they could stop', () => {
    const a = run({ ...YOU_STOPPED, partner: { ...YOU_STOPPED.partner, stop: { kind: 'ages' } }, spend: { kind: 'amount', amount: 1800 } });
    expect(a.askedAbout).toBe('partner');
    if (a.headline.kind === 'earliest') {
      expect(a.sentences.head.text).toBe(`Your partner could stop at ${a.earliest.yes} on these figures`);
      expect(a.sentences.line.text).toMatch(/^The earliest age your partner could stop at, with £1,800 a month lasting to 95 in 9 futures out of 10, is \d+\./);
    }
  });

  it('a bad case that leans on the pay: the stopped partner\'s cash runs out and their pension is closed — said with the age', () => {
    // your partner stopped at 53 with a pension they cannot touch until 57 and little cash; you stop at 60
    const a = run({ household: 'couple', you: { age: 57, pot: 400000, payIn: { kind: 'total', total: 800 } }, partner: { age: 53, pot: 200000, stop: { kind: 'already' } },
      savings: 10000, stop: { kind: 'age', age: 60 }, spend: { kind: 'amount', amount: 3000 } }, [60]);
    expect(a.apart.coverUsed).toEqual({ who: 'partner', fromAge: expect.any(Number) });
    const w = a.warnings.find((x) => x.id === 'apart-cover-used');
    expect(w.severity).toBe('important');
    expect(w.text).toBe(`In a bad case (the worst 1 in 10), your partner's money cannot pay its half from when they are ${a.apart.coverUsed.fromAge}, so your pay would need to cover all of what you spend until you stop at 60.`);
    expect(a.sentences.pays[0].text).toContain("Your partner's pension can't be touched until then.");
  });

  it('money moved into drawdown before 6 April 2028 at 55 or 56: one line, for the person it touches (section 12)', () => {
    const a = run({ ...PARTNER_STOPPED, partner: { ...PARTNER_STOPPED.partner, age: 55 } }, [58]);
    expect(a.warnings.find((x) => x.id === 'drawdown-2028').text).toBe('For your partner: move into drawdown what they will need before 57 by 5 April 2028: after that, nothing new can be taken until they are 57.');
    // 56 today is 57 by then: not touched
    expect(ids(run({ ...PARTNER_STOPPED, partner: { ...PARTNER_STOPPED.partner, age: 56 } }, [58]).warnings)).not.toContain('drawdown-2028');
  });

  it('the tax-free part already had: said, and that pension is then taxed in full', () => {
    const a = run({ ...YOU_STOPPED, you: { ...YOU_STOPPED.you, taxFreeTaken: true } }, [58]);
    expect(a.assumed.find((x) => x.id === 'tax-free-taken')).toMatchObject({ field: 'you.taxFreeTaken', source: 'entered', value: true,
      text: 'You have already had the tax-free part of your pension, so everything taken from it is taxed.' });
    expect(ids(a.assumed)).toContain('quarter-tax-free');          // your partner's pension still has its quarter
  });

  it('one stop for both: none of these words, and the same-year lines as before', () => {
    const a = run({ ...PARTNER_STOPPED, partner: { age: 54, pot: 200000 } }, [58]);
    expect(a.apart).toBeUndefined();
    expect(ids(a.assumed)).toContain('stop-together');
    for (const id of ['stop-apart', 'stop-apart-cover', 'partner-already', 'savings-first', 'pay-keeps-pensions']) expect(ids(a.assumed)).not.toContain(id);
    for (const id of ['apart-cover-used', 'drawdown-2028']) expect(ids(a.warnings)).not.toContain(id);
    expect(ids(a.sentences.pays)).not.toContain('a.pays.apart');
    expect(a.sentences.head.id).toBe(a.shown.verdict === 'yes' ? 'a.head.couple' : `a.head.${a.shown.verdict}`);
    expect(money(a.spend.perMonth)).toBe('£2,500');
  });
});
