/**
 * Linker universe (strategy brief Appendix C) — the index-linked gilt list that turns abstract
 * "rungs" into an illustrative ladder, plus the REAL-YIELD CURVE the ladder strategies price
 * rungs from.
 *
 * Data: `public/data/gilts.json`, rebuilt nightly by scripts/fetch-gilt-data.mjs from the DMO
 * gilts-in-issue report and Tradeweb FTSE closing prices (T+1). `src/data/giltsSnapshot.js` is
 * the bundled copy for offline/tests; `loadLiveGilts()` swaps in the fetched file at runtime; an
 * admin override (Firestore admin/linkers) sits above both. For 3-month-lag linkers the quoted
 * clean price is a real price, so a solved YTM is a real yield — but the curve that PRICES the
 * rungs is the Bank of England's daily real spot curve (realCurve in the file), with the per-gilt
 * YTMs as the fallback. That replaces the old flat 2.3% assumption. Everything shown from it is labelled indicative, never a recommendation.
 */

import snapshot from '../data/giltsSnapshot.js';

export const FLAT_REAL_YIELD_FALLBACK = 0.023;

/** Normalise any dataset shape (fetched JSON, bundled snapshot, admin CSV rows) to one form. */
function normalise(data) {
  if (!data) return null;
  const mapGilt = (g) => {
      const maturityYear = typeof g.maturity === 'number' ? g.maturity : +String(g.maturity).slice(0, 4);
      return {
        name: g.name,
        isin: g.isin || null,
        tidm: g.tidm || null,
        coupon: +g.coupon,
        maturity: maturityYear,
        maturityDate: typeof g.maturity === 'string' ? g.maturity : null,
        lag: g.lag ?? (g.type === 'il8' ? 8 : 3),
        cleanPrice: g.cleanPrice ?? null,
        realYield: g.type === 'conventional' ? null : (g.yield ?? g.realYield ?? null),
        nominalYield: g.type === 'conventional' ? (g.yield ?? null) : null,
        indexRatio: g.indexRatio ?? null,
        maturityDateIso: typeof g.maturity === 'string' ? g.maturity : null,
        type: g.type || 'il3'
      };
  };
  const all = (data.gilts || []).map(mapGilt);
  const gilts = all.filter((g) => g.type !== 'conventional');
  const conventionals = all.filter((g) => g.type === 'conventional');
  const nominalCurve = (data.boeNominalCurve && data.boeNominalCurve.length ? data.boeNominalCurve : (data.nominalCurve || []))
    .filter((p) => Number.isFinite(p.years) && Number.isFinite(p.yield)).sort((a, b) => a.years - b.years);
  const realCurve = (data.realCurve || gilts.filter((g) => g.realYield != null && g.lag === 3)
    .map((g) => ({ years: g.maturity - new Date().getFullYear(), yield: g.realYield })))
    .filter((p) => Number.isFinite(p.years) && Number.isFinite(p.yield))
    .sort((a, b) => a.years - b.years);
  return {
    generated_at: data.generated_at,
    as_of: data.as_of || (data.generated_at || '').slice(0, 10),
    curve_as_of: data.curve_as_of || data.as_of || null,
    curve_source: data.curve_source || (data.realCurve ? 'real yields from gilt prices' : 'flat assumption'),
    index_ratio_settlement: data.index_ratio_settlement || null,
    source: data.source || (data.sources ? `${data.sources.issued}; ${data.sources.prices}` : 'unknown'),
    notice: data.notice || 'Indicative figures for illustration only. Not a recommendation to buy or sell any gilt.',
    gilts, conventionals, realCurve, nominalCurve
  };
}

const BUNDLED = normalise(snapshot);
export const BUNDLED_LINKERS = BUNDLED;

let _override = null;   // admin-published
let _live = null;       // fetched at runtime

/** Admin CSV import applies here (persisted via AdminConfigService admin/linkers). */
export function setLinkersOverride(data) { _override = data && data.gilts ? normalise(data) : null; }
export function setLiveGilts(data) { _live = data && data.gilts ? normalise(data) : null; }
export function activeLinkers() { return _override || _live || BUNDLED; }

/** Fetch the nightly file (same origin, relative to the app) — silent fallback to the snapshot. */
export async function loadLiveGilts(url = './data/gilts.json', fetchImpl = globalThis.fetch) {
  if (!fetchImpl) return null;
  try {
    const r = await fetchImpl(url, { cache: 'no-cache' });
    if (!r.ok) return null;
    const data = await r.json();
    if (Date.parse(data.generated_at || 0) >= Date.parse(BUNDLED.generated_at || 0)) setLiveGilts(data);
    return activeLinkers();
  } catch (e) { return null; }
}

export function isStale(nowMs = Date.now(), maxAgeHours = 48) {
  const gen = Date.parse(activeLinkers().generated_at || 0);
  return (nowMs - gen) > maxAgeHours * 3600 * 1000;
}

/** Provenance line for the UI: what the numbers are priced from and when. */
export function dataProvenance() {
  const a = activeLinkers();
  return {
    as_of: a.as_of, curve_as_of: a.curve_as_of, curve_source: a.curve_source, generated_at: a.generated_at, source: a.source, notice: a.notice,
    stale: isStale(), hasCurve: a.realCurve.length > 0, curvePoints: a.realCurve.length
  };
}

/**
 * Real yield for a rung `k` years out, linearly interpolated on the closing-price curve and
 * held flat beyond its ends. With no curve at all (bare CSV override) → the 2.3% fallback.
 */
export function realYieldForYear(k) {
  const c = activeLinkers().realCurve;
  if (!c.length) return FLAT_REAL_YIELD_FALLBACK;
  if (k <= c[0].years) return c[0].yield;
  if (k >= c[c.length - 1].years) return c[c.length - 1].yield;
  for (let i = 1; i < c.length; i++) {
    if (k <= c[i].years) {
      const a = c[i - 1], b = c[i];
      return a.yield + (b.yield - a.yield) * (k - a.years) / (b.years - a.years);
    }
  }
  return c[c.length - 1].yield;
}

/** Nominal (conventional-gilt) yield k years out — BoE nominal spot curve; flat beyond its ends. */
export function nominalYieldForYear(k) {
  const c = activeLinkers().nominalCurve || [];
  if (!c.length) return 0.045;
  if (k <= c[0].years) return c[0].yield;
  if (k >= c[c.length - 1].years) return c[c.length - 1].yield;
  for (let i = 1; i < c.length; i++) {
    if (k <= c[i].years) { const a = c[i - 1], b = c[i]; return a.yield + (b.yield - a.yield) * (k - a.years) / (b.years - a.years); }
  }
  return c[c.length - 1].yield;
}

/** Duration-weighted-ish summary yield for one number in prose (10-year point). */
export function headlineRealYield() { return realYieldForYear(10); }

/** Maturity years present, and the gap years DERIVED from them across the span. */
export function coverage() {
  const years = [...new Set(activeLinkers().gilts.map((g) => g.maturity))].sort((a, b) => a - b);
  const gaps = [];
  for (let y = years[0]; y <= years[years.length - 1]; y++) if (!years.includes(y)) gaps.push(y);
  return { years, gaps, lastYear: years[years.length - 1] };
}

/**
 * The gilt(s) covering a target calendar year: an exact maturity when one exists, else the
 * BRACKETING pair (nearest before + nearest after) — the doubled-second-slice treatment for
 * gap years (§4c). Beyond the last linker (~2073) nothing insures the year: return the last.
 */
export function giltsForYear(year, kind = 'real') {
  const gilts = kind === 'nominal' ? (activeLinkers().conventionals || []) : activeLinkers().gilts;
  const exact = gilts.filter((g) => g.maturity === year);
  if (exact.length) return { mode: 'exact', gilts: exact };
  const before = gilts.filter((g) => g.maturity < year).sort((a, b) => b.maturity - a.maturity)[0];
  const after = gilts.filter((g) => g.maturity > year).sort((a, b) => a.maturity - b.maturity)[0];
  if (before && after) return { mode: 'bracket', gilts: [before, after] };
  return { mode: 'beyond', gilts: [before || after].filter(Boolean) };
}

/**
 * Illustrative ladder at a point in time (§6): per rung — calendar year, gilt(s) with gap
 * bracketing, the real yield used and the indicative cost. Priced on the closing-price curve
 * unless a flat `realYield` is forced (tests / what-if).
 * @param {object} p { rungYears: [planYear...], drawForYear, startYear (calendar), realYield?, yieldForYear? }
 */
export function orderSheet({ rungYears, drawForYear, startYear, realYield, yieldForYear, kind = 'real' }) {
  const yf = yieldForYear || (realYield != null ? () => realYield : (kind === 'nominal' ? nominalYieldForYear : realYieldForYear));
  const prov = dataProvenance();
  const rows = rungYears.map((k) => {
    const calYear = startYear + k;
    const pick = giltsForYear(calYear, kind);
    const y = yf(k);
    const cost = drawForYear(k) * Math.pow(1 + y, -k);
    return {
      planYear: k, calYear,
      gilts: pick.gilts.map((g) => g.name),
      giltDetails: pick.gilts.map((g) => ({ name: g.name, tidm: g.tidm, cleanPrice: g.cleanPrice, realYield: g.realYield, nominalYield: g.nominalYield, lag: g.lag, type: g.type })),
      mode: pick.mode,
      face: Math.round(drawForYear(k)),
      realYield: y,
      estCost: Math.round(cost)
    };
  });
  const flat = realYield != null && !yieldForYear;
  return {
    rows,
    total: rows.reduce((s, r) => s + r.estCost, 0),
    priced: flat
      ? 'flat real yield ' + (realYield * 100).toFixed(1) + '%'
      : kind === 'nominal'
        ? ((activeLinkers().nominalCurve || []).length ? 'Bank of England nominal spot curve as of ' + prov.curve_as_of : 'flat nominal yield 4.5% (no curve data)')
        : (prov.hasCurve ? 'real yields from the ' + prov.curve_source + ' as of ' + prov.curve_as_of : 'flat real yield ' + (FLAT_REAL_YIELD_FALLBACK * 100).toFixed(1) + '% (no curve data)'),
    generated_at: prov.generated_at,
    as_of: prov.as_of,
    source: prov.source,
    notice: prov.notice,
    stale: prov.stale,
    kind
  };
}
