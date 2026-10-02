/**
 * The household model every question shares (research/v7/answer-C-and-household.md 1.2–1.5; build brief 4.3).
 *
 * One model for every question: one or two people, each with their own pots, State Pension and final-salary
 * pensions; a plan-to age; a mix to hold. A single person is a household of one. Tax is per person; the answer
 * is per household.
 *
 * Pure and clock-free: every function that needs today's date takes it as `now` ('YYYY-MM-DD'). Dates are text
 * and ages are whole years, so nothing here depends on the time zone of the device.
 *
 * @typedef {{ year: number, month: number, day?: number }} Born      day is optional; month is 1–12
 * @typedef {{ years: number, months: number }} AgeYM
 * @typedef {object} Person
 * @property {'you'|'partner'} who
 * @property {string} label
 * @property {Born} born
 * @property {number} age                       whole years on `now`
 * @property {boolean} bornFromAge              true when only an age was given (the birthday is taken to be `now`)
 * @property {{ kind: 'already' } | { kind: 'age', age: number } | { kind: 'date', month: number, year: number }} stopWork
 * @property {{ pension: number, isa: number, otherSavings: number, cash: number }} pots
 * @property {{ amountPerYear: number, startAge: AgeYM, source: 'default'|'entered' }} statePension
 * @property {{ label?: string, amountPerYear: number, startAge: number, increases: 'prices'|'pricesCapped5'|'none' }[]} finalSalary
 * @property {{ label?: string, amountPerYear: number, fromAge: number, toAge: number, kind: 'work'|'other' }[]} otherIncome
 *   kind 'work' (question A's part-time work, before tax, a year, from fromAge until toAge) is honoured by the
 *   adapter under start 'asGiven' (toEngine.js); kind 'other' is not used yet.
 * @property {'notTakenYet'|'alreadyTaken'} pensionTaxFreeCash   'alreadyTaken' when the form says the tax-free part has gone
 *   (couples-different-years.md 2.3: asked only of someone who has stopped); then everything taken out is taxed
 * @property {null | { payIn: { total: number, own: number|null, employer: number|null }, savingsIn: number, alreadyDrawing: boolean }} [saving]
 *   Questions A and B (step 4 brief 4.10): what lands in the pension each month (today's prices; own + employer when
 *   split), what goes into ISAs and savings each month, and whether pension income has been taken already (the £10,000
 *   warning only). Present only on a saver household; null there = nothing paid in.
 *
 * @typedef {object} Household
 * @property {1} inputVersion
 * @property {Person[]} people                  one or two; the order carries no meaning
 * @property {null|object} spending             not used by question C; A and B: { kind: 'amount', perMonthTakeHome } | { kind: 'lifestyle', level }
 * @property {{ risk: 'cautious'|'balanced'|'adventurous' }} [saving]   A and B only (a saver household): the mix while
 *   saving. Its presence is what makes a household a saver's.
 * @property {number} chargesPct                every question (6.19.0): the household's one fund and platform charge, percent
 *   a year (0.5 = 0.5%), 0 to 3 — taken monthly from what is held in funds and cash, while saving (saving.js) AND while
 *   drawing (toEngine.js hands it to every run); never from the State Pension or a final-salary pension. 0.5 unless given.
 *   (Before 6.19.0 a saver household carried `saving.charge`, a share a year, for the saving years only.)
 * @property {'cash'|'invested'} [isaGrowth]    every question (6.22.0; services/IsaGrowth.js): how the ISAs and savings grow,
 *   while saving (saving.js) AND while drawing (toEngine.js hands it to every run) — 'cash' ("Mostly cash": last year's
 *   rise in prices less 1%, never below nothing, as the pension's own cash grows) or 'invested' ("Invested like my
 *   pension": the pension's mix, in the same futures). Kept as given, and never added here: every household the forms
 *   make has one ("Mostly cash" unless chosen — a/b/c toHousehold.js), so any savings it holds, or that an answer works
 *   with, grow as the form says. Absent (a household made by hand), the engines grow savings at their fixed rate, as
 *   before 6.22.0.
 * @property {number} planToAge                 for a couple: until the YOUNGER person is this age
 * @property {{ kind: 'risk', level: 'cautious'|'balanced'|'adventurous' } | { kind: 'mix', equity: number, bond: number, cash: number }} portfolio
 * @property {{ id: string }} strategy
 * @property {{ unit: 'perMonth' | 'share', first?: number, start: { then: string, fallsPct?: number },
 *             steps: { fromAge: number, perMonth?: number, share?: number, then: string, fallsPct?: number }[] }} [shape]
 *   What is spent changing with age (research/v7/spending-shape.md 3; shared/shape.js): present ONLY when the question was
 *   given a shape that changes (schemaParts.js shapeOfInputs), so a household without one is today's, key for key. Ages are
 *   YOUR ages (the person at the keyboard); `first` is the first amount, £ a month, for 'perMonth'; a 'share' step is a
 *   percentage of the start. The adapter turns it into a figure for each year (toEngine.js plan.shape).
 * @property {{ payCovers: 0 | 0.5 | 1 }} [untilBothStop]   Couples who stop in different years (couples-different-years.md
 *   3.4): present ONLY when the two people's stops differ (stopsOf: a join after year 0), so a same-year household is
 *   today's, key for key. Until the second stop, the pay of the one still working covers this share of what the household
 *   spends (`spending`, or the amount tested) and they keep paying in; the money of the one who has stopped pays the rest.
 *   Whether the pay also makes up what that money cannot pay is the owner's switch APART.payCoversGap.
 */
import { fullStatePensionYearly, addYears, accessAgeOn, RULES } from './rules.js';
import { DEFAULT_CHARGES_PCT, CHARGES_LIMITS, isChargesPct } from '../../services/Charges.js';
import { isIsaGrowth } from '../../services/IsaGrowth.js';
import { SHAPE_LIMITS, THEN } from './shape.js';

/**
 * The owner's answers on couples who stop work in different years (research/v7/couples-different-years.md, "Questions
 * for the owner", taken with the design's recommendations on 1 Oct 2026; the owner may still change them). One switch each:
 *   payCoversDefault  (1) until you have both stopped, how much of what you spend the pay of the one still working covers
 *                     when the question is not answered: 'half' (recommended), 'all' or 'none' — a key of PAY_COVERS.
 *   payCoversGap      (2) whether that pay also makes up what the stopped person's money cannot pay before the other stops
 *                     (a pension that cannot be touched yet, cash run out): true — it does, and the answer says so with the
 *                     age it happens in a bad case; false — that counts as running out, as "None of it" always does.
 *   askAboutPartner   (3) whether A and B offer a couple "I've already stopped" and then answer about the partner ("Yes —
 *                     your partner could stop at 56"); "you" stays the person at the keyboard either way.
 */
export const APART = Object.freeze({ payCoversDefault: 'half', payCoversGap: true, askAboutPartner: true });

/** What each answer to "until you've both stopped, their pay covers…" is, as a share of what the household spends. */
export const PAY_COVERS = Object.freeze({ half: 0.5, all: 1, none: 0 });
const PAY_COVERS_VALUES = Object.values(PAY_COVERS);

/** The limits of the model (answer-C-and-household.md 1.8). The only place a household range is written down. */
export const HOUSEHOLD_LIMITS = {
  age: { min: 18, max: 100 },
  pot: { min: 0, max: 10_000_000 },
  statePensionAYear: { min: 0, max: 20_000 },
  finalSalaryAYear: { min: 0, max: 200_000 },
  finalSalaryStartAge: { min: 50, max: 75 },
  planToAge: { min: 75, max: 105 },
  people: { min: 1, max: 2 },
  // The saving years (step 4 brief 4.10): £ a month at today's prices; part-time work.
  payInAMonth: { min: 0, max: 10_000 },
  savingsInAMonth: { min: 0, max: 10_000 },
  workAYear: { min: 0, max: 200_000 },
  workYears: { min: 1, max: 15 },
  // The household's one fund and platform charge, percent a year (6.19.0): today's planner's range (services/Charges.js).
  chargesPct: { min: CHARGES_LIMITS.min, max: CHARGES_LIMITS.max }
};

const RISK_LEVELS = ['cautious', 'balanced', 'adventurous'];
const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
const pad2 = (n) => String(n).padStart(2, '0');

/** 'YYYY-MM-DD' → { year, month, day }. */
export function dateParts(iso) {
  const [year, month, day] = String(iso).split('-').map(Number);
  return { year, month, day };
}
const isoOf = ({ year, month, day }) => `${String(year).padStart(4, '0')}-${pad2(month)}-${pad2(day)}`;
const isDate = (iso) => typeof iso === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(iso);

/** The date of birth that follows from an age alone: the birthday is taken to be today. */
export function bornFromAge(age, now) {
  return dateParts(addYears(now, -age));
}

/** Whole years of age on a date. With no day of birth, the birthday is taken as the last day of its month (the cautious side). */
export function ageOn(born, iso) {
  const d = dateParts(iso);
  const day = born.day ?? 31;
  const had = d.month > born.month || (d.month === born.month && d.day >= day);
  return d.year - born.year - (had ? 0 : 1);
}

/**
 * State Pension age from the date of birth (answer-C-and-household.md 1.5).
 *
 *   born before 6 April 1960          66
 *   6 April 1960 – 5 March 1961       66 and 1 to 11 months (one month later for each month of birth)
 *   6 March 1961 – 5 April 1977       67
 *   6 April 1977 – 5 April 1978       67 and 1 to 11 months, then 68 (the legislated timetable)
 *   from 6 April 1978                 68
 *
 * With month and year only, a birthday in a changeover month takes the later age (the cautious side).
 * @param {Born} born
 * @returns {AgeYM}
 */
export function statePensionAge(born) {
  const day = born.day ?? 31;
  const key = born.year * 10000 + born.month * 100 + day;
  const stepsFrom = (year) => (born.year - year) * 12 + (born.month - 4) + (day >= 6 ? 1 : 0);
  if (key < 19600406) return { years: 66, months: 0 };
  if (key < 19610306) return { years: 66, months: stepsFrom(1960) };
  if (key < 19770406) return { years: 67, months: 0 };
  if (key < 19780406) { const n = stepsFrom(1977); return n >= 12 ? { years: 68, months: 0 } : { years: 67, months: n }; }
  return { years: 68, months: 0 };
}

/**
 * The State Pension age as a whole year, for a person known by age alone (their birthday is taken to be today,
 * so months mean nothing). 66 and some months counts as 66 — a person of 66 today is treated as already
 * receiving it (answer-C-and-household.md 1.5); 67 and some months counts as 68, the later age.
 */
export function wholeStatePensionAge(born) {
  const a = statePensionAge(born);
  if (a.months === 0 || a.years === 66) return a.years;
  return a.years + 1;
}

/**
 * The earliest age a pension can be touched on a given day: 55 before 6 April 2028, 57 from that date.
 * `born` is accepted for the day protected pension ages are modelled; today it does not change the answer.
 */
export function pensionAccessAge(_born, onDate) {
  return accessAgeOn(onDate);
}

/** A person's whole-year age today. */
const ageToday = (person, now) => (isNum(person.age) ? person.age : ageOn(person.born, now));

/** Whole years from today until a person stops work (0 when they already have, or the day has passed). */
function yearsUntilStop(person, now) {
  const s = person.stopWork || { kind: 'already' };
  const age = ageToday(person, now);
  if (s.kind === 'age') return Math.max(0, s.age - age);
  if (s.kind === 'date') {
    const d = dateParts(now);
    const months = (s.year - d.year) * 12 + (s.month - d.month);
    return Math.max(0, Math.ceil(months / 12));
  }
  return 0;
}

/**
 * The household's start: the later of today and the earliest stop-work among the people, in whole years from
 * today (ages are whole years in this model). Year 0 of every engine run is the twelve months from that date.
 * @returns {{ date: string, yearsFromNow: number }}
 */
export function householdStart(household, now) {
  const waits = household.people.map((p) => yearsUntilStop(p, now));
  const yearsFromNow = Math.max(0, Math.min(...waits));
  return { date: addYears(now, yearsFromNow), yearsFromNow };
}

/**
 * Each person's stop (couples-different-years.md 4.1), in the order of `people`: `S` — whole years from today until they
 * stop (0 when they already have, or the day has passed: yearsUntilStop), and `join` — the year, counted from the
 * household's start (householdStart, the earliest stop), when their money joins the household's (0 for the first to stop).
 * Every join 0 is a same-year household: today's case, bit for bit. Two people at most, so there is at most one join.
 * @returns {{ who: string, S: number, join: number }[]}
 */
export function stopsOf(household, now) {
  const waits = household.people.map((p) => yearsUntilStop(p, now));
  const first = Math.max(0, Math.min(...waits));
  return household.people.map((p, i) => ({ who: p.who, S: waits[i], join: waits[i] - first }));
}

/** Whether the people of a household stop in different years (any join after year 0). */
const stopApart = (people, now) => people.length > 1 && new Set(people.map((p) => yearsUntilStop(p, now))).size > 1;

/**
 * The first age, at or after the household's start, at which a person who is `age` today can touch a pension: the
 * earliest pension age on the day they reach it (55 before 6 April 2028, 57 from then — so a person who is 56 on a
 * start date after that day waits until 57, whatever they could have done earlier). The same rule the form checks
 * a chosen start against (validate.js).
 */
export function firstOpenAge(age, now, yearsFromNow = 0) {
  for (let a = age + yearsFromNow; ; a++) if (a >= accessAgeOn(addYears(now, a - age))) return a;
}

/**
 * The start moved, if it must be, for a pension that cannot yet be touched (answer-C-and-household.md 2.3 step 2;
 * build brief 4.3 point 9). The household keeps the start it chose while at least half of its pension money is open
 * to it there (its holders have reached the earliest pension age), and anyone still under that age has their
 * pension treated as closed until they reach it (their savings may be used before then). When less than half is
 * open, the start moves to the first pension opening that makes it half or more. So a couple's start is not moved
 * for the younger partner's pension while the older one's pot is the larger, and a person whose own pension is
 * closed waits for it, as before (savings alone do not hold the start: they are drawn on from the moved start).
 *
 * @returns {{ date: string, yearsFromNow: number, moved: boolean, movedBy: number, movedFor: string[],
 *             locked: string[], lockedUntil: { who: string, untilAge: number, years: number }[], accessAge: number }}
 *   `locked` names the people whose pension was out of reach on the unmoved start. `movedFor` names those whose
 *   pension opening the start was moved to (empty when it did not move). `lockedUntil` lists the people whose
 *   pension is STILL out of reach on the (moved) start: until what age, and for how many years from the start.
 */
export function startWhenPensionsOpen(household, now) {
  const base = householdStart(household, now);
  const holders = [];
  for (const p of household.people) {
    const pots = p.pots || {};
    if (!(pots.pension > 0)) continue;
    const age = ageToday(p, now);
    const first = firstOpenAge(age, now, base.yearsFromNow);
    holders.push({ who: p.who, pension: pots.pension, untilAge: first, opensIn: first - (age + base.yearsFromNow) });
  }
  const total = holders.reduce((s, h) => s + h.pension, 0);
  const openAt = (t) => holders.filter((h) => h.opensIn <= t).reduce((s, h) => s + h.pension, 0);
  const candidates = [0, ...holders.map((h) => h.opensIn)].sort((a, b) => a - b);
  const extra = candidates.find((t) => openAt(t) >= total / 2) ?? 0;
  const yearsFromNow = base.yearsFromNow + extra;
  const date = addYears(now, yearsFromNow);
  const movedFor = extra > 0 ? holders.filter((h) => h.opensIn === extra).map((h) => h.who) : [];
  const lockedUntil = holders.filter((h) => h.opensIn > extra).map((h) => ({ who: h.who, untilAge: h.untilAge, years: h.opensIn - extra }));
  const locked = holders.filter((h) => h.opensIn > 0).map((h) => h.who);
  return { date, yearsFromNow, moved: extra > 0, movedBy: extra, movedFor, locked, lockedUntil, accessAge: accessAgeOn(date) };
}

/**
 * The start as given, never moved (questions A and B, step 4 brief 4.5): the household's start is the (first) stop, and
 * every pension whose holder is under the earliest pension age on the day THEY stop is closed until they reach it — the
 * savings pay meanwhile, inside the holder's one run (toEngine.js, the locked run). Each pension is measured from its
 * holder's own stop (couples-different-years.md 4.3 g), so the April 2028 rise applies on each person's own date;
 * `lockedUntil[].years` stays counted from the household's start. With one stop for everyone this is the start's own
 * check, exactly as before. The same shape as startWhenPensionsOpen.
 */
export function startAsGiven(household, now) {
  const base = householdStart(household, now);
  const lockedUntil = [];
  for (const p of household.people) {
    const pots = p.pots || {};
    if (!(pots.pension > 0)) continue;
    const age = ageToday(p, now);
    const own = Math.max(base.yearsFromNow, yearsUntilStop(p, now));
    const first = firstOpenAge(age, now, own);
    if (first > age + own) lockedUntil.push({ who: p.who, untilAge: first, years: first - (age + base.yearsFromNow) });
  }
  return {
    date: base.date, yearsFromNow: base.yearsFromNow, moved: false, movedBy: 0, movedFor: [],
    locked: lockedUntil.map((l) => l.who), lockedUntil, accessAge: accessAgeOn(base.date)
  };
}

/**
 * The short form → the full form, plus the list of defaults that were used (answer-C-and-household.md 1.4).
 * Never blocks: a person with only an age and a pot gets a full household.
 *
 * Short-form extras accepted here and removed from the result:
 *   person.pots.total         treated as pension money                     → 'all-pension'
 *   household.jointSavings    a couple's savings between them, split evenly → 'savings-split' (one person: all theirs);
 *                             a couple who stop in different years: all with whoever stops first → 'savings-first' (they
 *                             are joint money, reachable from the first stop; couples-different-years.md 3.4)
 *
 * Couples who stop in different years: `untilBothStop` ({ payCovers: 0 | 0.5 | 1 }) is kept only when the stops differ,
 * and given the owner's default (APART.payCoversDefault: half) when it is not → 'stop-apart'. A partner whose stop is not
 * given stops when the first person does → 'both-stop-together' (only then: a stop given is not an assumption).
 *
 * How the ISAs and savings grow (6.22.0): `isaGrowth` is kept as given ('cash' | 'invested'), only when there is one — the
 * forms always give one ("Mostly cash" unless chosen), so it is never an assumption made here.
 *
 * @returns {{ household: Household, assumed: { id: string, who?: string }[] }}
 */
export function expandHousehold(short, now) {
  const assumed = [];
  const note = (id, who) => { assumed.push(who ? { id, who } : { id }); };
  const src = short || {};
  const list = Array.isArray(src.people) ? src.people : [];
  // Questions A and B mark their households by a household-level `saving` (the mix while saving).
  // C's households never carry it, and nothing below changes for them.
  const saver = src.saving !== undefined && src.saving !== null;

  const people = list.map((raw, i) => {
    const p = raw || {};
    const who = p.who || (i === 0 ? 'you' : 'partner');
    const bornGiven = p.born && isNum(p.born.year) && isNum(p.born.month);
    const born = bornGiven ? { ...p.born } : bornFromAge(p.age, now);
    const age = isNum(p.age) ? p.age : ageOn(born, now);

    const potsIn = p.pots || {};
    const pots = { pension: potsIn.pension || 0, isa: potsIn.isa || 0, otherSavings: potsIn.otherSavings || 0, cash: potsIn.cash || 0 };
    if (isNum(potsIn.total) && potsIn.total > 0) { pots.pension += potsIn.total; note('all-pension', who); }

    const spIn = p.statePension || {};
    const amountGiven = isNum(spIn.amountPerYear);
    const amountPerYear = amountGiven ? spIn.amountPerYear : fullStatePensionYearly();
    if (!amountGiven) note('state-pension-full', who);
    let startAge = spIn.startAge;
    if (!startAge || !isNum(startAge.years)) {
      startAge = bornGiven ? statePensionAge(born) : { years: wholeStatePensionAge(born), months: 0 };
      if (amountPerYear > 0) note('state-pension-age', who);
    }
    const statePension = { amountPerYear, startAge: { years: startAge.years, months: startAge.months || 0 }, source: amountGiven ? 'entered' : 'default' };
    if (spIn.startDate) statePension.startDate = spIn.startDate;

    const finalSalary = (Array.isArray(p.finalSalary) ? p.finalSalary : []).map((f) => {
      if (!f.increases) note('final-salary-rises', who);
      return { ...(f.label ? { label: f.label } : {}), amountPerYear: f.amountPerYear, startAge: f.startAge, increases: f.increases || 'pricesCapped5' };
    });

    const taken = p.pensionTaxFreeCash || 'notTakenYet';
    if (!p.pensionTaxFreeCash && pots.pension > 0) note('quarter-tax-free', who);

    const out = {
      who, label: p.label || (who === 'you' ? 'You' : 'Your partner'), born, age, bornFromAge: !bornGiven,
      stopWork: p.stopWork ? { ...p.stopWork } : null,
      pots, statePension, finalSalary,
      otherIncome: Array.isArray(p.otherIncome) ? p.otherIncome.map((o) => ({ ...o })) : [],
      pensionTaxFreeCash: taken
    };
    // A saver household (questions A and B): what each person pays in. Absent = nothing paid in, and said so.
    if (saver) {
      if (p.saving && typeof p.saving === 'object') {
        const pi = p.saving.payIn || {};
        const own = isNum(pi.own) ? pi.own : null;
        const employer = isNum(pi.employer) ? pi.employer : null;
        const total = isNum(pi.total) ? pi.total : (own || 0) + (employer || 0);
        out.saving = { payIn: { total, own, employer }, savingsIn: isNum(p.saving.savingsIn) ? p.saving.savingsIn : 0, alreadyDrawing: p.saving.alreadyDrawing === true };
      } else {
        out.saving = null;
        note('nothing-paid-in', who);
      }
    }
    return out;
  });

  // A partner who was not asked when they stop starts when the first person does.
  if (people[0] && !people[0].stopWork) people[0].stopWork = { kind: 'already' };
  for (let i = 1; i < people.length; i++) {
    if (people[i].stopWork) continue;
    const first = people[0].stopWork;
    const wait = first.kind === 'age' ? Math.max(0, first.age - people[0].age) : 0;
    people[i].stopWork = first.kind === 'age' ? { kind: 'age', age: people[i].age + wait } : { ...first };
    note('both-stop-together');
  }

  const apart = stopApart(people, now);
  const joint = isNum(src.jointSavings) ? src.jointSavings : 0;
  if (joint > 0 && people.length) {
    if (apart) {
      // all with whoever stops first: split evenly, half of it would wait behind the other's stop
      const waits = people.map((p) => yearsUntilStop(p, now));
      people[waits.indexOf(Math.min(...waits))].pots.isa += joint;
      note('savings-first');
    } else {
      for (const p of people) p.pots.isa += joint / people.length;
      if (people.length > 1) note('savings-split');
    }
  }
  const given = src.untilBothStop && typeof src.untilBothStop === 'object' && PAY_COVERS_VALUES.includes(src.untilBothStop.payCovers);
  if (apart && !given) note('stop-apart');

  const planToAge = isNum(src.planToAge) ? src.planToAge : 95;
  if (!isNum(src.planToAge)) note('plan-to');
  const portfolio = src.portfolio ? { ...src.portfolio } : { kind: 'risk', level: 'balanced' };
  if (!src.portfolio) note('risk');
  const strategy = src.strategy ? { ...src.strategy } : { id: 'steady' };
  if (!src.strategy) note('steady');
  // The household's one fund and platform charge (6.19.0): percent a year, as given, or the shared default (0.5).
  const chargesPct = isChargesPct(src.chargesPct) ? src.chargesPct : DEFAULT_CHARGES_PCT;
  if (!isChargesPct(src.chargesPct)) note('charges');
  if (people.length > 1) note('both-alive');

  const household = { inputVersion: 1, people, spending: src.spending || null, planToAge, portfolio, strategy, chargesPct };
  // How the ISAs and savings grow (6.22.0): carried as given, only when there is one (every form gives one; a household
  // made by hand without one is today's, key for key)
  if (isIsaGrowth(src.isaGrowth)) household.isaGrowth = src.isaGrowth;
  if (saver) {
    const sv = typeof src.saving === 'object' ? src.saving : {};
    const level = portfolio.kind === 'risk' ? portfolio.level : 'balanced';
    if (!sv.risk) note('risk-saving');
    household.saving = { risk: sv.risk || level };
  }
  if (apart) household.untilBothStop = { payCovers: given ? src.untilBothStop.payCovers : PAY_COVERS[APART.payCoversDefault] };
  // what is spent changing with age: carried as given, only when there is one (spending-shape.md 5.1)
  if (src.shape && typeof src.shape === 'object') household.shape = JSON.parse(JSON.stringify(src.shape));
  return { household, assumed };
}

/**
 * Problems with a full household, as data — never throws for a bad value, and is the only place a household
 * range is checked (the form's own limits are checked by validate.js against the input list).
 * @returns {{ field: string, problem: string }[]}   problem: 'required' | 'notANumber' | 'tooLow' | 'tooHigh' | 'notAnOption' | 'end-after-start'
 *   | 'stop-together' (people who stop in different years with no `untilBothStop` to say how the years apart are paid:
 *   expandHousehold always gives one, so only a household made by hand can be missing it)
 */
export function validateHousehold(household, now) {
  const problems = [];
  const bad = (field, problem) => { problems.push({ field, problem }); };
  const range = (field, v, { min, max }) => {
    if (!isNum(v)) { bad(field, v == null ? 'required' : 'notANumber'); return false; }
    if (v < min) { bad(field, 'tooLow'); return false; }
    if (v > max) { bad(field, 'tooHigh'); return false; }
    return true;
  };
  if (!isDate(now)) bad('now', 'required');
  const h = household || {};
  const people = Array.isArray(h.people) ? h.people : [];
  if (people.length < HOUSEHOLD_LIMITS.people.min) bad('people', 'required');
  if (people.length > HOUSEHOLD_LIMITS.people.max) bad('people', 'tooHigh');

  people.forEach((p, i) => {
    const at = `people.${i}`;
    const ageOk = range(`${at}.age`, p && p.age, HOUSEHOLD_LIMITS.age);
    if (ageOk && !Number.isInteger(p.age)) bad(`${at}.age`, 'notANumber');
    for (const pot of ['pension', 'isa', 'otherSavings', 'cash']) range(`${at}.pots.${pot}`, p && p.pots ? p.pots[pot] : undefined, HOUSEHOLD_LIMITS.pot);
    range(`${at}.statePension.amountPerYear`, p && p.statePension ? p.statePension.amountPerYear : undefined, HOUSEHOLD_LIMITS.statePensionAYear);
    ((p && p.finalSalary) || []).forEach((f, j) => {
      range(`${at}.finalSalary.${j}.amountPerYear`, f.amountPerYear, HOUSEHOLD_LIMITS.finalSalaryAYear);
      range(`${at}.finalSalary.${j}.startAge`, f.startAge, HOUSEHOLD_LIMITS.finalSalaryStartAge);
      if (!['prices', 'pricesCapped5', 'none'].includes(f.increases)) bad(`${at}.finalSalary.${j}.increases`, 'notAnOption');
    });
    if (p && !['notTakenYet', 'alreadyTaken'].includes(p.pensionTaxFreeCash)) bad(`${at}.pensionTaxFreeCash`, 'notAnOption');
    // The saving years (step 4 brief 4.10): what is paid in, and part-time work.
    if (p && p.saving) {
      const pi = p.saving.payIn || {};
      range(`${at}.saving.payIn.total`, pi.total, HOUSEHOLD_LIMITS.payInAMonth);
      if (pi.own !== null && pi.own !== undefined) range(`${at}.saving.payIn.own`, pi.own, HOUSEHOLD_LIMITS.payInAMonth);
      if (pi.employer !== null && pi.employer !== undefined) range(`${at}.saving.payIn.employer`, pi.employer, HOUSEHOLD_LIMITS.payInAMonth);
      range(`${at}.saving.savingsIn`, p.saving.savingsIn, HOUSEHOLD_LIMITS.savingsInAMonth);
    }
    ((p && p.otherIncome) || []).forEach((o, j) => {
      if (!o || o.kind !== 'work') return;
      range(`${at}.otherIncome.${j}.amountPerYear`, o.amountPerYear, HOUSEHOLD_LIMITS.workAYear);
      if (isNum(o.fromAge) && isNum(o.toAge)) range(`${at}.otherIncome.${j}.years`, o.toAge - o.fromAge, HOUSEHOLD_LIMITS.workYears);
      else bad(`${at}.otherIncome.${j}.fromAge`, 'required');
    });
  });
  if (h.saving && !RISK_LEVELS.includes(h.saving.risk)) bad('saving.risk', 'notAnOption');
  // the one charge, when the household carries it (every household the model makes does; absent = none, as the engine reads it)
  if (h.chargesPct !== undefined) range('chargesPct', h.chargesPct, HOUSEHOLD_LIMITS.chargesPct);
  // how the savings grow (6.22.0), when the household carries it (every household the forms make does; absent = the
  // engines' fixed rate, as they read it)
  if (h.isaGrowth !== undefined && !isIsaGrowth(h.isaGrowth)) bad('isaGrowth', 'notAnOption');

  const planOk = range('planToAge', h.planToAge, HOUSEHOLD_LIMITS.planToAge);
  const pf = h.portfolio || {};
  if (pf.kind === 'risk') { if (!RISK_LEVELS.includes(pf.level)) bad('portfolio.level', 'notAnOption'); }
  else if (pf.kind === 'mix') {
    const sum = (pf.equity || 0) + (pf.bond || 0) + (pf.cash || 0);
    if (![pf.equity, pf.bond, pf.cash].every((v) => isNum(v) && v >= 0) || Math.abs(sum - 1) > 1e-9) bad('portfolio', 'notAnOption');
  } else bad('portfolio.kind', 'notAnOption');

  // What is spent changing with age (spending-shape.md 3.7), when the household has it.
  if (h.shape !== undefined) shapeProblems(h.shape).forEach((x) => bad(x.field, x.problem));

  // The pay line of a couple who stop in different years (couples-different-years.md 3.4): half, all or none.
  if (h.untilBothStop !== undefined && !(h.untilBothStop && PAY_COVERS_VALUES.includes(h.untilBothStop.payCovers))) bad('untilBothStop.payCovers', 'notAnOption');
  // People who stop in different years must say how the years apart are paid (step 4 brief conflict 17 asked them to stop
  // together; from couples-different-years.md each stops on their own date, with `untilBothStop`).
  if (people.length > 1 && isDate(now) && !problems.length && h.untilBothStop === undefined) {
    if (stopApart(people, now)) bad('people.1.stopWork', 'stop-together');
  }
  // The end comes after both stops — the younger person's age at the LATER one — and the later stop is less than the
  // longest run (RULES.maxYears) after the first. One stop for everyone: the start's own check, as before.
  if (!problems.length && planOk && isDate(now)) {
    const start = h.saving ? startAsGiven(h, now) : startWhenPensionsOpen(h, now);
    const waits = people.map((p) => yearsUntilStop(p, now));
    const later = Math.max(start.yearsFromNow, ...waits);
    const younger = Math.min(...people.map((p) => p.age)) + later;
    if (h.planToAge <= younger || Math.max(...waits) - Math.min(...waits) >= RULES.maxYears) bad('planToAge', 'end-after-start');
  }
  return problems;
}

/**
 * A household's shape against the model's limits (spending-shape.md 3.7): a unit; for £ a month a first amount; each "then"
 * one of the three, a fall within its limits; ages whole and rising; amounts within their limits; "moves evenly" never on
 * the last. → { field, problem }[] (the form's own checks say the same in words, by box: validate.js).
 */
function shapeProblems(shape) {
  const out = [];
  const bad = (field, problem) => out.push({ field, problem });
  if (!shape || !['perMonth', 'share'].includes(shape.unit)) { bad('shape.unit', 'notAnOption'); return out; }
  if (shape.unit === 'perMonth' && !(isNum(shape.first) && shape.first > 0)) bad('shape.first', 'required');
  const thenOk = (t, f, at) => {
    if (!THEN.includes(t)) bad(`${at}.then`, 'notAnOption');
    else if (t === 'falls' && !(isNum(f) && f >= SHAPE_LIMITS.fallsPct.min && f <= SHAPE_LIMITS.fallsPct.max)) bad(`${at}.fallsPct`, 'notANumber');
  };
  const start = shape.start || {};
  thenOk(start.then || 'level', start.fallsPct, 'shape.start');
  const steps = Array.isArray(shape.steps) ? shape.steps : [];
  const lim = SHAPE_LIMITS[shape.unit];
  steps.forEach((x, i) => {
    const at = `shape.steps.${i}`;
    if (!(Number.isInteger(x.fromAge) && x.fromAge >= HOUSEHOLD_LIMITS.age.min && x.fromAge <= 130)) bad(`${at}.fromAge`, 'notANumber');
    else if (i > 0 && !(x.fromAge > steps[i - 1].fromAge)) bad(`${at}.fromAge`, 'notANumber');
    const v = x[shape.unit];
    if (!isNum(v)) bad(`${at}.${shape.unit}`, 'required');
    else if (v < lim.min) bad(`${at}.${shape.unit}`, 'tooLow');
    else if (v > lim.max) bad(`${at}.${shape.unit}`, 'tooHigh');
    thenOk(x.then || 'level', x.fallsPct, at);
  });
  if (steps.length && steps[steps.length - 1].then === 'glides') bad(`shape.steps.${steps.length - 1}.then`, 'notAnOption');
  if (!steps.length && start.then === 'glides') bad('shape.start.then', 'notAnOption');
  return out;
}

export { isoOf as isoDate };
