/**
 * The rail: the steps of the question on screen, in order, with a mark against each, the short result under a
 * finished step, and one sentence that says what to do next. There is no other navigation between steps.
 * Every step is an ordinary link. On a phone it is one line under the header that opens as a sheet; the next
 * sentence and its button sit inside the sheet (under the steps), so with the sheet closed the answer's headline
 * sits above the fold.
 *
 * What to show is worked out by the rail's own pure function (src/v7/rail/index.js); this component only draws it
 * and its words (copy/<q>.js, for whichever question the rail is for). Words-only rules live here: on a step that
 * is not in the preview yet the next line says so and points back to the answer; a button that leads to such a step
 * says so too; "check the figure marked below" is said only while a figure IS marked; A's answer step is named by
 * the age typed ("Could I stop at 60?"); and A's "the earliest age that worked is {earliest}" names the answer's age.
 */
import { railFor } from '../rail/index.js';
import { errorsToShow, parsedDraft, keepView } from '../state/select.js';
import { ageText } from '../../answers/shared/format.js';
import { Sentence } from './Sentence.jsx';
import { Button, LinkButton } from './Button.jsx';
import { href } from '../router/routes.js';
import { C } from '../copy/c.js';
import { A } from '../copy/a.js';
import { B } from '../copy/b.js';

const COPY = { a: A, b: B, c: C };
const MARK = { current: '›', done: '✓', open: '○' };

/** A button's words by its label id: "a.action.show" → buttons.show; "a.next.c" → buttons['next.c']. */
export function labelFor(q, labelId) {
  const words = (COPY[q] || C).buttons;
  const id = String(labelId || '');
  return words[id.replace(new RegExp(`^${q}\\.action\\.`), '')] || words[id.replace(new RegExp(`^${q}\\.`), '')] || null;
}

/**
 * The label of a step, in the question's words. A's answer step follows what was typed: "Could I stop at 60?" with
 * an age in mind, "Which ages could I stop at?" with "show me ages", "Could I stop?" before either.
 */
export function stepLabel(state, q, step) {
  const words = (COPY[q] || C).steps[step] || {};
  if (q !== 'a' || step !== 'answer') return words.label || '';
  const values = parsedDraft(state, 'a').values;
  const kind = values['stop.kind'] || (state.draft.a && state.draft.a.values['stop.kind']);
  if (kind === 'ages') return words.labelAges;
  const age = values['stop.age'];
  return typeof age === 'number' ? words.label.replace('{age}', ageText(age)) : words.labelNone;
}

/** The next sentence in words, with the answer's own age where A names one. */
function nextWords(state, q, id, marked) {
  const words = (COPY[q] || C).next;
  if (id === `${q}.fix` && !marked) return words[`${q}.fix.unmarked`] || words[id] || '';
  // "Save this as a plan?" with an answer that cannot be saved: back to it
  if (id === `${q}.keep` && !keepView(state, q).can) return words[`${q}.keep.not`] || words[id] || '';
  if (id === 'b.choices') {
    const r = state.answers.b && state.answers.b.result;
    return r && r.inputs && r.inputs.household === 'couple' ? words['b.choices.couple'] : words[id];
  }
  if (id === 'a.no') {
    const r = state.answers.a && state.answers.a.result;
    const earliest = r && r.earliest && typeof r.earliest.yes === 'number' ? r.earliest.yes : null;
    return earliest === null ? words['a.no.later'] : words['a.no'].replace('{earliest}', ageText(earliest));
  }
  return words[id] || '';
}

export function Rail({ state, dispatch }) {
  const rail = railFor(state);
  if (!rail || !rail.question) return null;
  const q = rail.question;
  const words = COPY[q] || C;
  const open = !!state.ui.railOpen;
  const current = rail.steps.find((s) => s.state === 'current') || rail.steps[0];
  const position = words.rail.position.replace('{n}', String(rail.position.n)).replace('{of}', String(rail.position.of));
  const setOpen = (o) => dispatch({ type: 'ui/rail', open: o });
  const onKeyDown = (e) => { if (e.key === 'Escape' && open) setOpen(false); };
  const next = rail.next || {};
  const button = next.button;
  // A link to a step that is not in the preview yet says so on the button, so nobody is sent to a dead end unwarned.
  const leadsToUnbuilt = !!(button && button.href && rail.steps.some((s) => !s.built && s.href === button.href));
  const buttonLabel = button && (leadsToUnbuilt && button.labelId === `${q}.action.keep` ? words.buttons.keepNotYet : labelFor(q, button.labelId));
  const marked = Object.keys(errorsToShow(state, q)).length > 0;
  const sentence = !current.built ? words.next.unbuilt : nextWords(state, q, next.id, marked);
  const answerResult = state.answers[q] && state.answers[q].result;

  return (
    <nav class={`rail${open ? ' is-open' : ''}`} aria-label={words.rail.nav} data-region="rail" onKeyDown={onKeyDown}>
      <p class="rail-title">{words.title}</p>
      <button type="button" class="rail-line" data-testid="rail.line" aria-expanded={open ? 'true' : 'false'} aria-controls="rail-sheet" onClick={() => setOpen(!open)}>
        <span class="rail-line-text">{position} {words.steps[current.id].short}</span>
        <span class="rail-chevron" aria-hidden="true">{open ? '▴' : '▾'}</span>
      </button>
      <div id="rail-sheet" class="rail-sheet">
        <div class="rail-sheet-head">
          <span class="rail-sheet-title">{words.title}</span>
          <Button testid="rail.close" kind="quiet" onClick={() => setOpen(false)}>{words.rail.close}</Button>
        </div>
        <ol class="rail-steps">
          {rail.steps.map((s, i) => (
            <li key={s.id} class={`rail-step is-${s.state}${s.built ? '' : ' is-unbuilt'}`}>
              <a href={s.href} data-testid={`rail.${q}.${s.id}`} aria-current={s.state === 'current' ? 'step' : undefined} onClick={() => { if (open) setOpen(false); }}>
                <span class="rail-mark" aria-hidden="true">{MARK[s.state] || MARK.open}</span>
                <span class="sr-only">{words.rail.marks[s.state] || words.rail.marks.open}: </span>
                <span class="rail-n" aria-hidden="true">{i + 1}</span>
                <span class="rail-label">{stepLabel(state, q, s.id)}{s.optional && <span class="rail-optional"> ({words.rail.optional})</span>}</span>
              </a>
              {s.result && <p class="rail-result"><Sentence as="span" s={s.result} source={s.source} keyed={!!s.source && s.source === answerResult} /></p>}
            </li>
          ))}
        </ol>
        <p class="rail-next" data-testid="rail.next">
          <span data-next>{sentence}</span>
          {button && buttonLabel && (button.href
            ? <> <LinkButton testid="rail.next.button" kind="quiet" href={button.href} onClick={() => { if (open) setOpen(false); }}>{buttonLabel}</LinkButton></>
            : <> <Button testid="rail.next.button" kind="quiet" onClick={() => { if (open) setOpen(false); dispatch(button.action); }}>{buttonLabel}</Button></>)}
        </p>
        <p class="rail-another"><a href={href.front()}>{words.rail.another}</a></p>
      </div>
    </nav>
  );
}
