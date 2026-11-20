/**
 * The full view's income steps (step F2, lead4.md D6, R3): each step's box asks what the simple view's spend page asks —
 * a month after tax — and holds the stored step through the simple view's own two conversions (answers/plan/spend.js
 * monthlyNet / yearlyGross, on the plan's own bands), so a figure typed in either view reads back the same in the other.
 * The line under the shape is the ONE reader's (src/reading/income.js), from the plan as saved.
 *
 *   stepBoxValue(amount, bands)        the box's figure for a stored step: a month after tax ('' for none)
 *   stepFromBox(stored, typed, bands)  the stored step for what is typed: the stored figure kept while the box still says
 *                                      what it showed (no rounding drift), else the year before tax that pays it
 *   firstStepNoteOfPlan(plan, now)     the line under the shape: the reading's first step and how the tax-free part is taken
 *                                      ("No income set yet: ..." when nobody gave the plan an income)
 *   spLineOfPlan(plan, now)            the line under the State Pension boxes: { html, assumed }
 */
import { monthlyNet, yearlyGross } from '../answers/plan/spend.js';
import { incomeStepsOf } from '../reading/income.js';
import { contextFor } from '../reading/context.js';
import { firstStepNoteHtml } from './plannerWords.js';
import { accessOf, accessAssumedWords } from '../reading/access.js';
import { statePensionOf, spLineHtml } from '../reading/statePension.js';
import { SPEND } from '../v7/copy/spend.js';

export { bandsOf as planBandsOf } from '../answers/plan/about.js';

export function stepBoxValue(amount, bands) {
  const a = +amount;
  return amount === '' || amount == null || !Number.isFinite(a) || a <= 0 ? '' : monthlyNet(a, bands);
}

export function stepFromBox(stored, typed, bands) {
  const t = String(typed == null ? '' : typed).trim();
  if (t === '') return '';
  const m = +t;
  if (!Number.isFinite(m) || m < 0) return stored;
  if (+stored > 0 && monthlyNet(+stored, bands) === Math.round(m)) return +stored;
  return yearlyGross(m, bands);
}

export function firstStepNoteOfPlan(plan, now) {
  if (!plan) return '';
  let read = null;
  try { read = incomeStepsOf(plan, contextFor(plan, { now })); } catch { read = null; }
  if (read && read.notSet) return SPEND.derived.notSet;   // nobody gave the plan an income: the simple spend page's words
  if (!read || !read.steps.length) return '';
  return firstStepNoteHtml(read.steps[0], { access: read.access });
}

/** The plan document's income steps as the one reader reads them (a locked plan's are its document's): null when none. */
export function documentStepsOf(plan, now, doc = null) {
  if (!plan) return null;
  // only the plan's own current document: an archived version is said as it was locked
  if (doc && JSON.stringify((plan.planDocument || {}).steps || null) !== JSON.stringify(doc.steps || null)) return null;
  try { const r = incomeStepsOf(plan, contextFor(plan, { now })); return r.locked && r.steps.length ? r.steps : null; } catch { return null; }
}

/** "We assumed …" beside the access choice when the plan holds none (src/reading/access.js); '' once chosen or locked. */
export function accessAssumedNoteOf(plan) {
  if (!plan) return '';
  const a = accessOf(plan);
  const locked = !!(plan.decisionTool && plan.decisionTool.settings && plan.decisionTool.settings.locked);
  return a.chosen || locked ? '' : accessAssumedWords(a.method);
}

/**
 * The line under the State Pension boxes (src/reading/statePension.js spLineHtml): the State Pension the plan counts in the
 * simple income page's words, marked; "We assumed … Change it: …" when nothing was entered. { html, assumed }.
 */
export function spLineOfPlan(plan, now) {
  if (!plan) return { html: '', assumed: false };
  const ctx = contextFor(plan, { now });
  return { html: spLineHtml(plan, ctx), assumed: statePensionOf(plan, ctx).assumed };
}
