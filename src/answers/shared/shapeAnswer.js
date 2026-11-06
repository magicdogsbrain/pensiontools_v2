/**
 * What an answer of C, A or B carries when what is spent changes with age (research/v7/spending-shape.md 6, 7.4): the
 * shape's steps at the amounts the answer is about, each year's figures, and the year the incomes you get anyway pay more
 * than the shape. Nothing here runs the engine: the steps are shape.js stepsAt on the plan's own start, the years are
 * phasesAt's own figures one year at a time.
 *
 *   shapeOfAnswer({ household, plan, at, asTyped?, yearly, round? })
 *     → null without a shape (a flat answer has none of these keys), else
 *       { shapeAt?: { careful, middling, good }, spendShape?, byYear, shapeNotes }
 *       - shapeAt: each solved figure ("about £2,300 a month at the start") with the later steps moved in proportion —
 *         careful figures rounded DOWN (no year a person reads is higher than a year tested), middling and good to the
 *         nearest (£10 from £1,000, £5 below);
 *       - spendShape: the spending as typed and tested (A, B): the start as typed (or the step in force from it), each step
 *         as typed, the end of a fall to the pound;
 *       - byYear: one row a year, at the amount the answer is about, on the pots its phases read: your age, each person's
 *         age, what is spent (the shape's figure that year), the take-home (never under the incomes you get anyway), what
 *         those incomes and the pots pay (from the pension, from savings), whether every pension is open (A, B), each
 *         person's take-home — the chart's "Show each year" and the plan seed's rows;
 *       - shapeNotes: { inForce: { age, perMonth } | null — a step at or before the start is in force from it (A's rows past
 *         a step); belowIncome: { age, perMonth } | null — the first year the State Pension and other pensions pay more
 *         than the shape's figure, after tax (the pots pay nothing that year) }.
 * Pure.
 */
import { stepsAt, downMonthly, nearMonthly } from './shape.js';

const round2 = (x) => Math.round(x * 100) / 100;

/** Your age at the household's start in a plan (the shape's ages are yours). */
const startAgeYou = (plan) => (plan.people.find((p) => p.who === 'you') || plan.people[0]).ageAtStart;

/**
 * @param {object} o
 * @param {object} o.household   the household the plan was made from (household.shape: shape.js)
 * @param {object} o.plan        the plan the answer was worked out on (enginePlan: plan.shape when it moves here)
 * @param {null|{ careful: number, middling: number, good: number }} [o.at]   the solved year-0 amounts, £ a month
 * @param {null|number} [o.asTyped]   the year-0 amount as typed and tested, £ a month (A, B)
 * @param {object[]} [o.yearly]  phasesAt(…, { yearly: true }) at the amount the answer is about (one phase a year)
 * @param {number} [o.H0]        that amount, £ a year in the first year
 */
export function shapeOfAnswer({ household, plan, at = null, asTyped = null, yearly = [], H0 = 0 }) {
  const hs = household && household.shape;
  if (!hs) return null;
  const first = hs.unit === 'share' ? 1 : hs.first;
  const start = startAgeYou(plan);
  const years = plan.years;
  const list = (monthly, round) => stepsAt(hs, first, start, years, monthly, round);
  const out = {};
  if (at) out.shapeAt = { careful: list(at.careful, downMonthly), middling: list(at.middling, nearMonthly), good: list(at.good, nearMonthly) };
  // (as typed: each figure to the pound; where a fall ends is worked out, so to the nearest £10 from £1,000, £5 below —
  // rounded once, from the year's own figure: £2,044.77 is £2,040, never £2,045 and then £2,050)
  if (asTyped !== null) {
    out.spendShape = list(asTyped, (n) => n).map((s) => ({
      ...s, perMonth: Math.round(s.perMonth),
      ...(s.endPerMonth !== undefined ? { endPerMonth: s.then === 'falls' ? nearMonthly(s.endPerMonth) : Math.round(s.endPerMonth) } : {})
    }));
  }
  // one row a year: the shape's figure, and what the household has (never under the incomes it gets anyway)
  const r = (y) => (plan.shape && plan.shape.r ? plan.shape.r[y] : 1);
  out.byYear = yearly.map((ph, y) => {
    const row = {
      age: ph.ages.you ? ph.ages.you.from : ph.fromAge, ages: Object.fromEntries(Object.entries(ph.ages).map(([w, a]) => [w, a.from])),
      spend: round2(H0 * r(y) / 12), takeHome: ph.takeHome, fromPots: ph.fromPots, fromPension: ph.fromPension, fromSavings: ph.fromSavings,
      statePension: ph.statePension, finalSalary: ph.finalSalary, tax: ph.tax,
      byPerson: ph.byPerson.map((b) => ({ who: b.who, takeHome: b.takeHome, ...(b.working !== undefined ? { working: b.working } : {}) }))
    };
    if (ph.pensionOpen !== undefined) row.pensionOpen = ph.pensionOpen;
    if (ph.fromWork !== undefined) row.fromWork = ph.fromWork;
    if (ph.fromPay !== undefined) row.fromPay = ph.fromPay;
    return row;
  });
  // the notes: a step in force from the start; the first year the incomes you get anyway pay more than the shape
  const a0 = plan.shape ? plan.shape.a0 : 1;
  const inForce = a0 !== 1 && (hs.steps || []).some((s) => s.fromAge <= start)
    ? { age: [...hs.steps].filter((s) => s.fromAge <= start).pop().fromAge, perMonth: list(asTyped !== null ? asTyped : at ? at.careful : 0, (n) => Math.round(n))[0].perMonth }
    : null;
  const above = out.byYear.find((row) => row.spend > 0 && row.takeHome > row.spend + 0.5 && row.fromPots <= 0.005);
  out.shapeNotes = { inForce, belowIncome: above ? { age: above.age, perMonth: Math.round(above.takeHome) } : null };
  return out;
}

/**
 * The phases whose figures are their FIRST year's only, because the shape moves inside them (a fall, or moving evenly):
 * each such phase gains `shapeMoves: true` (spending-shape.md 7.2 madeOf.firstYear — "(in its first year)"). A phase the
 * shape holds level is left as it is, and a flat answer's phases are never touched. In place; → the phases.
 */
export function markShapeMoves(phases, byYear) {
  if (!Array.isArray(phases) || !Array.isArray(byYear) || !byYear.length) return phases;
  for (const ph of phases) {
    const from = ph.ages && ph.ages.you ? ph.ages.you.from : ph.fromAge;
    const to = ph.ages && ph.ages.you ? ph.ages.you.to : ph.toAge;
    const spends = byYear.filter((y) => y.age >= from && y.age < to).map((y) => y.spend);
    if (spends.some((v) => v !== spends[0])) ph.shapeMoves = true;
  }
  return phases;
}

// ---- the words (spending-shape.md 7.2, 7.4): the same in C, A and B -----------------------------------------------------

const M = (key) => ({ key, kind: 'money' });
const A = (key) => ({ key, kind: 'age' });
const F = (fixed) => ({ fixed: String(fixed) });
const S = (id, parts) => ({ id, text: '', parts: parts.flat(Infinity).filter((p) => p !== '' && p != null) });

/** What a step does after its first year: ", falling 1% a year to £2,020 at 74" / ", moving evenly to £1,950 at 75". */
function tail(key, i, s, lead) {
  if (s.then === 'falls') return [lead, 'falling ', F(s.fallsPct), '% a year to ', M(`${key}.${i}.endPerMonth`), ' at ', A(`${key}.${i}.endAge`)];
  if (s.then === 'glides') return [lead, 'moving evenly to ', M(`${key}.${i}.endPerMonth`), ' at ', A(`${key}.${i}.endAge`)];
  return [];
}

/** "£1,950 from 75 and £1,610 from 85"; three or four with commas; more than four: the first two "and 3 more steps (see the chart)". */
export function laterParts(list, key) {
  const items = list.slice(1).map((s, k) => [M(`${key}.${k + 1}.perMonth`), ' from ', A(`${key}.${k + 1}.fromAge`), ...tail(key, k + 1, s, ', then ')]);
  if (items.length > 4) return [...items[0], ', ', ...items[1], ' and ', F(items.length - 2), ' more steps (see the chart)'];
  const out = [];
  items.forEach((it, i) => { if (i > 0) out.push(i === items.length - 1 ? ' and ' : ', '); out.push(...it); });
  return out;
}

/** The start's own clause, when it falls or moves evenly (else nothing). */
export const startParts = (list, key) => tail(key, 0, list[0], ', ');

/** "That is at the start. Then, as you set it: £1,950 from 75 and £1,610 from 85." (C; A and B the spend as typed.) */
export function atTheStart(id, list, key) {
  const later = list.length > 1 ? laterParts(list, key) : [];
  return S(id, ['That is at the start', ...startParts(list, key), '.', ...(later.length ? [' Then, as you set it: ', ...later, '.'] : [])]);
}

/** "You could spend about £2,300 a month at the start, then as you set it: £1,950 from 75 and £1,610 from 85." */
export function couldAtTheStart(id, list, key, lead = 'You could spend about ') {
  const later = list.length > 1 ? laterParts(list, key) : [];
  return S(id, [lead, M(`${key}.0.perMonth`), ' a month at the start', ...startParts(list, key), ...(later.length ? [', then as you set it: ', ...later] : []), '.']);
}

/**
 * The notes of a shaped answer (severity 'note'): the incomes you get anyway pay more than the shape from an age; and (A) a
 * stop after a step, which is then in force from the start. `stopKey`: the key of the stop the answer shows (A: shown.age).
 */
export function shapeWarnings(result, { couple = false, stopKey = null } = {}) {
  const n = result.shapeNotes;
  if (!n) return [];
  const out = [];
  const note = (id, parts) => out.push({ id, severity: 'note', parts: S(id, parts).parts });
  if (n.inForce && stopKey) {
    // a stop AT the step's age is not "after" it (review, 2 Oct 2026): the step starts as you stop
    const stop = stopKey.split('.').reduce((o, k) => (o && typeof o === 'object' ? o[k] : undefined), result);
    note('shape-step-in-force', stop === n.inForce.age
      ? ['Your step from ', A('shapeNotes.inForce.age'), ' starts as you stop, so ', M('shapeNotes.inForce.perMonth'), ' a month applies from the start.']
      : ['You stop at ', A(stopKey), ', after your step from ', A('shapeNotes.inForce.age'), ', so ', M('shapeNotes.inForce.perMonth'), ' a month applies from the start.']);
  }
  if (n.belowIncome) {
    note('shape-below-income', [couple ? 'From when you are ' : 'From ', A('shapeNotes.belowIncome.age'),
      ' your State Pension and other pensions pay more than this, after tax (about ', M('shapeNotes.belowIncome.perMonth'),
      ' a month): you would have that, and nothing would be taken from your pension or savings.']);
  }
  return out;
}
