import { describe, it, expect } from 'vitest';
import { stackedConesSvg, STRATEGY_COLORS } from '../src/ui/comparisonGraphic.js';
describe('comparison graphic', () => {
  it('draws one median line per strategy, whiskers at the chosen year, and a colour for all eight ids', () => {
    const cone = (base) => ({ p10: Array(36).fill(base * 0.8), p50: Array(36).fill(base), p90: Array(36).fill(base * 1.3) });
    const svg = stackedConesSvg({ strategies: [{ id: 'a', name: 'A', color: '#fff', cone: cone(40000) }, { id: 'b', name: 'B', color: '#000', cone: cone(60000) }], year: 10, startAge: 57, title: 'T' });
    expect((svg.match(/<polyline/g) || []).length).toBe(2);
    expect((svg.match(/<circle/g) || []).length).toBe(2);
    expect(svg).toContain('A at year 10: £32k – £40k – £52k');
    expect(Object.keys(STRATEGY_COLORS).length).toBe(8);
  });
});

import { incomeSmallMultiplesSvg, riskBarsSvg, leftBarsSvg } from '../src/ui/comparisonGraphic.js';
describe('one-question comparison panels', () => {
  const cone = (base, spread) => ({ p10: Array(36).fill(base - spread), p50: Array(36).fill(base), p90: Array(36).fill(base + spread) });
  it('income small multiples: one panel per strategy, flat contract panels say so', () => {
    const svg = incomeSmallMultiplesSvg({ strategies: [{ name: 'A', color: '#fff', cone: cone(40000, 5000) }, { name: 'B', color: '#000', cone: cone(40000, 0), contract: true }], startAge: 57, planIncome: 60000 });
    expect((svg.match(/<polygon/g) || []).length).toBe(2);
    expect(svg).toContain('by contract — no spread'); expect(svg).toContain('band = 1-in-10 bad');
  });
  it('risk bars: one bar + one history tick per row, label under each', () => {
    const svg = riskBarsSvg({ rows: [{ name: 'A', color: '#fff', mc: 12.3, hist: 8, label: 'cliff' }, { name: 'B', color: '#000', mc: 0, hist: 0, label: 'cannot run out' }] });
    expect((svg.match(/<rect/g) || []).length).toBe(2); expect(svg).toContain('12%'); expect(svg).toContain('cannot run out');
  });
  it('left bars: three bars per strategy at the chosen age', () => {
    const svg = leftBarsSvg({ rows: [{ name: 'A', color: '#fff', p10: 1, p50: 2, p90: 3 }], age: 80 });
    expect((svg.match(/<rect/g) || []).length).toBe(3); expect(svg).toContain('age 80');
  });
});
