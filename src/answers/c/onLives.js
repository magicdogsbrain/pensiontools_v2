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
 *
 * Couples who stop work in different years (research/v7/couples-different-years.md 5.1): a partner whose own stop is in
 * another year than your start — they already have, or at an age — is answered here, each at their own stop (A's
 * household, stopAt.js). The careful amount is what the two of you can spend once you have both stopped; until then the
 * pots pay their share of it (the pay line, untilBothStop). Either of you can be "you": "you from now, your partner at
 * 56" and "you at 56, your partner already stopped" are one figure. A partner who stops when you start — not answered,
 * "when you start", or said another way — is C as before: from now (answer.js) or here, byte for byte.
 */
import { SAVING, firstAccessAge, RULES } from '../shared/rules.js';
import { payInTotalOf, earliestPensionStart, stopYearsOf } from '../shared/schemaParts.js';
import { validateHousehold } from '../shared/household.js';
import { bandIndexes, STEP } from '../shared/band.js';
import { potsShareOf } from '../shared/toEngine.js';
import { stopAtPlan, createStopRunner, verdictAt, bandAt, phasesAt, coverAt } from '../shared/stopAt.js';
import { savingRows } from '../shared/saving.js';
import { apartOf } from '../shared/apart.js';
import { toHousehold as toSaverHousehold } from '../a/toHousehold.js';

const round2 = (x) => Math.round(x * 100) / 100;
const isNum = (v) => typeof v === 'number' && Number.isFinite(v);

/**
 * Whether the partner's own stop is in another year than your start (couples-different-years.md 5.1): they already have
 * and you start later, or they stop at an age that is not your start's year. Not answered, or "when you start": never.
 */
export function stopsApart(inputs, today) {
  if (!inputs || inputs.household !== 'couple' || !inputs.partner || !inputs.partner.stop || !inputs.start || !inputs.you) return false;
  const kind = inputs.partner.stop.kind;
  if (kind !== 'already' && kind !== 'age') return false;
  // your start: the age given, or "now" (moved to the day a pension opens when nothing can be touched now: movedToAccess)
  const start = inputs.start.kind === 'age' || movedToAccess(inputs, today) ? startAgeOf(inputs, today) : inputs.you.age;
  const own = stopYearsOf({ ...inputs, start: { kind: 'age', age: start } });
  return isNum(own.partner) && own.partner !== own.you;
}

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
  const couple = inputs.household === 'couple' && inputs.partner;
  const pots = (inputs.you.pot || 0) + (couple ? inputs.partner.pot || 0 : 0) + (inputs.savings || 0);
  const going = payInTotalOf(inputs, 'you') + (couple ? payInTotalOf(inputs, 'partner') : 0);
  // couples who stop in different years: each at their own stop, on the lives (5.1) — with something to draw on, or
  // going in (with neither, the answer is the pensions alone, from now, as before)
  if (stopsApart(inputs, today) && (pots > 0 || going > 0)) return true;
  if (inputs.start.kind === 'now') return movedToAccess(inputs, today);
  if (inputs.start.kind !== 'age') return false;
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
 *
 * A partner with a stop of their own ("they already have", or at an age: couples-different-years.md 5.1) pays in until
 * THEIR stop, which never moves yours: only your own paying in can. Without this, "you from now" with a partner still
 * paying in turned you — who have stopped — back into someone working until your pension opens, with "your pay" covering
 * half of what is spent (the reviewers' finding, 2 Oct 2026: a C link from A's "I've already stopped" opened on £2,610 a
 * month against A's £990). Your money is then drawn from now, a closed pension in its locked run, as A does.
 */
export function movedToAccess(inputs, today) {
  if (!inputs || !inputs.start || inputs.start.kind !== 'now' || typeof today !== 'string' || !inputs.you || typeof inputs.you.age !== 'number') return false;
  const people = peopleOf(inputs);
  const holders = people.filter((p) => p.pension);
  const payers = ownStopOf(inputs) ? people.filter((p) => p.who === 'you') : people;
  return payers.some((p) => p.payingIn) && holders.length > 0 && holders.every((p) => firstAccessAge(p.age, today) > p.age);
}

/** Whether a couple's partner has a stop of their own: "they already have", or at an age (not answered, "when you start": no). */
function ownStopOf(inputs) {
  const stop = inputs.household === 'couple' && inputs.partner ? inputs.partner.stop : null;
  return Boolean(stop && (stop.kind === 'already' || stop.kind === 'age'));
}

/** The age the money is first taken on the lives: the age given, or — "now", moved — your age when the first pension opens. */
export function startAgeOf(inputs, today) {
  return inputs.start.kind === 'age' ? inputs.start.age : earliestPensionStart(peopleOf(inputs), today);
}

/**
 * Your start on the lives: startAgeOf for an age or a moved "now"; "now" itself (couples apart: a partner who stops in
 * another year brings "now" here) is your age today.
 */
function livesStartAge(inputs, today) {
  return inputs.start.kind === 'age' || movedToAccess(inputs, today) ? startAgeOf(inputs, today) : inputs.you.age;
}

/**
 * C's checked inputs as A's: the stop is C's start age (both of a couple stop then, as A does); what goes in is C's
 * figures; the risk while paying in is C's one risk level (no slide); the charge is C's own (6.19.0: the household's one
 * charge, saving and drawing — 0.5% a year unless changed);
 * nothing goes into savings each month; no part-time work. The spending is not used by what C asks (the band does not
 * depend on it); it is set to C's `take` when there is one.
 */
export function saverInputsOf(inputs, stopAge = inputs.start.kind === 'age' ? inputs.start.age : inputs.you.age) {
  const couple = inputs.household === 'couple' && inputs.partner;
  // the new questions of couples-different-years.md 2 ride along only when answered: the tax-free part of someone who has
  // stopped, the partner's own stop (C's "when you start taking money" is A's "when you do") and the pay line
  const person = (p, own) => ({ age: p.age, pot: p.pot || 0, payIn: payInAsA(p), alreadyDrawing: false, statePension: p.statePension, finalSalary: p.finalSalary,
    ...(p.taxFreeTaken === true ? { taxFreeTaken: true } : {}), ...(own && p.stop ? { stop: { ...p.stop } } : {}) });
  return {
    household: couple ? 'couple' : 'single',
    you: person(inputs.you, false),
    ...(couple ? { partner: person(inputs.partner, true) } : {}),
    savings: inputs.savings || 0,
    stop: { kind: 'age', age: stopAge },
    spend: { kind: 'amount', amount: isNum(inputs.take) && inputs.take >= 1 ? inputs.take : 1 },
    partTime: { has: false },
    savingsIn: 0, savingRisk: inputs.risk, risk: inputs.risk, charge: isNum(inputs.charge) ? inputs.charge : SAVING.chargesPct, endAge: inputs.endAge,
    ...(couple && inputs.untilBothStop ? { untilBothStop: inputs.untilBothStop } : {})
  };
}

/** A's phase read as C's: C's fields only (no part-time at C), the shown take-home the same sum. */
function asCPhase(p) {
  const out = {
    fromAge: p.fromAge, toAge: p.toAge, ages: p.ages,
    takeHome: p.takeHome, fromPension: p.fromPension, fromSavings: p.fromSavings, fromPots: p.fromPots,
    statePension: p.statePension, finalSalary: p.finalSalary, tax: p.tax,
    byPerson: p.byPerson.map((b) => ({ who: b.who, statePension: b.statePension, finalSalary: b.finalSalary, fromPension: b.fromPension, fromSavings: b.fromSavings,
      tax: b.tax, takeHome: b.takeHome, higherRate: b.higherRate, locked: b.locked, ...(b.working !== undefined ? { working: b.working } : {}) })),
    beforeStatePension: p.beforeStatePension,
    shown: { takeHome: p.shown.takeHome, fromPots: p.shown.fromPots, statePension: p.shown.statePension, finalSalary: p.shown.finalSalary }
  };
  // couples apart, before the second stop (contract.js Phase): what the pay of the one still working covers. A's part-time
  // work is not C's, so nothing from work joins it: the shown figures still add up
  if (p.fromPay !== undefined) { out.fromPay = p.fromPay; out.shown.fromPay = p.shown.fromPay; }
  return out;
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
 * lives are the first 100 of the final 1,000): a hint only — where today's engine is monotone at £10 steps the band
 * settles on the same amounts with or without it. Only a pass over FEWER lives is the hint, never an earlier pass of the
 * same size, so the same inputs start the same search every time (C's answer.js and A's say why).
 */
const remembered = new Map();                                  // key → Map(lives → amounts in steps)
const keyOf = (inputs, env) => { const { take, ...rest } = inputs; void take; return JSON.stringify([rest, env.seed ?? 0, typeof env.futureReturns === 'function', env.mix || null, env.savingMix || null]); };

/** The band at one start age on the lives, its search started where a smaller pass of the same inputs ended (a hint). */
function bandOn(inputs, household, startAge, env, onProgress) {
  const sp = stopAtPlan(household, startAge, env);
  const runner = createStopRunner(sp);
  const key = keyOf({ ...inputs, start: { kind: 'age', age: startAge } }, env);
  const byN = remembered.get(key) || new Map();
  let hint = null;
  for (const [m, k] of byN) if (m < sp.n && (!hint || m > hint.m)) hint = { m, k };
  const band = bandAt(sp, runner, hint ? { ...hint.k } : null, { onProgress });
  byN.set(sp.n, { ...band.k });
  remembered.delete(key);
  remembered.set(key, byN);
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
  if (plan.apart) return closedYearsApart(inputs, sp, band, env);
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
 * closedYearsOf for a couple who stop in different years (couples-different-years.md 5.1): the same test, from where the
 * pay of the one still working stops covering (the second stop under Half or All while the pay makes up a gap, else the
 * first) — each pension measured from its holder's own stop, and nothing of someone still working open before their own
 * stop; the need there is the pots' share of what is spent. "Starting at X instead" moves your start only: the partner's
 * own stop stays. null when the pensions open in time, or when a start at X could not be answered (the years apart too
 * many, or no end after it).
 */
function closedYearsApart(inputs, sp, band, env) {
  const plan = sp.plan;
  const mid = sp.middling;
  const G = plan.apart.years;
  const cy = plan.apart.payCovers >= 1 || plan.apart.coversGap ? G : 0;
  // closed by the earliest pension age at the holder's own stop (lockedYears, from the household's start); a worker who has
  // simply not stopped yet is the pay line's business
  const holders = plan.people.map((p, j) => ({ p, j, shut: p.lockedYears })).filter((x) => mid[x.j].pension > 0);
  const closed = holders.filter((x) => x.shut > cy);
  if (!closed.length) return null;
  const total = holders.reduce((t, x) => t + mid[x.j].pension, 0);
  const openAt = (t) => total - closed.filter((x) => x.shut > t).reduce((s, x) => s + mid[x.j].pension, 0);
  if (openAt(cy) >= total / 2) return null;
  const gap = [...new Set(closed.map((x) => x.shut))].sort((a, b) => a - b).find((y) => openAt(y) >= total / 2);
  const you = plan.people.find((p) => p.who === 'you');
  const partner = plan.people.find((p) => p.who === 'partner');
  const until = you.ageAtStart + gap;
  // your start moved to `until`, the partner's own stop as it is: the end must still come after the later stop, under
  // 45 years after the first
  const own = stopYearsOf({ ...inputs, start: { kind: 'age', age: until } });
  const younger = Math.min(inputs.you.age, inputs.partner.age);
  const first = Math.min(own.you, own.partner);
  const last = Math.max(own.you, own.partner);
  if (!(until > sp.stopAge && inputs.endAge > younger + last && last - first < RULES.maxYears)) return null;
  // what can pay from the check: the savings of those who have stopped by then, and every pension open then
  const reachable = plan.people.reduce((t, p, j) => (p.join > cy ? t : t + mid[j].isa + (closed.some((x) => x.j === j) ? 0 : mid[j].pension)), 0);
  const later = bandOn(inputs, toSaverHousehold(saverInputsOf(inputs, until), env, until).household, until, env);
  const H = later.band.monthly.careful * 12;
  const need = plan.periods.filter((per) => per.to > cy && per.from < gap)
    .reduce((t, per) => t + Math.max(0, H * potsShareOf(per) - per.netTotal) * (Math.min(per.to, gap) - Math.max(per.from, cy)), 0);
  if (reachable >= need) return null;
  return {
    from: you.ageAtStart + you.join, until, who: closed.filter((x) => x.shut === gap).map((x) => x.p.who), careful: band.monthly.careful,
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
  const startAge = livesStartAge(inputs, env.today);
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
  // each person's own years until they stop (couples apart; one stop for both: the start)
  const own = Object.fromEntries(sp.stops.map((x) => [x.who, x.S]));
  const saving = sp.saving.people.map((p, j) => {
    const q = sp.pots[j];
    return {
      who: p.who, stopAge: p.ageToday + own[p.who], yearsSaving: own[p.who],
      potToday: { pension: p.pot, savings: round2(p.savings) },
      payIn: { total: p.payIn.total, own: p.payIn.own, employer: p.payIn.employer, savings: 0 },
      potAtStop: { pension: spreadOf(q.pension), savings: spreadOf(q.savings), total: spreadOf(q.pension.map((v, i) => v + q.savings[i])) },
      paidIn: { total: Math.round(p.payIn.total * 12 * own[p.who] * 100) / 100 },
      mix: { saving: inputs.risk, drawing: inputs.risk, slideYears: 0 },
      chargeAYear: sp.saving.charge
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
  // couples apart: each person's own stop, the pay line, and — in a bad case (the worst 1 in 10), at the careful amount —
  // the age from which the pay of the one still working covers all of what is spent
  const cover = plan.apart && plan.apart.coversGap && band.monthly.careful > 0 ? coverAt(sp, runner, band.monthly.careful * 12) : null;
  const apart = apartOf(plan, inputs, own, cover);
  const result = {
    status: 'ok', inputs,
    monthly: { ...band.monthly }, yearly: { ...band.yearly }, lasted: { ...band.lastedAt }, runOutAge: { ...band.runOutAgeAt }, whose: plan.whose,
    ...(apart ? { apart } : {}),
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
  ctx.finish(result, plan, household, { middling: mid, potAtStartMiddling: potAtStart.middling, own });

  if (env.trace) {
    // the saving months of the life whose pot at the start is the bad case, and every life's most and run-out months
    // (C's own `futures` list: the band read again from them). The drawing months are not traced here: the fast path's
    // run keeps no month-by-month record (A's trace says the same); the drawing years are C's engine at "now" (X1).
    const bad = at.careful;
    // (couples apart: each person's saving months to their own stop; the price level at your start)
    const saves = sp.saving.people.some((p) => p.until > 0);
    result.trace = {
      saving: { atCareful: { futureId: bad, priceAtStop: sp.saving.people[0].until > 0 ? sp.kernels[0].pension.priceAtStop[bad] : 1, potAtStart: round2(totals[bad]),
        rows: saves ? sp.saving.people.flatMap((p) => savingRows(sp.saving, p, sp.lives[bad])) : [] } },
      futures: Array.from({ length: n }, (_, i) => ({ id: i, most: band.solver ? band.solver.most(i) * STEP : band.monthly.careful,
        runOutMonth: { careful: band.runOutMonths.careful[i], middling: band.runOutMonths.middling[i], good: band.runOutMonths.good[i] } })),
      evaluations: band.evaluations
    };
  }
  return result;
}
