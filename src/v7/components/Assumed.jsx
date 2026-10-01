/**
 * "What we assumed" (build brief 4.9): [data-assumed] holding one [data-assumed-id] line per entry of
 * result.assumed, in order — no more, no fewer. A line with a field links to the box that changes it
 * (#/<q>/numbers?focus=<field>, test id assumed.<id>.change).
 *
 * Above them, one line of the screen's own (no data-assumed-id: it is not one of the answer's assumptions) says
 * who the answer is for — "for you alone" or "for the two of you" — with the way to add or remove a partner
 * (#/<q>/numbers?focus=household), so a partner can be added from the answer.
 *
 * The lines a person could change are always shown; the rules the answer follows are behind "See all of them".
 * On a phone the whole block opens and closes (ui.open 'assumed'); on a wider screen it is always open.
 * `q` is the question (default C); the words are that question's.
 */
import { Sentence } from './Sentence.jsx';
import { Button } from './Button.jsx';
import { href } from '../router/routes.js';
import { C } from '../copy/c.js';
import { A } from '../copy/a.js';
import { B } from '../copy/b.js';

const COPY = { a: A, b: B, c: C };

export function Assumed({ result, open, all, dispatch, q = 'c' }) {
  const t = (COPY[q] || C).answer;
  const lines = (result && result.assumed) || [];
  const couple = !!(result && result.inputs && result.inputs.household === 'couple');
  const hasRules = lines.some((a) => a.source !== 'default');
  return (
    <section class="block collapsible assumed" data-open={open ? '1' : '0'} data-assumed>
      <h2 class="block-title">
        <Button testid={`${q}.toggle.assumed`} kind="toggle" aria-expanded={open ? 'true' : 'false'} aria-controls="assumed-body" onClick={() => dispatch({ type: 'ui/toggle', id: 'assumed' })}>
          {t.assumedTitle}
        </Button>
      </h2>
      <div id="assumed-body" class="collapsible-body">
        <p class="note">{t.assumedNote}</p>
        <ul class="assumed-list">
          <li class="is-default" data-assumed-household={couple ? 'couple' : 'single'}>
            <span>{couple ? t.assumedCouple : t.assumedSingle}</span>
            {' '}<a class="change" href={href.step(q, 'numbers', 'household')} data-testid={`${q}.action.household`}>{t.assumedChange}</a>
          </li>
          {lines.map((a) => (
            <li key={a.id} data-assumed-id={a.id} class={a.source === 'default' ? 'is-default' : 'is-rule'} hidden={a.source !== 'default' && !all ? true : undefined}>
              <Sentence as="span" s={a} source={result} />
              {a.field && <> <a class="change" href={href.step(q, 'numbers', a.field)} data-testid={`assumed.${a.id}.change`}>{t.assumedChange}</a></>}
            </li>
          ))}
        </ul>
        {hasRules && (
          <Button testid={`${q}.toggle.allAssumed`} kind="quiet" aria-expanded={all ? 'true' : 'false'} onClick={() => dispatch({ type: 'ui/toggle', id: 'allAssumed' })}>
            {all ? t.assumedFewer : t.assumedAll}
          </Button>
        )}
      </div>
    </section>
  );
}
