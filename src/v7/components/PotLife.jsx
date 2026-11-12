/**
 * The pot over a life (7.5.0; research/v7/mockups/README.md picture 2), drawn from the person's own figures, to scale,
 * with the bad case shaded:
 *
 *   <PotLife picture words />        picture: state/pictures.js potPicture(state, q); words: copy/picture.js PICTURE.pot
 *
 * "Am I saving enough?" draws the rising half — what paying in as now comes to (amber), what would be enough (pink) — and
 * the drawing half faint: each bad case falling to the age it runs out. "Will it last?" draws what is left over the years
 * ahead: the middling years and the bad case shaded. The two are halves of the same picture.
 *
 * A line's faint drawing half (part 'drawing') shares its rising half's legend entry; a guide (an end the answer gives no
 * figure for) is dashed and carries no figure on the page, and "still there at 95" says the money lasts without saying how
 * much. Everything is worked out in pictures.js; here ages and pounds become places on the picture, and nothing else. The
 * geometry is an SVG stretched to its box (its lines keep their width); the words — the scale, the ages, the dots — are
 * ordinary text placed by percentage, so nothing is squashed at 390 px and nothing scrolls sideways. A screen reader hears
 * one sentence for the picture and can open the table of the answer's own figures; the legend names every series.
 *
 * Motion (the README's rule: time passing): the picture is revealed left to right, the years passing, and the bad case
 * fades in after it; a changed figure moves each line from where it was (where the browser can). Under a second, ending on
 * the complete picture; with less motion asked for, the complete picture at once (base.css).
 */
import { money, pot, ageText } from '../../answers/shared/format.js';

const fill = (text, values) => String(text).replace(/\{(\w+)\}/g, (m, k) => (k in values ? values[k] : m));
const VW = 1000;
const VH = 300;

/** A row's figures, as the answer's sentences write them: pots to the nearest £1,000, amounts a month to the pound. */
const rowText = (text, slots) => fill(text, Object.fromEntries(Object.entries(slots).map(([k, v]) => [k,
  k === 'age' ? ageText(v) : k === 'amount' ? money(v) : pot(v)])));

export function PotLife({ picture: P, words: W }) {
  if (!P || !Array.isArray(P.lines)) return null;
  const span = Math.max(1, P.to - P.from);
  const x = (age) => ((age - P.from) / span) * VW;
  const y = (v) => VH - (Math.max(0, v) / P.top) * VH;
  const pct = (age) => `${((age - P.from) / span) * 100}%`;
  const vpct = (v) => `${100 - (Math.max(0, v) / P.top) * 100}%`;
  const d = (pts) => pts.map((p, i) => `${i ? 'L' : 'M'}${x(p.age).toFixed(1)} ${y(p.value).toFixed(1)}`).join(' ');
  const area = (pts) => `${d(pts)} L${x(pts[pts.length - 1].age).toFixed(1)} ${VH} L${x(pts[0].age).toFixed(1)} ${VH} Z`;
  // each path also carries its shape as a style, so a browser that can move a path's shape moves it from where it was
  const shaped = (path) => ({ d: path, style: `d: path("${path}")` });
  const titleId = `${P.q}-pot-title`;
  const descId = `${P.q}-pot-desc`;
  // a line's drawing half is the same life as its rising half: one legend entry for both
  const legend = [
    ...P.lines.filter((l) => !l.part).map((l) => ({ id: l.id, role: l.role, guide: !!l.guide })),
    ...(P.band ? [{ id: P.band.id, role: P.band.role, band: true }] : []),
    ...P.marks.map((m) => ({ id: m.id, role: m.id, mark: true }))
  ];
  return (
    // data-fixed: the figures on the picture (the scale, the ages, the table) are the answer's own, placed by state/pictures.js
    <figure class={`pot-life is-${P.q}`} data-testid={`${P.q}.pot`} data-fixed="picture" data-from={P.from} data-to={P.to} data-top={P.top} aria-labelledby={titleId} aria-describedby={descId}>
      <figcaption>
        <h2 id={titleId} class="pot-title">{P.q === 'b' ? W.titleB : W.titleD}</h2>
        <p id={descId} class="sr-only">{fill(P.q === 'b' ? W.labelB : W.labelD, { age: P.stop != null ? ageText(P.stop) : '' })}</p>
      </figcaption>
      <div class="pot-plot">
        <svg class="pot-svg" viewBox={`0 0 ${VW} ${VH}`} preserveAspectRatio="none" aria-hidden="true" focusable="false">
          {P.ticks.map((t) => <line key={t} class="pot-grid" x1="0" x2={VW} y1={y(t)} y2={y(t)} vector-effect="non-scaling-stroke" />)}
          <line class="pot-base" x1="0" x2={VW} y1={VH} y2={VH} vector-effect="non-scaling-stroke" />
          {P.band && <path class={`pot-band is-${P.band.role}${P.band.guide ? ' is-guide' : ''}`} data-series={P.band.id} {...shaped(area(P.band.points))} />}
          {P.band && <path class={`pot-band-edge is-${P.band.role}`} data-series={P.band.id + '.edge'} {...shaped(d(P.band.points))} vector-effect="non-scaling-stroke" />}
          {P.stop != null && <line class="pot-stop" x1={x(P.stop)} x2={x(P.stop)} y1="0" y2={VH} vector-effect="non-scaling-stroke" />}
          {/* a line's end carries its figure only where the answer gives it; a guide's end is drawn, never written */}
          {P.lines.map((l) => {
            const last = l.points[l.points.length - 1];
            const known = !l.guide && !l.part;
            return <path key={l.id} class={`pot-line is-${l.role}${l.part ? ' is-half' : ''}${l.guide ? ' is-guide' : ''}`} data-series={l.id} data-end-age={known ? last.age : undefined} data-end-value={known ? Math.round(last.value) : undefined} data-end={known ? undefined : 'guide'} {...shaped(d(l.points))} vector-effect="non-scaling-stroke" />;
          })}
        </svg>
        {/* the scale and the ages: text placed on the picture, never stretched with it */}
        {P.ticks.map((t) => <span key={t} class="pot-tick" style={`top:${vpct(t)}`} aria-hidden="true">{pot(t)}</span>)}
        {P.stop != null && <span class="pot-stop-word" style={`left:${pct(P.stop)}`} aria-hidden="true">{fill(W.stop, { age: ageText(P.stop) })}</span>}
        {P.lasts != null && <span class="pot-lasts-word" data-testid={`${P.q}.pot.lasts`} aria-hidden="true">{fill(W.lasts, { age: ageText(P.lasts) })} <span aria-hidden="true">→</span></span>}
        {P.marks.map((m) => <span key={m.id} class={`pot-mark is-${m.id}`} data-mark={m.id} data-age={m.age} data-pounds={Math.round(m.value)} style={`left:${pct(m.age)};top:${vpct(m.value)}`} aria-hidden="true" />)}
      </div>
      <div class="pot-ages" aria-hidden="true">
        {P.ages.map((a) => <span key={a} style={`left:${pct(a)}`}>{ageText(a)}</span>)}
      </div>
      <ul class="pot-legend" data-testid={`${P.q}.pot.legend`}>
        {legend.map((k) => <li key={k.id} data-series={k.id}><i class={`key-${k.mark ? 'mark' : k.band ? 'band' : 'line'} is-${k.role}${k.guide ? ' is-guide' : ''}`} aria-hidden="true" />{W.legend[k.id]}</li>)}
      </ul>
      <p class="note pot-note">{P.q === 'b' ? W.noteB : W.noteD}</p>
      <details class="pot-figures" data-testid={`${P.q}.pot.table`}>
        <summary>{W.show}</summary>
        <ul>{P.rows.map((r) => <li key={r.id} data-row={r.id}>{rowText(W.rows[r.words || r.id], r.slots)}</li>)}</ul>
      </details>
    </figure>
  );
}
