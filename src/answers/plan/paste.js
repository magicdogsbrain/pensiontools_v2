/**
 * A pasted table read for the screen (research/v7/way-and-mix.md 3.2c; holdings-and-move.md §2.1), shared by "The mix"
 * (the funds to test) and "What you hold" (the record): every line read, the ones recognised (the bundled catalogue, the
 * plan's own order sheet for gilts, a cash line), "What is this?" for the rest with the person's answer applied, the
 * summary's counts, what was left out and why, and the merge the planner's own mergeLedger would make into the lines
 * given. Pure: text in, data out; nothing here writes or reads a clock. The planner's words for a left-out line become ids
 * the screen words itself.
 *
 *   readPasteText(text, { wrapper, answers, orders, current }) → {
 *     text, wrapper, empty, rows: [{ line, name, ticker, value, units, match, unrecognised, what, noValue }], counts, leftOut,
 *     warnings, matched (HoldingsPaste.matchRows's rows, answered), merged (mergeLedger's result, or null) }
 *   PASTE_WHATS          the answers "What is this?" takes (HoldingsPaste.CATEGORY_CHOICES, by key)
 */
import { parsePaste, matchRows, mergeLedger, categorise, pasteSummary, CATEGORY_CHOICES } from '../../services/HoldingsPaste.js';
import { pounds } from './income.js';

export const PASTE_WHATS = Object.freeze(CATEGORY_CHOICES.map((c) => c.key));
const blank = (v) => v === undefined || v === null || (typeof v === 'string' && v.trim() === '');
/** The planner's reasons a line was left out, as ids the preview words itself (the planner says "holding"). */
export const whyId = (why) => (/^a total line/.test(why) ? 'total' : /^a cash heading/.test(why) ? 'cashHeading' : /^no name/.test(why) ? 'noName' : /^no units or value/.test(why) ? 'noValue' : 'other');

/**
 * @param {string} text        the pasted table
 * @param {object} o
 * @param {string} [o.wrapper]  'SIPP' | 'ISA' | 'GIA' | 'CASH' — the type of account the lines are held in
 * @param {object} [o.answers]  { [line number]: one of PASTE_WHATS } for lines not recognised
 * @param {Array}  [o.orders]   the plan document's order sheet (gilts are matched against it first)
 * @param {Array}  [o.current]  the lines the paste would merge into (the record's, or the funds list's)
 */
export function readPasteText(text, { wrapper = 'SIPP', answers = {}, orders = [], current = [] } = {}) {
  if (blank(text)) return { text: '', wrapper, empty: true, rows: [], counts: null, leftOut: [], warnings: [], matched: [], merged: null };
  const parsed = parsePaste(text);
  const matched = matchRows(parsed.rows, { orders: Array.isArray(orders) ? orders : [], wrapper }).map((r) => {
    const what = answers && answers[r.line];
    return r.match && r.match.kind === 'none' && PASTE_WHATS.includes(what) ? categorise(r, what) : r;
  });
  const summary = pasteSummary({ parsed, matched });
  const rows = matched.map((r) => ({
    line: r.line, name: r.name || '', ticker: r.ticker || '', value: r.value, units: r.units,
    match: r.match && r.match.kind !== 'none' ? { kind: r.match.kind, ticker: r.match.ticker || '', name: r.match.name || '', confidence: r.match.confidence } : null,
    unrecognised: !!(r.match && r.match.kind === 'none' && !r.category), what: r.category || '', noValue: r.value == null
  }));
  const merged = matched.length ? mergeLedger(Array.isArray(current) ? current : [], matched, { wrapper }) : null;
  const counts = { read: summary.pastedCount, total: pounds(summary.pastedTotal), recognised: summary.recognisedCount, recognisedTotal: pounds(summary.recognisedTotal), unrecognised: summary.unrecognised.length, unrecognisedTotal: pounds(summary.unrecognisedTotal), unknown: summary.unknownCount, unknownTotal: pounds(summary.unknownTotal) };
  return { text, wrapper, empty: false, rows, counts, leftOut: (parsed.leftOut || []).map((x) => ({ line: x.line, text: x.text, why: whyId(x.why), raw: x.why })), warnings: parsed.warnings || [], matched, merged };
}
