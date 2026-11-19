/**
 * The income a plan pays, step by step (lead4.md D6; step F2): ONE reader, given (plan, ctx), for every place either view
 * says what an income step takes before tax and what reaches the bank a month.
 *
 * A step is stored once, as the engines read it: a year "before tax" counted as if every pound were taxed (the gross-up of
 * what is wanted after tax). What a person reads is:
 *   beforeTax       what is TAKEN in that year before tax (services/BeforeTax.js takenOfTarget): with a quarter of each
 *                   pension payment tax-free (the plan's access method) less is taken for the same income; the income that
 *                   comes in anyway that year (State Pension, final-salary, other) is counted as it is
 *   monthAfterTax   what reaches the bank a month: the stored figure after tax on the plan's own bands, over twelve
 *
 * Bands: a locked plan's are its document's (assumptions.pa/brl/hrl), every other plan's its own settings' (about.js
 * bandsOf: the planner's defaults only where a key is missing). Never the page's boxes, never DEFAULT_TAX_BANDS on a box.
 *
 *   incomeStepsOf(plan, ctx) → { steps: [{ fromAge, stored, beforeTax, monthAfterTax, taxYear, decline, glideToNext }],
 *                                bands, access, locked }
 *     the steps as the plan reads them today (the step in force and the later ones, from the plan's own start: spend.js
 *     stepLines; a locked plan's are its document's)
 *   stepFiguresOf(stored, { settings, bands, fixed }) → { beforeTax, monthAfterTax }
 *     the two figures of one stored step: what the simple view's spend page draws for the rows as typed, and what
 *     incomeStepsOf gives for the rows as saved (the same function, so a step says one figure until it is changed)
 *   fixedAtAge(plan, ctx, age)  the income that comes in anyway in the plan year of that age (spend.js guaranteedAtYear on
 *                               the plan's settings and timing: the document's timing when locked)
 *
 * Pure (the settings are read once, by PlanReading, on ctx.now).
 */
import { takenOfTarget, taxFreeShareOf } from '../services/BeforeTax.js';
import { bandsOf, netOf, safeTiming } from '../answers/plan/about.js';
import { stepLines, guaranteedAtYear } from '../answers/plan/spend.js';
import { taxYearLabel } from '../services/PlanTiming.js';
import { settingsOf } from './money.js';
import { accessOf } from './access.js';

const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const num = (v) => (v == null || v === '' || !Number.isFinite(+v) ? null : +v);
const r0 = (v) => Math.round(+v || 0);
const nowOf = (ctx) => (ctx && ctx.now instanceof Date ? ctx.now : new Date());
const isLocked = (plan) => !!(plan && plan.decisionTool && plan.decisionTool.settings && plan.decisionTool.settings.locked);

/** The bands a plan's figures are taxed on: a locked plan's document's, else the plan's own. */
export function bandsFor(plan, ctx = {}) {
  const doc = isLocked(plan) && plan.planDocument && isObj(plan.planDocument.assumptions) ? plan.planDocument.assumptions : null;
  return bandsOf(doc && num(doc.pa) != null ? doc : settingsOf(plan, ctx));
}

/** The plan's timing as its figures read it: the document's when locked (its start age and first tax year), else derived. */
function timingFor(plan, ss, now) {
  let timing = safeTiming(ss, now);
  const doc = isLocked(plan) && plan.planDocument && isObj(plan.planDocument.timing) ? plan.planDocument.timing : null;
  if (doc) timing = { ...timing, mode: doc.mode || timing.mode, firstTaxYear: num(doc.firstTaxYear) || timing.firstTaxYear, shapeAgeNow: num(doc.shapeAgeNow) || timing.shapeAgeNow, startMonth: doc.startMonth || timing.startMonth };
  return timing;
}

export function fixedAtAge(plan, ctx, age) {
  const ss = settingsOf(plan, ctx);
  const now = nowOf(ctx);
  const timing = timingFor(plan, ss, now);
  const ageNow = num(timing.shapeAgeNow);
  if (ageNow == null || num(age) == null) return 0;
  try { return guaranteedAtYear(ss, timing, ageNow, Math.max(0, +age - ageNow), now); } catch { return 0; }
}

export function stepFiguresOf(stored, { settings = {}, bands, fixed = 0 } = {}) {
  const b = bands || bandsOf(settings);
  return { beforeTax: takenOfTarget(+stored || 0, settings, { fixed: +fixed || 0, bands: b }), monthAfterTax: Math.round(netOf(+stored || 0, b) / 12) };
}

/** The steps as stored and read today: a locked plan's document's, else the settings' (from the plan's own start). */
function storedSteps(plan, ss, timing) {
  const doc = isLocked(plan) ? plan.planDocument : null;
  if (doc && Array.isArray(doc.steps) && doc.steps.length) return doc.steps.map((s) => ({ fromAge: num(s.fromAge), amount: r0(s.amount), taxYear: s.taxYear || null, decline: +s.decline || 0, glideToNext: !!s.glideToNext }));
  const ageNow = num(timing.shapeAgeNow) || num(ss.shapeAgeNow) || null;
  if (ss.incomeShape === 'phases' && Array.isArray(ss.incomeSteps) && ss.incomeSteps.length) {
    const shown = ageNow ? stepLines(ss.incomeSteps, ageNow, num(ss.duration) || 1, bandsOf(ss)) : [];
    if (shown.length) return shown.map((st) => ({ fromAge: st.fromAge, amount: r0(st.yearly), taxYear: null, decline: st.then === 'falls' ? +st.fallsPct || 0 : 0, glideToNext: st.then === 'glides' }));
    return ss.incomeSteps.filter((s) => s && num(s.amount) != null).map((s) => ({ fromAge: num(s.fromAge), amount: r0(s.amount), taxYear: null, decline: +s.decline || 0, glideToNext: !!s.glideToNext }));
  }
  const first = Array.isArray(ss.targetSchedule) && ss.targetSchedule.length ? r0(ss.targetSchedule[0]) : r0(ss.baseSalary);
  return [{ fromAge: ageNow, amount: first, taxYear: null, decline: 0, glideToNext: false }];
}

export function incomeStepsOf(plan, ctx = {}) {
  const ss = settingsOf(plan, ctx);
  const now = nowOf(ctx);
  const timing = timingFor(plan, ss, now);
  const bands = bandsFor(plan, ctx);
  const ageNow = num(timing.shapeAgeNow);
  const access = accessOf(plan, ctx);
  const settings = { ...ss, accessMethod: access.method };
  // (a plan whose income is not set still reads the planner's figure, as every page did before: D2 for the income is step W's)
  const steps = storedSteps(plan, ss, timing).map((s) => {
    let fixed = 0;
    if (ageNow != null && s.fromAge != null) { try { fixed = guaranteedAtYear(ss, timing, ageNow, Math.max(0, s.fromAge - ageNow), now); } catch { fixed = 0; } }
    const f = stepFiguresOf(s.amount, { settings, bands, fixed });
    const taxYear = s.taxYear || (ageNow != null && s.fromAge != null && num(timing.firstTaxYear) ? taxYearLabel(timing.firstTaxYear + (s.fromAge - ageNow)) : null);
    return { fromAge: s.fromAge, stored: s.amount, beforeTax: f.beforeTax, monthAfterTax: f.monthAfterTax, taxYear, decline: s.decline, glideToNext: s.glideToNext };
  });
  return { steps, bands, access, locked: isLocked(plan), taxFreeShare: taxFreeShareOf(settings) };
}
