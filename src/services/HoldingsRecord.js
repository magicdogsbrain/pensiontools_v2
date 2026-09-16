/**
 * Holdings record — the ONE ledger of what the person actually holds (6.13.0).
 *
 * `scenario.holdings` is a root record on the plan:
 *   { version, updatedAt: 'YYYY-MM-DD'|null, source: 'typed'|'paste'|'imported'|'none', offerDismissed, lines: [] }
 *   line: { wrapper: 'SIPP'|'ISA'|'GIA'|'CASH', ticker, name, sedol, units, value, ocf, contribution, subClass, kind, asOf }
 *
 * It is what the Transition tool diffs against the plan document, what the Accumulation planner projects
 * from, what the plan document snapshots at lock (`holdingsAtLock`) and what the retire sweep starts from.
 * It is NOT the Stress tester's `taggedFunds`: that list is a strategy INPUT ("the funds to test"), and the
 * portfolio a strategy is tested on must never be assumed to be what the person holds (owner's ruling, 16 Sep
 * 2026). The one bridge between the two is `linesFromTaggedFunds` — an explicit, one-time import the user asks for.
 *
 * Every field is present on every line (null where unknown, numbers as numbers) so a record can be written to
 * Firestore exactly as it stands — Firestore refuses `undefined`. Pure: no DOM, no storage.
 */
export const HOLDINGS_VERSION = 1;
export const WRAPPERS = ['SIPP', 'ISA', 'GIA', 'CASH'];
export const SOURCES = ['typed', 'paste', 'imported', 'none'];
export const KINDS = ['fund', 'gilt', 'cash'];

/** Number from a number or a typed string ("£1,234.50" → 1234.5); null when unknown — never NaN, never undefined. */
export function numOrNull(v) {
  if (v === '' || v == null) return null;
  const n = typeof v === 'number' ? v : +String(v).replace(/[£$€,\s]/g, '');
  return Number.isFinite(n) ? n : null;
}
const strOrNull = (v, { upper = false } = {}) => { const s = String(v == null ? '' : v).trim(); return s ? (upper ? s.toUpperCase() : s) : null; };
/** 'YYYY-MM-DD' (an ISO datetime is cut to its date); anything else is null. */
export function dateOrNull(v) {
  const s = String(v == null ? '' : v).trim().slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : null;
}
/** Wrapper names as people and platforms write them → the four the model knows. Unknown → SIPP (what the rest of the app assumes). */
export function normaliseWrapper(w) {
  const u = String(w == null ? '' : w).trim().toUpperCase();
  if (u === 'ISA' || u === 'LISA' || u === 'S&S ISA' || u === 'STOCKS AND SHARES ISA') return 'ISA';
  if (u === 'GIA' || u === 'TAXABLE' || u === 'DEALING' || u === 'GENERAL' || u === 'TRADING') return 'GIA';
  if (u === 'CASH' || u === 'BANK' || u === 'SAVINGS') return 'CASH';
  return 'SIPP';   // 'SIPP', 'PENSION', 'DC', '' and anything unrecognised
}

/** The empty record — what a plan without holdings reads as. Never a fallback to any other list. */
export function emptyHoldings() {
  return { version: HOLDINGS_VERSION, updatedAt: null, source: 'none', offerDismissed: false, lines: [] };
}

/** One line, every field present. Null when the line has no identity at all (no ticker, no name, no SEDOL). */
export function normaliseLine(raw) {
  const h = raw && typeof raw === 'object' ? raw : {};
  const ticker = strOrNull(h.ticker, { upper: true });
  const name = strOrNull(h.name);
  const sedol = strOrNull(h.sedol, { upper: true });
  if (!ticker && !name && !sedol) return null;
  const kind = KINDS.includes(h.kind) ? h.kind : null;
  return {
    wrapper: normaliseWrapper(h.wrapper),
    ticker, name, sedol,
    units: numOrNull(h.units),
    value: numOrNull(h.value),
    ocf: numOrNull(h.ocf),                    // % a year, as the catalogue states it (0.22 = 0.22%)
    contribution: numOrNull(h.contribution),  // £ a month going into this line
    subClass: strOrNull(h.subClass),
    kind,
    asOf: dateOrNull(h.asOf)
  };
}

/**
 * Any shape in (a saved record, a bare array of lines, garbage) → the record above, every line sanitised:
 * wrapper upper-cased and validated, ticker upper-cased, numbers coerced, null not undefined, lines with no
 * ticker AND no name AND no SEDOL dropped.
 */
export function normaliseHoldings(raw) {
  if (Array.isArray(raw)) return normaliseHoldings({ lines: raw });
  if (!raw || typeof raw !== 'object') return emptyHoldings();
  const lines = (Array.isArray(raw.lines) ? raw.lines : []).map(normaliseLine).filter(Boolean);
  const source = SOURCES.includes(raw.source) ? raw.source : (lines.length ? 'typed' : 'none');
  return { version: HOLDINGS_VERSION, updatedAt: dateOrNull(raw.updatedAt), source, offerDismissed: raw.offerDismissed === true, lines };
}

/** The lines of a record, or an array passed as-is — so consumers accept either without caring which. */
export function holdingsLines(x) {
  if (Array.isArray(x)) return x;
  return x && typeof x === 'object' && Array.isArray(x.lines) ? x.lines : [];
}

/**
 * The one-time EXPLICIT import of the Stress tester's fund list into the holdings record (the user says
 * "yes, these are what I hold"). Maps wrapper SIPP|ISA|GIA, value, ocf, contribution, subClass; a line the
 * user gave no identity to is dropped. Never called implicitly — a strategy's test list is not a ledger.
 */
export function linesFromTaggedFunds(taggedFunds, { asOf = null } = {}) {
  return (Array.isArray(taggedFunds) ? taggedFunds : [])
    .map((f) => normaliseLine({ ...(f || {}), asOf: (f && f.asOf) || asOf }))
    .filter(Boolean);
}

/** Count, total (lines with a value) and the total by wrapper. */
export function holdingsSummary(rec) {
  const lines = holdingsLines(rec);
  const byWrapper = { SIPP: 0, ISA: 0, GIA: 0, CASH: 0 };
  let total = 0;
  for (const l of lines) {
    const v = numOrNull(l && l.value); if (v == null) continue;
    total += v; byWrapper[normaliseWrapper(l.wrapper)] += v;
  }
  return { count: lines.length, total, byWrapper };
}
