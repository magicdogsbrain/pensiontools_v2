/**
 * Both sides of the contract together (research/v7/save-as-plan.md C.1–C.3): the seeds V7's own builder makes
 * (src/answers/keep/planSeed.js, buildPlanSeed) from the pinned answers of its named states are read by today's side
 * (src/services/PlanSeed.js) without a problem, and the plans made from them hold the "must hold" rules that do not
 * need a hand-written seed: no write on first open, the planner's start pot is the answer's, every take-home row nets
 * back from its target, and the plan is plain data.
 *
 * V7's side is built separately. While its builder or its named states are not there, this file says so and passes.
 */
import { describe, it, expect, vi } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

vi.mock('../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));

import { checkSeed, seedToScenario, targetAtAge, localDate, householdStartWords } from '../src/services/PlanSeed.js';
import { upgradeScenario } from '../src/firebase/scenarioMigration.js';
import { pinTiming, timingPinPatch, deriveTiming, taxYearStartOf } from '../src/services/PlanTiming.js';
import { createSimulationConfigFromSettings } from '../src/storage/StressRepository.js';
import { grossToNet } from '../src/services/TaxCalculator.js';
import { startOffset } from '../src/services/HouseholdService.js';
import * as frozenPlanner from './v7/keep/seed.v1/plannerSeed.js';
import * as frozenV7 from './v7/keep/seed.v1/v7Seed.js';
import { APART_ANSWERS, TODAY as APART_TODAY } from './v7/keep/apartAnswers.mjs';

const BUILDER = resolve(__dirname, '../src/answers/keep/planSeed.js');
const STATES_DIR = resolve(__dirname, 'v7/states');
const STATES = [
  ['c', 'answer-F1'], ['c', 'answer-F2'], ['c', 'answer-F3'], ['c', 'answer-paying-in'],
  ['a', 'answer-A1'], ['a', 'answer-A2-couple'], ['a', 'answer-A3-part-time'], ['a', 'answer-A4'], ['a', 'answer-stop-now'], ['a', 'answer-no'],
  ['b', 'answer-B1'], ['b', 'answer-B2-on-course'], ['b', 'answer-B4-before-57'], ['b', 'answer-B5-couple']
].filter(([q, f]) => existsSync(join(STATES_DIR, q, f + '.json')));
const READY = existsSync(BUILDER) && STATES.length > 0;

const ENV = { today: '2026-09-30', appVersion: '6.17.0' };
const AT = '2026-09-30T14:03:22.511Z';
const NOW_MS = Date.parse(AT) + 60000;
const net = (g) => grossToNet(g, 12570, 50270, 125140) / 12;

describe.skipIf(!READY)('V7\'s seeds, read and mapped by today\'s side', () => {
  let build = null;
  const seedOf = async (q, f, more = {}) => {
    if (!build) build = (await import('../src/answers/keep/planSeed.js')).buildPlanSeed;
    const result = JSON.parse(readFileSync(join(STATES_DIR, q, f + '.json'), 'utf8')).answers[q].result;
    return build({ source: q, result, env: ENV, name: { chosen: 'My try' }, createdAt: AT, ...more });
  };

  it.each(STATES)('%s %s', async (q, f) => {
    const seed = await seedOf(q, f);
    expect(seed, "V7 keeps every one of these answers (tests/v7/keep/planSeed.test.js)").not.toBeNull();
    expect(checkSeed(seed, NOW_MS)).toEqual({ ok: true });
    const { yours, partner } = seedToScenario(seed, new Date(2026, 8, 30, 15, 0));
    expect(!!partner).toBe(seed.household === 'couple');
    for (const [plan, p] of [[yours, seed.people[0]], ...(partner ? [[partner, seed.people[1]]] : [])]) {
      const S = plan.stressTool.settings;
      expect(upgradeScenario(plan).write).toBe(false);
      expect(timingPinPatch(S, pinTiming(S, plan.budgetTool.settings, localDate(seed.today)))).toBeNull();
      const cfg = createSimulationConfigFromSettings({}, S);
      const later = seed.stop.kind === 'later';
      expect(Math.abs(cfg.equityStart + cfg.bondStart + cfg.cashStart - (later ? p.pension.atStop.middling : p.pension.today))).toBeLessThanOrEqual(3);
      expect(Math.abs(cfg.isaBalance - (later ? p.savings.atStop.middling : p.savings.today))).toBeLessThanOrEqual(3);
      for (const row of p.takeHome) {
        const age = row === p.takeHome[0] ? S.shapeAgeNow : row.fromAge;
        expect(Math.abs(net(targetAtAge(S, age)) - row.perMonth), 'row from ' + row.fromAge).toBeLessThanOrEqual(0.5);
      }
      expect(JSON.parse(JSON.stringify(plan))).toEqual(plan);
      expect(plan.stressTool.settings.taggedFunds).toEqual([]);
      expect(plan.decisionTool.history).toEqual([]);
    }
  });
});

describe.skipIf(!READY)('stopping in the same year: V7\'s version 2 seed makes the plans 6.19.0 made from its version 1 seed (frozen seed.v1/)', () => {
  it.each(STATES)('%s %s', async (q, f) => {
    const { buildPlanSeed } = await import('../src/answers/keep/planSeed.js');
    const result = JSON.parse(readFileSync(join(STATES_DIR, q, f + '.json'), 'utf8')).answers[q].result;
    const args = { source: q, result, env: ENV, name: { chosen: 'My try' }, createdAt: AT };
    const v2 = buildPlanSeed(args), v1 = frozenV7.buildPlanSeed(args);
    const day = new Date(2026, 8, 30, 15, 0);
    const now = seedToScenario(v2, day), then = frozenPlanner.seedToScenario(v1, day);
    for (const k of ['yours', 'partner']) {
      if (!then[k]) { expect(now[k]).toBeNull(); continue; }
      const { fromAnswer: a, ...restNow } = now[k];
      const { fromAnswer: b, ...restThen } = then[k];
      // 6.22.0 adds one thing: what goes into savings each month, in the planner's own box (isaMonthly), where 6.19.0 kept
      // it in the record only. It is the seed's own figure; with it taken away the plan is 6.19.0's, byte for byte.
      const acc = restNow.accumulationTool && restNow.accumulationTool.settings;
      if (acc && 'isaMonthly' in acc) {
        expect(acc.isaMonthly, k).toBe(a.people[0].payIn.savingsIn);
        expect(acc.isaMonthly, k).toBeGreaterThan(0);
        delete acc.isaMonthly;
      }
      // The review of 6.22.0 changes one more, for someone with no savings today but savings at the stop: today's £0 is
      // written as it is, where 6.19.0 wrote the savings at the stop in its place (the new readers that add what goes in
      // each month counted it twice). The savings at the stop are still the ISA at retirement, and the runs start from the
      // very same ISA (PlanTiming.isaAtRetirementOf). With that put back the plan is 6.19.0's, byte for byte.
      const Sn = restNow.stressTool.settings, St = restThen.stressTool.settings;
      if (Sn.isaBalance !== St.isaBalance) {
        expect([Sn.isaBalance, a.people[0].savings.today], k).toEqual([0, 0]);
        expect(St.isaBalance, k).toBe(Sn.potAtRetirement.isa);
        expect(St.isaBalance, k).toBeGreaterThan(0);
        expect(createSimulationConfigFromSettings({}, Sn).isaBalance, k).toBe(createSimulationConfigFromSettings({}, St).isaBalance);
        Sn.isaBalance = St.isaBalance;
      }
      expect(JSON.stringify(restNow), k).toBe(JSON.stringify(restThen));
      // the record differs only by the version 2 keys
      const strip = (x) => { const c = JSON.parse(JSON.stringify(x)); c.seedVersion = 1; delete c.untilBothStop; for (const p of c.people) { delete p.stop; delete p.years; } return c; };
      expect(JSON.stringify(strip(a))).toBe(JSON.stringify(b));
    }
    // the Household tab says nothing about one plan beginning later
    if (now.partner) {
      const clock = localDate(v2.today);
      expect(householdStartWords({ offset: startOffset(now.yours.stressTool.settings, clock) }, { offset: startOffset(now.partner.stressTool.settings, clock) })).toBe('');
    }
  });
});

describe('stopping in different years: V7\'s own version 2 seeds, read and mapped by today\'s side (K1, K2)', () => {
  const NOW = Date.parse(AT) + 60000;
  it.each(Object.keys(APART_ANSWERS))('%s', async (name) => {
    const { buildPlanSeed } = await import('../src/answers/keep/planSeed.js');
    const [q, make] = APART_ANSWERS[name];
    const seed = buildPlanSeed({ source: q, result: make(), env: { today: APART_TODAY, appVersion: '6.20.0' }, name: { chosen: 'Our try' }, createdAt: AT });
    expect(checkSeed(seed, NOW)).toEqual({ ok: true });
    // a planner that reads only version 1 refuses it, rather than make wrong plans
    expect(frozenPlanner.checkSeed(seed, NOW)).toMatchObject({ ok: false, problem: 'version' });
    const today = localDate(seed.today);
    const { yours, partner } = seedToScenario(seed, new Date(2026, 8, 30, 15, 0));
    const plans = [[yours, seed.people[0]], [partner, seed.people[1]]];
    const ends = [];
    for (const [plan, p] of plans) {
      const S = plan.stressTool.settings;
      expect(upgradeScenario(plan).write).toBe(false);
      expect(timingPinPatch(S, pinTiming(S, plan.budgetTool.settings, today))).toBeNull();
      // each plan starts at its own person's stop
      expect(S.firstTaxYear, p.who).toBe(taxYearStartOf(today) + p.stop.yearsFromNow);
      expect(deriveTiming(S, today).firstTaxYear).toBe(S.firstTaxYear);
      expect(S.retired).toBe(p.stop.kind === 'now');
      expect(S.duration).toBe(p.years);
      ends.push(S.firstTaxYear + S.duration);
      const cfg = createSimulationConfigFromSettings({}, S);
      const later = p.stop.kind === 'later';
      expect(Math.abs(cfg.equityStart + cfg.bondStart + cfg.cashStart - (later ? p.pension.atStop.middling : p.pension.today))).toBeLessThanOrEqual(3);
      expect(Math.abs(cfg.isaBalance - (later ? p.savings.atStop.middling : p.savings.today))).toBeLessThanOrEqual(3);
      for (const row of p.takeHome) {
        const age = row === p.takeHome[0] ? S.shapeAgeNow : row.fromAge;
        if (row.perMonth > 0) expect(Math.abs(net(targetAtAge(S, age)) - row.perMonth), p.who + ' from ' + row.fromAge).toBeLessThanOrEqual(0.5);
      }
      expect(JSON.parse(JSON.stringify(plan))).toEqual(plan);
      expect(plan.budgetTool.settings.retired).toBe(p.stop.kind === 'now');
    }
    // both end in the same tax year (K2)
    expect(ends[0]).toBe(ends[1]);
    // the Household tab lines the plans up by their starts, and says which begins later
    const offA = startOffset(yours.stressTool.settings, today), offB = startOffset(partner.stressTool.settings, today);
    expect(Math.abs(offA - offB)).toBe(Math.abs(seed.people[0].stop.yearsFromNow - seed.people[1].stop.yearsFromNow));
    const words = householdStartWords({ offset: offA, firstTaxYear: yours.stressTool.settings.firstTaxYear }, { offset: offB, firstTaxYear: partner.stressTool.settings.firstTaxYear });
    expect(words).toMatch(offB > offA ? /^Your partner's plan begins in \d{4}\/\d{2}, when they stop work\./ : /^This plan begins in \d{4}\/\d{2}, when you stop work\./);
  });
});

/*
 * Two hand-made plans (not from a V7 seed, which gives both one currentAgeAsOf) that begin in the SAME tax year, their
 * ages typed on different dates: startOffset rounds currentAgeNow, which does not follow the birthday, so the offsets can
 * come out 2 and 1 (the reviewers' finding, 2 Oct 2026: 409 of 864 such pairs drew "This plan begins in 2027/28…", new
 * words in a tab that said nothing in 6.19.0). The line is read from the plans' own first tax years.
 */
describe('the Household tab\'s line: two plans that begin in the same tax year say nothing (H1)', () => {
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const clock = new Date(2026, 9, 2, 12, 0);
  const plan = (age, asOf, spMonth, retireAge) => ({ currentAge: age, currentAgeAsOf: asOf, spStartDate: `10 ${MONTHS[spMonth]} ${2026 + (67 - age)}`, retired: false, retireAge });
  const words = (a, b) => householdStartWords({ offset: startOffset({ ...a, shapeAgeNow: deriveTiming(a, clock).shapeAgeNow }, clock), firstTaxYear: deriveTiming(a, clock).firstTaxYear },
    { offset: startOffset({ ...b, shapeAgeNow: deriveTiming(b, clock).shapeAgeNow }, clock), firstTaxYear: deriveTiming(b, clock).firstTaxYear });

  it('the reviewers\' pair: 59 (typed in June) retiring at 61 and 57 (typed in February) at 59 — both begin in 2027/28', () => {
    const a = plan(59, '2026-06-10', 0, 61);
    const b = plan(57, '2026-02-14', 0, 59);
    expect(deriveTiming(a, clock).firstTaxYear).toBe(2027);
    expect(deriveTiming(b, clock).firstTaxYear).toBe(2027);
    expect(words(a, b)).toBe('');
  });

  it('every birth month and typing date, retire ages put in one tax year: no line; a year apart: the later plan is named', () => {
    let same = 0, apart = 0;
    for (let m1 = 0; m1 < 12; m1++) for (let m2 = 0; m2 < 12; m2++) for (const asOf1 of ['2026-01-20', '2026-06-10', '2026-09-25']) for (const asOf2 of ['2026-02-14', '2026-08-01']) {
      const a = plan(59, asOf1, m1, 61);
      const fa = deriveTiming(a, clock).firstTaxYear;
      for (const r of [58, 59, 60, 61]) {
        const b = plan(57, asOf2, m2, r);
        const fb = deriveTiming(b, clock).firstTaxYear;
        const w = words(a, b);
        if (fb === fa) { expect(w, JSON.stringify([a, b])).toBe(''); same++; }
        else { expect(w).toMatch(fb > fa ? /^Your partner's plan begins in \d{4}\/\d{2}, when they stop work\./ : /^This plan begins in \d{4}\/\d{2}, when you stop work\./); apart++; }
      }
    }
    expect(same).toBeGreaterThan(100);
    expect(apart).toBeGreaterThan(100);
  });

  it('without both first tax years it falls back to the offsets, as before', () => {
    expect(householdStartWords({ offset: 0 }, { offset: 1 })).toMatch(/^Your partner's plan begins later/);
    expect(householdStartWords({ offset: 2 }, { offset: 0 })).toMatch(/^This plan begins later/);
    expect(householdStartWords({ offset: 1 }, { offset: 1 })).toBe('');
  });
});

describe.skipIf(READY)('V7\'s seed builder', () => {
  it('is not here yet: the cross-check waits for src/answers/keep/planSeed.js and the named states', () => {
    expect(READY).toBe(false);
  });
});
