/**
 * The gate's sums (lead4.md section 2, G3, G4, G7): pure, so the unit suite can prove the gate fails when two places
 * differ (tests/reading/parityGate.test.js), and the sweep's runner (scripts/e2e-parity.mjs) can total a run.
 *
 * A fixture's result (written by e2e/parity/sweep.spec.js, one file per fixture):
 *   { fixture, subject, pages: [{ view, page, opened, quiet }], places: [{ view, page, fact, text }],
 *     cells: [{ view, page, table, row, col, text }], fields: [{ view, page, field, value }],
 *     unmarked: { '<view>:<page>': n }, samples: { '<view>:<page>': [...] }, readings: [{ fact, want }] }
 *
 *   summarise(results)            → { facts, marks, fieldsBound, disagreements, oneViewOnly, unmarked, readingMismatches }
 *   ratchet(summary, baseline)    → { rose: [why], shrank: [why] }   (baseline: the three ratchet files' contents)
 *   baselineOf(summary)           → the three ratchet files' contents for this summary
 *   reportOf(summary, o)          → report.json's contents; lineOf(report) → the one printed line
 */

/** Displayed text as compared: the space trimmed and runs of space made one. */
export const shownText = (t) => String(t ?? '').replace(/ /g, ' ').replace(/\s+/g, ' ').trim();

/** A table cell compared as a fact of its own. */
export const cellFact = (c) => `table:${c.table}:${c.row}:${c.col}`;

const pairKey = (fixture, fact) => `${fixture}|${fact}`;
const VIEWS = ['simple', 'full'];

export function summarise(results) {
  const facts = new Set();
  const fields = new Set();
  let marks = 0;
  const disagreements = [];
  const oneViewOnly = [];
  const unmarked = {};
  const readingMismatches = [];
  for (const r of results) {
    const byFact = new Map();
    const put = (fact, view, page, text) => {
      if (!byFact.has(fact)) byFact.set(fact, []);
      byFact.get(fact).push({ view, page, text: shownText(text) });
    };
    for (const p of r.places || []) { put(p.fact, p.view, p.page, p.text); facts.add(p.fact); marks++; }
    for (const c of r.cells || []) { put(cellFact(c), c.view, c.page, c.text); facts.add(`table:${c.table}`); marks++; }
    for (const [fact, seen] of byFact) {
      const values = [...new Set(seen.map((s) => s.text))];
      if (values.length > 1) disagreements.push({ key: pairKey(r.fixture, fact), fixture: r.fixture, fact, values: seen });
      const views = new Set(seen.map((s) => s.view));
      // a fact shown in one view and nowhere in the other, for this plan (both views were opened)
      const opened = VIEWS.filter((v) => (r.pages || []).some((p) => p.view === v && p.opened));
      if (opened.length === 2 && views.size === 1) oneViewOnly.push({ key: pairKey(r.fixture, fact), fixture: r.fixture, fact, view: [...views][0] });
    }
    for (const reading of r.readings || []) {
      const seen = byFact.get(reading.fact) || [];
      const want = shownText(reading.want);
      const off = seen.filter((s) => s.text !== want);
      if (off.length) readingMismatches.push({ key: pairKey(r.fixture, reading.fact) + '#reading', fixture: r.fixture, fact: reading.fact, want, values: off });
    }
    // the same box, one value in both views
    const byField = new Map();
    for (const f of r.fields || []) {
      fields.add(f.field);
      if (!byField.has(f.field)) byField.set(f.field, []);
      byField.get(f.field).push({ view: f.view, page: f.page, text: shownText(f.value) });
    }
    for (const [field, seen] of byField) {
      if (new Set(seen.map((s) => s.text)).size > 1) disagreements.push({ key: pairKey(r.fixture, 'field:' + field), fixture: r.fixture, fact: 'field:' + field, values: seen });
    }
    for (const [page, n] of Object.entries(r.unmarked || {})) unmarked[`${r.fixture}|${page}`] = n;
  }
  return {
    fixtures: results.map((r) => r.fixture).sort(),
    facts: [...facts].sort(),
    marks,
    fieldsBound: fields.size,
    disagreements: [...disagreements, ...readingMismatches].sort((a, b) => a.key.localeCompare(b.key)),
    oneViewOnly: oneViewOnly.sort((a, b) => a.key.localeCompare(b.key)),
    unmarked,
    readingMismatches: readingMismatches.length
  };
}

/** The ratchet files' contents for a summary: what a baseline run writes. */
export function baselineOf(s) {
  return {
    known: { note: 'Fact x fixture pairs that still differ between places (lead4.md G4). May only shrink.', pairs: s.disagreements.map((d) => d.key) },
    unmarked: { note: 'Per fixture and page, figure-like text visible outside any mark (lead4.md G4). May only go down.', counts: Object.fromEntries(Object.entries(s.unmarked).sort(([a], [b]) => a.localeCompare(b))) },
    oneView: { note: 'Fact x fixture pairs shown in one view and nowhere in the other (lead4.md G4). May only shrink.', pairs: s.oneViewOnly.map((d) => d.key) }
  };
}

/**
 * Held against the ratchet files: a pair not listed, or a page above its count, is a rise. Only the fixtures in the run are
 * held (a run of some fixtures says nothing of the others). A listed pair now agreeing is a shrink to take out of the file.
 */
export function ratchet(s, base) {
  const inRun = (key) => s.fixtures.includes(String(key).split('|')[0]);
  const rose = [];
  const shrank = [];
  const known = new Set(base.known.pairs);
  const now = new Set(s.disagreements.map((d) => d.key));
  for (const d of s.disagreements) if (!known.has(d.key)) rose.push(`disagreement not in known-disagreements.json: ${d.key} (${d.values.map((v) => `${v.view} ${v.page}: "${v.text}"`).join(' / ')})`);
  for (const k of known) if (inRun(k) && !now.has(k)) shrank.push(`agrees now, take it out of known-disagreements.json: ${k}`);
  const oneBase = new Set(base.oneView.pairs);
  const oneNow = new Set(s.oneViewOnly.map((d) => d.key));
  for (const d of s.oneViewOnly) if (!oneBase.has(d.key)) rose.push(`shown in the ${d.view} view only, not in one-view-only.json: ${d.key}`);
  for (const k of oneBase) if (inRun(k) && !oneNow.has(k)) shrank.push(`in both views now, take it out of one-view-only.json: ${k}`);
  for (const [k, n] of Object.entries(s.unmarked)) {
    const was = base.unmarked.counts[k];
    if (was === undefined ? n > 0 : n > was) rose.push(`unmarked figures rose on ${k}: ${was ?? 0} → ${n}`);
    else if (was !== undefined && n < was) shrank.push(`unmarked figures fell on ${k}: ${was} → ${n}`);
  }
  return { rose, shrank };
}

export function reportOf(s, { at, fixtures = s.fixtures, rose = [], shrank = [], roundTripsFailed = null, notQuiet = [] } = {}) {
  return {
    at,
    fixtures,
    factsMarked: s.facts.length,
    marks: s.marks,
    fieldsBound: s.fieldsBound,
    disagreements: s.disagreements.length,
    unmarked: Object.values(s.unmarked).reduce((a, b) => a + b, 0),
    oneViewOnly: s.oneViewOnly.length,
    readingMismatches: s.readingMismatches,
    roundTripsFailed,
    rose,
    shrank,
    notQuiet,
    detail: { disagreements: s.disagreements, oneViewOnly: s.oneViewOnly }
  };
}

export const lineOf = (r) => `parity: ${r.fixtures.length} plans · facts marked ${r.factsMarked} (${r.marks} places) · fields bound ${r.fieldsBound} · disagreements ${r.disagreements} · unmarked ${r.unmarked} · one-view-only ${r.oneViewOnly} · round trips failed ${r.roundTripsFailed ?? 'not built'}${r.rose.length ? ` · ROSE ${r.rose.length}` : ''}`;
