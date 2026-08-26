import { describe, it, expect } from 'vitest';
import { stackedConesSvg, STRATEGY_COLORS } from '../src/ui/comparisonGraphic.js';
describe('comparison graphic', () => {
  it('draws one median line per strategy, whiskers at the chosen year, and a colour for all six ids', () => {
    const cone = (base) => ({ p10: Array(36).fill(base * 0.8), p50: Array(36).fill(base), p90: Array(36).fill(base * 1.3) });
    const svg = stackedConesSvg({ strategies: [{ id: 'a', name: 'A', color: '#fff', cone: cone(40000) }, { id: 'b', name: 'B', color: '#000', cone: cone(60000) }], year: 10, startAge: 57, title: 'T' });
    expect((svg.match(/<polyline/g) || []).length).toBe(2);
    expect((svg.match(/<circle/g) || []).length).toBe(2);
    expect(svg).toContain('A at year 10: £32k – £40k – £52k');
    expect(Object.keys(STRATEGY_COLORS).length).toBe(6);
  });
});
