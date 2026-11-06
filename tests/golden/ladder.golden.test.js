/**
 * Golden sets A and B (strategy brief Appendix B) — Ladder & Ratchet against the bundled
 * Shiller vintage (1871-01..2023-06). Tolerances per the brief: ±2pp on percentages, ±3% on
 * £ statistics. The sets are fictional plans; their figures were re-pinned on 3 Nov 2026 from this engine (the brief's
 * first sets, matched against its Python reference to the same tolerances, were shaped like one real plan).
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { setEquityHaircut, WORLD_EQUITY_HAIRCUT } from '../../src/strategies/ladderEngine.js';
// The brief's golden sets pin the RAW Shiller reference maths; the app itself runs world-adjusted.
// Set at module level: the describe bodies below compute their windows at collection time.
setEquityHaircut(0);
afterAll(() => setEquityHaircut(WORLD_EQUITY_HAIRCUT));
import { runLadderWindows, windowFor } from '../../src/strategies/LadderAndRatchet.js';

const near = (x, target, tolPct) => Math.abs(x - target) <= Math.abs(target) * tolPct / 100;
const nearPp = (x, target, pp) => Math.abs(x - target) <= pp;

describe('Golden set A — calendar reviews {5,10,15}y, DRAW £36k, E0 £450k', () => {
  const cfg = {
    E0: 450000, ladderYears: 15, L: 180, firstRung: 16, maxRung: 33,
    draw: 36000, trigger: { mode: 'calendar', reviews: [60, 120, 180] },
    END: 396, realYield: 0.023, glideRate: 0.05, startAge: 62
  };
  const res = runLadderWindows(cfg);
  const st = res.stats;

  it('window counts (n≈1,650 stage-1 / ≈1,434 two-stage)', () => {
    expect(res.meta.stage1N).toBeGreaterThanOrEqual(1640);
    expect(res.meta.stage1N).toBeLessThanOrEqual(1660);
    expect(res.meta.fullN).toBeGreaterThanOrEqual(1424);
    expect(res.meta.fullN).toBeLessThanOrEqual(1444);
  });

  it('review fire rates ≈ 61/54/51%, never ≈ 18% (±2pp)', () => {
    expect(nearPp(st.reviewFirePct[0], 61, 2), `r1=${st.reviewFirePct[0]}`).toBe(true);
    expect(nearPp(st.reviewFirePct[1], 54, 2), `r2=${st.reviewFirePct[1]}`).toBe(true);
    expect(nearPp(st.reviewFirePct[2], 51, 2), `r3=${st.reviewFirePct[2]}`).toBe(true);
    expect(nearPp(st.neverPct, 18, 2), `never=${st.neverPct}`).toBe(true);
  });

  it('secured distribution: 0 yrs ≈ 21%, 8+ ≈ 60%, median ≈ 11 (±2pp / ±1)', () => {
    expect(nearPp(st.securedZeroPct, 21, 2), `zero=${st.securedZeroPct}`).toBe(true);
    expect(nearPp(st.secured8PlusPct, 60, 2), `eight=${st.secured8PlusPct}`).toBe(true);
    expect(Math.abs(st.securedMedian - 11)).toBeLessThanOrEqual(1);
  });

  it('equity at 15y: median ≈ £937k, p10 ≈ £489k, worst ≈ £326k (±3%)', () => {
    expect(near(st.sleeveMedian, 937000, 3), `med=${st.sleeveMedian}`).toBe(true);
    expect(near(st.sleeveP10, 489000, 3), `p10=${st.sleeveP10}`).toBe(true);
    expect(near(st.sleeveWorst, 326000, 3), `worst=${st.sleeveWorst}`).toBe(true);
  });

  it('no-review hold median ≈ £1,250k (±3%)', () => {
    expect(near(st.holdMedian * 450000, 1250000, 3), `hold=${st.holdMedian * 450000}`).toBe(true);
  });

  it('two-stage survival is 100% on BOTH branches', () => {
    expect(st.survivalPct).toBe(100);
    expect(st.survivalNeverBranchPct).toBe(100);
  });

  it('vintages: 1929-09 / 1966-01 / 2000-01 never trigger (≈£417k/£418k/£611k ±3%); 2008-06 ≈12; 1985-01 to cap', () => {
    const at = (y, m) => res.windows[windowFor(y, m)];
    for (const [y, m, sleeve] of [[1929, 9, 417000], [1966, 1, 418000], [2000, 1, 611000]]) {
      const w = at(y, m);
      expect(w.neverTriggered, `${y}-${m} triggered`).toBe(true);
      expect(near(w.sleeveAtLadderEnd, sleeve, 3), `${y}-${m} sleeve=${w.sleeveAtLadderEnd}`).toBe(true);
    }
    expect(Math.abs(at(2008, 6).secured - 12)).toBeLessThanOrEqual(1);
    expect(at(1985, 1).secured).toBe(33 - 16 + 1);   // ratcheted to the cap
  });
});

describe('Golden set B — E0 £150k, ladder 20y, DRAW £22k, rungs 21–30, horizon 92', () => {
  const base = {
    E0: 150000, ladderYears: 20, L: 240, firstRung: 21, maxRung: 30,
    draw: 22000, END: 360, realYield: 0.023, glideRate: 0.05, startAge: 62
  };
  const band = runLadderWindows({ ...base, trigger: { mode: 'band', b: 1.2 } });
  const cal = runLadderWindows({ ...base, trigger: { mode: 'calendar', reviews: [60, 120, 180, 240] } });

  it('band: never ≈ 13%, sell events median 3 max 5, fully secured ≈ 56% (±2pp)', () => {
    expect(nearPp(band.stats.neverPct, 13, 2), `never=${band.stats.neverPct}`).toBe(true);
    expect(band.stats.sellEventsMedian).toBe(3);
    expect(band.stats.sellEventsMax).toBeLessThanOrEqual(5);
    expect(nearPp(band.stats.fullySecuredPct, 56, 2), `full=${band.stats.fullySecuredPct}`).toBe(true);
  });

  it('band: sleeve at 82 median ≈ £369k worst ≈ £105k; survival 100%; terminal median ≈ £587k (±3%)', () => {
    expect(near(band.stats.sleeveMedian, 369000, 3), `med=${band.stats.sleeveMedian}`).toBe(true);
    expect(near(band.stats.sleeveWorst, 105000, 3), `worst=${band.stats.sleeveWorst}`).toBe(true);
    expect(band.stats.survivalPct).toBe(100);
    expect(near(band.stats.terminalMedian, 587000, 3), `term=${band.stats.terminalMedian}`).toBe(true);
  });

  it('calendar: never ≈ 16%, fully secured ≈ 53%, sleeve at 82 ≈ £404k, terminal ≈ £657k', () => {
    // Appendix A's stage1_calendar tracks only rungs bought (no fire flag), so the
    // "never" figure is the secured-zero rate — the quantity its reference computes.
    expect(nearPp(cal.stats.securedZeroPct, 16, 2), `never(sec0)=${cal.stats.securedZeroPct}`).toBe(true);
    expect(nearPp(cal.stats.fullySecuredPct, 53, 2), `full=${cal.stats.fullySecuredPct}`).toBe(true);
    expect(near(cal.stats.sleeveMedian, 404000, 3), `med=${cal.stats.sleeveMedian}`).toBe(true);
    expect(near(cal.stats.terminalMedian, 657000, 3), `term=${cal.stats.terminalMedian}`).toBe(true);
  });

  it('20y untouched hold: median ≈ 3.82×', () => {
    expect(band.stats.holdMedian).toBeCloseTo(3.82, 1);
  });
});
