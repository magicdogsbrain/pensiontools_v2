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

/**
 * Monte Carlo path: a synthetic real total-return index built by CIRCULAR BLOCK BOOTSTRAP of
 * the historical monthly returns — random consecutive ~5-year blocks stitched together, so
 * regimes (a sustained 70s-style stretch) survive resampling, exactly as the nominal engine's
 * year-level bootstrap does. Deterministic per seed.
 * @returns {number[]} index of length months+1 starting at 1
 */
export function bootstrapRtr(seed, months, blockMonths = 60, data) {
  const hist = data || getRtr();
  const H = hist.length - 1;
  // Small deterministic LCG (no Math.random — reproducibility per Appendix D)
  let st = (seed * 2654435761 + 1) >>> 0;
  const rnd = () => { st = (1103515245 * st + 12345) >>> 0; return st / 4294967296; };
  const out = new Array(months + 1);
  out[0] = 1;
  let m = 0;
  while (m < months) {
    const start = Math.floor(rnd() * H);
    for (let b = 0; b < blockMonths && m < months; b++, m++) {
      const i = (start + b) % H;                     // circular wrap
      out[m + 1] = out[m] * (hist[i + 1] / hist[i]);
    }
  }
  return out;
}

/** Monthly CPI series aligned with getRtr() (same rows). */
export function getCpi(data = shiller) { return data.CPI; }

/**
 * PAIRED block bootstrap: the same random blocks applied to the real TR index AND the CPI index,
 * so a synthetic future carries its own inflation history (a 1970s block brings 1970s inflation).
 * Lets the nominal engines (Pots & Valves) run on exactly the market the ladders see.
 * Same LCG and block draw as bootstrapRtr for a given seed; bootstrapRtr itself is untouched.
 * @returns {{rtr:number[], cpi:number[]}} both length months+1, both starting at 1
 */
export function bootstrapPaths(seed, months, blockMonths = 60, data) {
  const hist = (data && data.rtr) || getRtr();
  const cpiH = (data && data.cpi) || getCpi();
  const H = hist.length - 1;
  let st = (seed * 2654435761 + 1) >>> 0;
  const rnd = () => { st = (1103515245 * st + 12345) >>> 0; return st / 4294967296; };
  const rtr = new Array(months + 1), cpi = new Array(months + 1);
  rtr[0] = 1; cpi[0] = 1;
  let m = 0;
  while (m < months) {
    const start = Math.floor(rnd() * H);
    for (let b = 0; b < blockMonths && m < months; b++, m++) {
      const i = (start + b) % H;
      rtr[m + 1] = rtr[m] * (hist[i + 1] / hist[i]);
      cpi[m + 1] = cpi[m] * (cpiH[i + 1] / cpiH[i]);
    }
  }
  return { rtr, cpi };
}

/** Annual NOMINAL equity returns + inflation for the P&V engine from a (real TR, CPI) path pair. */
export function annualNominal(rtr, cpi, off, planYears) {
  const equity = {}, inflation = {};
  for (let y = 0; y < planYears; y++) {
    const realR = rtr[off + 12 * (y + 1)] / rtr[off + 12 * y];
    const infl = cpi[off + 12 * (y + 1)] / cpi[off + 12 * y];
    equity[y] = realR * infl - 1;
    inflation[y] = infl - 1;
  }
  return { equity, inflation };
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

/** Rung price on a real-yield CURVE: yieldForYear(k) is the yield for a rung k plan-years out
 *  (LinkerUniverse.realYieldForYear from closing prices). Same discounting, term-specific rate. */
export const curvePricer = (drawForYear, yieldForYear) => (k, tMonths) =>
  drawForYear(k) * Math.pow(1 + yieldForYear(k), -(k - tMonths / 12));

/**
 * Stage 1, band mode (Appendix A stage1_band): monthly check; fires when V ≥ b×G(t); skims the
 * excess above the path into whole sequential rungs.
 * @returns {{V, secured, sellEvents, trades: [{t, bought}]}}
 */
export function stage1Band({ rtr, s, E0, L, firstRung, maxRung, priceForYear, b = 1.2, gp = 0.05 }) {
  let V = E0, nxt = firstRung, sec = 0, sells = 0;
  const trades = [];
  const vByYear = [E0];   // sleeve value at each plan-year boundary (cone of uncertainty)
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
    if (t % 12 === 0) vByYear[t / 12] = V;
  }
  return { V, secured: sec, sellEvents: sells, trades, vByYear };
}

/**
 * Stage 1, calendar mode (Appendix A stage1_calendar): reviews at fixed months; skims whenever
 * V > G(t) (no band multiple).
 * @returns {{V, secured, lastReview, trades}}
 */
export function stage1Calendar({ rtr, s, E0, reviews, firstRung, maxRung, priceForYear, gp = 0.05 }) {
  let V = E0, last = 0, nxt = firstRung, sec = 0;
  const trades = [];
  const fires = [];
  const vByYear = [E0];   // filled at review points only (calendar mode grows between reviews)   // a review FIRES when V > G — distinct from managing to buy a rung
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
    if (t % 12 === 0) vByYear[t / 12] = V;
  }
  return { V, secured: sec, lastReview: last, trades, fires, vByYear };
}

/**
 * Stage 2 (Appendix A stage2): rungs pay through (ladderYears + secured); thereafter the sleeve
 * pays the draw monthly. Returns survival, failure age (57 + m/12 per the reference), terminal.
 * `drawForYear` sizes the post-ladder draw to the profile (flat DRAW in the goldens).
 */
export function stage2({ rtr, s, V0, L, ladderYears, secured, drawForYear, END, startAge = 57, spendFlex = null }) {
  let V = V0;
  const dstart = (ladderYears + secured) * 12;
  const vByYear = {};   // year index → sleeve value at that boundary (L/12 .. END/12)
  for (let m = L; m < END; m++) {
    V *= rtr[s + m + 1] / rtr[s + m];
    if (m >= dstart) {
      let d = drawForYear(Math.floor(m / 12) + 1);
      // Phase G spending-flex overlay (opt-in): a simple guardrail on the post-ladder sleeve —
      // cut the draw by cutPct while the sleeve is below `floorMult` × the remaining need.
      if (spendFlex && spendFlex.cutPct > 0) {
        const yearsLeft = (END - m) / 12;
        const remainingNeed = d * yearsLeft;
        if (V < (spendFlex.floorMult ?? 1) * remainingNeed) d *= (1 - spendFlex.cutPct);
      }
      V -= d / 12;
      if (V <= 0) {
        for (let y = Math.floor((m + 1) / 12); y <= END / 12; y++) vByYear[y] = 0;
        return { survived: false, failAge: startAge + m / 12, terminal: 0, vByYear };
      }
    }
    if ((m + 1) % 12 === 0) vByYear[(m + 1) / 12] = V;
  }
  return { survived: true, failAge: null, terminal: V, vByYear };
}

/** Percentile helper on a copy. */
export function pct(arr, p) {
  const a = [...arr].sort((x, y) => x - y);
  if (!a.length) return NaN;
  return a[Math.min(a.length - 1, Math.floor(p * a.length))];
}
