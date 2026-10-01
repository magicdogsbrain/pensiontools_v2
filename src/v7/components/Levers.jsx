/**
 * B's "Ways to make it fit" (step 4 brief 4.13, conflict 36; screens-A-B.md 4.2): the five levers, each on its own,
 * side by side — cards that stack on a phone and sit two or more abreast from 700 up. [data-levers] holds one
 * [data-lever="<id>"] per lever the answer found (a null lever is not drawn), in the brief's order.
 *
 * Each card: the lever's name, the answer's own sentence for it (b.lever.*), and "Try", which puts that lever's
 * value into the boxes (draft/set) so the answer is worked out again. "Accept the chance" has no button: it states
 * the bad-case pot and what it pays, without ranking it. The values put in the boxes are the answer's figures,
 * written as text — nothing is worked out here.
 *
 * For two people the pay-in the levers name is the household's; which of you pays it in is not something one box
 * can say, so "Pay in more" has no "Try" for a couple (the pay-in row of "Try a change" moves your part). "More risk
 * while saving" has no "Try" when it does not help (its sentence says so).
 */
import { Sentence } from './Sentence.jsx';
import { Button, LinkButton } from './Button.jsx';
import { href } from '../router/routes.js';
import { money } from '../../answers/shared/format.js';
import { B } from '../copy/b.js';

export const LEVERS = ['stopLater', 'payMore', 'spendLess', 'moreRisk', 'accept'];

const set = (path, value) => ({ type: 'draft/set', q: 'b', path, value });
const pounds = (n) => money(n).slice(1);

/** The draft/set actions a lever's "Try" sends, or null when it has no button. */
export function leverActions(id, result) {
  const L = result.levers || {};
  const couple = !!(result.inputs && result.inputs.household === 'couple');
  const lever = L[id];
  if (!lever) return null;
  if (id === 'stopLater' && typeof lever.age === 'number') return [set('stop.age', String(lever.age))];
  // The figure first, then the choice it belongs to: no step in between is a draft that does not parse.
  // "Pay in more" may need savings a month too (the years before a pension opens): both go in, so asking again gives
  // the lever's own figures.
  if (id === 'payMore' && typeof lever.payIn === 'number' && !couple) {
    return [set('you.payIn.total', pounds(lever.payIn)), set('you.payIn.kind', 'total'), ...(typeof lever.savingsIn === 'number' ? [set('savingsIn', pounds(lever.savingsIn))] : [])];
  }
  if (id === 'spendLess' && typeof lever.spend === 'number') return [set('spend.amount', pounds(lever.spend)), set('spend.kind', 'amount')];
  // "More risk while saving" that does not lower what has to go in is said, not offered: no "Try".
  if (id === 'moreRisk' && typeof lever.level === 'string' && lever.helps !== false) return [set('savingRisk', lever.level)];
  return null;
}

export function Levers({ result, dispatch }) {
  const L = result && result.levers;
  if (!L) return null;
  const t = B.answer;
  const s = (result.sentences && result.sentences.lever) || {};
  // A lever the answer found is a card with its "Try"; one it found nothing for but wrote a sentence about (stopping
  // later, even ten years on, did not get there: sentences.lever.stopLaterNone) is said too, as a card with no button
  // ([data-lever-none]).
  const noneSentence = (id) => s[`${id}None`] || s[id];
  const shown = LEVERS.filter((id) => L[id] || (L[id] === null && noneSentence(id)));
  if (!shown.length) return null;
  return (
    <section class="block levers" aria-labelledby="levers-title">
      <h2 id="levers-title">{t.leversTitle}</h2>
      <p class="note">{t.leversNote}</p>
      <ul class="lever-list" data-levers>
        {shown.map((id) => {
          const found = !!L[id];
          const actions = id === 'accept' || !found ? null : leverActions(id, result);
          return (
            <li key={id} class={`lever lever-${id}${found ? '' : ' is-none'}`} data-lever={found ? id : undefined} data-lever-none={found ? undefined : id}>
              <h3 class="lever-name">{t.lever[id]}</h3>
              {(found ? s[id] : noneSentence(id)) && <Sentence s={found ? s[id] : noneSentence(id)} source={result} class="lever-line" />}
              {actions && (
                <Button testid={`b.lever.${id}.try`} aria-label={t.tryLever.replace('{name}', t.lever[id])} onClick={() => actions.forEach((a) => dispatch(a))}>
                  {B.buttons.tryLever}
                </Button>
              )}
            </li>
          );
        })}
      </ul>
      <p class="levers-two"><LinkButton testid="b.action.choices" href={href.step('b', 'choices')}>{B.buttons.tryTwo}</LinkButton></p>
    </section>
  );
}
