/**
 * Step F2 (lead4.md D6): one reading of an income step, worked by hand.
 *
 * Alex (fictional) wants £2,000 a month after tax: £24,000 a year. Bands: allowance £12,570, basic rate 20% to £50,270.
 *   Every pound taxed: G − 0.2 × (G − 12,570) = 24,000 → 0.8G = 21,486 → G = £26,857.50 → £26,858 (what the plan stores).
 *   A quarter of each payment tax-free: taxable 0.75D, so D − 0.2 × (0.75D − 12,570) = 24,000 → 0.85D = 21,486 →
 *     D = £25,277.65 → £25,278 taken a year before tax.
 *   With a State Pension of £11,973 a year already paid (taken as it is), and a quarter of the rest tax-free:
 *     0.8 × 11,973 + 0.85D + 2,514 = 24,000 → 0.85D = 11,907.60 → D = £14,008.94; taken = 11,973 + 14,008.94 = £25,982.
 * Every case reaches the bank as £2,000 a month.
 */
import { describe, it, expect } from 'vitest';
import { stepFiguresOf } from '../../src/reading/income.js';
import { POTS } from '../../src/v7/copy/pots.js';
import { accessMethodOf, accessOf, DEFAULT_ACCESS_METHOD, accessAssumedWords } from '../../src/reading/access.js';

const BANDS = { pa: 12570, brl: 50270, hrl: 125140 };

describe('a step read before and after tax, by hand', () => {
  it('every pound taxed: what is taken is the figure stored', () => {
    expect(stepFiguresOf(26858, { settings: { accessMethod: 'drawdown' }, bands: BANDS })).toEqual({ beforeTax: 26858, monthAfterTax: 2000 });
  });
  it('a quarter of each payment tax-free: £25,278 taken for the same £2,000 a month', () => {
    expect(stepFiguresOf(26858, { settings: { accessMethod: 'ufpls' }, bands: BANDS })).toEqual({ beforeTax: 25278, monthAfterTax: 2000 });
  });
  it('with a State Pension already paid, it is taken as it is and only the pension part has a quarter tax-free', () => {
    const f = stepFiguresOf(26858, { settings: { accessMethod: 'ufpls' }, bands: BANDS, fixed: 11973 });
    expect(Math.abs(f.beforeTax - 25982)).toBeLessThanOrEqual(1);
    expect(f.monthAfterTax).toBe(2000);
  });
  it('on the plan\'s own bands, never the defaults: a lower allowance takes more', () => {
    const own = { pa: 10000, brl: 50270, hrl: 125140 };
    // every pound taxed at an allowance of £10,000: 0.8G + 2,000 = net; the stored £26,858 reaches 0.8 × 26,858 + 2,000 = £23,486.40 a year
    expect(stepFiguresOf(26858, { settings: { accessMethod: 'drawdown' }, bands: own }).monthAfterTax).toBe(Math.round(23486.4 / 12));
  });
});

describe('how the tax-free part is taken: one field, one default rule', () => {
  it('what the plan holds wins; nothing chosen is a quarter tax-free whichever door made the plan', () => {
    expect(accessMethodOf({ accessMethod: 'drawdown' })).toBe('drawdown');
    expect(accessMethodOf({ accessMethod: 'ufpls' })).toBe('ufpls');
    expect(accessMethodOf({})).toBe(DEFAULT_ACCESS_METHOD);
    expect(DEFAULT_ACCESS_METHOD).toBe('ufpls');
    expect(accessOf({ stressTool: { settings: {} } })).toEqual({ method: 'ufpls', chosen: false });
    expect(accessOf({ stressTool: { settings: { accessMethod: 'drawdown' } } })).toEqual({ method: 'drawdown', chosen: true });
  });
  it('a locked plan with nothing stored keeps what it was locked on', () => {
    expect(accessOf({ stressTool: { settings: {} }, decisionTool: { settings: { locked: true } } }).method).toBe('drawdown');
  });
  it('the assumption is said in words, the same in both views', () => {
    expect(accessAssumedWords('ufpls')).toBe('We assumed a quarter of each payment is tax-free: nothing was chosen.');
    // the simple view's pots page says the same words (nothing chosen is always the default there)
    expect(POTS.derived['tax.free.assumed'].startsWith(accessAssumedWords(DEFAULT_ACCESS_METHOD))).toBe(true);
  });
});
