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
import { deriveTiming, describeTiming, taxYearLabel, planYearOf, taxYearStartOf } from './PlanTiming.js';
import { cleanSteps, amountAtAge } from './IncomeSchedule.js';
import { spSimConfigFromSettings } from '../utils/StatePensionUtils.js';
import { incomeLayersRows } from '../ui/incomeLayersGraphic.js';
import { targetMixForYear, equityGlideFromRisk } from './GlidepathService.js';
import { projectAccumulation, potOnPath, contributionBreakdown } from './AccumulationEngine.js';
import { proportions as holdingsProportions, pensionPotFromHoldings } from './Holdings.js';
import { ENGINE_VERSION } from '../strategies/version.js';
import { VERSION } from '../constants.js';

export const PLAN_DOCUMENT_VERSION = 1;
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
  const { pnvCfg, yieldForYear, ...rest } = p;
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
export function shapeLayersFromSettings(settings, timing = deriveTiming(settings), { budgetGross = 0, essentials = 0 } = {}) {
  const s = settings || {};
  const ageNow = timing.shapeAgeNow || +s.shapeAgeNow || 57;
  const dur = Math.max(1, +s.duration || 35);
  const steps = cleanSteps(Array.isArray(s.incomeSteps) && s.incomeSteps.length ? s.incomeSteps : (s.baseSalary > 0 ? [{ fromAge: ageNow, amount: +s.baseSalary }] : []));
  let sp = null;
  const wk = +s.spWeeklyAmount || 0;
  if (wk > 0 && s.spStartDate) {
    const cfg = spSimConfigFromSettings({ ...s, shapeAgeNow: ageNow, firstTaxYear: timing.firstTaxYear });
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
 * @returns {null | { startAge, retireAge, years, potNow, totalMonthly, mixRealReturn, mixText, path: rows }}
 */
export function buildAccumulationPath({ settings = {}, timing, accumulation = null } = {}) {
  if (!timing || timing.mode !== 'future' || !(timing.currentAge > 0)) return null;
  const a = accumulation || {};
  const holdings = Array.isArray(settings.taggedFunds) ? settings.taggedFunds : [];
  const prop = holdings.length ? holdingsProportions(holdings) : null;
  const potNow = pensionPotFromHoldings(holdings) || +a.potNow || ((+settings.equityMin || 0) + (+settings.bondMin || 0) + (+settings.cashTarget || 0) + (+settings.diversifierStart || 0));
  let totalMonthly = 0;
  try { if (+a.netMonthly > 0 || +a.employerMonthly > 0) totalMonthly = contributionBreakdown({ netMonthly: +a.netMonthly || 0, salary: +a.salary || 0, schemeType: a.schemeType || 'ras', employerMonthly: +a.employerMonthly || 0 }).totalMonthly || 0; } catch (e) { totalMonthly = 0; }
  if (!(totalMonthly > 0) && prop && prop.contributions.monthly > 0) totalMonthly = prop.contributions.monthly;
  const years = Math.max(0, timing.shapeAgeNow - timing.currentAge);
  const mixRealReturn = prop && prop.total > 0 ? prop.expectedReal : null;
  const rows = projectAccumulation({ currentAge: 0, retirementAge: years, potNow, totalMonthly, escalationPct: +a.escalationPct || 0, mixRealReturn });
  return plainClone({
    startAge: timing.currentAge, retireAge: timing.shapeAgeNow, years, potNow: Math.round(potNow), totalMonthly: Math.round(totalMonthly), mixRealReturn,
    mixText: prop ? (Math.round(prop.buckets.shares * 100) + '% shares · ' + Math.round(prop.buckets.bonds * 100) + '% bonds · ' + Math.round((prop.buckets.diversifiers || 0) * 100) + '% diversifiers · ' + Math.round(prop.buckets.cash * 100) + '% cash') : null,
    path: rows.map((r) => ({ year: r.year, age: timing.currentAge + r.year, potLow: Math.round(r.potLow), potMid: Math.round(r.potMid), potHigh: Math.round(r.potHigh), ...(r.potMix != null ? { potMix: Math.round(r.potMix) } : {}), contributedToDate: Math.round(r.contributedToDate) }))
  });
}

/**
 * Build the document.
 * @param {object} a  { planName, settings (Stress), p (planFromSettings), r (stressTestStrategy, optional),
 *                      lockedAt, lockedBy, budgetGross, essentials, giltPricesAsOf, now }
 */
export function buildPlanDocument({ planName = 'My plan', settings = {}, p = null, r = null, lockedAt = null, lockedBy = null, budgetGross = 0, essentials = 0, giltPricesAsOf = null, journey = [], accumulation = null, now = new Date() } = {}) {
  const timing = deriveTiming(settings, now);
  const layers = shapeLayersFromSettings(settings, timing, { budgetGross, essentials });
  const N = Math.max(1, Math.min(45, p?.durationYears || +settings.duration || 35));
  const strategyId = r?.strategyId || settings.strategyId || 'pots-and-valves';
  const contract = CONTRACT_STRATEGIES.includes(strategyId);
  const params = settings.strategyParams || {};
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
    accumulation: buildAccumulationPath({ settings, timing, accumulation }),   // null unless retiring later (6.7.0)
    steps,
    layers: { sp: layers.sp, other: layers.other, events: layers.events, floorVals: layers.floorVals, ageNow: layers.ageNow, horizonAge: layers.horizonAge, budgetGross, essentials },
    timeline: buildTimeline({ settings, timing, p, r, layers }),
    pots: {
      sipp: Math.round(potToday), isa: Math.round(params.sippTotal > 0 ? (+params.isaTotal || 0) : (+settings.isaBalance || 0)), gia: Math.round(+settings.taxableStart || 0),
      isaPolicy: settings.isaDrawdownStrategy || null, taxableMix: settings.taxableMix || null,
      potAtRetirement: settings.potAtRetirement || null,
      allocation: { equityMin: +settings.equityMin || 0, bondMin: +settings.bondMin || 0, cashTarget: +settings.cashTarget || 0, diversifierStart: +settings.diversifierStart || 0, allocMode: settings.allocMode || null, taggedFunds: (settings.taggedFunds || []).map((f) => ({ name: f.name, ticker: f.ticker, value: +f.value || 0, wrapper: f.wrapper || null })) }
    },
    strategy: { id: strategyId, name: r?.name || strategyId, params: { ...params }, contract, r: trimResult(r), p: trimPlan(p) },
    targetMix: contract ? [] : buildTargetMix(settings, N),
    assumptions: {
      spStartDate: settings.spStartDate || null, spWeeklyAmount: +settings.spWeeklyAmount || 0,
      pa: +settings.pa || 12570, brl: +settings.brl || 50270, hrl: +settings.hrl || 125140, taxMode: settings.taxMode || 'inflates',
      cpiDecision: DECISION_ASSUMED_CPI_FOR_RECORD, duration: N, firstTaxYear: timing.firstTaxYear, bridgeMonths: timing.bridgeMonths,
      cashYears: params.cashYears ?? null, bridgeCash: +params.bridgeCash || 0, giltPricesAsOf: giltPricesAsOf || (r?.plan ? now.toISOString().slice(0, 10) : null)
    },
    decisionRun: {
      year0: taxYearLabel(timing.firstTaxYear), bridgeMonths: timing.bridgeMonths, contract,
      monthlyAsks: contract ? ['Gilt ladder value (unpaid rungs)', 'Cash, including the money-market fund', 'ISA balance', 'Taxable account (GIA), if any']
        : ['Equity funds', 'Bond funds', 'Cash', 'Diversifiers, if any', 'ISA balance', 'Taxable account (GIA), if any']
    }
  });
}

/** Where the user stands today against the document. Pure. */
export function whereAmI(doc, { today = new Date(), history = [], potsToday = null, ladderPos = null, accHistory = [] } = {}) {
  if (!doc || !doc.timing) return null;
  // Saver against the locked path (6.7.0): before a retire-later plan starts, read the latest pot record
  // against the projection the plan was priced on.
  let saving = null;
  if (doc.accumulation && Array.isArray(doc.accumulation.path) && doc.accumulation.path.length && doc.timing.mode === 'future') {
    const lockedAt = new Date(doc.lockedAt || doc.createdAt || today);
    const yearsElapsed = Math.max(0, (today.getTime() - lockedAt.getTime()) / (365.25 * 24 * 3600 * 1000));
    const expected = potOnPath(doc.accumulation.path, yearsElapsed, doc.accumulation.path[0].potMix != null ? 'potMix' : 'potMid');
    const low = potOnPath(doc.accumulation.path, yearsElapsed, 'potLow'), high = potOnPath(doc.accumulation.path, yearsElapsed, 'potHigh');
    const last = (accHistory || []).slice().sort((a, b) => String(a.date).localeCompare(String(b.date))).pop() || null;
    const actual = last ? +(last.sipp ?? last.total ?? 0) : (potsToday != null ? +potsToday : null);
    const start = new Date(+doc.timing.firstTaxYear, 3, 6);
    const monthsToGo = Math.max(0, Math.round((start.getTime() - today.getTime()) / (30.44 * 24 * 3600 * 1000)));
    saving = { monthsToGo, expected: expected == null ? null : Math.round(expected), low: low == null ? null : Math.round(low), high: high == null ? null : Math.round(high), actual: actual == null ? null : Math.round(actual), recordedAt: last ? last.date : null,
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
  const last = (history || []).slice().sort((a, b) => String(a.date).localeCompare(String(b.date))).pop() || null;
  const potActual = potsToday != null ? +potsToday : (last ? (+last.equity || 0) + (+last.bond || 0) + (+last.cash || 0) : null);
  const wc = doc.strategy?.r?.cones?.wealth || null;
  let pot = null;
  if (wc && potActual != null) {
    const at = (arr) => (Array.isArray(arr) && arr.length ? arr[Math.min(yi, arr.length - 1)] : null);
    const p10 = at(wc.p10), p50 = at(wc.p50), p90 = at(wc.p90);
    const band = p10 == null ? null : potActual < p10 ? 'below p10' : potActual < p50 ? 'p10–p50' : potActual <= p90 ? 'p50–p90' : 'above p90';
    // "Bought by contract" only when the cone is flat over the WHOLE run — every cone is flat at year 0 (6.10.4).
    const flatAll = Array.isArray(wc.p10) && Array.isArray(wc.p90) && wc.p10.length > 1 && wc.p10.every((v, i) => Math.abs((wc.p90[i] ?? v) - v) < 1);
    pot = { actual: Math.round(potActual), p10: p10 == null ? null : Math.round(p10), p50: p50 == null ? null : Math.round(p50), p90: p90 == null ? null : Math.round(p90), band, flat: flatAll };
  }
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
