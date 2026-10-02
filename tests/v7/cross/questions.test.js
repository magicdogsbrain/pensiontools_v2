/**
 * Between the questions (step 4 brief 2.5 #50, 6 P6; test plan 6.3, 6.4). Four checks that tie A, B and C together:
 *
 *  X1  A at "stop now" is question C. For a household whose pension is open today, A with `stop.age = you.age` and
 *      C with `start.kind: 'now'` work on the same futures (C's are prefixes of A's lives), the same engine and the
 *      same band search, so the shown row's band, its phases and the guaranteed income equal C's byte for byte; and
 *      with `take := spend`, C's `take` equals the row's `{ lasted, runOutAge }`. Precondition (M-A1: "a household whose pension
 *      is open today"): C did not move the start, and nobody's pension is closed today. A closed pension makes C start
 *      later, or (a younger partner's) is run by C's own rule while A locks it inside its holder's run (brief
 *      conflict 1) — a different question either way: counted, and together under a third of the sample.
 *  X2  B's number round-trips. In a made-up flat market (one future, 0% on everything, prices flat, the pots in
 *      cash) every life is the same at every stop, so the number means one thing exactly: the least whole £1,000
 *      pension pot at the stop age from which the spending lasts. At or after the age a pension opens, C with that
 *      pot (from the stop age, now) gives a careful amount of at least the spending, and £1,000 less falls short.
 *      Below it, the same through A's stop-at join (the pension closed for its first months, the savings paying):
 *      the pot typed with nothing paid in and no charge is the pot at the stop, and it lasts; £1,000 less does not.
 *  X3  B's whole-life count is A's row at the stop age: "paying in as now, then spending the target" is one run
 *      per life on each life's own pots in both, so `wholeLife.{lasted, runOutAge}` equals A's shown row, exactly.
 *  X4  A's shown row is its row: `shown` deep-equals the `ages[]` entry for its age, the headline reads from it,
 *      and the rows the chart and the full table share are the same rows (one function, one set of lives).
 *
 * While P0's stub answers stand in for A and B (their figures do not follow the inputs), the checks that need a
 * real answer are skipped WITH THE REASON in their names, and X4 runs on the stub's own inputs only. Nothing to
 * switch on: the moment P2's answerA and P3's answerB replace the stubs, everything runs.
 *
 * Every push: fixed seeds and small counts (40 futures; A narrowed to the rows it needs with `env.ages`).
 * Nightly (NIGHTLY=1): a fresh seed and more runs, capped so the night's budget holds (test plan 13.3, 14.2).
 */
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { answerA, SCHEMA_A, TEST_ENV as ENV_A } from '../a/_a.js';
import { answerB, SCHEMA_B } from '../b/_b.js';
import { answerC, SCHEMA_C } from '../c/_c.js';
import { arbitraryInputs } from '../gen/arbitrary.mjs';
import { firstAccessAge } from '../../../src/answers/shared/rules.js';
import { checkInputs } from '../../../src/answers/shared/validate.js';
import { toHousehold as toHouseholdC } from '../../../src/answers/c/toHousehold.js';
import { enginePlan, configsAt } from '../../../src/answers/shared/toEngine.js';
import { futuresList } from '../../../src/answers/shared/futures.js';
import { runFuture, STEP } from '../../../src/answers/shared/band.js';

const NIGHTLY = !!process.env.NIGHTLY;
const SEED = NIGHTLY ? undefined : 20261001;
const runs = (push, night) => (NIGHTLY ? Math.min(night, Number(process.env.FC_RUNS || night)) : push);
const opts = (n) => ({ seed: SEED, numRuns: n, verbose: 1 });

const TODAY = ENV_A.today;
const ENV = { today: TODAY, futures: 40, seed: 0, trace: false };
const A_ENV = (age, more = {}) => ({ ...ENV, detail: 'chart', ages: [age], ...more });
const B_ENV = { ...ENV, detail: 'answer' };
const MONTH = TODAY.slice(0, 7);
const SPEND_MAX = SCHEMA_A.fields.find((f) => f.path === 'spend.amount').max;
const copy = (v) => JSON.parse(JSON.stringify(v));

// ---- is the answer real yet? ---------------------------------------------------------------------------------
// Read from behaviour, not from a file: the stub's figures do not follow the inputs, a real answer's do.

function probeA(pot) {
  return answerA({ you: { age: 50, pot }, stop: { kind: 'age', age: 60 }, spend: { kind: 'amount', amount: 2000 } }, A_ENV(60));
}
function probeB(pot) {
  return answerB({ you: { age: 50, pot, payIn: { kind: 'total', total: 500 } }, stop: { age: 60 }, spend: { kind: 'amount', amount: 2000 } }, B_ENV);
}
const A_STUB = JSON.stringify(probeA(10_000).shown) === JSON.stringify(probeA(2_000_000).shown);
const B_STUB = JSON.stringify(probeB(10_000).potAtStop) === JSON.stringify(probeB(2_000_000).potAtStop);
const WAIT_A = ' — skipped: waits for P2\'s real answerA (src/answers/a/answer.js is still P0\'s stub, whose figures do not follow the inputs)';
const WAIT_B = ' — skipped: waits for P3\'s real answerB (src/answers/b/answer.js is still P0\'s stub, whose figures do not follow the inputs)';
const waiting = (...w) => w.filter(Boolean).join(';');

// ---- mapping one question's inputs onto another's -----------------------------------------------------------

const PERSON = ['age', 'pot', 'statePension', 'finalSalary'];
const personOf = (p) => Object.fromEntries(PERSON.filter((k) => p && p[k] !== undefined).map((k) => [k, copy(p[k])]));

/** C's household (start now, no take) as A's inputs stopping today, spending `spend`, paying in `payIn` (it stops today). */
function aAtStopNow(c, spend, { payIn = 0, partnerPayIn = 0, savingRisk = 'balanced', charge = 0.5 } = {}) {
  const a = {
    household: c.household,
    you: { ...personOf(c.you), payIn: { kind: 'total', total: payIn } },
    savings: c.savings || 0,
    stop: { kind: 'age', age: c.you.age },
    spend: { kind: 'amount', amount: spend },
    partTime: { has: false },
    savingRisk, risk: c.risk, charge, endAge: c.endAge
  };
  if (c.household === 'couple') {
    a.partner = { ...personOf(c.partner), payIn: { kind: 'total', total: partnerPayIn } };
    // a partner who "already has" stopped, with you from now, is the same year (couples-different-years.md 9.1 I3)
    if (c.partner.stop && c.partner.stop.kind === 'already') {
      a.partner.stop = { kind: 'already' };
      if (c.partner.taxFreeTaken !== undefined) a.partner.taxFreeTaken = c.partner.taxFreeTaken;
    }
  }
  return a;
}

/** B's checked inputs as A's, stopping at the same age (B has no part-time and no choice of ages; A no confidence). */
function aFromB(b) {
  const { confidence, stop, ...rest } = copy(b);
  return { ...rest, stop: stop.kind === 'already' ? { kind: 'already' } : { kind: 'age', age: stop.age }, partTime: { has: false } };
}

/**
 * A's phase read as C's: every field C's phase has, at the same place, from A's (brief 4.7: A's Phase is C's with
 * fields added). Whatever A adds — the brief's `fromWork`, `pensionOpen`, `shown.fromWork`, and any further
 * part-time detail — is returned separately, so the caller can require it to be neutral at "stop now".
 */
function asCPhase(aPhase, cPhase) {
  const extras = [];
  const pick = (a, c, path) => {
    if (c === null || typeof c !== 'object' || a === null || typeof a !== 'object') return a;
    const out = Array.isArray(c) ? [] : {};
    for (const k of Object.keys(c)) out[k] = pick(a[k], c[k], `${path}.${k}`);
    if (!Array.isArray(c)) for (const k of Object.keys(a)) if (!(k in c)) extras.push({ path: `${path}.${k}`, value: a[k] });
    return out;
  };
  return { phase: pick(aPhase, cPhase, 'phase'), extras };
}
/** An added field is neutral at "stop now" when nothing is earned: 0 (or true), or made of those. */
const neutral = (v) => v === 0 || v === true || (v && typeof v === 'object' && Object.values(v).every(neutral));

// ---- X1 ------------------------------------------------------------------------------------------------------

/** The stop-now cases named by hand: the boundaries a planted fault would show at first. */
const X1_FIXED = [
  { name: 'single 60, £250,000', c: { you: { age: 60, pot: 250000 } } },
  { name: 'single 58, £250,000, savings £40,000, paying in £600 (it stops today)', c: { you: { age: 58, pot: 250000 }, savings: 40000 }, payIn: 600 },
  { name: 'single 57, cautious, to 100', c: { you: { age: 57, pot: 180000 }, risk: 'cautious', endAge: 100 } },
  { name: 'single 67 (State Pension age), a final-salary pension, adventurous', c: { you: { age: 67, pot: 300000, finalSalary: { has: true, yearly: 9000, fromAge: 65 } }, risk: 'adventurous' } },
  { name: 'single 62, no State Pension, saving risk adventurous (must not reach the drawing years)', c: { you: { age: 62, pot: 400000, statePension: { kind: 'none' } } }, savingRisk: 'adventurous' },
  { name: 'couple 62 and 60, £400,000 and £150,000, final salary from 65', c: { household: 'couple', you: { age: 62, pot: 400000, finalSalary: { has: true, yearly: 9000, fromAge: 65 } }, partner: { age: 60, pot: 150000 } }, payIn: 500, partnerPayIn: 300 },
  { name: 'couple 66 and 68, forecasts, savings £60,000', c: { household: 'couple', you: { age: 66, pot: 220000, statePension: { kind: 'forecast', yearly: 11000 } }, partner: { age: 68, pot: 90000, statePension: { kind: 'forecast', yearly: 9000 } }, savings: 60000 } },
  { name: 'single 70, a small pot', c: { you: { age: 70, pot: 30000 } } },
  { name: 'single 54 (pension closed until 55: C starts later — counted, not compared)', c: { you: { age: 54, pot: 250000 } } },
  { name: 'couple 60 and 50 (the partner\'s pension closed: A locks it, C keeps its rule — counted, not compared)', c: { household: 'couple', you: { age: 60, pot: 300000 }, partner: { age: 50, pot: 100000 } } },
  { name: 'single 55 (open: 55 before 6 April 2028)', c: { you: { age: 55, pot: 250000 } } }
];

/**
 * C's own generator, with ages drawn mostly where a pension is open (55–75), now and then below it: C's list puts
 * three in four ages on its boundaries, half of them under 55, where C moves the start and X1 has nothing to compare.
 */
function stopNowHouseholds() {
  const age = fc.oneof({ weight: 6, arbitrary: fc.integer({ min: 55, max: 75 }) }, { weight: 1, arbitrary: fc.integer({ min: 18, max: 54 }) });
  return fc.tuple(arbitraryInputs(SCHEMA_C, ENV), age, age).map(([c, you, partner]) => {
    const out = { ...copy(c), you: { ...c.you, age: you } };
    if (c.household === 'couple') out.partner = { ...c.partner, age: partner };
    return out;
  });
}

/**
 * Whether today's engine is shown NOT to be monotone at £10 steps for this household (C from now) near any of the three
 * amounts: some future lasts at one amount but runs out at a lower one (tests/v7/c/exceptions.md, engine behaviour 6).
 * The band search assumes "lasts at k" is monotone in k; where it is not, the amounts are the same but the count of
 * futures at an amount could differ by one between a search that started from the remembered hint (C's second call) and
 * one that did not (A's first). Since 1 Oct 2026 an earlier pass of the same size is no hint (c/answer.js, a/answer.js),
 * so C's two calls and A's start the same search and the counts agree; this stays as a guard. Only asked when the counts
 * differ: it runs the engine a few thousand times.
 */
function nonMonotoneNear(cIn, monthly, reach = 20) {
  const checked = checkInputs(SCHEMA_C, { ...copy(cIn), start: { kind: 'now' }, take: null }, ENV);
  const { household } = toHouseholdC(checked.inputs, ENV);
  const plan = enginePlan(household, ENV);
  const futures = futuresList(ENV.futures, plan.years, ENV);
  for (const m of [monthly.careful, monthly.middling, monthly.good]) {
    const k0 = Math.round(m / STEP);
    for (const f of futures) {
      let ranOutBelow = false;
      for (let k = Math.max(0, k0 - reach); k <= k0 + reach; k++) {
        if (runFuture(configsAt(plan, k * STEP * 12), f).failed) ranOutBelow = true;
        else if (ranOutBelow) return true;
      }
    }
  }
  return false;
}

/**
 * One X1 case: C twice (for the careful amount, then with take := it), A once. Returns 'compared' | 'moved' | 'skipped'
 * | 'closed' | 'non-monotone' (compared, the counts one future apart where the engine is shown not to be monotone).
 */
function x1(cRaw, extra = {}) {
  // the one charge (6.19.0) is taken while drawing in both, so C is asked at A's charge (A's default, 0.5, unless given)
  const charge = extra.charge === undefined ? 0.5 : extra.charge;
  const c0 = answerC({ ...copy(cRaw), charge, start: { kind: 'now' }, take: null }, ENV);
  if (c0.status === 'invalid') return 'skipped';
  const cIn = c0.inputs;
  // each on their own date is XA1's (tests/v7/cross/apart.test.js); the tax-free part had by you from now is asked of A
  // only with "I've already stopped", which A answers about your partner
  if (c0.apart || cIn.you.taxFreeTaken === true) return 'skipped';
  if (cIn.you.age > SCHEMA_A.fields.find((f) => f.path === 'stop.age').max) return 'skipped';
  if (c0.status === 'ok' && c0.basis.start !== MONTH) return 'moved';      // C moved the start: a different question
  // M-A1 is for a household whose pensions are open today. With one closed, A runs it locked inside its holder's run
  // and C keeps its own rule (brief conflict 1): two models, by design, so nothing to compare.
  const people = [cIn.you, cIn.household === 'couple' ? cIn.partner : null].filter(Boolean);
  if (people.some((p) => firstAccessAge(p.age, TODAY) > p.age)) return 'closed';
  const careful = c0.status === 'ok' ? c0.monthly.careful : 0;
  if (careful > SPEND_MAX) return 'skipped';                                  // more than A's spending box takes
  const spend = careful >= 1 ? careful : 1000;
  const c = answerC({ ...copy(cIn), take: spend }, ENV);
  // With no pot and no savings, "nothing paid in" is part of A's status rule (brief 4.7 step 7): pay in nothing there.
  const aIn = aAtStopNow(cIn, spend, c0.status === 'ok' ? extra : { ...extra, payIn: 0, partnerPayIn: 0 });
  const a = answerA(aIn, A_ENV(cIn.you.age));

  const where = JSON.stringify(aIn);
  expect(a.status, where).not.toBe('invalid');
  expect(a.status, where).toBe(c.status);
  expect(a.guaranteed, where).toEqual(c.guaranteed);
  if (c.status !== 'ok') return 'compared';

  // The band does not depend on `take` (C's own rule), so both C calls agree.
  expect(c.monthly, where).toEqual(c0.monthly);
  const row = a.shown;
  expect(row.age, where).toBe(cIn.you.age);
  expect(row.yearsSaving, where).toBe(0);
  expect(row.monthly, where).toEqual(c.monthly);
  expect(row.yearly, where).toEqual(c.yearly);
  // The counts at the three amounts, and with take := spend C's test of the amount is A's test of the spending: the
  // same — unless today's engine is shown not to be monotone near the amounts, and then one future apart at most.
  expect(c.take, where).toBeTruthy();
  const counts = (lasted, runOut, take) => JSON.stringify([lasted, runOut, take.lasted, take.runOutAge]);
  const nonMonotone = counts(row.lastedAt, row.runOutAgeAt, row) !== counts(c.lasted, c.runOutAge, c.take);
  if (nonMonotone) {
    expect(nonMonotoneNear(cIn, c.monthly), `${where}: the counts differ (A ${counts(row.lastedAt, row.runOutAgeAt, row)}, C ${counts(c.lasted, c.runOutAge, c.take)}), and the engine is monotone near the amounts`).toBe(true);
    for (const b of ['careful', 'middling', 'good']) expect(Math.abs(row.lastedAt[b] - c.lasted[b]) * ENV.futures, `${where} ${b}`).toBeLessThanOrEqual(1 + 1e-9);
    expect(Math.abs(row.lasted - c.take.lasted) * ENV.futures, where).toBeLessThanOrEqual(1 + 1e-9);
  } else {
    expect(row.lastedAt, where).toEqual(c.lasted);
    expect(row.runOutAgeAt, where).toEqual(c.runOutAge);
    expect(row.lasted, where).toBe(c.take.lasted);
    expect(row.runOutAge, where).toBe(c.take.runOutAge);
  }
  // The same futures and the same rules.
  for (const k of ['futures', 'seed', 'endAge', 'failuresAllowed', 'historyEnd', 'split', 'strategyId', 'cutsSwitchedOff']) {
    expect(a.basis[k], `${where} basis.${k}`).toEqual(c.basis[k]);
  }
  // The phases at the spend (= C's careful amount, where C draws its phases): C's, plus A's three fields. When C's
  // careful amount is £0 the spend cannot be it (A's box starts at £1): the phases are then at different amounts.
  expect(row.phases, where).not.toBeNull();
  if (careful < 1) return nonMonotone ? 'non-monotone' : 'compared';
  expect(row.phases.length, where).toBe(c.phases.length);
  row.phases.forEach((p, k) => {
    const { phase, extras } = asCPhase(p, c.phases[k]);
    expect(phase, `${where} phase ${k}`).toEqual(c.phases[k]);
    // The brief's three additions: nothing earned at "stop now"; a pension is open in a period exactly when C's own
    // phase has nobody's pension locked (a partner far younger than 55 is still closed, and C does not move the
    // start for that). Everything else A adds is neutral: nothing from work.
    const open = c.phases[k].byPerson.map((b) => !b.locked);
    expect(p.fromWork, where).toBe(0);
    expect(p.shown.fromWork, where).toBe(0);
    expect(p.pensionOpen, `${where} phase ${k}: pensionOpen`).toBe(open.every(Boolean));
    p.byPerson.forEach((b, j) => { if ('pensionOpen' in b) expect(b.pensionOpen, `${where} phase ${k} person ${j}`).toBe(open[j]); });
    const added = extras.filter((x) => !/\.pensionOpen$/.test(x.path));
    expect(added.filter((x) => !neutral(x.value)), `${where} phase ${k}: fields A adds`).toEqual([]);
  });
  return nonMonotone ? 'non-monotone' : 'compared';
}

describe.skipIf(A_STUB)(`X1 — A at "stop now" equals C, byte for byte${A_STUB ? WAIT_A : ''}`, () => {
  it.each(X1_FIXED.map((x) => [x.name, x]))('%s', (_n, x) => {
    const out = x1(x.c, { payIn: x.payIn || 0, partnerPayIn: x.partnerPayIn || 0, savingRisk: x.savingRisk || 'balanced' });
    const open = [x.c.you, x.c.partner].filter(Boolean).every((p) => p.age >= firstAccessAge(p.age, TODAY));
    if (open) expect(out).toBe('compared');
    else expect(['moved', 'closed']).toContain(out);
  });

  // The nightly run's counterexample (seed 2127017665, 1 Oct 2026): 71, £2,327,718, a £200,000-a-year final-salary
  // pension from 75. Future 8 runs out at £14,020 a month but lasts at £14,030 (the careful amount) and runs out again at
  // £14,040: today's engine is not monotone there, so C's second call (from the remembered hint) counted 37 of 40 where
  // A and C's first call counted 36 (tests/v7/c/exceptions.md, engine behaviour 6). With no hint from a pass of the same
  // size (1 Oct 2026) all three count alike — 'compared'.
  it('a household where today\'s engine is not monotone at £10 steps: the same amounts, the counts one future apart', () => {
    const c = { household: 'single', you: { pot: 2327718, age: 71, statePension: { kind: 'forecast', yearly: 6000 }, finalSalary: { has: true, yearly: 200000, fromAge: 75 } }, savings: 150000, risk: 'adventurous', endAge: 100 };
    expect(['compared', 'non-monotone']).toContain(x1(c, { payIn: 0, partnerPayIn: 0, savingRisk: 'cautious', charge: 0 }));
  }, 120_000);

  it('on random households (C\'s own generator, start now); a moved start is counted and stays under a third', () => {
    const tally = { compared: 0, moved: 0, closed: 0, skipped: 0, 'non-monotone': 0 };
    fc.assert(fc.property(
      stopNowHouseholds(),
      fc.constantFrom(0, 1, 600, 10_000),
      fc.constantFrom('cautious', 'balanced', 'adventurous'),
      fc.constantFrom(0, 0.5, 2),
      (cIn, payIn, savingRisk, charge) => { tally[x1(cIn, { payIn, partnerPayIn: payIn, savingRisk, charge })] += 1; }
    ), opts(runs(16, 120)));
    const n = tally.compared + tally['non-monotone'] + tally.moved + tally.closed;
    expect(n).toBeGreaterThan(0);
    expect((tally.moved + tally.closed) / n, `${JSON.stringify(tally)}: too many cases with a pension closed today — the generator is skewed`).toBeLessThan(1 / 3);
  });
});

// ---- X2 ------------------------------------------------------------------------------------------------------

/** One made-up future: 0% on everything, prices flat, every pot in cash, while saving and once stopped. */
const CASH = { equity: 0, bond: 0, cash: 1 };
const FLAT = { ...ENV, futures: 1, futureReturns: () => ({ equity: {}, inflation: {} }), mix: CASH, savingMix: CASH };

/**
 * Singles with no State Pension and no final-salary pension (a later-born person's State Pension age may differ, which
 * is right, but is not this check's business), nothing charged, spending a whole £10 so "the careful amount is at
 * least the spending" and "the spending lasts" are one statement.
 */
const X2_CASES = [
  { name: '45, stop 60, £2,000 a month', b: { you: { age: 45, pot: 120000, payIn: { kind: 'total', total: 500 } }, stop: { age: 60 }, spend: { kind: 'amount', amount: 2000 } } },
  { name: '50, stop 58, £1,500 a month, savings £30,000', b: { you: { age: 50, pot: 200000, payIn: { kind: 'total', total: 800 } }, savings: 30000, stop: { age: 58 }, spend: { kind: 'amount', amount: 1500 } } },
  { name: '40, stop 67, £3,000 a month, to 100', b: { you: { age: 40, pot: 60000, payIn: { kind: 'total', total: 1000 } }, stop: { age: 67 }, spend: { kind: 'amount', amount: 3000 }, endAge: 100 } },
  { name: '56, stop 57 (open already: 55 before 6 April 2028)', b: { you: { age: 56, pot: 300000, payIn: { kind: 'total', total: 400 } }, stop: { age: 57 }, spend: { kind: 'amount', amount: 1800 } } },
  { name: '45, stop 55 — closed until 57, savings £100,000 pay first', b: { you: { age: 45, pot: 150000, payIn: { kind: 'total', total: 700 } }, savings: 100000, stop: { age: 55 }, spend: { kind: 'amount', amount: 2200 } } },
  { name: '40, stop 52 — closed until 57, savings £250,000, to 100', b: { you: { age: 40, pot: 90000, payIn: { kind: 'total', total: 1200 } }, savings: 250000, stop: { age: 52 }, spend: { kind: 'amount', amount: 2500 } }, endAge: 100 }
].map((x) => ({ ...x, b: { ...x.b, you: { ...x.b.you, statePension: { kind: 'none' }, finalSalary: { has: false } }, charge: 0, endAge: x.b.endAge || x.endAge || 95 } }));

describe.skipIf(A_STUB || B_STUB)(`X2 — B's number round-trips (a flat market: every life the same at every stop)${waiting(B_STUB && WAIT_B, A_STUB && WAIT_A)}`, () => {
  it.each(X2_CASES.map((x) => [x.name, x]))('%s', (_n, x) => {
    const b = answerB(x.b, FLAT);
    expect(b.status, x.name).not.toBe('invalid');
    expect(b.number, x.name).not.toBeNull();
    const n = b.number.careful;
    expect(n % 1000, 'a whole £1,000').toBe(0);
    // One future: the careful, middling and good positions are the same life.
    expect(b.number.middling).toBe(n);
    expect(b.number.good).toBe(n);
    const spend = x.b.spend.amount;
    const stopAge = x.b.stop.age;
    const opens = firstAccessAge(x.b.you.age, TODAY);

    if (stopAge >= opens) {
      // Through C: the pot from the stop age, now, beside the savings the household has then (nothing grows and
      // nothing is charged while saving, and nothing more goes into savings, so they are the savings typed).
      const cAt = (pot) => answerC({ you: { age: stopAge, pot, statePension: { kind: 'none' } }, savings: x.b.savings || 0, start: { kind: 'now' }, charge: 0, endAge: x.b.endAge }, FLAT);
      const at = cAt(n);
      expect(at.basis.start, 'C did not move the start').toBe(MONTH);
      expect(at.monthly.careful, `${x.name}: C with the number`).toBeGreaterThanOrEqual(spend);
      if (n > 0) expect(cAt(n - 1000).monthly.careful, `${x.name}: C with £1,000 less`).toBeLessThan(spend);
    }

    // Through A's join (always; the only way below the access age): nothing paid in, no charge, so the pot typed is
    // the pot at the stop; the savings at the stop no lower than the part B set aside for the closed years.
    const savings = Math.max(x.b.savings || 0, b.outside ? b.outside.careful : 0);
    const aAt = (pot) => answerA({
      you: { age: x.b.you.age, pot, statePension: { kind: 'none' }, finalSalary: { has: false }, payIn: { kind: 'total', total: 0 } },
      savings, stop: { kind: 'age', age: stopAge }, spend: { kind: 'amount', amount: spend }, charge: 0, endAge: x.b.endAge
    }, { ...FLAT, detail: 'chart', ages: [stopAge] });
    const yes = aAt(n);
    expect(yes.shown.lasted, `${x.name}: A with the number at the stop`).toBe(1);
    expect(yes.shown.verdict).toBe('yes');
    if (n > 0) {
      const no = aAt(n - 1000);
      expect(no.shown.lasted, `${x.name}: A with £1,000 less`).toBe(0);
      expect(no.shown.verdict).toBe('no');
    }
  });
});

// ---- X3 ------------------------------------------------------------------------------------------------------

const X3_FIXED = [
  { name: 'single 50, stop 60, £600 in, £2,000 a month', b: { you: { age: 50, pot: 250000, payIn: { kind: 'total', total: 600 } }, stop: { age: 60 }, spend: { kind: 'amount', amount: 2000 } } },
  { name: 'single 45, stop 55 (closed until 57), savings £90,000', b: { you: { age: 45, pot: 180000, payIn: { kind: 'split', own: 500, employer: 300 } }, savings: 90000, stop: { age: 55 }, spend: { kind: 'amount', amount: 2200 } } },
  { name: 'couple 52 and 50, stop 60, moderate', b: { household: 'couple', you: { age: 52, pot: 220000, payIn: { kind: 'total', total: 700 } }, partner: { age: 50, pot: 90000, payIn: { kind: 'total', total: 300 } }, savings: 80000, stop: { age: 60 }, spend: { kind: 'level', level: 'moderate' } } },
  { name: 'single 35, stop 65, adventurous while saving', b: { you: { age: 35, pot: 40000, payIn: { kind: 'total', total: 400 } }, stop: { age: 65 }, spend: { kind: 'amount', amount: 2000 }, savingRisk: 'adventurous' } }
];

function x3(bIn) {
  const b = answerB(bIn, B_ENV);
  if (b.status === 'invalid') return false;
  const aIn = aFromB(b.inputs);
  const asked = b.stop.age;                     // the stop asked about: yours, or your partner's after "I've already stopped"
  const a = answerA(aIn, A_ENV(asked));
  const where = JSON.stringify(b.inputs);
  expect(a.status, where).not.toBe('invalid');
  if (!b.wholeLife || a.status !== 'ok') return false;
  expect(a.shown.age, where).toBe(asked);
  expect(b.wholeLife.lasted, where).toBe(a.shown.lasted);
  expect(b.wholeLife.runOutAge, where).toBe(a.shown.runOutAge);
  expect(b.wholeLife.outOfTen.words, where).toBe(a.shown.outOfTen.words);
  // The same spending, the same lives.
  expect(b.spend.perMonth, where).toBe(a.spend.perMonth);
  expect(b.basis.futures).toBe(a.basis.futures);
  expect(b.basis.seed).toBe(a.basis.seed);
  return true;
}

describe.skipIf(A_STUB || B_STUB)(`X3 — B's whole-life count equals A's row at the stop age, exactly${waiting(B_STUB && WAIT_B, A_STUB && WAIT_A)}`, () => {
  it.each(X3_FIXED.map((x) => [x.name, x]))('%s', (_n, x) => {
    expect(x3(x.b)).toBe(true);
  });

  it('on random households (B\'s input list)', () => {
    let compared = 0;
    fc.assert(fc.property(arbitraryInputs(SCHEMA_B, B_ENV), (bIn) => { if (x3(bIn)) compared += 1; }), opts(runs(8, 60)));
    expect(compared).toBeGreaterThan(0);
  });
});

// ---- X4 ------------------------------------------------------------------------------------------------------

const X4_STUB_CASE = { name: 'the stub\'s own household (50, £250,000, stop 60, £2,000 a month)', a: { you: { age: 50, pot: 250000, payIn: { kind: 'total', total: 600 } }, savings: 40000, stop: { kind: 'age', age: 60 }, spend: { kind: 'amount', amount: 2000 } } };
const X4_CASES = [
  X4_STUB_CASE,
  { name: 'single 45, stop 60, moderate', a: { you: { age: 45, pot: 120000, payIn: { kind: 'total', total: 400 } }, stop: { kind: 'age', age: 60 }, spend: { kind: 'level', level: 'moderate' } } },
  { name: 'single 53, stop 55 (closed until 57)', a: { you: { age: 53, pot: 250000, payIn: { kind: 'total', total: 400 } }, savings: 60000, stop: { kind: 'age', age: 55 }, spend: { kind: 'amount', amount: 1200 } } },
  { name: 'show me ages: single 50', a: { you: { age: 50, pot: 300000, payIn: { kind: 'total', total: 800 } }, savings: 40000, stop: { kind: 'ages' }, spend: { kind: 'amount', amount: 2000 } } },
  { name: 'show me ages, nothing works: a small pot', a: { you: { age: 55, pot: 20000 }, stop: { kind: 'ages' }, spend: { kind: 'amount', amount: 4000 } } },
  { name: 'couple 55 and 53, stop 56, part-time £12,570 for 3 years', a: { household: 'couple', you: { age: 55, pot: 420000, payIn: { kind: 'total', total: 600 } }, partner: { age: 53, pot: 180000, payIn: { kind: 'total', total: 300 } }, savings: 40000, stop: { kind: 'age', age: 56 }, spend: { kind: 'amount', amount: 3592 }, partTime: { has: true, yearly: 12570, years: 3 } } },
  { name: 'stop now at 60', a: { you: { age: 60, pot: 250000 }, stop: { kind: 'age', age: 60 }, spend: { kind: 'amount', amount: 1500 } } }
];

/** The rules of X4 on one answer. */
function x4(a, inputs) {
  const where = JSON.stringify(inputs);
  expect(a.status, where).not.toBe('invalid');
  if (!Array.isArray(a.ages) || !a.shown) return;
  const ages = a.ages.map((r) => r.age);
  expect(ages, `${where}: rows in age order, no repeats`).toEqual([...new Set(ages)].sort((x, y) => x - y));
  const row = a.ages.find((r) => r.age === a.shown.age);
  expect(row, `${where}: the shown age ${a.shown.age} is a row`).toBeTruthy();
  expect(a.shown, where).toEqual(row);
  expect(a.stop.age, where).toBe(a.shown.age);
  expect(a.headline.age, where).toBe(a.shown.age);
  for (const k of ['verdict', 'lasted', 'runOutAge']) expect(a.headline[k], `${where} headline.${k}`).toEqual(a.shown[k]);
  if (inputs.stop.kind === 'age') {
    expect(a.headline.kind, where).toBe('named');
    expect(a.shown.age, where).toBe(inputs.stop.age);
  } else {
    const firstYes = a.ages.find((r) => r.verdict === 'yes');
    expect(a.earliest.yes, where).toBe(firstYes ? firstYes.age : null);
    if (firstYes) { expect(a.headline.kind, where).toBe('earliest'); expect(a.shown.age, where).toBe(firstYes.age); }
    else { expect(a.headline.kind, where).toBe('noneWorked'); expect(a.shown.age, where).toBe(ages[ages.length - 1]); }
  }
}

const X4_RUN = A_STUB ? [X4_STUB_CASE] : X4_CASES;
describe(`X4 — A's shown row is the row of the table${A_STUB ? ' (on the stub\'s own household only; the other cases wait for P2\'s real answerA)' : ''}`, () => {
  it.each(X4_RUN.map((x) => [x.name, x]))('%s: the chart (detail "chart")', (_n, x) => {
    x4(answerA(x.a, { ...ENV, detail: 'chart' }), x.a);
  });

  it.each(X4_RUN.map((x) => [x.name, x]))('%s: the full table (detail "all") holds the same shown row and the same shared rows', (_n, x) => {
    const chart = answerA(x.a, { ...ENV, detail: 'chart' });
    const all = answerA(x.a, { ...ENV, detail: 'all' });
    x4(all, x.a);
    if (chart.status !== 'ok' || all.status !== 'ok') return;
    // "Show me ages" with no age that worked shows the last row of each set — a different age by design (75 in the
    // full table); otherwise the shown row is one row, whichever set it was worked out in.
    if (chart.headline.kind !== 'noneWorked') expect({ ...all.shown, oneMoreYear: null }).toEqual({ ...chart.shown, oneMoreYear: null });
    for (const r of chart.ages) {
      const same = all.ages.find((s) => s.age === r.age);
      if (!same) continue;
      // Only the shown row carries phases (brief 4.7), and "one more year" exists only where the next age is in the
      // set (step 6) — the full table has every age, the chart seven. Everything else in a shared row is the same row.
      expect({ ...same, phases: null, oneMoreYear: null }, `row ${r.age}`).toEqual({ ...r, phases: null, oneMoreYear: null });
      if (r.oneMoreYear && same.oneMoreYear) expect(same.oneMoreYear, `row ${r.age} one more year`).toEqual(r.oneMoreYear);
    }
  });
});

describe('the cross-question checks know what they are waiting for', () => {
  it('reads the stubs from their behaviour, and names each check that is waiting', () => {
    // A real answer's figures follow the inputs; P0's stubs do not. When both are real, nothing is skipped here.
    expect(typeof A_STUB).toBe('boolean');
    expect(typeof B_STUB).toBe('boolean');
    const skipped = [A_STUB && 'X1, X2, X3, X4 (all but the stub\'s own case)', B_STUB && 'X2, X3'].filter(Boolean);
    if (!A_STUB && !B_STUB) expect(skipped).toEqual([]);
    else expect(skipped.length).toBeGreaterThan(0);
  });
});
