/**
 * Answers of A, B and C for a couple who stop work in different years (research/v7/couples-different-years.md), written
 * by hand to the result contract (src/answers/shared/contract.js: ApartAnswer, Phase.fromPay, PersonPhase.working,
 * askedAbout, SavingOutcome per person) — so the saved-plan side (package P4) can be tested on its own. Every figure is
 * made up; none is anyone's.
 *
 * Each is self-consistent the way an answer's figures are: in every stretch of years the household's take-home is the
 * sum of the people's plus `fromPay`; a person still working has `working: true` and every figure of theirs 0; each
 * person's stop agrees with the household the answer's own mapping (toHousehold, P0) makes from the same inputs.
 *
 *   aPartnerAlready()  A: you work and stop next year at 56; your partner (58) has stopped and draws now. Half.
 *   aYouAlready()      A: the same couple the other way round — you have stopped, the answer is about your partner.
 *   bYouAlready()      B: you have stopped (60); your partner (52) saves, split pay-in, until 60. None of it.
 *   bBothLater()       B: both still working, you stop at 60, your partner at 62. All of it.
 *   cYouNow()          C: you take money from now (62); your partner (60) stops at 63, paying in until then. Half.
 *
 * `today` is the named states' (2026-09-30).
 */
export const TODAY = '2026-09-30';

const SP = { kind: 'full' };
const NO_FS = { has: false };
const basisOf = (over) => ({
  today: TODAY, futures: 1000, seed: 0, failuresAllowed: 100, closeAllowed: 250, historyEnd: '2023-06', engineVersion: '6.19.0',
  endAge: 95, bondDraws: 'life', cashRule: 'previous-year', grid: 'yearly', strategyId: 'pots-and-valves', cutsSwitchedOff: true, ...over
});
const three = (careful, middling, good) => ({ careful, middling, good });
const zero = () => three(0, 0, 0);

/** A person's figures in one stretch of years. `working`: still working — every figure 0. */
function by(who, takeHome, more = {}) {
  return {
    who, statePension: 0, finalSalary: 0, work: 0, fromWork: 0, fromPension: takeHome, fromSavings: 0, tax: 0, takeHome,
    higherRate: false, locked: false, pensionOpen: true, ...more
  };
}
const working = (who) => ({ ...by(who, 0), working: true });

/**
 * One stretch: `ages` per person, the people's figures, and — while one of them works — what the worker's pay covers.
 * The household's take-home is the people's plus that.
 */
function phase(whose, ages, people, fromPay = undefined) {
  const own = people.reduce((t, p) => t + p.takeHome, 0);
  const takeHome = Math.round((own + (fromPay || 0)) * 100) / 100;
  const out = {
    fromAge: ages[whose].from, toAge: ages[whose].to, ages, takeHome,
    fromPension: own, fromSavings: 0, fromPots: own, statePension: 0, finalSalary: 0, tax: 0, work: 0, fromWork: 0,
    byPerson: people, beforeStatePension: true, pensionOpen: true,
    shown: { takeHome: Math.round(takeHome), fromPots: Math.round(own), statePension: 0, finalSalary: 0, fromWork: 0 }
  };
  if (fromPay !== undefined) { out.fromPay = fromPay; out.shown.fromPay = Math.round(fromPay); }
  return out;
}
const span = (from, to) => ({ from, to });

/** One person's saving outcome: `yearsSaving` 0 for someone who has stopped (their pots at the stop are today's). */
function saving(who, stopAge, yearsSaving, today, payIn, atStop) {
  return {
    who, stopAge, yearsSaving, potToday: today, payIn,
    potAtStop: { pension: atStop.pension, savings: atStop.savings, total: three(
      atStop.pension.careful + atStop.savings.careful, atStop.pension.middling + atStop.savings.middling, atStop.pension.good + atStop.savings.good) },
    paidIn: { total: payIn.total * 12 * yearsSaving }, mix: { saving: 'balanced', drawing: 'balanced', slideYears: 0 }, chargeAYear: 0.005
  };
}
const flat = (n) => three(n, n, n);
const noPayIn = { total: 0, own: null, employer: null, savings: 0 };

export function aPartnerAlready() {
  const inputs = {
    household: 'couple',
    you: { pot: 420000, age: 55, statePension: SP, finalSalary: NO_FS, payIn: { kind: 'total', total: 600 }, alreadyDrawing: false },
    savings: 40000, stop: { kind: 'age', age: 56 }, spend: { kind: 'amount', amount: 3200 }, partTime: { has: false },
    partner: { age: 58, pot: 180000, statePension: SP, finalSalary: NO_FS, stop: { kind: 'already' }, taxFreeTaken: true },
    savingsIn: 0, savingRisk: 'balanced', risk: 'balanced', charge: 0.5, endAge: 95
  };
  const phases = [
    phase('you', { you: span(55, 56), partner: span(58, 59) }, [working('you'), by('partner', 1600)], 1600),
    phase('you', { you: span(56, 64), partner: span(59, 67) }, [by('you', 2300), by('partner', 900)]),
    phase('you', { you: span(64, 67), partner: span(67, 70) }, [by('you', 2000), by('partner', 1200, { statePension: 1045.63 })]),
    phase('you', { you: span(67, 95), partner: span(70, 98) }, [by('you', 1700, { statePension: 1045.63 }), by('partner', 1500, { statePension: 1045.63 })])
  ];
  return {
    status: 'ok', inputs, whose: 'you',
    spend: { perMonth: 3200, perYear: 38400, kind: 'amount', level: null },
    stop: { kind: 'age', age: 56 },
    shown: {
      age: 56, ages: { you: 56, partner: 58 }, stopYear: '2027', status: 'final', verdict: 'yes', lasted: 0.913,
      outOfTen: { words: 'in 9 futures out of 10', only: false, count: 9 }, runOutAge: 95,
      monthly: three(3350, 3800, 4400), yearly: three(40200, 45600, 52800),
      potAtStop: { careful: 589000, middling: 661948, good: 712086, byPerson: [{ who: 'you', pension: 441948, savings: 0 }, { who: 'partner', pension: 180000, savings: 40000 }] },
      phases
    },
    pensionOpens: { you: 55, partner: 55 },
    saving: [
      saving('you', 56, 1, { pension: 420000, savings: 0 }, { total: 600, own: null, employer: null, savings: 0 },
        { pension: three(389555, 441948, 492086), savings: zero() }),
      saving('partner', 58, 0, { pension: 180000, savings: 40000 }, noPayIn, { pension: flat(180000), savings: flat(40000) })
    ],
    apart: { first: 'partner', years: 1, stops: { you: { age: 56, already: false }, partner: { age: 58, already: true } }, payCovers: 0.5, coversGap: true, coverUsed: null },
    assumed: [], warnings: [], sentences: {},
    basis: basisOf({ detail: 'chart', lifeYears: 40, split: [{ who: 'you', share: 0.7 }, { who: 'partner', share: 0.3 }] })
  };
}

/** aPartnerAlready the other way round: the one at the keyboard is the one who has stopped. */
export function aYouAlready() {
  const inputs = {
    household: 'couple',
    you: { pot: 180000, age: 58, statePension: SP, finalSalary: NO_FS, taxFreeTaken: true },
    savings: 40000, stop: { kind: 'already' }, spend: { kind: 'amount', amount: 3200 },
    partner: { age: 55, pot: 420000, statePension: SP, finalSalary: NO_FS, payIn: { kind: 'total', total: 600 }, alreadyDrawing: false, stop: { kind: 'age', age: 56 } },
    untilBothStop: 'half', savingsIn: 0, savingRisk: 'balanced', risk: 'balanced', charge: 0.5, endAge: 95
  };
  const phases = [
    phase('partner', { you: span(58, 59), partner: span(55, 56) }, [by('you', 1600), working('partner')], 1600),
    phase('partner', { you: span(59, 67), partner: span(56, 64) }, [by('you', 900), by('partner', 2300)]),
    phase('partner', { you: span(67, 70), partner: span(64, 67) }, [by('you', 1200, { statePension: 1045.63 }), by('partner', 2000)]),
    phase('partner', { you: span(70, 98), partner: span(67, 95) }, [by('you', 1500, { statePension: 1045.63 }), by('partner', 1700, { statePension: 1045.63 })])
  ];
  return {
    status: 'ok', inputs, whose: 'partner', askedAbout: 'partner',
    spend: { perMonth: 3200, perYear: 38400, kind: 'amount', level: null },
    stop: { kind: 'age', age: 56 },
    shown: {
      age: 56, ages: { you: 58, partner: 56 }, stopYear: '2027', status: 'final', verdict: 'yes', lasted: 0.913,
      outOfTen: { words: 'in 9 futures out of 10', only: false, count: 9 }, runOutAge: 95,
      monthly: three(3350, 3800, 4400), yearly: three(40200, 45600, 52800),
      potAtStop: { careful: 589000, middling: 661948, good: 712086, byPerson: [{ who: 'you', pension: 180000, savings: 40000 }, { who: 'partner', pension: 441948, savings: 0 }] },
      phases
    },
    pensionOpens: { you: 55, partner: 55 },
    saving: [
      saving('you', 58, 0, { pension: 180000, savings: 40000 }, noPayIn, { pension: flat(180000), savings: flat(40000) }),
      saving('partner', 56, 1, { pension: 420000, savings: 0 }, { total: 600, own: null, employer: null, savings: 0 },
        { pension: three(389555, 441948, 492086), savings: zero() })
    ],
    apart: { first: 'you', years: 1, stops: { you: { age: 58, already: true }, partner: { age: 56, already: false } }, payCovers: 0.5, coversGap: true, coverUsed: null },
    assumed: [], warnings: [], sentences: {},
    basis: basisOf({ detail: 'chart', lifeYears: 40, split: [{ who: 'you', share: 0.3 }, { who: 'partner', share: 0.7 }] })
  };
}

export function bYouAlready() {
  const inputs = {
    household: 'couple',
    you: { pot: 300000, age: 60, statePension: SP, finalSalary: NO_FS },
    stop: { kind: 'already' }, spend: { kind: 'amount', amount: 3000 },
    partner: { age: 52, pot: 150000, statePension: SP, finalSalary: NO_FS, payIn: { kind: 'split', own: 400, employer: 300 }, alreadyDrawing: false, stop: { kind: 'age', age: 60 } },
    untilBothStop: 'none', savings: 20000, savingsIn: 200, savingRisk: 'balanced', risk: 'cautious', charge: 0.75, endAge: 95, confidence: 'nineInTen'
  };
  const phases = [
    phase('partner', { you: span(60, 68), partner: span(52, 60) }, [by('you', 3000, { statePension: 1045.63 }), working('partner')], 0),
    phase('partner', { you: span(68, 75), partner: span(60, 67) }, [by('you', 1800, { statePension: 1045.63 }), by('partner', 1200)]),
    phase('partner', { you: span(75, 103), partner: span(67, 95) }, [by('you', 1500, { statePension: 1045.63 }), by('partner', 1500, { statePension: 1045.63 })])
  ];
  return {
    status: 'ok', inputs, whose: 'partner', askedAbout: 'partner',
    spend: { perMonth: 3000, perYear: 36000, kind: 'amount', level: null },
    stop: { age: 60, year: '2034' }, ages: { you: 60, partner: 60 }, years: 8,
    pensionOpens: { you: 55, partner: 57 },
    saving: [
      saving('you', 60, 0, { pension: 300000, savings: 20000 }, noPayIn, { pension: flat(300000), savings: flat(20000) }),
      saving('partner', 60, 8, { pension: 150000, savings: 0 }, { total: 700, own: 400, employer: 300, savings: 200 },
        { pension: three(210000, 260000, 330000), savings: three(17000, 21000, 26000) })
    ],
    number: { careful: 280000, middling: 200000, good: 150000, byPerson: [{ who: 'partner', pot: 280000 }] },
    chance: { lasted: 0.88, outOfTen: { words: 'in 9 futures out of 10', only: false, count: 9 }, fails: 120 },
    payIn: { now: 700, own: 400, employer: 300, needed: 900, extra: 200, confidence: 'nineInTen', at: { nineInTen: 900, threeInFour: 640 }, outside: null, savingsNow: 200 },
    potAtStop: { now: three(227000, 281000, 356000), needed: three(280000, 200000, 150000) },
    wholeLife: { lasted: 0.88, outOfTen: { words: 'in 9 futures out of 10', only: false, count: 9 }, runOutAge: 93 },
    phases,
    apart: { first: 'you', years: 8, stops: { you: { age: 60, already: true }, partner: { age: 60, already: false } }, payCovers: 0, coversGap: false, coverUsed: null },
    assumed: [], warnings: [], sentences: {},
    basis: basisOf({ detail: 'answer', lifeYears: 43, split: [{ who: 'you', share: 0.6 }, { who: 'partner', share: 0.4 }] })
  };
}

export function bBothLater() {
  const inputs = {
    household: 'couple',
    you: { pot: 250000, age: 50, statePension: SP, finalSalary: NO_FS, payIn: { kind: 'total', total: 700 }, alreadyDrawing: false },
    stop: { age: 60 }, spend: { kind: 'amount', amount: 3200 },
    partner: { age: 48, pot: 150000, statePension: SP, finalSalary: NO_FS, payIn: { kind: 'total', total: 300 }, alreadyDrawing: false, stop: { kind: 'age', age: 62 } },
    untilBothStop: 'all', savings: 10000, savingsIn: 0, savingRisk: 'balanced', risk: 'balanced', charge: 0.5, endAge: 95, confidence: 'nineInTen'
  };
  const phases = [
    phase('partner', { you: span(60, 64), partner: span(58, 62) }, [by('you', 0), working('partner')], 3200),
    phase('partner', { you: span(64, 69), partner: span(62, 67) }, [by('you', 2000), by('partner', 1200)]),
    phase('partner', { you: span(69, 97), partner: span(67, 95) }, [by('you', 1700, { statePension: 1045.63 }), by('partner', 1500, { statePension: 1045.63 })])
  ];
  return {
    status: 'ok', inputs, whose: 'partner',
    spend: { perMonth: 3200, perYear: 38400, kind: 'amount', level: null },
    stop: { age: 60, year: '2036' }, ages: { you: 60, partner: 62 }, years: 10,
    pensionOpens: { you: 57, partner: 57 },
    saving: [
      saving('you', 60, 10, { pension: 250000, savings: 10000 }, { total: 700, own: null, employer: null, savings: 0 },
        { pension: three(306878, 431741, 596792), savings: three(9000, 12000, 15000) }),
      saving('partner', 62, 14, { pension: 150000, savings: 0 }, { total: 300, own: null, employer: null, savings: 0 },
        { pension: three(190000, 280000, 390000), savings: zero() })
    ],
    number: { careful: 750000, middling: 537000, good: 412000, byPerson: [{ who: 'you', pot: 480082 }, { who: 'partner', pot: 269918 }] },
    chance: { lasted: 0.91, outOfTen: { words: 'in 9 futures out of 10', only: false, count: 9 }, fails: 90 },
    payIn: { now: 1000, own: null, employer: null, needed: 1100, extra: 100, confidence: 'nineInTen', at: { nineInTen: 1100, threeInFour: 800 }, outside: null, savingsNow: 0 },
    potAtStop: { now: three(497000, 711000, 986000), needed: three(750000, 537000, 412000) },
    wholeLife: { lasted: 0.91, outOfTen: { words: 'in 9 futures out of 10', only: false, count: 9 }, runOutAge: 95 },
    phases,
    apart: { first: 'you', years: 4, stops: { you: { age: 60, already: false }, partner: { age: 62, already: false } }, payCovers: 1, coversGap: true, coverUsed: null },
    assumed: [], warnings: [], sentences: {},
    basis: basisOf({ detail: 'answer', lifeYears: 47, split: [{ who: 'you', share: 0.64 }, { who: 'partner', share: 0.36 }] })
  };
}

export function cYouNow() {
  const inputs = {
    household: 'couple',
    you: { pot: 400000, age: 62, statePension: SP, finalSalary: { has: true, yearly: 9000, fromAge: 65 } },
    start: { kind: 'now' },
    partner: { age: 60, pot: 150000, statePension: SP, finalSalary: NO_FS, stop: { kind: 'age', age: 63 }, payIn: { has: 'yes', kind: 'total', total: 300 } },
    untilBothStop: 'half', savings: 30000, risk: 'balanced', charge: 0.5, endAge: 95, take: null
  };
  const phases = [
    phase('partner', { you: span(62, 65), partner: span(60, 63) }, [by('you', 1750), working('partner')], 1750),
    phase('partner', { you: span(65, 67), partner: span(63, 65) }, [by('you', 2500, { finalSalary: 750 }), by('partner', 1000)]),
    phase('partner', { you: span(67, 69), partner: span(65, 67) }, [by('you', 2700, { finalSalary: 750, statePension: 1045.63 }), by('partner', 800)]),
    phase('partner', { you: span(69, 97), partner: span(67, 95) }, [by('you', 2200, { finalSalary: 750, statePension: 1045.63 }), by('partner', 1300, { statePension: 1045.63 })])
  ];
  return {
    status: 'ok', inputs,
    monthly: three(3500, 3950, 4480), yearly: three(42000, 47400, 53760),
    lasted: three(0.906, 0.5, 0.101), runOutAge: three(95, 79, 73), whose: 'partner',
    potAtStart: { careful: 570000, middling: 609000, good: 650000, byPerson: [{ who: 'you', pension: 400000, savings: 30000 }, { who: 'partner', pension: 179000, savings: 0 }] },
    payIn: { total: 300, byPerson: [{ who: 'partner', total: 300 }] },
    saving: [
      saving('you', 62, 0, { pension: 400000, savings: 30000 }, noPayIn, { pension: flat(400000), savings: flat(30000) }),
      saving('partner', 63, 3, { pension: 150000, savings: 0 }, { total: 300, own: null, employer: null, savings: 0 },
        { pension: three(158000, 179000, 201000), savings: zero() })
    ],
    phases,
    apart: { first: 'you', years: 3, stops: { you: { age: 62, already: true }, partner: { age: 63, already: false } }, payCovers: 0.5, coversGap: true, coverUsed: { who: 'you', fromAge: 64 } },
    assumed: [], warnings: [], sentences: {},
    basis: basisOf({ startAge: 60, accessAge: 55, start: '2026-09', years: 35, split: [{ who: 'you', share: 0.73 }, { who: 'partner', share: 0.27 }] })
  };
}

/** Every one, by name, with its question. */
export const APART_ANSWERS = { aPartnerAlready: ['a', aPartnerAlready], aYouAlready: ['a', aYouAlready], bYouAlready: ['b', bYouAlready], bBothLater: ['b', bBothLater], cYouNow: ['c', cYouNow] };
