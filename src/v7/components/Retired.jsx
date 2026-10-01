/**
 * "This question is for people who are still working" (screens-A-B.md 6.4; step 4 brief conflict 44): drawn on any
 * step of A or B when the draft describes someone who has stopped — the stop age is today's age or earlier and the
 * State Pension is already being paid. The route stays the step it is; the screen root carries data-view="retired".
 * Nothing here is a countdown or a stop-work date: it passes the `retired` scope of the banned list.
 *
 *   isRetired(state, q)          the shell's pure reader (src/v7/state/select.js), for the screens' one import list
 *   <Retired q dispatch />       the two ways on: "Will it last?" (question D, not in the preview yet) and
 *                                "That's wrong — I'm working", which empties the age in mind and puts the keyboard in it
 */
import { isRetired as retiredReader } from '../state/select.js';
import { LinkButton } from './Button.jsx';
import { href } from '../router/routes.js';
import { A } from '../copy/a.js';
import { B } from '../copy/b.js';

const COPY = { a: A, b: B };

/** Whether A's or B's retired view is due. The rule is the shell's (alreadyStopped over the draft); the screen asks it. */
export function isRetired(state, q) {
  return !!retiredReader(state, q);
}

export function Retired({ q, dispatch }) {
  const words = COPY[q];
  const set = (path, value) => dispatch({ type: 'draft/set', q, path, value });
  const working = () => {
    if (q === 'a') set('stop.kind', 'age');
    set('stop.age', '');
  };
  return (
    <>
      <h1 tabIndex={-1}>{words.retired.title}</h1>
      <p class="lead">{words.retired.body}</p>
      <div class="actions-row">
        <LinkButton testid={`${q}.action.willItLast`} kind="primary" href={href.soon('d')}>{words.buttons.willItLast}</LinkButton>
        <LinkButton testid={`${q}.action.imWorking`} href={href.step(q, 'numbers', 'stop.age')} onClick={working}>{words.buttons.imWorking}</LinkButton>
      </div>
      <p class="note">{words.retired.note}</p>
    </>
  );
}
