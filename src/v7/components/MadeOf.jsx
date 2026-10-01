/**
 * "What it is made of": one line for each stretch of years in which the income is the same, then the three
 * amounts (careful, middling, good) — all sentences the answer wrote — and under them a one-line key saying what
 * careful, middling and good mean. Opens and closes on a phone (ui.open 'madeOf'); always open on a wider screen.
 *
 * Question C draws it as it is. A draws the same block as "The years before your State Pension" with its own lines
 * (sentences.pays and the savings the closed years need): pass `q`, `title`, `note`, `lines` and `after`.
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

export function MadeOf({ result, open, dispatch, q = 'c', title, note, lines: given, after }) {
  const s = result && result.sentences;
  const lines = given || (s && s.madeOf) || [];
  const range = q === 'c' && s && s.range;
  if (!lines.length && !range && !after) return null;
  return (
    <section class="block collapsible made-of" data-open={open ? '1' : '0'}>
      <h2 class="block-title">
        <Button testid={`${q}.toggle.madeOf`} kind="toggle" aria-expanded={open ? 'true' : 'false'} aria-controls="made-of-body" onClick={() => dispatch({ type: 'ui/toggle', id: 'madeOf' })}>
          {title || C.answer.madeOfTitle}
        </Button>
      </h2>
      <div id="made-of-body" class="collapsible-body">
        <p class="note">{note || C.answer.madeOfNote}</p>
        <ul class="made-of-list">
          {lines.map((line, i) => <li key={line.id + i}><Sentence as="span" s={line} source={result} /></li>)}
        </ul>
        {after}
        {range && <Sentence s={s.range} source={result} class="range" />}
        {range && <p class="note range-key" data-testid="c.madeOf.key">{withFixedCounts(C.answer.rangeKey)}</p>}
      </div>
    </section>
  );
}
