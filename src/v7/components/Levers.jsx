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
 *
 * "Pay in more" is what would be enough (research/saving-enough-and-check-in.md 3.5): for a share of pay, its "Try" writes
 * the share and keeps the kind (3.6). "A one-off sum now" puts the sum into the pot today — the very test the lever made.
 *
 * "Pay in more" on a pay-in entered as your part and your employer's (a report of 2 Nov 2026): the lever's figure
 * is what lands in the pension, the employer's part included, so your part becomes the rest of it and the employer's box
 * is left as typed. Written as one figure, as it was, the kept plan read the whole as your own — the employer's part was
 * lost and your part was entered as 0.8 of the whole (relief at source). Any entry that is not split stays one figure.
 * The writing is payInTo.js's, shared with the "Try a change" stepper and the grid's cells, which did the same.
 */
import { Sentence } from './Sentence.jsx';
import { Button, LinkButton } from './Button.jsx';
import { href } from '../router/routes.js';
import { money } from '../../answers/shared/format.js';
import { payInTo, asTyped } from './payInTo.js';
import { B } from '../copy/b.js';

export const LEVERS = ['stopLater', 'payMore', 'spendLess', 'oneOff', 'moreRisk', 'accept'];

const set = (path, value) => ({ type: 'draft/set', q: 'b', path, value });
const pounds = (n) => money(n).slice(1);

/** The draft/set actions a lever's "Try" sends, or null when it has no button. */
export function leverActions(id, result) {
  const L = result.levers || {};
  const couple = !!(result.inputs && result.inputs.household === 'couple');
  const lever = L[id];
  if (!lever) return null;
  // About your partner ("I've already stopped"; couples-different-years.md 5.3) the stop that moves is theirs.
  if (id === 'stopLater' && typeof lever.age === 'number') return [set(result.askedAbout === 'partner' ? 'partner.stop.age' : 'stop.age', String(lever.age))];
  // The figure first, then the choice it belongs to: no step in between is a draft that does not parse.
  // "Pay in more" may need savings a month too (the years before a pension opens): both go in, so asking again gives
  // the lever's own figures.
  if (id === 'payMore' && typeof lever.payIn === 'number' && !couple) {
    const savings = typeof lever.savingsIn === 'number' ? [set('savingsIn', pounds(lever.savingsIn))] : [];
    // a split entry keeps the employer's part: your part is the lever's figure less it (never below £0; the figure is never
    // below what goes in now); one figure stays one figure
    const p = (result.inputs && result.inputs.you && result.inputs.you.payIn) || null;
    // a share of pay keeps its kind: the lever's share is written (saving-enough-and-check-in.md 3.6)
    return [...payInTo('b', 'you', p, lever.payIn, typeof lever.ownPct === 'number' ? { ownPct: lever.ownPct } : null), ...savings];
  }
  // A one-off sum now (3.4): the pot today that much larger — exactly what the lever tried (a couple: each pension its part)
  if (id === 'oneOff' && typeof lever.amount === 'number') {
    const parts = Array.isArray(lever.byPerson) ? lever.byPerson : [{ who: 'you', amount: lever.amount }];
    return parts.map(({ who, amount }) => {
      const pot = result.inputs && result.inputs[who] && typeof result.inputs[who].pot === 'number' ? result.inputs[who].pot : 0;
      return set(`${who}.pot`, asTyped(pot + amount));
    });
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
              {/* 7.8.0, weighing: the way's own count to the plan-to age, beside its chance */}
              {found && s[`${id}Fixed`] && <Sentence s={s[`${id}Fixed`]} source={result} class="lever-fixed" />}
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
