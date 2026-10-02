/**
 * The form's inputs (SCHEMA_C, checked) → the household model (build brief 4.3 point 1).
 *
 *   you.pot                  → people[0].pots.pension
 *   savings                  → ISA money: all of it for one person; a couple, half each
 *   start.kind 'now'         → stopWork { kind: 'already' }; 'age' → { kind: 'age', age } (the partner starts at the same time
 *                              unless their own stop is given)
 *   partner.stop.*           → not answered or "when you start" → the partner starts with you, as before; "they already have"
 *                              → { kind: 'already' }; an age → { kind: 'age', age } (couples-different-years.md 3.4, 5.1)
 *   untilBothStop            → household.untilBothStop { payCovers }, kept only when the stops differ
 *   taxFreeTaken             → people[i].pensionTaxFreeCash 'alreadyTaken' when yes
 *   statePension.kind        'full' → the default amount; 'forecast' → yearly as typed; 'none' → 0
 *   finalSalary              → a list of one, rising with prices up to 5% a year (pricesCapped5)
 *   age                      → born, the birthday being today
 *   risk                     → portfolio { kind: 'risk', level }   (env.mix, tests only: an exact mix instead)
 *   charge                   → chargesPct, percent a year as typed (6.19.0: the household's one fund and platform charge,
 *                              taken while drawing — and, on the lives, while the money waits to be taken)
 *   endAge                   → planToAge
 *
 * @param {object} inputs  checked inputs
 * @param {{ today: string, mix?: { equity: number, bond: number, cash: number } }} env
 * @returns {{ household: import('../shared/household.js').Household, assumed: { id: string, who?: string }[] }}
 */
import { expandHousehold } from '../shared/household.js';
import { fullStatePensionYearly } from '../shared/rules.js';
import { untilBothStopOf, stopYearsOf } from '../shared/schemaParts.js';

function person(who, p, inputs) {
  const sp = p.statePension || { kind: 'full' };
  const fs = p.finalSalary || { has: false };
  const out = {
    who,
    age: p.age,
    pots: { pension: p.pot || 0 },
    statePension: sp.kind === 'full' ? {} : { amountPerYear: sp.kind === 'none' ? 0 : sp.yearly },
    // Rising with prices up to 5% a year (build brief 4.3 point 1; the commonest scheme rule). In a future where
    // prices rise faster than that the pension falls behind and the person's own pot makes good the difference —
    // the household take-home stays level, at some cost to the pot.
    finalSalary: fs.has ? [{ amountPerYear: fs.yearly, startAge: fs.fromAge, increases: 'pricesCapped5' }] : []
  };
  // The partner's own stop when it is in another year; in yours (not answered, "when you start", or said another way)
  // it is written as before, so a same-year household is today's, key for key.
  const own = who === 'partner' && p.stop ? p.stop : {};
  const stops = stopYearsOf(inputs);
  if (own.kind === 'already' && stops.partner !== stops.you) out.stopWork = { kind: 'already' };
  else if (own.kind === 'age' && stops.partner !== stops.you) out.stopWork = { kind: 'age', age: own.age };
  else if (inputs.start && inputs.start.kind === 'age') {
    const wait = Math.max(0, inputs.start.age - inputs.you.age);
    out.stopWork = { kind: 'age', age: p.age + wait };
  } else {
    out.stopWork = { kind: 'already' };
  }
  if (p.taxFreeTaken === true) out.pensionTaxFreeCash = 'alreadyTaken';
  return out;
}

export function toHousehold(inputs, env) {
  const couple = inputs.household === 'couple' && inputs.partner;
  const people = [person('you', inputs.you, inputs)];
  if (couple) people.push(person('partner', inputs.partner, inputs));
  const short = {
    people,
    jointSavings: inputs.savings || 0,
    planToAge: inputs.endAge,
    ...(typeof inputs.charge === 'number' && Number.isFinite(inputs.charge) ? { chargesPct: inputs.charge } : {}),
    ...untilBothStopOf(inputs),
    portfolio: env && env.mix ? { kind: 'mix', equity: env.mix.equity || 0, bond: env.mix.bond || 0, cash: env.mix.cash || 0 } : { kind: 'risk', level: inputs.risk || 'balanced' },
    strategy: { id: 'steady' }
  };
  const { household, assumed } = expandHousehold(short, env.today);
  // The form asked these, so they are not the household's defaults; what was a default at the form is answer.js's business.
  return { household, assumed, fullStatePensionAYear: fullStatePensionYearly() };
}
