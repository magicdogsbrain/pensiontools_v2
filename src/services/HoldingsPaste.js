/**
 * Paste your holdings (6.9.0) — a format-agnostic parser for whatever a platform page or export gives you.
 *
 * Not per-platform CSV importers: workplace pensions have no export, DIY platforms each differ and drift.
 * Instead: split the pasted text into rows and cells (tab, comma, pipe or runs of spaces), recognise
 * columns by header keywords or by cell shape (a SEDOL, an ISIN, a £ value, a unit count, a short ticker),
 * match each row to the fund catalogue (SEDOL, ticker, then name) or to the plan's gilt order sheet
 * (SEDOL, code, or maturity year), and merge into the ledger with a preview the user confirms first.
 * Client-side only. Pure: no DOM, no storage.
 */
import { FUND_CATALOGUE } from './SubAssetModel.js';

const up = (s) => String(s || '').toUpperCase().trim();
const SEDOL_RE = /^[B-DF-HJ-NP-TV-Z0-9]{6}\d$/i;          // 7 chars, last a check digit, no vowels
const ISIN_RE = /^[A-Z]{2}[A-Z0-9]{9}\d$/i;
const TICKER_RE = /^[A-Z][A-Z0-9.\-]{1,9}$/;
const MONEY_RE = /^[£$€]?\s*-?[\d,]+(\.\d{1,2})?\s*(p|GBP|GBX)?$/i;
const NUM_RE = /^-?[\d,]+(\.\d+)?$/;

/** Split text into rows of cells; the separator is whichever gives the most consistent column count. */
export function splitRows(text) {
  const lines = String(text || '').replace(/\r/g, '').split('\n').map((l) => l.replace(/ /g, ' ')).filter((l) => l.trim().length);
  if (!lines.length) return { rows: [], sep: null };
  const seps = [{ name: 'tab', re: /\t/ }, { name: 'pipe', re: /\s*\|\s*/ }, { name: 'comma', re: /,(?=(?:[^"]*"[^"]*")*[^"]*$)/ }, { name: 'spaces', re: /\s{2,}/ }];
  let best = null;
  // Unquoted money with thousands separators splits on the comma ("£39,690.00" → "£39" + "690.00"): re-join.
  const rejoinMoney = (cells) => {
    const out = [];
    for (let i = 0; i < cells.length; i++) {
      let c = cells[i];
      // Only currency-prefixed cells: a bare "500" followed by "105.20" is units then price, not £500,105.20.
      while (i + 1 < cells.length && /^[£$€]-?\d{1,3}$/.test(c) && /^\d{3}(\.\d+)?$/.test(cells[i + 1])) { c = c + ',' + cells[i + 1]; i++; }
      out.push(c);
    }
    return out;
  };
  for (const s of seps) {
    const rows = lines.map((l) => { let cells = l.split(s.re).map((c) => c.replace(/^"|"$/g, '').trim()); if (s.name === 'comma') cells = rejoinMoney(cells); return cells.filter((c, i, a) => !(c === '' && i === a.length - 1)); });
    const counts = rows.map((r) => r.length);
    const mode = counts.sort((a, b) => a - b)[Math.floor(counts.length / 2)];
    if (mode < 2) continue;
    const consistent = rows.filter((r) => r.length === mode).length / rows.length;
    const score = mode * consistent;
    if (!best || score > best.score) best = { score, sep: s.name, rows: rows.filter((r) => r.length >= 2) };
  }
  return best ? { rows: best.rows, sep: best.sep } : { rows: lines.map((l) => [l.trim()]), sep: 'none' };
}

/** Money "£1,234.56" / "1234" / "123.4p" → number in pounds (pence → pounds). */
export function parseMoney(s) {
  const t = String(s || '').trim();
  if (!MONEY_RE.test(t)) return null;
  const pence = /p$|GBX$/i.test(t) && !/£/.test(t);
  const n = parseFloat(t.replace(/[£$€,\s]|p$|GBP$|GBX$/gi, ''));
  if (!Number.isFinite(n)) return null;
  return pence ? n / 100 : n;
}

const HEAD = {
  name: /^(investment|stock|fund|holding|name|description|security|instrument|asset)/i,
  ticker: /^(ticker|epic|code|symbol|tidm)/i,
  sedol: /^sedol/i, isin: /^isin/i,
  units: /^(units|quantity|qty|holding\s*\(units\)|units held|nominal|shares)/i,
  value: /^(value|market value|valuation|current value|total value|worth)/i,
  price: /^(price|last price|unit price|mid)/i,
  cost: /^(cost|book cost|purchase)/i
};

/** Detect columns from a header row (keywords) or from the cells' shapes. */
export function detectColumns(rows) {
  if (!rows.length) return { map: {}, hasHeader: false };
  const map = {};
  const head = rows[0];
  let hasHeader = false;
  head.forEach((c, i) => { for (const [k, re] of Object.entries(HEAD)) if (re.test(c) && map[k] == null) { map[k] = i; hasHeader = true; } });
  if (hasHeader && map.name != null) return { map, hasHeader };
  // Shape detection over the data rows
  const data = hasHeader ? rows.slice(1) : rows;
  const width = Math.max(...data.map((r) => r.length));
  const score = Array.from({ length: width }, () => ({ sedol: 0, isin: 0, ticker: 0, money: 0, num: 0, text: 0 }));
  for (const r of data) r.forEach((c, i) => {
    const t = c.trim(); if (!t) return;
    if (ISIN_RE.test(t)) score[i].isin++;
    else if (SEDOL_RE.test(t) && /\d/.test(t)) score[i].sedol++;
    else if (MONEY_RE.test(t) && /[£$€,]|\.\d{2}$/.test(t)) score[i].money++;
    else if (NUM_RE.test(t)) score[i].num++;
    else if (TICKER_RE.test(t) && t.length <= 6 && t === t.toUpperCase()) score[i].ticker++;
    else score[i].text++;
  });
  const n = data.length || 1;
  const pick = (k, min = 0.6, used = new Set(Object.values(map))) => { let best = -1, bi = null; score.forEach((s, i) => { if (!used.has(i) && s[k] / n >= min && s[k] > best) { best = s[k]; bi = i; } }); return bi; };
  if (map.isin == null) { const i = pick('isin'); if (i != null) map.isin = i; }
  if (map.sedol == null) { const i = pick('sedol'); if (i != null) map.sedol = i; }
  if (map.name == null) { const i = pick('text', 0.5); if (i != null) map.name = i; }
  if (map.ticker == null) { const i = pick('ticker', 0.6); if (i != null) map.ticker = i; }
  // Numbers: the largest money-looking column is the value; a plain number column is units
  const moneyCols = score.map((s, i) => ({ i, m: s.money + s.num })).filter((x) => !Object.values(map).includes(x.i) && x.m / n >= 0.6);
  if (moneyCols.length) {
    const avg = (i) => data.reduce((t, r) => t + (parseMoney(r[i] || '') || 0), 0) / n;
    const ranked = moneyCols.map((x) => ({ ...x, avg: avg(x.i), hasCurrency: score[x.i].money > score[x.i].num })).sort((a, b) => b.avg - a.avg);
    if (map.value == null) map.value = ranked[0].i;
    const rest = ranked.slice(1).filter((x) => !x.hasCurrency || true);
    if (map.units == null && rest.length) map.units = rest.find((x) => !x.hasCurrency)?.i ?? rest[rest.length - 1].i;
  }
  return { map, hasHeader };
}

/** Maturity year and index-linked flag from a gilt's name, e.g. "TREASURY 0.125% I/L 22/03/2031". */
export function giltFromName(name) {
  const s = up(name);
  if (!/TREASURY|GILT|T\d{2}|TR\d{2}|TG\d{2}/.test(s)) return null;
  const il = /I\/L|INDEX[- ]LINKED|IL\b|INDEX LINKED/.test(s);
  const y4 = s.match(/\b(20\d{2}|2[0-9]{3})\b/); const dmy = s.match(/\d{2}\/\d{2}\/(20\d{2})/);
  const year = dmy ? +dmy[1] : (y4 ? +y4[1] : null);
  return { year, il };
}

/**
 * Parse pasted text into rows with the fields we understand.
 * @returns {{ rows: [{ line, name, ticker, sedol, isin, units, value, price }], columns, sep, hasHeader, warnings: [] }}
 */
export function parsePaste(text) {
  const { rows, sep } = splitRows(text);
  const { map, hasHeader } = detectColumns(rows);
  const data = hasHeader ? rows.slice(1) : rows;
  const out = [];
  const warnings = [];
  data.forEach((r, i) => {
    const cell = (k) => (map[k] != null ? (r[map[k]] || '').trim() : '');
    const name = cell('name') || r.find((c) => /[A-Za-z]{3,}/.test(c) && !SEDOL_RE.test(c)) || '';
    const sedol = [cell('sedol'), ...r].map((c) => c.trim()).find((c) => SEDOL_RE.test(c) && /\d/.test(c) && !/^[A-Z]+$/.test(c)) || '';
    const isin = [cell('isin'), ...r].map((c) => c.trim()).find((c) => ISIN_RE.test(c)) || '';
    let ticker = cell('ticker'); if (!TICKER_RE.test(up(ticker)) || up(ticker) === up(sedol)) ticker = '';
    const value = parseMoney(cell('value'));
    const units = map.units != null ? parseMoney(cell('units')) : null;
    const price = map.price != null ? parseMoney(cell('price')) : null;
    if (!name && !ticker && !sedol) { warnings.push('Row ' + (i + 1) + ' skipped: no name, ticker or SEDOL'); return; }
    if (/^total/i.test(name) || /^cash$/i.test(name) && value == null) return;
    if (value == null && units == null && !ticker && !sedol) { warnings.push('Row ' + (i + 1) + ' skipped: no units or value found in "' + name.slice(0, 40) + '"'); return; }
    out.push({ line: i + 1, name, ticker: up(ticker), sedol: up(sedol) || null, isin: up(isin) || null, units: units != null ? units : null, value: value != null ? Math.round(value) : null, price });
  });
  if (!out.length) warnings.push('Nothing recognisable was pasted — copy the holdings table from your platform page (name, units, value) and try again.');
  return { rows: out, columns: map, sep, hasHeader, warnings };
}

/**
 * Match parsed rows to the catalogue and to the plan's gilt order sheet.
 * @param {object} o { catalogue = FUND_CATALOGUE, orders = [] (plan document order sheet), wrapper }
 */
export function matchRows(rows, { catalogue = FUND_CATALOGUE, orders = [], wrapper = 'SIPP' } = {}) {
  const byTicker = new Map(catalogue.map((f) => [up(f.ticker), f]));
  const norm = (s) => up(s).replace(/[^A-Z0-9]/g, '');
  return rows.map((r) => {
    let match = null;
    // Gilts first: SEDOL, code, then maturity year + index-linked
    if (orders.length) {
      const g = giltFromName(r.name);
      const o = orders.find((x) => r.sedol && up(x.sedol) === r.sedol) || orders.find((x) => r.ticker && up(x.tidm) === r.ticker)
        || (g && g.year ? orders.find((x) => x.matures && +String(x.matures).slice(0, 4) === g.year && (g.il || /I\/L|INDEX/i.test(x.name || ''))) : null);
      if (o) match = { kind: 'gilt', ticker: up(o.tidm), name: o.name, sedol: o.sedol || r.sedol, confidence: r.sedol && up(o.sedol) === r.sedol ? 'sedol' : r.ticker && up(o.tidm) === r.ticker ? 'code' : 'year', subClass: 'indexLinked' };
    }
    if (!match) {
      let c = r.ticker && byTicker.get(r.ticker);
      if (!c && r.name) {
        // Name match: strip the noise words both sides, then the longest catalogue name contained in the
        // pasted name (or containing it) wins; Acc / Dist decided by the pasted name, Acc by default.
        const strip = (s) => up(s).replace(/\b(UCITS|ETF|GBP|USD|FUND|PLC|INC|ACC|DIST|ACCUMULATION|INCOME|DISTRIBUTING|HEDGED|CLASS|[A-Z]\s*SHARES?)\b/g, '').replace(/\(.*?\)/g, '').replace(/[^A-Z0-9]/g, '');
        const rn = strip(r.name);
        const wantsDist = /\bDIST|DISTRIBUTING|\bINC\b|INCOME UNITS/i.test(r.name) && !/ACC/i.test(r.name);
        // A catalogue name found INSIDE the pasted name is a better match than the reverse (the pasted
        // "Vanguard FTSE All-World" must not resolve to "…All-World High Div Yield"); longest such name wins.
        const cands = catalogue.map((f) => ({ f, s: strip(f.name) })).filter((x) => x.s.length >= 6 && (rn.includes(x.s) || (rn.length >= 10 && x.s.includes(rn))))
          .map((x) => ({ ...x, inside: rn.includes(x.s) ? 1 : 0, distOk: (/\(DIST\)|\bDIST\b/i.test(x.f.name) === wantsDist) ? 1 : 0 }))
          .sort((a, b) => b.inside - a.inside || (a.inside ? b.s.length - a.s.length : a.s.length - b.s.length) || b.distOk - a.distOk);
        c = cands.length ? cands[0].f : null;
      }
      if (c) match = { kind: 'catalogue', ticker: up(c.ticker), name: c.name, subClass: c.subClass, confidence: r.ticker && byTicker.has(r.ticker) ? 'ticker' : 'name' };
    }
    if (!match && giltFromName(r.name)) { const g = giltFromName(r.name); match = { kind: 'gilt', ticker: r.ticker || ('T' + String(g.year || '').slice(2)), name: r.name, sedol: r.sedol, confidence: 'name-only', subClass: g.il ? 'indexLinked' : 'longGilts' }; }
    if (!match && /\bCASH\b|MONEY MARKET|CSH2|LIQUIDITY|OVERNIGHT|ULTRASHORT|TREASURY BILL|STERLING LIQUID/i.test(r.name)) match = { kind: 'cash', ticker: 'CSH2', name: r.name, subClass: 'moneyMarket', confidence: 'name' };
    return { ...r, wrapper, match: match || { kind: 'none', confidence: 'none' } };
  });
}

/**
 * Merge matched rows into the ledger: update lines we recognise (by ticker, else SEDOL), add the rest,
 * and report lines in the same wrapper that were not in the paste (probably sold).
 */
export function mergeLedger(ledger, matched, { wrapper = 'SIPP' } = {}) {
  const out = (ledger || []).map((l) => ({ ...l }));
  const added = [], updated = [], skipped = [];
  const seen = new Set();
  for (const m of matched) {
    if (m.match.kind === 'none' && !m.name) { skipped.push(m); continue; }
    const ticker = m.match.ticker || m.ticker || '';
    const key = (l) => (l.wrapper || 'SIPP').toUpperCase() === wrapper && ((ticker && up(l.ticker) === ticker) || (m.sedol && up(l.sedol) === m.sedol));
    const idx = out.findIndex(key);
    const line = { ticker, name: m.match.name || m.name || '', wrapper, value: m.value != null ? m.value : (idx >= 0 ? out[idx].value : 0), units: m.units != null ? m.units : (idx >= 0 ? out[idx].units : null), sedol: m.match.sedol || m.sedol || null, subClass: m.match.subClass || (idx >= 0 ? out[idx].subClass : undefined), kind: m.match.kind === 'gilt' ? 'gilt' : m.match.kind === 'cash' ? 'cash' : undefined };
    if (idx >= 0) { out[idx] = { ...out[idx], ...line }; updated.push(line); seen.add(out[idx]); }
    else { out.push(line); added.push(line); seen.add(out[out.length - 1]); }
  }
  const unseen = out.filter((l) => (l.wrapper || 'SIPP').toUpperCase() === wrapper && !seen.has(l));
  return { ledger: out, added, updated, unseen, skipped };
}
