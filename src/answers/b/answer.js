/**
 * Question B — "Am I saving enough, and what should I pay in?" (step 4 brief 4.8, with section 10's J9).
 *
 * ONE TEST EVERYWHERE. A life is one future from today through the saving years and the drawing years (lives.js); the
 * money "works" when it lasts to the end age in that whole life, and "careful" is 9 lives in 10. C, A and B are three
 * slices of one function of (stop age, pay-in, spend):
 *   - the pay-in that gets there (the answer) is the least whole £10 a month into the pension at which the WHOLE life
 *     lasts in 9 lives out of 10 — A's "yes" at the stop age — paying in until the stop, then spending the target;
 *   - on course is that test at today's pay-in (= A's verdict at the stop age; `chance` and `wholeLife` are that count);
 *   - stop later is the first later age at which today's pay-in passes it (= A's earliest age that works, above the stop);
 *   - spend less is the careful amount at the stop age with today's pay-in (= A's careful there, = C's careful from that
 *     age with that pay-in);
 *   - more risk while saving is B again one level up; every lever, applied and asked again, gives its own figures.
 * The number stays as a guide: the pot that, if you had exactly that at the stop in every future, pays the spend in 9
 * futures out of 10. It is not the test.
 *
 * Stopping before a pension opens: the savings and the pension are one life. The savings set aside for the closed years
 * (`outside.careful`) carry them in every future tried (CLOSED_YEARS_FAILS), so they never spend the 1-in-10 allowance on
 * their own; what goes into savings each month to get there is `payIn.outside`; the pension pay-in is then solved on the
 * whole life with that saving going in.
 *
 * Pure: the same inputs and env give the same result on every device. Reads no clock, storage, network or screen. Never
 * throws for a bad value: returns status 'invalid' with the problems. Nothing here is saved, and nothing under
 * src/storage or src/firebase is read.
 *
 * @param {object} inputs  checked inputs of SCHEMA_B (unchecked inputs are checked here again)
 * @param {import('../shared/contract.js').Env & { detail?: 'answer' | 'grid' }} env
 * @returns {import('../shared/contract.js').AnswerB}
 *
 * Couples who stop work in different years (research/v7/couples-different-years.md 5.3): the answer is about the person
 * still working — you, or your partner when you have already stopped (askedAbout) — and every stop age here is theirs;
 * the other's stop is fixed, or moves alongside ("when you do"). The number is the pensions of the people still saving,
 * each at their own stop; the pay-in that gets there is shared among them only (by today's ratio, or evenly when nobody
 * pays in now) and goes in until each one's own stop; the savings for the years before a pension opens are measured from
 * where the pay of the one still working stops covering. A couple who have both stopped have no saving question: 'invalid'
 * with partner-stop-after-now (the form shows the retired view). One stop for both: today's answer, figure for figure.
 */
import { SCHEMA_B } from './schema.js';
import { checkInputs, defaults, flatten } from '../shared/validate.js';
import { RULES, SAVING, CLOSED_YEARS_FAILS, accessRiseAffects } from '../shared/rules.js';
import { VERSION } from '../../constants.js';
import { validateHousehold, firstOpenAge } from '../shared/household.js';
import { historyEnd, historyStartYear } from '../shared/futures.js';
import { bandIndexes } from '../shared/band.js';
import { outOfTen } from '../shared/format.js';
import { ONE_NAME_SHARE, BANDS, potsShareOf, potsNeedByYear, amountInYear } from '../shared/toEngine.js';
import { livesList } from '../shared/lives.js';
import { savingRows } from '../shared/saving.js';
import { stopAtPlan, createStopRunner, verdictAt, bandAt, phasesAt, savingsNeeded, potNeededAt, potNeeded,
  lastsWithin, verdictAtPayIns, countsAtPayIns, leastPayIn, coverAt } from '../shared/stopAt.js';
import { gridToShow, spendLevelAMonth, handOverToC, askedAbout, stopYearsOf } from '../shared/schemaParts.js';
import { apartOf, before2028, payKeepsPensions } from '../shared/apart.js';
import { shapeOfAnswer, markShapeMoves } from '../shared/shapeAnswer.js';
import { toHousehold, payInOf } from './toHousehold.js';
import { sentencesFor, assumedFor, warningsFor, finishTexts } from './sentences.js';

const UNITS = { money: 'todays-prices', tax: 'after-tax', period: 'month', who: 'household' };
const RISKS = ['cautious', 'balanced', 'adventurous'];
const round2 = (x) => Math.round(x * 100) / 100;
const noNegZero = (x) => (Object.is(x, -0) ? 0 : x);

/**
 * The years between today and the check of the years before a pension opens: where the pay of the one still working
 * stops covering — the second stop under Half or All while the pay makes up a gap, else the first (A's checkYearOf).
 */
const checkYearOf = (plan) => (!plan.apart ? 0 : plan.apart.payCovers >= 1 || plan.apart.coversGap ? plan.apart.years : 0);

function envProblems(env) {
  const problems = [];
  if (!env || typeof env.today !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(env.today)) problems.push({ field: 'env.today', messageId: 'required' });
  if (!env || !Number.isInteger(env.futures) || env.futures < 1) problems.push({ field: 'env.futures', messageId: 'required' });
  return problems;
}

/** The fields whose value is the input list's default (decided by value, as C decides it). */
function defaultedFields(inputs, env) {
  const flat = flatten(inputs);
  const d = defaults(SCHEMA_B, flat, env);
  return Object.keys(d).filter((path) => path in flat && flat[path] === d[path]);
}

/** careful / middling / good of a list (the positions of bandIndexes), whole pounds. */
function spread(values) {
  const s = Array.from(values).sort((a, b) => a - b);
  const at = bandIndexes(s.length);
  return { careful: Math.round(s[at.careful]), middling: Math.round(s[at.middling]), good: Math.round(s[at.good]) };
}

/**
 * The household pension at the stop in each life with `payIns` (per person) going in. `only` (couples apart): the people
 * whose pensions count — those still saving, whose pensions the number is.
 */
function pensionsAt(sp, payIns, only = null) {
  const n = sp.n;
  const out = new Float64Array(n);
  sp.kernels.forEach((k, j) => { if (only && !only[j]) return; for (let i = 0; i < n; i++) out[i] += k.pension.A[i] + payIns[j].pension * k.pension.B[i]; });
  return out;
}

/**
 * The drawing years when the asked person stops at `stopAge`: S, their years until it; D, the drawing years; T, the years
 * of life used. Couples apart: each at their own stop (schemaParts.js stopYearsOf) — D runs from the first stop, and the
 * later stop must come before the end and under 45 years after the first (`fits`). One stop for both: as before.
 */
function lifeYearsAt(inputs, stopAge) {
  const couple = inputs.household === 'couple' && inputs.partner;
  const own = stopYearsOf(inputs, stopAge);
  const list = couple ? [own.you, own.partner] : [own.you];
  const first = Math.min(...list);
  const last = Math.max(...list);
  const S = askedAbout(inputs) === 'partner' ? own.partner : own.you;
  const younger = Math.min(inputs.you.age, couple ? inputs.partner.age : Infinity);
  const D = Math.min(RULES.maxYears, inputs.endAge - (younger + first));
  return { S, D, T: first + D, own, fits: D >= 1 && inputs.endAge > younger + last && last - first < RULES.maxYears };
}

/**
 * The years after the stop before any pension can be touched (every pension holder closed): what the savings must pay,
 * today's prices — the closed periods' need after the guaranteed income — and the age the first pension opens. null when
 * a pension is open at the stop.
 * Couples apart: from where the pay of the one still working stops covering (checkYearOf: the second stop under Half or
 * All, the first under "None of it"); a holder is anyone with a pension (the stopped person's as given too), and one still
 * working has nothing open before their own stop; the need is the pots' share of what is spent there.
 */
function outsideOf(plan, H, split, today, sp = null) {
  if (plan.apart) {
    const cy = checkYearOf(plan);
    const holders = plan.people.filter((p, j) => split[j] > 0 || (sp && sp.middling[j].pension > 0));
    if (!holders.length) return null;
    // closed by the earliest pension age at the holder's own stop: the years (from the household's start) until it opens;
    // open there, 0 — a worker who has simply not stopped yet is the pay line's business, not a closed pension
    const shut = holders.map((p) => { const own = p.ageAtStart - p.ageToday + p.join; const open = firstOpenAge(p.ageToday, today, own); return open > p.ageToday + own ? open - p.ageAtStart : 0; });
    if (!shut.every((w) => w > cy)) return null;
    const gap = Math.min(...shut) - cy;
    const amount = plan.shape && plan.shape.r ? closedNeed(plan, H, cy, cy + gap) : plan.periods.filter((per) => per.to > cy && per.from < cy + gap)
      .reduce((s, per) => s + Math.max(0, H * potsShareOf(per) - per.netTotal) * (Math.min(per.to, cy + gap) - Math.max(per.from, cy)), 0);
    return { amount: Math.round(amount), untilAge: plan.startAge + cy + gap, gap };
  }
  const holders = plan.people.filter((p, j) => split[j] > 0);
  if (!holders.length) return null;
  const waits = holders.map((p) => firstOpenAge(p.ageToday, today, p.ageAtStart - p.ageToday) - p.ageAtStart);
  if (!waits.every((w) => w > 0)) return null;
  const gap = Math.min(...waits);
  const amount = plan.shape && plan.shape.r ? closedNeed(plan, H, 0, gap) : plan.periods.filter((per) => per.from < gap).reduce((s, per) => s + Math.max(0, H - per.netTotal) * (Math.min(per.to, gap) - per.from), 0);
  return { amount: Math.round(amount), untilAge: plan.startAge + gap, gap };
}

/** What the pots pay in the years [from, to) at a year-0 amount of H, year by year (a shape: spending-shape.md 5.2). */
function closedNeed(plan, H, from, to) {
  const need = potsNeedByYear(plan, H);
  let sum = 0;
  for (let y = Math.max(0, from); y < Math.min(to, plan.years); y++) sum += need[y];
  return sum;
}

/**
 * One stop age as B reads it, built lazily and kept for the answer (the levers and the grid ask about the same ages):
 * the stop plan on the shared lives, today's runner, the closed years' floor and the guide number at a spend, and the
 * one test at any pay-in.
 */
function createAges(inputs, env, lives, ctx) {
  const n = lives.length;
  const cache = new Map();
  const partner = askedAbout(inputs) === 'partner';
  const asked = inputs[partner ? 'partner' : 'you'];
  return function at(stopAge, savingRisk = inputs.savingRisk) {
    const key = `${stopAge}:${savingRisk}`;
    if (cache.has(key)) return cache.get(key);
    const { D, own, fits } = lifeYearsAt(inputs, stopAge);
    let row = null;
    if (D >= 1 && fits && stopAge > asked.age && stopAge <= RULES.stopAgeMax) {
      // the asked person stops at `stopAge`: you (as before), or your partner when you have already stopped
      const { household } = partner ? toHousehold({ ...inputs, savingRisk }, env, stopAge) : toHousehold({ ...inputs, savingRisk, stop: { age: stopAge } }, env);
      const sp = stopAtPlan(household, inputs.you.age + own.you, env, lives);
      const runner = createStopRunner(sp);
      row = { stopAge, sp, runner, household, numbers: new Map(), floors: new Map(), whole: null, band: null };
      // the spend in this stop's first year: a step at or before a later stop is in force from it (spending-shape.md 6.4);
      // the stop asked about starts before every step, so its amount is the figure as typed
      const f = sp.plan.shape ? sp.plan.shape.a0 : 1;
      row.H = (H) => (f === 1 ? H : H * f);
      // what goes in a month, per person: into the pension at a household total `c` (split as now), into savings at a
      // household total `d` (split evenly, as savings are — couples apart: among those still saving); today's figures are
      // the stop plan's own
      row.payInsAt = (c, d = ctx.savingsInNow) => sp.saving.people.map((p, j) => ({
        pension: c === ctx.now ? p.payIn.total : c * ctx.shares[j],
        savings: d === ctx.savingsInNow ? p.payIn.savings : ctx.savers[j] ? d / ctx.saverCount : 0
      }));
      // the closed years at a spend: what they draw, and the savings at the stop that carry them in every future tried
      row.outsideAt = (H) => {
        if (!row.floors.has(H)) {
          const o = outsideOf(sp.plan, row.H(H), sp.split, env.today, sp);
          if (o) o.careful = savingsNeeded(sp, row.H(H), CLOSED_YEARS_FAILS, o.amount);
          row.floors.set(H, o);
        }
        return row.floors.get(H);
      };
      row.optsAt = (H) => {
        const o = row.outsideAt(H);
        const floor = o ? (o.careful ?? o.amount) : 0;
        return o ? { savingsOf: (i, j) => Math.max(sp.pots[j].savings[i], floor * sp.split[j]) } : {};
      };
      // the guide number at a spend and a count of lives allowed to fail (`guess` brackets the search: a hint only)
      row.number = (H, allowed, guess, guessSpread) => {
        const k = `${H}:${allowed}`;
        if (!row.numbers.has(k)) row.numbers.set(k, potNeeded(sp, runner, row.H(H), allowed, { ...row.optsAt(H), ...(Number.isFinite(guess) ? { guess, guessSpread } : {}) }));
        return row.numbers.get(k);
      };
      // the household pension at the stop in a bad case (the worst 1 in 10) at today's pay-ins: a guess for the number
      row.carefulPot = () => spread(pensionsAt(sp, row.payInsAt(ctx.now))).careful;
      // the one test at pay-ins (c into the pension, d into savings, household totals)
      row.lasts = (H, c, d, allowed) => lastsWithin(sp, row.H(H), row.payInsAt(c, d), allowed);
      row.count = (H, c, d) => verdictAtPayIns(sp, row.H(H), row.payInsAt(c, d));
      row.wholeNow = (H) => (row.whole && row.whole.H === H ? row.whole.v : (row.whole = { H, v: verdictAt(sp, runner, row.H(H)) }).v);
      row.bandNow = () => row.band || (row.band = bandAt(sp, runner));
    }
    cache.set(key, row);
    return row;
  };
}

/**
 * Where each life's own pay-in lies, from each life's own least pot (potNeededAt's onLeast, whole £1,000): the life
 * lasts once its household pension at the stop reaches that pot, so its pay-in is between (P − £1,000 − A_i) / B_i and
 * (P − A_i) / B_i (the kernel is linear in what goes in). The quantile of those at `allowed` failures brackets the
 * search; the search itself decides (a couple's pay-in is split as now, the pot by the middling pots: only a hint).
 */
function guessFrom(row, least, allowed, ctx) {
  if (!least) return null;
  const sp = row.sp;
  const n = sp.n;
  const step = SAVING.potStep;
  const top = Math.round(SAVING.potMax / step);
  const lo = new Float64Array(n);
  const hi = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    let A = 0, B = 0;
    // (couples apart: the pensions of those still saving — the number's — and no one else's)
    sp.kernels.forEach((k, j) => { if (!ctx.savers[j]) return; A += k.pension.A[i]; B += ctx.shares[j] * k.pension.B[i]; });
    if (least[i] > top) { lo[i] = Infinity; hi[i] = Infinity; continue; }
    const P = least[i] * step;
    hi[i] = A >= P ? 0 : B > 0 ? (P - A) / B : Infinity;
    lo[i] = A >= P - step ? 0 : B > 0 ? (P - step - A) / B : Infinity;
  }
  lo.sort();
  hi.sort();
  const need = n - allowed;
  return need >= 1 ? { lo: lo[need - 1], hi: hi[need - 1] } : null;
}

/**
 * The pay-ins that get there at one stop age and saving risk: what goes into savings each month for the closed years
 * (when the pension is closed at the stop), and the least whole £10 into the pension at which the whole life lasts with
 * at most `allowed` lives failing. → { outside: number|null, savingsIn, at: { nineInTen, threeInFour } } — only the
 * confidences asked for (`which`) are worked out; the others are null.
 */
function payInsThatGetThere(row, H, ctx, least = null, which = ['nineInTen', 'threeInFour']) {
  const o = row.outsideAt(H);
  let outsideIn = null;
  if (o) {
    // the savings a month (household, split evenly) that carry the closed years in every future tried with the pension
    // out of the way (a pension of SAVING.potMax behind them): no less than what goes in now
    const okSavings = (d) => lastsWithin(row.sp, row.H(H), row.payInsAt(ctx.now, d), CLOSED_YEARS_FAILS, { pensionAt: SAVING.potMax });
    // a bracket: what reaches the closed years' draw in every life, and what reaches the savings set aside for them
    const sp = row.sp;
    const reachAll = (target) => {
      let most = 0;
      for (let i = 0; i < sp.n; i++) {
        let A = 0, B = 0;
        sp.kernels.forEach((k, j) => { A += k.savings.A[i]; if (ctx.savers[j]) B += k.savings.B[i] / ctx.saverCount; });
        const need = target <= A ? 0 : B > 0 ? (target - A) / B : Infinity;
        if (need > most) most = need;
      }
      return most;
    };
    const guess = { lo: reachAll(o.amount), hi: reachAll(o.careful ?? o.amount) };
    outsideIn = leastPayIn(okSavings, SAVING.payInCeiling * ctx.saverCount, ctx.savingsInNow, guess);
  }
  const savingsIn = outsideIn === null ? ctx.savingsInNow : Math.max(ctx.savingsInNow, outsideIn);
  const solve = (allowed, cap = ctx.ceiling) => leastPayIn((c) => row.lasts(H, c, savingsIn, allowed), cap, 0, guessFrom(row, least, allowed, ctx));
  const at = { nineInTen: null, threeInFour: null };
  if (which.includes('nineInTen')) at.nineInTen = solve(ctx.allowed.careful);
  if (which.includes('threeInFour')) {
    // 3 in 4 never needs more than 9 in 10
    at.threeInFour = at.nineInTen === 0 ? 0 : solve(ctx.allowedClose, at.nineInTen === null ? ctx.ceiling : at.nineInTen);
  }
  return { outside: o ? outsideIn : null, savingsIn, at };
}

export function answerB(inputs, env) {
  const problems = envProblems(env);
  if (problems.length) return { status: 'invalid', problems };
  const checked = checkInputs(SCHEMA_B, inputs, env);
  if (!checked.ok) return { status: 'invalid', problems: Object.entries(checked.errors).map(([field, messageId]) => ({ field, messageId })) };
  const inp = checked.inputs;
  // the person the answer is about: you, or — "I've already stopped" — your partner, who must still be working
  const partnerAsked = askedAbout(inp) === 'partner';
  if (partnerAsked && !(inp.partner.stop && inp.partner.stop.kind === 'age')) {
    // you have both stopped: no saving question (the form shows the retired view)
    return { status: 'invalid', problems: [{ field: 'partner.stop.kind', messageId: 'partner-stop-after-now' }] };
  }

  const stopAge = partnerAsked ? inp.partner.stop.age : inp.stop.age;
  const { household, fullStatePensionAYear } = toHousehold(inp, env);
  const hp = validateHousehold(household, env.today);
  if (hp.length) return { status: 'invalid', problems: hp.map((p) => ({ field: p.field, messageId: p.problem })) };

  const n = env.futures;
  const detail = env.detail === 'grid' ? 'grid' : 'answer';
  const allowed = { careful: Math.floor(n / 10), middling: Math.floor(n / 2), good: n - Math.ceil(n / 10) };
  const couple = inp.household === 'couple' && Boolean(inp.partner);
  const whos = couple ? ['you', 'partner'] : ['you'];
  // each person's years until their own stop at the asked stop; who is still saving (one stop for both: everyone)
  const { D, S, own } = lifeYearsAt(inp, stopAge);
  const apartNow = couple && own.you !== own.partner;
  const savers = whos.map((w) => !apartNow || own[w] > 0);
  const saverCount = savers.filter(Boolean).length;
  // the most that can go in a month: each person's box holds up to SAVING.payInCeiling (brief 28) — each still saving
  const ceiling = SAVING.payInCeiling * saverCount;
  // what goes in now: nothing from someone who has stopped
  const payIns = whos.map((w, j) => (savers[j] ? payInOf(inp[w]) : { total: 0, own: null, employer: null }));
  const now = payIns.reduce((s, p) => s + p.total, 0);
  const shares = payIns.map((p, j) => (!savers[j] ? 0 : now > 0 ? p.total / now : 1 / saverCount));
  const savingsInNow = inp.savingsIn || 0;
  const spendMonth = inp.spend.kind === 'level' ? spendLevelAMonth(inp.household, inp.spend.level) : inp.spend.amount;
  const H = spendMonth * 12;
  // the most the household can pay in, split as now: no one's part above their box's £10,000 (a couple paying in
  // evenly: £20,000; with everything going into one name: £10,000)
  const solveCeiling = Math.floor(SAVING.payInCeiling / Math.max(...shares) / 10 + 1e-9) * 10;
  const ctx = { now, shares, savingsInNow, ceiling: solveCeiling, people: whos.length, savers, saverCount, allowed, allowedClose: Math.floor(n / 4) };

  // The lives: long enough for the stop and every later age the stop-later lever and the grid may try (to 75).
  const later = [];
  for (let a = stopAge + 1; a <= RULES.stopAgeMax; a++) { const x = lifeYearsAt(inp, a); if (x.D >= 1 && x.fits) later.push(a); }
  const T = Math.max(...[stopAge, ...later].map((a) => lifeYearsAt(inp, a)).filter((x) => x.D >= 1 && x.fits).map((x) => x.T));
  const lives = livesList(n, T, env);
  const ages = createAges(inp, env, lives, ctx);
  const base = ages(stopAge);
  const { sp, runner } = base;
  const plan = sp.plan;
  const pensionOpens = Object.fromEntries(whos.map((w) => [w, firstOpenAge(inp[w].age, env.today)]));

  // ---- the guide number: the least whole £1,000 of household pension at the stop that pays the spend ------------------
  // (couples apart: the pensions of those still saving, each at their own stop; before the second stop the pots pay only
  // their share of what is spent)
  // (couples apart: before the check year the pay of the one still working makes up whatever the pots' share is short of,
  // so only the years from there need the State and final-salary pensions to cover it)
  // (a shape: year by year — spending-shape.md 5.2)
  const guaranteedCovers = plan.shape && plan.shape.r
    ? plan.periods.every((per) => { for (let y = per.from; y < per.to; y++) if (!((plan.apart && per.to <= checkYearOf(plan)) || per.netTotal >= amountInYear(plan, H, y) * potsShareOf(per) - 1e-9)) return false; return true; })
    : plan.apart
      ? plan.periods.every((per) => per.to <= checkYearOf(plan) || per.netTotal >= H * potsShareOf(per) - 1e-9)
      : plan.periods.every((per) => per.netTotal >= H - 1e-9);
  const opts = base.optsAt(H);
  let least = null;
  const [rc, rm, rg] = potNeededAt(sp, H, [allowed.careful, allowed.middling, allowed.good], { ...opts, onLeast: (l) => { least = l; } });
  for (const [f, v] of [[allowed.careful, rc], [allowed.middling, rm], [allowed.good, rg]]) base.numbers.set(`${H}:${f}`, v);
  let number = null;
  if (guaranteedCovers) number = { careful: 0, middling: 0, good: 0 };
  else if (rc !== null) number = { careful: rc, middling: rm ?? rc, good: rg ?? rc };
  if (number) {
    // each person's part by the split: the larger part rounded, the smaller the rest, so a half pound goes the same way
    // whichever of the two is "you" (M-B11)
    const big = sp.split.indexOf(Math.max(...sp.split));
    const pots = whos.map((who, p) => Math.round(number.careful * sp.split[p]));
    if (whos.length === 2) pots[1 - big] = number.careful - pots[big];
    number.byPerson = whos.map((who, p) => ({ who, pot: pots[p] }));
  }

  // ---- the years before a pension can be touched: what the savings must pay (brief conflict 38; J9) ----------------------
  const baseOutside = base.outsideAt(H);
  const anyPensionAtStop = sp.middling.some((q) => q.pension > 0) || (number !== null && number.careful > 0);
  const floorUsed = Boolean(baseOutside) && sp.pots.some((q, j) => q.savings.some((v) => v < (baseOutside.careful ?? baseOutside.amount) * sp.split[j]));
  const outside = baseOutside && (anyPensionAtStop || floorUsed)
    ? { amount: baseOutside.amount, careful: baseOutside.careful ?? baseOutside.amount, untilAge: baseOutside.untilAge } : null;
  const gapYears = outside ? baseOutside.gap : 0;

  // ---- the one test at today's pay-ins: on course, the chance, the whole life ------------------------------------------
  const whole = base.wholeNow(H);
  const wholeRunOutAge = whole.runOutAge;
  const fails = whole.fails;
  const lasted = whole.lasted;
  const onCourse = fails <= allowed.careful;

  // ---- the pay-ins that get there: the whole life in 9 in 10 (and 3 in 4) ------------------------------------------------
  const solved = guaranteedCovers ? { outside: null, savingsIn: savingsInNow, at: { nineInTen: 0, threeInFour: 0 } } : payInsThatGetThere(base, H, ctx, least);
  const at = solved.at;
  const confidence = inp.confidence;
  const needed = at[confidence];
  // (someone who has stopped pays nothing in, and is left out of the split)
  const everySplit = payIns.every((p, j) => !savers[j] || p.own !== null);
  // (couples apart: the pensions of those still saving — what the number is of; one who has stopped keeps theirs as given)
  const only = plan.apart ? savers : null;
  const potNow = spread(pensionsAt(sp, base.payInsAt(now), only));
  const potNeededSpread = needed === null ? null : spread(pensionsAt(sp, base.payInsAt(needed, solved.savingsIn), only));
  const short = number === null ? null : Math.max(0, number.careful - potNow.careful);
  // what you could spend from the stop with today's pay-in (A's careful amount at this stop age; C's from that age)
  const careNow = base.bandNow();
  const monthlyIfShort = careNow.monthly.careful;
  const payInOutside = outside ? solved.outside : null;

  // ---- the status ---------------------------------------------------------------------------------------------------
  const status = guaranteedCovers ? 'guaranteed-only' : number === null || needed === null ? 'out-of-reach' : 'ok';

  // ---- the ways to make it fit: each applied and asked again gives its own figures --------------------------------------
  const levers = { stopLater: null, payMore: null, spendLess: null, moreRisk: null, accept: { lasted, short, monthlyIfShort } };
  let stopLaterSearched = null;
  if (!onCourse && status !== 'guaranteed-only') {
    // stop later: the first later age at which today's pay-ins pass the one test (A's earliest age that works, above the stop)
    stopLaterSearched = later.length ? later[later.length - 1] : null;
    for (const a of later) {
      const row = ages(a);
      if (!row) continue;
      if (!lastsWithin(row.sp, row.H(H), row.payInsAt(now), allowed.careful)) continue;
      levers.stopLater = { age: a, lasted: row.wholeNow(H).lasted };
      break;
    }
    // pay more: the pay-in that gets there (and the savings a month the closed years need, when more than now)
    // (when it is savings that fall short, what goes into the pension stays as it is: never less than now)
    if (needed !== null && (needed > now || solved.savingsIn > savingsInNow)) {
      const payIn = Math.max(needed, now);
      levers.payMore = { payIn, savingsIn: solved.savingsIn > savingsInNow ? solved.savingsIn : null, lasted: base.count(H, payIn, solved.savingsIn).lasted };
    }
    // spend less: the careful amount with today's pay-ins (A's careful amount at this stop age)
    if (monthlyIfShort > 0 && monthlyIfShort < spendMonth) {
      levers.spendLess = { spend: monthlyIfShort, lasted: careNow.lastedAt.careful };
    }
    // more risk while saving: B again one level up — the same lives, the saving years in the riskier mix
    const up = RISKS[RISKS.indexOf(inp.savingRisk) + 1];
    if (up) {
      const riskier = ages(stopAge, up);
      const r = payInsThatGetThere(riskier, H, ctx, least, [confidence]);
      const payIn = r.at[confidence];
      // it helps when it lowers a pay-in into the pension that has to rise (not one already covered by today's)
      levers.moreRisk = { level: up, payIn, lasted: riskier.wholeNow(H).lasted, helps: payIn !== null && (needed === null || (needed > now && payIn < needed)) };
    }
  }

  // ---- the grid: stop age against pay-in, built around the answer (detail 'grid'; each cell the one test) ---------------
  let gridOut = null;
  if (detail === 'grid') {
    const g = gridToShow(inp, env, { stopLater: levers.stopLater ? levers.stopLater.age : null, needed });
    let lastNumber = number && number.careful > 0 ? number.careful : null;
    gridOut = {
      ages: g.ages.map((a) => {
        const row = ages(a);
        // each row's guide number from its neighbour's (a hint: the search settles on the same £1,000 either way)
        const guess = lastNumber !== null ? lastNumber : row ? row.carefulPot() : null;
        const num = row ? row.number(H, allowed.careful, guess, lastNumber !== null ? 0.03 : 0.05) : null;
        if (num !== null && num > 0) lastNumber = num;
        const counts = row ? countsAtPayIns(row.sp, row.H(H), g.payIns.map((p) => row.payInsAt(p, savingsInNow))) : null;
        const cells = g.payIns.map((p, j) => {
          const v = counts ? counts[j] : null;
          const l = v ? v.lasted : 0;
          return { payIn: p, lasted: l, outOfTen: outOfTen(l), verdict: v ? v.verdict : 'no' };
        });
        return { age: a, number: num, cells };
      }),
      payIns: g.payIns
    };
    gridOut.reaches = gridOut.ages.some((r) => r.cells.some((c) => c.verdict === 'yes'));
  }

  // ---- the phases: the drawing years at the spend, from the stop -----------------------------------------------------
  // at the number (careful), split as the number is; each person's savings at the middling life (no less than the
  // closed years draw). Out of reach: at the most the search tries, so the phases still show what the spend is made of.
  const phasePot = number ? number.careful : SAVING.potMax;
  // (no pension needed but savings set aside for the years before one opens: the savings pay, and the phases say so)
  // (couples apart: the number is the pensions of those still saving; one who has stopped keeps their middling money)
  const phasePension = (w, j) => (plan.apart && !savers[j] ? sp.middling[j].pension : phasePot * w);
  const phasePots = phasePot > 0 || outside ? sp.split.map((w, j) => ({ pension: phasePension(w, j), isa: Math.max(sp.middling[j].isa, outside ? outside.amount * w : 0) })) : null;
  const phases = phasePots ? phasesAt(sp, H, phasePots) : phasesAt(sp, H);
  // what is spent changing with age (spending-shape.md 6.4): the spend as typed and tested, the careful amount at the start
  // paying in as now (the "spend less" lever) with the later steps in proportion, and each year's figures
  const shaped = household.shape ? shapeOfAnswer({ household, plan, at: careNow.monthly, asTyped: spendMonth, H0: H,
    yearly: phasePots ? phasesAt(sp, H, phasePots, { yearly: true }) : phasesAt(sp, H, null, { yearly: true }) }) : null;
  if (shaped) markShapeMoves(phases, shaped.byYear);

  // ---- the saving years, per person (couples apart: each to their own stop) ----------------------------------------------
  const saving = whos.map((who, p) => {
    const pension = Array.from(sp.pots[p].pension);
    const savingsAt = Array.from(sp.pots[p].savings);
    const mine = own[who];
    return {
      who, stopAge: inp[who].age + mine, yearsSaving: mine,
      potToday: { pension: inp[who].pot || 0, savings: household.people[p].pots.isa || 0 },
      payIn: { total: payIns[p].total, own: payIns[p].own, employer: payIns[p].employer, savings: plan.apart ? sp.saving.people[p].payIn.savings : savingsInNow / whos.length },
      potAtStop: { pension: spread(pension), savings: spread(savingsAt), total: spread(pension.map((v, i) => v + savingsAt[i])) },
      paidIn: { total: round2(payIns[p].total * 12 * mine) },
      mix: { saving: inp.savingRisk, drawing: inp.risk, slideYears: inp.savingRisk === inp.risk ? 0 : SAVING.slideYears },
      chargeAYear: inp.charge / 100                    // the one charge as a share a year (0.05% → 0.0005: no rounding to tenths)
    };
  });
  // the pension there is today against the number (couples apart: the pensions of those still saving)
  const potTodayTotal = whos.reduce((s, w, j) => s + (only && !only[j] ? 0 : (inp[w].pot || 0)), 0);
  const already = number !== null && potTodayTotal >= number.careful;
  // couples apart at the stop asked about: each person's own stop, the pay line, and — in a bad case (the worst 1 in 10),
  // paying in as now — the age from which the pay of the one still working covers all of what is spent (the pensions
  // covering it from the check year on, too: before it, the pay may be what makes up the stopped person's part)
  const cover = plan.apart && plan.apart.coversGap ? coverAt(sp, runner, H) : null;
  const apart = apartOf(plan, inp, own, cover);
  const firstOwn = Math.min(...whos.map((w) => own[w]));

  const result = {
    status, inputs: inp, whose: plan.whose,
    ...(partnerAsked ? { askedAbout: 'partner' } : {}),
    ...(apart ? { apart } : {}),
    spend: { perMonth: spendMonth, perYear: spendMonth * 12, kind: inp.spend.kind, level: inp.spend.kind === 'level' ? inp.spend.level : null },
    ...(shaped || {}),
    stop: { age: stopAge, year: String(Number(env.today.slice(0, 4)) + S) },
    ages: Object.fromEntries(whos.map((w) => [w, inp[w].age + own[w]])),
    years: { saving: S, drawing: D },
    pensionOpens, gapYears,
    saving,
    number,
    already,
    chance: { lasted, outOfTen: outOfTen(lasted), fails },
    onCourse,
    payIn: { now, own: everySplit ? payIns.reduce((s, p) => s + p.own, 0) : null, employer: everySplit ? payIns.reduce((s, p) => s + p.employer, 0) : null,
      needed, extra: needed === null ? 0 : Math.max(0, needed - now), confidence, at, outside: payInOutside, savingsNow: savingsInNow },
    potAtStop: { now: potNow, needed: potNeededSpread },
    short, monthlyIfShort,
    wholeLife: { lasted, outOfTen: outOfTen(lasted), runOutAge: wholeRunOutAge },
    outside,
    levers,
    grid: gridOut,
    phases,
    guaranteed: { monthlyAfterTax: round2(plan.guaranteedAYear / 12) },
    handOver: { c: handOverToC(inp, stopAge, env.today) },
    assumed: [], warnings: [], sentences: {},
    basis: {
      today: env.today, futures: n, seed: env.seed ?? 0, failuresAllowed: Math.floor(n / 10), closeAllowed: Math.floor(n / 4),
      historyEnd: historyEnd(), engineVersion: VERSION, endAge: plan.endAge, detail, lifeYears: firstOwn + D,
      bondDraws: 'life', cashRule: 'previous-year', grid: 'yearly', strategyId: 'pots-and-valves', cutsSwitchedOff: true,
      split: plan.people.map((p) => ({ who: p.who, share: Math.round(p.share * 1e6) / 1e6 })),   // reported to 6 places: the last binary digit differs between engines
      potStep: SAVING.potStep, potMax: SAVING.potMax, payInCeiling: ceiling, laterYears: SAVING.laterYears,
      laterTo: stopLaterSearched, closedYearsFails: CLOSED_YEARS_FAILS
    },
    units: UNITS
  };

  // ---- the facts the words need ---------------------------------------------------------------------------------------
  const used = defaultedFields(inp, env);
  const perPersonNeeded = (p) => (needed === null ? 0 : needed * shares[p]);
  const over = (limit, who) => {
    const idx = whos.map((w, p) => p).filter((p) => !who || who(p));
    if (idx.some((p) => payIns[p].total * 12 > limit)) return 'now';
    if (idx.some((p) => perPersonNeeded(p) * 12 > limit + 1e-6)) return 'needed';
    return null;
  };
  const pensions = plan.people.map((p) => p.pension);
  const totalPension = pensions.reduce((s, v) => s + v, 0);
  // the money at the stop, middling: how much of it is savings (the fixed-growth caveat)
  const midPension = sp.middling.reduce((s, q) => s + q.pension, 0);
  const midSavings = sp.middling.reduce((s, q) => s + q.isa, 0);
  // (couples apart: the first stretch once you have both stopped — before it, the one still working takes nothing)
  const bothStopped = plan.apart ? plan.periods.find((per) => per.from >= plan.apart.years) || plan.periods[0] : plan.periods[0];
  // who moves money into drawdown before 6 April 2028 at 55 or 56 (shared/apart.js: everyone it applies to — owner, 2 Oct 2026)
  const drawdown2028 = before2028(plan.people.map((q) => ({ who: q.who, age: inp[q.who].age, S: own[q.who], pension: q.pension > 0 })), env.today);
  const facts = {
    couple,
    people: whos.map((who, p) => {
      const person = plan.people.find((x) => x.who === who);
      const fs = person.finalSalary.filter((f) => f.amount > 0);
      // each at their own stop (couples apart; one stop for both: the stop)
      const atStop = person.ageToday + own[who];
      const open = firstOpenAge(person.ageToday, env.today, own[who]);
      const holder = sp.split[p] > 0 || (plan.apart && sp.middling[p].pension > 0);
      const lock = holder && open > atStop ? { untilAge: open } : null;
      return {
        who, sp: person.statePension.amount > 0, spAge: person.statePension.startAge, spDefault: (inp[who].statePension || {}).kind === 'full',
        spPaidAtStop: person.statePension.amount > 0 && person.statePension.startAge <= atStop,
        fs: fs.length > 0, fsAge: fs.length ? fs[0].startAge : null,
        fsDefault: used.includes(who + '.finalSalary.has'), potDefault: used.includes(who + '.pot'),
        closedUntil: lock ? lock.untilAge : null,
        S: own[who], saves: savers[p], payIn: payIns[p].total, taxFreeTaken: inp[who].taxFreeTaken === true, pension: plan.people[p].pension > 0
      };
    }),
    usedDefault: used,
    fullStatePensionAYear,
    anyPension: totalPension > 0 || (number !== null && number.careful > 0),
    anySavings: (inp.savings || 0) > 0 || savingsInNow > 0,
    savingsMostly: midSavings > midPension,
    madeUpFutures: typeof env.futureReturns === 'function',
    historyStartYear: historyStartYear(),
    capped: inp.endAge - plan.startAge > RULES.maxYears,
    oneName: couple && totalPension > 0 && plan.people.some((p, i) => p.pension / totalPension > ONE_NAME_SHARE && bothStopped.byPerson[1 - i].gross < BANDS.pa),
    accessRises: whos.some((w) => accessRiseAffects(inp[w].age, env.today, inp[w].age + own[w])),
    // a partner past their State Pension age, their stop not given: most likely stopped already (said so)
    partnerRetired: couple && S > 0 && plan.people[1].statePension.startAge <= inp.partner.age && !inp.partner.stop,
    asked: partnerAsked ? 'partner' : 'you',
    // couples apart (shared/apart.js): who pays in, a pension paid to the one still working, money into drawdown before
    // 6 April 2028
    apart: !apart ? null : {
      workerPaysIn: payIns[whos.indexOf(apart.first === 'you' ? 'partner' : 'you')].total > 0,
      keepsPensions: payKeepsPensions(plan),
      drawdown: drawdown2028
    },
    drawdown2028,
    haveLasted: already && status === 'ok' ? base.count(H, 0, savingsInNow).lasted : null,
    leastNow: onCourse && status === 'ok' ? at.nineInTen : null,
    gridRow: gridOut ? gridOut.ages.findIndex((r) => r.age === stopAge) : null,
    overAllowance: over(RULES.annualAllowance),
    overMpaa: over(RULES.moneyPurchaseAllowance, (p) => Boolean(inp[whos[p]].alreadyDrawing)),
    // (couples apart: what goes into savings each month is split among those still saving)
    overIsa: savingsInNow / (plan.apart ? saverCount : whos.length) * 12 > RULES.isaAllowance,
    largePot: potNow.good > RULES.largePot || (number !== null && number.careful > RULES.largePot),
    laterTo: stopLaterSearched
  };
  if (facts.gridRow === -1) facts.gridRow = null;
  result.sentences = sentencesFor(result, facts);
  result.assumed = assumedFor(result, facts);
  result.warnings = warningsFor(result, facts);
  finishTexts(result);

  if (env.trace) {
    // (couples apart: the pensions of those still saving — the number's)
    const pens = pensionsAt(sp, base.payInsAt(now), only);
    const order = Array.from(pens.keys()).sort((a, b) => pens[a] - pens[b] || a - b);
    const careful = order[bandIndexes(n).careful];
    const K = sp.kernels.map((k) => k.pension);
    const counts = (j) => !only || only[j];
    result.trace = {
      lives: lives.map((life, i) => ({
        id: life.id ?? i, pension: pens[i], savings: sp.pots.reduce((s, q) => s + q.savings[i], 0),
        zero: K.reduce((s, k, j) => s + (counts(j) ? k.A[i] : 0), 0), perPound: K.reduce((s, k, j) => s + shares[j] * k.B[i], 0), runOutMonth: whole.runOutMonths[i] ?? null
      })),
      saving: { atCareful: { futureId: lives[careful].id ?? careful, rows: sp.saving.people.flatMap((person) => savingRows(sp.saving, person, lives[careful])) } }
    };
  }
  return JSON.parse(JSON.stringify(result, (key, v) => (typeof v === 'number' ? noNegZero(v) : v)));
}
