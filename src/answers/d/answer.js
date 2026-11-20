/**
 * Question D — "I'm retired. Will it last? Could I spend more? Would some work help?" (research/v7/answer-D.md 1, 5;
 * road-to-7.md step 7).
 *
 * answerD(inputs, env): A's "stop now" route, reused (answer-D.md 1, 5.1):
 *   1. the household (d/toHousehold.js), everyone stopped today;
 *   2. sp = stopAtPlan(household, today's age, env): no saving years, the lives are question C's futures, the plan is
 *      enginePlan(…, { start: 'asGiven', pots: 'perFuture' });
 *   3. the first figure: verdictAt(sp, runner, spend × 12) — one run per life — the verdict, the share lasted, the
 *      bad-case run-out age;
 *   4. the band: bandAt(sp, runner) — careful, middling and good, C's band unchanged ("Could I spend more?");
 *   5. the headroom, by the rule of answer-D.md 3.4 (whole £10; the kind never contradicts the verdict);
 *   6. what it is made of: phasesAt(sp, spend × 12) at the spend;
 *   7. the levers, each on the same lives (stopAtPlan(h, age, env, sp.lives)): work from today for N years (A's
 *      partTime at a stop of today: one verdict, one band, and a verdict for 1 to N years), and "What if shares fell by
 *      a fifth?" (D on the pots scaled: one verdict, one band). A lever not asked for costs nothing;
 *   8. the sentences, from the result only (d/sentences.js).
 *
 * ONE PERSON IS ON THE PLAN PATH (7.12.0, one answer for the same household; answers/keep/planPath.js, handed in as
 * env.planPath — answers/index.js answerFor): the verdict, the band and both levers run on the plan keeping the answer
 * would write, so the count that lasts to the plan-to age, the weighted chance, the bad-case run-out age, the middle
 * run-out age and what is typically left are the kept plan's "Does it last?" figures (tests/v7/cross/answerIsPlan.test.js).
 * The plan-to age is the kept plan's (at most 45 years). A couple's household run stays the couple's engine (the lead's
 * ruling 9), fed by one adapter from the two plans keeping the answer would write (planPath coupleCaseOf: each one's own
 * run, on the same futures, weighed by the chance either is alive), so the two kept plans read as one household say the
 * answer's figures (tests/v7/cross/coupleIsPlans.test.js); its words stay the household's stop plan's, cut at the kept
 * plans' years. A couple with someone under the age a pension can be touched today stays on the household run (planPath
 * couplesOnPlans, the one rule A, C and D read). A household with nothing to draw on has no run at all. C from now and A's
 * stop-now row run on the same cases, so D is C from now and A stopping now (tests/v7/d/identity.test.js).
 *
 * Pure: the same inputs and env give the same result on every device. Reads no clock, storage, network or screen.
 * Never throws for a bad value: returns status 'invalid' with the problems.
 *
 * @param {object} inputs  checked inputs of SCHEMA_D (unchecked inputs are checked here again)
 * @param {import('../shared/contract.js').Env} env   C's (today, futures, seed, trace, onProgress, futureReturns), and
 *   `planPath` (one person: answers/keep/planPath.js, required); tests only: mix (an exact drawing mix), savingsGrowth
 * @returns {object}   AnswerD (answer-D.md 6.1)
 */
import { SCHEMA_D, spendOf, FALL_SHARE } from './schema.js';
import { checkInputs, defaults, flatten } from '../shared/validate.js';
import { RULES, drawYearsCap, fullStatePensionYearly } from '../shared/rules.js';
import { atLeastAnyway } from '../shared/band.js';
import { VERSION } from '../../constants.js';
import { validateHousehold, firstOpenAge } from '../shared/household.js';
import { historyEnd, historyStartYear } from '../shared/futures.js';
import { outOfTen } from '../shared/format.js';
import { livesList } from '../shared/lives.js';
import { stopAtPlan, createStopRunner, verdictAt, bandAt, phasesAt, leftAtStop } from '../shared/stopAt.js';
import { weigherOf, runToAgeOfInputs } from '../shared/weigh.js';
import { lifeFactsOf } from '../shared/lastsWords.js';
import { shortfallOf } from '../shared/shortfall.js';
import { LEVEL_IDS, levelOfInputs, levelBasis, chanceBlock, horizonRuleOf } from '../shared/levels.js';
import { before2028 } from '../shared/apart.js';
import { toHousehold, fallInputs, fallFactorOf } from './toHousehold.js';
import { textsFor } from './sentences.js';

const UNITS = { money: 'todays-prices', tax: 'after-tax', period: 'month', who: 'household' };
const round2 = (x) => Math.round(x * 100) / 100;
const noNegZero = (x) => (Object.is(x, -0) ? 0 : x);
const tenner = (x) => Math.round(x / 10) * 10;
/** The least a difference must be to be named as more or less (answer-D.md 3.4): the engine is not exact at the £10 step. */
export const HEADROOM_LEAST = 20;

function envProblems(env) {
  const problems = [];
  if (!env || typeof env.today !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(env.today)) problems.push({ field: 'env.today', messageId: 'required' });
  if (!env || !Number.isInteger(env.futures) || env.futures < 1) problems.push({ field: 'env.futures', messageId: 'required' });
  return problems;
}

/** One person is on the plan path; it must be handed in (answers/index.js answerFor), never left out silently. */
const planPathProblems = (couple, env) => (!(env.planPath && typeof env.planPath.planCaseOf === 'function' && typeof env.planPath.coupleCaseOf === 'function') ? [{ field: 'env.planPath', messageId: 'required' }] : []);

/** Whether the household has a pension or savings to draw on (the inputs as checked). */
const anyPotIn = (ins) => [ins.you, ins.household === 'couple' ? ins.partner : null].some((p) => p && p.pot > 0) || ins.savings > 0;

/** The fields whose value is the input list's default (as C and A: decided by value, typed or left alone). */
function defaultedFields(inputs, env) {
  const flat = flatten(inputs);
  const d = defaults(SCHEMA_D, flat, env);
  return Object.keys(d).filter((path) => path in flat && flat[path] === d[path]);
}

/**
 * The headroom (answer-D.md 3.4): what the careful amount says beside the spend, never contradicting the verdict.
 *   yes:        careful − spend ≥ £20 → 'more', else 'about'
 *   close, no:  spend − careful ≥ £20 → 'less', else 'about'
 * The difference is rounded to the nearest £10.
 *   anyway:     the level's amount is what comes in anyway (the lead's ruling D: the pots would make it less), so it is
 *               no measure of how much more or less could be spent: it is said as what it is, with its own chance.
 */
export function headroomOf(verdict, careful, spend, anyway = false) {
  if (anyway) return { kind: 'anyway', perMonth: 0 };
  const diff = careful - spend;
  if (verdict === 'yes') return diff >= HEADROOM_LEAST ? { kind: 'more', perMonth: tenner(diff) } : { kind: 'about', perMonth: 0 };
  return -diff >= HEADROOM_LEAST ? { kind: 'less', perMonth: tenner(-diff) } : { kind: 'about', perMonth: 0 };
}

/**
 * One verdict at the level and (when asked) one band on the shared lives, for a household built from `ins`: the band's
 * levels (`levels`, default the level chosen) on the weights (7.8.0). `lives`: (T) → the answer's lives, at least T years.
 */
function caseOf(ins, env, lives, stopAge, spendAYear, { band = true, levels = [levelOfInputs(ins)] } = {}) {
  const c = stopCaseOf(ins, env, lives, stopAge);
  const { sp, runner, weigher, toMonth } = c;
  const verdict = verdictAt(sp, runner, spendAYear, { weigher, level: levelOfInputs(ins), toMonth });
  const b = band ? bandAt(sp, runner, null, { weigher, levels, toMonth }) : null;
  // on the plan path a level is never less than what comes in anyway (the lead's ruling D, as How much can I take)
  return { ...c, verdict, band: b && c.pc ? { ...b, levels: atLeastAnyway(b.levels, b.solver, weigher, toMonth, c.pc.anywayK) } : b };
}

/**
 * The household built from `ins` stopped today on the shared lives, before any verdict: its runner, weights and the plan-to
 * age's month (caseOf's own; and, with `dragPct`, "lower returns" for "Try the bad years": the returnDragPct on the drawing
 * configs, 7.9.0). One person with something to draw on is on the plan path (`pc`: the kept plan's runner, weights and
 * month), and what the answer is made of — the phases, the incomes that come anyway, who can draw before 2028, when the
 * money runs out — is read from the kept plan too (`words`: pc.wordsPlan); no household run is made. Otherwise `stop` is
 * the household's stop plan and `words` its plan. `lives`: (T) → the answer's lives, at least T years.
 */
function stopCaseOf(ins, env, lives, stopAge, dragPct = 0) {
  const couple = ins.household === 'couple' && !!ins.partner;
  if (!couple && anyPotIn(ins)) {
    const pc = env.planPath.planCaseOf('d', ins, env, { lives, dragPct });
    return { sp: pc.sp, runner: pc.runner, weigher: pc.weigher, toMonth: pc.toMonth, pc, stop: null, words: pc.wordsPlan };
  }
  // a couple with something to draw on: the runs are the two plans keeping the answer would write, fed to the household run
  // by the one adapter (planPath coupleCaseOf, the lead's ruling 9); the household's split at each amount (each one's part,
  // its phases) is what the keep writes, and the words stay the household's stop plan's
  if (couple && anyPotIn(ins) && !env.householdRoute) {
    const sp = stopAtPlan(toHousehold(ins, env).household, stopAge, env, lives(0));
    if (env.planPath.couplesOnPlans(sp.plan)) {
      const pc = env.planPath.coupleCaseOf('d', ins, env, { lives, dragPct, phasesAt: (H) => phasesAt(sp, H), H0: spendOf(ins) * 12 });
      return { sp: pc.sp, runner: pc.runner, weigher: pc.weigher, toMonth: pc.toMonth, pc, stop: sp, words: env.planPath.householdWordsTo(sp.plan, pc) };
    }
  }
  const { household: named } = toHousehold(ins, env);
  const household = dragPct > 0 ? { ...named, returnDragPct: dragPct } : named;
  const sp = stopAtPlan(household, stopAge, env, lives(0));
  const runner = createStopRunner(sp);
  const weigher = weigherOf(sp.plan, ins, env);
  const toMonth = 12 * (sp.plan.endAge - sp.plan.startAge);
  return { sp, runner, weigher, toMonth, pc: null, stop: sp, words: sp.plan };
}

/**
 * The answer's lives: livesList(n, T) for the longest T any of its cases asks (the drawing years D, or a kept plan's years
 * to the weighting age), made once and made again only longer — a shorter run reads the first years of the same lives
 * (lives.js). (T) → lives.
 */
function livesOf(n, D, env) {
  let L = null;
  return (T = 0) => {
    const want = Math.max(D, T);
    if (!L || L[0].years < want) L = livesList(n, want, env);
    return L;
  };
}

/**
 * "Try the bad years" (7.9.0; the build spec's §2.2) on D's answer: the answer's own case (the household as given, the
 * levers left out, stopped today on the answer's lives) — the plan, the weights, the level, the plan-to age's month and the
 * words' facts (lf) — and `monthsAt({ H, shock, dragPct })`: each life's run-out month at H a year take-home (verdictAt),
 * with what is left at the plan-to age (leftAtStop), on the lives made worse from today (`shock`, its start 0) or with
 * lower returns (`dragPct`). answerD runs exactly as before. null when there is nothing to draw on.
 */
export function stressCaseOf(inputs, env) {
  if (envProblems(env).length) return null;
  const checked = checkInputs(SCHEMA_D, inputs, env);
  if (!checked.ok) return null;
  const ins = checked.inputs;
  const couple = ins.household === 'couple' && !!ins.partner;
  if (validateHousehold(toHousehold(ins, env).household, env.today).length || planPathProblems(couple, env).length) return null;
  const n = env.futures;
  const stopAge = ins.you.age;
  const younger = couple ? Math.min(ins.you.age, ins.partner.age) : ins.you.age;
  const D = Math.max(1, Math.min(drawYearsCap(env), runToAgeOfInputs(ins, 0, env) - younger));
  const lives = livesOf(n, D, env);
  const base = { ...ins, work: { has: false }, fall: { has: false } };
  const level = levelOfInputs(ins);
  if (!anyPotIn(base)) return null;
  const main = stopCaseOf(base, env, lives, stopAge);
  const { weigher, toMonth } = main;
  const plan = main.runner.plan;
  const chance = chanceAgesOf(main, ins, env);
  const lf = lifeFactsOf({ chance, basis: levelBasis(level, weigher, ins, plan.endAge), level }, weigher, plan, ins);
  const monthsAt = ({ H, shock = null, dragPct = 0 }) => {
    const c = shock || dragPct > 0 ? stopCaseOf(base, env, shock ? livesOf(n, D, { ...env, shock: { ...shock, from: 0 } }) : lives, stopAge, dragPct) : main;
    const months = verdictAt(c.sp, c.runner, H, { weigher, level, toMonth }).runOutMonths;
    return { months, left: leftValuesOf(c, H, months, toMonth), plan: wordsPlanOf(c) };
  };
  return { q: 'd', inputs: ins, plan, weigher, level, toMonth, lf, n, drawingNow: true, monthsAt };
}

const verdictBit = (v) => ({ verdict: v.verdict, fails: v.fails, lasted: v.lasted, runOutAge: v.runOutAge });

/**
 * The ages a chance is said to: the plan-to age (on the plan path the kept plan's, at most 45 years from today), the age the
 * futures are followed on to, and how the plan-to age was set ('capped' also when the kept plan stops short of the end age).
 */
function chanceAgesOf(c, ins, env) {
  const plan = c.runner.plan;
  const capped = Boolean(plan.runCapped) || (c.pc ? c.pc.planToAge < ins.endAge : false);
  return { planToAge: plan.endAge, weightToAge: c.weigher.weighted ? c.weigher.weightToAge : plan.endAge,
    horizonRule: horizonRuleOf({ defaulted: defaultedFields(ins, env).includes('endAge'), capped }) };
}

/**
 * Each future's left at the plan-to age at H, as the words say it: on the plan path the kept plan's own (planPath
 * leftTermsOf, the figure result.left reads), else the household run's (stopAt.js leftAtStop).
 */
const leftValuesOf = (c, H, months, toMonth) => (c.pc ? c.pc.leftTermsOf(H, months) : leftAtStop(c.sp, c.runner, H, months, toMonth));

/** The plan the shortfall words read (what comes in each year, the State Pension's start): the kept plan's, else the stop plan. */
const wordsPlanOf = (c) => c.words;

export function answerD(inputs, env) {
  const problems = envProblems(env);
  if (problems.length) return { status: 'invalid', problems };
  const checked = checkInputs(SCHEMA_D, inputs, env);
  if (!checked.ok) return { status: 'invalid', problems: Object.entries(checked.errors).map(([field, messageId]) => ({ field, messageId })) };
  const ins = checked.inputs;
  const couple = ins.household === 'couple' && !!ins.partner;

  const named = toHousehold(ins, env);
  const hp = validateHousehold(named.household, env.today);
  if (hp.length) return { status: 'invalid', problems: hp.map((p) => ({ field: p.field, messageId: p.problem })) };
  const pp = planPathProblems(couple, env);
  if (pp.length) return { status: 'invalid', problems: pp };

  const n = env.futures;
  const spend = spendOf(ins);
  const spendAYear = spend * 12;
  const stopAge = ins.you.age;
  const younger = couple ? Math.min(ins.you.age, ins.partner.age) : ins.you.age;
  // the drawing years from today: as A's lifeYears at a stop of today (S = 0), the end capped at 45 years ahead
  // (7.8.0, weighing: on to the later of the end age and the weighting age, weigh.js runToAgeOfInputs)
  const D = Math.max(1, Math.min(drawYearsCap(env), runToAgeOfInputs(ins, 0, env) - younger));
  const lives = livesOf(n, D, env);
  const tell = (done, total) => { if (typeof env.onProgress === 'function') env.onProgress(done, total); };
  const steps = 2 + (ins.work && ins.work.has ? 1 : 0) + (ins.fall && ins.fall.has ? 1 : 0);
  let step = 0;

  // the answer: the household as given — without the levers — one verdict at the spend, the band
  const base = { ...ins, work: { has: false }, fall: { has: false } };
  const level = levelOfInputs(ins);
  const main = caseOf(base, env, lives, stopAge, spendAYear, { levels: LEVEL_IDS });
  tell(++step, steps);
  const { verdict, band, weigher } = main;
  const shownMonthly = band.levels[level].monthly;
  // the run's shape (the kept plan's on the plan path), and what the answer is made of: the kept plan's incomes on the plan
  // path (main.words), else the household's stop plan
  const plan = main.runner.plan;
  const words = main.words;
  const anyMoney = main.pc ? true : main.stop.pots.some((q) => q.pension.some((v) => v > 0) || q.savings.some((v) => v > 0));
  const status = anyMoney ? 'ok' : words.guaranteedAYear > 0 ? 'guaranteed-only' : 'none';
  const own = main.pc && !main.pc.couple;
  // (a couple on the two kept plans: the household's stop plan, its words cut at the kept plans' years, as C's and A's)
  const phases = own ? phasesAt({ plan: words, middling: null }, spendAYear) : phasesAt(main.pc ? { ...main.stop, plan: words } : main.stop, anyMoney ? spendAYear : 0);
  tell(++step, steps);
  const headroom = headroomOf(verdict.verdict, shownMonthly, spend, Boolean(band.levels[level].anyway));

  // "Would some work help?" (answer-D.md 3.6, 7): the verdict with the work at its N years, one band with the work, and
  // a verdict only for 1 to 5 years (the row equal to N is the one above). All on the same lives.
  let work = null;
  if (ins.work && ins.work.has) {
    const yearly = ins.work.yearly;
    const years = ins.work.years;
    const atN = caseOf({ ...base, work: { has: true, yearly, years } }, env, lives, stopAge, spendAYear);
    const byYears = [];
    for (let y = 1; y <= 5; y++) {
      if (stopAge + y >= ins.endAge) break;
      const c = y === years ? atN : caseOf({ ...base, work: { has: true, yearly, years: y } }, env, lives, stopAge, spendAYear, { band: false });
      byYears.push({ years: y, toAge: stopAge + y, ...verdictBit(c.verdict) });
    }
    const atLevel = atN.band.levels[level].monthly;
    work = {
      yearly, years, fromAge: stopAge, toAge: stopAge + years,
      ...verdictBit(atN.verdict),
      monthly: atLevel,
      extra: Math.max(0, tenner(atLevel - spend)),
      byYears
    };
    tell(++step, steps);
  }

  // "What if shares fell by a fifth?" (answer-D.md 3.7): D on the pots scaled, the same lives (I-D5)
  let fall = null;
  if (ins.fall && ins.fall.has) {
    const factor = fallFactorOf(ins, env);
    const c = caseOf(fallInputs(base, env), env, lives, stopAge, spendAYear);
    fall = {
      share: FALL_SHARE, factor: round2(factor),
      ...verdictBit(c.verdict),
      monthly: c.band.levels[level].monthly,
      drop: Math.max(0, shownMonthly - c.band.levels[level].monthly)
    };
    tell(++step, steps);
  }

  const result = {
    status, inputs: ins, whose: 'you',
    spend: { perMonth: spend, perYear: round2(spendAYear), kind: ins.spend.kind, level: ins.spend.kind === 'level' ? ins.spend.level : null },
    ...verdictBit(verdict), outOfTen: outOfTen(verdict.lasted),
    // the plan path: the middle age the money ran out at, in the futures that ran out (the kept plan's floor line), and what
    // is left at the plan-to age, typically and in the best 1 in 10, at today's prices (its "left at the end")
    ...(main.pc && status === 'ok' ? { floorAge: main.pc.floorAgeOf(verdict.runOutMonths), left: { age: plan.endAge, ...main.pc.leftOf(spendAYear, verdict.runOutMonths) } } : {}),
    level,
    levels: Object.fromEntries(LEVEL_IDS.map((id) => [id, { monthly: band.levels[id].monthly, yearly: band.levels[id].yearly, weighted: band.levels[id].chance.weighted, fixedAge: band.levels[id].chance.fixedAge }])),
    chance: chanceBlock({ weighted: verdict.weighted, fixedAge: verdict.lasted, fails: verdict.fails }, n, chanceAgesOf(main, ins, env)),
    headroom,
    guaranteed: { monthlyAfterTax: round2(words.guaranteedAYear / 12) },
    phases,
    pensionOpens: Object.fromEntries((couple ? ['you', 'partner'] : ['you']).map((who) => [who, firstOpenAge(ins[who].age, env.today, 0)])),
    work,
    fall,
    assumed: [], warnings: [], sentences: {},
    basis: {
      today: env.today, futures: n, seed: env.seed ?? 0, ...levelBasis(level, weigher, ins, plan.endAge),
      historyEnd: historyEnd(), engineVersion: VERSION, startAge: stopAge, endAge: plan.endAge, years: plan.endAge - plan.startAge, lifeYears: D,
      bondDraws: 'life', cashRule: 'previous-year', grid: 'yearly', strategyId: 'pots-and-valves', cutsSwitchedOff: true,
      // (the default end age moved past 95: the age today + 5, answer-D.md 4.1)
      endAgeDefaulted: defaultedFields(ins, env).includes('endAge')
    },
    units: UNITS
  };
  // who moves money into drawdown before 6 April 2028 at 55 or 56 (shared/apart.js): everyone it applies to
  // (on the plan path the kept plan's own: its age today from its date of birth, its pension)
  const drawdown2028 = before2028(words.people.map((p) => ({ who: p.who, age: own ? p.ageToday : ins[p.who].age, S: 0, pension: p.pension > 0 })), env.today);
  // 7.8.0, weighing: the basis says so, and the words read the chance's facts and the shortfall at the spend (the amount
  // the verdict is about: when the money runs out at it, how much is still paid, what comes in after)
  let weighing = null;
  if (weigher.weighted) {
    result.basis.weighted = true;
    const toMonth = 12 * (plan.endAge - plan.startAge);
    weighing = { lf: lifeFactsOf(result, weigher, plan, ins),
      sf: status === 'ok' ? shortfallOf(wordsPlanOf(main), verdict.runOutMonths, spendAYear, { toMonth, left: leftValuesOf(main, spendAYear, verdict.runOutMonths, toMonth) }) : null };
  }
  textsFor(result, {
    // (the full State Pension as the rules, and so the kept plan, count it)
    usedDefault: defaultedFields(ins, env), fullStatePensionAYear: fullStatePensionYearly(), historyStartYear: historyStartYear(),
    // a pension still closed, as the kept plan takes it (ruling G): the law's age and the tax year it first takes from it
    ...(own && words.pensionOpens ? { pensionOpens: { you: words.pensionOpens } } : {}),
    // the level shown is what comes in anyway because the pots would make it less (ruling D): a final-salary pension's
    // capped rises are why, and the answer says so (as How much can I take)
    anywayCapped: Boolean(band.levels[level].anyway) && [ins.you, couple ? ins.partner : null].some((x) => x && x.finalSalary && x.finalSalary.has),
    madeUpFutures: typeof env.futureReturns === 'function', capped: Boolean(words.capped) || chanceAgesOf(main, ins, env).horizonRule === 'capped', 
    // the years ahead the test runs to: on the plan path the kept plan's own (the cap keeping applies, ruling H), else the answer's
    capYears: main.pc ? main.pc.planYears : drawYearsCap(env), drawdown2028, weighing
  });
  if (env.trace) {
    result.trace = { lives: Array.from({ length: n }, (_, i) => ({ id: i, runOutMonth: verdict.runOutMonths[i] })), evaluations: main.runner.evaluations };
  }
  return JSON.parse(JSON.stringify(result, (key, v) => (typeof v === 'number' ? noNegZero(v) : v)));
}
