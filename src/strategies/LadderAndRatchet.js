/**
 * Ladder & Ratchet (strategy brief §4c) — "Your full income bolted to the calendar. Growth
 * ratchets more years on." Real-terms, historical-window strategy: a base linker ladder covers
 * the first N years; the equity sleeve, checked by the shared trigger discipline (band monthly
 * or calendar reviews), skims surplus above the glide path into further whole rungs, each sized
 * to the income profile for the year it funds. Decumulation: rungs pay their years; then the
 * sleeve pays the profile; sleeve ≤ £0 is failure at that age. The never-triggered branch is
 * always reported separately.
 */

import { getRtr, stage1Band, stage1Calendar, stage2, flatYieldPricer, pct, dataMeta, monthIndexFor } from './ladderEngine.js';
import { profileTargetForYear } from '../services/IncomeProfile.js';
import { ENGINE_VERSION } from './version.js';

export const LADDER_DEFAULTS = {
  realYield: 0.023, glideRate: 0.05, bandThreshold: 1.2, startAge: 57
};

/**
 * Run every historical window for a Ladder & Ratchet configuration.
 * @param {object} cfg
 *  E0, ladderYears, L (months), firstRung, maxRung, draw (£/yr) OR profile (IncomeProfile),
 *  trigger: {mode:'band', b} | {mode:'calendar', reviews:[months]},
 *  END (months), realYield, glideRate, startAge
 */
export function runLadderWindows(cfg) {
  const rtr = getRtr();
  const drawForYear = (k) => cfg.profile
    ? profileTargetForYear(cfg.profile, k - 1, cfg.draw)
    : cfg.draw;
  const price = flatYieldPricer(drawForYear, cfg.realYield ?? LADDER_DEFAULTS.realYield);
  const gp = cfg.glideRate ?? LADDER_DEFAULTS.glideRate;
  const startAge = cfg.startAge ?? LADDER_DEFAULTS.startAge;

  const stage1N = rtr.length - cfg.L;          // windows with the full ladder period available
  const fullN = rtr.length - cfg.END;          // windows that can run to the horizon
  const out = {
    meta: { ...dataMeta(), stage1N, fullN, engineVersion: ENGINE_VERSION },
    windows: []
  };

  for (let s = 0; s < stage1N; s++) {
    const s1 = cfg.trigger.mode === 'band'
      ? stage1Band({ rtr, s, E0: cfg.E0, L: cfg.L, firstRung: cfg.firstRung, maxRung: cfg.maxRung, priceForYear: price, b: cfg.trigger.b ?? LADDER_DEFAULTS.bandThreshold, gp })
      : stage1Calendar({ rtr, s, E0: cfg.E0, reviews: cfg.trigger.reviews, firstRung: cfg.firstRung, maxRung: cfg.maxRung, priceForYear: price, gp });
    // Calendar reviews may end before the ladder does (Config B: last review yr 20, ladder
    // 23y) — grow the sleeve from the last review to the ladder end before anything reads it.
    let sleeveAtL = s1.V;
    if (cfg.trigger.mode === 'calendar' && s1.lastReview < cfg.L) {
      sleeveAtL = s1.V * (rtr[s + cfg.L] / rtr[s + s1.lastReview]);
    }
    const w = {
      s,
      secured: s1.secured,
      sellEvents: s1.sellEvents ?? s1.trades.length,
      trades: s1.trades,
      fires: s1.fires || null,
      sleeveAtLadderEnd: sleeveAtL,
      // "Never triggered": band = never sold; calendar = no review ever saw V > G (a fired
      // review that couldn't afford a whole rung still counts as triggered — the brief quotes
      // never ≈20% vs secured-zero ≈22% as DIFFERENT numbers).
      neverTriggered: cfg.trigger.mode === 'band' ? (s1.sellEvents === 0) : !(s1.fires || []).some((f) => f.fired),
      holdMultiple: rtr[s + cfg.L] / rtr[s]
    };
    if (s < fullN) {
      const s2 = stage2({ rtr, s, V0: sleeveAtL, L: cfg.L, ladderYears: cfg.ladderYears, secured: s1.secured, drawForYear, END: cfg.END, startAge });
      w.survived = s2.survived;
      w.failAge = s2.failAge;
      w.terminal = s2.terminal;
    }
    out.windows.push(w);
  }
  // Headline statistics over the TWO-STAGE window population (windows that can run to the
  // horizon) — the set the golden numbers were computed on; stage-1-only windows are still
  // returned for inspection.
  out.stats = ladderStats(out.windows.slice(0, fullN), fullN, cfg);
  return out;
}

function ladderStats(windows, fullN, cfg) {
  const n = windows.length;
  const secured = windows.map((w) => w.secured);
  const sleeves = windows.map((w) => w.sleeveAtLadderEnd);
  const never = windows.filter((w) => w.neverTriggered);
  const full = windows.slice(0, fullN).filter((w) => w.survived !== undefined);
  const fullSecured = cfg.maxRung - cfg.firstRung + 1;
  const stats = {
    n,
    neverPct: 100 * never.length / n,
    fullySecuredPct: 100 * windows.filter((w) => w.secured >= fullSecured).length / n,
    securedMedian: pct(secured, 0.5),
    securedZeroPct: 100 * secured.filter((x) => x === 0).length / n,
    secured8PlusPct: 100 * secured.filter((x) => x >= 8).length / n,
    sleeveMedian: pct(sleeves, 0.5),
    sleeveP10: pct(sleeves, 0.10),
    sleeveWorst: Math.min(...sleeves),
    holdMedian: pct(windows.map((w) => w.holdMultiple), 0.5),
    survivalPct: full.length ? 100 * full.filter((w) => w.survived).length / full.length : null,
    survivalNeverBranchPct: (() => {
      const nb = full.filter((w) => w.neverTriggered);
      return nb.length ? 100 * nb.filter((w) => w.survived).length / nb.length : null;
    })(),
    terminalMedian: pct(full.filter((w) => w.terminal != null).map((w) => w.terminal), 0.5),
    sellEventsMedian: pct(windows.map((w) => w.sellEvents), 0.5),
    sellEventsMax: Math.max(...windows.map((w) => w.sellEvents))
  };
  if (cfg.trigger.mode === 'calendar') {
    stats.reviewFirePct = cfg.trigger.reviews.map((t) =>
      100 * windows.filter((w) => (w.fires || []).some((f) => f.t === t && f.fired)).length / n);
  }
  return stats;
}

export function windowFor(year, month) {
  return monthIndexFor(year, month);
}

export const LadderAndRatchet = {
  id: 'ladder-and-ratchet',
  name: 'Ladder & Ratchet',
  promise: 'Your full income bolted to the calendar. Growth ratchets more years on.',
  failure: 'If markets never boom, the growth pot arrives small at the far end.',
  granularity: 'windows',
  describe() {
    return {
      id: this.id, name: this.name, promise: this.promise, failure: this.failure,
      engineVersion: ENGINE_VERSION,
      components: ['linker ladder (base + ratcheted rungs)', 'shared trigger discipline (band/calendar)',
        'income profile-sized rungs', 'real-terms historical windows (Shiller)'],
      usesTrigger: true
    };
  },
  engine: { runWindows: runLadderWindows }
};
