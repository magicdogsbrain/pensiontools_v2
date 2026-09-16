/**
 * "When can I retire?" — the quick spin (6.10.0).
 *
 * For each candidate retirement age: project today's pension pot and contributions to that age (today's
 * money, at the holder's own mix when known, else the FCA middle band), then run the plan's strategy from
 * that age on the plan's income shape (or a flat income the user types), and read the confidence. Reads as
 * "at £40,000 a year you could retire at 61 with 90% confidence, at 58 with 75%". Cheaper runs than the
 * full stress test (200 futures, every 6th history) — this is a compass, not the verdict.
 *
 * No DOM, no storage; runs in the engine worker.
 */
import { planFromSettings, stressTestStrategy } from '../strategies/stressTest.js';
import { createSimulationConfigFromSettings } from '../storage/StressRepository.js';
import { projectAccumulation, contributionBreakdown } from './AccumulationEngine.js';
import { proportions as holdingsProportions, pensionPotFromHoldings } from './Holdings.js';
import { holdingsLines } from './HoldingsRecord.js';
import { deriveTiming, taxYearLabel } from './PlanTiming.js';

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
  const rows = projectAccumulation({ currentAge: 0, retirementAge: years, potNow, totalMonthly, escalationPct: num(a.escalationPct), mixRealReturn: prop && prop.total > 0 ? prop.expectedReal : null });
  const last = rows[rows.length - 1];
  return { potNow, totalMonthly, years, pot: Math.round(last.potMix != null ? last.potMix : last.potMid), low: Math.round(last.potLow), high: Math.round(last.potHigh), basis: last.potMix != null ? 'your mix' : 'FCA middle band' };
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
    const pa = potAtAge({ settings: s0, accumulation, holdings, currentAge, age });
    basis = pa.basis;
    // The plan as if retiring at `age`: a fresh saver's frame so the steps start at that age.
    const yearsToAge = Math.max(0, age - currentAge);
    const endAge = t0.shapeAgeNow + Math.max(1, num(s0.duration) || 35) - 1;
    const duration = Math.max(5, Math.min(45, endAge - age + 1));
    const stepsAt = incomeOverride > 0 ? [{ fromAge: age, amount: incomeOverride }]
      : steps ? steps.map((st, k) => ({ ...st, fromAge: k === 0 ? age : Math.max(age + 1, num(st.fromAge) + (age - (t0.shapeAgeNow || num(steps[0].fromAge)))) })) : [{ fromAge: age, amount: income }];
    const s = { ...s0, retired: false, retireAge: age, firstTaxYear: null, shapeAgeNow: age, duration, incomeShape: 'phases', incomeSteps: stepsAt, targetSchedule: null,
      potAtRetirement: { sipp: pa.pot, isa: num(s0.isaBalance) > 0 ? Math.round(num(s0.isaBalance) * Math.pow(1.02, yearsToAge)) : 0, source: 'sweep' },
      strategyParams: { ...(s0.strategyParams || {}), sippTotal: undefined, isaTotal: undefined } };
    let r = null, affordable = true;
    try {
      const cfg = createSimulationConfigFromSettings({}, s);
      const p = planFromSettings(s, cfg, {});
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

/** The earliest age whose confidence clears the target (and the best age if none does). */
export function earliestAt(rows, target = 90) {
  const ok = (rows || []).filter((r) => r.success != null && r.success >= target);
  if (ok.length) return { age: ok[0].age, success: ok[0].success, met: true };
  const best = (rows || []).filter((r) => r.success != null).sort((a, b) => b.success - a.success)[0];
  return best ? { age: best.age, success: best.success, met: false } : null;
}

/** Plain-English headline. */
export function sweepHeadline(result, target = 90) {
  if (!result || !result.rows.length) return result?.error || 'Nothing to say yet.';
  const gbp = (v) => '£' + Math.round(v).toLocaleString('en-GB');
  const e = earliestAt(result.rows, target);
  const e75 = earliestAt(result.rows, 75);
  let s = 'At ' + gbp(result.income) + ' a year';
  if (e && e.met) s += ' you could retire at ' + e.age + ' with ' + e.success + '% confidence';
  else if (e) s += ' no age in the range reaches ' + target + '% — the best is ' + e.age + ' at ' + e.success + '%';
  if (e75 && e75.met && (!e || !e.met || e75.age < e.age)) s += (e && e.met ? ', or at ' : '; ') + e75.age + ' with ' + e75.success + '%';
  return s + '. Pots projected at ' + (result.basis || 'the middle band') + ', today\'s money; ' + 'a compass, not the full stress test.';
}
