/**
 * Couples who stop work in different years: C, A and B are still three slices of one test, and agree to the pound
 * (research/v7/couples-different-years.md 9.3 P2–P4 and 9.4 X1–X3, on staggered stops; the one-test relations of
 * tests/v7/cross/oneTest.test.js carried over).
 *
 *   XA1  C at your start, with your partner at their own stop (or already stopped), is A's row at that stop: the same band
 *        to the pound, the same counts; A at C's careful amount is a yes, and £10 more is not — except where a future
 *        is shown not to be monotone in the spend (notMonotoneNear: the hand-over at the second stop), printed as a
 *        finding for the engine.
 *   XA2  B's whole-life count at today's pay-ins is A's row at the same stops, exactly; B is on course exactly when A
 *        says yes.
 *   XA3  B's pay-in that gets there, fed back into A (one person still saving), makes the money last: A says yes.
 *   XA4  B's "stop later" is the first later stop of the person still working at which A says yes.
 *   P2   either of you can be "you": C "you from now, your partner at 56" is "you at 56, your partner already stopped";
 *        A's and B's "I've already stopped" with the partner at 56 is the partner already stopped with you at 56.
 *   P3   "None of it" ≤ "Half" ≤ "All of it": the careful amount, to one step (£10).
 *   P4   zero years apart by any route is today's answer: the partner's own stop given as their age at your stop
 *        (couples-different-years.md 9.1 I2), and C from now with the partner already stopped (I3).
 *
 * The households are made up (generic shapes, never a real person's figures). Every push: fixed seeds, 40 futures.
 * Nightly (NIGHTLY=1): a fresh seed and more households.
 */
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { answerA } from '../a/_a.js';
import { answerB } from '../b/_b.js';
import { answerC } from '../c/_c.js';
import { RULES } from '../../../src/answers/shared/rules.js';
import { checkInputs } from '../../../src/answers/shared/validate.js';
import { SCHEMA_A } from '../../../src/answers/a/schema.js';
import { toHousehold } from '../../../src/answers/a/toHousehold.js';
import { stopAtPlan, createStopRunner, verdictAt } from '../../../src/answers/shared/stopAt.js';

const NIGHTLY = !!process.env.NIGHTLY;
const SEED = NIGHTLY ? undefined : 20261003;
const RUNS = NIGHTLY ? Math.min(60, Number(process.env.FC_RUNS || 30)) : 4;
const TODAY = '2026-09-30';
const ENV = { today: TODAY, futures: 40, seed: 0, trace: false };
const STEP = 10;

/**
 * One household, written once and read as each question's inputs. `stop`: your stop age, or 'already'; the partner's
 * `stop`: their own stop age, or 'already'. `payIn` per person: { own, employer } a month, or null.
 */
function asC(h) {
  const person = (p) => ({ age: p.age, pot: p.pot, ...(p.payIn ? { payIn: { has: 'yes', kind: 'split', own: p.payIn.own, employer: p.payIn.employer } } : {}) });
  return {
    household: 'couple', you: person(h.you),
    partner: { ...person(h.partner), stop: h.partner.stop === 'already' ? { kind: 'already' } : { kind: 'age', age: h.partner.stop } },
    savings: h.savings || 0, start: h.stop === 'already' ? { kind: 'now' } : { kind: 'age', age: h.stop },
    risk: h.risk || 'balanced', charge: h.charge ?? 0.5, endAge: h.endAge || 95, ...(h.payCovers ? { untilBothStop: h.payCovers } : {})
  };
}
function asSaver(h, spend, q) {
  const person = (p) => ({ age: p.age, pot: p.pot, ...(p.payIn ? { payIn: { kind: 'split', own: p.payIn.own, employer: p.payIn.employer } } : {}) });
  const out = {
    household: 'couple', you: person(h.you),
    partner: { ...person(h.partner), stop: h.partner.stop === 'already' ? { kind: 'already' } : { kind: 'age', age: h.partner.stop } },
    savings: h.savings || 0, spend: { kind: 'amount', amount: spend }, savingsIn: 0, savingRisk: h.risk || 'balanced', risk: h.risk || 'balanced',
    charge: h.charge ?? 0.5, endAge: h.endAge || 95, ...(h.payCovers ? { untilBothStop: h.payCovers } : {})
  };
  if (q === 'a') return { ...out, stop: h.stop === 'already' ? { kind: 'already' } : { kind: 'age', age: h.stop }, partTime: { has: false } };
  return { ...out, stop: h.stop === 'already' ? { kind: 'already' } : { age: h.stop }, confidence: 'nineInTen' };
}
/** The stop the answer is about: yours, or your partner's after "I've already stopped". */
const askedStop = (h) => (h.stop === 'already' ? h.partner.stop : h.stop);
const aEnv = (h, more = []) => ({ ...ENV, detail: 'chart', ages: [askedStop(h), ...more] });

/** The households named by hand: generic shapes of the case the design must answer well (couples-different-years.md). */
const NAMED = [
  { name: 'one stopped some time ago and draws now, with cash; the other mid-fifties stops next year',
    h: { you: { age: 55, pot: 260000, payIn: { own: 400, employer: 300 } }, partner: { age: 61, pot: 180000, payIn: null, stop: 'already' }, savings: 40000, stop: 56 } },
  { name: 'the same couple from the other chair: "I\'ve already stopped", the partner stops next year',
    h: { you: { age: 61, pot: 180000, payIn: null }, partner: { age: 55, pot: 260000, payIn: { own: 400, employer: 300 }, stop: 56 }, savings: 40000, stop: 'already' } },
  { name: 'both still working, two years apart, "All of it"',
    h: { you: { age: 52, pot: 220000, payIn: { own: 500, employer: 300 } }, partner: { age: 50, pot: 90000, payIn: { own: 200, employer: 150 }, stop: 57 }, savings: 30000, stop: 58, payCovers: 'all' } },
  { name: 'the partner stopped at 54, pension closed until 55, on cash; you stop at 60, "None of it"',
    h: { you: { age: 57, pot: 300000, payIn: { own: 600, employer: 400 } }, partner: { age: 54, pot: 150000, payIn: null, stop: 'already' }, savings: 60000, stop: 60, payCovers: 'none', risk: 'cautious' } },
  // the leftover at the second stop (the reviewers' finding, 2 Oct 2026): the partner has stopped with savings only, a
  // little more than the years apart use, so a few hundred pounds are left at your stop — exact now, no allowance
  { name: 'the partner stopped with savings only, just more than the years apart use; you stop at 57',
    h: { you: { age: 55, pot: 420000, payIn: { own: 100, employer: 0 } }, partner: { age: 54, pot: 0, payIn: null, stop: 'already' }, savings: 34000, stop: 57 } },
  { name: 'the same, with a little in the partner\'s pension',
    h: { you: { age: 55, pot: 420000, payIn: { own: 100, employer: 0 } }, partner: { age: 54, pot: 15000, payIn: null, stop: 'already' }, savings: 30000, stop: 57 } }
];

/** Random staggered couples: one already stopped or both at their own ages, pots, pay-ins, savings, the pay line. */
const households = fc.record({
  you: fc.integer({ min: 45, max: 64 }), dAge: fc.integer({ min: -8, max: 8 }), gap: fc.integer({ min: 1, max: 8 }), apart: fc.integer({ min: 1, max: 6 }),
  partnerFirst: fc.boolean(), already: fc.boolean(), pot: fc.constantFrom(60000, 180000, 400000), partnerPot: fc.constantFrom(0, 90000, 250000),
  payIn: fc.constantFrom({ own: 300, employer: 200 }, { own: 800, employer: 400 }), savings: fc.constantFrom(0, 40000, 120000),
  payCovers: fc.constantFrom(undefined, 'half', 'all', 'none'), risk: fc.constantFrom('cautious', 'balanced', 'adventurous'), charge: fc.constantFrom(0, 0.5, 1.5)
}).map((k) => {
  const partnerAge = Math.min(70, Math.max(40, k.you + k.dAge));
  // you stop at an age (still working); the partner has already stopped, or stops at their own age some years apart
  const stop = Math.min(RULES.stopAgeMax, k.you + k.gap);
  const partnerStop = k.already ? 'already' : Math.min(RULES.stopAgeMax, partnerAge + Math.max(1, k.gap + (k.partnerFirst ? -k.apart : k.apart)));
  const h = { you: { age: k.you, pot: k.pot, payIn: k.payIn }, partner: { age: partnerAge, pot: k.partnerPot, payIn: k.already ? null : { own: 200, employer: 100 }, stop: partnerStop },
    savings: k.savings, stop, payCovers: k.payCovers, risk: k.risk, charge: k.charge };
  // C takes a start before every pension of the household opens only with savings to live on (start-not-before-access):
  // someone stopping under 58 may find their pension closed at the stop (55 before 6 April 2028, 57 from then) — and a
  // partner already stopped under 58 has theirs closed now, where "None of it" checks (a NIGHTLY=1 run, 1 Oct 2026)
  if (stop < 58 || (partnerStop !== 'already' ? partnerStop < 58 : partnerAge < 58)) h.savings = Math.max(h.savings, 120000);
  // …and under "None of it" the money of the one who stops first must pay from their stop: a first stopper with no
  // pension pot needs savings, or C refuses the start the same way (a NIGHTLY=1 run, 2 Oct 2026: your partner 58, stopped,
  // with nothing; you 58 stopping at 59, no savings, "None of it")
  const partnerFirst = partnerStop === 'already' || partnerStop - partnerAge < stop - k.you;
  if (k.payCovers === 'none' && partnerFirst && !k.partnerPot) h.savings = Math.max(h.savings, 120000);
  return h;
}).filter((h) => h.partner.stop === 'already' || h.partner.stop - h.partner.age !== h.stop - h.you.age);

/**
 * Whether a future of A's stop plan is not monotone in the spend near `s` a month: it runs out at one whole step and
 * lasts at a higher one, within 30 steps either side. Couples apart only: at the second stop the first stopper's money
 * is handed over and the need shared by what each then has, and that hand-over moves with the spend — a little more
 * spent before it can leave the first stopper nothing (their run drops out and cannot run out first), a little less
 * leaves them a small pot whose own run can. C's band is worked out life by life (createBandSolver, which takes "lasts at
 * k" as monotone in k), so where a future is not, C's careful amount and the count of futures at it can disagree by a
 * future or two with A's verdict at that spend. NIGHTLY=1 runs, 1 Oct 2026: you 50 with £400,000 stopping at 57, your
 * partner 50, stopped, with nothing in a pension, £120,000 of savings, cautious (seed -175259451) — one future lasted at
 * £2,520 to £2,540 a month and not at £2,510 or £2,550, and A said yes at £2,540 over C's £2,530; you 60 with £400,000
 * stopping at 67, your partner 60, stopped, with £90,000, £40,000 of savings, cautious — five futures out at C's careful
 * £3,580 against the band's four, A "close". A finding for the engine (src/answers/shared/toEngine.js joinAt, stopAt.js
 * bandAt), printed here; never let through where every future is monotone.
 * 2 Oct 2026: the cause of both — a small leftover of the first stopper's money, given its own fixed share at the second
 * stop, running dry while the other's money lasted — is gone: after the second stop the other's money pays all from
 * then (the pass-on, toEngine.js passOnAt), and both households above are now monotone over their whole band. The
 * allowance stays, printed, for anything else in the engine that is not monotone at £10 (tests/v7/c/exceptions.md).
 */
function notMonotoneNear(h, s) {
  const env = { ...ENV };
  const { inputs } = checkInputs(SCHEMA_A, asSaver(h, s, 'a'), env);
  const { household } = toHousehold(inputs, env, askedStop(h));
  const sp = stopAtPlan(household, h.stop === 'already' ? h.you.age : h.stop, env);
  const runner = createStopRunner(sp);
  let ranOut = null;
  for (let x = Math.max(STEP, s - 30 * STEP); x <= s + 30 * STEP; x += STEP) {
    const months = verdictAt(sp, runner, x * 12).runOutMonths;
    if (ranOut && months.some((m, i) => m === null && ranOut[i])) return true;
    ranOut = months.map((m, i) => m !== null || Boolean(ranOut && ranOut[i]));
  }
  return false;
}
const finding = (what, where) => console.log(`XA1: ${what} — a future not monotone in the spend at the hand-over (a finding for the engine)`, where);

/** XA1–XA4 on one household. → 'compared', or 'skipped: …'. */
function oneTest(h) {
  const where = JSON.stringify(h);
  const c = answerC(asC(h), ENV);
  expect(c.status, `${where}: C ${JSON.stringify(c.problems)}`).not.toBe('invalid');
  if (c.status !== 'ok') return 'skipped: nothing to draw on';
  expect(c.apart, `${where}: C takes each at their own stop`).toBeTruthy();
  const s = c.monthly.careful;
  if (s < 1) return 'skipped: no careful amount';

  // XA1 C's careful amount is A's yes, £10 more is not; the band to the pound
  const a = answerA(asSaver(h, s, 'a'), aEnv(h));
  expect(a.status, `${where}: A ${JSON.stringify(a.problems)}`).toBe('ok');
  expect(a.apart, where).toEqual(c.apart);
  expect(a.shown.monthly, `${where}: A's band at the stop is C's`).toEqual(c.monthly);
  expect(a.shown.lastedAt, where).toEqual(c.lasted);
  expect(a.shown.runOutAgeAt, where).toEqual(c.runOutAge);
  // (only where a future is not monotone in the spend near it — notMonotoneNear — is either let through, and printed)
  if (a.shown.verdict !== 'yes') {
    expect(notMonotoneNear(h, s), `${where}: A at C's careful £${s} is ${a.shown.verdict}`).toBe(true);
    finding(`A at C's careful £${s} is ${a.shown.verdict}`, where);
  }
  if (answerA(asSaver(h, s + STEP, 'a'), aEnv(h)).shown.verdict === 'yes') {
    expect(notMonotoneNear(h, s), `${where}: A at £${s + STEP} is a yes`).toBe(true);
    finding(`A says yes at £${s + STEP} over C's careful £${s}`, where);
  }

  // XA2 B at the same stops: its whole-life count is A's row, exactly; on course at C's careful amount
  const b = answerB(asSaver(h, s, 'b'), { ...ENV, detail: 'answer' });
  expect(b.status, `${where}: B ${JSON.stringify(b.problems)}`).not.toBe('invalid');
  expect(b.wholeLife.lasted, where).toBe(a.shown.lasted);
  expect(b.wholeLife.runOutAge, where).toBe(a.shown.runOutAge);
  expect(b.onCourse, `${where}: B at C's careful £${s}`).toBe(a.shown.verdict === 'yes');

  // XA3/XA4 at a higher spend: B's "stop later" is A's first later yes; with one person still saving, B's pay-in that
  // gets there, fed into A, lasts
  const more = Math.ceil(s * 1.15 / 10) * 10 + 10;
  const bMore = answerB(asSaver(h, more, 'b'), { ...ENV, detail: 'answer' });
  if (bMore.status === 'guaranteed-only') return 'compared (the pensions cover the higher spend)';
  expect(bMore.onCourse, where).toBe(false);
  const later = [];
  for (let x = askedStop(h) + 1; x <= RULES.stopAgeMax; x++) later.push(x);
  const aMore = answerA(asSaver(h, more, 'a'), aEnv(h, later));
  const firstYes = aMore.ages.find((r) => r.age > askedStop(h) && r.verdict === 'yes');
  expect(bMore.levers.stopLater ? bMore.levers.stopLater.age : null, `${where}: stop later at £${more}`).toBe(firstYes ? firstYes.age : null);
  const savers = [h.stop === 'already' ? null : 'you', h.partner.stop === 'already' ? null : 'partner'].filter(Boolean);
  if (savers.length === 1 && bMore.payIn.needed !== null && !bMore.outside) {
    const fed = asSaver(h, more, 'a');
    fed[savers[0]] = { ...fed[savers[0]], payIn: { kind: 'total', total: bMore.payIn.needed } };
    const aFed = answerA(fed, aEnv(h));
    expect(aFed.shown.verdict, `${where}: A paying in B's £${bMore.payIn.needed}`).toBe('yes');
  }
  return 'compared';
}

describe('XA1–XA4 — couples who stop in different years: C, A and B are still one test', () => {
  it.each(NAMED.map((x) => [x.name, x]))('%s', (_n, x) => {
    expect(oneTest(x.h)).toMatch(/^compared/);
  }, 120_000);

  it('on random staggered couples', () => {
    const tally = {};
    fc.assert(fc.property(households, (h) => { const r = oneTest(h); tally[r] = (tally[r] || 0) + 1; }), { seed: SEED, numRuns: RUNS, verbose: 1 });
    expect(Object.keys(tally).some((k) => k.startsWith('compared')), JSON.stringify(tally)).toBe(true);
  }, 600_000);
});

/** What a household's answer is, whoever is "you": the figures, not the labels. */
const figuresC = (r) => ({ monthly: r.monthly, lasted: r.lasted, runOutAge: r.runOutAge, guaranteed: r.guaranteed, takeHome: r.phases.map((p) => p.takeHome), years: r.basis.years });

describe('P2 — either of you can be "you"', () => {
  it('C: "you from now, your partner at 56" is "you at 56, your partner already stopped", figure for figure', () => {
    const one = { household: 'couple', you: { age: 61, pot: 180000 }, partner: { age: 55, pot: 260000, payIn: { has: 'yes', kind: 'split', own: 400, employer: 300 }, stop: { kind: 'age', age: 56 } }, savings: 40000, start: { kind: 'now' } };
    const other = { household: 'couple', you: { age: 55, pot: 260000, payIn: { has: 'yes', kind: 'split', own: 400, employer: 300 } }, partner: { age: 61, pot: 180000, stop: { kind: 'already' } }, savings: 40000, start: { kind: 'age', age: 56 } };
    const a = answerC(one, ENV);
    const b = answerC(other, ENV);
    expect(a.status).toBe('ok');
    expect(figuresC(b)).toEqual(figuresC(a));
    expect(b.apart.first).toBe(a.apart.first === 'you' ? 'partner' : 'you');
  }, 120_000);

  /*
   * Both pensions closed today (the reviewers' finding, 2 Oct 2026): "you from now" with a partner still paying in moved
   * YOUR start to the day your pension opens (movedToAccess counted the partner's pay-in), so C treated you — who have
   * stopped — as still working, and the link from A's "I've already stopped" opened on £2,610 a month against A's £990.
   * Made-up round figures: you 52, stopped, pension closed until 57; your partner 51, paying in, stopping at 53.
   */
  const CLOSED = { you: { age: 52, pot: 440000, payIn: null }, partner: { age: 51, pot: 70000, payIn: { own: 800, employer: 500 }, stop: 53 }, savings: 50000, stop: 'already' };
  const CLOSED_OTHER = { you: { age: 51, pot: 70000, payIn: { own: 800, employer: 500 } }, partner: { age: 52, pot: 440000, payIn: null, stop: 'already' }, savings: 50000, stop: 53 };

  it('both pensions closed today: C from now with your partner at 53 is A\'s "I\'ve already stopped" row, and C from the other chair', () => {
    const c = answerC(asC(CLOSED), ENV);
    expect(c.status).toBe('ok');
    expect(c.apart.stops).toEqual({ you: { age: 52, already: true }, partner: { age: 53, already: false } });
    const a = answerA(asSaver(CLOSED, 1000, 'a'), aEnv(CLOSED));
    expect(a.askedAbout).toBe('partner');
    expect(a.handOver.c).toEqual({ ok: true, same: true });
    expect(a.shown.monthly).toEqual(c.monthly);
    expect(a.shown.lastedAt).toEqual(c.lasted);
    expect(a.shown.runOutAgeAt).toEqual(c.runOutAge);
    const o = answerC(asC(CLOSED_OTHER), ENV);
    expect(figuresC(o)).toEqual(figuresC(c));
    // B's whole-life count at the careful amount is A's row there
    const b = answerB(asSaver(CLOSED, c.monthly.careful, 'b'), { ...ENV, detail: 'answer' });
    const at = answerA(asSaver(CLOSED, c.monthly.careful, 'a'), aEnv(CLOSED));
    expect(b.wholeLife.lasted).toBe(at.shown.lasted);
  }, 120_000);

  it('on random couples where you have stopped and your partner stops at their own age (pensions closed or not): C from now is A\'s row and C from the other chair', () => {
    const youStopped = fc.record({
      you: fc.integer({ min: 48, max: 63 }), dAge: fc.integer({ min: -6, max: 6 }), wait: fc.integer({ min: 1, max: 6 }),
      pot: fc.constantFrom(90000, 300000, 520000), partnerPot: fc.constantFrom(0, 70000, 250000), payIn: fc.constantFrom({ own: 300, employer: 200 }, { own: 800, employer: 500 }),
      savings: fc.constantFrom(20000, 60000, 140000), payCovers: fc.constantFrom(undefined, 'half', 'all', 'none')
    }).map((k) => {
      const partnerAge = Math.min(68, Math.max(45, k.you + k.dAge));
      return { you: { age: k.you, pot: k.pot, payIn: null }, partner: { age: partnerAge, pot: k.partnerPot, payIn: k.payIn, stop: Math.min(RULES.stopAgeMax, partnerAge + k.wait) },
        savings: k.savings, stop: 'already', payCovers: k.payCovers };
    });
    let compared = 0;
    fc.assert(fc.property(youStopped, (h) => {
      const where = JSON.stringify(h);
      const c = answerC(asC(h), ENV);
      if (c.status !== 'ok') return;
      expect(c.apart.stops.you, where).toEqual({ age: h.you.age, already: true });
      const a = answerA(asSaver(h, Math.max(STEP, c.monthly.careful), 'a'), aEnv(h));
      expect(a.status, where).toBe('ok');
      expect(a.shown.monthly, where).toEqual(c.monthly);
      const other = { you: { ...h.partner, stop: undefined }, partner: { ...h.you, stop: 'already' }, savings: h.savings, stop: h.partner.stop, payCovers: h.payCovers };
      const o = answerC(asC(other), ENV);
      expect(o.status, where).toBe('ok');
      expect(o.monthly, where).toEqual(c.monthly);
      expect(o.lasted, where).toEqual(c.lasted);
      compared++;
    }), { seed: SEED, numRuns: RUNS + 2, verbose: 1 });
    expect(compared).toBeGreaterThan(0);
  }, 600_000);

  it('A and B: "I\'ve already stopped" with your partner at 56 is your partner already stopped with you at 56', () => {
    const [x, y] = [NAMED[1].h, NAMED[0].h];
    const ax = answerA(asSaver(x, 2400, 'a'), aEnv(x));
    const ay = answerA(asSaver(y, 2400, 'a'), aEnv(y));
    expect(ax.askedAbout).toBe('partner');
    for (const k of ['verdict', 'lasted', 'runOutAge', 'monthly', 'lastedAt', 'runOutAgeAt', 'yearsSaving']) expect(ax.shown[k], k).toEqual(ay.shown[k]);
    expect(ax.sentences.head.text).toMatch(/^.*your partner could stop at 56|^Close — your partner stopping at 56|^Your partner could not stop at 56/);
    const bx = answerB(asSaver(x, 2400, 'b'), { ...ENV, detail: 'answer' });
    const by = answerB(asSaver(y, 2400, 'b'), { ...ENV, detail: 'answer' });
    for (const k of ['number', 'chance', 'onCourse', 'wholeLife', 'short', 'monthlyIfShort']) {
      const strip = (v) => (k === 'number' && v ? { careful: v.careful, middling: v.middling, good: v.good } : v);
      expect(strip(bx[k]), k).toEqual(strip(by[k]));
    }
    expect(bx.payIn.at).toEqual(by.payIn.at);
  }, 120_000);
});

describe('P3 — "None of it" ≤ "Half" ≤ "All of it" (the careful amount, to one step)', () => {
  it.each(NAMED.map((x) => [x.name, x]))('%s', (_n, x) => {
    const at = (payCovers) => answerC(asC({ ...x.h, payCovers }), ENV).monthly.careful;
    const none = at('none'); const half = at('half'); const all = at('all');
    expect(none).toBeLessThanOrEqual(half + STEP);
    expect(half).toBeLessThanOrEqual(all + STEP);
  }, 120_000);
});

describe('P4 — zero years apart by any route is today\'s answer', () => {
  const strip = (r) => { const { inputs, ...rest } = JSON.parse(JSON.stringify(r)); void inputs; return rest; };
  it('A: the partner\'s own stop given as their age at your stop is not answering, figure for figure and word for word', () => {
    const base = { household: 'couple', you: { age: 52, pot: 240000, payIn: { kind: 'total', total: 700 } }, partner: { age: 49, pot: 80000, payIn: { kind: 'total', total: 250 } }, savings: 30000, stop: { kind: 'age', age: 60 }, spend: { kind: 'amount', amount: 2600 } };
    const given = { ...base, partner: { ...base.partner, stop: { kind: 'age', age: 57 } } };
    const a = answerA(base, { ...ENV, ages: [60] });
    const b = answerA(given, { ...ENV, ages: [60] });
    expect(b.apart).toBeUndefined();
    expect(strip(b)).toEqual(strip(a));
  }, 120_000);

  it('B: the same, at the same stop', () => {
    const base = { household: 'couple', you: { age: 52, pot: 240000, payIn: { kind: 'total', total: 700 } }, partner: { age: 49, pot: 80000, payIn: { kind: 'total', total: 250 } }, savings: 30000, stop: { age: 60 }, spend: { kind: 'amount', amount: 2600 } };
    const given = { ...base, partner: { ...base.partner, stop: { kind: 'same' } } };
    const a = answerB(base, { ...ENV, detail: 'answer' });
    const b = answerB(given, { ...ENV, detail: 'answer' });
    expect(b.apart).toBeUndefined();
    expect(strip(b)).toEqual(strip(a));
  }, 120_000);

  it('C: from now with the partner already stopped is from now with the question not answered (I3), and at an age with the partner\'s age then (I2)', () => {
    const now = { household: 'couple', you: { age: 63, pot: 300000 }, partner: { age: 66, pot: 120000 }, savings: 20000 };
    const a = answerC(now, ENV);
    const b = answerC({ ...now, partner: { ...now.partner, stop: { kind: 'already' } } }, ENV);
    expect(b.apart).toBeUndefined();
    expect(strip(b)).toEqual(strip(a));
    const atAge = { household: 'couple', you: { age: 55, pot: 260000 }, partner: { age: 53, pot: 90000 }, start: { kind: 'age', age: 60 } };
    const c = answerC(atAge, ENV);
    const d = answerC({ ...atAge, partner: { ...atAge.partner, stop: { kind: 'age', age: 58 } } }, ENV);
    expect(d.apart).toBeUndefined();
    expect(strip(d)).toEqual(strip(c));
  }, 120_000);

  it('C, I3\'s one exception: "from now" moved to the day a pension opens (you still paying in, every pension closed) — your partner who has already stopped then stops years before you start', () => {
    // not answered: the two of you start together when the first pension opens (the move); "they already have": your partner
    // stopped now and you start at that day, so the answer is the apart one — each at their own stop, as it should be
    const moved = { household: 'couple', you: { age: 52, pot: 300000, payIn: { has: 'yes', kind: 'total', total: 600 } }, partner: { age: 54, pot: 200000 }, savings: 40000, start: { kind: 'now' } };
    const together = answerC(moved, ENV);
    const already = answerC({ ...moved, partner: { ...moved.partner, stop: { kind: 'already' } } }, ENV);
    expect(together.status).toBe('ok');
    expect(together.apart).toBeUndefined();
    expect(already.status).toBe('ok');
    // (your partner's pension opens at 55, a year on: "now" moves to then for both, and you start at 53)
    expect(already.apart.stops).toEqual({ you: { age: 53, already: false }, partner: { age: 54, already: true } });
    // and when only your partner pays in (their own stop at an age), your "now" is not moved: you have stopped
    const theirs = { ...moved, you: { age: 52, pot: 300000, payIn: { has: 'no' } }, partner: { age: 54, pot: 200000, payIn: { has: 'yes', kind: 'total', total: 600 }, stop: { kind: 'age', age: 56 } } };
    const r = answerC(theirs, ENV);
    expect(r.apart.stops).toEqual({ you: { age: 52, already: true }, partner: { age: 56, already: false } });
  }, 120_000);
});
