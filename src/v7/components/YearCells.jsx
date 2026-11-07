/**
 * The record keeper's year (7.3.0's year view, made a component of its own at 7.5.0; research/v7/mockups/README.md
 * picture 3): twelve month cells, April to March — a purple bar for what was drawn, a dashed line for what the plan said
 * (both to the same scale), a dashed cell for a month filled in later, a pink ring on the month due, a teal cell for the
 * month the tax year was set up. The cells fill month by month (the motion rule: time passing).
 *
 *   <YearCells Y words testid />        Y: answers/plan/home.js homeOf → year (read from decisionTool.history and the plan of
 *                                       record, as "Where you are" reads them); words: copy/home.js HOME.year and yearTitle
 *
 * Draws only. Each cell says in words what it shows (for a screen reader); the legend names every kind of mark.
 */
import { Money } from './Money.jsx';
import { fill } from './PlanFigures.jsx';

export function YearCells({ Y, words: W, title, testid }) {
  if (!Y || !Array.isArray(Y.cells)) return null;
  return (
    <section class="home-year" data-region="home-year" data-testid={testid} data-year={Y.key}>
      <h2 class="eyebrow">{fill(title, { year: Y.year })}</h2>
      <ol class="year-cells" aria-label={fill(W.label, { year: Y.year })}>
        {Y.cells.map((c, i) => (
          <li key={c.month} class={`year-cell is-${c.state}`} data-month={c.month} data-state={c.state}>
            <span class="year-plot" aria-hidden="true">
              {c.drawnPct != null && <span class="year-bar" style={`height:${c.drawnPct}%;animation-delay:${i * 45}ms`} />}
              {c.planPct != null && <span class="year-plan" style={`bottom:${c.planPct}%`} />}
            </span>
            <span class="year-name" aria-hidden="true">{c.name.slice(0, 3)}</span>
            <span class="sr-only">
              {c.drawn != null ? <>{fill(W.cell[c.state].split('{drawn}')[0], { month: c.words })}<Money source={c} k="drawn" />{W.cell[c.state].split('{drawn}')[1] || ''}</> : fill(W.cell[c.state], { month: c.words })}
              {c.plan != null && (c.state === 'recorded' || c.state === 'filled') && <>{W.planSaid.split('{plan}')[0]}<Money source={c} k="plan" /></>}
            </span>
          </li>
        ))}
      </ol>
      <ul class="year-legend" aria-hidden="true">
        <li><i class="key-drawn" />{W.legendDrawn}</li>
        <li><i class="key-plan" />{W.legendPlan}</li>
        <li><i class="key-filled" />{W.legendFilled}</li>
        <li><i class="key-setup" />{W.legendSetUp}</li>
        <li><i class="key-due" />{W.legendDue}</li>
      </ul>
      <p class="note" data-testid={`${testid}.count`}>{Y.recorded === 0 ? fill(W.recordedCount.none, { year: Y.year }) : Y.recorded === 1 ? fill(W.recordedCount.one, { year: Y.year }) : fill(W.recordedCount.many, { n: String(Y.recorded), year: Y.year })}</p>
    </section>
  );
}
