/**
 * What the pot could be when you stop (step 4 brief 4.13: [data-pots]; screens-A-B.md 3.2, 4.2). All sentences the
 * answer wrote, pots to the nearest £1,000 (part kind 'pot'); the counts in the keys are the answer's own, marked
 * data-fixed.
 *
 *   A: "What you could spend from 60" — the three amounts (a.range), their key, then the pot at 60 (a.pot).
 *   B: "What the pot could be by 60" — at today's pay-in (b.pots.now) and at the pay-in that gets there
 *      (b.pots.needed), with the key for bad and good case.
 */
import { Sentence } from './Sentence.jsx';
import { Money } from './Money.jsx';
import { withFixedCounts } from './MadeOf.jsx';
import { A } from '../copy/a.js';
import { B } from '../copy/b.js';

export function Pots({ result, q }) {
  const s = (result && result.sentences) || {};
  if (q === 'a') {
    if (!s.range && !s.pot) return null;
    const t = A.answer;
    return (
      <section class="block pots" data-pots aria-labelledby="pots-title">
        <h2 id="pots-title">{t.rangeTitle} <Money source={result} k="shown.age" kind="age" /></h2>
        <p class="note">{t.rangeNote}</p>
        {s.range && <Sentence s={s.range} source={result} class="range" />}
        {s.range && <p class="note range-key" data-testid="a.pots.key">{withFixedCounts(t.rangeKey)}</p>}
        {s.pot && <Sentence s={s.pot} source={result} class="pot-line" />}
      </section>
    );
  }
  if (!s.potsNow) return null;
  const t = B.answer;
  return (
    <section class="block pots" data-pots aria-labelledby="pots-title">
      <h2 id="pots-title">{t.potsTitle} <Money source={result} k="stop.age" kind="age" /></h2>
      <p class="note">{t.potsNote}</p>
      <ul class="pots-list">
        <li><Sentence as="span" s={s.potsNow} source={result} /></li>
        {s.potsNeeded && <li><Sentence as="span" s={s.potsNeeded} source={result} /></li>}
      </ul>
      <p class="note" data-testid="b.pots.key">{withFixedCounts(t.potsKey)}</p>
    </section>
  );
}
