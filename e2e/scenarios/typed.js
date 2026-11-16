/**
 * What the people type, as they type it: the boxes of each question for each person of people.js. Shared by the
 * scenarios that start from the same answer (s01 and s02 are both Jo's).
 */
import { JO33, SAM45 } from './people.js';

/** Jo, 33, on "Am I saving enough?": a share of pay, stop at 60, £2,000 a month. */
export const JO_B = Object.freeze({
  numbers: {
    'you.age': JO33.age, 'you.pot': JO33.pot, 'you.payIn.kind': 'share', 'you.payIn.pay': JO33.pay,
    'you.payIn.ownPct': JO33.ownPct, 'you.payIn.employerPct': JO33.employerPct, 'stop.age': JO33.stopAge
  },
  spend: { 'spend.amount': JO33.wantMonthly }
});

/** Sam, 45, on "Am I saving enough?": the pay-in as two amounts, £300 from take-home pay and £250 from the employer. */
export const SAM_B = Object.freeze({
  numbers: {
    'you.age': SAM45.age, 'you.pot': SAM45.pot, 'you.payIn.kind': 'split', 'you.payIn.own': SAM45.fromTakeHome,
    'you.payIn.employer': SAM45.employer, 'stop.age': SAM45.stopAge
  },
  spend: { 'spend.amount': SAM45.wantMonthly }
});
