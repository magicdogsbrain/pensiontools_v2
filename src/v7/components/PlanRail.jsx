/**
 * The rail of a saved plan (research/v7/your-plan.md 1.3; rail-screens-language.md 1.7): the plan's steps for its life
 * stage, a mark against each, the one-line result under each, and the one next sentence with its button. On a phone it
 * is one line that opens. A saver's steps kept for later sit under "For later", unmarked (saving-enough-and-check-in.md
 * 4.1). Its "Ask a question" link to B opens B with the plan's figures in its boxes (4.1: the page's `askFill`, loaded by
 * draft/load). Draws only: the steps, their state and the next sentence are read.js's (state/select.js planView).
 */
import { Button, LinkButton } from './Button.jsx';
import { PlanSentence, fill } from './PlanFigures.jsx';
import { href } from '../router/routes.js';
import { PLAN } from '../copy/plan.js';

const MARK = { current: '›', done: '✓', open: '○' };

export function PlanRail({ view, state, dispatch, onChange }) {
  if (!view || !view.found) return null;
  const words = PLAN.page;
  const open = !!state.ui.railOpen;
  const current = view.steps.find((s) => s.state === 'current') || view.steps[0];
  const setOpen = (o) => dispatch({ type: 'ui/rail', open: o });
  const onKeyDown = (e) => { if (e.key === 'Escape' && open) setOpen(false); };
  const stepName = (s) => (s.id === 'plan' && view.locked ? PLAN.steps.plan.locked : PLAN.steps[s.id].label);
  const next = view.next || { id: 'P.saving', slots: {}, button: null };
  const sentence = fill(PLAN.next[next.id] || '', next.slots);
  const b = next.button;
  // one step of the rail: a step kept for later carries no mark until it is current or done (and says "For later" to a
  // reader). A plain function, not a component made in here: a component type made afresh on every draw would have Preact
  // throw the rail's links away and make new ones each time, and a keyboard user would lose their place on the rail.
  const stepItem = (s) => {
    const unmarked = s.later && s.state === 'open';
    return (
      <li key={s.id} class={`rail-step is-${s.state}${s.listed ? '' : ' is-unlisted'}${s.later ? ' is-later' : ''}`}>
        <a href={href.plan(view.id, s.id)} data-testid={`rail.plan.${s.id}`} aria-current={s.state === 'current' ? 'step' : undefined} onClick={() => { if (open) setOpen(false); }}>
          <span class="rail-mark" aria-hidden="true">{unmarked ? '' : (MARK[s.state] || MARK.open)}</span>
          <span class="sr-only">{unmarked ? words.marks.later : (words.marks[s.state] || words.marks.open)}: </span>
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
        {/* a question the plan can fill (B for a saver, saving-enough-and-check-in.md 4.1) opens with the plan's figures in its boxes */}
        <p class="rail-another">{words.askTitle}: {view.askLinks.map((q, i) => {
          const fillOf = view.askFill && view.askFill[q];
          // the load opens the question itself (draft/load sets the route, the address follows it): one move, one entry to go
          // back to; the plan's own mixes go with the figures when B's boxes can name them only by the nearest level, and the
          // person's fact of money taken flexibly when the plan carries it (a plan kept from the answer carries it on), and the
          // plan's id: trying figures there changes this plan only when the person presses "Use these in ‘…’" (6.59.0)
          const onAsk = fillOf ? (e) => { e.preventDefault(); if (open) setOpen(false); dispatch({ type: 'draft/load', q, values: fillOf.values, ...(fillOf.mixes ? { mixes: fillOf.mixes } : {}), ...(fillOf.flexibleAccess ? { flexibleAccess: fillOf.flexibleAccess } : {}), ...(q === 'b' && view.id ? { planId: String(view.id) } : {}) }); } : undefined;
          return <span key={q}>{i > 0 ? ' · ' : ''}<a href={href.step(q, 'numbers')} data-testid={`rail.ask.${q}`} data-filled={fillOf ? 'plan' : undefined} onClick={onAsk}>{words.ask[q]}</a></span>;
        })}</p>
      </div>
    </nav>
  );
}
