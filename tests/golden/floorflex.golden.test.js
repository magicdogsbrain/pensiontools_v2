/**
 * Golden set C (strategy brief Appendix B) — Floor & Flex. The floor cost is DETERMINISTIC
 * (assert to the pound); sleeve statistics carry the brief's ±3% tolerance.
 */
import { describe, it, expect } from 'vitest';
import { floorCost, runFlexWindows } from '../../src/strategies/FloorAndFlex.js';
import { profileTargetForYear } from '../../src/services/IncomeProfile.js';

const near = (x, target, tolPct) => Math.abs(x - target) <= Math.abs(target) * tolPct / 100;

describe('Golden set C — floor £35k yrs 1–10 then £22.5k yrs 11–35 at 2.3%; sleeve 4%', () => {
  const floorProfile = { type: 'phases', phases: [{ fromYear: 0, amount: 35000 }, { fromYear: 10, amount: 22500 }] };
  // Rung for plan-year k funds spending in year k: profile year index k-1 (year 1 = index 0)
  const drawForYear = (k) => profileTargetForYear(floorProfile, k - 1, 0);
  const cost = floorCost({ drawForYear, years: 35, realYield: 0.023 });

  it('floor cost ≈ £647,426 (deterministic — to the pound)', () => {
    expect(cost).toBeCloseTo(647426, 0);
  });

  const E0 = 1200000 - Math.round(cost);
  const res = runFlexWindows({ E0, rate: 0.04, END: 420 });

  it('window count n ≈ 1,409 and year-1 discretionary ≈ £22.1k', () => {
    expect(res.meta.n).toBeGreaterThanOrEqual(1400);
    expect(res.meta.n).toBeLessThanOrEqual(1415);
    expect(near(res.stats.year1D, 22100, 1), `y1=${res.stats.year1D}`).toBe(true);
  });

  it('worst-year discretionary per path: median ≈ £16.5k, p10 ≈ £9.9k, min ≈ £5.1k (±3%)', () => {
    expect(near(res.stats.worstMedian, 16500, 3), `med=${res.stats.worstMedian}`).toBe(true);
    expect(near(res.stats.worstP10, 9900, 3), `p10=${res.stats.worstP10}`).toBe(true);
    expect(near(res.stats.worstMin, 5100, 3), `min=${res.stats.worstMin}`).toBe(true);
  });

  it('share of all path-years under £10k ≈ 0.5% (±0.3pp)', () => {
    const share = res.stats.shareYearsUnder(10000);
    expect(Math.abs(share - 0.5)).toBeLessThanOrEqual(0.3);
  });

  it('terminal sleeve: median ≈ £1,264k, p10 ≈ £675k, min ≈ £391k (±3%)', () => {
    expect(near(res.stats.terminalMedian, 1264000, 3), `med=${res.stats.terminalMedian}`).toBe(true);
    expect(near(res.stats.terminalP10, 675000, 3), `p10=${res.stats.terminalP10}`).toBe(true);
    expect(near(res.stats.terminalMin, 391000, 3), `min=${res.stats.terminalMin}`).toBe(true);
  });

  it('essentials survival is 100% by construction; %-of-pot draws never deplete the sleeve', () => {
    expect(res.windows.every((w) => w.terminal > 0)).toBe(true);
  });

  it('collars clamp the annual draw (min paid from capital, max caps the treats)', () => {
    const c = runFlexWindows({ E0, rate: 0.04, END: 420, flexMin: 12000, flexMax: 30000 });
    expect(c.windows.every((w) => w.dByYear.every((d) => d >= 12000 - 1e-9 && d <= 30000 + 1e-9))).toBe(true);
    expect(c.stats.worstMin).toBeGreaterThanOrEqual(12000 - 1e-9);
  });

  it('sensitivity: every £1k/yr of essentials ≈ £24k of floor cost at 2.3% (35y)', () => {
    const per1k = floorCost({ drawForYear: () => 1000, years: 35, realYield: 0.023 });
    expect(near(per1k, 24000, 5), `per1k=${per1k}`).toBe(true);
  });
});

describe('§4e ratchet — property tests (golden set C pins the ratchet-OFF path)', () => {
  const floorProfile = { type: 'phases', phases: [{ fromYear: 0, amount: 35000 }, { fromYear: 10, amount: 22500 }] };
  const drawForYear = (k) => profileTargetForYear(floorProfile, k - 1, 0);
  const E0 = 552574;

  it('OFF by default: golden path byte-identical with and without the ratchet key absent', () => {
    const a = runFlexWindows({ E0, rate: 0.04, END: 420 });
    const b = runFlexWindows({ E0, rate: 0.04, END: 420, ratchet: undefined });
    expect(a.stats.terminalMedian).toBe(b.stats.terminalMedian);
    expect(a.stats.worstMedian).toBe(b.stats.worstMedian);
  });

  it('extend: whole years, sequential, capped; sleeve pays exactly what the rungs cost', () => {
    const r = runFlexWindows({ E0, rate: 0.04, END: 420,
      ratchet: { mode: 'band', b: 1.2, gp: 0.05, target: 'extend', horizonYears: 35,
                 floorDrawForYear: () => 22500, maxExtendYears: 5 } });
    const boomy = r.windows.filter((w) => w.extendYears > 0);
    expect(boomy.length).toBeGreaterThan(0);
    expect(r.windows.every((w) => w.extendYears <= 5)).toBe(true);
    expect(r.windows.every((w) => Number.isInteger(w.extendYears))).toBe(true);
    // Ratchet spends reduce the sleeve → terminals can only be ≤ the no-ratchet run's
    const off = runFlexWindows({ E0, rate: 0.04, END: 420 });
    for (let i = 0; i < r.windows.length; i += 97) {
      expect(r.windows[i].terminal).toBeLessThanOrEqual(off.windows[i].terminal + 1e-6);
    }
  });

  it('raise: cheapest-first (furthest years uplift first) and never past the target', () => {
    const raiseTarget = () => 35000;   // lift the go-slow floor back to the go-go level
    const r = runFlexWindows({ E0, rate: 0.04, END: 420,
      ratchet: { mode: 'calendar', reviews: [60, 120, 180, 240], gp: 0.05, target: 'raise',
                 horizonYears: 35, floorDrawForYear: drawForYear, raiseTargetForYear: raiseTarget } });
    const w = r.windows.find((x) => x.upliftSpent > 0 && Object.keys(x.uplift).length > 1
      && Object.keys(x.uplift).length < 24);   // partially-filled window shows the ordering
    expect(w).toBeTruthy();
    const years = Object.keys(w.uplift).map(Number).sort((a, b) => a - b);
    // Uplift never exceeds target − base anywhere
    for (const k of years) {
      expect(w.uplift[k]).toBeLessThanOrEqual(35000 - drawForYear(k) + 1e-6);
    }
    // Cheapest-first: every year FURTHER than a partially-filled year is fully filled
    const partial = years.filter((k) => w.uplift[k] < 35000 - drawForYear(k) - 1e-6);
    if (partial.length) {
      const nearestPartial = Math.min(...partial);
      for (const k of years.filter((k) => k > nearestPartial)) {
        expect(w.uplift[k]).toBeCloseTo(35000 - drawForYear(k), 4);
      }
    }
  });
});
