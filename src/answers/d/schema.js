/**
 * The input list for question D — "I'm retired. Will it last? Could I spend more? Would some work help?"
 * (research/v7/answer-D.md 4.1; road-to-7.md step 7).
 *
 * No words here. Labels, help and error sentences are in src/v7/copy/d.js, keyed by path. Built from the shared parts,
 * so paths, limits and boundaries are C's and A's: the person block (schemaParts.js personFields), the savings box and
 * how they grow, the spending (SPEND_FIELDS: the same paths as A and B), the risk level, the one charge, the end age.
 *
 * D's own fields:
 *   stopped / partner.stopped   "Have you stopped work?" — D is for people who have. "Not yet" is said on the form
 *                               (d-still-working, d-partner-working) and points at the question that is theirs.
 *   you.taxFreeTaken            yes / no / some — required, no default (answer-D.md 3.2: one tap, never a guess; "some"
 *                               is counted as all taken, the cautious side)
 *   work.*, fall.has            the levers (try only, never on the first form): work from today for 1 to 5 years, and
 *                               "What if shares fell by a fifth?"
 *
 * Not taken from C or A: start.kind / start.age (D always starts today), the pay-in block (someone who has stopped pays
 * nothing in), `take` (the spend box is D's try). A couple: both stopped (answer-D.md 8, C's same-year rule); a partner
 * still working is A's question ("I've already stopped") and the form says so.
 *
 * The end age: the later of 95 and the younger person's age + 5, capped at 105 (answer-D.md 4.1 endAge).
 */
import { personFields, SPEND_FIELDS, chargeField, isaGrowthField, savingsGrowthDefault, spendLevelAMonth } from '../shared/schemaParts.js';

const isNum = (v) => typeof v === 'number' && Number.isFinite(v);

/** The tax-free part: not had, had, or some of it (answer-D.md 4.1). */
export const TAX_FREE_TAKEN = Object.freeze(['no', 'yes', 'some']);
/** "What if shares fell?": by a fifth (answer-D.md 3.7, the owner's question 4). */
export const FALL_SHARE = 0.2;
/** Work from today: whole years, 1 to 5 (answer-D.md 3.6, 7). */
export const WORK_YEARS = Object.freeze({ min: 1, max: 5 });

/** The end age the form puts in: the later of 95 and the younger person's age + 5, capped at 105. */
export function defaultEndAge(values) {
  const you = values['you.age'];
  const partner = values.household === 'couple' ? values['partner.age'] : undefined;
  const younger = isNum(you) ? (isNum(partner) ? Math.min(you, partner) : you) : null;
  return younger === null ? 95 : Math.min(105, Math.max(95, younger + 5));
}

export const SCHEMA_D = {
  id: 'd',
  fields: [
    { path: 'household', type: 'choice', options: ['single', 'couple'], default: 'single', group: 'who' },
    // "Have you stopped work?" (the way in): D answers for someone who has; "not yet" points at A (d-still-working).
    { path: 'stopped', type: 'choice', options: ['yes', 'notYet'], default: 'yes', group: 'you' },
    ...personFields('you'),
    // Savings (ISAs and cash) are on D's short form: a retired person's second pot.
    { path: 'savings', type: 'money', min: 0, max: 10_000_000, default: 0, group: 'you', boundaries: [0, 1, 40_000, 150_000, 10_000_000] },
    // How the savings grow (6.22.0): asked, and defaulted to "Mostly cash", once there is money in savings.
    isaGrowthField('you'),
    // The tax-free part: required, no default (answer-D.md 3.2).
    { path: 'you.taxFreeTaken', type: 'choice', options: [...TAX_FREE_TAKEN], required: true, group: 'you' },

    // What you take a month, after tax: the same paths as A and B (on D's first form, not a step of its own).
    ...SPEND_FIELDS,

    // The partner block: every field also has  when: { household: 'couple' }. Both of you have stopped (answer-D.md 8).
    ...personFields('partner'),
    { path: 'partner.stopped', type: 'choice', options: ['yes', 'notYet'], default: 'yes', group: 'partner', when: { household: 'couple' } },
    { path: 'partner.taxFreeTaken', type: 'choice', options: [...TAX_FREE_TAKEN], required: true, group: 'partner', when: { household: 'couple' } },

    // "Add more detail" — all optional, each with a default that is listed under what was assumed.
    { path: 'risk', type: 'choice', options: ['cautious', 'balanced', 'adventurous'], default: 'balanced', group: 'more' },
    chargeField(),
    { path: 'endAge', type: 'age', min: 75, max: 105, default: { rule: 'endAge' }, group: 'more', boundaries: [75, 95, 100, 105] },

    // The levers (answer-D.md 7): try only, never on the first form. Work from today for N whole years; a fall in shares.
    { path: 'work.has', type: 'yesNo', default: false, group: 'try' },
    { path: 'work.yearly', type: 'money', min: 1, max: 200_000, required: true, when: { 'work.has': true }, group: 'try',
      boundaries: [1, 12_000, 12_570, 12_571, 30_000, 50_270, 200_000] },
    { path: 'work.years', type: 'count', min: WORK_YEARS.min, max: WORK_YEARS.max, required: true, when: { 'work.has': true }, group: 'try', boundaries: [1, 2, 3, 5] },
    { path: 'fall.has', type: 'yesNo', default: false, group: 'try' }
  ],

  // Checked by validate.js after every field has passed its own limits. The error goes on the FIRST field named.
  rules: [
    { id: 'd-still-working', fields: ['stopped'] },               // "not yet": this question is for people who have stopped
    { id: 'd-partner-working', fields: ['partner.stopped'] },     // the partner still working: A's question
    { id: 'd-end-after-now', fields: ['endAge'] },                // endAge > the younger person's age today
    { id: 'd-work-before-end', fields: ['work.years'] }           // you.age + years < endAge
  ],

  /** Defaults that depend on other values (validate.js). */
  defaultRules: { isaGrowth: savingsGrowthDefault, endAge: defaultEndAge },

  agesToShow: null,
  gridToShow: null
};

/** The one figure the answer tests, £ a month after tax: the amount typed, or the level's figure. */
export function spendOf(inputs) {
  const s = (inputs && inputs.spend) || {};
  return s.kind === 'level' ? spendLevelAMonth(inputs.household, s.level) : s.amount;
}
