/**
 * The paste preview (6.23): the table of what was read, "What is this?" on every line the tool could not
 * recognise, and a summary that says what was left out and why. Pure: inputs in, HTML out.
 *
 * Inline handlers are plain calls (src/ui/inlineHandlers.js): the shell defines setPasteCategory(i, key) and
 * applyPasteHoldings().
 */
import { esc } from './ReleaseNotesView.js';
import { CATEGORY_CHOICES, pasteSummary } from '../../services/HoldingsPaste.js';

const gbp = (v) => '£' + Math.round(+v || 0).toLocaleString('en-GB');

/** The "What is this?" dropdown for row i (or a ledger line, with a different handler). */
export function categorySelectHtml(handler, chosen) {
  return '<select data-on-change="' + handler + '" style="width:auto;" title="What is this?"><option value=""' + (chosen ? '' : ' selected') + '>What is this?</option>'
    + CATEGORY_CHOICES.map((c) => '<option value="' + c.key + '"' + (chosen === c.key ? ' selected' : '') + '>' + esc(c.label) + '</option>').join('') + '</select>';
}

function readAs(m) {
  const k = m.match ? m.match.kind : 'none';
  if (m.category) { const c = CATEGORY_CHOICES.find((x) => x.key === m.category); return c ? (c.key === 'unknown' ? 'Don\'t know — on the record, not in the mix' : c.label + ' (your answer)') : ''; }
  if (k === 'gilt') return 'gilt rung (' + esc(m.match.confidence) + ')';
  if (k === 'cash') return 'money market / cash';
  if (k === 'catalogue') return 'fund (' + esc(m.match.confidence) + ')';
  return '';
}

/**
 * @param {object} a { parsed, matched, merged, wrapper, target: 'hold'|'test' }
 */
export function pastePreviewHtml({ parsed, matched = [], merged, wrapper = 'SIPP', target = 'hold' } = {}) {
  if (!matched.length) return '<div class="alert alert-warning">' + ((parsed && parsed.warnings) || []).map(esc).join('<br>') + '</div>';
  let h = '<div class="table-scroll-container"><table><thead><tr><th>Pasted</th><th>Read as</th><th>Units</th><th>Value</th><th>Match</th></tr></thead><tbody>';
  matched.forEach((m, i) => {
    const unrecognised = m.match && m.match.kind === 'none' && !m.category;
    const matchCell = unrecognised || m.category
      ? '<span style="color:' + (unrecognised ? 'var(--danger,#f87171)' : 'var(--text-muted)') + ';">' + (unrecognised ? 'not recognised' : esc(readAs(m))) + '</span> ' + categorySelectHtml('setPasteCategory(' + i + ',this.value)', m.category || '')
      : esc(readAs(m));
    h += '<tr><td>' + esc(m.name || m.ticker || m.sedol || '') + '</td><td>' + esc((m.match && (m.match.name || m.match.ticker)) || '—') + (m.match && m.match.ticker ? ' <span class="hint">' + esc(m.match.ticker) + '</span>' : '')
      + '</td><td>' + (m.units != null ? Math.round(m.units).toLocaleString('en-GB') : '—') + '</td><td>' + (m.value != null ? gbp(m.value) : '—') + '</td><td>' + matchCell + '</td></tr>';
  });
  h += '</tbody></table></div>';
  const s = pasteSummary({ parsed, matched });
  h += '<p class="hint" style="margin-top:6px;">' + esc(s.text) + '</p>';
  if (merged) {
    h += '<p class="hint" style="margin-top:6px;">Applying will ' + (merged.updated.length ? 'update ' + merged.updated.length + ' line' + (merged.updated.length === 1 ? '' : 's') + ' you already have' : 'update nothing')
      + (merged.added.length ? ', add ' + merged.added.length : '')
      + (merged.unseen.length ? ', and leave ' + merged.unseen.length + ' ' + esc(wrapper) + ' line' + (merged.unseen.length === 1 ? '' : 's') + ' not in the paste (' + merged.unseen.map((u) => esc(u.ticker || u.name || '?')).join(', ') + ') — remove them yourself if they were sold' : '') + '.</p>';
  }
  h += '<div class="row-flex" style="margin-top:8px;"><button type="button" data-on-click="applyPasteHoldings()">' + (target === 'hold' ? 'Apply to what I hold' : 'Apply to the funds to test') + '</button></div>';
  return h;
}
