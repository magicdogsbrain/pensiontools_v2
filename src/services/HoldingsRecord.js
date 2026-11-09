/**
 * Holdings record — the ONE ledger of what the person actually holds (6.13.0).
 *
 * `scenario.holdings` is a root record on the plan:
 *   { version, updatedAt: 'YYYY-MM-DD'|null, source: 'typed'|'paste'|'imported'|'none', offerDismissed, lines: [] }
 *   line: { wrapper: 'SIPP'|'ISA'|'GIA'|'CASH', ticker, name, sedol, units, value, ocf, contribution, subClass, kind, asOf, keep? }
 *   keep (7.6.0, set and cleared by the person, present only when set): { as: 'rung', taxYears: [Y…] } — the line stands in
 *     for the plan's money for those tax years — or { as: 'mine', fundsGaps: bool } — kept by choice, never a sell,
 *     optionally counted toward the gaps. The plan's settings and its document are never changed by it.
 *   expected (7.6.0, present only when there is any): [{ id, label, wrapper, amount, by: 'YYYY-MM'|null }] — money expected
 *     later (a pension elsewhere to be transferred in, say), not certain.
 *
 * It is what the Transition tool diffs against the plan document, what the Accumulation planner projects
 * from, what the plan document snapshots at lock (`holdingsAtLock`) and what the retire sweep starts from.
 * It is NOT the Stress tester's `taggedFunds`: that list is a strategy INPUT ("the funds to test"), and the
 * portfolio a strategy is tested on must never be assumed to be what the person holds (our ruling, 16 Sep
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

/** A tax year a keep may name: the April it starts, a whole year this century. */
const isTaxYear = (y) => Number.isInteger(y) && y >= 2000 && y <= 2100;
/**
 * "I'm keeping this" (7.6.0), normalised: { as: 'rung', taxYears } (sorted, unique, at least one) or { as: 'mine', fundsGaps }.
 * Anything else — no keep, an unknown kind, a stand-in for no year — is null.
 */
export function normaliseKeep(raw) {
  const k = raw && typeof raw === 'object' ? raw : null;
  if (!k) return null;
  if (k.as === 'rung') {
    const ys = [...new Set((Array.isArray(k.taxYears) ? k.taxYears : []).map((y) => +y).filter(isTaxYear))].sort((a, b) => a - b);
    return ys.length ? { as: 'rung', taxYears: ys } : null;
  }
  if (k.as === 'mine') return { as: 'mine', fundsGaps: k.fundsGaps === true };
  return null;
}
/** 'YYYY-MM', or null. */
export function monthOrNull(v) {
  const s = String(v == null ? '' : v).trim().slice(0, 7);
  return /^\d{4}-(0[1-9]|1[0-2])$/.test(s) ? s : null;
}
/**
 * Money expected later (7.6.0), normalised: each item { id, label, wrapper, amount, by }, an amount above nothing, an id of
 * letters, digits, '-' or '_' (one is made from its place when missing), the label cut to 80 characters. Items with no
 * amount are dropped; a repeated id is dropped.
 */
export function normaliseExpected(raw) {
  const out = [];
  const seen = new Set();
  (Array.isArray(raw) ? raw : []).forEach((x, i) => {
    const e = x && typeof x === 'object' ? x : null;
    if (!e) return;
    const amount = numOrNull(e.amount);
    if (!(amount > 0)) return;
    let id = String(e.id == null ? '' : e.id).trim();
    if (!/^[A-Za-z0-9_-]{1,40}$/.test(id)) id = 'e' + (i + 1);
    if (seen.has(id)) return;
    seen.add(id);
    out.push({ id, label: (strOrNull(e.label) || '').slice(0, 80) || null, wrapper: normaliseWrapper(e.wrapper), amount, by: monthOrNull(e.by) });
  });
  return out;
}

/** One line, every field present. Null when the line has no identity at all (no ticker, no name, no SEDOL). */
export function normaliseLine(raw) {
  const h = raw && typeof raw === 'object' ? raw : {};
  const ticker = strOrNull(h.ticker, { upper: true });
  const name = strOrNull(h.name);
  const sedol = strOrNull(h.sedol, { upper: true });
  if (!ticker && !name && !sedol) return null;
  const kind = KINDS.includes(h.kind) ? h.kind : null;
  const keep = normaliseKeep(h.keep);
  return {
    wrapper: normaliseWrapper(h.wrapper),
    ticker, name, sedol,
    units: numOrNull(h.units),
    value: numOrNull(h.value),
    ocf: numOrNull(h.ocf),                    // % a year, as the catalogue states it (0.22 = 0.22%)
    contribution: numOrNull(h.contribution),  // £ a month going into this line
    subClass: strOrNull(h.subClass),
    kind,
    asOf: dateOrNull(h.asOf),
    // only when the person said so (7.6.0): a record without keeps reads, and is written, exactly as before
    ...(keep ? { keep } : {})
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
  const expected = normaliseExpected(raw.expected);
  return { version: HOLDINGS_VERSION, updatedAt: dateOrNull(raw.updatedAt), source, offerDismissed: raw.offerDismissed === true, lines, ...(expected.length ? { expected } : {}) };
}

/** The money expected later on a record (7.6.0): its `expected`, normalised; none is an empty list. */
export function expectedOf(rec) {
  return normaliseExpected(rec && typeof rec === 'object' && !Array.isArray(rec) ? rec.expected : null);
}
/** Whether any line is kept or any money is expected (7.6.0): a record with neither reads exactly as before. */
export function hasKeeps(rec) {
  return holdingsLines(rec).some((l) => !!normaliseKeep(l && l.keep)) || expectedOf(rec).length > 0;
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

// ---- The record changed, as the planner's Transition handlers change it (6.43.0: lifted pure, research/v7/holdings-and-move.md §5) ----

/** 'YYYY-MM-DD' of `today`: a date string as given, a Date as the planner's todayIso (its UTC calendar day). */
const dayOf = (today) => (typeof today === 'string' ? today.slice(0, 10) : today instanceof Date ? today.toISOString().slice(0, 10) : null);

/**
 * The record as the planner's persistHoldings saves it: normalised with `source` (the record's own when none is given),
 * dated `today` when it has lines and undated without, 'none' when the last line has gone. The one stamp both apps use.
 * @param {object} record  any shape normaliseHoldings takes
 * @param {string|Date} today  the day of the write (the effect's clock, handed in)
 * @param {string|null} [source]  'typed' | 'paste' | 'imported'; null keeps the record's
 */
export function stampHoldings(record, today, source = null) {
  const rec = record && typeof record === 'object' ? record : {};
  const out = normaliseHoldings({ ...rec, source: source || rec.source || 'typed' });
  out.updatedAt = out.lines.length ? dayOf(today) : null;
  if (!out.lines.length) out.source = 'none';
  return out;
}

/** The fields a typed edit may change on a line, and which of them are numbers (the planner's updHolding). */
export const LINE_FIELDS = Object.freeze(['wrapper', 'ticker', 'name', 'sedol', 'units', 'value', 'ocf', 'contribution', 'subClass', 'kind', 'asOf']);
export const LINE_NUMBER_FIELDS = Object.freeze(['value', 'units', 'ocf', 'contribution']);

/** The source a typed change leaves: a pasted or imported record stays so (the planner's rule); anything else is typed. */
const typedSource = (rec) => (rec && (rec.source === 'paste' || rec.source === 'imported') ? rec.source : 'typed');

/**
 * A record after a change that says what a line is kept as, or what money is expected (7.6.0): no value changed, so the date
 * the values are as of (`updatedAt`) and the source stay as they were — the "as of" dates and the reminder to update what
 * you hold read the values, not the labels.
 */
function relabelled(was, next) {
  const out = normaliseHoldings({ ...next, source: was.source });
  out.updatedAt = was.updatedAt || null;
  return out;
}

/**
 * The next record after ONE change, exactly as the planner's handlers make it (index.html addHoldingLine, updHolding,
 * removeHolding, and the paste's apply), stamped with `today`:
 *   { kind: 'add', line }                      the line pushed (its identity checked by normaliseLine on the stamp)
 *   { kind: 'edit', index, field, value }      one field of line `index`: a number field takes '' as null, else +value; text as given
 *   { kind: 'remove', index }                  the line taken out; the source is kept
 *   { kind: 'merge', lines, source }           the lines replaced (a paste's merged ledger), stamped with `source`
 *   { kind: 'keep', index, keep }              line `index` kept (normaliseKeep), or kept no longer (keep null) — 7.6.0
 *   { kind: 'expected', op, id, item }         money expected later: op 'add' (item), 'edit' (id, item merged in), 'remove' (id)
 * Never writes; the record given is not changed. An index outside the record, or an unknown kind, throws.
 */
export function holdingsWith(record, change, { today } = {}) {
  const rec = normaliseHoldings(record);
  const c = change && typeof change === 'object' ? change : {};
  const lines = rec.lines.map((l) => ({ ...l }));
  if (c.kind === 'add') {
    lines.push(c.line && typeof c.line === 'object' ? { ...c.line } : {});
    return stampHoldings({ ...rec, lines }, today, typedSource(rec));
  }
  if (c.kind === 'edit') {
    const i = +c.index;
    if (!(i >= 0 && i < lines.length)) throw new Error('holdingsWith: no line ' + c.index);
    if (!LINE_FIELDS.includes(c.field)) throw new Error('holdingsWith: no field ' + c.field);
    lines[i][c.field] = LINE_NUMBER_FIELDS.includes(c.field) ? (c.value === '' || c.value == null ? null : +c.value) : c.value;
    return stampHoldings({ ...rec, lines }, today, typedSource(rec));
  }
  if (c.kind === 'remove') {
    const i = +c.index;
    if (!(i >= 0 && i < lines.length)) throw new Error('holdingsWith: no line ' + c.index);
    lines.splice(i, 1);
    return stampHoldings({ ...rec, lines }, today, rec.source);
  }
  if (c.kind === 'merge') {
    return stampHoldings({ ...rec, lines: Array.isArray(c.lines) ? c.lines : [] }, today, c.source || 'paste');
  }
  if (c.kind === 'keep') {
    const i = +c.index;
    if (!(i >= 0 && i < lines.length)) throw new Error('holdingsWith: no line ' + c.index);
    const keep = normaliseKeep(c.keep);
    if (c.keep != null && !keep) throw new Error('holdingsWith: not a keep');
    if (keep) lines[i].keep = keep; else delete lines[i].keep;
    return relabelled(rec, { ...rec, lines });
  }
  if (c.kind === 'expected') {
    const list = (rec.expected || []).map((e) => ({ ...e }));
    if (c.op === 'add') {
      const used = new Set(list.map((e) => e.id));
      let n = list.length + 1; while (used.has('e' + n)) n++;
      const want = c.item && c.item.id != null ? String(c.item.id) : '';
      const one = normaliseExpected([{ ...(c.item || {}), id: want && !used.has(want) ? want : 'e' + n }]);
      if (!one.length) throw new Error('holdingsWith: money expected needs an amount');
      list.push(one[0]);
    } else if (c.op === 'edit' || c.op === 'remove') {
      const i = list.findIndex((e) => e.id === String(c.id));
      if (i < 0) throw new Error('holdingsWith: no money expected called ' + c.id);
      if (c.op === 'remove') list.splice(i, 1);
      else {
        const one = normaliseExpected([{ ...list[i], ...(c.item || {}), id: list[i].id }]);
        if (!one.length) throw new Error('holdingsWith: money expected needs an amount');
        list[i] = one[0];
      }
    } else throw new Error('holdingsWith: no money-expected change called "' + c.op + '"');
    const { expected: _was, ...rest } = rec;
    return relabelled(rec, { ...rest, lines, ...(list.length ? { expected: list } : {}) });
  }
  throw new Error('holdingsWith: no change called "' + c.kind + '"');
}
