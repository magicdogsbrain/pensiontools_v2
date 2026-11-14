/**
 * Question C — "I've got about £X — what is that a month?" (build brief 4.3).
 *
 * answerC(inputs, env): the household model, today's engine on the same futures for
 * every input, the band, the breakdown, the sentences. Pure: the same inputs and env give the same result on
 * every device. Reads no clock, storage, network or screen. Never throws for a bad value: returns status
 * 'invalid' with the problems.
 *

 * @param {object} inputs  checked inputs (brief 4.1). Unchecked inputs are checked here again.
 * @param {import('../shared/contract.js').Env & { mix?: { equity: number, bond: number, cash: number } }} env
 *   `mix` (tests only, with `futureReturns`): hold the pots in an exact mix instead of a risk level, so a made-up
 *   future with a known return has an answer in closed form. `solver: 'reference'` (tests only): search with the
 *   reference solver (bandReference.js, today's engine run by run) instead of the fast path — the same result.
 * @returns {import('../shared/contract.js').AnswerC}
 */
import { SCHEMA_C } from './schema.js';
import { checkInputs, defaults, flatten } from '../shared/validate.js';
import { RULES, fullStatePensionYearly, drawYearsCap } from '../shared/rules.js';
import { VERSION } from '../../constants.js';
import { calculateTax } from '../../services/TaxCalculator.js';
import { simulate } from '../../services/SimulationEngine.js';
import { validateHousehold, firstOpenAge } from '../shared/household.js';
import { enginePlan, configsAt, breakdownAt, yearlyPlan, BANDS, ONE_NAME_SHARE } from '../shared/toEngine.js';
import { futuresList, historyEnd, historyStartYear, priceIndexByYear, cappedIndexByYear } from '../shared/futures.js';
import { createBandSolver, bandIndexes, STEP, levelsFromSolver, leftAt } from '../shared/band.js';
import { createFastRunner } from '../shared/fastEngine.js';
import { weigherOf, runToAgeOfInputs } from '../shared/weigh.js';
import { lifeFactsOf } from '../shared/lastsWords.js';
import { shortfallOf } from '../shared/shortfall.js';
import { LEVEL_IDS, levelOfInputs, levelBasis, chanceBlock, chanceOf, verdictOfChance, horizonRuleOf } from '../shared/levels.js';
import { createReferenceBandSolver, weightedThresholdReference } from '../shared/bandReference.js';
import { toHousehold } from './toHousehold.js';
import { sentencesFor, sentencesWithoutPots, sentencesOnLives, assumedFor, warningsFor, finishTexts } from './sentences.js';
import { usesLives, answerOnLives, stressCaseOnLives } from './onLives.js';
import { payInTotalOf, statePensionAgeOf } from '../shared/schemaParts.js';
import { before2028, payKeepsPensions } from '../shared/apart.js';
import { shapeOfAnswer, markShapeMoves } from '../shared/shapeAnswer.js';

const UNITS = { money: 'todays-prices', tax: 'after-tax', period: 'month', who: 'household' };

/**
 * The three amounts the last search found, kept for the next search on the same household and seed: the first
 * figure's 100 futures are the first 100 of the final 1,000, so its amounts say where the final search should
 * look first. A hint only — where today's engine is monotone at £10 steps the search settles on the same amounts
 * with or without it (band.js); this is the one thing the answer keeps between calls, and it never reaches a result.
 * Only a search over FEWER futures is taken as the hint, never an earlier one of the same size: where the engine is not
 * monotone a search started from the last one's amounts can end elsewhere, so the same inputs asked twice gave two
 * answers (a NIGHTLY=1 run, 1 Oct 2026: £3,000,000 and a £200,000 final-salary pension from 100 — the good amount
 * £336,300, then £336,630). Taken only from a smaller pass, the same inputs start the same search every time.
 */
let remembered = null;                                         // { key, byN: Map(futures → amounts in steps) }
const estimateKey = (plan, env) => JSON.stringify([plan.years, env.seed ?? 0, typeof env.futureReturns === 'function', configsAt(plan, 1e7).map((c) => c.config)]);
function rememberedEstimate(plan, env) {
  if (!remembered || remembered.key !== estimateKey(plan, env)) return null;
  let best = null;
  for (const [m, k] of remembered.byN) if (m < env.futures && (!best || m > best.m)) best = { m, k };
  return best ? best.k : null;
}
function rememberEstimate(plan, env, k) {
  const key = estimateKey(plan, env);
  if (!remembered || remembered.key !== key) remembered = { key, byN: new Map() };
  remembered.byN.set(env.futures, { ...k });
}
const round2 = (x) => Math.round(x * 100) / 100;
const noNegZero = (x) => (Object.is(x, -0) ? 0 : x);

function envProblems(env) {
  const problems = [];
  if (!env || typeof env.today !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(env.today)) problems.push({ field: 'env.today', messageId: 'required' });
  if (!env || !Number.isInteger(env.futures) || env.futures < 1) problems.push({ field: 'env.futures', messageId: 'required' });
  return problems;
}

/**
 * The three amounts of a step count k: whole £10 a month. The search never goes below the take-home the household
 * has anyway at the start (the solver's lowest step is that figure rounded down to £10), so the smallest answer is
 * that take-home rounded down — a whole £10 like every other amount, while the first phase shows the take-home itself.
 */
function amountAt(k) {
  return k * STEP;
}

/** The phases of the result from the adapter's breakdown (£ a year → £ a month). */
function phasesOf(plan, H) {
  const per = breakdownAt(plan, H);
  return per.map((p) => {
    const ages = {};
    for (const person of plan.people) ages[person.who] = { from: person.ageAtStart + p.from, to: person.ageAtStart + p.to };
    const raw = p.byPerson.map((b) => ({
      who: b.who, statePension: b.statePension / 12, finalSalary: b.finalSalary / 12,
      fromPension: b.fromPension / 12, fromSavings: b.fromSavings / 12, tax: b.tax / 12, takeHome: b.takeHome / 12
    }));
    const byPerson = raw.map((b, i) => ({
      ...Object.fromEntries(Object.entries(b).map(([k, v]) => [k, typeof v === 'number' ? round2(v) : v])),
      higherRate: Boolean(p.byPerson[i].higherRate),       // some of what this person draws is taxed at 40%
      locked: Boolean(p.byPerson[i].locked)                // their pension is closed in this phase (under the earliest pension age)
    }));
    const sum = (f) => raw.reduce((s, b) => s + b[f], 0);
    const takeHome = round2(p.takeHome / 12);
    const statePension = round2(sum('statePension'));
    const finalSalary = round2(sum('finalSalary'));
    const fromPension = round2(sum('fromPension'));
    const fromSavings = round2(sum('fromSavings'));
    const tax = round2(sum('tax'));
    const shownTake = Math.round(takeHome);
    let shownSp = Math.round(statePension);
    let shownFs = Math.round(finalSalary);
    let shownPots = shownTake - shownSp - shownFs;
    if (shownPots < 0) { const cut = Math.min(-shownPots, shownFs); shownFs -= cut; shownPots += cut; }
    if (shownPots < 0) { shownSp += shownPots; shownPots = 0; }
    return {
      fromAge: plan.startAge + p.from, toAge: plan.startAge + p.to, ages,
      takeHome, fromPension, fromSavings, fromPots: round2(sum('fromPension') + sum('fromSavings')),
      statePension, finalSalary, tax,
      byPerson,
      beforeStatePension: p.beforeStatePension,
      shown: { takeHome: shownTake, fromPots: shownPots, statePension: shownSp, finalSalary: shownFs }
    };
  });
}

/**
 * The fields whose value is the input list's default. The shell hands the answer checked inputs with every default
 * filled in, so "what was assumed" is decided by value: a figure equal to the default is shown as the assumption it
 * is, whether it was typed or left alone. The same answer either way.
 */
function defaultedFields(inputs, env) {
  const flat = flatten(inputs);
  const d = defaults(SCHEMA_C, flat, env);
  return Object.keys(d).filter((path) => path in flat && flat[path] === d[path]);
}

/** The facts the sentences need beyond the numbers. */
function factsOf(plan, checked, household, fullSp, env) {
  const inputs = checked.inputs;
  const used = defaultedFields(inputs, env);
  const people = plan.people.map((p) => {
    const raw = inputs[p.who] || {};
    const fs = p.finalSalary.filter((f) => f.amount > 0);
    // the age their pension opens: on the start if it is closed there (a warning names them), else the first age it could
    const lock = plan.lockedUntil.find((l) => l.who === p.who);
    const accessAge = lock ? lock.untilAge : firstOpenAge(p.ageToday, env.today);
    return {
      who: p.who, pot: p.pension > 0, savings: p.isa > 0,
      sp: p.statePension.amount > 0, spPaidAtStart: p.statePension.inPayment, spPaidToday: p.statePension.amount > 0 && p.statePension.startAge <= p.ageToday,
      spAge: p.statePension.startAge, spDefault: (raw.statePension || {}).kind === 'full',
      fs: fs.length > 0, fsPaidAtStart: fs.some((f) => f.startAge <= p.ageAtStart), fsAge: fs.length ? fs[0].startAge : null,
      fsDefault: used.includes(p.who + '.finalSalary.has'), potDefault: used.includes(p.who + '.pot'),
      pensionOverLimit: p.pension > RULES.taxFreeLimit / RULES.taxFreeShare,
      // under the earliest pension age today, with a pension pot: the pension cannot be touched before `accessAge`
      underAccessAge: p.pension > 0 && p.ageToday < accessAge, accessAge, startsAtAccessAge: p.ageAtStart === accessAge,
      // "Already had the tax-free part?" (couples-different-years.md 2.3: asked only of someone who has stopped)
      taxFreeTaken: raw.taxFreeTaken === true
    };
  });
  const pensions = plan.people.map((p) => p.pension);
  const totalPension = pensions.reduce((s, v) => s + v, 0);
  const oneName = plan.people.length === 2 && totalPension > 0 && plan.people.some((p, i) => p.pension / totalPension > ONE_NAME_SHARE
    && plan.periods[0].byPerson[1 - i].gross < BANDS.pa);
  // still paying in, but the money is taken from now (or from the age they are now): nothing more goes in (the note says so)
  const couple = inputs.household === 'couple' && inputs.partner;
  const fromNow = inputs.start && (inputs.start.kind === 'now' || inputs.start.age <= inputs.you.age);
  const payInUnused = Boolean(fromNow) && payInTotalOf(inputs, 'you') + (couple ? payInTotalOf(inputs, 'partner') : 0) > 0;
  return {
    life: false, payInUnused,
    couple: plan.people.length === 2, startsNow: plan.yearsFromNow === 0, yearsFromNow: plan.yearsFromNow, startMoved: plan.startMoved, movedBy: plan.movedBy, movedFor: plan.movedFor,
    lockedUntil: plan.lockedUntil.map((l) => ({ who: l.who, untilAge: l.untilAge, years: l.years })),
    accessFrom: RULES.pensionAccess.from, capped: plan.capped, capYears: drawYearsCap(env),
    people, savings: inputs.savings || 0, fullStatePensionAYear: fullSp, usedDefault: used,
    anyPension: totalPension > 0, anyPots: plan.totalPots > 0, totalPots: plan.totalPots,
    lockedSavingsMonths: 0, oneName, madeUpFutures: typeof env.futureReturns === 'function', historyStartYear: historyStartYear(),
    // who moves money into drawdown before 6 April 2028 at 55 or 56: everyone it applies to (shared/apart.js; decided 2 Oct 2026);
    // from now everyone starts at the household's start (moved, when it is, to the day a pension opens)
    drawdown2028: before2028(plan.people.map((p) => ({ who: p.who, age: p.ageToday, S: plan.yearsFromNow, pension: p.pension > 0 })), env.today),
    allStartedAge: Math.max(...plan.people.flatMap((p) => [p.statePension.amount > 0 ? p.statePension.startAge - p.ageAtStart + plan.startAge : 0, ...p.finalSalary.map((f) => (f.amount > 0 ? f.startAge - p.ageAtStart + plan.startAge : 0))]))
  };
}

/**
 * What goes into each pension a month as typed, when "still paying in" was answered yes for someone (C's `payIn`; a
 * hand-over to A or B reads it). From now nothing more goes in, so the answer does not count it; it is kept so the
 * other questions can. null when nobody answered yes: the result is then C's as it always was.
 */
function payInTyped(inputs) {
  const whos = inputs.household === 'couple' && inputs.partner ? ['you', 'partner'] : ['you'];
  if (!whos.some((w) => inputs[w].payIn && inputs[w].payIn.has === 'yes')) return null;
  const byPerson = whos.map((who) => ({ who, total: payInTotalOf(inputs, who) }));
  return { total: byPerson.reduce((t, p) => t + p.total, 0), byPerson };
}

/**
 * The facts and the words of an answer on the lives (onLives.js): C's own facts, with what depends on the size of the
 * pots read at the middling pots at the start (the plan holds the largest over the lives, the band's ceiling).
 */
function finishOnLives(result, plan, checked, household, env, more) {
  const facts = factsOf(plan, checked, household, fullStatePensionYearly(), env);
  const mid = more.middling;
  const inputs = checked.inputs;
  facts.life = true;
  // 7.8.0, weighing (onLives.js): the chance's facts and the shortfall at the level's amount
  if (more.weighing) { result.basis.weighted = true; facts.weighing = more.weighing; }
  // the money from today's age (an age that is now): nothing more goes in, as from now. Couples apart: someone who has
  // stopped (you from now) pays nothing more in; the one still working pays in until their own stop
  facts.payInUnused = plan.apart ? result.saving.some((x) => x.yearsSaving === 0 && x.payIn.total > 0) : result.basis.yearsSaving === 0 && result.payIn.total > 0;
  facts.payingIn = plan.apart ? result.saving.some((x) => x.yearsSaving > 0 && x.payIn.total > 0) : result.payIn.total > 0;
  const closedAtStart = (who, j) => mid[j].pension > 0 && plan.lockedUntil.some((l) => l.who === who);
  facts.people.forEach((p, j) => {
    p.pensionOverLimit = mid[j].pension > RULES.taxFreeLimit / RULES.taxFreeShare;
    // couples apart: each opens from their own stop (the age they are then), not the household's start
    if (plan.apart) p.startsAtAccessAge = plan.people[j].ageAtStop === p.accessAge;
    // "can't take money until …" only for a pension closed at the start, or one whose opening IS the start (the form's
    // default start for someone under the age, or "now" moved to it: the note says why the figures start then) — never
    // for one open well before: a partner of 53 today is 65 when the money starts at 67 (the reviewers' finding, 1 Oct 2026)
    p.underAccessAge = closedAtStart(p.who, j) || (p.underAccessAge && p.startsAtAccessAge);
  });
  // who moves money into drawdown before 6 April 2028 at 55 or 56, each at their own stop: everyone it applies to
  // (shared/apart.js; decided 2 Oct 2026)
  facts.drawdown2028 = before2028(plan.people.map((p) => ({ who: p.who, age: p.ageToday, S: more.own[p.who], pension: p.pension > 0 })), env.today);
  // couples apart (shared/apart.js): who pays in, a pension paid to the one still working, money into drawdown before
  // 6 April 2028
  if (plan.apart) {
    const worker = plan.people.find((p) => p.join > 0);
    facts.apart = result.apart;
    facts.apartCtx = {
      workerPaysIn: result.saving.some((x) => x.who === worker.who && x.payIn.total > 0),
      keepsPensions: payKeepsPensions(plan),
      drawdown: facts.drawdown2028
    };
  }
  // every pension closed at the start: until the first opens only savings pay, so a bad case that runs out before then
  // is the savings running out (in the plan's ages — the younger person's, as the run-out ages are)
  const holders = plan.people.map((p, j) => ({ p, j })).filter((x) => mid[x.j].pension > 0);
  const closed = holders.filter((x) => closedAtStart(x.p.who, x.j));
  const first = closed.length && closed.length === holders.length
    ? closed.map((x) => ({ who: x.p.who, l: plan.lockedUntil.find((l) => l.who === x.p.who) })).sort((a, b) => a.l.years - b.l.years)[0] : null;
  facts.allClosedUntil = first ? plan.startAge + first.l.years : null;
  facts.firstClosed = first ? { who: first.who, untilAge: first.l.untilAge } : null;
  facts.closedYears = result.closedYears || null;
  // the guaranteed incomes, each with the age it starts at in the plan's years (the younger person's, as the run-out ages)
  facts.incomes = plan.people.flatMap((p) => [
    ...(p.statePension.amount > 0 ? [{ who: p.who, age: p.statePension.startAge, at: p.statePension.startAge - p.ageAtStart + plan.startAge }] : []),
    ...p.finalSalary.filter((f) => f.amount > 0).map((f) => ({ who: p.who, age: f.startAge, at: f.startAge - p.ageAtStart + plan.startAge }))
  ]);
  // a partner past their State Pension age, the money taken later than now: their pot is left alone until then, and
  // anything they take before then is not counted (both start together — said, not hidden; the reviewers' finding).
  // Not when their own stop was answered: then it is theirs (couples-different-years.md 5.1)
  facts.partnerRetired = Boolean(facts.couple && inputs.partner && result.basis.yearsSaving > 0 && !inputs.partner.stop
    && inputs.partner.age >= statePensionAgeOf(inputs.partner.age, env.today));
  const totalMid = mid.reduce((s, q) => s + q.pension, 0);
  facts.oneName = plan.people.length === 2 && totalMid > 0 && plan.people.some((p, i) => mid[i].pension / totalMid > ONE_NAME_SHARE
    && plan.periods[0].byPerson[1 - i].gross < BANDS.pa);
  facts.totalPots = more.potAtStartMiddling;
  facts.middlingRunOut = more.middlingRunOut ?? null;
  result.sentences = sentencesOnLives(result, facts);
  result.assumed = assumedFor(result, facts);
  result.warnings = warningsFor(result, facts);
  finishTexts(result);
}

function basisOf(plan, env, n, lb) {
  return {
    today: env.today, futures: n, seed: env.seed ?? 0, ...lb,
    historyEnd: historyEnd(), engineVersion: VERSION,
    startAge: plan.startAge, endAge: plan.endAge, accessAge: plan.accessAge, start: plan.start, years: plan.endAge - plan.startAge,
    split: plan.people.map((p) => ({ who: p.who, share: p.share })), strategyId: 'pots-and-valves', cutsSwitchedOff: true
  };
}

/**
 * One month of one person, in pounds of that month, from the engine's own trace. With `incomes` (incomesByMonth), the
 * final-salary pension is the household's — rising as the household says it does, not as the engine was told (see
 * toEngine.js) — and the tax is worked out again on it.
 */
function rowsFromEngine(plan, person, config, future, incomes = null) {
  const r = simulate({ ...config, trace: true }, future.returns, future.seed);
  const t = r.trace || [];
  const rows = [];
  let lsa = config.accessMethod === 'ufpls' ? RULES.taxFreeLimit : 0;
  const finals = r.finalEquity + r.finalBond + r.finalCash + (r.finalIsa || 0);
  t.forEach((row, i) => {
    const pi = row.planInputs || {};
    const potStart = row.equityStart + row.bondStart + row.cashStart + row.isaStart;
    const potEnd = i + 1 < t.length ? t[i + 1].equityStart + t[i + 1].bondStart + t[i + 1].cashStart + t[i + 1].isaStart : finals;
    const last = i === t.length - 1;
    const ranOut = last && r.failed;
    const f = lsa > 0 ? RULES.taxFreeShare : 0;
    let fromPension = row.effectiveSipp || 0;
    let fromSavings = (row.effectiveIsa ?? row.isaMonthly ?? 0) + (row.giaNet || 0);
    // the month's fund and platform charges (6.19.0), as the engine took them straight after the growth: their own
    // column, never hidden inside "growth"
    const charge = row.charge || 0;
    if (ranOut) {
      fromSavings = Math.min(fromSavings, row.isaStart);
      fromPension = Math.max(0, potStart - charge - potEnd - fromSavings);
    }
    const draw = fromPension + fromSavings;
    const growth = potEnd - potStart + draw + charge;
    const taxFree = f * fromPension;
    const taxable = fromPension - taxFree;
    const statePension = (pi.statePension || 0) / 12;
    const finalSalary = incomes ? incomes[row.month].finalSalary : ((pi.fixed || 0) - (pi.statePension || 0) - (pi.other || 0)) / 12;
    const tax = pi.pa > 0 ? calculateTax(12 * (taxable + statePension + finalSalary), pi.pa, pi.brl, pi.hrl) / 12 : 0;
    rows.push({
      who: person.who, m: row.month, age: person.ageAtStart + row.year, priceIndex: row.cumInf,
      potStart, growth, charge, draw, fromPension, fromSavings, taxFree, taxable, statePension, finalSalary, tax,
      afterTax: statePension + finalSalary + draw - tax, potEnd,
      ...(ranOut ? { ranOut: true } : {}), ...((row.isaRescue || 0) > 0 || (row.giaRescue || 0) > 0 ? { rescued: true } : {})
    });
    lsa = Math.max(0, lsa - f * (row.sippMonthly || 0));
  });
  return { rows, failed: r.failed, failMonth: r.failMonth };
}

/** A person's State Pension and final-salary pension each month of a future, in the pounds of the day, with the tax on them. */
function incomesByMonth(plan, person, future) {
  const price = priceIndexByYear(future.returns, plan.years);
  const capped = cappedIndexByYear(future.returns, plan.years, 0.05);
  const out = [];
  for (let y = 0; y < plan.years; y++) {
    const sp = person.statePension.amount > 0 && y >= person.statePension.startYear ? person.statePension.amount * price[y] / 12 : 0;
    let fs = 0;
    for (const f of person.finalSalary) {
      if (!(f.amount > 0) || y < f.startYear) continue;
      fs += f.increases === 'none' ? f.amount / 12 : f.increases === 'prices' ? f.amount * price[y] / 12 : f.amount * capped[y] / 12;
    }
    const bands = { pa: BANDS.pa * price[y], brl: BANDS.brl * price[y], hrl: BANDS.hrl * price[y] };
    for (let mm = 0; mm < 12; mm++) out.push({ y, priceIndex: price[y], statePension: sp, finalSalary: fs, bands });
  }
  return out;
}

/** The months of a person with nothing to draw: their incomes and tax, on the future's prices. */
function rowsWithoutPots(plan, person, future) {
  return incomesByMonth(plan, person, future).map((inc, m) => {
    const tax = calculateTax(12 * (inc.statePension + inc.finalSalary), inc.bands.pa, inc.bands.brl, inc.bands.hrl) / 12;
    return { who: person.who, m, age: person.ageAtStart + inc.y, priceIndex: inc.priceIndex, potStart: 0, growth: 0, charge: 0, draw: 0, fromPension: 0, fromSavings: 0, taxFree: 0, taxable: 0, statePension: inc.statePension, finalSalary: inc.finalSalary, tax, afterTax: inc.statePension + inc.finalSalary - tax, potEnd: 0 };
  });
}

/** A person with savings only: the engine's months (the ISA, drawn for their share) with their pensions and tax added by the adapter. */
function rowsSavingsOnly(plan, person, config, future) {
  const r = rowsFromEngine(plan, person, config, future);
  const incomes = incomesByMonth(plan, person, future);
  r.rows = r.rows.map((row) => {
    const inc = incomes[row.m];
    const tax = calculateTax(12 * (inc.statePension + inc.finalSalary), inc.bands.pa, inc.bands.brl, inc.bands.hrl) / 12;
    return { ...row, statePension: inc.statePension, finalSalary: inc.finalSalary, tax, afterTax: inc.statePension + inc.finalSalary + row.draw - tax };
  });
  return r;
}

/** One row a month for a person with two runs (a pension closed at the start, and their savings): the two added. */
function addRows(lists) {
  const SUM = ['potStart', 'growth', 'charge', 'draw', 'fromPension', 'fromSavings', 'taxFree', 'taxable', 'statePension', 'finalSalary', 'tax', 'afterTax', 'potEnd'];
  const byMonth = new Map();
  for (const rows of lists) {
    for (const r of rows) {
      const had = byMonth.get(r.m);
      if (!had) { byMonth.set(r.m, { ...r }); continue; }
      for (const f of SUM) had[f] += r[f];
      if (r.ranOut) had.ranOut = true;
      if (r.rescued) had.rescued = true;
    }
  }
  return [...byMonth.values()].sort((a, b) => a.m - b.m);
}

/** Every person's months for one future at one household amount, in you-then-partner order. */
function traceOf(plan, future, monthly) {
  const configs = configsAt(plan, monthly * 12);
  const rows = [];
  let failMonth = null;
  for (const person of plan.people) {
    const mine = configs.filter((x) => x.index === person.index);
    if (!mine.length) { rows.push(...rowsWithoutPots(plan, person, future)); continue; }
    // a person with savings only: the adapter adds their pensions and tax; a pension run carries them itself, and
    // the savings run beside a closed pension carries nothing but the savings
    const runs = mine.map((c) => (person.kind === 'savings' ? rowsSavingsOnly(plan, person, c.config, future)
      : rowsFromEngine(plan, person, c.config, future, c.role === 'pension' ? incomesByMonth(plan, person, future) : null)));
    rows.push(...(runs.length === 1 ? runs[0].rows : addRows(runs.map((r) => r.rows))));
    for (const r of runs) if (r.failed && (failMonth === null || r.failMonth < failMonth)) failMonth = r.failMonth;
  }
  // The household's run ends the month anyone's pot cannot pay: nothing after that month is shown.
  const kept = failMonth === null ? rows : rows.filter((r) => r.m <= failMonth);
  return { futureId: future.id, runOutMonth: failMonth, rows: kept };
}

/**
 * The result when there is no pot to draw on: the three amounts are the take-home once every State Pension and
 * final-salary pension has started (brief 4.3 point 7) — the one figure the sentences, the rail and the screen
 * all read; the phases say what is paid before then.
 */
function withoutPots(plan, checked, household, fullSp, env, n, lw) {
  const status = plan.guaranteedAYear > 0 ? 'guaranteed-only' : 'none';
  const phases = phasesOf(plan, 0);
  const monthly = round2(plan.guaranteedAYear / 12);
  const each = { monthly, yearly: round2(monthly * 12), weighted: 1, fixedAge: 1 };
  const result = {
    status, inputs: checked.inputs,
    level: lw.level, levels: Object.fromEntries(LEVEL_IDS.map((id) => [id, { ...each }])),
    chance: chanceBlock(chanceOf(lw.weigher, new Array(n).fill(null)), n, lw.chance), whose: plan.whose,
    guaranteed: { monthlyAfterTax: monthly },
    phases, take: null, assumed: [], warnings: [], sentences: {},
    basis: basisOf(plan, env, n, lw.basis), units: UNITS
  };
  const typed = payInTyped(checked.inputs);
  if (typed) result.payIn = typed;
  const facts = factsOf(plan, checked, household, fullSp, env);
  result.sentences = sentencesWithoutPots(result, facts);
  result.assumed = assumedFor(result, facts);
  result.warnings = warningsFor(result, facts);
  return finishTexts(result);
}

/**
 * C from now, before any run: the household, the engine plan, the level, the weights and the plan-to age (7.8.0:
 * shared/levels.js) — answerC's own, and what "Try the bad years" works the answer out again on (stressCaseOf). `problems`
 * when the household cannot be answered.
 */
function fromNowOf(checked, env) {
  const { household, fullStatePensionAYear } = toHousehold(checked.inputs, env);
  const hp = validateHousehold(household, env.today);
  if (hp.length) return { problems: hp };
  const plan = enginePlan(household, env);
  // the level, the weights and the plan-to age (7.8.0: shared/levels.js)
  const level = levelOfInputs(checked.inputs);
  const weigher = weigherOf(plan, checked.inputs, env);
  const planToAge = plan.endAge;
  const toMonth = 12 * (planToAge - plan.startAge);
  const lw = {
    level, weigher, basis: levelBasis(level, weigher, checked.inputs, planToAge),
    chance: { planToAge, weightToAge: weigher.weighted ? weigher.weightToAge : planToAge, horizonRule: horizonRuleOf({ defaulted: defaultedFields(checked.inputs, env).includes('endAge'), capped: Boolean(plan.runCapped) }) }
  };
  return { problems: null, household, fullStatePensionAYear, plan, level, weigher, planToAge, toMonth, lw };
}

/**
 * "Try the bad years" (7.9.0; the build spec's §2.2) on C's answer: the answer's own case — the plan, the weights, the level,
 * the plan-to age's month and the words' facts (lf) — and `monthsAt({ H, shock, dragPct })`, each future's run-out month
 * (null: it lasted) at H a year take-home, with what is left at the plan-to age by the answer's own reader (band.js leftAt;
 * on the lives, stopAt.js leftAtStop), on the answer's futures made worse by `shock` (ladderEngine.shockPath; its start set
 * here: from now 0, on the lives 12·S, so the saving years are as they were) or with lower returns (`dragPct`, the
 * household's returnDragPct). No answer result is read or changed: answerC runs exactly as before. null when the answer has
 * no pot to draw on, or the inputs are not ones it answers.
 */
export function stressCaseOf(inputs, env) {
  if (envProblems(env).length) return null;
  const checked = checkInputs(SCHEMA_C, inputs, env);
  if (!checked.ok) return null;
  if (usesLives(checked.inputs, env.today)) return stressCaseOnLives(checked, env, { defaulted: defaultedFields(checked.inputs, env) });
  const now = fromNowOf(checked, env);
  if (now.problems || !(now.plan.totalPots > 0)) return null;
  const { household, plan, level, weigher, toMonth, lw } = now;
  const n = env.futures;
  const lf = lifeFactsOf({ chance: lw.chance, basis: lw.basis, level }, weigher, plan, checked.inputs);
  const base = futuresList(n, plan.years, env);
  const monthsAt = ({ H, shock = null, dragPct = 0 }) => {
    const futures = shock ? futuresList(n, plan.years, { ...env, shock: { ...shock, from: 0 } }) : base;
    const p = dragPct > 0 ? enginePlan({ ...household, returnDragPct: dragPct }, env) : plan;
    const solver = createBandSolver(p, futures);
    const months = solver.runOutMonthsAtMonthly(H / 12);
    let left = null;
    try { left = leftAt({ runner: solver.runner, configsOf: () => configsAt(p, H), months, toMonth, years: p.years }); } catch { left = null; }
    return { months, left, plan: p };
  };
  return { q: 'c', inputs: checked.inputs, plan, weigher, level, toMonth, lf, n, drawingNow: true, monthsAt };
}

export function answerCReal(inputs, env) {
  const problems = envProblems(env);
  if (problems.length) return { status: 'invalid', problems };
  const checked = checkInputs(SCHEMA_C, inputs, env);
  if (!checked.ok) return { status: 'invalid', problems: Object.entries(checked.errors).map(([field, messageId]) => ({ field, messageId })) };

  // Money first taken at an age: the lives from today, through the years of paying in (step 4 brief section 10, J8).
  // From now (or with nothing to draw on and nothing going in) it is C as it has always been, below.
  if (usesLives(checked.inputs, env.today)) {
    const r = answerOnLives(checked, env, { units: UNITS, basisOf: (plan, n, lb) => basisOf(plan, env, n, lb), defaulted: defaultedFields(checked.inputs, env), finish: (result, plan, household, more) => finishOnLives(result, plan, checked, household, env, more) });
    return JSON.parse(JSON.stringify(r, (key, v) => (typeof v === 'number' ? noNegZero(v) : v)));
  }

  const now = fromNowOf(checked, env);
  if (now.problems) return { status: 'invalid', problems: now.problems.map((p) => ({ field: p.field, messageId: p.problem })) };
  const { household, fullStatePensionAYear, plan, level, weigher, planToAge, toMonth, lw } = now;
  const n = env.futures;
  if (!(plan.totalPots > 0)) return withoutPots(plan, checked, household, fullStatePensionAYear, env, n, lw);

  const futures = futuresList(n, plan.years, env);
  const onProgress = typeof env.onProgress === 'function' ? env.onProgress : undefined;
  const solver = env.solver === 'reference'
    ? createReferenceBandSolver(plan, futures, { onProgress })
    : createBandSolver(plan, futures, { onProgress, estimate: rememberedEstimate(plan, env) });
  const solved = solver.solve();
  const { k } = solved;
  if (env.solver !== 'reference') rememberEstimate(plan, env, k);
  // the band's own amounts (the search's spread: kept for the trace, never in the result)
  const spread = { careful: amountAt(k.careful), middling: amountAt(k.middling), good: amountAt(k.good) };
  const ageOfMonth = (m) => (m === null ? plan.endAge : plan.startAge + Math.floor(m / 12));
  const badAge = (months) => { const ages = months.map(ageOfMonth).sort((a, b) => a - b); return ages[Math.floor(n / 10)]; };
  const runOut = { careful: solver.runOutMonthsAt(k.careful), middling: solver.runOutMonthsAt(k.middling), good: solver.runOutMonthsAt(k.good) };
  // the three levels (7.8.0): each its amount, a month and a year, and its chance
  const lv = levelsFromSolver(solver, solved, weigher, LEVEL_IDS, toMonth, (w, ids) => weightedThresholdReference(plan, futures, w, ids));
  const levels = Object.fromEntries(LEVEL_IDS.map((id) => [id, { monthly: lv[id].monthly, yearly: round2(lv[id].monthly * 12), weighted: lv[id].chance.weighted, fixedAge: lv[id].chance.fixedAge }]));
  const shownMonthly = lv[level].monthly;

  let take = null;
  if (typeof checked.inputs.take === 'number') {
    const perMonth = checked.inputs.take;
    const months = solver.runOutMonthsAtMonthly(perMonth);
    const c = chanceOf(weigher, months, toMonth);
    const verdict = verdictOfChance(c, n, level, weigher);
    take = { perMonth, lasted: c.fixedAge, runOutAge: badAge(months), covered: verdict === 'yes', weighted: c.weighted, verdict };
  }

  // what you could spend changing with age (spending-shape.md 6.2): each level's amount at the start with the later steps
  // in proportion, and each year's figures at the level's amount
  const shaped = household.shape
    ? shapeOfAnswer({ household, plan, at: Object.fromEntries(LEVEL_IDS.map((id) => [id, levels[id].monthly])), level, yearly: phasesOf(yearlyPlan(plan), shownMonthly * 12), H0: shownMonthly * 12 }) : null;
  const result = {
    status: 'ok', inputs: checked.inputs,
    level, levels,
    ...(shaped || {}),
    chance: chanceBlock(lv[level].chance, n, lw.chance), whose: plan.whose,
    guaranteed: { monthlyAfterTax: round2(plan.guaranteedAYear / 12) },
    // (a phase the shape moves inside — a fall, moving evenly — says its figures are its first year's)
    phases: shaped ? markShapeMoves(phasesOf(plan, shownMonthly * 12), shaped.byYear) : phasesOf(plan, shownMonthly * 12), take, assumed: [], warnings: [], sentences: {},
    basis: basisOf(plan, env, n, lw.basis), units: UNITS
  };
  const typed = payInTyped(checked.inputs);
  if (typed) result.payIn = typed;
  const facts = factsOf(plan, checked, household, fullStatePensionAYear, env);
  // 7.8.0, weighing: the basis says so; the words read the chance's facts and the shortfall at the level's amount
  if (weigher.weighted) {
    result.basis.weighted = true;
    // (what is left at the plan-to age at the level's amount: each future's runs stopped at that month; none when a run
    // only `simulate` can make cannot stop part-way)
    let left = null;
    if (shownMonthly > 0) {
      const configs = configsAt(plan, shownMonthly * 12);
      try { left = leftAt({ runner: solver.runner || createFastRunner(plan, futures), configsOf: () => configs, months: lv[level].months, toMonth, years: plan.years }); } catch { left = null; }
    }
    facts.weighing = { lf: lifeFactsOf(result, weigher, plan, checked.inputs), sf: shownMonthly > 0 ? shortfallOf(plan, lv[level].months, shownMonthly * 12, { toMonth, left }) : null };
  }
  if (plan.startMoved && plan.totalIsa > 0 && shownMonthly > 0) facts.lockedSavingsMonths = Math.min(plan.movedBy * 12, Math.floor(plan.totalIsa / shownMonthly));
  result.sentences = sentencesFor(result, facts);
  result.assumed = assumedFor(result, facts);
  result.warnings = warningsFor(result, facts);
  finishTexts(result);

  if (env.trace) {
    const at = bandIndexes(n);
    const most = futures.map((f, i) => solver.most(i) * STEP);
    const byMost = futures.map((f, i) => i).sort((a, b) => most[a] - most[b] || a - b);
    const byMiddling = futures.map((f, i) => i).sort((a, b) => (runOut.middling[a] ?? Infinity) - (runOut.middling[b] ?? Infinity) || a - b);
    // 7.8.0, weighing: the months traced are at the amount the answer stands behind (its level's, which the phases are),
    // in the future that is the worst 1 in 10 by when it runs out at it; each future's run-out month at it is listed
    // (`shown`) beside the spread's. The runs go on past the plan-to age, to the weighting age: the trace keeps those
    // months, and what is counted to the plan-to age is counted to its month. Not weighing, as before.
    const shownMonths = weigher.weighted ? lv[level].months : null;
    const byShown = shownMonths ? futures.map((f, i) => i).sort((a, b) => (shownMonths[a] ?? Infinity) - (shownMonths[b] ?? Infinity) || a - b) : null;
    result.trace = {
      atCareful: shownMonths ? traceOf(plan, futures[byShown[at.careful]], shownMonthly) : traceOf(plan, futures[byMost[at.careful]], spread.careful),
      atMiddling: traceOf(plan, futures[byMiddling[at.careful]], spread.middling),
      futures: futures.map((f, i) => ({ id: f.id, most: most[i], runOutMonth: { careful: runOut.careful[i], middling: runOut.middling[i], good: runOut.good[i], ...(shownMonths ? { shown: shownMonths[i] } : {}) } })),
      evaluations: solver.evaluations
    };
  }
  return JSON.parse(JSON.stringify(result, (key, v) => (typeof v === 'number' ? noNegZero(v) : v)));
}

export const answerC = answerCReal;
