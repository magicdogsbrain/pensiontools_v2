/**
 * Linker universe (strategy brief Appendix C) — the index-linked gilt list that turns abstract
 * "rungs" into an order sheet a user could hand a broker.
 *
 * Data policy, per the brief: a BUNDLED SNAPSHOT is the fallback; a manual CSV import (admin)
 * is the refresh path; a staleness banner shows when the data is old; retail sites are never
 * scraped. A nightly job (Tradeweb EOD / BoE real spot curve) needs server hosting this static
 * app doesn't have — documented here, wired the day hosting exists. Prices absent → rungs are
 * priced on the flat real-yield curve (engine default 2.3%), stated on the sheet.
 *
 * SNAPSHOT: the UK IL gilt universe as publicly listed (illustrative; refresh via admin CSV).
 * Old-style 8-month-lag stocks (e.g. 4⅛% IL 2030) carry lag: 8; post-2005 issues lag: 3.
 * Gap years are DERIVED from the data, never hard-coded.
 */

export const BUNDLED_LINKERS = {
  generated_at: '2026-01-15T00:00:00Z',
  source: 'bundled snapshot (illustrative universe; refresh via admin CSV import)',
  gilts: [
    { name: '0⅛% IL Treasury Gilt 2026', coupon: 0.125, maturity: 2026, lag: 3 },
    { name: '1¼% IL Treasury Gilt 2027', coupon: 1.25, maturity: 2027, lag: 3 },
    { name: '0⅛% IL Treasury Gilt 2028', coupon: 0.125, maturity: 2028, lag: 3 },
    { name: '0⅛% IL Treasury Gilt 2029', coupon: 0.125, maturity: 2029, lag: 3 },
    { name: '4⅛% IL Treasury Stock 2030', coupon: 4.125, maturity: 2030, lag: 8 },
    { name: '0⅛% IL Treasury Gilt 2031', coupon: 0.125, maturity: 2031, lag: 3 },
    { name: '1¼% IL Treasury Gilt 2032', coupon: 1.25, maturity: 2032, lag: 3 },
    { name: '0¾% IL Treasury Gilt 2033', coupon: 0.75, maturity: 2033, lag: 3 },
    { name: '0¾% IL Treasury Gilt 2034', coupon: 0.75, maturity: 2034, lag: 3 },
    { name: '2% IL Treasury Stock 2035', coupon: 2.0, maturity: 2035, lag: 8 },
    { name: '0⅛% IL Treasury Gilt 2036', coupon: 0.125, maturity: 2036, lag: 3 },
    { name: '1⅛% IL Treasury Gilt 2037', coupon: 1.125, maturity: 2037, lag: 3 },
    { name: '0⅝% IL Treasury Gilt 2039', coupon: 0.625, maturity: 2039, lag: 3 },
    { name: '0⅛% IL Treasury Gilt 2041', coupon: 0.125, maturity: 2041, lag: 3 },
    { name: '0⅝% IL Treasury Gilt 2042', coupon: 0.625, maturity: 2042, lag: 3 },
    { name: '0⅛% IL Treasury Gilt 2044', coupon: 0.125, maturity: 2044, lag: 3 },
    { name: '0⅝% IL Treasury Gilt 2045', coupon: 0.625, maturity: 2045, lag: 3 },
    { name: '0⅛% IL Treasury Gilt 2046', coupon: 0.125, maturity: 2046, lag: 3 },
    { name: '0¾% IL Treasury Gilt 2047', coupon: 0.75, maturity: 2047, lag: 3 },
    { name: '0⅛% IL Treasury Gilt 2048', coupon: 0.125, maturity: 2048, lag: 3 },
    { name: '0½% IL Treasury Gilt 2050', coupon: 0.5, maturity: 2050, lag: 3 },
    { name: '0⅛% IL Treasury Gilt 2051', coupon: 0.125, maturity: 2051, lag: 3 },
    { name: '0¼% IL Treasury Gilt 2052', coupon: 0.25, maturity: 2052, lag: 3 },
    { name: '1¼% IL Treasury Stock 2055', coupon: 1.25, maturity: 2055, lag: 8 },
    { name: '0⅛% IL Treasury Gilt 2056', coupon: 0.125, maturity: 2056, lag: 3 },
    { name: '0⅛% IL Treasury Gilt 2058', coupon: 0.125, maturity: 2058, lag: 3 },
    { name: '0⅜% IL Treasury Gilt 2062', coupon: 0.375, maturity: 2062, lag: 3 },
    { name: '0⅛% IL Treasury Gilt 2065', coupon: 0.125, maturity: 2065, lag: 3 },
    { name: '0⅛% IL Treasury Gilt 2068', coupon: 0.125, maturity: 2068, lag: 3 },
    { name: '0⅛% IL Treasury Gilt 2073', coupon: 0.125, maturity: 2073, lag: 3 }
  ]
};

let _override = null;
/** Admin CSV import applies here (persisted via AdminConfigService admin/linkers). */
export function setLinkersOverride(data) { _override = data && data.gilts ? data : null; }
export function activeLinkers() { return _override || BUNDLED_LINKERS; }

export function isStale(nowMs = Date.now(), maxAgeHours = 48) {
  const gen = Date.parse(activeLinkers().generated_at || 0);
  return (nowMs - gen) > maxAgeHours * 3600 * 1000;
}

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
export function giltsForYear(year) {
  const gilts = activeLinkers().gilts;
  const exact = gilts.filter((g) => g.maturity === year);
  if (exact.length) return { mode: 'exact', gilts: exact };
  const before = gilts.filter((g) => g.maturity < year).sort((a, b) => b.maturity - a.maturity)[0];
  const after = gilts.filter((g) => g.maturity > year).sort((a, b) => a.maturity - b.maturity)[0];
  if (before && after) return { mode: 'bracket', gilts: [before, after] };
  return { mode: 'beyond', gilts: [before || after].filter(Boolean) };
}

/**
 * Order sheet at a point in time (§6): per rung — calendar year, gilt(s) with gap bracketing,
 * estimated real cost on the flat curve (prices absent from the snapshot ⇒ flat-curve note).
 * @param {object} p { rungYears: [planYear...], drawForYear, startYear (calendar), realYield }
 */
export function orderSheet({ rungYears, drawForYear, startYear, realYield = 0.023 }) {
  const rows = rungYears.map((k) => {
    const calYear = startYear + k;
    const pick = giltsForYear(calYear);
    const cost = drawForYear(k) * Math.pow(1 + realYield, -k);
    return {
      planYear: k, calYear,
      gilts: pick.gilts.map((g) => g.name),
      mode: pick.mode,
      face: Math.round(drawForYear(k)),
      estCost: Math.round(cost)
    };
  });
  return {
    rows,
    priced: 'flat real yield ' + (realYield * 100).toFixed(1) + '% (no live prices in snapshot)',
    generated_at: activeLinkers().generated_at,
    stale: isStale()
  };
}
