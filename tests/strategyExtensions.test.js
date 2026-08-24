/**
 * Phase G extensions — every one opt-in; default-off byte-identity is pinned by the golden
 * sets, so these tests assert the ON behaviour's direction and invariants.
 */
import { describe, it, expect } from 'vitest';
import { runLadderWindows } from '../src/strategies/LadderAndRatchet.js';
import { runFlexWindows } from '../src/strategies/FloorAndFlex.js';

const B = {
  E0: 183500, ladderYears: 23, L: 276, firstRung: 24, maxRung: 35,
  draw: 27500, END: 420, realYield: 0.023, glideRate: 0.05, startAge: 57,
  trigger: { mode: 'band', b: 1.2 }
};

describe('Phase G — ladder extensions', () => {
  const off = runLadderWindows(B);

  it('transaction costs make rungs dearer → fewer secured in aggregate', () => {
    // NOT per-window: an early skim that buys less leaves a bigger sleeve that can ratchet
    // MORE at a later trigger (path dependence). The honest invariant is aggregate.
    const on = runLadderWindows({ ...B, txCostBps: 50 });
    const mean = (r) => r.windows.reduce((t, w) => t + w.secured, 0) / r.windows.length;
    expect(mean(on)).toBeLessThanOrEqual(mean(off) + 1e-9);
    expect(on.windows.some((w, i) => w.secured < off.windows[i].secured)).toBe(true);
  });

  it('stochastic yields are reproducible and stay centred on the flat anchor', () => {
    const a = runLadderWindows({ ...B, yieldVol: 0.004 });
    const b = runLadderWindows({ ...B, yieldVol: 0.004 });
    expect(a.stats.securedMedian).toBe(b.stats.securedMedian);        // deterministic per window
    expect(Math.abs(a.stats.securedMedian - off.stats.securedMedian)).toBeLessThanOrEqual(2);
  });

  it('triggers continuing in decumulation can only ADD secured years (one-way rule)', () => {
    const on = runLadderWindows({ ...B, triggersContinueInDecumulation: true });
    for (let i = 0; i < on.meta.fullN; i += 37) {
      expect(on.windows[i].secured).toBeGreaterThanOrEqual(off.windows[i].secured);
    }
    expect(on.stats.survivalPct).toBeGreaterThanOrEqual(off.stats.survivalPct - 1e-9);
  });

  it('spending-flex guardrail improves worst-case survival, never worsens it', () => {
    const tight = { ...B, E0: 120000 };                       // stressed sleeve
    const offT = runLadderWindows(tight);
    const onT = runLadderWindows({ ...tight, spendFlex: { cutPct: 0.15, floorMult: 1 } });
    expect(onT.stats.survivalPct).toBeGreaterThanOrEqual(offT.stats.survivalPct);
  });
});

describe('Phase G — Floor & Flex annuity swap', () => {
  it('the swap deducts once when affordable and only lowers terminals', () => {
    const off = runFlexWindows({ E0: 552574, rate: 0.04, END: 420 });
    const on = runFlexWindows({ E0: 552574, rate: 0.04, END: 420, annuitySwap: { atYear: 20, cost: 150000 } });
    let swapped = 0;
    for (let i = 0; i < on.windows.length; i += 41) {
      expect(on.windows[i].terminal).toBeLessThanOrEqual(off.windows[i].terminal + 1e-6);
      if (on.windows[i].annuitySwapDone) swapped++;
    }
    expect(swapped).toBeGreaterThan(0);
  });
});
