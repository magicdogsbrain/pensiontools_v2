/**
 * How many futures out of 10 something lasted (or reached), drawn from the answer's own share (step 4 brief 4.13).
 *
 *   <OutOfTenBar source={result} k="ages.3.lasted" />
 *
 * Exactly ten cells, the first round(share × 10) filled — the one sum here, from the share the answer wrote, never
 * from a figure the screen worked out. The bar is an image to a screen reader, labelled with format.js's words
 * ("in 9 futures out of 10"); the ten cells are marked data-fixed, as a count the answer wrote. The element carries
 * data-key / data-value / data-kind="outOfTen" so the tests can read it back.
 *
 * countText(share, words) is the short count a table cell shows ("8 in 10", "every one", "none"), from the same
 * format.js reading, with each run of digits in a data-fixed span (a count the answer wrote, never a figure worked out).
 */
import { outOfTen, get, twentiethsOfFutures } from '../../answers/shared/format.js';

/** The number of filled cells for a share (0–1), out of `of` (10, or 20 while the figures are weighed: 7.8.0). */
export const filledCells = (share, of = 10) => Math.max(0, Math.min(of, Math.round((Number(share) || 0) * of)));

/**
 * `of` = 20 (7.8.0, while the figures are weighed by how long people live): twenty cells, labelled in twentieths of the
 * futures we tried ("in 16 of 20 futures we tried"), so a bar never says tenths beside a sentence in twentieths.
 */
export function OutOfTenBar({ source, k, class: cls, of = 10 }) {
  const v = get(source, k);
  if (typeof v !== 'number' || !Number.isFinite(v)) return null;
  const n = of === 20 ? 20 : 10;
  const on = filledCells(v, n);
  const cells = [];
  for (let i = 0; i < n; i++) cells.push(<span key={i} class={`bar-cell${i < on ? ' is-on' : ''}`} data-fixed />);
  return (
    <span class={`bar${n === 20 ? ' is-20' : ''}${cls ? ' ' + cls : ''}`} role="img" aria-label={n === 20 ? twentiethsOfFutures(v) : outOfTen(v).words} data-key={k} data-value={v} data-kind={n === 20 ? 'outOf20' : 'outOfTen'}>
      {cells}
    </span>
  );
}

/**
 * The short count for a share: "{n} in 10" with the digit marked data-fixed, or the words for every one / none.
 * `words` = { count: '{n} in 10', countJustUnder, countEvery, countNone } from the question's copy.
 */
export function countText(share, words, opts = {}) {
  const text = countPlain(share, words, opts);
  return <>{text.split(/(\d+)/).map((piece, i) => (i % 2 ? <span key={i} data-fixed>{piece}</span> : piece))}</>;
}

/**
 * The same as plain text (for an aria-label or a sentence built by the screen): "8 in 10". The ends follow format.js's
 * own words, so a count never says more than the bar beside it shows: under 1 in 20 is "fewer than 1 in 10" (the bar
 * is empty, never "1 in 10"), and 95% or more, short of every one, is "more than 9 in 10" (the bar is full).
 */
export function countPlain(share, words, { of = 10 } = {}) {
  // (7.8.0, while weighing: in twentieths, plain rounding as format.js twentiethsOfFutures — "16 of 20", never "just under")
  if (of === 20) {
    const v = Math.max(0, Math.min(1, Number(share) || 0));
    if (v >= 1) return words.countEvery;
    if (v <= 0) return words.countNone;
    const k = Math.round(v * 20);
    if (k >= 20) return words.countMore20;
    if (k <= 0) return words.countFewer20;
    return words.count20.replace('{n}', String(k));
  }
  const o = outOfTen(share);
  if (o.count === null) return o.only ? words.countNone : words.countEvery;
  if (o.words.startsWith('in fewer than')) return words.countFewer;
  if (o.words.startsWith('in more than')) return words.countMore;
  // 85% to under 90% reads "9" in format.js but is not the careful 9 in 10: said "just under 9 in 10", so a count beside
  // a "close" never reads like a yes (Screens 9.2; the answers' own sentences do the same)
  if (o.count === 9 && share < 0.9) return words.countJustUnder;
  return words.count.replace('{n}', String(o.count));
}
