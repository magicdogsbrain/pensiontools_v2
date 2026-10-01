/** format.js — the one formatter (V7 build brief 4.3; language guide 3.4 and 3.5). */
import { describe, it, expect } from 'vitest';
import { money, shownMonthly, ageText, pot, outOfTen, get, partText, partsText } from '../../../src/answers/shared/format.js';

describe('money', () => {
  it.each([[1380, '£1,380'], [0, '£0'], [-0, '£0'], [250000, '£250,000'], [1073100, '£1,073,100'], [10000000, '£10,000,000'],
    [999, '£999'], [1000, '£1,000'], [1045.63, '£1,046'], [0.4, '£0'], [58.5, '£59'], [-1380, '£1,380'], [NaN, '£0'], [undefined, '£0']])(
    '%s → %s', (n, text) => expect(money(n)).toBe(text));
  it('never a minus, never pence, never a space', () => {
    for (const n of [-0.4, -1, 12.99, 1e7, 123456789]) expect(money(n)).toMatch(/^£\d{1,3}(,\d{3})*$/);
  });
});

describe('shownMonthly', () => {
  it.each([[1380, 1380], [1384.9, 1380], [1385, 1390], [1045.63, 1050], [1000, 1000], [999, 1000], [997, 995], [334.2, 335], [332, 330], [2, 0], [3, 5], [0, 0]])(
    '%s → %s', (n, shown) => expect(shownMonthly(n)).toBe(shown));
  it('gives a whole multiple of 10 from £1,000 and of 5 below', () => {
    for (let n = 0; n < 3000; n += 7.3) expect(shownMonthly(n) % (n >= 1000 ? 10 : 5)).toBe(0);
  });
});

describe('ageText', () => {
  it('whole years, rounded down', () => {
    expect(ageText(95)).toBe('95');
    expect(ageText(86.9)).toBe('86');
  });
});

describe('pot — a pot to the nearest £1,000 (step 4 brief, conflict 39)', () => {
  it.each([[468250, '£468,000'], [468500, '£469,000'], [470000, '£470,000'], [499, '£0'], [500, '£1,000'], [0, '£0'], [-0, '£0'], [1073100, '£1,073,000'],
    [5000000, '£5,000,000'], [12345678, '£12,346,000'], [-70000, '£70,000'], [NaN, '£0'], [undefined, '£0']])('%s → %s', (n, text) => expect(pot(n)).toBe(text));
  it('always ends in ",000" or is £0, and is money() of a whole thousand', () => {
    for (let n = 0; n < 3_000_000; n += 12_345.67) {
      const t = pot(n);
      expect(t === '£0' || t.endsWith(',000')).toBe(true);
      expect(t).toBe(money(Math.round(n / 1000) * 1000));
    }
  });
});

describe('outOfTen — counting out of 10', () => {
  it.each([
    [1, 'in every future we tried', false],
    [0.999, 'in more than 9 futures out of 10', false],
    [0.95, 'in more than 9 futures out of 10', false],
    [0.949, 'in 9 futures out of 10', false],
    [0.906, 'in 9 futures out of 10', false],
    [0.9, 'in 9 futures out of 10', false],
    [0.85, 'in 9 futures out of 10', false],
    [0.849, 'in only 8 futures out of 10', true],
    [0.7, 'in only 7 futures out of 10', true],
    [0.51, 'in only 5 futures out of 10', true],
    [0.25, 'in only 3 futures out of 10', true],
    [0.15, 'in only 2 futures out of 10', true],
    [0.149, 'in only 1 future out of 10', true],
    [0.05, 'in only 1 future out of 10', true],
    [0.049, 'in fewer than 1 future out of 10', true],
    [0.001, 'in fewer than 1 future out of 10', true],
    [0, 'in none of the futures we tried', true]
  ])('%s → %s', (share, words, only) => {
    expect(outOfTen(share)).toMatchObject({ words, only });
  });
  it('counts of futures land on the right side: 34 of 40 is 9 in 10, 38 of 40 is more than 9', () => {
    expect(outOfTen(34 / 40).words).toBe('in 9 futures out of 10');
    expect(outOfTen(38 / 40).words).toBe('in more than 9 futures out of 10');
    expect(outOfTen(40 / 40).words).toBe('in every future we tried');
  });
  it('never says a percentage', () => {
    for (let s = 0; s <= 1; s += 0.01) expect(outOfTen(s).words).not.toMatch(/%|per ?cent/);
  });
});

describe('sentence parts', () => {
  const result = { monthly: { careful: 1380 }, inputs: { endAge: 95 }, phases: [{}, { shown: { fromPots: 334 } }] };
  it('get reads a dotted key', () => {
    expect(get(result, 'phases.1.shown.fromPots')).toBe(334);
    expect(get(result, 'nothing.here')).toBeUndefined();
  });
  it('a part is a string, a key with a kind, or a fixed count', () => {
    expect(partText('About ', result)).toBe('About ');
    expect(partText({ key: 'monthly.careful', kind: 'money' }, result)).toBe('£1,380');
    expect(partText({ key: 'inputs.endAge', kind: 'age' }, result)).toBe('95');
    expect(partText({ fixed: '9' }, result)).toBe('9');
  });
  it('kind "pot" is the nearest £1,000', () => {
    const r = { shown: { potAtStop: { middling: 481250 } } };
    expect(partText({ key: 'shown.potAtStop.middling', kind: 'pot' }, r)).toBe('£481,000');
    expect(partText({ key: 'shown.potAtStop.middling', kind: 'money' }, r)).toBe('£481,250');
    expect(partsText(['about ', { key: 'shown.potAtStop.middling', kind: 'pot' }, ' by 60'], r)).toBe('about £481,000 by 60');
  });
  it('text is the parts joined', () => {
    expect(partsText(['About ', { key: 'monthly.careful', kind: 'money' }, ' a month'], result)).toBe('About £1,380 a month');
  });
});
