/**
 * Question A at its edges (step 4 brief 4.7 steps 3 and 7): no pot and nothing going in (guaranteed-only, none),
 * nothing yet but paying in, "show me ages" where nothing works and in full detail, the last stop age, a plan that
 * reaches its end age soon after the stop, part-time for the most years, a partner older than the first person,
 * a couple by level, a long saving life, two risk levels, and the allowance warnings. Each passes checkAnswerA.
 */
import { describe, it, expect } from 'vitest';
import { answerA, checkAnswerA, TEST_ENV, ENGINE_READY } from './invariants.js';

const CASES = [
  ['no pot and nothing going in, the full State Pension: guaranteed-only', { you: { age: 60, pot: 0 }, stop: { age: 62 }, spend: { amount: 1000 } }, {}, { status: 'guaranteed-only', 'headline.kind': 'nothing', 'sentences.nothing.id': 'a.nothing' }],
  ['no pot, nothing going in and no State Pension: none', { you: { age: 60, pot: 0, statePension: { kind: 'none' } }, stop: { age: 62 }, spend: { amount: 1000 } }, {}, { status: 'none', 'sentences.none.id': 'a.none' }],
  ['nothing yet but paying in, stopping today: the shown row has nothing; later rows do', { you: { age: 50, pot: 0, payIn: { total: 500 } }, stop: { age: 50 }, spend: { amount: 1000 } }, {}, { status: 'ok', 'sentences.pot.id': 'a.pot.nothing', 'shown.paidIn.total': 0 }],
  ['"show me ages", nothing works up to 75', { you: { age: 50, pot: 10000 }, stop: { kind: 'ages' }, spend: { amount: 5000 } }, {}, { 'headline.kind': 'noneWorked', 'earliest.yes': null, 'sentences.head.id': 'a.head.noneWorked' }],
  ['"show me ages" in full detail', { you: { age: 50, pot: 400000, payIn: { total: 800 } }, stop: { kind: 'ages' }, spend: { amount: 2000 } }, { detail: 'all' }, { 'headline.kind': 'earliest', 'basis.detail': 'all' }],
  ['the last stop age: 75 stopping at 75', { you: { age: 75, pot: 200000 }, stop: { age: 75 }, spend: { amount: 1500 } }, {}, { 'shown.age': 75, 'shown.oneMoreYear': null }],
  ['70 stopping at 70, to 75: no row from which the plan would not reach its end', { you: { age: 70, pot: 200000 }, stop: { age: 70 }, spend: { amount: 1500 }, endAge: 75 }, {}, { 'basis.endAge': 75 }],
  ['part-time for the most years (15)', { you: { age: 55, pot: 200000 }, stop: { age: 56 }, spend: { amount: 1500 }, partTime: { has: true, yearly: 12000, years: 15 } }, {}, { 'partTime.toAge': 71, 'partTime.oneMore.years': 16 }],
  ['a couple, the partner older (State Pension age already passed)', { household: 'couple', you: { age: 50, pot: 100000, payIn: { total: 300 } }, partner: { age: 66, pot: 200000 }, stop: { age: 60 }, spend: { kind: 'level', level: 'moderate' } }, {}, { whose: 'you', 'spend.perMonth': 3592 }],
  ['a couple by level, "show me ages", savings going in', { household: 'couple', you: { age: 45, pot: 100000, payIn: { total: 300 } }, partner: { age: 43, pot: 50000 }, stop: { kind: 'ages' }, spend: { kind: 'level', level: 'minimum' }, savings: 20000, savingsIn: 300 }, {}, { whose: 'partner' }],
  ['18 stopping at 30, to 105: the drawing years cut at 45', { you: { age: 18, pot: 1000, payIn: { total: 2000 } }, stop: { age: 30 }, spend: { amount: 1000 }, endAge: 105 }, {}, { 'basis.endAge': 75 }],
  ['adventurous while saving, cautious once stopped: the slide is listed', { you: { age: 40, pot: 50000, payIn: { total: 600 } }, stop: { age: 60 }, spend: { amount: 1500 }, savingRisk: 'adventurous', risk: 'cautious' }, {}, { 'saving.0.mix.slideYears': 10 }],
  ['over the yearly limits: £6,000 a month in after taking pension money, £2,000 a month into ISAs', { you: { age: 50, pot: 100000, payIn: { total: 6000 }, alreadyDrawing: true }, stop: { age: 55 }, spend: { amount: 3000 }, savingsIn: 2000, savings: 100000 }, {}, {}]
];

describe.skipIf(!ENGINE_READY)('A — at the edges', () => {
  it.each(CASES)('%s', (_n, inputs, extra, want) => {
    const env = { ...TEST_ENV, ...extra };
    const a = answerA(inputs, env);
    expect(a.status, JSON.stringify(a.problems)).not.toBe('invalid');
    const f = checkAnswerA(a, inputs, env);
    expect(f, f.join('\n')).toEqual([]);
    for (const [k, v] of Object.entries(want)) expect(k.split('.').reduce((o, key) => (o == null ? undefined : o[key]), a), k).toEqual(v);
  });

  it('the limits are warned about in plain words: the £60,000 a year, the £10,000 after taking pension money, the £20,000 into ISAs', () => {
    const a = answerA(CASES[12][1], TEST_ENV);
    expect(a.warnings.map((w) => w.id)).toEqual(expect.arrayContaining(['annual-allowance', 'mpaa', 'isa-allowance']));
    const text = a.warnings.map((w) => w.text).join(' ');
    expect(text).toContain('£60,000');
    expect(text).toContain('£10,000');
    expect(text).toContain('£20,000');
    expect(text).not.toMatch(/\b(MPAA|annual allowance)\b/i);
  });

  it('the long-plan warning names the age the plan runs to', () => {
    const a = answerA(CASES[10][1], TEST_ENV);
    const w = a.warnings.find((x) => x.id === 'long-plan');
    expect(w).toBeDefined();
    expect(w.text).toContain('75');
  });
});
