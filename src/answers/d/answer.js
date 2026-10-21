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
 * At a stop of today's age the band, the phases and the guaranteed income are question C's from now, to the bit, and the
 * verdict at the spend is A's stop-now row (tests/v7/d/identity.test.js). Every "will it last" figure comes from the
 * one engine through the one adapter: nothing is reimplemented here.
 *
 * Pure: the same inputs and env give the same result on every device. Reads no clock, storage, network or screen.
 * Never throws for a bad value: returns status 'invalid' with the problems.
 *
 * @param {object} inputs  checked inputs of SCHEMA_D (unchecked inputs are checked here again)
 * @param {import('../shared/contract.js').Env} env   C's (today, futures, seed, trace, onProgress, futureReturns); tests
 *   only: mix (an exact drawing mix), savingsGrowth
 * @returns {object}   AnswerD (answer-D.md 6.1)
 */
import { SCHEMA_D, spendOf, FALL_SHARE } from './schema.js';
import { checkInputs, defaults, flatten } from '../shared/validate.js';
import { RULES } from '../shared/rules.js';
import { VERSION } from '../../constants.js';
import { validateHousehold, firstOpenAge } from '../shared/household.js';
import { historyEnd, historyStartYear } from '../shared/futures.js';
import { outOfTen } from '../shared/format.js';
import { livesList } from '../shared/lives.js';
import { stopAtPlan, createStopRunner, verdictAt, bandAt, phasesAt } from '../shared/stopAt.js';
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
 */
export function headroomOf(verdict, careful, spend) {
  const diff = careful - spend;
  if (verdict === 'yes') return diff >= HEADROOM_LEAST ? { kind: 'more', perMonth: tenner(diff) } : { kind: 'about', perMonth: 0 };
  return -diff >= HEADROOM_LEAST ? { kind: 'less', perMonth: tenner(-diff) } : { kind: 'about', perMonth: 0 };
}

/** One verdict and (when asked) one band on the shared lives, for a household built from `ins`. */
function caseOf(ins, env, lives, stopAge, spendAYear, { band = true } = {}) {
  const { household } = toHousehold(ins, env);
  const sp = stopAtPlan(household, stopAge, env, lives);
  const runner = createStopRunner(sp);
  const verdict = verdictAt(sp, runner, spendAYear);
  return { household, sp, runner, verdict, band: band ? bandAt(sp, runner) : null };
}

const verdictBit = (v) => ({ verdict: v.verdict, fails: v.fails, lasted: v.lasted, runOutAge: v.runOutAge });

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

  const n = env.futures;
  const spend = spendOf(ins);
  const spendAYear = spend * 12;
  const stopAge = ins.you.age;
  const younger = couple ? Math.min(ins.you.age, ins.partner.age) : ins.you.age;
  // the drawing years from today: as A's lifeYears at a stop of today (S = 0), the end capped at 45 years ahead
  const D = Math.max(1, Math.min(RULES.maxYears, ins.endAge - younger));
  const lives = livesList(n, D, env);
  const tell = (done, total) => { if (typeof env.onProgress === 'function') env.onProgress(done, total); };
  const steps = 2 + (ins.work && ins.work.has ? 1 : 0) + (ins.fall && ins.fall.has ? 1 : 0);
  let step = 0;

  // the answer: the household as given — without the levers — one verdict at the spend, the band
  const base = { ...ins, work: { has: false }, fall: { has: false } };
  const main = caseOf(base, env, lives, stopAge, spendAYear);
  tell(++step, steps);
  const { sp, runner, verdict, band } = main;
  const plan = runner.plan;
  const anyMoney = sp.pots.some((q) => q.pension.some((v) => v > 0) || q.savings.some((v) => v > 0));
  const status = anyMoney ? 'ok' : plan.guaranteedAYear > 0 ? 'guaranteed-only' : 'none';
  const phases = phasesAt(sp, anyMoney ? spendAYear : 0);
  tell(++step, steps);
  const headroom = headroomOf(verdict.verdict, band.monthly.careful, spend);

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
    const careful = atN.band.monthly.careful;
    work = {
      yearly, years, fromAge: stopAge, toAge: stopAge + years,
      ...verdictBit(atN.verdict),
      monthly: { careful },
      extra: Math.max(0, tenner(careful - spend)),
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
      monthly: { careful: c.band.monthly.careful },
      drop: Math.max(0, band.monthly.careful - c.band.monthly.careful)
    };
    tell(++step, steps);
  }

  const result = {
    status, inputs: ins, whose: 'you',
    spend: { perMonth: spend, perYear: round2(spendAYear), kind: ins.spend.kind, level: ins.spend.kind === 'level' ? ins.spend.level : null },
    ...verdictBit(verdict), outOfTen: outOfTen(verdict.lasted),
    monthly: { ...band.monthly }, yearly: { ...band.yearly }, lastedAt: { ...band.lastedAt }, runOutAgeAt: { ...band.runOutAgeAt },
    headroom,
    guaranteed: { monthlyAfterTax: round2(plan.guaranteedAYear / 12) },
    phases,
    pensionOpens: Object.fromEntries((couple ? ['you', 'partner'] : ['you']).map((who) => [who, firstOpenAge(ins[who].age, env.today, 0)])),
    work,
    fall,
    assumed: [], warnings: [], sentences: {},
    basis: {
      today: env.today, futures: n, seed: env.seed ?? 0, failuresAllowed: Math.floor(n / 10), closeAllowed: Math.floor(n / 4),
      historyEnd: historyEnd(), engineVersion: VERSION, startAge: stopAge, endAge: plan.endAge, years: D, lifeYears: D,
      bondDraws: 'life', cashRule: 'previous-year', grid: 'yearly', strategyId: 'pots-and-valves', cutsSwitchedOff: true,
      // (the default end age moved past 95: the age today + 5, answer-D.md 4.1)
      endAgeDefaulted: defaultedFields(ins, env).includes('endAge')
    },
    units: UNITS
  };
  // who moves money into drawdown before 6 April 2028 at 55 or 56 (shared/apart.js): everyone it applies to
  const drawdown2028 = before2028(plan.people.map((p) => ({ who: p.who, age: ins[p.who].age, S: 0, pension: p.pension > 0 })), env.today);
  textsFor(result, {
    usedDefault: defaultedFields(ins, env), fullStatePensionAYear: named.fullStatePensionAYear, historyStartYear: historyStartYear(),
    madeUpFutures: typeof env.futureReturns === 'function', capped: Boolean(plan.capped), drawdown2028
  });
  if (env.trace) {
    result.trace = { lives: Array.from({ length: n }, (_, i) => ({ id: i, runOutMonth: verdict.runOutMonths[i] })), evaluations: runner.evaluations };
  }
  return JSON.parse(JSON.stringify(result, (key, v) => (typeof v === 'number' ? noNegZero(v) : v)));
}
