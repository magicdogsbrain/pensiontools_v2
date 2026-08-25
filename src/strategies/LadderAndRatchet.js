/**
 * Ladder & Ratchet (strategy brief §4c) — "Your full income bolted to the calendar. Growth
 * ratchets more years on." Real-terms, historical-window strategy: a base linker ladder covers
 * the first N years; the equity sleeve, checked by the shared trigger discipline (band monthly
 * or calendar reviews), skims surplus above the glide path into further whole rungs, each sized
 * to the income profile for the year it funds. Decumulation: rungs pay their years; then the
 * sleeve pays the profile; sleeve ≤ £0 is failure at that age. The never-triggered branch is
 * always reported separately.
 */

import { getRtr, bootstrapRtr, stage1Band, stage1Calendar, stage2, flatYieldPricer, curvePricer, pct, dataMeta, monthIndexFor } from './ladderEngine.js';
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
/**
 * Monte Carlo run: N block-bootstrapped synthetic paths through the same stage1/stage2 core.
 * Returns the same stats shape as runLadderWindows plus a survival confidence half-width
 * (95%, displayed per Appendix D — never hidden).
 */
export function runLadderMonteCarlo(cfg, runs = 1000) {
  const paths = [];
  for (let i = 0; i < runs; i++) paths.push(bootstrapRtr(i * 12345 + 7, cfg.END));
  const sub = runLadderCore(cfg, paths, paths.map(() => 0));
  const p = (sub.stats.survivalPct ?? 100) / 100;
  sub.stats.survivalHalfWidthPp = 196 * Math.sqrt(Math.max(0, p * (1 - p)) / runs) / 2 * 2 / 2; // 1.96·√(p(1−p)/n) in pp
  sub.stats.survivalHalfWidthPp = +(1.96 * Math.sqrt(Math.max(0, p * (1 - p)) / runs) * 100).toFixed(2);
  sub.meta.mode = 'montecarlo';
  sub.meta.runs = runs;
  return sub;
}

export function runLadderWindows(cfg) {
  const rtr = getRtr();
  const stage1N = rtr.length - cfg.L;          // windows with the full ladder period available
  const fullN = rtr.length - cfg.END;          // windows that can run to the horizon
  return runLadderCoreHistorical(cfg, rtr, stage1N, fullN);
}

function runLadderCoreHistorical(cfg, rtr, stage1N, fullN) {
  const drawForYear = (k) => cfg.profile
    ? profileTargetForYear(cfg.profile, k - 1, cfg.draw)
    : cfg.draw;
  // Phase G extensions — ALL default off; goldens pin the off path (see tests).
  const ry0 = cfg.realYield ?? LADDER_DEFAULTS.realYield;
  const txMult = 1 + (cfg.txCostBps || 0) / 10000;
  // Curve-priced when the cfg carries yieldForYear (live linker curve); flat otherwise (goldens).
  const priceBase = cfg.yieldForYear ? curvePricer(drawForYear, cfg.yieldForYear) : flatYieldPricer(drawForYear, ry0);
  const price = (k, t, yOverride) => (yOverride != null
    ? drawForYear(k) * Math.pow(1 + yOverride, -(k - t / 12))
    : priceBase(k, t)) * txMult;
  const gp = cfg.glideRate ?? LADDER_DEFAULTS.glideRate;
  const startAge = cfg.startAge ?? LADDER_DEFAULTS.startAge;
  const out = {
    meta: { ...dataMeta(), stage1N, fullN, engineVersion: ENGINE_VERSION },
    windows: []
  };

  for (let s = 0; s < stage1N; s++) {
    // Stochastic yield path for this window (deterministic in s — reproducible)
    let yPath = null;
    if (cfg.yieldVol > 0) {
      yPath = new Array(cfg.END + 1);
      let y = ry0;
      let seed = (s * 2654435761) >>> 0;
      const rnd = () => { seed = (1103515245 * seed + 12345) >>> 0; return (seed / 4294967296) - 0.5; };
      for (let t = 0; t <= cfg.END; t++) {
        yPath[t] = y;
        y = ry0 + 0.97 * (y - ry0) + cfg.yieldVol * rnd();
      }
    }
    const priceAt = yPath ? (k, t) => price(k, t, yPath[t]) : price;
    const s1 = cfg.trigger.mode === 'band'
      ? stage1Band({ rtr, s, E0: cfg.E0, L: cfg.L, firstRung: cfg.firstRung, maxRung: cfg.maxRung, priceForYear: priceAt, b: cfg.trigger.b ?? LADDER_DEFAULTS.bandThreshold, gp })
      : stage1Calendar({ rtr, s, E0: cfg.E0, reviews: cfg.trigger.reviews, firstRung: cfg.firstRung, maxRung: cfg.maxRung, priceForYear: priceAt, gp });
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
      let s2;
      if (cfg.triggersContinueInDecumulation && cfg.trigger.mode === 'band') {
        // Band checks continue in stage 2: any surplus above the (continuing) glide path still
        // buys remaining rungs, which push the sleeve-draw start later.
        let V = sleeveAtL, sec = s1.secured, nxt = cfg.firstRung + s1.secured;
        let survived = true, failAge = null;
        for (let m = cfg.L; m < cfg.END; m++) {
          V *= rtr[s + m + 1] / rtr[s + m];
          const t = m + 1;
          const G = cfg.E0 * Math.pow(1 + gp, t / 12);
          if (V >= (cfg.trigger.b ?? 1.2) * G && nxt <= cfg.maxRung) {
            let ex = V - G;
            while (nxt <= cfg.maxRung) {
              const c = priceAt(nxt, t);
              if (ex >= c) { ex -= c; V -= c; sec += 1; nxt += 1; } else break;
            }
          }
          if (m >= (cfg.ladderYears + sec) * 12) {
            V -= drawForYear(Math.floor(m / 12) + 1) / 12;
            if (V <= 0) { survived = false; failAge = startAge + m / 12; V = 0; break; }
          }
        }
        s2 = { survived, failAge, terminal: V };
        w.secured = sec;
      } else {
        s2 = stage2({ rtr, s, V0: sleeveAtL, L: cfg.L, ladderYears: cfg.ladderYears, secured: s1.secured, drawForYear, END: cfg.END, startAge,
          spendFlex: cfg.spendFlex });
      }
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

function statsFromWindows(windows, fullN, cfg) { return ladderStats(windows, fullN, cfg); }

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

function runLadderCore(cfg, paths) {
  // Each synthetic path is its own tiny "history" of exactly END months; run window s=0 on it.
  const out = { meta: { stage1N: paths.length, fullN: paths.length }, windows: [] };
  for (const rtr of paths) {
    const sub = runLadderCoreHistorical(cfg, rtr, 1, 1);
    out.windows.push(sub.windows[0]);
  }
  out.stats = out.windows.length ? statsFromWindows(out.windows, out.windows.length, cfg) : null;
  return out;
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
