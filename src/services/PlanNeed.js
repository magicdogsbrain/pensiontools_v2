/**
 * The plan's need, year by year, and what pays it before the pots (7.4.1 review). The first half of the bought strategies'
 * plan (strategies/stressTest.js planFromSettings, which reads it from here exactly as it was written there): the income the
 * plan asks for in each year, the other income and lump sums that pay part of it, and the years the pension cannot yet be
 * touched (services/PensionLock.js) with what the money outside the pension pays and leaves unpaid in each. Lifted out of
 * the engine's file so the plan's home can say whether the other savings cover those years (pensionLockForSettings) without
 * carrying the engine: no strategy, no market data, no test is reached from here.
 *
 * Pure: no storage, no DOM; the clock only as `now`.
 */
import { deriveTiming, isaAtRetirementOf } from './PlanTiming.js';
import { planAsSeenFromToday } from './PlanFromToday.js';
import { grossToNet, netToGross } from './TaxCalculator.js';
import { scheduleFromSteps } from './IncomeSchedule.js';
import { activeParams } from './StrategyState.js';
import { pensionLockOf, payClosedYears } from './PensionLock.js';
import { simulationConfigFromSettings } from './SimulationConfig.js';

/** Real-terms per-year other income, extra need and windfalls from the lumpy settings (approximate indexation). */
export function lumpyByYear(settings, cfg, years, assumedCpi = 0.025) {
  const otherIncomeByYear = [], extraNeedByYear = [], windfallByYear = [];
  const real = (amount, mode, y) => mode === 'level' ? amount / Math.pow(1 + assumedCpi, y) : amount;   // cpi & lpi5 ≈ level in real terms
  for (let y = 0; y <= years; y++) {
    let inc = (cfg.other || settings.other || 0);
    if ((cfg.dbAmount || 0) > 0 && y >= (cfg.dbStartYear || 0)) inc += real(cfg.dbAmount, cfg.dbIndexation || 'lpi5', y);
    for (const s of cfg.extraIncomes || []) if (s.annual > 0 && y >= (s.startYear || 0) && (s.endYear == null || y <= s.endYear)) inc += real(s.annual, s.indexation || 'lpi5', y);
    let need = 0;
    for (const w of cfg.extraWithdrawals || []) { if (!(w.amount > 0) || w.year == null) continue; const runs = Math.max(1, w.years || 1); if (y >= w.year && y < w.year + runs) need += real(w.amount, w.indexation || 'cpi', y); }
    let lump = 0;
    // An EXISTING taxable account (GIA) is money the bought strategies can spend from day one — it
    // buys the first rungs exactly as a lump sum arriving in year 0 would (the P&V engine holds it
    // as its own taxable sleeve via pnvCfg.taxableStart, so nothing is counted twice).
    if (y === 0) lump += Math.max(0, +cfg.taxableStart || 0);
    for (const w of cfg.windfalls || []) if (w.amount > 0 && w.year === y) lump += real(w.amount, w.indexation || 'cpi', y);
    otherIncomeByYear.push(inc); extraNeedByYear.push(need); windfallByYear.push(lump);
  }
  return { otherIncomeByYear, extraNeedByYear, windfallByYear };
}

/**
 * How a BOUGHT strategy uses a windfall: the lump arrives in its year and buys the rungs from
 * then on — it pays that year's remaining need and carries forward against the years after,
 * until it is spent. Parked money is assumed to hold its real value and no more (a short gilt /
 * cash ladder; gilts in a taxable account are CGT-free, so no tax drag is modelled either —
 * slightly pessimistic on return, faithful on tax). Returns the per-year amount of need the
 * windfall pays (`usedByYear`) and the unspent balance carried at each year end (`carryByYear`).
 */
export function applyWindfallsToNeed(needNetByYear, windfallByYear) {
  const usedByYear = [], carryByYear = [];
  let carry = 0;
  for (let y = 0; y < needNetByYear.length; y++) {
    carry += (windfallByYear && windfallByYear[y]) || 0;
    const use = Math.min(carry, Math.max(0, needNetByYear[y] || 0));
    carry -= use;
    usedByYear.push(use); carryByYear.push(carry);
  }
  return { usedByYear, carryByYear };
}

/**
 * The need half of planFromSettings: every figure it reads before it sizes a strategy. `cfg` is the engine config
 * (simulationConfigFromSettings); it comes back shifted to the day of the plan's pots, with the age the run starts at.
 */
export function planNeedOf(settings, cfg, { startAge, now } = {}) {
  // A Pots & Valves plan owns no dials and is sized on its allocation (6.13.5): a "Total in your SIPP", ISA total or
  // essentials figure left in the flat bag by a deselected strategy (any plan saved before 6.13.0 and not re-saved
  // — a locked one cannot be) must not size it. Bought strategies read their bag as it is: three of them read dials
  // StrategyState files under another strategy. A what-if for another strategy must name it in settings.strategyId.
  const params = settings.strategyId === 'pots-and-valves' ? activeParams(settings) : (settings.strategyParams || {});
  // WHEN the plan starts (one saved anchor, see PlanTiming): the first tax year, the age the steps
  // start at, and — for someone retiring later — how much today's pots grow before then.
  const timing = deriveTiming(settings, now);
  if (!(startAge > 0)) startAge = timing.shapeAgeNow || 57;
  // The plan as seen from the day of its pots: the config's own offset when it carries one (a run is never shifted twice),
  // else where the settings say the pots belong, on this clock. 0 — every plan in its year 0 or before, every plan locked
  // in it, any settings that do not say — leaves everything below as it always was.
  cfg = planAsSeenFromToday(cfg, settings, timing);
  const lived = cfg.yearOffset > 0 ? cfg.yearOffset : 0;
  const yearZeroAge = startAge;
  startAge += lived;
  const alloc = (cfg.equityStart || 0) + (cfg.bondStart || 0) + (cfg.cashStart || 0) + (cfg.diversifierStart || 0);
  // The strategy settings can pin the SIPP/ISA totals fed to the ladder; otherwise the plan's pots.
  // A pinned total is today's money too, so it is projected to retirement like the pots (cfg already is).
  const pot = params.sippTotal > 0 ? params.sippTotal * timing.potScale.sipp : alloc;
  // With no ISA total pinned and no ISA today, the ISA at retirement (money going into one): PlanTiming.isaAtRetirementOf.
  const isa = params.sippTotal > 0 ? ((+params.isaTotal || 0) > 0 ? params.isaTotal * timing.potScale.isa : isaAtRetirementOf(settings, 0)) : (cfg.isaBalance || 0);
  const target = settings.baseSalary || 0;
  const spWeekly = cfg.spWeeklyAmount || settings.spWeeklyAmount || 0;
  const spAnnual = spWeekly ? spWeekly * 52 : (cfg.statePension || settings.statePension || 0);
  const spStartYear = cfg.spStartYear ?? cfg.statePensionYear ?? settings.statePensionYear ?? 99;
  // 45y: the linker universe and 150y windows both cover it. Seen from today: the years left.
  const durationYears = lived > 0 ? Math.max(1, Math.min((+settings.duration > 0 ? +settings.duration - lived : (cfg.duration || 35)), 45))
    : Math.min(settings.duration || cfg.duration || 35, 45);
  // Stepped income (60k to 72, 50k to 80, 40k after): the saved per-year schedule wins; if a plan
  // saved steps but no schedule (an old save-order bug), compile it here so nothing runs flat (from the current year on).
  const compiled = () => { const c = scheduleFromSteps(settings, yearZeroAge); return lived > 0 && Array.isArray(c) && c.length ? c.slice(Math.min(lived, c.length - 1)) : c; };
  const rawSchedule = Array.isArray(cfg.targetSchedule) && cfg.targetSchedule.length ? cfg.targetSchedule : compiled();
  // Other income (DB pension, income streams, 'other') and extra withdrawals (one-off spends), in
  // today's money, per plan year. The P&V engine handles these itself (pnvCfg keeps the raw
  // schedule); the ladder/floor strategies buy the NET need: target + extras − other income.
  const { otherIncomeByYear: otherBase, extraNeedByYear, windfallByYear } = lumpyByYear(settings, cfg, durationYears);
  const hasWindfall = windfallByYear.some((v) => v > 0);
  const hasLumpy = otherBase.some((v) => v > 0) || extraNeedByYear.some((v) => v > 0) || hasWindfall;
  const needByYear = Array.from({ length: durationYears + 1 }, (_, y) => (rawSchedule ? (rawSchedule[Math.min(y, rawSchedule.length - 1)] ?? target) : target) + extraNeedByYear[y]);
  // Windfalls: previously ignored by every bought strategy (one-off SPENDS were modelled, one-off
  // RECEIPTS were not — a bias against every ladder in the ranked table). The lump pays the need
  // from its year onward, so for the ladder builders it behaves as other income in those years
  // (the P&V engine handles the same windfalls itself through pnvCfg — see the engine).
  const windfallUse = hasWindfall ? applyWindfallsToNeed(needByYear.map((v, y) => Math.max(0, v - otherBase[y])), windfallByYear) : null;
  const otherOpen = windfallUse ? otherBase.map((v, y) => v + windfallUse.usedByYear[y]) : otherBase;
  // The years the pension cannot yet be touched (7.4.1, services/PensionLock.js), from the tax year the run starts in. The
  // bought strategies buy nothing for them from the pension: what the pots must pay in each (after other income, lump sums
  // and the taxable account, which the line above has already spent in order) is paid from the ISA, set aside at its real
  // value, and so reads as other income in those years; what the ISA cannot pay is that year's income cut. Pots & Valves
  // and Buckets close the pension in their own engine (pnvCfg.pensionLockedMonths, SimulationEngine). Null — every plan
  // whose holder can already draw — and the plan below is the object it always was.
  const lockRaw = pensionLockOf(settings, { now, fromTaxYear: timing.firstTaxYear + lived, pensionPot: pot });
  const closed = lockRaw ? Math.min(lockRaw.years, durationYears + 1) : 0;
  // The ISA is tax-free in the hand: it pays what the pension's pounds would have left after tax, on top of the year's other
  // income (the plan's own bands, which rise with prices, so they stand still in today's money).
  const bands = { pa: settings.pa ?? 12570, brl: settings.brl ?? 50270, hrl: settings.hrl ?? 125140 };
  const netAt = (g) => grossToNet(Math.max(0, g), bands.pa, bands.brl, bands.hrl);
  const closedPay = closed > 0 ? payClosedYears(needByYear.map((v, y) => Math.max(0, v - otherOpen[y])), closed, isa, {
    costOf: (y, g) => netAt(otherOpen[y] + g) - netAt(otherOpen[y]),
    grossFor: (y, m) => netToGross(netAt(otherOpen[y]) + m, bands.pa, bands.brl, bands.hrl) - otherOpen[y]
  }) : null;
  return { params, timing, cfg, lived, startAge, pot, isa, target, spAnnual, spStartYear, durationYears, rawSchedule, extraNeedByYear, windfallByYear, hasLumpy, needByYear, windfallUse, otherOpen, lockRaw, closed, closedPay };
}

/** The plan's `pensionLock` from its need (planNeedOf): the access age, the closed years and what was paid and left unpaid in each. */
export function lockOfNeed(n) {
  const { lockRaw, closed, closedPay } = n;
  return { accessAge: lockRaw.accessAge, years: closed, fromTaxYear: lockRaw.fromTaxYear, opensTaxYear: lockRaw.opensTaxYear, paid: closedPay.paid, unpaid: closedPay.unpaid };
}

/**
 * The years a plan's settings cannot take money from the pension, as its run sees them (7.4.1): planFromSettings's
 * `pensionLock` (the access age, the closed years and what the money outside the pension pays and leaves unpaid in each).
 * No test is run. Null when nothing is closed.
 */
export function pensionLockForSettings(settings, now = undefined) {
  const s = settings || {};
  const n = planNeedOf(s, simulationConfigFromSettings({}, s, now), { now, startAge: +s.shapeAgeNow || 57 });
  return n.closedPay ? lockOfNeed(n) : null;
}
