/**
 * The plan seed (research/v7/save-as-plan.md, Contract C.1): one plain JSON object that carries an answer of C, A or B
 * to today's planner, which makes a NEW plan from it. Pure: the time it was made comes in (`createdAt`, from V7's
 * effect clock), the date is env.today; no storage, no screen. V7's effect (src/v7/effects/planSeed.js) writes it to
 * localStorage under SEED_KEY and opens ../#new-plan; nothing here ever puts a figure in an address.
 *
 *   SEED_KEY, SEED_VERSION, SEED_MAX_AGE_MS
 *   keepable(source, result)            → { ok: true } | { ok: false, why }   what the answer must be to be saved
 *   buildPlanSeed({ source, result, env, name, budget, spendHow, createdAt })   → the seed, or null when not keepable
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
 */
import { toHousehold as toHouseholdC } from '../c/toHousehold.js';
import { toHousehold as toHouseholdA } from '../a/toHousehold.js';
import { toHousehold as toHouseholdB } from '../b/toHousehold.js';
import { stopsOf } from '../shared/household.js';
import { firstAccessAge, addYears, verdictOf, RULES } from '../shared/rules.js';
import { suggestedPlanName, checkPlanName } from '../shared/planName.js';
import { checkSheet, sheetForSeed } from './budgetSheet.js';

export const SEED_KEY = 'pt_v7_plan_seed';
/** 2 from 6.20.0: each person at their own stop. Today's planner still reads 1 (src/services/PlanSeed.js). */
export const SEED_VERSION = 2;
/** A seed older than this is discarded unread (Contract C.2). */
export const SEED_MAX_AGE_MS = 24 * 60 * 60 * 1000;
/**
 * Where today's planner leaves what became of a seed, in the tab's session storage, for the V7 page that sent it (the
 * same tab comes Back): { [createdAt]: { outcome: 'made' | 'declined' | 'refused' | 'cleared', name? } }. The same key
 * as src/services/PlanSeed.js RECEIPT_KEY (a test holds them equal).
 */
export const RECEIPT_KEY = 'pt_v7_plan_receipt';

const TO_HOUSEHOLD = { c: toHouseholdC, a: toHouseholdA, b: toHouseholdB };
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
    if (!result.monthly || !isNum(result.monthly.careful) || !isNum(result.basis.startAge)) return { ok: false, why: 'noAnswer' };
  } else if (source === 'a') {
    if (!result.shown || !isNum(result.shown.age) || !result.spend) return { ok: false, why: 'noAnswer' };
  } else if (source === 'b') {
    if (!result.stop || !isNum(result.stop.age) || !result.spend) return { ok: false, why: 'noAnswer' };
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
 * What goes in each month, as the question was given it; null when nothing goes in (or, from now, nothing more will).
 * `savingsInShare`: a couple apart, this person's part of what goes into savings each month as the household has it (those
 * still working today share it); otherwise (null) an even split, as before.
 */
function payInOf(source, result, who, later, count, savingsInShare = null) {
  const inputs = result.inputs;
  const p = (inputs[who] && inputs[who].payIn) || null;
  const saving = (result.saving || []).find((s) => s.who === who);
  if (source === 'c') {
    if (!later || !p || p.has !== 'yes') return null;
    const by = result.payIn && Array.isArray(result.payIn.byPerson) ? result.payIn.byPerson.find((x) => x.who === who) : null;
    const total = by && isNum(by.total) ? by.total : saving ? saving.payIn.total : 0;
    if (!(total > 0)) return null;
    const split = p.kind === 'split';
    return { kind: split ? 'split' : 'total', total, own: split ? p.own : null, employer: split ? p.employer : null, savingsIn: 0 };
  }
  const savingsIn = savingsInShare !== null ? round2(savingsInShare) : round2((isNum(inputs.savingsIn) ? inputs.savingsIn : 0) / count);
  const split = !!p && p.kind === 'split';
  const total = saving && isNum(saving.payIn.total) ? saving.payIn.total : split ? (p.own || 0) + (p.employer || 0) : (p && isNum(p.total) ? p.total : 0);
  if (!(total > 0) && !(savingsIn > 0)) return null;
  return { kind: split ? 'split' : 'total', total, own: split ? p.own : null, employer: split ? p.employer : null, savingsIn };
}

/**
 * One person of the seed (Contract C.1, "Person"). `stop` and `years` are this person's own (seed version 2): the
 * household's when everyone stops in the same year. `apart`: a couple who stop in different years — the savings between
 * them are with whoever stops first and what goes into savings each month with those still working (the household's own
 * split, household.js 'savings-first'), and nothing goes in for whoever has stopped.
 */
function personOf({ source, result, today, who, index, stop, years, household, couple, perMonth, apart }) {
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
  const pt = source === 'a' && who === 'you' && inputs.partTime && inputs.partTime.has ? inputs.partTime : null;

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
    // "Already had the tax-free part?" (asked of someone who has stopped): yes → everything taken out is taxed
    taxFreeQuarter: raw.taxFreeTaken !== true,
    partTime: pt ? { yearly: pt.yearly, years: pt.years } : null,
    takeHome: takeHomeOf(who, couple, ageAtStop, perMonth, phasesOf(source, result)),
    stop: { kind: stop.kind, yearsFromNow: stop.yearsFromNow },
    years
  };
}

/** The answer's key figures, by question (Contract C.1, the `answer` row). */
function answerOf(source, result) {
  const three = (t) => (t && isNum(t.careful) ? { careful: t.careful, middling: t.middling, good: t.good } : null);
  const pots = (t) => (t && isNum(t.careful) ? { careful: pounds(t.careful), middling: pounds(t.middling) } : null);
  if (source === 'c') {
    return { monthly: three(result.monthly), lasted: result.lasted.careful, runOutAge: result.runOutAge.careful, verdict: null,
      potAtStop: pots(result.potAtStart), number: null, payInNeeded: null };
  }
  if (source === 'a') {
    const s = result.shown;
    return { monthly: three(s.monthly), lasted: s.lasted, runOutAge: s.runOutAge, verdict: s.verdict, potAtStop: pots(s.potAtStop), number: null, payInNeeded: null };
  }
  const chance = result.chance || {};
  return {
    monthly: null,
    lasted: isNum(chance.lasted) ? chance.lasted : null,
    runOutAge: result.wholeLife && isNum(result.wholeLife.runOutAge) ? result.wholeLife.runOutAge : null,
    verdict: isNum(chance.fails) && isNum(result.basis.futures) ? verdictOf(chance.fails, result.basis.futures) : null,
    potAtStop: pots(result.potAtStop && result.potAtStop.now),
    number: three(result.number),
    payInNeeded: result.payIn && isNum(result.payIn.needed) ? result.payIn.needed : null
  };
}

/**
 * The seed for an answer.
 * @param {object} o
 * @param {'c'|'a'|'b'} o.source
 * @param {object} o.result          the answer, final, for the inputs as they stand now
 * @param {{ today: string, appVersion: string }} o.env
 * @param {string | { suggested?: string, chosen: string }} o.name   what is in the name box (checked here again)
 * @param {object|null} [o.budget]   V7's budget sheet (state.budget), carried as a guide — never read for a figure
 * @param {null|'lines'|'one'} [o.spendHow]   A and B: whether the spending was worked out line by line
 * @param {string} o.createdAt       ISO time, from V7's effect clock
 * @returns {object|null}
 */
export function buildPlanSeed({ source, result, env, name, budget = null, spendHow = null, createdAt }) {
  if (!keepable(source, result).ok || !env || typeof env.today !== 'string' || typeof createdAt !== 'string') return null;
  const inputs = result.inputs;
  const today = env.today;
  const couple = inputs.household === 'couple' && !!inputs.partner;
  const suggested = suggestedPlanName(source, inputs, result);
  const typed = typeof name === 'string' ? name : name && typeof name.chosen === 'string' ? name.chosen : suggested;
  const checked = checkPlanName(typed);
  if (!checked.ok) return null;

  const who = couple ? ['you', 'partner'] : ['you'];
  const { household, S, apart } = householdOf(source, result, today, who);
  const endAge = isNum(inputs.endAge) ? inputs.endAge : result.basis.endAge;
  // The household's stop and years: one stop for everyone, as before (the asked person's wait); stopping in different
  // years, the first stop, and the years from it until the younger reaches the end age (at most RULES.maxYears).
  let stop, years;
  if (apart) {
    const S0 = Math.min(...who.map((w) => S[w]));
    stop = { kind: S0 > 0 ? 'later' : 'now', yearsFromNow: S0 };
    years = Math.min(RULES.maxYears, endAge - (Math.min(...who.map((w) => inputs[w].age)) + S0));
  } else {
    const wait = waitOf(source, result);
    stop = { kind: source === 'b' || wait > 0 ? 'later' : 'now', yearsFromNow: wait };
    years = Math.min(RULES.maxYears, endAge - Math.min(...who.map((w) => inputs[w].age + wait)));
  }
  // Each person's own: the household's in the same year; apart, their own stop and the years from it to the same end.
  const ownStop = (w) => (apart ? { kind: S[w] > 0 ? 'later' : 'now', yearsFromNow: S[w] } : stop);
  const ownYears = (w) => (apart ? years - (S[w] - stop.yearsFromNow) : years);

  const spend = source === 'c'
    ? { perMonth: result.monthly.careful, from: 'careful', level: null, budgetSkipped: null }
    : {
      perMonth: result.spend.perMonth,
      from: result.spend.kind === 'level' ? 'level' : spendHow === 'lines' ? 'budget' : 'typed',
      level: result.spend.kind === 'level' ? result.spend.level : null,
      budgetSkipped: spendHow !== 'lines'
    };

  const people = who.map((w, index) => personOf({ source, result, today, who: w, index, stop: ownStop(w), years: ownYears(w), household, couple, perMonth: spend.perMonth, apart }));
  const sheet = budget ? sheetForSeed(checkSheet(budget, { household: couple ? 'couple' : 'single', level: spend.level || 'moderate', today })) : null;
  const basis = result.basis;

  return {
    seedVersion: SEED_VERSION,
    createdAt,
    today,
    source,
    v7: { appVersion: String(env.appVersion || ''), engineVersion: basis.engineVersion || null, historyEnd: basis.historyEnd || null },
    name: { suggested, chosen: checked.name },
    // the answer's checked inputs — among them `charge`, the household's one fund and platform charge (percent a year,
    // 6.19.0), which today's planner makes the new plan's Stress setting (src/services/PlanSeed.js; no seed version change:
    // a seed without one gives the planner's default, 0.5)
    inputs: copy(inputs),
    household: couple ? 'couple' : 'single',
    stop: { kind: stop.kind, yearsFromNow: stop.yearsFromNow },
    endAge,
    years,
    // until the second stop, the share of what is spent the pay of the one still working covers (the household's own:
    // the answer's, or the owner's default); null when everyone stops in the same year
    untilBothStop: apart ? { payCovers: household.untilBothStop.payCovers } : null,
    risk: inputs.risk || 'balanced',
    spend,
    people,
    answer: answerOf(source, result),
    budget: sheet
  };
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
