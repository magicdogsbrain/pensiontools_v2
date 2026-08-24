/**
 * Ladder engine — real-terms historical-window simulation core for the two ladder strategies
 * (strategy brief §4c/§4e). EXACT port of the Appendix A reference implementation; golden sets
 * A/B/C (Appendix B) pin the semantics. All amounts REAL (today's money).
 *
 * Data: bundled Shiller monthly P/D/CPI (1871-01..2023-06, 1,830 rows — the vintage whose
 * window counts reproduce the brief's n≈1,650/1,373/1,409). Phase F replaces the flat-yield
 * rung pricing with the live linker curve; the engine takes priceForYear so nothing changes
 * structurally.
 */

import shiller from '../data/shiller.js';

/** Real total-return index from monthly P, D, CPI (Appendix A real_tr_index). */
export function realTrIndex(data = shiller) {
  const { P, D, CPI } = data;
  const cpiL = CPI[CPI.length - 1];
  const rp = P.map((p, i) => p * cpiL / CPI[i]);
  const rd = D.map((d, i) => d * cpiL / CPI[i]);
  const rtr = new Array(rp.length).fill(1);
  for (let i = 1; i < rp.length; i++) {
    rtr[i] = rtr[i - 1] * (rp[i] + rd[i] / 12) / rp[i - 1];
  }
  return rtr;
}

let _rtr = null;
export function getRtr() {
  if (!_rtr) _rtr = realTrIndex();
  return _rtr;
}

/** Month index in the bundled series for a calendar year-month, or -1. */
export function monthIndexFor(year, month) {
  const [sy, sm] = shiller.start.split('-').map(Number);
  const idx = (year - sy) * 12 + (month - sm);
  return idx >= 0 && idx < shiller.P.length ? idx : -1;
}

export function dataMeta() {
  return { start: shiller.start, end: shiller.end, months: shiller.P.length };
}

/** Rung price for plan-year k seen at month t (flat real yield): P(k) × (1+y)^-(k − t/12). */
export const flatYieldPricer = (drawForYear, ry) => (k, tMonths) =>
  drawForYear(k) * Math.pow(1 + ry, -(k - tMonths / 12));

/**
 * Stage 1, band mode (Appendix A stage1_band): monthly check; fires when V ≥ b×G(t); skims the
 * excess above the path into whole sequential rungs.
 * @returns {{V, secured, sellEvents, trades: [{t, bought}]}}
 */
export function stage1Band({ rtr, s, E0, L, firstRung, maxRung, priceForYear, b = 1.2, gp = 0.05 }) {
  let V = E0, nxt = firstRung, sec = 0, sells = 0;
  const trades = [];
  for (let t = 1; t <= L; t++) {
    V *= rtr[s + t] / rtr[s + t - 1];
    const G = E0 * Math.pow(1 + gp, t / 12);
    if (V >= b * G && nxt <= maxRung) {
      let ex = V - G, bought = 0;
      while (nxt <= maxRung) {
        const c = priceForYear(nxt, t);
        if (ex >= c) { ex -= c; V -= c; sec += 1; nxt += 1; bought += 1; }
        else break;
      }
      if (bought) { sells += 1; trades.push({ t, bought }); }
    }
  }
  return { V, secured: sec, sellEvents: sells, trades };
}

/**
 * Stage 1, calendar mode (Appendix A stage1_calendar): reviews at fixed months; skims whenever
 * V > G(t) (no band multiple).
 * @returns {{V, secured, lastReview, trades}}
 */
export function stage1Calendar({ rtr, s, E0, reviews, firstRung, maxRung, priceForYear, gp = 0.05 }) {
  let V = E0, last = 0, nxt = firstRung, sec = 0;
  const trades = [];
  const fires = [];   // a review FIRES when V > G — distinct from managing to buy a rung
  for (const t of reviews) {
    V *= rtr[s + t] / rtr[s + last];
    last = t;
    const G = E0 * Math.pow(1 + gp, t / 12);
    const fired = V > G;
    fires.push({ t, fired });
    if (fired) {
      let ex = V - G, bought = 0;
      while (nxt <= maxRung) {
        const c = priceForYear(nxt, t);
        if (ex >= c) { ex -= c; V -= c; sec += 1; nxt += 1; bought += 1; }
        else break;
      }
      if (bought) trades.push({ t, bought });
    }
  }
  return { V, secured: sec, lastReview: last, trades, fires };
}

/**
 * Stage 2 (Appendix A stage2): rungs pay through (ladderYears + secured); thereafter the sleeve
 * pays the draw monthly. Returns survival, failure age (57 + m/12 per the reference), terminal.
 * `drawForYear` sizes the post-ladder draw to the profile (flat DRAW in the goldens).
 */
export function stage2({ rtr, s, V0, L, ladderYears, secured, drawForYear, END, startAge = 57 }) {
  let V = V0;
  const dstart = (ladderYears + secured) * 12;
  for (let m = L; m < END; m++) {
    V *= rtr[s + m + 1] / rtr[s + m];
    if (m >= dstart) {
      V -= drawForYear(Math.floor(m / 12) + 1) / 12;
      if (V <= 0) return { survived: false, failAge: startAge + m / 12, terminal: 0 };
    }
  }
  return { survived: true, failAge: null, terminal: V };
}

/** Percentile helper on a copy. */
export function pct(arr, p) {
  const a = [...arr].sort((x, y) => x - y);
  if (!a.length) return NaN;
  return a[Math.min(a.length - 1, Math.floor(p * a.length))];
}
