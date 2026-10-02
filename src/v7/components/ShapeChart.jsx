/**
 * The spending shape, a bar for each year (research/v7/spending-shape.md 4.4; today's planner's staircase, T11).
 *
 *   <ShapeChart q chart open dispatch />
 *
 * `chart` is select.js shapeView(…).chart — every figure in it is worked out there, from the model (src/answers): the
 * screen only draws. One bar a year from the start to the end of the plan:
 *   - A and B: what you would spend a month that year, after tax, at today's prices. When the household's other income
 *     is known (the State Pension and other pensions, after tax), the part they pay is drawn lighter and the part from
 *     your pension and savings darker — today's planner's layers, in after-tax pounds;
 *   - C: each year as a share of what you start on (C works the start out).
 * Under the bars, the go-go, go-slow and no-go bands at 75 and 85 of the younger of you, as today colours them. The
 * budget's essentials, when a budget exists, are a dashed guide line, and a year under them is drawn in the warning
 * colour — never the only signal: the line under the chart and the table say so in words.
 *
 * At 390 px the picture is the content's width and 180 px tall; nothing scrolls sideways at any width. The geometry is
 * an SVG stretched to the box (no words inside it, so nothing is squashed); the axis words are ordinary text placed by
 * percentage. Tapping or pointing at a bar writes that year under the chart (a line, not a tooltip, so it works on a
 * phone). A screen reader hears one sentence for the whole picture, and "Show each year" opens a table it reads row by
 * row. Each bar carries its age and its figure (data-age, data-figure: the browser tests hold them to the model's).
 */
import { useState } from 'preact/hooks';
import { money } from '../../answers/shared/format.js';
import { answerShapeChart } from '../state/select.js';
import { listWords, pictureWords } from './shapeWords.js';
import { Button } from './Button.jsx';
import { SHAPE } from '../copy/shape.js';

const fill = (text, values) => String(text).replace(/\{(\w+)\}/g, (m, k) => (k in values ? values[k] : m));
const W = SHAPE.chart;

/** The top of the scale: a round figure at or above the largest value (1, 2, 2.5 or 5 times a power of ten). */
export function scaleTop(max) {
  const m = Math.max(1, Number(max) || 0);
  const p = 10 ** Math.floor(Math.log10(m));
  for (const k of [1, 2, 2.5, 5, 10]) if (k * p >= m) return k * p;
  return 10 * p;
}

/** A figure on this chart's scale: money a month, or a share of the start. */
const valueText = (unit, v) => (unit === 'share' ? `${Math.round(v)}%` : money(v));

/** The words for one year (the line under the chart, and each row of the table). */
export function yearWords(chart, y) {
  if (chart.unit === 'share') return fill(W.yearShare, { age: y.age, pct: Math.round(y.value) });
  const base = chart.layers && typeof y.income === 'number' && y.income > 0
    ? fill(W.yearSplit, { age: y.age, amount: money(y.value), income: money(y.income), pots: money(y.pots) })
    : fill(W.year, { age: y.age, amount: money(y.value) });
  return y.below ? `${base} ${W.yearBelow}` : base;
}

export function ShapeChart({ q, chart, open = false, dispatch, title = null }) {
  const [picked, setPicked] = useState(null);
  if (!chart || !Array.isArray(chart.years) || chart.years.length === 0) return null;
  const years = chart.years;
  const n = years.length;
  const id = `${q}.shape.chart`;
  const essentials = chart.unit === 'perMonth' && typeof chart.essentials === 'number' && chart.essentials > 0 ? chart.essentials : null;
  const top = scaleTop(Math.max(...years.map((y) => y.value), essentials || 0));
  const ticks = [top / 2, top].map((v) => ({ v, at: 100 - (v / top) * 100 }));
  const h = (v) => Math.max(0, Math.min(100, (v / top) * 100));
  const firstAge = years[0].age;
  const at = (age) => ((age - firstAge) / n) * 100;
  // the go-go, go-slow and no-go bands, by your age (75 and 85 of the younger of you)
  const bands = [];
  const goSlow = chart.bands && chart.bands.goSlow;
  const noGo = chart.bands && chart.bands.noGo;
  const lastAge = years[n - 1].age + 1;
  const cut = (a) => Math.max(firstAge, Math.min(lastAge, a));
  if (typeof goSlow === 'number' && typeof noGo === 'number') {
    for (const [key, from, to] of [['goGo', firstAge, goSlow], ['goSlow', goSlow, noGo], ['noGo', noGo, lastAge]]) {
      const a = cut(from);
      const b = cut(to);
      if (b > a) bands.push({ key, left: at(a), width: ((b - a) / n) * 100 });
    }
  }
  // the first age, then every fifth — less one that would run into the first (63 and 65 overlap at 390 px)
  const labelAges = years.map((y) => y.age).filter((a, i) => i === 0 || (a % 5 === 0 && a - firstAge >= 3));
  const pick = (e) => {
    const box = e.currentTarget.getBoundingClientRect();
    if (!box.width) return;
    const i = Math.floor(((e.clientX - box.left) / box.width) * n);
    if (i >= 0 && i < n) setPicked(i);
  };
  const shown = picked !== null && picked < n ? years[picked] : null;
  const tableOpen = open;
  const axis = chart.couple && typeof chart.gap === 'number' && chart.gap !== 0
    ? fill(W.axisCouple, { gap: Math.abs(chart.gap) === 1 ? W.oneYear : fill(W.years, { n: Math.abs(chart.gap) }), younger: chart.gap > 0 ? W.younger : W.older })
    : W.axis;

  return (
    <figure class="shape-chart" data-chart="shape" data-unit={chart.unit} data-testid={id}>
      {title !== false && <figcaption class="shape-chart-title" id={`${id}.title`}>{title || (chart.unit === 'share' ? W.titleC : W.title)}</figcaption>}
      <div class="shape-plot-wrap">
        <div class="shape-y" aria-hidden="true">
          {ticks.map((t) => <span key={t.v} class="shape-tick" style={`top:${t.at}%`}>{valueText(chart.unit, t.v)}</span>)}
        </div>
        <div class="shape-plot" role="img" aria-label={pictureWords(chart.list, years[0].age, years[n - 1].age, chart.unit)} aria-describedby={title !== false ? `${id}.title` : undefined}
          onPointerMove={pick} onPointerDown={pick} onClick={pick} data-testid={`${id}.plot`}>
          <svg viewBox={`0 0 ${n} 100`} preserveAspectRatio="none" aria-hidden="true" focusable="false">
            {bands.map((b) => <rect key={b.key} class={`band band-${b.key}`} x={(b.left / 100) * n} y="0" width={(b.width / 100) * n} height="100" />)}
            {ticks.map((t) => <line key={t.v} class="grid" x1="0" x2={n} y1={t.at} y2={t.at} vector-effect="non-scaling-stroke" />)}
            {years.map((y, i) => {
              const total = h(y.value);
              const income = chart.layers && typeof y.income === 'number' ? Math.min(total, h(y.income)) : 0;
              return (
                <g key={y.age} class={`year${y.below ? ' is-below' : ''}${picked === i ? ' is-picked' : ''}`} data-age={y.age} data-figure={y.value}>
                  {income > 0 && <rect class="part-income" x={i + 0.12} width="0.76" y={100 - income} height={income} />}
                  <rect class={y.below ? 'part-below' : 'part-pots'} x={i + 0.12} width="0.76" y={100 - total} height={Math.max(0, total - income)} />
                </g>
              );
            })}
            {essentials !== null && <line class="guide" x1="0" x2={n} y1={100 - h(essentials)} y2={100 - h(essentials)} vector-effect="non-scaling-stroke" data-testid={`${id}.essentials`} />}
          </svg>
          {bands.length > 0 && (
            <div class="shape-bands" aria-hidden="true">
              {bands.map((b) => <span key={b.key} class={`shape-band band-${b.key}`} style={`left:${b.left}%;width:${b.width}%`}>{W.bands[b.key]}</span>)}
            </div>
          )}
        </div>
      </div>
      <div class="shape-x" aria-hidden="true">
        {labelAges.map((a) => <span key={a} class="shape-age" style={`left:${at(a) + 50 / n}%`}>{a}</span>)}
      </div>
      <p class="note shape-axis" aria-hidden="true">{axis}</p>
      <p class="shape-year" data-testid={`${id}.year`} aria-live="polite">{shown ? yearWords(chart, shown) : W.pick}</p>
      <p class="note shape-key">
        {chart.unit === 'share' ? W.keyShapeOnly : chart.layers ? W.key : W.keyShapeOnly}
        {essentials !== null && <> {W.keyEssentials}</>}
      </p>
      <p>
        <Button testid={`${q}.shape.years`} kind="quiet" aria-expanded={tableOpen ? 'true' : 'false'} aria-controls={tableOpen ? `${id}.table` : undefined}
          onClick={() => dispatch({ type: 'ui/toggle', id: 'shapeYears' })}>{tableOpen ? W.tableHide : W.table}</Button>
      </p>
      {tableOpen && (
        <table class="shape-table" id={`${id}.table`} data-table="shape">
          <thead>
            <tr>
              <th scope="col">{W.tableAge}</th>
              <th scope="col">{chart.unit === 'share' ? W.tableShare : W.tableAmount}</th>
              {chart.layers && chart.unit !== 'share' && <th scope="col">{W.tableIncome}</th>}
              {chart.layers && chart.unit !== 'share' && <th scope="col">{W.tablePots}</th>}
            </tr>
          </thead>
          <tbody>
            {years.map((y) => (
              <tr key={y.age} data-age={y.age} class={y.below ? 'is-below' : undefined}>
                <th scope="row">{y.age}{chart.couple && typeof y.partnerAge === 'number' && <small class="partner-age"> ({y.partnerAge})</small>}</th>
                <td>{valueText(chart.unit, y.value)}{y.below && <span class="sr-only"> {W.yearBelow}</span>}</td>
                {chart.layers && chart.unit !== 'share' && <td>{money(y.income || 0)}</td>}
                {chart.layers && chart.unit !== 'share' && <td>{money(y.pots || 0)}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </figure>
  );
}

/**
 * Beside an answer whose spending changes with age (spending-shape.md 4.4, 6): the steps in words and the picture of
 * every year, at the amount the answer is about — A and B as you set it, C at the careful amount. Drawn after the answer's
 * own region (its figures are the answer's rows, written here as a picture and a table), and only for a shaped answer:
 * a flat answer draws exactly what it drew before.
 */
export function ShapeAnswer({ state, q, dispatch }) {
  const chart = answerShapeChart(state, q);
  if (!chart) return null;
  const A = SHAPE.answer;
  const words = listWords(chart.list, 'perMonth');
  return (
    <section class="block shape-answer" data-region="shape" data-testid={`${q}.shape.answer`} aria-labelledby={`${q}.shape.answer.title`}>
      <h2 id={`${q}.shape.answer.title`}>{q === 'c' ? A.titleC : A.title}</h2>
      {words && <p data-testid={`${q}.shape.answer.list`}>{fill(q === 'c' ? A.leadC : A.lead, { list: words })}</p>}
      <ShapeChart q={q} chart={chart} open={state.ui.open.includes('shapeYears')} dispatch={dispatch} title={false} />
    </section>
  );
}
