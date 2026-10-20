/**
 * ONE answer to "will the money last?" (research/v7/v6-usability-audit.md §1 problem 1 and §5 decision 2, option (a),
 * approved by the owner 17 Oct 2026).
 *
 * Every "will it last" figure the planner shows is read from the ONE stress test every strategy runs —
 * stressTestStrategy on the plan's own strategy, with the plan's own cuts setting and its full length — through the
 * helpers here. Until 6.24 the same plan read a different chance on almost every screen: the Monte Carlo tab ran its
 * own futures (5-year blocks of 1928–2024), the Historical tab its own start years from 1928, the Scenarios tab five
 * looped decades, the Strategies ranking ran with the cuts switched off ("level footing"), and "worst" meant the worst
 * of 1,000 in some places and the worst 1 in 10 in others. Now:
 *   - the chance is `100 − ruin.mc` of that one result, said as "lasts in 9 futures out of 10";
 *   - the bad case is the worst 1 in 10 (the 10th percentile), never the worst of 1,000;
 *   - the income cuts are counted from the same futures (how many were cut, by how much, for how long);
 *   - History and Scenarios explain that same test — its own real start years — with no rival percentage.
 *
 * Pure: no DOM, no storage, no engine. index.html reads words and figures from here (its script may only shrink).
 */

/** The named start years History and Scenarios explain: real crises, in plain words. */
export const NAMED_STARTS = [
  { year: 1929, label: 'the Great Depression' },
  { year: 1937, label: 'the 1937 slump' },
  { year: 1966, label: 'the 1966 start — the worst a retiree has had' },
  { year: 1973, label: 'the 1970s inflation' },
  { year: 2000, label: 'the dot-com bust and the lost decade' },
  { year: 2008, label: 'the 2008 crisis' }
];

const num = (v) => (typeof v === 'number' && Number.isFinite(v) ? v : 0);
const median = (arr) => { if (!arr.length) return 0; const s = [...arr].sort((a, b) => a - b); const m = Math.floor(s.length / 2); return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };

/**
 * "in 9 futures out of 10" from a share 0–1 — the same banding as the quick answer's words (PlanSeed.answerLastedWords,
 * language guide 3.4): 9 in 10 is the "on course" bar, so a share just under it must not read as 9.
 * @returns {{ n: number, words: string }}  n = whole futures out of 10 (for sorting and bars), words = the phrase
 */
export function futuresOutOfTen(share) {
  const s = Math.max(0, Math.min(1, num(share)));
  const n = Math.round(s * 10);
  if (s >= 1) return { n: 10, words: 'in every future it tried' };
  if (s >= 0.95) return { n: 10, words: 'in more than 9 futures out of 10' };
  if (s >= 0.9) return { n: 9, words: 'in 9 futures out of 10' };
  if (s >= 0.85) return { n: 9, words: 'in just under 9 futures out of 10' };
  if (s >= 0.15) return { n, words: 'in ' + n + ' futures out of 10' };
  if (s >= 0.05) return { n: 1, words: 'in only 1 future out of 10' };
  if (s > 0) return { n: 0, words: 'in fewer than 1 future out of 10' };
  return { n: 0, words: 'in none of the futures it tried' };
}

/** The lines a chance of lasting is judged against (on course, likely, at real risk), and the same for running out. */
export const CHANCE_BARS = [90, 75, 50];
export const RUIN_BARS = [10, 25, 50];

/**
 * A percentage said honestly (6.33.0): rounding never turns a near miss into a clean 100% or a trace into 0%, and never
 * carries a figure across one of `bar` (a number or a list — the lines the words beside it change at), so 89.6% never
 * reads "90%" beside "not on course". 99.8% of the years paid read "100%" beside income cuts until now; a 0.3% chance
 * of a cut read "0%". The figure keeps `dp` decimals and adds up to two more where rounding would mislead; if it still
 * would, it is cut toward its true side (89.996 → "89.99%", 99.999 → "99.99%"), and a trace reads "under 0.01%".
 * Exactly 0 and exactly 100 (and anything outside) read as themselves.
 * @returns {string} e.g. '98%', '99.8%', '89.99%', 'under 0.01%' — always with the % sign
 */
export function pctText(v, dp = 0, bar = null) {
  const x = num(v);
  if (x <= 0) return '0%';
  if (x >= 100) return '100%';
  const bars = bar == null ? [] : [].concat(bar).filter((b) => Number.isFinite(+b));
  const fair = (t) => t > 0 && t < 100 && bars.every((b) => (t >= b) === (x >= b));
  for (let d = dp; d <= dp + 2; d++) {
    const t = x.toFixed(d);
    if (fair(+t)) return t + '%';
  }
  const d = dp + 2, f = Math.pow(10, d);
  const down = Math.floor(x * f) / f;   // a cut, never a rounding up: stays below any line x is below, and under 100
  return fair(down) ? down.toFixed(d) + '%' : 'under ' + (1 / f).toFixed(d) + '%';
}

/**
 * The same share as futures out of 10 to one decimal (Compare allocations): never "10.0" while a future failed, never
 * "9.0" under the on-course line, never "0.0" while one lasted (6.33.0).
 */
export function tenthsOutOfTen(share) {
  const s = Math.max(0, Math.min(1, num(share)));
  const t = Math.round(s * 100) / 10;
  return (s < 1 && t >= 10 ? 9.9 : s < 0.9 && t >= 9 ? 8.9 : s > 0 && t <= 0 ? 0.1 : t).toFixed(1);
}

/**
 * The income cuts, counted from the per-future record of the one test (stressTest pnvRun: the engine's cutYears =
 * tax years in which more than 1% of the planned income went unpaid and was never caught up; cutReal = the income done
 * without over the run, today's money). A future that ran out is counted among the cut ones too.
 * @param {Array<{ failed: boolean, cutYears: number, cutReal: number }>} windows
 */
export function summariseCuts(windows, planYears) {
  const ws = Array.isArray(windows) ? windows : [];
  const cut = ws.filter((w) => w && (num(w.cutYears) > 0 || w.failed));
  const ranOut = cut.filter((w) => w.failed).length;
  const perYear = cut.map((w) => (num(w.cutYears) > 0 ? num(w.cutReal) / num(w.cutYears) : num(w.cutReal)));
  const years = cut.map((w) => Math.max(w.failed ? 1 : 0, num(w.cutYears)));
  const totals = cut.map((w) => num(w.cutReal));
  return {
    futures: ws.length,
    cutN: cut.length,
    cutPct: ws.length ? Math.round(1000 * cut.length / ws.length) / 10 : 0,
    ranOutN: ranOut,
    typicalCutPerYear: Math.round(median(perYear)),
    typicalCutYears: Math.round(Math.min(num(planYears) || Infinity, median(years))),
    typicalCutTotal: Math.round(median(totals)),
    worstCutTotal: Math.round(totals.length ? Math.max(...totals) : 0)
  };
}

/**
 * The figures every screen reads from one strategy result (stressTestStrategy) on one plan (planFromSettings).
 * null when there is no result or the strategy is not affordable on the plan.
 */
export function oneAnswer(r, p) {
  if (!r || !r.affordable || !r.ruin) return null;
  const chancePct = Math.max(0, Math.min(100, 100 - num(r.ruin.mc)));
  const share = chancePct / 100;
  const nHist = num(r.n && r.n.hist);
  const t = r.terminal || {};
  return {
    strategyId: r.strategyId || null,
    chancePct, share,
    outOfTen: futuresOutOfTen(share),
    futures: num(r.n && r.n.mc),
    histories: nHist,
    years: num(p && p.durationYears),
    histRanOutPct: num(r.ruin.hist),
    histRanOutN: Math.round(num(r.ruin.hist) * nHist / 100),
    typicalLeft: num(t.p50),
    badCaseLeft: num(t.p10),    // the worst 1 in 10 — never the worst of 1,000
    goodCaseLeft: num(t.p90),
    worst12: num(r.worst12 && r.worst12.min),
    coverage: r.coverage == null ? null : num(r.coverage),
    cuts: r.cuts || null,
    cutLabel: r.ruinLabel || null
  };
}

/** A month index since January 1871 (the one test's history) → the calendar start. */
export function startOfWindow(s) {
  const i = Math.max(0, Math.round(num(s)));
  return { year: 1871 + Math.floor(i / 12), month: (i % 12) + 1 };
}

/**
 * The worst start years, read from the one test's own per-window history (stressTest pnvTest `histWindows`): the
 * windows that ran out first, then the leanest of the rest. Each is marked as an unfair test — nobody retires into
 * the worst month of 150 years on purpose, but the test counts them all the same.
 */
export function worstStarts(histWindows, n = 5) {
  const ws = Array.isArray(histWindows) ? histWindows.filter(Boolean) : [];
  const key = (w) => (w.failed ? [0, num(w.failAge) || 0, num(w.worst12)] : [1, num(w.worst12), num(w.terminal)]);
  const sorted = [...ws].sort((a, b) => { const ka = key(a), kb = key(b); for (let i = 0; i < ka.length; i++) if (ka[i] !== kb[i]) return ka[i] - kb[i]; return 0; });
  return sorted.slice(0, Math.max(0, n)).map((w) => ({ ...startOfWindow(w.s), ...w, unfair: true }));
}

/**
 * A locked plan's document keeps the figure it was worked out with (never rewritten). When today's test on the same
 * plan gives a different figure, the page says so in one line. '' when they agree (within a tenth of a point on the
 * chance, and within half a percent on what is typically left) or either side is missing.
 */
export function earlierTestNote(storedR, liveR) {
  if (!storedR || !liveR || !storedR.affordable || !liveR.affordable || !storedR.ruin || !liveR.ruin) return '';
  const a = oneAnswer(storedR, {}), b = oneAnswer(liveR, {});
  const chanceMoved = Math.abs(a.chancePct - b.chancePct) >= 0.1;
  const leftMoved = Math.abs(a.typicalLeft - b.typicalLeft) > 0.005 * Math.max(1, Math.abs(a.typicalLeft));
  if (!chanceMoved && !leftMoved) return '';
  const gbp = (v) => '£' + Math.round(v).toLocaleString('en-GB');
  const pc = (v) => pctText(v, 0, CHANCE_BARS);
  let s = 'This figure was worked out under the earlier test, when the plan was locked: ' + pc(a.chancePct) + ' (' + a.outOfTen.words + ')';
  if (chanceMoved) s += '; today\'s test gives ' + pc(b.chancePct) + ' (' + b.outOfTen.words + ')';
  if (leftMoved) s += '; then typically ' + gbp(a.typicalLeft) + ' left, today ' + gbp(b.typicalLeft);
  s += '. The document keeps the figure it was locked with; the market data and the test have moved since.';
  return s;
}

/**
 * The Strategies ranking: by how many futures out of 10 each strategy lasts (the share of futures the plan is paid in
 * full), ties broken by the share of the plan's years it paid for. Rows: [{ id, r }] → [{ id, r, share, lasts }].
 */
export function rankByLasting(rows) {
  const out = (rows || []).filter((x) => x && x.r && x.r.affordable).map((x) => {
    const share = Math.max(0, Math.min(1, (100 - num(x.r.ruin && x.r.ruin.mc)) / 100));
    return { ...x, share, lasts: futuresOutOfTen(share) };
  });
  out.sort((a, b) => (b.share - a.share) || (num(b.r.coverage) - num(a.r.coverage)));
  return out;
}

/** What the plan's cuts setting is, in words — the one line every screen says about the cuts it ran with. */
export function cutsSettingWords(settings, strategyId) {
  const s = settings || {};
  const family = !strategyId || strategyId === 'pots-and-valves' || strategyId === 'buckets-in-order';
  if (!family) return 'no spending cuts — ' + (strategyId === 'floor-and-flex' ? 'the treats flex instead' : 'this strategy pays the plan in full until it cannot');
  if (s.disableProtection) return 'with spending cuts in a slump switched OFF (as you set it): the plan is paid in full until the money runs out';
  const cut = Math.round((1 - (s.protectionMult ?? 0.8)) * 100);
  const months = s.consecutiveLimit ?? 3;
  return 'with the spending cuts you set (up to ' + cut + '% after ' + months + ' month' + (months === 1 ? '' : 's') + ' in a row below the glidepath)';
}
