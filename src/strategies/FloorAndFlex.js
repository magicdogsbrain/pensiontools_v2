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
 * £ collars and the ratchet hook).
 * @param {object} cfg { E0, rate=0.04, END, flexMin?, flexMax?,
 *   ratchet?: {mode:'band'|'calendar', b?, reviews?, gp?, target:'raise'|'extend',
 *              priceForYear, maxRung} }
 */
export function runFlexWindows(cfg) {
  const rtr = getRtr();
  const n = rtr.length - cfg.END;
  const rate = cfg.rate ?? 0.04;
  const out = { meta: { ...dataMeta(), n, engineVersion: ENGINE_VERSION }, windows: [] };

  for (let s = 0; s < n; s++) {
    let V = cfg.E0;
    let d = rate * cfg.E0;
    const clamp = (x) => Math.min(cfg.flexMax ?? Infinity, Math.max(cfg.flexMin ?? 0, x));
    d = clamp(d);
    const dByYear = [d];
    let extraSecured = 0;
    for (let m = 0; m < cfg.END; m++) {
      V *= rtr[s + m + 1] / rtr[s + m];
      V -= d / 12;
      // Optional ratchet: band check monthly on the sleeve vs its own glide path
      if (cfg.ratchet && cfg.ratchet.mode === 'band') {
        const t = m + 1;
        const G = cfg.E0 * Math.pow(1 + (cfg.ratchet.gp ?? 0.05), t / 12);
        if (V >= (cfg.ratchet.b ?? 1.2) * G && extraSecured < (cfg.ratchet.maxRung ?? 10)) {
          let ex = V - G;
          while (extraSecured < (cfg.ratchet.maxRung ?? 10)) {
            const c = cfg.ratchet.priceForYear(extraSecured + 1, t);
            if (ex >= c) { ex -= c; V -= c; extraSecured += 1; } else break;
          }
        }
      }
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
      extraSecured
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
    terminalMin: Math.min(...terms)
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
