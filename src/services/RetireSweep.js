/**
 * "When can I retire?" — the quick spin (6.10.0).
 *
 * For each candidate retirement age: the pots at that age from the plan's own saving lives (today's money; the one model of
 * the pot at the stop, step F1), then run the plan's strategy from
 * that age on the plan's income shape (or a flat income the user types), and read the chance the money lasts. Reads
 * as "at £40,000 a year you could retire at 61 and be on course: the money lasted in 92% of futures, or at 58 if lasting
 * in 3 futures out of 4 is enough" (6.22.0: "on course" = 9 in 10, OnCourse.js). Each age is judged on the ONE engine
 * plan (src/reading/gather.js enginePlanOf, lead4.md R5/R6): a bought way priced on the one market's real-yield curve, the
 * plan's own futures (RUN_FUTURES) and histories — the same run, age by age, as the plan's own test.
 *
 * No DOM, no storage; runs in the engine worker.
 */
import { stressTestStrategy } from '../strategies/stressTest.js';
import { enginePlanOf } from '../reading/gather.js';
import { savingPathAt } from './PotsAtStop.js';
import { deriveTiming, taxYearLabel } from './PlanTiming.js';
import { ON_COURSE_PCT, confidenceWords } from './OnCourse.js';
import { pctText } from './OneAnswer.js';
import { SUCCESS } from '../answers/shared/rules.js';

const num = (v) => (Number.isFinite(+v) ? +v : 0);
// The pot today first, what you hold second (research/saving-enough-and-check-in.md 4.6): a saver needs only the one figure.
export const NO_POT_MESSAGE = 'Type your pension pot today above first (or record what you hold) — the spin projects from your own pension pot, never from the pots the strategy is tested on.';

/** Candidate ages: from next year to the later of 75 and the plan's own retirement age. */
export function candidateAges(currentAge, retireAge = null, { step = 1, max = 75, min = 55 } = {}) {
  const lo = Math.max(Math.floor(currentAge) + 1, min);
  const hi = Math.max(max, retireAge || 0);
  const out = []; for (let a = lo; a <= hi; a += step) out.push(a);
  return out;
}

/**
 * The pots at a candidate age, in today's money (step F1, lead4.md D4): the one model — the plan's saving lives to that age
 * (services/PotsAtStop.js savingPathAt, the same lives, seed and mixes as the plan's own pot at the stop), the pension's
 * middle with its bad and good cases, and the ISA's middle. `inputs` is PotsAtStop.savingInputsOf(plan, settings): the
 * plan's own pension and ISA today and what goes into each — never a box of a form.
 * @returns {{ potNow, totalMonthly, years, pot, low, high, isa, basis }} — pot/low/high/isa null when no pension is known
 */
export function potAtAge({ settings, inputs, currentAge, age, now = new Date() }) {
  const i = inputs || {};
  const x = i.explicit || {};
  const years = Math.max(0, age - currentAge);
  if (!i.potKnown || x.potNow == null) return { potNow: null, totalMonthly: num(x.totalMonthly), years, pot: null, low: null, high: null, isa: null, basis: null };
  const path = savingPathAt({ settings, timing: { mode: 'future', currentAge, shapeAgeNow: age }, accumulation: i.accumulation || {}, holdings: i.holdings || null, phases: i.phases || null, explicit: x, now });
  const rows = path && Array.isArray(path.path) ? path.path : [];
  const last = rows.length ? rows[rows.length - 1] : null;
  if (!last) return { potNow: x.potNow, totalMonthly: num(x.totalMonthly), years, pot: null, low: null, high: null, isa: null, basis: null };
  return { potNow: x.potNow, totalMonthly: num(x.totalMonthly), years, pot: Math.round(last.pension.real), low: Math.round(last.pension.realCareful), high: Math.round(last.pension.realGood), isa: Math.round(last.isa.real), basis: SAVING_BASIS };
}

/** How the spin's pots are worked out, in its own words. */
export const SAVING_BASIS = 'the middle of the same futures every test of your plan uses';

/**
 * The plan as if retiring at `age` — one row of the spin: a fresh saver's frame so the steps start at that age, and its
 * pots at retirement the projections above (the pension's and the ISA's). The runs start from these pots: with no ISA
 * today, the ISA at that age itself (PlanTiming.isaAtRetirementOf; review of 6.22.0).
 * @param {object} o { settings, inputs (PotsAtStop.savingInputsOf), currentAge, age, timing (deriveTiming of the settings), incomeOverride, now }
 * @returns {{ s: object, pa: object, isa: number }}   the settings to run, potAtAge's result, the ISA at that age
 */
export function sweepPlanAt({ settings, inputs = null, currentAge, age, timing, incomeOverride = null, now = new Date() }) {
  const s0 = settings || {};
  const t0 = timing || deriveTiming(s0);
  const steps = Array.isArray(s0.incomeSteps) && s0.incomeSteps.length ? s0.incomeSteps : null;
  const income = incomeOverride > 0 ? incomeOverride : (steps ? num(steps[0].amount) : num(s0.baseSalary));
  const pa = potAtAge({ settings: s0, inputs, currentAge, age, now });
  const isa = pa.isa || 0;
  const endAge = t0.shapeAgeNow + Math.max(1, num(s0.duration) || 35) - 1;
  const duration = Math.max(5, Math.min(45, endAge - age + 1));
  const stepsAt = incomeOverride > 0 ? [{ fromAge: age, amount: incomeOverride }]
    : steps ? steps.map((st, k) => ({ ...st, fromAge: k === 0 ? age : Math.max(age + 1, num(st.fromAge) + (age - (t0.shapeAgeNow || num(steps[0].fromAge)))) })) : [{ fromAge: age, amount: income }];
  const s = { ...s0, retired: false, retireAge: age, firstTaxYear: null, shapeAgeNow: age, duration, incomeShape: 'phases', incomeSteps: stepsAt, targetSchedule: null,
    potAtRetirement: { sipp: pa.pot, isa, source: 'sweep' },
    strategyParams: { ...(s0.strategyParams || {}), sippTotal: undefined, isaTotal: undefined } };
  return { s, pa, isa };
}

/**
 * Run the sweep.
 * @param {object} o { settings, inputs (PotsAtStop.savingInputsOf of the plan), ages?, incomeOverride? (flat £/yr gross),
 *                     onProgress(i, n, age), now }
 * @returns {{ rows: [{ age, taxYear, yearsAway, pot, low, high, success, coverage, ruin, worst12, affordable }], income, basis, target }}
 */
export function sweepRetirementAges({ settings, inputs = null, ages = null, incomeOverride = null, onProgress = null, now = new Date() } = {}) {
  const s0 = settings || {};
  const t0 = deriveTiming(s0, now);
  const currentAge = t0.currentAge || Math.floor(num(s0.currentAge)) || 0;
  if (!(currentAge > 0)) return { rows: [], income: null, basis: null, error: 'Enter your age today in the Timing block first.' };
  const list = ages || candidateAges(currentAge, t0.retireAge);
  const steps = Array.isArray(s0.incomeSteps) && s0.incomeSteps.length ? s0.incomeSteps : null;
  const income = incomeOverride > 0 ? incomeOverride : (steps ? num(steps[0].amount) : num(s0.baseSalary));
  // No pot on record → nothing to project from. Say so rather than spin on the tested pots.
  if (list.length && potAtAge({ settings: s0, inputs, currentAge, age: list[0], now }).potNow == null) return { rows: [], income, basis: null, currentAge, error: NO_POT_MESSAGE };
  const rows = [];
  let basis = null;
  list.forEach((age, i) => {
    if (onProgress) { try { onProgress(i, list.length, age); } catch (e) { /* progress is optional */ } }
    // The plan as if retiring at `age`: a fresh saver's frame so the steps start at that age.
    const { s, pa } = sweepPlanAt({ settings: s0, inputs, currentAge, age, timing: t0, incomeOverride, now });
    basis = pa.basis;
    const yearsToAge = Math.max(0, age - currentAge);
    let r = null, affordable = true;
    try {
      // the one engine plan: one clock for the timing, the config and the plan; the one market's curve for a bought way
      const p = enginePlanOf({ settings: s, now: now.toISOString() });
      r = stressTestStrategy(s0.strategyId || 'pots-and-valves', p);
      affordable = r.affordable !== false;
    } catch (e) { r = null; }
    // Unrounded (6.33.0): 89.6% rounded to 90 read as on course; the words round with pctText, never across the bar.
    const success = r && affordable ? Math.max(0, Math.min(100, 100 - num(r.ruin?.mc))) : (r ? 0 : null);
    rows.push({ age, taxYear: taxYearLabel(now.getFullYear() + yearsToAge - (now.getMonth() < 3 ? 1 : 0)), yearsAway: yearsToAge, pot: pa.pot, low: pa.low, high: pa.high,
      success, coverage: r && affordable ? num(r.coverage ?? success) : null, ruin: r ? num(r.ruin?.mc) : null, worst12: r && affordable ? Math.round(num(r.worst12?.min)) : null, affordable, reason: r && !affordable ? (r.reason || 'not affordable') : null });
  });
  return { rows, income, basis, currentAge };
}

/** The earliest age whose chance of lasting reaches the target (and the best age if none does). Default: on course, 9 in 10. */
export function earliestAt(rows, target = ON_COURSE_PCT) {
  const ok = (rows || []).filter((r) => r.success != null && r.success >= target);
  if (ok.length) return { age: ok[0].age, success: ok[0].success, met: true };
  const best = (rows || []).filter((r) => r.success != null).sort((a, b) => b.success - a.success)[0];
  return best ? { age: best.age, success: best.success, met: false } : null;
}

/**
 * Plain-English headline. At the default bar (6.22.0, OnCourse.js) it says "on course": the money lasted in 9 futures out
 * of 10; another bar picked in the spin is named as asked for. An earlier age where it lasts in 3 futures out of 4 is
 * offered beside it.
 */
export function sweepHeadline(result, target = ON_COURSE_PCT, { weighted = SUCCESS.weighted } = {}) {
  if (!result || !result.rows.length) return result?.error || 'Nothing to say yet.';
  const gbp = (v) => '£' + Math.round(v).toLocaleString('en-GB');
  const e = earliestAt(result.rows, target);
  const e75 = earliestAt(result.rows, 75);
  // 7.8.0: while the figures are weighed by how long people live, "on course" is the level's test ("Am I on course?"),
  // never this count: the spin says its count and no "on course"
  const bar = target === ON_COURSE_PCT && !weighted;
  const plain = target === ON_COURSE_PCT && weighted;   // the default bar, said as the count it is
  let s = 'At ' + gbp(result.income) + ' a year';
  if (e && e.met) s += ' you could retire at ' + e.age + (bar ? ' and be on course' : '') + ': the money lasted in ' + pctText(e.success, 0, [target, 75]) + ' of futures' + (bar || plain ? '' : ' (you asked for ' + target + '%)');
  else if (e) s += bar ? ' no age in the range is on course (the money lasting ' + confidenceWords(target) + ') — the best is ' + e.age + ' at ' + pctText(e.success, 0, [target, 75])
    : plain ? ' no age in the range lasts ' + confidenceWords(target) + ' — the best is ' + e.age + ' at ' + pctText(e.success, 0, [target, 75])
      : ' no age in the range reaches ' + target + '% — the best is ' + e.age + ' at ' + pctText(e.success, 0, [target, 75]);
  if (e75 && e75.met && (!e || !e.met || e75.age < e.age)) s += (e && e.met ? ', or at ' + e75.age + ' if lasting ' + confidenceWords(75) + ' is enough (' : '; at ' + e75.age + ' it lasted ' + confidenceWords(75) + ' (') + pctText(e75.success, 0, [75, target]) + ')';
  return s + '. Pots projected at ' + (result.basis || 'the middle band') + ', today\'s money; ' + 'a compass, not the full stress test.';
}
