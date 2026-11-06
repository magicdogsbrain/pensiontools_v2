/**
 * The spending shape in words (research/v7/spending-shape.md 7.1, 7.2): a list of steps — as typed (select.js
 * shapeView(…).list) or as an answer carries it (result.spendShape, result.shapeAt.careful) — written the language
 * guide's way: "£2,500 a month from 62, £2,130 from 75 and £1,750 from 85"; with a fall or a move, "…; £3,000 from 75,
 * falling 2% a year to £2,501 at 84; and £2,000 from 85". The figures are the list's own; nothing is worked out here.
 *
 *   listWords(list, unit)    the list, in words
 *   summaryWords(view)       the closed block's line: "No: the same every year …" or "Yes, as you set it: {list}."
 *   pictureWords(list, from, to, unit)   the one sentence a screen reader hears for the whole picture
 */
import { money } from '../../answers/shared/format.js';
import { SHAPE } from '../copy/shape.js';

const fill = (text, values) => String(text).replace(/\{(\w+)\}/g, (m, k) => (k in values ? values[k] : m));
const pct = (n) => String(Math.round(Number(n) * 100) / 100);
const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
const L = SHAPE.list;

/** The list in words. `unit` 'share' writes each later step as a share of the start. */
export function listWords(list, unit = 'perMonth') {
  if (!Array.isArray(list) || !list.length) return '';
  let clause = false;
  const tail = (x) => {
    if (x.then === 'falls' && isNum(x.fallsPct)) {
      clause = true;
      return `, ${isNum(x.endPerMonth) && isNum(x.endAge) ? fill(L.fallsTo, { pct: pct(x.fallsPct), amount: money(x.endPerMonth), age: x.endAge }) : fill(L.falls, { pct: pct(x.fallsPct) })}`;
    }
    if (x.then === 'glides') {
      clause = true;
      return `, ${isNum(x.endPerMonth) && isNum(x.endAge) ? fill(L.glidesTo, { amount: money(x.endPerMonth), age: x.endAge }) : L.glides}`;
    }
    return '';
  };
  const parts = list.map((x, i) => {
    if (i === 0) {
      let head;
      if (unit === 'share') head = isNum(x.fromAge) ? fill(L.startShare, { age: x.fromAge }) : SHAPE.firstShareC;
      else if (isNum(x.perMonth) && x.now) head = fill(L.startNow, { amount: money(x.perMonth) });
      else if (isNum(x.perMonth) && isNum(x.fromAge)) head = fill(L.start, { amount: money(x.perMonth), age: x.fromAge });
      else head = isNum(x.fromAge) ? fill(L.startNone, { age: x.fromAge }) : SHAPE.firstAmountNone;
      return head + tail(x);
    }
    const w = unit === 'share' ? fill(L.stepShare, { pct: pct(x.share), age: x.fromAge }) : fill(L.step, { amount: money(x.perMonth), age: x.fromAge });
    return w + tail(x);
  });
  const sep = clause ? '; ' : ', ';
  if (parts.length > 5) return `${parts[0]}${sep}${parts[1]}${sep}${L.and} ${fill(L.more, { n: parts.length - 2 })}`;
  if (parts.length === 1) return parts[0];
  return `${parts.slice(0, -1).join(sep)}${clause ? ';' : ''} ${L.and} ${parts[parts.length - 1]}`;
}

/** The closed block's one line. */
export function summaryWords(view) {
  return view && view.shaped ? fill(SHAPE.closed.shaped, { list: listWords(view.list, view.unit) }) : SHAPE.closed.level;
}

/** The picture, in one sentence: "A bar for each year from 62 to 94: {list}." */
export function pictureWords(list, from, to, unit = 'perMonth') {
  return fill(SHAPE.chart.describe, { from, to, list: listWords(list, unit) });
}
