/**
 * A sentence the answer wrote — { id, text, parts } (build brief 4.3). Each figure in it is drawn by Money, so it
 * carries data-key and data-value; a count the answer itself wrote ({ fixed }) is marked data-fixed. A sentence the answer
 * marks (7.8.0, `mark`) carries data-weighted (a chance weighted by how long people live) or data-fixed="age" (a count to
 * one named age).
 *
 * `marks` ({ keys, finds }, src/reading/sentenceMarks.js) draws the figures of the fact register inside spans carrying
 * data-fact (lead4.md G1); the words are the same.
 *
 * `source` is what the keys of `parts` are paths into (the answer result, unless told otherwise). With `keyed`
 * false, or when a key does not hold a number, the sentence's own text is drawn as it stands — and, inside the
 * answer region, the render tests then see a digit with no data-value and say so.
 */
import { get } from '../../answers/shared/format.js';
import { Money } from './Money.jsx';
import { groupParts } from '../../reading/sentenceMarks.js';
import { Fact } from '../../reading/Mark.jsx';

/** One part drawn: a string as it is, a count the answer wrote [data-fixed], a figure through Money. */
const partNode = (p, i, source) => (typeof p === 'string' ? p
  : 'fixed' in p ? <span key={i} data-fixed>{String(p.fixed)}</span>
    : <Money key={i} source={source} k={p.key} kind={p.kind} />);

export function Sentence({ s, source, keyed = true, as: Tag = 'p', marks = null, ...rest }) {
  if (!s || typeof s.text !== 'string') return null;
  const parts = Array.isArray(s.parts) ? s.parts : null;
  const usable = keyed && parts && parts.every((p) => typeof p === 'string' || (p && 'fixed' in p) || (p && typeof get(source, p.key) === 'number'));
  // 7.8.0: a chance weighted by how long people live is [data-weighted]; the count to one named age beside it is
  // [data-fixed="age"] (a render test holds that the one never shows without the other in its block)
  const mark = s.mark === 'weighted' ? { 'data-weighted': '1' } : s.mark === 'fixed' ? { 'data-fixed': 'age' } : {};
  if (!usable) return <Tag {...rest} {...mark} data-sentence-id={s.id}>{s.text}</Tag>;
  // the figures of the fact register drawn marked (lead4.md G1; src/reading/sentenceMarks.js, the full view's the same)
  if (marks) {
    let n = 0;
    return (
      <Tag {...rest} {...mark} data-sentence-id={s.id}>
        {groupParts(parts, source, marks).map((g, gi) => {
          const nodes = g.items.map((x) => partNode(x.part, n++, source));
          return g.fact ? <Fact key={'g' + gi} id={g.fact}>{nodes}</Fact> : nodes;
        })}
      </Tag>
    );
  }
  return (
    <Tag {...rest} {...mark} data-sentence-id={s.id}>
      {parts.map((p, i) => partNode(p, i, source))}
    </Tag>
  );
}
