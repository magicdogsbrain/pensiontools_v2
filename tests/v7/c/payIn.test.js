/**
 * C's "still paying in" (step 4 brief section 10, J8; the owner's report, 1 Oct 2026: "tried a 55 year old testing how
 * much monthly income 275k pot would produce at 67. But there is no way to add ongoing pension contributions … This is
 * the most likely situation!").
 *
 *   1  the owner's case end to end: £500 + £300 a month going in until 67 raises what it pays from 67, the headline is
 *      the monthly figure from 67, and the answer says plainly what it assumed ("Paying in £800 a month until 67, rising
 *      with prices; the pot invested at Balanced …")
 *   2  the money going in is the saving years' kernel: the pot at 67 in the bad-case life, worked out again month by
 *      month from the trace, is the answer's bad-case pot; nothing goes in from 67
 *   3  a couple: each person's pay-in into their own pension, both "stop" at the start (as A has it)
 *   4  more going in never pays less; one figure (a hand-over's "total") is the same as own + employer adding to it
 *   5  from now nothing more goes in, and a note says what was typed is not counted
 */
import { describe, it, expect } from 'vitest';
import { answerC, TEST_ENV } from './_c.js';
import { checkAnswer } from './invariants.js';
import { checkTrace, recomputeSaving } from '../oracles/fromTrace.mjs';

const ENV = { ...TEST_ENV, futures: 40 };
const ok = (a, given) => { const f = checkAnswer(a, given); expect(f, f.join('\n')).toEqual([]); return a; };
const OWNER = { you: { pot: 275000, age: 55, payIn: { has: 'yes', own: 500, employer: 300 } }, start: { kind: 'age', age: 67 } };
const texts = (a) => [...Object.values(a.sentences).flatMap((s) => (Array.isArray(s) ? s : [s])), ...a.assumed, ...a.warnings].map((s) => s.text);

describe('1 the owner\'s 55-year-old: £275,000, £500 + £300 a month, the money from 67', () => {
  const a = ok(answerC(OWNER, { ...ENV, trace: true }), OWNER);
  const none = ok(answerC({ ...OWNER, you: { pot: 275000, age: 55 } }, ENV));

  it('is answered on the lives: twelve years of paying in, then the money from 67', () => {
    expect(a.status).toBe('ok');
    expect(a.basis.yearsSaving).toBe(12);
    expect(a.basis.startAge).toBe(67);
    expect(a.phases[0].fromAge).toBe(67);
    expect(a.payIn).toEqual({ total: 800, byPerson: [{ who: 'you', total: 800 }] });
    expect(a.saving[0]).toMatchObject({ who: 'you', stopAge: 67, yearsSaving: 12, payIn: { total: 800, own: 500, employer: 300, savings: 0 }, paidIn: { total: 800 * 12 * 12 } });
  });

  it('the headline is the monthly figure from 67, and paying in raises it', () => {
    expect(a.sentences.head.text).toBe(`About £${a.monthly.careful.toLocaleString('en-GB')} a month`);
    expect(a.sentences.sub.text).toBe('after tax, from age 67 until you are 95, going up each year with prices');
    expect(a.monthly.careful).toBeGreaterThan(none.monthly.careful);
    expect(a.potAtStart.middling).toBeGreaterThan(none.potAtStart.middling);
  });

  it('says plainly what it assumed: what goes in, until when, rising with prices, and the pot invested meanwhile', () => {
    expect(a.sentences.payIn.text).toBe('Paying in £800 a month until 67, rising with prices; the pot invested at Balanced, about half in shares, until then.');
    expect(a.sentences.line.text).toMatch(/^With a pot of £275,000 today, £800 a month going in until 67 and your State Pension, you could have about £[\d,]+ a month after tax, from age 67 until you are 95\. That amount lasted in 9 futures out of 10\.$/);
    expect(a.sentences.pot.text).toMatch(/^By 67 your pot could be about £[\d,]+\. In a bad case \(the worst 1 in 10\) it would be £[\d,]+, and in a good case \(the best 1 in 10\) £[\d,]+\.$/);
    const ids = a.assumed.map((x) => x.id);
    for (const id of ['pay-in', 'pay-in-as-given', 'pot-invested', 'charge-saving', 'same-futures']) expect(ids, id).toContain(id);
    expect(ids).not.toContain('pot-as-is');
    expect(a.warnings.map((w) => w.id)).not.toContain('start-later');
    for (const t of texts(a)) expect(t).not.toMatch(/leaves out any growth|stays at £275,000|contribution|tax relief/i);
  });

  it('a careful amount means the same as everywhere: it lasts in 9 lives out of 10, and £10 more does not', () => {
    expect(a.lasted.careful).toBeGreaterThanOrEqual(0.9);
    const more = answerC({ ...OWNER, take: a.monthly.careful + 10 }, ENV);
    expect(more.take.covered).toBe(false);
    const at = answerC({ ...OWNER, take: a.monthly.careful }, ENV);
    expect(at.take.covered).toBe(true);
    expect(at.take.lasted).toBe(a.lasted.careful);
  });

  it('the trace: the saving months add up, nothing goes in from 67, and the band is every life\'s most', () => {
    expect(checkTrace(a)).toEqual([]);
    const rows = a.trace.saving.atCareful.rows;
    expect(rows).toHaveLength(144);
    const r = recomputeSaving(rows, { payIn: { you: 800 }, stopAge: { you: 67 }, S: 12, priceAtStop: a.trace.saving.atCareful.priceAtStop, potAtStop: a.potAtStart.careful });
    expect(r.problems).toEqual([]);
    expect(Math.abs(r.potAtStop - a.potAtStart.careful)).toBeLessThanOrEqual(1);
  });
});

describe('3 a couple: each pays into their own pension; both stop at the start', () => {
  const couple = {
    household: 'couple', you: { pot: 220000, age: 54, payIn: { has: 'yes', own: 400, employer: 300 } },
    partner: { age: 52, pot: 90000, payIn: { has: 'yes', own: 200, employer: 150 } }, savings: 30000, start: { kind: 'age', age: 64 }
  };
  const a = ok(answerC(couple, { ...ENV, trace: true }), couple);

  it('two saving outcomes, each with their own pay-in, both stopping in the same year', () => {
    expect(a.saving.map((s) => [s.who, s.payIn.total, s.stopAge])).toEqual([['you', 700, 64], ['partner', 350, 62]]);
    expect(a.payIn.total).toBe(1050);
    expect(a.sentences.payIn.text).toBe('Paying in £1,050 a month between you until you are 64, rising with prices; the pots and savings invested at Balanced, about half in shares, until then.');
    expect(a.assumed.map((x) => x.id)).toEqual(expect.arrayContaining(['pay-in', 'pay-in-partner', 'both-stop-together']));
    expect(checkTrace(a)).toEqual([]);
  });
});

describe('4 more going in never pays less; one figure is own + employer', () => {
  // The nightly run, 1 Oct 2026 (C's M2 and M6): £5,000 + £5,001 came back "invalid" naming people.0.saving.payIn.total —
  // no box on the form — so the screen could only say it could not work it out. The form's own rule says it (J14).
  it('the two parts together are held to £10,000 a month, on the employer\'s box', () => {
    const over = answerC({ you: { pot: 0, age: 55, payIn: { has: 'yes', kind: 'split', own: 5000, employer: 5001 } }, start: { kind: 'age', age: 57 } }, ENV);
    expect(over.status).toBe('invalid');
    expect(over.problems).toEqual([{ field: 'you.payIn.employer', messageId: 'pay-in-over-limit' }]);
    const at = ok(answerC({ you: { pot: 0, age: 55, payIn: { has: 'yes', kind: 'split', own: 5000, employer: 5000 } }, start: { kind: 'age', age: 57 } }, ENV));
    expect(at.payIn.total).toBe(10000);
  });

  it('£800 as one figure (a hand-over brings it so) is £500 + £300', () => {
    const split = answerC(OWNER, ENV);
    const total = answerC({ ...OWNER, you: { ...OWNER.you, payIn: { has: 'yes', kind: 'total', total: 800 } } }, ENV);
    for (const k of ['monthly', 'lasted', 'runOutAge', 'potAtStart', 'phases']) expect(total[k], k).toEqual(split[k]);
  });

  it('more each month: no lower at any of the three', () => {
    let prev = null;
    for (const own of [0, 200, 500, 1500]) {
      const a = ok(answerC({ ...OWNER, you: { ...OWNER.you, payIn: { has: 'yes', own, employer: 300 } } }, ENV));
      if (prev) for (const k of ['careful', 'middling', 'good']) expect(a.monthly[k], `${own} ${k}`).toBeGreaterThanOrEqual(prev.monthly[k]);
      prev = a;
    }
  });

  // still paying in, "Start taking it" left alone: the State Pension age (the reviewers' finding, 1 Oct 2026 — the owner's
  // most likely person was answered "from now" with the pay-in left out), the age to change to the one they stop at
  it('a pot of nothing, paying in: the money starts at the State Pension age by default, and the pot is what went in', () => {
    const a = ok(answerC({ you: { pot: 0, age: 50, payIn: { has: 'yes', own: 300, employer: 200 } } }, ENV));
    expect(a.inputs.start).toEqual({ kind: 'age', age: 67 });
    expect(a.status).toBe('ok');
    expect(a.sentences.line.text).toMatch(/^With £500 a month going in until 67 and your State Pension, you could have about/);
  });
});

describe('5 from now nothing more goes in', () => {
  it('the figures are C\'s from now; a note says what is paid in now is not counted', () => {
    const now = ok(answerC({ you: { pot: 250000, age: 60, payIn: { has: 'yes', own: 500, employer: 300 } }, start: { kind: 'now' } }, ENV));
    const plain = answerC({ you: { pot: 250000, age: 60 } }, ENV);
    expect(now.monthly).toEqual(plain.monthly);
    expect(now.sentences.payIn).toBeUndefined();
    expect(now.warnings.find((w) => w.id === 'pay-in-unused').text).toBe('With the money taken from now, nothing more goes into a pension, so what you pay in now is not counted. To count it, choose the age the money starts.');
  });

  // The nightly run, 1 Oct 2026 (C's M1b and M3, seeds -682852991 and 1221719817): "from age 60" typed by someone who is
  // 60 is the money from now. With nothing in a pot and nothing in savings, paying in reaches nothing before it starts:
  // the answer is the State Pension alone (guaranteed-only), as from now — never "About £0 a month".
  it('from the age they are now, with no pot: paying in adds nothing, and the answer is the State Pension, as from now', () => {
    const from60 = ok(answerC({ you: { pot: 0, age: 60, payIn: { has: 'yes', own: 500, employer: 300 } }, start: { kind: 'age', age: 60 } }, ENV));
    const now = ok(answerC({ you: { pot: 0, age: 60, payIn: { has: 'yes', own: 500, employer: 300 } }, start: { kind: 'now' } }, ENV));
    expect(from60.status).toBe('guaranteed-only');
    expect(from60.monthly).toEqual(now.monthly);
    expect(from60.monthly.careful).toBeGreaterThan(1000);
    expect(from60.warnings.map((w) => w.id)).toContain('pay-in-unused');
    // a couple of 18-year-olds, one paying in £1, the money from 18: the only pension is closed then and there are no
    // savings, so the start is refused, as for one person (per person since the reviewers' finding, 1 Oct 2026) — never
    // "£0 a month"
    const young = answerC({ household: 'couple', you: { pot: 0, age: 18, payIn: { has: 'no' } }, partner: { age: 18, pot: 0, payIn: { has: 'yes', own: 0, employer: 1 } }, start: { kind: 'age', age: 18 }, risk: 'cautious', endAge: 75, take: 0 }, ENV);
    expect(young.problems).toEqual([{ field: 'start.age', messageId: 'start-not-before-access' }]);
    // "now" with no pension open yet and something going in is from the day the first opens, what goes in counted (R14)
    const youngNow = answerC({ household: 'couple', you: { pot: 0, age: 18, payIn: { has: 'no' } }, partner: { age: 18, pot: 0, payIn: { has: 'yes', own: 0, employer: 1 } }, start: { kind: 'now' }, risk: 'cautious', endAge: 75, take: 0 }, ENV);
    expect(youngNow.status).toBe('ok');
    expect(youngNow.basis.yearsSaving).toBe(39);
    // £1 a month for 39 years pays nothing steady from 57: the screen shows the plain sentence, never a "£0 a month" headline
    expect(youngNow.sentences.none.id).toBe('c.none');
  });
});
