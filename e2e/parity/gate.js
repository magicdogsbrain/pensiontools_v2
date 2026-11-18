/**
 * The gate's sums (lead4.md section 2, G3, G4, G7): pure, so the unit suite can prove the gate fails when two places
 * differ (tests/reading/parityGate.test.js), and the sweep's runner (scripts/e2e-parity.mjs) can total a run.
 *
 * A fixture's result (written by e2e/parity/sweep.spec.js, one file per fixture):
 *   { fixture, subject, pages: [{ view, page, opened, quiet }], places: [{ view, page, fact, text }],
 *     cells: [{ view, page, table, row, col, text }], fields: [{ view, page, field, value }],
 *     unmarked: { '<view>:<page>': n }, samples: { '<view>:<page>': [...] }, readings: [{ fact, want }] }
 *
 *   summarise(results)            → { facts, factsInBoth, marks, fieldsBound, disagreements, oneViewOnly, unmarked,
 *                                     readingMismatches, pages, shown }
 *   ratchet(summary, baseline, { only })  → { rose: [why], shrank: [why], grew: [why] }   (baseline: the ratchet files'
 *                                     contents; only: the fixtures named for the run, or null for a full run)
 *   baselineOf(summary)           → the ratchet files' contents for this summary
 *   reportOf(summary, o)          → report.json's contents; lineOf(report) → the one printed line
 *   roundTripsOf(results)         → the round trips' entries (e2e/parity/roundtrip.spec.js), one per box and direction:
 *                                     { key: '<field>|<s2f|f2s>' or '<test>|<what>', fixture, kind, press, detail }
 *   failedTrips(entries)          → those that did not come back as typed with no press: what report.json counts
 *   ratchetTrips(entries, known, { only }) → { rose, shrank } against known-roundtrips.json
 *   tripsBaselineOf(entries)      → known-roundtrips.json's contents
 *
 * A round trip's kinds, worst first: 'not reachable' (the box is not on the page it was typed on), 'not saved' (nothing
 * was written, with or without a press), 'not in the other view' (no box there), 'shows another value', 'differs from
 * opened directly', 'carried over', 'sweep breaks' (a fact disagrees on the pages read that the baseline does not list),
 * 'not tried' (a list of rows, not typed into yet), 'ok'. `press` is true when the save needed the page's Save button:
 * "needs a press" is its own entry when nothing else failed.
 */

/** Displayed text as compared: the space trimmed and runs of space made one. */
export const shownText = (t) => String(t ?? '').replace(/ /g, ' ').replace(/\s+/g, ' ').trim();

/** A table cell compared as a fact of its own. */
export const cellFact = (c) => `table:${c.table}:${c.row}:${c.col}`;

const pairKey = (fixture, fact) => `${fixture}|${fact}`;
const placeKey = (v) => `${v.view}:${v.page}`;

/** A disagreement's places and what each showed: { '<view>:<page>': [text, …] }, sorted, as known-disagreements.json holds it. */
export function placesOf(d) {
  const m = {};
  for (const v of d.values) (m[placeKey(v)] ||= new Set()).add(v.text);
  return Object.fromEntries(Object.entries(m).sort(([a], [b]) => a.localeCompare(b)).map(([k, t]) => [k, [...t].sort()]));
}
const VIEWS = ['simple', 'full'];

export function summarise(results) {
  const facts = new Set();
  const fields = new Set();
  let marks = 0;
  const disagreements = [];
  const oneViewOnly = [];
  const unmarked = {};
  const readingMismatches = [];
  const views = { simple: new Set(), full: new Set() };
  const pages = [];
  const shown = {};
  for (const r of results) {
    for (const p of r.pages || []) pages.push({ key: `${r.fixture}|${p.view}:${p.page}`, fixture: r.fixture, opened: !!p.opened, quiet: p.quiet, pressed: p.pressed });
    const byFact = new Map();
    const put = (fact, view, page, text) => {
      if (!byFact.has(fact)) byFact.set(fact, []);
      byFact.get(fact).push({ view, page, text: shownText(text) });
    };
    // how many places of each fact each view drew (a table: drawn at all, as its rows follow the plan's length)
    const count = (fact, view) => { const k = `${r.fixture}|${fact}|${view}`; shown[k] = fact.startsWith('table:') ? 1 : (shown[k] || 0) + 1; };
    for (const p of r.places || []) { put(p.fact, p.view, p.page, p.text); facts.add(p.fact); views[p.view]?.add(p.fact); count(p.fact, p.view); marks++; }
    for (const c of r.cells || []) { put(cellFact(c), c.view, c.page, c.text); facts.add(`table:${c.table}`); views[c.view]?.add(`table:${c.table}`); count(`table:${c.table}`, c.view); marks++; }
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
    factsInBoth: [...views.simple].filter((f) => views.full.has(f)).sort(),
    marks,
    fieldsBound: fields.size,
    fieldIds: [...fields].sort(),
    disagreements: [...disagreements, ...readingMismatches].sort((a, b) => a.key.localeCompare(b.key)),
    oneViewOnly: oneViewOnly.sort((a, b) => a.key.localeCompare(b.key)),
    unmarked,
    readingMismatches: readingMismatches.length,
    pages: pages.sort((a, b) => a.key.localeCompare(b.key)),
    shown: Object.fromEntries(Object.entries(shown).sort(([a], [b]) => a.localeCompare(b)))
  };
}

/** The pages a run opened, a press made on a page written as its own entry (`<page>#press`): the coverage floor's pages. */
const openedPagesOf = (s) => s.pages.flatMap((p) => (p.opened ? [p.key, ...(p.pressed ? [p.key + '#press'] : [])] : [])).sort();

/** The ratchet files' contents for a summary: what a baseline run writes. */
export function baselineOf(s) {
  return {
    known: {
      note: 'Fact x fixture pairs that still differ between places (lead4.md G4), each with its places and what each showed. May only shrink: a pair not listed, a value not listed for its pair, or a place not listed for its pair is a rise.',
      pairs: Object.fromEntries(s.disagreements.map((d) => [d.key, placesOf(d)]))
    },
    unmarked: { note: 'Per fixture and page, figure-like text visible outside any mark (lead4.md G4). May only go down.', counts: Object.fromEntries(Object.entries(s.unmarked).sort(([a], [b]) => a.localeCompare(b))) },
    oneView: { note: 'Fact x fixture pairs shown in one view and nowhere in the other (lead4.md G4). May only shrink.', pairs: s.oneViewOnly.map((d) => d.key) },
    coverage: {
      note: 'The FLOOR under the three ratchets (lead4.md G4): every plan of the gate, every page that opened (and press made), and per fixture, fact and view how many places drew the fact (a table: drawn at all). May only grow: a plan missing from a full run, a page that stops opening, or a mark taken off, is a rise.',
      fixtures: [...s.fixtures],
      pages: openedPagesOf(s),
      shown: { ...s.shown }
    }
  };
}

/**
 * Held against the ratchet files: a pair not listed, a listed pair showing a value or a place not listed for it, or a page
 * above its count, is a rise. Only the fixtures in the run are held (a run of some fixtures says nothing of the others), but
 * a full run (`only` null) must hold every plan of the floor (coverage.json "fixtures"), and a run of named fixtures every
 * one named: a plan dropped, renamed or failed would otherwise take its pairs, pages and places out unseen. A listed pair
 * now agreeing is a shrink to take out of the file.
 */
export function ratchet(s, base, { only = null } = {}) {
  const inRun = (key) => s.fixtures.includes(String(key).split('|')[0]);
  const rose = [];
  const shrank = [];
  const grew = [];
  const cover = base.coverage || { fixtures: [], pages: [], shown: {} };
  const floor = cover.fixtures || [];
  for (const f of only || floor) if (!s.fixtures.includes(f)) rose.push(only ? `a plan named for the run did not run: ${f}` : `a plan of the floor was not in the full run (dropped, renamed or failed?): ${f}`);
  for (const f of s.fixtures) if (!floor.includes(f)) grew.push(`a plan new to the floor, add it to coverage.json: ${f}`);
  if (Array.isArray(base.known.pairs)) throw new Error('known-disagreements.json lists bare pairs: it holds each pair\'s places and values now (write the baseline again)');
  const known = base.known.pairs || {};
  const now = new Set(s.disagreements.map((d) => d.key));
  const quoted = (t) => `"${t}"`;
  for (const d of s.disagreements) {
    const was = known[d.key];
    if (!was) { rose.push(`disagreement not in known-disagreements.json: ${d.key} (${d.values.map((v) => `${v.view} ${v.page}: "${v.text}"`).join(' / ')})`); continue; }
    // a listed pair can get worse: a value it never showed, or the fact drawn at a place it was not
    const listed = [...new Set(Object.values(was).flat())].sort();
    for (const [place, texts] of Object.entries(placesOf(d))) {
      const at = place.replace(':', ' ');
      if (!was[place]) { rose.push(`a listed disagreement is drawn at a new place: ${d.key} ${at}: ${texts.map(quoted).join(' / ')}`); continue; }
      for (const t of texts) if (!listed.includes(t)) rose.push(`a listed disagreement shows a new value: ${d.key} ${at}: ${quoted(t)} (listed: ${listed.map(quoted).join(' / ')})`);
    }
  }
  for (const k of Object.keys(known)) if (inRun(k) && !now.has(k)) shrank.push(`agrees now, take it out of known-disagreements.json: ${k}`);
  const oneBase = new Set(base.oneView.pairs);
  const oneNow = new Set(s.oneViewOnly.map((d) => d.key));
  for (const d of s.oneViewOnly) if (!oneBase.has(d.key)) rose.push(`shown in the ${d.view} view only, not in one-view-only.json: ${d.key}`);
  for (const k of oneBase) if (inRun(k) && !oneNow.has(k)) shrank.push(`in both views now, take it out of one-view-only.json: ${k}`);
  for (const [k, n] of Object.entries(s.unmarked)) {
    const was = base.unmarked.counts[k];
    if (was === undefined ? n > 0 : n > was) rose.push(`unmarked figures rose on ${k}: ${was ?? 0} → ${n}`);
    else if (was !== undefined && n < was) shrank.push(`unmarked figures fell on ${k}: ${was} → ${n}`);
  }
  // the floor: a page that stops opening, a press not made, or a mark taken off lowers the counts above; each is a rise
  const openedNow = new Set(openedPagesOf(s));
  for (const k of cover.pages) if (inRun(k) && !openedNow.has(k)) rose.push(`a page that opened before did not open: ${k}`);
  for (const k of openedNow) if (!cover.pages.includes(k)) grew.push(`opens now, add it to coverage.json: ${k}`);
  for (const [k, n] of Object.entries(cover.shown)) {
    const m = s.shown[k] || 0;
    if (inRun(k) && m < n) rose.push(`fewer places of a fact than before (a mark taken off?): ${k} ${n} → ${m}`);
  }
  for (const [k, m] of Object.entries(s.shown)) if (m > (cover.shown[k] || 0)) grew.push(`more places now, raise coverage.json: ${k} ${cover.shown[k] || 0} → ${m}`);
  // a page read before it settled was read half drawn: its figures prove nothing
  for (const p of s.pages) if (p.opened && p.quiet === false) rose.push(`a page was read before it went quiet: ${p.key}`);
  return { rose, shrank, grew };
}

export function reportOf(s, { at, fixtures = s.fixtures, rose = [], shrank = [], grew = [], roundTripsFailed = null, trips = null } = {}) {
  return {
    at,
    fixtures,
    factsMarked: s.facts.length,
    factsInBoth: s.factsInBoth.length,
    pagesOpened: s.pages.filter((p) => p.opened).length,
    marks: s.marks,
    fieldsBound: s.fieldsBound,
    disagreements: s.disagreements.length,
    unmarked: Object.values(s.unmarked).reduce((a, b) => a + b, 0),
    oneViewOnly: s.oneViewOnly.length,
    readingMismatches: s.readingMismatches,
    roundTripsFailed,
    rose,
    shrank,
    grew,
    notQuiet: s.pages.filter((p) => p.opened && p.quiet === false).map((p) => p.key),
    detail: { disagreements: s.disagreements, oneViewOnly: s.oneViewOnly, ...(trips ? { roundTrips: failedTrips(trips).map((t) => ({ key: t.key, kind: tripKindOf(t), ...(t.detail ? { detail: t.detail } : {}) })) } : {}) }
  };
}

export const lineOf = (r) => `parity: ${r.fixtures.length} plans · facts marked ${r.factsMarked} (${r.factsInBoth} in both views, ${r.marks} places, ${r.pagesOpened} pages) · fields bound ${r.fieldsBound} · disagreements ${r.disagreements} · unmarked ${r.unmarked} · one-view-only ${r.oneViewOnly} · round trips failed ${r.roundTripsFailed ?? 'not built'}${r.rose.length ? ` · ROSE ${r.rose.length}` : ''}`;

// ---- round trips (lead4.md G5) -----------------------------------------------------------------------------------------

export const TRIP_KINDS = Object.freeze(['not reachable', 'not saved', 'not in the other view', 'shows another value', 'differs from opened directly', 'carried over', 'sweep breaks', 'not tried', 'needs a press', 'ok']);

/** The kind a trip is counted as: its own, or "needs a press" when it came back but only after the Save button. */
export const tripKindOf = (t) => (t.kind === 'ok' && t.press ? 'needs a press' : t.kind);

export function roundTripsOf(results) {
  const out = [];
  for (const r of results) for (const t of r.entries || []) out.push({ fixture: r.fixture, ...t, press: !!t.press });
  return out.sort((a, b) => a.key.localeCompare(b.key));
}

export const failedTrips = (entries) => entries.filter((t) => tripKindOf(t) !== 'ok');

/**
 * Held against known-roundtrips.json ({ entries: { key: kind } }): a trip failing that is not listed, or listed as another
 * kind, is a rise; a listed trip now 'ok' (or of a kind listed later in TRIP_KINDS: better) is a shrink to take out or
 * narrow. Only the fixtures in the run are held; a full run (`only` null) must hold every listed trip.
 */
export function ratchetTrips(entries, known = {}, { only = null } = {}) {
  const rose = [];
  const shrank = [];
  const list = known.entries || {};
  const ran = new Set(entries.map((t) => t.fixture));
  const now = new Map(entries.map((t) => [t.key, t]));
  const rank = (k) => TRIP_KINDS.indexOf(k);
  for (const t of entries) {
    const k = tripKindOf(t);
    if (k === 'ok') continue;
    const was = list[t.key];
    if (!was) rose.push(`a round trip fails that known-roundtrips.json does not list: ${t.key} — ${k}${t.detail ? ' (' + t.detail + ')' : ''}`);
    else if (rank(k) < rank(was)) rose.push(`a listed round trip got worse: ${t.key} — ${was} → ${k}${t.detail ? ' (' + t.detail + ')' : ''}`);
    else if (rank(k) > rank(was)) shrank.push(`a listed round trip got better, narrow known-roundtrips.json: ${t.key} — ${was} → ${k}`);
  }
  for (const [key, was] of Object.entries(list)) {
    const t = now.get(key);
    if (!t) {
      if (!only && ran.size) rose.push(`a listed round trip was not run (dropped, renamed or failed?): ${key}`);
      continue;
    }
    if (tripKindOf(t) === 'ok') shrank.push(`comes back now, take it out of known-roundtrips.json: ${key} (was ${was})`);
  }
  return { rose, shrank };
}

export function tripsBaselineOf(entries) {
  return {
    note: 'Round trips that fail (lead4.md G5): per box and direction ("<field>|s2f" typed in the simple view, read in the full; "|f2s" the other way), and the plan-change trips, each with its kind. "needs a press" is a save that needed the page\'s Save button. May only shrink: a trip not listed, or listed as a better kind, is a rise.',
    entries: Object.fromEntries(failedTrips(entries).map((t) => [t.key, tripKindOf(t)]).sort(([a], [b]) => a.localeCompare(b)))
  };
}
