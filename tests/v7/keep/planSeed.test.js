/**
 * The plan seed (research/v7/save-as-plan.md, Contract C.1): its shape, each field from where the table says, for C,
 * A and B, one person and a couple, from now and later; the name checked again; the budget a passenger that moves no
 * figure; and a seed that can go to Firestore almost unchanged. The answers are the pinned named states' own.
 */
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { buildPlanSeed, seedProblems, keepable, SEED_KEY, SEED_VERSION, SEED_MAX_AGE_MS } from '../../../src/answers/keep/planSeed.js';
import { starterSheet, checkSheet, sheetForSeed } from '../../../src/answers/keep/budgetSheet.js';
import { suggestedPlanName } from '../../../src/answers/shared/planName.js';
import { verdictOf } from '../../../src/answers/shared/rules.js';

const load = (q, name) => JSON.parse(readFileSync(join(process.cwd(), 'tests/v7/states', q, `${name}.json`), 'utf8')).answers[q].result;
const ENV = { today: '2026-09-30', appVersion: '6.17.0' };
const AT = '2026-09-30T14:03:22.511Z';
const seedOf = (source, file, more = {}) => buildPlanSeed({ source, result: load(source, file), env: ENV, name: { chosen: 'My try' }, createdAt: AT, ...more });

const KEYS = ['seedVersion', 'createdAt', 'today', 'source', 'v7', 'name', 'inputs', 'household', 'stop', 'endAge', 'years', 'risk', 'spend', 'people', 'answer', 'budget'];
const PERSON = ['who', 'ageToday', 'ageAtStop', 'pensionOpensAge', 'pension', 'savings', 'payIn', 'alreadyDrawing', 'statePension', 'finalSalary', 'taxFreeQuarter', 'partTime', 'takeHome'];
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
  });
  it('the key, the version and the age limit are the contract\'s', () => {
    expect(SEED_KEY).toBe('pt_v7_plan_seed');
    expect(SEED_VERSION).toBe(1);
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
    expect(you.savings).toEqual({ today: 40000, atStop: { careful: 36402, middling: 53500 } });
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
