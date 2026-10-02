/**
 * Question B's form inputs (SCHEMA_B, checked) → the household model (step 4 brief 4.10).
 *
 * C's mapping (you.pot, savings, State Pension, final-salary pension, age, risk, endAge — src/answers/c/toHousehold.js),
 * plus the saving years:
 *
 *   stop.age              → your stopWork { kind: 'age', age: stop.age }; "I've already stopped" → { kind: 'already' }
 *   partner.stop.*        → the partner's own (A's mapping, a/toHousehold.js): not answered or "when you do" → their age + S,
 *                           S = stop.age − you.age (the same year, brief conflict 17); "they already have" → already; an
 *                           age → that age. Each person keeps their own stop (couples-different-years.md 3.4)
 *   untilBothStop         → household.untilBothStop { payCovers }, kept only when the stops differ
 *   taxFreeTaken          → people[i].pensionTaxFreeCash 'alreadyTaken' when yes
 *   spend.*               → spending { kind: 'amount', perMonthTakeHome } | { kind: 'lifestyle', level }
 *   spend.then / fallsPct / steps → household.shape (spending-shape.md 3), only when it changes with age (A's rule)
 *   you.payIn.*           → people[i].saving.payIn { total, own, employer }: what lands in the pension each month, today's
 *                           prices (conflict 11); "split it up" keeps own and employer, whose sum is the total
 *   you.alreadyDrawing    → people[i].saving.alreadyDrawing (the £10,000 warning only)
 *   savingsIn             → people[i].saving.savingsIn: a month into ISAs and savings, split evenly for a couple (as savings are);
 *                           stopping in different years, evenly among those still working today
 *   savingRisk            → household.saving { risk }
 *   charge                → household.chargesPct, percent a year as typed (6.19.0: the one charge, saving and drawing;
 *                           0.05 stays 0.05 — no rounding to tenths)
 *   isaGrowth             → household.isaGrowth, 'cash' or 'invested' (6.22.0: how the savings grow, saving and drawing;
 *                           on the form only once there is money in savings; not given, "Mostly cash": every household
 *                           the form makes says how its savings grow)
 *
 * `env.mix` (tests only) holds the drawing years in an exact mix, as C; `env.savingMix` is read by the saving years.
 *
 * @param {object} inputs  checked inputs of SCHEMA_B
 * @param {{ today: string, mix?: object }} env
 * @param {number} [stopAge]
 * `stopAge` (optional) is the stop of the person the answer is about (askedAbout: you, or your partner when you have
 * already stopped), for B's rows and levers; by default theirs as given. `S` is the years until it. The other person's
 * stop is fixed; "when you do" moves with it.
 *
 * @returns {{ household: import('../shared/household.js').Household, assumed: { id: string, who?: string }[], fullStatePensionAYear: number, S: number }}
 */
import { isIsaGrowth } from '../../services/IsaGrowth.js';
import { expandHousehold } from '../shared/household.js';
import { fullStatePensionYearly, RULES } from '../shared/rules.js';
import { askedAbout, stopYearsOf, stopWorksOf, savingsInShares, untilBothStopOf, shapeOfInputs, spendLevelAMonth } from '../shared/schemaParts.js';

/** What lands in `who`'s pension each month, as given. */
export function payInOf(p) {
  const pi = (p && p.payIn) || { kind: 'total', total: 0 };
  if (pi.kind === 'split') return { total: (pi.own || 0) + (pi.employer || 0), own: pi.own || 0, employer: pi.employer || 0 };
  return { total: pi.total || 0, own: null, employer: null };
}

function person(who, p, stopWork, savingsIn) {
  const sp = p.statePension || { kind: 'full' };
  const fs = p.finalSalary || { has: false };
  return {
    who,
    age: p.age,
    pots: { pension: p.pot || 0 },
    statePension: sp.kind === 'full' ? {} : { amountPerYear: sp.kind === 'none' ? 0 : sp.yearly },
    finalSalary: fs.has ? [{ amountPerYear: fs.yearly, startAge: fs.fromAge, increases: 'pricesCapped5' }] : [],
    stopWork,
    saving: { payIn: payInOf(p), savingsIn, alreadyDrawing: Boolean(p.alreadyDrawing) },
    ...(p.taxFreeTaken === true ? { pensionTaxFreeCash: 'alreadyTaken' } : {})
  };
}

export function toHousehold(inputs, env, stopAge) {
  const couple = inputs.household === 'couple' && Boolean(inputs.partner);
  const stops = stopYearsOf(inputs, stopAge);
  const S = askedAbout(inputs) === 'partner' ? stops.partner : stops.you;
  const shares = savingsInShares(inputs.savingsIn || 0, stops, couple);
  const stopWork = stopWorksOf(inputs, stops);
  const people = [person('you', inputs.you, stopWork[0], shares[0])];
  if (couple) people.push(person('partner', inputs.partner, stopWork[1], shares[1]));
  const spending = inputs.spend.kind === 'level'
    ? { kind: 'lifestyle', level: inputs.spend.level }
    : { kind: 'amount', perMonthTakeHome: inputs.spend.amount };
  const saving = { risk: inputs.savingRisk || 'balanced' };
  const short = {
    people,
    jointSavings: inputs.savings || 0,
    planToAge: inputs.endAge,
    spending,
    saving,
    ...(typeof inputs.charge === 'number' && Number.isFinite(inputs.charge) ? { chargesPct: inputs.charge } : {}),
    // how the savings grow (6.22.0): as chosen, else "Mostly cash" — also with no savings today, so any savings the answer
    // works with (B's set aside for the years before a pension opens) grow as the form would grow them
    isaGrowth: isIsaGrowth(inputs.isaGrowth) ? inputs.isaGrowth : RULES.isaGrowthDefault,
    ...untilBothStopOf(inputs),
    portfolio: env && env.mix ? { kind: 'mix', equity: env.mix.equity || 0, bond: env.mix.bond || 0, cash: env.mix.cash || 0 } : { kind: 'risk', level: inputs.risk || 'balanced' },
    strategy: { id: 'steady' }
  };
  // what is spent changing with age (spending-shape.md 3): the steps by your age, the first amount the figure spent
  const first = inputs.spend.kind === 'level' ? spendLevelAMonth(inputs.household, inputs.spend.level) : inputs.spend.amount;
  const shape = shapeOfInputs(inputs, 'spend', first);
  if (shape) short.shape = shape;
  const { household, assumed } = expandHousehold(short, env.today);
  // The saving years' fields ride on the household whether or not the expansion carries them (it keeps what it knows).
  // Each person keeps their own stop (never one shared stop written over both: couples-different-years.md 3.4).
  household.people.forEach((p, i) => {
    if (!p.saving) p.saving = { ...people[i].saving, payIn: { ...people[i].saving.payIn } };
    if (!p.stopWork) p.stopWork = { ...people[i].stopWork };
  });
  if (!household.saving) household.saving = { ...saving };
  if (!household.spending) household.spending = { ...spending };
  return { household, assumed, fullStatePensionAYear: fullStatePensionYearly(), S };
}
