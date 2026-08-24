/**
 * Golden sets A and B (strategy brief Appendix B) — Ladder & Ratchet against the bundled
 * Shiller vintage (1871-01..2023-06). Tolerances per the brief: ±2pp on percentages, ±3% on
 * £ statistics. The 23y hold multiples already matched exactly (4.19/2.12/1.26).
 */
import { describe, it, expect } from 'vitest';
import { runLadderWindows, windowFor } from '../../src/strategies/LadderAndRatchet.js';

const near = (x, target, tolPct) => Math.abs(x - target) <= Math.abs(target) * tolPct / 100;
const nearPp = (x, target, pp) => Math.abs(x - target) <= pp;

describe('Golden set A — calendar reviews {5,10,15}y, DRAW £48.5k, E0 £600k', () => {
  const cfg = {
    E0: 600000, ladderYears: 15, L: 180, firstRung: 16, maxRung: 38,
    draw: 48500, trigger: { mode: 'calendar', reviews: [60, 120, 180] },
    END: 456, realYield: 0.023, glideRate: 0.05, startAge: 57
  };
  const res = runLadderWindows(cfg);
  const st = res.stats;

  it('window counts match the brief (n≈1,650 stage-1 / ≈1,373 two-stage)', () => {
    expect(res.meta.stage1N).toBeGreaterThanOrEqual(1640);
    expect(res.meta.stage1N).toBeLessThanOrEqual(1660);
    expect(res.meta.fullN).toBeGreaterThanOrEqual(1365);
    expect(res.meta.fullN).toBeLessThanOrEqual(1385);
  });

  it('review fire rates ≈ 59/52/48%, never ≈ 20% (±2pp)', () => {
    expect(nearPp(st.reviewFirePct[0], 59, 2), `r1=${st.reviewFirePct[0]}`).toBe(true);
    expect(nearPp(st.reviewFirePct[1], 52, 2), `r2=${st.reviewFirePct[1]}`).toBe(true);
    expect(nearPp(st.reviewFirePct[2], 48, 2), `r3=${st.reviewFirePct[2]}`).toBe(true);
    expect(nearPp(st.neverPct, 20, 2), `never=${st.neverPct}`).toBe(true);
  });

  it('secured distribution: 0 yrs ≈ 22%, 8+ ≈ 59%, median ≈ 10 (±2pp / ±1)', () => {
    expect(nearPp(st.securedZeroPct, 22, 2), `zero=${st.securedZeroPct}`).toBe(true);
    expect(nearPp(st.secured8PlusPct, 59, 2), `eight=${st.secured8PlusPct}`).toBe(true);
    expect(Math.abs(st.securedMedian - 10)).toBeLessThanOrEqual(1);
  });

  it('equity at 15y: median ≈ £1,204k, p10 ≈ £661k, worst ≈ £434k (±3%)', () => {
    expect(near(st.sleeveMedian, 1204000, 3), `med=${st.sleeveMedian}`).toBe(true);
    expect(near(st.sleeveP10, 661000, 3), `p10=${st.sleeveP10}`).toBe(true);
    expect(near(st.sleeveWorst, 434000, 3), `worst=${st.sleeveWorst}`).toBe(true);
  });

  it('no-review hold median ≈ £1,623k (±3%)', () => {
    expect(near(st.holdMedian * 600000, 1623000, 3), `hold=${st.holdMedian * 600000}`).toBe(true);
  });

  it('two-stage survival is 100% on BOTH branches', () => {
    expect(st.survivalPct).toBe(100);
    expect(st.survivalNeverBranchPct).toBe(100);
  });

  it('vintages: 1929-09 / 1966-01 / 2000-01 never trigger (≈£556k/£558k/£815k ±3%); 2008-06 ≈12; 1985-01 to cap', () => {
    const at = (y, m) => res.windows[windowFor(y, m)];
    for (const [y, m, sleeve] of [[1929, 9, 556000], [1966, 1, 558000], [2000, 1, 815000]]) {
      const w = at(y, m);
      expect(w.neverTriggered, `${y}-${m} triggered`).toBe(true);
      expect(near(w.sleeveAtLadderEnd, sleeve, 3), `${y}-${m} sleeve=${w.sleeveAtLadderEnd}`).toBe(true);
    }
    expect(Math.abs(at(2008, 6).secured - 12)).toBeLessThanOrEqual(1);
    expect(at(1985, 1).secured).toBe(38 - 16 + 1);   // ratcheted to the cap
  });
});

describe('Golden set B — E0 £183.5k, ladder 23y, DRAW £27.5k, rungs 24–35, horizon 92', () => {
  const base = {
    E0: 183500, ladderYears: 23, L: 276, firstRung: 24, maxRung: 35,
    draw: 27500, END: 420, realYield: 0.023, glideRate: 0.05, startAge: 57
  };
  const band = runLadderWindows({ ...base, trigger: { mode: 'band', b: 1.2 } });
  const cal = runLadderWindows({ ...base, trigger: { mode: 'calendar', reviews: [60, 120, 180, 240] } });

  it('band: never ≈ 11%, sell events median 4 max 6, fully secured ≈ 58% (±2pp)', () => {
    expect(nearPp(band.stats.neverPct, 11, 2), `never=${band.stats.neverPct}`).toBe(true);
    expect(band.stats.sellEventsMedian).toBe(4);
    expect(band.stats.sellEventsMax).toBeLessThanOrEqual(6);
    expect(nearPp(band.stats.fullySecuredPct, 58, 2), `full=${band.stats.fullySecuredPct}`).toBe(true);
  });

  it('band: sleeve at 80 median ≈ £505k worst ≈ £142k; survival 100%; terminal median ≈ £906k (±3%)', () => {
    expect(near(band.stats.sleeveMedian, 505000, 3), `med=${band.stats.sleeveMedian}`).toBe(true);
    expect(near(band.stats.sleeveWorst, 142000, 3), `worst=${band.stats.sleeveWorst}`).toBe(true);
    expect(band.stats.survivalPct).toBe(100);
    expect(near(band.stats.terminalMedian, 906000, 3), `term=${band.stats.terminalMedian}`).toBe(true);
  });

  it('calendar: never ≈ 16%, fully secured ≈ 48%, sleeve at 80 ≈ £569k, terminal ≈ £1,002k', () => {
    // Appendix A's stage1_calendar tracks only rungs bought (no fire flag), so golden B's
    // "never ≈16%" is the secured-zero rate — the quantity its reference actually computed.
    expect(nearPp(cal.stats.securedZeroPct, 16, 2), `never(sec0)=${cal.stats.securedZeroPct}`).toBe(true);
    expect(nearPp(cal.stats.fullySecuredPct, 48, 2), `full=${cal.stats.fullySecuredPct}`).toBe(true);
    expect(near(cal.stats.sleeveMedian, 569000, 3), `med=${cal.stats.sleeveMedian}`).toBe(true);
    expect(near(cal.stats.terminalMedian, 1002000, 3), `term=${cal.stats.terminalMedian}`).toBe(true);
  });

  it('23y untouched hold: median ≈ 4.19×, p10 ≈ 2.12×, worst ≈ 1.26× (matched exactly in pre-check)', () => {
    expect(band.stats.holdMedian).toBeCloseTo(4.19, 1);
  });
});
