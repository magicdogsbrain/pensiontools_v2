/**
 * "Sorry, we could not work that out." — no technical words, no codes, no blame. The figures typed are shown so
 * the visitor can see they are safe, with two ways on: try again, or change the numbers.
 */
import { C } from '../copy/c.js';
import { money, ageText } from '../../answers/shared/format.js';
import { href } from '../router/routes.js';
import { Button, LinkButton } from './Button.jsx';

export function Problem({ form, dispatch }) {
  const v = form.parsed.values;
  const bits = [];
  if (typeof v['you.pot'] === 'number') bits.push(`${C.answer.summary.pot} ${money(v['you.pot'])}`);
  if (typeof v['you.age'] === 'number') bits.push(`${C.answer.summary.age} ${ageText(v['you.age'])}`);
  if (v.household === 'couple') bits.push(C.answer.summary.partner);
  return (
    <section class="problem" role="alert" aria-labelledby="problem-title">
      <h2 id="problem-title">{C.answer.failedTitle}</h2>
      <p>{C.answer.failedBody}</p>
      {bits.length > 0 && <p class="problem-figures">{bits.join(', ')}</p>}
      <div class="actions-row">
        <Button testid="c.action.retry" kind="primary" onClick={() => dispatch({ type: 'answer/retry', q: 'c' })}>{C.buttons.retry}</Button>
        <LinkButton testid="c.action.change" href={href.step('c', 'numbers')}>{C.buttons.change}</LinkButton>
      </div>
    </section>
  );
}
