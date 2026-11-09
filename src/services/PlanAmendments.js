/**
 * "I accept this risk" (7.7.0): the record that a person tested what they chose to keep against their locked plan and
 * agreed to the different risk it carries. Generic — any plan, any strategy, anything kept that the plan did not have.
 *
 * The plan's settings and its document stay exactly as locked (the document is NEVER rewritten). What the person holds may
 * differ from the plan by choice (HoldingsRecord: a line's `keep`, the record's `expected`); the re-test
 * (answers/plan/keepRun.js) runs the plan's own one test with what is held, and an agreement is one entry of a root list:
 *
 *   planAmendments: [{ at, kind: 'keep', lines: [{ key, wrapper, label, ticker, sedol, keep, value }],
 *                      expected: [{ id, label, wrapper, amount, by }], retest: { asLocked, asHeld, withoutExpected, shock },
 *                      engineVersion, fingerprint, documentAt }]
 *
 * written whole (one field), frozen once the plan is closed (PlanClosed.FROZEN_WHEN_CLOSED), dropped by a copy
 * (PlanCopy.copyOf) and kept byte-for-byte by every migration (storage/migrations.js protectedParts). Withdraw removes the
 * last entry. An agreement holds while what is kept is what was agreed (the fingerprint: which lines are kept and how, and
 * the money expected) and the plan document is the version it was made against; a kept line removed, a new keep, a change of
 * the money expected or a new version of the document makes it out of date.
 *
 * Pure: no storage, no engine, no clock (the moment arrives as `at`).
 *
 *   keptLinesOf(rec)                   the kept lines of a record, each with a key that does not depend on its place
 *   keepFingerprint(rec)               what an agreement is for: '' when nothing is kept and nothing expected
 *   normaliseAmendments(raw)           the list, every entry checked; anything else dropped
 *   amendmentState(plan)               { status: 'none'|'untested'|'agreed'|'stale', last, count, keeps }
 *   amendmentEntry(plan, result, { at })   the entry an "I accept this risk" writes, or null when the result is not for what is kept now
 *   amendmentsWith(plan, entry) / amendmentsWithoutLast(plan)   the whole list after an agreement / a withdraw
 */
import { normaliseHoldings, normaliseKeep, expectedOf, hasKeeps } from './HoldingsRecord.js';

const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const up = (s) => String(s == null ? '' : s).toUpperCase().trim();
const num = (v) => (Number.isFinite(+v) ? +v : 0);
const copy = (v) => (v === undefined ? undefined : JSON.parse(JSON.stringify(v)));

export const AMENDMENT_KINDS = Object.freeze(['keep']);
/** The root key the agreements live under. */
export const AMENDMENTS_KEY = 'planAmendments';

/** A line's key: its wrapper and what names it (code, SEDOL or name) — never its place in the list, which a paste can move. */
export const lineKeyOf = (l) => up(l && l.wrapper || 'SIPP') + ':' + (up(l && l.ticker) || up(l && l.sedol) || String((l && l.name) || '').trim().toLowerCase());

/** The kept lines of a record (normalised), each { key, wrapper, label, ticker, sedol, keep, value }; two lines with one key are numbered. */
export function keptLinesOf(rec) {
  const r = normaliseHoldings(rec);
  const seen = new Map();
  const out = [];
  for (const l of r.lines) {
    const keep = normaliseKeep(l.keep);
    if (!keep) continue;
    let key = lineKeyOf(l);
    const n = (seen.get(key) || 0) + 1; seen.set(key, n);
    if (n > 1) key += '#' + n;
    out.push({ key, wrapper: l.wrapper, label: l.name || l.ticker || l.sedol || '', ticker: l.ticker || null, sedol: l.sedol || null, keep, value: Math.round(num(l.value)) });
  }
  return out;
}

/** What an agreement is for: the kept lines (by key, and how each is kept) and the money expected (amount and month). '' for none. */
export function keepFingerprint(rec) {
  const r = normaliseHoldings(rec);
  if (!hasKeeps(r)) return '';
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

/**
 * Where the plan stands: 'none' (nothing kept, nothing expected and no agreement — every reading is exactly as before),
 * 'untested' (something kept, never agreed), 'agreed' (the last agreement is for what is kept now), 'stale' (an agreement,
 * but what is kept has changed since). `keeps`: whether the record keeps anything now.
 */
export function amendmentState(plan) {
  const list = amendmentsOf(plan);
  const rec = normaliseHoldings(plan && plan.holdings);
  const keeps = hasKeeps(rec);
  const locked = isLocked(plan) && isObj(plan && plan.planDocument);
  const last = list.length ? list[list.length - 1] : null;
  if (!locked || (!keeps && !last)) return { status: 'none', last, count: list.length, keeps };
  if (!last) return { status: 'untested', last: null, count: 0, keeps };
  // an agreement is for one version of the plan document: a new version (a new lock, or one written from today's settings) asks again
  const sameDocument = last.documentAt == null || last.documentAt === documentAtOf(plan);
  return { status: last.fingerprint === keepFingerprint(rec) && sameDocument ? 'agreed' : 'stale', last, count: list.length, keeps };
}

/**
 * The entry "I accept this risk" writes: what is kept now, the money expected, the re-test's figures (retestRecordOf), the
 * engine it ran on. Null when the result is not for what is kept now (its fingerprint differs: run it again) or nothing is kept.
 * @param {object} plan
 * @param {object} result   keepRun.js runKeepRetest's result
 * @param {{ at: string }} o  the moment, ISO
 */
export function amendmentEntry(plan, result, { at }) {
  const rec = normaliseHoldings(plan && plan.holdings);
  const fp = keepFingerprint(rec);
  if (!fp || !isObj(result) || result.fingerprint !== fp || typeof at !== 'string' || !ISO.test(at)) return null;
  return {
    at, kind: 'keep',
    lines: keptLinesOf(rec),
    expected: expectedOf(rec).map((e) => ({ id: e.id, label: e.label || null, wrapper: e.wrapper, amount: Math.round(num(e.amount)), by: e.by || null })),
    retest: retestRecordOf(result),
    engineVersion: typeof result.engineVersion === 'string' ? result.engineVersion : null,
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
