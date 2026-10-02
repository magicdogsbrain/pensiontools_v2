/**
 * The spending shape (research/v7/spending-shape.md 3): how what a household spends changes with age — at least what
 * today's planner offers on its income shape (the owner, 2 Oct 2026: "We MUST offer as many steps and tapers as V6! …
 * We must have Gogo, goslow and nogo years").
 *
 * A shape (the model's; every number already checked):
 *   { unit: 'perMonth' | 'share', start: { then, fallsPct? }, steps: [{ fromAge, perMonth | share, then, fallsPct? }] }
 *   - the first amount is the figure the question has (A, B: what is spent a month from the stop; C: what it works out you
 *     could start on, so its steps are shares of it, 100 = the same);
 *   - each later step from an age (YOUR age: the person at the keyboard), as an amount a month (A, B) or a share (C);
 *   - `then`, for the first amount and each step: 'level' (stays the same), 'falls' (fallsPct% less each year than the
 *     year before, at today's prices — compounding, as today's `decline`), or 'glides' (a straight line in pounds to the
 *     next step's amount, arriving as that step starts — today's `glideToNext`; never on the last).
 * Every figure is after tax, at today's prices, and goes up with prices: V7's units. Today's planner's are before tax, a
 * year; the arithmetic of a fall and of a glide is the same.
 *
 * ONE MEANING: each year's figure is today's own IncomeSchedule.amountAtAge (imported, never copied) on today's step list
 * built from the shape in units of the first amount (todaysSteps). So "falls 1% a year" and "moves evenly" are exactly
 * what they are in today's planner (tests/v7/shared/shape.test.js PAR1-PAR3 read today's functions).
 *
 *   SHAPE_LIMITS, THEN                   the limits every input and check reads
 *   ratioOf(shape, step, first)          a later step in units of the first (perMonth ÷ first, or share ÷ 100)
 *   todaysSteps(shape, first, startAge)  today's step list { fromAge, amount, decline, glideToNext }, the first = 1
 *   startFactor(shape, first, startAge)  the figure in force at the start, in units of the first (1 unless a step is at or
 *                                        before the start: A's rows past a step)
 *   ratiosOf(shape, first, startAge, years)  r(y) = a(start + y) ÷ a(start), y = 0 … years − 1; null when every r(y) is 1
 *   isTrivial(shape, first)              a shape that never changes (every step the first, every "then" level)
 *   suggest(unit, first, startAge, olderBy?, essentials?)   "Suggest go-go, go-slow and no-go years" (today's suggestSteps)
 *   slowlyLess(unit, first, startAge)    the preset "Slowly less" (today's smileToSteps on a one-step shape)
 *   rescale(shape, oldFirst, newFirst)   every later amount moved in proportion (round £1)
 *   shareOf(perMonth, first)             a later amount as a share of the first, to two places
 *   stepsAt(shape, first, startAge, years, startMonthly, round?)   the list a sentence reads: the start and each later step
 *                                        inside the plan, at a household amount a month at the start
 *   downMonthly(n), nearMonthly(n)       the language guide's rounding of a derived monthly figure (£10 from £1,000, £5
 *                                        below): down (careful) or to the nearest
 *
 * Pure: no clock, storage or screen.
 */
import { amountAtAge, smileToSteps } from '../../services/IncomeSchedule.js';

/** The limits of a shape (spending-shape.md 3.7). */
export const SHAPE_LIMITS = Object.freeze({
  fallsPct: Object.freeze({ min: 0.25, max: 10, step: 0.25 }),
  perMonth: Object.freeze({ min: 1, max: 50_000 }),
  share: Object.freeze({ min: 1, max: 500, step: 0.01 })
});
/** What happens from an age: stays the same, falls by a percentage a year, or moves evenly to the next step. */
export const THEN = Object.freeze(['level', 'falls', 'glides']);

const isNum = (v) => typeof v === 'number' && Number.isFinite(v);

/** A later step's amount in units of the first: one division of the two numbers given, so equal shares give the same bits. */
export const ratioOf = (shape, step, first) => (shape.unit === 'share' ? step.share / 100 : step.perMonth / first);

/** A "then" in today's terms. */
const today = (then, fallsPct) => ({ decline: then === 'falls' && isNum(fallsPct) ? fallsPct : 0, glideToNext: then === 'glides' });

/**
 * Today's step list (IncomeSchedule's), in units of the first: the first amount at the start, then each later step. A
 * later step at or before the start is in force from it — its fall or glide counting from its own age, as today — and the
 * first amount is then not used.
 */
export function todaysSteps(shape, first, startAge) {
  const later = (shape.steps || []).map((s) => ({ fromAge: s.fromAge, amount: ratioOf(shape, s, first), ...today(s.then, s.fallsPct) }));
  const start = shape.start || {};
  const head = later.some((s) => s.fromAge <= startAge) ? [] : [{ fromAge: startAge, amount: 1, ...today(start.then, start.fallsPct) }];
  return [...head, ...later];
}

/** The figure in force at the start, in units of the first: 1, unless a later step is at or before the start. */
export function startFactor(shape, first, startAge) {
  if (!shape || !isNum(startAge) || (shape.unit !== 'share' && !(first > 0))) return 1;
  return amountAtAge(todaysSteps(shape, first, startAge), startAge);
}

/**
 * Each year's share of the start: r(y) = a(start + y) ÷ a(start), y = 0 … years − 1, with a(age) today's amountAtAge on
 * todaysSteps. null when every r(y) is 1: a shape that never changes is no shape (spending-shape.md 3.5).
 */
export function ratiosOf(shape, first, startAge, years) {
  if (!shape || !isNum(startAge) || !(years > 0)) return null;
  if (shape.unit !== 'share' && !(first > 0)) return null;
  const list = todaysSteps(shape, first, startAge);
  const a0 = amountAtAge(list, startAge);
  if (!(a0 > 0)) return null;
  const r = Array.from({ length: years }, (_, y) => amountAtAge(list, startAge + y) / a0);
  return r.every((x) => x === 1) ? null : r;
}

/** A shape that never changes, at any start: every later step the same as the first and every "then" level. */
export function isTrivial(shape, first) {
  if (!shape) return true;
  const start = shape.start || {};
  if ((start.then || 'level') !== 'level') return false;
  return (shape.steps || []).every((s) => (s.then || 'level') === 'level' && ratioOf(shape, s, first) === 1);
}

const round10 = (n) => Math.round(n / 10) * 10;

/**
 * "Suggest go-go, go-slow and no-go years" — today's suggestSteps (src/ui/incomeShapeGraphic.js) in V7's units: from 75
 * and from 85 of the younger of you (written as your age: 75 + olderBy), each only when the start is before it; A and B
 * max(85% of the first, the essentials) and max(70%, the essentials), each to the nearest £10 a month (today: the floor,
 * then the rounding, to £500 a year); C 85% and 70%, no floor (C has no amount yet). Every step "stays the same", and so
 * does the first amount; the steps before are replaced, as today.
 * @param {'perMonth'|'share'} unit
 * @param {number} first        the first amount, £ a month (ignored for 'share')
 * @param {number} startAge     your age at the start
 * @param {number} [olderBy]    how much older you are than the younger of you (0 for one person, or when you are younger)
 * @param {number|null} [essentials]   the budget's essentials, £ a month, after tax — from the screen's budget, never an answer's
 * @returns {{ shape: object, age75: number|null, age85: number|null, floor: number|null }}
 */
export function suggest(unit, first, startAge, olderBy = 0, essentials = null) {
  const shift = Math.max(0, Math.round(olderBy || 0));
  const age75 = 75 + shift;
  const age85 = 85 + shift;
  const floor = unit === 'share' || !(essentials > 0) ? null : essentials;
  const amount = (share) => (unit === 'share' ? { share: share * 100 } : { perMonth: round10(Math.max(share * first, floor || 0)) });
  const steps = [];
  if (startAge < age75) steps.push({ fromAge: age75, ...amount(0.85), then: 'level' });
  if (startAge < age85) steps.push({ fromAge: age85, ...amount(0.70), then: 'level' });
  return { shape: { unit, start: { then: 'level' }, steps }, age75: startAge < age75 ? age75 : null, age85: startAge < age85 ? age85 : null, floor };
}

/**
 * The preset "Slowly less" (today's old "declining with age" setting, T18): the same for 5 years, then 1% less each year for
 * 20 years, then the same — built with today's own smileToSteps on a one-step shape, so it is that setting year for year.
 * A and B: the amounts a month (the first rounded as today rounds, to the pound); C: shares, to two places.
 */
export function slowlyLess(unit, first, startAge) {
  const base = unit === 'share' ? 10_000 : first;
  const steps = smileToSteps([{ fromAge: startAge, amount: base }], startAge);
  const later = steps.filter((s) => s.fromAge > startAge).map((s) => ({
    fromAge: s.fromAge,
    ...(unit === 'share' ? { share: s.amount / 100 } : { perMonth: s.amount }),
    then: s.decline > 0 ? 'falls' : 'level',
    ...(s.decline > 0 ? { fallsPct: s.decline } : {})
  }));
  const head = steps.find((s) => s.fromAge === startAge);
  return { unit, start: head && head.decline > 0 ? { then: 'falls', fallsPct: head.decline } : { then: 'level' }, steps: later };
}

/** Every later amount moved in proportion to a new first amount, to the pound (A and B; C's shares do not move). */
export function rescale(shape, oldFirst, newFirst) {
  if (!shape || shape.unit === 'share' || !(oldFirst > 0) || !(newFirst > 0)) return shape;
  return { ...shape, steps: (shape.steps || []).map((s) => ({ ...s, perMonth: Math.max(1, Math.round(s.perMonth * newFirst / oldFirst)) })) };
}

/** A later amount as a share of the first, to two places: 2130 of 2500 → 85.2. null without a first. */
export function shareOf(perMonth, first) {
  if (!isNum(perMonth) || !(first > 0)) return null;
  return Math.round((perMonth / first) * 10000) / 100;
}

/** A derived monthly figure, rounded DOWN (careful figures: no year read is higher than a year tested): £10 from £1,000, £5 below. */
export function downMonthly(n) {
  const v = Math.max(0, Number(n) || 0);
  return v >= 1000 ? Math.floor(v / 10 + 1e-9) * 10 : Math.floor(v / 5 + 1e-9) * 5;
}
/** A derived monthly figure to the nearest £10 from £1,000, £5 below (format.js shownMonthly). */
export function nearMonthly(n) {
  const v = Math.max(0, Number(n) || 0);
  return v >= 1000 ? Math.round(v / 10) * 10 : Math.round(v / 5) * 5;
}

/**
 * The list a sentence reads (spending-shape.md 6.1): the start, then each later step inside the plan, at a household
 * amount of `startMonthly` a month in the first year. Ages are yours. A step that falls carries where it ends (`endAge`,
 * the year before the next step or the plan's last year, and `endPerMonth`); one that moves evenly carries the next
 * step's age and amount. `round` makes each derived figure what is shown (downMonthly for careful figures, nearMonthly
 * else; a typed amount is passed through `typed`).
 * @returns {{ fromAge: number, perMonth: number, then: string, fallsPct?: number, endAge?: number, endPerMonth?: number }[]}
 */
export function stepsAt(shape, first, startAge, years, startMonthly, round = (n) => n) {
  if (!shape || !(years > 0)) return [];
  const list = todaysSteps(shape, first, startAge);
  const a0 = amountAtAge(list, startAge);
  if (!(a0 > 0)) return [];
  const endAge = startAge + years - 1;
  const at = (age) => round(startMonthly * amountAtAge(list, age) / a0);
  // the step in force at the start, and every later one that starts inside the plan
  const inForce = list.reduce((k, s, i) => (s.fromAge <= startAge ? i : k), 0);
  const shown = list.map((s, i) => ({ s, i })).filter(({ s, i }) => i === inForce || (s.fromAge > startAge && s.fromAge <= endAge));
  return shown.map(({ s, i }, k) => {
    const from = Math.max(startAge, s.fromAge);
    const then = s.glideToNext && list[i + 1] ? 'glides' : s.decline > 0 ? 'falls' : 'level';
    const out = { fromAge: from, perMonth: k === 0 ? round(startMonthly) : at(from), then };
    if (then === 'falls') {
      out.fallsPct = s.decline;
      const next = shown[k + 1];
      out.endAge = next ? next.s.fromAge - 1 : endAge;
      out.endPerMonth = at(out.endAge);
    } else if (then === 'glides') {
      out.endAge = list[i + 1].fromAge;
      out.endPerMonth = out.endAge <= endAge ? at(out.endAge) : round(startMonthly * list[i + 1].amount / a0);
    }
    return out;
  });
}
