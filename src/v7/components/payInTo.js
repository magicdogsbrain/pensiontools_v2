/**
 * The one writer of "what goes in a month" for the three doors of B's answer that move it — the "Pay in more" lever
 * (Levers.jsx), the "Try a change" stepper (TryAChange.jsx, yours and your partner's) and a cell of the grid (Grid.jsx).
 * Each door names a figure that is what lands in the pension, the employer's part included; what is written depends on
 * how the pay-in was entered:
 *
 *   - one figure: the total, and its kind 'total' — as it always was;
 *   - your part and your employer's ('split'): your part becomes the figure less the employer's part (never below £0) and
 *     the employer's box is left as typed, the kind staying 'split'. Written as one figure, as every door did, the kept plan
 *     read the whole as your own — "£0 from your employer", and your part entered as 0.8 of the whole, the planner's
 *     relief-at-source entry (a report of 2 Nov 2026, on the lever; the stepper and the grid cell did the same);
 *   - a share of your pay ('share', 6.46.0: pay a year and two percentages): the share is written and the kind kept
 *     (research/saving-enough-and-check-in.md 3.6) — your part as a share of the pay given, your employer's share as
 *     entered. A door that names a share (what would be enough, a column of the grid in shares) writes that share; one that
 *     names pounds (the £50 steps) writes the share that lands at least that much, to the box's 0.01%. (Until R1 the pounds
 *     were written as two parts, because a figure cannot be said as a share without the pay — but a share kind has the
 *     pay.) With a pay of £0 nothing can be a share of it: the pounds are written as two parts, as before;
 *   - any other kind: one figure, as before.
 *
 * The figure first, then its kind, so no step in between is a draft that does not parse. A figure with pence — an
 * employer's part typed as £250.50 leaves pence in the rest — is written with them, so asking again gives the door's figure
 * exactly; money() rounds to the pound and would move it by up to 50p.
 */
import { money } from '../../answers/shared/format.js';
import { payInParts, shareLandsOf } from '../state/select.js';

const set = (q, path, value) => ({ type: 'draft/set', q, path, value });
const num = (x) => typeof x === 'number' && Number.isFinite(x);

/** A share as a person would type it into a percent box: "27", "26.5", "7.58" — never a trailing nought. */
export function pctTyped(x) {
  return String(Math.round((Number(x) || 0) * 100) / 100);
}

/** A figure as a person would type it into a money box: whole pounds with commas, pence only when there are any. */
export function asTyped(n) {
  const v = Math.round(Math.abs(Number(n) || 0) * 100) / 100;
  const whole = Math.floor(v);
  const pence = Math.round((v - whole) * 100);
  return money(whole).slice(1) + (pence ? '.' + String(pence).padStart(2, '0') : '');
}

/**
 * The draft/set actions that make `n` what goes in a month for `who` ('you' or 'partner'), given the pay-in as entered —
 * `entry` is the checked inputs' (`inputs.you.payIn`: kind, own, employer, or total alone) or payInEntered's.
 */
export function payInTo(q, who, entry, n, share = null) {
  if (entry && entry.kind === 'share') {
    // the entry is the checked inputs' (pay and the percentages) or payInEntered's (the employer's pounds already read)
    const employer = num(entry.employer) ? entry.employer : payInParts(entry).employer;
    const pay = num(entry.pay) ? entry.pay : 0;
    if (pay > 0) {
      const ownPct = share && num(share.ownPct) ? share.ownPct : Math.min(100, Math.max(0, Math.ceil(((n - employer) * 1200 / pay) * 100 - 1e-6) / 100));
      return [set(q, `${who}.payIn.ownPct`, pctTyped(ownPct)), set(q, `${who}.payIn.kind`, 'share')];
    }
    return [set(q, `${who}.payIn.own`, asTyped(Math.max(0, n - employer))), set(q, `${who}.payIn.employer`, asTyped(employer)), set(q, `${who}.payIn.kind`, 'split')];
  }
  if (entry && entry.kind === 'split') {
    const employer = num(entry.employer) ? entry.employer : 0;
    return [set(q, `${who}.payIn.own`, asTyped(Math.max(0, n - employer))), set(q, `${who}.payIn.kind`, 'split')];
  }
  return [set(q, `${who}.payIn.total`, asTyped(n)), set(q, `${who}.payIn.kind`, 'total')];
}

/**
 * The pay-in as typed, read from a question's parsed values for `who`: `kind` and `employer` for payInTo; `total` the whole
 * figure (your two parts added up, or the one figure; null while the one figure is blank); `yours` the part a press moves
 * (your part of a split entry, else the whole), so a stepper's "− £50" rests once nothing of yours is left to take off.
 */
export function payInEntered(v, who) {
  const kind = v[`${who}.payIn.kind`];
  if (kind === 'share') {
    // what the share lands (select.js shareLandsOf): null while a box is blank; the pay too, so a door can write a share
    const lands = shareLandsOf(v, who);
    const pay = num(v[`${who}.payIn.pay`]) ? v[`${who}.payIn.pay`] : 0;
    if (!lands) return { kind, employer: 0, total: null, yours: 0, pay };
    return { kind, employer: lands.employer, total: Math.round((lands.own + lands.employer) * 100) / 100, yours: lands.own, pay };
  }
  if (kind === 'split') {
    const own = num(v[`${who}.payIn.own`]) ? v[`${who}.payIn.own`] : 0;
    const employer = num(v[`${who}.payIn.employer`]) ? v[`${who}.payIn.employer`] : 0;
    return { kind, employer, total: own + employer, yours: own };
  }
  const total = num(v[`${who}.payIn.total`]) ? v[`${who}.payIn.total`] : null;
  return { kind, employer: 0, total, yours: total === null ? 0 : total };
}
