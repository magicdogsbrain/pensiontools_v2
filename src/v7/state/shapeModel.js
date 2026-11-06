/**
 * The screen's one door to the spending shape's model (src/answers/shared/shape.js; research/v7/spending-shape.md
 * 3.4–3.5, 4.3–4.5): what the spend step and C's "Add more detail" need worked out — each year's figure for the picture, a
 * later step as a share of the start, "Suggest go-go, go-slow and no-go years", the presets, moving the later steps in
 * proportion, and a share of C's start in pounds for a hand-over. The reducer and select.js reach the model only through
 * here; nothing here has a rule of its own beyond putting the model's answers in the screen's terms.
 *
 * Every year's figure is the model's (ratiosOf and startFactor: today's planner's own IncomeSchedule.amountAtAge on the
 * model's todaysSteps): falls compound at today's prices, and "moves evenly" is a straight line in pounds that reaches the
 * next step as it starts. Only the model is read here (the boundary rule: tests/v7/boundaries.test.js).
 * The suggestion is today's suggestSteps in V7's units, and "Slowly less" today's smileToSteps (the model's PAR tests).
 *
 * Pure. A shape here is the model's: { unit: 'perMonth' | 'share', start: { then, fallsPct? },
 * steps: [{ fromAge, perMonth | share, then, fallsPct? }] }, numbers already read.
 */
import { todaysSteps, ratiosOf, startFactor, shareOf, suggest as suggestModel, slowlyLess, rescale as rescaleModel } from '../../answers/shared/shape.js';

export { todaysSteps, ratiosOf, shareOf, startFactor };

const isNum = (v) => typeof v === 'number' && Number.isFinite(v);

/**
 * The figure in each year for the picture, y = 0 … years − 1: A and B, £ a month (the first × the step in force × its
 * fall); C, % of the start. null when there is nothing to work from.
 */
export function yearFigures(shape, first, startAge, years) {
  const unitFirst = shape && shape.unit === 'share' ? 100 : first;
  if (!shape || !isNum(startAge) || !(years > 0) || !(unitFirst > 0)) return null;
  // the model's own: the figure in force at the start (startFactor: 1 unless a step is at or before it) × r(y)
  const inUnits = shape.unit === 'share' ? 1 : first;
  const atStart = startFactor(shape, inUnits, startAge) * unitFirst;
  const r = ratiosOf(shape, inUnits, startAge, years);
  return Array.from({ length: years }, (_, y) => atStart * (r ? r[y] : 1));
}

/** The whole-number share shown beside a later step: "85% of the start". */
export function shownShare(perMonth, first) {
  const s = shareOf(perMonth, first);
  return s === null ? null : Math.round(s);
}

/**
 * "Suggest go-go, go-slow and no-go years" (the model's suggest): → { start, steps, age75, age85, floor }, the shape's
 * start and later steps at the top level, as the reducer writes them into the boxes.
 */
export function suggest(unit, first, startAge, olderBy = 0, essentials = null) {
  const r = suggestModel(unit, first, startAge, olderBy, essentials);
  return { start: r.shape.start, steps: r.shape.steps, age75: r.age75, age85: r.age85, floor: r.floor };
}

/** The presets: 'level' — no later steps, the first stays the same; 'slowly' — the model's slowlyLess (today's smileToSteps). */
export function preset(unit, id, first, startAge) {
  if (id === 'level') return { unit, start: { then: 'level' }, steps: [] };
  if (id !== 'slowly' || !isNum(startAge) || (unit !== 'share' && !(first > 0))) return null;
  return slowlyLess(unit, first, startAge);
}

/** "Move the later steps in proportion": one later amount × new ÷ old, to the pound (the model's rescale). */
export function rescale(perMonth, oldFirst, newFirst) {
  if (!isNum(perMonth) || !(oldFirst > 0) || !(newFirst > 0)) return null;
  return rescaleModel({ unit: 'perMonth', steps: [{ perMonth }] }, oldFirst, newFirst).steps[0].perMonth;
}

/** A share of C's start as pounds a month (C → A, B; spending-shape.md 4.5): careful × share, rounded down to the pound. */
export function fromShare(share, careful) {
  if (!isNum(share) || !(careful > 0)) return null;
  return Math.floor((careful * share) / 100 + 1e-9);
}
