/**
 * Floor & Flex (strategy brief §4e) — "The bills are paid to a chosen age by contract.
 * Everything else flexes with the market." A linker ladder funds essentials (profile-capable)
 * from year 1 to the floor horizon; the remainder rides in equities paying discretionary
 * income as sleeve_rate × sleeve value, reset each plan year (percentage-of-pot cannot deplete
 * the sleeve — the honest risk is lean years, so lean-year metrics are first-class outputs).
 * Optional ratchet (default OFF, matching the pure design): the shared trigger discipline runs
 * on the sleeve and firings buy floor RAISES (cheapest-first = furthest years first) or
 * horizon EXTENSIONS. Golden set C pins the no-ratchet semantics exactly (Appendix A
 * floor_and_flex); the ratchet is property-tested.
 */

import { getRtr, pct, dataMeta } from './ladderEngine.js';
import { ENGINE_VERSION } from './version.js';

/** Deterministic floor cost at flat real yield: Σ P(k) × (1+y)^-k over years 1..horizon. */
export function floorCost({ drawForYear, years, realYield }) {
  let c = 0;
  for (let k = 1; k <= years; k++) c += drawForYear(k) * Math.pow(1 + realYield, -k);
  return c;
}

/**
 * All historical windows of the flex sleeve (Appendix A floor_and_flex, extended with optional
 * £ collars and the full §4e ratchet).
 *
 * RATCHET (default OFF — matching the pure design): the shared trigger discipline runs on the
 * sleeve against its own glide path G(t) = E0×(1+gp)^(t/12). A firing skims the excess above
 * the path and spends it on ONE of (user's choice):
 *   target:'extend' — whole extra floor YEARS beyond the horizon, sequential, priced
 *     P(H+n)×(1+y)^-(H+n − t/12), capped at maxExtendYears;
 *   target:'raise'  — continuous £ uplift of future floor rungs toward raiseTarget(k),
 *     CHEAPEST-FIRST: the furthest years carry the deepest discount, so uplift fills from the
 *     horizon backwards.
 *
 * @param {object} cfg { E0, rate=0.04, END, flexMin?, flexMax?,
 *   ratchet?: { mode:'band'|'calendar', b?, reviews?, gp?, realYield?,
 *               target:'extend'|'raise', horizonYears?, floorDrawForYear?, raiseTargetForYear?,
 *               maxExtendYears? } }
 */
export function runFlexWindows(cfg) {
  const rtr = getRtr();
  const n = rtr.length - cfg.END;
  const rate = cfg.rate ?? 0.04;
  const out = { meta: { ...dataMeta(), n, engineVersion: ENGINE_VERSION }, windows: [] };
  const R = cfg.ratchet;
  const ry = R?.realYield ?? 0.023;
  const price = (k, t) => Math.pow(1 + ry, -(k - t / 12));

  for (let s = 0; s < n; s++) {
    let V = cfg.E0;
    let d = rate * cfg.E0;
    const clamp = (x) => Math.min(cfg.flexMax ?? Infinity, Math.max(cfg.flexMin ?? 0, x));
    d = clamp(d);
    const dByYear = [d];
    let extendYears = 0;
    let upliftSpent = 0;
    const uplift = {};   // year k -> £ uplift bought (raise mode)

    const fireRatchet = (t) => {
      const G = cfg.E0 * Math.pow(1 + (R.gp ?? 0.05), t / 12);
      if (V < (R.mode === 'band' ? (R.b ?? 1.2) : 1) * G) return;
      let ex = V - G;
      if (R.target === 'extend') {
        const H = R.horizonYears ?? 35;
        while (extendYears < (R.maxExtendYears ?? 8)) {
          const year = H + extendYears + 1;
          const amt = R.floorDrawForYear ? R.floorDrawForYear(year) : 0;
          const c = amt * price(year, t);
          if (c > 0 && ex >= c) { ex -= c; V -= c; extendYears += 1; upliftSpent += c; }
          else break;
        }
      } else if (R.target === 'raise') {
        // Cheapest-first: furthest future years first (deepest discount per £ of floor).
        const H = R.horizonYears ?? 35;
        const curYear = Math.floor(t / 12) + 1;
        for (let k = H; k > curYear && ex > 1e-9; k--) {
          const base = R.floorDrawForYear ? R.floorDrawForYear(k) : 0;
          const target = R.raiseTargetForYear ? R.raiseTargetForYear(k) : base;
          const need = Math.max(0, target - base - (uplift[k] || 0));
          if (need <= 0) continue;
          const unit = price(k, t);
          const affordable = Math.min(need, ex / unit);
          if (affordable > 1e-9) {
            uplift[k] = (uplift[k] || 0) + affordable;
            const c = affordable * unit;
            ex -= c; V -= c; upliftSpent += c;
          }
        }
      }
    };

    let annuitySwapDone = false;
    for (let m = 0; m < cfg.END; m++) {
      V *= rtr[s + m + 1] / rtr[s + m];
      // Phase G late-life annuity swap (opt-in): at swapAge, spend swapCost from the sleeve to
      // buy the true lifelong tail past the floor horizon (linkers run out ~2073, so this is
      // the honest answer to "lifelong"). Modelled as a one-off sleeve deduction.
      if (cfg.annuitySwap && !annuitySwapDone && m === (cfg.annuitySwap.atYear ?? 20) * 12) {
        if (V > cfg.annuitySwap.cost) { V -= cfg.annuitySwap.cost; annuitySwapDone = true; }
      }
      V -= d / 12;
      const t = m + 1;
      if (R && R.mode === 'band') fireRatchet(t);
      if (R && R.mode === 'calendar' && (R.reviews || []).includes(t)) fireRatchet(t);
      if ((m + 1) % 12 === 0) {
        d = clamp(rate * V);
        if (m + 1 < cfg.END) dByYear.push(d);
      }
    }
    out.windows.push({
      s,
      terminal: V,
      dByYear,
      worstYearD: Math.min(...dByYear),
      yearsUnder: (thr) => dByYear.filter((x) => x < thr).length,
      extendYears,
      uplift,
      upliftSpent,
      annuitySwapDone
    });
  }

  const worst = out.windows.map((w) => w.worstYearD);
  const terms = out.windows.map((w) => w.terminal);
  const allYears = out.windows.flatMap((w) => w.dByYear);
  out.stats = {
    n,
    year1D: rate * cfg.E0,
    worstMedian: pct(worst, 0.5),
    worstP10: pct(worst, 0.10),
    worstMin: Math.min(...worst),
    shareYearsUnder: (thr) => 100 * allYears.filter((x) => x < thr).length / allYears.length,
    terminalMedian: pct(terms, 0.5),
    terminalP10: pct(terms, 0.10),
    terminalMin: Math.min(...terms),
    extendYearsMedian: pct(out.windows.map((w) => w.extendYears), 0.5),
    upliftSpentMedian: pct(out.windows.map((w) => w.upliftSpent), 0.5)
  };
  return out;
}

export const FloorAndFlex = {
  id: 'floor-and-flex',
  name: 'Floor & Flex',
  promise: 'The bills are paid to a chosen age by contract. Everything else flexes with the market.',
  failure: 'Treats shrink in long bad markets — and the floor is only as right as your essentials number.',
  granularity: 'windows',
  describe() {
    return {
      id: this.id, name: this.name, promise: this.promise, failure: this.failure,
      engineVersion: ENGINE_VERSION,
      components: ['essentials floor by contract (linker ladder, profile-capable)',
        'flex sleeve (% of pot, annual reset, optional £ collars)',
        'optional ratchet via the shared trigger discipline', 'real-terms historical windows (Shiller)'],
      usesTrigger: true,
      sensitivity: 'at 2.3% real, every £1k/yr of essentials ≈ £24k of floor cost'
    };
  },
  engine: { runWindows: runFlexWindows, floorCost }
};
