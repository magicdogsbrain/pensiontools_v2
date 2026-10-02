/**
 * A saver's pot against the locked saving path, like with like (6.22.0; research/saver-lock-and-savings-growth.md §4;
 * the owner's decision (A) of 2 Oct 2026: "make a saver's locked plan trustworthy").
 *
 * A plan locked while still saving keeps a saving path in its plan document (`planDocument.accumulation`). Each month the
 * saver records a pot on the Accumulation tab, and the "where you are" strip reads it against the path. Until 6.22.0 the
 * reading had three faults — 6.20.1 had fixed the same ones for a RETIRED person's reading, not for a saver's:
 *
 *  - the pounds: the path is in prices of the day it was drawn (projectAccumulation took 2.5% a year off every row), the
 *    recorded pot in pounds of its own month. After ten years of prices rising 2.5% a year a pot exactly on the path read
 *    about 28% ahead, and the arrival check then offered to unlock and re-plan;
 *  - the clock: it ran from the FIRST lock, and the path was read at today's date. Refreshing the plan document drew a
 *    new path from that day's pot, but the reading still counted from the first lock, so the saver looked behind;
 *  - the accounts: pension only, and the ISA was projected with nothing paid in.
 *
 * Two kinds of path, read differently; a stored document is never rewritten:
 *
 *  - VERSION 2 and older (every document locked before 6.22.0): pension only, the FCA 2/5/8% lines in the prices of the
 *    day the path was drawn. The pot is put into those prices at EXACTLY the 2.5% a year the path was deflated with
 *    (OLD_PATH_CPI) — not a guess: it compares the pot with the FCA projection in the same pounds; any other rate would put
 *    an exactly-on-course pot behind by construction. Pension against pension, and the words say the ISA is not in it.
 *  - VERSION 3 (locks from 6.22.0, services/SavingPath.js): drawn on V7's saving-years engine, one future per life, with
 *    the pension AND the ISA and what goes into each, in pounds of the day (`nominal`) — each future carries its own
 *    prices, so the recorded pot (pension + ISA) is compared with no price guess at all.
 *
 * Both read the path at the month of the pot record (not today), and from the path's OWN start: a version-3 path's
 * `asOf`, else the document's `createdAt` (a refreshed document starts again from its own day), else the lock.
 * The arrival check (LifeStage.arrivalCheck) calls the same function at the first month after the stop.
 *
 * Pure: no DOM, no storage, no clock (the caller passes the month).
 */
import { potOnPath } from './AccumulationEngine.js';

/** The yearly rise in prices every version-2 path was deflated with (projectAccumulation's assumedCpi, never passed). */
export const OLD_PATH_CPI = 0.025;
/** A version-3 path: drawn on V7's saving-years engine (services/SavingPath.js). */
export const SAVING_PATH_V3 = 3;

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** 'YYYY-MM' / 'YYYY-MM-DD' / an ISO instant / a Date / { y, m } → { y, m } (m 1-based), or null. */
export function monthOf(x) {
  if (x instanceof Date) return Number.isFinite(x.getTime()) ? { y: x.getFullYear(), m: x.getMonth() + 1 } : null;
  if (x && typeof x === 'object') return Number.isInteger(x.y) && x.m >= 1 && x.m <= 12 ? { y: x.y, m: x.m } : null;
  const mm = /^(\d{4})-(\d{2})/.exec(String(x == null ? '' : x));
  return mm && +mm[2] >= 1 && +mm[2] <= 12 ? { y: +mm[1], m: +mm[2] } : null;
}
const monthsBetween = (a, b) => (b.y * 12 + b.m) - (a.y * 12 + a.m);
const key = (at) => (at ? at.y + '-' + String(at.m).padStart(2, '0') : null);
/** { y, m } → 'March 2029'. */
export const monthWords = (at) => (at ? MONTHS[at.m - 1] + ' ' + at.y : '');

const isNum = (v) => typeof v === 'number' && Number.isFinite(v);

/** Which kind of saving path a document holds: 3, 2 (any older path), or null (none). */
export function savingPathVersion(doc) {
  const acc = doc && doc.accumulation;
  if (!acc || typeof acc !== 'object') return null;
  return acc.version === SAVING_PATH_V3 ? SAVING_PATH_V3 : 2;
}

/**
 * Where the path's clock starts: a version-3 path's own `asOf`, else the document's `createdAt` (every document is
 * written with the path it holds — a refresh draws both again), else the lock.
 * @returns {{ at: {y,m}|null, from: 'asOf'|'createdAt'|'lockedAt'|null }}
 */
export function pathStart(doc) {
  const d = doc || {};
  const acc = d.accumulation || {};
  if (acc.version === SAVING_PATH_V3 && monthOf(acc.asOf)) return { at: monthOf(acc.asOf), from: 'asOf' };
  if (monthOf(d.createdAt)) return { at: monthOf(d.createdAt), from: 'createdAt' };
  if (monthOf(d.lockedAt)) return { at: monthOf(d.lockedAt), from: 'lockedAt' };
  return { at: null, from: null };
}

/**
 * The factor that puts a pot of month `at` into the prices of the path's start, for a version-2 path (or the plan's pots
 * at retirement, when there is no path): 1.025 to the power of the years between. A version-3 path reads in pounds of
 * the day: factor 1.
 * @returns {{ factor: number, cpi: number|null, months: number, start: {y,m}|null }}
 */
export function saverPrices(doc, at) {
  const start = pathStart(doc).at;
  const m = monthOf(at);
  if (savingPathVersion(doc) === SAVING_PATH_V3 || !start || !m) return { factor: 1, cpi: null, months: start && m ? monthsBetween(start, m) : 0, start };
  const months = monthsBetween(start, m);
  return { factor: Math.pow(1 + OLD_PATH_CPI, months / 12), cpi: OLD_PATH_CPI, months, start };
}

/** Whether a version-3 path counts an ISA: there was one when it was drawn, or money was going into one. */
export function pathCountsIsa(doc) {
  const acc = doc && doc.accumulation;
  return !!(acc && acc.version === SAVING_PATH_V3 && ((+acc.isaNow || 0) > 0 || (+acc.isaMonthly || 0) > 0));
}

/** A version-3 path's three lines (pounds of the day) `months` after its start; straight lines within a year. */
function v3LinesAt(path, months) {
  const n = path.length;
  const y = Math.max(0, Math.min(n - 1, months / 12));
  const i = Math.floor(y), f = y - i;
  const a = path[i], b = path[Math.min(n - 1, i + 1)];
  const at = (k) => { const va = +a.nominal[k], vb = +b.nominal[k]; return va + (vb - va) * f; };
  return { low: at('careful'), expected: at('middling'), high: at('good') };
}

/**
 * The pension's own middle line of a version-3 path (pounds of the day) at the month `at`, read from the path's start as
 * saverReading reads it; null when the document holds no version-3 path. The arrival check sets a pension against it when
 * no ISA figure came with the month (review of 6.22.0).
 */
export function v3PensionLineAt(doc, at) {
  const acc = doc && doc.accumulation;
  const path = acc && acc.version === SAVING_PATH_V3 && Array.isArray(acc.path) ? acc.path : [];
  if (!path.length) return null;
  const start = pathStart(doc).at, m = monthOf(at);
  const months = start && m ? Math.max(0, monthsBetween(start, m)) : 0;
  const n = path.length;
  const y = Math.max(0, Math.min(n - 1, months / 12));
  const i = Math.floor(y), f = y - i;
  const va = +path[i].pension.middling, vb = +path[Math.min(n - 1, i + 1)].pension.middling;
  return va + (vb - va) * f;
}

/**
 * The reading: one recorded pot against the locked path, in the same accounts, the same pounds and at the same point.
 * @param {object} doc     the plan document (only read)
 * @param {{ at: 'YYYY-MM'|Date|{y,m}, pension: number|null, isa?: number|null }} pot   the pot and the month it is of
 * @returns {null | { version, start, at, months, pathMissing, isaCounted, actual, pension, isa, compared, prices,
 *   expected, low, high, band, missing: string[] }}
 *   `actual` is the pot as recorded (pension, plus the ISA when the path counts one); `compared` is what is set against
 *   the lines (version 2: in the path's prices). `band`: version 3 'below p10' | 'p10–p50' | 'p50–p90' | 'above p90', or
 *   'start' while its lines are still one figure (the month it was drawn);
 *   version 2 'below the cautious line' | 'below the locked path' | 'on or above the locked path' | 'above the strong line'.
 */
export function saverReading(doc, { at, pension = null, isa = null } = {}) {
  const acc = doc && doc.accumulation;
  if (!acc) return null;
  const version = savingPathVersion(doc);
  const path = Array.isArray(acc.path) ? acc.path : [];
  const start = pathStart(doc).at;
  const m = monthOf(at);
  const months = start && m ? Math.max(0, monthsBetween(start, m)) : 0;
  const isaCounted = pathCountsIsa(doc);
  const out = { version, start: key(start), at: key(m), months, pathMissing: !path.length, isaCounted, actual: null, pension: isNum(pension) ? Math.round(pension) : null, isa: isNum(isa) ? Math.round(isa) : null, compared: null, prices: null, expected: null, low: null, high: null, band: null, missing: [] };
  if (!path.length) return out;
  let lines;
  if (version === SAVING_PATH_V3) lines = v3LinesAt(path, months);
  else {
    const line = path[0].potMix != null ? 'potMix' : 'potMid';
    lines = { expected: potOnPath(path, months / 12, line), low: potOnPath(path, months / 12, 'potLow'), high: potOnPath(path, months / 12, 'potHigh') };
  }
  out.expected = Math.round(lines.expected); out.low = Math.round(lines.low); out.high = Math.round(lines.high);
  if (!isNum(pension)) { out.missing.push('pension'); return out; }
  if (isaCounted && !isNum(isa)) { out.missing.push('isa'); return out; }
  const actual = pension + (isaCounted ? isa : 0);
  const prices = saverPrices(doc, m || start);
  const compared = actual / prices.factor;
  out.actual = Math.round(actual);
  out.compared = Math.round(compared);
  out.prices = { factor: prices.factor, cpi: prices.cpi, start: key(prices.start) };
  // A version-3 path opens from one figure: until its lines part (the first month), there is no band to be in — 'start'.
  if (version === SAVING_PATH_V3) out.band = Math.abs(lines.high - lines.low) < 1 ? 'start' : compared < lines.low ? 'below p10' : compared < lines.expected ? 'p10–p50' : compared <= lines.high ? 'p50–p90' : 'above p90';
  else out.band = compared < lines.low ? 'below the cautious line' : compared < lines.expected ? 'below the locked path' : compared <= lines.high ? 'on or above the locked path' : 'above the strong line';
  return out;
}

/**
 * A box's figure: a number typed (£0 included), or null for a blank box or one that holds no number (review of 6.22.0: a
 * blank ISA box was read as £0, so a saver whose pension was on course read below the bad line).
 * @param {*} v  the box's value (a string from the page, or a number)
 * @returns {number|null}
 */
export function figureOrNull(v) {
  if (v == null) return null;
  if (typeof v === 'number') return Number.isFinite(v) ? v : null;
  const t = String(v).trim();
  if (!t) return null;
  const n = +t;
  return Number.isFinite(n) ? n : null;
}

/**
 * One month's pot record from the Accumulation tab's boxes (index.html recordAccumulationMonth). The pension and the
 * taxable boxes read blank as £0, as they always have; the ISA box keeps a blank as no figure (`isa: null`), and a typed
 * figure — £0 included — is marked `isaEntered: true`, because a record saved before 6.22.0 holds £0 for a blank box and
 * cannot be told from a typed £0 otherwise (saverPotOf). Null when no box holds a figure above £0 (nothing to record).
 * @param {{ date: string, sipp?: *, isa?: *, gia?: * }} boxes
 * @returns {null | { date, sipp: number, isa: number|null, gia: number, total: number, recordedAt: string, isaEntered?: true }}
 */
export function potRecordOf({ date, sipp, isa, gia } = {}, now = new Date()) {
  const P = figureOrNull(sipp) || 0, I = figureOrNull(isa), G = figureOrNull(gia) || 0;
  if (!(P > 0) && !(I > 0) && !(G > 0)) return null;
  return { date, sipp: P, isa: I, gia: G, total: P + (I || 0) + G, recordedAt: now.toISOString(), ...(I != null ? { isaEntered: true } : {}) };
}

/**
 * The ISA figure of a monthly pot record: null when there is none — a blank box (from 6.22.0, `isa: null`), or £0 on a
 * record saved before 6.22.0, which stored £0 for a blank box (no `isaEntered` mark). A figure above £0 was always typed.
 */
export function recordIsaOf(r) {
  if (!r || r.isa == null || !isNum(+r.isa)) return null;
  const v = +r.isa;
  return v === 0 && r.isaEntered !== true ? null : v;
}

/**
 * The pot a reading is made from, and the month it is of: the latest monthly pot record (Accumulation tab), else the pot
 * the caller already has for today, else the SIPP (and ISA) lines under What you hold, dated by the record.
 * @returns {{ source: 'record'|'today'|'holdings'|null, at: 'YYYY-MM'|null, recordedAt: string|null, pension: number|null, isa: number|null }}
 */
export function saverPotOf({ accHistory = [], potsToday = null, holdingsPension = 0, holdingsIsa = null, holdingsAsOf = null, today = new Date() } = {}) {
  const last = (accHistory || []).filter((r) => r && monthOf(r.date)).slice().sort((a, b) => String(a.date).localeCompare(String(b.date))).pop() || null;
  if (last) {
    const pension = isNum(+last.sipp) && last.sipp != null ? +last.sipp : (isNum(+last.total) ? +last.total : null);
    return { source: 'record', at: key(monthOf(last.date)), recordedAt: last.date, pension, isa: recordIsaOf(last) };
  }
  if (potsToday != null && isNum(+potsToday)) return { source: 'today', at: key(monthOf(today)), recordedAt: null, pension: +potsToday, isa: null };
  if (holdingsPension > 0) return { source: 'holdings', at: key(monthOf(holdingsAsOf) || monthOf(today)), recordedAt: holdingsAsOf || null, pension: holdingsPension, isa: isNum(holdingsIsa) ? holdingsIsa : null };
  return { source: null, at: key(monthOf(today)), recordedAt: null, pension: null, isa: null };
}
