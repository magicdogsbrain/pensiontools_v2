/**
 * The input list for question A — "When can I afford to stop work?" (step 4 brief 4.1).
 *
 * No words here. Labels, help and error sentences are in src/v7/copy/a.js, keyed by path.
 * One declaration drives the form, the defaults, the checks and the generated test cases. The person block and the
 * pay-in block are shared with B through src/answers/shared/schemaParts.js.
 *
 * A field applies when every entry of its `when` matches. Every `when` names a field declared earlier.
 * `boundaries` always includes the field's own `min` and `max`.
 */
import { personFields, saverFields, moreFields, SPEND_FIELDS, agesToShow } from '../shared/schemaParts.js';

export const SCHEMA_A = {
  id: 'a',
  fields: [
    { path: 'household', type: 'choice', options: ['single', 'couple'], default: 'single', group: 'who' },
    ...personFields('you'),
    ...saverFields('you'),
    // Savings (ISAs and cash) are on A's short form: they pay the years before a pension can be touched.
    { path: 'savings', type: 'money', min: 0, max: 10_000_000, default: 0, group: 'you', boundaries: [0, 1, 60_000, 150_000, 10_000_000] },

    // The stop: an age in mind, or "show me ages" (stopping now = stop.age equal to today's age).
    { path: 'stop.kind', type: 'choice', options: ['age', 'ages'], default: 'age', group: 'stop' },
    { path: 'stop.age', type: 'age', min: 18, max: 75, required: true, when: { 'stop.kind': 'age' }, group: 'stop',
      boundaries: [18, 50, 52, 53, 54, 55, 56, 57, 58, 60, 62, 65, 66, 67, 68, 75] },

    ...SPEND_FIELDS,

    // Part-time work after the stop: the first person only, from the stop age, for a whole number of years.
    { path: 'partTime.has', type: 'yesNo', default: false, group: 'work' },
    { path: 'partTime.yearly', type: 'money', min: 1, max: 200_000, required: true, when: { 'partTime.has': true }, group: 'work',
      boundaries: [1, 12_000, 12_570, 12_571, 30_000, 50_270, 200_000] },
    { path: 'partTime.years', type: 'count', min: 1, max: 15, required: true, when: { 'partTime.has': true }, group: 'work', boundaries: [1, 2, 3, 5, 10, 15] },

    // The partner block: every field also has  when: { household: 'couple' }. Both stop in the same year (conflict 17).
    ...personFields('partner'),
    ...saverFields('partner'),

    // "Add more detail" — all optional, each with a default that is listed under what was assumed.
    ...moreFields()
  ],

  // Checked by validate.js after every field has passed its own limits. The error goes on the FIRST field named.
  rules: [
    { id: 'stop-not-before-now', fields: ['stop.age', 'you.age'] },   // stop.age ≥ you.age
    { id: 'end-after-stop',      fields: ['endAge'] },                 // endAge > the younger person's age at the stop
    { id: 'pay-in-over-limit', fields: ['you.payIn.employer', 'partner.payIn.employer'] }   // a person's own + employer's parts ≤ SAVING.payInCeiling (J14)
  ],

  /** The stop ages a result carries (conflict 31): a rule of the list, never a choice a screen makes. */
  agesToShow,
  gridToShow: null
};
