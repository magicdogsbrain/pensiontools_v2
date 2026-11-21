/**
 * "Your plan's mix" while living on a locked gilt ladder (7.12.0), the full view's drawing — HTML out. The same view as the
 * simple view's (answers/plan/held.js heldLadderView) with the same words (src/v7/copy/held.js), so the two say the page alike.
 * Each table stacks one row per card under 600px wide (index.html's .held-table rule), so nothing is cut off on a phone.
 */
import { esc } from './ReleaseNotesView.js';
import { sayHeld } from '../../answers/plan/held.js';
import { HELD as H } from '../../v7/copy/held.js';
import { markWithin } from '../../reading/mark.js';
import { GILTS_HELD_FIND } from '../../reading/sentenceMarks.js';

// the one count of the plan's gilts held (gilts.held), marked where the page says it, as the simple view marks it
const sayCount = (s) => markWithin(say(s), [[GILTS_HELD_FIND, 'gilts.held']]);

const say = (s) => esc(sayHeld(s, H));
const lines = (items, attr) => items.map((x) => '<p class="hint" data-' + attr + '="' + esc(x.key) + '">' + say(x) + '</p>').join('');
const title = (t) => '<div class="section-title" style="margin-top:12px;">' + esc(t) + '</div>';
function table(cls, head, rows) {
  return '<div class="table-scroll-container"><table class="held-table ' + cls + '"><thead><tr>' + head.map((x) => '<th>' + esc(x) + '</th>').join('') + '</tr></thead><tbody>'
    + rows.map((r) => '<tr>' + r.map((c, i) => '<td data-label="' + esc(head[i]) + '">' + c + '</td>').join('') + '</tr>').join('') + '</tbody></table></div>';
}

/** The page as HTML. `holdHref` is where "What you hold" is (the card above on this tab). Empty when there is nothing to draw. */
export function heldLadderHtml(v, { holdHref = '#holdingsCard' } = {}) {
  if (!v) return '';
  const C = H.giltColumns, K = H.cashColumns, A = H.alsoColumns;
  let h = '<div id="heldLadder">';
  h += v.head.map((x) => (x.key === 'agreed' ? '<p><strong>' + say(x) + '</strong></p>' : '<p class="hint">' + say(x) + (x.key === 'noRecord' ? ' <a href="' + esc(holdHref) + '">' + esc(H.holdLink) + '</a>' : '') + '</p>')).join('');
  if (v.summary) h += '<p class="held-summary" style="font-size:16px;"><strong>' + sayCount(v.summary) + '</strong></p>';
  if (!v.head.some((x) => x.key === 'noRecord')) h += '<p class="hint"><a href="' + esc(holdHref) + '">' + esc(H.changeLink) + '</a></p>';
  h += title(H.giltsTitle);
  h += v.figure.map((x) => '<p>' + sayCount(x) + '</p>').join('');
  h += table('held-gilts', [C.gilt, C.years, C.plan, C.held, C.difference], v.gilts.map((r) => [esc(r.gilt), esc(r.years), esc(r.plan), esc(r.held), say(r.difference)]));
  h += lines(v.under, 'under');
  if (v.cash) {
    h += title(H.cashTitle) + '<p>' + say(v.cash.need) + '</p>';
    h += table('held-cash', [K.when, K.due, K.arrives], [...v.cash.rows.map((r) => [say(r.when), say(r.due), say(r.arrives)]),
      ['<strong>' + say(v.cash.total.when) + '</strong>', '<strong>' + esc(v.cash.total.due) + '</strong>', '<strong>' + esc(v.cash.total.arrives) + '</strong>']]);
    h += lines(v.cash.lines, 'state');
  }
  if (v.noCash || v.lines.length || v.set.length) {
    h += title(H.alsoTitle);
    if (v.noCash) h += '<p class="hint">' + say(v.noCash) + '</p>';
    if (v.lines.length) h += table('held-also', [A.what, A.value, A.matures, A.pays], v.lines.map((l) => [esc(l.what), esc(l.value), say(l.matures), say(l.pays)]));
    h += lines(v.set, 'set') + lines(v.notes, 'note');
  }
  if (v.outside.length) h += title(H.outsideTitle) + lines(v.outside, 'outside');
  if (v.expected.length) h += title(H.expectedTitle) + lines(v.expected, 'expected');
  h += '<p class="hint" style="margin-top:8px;">' + say(v.footer) + '</p>';
  return h + '</div>';
}
