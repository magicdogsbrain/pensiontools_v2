/**
 * The rail of a saved plan (research/v7/your-plan.md 1.3; rail-screens-language.md 1.7): the plan's steps for its life
 * stage, a mark against each, the one-line result under each, and the one next sentence with its button. On a phone it
 * is one line that opens. A saver's steps kept for later sit under "For later", unmarked (saving-enough-and-check-in.md
 * 4.1). Since 7.3.0 its first link goes back to the plan's home, its "Next" is the home's first to-do (read.js dueFor),
 * and "Ask a question" lives on the home, folded away (never pushed on a page of the plan). Draws only: the steps, their
 * state and the next sentence are read.js's (state/select.js planView).
 */
import { Button, LinkButton } from './Button.jsx';
import { PlanSentence, fill, stepNameOf } from './PlanFigures.jsx';
import { href } from '../router/routes.js';
import { PLAN } from '../copy/plan.js';
import { HOME } from '../copy/home.js';

const MARK = { current: '›', done: '✓', open: '○' };

export function PlanRail({ view, state, dispatch, onChange }) {
  if (!view || !view.found) return null;
  const words = PLAN.page;
  const open = !!state.ui.railOpen;
  const current = view.steps.find((s) => s.state === 'current') || view.steps[0];
  const setOpen = (o) => dispatch({ type: 'ui/rail', open: o });
  const onKeyDown = (e) => { if (e.key === 'Escape' && open) setOpen(false); };
  const stepName = (s) => stepNameOf(s.id, view);
  const next = view.next || { id: 'P.saving', slots: {}, button: null };
  // `words`: a to-do's own words where its sentence differs (the move to the tax year recorded months begin in, 7.4.3)
  const sentence = fill(PLAN.next[next.words || next.id] || PLAN.next[next.id] || '', next.slots);
  const b = next.button;
  // one step of the rail: a step kept for later carries no mark until it is current or done (and says "For later" to a
  // reader). A plain function, not a component made in here: a component type made afresh on every draw would have Preact
  // throw the rail's links away and make new ones each time, and a keyboard user would lose their place on the rail.
  const stepItem = (s) => {
    const later = s.later && s.state === 'open';
    // a locked plan's step not done carries no mark (7.3.0): the plan is being carried out, not filled in
    const unmarked = later || (s.unmarked === true && s.state === 'open');
    return (
      <li key={s.id} class={`rail-step is-${s.state}${s.listed ? '' : ' is-unlisted'}${s.later ? ' is-later' : ''}`}>
        <a href={href.plan(view.id, s.id)} data-testid={`rail.plan.${s.id}`} aria-current={s.state === 'current' ? 'step' : undefined} onClick={() => { if (open) setOpen(false); }}>
          <span class="rail-mark" aria-hidden="true">{unmarked ? '' : (MARK[s.state] || MARK.open)}</span>
          {!(unmarked && !later) && <span class="sr-only">{later ? words.marks.later : (words.marks[s.state] || words.marks.open)}: </span>}
          <span class="rail-label">{stepName(s)}{s.optional && !s.later && <span class="rail-optional"> ({words.optional})</span>}</span>
        </a>
        {(s.railResult || s.result) && <p class="rail-result"><PlanSentence s={s.railResult || s.result} figures={s.figures} /></p>}
      </li>
    );
  };
  return (
    <nav class={`rail plan-rail${open ? ' is-open' : ''}`} aria-label={words.railNav} data-region="rail" onKeyDown={onKeyDown}>
      <p class="rail-title">{words.railTitle}</p>
      <button type="button" class="rail-line" data-testid="rail.line" aria-expanded={open ? 'true' : 'false'} aria-controls="rail-sheet" onClick={() => setOpen(!open)}>
        <span class="rail-line-text">{fill(words.position, { step: PLAN.steps[current.id].short })}</span>
        <span class="rail-chevron" aria-hidden="true">{open ? '▴' : '▾'}</span>
      </button>
      <div id="rail-sheet" class="rail-sheet">
        <div class="rail-sheet-head">
          <span class="rail-sheet-title">{words.railTitle}</span>
          <Button testid="rail.close" kind="quiet" onClick={() => setOpen(false)}>{words.close}</Button>
        </div>
        {/* back to the plan's home (7.3.0): what is due and where you are */}
        <a class="rail-home" href={href.plan(view.id)} data-testid="rail.home" onClick={() => { if (open) setOpen(false); }}>‹ {HOME.railHome}</a>
        <ol class="rail-steps">
          {view.steps.filter((s) => !s.later).map(stepItem)}
        </ol>
        {/* a saver's steps kept for later (research/saving-enough-and-check-in.md 4.1): open to anyone, never "Not done yet" */}
        {view.steps.some((s) => s.later) && (
          <>
            <p class="rail-later-title" data-testid="rail.later">{words.laterTitle}</p>
            <ul class="rail-steps rail-later">
              {view.steps.filter((s) => s.later).map(stepItem)}
            </ul>
          </>
        )}
        <p class="rail-next" data-testid="rail.next">
          <span data-next>{sentence}</span>
          {b && !b.href && <> <Button testid="rail.next.button" kind="quiet" onClick={() => { if (open) setOpen(false); onChange(b.place, b.planId || view.id, b.month); }}>{fill(PLAN.buttons[b.id] || b.id, b.slots)}</Button></>}
          {b && b.href && <> <LinkButton testid="rail.next.button" kind="quiet" href={b.href}>{fill(PLAN.buttons[b.id] || b.id, b.slots)}</LinkButton></>}
        </p>
      </div>
    </nav>
  );
}
