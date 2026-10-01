/**
 * The reviewers' findings on A, B and C after "still paying in" and one test everywhere were joined (1 Oct 2026), each
 * with its test, written before the fix. Answers only (the screens' side is tests/v7/screens/reviewRound3.test.js).
 *
 *   R1  A's every-age step for "show me ages" when the earliest age that works is under 50: no crash; the shown row is a row
 *   R2  C from an age before the pension opens, when the years until it opens set the amount: words of their own, with the
 *       steady amount from then and the amount starting when the pension opens (never "About £180 a month" alone); the
 *       start refused, per person (the partner's pension too), when no pension is open then and there are no savings;
 *       A's and B's hand-over to C says the same; no "pot used up" when the pot is untouched
 *   R3  a bad case that runs out while the pension is still closed: no "After that … State Pension" (C and A); C says the
 *       savings ran out before the pension could be touched
 *   R4  A with an age named: the true first later age that works (B's stop-later, A's own "show me ages"), even 3 or 4
 *       years on, or past the State Pension age
 *   R5  B's number is a guide: the bad-case pot is never weighed against it ("£133,000 short of it"), and a sentence says why
 *   R6  C's first form, still paying in, start left alone: from the State Pension age, not "now"
 *   R7  C's April 2028 note only for a pension closed at the start (or opening on it), never for a partner open long before
 *   R8  A's "after it runs out" names the run-out age, so it never reads as after the stop-later age
 *   R10 85% to under 90% is "just under 9" in C and B too, never "in 9 futures out of 10"
 *   R11 C's take at or below the careful amount: "in a bad case it still lasts to 95"
 *   R12 C warns of the yearly limit on what goes in, as A and B do
 *   R13 C counts paying in until 75 at most: a start past it, still paying in, is refused (the partner's too)
 *   R14 C "now" for someone under the pension age who is still paying in: from the day it opens, with the pay-in counted
 *   R16 a partner past their State Pension age: A's headline does not have them "both stop … (your partner 75)"; A, B and
 *       C say their money is left alone until then
 *   R18 what the futures are made of: US share returns and price rises since 1871, cut by 1.5% a year for world shares
 */
import { describe, it, expect } from 'vitest';
import { answerA } from '../a/_a.js';
import { answerB } from '../b/_b.js';
import { answerC, SCHEMA_C } from '../c/_c.js';
import { lastedText, underNine, outOfTen } from '../../../src/answers/shared/format.js';
import { parseDraft } from '../../../src/answers/shared/validate.js';
import { handOverToC } from '../../../src/answers/shared/schemaParts.js';

const TODAY = '2026-09-30';
const ENV = { today: TODAY, futures: 40, seed: 0, trace: false };
const texts = (r) => [...Object.values(r.sentences || {}).flatMap((s) => (Array.isArray(s) ? s : s && s.parts ? [s] : Object.values(s || {}))), ...(r.assumed || []), ...(r.warnings || [])]
  .filter((s) => s && typeof s.text === 'string').map((s) => s.text);
const warning = (r, id) => (r.warnings || []).find((w) => w.id === id);
const ids = (r) => (r.warnings || []).map((w) => w.id);

describe('R1 — A\'s every-age step, "show me ages", the earliest age under 50', () => {
  const persona = { you: { age: 38, pot: 150000, payIn: { kind: 'split', own: 500, employer: 300 } }, savings: 500000, stop: { kind: 'ages' }, spend: { kind: 'amount', amount: 2000 } };

  it('the 38-year-old with £500,000 of savings: the every-age step answers, and shows the earliest age as a row', () => {
    const chart = answerA(persona, { ...ENV, detail: 'chart' });
    expect(chart.earliest.yes).toBeLessThan(50);
    let all;
    expect(() => { all = answerA(persona, { ...ENV, detail: 'all' }); }).not.toThrow();
    expect(all.status).toBe('ok');
    expect(all.earliest.yes).toBe(chart.earliest.yes);
    expect(all.shown.age).toBe(chart.earliest.yes);
    expect(all.ages.map((r) => r.age)).toContain(all.shown.age);
    expect(all.sentences.agesNote.text).toContain(`apart from your age today and ${all.earliest.yes}, the earliest that worked`);
  });

  it.each([[36, 600000, 1800], [40, 400000, 2200], [44, 300000, 1500], [47, 250000, 2600]])('X4: "show me ages" at every detail, %i with £%i of savings: the shown row is a row', (age, savings, spend) => {
    const ins = { ...persona, you: { ...persona.you, age }, savings, spend: { kind: 'amount', amount: spend } };
    for (const detail of ['chart', 'all']) {
      const a = answerA(ins, { ...ENV, detail });
      expect(a.status, detail).toBe('ok');
      expect(a.ages.map((r) => r.age), detail).toContain(a.shown.age);
      expect(a.ages.find((r) => r.age === a.shown.age)).toEqual(a.shown);
    }
  });
});

describe('R2 — C from an age before the pension opens', () => {
  it('50, £300,000, £5,000 of savings, from 55: the closed years set the amount — said in words, with the amount from 57', () => {
    const c = answerC({ you: { age: 50, pot: 300000 }, savings: 5000, start: { kind: 'age', age: 55 } }, ENV);
    expect(c.status).toBe('ok');
    expect(c.closedYears).toMatchObject({ from: 55, until: 57, who: ['you'], careful: c.monthly.careful });
    // the amount starting when the pension opens is C's own answer from that age
    const at57 = answerC({ you: { age: 50, pot: 300000 }, savings: 5000, start: { kind: 'age', age: 57 } }, ENV);
    expect(c.closedYears.instead.monthly).toEqual(at57.monthly);
    expect(c.sentences.none.id).toBe('c.none.closed');
    expect(c.sentences.none.text).toMatch(/^You can't take money from your pension until you are 57\. Until then only your savings can pay, so a steady amount from 55 could be only about £\d+ a month\. Starting at 57 instead, you could have about £[\d,]+ a month after tax until you are 95, going up each year with prices\.$/);
    // the untouched pot is not "used up by 67"; the pension-locked warning would only repeat the sentence
    expect(ids(c)).not.toContain('pot-used-before-state-pension');
    expect(ids(c)).not.toContain('pension-locked');
  });

  it('54 with £1 of savings, from 56 (after the 2028 rise): never "About £0 a month … in every future we tried" on its own', () => {
    const c = answerC({ you: { age: 54, pot: 300000 }, savings: 1, start: { kind: 'age', age: 56 } }, ENV);
    expect(c.closedYears).toBeTruthy();
    expect(c.sentences.none.text).toContain('Until then only your savings can pay, and that is not enough for a steady amount from 56.');
    expect(c.sentences.none.text).toMatch(/Starting at 57 instead, you could have about £[\d,]+ a month/);
  });

  it('with savings that carry the years until it opens, the answer from that age stands (no closed-years words)', () => {
    const c = answerC({ you: { age: 50, pot: 300000 }, savings: 50000, start: { kind: 'age', age: 55 } }, ENV);
    expect(c.closedYears).toBeUndefined();
    expect(c.sentences.none).toBeUndefined();
  });

  it('a couple whose only pension is the partner\'s, closed at the start, with no savings: refused, per person', () => {
    const couple = { household: 'couple', you: { age: 50, pot: 0 }, partner: { age: 50, pot: 300000 }, savings: 0, start: { kind: 'age', age: 55 } };
    expect(answerC(couple, ENV).problems).toEqual([{ field: 'start.age', messageId: 'start-not-before-access' }]);
    const later = { household: 'couple', you: { age: 60, pot: 0 }, partner: { age: 50, pot: 300000 }, savings: 0, start: { kind: 'age', age: 62 } };
    expect(answerC(later, ENV).problems).toEqual([{ field: 'start.age', messageId: 'start-not-before-access' }]);
    // the form says when the first pension opens, in your years (the partner's at 57 is yours at 67)
    expect(parseDraft(SCHEMA_C, { household: 'couple', 'you.pot': '0', 'you.age': '60', 'partner.age': '50', 'partner.pot': '300,000', 'start.kind': 'age', 'start.age': '62' }, ENV).errors)
      .toEqual({ 'start.age': 'start-not-before-access' });
    // a pension of yours open at the start: the start stands, and the closed years are said in words
    const open = answerC({ ...later, you: { age: 60, pot: 100000 } }, ENV);
    expect(open.status).toBe('ok');
    expect(open.closedYears).toMatchObject({ until: 67, who: ['partner'], partnerUntil: 57 });
    expect(open.sentences.none.text).toMatch(/^Your partner can't take money from their pension until they are 57, when you are 67\. Until then only your pot can pay/);
  });

  it('A\'s and B\'s hand-over to C works by the same rule, person by person', () => {
    const couple = { household: 'couple', you: { age: 50, pot: 0, payIn: { kind: 'total', total: 0 } }, partner: { age: 50, pot: 300000, payIn: { kind: 'total', total: 0 } }, savings: 0 };
    expect(handOverToC(couple, 55, TODAY).ok).toBe(false);
    expect(handOverToC({ ...couple, savings: 20000 }, 55, TODAY).ok).toBe(true);
    expect(handOverToC({ ...couple, you: { ...couple.you, age: 58, pot: 100000 } }, 60, TODAY).ok).toBe(true);
    const a = answerA({ ...couple, stop: { kind: 'age', age: 55 }, spend: { kind: 'amount', amount: 1500 } }, ENV);
    expect(a.handOver.c.ok).toBe(false);
    // what goes in makes yours a pension too — but it is closed at 55 as well, and there are no savings: C would refuse it
    const b = answerB({ ...couple, you: { ...couple.you, payIn: { kind: 'total', total: 500 } }, stop: { age: 55 }, spend: { kind: 'amount', amount: 1500 } }, ENV);
    expect(b.handOver.c.ok).toBe(false);
    const bOpen = answerB({ ...couple, you: { ...couple.you, age: 58, pot: 100000, payIn: { kind: 'total', total: 500 } }, stop: { age: 60 }, spend: { kind: 'amount', amount: 1500 } }, ENV);
    expect(bOpen.handOver.c.ok).toBe(true);
  });
});

describe('R3 — a bad case that runs out while the pension is closed', () => {
  const given = { you: { age: 50, pot: 300000 }, savings: 50000 };

  it('C: no "After that … State Pension"; the savings-run-short warning says what ran out, and when the pension opens', () => {
    const c = answerC({ ...given, start: { kind: 'age', age: 55 } }, ENV);
    expect(c.runOutAge.middling).toBeLessThan(57);
    expect(c.sentences.bad.text).not.toContain('After that');
    expect(warning(c, 'savings-run-short').text).toMatch(/^In a bad case \(the worst 1 in 10\), taking £[\d,]+ a month, your savings run out at 5[56], before you can touch your pension at 57\.$/);
    // …and, with a take that runs out then, for that take
    const t = answerC({ ...given, start: { kind: 'age', age: 55 }, take: c.monthly.middling }, ENV);
    expect(warning(t, 'savings-run-short').text).toContain(`taking £${c.monthly.middling.toLocaleString('en-GB')} a month`);
  });

  it('A: no a.after when the bad case runs out before a pension opens; the savings-run-short warning stands', () => {
    const c = answerC({ ...given, start: { kind: 'age', age: 55 } }, ENV);
    const a = answerA({ ...given, you: { ...given.you, payIn: { kind: 'total', total: 0 } }, stop: { kind: 'age', age: 55 }, spend: { kind: 'amount', amount: c.monthly.middling } }, ENV);
    expect(a.shown.verdict).not.toBe('yes');
    expect(a.shown.runOutAge).toBeLessThan(57);
    expect(a.sentences.after).toBeUndefined();
    expect(warning(a, 'savings-run-short')).toBeDefined();
  });
});

describe('R4 — A with an age named: the true first later age that works', () => {
  // (40 futures; each named age is not a yes) — the earliest is 1, 2, 3, 12 and 13 years on, two of them past the State
  // Pension age of 68 (45 today) or 67
  const CASES = [
    ['55, £275,000, £800 in, stop 62, £2,000', { you: { age: 55, pot: 275000, payIn: { kind: 'split', own: 500, employer: 300 } }, stop: 62, spend: 2000 }],
    ['55, £275,000, £800 in, stop 67, £2,500', { you: { age: 55, pot: 275000, payIn: { kind: 'total', total: 800 } }, stop: 67, spend: 2500 }],
    ['45, £120,000, £650 in, stop 70, £2,500 (three years on)', { you: { age: 45, pot: 120000, payIn: { kind: 'split', own: 400, employer: 250 } }, stop: 70, spend: 2500 }],
    ['45, £120,000, £650 in, stop 60, £2,500 (past the State Pension age)', { you: { age: 45, pot: 120000, payIn: { kind: 'split', own: 400, employer: 250 } }, stop: 60, spend: 2500 }],
    ['52, £220,000, £700 in, £80,000 savings, stop 55, £2,500', { you: { age: 52, pot: 220000, payIn: { kind: 'total', total: 700 } }, savings: 80000, stop: 55, spend: 2500 }]
  ];
  it.each(CASES)('%s: A(named X).instead = A("show me ages").earliest = B(X).stopLater', (_n, x) => {
    const base = { you: x.you, savings: x.savings || 0, spend: { kind: 'amount', amount: x.spend } };
    const named = answerA({ ...base, stop: { kind: 'age', age: x.stop } }, ENV);
    const ages = answerA({ ...base, stop: { kind: 'ages' } }, ENV);
    const b = answerB({ ...base, stop: { age: x.stop } }, ENV);
    expect(named.shown.verdict).not.toBe('yes');
    expect(ages.earliest.yes).toBeGreaterThan(x.stop);
    expect(named.earliest.yes).toBe(ages.earliest.yes);
    expect(b.levers.stopLater && b.levers.stopLater.age).toBe(ages.earliest.yes);
    // the row is there, and the words name it
    expect(named.ages.find((r) => r.age === named.earliest.yes).verdict).toBe('yes');
    expect(named.sentences.bad.text).toContain(`Stopping at ${named.earliest.yes} instead lasted in 9 futures out of 10.`);
  });
  it('at least one of them is 3 or 4 years on, and one past the State Pension age', () => {
    const gaps = CASES.map(([, x]) => answerA({ you: x.you, savings: x.savings || 0, spend: { kind: 'amount', amount: x.spend }, stop: { kind: 'age', age: x.stop } }, ENV).earliest.yes - x.stop);
    expect(gaps.some((g) => g === 3 || g === 4)).toBe(true);
    expect(gaps.some((g) => g > 8)).toBe(true);
  });
  it('no age to 75 works: the warning says so of every age from the first row', () => {
    const a = answerA({ you: { age: 50, pot: 50000, payIn: { kind: 'total', total: 0 } }, stop: { kind: 'age', age: 60 }, spend: { kind: 'amount', amount: 6000 } }, ENV);
    expect(a.earliest.yes).toBeNull();
    expect(warning(a, 'not-in-range').text).toBe('No age from 58 to 75 lasted in 9 futures out of 10 at £6,000 a month.');
  });
});

describe('R5 — B\'s number is a guide, never a second verdict', () => {
  const owner = { you: { age: 55, pot: 275000, payIn: { kind: 'split', own: 500, employer: 300 } }, stop: { age: 62 }, spend: { kind: 'amount', amount: 2000 } };
  it('the bad-case pot is said as it is, and a sentence says why the pay-in, not the number, is the answer', () => {
    const b = answerB(owner, ENV);
    expect(b.onCourse).toBe(false);
    for (const t of texts(b)) expect(t).not.toMatch(/short of it|enough in the pension/);
    expect(b.sentences.bad.text).toMatch(/^In a bad case \(the worst 1 in 10\), £800 a month as now gets your pension to about £[\d,]+ by 62\./);
    expect(b.sentences.guide.text).toBe('The pot is a guide. A bad case while you are saving and a bad case once you have stopped are rarely the same future, so what you pay in is tried on each whole future, from now until you are 95, and that is the answer.');
    // on course after paying in what it says: the guide sentence is there too, where the bad-case pot falls below the number
    const paying = answerB({ ...owner, you: { ...owner.you, payIn: { kind: 'total', total: b.payIn.needed } } }, ENV);
    expect(paying.onCourse).toBe(true);
    expect(paying.potAtStop.now.careful).toBeLessThan(paying.number.careful);
    expect(paying.sentences.guide).toBeDefined();
  });
});

describe('R6 — C\'s first form, still paying in, the start left alone', () => {
  it('55, £275,000, £500 + £300: from 67 (the State Pension age), not "now" — the owner\'s figure, with the pay-in counted', () => {
    const d = parseDraft(SCHEMA_C, { 'you.pot': '275,000', 'you.age': '55', 'you.payIn.has': 'yes', 'you.payIn.own': '500', 'you.payIn.employer': '300' }, ENV);
    expect(d.ok).toBe(true);
    expect(d.inputs.start).toEqual({ kind: 'age', age: 67 });
    const fromDefault = answerC(d.inputs, ENV);
    const typed = answerC({ ...d.inputs, start: { kind: 'age', age: 67 } }, ENV);
    expect(fromDefault.monthly).toEqual(typed.monthly);
    expect(fromDefault.sentences.payIn.text).toBe('Paying in £800 a month until 67, rising with prices; the pot invested at Balanced, about half in shares, until then.');
    expect(ids(fromDefault)).not.toContain('pay-in-unused');
  });
});

describe('R7 — the April 2028 note only for someone it touches at the start', () => {
  it('a couple, you 55 and your partner 53, the money from 67: no "your partner can\'t take money until 57"', () => {
    const c = answerC({ household: 'couple', you: { age: 55, pot: 275000, payIn: { has: 'yes', own: 500, employer: 300 } }, partner: { age: 53, pot: 90000, payIn: { has: 'yes', own: 100, employer: 100 } }, start: { kind: 'age', age: 67 } }, ENV);
    expect(c.status).toBe('ok');
    expect(ids(c)).not.toContain('pension-locked-partner');
    expect(ids(c)).not.toContain('pension-locked');
  });
});

describe('R8 — A\'s "after it runs out" names the run-out age', () => {
  it('stop 60 on £1,800 (55, £275,000, £800 in): the sentence after the stop-later one cannot be read as "after stopping at 62"', () => {
    const a = answerA({ you: { age: 55, pot: 275000, payIn: { kind: 'total', total: 800 } }, stop: { kind: 'age', age: 60 }, spend: { kind: 'amount', amount: 2100 } }, ENV);
    expect(a.shown.verdict).not.toBe('yes');
    expect(a.sentences.after.text).toMatch(new RegExp(`^After it runs out at ${a.shown.runOutAge}, you would have £1,046 a month from your State Pension( once it starts at 67)?\\.$`));
  });
});

describe('R10 — 85% to under 90% is "just under 9" everywhere', () => {
  it('the formatter', () => {
    expect(lastedText(0.875)).toBe('in just under 9 futures out of 10');
    expect(lastedText(0.85)).toBe('in just under 9 futures out of 10');
    expect(lastedText(0.9)).toBe('in 9 futures out of 10');
    expect(lastedText(0.95)).toBe(outOfTen(0.95).words);
    for (let k = 0; k <= 1000; k++) {
      const share = k / 1000;
      if (share < 0.9) expect(lastedText(share), String(share)).not.toBe('in 9 futures out of 10');
      expect(underNine(share)).toBe(share >= 0.85 && share < 0.9);
    }
  });
  it('B at 87.5% (55, £275,000, £800 in, stop 67, £2,500): not on course, and nothing says "in 9 futures out of 10" of that count', () => {
    const b = answerB({ you: { age: 55, pot: 275000, payIn: { kind: 'total', total: 800 } }, stop: { age: 67 }, spend: { kind: 'amount', amount: 2500 } }, ENV);
    expect(b.chance.lasted).toBe(0.875);
    expect(b.onCourse).toBe(false);
    for (const s of [b.sentences.change, b.sentences.wholeLife, b.sentences.lever.accept]) {
      expect(s.text, s.id).toContain('in just under 9 futures out of 10');
      expect(s.text, s.id).not.toMatch(/your money lasted in 9 futures out of 10|, lasted in 9 futures out of 10/);
    }
    expect(b.sentences.change.text).toBe('Now: not on course for 67, lasted in just under 9 futures out of 10.');
  });
  it('C\'s take at 87.5% (58, £250,000, taking £1,390): "just under 9"', () => {
    const c = answerC({ you: { age: 58, pot: 250000 }, take: 1390 }, ENV);
    expect(c.take.lasted).toBe(0.875);
    expect(c.sentences.take.text).toContain('the money lasted to 95 in just under 9 futures out of 10.');
  });
});

describe('R11 — C\'s take at or below the careful amount still lasts in a bad case', () => {
  it('at and below the careful amount: "In a bad case (the worst 1 in 10) it still lasts to 95"', () => {
    const base = answerC({ you: { age: 58, pot: 250000 } }, ENV);
    for (const take of [base.monthly.careful, base.monthly.careful - 80]) {
      const c = answerC({ you: { age: 58, pot: 250000 }, take }, ENV);
      expect(c.take.runOutAge).toBe(95);
      expect(c.sentences.take.text).toMatch(/In a bad case \(the worst 1 in 10\) it still lasts to 95\.$/);
      expect(c.sentences.take.text).not.toContain('would run out');
    }
  });
});

describe('R12 — C warns of the yearly limit on what goes in', () => {
  it('£6,000 + £4,000 a month: the annual-allowance warning, A\'s words; £4,000 a month: none', () => {
    const c = answerC({ you: { age: 50, pot: 100000, payIn: { has: 'yes', own: 6000, employer: 4000 } }, start: { kind: 'age', age: 60 } }, ENV);
    expect(warning(c, 'annual-allowance').text).toBe('The most that can go into your pensions in a year with the tax the government adds back is £60,000 (less for the highest earners). £10,000 a month is more than that.');
    const a = answerA({ you: { age: 50, pot: 100000, payIn: { kind: 'split', own: 6000, employer: 4000 } }, stop: { kind: 'age', age: 60 }, spend: { kind: 'amount', amount: 2000 } }, ENV);
    expect(warning(a, 'annual-allowance').text).toBe(warning(c, 'annual-allowance').text);
    const under = answerC({ you: { age: 50, pot: 100000, payIn: { has: 'yes', own: 3000, employer: 1000 } }, start: { kind: 'age', age: 60 } }, ENV);
    expect(warning(under, 'annual-allowance')).toBeUndefined();
    const partner = answerC({ household: 'couple', you: { age: 50, pot: 100000 }, partner: { age: 50, pot: 0, payIn: { has: 'yes', own: 6000, employer: 0 } }, start: { kind: 'age', age: 60 } }, ENV);
    expect(warning(partner, 'annual-allowance-partner').text).toContain("into your partner's pensions");
  });
});

describe('R13 — C counts paying in until 75 at most', () => {
  it('74, paying in, from 85: refused on the start age; from 75: fine; not paying in, from 85: fine', () => {
    expect(answerC({ you: { age: 74, pot: 100000, payIn: { has: 'yes', own: 1000, employer: 0 } }, start: { kind: 'age', age: 85 } }, ENV).problems)
      .toEqual([{ field: 'start.age', messageId: 'pay-in-past-75' }]);
    expect(answerC({ you: { age: 74, pot: 100000, payIn: { has: 'yes', own: 1000, employer: 0 } }, start: { kind: 'age', age: 75 } }, ENV).status).toBe('ok');
    expect(answerC({ you: { age: 74, pot: 100000 }, start: { kind: 'age', age: 85 } }, ENV).status).toBe('ok');
  });
  it('a partner of 72 paying in, the money when you are 62 (your partner 84): refused for them', () => {
    expect(answerC({ household: 'couple', you: { age: 50, pot: 200000 }, partner: { age: 72, pot: 50000, payIn: { has: 'yes', own: 1000, employer: 0 } }, start: { kind: 'age', age: 62 } }, ENV).problems)
      .toEqual([{ field: 'start.age', messageId: 'pay-in-past-75-partner' }]);
  });
  it('A and B hand over to C only when C would take it', () => {
    const couple = { household: 'couple', you: { age: 50, pot: 200000, payIn: { kind: 'total', total: 500 } }, partner: { age: 72, pot: 50000, payIn: { kind: 'total', total: 1000 } }, savings: 0 };
    expect(handOverToC(couple, 62, TODAY).ok).toBe(false);
    expect(handOverToC(couple, 53, TODAY).ok).toBe(true);
  });
});

describe('R14 — C "now" for someone under the pension age who is still paying in', () => {
  it('50, £100,000, £500 + £300, now: from 57, the pay-in and the growth counted — C from 57 to the pound', () => {
    const given = { you: { age: 50, pot: 100000, payIn: { has: 'yes', own: 500, employer: 300 } } };
    const now = answerC({ ...given, start: { kind: 'now' } }, ENV);
    const at57 = answerC({ ...given, start: { kind: 'age', age: 57 } }, ENV);
    expect(now.basis.startAge).toBe(57);
    expect(now.monthly).toEqual(at57.monthly);
    expect(now.basis.yearsSaving).toBe(7);
    expect(ids(now)).not.toContain('pay-in-unused');
    expect(warning(now, 'pension-locked').text).toBe("You can't take money from your pension until you are 57 (April 2028 rules). These figures start from then.");
    expect(now.sentences.payIn.text).toBe('Paying in £800 a month until 57, rising with prices; the pot invested at Balanced, about half in shares, until then.');
    // nothing going in: "now" is C from now, as it always was (the start moved, the pot taken as it stands)
    const plain = answerC({ you: { age: 50, pot: 100000 }, start: { kind: 'now' } }, ENV);
    expect(plain.saving).toBeUndefined();
    expect(plain.basis.startMoved === undefined || plain.basis.start === '2033-09').toBe(true);
  });
});

describe('R16 — a partner past their State Pension age', () => {
  const couple = { household: 'couple', you: { age: 58, pot: 200000, payIn: { kind: 'total', total: 800 } }, partner: { age: 68, pot: 150000 } };
  it('A: "Yes — you could stop at 65", never "you could both stop … (your partner 75)"; the note says what is assumed', () => {
    const a = answerA({ ...couple, stop: { kind: 'age', age: 65 }, spend: { kind: 'amount', amount: 2000 } }, ENV);
    expect(a.shown.verdict).toBe('yes');
    expect(a.sentences.head.text).toBe('Yes — you could stop at 65');
    expect(warning(a, 'partner-stops-with-you').text).toBe('Your partner is past their State Pension age. These figures leave their money alone until you stop at 65, and do not count anything they take before then.');
    expect(a.assumed.find((x) => x.id === 'stop-together').text).toBe("Your partner's money is left alone until you stop at 65, then drawn on with yours.");
  });
  it('B and C say the same', () => {
    const b = answerB({ ...couple, stop: { age: 65 }, spend: { kind: 'amount', amount: 2500 } }, ENV);
    expect(warning(b, 'partner-stops-with-you')).toBeDefined();
    expect(b.assumed.find((x) => x.id === 'stop-together').text).not.toContain('stops working');
    const c = answerC({ household: 'couple', you: { age: 58, pot: 200000, payIn: { has: 'yes', own: 800, employer: 0 } }, partner: { age: 68, pot: 150000 }, start: { kind: 'age', age: 65 } }, ENV);
    expect(warning(c, 'partner-stops-with-you').text).toBe('Your partner is past their State Pension age. These figures leave their pot alone until the money starts when you are 65, and do not count anything they take before then.');
  });
  it('a younger partner, or the money from now: no such note', () => {
    const a = answerA({ ...couple, partner: { age: 56, pot: 150000 }, stop: { kind: 'age', age: 65 }, spend: { kind: 'amount', amount: 2000 } }, ENV);
    expect(warning(a, 'partner-stops-with-you')).toBeUndefined();
    const c = answerC({ household: 'couple', you: { age: 66, pot: 200000 }, partner: { age: 68, pot: 150000 } }, ENV);
    expect(warning(c, 'partner-stops-with-you')).toBeUndefined();
  });
});

describe('R18 — what the futures are made of, said', () => {
  it('C, A and B: US share returns and price rises since 1871, cut by 1.5% a year to stand for world shares', () => {
    const want = /^Tested against 40 possible futures, each pieced together from stretches of US share returns and US price rises since 1871\. Share returns are cut by 1\.5% a year to stand for shares around the world; bonds and cash are worked out from each future's markets\.$/;
    const c = answerC({ you: { age: 58, pot: 250000 } }, ENV);
    const a = answerA({ you: { age: 55, pot: 275000, payIn: { kind: 'total', total: 800 } }, stop: { kind: 'age', age: 62 }, spend: { kind: 'amount', amount: 2000 } }, ENV);
    const b = answerB({ you: { age: 55, pot: 275000, payIn: { kind: 'total', total: 800 } }, stop: { age: 62 }, spend: { kind: 'amount', amount: 2000 } }, ENV);
    for (const r of [c, a, b]) expect(r.assumed.find((x) => x.id === 'futures').text).toMatch(want);
  });
});
