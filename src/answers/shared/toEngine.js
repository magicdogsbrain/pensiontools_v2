/**
 * The one adapter from the household model to today's engine (answer-C-and-household.md 1.6; build brief 4.3).
 *
 *   enginePlan(household, env, opts?)     everything that does not depend on the amount: the start, the years,
 *                                          each person's ages, incomes by year, share of the pots, base config
 *   configsAt(plan, takeHomeAYear, pots?) one engine config per person with money to draw, at one household amount
 *   toEngine(household, takeHomeAYear, env) → { plan, configs }
 *   breakdownAt(plan, takeHomeAYear, pots?)  what the amount is made of, period by period, at today's prices
 *
 * Questions A and B (step 4 brief 4.5) call enginePlan with { start: 'asGiven', pots: 'perFuture' }:
 *   - the start is the stop (household.js startAsGiven), never moved. A holder still under the earliest pension age
 *     there has ONE run carrying their pension and their ISA, with the pension closed for its first lockedMonths
 *     (the fast path's locked run: the ISA pays the savings-only target `lockedSchedule` meanwhile). Periods are
 *     still cut where the pension opens. No separate savings run.
 *   - part-time work (otherIncome kind 'work') is a third income in each period (taxed as income, no National
 *     Insurance) and, for a pension run, an engine income that ends (extraIncomes[].endYear).
 *   - the pots differ by future: the plan is built on the largest over the lives (the band's ceiling only), and
 *     configsAt / breakdownAt take one future's per-person { pension, isa } and rebuild the sleeves and the shares.
 * Without opts nothing here differs from question C's adapter, line for line (C's pinned outputs keep it so).
 *
 * The household target is a level take-home at today's prices. Guaranteed income fills it first; the pots pay
 * the rest, shared between the people by their share of the household's money at the start. Each person's
 * engine target for a year is the before-tax figure that delivers their share after tax (1.6, steps 1–5).
 * A pension whose holder is under the earliest pension age at the start (household.js startWhenPensionsOpen)
 * is closed until they reach it: it draws nothing and has no share until then, and the others' money pays.
 *
 * Today's engine runs one person at a time and never edits itself here: it gets a flat config in the shape
 * createSimulationConfigFromSettings builds, with the default way of taking the money fixed: pots-and-valves
 * with its automatic cut switched off, a quarter of each pension withdrawal tax-free, tax bands rising with prices.
 * The household's fund and platform charge (household.chargesPct, percent a year; 6.19.0) rides on every run's config.
 *
 * COUPLES WHO STOP WORK IN DIFFERENT YEARS (research/v7/couples-different-years.md 4.3; asGiven only). With every stop in
 * one year nothing below applies and every plan, config and breakdown is today's, key for key. Otherwise (`plan.apart`):
 *   - the household's clock starts at the first stop; the other's money joins G years later (their `join`);
 *   - each run starts at its holder's own stop: `offset` g, `years` D − g; its State Pension, final-salary pension and
 *     income start years, and its schedules, are the household's less g (floored at 0);
 *   - a period is cut at G. Before it the one still working is `working`: no income of theirs counts (a State Pension or
 *     final-salary pension paid to them goes with their pay), and their pay covers `payCovers` of what is spent — the
 *     pots pay the rest (`potsShare` = 1 − payCovers), shared among the runs of the people who have stopped;
 *   - the first stopper's run gets cover months (12G) when the pay also makes up what their money cannot (`coversGap`);
 *   - configsAt gives ONE entry for the two runs ('joined': the first stopper's config, run with the hand-over at the
 *     second stop — joinAt — then the joiner's), a plain entry for a run alone, and an 'unpaid' entry when the need of
 *     the years apart falls on nobody's money and the pay does not make it up (a run-out in that month);
 *   - after the second stop, when one run's money runs out the other's pays all of what the pots pay (passOnAt): the
 *     household runs out only when both have. (A same-year couple keeps today's rule: the first run to run out ends it.)
 */
import { grossToNet, netToGross } from '../../services/TaxCalculator.js';
import { planDrawdown } from '../../services/DrawdownStrategy.js';
import { RISK_PRESETS } from '../../services/GlidepathService.js';
import { DRAWDOWN_DEFAULTS, SIMULATION_DEFAULTS } from '../../constants.js';
import { isChargesPct } from '../../services/Charges.js';
import { RULES, addYears } from './rules.js';
import { startWhenPensionsOpen, startAsGiven, stopsOf, APART, PAY_COVERS } from './household.js';

/** The tax bands the answers use, at today's prices (they rise with prices inside the engine). */
export const BANDS = { pa: RULES.personalAllowance, brl: RULES.basicRateLimit, hrl: RULES.higherRateLimit };

/** The share of the pots a person's money must be to draw before the plan is "mostly in one name" (warning one-name). */
export const ONE_NAME_SHARE = 0.8;

const net = (g) => grossToNet(g, BANDS.pa, BANDS.brl, BANDS.hrl);
const gross = (n) => netToGross(n, BANDS.pa, BANDS.brl, BANDS.hrl);

/** The mix the pots are held in, as shares of the whole. */
export function mixOf(portfolio) {
  if (portfolio && portfolio.kind === 'mix') return { equity: portfolio.equity, bond: portfolio.bond, cash: portfolio.cash };
  const p = RISK_PRESETS[(portfolio && portfolio.level) || 'balanced'];
  return { equity: p.equity, bond: p.bond, cash: p.cash };
}

/** A person's whole-year State Pension start age on the engine's yearly grid (months round up: the later year). */
export function statePensionStartYears(person) {
  const a = person.statePension.startAge;
  return a.years + (a.months > 0 ? 1 : 0);
}

/**
 * A stable text of a person, so the people can be put in a fixed order by content before any run. Couples apart: their
 * own stop is part of it (`S`), so swapping "you" and "partner" with their stops gives the same runs in the same order;
 * with one stop for both it is left out, and the text is today's.
 */
function contentKey(p, S) {
  const k = [p.pots.pension, p.pots.isa, p.age, p.statePension.amountPerYear, p.statePension.startAge, p.finalSalary, p.pensionTaxFreeCash];
  if (S !== undefined) k.push(S);
  return JSON.stringify(k);
}

/**
 * A person with savings but no pension pot is run WITHOUT their State Pension or final-salary pension in the
 * engine, on a target that is the before-tax equivalent of their share alone. The engine then meets the target
 * from the ISA — its "rescue" pays the after-tax value of what the empty pension could not, which for an income
 * with no fixed part is exactly the share — while the adapter counts their pensions and the tax on them itself.
 * (With the pensions inside the run, the engine would ask the savings to make good a final-salary pension eroded
 * by inflation above its 5% cap, and a small ISA would fail the whole household over pennies.)
 */
export function savingsTargetFor(need) {
  return need > 0 ? gross(need) : 0;
}

/**
 * The part-time work of a person (otherIncome kind 'work'), in years from the start: [startYear, endYear) — the earnings
 * before tax, a year, at today's prices. Question A's lever (step 4 brief 4.10).
 */
function workOf(p, ageAtStart) {
  return (Array.isArray(p.otherIncome) ? p.otherIncome : [])
    .filter((o) => o && o.kind === 'work' && o.amountPerYear > 0 && Number.isFinite(o.fromAge) && Number.isFinite(o.toAge))
    .map((o) => ({ amount: o.amountPerYear, startYear: Math.max(0, o.fromAge - ageAtStart), endYear: o.toAge - ageAtStart }))
    .filter((w) => w.endYear > w.startYear);
}

/**
 * The share of the household's need each run pays in one period: by the money each can draw on there. A closed pension
 * draws on nothing (C), or, in the locked run of asGiven, on its ISA only. Under asGiven, when nothing at all can be
 * drawn on in a period (every pension closed and no savings), the need still falls to the runs by their money — so a
 * locked run with no ISA is asked to pay and fails, as it must, instead of the need going unpaid.
 * `moneyOf(run)` and `isaOf(run)`: the run's money and its holder's ISA (the plan's, or one future's).
 * Couples apart: a run whose holder is still working in the period (its offset after the period's start, `from`) has
 * nothing to draw on yet and no part of the need — nor of the fallback. Without offsets every run counts, as before.
 */
function sharesOf(runs, byPerson, moneyOf, isaOf, asGiven, from = 0) {
  const on = (r) => !(r.offset > from);
  const available = runs.map((r) => (!on(r) ? 0 : r.role === 'pension' && byPerson[r.index].locked ? (asGiven && r.locked ? isaOf(r) : 0) : moneyOf(r)));
  const availableTotal = available.reduce((s, v) => s + v, 0);
  if (asGiven && !(availableTotal > 0)) {
    const money = runs.map((r) => (on(r) ? moneyOf(r) : 0));
    const moneyTotal = money.reduce((s, v) => s + v, 0);
    return money.map((v) => (moneyTotal > 0 ? v / moneyTotal : 0));
  }
  return available.map((v) => (availableTotal > 0 ? v / availableTotal : 0));
}

/** The share of what the household spends that the pots pay in a period: 1 − payCovers while one of a couple apart is still working, else all of it. */
export const potsShareOf = (per) => (per.potsShare === undefined ? 1 : per.potsShare);

/**
 * The money each run draws on, for one future's pots (per person { pension, isa }, in plan.people order): a savings run
 * its ISA; a pension run its pension, and its ISA too unless it is C's closed pension beside a savings run of its own.
 */
function runMoneyFor(plan, run, pots) {
  const q = pots[run.index];
  if (run.role === 'savings') return q.isa;
  const p = plan.people[run.index];
  return (p.lockedYears > 0 && !plan.asGiven) ? q.pension : q.pension + q.isa;
}

/**
 * Everything about a household that does not depend on the amount taken.
 * @param {import('./household.js').Household} household   the full form (expandHousehold)
 * @param {{ today: string, savingsGrowth?: number }} env   savingsGrowth (tests only, asGiven only): the ISA's rate a year in the runs
 * @param {{ start?: 'asGiven', pots?: 'perFuture' }} [opts]   questions A and B (see the head of this file); absent for C
 */
export function enginePlan(household, env, opts = {}) {
  const asGiven = Boolean(opts && opts.start === 'asGiven');
  const today = env.today;
  const start = asGiven ? startAsGiven(household, today) : startWhenPensionsOpen(household, today);
  const d = start.yearsFromNow;
  const total = household.people.reduce((s, p) => s + p.pots.pension + p.pots.isa, 0);
  const mix = mixOf(household.portfolio);
  // Couples who stop in different years (asGiven only): each person's own stop and the year their money joins, counted
  // from the household's start (the first stop). Every join 0 — one stop for everyone — is today's plan, key for key.
  const stops = asGiven && household.people.length > 1 ? stopsOf(household, today) : null;
  const G = stops ? Math.max(...stops.map((s) => s.join)) : 0;
  const apart = G > 0;

  const people = household.people.map((p, index) => {
    const ageAtStart = p.age + d;
    const money = p.pots.pension + p.pots.isa;
    const spYears = statePensionStartYears(p);
    const kind = p.pots.pension > 0 ? 'pension' : p.pots.isa > 0 ? 'savings' : 'none';
    const lock = start.lockedUntil.find((l) => l.who === p.who);
    const extra = asGiven ? { work: workOf(p, ageAtStart) } : {};
    const out = {
      ...extra,
      who: p.who, index, key: apart ? contentKey(p, stops[index].S) : contentKey(p),
      ageToday: p.age, ageAtStart,
      pension: p.pots.pension, isa: p.pots.isa, money,
      share: total > 0 ? money / total : 0,
      kind,
      // A pension still out of reach at the start: closed for `lockedYears` from the start, open from `untilAge`.
      lockedYears: lock ? lock.years : 0, untilAge: lock ? lock.untilAge : null,
      taxFreeQuarter: p.pensionTaxFreeCash !== 'alreadyTaken',
      statePension: { amount: p.statePension.amountPerYear, startAge: spYears, startYear: Math.max(0, spYears - ageAtStart), inPayment: p.statePension.amountPerYear > 0 && spYears <= ageAtStart },
      finalSalary: p.finalSalary.map((f) => ({ amount: f.amountPerYear, startAge: f.startAge, startYear: Math.max(0, f.startAge - ageAtStart), increases: f.increases }))
    };
    // couples apart: the year (from the start) their money joins, and their age at their own stop
    if (apart) { out.join = stops[index].join; out.ageAtStop = ageAtStart + stops[index].join; }
    return out;
  });

  const order = [...people].sort((a, b) => (a.key < b.key ? -1 : a.key > b.key ? 1 : a.index - b.index)).map((p) => p.index);
  const youngerAtStart = Math.min(...people.map((p) => p.ageAtStart));
  const wanted = household.planToAge - youngerAtStart;
  const years = Math.max(1, Math.min(RULES.maxYears, wanted));
  const capped = wanted > RULES.maxYears;
  const whoseIdx = people.reduce((best, p) => (p.ageAtStart < people[best].ageAtStart ? p.index : best), 0);
  const whose = people[whoseIdx].who;
  // The pay line of a couple apart: what the worker's pay covers of what is spent until the second stop, and whether it
  // also makes up what the stopped person's money cannot (the owner's switch; never under "None of it").
  const payCovers = !apart ? 0 : household.untilBothStop && Object.values(PAY_COVERS).includes(household.untilBothStop.payCovers)
    ? household.untilBothStop.payCovers : PAY_COVERS[APART.payCoversDefault];
  const coversGap = apart && payCovers > 0 && APART.payCoversGap;
  if (apart && G >= years) throw new Error(`enginePlan: the second stop (${G} years after the first) is not before the end of the plan (${years} years)`);

  /**
   * The engine runs: one per person with money to draw — except a person whose pension is still closed at the
   * start. Today's engine has no way to keep a pension shut while the ISA beside it is spent, so for them the
   * pension is one run, left alone (invested) until it opens, and their savings are a run of their own for the
   * whole plan, drawn like a person with savings only. The two are put together again in the breakdown and the
   * month-by-month rows.
   */
  const runs = [];
  for (const index of order) {
    const p = people[index];
    if (p.kind === 'none') continue;
    // couples apart: each run starts at its holder's own stop
    const at = apart ? { offset: p.join } : {};
    if (p.lockedYears > 0 && asGiven) {
      // the locked run: the pension closed for its first years, the ISA beside it paying meanwhile, in one run
      runs.push({ who: p.who, index, role: 'pension', money: p.money, locked: true, ...at });
    } else if (p.lockedYears > 0) {
      runs.push({ who: p.who, index, role: 'pension', money: p.pension });
      if (p.isa > 0) runs.push({ who: p.who, index, role: 'savings', money: p.isa });
    } else {
      runs.push({ who: p.who, index, role: p.kind, money: p.money, ...at });
    }
  }

  // Guaranteed income before tax, per person per year, at today's prices; and the periods it is constant in.
  // A pension that opens part-way through cuts a period too: the shares of the pots change on that day.
  const cuts = new Set([0, years]);
  for (const p of people) {
    if (p.statePension.amount > 0 && p.statePension.startYear > 0 && p.statePension.startYear < years) cuts.add(p.statePension.startYear);
    for (const f of p.finalSalary) if (f.amount > 0 && f.startYear > 0 && f.startYear < years) cuts.add(f.startYear);
    if (p.lockedYears > 0 && p.lockedYears < years) cuts.add(p.lockedYears);
    if (asGiven) for (const w of p.work) for (const y of [w.startYear, w.endYear]) if (y > 0 && y < years) cuts.add(y);
  }
  if (apart) cuts.add(G);                                            // the second stop: the pay stops covering
  const bounds = [...cuts].sort((a, b) => a - b);
  const periods = [];
  for (let i = 0; i + 1 < bounds.length; i++) {
    const from = bounds[i];
    const to = bounds[i + 1];
    const byPerson = people.map((p) => {
      if (apart && from < p.join) {
        // still working: their pay covers their part, and a State Pension or final-salary pension paid to them meanwhile
        // goes with it ('pay-keeps-pensions'); nothing of theirs is drawn or counted
        return { who: p.who, statePension: 0, finalSalary: 0, work: 0, gross: 0, net: 0, locked: false, working: true };
      }
      const sp = p.statePension.amount > 0 && from >= p.statePension.startYear ? p.statePension.amount : 0;
      const fs = p.finalSalary.reduce((s, f) => s + (f.amount > 0 && from >= f.startYear ? f.amount : 0), 0);
      if (asGiven) {
        // part-time earnings: a third income, taxed with the others (no National Insurance)
        const wk = p.work.reduce((s, w) => s + (from >= w.startYear && from < w.endYear ? w.amount : 0), 0);
        const g = sp + fs + wk;
        const b = { who: p.who, statePension: sp, finalSalary: fs, work: wk, gross: g, net: net(g), locked: from < p.lockedYears };
        if (apart && from < G) b.working = false;
        return b;
      }
      const g = sp + fs;
      return { who: p.who, statePension: sp, finalSalary: fs, gross: g, net: net(g), locked: from < p.lockedYears };
    });
    // The pots pay the rest, shared between the runs by the money each can draw on in this period: a closed
    // pension draws on nothing until it opens (and, couples apart, a run still to start draws on nothing yet).
    const shares = sharesOf(runs, byPerson, (r) => r.money, (r) => people[r.index].isa, asGiven, from);
    const per = { from, to, byPerson, shares, netTotal: byPerson.reduce((s, b) => s + b.net, 0), spPaidCount: byPerson.filter((b) => b.statePension > 0).length };
    if (apart && from < G) per.potsShare = 1 - payCovers;           // the worker's pay covers the rest
    periods.push(per);
  }

  // Once every income has started (whether or not inside the plan): the household's guaranteed take-home.
  const guaranteedAYear = people.reduce((s, p) => s + net(p.statePension.amount + p.finalSalary.reduce((t, f) => t + f.amount, 0)), 0);
  const spCount = people.filter((p) => p.statePension.amount > 0).length;

  // The engine runs: one per person with money to draw. The engine is told every final-salary pension rises with
  // prices in full, whatever the household says it does. With the cap inside the run the engine draws on the pot to
  // make good whatever the cap takes off in a high-inflation future: a £100,000 pot beside a £20,000 pension then
  // adds nothing at the careful amount, and a pot of £1 sinks a household, so more pension or more pot could mean
  // a smaller answer. Here the pot's job is its share of the household's need; what the scheme pays is what the
  // scheme pays. The month-by-month rows carry the pension as the household says it rises (answer.js
  // incomesByMonth), so a capped pension is seen to fall behind in such a future, and the trace check allows for
  // it (tests/v7/c/exceptions.md).
  const ind = () => 'cpi';
  for (const run of runs) {
    const p = people[run.index];
    const [fs0, ...fsMore] = p.finalSalary.filter((f) => f.amount > 0);
    const pension = run.role === 'pension' ? p.pension : 0;
    // a savings run beside a closed pension carries the savings only; every other run carries all the person has
    // (under asGiven the locked run carries the ISA too: it pays while the pension is closed)
    const isa = run.role === 'savings' ? p.isa : (p.lockedYears > 0 && !asGiven) ? 0 : p.isa;
    // Couples apart: a run that starts at its holder's own stop, g years after the household's — its own clock, D − g
    // years long, every start year the household's less g (floored at 0). g = 0 is the household's clock, as before.
    const g = run.offset > 0 ? run.offset : 0;
    const runYears = g > 0 ? years - g : years;
    const shift = g > 0 ? (y) => Math.max(0, y - g) : (y) => y;
    const extraAsGiven = !asGiven ? {} : {
      lockedMonths: run.locked ? 12 * Math.min(g > 0 ? p.lockedYears - g : p.lockedYears, runYears) : 0,
      lockedSchedule: new Array(runYears).fill(0),
      ...(Number.isFinite(env.savingsGrowth) ? { isaReturn: env.savingsGrowth } : {})
    };
    const workIncomes = !(asGiven && run.role === 'pension') ? []
      : g > 0
        ? p.work.filter((w) => w.startYear < years && w.endYear > g).map((w) => ({ startYear: shift(w.startYear), endYear: Math.min(years, w.endYear) - 1 - g, annual: w.amount, indexation: ind() }))
        : p.work.filter((w) => w.startYear < years).map((w) => ({ startYear: w.startYear, endYear: Math.min(years, w.endYear) - 1, annual: w.amount, indexation: ind() }));
    run.base = {
      equityStart: pension * mix.equity, bondStart: pension * mix.bond, cashStart: pension * mix.cash,
      equityMin: pension * mix.equity, bondMin: pension * mix.bond, cashTarget: pension * mix.cash,
      years: runYears, duration: runYears,
      baseSalary: 0, other: 0,
      spStartYear: shift(p.statePension.startYear), spWeeklyAmount: run.role === 'pension' ? p.statePension.amount / 52 : 0, spFirstYearRatio: 1,
      pa: BANDS.pa, brl: BANDS.brl, hrl: BANDS.hrl, taxMode: 'inflates',
      protectionMult: SIMULATION_DEFAULTS.PROTECTION_MULTIPLIER, protectionEscalateMonths: 12,
      consecutiveLimit: DRAWDOWN_DEFAULTS.CONSECUTIVE_LIMIT, disableProtection: true,
      recoveryBuffer: DRAWDOWN_DEFAULTS.RECOVERY_BUFFER,
      hodlEnabled: false, hodlValue: 0,
      isaBalance: isa,
      strategyId: 'pots-and-valves',
      accessMethod: run.role === 'pension' && p.taxFreeQuarter ? 'ufpls' : 'drawdown',
      ufplsYears: null, ufplsThenPcls: false, bandFillRecycle: false,
      dbAmount: fs0 && run.role === 'pension' ? fs0.amount : 0, dbStartYear: fs0 ? shift(fs0.startYear) : 0, dbIndexation: ind(),
      extraIncomes: run.role !== 'pension' ? [] : [...fsMore.map((f) => ({ startYear: shift(f.startYear), endYear: null, annual: f.amount, indexation: ind() })), ...workIncomes],
      windfalls: [], extraWithdrawals: [], taxableStart: 0, taxableMix: null, giaTaxBand: 'basic', bedAndIsa: false, relevantEarnings: 0,
      spendingProfile: 'flat',
      targetSchedule: null,
      ...extraAsGiven,
      // Fund and platform charges (6.19.0): the household's one charge, percent a year, on every run — the pension's
      // sleeves and the ISA, while drawing and while a pension is closed. Only a valid charge is handed on: without one
      // the config is exactly what it was (the engine reads a missing charge as 0; the household model gives 0.5).
      ...(isChargesPct(household.chargesPct) ? { chargesPct: household.chargesPct } : {}),
      // Couples apart: the first stopper's months before the second stop, when the worker's pay makes up a shortfall
      ...(apart && g === 0 && coversGap ? { coverMonths: 12 * G } : {})
    };
  }

  const startDate = start.date;
  const asGivenFields = !asGiven ? {} : { asGiven: true, perFuture: Boolean(opts.pots === 'perFuture') };
  const plan = {
    ...asGivenFields,
    today, startDate, start: startDate.slice(0, 7), yearsFromNow: d, startMoved: start.moved, movedBy: start.movedBy, movedFor: start.movedFor,
    locked: start.locked, lockedUntil: start.lockedUntil,
    accessAge: start.accessAge, years, capped, wanted, planToAge: household.planToAge,
    endAge: youngerAtStart + years, startAge: youngerAtStart, whose, people, order, periods, runs, mix,
    totalPots: total, totalPension: people.reduce((s, p) => s + p.pension, 0), totalIsa: people.reduce((s, p) => s + p.isa, 0),
    guaranteedAYear, spCount,
    // the band's floor (band.js kLow: an amount every future lasts at). Under asGiven part-time work can end, so the
    // guaranteed take-home can fall: the floor is the lowest over the plan. Without work it is the first period's.
    // Couples apart: the lowest, over the periods the pay does not cover, of what the guaranteed incomes pay for when the
    // pots pay only their share (netTotal / potsShare) — every period under "None of it".
    guaranteedAtStartAYear: apart ? floorApart(periods, G, coversGap) : asGiven ? Math.min(...periods.map((p) => p.netTotal)) : periods[0].netTotal,
    endDate: addYears(startDate, years)
  };
  if (apart) {
    const firstIndex = people.findIndex((p) => p.join === 0);
    plan.apart = { first: people[firstIndex].who, firstIndex, years: G, payCovers, coversGap, joins: people.map((p) => p.join) };
  }
  return plan;
}

/**
 * The band's floor for a couple apart (couples-different-years.md 4.3 i): the least, over the periods in which a
 * shortfall would be a run-out, of the household amount the guaranteed incomes cover there — netTotal over the share
 * the pots pay. The years apart do not count when the pay makes up any gap; a period whose pots pay nothing (All of it)
 * never runs out.
 */
function floorApart(periods, G, coversGap) {
  let least = Infinity;
  for (const per of periods) {
    const share = potsShareOf(per);
    if (!(share > 0) || (per.from < G && coversGap)) continue;
    least = Math.min(least, per.netTotal / share);
  }
  return Number.isFinite(least) ? least : Math.min(...periods.map((p) => p.netTotal));
}

/** The before-tax target of each run by period at one household take-home a year. A closed pension is given nothing to draw. */
function targetsAt(plan, H) {
  return plan.periods.map((per) => {
    const R = Math.max(0, H - per.netTotal);
    return plan.runs.map((run, r) => {
      const b = per.byPerson[run.index];
      const need = per.shares[r] * R;
      if (run.role === 'pension') return b.locked ? 0 : gross(b.net + need);
      if (run.role === 'savings') return savingsTargetFor(need);
      return 0;
    });
  });
}

/**
 * One engine config per run — a person with money to draw, or two for a person whose pension is closed at the
 * start — at a household take-home of `H` a year (today's prices).
 *
 * `pots` (questions A and B: one future's pots): per person, in plan.people order, { pension, isa } at today's prices
 * at the start. The sleeves, the floors and the ISA are rebuilt from them, and the shares of the need between the runs
 * (a couple's money differs by future). Under asGiven each locked run's `lockedSchedule` holds the savings-only target
 * of its closed years (savingsTargetFor of its share of the need), its `targetSchedule` the ordinary one after.
 * @returns {{ who: string, index: number, role: 'pension' | 'savings', config: object }[]}   in the fixed content order
 *   Couples apart (plan.apart): see apartConfigsAt — a 'joined' entry for the two runs, plain entries for a run alone
 *   (in run order), and an 'unpaid' entry last when the need of the years apart falls on nobody's money uncovered.
 */
export function configsAt(plan, H, pots = null) {
  if (plan.apart) return apartConfigsAt(plan, H, pots);
  if (!pots && !plan.asGiven) {
    const targets = targetsAt(plan, H);
    return plan.runs.map((run, r) => {
      const schedule = new Array(plan.years);
      plan.periods.forEach((per, k) => { for (let y = per.from; y < per.to; y++) schedule[y] = targets[k][r]; });
      return { who: run.who, index: run.index, role: run.role, config: { ...run.base, baseSalary: schedule[0], targetSchedule: schedule } };
    });
  }
  const shares = pots
    ? plan.periods.map((per) => sharesOf(plan.runs, per.byPerson, (run) => runMoneyFor(plan, run, pots), (run) => pots[run.index].isa, plan.asGiven))
    : plan.periods.map((per) => per.shares);
  const mix = plan.mix;
  return plan.runs.map((run, r) => {
    const schedule = new Array(plan.years);
    const locked = run.locked ? new Array(plan.years).fill(0) : null;
    plan.periods.forEach((per, k) => {
      const R = Math.max(0, H - per.netTotal);
      const b = per.byPerson[run.index];
      const need = shares[k][r] * R;
      const t = run.role === 'pension' ? (b.locked ? 0 : gross(b.net + need)) : run.role === 'savings' ? savingsTargetFor(need) : 0;
      const lt = locked && b.locked ? savingsTargetFor(need) : 0;
      for (let y = per.from; y < per.to; y++) { schedule[y] = t; if (locked) locked[y] = lt; }
    });
    let base = run.base;
    if (pots) {
      const q = pots[run.index];
      const p = plan.people[run.index];
      const pension = run.role === 'pension' ? q.pension : 0;
      const isa = run.role === 'savings' ? q.isa : (p.lockedYears > 0 && !plan.asGiven) ? 0 : q.isa;
      base = {
        ...base,
        equityStart: pension * mix.equity, bondStart: pension * mix.bond, cashStart: pension * mix.cash,
        equityMin: pension * mix.equity, bondMin: pension * mix.bond, cashTarget: pension * mix.cash,
        isaBalance: isa
      };
    }
    const config = { ...base, baseSalary: schedule[0], targetSchedule: schedule };
    if (locked) config.lockedSchedule = locked;
    return { who: run.who, index: run.index, role: run.role, config };
  });
}

// ---- couples who stop work in different years (couples-different-years.md 4.3) -------------------------------------

/** The pots of a couple apart to work from: one future's (per person { pension, isa }), or the plan's own. */
const potsOrPlan = (plan, pots) => pots || plan.people.map((p) => ({ pension: p.pension, isa: p.isa }));

/** Each period's shares of the need between the runs, on these pots (a run still to start has none). */
function apartShares(plan, q) {
  const moneyOf = (run) => runMoneyFor(plan, run, q);
  const isaOf = (run) => q[run.index].isa;
  return plan.periods.map((per) => sharesOf(plan.runs, per.byPerson, moneyOf, isaOf, true, per.from));
}

/**
 * Run r's targets by year of the household's clock (and, for a locked run, the savings-only targets of its closed years),
 * at a household take-home of H a year with these shares. Years before `from` are left at 0 (the caller fills them).
 */
function scheduleOn(plan, H, r, shares, from = 0) {
  const run = plan.runs[r];
  const target = new Array(plan.years).fill(0);
  const locked = run.locked ? new Array(plan.years).fill(0) : null;
  plan.periods.forEach((per, k) => {
    if (per.to <= from) return;
    const R = Math.max(0, H * potsShareOf(per) - per.netTotal);
    const b = per.byPerson[run.index];
    const need = shares[k][r] * R;
    const t = run.role === 'pension' ? (b.locked ? 0 : gross(b.net + need)) : run.role === 'savings' ? savingsTargetFor(need) : 0;
    const lt = locked && b.locked ? savingsTargetFor(need) : 0;
    for (let y = Math.max(per.from, from); y < per.to; y++) { target[y] = t; if (locked) locked[y] = lt; }
  });
  return { target, locked };
}

/** Run r's engine config on these pots and a household-clock schedule: its own clock (the schedule from its offset). */
function apartConfig(plan, r, q, sched) {
  const run = plan.runs[r];
  const g = run.offset;
  const mix = plan.mix;
  const own = q[run.index];
  const pension = run.role === 'pension' ? own.pension : 0;
  const base = {
    ...run.base,
    equityStart: pension * mix.equity, bondStart: pension * mix.bond, cashStart: pension * mix.cash,
    equityMin: pension * mix.equity, bondMin: pension * mix.bond, cashTarget: pension * mix.cash,
    isaBalance: own.isa
  };
  const targetSchedule = g > 0 ? sched.target.slice(g) : sched.target;
  const config = { ...base, baseSalary: targetSchedule[0], targetSchedule };
  if (sched.locked) config.lockedSchedule = g > 0 ? sched.locked.slice(g) : sched.locked;
  return config;
}

/**
 * Where the need of a period falls on nobody's money — no run of someone who has stopped has any (one of them has no
 * money at all, or neither has) — while the pots must pay something there: the first such month the worker's pay makes
 * up (`coveredFrom`: before the second stop, when it covers gaps) and the first that is a run-out (`failMonth`; every
 * period without a run is one, as withoutRuns). Household clock; null when none.
 * @returns {{ failMonth: number|null, coveredFrom: number|null }}
 */
export function unpaidOf(plan, H, pots = null, shares = null) {
  const s = shares || apartShares(plan, potsOrPlan(plan, pots));
  const G = plan.apart ? plan.apart.years : 0;
  const coversGap = Boolean(plan.apart && plan.apart.coversGap);
  let failMonth = null, coveredFrom = null;
  plan.periods.forEach((per, k) => {
    const R = Math.max(0, H * potsShareOf(per) - per.netTotal);
    if (!(R > 1e-6) || s[k].reduce((t, v) => t + v, 0) > 0) return;
    if (per.from < G && coversGap) { if (coveredFrom === null) coveredFrom = per.from * 12; } else if (failMonth === null) failMonth = per.from * 12;
  });
  return { failMonth, coveredFrom };
}

/**
 * configsAt for a couple apart. One future's pots (or the plan's): each run's schedule on the household's clock from the
 * shares on those pots, then its own config from its offset. The two runs together are ONE entry — 'joined': the first
 * stopper's config (`config`), to be run with the hand-over at `month` (joinAt), then the joiner's — so a life is one
 * evaluation as before; a run alone is a plain entry. An 'unpaid' entry (`{ unpaid: true, failMonth }`) comes last when
 * the need falls on nobody's money in a month the pay does not make up.
 */
function apartConfigsAt(plan, H, pots) {
  const q = potsOrPlan(plan, pots);
  const shares = apartShares(plan, q);
  const out = [];
  const first = plan.runs.findIndex((run) => run.offset === 0);
  const join = plan.runs.findIndex((run) => run.offset > 0);
  if (first >= 0 && join >= 0) {
    const config = apartConfig(plan, first, q, scheduleOn(plan, H, first, shares));
    out.push({ who: 'both', index: -1, role: 'joined', config: { joined: { first, join, month: 12 * plan.apart.years, H, pots: q }, config } });
  } else {
    plan.runs.forEach((run, r) => out.push({ who: run.who, index: run.index, role: run.role, config: apartConfig(plan, r, q, scheduleOn(plan, H, r, shares)) }));
  }
  const unpaid = unpaidOf(plan, H, null, shares).failMonth;
  if (unpaid !== null) out.push({ who: 'nobody', index: -1, role: 'unpaid', config: { unpaid: true, failMonth: unpaid } });
  return out;
}

/**
 * The hand-over at the second stop (couples-different-years.md 4.3 f): the shares of every period from the join are set
 * again on what each has then — the first stopper's money in the run's state (sleeves and ISA over the run's price level
 * then, `state.cumInf`, which puts them at today's prices) and the joiner's pots at their own stop — by the same
 * sharesOf (the same rule for a pension still closed). → the first stopper's schedules (the same before the join, the
 * new ones from it: `first`), the joiner's config on the same shares (`join`), the shares (`shares`: null before the
 * join) and the first stopper's money at the join, today's prices (`atJoin`).
 * @param {{ equity: number, bond: number, cash: number, isa: number, cumInf: number }} state
 * @param {object} [firstConfig]   the first stopper's config (its schedules before the join are kept as they are)
 */
export function joinAt(plan, H, pots, state, firstConfig = null) {
  const G = plan.apart.years;
  const first = plan.runs.findIndex((run) => run.offset === 0);
  const join = plan.runs.findIndex((run) => run.offset > 0);
  const F = plan.runs[first];
  const c = state.cumInf;
  const atJoin = { pension: F.role === 'pension' ? (state.equity + state.bond + state.cash) / c : 0, isa: state.isa / c };
  const q = pots.map((x, j) => (j === F.index ? atJoin : x));
  const moneyOf = (run) => runMoneyFor(plan, run, q);
  const isaOf = (run) => q[run.index].isa;
  const shares = plan.periods.map((per) => (per.from < G ? null : sharesOf(plan.runs, per.byPerson, moneyOf, isaOf, true, per.from)));
  const fill = shares.map((s) => s || plan.runs.map(() => 0));
  const mine = scheduleOn(plan, H, first, fill, G);
  const before = firstConfig || apartConfig(plan, first, pots, scheduleOn(plan, H, first, apartShares(plan, pots)));
  for (let y = 0; y < G; y++) {
    mine.target[y] = before.targetSchedule[y];
    if (mine.locked) mine.locked[y] = before.lockedSchedule[y];
  }
  const out = { targetSchedule: mine.target };
  if (mine.locked) out.lockedSchedule = mine.locked;
  const J = plan.runs[join];
  return {
    first: out,
    join: join < 0 ? null : { who: J.who, index: J.index, role: J.role, config: apartConfig(plan, join, pots, scheduleOn(plan, H, join, fill, G)) },
    shares, atJoin
  };
}

/**
 * The pass-on after the second stop (couples-different-years.md 4.3 f, the engine's call of 2 Oct 2026): once one of the
 * two runs has run out, from household month `month` the other's money pays all of what the pots pay — the household runs
 * out only when both have. Fixed shares set on money alone sank a household whose first stopper came to the second stop
 * with a few hundred pounds of savings: that leftover ran dry decades early while the other's money lasted, so a little
 * more money could give a smaller answer, and savings between you counted for almost nothing once the stops differed.
 * → run r's schedules on its own clock: `before`'s (its schedules until then) for the years before that month's year, the
 * pass-on ones (all of the need, by the same rule for a pension still closed) from it; the year of `month` itself is read
 * from that month on, so the hook or the resumed run that takes them starts paying all in that very month.
 * @param {number} r   the run whose money is left (plan.runs index)
 * @param {{ targetSchedule: number[], lockedSchedule?: number[] }} before   run r's schedules until then, on its own clock
 */
export function passOnAt(plan, H, r, month, before) {
  const run = plan.runs[r];
  const g = run.offset > 0 ? run.offset : 0;
  const from = Math.floor(month / 12);
  const all = plan.periods.map(() => plan.runs.map((x, k) => (k === r ? 1 : 0)));
  const sched = scheduleOn(plan, H, r, all, from);
  const own = (a) => (g > 0 ? a.slice(g) : a);
  const target = own(sched.target);
  for (let y = 0; y < from - g && y < target.length; y++) target[y] = before.targetSchedule[y];
  const out = { targetSchedule: target };
  if (sched.locked) {
    const locked = own(sched.locked);
    const was = before.lockedSchedule || [];
    for (let y = 0; y < from - g && y < locked.length; y++) locked[y] = was[y];
    out.lockedSchedule = locked;
  }
  return out;
}

/** enginePlan then configsAt. */
export function toEngine(household, takeHomeAYear, env) {
  const plan = enginePlan(household, env);
  return { plan, configs: configsAt(plan, takeHomeAYear) };
}

/**
 * What a household take-home of `H` a year is made of, period by period, at today's prices and in the first
 * year of each period: each person's State Pension, final-salary pension, pension withdrawal, savings draw, tax
 * and take-home. £ a year. The household take-home of a period is max(H, the guaranteed take-home).
 *
 * Under asGiven each person also carries `work` (part-time earnings before tax; taxed with the rest) and
 * `pensionOpen`; a locked run's closed years are paid from the ISA (fromSavings, nothing from the pension). `pots`
 * (per person { pension, isa }) reads the shares and the ISA of one future instead of the plan's.
 *
 * Couples apart (plan.apart; 4.3 j): before the second stop each period also carries `fromPay` — what the worker's pay
 * covers, H × payCovers, plus whatever of the pots' part nobody's money can pay when the pay makes up gaps — and each
 * person `working` (true for the one still working: every figure of theirs 0). From the second stop the shares are set
 * on `atJoin` — the first stopper's money then ({ pension, isa }, today's prices; phasesAt gives the middling over the
 * lives) — and the periods are today's shape. Without `atJoin` the first stopper's money at the start is used.
 */
export function breakdownAt(plan, H, pots = null, atJoin = null) {
  if (plan.apart) return apartBreakdownAt(plan, H, pots, atJoin);
  return plan.periods.map((per) => {
    const R = Math.max(0, H - per.netTotal);
    const shares = pots ? sharesOf(plan.runs, per.byPerson, (run) => runMoneyFor(plan, run, pots), (run) => pots[run.index].isa, plan.asGiven) : per.shares;
    const byPerson = plan.people.map((p, i) => {
      const b = per.byPerson[i];
      const isaOf = pots ? pots[i].isa : p.isa;
      const needOf = (role) => { const r = plan.runs.findIndex((x) => x.index === i && x.role === role); return r < 0 ? 0 : shares[r] * R; };
      let fromPension = 0, fromSavings = 0, tax = b.gross - b.net, takeHome = b.net;
      if (p.kind === 'pension' && plan.asGiven && b.locked) {
        // the locked run while the pension is closed: its ISA pays its share of the need, after tax as it is
        fromSavings = needOf('pension'); takeHome = b.net + fromSavings;
      } else if (p.kind === 'pension') {
        // a closed pension draws nothing; its holder's savings are a run of their own (needOf('savings')) — otherwise
        // the ISA sits inside the pension run and tops up what the pension does not deliver
        const need = b.locked ? 0 : needOf('pension');
        const pd = planDrawdown({
          targetGross: gross(b.net + need), fixedIncome: b.gross, pa: BANDS.pa, brl: BANDS.brl, hrl: BANDS.hrl,
          isaBalance: isaOf > 0 && (p.lockedYears === 0 || plan.asGiven) ? 1e15 : 0, taxFreeFraction: p.taxFreeQuarter ? RULES.taxFreeShare : 0
        });
        fromPension = pd.sippGross; fromSavings = pd.isaDraw + needOf('savings'); tax = pd.tax; takeHome = pd.net + needOf('savings');
      } else if (p.kind === 'savings') {
        fromSavings = needOf('savings'); takeHome = b.net + fromSavings;
      }
      // Taxed at 40%: the taxable part of what is drawn, on top of the State Pension and final-salary pension, passes the basic-rate limit.
      const higherRate = fromPension + fromSavings > 0 && b.gross + fromPension * (p.taxFreeQuarter ? 1 - RULES.taxFreeShare : 1) > BANDS.brl + 1;
      const out = { who: p.who, statePension: b.statePension, finalSalary: b.finalSalary, fromPension, fromSavings, tax, takeHome, higherRate, locked: b.locked };
      if (plan.asGiven) {
        out.work = b.work;
        // what the work adds after tax: the take-home of the guaranteed incomes with it, less without it
        out.workAfterTax = b.work > 0 ? b.net - net(b.statePension + b.finalSalary) : 0;
        out.pensionOpen = !(p.kind === 'pension' && b.locked);
      }
      return out;
    });
    return { from: per.from, to: per.to, takeHome: Math.max(H, per.netTotal), byPerson, beforeStatePension: plan.spCount > 0 && per.spPaidCount < plan.spCount };
  });
}

/** breakdownAt for a couple apart (see breakdownAt). Always asGiven. */
function apartBreakdownAt(plan, H, pots, atJoin) {
  const G = plan.apart.years;
  const pc = plan.apart.payCovers;
  const q0 = potsOrPlan(plan, pots);
  const q1 = atJoin ? q0.map((x, j) => (j === plan.apart.firstIndex ? atJoin : x)) : q0;
  return plan.periods.map((per) => {
    const apartYears = per.from < G;
    const q = apartYears ? q0 : q1;
    const share = potsShareOf(per);
    const R = Math.max(0, H * share - per.netTotal);
    const shares = sharesOf(plan.runs, per.byPerson, (run) => runMoneyFor(plan, run, q), (run) => q[run.index].isa, true, per.from);
    const byPerson = plan.people.map((p, i) => {
      const b = per.byPerson[i];
      if (b.working) {
        return { who: p.who, statePension: 0, finalSalary: 0, fromPension: 0, fromSavings: 0, tax: 0, takeHome: 0, higherRate: false, locked: false,
          work: 0, workAfterTax: 0, pensionOpen: true, working: true };
      }
      const isaOf = q[i].isa;
      const needOf = (role) => { const r = plan.runs.findIndex((x) => x.index === i && x.role === role); return r < 0 ? 0 : shares[r] * R; };
      let fromPension = 0, fromSavings = 0, tax = b.gross - b.net, takeHome = b.net;
      if (p.kind === 'pension' && b.locked) {
        // the locked run while the pension is closed: its ISA pays its share of the need, after tax as it is
        fromSavings = needOf('pension'); takeHome = b.net + fromSavings;
      } else if (p.kind === 'pension') {
        const need = needOf('pension');
        const pd = planDrawdown({
          targetGross: gross(b.net + need), fixedIncome: b.gross, pa: BANDS.pa, brl: BANDS.brl, hrl: BANDS.hrl,
          isaBalance: isaOf > 0 ? 1e15 : 0, taxFreeFraction: p.taxFreeQuarter ? RULES.taxFreeShare : 0
        });
        fromPension = pd.sippGross; fromSavings = pd.isaDraw; tax = pd.tax; takeHome = pd.net;
      } else if (p.kind === 'savings') {
        fromSavings = needOf('savings'); takeHome = b.net + fromSavings;
      }
      const higherRate = fromPension + fromSavings > 0 && b.gross + fromPension * (p.taxFreeQuarter ? 1 - RULES.taxFreeShare : 1) > BANDS.brl + 1;
      const out = { who: p.who, statePension: b.statePension, finalSalary: b.finalSalary, fromPension, fromSavings, tax, takeHome, higherRate, locked: b.locked };
      out.work = b.work;
      out.workAfterTax = b.work > 0 ? b.net - net(b.statePension + b.finalSalary) : 0;
      out.pensionOpen = !(p.kind === 'pension' && b.locked);
      if (apartYears) out.working = false;
      return out;
    });
    if (!apartYears) {
      return { from: per.from, to: per.to, takeHome: Math.max(H, per.netTotal), byPerson, beforeStatePension: plan.spCount > 0 && per.spPaidCount < plan.spCount };
    }
    // the years apart: the pay covers its part, and — when it makes up gaps — whatever of the pots' part nobody's money can pay
    const unpaid = shares.reduce((t, v) => t + v, 0) > 0 ? 0 : R;
    const fromPay = H * pc + (plan.apart.coversGap ? unpaid : 0);
    const takeHome = (unpaid > 0 && !plan.apart.coversGap ? per.netTotal : Math.max(H * share, per.netTotal)) + H * pc;
    return { from: per.from, to: per.to, takeHome, byPerson, beforeStatePension: plan.spCount > 0 && per.spPaidCount < plan.spCount, fromPay };
  });
}
