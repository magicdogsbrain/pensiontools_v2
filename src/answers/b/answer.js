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
 */
import { SCHEMA_B } from './schema.js';
import { checkInputs, defaults, flatten } from '../shared/validate.js';
import { RULES, SAVING, CLOSED_YEARS_FAILS, accessRiseAffects } from '../shared/rules.js';
import { VERSION } from '../../constants.js';
import { validateHousehold, firstOpenAge } from '../shared/household.js';
import { historyEnd, historyStartYear } from '../shared/futures.js';
import { bandIndexes } from '../shared/band.js';
import { outOfTen } from '../shared/format.js';
import { ONE_NAME_SHARE, BANDS } from '../shared/toEngine.js';
import { livesList } from '../shared/lives.js';
import { savingRows } from '../shared/saving.js';
import { stopAtPlan, createStopRunner, verdictAt, bandAt, phasesAt, savingsNeeded, potNeededAt, potNeeded,
  lastsWithin, verdictAtPayIns, countsAtPayIns, leastPayIn } from '../shared/stopAt.js';
import { gridToShow, spendLevelAMonth, handOverToC } from '../shared/schemaParts.js';
import { toHousehold, payInOf } from './toHousehold.js';
import { sentencesFor, assumedFor, warningsFor, finishTexts } from './sentences.js';

const UNITS = { money: 'todays-prices', tax: 'after-tax', period: 'month', who: 'household' };
const RISKS = ['cautious', 'balanced', 'adventurous'];
const round2 = (x) => Math.round(x * 100) / 100;
const noNegZero = (x) => (Object.is(x, -0) ? 0 : x);

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

/** The household pension at the stop in each life with `payIns` (per person) going in. */
function pensionsAt(sp, payIns) {
  const n = sp.n;
  const out = new Float64Array(n);
  sp.kernels.forEach((k, j) => { for (let i = 0; i < n; i++) out[i] += k.pension.A[i] + payIns[j].pension * k.pension.B[i]; });
  return out;
}

/** The drawing years at a stop age: years of the life used, and how many drawing years there are. */
function lifeYearsAt(inputs, stopAge) {
  const S = stopAge - inputs.you.age;
  const younger = Math.min(inputs.you.age, inputs.household === 'couple' && inputs.partner ? inputs.partner.age : Infinity);
  const D = Math.min(RULES.maxYears, inputs.endAge - (younger + S));
  return { S, D, T: S + D };
}

/**
 * The years after the stop before any pension can be touched (every pension holder closed): what the savings must pay,
 * today's prices — the closed periods' need after the guaranteed income — and the age the first pension opens. null when
 * a pension is open at the stop.
 */
function outsideOf(plan, H, split, today) {
  const holders = plan.people.filter((p, j) => split[j] > 0);
  if (!holders.length) return null;
  const waits = holders.map((p) => firstOpenAge(p.ageToday, today, p.ageAtStart - p.ageToday) - p.ageAtStart);
  if (!waits.every((w) => w > 0)) return null;
  const gap = Math.min(...waits);
  const amount = plan.periods.filter((per) => per.from < gap).reduce((s, per) => s + Math.max(0, H - per.netTotal) * (Math.min(per.to, gap) - per.from), 0);
  return { amount: Math.round(amount), untilAge: plan.startAge + gap, gap };
}

/**
 * One stop age as B reads it, built lazily and kept for the answer (the levers and the grid ask about the same ages):
 * the stop plan on the shared lives, today's runner, the closed years' floor and the guide number at a spend, and the
 * one test at any pay-in.
 */
function createAges(inputs, env, lives, ctx) {
  const n = lives.length;
  const cache = new Map();
  return function at(stopAge, savingRisk = inputs.savingRisk) {
    const key = `${stopAge}:${savingRisk}`;
    if (cache.has(key)) return cache.get(key);
    const { D } = lifeYearsAt(inputs, stopAge);
    let row = null;
    if (D >= 1 && stopAge > inputs.you.age && stopAge <= RULES.stopAgeMax) {
      const { household } = toHousehold({ ...inputs, savingRisk, stop: { age: stopAge } }, env);
      const sp = stopAtPlan(household, stopAge, env, lives);
      const runner = createStopRunner(sp);
      row = { stopAge, sp, runner, household, numbers: new Map(), floors: new Map(), whole: null, band: null };
      // what goes in a month, per person: into the pension at a household total `c` (split as now), into savings at a
      // household total `d` (split evenly, as savings are); today's figures are the stop plan's own
      row.payInsAt = (c, d = ctx.savingsInNow) => sp.saving.people.map((p, j) => ({
        pension: c === ctx.now ? p.payIn.total : c * ctx.shares[j],
        savings: d === ctx.savingsInNow ? p.payIn.savings : d / sp.saving.people.length
      }));
      // the closed years at a spend: what they draw, and the savings at the stop that carry them in every future tried
      row.outsideAt = (H) => {
        if (!row.floors.has(H)) {
          const o = outsideOf(sp.plan, H, sp.split, env.today);
          if (o) o.careful = savingsNeeded(sp, H, CLOSED_YEARS_FAILS, o.amount);
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
        if (!row.numbers.has(k)) row.numbers.set(k, potNeeded(sp, runner, H, allowed, { ...row.optsAt(H), ...(Number.isFinite(guess) ? { guess, guessSpread } : {}) }));
        return row.numbers.get(k);
      };
      // the household pension at the stop in a bad case (the worst 1 in 10) at today's pay-ins: a guess for the number
      row.carefulPot = () => spread(pensionsAt(sp, row.payInsAt(ctx.now))).careful;
      // the one test at pay-ins (c into the pension, d into savings, household totals)
      row.lasts = (H, c, d, allowed) => lastsWithin(sp, H, row.payInsAt(c, d), allowed);
      row.count = (H, c, d) => verdictAtPayIns(sp, H, row.payInsAt(c, d));
      row.wholeNow = (H) => (row.whole && row.whole.H === H ? row.whole.v : (row.whole = { H, v: verdictAt(sp, runner, H) }).v);
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
    sp.kernels.forEach((k, j) => { A += k.pension.A[i]; B += ctx.shares[j] * k.pension.B[i]; });
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
    const okSavings = (d) => lastsWithin(row.sp, H, row.payInsAt(ctx.now, d), CLOSED_YEARS_FAILS, { pensionAt: SAVING.potMax });
    // a bracket: what reaches the closed years' draw in every life, and what reaches the savings set aside for them
    const sp = row.sp;
    const reachAll = (target) => {
      let most = 0;
      for (let i = 0; i < sp.n; i++) {
        let A = 0, B = 0;
        sp.kernels.forEach((k) => { A += k.savings.A[i]; B += k.savings.B[i] / ctx.people; });
        const need = target <= A ? 0 : B > 0 ? (target - A) / B : Infinity;
        if (need > most) most = need;
      }
      return most;
    };
    const guess = { lo: reachAll(o.amount), hi: reachAll(o.careful ?? o.amount) };
    outsideIn = leastPayIn(okSavings, SAVING.payInCeiling * ctx.people, ctx.savingsInNow, guess);
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

  const { household, fullStatePensionAYear, S } = toHousehold(inp, env);
  const hp = validateHousehold(household, env.today);
  if (hp.length) return { status: 'invalid', problems: hp.map((p) => ({ field: p.field, messageId: p.problem })) };

  const n = env.futures;
  const detail = env.detail === 'grid' ? 'grid' : 'answer';
  const allowed = { careful: Math.floor(n / 10), middling: Math.floor(n / 2), good: n - Math.ceil(n / 10) };
  const couple = inp.household === 'couple' && Boolean(inp.partner);
  const whos = couple ? ['you', 'partner'] : ['you'];
  // the most that can go in a month: each person's box holds up to SAVING.payInCeiling (brief 28)
  const ceiling = SAVING.payInCeiling * whos.length;
  const payIns = whos.map((w) => payInOf(inp[w]));
  const now = payIns.reduce((s, p) => s + p.total, 0);
  const shares = payIns.map((p) => (now > 0 ? p.total / now : 1 / whos.length));
  const savingsInNow = inp.savingsIn || 0;
  const spendMonth = inp.spend.kind === 'level' ? spendLevelAMonth(inp.household, inp.spend.level) : inp.spend.amount;
  const H = spendMonth * 12;
  const stopAge = inp.stop.age;
  const { D } = lifeYearsAt(inp, stopAge);
  // the most the household can pay in, split as now: no one's part above their box's £10,000 (a couple paying in
  // evenly: £20,000; with everything going into one name: £10,000)
  const solveCeiling = Math.floor(SAVING.payInCeiling / Math.max(...shares) / 10 + 1e-9) * 10;
  const ctx = { now, shares, savingsInNow, ceiling: solveCeiling, people: whos.length, allowed, allowedClose: Math.floor(n / 4) };

  // The lives: long enough for the stop and every later age the stop-later lever and the grid may try (to 75).
  const later = [];
  for (let a = stopAge + 1; a <= RULES.stopAgeMax; a++) if (lifeYearsAt(inp, a).D >= 1) later.push(a);
  const T = Math.max(...[stopAge, ...later].map((a) => lifeYearsAt(inp, a)).filter((x) => x.D >= 1).map((x) => x.T));
  const lives = livesList(n, T, env);
  const ages = createAges(inp, env, lives, ctx);
  const base = ages(stopAge);
  const { sp, runner } = base;
  const plan = sp.plan;
  const pensionOpens = Object.fromEntries(whos.map((w) => [w, firstOpenAge(inp[w].age, env.today)]));

  // ---- the guide number: the least whole £1,000 of household pension at the stop that pays the spend ------------------
  const guaranteedCovers = plan.periods.every((per) => per.netTotal >= H - 1e-9);
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
  const everySplit = payIns.every((p) => p.own !== null);
  const potNow = spread(pensionsAt(sp, base.payInsAt(now)));
  const potNeededSpread = needed === null ? null : spread(pensionsAt(sp, base.payInsAt(needed, solved.savingsIn)));
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
      if (!lastsWithin(row.sp, H, row.payInsAt(now), allowed.careful)) continue;
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
        const counts = row ? countsAtPayIns(row.sp, H, g.payIns.map((p) => row.payInsAt(p, savingsInNow))) : null;
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
  const phases = phasePot > 0 || outside
    ? phasesAt(sp, H, sp.split.map((w, j) => ({ pension: phasePot * w, isa: Math.max(sp.middling[j].isa, outside ? outside.amount * w : 0) })))
    : phasesAt(sp, H);

  // ---- the saving years, per person -----------------------------------------------------------------------------------
  const saving = whos.map((who, p) => {
    const pension = Array.from(sp.pots[p].pension);
    const savingsAt = Array.from(sp.pots[p].savings);
    return {
      who, stopAge: inp[who].age + S, yearsSaving: S,
      potToday: { pension: inp[who].pot || 0, savings: household.people[p].pots.isa || 0 },
      payIn: { total: payIns[p].total, own: payIns[p].own, employer: payIns[p].employer, savings: savingsInNow / whos.length },
      potAtStop: { pension: spread(pension), savings: spread(savingsAt), total: spread(pension.map((v, i) => v + savingsAt[i])) },
      paidIn: { total: round2(payIns[p].total * 12 * S) },
      mix: { saving: inp.savingRisk, drawing: inp.risk, slideYears: inp.savingRisk === inp.risk ? 0 : SAVING.slideYears },
      chargeAYear: inp.charge / 100                    // the one charge as a share a year (0.05% → 0.0005: no rounding to tenths)
    };
  });
  const potTodayTotal = whos.reduce((s, w) => s + (inp[w].pot || 0), 0);
  const already = number !== null && potTodayTotal >= number.careful;

  const result = {
    status, inputs: inp, whose: plan.whose,
    spend: { perMonth: spendMonth, perYear: spendMonth * 12, kind: inp.spend.kind, level: inp.spend.kind === 'level' ? inp.spend.level : null },
    stop: { age: stopAge, year: String(Number(env.today.slice(0, 4)) + S) },
    ages: Object.fromEntries(whos.map((w) => [w, inp[w].age + S])),
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
      historyEnd: historyEnd(), engineVersion: VERSION, endAge: plan.endAge, detail, lifeYears: S + D,
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
  const facts = {
    couple,
    people: whos.map((who, p) => {
      const person = plan.people.find((x) => x.who === who);
      const fs = person.finalSalary.filter((f) => f.amount > 0);
      const open = firstOpenAge(person.ageToday, env.today, person.ageAtStart - person.ageToday);
      const lock = sp.split[p] > 0 && open > person.ageAtStart ? { untilAge: open } : null;
      return {
        who, sp: person.statePension.amount > 0, spAge: person.statePension.startAge, spDefault: (inp[who].statePension || {}).kind === 'full',
        spPaidAtStop: person.statePension.amount > 0 && person.statePension.startAge <= person.ageAtStart,
        fs: fs.length > 0, fsAge: fs.length ? fs[0].startAge : null,
        fsDefault: used.includes(who + '.finalSalary.has'), potDefault: used.includes(who + '.pot'),
        closedUntil: lock ? lock.untilAge : null
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
    oneName: couple && totalPension > 0 && plan.people.some((p, i) => p.pension / totalPension > ONE_NAME_SHARE && plan.periods[0].byPerson[1 - i].gross < BANDS.pa),
    accessRises: whos.some((w) => accessRiseAffects(inp[w].age, env.today, inp[w].age + S)),
    // a partner past their State Pension age: most likely stopped already (B stops both in the same year — said so)
    partnerRetired: couple && S > 0 && plan.people[1].statePension.startAge <= inp.partner.age,
    haveLasted: already && status === 'ok' ? base.count(H, 0, savingsInNow).lasted : null,
    leastNow: onCourse && status === 'ok' ? at.nineInTen : null,
    gridRow: gridOut ? gridOut.ages.findIndex((r) => r.age === stopAge) : null,
    overAllowance: over(RULES.annualAllowance),
    overMpaa: over(RULES.moneyPurchaseAllowance, (p) => Boolean(inp[whos[p]].alreadyDrawing)),
    overIsa: savingsInNow / whos.length * 12 > RULES.isaAllowance,
    largePot: potNow.good > RULES.largePot || (number !== null && number.careful > RULES.largePot),
    laterTo: stopLaterSearched
  };
  if (facts.gridRow === -1) facts.gridRow = null;
  result.sentences = sentencesFor(result, facts);
  result.assumed = assumedFor(result, facts);
  result.warnings = warningsFor(result, facts);
  finishTexts(result);

  if (env.trace) {
    const pens = pensionsAt(sp, base.payInsAt(now));
    const order = Array.from(pens.keys()).sort((a, b) => pens[a] - pens[b] || a - b);
    const careful = order[bandIndexes(n).careful];
    const K = sp.kernels.map((k) => k.pension);
    result.trace = {
      lives: lives.map((life, i) => ({
        id: life.id ?? i, pension: pens[i], savings: sp.pots.reduce((s, q) => s + q.savings[i], 0),
        zero: K.reduce((s, k) => s + k.A[i], 0), perPound: K.reduce((s, k, j) => s + shares[j] * k.B[i], 0), runOutMonth: whole.runOutMonths[i] ?? null
      })),
      saving: { atCareful: { futureId: lives[careful].id ?? careful, rows: sp.saving.people.flatMap((person) => savingRows(sp.saving, person, lives[careful])) } }
    };
  }
  return JSON.parse(JSON.stringify(result, (key, v) => (typeof v === 'number' ? noNegZero(v) : v)));
}
