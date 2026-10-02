/**
 * TEST ONLY — households of couples who stop work in different years, made straight through the household model
 * (research/v7/couples-different-years.md 3.4, 4.1), for the engine's tests (P1). A's, B's and C's own mappings are tested
 * in their own files; these builders do not wait on them.
 *
 *   apart(opts)                a full household (expandHousehold): each person with their own stop, the pay line
 *   stopAgeOf(household, who)  that person's age at their own stop (the stop age stopAtPlan is asked about)
 *   flatWorld(extra?)          env for a flat world: no returns, flat prices, savings growth of 0, all shares
 */
import { expandHousehold } from '../../../src/answers/shared/household.js';
import { flatLife, TODAY } from '../saving/invariants.js';

/**
 * @param {{ you: object, partner: object, payCovers?: 0 | 0.5 | 1 | null, endAge?: number, risk?: string, savingRisk?: string,
 *           mix?: object|null, charge?: number, taxFreeTaken?: boolean|'you'|'partner', today?: string }} o
 *   you / partner: { age, pot, isa, payIn, savingsIn, stop: 'already' | an age, sp: 'full' | 'none' | £ a year,
 *   finalSalary: { yearly, fromAge }, work: { yearly, years } }. A person who has stopped pays nothing in.
 *   payCovers null leaves the pay line unanswered (the model's default, half). charge: a share a year (0.005 = 0.5%).
 */
export function apart({ you, partner, payCovers = 0.5, endAge = 95, risk = 'balanced', savingRisk = risk, mix = null, charge = 0.005, taxFreeTaken = false, today = TODAY } = {}) {
  const person = (who, p) => {
    const stopped = p.stop === 'already' || p.stop <= p.age;
    const S = stopped ? 0 : p.stop - p.age;
    const statePension = p.sp === 'none' ? { amountPerYear: 0 } : typeof p.sp === 'number' ? { amountPerYear: p.sp } : {};
    return {
      who, age: p.age, pots: { pension: p.pot || 0, isa: p.isa || 0 },
      statePension,
      finalSalary: p.finalSalary ? [{ amountPerYear: p.finalSalary.yearly, startAge: p.finalSalary.fromAge, increases: 'pricesCapped5' }] : [],
      stopWork: p.stop === 'already' ? { kind: 'already' } : { kind: 'age', age: p.stop },
      saving: { payIn: { total: stopped ? 0 : (p.payIn || 0), own: null, employer: null }, savingsIn: stopped ? 0 : (p.savingsIn || 0), alreadyDrawing: false },
      otherIncome: p.work ? [{ kind: 'work', label: 'part-time', amountPerYear: p.work.yearly, fromAge: p.age + S, toAge: p.age + S + p.work.years }] : [],
      ...(taxFreeTaken === true || taxFreeTaken === who ? { pensionTaxFreeCash: 'alreadyTaken' } : {})
    };
  };
  const short = {
    people: [person('you', you), person('partner', partner)], planToAge: endAge,
    portfolio: mix ? { kind: 'mix', ...mix } : { kind: 'risk', level: risk },
    strategy: { id: 'steady' }, saving: { risk: savingRisk }, chargesPct: charge * 100, spending: null,
    ...(payCovers === null ? {} : { untilBothStop: { payCovers } })
  };
  return expandHousehold(short, today).household;
}

/** A person's age at their own stop: their stop age, or their age today when they have stopped. */
export function stopAgeOf(household, who = 'you') {
  const p = household.people.find((q) => q.who === who);
  return p.stopWork.kind === 'age' ? Math.max(p.age, p.stopWork.age) : p.age;
}

export const SHARES = { equity: 1, bond: 0, cash: 0 };

/** A flat world: shares return nothing, prices stay flat (futures.js keeps them so), savings grow at 0, all shares, no charge. */
export const flatWorld = (extra = {}) => ({ today: TODAY, futures: 10, seed: 0, futureReturns: flatLife(0, 0), savingsGrowth: 0, mix: SHARES, savingMix: SHARES, ...extra });
