/**
 * The parity ledger's rules, as pure functions (tests/v7/parity/ledger.test.js runs them on the real ledger, and on
 * broken copies to prove each rule bites).
 *
 * The ledger (tests/v7/parity/ledger.json) has one row per thing a person can do or set in today's app (v6), and per
 * key today's app saves. Each row says what it does in plain words, where it is today, who needs it, and where it stands
 * in V7:
 *   built         in the /v7/ preview — `files` names where (each file must exist)
 *   building-now  being built now — `step` names the work
 *   designed      in a V7 design — `doc` names the document and section ("research/v7/x.md §1.6")
 *   planned       not designed yet — `step` names the step of the plan that delivers it; `gap: true` when no V7 document
 *                 names a place for it yet
 *   retired       going, on purpose — `reason` is the release-note line that says so; a thing a person can see or set
 *                 (kind "option") also needs `owner`: "to confirm", or the owner's words and date once agreed
 * Every row names `step`, a key of the ledger's `steps`.
 *
 * Pure: the file check is handed in.
 */
import { NAMESPACES } from './namespaces.js';

export const STATUSES = Object.freeze({
  built: 'Built in the /v7/ preview',
  'building-now': 'Being built now',
  designed: 'Designed in a V7 document, not built',
  planned: 'Planned: a step of the plan delivers it',
  retired: 'Retired, with a release note'
});

export const KINDS = Object.freeze({
  option: 'something a person sees, sets or presses',
  setting: 'a saved setting behind an option',
  record: 'something the person records (a month, a pot, a holding)',
  machinery: 'a key no person sees: bookkeeping, a cache, an old name'
});

const ID = /^[a-z0-9][a-z0-9.-]*[a-z0-9]$/;
const isText = (v, min = 1) => typeof v === 'string' && v.trim().length >= min;

/** The namespace of a key name: 'budget.lines[].paidBy' → 'budget'; 'strategyParams.floor-to-age.x' → 'strategyParams'. */
export function namespaceOf(key) {
  return String(key).split('.')[0].replace(/\[\]$/, '');
}

/**
 * Everything wrong with the ledger's shape, as plain sentences (empty when nothing is).
 * @param {object} ledger
 * @param {{ fileExists: (rel: string) => boolean }} env
 * @returns {string[]}
 */
export function shapeProblems(ledger, { fileExists }) {
  const out = [];
  if (!ledger || !Array.isArray(ledger.rows) || !ledger.rows.length) return ['the ledger has no rows'];
  const areas = new Set((ledger.areas || []).map((a) => a && a.id));
  const steps = ledger.steps && typeof ledger.steps === 'object' ? ledger.steps : {};
  for (const [id, s] of Object.entries(steps)) if (!s || !isText(s.title, 5)) out.push(`step "${id}" has no title`);
  const seen = new Set();
  for (const r of ledger.rows) {
    const at = `row "${r && r.id}"`;
    if (!r || !isText(r.id) || !ID.test(r.id)) { out.push(`${at}: the id must be lower-case words joined by dots or dashes`); continue; }
    if (seen.has(r.id)) out.push(`${at}: the id is used twice`);
    seen.add(r.id);
    if (!areas.has(r.area)) out.push(`${at}: area "${r.area}" is not one of the ledger's areas`);
    if (!KINDS[r.kind]) out.push(`${at}: kind "${r.kind}" is not one of ${Object.keys(KINDS).join(', ')}`);
    if (!isText(r.name, 3)) out.push(`${at}: no name`);
    if (!isText(r.what, 10)) out.push(`${at}: "what it does" is missing or too short`);
    if (!isText(r.whereV6, 3)) out.push(`${at}: "where it is in v6" is missing`);
    if (!isText(r.who, 3)) out.push(`${at}: "who needs it" is missing`);
    if (!Array.isArray(r.keys)) out.push(`${at}: keys must be a list (empty when the row saves nothing)`);
    else {
      const ks = new Set();
      for (const k of r.keys) {
        if (!isText(k) || !k.includes('.')) { out.push(`${at}: key "${k}" is not "<namespace>.<key>"`); continue; }
        if (!NAMESPACES[namespaceOf(k)]) out.push(`${at}: key "${k}" is in no known namespace`);
        if (ks.has(k)) out.push(`${at}: key "${k}" is named twice`);
        ks.add(k);
      }
    }
    if (!STATUSES[r.status]) { out.push(`${at}: status "${r.status}" is not one of ${Object.keys(STATUSES).join(', ')}`); continue; }
    if (!isText(r.step) || !steps[r.step]) out.push(`${at}: step "${r.step}" is not one of the ledger's steps`);
    if (r.status === 'built') {
      if (!Array.isArray(r.files) || !r.files.length) out.push(`${at}: says built but names no file`);
      else for (const f of r.files) if (!isText(f) || !fileExists(f)) out.push(`${at}: says built in "${f}", which does not exist`);
    }
    if (r.status === 'designed') {
      if (!isText(r.doc) || !r.doc.includes('§')) out.push(`${at}: says designed but names no document section ("research/v7/x.md §1.6")`);
      else if (!fileExists(r.doc.split('§')[0].trim())) out.push(`${at}: says designed in "${r.doc}", whose document does not exist`);
    }
    if (r.status === 'retired') {
      if (!isText(r.reason, 20)) out.push(`${at}: says retired but gives no release-note reason`);
      if (r.kind === 'option' && !isText(r.owner, 5)) out.push(`${at}: retires something a person can see or set, so it needs "owner": "to confirm" or the owner's agreement`);
    }
    if (r.gap !== undefined && typeof r.gap !== 'boolean') out.push(`${at}: gap must be true or false`);
    if (r.gap && r.status !== 'planned') out.push(`${at}: a gap (no V7 home yet) can only be planned`);
  }
  if (ledger.keyNotes !== undefined) {
    const named = rowsByKey(ledger);
    for (const [k, words] of Object.entries(ledger.keyNotes || {})) {
      if (!named.has(k)) out.push(`keyNotes: "${k}" is named by no row`);
      if (!isText(words, 5)) out.push(`keyNotes: "${k}" has no words`);
    }
  }
  return out;
}

/** The rows a row waits for: `waitsFor` is one id or a list of them. */
export const waitsOf = (r) => (r && r.waitsFor ? (Array.isArray(r.waitsFor) ? r.waitsFor : [r.waitsFor]) : []);

/**
 * The income-shape gate (the owner, 2 Oct 2026: "We MUST offer as many steps and tapers as V6! … optional it must be at
 * least v6"): everything wrong, as plain sentences ([] when nothing is). `ids` is the list of today's income-shape options
 * the gate holds. Each must be a row of the spending shape's area. None may be retired. One that is not built must be
 * designed: a V7 document section (shapeProblems checks it exists). If it waits for rows, each must exist, be on its way
 * (designed, planned, building or built: never retired) and have a V7 design of its own (not a gap): a row cannot wait
 * on something no V7 document gives a place (review, 2 Oct 2026). Every row of the area is in the list, so a part split
 * off a row cannot slip past it.
 * @param {object} ledger
 * @param {string[]} ids
 * @returns {string[]}
 */
export function incomeShapeProblems(ledger, ids) {
  const out = [];
  const rows = (ledger && ledger.rows) || [];
  const byId = new Map(rows.map((r) => [r.id, r]));
  for (const id of ids) {
    const r = byId.get(id);
    if (!r) { out.push(`income shape: "${id}" has no row`); continue; }
    if (r.area !== 'income-shape') out.push(`row "${id}": is in area "${r.area}", not the spending shape's ("income-shape")`);
    if (r.status === 'retired') { out.push(`row "${id}": is retired, and the owner's rule says none may be`); continue; }
    if (r.status !== 'built' && r.status !== 'designed') out.push(`row "${id}": is ${r.status}, but an income-shape option not built must be designed (a V7 document section)`);
    for (const w of waitsOf(r)) {
      const x = byId.get(w);
      if (!x) { out.push(`row "${id}": waits for "${w}", which is no row`); continue; }
      if (x.status === 'retired') out.push(`row "${id}": waits for "${w}", which is retired`);
      if (x.gap) out.push(`row "${id}": waits for "${w}", which has no V7 design yet (gap)`);
    }
    if (r.status === 'built' && waitsOf(r).length) out.push(`row "${id}": says built but still waits for ${waitsOf(r).join(', ')}`);
  }
  for (const r of rows) if (r.area === 'income-shape' && !ids.includes(r.id)) out.push(`row "${r.id}": is in the spending shape's area but not in the gate's list`);
  return out;
}

/** The spending shape's rows not built yet (the parity page's "not yet" list): each with the rows it waits for. */
export function incomeShapeNotYet(ledger) {
  return ((ledger && ledger.rows) || []).filter((r) => r.area === 'income-shape' && r.status !== 'built');
}

/** key → the ids of the rows that name it. */
export function rowsByKey(ledger) {
  const m = new Map();
  for (const r of (ledger && ledger.rows) || []) for (const k of r.keys || []) {
    if (!m.has(k)) m.set(k, []);
    m.get(k).push(r.id);
  }
  return m;
}

/**
 * The gate: keys today's app saves that no row names (`missing`), and keys rows name that today's app does not have
 * (`stale`).
 * @param {object} ledger
 * @param {Iterable<string>} harvested  every key today's app saves (harvest.js)
 */
export function coverage(ledger, harvested) {
  const named = rowsByKey(ledger);
  const have = new Set(harvested);
  return {
    missing: [...have].filter((k) => !named.has(k)).sort(),
    stale: [...named.keys()].filter((k) => !have.has(k)).sort()
  };
}
