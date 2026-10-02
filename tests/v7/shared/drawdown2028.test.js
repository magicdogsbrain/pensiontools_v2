/**
 * The 2028 drawdown note, for everyone it applies to (owner, 2 Oct 2026; research/v7/square-one-audit.md section 6
 * question 6; couples-different-years.md 12): from 6 April 2028 the earliest pension age rises from 55 to 57. Someone who
 * is 55 or 56 on that day and has moved money into drawdown before it may keep taking from that money, but nothing new can
 * be taken until 57 (HMRC guidance, April 2026). Until now only a couple who stop in different years were told; now one
 * person, a couple stopping together, "I've already stopped" — anyone it applies to — gets the one line:
 *
 *   "Move into drawdown what you will need before 57 by 5 April 2028: after that, nothing new can be taken until you are 57."
 *
 * (both of a couple: "what each of you will need … until you are each 57"; the partner alone: "For your partner: …").
 * Who it is said to is checked over the whole flat corpus against dates alone (answers.flat.test.js); these are the plain
 * cases, by question. Made-up figures only.
 */
import { describe, it, expect } from 'vitest';
import { answerA } from '../a/_a.js';
import { answerB } from '../b/_b.js';
import { answerC } from '../c/_c.js';
import { before2028 } from '../../../src/answers/shared/apart.js';

const TODAY = '2026-09-30';
const ENV = { today: TODAY, futures: 20, seed: 0, trace: false };
const YOU = 'Move into drawdown what you will need before 57 by 5 April 2028: after that, nothing new can be taken until you are 57.';
const BOTH = 'Move into drawdown what each of you will need before 57 by 5 April 2028: after that, nothing new can be taken until you are each 57.';
const PARTNER = 'For your partner: move into drawdown what they will need before 57 by 5 April 2028: after that, nothing new can be taken until they are 57.';
const note = (r) => { const w = (r.warnings || []).find((x) => x.id === 'drawdown-2028'); return w ? w.text : null; };
const ok = (r) => { expect(r.status, JSON.stringify(r.problems)).toBe('ok'); return r; };

describe('before2028: who moves money into drawdown before 6 April 2028 at 55 or 56', () => {
  const one = (age, S, pension = true) => before2028([{ who: 'you', age, S, pension }], TODAY);
  it('55 drawing now, 55 or 54 drawing next year, 54 drawing now (it opens at 55 next year): yes', () => {
    expect(one(55, 0)).toEqual(['you']);
    expect(one(55, 1)).toEqual(['you']);
    expect(one(54, 1)).toEqual(['you']);
    expect(one(54, 0)).toEqual(['you']);
  });
  it('56 now (57 by then), 53 (55 only after the day), 54 stopping in two years, no pension: no', () => {
    expect(one(56, 0)).toEqual([]);
    expect(one(53, 0)).toEqual([]);
    expect(one(54, 2)).toEqual([]);
    expect(one(55, 2)).toEqual([]);
    expect(one(55, 0, false)).toEqual([]);
  });
  it('after the day itself, nobody', () => {
    expect(before2028([{ who: 'you', age: 55, S: 0, pension: true }], '2028-04-06')).toEqual([]);
  });
});

describe('the note for one person (it used to be for couples apart only)', () => {
  it('C: 55, taking it from now', () => {
    expect(note(ok(answerC({ you: { age: 55, pot: 300000 }, start: { kind: 'now' } }, ENV)))).toBe(YOU);
  });
  it('C: 54 from now — the pension opens at 55, before the day', () => {
    expect(note(ok(answerC({ you: { age: 54, pot: 300000 }, savings: 30000, start: { kind: 'now' } }, ENV)))).toBe(YOU);
  });
  it('C: 56 from now, and 55 from 57: nothing', () => {
    expect(note(ok(answerC({ you: { age: 56, pot: 300000 }, start: { kind: 'now' } }, ENV)))).toBeNull();
    expect(note(ok(answerC({ you: { age: 55, pot: 300000 }, savings: 60000, start: { kind: 'age', age: 57 } }, ENV)))).toBeNull();
  });
  it('A: 54 stopping at 55; and at 56 (the 2028 rise keeps it closed until 57): nothing', () => {
    const at = (stop) => answerA({ you: { age: 54, pot: 300000, payIn: { total: 600 } }, savings: 60000, stop: { kind: 'age', age: stop }, spend: { kind: 'amount', amount: 1500 } },
      { ...ENV, detail: 'chart', ages: [stop] });
    expect(note(ok(at(55)))).toBe(YOU);
    expect(note(ok(at(56)))).toBeNull();
  });
  it('B: 55 stopping at 56', () => {
    expect(note(ok(answerB({ you: { age: 55, pot: 400000, payIn: { kind: 'split', own: 400, employer: 300 } }, savings: 40000, stop: { age: 56 }, spend: { amount: 1200 } },
      { ...ENV, detail: 'answer' })))).toBe(YOU);
  });
});

describe('the note for a couple who stop together', () => {
  it('C: both 55 from now — each of you', () => {
    expect(note(ok(answerC({ household: 'couple', you: { age: 55, pot: 250000 }, partner: { age: 55, pot: 150000 }, start: { kind: 'now' } }, ENV)))).toBe(BOTH);
  });
  it('C: you 58, your partner 55, from now — your partner only', () => {
    expect(note(ok(answerC({ household: 'couple', you: { age: 58, pot: 250000 }, partner: { age: 55, pot: 150000 }, start: { kind: 'now' } }, ENV)))).toBe(PARTNER);
  });
  it('A: you 55 and your partner 60 stopping together next year — you only; your partner with no pension is not named', () => {
    const a = answerA({ household: 'couple', you: { age: 55, pot: 250000, payIn: { total: 500 } }, partner: { age: 55, pot: 0 }, savings: 30000,
      stop: { kind: 'age', age: 56 }, spend: { kind: 'amount', amount: 2400 } }, { ...ENV, detail: 'chart', ages: [56] });
    expect(note(ok(a))).toBe(YOU);
  });
  it('a note, not an important warning, in the place a couple apart has it: before "partner-stops-with-you" and the 2028 rise', () => {
    const a = ok(answerA({ household: 'couple', you: { age: 55, pot: 300000, payIn: { total: 600 } }, partner: { age: 70, pot: 0 }, savings: 60000,
      stop: { kind: 'age', age: 56 }, spend: { kind: 'amount', amount: 1500 } }, { ...ENV, detail: 'chart', ages: [56] }));
    const ids = a.warnings.map((w) => w.id);
    expect(a.warnings.find((w) => w.id === 'drawdown-2028').severity).toBe('note');
    expect(ids.indexOf('drawdown-2028')).toBeLessThan(ids.indexOf('partner-stops-with-you'));
  });
});
