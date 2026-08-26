import { describe, it, expect } from 'vitest';
import { buildGiltLadder, spreadFor } from '../src/strategies/GiltLadderPlan.js';
import { activeLinkers } from '../src/services/LinkerUniverse.js';

// The user's own plan (26 Aug 2026): £35k bridge, 3 cash years at £80k, £65k to 67, £45k to 74, £40k to 91.
const amountAtAge = (age) => age <= 59 ? 80000 : age <= 67 ? 65000 : age <= 74 ? 45000 : 40000;
const base = { pot: 1212000, startAge: 57, durationYears: 35, amountAtAge, spAnnual: 12480, spStartAge: 67, spFirstYearRatio: 8 / 12,
  firstTaxYear: 2027, linkers: activeLinkers().gilts, cashYears: 3, bridgeCash: 35000, todayIso: '2026-08-26' };

describe('GiltLadderPlan — the fully deterministic ladder', () => {
  const plan = buildGiltLadder(base);
  it('every rung matures BEFORE the April of the tax year it pays for (or is held from an earlier one)', () => {
    for (const y of plan.years.filter((x) => x.from !== 'cash')) {
      expect(y.from).not.toBe('none');
      expect(y.matures <= y.Y + '-03-31').toBe(true);
      if (!y.held) expect(y.matures >= (y.Y - 1) + '-04-01').toBe(true);
    }
  });
  it('cash covers the bridge and the first N years; the State Pension is netted from 67 with a partial first year', () => {
    expect(plan.cashYears.map((c) => c.Y)).toEqual([2027, 2028, 2029]);
    expect(plan.cash).toBe(35000 + 80000 * 3);
    const y2037 = plan.years.find((y) => y.Y === 2037);
    expect(y2037.age).toBe(67);
    expect(y2037.need).toBeCloseTo(65000 - 12480 * 8 / 12, 0);
    expect(plan.years.find((y) => y.Y === 2038).need).toBe(45000 - 12480);
  });
  it('only 3-month-lag linkers; gap years are double-drops of the previous linker, never a sale', () => {
    expect(plan.orders.every((o) => o.name.includes('Index-linked') || o.name.includes('Index-Linked'))).toBe(true);
    expect(plan.orders.some((o) => o.name.includes('Stock'))).toBe(false);   // no old-style 8-month-lag stocks
    const t29 = plan.orders.find((o) => o.tidm === 'T29');
    expect(t29.taxYears).toEqual([2030, 2031]);                                 // no 2030 linker → 2029 bought twice
    expect(t29.pays).toBe(130000);
    const t58 = plan.orders.find((o) => o.tidm === 'T58');
    expect(t58.taxYears.length).toBeGreaterThanOrEqual(3);                      // nothing matures 2058-2061 in time
  });
  it('nominal = pays ÷ index ratio, rounded UP to £100; cost = pays × clean/100 × (1+spread) + £20', () => {
    for (const o of plan.orders) {
      if (o.indexRatio) expect(o.nominal).toBe(Math.ceil(o.pays / o.indexRatio / 100) * 100);
      expect(o.cost).toBeCloseTo(o.pays * o.cleanPrice / 100 * (1 + o.spread) + 20, 0);
    }
    expect(spreadFor(3)).toBe(0.0015); expect(spreadFor(10)).toBe(0.0025); expect(spreadFor(25)).toBe(0.004);
  });
  it('reports affordability honestly with a reason and the shortfall', () => {
    expect(plan.total).toBeGreaterThan(1150000);
    expect(plan.total).toBeLessThan(1300000);
    expect(typeof plan.affordable).toBe('boolean');
    if (!plan.affordable) expect(plan.reason).toMatch(/more than the pot/);
    const rich = buildGiltLadder({ ...base, pot: 2000000 });
    expect(rich.affordable).toBe(true); expect(rich.spare).toBeGreaterThan(700000);
  });
});
