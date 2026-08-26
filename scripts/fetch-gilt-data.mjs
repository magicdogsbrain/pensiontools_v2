/**
 * Nightly gilt data → public/data/gilts.json (+ docs/data/gilts.json for the published site,
 * + src/data/giltsSnapshot.js as the bundled offline fallback).
 *
 * Sources (all public):
 *  - Gilts in issue: UK Debt Management Office D1A report (XML). Fallback: LateGenXer's mirror.
 *  - Real-yield CURVE (what prices the ladders): the Bank of England's daily GLC REAL SPOT curve
 *    (open data, 0.5-40y). Source zip: bankofengland.co.uk/-/media/boe/files/statistics/yield-curves/
 *    latest-yield-curve-data.zip (xlsx inside — needs an xlsx parser); consumed here via LateGenXer's
 *    CSV mirror of exactly that file. Fallback when unreachable: the per-gilt YTM curve below.
 *  - Per-gilt prices (illustration table only): delayed LSE prices via LateGenXer's published CSV.
 *
 * For 3-month-lag index-linked gilts the quoted clean price is a REAL price per £100 nominal,
 * so a yield-to-maturity solved on the real cash flows IS the real yield. That real-yield curve
 * (by years to maturity) is what the ladder strategies price rungs from. 8-month-lag stocks
 * (quoted inflation-adjusted) are listed but excluded from the curve. Conventional gilts get a
 * nominal YTM for the breakeven read-out. All figures indicative — the app labels them so.
 *
 * Run: node scripts/fetch-gilt-data.mjs
 */
import { writeFileSync, mkdirSync } from 'node:fs';

const DMO_URL = 'https://www.dmo.gov.uk/data/XmlDataReport?reportCode=D1A';
const DMO_MIRROR = 'https://lategenxer.github.io/finance/dmo-D1A.xml';
const PRICES_URL = 'https://lategenxer.github.io/finance/gilts-closing-prices.csv';
const BOE_CURVE_URL = 'https://lategenxer.github.io/finance/boe-yield-curves.csv';
// Base RPI per index-linked gilt (from the DMO prospectuses, collated by LateGenXer) + the ONS RPI
// series → INDEX RATIOS, so the app can turn a today's-money income into a nominal to buy.
const DMO_ISSUED_CSV = 'https://raw.githubusercontent.com/LateGenXer/finance/main/data/dmo_issued.csv';
const RPI_URL = 'https://lategenxer.github.io/finance/rpi-series.csv';
const BOE_DIRECT = 'https://www.bankofengland.co.uk/-/media/boe/files/statistics/yield-curves/latest-yield-curve-data.zip';

async function fetchText(url, ms = 30000) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), ms);
  try {
    const r = await fetch(url, { signal: ctl.signal, headers: { 'user-agent': 'pensiontools-data-bot' } });
    if (!r.ok) throw new Error(`${url} → HTTP ${r.status}`);
    return await r.text();
  } finally { clearTimeout(t); }
}

function parseDmo(xml) {
  const out = [];
  const re = /<View_GILTS_IN_ISSUE\s+([^>]*)\/>/g;
  let m;
  while ((m = re.exec(xml))) {
    const a = {};
    for (const [, k, v] of m[1].matchAll(/([A-Z_]+)="([^"]*)"/g)) a[k] = v;
    const type = a.INSTRUMENT_TYPE.trim();
    const kind = /8 months/.test(type) ? 'il8' : /Index-linked/.test(type) ? 'il3' : /Conventional/.test(type) ? 'conventional' : null;
    if (!kind) continue;
    out.push({
      name: a.INSTRUMENT_NAME.replace(/\s+/g, ' ').trim(),
      isin: a.ISIN_CODE,
      type: kind,
      coupon: parseCoupon(a.INSTRUMENT_NAME),
      maturity: a.REDEMPTION_DATE.slice(0, 10),
      dmoDate: a.CLOSE_OF_BUSINESS_DATE.slice(0, 10)
    });
  }
  return out;
}

/** "0 1/8%", "1¼%", "4.125%" → percent number. */
function parseCoupon(name) {
  const m = name.match(/^([\d.]*)\s*([\d]+\/[\d]+|[¼½¾⅛⅜⅝⅞])?\s*%/);
  if (!m) return null;
  const whole = m[1] ? parseFloat(m[1]) : 0;
  const fracMap = { '¼': 0.25, '½': 0.5, '¾': 0.75, '⅛': 0.125, '⅜': 0.375, '⅝': 0.625, '⅞': 0.875 };
  let frac = 0;
  if (m[2]) {
    if (fracMap[m[2]] != null) frac = fracMap[m[2]];
    else { const [n, d] = m[2].split('/').map(Number); frac = n / d; }
  }
  return +(whole + frac).toFixed(4);
}

function parsePrices(csv) {
  const rows = csv.trim().split(/\r?\n/).slice(1).map((l) => l.split(','));
  const byIsin = {};
  let date = null;
  for (const [d, isin, tidm, price] of rows) { byIsin[isin] = { tidm, price: +price }; date = date || d; }
  return { date, byIsin };
}

/** Yield to maturity (annualised, semi-annual coupons, ACT/365 years) from a clean price. */
export function ytmFromClean(cleanPrice, couponPct, maturityIso, asOfIso) {
  const T = (Date.parse(maturityIso) - Date.parse(asOfIso)) / (365.25 * 864e5);
  if (!(T > 0.02)) return null;
  const c = couponPct / 2;
  const n = Math.ceil(T * 2);                    // remaining coupons
  const t0 = T - (n - 1) / 2;                    // years to the next coupon
  const flows = [];
  for (let i = 0; i < n; i++) flows.push([t0 + i / 2, c + (i === n - 1 ? 100 : 0)]);
  // The quoted clean price excludes accrued interest; add it back (approx, ACT/365 on a half-year).
  const accrued = c * (0.5 - t0 % 0.5) / 0.5;
  const dirty = cleanPrice + (accrued > 0 && accrued < c ? accrued : 0);
  const pv = (y) => flows.reduce((s, [t, f]) => s + f / Math.pow(1 + y, t), 0);
  let lo = -0.05, hi = 0.25;
  for (let i = 0; i < 80; i++) { const mid = (lo + hi) / 2; if (pv(mid) > dirty) lo = mid; else hi = mid; }
  return +((lo + hi) / 2).toFixed(5);
}

/** Parse the BoE curve CSV mirror: Years,Nominal_Spot,Real_Spot,Inflation_Spot,OIS_Spot,Date (percent). */
export function parseBoeCurve(csv) {
  const lines = csv.trim().split(/\r?\n/);
  const head = lines[0].split(',');
  const iY = head.indexOf('Years'), iR = head.indexOf('Real_Spot'), iN = head.indexOf('Nominal_Spot'), iI = head.indexOf('Inflation_Spot'), iD = head.indexOf('Date');
  const real = [], nominal = [], inflation = [];
  let date = null;
  for (const l of lines.slice(1)) {
    const c = l.split(',');
    const y = +c[iY];
    if (iD >= 0 && c[iD]) date = c[iD];
    if (c[iR]) real.push({ years: y, yield: +(+c[iR] / 100).toFixed(5) });
    if (c[iN]) nominal.push({ years: y, yield: +(+c[iN] / 100).toFixed(5) });
    if (c[iI]) inflation.push({ years: y, yield: +(+c[iI] / 100).toFixed(5) });
  }
  return { date, real, nominal, inflation };
}

/** Base RPI per ISIN from LateGenXer's DMO-issued CSV (BASE_RPI_87 column; blank for conventionals). */
export function parseBaseRpi(csv) {
  const out = {};
  for (const l of csv.trim().split(/\r?\n/).slice(1)) { const c = l.split(','); if (c[4]) out[c[0]] = +c[4]; }
  return out;
}
/** ONS RPI series ("YYYY MON","value" rows) → { 'YYYY-MM': value }. */
export function parseRpiSeries(csv) {
  const M = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  const out = {};
  for (const l of csv.split(/\r?\n/)) { const m = l.match(/^"(\d{4}) ([A-Z]{3})","([\d.]+)"/); if (m) out[m[1] + '-' + String(M.indexOf(m[2]) + 1).padStart(2, '0')] = +m[3]; }
  return out;
}
/** DMO 3-month-lag reference RPI for a settlement date (yldeqns.pdf): RPI(m-3) + (d-1)/D × (RPI(m-2) − RPI(m-3)). */
export function referenceRpi(iso, rpi) {
  const [y, m, d] = iso.split('-').map(Number);
  const key = (yy, mm) => { while (mm < 1) { mm += 12; yy--; } return yy + '-' + String(mm).padStart(2, '0'); };
  const a = rpi[key(y, m - 3)], b = rpi[key(y, m - 2)];
  if (a == null || b == null) return null;
  const D = new Date(y, m, 0).getDate();
  return a + (d - 1) / D * (b - a);
}

export function buildDataset({ dmo, prices, boe = null, baseRpi = {}, rpi = {}, now = new Date() }) {
  const asOf = prices.date || dmo[0]?.dmoDate || now.toISOString().slice(0, 10);
  // Index ratios for T+1 settlement (verified against the DMO's D10C report to 5 d.p.).
  const settle = new Date(now.getTime() + 864e5).toISOString().slice(0, 10);
  const refRpi = referenceRpi(settle, rpi);
  const gilts = dmo.map((g) => {
    const p = prices.byIsin[g.isin];
    const cleanPrice = p ? p.price : null;
    const y = cleanPrice != null && g.type !== 'il8' ? ytmFromClean(cleanPrice, g.coupon, g.maturity, asOf) : null;
    const indexRatio = g.type === 'il3' && baseRpi[g.isin] && refRpi ? +(refRpi / baseRpi[g.isin]).toFixed(5) : null;
    return { ...g, tidm: p ? p.tidm : null, cleanPrice, yield: y, yieldKind: g.type === 'conventional' ? 'nominal' : 'real', baseRpi: baseRpi[g.isin] ?? null, indexRatio };
  }).sort((a, b) => a.maturity.localeCompare(b.maturity));
  const yearsTo = (iso) => (Date.parse(iso) - Date.parse(asOf)) / (365.25 * 864e5);
  const giltRealCurve = gilts.filter((g) => g.type === 'il3' && g.yield != null)
    .map((g) => ({ years: +yearsTo(g.maturity).toFixed(2), yield: g.yield, isin: g.isin }));
  const boeOk = boe && boe.real && boe.real.length > 10;
  const realCurve = boeOk ? boe.real : giltRealCurve;
  const nominalCurve = gilts.filter((g) => g.type === 'conventional' && g.yield != null)
    .map((g) => ({ years: +yearsTo(g.maturity).toFixed(2), yield: g.yield, isin: g.isin }));
  return {
    generated_at: now.toISOString(),
    as_of: asOf,
    index_ratio_settlement: refRpi ? settle : null,
    reference_rpi: refRpi ? +refRpi.toFixed(5) : null,
    curve_as_of: boeOk ? boe.date : asOf,
    curve_source: boeOk ? 'Bank of England GLC real spot curve' : 'real YTM solved from index-linked gilt prices (BoE curve unavailable)',
    sources: {
      issued: 'UK DMO gilts in issue (D1A)',
      curve: boeOk ? 'Bank of England daily real spot yield curve (open data, via LateGenXer mirror)' : 'derived from gilt prices',
      prices: 'delayed London Stock Exchange prices (via LateGenXer mirror) — illustration only',
      indexRatios: 'DMO base RPI per gilt + ONS RPI (3-month lag formula), for T+1 settlement'
    },
    notice: 'Indicative closing prices and derived yields for illustration only. Not a recommendation to buy or sell any gilt.',
    counts: { gilts: gilts.length, priced: gilts.filter((g) => g.cleanPrice != null).length, realCurve: realCurve.length },
    realCurve, giltRealCurve, nominalCurve, boeNominalCurve: boeOk ? boe.nominal : [], boeInflationCurve: boeOk ? boe.inflation : [], gilts
  };
}

async function main() {
  let dmo = [];
  try { dmo = parseDmo(await fetchText(DMO_URL)); } catch (e) { console.warn('DMO direct failed:', e.message); }
  if (dmo.length < 50) { console.warn('DMO direct returned ' + dmo.length + ' gilts — using mirror'); dmo = parseDmo(await fetchText(DMO_MIRROR)); }
  if (dmo.length < 50) throw new Error('gilt universe unavailable (' + dmo.length + ' rows) — keeping the previous file');
  const prices = parsePrices(await fetchText(PRICES_URL));
  let boe = null;
  try { boe = parseBoeCurve(await fetchText(BOE_CURVE_URL)); } catch (e) { console.warn('BoE curve mirror failed (falling back to gilt-price curve):', e.message); }
  let baseRpi = {}, rpi = {};
  try { baseRpi = parseBaseRpi(await fetchText(DMO_ISSUED_CSV)); rpi = parseRpiSeries(await fetchText(RPI_URL)); } catch (e) { console.warn('base RPI / RPI series unavailable (no index ratios this run):', e.message); }
  const data = buildDataset({ dmo, prices, boe, baseRpi, rpi });
  const json = JSON.stringify(data, null, 1);
  for (const dir of ['public/data', 'docs/data']) { mkdirSync(dir, { recursive: true }); writeFileSync(`${dir}/gilts.json`, json); }
  writeFileSync('src/data/giltsSnapshot.js',
    '// GENERATED by scripts/fetch-gilt-data.mjs — bundled fallback when public/data/gilts.json cannot be fetched.\n'
    + '// Do not hand-edit.\nexport default ' + json + ';\n');
  console.log('index ratios for ' + data.gilts.filter((g) => g.indexRatio).length + ' linkers, settlement ' + data.index_ratio_settlement + ', ref RPI ' + data.reference_rpi);
  console.log(`gilts ${data.counts.gilts}, priced ${data.counts.priced}, real curve ${data.counts.realCurve} pts (${data.curve_source}, ${data.curve_as_of}), prices as of ${data.as_of}`);
  console.log('real curve:', data.realCurve.map((p) => `${p.years}y ${(p.yield * 100).toFixed(2)}%`).join(' | '));
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split('/').pop())) main().catch((e) => { console.error(e); process.exit(1); });
