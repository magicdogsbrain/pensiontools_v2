/**
 * Transition tool — HTML. Pure: inputs in, HTML out.
 *
 * Two cards. "What you hold" edits the plan's holdings record (`scenario.holdings`, 6.12) — the ONLY ledger
 * the Transition tool reads; the Stress tester's fund list is a strategy input, never holdings. Below it, the
 * transition itself: the status (complete / progress / before the plan's income starts), the rotation watch when the strategy has one,
 * then the Buy / Sell / Already held / Left alone tables and the schedule.
 *
 * Inline handlers are plain calls with literal or `this.value` arguments (the no-eval grammar in
 * src/ui/inlineHandlers.js): no arrows, no optional chaining. The shell defines pasteHoldings, saveHoldingsUI,
 * importHoldingsFromStress, dismissHoldingsOffer, updHolding, removeHolding, addHoldingLine.
 */
import { esc } from './ReleaseNotesView.js';
import { CATEGORY_CHOICES, needsCategory, isGiltCode } from '../../services/HoldingsPaste.js';
import { SUB_ASSET_PROFILES, FUND_TAG_MAP } from '../../services/SubAssetModel.js';
import { sayGapLine } from '../../answers/plan/gaps.js';
import { GAPS } from '../../v7/copy/gaps.js';
import { sayKeep } from '../../answers/plan/keepTest.js';
import { KEEPTEST } from '../../v7/copy/keepTest.js';
import { MOVE } from '../../v7/copy/move.js';
import { heldLadderHtml } from './HeldLadderView.js';
import { heldSummaryView, sayHeld } from '../../answers/plan/held.js';
import { HELD } from '../../v7/copy/held.js';
import { PLAN } from '../../v7/copy/plan.js';
import { LAYOUT } from '../../appLayout.js';
import { moveStatusOf, sayMoveStatus, payingOf, outsideRowsOf, moveTotalsOf, cashRowsOf, fillMove } from '../../answers/plan/moveWords.js';

const gbp = (v) => '£' + Math.round(+v || 0).toLocaleString('en-GB');
const units = (u) => (u == null ? '' : Math.round(u).toLocaleString('en-GB'));
function table(head, rows) {
  if (!rows.length) return '';
  return '<div class="table-scroll-container"><table><thead><tr>' + head.map((h) => '<th>' + esc(h) + '</th>').join('') + '</tr></thead><tbody>'
    + rows.map((r) => '<tr>' + r.map((c) => '<td>' + c + '</td>').join('') + '</tr>').join('') + '</tbody></table></div>';
}
const monthWordsLong = (ym) => { const [y, m] = String(ym).split('-').map(Number); return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][m - 1] + ' ' + y; };
const monthName = (ym) => { const [y, m] = String(ym).split('-').map(Number); return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][m - 1] + ' ' + y; };
const dateGB = (iso) => { const d = new Date(String(iso) + 'T00:00:00Z'); return Number.isNaN(d.getTime()) ? String(iso || '') : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }); };

export const HOLDING_WRAPPERS = ['SIPP', 'ISA', 'GIA', 'CASH'];
const SOURCE_TEXT = { typed: 'typed in', paste: 'pasted from your platform', imported: 'taken from the Stress tester\'s fund list' };
const valued = (l) => l && ((+l.value || 0) > 0 || (+l.units || 0) > 0);
const numAttr = (v) => (v == null || v === '' || !Number.isFinite(+v) ? '' : String(+v));

/** What a placed line is, in a word or two; or the "What is this?" dropdown for a line the tool cannot place (6.23). */
function whatItIsHtml(i, L) {
  if (needsCategory(L)) {
    return '<select data-on-change="updHolding(' + i + ',\'subClass\',this.value)" style="width:auto;" title="What is this?"><option value="" selected>What is this?</option>'
      + CATEGORY_CHOICES.map((c) => '<option value="' + (c.subClass || '') + '">' + esc(c.label) + '</option>').join('') + '</select>';
  }
  if (String(L.wrapper || '').toUpperCase() === 'CASH') return '<span class="hint">Bank cash</span>';
  if (L.kind === 'gilt' || (!L.subClass && isGiltCode(L.ticker))) return '<span class="hint">Gilt</span>';
  if (L.kind === 'cash' && !L.subClass) return '<span class="hint">Cash</span>';
  const key = L.subClass || FUND_TAG_MAP[String(L.ticker || '').toUpperCase()];
  const prof = key ? SUB_ASSET_PROFILES[key] : null;
  const bucket = prof ? { shares: 'Shares', bonds: 'Bonds', cash: 'Cash', diversifiers: 'Gold and trend' }[prof.bucket] : null;
  return '<span class="hint">' + esc(bucket || 'Fund') + '</span>';
}

/** Wrapper <select> for a row (or the add row when `i` is null). */
function wrapperSelect(i, current) {
  const attr = i == null ? ' id="hlWrapper"' : ' data-on-change="updHolding(' + i + ',\'wrapper\',this.value)"';
  return '<select' + attr + ' style="width:auto;">' + HOLDING_WRAPPERS.map((w) => '<option value="' + w + '"' + (String(current || 'SIPP').toUpperCase() === w ? ' selected' : '') + '>' + w + '</option>').join('') + '</select>';
}

const taxYearWords = (Y) => Y + '/' + String(+Y + 1).slice(2);
/**
 * "Keep this" on one line (7.6.0): not kept, standing in for some tax years (typed as "2027/28, 2028/29"), or kept by
 * choice (counted toward the gaps, or not). Each change is one save of the record (the shell's keepHolding / keepHoldingYears).
 * It sits under the line's wrapper, in the first column, so a phone finds it without scrolling the table sideways. "Stands in" saves the
 * plan's first open year until the years box is typed in — never a year worked out from when a gilt matures (7.12.0).
 * Living on a ladder (7.12.0, `keep.held`): no "Keep this" — on a pension line that is neither one of the plan's gilts nor cash
 * (`keep.at`), one optional box for the tax years the person sets it against, empty unless they set some (keepHoldingFor).
 */
function keepCellHtml(i, L, keep) {
  if (keep.held) {
    if (!keep.at.has(i)) return '';
    const k = L && L.keep && L.keep.as === 'rung' && Array.isArray(L.keep.taxYears) ? L.keep.taxYears : [];
    const years = k.map(taxYearWords).join(', ');
    return '<label class="hint" style="display:block;margin-top:4px;">' + esc(HELD.forYearsLabel) + '<br><input type="text" value="' + esc(years) + '" placeholder="' + esc(HELD.forYearsPlaceholder) + '" style="width:150px;" data-on-change="keepHoldingFor(' + i + ',this.value)"></label>'
      + (years ? '<span class="hint" style="display:block;">' + esc(HELD.forYears.replace('{years}', years)) + '</span>' : '')
      + '<span class="hint" style="display:block;">' + esc(HELD.forYearsHelp) + '</span>';
  }
  const k = L && L.keep;
  const cur = !k ? '' : k.as === 'rung' ? 'rung' : k.fundsGaps ? 'mineGaps' : 'mine';
  const opts = [['', 'Not kept'], ...(keep.ladder ? [['rung', 'Stands in for some years']] : []), ['mine', 'Kept by choice'], ['mineGaps', keep.ladder ? GAPS.keep.byChoiceGaps.replace(/\.$/, '') : GAPS.keep.byChoicePlan.replace(/\.$/, '')]];
  const years = Array.isArray(keep.years) ? keep.years : [];
  const first = keep.ladder ? (years[0] || 0) : 0;
  let h = '<label class="hint" style="display:block;margin-top:4px;">Keep this <select data-on-change="keepHolding(' + i + ',this.value,' + first + ')" style="width:auto;" aria-label="Keep this">' + opts.map((o) => '<option value="' + o[0] + '"' + (o[0] === cur ? ' selected' : '') + '>' + esc(o[1]) + '</option>').join('') + '</select></label>';
  if (cur === 'rung') h += '<label class="hint" style="display:block;margin-top:4px;">' + esc(GAPS.keep.yearsTyped) + '<br><input type="text" value="' + esc((k.taxYears || []).map(taxYearWords).join(', ')) + '" placeholder="2027/28, 2028/29" style="width:150px;" aria-label="' + esc(GAPS.keep.years) + '" data-on-change="keepHoldingYears(' + i + ',this.value)"></label>';
  return h;
}

/** Money expected later (7.6.0): each item with Remove, and the add row (the shell's addExpected / removeExpected). */
function expectedHtml(expected) {
  const E = GAPS.expected;
  const list = Array.isArray(expected) ? expected : [];
  let h = '<div class="section-title" style="margin-top:10px;">' + esc(E.title) + '</div><p class="hint">' + esc(E.lead) + '</p>';
  if (!list.length) h += '<p class="hint">' + esc(E.none) + '</p>';
  else h += '<ul style="font-size:13px;line-height:1.6;">' + list.map((e) => '<li>' + esc((e.label || E.unnamed) + ': ' + gbp(e.amount) + (e.by ? ', expected by ' + monthName(e.by) : '') + '.') + ' <button type="button" class="risk-btn" data-on-click="removeExpected(\'' + esc(e.id) + '\')">Remove</button></li>').join('') + '</ul>';
  h += '<div class="row-flex" style="gap:8px;align-items:flex-end;flex-wrap:wrap;">'
    + '<label class="hint" style="display:flex;flex-direction:column;gap:2px;">' + esc(E.fields.label) + '<input type="text" id="hlExpLabel" style="min-width:160px;"></label>'
    + '<label class="hint" style="display:flex;flex-direction:column;gap:2px;">' + esc(E.fields.amount) + '<input type="number" id="hlExpAmount" step="any" style="width:120px;"></label>'
    + '<label class="hint" style="display:flex;flex-direction:column;gap:2px;">' + esc(E.fields.by) + '<input type="month" id="hlExpBy" style="width:150px;"></label>'
    + '<button type="button" class="risk-btn" data-on-click="addExpected()">' + esc(E.add) + '</button></div>';
  return h;
}

/**
 * "What is covered, year by year" (7.6.0): the same reading and the same sentences as V7 (answers/plan/gaps.js gapsView,
 * filled with src/v7/copy/gaps.js), as a table and a list. Nothing when there is nothing to read (gapsOf's null rule).
 */
export function gapsHtml(gaps) {
  if (!gaps) return '';
  const G = GAPS;
  // a plan drawn from a pot has no years bought ahead: what is kept and expected, with no year by year (as V7 says it)
  // 7.11.1: a reading of what is held beyond the plan's own says so in its lead (gapsView `lead`)
  let h = '<div class="section-title" style="margin-top:12px;">' + esc(gaps.ladder ? G.title : G.titlePot) + '</div><p class="hint">' + esc(gaps.ladder ? G[gaps.lead || 'lead'] : G.leadPot) + '</p>';
  h += '<ul style="font-size:13px;line-height:1.6;" id="transitionGaps">' + gaps.lines.map((l) => '<li data-line="' + esc(l.id) + '">' + esc(sayGapLine(l, G)) + '</li>').join('') + '</ul>';
  if (gaps.ladder && gaps.rows.length) {
    const held = (r) => (r.parts.length ? r.parts.map((p) => (p.kind === 'standIn' ? p.label + ' ' + p.amount : G.heldParts[p.kind] + ' ' + p.amount)).join(', ') : G.none) + (r.toBuy ? ' · ' + G.heldParts.toBuy.replace('{amount}', r.toBuy) : '');
    h += table([G.columns.year, G.columns.need, G.columns.held, G.columns.gap], gaps.rows.map((r) => [esc(r.thisYear ? G.thisYear.replace('{year}', r.year).replace('{months}', r.monthsLeft).replace('{s}', r.monthsLeft === '1' ? '' : 's') : r.year), esc(r.need), esc(held(r)), esc(r.gap || G.none)]));
  }
  return h;
}

/**
 * "Test what you keep against your plan" and "I accept this risk" (7.7.0): the same reading and the same words as V7
 * (answers/plan/keepTest.js keepTestOf, filled with src/v7/copy/keepTest.js). The test runs only on the button; the agreement
 * is one save after the confirm on the page. Nothing when the plan keeps nothing.
 */
export function keepTestHtml(v) {
  if (!v) return '';
  const K = KEEPTEST;
  const say = (p) => esc(sayKeep(p, K));
  const run = v.run || { status: 'idle' };
  const r = v.result;
  const can = !v.closed;
  let h = '<div id="transitionKeepTest" data-status="' + esc(v.status) + '"><div class="section-title" style="margin-top:12px;">' + esc(K.title) + '</div><p class="hint">' + esc(K.lead) + '</p>';
  if (v.line) h += '<p class="' + (v.status === 'agreed' ? 'hint' : 'alert alert-info') + '" id="transitionKeepLine" data-status="' + esc(v.status) + '">' + say(v.line) + '</p>';
  if (v.keeps) h += '<p class="hint">' + esc(K.how) + '</p>';
  if (can && v.keeps) h += '<div class="row-flex" style="gap:8px;"><button type="button" class="risk-btn" id="keepTestRun" data-on-click="runKeepTest()"' + (run.status === 'working' ? ' disabled' : '') + '>' + esc(r ? K.again : K.run) + '</button></div>';
  if (run.status === 'working') h += '<p class="hint" role="status">' + esc(K.running) + '</p>';
  if (run.status === 'failed') h += '<p class="alert alert-warning">' + esc(K.failed) + '</p>';
  if (r) {
    const cell = (side, row) => (!side ? '—' : row === 'lasts' ? esc(K.lasts.replace('{words}', side.words)) : say(side.bad));
    const heads = [K.columns.what, K.columns.locked, K.columns.held, ...(r.without ? [K.columns.without] : [])];
    h += '<div id="keepTestResult">' + table(heads.map(esc), ['lasts', 'bad'].map((row) => [esc(K.rows[row]), cell(r.locked, row), cell(r.held, row), ...(r.without ? [cell(r.without, row)] : [])]));
    if (r.firstShort) h += '<p class="hint">' + say(r.firstShort) + '</p>';
    if (r.shock.length) h += '<div class="section-title" style="margin-top:8px;font-size:13px;">' + esc(K.shockTitle) + '</div>' + r.shock.map((x) => '<p class="hint" data-shock="' + esc(x.id) + '">' + say(x) + '</p>').join('');
    if (r.single) h += '<p class="alert alert-warning">' + say(r.single) + '</p>';
    h += '</div>';
  }
  if (can && v.canAccept && !v.confirmOpen) h += '<div class="row-flex" style="gap:8px;"><button type="button" id="keepTestAccept" data-on-click="askKeepRisk()">' + esc(K.accept) + '</button></div>';
  if (can && v.canAccept && v.confirmOpen) h += '<div class="alert alert-info" id="keepTestConfirm"><p style="margin:0 0 6px;">' + esc(K.acceptLead) + '</p><div class="row-flex" style="gap:8px;"><button type="button" id="keepTestConfirmYes" data-on-click="acceptKeepRisk()">' + esc(K.acceptYes) + '</button><button type="button" class="risk-btn" data-on-click="cancelKeepRisk()">' + esc(K.acceptNo) + '</button></div></div>';
  if (v.agreed) h += '<p class="hint" id="keepTestAgreedOn">' + esc(K.agreedOn.replace('{date}', v.agreed.on)) + '</p>';
  if (can && v.canWithdraw) h += '<div class="row-flex" style="gap:8px;"><button type="button" class="risk-btn" id="keepTestWithdraw" data-on-click="withdrawKeepRisk()">' + esc(K.withdraw) + '</button></div>';
  // Undo the last agreement or withdraw (one save of the list as it was), while nothing else has changed it
  if (can && v.undo) h += '<div class="row-flex" style="gap:8px;"><button type="button" class="risk-btn" id="keepTestUndo" data-undo="' + esc(v.undo.id) + '" data-on-click="undoKeepRisk()">' + esc(K.undo) + '</button></div>';
  return h + '</div>';
}

/**
 * "This is how I want to hold it" (7.12.0), from V7's reading (moveOf's `sayHeld` / `saidHeld`, through transitionHeld): offered
 * while Moving with buys to make, with its confirm; once said, the day, the gilts not bought in full, and "Take this back".
 */
export function sayHeldHtml(held) {
  if (!held) return '';
  const S = MOVE.sayHeld, H = MOVE.held;
  if (held.saidHeld) {
    const x = held.saidHeld;
    return '<div id="transitionSaidHeld"><p><strong>' + esc(fillMove(H.agreed, x)) + '</strong></p>'
      + (x.notFull ? '<p>' + esc(fillMove(x.notFull.n === '1' ? H.notFullOne : H.notFull, x.notFull)) + '</p>' : '')
      + (x.withdrawable ? '<div class="row-flex" style="gap:8px;"><button type="button" class="risk-btn" id="takeBackSayHeld" data-on-click="takeBackSayHeld()">' + esc(H.takeBack) + '</button></div>' : '') + '</div>';
  }
  if (!held.sayHeld) return '';
  let h = '<div id="transitionSayHeld" style="margin-top:8px;"><p><strong>' + esc(S.title) + '</strong> ' + esc(S.lead) + '</p>';
  if (held.sayHeldOpen) h += '<div class="alert alert-info"><p style="margin:0 0 6px;">' + esc(S.confirm) + '</p><div class="row-flex" style="gap:8px;"><button type="button" id="sayHeldYes" data-on-click="sayHeldFull()">' + esc(S.yes) + '</button><button type="button" class="risk-btn" data-on-click="cancelSayHeld()">' + esc(S.no) + '</button></div></div>';
  else h += '<div class="row-flex" style="gap:8px;"><button type="button" class="risk-btn" id="askSayHeld" data-on-click="askSayHeld()">' + esc(S.button) + '</button></div>';
  return h + '</div>';
}

/**
 * Paying for it (7.12.0, a ladder): the same reading and words as V7's move page (answers/plan/moveWords.js payingOf and
 * outsideRowsOf, filled with src/v7/copy/move.js): what pays for the buys, and what is held that the plan does not use. "Say
 * which years it is for" goes to the line's "Keep this" on What you hold, above.
 */
export function payingHtml(R) {
  if (!R || (!R.paying && !(R.outside && R.outside.length))) return '';
  const P = MOVE.paying, O = MOVE.outside;
  let h = '<div class="section-title" style="margin-top:10px;">' + esc(P.title) + '</div>';
  if (R.paying) { const slots = { ...R.paying.slots, from: P.from[R.paying.slots.from] || R.paying.slots.from }; h += '<p id="transitionPaying">' + esc(R.paying.ids.map((id) => fillMove(P[id], slots)).join(' ')) + '</p>'; }
  const note = (n) => {
    if (!n) return '';
    if (n.id === 'gilt' || n.id === 'giltReal') return esc(fillMove(O.notes[n.id], n.slots)) + ' ' + esc(O.notes.sellOr) + ' <a href="#holdingsCard">' + esc(O.notes.sayYears) + '</a>.' + (n.cashYear ? ' ' + esc(fillMove(O.notes.cashYear, n.slots)) : '');
    return esc(fillMove(O.notes[n.id], n.slots));
  };
  if (R.outside && R.outside.length) h += '<div class="section-title" style="margin-top:8px;font-size:13px;">' + esc(O.title) + '</div>'
    + table([O.columns.what, O.columns.value, O.columns.note], R.outside.map((r) => [esc(r.label) + (r.ticker ? ' <span class="hint">' + esc(r.ticker) + '</span>' : ''), esc(r.value), note(r.note)]));
  return h;
}

/**
 * "Your plan's mix" as what is held (7.11.1): Living on it, or Moving once what is held was accepted, the tab is never a move.
 * A pot plan's: the same reading as V7 (answers/plan/move.js heldInfo, through keepHoldingsUi.transitionHeld), filled with the
 * same words (src/v7/copy/move.js MOVE.held): the mix held against the plan's, and where it can be tested (Your review, in the
 * simple view). A ladder's is HeldLadderView.js (7.12.0). Never a Buy or Sell, a tick or a schedule.
 */
export function heldInfoHtml(I) {
  if (!I) return '';
  const H = MOVE.held;
  const fill = (t, slots) => String(t || '').replace(/\{(\w+)\}/g, (m, k) => (slots && slots[k] != null ? String(slots[k]) : m));
  const li = (items) => '<ul style="font-size:13px;line-height:1.6;">' + items.map((x) => '<li>' + esc(x) + '</li>').join('') + '</ul>';
  let h = '';
  if (I.agreed) h += '<p><strong>' + esc(fill(H.agreed, I.agreed)) + '</strong></p>';
  if (I.noRecord) h += '<p class="hint">' + esc(H.noRecord) + '</p>';
  if (I.buckets) h += '<div class="section-title" style="margin-top:10px;">' + esc(H.mixTitle) + '</div>' + li(I.buckets.map((b) => fill(H.bucket[b.bucket], b)));
  for (const name of I.unknown || []) h += '<p class="hint">' + esc(fill(H.unknown, { name })) + '</p>';
  if (I.review) h += '<p class="hint">' + esc(H.review) + ' <a href="' + esc(LAYOUT.classic.v7 + I.review) + '">' + esc(H.reviewLink) + '</a>.</p>';
  return h;
}

/**
 * The "What you hold" card: the holdings record as an editable table (no import from the Stress
 * tester's fund list as a starting point, and the paste / save buttons.
 * @param {{ holdings?: { updatedAt, source, offerDismissed, lines: [], expected? }, offer?: { taggedFunds: [] }|null, keep?: { ladder: boolean }|null }} a
 *   keep — 7.6.0: set on a plan with a plan document: each line gets "Keep this", and money expected later is listed. Living on a
 *   ladder (7.12.0) it is { held: true, at, summary }: the gilts held and the cash years in "Your plan's mix"'s words, and the
 *   one optional box on the lines `at` names
 */
export function holdingsCardHtml({ holdings = null, offer = null, keep = null } = {}) {
  const rec = holdings || {};
  const lines = Array.isArray(rec.lines) ? rec.lines : [];
  let h = '<div class="card" id="holdingsCard"><h2>What you hold</h2>';   // the shell scrolls here from "what you hold" links elsewhere
  h += '<p class="hint">Your actual holdings, by wrapper — what this tab, the Accumulation planner and the plan document read. Not the funds a strategy is tested on.'
    + (rec.updatedAt ? ' Recorded ' + esc(dateGB(rec.updatedAt)) + (SOURCE_TEXT[rec.source] ? ', ' + esc(SOURCE_TEXT[rec.source]) : '') + '.' : '') + '</p>';
  // No offer to copy the Stress tester's fund list (6.13.1): that list is the portfolio a strategy is TESTED on and is
  // never a candidate for what you hold — even as a question. The record starts empty; paste or type it.
  if (!lines.length) h += '<p class="hint">Nothing recorded yet — paste from your platform or add lines.</p>';
  // living on a ladder (7.12.0): what the plan's gilts and the cash years come to, and the way to "Your plan's mix"
  if (keep && keep.held && keep.summary) {
    const S = keep.summary;
    h += '<div id="holdingsHeldSummary">' + S.figure.map((x, n) => (n === 0 ? '<p><strong>' + esc(sayHeld(x, HELD)) + '</strong></p>' : '<p>' + esc(sayHeld(x, HELD)) + '</p>')).join('')
      + (S.cash ? '<p>' + esc(sayHeld(S.cash, HELD)) + '</p>' : '')
      + '<p class="hint">' + esc(HELD.holdCounts) + ' <a href="#heldLadder">' + esc(HELD.holdLinkMix) + '</a></p></div>';
  }
  if (lines.length) {
    const rows = lines.map((l, i) => {
      const L = l || {};
      return [
        // "Keep this" (7.6.0) under the wrapper, in the first column: a phone sees it without scrolling the table sideways
        wrapperSelect(i, L.wrapper) + (keep ? keepCellHtml(i, L, keep) : ''),
        '<input type="text" value="' + esc(L.ticker || '') + '" placeholder="Ticker / gilt code" style="width:110px;" data-on-change="updHolding(' + i + ',\'ticker\',this.value)">',
        '<input type="text" value="' + esc(L.name || '') + '" placeholder="Name" style="min-width:160px;" data-on-change="updHolding(' + i + ',\'name\',this.value)">',
        '<input type="number" step="any" value="' + numAttr(L.units) + '" placeholder="units" style="width:110px;" data-on-change="updHolding(' + i + ',\'units\',this.value)">',
        '<input type="number" step="any" value="' + numAttr(L.value) + '" placeholder="£" style="width:120px;" data-on-change="updHolding(' + i + ',\'value\',this.value)">',
        whatItIsHtml(i, L),
        '<button type="button" class="risk-btn" title="Remove this line" data-on-click="removeHolding(' + i + ')">Remove</button>'
      ];
    });
    h += table(['Wrapper', 'Ticker / gilt code', 'Name', 'Units', 'Value', 'What it is', ''], rows);
    const byW = {}; for (const l of lines) { const w = String((l && l.wrapper) || 'SIPP').toUpperCase(); byW[w] = (byW[w] || 0) + (+(l && l.value) || 0); }
    h += '<p class="hint" style="margin-top:6px;">Total ' + gbp(Object.values(byW).reduce((t, v) => t + v, 0)) + ' — ' + HOLDING_WRAPPERS.filter((w) => byW[w] > 0).map((w) => w + ' ' + gbp(byW[w])).join(' · ') + '. Units matter for gilts (the nominal); value is enough for a fund.</p>';
    // Every line counts in the total; a line the tool cannot place is said, not dropped from the mix in silence (6.23)
    const unplaced = lines.filter((l) => l && needsCategory(l) && (+l.value || 0) > 0);
    if (unplaced.length) h += '<p class="hint" style="color:var(--warning);">' + gbp(unplaced.reduce((t, l) => t + (+l.value || 0), 0)) + ' in ' + unplaced.length + ' line' + (unplaced.length === 1 ? '' : 's') + ' is not placed in the mix yet — answer "What is this?" and it counts.</p>';
    // The row inputs fire on CHANGE (commit), never on input: the shell persists each commit without re-rendering on every keystroke.
    h += '<p class="hint">Edits save when you leave the box; Remove and Paste save at once.</p>';
  }
  // Inline add row: the shell reads these ids in addHoldingLine()
  h += '<div class="section-title" style="margin-top:10px;">Add a line</div>'
    + '<div class="row-flex" style="gap:8px;align-items:flex-end;flex-wrap:wrap;">'
    + '<label class="hint" style="display:flex;flex-direction:column;gap:2px;">Ticker or gilt code<input type="text" id="hlTicker" placeholder="VWRP, TR30…" style="width:120px;"></label>'
    + '<label class="hint" style="display:flex;flex-direction:column;gap:2px;">Name<input type="text" id="hlName" placeholder="optional" style="min-width:160px;"></label>'
    + '<label class="hint" style="display:flex;flex-direction:column;gap:2px;">Wrapper' + wrapperSelect(null, 'SIPP') + '</label>'
    + '<label class="hint" style="display:flex;flex-direction:column;gap:2px;">Value £<input type="number" id="hlValue" step="any" placeholder="0" style="width:120px;"></label>'
    + '<label class="hint" style="display:flex;flex-direction:column;gap:2px;">Units<input type="number" id="hlUnits" step="any" placeholder="gilts" style="width:110px;"></label>'
    + '<button type="button" class="risk-btn" data-on-click="addHoldingLine()">Add line</button></div>';
  h += '<div class="row-flex" style="margin-top:10px;gap:8px;"><button type="button" class="risk-btn" data-on-click="pasteHoldings()">Paste from my platform</button>'
    + '<button type="button" data-on-click="saveHoldingsUI()">Save</button></div>';
  if (keep) h += expectedHtml(rec.expected);
  h += '</div>';
  return h;
}

/**
 * @param {object} a { stage, doc, target, diff, seq, prog, done, holdings, offer, rotation, complete, ledgerCount, startLabel }
 *   holdings — the plan's holdings record { version, updatedAt, source, offerDismissed, lines };
 *   offer    — { taggedFunds } when the record is empty but the Stress tester has a fund list (the one-time question);
 *   rotation — rotationStatus() result (null unless the strategy is gilt-rotation);
 *   complete — overrides diff.complete when given.
 */
export function transitionHtml(a) {
  const { stage, doc, target, diff, seq, prog, done = {}, holdings = null, offer = null, rotation = null, startLabel = '', gaps = null, keepTest = null, held = null } = a || {};
  // 7.11.1: Living on it, or Moving once what is held was accepted, the tab says what is held, never a move (transitionHeld);
  // on a ladder (7.12.0) it is "Your plan's mix" alone: no gaps, no keep test, no lists of what is kept, no second footer
  const asHeld = !!(held && held.mode === 'held' && held.heldInfo);
  const heldLadder = asHeld && !!held.heldView;
  const lines = holdings && Array.isArray(holdings.lines) ? holdings.lines : [];
  const ledgerCount = a && a.ledgerCount != null ? a.ledgerCount : lines.filter(valued).length;
  // (i) What you hold — the record, always editable, whether or not there is a plan document yet; "Keep this" (7.6.0) once
  // there is a plan document to keep against
  // the tax years "stands in" can name: from this one (or the plan's first) for twelve years at most — as V7 offers them
  const keep = heldLadder ? { held: true, at: new Set((held.heldInfo.lines || []).map((x) => x.at)), summary: heldSummaryView(held.heldInfo) } : doc && target && target.kind !== 'none' ? (() => {
    if (target.kind !== 'ladder') return { ladder: false, years: [] };
    const p = doc.strategy && doc.strategy.r && doc.strategy.r.plan;
    const first = Math.max(+target.thisTaxYear || 0, +(p && p.firstTaxYear) || +target.firstTaxYear || 0);
    const last = Math.min(+(p && p.lastTaxYear) > 0 ? +p.lastTaxYear : first + 11, first + 11);
    const years = []; for (let Y = first; Y <= last && first > 2000; Y++) years.push(Y);
    return { ladder: true, years };
  })() : null;
  let h = holdingsCardHtml({ holdings, offer, keep });
  h += '<div class="card">';
  h += asHeld ? '<h2>' + esc(PLAN.steps.move.short) + '</h2>' : '<h2>Transition — from what you hold to the plan</h2>';
  if (!doc || !target || target.kind === 'none' || !diff || !prog) {
    h += '<p>The transition tool works from the <strong>plan document</strong>: the order sheet for a gilt ladder, or the target mix for a pot strategy. Lock the plan (Stress tester → Settings → Lock plan) and come back.</p></div>';
    return h;
  }
  const complete = a && typeof a.complete === 'boolean' ? a.complete : !!diff.complete;
  const ladder = target.kind === 'ladder';
  // the move's readings (7.12.0): V7's, through transitionHeld, so both views say the same words; else read from this diff
  const R = held && !asHeld && held.status ? held : { status: moveStatusOf(target, diff, prog), pace: null, paying: payingOf(diff, { newMoney: seq ? seq.totals.contributions : 0 }), outside: outsideRowsOf(diff), ladderTotals: moveTotalsOf(diff), cash: cashRowsOf(target, diff) };
  if (heldLadder) h += heldLadderHtml(held.heldView);
  else if (asHeld) h += '<p class="hint">' + esc(MOVE.held.lead) + '</p>' + heldInfoHtml(held.heldInfo);
  else h += '<p class="hint">' + esc(MOVE.lead) + '</p><p class="hint">' + (ladder ? esc(MOVE.target.ladder + ' ' + (target.note || '')) : 'Target: a pot strategy — the year-0 mix in pounds. ' + esc(target.note || '')) + '</p>';
  // "This is how I want to hold it" (7.12.0): the same words and the same one write as V7's move page
  h += sayHeldHtml(held);
  // (ii) Status
  if (asHeld) { /* what is held is said above: no status in moves, no cash to hold */ } else if (complete) {
    h += '<div class="alert alert-success"><strong>' + (target.kind === 'ladder' ? 'Complete — nothing to do.</strong> ' + (diff.standIn || diff.kept ? 'Every rung is held, or covered by what you chose to keep.' : 'Every rung the plan still needs is held.') : 'Complete — the target mix is held.</strong>')
      + (rotation && rotation.applies ? ' Only the rotation watch below remains.' : '') + '</div>';
  } else {
    const tone = prog.held >= 98 ? 'alert-success' : prog.held >= 50 ? 'alert-info' : 'alert-warning';
    // the move's one status sentence (7.12.0, moveWords.moveStatusOf), as the home tile and V7's move page say it; the pace and
    // when to buy on a ladder; a pot plan keeps when its plan starts and its window opens
    const when = ladder ? '' : ' ' + esc(seq && seq.startPassed ? 'The plan has been paying since tax year ' + startLabel + '; the schedule is spread over the next ' + seq.months + ' months.'
      : (startLabel ? 'The plan’s first tax year is ' + startLabel + '. ' : '') + (seq && seq.opensAt ? 'Your move window opens in ' + monthWordsLong(seq.opensAt) + '; nothing to do before then.' : seq ? 'The buying is spread over the next ' + seq.months + ' month' + (seq.months === 1 ? '' : 's') + '.' : ''));
    h += '<div class="alert ' + tone + '" id="transitionStatus"><strong>' + esc(sayMoveStatus(R.status, MOVE)) + '</strong>' + when
      + (R.pace ? '<br>' + esc(fillMove(R.pace.months === '1' ? MOVE.status.paceOne : MOVE.status.pace, R.pace)) : '')
      + (ladder ? '<br>' + esc(MOVE.status.timing) : '') + '</div>';
  }
  if (!asHeld && R.cash && R.cash.rows.length) {
    // the cash to hold now (7.12.0, S2): V7's reading and words — what each year needs beside the cash to hold for it, and the
    // years what is kept pays in part or in full
    const C = MOVE.cash;
    h += '<div class="section-title" style="margin-top:10px;">' + esc(C.title) + '</div><p class="hint">' + esc(C.lead) + '</p>'
      + table([C.columns.what, C.columns.need, C.columns.amount], [...R.cash.rows.map((r) => [esc(fillMove(C.rows[r.id], r)), esc(r.gap ? fillMove(C.besideNeed, r) : r.need || '—'), esc(r.amount || '—')]),
        ['<strong>' + esc(C.total) + '</strong>', '', '<strong>' + esc(R.cash.target) + '</strong>'], [esc(C.held), '', esc(R.cash.held)], [esc(R.cash.spare != null ? C.spare : C.short), '', esc(R.cash.spare != null ? R.cash.spare : R.cash.short)]])
      + (R.cash.over ? '<p class="hint">' + esc(C.over) + '</p>' : '');
  }
  if (!asHeld && !ledgerCount && !ladder) h += '<div class="alert alert-warning">Nothing recorded under <strong>What you hold</strong> yet — everything below reads as "to buy". Paste from your platform or add lines above and this page updates.</div>';
  // The plan is running: cash is being spent, so it is reported, not diffed
  if (!asHeld && diff.cashInfo) {
    const ci = diff.cashInfo;
    h += '<p class="hint">Cash: <strong>' + gbp(ci.held) + '</strong> held' + (ci.yearsLeft && ci.yearsLeft.length ? ' against about ' + gbp(ci.target) + ' for the cash years still ahead (' + ci.yearsLeft.map((y) => esc(String(y)) + '/' + esc(String(y + 1).slice(2))).join(', ') + ') — being spent as the plan intends, so it is not a move.' : '; no cash years left — it is your spending float, not a target.') + '</p>';
  }
  if (!heldLadder) {
    if (Array.isArray(target.paid) && target.paid.length) h += '<p class="hint">Already paid: ' + target.paid.map((p) => esc(p.label) + (p.ticker ? ' (' + esc(p.ticker) + ')' : '')).join(', ') + ' — matured rungs, no longer targets.</p>';
    if (Array.isArray(diff.matured) && diff.matured.length) h += '<p class="hint">Still on your record but matured: ' + diff.matured.map((m) => esc(m.label) + ' — ' + esc(m.why)).join('; ') + '.</p>';
    // The rotation fired: the block it sold is off the target, and a line still carrying one of those rungs is stale
    if (Array.isArray(target.sold) && target.sold.length) h += '<p class="hint">Sold by the rotation: ' + target.sold.map((p) => esc(p.label) + (p.ticker ? ' (' + esc(p.ticker) + ')' : '')).join(', ') + ' — no longer targets; the fund the proceeds bought is kept.</p>';
    if (Array.isArray(diff.sold) && diff.sold.length) h += '<p class="hint">Still on your record but sold: ' + diff.sold.map((m) => esc(m.label) + ' — ' + esc(m.why)).join('; ') + '.</p>';
  }
  // (iii) Rotation watch
  if (rotation && rotation.applies) h += '<div class="alert ' + (rotation.state === 'fired' ? 'alert-warning' : 'alert-info') + '" style="margin-top:8px;"><strong>Rotation watch</strong> · ' + esc(rotation.text) + '</div>';

  if (!heldLadder) {
    // (iv) The moves
    const tick = (item) => '<input type="checkbox" style="width:auto;"' + (done[item.key] ? ' checked' : '') + ' data-on-change="toggleTransitionDone(\'' + esc(item.key) + '\', this.checked)" title="Tick when the order is placed">';
    if (!asHeld && diff.buy.length) h += '<div class="section-title" style="margin-top:10px;">Buy</div>' + table(['Done', 'What', 'Units', 'Amount', 'Why'], diff.buy.map((b) => [tick(b), esc(b.label) + (b.ticker ? ' <span class="hint">' + esc(b.ticker) + (b.sedol ? ' · ' + esc(b.sedol) : '') + '</span>' : ''), units(b.units), gbp(b.amount), esc(b.why || '')]));
    if (!asHeld && !diff.funding && diff.sell.length) h += '<div class="section-title" style="margin-top:10px;">Sell</div>' + table(['Done', 'What', 'Units', 'Amount', 'Why'], diff.sell.map((s) => [tick(s), esc(s.label) + (s.ticker ? ' <span class="hint">' + esc(s.ticker) + '</span>' : ''), units(s.units), gbp(s.amount), esc(s.why || '')]));
    if (!asHeld) h += payingHtml(R);
    if (!asHeld && diff.hold.length) h += '<div class="section-title" style="margin-top:10px;">Already held</div>' + table(['What', 'Held', 'Target'], diff.hold.map((x) => [esc(x.label) + (x.ticker ? ' <span class="hint">' + esc(x.ticker) + '</span>' : ''), (x.heldUnits != null ? units(x.heldUnits) + ' units' : gbp(x.heldValue)) + (x.spare > 0 ? ' <span class="hint">(' + gbp(x.spare) + ' spare — kept, not a sale)</span>' : ''), x.units ? units(x.units) + ' units' : gbp(x.value)]));
    if (ledgerCount) h += '<p class="hint" style="margin-top:8px;">If a line under What you hold is not yours — a pasted statement can mis-read a code — remove it there and this page updates.</p>';
    // living on the plan (7.11.1): an ISA, taxable-account or bank line is outside the pension, never "left alone" by a move
    if (diff.keep.length && asHeld) h += '<div class="section-title" style="margin-top:10px;">' + esc(MOVE.held.outsideTitle) + '</div><ul style="font-size:13px;line-height:1.6;">' + diff.keep.map((k) => '<li>' + esc(MOVE.held.outsideOne.replace('{label}', k.ticker || k.name).replace('{wrapper}', k.wrapper).replace('{value}', gbp(k.value))) + '</li>').join('') + '</ul>';
    else if (diff.keep.length) h += '<p class="hint" style="margin-top:8px;">Left alone: ' + diff.keep.map((k) => esc(k.ticker || k.name) + ' (' + esc(k.wrapper) + ', ' + gbp(k.value) + ')').join(', ') + '.</p>';
    // 7.6.0: what you keep instead — never a sale
    if (Array.isArray(diff.standIn) && diff.standIn.length) h += '<div class="section-title" style="margin-top:10px;">' + esc(GAPS.move.standIn) + '</div><ul style="font-size:13px;line-height:1.6;">'
      + diff.standIn.map((x) => '<li>' + esc(GAPS.move.standInOne.replace('{label}', x.label || x.ticker).replace('{years}', x.taxYears.map(taxYearWords).join(', ')).replace('{pays}', gbp(x.pays))) + '</li>').join('')
      + (diff.covered || []).map((x) => '<li class="hint">' + esc(GAPS.move.covered.replace('{label}', x.label).replace('{years}', x.taxYears.map(taxYearWords).join(', '))) + '</li>').join('') + '</ul>';
    if (Array.isArray(diff.kept) && diff.kept.length) h += '<div class="section-title" style="margin-top:10px;">' + esc(GAPS.move.kept) + '</div><ul style="font-size:13px;line-height:1.6;">'
      + diff.kept.map((x) => '<li>' + esc(GAPS.move.keptOne.replace('{label}', x.label || x.ticker).replace('{wrapper}', x.wrapper).replace('{value}', gbp(x.value)).replace('{gaps}', x.fundsGaps ? (target.kind === 'ladder' ? GAPS.move.keptGaps : GAPS.move.keptPlan) : '')) + '</li>').join('') + '</ul>';
    h += gapsHtml(gaps);
    h += keepTestHtml(keepTest);   // 7.7.0: the plan's own test with what is kept, and "I accept this risk"
    if (!asHeld && !complete) h += R.ladderTotals ? '<p class="hint" id="transitionTotals">' + esc(fillMove(MOVE.lists[R.ladderTotals.id], R.ladderTotals.slots)) + '</p>'
      : '<p class="hint">Totals: buy ' + gbp(diff.totals.buyCost) + ' · sell ' + gbp(diff.totals.sellValue) + (diff.totals.shortfall ? ' · <strong>short by ' + gbp(diff.totals.shortfall) + '</strong> before contributions' : '') + '.</p>';
  }
  // Timeline
  if (!asHeld && seq && seq.steps.length && ladder) {
    // a ladder (7.12.0): V7's words — one amount raised a date from what the plan does not use, then the buys
    const S = MOVE.schedule;
    h += '<div class="section-title" style="margin-top:12px;">' + esc(S.title) + '</div><p class="hint">' + esc(fillMove(S.leadLadder, { tranches: seq.tranches })) + '</p><ul style="font-size:13px;line-height:1.6;">'
      + seq.steps.map((st) => '<li>' + esc(st.action === 'raise' ? fillMove(S.raise, { when: monthWordsLong(st.when), amount: gbp(st.amount) }) : fillMove(S.step, { when: monthWordsLong(st.when), action: st.action === 'buy' ? S.buy : S.sell, label: st.label, units: st.units ? fillMove(S.units, { units: units(st.units) }) : '', amount: fillMove(S.amount, { amount: gbp(st.amount) }) })) + '</li>').join('') + '</ul>';
  } else if (!asHeld && seq && seq.steps.length) {
    h += '<div class="section-title" style="margin-top:12px;">When — a schedule to the start</div>'
      + '<p class="hint">' + esc(seq.note) + (target.kind === 'ladder' ? ' Cash years first, near rungs before far ones' : ' Bonds and cash first, then shares') + '; sales spread over ' + seq.tranches + ' tranche' + (seq.tranches === 1 ? '' : 's') + ' so no single month\'s price decides the outcome; new contributions are used before sales.</p>'
      + table(['When', 'Action', 'What', 'Units', 'Amount'], seq.steps.map((s) => [esc(monthName(s.when)), esc(s.action), esc(s.label) + (s.ticker ? ' <span class="hint">' + esc(s.ticker) + '</span>' : ''), units(s.units), gbp(s.amount)]));
  }
  // Rules of the road
  if (!asHeld) h += '<details style="margin-top:12px;"><summary class="hint" style="cursor:pointer;">Things the schedule assumes — check them against your own position</summary><ul style="font-size:13px;line-height:1.5;">'
    + (ladder ? '<li>' + esc(fillMove(MOVE.how.accountsLadder, { isa: MOVE.isa[(R && R.isa) || (target.isaIn ? 'in' : 'none')] })) + '</li>'
      : '<li><strong>Wrappers.</strong> The target mix lives in the SIPP. ISA and taxable holdings are left alone; if the plan needs money moved between wrappers, that is a contribution (SIPP room: the MPAA £10,000 once you have drawn flexibly; ISA £20,000 a year) — not a sale.</li>')
    + '<li><strong>Tax on sales.</strong> Inside a SIPP or ISA, none. In a taxable account, gains above the £3,000 exemption are taxable — gilts are exempt.</li>'
    + '<li><strong>Gilt units.</strong> Order gilts by units (the nominal), not by amount; the order sheet in the plan document carries SEDOLs. Prices and index ratios move daily; the pound figures here are indicative.</li>'
    + '<li><strong>Decision points.</strong> A planned sale (a house, a business) that funds part of the ladder is a date on the schedule, not a certainty — buy the near rungs first and leave the far ones until the money is real.</li>'
    + '</ul></details>';
  if (!heldLadder) h += '<p class="hint" style="margin-top:8px;">Illustration, not advice. Nothing here places an order.</p>';
  h += '</div>';
  return h;
}
