/**
 * The parts of the input lists that questions A and B share (step 4 brief 4.1, conflict 19). No words here:
 * labels, help and errors are in src/v7/copy/{a,b}.js, keyed by path.
 *
 *   personFields(who)            C's person block for `who`, by value (tests/v7/a/schema.test.js asserts it deep-equals SCHEMA_C's)
 *   saverFields(who, opts)       the pay-in block: payIn.kind / total / own / employer, and alreadyDrawing under more detail
 *   moreFields()                 savingsIn, savingRisk, risk, charge, endAge
 *   chargeField()                the one fund and platform charge, percent a year (6.19.0): in C's "more" too
 *   isaGrowthField(group)        how ISAs and savings grow (6.22.0): "Mostly cash" or "Invested like my pension", in C, A, B
 *   savingsGrowthAsked(values)   whether there is money in savings for that choice to grow (it is asked, and defaulted, then)
 *   savingsGrowthDefault(values) its default rule: "Mostly cash" with money in savings, else none (today's inputs, key for key)
 *   SPEND_FIELDS                 spend.kind / amount / level — the same paths in A and B
 *   shapeFields(base)            what is spent changing with age: <base>.then / fallsPct / steps (A, B 'spend'; C 'shape')
 *   shapeOfInputs(inputs, base, first)   the household model's shape from checked inputs, or null (spending-shape.md 3)
 *   agesToShow(inputs, env, detail, earliestYes)   the stop ages an A result carries (conflict 31): the asked person's
 *   gridToShow(inputs, env)      the rows and columns of B's choices step (conflict 37): the asked person's stop ages
 *   alreadyStopped(inputs, today)   the retired view's rule (conflict 44): also when a couple have both stopped
 *
 * Couples who stop work in different years (research/v7/couples-different-years.md 2–3, 5.4):
 *   stopKindField(question)      A's stop question (an age, ages to look at, or "I've already stopped"); B's (an age or
 *                                "I've already stopped"; null when the owner's switch 3 is off)
 *   partnerStopFields(question)  "When does your partner stop work?" — partner.stop.kind and partner.stop.age
 *   untilBothStopField(question) "Until you've both stopped, their pay covers…" — half, all or none of what you spend
 *   taxFreeFields(question)      "Already had the tax-free part?" — for someone who has stopped only
 *   askedAbout(inputs)           who A's and B's answer is about: 'you', or 'partner' when you have already stopped
 *   stopYearsOf(inputs, askedStop)  each person's whole years until their own stop, from checked inputs of A, B or C
 *   stopYearsFromValues(values)  the same from flat values, as validate.js reads them
 *   payCoversOf(answer)          the pay line's answer as a share of what is spent (not answered: the owner's default)
 *   stopWorkOf, stopWorksOf, savingsInShares, untilBothStopOf   the toHousehold mappings' shared pieces (3.4)
 *   apartCheckYear(stops, payCovers)   the year C's start rule is checked at: where the pay stops covering
 *
 * Pure: no clock (env.today is the date), no storage, no screen.
 */
import { RULES, SAVING } from './rules.js';
import { bornFromAge, wholeStatePensionAge, firstOpenAge, APART, PAY_COVERS } from './household.js';
import { CHARGES_LIMITS } from '../../services/Charges.js';
import { ISA_GROWTH_VALUES } from '../../services/IsaGrowth.js';
import { SHAPE_LIMITS, THEN, isTrivial } from './shape.js';

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
 * The `whenNot` that hides a person's pay-in block once they have stopped (couples-different-years.md 3.1): nothing goes
 * into a pension after a stop. The partner's: "They already have". Yours (A and B): "I've already stopped" — there only
 * while the owner's switch 3 offers it, so a list never names a choice it does not have.
 */
function stoppedNot(who) {
  if (who === 'partner') return { 'partner.stop.kind': 'already' };
  return APART.askAboutPartner ? { 'stop.kind': 'already' } : {};
}
/** A field with `whenNot` only when there is something in it. */
const hidden = (f, whenNot) => (Object.keys(whenNot).length ? { ...f, whenNot } : f);

/**
 * The pay-in block (conflict 11): one short-form figure, what lands in the pension each month (employer's part and the
 * tax top-up inside), or "split it up" into own and employer, whose sum is the total. `alreadyDrawing` feeds the
 * £10,000 warning only. B passes { payInRequired: true }. Hidden once the person has stopped (stoppedNot): the list must
 * declare the stop question first.
 */
export function saverFields(who, { payInRequired = false } = {}) {
  const w = who === 'partner' ? { household: 'couple' } : {};
  const not = stoppedNot(who);
  return [
    field({ path: `${who}.payIn.kind`, type: 'choice', options: ['total', 'split'], default: 'total', group: who }, w),
    field({ path: `${who}.payIn.total`, type: 'money', min: 0, max: SAVING.payInCeiling, ...(payInRequired ? { required: true } : { default: 0 }),
      group: who, boundaries: [0, 1, 100, 500, 700, 1_500, 5_000, 10_000] }, { ...w, [`${who}.payIn.kind`]: 'total' }),
    field({ path: `${who}.payIn.own`, type: 'money', min: 0, max: SAVING.payInCeiling, required: true, group: who,
      boundaries: [0, 1, 250, 5_000, 10_000] }, { ...w, [`${who}.payIn.kind`]: 'split' }),
    field({ path: `${who}.payIn.employer`, type: 'money', min: 0, max: SAVING.payInCeiling, required: true, group: who,
      boundaries: [0, 1, 250, 5_000, 10_000] }, { ...w, [`${who}.payIn.kind`]: 'split' }),
    field({ path: `${who}.alreadyDrawing`, type: 'yesNo', default: false, group: 'more' }, w)
  ].map((f) => hidden(f, not));
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
  const at = (path) => { const { when, whenNot, ...f } = saver.find((x) => x.path === `${who}.payIn.${path}`); void when; void whenNot; return f; };
  // The partner's block is hidden when they have already stopped (couples-different-years.md 3.1); yours never is in C
  // ("you" stop when the money starts, and "still paying in?" says what goes in until then).
  const not = who === 'partner' ? stoppedNot('partner') : {};
  return [
    field({ path: `${who}.payIn.has`, type: 'choice', options: ['no', 'yes'], group: who }, w),
    field({ ...at('kind'), default: 'split' }, has),
    field({ ...at('total'), required: true, default: undefined }, { ...has, [`${who}.payIn.kind`]: 'total' }),
    field(at('own'), { ...has, [`${who}.payIn.kind`]: 'split' }),
    field(at('employer'), { ...has, [`${who}.payIn.kind`]: 'split' })
  ].map((f) => hidden(Object.fromEntries(Object.entries(f).filter(([, v]) => v !== undefined)), not));
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

/**
 * Fund and platform charges (6.19.0; the owner, 1 Oct 2026: "Yes half a percent. But put it as a config parameter
 * somewhere"): ONE setting, percent a year, under "Add more detail" in C, A and B alike — today's planner's range and
 * steps (services/Charges.js CHARGES_LIMITS: 0 to 3 in steps of 0.05) and its default (0.5, SAVING.chargesPct). It becomes
 * the household's `chargesPct` and is taken monthly while saving AND while drawing (saving.js, toEngine.js), from what
 * is held in funds and cash; never from the State Pension or a final-salary pension.
 */
export function chargeField() {
  return { path: 'charge', type: 'percent', min: CHARGES_LIMITS.min, max: CHARGES_LIMITS.max, step: CHARGES_LIMITS.step, default: SAVING.chargesPct, group: 'more',
    boundaries: [CHARGES_LIMITS.min, CHARGES_LIMITS.step, SAVING.chargesPct, 1, CHARGES_LIMITS.max] };
}

/**
 * How ISAs and savings grow (6.22.0; research/saver-lock-and-savings-growth.md 3.6; the owner, 2 Oct 2026): ONE choice in
 * C, A and B alike — "Mostly cash" ('cash': last year's rise in prices less 1%, never below nothing, as the pension's own
 * cash grows) or "Invested like my pension" ('invested': the pension's mix, in the same futures) — taken while saving AND
 * while drawing. It becomes the household's `isaGrowth` (household.js), which the saving years (saving.js) and every
 * drawing run (toEngine.js) read; today's planner has the same setting (services/IsaGrowth.js).
 *
 * It is asked only once there is money in savings (savingsGrowthAsked): the savings box above £0, or — A and B — money
 * going into savings each month. Its default is a rule (savingsGrowthDefault): "Mostly cash" then, and nothing at all
 * otherwise, so the checked inputs of a household with no savings are today's, key for key (with nothing in savings
 * there is nothing for the choice to grow). Declared after the boxes the rule reads (A and B: after savingsIn) and in the
 * savings box's own group; drawn straight under the savings box (the screens' layouts).
 */
export function isaGrowthField(group) {
  return { path: 'isaGrowth', type: 'choice', options: [...ISA_GROWTH_VALUES], default: { rule: 'isaGrowth' }, group };
}

/** Whether there is money in savings to grow, from flat values (checked, or parsed as typed): savings, or savings a month. */
export function savingsGrowthAsked(values) {
  const v = values || {};
  return (isNum(v.savings) && v.savings > 0) || (isNum(v.savingsIn) && v.savingsIn > 0);
}

/** The default of isaGrowthField: "Mostly cash" (RULES.isaGrowthDefault) once there is money in savings; else none. */
export function savingsGrowthDefault(values) {
  return savingsGrowthAsked(values) ? RULES.isaGrowthDefault : undefined;
}

/** "Add more detail": savings in a month, the two risk levels, the one charge (saving and drawing), the end age. */
export function moreFields() {
  return [
    { path: 'savingsIn', type: 'money', min: 0, max: 10_000, default: 0, group: 'more', boundaries: [0, 1, 500, 1_667, 10_000] },   // a month, into ISAs and savings
    { path: 'savingRisk', type: 'choice', options: ['cautious', 'balanced', 'adventurous'], default: 'balanced', group: 'more' },
    { path: 'risk', type: 'choice', options: ['cautious', 'balanced', 'adventurous'], default: 'balanced', group: 'more' },
    chargeField(),                                                                                                                       // a year, saving and drawing
    { path: 'endAge', type: 'age', min: 75, max: 105, default: 95, group: 'more', boundaries: [75, 95, 100, 105] }
  ];
}

/*
 * ---- Couples who stop work in different years (research/v7/couples-different-years.md 2.1–2.3, 3.1) --------------------
 * None of these questions has a default: not answered is today's meaning (the partner stops when you do, nothing
 * already taken), so the checked inputs of a form that never answers them are today's, key for key.
 */

/** The stop ages a partner may be given: the same boundaries as the stop age of A and B. */
const STOP_AGE_BOUNDARIES = [18, 50, 52, 53, 54, 55, 56, 57, 58, 60, 62, 65, 66, 67, 68, 75];

/**
 * The stop question. A: an age in mind (the default), "show me ages", or — for a couple, while the owner's switch 3 is on
 * — "I've already stopped", which turns the answer to the partner. B: an age (not answered) or "I've already stopped";
 * null when switch 3 is off (B then asks only the age, as before).
 */
export function stopKindField(question) {
  const already = APART.askAboutPartner ? ['already'] : [];
  if (question === 'a') return { path: 'stop.kind', type: 'choice', options: ['age', 'ages', ...already], default: 'age', group: 'stop' };
  return already.length ? { path: 'stop.kind', type: 'choice', options: ['age', ...already], group: 'stop' } : null;
}

/**
 * What "When does your partner stop work?" offers in each question: when you do (C: when you start taking money), they
 * already have, at an age — and in A, for the partner of someone who has stopped, "show me ages" (switch 3).
 */
export function partnerStopOptions(question) {
  return ['same', 'already', 'age', ...(question === 'a' && APART.askAboutPartner ? ['ages'] : [])];
}

/** "When does your partner stop work?" and the age (couples-different-years.md 2.1). In the partner block, after the person. */
export function partnerStopFields(question) {
  return [
    { path: 'partner.stop.kind', type: 'choice', options: partnerStopOptions(question), group: 'partner', when: { household: 'couple' } },
    { path: 'partner.stop.age', type: 'age', min: 18, max: RULES.stopAgeMax, required: true, group: 'partner', boundaries: STOP_AGE_BOUNDARIES,
      when: { household: 'couple', 'partner.stop.kind': 'age' } }
  ];
}

/**
 * "Until you've both stopped, their pay covers: half of what you spend / all of it / none of it" — asked only once the
 * partner's stop is their own. Not answered is the owner's default (household.js APART.payCoversDefault). Its `when`
 * names the partner's answer first and the household last: the screen draws a field inside the last choice its `when`
 * names, never inside a list — this line is drawn on its own, under the question, with Change.
 */
export function untilBothStopField(question) {
  return { path: 'untilBothStop', type: 'choice', options: Object.keys(PAY_COVERS), group: 'partner',
    when: { 'partner.stop.kind': partnerStopOptions(question).filter((o) => o !== 'same'), household: 'couple' } };
}

/**
 * "Already had the tax-free part of your pension?" (More detail) — only for someone who has stopped: you in C from now,
 * you in A and B with "I've already stopped" (switch 3), the partner with "They already have". Not answered: not taken.
 */
export function taxFreeFields(question) {
  const you = question === 'c' ? { 'start.kind': 'now' } : APART.askAboutPartner ? { 'stop.kind': 'already' } : null;
  return [
    ...(you ? [{ path: 'you.taxFreeTaken', type: 'yesNo', group: 'more', when: you }] : []),
    { path: 'partner.taxFreeTaken', type: 'yesNo', group: 'more', when: { household: 'couple', 'partner.stop.kind': 'already' } }
  ];
}

/** Part-time work after the stop (A): it belongs to the one stopping, so it is hidden when you have already stopped. */
export function partTimeHidden() {
  return stoppedNot('you');
}

/** What is spent from the stop: an amount a month after tax, or a PLSA level (RULES.plsa ÷ 12 by household). */
export const SPEND_FIELDS = [
  { path: 'spend.kind', type: 'choice', options: ['amount', 'level'], default: 'amount', group: 'spend' },
  { path: 'spend.amount', type: 'money', min: 1, max: 50_000, required: true, when: { 'spend.kind': 'amount' }, group: 'spend',
    boundaries: [1, 500, 1_200, 1_867, 2_608, 3_592, 4_917, 10_000, 50_000] },                                                    // PLSA 2024 ÷ 12
  { path: 'spend.level', type: 'choice', options: ['minimum', 'moderate', 'comfortable'], required: true, when: { 'spend.kind': 'level' }, group: 'spend' }
];

/**
 * What is spent changing with age (research/v7/spending-shape.md 3.2): A and B under `spend` (later steps in £ a month),
 * C under `shape` (later steps as a share of what it works out you start on, 100 = the same). `<base>.then` — what the
 * first amount does: 'level', 'falls' (by `<base>.fallsPct`% a year) or 'glides' (moves evenly to the first step) — and
 * `<base>.steps`, the later steps (validate.js type `steps`: each { fromAge, perMonth | share, then, fallsPct? }).
 * NONE has a default: not answered is the same every year, and the checked inputs of a form that never answers them are
 * today's, key for key (the rule C's payIn.has set). Group 'shape': drawn by the spending shape's own block, never as
 * ordinary boxes. The rule 'shape-steps' (validate.js) checks the steps against the stop, the start and the end.
 */
export function shapeFields(base) {
  const unit = base === 'shape' ? 'share' : 'perMonth';
  const falls = SHAPE_LIMITS.fallsPct;
  return [
    { path: `${base}.then`, type: 'choice', options: [...THEN], group: 'shape' },
    { path: `${base}.fallsPct`, type: 'percent', min: falls.min, max: falls.max, step: falls.step, required: true, when: { [`${base}.then`]: 'falls' }, group: 'shape',
      boundaries: [falls.min, 1, 2.5, falls.max] },
    { path: `${base}.steps`, type: 'steps', unit, group: 'shape' }
  ];
}

/**
 * The household model's shape (household.shape; shared/shape.js) from checked inputs of A, B (`base` 'spend', the first
 * amount `first` £ a month) or C (`base` 'shape', shares): null when nothing of it was answered or it never changes
 * (shape.js isTrivial) — a household with no shape is today's, key for key.
 */
export function shapeOfInputs(inputs, base, first) {
  const s = inputs && inputs[base];
  if (!s || typeof s !== 'object') return null;
  const unit = base === 'shape' ? 'share' : 'perMonth';
  const start = s.then === 'falls' ? { then: 'falls', fallsPct: s.fallsPct } : s.then === 'glides' ? { then: 'glides' } : { then: 'level' };
  const steps = (Array.isArray(s.steps) ? s.steps : []).map((x) => ({
    fromAge: x.fromAge, [unit]: x[unit], then: x.then || 'level', ...(x.then === 'falls' ? { fallsPct: x.fallsPct } : {})
  }));
  const shape = { unit, ...(unit === 'perMonth' ? { first } : {}), start, steps };
  if (unit === 'perMonth' && !(first > 0)) return null;
  return isTrivial(shape, unit === 'share' ? 1 : first) ? null : shape;
}

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
  // the person the answer is about (couples-different-years.md 5.2): you, or your partner when you have already stopped
  const asked = askedAbout(inputs);
  const person = inputs && inputs[asked];
  const you = person && isNum(person.age) ? person.age : null;
  if (you === null) return [];
  const lo = you;
  const hi = RULES.stopAgeMax;
  if (env && Array.isArray(env.ages)) return clipped(env.ages, lo, hi);
  const stop = (asked === 'partner' ? person.stop : inputs.stop) || {};
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
  // the rows are the asked person's stop ages (couples-different-years.md 5.3): yours, or your partner's when you have stopped
  const asked = askedAbout(inputs);
  const person = inputs && inputs[asked];
  const you = person && isNum(person.age) ? person.age : null;
  const own = asked === 'partner' ? (person && person.stop) || {} : (inputs && inputs.stop) || {};
  const stop = isNum(own.age) ? own.age : null;
  if (you === null || stop === null) return { ages: [], payIns: [] };
  const later = around && isNum(around.stopLater) ? [around.stopLater] : [];
  const ages = clipped([stop - 2, stop - 1, stop, stop + 1, stop + 2, stop + 3, stop + 4, stop + 5, ...later], you + 1, RULES.stopAgeMax);
  const couple = inputs.household === 'couple';
  const now = payInNow(inputs.you) + (couple ? payInNow(inputs.partner) : 0);
  // £10,000 a month for each person still saving (a stopped person pays nothing in); the same year: each of you
  const stops = stopYearsOf(inputs);
  const apart = couple && isNum(stops.partner) && stops.partner !== stops.you;
  const savers = apart ? [stops.you, stops.partner].filter((S) => S > 0).length : couple ? 2 : 1;
  const ceiling = SAVING.payInCeiling * Math.max(1, savers);
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
 * B's hand-over to C. `people`: [{ age, pension, stop? }] with you first; `pension` is true for a pot, or one being paid
 * into. A pension opens from its holder's own stop (`stop`, years from today; your start when not given): the earliest
 * pension age on the day they reach it (55 before 6 April 2028, 57 from then; household.js firstOpenAge), and once open
 * it stays open. The check is made `at` years from today (default: the start) — for a couple stopping apart, where the
 * pay of the one still working stops covering (apartCheckYear); a holder who has not stopped by then has nothing open.
 * With any pension open then, or savings, the start stands. With one stop for everyone this is the check made at the
 * start, exactly as before.
 */
export function startBeforeEveryPension(people, savings, startAge, today, at) {
  const you = people && people[0];
  if (!you || !isNum(you.age) || !isNum(startAge) || typeof today !== 'string') return false;
  const holders = people.filter((p) => p && p.pension && isNum(p.age));
  if (!holders.length || savings > 0) return false;
  const S = Math.max(0, startAge - you.age);
  const T = isNum(at) ? at : S;
  return holders.every((p) => {
    const own = isNum(p.stop) ? p.stop : S;
    return own > T || firstOpenAge(p.age, today, own) > p.age + T;
  });
}

/**
 * C's people as its start rules read them, from flat values ({ 'you.age': 55, … } — checked or parsed): you first, the
 * partner for a couple; `pension` for a pot or "still paying in" answered yes, `payingIn` for the latter; `stop` the whole
 * years from today until they stop (stopYearsFromValues; null when their stop age is not yet given).
 */
export function peopleFromValues(values) {
  const v = values || {};
  const stops = stopYearsFromValues(v);
  const one = (who) => ({ who, age: v[`${who}.age`], pension: v[`${who}.pot`] > 0 || v[`${who}.payIn.has`] === 'yes', payingIn: v[`${who}.payIn.has`] === 'yes', stop: stops[who] ?? null });
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
 * Who of the household would still be paying in past 75 at their stop (your start `startAge`, or a person's own `stop`,
 * years from today): the tax the government adds back stops at 75, and A's and B's stop age stops there too (C's
 * pay-in-past-75 rules, the reviewers' finding, 1 Oct 2026). `people`: [{ who, age, payingIn, stop? }] with you first.
 * → the `who`s, in order.
 */
export function payingInPast75(people, startAge) {
  const you = people && people[0];
  if (!you || !isNum(you.age) || !isNum(startAge)) return [];
  const S = startAge - you.age;
  return people.filter((p) => p && p.payingIn && isNum(p.age) && p.age + (isNum(p.stop) ? p.stop : S) > RULES.stopAgeMax).map((p) => p.who);
}

/**
 * Whether a hand-over to C from A or B at this stop age works, and whether C then shows the same careful figure
 * (step 4 brief section 10, J10). `ok`: C's own rules take the age — a start before any of the household's pensions can
 * be touched needs savings to live on meanwhile (startBeforeEveryPension, the partner too), and no one may still be
 * paying in past 75. `same`: C asks nothing A and B ask beyond it — the saving risk is the one risk, nothing goes into
 * savings each month, no part-time work. (The charge no longer counts: from 6.19.0 C asks it too, and it is carried.)
 */
export function handOverToC(inputs, stopAge, today) {
  const you = inputs && inputs.you;
  if (!you || !isNum(you.age) || !isNum(stopAge)) return { ok: false, same: false };
  const couple = inputs.household === 'couple' && inputs.partner && isNum(inputs.partner.age);
  // Each person at their own stop, the asked person's at `stopAge` (couples-different-years.md 5.4). "I've already
  // stopped" carries to C as "from now", which C takes as it is: only the partner's age is checked against today.
  const asked = askedAbout(inputs);
  const stops = stopYearsOf(inputs, stopAge);
  const people = (couple ? ['you', 'partner'] : ['you']).map((who) => ({
    who, age: inputs[who].age, pension: (inputs[who].pot || 0) > 0 || payInTotalOf(inputs, who) > 0, payingIn: payInTotalOf(inputs, who) > 0, stop: stops[who]
  }));
  const startAge = you.age + stops.you;
  const at = apartCheckYear(stops, payCoversOf(inputs.untilBothStop));
  const ok = asked === 'partner'
    ? stopAge >= inputs.partner.age
    : stopAge >= you.age && !startBeforeEveryPension(people, inputs.savings || 0, startAge, today, at) && !payingInPast75(people, startAge).length;
  const same = (inputs.savingRisk || 'balanced') === (inputs.risk || 'balanced')
    && !((inputs.savingsIn || 0) > 0) && !(inputs.partTime && inputs.partTime.has);
  return { ok, same };
}

/**
 * True when the draft describes someone who has stopped: stop.age ≤ you.age and you.age at or past their State Pension
 * age (the birthday taken as today). A and B then show the retired view and no saver word. A draft with no stop age
 * ("show me ages") is never retired. A couple (couples-different-years.md 2.2): also when you have both stopped ("I've
 * already stopped" and "They already have"); never while the partner is still working — their own stop age after
 * today's, or "show me ages" for them — whose answer it then is. "I've already stopped" for one person is not the retired
 * view: the form says C is their question (already-needs-partner).
 */
export function alreadyStopped(inputs, today) {
  const i = inputs || {};
  const couple = i.household === 'couple' && i.partner && isNum(i.partner.age);
  const theirs = (couple && i.partner.stop) || {};
  const partnerWorking = theirs.kind === 'ages' || (theirs.kind === 'age' && isNum(theirs.age) && theirs.age > i.partner.age);
  if (i.stop && i.stop.kind === 'already') return Boolean(couple) && theirs.kind === 'already';
  const you = i.you && isNum(i.you.age) ? i.you.age : null;
  const stop = i.stop && isNum(i.stop.age) ? i.stop.age : null;
  if (you === null || stop === null || typeof today !== 'string') return false;
  return stop <= you && you >= statePensionAgeOf(you, today) && !partnerWorking;
}

/**
 * Who A's and B's answer is about (couples-different-years.md 5.2, owner's switch 3): 'partner' when you have already
 * stopped and your partner has not, else 'you'. "You" stays the person at the keyboard either way.
 */
export function askedAbout(inputs) {
  const i = inputs || {};
  return APART.askAboutPartner && i.household === 'couple' && i.partner && i.stop && i.stop.kind === 'already' ? 'partner' : 'you';
}

/**
 * Each person's whole years from today until they stop work, from checked inputs of A, B or C (couples-different-years.md
 * 3.4, 5.2), never below 0:
 *   you      C: the start (start.age − age), or 0 from now. A and B: 0 with "I've already stopped"; else the stop age
 *            minus your age — `askedStop` when the answer is about you (A's rows), today's age for "show me ages".
 *   partner  not answered, or "when you do": yours (one year for both — today's rule). "They already have": 0. An age:
 *            that age minus theirs. "Show me ages" (A, you stopped): 0, or `askedStop` minus theirs — the asked person's
 *            stop, as A's rows sweep it.
 * → { you, partner? } — partner for a couple only.
 */
export function stopYearsOf(inputs, askedStop) {
  const i = inputs || {};
  const youAge = i.you && isNum(i.you.age) ? i.you.age : null;
  if (youAge === null) return { you: 0 };
  const asked = askedAbout(i);
  const own = (age, stopAge) => Math.max(0, stopAge - age);
  let you;
  if (!i.stop && i.start) you = i.start.kind === 'age' && isNum(i.start.age) ? own(youAge, i.start.age) : 0;
  else if (i.stop && i.stop.kind === 'already') you = 0;
  else if (asked === 'you' && isNum(askedStop)) you = own(youAge, askedStop);
  else you = i.stop && isNum(i.stop.age) ? own(youAge, i.stop.age) : 0;
  const couple = i.household === 'couple' && i.partner && isNum(i.partner.age);
  if (!couple) return { you };
  const p = i.partner;
  const theirs = p.stop || {};
  let partner;
  if (asked === 'partner' && isNum(askedStop)) partner = own(p.age, askedStop);
  else if (theirs.kind === 'already' || theirs.kind === 'ages') partner = 0;
  else if (theirs.kind === 'age' && isNum(theirs.age)) partner = own(p.age, theirs.age);
  else partner = you;
  return { you, partner };
}

/**
 * The same from flat values (checked or parsed, as validate.js reads them): { you, partner? }, each whole years or null
 * while the stop age that decides it is not yet given. C's values carry `start.kind` (always: it has a default rule);
 * A's and B's carry `stop.*`.
 */
export function stopYearsFromValues(values) {
  const v = values || {};
  const youAge = v['you.age'];
  if (!isNum(youAge)) return { you: null };
  const own = (age, stopAge) => Math.max(0, stopAge - age);
  let you;
  if ('start.kind' in v) you = v['start.kind'] === 'age' && isNum(v['start.age']) ? own(youAge, v['start.age']) : 0;
  else if (v['stop.kind'] === 'already' || v['stop.kind'] === 'ages') you = 0;
  else you = isNum(v['stop.age']) ? own(youAge, v['stop.age']) : null;
  const partnerAge = v['partner.age'];
  if (v.household !== 'couple' || !isNum(partnerAge)) return { you };
  const kind = v['partner.stop.kind'];
  let partner;
  if (kind === 'already' || kind === 'ages') partner = 0;
  else if (kind === 'age') partner = isNum(v['partner.stop.age']) ? own(partnerAge, v['partner.stop.age']) : null;
  else partner = you;
  return { you, partner };
}

/**
 * A person's stop in the household model (couples-different-years.md 3.4): "I've already stopped" / "They already have"
 * → { kind: 'already' }; else their age at their own stop, S whole years from today (stopYearsOf).
 */
export const stopWorkOf = (person, already, S) => (already ? { kind: 'already' } : { kind: 'age', age: person.age + S });

/**
 * A and B: both people's stops in the household model. A partner who stops in your year — however that was said: not
 * answered, "when you do", their age at your stop, or "they already have" while you stop now — is written as before
 * (your kind of stop, their age at it), so a same-year household is today's, key for key; a stop of their own is theirs.
 * → [you, partner?]
 */
export function stopWorksOf(inputs, stops) {
  const youStopped = Boolean(inputs.stop && inputs.stop.kind === 'already');
  const out = [stopWorkOf(inputs.you, youStopped, stops.you)];
  if (isNum(stops.partner)) {
    const theirs = (inputs.partner && inputs.partner.stop) || {};
    out.push(stopWorkOf(inputs.partner, stops.partner === stops.you ? youStopped : theirs.kind === 'already', stops.partner));
  }
  return out;
}

/**
 * What goes into ISAs and savings each month, per person (couples-different-years.md 3.4): one person, all of it; a
 * couple stopping in the same year, half each (as the savings, as before); stopping in different years, split evenly
 * among those still working today, each until their own stop. `stops`: stopYearsOf. → [you, partner?].
 */
export function savingsInShares(savingsIn, stops, couple) {
  if (!couple) return [savingsIn];
  const working = [stops.you > 0, stops.partner > 0];
  if (stops.you === stops.partner || !working.some(Boolean)) return [savingsIn / 2, savingsIn / 2];
  const count = working.filter(Boolean).length;
  return working.map((w) => (w ? savingsIn / count : 0));
}

/** The pay line, answered, as the household's short-form `{ untilBothStop: { payCovers } }`; nothing when not answered. */
export function untilBothStopOf(inputs) {
  const answer = inputs && inputs.untilBothStop;
  return Object.prototype.hasOwnProperty.call(PAY_COVERS, answer) ? { untilBothStop: { payCovers: PAY_COVERS[answer] } } : {};
}

/**
 * The pay line's answer ('half' | 'all' | 'none') as the share of what the household spends the pay of the one still
 * working covers until both have stopped; not answered (or not a known answer) is the owner's default, half
 * (household.js APART.payCoversDefault).
 */
export function payCoversOf(answer) {
  return Object.prototype.hasOwnProperty.call(PAY_COVERS, answer) ? PAY_COVERS[answer] : PAY_COVERS[APART.payCoversDefault];
}

/**
 * The year (whole years from today) at which C's start rule asks whether anything can be lived on
 * (couples-different-years.md 3.3): the second stop while the pay of the one still working covers what the stopped
 * person's money cannot — "All of it" always, "Half" while the owner's switch 2 says the pay makes up a gap — else the
 * first stop ("None of it", or switch 2 off). One stop for everyone: that stop. `stops`: { you, partner? } (nulls skipped).
 */
export function apartCheckYear(stops, payCovers, coversGap = APART.payCoversGap) {
  const known = Object.values(stops || {}).filter(isNum);
  if (!known.length) return null;
  const first = Math.min(...known);
  const second = Math.max(...known);
  return payCovers >= 1 || (payCovers > 0 && coversGap) ? second : first;
}
