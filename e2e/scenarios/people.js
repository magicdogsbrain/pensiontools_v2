/**
 * The fictional people of the scenarios (brief 3.2) and their figures. Made up from scratch: no real plan, no real
 * person. Each scenario takes one of them by name; its expected figures are worked from these by hand (hand/).
 */
export const JO33 = Object.freeze({
  name: 'Jo', age: 33, pay: 38000, pot: 22000, ownPct: 5, employerPct: 3, wantMonthly: 2000, stopAge: 60
});

export const SAM45 = Object.freeze({
  name: 'Sam', age: 45, pay: 52000, payLater: 55000,
  pot: 120000, potOn: '2025-11-12', potLater: 131000, potLaterOn: '2026-11-16',
  fromTakeHome: 300, employer: 250, wantMonthly: 2400, stopAge: 65
});

export const PAT52 = Object.freeze({ name: 'Pat', age: 52, pay: 31000, pot: 45000, ownPct: 4, employerPct: 3 });

export const ALEX57 = Object.freeze({ name: 'Alex', age: 57, pot: 410000, isa: 40000, stopAge: 60 });

export const SAM59 = Object.freeze({
  name: 'Sam', age: 59, stopMonth: '2027-10', stopAge: 60,
  ladder: { yearly: 26000, laterYearly: 22000, laterFrom: 75 },
  holds: [
    { what: 'a share fund', value: 300000 },
    { what: 'a bond fund', value: 90000 },
    { what: 'T29', units: 17300, planUnits: 44000 },
    { what: 'TR31', units: 14700, planUnits: 18100 },
    { what: 'TG28', value: 20000, ordinary: true },
    { what: 'cash', value: 25000, planCash: 52392 }
  ]
});

export const KIM62 = Object.freeze({
  name: 'Kim', age: 62, stoppedMonth: '2026-10', payThisTaxYear: 21000, pot: 520000, isa: 60000,
  statePensionAge: 67, wantMonthlyAfterTax: 2400, quarterTaxFree: true
});

export const ALEX64 = Object.freeze({
  name: 'Alex', age: 64, lockedOn: '2026-04-10', yearly: 30000, taxFreeTaken: true,
  cashYears: ['2026/27', '2027/28', '2028/29'], ordinaryGiltsToday: 86000, cash: 500, today: '2026-06-20', recorded: ['2026-04', '2026-05']
});

export const KIM66 = Object.freeze({ name: 'Kim', age: 66, pot: 280000, isa: 40000, finalSalary: 6000, survivorShare: 0.5, statePensionWeekly: 221.20 });
export const SAM61 = Object.freeze({ name: 'Sam', age: 61, pay: 38000, pot: 150000, fromTakeHome: 300, employer: 200, stopAge: 63, stopAgeLater: 62 });

export const JO58 = Object.freeze({ name: 'Jo', age: 58, pot: 250000, isa: 20000, first: 1800, second: 1400 });

/** The checker: three saved plans from the corpus (tests/fixtures/plans/), one account each, written into the store. */
export const CHECKER = Object.freeze({
  name: 'The checker',
  plans: [
    { key: 'saver', file: '05-saver-committed.json' },
    { key: 'pots', file: '04-buckets-running.json' },
    { key: 'ladder', file: '03-gilt-ladder-locked.json' }
  ]
});
