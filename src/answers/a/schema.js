/**
 * The input list for question A — "When can I afford to stop work?" (step 4 brief 4.1).
 *
 * No words here. Labels, help and error sentences are in src/v7/copy/a.js, keyed by path.
 * One declaration drives the form, the defaults, the checks and the generated test cases. The person block and the
 * pay-in block are shared with B through src/answers/shared/schemaParts.js.
 *
 * A field applies when every entry of its `when` matches (a list: one of them) and no entry of its `whenNot` does. Every
 * `when` and `whenNot` names a field declared earlier. `boundaries` always includes the field's own `min` and `max`.
 *
 * Couples who stop work in different years (research/v7/couples-different-years.md 2–3): the partner's own stop, the pay
 * line until you have both stopped, the tax-free part of someone who has stopped, and "I've already stopped" (the answer
 * is then about the partner). None of the new questions has a default: a form that never answers them gives today's
 * checked inputs, key for key and in today's order (the stop sits before the pay-in block it can hide, with the savings
 * before it, so the inputs' keys keep their order).
 */
import { APART } from '../shared/household.js';
import { personFields, saverFields, moreFields, SPEND_FIELDS, agesToShow, stopKindField, partnerStopFields, untilBothStopField,
  taxFreeFields, partTimeHidden, shapeFields } from '../shared/schemaParts.js';

const hiddenWhenStopped = (f) => (Object.keys(partTimeHidden()).length ? { ...f, whenNot: partTimeHidden() } : f);

export const SCHEMA_A = {
  id: 'a',
  fields: [
    { path: 'household', type: 'choice', options: ['single', 'couple'], default: 'single', group: 'who' },
    ...personFields('you'),
    // Savings (ISAs and cash) are on A's short form: they pay the years before a pension can be touched.
    { path: 'savings', type: 'money', min: 0, max: 10_000_000, default: 0, group: 'you', boundaries: [0, 1, 60_000, 150_000, 10_000_000] },

    // The stop: an age in mind, or "show me ages" (stopping now = stop.age equal to today's age), or — a couple, the
    // owner's switch 3 — "I've already stopped": the answer is then about the partner. Before the pay-in block it hides.
    stopKindField('a'),
    { path: 'stop.age', type: 'age', min: 18, max: 75, required: true, when: { 'stop.kind': 'age' }, group: 'stop',
      boundaries: [18, 50, 52, 53, 54, 55, 56, 57, 58, 60, 62, 65, 66, 67, 68, 75] },

    ...saverFields('you'),

    ...SPEND_FIELDS,
    // What is spent changing with age (research/v7/spending-shape.md 3.2): no default — not answered, the same every year
    ...shapeFields('spend'),

    // Part-time work after the stop: the first person only, from the stop age, for a whole number of years. It belongs to
    // the one stopping, so "I've already stopped" hides it.
    hiddenWhenStopped({ path: 'partTime.has', type: 'yesNo', default: false, group: 'work' }),
    { path: 'partTime.yearly', type: 'money', min: 1, max: 200_000, required: true, when: { 'partTime.has': true }, group: 'work',
      boundaries: [1, 12_000, 12_570, 12_571, 30_000, 50_270, 200_000] },
    { path: 'partTime.years', type: 'count', min: 1, max: 15, required: true, when: { 'partTime.has': true }, group: 'work', boundaries: [1, 2, 3, 5, 10, 15] },

    // The partner block: every field also has  when: { household: 'couple' }. Their stop is their own, not answered being
    // "when you do" (conflict 17's same year); the pay line once it is their own; their pay-in, hidden once they have stopped.
    ...personFields('partner'),
    ...partnerStopFields('a'),
    untilBothStopField('a'),
    ...saverFields('partner'),

    // "Add more detail" — all optional, each with a default that is listed under what was assumed (the tax-free part of
    // someone who has stopped has none: not answered is not taken).
    ...taxFreeFields('a'),
    ...moreFields()
  ],

  // Checked by validate.js after every field has passed its own limits. The error goes on the FIRST field named.
  rules: [
    { id: 'stop-not-before-now', fields: ['stop.age', 'you.age'] },   // stop.age ≥ you.age
    { id: 'end-after-stop',      fields: ['endAge'] },                 // endAge > the younger person's age at the stop
    { id: 'stop-ages-past-75',   fields: ['stop.kind'] },              // "show me ages" needs an age to show: you.age ≤ RULES.stopAgeMax
    { id: 'pay-in-over-limit', fields: ['you.payIn.employer', 'partner.payIn.employer'] },  // a person's own + employer's parts ≤ SAVING.payInCeiling (J14)
    { id: 'shape-steps', fields: ['spend.steps'] },                    // the steps' ages: after the stop, before the end, rising (each under its box)
    // couples-different-years.md 3.3 (end-after-stop above looks at the LATER stop, under RULES.maxYears after the first)
    { id: 'partner-stop-not-before-now', fields: ['partner.stop.age', 'partner.age'] },  // partner.stop.age ≥ partner.age
    ...(APART.askAboutPartner ? [
      { id: 'already-needs-partner', fields: ['stop.kind'] },                           // "I've already stopped" is for a couple (one person: C)
      { id: 'partner-stop-fits', fields: ['partner.stop.kind'] },                       // you have stopped: the partner gives an age or asks for ages
      { id: 'partner-ages-one-at-a-time', fields: ['partner.stop.kind'] },              // "show me ages" for the partner only once you have stopped
      { id: 'partner-stop-ages-past-75', fields: ['partner.stop.kind'] }                 // …and only while they are 75 or under
    ] : [])
  ],

  /** The stop ages a result carries (conflict 31): a rule of the list, never a choice a screen makes. */
  agesToShow,
  gridToShow: null
};
