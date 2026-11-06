/**
 * Golden set C (strategy brief Appendix B) — Floor & Flex. The floor cost is DETERMINISTIC
 * (assert to the pound); sleeve statistics carry the brief's ±3% tolerance. A fictional plan; its figures were
 * re-pinned on 3 Nov 2026 from this engine (the brief's first set was shaped like one real plan).
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { setEquityHaircut, WORLD_EQUITY_HAIRCUT } from '../../src/strategies/ladderEngine.js';
// The brief's golden sets pin the RAW Shiller reference maths; the app itself runs world-adjusted.
// Set at module level: the describe bodies below compute their windows at collection time.
setEquityHaircut(0);
afterAll(() => setEquityHaircut(WORLD_EQUITY_HAIRCUT));
import { floorCost, runFlexWindows } from '../../src/strategies/FloorAndFlex.js';
import { profileTargetForYear } from '../../src/services/IncomeProfile.js';

const near = (x, target, tolPct) => Math.abs(x - target) <= Math.abs(target) * tolPct / 100;

describe('Golden set C — floor £30k yrs 1–5 then £18k yrs 6–30 at 2.3%; sleeve 4%', () => {
  const floorProfile = { type: 'phases', phases: [{ fromYear: 0, amount: 30000 }, { fromYear: 5, amount: 18000 }] };
  // Rung for plan-year k funds spending in year k: profile year index k-1 (year 1 = index 0)
  const drawForYear = (k) => profileTargetForYear(floorProfile, k - 1, 0);
  const cost = floorCost({ drawForYear, years: 30, realYield: 0.023 });

  it('floor cost ≈ £443,063 (deterministic — to the pound)', () => {
    expect(cost).toBeCloseTo(443063, 0);
  });

  const E0 = 750000 - Math.round(cost);
  const res = runFlexWindows({ E0, rate: 0.04, END: 360 });

  it('window count n ≈ 1,470 and year-1 discretionary ≈ £12.3k', () => {
    expect(res.meta.n).toBeGreaterThanOrEqual(1465);
    expect(res.meta.n).toBeLessThanOrEqual(1475);
    expect(near(res.stats.year1D, 12277, 1), `y1=${res.stats.year1D}`).toBe(true);
  });

  it('worst-year discretionary per path: median ≈ £9.5k, p10 ≈ £5.5k, min ≈ £2.8k (±3%)', () => {
    expect(near(res.stats.worstMedian, 9523, 3), `med=${res.stats.worstMedian}`).toBe(true);
    expect(near(res.stats.worstP10, 5537, 3), `p10=${res.stats.worstP10}`).toBe(true);
    expect(near(res.stats.worstMin, 2832, 3), `min=${res.stats.worstMin}`).toBe(true);
  });

  it('share of all path-years under £10k ≈ 13% (±0.3pp)', () => {
    const share = res.stats.shareYearsUnder(10000);
    expect(Math.abs(share - 12.96)).toBeLessThanOrEqual(0.3);
  });

  it('terminal sleeve: median ≈ £655k, p10 ≈ £342k, min ≈ £160k (±3%)', () => {
    expect(near(res.stats.terminalMedian, 655000, 3), `med=${res.stats.terminalMedian}`).toBe(true);
    expect(near(res.stats.terminalP10, 342000, 3), `p10=${res.stats.terminalP10}`).toBe(true);
    expect(near(res.stats.terminalMin, 160000, 3), `min=${res.stats.terminalMin}`).toBe(true);
  });

  it('essentials survival is 100% by construction; %-of-pot draws never deplete the sleeve', () => {
    expect(res.windows.every((w) => w.terminal > 0)).toBe(true);
  });

  it('collars clamp the annual draw (min paid from capital, max caps the treats)', () => {
    const c = runFlexWindows({ E0, rate: 0.04, END: 360, flexMin: 8000, flexMax: 20000 });
    expect(c.windows.every((w) => w.dByYear.every((d) => d >= 8000 - 1e-9 && d <= 20000 + 1e-9))).toBe(true);
    expect(c.stats.worstMin).toBeGreaterThanOrEqual(8000 - 1e-9);
  });

  it('sensitivity: every £1k/yr of essentials ≈ £21.5k of floor cost at 2.3% (30y)', () => {
    const per1k = floorCost({ drawForYear: () => 1000, years: 30, realYield: 0.023 });
    expect(near(per1k, 21499, 5), `per1k=${per1k}`).toBe(true);
  });
});

describe('§4e ratchet — property tests (golden set C pins the ratchet-OFF path)', () => {
  const floorProfile = { type: 'phases', phases: [{ fromYear: 0, amount: 30000 }, { fromYear: 5, amount: 18000 }] };
  const drawForYear = (k) => profileTargetForYear(floorProfile, k - 1, 0);
  const E0 = 306937;

  it('OFF by default: golden path byte-identical with and without the ratchet key absent', () => {
    const a = runFlexWindows({ E0, rate: 0.04, END: 360 });
    const b = runFlexWindows({ E0, rate: 0.04, END: 360, ratchet: undefined });
    expect(a.stats.terminalMedian).toBe(b.stats.terminalMedian);
    expect(a.stats.worstMedian).toBe(b.stats.worstMedian);
  });

  it('extend: whole years, sequential, capped; sleeve pays exactly what the rungs cost', () => {
    const r = runFlexWindows({ E0, rate: 0.04, END: 360,
      ratchet: { mode: 'band', b: 1.2, gp: 0.05, target: 'extend', horizonYears: 30,
                 floorDrawForYear: () => 18000, maxExtendYears: 5 } });
    const boomy = r.windows.filter((w) => w.extendYears > 0);
    expect(boomy.length).toBeGreaterThan(0);
    expect(r.windows.every((w) => w.extendYears <= 5)).toBe(true);
    expect(r.windows.every((w) => Number.isInteger(w.extendYears))).toBe(true);
    // Ratchet spends reduce the sleeve → terminals can only be ≤ the no-ratchet run's
    const off = runFlexWindows({ E0, rate: 0.04, END: 360 });
    for (let i = 0; i < r.windows.length; i += 97) {
      expect(r.windows[i].terminal).toBeLessThanOrEqual(off.windows[i].terminal + 1e-6);
    }
  });

  it('raise: cheapest-first (furthest years uplift first) and never past the target', () => {
    const raiseTarget = () => 30000;   // lift the go-slow floor back to the go-go level
    const r = runFlexWindows({ E0, rate: 0.04, END: 360,
      ratchet: { mode: 'calendar', reviews: [60, 120, 180, 240], gp: 0.05, target: 'raise',
                 horizonYears: 30, floorDrawForYear: drawForYear, raiseTargetForYear: raiseTarget } });
    const w = r.windows.find((x) => x.upliftSpent > 0 && Object.keys(x.uplift).length > 1
      && Object.keys(x.uplift).length < 24);   // partially-filled window shows the ordering
    expect(w).toBeTruthy();
    const years = Object.keys(w.uplift).map(Number).sort((a, b) => a - b);
    // Uplift never exceeds target − base anywhere
    for (const k of years) {
      expect(w.uplift[k]).toBeLessThanOrEqual(30000 - drawForYear(k) + 1e-6);
    }
    // Cheapest-first: every year FURTHER than a partially-filled year is fully filled
    const partial = years.filter((k) => w.uplift[k] < 30000 - drawForYear(k) - 1e-6);
    if (partial.length) {
      const nearestPartial = Math.min(...partial);
      for (const k of years.filter((k) => k > nearestPartial)) {
        expect(w.uplift[k]).toBeCloseTo(30000 - drawForYear(k), 4);
      }
    }
  });
});
