/**
 * A sentence the answer wrote — { id, text, parts } (build brief 4.3). Each figure in it is drawn by Money, so it
 * carries data-key and data-value; a count the answer itself wrote ({ fixed }) is marked data-fixed. A sentence the answer
 * marks (7.8.0, `mark`) carries data-weighted (a chance weighted by how long people live) or data-fixed="age" (a count to
 * one named age).
 *
 * `source` is what the keys of `parts` are paths into (the answer result, unless told otherwise). With `keyed`
 * false, or when a key does not hold a number, the sentence's own text is drawn as it stands — and, inside the
 * answer region, the render tests then see a digit with no data-value and say so.
 */
import { get } from '../../answers/shared/format.js';
import { Money } from './Money.jsx';

export function Sentence({ s, source, keyed = true, as: Tag = 'p', ...rest }) {
  if (!s || typeof s.text !== 'string') return null;
  const parts = Array.isArray(s.parts) ? s.parts : null;
  const usable = keyed && parts && parts.every((p) => typeof p === 'string' || (p && 'fixed' in p) || (p && typeof get(source, p.key) === 'number'));
  // 7.8.0: a chance weighted by how long people live is [data-weighted]; the count to one named age beside it is
  // [data-fixed="age"] (a render test holds that the one never shows without the other in its block)
  const mark = s.mark === 'weighted' ? { 'data-weighted': '1' } : s.mark === 'fixed' ? { 'data-fixed': 'age' } : {};
  if (!usable) return <Tag {...rest} {...mark} data-sentence-id={s.id}>{s.text}</Tag>;
  return (
    <Tag {...rest} {...mark} data-sentence-id={s.id}>
      {parts.map((p, i) => (typeof p === 'string'
        ? p
        : 'fixed' in p
          ? <span key={i} data-fixed>{String(p.fixed)}</span>
          : <Money key={i} source={source} k={p.key} kind={p.kind} />))}
    </Tag>
  );
}
