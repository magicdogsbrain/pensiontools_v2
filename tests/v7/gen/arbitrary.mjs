/**
 * Random, valid inputs built from the input list (test plan 1.5): every field drawn (three times in four a
 * boundary value), then the app's own checkInputs drops what does not apply, fills the defaults and applies the
 * cross-field rules. fast-check prints the seed and the smallest failing input, so a failure can be pasted into
 * tests/v7/c/found.cases.json as a permanent case.
 *
 * The spending shape's fields (group 'shape': spend.then / fallsPct / steps, C's shape.*) are left out: not answered is the
 * same every year, so every generator here draws exactly the households it drew before the shape existed (the same seed,
 * the same inputs). Shaped households have their own generators (tests/v7/shared/shapeGen.mjs).
 *
 * How the savings grow (6.22.0, `isaGrowth`) is left out the same way unless asked for (`{ isaGrowth: true }`): not drawn,
 * it is "Mostly cash" whenever there is money in savings (its default rule), and every generator here still draws exactly
 * the households it drew before the choice existed. "Invested like my pension" is drawn by the pairs lists (gen/pairs.mjs,
 * dimensionsA.mjs, dimensionsB.mjs) and by the tests that ask for it (tests/v7/shared/isaGrowth*.test.js).
 */
import fc from 'fast-check';
import { checkInputs, nest } from '../../../src/answers/shared/validate.js';

/** One field → values. */
export function fieldArb(f) {
  if (f.type === 'yesNo') return fc.boolean();
  if (f.type === 'choice') return fc.constantFrom(...f.options);
  const edges = f.boundaries || [f.min, f.max];
  return fc.oneof(
    { weight: 3, arbitrary: fc.constantFrom(...edges) },
    { weight: 1, arbitrary: fc.integer({ min: f.min, max: f.max }) }
  );
}

/** Whole, valid, checked inputs (defaults filled, fields that do not apply removed). */
const drawn = (schema, opts = {}) => schema.fields.filter((f) => f.group !== 'shape' && (f.path !== 'isaGrowth' || opts.isaGrowth === true));

export function arbitraryInputs(schema, env, opts = {}) {
  const record = Object.fromEntries(drawn(schema, opts).map((f) => [f.path, fieldArb(f)]));
  return fc.record(record)
    .map((flat) => checkInputs(schema, nest(flat), env))
    .filter((r) => r.ok)
    .map((r) => r.inputs);
}

/** The same, but only what a person would have typed: the checked inputs with the defaulted fields removed again. */
export function arbitraryTyped(schema, env, opts = {}) {
  const record = Object.fromEntries(drawn(schema, opts).map((f) => [f.path, fc.option(fieldArb(f), { nil: undefined, freq: f.required ? 1000 : 3 })]));
  return fc.record(record)
    .map((flat) => {
      const typed = Object.fromEntries(Object.entries(flat).filter(([, v]) => v !== undefined));
      const r = checkInputs(schema, nest(typed), env);
      return r.ok ? { typed: nest(typed), inputs: r.inputs } : null;
    })
    .filter((x) => x !== null);
}
