/**
 * The rail of a saved plan (research/v7/your-plan.md 1.3; rail-screens-language.md 1.7): the plan's steps for its life
 * stage, a mark against each, the one-line result under each, and the one next sentence with its button. On a phone it
 * is one line that opens. Draws only: the steps, their state and the next sentence are read.js's (state/select.js planView).
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
          {view.steps.map((s) => (
            <li key={s.id} class={`rail-step is-${s.state}${s.listed ? '' : ' is-unlisted'}`}>
              <a href={href.plan(view.id, s.id)} data-testid={`rail.plan.${s.id}`} aria-current={s.state === 'current' ? 'step' : undefined} onClick={() => { if (open) setOpen(false); }}>
                <span class="rail-mark" aria-hidden="true">{MARK[s.state] || MARK.open}</span>
                <span class="sr-only">{words.marks[s.state] || words.marks.open}: </span>
                <span class="rail-label">{stepName(s)}{s.optional && <span class="rail-optional"> ({words.optional})</span>}</span>
              </a>
              {s.result && <p class="rail-result"><PlanSentence s={s.result} figures={s.figures} /></p>}
            </li>
          ))}
        </ol>
        <p class="rail-next" data-testid="rail.next">
          <span data-next>{sentence}</span>
          {b && !b.href && <> <Button testid="rail.next.button" kind="quiet" onClick={() => { if (open) setOpen(false); onChange(b.place, b.planId || view.id); }}>{fill(PLAN.buttons[b.id] || b.id, b.slots)}</Button></>}
          {b && b.href && <> <LinkButton testid="rail.next.button" kind="quiet" href={b.href}>{fill(PLAN.buttons[b.id] || b.id, b.slots)}</LinkButton></>}
        </p>
        <p class="rail-another">{words.askTitle}: {view.askLinks.map((q, i) => <span key={q}>{i > 0 ? ' · ' : ''}<a href={href.step(q, 'numbers')}>{words.ask[q]}</a></span>)}</p>
      </div>
    </nav>
  );
}
