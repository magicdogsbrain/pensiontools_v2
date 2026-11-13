/**
 * The one formatter (V7 build brief 4.3), used by the sentences and by the screen's Money and Sentence.
 * Pure, and the same on every device: no toLocaleString.
 */
import { LEVEL_LINES, passes } from './rules.js';

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

/**
 * 7.8.0 (research/v7/replan-nov-2026.md 5): a weighted chance (0–1, weighted by how long people live) in twentieths, said
 * as a chance and never as a count of futures: "18 times in 20". It rounds to the nearest twentieth, but never up across
 * a level's line or the close line under it (LEVEL_LINES): a chance a hair under 18 in 20 reads 17, so the words never
 * claim a level the figure does not reach. With the weighted failures (`sumW`, `n`) the line is judged by the one test
 * (rules.js passes), else on the share.
 *   s = 1                       "in every future we tried" (literally: none ran out)
 *   rounds to 20, s < 1         "more than 19 times in 20"
 *   0 < s, rounds to 0          "less than once in 20"
 *   s = 0                       "in none of the futures we tried"
 */
export function chanceWords(s, { sumW = null, n = null } = {}) {
  const v = Math.max(0, Math.min(1, Number(s) || 0));
  if (v >= 1) return 'in every future we tried';
  if (v <= 0) return 'in none of the futures we tried';
  const k = chanceTwentieths(v, { sumW, n });
  if (k >= 20) return 'more than 19 times in 20';
  if (k <= 0) return 'less than once in 20';
  return k === 1 ? 'once in 20' : `${k} times in 20`;
}
const LINES20 = LEVEL_LINES.map((l) => Math.round(l * 20));

/**
 * The whole twentieths chanceWords says a weighted share in (0 to 20): the nearest, one down where rounding up would put it
 * on a level's line it does not reach. Bold's consequence reads the same figure (20 less it), so the two never disagree.
 */
export function chanceTwentieths(s, { sumW = null, n = null } = {}) {
  const v = Math.max(0, Math.min(1, Number(s) || 0));
  let k = Math.round(v * 20);
  // a line in twentieths (19, 18, 17, 14, 13): rounding up onto one the chance does not reach goes one twentieth down
  const reaches = (k20) => (Number.isFinite(sumW) && Number.isFinite(n) && n > 0 ? passes(sumW, n, 20 - k20) : v >= k20 / 20);
  if (v > 0 && v < 1 && LINES20.includes(k) && !reaches(k)) k -= 1;
  return k;
}

/**
 * How often the money runs out while you are alive, from the same twentieths chanceWords gives the chance (Bold's
 * consequence): "about 6 times in 20", "about once in 20", "less than once in 20" (the chance said as more than 19 times in
 * 20), "more than 19 times in 20" (the chance said as less than once in 20); null when it never runs out (s = 1).
 */
export function failTwentiethsWords(s, { plain = false } = {}) {
  const v = Math.max(0, Math.min(1, Number(s) || 0));
  if (v >= 1) return null;
  if (v <= 0) return 'in every future we tried';
  // (`plain`: a fixed-age count, read as twentiethsOfFutures reads it — the nearest twentieth)
  const k = plain ? Math.round(v * 20) : chanceTwentieths(v);
  if (k >= 20) return 'less than once in 20';
  if (k <= 0) return 'more than 19 times in 20';
  const out = 20 - k;
  return out === 1 ? 'about once in 20' : `about ${out} times in 20`;
}

/**
 * 7.8.0: a fixed-age share (a plain count of the futures that lasted to one named age) in twentieths of the futures we
 * tried, always with its age: "If you live to 97, the money lasts that long in 14 of 20 futures we tried." Plain
 * nearest-twentieth rounding, never "only" or "just under"; never 20 of 20 while one ran out, never 0 while one lasted.
 *   `kind`   what failing means: 'ran-out' (the money), 'cut' (the income paid in full), 'lean' (no lean year)
 *   `couple` { name }: "If one of you is still alive when Sam is 100, …" (the younger person, by name or "the younger of you")
 * @returns {string}
 */
export function fixedAgeWords(share, age, { kind = 'ran-out', couple = null } = {}) {
  const at = ageText(age);
  // (a couple: by the younger person's age, or — a plan, whose age is its own person's — "when you are 103")
  const lead = couple ? `If one of you is still alive when ${couple.name === 'you' ? 'you are' : `${couple.name || 'the younger of you'} is`} ${at}` : `If you live to ${at}`;
  const what = kind === 'cut' ? 'your income is paid in full that long' : kind === 'lean' ? 'you have no lean year that long' : 'the money lasts that long';
  return `${lead}, ${what} ${twentiethsOfFutures(share)}.`;
}

/** A count's share in twentieths of the futures we tried ("in 14 of 20 futures we tried"), plain rounding, see fixedAgeWords. */
export function twentiethsOfFutures(share) {
  const v = Math.max(0, Math.min(1, Number(share) || 0));
  if (v >= 1) return 'in every future we tried';
  if (v <= 0) return 'in none of the futures we tried';
  const k = Math.round(v * 20);
  if (k >= 20) return 'in more than 19 of 20 futures we tried';
  if (k <= 0) return 'in fewer than 1 of 20 futures we tried';
  return `in ${k} of 20 futures we tried`;
}

/** Read a dotted key out of a result: get(answer, 'phases.1.shown.fromPots'). */
export function get(obj, key) {
  return String(key).split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

/** A share of pay as written: 31 → '31%', 26.5 → '26.5%' (to two places at most, never a trailing nought). */
export function pctText(n) {
  return String(Math.round((Number(n) || 0) * 100) / 100) + '%';
}

/** One part of a sentence as text: a string, { key, kind: 'money' | 'age' | 'pot' | 'pct' } or { fixed }. */
export function partText(part, result) {
  if (typeof part === 'string') return part;
  if (part && 'fixed' in part) return String(part.fixed);
  const value = get(result, part.key);
  return part.kind === 'age' ? ageText(value) : part.kind === 'pot' ? pot(value) : part.kind === 'pct' ? pctText(value) : money(value);
}

/** The rule of the contract: a sentence's text === its parts joined, each key formatted here. */
export function partsText(parts, result) {
  return (parts || []).map((p) => partText(p, result)).join('');
}
