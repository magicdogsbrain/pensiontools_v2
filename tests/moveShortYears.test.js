/**
 * A shortfall is said as one, with the years it leaves unpaid (walks3 W5-H2). Fictional: Jo keeps most of a share fund, so
 * the money the plan does not use (£100,000) cannot pay for all the ladder's buys (£160,000). The buys are paid in the
 * order the move buys them: the cash years first, then the gilts nearest first.
 *
 * Worked by hand:
 *   cash years (2027/28, 2028/29)   £30,000   → £70,000 left
 *   gilt for 2029/30 and 2030/31    £40,000   → £30,000 left
 *   gilt for 2031/32                £40,000   → £30,000 of it paid, £10,000 short
 *   gilt for 2032/33 and 2033/34    £50,000   → none of it paid, £50,000 short
 *   short                           160,000 − 100,000 = £60,000: the years 2031/32 to 2033/34
 * It said "The rest waits until the money is there" and "£60,000 waits for new money", though no money is coming; the
 * schedule listed the far buys with nothing to pay for them.
 */
import { describe, it, expect } from 'vitest';
import { payingOf, moveTotalsOf, unpaidOf } from '../src/answers/plan/moveWords.js';
import { sequence } from '../src/services/TransitionPlanner.js';
import { MOVE } from '../src/v7/copy/move.js';

const diff = {
  funding: { need: 160000, spareCash: 0, available: 100000, toRaise: 160000, leftOver: 0, short: 60000, listed: true, fromPlan: false },
  buy: [
    { key: 'g3', kind: 'gilt', label: 'Gilt 2033', amount: 50000, matures: '2033-03-07', taxYears: [2032, 2033], wrapper: 'SIPP' },
    { key: 'c', kind: 'cash', label: 'Cash', amount: 30000, wrapper: 'SIPP', yearsLeft: [2027, 2028] },
    { key: 'g1', kind: 'gilt', label: 'Gilt 2029', amount: 40000, matures: '2029-03-22', taxYears: [2029, 2030], wrapper: 'SIPP' },
    { key: 'g2', kind: 'gilt', label: 'Gilt 2031', amount: 40000, matures: '2031-03-22', taxYears: [2031], wrapper: 'SIPP' }
  ],
  sell: [], hold: []
};

describe('the buys what you hold cannot pay for', () => {
  it('are £60,000 short: the years 2031/32 to 2033/34', () => {
    const u = unpaidOf(diff);
    expect(u.short).toBe(60000);
    expect(u.years).toEqual([2031, 2032, 2033]);
  });
  it('new money counted first pays the nearer of them', () => {
    expect(unpaidOf(diff, { newMoney: 15000 })).toEqual({ short: 45000, years: [2032, 2033] });   // 2031/32 now paid in full
  });
  it('Paying for it says the shortfall and its years, never that it waits for money', () => {
    const p = payingOf(diff);
    expect(p.ids).toEqual(['need', 'youHold', 'short', 'shortYears']);
    expect(p.slots.years).toBe('2031/32 to 2033/34');
    expect(p.slots.short).toBe('£60,000');
    const words = p.ids.map((id) => MOVE.paying[id]).join(' ');
    expect(words).not.toMatch(/waits/);
  });
  it('the totals line names the shortfall and the years', () => {
    const t = moveTotalsOf(diff);
    expect(t.id).toBe('totalsShort');
    expect(t.slots.years).toBe('2031/32 to 2033/34');
    expect(MOVE.lists.totalsShort).not.toMatch(/waits|new money/);
  });
  it('the schedule buys only what can be paid for', () => {
    const s = sequence(diff, { today: new Date(2026, 10, 18, 12), startYear: 2027, startMonth: '2027-10' });
    const bought = s.steps.filter((x) => x.action === 'buy').reduce((t, x) => t + x.amount, 0);
    expect(bought).toBe(100000);                        // was 160,000: the far gilts listed with nothing to pay for them
    expect(s.steps.some((x) => x.action === 'buy' && x.label === 'Gilt 2033')).toBe(false);
    expect(s.funded).toBe(false);
  });
});
