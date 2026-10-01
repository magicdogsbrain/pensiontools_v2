/**
 * The one formatter (V7 build brief 4.3), used by the sentences and by the screen's Money and Sentence.
 * Pure, and the same on every device: no toLocaleString.
 */

/** 1380 → '£1,380'. Whole pounds; never a minus, never pence; 0 → '£0'. */
export function money(n) {
  const v = Math.abs(Math.round(Number(n) || 0));
  return '£' + String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/** A derived monthly figure → the number to show: nearest £10 from £1,000, nearest £5 below. */
export function shownMonthly(n) {
  const v = Math.abs(Number(n) || 0);
  return v >= 1000 ? Math.round(v / 10) * 10 : Math.round(v / 5) * 5;
}

/** 95 → '95'. Whole years, rounded down. */
export function ageText(n) {
  return String(Math.floor(Number(n) || 0));
}

/** A pot → the nearest £1,000 with the £ sign: 468,250 → '£468,000'; 500 → '£1,000'; 0 → '£0' (step 4 brief, conflict 39). */
export function pot(n) {
  return money(Math.round(Math.abs(Number(n) || 0) / 1000) * 1000);
}

/**
 * The share of futures that lasted (0–1) → the words (language guide 3.4, "Counting out of 10").
 * `only` is true when the count is below the 9 the careful amount is built on; `count` is the whole number
 * written, or null where the words carry no count.
 * @returns {{ words: string, only: boolean, count: number|null }}
 */
export function outOfTen(share) {
  const s = Number(share) || 0;
  const e = 1e-9;
  if (s >= 1 - e) return { words: 'in every future we tried', only: false, count: null };
  if (s >= 0.95 - e) return { words: 'in more than 9 futures out of 10', only: false, count: 9 };
  if (s >= 0.85 - e) return { words: 'in 9 futures out of 10', only: false, count: 9 };
  if (s >= 0.15 - e) {
    const count = Math.min(8, Math.max(2, Math.round(s * 10)));
    return { words: `in only ${count} futures out of 10`, only: true, count };
  }
  if (s >= 0.05 - e) return { words: 'in only 1 future out of 10', only: true, count: 1 };
  if (s > e) return { words: 'in fewer than 1 future out of 10', only: true, count: 1 };
  return { words: 'in none of the futures we tried', only: true, count: null };
}

/**
 * Lasted in 85% to under 90%: outOfTen's count reads 9, but the careful line — 9 futures in 10 — is not reached. Every
 * question says it "just under 9", so a count never reads as the careful 9 when it is not (C, A and B alike).
 */
export function underNine(share) {
  return outOfTen(share).count === 9 && Number(share) < 0.9;
}

/** outOfTen's words, with "in just under 9 futures out of 10" for 85% to under 90%. */
export function lastedText(share) {
  return underNine(share) ? 'in just under 9 futures out of 10' : outOfTen(share).words;
}

/** Read a dotted key out of a result: get(answer, 'phases.1.shown.fromPots'). */
export function get(obj, key) {
  return String(key).split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

/** One part of a sentence as text: a string, { key, kind: 'money' | 'age' | 'pot' } or { fixed }. */
export function partText(part, result) {
  if (typeof part === 'string') return part;
  if (part && 'fixed' in part) return String(part.fixed);
  const value = get(result, part.key);
  return part.kind === 'age' ? ageText(value) : part.kind === 'pot' ? pot(value) : money(value);
}

/** The rule of the contract: a sentence's text === its parts joined, each key formatted here. */
export function partsText(parts, result) {
  return (parts || []).map((p) => partText(p, result)).join('');
}
