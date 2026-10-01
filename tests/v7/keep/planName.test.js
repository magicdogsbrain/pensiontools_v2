/**
 * The plan's name (research/v7/save-as-plan.md "The suggested name", Contract C.4): every pattern, a couple, rounding
 * to £10, the 50-character cut, the 60-character limit on what is typed, the duplicate suffix — and never "My plan".
 * The answers are the pinned named states' own (tests/v7/states/*), so the names are made from real results.
 */
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { suggestedPlanName, checkPlanName, cleanName, withDuplicateSuffix, PLAN_NAME } from '../../../src/answers/shared/planName.js';

const load = (q, name) => JSON.parse(readFileSync(join(process.cwd(), 'tests/v7/states', q, `${name}.json`), 'utf8')).answers[q].result;
const name = (q, file) => { const r = load(q, file); return suggestedPlanName(q, r.inputs, r); };
const copy = (v) => JSON.parse(JSON.stringify(v));

describe('the suggestion, pattern by pattern (from the pinned answers)', () => {
  it('C, money from now: "From {age} · £{careful} a month"', () => {
    expect(name('c', 'answer-F1')).toBe('From 58 · £1,380 a month');
    expect(name('c', 'answer-F3')).toBe('From 68 · £1,860 a month');
  });
  it('C, a couple from now: both ages on the same date', () => {
    expect(name('c', 'answer-F2')).toBe('From 62 and 60 · £3,580 a month');
  });
  it('C, starting later with money still going in: "Stop at {age at the start}"', () => {
    expect(name('c', 'answer-paying-in')).toBe('Stop at 67 · £2,290 a month');
  });
  it('C, starting later with nothing going in: "From {age at the start}"', () => {
    const r = load('c', 'answer-paying-in');
    const none = copy(r);
    none.payIn = { total: 0, byPerson: [{ who: 'you', total: 0 }] };
    expect(suggestedPlanName('c', none.inputs, none)).toBe('From 67 · £2,290 a month');
    delete none.payIn;
    expect(suggestedPlanName('c', none.inputs, none)).toBe('From 67 · £2,290 a month');
  });
  it('A: "Stop at {shown age} · £{spend} a month" — the spending tried, not the careful amount', () => {
    expect(name('a', 'answer-A1')).toBe('Stop at 60 · £1,900 a month');
    expect(name('a', 'answer-stop-now')).toBe('Stop at 60 · £2,000 a month');
    expect(name('a', 'answer-A4')).toBe('Stop at 55 · £2,200 a month');
  });
  it('A, a couple: "Stop at {you} and {partner}"', () => {
    expect(name('a', 'answer-A2-couple')).toBe('Stop at 56 and 54 · £3,590 a month');
  });
  it('A, the retired view (stopping today with the State Pension paid from the start): "From {age}"', () => {
    const r = copy(load('a', 'answer-stop-now'));
    r.shown.phases[0].byPerson[0].statePension = 1045.63;
    expect(suggestedPlanName('a', r.inputs, r)).toBe('From 60 · £2,000 a month');
  });
  it('B: "Stop at {age} · £{spend} a month · paying £{pay-in now}"', () => {
    expect(name('b', 'answer-B1')).toBe('Stop at 60 · £2,000 a month · paying £700');
    expect(name('b', 'answer-B2-on-course')).toBe('Stop at 60 · £2,000 a month · paying £1,400');
  });
  it('B, a couple: both ages, and the household\'s pay-in', () => {
    expect(name('b', 'answer-B5-couple')).toBe('Stop at 60 and 58 · £3,200 a month · paying £1,000');
  });
  it('B with nothing going in: the last part is left out', () => {
    const r = copy(load('b', 'answer-B1'));
    r.payIn.now = 0;
    expect(suggestedPlanName('b', r.inputs, r)).toBe('Stop at 60 · £2,000 a month');
  });
  it('the inputs default to the answer\'s own', () => {
    const r = load('a', 'answer-A1');
    expect(suggestedPlanName('a', undefined, r)).toBe(name('a', 'answer-A1'));
  });
});

describe('rounding, length and what is never suggested', () => {
  it('money is to the nearest £10, with format.js\'s commas', () => {
    const r = copy(load('a', 'answer-A1'));
    for (const [perMonth, want] of [[1847, '£1,850'], [1844, '£1,840'], [995, '£1,000'], [12345, '£12,350'], [5, '£10'], [4, '£0']]) {
      r.spend.perMonth = perMonth;
      expect(suggestedPlanName('a', r.inputs, r)).toBe(`Stop at 60 · ${want} a month`);
    }
  });
  it('a name over 50 characters loses " · paying …"; the first two parts always fit', () => {
    const r = copy(load('b', 'answer-B5-couple'));
    r.inputs.you.age = 70; r.inputs.partner.age = 70;
    r.ages = { you: 100, partner: 100 }; r.stop.age = 100;
    r.spend.perMonth = 50000; r.payIn.now = 20000;
    const s = suggestedPlanName('b', r.inputs, r);
    expect(s).toBe('Stop at 100 and 100 · £50,000 a month');
    expect([...s].length).toBeLessThanOrEqual(37);
    r.payIn.now = 900;
    expect([...suggestedPlanName('b', r.inputs, r)].length).toBeLessThanOrEqual(PLAN_NAME.suggestMax);
  });
  it('nothing to save → an empty suggestion; never "My plan"', () => {
    expect(suggestedPlanName('c', null, load('c', 'answer-pensions-only'))).toBe('');      // guaranteed-only
    expect(suggestedPlanName('b', null, load('b', 'answer-out-of-reach'))).toBe('');       // out of reach
    expect(suggestedPlanName('a', null, { status: 'invalid', problems: [] })).toBe('');
    expect(suggestedPlanName('a', null, null)).toBe('');
    expect(suggestedPlanName('d', null, load('a', 'answer-A1'))).toBe('');
    for (const [q, f] of [['c', 'answer-F1'], ['c', 'answer-F2'], ['a', 'answer-A1'], ['a', 'answer-A2-couple'], ['b', 'answer-B1'], ['b', 'answer-B5-couple']]) {
      const s = name(q, f);
      expect(s.length).toBeGreaterThan(0);
      expect(s).not.toMatch(/my plan/i);
      expect([...s].length).toBeLessThanOrEqual(PLAN_NAME.suggestMax);
      expect(checkPlanName(s)).toEqual({ ok: true, name: s });
    }
  });
  it('every suggestion over random answers fits, starts "Stop at" or "From", and passes its own check', () => {
    const base = { a: load('a', 'answer-A2-couple'), b: load('b', 'answer-B5-couple'), c: load('c', 'answer-F2') };
    fc.assert(fc.property(
      fc.constantFrom('a', 'b', 'c'), fc.integer({ min: 18, max: 100 }), fc.integer({ min: 18, max: 100 }),
      fc.integer({ min: 0, max: 30 }), fc.integer({ min: 1, max: 50000 }), fc.integer({ min: 0, max: 20000 }),
      (q, you, partner, wait, spend, payIn) => {
        const r = copy(base[q]);
        r.inputs.you.age = you; r.inputs.partner.age = partner;
        if (q === 'a') { r.shown.age = you + wait; r.shown.ages = { you: you + wait, partner: partner + wait }; r.spend.perMonth = spend; }
        if (q === 'b') { r.stop.age = you + wait; r.ages = { you: you + wait, partner: partner + wait }; r.spend.perMonth = spend; r.payIn.now = payIn; }
        if (q === 'c') { r.whose = 'you'; r.basis.startAge = you + wait; r.monthly.careful = Math.round(spend / 10) * 10; }
        const s = suggestedPlanName(q, r.inputs, r);
        expect(s).toMatch(/^(Stop at|From) \d+ and \d+ · £[\d,]+ a month( · paying £[\d,]+)?$/);
        expect([...s].length).toBeLessThanOrEqual(PLAN_NAME.suggestMax);
        expect(checkPlanName(s).ok).toBe(true);
      }
    ), { numRuns: 300 });
  });
});

describe('what a person types', () => {
  it('cleans it: NFC, no control characters or line breaks, one space at a time, no spaces at the ends', () => {
    expect(cleanName('  Stop   at\t60 ')).toBe('Stop at60');
    expect(cleanName('Plan\nB')).toBe('PlanB');
    expect(cleanName('Café plan')).toBe('Café plan');
    expect(cleanName(`a${String.fromCharCode(0x2028)}b`)).toBe('ab');
    expect(cleanName(null)).toBe('');
    expect(cleanName(undefined)).toBe('');
    expect(cleanName('a    b')).toBe('a b');
  });
  it('refuses an empty name and one over 60 characters, counting characters, not bytes', () => {
    expect(checkPlanName('')).toEqual({ ok: false, problem: 'empty' });
    expect(checkPlanName('   \n ')).toEqual({ ok: false, problem: 'empty' });
    expect(checkPlanName('x'.repeat(60))).toEqual({ ok: true, name: 'x'.repeat(60) });
    expect(checkPlanName('x'.repeat(61))).toEqual({ ok: false, problem: 'tooLong' });
    expect(checkPlanName('£'.repeat(60))).toEqual({ ok: true, name: '£'.repeat(60) });            // 120 bytes, 60 characters
    expect(checkPlanName('😀'.repeat(60)).ok).toBe(true);
    expect(checkPlanName('😀'.repeat(61))).toEqual({ ok: false, problem: 'tooLong' });
    expect(checkPlanName(`  ${'y'.repeat(60)}  `)).toEqual({ ok: true, name: 'y'.repeat(60) });   // trimmed first
  });
  it('allows "My plan" when the person types it: they chose it', () => {
    expect(checkPlanName('My plan')).toEqual({ ok: true, name: 'My plan' });
  });
});

describe('the duplicate suffix', () => {
  it('adds " (2)", " (3)" … — the lowest number free — ignoring case and spacing', () => {
    expect(withDuplicateSuffix('Stop at 60', [])).toBe('Stop at 60');
    expect(withDuplicateSuffix('Stop at 60', ['Other'])).toBe('Stop at 60');
    expect(withDuplicateSuffix('Stop at 60', ['stop  at 60'])).toBe('Stop at 60 (2)');
    expect(withDuplicateSuffix('Stop at 60', ['Stop at 60', 'Stop at 60 (2)'])).toBe('Stop at 60 (3)');
    expect(withDuplicateSuffix('Stop at 60', ['Stop at 60', 'Stop at 60 (3)'])).toBe('Stop at 60 (2)');
    expect(withDuplicateSuffix('  Stop at 60 ', ['STOP AT 60'])).toBe('Stop at 60 (2)');
    expect(withDuplicateSuffix('Stop at 60', undefined)).toBe('Stop at 60');
  });
  it('a built name may pass 60 characters; only what is typed is limited', () => {
    const long = 'x'.repeat(60);
    expect(withDuplicateSuffix(long, [long])).toBe(`${long} (2)`);
  });
  it('the result is never one of the names taken (random lists)', () => {
    fc.assert(fc.property(fc.string({ maxLength: 12 }), fc.array(fc.string({ maxLength: 16 }), { maxLength: 12 }), (n, taken) => {
      const all = [...taken, n, `${n} (2)`];
      const got = withDuplicateSuffix(n, all);
      expect(all.map((t) => cleanName(t).toLowerCase())).not.toContain(got.toLowerCase());
    }), { numRuns: 300 });
  });
});
