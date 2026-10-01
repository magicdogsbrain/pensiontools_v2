/**
 * The input list for question B — "Am I saving enough, and what should I pay in?" (step 4 brief 4.1).
 *
 * No words here. Labels, help and error sentences are in src/v7/copy/b.js, keyed by path.
 * The same list as A's with: a required pay-in; a stop age only (no "show me ages"); no part-time work; savings under
 * more detail; and `confidence` (what the pay-in that gets there is solved for). Every shared path's field deep-equals
 * A's (tests/v7/b/schema.test.js), `required`/`default` on you.payIn.total aside.
 */
import { personFields, saverFields, moreFields, SPEND_FIELDS, gridToShow } from '../shared/schemaParts.js';

export const SCHEMA_B = {
  id: 'b',
  fields: [
    { path: 'household', type: 'choice', options: ['single', 'couple'], default: 'single', group: 'who' },
    ...personFields('you'),
    ...saverFields('you', { payInRequired: true }),

    // The age in mind: always after today's age (conflict 24).
    { path: 'stop.age', type: 'age', min: 18, max: 75, required: true, group: 'stop',
      boundaries: [18, 50, 52, 53, 54, 55, 56, 57, 58, 60, 62, 65, 66, 67, 68, 75] },

    ...SPEND_FIELDS,

    // The partner block: every field also has  when: { household: 'couple' }. Both stop in the same year (conflict 17).
    ...personFields('partner'),
    ...saverFields('partner'),

    // "Add more detail" — all optional, each with a default that is listed under what was assumed.
    { path: 'savings', type: 'money', min: 0, max: 10_000_000, default: 0, group: 'more', boundaries: [0, 1, 60_000, 150_000, 10_000_000] },
    ...moreFields(),
    { path: 'confidence', type: 'choice', options: ['nineInTen', 'threeInFour'], default: 'nineInTen', group: 'more' }
  ],

  // Checked by validate.js after every field has passed its own limits. The error goes on the FIRST field named.
  rules: [
    { id: 'stop-after-now', fields: ['stop.age', 'you.age'] },   // stop.age > you.age
    { id: 'end-after-stop', fields: ['endAge'] },                // endAge > the younger person's age at the stop
    { id: 'pay-in-over-limit', fields: ['you.payIn.employer', 'partner.payIn.employer'] }   // a person's own + employer's parts ≤ SAVING.payInCeiling (J14)
  ],

  agesToShow: null,
  /** The rows (stop ages) and columns (pay-in totals) of the choices step (conflict 37): a rule of the list. */
  gridToShow
};
