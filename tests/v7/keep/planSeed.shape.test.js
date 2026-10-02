/**
 * Keep as a plan, exact to the year (research/v7/spending-shape.md 8): an answer whose spending changes with age becomes a
 * plan in today's planner whose income steps give the answer's after-tax amount in EVERY year.
 *
 *   K-SS1  the seed: version 3 only with a shape (a flat spend stays version 2: tests/v7/keep/planSeed.test.js holds it
 *          byte for byte); `spend.shape` as tested; each person's takeHome rows exact to the year (one person: the shape
 *          itself, H × r(y) ÷ 12; a couple: each one's part, adding up to the household's every year the incomes they get
 *          anyway are below it)
 *   K-SS2  V6 PARITY (T17, one shape for everything): today's compileSteps on the plan's steps IS V7's per-year target —
 *          each year's before-tax figure (today's grossUpAnnual of the year's row) to the pound; and for one person it is
 *          the before-tax target V7's own engine run is given that year (toEngine.js), to the pound
 *   K-SS3  must-hold 1, every year: grossToNet(round(amountAtAge(steps, age))) ÷ 12 is within 50p of that year's row
 *   K-SS4  must-hold 2: saved again (the Stress save's floor and round to a schedule), nothing drifts — within £1 a year
 *   K-SS5  compressSteps: a level stretch is one step, an even move within a tax band one glide, a fall below the personal
 *          allowance one decline, and anything else one step a year — always exact
 *   K-SS6  today's planner reads version 3 (and refuses a bad shape); a planner that reads only 1 and 2 refuses it
 * Made-up figures only.
 */
import { describe, it, expect, vi } from 'vitest';

vi.mock('../../../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));

import { answerA } from '../a/_a.js';
import { answerB } from '../b/_b.js';
import { answerC } from '../c/_c.js';
import { buildPlanSeed, SEED_VERSION, SEED_VERSION_SHAPE } from '../../../src/answers/keep/planSeed.js';
import { checkSeed, seedToScenario, targetAtAge, compressSteps, SEED_VERSIONS, PLANNER_DECLINE } from '../../../src/services/PlanSeed.js';
import { compileSteps, amountAtAge } from '../../../src/services/IncomeSchedule.js';
import { grossUpAnnual } from '../../../src/services/BudgetModel.js';
import { grossToNet, netToGross } from '../../../src/services/TaxCalculator.js';
import { checkInputs } from '../../../src/answers/shared/validate.js';
import { SCHEMA_C } from '../../../src/answers/c/schema.js';
import { toHousehold as toHouseholdC } from '../../../src/answers/c/toHousehold.js';
import { enginePlan, configsAt } from '../../../src/answers/shared/toEngine.js';
import * as frozenPlanner from './seed.v1/plannerSeed.js';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const TODAY = '2026-09-30';
const ENV = { today: TODAY, futures: 20, seed: 0, trace: false };
const AT = '2026-09-30T14:03:22.511Z';
const NOW_MS = Date.parse(AT) + 60000;
const DAY = new Date(2026, 8, 30, 15, 0);
const netMonthly = (g) => grossToNet(g, 12570, 50270, 125140) / 12;
const grossRow = (perMonth) => Math.round(grossUpAnnual(perMonth * 12));
const seedOf = (source, result) => buildPlanSeed({ source, result, env: { today: TODAY, appVersion: '6.21.0' }, name: { chosen: 'Our try' }, createdAt: AT });
/** The row in force at an age (the first row from the plan's start). */
const rowAt = (rows, age) => { let r = rows[0]; for (const x of rows) if (x.fromAge <= age) r = x; return r; };

const C_IN = { you: { age: 67, pot: 420000 }, start: { kind: 'now' }, shape: { steps: [{ fromAge: 75, share: 85, then: 'level' }, { fromAge: 85, share: 70, then: 'level' }] } };
const C_FALLS = { you: { age: 64, pot: 380000 }, savings: 20000, start: { kind: 'now' }, shape: { then: 'falls', fallsPct: 1, steps: [{ fromAge: 80, share: 70, then: 'glides' }, { fromAge: 90, share: 60, then: 'level' }] } };
const A_IN = { you: { age: 58, pot: 330000, payIn: { total: 700 } }, savings: 40000, stop: { kind: 'age', age: 62 },
  spend: { kind: 'amount', amount: 2400, then: 'falls', fallsPct: 0.5, steps: [{ fromAge: 75, perMonth: 2000, then: 'falls', fallsPct: 1.5 }, { fromAge: 85, perMonth: 2600, then: 'level' }] } };
const B_IN = { household: 'couple', you: { age: 55, pot: 260000, payIn: { kind: 'split', own: 400, employer: 300 } }, partner: { age: 53, pot: 140000, payIn: { kind: 'split', own: 200, employer: 100 } },
  savings: 60000, stop: { age: 61 }, spend: { amount: 3000, steps: [{ fromAge: 72, perMonth: 2700, then: 'glides' }, { fromAge: 82, perMonth: 2200, then: 'level' }] } };
const C_COUPLE = { household: 'couple', you: { age: 68, pot: 300000 }, partner: { age: 64, pot: 200000 }, start: { kind: 'now' }, shape: { then: 'falls', fallsPct: 2 } };

const CASES = [
  ['c', 'one person, go-go / go-slow / no-go', () => answerC(C_IN, ENV)],
  ['c', 'one person, falls, moves evenly, then the same', () => answerC(C_FALLS, ENV)],
  ['a', 'one person stopping at 62, falls on every step and a step up', () => answerA(A_IN, { ...ENV, detail: 'chart', ages: [62] })],
  ['b', 'a couple stopping at 61, moves evenly', () => answerB(B_IN, { ...ENV, detail: 'answer' })],
  ['c', 'a couple from now, falls 2% a year', () => answerC(C_COUPLE, ENV)]
];

describe('K-SS1 — the seed of a shaped answer', () => {
  it('version 3 only with a shape: the same answer flat is version 2', () => {
    expect(SEED_VERSION).toBe(2);
    expect(SEED_VERSION_SHAPE).toBe(3);
    const { shape, ...flat } = C_IN;
    void shape;
    expect(seedOf('c', answerC(flat, ENV)).seedVersion).toBe(2);
    expect(seedOf('c', answerC(C_IN, ENV)).seedVersion).toBe(3);
  });

  it.each(CASES)('%s %s: spend.shape as tested, and every year\'s row', (q, _name, make) => {
    const r = make();
    expect(r.status).toBe('ok');
    const seed = seedOf(q, r);
    expect(seed.seedVersion).toBe(3);
    expect(seed.spend.shape.unit).toBe('perMonth');
    if (q === 'c') seed.spend.shape.steps.forEach((s, i) => expect(s.perMonth).toBe(Math.round(r.monthly.careful * r.inputs.shape.steps[i].share) / 100));
    else expect(seed.spend.shape.steps.map((s) => s.perMonth)).toEqual(r.inputs.spend.steps.map((s) => s.perMonth));
    const couple = seed.household === 'couple';
    for (const p of seed.people) {
      // one row for each year the amount changes, in age order, neighbours never equal
      p.takeHome.forEach((row, i) => { if (i) { expect(row.fromAge).toBeGreaterThan(p.takeHome[i - 1].fromAge); expect(row.perMonth).not.toBe(p.takeHome[i - 1].perMonth); } });
      for (const y of r.byYear) {
        if (!couple) expect(rowAt(p.takeHome, y.ages.you).perMonth).toBe(Math.round(y.spend * 100) / 100);
      }
    }
    if (couple) {
      // the two parts add up to the household's figure every year the incomes it gets anyway are below it
      for (const y of r.byYear) {
        if (!(y.spend > y.takeHome - 0.01 && y.fromPots > 0)) continue;
        const sum = seed.people.reduce((t, p) => t + rowAt(p.takeHome, y.ages[p.who]).perMonth, 0);
        expect(Math.abs(sum - y.spend), `at ${y.age}`).toBeLessThanOrEqual(0.02);
      }
    }
  });
});

describe('K-SS2, K-SS3, K-SS4 — today\'s planner targets the answer\'s amount every year', () => {
  it.each(CASES)('%s %s', (q, _name, make) => {
    const r = make();
    const seed = seedOf(q, r);
    expect(checkSeed(seed, NOW_MS)).toEqual({ ok: true });
    const { yours, partner } = seedToScenario(seed, DAY);
    for (const [plan, p] of [[yours, seed.people[0]], ...(partner ? [[partner, seed.people[1]]] : [])]) {
      const S = plan.stressTool.settings;
      const compiled = compileSteps(S, S.shapeAgeNow);
      for (let y = 0; y <= S.duration; y++) {
        const age = S.shapeAgeNow + y;
        const row = rowAt(p.takeHome, age);
        const want = grossRow(row.perMonth);
        // K-SS2: today's compileSteps on the plan's steps is the year's before-tax figure, to the pound
        if (want > 0) expect(Math.abs((compiled ? compiled[y] : S.baseSalary) - want), `${p.who} at ${age}`).toBeLessThan(1);
        // K-SS3: and nets back to the answer's row within 50p a month
        if (row.perMonth > 0) expect(Math.abs(netMonthly(Math.round(targetAtAge(S, age))) - row.perMonth), `${p.who} at ${age}`).toBeLessThanOrEqual(0.5);
      }
      // K-SS4: the Stress save writes the compiled schedule floored and rounded; read back, the same figures within £1 a year
      if (compiled) {
        const saved = compiled.map((v) => Math.round(Math.max(0, v)));
        saved.forEach((v, y) => expect(Math.abs(v - amountAtAge(S.incomeSteps, S.shapeAgeNow + y, S.baseSalary || 0))).toBeLessThanOrEqual(1));
      }
      expect(JSON.parse(JSON.stringify(plan))).toEqual(plan);
    }
    // the description says what is spent, after tax, as it was tested
    expect(yours.planDetails.description).toMatch(/Spending, after tax at today's prices/);
  });

  it('T17 — V6 parity with V7\'s own engine: one person, today\'s per-year target IS the target V7\'s run is given, to the pound', () => {
    const r = answerC(C_FALLS, ENV);
    const seed = seedOf('c', r);
    const S = seedToScenario(seed, DAY).yours.stressTool.settings;
    const checked = checkInputs(SCHEMA_C, C_FALLS, ENV);
    const plan = enginePlan(toHouseholdC(checked.inputs, ENV).household, ENV);
    const [run] = configsAt(plan, r.monthly.careful * 12);
    const compiled = compileSteps(S, S.shapeAgeNow);
    let compared = 0;
    for (let y = 0; y < plan.years; y++) {
      const per = plan.periods.find((x) => x.from <= y && y < x.to);
      if (per.netTotal > r.byYear[y].spend * 12) continue;          // the State Pension pays more: today's floor, not the shape (T12)
      expect(Math.abs(compiled[y] - run.config.targetSchedule[y]), `year ${y}`).toBeLessThan(1);
      compared++;
    }
    expect(compared).toBeGreaterThan(20);
  });
});

describe('K-SS5 — compressSteps: the fewest of today\'s steps, exact', () => {
  const exact = (g, steps, ageNow) => g.forEach((v, y) => expect(Math.round(amountAtAge(steps, ageNow + y)), `year ${y}`).toBe(v));
  it('level stretches are one step each; an even move inside one tax band is one glide; across a band edge, two', () => {
    const level = [...Array(10).fill(30000), ...Array(10).fill(24000)];
    expect(compressSteps(level, 62)).toEqual([{ fromAge: 62, amount: 30000 }, { fromAge: 72, amount: 24000 }]);
    // after tax £30,000 → £24,000 evenly over 10 years: before tax, inside the basic rate band, exactly a straight line
    const net = Array.from({ length: 21 }, (_, y) => (y <= 10 ? 30000 - 600 * y : 24000));
    const g = net.map((n) => Math.round(grossUpAnnual(n)));
    const steps = compressSteps(g, 62);
    exact(g, steps, 62);
    expect(steps.length).toBeLessThanOrEqual(3);
    expect(steps[0].glideToNext).toBe(true);
  });

  it('a fall below the personal allowance (after tax is before tax) is one decline at its own rate; above it, one step a year', () => {
    const below = Array.from({ length: 15 }, (_, y) => Math.round(11000 * Math.pow(0.98, y)));
    const s1 = compressSteps(below, 70);
    exact(below, s1, 70);
    expect(s1.length).toBeLessThanOrEqual(2);
    expect(s1[0].decline).toBe(2);
    const above = Array.from({ length: 15 }, (_, y) => Math.round(grossUpAnnual(60000 * Math.pow(0.99, y))));
    const s2 = compressSteps(above, 62);
    exact(above, s2, 62);
  });

  // Review, 2 Oct 2026: saved from V7, a fall of 7.5% a year below the personal allowance reached today's planner as one
  // step whose slider stops at 5% — it showed 5% beside a label saying 7.5%, and touching it changed the fall. A fall is
  // written as one of today's steps only where today's own slider can show it and move it back (index.html, "Your income
  // shape": <input type=range min=0 max=5 step=0.25>); above that, one step a year, still exact.
  const slider = (() => {
    const html = readFileSync(join(process.cwd(), 'index.html'), 'utf8');
    const line = html.split('\n').find((l) => /type="range"/.test(l) && /updIncomeStep\(' \+ i \+ ',\\'decline\\'/.test(l));
    const m = line && line.match(/type="range" min="([\d.]+)" max="([\d.]+)" step="([\d.]+)"/);
    return m ? { min: Number(m[1]), max: Number(m[2]), step: Number(m[3]) } : null;
  })();
  const onSlider = (steps) => steps.filter((s) => s.decline !== undefined).forEach((s) => {
    expect(s.decline, JSON.stringify(s)).toBeGreaterThan(slider.min);
    expect(s.decline, JSON.stringify(s)).toBeLessThanOrEqual(slider.max);
    expect(Number.isInteger(s.decline / slider.step), JSON.stringify(s)).toBe(true);
  });

  it('today\'s fall slider is found in today\'s editor (0 to 5% a year, in quarter points), and compressSteps holds to it', () => {
    expect(slider).toEqual({ min: 0, max: 5, step: 0.25 });
    expect(PLANNER_DECLINE).toEqual({ step: slider.step, max: slider.max });
  });

  it('a fall faster than today\'s slider goes (7.5% a year, below the personal allowance) is one step a year, never a decline the slider cannot show — still exact', () => {
    const g = Array.from({ length: 12 }, (_, y) => Math.round(10800 * Math.pow(0.925, y)));
    const steps = compressSteps(g, 58);
    exact(g, steps, 58);
    onSlider(steps);
    expect(steps.some((s) => s.decline > slider.max)).toBe(false);
    // at today's slider's own top, 5% a year, one decline is still written
    const five = Array.from({ length: 12 }, (_, y) => Math.round(10800 * Math.pow(0.95, y)));
    const s5 = compressSteps(five, 58);
    exact(five, s5, 58);
    expect(s5[0].decline).toBe(5);
  });

  it('end to end: an answer of A falling 7.5% a year from the stop, each year under the personal allowance, makes a plan whose every fall fits today\'s slider (and every year is exact)', () => {
    const inputs = { you: { age: 55, pot: 200000 }, stop: { kind: 'age', age: 58 }, spend: { kind: 'amount', amount: 900, then: 'falls', fallsPct: 7.5, steps: [{ fromAge: 67, perMonth: 1100, then: 'level' }] } };
    const r = answerA(inputs, { ...ENV, detail: 'chart', ages: [58] });
    expect(r.status).toBe('ok');
    const seed = seedOf('a', r);
    const S = seedToScenario(seed, DAY).yours.stressTool.settings;
    onSlider(S.incomeSteps);
    const compiled = compileSteps(S, S.shapeAgeNow);
    for (let y = 0; y <= S.duration; y++) {
      const row = rowAt(seed.people[0].takeHome, S.shapeAgeNow + y);
      if (row.perMonth > 0) expect(Math.abs(compiled[y] - grossRow(row.perMonth)), `year ${y}`).toBeLessThan(1);
    }
  });

  it('random falls of 0.25% to 10% a year below the personal allowance: every decline written fits today\'s slider, and every year is exact', () => {
    let seed = 11;
    const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    for (let t = 0; t < 120; t++) {
      const d = (1 + Math.floor(rnd() * 40)) / 4;
      const base = 6000 + Math.floor(rnd() * 6500);
      const g = Array.from({ length: 5 + Math.floor(rnd() * 25) }, (_, y) => Math.round(base * Math.pow(1 - d / 100, y)));
      const steps = compressSteps(g, 60);
      exact(g, steps, 60);
      onSlider(steps);
    }
  });

  it('anything at all: always exact, never more steps than years (random rows)', () => {
    let seed = 7;
    const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    for (let t = 0; t < 200; t++) {
      const n = 1 + Math.floor(rnd() * 40);
      const g = Array.from({ length: n }, () => Math.round(1000 + rnd() * 80000));
      for (let k = 1; k < n; k++) if (rnd() < 0.5) g[k] = g[k - 1];
      const steps = compressSteps(g, 55);
      expect(steps.length).toBeLessThanOrEqual(n);
      exact(g, steps, 55);
    }
  });
});

describe('K-SS6 — who reads version 3', () => {
  it('today\'s planner reads 1, 2 and 3; a bad shape is refused; a planner that reads only 1 refuses 3', () => {
    expect(SEED_VERSIONS).toEqual([1, 2, 3]);
    const seed = seedOf('c', answerC(C_IN, ENV));
    expect(checkSeed(seed, NOW_MS)).toEqual({ ok: true });
    const bad = JSON.parse(JSON.stringify(seed));
    bad.spend.shape.steps[1].fromAge = 70;
    expect(checkSeed(bad, NOW_MS)).toMatchObject({ ok: false, problem: 'shape' });
    expect(frozenPlanner.checkSeed(seed, NOW_MS)).toMatchObject({ ok: false, problem: 'version' });
  });

  it('a flat answer\'s seed has no shape and one row per stretch, as before', () => {
    const { shape, ...flat } = C_IN;
    void shape;
    const seed = seedOf('c', answerC(flat, ENV));
    expect(seed.spend.shape).toBeUndefined();
    expect(seed.people[0].takeHome).toHaveLength(1);
    void netToGross;
  });
});
