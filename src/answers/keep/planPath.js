/**
 * THE PLAN PATH of a question's answer (7.12.0, one answer for the same household; the lead's ruling D22, step P): for one
 * person, an answer's "will it last" runs are the kept plan's own. At a household take-home of H a year, the engine config
 * is the one the plan test runs on the plan that keeping the answer at H would write:
 *
 *   inputs at H → planSeed.buildPlanSeed → PlanFromSeed.seedToScenario     the keep's own two steps (keep/keptPlan.js)
 *              → PlanReading.effectiveStressSettings                      the one settings recipe
 *              → lastsRun.planFor, weightedPlanFor                         the plan, followed on to the weighting age
 *              → its Pots & Valves config (pnvCfg), the plan's own years and glidepath
 *
 * so the take-home is grossed by the keep's own step, the State Pension's first year is the tax year's share, the final-salary
 * rule is the one stored, the cuts are the kept plan's, the glidepath runs over the plan's own length and the run goes on
 * to the weighting age as "Does it last?" goes on. The runs themselves stay on the answers' fast path (fastEngine.js, the
 * replica of `simulate`, which falls back to `simulate` for a config it does not cover — a closed pension, an ISA invested
 * without a mix), on the same futures the plan test draws (seed i × 7919 + 3, engine seed i), so a future runs out in the
 * same month here as in the plan's own run.
 *
 * The figures are the plan's (OneAnswer.js), on these runs:
 *   - the count that lasts to the plan-to age (the plan's own years) and what is typically left then (the plan's terminal,
 *     at today's prices by the future's own prices over the plan's years);
 *   - the weighted chance, each future that ran out weighed by the chance someone is alive at the start of the run YEAR it
 *     ran out in (OneAnswer.weightedFailsOf: the plan's person, life.js lifeOf) — `weigher.byMonth` holds that weight for
 *     every month, so the answers' solvers read it unchanged;
 *   - the run-out age the plan's floor line says (OneAnswer weightedPartOf floor.age: the middle run year of the futures
 *     that ran out, to the weighting age), and the bad case (the worst 1 in 10, OneAnswer.planShortfallOf when.worst).
 *
 * Loaded LAZILY (answers/index.js loadPlanPath): it reaches the strategies through lastsRun.js, which the worker's own chunk
 * never carries (tests/v7/boundaries.test.js). An answer receives it as env.planPath.
 *
 *   planCaseOf(source, ins, env, { lives, dragPct }) → the case (see below)
 *     source   'd', or 'c' from now (one person; the others follow)
 *     ins      the answer's checked inputs (levers as asked: D's work is the kept plan's work from today)
 *     lives    (T) → a livesList of at least T years (the answer's own, so every case of one answer shares its futures), or
 *              such a list
 *     fromAge  C: the age the money is first taken (today's, or moved to the day the pension opens: c/answer.js)
 *     dragPct  "Try the bad years" lower returns (7.9.0): percent a year off every pot, on the plan's config as the plan's own
 *              row puts it (lastsRun.rowPlanOf: pnvCfg.returnDragPct)
 *
 * Pure: the date is env.today; no storage, no Math.random.
 */
import { buildPlanSeed } from './planSeed.js';
import { seedToScenario } from '../../services/PlanFromSeed.js';
import { effectiveStressSettings } from '../../services/PlanReading.js';
import { jointSurvivalOf } from '../../services/LongevityModel.js';
import { planToAgeOf } from '../../services/AgeConvention.js';
import { pct } from '../../strategies/ladderEngine.js';
import { simulate } from '../../services/SimulationEngine.js';
import { isIsaGrowthMix } from '../../services/IsaGrowth.js';
import { planFor, weightedPlanFor, weighing } from '../plan/lastsRun.js';
import { lifeOf, weightedReasonOf, weightedYearsOf, planLevelOf, floorAt } from '../plan/life.js';
import { planShortfallOf } from '../../services/OneAnswer.js';
import { grossToNet } from '../../services/TaxCalculator.js';
import { leftOf as shortfallLeftOf } from '../shared/shortfall.js';
import { BANDS } from '../shared/toEngine.js';
import { lumpyByYear } from '../../services/PlanNeed.js';
import { dateOf } from '../plan/dates.js';
import { createFastRunner, prepareFutureFrom } from '../shared/fastEngine.js';
import { livesList, sliceReturns } from '../shared/lives.js';
import { STEP } from '../shared/band.js';
import { WEIGHT_ONE } from '../shared/rules.js';
import { firstOpenAge } from '../shared/household.js';
import { LEVEL_IDS } from '../shared/levels.js';

const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
const STRATEGY = 'pots-and-valves';

/** stressTest.js yearOfAge: the run year a future failed in, from its age then. */
const yearOfAge = (failAge, startAge) => Math.max(0, Math.floor(failAge - startAge + 1e-9));
/** The run year of a run-out month, as the plan test reads it (pnvRun failAge = startAge + failMonth / 12). */
export const runYearOf = (m, startAge) => yearOfAge(startAge + m / 12, startAge);

/**
 * The answer as keepable at a take-home of `perMonth` a month, from its checked inputs alone: what planSeed reads of a D
 * result (its inputs, the spend, the level's figure, the plan-to age, when the pension opens). The figures the keep stores
 * beside the plan (the answer's own chance) are not in it: no setting reads them.
 */
function resultAt(source, ins, env, perMonth, startAge = ins.you.age) {
  const level = LEVEL_IDS.includes(ins.confidence) ? ins.confidence : 'balanced';
  const levels = { [level]: { monthly: perMonth, yearly: perMonth * 12 } };
  // C from now (one person): the level's amount is what is kept, from the age today; its plan-to age the answer's end age
  if (source === 'c') {
    return {
      status: 'ok', inputs: ins, whose: 'you', level, levels, chance: {}, phases: [],
      basis: { today: env.today, endAge: ins.endAge, startAge, engineVersion: null, historyEnd: null }
    };
  }
  if (source !== 'd') throw new Error('planCaseOf: only questions C (from now) and D are on the plan path so far');
  const who = ins.household === 'couple' && ins.partner ? ['you', 'partner'] : ['you'];
  return {
    status: 'ok', inputs: ins, whose: 'you', level, levels, chance: {},
    spend: { perMonth, perYear: perMonth * 12, kind: ins.spend.kind, level: ins.spend.kind === 'level' ? ins.spend.level : null },
    pensionOpens: Object.fromEntries(who.map((w) => [w, firstOpenAge(ins[w].age, env.today, 0)])),
    basis: { today: env.today, endAge: ins.endAge, startAge: ins.you.age, engineVersion: null, historyEnd: null }
  };
}

/**
 * The plan keeping the answer at `perMonth` would write (the keep's own two steps, as keep/keptPlan.js). D's work lever,
 * when `ins` asks for it, is a try on that plan (the lead's ruling A: Keep never writes it): the same plan with the work
 * as its part-time row (planSeed `tryWork`), never what Keep stores.
 */
export function keptPlanAt(source, ins, env, perMonth, startAge = undefined) {
  const result = resultAt(source, ins, env, perMonth, startAge);
  const tryWork = source === 'd' && !!(ins.work && ins.work.has);
  const seed = buildPlanSeed({ source, result, env: { today: env.today, appVersion: '' }, name: null, createdAt: env.today + 'T00:00:00.000Z', tryWork });
  if (!seed) return null;
  return seedToScenario(seed, env.today).yours;
}

/**
 * An ISA "invested like my pension" with no mix of its own grows by the run's pension pots at the start (IsaGrowth.js
 * isaGrowthWeights, in both engines): named outright as its mix, the same weights to the bit, so the fast path can run it
 * (fastEngine.fastEligible takes 'invested' only with a mix). Any other config is returned as it is.
 */
function withIsaMix(c) {
  if (c.isaGrowth !== 'invested' || isIsaGrowthMix(c.isaGrowthMix)) return c;
  const mix = { equity: c.equityStart, bond: c.bondStart, cash: c.cashStart };
  return isIsaGrowthMix(mix) ? { ...c, isaGrowthMix: mix } : c;
}

/**
 * What the answer's WORDS read, from the kept plan alone (fault 2 of step P: one reader of the plan's incomes): the plan in
 * the shape the household plan has for the readers of what an amount is made of (toEngine.js breakdownAt, stopAt.js phasesAt,
 * c/answer.js phasesOf), who can draw before 2028 (apart.js before2028) and when the money runs out (shortfall.js
 * shortfallOf, which hands a plan carrying `shortfallAt` to it). Built from the plan's own run (planFromSettings) and its
 * settings, never from the household:
 *   - the plan's years from year 0 to the plan-to age, at the plan's start age;
 *   - in run year y, the State Pension the plan pays (p.spAnnual from p.spStartYear, a whole year: the words describe a
 *     year at today's prices, not the part year's share) and the other income that comes anyway (a final-salary pension,
 *     as the plan counts it in today's money: PlanNeed.lumpyByYear), taxed with the plan's bands and its access method (a
 *     quarter tax-free, 'ufpls', or all taxed);
 *   - a pension still closed for the plan's closed years (pnvCfg.pensionLockedMonths), its savings paying meanwhile;
 *   - what comes in anyway once all of it has started (`guaranteedAYear`, after tax);
 *   - the age today from the plan's date of birth (life.js), for the 2028 rule.
 * One person; `asGiven` (D: the work and closed-pension fields) as the household plan D read had it.
 */
function wordsPlanFrom({ p, settings, life, asGiven, planYears, planToAge }) {
  const cfg = p.pnvCfg;
  const startAge = p.startAge;
  const pa = +settings.pa > 0 ? +settings.pa : BANDS.pa, brl = +settings.brl > 0 ? +settings.brl : BANDS.brl, hrl = +settings.hrl > 0 ? +settings.hrl : BANDS.hrl;
  const net = (g) => (g > 0 ? grossToNet(g, pa, brl, hrl) : 0);
  const spStart = isNum(p.spStartYear) ? p.spStartYear : Infinity;
  const spAt = (y) => (p.spAnnual > 0 && y >= spStart ? p.spAnnual : 0);
  // the income that comes anyway (a final-salary pension, income streams), as the plan reads it before anything else is put
  // with it (PlanNeed.lumpyByYear: the plan's otherIncomeByYear also carries the savings that pay a closed pension's years,
  // which are not income that comes anyway)
  const lumpy = lumpyByYear(settings, cfg, p.durationYears).otherIncomeByYear;
  const other = lumpy.length ? lumpy : [0];
  const otherAt = (y) => +other[Math.max(0, Math.min(y, other.length - 1))] || 0;
  const lockedYears = cfg.pensionLockedMonths > 0 ? Math.ceil(cfg.pensionLockedMonths / 12) : 0;
  const pension = (cfg.equityStart || 0) + (cfg.bondStart || 0) + (cfg.cashStart || 0);
  const isa = cfg.isaBalance || 0;
  const kind = pension > 0 ? 'pension' : isa > 0 ? 'savings' : 'none';
  const ageToday = Math.floor(life.ageNow + 1e-9);
  const person = {
    who: 'you', index: 0, ageToday, ageAtStart: startAge, pension, isa, money: pension + isa, share: 1, kind,
    lockedYears, untilAge: lockedYears > 0 ? startAge + lockedYears : null, taxFreeQuarter: settings.accessMethod === 'ufpls',
    statePension: { amount: p.spAnnual > 0 ? p.spAnnual : 0, startAge: Number.isFinite(spStart) ? startAge + spStart : null, startYear: Number.isFinite(spStart) ? spStart : null, inPayment: p.spAnnual > 0 && spStart <= 0 },
    finalSalary: [], ...(asGiven ? { work: [] } : {})
  };
  // the runs as the household plan makes them (toEngine.js enginePlan): one; a closed pension with savings, D's locked run
  const runs = kind === 'none' ? [] : lockedYears > 0 && !asGiven && isa > 0
    ? [{ who: 'you', index: 0, role: 'pension', money: pension }, { who: 'you', index: 0, role: 'savings', money: isa }]
    : [{ who: 'you', index: 0, role: lockedYears > 0 ? 'pension' : kind, money: lockedYears > 0 && !asGiven ? pension : pension + isa, ...(lockedYears > 0 && asGiven ? { locked: true } : {}) }];
  const cuts = new Set([0, planYears]);
  for (let y = 1; y < planYears; y++) if (spAt(y) !== spAt(y - 1) || otherAt(y) !== otherAt(y - 1) || y === lockedYears) cuts.add(y);
  const bounds = [...cuts].sort((a, b) => a - b);
  const periods = [];
  for (let i = 0; i + 1 < bounds.length; i++) {
    const from = bounds[i];
    const sp = spAt(from), fs = otherAt(from), g = sp + fs;
    const b = { who: 'you', statePension: sp, finalSalary: fs, ...(asGiven ? { work: 0 } : {}), gross: g, net: net(g), locked: from < lockedYears };
    // the pots' share between the runs, as enginePlan shares them: a closed pension draws on nothing until it opens
    const available = runs.map((r) => (r.role === 'pension' && b.locked ? (asGiven && r.locked ? isa : 0) : r.money));
    const total = available.reduce((s, v) => s + v, 0);
    const shares = runs.length === 1 ? [1] : available.map((v) => (total > 0 ? v / total : 0));
    periods.push({ from, to: bounds[i + 1], byPerson: [b], shares, netTotal: b.net, spPaidCount: sp > 0 ? 1 : 0 });
  }
  return {
    ...(asGiven ? { asGiven: true } : {}), startAge, endAge: planToAge, years: planYears, yearsFromNow: 0, whose: 'you',
    people: [person], runs, periods, shape: null, apart: null, spCount: p.spAnnual > 0 ? 1 : 0,
    lockedUntil: lockedYears > 0 ? [{ who: 'you', years: lockedYears, untilAge: person.untilAge }] : [],
    totalPots: pension + isa, totalPension: pension, totalIsa: isa,
    guaranteedAYear: net((p.spAnnual > 0 ? p.spAnnual : 0) + Math.max(0, ...other.map((v) => +v || 0)))
  };
}

/** The fields the fast path reads once per run from its base (fastEngine.js prepareRun): every config of a case shares them. */
const PREPARED = ['equityMin', 'bondMin', 'cashTarget', 'duration', 'pa', 'brl', 'hrl', 'spendingProfile', 'spStartYear', 'spWeeklyAmount', 'spFirstYearRatio', 'dbAmount', 'dbStartYear', 'years'];
const sameBase = (a, b) => PREPARED.every((k) => a[k] === b[k]) && JSON.stringify(a.extraIncomes || []) === JSON.stringify(b.extraIncomes || []);

/**
 * One case of an answer on the plan path: the kept plan at each take-home H, the runner over the answer's lives, the plan's
 * weights and ages.
 * @returns {{ plan, sp, runner, weigher, toMonth, planYears, years, startAge, planToAge, weightToAge, level, capped,
 *   keptAt(H), settingsAt(H), floorAgeOf(months), worstAgeOf(months), leftOf(H, months), leftTermsOf(H, months) }}
 *   plan: the run's shape for the answers' solvers (verdictAt, bandAt): one run, its base the config at the spend, the
 *   plan's years to the weighting age, `startAge`, `endAge` = the plan-to age, `guaranteedAtStartAYear` 0 (the plan's first
 *   tax year pays a share of the State Pension, so nothing above £0 lasts in every future for certain), `totalPots`.
 */
export function planCaseOf(source, ins, env, { lives = null, dragPct = 0, fromAge = undefined } = {}) {
  const now = dateOf(env.today);
  const spendAYear = ins.spend && isNum(ins.spend.amount) ? ins.spend.amount * 12 : null;
  const memo = new Map();
  /** The kept plan at H a year, its settings, its plan and the plan followed on to the weighting age. */
  const at = (H) => {
    let c = memo.get(H);
    if (c) return c;
    const kept = keptPlanAt(source, ins, env, H / 12, fromAge);
    if (!kept) throw new Error('planCaseOf: the answer cannot be kept at ' + H);
    const settings = effectiveStressSettings(kept, { now });
    const p = planFor(settings, now);
    c = { kept, settings, p };
    memo.set(H, c);
    return c;
  };
  const H0 = isNum(spendAYear) && spendAYear > 0 ? spendAYear : 12 * STEP;
  const first = at(H0);
  const strategyId = first.settings.strategyId || STRATEGY;
  if (strategyId !== STRATEGY) throw new Error('planCaseOf: a kept answer draws by Pots & Valves');
  const p0 = first.p;
  // (env.lifeTable: tests only, another table in LongevityModel's shape, as weigh.js reads it)
  const table = env.lifeTable || undefined;
  const life0 = lifeOf(first.kept, now, { settings: first.settings, startAge: p0.startAge, ...(table ? { table } : {}) });
  // (env.weightToAge: tests only, the weighting age given, as weigh.js runToAgeOf reads it)
  const life = isNum(env.weightToAge) ? { ...life0, weightToAge: env.weightToAge } : life0;
  const weighted = weighing({ weighted: env.weighted });
  const reason = weighted ? weightedReasonOf(life, strategyId, p0) : 'notWeighing';
  const w = weightedYearsOf(life, p0);
  const extend = !reason && w.extend;
  const planYears = p0.durationYears;
  const years = extend ? w.years : planYears;
  const startAge = p0.startAge;
  /** The config the run makes at H: the plan's own (its years), or the plan followed on to the weighting age. */
  const configMemo = new Map();
  const drag = isNum(dragPct) && dragPct > 0 ? { returnDragPct: dragPct } : {};
  const configAt = (H) => {
    let c = configMemo.get(H);
    if (c) return c;
    const { settings, p } = at(H);
    const pRun = extend ? weightedPlanFor(settings, p, w.years, now) : p;
    c = withIsaMix({ ...pRun.pnvCfg, ...drag, years: pRun.durationYears });
    configMemo.set(H, c);
    return c;
  };
  const base = configAt(H0);
  // the plan's years, for the left at the end: the plan's own config (no run to the weighting age)
  const planConfigAt = (H) => withIsaMix({ ...at(H).p.pnvCfg, ...drag, years: planYears });

  const L = typeof lives === 'function' ? lives(years) : lives || livesList(env.futures, years, env);
  for (const l of L) if (!(l.years >= years)) throw new Error(`planCaseOf: a life of ${l.years} years is shorter than the ${years} the plan runs`);
  const n = L.length;
  const totalPots = (base.equityStart || 0) + (base.bondStart || 0) + (base.cashStart || 0) + (base.isaBalance || 0);
  const plan = {
    runs: [{ base, index: 0, role: 'pension', offset: 0 }], years, startAge, endAge: planToAgeOf(startAge, planYears),
    guaranteedAtStartAYear: 0, totalPots, shape: null, apart: null, runCapped: Boolean(w.capped && !reason), people: [{ who: 'you' }],
    // the search's ceiling (band.js bandRange) stands above the income that comes anyway, before tax, at its highest over the
    // plan's years: without it a small pot beside a State Pension already paid capped every level at the pot's own share
    guaranteedCeilingAYear: Math.max(0, ...Array.from({ length: planYears }, (_, y) => (y >= (p0.spStartYear ?? Infinity) ? p0.spAnnual || 0 : 0) + ((p0.otherIncomeByYear && p0.otherIncomeByYear[y]) || 0)))
  };
  const drawFutures = L.map((life1) => ({ id: life1.id, seed: life1.seed, returns: sliceReturns(life1, 0, years) }));
  const drivers = new Array(n).fill(null);
  const fast = createFastRunner(plan, drawFutures, { driversFor: (i) => drivers[i] || (drivers[i] = prepareFutureFrom(L[i], 0, years)) });
  const byH = new Map();
  const configsAtH = (H) => {
    let c = byH.get(H);
    if (!c) {
      const config = configAt(H);
      if (!sameBase(config, base)) throw new Error('planCaseOf: the kept plan at another amount changes more than the amount');
      c = [{ who: 'you', role: 'pension', config }];
      byH.set(H, c);
    }
    return c;
  };
  let evaluations = 0;
  let months = 0;
  const fastRun = (r, i, config, hook = null, until = null, more = null) => {
    const res = fast.run(r, i, config, hook, until, more);
    months += res.failed ? res.failMonth + 1 : until === null ? 12 * config.years : Math.min(until, 12 * config.years);
    return res;
  };
  const runner = {
    plan,
    potsFor: () => null, potsOf: () => [{ pension: base.equityStart + base.bondStart + base.cashStart, isa: base.isaBalance || 0 }],
    configsAtH: (H) => configsAtH(H),
    configsFor: (k) => configsAtH(k * STEP * 12),
    fastRun,
    driversOf: (r, i) => fast.driversOf(r, i),
    run(r, i, config) { evaluations++; return fastRun(r, i, config); },
    runUntil(r, i, config, until) {
      if (!fast.stoppable(r, config)) return this.run(r, i, config);
      evaluations++;
      return fastRun(r, i, config, null, until);
    },
    get evaluations() { return evaluations; },
    get months() { return months; }
  };

  // the plan's weights (OneAnswer.weightedFailsOf), month by month: the weight of the run year the month falls in
  const toMonth = 12 * planYears;
  const wMonths = 12 * years;
  const byMonth = new Float64Array(wMonths + 1);
  const S = jointSurvivalOf(life.people, life.d, table);
  for (let m = 0; m <= wMonths; m++) byMonth[m] = reason ? WEIGHT_ONE : Math.round(S(startAge + runYearOf(m, startAge) - life.ageNow) * WEIGHT_ONE);
  const planToAge = plan.endAge;
  const weightToAge = reason ? planToAge : Math.min(life.weightToAge, Math.round(startAge + years));
  const weigher = {
    weighted: !reason, byMonth, months: wMonths, d: life.d, years, people: life.people.map((q) => ({ ...q, who: 'you' })),
    planToAge, weightToAge, tablesVersion: life.tablesVersion || null
  };

  /** The middle run-out age of the futures that ran out, to the weighting age (OneAnswer floor.age); null when none did. */
  const floorAgeOf = (ms) => {
    const ys = ms.filter((m) => m !== null && m !== undefined).map((m) => runYearOf(m, startAge)).sort((a, b) => a - b);
    return ys.length ? Math.round(startAge + ys[Math.floor((ys.length - 1) / 2)]) : null;
  };
  /** The bad case (OneAnswer.planShortfallOf when.worst): the floor(n/10)-th earliest run-out in the plan's years, else the plan-to age. */
  const worstAgeOf = (ms) => {
    const all = ms.map((m) => (m !== null && m !== undefined && runYearOf(m, startAge) < planYears ? runYearOf(m, startAge) : Infinity)).sort((a, b) => a - b);
    const y = all[Math.floor(ms.length / 10)];
    return Number.isFinite(y) ? Math.round(startAge + y) : planToAge;
  };
  /**
   * What is left at the plan-to age at H in each future (OneAnswer's terminal, the plan's own reader): in each future that
   * lasted the plan's years, its pots then at today's prices by that future's own prices over the plan's years (the engine's
   * finalReal + finalIsa / cumInflation); £0 where it ran out. The words read these (shortfall.js leftOf), the figure
   * beside them leftOf below: one reading of what is left.
   */
  let lastLeft = null;
  const leftTermsOf = (H, ms) => {
    // (the words and the figure beside them read the same runs: the last ones are kept)
    if (lastLeft && lastLeft.H === H && lastLeft.ms === ms) return lastLeft.terms;
    const terms = new Float64Array(n);
    const config = configsAtH(H)[0].config;
    for (let i = 0; i < n; i++) {
      const m = ms[i];
      if (m !== null && m !== undefined && m < toMonth) { terms[i] = 0; continue; }
      const ret = drawFutures[i].returns;
      let cumInfl = 1;
      for (let y = 0; y < planYears; y++) cumInfl *= (1 + (ret.inflation[y] ?? 0.025));
      if (fast.stoppable(0, config)) {
        const s = fast.run(0, i, config, null, toMonth);
        terms[i] = (s.equity + s.bond + s.cash) / cumInfl + (s.isa || 0) / cumInfl;
      } else {
        const s = simulate(planConfigAt(H), sliceReturns(L[i], 0, planYears), L[i].seed);
        terms[i] = s.failed ? 0 : s.finalReal + (s.finalIsa || 0) / (s.cumInflation || 1);
      }
    }
    lastLeft = { H, ms, terms };
    return terms;
  };
  /** What is typically left at the plan-to age at H and in the best 1 in 10 (OneAnswer a.left: the plan's terminal p50, p90). */
  const leftOf = (H, ms) => {
    const terms = leftTermsOf(H, ms);
    return { typical: Math.round(pct(terms, 0.5)), best: Math.round(pct(terms, 0.9)) };
  };

  /**
   * When the money runs out, how long and how much of the plan is still paid, and what still comes in then, at H from the
   * months each future ran out in (the answers' shortfall shape, shortfall.js): the kept plan's own reading — "Does it
   * last?"'s and "Try the bad years"' (OneAnswer.planShortfallOf, on the futures these months are, the plan's own years
   * and the run followed on to the weighting age), the floor what the plan pays anyway in the middle run-out year (life.js
   * floorAt, as OneAnswer's floor line). `left`: each future's left at the plan-to age (leftTermsOf), said as the plan says it.
   */
  const shortfallAt = (ms, H, { left = null } = {}) => {
    const { p, settings } = at(H);
    const leftSaid = shortfallLeftOf(left);
    const own = ms.map((m) => m !== null && m !== undefined && m < toMonth);
    const r = { strategyId: STRATEGY, survivedMc: own.map((x) => !x), futuresMc: { failYear: ms.map((m, i) => (own[i] ? runYearOf(m, startAge) : null)) } };
    const rW = extend ? { strategyId: STRATEGY, survivedMc: ms.map((m) => m === null || m === undefined), futuresMc: { failYear: ms.map((m) => (m === null || m === undefined ? null : runYearOf(m, startAge))) } } : null;
    const s = planShortfallOf(r, p, {}, rW ? { rW, wYears: years } : {});
    if (!s.when) return { when: null, howLong: null, howMuch: 1, floor: null, ...(leftSaid ? { left: leftSaid } : {}) };
    const ys = ms.filter((m) => m !== null && m !== undefined).map((m) => runYearOf(m, startAge)).sort((a, b) => a - b);
    const y = ys[Math.floor((ys.length - 1) / 2)];
    const wp = wordsPlan();
    const b = (wp.periods.find((per) => y >= per.from && y < per.to) || wp.periods[wp.periods.length - 1]).byPerson[0];
    const yearly = floorAt(settings, p, y, now) || 0;
    const spStart = isNum(p.spStartYear) ? p.spStartYear : Infinity;
    const floor = { age: Math.round(startAge + y), yearly, survivor: null, sp: b.statePension > 0 ? 1 : 0, fs: b.finalSalary > 0,
      spAge: yearly > 0 || !(p.spAnnual > 0) || !(spStart > y) || !Number.isFinite(spStart) ? null : Math.round(startAge + spStart) };
    const howLong = s.howLong ? { paid: s.howLong.paid, of: s.howLong.of, ...(s.howLong.anyway ? { anyway: true } : {}) } : null;
    return { when: { typical: s.when.typical, worst: s.when.worst, worstLasts: s.when.worstLasts }, howLong, howMuch: s.howMuch, floor, ...(leftSaid ? { left: leftSaid } : {}) };
  };
  /** The plan the words read (wordsPlanFrom), made once: the kept plan's incomes do not change with the amount. */
  let words = null;
  const wordsPlan = () => words || (words = { ...wordsPlanFrom({ p: p0, settings: first.settings, life, asGiven: source === 'd', planYears, planToAge }), shortfallAt });

  return {
    source, plan, sp: { n, lives: L }, runner, weigher, toMonth, planYears, years, startAge, planToAge, weightToAge,
    level: planLevelOf(first.kept), capped: plan.runCapped, reason,
    keptAt: (H) => at(H).kept, settingsAt: (H) => at(H).settings,
    floorAgeOf, worstAgeOf, leftOf, leftTermsOf, shortfallAt,
    get wordsPlan() { return wordsPlan(); }
  };
}
