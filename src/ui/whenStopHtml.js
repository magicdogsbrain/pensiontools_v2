/**
 * The full view's "When could I retire?" (lead4.md D11): answer A's every-age table on the plan's figures, drawn as the
 * simple view's "Every age, side by side" draws it (src/v7/components/AgesChart.jsx with `table`): the same rows of the same
 * result, the same columns and words (src/v7/copy/a.js A.answer), the same count words (countPlain). The run's inputs come
 * from the one gatherer (src/reading/whenStop.js whenStopOf); this module only writes the HTML.
 *
 *   whenStopHtml(result) → string   the table, its spending line and its key; '' with no rows
 *   whenStopNotAsked(why) → string  why there is nothing to ask (a plan that has stopped, or no income given)
 */
import { A } from '../v7/copy/a.js';
import { SHAPE } from '../v7/copy/shape.js';
import { countPlain } from '../v7/components/countPlain.js';
import { money } from '../reading/format.js';

const esc = (v) => String(v == null ? '' : v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fixed = (s) => esc(s).replace(/(\d+)/g, '<span data-fixed>$1</span>');   // fixed words' digits, as withFixedCounts marks them

/** Why the spin is not asked: said in the words the simple view uses for the same plans. */
export function whenStopNotAsked(why) {
  if (why === 'noAim') return 'No income set yet: set what you want to spend (Stress tester → Settings) and this works out when you could stop.';
  if (why === 'notSaving') return 'This plan has stopped saving: there is no stop age left to find.';
  return 'This plan’s figures cannot be read as a saver’s yet: check the Timing block and the pots.';
}

export function whenStopHtml(result) {
  const rows = (result && Array.isArray(result.ages)) ? result.ages : [];
  if (!rows.length) return '';
  const t = A.answer;
  const twenty = !!(result.basis && result.basis.weighted);
  const endAge = result.basis && result.basis.endAge;
  const level = result.level || 'balanced';
  const shownAge = result.shown && result.shown.age;
  const spendWords = !result.spendShape ? t.aMonth
    : rows.some((r) => r.spendAtStart !== undefined) ? SHAPE.answer.spendingShapedByAge : SHAPE.answer.spendingShaped;
  const lastedHead = twenty && t.chartLastedW ? t.chartLastedW[0] + ' ' + endAge + t.chartLastedW[1] : t.chartLasted + ' ' + endAge;
  const head = '<tr><th scope="col">' + esc(t.chartAge) + '</th><th scope="col">' + esc(result.shapeAt ? SHAPE.answer.agesColumn : t.chartSpend) + '</th><th scope="col">' + esc(lastedHead)
    + '</th><th scope="col">' + fixed(t.tableRunOut) + '</th><th scope="col">' + esc(t.tablePot) + '</th><th scope="col">' + esc(twenty && t.chartVerdictW ? t.chartVerdictW : t.chartVerdict) + '</th></tr>';
  const body = rows.map((row) => {
    const lv = row.levels && row.levels[level];
    const runOut = typeof endAge === 'number' && row.runOutAge >= endAge ? esc(t.tableLasts) : esc(row.runOutAge);
    return '<tr data-age="' + esc(row.age) + '"' + (row.age === shownAge ? ' style="font-weight:600;"' : '') + '><th scope="row">' + esc(row.age) + '</th><td>' + (lv ? money(lv.monthly) : '') + '</td><td>'
      + esc(countPlain(row.lasted, t, { of: twenty ? 20 : 10 })) + '</td><td>' + runOut + '</td><td>' + money(row.potAtStop && row.potAtStop.middling) + '</td><td>'
      + esc((t.verdictWord && t.verdictWord[row.verdict]) || row.verdict || '') + '</td></tr>';
  }).join('');
  const key = result.shapeAt ? SHAPE.answer.agesKey : twenty ? t.chartKeyW : t.chartKey;
  return '<p class="hint" data-line="whenStop.spend">' + esc(t.chartSpending) + ' ' + money(result.spend && result.spend.perMonth) + ' ' + esc(spendWords) + '</p>'
    + '<div class="table-scroll-container"><table data-table="ages"><thead>' + head + '</thead><tbody>' + body + '</tbody></table></div>'
    + '<p class="hint">' + fixed(key) + '</p>';
}
