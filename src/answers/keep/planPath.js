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
import { jointSurvivalOf, weightToAge as jointWeightToAge } from '../../services/LongevityModel.js';
import { planToAgeOf } from '../../services/AgeConvention.js';
import { pct } from '../../strategies/ladderEngine.js';
import { simulate, incomeAnywayByMonth } from '../../services/SimulationEngine.js';
import { isIsaGrowthMix } from '../../services/IsaGrowth.js';
import { planFor, weightedPlanFor, weighing } from '../plan/lastsRun.js';
import { lifeOf, lifeOfSettings, keptSexOf, weightedReasonOf, weightedYearsOf, planLevelOf, floorAt } from '../plan/life.js';
import { planShortfallOf } from '../../services/OneAnswer.js';
import { grossToNet, netToGross } from '../../services/TaxCalculator.js';
import { planDrawdown } from '../../services/DrawdownStrategy.js';
import { grossUpAnnual } from '../../services/BudgetModel.js';
import { leftOf as shortfallLeftOf } from '../shared/shortfall.js';
import { BANDS } from '../shared/toEngine.js';
import { lumpyByYear } from '../../services/PlanNeed.js';
import { dateOf } from '../plan/dates.js';
import { createFastRunner, prepareFutureFrom } from '../shared/fastEngine.js';
import { livesList, sliceReturns, bondStream } from '../shared/lives.js';
import { STEP } from '../shared/band.js';
import { verdictAt } from '../shared/stopAt.js';
import { WEIGHT_ONE, accessAgeOn, RULES } from '../shared/rules.js';
import { firstOpenAge } from '../shared/household.js';
import { LEVEL_IDS } from '../shared/levels.js';
import { RISK_PRESETS } from '../../services/GlidepathService.js';
import { wantWrites } from '../plan/saving.js';
import { stressTestStrategy, pnvFamilyPlan, buysIncome, boughtCostOf, boughtLifeOf, lifeAvailableOf } from '../../strategies/stressTest.js';

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
function resultAt(source, ins, env, perMonth, startAge = ins.you.age, saver = null, phases = []) {
  const level = LEVEL_IDS.includes(ins.confidence) ? ins.confidence : 'balanced';
  const levels = { [level]: { monthly: perMonth, yearly: perMonth * 12 } };
  // B (one person, saving to a stop): the stop asked about, what goes in as now and the pots at the stop in its lives —
  // what planSeed reads of B's result (`saver`: B's own figures at the stop, b/answer.js keptSaverOf)
  // (A likewise, at the stop age of one of its rows: what planSeed reads of the row it shows)
  if (source === 'b' || source === 'a') {
    if (!saver) throw new Error('planCaseOf: a saver\'s answer needs its stop and its pots at the stop');
    return {
      status: 'ok', inputs: ins, whose: 'you', level, levels: { [level]: source === 'b' ? { pot: null, payIn: null } : {} }, chance: {}, phases: [],
      spend: { perMonth, perYear: perMonth * 12, kind: ins.spend.kind, level: ins.spend.kind === 'level' ? ins.spend.level : null },
      ...(source === 'b' ? { stop: { age: saver.stopAge } } : { shown: { age: saver.stopAge, phases } }),
      // (a couple: who the answer is about, so the keep reads the stop as that person's)
      ...(saver.askedAbout === 'partner' ? { askedAbout: 'partner' } : {}),
      saving: saver.saving, pensionOpens: saver.pensionOpens,
      basis: { today: env.today, endAge: ins.endAge, engineVersion: null, historyEnd: null }
    };
  }
  // C (one person): the level's amount is what is kept, from the start; its plan-to age the answer's end age. From a later
  // start (`saver`: the start and what goes in until then, with the pots at the start in its lives) what planSeed reads of
  // C's own result there (c/onLives.js: saving, payIn) — C's own Keep, never A's (the lead's ruling L)
  if (source === 'c') {
    return {
      status: 'ok', inputs: ins, whose: 'you', level, levels, chance: {}, phases,
      ...(saver ? { saving: saver.saving, payIn: { total: saver.saving.reduce((t, s) => t + s.payIn.total, 0), byPerson: saver.saving.map((s) => ({ who: s.who, total: s.payIn.total })) } } : {}),
      basis: { today: env.today, endAge: ins.endAge, startAge: saver ? saver.stopAge : startAge, engineVersion: null, historyEnd: null }
    };
  }
  if (source !== 'd') throw new Error('planCaseOf: only questions A, B, C (one person) and D are on the plan path so far');
  const who = ins.household === 'couple' && ins.partner ? ['you', 'partner'] : ['you'];
  return {
    status: 'ok', inputs: ins, whose: 'you', level, levels, chance: {}, phases,
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
export function keptPlanAt(source, ins, env, perMonth, startAge = undefined, saver = null) {
  const two = keptPlansAt(source, ins, env, perMonth, { startAge, saver });
  return two ? two.yours : null;
}

/**
 * Both plans keeping the answer at `perMonth` would write ({ yours, partner }: partner null for one person). A couple's
 * answer hands in `phases`, what the amount is made of person by person at it (the household's split: each one's part of
 * the take-home, guaranteed income first, the pots' part shared by the money each holds, toEngine.js breakdownAt): the
 * keep writes each one's part from them (planSeed takeHomeOf), as it does from the answer's own phases.
 */
export function keptPlansAt(source, ins, env, perMonth, { startAge = undefined, saver = null, phases = [] } = {}) {
  const result = resultAt(source, ins, env, perMonth, startAge, saver, phases);
  const tryWork = source === 'd' && !!(ins.work && ins.work.has);
  const seed = buildPlanSeed({ source, result, env: { today: env.today, appVersion: '' }, name: null, createdAt: env.today + 'T00:00:00.000Z', tryWork });
  if (!seed) return null;
  return seedToScenario(seed, env.today);
}

/**
 * A SAVED plan still saving as question B reads it at a stop and an amount (the saver verdict on a kept plan: the lead's
 * ruling 10, lead4.md D12; env.fromPlan, answers/plan/saverInputs.js): the plan itself when the stop is the plan's own and
 * H / 12 is the amount in force at it as the plan is read (`fromPlan.stopAge`, `fromPlan.monthly`); else the plan with the
 * want's own writes applied (answers/plan/saving.js wantWrites: About's stop age and What you spend's amount in force at
 * the stop, whole pounds a month after tax) — a reading of the plan with the change, never written, locked or not.
 */
export function planAtStop(fromPlan, stopAge, H, today) {
  const m = Math.round(H / 12);
  const typed = {};
  if (stopAge !== fromPlan.stopAge) typed['want.stopAge'] = String(stopAge);
  if (m !== fromPlan.monthly) typed['want.monthly'] = String(m);
  if (!Object.keys(typed).length) return fromPlan.plan;
  const w = wantWrites(fromPlan.plan, typed, { today, tryOnly: true });
  if (!w.ok) throw new Error('planAtStop: the plan cannot be read at ' + JSON.stringify(typed));
  return w.plan;
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
 *   - the age today from the plan's date of birth (life.js), for the 2028 rule;
 *   - each stretch's `months`: the months the plan pays in it (its year 0 has the tax year's months from the pots' day,
 *     year0Months; every later year 12), so a sum over a stretch counts what the plan pays; and `waitMonths` on the stretch
 *     the State Pension starts (first) in: the months of its first tax year before it pays (its first-year share);
 *   - the final-salary pension as the person's (`finalSalary`: its amount, start age and year), for the facts the words name;
 *   - a pension still closed: `pensionOpens` { accessAge, opensTaxYear }, the law's age and the tax year the plan first takes
 *     from it (p.pensionLock: the first that starts with the person at or over the age), for the words of ruling G.
 * What an amount is made of in each stretch (the split: from the pension, from savings, tax) is the kept plan's own draw at
 * that amount: `breakdownAt` (planCaseOf's splitAt), which toEngine.js breakdownAt hands such a plan to.
 * One person; `asGiven` (D: the work and closed-pension fields) as the household plan D read had it; `work`: the work the
 * kept plan holds is said (D's tried work, A's part-time work, which the keep writes: planSeed partTime).
 */
function wordsPlanFrom({ p, settings, life, asGiven, work = asGiven, planYears, planToAge, today }) {
  const cfg = p.pnvCfg;
  const startAge = p.startAge;
  const pa = +settings.pa > 0 ? +settings.pa : BANDS.pa, brl = +settings.brl > 0 ? +settings.brl : BANDS.brl, hrl = +settings.hrl > 0 ? +settings.hrl : BANDS.hrl;
  const net = (g) => (g > 0 ? grossToNet(g, pa, brl, hrl) : 0);
  const spStart = isNum(p.spStartYear) ? p.spStartYear : Infinity;
  const spAt = (y) => (p.spAnnual > 0 && y >= spStart ? p.spAnnual : 0);
  // the income that comes anyway (a final-salary pension), as the plan reads it before anything else is put
  // with it (PlanNeed.lumpyByYear: the plan's otherIncomeByYear also carries the savings that pay a closed pension's years,
  // which are not income that comes anyway)
  // (an income stream of a kept answer is D's work tried on the plan, planSeed tryWork: work, not income that comes anyway)
  const lumpy = lumpyByYear(settings, { ...cfg, extraIncomes: [] }, p.durationYears).otherIncomeByYear;
  const withWork = lumpyByYear(settings, cfg, p.durationYears).otherIncomeByYear;
  const other = lumpy.length ? lumpy : [0];
  const at = (list, y) => +list[Math.max(0, Math.min(y, list.length - 1))] || 0;
  const otherAt = (y) => at(other, y);
  const workAt = (y) => (withWork.length ? Math.max(0, at(withWork, y) - at(other, y)) : 0);
  const lockedYears = cfg.pensionLockedMonths > 0 ? Math.ceil(cfg.pensionLockedMonths / 12) : 0;
  const pension = (cfg.equityStart || 0) + (cfg.bondStart || 0) + (cfg.cashStart || 0);
  const isa = cfg.isaBalance || 0;
  const kind = pension > 0 ? 'pension' : isa > 0 ? 'savings' : 'none';
  const ageToday = Math.floor(life.ageNow + 1e-9);
  // the final-salary pension as the plan pays it: from the first year it pays, at that year's amount (today's money)
  const fsYear = other.findIndex((v) => +v > 0);
  const finalSalary = fsYear < 0 ? [] : [{ amount: otherAt(fsYear), startYear: fsYear, startAge: startAge + fsYear }];
  const year0Months = isNum(cfg.year0Months) && cfg.year0Months > 0 ? cfg.year0Months : 12;
  const monthsOf = (from, to) => 12 * (to - from) - (from === 0 && to > 0 ? 12 - year0Months : 0);
  // the State Pension's first tax year pays its share (whole months from its first month, stressTest.js): the months of that
  // year before it starts are paid from the pots, when it is the first income that comes anyway to start
  const spWait = Number.isFinite(spStart) && spStart > 0 && isNum(p.spFirstYearRatio) ? 12 - Math.round(12 * p.spFirstYearRatio) : 0;
  const waitOf = (from) => (from === spStart && spWait > 0 && !(otherAt(from) > 0) ? spWait : 0);
  const person = {
    who: 'you', index: 0, ageToday, ageAtStart: startAge, pension, isa, money: pension + isa, share: 1, kind,
    lockedYears, untilAge: lockedYears > 0 ? startAge + lockedYears : null, taxFreeQuarter: settings.accessMethod === 'ufpls',
    statePension: { amount: p.spAnnual > 0 ? p.spAnnual : 0, startAge: Number.isFinite(spStart) ? startAge + spStart : null, startYear: Number.isFinite(spStart) ? spStart : null, inPayment: p.spAnnual > 0 && spStart <= 0 },
    finalSalary, ...(work ? { work: [] } : {})
  };
  // the runs as the household plan makes them (toEngine.js enginePlan): one; a closed pension with savings, D's locked run
  const runs = kind === 'none' ? [] : lockedYears > 0 && !asGiven && isa > 0
    ? [{ who: 'you', index: 0, role: 'pension', money: pension }, { who: 'you', index: 0, role: 'savings', money: isa }]
    : [{ who: 'you', index: 0, role: lockedYears > 0 ? 'pension' : kind, money: lockedYears > 0 && !asGiven ? pension : pension + isa, ...(lockedYears > 0 && asGiven ? { locked: true } : {}) }];
  const cuts = new Set([0, planYears]);
  for (let y = 1; y < planYears; y++) if (spAt(y) !== spAt(y - 1) || otherAt(y) !== otherAt(y - 1) || workAt(y) !== workAt(y - 1) || y === lockedYears) cuts.add(y);
  const bounds = [...cuts].sort((a, b) => a - b);
  const periods = [];
  for (let i = 0; i + 1 < bounds.length; i++) {
    const from = bounds[i];
    const sp = spAt(from), fs = otherAt(from), wk = work ? workAt(from) : 0, g = sp + fs + wk;
    const b = { who: 'you', statePension: sp, finalSalary: fs, ...(work ? { work: wk } : {}), gross: g, net: net(g), locked: from < lockedYears, anyway: net(sp + fs) };
    // the pots' share between the runs, as enginePlan shares them: a closed pension draws on nothing until it opens
    const available = runs.map((r) => (r.role === 'pension' && b.locked ? (asGiven && r.locked ? isa : 0) : r.money));
    const total = available.reduce((s, v) => s + v, 0);
    const shares = runs.length === 1 ? [1] : available.map((v) => (total > 0 ? v / total : 0));
    periods.push({ from, to: bounds[i + 1], months: monthsOf(from, bounds[i + 1]), ...(waitOf(from) > 0 ? { waitMonths: waitOf(from) } : {}), byPerson: [b], shares, netTotal: b.net, spPaidCount: sp > 0 ? 1 : 0 });
  }
  return {
    ...(asGiven ? { asGiven: true } : {}), ...(work ? { withWork: true } : {}), startAge, endAge: planToAge, years: planYears, yearsFromNow: 0, whose: 'you',
    // from now: the start is this month, never moved; the earliest age a pension can be touched on that day (the law)
    start: today.slice(0, 7), startMoved: false, movedBy: 0, movedFor: [], capped: false, accessAge: accessAgeOn(today),
    people: [person], runs, periods, shape: null, apart: null, spCount: p.spAnnual > 0 ? 1 : 0,
    lockedUntil: lockedYears > 0 ? [{ who: 'you', years: lockedYears, untilAge: person.untilAge }] : [],
    pensionOpens: lockedYears > 0 && p.pensionLock && isNum(p.pensionLock.opensTaxYear) ? { accessAge: p.pensionLock.accessAge, opensTaxYear: p.pensionLock.opensTaxYear } : null,
    totalPots: pension + isa, totalPension: pension, totalIsa: isa,
    guaranteedAYear: net((p.spAnnual > 0 ? p.spAnnual : 0) + Math.max(0, ...other.map((v) => +v || 0)))
  };
}

/** The fields the fast path reads once per run from its base (fastEngine.js prepareRun): every config of a case shares them. */
const PREPARED = ['equityMin', 'bondMin', 'cashTarget', 'duration', 'pa', 'brl', 'hrl', 'spendingProfile', 'spStartYear', 'spWeeklyAmount', 'spFirstYearRatio', 'dbAmount', 'dbStartYear', 'dbIndexation', 'years'];
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
export function planCaseOf(source, ins, env, { lives = null, dragPct = 0, fromAge = undefined, saver = null, planAt = null } = {}) {
  const now = dateOf(env.today);
  const spendAYear = ins.spend && isNum(ins.spend.amount) ? ins.spend.amount * 12 : null;
  const memo = new Map();
  /** The kept plan at H a year (a saved plan's own, `planAt`), its settings, its plan and the plan followed on to the weighting age. */
  const at = (H) => {
    let c = memo.get(H);
    if (c) return c;
    const kept = planAt ? planAt(H) : keptPlanAt(source, ins, env, H / 12, fromAge, saver);
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
  // a SAVED plan draws by its own way (the lead's ruling 7): Buckets in order on the Pots & Valves family's config
  // (stressTest.pnvFamilyPlan; `simulate` runs it, as the plan test does), a way that buys its income by its own test,
  // each life buying it with its own pots at the stop or not (stressTest.boughtLifeOf, the plan test's own rule)
  const bought = !!planAt && buysIncome(strategyId);
  const ordered = !!planAt && strategyId === 'buckets-in-order';
  if (strategyId !== STRATEGY && !bought && !ordered) throw new Error('planCaseOf: a kept answer draws by Pots & Valves');
  const familyCfg = (pl) => (ordered ? pnvFamilyPlan(strategyId, pl).pnvCfg : pl.pnvCfg);
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
    c = withIsaMix({ ...familyCfg(pRun), ...drag, years: pRun.durationYears });
    configMemo.set(H, c);
    return c;
  };
  const base = configAt(H0);
  // the plan's years, for the left at the end: the plan's own config (no run to the weighting age)
  const planConfigAt = (H) => withIsaMix({ ...familyCfg(at(H).p), ...drag, years: planYears });
  /**
   * A way that buys its income at H a year (`bought`): its own test on the plan at H, on the answer's futures (the plan test's
   * seeds), at the middle pot — what each life reads when its pot buys it — and what it costs at the stop.
   */
  const boughtMemo = new Map();
  const boughtAt = (H) => {
    let b = boughtMemo.get(H);
    if (b) return b;
    const q = { ...at(H).p, mcRuns: n, stride: 1e9, stopLives: null, ...(isNum(dragPct) && dragPct > 0 ? { returnDragPct: dragPct } : {}) };
    const r = stressTestStrategy(strategyId, q);
    b = { r, cost: boughtCostOf(strategyId, r, r.configs) };
    boughtMemo.set(H, b);
    return b;
  };

  // a saver (B): the drawing years start S years from today, in each life's own years from there
  const S0 = saver ? saver.S : 0;
  // (a saver's lives given shorter than the kept plan runs, its years to the weighting age counted from the stop: the same
  // lives made longer — each is the first years of a longer one, lives.js — so the saving years read the same figures)
  const given = typeof lives === 'function' ? lives(S0 + years) : lives;
  const L = !given ? livesList(env.futures, S0 + years, env)
    : saver && given.some((l) => !(l.years >= S0 + years)) ? livesList(given.length, S0 + years, env) : given;
  for (const l of L) if (!(l.years >= S0 + years)) throw new Error(`planCaseOf: a life of ${l.years} years is shorter than the ${S0 + years} the plan needs`);
  const n = L.length;
  const totalPots = (base.equityStart || 0) + (base.bondStart || 0) + (base.cashStart || 0) + (base.isaBalance || 0);
  const plan = {
    runs: [{ base, index: 0, role: 'pension', offset: 0 }], years, startAge, endAge: planToAgeOf(startAge, planYears),
    guaranteedAtStartAYear: 0, totalPots, shape: null, apart: null, runCapped: Boolean(w.capped && !reason), people: [{ who: 'you' }],
    // the search's ceiling (band.js bandRange) stands above the income that comes anyway, before tax, at its highest over the
    // plan's years: without it a small pot beside a State Pension already paid capped every level at the pot's own share
    guaranteedCeilingAYear: Math.max(0, ...Array.from({ length: planYears }, (_, y) => (y >= (p0.spStartYear ?? Infinity) ? p0.spAnnual || 0 : 0) + ((p0.otherIncomeByYear && p0.otherIncomeByYear[y]) || 0)))
  };
  const drawFutures = L.map((life1) => ({ id: life1.id, seed: life1.seed, returns: sliceReturns(life1, S0, years) }));
  const drivers = new Array(n).fill(null);
  // the drivers of life i's drawing years: from today, the life's own; from a stop S years on, the plan test's (stressTest.js
  // stopLifeOf): the life's market read on from the stop, the engine's own bond draws (seed i) and first year's cash rule
  // starting there, as every run of the engine starts (the plan test's rule, ruling 8: a drawing life made afresh at the stop)
  const driverOf = (i) => (S0 > 0
    ? prepareFutureFrom({ returns: drawFutures[i].returns, stream: bondStream({ returns: drawFutures[i].returns, years, seed: L[i].seed }) }, 0, years)
    : prepareFutureFrom(L[i], 0, years));
  const driversFor = (i) => drivers[i] || (drivers[i] = driverOf(i));
  const fast = createFastRunner(plan, drawFutures, { driversFor });
  const byH = new Map();
  const configsAtH = (H) => {
    let c = byH.get(H);
    if (!c) {
      const config = bought ? { ...configAt(H), bought: boughtAt(H) } : configAt(H);
      if (!bought && !sameBase(config, base)) throw new Error('planCaseOf: the kept plan at another amount changes more than the amount');
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
   * A saver's lives (`atStop`: the stop runner of B, A or C from a later start, stopAt.js leftAtStop) each start from their
   * own pots at the stop: `atStop.run` is that runner's fast run (each life's pots put in as the plan test puts them) and
   * `atStop.startOf(i)` life i's pots, for a run only `simulate` can make (a final-salary pension beside the pots), which is
   * then the plan test's own (stressTest.js stopLifeOf, pnvRun: life i's config on its market from the stop, engine seed i).
   * The price level is the plan's own terminal's in every case (SimulationEngine cumInflation: a year whose prices did not
   * move is 0, where the run's models read 2.5%), never the fast path's drivers'.
   */
  let lastLeft = null;
  const leftTermsOf = (H, ms, atStop = null) => {
    // (the words and the figure beside them read the same runs: the last ones are kept)
    if (lastLeft && lastLeft.H === H && lastLeft.ms === ms && lastLeft.atStop === atStop) return lastLeft.terms;
    const terms = new Float64Array(n);
    const config = configsAtH(H)[0].config;
    for (let i = 0; i < n; i++) {
      const m = ms[i];
      if (m !== null && m !== undefined && m < toMonth) { terms[i] = 0; continue; }
      if (bought) {
        const b = boughtAt(H);
        const q = atStop ? atStop.startOf(i) : null;
        terms[i] = b.cost === null ? 0 : boughtLifeOf(b.r, i, q ? q.avail >= b.cost : true).terminal;
        continue;
      }
      const ret = drawFutures[i].returns;
      let cumInfl = 1;
      for (let y = 0; y < planYears; y++) cumInfl *= (1 + (ret.inflation[y] ?? 0.025));
      if (fast.stoppable(0, config)) {
        const s = atStop ? atStop.run(0, i, config, null, toMonth) : fast.run(0, i, config, null, toMonth);
        terms[i] = (s.equity + s.bond + s.cash) / cumInfl + (s.isa || 0) / cumInfl;
      } else {
        const q = atStop ? atStop.startOf(i) : null;
        const c = planConfigAt(H);
        const own = q ? { ...c, equityStart: q.equity, bondStart: q.bond, cashStart: q.cash, equityMin: q.equityMin ?? q.equity, bondMin: q.bondMin ?? q.bond, cashTarget: q.cashTarget ?? q.cash, isaBalance: q.isa } : c;
        const s = simulate(own, sliceReturns(L[i], S0, planYears), L[i].seed);
        terms[i] = s.failed ? 0 : s.finalReal + (s.finalIsa || 0) / (s.cumInflation || 1);
      }
    }
    lastLeft = { H, ms, atStop, terms };
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
    const r = { strategyId, survivedMc: own.map((x) => !x), futuresMc: { failYear: ms.map((m, i) => (own[i] ? runYearOf(m, startAge) : null)) } };
    const rW = extend ? { strategyId, survivedMc: ms.map((m) => m === null || m === undefined), futuresMc: { failYear: ms.map((m) => (m === null || m === undefined ? null : runYearOf(m, startAge))) } } : null;
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
  /**
   * What H a year is made of in each stretch of the words plan, as the kept plan at H draws it (SimulationEngine
   * calculateMonthlyDraw: planDrawdown on the plan's target for the year, with what comes in anyway as the fixed income, the
   * plan's bands and its tax-free share; savings counted as there), at today's prices: from the pension, from savings, the
   * tax, the take-home. A closed pension's stretch is paid from savings, what the pension's draw would have left in the hand
   * (the engine's closed months). In toEngine.js breakdownAt's shape, which hands the words plan here.
   * The target is the keep's own gross-up of H (PlanFromSeed grossRow: BudgetModel.grossUpAnnual) before the keep rounds it
   * to whole pounds: the take-home is then H itself, the amount the answer names (invariant I5), and the kept plan's month
   * differs only by that rounding (under 4p a month: Kim, below £1,500 a month, £534.11 here, £534.15 in the plan's run).
   */
  const splitAt = (H) => {
    const wp = wordsPlan();
    const cfg = at(H).p.pnvCfg;
    const person = wp.people[0];
    const f = cfg.accessMethod === 'ufpls' ? RULES.taxFreeShare : 0;
    const { pa, brl, hrl } = cfg;
    return wp.periods.map((per) => {
      const b = per.byPerson[0];
      const stored = Array.isArray(cfg.targetSchedule) && cfg.targetSchedule[per.from] != null ? cfg.targetSchedule[per.from] : cfg.baseSalary;
      const exact = grossUpAnnual(H);
      const target = stored === Math.round(exact) ? exact : stored;
      const pd = planDrawdown({ targetGross: target, fixedIncome: b.gross, pa, brl, hrl, isaBalance: person.isa > 0 ? 1e15 : 0,
        strategy: cfg.isaDrawdownStrategy, yearsUntilSp: isNum(cfg.spStartYear) ? Math.max(0, cfg.spStartYear - per.from) : 0, taxFreeFraction: f });
      const closed = person.kind === 'pension' && b.locked;
      const takeHome = Math.max(pd.net, b.net);
      // the pension draws (none while closed, none without a pension: the savings pay what the draw would have paid)
      const draws = person.kind === 'pension' && !closed;
      const fromPension = draws ? pd.sippGross : 0;
      const fromSavings = draws ? pd.isaDraw : takeHome - b.net;
      const tax = draws ? pd.tax : b.gross - b.net;
      const out = { who: person.who, statePension: b.statePension, finalSalary: b.finalSalary, fromPension, fromSavings, tax, takeHome,
        higherRate: fromPension + fromSavings > 0 && b.gross + fromPension * (1 - f) > brl + 1, locked: b.locked, pensionOpen: !b.locked };
      if (wp.withWork) Object.assign(out, { work: b.work, workAfterTax: b.work > 0 ? b.net - b.anyway : 0 });
      if (wp.asGiven) out.pensionOpen = !closed;
      return { from: per.from, to: per.to, months: per.months, ...(per.waitMonths ? { waitMonths: per.waitMonths } : {}), takeHome, byPerson: [out], beforeStatePension: wp.spCount > 0 && per.spPaidCount < wp.spCount };
    });
  };
  /** The plan the words read (wordsPlanFrom), made once: the kept plan's incomes do not change with the amount. */
  let words = null;
  const wordsPlan = () => words || (words = { ...wordsPlanFrom({ p: p0, settings: first.settings, life, asGiven: source === 'd', work: source === 'd' || source === 'a', planYears, planToAge, today: env.today }), shortfallAt, breakdownAt: splitAt });

  /**
   * A saver's pots at the stop in one life, put into the kept plan's config (createFastRunner's start values; the fast path
   * holds each pot's floor at its start, as the kept plan's config does): the pension at the plan's risk level's mix — the
   * mix the keep writes (PlanFromSeed: the intended mix is the risk level), the plan test scaling its config by the life's
   * pension over the middle — and the savings scaled as the plan test scales them. Exactly linear in the pension, so a
   * pay-in, a pot or a one-off sum asked again gives the figure the search found. (The keep writes today's pots in pounds
   * and pence, so the kept plan's own mix is the risk level's however small the pension today: PlanFromSeed.)
   */
  const preset = RISK_PRESETS[ins.risk] || RISK_PRESETS.balanced;
  const midIsa = p0.stopLives ? p0.stopLives.isa : (base.isaBalance || 0);
  const isaAt = (q) => (midIsa > 0 ? (base.isaBalance || 0) * (q.isa / midIsa) : q.isa);
  // a SAVED plan's case (`planAt`: the saver verdict on a kept plan, ruling 10): its own config scaled by the life's pension
  // over the lives' middle, pots and floors alike — the plan test's own rule (stressTest.js stopLifeOf), whatever its mix
  const midSipp = planAt && p0.stopLives && p0.stopLives.sipp > 0 ? p0.stopLives.sipp : null;
  // a way that buys its income: life i's pot that may buy it (stressTest.lifeAvailableOf, as the plan test reads its lives)
  const potsAt = bought ? (q) => ({ pension: q.pension, isa: q.isa, avail: p0.stopLives ? lifeAvailableOf(p0, q.pension, q.isa) : q.pension + q.isa }) : midSipp ? (q) => {
    const k = q.pension / midSipp;
    return { equity: base.equityStart * k, bond: base.bondStart * k, cash: base.cashStart * k,
      equityMin: base.equityMin * k, bondMin: base.bondMin * k, cashTarget: base.cashTarget * k, isa: isaAt(q) };
  } : (q) => {
    const e = q.pension * preset.equity, b = q.pension * preset.bond;
    return { equity: e, bond: b, cash: q.pension - e - b, isa: isaAt(q) };
  };

  /**
   * The stop runner's engine for a way that buys its income (stopAt.js createStopRunner): life i, with its pots at the stop
   * (`potsFor`), lasts as the way's own test says it does in future i when its pot buys it, and runs out in year 0 when it
   * cannot — the plan test's rule (stressTest.boughtLifeOf), so B's counts and searches read the plan's own test.
   */
  const runnerFor = bought ? ({ potsFor }) => ({
    eligible: [false],
    run(r, i, config) {
      const b = config.bought;
      const life = b.cost === null ? { survived: false, failYear: 0 } : boughtLifeOf(b.r, i, potsFor(r, i).avail >= b.cost);
      return life.survived ? { failed: false, failMonth: null } : { failed: true, failMonth: 12 * (isNum(life.failYear) ? life.failYear : planYears - 1) };
    },
    driversOf: () => null,
    stoppable: () => false
  }) : null;

  return {
    source, plan, sp: { n, lives: L }, runner, weigher, ...(runnerFor ? { runnerFor } : {}), toMonth, planYears, years, startAge, planToAge, weightToAge,
    S: S0, drawFutures, driversFor, configsAtH, potsAt,
    level: planLevelOf(first.kept), capped: plan.runCapped, reason,
    keptAt: (H) => at(H).kept, settingsAt: (H) => at(H).settings,
    floorAgeOf, worstAgeOf, leftOf, leftTermsOf, shortfallAt,
    get wordsPlan() { return wordsPlan(); },
    // what comes in anyway, a month after tax at today's prices, in whole £10 steps (band.js atLeastAnyway)
    // (the least over the plan's years: what comes in anyway for good — State Pension, final-salary — never work that ends)
    get anywayK() { return Math.floor(Math.min(...wordsPlan().periods.map((per) => per.byPerson[0].anyway)) / 12 / STEP + 1e-9); }
  };
}

/**
 * THE HOUSEHOLD RUN FROM TWO PLANS (7.12.0, the lead's ruling 9, step P4): one adapter feeds the couple's run from the two
 * plans' settings: two linked plans read their household figure through it (householdReadingOf, householdRun.js
 * householdLastsOf), and a couple's answer runs on it (D, C from now, A's row at which both stop today: source 'd' | 'c' |
 * 'a'), so it is the two kept plans' figure; A, C and D for couples moved together, so A's stop-now row is still C and D
 * is still C from now (tests/v7/cross/coupleIsPlans.test.js, tests/v7/cross/questions.test.js X1, tests/v7/d/identity.test.js).
 *
 *   plans at H → PlanReading.effectiveStressSettings, each       the one settings recipe
 *             → lastsRun.planFor, weightedPlanFor, each           each plan's own run, followed on to the household's
 *                                                                 weighting age
 *             → one run per plan, on the same futures, each future's market shared by both (seed i × 7919 + 3, engine
 *               seed i: the plan test's); a couple's two runs are ONE household entry for the solvers (householdOf)
 *
 * The household's money is one (step P4, fix round 1): each plan pays its own part from its own pots; once one plan's pots
 * cannot, the other's pay that part less what its owner's own income that comes anyway still pays in that future (a pension
 * whose rises are capped buys less when prices rise faster: passOnConfig), and the household runs out when the other's money
 * can no longer pay both parts — the household model's rule for a couple once both have stopped (toEngine.js passOnAt). A
 * plan with nothing to draw on is a part too: its own income pays its part while it can, the other's money after. And
 * a future that runs out is weighed by the chance either of the two is alive at the start of the run YEAR it ran out in
 * (OneAnswer's yearly rule, LongevityModel.jointSurvivalOf on both plans' people). The ages are the younger's, as the
 * household plan says them ("until the younger of you is …"). With one plan this is the plan path's own case (planCaseOf):
 * a one-person household run is the plan test (tests/v7/cross/coupleIsPlans.test.js holds it to the bit).
 *
 * Pots & Valves only; both from now, every plan drawing from this tax year (else it throws with reason 'notSameStart': a
 * plan still saving runs on its own clock; a couple who stop in different years, a spending shape, a start moved to the day
 * a pension opens and someone under the age a pension can be touched today stay on the household plan's own run:
 * couplesOnPlans).
 *
 *   coupleCaseOf(source, ins, env, { lives, dragPct, phasesAt, planAt, H0 }) → planCaseOf's case less the words (`words`
 *     stays the household plan's; wordsPlan is not given)
 *     source 'd' | 'c' | 'a' (a couple's answer from now): at H the plans keeping the answer would write (keptPlansAt), with
 *            the household's split at H (`phasesAt(H)`: the answer's phases, each one's part of the take-home); A's row hands
 *            in `saver` (its stop, what goes in as now, each one's pots), as for one person
 *     planAt () → { yours, partner }: two saved plans as they are (householdReadingOf): the plans' own amounts, H unread
 */
export function coupleCaseOf(source, ins, env, { lives = null, dragPct = 0, phasesAt = null, planAt = null, H0 = null, saver = null } = {}) {
  const now = dateOf(env.today);
  const memo = new Map();
  const at = (H) => {
    const key = planAt ? 0 : H;
    let c = memo.get(key);
    if (c) return c;
    const two = planAt ? planAt(H) : keptPlansAt(source, ins, env, H / 12, { phases: phasesAt(H), saver });
    if (!two || !two.yours) throw new Error('coupleCaseOf: the answer cannot be kept at ' + H);
    c = [two.yours, two.partner].filter(Boolean).map((kept, idx) => {
      const settings = effectiveStressSettings(kept, { now });
      if ((settings.strategyId || STRATEGY) !== STRATEGY) throw new Error('coupleCaseOf: a household run draws by Pots & Valves');
      return { who: idx === 0 ? 'you' : 'partner', kept, settings, p: planFor(settings, now) };
    });
    memo.set(key, c);
    return c;
  };
  const first = at(isNum(H0) && H0 > 0 ? H0 : 12 * STEP);
  // one clock: the household's runs read the futures from this tax year, so every plan must draw from it (a plan still
  // saving, or one that starts later, runs on its own clock: its whole lives from its stop, which this run does not make)
  if (first.some((x) => x.p.yearsToStart > 0) || new Set(first.map((x) => x.p.firstTaxYear)).size > 1) {
    throw Object.assign(new Error('coupleCaseOf: the plans do not all draw from this tax year'), { reason: 'notSameStart' });
  }
  const potsIn = (cfg) => (cfg.equityStart || 0) + (cfg.bondStart || 0) + (cfg.cashStart || 0) + (cfg.isaBalance || 0);
  // the household's ages are the younger's (the household plan's startAge); its years the longer plan's
  const table = env.lifeTable || undefined;
  const ls = first.map((x) => lifeOfSettings(x.settings, now, { sex: keptSexOf(x.kept), startAge: x.p.startAge, ...(table ? { table } : {}) }));
  const yi = ls.reduce((b, l, i) => (l.ageNow < ls[b].ageNow ? i : b), 0);
  const people = ls.map((l) => l.people[0]);
  const life0 = first.length === 1 ? ls[0]
    : { ...ls[yi], people, joint: true, weightToAge: jointWeightToAge({ people, d: ls[yi].d, ...(table ? { table } : {}) }) };
  const life = isNum(env.weightToAge) ? { ...life0, weightToAge: env.weightToAge } : life0;
  const pY = first[yi].p;
  const planYears = Math.max(...first.map((x) => x.p.durationYears));
  const startAge = pY.startAge;
  const weighted = weighing({ weighted: env.weighted });
  const reason = weighted ? null : 'notWeighing';
  const w = weightedYearsOf(life, { startAge, durationYears: planYears });
  const years = !reason && w.extend ? w.years : planYears;
  const drag = isNum(dragPct) && dragPct > 0 ? { returnDragPct: dragPct } : {};
  // the persons with money to draw, each a run (the same at every H: the amount moves only what each one draws)
  const drawing = first.map((x, idx) => idx).filter((idx) => potsIn(first[idx].p.pnvCfg) > 0);
  // a couple's household run: both plans, the one with nothing to draw on too (its part is paid by its own income that comes
  // anyway, and by the other's money once that income falls short: a pension whose rises are capped buys less in years when
  // prices rise faster) — `parts`; one plan alone: its run, as the plan test runs it
  const together = first.length > 1 && drawing.length > 0;
  const parts = together ? first.map((x, idx) => idx) : drawing;
  /** Person idx's config at H: their plan's own, followed on to `yrs` when that is longer than the plan. */
  const cfgOf = (H, idx, yrs) => {
    const { settings, p } = at(H)[idx];
    const pRun = yrs > p.durationYears ? weightedPlanFor(settings, p, yrs, now) : p;
    return withIsaMix({ ...pRun.pnvCfg, ...drag, years: yrs });
  };
  // each part's config at H (person by person, in `parts` order)
  const byH = new Map();
  const partsAtH = (H) => {
    const key = planAt ? 0 : H;
    let c = byH.get(key);
    if (!c) { c = parts.map((idx) => ({ who: first[idx].who, role: 'pension', config: cfgOf(H, idx, years) })); byH.set(key, c); }
    return c;
  };
  // the configs the answers' solvers run at H: a couple's ONE household entry (both parts, run together: householdOf), one
  // plan's own run
  const byHousehold = new Map();
  const configsAtH = (H) => {
    if (!together) return partsAtH(H);
    const key = planAt ? 0 : H;
    let c = byHousehold.get(key);
    if (!c) { c = [{ who: 'household', role: 'household', config: { household: true, H, years, parts: partsAtH(H).map((x) => x.config) } }]; byHousehold.set(key, c); }
    return c;
  };
  const H1 = isNum(H0) && H0 > 0 ? H0 : 12 * STEP;
  const bases = partsAtH(H1);
  const given = typeof lives === 'function' ? lives(years) : lives;
  const L = given || livesList(env.futures, years, env);
  for (const l of L) if (!(l.years >= years)) throw new Error(`coupleCaseOf: a life of ${l.years} years is shorter than the ${years} the plan needs`);
  const n = L.length;
  const totalPots = drawing.reduce((t, idx) => t + potsIn(first[idx].p.pnvCfg), 0);
  // what comes in anyway in each of the plan's years, before tax (the search's ceiling) and after tax (its floor), summed over
  // the two: each one's State Pension and the income that comes anyway as their plan counts it (wordsPlanFrom's reading)
  const anyway = first.map((x) => anywayByYear(x.p, x.settings, planYears));
  const gross = Array.from({ length: planYears }, (_, y) => anyway.reduce((t, a) => t + a.gross[y], 0));
  // the persons' runs (the engine's), and the plan the solvers read: a couple's one household run, one plan's own run
  const personRuns = bases.map((b, r) => ({ base: b.config, index: r, role: 'pension', offset: 0 }));
  const shared = {
    years, startAge, endAge: planToAgeOf(startAge, planYears),
    guaranteedAtStartAYear: 0, totalPots, shape: null, apart: null, runCapped: Boolean(w.capped && !reason), people: first.map((x) => ({ who: x.who })),
    guaranteedCeilingAYear: Math.max(0, ...gross)
  };
  const plan = { ...shared, runs: !drawing.length ? [] : together ? [{ base: bases[0].config, index: 0, role: 'household', offset: 0, household: true }] : personRuns };
  const drawFutures = L.map((l) => ({ id: l.id, seed: l.seed, returns: sliceReturns(l, 0, years) }));
  const drivers = new Array(n).fill(null);
  const driversFor = (i) => drivers[i] || (drivers[i] = prepareFutureFrom(L[i], 0, years));
  const fast = createFastRunner({ ...shared, runs: personRuns }, drawFutures, { driversFor });
  let evaluations = 0;
  let months = 0;
  const fastRun = (r, i, config, hook = null, until = null, more = null) => {
    const res = fast.run(r, i, config, hook, until, more);
    months += res.failed ? res.failMonth + 1 : until === null ? 12 * config.years : Math.min(until, 12 * config.years);
    return res;
  };

  /**
   * THE HOUSEHOLD'S MONEY IS ONE (step P4, fix round 1): each plan pays its own part from its own pots, and once one plan's
   * pots cannot pay its part, the other's pots pay what that one's own income that comes anyway does not cover, from then
   * on; the household runs out when the money left can no longer pay both parts (the household model's own rule for a
   * couple once both have stopped: toEngine.js passOnAt). In life i at the household config `hc`:
   *   1. each part runs as its plan runs it;
   *   2. none runs out: the household lasts;
   *   3. else part j runs out first, in month m: the other part k runs again with j's shortfall added to its own part from
   *      j's run-out year on (passOnConfig), and the household runs out when that run does (never before m: until then j
   *      paid its own part).
   * → { failed, failMonth, passOn: { from: j, to: k, month: m, config } | null } (the config k ran with).
   */
  const jointMemo = new WeakMap();
  const householdOf = (i, hc) => {
    let byLife = jointMemo.get(hc);
    if (!byLife) { byLife = new Array(n).fill(null); jointMemo.set(hc, byLife); }
    if (byLife[i]) return byLife[i];
    const res = hc.parts.map((config, r) => fastRun(r, i, config));
    let j = -1;
    res.forEach((x, r) => { if (x.failed && (j < 0 || x.failMonth < res[j].failMonth)) j = r; });
    let out;
    if (j < 0) out = { failed: false, failMonth: null, passOn: null };
    else {
      const k = j === 0 ? 1 : 0;
      const m = res[j].failMonth;
      const config = passOnConfig(hc.parts[k], hc.parts[j], drawFutures[i].returns, m);
      const again = fastRun(k, i, config);
      const failMonth = again.failed ? Math.max(m, again.failMonth) : null;
      out = { failed: failMonth !== null, failMonth, passOn: { from: j, to: k, month: m, config } };
    }
    byLife[i] = out;
    return out;
  };
  const runOne = (r, i, config) => (config.household ? householdOf(i, config) : fastRun(r, i, config));
  const runner = {
    plan,
    potsFor: () => null, potsOf: () => bases.map((b) => ({ pension: b.config.equityStart + b.config.bondStart + b.config.cashStart, isa: b.config.isaBalance || 0 })),
    configsAtH: (H) => configsAtH(H),
    configsFor: (k) => configsAtH(k * STEP * 12),
    fastRun,
    driversOf: (r, i) => fast.driversOf(r, i),
    run(r, i, config) { evaluations++; return runOne(r, i, config); },
    runUntil(r, i, config, until) {
      if (config.household || !fast.stoppable(r, config)) return this.run(r, i, config);
      evaluations++;
      return fastRun(r, i, config, null, until);
    },
    get evaluations() { return evaluations; },
    get months() { return months; }
  };

  // the weights (OneAnswer.weightedFailsOf), month by month: the chance either is alive at the start of the run year
  const toMonth = 12 * planYears;
  const wMonths = 12 * years;
  const byMonth = new Float64Array(wMonths + 1);
  const S = jointSurvivalOf(life.people, life.d, table);
  for (let m = 0; m <= wMonths; m++) byMonth[m] = reason ? WEIGHT_ONE : Math.round(S(startAge + runYearOf(m, startAge) - life.ageNow) * WEIGHT_ONE);
  const planToAge = plan.endAge;
  const weightToAge = reason ? planToAge : Math.min(life.weightToAge, Math.round(startAge + years));
  const weigher = {
    weighted: !reason, byMonth, months: wMonths, d: life.d, years, people: life.people.map((q, i) => ({ ...q, who: first[i].who })),
    planToAge, weightToAge, tablesVersion: life.tablesVersion || null
  };
  const floorAgeOf = (ms) => {
    const ys = ms.filter((m) => m !== null && m !== undefined).map((m) => runYearOf(m, startAge)).sort((a, b) => a - b);
    return ys.length ? Math.round(startAge + ys[Math.floor((ys.length - 1) / 2)]) : null;
  };
  const worstAgeOf = (ms) => {
    const all = ms.map((m) => (m !== null && m !== undefined && runYearOf(m, startAge) < planYears ? runYearOf(m, startAge) : Infinity)).sort((a, b) => a - b);
    const y = all[Math.floor(ms.length / 10)];
    return Number.isFinite(y) ? Math.round(startAge + y) : planToAge;
  };
  /**
   * What is left at the plan-to age at H in each future (planCaseOf's reading), the two plans' pots added: £0 where the
   * household ran out. Where one plan's pots ran out before the plan-to age and the other's paid on (householdOf's pass-on),
   * what is left is the other's, from the run it made paying both parts.
   */
  let lastLeft = null;
  const leftTermsOf = (H, ms) => {
    if (lastLeft && lastLeft.H === H && lastLeft.ms === ms) return lastLeft.terms;
    const terms = new Float64Array(n);
    const cs = partsAtH(H);
    const hc = together ? configsAtH(H)[0].config : null;
    for (let i = 0; i < n; i++) {
      const m = ms[i];
      if (m !== null && m !== undefined && m < toMonth) { terms[i] = 0; continue; }
      const ret = drawFutures[i].returns;
      let cumInfl = 1;
      for (let y = 0; y < planYears; y++) cumInfl *= (1 + (ret.inflation[y] ?? 0.025));
      const po = hc ? householdOf(i, hc).passOn : null;
      const handed = po && po.month < toMonth ? po : null;
      let t = 0;
      cs.forEach(({ config }, r) => {
        if (handed && r === handed.from) return;                    // its pots ran out: the other paid on
        const own = handed && r === handed.to ? handed.config : config;
        if (fast.stoppable(r, own)) {
          const s = fast.run(r, i, own, null, toMonth);
          t += (s.equity + s.bond + s.cash) / cumInfl + (s.isa || 0) / cumInfl;
        } else {
          const plain = cfgOf(H, parts[r], planYears);
          const c = handed && r === handed.to ? passOnConfig(plain, cfgOf(H, parts[handed.from], planYears), ret, handed.month) : plain;
          const s = simulate(c, sliceReturns(L[i], 0, planYears), L[i].seed);
          t += s.failed ? 0 : s.finalReal + (s.finalIsa || 0) / (s.cumInflation || 1);
        }
      });
      terms[i] = t;
    }
    lastLeft = { H, ms, terms };
    return terms;
  };
  const leftOf = (H, ms) => {
    const terms = leftTermsOf(H, ms);
    return { typical: Math.round(pct(terms, 0.5)), best: Math.round(pct(terms, 0.9)) };
  };
  const anywayNet = Array.from({ length: planYears }, (_, y) => anyway.reduce((t, a) => t + a.net[y], 0));
  return {
    source, household: true, couple: first.length > 1, plan, sp: { n, lives: L }, runner, weigher, toMonth, planYears, years, startAge, planToAge, weightToAge,
    drawFutures, driversFor, configsAtH,
    level: planLevelOf(first[0].kept), capped: plan.runCapped, reason,
    keptAt: (H) => at(H).map((x) => x.kept), settingsAt: (H) => at(H).map((x) => x.settings),
    floorAgeOf, worstAgeOf, leftOf, leftTermsOf,
    // what comes in anyway, a month after tax at today's prices, in whole £10 steps, the least over the plan's years (each
    // one's own taxed alone)
    anywayK: Math.floor(Math.min(...anywayNet) / 12 / STEP + 1e-9)
  };
}

/**
 * Whether a couple's answer from now runs on the two plans keeping it would write (coupleCaseOf), read from the household
 * plan of the stop: both stop in the same year, no spending shape, a start not moved, something to draw on, and both of
 * them at or over the age a pension can be touched today. Someone younger stays on the household plan's own run, with a
 * pension or without one (so £1 in it and nothing in it are the same run: tests/v7/c/review.test.js §2), until the lead
 * rules whose money pays a closed partner's part (step P4's question 1: in the two kept plans each pays their own closed
 * years from their own savings; the household plan lets the other's money pay).
 */
export function couplesOnPlans(plan) {
  if (!(plan.totalPots > 0) || plan.apart || plan.shape || plan.startMoved) return false;
  return plan.people.every((p) => firstOpenAge(p.ageAtStart, plan.today, 0) <= p.ageAtStart);
}

/**
 * A couple's words (the household plan: what an amount is made of, person by person) over the years the two kept plans run:
 * the household plan's own periods cut at the kept plans' plan-to age (the keep's 45-year cap, ruling H, where the household
 * plan would run on), so the phases end where the chance is counted. The plan itself when it already ends there.
 */
export function householdWordsTo(plan, c) {
  const years = c.planYears;
  if (!(plan.years > years) || plan.startAge !== c.startAge) return plan;
  return { ...plan, years, endAge: c.planToAge, capped: true,
    periods: plan.periods.filter((per) => per.from < years).map((per) => (per.to > years ? { ...per, to: years } : per)) };
}

/**
 * The household's pass-on (coupleCaseOf householdOf): part k's config paying part j's shortfall too, from the month m in
 * which j's pots could not pay j's part, in one future (its returns: the prices that future has).
 *
 * j's shortfall in run year y, today's money, after tax: j's take-home (its target after tax at its own bands, which rise with
 * prices: the engine's net target, DrawdownStrategy.planDrawdown) less what j's own income that comes anyway pays after tax
 * that year in this future (SimulationEngine.incomeAnywayByMonth: the engine's own sum, so a pension whose rises are capped
 * buys what it buys in this future's prices, and a State Pension's first year is its share). From year y on, k's target is
 * the gross whose take-home at k's bands is k's own take-home plus that shortfall (TaxCalculator.netToGross). In j's run-out
 * year the shortfall is for the months from m to the year's end, spread over the months k pays in that year (all twelve,
 * or year 0's own); a year in which nothing is short keeps k's target as it was, to the penny.
 */
export function passOnConfig(cK, cJ, returns, m) {
  const years = cK.years;
  const y1 = Math.floor(m / 12);
  const anywayJ = incomeAnywayByMonth(cJ, returns, 12 * years);
  const schedOf = (c, y) => (Array.isArray(c.targetSchedule) && c.targetSchedule[y] != null ? c.targetSchedule[y] : c.baseSalary);
  const bandsOf = (c) => ({ pa: c.pa, brl: c.brl, hrl: c.hrl || 125140 });
  const bJ = bandsOf(cJ), bK = bandsOf(cK);
  const netOf = (g, b) => (g > 0 ? grossToNet(g, b.pa, b.brl, b.hrl) : 0);
  const payingK = (y) => (y === 0 && isNum(cK.year0Months) && cK.year0Months > 0 && cK.year0Months < 12 ? cK.year0Months : 12);
  const schedule = Array.from({ length: years }, (_, y) => schedOf(cK, y));
  for (let y = y1; y < years; y++) {
    const short = netOf(schedOf(cJ, y), bJ) - netOf(anywayJ[12 * y] * 12, bJ);
    if (!(short > 0.005)) continue;
    const share = y === y1 ? Math.min(1, (12 * (y1 + 1) - m) / payingK(y)) : 1;
    schedule[y] = netToGross(netOf(schedule[y], bK) + share * short, bK.pa, bK.brl, bK.hrl);
  }
  return { ...cK, baseSalary: schedule[0], targetSchedule: schedule };
}

/**
 * What comes in anyway in each of a plan's years, before and after tax with its bands: its State Pension (a whole year from
 * its first year, as the words read it) and the income that comes anyway as the plan counts it (PlanNeed.lumpyByYear,
 * without income streams and the savings that pay a closed pension's years) — wordsPlanFrom's `anyway`, year by year.
 */
function anywayByYear(p, settings, planYears) {
  const pa = +settings.pa > 0 ? +settings.pa : BANDS.pa, brl = +settings.brl > 0 ? +settings.brl : BANDS.brl, hrl = +settings.hrl > 0 ? +settings.hrl : BANDS.hrl;
  const spStart = isNum(p.spStartYear) ? p.spStartYear : Infinity;
  const lumpy = lumpyByYear(settings, { ...p.pnvCfg, extraIncomes: [] }, p.durationYears).otherIncomeByYear;
  const other = lumpy.length ? lumpy : [0];
  const gross = Array.from({ length: planYears }, (_, y) => (p.spAnnual > 0 && y >= spStart ? p.spAnnual : 0) + (+other[Math.max(0, Math.min(y, other.length - 1))] || 0));
  return { gross, net: gross.map((g) => (g > 0 ? grossToNet(g, pa, brl, hrl) : 0)) };
}

/**
 * Two saved plans read as one household (ruling 9: a linked couple's plan gets its figure from the household run): the count
 * that lasts to the plan-to age, the weighted chance (joint), the verdict at the first plan's level, the middle run-out age,
 * the bad case and what is left, on the plans as they are. `partner` null: the one plan alone (the plan path's own case).
 * → { lasted, n, weighted, verdict, floorAge, worstAge, left: { typical, best }, planToAge, weightToAge, joint } or
 *   { reason } when the household cannot be run this way: 'notPotsAndValves' (a way of drawing other than Pots & Valves),
 *   'notSameStart' (a plan that does not draw from this tax year: still saving, or starting later — read on one clock from
 *   year 0 its runs and ages would be another plan's; couples who stop in different years are not on this run yet).
 */
export function householdReadingOf(plan, partner, { today, futures = 1000, weighted = undefined, lifeTable = undefined } = {}) {
  const env = { today, futures, seed: 0, ...(weighted === undefined ? {} : { weighted }), ...(lifeTable ? { lifeTable } : {}) };
  let c;
  try { c = coupleCaseOf(null, null, env, { planAt: () => ({ yours: plan, partner: partner || null }) }); } catch (e) { return { reason: (e && e.reason) || 'notPotsAndValves', why: String(e && e.message) }; }
  const v = verdictAt(c.sp, c.runner, 0, { weigher: c.weigher, level: c.level, toMonth: c.toMonth });
  return { lasted: c.sp.n - v.fails, n: c.sp.n, weighted: c.weigher.weighted ? v.weighted : null, verdict: v.verdict, floorAge: c.floorAgeOf(v.runOutMonths),
    worstAge: c.worstAgeOf(v.runOutMonths), left: c.leftOf(0, v.runOutMonths), planToAge: c.planToAge, weightToAge: c.weightToAge, joint: c.couple };
}
