/**
 * "What is covered, year by year" (7.6.0), drawn on "What you hold" and on "Moving to your plan's mix": the reading of
 * answers/plan/gaps.js gapsView (the table, and the sentences as template keys and slots — the classic planner fills the
 * same keys with the same words). Draws only; no figure is worked out here.
 */
import { fill } from '../../components/index.js';
import { GAPS as G } from '../../copy/gaps.js';

/** One sentence: each part's template filled with its slots and its plural words. */
export const gapLineText = (line) => line.parts.map((p) => fill(G[p.key], { ...p.slots, ...Object.fromEntries(Object.entries(p.words || {}).map(([k, v]) => [k, G[v]])) })).join('');

export function GapsSection({ gaps, prefix }) {
  if (!gaps) return null;
  const T = `${prefix}.gaps`;
  const heldText = (r) => (r.parts.length ? r.parts.map((p) => (p.kind === 'standIn' ? p.label + ' ' + p.amount : G.heldParts[p.kind] + ' ' + p.amount)).join(', ') : G.none);
  return (
    <section class="plan-section" data-section="gaps" data-testid={T} data-gap={gaps.hasGap ? '1' : '0'}>
      <h2>{G.title}</h2>
      <p class="note">{G.lead}</p>
      <ul class="plan-lines" data-testid={`${T}.lines`}>
        {gaps.lines.map((l, i) => <li key={i} class="plan-line" data-line={l.id}>{gapLineText(l)}</li>)}
      </ul>
      {gaps.ladder && gaps.rows.length > 0 && (
        <div class="table-wrap">
          <table class="way-table" data-testid={`${T}.table`}>
            <thead><tr><th>{G.columns.year}</th><th>{G.columns.need}</th><th>{G.columns.held}</th><th>{G.columns.gap}</th></tr></thead>
            <tbody>
              {gaps.rows.map((r) => (
                <tr key={r.Y} data-year={r.Y} data-source={r.source} data-gap={r.gap ? '1' : '0'}>
                  <td>{r.thisYear ? fill(G.thisYear, { year: r.year, months: r.monthsLeft, s: r.monthsLeft === '1' ? '' : 's' }) : r.year}</td>
                  <td>{r.need}</td>
                  <td>{heldText(r)}{r.toBuy ? ' · ' + fill(G.heldParts.toBuy, { amount: r.toBuy }) : ''}</td>
                  <td>{r.gap || G.none}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
