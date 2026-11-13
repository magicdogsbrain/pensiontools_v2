/**
 * The page around an answer (7.5.0; research/v7/mockups/first-visit.html screens 2 and 3): the answers are worked out as
 * before; what changes is how they meet the person.
 *
 *   <AnswerSlider slider dispatch>…</AnswerSlider>
 *                                        the one control that makes the answer feel alive: it moves the same box the form
 *                                        has (draft/set), so the answer is worked out again as a typed change would be; it
 *                                        sends the range it is drawn with, held while it moves (state/reduce.js). What it
 *                                        changes, where that is not the picture (C's "Taking £… a month"), is drawn under it
 *   <FigureTiles q source tiles countKey />  the three figures the answer already gives, the first in pink; they count up to
 *                                        their value when the figures shown change (countKey: state/pictures.js tilesKey —
 *                                        the result on screen, never the inputs being worked out)
 *   <KeepLine state q />                 "Keep this as a plan": to the question's own Keep step, the one create path; the
 *                                        account is asked for there and nowhere earlier
 *
 * Every figure is the answer's (Money); the slider's range and value are state/pictures.js answerSlider's. Draws only.
 */
import { Money } from './Money.jsx';
import { withFixedCounts } from './MadeOf.jsx';
import { Counted } from './Motion.jsx';
import { LinkButton } from './Button.jsx';
import { money, pctText } from '../../answers/shared/format.js';
import { keepView } from '../state/select.js';
import { href } from '../router/routes.js';
import { PICTURE } from '../copy/picture.js';

const fill = (text, values) => String(text).replace(/\{(\w+)\}/g, (m, k) => (k in values ? values[k] : m));
/** A figure as the box takes it: whole pounds with commas, a share of pay as typed ("8.5"). */
const boxText = (unit, v) => (unit === 'pct' ? String(Math.round(v * 100) / 100) : String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, ','));
const valueText = (unit, v) => (unit === 'pct' ? pctText(v) : money(v));

export function AnswerSlider({ slider: S, dispatch, children = null, stale = false }) {
  if (!S) return null;
  // a box of the shell's own (data-shell-box): it writes the same field the form has, so the input list is unchanged
  const id = `${S.q}.slider.input`;
  const at = S.max > S.min ? ((S.value - S.min) / (S.max - S.min)) * 100 : 0;
  const label = fill(PICTURE.slider[S.words], { employer: S.slots && S.slots.employer != null ? String(S.slots.employer) : '' });
  const shown = valueText(S.unit, S.value);
  const hold = { min: S.min, max: S.max, step: S.step };
  const set = (e) => dispatch({ type: 'draft/set', q: S.q, path: S.path, value: boxText(S.unit, Number(e.currentTarget.value)), hold });
  return (
    <div class={`answer-slider is-${S.q}`} data-testid={`${S.q}.slider`} data-path={S.path}>
      {/* the figure beside the label is for the eye: the slider's own aria-valuetext says it, once, as it moves */}
      <div class="slider-head">
        <label for={id}>{label}</label>
        <span class="slider-value" data-testid={`${S.q}.slider.value`} aria-hidden="true">{shown}</span>
      </div>
      <input type="range" id={id} data-testid={id} data-shell-box="slider" min={S.min} max={S.max} step={S.step} value={S.value}
        aria-valuetext={shown} aria-describedby={`${S.q}.slider.hint`} style={`--at:${at.toFixed(2)}%`} onInput={set} />
      <div class="slider-scale" aria-hidden="true">{S.scale.map((v) => <span key={v}>{valueText(S.unit, v)}</span>)}</div>
      <p class="sr-only" id={`${S.q}.slider.hint`}>{PICTURE.slider.hint}</p>
      {children && <div class={`slider-result${stale ? ' is-stale' : ''}`} aria-live="polite" data-testid={`${S.q}.slider.result`}>{children}</div>}
    </div>
  );
}

/**
 * A tile's words, its {age} drawn as the answer's own figure (Money, by the key the tile names), and each other slot
 * ({careful}, {bold}: `slots`, a pot key each) the same way.
 */
function tileWords(t, source) {
  const text = PICTURE.tiles[t.words || t.id];
  const keys = { ...(t.ageKey ? { age: [t.ageKey, 'age'] } : {}), ...Object.fromEntries(Object.entries(t.slots || {}).map(([n, k]) => [n, [k, 'pot']])) };
  // the fixed counts of the words ("9 futures out of 10") are marked as such, as every key line marks them
  return <>{text.split(/(\{\w+\})/).map((piece, i) => {
    const slot = /^\{(\w+)\}$/.exec(piece);
    return slot && keys[slot[1]] ? <Money key={i} source={source} k={keys[slot[1]][0]} kind={keys[slot[1]][1]} /> : withFixedCounts(piece);
  })}</>;
}

export function FigureTiles({ q, source, tiles, countKey }) {
  if (!source || !Array.isArray(tiles) || tiles.length === 0) return null;
  const words = (t) => tileWords(t, source);
  return (
    <Counted key={countKey} as="ul" class="fig-tiles" data-testid={`${q}.tiles`} aria-label={PICTURE.tiles.label}>
      {tiles.map((t) => (
        <li key={t.id} class={`fig-tile${t.pop ? ' is-pop' : ''}`} data-tile={t.id}>
          <Money source={source} k={t.k} kind={t.kind} class="fig-n" />
          <span class="fig-l">{words(t)}</span>
        </li>
      ))}
    </Counted>
  );
}

export function KeepLine({ state, q }) {
  const v = keepView(state, q);
  // once a plan is kept from here, the panel at the foot leads with opening it: no second way to keep above it
  if (v.made) return null;
  return (
    <div class="keep-line" data-testid={`${q}.keepLine`}>
      <LinkButton testid={`${q}.keepLine.keep`} kind="pop" href={href.step(q, 'keep')}>{v.useIn ? PICTURE.keep.use : PICTURE.keep.keep}</LinkButton>
      <span class="note">{PICTURE.keep.line}</span>
    </div>
  );
}
