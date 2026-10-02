/**
 * The spending shape as it is TYPED (research/v7/spending-shape.md 3.2, 4.3): the steps by age in a question's draft,
 * and the edits the reducer makes to them. Pure, and no money arithmetic beyond the one default of a new step's box: every
 * figure an answer uses is worked out by the model (src/answers/shared/shape.js).
 *
 * Where it lives, by question (the input lists' paths):
 *   A and B   spend.then, spend.fallsPct, spend.steps   — each later step { fromAge, perMonth, then, fallsPct }
 *   C         shape.then, shape.fallsPct, shape.steps   — each later step { fromAge, share, then, fallsPct }
 * `then` is 'level' (stays the same), 'falls' (falls by fallsPct% a year) or 'glides' (moves evenly to the next step).
 * The first amount is the figure above (A, B) or the start C works out; its own "then" is `<base>.then`.
 *
 * In a draft, `<base>.steps` is a list of steps whose boxes hold text exactly as typed (as every other value of a draft
 * does); the input list's `steps` type reads it (validate.js). A step's box is known to the touched list and the errors
 * as "<base>.steps.<i>.<field>", so removing or sorting the steps moves those marks with their steps.
 *
 * The draft may also carry, outside `values` (so never in the checked inputs; kept across a reload of the tab, cleaned by
 * keptShapeExtras, so "Put back my steps by age" after "Try it the same every year" never loses a person's steps):
 *   shapeUndo   { values } — the shape as it was before the last suggestion or preset ("Undo": one level)
 *   shapeBase   the first amount (text) the later steps were last set against: when the figure above changes while
 *               there are later steps, "Move the later steps in proportion" is offered (A and B)
 *   shapeNote   { kind, … } — what the last suggestion, preset, undo or rescale did, for the line under the buttons
 */

/** Each question's place for the shape, and the unit of its later steps. */
export const SHAPE_BASE = Object.freeze({ a: 'spend', b: 'spend', c: 'shape' });
export const SHAPE_UNIT = Object.freeze({ a: 'perMonth', b: 'perMonth', c: 'share' });
export const THENS = Object.freeze(['level', 'falls', 'glides']);

export const hasShape = (q) => Object.prototype.hasOwnProperty.call(SHAPE_BASE, q);
export const thenPath = (q) => `${SHAPE_BASE[q]}.then`;
export const fallsPath = (q) => `${SHAPE_BASE[q]}.fallsPct`;
export const stepsPath = (q) => `${SHAPE_BASE[q]}.steps`;
/** The box of a later step's field, as the touched list, the errors and the page know it. */
export const stepBox = (q, i, field) => `${stepsPath(q)}.${i}.${field}`;
/** The paths of the shape in question q's draft. */
export const shapePaths = (q) => (hasShape(q) ? [thenPath(q), fallsPath(q), stepsPath(q)] : []);
/** Whether a path (a field, or a step's box) belongs to the shape of question q. */
export const isShapePath = (q, path) => hasShape(q) && (shapePaths(q).includes(path) || String(path).startsWith(`${stepsPath(q)}.`));

/** The fields a later step has, in the order of its row. */
export const stepFields = (q) => ['fromAge', SHAPE_UNIT[q], 'then', 'fallsPct'];

const text = (v) => (typeof v === 'string' ? v : typeof v === 'number' && Number.isFinite(v) ? String(v) : '');
const blank = (v) => v === undefined || v === null || (typeof v === 'string' && v.trim() === '');

/** One step, cleaned to its own text boxes: anything else is dropped, a "then" that is not one of the three is 'level'. */
export function cleanStep(q, item) {
  const x = item && typeof item === 'object' && !Array.isArray(item) ? item : {};
  const unit = SHAPE_UNIT[q];
  return { fromAge: text(x.fromAge), [unit]: text(x[unit]), then: THENS.includes(x.then) ? x.then : 'level', fallsPct: text(x.fallsPct) };
}

/** A list of steps as a draft may hold it (draftStore, a hand-over, the test hook): cleaned, or null when it is not one. */
export function cleanSteps(q, list) {
  if (!Array.isArray(list)) return null;
  return list.filter((x) => x && typeof x === 'object' && !Array.isArray(x)).map((x) => cleanStep(q, x));
}

/** The steps typed in a draft's values (a copy), or []. */
export function stepsOf(q, values) {
  const list = values && values[stepsPath(q)];
  return Array.isArray(list) ? list.map((x) => cleanStep(q, x)) : [];
}

/** Whether a draft says the spending changes with age at all: a later step, or a first amount that falls or moves. */
export function typedShape(q, values) {
  if (!hasShape(q) || !values) return false;
  const then = values[thenPath(q)];
  return stepsOf(q, values).length > 0 || then === 'falls' || then === 'glides';
}

/** Rounds to the nearest £10 a month (a new step's suggested box). */
const round10 = (n) => Math.round(n / 10) * 10;
const toNumber = (t) => {
  const s = String(t || '').replace(/[£,%\s]/g, '');
  return /^\d+(\.\d+)?$/.test(s) ? Number(s) : null;
};

/**
 * A new step's boxes (spending-shape.md 4.3, today's T5): 10 years after the last step (or after the start), before the
 * end; its amount 10% less than the step before, to the nearest £10 a month (C: 10 points of the start less), never
 * below £10 (C: 10%). A box is left empty when there is nothing to work it from.
 * @param {string} q
 * @param {object[]} steps        the steps as typed
 * @param {{ startAge: number|null, endAge: number|null, first: number|null }} at
 */
export function newStep(q, steps, { startAge = null, endAge = null, first = null } = {}) {
  const unit = SHAPE_UNIT[q];
  const last = steps.length ? steps[steps.length - 1] : null;
  const lastAge = last ? toNumber(last.fromAge) : startAge;
  let age = typeof lastAge === 'number' ? Math.floor(lastAge) + 10 : null;
  if (age !== null && typeof endAge === 'number' && age >= endAge) {
    const room = Math.floor(lastAge) + 1;
    age = room < endAge ? Math.max(room, Math.min(age, endAge - 1)) : null;
  }
  const before = last ? toNumber(last[unit]) : unit === 'share' ? 100 : first;
  let amount = '';
  if (typeof before === 'number' && before > 0) {
    amount = unit === 'share' ? String(Math.max(10, Math.round(before - 10))) : String(Math.max(10, round10(before * 0.9))).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  return { fromAge: age === null ? '' : String(age), [unit]: amount, then: 'level', fallsPct: '' };
}

/** The touched list with step i's marks gone and those after it moved up one (a step removed). */
export function touchedWithout(q, touched, i) {
  const prefix = `${stepsPath(q)}.`;
  const out = [];
  for (const t of touched || []) {
    if (!t.startsWith(prefix)) { out.push(t); continue; }
    const [k, ...rest] = t.slice(prefix.length).split('.');
    const n = Number(k);
    if (!Number.isInteger(n) || n === i) continue;
    out.push(`${prefix}${n > i ? n - 1 : n}.${rest.join('.')}`);
  }
  return out;
}

/** The touched list after the steps were put in a new order (`order[newIndex] = oldIndex`). */
export function touchedReordered(q, touched, order) {
  const prefix = `${stepsPath(q)}.`;
  const whereNow = new Map(order.map((old, now) => [old, now]));
  return (touched || []).map((t) => {
    if (!t.startsWith(prefix)) return t;
    const [k, ...rest] = t.slice(prefix.length).split('.');
    const n = Number(k);
    return whereNow.has(n) ? `${prefix}${whereNow.get(n)}.${rest.join('.')}` : t;
  });
}

/**
 * The steps in order of age, as today's editor sorts them (index.html: on leaving an age box). Steps whose age cannot
 * be read keep their place after those that can. → { steps, order } (order[newIndex] = oldIndex), or null when the
 * order is already right.
 */
export function sortedSteps(q, steps) {
  const keyed = steps.map((s, i) => ({ s, i, age: toNumber(s.fromAge) }));
  const order = [...keyed].sort((x, y) => {
    if (x.age === null && y.age === null) return x.i - y.i;
    if (x.age === null) return 1;
    if (y.age === null) return -1;
    return x.age - y.age || x.i - y.i;
  }).map((k) => k.i);
  if (order.every((old, now) => old === now)) return null;
  return { steps: order.map((i) => steps[i]), order };
}

/** The shape's three values as they stand in a draft (for Undo). */
export function shapeValuesOf(q, values) {
  const out = {};
  for (const p of shapePaths(q)) if (values && p in values) out[p] = p === stepsPath(q) ? stepsOf(q, values) : values[p];
  return out;
}

/** values with the shape's three values replaced by `shape` (only those it has; the rest removed). */
export function withShapeValues(q, values, shape) {
  const out = { ...values };
  for (const p of shapePaths(q)) {
    if (shape && p in shape && !(p === stepsPath(q) ? !Array.isArray(shape[p]) || shape[p].length === 0 : blank(shape[p]))) out[p] = shape[p];
    else delete out[p];
  }
  return out;
}

/** The kinds of line shown under the shape's buttons (StepsField's Note). */
export const NOTE_KINDS = Object.freeze(['suggest', 'suggestNeedsFirst', 'slowlyNeedsStop', 'level', 'slowly', 'undone', 'rescaled']);

/**
 * What a kept draft (draftStore, keptDraft) may carry of the shape outside its values, cleaned: the Undo (the shape's three
 * values, steps as their boxes), the line under the buttons (its kind, and its figures: numbers, yes/no or nothing) and the
 * figure the steps were set against. Anything else is dropped; {} for a question without a shape.
 */
export function keptShapeExtras(q, d) {
  const out = {};
  if (!hasShape(q) || !d || typeof d !== 'object') return out;
  const u = d.shapeUndo && typeof d.shapeUndo === 'object' && !Array.isArray(d.shapeUndo) ? d.shapeUndo.values : null;
  if (u && typeof u === 'object' && !Array.isArray(u)) {
    const values = {};
    for (const p of shapePaths(q)) {
      if (p === stepsPath(q)) {
        const steps = cleanSteps(q, u[p]);
        if (steps && steps.length) values[p] = steps;
      } else if (typeof u[p] === 'string') values[p] = u[p];
    }
    out.shapeUndo = { values };
  }
  const n = d.shapeNote;
  if (n && typeof n === 'object' && NOTE_KINDS.includes(n.kind)) {
    const values = {};
    const v = n.values && typeof n.values === 'object' && !Array.isArray(n.values) ? n.values : {};
    for (const k of ['age75', 'age85', 'floor', 'couple']) {
      const x = v[k];
      if ((typeof x === 'number' && Number.isFinite(x)) || typeof x === 'boolean' || x === null) values[k] = x;
    }
    out.shapeNote = { kind: n.kind, values };
  }
  if (typeof d.shapeBase === 'number' && Number.isFinite(d.shapeBase) && d.shapeBase > 0) out.shapeBase = d.shapeBase;
  return out;
}
