/**
 * The parts of the input lists that questions A and B share (step 4 brief 4.1, conflict 19). No words here:
 * labels, help and errors are in src/v7/copy/{a,b}.js, keyed by path.
 *
 *   personFields(who)            C's person block for `who`, by value (tests/v7/a/schema.test.js asserts it deep-equals SCHEMA_C's)
 *   saverFields(who, opts)       the pay-in block: payIn.kind / total / own / employer, and alreadyDrawing under more detail
 *   moreFields()                 savingsIn, savingRisk, risk, charge, endAge
 *   SPEND_FIELDS                 spend.kind / amount / level — the same paths in A and B
 *   agesToShow(inputs, env, detail, earliestYes)   the stop ages an A result carries (conflict 31)
 *   gridToShow(inputs, env)      the rows and columns of B's choices step (conflict 37)
 *   alreadyStopped(inputs, today)   the retired view's rule (conflict 44)
 *
 * Pure: no clock (env.today is the date), no storage, no screen.
 */
import { RULES, SAVING, accessAgeOn, addYears } from './rules.js';
import { bornFromAge, wholeStatePensionAge, firstOpenAge } from './household.js';

const POT = [0, 1, 10_000, 30_000, 250_000, 1_073_100, 3_000_000, 10_000_000];
const STATE_PENSION = [0, 1, 6_000, 12_570, 12_571, 20_000];
const FINAL_SALARY = [1, 9_000, 12_570, 50_270, 100_000, 125_140, 200_000];
const FINAL_SALARY_AGE = [50, 55, 60, 65, 67, 75];

/** A field with `when` only when there is something in it. */
const field = (f, when) => (Object.keys(when).length ? { ...f, when } : f);

/**
 * C's person block for `who`: age, pot, statePension.kind/.yearly, finalSalary.has/.yearly/.fromAge — a copy by value of
 * SCHEMA_C's fields, in C's order (you: pot then age; partner: age then pot). The partner's every field applies to a couple;
 * partner.pot defaults to 0; partner.age is required. SCHEMA_C is not edited and not imported.
 */
export function personFields(who) {
  const w = who === 'partner' ? { household: 'couple' } : {};
  const g = who;
  const age = field({ path: `${who}.age`, type: 'age', min: 18, max: 100, required: true, group: g,
    boundaries: who === 'partner' ? [18, 54, 57, 62, 70, 100] : [18, 40, 54, 55, 56, 57, 66, 67, 68, 75, 90, 100] }, w);
  const pot = who === 'partner'
    ? field({ path: 'partner.pot', type: 'money', min: 0, max: 10_000_000, default: 0, group: g, boundaries: [0, 150_000, 1_073_100, 10_000_000] }, w)
    : { path: 'you.pot', type: 'money', min: 0, max: 10_000_000, required: true, group: g, boundaries: POT };
  return [
    ...(who === 'partner' ? [age, pot] : [pot, age]),
    field({ path: `${who}.statePension.kind`, type: 'choice', options: ['full', 'forecast', 'none'], default: 'full', group: g }, w),
    field({ path: `${who}.statePension.yearly`, type: 'money', min: 0, max: 20_000, required: true, group: g, boundaries: STATE_PENSION },
      { ...w, [`${who}.statePension.kind`]: 'forecast' }),
    field({ path: `${who}.finalSalary.has`, type: 'yesNo', default: false, group: g }, w),
    field({ path: `${who}.finalSalary.yearly`, type: 'money', min: 1, max: 200_000, required: true, group: g, boundaries: FINAL_SALARY },
      { ...w, [`${who}.finalSalary.has`]: true }),
    field({ path: `${who}.finalSalary.fromAge`, type: 'age', min: 50, max: 75, required: true, group: g, boundaries: FINAL_SALARY_AGE },
      { ...w, [`${who}.finalSalary.has`]: true })
  ];
}

/**
 * The pay-in block (conflict 11): one short-form figure, what lands in the pension each month (employer's part and the
 * tax top-up inside), or "split it up" into own and employer, whose sum is the total. `alreadyDrawing` feeds the
 * £10,000 warning only. B passes { payInRequired: true }.
 */
export function saverFields(who, { payInRequired = false } = {}) {
  const w = who === 'partner' ? { household: 'couple' } : {};
  return [
    field({ path: `${who}.payIn.kind`, type: 'choice', options: ['total', 'split'], default: 'total', group: who }, w),
    field({ path: `${who}.payIn.total`, type: 'money', min: 0, max: SAVING.payInCeiling, ...(payInRequired ? { required: true } : { default: 0 }),
      group: who, boundaries: [0, 1, 100, 500, 700, 1_500, 5_000, 10_000] }, { ...w, [`${who}.payIn.kind`]: 'total' }),
    field({ path: `${who}.payIn.own`, type: 'money', min: 0, max: SAVING.payInCeiling, required: true, group: who,
      boundaries: [0, 1, 250, 5_000, 10_000] }, { ...w, [`${who}.payIn.kind`]: 'split' }),
    field({ path: `${who}.payIn.employer`, type: 'money', min: 0, max: SAVING.payInCeiling, required: true, group: who,
      boundaries: [0, 1, 250, 5_000, 10_000] }, { ...w, [`${who}.payIn.kind`]: 'split' }),
    field({ path: `${who}.alreadyDrawing`, type: 'yesNo', default: false, group: 'more' }, w)
  ];
}

/**
 * Question C's "still paying in" block (step 4 brief section 10, J8): on C's first form, per person, "Are you still
 * paying into this pension?" and, if so, what lands in it each month — your part and your employer's part (the tax the
 * government adds back included), paid in until the age the money is first taken. `payIn.kind` is 'split' unless a
 * hand-over from A or B brought one figure ('total'); the boxes are saverFields' own, `when` aside.
 *
 * `payIn.has` ('no' | 'yes': a choice, so a hand-over can write it as text) has NO default: not answered is "not paying in", and the checked inputs of a form that never answers it
 * are what they were before the block existed (C's pinned answers stay byte for byte). It is the one field of C that
 * is neither required nor defaulted (tests/v7/c/schema.test.js says so by name).
 */
export function payingInFields(who) {
  const w = who === 'partner' ? { household: 'couple' } : {};
  const has = { ...w, [`${who}.payIn.has`]: 'yes' };
  const saver = saverFields(who);
  const at = (path) => { const { when, ...f } = saver.find((x) => x.path === `${who}.payIn.${path}`); void when; return f; };
  return [
    field({ path: `${who}.payIn.has`, type: 'choice', options: ['no', 'yes'], group: who }, w),
    field({ ...at('kind'), default: 'split' }, has),
    field({ ...at('total'), required: true, default: undefined }, { ...has, [`${who}.payIn.kind`]: 'total' }),
    field(at('own'), { ...has, [`${who}.payIn.kind`]: 'split' }),
    field(at('employer'), { ...has, [`${who}.payIn.kind`]: 'split' })
  ].map((f) => Object.fromEntries(Object.entries(f).filter(([, v]) => v !== undefined)));
}

/**
 * What lands in `who`'s pension a month, from checked inputs of A, B or C: the total, or own + employer when split;
 * 0 when C's "still paying in" was not answered yes. Pure.
 */
export function payInTotalOf(inputs, who) {
  const p = inputs && inputs[who] && inputs[who].payIn;
  if (!p) return 0;
  if ('has' in p && p.has !== 'yes') return 0;                       // C: "still paying in?" not answered yes
  if (p.kind === 'split') return (isNum(p.own) ? p.own : 0) + (isNum(p.employer) ? p.employer : 0);
  return isNum(p.total) ? p.total : 0;
}

/** "Add more detail": savings in a month, the two risk levels, the charge while saving, the end age. */
export function moreFields() {
  return [
    { path: 'savingsIn', type: 'money', min: 0, max: 10_000, default: 0, group: 'more', boundaries: [0, 1, 500, 1_667, 10_000] },   // a month, into ISAs and savings
    { path: 'savingRisk', type: 'choice', options: ['cautious', 'balanced', 'adventurous'], default: 'balanced', group: 'more' },
    { path: 'risk', type: 'choice', options: ['cautious', 'balanced', 'adventurous'], default: 'balanced', group: 'more' },
    { path: 'charge', type: 'percent', min: 0, max: 2, default: 0.5, group: 'more', boundaries: [0, 0.5, 1, 2] },                     // a year, while saving
    { path: 'endAge', type: 'age', min: 75, max: 105, default: 95, group: 'more', boundaries: [75, 95, 100, 105] }
  ];
}

/** What is spent from the stop: an amount a month after tax, or a PLSA level (RULES.plsa ÷ 12 by household). */
export const SPEND_FIELDS = [
  { path: 'spend.kind', type: 'choice', options: ['amount', 'level'], default: 'amount', group: 'spend' },
  { path: 'spend.amount', type: 'money', min: 1, max: 50_000, required: true, when: { 'spend.kind': 'amount' }, group: 'spend',
    boundaries: [1, 500, 1_200, 1_867, 2_608, 3_592, 4_917, 10_000, 50_000] },                                                    // PLSA 2024 ÷ 12
  { path: 'spend.level', type: 'choice', options: ['minimum', 'moderate', 'comfortable'], required: true, when: { 'spend.kind': 'level' }, group: 'spend' }
];

/** The PLSA level as £ a month, to the pound. */
export function spendLevelAMonth(household, level) {
  const table = RULES.plsa[household === 'couple' ? 'couple' : 'single'];
  return Math.round(table[level] / 12);
}

/** The State Pension age, whole years, of a person known by age alone (the birthday taken as today). */
export function statePensionAgeOf(age, today) {
  return wholeStatePensionAge(bornFromAge(age, today));
}

const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
const sortedUnique = (list) => [...new Set(list)].sort((a, b) => a - b);

/** The ages of `list` that lie within [lo, hi], whole, sorted, no repeats. */
function clipped(list, lo, hi) {
  return sortedUnique(list.filter((a) => isNum(a) && Number.isInteger(a) && a >= lo && a <= hi));
}

/**
 * The stop ages an A result carries (conflict 31). Whole ages, sorted, no repeats, within [you.age, RULES.stopAgeMax].
 *   detail 'chart' — stop.kind 'age': the named age, two before, two after, five on, the State Pension age, and — when
 *                    the named age does not last and no age before it shown does — the first later age that does;
 *                    stop.kind 'ages': today's age, 55, 57, 60, 62, 65, 67, the State Pension age, and the earliest age that worked.
 *   detail 'all'   — every whole age from max(you.age, 50) to 75, plus today's age, the named age and that earliest
 *                    age (so the shown row is always among the rows, even under 50: the reviewers' finding, 1 Oct 2026).
 * Tests may pass env.ages: exactly those ages (sorted, no repeats), clipped the same way.
 * @param {object} inputs   checked inputs of SCHEMA_A
 * @param {{ today: string, ages?: number[] }} env
 * @param {'chart' | 'all'} [detail]
 * @param {number|null} [earliestYes]   the earliest age at which the spending lasted in 9 in 10 lives ("show me ages"),
 *   or the first age after the one named that did (an age named that does not last); null when there is none
 */
export function agesToShow(inputs, env, detail = 'chart', earliestYes = null) {
  const you = inputs && inputs.you && isNum(inputs.you.age) ? inputs.you.age : null;
  if (you === null) return [];
  const lo = you;
  const hi = RULES.stopAgeMax;
  if (env && Array.isArray(env.ages)) return clipped(env.ages, lo, hi);
  const stop = inputs.stop || {};
  const yes = isNum(earliestYes) ? [earliestYes] : [];
  if (detail === 'all') {
    const from = Math.max(you, 50);
    const all = [you, ...(isNum(stop.age) ? [stop.age] : []), ...yes];   // the named age and the earliest are always rows, even under 50
    for (let a = from; a <= hi; a++) all.push(a);
    return clipped(all, lo, hi);
  }
  const spAge = statePensionAgeOf(you, env.today);
  if (stop.kind === 'ages' || !isNum(stop.age)) {
    return clipped([you, 55, 57, 60, 62, 65, 67, spAge, ...yes], lo, hi);
  }
  const a = stop.age;
  return clipped([a - 2, a - 1, a, a + 1, a + 2, a + 5, spAge, ...yes], lo, hi);
}

/** Today's pay-in into the pension for `who`: the total, or own + employer when split. */
function payInNow(person) {
  const p = person && person.payIn;
  if (!p) return 0;
  if (p.kind === 'split') return (isNum(p.own) ? p.own : 0) + (isNum(p.employer) ? p.employer : 0);
  return isNum(p.total) ? p.total : 0;
}

/**
 * B's grid (conflict 37; step 4 brief section 10, J9: built around the answer): rows are the stop age, two before and
 * five after, and the stop-later lever's age when it is further on, within (you.age, 75]; columns are today's household
 * pay-in and four more up to the pay-in that gets there (evenly spaced in whole £10, the last one that pay-in) — or,
 * when today's is enough or none gets there, four steps of £100 (£50 when today's is under £500). Never above the
 * household's ceiling (SAVING.payInCeiling a person).
 * @param {{ stopLater?: number|null, needed?: number|null }} [around]   the answer's stop-later age and pay-in that gets there
 * @returns {{ ages: number[], payIns: number[] }}
 */
export function gridToShow(inputs, env, around = {}) {
  const you = inputs && inputs.you && isNum(inputs.you.age) ? inputs.you.age : null;
  const stop = inputs && inputs.stop && isNum(inputs.stop.age) ? inputs.stop.age : null;
  if (you === null || stop === null) return { ages: [], payIns: [] };
  const later = around && isNum(around.stopLater) ? [around.stopLater] : [];
  const ages = clipped([stop - 2, stop - 1, stop, stop + 1, stop + 2, stop + 3, stop + 4, stop + 5, ...later], you + 1, RULES.stopAgeMax);
  const couple = inputs.household === 'couple';
  const now = payInNow(inputs.you) + (couple ? payInNow(inputs.partner) : 0);
  const ceiling = SAVING.payInCeiling * (couple ? 2 : 1);
  const needed = around && isNum(around.needed) ? around.needed : null;
  const payIns = [];
  if (needed !== null && needed > now && needed <= ceiling) {
    const step = Math.max(10, Math.ceil((needed - now) / 4 / 10) * 10);
    for (let j = 0; j < 4; j++) { const p = now + j * step; if (p < needed) payIns.push(p); }
    payIns.push(needed);
  } else {
    const step = now < 500 ? 50 : 100;
    for (let j = 0; j < 5; j++) { const p = now + j * step; if (p <= ceiling) payIns.push(p); }
  }
  return { ages, payIns };
}

/**
 * Whether money first taken at `startAge` (your age) comes before ANY of the household's pensions can be touched, with
 * no savings to live on meanwhile: C's start-not-before-access rule, person by person — the partner's pension too (the
 * reviewers' finding, 1 Oct 2026: "you" with no pot and a partner whose pension was closed got £0 a month) — and A's and
 * B's hand-over to C. `people`: [{ age, pension }] with you first; `pension` is true for a pot, or one being paid into.
 * A pension is closed at the start when its holder is then under the earliest pension age of that day (55 before 6 April
 * 2028, 57 from then). With any pension open at the start, or savings, the start stands.
 */
export function startBeforeEveryPension(people, savings, startAge, today) {
  const you = people && people[0];
  if (!you || !isNum(you.age) || !isNum(startAge) || typeof today !== 'string') return false;
  const holders = people.filter((p) => p && p.pension && isNum(p.age));
  if (!holders.length || savings > 0) return false;
  const S = Math.max(0, startAge - you.age);
  const opens = accessAgeOn(addYears(today, S));
  return holders.every((p) => p.age + S < opens);
}

/**
 * C's people as its start rules read them, from flat values ({ 'you.age': 55, … } — checked or parsed): you first, the
 * partner for a couple; `pension` for a pot or "still paying in" answered yes, `payingIn` for the latter.
 */
export function peopleFromValues(values) {
  const v = values || {};
  const one = (who) => ({ who, age: v[`${who}.age`], pension: v[`${who}.pot`] > 0 || v[`${who}.payIn.has`] === 'yes', payingIn: v[`${who}.payIn.has`] === 'yes' });
  return v.household === 'couple' && isNum(v['partner.age']) ? [one('you'), one('partner')] : [one('you')];
}

/** Your age when the first of the household's pensions can be touched (no earlier than today): what that error names. */
export function earliestPensionStart(people, today) {
  const you = people && people[0];
  if (!you || !isNum(you.age)) return null;
  const holders = people.filter((p) => p && p.pension && isNum(p.age));
  if (!holders.length) return Math.max(you.age, firstOpenAge(you.age, today));
  return Math.max(you.age, Math.min(...holders.map((p) => you.age + firstOpenAge(p.age, today) - p.age)));
}

/**
 * Who of the household would still be paying in past 75 at a start (your age `startAge`): the tax the government adds
 * back stops at 75, and A's and B's stop age stops there too (C's pay-in-past-75 rules, the reviewers' finding, 1 Oct
 * 2026). `people`: [{ who, age, payingIn }] with you first. → the `who`s, in order.
 */
export function payingInPast75(people, startAge) {
  const you = people && people[0];
  if (!you || !isNum(you.age) || !isNum(startAge)) return [];
  const S = startAge - you.age;
  return people.filter((p) => p && p.payingIn && isNum(p.age) && p.age + S > RULES.stopAgeMax).map((p) => p.who);
}

/**
 * Whether a hand-over to C from A or B at this stop age works, and whether C then shows the same careful figure
 * (step 4 brief section 10, J10). `ok`: C's own rules take the age — a start before any of the household's pensions can
 * be touched needs savings to live on meanwhile (startBeforeEveryPension, the partner too), and no one may still be
 * paying in past 75. `same`: C asks nothing A and B ask beyond it — the saving risk is the one risk, the charge is 0.5%,
 * nothing goes into savings each month, no part-time work.
 */
export function handOverToC(inputs, stopAge, today) {
  const you = inputs && inputs.you;
  if (!you || !isNum(you.age) || !isNum(stopAge)) return { ok: false, same: false };
  const couple = inputs.household === 'couple' && inputs.partner && isNum(inputs.partner.age);
  const people = (couple ? ['you', 'partner'] : ['you']).map((who) => ({
    who, age: inputs[who].age, pension: (inputs[who].pot || 0) > 0 || payInTotalOf(inputs, who) > 0, payingIn: payInTotalOf(inputs, who) > 0
  }));
  const ok = stopAge >= you.age && !startBeforeEveryPension(people, inputs.savings || 0, stopAge, today) && !payingInPast75(people, stopAge).length;
  const same = (inputs.savingRisk || 'balanced') === (inputs.risk || 'balanced') && Math.abs((isNum(inputs.charge) ? inputs.charge : 0.5) - SAVING.charge * 100) < 1e-9
    && !((inputs.savingsIn || 0) > 0) && !(inputs.partTime && inputs.partTime.has);
  return { ok, same };
}

/**
 * True when the draft describes someone who has stopped: stop.age ≤ you.age and you.age at or past their State Pension
 * age (the birthday taken as today). A and B then show the retired view and no saver word. A draft with no stop age
 * ("show me ages") is never retired.
 */
export function alreadyStopped(inputs, today) {
  const you = inputs && inputs.you && isNum(inputs.you.age) ? inputs.you.age : null;
  const stop = inputs && inputs.stop && isNum(inputs.stop.age) ? inputs.stop.age : null;
  if (you === null || stop === null || typeof today !== 'string') return false;
  return stop <= you && you >= statePensionAgeOf(you, today);
}
