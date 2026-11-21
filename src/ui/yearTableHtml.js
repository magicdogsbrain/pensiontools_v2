/**
 * The full view's year tables (lead4.md D9; step F3): the Drawdown and Glidepath pages draw the plan's own tables from the
 * one function (src/reading/yearTable.js yearTablesOf, yearTablesText), the same rows, columns, labels and cells as the
 * simple view's "The years, one by one", marked cell by cell (lead4.md G1). The pages' inflation and length boxes are a
 * what-if beside the table: they draw a second table, clearly labelled and never marked, and never change the plan's.
 *
 *   yearTableHtml(text, { which, marked })   one table as HTML: which 'years' (the year table) or 'floors' (the pots' floors);
 *                                            marked false for a what-if (no fact marks: it is not the plan's figure)
 *   whatIfOf(doc, prefix)                    the what-if boxes of a page ('dd' Drawdown, 'gp' Glidepath) as { prices, duration }:
 *                                            prices a fraction (2.5 typed → 0.025), duration whole years; null for a box left
 *                                            empty or wrong (the plan's own is then used)
 *   whatIfLineHtml(t)                        the line over a what-if table: what it assumed, and that the plan is not changed
 */
import { yearColumnsOf } from '../reading/yearTable.js';
import { YEAR_COLUMNS, FLOOR_COLUMNS } from '../reading/labels.js';
import { tableAttr, cellAttr } from '../reading/mark.js';
import { TABLES } from '../reading/facts.js';

const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function yearTableHtml(text, { which = 'years', marked = true } = {}) {
  const floors = which === 'floors';
  const cols = floors ? text.floorCols : text.cols;
  const rows = floors ? text.floorRows : text.rows;
  if (!cols || !cols.length || !rows || !rows.length) return '';
  const labels = floors ? FLOOR_COLUMNS : YEAR_COLUMNS;
  let h = '<div class="table-scroll-container"><table' + (marked ? tableAttr(floors ? TABLES.FLOORS : TABLES.YEARS) : '') + '><thead><tr>';
  for (const c of cols) h += '<th>' + esc(labels[c] || c) + '</th>';
  h += '</tr></thead><tbody>';
  for (const r of rows) {
    h += '<tr>';
    for (const c of cols) h += '<td' + (marked ? cellAttr(r.key, c) : '') + '>' + esc(r.cells[c]) + '</td>';
    h += '</tr>';
  }
  return h + '</tbody></table></div>';
}

export function whatIfOf(doc, prefix) {
  const read = (id) => { const el = doc && doc.getElementById ? doc.getElementById(prefix + id) : null; return el ? String(el.value).trim() : ''; };
  const pct = read('Inflation'), yrs = read('Duration');
  const p = pct === '' ? NaN : Number(pct), y = yrs === '' ? NaN : Number(yrs);
  return {
    prices: Number.isFinite(p) && p >= -5 && p <= 20 ? p / 100 : null,
    duration: Number.isFinite(y) && y >= 1 && y <= 60 ? Math.round(y) : null
  };
}

/** Sets a page's what-if boxes to the plan's own figures (when the plan's table is drawn and the boxes were not typed in). */
export function fillWhatIf(doc, prefix, { prices, duration, planId = '' }) {
  const set = (id, v) => {
    const el = doc && doc.getElementById ? doc.getElementById(prefix + id) : null;
    if (!el) return;
    if (!el.dataset.whatIf) { el.dataset.whatIf = '1'; el.addEventListener('input', () => { el.dataset.touched = '1'; }); }
    // another plan: what was typed for the plan before is not carried over (lead4.md R2)
    if (el.dataset.planId !== String(planId)) { el.dataset.planId = String(planId); el.dataset.touched = ''; }
    if (el.dataset.touched !== '1') el.value = v;
  };
  set('Inflation', String(Math.round(prices * 1000) / 10));
  set('Duration', String(duration));
}

export function whatIfLineHtml(t) {
  return '<div class="alert alert-warning" style="font-size:12px;"><strong>What-if, not your plan:</strong> prices rising ' + esc(String(Math.round(t.prices * 1000) / 10)) + '% a year, over '
    + esc(String(t.duration)) + ' years. Your plan\'s own table above is not changed, and nothing is saved.</div>';
}

export { yearColumnsOf };
