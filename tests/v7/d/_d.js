/**
 * The adapter for question D (research/v7/answer-D.md; road-to-7.md step 7) — the ONLY test file that knows real paths
 * for D. Every other test under tests/v7/d/ imports the answer, the input list and the screen from here.
 *
 * The households here are made up (Alex and Sam, round figures): nobody's own.
 */
import { SCHEMA_D } from '../../../src/answers/d/schema.js';

export { answerD } from '../../../src/answers/d/answer.js';
export { SCHEMA_D };
export const TEST_ENV = { today: '2026-09-30', futures: 40, seed: 0, trace: false };
export { get, renderScreen } from '../c/_c.js';
export { readForm } from '../a/_a.js';

/** The design's worked example (answer-D.md 1): 68, £300,000 in a pension, £40,000 of savings, the full State Pension being paid, £2,100 a month. */
export const D1 = { you: { age: 68, pot: 300000, taxFreeTaken: 'no' }, savings: 40000, spend: { kind: 'amount', amount: 2100 } };
/** A couple of 72 and 70 (Alex and Sam), both stopped, one final-salary pension, the tax-free part had (answer-D.md 11.4 D2). */
export const D2 = { household: 'couple', you: { age: 72, pot: 250000, taxFreeTaken: 'yes', finalSalary: { has: true, yearly: 8000, fromAge: 65 } }, partner: { age: 70, pot: 150000, taxFreeTaken: 'yes' }, savings: 30000, spend: { kind: 'amount', amount: 2800 } };
/** 62, stopped, under State Pension age, an invested ISA larger than the pension (D3). */
export const D3 = { you: { age: 62, pot: 120000, taxFreeTaken: 'no' }, savings: 200000, isaGrowth: 'invested', spend: { kind: 'amount', amount: 2000 } };
/** 53, stopped, the pension closed until 57, savings paying meanwhile (D5). */
export const D5 = { you: { age: 53, pot: 250000, taxFreeTaken: 'no' }, savings: 60000, spend: { kind: 'amount', amount: 1800 } };
/** 66, thinking about work: £15,000 a year for 3 years (D7). */
export const D7 = { you: { age: 66, pot: 220000, taxFreeTaken: 'some' }, savings: 10000, spend: { kind: 'amount', amount: 2200 }, work: { has: true, yearly: 15000, years: 3 } };
/** 88, near the end age: the default end age moves to 93 (D9). */
export const D9 = { you: { age: 88, pot: 90000, taxFreeTaken: 'yes' }, spend: { kind: 'amount', amount: 1500 } };
