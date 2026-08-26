import { describe, it, expect } from 'vitest';
import { giltLadderSvg, inflationDecadesSvg, GILT_FRAMES } from '../src/ui/giltLadderGraphic.js';
import { buildGiltLadder } from '../src/strategies/GiltLadderPlan.js';
import { activeLinkers } from '../src/services/LinkerUniverse.js';

const plan = buildGiltLadder({ pot: 2000000, startAge: 57, durationYears: 35, amountAtAge: (a) => a <= 59 ? 80000 : a <= 67 ? 65000 : a <= 74 ? 45000 : 40000,
  spAnnual: 12480, spStartAge: 67, spFirstYearRatio: 8 / 12, firstTaxYear: 2027, linkers: activeLinkers().gilts, cashYears: 3, bridgeCash: 35000, todayIso: '2026-08-26' });

describe('gilt ladder graphic', () => {
  it('four frames, each a valid SVG that reveals more of the machine', () => {
    expect(GILT_FRAMES.length).toBe(4);
    const svgs = [1, 2, 3, 4].map((f) => giltLadderSvg(plan, f));
    for (const s of svgs) { expect(s.startsWith('<svg')).toBe(true); expect(s.endsWith('</svg>')).toBe(true); }
    expect(svgs[0]).not.toContain('Cash (money-market)');
    expect(svgs[1]).toContain('Cash (money-market)');
    expect(svgs[2]).toContain('matures before that April');
    expect(svgs[3]).toContain('double-drops');
    expect((svgs[2].match(/<path d="M[\d.]+ [\d.]+ l5 6/g) || []).length).toBe(plan.orders.length);   // one diamond per gilt
  });
  it('bars carry a readable title with year, age, amount and source', () => {
    expect(giltLadderSvg(plan, 4)).toMatch(/2030\/31 age 60: £65k gross — T29 \(held from the year before\)/);
  });
  it('the two-decades chart draws the real line plus one nominal line per decade', () => {
    const svg = inflationDecadesSvg({ years: plan.years, cpiPaths: { 'from 1973': plan.years.map((_, i) => Math.pow(1.09, i)), 'from 2010': plan.years.map((_, i) => Math.pow(1.03, i)) } });
    expect((svg.match(/<polyline/g) || []).length).toBe(3);
    expect(svg).toContain('from 1973');
  });
});
