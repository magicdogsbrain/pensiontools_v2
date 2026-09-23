/**
 * Transition tool — HTML. Pure: inputs in, HTML out.
 *
 * Two cards. "What you hold" edits the plan's holdings record (`scenario.holdings`, 6.12) — the ONLY ledger
 * the Transition tool reads; the Stress tester's fund list is a strategy input, never holdings. Below it, the
 * transition itself: the status (complete / progress / run-up), the rotation watch when the strategy has one,
 * then the Buy / Sell / Already held / Left alone tables and the schedule.
 *
 * Inline handlers are plain calls with literal or `this.value` arguments (the no-eval grammar in
 * src/ui/inlineHandlers.js): no arrows, no optional chaining. The shell defines pasteHoldings, saveHoldingsUI,
 * importHoldingsFromStress, dismissHoldingsOffer, updHolding, removeHolding, addHoldingLine.
 */
import { esc } from './ReleaseNotesView.js';

const gbp = (v) => '£' + Math.round(+v || 0).toLocaleString('en-GB');
const units = (u) => (u == null ? '' : Math.round(u).toLocaleString('en-GB'));
function table(head, rows) {
  if (!rows.length) return '';
  return '<div class="table-scroll-container"><table><thead><tr>' + head.map((h) => '<th>' + esc(h) + '</th>').join('') + '</tr></thead><tbody>'
    + rows.map((r) => '<tr>' + r.map((c) => '<td>' + c + '</td>').join('') + '</tr>').join('') + '</tbody></table></div>';
}
const monthName = (ym) => { const [y, m] = String(ym).split('-').map(Number); return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][m - 1] + ' ' + y; };
const dateGB = (iso) => { const d = new Date(String(iso) + 'T00:00:00Z'); return Number.isNaN(d.getTime()) ? String(iso || '') : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }); };

export const HOLDING_WRAPPERS = ['SIPP', 'ISA', 'GIA', 'CASH'];
const SOURCE_TEXT = { typed: 'typed in', paste: 'pasted from your platform', imported: 'taken from the Stress tester\'s fund list' };
const valued = (l) => l && ((+l.value || 0) > 0 || (+l.units || 0) > 0);
const numAttr = (v) => (v == null || v === '' || !Number.isFinite(+v) ? '' : String(+v));

/** Wrapper <select> for a row (or the add row when `i` is null). */
function wrapperSelect(i, current) {
  const attr = i == null ? ' id="hlWrapper"' : ' data-on-change="updHolding(' + i + ',\'wrapper\',this.value)"';
  return '<select' + attr + ' style="width:auto;">' + HOLDING_WRAPPERS.map((w) => '<option value="' + w + '"' + (String(current || 'SIPP').toUpperCase() === w ? ' selected' : '') + '>' + w + '</option>').join('') + '</select>';
}

/**
 * The "What you hold" card: the holdings record as an editable table (no import from the Stress
 * tester's fund list as a starting point, and the paste / save buttons.
 * @param {{ holdings?: { updatedAt, source, offerDismissed, lines: [] }, offer?: { taggedFunds: [] }|null }} a
 */
export function holdingsCardHtml({ holdings = null, offer = null } = {}) {
  const rec = holdings || {};
  const lines = Array.isArray(rec.lines) ? rec.lines : [];
  let h = '<div class="card" id="holdingsCard"><h2>What you hold</h2>';   // the shell scrolls here from "what you hold" links elsewhere
  h += '<p class="hint">Your actual holdings, by wrapper — what the Transition tool, the Accumulation planner and the plan document read. Not the funds a strategy is tested on.'
    + (rec.updatedAt ? ' Recorded ' + esc(dateGB(rec.updatedAt)) + (SOURCE_TEXT[rec.source] ? ', ' + esc(SOURCE_TEXT[rec.source]) : '') + '.' : '') + '</p>';
  // No offer to copy the Stress tester's fund list (6.13.1): that list is the portfolio a strategy is TESTED on and is
  // never a candidate for what you hold — even as a question. The record starts empty; paste or type it.
  if (!lines.length) h += '<p class="hint">Nothing recorded yet — paste from your platform or add lines.</p>';
  if (lines.length) {
    const rows = lines.map((l, i) => {
      const L = l || {};
      return [
        wrapperSelect(i, L.wrapper),
        '<input type="text" value="' + esc(L.ticker || '') + '" placeholder="Ticker / gilt code" style="width:110px;" data-on-change="updHolding(' + i + ',\'ticker\',this.value)">',
        '<input type="text" value="' + esc(L.name || '') + '" placeholder="Name" style="min-width:160px;" data-on-change="updHolding(' + i + ',\'name\',this.value)">',
        '<input type="number" step="any" value="' + numAttr(L.units) + '" placeholder="units" style="width:110px;" data-on-change="updHolding(' + i + ',\'units\',this.value)">',
        '<input type="number" step="any" value="' + numAttr(L.value) + '" placeholder="£" style="width:120px;" data-on-change="updHolding(' + i + ',\'value\',this.value)">',
        '<button type="button" class="risk-btn" title="Remove this line" data-on-click="removeHolding(' + i + ')">Remove</button>'
      ];
    });
    h += table(['Wrapper', 'Ticker / gilt code', 'Name', 'Units', 'Value', ''], rows);
    const byW = {}; for (const l of lines) { const w = String((l && l.wrapper) || 'SIPP').toUpperCase(); byW[w] = (byW[w] || 0) + (+(l && l.value) || 0); }
    h += '<p class="hint" style="margin-top:6px;">Total ' + gbp(Object.values(byW).reduce((t, v) => t + v, 0)) + ' — ' + HOLDING_WRAPPERS.filter((w) => byW[w] > 0).map((w) => w + ' ' + gbp(byW[w])).join(' · ') + '. Units matter for gilts (the nominal); value is enough for a fund.</p>';
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
  const { stage, doc, target, diff, seq, prog, done = {}, holdings = null, offer = null, rotation = null, startLabel = '' } = a || {};
  const lines = holdings && Array.isArray(holdings.lines) ? holdings.lines : [];
  const ledgerCount = a && a.ledgerCount != null ? a.ledgerCount : lines.filter(valued).length;
  // (i) What you hold — the record, always editable, whether or not there is a plan document yet
  let h = holdingsCardHtml({ holdings, offer });
  h += '<div class="card">';
  h += '<h2>Transition — from what you hold to the plan</h2>';
  if (!doc || !target || target.kind === 'none' || !diff || !prog) {
    h += '<p>The transition tool works from the <strong>plan document</strong>: the order sheet for a gilt ladder, or the target mix for a pot strategy. Lock the plan (Stress tester → Settings → Lock plan) and come back.</p></div>';
    return h;
  }
  const complete = a && typeof a.complete === 'boolean' ? a.complete : !!diff.complete;
  const kindText = target.kind === 'ladder' ? 'a gilt ladder — every rung and the cash years, in units' : 'a pot strategy — the year-0 mix in pounds';
  h += '<p class="hint">Target: ' + esc(kindText) + '. ' + esc(target.note || '') + '</p>';
  // (ii) Status
  if (complete) {
    h += '<div class="alert alert-success"><strong>' + (target.kind === 'ladder' ? 'Complete — nothing to do.</strong> Every rung the plan still needs is held.' : 'Complete — the target mix is held.</strong>')
      + (rotation && rotation.applies ? ' Only the rotation watch below remains.' : '') + '</div>';
  } else {
    const tone = prog.held >= 98 ? 'alert-success' : prog.held >= 50 ? 'alert-info' : 'alert-warning';
    h += '<div class="alert ' + tone + '"><strong>' + prog.held + '% of the target is held</strong>' + (prog.total ? ' · ' + prog.doneCount + ' of ' + prog.total + ' moves ticked off' : ' · nothing to do') + (seq && seq.startPassed ? ' · the ladder has been paying since tax year ' + esc(startLabel) + ' — schedule spread over the next ' + seq.months + ' months' : (startLabel ? ' · the ladder\'s first tax year is ' + esc(startLabel) : '') + (seq ? ' · ' + seq.months + ' month' + (seq.months === 1 ? '' : 's') + ' to go' : '')) + '.'
      + (prog.next ? '<br>Next: <strong>' + esc(prog.next.action) + ' ' + esc(prog.next.label) + '</strong>' + (prog.next.units ? ', ' + units(prog.next.units) + ' units' : '') + (prog.next.amount ? ' (' + gbp(prog.next.amount) + ')' : '') + '.' : '') + '</div>';
  }
  // Already retired, ladder not yet started (the run-up): say so, or "months to go" reads as "you have not retired yet".
  if (stage && stage.key === 'bridge') {
    const ru = target && target.cash && target.cash.runUp ? target.cash.runUp : null;
    h += '<p><strong>You are already retired.</strong> ' + (target && target.kind === 'ladder' ? 'Your gilt ladder pays from tax year ' : 'Your plan\'s first tax year is ') + esc(startLabel || '?')
      + (stage.monthsToStart > 0 ? ' (' + stage.monthsToStart + ' month' + (stage.monthsToStart === 1 ? '' : 's') + ' away)' : '') + '. Until then you draw' + (ru && ru.monthly ? ' ' + gbp(ru.monthly) + ' a month' : '') + ' from your SIPP cash. Nothing here is a retirement date.</p>';
  }
  if (target && target.cash && Array.isArray(target.cash.breakdown) && target.cash.breakdown.length && !diff.cashInfo) {
    const held = diff.totals ? diff.totals.cashHeld : 0, tgt = target.cash.value || 0;
    h += '<div class="section-title" style="margin-top:10px;">Cash to hold now (money-market fund, e.g. CSH2)</div>'
      + table(['What for', 'Amount'], [...target.cash.breakdown.map((b) => [esc(b.label), gbp(b.amount)]), ['<strong>Total to hold</strong>', '<strong>' + gbp(tgt) + '</strong>'], ['You hold', gbp(held)], [held >= tgt ? 'Spare' : 'Short', gbp(Math.abs(held - tgt))]]);
  }
  if (!ledgerCount) h += '<div class="alert alert-warning">Nothing recorded under <strong>What you hold</strong> yet — everything below reads as "to buy". Paste from your platform or add lines above and this page updates.</div>';
  // The plan is running: cash is being spent, so it is reported, not diffed
  if (diff.cashInfo) {
    const ci = diff.cashInfo;
    h += '<p class="hint">Cash: <strong>' + gbp(ci.held) + '</strong> held' + (ci.yearsLeft && ci.yearsLeft.length ? ' against about ' + gbp(ci.target) + ' for the cash years still ahead (' + ci.yearsLeft.map((y) => esc(String(y)) + '/' + esc(String(y + 1).slice(2))).join(', ') + ') — being spent as the plan intends, so it is not a move.' : '; no cash years left — it is your spending float, not a target.') + '</p>';
  }
  if (Array.isArray(target.paid) && target.paid.length) h += '<p class="hint">Already paid: ' + target.paid.map((p) => esc(p.label) + (p.ticker ? ' (' + esc(p.ticker) + ')' : '')).join(', ') + ' — matured rungs, no longer targets.</p>';
  if (Array.isArray(diff.matured) && diff.matured.length) h += '<p class="hint">Still on your record but matured: ' + diff.matured.map((m) => esc(m.label) + ' — ' + esc(m.why)).join('; ') + '.</p>';
  // The rotation fired: the block it sold is off the target, and a line still carrying one of those rungs is stale
  if (Array.isArray(target.sold) && target.sold.length) h += '<p class="hint">Sold by the rotation: ' + target.sold.map((p) => esc(p.label) + (p.ticker ? ' (' + esc(p.ticker) + ')' : '')).join(', ') + ' — no longer targets; the fund the proceeds bought is kept.</p>';
  if (Array.isArray(diff.sold) && diff.sold.length) h += '<p class="hint">Still on your record but sold: ' + diff.sold.map((m) => esc(m.label) + ' — ' + esc(m.why)).join('; ') + '.</p>';
  // (iii) Rotation watch
  if (rotation && rotation.applies) h += '<div class="alert ' + (rotation.state === 'fired' ? 'alert-warning' : 'alert-info') + '" style="margin-top:8px;"><strong>Rotation watch</strong> · ' + esc(rotation.text) + '</div>';

  // (iv) The moves
  const tick = (item) => '<input type="checkbox" style="width:auto;"' + (done[item.key] ? ' checked' : '') + ' data-on-change="toggleTransitionDone(\'' + esc(item.key) + '\', this.checked)" title="Tick when the order is placed">';
  if (diff.buy.length) h += '<div class="section-title" style="margin-top:10px;">Buy</div>' + table(['Done', 'What', 'Units', 'Amount', 'Why'], diff.buy.map((b) => [tick(b), esc(b.label) + (b.ticker ? ' <span class="hint">' + esc(b.ticker) + (b.sedol ? ' · ' + esc(b.sedol) : '') + '</span>' : ''), units(b.units), gbp(b.amount), esc(b.why || '')]));
  if (diff.sell.length) h += '<div class="section-title" style="margin-top:10px;">Sell</div>' + table(['Done', 'What', 'Units', 'Amount', 'Why'], diff.sell.map((s) => [tick(s), esc(s.label) + (s.ticker ? ' <span class="hint">' + esc(s.ticker) + '</span>' : ''), units(s.units), gbp(s.amount), esc(s.why || '')]));
  if (diff.hold.length) h += '<div class="section-title" style="margin-top:10px;">Already held</div>' + table(['What', 'Held', 'Target'], diff.hold.map((x) => [esc(x.label) + (x.ticker ? ' <span class="hint">' + esc(x.ticker) + '</span>' : ''), (x.heldUnits != null ? units(x.heldUnits) + ' units' : gbp(x.heldValue)) + (x.spare > 0 ? ' <span class="hint">(' + gbp(x.spare) + ' spare — kept, not a sale)</span>' : ''), x.units ? units(x.units) + ' units' : gbp(x.value)]));
  if (ledgerCount) h += '<p class="hint" style="margin-top:8px;">If a line under What you hold is not yours — a pasted statement can mis-read a code — remove it there and this page updates.</p>';
  if (diff.keep.length) h += '<p class="hint" style="margin-top:8px;">Left alone: ' + diff.keep.map((k) => esc(k.ticker || k.name) + ' (' + esc(k.wrapper) + ', ' + gbp(k.value) + ')').join(', ') + '.</p>';
  if (!complete) h += '<p class="hint">Totals: buy ' + gbp(diff.totals.buyCost) + ' · sell ' + gbp(diff.totals.sellValue) + (diff.totals.shortfall ? ' · <strong>short by ' + gbp(diff.totals.shortfall) + '</strong> before contributions' : '') + '.</p>';

  // Timeline
  if (seq && seq.steps.length) {
    h += '<div class="section-title" style="margin-top:12px;">When — a schedule to the start</div>'
      + '<p class="hint">' + esc(seq.note) + ' Cash years first, near rungs before far ones; sales spread over ' + seq.tranches + ' tranche' + (seq.tranches === 1 ? '' : 's') + ' so no single month\'s price decides the outcome; new contributions are used before sales.</p>'
      + table(['When', 'Action', 'What', 'Units', 'Amount'], seq.steps.map((s) => [esc(monthName(s.when)), esc(s.action), esc(s.label) + (s.ticker ? ' <span class="hint">' + esc(s.ticker) + '</span>' : ''), units(s.units), gbp(s.amount)]));
  }
  // Rules of the road
  h += '<details style="margin-top:12px;"><summary class="hint" style="cursor:pointer;">Things the schedule assumes — check them against your own position</summary><ul style="font-size:13px;line-height:1.5;">'
    + '<li><strong>Wrappers.</strong> The ladder and the target mix live in the SIPP. ISA and taxable holdings are left alone; if the plan needs money moved between wrappers, that is a contribution (SIPP room: the MPAA £10,000 once you have drawn flexibly; ISA £20,000 a year) — not a sale.</li>'
    + '<li><strong>Tax on sales.</strong> Inside a SIPP or ISA, none. In a taxable account, gains above the £3,000 exemption are taxable — gilts are exempt.</li>'
    + '<li><strong>Gilt units.</strong> Order gilts by units (the nominal), not by amount; the order sheet in the plan document carries SEDOLs. Prices and index ratios move daily; the pound figures here are indicative.</li>'
    + '<li><strong>Decision points.</strong> A planned sale (a house, a business) that funds part of the ladder is a date on the schedule, not a certainty — buy the near rungs first and leave the far ones until the money is real.</li>'
    + '</ul></details>';
  h += '<p class="hint" style="margin-top:8px;">Illustration, not advice. Nothing here places an order.</p></div>';
  return h;
}
