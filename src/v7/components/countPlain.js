/** The count of futures as plain text, one function for both views (moved out of OutOfTenBar.jsx, no JSX). */
import { outOfTen } from '../../answers/shared/format.js';

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
