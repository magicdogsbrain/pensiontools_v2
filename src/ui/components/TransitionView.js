/**
 * Transition tool — HTML. Pure: inputs in, HTML out.
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

/**
 * @param {object} a { stage, doc, target, diff, seq, prog, done, ledgerCount, startLabel }
 */
export function transitionHtml(a) {
  const { stage, doc, target, diff, seq, prog, done = {}, ledgerCount = 0, startLabel = '' } = a || {};
  let h = '<div class="card">';
  h += '<h2>Transition — from what you hold to the plan</h2>';
  if (!doc || !target || target.kind === 'none') {
    h += '<p>The transition tool works from the <strong>plan document</strong>: the order sheet for a gilt ladder, or the target mix for a pot strategy. Lock the plan (Stress tester → Settings → Lock plan) and come back.</p></div>';
    return h;
  }
  const kindText = target.kind === 'ladder' ? 'a gilt ladder — every rung and the cash years, in units' : 'a pot strategy — the year-0 mix in pounds';
  h += '<p class="hint">Target: ' + esc(kindText) + '. ' + esc(target.note || '') + '</p>';
  // Status
  const tone = prog.held >= 98 ? 'alert-success' : prog.held >= 50 ? 'alert-info' : 'alert-warning';
  h += '<div class="alert ' + tone + '"><strong>' + prog.held + '% of the target is held</strong>' + (prog.total ? ' · ' + prog.doneCount + ' of ' + prog.total + ' moves ticked off' : ' · nothing to do') + (seq && seq.startPassed ? ' · plan running (year 0 is ' + esc(startLabel) + ') — schedule spread over the next ' + seq.months + ' months' : (startLabel ? ' · plan starts ' + esc(startLabel) : '') + (seq ? ' · ' + seq.months + ' month' + (seq.months === 1 ? '' : 's') + ' to go' : '')) + '.'
    + (prog.next ? '<br>Next: <strong>' + esc(prog.next.action) + ' ' + esc(prog.next.label) + '</strong>' + (prog.next.units ? ', ' + units(prog.next.units) + ' units' : '') + (prog.next.amount ? ' (' + gbp(prog.next.amount) + ')' : '') + '.' : '') + '</div>';
  if (!ledgerCount) h += '<div class="alert alert-warning">No holdings in the ledger yet — everything below reads as "to buy". Copy the holdings table from your platform and paste it, or enter lines under <strong>My funds</strong> in the Stress tester\'s Settings (ticker or gilt code such as TR30, value, units for gilts, wrapper). <button type="button" class="risk-btn" data-on-click="pasteHoldingsFromTransition()">Paste my holdings</button> <button type="button" class="risk-btn" data-on-click="openMyFunds()">Enter by hand</button></div>';

  // The moves
  const tick = (item, action) => '<input type="checkbox" style="width:auto;"' + (done[item.key] ? ' checked' : '') + ' data-on-change="toggleTransitionDone(\'' + esc(item.key) + '\', this.checked)" title="Tick when the order is placed">';
  if (diff.buy.length) h += '<div class="section-title" style="margin-top:10px;">Buy</div>' + table(['Done', 'What', 'Units', 'Amount', 'Why'], diff.buy.map((b) => [tick(b, 'buy'), esc(b.label) + (b.ticker ? ' <span class="hint">' + esc(b.ticker) + (b.sedol ? ' · ' + esc(b.sedol) : '') + '</span>' : ''), units(b.units), gbp(b.amount), esc(b.why || '')]));
  if (diff.sell.length) h += '<div class="section-title" style="margin-top:10px;">Sell</div>' + table(['Done', 'What', 'Units', 'Amount', 'Why'], diff.sell.map((s) => [tick(s, 'sell'), esc(s.label) + (s.ticker ? ' <span class="hint">' + esc(s.ticker) + '</span>' : ''), units(s.units), gbp(s.amount), esc(s.why || '')]));
  if (diff.hold.length) h += '<div class="section-title" style="margin-top:10px;">Already held</div>' + table(['What', 'Held', 'Target'], diff.hold.map((x) => [esc(x.label) + (x.ticker ? ' <span class="hint">' + esc(x.ticker) + '</span>' : ''), x.heldUnits != null ? units(x.heldUnits) + ' units' : gbp(x.heldValue), x.units ? units(x.units) + ' units' : gbp(x.value)]));
  if (diff.keep.length) h += '<p class="hint" style="margin-top:8px;">Left alone: ' + diff.keep.map((k) => esc(k.ticker || k.name) + ' (' + esc(k.wrapper) + ', ' + gbp(k.value) + ')').join(', ') + '.</p>';
  h += '<p class="hint">Totals: buy ' + gbp(diff.totals.buyCost) + ' · sell ' + gbp(diff.totals.sellValue) + (diff.totals.shortfall ? ' · <strong>short by ' + gbp(diff.totals.shortfall) + '</strong> before contributions' : '') + '.</p>';

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
