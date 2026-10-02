/**
 * The plan seed (research/v7/save-as-plan.md, Contract C.1): its shape, each field from where the table says, for C,
 * A and B, one person and a couple, from now and later; the name checked again; the budget a passenger that moves no
 * figure; and a seed that can go to Firestore almost unchanged. The answers are the pinned named states' own.
 */
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { buildPlanSeed, seedProblems, keepable, SEED_KEY, SEED_VERSION, SEED_MAX_AGE_MS } from '../../../src/answers/keep/planSeed.js';
import { starterSheet, checkSheet, sheetForSeed } from '../../../src/answers/keep/budgetSheet.js';
import { suggestedPlanName } from '../../../src/answers/shared/planName.js';
import { verdictOf } from '../../../src/answers/shared/rules.js';
import { stopsOf } from '../../../src/answers/shared/household.js';
import { toHousehold as toHouseholdA } from '../../../src/answers/a/toHousehold.js';
import { toHousehold as toHouseholdB } from '../../../src/answers/b/toHousehold.js';
import { toHousehold as toHouseholdC } from '../../../src/answers/c/toHousehold.js';
import * as frozen from './seed.v1/v7Seed.js';
import { APART_ANSWERS, aPartnerAlready, aYouAlready, bYouAlready, bBothLater, cYouNow, TODAY as APART_TODAY } from './apartAnswers.mjs';

const load = (q, name) => JSON.parse(readFileSync(join(process.cwd(), 'tests/v7/states', q, `${name}.json`), 'utf8')).answers[q].result;
const ENV = { today: '2026-09-30', appVersion: '6.17.0' };
const AT = '2026-09-30T14:03:22.511Z';
const seedOf = (source, file, more = {}) => buildPlanSeed({ source, result: load(source, file), env: ENV, name: { chosen: 'My try' }, createdAt: AT, ...more });

const KEYS = ['seedVersion', 'createdAt', 'today', 'source', 'v7', 'name', 'inputs', 'household', 'stop', 'endAge', 'years', 'untilBothStop', 'risk', 'spend', 'people', 'answer', 'budget'];
const PERSON = ['who', 'ageToday', 'ageAtStop', 'pensionOpensAge', 'pension', 'savings', 'payIn', 'alreadyDrawing', 'statePension', 'finalSalary', 'taxFreeQuarter', 'partTime', 'takeHome', 'stop', 'years'];
const STATES = [
  ['c', 'answer-F1'], ['c', 'answer-F2'], ['c', 'answer-F3'], ['c', 'answer-paying-in'],
  ['a', 'answer-A1'], ['a', 'answer-A2-couple'], ['a', 'answer-A3-part-time'], ['a', 'answer-A4'], ['a', 'answer-stop-now'], ['a', 'answer-no'],
  ['b', 'answer-B1'], ['b', 'answer-B2-on-course'], ['b', 'answer-B4-before-57'], ['b', 'answer-B5-couple']
];

describe('every seed has the contract\'s shape and goes to Firestore almost unchanged', () => {
  it.each(STATES)('%s %s', (q, file) => {
    const seed = seedOf(q, file);
    expect(seed).not.toBe(null);
    expect(Object.keys(seed)).toEqual(KEYS);
    expect(seedProblems(seed)).toEqual([]);
    expect(JSON.parse(JSON.stringify(seed))).toEqual(seed);
    expect(seed.seedVersion).toBe(SEED_VERSION);
    expect(seed.createdAt).toBe(AT);
    expect(seed.today).toBe(ENV.today);
    expect(seed.source).toBe(q);
    const r = load(q, file);
    expect(seed.v7).toEqual({ appVersion: '6.17.0', engineVersion: r.basis.engineVersion, historyEnd: r.basis.historyEnd });
    expect(seed.inputs).toEqual(r.inputs);
    expect(seed.name).toEqual({ suggested: suggestedPlanName(q, r.inputs, r), chosen: 'My try' });
    expect(seed.people.map((p) => p.who)).toEqual(r.inputs.household === 'couple' ? ['you', 'partner'] : ['you']);
    for (const p of seed.people) {
      expect(Object.keys(p)).toEqual(PERSON);
      expect(Number.isInteger(p.pension.today) && Number.isInteger(p.pension.atStop.careful) && Number.isInteger(p.pension.atStop.middling)).toBe(true);
      expect(p.taxFreeQuarter).toBe(true);
      expect(p.takeHome.length).toBeGreaterThan(0);
    }
    expect(seed.years).toBe(Math.min(45, seed.endAge - Math.min(...seed.people.map((p) => p.ageAtStop))));
    expect(seed.budget).toBe(null);
    // one stop for everyone: each person's own stop and years are the household's, and there is no pay line
    expect(seed.untilBothStop).toBe(null);
    for (const p of seed.people) expect([p.stop, p.years]).toEqual([seed.stop, seed.years]);
  });
  it('the key, the version and the age limit are the contract\'s', () => {
    expect(SEED_KEY).toBe('pt_v7_plan_seed');
    expect(SEED_VERSION).toBe(2);
    expect(SEED_MAX_AGE_MS).toBe(24 * 60 * 60 * 1000);
  });
  it('the checker finds what Firestore would not take', () => {
    expect(seedProblems({ a: undefined })).toEqual(['a is undefined']);
    expect(seedProblems({ a: [[1]] })).toEqual(['a[0] is an array inside an array']);
    expect(seedProblems({ a: NaN, b: () => 1, c: new Date(0) })).toEqual(['a is NaN', 'b is a function', 'c is not a plain object']);
  });
});

describe('C — "what is that a month?"', () => {
  it('from now (F1): today\'s pots are the pots at the stop; the careful figure is the spending', () => {
    const s = seedOf('c', 'answer-F1');
    const r = load('c', 'answer-F1');
    expect(s.stop).toEqual({ kind: 'now', yearsFromNow: 0 });
    expect(s.household).toBe('single');
    expect(s.endAge).toBe(95);
    expect(s.years).toBe(r.basis.years);
    expect(s.spend).toEqual({ perMonth: 1350, from: 'careful', level: null, budgetSkipped: null });
    const [you] = s.people;
    expect(you).toMatchObject({ ageToday: 58, ageAtStop: 58, pensionOpensAge: 55, alreadyDrawing: false, payIn: null, partTime: null, finalSalary: null });
    expect(you.pension).toEqual({ today: 250000, atStop: { careful: 250000, middling: 250000 } });
    expect(you.savings).toEqual({ today: 0, atStop: { careful: 0, middling: 0 } });
    expect(you.statePension).toEqual({ yearly: 12547.6, fromAge: 67, fromDate: '2035-09-30' });
    expect(you.takeHome).toEqual([{ fromAge: 58, perMonth: 1350 }]);
    expect(s.answer).toEqual({ monthly: r.monthly, lasted: r.lasted.careful, runOutAge: r.runOutAge.careful, verdict: null, potAtStop: null, number: null, payInNeeded: null });
  });
  it('a forecast and a final-salary pension (F3)', () => {
    const [you] = seedOf('c', 'answer-F3').people;
    expect(you.statePension).toEqual({ yearly: 11000, fromAge: 66, fromDate: '2024-09-30' });   // already being paid: the date has passed
    expect(you.finalSalary).toEqual({ yearly: 6000, fromAge: 60, increases: 'pricesCapped5' });
  });
  it('a couple from now (F2): two people, each with their own part of the spending, adding up to it in every stretch', () => {
    const s = seedOf('c', 'answer-F2');
    const r = load('c', 'answer-F2');
    expect(s.household).toBe('couple');
    expect(s.years).toBe(35);
    const [you, partner] = s.people;
    expect([you.ageToday, partner.ageToday]).toEqual([62, 60]);
    expect(partner.pension).toEqual({ today: 150000, atStop: { careful: 150000, middling: 150000 } });
    const at = (rows, age) => rows.filter((x) => x.fromAge <= age).pop().perMonth;
    for (const ph of r.phases) {
      const sum = at(you.takeHome, ph.ages.you.from) + at(partner.takeHome, ph.ages.partner.from);
      expect(Math.abs(sum - ph.takeHome)).toBeLessThan(2);
    }
  });
  it('starting later with money still going in: the pots at the stop are the saving years\' careful and middling', () => {
    const s = seedOf('c', 'answer-paying-in');
    const r = load('c', 'answer-paying-in');
    expect(s.stop).toEqual({ kind: 'later', yearsFromNow: 12 });
    const [you] = s.people;
    expect(you.ageAtStop).toBe(67);
    expect(you.pensionOpensAge).toBe(55);      // 55 today, before 6 April 2028: the pension can be touched now (rules.firstAccessAge)
    expect(you.pension.atStop).toEqual({ careful: r.saving[0].potAtStop.pension.careful, middling: r.saving[0].potAtStop.pension.middling });
    expect(you.payIn).toEqual({ kind: 'split', total: 800, own: 500, employer: 300, savingsIn: 0 });
    expect(s.answer.potAtStop).toEqual({ careful: r.potAtStart.careful, middling: r.potAtStart.middling });
  });
});

describe('A — "when can I afford to stop work?"', () => {
  it('A1: later; the pots and savings at the stop; the spending as typed; the verdict of the row shown', () => {
    const s = seedOf('a', 'answer-A1');
    const r = load('a', 'answer-A1');
    expect(s.stop).toEqual({ kind: 'later', yearsFromNow: 10 });
    expect(s.spend).toEqual({ perMonth: 1900, from: 'typed', level: null, budgetSkipped: true });
    const [you] = s.people;
    expect(you.pension).toEqual({ today: 250000, atStop: { careful: 295340, middling: 417982 } });
    // (6.22.0: the savings grow as "Mostly cash" while saving — they were £36,402 / £53,500 when they followed the pension's mix)
    expect(you.savings).toEqual({ today: 40000, atStop: { careful: 32871, middling: 39245 } });
    expect(you.payIn).toEqual({ kind: 'total', total: 600, own: null, employer: null, savingsIn: 0 });
    expect(you.pensionOpensAge).toBe(r.pensionOpens.you);
    expect(you.takeHome).toEqual([{ fromAge: 60, perMonth: 1900 }]);
    expect(s.answer).toEqual({ monthly: r.shown.monthly, lasted: r.shown.lasted, runOutAge: r.shown.runOutAge, verdict: 'close',
      potAtStop: { careful: r.shown.potAtStop.careful, middling: r.shown.potAtStop.middling }, number: null, payInNeeded: null });
  });
  it('stopping today (stop now): taken as now, today\'s pots, nothing going in', () => {
    const s = seedOf('a', 'answer-stop-now');
    expect(s.stop).toEqual({ kind: 'now', yearsFromNow: 0 });
    expect(s.people[0].pension).toEqual({ today: 480000, atStop: { careful: 480000, middling: 480000 } });
    expect(s.people[0].payIn).toBe(null);
  });
  it('part-time work goes with the first person only', () => {
    const s = seedOf('a', 'answer-A3-part-time');
    const r = load('a', 'answer-A3-part-time');
    expect(s.people[0].partTime).toEqual({ yearly: r.inputs.partTime.yearly, years: r.inputs.partTime.years });
  });
  it('a couple (A2): the savings split evenly, each person\'s own pots at the stop, the household\'s spending in two parts', () => {
    const s = seedOf('a', 'answer-A2-couple');
    const r = load('a', 'answer-A2-couple');
    const [you, partner] = s.people;
    expect([you.savings.today, partner.savings.today]).toEqual([20000, 20000]);
    expect(you.pension.atStop.middling).toBe(r.saving[0].potAtStop.pension.middling);
    expect(partner.pension.atStop.middling).toBe(r.saving[1].potAtStop.pension.middling);
    expect([you.ageAtStop, partner.ageAtStop]).toEqual([56, 54]);
    expect(partner.pensionOpensAge).toBe(57);
    const at = (rows, age) => rows.filter((x) => x.fromAge <= age).pop().perMonth;
    for (const ph of r.shown.phases) {
      expect(Math.abs(at(you.takeHome, ph.ages.you.from) + at(partner.takeHome, ph.ages.partner.from) - ph.takeHome)).toBeLessThan(2);
    }
  });
});

describe('B — "am I saving enough?"', () => {
  it('B1: later; the pay-in as typed, split; the number and the pay-in that gets there; the one test\'s verdict', () => {
    const s = seedOf('b', 'answer-B1');
    const r = load('b', 'answer-B1');
    expect(s.stop).toEqual({ kind: 'later', yearsFromNow: 10 });
    expect(s.people[0].payIn).toEqual({ kind: 'split', total: 700, own: 450, employer: 250, savingsIn: 0 });
    expect(s.answer).toEqual({
      monthly: null, lasted: r.chance.lasted, runOutAge: r.wholeLife.runOutAge, verdict: verdictOf(r.chance.fails, r.basis.futures),
      potAtStop: { careful: r.potAtStop.now.careful, middling: r.potAtStop.now.middling },
      number: { careful: r.number.careful, middling: r.number.middling, good: r.number.good }, payInNeeded: 2920
    });
    expect(s.answer.verdict).toBe('no');
  });
  it('B5, a couple: both stop in the same year, each with their own pay-in', () => {
    const s = seedOf('b', 'answer-B5-couple');
    expect(s.people.map((p) => [p.ageToday, p.ageAtStop, p.payIn.total])).toEqual([[50, 60, 700], [48, 58, 300]]);
  });
});

describe('the spending and the budget', () => {
  it('worked out line by line: "from" says so — and the figure is still the one typed', () => {
    const typed = seedOf('a', 'answer-A1');
    const lines = seedOf('a', 'answer-A1', { spendHow: 'lines' });
    expect(lines.spend).toEqual({ ...typed.spend, from: 'budget', budgetSkipped: false });
    expect(lines.people).toEqual(typed.people);
  });
  it('a level picked: "from" is the level', () => {
    const r = JSON.parse(JSON.stringify(load('a', 'answer-A1')));
    r.spend = { ...r.spend, kind: 'level', level: 'moderate' };
    const s = buildPlanSeed({ source: 'a', result: r, env: ENV, name: 'x', spendHow: 'lines', createdAt: AT });
    expect(s.spend).toMatchObject({ from: 'level', level: 'moderate' });
  });
  it('the budget rides along — lines above £0 only — and changes nothing else in the seed (random budgets)', () => {
    const plain = seedOf('b', 'answer-B1');
    const lines = starterSheet().lines;
    fc.assert(fc.property(fc.array(fc.tuple(fc.integer({ min: 0, max: lines.length - 1 }), fc.oneof(fc.integer({ min: 0, max: 4000 }).map(String), fc.constant(''), fc.constant('x'))), { maxLength: 15 }), (edits) => {
      const sheet = starterSheet();
      for (const [i, amount] of edits) sheet.lines[i] = { ...sheet.lines[i], amount };
      const s = seedOf('b', 'answer-B1', { budget: sheet });
      const { budget, ...rest } = s;
      const { budget: none, ...plainRest } = plain;
      expect(none).toBe(null);
      expect(rest).toEqual(plainRest);
      expect(budget).toEqual(sheetForSeed(checkSheet(sheet, { household: 'single', level: 'moderate', today: ENV.today })));
      if (budget) for (const l of budget.lines) expect(l.annual).toBeGreaterThan(0);
    }), { numRuns: 60 });
  });
});

describe('the name, and what cannot be saved', () => {
  it('the chosen name is checked again: cleaned, and refused when empty or too long', () => {
    expect(seedOf('a', 'answer-A1', { name: { chosen: '  Stop   later ' } }).name.chosen).toBe('Stop later');
    expect(seedOf('a', 'answer-A1', { name: 'Plain text' }).name.chosen).toBe('Plain text');
    expect(seedOf('a', 'answer-A1', { name: { chosen: '   ' } })).toBe(null);
    expect(seedOf('a', 'answer-A1', { name: { chosen: 'x'.repeat(61) } })).toBe(null);
    expect(seedOf('a', 'answer-A1', { name: undefined }).name.chosen).toBe('Stop at 60 · £1,900 a month');
  });
  it('only an answer of status ok — C not held down by a closed pension — can be saved', () => {
    expect(keepable('c', load('c', 'answer-F1'))).toEqual({ ok: true });
    expect(keepable('c', load('c', 'answer-pensions-only'))).toEqual({ ok: false, why: 'notOk' });
    expect(keepable('c', load('c', 'answer-closed-years'))).toEqual({ ok: false, why: 'closedYears' });
    expect(keepable('b', load('b', 'answer-out-of-reach'))).toEqual({ ok: false, why: 'notOk' });
    expect(keepable('a', load('a', 'answer-no'))).toEqual({ ok: true });                  // a "no" is still a try
    expect(keepable('a', null)).toEqual({ ok: false, why: 'noAnswer' });
    expect(keepable('d', load('a', 'answer-A1'))).toEqual({ ok: false, why: 'noAnswer' });
    expect(seedOf('c', 'answer-closed-years')).toBe(null);
    expect(buildPlanSeed({ source: 'a', result: load('a', 'answer-A1'), env: ENV, name: 'x' })).toBe(null);   // no time given
  });
});

describe('today\'s planner can read every seed (src/services/PlanSeed.js checkSeed, wherever that side is built)', () => {
  it.each(STATES)('%s %s', async (q, file) => {
    const { existsSync } = await import('node:fs');
    if (!existsSync(join(process.cwd(), 'src/services/PlanSeed.js'))) return;    // today's side not built yet: nothing to read with
    const today = await import('../../../src/services/PlanSeed.js');
    if (typeof today.checkSeed !== 'function') return;
    const sheet = starterSheet();
    sheet.lines[1] = { ...sheet.lines[1], amount: '150' };
    sheet.oneOffs[0] = { ...sheet.oneOffs[0], amount: '18,000', year: '2031' };
    for (const budget of [null, sheet]) {
      const seed = seedOf(q, file, { budget, spendHow: budget ? 'lines' : null });
      expect(today.checkSeed(seed, Date.parse(AT) + 60_000), `${q} ${file}${budget ? ' with a budget' : ''}`).toEqual({ ok: true });
    }
  });
});

// ---- couples who stop work in different years: seed version 2 (research/v7/couples-different-years.md 6.1, 9.6) --------

/**
 * Every named state of C, A and B whose answer can be kept, for a household stopping in the same year (C's answer-apart,
 * a couple stopping apart, is a version 2 seed of its own: below).
 */
const KEEPABLE = ['c', 'a', 'b'].flatMap((q) => readdirSync(join(process.cwd(), 'tests/v7/states', q))
  .filter((f) => f.endsWith('.json') && !f.startsWith('_')).map((f) => [q, f.slice(0, -5)])
  .filter(([q, f]) => { const st = JSON.parse(readFileSync(join(process.cwd(), 'tests/v7/states', q, `${f}.json`), 'utf8')); return !!(st.answers && st.answers[q] && keepable(q, st.answers[q].result).ok && !st.answers[q].result.apart); }));
/** A version 2 seed with its version 2 keys taken out and the version written back as 1. */
function asVersion1(seed) {
  const out = JSON.parse(JSON.stringify(seed));
  out.seedVersion = 1;
  delete out.untilBothStop;
  for (const p of out.people) { delete p.stop; delete p.years; }
  return out;
}
const SHEET = () => { const s = starterSheet(); s.lines[1] = { ...s.lines[1], amount: '150' }; s.oneOffs[0] = { ...s.oneOffs[0], amount: '18,000', year: '2031' }; return s; };

describe('stopping in the same year: the seed is 6.19.0\'s, key for key, plus only the version 2 keys (frozen seed.v1/)', () => {
  it('found the named answers that can be kept', () => {
    expect(KEEPABLE.length).toBeGreaterThanOrEqual(STATES.length);
  });
  it.each(KEEPABLE)('%s %s', (q, file) => {
    for (const [budget, spendHow] of [[null, null], [SHEET(), 'lines']]) {
      const args = { source: q, result: load(q, file), env: ENV, name: { chosen: 'My try' }, createdAt: AT, budget, spendHow };
      const now = buildPlanSeed(args);
      const then = frozen.buildPlanSeed(args);
      expect(then.seedVersion).toBe(1);
      expect(now.seedVersion).toBe(2);
      expect(now.untilBothStop).toBe(null);
      for (const p of now.people) { expect(p.stop).toEqual(now.stop); expect(p.years).toBe(now.years); }
      // byte for byte, key order included, once the version 2 keys are taken out
      expect(JSON.stringify(asVersion1(now))).toBe(JSON.stringify(then));
    }
  });
  it('over random same-year answers (savings, saving each month, ages, the partner\'s stop said as "when you do"), as 6.19.0', () => {
    const base = { a: load('a', 'answer-A2-couple'), b: load('b', 'answer-B5-couple'), c: load('c', 'answer-F2'), a1: load('a', 'answer-A1'), c1: load('c', 'answer-paying-in') };
    fc.assert(fc.property(
      fc.constantFrom('a', 'b', 'c', 'a1', 'c1'), fc.integer({ min: 0, max: 200000 }), fc.integer({ min: 0, max: 3000 }), fc.integer({ min: 0, max: 8 }), fc.boolean(),
      (k, savings, savingsIn, wait, said) => {
        const q = k[0];
        const r = JSON.parse(JSON.stringify(base[k]));
        r.inputs.savings = savings;
        if (q !== 'c') r.inputs.savingsIn = savingsIn;
        if (r.inputs.partner && said) r.inputs.partner.stop = { kind: 'same' };
        if (q === 'a') { r.shown.age = r.inputs.you.age + wait; r.shown.ages = r.inputs.partner ? { you: r.shown.age, partner: r.inputs.partner.age + wait } : { you: r.shown.age }; r.inputs.stop = { kind: 'age', age: r.shown.age }; }
        if (q === 'b') { r.stop.age = r.inputs.you.age + 1 + wait; r.inputs.stop = { age: r.stop.age }; r.ages = { you: r.stop.age, partner: r.inputs.partner.age + 1 + wait }; }
        const args = { source: q, result: r, env: ENV, name: { chosen: 'x' }, createdAt: AT };
        expect(JSON.stringify(asVersion1(buildPlanSeed(args)))).toBe(JSON.stringify(frozen.buildPlanSeed(args)));
      }
    ), { numRuns: 200 });
  });
});

const apartSeed = (name, more = {}) => { const [q, f] = APART_ANSWERS[name]; return buildPlanSeed({ source: q, result: f(), env: { today: APART_TODAY, appVersion: '6.20.0' }, name: { chosen: 'Our try' }, createdAt: AT, ...more }); };

describe('stopping in different years: each person at their own stop (6.1)', () => {
  it.each(Object.keys(APART_ANSWERS))('%s: the contract\'s shape, plain data, and each person\'s stop agrees with the household (P0) and the answer', (name) => {
    const [q, f] = APART_ANSWERS[name];
    const r = f();
    const seed = apartSeed(name);
    expect(seed).not.toBe(null);
    expect(Object.keys(seed)).toEqual(KEYS);
    for (const p of seed.people) expect(Object.keys(p)).toEqual(PERSON);
    expect(seedProblems(seed)).toEqual([]);
    expect(seed.seedVersion).toBe(2);
    // each person's own stop: the answer's (apart.stops) and the household's own (stopsOf), the same
    const stopAge = q === 'a' ? r.shown.age : q === 'b' ? r.stop.age : undefined;
    const household = { a: toHouseholdA, b: toHouseholdB, c: toHouseholdC }[q](r.inputs, { today: APART_TODAY }, stopAge).household;
    const S = Object.fromEntries(stopsOf(household, APART_TODAY).map((s) => [s.who, s.S]));
    for (const p of seed.people) {
      expect(p.stop.yearsFromNow, p.who).toBe(S[p.who]);
      expect(p.ageAtStop, p.who).toBe(r.apart.stops[p.who].age);
      expect(p.ageAtStop).toBe(p.ageToday + p.stop.yearsFromNow);
      expect(p.stop.kind).toBe(p.stop.yearsFromNow > 0 ? 'later' : 'now');
    }
    // the household's: the first stop, and D years from it; each person's years end in the same year
    const S0 = Math.min(...Object.values(S));
    expect(seed.stop).toEqual({ kind: S0 > 0 ? 'later' : 'now', yearsFromNow: S0 });
    const younger = Math.min(...seed.people.map((p) => p.ageToday));
    expect(seed.years).toBe(Math.min(45, seed.endAge - (younger + S0)));
    for (const p of seed.people) expect(p.years + p.stop.yearsFromNow).toBe(seed.years + S0);
    expect(seed.untilBothStop).toEqual({ payCovers: r.apart.payCovers });
    expect(seed.inputs).toEqual(r.inputs);
  });

  it('A, your partner has stopped: you later at 56, your partner now; the years: 40 for the household, 39 and 40', () => {
    const s = apartSeed('aPartnerAlready');
    const [you, partner] = s.people;
    expect(s.stop).toEqual({ kind: 'now', yearsFromNow: 0 });
    expect(s.years).toBe(40);
    expect([you.stop, you.ageAtStop, you.years]).toEqual([{ kind: 'later', yearsFromNow: 1 }, 56, 39]);
    expect([partner.stop, partner.ageAtStop, partner.years]).toEqual([{ kind: 'now', yearsFromNow: 0 }, 58, 40]);
    expect(s.untilBothStop).toEqual({ payCovers: 0.5 });     // not answered: the owner's default, half
  });

  it('the savings between you go with whoever stops first ("savings-first"); together they are split evenly, as before', () => {
    const a = apartSeed('aPartnerAlready');
    expect(a.people.map((p) => p.savings.today)).toEqual([0, 40000]);
    expect(a.people[1].savings.atStop).toEqual({ careful: 40000, middling: 40000 });   // stopped: today's
    expect(a.people[0].savings.atStop).toEqual({ careful: 0, middling: 0 });           // the answer's own figure at your stop
    const b = apartSeed('bBothLater');
    expect(b.people.map((p) => p.savings.today)).toEqual([10000, 0]);
    expect(b.people[0].savings.atStop).toEqual({ careful: 9000, middling: 12000 });
    expect(apartSeed('cYouNow').people.map((p) => p.savings.today)).toEqual([30000, 0]);
    expect(seedOf('a', 'answer-A2-couple').people.map((p) => p.savings.today)).toEqual([20000, 20000]);
  });

  it('the pots at the stop: the answer\'s own for whoever is still saving, today\'s for whoever has stopped', () => {
    const [you, partner] = apartSeed('aPartnerAlready').people;
    expect(you.pension).toEqual({ today: 420000, atStop: { careful: 389555, middling: 441948 } });
    expect(partner.pension).toEqual({ today: 180000, atStop: { careful: 180000, middling: 180000 } });
    const [cy, cp] = apartSeed('cYouNow').people;
    expect(cy.pension.atStop).toEqual({ careful: 400000, middling: 400000 });
    expect(cp.pension.atStop).toEqual({ careful: 158000, middling: 179000 });
  });

  it('money going in: nothing for whoever has stopped; the pay-in of whoever still saves, as given; saving each month only with those still working', () => {
    const [you, partner] = apartSeed('aPartnerAlready').people;
    expect(you.payIn).toEqual({ kind: 'total', total: 600, own: null, employer: null, savingsIn: 0 });
    expect(partner.payIn).toBe(null);
    const [by, bp] = apartSeed('bYouAlready').people;
    expect(by.payIn).toBe(null);
    expect(bp.payIn).toEqual({ kind: 'split', total: 700, own: 400, employer: 300, savingsIn: 200 });   // all £200 a month: you have stopped
    const [cy, cp] = apartSeed('cYouNow').people;
    expect(cy.payIn).toBe(null);
    expect(cp.payIn).toEqual({ kind: 'total', total: 300, own: null, employer: null, savingsIn: 0 });
  });

  it('take-home: the one still working has no row before their stop; the first to stop has their part of the years apart', () => {
    const [you, partner] = apartSeed('aPartnerAlready').people;
    expect(you.takeHome).toEqual([{ fromAge: 56, perMonth: 2300 }, { fromAge: 64, perMonth: 2000 }, { fromAge: 67, perMonth: 1700 }]);
    expect(partner.takeHome).toEqual([{ fromAge: 58, perMonth: 1600 }, { fromAge: 59, perMonth: 900 }, { fromAge: 67, perMonth: 1200 }, { fromAge: 70, perMonth: 1500 }]);
    // "All of it": the first to stop pays nothing until the second stop — a £0 row, the planner's "no target yet"
    const [bf] = apartSeed('bBothLater').people;
    expect(bf.takeHome).toEqual([{ fromAge: 60, perMonth: 0 }, { fromAge: 64, perMonth: 2000 }, { fromAge: 69, perMonth: 1700 }]);
    // "None of it": all of it from your money until your partner stops
    expect(apartSeed('bYouAlready').people[0].takeHome[0]).toEqual({ fromAge: 60, perMonth: 3000 });
    expect(apartSeed('bYouAlready').people[1].takeHome[0]).toEqual({ fromAge: 60, perMonth: 1200 });
  });

  it('the tax-free part already taken: no quarter tax-free for that person (2.3); not answered, a quarter as before', () => {
    expect(apartSeed('aPartnerAlready').people.map((p) => p.taxFreeQuarter)).toEqual([true, false]);
    expect(apartSeed('aYouAlready').people.map((p) => p.taxFreeQuarter)).toEqual([false, true]);
    expect(apartSeed('cYouNow').people.map((p) => p.taxFreeQuarter)).toEqual([true, true]);
    const c = JSON.parse(JSON.stringify(load('c', 'answer-F1')));
    c.inputs.you.taxFreeTaken = true;
    expect(buildPlanSeed({ source: 'c', result: c, env: ENV, name: 'x', createdAt: AT }).people[0].taxFreeQuarter).toBe(false);
  });

  it('you or your partner at the keyboard: the same two people, the same figures (9.3 P2, the swap)', () => {
    const one = apartSeed('aPartnerAlready'), other = apartSeed('aYouAlready');
    const strip = (p) => { const { who, ...rest } = p; return rest; };
    expect(strip(one.people[0])).toEqual(strip(other.people[1]));
    expect(strip(one.people[1])).toEqual(strip(other.people[0]));
    expect([one.stop, one.years, one.untilBothStop, one.endAge]).toEqual([other.stop, other.years, other.untilBothStop, other.endAge]);
  });

  it('the 45-year cap counts from the first stop', () => {
    const b = JSON.parse(JSON.stringify(bYouAlready()));
    b.inputs.partner.age = 40; b.inputs.partner.stop = { kind: 'age', age: 44 };
    b.apart.stops.partner.age = 44; b.stop.age = 44; b.ages.partner = 44;
    for (const ph of b.phases) for (const k of Object.keys(ph.ages)) ph.ages[k] = { ...ph.ages[k] };
    b.phases[0].ages.partner = { from: 40, to: 44 }; b.phases[1].ages.partner = { from: 44, to: 51 };
    const s = buildPlanSeed({ source: 'b', result: b, env: { today: APART_TODAY, appVersion: '6.20.0' }, name: 'x', createdAt: AT });
    expect(s.years).toBe(45);
    expect(s.people.map((p) => [p.stop.yearsFromNow, p.years])).toEqual([[0, 45], [4, 41]]);
  });
});

describe('the named state of a couple stopping apart (C\'s answer-apart: you from now, your partner at 56)', () => {
  it('keeps each person at their own stop, both ending in the same tax year, with the pay line', () => {
    const seed = buildPlanSeed({ source: 'c', result: load('c', 'answer-apart'), env: ENV, name: { chosen: 'My try' }, createdAt: AT, budget: null, spendHow: null });
    expect(seed.seedVersion).toBe(2);
    expect(seed.untilBothStop).toEqual({ payCovers: 0.5 });
    const [you, partner] = seed.people;
    expect(you.stop).toEqual({ kind: 'now', yearsFromNow: 0 });
    expect(partner.stop).toEqual({ kind: 'later', yearsFromNow: 1 });
    expect(partner.ageAtStop).toBe(56);
    expect(partner.years).toBe(you.years - 1);
    expect(you.years).toBe(seed.years);
  });
});
