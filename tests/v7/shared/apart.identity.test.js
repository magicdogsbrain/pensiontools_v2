/**
 * Couples who stop work in different years (research/v7/couples-different-years.md 9.1): today, bit for bit — and the
 * new pieces of the engine each equal to something already trusted.
 *
 *   I4  Same-year households (singles too, I9) through the new code give enginePlan, configsAt, breakdownAt, the stop
 *       plan (kernels, pots, the drawing plan) and every result run on it — verdicts, bands, phases, the pot needed, the
 *       one test at other pay-ins — that deep-equal the FROZEN copy of 6.19.0's adapter (sameYear.v1/), over random
 *       households, at charges of 0, 0.5 and others. The C path (enginePlan without options) likewise.
 *   I2  A partner's stop given as "their age + S" is the household of not answering, figure for figure.
 *   I3  C from now with the partner "already stopped" is C from now with the question not answered.
 *   I5  A joining run (offset g) is the stand-alone run at its own stop: simulateFastFrom(config, prepareFutureFrom(life,
 *       12·S_j, D − g)), with failMonth + 12g.
 *   I6  A run with cover months none of which is short is the same run without them, bit for bit.
 *   I7  The hand-over hook changes nothing but the targets: a joined run equals the same run with the schedule the hook
 *       returned written in beforehand, bit for bit.
 *   I8  The years after the second stop are a chain of `simulate` (tests/v7/saving/chainJoin.mjs): exact with an
 *       all-shares mix and the tax-free part already taken — up to the first run-out after the join, where the pass-on
 *       happens (the chain is today's fixed shares; from that month the other's money pays all).
 *   I10 The pass-on (the engine's call of 2 Oct 2026, couples-different-years.md 4.3 f): the household runs out at the
 *       later of the two run-outs; a run resumed from its record equals the run from the start with the hand-over and the
 *       pass-on as two hooks, bit for bit; hooks that change nothing, a record and a resume change nothing.
 *
 * The frozen copy is today's adapter as it stood at 6.19.0 (commit 458af7f); `speed.identity` (the fast path against
 * `simulate`) is unchanged and still runs on its own.
 */
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import * as live from '../saving/_saving.js';
import { saver } from '../saving/invariants.js';
import { chainJoin } from '../saving/chainJoin.mjs';
import { apart, SHARES as ALL_SHARES } from './apart.mjs';
import * as frozenEngine from './sameYear.v1/toEngine.js';
import * as frozenStop from './sameYear.v1/stopAt.js';
import * as frozenSaving from './sameYear.v1/saving.js';
import * as frozenFast from './sameYear.v1/fastEngine.js';
import * as frozenBand from './sameYear.v1/band.js';
import { stopsOf } from '../../../src/answers/shared/household.js';
import { joinAt, passOnAt } from '../../../src/answers/shared/toEngine.js';
import { arbitraryInputs } from '../gen/arbitrary.mjs';
import { SCHEMA_A } from '../../../src/answers/a/schema.js';
import { SCHEMA_B } from '../../../src/answers/b/schema.js';
import { toHousehold as toHouseholdA } from '../../../src/answers/a/toHousehold.js';
import { toHousehold as toHouseholdB } from '../../../src/answers/b/toHousehold.js';
import { toHousehold as toHouseholdC } from '../../../src/answers/c/toHousehold.js';
import { checkInputs } from '../../../src/answers/shared/validate.js';
import { SCHEMA_C } from '../../../src/answers/c/schema.js';

const { TEST_ENV } = live;
const TODAY = TEST_ENV.today;
const SEED = 20261001;
const close = (a, b) => Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

/** Whether a household's people all stop in the same year (today's case). */
const sameYear = (h) => new Set(stopsOf(h, TODAY).map((s) => s.S)).size <= 1;
/** "Your" stop age in a household: the age at which the first person stops. */
const youStop = (h) => h.people[0].age + stopsOf(h, TODAY)[0].S;

/** Random same-year saver households: singles and couples, pots, pay-ins, locked pensions, part-time work, a final-salary pension, charges. */
const saverArb = fc.record({
  age: fc.integer({ min: 30, max: 66 }), gap: fc.integer({ min: 0, max: 20 }),
  pot: fc.constantFrom(0, 1, 30_000, 150_000, 600_000), isa: fc.constantFrom(0, 20_000, 90_000),
  payIn: fc.constantFrom(0, 250, 900), savingsIn: fc.constantFrom(0, 300),
  risk: fc.constantFrom('cautious', 'balanced', 'adventurous'), savingRisk: fc.constantFrom('cautious', 'balanced', 'adventurous'),
  charge: fc.constantFrom(0, 0.005, 0.0005, 0.0135, 0.03),
  work: fc.option(fc.record({ yearly: fc.constantFrom(12_000, 30_000), years: fc.integer({ min: 1, max: 6 }) }), { freq: 3 }),
  fs: fc.option(fc.record({ yearly: fc.constantFrom(6_000, 15_000), fromAge: fc.constantFrom(55, 60, 65) }), { freq: 4 }),
  partner: fc.option(fc.record({ age: fc.integer({ min: 30, max: 66 }), pot: fc.constantFrom(0, 50_000, 400_000), isa: fc.constantFrom(0, 30_000), payIn: fc.constantFrom(0, 400) }), { freq: 2 }),
  endAge: fc.constantFrom(90, 95, 100)
}).map((k) => {
  const stopAge = Math.min(75, k.age + k.gap);
  return saver({ age: k.age, pot: k.pot, isa: k.isa, payIn: k.payIn, savingsIn: k.savingsIn, stopAge, risk: k.risk, savingRisk: k.savingRisk, charge: k.charge, work: k.work, finalSalary: k.fs, partner: k.partner, endAge: k.endAge });
});

/**
 * A household without how its savings grow (6.22.0): every form's household says it ("Mostly cash" unless chosen), which
 * 6.19.0 never read — a change of its own, tested in isaGrowth.test.js and isaGrowthSetting.test.js. The identity here
 * is the code of stopping apart, so it compares the household without the choice (the engines' fixed rate, as 6.19.0).
 */
const noChoice = (h) => { const { isaGrowth, ...rest } = h; void isaGrowth; return rest; };

/** Same-year households made by A's and B's own mappings from random inputs (the new questions answered or not). */
function questionHouseholds(count) {
  const out = [];
  for (const [schema, map] of [[SCHEMA_A, toHouseholdA], [SCHEMA_B, toHouseholdB]]) {
    for (const inputs of fc.sample(arbitraryInputs(schema, TEST_ENV), { seed: SEED, numRuns: count })) {
      let h;
      try { h = noChoice(map(inputs, TEST_ENV).household); } catch { continue; }
      if (sameYear(h) && live.validateHousehold(h, TODAY).length === 0) out.push(h);
    }
  }
  return out;
}

/** The stop plan's figures (everything but the functions), for comparing two of them. */
const spFigures = (sp) => ({
  S: sp.S, D: sp.D, T: sp.T, stopAge: sp.stopAge, n: sp.n, kernelPasses: sp.kernelPasses,
  kernels: sp.kernels, pots: sp.pots, maxes: sp.maxes, middling: sp.middling, split: sp.split,
  plan: JSON.parse(JSON.stringify(sp.plan)), saving: JSON.parse(JSON.stringify(sp.saving))
});
const bandFigures = (b) => ({ k: b.k, fails: b.fails, monthly: b.monthly, yearly: b.yearly, lastedAt: b.lastedAt, runOutAgeAt: b.runOutAgeAt, runOutMonths: b.runOutMonths, engineRuns: b.engineRuns, evaluations: b.evaluations });

/** Everything the stop plan gives, through the new code and through the frozen copy, at a few spends: deep-equal. */
function compareStop(h, env, { deep = false } = {}) {
  const stopAge = youStop(h);
  const a = live.stopAtPlan(h, stopAge, env);
  const b = frozenStop.stopAtPlan(h, stopAge, env);
  expect(spFigures(a)).toEqual(spFigures(b));
  const ra = live.createStopRunner(a);
  const rb = frozenStop.createStopRunner(b);
  for (const H of [6_000, 24_000, 48_000]) {
    expect(live.verdictAt(a, ra, H)).toEqual(frozenStop.verdictAt(b, rb, H));
    for (let i = 0; i < a.n; i += 3) {
      const ca = ra.configsAtH(H, i);
      const cb = rb.configsAtH(H, i);
      expect(same(ca, cb)).toBe(true);
      ca.forEach((entry, r) => expect(ra.run(r, i, entry.config)).toEqual(rb.run(r, i, cb[r].config)));
    }
    expect(live.phasesAt(a, H)).toEqual(frozenStop.phasesAt(b, H));
    expect(live.breakdownAt(a.plan, H, a.potsOf(0))).toEqual(frozenEngine.breakdownAt(b.plan, H, b.potsOf(0)));
  }
  const band = live.bandAt(a, live.createStopRunner(a));
  expect(bandFigures(band)).toEqual(bandFigures(frozenStop.bandAt(b, frozenStop.createStopRunner(b))));
  expect(live.phasesAt(a, band.monthly.careful * 12)).toEqual(frozenStop.phasesAt(b, band.monthly.careful * 12));
  if (deep) {
    const allowed = Math.floor(a.n / 10);
    const H = Math.max(12_000, band.monthly.middling * 12);
    expect(live.potNeeded(a, ra, H, allowed)).toBe(frozenStop.potNeeded(b, rb, H, allowed));
    expect(live.potNeededAt(a, H, [allowed, Math.floor(a.n / 2)])).toEqual(frozenStop.potNeededAt(b, H, [allowed, Math.floor(b.n / 2)]));
    const payIns = a.saving.people.map((p) => ({ pension: p.payIn.total + 200, savings: p.payIn.savings + 50 }));
    expect(live.verdictAtPayIns(a, H, payIns)).toEqual(frozenStop.verdictAtPayIns(b, H, payIns));
    expect(live.savingsNeeded(a, H, 0, 20_000)).toBe(frozenStop.savingsNeeded(b, H, 0, 20_000));
    for (const [j, p] of a.saving.people.entries()) {
      expect(live.savingRows(a.saving, p, a.lives[1])).toEqual(frozenSaving.savingRows(b.saving, b.saving.people[j], b.lives[1]));
    }
  }
  return a;
}

describe('I4 and I9: a same-year household through the new code is 6.19.0\'s, bit for bit', () => {
  it('60 random saver households (singles and couples; locked pensions, part-time work, final-salary pensions; charges 0, 0.05, 0.5, 1.35, 3%): the stop plan and every result on it', () => {
    const env = { ...TEST_ENV, futures: 8 };
    let couples = 0, singles = 0, locked = 0;
    for (const h of fc.sample(saverArb, { seed: SEED, numRuns: 60 })) {
      if (live.validateHousehold(h, TODAY).length) continue;
      const sp = compareStop(h, env);
      if (h.people.length > 1) couples++; else singles++;
      if (sp.plan.lockedUntil.length) locked++;
    }
    expect(couples).toBeGreaterThan(10);
    expect(singles).toBeGreaterThan(10);
    expect(locked).toBeGreaterThan(3);
  }, 120_000);

  it('the pot needed, the one test at other pay-ins, the savings that carry closed years and the saving rows (a few households, in full)', () => {
    const env = { ...TEST_ENV, futures: 10 };
    for (const h of [
      saver({ age: 45, pot: 120_000, payIn: 625, stopAge: 60 }),
      saver({ age: 50, pot: 50_000, isa: 80_000, payIn: 400, stopAge: 55, charge: 0 }),
      saver({ age: 40, pot: 200_000, payIn: 800, stopAge: 60, partner: { age: 42, pot: 60_000, payIn: 300 } }),
      saver({ age: 52, pot: 300_000, isa: 20_000, payIn: 300, stopAge: 54, partner: { age: 49, pot: 100_000, isa: 40_000, payIn: 500 }, charge: 0.005 })
    ]) compareStop(h, env, { deep: true });
  }, 120_000);

  it('households from A\'s and B\'s own mappings (random inputs, the new questions answered or not), whenever the two stop in the same year', () => {
    const env = { ...TEST_ENV, futures: 6 };
    const households = questionHouseholds(30);
    expect(households.length).toBeGreaterThan(20);
    expect(households.filter((h) => h.people.length > 1).length).toBeGreaterThan(5);
    for (const h of households) compareStop(h, env);
  }, 120_000);

  it('a stop age other than the household\'s own (A\'s rows, the tests): every person moves to it, as before', () => {
    const lives = live.livesList(10, 60, TEST_ENV);
    const h = saver({ age: 40, pot: 50_000, payIn: 400, stopAge: 60, partner: { age: 44, pot: 30_000, payIn: 200 } });
    for (const stopAge of [58, 62]) {
      const a = live.stopAtPlan(h, stopAge, TEST_ENV, lives);
      const b = frozenStop.stopAtPlan(h, stopAge, TEST_ENV, lives);
      expect(spFigures(a)).toEqual(spFigures(b));
    }
  });

  it('the C path (enginePlan without options): the plan, the configs, the breakdown and the band, for random C households', () => {
    const env = { today: TODAY, seed: 0 };
    let compared = 0;
    for (const inputs of fc.sample(arbitraryInputs(SCHEMA_C, env), { seed: SEED, numRuns: 50 })) {
      const checked = checkInputs(SCHEMA_C, inputs, env);
      if (!checked.ok) continue;
      const household = noChoice(toHouseholdC(checked.inputs, env).household);
      if (!sameYear(household)) continue;
      const a = live.enginePlan(household, env);
      const b = frozenEngine.enginePlan(household, env);
      expect(same(a, b)).toBe(true);
      for (const H of [0, 12_000, 30_000, 90_000]) {
        expect(same(live.configsAt(a, H), frozenEngine.configsAt(b, H))).toBe(true);
        expect(live.breakdownAt(a, H)).toEqual(frozenEngine.breakdownAt(b, H));
      }
      if (a.totalPots > 0) {
        const futures = live.futuresList(6, a.years, env);
        const sa = live.createBandSolver(a, futures).solve();
        const sb = frozenBand.createBandSolver(b, futures, { runner: frozenFast.createFastRunner(b, futures) }).solve();
        expect(sa).toEqual(sb);
      }
      compared++;
    }
    expect(compared).toBeGreaterThan(25);
  }, 60_000);

  it('a stop plan\'s configs are covered by the fast path, and the asGiven plan is 6.19.0\'s for every same-year household (charges 0 and 0.5)', () => {
    for (const charge of [0, 0.005]) {
      const h = saver({ age: 55, pot: 400_000, isa: 30_000, stopAge: 55, charge, partner: { age: 53, pot: 100_000 } });
      const a = live.enginePlan(h, TEST_ENV, { start: 'asGiven', pots: 'perFuture' });
      const b = frozenEngine.enginePlan(h, TEST_ENV, { start: 'asGiven', pots: 'perFuture' });
      expect(same(a, b)).toBe(true);
      for (const run of a.runs) expect(live.fastEligible(run.base)).toBe(true);
      expect('apart' in a).toBe(false);
    }
  });
});

describe('I2 and I3: two routes to one household', () => {
  it('I2: A\'s partner stopping at "their age + S" is the household (and the stop plan) of not answering', () => {
    const base = {
      household: 'couple', you: { age: 52, pot: 220_000, payIn: { has: 'yes', kind: 'total', total: 500 }, statePension: { kind: 'full' }, finalSalary: { has: false } },
      partner: { age: 49, pot: 90_000, payIn: { has: 'yes', kind: 'total', total: 300 }, statePension: { kind: 'full' }, finalSalary: { has: false } },
      savings: 30_000, stop: { kind: 'age', age: 60 }, spend: { kind: 'amount', amount: 2_800 }
    };
    const a = checkInputs(SCHEMA_A, base, TEST_ENV);
    const b = checkInputs(SCHEMA_A, { ...base, partner: { ...base.partner, stop: { kind: 'age', age: 49 + 8 } } }, TEST_ENV);
    expect(a.ok && b.ok).toBe(true);
    const ha = toHouseholdA(a.inputs, TEST_ENV).household;
    const hb = toHouseholdA(b.inputs, TEST_ENV).household;
    expect(hb).toEqual(ha);
    const env = { ...TEST_ENV, futures: 8 };
    const sa = live.stopAtPlan(ha, 60, env);
    const sb = live.stopAtPlan(hb, 60, env);
    expect(spFigures(sb)).toEqual(spFigures(sa));
    expect(live.bandAt(sb).monthly).toEqual(live.bandAt(sa).monthly);
  });

  it('I3: C from now with the partner "already stopped" is the household of not answering, and the same plan', () => {
    const base = { household: 'couple', you: { pot: 180_000, age: 63 }, partner: { pot: 90_000, age: 61 }, savings: 20_000, start: { kind: 'now' } };
    const a = checkInputs(SCHEMA_C, base, TEST_ENV);
    const b = checkInputs(SCHEMA_C, { ...base, partner: { ...base.partner, stop: { kind: 'already' } } }, TEST_ENV);
    expect(a.ok && b.ok).toBe(true);
    const ha = toHouseholdC(a.inputs, TEST_ENV).household;
    const hb = toHouseholdC(b.inputs, TEST_ENV).household;
    expect(hb).toEqual(ha);
    expect(same(live.enginePlan(hb, TEST_ENV), live.enginePlan(ha, TEST_ENV))).toBe(true);
  });
});

// ---- the new pieces, each equal to something already trusted --------------------------------------------------------

describe('I5: a joining run is the stand-alone run at its own stop', () => {
  it('only the later stopper has money: the stop runner\'s run is simulateFastFrom at their own stop, failMonth + 12g', () => {
    const env = { ...TEST_ENV, futures: 12 };
    // the partner stopped years ago and has nothing but a State Pension; you stop at 60 with a pot
    const h = apart({ you: { age: 55, pot: 300_000, isa: 20_000, payIn: 600, stop: 60 }, partner: { age: 61, stop: 'already' }, payCovers: 1 });
    const sp = live.stopAtPlan(h, 60, env);
    expect(sp.plan.apart.years).toBe(5);
    expect(sp.plan.runs).toHaveLength(1);
    expect(sp.plan.runs[0].offset).toBe(5);
    const runner = live.createStopRunner(sp);
    let failed = 0, lasted = 0;
    for (const H of [20_000, 32_000, 45_000]) {
      for (let i = 0; i < sp.n; i++) {
        const entries = runner.configsAtH(H, i);
        const r = entries.findIndex((e) => e.role !== 'unpaid');
        const config = entries[r].config;
        const pf = live.prepareFutureFrom(sp.lives[i], 12 * (sp.S + 5), sp.D - 5);
        const pots = sp.potsOf(i)[0];
        const alone = live.simulateFastFrom({ ...config, equityStart: pots.pension * sp.plan.mix.equity, bondStart: pots.pension * sp.plan.mix.bond, cashStart: pots.pension * sp.plan.mix.cash,
          equityMin: pots.pension * sp.plan.mix.equity, bondMin: pots.pension * sp.plan.mix.bond, cashTarget: pots.pension * sp.plan.mix.cash, isaBalance: pots.isa }, pf);
        const got = runner.run(r, i, config);
        expect(got.failed).toBe(alone.failed);
        expect(got.failMonth).toBe(alone.failed ? alone.failMonth + 60 : null);
        if (got.failed) failed++; else lasted++;
      }
    }
    expect(failed).toBeGreaterThan(0);
    expect(lasted).toBeGreaterThan(0);
  });

  it('both have money: the joiner\'s part of a joined run is simulateFastFrom on the config the hand-over made, at their own stop', () => {
    const env = { ...TEST_ENV, futures: 10 };
    const h = apart({ you: { age: 55, pot: 250_000, payIn: 500, stop: 59 }, partner: { age: 59, pot: 180_000, isa: 15_000, stop: 'already' } });
    const sp = live.stopAtPlan(h, 59, env);
    const runner = live.createStopRunner(sp, sp.lives, sp.kernels, { parts: true });
    const G = sp.plan.apart.years;
    const join = sp.plan.runs.findIndex((r) => r.offset > 0);
    let compared = 0, handed = 0;
    for (const H of [24_000, 36_000, 48_000]) {
      for (let i = 0; i < sp.n; i++) {
        const [entry] = runner.configsAtH(H, i);
        expect(entry.role).toBe('joined');
        const got = runner.run(0, i, entry.config);
        const { first, join: part } = got.parts;
        if (first.failed && first.failMonth < 12 * G) { expect(part).toBe(null); continue; }
        const pfJ = live.prepareFutureFrom(sp.lives[i], 12 * (sp.S + G), sp.D - G);
        // the first stopper's money ran out after the join: from that month the joiner pays all (the pass-on hook)
        const hook = first.failed ? { month: first.failMonth - 12 * G, retarget: () => passOnAt(sp.plan, H, join, first.failMonth, part.config) } : null;
        const alone = live.simulateFastFrom(part.config, pfJ, hook ? { hook } : {});
        expect([part.failed, part.failMonth]).toEqual([alone.failed, alone.failMonth]);
        expect(part.equity).toBe(alone.equity);
        expect(part.isa).toBe(alone.isa);
        if (hook) handed++;
        compared++;
      }
    }
    expect(compared).toBeGreaterThan(10);
    expect(handed).toBeGreaterThan(0);
  });
});

describe('I6: cover months that are never short change nothing', () => {
  it('a run with coverMonths > 0 and no short month equals the same run without them, bit for bit (C configs, every charge)', () => {
    const env = { today: TODAY, seed: 0 };
    let compared = 0;
    for (const charge of [0, 0.005]) {
      const h = saver({ age: 62, pot: 400_000, isa: 50_000, stopAge: 62, charge, partner: { age: 60, pot: 150_000 } });
      const plan = live.enginePlan(h, env);
      const futures = live.futuresList(15, plan.years, env);
      for (const H of [15_000, 25_000]) {
        for (const { config } of live.configsAt(plan, H)) {
          for (const cover of [12, 60, 12 * plan.years]) {
            const covered = { ...config, coverMonths: cover };
            expect(live.fastEligible(covered)).toBe(true);
            for (const f of futures) {
              const a = live.simulateFast(config, f);
              const b = live.simulateFast(covered, f);
              if (b.coveredFrom !== null) continue;          // a short month in the cover: not this test's case
              expect({ ...b, coveredFrom: undefined }).toEqual({ ...a, coveredFrom: undefined });
              compared++;
            }
          }
        }
      }
    }
    expect(compared).toBeGreaterThan(200);
  });

  it('a short month inside the cover is not a run-out: the pots go to nothing and the run carries on; after the cover it is', () => {
    const env = { today: TODAY, seed: 0 };
    const h = saver({ age: 62, pot: 60_000, stopAge: 62 });
    const plan = live.enginePlan(h, env);
    const futures = live.futuresList(5, plan.years, env);
    const [{ config }] = live.configsAt(plan, 40_000);
    for (const f of futures) {
      const plain = live.simulateFast(config, f);
      expect(plain.failed).toBe(true);
      const all = live.simulateFast({ ...config, coverMonths: 12 * plan.years }, f);
      expect(all.failed).toBe(false);
      expect(all.coveredFrom).toBe(plain.failMonth);
      const part = live.simulateFast({ ...config, coverMonths: plain.failMonth + 24 }, f);
      expect(part.failed).toBe(true);
      expect(part.failMonth).toBe(plain.failMonth + 24);        // the first month after the cover: the pots are empty
    }
  });
});

describe('I7: the hand-over changes nothing but the targets', () => {
  it('a joined first run equals the same run with the hand-over\'s schedule written in beforehand, bit for bit', () => {
    const env = { ...TEST_ENV, futures: 10 };
    for (const [h, stopAge] of [
      // you stop later, the partner has stopped; you stop later than a partner who stops at 54 (None); the partner stops
      // first, at 54 with a closed pension, and you at 61 (All); you stop first and the partner later (the partner is asked)
      [apart({ you: { age: 55, pot: 250_000, payIn: 500, stop: 59 }, partner: { age: 59, pot: 180_000, isa: 15_000, stop: 'already' } }), 59],
      [apart({ you: { age: 50, pot: 150_000, isa: 40_000, payIn: 700, stop: 56 }, partner: { age: 52, pot: 400_000, isa: 90_000, payIn: 300, stop: 54 }, payCovers: 0 }), 56],
      [apart({ you: { age: 57, pot: 90_000, payIn: 300, stop: 61 }, partner: { age: 54, pot: 300_000, isa: 5_000, stop: 'already' }, payCovers: 1 }), 61],
      [apart({ you: { age: 60, pot: 320_000, isa: 25_000, stop: 'already' }, partner: { age: 56, pot: 140_000, payIn: 450, stop: 58 } }), 58]
    ]) {
      const sp = live.stopAtPlan(h, stopAge, env);
      const runner = live.createStopRunner(sp);
      const plan = sp.plan;
      const G = plan.apart.years;
      let compared = 0;
      for (const H of [18_000, 30_000, 42_000]) {
        for (let i = 0; i < sp.n; i++) {
          const [entry] = runner.configsAtH(H, i);
          expect(entry.role).toBe('joined');
          const { first } = entry.config.joined;
          const firstRun = plan.runs[first];
          const pfF = sp.driversFor(i, 0);
          const pots = sp.potsOf(i)[firstRun.index];
          const start = { equity: pots.pension * plan.mix.equity, bond: pots.pension * plan.mix.bond, cash: pots.pension * plan.mix.cash, isa: pots.isa };
          const withStart = (c) => ({ ...c, equityStart: start.equity, bondStart: start.bond, cashStart: start.cash, equityMin: start.equity, bondMin: start.bond, cashTarget: start.cash, isaBalance: start.isa });
          let written = null;
          const hook = { month: 12 * G, retarget: (state) => { const out = joinAt(plan, H, entry.config.joined.pots, state); written = out.first; return out.first; } };
          const hooked = live.simulateFastFrom(withStart(entry.config.config), pfF, { hook });
          if (!written) { expect(hooked.failMonth).toBeLessThan(12 * G); continue; }
          const plain = live.simulateFastFrom(withStart({ ...entry.config.config, ...written }), live.prepareFutureFrom(sp.lives[i], 12 * sp.S, sp.D));
          expect(hooked).toEqual(plain);
          compared++;
        }
      }
      expect(compared).toBeGreaterThan(5);
    }
  });
});

describe('I8: the years after the second stop are a chain of simulate (all shares, the tax-free part already taken)', () => {
  it('failed and the month equal the chain in every life; the end pots to 1e-9', () => {
    const env = { ...TEST_ENV, futures: 20, mix: ALL_SHARES, savingMix: ALL_SHARES };
    let compared = 0, lasted = 0, failedAfter = 0;
    for (const [h, stopAge] of [
      [apart({ you: { age: 55, pot: 250_000, payIn: 500, stop: 59 }, partner: { age: 59, pot: 180_000, isa: 15_000, stop: 'already' }, payCovers: 0, mix: ALL_SHARES, taxFreeTaken: true }), 59],
      [apart({ you: { age: 52, pot: 120_000, isa: 30_000, payIn: 900, stop: 58 }, partner: { age: 60, pot: 350_000, isa: 40_000, stop: 'already' }, payCovers: 0, mix: ALL_SHARES, taxFreeTaken: true }), 58],
      [apart({ you: { age: 61, pot: 300_000, isa: 10_000, stop: 'already' }, partner: { age: 57, pot: 200_000, payIn: 600, stop: 60, sp: 'none' }, payCovers: 0, mix: ALL_SHARES, taxFreeTaken: true }), 60]
    ]) {
      const sp = live.stopAtPlan(h, stopAge, env);
      const runner = live.createStopRunner(sp);
      const G = sp.plan.apart.years;
      for (const H of [22_000, 34_000, 46_000]) {
        for (let i = 0; i < sp.n; i++) {
          const [entry] = runner.configsAtH(H, i);
          const got = runner.run(0, i, entry.config);
          const chain = chainJoin(sp, H, i, entry.config);
          if (!chain.failed) {
            // neither runs out: the same, to the end pots
            expect([got.failed, got.failMonth], `H ${H} life ${i}`).toEqual([false, null]);
            expect(got.parts.passOn).toBe(null);
            expect(close(got.parts.first.equity, chain.first.equity)).toBe(true);
            expect(close(got.parts.join.equity, chain.join.equity)).toBe(true);
            lasted++;
          } else if (chain.failMonth < 12 * G) {
            // before the second stop: the first stopper alone, a run-out as before
            expect([got.failed, got.failMonth], `H ${H} life ${i}`).toEqual([true, chain.failMonth]);
          } else {
            // after it the chain's first run-out is where the pass-on happens; the household runs out then or later
            expect(got.parts.passOn, `H ${H} life ${i}`).toEqual({ to: expect.any(String), month: chain.failMonth });
            expect(got.failMonth === null || got.failMonth >= chain.failMonth).toBe(true);
            failedAfter++;
          }
          compared++;
        }
      }
    }
    expect(compared).toBeGreaterThan(100);
    expect(lasted).toBeGreaterThan(0);
    expect(failedAfter).toBeGreaterThan(0);
  }, 60_000);
});

describe('I10: the pass-on after the second stop (the household runs out only when both have)', () => {
  /** The households of I7 and I8 and the reviewers' leftover case: one has stopped, the other stops a few years on. */
  const households = () => [
    [apart({ you: { age: 55, pot: 250_000, payIn: 500, stop: 59 }, partner: { age: 59, pot: 180_000, isa: 15_000, stop: 'already' } }), 59],
    [apart({ you: { age: 50, pot: 150_000, isa: 40_000, payIn: 700, stop: 56 }, partner: { age: 52, pot: 400_000, isa: 90_000, payIn: 300, stop: 54 }, payCovers: 0 }), 56],
    [apart({ you: { age: 60, pot: 320_000, isa: 25_000, stop: 'already' }, partner: { age: 56, pot: 140_000, payIn: 450, stop: 58 } }), 58],
    [apart({ you: { age: 55, pot: 420_000, payIn: 100, stop: 57 }, partner: { age: 54, isa: 30_000, stop: 'already' } }), 57]
  ];

  it('a resumed run is the run from the start with a second hook at that month, bit for bit; and the household runs out at the later run-out', () => {
    const env = { ...TEST_ENV, futures: 12 };
    let resumed = 0, toJoin = 0;
    for (const [h, stopAge] of households()) {
      const sp = live.stopAtPlan(h, stopAge, env);
      const runner = live.createStopRunner(sp, sp.lives, sp.kernels, { parts: true });
      const plan = sp.plan;
      const M = 12 * plan.apart.years;
      const first = plan.runs.findIndex((r) => r.offset === 0);
      for (const H of [24_000, 34_000, 44_000, 56_000]) {
        for (let i = 0; i < sp.n; i++) {
          const [entry] = runner.configsAtH(H, i);
          const got = runner.run(0, i, entry.config);
          const { first: f, join: j, last, passOn } = got.parts;
          if (!j) continue;
          const mf = f.failed ? f.failMonth : null;
          const mj = j.failed ? j.failMonth + M : null;
          if (!passOn) { expect(mf === null && mj === null).toBe(true); expect(got.failed).toBe(false); continue; }
          if (passOn.to === 'join') {
            // the first stopper's money ran out first: the joiner's run (with the hook) decides
            expect(passOn.month).toBe(mf);
            expect(got.failMonth).toBe(mj);
            expect(last).toBe(null);
            toJoin++;
            continue;
          }
          // the joiner's ran out first: the first stopper's run resumed there equals that run from the start with the
          // hand-over and then the pass-on as two hooks
          expect(passOn).toEqual({ to: 'first', month: mj });
          const pfF = sp.driversFor(i, 0);
          const pots = sp.potsOf(i)[plan.runs[first].index];
          const start = { equity: pots.pension * plan.mix.equity, bond: pots.pension * plan.mix.bond, cash: pots.pension * plan.mix.cash, isa: pots.isa };
          const config = { ...entry.config.config, equityStart: start.equity, bondStart: start.bond, cashStart: start.cash, equityMin: start.equity, bondMin: start.bond, cashTarget: start.cash, isaBalance: start.isa };
          let hand = null;
          const hooks = [
            { month: M, retarget: (state) => { hand = joinAt(plan, H, entry.config.joined.pots, state, entry.config.config); return hand.first; } },
            { month: mj, retarget: () => passOnAt(plan, H, first, mj, hand.first) }
          ];
          const whole = live.simulateFastFrom(config, pfF, { hook: hooks });
          expect(last).toEqual(whole);
          expect(got.failMonth).toBe(whole.failed ? whole.failMonth : null);
          if (mf !== null) expect(mj).toBeLessThan(mf);
          resumed++;
        }
      }
    }
    expect(resumed).toBeGreaterThan(0);
    expect(toJoin).toBeGreaterThan(0);
  }, 60_000);

  it('a list of hooks with nothing to change is the run without them; a hook at a month part-way through a year plans that year again', () => {
    const env = { ...TEST_ENV, futures: 6 };
    const [h, stopAge] = households()[0];
    const sp = live.stopAtPlan(h, stopAge, env);
    const runner = live.createStopRunner(sp);
    const plan = sp.plan;
    const M = 12 * plan.apart.years;
    for (let i = 0; i < sp.n; i++) {
      const [entry] = runner.configsAtH(30_000, i);
      const pfF = sp.driversFor(i, 0);
      const pots = sp.potsOf(i)[plan.runs[entry.config.joined.first].index];
      const config = { ...entry.config.config, equityStart: pots.pension * plan.mix.equity, bondStart: pots.pension * plan.mix.bond, cashStart: pots.pension * plan.mix.cash, equityMin: pots.pension * plan.mix.equity, bondMin: pots.pension * plan.mix.bond, cashTarget: pots.pension * plan.mix.cash, isaBalance: pots.isa };
      const plain = live.simulateFastFrom(config, pfF);
      // hooks that return nothing new: the same run, though the remembered plan is planned again at each
      const idle = live.simulateFastFrom(config, pfF, { hook: [{ month: M, retarget: () => null }, { month: M + 7, retarget: () => null }] });
      expect(idle).toEqual(plain);
      // a record from the second stop, and a run resumed from it with the same schedules: the same run
      const buf = new Float64Array(5 * 12 * config.years);
      const recorded = live.simulateFastFrom(config, pfF, { record: { from: M, buf } });
      expect(recorded).toEqual(plain);
      const at = M + 17;
      if (plain.failed && plain.failMonth < at) continue;
      const o = 5 * (at - M);
      const again = live.simulateFastFrom(config, pfF, { resume: { month: at, equity: buf[o], bond: buf[o + 1], cash: buf[o + 2], isa: buf[o + 3], lsa: buf[o + 4] } });
      expect(again).toEqual(plain);
    }
  });
});
