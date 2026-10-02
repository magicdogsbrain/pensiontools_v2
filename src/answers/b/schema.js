/**
 * The input list for question B — "Am I saving enough, and what should I pay in?" (step 4 brief 4.1).
 *
 * No words here. Labels, help and error sentences are in src/v7/copy/b.js, keyed by path.
 * The same list as A's with: a required pay-in; a stop age only (no "show me ages"); no part-time work; savings under
 * more detail; and `confidence` (what the pay-in that gets there is solved for). Every shared path's field deep-equals
 * A's (tests/v7/b/schema.test.js), `required`/`default` on you.payIn.total aside.
 *
 * Couples who stop work in different years (research/v7/couples-different-years.md 2–3, 5.3): the partner's own stop,
 * the pay line, the tax-free part of someone who has stopped, and "I've already stopped" (owner's switch 3: the answer is
 * then about the partner, who must still be working). None has a default: a form that never answers them gives today's
 * checked inputs, key for key and in today's order (the stop question sits before the pay-in block it can hide; not
 * answered, it leaves no key).
 */
import { APART } from '../shared/household.js';
import { personFields, saverFields, moreFields, SPEND_FIELDS, gridToShow, stopKindField, partnerStopFields, untilBothStopField,
  taxFreeFields } from '../shared/schemaParts.js';

const STOP_KIND = stopKindField('b');

export const SCHEMA_B = {
  id: 'b',
  fields: [
    { path: 'household', type: 'choice', options: ['single', 'couple'], default: 'single', group: 'who' },
    ...personFields('you'),
    ...(STOP_KIND ? [STOP_KIND] : []),
    ...saverFields('you', { payInRequired: true }),

    // The age in mind: always after today's age (conflict 24). Not asked with "I've already stopped".
    { path: 'stop.age', type: 'age', min: 18, max: 75, required: true, group: 'stop',
      boundaries: [18, 50, 52, 53, 54, 55, 56, 57, 58, 60, 62, 65, 66, 67, 68, 75], ...(STOP_KIND ? { whenNot: { 'stop.kind': 'already' } } : {}) },

    ...SPEND_FIELDS,

    // The partner block: every field also has  when: { household: 'couple' }. Their stop is their own, not answered being
    // "when you do" (conflict 17's same year); the pay line once it is their own; their pay-in, hidden once they have stopped.
    ...personFields('partner'),
    ...partnerStopFields('b'),
    untilBothStopField('b'),
    ...saverFields('partner'),

    // "Add more detail" — all optional, each with a default that is listed under what was assumed (the tax-free part of
    // someone who has stopped has none: not answered is not taken).
    ...taxFreeFields('b'),
    { path: 'savings', type: 'money', min: 0, max: 10_000_000, default: 0, group: 'more', boundaries: [0, 1, 60_000, 150_000, 10_000_000] },
    ...moreFields(),
    { path: 'confidence', type: 'choice', options: ['nineInTen', 'threeInFour'], default: 'nineInTen', group: 'more' }
  ],

  // Checked by validate.js after every field has passed its own limits. The error goes on the FIRST field named.
  rules: [
    { id: 'stop-after-now', fields: ['stop.age', 'you.age'] },   // stop.age > you.age
    { id: 'end-after-stop', fields: ['endAge'] },                // endAge > the younger person's age at the stop
    { id: 'pay-in-over-limit', fields: ['you.payIn.employer', 'partner.payIn.employer'] },  // a person's own + employer's parts ≤ SAVING.payInCeiling (J14)
    // couples-different-years.md 3.3 (end-after-stop above looks at the LATER stop, under RULES.maxYears after the first)
    ...(APART.askAboutPartner ? [{ id: 'partner-stop-after-now', fields: ['partner.stop.age', 'partner.age'] }] : []),   // you have stopped: they stop after today
    { id: 'partner-stop-not-before-now', fields: ['partner.stop.age', 'partner.age'] },  // partner.stop.age ≥ partner.age
    ...(APART.askAboutPartner ? [
      { id: 'already-needs-partner', fields: ['stop.kind'] },                           // "I've already stopped" is for a couple (one person: C)
      { id: 'partner-stop-fits', fields: ['partner.stop.kind'] }                        // you have stopped: the partner gives an age
    ] : [])
  ],

  agesToShow: null,
  /** The rows (stop ages) and columns (pay-in totals) of the choices step (conflict 37): a rule of the list. */
  gridToShow
};
