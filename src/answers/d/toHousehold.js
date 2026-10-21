/**
 * Question D's checked inputs (SCHEMA_D) → the household model (research/v7/answer-D.md 4.3).
 *
 * This is A's mapping (src/answers/a/toHousehold.js) with everyone's stop at today's age: the saving years are empty,
 * the kernels are the pots as given, and the drawing years start today (stopAt.js at a stop of today's age — question
 * C's band on question C's futures, to the bit).
 *
 *   you.pot / partner.pot     → people[i].pots.pension
 *   savings                   → ISA money: all of it for one person; a couple, half each (jointSavings, as C and A)
 *   statePension.kind         'full' → the default amount; 'forecast' → yearly as typed; 'none' → 0
 *   finalSalary               → a list of one, rising with prices up to 5% a year (pricesCapped5)
 *   stopped (= 'yes')         → people[i].stopWork = { kind: 'already' } — both of a couple (the form refuses "not yet")
 *   taxFreeTaken              → people[i].pensionTaxFreeCash = 'alreadyTaken' when yes or some (else unset: a quarter of
 *                               each withdrawal is tax-free, as C and A read "not taken")
 *   each person's saving      → { payIn: 0, savingsIn: 0 }: nothing more goes in; household.saving = { risk } (no saving
 *                               years, so the saving mix is the drawing mix)
 *   work.*                    → people[0].otherIncome = [{ kind: 'work', amountPerYear: yearly, fromAge: age today,
 *                               toAge: age + years }] — A's partTime with the stop at today (answer-D.md 7, I-D4)
 *   spend.*                   → household.spending: { kind: 'amount', perMonthTakeHome } | { kind: 'lifestyle', level }
 *   risk, charge, isaGrowth, endAge → as A
 *
 * `fallInputs(inputs)` is the form of "What if shares fell by a fifth?" (answer-D.md 3.7): the same inputs with each
 * pension scaled by (1 − 0.2 × the share held in shares) and, when the savings are "invested like my pension", the
 * savings too; cash does not fall. D's fall lever is D on those inputs (I-D5): one mapping, one path.
 *
 * Pure: no clock (env.today is the date), no storage, no screen.
 *
 * @param {object} inputs   checked inputs of SCHEMA_D
 * @param {{ today: string, mix?: { equity: number, bond: number, cash: number } }} env
 * @returns {{ household: import('../shared/household.js').Household, assumed: { id: string, who?: string }[], fullStatePensionAYear: number, stopAge: number }}
 */
import { isIsaGrowth } from '../../services/IsaGrowth.js';
import { expandHousehold } from '../shared/household.js';
import { fullStatePensionYearly, RULES } from '../shared/rules.js';
import { mixOf } from '../shared/toEngine.js';
import { FALL_SHARE, spendOf } from './schema.js';

const isNum = (v) => typeof v === 'number' && Number.isFinite(v);

/** Whether the tax-free part has gone: 'yes' or 'some' (counted as all taken, the cautious side). */
export const taxFreeGone = (answer) => answer === 'yes' || answer === 'some';

function person(who, p) {
  const sp = p.statePension || { kind: 'full' };
  const fs = p.finalSalary || { has: false };
  return {
    who,
    age: p.age,
    pots: { pension: p.pot || 0 },
    statePension: sp.kind === 'full' ? {} : { amountPerYear: sp.kind === 'none' ? 0 : sp.yearly },
    finalSalary: fs.has ? [{ amountPerYear: fs.yearly, startAge: fs.fromAge, increases: 'pricesCapped5' }] : [],
    stopWork: { kind: 'already' },
    saving: { payIn: { total: 0, own: null, employer: null }, savingsIn: 0, alreadyDrawing: false },
    otherIncome: [],
    ...(taxFreeGone(p.taxFreeTaken) ? { pensionTaxFreeCash: 'alreadyTaken' } : {})
  };
}

export function toHousehold(inputs, env) {
  const couple = inputs.household === 'couple' && !!inputs.partner;
  const people = [person('you', inputs.you)];
  if (couple) people.push(person('partner', inputs.partner));

  // Work from today (the lever): the first person only, for a whole number of years.
  const w = inputs.work || { has: false };
  if (w.has && isNum(w.yearly) && isNum(w.years)) {
    const from = inputs.you.age;
    people[0].otherIncome = [{ label: 'Work', kind: 'work', amountPerYear: w.yearly, fromAge: from, toAge: from + w.years }];
  }

  const spend = inputs.spend || {};
  const spending = spend.kind === 'level'
    ? { kind: 'lifestyle', level: spend.level }
    : { kind: 'amount', perMonthTakeHome: spend.amount };
  const saving = { risk: inputs.risk || 'balanced' };

  const short = {
    people,
    jointSavings: inputs.savings || 0,
    planToAge: inputs.endAge,
    spending,
    saving,
    ...(isNum(inputs.charge) ? { chargesPct: inputs.charge } : {}),
    isaGrowth: isIsaGrowth(inputs.isaGrowth) ? inputs.isaGrowth : RULES.isaGrowthDefault,
    portfolio: env && env.mix ? { kind: 'mix', equity: env.mix.equity || 0, bond: env.mix.bond || 0, cash: env.mix.cash || 0 } : { kind: 'risk', level: inputs.risk || 'balanced' },
    strategy: { id: 'steady' }
  };
  const { household, assumed } = expandHousehold(short, env.today);
  // The household model carries what the stop plan reads (as A's mapping keeps it), whatever version of expandHousehold reads it.
  household.people.forEach((p, i) => {
    if (!p.saving) p.saving = { ...people[i].saving, payIn: { ...people[i].saving.payIn } };
    if (!p.stopWork) p.stopWork = { kind: 'already' };
  });
  if (!household.spending) household.spending = spending;
  if (!household.saving) household.saving = saving;
  return { household, assumed, fullStatePensionAYear: fullStatePensionYearly(), stopAge: inputs.you.age, spend: spendOf(inputs) };
}

/** The share of the pots held in shares, for these inputs (the risk level's preset, or a test's exact mix). */
export function equityShareOf(inputs, env) {
  const portfolio = env && env.mix ? { kind: 'mix', equity: env.mix.equity || 0, bond: env.mix.bond || 0, cash: env.mix.cash || 0 } : { kind: 'risk', level: inputs.risk || 'balanced' };
  return mixOf(portfolio).equity;
}

/** The factor the pots fall by when shares fall by a fifth and the mix is kept: 1 − 0.2 × the share in shares. */
export function fallFactorOf(inputs, env) {
  return 1 - FALL_SHARE * equityShareOf(inputs, env);
}

/**
 * The inputs of "What if shares fell by a fifth?" (answer-D.md 3.7): each pension × the fall factor; the savings too when
 * they are invested like the pension, as they are when the box says so; cash savings do not fall. The State Pension and
 * a final-salary pension do not change. The lever itself is left off (the fall is not tried twice).
 */
export function fallInputs(inputs, env) {
  const f = fallFactorOf(inputs, env);
  const out = { ...inputs, you: { ...inputs.you, pot: (inputs.you.pot || 0) * f }, fall: { has: false } };
  if (inputs.household === 'couple' && inputs.partner) out.partner = { ...inputs.partner, pot: (inputs.partner.pot || 0) * f };
  if (inputs.isaGrowth === 'invested' && (inputs.savings || 0) > 0) out.savings = inputs.savings * f;
  return out;
}
