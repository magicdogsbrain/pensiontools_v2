/**
 * Plan seeds in the shape V7 writes (research/v7/save-as-plan.md, Contract C.1), for the tests of today's side
 * (src/services/PlanSeed.js). Every figure is made up; none is anyone's.
 *
 * They are written by hand to the contract, because V7's own builder (buildPlanSeed) is built separately. Each one is
 * self-consistent the way an answer's figures are: a couple's take-home rows add up to the chosen amount in every
 * stretch of years where the guaranteed income is below it; ages, dates and years agree with seed.today.
 *
 *   seedA()            question A, one person stopping later: pay-ins (own + employer), State Pension, final salary
 *   seedCNow()         question C, one person taking money from today
 *   seedBCouple()      question B, a couple stopping later, with a budget sheet and two take-home stretches each
 *   seedEarly()        stopping at 54 with savings, before the pension opens at 57
 *   seedZeroPot()      £0 in a pension today, money going in
 *   seedCoupleZeroLater()  a couple taking money now whose final-salary pension covers everything from 62: the
 *                      partner's take-home falls to £0 (the one case the planner needs a per-year schedule for)
 *   seedPartTime()     question A with part-time work after stopping
 *   BUDGET_SHEET       a checked budget sheet (Contract C.5)
 */
export const TODAY = '2026-10-01';
export const CREATED_AT = '2026-10-01T14:03:22.511Z';
export const NOW_MS = Date.parse(CREATED_AT) + 60 * 1000;   // a minute after it was written

const SP_FULL = 12547.6;   // £241.30 a week × 52

export const BUDGET_SHEET = Object.freeze({
  lines: [
    { heading: 'home', label: 'Council tax', annual: 1800, period: 'mo', essential: true },
    { heading: 'food', label: 'Groceries & household', annual: 5640, period: 'mo', essential: true },
    { heading: 'holidays', label: 'Main holiday', annual: 3000, period: 'yr', essential: false },
    { heading: 'health', label: 'Personal health', annual: 480, period: 'mo', essential: true },
    { heading: 'other', label: 'Model railway', annual: 600, period: 'mo', essential: false }
  ],
  oneOffs: [
    { label: 'New car', amount: 18000, year: 2031, everyYears: 8 },
    { label: 'Roof', amount: 9000, year: 2029, everyYears: null }
  ],
  totals: { monthly: 960, yearly: 11520, essentialMonthly: 660 },
  plsaTier: 'moderate'
});

const clone = (v) => JSON.parse(JSON.stringify(v));

function base(over) {
  return {
    seedVersion: 1,
    createdAt: CREATED_AT,
    today: TODAY,
    v7: { appVersion: '6.17.0', engineVersion: '6.17.0', historyEnd: '2025-12' },
    inputs: {},
    budget: null,
    ...over
  };
}

export function seedA() {
  return base({
    source: 'a',
    name: { suggested: 'Stop at 60 · £1,800 a month', chosen: 'Stop at 60 · £1,800 a month' },
    inputs: { household: 'single', you: { age: 56, pot: 250000 }, savings: 20000, spend: { kind: 'amount', amount: 1800 } },
    household: 'single',
    stop: { kind: 'later', yearsFromNow: 4 },
    endAge: 95,
    years: 35,
    risk: 'balanced',
    spend: { perMonth: 1800, from: 'typed', level: null, budgetSkipped: true },
    people: [{
      who: 'you', ageToday: 56, ageAtStop: 60, pensionOpensAge: 57,
      pension: { today: 250000, atStop: { careful: 268000, middling: 341000 } },
      savings: { today: 20000, atStop: { careful: 20500, middling: 23000 } },
      payIn: { kind: 'split', total: 800, own: 500, employer: 300, savingsIn: 0 },
      alreadyDrawing: false,
      statePension: { yearly: SP_FULL, fromAge: 67, fromDate: '2037-10-01' },
      finalSalary: { yearly: 9000, fromAge: 60, increases: 'pricesCapped5' },
      taxFreeQuarter: true,
      partTime: null,
      takeHome: [{ fromAge: 60, perMonth: 1800 }]
    }],
    answer: { monthly: null, lasted: 0.93, runOutAge: 95, verdict: 'yes', potAtStop: { careful: 288500, middling: 364000 }, number: null, payInNeeded: null }
  });
}

export function seedCNow() {
  return base({
    source: 'c',
    name: { suggested: 'From 62 · £1,400 a month', chosen: 'From 62 · £1,400 a month' },
    inputs: { household: 'single', you: { age: 62, pot: 250000 } },
    household: 'single',
    stop: { kind: 'now', yearsFromNow: 0 },
    endAge: 95,
    years: 33,
    risk: 'balanced',
    spend: { perMonth: 1400, from: 'careful', level: null, budgetSkipped: null },
    people: [{
      who: 'you', ageToday: 62, ageAtStop: 62, pensionOpensAge: 55,
      pension: { today: 250000, atStop: { careful: 250000, middling: 250000 } },
      savings: { today: 0, atStop: { careful: 0, middling: 0 } },
      payIn: null,
      alreadyDrawing: false,
      statePension: { yearly: SP_FULL, fromAge: 67, fromDate: '2031-10-01' },
      finalSalary: null,
      taxFreeQuarter: true,
      partTime: null,
      takeHome: [{ fromAge: 62, perMonth: 1400 }]
    }],
    answer: { monthly: { careful: 1400, middling: 1650, good: 2100 }, lasted: 0.9, runOutAge: 95, verdict: null, potAtStop: null, number: null, payInNeeded: null }
  });
}

export function seedBCouple() {
  return base({
    source: 'b',
    name: { suggested: 'Stop at 60 and 58 · £3,500 a month · paying £950', chosen: 'Stop at 60 and 58 · £3,500 a month · paying £950' },
    inputs: { household: 'couple', you: { age: 55, pot: 300000 }, partner: { age: 53, pot: 90000 }, savings: 30000 },
    household: 'couple',
    stop: { kind: 'later', yearsFromNow: 5 },
    endAge: 95,
    years: 37,
    risk: 'cautious',
    spend: { perMonth: 3500, from: 'budget', level: 'moderate', budgetSkipped: false },
    people: [
      {
        who: 'you', ageToday: 55, ageAtStop: 60, pensionOpensAge: 57,
        pension: { today: 300000, atStop: { careful: 330000, middling: 410000 } },
        savings: { today: 15000, atStop: { careful: 15500, middling: 17000 } },
        payIn: { kind: 'total', total: 950, savingsIn: 0 },
        alreadyDrawing: false,
        statePension: { yearly: SP_FULL, fromAge: 67, fromDate: '2038-10-01' },
        finalSalary: null,
        taxFreeQuarter: true,
        partTime: null,
        takeHome: [{ fromAge: 60, perMonth: 2000 }, { fromAge: 67, perMonth: 2100 }]
      },
      {
        who: 'partner', ageToday: 53, ageAtStop: 58, pensionOpensAge: 57,
        pension: { today: 90000, atStop: { careful: 98000, middling: 120000 } },
        savings: { today: 15000, atStop: { careful: 15500, middling: 17000 } },
        payIn: null,
        alreadyDrawing: false,
        statePension: { yearly: SP_FULL, fromAge: 67, fromDate: '2040-10-01' },
        finalSalary: null,
        taxFreeQuarter: true,
        partTime: null,
        takeHome: [{ fromAge: 58, perMonth: 1500 }, { fromAge: 65, perMonth: 1400 }]
      }
    ],
    answer: { monthly: null, lasted: 0.91, runOutAge: 95, verdict: 'yes', potAtStop: null, number: 560000, payInNeeded: 950 },
    budget: clone(BUDGET_SHEET)
  });
}

export function seedEarly() {
  return base({
    source: 'a',
    name: { suggested: 'Stop at 54 · £2,000 a month', chosen: 'Stop at 54 · £2,000 a month' },
    household: 'single',
    stop: { kind: 'later', yearsFromNow: 4 },
    endAge: 95,
    years: 41,
    risk: 'adventurous',
    spend: { perMonth: 2000, from: 'typed', level: null, budgetSkipped: true },
    people: [{
      who: 'you', ageToday: 50, ageAtStop: 54, pensionOpensAge: 57,
      pension: { today: 200000, atStop: { careful: 220000, middling: 280000 } },
      savings: { today: 80000, atStop: { careful: 82000, middling: 90000 } },
      payIn: { kind: 'split', total: 600, own: 400, employer: 200, savingsIn: 0 },
      alreadyDrawing: false,
      statePension: { yearly: SP_FULL, fromAge: 68, fromDate: '2044-10-01' },
      finalSalary: null,
      taxFreeQuarter: true,
      partTime: null,
      takeHome: [{ fromAge: 54, perMonth: 2000 }]
    }],
    answer: { monthly: null, lasted: 0.74, runOutAge: 88, verdict: 'close', potAtStop: { careful: 302000, middling: 370000 }, number: null, payInNeeded: null }
  });
}

export function seedZeroPot() {
  return base({
    source: 'b',
    name: { suggested: 'Stop at 60 · £900 a month · paying £400', chosen: 'Stop at 60 · £900 a month · paying £400' },
    household: 'single',
    stop: { kind: 'later', yearsFromNow: 20 },
    endAge: 95,
    years: 35,
    risk: 'balanced',
    spend: { perMonth: 900, from: 'typed', level: null, budgetSkipped: true },
    people: [{
      who: 'you', ageToday: 40, ageAtStop: 60, pensionOpensAge: 57,
      pension: { today: 0, atStop: { careful: 45000, middling: 60000 } },
      savings: { today: 0, atStop: { careful: 0, middling: 0 } },
      payIn: { kind: 'total', total: 400, savingsIn: 0 },
      alreadyDrawing: false,
      statePension: { yearly: SP_FULL, fromAge: 68, fromDate: '2054-10-01' },
      finalSalary: null,
      taxFreeQuarter: true,
      partTime: null,
      takeHome: [{ fromAge: 60, perMonth: 900 }]
    }],
    answer: { monthly: null, lasted: 0.9, runOutAge: 95, verdict: 'yes', potAtStop: null, number: 60000, payInNeeded: 400 }
  });
}

export function seedCoupleZeroLater() {
  return base({
    source: 'c',
    name: { suggested: 'From 60 and 58 · £2,500 a month', chosen: 'From 60 and 58 · £2,500 a month' },
    household: 'couple',
    stop: { kind: 'now', yearsFromNow: 0 },
    endAge: 95,
    years: 37,
    risk: 'balanced',
    spend: { perMonth: 2500, from: 'careful', level: null, budgetSkipped: null },
    people: [
      {
        who: 'you', ageToday: 60, ageAtStop: 60, pensionOpensAge: 55,
        pension: { today: 300000, atStop: { careful: 300000, middling: 300000 } },
        savings: { today: 10000, atStop: { careful: 10000, middling: 10000 } },
        payIn: null, alreadyDrawing: true,
        statePension: { yearly: SP_FULL, fromAge: 67, fromDate: '2033-10-01' },
        finalSalary: { yearly: 45000, fromAge: 62, increases: 'prices' },
        taxFreeQuarter: false,
        partTime: null,
        takeHome: [{ fromAge: 60, perMonth: 1600 }, { fromAge: 62, perMonth: 3080 }, { fromAge: 67, perMonth: 3920 }]
      },
      {
        who: 'partner', ageToday: 58, ageAtStop: 58, pensionOpensAge: 55,
        pension: { today: 100000, atStop: { careful: 100000, middling: 100000 } },
        savings: { today: 10000, atStop: { careful: 10000, middling: 10000 } },
        payIn: null, alreadyDrawing: true,
        statePension: null,
        finalSalary: null,
        taxFreeQuarter: true,
        partTime: null,
        takeHome: [{ fromAge: 58, perMonth: 900 }, { fromAge: 60, perMonth: 0 }]
      }
    ],
    answer: { monthly: { careful: 2500, middling: 2900, good: 3400 }, lasted: 0.9, runOutAge: 95, verdict: null, potAtStop: null, number: null, payInNeeded: null }
  });
}

export function seedPartTime() {
  const s = seedA();
  s.name = { suggested: 'Stop at 60 · £1,800 a month', chosen: 'Stop at 60 with some work' };
  s.people[0].partTime = { yearly: 15000, years: 3 };
  return s;
}

/** Every fixture, by name. */
export const ALL_SEEDS = { seedA, seedCNow, seedBCouple, seedEarly, seedZeroPot, seedCoupleZeroLater, seedPartTime };

/** A Storage-like object over a Map (what localStorage offers the module). */
export function memoryStorage(initial = {}) {
  const m = new Map(Object.entries(initial));
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => { m.set(k, String(v)); },
    removeItem: (k) => { m.delete(k); },
    has: (k) => m.has(k),
    get size() { return m.size; }
  };
}
