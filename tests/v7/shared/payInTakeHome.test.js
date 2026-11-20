/**
 * Your part of a pay-in said as what leaves take-home pay (question B's step 1, `ownFrom: 'takeHome'`) lands by the one
 * scheme-aware sum, AccumulationEngine.contributionBreakdown, never a flat × 1.25 of its own (lead4-engine.md ruling 11).
 * Its exact inverse, SaverPayIn.takeHomeOf, says it back.
 *
 * Hand-worked (made up, Jo): £400 a month from take-home pay.
 *   - Relief at source (no scheme known: the basic rate is assumed): 400 / 0.8 = £500 lands; with £150 from the employer,
 *     £650 goes in.
 *   - Pay taken before tax, on £60,000 a year (top rate 40%): 400 / (1 − 0.40) = £666.67 lands.
 *   - Salary sacrifice, on £30,000 a year (20% tax, 8% National Insurance): 400 / (1 − 0.28) = £555.56 lands.
 */
import { describe, it, expect } from 'vitest';
import { payInParts } from '../../../src/answers/shared/payIn.js';
import { takeHomeOf } from '../../../src/services/SaverPayIn.js';

const jo = { kind: 'split', own: 400, employer: 150, ownFrom: 'takeHome' };

describe('a pay-in from take-home pay lands by the scheme-aware sum', () => {
  it('relief at source, no scheme known: £500 lands, £650 goes in', () => {
    expect(payInParts(jo)).toMatchObject({ own: 500, employer: 150, total: 650, ownTyped: 400, ownFrom: 'takeHome' });
  });
  it('pay taken before tax on £60,000: £666.67 lands', () => {
    expect(payInParts(jo, { kind: 'netpay', salary: 60000 })).toMatchObject({ own: 666.67, total: 816.67 });
  });
  it('salary sacrifice on £30,000: £555.56 lands', () => {
    expect(payInParts(jo, { kind: 'salsac', salary: 30000 })).toMatchObject({ own: 555.56, total: 705.56 });
  });
  it('what lands is said back as the take-home it came from, by the inverse', () => {
    for (const scheme of [null, { kind: 'netpay', salary: 60000 }, { kind: 'salsac', salary: 30000 }]) {
      const own = payInParts(jo, scheme).own;
      expect(Math.round(takeHomeOf(own, scheme ? { scheme: scheme.kind, salary: scheme.salary } : {}) * 100) / 100).toBeCloseTo(400, 1);
    }
  });
});

import { readFileSync } from 'node:fs';
import { contributionsMonthlyOf } from '../../../src/answers/plan/move.js';
import { normaliseHoldings } from '../../../src/services/HoldingsRecord.js';

describe('the move\'s new money a month reads the same sum (both views)', () => {
  // Jo's plan says £400 a month from take-home pay, taken before tax on £60,000, and £150 from the employer:
  // 400 / 0.6 + 150 = £816.67 a month goes in (it was 400 × 1.25 + 150 = £650)
  it('pay taken before tax on £60,000: £816.67 a month', () => {
    const plan = { accumulationTool: { settings: { netMonthly: 400, employerMonthly: 150, salary: 60000, schemeType: 'netpay' } } };
    expect(contributionsMonthlyOf(plan, normaliseHoldings(null))).toBeCloseTo(816.67, 2);
  });
  it('the full view\'s move has no flat × 1.25 of its own', () => {
    const html = readFileSync('index.html', 'utf8');
    expect(/netMonthly \|\| 0\) \* 1\.25/.test(html)).toBe(false);
  });
});
