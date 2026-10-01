/**
 * Question C when the money is first taken at an age (start.kind 'age'): ONE TEST EVERYWHERE (step 4 brief section 10,
 * J8). A life is one future from today, through the years before the money is first taken — the pot invested, and
 * whatever goes in each month going in, rising with prices — and on through the years of taking it, on the rest of the
 * same life. "What it pays" is the careful amount (it lasts to the end age in 9 lives out of 10), the middling and
 * the good, exactly as A's row at the same stop age with the same pay-in works them out: the same household (A's
 * toHousehold, from C's inputs), the same lives, the same stop runner, the same band. So C at an age and A at that
 * age, paying in the same, are one figure (tests/v7/cross/oneTest.test.js).
 *
 * C starting now is not here: it is answer.js as it has always been (byte for byte), which is also A at "stop now"
 * (X1). Nor is a form with nothing to draw on and nothing going in.
 *
 * Pure: the same inputs and env give the same result on every device. Reads no clock, storage, network or screen.
 *
 *   usesLives(inputs, today)        whether C's checked inputs take this path (an age; or "now" moved to the age a
 *                                   pension opens, for someone still paying in and under it)
 *   startAgeOf(inputs, today)       the age the money is first taken on the lives
 *   saverInputsOf(inputs, stopAge)  C's checked inputs as A's (stop at C's start age; the saving risk is C's one risk)
 *   answerOnLives(checked, env, x)  the C result (C's shape, plus `saving`, `potAtStart`, `payIn`, basis.yearsSaving …)
 */
import { SAVING, firstAccessAge } from '../shared/rules.js';
import { payInTotalOf, earliestPensionStart } from '../shared/schemaParts.js';
import { validateHousehold } from '../shared/household.js';
import { bandIndexes, STEP } from '../shared/band.js';
import { stopAtPlan, createStopRunner, verdictAt, bandAt, phasesAt } from '../shared/stopAt.js';
import { savingRows } from '../shared/saving.js';
import { toHousehold as toSaverHousehold } from '../a/toHousehold.js';

const round2 = (x) => Math.round(x * 100) / 100;
const isNum = (v) => typeof v === 'number' && Number.isFinite(v);

/** What lands in `who`'s pension a month, as A takes it: one figure, or own and employer. */
function payInAsA(person) {
  const p = person && person.payIn;
  if (!p || p.has !== 'yes') return { kind: 'total', total: 0 };
  if (p.kind === 'split') return { kind: 'split', own: isNum(p.own) ? p.own : 0, employer: isNum(p.employer) ? p.employer : 0 };
  return { kind: 'total', total: isNum(p.total) ? p.total : 0 };
}

/**
 * True when C's checked inputs are answered on the lives: a start at an age, and something to draw on, or something
 * going in before the start. A start at the age they are now pays nothing in first (nothing more goes in from the
 * start), so with nothing to draw on it is the answer from now: the State Pension alone, never £0 a month.
 */
export function usesLives(inputs, today) {
  if (!inputs || !inputs.start) return false;
  if (inputs.start.kind === 'now') return movedToAccess(inputs, today);
  if (inputs.start.kind !== 'age') return false;
  const couple = inputs.household === 'couple' && inputs.partner;
  const pots = (inputs.you.pot || 0) + (couple ? inputs.partner.pot || 0 : 0) + (inputs.savings || 0);
  const going = payInTotalOf(inputs, 'you') + (couple ? payInTotalOf(inputs, 'partner') : 0);
  const later = typeof inputs.start.age === 'number' && typeof inputs.you.age === 'number' && inputs.start.age > inputs.you.age;
  return pots > 0 || (going > 0 && later);
}

/** The household's people as the start rules read them: you first; a pension is a pot, or something going in. */
function peopleOf(inputs) {
  const couple = inputs.household === 'couple' && inputs.partner;
  return (couple ? ['you', 'partner'] : ['you']).map((who) => ({
    who, age: inputs[who].age, pension: (inputs[who].pot || 0) > 0 || payInTotalOf(inputs, who) > 0, payingIn: payInTotalOf(inputs, who) > 0
  }));
}

/**
 * "Start taking it: now" while someone is still paying in and NO pension of the household can be touched yet: the money
 * cannot be taken now, so it is taken from the day the first pension opens — on the lives, with what goes in until then
 * and the pots invested (the reviewers' finding, 1 Oct 2026: the answer started at 57 anyway, but held the pot flat and
 * left out seven years of paying in). Person by person, so swapping "you" and "partner" moves the same date. Nobody
 * else's "now" moves here: C from now is unchanged (with a pension open now, what is paid in is not counted, and a
 * note says so).
 */
export function movedToAccess(inputs, today) {
  if (!inputs || !inputs.start || inputs.start.kind !== 'now' || typeof today !== 'string' || !inputs.you || typeof inputs.you.age !== 'number') return false;
  const people = peopleOf(inputs);
  const holders = people.filter((p) => p.pension);
  return people.some((p) => p.payingIn) && holders.length > 0 && holders.every((p) => firstAccessAge(p.age, today) > p.age);
}

/** The age the money is first taken on the lives: the age given, or — "now", moved — your age when the first pension opens. */
export function startAgeOf(inputs, today) {
  return inputs.start.kind === 'age' ? inputs.start.age : earliestPensionStart(peopleOf(inputs), today);
}

/**
 * C's checked inputs as A's: the stop is C's start age (both of a couple stop then, as A does); what goes in is C's
 * figures; the risk while paying in is C's one risk level (no slide); the charge while paying in is A's 0.5% a year;
 * nothing goes into savings each month; no part-time work. The spending is not used by what C asks (the band does not
 * depend on it); it is set to C's `take` when there is one.
 */
export function saverInputsOf(inputs, stopAge = inputs.start.kind === 'age' ? inputs.start.age : inputs.you.age) {
  const couple = inputs.household === 'couple' && inputs.partner;
  const person = (p) => ({ age: p.age, pot: p.pot || 0, payIn: payInAsA(p), alreadyDrawing: false, statePension: p.statePension, finalSalary: p.finalSalary });
  return {
    household: couple ? 'couple' : 'single',
    you: person(inputs.you),
    ...(couple ? { partner: person(inputs.partner) } : {}),
    savings: inputs.savings || 0,
    stop: { kind: 'age', age: stopAge },
    spend: { kind: 'amount', amount: isNum(inputs.take) && inputs.take >= 1 ? inputs.take : 1 },
    partTime: { has: false },
    savingsIn: 0, savingRisk: inputs.risk, risk: inputs.risk, charge: SAVING.charge * 100, endAge: inputs.endAge
  };
}

/** A's phase read as C's: C's fields only (no part-time at C), the shown take-home the same sum. */
function asCPhase(p) {
  return {
    fromAge: p.fromAge, toAge: p.toAge, ages: p.ages,
    takeHome: p.takeHome, fromPension: p.fromPension, fromSavings: p.fromSavings, fromPots: p.fromPots,
    statePension: p.statePension, finalSalary: p.finalSalary, tax: p.tax,
    byPerson: p.byPerson.map((b) => ({ who: b.who, statePension: b.statePension, finalSalary: b.finalSalary, fromPension: b.fromPension, fromSavings: b.fromSavings,
      tax: b.tax, takeHome: b.takeHome, higherRate: b.higherRate, locked: b.locked })),
    beforeStatePension: p.beforeStatePension,
    shown: { takeHome: p.shown.takeHome, fromPots: p.shown.fromPots, statePension: p.shown.statePension, finalSalary: p.shown.finalSalary }
  };
}

/** careful / middling / good of a list of figures (bandIndexes positions), whole pounds, and the lives at them. */
function positionsOf(values) {
  const order = Array.from(values.keys()).sort((a, b) => values[a] - values[b] || a - b);
  const at = bandIndexes(values.length);
  return { careful: order[at.careful], middling: order[at.middling], good: order[at.good] };
}
const spreadOf = (values) => { const p = positionsOf(values); return { careful: Math.round(values[p.careful]), middling: Math.round(values[p.middling]), good: Math.round(values[p.good]) }; };

/**
 * The amounts the last searches found, kept for the next search on the same household and seed (the first pass's 100
 * lives are the first 100 of the final 1,000): a hint only — the band settles on the same amounts with or without it.
 */
const remembered = new Map();
const keyOf = (inputs, env) => { const { take, ...rest } = inputs; void take; return JSON.stringify([rest, env.seed ?? 0, typeof env.futureReturns === 'function', env.mix || null, env.savingMix || null]); };

/** The band at one start age on the lives, its search started where the last search of the same inputs ended (a hint). */
function bandOn(inputs, household, startAge, env, onProgress) {
  const sp = stopAtPlan(household, startAge, env);
  const runner = createStopRunner(sp);
  const key = keyOf({ ...inputs, start: { kind: 'age', age: startAge } }, env);
  const band = bandAt(sp, runner, remembered.get(key) || null, { onProgress });
  remembered.delete(key);
  remembered.set(key, { ...band.k });
  if (remembered.size > 24) remembered.delete(remembered.keys().next().value);
  return { sp, runner, band };
}

/**
 * The years before a closed pension opens, when they set the answer (the reviewers' finding, 1 Oct 2026). A pension
 * still closed at the start is left alone until it opens and the rest of the money pays meanwhile; one steady amount
 * from the start is then held down to what that rest can pay — with a few thousand pounds of savings, near nothing.
 *
 * The test: some pension is closed at the start and less than half of the pension money (middling pots at the start) is
 * open there (the rule C has always moved its start by); `until` is the first opening, in your years, that makes it
 * half or more. The money that can pay before then (savings and any open pension, middling) must carry those years at
 * the amount the household would have starting at `until` (the closed periods' draw after the guaranteed income, at
 * today's prices — B's measure for the savings beside a closed pension). When it cannot, the answer says so in words of
 * its own, with both figures: the steady amount from the start (held down) and the amount starting at `until`. The
 * figures of the result are the band at the start as always (C at an age is A's row at that age); null otherwise.
 */
function closedYearsOf(inputs, sp, band, env) {
  const plan = sp.plan;
  const mid = sp.middling;
  const closed = plan.lockedUntil.filter((l) => plan.people.some((p, j) => p.who === l.who && mid[j].pension > 0));
  if (!closed.length) return null;
  const startAge = sp.stopAge;
  const pensionOf = (who) => { const j = plan.people.findIndex((p) => p.who === who); return j < 0 ? 0 : mid[j].pension; };
  const total = mid.reduce((t, q) => t + q.pension, 0);
  const shut = (years) => closed.filter((l) => l.years > years);
  const openAt = (years) => total - shut(years).reduce((t, l) => t + pensionOf(l.who), 0);
  if (openAt(0) >= total / 2) return null;
  const gap = [...new Set(closed.map((l) => l.years))].sort((a, b) => a - b).find((y) => openAt(y) >= total / 2);
  const until = startAge + gap;
  const reachable = mid.reduce((t, q, j) => t + q.isa + (closed.some((l) => l.who === plan.people[j].who) ? 0 : q.pension), 0);
  const later = bandOn(inputs, toSaverHousehold(saverInputsOf(inputs, until), env, until).household, until, env);
  const H = later.band.monthly.careful * 12;
  const need = plan.periods.filter((per) => per.from < gap).reduce((t, per) => t + Math.max(0, H - per.netTotal) * (Math.min(per.to, gap) - per.from), 0);
  if (reachable >= need) return null;
  const opening = closed.filter((l) => l.years === gap).map((l) => l.who);
  const partner = plan.people.find((p) => p.who === 'partner');
  return {
    from: startAge, until, who: opening, careful: band.monthly.careful,
    partnerUntil: partner ? partner.ageAtStart + gap : null,
    reachable: Math.round(reachable), need: Math.round(need),
    instead: { age: until, monthly: { ...later.band.monthly }, lasted: { ...later.band.lastedAt } }
  };
}

/**
 * The answer on the lives. `ctx` carries what answer.js knows: { facts(plan, household) → C's facts, finish(result,
 * facts) → sentences, assumed and warnings filled, units, basisOf(plan, n) }.
 */
export function answerOnLives(checked, env, ctx) {
  const inputs = checked.inputs;
  const n = env.futures;
  const startAge = startAgeOf(inputs, env.today);
  const { household } = toSaverHousehold(saverInputsOf(inputs, startAge), env, startAge);
  const hp = validateHousehold(household, env.today);
  if (hp.length) return { status: 'invalid', problems: hp.map((p) => ({ field: p.field, messageId: p.problem })) };

  const { sp, runner, band } = bandOn(inputs, household, startAge, env, typeof env.onProgress === 'function' ? env.onProgress : undefined);
  const plan = runner.plan;
  const closedYears = closedYearsOf(inputs, sp, band, env);

  // the pots at the start, per life: each person's pension and savings, today's prices
  const totals = new Float64Array(n);
  for (let i = 0; i < n; i++) for (const q of sp.pots) totals[i] += q.pension[i] + q.savings[i];
  const at = positionsOf(totals);
  const potAtStart = {
    careful: Math.round(totals[at.careful]), middling: Math.round(totals[at.middling]), good: Math.round(totals[at.good]),
    byPerson: sp.pots.map((q) => ({ who: q.who, pension: Math.round(q.pension[at.middling]), savings: Math.round(q.savings[at.middling]) }))
  };
  const S = sp.S;
  const saving = sp.saving.people.map((p, j) => {
    const q = sp.pots[j];
    return {
      who: p.who, stopAge: p.ageToday + S, yearsSaving: S,
      potToday: { pension: p.pot, savings: round2(p.savings) },
      payIn: { total: p.payIn.total, own: p.payIn.own, employer: p.payIn.employer, savings: 0 },
      potAtStop: { pension: spreadOf(q.pension), savings: spreadOf(q.savings), total: spreadOf(q.pension.map((v, i) => v + q.savings[i])) },
      paidIn: { total: Math.round(p.payIn.total * 12 * S * 100) / 100 },
      mix: { saving: inputs.risk, drawing: inputs.risk, slideYears: 0 },
      chargeAYear: SAVING.charge
    };
  });
  const payInTotal = saving.reduce((t, s) => t + s.payIn.total, 0);

  let take = null;
  if (isNum(inputs.take)) {
    const v = verdictAt(sp, runner, inputs.take * 12);
    take = { perMonth: inputs.take, lasted: v.lasted, runOutAge: v.runOutAge, covered: v.fails <= Math.floor(n / 10) };
  }

  const mid = sp.middling;
  const midTotal = mid.reduce((t, q) => t + q.pension + q.isa, 0);
  const basis = {
    ...ctx.basisOf(plan, n),
    split: sp.saving.people.map((p, j) => ({ who: p.who, share: midTotal > 0 ? (mid[j].pension + mid[j].isa) / midTotal : 1 / mid.length })),
    yearsSaving: S, lifeYears: sp.T, bondDraws: 'life', cashRule: 'previous-year', grid: 'yearly'
  };
  const result = {
    status: 'ok', inputs,
    monthly: { ...band.monthly }, yearly: { ...band.yearly }, lasted: { ...band.lastedAt }, runOutAge: { ...band.runOutAgeAt }, whose: plan.whose,
    guaranteed: { monthlyAfterTax: round2(plan.guaranteedAYear / 12) },
    phases: phasesAt(sp, band.monthly.careful * 12).map(asCPhase),
    take,
    payIn: { total: payInTotal, byPerson: saving.map((s) => ({ who: s.who, total: s.payIn.total })) },
    potAtStart,
    saving,
    ...(closedYears ? { closedYears } : {}),
    assumed: [], warnings: [], sentences: {},
    basis, units: ctx.units
  };
  ctx.finish(result, plan, household, { middling: mid, potAtStartMiddling: potAtStart.middling });

  if (env.trace) {
    // the saving months of the life whose pot at the start is the bad case, and every life's most and run-out months
    // (C's own `futures` list: the band read again from them). The drawing months are not traced here: the fast path's
    // run keeps no month-by-month record (A's trace says the same); the drawing years are C's engine at "now" (X1).
    const bad = at.careful;
    result.trace = {
      saving: { atCareful: { futureId: bad, priceAtStop: S > 0 ? sp.kernels[0].pension.priceAtStop[bad] : 1, potAtStart: round2(totals[bad]),
        rows: S > 0 ? sp.saving.people.flatMap((p) => savingRows(sp.saving, p, sp.lives[bad])) : [] } },
      futures: Array.from({ length: n }, (_, i) => ({ id: i, most: band.solver ? band.solver.most(i) * STEP : band.monthly.careful,
        runOutMonth: { careful: band.runOutMonths.careful[i], middling: band.runOutMonths.middling[i], good: band.runOutMonths.good[i] } })),
      evaluations: band.evaluations
    };
  }
  return result;
}
