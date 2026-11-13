/**
 * The plan seed (research/v7/save-as-plan.md, Contract C.1): one plain JSON object that carries an answer of C, A or B
 * to today's planner, which makes a NEW plan from it. Pure: the time it was made comes in (`createdAt`, from V7's
 * effect clock), the date is env.today; no storage, no screen. V7's effect (src/v7/effects/planSeed.js) writes it to
 * localStorage under SEED_KEY and opens ../#new-plan; nothing here ever puts a figure in an address.
 *
 *   SEED_KEY, SEED_VERSION, SEED_MAX_AGE_MS
 *   keepable(source, result)            → { ok: true } | { ok: false, why }   what the answer must be to be saved
 *   buildPlanSeed({ source, result, env, name, budget, spendHow, createdAt, payIn })   → the seed, or null when not keepable
 *   atEnough(result)                    → B's answer as if asked paying in what would be on course, or null
 *   seedProblems(seed)                  → [] for a seed that can go to Firestore almost unchanged (no undefined, no
 *                                         functions, no Dates, no numbers that are not finite, no arrays inside arrays)
 *
 * "Careful" pot = the 1-in-10 low position of the pots at the stop; "middling" = the middle one. Whole £, today's prices.
 * The seed never reads the budget to decide a figure: `spend.perMonth` is the answer's own (C's careful amount; A's and
 * B's spending as typed or the level picked). The budget rides along as a guide (Contract C.5).
 *
 * Seed version 2 (research/v7/couples-different-years.md 6.1): each person carries their OWN stop — `stop` { kind,
 * yearsFromNow }, `ageAtStop`, and `years`, the seed's years less the years between the household's start and their stop,
 * so both plans of a couple end in the same tax year — and `taxFreeQuarter` from "already had the tax-free part". The seed
 * gains `untilBothStop` ({ payCovers } while one of a couple still works after the other has stopped; null otherwise).
 * `stop` and `years` stay the household's: the first stop, and the years from it. Each person's stop is the household's
 * own (stopsOf, from the answer's mapping at the stop it shows), never re-derived here. When everyone stops in the same
 * year the seed is version 1's, key for key, plus those keys (each person's stop and years then the household's, and
 * `untilBothStop` null): tests/v7/keep/planSeed.test.js holds it to the frozen 6.19.0 builder.
 *
 * Seed version 3 (research/v7/spending-shape.md 8): an answer whose spending changes with age (the answer carries `byYear`).
 * Every version 2 field, plus `spend.shape` — the household's shape as it was tested ({ unit: 'perMonth', start: { then,
 * fallsPct? }, steps: [{ fromAge, perMonth, then, fallsPct? }] }: A and B as typed; C at its careful start, to the penny),
 * kept for the record, the name and the description — and each person's `takeHome` rows EXACT TO THE YEAR: one row for
 * each year their after-tax amount changes (one person: what is spent that year, the shape itself; a couple: each one's
 * part that year, from the answer's own year-by-year breakdown), neighbours merged only when equal to the penny. Today's
 * planner turns them into income steps that give the same after-tax amount every year (src/services/PlanSeed.js). A flat
 * spend still writes version 2, byte for byte.
 */
import { toHousehold as toHouseholdC } from '../c/toHousehold.js';
import { toHousehold as toHouseholdA } from '../a/toHousehold.js';
import { toHousehold as toHouseholdB } from '../b/toHousehold.js';
import { toHousehold as toHouseholdD } from '../d/toHousehold.js';
import { stopsOf } from '../shared/household.js';
import { payInParts } from '../shared/schemaParts.js';
import { firstAccessAge, addYears, RULES, LEVEL_DEFAULT } from '../shared/rules.js';
import { shownOf } from '../shared/levels.js';
import { suggestedPlanName, checkPlanName } from '../shared/planName.js';
import { checkSheet, sheetForSeed } from './budgetSheet.js';

export const SEED_KEY = 'pt_v7_plan_seed';
/**
 * 4 from 7.8.0: the answer row is the level's (`answer: { level, levelChosen, shown, chance }`). 2 (6.20.0, each person
 * at their own stop) and 1 are still read (src/services/PlanSeed.js), as written.
 */
export const SEED_VERSION = 4;
/** 5 from 7.8.0 (3 before): what is spent changes with age — written only then (spending-shape.md 8.1); a flat spend is 4. */
export const SEED_VERSION_SHAPE = 5;
/** A seed older than this is discarded unread (Contract C.2). */
export const SEED_MAX_AGE_MS = 24 * 60 * 60 * 1000;
/**
 * Where today's planner leaves what became of a seed, in the tab's session storage, for the V7 page that sent it (the
 * same tab comes Back): { [createdAt]: { outcome: 'made' | 'declined' | 'refused' | 'cleared', name? } }. The same key
 * as src/services/PlanSeed.js RECEIPT_KEY (a test holds them equal).
 */
export const RECEIPT_KEY = 'pt_v7_plan_receipt';

const TO_HOUSEHOLD = { c: toHouseholdC, a: toHouseholdA, b: toHouseholdB, d: toHouseholdD };
const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
const pounds = (n) => Math.round(Number(n) || 0);
const round2 = (n) => Math.round(Number(n) * 100) / 100;
const copy = (v) => JSON.parse(JSON.stringify(v));

/**
 * What an answer must be to be saved as a plan (Contract C.1; open questions 5 and 6): status 'ok'; C not held down by
 * the years before a closed pension opens (closedYears: "change the start age to keep this"); A with the row it shows.
 * An A verdict of "no" is still a try, so it can be saved.
 */
export function keepable(source, result) {
  if (!result || typeof result !== 'object') return { ok: false, why: 'noAnswer' };
  if (result.status !== 'ok') return { ok: false, why: 'notOk' };
  if (!result.inputs || !result.inputs.you || !result.basis) return { ok: false, why: 'noAnswer' };
  if (source === 'c') {
    if (result.closedYears) return { ok: false, why: 'closedYears' };
    if (!shownOf(result) || !isNum(shownOf(result).monthly) || !isNum(result.basis.startAge)) return { ok: false, why: 'noAnswer' };
  } else if (source === 'a') {
    if (!result.shown || !isNum(result.shown.age) || !result.spend) return { ok: false, why: 'noAnswer' };
  } else if (source === 'b') {
    if (!result.stop || !isNum(result.stop.age) || !result.spend) return { ok: false, why: 'noAnswer' };
  } else if (source === 'd') {
    // D (answer-D.md 10): from today, the spend tried; a "no" is still a try, as A's is
    if (!result.spend || !isNum(result.spend.perMonth) || !shownOf(result) || !isNum(shownOf(result).monthly) || !isNum(result.basis.endAge)) return { ok: false, why: 'noAnswer' };
  } else return { ok: false, why: 'noAnswer' };
  return { ok: true };
}

/** Who A's and B's answer is about: your partner when you have already stopped (result.askedAbout), else you. */
const askedOf = (result) => (result.askedAbout === 'partner' ? 'partner' : 'you');

/** Whole years from today until the money starts (C), the age shown (A) or the age in mind (B) — the asked person's. */
function waitOf(source, result) {
  const inputs = result.inputs;
  if (source === 'c') {
    const whose = result.whose === 'partner' ? 'partner' : 'you';
    return Math.max(0, result.basis.startAge - inputs[whose].age);
  }
  if (source === 'd') return 0;                                   // D: from today, always
  const asked = askedOf(result);
  if (source === 'a') return Math.max(0, result.shown.age - inputs[asked].age);
  return Math.max(0, result.stop.age - inputs[asked].age);
}

/** The stop the answer shows, as its own mapping takes it: A's row and B's age in mind (the asked person's); C's is in its inputs. */
const shownStopOf = (source, result) => (source === 'a' ? result.shown.age : source === 'b' ? result.stop.age : undefined);

/**
 * The household the answer was worked out for, at the stop it shows (the answer's own mapping), and each person's whole
 * years from today until their own stop (household.js stopsOf). `apart`: the two of a couple stop in different years.
 */
function householdOf(source, result, today, who) {
  const household = TO_HOUSEHOLD[source](result.inputs, { today }, shownStopOf(source, result)).household;
  const S = {};
  for (const s of stopsOf(household, today)) S[s.who] = s.S;
  return { household, S, apart: who.length > 1 && new Set(who.map((w) => S[w])).size > 1 };
}

/** The stretches of years the answer was worked out in, for its careful amount (C, B) or the spending shown (A). */
const phasesOf = (source, result) => (source === 'a' ? (result.shown && result.shown.phases) : result.phases) || [];

/**
 * A person's part of the spending, after tax, today's prices: one row per stretch, neighbours under £1 apart merged.
 * A stretch in which they are still working (a couple apart: `working`) is not theirs to pay — the pay covers their part —
 * so the rows of the one still working start at their own stop, and the first to stop has their part of the years apart.
 */
function takeHomeOf(who, couple, ageAtStop, perMonth, phases) {
  if (!couple) return [{ fromAge: ageAtStop, perMonth: round2(perMonth) }];
  const rows = [];
  for (const ph of phases) {
    const mine = Array.isArray(ph.byPerson) ? ph.byPerson.find((p) => p.who === who) : null;
    const from = ph.ages && ph.ages[who] ? ph.ages[who].from : null;
    if (!mine || !isNum(mine.takeHome) || !isNum(from) || mine.working === true) continue;
    const row = { fromAge: from, perMonth: round2(mine.takeHome) };
    const last = rows[rows.length - 1];
    if (last && Math.abs(last.perMonth - row.perMonth) < 1) continue;
    rows.push(row);
  }
  return rows.length ? rows : [{ fromAge: ageAtStop, perMonth: 0 }];
}

/**
 * A person's part of the spending, exact to the year (seed version 3, spending-shape.md 8.1): one row for each year it
 * changes, from the answer's year-by-year rows (`byYear`). One person: what is spent that year — the shape itself, as
 * today's single row is the amount itself (today's planner applies its own floor for the incomes you get anyway). A couple:
 * each one's own take-home that year; the years one of them is still working are not theirs to pay (their pay covers it).
 * Neighbours are merged only when equal to the penny.
 */
function takeHomeByYear(who, couple, ageAtStop, byYear) {
  const rows = [];
  for (const y of byYear) {
    const from = y.ages && Number.isFinite(y.ages[who]) ? y.ages[who] : null;
    if (from === null) continue;
    let perMonth;
    if (!couple) perMonth = round2(y.spend);
    else {
      const mine = (y.byPerson || []).find((b) => b.who === who);
      if (!mine || mine.working === true || !isNum(mine.takeHome)) continue;
      perMonth = round2(mine.takeHome);
    }
    const last = rows[rows.length - 1];
    if (last && last.perMonth === perMonth) continue;
    rows.push({ fromAge: from, perMonth });
  }
  return rows.length ? rows : [{ fromAge: ageAtStop, perMonth: 0 }];
}

/** A "then" as the seed keeps it: { then, fallsPct? }. */
const thenOf = (x) => (x.then === 'falls' ? { then: 'falls', fallsPct: x.fallsPct } : { then: x.then === 'glides' ? 'glides' : 'level' });

/**
 * The household's shape as it was tested (seed version 3): A and B as typed (£ a month); C's shares at its careful start,
 * to the penny. Ages are yours. A stop at or after a step (A's "show me ages", review 2 Oct 2026) starts on that step:
 * the step in force is then the start — its fall or move counts on from the stop exactly as from its own age (a fall
 * compounds, a straight line stays straight) — and only the steps after the start follow, so the plan's summary, name
 * and description start from the figure tested (spendStartOf), in age order.
 */
function seedShapeOf(source, result) {
  const inputs = result.inputs;
  const base = source === 'c' ? inputs.shape : inputs.spend;
  if (!base || typeof base !== 'object') return null;
  const careful = source === 'c' ? shownOf(result).monthly : null;
  const all = (Array.isArray(base.steps) ? base.steps : []).map((x) => ({
    fromAge: x.fromAge, perMonth: source === 'c' ? round2(careful * x.share / 100) : x.perMonth, ...thenOf(x)
  }));
  const startAge = inForceAt(result);
  if (startAge === null) return { unit: 'perMonth', start: thenOf(base), steps: all };
  const inForce = all.filter((x) => x.fromAge <= startAge).pop();
  return { unit: 'perMonth', start: thenOf(inForce), steps: all.filter((x) => x.fromAge > startAge) };
}

/** Your age at the start when a step is in force from it (the answer's shapeNotes.inForce and its first year); else null. */
function inForceAt(result) {
  const y = Array.isArray(result.byYear) && result.byYear.length ? result.byYear[0] : null;
  return result.shapeNotes && result.shapeNotes.inForce && y && isNum(y.age) ? y.age : null;
}

/** The figure a month the seed holds: the answer's (A, B: as typed) — or, a step in force from the start, the one tested. */
const spendStartOf = (result) => (inForceAt(result) !== null ? result.byYear[0].spend : result.spend.perMonth);

/**
 * What goes in each month, as the question was given it; null when nothing goes in (or, from now, nothing more will).
 * `savingsInShare`: a couple apart, this person's part of what goes into savings each month as the household has it (those
 * still working today share it); otherwise (null) an even split, as before.
 *
 * A share of pay (6.46.0) seeds `kind: 'split'` with its two parts in pounds — what the planner's saving page takes — plus
 * `pay`, the pay a year it was a share of, which the planner's page shows as the salary. A seed from one figure or two
 * parts in pounds is byte for byte what it was (the key is there for a share only).
 */
function payInOf(source, result, who, later, count, savingsInShare = null) {
  const inputs = result.inputs;
  const p = (inputs[who] && inputs[who].payIn) || null;
  const parts = p ? payInParts(p) : null;
  const split = !!parts && parts.own !== null;
  const pay = parts && parts.pay !== null ? { pay: parts.pay } : {};
  const saving = (result.saving || []).find((s) => s.who === who);
  if (source === 'c') {
    if (!later || !p || p.has !== 'yes') return null;
    const by = result.payIn && Array.isArray(result.payIn.byPerson) ? result.payIn.byPerson.find((x) => x.who === who) : null;
    const total = by && isNum(by.total) ? by.total : saving ? saving.payIn.total : 0;
    if (!(total > 0)) return null;
    return { kind: split ? 'split' : 'total', total, own: split ? parts.own : null, employer: split ? parts.employer : null, savingsIn: 0, ...pay };
  }
  const savingsIn = savingsInShare !== null ? round2(savingsInShare) : round2((isNum(inputs.savingsIn) ? inputs.savingsIn : 0) / count);
  const total = saving && isNum(saving.payIn.total) ? saving.payIn.total : parts ? parts.total : 0;
  if (!(total > 0) && !(savingsIn > 0)) return null;
  return { kind: split ? 'split' : 'total', total, own: split ? parts.own : null, employer: split ? parts.employer : null, savingsIn, ...pay };
}

/**
 * One person of the seed (Contract C.1, "Person"). `stop` and `years` are this person's own (seed version 2): the
 * household's when everyone stops in the same year. `apart`: a couple who stop in different years — the savings between
 * them are with whoever stops first and what goes into savings each month with those still working (the household's own
 * split, household.js 'savings-first'), and nothing goes in for whoever has stopped.
 */
function personOf({ source, result, today, who, index, stop, years, household, couple, perMonth, apart, byYear = null }) {
  const inputs = result.inputs;
  const raw = inputs[who];
  const count = couple ? 2 : 1;
  const later = stop.kind === 'later';
  const ageToday = raw.age;
  const ageAtStop = ageToday + stop.yearsFromNow;
  const saving = (result.saving || []).find((s) => s.who === who);
  const hp = household.people[index] || {};
  const pensionToday = pounds(raw.pot);
  const savingsToday = apart ? pounds(hp.pots ? hp.pots.isa : 0) : pounds((inputs.savings || 0) / count);
  const atStop = (part, todayValue) => (later && saving && saving.potAtStop && saving.potAtStop[part]
    ? { careful: pounds(saving.potAtStop[part].careful), middling: pounds(saving.potAtStop[part].middling) }
    : { careful: todayValue, middling: todayValue });

  const sp = hp.statePension || { amountPerYear: 0, startAge: { years: 0, months: 0 } };
  const spAge = sp.startAge.years + (sp.startAge.months > 0 ? 1 : 0);
  const statePension = sp.amountPerYear > 0
    ? { yearly: round2(sp.amountPerYear), fromAge: spAge, fromDate: addYears(today, spAge - ageToday) }
    : null;

  const fs = raw.finalSalary && raw.finalSalary.has ? raw.finalSalary : null;
  const fsHousehold = Array.isArray(hp.finalSalary) && hp.finalSalary[0];
  const opens = result.pensionOpens && isNum(result.pensionOpens[who]) ? result.pensionOpens[who] : firstAccessAge(ageToday, today);
  // A's part-time work; D's work from today (answer-D.md 10: kept as A's part-time row from year 0; the fall is never saved)
  const pt = source === 'a' && who === 'you' && inputs.partTime && inputs.partTime.has ? inputs.partTime
    : source === 'd' && who === 'you' && inputs.work && inputs.work.has ? inputs.work : null;

  return {
    who,
    ageToday,
    ageAtStop,
    pensionOpensAge: opens,
    pension: { today: pensionToday, atStop: atStop('pension', pensionToday) },
    savings: { today: savingsToday, atStop: atStop('savings', savingsToday) },
    payIn: apart && !later ? null : payInOf(source, result, who, later, count, apart ? (hp.saving ? hp.saving.savingsIn : 0) : null),
    alreadyDrawing: raw.alreadyDrawing === true,
    statePension,
    finalSalary: fs ? { yearly: fs.yearly, fromAge: fs.fromAge, increases: (fsHousehold && fsHousehold.increases) || 'pricesCapped5' } : null,
    // "Already had the tax-free part?" (asked of someone who has stopped): yes → everything taken out is taxed. D answers
    // yes, no or some — some is counted as all taken (answer-D.md 4.3), as its household is.
    taxFreeQuarter: !(raw.taxFreeTaken === true || raw.taxFreeTaken === 'yes' || raw.taxFreeTaken === 'some'),
    partTime: pt ? { yearly: pt.yearly, years: pt.years } : null,
    // exact to the year when what is spent changes with age (seed version 3); else one row per stretch, as before
    takeHome: byYear ? takeHomeByYear(who, couple, ageAtStop, byYear) : takeHomeOf(who, couple, ageAtStop, perMonth, phasesOf(source, result)),
    stop: { kind: stop.kind, yearsFromNow: stop.yearsFromNow },
    years
  };
}

/**
 * The answer's key figures (Contract C.1, the `answer` row; seed version 4 from 7.8.0): the level, whether the person
 * chose it (a level other than Balanced can only have been chosen), the figures of that level in the answer's own kind
 * (shownOf: C and D a month, A the stop age, B the pot and the pay-in) and the chance of the figure shown, with the age
 * it is counted to. Older seeds keep the row they were written with (PlanFromSeed.js reads both).
 */
function answerOf(source, result) {
  const level = result.level || LEVEL_DEFAULT;
  const ch = result.chance || {};
  const num = (v) => (isNum(v) ? v : null);
  return {
    level,
    levelChosen: level !== LEVEL_DEFAULT,
    shown: copy(shownOf(result) || {}),
    chance: { weighted: num(ch.weighted), fixedAge: num(ch.fixedAge), planToAge: num(ch.planToAge) }
  };
}

/**
 * The household's stop and years a kept plan runs for: one stop for everyone, as before (the asked person's wait); stopping
 * in different years, the first stop, and the years from it until the younger reaches the end age (at most RULES.maxYears,
 * the planner's longest plan). `want`: the years to the end age before that limit.
 */
function lengthOf(source, result, who, S, apart) {
  const inputs = result.inputs;
  const endAge = isNum(inputs.endAge) ? inputs.endAge : result.basis.endAge;
  let stop, want, from;
  if (apart) {
    const S0 = Math.min(...who.map((w) => S[w]));
    stop = { kind: S0 > 0 ? 'later' : 'now', yearsFromNow: S0 };
    from = Math.min(...who.map((w) => inputs[w].age)) + S0;
  } else {
    const wait = waitOf(source, result);
    stop = { kind: source === 'b' || wait > 0 ? 'later' : 'now', yearsFromNow: wait };
    from = Math.min(...who.map((w) => inputs[w].age + wait));
  }
  want = endAge - from;
  return { endAge, stop, years: Math.min(RULES.maxYears, want), want, from };
}

/**
 * How long the plan a keep makes runs (7.8.0): the answer's plan-to age can be more than the planner's longest plan
 * (RULES.maxYears, 45 years) after the drawing starts, now that the plan-to age follows how long people live. Then the plan
 * is kept for 45 years, and Keep says so before it is kept. → null when the answer cannot be kept; else { cut, years,
 * keptToAge, planToAge }: keptToAge is the age in the plan's last year (the younger person's), as the plan's pages say it.
 */
export function keptLengthOf(source, result, today) {
  if (!result || typeof today !== 'string' || !keepable(source, result).ok) return null;
  const inputs = result.inputs;
  const couple = inputs.household === 'couple' && !!inputs.partner;
  const who = couple ? ['you', 'partner'] : ['you'];
  const { S, apart } = householdOf(source, result, today, who);
  const L = lengthOf(source, result, who, S, apart);
  return { cut: L.want > L.years, years: L.years, keptToAge: L.from + L.years - 1, planToAge: L.endAge };
}

/**
 * The seed for an answer.
 * @param {object} o
 * @param {'c'|'a'|'b'|'d'} o.source
 * @param {object} o.result          the answer, final, for the inputs as they stand now
 * @param {{ today: string, appVersion: string }} o.env
 * @param {string | { suggested?: string, chosen: string }} o.name   what is in the name box (checked here again)
 * @param {object|null} [o.budget]   V7's budget sheet (state.budget), carried as a guide — never read for a figure
 * @param {null|'lines'|'one'} [o.spendHow]   A and B: whether the spending was worked out line by line
 * @param {string} o.createdAt       ISO time, from V7's effect clock
 * @param {'now'|'enough'} [o.payIn] B only: keep what goes in as now (the default, as before), or what would be on course
 *                                   (research/saving-enough-and-check-in.md 3.6: Keep asks which, neither chosen)
 * @returns {object|null}
 */
export function buildPlanSeed({ source, result: asked, env, name, budget = null, spendHow = null, createdAt, payIn = 'now' }) {
  if (!keepable(source, asked).ok || !env || typeof env.today !== 'string' || typeof createdAt !== 'string') return null;
  // "Keep: paying in … (on course)": the answer at that figure, which B worked out with the answer (no second model)
  const enough = source === 'b' && payIn === 'enough' ? atEnough(asked) : null;
  if (source === 'b' && payIn === 'enough' && !enough) return null;
  const result = enough || asked;
  const inputs = result.inputs;
  const today = env.today;
  const couple = inputs.household === 'couple' && !!inputs.partner;
  const suggested = suggestedPlanName(source, inputs, result);
  // the name box followed the answer as asked; left as it was, it takes the name of what is kept
  const boxSuggested = enough ? suggestedPlanName(source, asked.inputs, asked) : suggested;
  const chosenText = typeof name === 'string' ? name : name && typeof name.chosen === 'string' ? name.chosen : null;
  const typed = chosenText === null || (enough && chosenText === boxSuggested) ? suggested : chosenText;
  const checked = checkPlanName(typed);
  if (!checked.ok) return null;

  const who = couple ? ['you', 'partner'] : ['you'];
  const { household, S, apart } = householdOf(source, result, today, who);
  const { endAge, stop, years } = lengthOf(source, result, who, S, apart);
  // Each person's own: the household's in the same year; apart, their own stop and the years from it to the same end.
  const ownStop = (w) => (apart ? { kind: S[w] > 0 ? 'later' : 'now', yearsFromNow: S[w] } : stop);
  const ownYears = (w) => (apart ? years - (S[w] - stop.yearsFromNow) : years);

  const spend = source === 'c'
    ? { perMonth: shownOf(result).monthly, from: 'careful', level: null, budgetSkipped: null }
    : {
      perMonth: spendStartOf(result),
      from: result.spend.kind === 'level' ? 'level' : spendHow === 'lines' ? 'budget' : 'typed',
      level: result.spend.kind === 'level' ? result.spend.level : null,
      budgetSkipped: spendHow !== 'lines'
    };

  // what is spent changing with age (spending-shape.md 8.1): the answer's year-by-year rows, and the shape as it was tested
  const byYear = Array.isArray(result.byYear) && result.byYear.length ? result.byYear : null;
  const shape = byYear ? seedShapeOf(source, result) : null;
  if (shape) spend.shape = shape;
  const people = who.map((w, index) => personOf({ source, result, today, who: w, index, stop: ownStop(w), years: ownYears(w), household, couple, perMonth: spend.perMonth, apart, byYear: shape ? byYear : null }));
  const sheet = budget ? sheetForSeed(checkSheet(budget, { household: couple ? 'couple' : 'single', level: spend.level || 'moderate', today })) : null;
  const basis = result.basis;

  return {
    seedVersion: shape ? SEED_VERSION_SHAPE : SEED_VERSION,
    createdAt,
    today,
    source,
    v7: { appVersion: String(env.appVersion || ''), engineVersion: basis.engineVersion || null, historyEnd: basis.historyEnd || null },
    name: { suggested, chosen: checked.name },
    // the answer's checked inputs — among them `charge`, the household's one fund and platform charge (percent a year,
    // 6.19.0), which today's planner makes the new plan's Stress setting (src/services/PlanSeed.js; no seed version change:
    // a seed without one gives the planner's default, 0.5); and `isaGrowth` (6.22.0), how the savings grow — 'cash'
    // ("Mostly cash") or 'invested' ("Invested like my pension") — there whenever the answer has money in savings, which
    // the planner makes the plan's Stress setting the same way (no seed version change: a seed without one, "Mostly cash")
    inputs: copy(inputs),
    household: couple ? 'couple' : 'single',
    stop: { kind: stop.kind, yearsFromNow: stop.yearsFromNow },
    endAge,
    years,
    // until the second stop, the share of what is spent the pay of the one still working covers (the household's own:
    // the answer's, or the default); null when everyone stops in the same year
    untilBothStop: apart ? { payCovers: household.untilBothStop.payCovers } : null,
    risk: inputs.risk || 'balanced',
    spend,
    people,
    answer: answerOf(source, result),
    budget: sheet
  };
}

/**
 * B's answer as if it had been asked paying in what would be on course (research/saving-enough-and-check-in.md 3.6:
 * "Keep: paying in 31% (on course)"), from the figures B worked out with the answer at exactly that pay-in
 * (result.enough.atLevel, whose count B asked again there): each person's pay-in in their own kind (a share stays a
 * share), what goes into savings a month, each one's pension and savings at the stop, the count and the bad case's age.
 * So the seed keeps what the screen said, and has the same keys as one kept paying in as now: nothing new is stored.
 * null when the answer is on course already, or has no such figure.
 */
export function atEnough(result) {
  const en = result && result.enough;
  const fig = en && result.verdict && result.verdict.band !== 'yes' ? en.atLevel : null;
  if (!fig || !Array.isArray(fig.parts) || !Array.isArray(result.saving)) return null;
  const out = JSON.parse(JSON.stringify(result));
  const inputs = out.inputs;
  for (const part of fig.parts) {
    const saving = out.saving.find((x) => x.who === part.who);
    const person = inputs[part.who];
    // someone who has stopped (couples apart) pays nothing in either way
    if (!saving || !(saving.yearsSaving > 0) || !person) continue;
    const p = person.payIn || {};
    if (p.kind === 'share' && isNum(part.ownPct)) person.payIn = { ...p, ownPct: part.ownPct };
    else if (p.kind === 'share' || p.kind === 'split') person.payIn = { kind: 'split', own: isNum(part.own) ? part.own : part.payIn, employer: isNum(part.employer) ? part.employer : 0 };
    else person.payIn = { kind: 'total', total: part.payIn };
    saving.payIn = { ...saving.payIn, total: part.payIn, own: isNum(part.own) ? part.own : null, employer: isNum(part.employer) ? part.employer : null };
    if (part.atStop) saving.potAtStop = { ...saving.potAtStop, pension: part.atStop.pension, savings: part.atStop.savings };
  }
  if (isNum(fig.savingsIn)) inputs.savingsIn = fig.savingsIn;
  out.chance = { ...out.chance, weighted: fig.weighted ?? fig.lasted, fixedAge: fig.lasted, fails: fig.fails };
  // on course at the figure that would be enough: the count B asked again there is within the level's twentieths; weighing
  // (7.8.0), the verdict at the level B asked again there — the same test the pay-in was solved on
  const weighed = Boolean(result.basis && result.basis.weighted) && typeof fig.weighted === 'number';
  out.onCourse = weighed ? fig.verdict === 'yes' : fig.fails <= Math.floor((result.basis.levelFails20 * result.basis.futures) / 20);
  out.wholeLife = { ...out.wholeLife, lasted: fig.lasted, outOfTen: fig.outOfTen, runOutAge: fig.runOutAge, ...(weighed ? { weighted: fig.weighted } : {}) };
  if (fig.potAtStop) out.potAtStop = { ...out.potAtStop, now: fig.potAtStop };
  out.payIn = { ...out.payIn, now: fig.payIn };
  return out;
}

/** Why a seed could not go to Firestore almost unchanged: [] when it can. */
export function seedProblems(seed) {
  const out = [];
  const walk = (v, path, inArray) => {
    if (v === undefined) { out.push(`${path} is undefined`); return; }
    if (v === null || typeof v === 'string' || typeof v === 'boolean') return;
    if (typeof v === 'number') { if (!Number.isFinite(v)) out.push(`${path} is ${v}`); return; }
    if (typeof v === 'function') { out.push(`${path} is a function`); return; }
    if (Array.isArray(v)) {
      if (inArray) out.push(`${path} is an array inside an array`);
      v.forEach((x, i) => walk(x, `${path}[${i}]`, true));
      return;
    }
    if (typeof v === 'object') {
      if (Object.getPrototypeOf(v) !== Object.prototype) { out.push(`${path} is not a plain object`); return; }
      for (const [k, x] of Object.entries(v)) walk(x, path ? `${path}.${k}` : k, false);
      return;
    }
    out.push(`${path} is a ${typeof v}`);
  };
  walk(seed, '', false);
  return out;
}
