/**
 * The rail: the steps of the question on screen, in order, with a mark against each, the short result under a
 * finished step, and one sentence that says what to do next. There is no other navigation between steps.
 * Every step is an ordinary link. On a phone it is one line under the header that opens as a sheet; the next
 * sentence and its button sit inside the sheet (under the steps), so with the sheet closed the answer's headline
 * sits above the fold.
 *
 * What to show is worked out by the rail's own pure function (src/v7/rail/index.js, package 3); this component
 * only draws it and its words (copy/c.js). Three words-only rules live here: on a step that is not in the preview
 * yet the next line says so and points back to the answer; a button that leads to such a step says so too; and
 * "check the figure marked below" is said only while a figure IS marked — with an empty box not yet left, the line
 * asks for it to be filled in.
 */
import { railFor } from '../rail/index.js';
import { errorsToShow } from '../state/select.js';
import { Sentence } from './Sentence.jsx';
import { Button, LinkButton } from './Button.jsx';
import { href } from '../router/routes.js';
import { C } from '../copy/c.js';

const MARK = { current: '›', done: '✓', open: '○' };
const labelFor = (labelId) => C.buttons[String(labelId || '').replace(/^c\.action\./, '')] || null;

export function Rail({ state, dispatch }) {
  const rail = railFor(state);
  if (!rail || !rail.question) return null;
  const open = !!state.ui.railOpen;
  const current = rail.steps.find((s) => s.state === 'current') || rail.steps[0];
  const position = C.rail.position.replace('{n}', String(rail.position.n)).replace('{of}', String(rail.position.of));
  const setOpen = (o) => dispatch({ type: 'ui/rail', open: o });
  const onKeyDown = (e) => { if (e.key === 'Escape' && open) setOpen(false); };
  const next = rail.next || {};
  const button = next.button;
  // A link to a step that is not in the preview yet says so on the button, so nobody is sent to a dead end unwarned.
  const leadsToUnbuilt = !!(button && button.href && rail.steps.some((s) => !s.built && s.href === button.href));
  const buttonLabel = button && (leadsToUnbuilt && button.labelId === 'c.action.keep' ? C.buttons.keepNotYet : labelFor(button.labelId));
  const marked = Object.keys(errorsToShow(state, 'c')).length > 0;
  const sentence = !current.built ? C.next.unbuilt : next.id === 'c.fix' && !marked ? C.next['c.fix.unmarked'] : (C.next[next.id] || '');

  return (
    <nav class={`rail${open ? ' is-open' : ''}`} aria-label={C.rail.nav} data-region="rail" onKeyDown={onKeyDown}>
      <p class="rail-title">{C.title}</p>
      <button type="button" class="rail-line" data-testid="rail.line" aria-expanded={open ? 'true' : 'false'} aria-controls="rail-sheet" onClick={() => setOpen(!open)}>
        <span class="rail-line-text">{position} {C.steps[current.id].short}</span>
        <span class="rail-chevron" aria-hidden="true">{open ? '▴' : '▾'}</span>
      </button>
      <div id="rail-sheet" class="rail-sheet">
        <div class="rail-sheet-head">
          <span class="rail-sheet-title">{C.title}</span>
          <Button testid="rail.close" kind="quiet" onClick={() => setOpen(false)}>{C.rail.close}</Button>
        </div>
        <ol class="rail-steps">
          {rail.steps.map((s, i) => (
            <li key={s.id} class={`rail-step is-${s.state}${s.built ? '' : ' is-unbuilt'}`}>
              <a href={s.href} data-testid={`rail.c.${s.id}`} aria-current={s.state === 'current' ? 'step' : undefined} onClick={() => { if (open) setOpen(false); }}>
                <span class="rail-mark" aria-hidden="true">{MARK[s.state] || MARK.open}</span>
                <span class="sr-only">{C.rail.marks[s.state] || C.rail.marks.open}: </span>
                <span class="rail-n" aria-hidden="true">{i + 1}</span>
                <span class="rail-label">{C.steps[s.id].label}{s.optional && <span class="rail-optional"> ({C.rail.optional})</span>}</span>
              </a>
              {s.result && <p class="rail-result"><Sentence as="span" s={s.result} source={s.source} keyed={!!s.source && s.source === state.answers.c.result} /></p>}
            </li>
          ))}
        </ol>
        <p class="rail-next" data-testid="rail.next">
          <span data-next>{sentence}</span>
          {button && buttonLabel && (button.href
            ? <> <LinkButton testid="rail.next.button" kind="quiet" href={button.href} onClick={() => { if (open) setOpen(false); }}>{buttonLabel}</LinkButton></>
            : <> <Button testid="rail.next.button" kind="quiet" onClick={() => { if (open) setOpen(false); dispatch(button.action); }}>{buttonLabel}</Button></>)}
        </p>
        <p class="rail-another"><a href={href.front()}>{C.rail.another}</a></p>
      </div>
    </nav>
  );
}
