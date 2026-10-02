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
 *
 * A couple who stop work in different years (research/v7/couples-different-years.md 2.4, "Plan name suggested"):
 *   both still working                         "Stop at 60 and 62" (C: "From …" with nothing going in) — each their own stop
 *   your partner has stopped                   "Stop at 60" (C: "From 60" with nothing going in) — your stop alone
 *   you have stopped (A, B: "I've already stopped"; C: from now)   "Partner stops at 56" — the answer is your partner's
 * Each person's own stop is read from the answer: A's shown row (`shown.ages`), B's `ages` and the age in mind
 * (`stop.age`, the asked person's), C's start and the partner's own stop in its inputs. When both stop in the same year
 * every suggestion is the one above, word for word (tests/v7/keep/planName.test.js holds it to the frozen 6.19.0 copy).
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

/** "I've already stopped" (A and B, a couple only). */
const youStopped = (inputs) => coupleOf(inputs) && !!inputs.stop && inputs.stop.kind === 'already';
/** The partner's own stop: "They already have" (A, B and C). */
const partnerStopped = (inputs) => coupleOf(inputs) && !!inputs.partner.stop && inputs.partner.stop.kind === 'already';

/**
 * A couple who stop in different years, named by who still works (see the head of this file): `ages` each person's age
 * at their own stop, `lead` "Stop at" or "From", `tail` what follows the ages, `youHaveStopped` (C: taking money from
 * now). '' when they stop in the same year — the suggestion is then today's. Stopping at today's age is still a stop of
 * your own ("Stop at 55 and 58"); only "they already have" leaves the partner out.
 */
function apartName(inputs, ages, lead, tail, youHaveStopped) {
  if (!coupleOf(inputs) || !isNum(ages.you) || !isNum(ages.partner)) return '';
  if (ages.you - inputs.you.age === ages.partner - inputs.partner.age) return '';
  if (youHaveStopped) return `Partner stops at ${whole(ages.partner)}${tail}`;
  if (partnerStopped(inputs)) return `${lead} ${whole(ages.you)}${tail}`;
  return `${lead} ${agesText(ages.you, ages.partner)}${tail}`;
}

/** C's ages at each person's own stop: your start; the partner's own stop when given, else your start's year. */
function stopAgesC(inputs) {
  const start = inputs.start || {};
  const waitYou = start.kind === 'age' && isNum(start.age) ? Math.max(0, start.age - inputs.you.age) : 0;
  const own = (coupleOf(inputs) && inputs.partner.stop) || {};
  const partner = !coupleOf(inputs) ? null
    : own.kind === 'already' ? inputs.partner.age
      : own.kind === 'age' && isNum(own.age) ? own.age
        : inputs.partner.age + waitYou;
  return { you: inputs.you.age + waitYou, partner };
}

function suggestC(inputs, result) {
  const basis = result.basis || {};
  const whose = result.whose === 'partner' ? 'partner' : 'you';
  const whoseAge = inputs[whose] && inputs[whose].age;
  if (!isNum(basis.startAge) || !isNum(whoseAge) || !result.monthly || !isNum(result.monthly.careful)) return '';
  const wait = basis.startAge - whoseAge;
  const couple = coupleOf(inputs);
  const goingIn = !!result.payIn && isNum(result.payIn.total) && result.payIn.total > 0;
  const tail = `${PLAN_NAME.sep}${tenner(result.monthly.careful)} a month`;
  const apart = apartName(inputs, stopAgesC(inputs), goingIn ? 'Stop at' : 'From', tail, !(inputs.start && inputs.start.kind === 'age'));
  if (apart) return apart;
  const ages = agesText(inputs.you.age + wait, couple ? inputs.partner.age + wait : null);
  const payingIn = wait > 0 && goingIn;
  const lead = payingIn ? 'Stop at' : 'From';
  return `${lead} ${ages}${tail}`;
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
  // a stop at or after a step starts on the step (spending-shape.md 6.3): the figure that stop tested, never the one typed
  const inForce = result.shapeNotes && result.shapeNotes.inForce && Array.isArray(result.spendShape) && result.spendShape.length;
  const tail = `${PLAN_NAME.sep}${tenner(inForce ? result.spendShape[0].perMonth : result.spend.perMonth)} a month`;
  // "I've already stopped": the row is your partner's stop
  if (youStopped(inputs)) return `Partner stops at ${whole(shown.age)}${tail}`;
  const shownAges = shown.ages || {};
  const lead = retiredA(inputs, shown) ? 'From' : 'Stop at';
  const youAge = isNum(shownAges.you) ? shownAges.you : shown.age;
  const partnerAge = couple ? (isNum(shownAges.partner) ? shownAges.partner : inputs.partner.age + (youAge - inputs.you.age)) : null;
  const apart = couple ? apartName(inputs, { you: youAge, partner: partnerAge }, lead, tail, false) : '';
  if (apart) return apart;
  return `${lead} ${agesText(youAge, partnerAge)}${tail}`;
}

/** " · paying £…" after a B name, when something goes in and it fits in 50 characters. */
function withPaying(base, result) {
  const now = result.payIn && isNum(result.payIn.now) ? result.payIn.now : 0;
  if (!(now > 0)) return base;
  const full = `${base}${PLAN_NAME.sep}paying ${tenner(now)}`;
  return chars(full) > PLAN_NAME.suggestMax ? base : full;
}

function suggestB(inputs, result) {
  const stop = result.stop;
  if (!stop || !isNum(stop.age) || !result.spend || !isNum(result.spend.perMonth)) return '';
  const couple = coupleOf(inputs);
  const tail = `${PLAN_NAME.sep}${tenner(result.spend.perMonth)} a month`;
  // "I've already stopped": the age in mind is your partner's
  if (youStopped(inputs)) return withPaying(`Partner stops at ${whole(stop.age)}${tail}`, result);
  const ages = result.ages || {};
  const youAge = isNum(ages.you) ? ages.you : stop.age;
  const partnerAge = couple ? (isNum(ages.partner) ? ages.partner : inputs.partner.age + (youAge - inputs.you.age)) : null;
  const apart = couple ? apartName(inputs, { you: youAge, partner: partnerAge }, 'Stop at', tail, false) : '';
  return withPaying(apart || `Stop at ${agesText(youAge, partnerAge)}${tail}`, result);
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
  const name = SUGGEST[source](ins, result);
  // what is spent changing with age (spending-shape.md 8.3): "Stop at 62 · £2,500 a month, less from 75" — when it fits
  const tail = shapeTail(source === 'c' ? result.shapeAt && result.shapeAt.careful : result.spendShape);
  if (!name || !tail) return name;
  const shaped = name.replace(' a month', ` a month${tail}`);
  return chars(shaped) > PLAN_NAME.suggestMax ? name : shaped;
}

/**
 * ", less from 75" / ", more from 85" — the first later step that differs from the start; ", less each year" for a start
 * that falls. '' without a shape.
 */
function shapeTail(list) {
  if (!Array.isArray(list) || !list.length) return '';
  const start = list[0];
  if (start.then === 'falls') return ', less each year';
  const next = list.slice(1).find((s) => Math.round(s.perMonth) !== Math.round(start.perMonth));
  return next ? `, ${next.perMonth < start.perMonth ? 'less' : 'more'} from ${whole(next.fromAge)}` : '';
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
