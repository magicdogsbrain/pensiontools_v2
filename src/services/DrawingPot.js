/**
 * The pension a plan being drawn holds now (lead4.md D3; step F1): ONE rule, read by the pension today
 * (services/PensionToday.js pensionTodayOf) and by Where you are (services/PlanDocument.js potLikeTheBand), so the two can
 * never name two figures for one pension.
 *
 *   drawingPensionOf({ history, holdings, diversifiers }) → null | {
 *     source  'record' (the newest month record's equity + bond + cash) | 'holdings' (the SIPP lines under What you hold)
 *     pension that figure
 *     asOf    the record's month ('YYYY-MM', dated from a batch's first month) or the holdings' date
 *     found   { rec, idx, recs } of the record read (null when What you hold is read)
 *   }
 *   What you hold wins whenever it is newer than the record (as new, for a plan holding diversifiers the record does not
 *   keep). Null when neither says a pension.
 *
 *   decisionPotRecordOf(history), wrapperFigure(holdings, wrapper), diversifierFigure(holdings), monthOf(x), monthsBetween(a, b)
 *
 * Pure: no storage, no clock.
 */
import { proportions as holdingsProportions } from './Holdings.js';
import { holdingsLines, normaliseWrapper, numOrNull } from './HoldingsRecord.js';

/** 'YYYY-MM' / 'YYYY-MM-DD' / a Date / { y, m } → { y, m } (m 1-based), or null. */
export function monthOf(x) {
  if (x instanceof Date) return Number.isFinite(x.getTime()) ? { y: x.getFullYear(), m: x.getMonth() + 1 } : null;
  if (x && typeof x === 'object') return Number.isInteger(x.y) && x.m >= 1 && x.m <= 12 ? { y: x.y, m: x.m } : null;
  const mm = /^(\d{4})-(\d{2})/.exec(String(x == null ? '' : x));
  return mm ? { y: +mm[1], m: +mm[2] } : null;
}
export const monthsBetween = (a, b) => (b.y * 12 + b.m) - (a.y * 12 + a.m);

/**
 * The record the pot comes from, and the month it was entered. A batch (quarterly or annual cadence) saves the same
 * values under each month it covers — some of them still ahead — so the values date from the batch's FIRST month:
 * walk back over consecutive months holding the same pots. Never onto a month filled in later (MonthFill): it carries a
 * later entry's pots by design, so a run of filled-in months is not a batch, and walking onto it dated the pension figure
 * to the first month filled in, months before it was entered.
 */
export function decisionPotRecordOf(history) {
  const recs = (history || []).filter((h) => h && monthOf(h.date)).slice().sort((a, b) => String(a.date).localeCompare(String(b.date)));
  if (!recs.length) return null;
  const same = (a, b) => ['equity', 'bond', 'cash'].every((k) => Math.abs((+a[k] || 0) - (+b[k] || 0)) < 0.5);
  let i = recs.length - 1;
  while (i > 0 && recs[i - 1].filledIn !== true && same(recs[i - 1], recs[i]) && monthsBetween(monthOf(recs[i - 1].date), monthOf(recs[i].date)) === 1) i--;
  return { rec: recs[i], idx: i, recs };
}

/** Sum of the holdings lines in one wrapper with a value, and the date they stand at (the record's, else the latest line's). */
export function wrapperFigure(holdings, wrapper) {
  const lines = holdingsLines(holdings).filter((l) => l && normaliseWrapper(l.wrapper) === wrapper && numOrNull(l.value) != null);
  if (!lines.length) return null;
  const asOf = (holdings && !Array.isArray(holdings) && holdings.updatedAt) || lines.map((l) => l.asOf).filter(Boolean).sort().pop() || null;
  return { value: lines.reduce((t, l) => t + numOrNull(l.value), 0), asOf: asOf ? String(asOf).slice(0, 10) : null };
}

/** The diversifiers among the SIPP lines under What you hold (the tagger's bucket), and their date; null with no SIPP lines. */
export function diversifierFigure(holdings) {
  const sipp = wrapperFigure(holdings, 'SIPP');
  if (!sipp) return null;
  const lines = holdingsLines(holdings).filter((l) => l && normaliseWrapper(l.wrapper) === 'SIPP' && numOrNull(l.value) != null).map((l) => ({ ...l, value: numOrNull(l.value) }));
  return { value: holdingsProportions(lines).bucketValues.diversifiers || 0, asOf: sipp.asOf };
}

/**
 * The ISA of a plan being drawn (the same rule Where you are counts it by): What you hold when it is as new as the latest record
 * that carries a typed ISA (its month or later); else that typed ISA; else What you hold whatever its date; else null.
 * → null | { value, source: 'holdings' | 'record', asOf }
 */
export function drawingIsaOf({ history = null, holdings = null } = {}) {
  const isa = wrapperFigure(holdings, 'ISA');
  const recs = Array.isArray(history) ? history.filter((h) => h && h.date && numOrNull(h.isaBalance) != null) : [];
  const typed = recs.length ? recs.reduce((a, b) => (String(b.date) > String(a.date) ? b : a)) : null;
  const typedAt = typed ? String(typed.date).slice(0, 7) : null;
  const isaNewer = isa && (!typedAt || (monthOf(isa.asOf) != null && monthsBetween(monthOf(typedAt), monthOf(isa.asOf)) >= 0));
  if (isa && isaNewer) return { value: isa.value, source: 'holdings', asOf: isa.asOf };
  if (typed) return { value: +typed.isaBalance, source: 'record', asOf: typedAt };
  if (isa) return { value: isa.value, source: 'holdings', asOf: isa.asOf };
  return null;
}

export function drawingPensionOf({ history = null, holdings = null, diversifiers = false } = {}) {
  const found = decisionPotRecordOf(history);
  const sipp = wrapperFigure(holdings, 'SIPP');
  const sippMonth = sipp && sipp.value > 0 ? monthOf(sipp.asOf) : null;
  // What you hold wins whenever it is newer than the record (7.12.0: for every plan, not only one holding diversifiers, which
  // the record cannot carry — that plan takes it from the record's own month on, as before)
  const since = found && sippMonth != null ? monthsBetween(monthOf(found.rec.date), sippMonth) : null;
  const holdingsWhole = !!(sipp && sipp.value > 0) && (!found || (since != null && (diversifiers ? since >= 0 : since > 0)));
  if (found && !holdingsWhole) {
    const rec = found.rec;
    return { source: 'record', pension: (+rec.equity || 0) + (+rec.bond || 0) + (+rec.cash || 0), asOf: String(rec.date).slice(0, 7), found };
  }
  if (sipp && sipp.value > 0) return { source: 'holdings', pension: sipp.value, asOf: sipp.asOf, found: null };
  return null;
}
