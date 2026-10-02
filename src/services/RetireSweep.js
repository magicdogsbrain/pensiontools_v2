/**
 * "When can I retire?" — the quick spin (6.10.0).
 *
 * For each candidate retirement age: project today's pension pot and contributions to that age (today's
 * money, at the holder's own mix when known, else the FCA middle band), then run the plan's strategy from
 * that age on the plan's income shape (or a flat income the user types), and read the chance the money lasts. Reads
 * as "at £40,000 a year you could retire at 61 and be on course: the money lasted in 92% of futures, or at 58 if lasting
 * in 3 futures out of 4 is enough" (6.22.0: "on course" = 9 in 10, OnCourse.js). Cheaper runs than the
 * full stress test (200 futures, every 6th history) — this is a compass, not the verdict.
 *
 * No DOM, no storage; runs in the engine worker.
 */
import { planFromSettings, stressTestStrategy } from '../strategies/stressTest.js';
import { createSimulationConfigFromSettings } from '../storage/StressRepository.js';
import { projectAccumulation, contributionBreakdown } from './AccumulationEngine.js';
import { proportions as holdingsProportions, pensionPotFromHoldings } from './Holdings.js';
import { holdingsLines } from './HoldingsRecord.js';
import { deriveTiming, taxYearLabel, isaProjectionOf } from './PlanTiming.js';
import { chargesPctOf, yearlyChargeFactor } from './Charges.js';
import { cashProjectionRate } from './IsaGrowth.js';
import { INFLATION_DEFAULTS } from '../constants.js';
import { ON_COURSE_PCT, confidenceWords } from './OnCourse.js';

const num = (v) => (Number.isFinite(+v) ? +v : 0);
export const NO_POT_MESSAGE = 'Record what you hold (or the pot today on the Accumulation planner) first — the spin projects from your own pension pot, never from the pots the strategy is tested on.';

/** Candidate ages: from next year to the later of 75 and the plan's own retirement age. */
export function candidateAges(currentAge, retireAge = null, { step = 1, max = 75, min = 55 } = {}) {
  const lo = Math.max(Math.floor(currentAge) + 1, min);
  const hi = Math.max(max, retireAge || 0);
  const out = []; for (let a = lo; a <= hi; a += step) out.push(a);
  return out;
}

/**
 * Pot at a candidate age in today's money — the same projection the Accumulation planner shows.
 * `holdings` is the holdings record (or its lines) — what the person holds; the pension pot is its
 * SIPP-wrapped total, else the Accumulation planner's "pot today", else null. Never the Stress settings'
 * equityMin/bondMin/cashTarget or taggedFunds: those are the pots a strategy is TESTED on (6.13.0).
 * @returns {{ potNow, totalMonthly, years, pot, low, high, basis }} — pot/low/high/basis null when no pot is on record
 */
export function potAtAge({ settings, accumulation, currentAge, age, holdings = null }) {
  const a = accumulation || {};
  const lines = holdingsLines(holdings);
  const prop = lines.length ? holdingsProportions(lines) : null;
  const fromLedger = pensionPotFromHoldings(lines);
  const potNow = fromLedger > 0 ? fromLedger : (num(a.potNow) > 0 ? num(a.potNow) : null);
  let totalMonthly = 0;
  try { if (num(a.netMonthly) > 0 || num(a.employerMonthly) > 0) totalMonthly = contributionBreakdown({ netMonthly: num(a.netMonthly), salary: num(a.salary), schemeType: a.schemeType || 'ras', employerMonthly: num(a.employerMonthly) }).totalMonthly || 0; } catch (e) { totalMonthly = 0; }
  if (!(totalMonthly > 0) && prop && prop.contributions.monthly > 0) totalMonthly = prop.contributions.monthly;
  const years = Math.max(0, age - currentAge);
  if (potNow == null) return { potNow: null, totalMonthly, years, pot: null, low: null, high: null, basis: null };
  // The plan's fund and platform charges (6.19.0) come off every line; on the "your mix" line they replace the
  // holdings' own fund charges (mixOcf), so fund costs are not taken twice. None on a plan without the setting.
  const rows = projectAccumulation({ currentAge: 0, retirementAge: years, potNow, totalMonthly, escalationPct: num(a.escalationPct), mixRealReturn: prop && prop.total > 0 ? prop.expectedReal : null,
    chargesPct: chargesPctOf(settings), mixOcf: prop && prop.total > 0 ? prop.weightedOcf : null });
  const last = rows[rows.length - 1];
  return { potNow, totalMonthly, years, pot: Math.round(last.potMix != null ? last.potMix : last.potMid), low: Math.round(last.potLow), high: Math.round(last.potHigh), basis: last.potMix != null ? 'your mix' : 'FCA middle band' };
}

/** The yearly rise after prices the spin has always grown an ISA at when the plan has no choice of how it grows (2%). */
const ISA_BEFORE_REAL = 0.02;

/**
 * The ISA at a candidate age in today's money, by how the plan's ISA grows (6.22.0, services/IsaGrowth.js;
 * PlanTiming.isaProjectionOf):
 *   - no choice (a plan locked before it): today's rule exactly — the ISA × 1.02^years × the charge, nothing paid in;
 *   - the ISA funds in the list of funds to test decide (the runs follow them): the same rule (6.21.0's figure), with what
 *     goes in each month on the same 2% a year after prices — never the choice hidden behind the funds' line;
 *   - 'cash' ("Mostly cash"): the cash rule at the planner's 2.5% prices (1.5% a year), less charges;
 *   - 'invested' ("Invested like my pension"): the pension's own line — its mix line when holdings are tagged (the plan's
 *     charge replacing the funds' own, as potAtAge does), else the FCA middle band.
 * With a choice, what goes into ISAs and savings each month (accumulation.isaMonthly) is paid in, rising with the
 * planner's "Raise contributions by".
 * @returns {{ isa: number, basis: null | 'cash' | 'your mix' | 'FCA middle band' }}   basis null: the rule used before the choice
 */
export function isaAtAge({ settings, accumulation, currentAge, age, holdings = null }) {
  const s = settings || {};
  const a = accumulation || {};
  const years = Math.max(0, age - currentAge);
  const isaNow = num(s.isaBalance) > 0 ? num(s.isaBalance) : 0;
  const pct = chargesPctOf(s);
  const how = isaProjectionOf(s);
  const isaMonthly = how.payIns && num(a.isaMonthly) > 0 ? num(a.isaMonthly) : 0;
  const common = { currentAge: 0, retirementAge: years, potNow: isaNow, totalMonthly: isaMonthly, escalationPct: num(a.escalationPct), chargesPct: pct };
  if (!how.kind) {
    const grown = isaNow > 0 ? isaNow * Math.pow(1 + ISA_BEFORE_REAL, years) * yearlyChargeFactor(pct, years) : 0;
    let paid = 0;
    if (isaMonthly > 0) {
      const rows = projectAccumulation({ ...common, potNow: 0, fixedNominal: (1 + ISA_BEFORE_REAL) * (1 + INFLATION_DEFAULTS.ASSUMED_CPI) - 1, assumedCpi: INFLATION_DEFAULTS.ASSUMED_CPI });
      paid = rows[rows.length - 1].potMid;
    }
    return { isa: isaNow > 0 || paid > 0 ? Math.round(grown + paid) : 0, basis: null };
  }
  if (how.kind === 'cash') {
    const rows = projectAccumulation({ ...common, fixedNominal: cashProjectionRate(INFLATION_DEFAULTS.ASSUMED_CPI) });
    return { isa: Math.round(rows[rows.length - 1].potMid), basis: 'cash' };
  }
  const lines = holdingsLines(holdings);
  const prop = lines.length ? holdingsProportions(lines) : null;
  const tagged = prop && prop.total > 0;
  const rows = projectAccumulation({ ...common, mixRealReturn: tagged ? prop.expectedReal : null, mixOcf: tagged ? prop.weightedOcf : null });
  const last = rows[rows.length - 1];
  return { isa: Math.round(last.potMix != null ? last.potMix : last.potMid), basis: last.potMix != null ? 'your mix' : 'FCA middle band' };
}

/**
 * The plan as if retiring at `age` — one row of the spin: a fresh saver's frame so the steps start at that age, and its
 * pots at retirement the projections above (the pension's and the ISA's). The runs start from these pots: with no ISA
 * today, the ISA at that age itself (PlanTiming.isaAtRetirementOf; review of 6.22.0).
 * @param {object} o { settings, accumulation, holdings, currentAge, age, timing (deriveTiming of the settings), incomeOverride }
 * @returns {{ s: object, pa: object, isa: number }}   the settings to run, potAtAge's result, the ISA at that age
 */
export function sweepPlanAt({ settings, accumulation = null, holdings = null, currentAge, age, timing, incomeOverride = null }) {
  const s0 = settings || {};
  const t0 = timing || deriveTiming(s0);
  const steps = Array.isArray(s0.incomeSteps) && s0.incomeSteps.length ? s0.incomeSteps : null;
  const income = incomeOverride > 0 ? incomeOverride : (steps ? num(steps[0].amount) : num(s0.baseSalary));
  const pa = potAtAge({ settings: s0, accumulation, holdings, currentAge, age });
  const isa = isaAtAge({ settings: s0, accumulation, currentAge, age, holdings }).isa;
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
 * @param {object} o { settings, accumulation, holdings (the holdings record or its lines), ages?, incomeOverride? (flat £/yr gross),
 *                     mcRuns=200, stride=6, onProgress(i, n, age), now }
 * @returns {{ rows: [{ age, taxYear, yearsAway, pot, low, high, success, coverage, ruin, worst12, affordable }], income, basis, target }}
 */
export function sweepRetirementAges({ settings, accumulation = null, holdings = null, ages = null, incomeOverride = null, mcRuns = 200, stride = 6, onProgress = null, now = new Date() } = {}) {
  const s0 = settings || {};
  const t0 = deriveTiming(s0, now);
  const currentAge = t0.currentAge || Math.floor(num(s0.currentAge)) || 0;
  if (!(currentAge > 0)) return { rows: [], income: null, basis: null, error: 'Enter your age today in the Timing block first.' };
  const list = ages || candidateAges(currentAge, t0.retireAge);
  const steps = Array.isArray(s0.incomeSteps) && s0.incomeSteps.length ? s0.incomeSteps : null;
  const income = incomeOverride > 0 ? incomeOverride : (steps ? num(steps[0].amount) : num(s0.baseSalary));
  // No pot on record → nothing to project from. Say so rather than spin on the tested pots.
  if (list.length && potAtAge({ settings: s0, accumulation, holdings, currentAge, age: list[0] }).potNow == null) return { rows: [], income, basis: null, currentAge, error: NO_POT_MESSAGE };
  const rows = [];
  let basis = null;
  list.forEach((age, i) => {
    if (onProgress) { try { onProgress(i, list.length, age); } catch (e) { /* progress is optional */ } }
    // The plan as if retiring at `age`: a fresh saver's frame so the steps start at that age.
    const { s, pa } = sweepPlanAt({ settings: s0, accumulation, holdings, currentAge, age, timing: t0, incomeOverride });
    basis = pa.basis;
    const yearsToAge = Math.max(0, age - currentAge);
    let r = null, affordable = true;
    try {
      const cfg = createSimulationConfigFromSettings({}, s);
      const p = planFromSettings(s, cfg, { now });   // one clock for the timing, the plan and the ladder pricing
      p.mcRuns = mcRuns; p.stride = stride;
      r = stressTestStrategy(s0.strategyId || 'pots-and-valves', p);
      affordable = r.affordable !== false;
    } catch (e) { r = null; }
    const success = r && affordable ? Math.round(100 - num(r.ruin?.mc)) : (r ? 0 : null);
    rows.push({ age, taxYear: taxYearLabel(now.getFullYear() + yearsToAge - (now.getMonth() < 3 ? 1 : 0)), yearsAway: yearsToAge, pot: pa.pot, low: pa.low, high: pa.high,
      success, coverage: r && affordable ? Math.round(num(r.coverage ?? success)) : null, ruin: r ? num(r.ruin?.mc) : null, worst12: r && affordable ? Math.round(num(r.worst12?.min)) : null, affordable, reason: r && !affordable ? (r.reason || 'not affordable') : null });
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
export function sweepHeadline(result, target = ON_COURSE_PCT) {
  if (!result || !result.rows.length) return result?.error || 'Nothing to say yet.';
  const gbp = (v) => '£' + Math.round(v).toLocaleString('en-GB');
  const e = earliestAt(result.rows, target);
  const e75 = earliestAt(result.rows, 75);
  const bar = target === ON_COURSE_PCT;
  let s = 'At ' + gbp(result.income) + ' a year';
  if (e && e.met) s += ' you could retire at ' + e.age + (bar ? ' and be on course' : '') + ': the money lasted in ' + e.success + '% of futures' + (bar ? '' : ' (you asked for ' + target + '%)');
  else if (e) s += bar ? ' no age in the range is on course (the money lasting ' + confidenceWords(target) + ') — the best is ' + e.age + ' at ' + e.success + '%'
    : ' no age in the range reaches ' + target + '% — the best is ' + e.age + ' at ' + e.success + '%';
  if (e75 && e75.met && (!e || !e.met || e75.age < e.age)) s += (e && e.met ? ', or at ' + e75.age + ' if lasting ' + confidenceWords(75) + ' is enough (' : '; at ' + e75.age + ' it lasted ' + confidenceWords(75) + ' (') + e75.success + '%)';
  return s + '. Pots projected at ' + (result.basis || 'the middle band') + ', today\'s money; ' + 'a compass, not the full stress test.';
}
