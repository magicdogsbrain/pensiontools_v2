/**
 * How one question's draft is carried into another's (step 4 brief 4.11, conflict 45; screens-A-B.md 5). Data, and the
 * three input lists (a path is carried only where all three ask it).
 *
 * `draft/carry` { from, to } copies by CARRY[`${from}→${to}`] and nothing else: a field not in the map is left as it
 * was in the target's draft; the source draft is untouched; every carried field is marked touched; the target draft
 * gets carriedFrom. Each entry is [source, toPath] where the source is
 *   'a.path'            the text (or yes/no) in draft[from].values at that path — skipped when there is none
 *   { result: 'key' }   a figure read from answers[from].result at that key when the carry happens, written as text
 *   { fixed: 'text' }   a fixed value (the kind that goes with a carried figure: stop.kind 'age', spend.kind 'amount')
 * The reducer never runs an answer. Where the link then goes is CARRY_OPENS: A → C and B → C open C's answer step (C
 * runs from a complete draft); every other carry opens the target's numbers step, focused on the first box to fill.
 *
 * ONE TEST EVERYWHERE (step 4 brief section 10, J8–J10): a hand-over carries the INPUTS — each pot as it is today, what
 * goes into each pension each month, the savings, the age — never a figure the answer worked out of them (a projected
 * pot). C works on the same lives as A and B, so C then shows A's careful figure for the same stop age and pay-in.
 *
 * Couples who stop work in different years (research/v7/couples-different-years.md 5.4, X4): the partner's own stop, the
 * pay line and the tax-free part are the household's, asked in C, A and B alike, so they go with it every way, as typed;
 * not typed, nothing is carried, and a same-year draft is carried exactly as before.
 *
 * "I've already stopped" (A and B, a couple: the answer is about your partner) is carried by maps of its own,
 * CARRY_YOU_STOPPED, which carryFor() picks from what is typed in the source: into C it is "from now", with your
 * partner stopping at the age the answer is about; into the other saver question it is "I've already stopped" again, with
 * your partner at that age. C "from now" with your partner stopping at an age is the same couple from C's side, and goes
 * into A and B as "I've already stopped" (CARRY_C_YOU_STOPPED). Every entry is still one of the three kinds above.
 */
import { SCHEMA_A } from '../../answers/a/schema.js';
import { SCHEMA_B } from '../../answers/b/schema.js';
import { SCHEMA_C } from '../../answers/c/schema.js';

const YOU = ['you.age', 'you.pot', 'you.statePension.kind', 'you.statePension.yearly', 'you.finalSalary.has', 'you.finalSalary.yearly', 'you.finalSalary.fromAge'];
const PARTNER = ['partner.age', 'partner.pot', 'partner.statePension.kind', 'partner.statePension.yearly', 'partner.finalSalary.has', 'partner.finalSalary.yearly', 'partner.finalSalary.fromAge'];
/**
 * Each of you stopping on your own date: the partner's stop, the pay line, the tax-free part — each where all three
 * questions ask it (yours is asked in A and B only while the owner's switch 3 offers "I've already stopped").
 */
const askedEverywhere = (path) => [SCHEMA_A, SCHEMA_B, SCHEMA_C].every((s) => s.fields.some((f) => f.path === path));
const APART_PATHS = ['partner.stop.kind', 'partner.stop.age', 'untilBothStop', 'you.taxFreeTaken', 'partner.taxFreeTaken'].filter(askedEverywhere);
const same = (paths) => paths.map((p) => [p, p]);

/**
 * The person block C, A and B all have — and the settings all three ask: the risk level, the one fund and platform
 * charge (6.19.0: C asks it too, so it is carried every way and a hand-over shows the same figure), the end age.
 */
const HOUSEHOLD = same(['household', ...YOU, ...PARTNER, ...APART_PATHS, 'savings', 'risk', 'charge', 'endAge']);

/** What A and B share beyond the person block: the spending, the pay-ins, the saving settings (the stop age apart). */
const SAVER_FIELDS = [
  'spend.kind', 'spend.amount', 'spend.level',
  'you.payIn.kind', 'you.payIn.total', 'you.payIn.own', 'you.payIn.employer', 'you.alreadyDrawing',
  'partner.payIn.kind', 'partner.payIn.total', 'partner.payIn.own', 'partner.payIn.employer', 'partner.alreadyDrawing',
  'savingsIn', 'savingRisk'
];
const SAVER = same(['stop.age', ...SAVER_FIELDS]);

/**
 * What goes into each pension a month, as one figure a person, read from the source's answer (A's and B's
 * `saving[k].payIn.total`; C's `payIn.byPerson[k].total`, there only when "still paying in" was answered yes). With no
 * such figure the box is emptied: nothing is paid in (A), or the box asks for it (B).
 */
const payInFrom = (key) => [
  [{ fixed: 'total' }, 'you.payIn.kind'], [{ result: key(0) }, 'you.payIn.total'],
  [{ fixed: 'total' }, 'partner.payIn.kind'], [{ result: key(1) }, 'partner.payIn.total']
];

/**
 * Into C (step 4 brief section 10, J10): the household as typed — each pot as it is today, the savings beside them —
 * the stop age as C's "from age", the spending as the amount to take, and what goes into each pension a month as C's
 * "still paying in". C's answer at that age is then A's row at that age (the same lives, the same test).
 */
const INTO_C = (stopFrom) => [
  ...HOUSEHOLD,
  [stopFrom, 'start.age'], [{ fixed: 'age' }, 'start.kind'],
  ['spend.amount', 'take'],
  [{ fixed: 'yes' }, 'you.payIn.has'], [{ fixed: 'yes' }, 'partner.payIn.has'],
  ...payInFrom((k) => `saving.${k}.payIn.total`)
];

export const CARRY = Object.freeze({
  'c→a': [...HOUSEHOLD, ['start.age', 'stop.age'], [{ fixed: 'age' }, 'stop.kind'], ['take', 'spend.amount'], [{ fixed: 'amount' }, 'spend.kind'],
    ...payInFrom((k) => `payIn.byPerson.${k}.total`)],
  'c→b': [...HOUSEHOLD, ['start.age', 'stop.age'], ['take', 'spend.amount'], [{ fixed: 'amount' }, 'spend.kind'],
    ...payInFrom((k) => `payIn.byPerson.${k}.total`)],
  // A's stop age is the age the answer shows: with "show me ages" the stop box is empty and the shown age is the earliest that worked
  'a→b': [...HOUSEHOLD, ...same(SAVER_FIELDS), [{ result: 'shown.age' }, 'stop.age']],
  'b→a': [...HOUSEHOLD, ...SAVER, [{ fixed: 'age' }, 'stop.kind']],
  'a→c': INTO_C({ result: 'shown.age' }),
  'b→c': INTO_C('stop.age')
});

/** Where each carry's link opens: the route after `draft/carry`. `focus` is the first box left to fill (or null). */
export const CARRY_OPENS = Object.freeze({
  'c→a': { q: 'a', step: 'numbers', focus: 'stop.age' },
  'c→b': { q: 'b', step: 'numbers', focus: 'you.payIn.total' },
  'a→b': { q: 'b', step: 'numbers', focus: 'you.payIn.total' },
  'b→a': { q: 'a', step: 'numbers', focus: null },
  'a→c': { q: 'c', step: 'answer', focus: null },
  'b→c': { q: 'c', step: 'answer', focus: null }
});

/** The key of a carry: carryKey('c', 'a') → 'c→a'. */
export const carryKey = (from, to) => `${from}→${to}`;

/*
 * "I've already stopped" (couples-different-years.md 2.2, 5.4; the owner's switch 3): A's and B's answer is then about
 * your partner, whose stop is the age the answer is about. Into C: you take money from now, your partner stops at that
 * age, nothing more goes into your pension and their pay-in goes on until they stop — C then shows the answer's careful
 * figure (X4). Into the other saver question: "I've already stopped" again, your partner at that age. Only while the
 * switch offers "I've already stopped" (otherwise no draft can say it, and there is nothing to pick).
 */
/** Whether A's stop question offers "I've already stopped" (the owner's switch 3, read off the input list itself). */
const YOU_CAN_HAVE_STOPPED = SCHEMA_A.fields.some((f) => f.path === 'stop.kind' && Array.isArray(f.options) && f.options.includes('already'));
const PARTNER_STOP = ['partner.stop.kind', 'partner.stop.age'];
const HOUSEHOLD_BUT_PARTNER_STOP = HOUSEHOLD.filter(([path]) => !PARTNER_STOP.includes(path));
/** Your partner stops at an age: `from` is where the age is read (the age the answer is about). */
const partnerAt = (from) => [[{ fixed: 'age' }, 'partner.stop.kind'], [from, 'partner.stop.age']];
/** Into C, from now: nothing goes into your pension (you have stopped); your partner's pay-in, as one figure, until they stop. */
const INTO_C_YOU_STOPPED = (stopFrom) => [
  ...HOUSEHOLD_BUT_PARTNER_STOP, ...partnerAt(stopFrom),
  [{ fixed: 'now' }, 'start.kind'],
  ['spend.amount', 'take'],
  [{ fixed: 'no' }, 'you.payIn.has'], [{ fixed: 'yes' }, 'partner.payIn.has'],
  [{ fixed: 'total' }, 'partner.payIn.kind'], [{ result: 'saving.1.payIn.total' }, 'partner.payIn.total']
];

export const CARRY_YOU_STOPPED = Object.freeze(YOU_CAN_HAVE_STOPPED ? {
  'a→b': [...HOUSEHOLD_BUT_PARTNER_STOP, ...partnerAt({ result: 'shown.age' }), ...same(SAVER_FIELDS), [{ fixed: 'already' }, 'stop.kind']],
  'b→a': [...HOUSEHOLD_BUT_PARTNER_STOP, ...partnerAt('partner.stop.age'), ...same(SAVER_FIELDS), [{ fixed: 'already' }, 'stop.kind']],
  'a→c': INTO_C_YOU_STOPPED({ result: 'shown.age' }),
  'b→c': INTO_C_YOU_STOPPED('partner.stop.age')
} : {});

/** Where those open: C's answer, as above; the other saver question's numbers, with nothing more it must have. */
export const CARRY_YOU_STOPPED_OPENS = Object.freeze(YOU_CAN_HAVE_STOPPED ? {
  'a→b': { q: 'b', step: 'numbers', focus: null },
  'b→a': { q: 'a', step: 'numbers', focus: null },
  'a→c': { q: 'c', step: 'answer', focus: null },
  'b→c': { q: 'c', step: 'answer', focus: null }
} : {});

/*
 * The other way (the reviewers' finding, 2 Oct 2026; couples-different-years.md 5.4): C "from now" with your partner
 * stopping at an age says you have stopped and they have not, so into A and B it is "I've already stopped", your partner
 * stopping at that age with their pay-in going on until then (one figure, as C's answer holds it), the spending as C's
 * amount to take — and it opens on the numbers with nothing more to fill, as the carries above do. Before, A opened
 * as if you were still saving: your stop age empty and focused, your pay-in £0.
 */
const FROM_C_YOU_STOPPED = [
  ...HOUSEHOLD, [{ fixed: 'already' }, 'stop.kind'], ['take', 'spend.amount'], [{ fixed: 'amount' }, 'spend.kind'],
  [{ fixed: 'total' }, 'partner.payIn.kind'], [{ result: 'payIn.byPerson.1.total' }, 'partner.payIn.total']
];
export const CARRY_C_YOU_STOPPED = Object.freeze(YOU_CAN_HAVE_STOPPED ? { 'c→a': FROM_C_YOU_STOPPED, 'c→b': FROM_C_YOU_STOPPED } : {});
export const CARRY_C_YOU_STOPPED_OPENS = Object.freeze(YOU_CAN_HAVE_STOPPED ? {
  'c→a': { q: 'a', step: 'numbers', focus: null },
  'c→b': { q: 'b', step: 'numbers', focus: null }
} : {});

const has = (o, k) => Object.prototype.hasOwnProperty.call(o, k);

/**
 * Whether C's answer says you have stopped and your partner stops later: from now, each at their own stop, you already
 * (its `apart` block — never worked out here). The one reading for the carry and for C's "What next?" words, so the two
 * cannot disagree: "from now" moved to the day a pension opens, while you still pay in, is not you having stopped.
 */
export function cAnswerYouStopped(result) {
  const ap = result && result.status === 'ok' ? result.apart : null;
  return !!(ap && ap.stops && ap.stops.you && ap.stops.you.already && ap.stops.partner && !ap.stops.partner.already
    && result.inputs && result.inputs.start && result.inputs.start.kind === 'now');
}

/**
 * The map a carry from `from` to `to` copies by, and where it opens, for what is typed in the source (`values`, its flat
 * draft values) and what its answer says (`result`: the source's answer for what is typed now, or null):
 * CARRY_YOU_STOPPED when a couple's source says "I've already stopped", CARRY_C_YOU_STOPPED when C's answer says you have
 * stopped and your partner stops later, else CARRY. → { map, opens }, each null when there is no such carry.
 */
export function carryFor(from, to, values, result = null) {
  const k = carryKey(from, to);
  const v = values || {};
  if (v.household === 'couple' && v['stop.kind'] === 'already' && has(CARRY_YOU_STOPPED, k)) {
    return { map: CARRY_YOU_STOPPED[k], opens: CARRY_YOU_STOPPED_OPENS[k] };
  }
  if (from === 'c' && has(CARRY_C_YOU_STOPPED, k) && cAnswerYouStopped(result)) {
    return { map: CARRY_C_YOU_STOPPED[k], opens: CARRY_C_YOU_STOPPED_OPENS[k] };
  }
  return { map: has(CARRY, k) ? CARRY[k] : null, opens: has(CARRY_OPENS, k) ? CARRY_OPENS[k] : null };
}
