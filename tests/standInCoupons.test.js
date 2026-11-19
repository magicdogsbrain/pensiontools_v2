/**
 * What an ordinary gilt pays, said by its day (walks3 W5-M2). Fictional: Sam holds 30,000 units of the 4½% Treasury Gilt
 * 2028 (TS28, matures 7 June 2028). On 18 November 2026, worked by hand:
 *   a coupon          30,000 × 4.5% ÷ 2 = 675, every 7 June and 7 December
 *   before maturity   7 Dec 2026, 7 Jun 2027, 7 Dec 2027: 3 × 675 = 2,025
 *   on 7 June 2028    30,000 + 675 = 30,675 (it was said as 32,700 "on 7 June 2028", the earlier interest counted in)
 *   in all            32,700
 */
import { describe, it, expect } from 'vitest';
import { standInPays } from '../src/services/TransitionPlanner.js';

describe('an ordinary gilt: what it pays on the day it matures, and the interest before then', () => {
  const p = standInPays({ ticker: 'TS28', name: '4½% Treasury Gilt 2028', units: 30000, value: 30500, kind: 'gilt', wrapper: 'SIPP' }, { today: new Date(2026, 10, 18, 12) });
  it('£32,700 in all: £30,675 on 7 June 2028 and £2,025 of interest before', () => {
    expect(p.amount).toBe(32700);
    expect(p.atMaturity).toBe(30675);
    expect(p.before).toBe(2025);
    expect(p.couponDates).toEqual(['2026-12-07', '2027-06-07', '2027-12-07']);
    expect(p.matures).toBe('2028-06-07');
  });
});
