/**
 * "What it is made of": one line for each stretch of years in which the income is the same, then the three
 * amounts (careful, middling, good) — all sentences the answer wrote — and under them a one-line key saying what
 * careful, middling and good mean. Opens and closes on a phone (ui.open 'madeOf'); always open on a wider screen.
 *
 * The key's counts (9 out of 10, 5 out of 10, 1 in 10) are the answer's own definitions (BAND in
 * src/answers/shared/rules.js), so each is marked data-fixed like a count the answer wrote.
 */
import { Sentence } from './Sentence.jsx';
import { Button } from './Button.jsx';
import { C } from '../copy/c.js';

/** The words of the key with each run of digits in a data-fixed span (a count, not a figure to work out). */
export function withFixedCounts(text) {
  return String(text).split(/(\d+)/).map((piece, i) => (i % 2 ? <span key={i} data-fixed>{piece}</span> : piece));
}

export function MadeOf({ result, open, dispatch }) {
  const s = result && result.sentences;
  const lines = (s && s.madeOf) || [];
  if (!lines.length && !(s && s.range)) return null;
  return (
    <section class="block collapsible made-of" data-open={open ? '1' : '0'}>
      <h2 class="block-title">
        <Button testid="c.toggle.madeOf" kind="toggle" aria-expanded={open ? 'true' : 'false'} aria-controls="made-of-body" onClick={() => dispatch({ type: 'ui/toggle', id: 'madeOf' })}>
          {C.answer.madeOfTitle}
        </Button>
      </h2>
      <div id="made-of-body" class="collapsible-body">
        <p class="note">{C.answer.madeOfNote}</p>
        <ul class="made-of-list">
          {lines.map((line, i) => <li key={line.id + i}><Sentence as="span" s={line} source={result} /></li>)}
        </ul>
        {s.range && <Sentence s={s.range} source={result} class="range" />}
        {s.range && <p class="note range-key" data-testid="c.madeOf.key">{withFixedCounts(C.answer.rangeKey)}</p>}
      </div>
    </section>
  );
}
