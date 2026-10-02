/**
 * The saving path of a plan locked while still saving, drawn on V7's saving-years engine (6.22.0, plan document
 * version 3; research/saver-lock-and-savings-growth.md §4.2; the owner's decision (A) of 2 Oct 2026: "for NEW locks use
 * V7's saving-years engine (one future per life, 1-in-10 line) for the saving path").
 *
 * Until 6.22.0 the path was the FCA's three fixed rates (2/5/8% nominal), pension only, in the prices of the day it was
 * drawn (PlanDocument.buildAccumulationPath — still used to READ the documents locked before; services/SaverReading.js).
 * This one:
 *  - counts the pension AND the ISA, and what goes into each every month (the Accumulation planner's contributions,
 *    grossed up, and "Into ISAs and savings"), both raised each year by the planner's "Raise contributions by";
 *  - grows them on 1,000 futures, one per life (V7's lives, seed 0 — the same lives V7's question B uses), month by
 *    month: the pension at the saving mix (what you hold, diversifiers counted with bonds; else the plan's allocation),
 *    sliding to the plan's allocation over the last ten years; the ISA as the plan says ("Mostly cash": the cash factor;
 *    "Invested like my pension": the pension's mix; no choice: the fixed 3% a year the engines run such a plan at) — or,
 *    when the ISA funds in the list of funds to test decide, at those funds' own mix (their runs follow them);
 *    the plan's fund and platform charge off every month;
 *  - stores, for the start of each year to the stop, the middle line and the 1-in-10 bad and good lines of pension + ISA,
 *    in pounds of the day (`nominal`, what a recorded pot is compared with — each future carries its own prices, so no
 *    price guess is needed) and in the prices of the day it was drawn (`real`, what the document's table shows); the
 *    pension's and the ISA's own middle lines; and what had gone in.
 *
 * Loaded only when a plan is locked or its document refreshed (index.html imports src/ui/savingPathForLock.js, which
 * imports this with `await import`): it is the first part of today's app to use V7's engine (src/answers), and the main
 * bundle stays as it was. Pure: no DOM, no storage, no clock (the caller passes `now`). Plain JSON out — no typed arrays,
 * functions or lives (CLAUDE.md: never store functions or samples in the plan document).
 */
import { livesList } from '../answers/shared/lives.js';
import { savingPlan, savingYearsByLife } from '../answers/shared/saving.js';
import { bandIndexes } from '../answers/shared/band.js';
import { contributionBreakdown } from './AccumulationEngine.js';
import { proportions as holdingsProportions, pensionPotFromHoldings } from './Holdings.js';
import { holdingsLines, normaliseWrapper, numOrNull } from './HoldingsRecord.js';
import { chargesPctOf, monthlyChargeFactor } from './Charges.js';
import { isaGrowthOf } from './IsaGrowth.js';
import { isaFundsSavingMix } from './IsaFunds.js';
import { RISK_PRESETS } from './GlidepathService.js';
import { ISA_DEFAULTS } from '../constants.js';

export const SAVING_PATH_VERSION = 3;
export const SAVING_PATH_LIVES = 1000;
export const SAVING_PATH_SEED = 0;

const num = (v) => (Number.isFinite(+v) ? +v : 0);
const r0 = (v) => Math.round(v);
const monthKey = (d) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');

/** Shares : bonds : cash of a mix, as shares of 1. Null when there is nothing in it. */
function mix3(equity, bond, cash) {
  const t = num(equity) + num(bond) + num(cash);
  return t > 0 ? { equity: num(equity) / t, bond: num(bond) / t, cash: num(cash) / t } : null;
}

/** The pension's mixes: while saving (what you hold, else the plan's allocation) and at the stop (the plan's allocation). */
export function savingPathMixes(settings, prop) {
  const s = settings || {};
  const drawing = mix3(s.equityMin, s.bondMin, s.cashTarget) || { ...RISK_PRESETS.balanced };
  const held = prop && prop.total > 0 ? mix3(prop.buckets.shares, (prop.buckets.bonds || 0) + (prop.buckets.diversifiers || 0), prop.buckets.cash) : null;
  return { saving: held || drawing, drawing, fromHoldings: !!held };
}

/** The ISA lines under What you hold, summed; null when there are none. */
function isaFromHoldings(lines) {
  const isa = lines.filter((l) => l && normaliseWrapper(l.wrapper) === 'ISA' && numOrNull(l.value) != null);
  return isa.length ? isa.reduce((t, l) => t + numOrNull(l.value), 0) : null;
}

/** careful / middling / good positions of a list of n figures (V7's bandIndexes): sorted upwards. */
function spread(values) {
  const s = Array.from(values).sort((a, b) => a - b);
  const at = bandIndexes(s.length);
  return { careful: r0(s[at.careful]), middling: r0(s[at.middling]), good: r0(s[at.good]) };
}

/**
 * Draw the path.
 * @param {object} a  { settings (Stress), timing (deriveTiming), accumulation (the planner's saved inputs), holdings (the
 *                    record or its lines), now, lives?, env? ({ futureReturns } for tests: V7's lives.js) }
 * @returns {null | object}  null unless retiring later; the block stored as `planDocument.accumulation`
 */
export function buildSavingPath({ settings = {}, timing, accumulation = null, holdings = null, now = new Date(), lives: count = SAVING_PATH_LIVES, env = {} } = {}) {
  if (!timing || timing.mode !== 'future' || !(timing.currentAge > 0)) return null;
  const s = settings || {};
  const a = accumulation || {};
  const lines = holdingsLines(holdings);
  const prop = lines.length ? holdingsProportions(lines) : null;
  const fromLedger = pensionPotFromHoldings(lines);
  const potNow = fromLedger > 0 ? fromLedger : (num(a.potNow) > 0 ? num(a.potNow) : null);
  const isaLedger = isaFromHoldings(lines);
  const isaNow = isaLedger != null ? isaLedger : Math.max(0, num(s.isaBalance));
  let totalMonthly = 0;
  try { if (num(a.netMonthly) > 0 || num(a.employerMonthly) > 0) totalMonthly = contributionBreakdown({ netMonthly: num(a.netMonthly), salary: num(a.salary), schemeType: a.schemeType || 'ras', employerMonthly: num(a.employerMonthly) }).totalMonthly || 0; } catch (e) { totalMonthly = 0; }
  if (!(totalMonthly > 0) && prop && prop.contributions.monthly > 0) totalMonthly = prop.contributions.monthly;
  const isaMonthly = num(a.isaMonthly) > 0 ? num(a.isaMonthly) : 0;
  const escalationPct = num(a.escalationPct);
  const years = Math.max(0, Math.round(timing.shapeAgeNow - timing.currentAge));
  const chargesPct = chargesPctOf(s);
  const isaGrowth = isaGrowthOf(s);
  // An ISA made of the ISA funds in the list of funds to test: the runs follow those funds whatever the choice says, so the
  // path does too — the funds' own mix on the same futures (review of 6.22.0; services/IsaFunds.js).
  const fundsMix = isaFundsSavingMix(s);
  const mixes = savingPathMixes(s, prop);
  const head = {
    version: SAVING_PATH_VERSION, asOf: monthKey(now), drawnAt: now.toISOString(), lives: count, seed: SAVING_PATH_SEED,
    startAge: timing.currentAge, retireAge: timing.shapeAgeNow, years,
    potNow: potNow == null ? null : r0(potNow), potSource: potNow == null ? null : (fromLedger > 0 ? 'holdings' : 'accumulation'),
    isaNow: r0(isaNow), isaSource: isaLedger != null ? 'holdings' : 'settings',
    totalMonthly: r0(totalMonthly), isaMonthly: r0(isaMonthly), escalationPct, chargesPct,
    isaGrowth, ...(fundsMix ? { isaFromFunds: true, isaMix: fundsMix } : isaGrowth ? {} : { isaReturn: Number.isFinite(+s.isaReturn) ? +s.isaReturn : ISA_DEFAULTS.RETURN }),
    mixes: { saving: mixes.saving, drawing: mixes.drawing, fromHoldings: mixes.fromHoldings },
    mixText: prop && prop.total > 0 ? (Math.round(prop.buckets.shares * 100) + '% shares · ' + Math.round(prop.buckets.bonds * 100) + '% bonds · ' + Math.round((prop.buckets.diversifiers || 0) * 100) + '% diversifiers · ' + Math.round(prop.buckets.cash * 100) + '% cash') : null
  };
  // Locked with no pension pot on record: the gap is recorded, never a path from the pots the strategy was tested on.
  if (potNow == null) return JSON.parse(JSON.stringify({ ...head, path: [] }));

  const household = {
    people: [{ who: 'you', age: 0, pots: { pension: potNow, isa: isaNow }, saving: { payIn: { total: totalMonthly }, savingsIn: isaMonthly } }],
    chargesPct, ...(isaGrowth ? { isaGrowth } : {}), portfolio: { kind: 'risk', level: 'balanced' }
  };
  const plan = savingPlan(household, years, { mix: mixes.drawing, savingMix: mixes.saving });
  const lives = livesList(count, years + 1, { seed: SAVING_PATH_SEED, ...(env.futureReturns ? { futureReturns: env.futureReturns } : {}) });
  const esc = escalationPct / 100;
  const out = savingYearsByLife(plan, 0, lives, { escalation: esc, ...(fundsMix ? { savingsMix: fundsMix } : {}) });
  const W = years + 1;
  if (!isaGrowth && !fundsMix) {
    // No choice (a plan locked before it, unlocked again without one): the ISA at the fixed rate the engines run such a
    // plan at — each month's payment in, the month's growth, then the charge; the same in every future in pounds of the day.
    const q = Math.pow(1 + head.isaReturn, 1 / 12), chargeM = monthlyChargeFactor(chargesPct);
    const fixed = new Float64Array(W);
    let sav = isaNow; fixed[0] = sav;
    for (let y = 0; y < years; y++) {
      const pay = isaMonthly * Math.pow(1 + esc, y);
      for (let m = 0; m < 12; m++) sav = (sav + pay) * q * chargeM;
      fixed[y + 1] = sav;
    }
    for (let i = 0; i < count; i++) for (let y = 0; y < W; y++) out.savings[i * W + y] = fixed[y];
  }
  const path = [];
  const tot = new Float64Array(count), real = new Float64Array(count), pen = new Float64Array(count), penReal = new Float64Array(count), isa = new Float64Array(count), isaReal = new Float64Array(count);
  for (let y = 0; y < W; y++) {
    for (let i = 0; i < count; i++) {
      const k = i * W + y, P = out.price[k];
      pen[i] = out.pension[k]; isa[i] = out.savings[k]; tot[i] = pen[i] + isa[i];
      real[i] = tot[i] / P; penReal[i] = pen[i] / P; isaReal[i] = isa[i] / P;
    }
    path.push({
      year: y, age: timing.currentAge + y,
      nominal: spread(tot), real: spread(real),
      pension: { middling: spread(pen).middling, real: spread(penReal).middling },
      isa: { middling: spread(isa).middling, real: spread(isaReal).middling },
      paidIn: r0(out.paidIn[y])
    });
  }
  return JSON.parse(JSON.stringify({ ...head, path }));
}
