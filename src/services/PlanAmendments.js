/**
 * "I accept this risk" (7.7.0): the record that a person tested what they chose to keep against their locked plan and
 * agreed to the different risk it carries. Generic — any plan, any strategy, anything kept that the plan did not have.
 *
 * The plan's settings and its document stay exactly as locked (the document is NEVER rewritten). What the person holds may
 * differ from the plan by choice (HoldingsRecord: a line's `keep`, the record's `expected`); the re-test
 * (answers/plan/keepRun.js) runs the plan's own one test with what is held, and an agreement is one entry of a root list:
 *
 *   planAmendments: [{ at, kind: 'keep', lines: [{ key, wrapper, label, ticker, sedol, keep, value, units }],
 *                      expected: [{ id, label, wrapper, amount, by }], retest: { asLocked, asHeld, withoutExpected, shock },
 *                      engineVersion, othersValue, fingerprint, documentAt }]
 *
 * written whole (one field), frozen once the plan is closed (PlanClosed.FROZEN_WHEN_CLOSED), dropped by a copy
 * (PlanCopy.copyOf) and kept byte-for-byte by every migration (storage/migrations.js protectedParts). Withdraw removes the
 * last entry. An agreement holds while what is kept is what was agreed (the fingerprint: which lines are kept and how, and
 * the money expected), the figures behind it have not moved far (each kept line's units, and its value within VALUE_BAND of
 * the value agreed; the rest of what is held within VALUE_BAND of its total then), and the plan document is the version it
 * was made against; a kept line removed, a new keep, a change of the money expected, a kept line bought more of or sold down,
 * a large change in the rest, or a new version of the document makes it out of date. Ordinary price moves do not.
 * Money expected on its own is not a keep: a record that only expects money reads as it did before (7.6.0).
 *
 * Pure: no storage, no engine, no clock (the moment arrives as `at`).
 *
 *   keptLinesOf(rec)                   the kept lines of a record, each with a key that does not depend on its place
 *   keepFingerprint(rec)               what an agreement is for: '' when no line is kept
 *   holdingsKeyOf(rec)                 the record exactly as a re-test read it (a result is for that record only)
 *   figuresMoved(entry, rec)           whether the figures behind an agreement have moved far since
 *   normaliseAmendments(raw)           the list, every entry checked; anything else dropped
 *   amendmentState(plan)               { status: 'none'|'untested'|'agreed'|'stale', last, count, keeps }
 *   amendmentEntry(plan, result, { at })   the entry an "I accept this risk" writes, or null when the result is not for what is kept now
 *   amendmentsWith(plan, entry) / amendmentsWithoutLast(plan)   the whole list after an agreement / a withdraw
 */
import { normaliseHoldings, normaliseKeep, expectedOf } from './HoldingsRecord.js';

const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const up = (s) => String(s == null ? '' : s).toUpperCase().trim();
const num = (v) => (Number.isFinite(+v) ? +v : 0);
const copy = (v) => (v === undefined ? undefined : JSON.parse(JSON.stringify(v)));

/** How far a kept line's value (or the total of the rest of what is held) may move from the agreed figure before the agreement is out of date. */
export const VALUE_BAND = 0.25;
/** Below this many pounds a change is never "far" (rounding, a pound of interest). */
const VALUE_FLOOR = 100;

export const AMENDMENT_KINDS = Object.freeze(['keep']);
/** The root key the agreements live under. */
export const AMENDMENTS_KEY = 'planAmendments';

/** A line's key: its wrapper and what names it (code, SEDOL or name) — never its place in the list, which a paste can move. */
export const lineKeyOf = (l) => up(l && l.wrapper || 'SIPP') + ':' + (up(l && l.ticker) || up(l && l.sedol) || String((l && l.name) || '').trim().toLowerCase());

/** Whether any line of a record is kept (money expected alone is not a keep). */
export const keepsLines = (rec) => normaliseHoldings(rec).lines.some((l) => !!normaliseKeep(l.keep));

/** The key of every line of a record, in order: kept lines numbered as keptLinesOf numbers them; null for a line not kept. */
export function lineKeysOf(rec) {
  const r = normaliseHoldings(rec);
  const seen = new Map();
  return r.lines.map((l) => {
    if (!normaliseKeep(l.keep)) return null;
    let key = lineKeyOf(l);
    const n = (seen.get(key) || 0) + 1; seen.set(key, n);
    return n > 1 ? key + '#' + n : key;
  });
}

/** The kept lines of a record (normalised), each { key, wrapper, label, ticker, sedol, keep, value, units }; two lines with one key are numbered. */
export function keptLinesOf(rec) {
  const r = normaliseHoldings(rec);
  const keys = lineKeysOf(r);
  const out = [];
  r.lines.forEach((l, i) => {
    const keep = normaliseKeep(l.keep);
    if (!keep) return;
    out.push({ key: keys[i], wrapper: l.wrapper, label: l.name || l.ticker || l.sedol || '', ticker: l.ticker || null, sedol: l.sedol || null, keep, value: Math.round(num(l.value)), units: num(l.units) > 0 ? num(l.units) : null });
  });
  return out;
}

/** The total value of the lines not kept (every wrapper), whole pounds. */
export const othersValueOf = (rec) => Math.round(normaliseHoldings(rec).lines.filter((l) => !normaliseKeep(l.keep)).reduce((t, l) => t + num(l.value), 0));

/**
 * The record exactly as a re-test reads it: every line (what names it, its value, units and keep) and the money expected —
 * never its date. A re-test is for this record only; any change, even a price, asks for it to be run again.
 */
export function holdingsKeyOf(rec) {
  const r = normaliseHoldings(rec);
  return JSON.stringify({ lines: r.lines.map((l) => [l.wrapper, l.ticker || null, l.sedol || null, l.name || null, Math.round(num(l.value)), num(l.units), normaliseKeep(l.keep)]), expected: expectedOf(r).map((e) => [e.id, Math.round(num(e.amount)), e.by || null, e.wrapper]) });
}

/** What an agreement is for: the kept lines (by key, and how each is kept) and the money expected (amount and month). '' when no line is kept. */
export function keepFingerprint(rec) {
  const r = normaliseHoldings(rec);
  if (!keepsLines(r)) return '';
  const lines = keptLinesOf(r).map((l) => [l.key, l.keep]).sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));
  const expected = expectedOf(r).map((e) => [e.id, Math.round(num(e.amount)), e.by || null, e.wrapper]).sort((a, b) => (a[0] < b[0] ? -1 : 1));
  return JSON.stringify({ lines, expected });
}

/** One run's figures as an agreement keeps them: the chance, the bad case, the year it first runs short. */
function figuresOf(f) {
  if (!isObj(f)) return null;
  const b = isObj(f.badCase) ? f.badCase : {};
  return {
    affordable: f.affordable !== false,
    share: Math.max(0, Math.min(1, num(f.share))),
    badCase: { lasts: b.lasts === true, age: b.age == null ? null : Math.round(num(b.age)), year: b.year == null ? null : Math.round(num(b.year)) },
    endAge: f.endAge == null ? null : Math.round(num(f.endAge))
  };
}

/** The re-test as an agreement keeps it: the four sides, nothing else (no futures, no functions). */
export function retestRecordOf(result) {
  const r = isObj(result) ? result : {};
  const sh = isObj(r.shock) ? r.shock : null;
  return {
    asLocked: figuresOf(r.asLocked),
    asHeld: figuresOf(r.asHeld),
    withoutExpected: figuresOf(r.withoutExpected),
    shock: sh ? { half: figuresOf(sh.half), nothing: figuresOf(sh.nothing) } : null
  };
}

const ISO = /^\d{4}-\d{2}-\d{2}T/;
/** The list, every entry checked: a moment, a known kind, a fingerprint; anything else is dropped. */
export function normaliseAmendments(raw) {
  return (Array.isArray(raw) ? raw : []).filter((e) => isObj(e) && typeof e.at === 'string' && ISO.test(e.at) && AMENDMENT_KINDS.includes(e.kind) && typeof e.fingerprint === 'string');
}
export const amendmentsOf = (plan) => normaliseAmendments(plan && plan.planAmendments);

const isLocked = (plan) => !!(plan && plan.decisionTool && plan.decisionTool.settings && plan.decisionTool.settings.locked);
/** The version of the plan document an agreement is made against: the moment it was written (its createdAt, else its lockedAt). */
export const documentAtOf = (plan) => { const d = plan && plan.planDocument; return isObj(d) ? (d.createdAt || d.lockedAt || null) : null; };

/** Whether `now` is far from `then` (VALUE_BAND of the agreed figure, never under VALUE_FLOOR pounds). */
const far = (now, then) => Math.abs(num(now) - num(then)) > Math.max(VALUE_BAND * Math.abs(num(then)), VALUE_FLOOR);

/**
 * Whether the figures behind an agreement have moved far since (see the header): a kept line bought more of or sold down
 * (its units), its value far from the value agreed, or the rest of what is held far from its total then. An entry that kept
 * no figure for a part is not read on it.
 */
export function figuresMoved(entry, rec) {
  const now = new Map(keptLinesOf(rec).map((l) => [l.key, l]));
  for (const l of (entry && Array.isArray(entry.lines) ? entry.lines : [])) {
    const n = l && now.get(l.key);
    if (!n) continue;   // a line no longer kept changes the fingerprint
    if (l.units != null && num(l.units) > 0 && Math.abs(num(n.units) - num(l.units)) > 1e-6 * Math.max(1, num(l.units))) return true;
    if (l.value != null && far(n.value, l.value)) return true;
  }
  if (entry && entry.othersValue != null && far(othersValueOf(rec), entry.othersValue)) return true;
  return false;
}

/**
 * Where the plan stands: 'none' (no line kept and no agreement — every reading is exactly as before, money expected or not),
 * 'untested' (something kept, never agreed), 'agreed' (the last agreement is for what is kept now, its figures not moved
 * far), 'stale' (an agreement, but what is kept, or the figures behind it, have changed since). `keeps`: whether a line is
 * kept now.
 */
export function amendmentState(plan) {
  const list = amendmentsOf(plan);
  const rec = normaliseHoldings(plan && plan.holdings);
  const keeps = keepsLines(rec);
  const locked = isLocked(plan) && isObj(plan && plan.planDocument);
  const last = list.length ? list[list.length - 1] : null;
  if (!locked || (!keeps && !last)) return { status: 'none', last, count: list.length, keeps };
  if (!last) return { status: 'untested', last: null, count: 0, keeps };
  // an agreement is for one version of the plan document: a new version (a new lock, or one written from today's settings) asks again
  const sameDocument = last.documentAt == null || last.documentAt === documentAtOf(plan);
  return { status: last.fingerprint === keepFingerprint(rec) && sameDocument && !figuresMoved(last, rec) ? 'agreed' : 'stale', last, count: list.length, keeps };
}

/**
 * The entry "I accept this risk" writes: what is kept now, the money expected, the re-test's figures (retestRecordOf), the
 * engine it ran on, the rest of what is held (its total). Null when the result is not for the record as it is now (its
 * fingerprint or its record differs: run it again) or nothing is kept.
 * @param {object} plan
 * @param {object} result   keepRun.js runKeepRetest's result
 * @param {{ at: string }} o  the moment, ISO
 */
export function amendmentEntry(plan, result, { at }) {
  const rec = normaliseHoldings(plan && plan.holdings);
  const fp = keepFingerprint(rec);
  if (!fp || !isObj(result) || result.fingerprint !== fp || result.recordKey !== holdingsKeyOf(rec) || typeof at !== 'string' || !ISO.test(at)) return null;
  return {
    at, kind: 'keep',
    lines: keptLinesOf(rec),
    expected: expectedOf(rec).map((e) => ({ id: e.id, label: e.label || null, wrapper: e.wrapper, amount: Math.round(num(e.amount)), by: e.by || null })),
    retest: retestRecordOf(result),
    engineVersion: typeof result.engineVersion === 'string' ? result.engineVersion : null,
    othersValue: othersValueOf(rec),
    fingerprint: fp,
    documentAt: documentAtOf(plan)
  };
}

/** The whole list after one more agreement (the stored entries untouched). */
export function amendmentsWith(plan, entry) {
  return [...copy(amendmentsOf(plan)), copy(entry)];
}
/** The whole list without its last agreement ("Withdraw this"). */
export function amendmentsWithoutLast(plan) {
  const list = copy(amendmentsOf(plan));
  list.pop();
  return list;
}
