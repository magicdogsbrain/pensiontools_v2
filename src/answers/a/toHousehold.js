/**
 * Question A's checked inputs (SCHEMA_A) → the household model (step 4 brief 4.10).
 *
 * C's mapping (src/answers/c/toHousehold.js), plus the saving years:
 *
 *   you.pot / partner.pot     → people[i].pots.pension
 *   savings                   → ISA money: all of it for one person; a couple, half each (jointSavings, as C)
 *   statePension.kind         'full' → the default amount; 'forecast' → yearly as typed; 'none' → 0
 *   finalSalary               → a list of one, rising with prices up to 5% a year (pricesCapped5)
 *   stop.age                  → people[*].stopWork = { kind: 'age', age: theirAge + S }, S = stop.age − you.age (both stop in the same year)
 *   payIn.* , alreadyDrawing  → people[i].saving = { payIn: { total, own, employer }, savingsIn, alreadyDrawing }
 *   savingsIn                 → a month into ISAs and savings: all of it for one person; a couple, half each (as the savings)
 *   savingRisk                → household.saving = { risk }
 *   charge                    → household.chargesPct, percent a year as typed (6.19.0: the one charge, saving and drawing)
 *   partTime.*                → people[0].otherIncome = [{ kind: 'work', amountPerYear: yearly, fromAge: stop, toAge: stop + years }]
 *   spend.*                   → household.spending: { kind: 'amount', perMonthTakeHome } | { kind: 'lifestyle', level }
 *   risk                      → portfolio { kind: 'risk', level }   (env.mix, tests only: an exact mix instead)
 *   endAge                    → planToAge
 *
 * `stopAge` (optional) is the stop to build the household for — A works out several stop ages from one set of
 * inputs; the part-time earnings always start at the stop. It defaults to stop.age, or today's age when the
 * inputs ask to be shown ages.
 *
 * Pure: no clock (env.today is the date), no storage, no screen.
 *
 * @param {object} inputs   checked inputs of SCHEMA_A
 * @param {{ today: string, mix?: { equity: number, bond: number, cash: number } }} env
 * @param {number} [stopAge]
 * @returns {{ household: import('../shared/household.js').Household, assumed: { id: string, who?: string }[], fullStatePensionAYear: number, stopAge: number, S: number }}
 */
import { expandHousehold } from '../shared/household.js';
import { fullStatePensionYearly } from '../shared/rules.js';

const isNum = (v) => typeof v === 'number' && Number.isFinite(v);

/** What lands in the pension a month, as given: { total, own, employer }. `own` and `employer` are null unless split. */
export function payInOf(person) {
  const p = (person && person.payIn) || {};
  if (p.kind === 'split') {
    const own = isNum(p.own) ? p.own : 0;
    const employer = isNum(p.employer) ? p.employer : 0;
    return { total: own + employer, own, employer };
  }
  return { total: isNum(p.total) ? p.total : 0, own: null, employer: null };
}

/** The stop the inputs name: stop.age, or today's age when "show me ages" (the rows then say which stop). */
export function namedStopAge(inputs) {
  const stop = inputs.stop || {};
  return stop.kind === 'age' && isNum(stop.age) ? stop.age : inputs.you.age;
}

function person(who, p, inputs, S, savingsInShare) {
  const sp = p.statePension || { kind: 'full' };
  const fs = p.finalSalary || { has: false };
  return {
    who,
    age: p.age,
    pots: { pension: p.pot || 0 },
    statePension: sp.kind === 'full' ? {} : { amountPerYear: sp.kind === 'none' ? 0 : sp.yearly },
    finalSalary: fs.has ? [{ amountPerYear: fs.yearly, startAge: fs.fromAge, increases: 'pricesCapped5' }] : [],
    // Both stop in the same year (step 4 brief, conflict 17): the stop is S whole years from today for each of them.
    stopWork: { kind: 'age', age: p.age + S },
    saving: { payIn: payInOf(p), savingsIn: savingsInShare, alreadyDrawing: Boolean(p.alreadyDrawing) },
    otherIncome: []
  };
}

export function toHousehold(inputs, env, stopAge = namedStopAge(inputs)) {
  const couple = inputs.household === 'couple' && inputs.partner;
  const S = Math.max(0, stopAge - inputs.you.age);
  const savingsIn = isNum(inputs.savingsIn) ? inputs.savingsIn : 0;
  const share = couple ? savingsIn / 2 : savingsIn;
  const people = [person('you', inputs.you, inputs, S, share)];
  if (couple) people.push(person('partner', inputs.partner, inputs, S, share));

  // Part-time work: the first person only, from the stop, for a whole number of years (conflict 22).
  const pt = inputs.partTime || { has: false };
  if (pt.has && isNum(pt.yearly) && isNum(pt.years)) {
    const from = inputs.you.age + S;
    people[0].otherIncome = [{ label: 'Part-time work', kind: 'work', amountPerYear: pt.yearly, fromAge: from, toAge: from + pt.years }];
  }

  const spend = inputs.spend || {};
  const spending = spend.kind === 'level'
    ? { kind: 'lifestyle', level: spend.level }
    : { kind: 'amount', perMonthTakeHome: spend.amount };
  const saving = { risk: inputs.savingRisk || 'balanced' };

  const short = {
    people,
    jointSavings: inputs.savings || 0,
    planToAge: inputs.endAge,
    spending,
    saving,
    ...(isNum(inputs.charge) ? { chargesPct: inputs.charge } : {}),
    portfolio: env && env.mix ? { kind: 'mix', equity: env.mix.equity || 0, bond: env.mix.bond || 0, cash: env.mix.cash || 0 } : { kind: 'risk', level: inputs.risk || 'balanced' },
    strategy: { id: 'steady' }
  };
  const { household, assumed } = expandHousehold(short, env.today);
  // The household model carries what the saving years need (step 4 brief 4.10). Kept here too, so the mapping says
  // the same thing whatever version of expandHousehold reads it.
  household.people.forEach((p, i) => {
    if (!p.saving) p.saving = { ...people[i].saving, payIn: { ...people[i].saving.payIn } };
    if (!p.stopWork) p.stopWork = { ...people[i].stopWork };
  });
  if (!household.spending) household.spending = spending;
  if (!household.saving) household.saving = saving;
  return { household, assumed, fullStatePensionAYear: fullStatePensionYearly(), stopAge, S };
}
