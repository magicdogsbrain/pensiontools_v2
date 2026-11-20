/**
 * Marks inside a sentence an answer wrote (lead4.md G1), the same way in both views. A sentence is { parts }: strings,
 * { fixed } counts and { key, kind } figures (answers/shared/format.js partText). The marks are found once here and drawn
 * by each view: the simple view's Sentence (src/v7/components/Sentence.jsx) and the full view's HTML (sentenceHtml).
 *
 *   groupParts(parts, source, { keys, finds })   [{ fact | null, items: [{ part, text }] }]: the parts in order, with the
 *                                                figures of the register gathered under their fact. `keys` is
 *                                                { partKey: factId }; `finds` is [[RegExp with one group, factId], …] over
 *                                                the sentence's text (a chance said in words and counts). A find whose
 *                                                edge falls inside a figure is left unmarked.
 *   sentenceHtml(s, source, marks, esc)          the sentence as HTML, each mark a span (src/reading/mark.js)
 *
 * The saver's block (SAVER_MARKS): which figure of the answer's sentences is which fact, by the block's line id.
 */
import { partText } from '../answers/shared/format.js';
import { markFact, FIXED_CHANCE_WORDS } from './mark.js';
import { FACT, BUCKETS, factId } from './facts.js';

export function groupParts(parts, source, { keys = {}, finds = [] } = {}) {
  // each part with its text; strings may be split at a find's edges
  let items = (parts || []).map((part) => ({ part, text: partText(part, source) }));
  const ranges = [];
  const textOf = () => items.map((x) => x.text).join('');
  const splitAt = (pos) => {
    let at = 0;
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      const end = at + it.text.length;
      if (pos === at || pos === end) return true;
      if (pos > at && pos < end) {
        if (typeof it.part !== 'string') return false;
        const a = it.text.slice(0, pos - at);
        const b = it.text.slice(pos - at);
        items = [...items.slice(0, i), { part: a, text: a }, { part: b, text: b }, ...items.slice(i + 1)];
        return true;
      }
      at = end;
    }
    return pos === at;
  };
  for (const [re, id] of finds) {
    const t = textOf();
    const m = new RegExp(re.source, re.flags.replace('g', '')).exec(t);
    if (!m || m[1] == null || m[1] === '') continue;
    const start = m.index + m[0].indexOf(m[1]);
    const end = start + m[1].length;
    if (ranges.some((r) => start < r.end && end > r.start)) continue;
    // both edges must fall between parts (a string may be cut; a figure may not)
    const before = items.slice();
    if (!splitAt(start) || !splitAt(end)) { items = before; continue; }
    ranges.push({ start, end, fact: id });
  }
  // a keyed figure: its own range, unless a find already holds it
  let at = 0;
  for (const it of items) {
    const end = at + it.text.length;
    const id = it.part && typeof it.part === 'object' && 'key' in it.part ? keys[it.part.key] : null;
    if (id && it.text !== '' && !ranges.some((r) => at < r.end && end > r.start)) ranges.push({ start: at, end, fact: id });
    at = end;
  }
  ranges.sort((a, b) => a.start - b.start);
  const groups = [];
  let pos = 0;
  for (const it of items) {
    const end = pos + it.text.length;
    const r = ranges.find((x) => pos >= x.start && end <= x.end && it.text !== '');
    const last = groups[groups.length - 1];
    if (r && last && last.range === r) last.items.push(it);
    else groups.push({ fact: r ? r.fact : null, range: r || null, items: [it] });
    pos = end;
  }
  return groups.map(({ fact, items: xs }) => ({ fact, items: xs }));
}

export function sentenceHtml(s, source, marks, esc) {
  if (!s || !Array.isArray(s.parts)) return esc(s && s.text ? s.text : '');
  return groupParts(s.parts, source, marks || {}).map((g) => {
    const html = g.items.map((x) => esc(x.text)).join('');
    return g.fact ? markFact(g.fact, html) : html;
  }).join('');
}

/** The chance said in words ("as long as you do 18 times in 20", "about 17 times in 20", "less than once in 20"). */
const CHANCE = /((?:more than |less than |about )?(?:\d+ times|once) in 20)/;

/** "3 of 22" in "3 of 22 gilts bought" / "… gilts held": the gilts held, said the same in both views (moveWords.moveStatusOf). */
export const GILTS_HELD_FIND = /^(\d+ of \d+) gilts? (?:bought|held)/;

const LEAD = 'enough.atLevel';
/** The figures of the saver's block (state/saverBlock.js lines), by line id: the same in both views. */
export const SAVER_MARKS = Object.freeze({
  head: { keys: { 'spend.perMonth': FACT.WANT_INCOME } },
  line: { keys: {}, finds: [[CHANCE, FACT.SAVER_CHANCE]] },
  lineEnough: { keys: { [`${LEAD}.payIn`]: FACT.SAVER_ENOUGH, [`${LEAD}.totalPct`]: FACT.SAVER_ENOUGH_PCT } },
  income: { keys: { 'income.bad': FACT.SAVER_INCOME_AT_STOP } },
  enoughHead: { keys: { [`${LEAD}.payIn`]: FACT.SAVER_ENOUGH, [`${LEAD}.totalPct`]: FACT.SAVER_ENOUGH_PCT } },
  enoughLine: { keys: {} }
});

/** The block's own filled lines (not the answer's sentences): which slot holds which fact. */
export const SAVER_SLOTS = Object.freeze({
  want: { amount: FACT.WANT_INCOME, age: FACT.WANT_STOP_AGE },
  nowShare: { pct: FACT.PAY_IN_PCT },
  enoughShare: { pct: FACT.SAVER_ENOUGH_PCT },
  now: { takeHome: FACT.PAY_IN_TAKE_HOME, employer: FACT.PAY_IN_EMPLOYER, total: FACT.PAY_IN_TOTAL, ownPct: FACT.PAY_IN_PCT }
});
/** The slots' facts for a block line id ('now.share' → the pay-in's). */
export const saverSlotsOf = (lineId) => (String(lineId).startsWith('now.') ? SAVER_SLOTS.now : SAVER_SLOTS[lineId] || {});

/** The guardrail reading's words (STRESS.guardrail, both views): this year's draw as a share of what the pots hold. */
export const GUARDRAIL_FACTS = Object.freeze({ pct: FACT.WITHDRAWAL_RATE });

/** What was taken this tax year (services/YearPlan.js takenSentence, both views): its figure's key. */
export const TAKEN_FACTS = Object.freeze({ drawn: FACT.TAKEN_YEAR });

/** This tax year's lines (src/reading/thisYear.js thisYearSentences, both views): the plan's figure and the year as set up. */
export const THIS_YEAR_FACTS = Object.freeze({ planYear: FACT.YEAR_PLAN_SAYS, setUpYear: FACT.YEAR_SET_UP, yearMonthly: FACT.YEAR_PER_MONTH, yearTotal: FACT.YEAR_TOTAL });

/** The household's headline (HOUSEHOLD.verdict.headline, both views): its chance in words. */
export const HOUSEHOLD_CHANCE = Object.freeze({ words: FACT.HOUSEHOLD_CHANCE });

/**
 * The mix by bucket, as a share of the whole in whole percent: the mark holds the number, the "%" is the words' (the simple
 * view's copy writes "Shares {shares}%", so its slot is the number). The held mix (Holdings.proportions, both views) and the
 * plan's own mix (the plan document's first year, both views).
 */
const bucketMarks = (pattern) => Object.freeze(Object.fromEntries(BUCKETS.map((b) => [b, factId(pattern, b)])));
export const HELD_MIX_SLOTS = bucketMarks(FACT.MIX_HELD);
export const PLAN_MIX_SLOTS = bucketMarks(FACT.MIX_PLAN);
/** The full view's one line of the held mix (Holdings.describeMix: "78% shares · 17% bonds · 5% cash; cost …"). */
export const HELD_MIX_FINDS = Object.freeze(BUCKETS.map((b) => [new RegExp('(\\d+)% ' + b + '\\b'), HELD_MIX_SLOTS[b]]));

/**
 * The words under "Does it last?" / "Will it last?" (OneAnswer's weighted words: w.floor, w.left, w.assumed), the same
 * sentences in both views: which figure in them is which fact. Drawn by the simple view's LastsScreen (markIn) and the full
 * view's verdict block (markWithin).
 */
export const LASTS_FINDS = Object.freeze({
  floor: Object.freeze([[/ran out at (\d+)/, FACT.RUN_OUT_AGE], [/still have (£[\d,]+) a year after tax/, FACT.FLOOR_INCOME]]),
  left: Object.freeze([[/typically (?:left then is )?(£[\d,]+)/, FACT.LEFT], [/best 1 in 10 futures it is (£[\d,]+)/, FACT.LEFT_GOOD]]),
  assumed: Object.freeze([[/About (\d+ in \d+)[^.]*live longer/, FACT.LIVE_LONGER], [/follow each future on to (\d+)/, FACT.FOLLOW_TO]]),
  fixed: Object.freeze([[FIXED_CHANCE_WORDS, FACT.LASTS_FIXED], [/live to (\d+)/, FACT.END_AGE]])
});
