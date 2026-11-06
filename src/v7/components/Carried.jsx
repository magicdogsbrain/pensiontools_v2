/**
 * The one line under the heading of a numbers step whose figures were carried in from another question
 * (screens-A-B.md 5; step 4 brief 4.13): [data-testid="<q>.carried"]. Read from the draft's carriedFrom and the
 * figures as typed; drawn only while the draft says it was carried.
 */
import { money, ageText } from '../../answers/shared/format.js';
import { payInTypedOf } from '../state/select.js';
import { A } from '../copy/a.js';
import { B } from '../copy/b.js';

const COPY = { a: A, b: B };

/** What goes into your pension each month as typed (one figure, the two parts added up, or what a share of pay lands), or null when blank. */
const payInTyped = (v) => payInTypedOf(v, 'you');

export function Carried({ form }) {
  const q = form.q;
  const from = form.carriedFrom;
  const words = COPY[q] && COPY[q].carried;
  if (!from || !words) return null;
  const key = `${from}→${q}`;
  let text = words[key];
  if (!text) return null;
  // Into B: when what goes in each month came over too, the line asks to check it (naming it), not to add it.
  const paid = q === 'b' ? payInTyped(form.parsed.values) : null;
  if (paid !== null && words[`${key}.payIn`]) return <p class="carried notice" role="status" data-testid={`${q}.carried`}>{words[`${key}.payIn`].replace('{amount}', money(paid))}</p>;
  if (text.includes('{')) {
    const v = form.parsed.values;
    const age = v['stop.age'];
    const amount = v['spend.kind'] !== 'level' ? v['spend.amount'] : undefined;
    text = typeof age === 'number' && typeof amount === 'number'
      ? text.replace('{age}', ageText(age)).replace('{amount}', money(amount))
      : words[`${key}.plain`];
  }
  if (!text) return null;
  return <p class="carried notice" role="status" data-testid={`${q}.carried`}>{text}</p>;
}
