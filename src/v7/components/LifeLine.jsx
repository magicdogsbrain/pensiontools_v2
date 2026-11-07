/**
 * The life line (7.5.0; research/v7/mockups/README.md picture 1): Saving → Moving → Drawing. One component, two uses:
 *
 *   <LifeLine example words />               the front door's explainer: the shape of a pot over a life (rising while
 *                                            saving, level through the move, falling while drawing), each stage in its
 *                                            own colour with what happens in it. No figure is drawn: it is a stranger's.
 *   <LifeLine stages words testid />         a plan's home: the same three stages reduced to three segments, the one the
 *                                            plan is in marked "you are here" with the pink dot (which slides to its
 *                                            place), a part-done move filled to its share.
 *
 * `example` is state/pictures.js LIFE_EXAMPLE; `stages` is pictures.js lifeStages(home.stage.strip). Draws only. The dot's
 * slide is the motion rule's "time passing"; with less motion asked for it is drawn in place (base.css).
 */
const fill = (text, values) => String(text).replace(/\{(\w+)\}/g, (m, k) => (k in values ? values[k] : m));

/** The SVG path through points in a 0..1 box, drawn in a viewBox of w × h (y up). */
function pathOf(points, w, h) {
  return points.map(([x, y], i) => `${i ? 'L' : 'M'}${(x * w).toFixed(1)} ${((1 - y) * h).toFixed(1)}`).join(' ');
}

function Explainer({ example, words }) {
  const W = 720;
  const H = 150;
  const d = pathOf(example.points, W, H - 16);
  const area = `${d} L${W} ${H} L0 ${H} Z`;
  return (
    <figure class="life-line is-explainer" data-testid="front.life" role="group" aria-label={words.label}>
      <svg class="life-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <defs>
          {/* the line in the three stage colours, and the same colours soft for the pot under it */}
          {['life-grad', 'life-soft'].map((id) => (
            <linearGradient key={id} id={id} x1="0" x2="1" y1="0" y2="0">
              {example.stages.map((s) => [
                <stop key={s.key + 'a'} offset={String(s.from)} class={`life-stop is-${s.key}${id === 'life-soft' ? ' is-soft' : ''}`} />,
                <stop key={s.key + 'b'} offset={String(s.to)} class={`life-stop is-${s.key}${id === 'life-soft' ? ' is-soft' : ''}`} />
              ])}
            </linearGradient>
          ))}
        </defs>
        <path class="life-area" d={area} />
        <path class="life-curve" d={d} vector-effect="non-scaling-stroke" />
      </svg>
      <ol class="life-stages">
        {example.stages.map((s) => (
          <li key={s.key} class={`life-stage is-${s.key}`} data-stage={s.key} style={`--from:${s.from};--to:${s.to}`}>
            <strong>{words[s.key]}</strong>
            <span>{words[s.key + 'What']}</span>
          </li>
        ))}
      </ol>
    </figure>
  );
}

/** The plan home's stage strip (7.3.0's markup and test ids, kept): three segments, the dot on the one the plan is in. */
function Strip({ stages, words, testid }) {
  return (
    <div class="stage-strip life-line is-strip" data-testid={testid}>
      <p class="sr-only">{words.label}</p>
      <div class="strip-segs" aria-hidden="true">
        {stages.map((sg) => <span key={sg.key} class={`strip-seg is-${sg.key} is-${sg.state}`}>{sg.held != null && <span class="strip-fill" style={`width:${sg.held}%`} />}{sg.state === 'now' && <span class="strip-dot" />}</span>)}
      </div>
      <ul class="strip-words">
        {stages.map((sg) => (
          <li key={sg.key} data-stage={sg.key} data-state={sg.state} aria-current={sg.state === 'now' ? 'step' : undefined}>
            <strong>{words.stages[sg.key]}</strong>
            {/* a move behind a Drawing plan that its record of what is held does not show (7.3.1): no word for it — never "done"
                beside a note saying how much of the mix is held; the segment fills to that share */}
            {sg.state !== 'part' && <>{' · '}{sg.state === 'now' ? words.now : sg.key === 'saving' && sg.month ? fill(words.to, { month: sg.month }) : sg.state === 'done' ? words.done : words.later}</>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function LifeLine({ example = null, stages = null, words, testid }) {
  if (example) return <Explainer example={example} words={words} />;
  if (Array.isArray(stages) && stages.length) return <Strip stages={stages} words={words} testid={testid} />;
  return null;
}
