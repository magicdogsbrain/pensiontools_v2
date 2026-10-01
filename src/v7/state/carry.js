/**
 * How one question's draft is carried into another's (step 4 brief 4.11, conflict 45; screens-A-B.md 5). Data only.
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
 */

const YOU = ['you.age', 'you.pot', 'you.statePension.kind', 'you.statePension.yearly', 'you.finalSalary.has', 'you.finalSalary.yearly', 'you.finalSalary.fromAge'];
const PARTNER = ['partner.age', 'partner.pot', 'partner.statePension.kind', 'partner.statePension.yearly', 'partner.finalSalary.has', 'partner.finalSalary.yearly', 'partner.finalSalary.fromAge'];
const same = (paths) => paths.map((p) => [p, p]);

/** The person block C, A and B all have. */
const HOUSEHOLD = same(['household', ...YOU, ...PARTNER, 'savings', 'risk', 'endAge']);

/** What A and B share beyond the person block: the spending, the pay-ins, the saving settings (the stop age apart). */
const SAVER_FIELDS = [
  'spend.kind', 'spend.amount', 'spend.level',
  'you.payIn.kind', 'you.payIn.total', 'you.payIn.own', 'you.payIn.employer', 'you.alreadyDrawing',
  'partner.payIn.kind', 'partner.payIn.total', 'partner.payIn.own', 'partner.payIn.employer', 'partner.alreadyDrawing',
  'savingsIn', 'savingRisk', 'charge'
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
