/**
 * The checks every typed box in the full view's settings runs (7.12.0, lead decision 13), and their words. Pure.
 *
 * An age is from 18 to 110. An amount is never below £0, and one over £50 million is asked about ("is that right?") before
 * it is used. A State Pension start date that cannot be read says so beside its own box, with the format to type; one
 * before 2016 is a date of birth (StatePensionUtils.validateStatePensionDate's own words); one in the past is said, and used.
 *
 *   ageProblem(raw, { badInput })                         null | { id: 'age'|'notANumber', words, blocks: true }
 *   moneyProblem(raw, { badInput, confirmed })            null | { id: 'negative'|'notANumber', words, blocks: true }
 *                                                         | { id: 'big', words, ask: true, blocks: true } (until confirmed)
 *   spDateProblem(raw, { now })                           null | { id: 'date'|'birth', words, blocks: true }
 *                                                         | { id: 'past', words, blocks: false }
 *   problemsLine(problems)                                the one line by the heading: what is wrong and where, or ''
 */
import { validateStatePensionDate } from '../utils/StatePensionUtils.js';

export const AGE_MIN = 18;
export const AGE_MAX = 110;
export const MONEY_ASK_OVER = 50000000;

export const FIELD_WORDS = Object.freeze({
  age: 'Type an age from 18 to 110.',
  negative: 'Type an amount of £0 or more.',
  notANumber: 'Type a number, like 250000.',
  big: 'Over £50 million: is that right?',
  bigYes: 'Yes, that is right',
  date: 'We could not read “{typed}” as a date. Type the day, the month and the year, like “6 August 2040”.',
  past: 'This date has passed: the plan counts your State Pension as paid already.',
  notSaved: 'Not saved yet.',
  saving: 'Saving…',
  saved: 'Saved',
  line: 'Not saved yet: “{box}” needs a change (said beside it).',
  lineMany: 'Not saved yet: {n} boxes need a change (said beside each).',
  fault: 'Not saved yet: {why}'
});

const blank = (raw) => raw == null || String(raw).trim() === '';

/** An age box: empty is no problem (the box is optional until it is used); otherwise a whole age from 18 to 110. */
export function ageProblem(raw, { badInput = false } = {}) {
  if (badInput) return { id: 'notANumber', words: FIELD_WORDS.notANumber, blocks: true };
  if (blank(raw)) return null;
  const n = Number(String(raw).trim());
  if (!Number.isFinite(n)) return { id: 'notANumber', words: FIELD_WORDS.notANumber, blocks: true };
  if (n < AGE_MIN || n > AGE_MAX) return { id: 'age', words: FIELD_WORDS.age, blocks: true };
  return null;
}

/** An amount box: never below £0; over £50 million it is asked about until `confirmed`. */
export function moneyProblem(raw, { badInput = false, confirmed = false } = {}) {
  if (badInput) return { id: 'notANumber', words: FIELD_WORDS.notANumber, blocks: true };
  if (blank(raw)) return null;
  const n = Number(String(raw).replace(/[£,\s]/g, ''));
  if (!Number.isFinite(n)) return { id: 'notANumber', words: FIELD_WORDS.notANumber, blocks: true };
  if (n < 0) return { id: 'negative', words: FIELD_WORDS.negative, blocks: true };
  if (n > MONEY_ASK_OVER && !confirmed) return { id: 'big', words: FIELD_WORDS.big, ask: true, blocks: true };
  return null;
}

/** The State Pension start date box. */
export function spDateProblem(raw, { now = new Date() } = {}) {
  if (blank(raw)) return null;
  const typed = String(raw).trim();
  const v = validateStatePensionDate(typed, { now });
  if (!v.valid && !v.date) return { id: 'date', words: FIELD_WORDS.date.replace('{typed}', typed), blocks: true };
  if (!v.valid) return { id: 'birth', words: v.error, blocks: true };
  if (v.warning) return { id: 'past', words: FIELD_WORDS.past, blocks: false };
  return null;
}

/** The line by the heading while anything blocks a save: the box by its name, or how many. `problems`: [{ box, blocks }]. */
export function problemsLine(problems) {
  const blocking = (problems || []).filter((p) => p && p.blocks);
  if (!blocking.length) return '';
  if (blocking.length === 1) return FIELD_WORDS.line.replace('{box}', blocking[0].box || 'a box');
  return FIELD_WORDS.lineMany.replace('{n}', String(blocking.length));
}
