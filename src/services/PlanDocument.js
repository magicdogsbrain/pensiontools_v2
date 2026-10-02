/**
 * Plan Document — the plan as it was when it was locked, kept as a historical yardstick.
 *
 * Built once at lock time (or on demand for a plan locked earlier) from the saved Stress settings,
 * the plan object the engines run (`planFromSettings`) and the strategy result (`stressTestStrategy`).
 * Plain JSON only: no functions, no samples (they are re-drawable but big), so it fits in the
 * scenario document and can be re-rendered and printed years later even if the engine has moved on.
 * `whereAmI` reads the document against today's date, the recorded months and the pots, and says
 * where in the plan the user stands.
 *
 * Pure module: no DOM, no storage.
 */
import { deriveTiming, describeTiming, taxYearLabel, taxYearKey, planYearOf, taxYearStartOf } from './PlanTiming.js';
import { cleanSteps, amountAtAge } from './IncomeSchedule.js';
import { spSimConfigFromSettings } from '../utils/StatePensionUtils.js';
import { incomeLayersRows } from '../ui/incomeLayersGraphic.js';
import { targetMixForYear, equityGlideFromRisk } from './GlidepathService.js';
import { projectAccumulation, potOnPath, contributionBreakdown } from './AccumulationEngine.js';
import { chargesPctOf } from './Charges.js';
import { proportions as holdingsProportions, pensionPotFromHoldings } from './Holdings.js';
import { holdingsLines, normaliseHoldings, normaliseWrapper, numOrNull } from './HoldingsRecord.js';
import { cleanParams } from './StrategyState.js';
import { GIA_DEFAULTS } from './TaxableSleeve.js';
import { ENGINE_VERSION } from '../strategies/version.js';
import { VERSION } from '../constants.js';

// 2 (6.13.0): `holdingsAtLock` — what the person held when the plan was locked, from the holdings record —
// for every strategy; the accumulation path projects from the holdings record or the recorded pot today,
// never from the pots the strategy was tested on.
export const PLAN_DOCUMENT_VERSION = 2;
export const CONTRACT_STRATEGIES = ['full-il-gilt', 'gilt-rotation', 'floor-the-schedule'];
export const DECISION_ASSUMED_CPI_FOR_RECORD = 0.04;   // = PlanLock.PLAN_OF_RECORD_CPI (not imported: PlanLock pulls in the repositories)

/** JSON-safe deep copy: functions and undefined dropped, NaN/Infinity → null. */
export function plainClone(v) {
  return v === undefined ? undefined : JSON.parse(JSON.stringify(v, (k, x) => (typeof x === 'function' ? undefined : (typeof x === 'number' && !Number.isFinite(x)) ? null : x)));
}

/** The strategy result without the bulky/transient parts; still renders through strategyResultCard. */
export function trimResult(r) {
  if (!r) return null;
  const { samples, survivedMc, configs, ...rest } = r;
  return plainClone({ ...rest, configs: {} });
}

/** The plan object without its function-valued fields. */
export function trimPlan(p) {
  if (!p) return null;
  const { pnvCfg, yieldForYear, now, ...rest } = p;   // `now` is a test/replay clock (planFromSettings { now }), never part of the saved plan
  return plainClone(rest);
}

/** Slope wording for a step (mirrors the settings editor). */
export function slopeLabel(st, hasNext) {
  if (st.glideToNext && hasNext) return 'glides to the next step';
  const d = +st.decline || 0;
  return d > 0 ? '−' + d + '% a year (real)' : 'level within the step';
}

/**
 * The income-shape layers from SETTINGS (not the form): what `incomeStaircaseSvg` needs, plus the
 * guaranteed floor per plan year. Twin of the on-form assembly in renderIncomeShapePreview.
 */
export function shapeLayersFromSettings(settings, timing = deriveTiming(settings), { budgetGross = 0, essentials = 0, now } = {}) {
  const s = settings || {};
  const ageNow = timing.shapeAgeNow || +s.shapeAgeNow || 57;
  const dur = Math.max(1, +s.duration || 35);
  const steps = cleanSteps(Array.isArray(s.incomeSteps) && s.incomeSteps.length ? s.incomeSteps : (s.baseSalary > 0 ? [{ fromAge: ageNow, amount: +s.baseSalary }] : []));
  let sp = null;
  const wk = +s.spWeeklyAmount || 0;
  if (wk > 0 && s.spStartDate) {
    const cfg = spSimConfigFromSettings({ ...s, shapeAgeNow: ageNow, firstTaxYear: timing.firstTaxYear }, now);   // undefined → today
    if (cfg) sp = { annual: wk * 52, fromAge: ageNow + cfg.spStartYear, firstYearRatio: cfg.spFirstYearRatio ?? 1 };
  }
  const other = [];
  if (+s.other > 0) other.push({ annual: +s.other, fromAge: 0, toAge: 999, label: 'other income' });
  if (+s.dbAmount > 0) other.push({ annual: +s.dbAmount, fromAge: ageNow + (+s.dbStartYear || 0), toAge: 999, label: 'DB pension' });
  for (const r of (Array.isArray(s.extraIncomes) ? s.extraIncomes : [])) if (r && +r.annual > 0) other.push({ annual: +r.annual, fromAge: ageNow + (+r.startYear || 0), toAge: r.endYear == null ? 999 : ageNow + (+r.endYear), label: r.label || 'income stream' });
  const events = [];
  for (const w of (Array.isArray(s.windfalls) ? s.windfalls : [])) if (w && +w.amount > 0 && w.year != null) events.push({ age: ageNow + (+w.year), amount: +w.amount, label: w.label || 'lump sum', kind: 'in', wrapper: w.wrapper || 'cash' });
  for (const w of (Array.isArray(s.extraWithdrawals) ? s.extraWithdrawals : [])) if (w && +w.amount > 0 && w.year != null) events.push({ age: ageNow + (+w.year), amount: +w.amount, label: w.label || 'one-off spend', kind: 'out', years: +w.years || 1 });
  const floorVals = Array.from({ length: dur }, (_, y) => {
    const age = ageNow + y;
    let f = 0;
    if (sp && age >= sp.fromAge) f += sp.annual * (age === sp.fromAge ? sp.firstYearRatio : 1);
    for (const o of other) if (age >= o.fromAge && age <= o.toAge) f += o.annual;
    return Math.round(f);
  });
  return { steps, ageNow, horizonAge: ageNow + dur - 1, sp, other, events, floorVals, budgetGross, essentials };
}

/** Per-plan-year rows: tax year, age, gross, who pays it, lump sums. */
export function buildTimeline({ settings, timing, p, r, layers }) {
  const s = settings || {};
  const N = Math.max(1, Math.min(45, p?.durationYears || +s.duration || 35));
  const startAge = timing.shapeAgeNow;
  let rows = [];
  try { if (r && p) rows = incomeLayersRows(r, p); } catch (e) { rows = []; }
  const windfalls = Array.isArray(s.windfalls) ? s.windfalls : [];
  const spends = Array.isArray(s.extraWithdrawals) ? s.extraWithdrawals : [];
  const out = [];
  for (let y = 0; y < N; y++) {
    const age = startAge + y;
    const gross = (p?.needByYear && p.needByYear[y] != null) ? p.needByYear[y]
      : (Array.isArray(p?.targetSchedule) && p.targetSchedule[y] != null ? p.targetSchedule[y] + ((p.otherIncomeByYear && p.otherIncomeByYear[y]) || 0)
      : amountAtAge(layers.steps, age, +s.baseSalary || 0));
    const lr = rows[y] || {};
    const sp = lr.sp ?? ((layers.sp && age >= layers.sp.fromAge) ? layers.sp.annual * (age === layers.sp.fromAge ? layers.sp.firstYearRatio : 1) : 0);
    const other = lr.otherPure ?? lr.other ?? layers.other.reduce((t, o) => t + (age >= o.fromAge && age <= o.toAge ? o.annual : 0), 0);
    const yr = r?.plan?.years?.[y] || null;
    out.push({
      y, taxYear: taxYearLabel(timing.firstTaxYear + y), age,
      gross: Math.round(gross), sp: Math.round(sp), other: Math.round(other), lump: Math.round(lr.lump || 0),
      contract: Math.round(lr.contract || 0), market: Math.round(lr.market || 0),
      lumpIn: windfalls.filter((w) => w && +w.amount > 0 && +w.year === y).map((w) => ({ label: w.label || 'Lump sum', amount: +w.amount, wrapper: w.wrapper || 'cash' })),
      lumpOut: spends.filter((w) => w && +w.amount > 0 && w.year != null && y >= +w.year && y < +w.year + Math.max(1, +w.years || 1)).map((w) => ({ label: w.label || 'One-off spend', amount: +w.amount / Math.max(1, +w.years || 1) })),
      cashYear: yr ? yr.from === 'cash' : false,
      source: yr ? (yr.from === 'cash' ? 'cash' : yr.from === 'none' ? 'uncovered' : yr.from) : null
    });
  }
  return out;
}

/** Target mix by plan year for the pot strategies (a contract strategy holds its ladder instead). */
export function buildTargetMix(settings, N) {
  const s = settings || {};
  const pot = (+s.equityMin || 0) + (+s.bondMin || 0) + (+s.cashTarget || 0);
  if (!(pot > 0)) return [];
  const alloc = { equity: s.equityMin / pot, bond: s.bondMin / pot, cash: s.cashTarget / pot, equityGlide: s.equityGlideEnabled ? equityGlideFromRisk(s.equityMin, s.bondMin) : undefined };
  const out = [];
  for (let y = 0; y < N; y += (y < 5 ? 1 : 5)) { const m = targetMixForYear(alloc, y, N); out.push({ y, equity: Math.round(m.equity * 100), bond: Math.round(m.bond * 100), cash: Math.round(m.cash * 100) }); }
  return out;
}

/**
 * The locked accumulation path (6.7.0): for a plan that starts later, the pot projected from today's
 * holdings and contributions to the start — the track a saver is read against each month.
 * `holdings` is the holdings record (or its lines): the pension pot is its SIPP total, else the Accumulation
 * planner's "pot today", else NULL — never equityMin+bondMin+cashTarget, which are the pots the strategy was
 * TESTED on, not what the person holds (6.13.0). With no pot the block records the gap (`potNow: null`,
 * empty `path`) so the document and the where-am-I strip can say "record your pot".
 * @returns {null | { startAge, retireAge, years, potNow, totalMonthly, mixRealReturn, mixText, path: rows }}
 */
export function buildAccumulationPath({ settings = {}, timing, accumulation = null, holdings = null } = {}) {
  if (!timing || timing.mode !== 'future' || !(timing.currentAge > 0)) return null;
  const a = accumulation || {};
  const lines = holdingsLines(holdings);
  const prop = lines.length ? holdingsProportions(lines) : null;
  const fromLedger = pensionPotFromHoldings(lines);
  const potNow = fromLedger > 0 ? fromLedger : (+a.potNow > 0 ? +a.potNow : null);
  let totalMonthly = 0;
  try { if (+a.netMonthly > 0 || +a.employerMonthly > 0) totalMonthly = contributionBreakdown({ netMonthly: +a.netMonthly || 0, salary: +a.salary || 0, schemeType: a.schemeType || 'ras', employerMonthly: +a.employerMonthly || 0 }).totalMonthly || 0; } catch (e) { totalMonthly = 0; }
  if (!(totalMonthly > 0) && prop && prop.contributions.monthly > 0) totalMonthly = prop.contributions.monthly;
  const years = Math.max(0, timing.shapeAgeNow - timing.currentAge);
  const mixRealReturn = prop && prop.total > 0 ? prop.expectedReal : null;
  // The plan's fund and platform charges (6.19.0): taken off the path monthly; on the "your mix" line they replace the
  // holdings' own fund charges. Recorded beside the path (absent on a document built before 6.19.0).
  const chargesPct = chargesPctOf(settings);
  if (potNow == null) {
    return plainClone({ startAge: timing.currentAge, retireAge: timing.shapeAgeNow, years, potNow: null, potSource: null, totalMonthly: Math.round(totalMonthly), mixRealReturn: null, mixText: null, chargesPct, path: [] });
  }
  const rows = projectAccumulation({ currentAge: 0, retirementAge: years, potNow, totalMonthly, escalationPct: +a.escalationPct || 0, mixRealReturn, chargesPct, mixOcf: mixRealReturn != null ? prop.weightedOcf : null });
  return plainClone({
    startAge: timing.currentAge, retireAge: timing.shapeAgeNow, years, potNow: Math.round(potNow), potSource: fromLedger > 0 ? 'holdings' : 'accumulation', totalMonthly: Math.round(totalMonthly), mixRealReturn, chargesPct,
    mixText: prop ? (Math.round(prop.buckets.shares * 100) + '% shares · ' + Math.round(prop.buckets.bonds * 100) + '% bonds · ' + Math.round((prop.buckets.diversifiers || 0) * 100) + '% diversifiers · ' + Math.round(prop.buckets.cash * 100) + '% cash') : null,
    path: rows.map((r) => ({ year: r.year, age: timing.currentAge + r.year, potLow: Math.round(r.potLow), potMid: Math.round(r.potMid), potHigh: Math.round(r.potHigh), ...(r.potMix != null ? { potMix: Math.round(r.potMix) } : {}), contributedToDate: Math.round(r.contributedToDate) }))
  });
}

/**
 * Build the document.
 * @param {object} a  { planName, settings (Stress), p (planFromSettings), r (stressTestStrategy, optional),
 *                      lockedAt, lockedBy, budgetGross, essentials, giltPricesAsOf, journey, accumulation,
 *                      holdings (the holdings record — what the person holds, see HoldingsRecord.js), now }
 */
export function buildPlanDocument({ planName = 'My plan', settings = {}, p = null, r = null, lockedAt = null, lockedBy = null, budgetGross = 0, essentials = 0, giltPricesAsOf = null, journey = [], accumulation = null, holdings = null, now = new Date() } = {}) {
  const timing = deriveTiming(settings, now);
  const H = normaliseHoldings(holdings);   // absent → the empty record; never the Stress tester's fund list
  const layers = shapeLayersFromSettings(settings, timing, { budgetGross, essentials, now });
  const N = Math.max(1, Math.min(45, p?.durationYears || +settings.duration || 35));
  const strategyId = r?.strategyId || settings.strategyId || 'pots-and-valves';
  const contract = CONTRACT_STRATEGIES.includes(strategyId);
  // The active strategy's OWN keys only (6.13.0): a sippTotal left behind by a deselected ladder must never size a
  // Pots & Valves document — it runs on the allocation and has no mini-pot.
  const params = cleanParams(strategyId, settings.strategyParams);
  const potToday = (params.sippTotal > 0) ? +params.sippTotal : ((+settings.equityMin || 0) + (+settings.bondMin || 0) + (+settings.cashTarget || 0) + (+settings.diversifierStart || 0));
  const steps = layers.steps.map((st, i) => ({
    fromAge: +st.fromAge, taxYear: taxYearLabel(timing.firstTaxYear + (+st.fromAge - timing.shapeAgeNow)),
    amount: Math.round(+st.amount), decline: +st.decline || 0, glideToNext: !!st.glideToNext, slope: slopeLabel(st, i < layers.steps.length - 1)
  }));
  return plainClone({
    version: PLAN_DOCUMENT_VERSION,
    createdAt: now.toISOString(),
    appVersion: VERSION, engineVersion: ENGINE_VERSION,
    planName, lockedAt: lockedAt || now.toISOString(), lockedBy: lockedBy || 'locked from Stress settings',
    timing: { ...timing, text: describeTiming(timing, settings, now), currentAgeAsOf: settings.currentAgeAsOf || null },
    journey: Array.isArray(journey) ? journey.map((j) => ({ stage: j.stage, label: j.label, at: j.at, ...(j.note ? { note: j.note } : {}) })) : [],
    accumulation: buildAccumulationPath({ settings, timing, accumulation, holdings: H.lines }),   // null unless retiring later (6.7.0)
    // What the person HELD when the plan was locked (6.13.0) — every strategy; the Transition tool's baseline.
    holdingsAtLock: { updatedAt: H.updatedAt, source: H.source, lines: H.lines },
    steps,
    layers: { sp: layers.sp, other: layers.other, events: layers.events, floorVals: layers.floorVals, ageNow: layers.ageNow, horizonAge: layers.horizonAge, budgetGross, essentials },
    timeline: buildTimeline({ settings, timing, p, r, layers }),
    pots: {
      sipp: Math.round(potToday), isa: Math.round(params.sippTotal > 0 ? (+params.isaTotal || 0) : (+settings.isaBalance || 0)), gia: Math.round(+settings.taxableStart || 0),
      isaPolicy: settings.isaDrawdownStrategy || null, taxableMix: settings.taxableMix || null,
      potAtRetirement: settings.potAtRetirement || null,
      // The allocation the strategy was TESTED on. `taggedFunds` is the Stress tester's "funds to test" list —
      // a strategy input, not a record of holdings (those are `holdingsAtLock`).
      allocation: { equityMin: +settings.equityMin || 0, bondMin: +settings.bondMin || 0, cashTarget: +settings.cashTarget || 0, diversifierStart: +settings.diversifierStart || 0, allocMode: settings.allocMode || null, taggedFunds: (settings.taggedFunds || []).map((f) => ({ name: f.name ?? null, ticker: f.ticker ?? null, value: +f.value || 0, wrapper: f.wrapper || null })) }
    },
    strategy: { id: strategyId, name: r?.name || strategyId, params: { ...params }, contract, r: trimResult(r), p: trimPlan(p) },
    targetMix: contract ? [] : buildTargetMix(settings, N),
    assumptions: {
      spStartDate: settings.spStartDate || null, spWeeklyAmount: +settings.spWeeklyAmount || 0,
      pa: +settings.pa || 12570, brl: +settings.brl || 50270, hrl: +settings.hrl || 125140, taxMode: settings.taxMode || 'inflates',
      cpiDecision: DECISION_ASSUMED_CPI_FOR_RECORD, duration: N, firstTaxYear: timing.firstTaxYear, bridgeMonths: timing.bridgeMonths,
      cashYears: params.cashYears ?? null, bridgeCash: +params.bridgeCash || 0, giltPricesAsOf: giltPricesAsOf || (r?.plan ? now.toISOString().slice(0, 10) : null),
      // Fund and platform charges the plan's figures were worked out at, percent a year (6.19.0). A document locked
      // before 6.19.0 has no key: its figures were worked out without charges.
      chargesPct: chargesPctOf(settings)
    },
    decisionRun: {
      year0: taxYearLabel(timing.firstTaxYear), bridgeMonths: timing.bridgeMonths, contract,
      monthlyAsks: contract ? ['Gilt ladder value (unpaid rungs)', 'Cash, including the money-market fund', 'ISA balance', 'Taxable account (GIA), if any']
        : ['Equity funds', 'Bond funds', 'Cash', 'Diversifiers, if any', 'ISA balance', 'Taxable account (GIA), if any']
    }
  });
}

/** The strategies whose band is "all pots": the Pots & Valves engine's SIPP + ISA + taxable account (stressTest pnvRun). */
export const POT_STRATEGIES = ['pots-and-valves', 'buckets-in-order'];
/**
 * The strategies whose band holds the gilts at what they COST (stressTest fullGiltTest / rotationTest: unpaid rungs at
 * cost, the rotation block at its accreted value), where the Decision record holds their market value. The two are not
 * the same measure, so the strip gives no verdict on these (6.20.1). The other ladder strategies value the unpaid rungs
 * on the plan's own yield curve at each year (ladderPvAt), next to a market sleeve whose spread dominates the band.
 */
export const RUNGS_AT_COST = ['full-il-gilt', 'gilt-rotation'];

/**
 * Which accounts the plan's wealth band counts at a plan year (6.20.1). Read from the stored document only.
 *  - Pots & Valves / Buckets: SIPP + ISA + taxable account (`potByYear + isaByYear`; a held ISA still sits in it).
 *  - Every bought strategy: the growth part + the unpaid rungs, bought from SIPP + ISA — the ISA only when it is not
 *    held aside (`availablePot`) — plus any lump sum not yet spent (`windfallCarryByYear`, the taxable account too).
 *  - The diversifier sleeve is in a Pots & Valves band; the Decision record does not keep its value.
 * An account counts when the plan was priced with money in it, or a lump sum it routes there has arrived by `planYear`
 * (a cash lump: the first £20,000 to an ISA not held aside, the rest to the taxable account — routeWindfall).
 * Not visible from the document: an ISA built only by band-fill recycling or a PCLS switch (both opt-in).
 * @returns {{ strategyId, potsStrategy, isa: boolean, gia: boolean, diversifiers: boolean, isaLeftOut: boolean }}
 */
export function bandMeasure(doc, { planYear = 0 } = {}) {
  const d = doc || {};
  const strategyId = d.strategy?.id || 'pots-and-valves';
  const potsStrategy = POT_STRATEGIES.includes(strategyId);
  const P = d.pots || {};
  const held = P.isaPolicy === 'hold';
  const isaInBand = potsStrategy || !held;
  const arrived = (Array.isArray(d.timeline) ? d.timeline : []).filter((r) => r && +r.y <= planYear).flatMap((r) => (Array.isArray(r.lumpIn) ? r.lumpIn : []));
  let isaLump = false, giaLump = false;
  for (const l of arrived) {
    const w = String(l.wrapper || 'cash').toLowerCase(), amt = +l.amount || 0;
    if (w === 'pension' || w === 'sipp' || !(amt > 0)) continue;
    if (w === 'isa') isaLump = true;
    else if (w === 'gia') giaLump = true;
    else if (held) giaLump = true;
    else { isaLump = true; if (amt > GIA_DEFAULTS.ISA_ALLOWANCE) giaLump = true; }
  }
  const isaPriced = (+P.isa || 0) > 0;
  return {
    strategyId, potsStrategy,
    isa: isaInBand && (isaPriced || isaLump),
    gia: (+P.gia || 0) > 0 || giaLump,
    diversifiers: potsStrategy && (+P.allocation?.diversifierStart || 0) > 0,
    isaLeftOut: !isaInBand && isaPriced   // a bought plan with its ISA held aside: neither side counts it
  };
}

/** 'YYYY-MM' / 'YYYY-MM-DD' / a Date / { y, m } → { y, m } (m 1-based), or null. */
function monthOf(x) {
  if (x instanceof Date) return Number.isFinite(x.getTime()) ? { y: x.getFullYear(), m: x.getMonth() + 1 } : null;
  if (x && typeof x === 'object') return Number.isInteger(x.y) && x.m >= 1 && x.m <= 12 ? { y: x.y, m: x.m } : null;
  const mm = /^(\d{4})-(\d{2})/.exec(String(x == null ? '' : x));
  return mm ? { y: +mm[1], m: +mm[2] } : null;
}
const monthsBetween = (a, b) => (b.y * 12 + b.m) - (a.y * 12 + a.m);
/** Plan year of a month (April opens the tax year — as planYearOf reads a 'YYYY-MM' record), and months into it. */
const planYearAt = (at, fty) => (at.m >= 4 ? at.y : at.y - 1) - fty;
const monthsIntoTaxYear = (at) => (at.m + 8) % 12;   // April 0 … March 11: the months already paid before a record's own

/**
 * How far prices have moved from the start of the plan to month `at` (6.20.1): the factor that turns a pot in that
 * month's pounds into the plan's own pounds. Every band the engines draw is in prices at the start of the plan
 * ("today's money": SimulationEngine divides potByYear and isaByYear by cumInf; the ladder bands are real), while a
 * pot read off a platform is in the pounds of its month.
 * The chain is the Decision tool's own (legacyDecision glidepathsForYear), so the strip and the monthly figures agree:
 * plan year y is in prices Π (1 + CPI of tax year firstTaxYear + i) for i < y — the CPI entered for that tax year in
 * the Decision tool, else the plan's assumption (`assumptions.cpiDecision`, 4%); a blank or 0 reads as not entered,
 * as it does there. Within a year, the year's CPI for the months gone. The run-up before year 0 is at the starting
 * prices (factor 1), as the Decision tool and the engines treat it.
 * @param {object} taxYears  the Decision tool's tax-year set-ups ({ 'YY/YY': { cpi } }), or null
 * @returns {{ factor, assumed, years: [{ taxYear, cpi, entered, share }] }}
 */
export function pricesSinceStart(doc, at, taxYears = null) {
  const assumed = +doc?.assumptions?.cpiDecision > 0 ? +doc.assumptions.cpiDecision : DECISION_ASSUMED_CPI_FOR_RECORD;
  const fty = +doc?.timing?.firstTaxYear;
  const m = monthOf(at);
  const out = { factor: 1, assumed, years: [] };
  if (!m || !Number.isFinite(fty)) return out;
  const pY = planYearAt(m, fty);
  const frac = monthsIntoTaxYear(m) / 12;
  const T = taxYears && typeof taxYears === 'object' ? taxYears : {};
  for (let i = 0; i <= pY; i++) {
    const share = i < pY ? 1 : frac;
    if (!(share > 0)) break;
    const key = taxYearKey(fty + i);
    const entered = +(T[key] && T[key].cpi) || 0;
    const cpi = entered || assumed;
    out.factor *= Math.pow(1 + cpi, share);
    out.years.push({ taxYear: key, cpi, entered: !!entered, share });
  }
  return out;
}

/**
 * The record the pot comes from, and the month it was entered. A batch (quarterly or annual cadence) saves the same
 * values under each month it covers — some of them still ahead — so the values date from the batch's FIRST month:
 * walk back over consecutive months holding the same pots.
 */
function potRecordOf(history) {
  const recs = (history || []).filter((h) => h && monthOf(h.date)).slice().sort((a, b) => String(a.date).localeCompare(String(b.date)));
  if (!recs.length) return null;
  const same = (a, b) => ['equity', 'bond', 'cash'].every((k) => Math.abs((+a[k] || 0) - (+b[k] || 0)) < 0.5);
  let i = recs.length - 1;
  while (i > 0 && same(recs[i - 1], recs[i]) && monthsBetween(monthOf(recs[i - 1].date), monthOf(recs[i].date)) === 1) i--;
  return { rec: recs[i], idx: i, recs };
}

/** Sum of the holdings lines in one wrapper with a value, and the date they stand at (the record's, else the latest line's). */
function wrapperFigure(holdings, wrapper) {
  const lines = holdingsLines(holdings).filter((l) => l && normaliseWrapper(l.wrapper) === wrapper && numOrNull(l.value) != null);
  if (!lines.length) return null;
  const asOf = (holdings && !Array.isArray(holdings) && holdings.updatedAt) || lines.map((l) => l.asOf).filter(Boolean).sort().pop() || null;
  return { value: lines.reduce((t, l) => t + numOrNull(l.value), 0), asOf: asOf ? String(asOf).slice(0, 10) : null };
}

/** The diversifiers among the SIPP lines under What you hold (the tagger's bucket), and their date; null with no SIPP lines. */
function diversifierFigure(holdings) {
  const sipp = wrapperFigure(holdings, 'SIPP');
  if (!sipp) return null;
  const lines = holdingsLines(holdings).filter((l) => l && normaliseWrapper(l.wrapper) === 'SIPP' && numOrNull(l.value) != null).map((l) => ({ ...l, value: numOrNull(l.value) }));
  return { value: holdingsProportions(lines).bucketValues.diversifiers || 0, asOf: sipp.asOf };
}

/**
 * The pot to set against the band (6.20.1): the same accounts the band counts, at a known date.
 * Pension: `potsToday` (a figure the caller has already made like the band, in today's pounds — taken as given), else
 * the latest Decision record's equity + bond + cash (on a ladder plan: the growth part, the gilts still to pay and the
 * cash), else the SIPP lines under What you hold. A Pots & Valves plan holding diversifiers: the record does not keep
 * them, so the newer source is used — What you hold whole when its SIPP figure is as new as the record (same month or
 * later), else the record plus the diversifier lines under What you hold, with their own date. ISA: What you hold.
 * Taxable account: the record's start-of-month balance, else What you hold. A figure the band needs and nobody has
 * given is listed in `missing`; nothing is then compared.
 */
function potLikeTheBand(doc, { today, history, potsToday, holdings }) {
  const measureAt = (at) => bandMeasure(doc, { planYear: planYearAt(at, +doc.timing.firstTaxYear) });
  if (potsToday != null) {
    const t = today.toISOString().slice(0, 10), at = monthOf(today);
    return { source: 'today', asOf: t, at, pension: Math.round(+potsToday), parts: [{ key: 'all', value: +potsToday, source: 'today', asOf: t }], missing: [], measure: measureAt(at), runUpMonthly: 0 };
  }
  const found = potRecordOf(history);
  const sipp = wrapperFigure(holdings, 'SIPP');
  const diversifiers = bandMeasure(doc).diversifiers;   // a property of the plan, not of the year
  const missing = [], extra = [];
  let source = null, pension = null, asOf = null, rec = null;
  const sippMonth = sipp && sipp.value > 0 ? monthOf(sipp.asOf) : null;
  const holdingsWhole = diversifiers && sipp && sipp.value > 0 && (!found || (sippMonth != null && monthsBetween(monthOf(found.rec.date), sippMonth) >= 0));
  if (found && !holdingsWhole) {
    source = 'record'; rec = found.rec; asOf = String(rec.date).slice(0, 7);
    pension = (+rec.equity || 0) + (+rec.bond || 0) + (+rec.cash || 0);
    if (diversifiers) {
      const div = diversifierFigure(holdings);
      if (!div) missing.push('diversifiers');
      else if (div.value > 0) extra.push({ key: 'diversifiers', value: div.value, source: 'holdings', asOf: div.asOf });
    }
  } else if (sipp && sipp.value > 0) { source = 'holdings'; pension = sipp.value; asOf = sipp.asOf; }
  const at = monthOf(asOf) || monthOf(today);
  const measure = measureAt(at);
  if (source == null) return { source: null, asOf: null, at, pension: null, parts: [], missing: ['pension'], measure, runUpMonthly: 0 };
  const parts = [{ key: 'pension', value: pension, source, asOf }, ...extra];
  if (measure.isa) {
    const isa = wrapperFigure(holdings, 'ISA');
    if (isa) parts.push({ key: 'isa', value: isa.value, source: 'holdings', asOf: isa.asOf });
    else missing.push('isa');
  }
  if (measure.gia) {
    let gia = null;
    if (rec && numOrNull(rec.gia) != null) gia = { value: +rec.gia, source: 'record', asOf };
    else if (rec) {
      // Drawn to nothing as planned: the Decision tool pre-fills each month's balance from the last one's after-draw
      // figure, and a £0 balance is not written to the record — the last record that carried it says so.
      const prev = found.recs.slice(0, found.idx).reverse().find((h) => numOrNull(h.gia) != null);
      if (prev && numOrNull(prev.giaBalanceAfter) != null && +prev.giaBalanceAfter <= 1) gia = { value: 0, source: 'record', asOf };
    }
    if (!gia) { const g = wrapperFigure(holdings, 'GIA'); if (g) gia = { value: g.value, source: 'holdings', asOf: g.asOf }; }
    if (gia) parts.push({ key: 'gia', ...gia });
    else missing.push('gia');
  }
  return { source, asOf, at, pension: Math.round(pension), parts, missing, measure, runUpMonthly: rec ? (+rec.sipp || 0) : 0 };
}

/**
 * The plan's band at a point in plan year `yi`, `frac` of the way through it. Plan year y's figure is its START
 * (stressTest: every engine records its wealth when the year opens), so within a year the median moves on a straight
 * line towards the next year's start as the year's income is paid out. The spread either side does not: market spread
 * grows roughly with the square root of time, so the distance of each line from the median is drawn on a square-root
 * time scale between the two years — in year 0, where every line starts at the same figure, the distance is next
 * year's times √frac (a straight line there made the first months' band far too narrow and read a normal two-month
 * dip as "below the 1-in-10 bad line").
 */
export function bandAt(wc, yi, frac = 0) {
  const at = (arr, i) => (Array.isArray(arr) && i < arr.length && Number.isFinite(+arr[i]) ? +arr[i] : null);
  const n = Array.isArray(wc?.p50) ? wc.p50.length : 0;
  if (!n) return { p10: null, p50: null, p90: null };
  const i = Math.min(Math.max(0, yi), n - 1);
  const a50 = at(wc.p50, i), b50 = at(wc.p50, i + 1);
  if (a50 == null) return { p10: null, p50: null, p90: null };
  const go = frac > 0 && b50 != null;
  const p50 = go ? a50 + frac * (b50 - a50) : a50;
  const s = go ? (Math.sqrt(i + frac) - Math.sqrt(i)) / (Math.sqrt(i + 1) - Math.sqrt(i)) : 0;
  const line = (arr) => {
    const a = at(arr, i);
    if (a == null) return null;
    const b = at(arr, i + 1);
    if (!go || b == null) return a + (p50 - a50);
    const dA = a - a50, dB = b - b50;
    return p50 + dA + s * (dB - dA);
  };
  return { p10: line(wc.p10), p50, p90: line(wc.p90) };
}

/**
 * The pot against the plan's band, like with like (6.20.1). Null for a saver before the plan starts: the band begins
 * at retirement, on the pots grown to it, and the saving line reads today's pot against the locked path instead.
 *  - The same accounts (potLikeTheBand), at the same point in the plan: the band is read at the pot's month (bandAt).
 *  - The same pounds: the band is in prices at the start of the plan, so the pot is turned into those prices
 *    (pricesSinceStart) before it is compared; `actual` stays the pot as recorded, `real` is what is compared.
 *  - Before year 0 of a gilt ladder that set run-up cash aside (`assumptions.bridgeCash`), the ladder's year 0 does
 *    not hold that cash but the pot does: the part of it the plan has not yet spent — spread evenly over the run-up
 *    months it was priced with, the pot's own month still to pay — is added to the band.
 * A verdict (`band`) is given only when the two are the same measure and the band has opened:
 *  - `verdict: 'gilts-at-cost'` — Full ladder / Ladder + rotation: the band holds the gilts at what they cost, the
 *    record at today's market prices (RUNGS_AT_COST). No verdict; the ladder line says whether the rungs are on track.
 *  - `verdict: 'start'` — the run-up, or April of year 0: every line is still the starting figure.
 *  - `verdict: 'not-open'` — the 1-in-10 bad line is still the median (nothing to be below).
 *  - `verdict: 'band'` — `band` is set.
 * Stale figures (more than three months older than today) are listed in `stale`.
 */
function potReading(doc, wc, { today, history, potsToday, holdings, taxYears }) {
  const fty = +doc.timing.firstTaxYear;
  const P = potLikeTheBand(doc, { today, history, potsToday, holdings });
  const pY = planYearAt(P.at, fty);
  if (doc.timing.mode === 'future' && pY < 0) return null;
  const yi = Math.max(0, pY);
  const frac = pY >= 0 ? monthsIntoTaxYear(P.at) / 12 : 0;
  let { p10, p50, p90 } = bandAt(wc, yi, frac);
  const startP50 = p50;
  let runUp = null;
  const bridgeCash = Math.max(0, +doc.assumptions?.bridgeCash || 0);
  if (pY < 0 && bridgeCash > 0) {
    // Months of the run-up still to pay at the pot's month, that month included (a record is entered before its draw).
    const months = Math.max(0, (fty * 12 + 4) - (P.at.y * 12 + P.at.m));
    // The plan was priced with `bridgeCash` set aside for the run-up months it had when it was locked (`bridgeMonths`):
    // that cash spends down month by month, and by 6 April of year 0 it is gone — the ladder's year 0 never held it.
    // A run-up dearer than the cash set aside comes out of the spare money year 0 does hold: the pot falls short of it.
    const of = Math.round(+doc.timing?.bridgeMonths || +doc.assumptions?.bridgeMonths || 0);
    let value, monthly;
    if (of > 0) { value = bridgeCash * Math.min(1, months / of); monthly = bridgeCash / of; }
    else {
      // A document without its run-up length: the draw the record shows, else the plan's year-0 draw, capped at the cash.
      const t0 = Array.isArray(doc.timeline) ? doc.timeline[0] : null;
      monthly = P.runUpMonthly > 0 ? P.runUpMonthly : (t0 ? Math.max(0, ((+t0.gross || 0) - (+t0.sp || 0) - (+t0.other || 0)) / 12) : 0);
      value = Math.min(bridgeCash, monthly * months);
    }
    if (value > 0) {
      runUp = { months, of: of > 0 ? of : null, monthly: Math.round(monthly), value: Math.round(value) };
      [p10, p50, p90] = [p10, p50, p90].map((v) => (v == null ? null : v + value));
    }
  }
  const actual = P.missing.length ? null : P.parts.reduce((t, x) => t + x.value, 0);
  const prices = pricesSinceStart(doc, P.at, taxYears);
  const real = actual == null ? null : actual / prices.factor;
  // "Bought by contract" only when the cone is flat over the WHOLE run — every cone is flat at year 0 (6.10.4). Only a
  // ladder held at cost draws one (fullGiltTest), so a document without its strategy id is read as one too.
  const flatAll = Array.isArray(wc.p10) && Array.isArray(wc.p90) && wc.p10.length > 1 && wc.p10.every((v, i) => Math.abs((wc.p90[i] ?? v) - v) < 1);
  const atCost = RUNGS_AT_COST.includes(P.measure.strategyId) || flatAll;
  let verdict = null, band = null;
  if (real != null && p50 != null) {
    if (atCost) verdict = 'gilts-at-cost';
    else if (p10 == null || p90 == null || Math.abs(p50 - p10) < 1) {
      const closed = p10 == null || p90 == null || Math.abs(p90 - p10) < 1;
      verdict = closed && (pY < 0 || (pY === 0 && frac === 0)) ? 'start' : 'not-open';
    }
    else { verdict = 'band'; band = real < p10 ? 'below p10' : real < p50 ? 'p10–p50' : real <= p90 ? 'p50–p90' : 'above p90'; }
  }
  const todayM = monthOf(today);
  const stale = P.parts.filter((x) => x.source !== 'today' && monthOf(x.asOf) && todayM && monthsBetween(monthOf(x.asOf), todayM) > 3).map((x) => ({ key: x.key, source: x.source, asOf: x.asOf }));
  const r0 = (v) => (v == null ? null : Math.round(v));
  return {
    actual: r0(actual), real: r0(real), pension: P.pension, parts: P.parts.map((x) => ({ ...x, value: Math.round(x.value) })), missing: P.missing,
    source: P.source, asOf: P.asOf, planYear: pY, monthsIn: Math.round(frac * 12),
    prices: { factor: prices.factor, assumed: prices.assumed, years: prices.years.length, entered: prices.years.filter((x) => x.entered).length },
    p10: r0(p10), p50: r0(p50), p90: r0(p90), startP50: runUp ? r0(startP50) : null, runUp,
    verdict, band, flat: flatAll, isaLeftOut: P.measure.isaLeftOut, stale
  };
}

/**
 * Where the user stands today against the document. Pure; the document is only read.
 * `holdings` is today's holdings record (or its lines): when no month has been recorded and no pot is passed
 * in, its SIPP total stands in as the pension — never the pots the strategy was tested on (6.13.0).
 * The pot set against the band counts what the band counts (6.20.1; see `bandMeasure`, `potLikeTheBand`), in the
 * band's pounds (`taxYears`: the Decision tool's tax-year set-ups, for the CPI entered each year — see
 * `pricesSinceStart`), and the band is read at the pot's own month (`bandAt`); in the run-up of a gilt ladder that
 * set cash aside for it, the cash still to pay is added (year 0 of the ladder's band does not hold it). A figure the
 * band needs that is missing → `pot.missing`, no reading; a band that is not the same measure → no verdict.
 */
export function whereAmI(doc, { today = new Date(), history = [], potsToday = null, ladderPos = null, accHistory = [], holdings = null, taxYears = null } = {}) {
  if (!doc || !doc.timing) return null;
  const ledgerPot = pensionPotFromHoldings(holdingsLines(holdings));
  const ledgerAsOf = holdings && !Array.isArray(holdings) && holdings.updatedAt ? holdings.updatedAt : null;
  // Saver against the locked path (6.7.0): before a retire-later plan starts, read the latest pot record
  // against the projection the plan was priced on. A plan locked with no pot on record has an empty path:
  // say so (`pathMissing`) so the strip asks for the pot instead of comparing with nothing.
  let saving = null;
  if (doc.accumulation && doc.timing.mode === 'future') {
    const path = Array.isArray(doc.accumulation.path) ? doc.accumulation.path : [];
    const lockedAt = new Date(doc.lockedAt || doc.createdAt || today);
    const yearsElapsed = Math.max(0, (today.getTime() - lockedAt.getTime()) / (365.25 * 24 * 3600 * 1000));
    const expected = path.length ? potOnPath(path, yearsElapsed, path[0].potMix != null ? 'potMix' : 'potMid') : null;
    const low = path.length ? potOnPath(path, yearsElapsed, 'potLow') : null, high = path.length ? potOnPath(path, yearsElapsed, 'potHigh') : null;
    const last = (accHistory || []).slice().sort((a, b) => String(a.date).localeCompare(String(b.date))).pop() || null;
    const actual = last ? +(last.sipp ?? last.total ?? 0) : (potsToday != null ? +potsToday : (ledgerPot > 0 ? ledgerPot : null));
    const actualSource = last ? 'record' : potsToday != null ? 'today' : ledgerPot > 0 ? 'holdings' : null;
    const start = new Date(+doc.timing.firstTaxYear, 3, 6);
    const monthsToGo = Math.max(0, Math.round((start.getTime() - today.getTime()) / (30.44 * 24 * 3600 * 1000)));
    saving = { monthsToGo, pathMissing: !path.length, expected: expected == null ? null : Math.round(expected), low: low == null ? null : Math.round(low), high: high == null ? null : Math.round(high), actual: actual == null ? null : Math.round(actual), actualSource, recordedAt: last ? last.date : (actualSource === 'holdings' ? ledgerAsOf : null),
      band: actual == null || expected == null ? null : actual < (low ?? -Infinity) ? 'below the cautious line' : actual < expected ? 'below the locked path' : actual <= (high ?? Infinity) ? 'on or above the locked path' : 'above the strong line',
      contributions: doc.accumulation.totalMonthly || 0 };
  }
  const fty = +doc.timing.firstTaxYear;
  const y = planYearOf(today, fty);
  const bridge = y < 0;
  const yi = Math.max(0, y);
  const N = doc.timeline?.length || doc.assumptions?.duration || 35;
  const age = doc.timing.shapeAgeNow + y;
  const taxYear = taxYearLabel(taxYearStartOf(today));
  const steps = (doc.steps || []).slice().sort((a, b) => a.fromAge - b.fromAge);
  const cur = steps.filter((st) => st.fromAge <= Math.max(age, steps[0]?.fromAge ?? age)).pop() || steps[0] || null;
  const next = steps.find((st) => st.fromAge > (cur ? cur.fromAge : age)) || null;   // in a bridge month step 1 is still ahead
  const stepNow = cur ? Math.round(amountAtAge(steps.map((st) => ({ fromAge: st.fromAge, amount: st.amount, decline: st.decline, glideToNext: st.glideToNext })), Math.max(age, cur.fromAge), cur.amount)) : null;
  const row = doc.timeline?.[yi] || null;
  const key = String(taxYearStartOf(today) % 100).padStart(2, '0') + '/' + String((taxYearStartOf(today) + 1) % 100).padStart(2, '0');
  const recs = (history || []).filter((h) => h && h.taxYear === key);
  const drawn = recs.reduce((t, h) => t + (+h.sipp || 0) + (+h.other || 0) + (+h.state || 0), 0);
  // The pot against the band (6.20.1): the same accounts, read at the same point in the plan — see potReading.
  const wc = doc.strategy?.r?.cones?.wealth || null;
  const pot = wc ? potReading(doc, wc, { today, history, potsToday, holdings, taxYears }) : null;
  return {
    today: today.toISOString().slice(0, 10), planYear: y, planYears: N, bridge, taxYear, age,
    planStart: taxYearLabel(fty),
    step: cur ? { amount: stepNow, from: cur.fromAge, taxYear: cur.taxYear, index: steps.indexOf(cur) + 1, of: steps.length, next: next ? { fromAge: next.fromAge, amount: next.amount, taxYear: next.taxYear, yearsAway: next.fromAge - age } : null } : null,
    incomeThisYear: { recorded: recs.length, drawn: Math.round(drawn), planned: row ? row.gross : null, perMonth: row ? Math.round(row.gross / 12) : null },
    pot,
    ladder: ladderPos ? { phase: ladderPos.phase, instruction: ladderPos.instruction, monthly: ladderPos.monthly, source: ladderPos.source, verdict: ladderPos.cashCheck?.verdict || null } : null,
    contract: !!doc.strategy?.contract,
    saving
  };
}
