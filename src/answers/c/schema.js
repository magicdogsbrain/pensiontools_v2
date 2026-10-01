/**
 * The input list for question C — "I've got about £X — what is that a month?" (V7 build brief 4.1).
 *
 * No words here. Labels, help and error sentences are in src/v7/copy/c.js, keyed by path.
 * One declaration drives the form, the defaults, the checks and the generated test cases.
 *
 * A field applies when every entry of its `when` matches. Every `when` names a field declared earlier.
 * `boundaries` always includes the field's own `min` and `max`.
 */
import { RULES, accessAgeOn, firstAccessAge } from '../shared/rules.js';
import { payingInFields, statePensionAgeOf, earliestPensionStart, peopleFromValues } from '../shared/schemaParts.js';

const POT = [0, 1, 10_000, 30_000, 250_000, 1_073_100, 3_000_000, 10_000_000];
const STATE_PENSION = [0, 1, 6_000, 12_570, 12_571, 20_000];
const FINAL_SALARY = [1, 9_000, 12_570, 50_270, 100_000, 125_140, 200_000];
const FINAL_SALARY_AGE = [50, 55, 60, 65, 67, 75];

/** Still paying in, from the flat values before the start: "yes", and more than nothing going in (£0 + £0 is not). */
const num = (v) => (typeof v === 'number' && Number.isFinite(v) ? v : 0);
export function payingIn(values) {
  if (values['you.payIn.has'] !== 'yes') return false;
  return (values['you.payIn.kind'] === 'total' ? num(values['you.payIn.total']) : num(values['you.payIn.own']) + num(values['you.payIn.employer'])) > 0;
}

/**
 * Your age when the first of the household's pensions can be touched (no earlier than today), from flat checked or parsed
 * values: what the start-not-before-access words name (the rule is per person: the partner's pension too).
 */
export function earliestStart(values, env) {
  return earliestPensionStart(peopleFromValues(values), env.today);
}

export const SCHEMA_C = {
  id: 'c',
  fields: [
    { path: 'household', type: 'choice', options: ['single', 'couple'], default: 'single', group: 'who' },

    { path: 'you.pot', type: 'money', min: 0, max: 10_000_000, required: true, group: 'you', boundaries: POT },
    { path: 'you.age', type: 'age', min: 18, max: 100, required: true, group: 'you',     // never a default
      boundaries: [18, 40, 54, 55, 56, 57, 66, 67, 68, 75, 90, 100] },

    // "Are you still paying into this pension?" and what lands in it a month, until the money is first taken (step 4
    // brief section 10, J8). Not answered = not paying in: the checked inputs are then what they always were.
    ...payingInFields('you'),

    { path: 'start.kind', type: 'choice', options: ['now', 'age'], default: { rule: 'startKind' }, group: 'you' },
    { path: 'start.age', type: 'age', min: 18, max: 100, default: { rule: 'startAge' },
      when: { 'start.kind': 'age' }, group: 'you', boundaries: [18, 55, 57, 60, 67, 100] },

    { path: 'you.statePension.kind', type: 'choice', options: ['full', 'forecast', 'none'], default: 'full', group: 'you' },
    { path: 'you.statePension.yearly', type: 'money', min: 0, max: 20_000, required: true,
      when: { 'you.statePension.kind': 'forecast' }, group: 'you', boundaries: STATE_PENSION },

    { path: 'you.finalSalary.has', type: 'yesNo', default: false, group: 'you' },
    { path: 'you.finalSalary.yearly', type: 'money', min: 1, max: 200_000, required: true,
      when: { 'you.finalSalary.has': true }, group: 'you', boundaries: FINAL_SALARY },
    { path: 'you.finalSalary.fromAge', type: 'age', min: 50, max: 75, required: true,
      when: { 'you.finalSalary.has': true }, group: 'you', boundaries: FINAL_SALARY_AGE },

    // The partner block: every field also has  when: { household: 'couple' }.
    { path: 'partner.age', type: 'age', min: 18, max: 100, required: true, when: { household: 'couple' }, group: 'partner',
      boundaries: [18, 54, 57, 62, 70, 100] },
    { path: 'partner.pot', type: 'money', min: 0, max: 10_000_000, default: 0, when: { household: 'couple' }, group: 'partner',
      boundaries: [0, 150_000, 1_073_100, 10_000_000] },
    { path: 'partner.statePension.kind', type: 'choice', options: ['full', 'forecast', 'none'], default: 'full',
      when: { household: 'couple' }, group: 'partner' },
    { path: 'partner.statePension.yearly', type: 'money', min: 0, max: 20_000, required: true,
      when: { household: 'couple', 'partner.statePension.kind': 'forecast' }, group: 'partner', boundaries: STATE_PENSION },
    { path: 'partner.finalSalary.has', type: 'yesNo', default: false, when: { household: 'couple' }, group: 'partner' },
    { path: 'partner.finalSalary.yearly', type: 'money', min: 1, max: 200_000, required: true,
      when: { household: 'couple', 'partner.finalSalary.has': true }, group: 'partner', boundaries: FINAL_SALARY },
    { path: 'partner.finalSalary.fromAge', type: 'age', min: 50, max: 75, required: true,
      when: { household: 'couple', 'partner.finalSalary.has': true }, group: 'partner', boundaries: FINAL_SALARY_AGE },
    ...payingInFields('partner'),

    // "Add more detail" — all optional, each with a default that is listed under what was assumed.
    { path: 'savings', type: 'money', min: 0, max: 10_000_000, default: 0, group: 'more', boundaries: [0, 1, 150_000, 10_000_000] },
    { path: 'risk', type: 'choice', options: ['cautious', 'balanced', 'adventurous'], default: 'balanced', group: 'more' },
    { path: 'endAge', type: 'age', min: 75, max: 105, default: 95, group: 'more', boundaries: [75, 95, 100, 105] },

    // "Try a change" — optional; never on the numbers step. null = not asked.
    { path: 'take', type: 'money', min: 0, max: 50_000, default: null, group: 'try', boundaries: [0, 1, 1_000, 50_000] }
  ],

  // Checked by validate.js after every field has passed its own limits. The error goes on the FIRST field named.
  rules: [
    { id: 'start-not-before-now',    fields: ['start.age', 'you.age'] },   // start.age >= you.age
    { id: 'start-not-before-access', fields: ['start.age', 'you.age'] },   // not before every pension of the household opens, with no savings (per person)
    { id: 'pay-in-past-75',          fields: ['start.age'] },              // still paying in: your age at the start ≤ 75
    { id: 'pay-in-past-75-partner',  fields: ['start.age'] },              // …and your partner's
    { id: 'end-after-start',         fields: ['endAge'] },                 // endAge > the younger person's age at the start
    { id: 'pay-in-over-limit', fields: ['you.payIn.employer', 'partner.payIn.employer'] }   // a person's own + employer's parts ≤ SAVING.payInCeiling (J14)
  ],

  // Defaults that depend on other values. `values` is { [path]: checked value } for the fields before this one.
  defaultRules: {
    /**
     * 'age' while still paying in and under the State Pension age (the money is taken when the paying in stops: the
     * owner's most likely person — 55, paying in, asking about 67 — must not be answered "from now" with the pay-in
     * left out; the reviewers' finding, 1 Oct 2026). Otherwise 'now' if you.age is at or past the earliest pension age on
     * env.today (or you.pot is 0 and nothing is paid in); else 'age'.
     */
    startKind(values, env) {
      const age = values['you.age'];
      if (typeof age !== 'number') return 'now';
      if (payingIn(values) && age < Math.min(RULES.stopAgeMax, statePensionAgeOf(age, env.today))) return 'age';
      if (values['you.pot'] === 0 && values['you.payIn.has'] !== 'yes') return 'now';
      return age >= accessAgeOn(env.today) ? 'now' : 'age';
    },
    /**
     * Still paying in: the State Pension age (no later than 75) — the age to change to the one they stop at. Otherwise the
     * earliest pension age for this person (55 before 6 April 2028, 57 from then; birthday taken as today). Never before
     * their age now, nor before the pension can be touched.
     */
    startAge(values, env) {
      const age = values['you.age'];
      if (typeof age !== 'number') return accessAgeOn(env.today);
      const open = Math.max(age, firstAccessAge(age, env.today));
      return payingIn(values) ? Math.max(open, Math.min(RULES.stopAgeMax, statePensionAgeOf(age, env.today))) : open;
    }
  }
};
