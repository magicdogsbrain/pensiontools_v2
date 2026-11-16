/**
 * "Sorry, we could not work that out." — no technical words, no codes, no blame. The figures typed are shown so
 * the visitor can see they are safe, with two ways on: try again, or change the numbers. For A and B the summary
 * also names the age in mind, the spending and what goes in (screens-A-B.md 6.3) — read from the draft as typed.
 * `stale`: the page was opened before the site was updated and has loaded itself again once already (state/select.js
 * staleView): it says so, with "Reload the page" in place of "Try again", which could not mend it.
 */
import { C } from '../copy/c.js';
import { A } from '../copy/a.js';
import { B } from '../copy/b.js';
import { D } from '../copy/d.js';
import { COMMON } from '../copy/common.js';
import { money, ageText } from '../../answers/shared/format.js';
import { payInTypedOf } from '../state/select.js';
import { href } from '../router/routes.js';
import { Button, LinkButton } from './Button.jsx';

const COPY = { a: A, b: B, c: C, d: D };
const isNum = (v) => typeof v === 'number';

/** The figures typed, in the words of the question's summary line. */
function summary(q, v) {
  const t = (COPY[q] || C).answer.summary;
  const bits = [];
  // what goes in each month, whichever way it was typed (one figure, two parts, a share of pay): select.js payInTypedOf
  const paid = payInTypedOf(v, 'you');
  if (isNum(v['you.pot'])) bits.push(`${t.pot} ${money(v['you.pot'])}`);
  if (isNum(v['you.age'])) bits.push(`${t.age} ${ageText(v['you.age'])}`);
  if (q === 'b' && paid !== null) bits.push(`${money(paid)} ${t.in}`);
  if (q !== 'c') {
    if (v['stop.kind'] === 'ages') bits.push(t.ages);
    else if (q !== 'd' && isNum(v['stop.age'])) bits.push(`${t.stop} ${ageText(v['stop.age'])}`);
    if (v['spend.kind'] !== 'level' && isNum(v['spend.amount'])) bits.push(`${money(v['spend.amount'])} ${t.aMonth}`);
  }
  if (q === 'a' && paid !== null && paid > 0) bits.push(`${money(paid)} ${t.in}`);
  // C: what goes in each month, when "still paying in" is yes
  if (q === 'c' && v['you.payIn.has'] === 'yes' && paid !== null && paid > 0) bits.push(`${money(paid)} ${t.in}`);
  if (v.household === 'couple') bits.push(t.partner);
  return bits;
}

/** The page is older than the site, and has loaded itself again once already: the plain words and "Reload the page". */
export function StaleWords({ dispatch, testid = 'stale', figures = null }) {
  const W = COMMON.stale;
  return (
    <section class="problem stale-build" role="alert" aria-labelledby={`${testid}-title`} data-testid={testid}>
      <h2 id={`${testid}-title`}>{W.title}</h2>
      <p>{W.body}</p>
      {figures}
      <div class="actions-row">
        <Button testid={`${testid}.reload`} kind="primary" onClick={() => dispatch({ type: 'page/reload' })}>{W.reload}</Button>
      </div>
    </section>
  );
}

export function Problem({ form, dispatch, stale = false }) {
  const q = form.q || 'c';
  const t = (COPY[q] || C).answer;
  const bits = summary(q, form.parsed.values);
  if (stale) return <StaleWords dispatch={dispatch} testid={`${q}.stale`} figures={bits.length > 0 ? <><p>{t.failedBody}</p><p class="problem-figures">{bits.join(', ')}</p></> : null} />;
  return (
    <section class="problem" role="alert" aria-labelledby="problem-title">
      <h2 id="problem-title">{t.failedTitle}</h2>
      <p>{t.failedBody}</p>
      {bits.length > 0 && <p class="problem-figures">{bits.join(', ')}</p>}
      <div class="actions-row">
        <Button testid={`${q}.action.retry`} kind="primary" onClick={() => dispatch({ type: 'answer/retry', q })}>{(COPY[q] || C).buttons.retry}</Button>
        <LinkButton testid={`${q}.action.change`} href={href.step(q, 'numbers')}>{(COPY[q] || C).buttons.change}</LinkButton>
      </div>
    </section>
  );
}
