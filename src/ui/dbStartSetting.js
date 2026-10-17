/**
 * When a final-salary (defined-benefit) pension starts — asked by AGE (v6 usability audit, problem 3, 17 Oct 2026).
 *
 * Until now the Stress settings asked for "DB Starts (plan year, 0 = now)". A value beyond the plan's length (65, say,
 * typed as an age) was saved without a word, and the pension never paid. The box now asks for the age the pension
 * starts; beside it the planner says what that means ("that is plan year 13, tax year 2039/40"), and a start past the
 * plan's end or before its start is said plainly — past the end is refused on Save.
 *
 * The saved key the engines read stays as it is: `dbStartYear` (stressTest.lumpyByYear, the Decision tool, the income
 * shape preview). The age is written beside it as `dbStartAge`; a plan saved before this change has no age, so its age
 * is read from the year and the plan's start age (PlanTiming.deriveTiming().shapeAgeNow — the age in plan year 0).
 *
 * DOM access goes through the `doc` argument (the tests pass a JSDOM document); nothing here reads `window`.
 */
import { taxYearLabel } from '../services/PlanTiming.js';

const num = (v) => { const n = +v; return Number.isFinite(n) ? n : null; };

/** The age in plan year 0: the Stress form's hidden #shapeAgeNow (set by renderTiming), else the timing's own. */
export function dbStartAgeNow(doc, timing) {
  const t = timing && timing.shapeAgeNow > 0 ? +timing.shapeAgeNow : null;
  const el = doc && doc.getElementById ? doc.getElementById('shapeAgeNow') : null;
  const fromForm = el && +el.value > 0 ? +el.value : null;
  return t ?? fromForm ?? null;
}

/** The age a plan's saved settings mean: `dbStartAge` when saved, else the start age + `dbStartYear`. Null without a start age. */
export function dbStartAgeOf(settings, startAge) {
  const s = settings || {};
  if (+s.dbStartAge > 0) return Math.round(+s.dbStartAge);
  if (!(startAge > 0)) return null;
  return Math.round(startAge + (+s.dbStartYear || 0));
}

/** Plan year of an age: age − start age (may be negative, meaning before the plan starts). Null when either is missing. */
export function dbStartYearOfAge(age, startAge) {
  const a = num(age), s = num(startAge);
  if (a == null || s == null || !(a > 0) || !(s > 0)) return null;
  return Math.round(a) - Math.round(s);
}

/**
 * What a start means, in words, and whether it is a problem.
 * @param {{ year: number|null, startAge: number|null, firstTaxYear?: number|null, duration?: number|null, amount?: number }} x
 * @returns {{ text: string, level: null|'warn'|'error' }}  level 'error' = the pension would never pay (refused on Save)
 */
export function dbStartWords({ year, startAge, firstTaxYear = null, duration = null, amount = 0 } = {}) {
  if (!(amount > 0)) return { text: '', level: null };
  const y = num(year);
  if (y == null) return { text: 'Enter the age this pension starts.', level: 'warn' };
  const age = startAge > 0 ? Math.round(startAge) + y : null;
  const ty = firstTaxYear > 0 ? ' (tax year ' + taxYearLabel(+firstTaxYear + y) + ')' : '';
  const ageText = age != null ? 'age ' + age : 'plan year ' + y;
  if (duration > 0 && y >= duration) {
    const lastAge = startAge > 0 ? Math.round(startAge) + duration - 1 : null;
    return {
      level: 'error',
      text: 'That is after the plan ends' + (lastAge != null ? ' at age ' + lastAge : ' (' + duration + ' years)') + ' — the pension would never pay. Enter an age up to ' + (lastAge != null ? lastAge : duration - 1) + ', or lengthen the plan.'
    };
  }
  if (y < 0) {
    return { level: 'warn', text: 'That is before the plan starts' + (startAge > 0 ? ' at age ' + Math.round(startAge) : '') + ': the pension is counted as already being paid from the plan\'s first year' + (firstTaxYear > 0 ? ' (tax year ' + taxYearLabel(+firstTaxYear) + ')' : '') + '.' };
  }
  if (y === 0) return { level: null, text: 'That is the plan\'s first year' + (age != null ? ', ' + ageText : '') + ty + ' — the pension is paid from the start.' };
  return { level: null, text: 'That is ' + ageText + ', plan year ' + y + ty + '.' };
}

/** The timing facts the words need, from the Stress form and the derived timing (renderTiming's window._ssTiming). */
function facts(doc, timing) {
  const startAge = dbStartAgeNow(doc, timing);
  const firstTaxYear = timing && +timing.firstTaxYear > 0 ? +timing.firstTaxYear : null;
  const duration = +doc.getElementById('ssDuration')?.value || null;
  const amount = +doc.getElementById('ssDbAmount')?.value || 0;
  return { startAge, firstTaxYear, duration, amount };
}

/**
 * Put a plan's saved start into the form: the hidden year (what the engines read) and the age box. The age is kept on
 * the year box as data-age until the plan's start age is known (renderTiming calls paintDbStart then).
 */
export function setDbStartFields(doc, settings, timing = null) {
  const s = settings || {};
  const yearEl = doc.getElementById('ssDbStartYear'), ageEl = doc.getElementById('ssDbStartAge');
  if (!yearEl) return;
  yearEl.value = +s.dbStartYear || 0;
  if (+s.dbStartAge > 0) yearEl.dataset.age = String(Math.round(+s.dbStartAge)); else delete yearEl.dataset.age;
  if (ageEl) ageEl.value = '';
  paintDbStart(doc, timing);
}

/** The words beside the box, and the age box filled from the saved start the first time the start age is known. */
export function paintDbStart(doc, timing = null) {
  const yearEl = doc.getElementById('ssDbStartYear'), ageEl = doc.getElementById('ssDbStartAge'), hint = doc.getElementById('ssDbStartHint');
  if (!yearEl) return null;
  const f = facts(doc, timing);
  if (ageEl && ageEl.value === '' && f.startAge > 0) {
    const saved = +yearEl.dataset.age > 0 ? +yearEl.dataset.age : f.startAge + (+yearEl.value || 0);
    ageEl.value = saved;
    const y = dbStartYearOfAge(saved, f.startAge);
    if (y != null) yearEl.value = y;
  }
  const year = ageEl && ageEl.value !== '' && f.startAge > 0 ? dbStartYearOfAge(ageEl.value, f.startAge) : (+yearEl.value || 0);
  const w = dbStartWords({ year, ...f });
  if (hint) { hint.textContent = w.text; hint.style.color = w.level === 'error' ? 'var(--danger, #ef4444)' : w.level === 'warn' ? 'var(--warning, #f59e0b)' : ''; }
  return { year, ...w };
}

/** The age box changed: derive the year the engines read, then say what it means. */
export function dbStartFromAgeInput(doc, timing = null) {
  const yearEl = doc.getElementById('ssDbStartYear'), ageEl = doc.getElementById('ssDbStartAge');
  if (!yearEl || !ageEl) return null;
  const startAge = dbStartAgeNow(doc, timing);
  const y = dbStartYearOfAge(ageEl.value, startAge);
  if (y != null) yearEl.value = y;
  delete yearEl.dataset.age;
  return paintDbStart(doc, timing);
}

/** Before Save: the problem to refuse on, or null. Nothing to check when no final-salary pension is entered. */
export function dbStartError(doc, timing = null) {
  const w = paintDbStart(doc, timing);
  return w && w.level === 'error' ? 'Final-salary pension start: ' + w.text : null;
}

/** The age for the saved settings (written beside the year). 0 when none. */
export function dbStartAgeForSave(doc) {
  const ageEl = doc.getElementById('ssDbStartAge');
  return ageEl && +ageEl.value > 0 ? Math.round(+ageEl.value) : 0;
}
