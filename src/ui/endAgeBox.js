/**
 * The full view's "Plan to age" box (lead4.md D5 and R3; step F1). Both views ask the same quantity for field about.endAge:
 * the age the plan runs to (AgeConvention.planToAgeOf of the start age and the stored length). The plan keeps its length
 * (`duration`, held in the form's hidden #ssDuration, which the save and the page's other readers use); this box shows the
 * end age and, when a person types one, sets the length to match. Its problem words are the simple view's (copy/about.js).
 *
 * DOM access goes through the `doc` argument (the tests pass a JSDOM document); nothing here reads `window`.
 */
import { planToAgeOf } from '../services/AgeConvention.js';
import { MIN_YEARS, ABOUT_FIELDS } from '../answers/plan/schema.js';
import { ABOUT } from '../v7/copy/about.js';

const FIELD = ABOUT_FIELDS.find((f) => f.path === 'endAge') || { min: 23, max: 110 };
const WORDS = ABOUT.errors.endAge;

/** The age in plan year 0: the timing's own, else the form's hidden #shapeAgeNow; null when not known. */
function startAgeOf(doc, timing) {
  if (timing && +timing.shapeAgeNow > 0) return +timing.shapeAgeNow;
  const el = doc.getElementById('shapeAgeNow');
  return el && +el.value > 0 ? +el.value : null;
}

function hint(doc, years) {
  const h = doc.getElementById('ssDurationAgeHint');
  if (h) h.textContent = years > 0 ? '— ' + years + ' years from the plan\'s start' : '';
}

/** Shows the plan's end age in the box (left alone while a person is typing in it) and the length beside it. */
export function paintEndAge(doc, timing) {
  const box = doc.getElementById('ssEndAge');
  const dur = +(doc.getElementById('ssDuration') || {}).value || 0;
  const a = startAgeOf(doc, timing);
  if (box && doc.activeElement !== box) box.value = dur > 0 && a != null ? String(planToAgeOf(a, dur)) : '';
  hint(doc, dur);
}

/** The words for the box's problem (prefixed with the box's name, as the page's other checks are), or null. */
export function endAgeError(doc, timing) {
  const box = doc.getElementById('ssEndAge');
  const raw = box ? String(box.value).trim() : '';
  if (raw === '') return null;   // an empty box keeps the plan's length (the save writes the stored one)
  const n = Number(raw);
  const a = startAgeOf(doc, timing);
  let words = null;
  if (!Number.isFinite(n) || n !== Math.round(n)) words = WORDS.notANumber;
  else if (n > FIELD.max) words = WORDS.tooHigh;
  else if (n < FIELD.min) words = WORDS.tooLow;
  else if (a != null && n < a + MIN_YEARS) words = WORDS['too-short'].replace('{min}', MIN_YEARS).replace('{minAge}', a + MIN_YEARS);
  return words ? 'Plan to age: ' + words.charAt(0).toLowerCase() + words.slice(1) : null;
}

/** A person typed an end age: when it can be used, the plan's length follows it (the start age stays). */
export function endAgeTyped(doc, timing) {
  const box = doc.getElementById('ssEndAge');
  const dur = doc.getElementById('ssDuration');
  const a = startAgeOf(doc, timing);
  if (!box || !dur || a == null || endAgeError(doc, timing) || String(box.value).trim() === '') return;
  dur.value = String(Math.round(+box.value) - Math.round(a));
  hint(doc, +dur.value);
}
