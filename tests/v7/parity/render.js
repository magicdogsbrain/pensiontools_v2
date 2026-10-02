/**
 * The readable parity ledger: research/v7/parity-ledger.md, made from tests/v7/parity/ledger.json. Never edited by hand;
 * `node tests/v7/parity/write-md.mjs` writes it, and ledger.test.js fails when the page and the data differ.
 *
 * Pure: the ledger in, the page's text out.
 */
import { STATUSES, rowsByKey, namespaceOf, waitsOf, incomeShapeNotYet } from './check.js';
import { NAMESPACES } from './namespaces.js';

export const LEDGER_JSON = 'tests/v7/parity/ledger.json';
export const LEDGER_MD = 'research/v7/parity-ledger.md';

const STATUS_WORDS = Object.freeze({
  built: 'Built',
  'building-now': 'Building now',
  designed: 'Designed',
  planned: 'Planned',
  retired: 'Retired'
});

/** Text that is safe inside a table cell: no pipe, no line break. */
const cell = (v) => String(v == null ? '' : v).replace(/\|/g, '\\|').replace(/\s*\n\s*/g, ' ').trim();
const code = (k) => '`' + k + '`';

/** The V7 column: the status and its evidence. */
function v7Cell(r, steps) {
  const short = r.status === 'building-now' && steps[r.step] && steps[r.step].short ? ' (' + steps[r.step].short + ')' : '';
  const head = '**' + STATUS_WORDS[r.status] + short + '**';
  if (r.status === 'built') return head + ': ' + r.files.map(code).join(', ') + (r.note ? '. ' + r.note : '');
  if (r.status === 'designed') return head + ': ' + r.doc + (waitsOf(r).length ? ' (waits for: ' + waitsOf(r).map(code).join(', ') + ')' : '') + (r.note ? '. ' + r.note : '');
  if (r.status === 'retired') return head + ': ' + r.reason + (r.owner ? ' (Owner: ' + r.owner + ')' : '');
  return head + (r.gap ? ' (no V7 design yet)' : '') + (r.note ? ': ' + r.note : '');
}

/**
 * @param {object} ledger  the parsed ledger.json
 * @returns {string} the page
 */
export function renderLedgerMarkdown(ledger) {
  const rows = ledger.rows;
  const steps = ledger.steps;
  const L = [];
  L.push('# Parity ledger: everything today\'s app does, and where it is in V7');
  L.push('');
  L.push('Generated from `' + LEDGER_JSON + '` by `node tests/v7/parity/write-md.mjs`. Do not edit this page by hand: change');
  L.push('the ledger and run the script. `tests/v7/parity/ledger.test.js` fails when a key today\'s app saves has no row,');
  L.push('when a row says built but names no file, when a row is retired without a reason, and when this page is out of date.');
  L.push('');
  L.push('Checked against ' + ledger.against + ' on ' + ledger.asOf + '.');
  L.push('');
  L.push('**The owner\'s rule (' + ledger.rule.date + '):** "' + ledger.rule.words + '"');
  L.push('');
  if (Array.isArray(ledger.summary)) { for (const p of ledger.summary) { L.push(p); L.push(''); } }

  // counts
  const count = (pred) => rows.filter(pred).length;
  L.push('## The count');
  L.push('');
  L.push('| | Rows | Things a person sees or sets | Saved settings | Records | Machinery |');
  L.push('|---|---|---|---|---|---|');
  for (const s of Object.keys(STATUSES)) {
    L.push('| ' + STATUS_WORDS[s] + ' | ' + count((r) => r.status === s) + ' | ' + ['option', 'setting', 'record', 'machinery'].map((k) => count((r) => r.status === s && r.kind === k)).join(' | ') + ' |');
  }
  L.push('| **All** | ' + rows.length + ' | ' + ['option', 'setting', 'record', 'machinery'].map((k) => count((r) => r.kind === k)).join(' | ') + ' |');
  L.push('');
  const gaps = rows.filter((r) => r.gap);
  L.push('Planned with no V7 design yet: **' + gaps.length + '** rows. Retired, waiting for the owner: **'
    + count((r) => r.status === 'retired' && /^to confirm/i.test(r.owner || '')) + '**.');
  L.push('');

  // the steps
  L.push('## The steps that deliver them');
  L.push('');
  L.push('| Step | What | Rows |');
  L.push('|---|---|---|');
  for (const [id, s] of Object.entries(steps)) {
    L.push('| ' + code(id) + ' | ' + cell(s.title) + (s.source ? ' (' + cell(s.source) + ')' : '') + ' | ' + count((r) => r.step === id) + ' |');
  }
  L.push('');

  // by area
  for (const a of ledger.areas) {
    const inArea = rows.filter((r) => r.area === a.id);
    if (!inArea.length) continue;
    L.push('## ' + a.title);
    L.push('');
    if (a.note) { L.push(a.note); L.push(''); }
    L.push('| What | What it does | Where in today\'s app | Who needs it | V7 | Step | Saved as |');
    L.push('|---|---|---|---|---|---|---|');
    for (const r of inArea) {
      L.push('| ' + [
        '**' + cell(r.name) + '**',
        cell(r.what),
        cell(r.whereV6),
        cell(r.who),
        cell(v7Cell(r, steps)),
        code(r.step),
        r.keys.length ? r.keys.map(code).join(' ') : '—'
      ].join(' | ') + ' |');
    }
    L.push('');
  }

  // every key, one line each: the switch-over checklist
  L.push('## Every saved key');
  L.push('');
  L.push('One line for each key today\'s app saves, with the row that carries it. The test holds this list to the keys it');
  L.push('reads from today\'s code and test plans, so nothing saved today can be missed at the switch.');
  L.push('');
  const byKey = rowsByKey(ledger);
  const byId = new Map(rows.map((r) => [r.id, r]));
  const notes = ledger.keyNotes || {};
  for (const [ns, where] of Object.entries(NAMESPACES)) {
    const keys = [...byKey.keys()].filter((k) => namespaceOf(k) === ns).sort();
    if (!keys.length) continue;
    L.push('### `' + ns + '`: ' + cell(where));
    L.push('');
    L.push('| Key | Row | V7 |');
    L.push('|---|---|---|');
    for (const k of keys) {
      const rs = byKey.get(k).map((id) => byId.get(id));
      L.push('| ' + code(k) + (notes[k] ? ': ' + cell(notes[k]) : '') + ' | ' + rs.map((r) => cell(r.name)).join('; ') + ' | '
        + [...new Set(rs.map((r) => STATUS_WORDS[r.status] + (r.gap ? ' (no V7 design yet)' : '')))].join('; ') + ' |');
    }
    L.push('');
  }

  // the lists the owner reads
  // the spending shape, not yet in V7 (review, 2 Oct 2026: count every part not built, never only the rows that are)
  const notYet = incomeShapeNotYet(ledger);
  const inShape = rows.filter((r) => r.area === 'income-shape').length;
  L.push('## The spending shape: not yet in V7 (' + notYet.length + ' of ' + inShape + ')');
  L.push('');
  L.push('The parts of today\'s income shape, and the dated extra spends drawn on it, that the /v7/ preview does not have yet.');
  L.push('Each is designed; none is retired. By the owner\'s rule each comes before V7 replaces today\'s planner.');
  L.push('');
  const byIdAll = new Map(rows.map((r) => [r.id, r]));
  for (const r of notYet) {
    const waits = waitsOf(r).map((w) => (byIdAll.get(w) ? byIdAll.get(w).name : w));
    L.push('- **' + r.name + '** (' + r.whereV6 + '). ' + STATUS_WORDS[r.status] + (r.doc ? ': ' + r.doc : '') + '.' + (waits.length ? ' Waits for: ' + waits.join('; ') + '.' : '') + ' Step ' + code(r.step) + '.');
  }
  if (!notYet.length) L.push('- None.');
  L.push('');
  L.push('## Planned, with no V7 design yet');
  L.push('');
  L.push('Each of these is something today\'s app does that no V7 document gives a place yet. By the owner\'s rule each one');
  L.push('stays (or comes back better) unless the owner agrees to retire it.');
  L.push('');
  for (const r of gaps) L.push('- **' + r.name + '** (' + r.whereV6 + '). Step ' + code(r.step) + '.' + (r.note ? ' ' + r.note : ''));
  if (!gaps.length) L.push('- None.');
  L.push('');
  L.push('## Retired, and why');
  L.push('');
  const retired = rows.filter((r) => r.status === 'retired');
  for (const r of retired) L.push('- **' + r.name + '**: ' + r.reason + (r.owner ? ' Owner: ' + r.owner + '.' : ''));
  if (!retired.length) L.push('- None.');
  L.push('');
  return L.join('\n');
}
