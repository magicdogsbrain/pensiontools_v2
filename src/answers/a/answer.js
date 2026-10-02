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
 *   reuse: an earlier answer of A (the worker offers the last one), whose rows are taken as they stand when it is for
 *   exactly these inputs and the same lives (heldRows); tests only: ages (exactly these stop ages, with the named one),
 *   mix, savingMix (exact mixes), savingsGrowth (the ISA's rate once stopped).
 * @returns {import('../shared/contract.js').AnswerA}
 *
 * Couples who stop work in different years (research/v7/couples-different-years.md 5.2): each row is the stop of the
 * person the answer is about — you, or your partner when you have already stopped (askedAbout; "you" stays the person at
 * the keyboard) — and the sweep moves that person's stop only: the other's is fixed, or moves alongside ("when you do").
 * A row whose two stops differ is worked out with each person at their own stop (stopAt.js), and the shown one carries
 * the `apart` block (shared/apart.js). A row whose two stops are the same year is today's, figure for figure.
 */
import { SCHEMA_A } from './schema.js';
import { checkInputs, defaults, flatten } from '../shared/validate.js';
import { RULES, addYears } from '../shared/rules.js';
import { VERSION } from '../../constants.js';
import { validateHousehold, firstOpenAge } from '../shared/household.js';
import { historyEnd, historyStartYear } from '../shared/futures.js';
import { bandIndexes, STEP } from '../shared/band.js';
import { outOfTen } from '../shared/format.js';
import { agesToShow, spendLevelAMonth, handOverToC, askedAbout, stopYearsOf, shapeOfInputs } from '../shared/schemaParts.js';
import { livesList } from '../shared/lives.js';
import { savingRows } from '../shared/saving.js';
import { stopAtPlan, createStopRunner, verdictAt, bandAt, phasesAt, coverAt } from '../shared/stopAt.js';
import { apartOf, before2028, payKeepsPensions } from '../shared/apart.js';
import { shapeOfAnswer, markShapeMoves } from '../shared/shapeAnswer.js';
import { toHousehold, payInOf } from './toHousehold.js';
import { textsFor } from './sentences.js';

const UNITS = { money: 'todays-prices', tax: 'after-tax', period: 'month', who: 'household' };
const round2 = (x) => Math.round(x * 100) / 100;
const noNegZero = (x) => (Object.is(x, -0) ? 0 : x);
const isNum = (v) => typeof v === 'number' && Number.isFinite(v);

/**
 * The person the answer is about and their stop as given (couples-different-years.md 5.2): you, or — "I've already
 * stopped" — your partner. `kind` 'age' (an age in mind, or, for a partner who has also stopped, their age today) or
 * 'ages' ("show me ages"); `named` the age in mind (today's age when there is none); `ageToday` theirs.
 */
function askedStopOf(ins) {
  const asked = askedAbout(ins);
  const own = (asked === 'partner' ? ins.partner.stop : ins.stop) || {};
  return { asked, kind: own.kind === 'ages' ? 'ages' : 'age', named: own.kind === 'age' && isNum(own.age) ? own.age : ins[asked].age, ageToday: ins[asked].age };
}

/**
 * Each person's whole years from today until their own stop when the asked person stops at `a` (schemaParts.js
 * stopYearsOf) → { you, partner? }, and the stop age the stop plan is asked about: your age at your own stop — `a` itself
 * when the answer is about you, and for a couple apart always one of the two own stops (stopAt.js requires it).
 */
function stopsAt(ins, a) {
  const own = stopYearsOf(ins, a);
  return { own, engineStop: ins.you.age + own.you };
}

/**
 * The years between today and the check of the years before a pension opens (B's `outside`, A's gapYears): where the pay
 * of the one still working stops covering — the second stop under Half or All while the pay makes up a gap, else the
 * first. One stop for everyone: the stop.
 */
const checkYearOf = (plan) => (!plan.apart ? 0 : plan.apart.payCovers >= 1 || plan.apart.coversGap ? plan.apart.years : 0);

/**
 * The years from the check (checkYearOf) until a pension opens, when every pension holder's is still closed then by the
 * earliest pension age — today's "every pension closed at the stop". A couple apart: each pension is closed (or not) from
 * its holder's own stop (lockedYears, counted from the household's start); a worker who has simply not stopped yet is the
 * pay line's business, not a closed pension.
 */
function gapYearsOf(plan) {
  const holders = plan.people.filter((p) => p.pension > 0);
  if (!plan.apart) {
    const closed = plan.lockedUntil.filter((l) => holders.some((h) => h.who === l.who));
    return holders.length && closed.length === holders.length ? Math.min(...closed.map((l) => l.years)) : 0;
  }
  const cy = checkYearOf(plan);
  const opens = holders.map((p) => p.lockedYears);
  return holders.length && opens.every((o) => o > cy) ? Math.min(...opens) - cy : 0;
}

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
 * The age each person's pension opens, as the shown stop sees it: when it is closed at their own stop, the age it opens
 * after it; otherwise the first age, from today, at which it could be touched. `own`: each person's years to their stop.
 */
function opensOf(inputs, today, own) {
  const out = {};
  for (const who of inputs.household === 'couple' ? ['you', 'partner'] : ['you']) {
    const age = inputs[who].age;
    const S = own[who];
    const atStop = firstOpenAge(age, today, S);
    out[who] = atStop > age + S ? atStop : firstOpenAge(age, today, 0);
  }
  return out;
}

/**
 * The household's spending in a stop's first year (spending-shape.md 6.3): the figure as typed, or — a step at or before
 * the stop is in force from it — that step's (plan.shape.a0, in units of the figure). Without a shape: the figure itself.
 */
const startAYear = (spendAYear, plan) => (plan.shape && plan.shape.a0 !== 1 ? spendAYear * plan.shape.a0 : spendAYear);

/** Each person's whole years until their own stop, from a stop plan: { you, partner? }. */
const ownOf = (sp) => Object.fromEntries(sp.stops.map((s) => [s.who, s.S]));

/**
 * Everything about one stop age, built once and kept for the answer: the stop plan on the shared lives, its runner,
 * the verdict at the spending; the band only when a row is asked for. `age` is the asked person's stop.
 */
function stopCase(ctx, age, { partTime = 'asTyped' } = {}) {
  const key = `${age}:${typeof partTime === 'object' ? JSON.stringify(partTime) : partTime}`;
  const hit = ctx.cases.get(key);
  if (hit) return hit;
  const ins = partTime === 'asTyped' ? ctx.inputs : { ...ctx.inputs, partTime };
  const { household } = toHousehold(ins, ctx.env, age);
  const sp = stopAtPlan(household, stopsAt(ins, age).engineStop, ctx.env, ctx.lives);
  const runner = createStopRunner(sp);
  // the spend as typed, in this row's first year: a step at or before this stop is in force from it (spending-shape.md 6.3)
  const spendAYear = startAYear(ctx.spendAYear, sp.plan);
  const verdict = verdictAt(sp, runner, spendAYear);
  const c = { age, S: sp.S, own: ownOf(sp), sp, runner, verdict, band: null, inputs: ins, spendAYear };
  ctx.cases.set(key, c);
  return c;
}

/**
 * The amounts the last searches found, by stop age and number of lives, kept for the next search on the same household
 * and seed: the first pass's 100 lives are the first 100 of the final 1,000, so its amounts say where the final search
 * should look first (C's rule, answer-C's `remembered`). A hint only — where today's engine is monotone at £10 steps the
 * band settles on the same amounts with or without it (band.js); this is the one thing the answer keeps between calls,
 * and it never reaches a result. The spending is left out of the key: the band does not depend on it.
 *
 * Only a pass over FEWER lives is taken as the hint, never an earlier pass of the same size: where the engine is not
 * monotone (very large households, tests/v7/c/exceptions.md 6) a search that starts from the last one's amounts can end
 * a few steps away from it, so the same inputs asked twice gave two answers (a NIGHTLY=1 run, 1 Oct 2026: £1,073,100 at
 * 24, the good amount £50 apart). Taken only from a smaller pass, the same inputs on the same lives start the same search
 * every time.
 */
const remembered = new Map();                                  // key → Map(lives → amounts in steps)
const REMEMBER_AT_MOST = 24;
function estimateKey(inputs, env, age) {
  const { spend, stop, ...rest } = inputs;
  // about your partner, the row's age is their stop: the stop they named is not part of the household at that age
  if (askedAbout(inputs) === 'partner') rest.partner = { ...rest.partner, stop: null };
  const key = [rest, age, env.seed ?? 0, typeof env.futureReturns === 'function', env.mix || null, env.savingMix || null, env.savingsGrowth ?? null];
  // what is spent changing with age moves the band (it does not without one): its shape, in units of the first amount
  const shape = shapeOfInputs(inputs, 'spend', spend.kind === 'level' ? spendLevelAMonth(inputs.household, spend.level) : spend.amount);
  if (shape) key.push(JSON.stringify(shape.steps.map((s) => [s.fromAge, s.perMonth / shape.first, s.then, s.fallsPct ?? null])), JSON.stringify(shape.start));
  return JSON.stringify(key);
}
/** The amounts of the largest earlier pass over fewer than n lives, or null. */
function smallerPass(key, n) {
  const byN = remembered.get(key);
  if (!byN) return null;
  let best = null;
  for (const [m, k] of byN) if (m < n && (!best || m > best.m)) best = { m, k };
  return best ? { ...best.k } : null;
}

function bandOf(ctx, c, estimate) {
  if (c.band) return c.band;
  const key = estimateKey(c.inputs, ctx.env, c.age);
  c.band = bandAt(c.sp, c.runner, smallerPass(key, ctx.n) || estimate);
  const byN = remembered.get(key) || new Map();
  byN.set(ctx.n, { ...c.band.k });
  remembered.delete(key);
  remembered.set(key, byN);
  if (remembered.size > REMEMBER_AT_MOST) remembered.delete(remembered.keys().next().value);
  return c.band;
}

/** A row's band amounts in steps of the search (its monthly amounts are whole steps: band.k × STEP). */
const stepsOf = (row) => ({ careful: row.monthly.careful / STEP, middling: row.monthly.middling / STEP, good: row.monthly.good / STEP });

/**
 * Where to start the band search at age `a`, from the rows already worked out (ages below it, in `kAt`): nothing before
 * the first row, the previous row's amounts for the second, and from the third on the line through the last two
 * carried on to `a`. The amounts rise steadily with the stop age (about 5% a year), so the previous row alone sits just
 * outside the gap the search opens around its guess. A hint only: where today's engine is monotone at £10 steps the band
 * settles on the same amounts with or without it (band.js; tests/v7/a/reuse.test.js R4 checks every row against a search
 * with no hint) — it saves about a quarter of the engine runs of the every-age step.
 * @param {Map<number, { careful: number, middling: number, good: number }>} kAt   age → amounts in steps, in age order
 */
function estimateAt(kAt, a) {
  const before = [...kAt.keys()].filter((x) => x < a);
  if (!before.length) return null;
  const a1 = before[before.length - 1];
  const k1 = kAt.get(a1);
  if (before.length === 1) return { ...k1 };
  const a0 = before[before.length - 2];
  const k0 = kAt.get(a0);
  const f = (a - a1) / (a1 - a0);
  const on = (w) => Math.round(k1[w] + (k1[w] - k0[w]) * f);
  return { careful: on('careful'), middling: on('middling'), good: on('good') };
}

/**
 * The rows an earlier answer already holds, by age (step 4 brief 10, J17: the every-age step was at its 30-second
 * budget, slowed four times, for a stop before 57 on savings). The every-age step asks again, with detail
 * 'all', for the inputs its answer step has just answered at 'chart'. A row is one function of the inputs, the lives and
 * its age (X4: the rows the chart and the full table share are the same rows), so the worker offers the answer step's
 * result as env.reuse and its rows are taken as they stand instead of being worked out again. Taken only when the
 * earlier answer is for exactly these checked inputs on the same day, with the same futures, seed, engine and market
 * history — never with a test's made-up markets or mixes, nor when a trace is asked for (the trace reads the shown row's
 * own search). Anything else is ignored and every row is worked out.
 * @returns {Map<number, object>|null}   age → AgeRow (a copy, phases and one-more-year cleared: the answer adds them)
 */
function heldRows(prev, ins, env, n) {
  if (!prev || typeof prev !== 'object' || !Array.isArray(prev.ages) || !prev.basis || !prev.inputs) return null;
  if (env.trace || typeof env.futureReturns === 'function' || env.mix || env.savingMix || (env.savingsGrowth !== undefined && env.savingsGrowth !== null)) return null;
  const b = prev.basis;
  if (b.today !== env.today || b.futures !== n || b.seed !== (env.seed ?? 0) || b.engineVersion !== VERSION || b.historyEnd !== historyEnd()) return null;
  if (JSON.stringify(prev.inputs) !== JSON.stringify(ins)) return null;
  const held = new Map();
  for (const r of prev.ages) {
    if (!r || !Number.isInteger(r.age) || r.status !== 'final' || !r.monthly || typeof r.verdict !== 'string') continue;
    held.set(r.age, { ...JSON.parse(JSON.stringify(r)), phases: null, oneMoreYear: null });
  }
  return held.size ? held : null;
}

/**
 * One AgeRow (brief 4.7), without phases and one-more-year (the answer adds them). Couples apart: `ages` each person's
 * own age at their own stop, `yearsSaving` and `stopYear` the asked person's, what went in each person's own.
 */
function rowOf(ctx, c, band) {
  const { inputs, env, n, spend } = ctx;
  const sp = c.sp;
  const plan = c.runner.plan;
  const couple = inputs.household === 'couple';
  const own = c.own;
  // the pots at the stop: per life, each person's pension and savings (today's prices); the household's spread
  const totals = new Float64Array(n);
  for (let i = 0; i < n; i++) for (const q of sp.pots) totals[i] += q.pension[i] + q.savings[i];
  const at = positionsOf(totals);
  const mid = at.middling;
  const byPerson = sp.pots.map((q) => ({ who: q.who, pension: Math.round(q.pension[mid]), savings: Math.round(q.savings[mid]) }));
  const potAtStop = { careful: Math.round(totals[at.careful]), middling: Math.round(totals[mid]), good: Math.round(totals[at.good]), byPerson };
  // what goes in over the saving years, today's prices: each person until their own stop
  const people = couple ? ['you', 'partner'] : ['you'];
  const paid = people.map((who) => ({ who, amount: Math.round(payInOf(inputs[who]).total * 12 * own[who] * 100) / 100 }));
  // the years from the stop until the first pension opens: 0 when one is open at the stop, or there is none (a couple
  // apart: from where the pay of the one still working stops covering)
  const gapYears = gapYearsOf(plan);
  const ages = { you: inputs.you.age + own.you, ...(couple ? { partner: inputs.partner.age + own.partner } : {}) };
  const asked = own[ctx.asked];
  const v = c.verdict;
  return {
    age: c.age, ages, stopYear: addYears(env.today, asked).slice(0, 4), status: 'final',
    verdict: v.verdict, lasted: v.lasted, outOfTen: outOfTen(v.lasted), runOutAge: v.runOutAge,
    monthly: { ...band.monthly }, yearly: { ...band.yearly }, lastedAt: { ...band.lastedAt }, runOutAgeAt: { ...band.runOutAgeAt },
    spare: round2(Math.max(0, band.monthly.careful - (c.spendAYear === ctx.spendAYear ? spend : c.spendAYear / 12))),
    // a stop at or after a step starts on that step (spending-shape.md 6.3): the figure THIS row tested, a month — only
    // then, so a row before every step (and every flat answer) is as it was
    ...(c.spendAYear === ctx.spendAYear ? {} : { spendAtStart: round2(c.spendAYear / 12) }),
    potAtStop,
    paidIn: { total: Math.round(paid.reduce((t, x) => t + x.amount, 0) * 100) / 100, byPerson: paid },
    yearsSaving: asked, gapYears,
    phases: null,
    oneMoreYear: null
  };
}

/**
 * The savings the closed years draw (no pension open, nothing from one), summed, today's prices; null when none. Couples
 * apart: only from `fromAge` (the younger's age where the pay of the one still working stops covering — before it, the
 * pay makes up what the savings cannot).
 */
function savingsNeededOf(phases, fromAge = -Infinity) {
  const closed = (phases || []).filter((q) => q.pensionOpen === false && q.fromPension <= 0.005 && q.fromAge >= fromAge);
  if (!closed.length) return null;
  const amount = Math.round(closed.reduce((t, q) => t + q.fromSavings * 12 * (q.toAge - q.fromAge), 0));
  return { amount, untilAge: closed[closed.length - 1].ages.you.to };
}

/**
 * One SavingOutcome per person (brief 4.7), at the shown stop: each at their own stop (a couple apart). What goes into
 * savings each month is the household's share of it for that person (couples apart: among those still working).
 */
function savingOf(ctx, c) {
  const { inputs } = ctx;
  const sp = c.sp;
  const couple = inputs.household === 'couple';
  const apart = Boolean(c.runner.plan.apart);
  return sp.saving.people.map((p, j) => {
    const q = sp.pots[j];
    const total = q.pension.map((v, i) => v + q.savings[i]);
    const typed = payInOf(inputs[p.who]);
    const S = c.own[p.who];
    return {
      who: p.who, stopAge: p.ageToday + S, yearsSaving: S,
      potToday: { pension: p.pot, savings: round2(p.savings) },
      payIn: { total: typed.total, own: typed.own, employer: typed.employer, savings: round2(apart ? p.payIn.savings : couple ? inputs.savingsIn / 2 : inputs.savingsIn) },
      potAtStop: { pension: spreadOf(q.pension), savings: spreadOf(q.savings), total: spreadOf(total) },
      paidIn: { total: Math.round(typed.total * 12 * S * 100) / 100 },
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
  // The person the answer is about, and the row ages: their stop (couples-different-years.md 5.2). Each row has each
  // person at their own stop — the other's fixed, or alongside — and fits when the end comes after the later stop, under
  // 45 years after the first (one stop for both: the end after the stop, as before).
  const ask = askedStopOf(ins);
  const span = (a) => { const own = stopYearsOf(ins, a); const list = couple ? [own.you, own.partner] : [own.you]; return { first: Math.min(...list), last: Math.max(...list) }; };
  const fits = (a) => {
    if (!(Number.isInteger(a) && a >= ask.ageToday && a <= RULES.stopAgeMax)) return false;
    const s = span(a);
    return ins.endAge > younger + s.last && s.last - s.first < RULES.maxYears;
  };
  const lifeYears = (a) => { const S = span(a).first; return S + Math.max(1, Math.min(RULES.maxYears, ins.endAge - (younger + S))); };

  // "show me ages": a verdict at every whole age from today's to 75 finds the earliest that lasted (and the earliest close)
  const sweep = ask.kind === 'ages' ? [] : null;
  if (sweep) for (let a = ask.ageToday; a <= RULES.stopAgeMax; a++) if (fits(a)) sweep.push(a);
  // An age named that does not last: every later whole age to 75, in turn, until one does — the true "stopping at N
  // instead" (B's stop-later lever, A's earliest age above it), not the first yes among the chart's few ages
  const later = ask.kind === 'age' && !Array.isArray(env.ages) ? [] : null;       // (tests' env.ages: exactly those ages)
  if (later) for (let a = ask.named + 1; a <= RULES.stopAgeMax; a++) if (fits(a)) later.push(a);
  // the rows: the input list's ages, the age named, and the earliest that lasted (always a row, so the shown row is one
  // of them at every detail — the every-age step lists ages from 50 only, and the earliest may be younger)
  const rowAgesFor = (earliestYes) => {
    const list = agesToShow(ins, env, detail, earliestYes).filter(fits);
    if (ask.kind === 'age' && !list.includes(ask.named)) list.push(ask.named);
    if (earliestYes !== null && fits(earliestYes) && !list.includes(earliestYes)) list.push(earliestYes);
    return [...new Set(list)].sort((x, y) => x - y);
  };
  // every age this answer may touch, for the length of the lives (each a prefix of the longest: the figures at an age
  // do not depend on how long the lives are)
  const touched = new Set([...(sweep || []), ...(later || []), ...rowAgesFor(null)]);
  if (ask.kind === 'age') touched.add(ask.named);
  // "Show me ages" from past the last age A shows (75): there is no stop age to work out. The form lets the age through
  // (it is C's field, to 100), so it is a problem to name, not a failure (found by a random run, 1 Oct 2026: someone of
  // 76 asking to be shown ages made livesList build a life of -Infinity years).
  if (!touched.size) {
    return { status: 'invalid', problems: [ask.asked === 'partner' ? { field: 'partner.stop.kind', messageId: 'partner-stop-ages-past-75' } : { field: 'stop.kind', messageId: 'stop-ages-past-75' }] };
  }
  const lives = livesList(n, Math.max(...[...touched].map(lifeYears)), env);
  const ctx = { inputs: ins, env, n, spend, spendAYear: spend * 12, lives, cases: new Map(), asked: ask.asked };
  // the rows an earlier answer for these very inputs already holds (the answer step's, for the every-age step)
  const held = heldRows(env.reuse, ins, env, n);
  const verdictOfAge = (a) => (held && held.has(a) ? held.get(a) : stopCase(ctx, a).verdict);

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
  if (later && verdictOfAge(ask.named).verdict !== 'yes') {
    const before = rowAgesFor(null).filter((a) => a < ask.named);
    if (!before.some((a) => verdictOfAge(a).verdict === 'yes')) laterYes = later.find((a) => verdictOfAge(a).verdict === 'yes') ?? null;
  }
  const rowAges = rowAgesFor(sweep ? earliest.yes : laterYes);

  // the rows, in age order: a row held already is taken as it stands; any other has its band searched from the rows
  // before it (estimateAt — a hint: the result is the same)
  const rows = [];
  const kAt = new Map();                                       // age → the row's band amounts, in steps
  rowAges.forEach((a, k) => {
    const row = held && held.get(a);
    if (row) {
      kAt.set(a, stepsOf(row));
      rows.push(row);
    } else {
      const c = stopCase(ctx, a);
      const band = bandOf(ctx, c, estimateAt(kAt, a));
      kAt.set(a, band.k);
      rows.push(rowOf(ctx, c, band));
    }
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
  const shownAge = ask.kind === 'age' ? ask.named : earliest.yes !== null ? earliest.yes : rows[rows.length - 1].age;
  const shown = rows.find((r) => r.age === shownAge);
  const sc = stopCase(ctx, shownAge);
  const plan = sc.runner.plan;
  const anyMoney = rows.some((r) => r.potAtStop.good > 0);
  const status = anyMoney ? 'ok' : plan.guaranteedAYear > 0 ? 'guaranteed-only' : 'none';
  shown.phases = phasesAt(sc.sp, shown.potAtStop.good > 0 ? sc.spendAYear : 0);
  // what is spent changing with age (spending-shape.md 6.3): the spend as typed and tested, the careful amount at the start
  // with the later steps in proportion, and each year's figures (one phase a year: the same figures, year by year)
  const yearly = sc.sp.household.shape ? phasesAt(sc.sp, shown.potAtStop.good > 0 ? sc.spendAYear : 0, null, { yearly: true }) : null;
  const shaped = yearly ? shapeOfAnswer({ household: sc.sp.household, plan, at: status === 'ok' ? shown.monthly : null, asTyped: sc.spendAYear / 12, yearly, H0: sc.spendAYear }) : null;
  if (shaped) markShapeMoves(shown.phases, shaped.byYear);

  // Couples apart at the shown row (couples-different-years.md 2.4): each person's own stop, the pay line, and — in a bad
  // case (the worst 1 in 10) — the age from which the pay of the one still working covers all of what is spent
  const cover = plan.apart && status === 'ok' && plan.apart.coversGap ? coverAt(sc.sp, sc.runner, sc.spendAYear) : null;
  const apart = apartOf(plan, ins, sc.own, cover);

  // part-time work: the shown row with the earnings (the row itself), without them, and with one more year of them
  // (yours: "I've already stopped" asks no part-time work)
  let partTime = null;
  if (ins.partTime && ins.partTime.has) {
    const without = stopCase(ctx, shownAge, { partTime: { has: false } });
    const wb = bandOf(ctx, without, kAt.get(shownAge));
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
    ...(ask.asked === 'partner' ? { askedAbout: 'partner' } : {}),
    ...(apart ? { apart } : {}),
    spend: { perMonth: spend, perYear: round2(spend * 12), kind: ins.spend.kind, level: ins.spend.kind === 'level' ? ins.spend.level : null },
    ...(shaped || {}),
    stop: { kind: ask.kind, age: shownAge },
    headline: {
      kind: status !== 'ok' ? 'nothing' : ask.kind === 'age' ? 'named' : earliest.yes !== null ? 'earliest' : 'noneWorked',
      age: shownAge, verdict: shown.verdict, lasted: shown.lasted, outOfTen: outOfTen(shown.lasted), runOutAge: shown.runOutAge
    },
    shown,
    ages: rows,
    earliest,
    pensionOpens: opensOf(ins, env.today, sc.own),
    gapYears: shown.gapYears,
    // (a shape: year by year, so a fall or a rise inside a stretch is counted as it is)
    savingsNeeded: plan.apart ? savingsNeededOf(yearly || shown.phases, plan.startAge + checkYearOf(plan)) : savingsNeededOf(yearly || shown.phases),
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
  // who moves money into drawdown before 6 April 2028 at 55 or 56 (shared/apart.js: everyone it applies to — owner, 2 Oct 2026)
  const drawdown2028 = before2028(plan.people.map((p) => ({ who: p.who, age: ins[p.who].age, S: sc.own[p.who], pension: p.pension > 0 })), env.today);
  // couples apart: the facts their lines need beyond the result (shared/apart.js)
  const worker = apart ? (apart.first === 'you' ? 'partner' : 'you') : null;
  const apartCtx = !apart ? null : {
    workerPaysIn: payInOf(ins[worker]).total > 0,
    keepsPensions: payKeepsPensions(plan),
    drawdown: drawdown2028
  };
  textsFor(result, {
    usedDefault: defaultedFields(ins, env), fullStatePensionAYear: named.fullStatePensionAYear, historyStartYear: historyStartYear(),
    madeUpFutures: typeof env.futureReturns === 'function', capped: Boolean(plan.capped), drawdown2028,
    ...(apartCtx ? { apart: apartCtx } : {})
  });

  if (env.trace) {
    const sp = sc.sp;
    const totals = Array.from({ length: n }, (_, i) => sp.pots.reduce((t, q) => t + q.pension[i] + q.savings[i], 0));
    const bad = positionsOf(totals).careful;
    const band = sc.band;
    // the saving months: each person's own (a couple apart: one of them may have stopped); the price level at the stop of
    // the person the answer is about
    const k = sp.saving.people.findIndex((p) => p.who === ask.asked);
    const saves = sp.saving.people.some((p) => p.until > 0);
    result.trace = {
      saving: {
        atCareful: {
          futureId: bad, priceAtStop: sp.saving.people[k].until > 0 ? sp.kernels[k].pension.priceAtStop[bad] : 1,
          rows: saves ? sp.saving.people.flatMap((p) => savingRows(sp.saving, p, lives[bad])) : []
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
