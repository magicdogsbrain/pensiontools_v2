/**
 * The one line under the heading of a numbers step whose figures were carried in from another question
 * (screens-A-B.md 5; step 4 brief 4.13): [data-testid="<q>.carried"]. Read from the draft's carriedFrom and the
 * figures as typed; drawn only while the draft says it was carried.
 */
import { money, ageText } from '../../answers/shared/format.js';
import { A } from '../copy/a.js';
import { B } from '../copy/b.js';

const COPY = { a: A, b: B };

/** What goes into your pension each month as typed (the total, or the two parts typed, added up), or null when blank. */
function payInTyped(v) {
  const num = (x) => typeof x === 'number' && Number.isFinite(x);
  if (v['you.payIn.kind'] === 'split') return num(v['you.payIn.own']) || num(v['you.payIn.employer']) ? (v['you.payIn.own'] || 0) + (v['you.payIn.employer'] || 0) : null;
  return num(v['you.payIn.total']) ? v['you.payIn.total'] : null;
}

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
