/**
 * Question A — "When can I afford to stop work?" (step 4 brief 4.7).
 *
 * answerA(inputs, env): for each stop age the answer carries (agesToShow, a rule of SCHEMA_A), the saving years on
 * each life (the saving engine), then the drawing years from the stop on the rest of the same life (today's engine
 * through the adapter's locked run and the fast path): the verdict at the spending (one run per life), C's band at
 * that age, the pots at the stop. One row is shown — the age named, or the earliest that lasted in 9 in 10 — and it
 * IS its row of `ages`. The years before a pension opens are paid from savings inside the holder's one run; the start
 * is never moved.
 *
 * Pure: the same inputs and env give the same result on every device. Reads no clock, storage, network or screen.
 * Never throws for a bad value: returns status 'invalid' with the problems.
 *
 * @param {object} inputs  checked inputs of SCHEMA_A (unchecked inputs are checked here again)
 * @param {import('../shared/contract.js').Env} env
 *   C's (today, futures, seed, trace, onProgress, futureReturns) plus detail: 'chart' | 'all' (default 'chart');
 *   tests only: ages (exactly these stop ages, with the named one), mix, savingMix (exact mixes), savingsGrowth (the
 *   ISA's rate once stopped).
 * @returns {import('../shared/contract.js').AnswerA}
 */
import { SCHEMA_A } from './schema.js';
import { checkInputs, defaults, flatten } from '../shared/validate.js';
import { RULES, addYears } from '../shared/rules.js';
import { VERSION } from '../../constants.js';
import { validateHousehold, firstOpenAge } from '../shared/household.js';
import { historyEnd, historyStartYear } from '../shared/futures.js';
import { bandIndexes, STEP } from '../shared/band.js';
import { outOfTen } from '../shared/format.js';
import { agesToShow, spendLevelAMonth, handOverToC } from '../shared/schemaParts.js';
import { livesList } from '../shared/lives.js';
import { savingRows } from '../shared/saving.js';
import { stopAtPlan, createStopRunner, verdictAt, bandAt, phasesAt } from '../shared/stopAt.js';
import { toHousehold, payInOf } from './toHousehold.js';
import { textsFor } from './sentences.js';

const UNITS = { money: 'todays-prices', tax: 'after-tax', period: 'month', who: 'household' };
const round2 = (x) => Math.round(x * 100) / 100;
const noNegZero = (x) => (Object.is(x, -0) ? 0 : x);

function envProblems(env) {
  const problems = [];
  if (!env || typeof env.today !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(env.today)) problems.push({ field: 'env.today', messageId: 'required' });
  if (!env || !Number.isInteger(env.futures) || env.futures < 1) problems.push({ field: 'env.futures', messageId: 'required' });
  return problems;
}

/**
 * A household problem's field as a box on the form, where there is one: what goes in each month is checked on the total
 * (HOUSEHOLD_LIMITS.payInAMonth), and a split is shown on its first box.
 */
function formPath(inputs, field) {
  const m = /^people\.(\d)\.saving\.payIn\.(total|own|employer)$/.exec(field);
  if (!m) return field;
  const who = m[1] === '0' ? 'you' : 'partner';
  return inputs[who] && inputs[who].payIn && inputs[who].payIn.kind === 'split' ? `${who}.payIn.own` : `${who}.payIn.total`;
}

/** The fields whose value is the input list's default (as C: decided by value, typed or left alone). */
function defaultedFields(inputs, env) {
  const flat = flatten(inputs);
  const d = defaults(SCHEMA_A, flat, env);
  return Object.keys(d).filter((path) => path in flat && flat[path] === d[path]);
}

/** careful / middling / good positions of a list, sorted upwards with the life's id breaking ties: the life ids. */
function positionsOf(values) {
  const order = Array.from(values.keys()).sort((a, b) => values[a] - values[b] || a - b);
  const at = bandIndexes(values.length);
  return { order, careful: order[at.careful], middling: order[at.middling], good: order[at.good] };
}
const spreadOf = (values) => { const p = positionsOf(values); return { careful: Math.round(values[p.careful]), middling: Math.round(values[p.middling]), good: Math.round(values[p.good]) }; };

/**
 * The age each person's pension opens, as the shown stop sees it: when it is closed at the stop, the age it opens after
 * the stop; otherwise the first age, from today, at which it could be touched.
 */
function opensOf(inputs, today, S) {
  const out = {};
  for (const who of inputs.household === 'couple' ? ['you', 'partner'] : ['you']) {
    const age = inputs[who].age;
    const atStop = firstOpenAge(age, today, S);
    out[who] = atStop > age + S ? atStop : firstOpenAge(age, today, 0);
  }
  return out;
}

/**
 * Everything about one stop age, built once and kept for the answer: the stop plan on the shared lives, its runner,
 * the verdict at the spending; the band only when a row is asked for.
 */
function stopCase(ctx, age, { partTime = 'asTyped' } = {}) {
  const key = `${age}:${typeof partTime === 'object' ? JSON.stringify(partTime) : partTime}`;
  const hit = ctx.cases.get(key);
  if (hit) return hit;
  const ins = partTime === 'asTyped' ? ctx.inputs : { ...ctx.inputs, partTime };
  const { household } = toHousehold(ins, ctx.env, age);
  const sp = stopAtPlan(household, age, ctx.env, ctx.lives);
  const runner = createStopRunner(sp);
  const verdict = verdictAt(sp, runner, ctx.spendAYear);
  const c = { age, S: sp.S, sp, runner, verdict, band: null, inputs: ins };
  ctx.cases.set(key, c);
  return c;
}

/**
 * The amounts the last searches found, by stop age, kept for the next search on the same household and seed: the first
 * pass's 100 lives are the first 100 of the final 1,000, so its amounts say where the final search should look first
 * (C's rule, answer-C's `remembered`). A hint only — the band settles on the same amounts with or without it (band.js);
 * this is the one thing the answer keeps between calls, and it never reaches a result. The spending is left out of the
 * key: the band does not depend on it.
 */
const remembered = new Map();
const REMEMBER_AT_MOST = 24;
function estimateKey(inputs, env, age) {
  const { spend, stop, ...rest } = inputs;
  return JSON.stringify([rest, age, env.seed ?? 0, typeof env.futureReturns === 'function', env.mix || null, env.savingMix || null, env.savingsGrowth ?? null]);
}

function bandOf(ctx, c, estimate) {
  if (c.band) return c.band;
  const key = estimateKey(c.inputs, ctx.env, c.age);
  c.band = bandAt(c.sp, c.runner, remembered.get(key) || estimate);
  remembered.delete(key);
  remembered.set(key, { ...c.band.k });
  if (remembered.size > REMEMBER_AT_MOST) remembered.delete(remembered.keys().next().value);
  return c.band;
}

/** One AgeRow (brief 4.7), without phases and one-more-year (the answer adds them). */
function rowOf(ctx, c, band) {
  const { inputs, env, n, spend } = ctx;
  const sp = c.sp;
  const plan = c.runner.plan;
  const couple = inputs.household === 'couple';
  // the pots at the stop: per life, each person's pension and savings (today's prices); the household's spread
  const totals = new Float64Array(n);
  for (let i = 0; i < n; i++) for (const q of sp.pots) totals[i] += q.pension[i] + q.savings[i];
  const at = positionsOf(totals);
  const mid = at.middling;
  const byPerson = sp.pots.map((q) => ({ who: q.who, pension: Math.round(q.pension[mid]), savings: Math.round(q.savings[mid]) }));
  const potAtStop = { careful: Math.round(totals[at.careful]), middling: Math.round(totals[mid]), good: Math.round(totals[at.good]), byPerson };
  // what goes in over the saving years, today's prices
  const people = couple ? ['you', 'partner'] : ['you'];
  const paid = people.map((who) => ({ who, amount: Math.round(payInOf(inputs[who]).total * 12 * c.S * 100) / 100 }));
  // the years from the stop until the first pension opens: 0 when one is open at the stop, or there is none
  const holders = plan.people.filter((p) => p.pension > 0);
  const closed = plan.lockedUntil.filter((l) => holders.some((h) => h.who === l.who));
  const gapYears = holders.length && closed.length === holders.length ? Math.min(...closed.map((l) => l.years)) : 0;
  const ages = { you: inputs.you.age + c.S, ...(couple ? { partner: inputs.partner.age + c.S } : {}) };
  const v = c.verdict;
  return {
    age: c.age, ages, stopYear: addYears(env.today, c.S).slice(0, 4), status: 'final',
    verdict: v.verdict, lasted: v.lasted, outOfTen: outOfTen(v.lasted), runOutAge: v.runOutAge,
    monthly: { ...band.monthly }, yearly: { ...band.yearly }, lastedAt: { ...band.lastedAt }, runOutAgeAt: { ...band.runOutAgeAt },
    spare: round2(Math.max(0, band.monthly.careful - spend)),
    potAtStop,
    paidIn: { total: Math.round(paid.reduce((t, x) => t + x.amount, 0) * 100) / 100, byPerson: paid },
    yearsSaving: c.S, gapYears,
    phases: null,
    oneMoreYear: null
  };
}

/** The savings the closed years draw (no pension open, nothing from one), summed, today's prices; null when none. */
function savingsNeededOf(phases) {
  const closed = (phases || []).filter((q) => q.pensionOpen === false && q.fromPension <= 0.005);
  if (!closed.length) return null;
  const amount = Math.round(closed.reduce((t, q) => t + q.fromSavings * 12 * (q.toAge - q.fromAge), 0));
  return { amount, untilAge: closed[closed.length - 1].ages.you.to };
}

/** One SavingOutcome per person (brief 4.7), at the shown stop. */
function savingOf(ctx, c) {
  const { inputs } = ctx;
  const sp = c.sp;
  const couple = inputs.household === 'couple';
  return sp.saving.people.map((p, j) => {
    const q = sp.pots[j];
    const total = q.pension.map((v, i) => v + q.savings[i]);
    const typed = payInOf(inputs[p.who]);
    return {
      who: p.who, stopAge: p.ageToday + c.S, yearsSaving: c.S,
      potToday: { pension: p.pot, savings: round2(p.savings) },
      payIn: { total: typed.total, own: typed.own, employer: typed.employer, savings: round2(couple ? inputs.savingsIn / 2 : inputs.savingsIn) },
      potAtStop: { pension: spreadOf(q.pension), savings: spreadOf(q.savings), total: spreadOf(total) },
      paidIn: { total: Math.round(typed.total * 12 * c.S * 100) / 100 },
      mix: { saving: inputs.savingRisk, drawing: inputs.risk, slideYears: inputs.savingRisk !== inputs.risk ? 10 : 0 },
      chargeAYear: inputs.charge / 100
    };
  });
}

export function answerA(inputs, env) {
  const problems = envProblems(env);
  if (problems.length) return { status: 'invalid', problems };
  const checked = checkInputs(SCHEMA_A, inputs, env);
  if (!checked.ok) return { status: 'invalid', problems: Object.entries(checked.errors).map(([field, messageId]) => ({ field, messageId })) };
  const ins = checked.inputs;
  const couple = ins.household === 'couple';

  const named = toHousehold(ins, env);
  const hp = validateHousehold(named.household, env.today);
  if (hp.length) return { status: 'invalid', problems: hp.map((p) => ({ field: formPath(ins, p.field), messageId: p.problem })) };

  const n = env.futures;
  const detail = env.detail === 'all' ? 'all' : 'chart';
  const spend = ins.spend.kind === 'level' ? spendLevelAMonth(ins.household, ins.spend.level) : ins.spend.amount;
  const younger = couple ? Math.min(ins.you.age, ins.partner.age) : ins.you.age;
  const fits = (a) => Number.isInteger(a) && a >= ins.you.age && a <= RULES.stopAgeMax && ins.endAge > younger + (a - ins.you.age);
  const lifeYears = (a) => { const S = a - ins.you.age; return S + Math.max(1, Math.min(RULES.maxYears, ins.endAge - (younger + S))); };

  // "show me ages": a verdict at every whole age from today's to 75 finds the earliest that lasted (and the earliest close)
  const sweep = ins.stop.kind === 'ages' ? [] : null;
  if (sweep) for (let a = ins.you.age; a <= RULES.stopAgeMax; a++) if (fits(a)) sweep.push(a);
  // An age named that does not last: every later whole age to 75, in turn, until one does — the true "stopping at N
  // instead" (B's stop-later lever, A's earliest age above it), not the first yes among the chart's few ages
  const later = ins.stop.kind === 'age' && !Array.isArray(env.ages) ? [] : null;       // (tests' env.ages: exactly those ages)
  if (later) for (let a = ins.stop.age + 1; a <= RULES.stopAgeMax; a++) if (fits(a)) later.push(a);
  // the rows: the input list's ages, the age named, and the earliest that lasted (always a row, so the shown row is one
  // of them at every detail — the every-age step lists ages from 50 only, and the earliest may be younger)
  const rowAgesFor = (earliestYes) => {
    const list = agesToShow(ins, env, detail, earliestYes).filter(fits);
    if (ins.stop.kind === 'age' && !list.includes(ins.stop.age)) list.push(ins.stop.age);
    if (earliestYes !== null && fits(earliestYes) && !list.includes(earliestYes)) list.push(earliestYes);
    return [...new Set(list)].sort((x, y) => x - y);
  };
  // every age this answer may touch, for the length of the lives (each a prefix of the longest: the figures at an age
  // do not depend on how long the lives are)
  const touched = new Set([...(sweep || []), ...(later || []), ...rowAgesFor(null)]);
  if (ins.stop.kind === 'age') touched.add(ins.stop.age);
  const lives = livesList(n, Math.max(...[...touched].map(lifeYears)), env);
  const ctx = { inputs: ins, env, n, spend, spendAYear: spend * 12, lives, cases: new Map() };
  const verdictOfAge = (a) => stopCase(ctx, a).verdict;

  let earliest = { yes: null, close: null };
  if (sweep) {
    for (const a of sweep) {
      const v = verdictOfAge(a);
      if (earliest.close === null && v.verdict !== 'no') earliest.close = a;
      if (v.verdict === 'yes') { earliest.yes = a; break; }
    }
    if (earliest.yes === null && earliest.close === null) earliest = { yes: null, close: null };
  }
  // the age named: when it is not a yes and no age before it in the chart is, the first later age that is
  let laterYes = null;
  if (later && verdictOfAge(ins.stop.age).verdict !== 'yes') {
    const before = rowAgesFor(null).filter((a) => a < ins.stop.age);
    if (!before.some((a) => verdictOfAge(a).verdict === 'yes')) laterYes = later.find((a) => verdictOfAge(a).verdict === 'yes') ?? null;
  }
  const rowAges = rowAgesFor(sweep ? earliest.yes : laterYes);

  // the rows, in age order, each band searched from the previous row's amounts (a hint: the result is the same)
  const rows = [];
  let estimate = null;
  rowAges.forEach((a, k) => {
    const c = stopCase(ctx, a);
    const band = bandOf(ctx, c, estimate);
    estimate = band.k;
    rows.push(rowOf(ctx, c, band));
    if (typeof env.onProgress === 'function') env.onProgress(k + 1, rowAges.length);
  });
  if (!sweep) {
    // the earliest of the rows — among them, when the age named does not last, the first later age that does
    const y = rows.find((r) => r.verdict === 'yes');
    const cl = rows.find((r) => r.verdict !== 'no');
    earliest = { yes: y ? y.age : null, close: cl ? cl.age : null };
  }
  // the years of life the rows (and "show me ages"'s sweep) need: what the answer reports as its lives' length
  const T = Math.max(...[...(sweep || []), ...rows.map((r) => r.age)].map(lifeYears));
  // one more year: the difference of two rows
  rows.forEach((r, i) => {
    const next = rows[i + 1];
    if (!next || next.age !== r.age + 1) return;
    const extra = next.monthly.careful - r.monthly.careful;
    r.oneMoreYear = { toAge: next.age, extraMonthly: extra, lastedFrom: r.lasted, lastedTo: next.lasted, runOutFrom: r.runOutAge, runOutTo: next.runOutAge,
      potExtra: next.potAtStop.middling - r.potAtStop.middling, sameish: Math.abs(extra) <= 20 };
  });

  // the row shown: the age named, or the earliest that lasted, or the last row
  const shownAge = ins.stop.kind === 'age' ? ins.stop.age : earliest.yes !== null ? earliest.yes : rows[rows.length - 1].age;
  const shown = rows.find((r) => r.age === shownAge);
  const sc = stopCase(ctx, shownAge);
  const plan = sc.runner.plan;
  const anyMoney = rows.some((r) => r.potAtStop.good > 0);
  const status = anyMoney ? 'ok' : plan.guaranteedAYear > 0 ? 'guaranteed-only' : 'none';
  shown.phases = phasesAt(sc.sp, shown.potAtStop.good > 0 ? spend * 12 : 0);

  // part-time work: the shown row with the earnings (the row itself), without them, and with one more year of them
  let partTime = null;
  if (ins.partTime.has) {
    const without = stopCase(ctx, shownAge, { partTime: { has: false } });
    const wb = bandOf(ctx, without, sc.band ? sc.band.k : null);
    const more = stopCase(ctx, shownAge, { partTime: { ...ins.partTime, years: ins.partTime.years + 1 } });
    partTime = {
      yearly: ins.partTime.yearly, years: ins.partTime.years, fromAge: shownAge, toAge: shownAge + ins.partTime.years,
      lastedWith: shown.lasted, lastedWithout: without.verdict.lasted, runOutWith: shown.runOutAge, runOutWithout: without.verdict.runOutAge,
      without: { verdict: without.verdict.verdict, lasted: without.verdict.lasted, runOutAge: without.verdict.runOutAge, monthly: { careful: wb.monthly.careful } },
      oneMore: { years: ins.partTime.years + 1, lasted: more.verdict.lasted, runOutAge: more.verdict.runOutAge }
    };
  }

  const mid = sc.sp.middling;
  const midTotal = mid.reduce((t, q) => t + q.pension + q.isa, 0);
  const result = {
    status, inputs: ins, whose: plan.whose,
    spend: { perMonth: spend, perYear: round2(spend * 12), kind: ins.spend.kind, level: ins.spend.kind === 'level' ? ins.spend.level : null },
    stop: { kind: ins.stop.kind, age: shownAge },
    headline: {
      kind: status !== 'ok' ? 'nothing' : ins.stop.kind === 'age' ? 'named' : earliest.yes !== null ? 'earliest' : 'noneWorked',
      age: shownAge, verdict: shown.verdict, lasted: shown.lasted, outOfTen: outOfTen(shown.lasted), runOutAge: shown.runOutAge
    },
    shown,
    ages: rows,
    earliest,
    pensionOpens: opensOf(ins, env.today, sc.S),
    gapYears: shown.gapYears,
    savingsNeeded: savingsNeededOf(shown.phases),
    partTime,
    saving: savingOf(ctx, sc),
    guaranteed: { monthlyAfterTax: round2(plan.guaranteedAYear / 12) },
    handOver: { c: handOverToC(ins, shownAge, env.today) },
    assumed: [], warnings: [], sentences: {},
    basis: {
      today: env.today, futures: n, seed: env.seed ?? 0, failuresAllowed: Math.floor(n / 10), closeAllowed: Math.floor(n / 4),
      historyEnd: historyEnd(), engineVersion: VERSION, endAge: plan.endAge, detail, lifeYears: T,
      bondDraws: 'life', cashRule: 'previous-year', grid: 'yearly', strategyId: 'pots-and-valves', cutsSwitchedOff: true,
      split: sc.sp.saving.people.map((p, j) => ({ who: p.who, share: midTotal > 0 ? (mid[j].pension + mid[j].isa) / midTotal : 1 / mid.length }))
    },
    units: UNITS
  };
  textsFor(result, {
    usedDefault: defaultedFields(ins, env), fullStatePensionAYear: named.fullStatePensionAYear, historyStartYear: historyStartYear(),
    madeUpFutures: typeof env.futureReturns === 'function', capped: Boolean(plan.capped)
  });

  if (env.trace) {
    const sp = sc.sp;
    const totals = Array.from({ length: n }, (_, i) => sp.pots.reduce((t, q) => t + q.pension[i] + q.savings[i], 0));
    const bad = positionsOf(totals).careful;
    const band = sc.band;
    result.trace = {
      saving: {
        atCareful: {
          futureId: bad, priceAtStop: sp.S > 0 ? sp.kernels[0].pension.priceAtStop[bad] : 1,
          rows: sp.S > 0 ? sp.saving.people.flatMap((p) => savingRows(sp.saving, p, lives[bad])) : []
        }
      },
      // the drawing months of a stop are question C's trace when it is today (tests/v7/c/trace.test.js); the fast path's
      // locked run keeps no month-by-month record yet, so the drawing years are given here by their outcome per life
      drawing: null,
      lives: totals.map((t, i) => ({ id: i, potAtStop: round2(t), runOutMonth: sc.verdict.runOutMonths[i], most: band && band.solver ? band.solver.most(i) * STEP : band.monthly.careful }))
    };
  }
  return JSON.parse(JSON.stringify(result, (key, v) => (typeof v === 'number' ? noNegZero(v) : v)));
}
