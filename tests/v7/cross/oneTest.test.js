/**
 * ONE TEST EVERYWHERE (step 4 brief section 10, J8–J10). A life is one future from today through the saving years and
 * the drawing years; "works" means the money lasts to the end age in that whole life; careful is 9 lives in 10. C, A
 * and B are three slices of one function of (stop age, pay-in, spend) → the lives that last:
 *
 *   C  given the age the money starts (= the stop) and the pay-in: the spend that lasts in 9 lives out of 10 (careful)
 *   A  given the spend and the pay-in: the verdict at each stop age, and the earliest age that works
 *   B  given the spend and the stop age: the pay-in that makes the whole life last in 9 lives out of 10
 *
 * so, for generated households (one person or a couple; pots, ages, pay-ins including nothing, savings, a final-salary
 * pension, a stop before and after 57):
 *   OT1  C(stop X, pay-in c).careful = s  ⇒  A(X, spend s, pay-in c) is a yes, and A at s + £10 is not;
 *        and A's careful amount at X is s, the same band to the pound (A's row and C are one computation)
 *   OT2  B(X, spend s) is on course, its pay-in that gets there is no more than c (to the £10), and its "spend less" (asked
 *        at a higher spend) is s
 *   OT3  B's "stop later" (asked at a spend it does not reach at X) is the first age above X at which A says yes — A's
 *        earliest age that works, when that is above X
 *   OT4  C with nothing going in is today's C: "still paying in?" answered no, or yes with £0, gives the answer of the form
 *        that never asks (the inputs echoed aside); from now, every pinned fixture and state of C is unchanged (their
 *        own tests: tests/v7/c/fixtures.test.js, tests/v7/c/render.test.js, tests/v7/c/speed.identity.test.js)
 *
 * Every push: fixed seeds and 40 futures. Nightly (NIGHTLY=1): more households.
 */
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { answerA } from '../a/_a.js';
import { answerB } from '../b/_b.js';
import { answerC } from '../c/_c.js';
import { RULES, firstAccessAge, accessAgeOn, addYears } from '../../../src/answers/shared/rules.js';

const NIGHTLY = !!process.env.NIGHTLY;
const SEED = NIGHTLY ? undefined : 20261002;
// the night's FC_RUNS is 2,000 (nightly.yml); a household here is seven answers (about a second), so the night takes 120
const RUNS = NIGHTLY ? Math.min(120, Number(process.env.FC_RUNS || 30)) : 6;
const TODAY = '2026-09-30';
const ENV = { today: TODAY, futures: 40, seed: 0, trace: false };
const copy = (v) => JSON.parse(JSON.stringify(v));

/**
 * One household, written once and read as each question's inputs. `payIn` per person: { own, employer } a month (what
 * lands in the pension), or null for nothing going in.
 */
function asC(h) {
  const person = (p) => ({ age: p.age, pot: p.pot, statePension: p.statePension || { kind: 'full' }, finalSalary: p.finalSalary || { has: false },
    ...(p.payIn ? { payIn: { has: 'yes', kind: 'split', own: p.payIn.own, employer: p.payIn.employer } } : {}) });
  return { household: h.partner ? 'couple' : 'single', you: person(h.you), ...(h.partner ? { partner: person(h.partner) } : {}),
    savings: h.savings || 0, start: { kind: 'age', age: h.stop }, risk: h.risk || 'balanced', endAge: h.endAge || 95 };
}
function asSaver(h, spend, q) {
  const person = (p) => ({ age: p.age, pot: p.pot, statePension: p.statePension || { kind: 'full' }, finalSalary: p.finalSalary || { has: false },
    payIn: p.payIn ? { kind: 'split', own: p.payIn.own, employer: p.payIn.employer } : { kind: 'total', total: 0 } });
  const out = { household: h.partner ? 'couple' : 'single', you: person(h.you), ...(h.partner ? { partner: person(h.partner) } : {}),
    savings: h.savings || 0, spend: { kind: 'amount', amount: spend }, savingsIn: 0, savingRisk: h.risk || 'balanced', risk: h.risk || 'balanced', charge: 0.5, endAge: h.endAge || 95 };
  return q === 'a' ? { ...out, stop: { kind: 'age', age: h.stop }, partTime: { has: false } } : { ...out, stop: { age: h.stop }, confidence: 'nineInTen' };
}
const payInOf = (h) => [h.you, h.partner].filter(Boolean).reduce((t, p) => t + (p.payIn ? p.payIn.own + p.payIn.employer : 0), 0);

/** The households named by hand: the owner's (1 Oct 2026), a couple, a stop before 57 on savings, nothing going in. */
const NAMED = [
  { name: 'the owner\'s case: 55, £275,000, £500 + £300 a month, the money from 67', h: { you: { age: 55, pot: 275000, payIn: { own: 500, employer: 300 } }, stop: 67 } },
  { name: '45, £120,000, £400 + £250, from 60', h: { you: { age: 45, pot: 120000, payIn: { own: 400, employer: 250 } }, stop: 60 } },
  { name: 'nothing going in: 50, £250,000, from 57', h: { you: { age: 50, pot: 250000, payIn: null }, stop: 57 } },
  { name: 'a couple, 58 and 56, £310,000 and £150,000, £80,000 savings, paying in, from 62', h: { you: { age: 58, pot: 310000, payIn: { own: 700, employer: 300 } }, partner: { age: 56, pot: 150000, payIn: { own: 300, employer: 200 } }, savings: 80000, stop: 62 } },
  { name: 'stopping at 53, before the pension opens, on £360,000 of savings', h: { you: { age: 47, pot: 60000, payIn: { own: 300, employer: 200 } }, savings: 360000, stop: 53 } },
  { name: 'a final-salary pension from 65, cautious, from 60', h: { you: { age: 52, pot: 180000, payIn: { own: 400, employer: 400 }, finalSalary: { has: true, yearly: 9000, fromAge: 65 } }, stop: 60, risk: 'cautious' } },
  // the nightly run's counterexample (seed 1743444427): 55 before 6 April 2028, so open at 55, but closed again from that
  // day until 57 — a stop at 56 is before the pension opens, and C takes it only with savings to live on (as A and B)
  { name: '54 today, nothing in the pot yet, paying in, stopping at 56 after the 2028 rise, on £120,000 of savings', h: { you: { age: 54, pot: 0, payIn: { own: 500, employer: 300 } }, savings: 120000, stop: 56, risk: 'cautious' } }
];

/** Random households: ages, pots, pay-ins (nothing too), savings, a final-salary pension, a stop before or after 57. */
const households = fc.record({
  age: fc.integer({ min: 30, max: 64 }), pot: fc.constantFrom(0, 40000, 150000, 275000, 600000),
  payIn: fc.constantFrom(null, { own: 100, employer: 0 }, { own: 500, employer: 300 }, { own: 1200, employer: 600 }),
  savings: fc.constantFrom(0, 30000, 120000), early: fc.boolean(), gap: fc.integer({ min: 1, max: 12 }),
  fs: fc.boolean(), risk: fc.constantFrom('cautious', 'balanced', 'adventurous'),
  partner: fc.option(fc.record({ dAge: fc.integer({ min: -6, max: 6 }), pot: fc.constantFrom(0, 90000), payIn: fc.constantFrom(null, { own: 200, employer: 100 }) }), { freq: 3 })
}).map((k) => {
  // a stop before 57 is a saver's question: C takes it with savings to live on until the pension opens
  const opens = firstAccessAge(k.age, TODAY);
  const early = k.early && k.age + 1 < opens;
  const stop = early ? Math.min(opens - 1, k.age + k.gap) : Math.min(RULES.stopAgeMax, Math.max(opens, k.age + k.gap));
  // …and so is a stop at which the pension is closed on the day itself: someone 55 before 6 April 2028 can touch it at 55,
  // but from that day it is closed again until 57 (no protected age), so 54 today stopping at 56 is a stop before it opens
  const closed = stop < accessAgeOn(addYears(TODAY, stop - k.age));
  const h = { you: { age: k.age, pot: k.pot, payIn: k.payIn, ...(k.fs ? { finalSalary: { has: true, yearly: 9000, fromAge: 65 } } : {}) },
    savings: early || closed ? Math.max(k.savings, 120000) : k.savings, stop, risk: k.risk };
  if (k.partner) h.partner = { age: Math.min(75, Math.max(30, k.age + k.partner.dAge)), pot: k.partner.pot, payIn: k.partner.payIn };
  return h;
}).filter((h) => h.stop > h.you.age && (h.you.pot > 0 || payInOf(h) > 0 || h.savings > 0));

/** The three slices of one household. Returns what was compared, or 'skipped' with the reason. */
function oneTest(h) {
  const where = JSON.stringify(h);
  const c = answerC(asC(h), ENV);
  expect(c.status, `${where}: C ${JSON.stringify(c.problems)}`).not.toBe('invalid');
  if (c.status !== 'ok') return 'skipped: nothing to draw on';
  expect(c.saving, `${where}: C at an age is worked on the lives`).toBeTruthy();
  const s = c.monthly.careful;
  if (s < 1) return 'skipped: no careful amount';

  // OT1 C's careful amount is A's yes, and £10 more is not
  const aEnv = { ...ENV, detail: 'chart', ages: [h.stop] };
  const a = answerA(asSaver(h, s, 'a'), aEnv);
  expect(a.status, where).toBe('ok');
  expect(a.shown.age, where).toBe(h.stop);
  expect(a.shown.monthly, `${where}: A's band at the stop age is C's`).toEqual(c.monthly);
  expect(a.shown.lastedAt, where).toEqual(c.lasted);
  expect(a.shown.runOutAgeAt, where).toEqual(c.runOutAge);
  expect(a.shown.verdict, `${where}: A at C's careful £${s}`).toBe('yes');
  expect(a.shown.lasted, where).toBe(c.lasted.careful);
  const a10 = answerA(asSaver(h, s + 10, 'a'), aEnv);
  expect(a10.shown.verdict, `${where}: A at £${s + 10}`).not.toBe('yes');

  // OT2 B at C's careful amount: on course, the pay-in that gets there no more than what goes in, A's careful as "spend less"
  const c0 = payInOf(h);
  const b = answerB(asSaver(h, s, 'b'), { ...ENV, detail: 'answer' });
  expect(b.status, `${where}: B ${JSON.stringify(b.problems)}`).not.toBe('invalid');
  expect(b.onCourse, `${where}: B at C's careful £${s}`).toBe(true);
  expect(b.chance.lasted, where).toBe(a.shown.lasted);
  if (b.payIn.at.nineInTen !== null) expect(b.payIn.at.nineInTen, `${where}: B's pay-in against £${c0}`).toBeLessThanOrEqual(c0 + 10);
  const more = Math.ceil(s * 1.15 / 10) * 10 + 10;
  const bMore = answerB(asSaver(h, more, 'b'), { ...ENV, detail: 'answer' });
  if (bMore.status === 'guaranteed-only') return 'compared (spend covered by pensions at the higher spend)';
  expect(bMore.onCourse, `${where}: B at £${more}`).toBe(false);
  expect(bMore.monthlyIfShort, `${where}: B's careful amount paying in as now is C's`).toBe(s);
  if (bMore.levers.spendLess) expect(bMore.levers.spendLess.spend, where).toBe(s);

  // OT3 B's "stop later" at that higher spend is the first age above the stop at which A says yes
  const later = [];
  for (let x = h.stop + 1; x <= RULES.stopAgeMax; x++) later.push(x);
  const aMore = answerA(asSaver(h, more, 'a'), { ...ENV, detail: 'chart', ages: [h.stop, ...later] });
  const firstYes = aMore.ages.find((r) => r.age > h.stop && r.verdict === 'yes');
  expect(bMore.levers.stopLater ? bMore.levers.stopLater.age : null, `${where}: stop later at £${more}`).toBe(firstYes ? firstYes.age : null);
  if (bMore.levers.stopLater) expect(bMore.levers.stopLater.lasted, where).toBe(firstYes.lasted);
  // …and A's own earliest age, when that is above the stop (a later stop is not always better on every future: M-A4)
  const aAges = answerA({ ...asSaver(h, more, 'a'), stop: { kind: 'ages' } }, { ...ENV, detail: 'chart' });
  if (aAges.status === 'ok' && aAges.earliest.yes !== null && aAges.earliest.yes > h.stop) {
    expect(bMore.levers.stopLater && bMore.levers.stopLater.age, `${where}: B's stop later and A's earliest age`).toBe(aAges.earliest.yes);
  }
  return 'compared';
}

describe('OT1–OT3 — C, A and B are three slices of one test', () => {
  it.each(NAMED.map((x) => [x.name, x]))('%s', (_n, x) => {
    expect(oneTest(x.h)).toMatch(/^compared/);
  });

  it('on random households: one person or two, pots, pay-ins (nothing too), savings, a final-salary pension, a stop before or after 57', () => {
    const tally = {};
    fc.assert(fc.property(households, (h) => { const r = oneTest(h); tally[r] = (tally[r] || 0) + 1; }), { seed: SEED, numRuns: RUNS, verbose: 1 });
    expect(tally.compared || 0, JSON.stringify(tally)).toBeGreaterThan(0);
  }, 300_000);
});

describe('OT4 — C with nothing going in is today\'s C', () => {
  const CASES = [
    { name: 'F1 (58, £250,000), from now', c: { you: { pot: 250000, age: 58 } } },
    { name: 'F2-like couple, from now', c: { household: 'couple', you: { pot: 400000, age: 62, finalSalary: { has: true, yearly: 9000, fromAge: 65 } }, partner: { age: 60, pot: 150000 } } },
    { name: '55 with £275,000, from 67', c: { you: { pot: 275000, age: 55 }, start: { kind: 'age', age: 67 } } },
    { name: '50 with £250,000 and the form\'s default start', c: { you: { pot: 250000, age: 50 } } }
  ];
  // the inputs echoed aside; and "nothing more goes in" is a line the person answered (entered) or the rule (not asked)
  const strip = (r) => {
    const { inputs, ...rest } = copy(r);
    void inputs;
    rest.assumed = rest.assumed.map((x) => (x.id === 'nothing-paid-in' ? { ...x, field: null, source: 'rule', value: null } : x));
    // £0 typed as own + employer is echoed as the split it was typed in (the figures are the same)
    if (rest.saving) rest.saving = rest.saving.map((x) => ({ ...x, payIn: { ...x.payIn, own: null, employer: null } }));
    return rest;
  };

  it.each(CASES.map((x) => [x.name, x]))('%s: "still paying in?" answered no, or yes with £0, gives the same answer', (_n, x) => {
    const never = answerC(x.c, ENV);
    expect(never.status).toBe('ok');
    expect(JSON.stringify(never.inputs)).not.toContain('payIn');
    const no = answerC({ ...copy(x.c), you: { ...x.c.you, payIn: { has: 'no' } } }, ENV);
    expect(strip(no)).toEqual(strip(never));
    const zero = answerC({ ...copy(x.c), you: { ...x.c.you, payIn: { has: 'yes', own: 0, employer: 0 } } }, ENV);
    const { payIn, ...zeroRest } = strip(zero);
    expect(payIn.total).toBe(0);
    expect({ ...zeroRest, payIn: never.payIn }).toEqual({ ...strip(never), payIn: never.payIn });
  });

  it('from now, paying in changes nothing in the figures (nothing more goes in), and a note says so', () => {
    const never = answerC({ you: { pot: 250000, age: 60 } }, ENV);
    // (the start chosen: "now". Left alone, someone still paying in starts at their State Pension age — tests/v7/cross/reviewRound3.test.js R6)
    const paying = answerC({ you: { pot: 250000, age: 60, payIn: { has: 'yes', own: 500, employer: 300 } }, start: { kind: 'now' } }, ENV);
    for (const k of ['monthly', 'yearly', 'lasted', 'runOutAge', 'phases', 'guaranteed', 'basis']) expect(paying[k], k).toEqual(never[k]);
    expect(paying.payIn).toEqual({ total: 800, byPerson: [{ who: 'you', total: 800 }] });
    expect(paying.warnings.map((w) => w.id)).toContain('pay-in-unused');
    expect(never.warnings.map((w) => w.id)).not.toContain('pay-in-unused');
  });
});
