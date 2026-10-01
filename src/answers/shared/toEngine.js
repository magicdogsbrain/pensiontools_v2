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
 */
import { grossToNet, netToGross } from '../../services/TaxCalculator.js';
import { planDrawdown } from '../../services/DrawdownStrategy.js';
import { RISK_PRESETS } from '../../services/GlidepathService.js';
import { DRAWDOWN_DEFAULTS, SIMULATION_DEFAULTS } from '../../constants.js';
import { RULES, addYears } from './rules.js';
import { startWhenPensionsOpen, startAsGiven } from './household.js';

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

/** A stable text of a person, so the people can be put in a fixed order by content before any run. */
function contentKey(p) {
  return JSON.stringify([p.pots.pension, p.pots.isa, p.age, p.statePension.amountPerYear, p.statePension.startAge, p.finalSalary, p.pensionTaxFreeCash]);
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
 */
function sharesOf(runs, byPerson, moneyOf, isaOf, asGiven) {
  const available = runs.map((r) => (r.role === 'pension' && byPerson[r.index].locked ? (asGiven && r.locked ? isaOf(r) : 0) : moneyOf(r)));
  const availableTotal = available.reduce((s, v) => s + v, 0);
  if (asGiven && !(availableTotal > 0)) {
    const money = runs.map(moneyOf);
    const moneyTotal = money.reduce((s, v) => s + v, 0);
    return money.map((v) => (moneyTotal > 0 ? v / moneyTotal : 0));
  }
  return available.map((v) => (availableTotal > 0 ? v / availableTotal : 0));
}

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

  const people = household.people.map((p, index) => {
    const ageAtStart = p.age + d;
    const money = p.pots.pension + p.pots.isa;
    const spYears = statePensionStartYears(p);
    const kind = p.pots.pension > 0 ? 'pension' : p.pots.isa > 0 ? 'savings' : 'none';
    const lock = start.lockedUntil.find((l) => l.who === p.who);
    const extra = asGiven ? { work: workOf(p, ageAtStart) } : {};
    return {
      ...extra,
      who: p.who, index, key: contentKey(p),
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
  });

  const order = [...people].sort((a, b) => (a.key < b.key ? -1 : a.key > b.key ? 1 : a.index - b.index)).map((p) => p.index);
  const youngerAtStart = Math.min(...people.map((p) => p.ageAtStart));
  const wanted = household.planToAge - youngerAtStart;
  const years = Math.max(1, Math.min(RULES.maxYears, wanted));
  const capped = wanted > RULES.maxYears;
  const whoseIdx = people.reduce((best, p) => (p.ageAtStart < people[best].ageAtStart ? p.index : best), 0);
  const whose = people[whoseIdx].who;

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
    if (p.lockedYears > 0 && asGiven) {
      // the locked run: the pension closed for its first years, the ISA beside it paying meanwhile, in one run
      runs.push({ who: p.who, index, role: 'pension', money: p.money, locked: true });
    } else if (p.lockedYears > 0) {
      runs.push({ who: p.who, index, role: 'pension', money: p.pension });
      if (p.isa > 0) runs.push({ who: p.who, index, role: 'savings', money: p.isa });
    } else {
      runs.push({ who: p.who, index, role: p.kind, money: p.money });
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
  const bounds = [...cuts].sort((a, b) => a - b);
  const periods = [];
  for (let i = 0; i + 1 < bounds.length; i++) {
    const from = bounds[i];
    const to = bounds[i + 1];
    const byPerson = people.map((p) => {
      const sp = p.statePension.amount > 0 && from >= p.statePension.startYear ? p.statePension.amount : 0;
      const fs = p.finalSalary.reduce((s, f) => s + (f.amount > 0 && from >= f.startYear ? f.amount : 0), 0);
      if (asGiven) {
        // part-time earnings: a third income, taxed with the others (no National Insurance)
        const wk = p.work.reduce((s, w) => s + (from >= w.startYear && from < w.endYear ? w.amount : 0), 0);
        const g = sp + fs + wk;
        return { who: p.who, statePension: sp, finalSalary: fs, work: wk, gross: g, net: net(g), locked: from < p.lockedYears };
      }
      const g = sp + fs;
      return { who: p.who, statePension: sp, finalSalary: fs, gross: g, net: net(g), locked: from < p.lockedYears };
    });
    // The pots pay the rest, shared between the runs by the money each can draw on in this period: a closed
    // pension draws on nothing until it opens.
    const shares = sharesOf(runs, byPerson, (r) => r.money, (r) => people[r.index].isa, asGiven);
    periods.push({ from, to, byPerson, shares, netTotal: byPerson.reduce((s, b) => s + b.net, 0), spPaidCount: byPerson.filter((b) => b.statePension > 0).length });
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
    const extraAsGiven = !asGiven ? {} : {
      lockedMonths: run.locked ? 12 * Math.min(p.lockedYears, years) : 0,
      lockedSchedule: new Array(years).fill(0),
      ...(Number.isFinite(env.savingsGrowth) ? { isaReturn: env.savingsGrowth } : {})
    };
    const workIncomes = asGiven && run.role === 'pension'
      ? p.work.filter((w) => w.startYear < years).map((w) => ({ startYear: w.startYear, endYear: Math.min(years, w.endYear) - 1, annual: w.amount, indexation: ind() }))
      : [];
    run.base = {
      equityStart: pension * mix.equity, bondStart: pension * mix.bond, cashStart: pension * mix.cash,
      equityMin: pension * mix.equity, bondMin: pension * mix.bond, cashTarget: pension * mix.cash,
      years, duration: years,
      baseSalary: 0, other: 0,
      spStartYear: p.statePension.startYear, spWeeklyAmount: run.role === 'pension' ? p.statePension.amount / 52 : 0, spFirstYearRatio: 1,
      pa: BANDS.pa, brl: BANDS.brl, hrl: BANDS.hrl, taxMode: 'inflates',
      protectionMult: SIMULATION_DEFAULTS.PROTECTION_MULTIPLIER, protectionEscalateMonths: 12,
      consecutiveLimit: DRAWDOWN_DEFAULTS.CONSECUTIVE_LIMIT, disableProtection: true,
      recoveryBuffer: DRAWDOWN_DEFAULTS.RECOVERY_BUFFER,
      hodlEnabled: false, hodlValue: 0,
      isaBalance: isa,
      strategyId: 'pots-and-valves',
      accessMethod: run.role === 'pension' && p.taxFreeQuarter ? 'ufpls' : 'drawdown',
      ufplsYears: null, ufplsThenPcls: false, bandFillRecycle: false,
      dbAmount: fs0 && run.role === 'pension' ? fs0.amount : 0, dbStartYear: fs0 ? fs0.startYear : 0, dbIndexation: ind(),
      extraIncomes: run.role !== 'pension' ? [] : [...fsMore.map((f) => ({ startYear: f.startYear, endYear: null, annual: f.amount, indexation: ind() })), ...workIncomes],
      windfalls: [], extraWithdrawals: [], taxableStart: 0, taxableMix: null, giaTaxBand: 'basic', bedAndIsa: false, relevantEarnings: 0,
      spendingProfile: 'flat',
      targetSchedule: null,
      ...extraAsGiven
    };
  }

  const startDate = start.date;
  const asGivenFields = !asGiven ? {} : { asGiven: true, perFuture: Boolean(opts.pots === 'perFuture') };
  return {
    ...asGivenFields,
    today, startDate, start: startDate.slice(0, 7), yearsFromNow: d, startMoved: start.moved, movedBy: start.movedBy, movedFor: start.movedFor,
    locked: start.locked, lockedUntil: start.lockedUntil,
    accessAge: start.accessAge, years, capped, wanted, planToAge: household.planToAge,
    endAge: youngerAtStart + years, startAge: youngerAtStart, whose, people, order, periods, runs, mix,
    totalPots: total, totalPension: people.reduce((s, p) => s + p.pension, 0), totalIsa: people.reduce((s, p) => s + p.isa, 0),
    guaranteedAYear, spCount,
    // the band's floor (band.js kLow: an amount every future lasts at). Under asGiven part-time work can end, so the
    // guaranteed take-home can fall: the floor is the lowest over the plan. Without work it is the first period's.
    guaranteedAtStartAYear: asGiven ? Math.min(...periods.map((p) => p.netTotal)) : periods[0].netTotal,
    endDate: addYears(startDate, years)
  };
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
 */
export function configsAt(plan, H, pots = null) {
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
 */
export function breakdownAt(plan, H, pots = null) {
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
