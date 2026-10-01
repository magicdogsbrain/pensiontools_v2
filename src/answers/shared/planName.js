/**
 * The name of a plan made from an answer (research/v7/save-as-plan.md, "The suggested name" and Contract C.4).
 * Pure; imports only format.js. Both V7's name box and today's app's confirm step use it.
 *
 *   PLAN_NAME                                  the limits: a suggestion at most 50 characters, a typed name at most 60
 *   suggestedPlanName(source, inputs, result)  the name the box is filled with — never "My plan"; '' unless status 'ok'
 *   cleanName(text)                            NFC, control characters and line breaks removed, runs of spaces one, trimmed
 *   checkPlanName(text)                        → { ok: true, name } | { ok: false, problem: 'empty' | 'tooLong' }
 *   withDuplicateSuffix(name, takenNames)      the name, or the name with " (2)", " (3)" … — the lowest number free
 *
 * The suggestion is built from the answer, in today's prices, money to the nearest £10, ages in whole years:
 *   C, money from now                          From {you.age} · £{careful} a month
 *   C, starting later with money still going in  Stop at {your age at the start} · £{careful} a month
 *   C, starting later with nothing going in    From {your age at the start} · £{careful} a month
 *   A                                          Stop at {shown age} · £{spend} a month   ("From {age}" in the retired view)
 *   B                                          Stop at {age} · £{spend} a month · paying £{pay-in now}  (the last part
 *                                              left out when nothing goes in, or when the name would pass 50 characters)
 *   A couple                                   "Stop at {you} and {partner}" / "From {you} and {partner}", the partner's
 *                                              age on the same date
 * A and B name the spending the person tried (a name describes the try, not a promise); C names the careful figure.
 */
import { money } from './format.js';

export const PLAN_NAME = Object.freeze({ suggestMax: 50, typedMax: 60, sep: ' · ' });

const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
/** Money to the nearest £10, written by format.js: 1847 → '£1,850'. */
const tenner = (n) => money(Math.round(Number(n) / 10) * 10);
const whole = (n) => String(Math.floor(Number(n)));
const chars = (s) => [...s].length;

/** "60", or "60 and 58" for a couple (your age first). */
function agesText(youAge, partnerAge) {
  return isNum(partnerAge) ? `${whole(youAge)} and ${whole(partnerAge)}` : whole(youAge);
}

/** Whether a couple's partner is part of these inputs. */
const coupleOf = (inputs) => !!(inputs && inputs.household === 'couple' && inputs.partner && isNum(inputs.partner.age));

function suggestC(inputs, result) {
  const basis = result.basis || {};
  const whose = result.whose === 'partner' ? 'partner' : 'you';
  const whoseAge = inputs[whose] && inputs[whose].age;
  if (!isNum(basis.startAge) || !isNum(whoseAge) || !result.monthly || !isNum(result.monthly.careful)) return '';
  const wait = basis.startAge - whoseAge;
  const couple = coupleOf(inputs);
  const ages = agesText(inputs.you.age + wait, couple ? inputs.partner.age + wait : null);
  const payingIn = wait > 0 && !!result.payIn && isNum(result.payIn.total) && result.payIn.total > 0;
  const lead = payingIn ? 'Stop at' : 'From';
  return `${lead} ${ages}${PLAN_NAME.sep}${tenner(result.monthly.careful)} a month`;
}

/** A's retired view: stopping at today's age with the State Pension already paid from the start. */
function retiredA(inputs, shown) {
  const first = Array.isArray(shown.phases) && shown.phases[0];
  const you = first && Array.isArray(first.byPerson) ? first.byPerson.find((p) => p.who === 'you') : null;
  return shown.age === inputs.you.age && !!you && isNum(you.statePension) && you.statePension > 0;
}

function suggestA(inputs, result) {
  const shown = result.shown;
  if (!shown || !isNum(shown.age) || !result.spend || !isNum(result.spend.perMonth)) return '';
  const couple = coupleOf(inputs);
  const shownAges = shown.ages || {};
  const lead = retiredA(inputs, shown) ? 'From' : 'Stop at';
  const youAge = isNum(shownAges.you) ? shownAges.you : shown.age;
  const ages = agesText(youAge, couple ? (isNum(shownAges.partner) ? shownAges.partner : inputs.partner.age + (youAge - inputs.you.age)) : null);
  return `${lead} ${ages}${PLAN_NAME.sep}${tenner(result.spend.perMonth)} a month`;
}

function suggestB(inputs, result) {
  const stop = result.stop;
  if (!stop || !isNum(stop.age) || !result.spend || !isNum(result.spend.perMonth)) return '';
  const couple = coupleOf(inputs);
  const ages = result.ages || {};
  const youAge = isNum(ages.you) ? ages.you : stop.age;
  const partnerAge = couple ? (isNum(ages.partner) ? ages.partner : inputs.partner.age + (youAge - inputs.you.age)) : null;
  const base = `Stop at ${agesText(youAge, partnerAge)}${PLAN_NAME.sep}${tenner(result.spend.perMonth)} a month`;
  const now = result.payIn && isNum(result.payIn.now) ? result.payIn.now : 0;
  if (!(now > 0)) return base;
  const full = `${base}${PLAN_NAME.sep}paying ${tenner(now)}`;
  return chars(full) > PLAN_NAME.suggestMax ? base : full;
}

const SUGGEST = { c: suggestC, a: suggestA, b: suggestB };

/**
 * The name the box is filled with.
 * @param {'c'|'a'|'b'} source
 * @param {object} [inputs]   the checked inputs (result.inputs when left out)
 * @param {object} result     the answer
 * @returns {string}          '' when result.status is not 'ok' (nothing to save)
 */
export function suggestedPlanName(source, inputs, result) {
  if (!result || result.status !== 'ok' || !SUGGEST[source]) return '';
  const ins = inputs || result.inputs;
  if (!ins || !ins.you || !isNum(ins.you.age)) return '';
  return SUGGEST[source](ins, result);
}

/**
 * A name as it will be kept: Unicode NFC, control characters (line breaks included) removed, runs of spaces made
 * one, the ends trimmed.
 */
export function cleanName(text) {
  return String(text ?? '')
    .normalize('NFC')
    .replace(/[\p{Cc}\p{Zl}\p{Zp}]/gu, '')
    .replace(/\s+/gu, ' ')
    .trim();
}

/**
 * What a person typed, checked: empty, or longer than 60 characters (counted as characters, not bytes), is refused.
 * Any other name is theirs to choose — "My plan" included.
 */
export function checkPlanName(text) {
  const name = cleanName(text);
  if (name === '') return { ok: false, problem: 'empty' };
  if (chars(name) > PLAN_NAME.typedMax) return { ok: false, problem: 'tooLong' };
  return { ok: true, name };
}

/**
 * The name, made different from every name already taken (cleaned the same way, upper and lower case alike) by
 * adding " (2)", " (3)" … with the lowest number that is free. Names the app builds may pass 60 characters.
 */
export function withDuplicateSuffix(name, takenNames = []) {
  const key = (s) => cleanName(s).toLowerCase();
  const base = cleanName(name);
  const taken = new Set((Array.isArray(takenNames) ? takenNames : []).map(key));
  if (!taken.has(key(base))) return base;
  for (let n = 2; ; n++) {
    const candidate = `${base} (${n})`;
    if (!taken.has(key(candidate))) return candidate;
  }
}
