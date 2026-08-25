/**
 * Nightly gilt data → public/data/gilts.json (+ docs/data/gilts.json for the published site,
 * + src/data/giltsSnapshot.js as the bundled offline fallback).
 *
 * Sources (all public):
 *  - Gilts in issue: UK Debt Management Office D1A report (XML). Fallback: LateGenXer's mirror.
 *  - Closing prices: Tradeweb FTSE gilt closing prices — free for non-commercial use, T+1 —
 *    via LateGenXer's published CSV (the Tradeweb export needs a browser login).
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

export function buildDataset({ dmo, prices, now = new Date() }) {
  const asOf = prices.date || dmo[0]?.dmoDate || now.toISOString().slice(0, 10);
  const gilts = dmo.map((g) => {
    const p = prices.byIsin[g.isin];
    const cleanPrice = p ? p.price : null;
    const y = cleanPrice != null && g.type !== 'il8' ? ytmFromClean(cleanPrice, g.coupon, g.maturity, asOf) : null;
    return { ...g, tidm: p ? p.tidm : null, cleanPrice, yield: y, yieldKind: g.type === 'conventional' ? 'nominal' : 'real' };
  }).sort((a, b) => a.maturity.localeCompare(b.maturity));
  const yearsTo = (iso) => (Date.parse(iso) - Date.parse(asOf)) / (365.25 * 864e5);
  const realCurve = gilts.filter((g) => g.type === 'il3' && g.yield != null)
    .map((g) => ({ years: +yearsTo(g.maturity).toFixed(2), yield: g.yield, isin: g.isin }));
  const nominalCurve = gilts.filter((g) => g.type === 'conventional' && g.yield != null)
    .map((g) => ({ years: +yearsTo(g.maturity).toFixed(2), yield: g.yield, isin: g.isin }));
  return {
    generated_at: now.toISOString(),
    as_of: asOf,
    sources: {
      issued: 'UK DMO gilts in issue (D1A)',
      prices: 'Tradeweb FTSE gilt closing prices (via LateGenXer mirror; free for non-commercial use, T+1)'
    },
    notice: 'Indicative closing prices and derived yields for illustration only. Not a recommendation to buy or sell any gilt.',
    counts: { gilts: gilts.length, priced: gilts.filter((g) => g.cleanPrice != null).length, realCurve: realCurve.length },
    realCurve, nominalCurve, gilts
  };
}

async function main() {
  let xml;
  try { xml = await fetchText(DMO_URL); } catch (e) { console.warn('DMO direct failed, using mirror:', e.message); xml = await fetchText(DMO_MIRROR); }
  const dmo = parseDmo(xml);
  const prices = parsePrices(await fetchText(PRICES_URL));
  const data = buildDataset({ dmo, prices });
  const json = JSON.stringify(data, null, 1);
  for (const dir of ['public/data', 'docs/data']) { mkdirSync(dir, { recursive: true }); writeFileSync(`${dir}/gilts.json`, json); }
  writeFileSync('src/data/giltsSnapshot.js',
    '// GENERATED by scripts/fetch-gilt-data.mjs — bundled fallback when public/data/gilts.json cannot be fetched.\n'
    + '// Do not hand-edit.\nexport default ' + json + ';\n');
  console.log(`gilts ${data.counts.gilts}, priced ${data.counts.priced}, real curve ${data.counts.realCurve} pts, as of ${data.as_of}`);
  console.log('real curve:', data.realCurve.map((p) => `${p.years}y ${(p.yield * 100).toFixed(2)}%`).join(' | '));
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split('/').pop())) main().catch((e) => { console.error(e); process.exit(1); });
