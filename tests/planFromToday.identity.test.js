/**
 * The plan as seen from today (research/plan-start.md §3, "The default for every existing plan"): for a plan in its year 0
 * or before — every plan saved until now, every corpus fixture, every pinned state — the engines are handed exactly what
 * they were handed before, and every figure is the same.
 *
 * Every saved plan in the corpus (tests/fixtures/plans, read as the app reads it: upgradeScenario, then the effective Stress
 * settings) is run, at three clocks, through each place the change reaches:
 *   simulationConfigFromSettings, planFromSettings, deriveCompareConfigs (its per-year draws sampled), the full gilt ladder
 *   (stressTestStrategy 'full-il-gilt', fullGiltTest), the plan's own strategy and buildPlanDocument on it, planOfRecordFor
 *   (the Decision settings as the lock seeds them) and householdDrawSplit (each plan with the couple fixture's partner).
 * The pins in planFromToday.identity.pins.node<major>.json were written by the code BEFORE the change (on today's corpus:
 * a checkout of it with this file copied in, run with PIN_IDENTITY=1 under each Node major we run — 24 on our machines,
 * 20 in CI — and only ever on the code before a change, or the pin proves nothing). Without the variable the pins are
 * only read: a missing pins file for the Node running fails, it is never written over.
 * Two digests of each output, both compared against the pins of the same Node major:
 *   - `exact`: every number as the engine left it — byte for byte.
 *   - `sf6`: every number to 6 significant figures (a readable second check).
 * Why one file per Node: Node 20 differs from 24 in the last bit of some Math.pow (tests/fixtures/plans/checks.mjs sig12),
 * and a digest has no tolerance, so a figure that sits on a rounding edge can hash differently even at 6 significant
 * figures (it did: a household split, 4 Nov 2026). Each Node is therefore held to its own figures from before the change.
 * The clocks are the corpus's (30 September 2026), the last day before 6 April 2027, when fixture 04 (year 0 = 2026/27)
 * still has no year behind it, and 1 May 2027 (6.51.0): the first month of 2027/28, when the plans whose year 0 is 2027/28
 * — the gilt ladder still waiting for its start among them — are in year 0 with a month gone, which is where a rule keyed
 * on "year 0 has begun" rather than on a year lived would move a figure (a review of 6.51.0 found one: the ladder's cash
 * set aside to its first April). A plan is pinned at each clock at which it has no year behind it (fixture 04 is not, at
 * the third). Each clock is an instant in UTC by the middle of the UK day, so the dates stamped into the outputs (the
 * document's createdAt, the plan of record's savedAt) and every local date read from them are the same in any time zone
 * the suite runs in. The futures are cut to 60 (stride 12) to keep the file quick: the identity is the same at any count.
 *
 * Fields the change ADDS (not figures: where the plan stands) are taken out before the digest, by name: the timing's
 * planYearNow / elapsedYears / monthsIntoYear (deriveTiming; the document spreads its timing whole), and `potsAsOf`, the
 * position a locked plan's effective settings carry (PlanFromToday.lockedPotsAsOf), wherever a copy of the settings is
 * echoed in an output (the household split's settings).
 */
import { describe, it, expect, afterAll, vi } from 'vitest';
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { upgradeScenario } from '../src/firebase/scenarioMigration.js';
import { effectiveStressSettings } from '../src/services/PlanReading.js';
import { simulationConfigFromSettings } from '../src/services/SimulationConfig.js';
import { planFromSettings, stressTestStrategy } from '../src/strategies/stressTest.js';
import { deriveCompareConfigs } from '../src/strategies/compareRunner.js';
import { buildPlanDocument } from '../src/services/PlanDocument.js';
import { planOfRecordFor, seedDecisionFromStress } from '../src/services/PlanCommit.js';
import { householdDrawSplit } from '../src/services/HouseholdDraw.js';
import { deriveTiming } from '../src/services/PlanTiming.js';
import { realYieldForYear, setLinkersOverride } from '../src/services/LinkerUniverse.js';
import { setEquityOverride } from '../src/services/EquityIndex.js';

const PLANS = join(process.cwd(), 'tests', 'fixtures', 'plans');

const GILTS = JSON.parse(readFileSync(join(PLANS, 'market', 'gilts.json'), 'utf8'));
const EQUITY = JSON.parse(readFileSync(join(PLANS, 'market', 'equity.json'), 'utf8'));
const CLOCKS = { corpus: new Date('2026-09-30T11:00:00.000Z'), lastBeforeApril: new Date('2027-04-05T11:00:00.000Z'), afterApril: new Date('2027-05-01T11:00:00.000Z') };
const ADDED_TIMING = ['planYearNow', 'elapsedYears', 'monthsIntoYear'];
/**
 * Fixtures that joined the corpus after these pins were taken and have no year behind them at these clocks, each with why it
 * is not pinned here. The identity is the rule of the change that made the plan as seen from today (6.49.0): its pins are
 * the code before THAT change, on the corpus as it was. A plan added later has no "before" of that change to be pinned
 * against, and the pins of both Node majors (24 here, 20 in CI) would have to be written for it at once; its figures are held
 * by the corpus snapshot instead (tests/fixtures/plans/snapshot.json, planCorpus.test.js), which every rebuild re-answers.
 * Only these names are let through: any other plan in year 0 or before that is not pinned still fails below.
 */
const ADDED_AFTER_THE_PINS = Object.freeze({
  '19-back-to-work-saving': 'the saving plan made on going back to work (research/plan-start.md §2 J): its year 0 is the tax year it stops in again, ahead at every clock'
});
const NODE = String(process.versions.node).split('.')[0];
// One pins file per Node major, each taken on the code before the change with that Node: simulated money can differ in
// its last bits between Node 20 (CI) and 24, and a hash has no tolerance, so each Node is held to its own exact figures.
const PINS = join(process.cwd(), 'tests', `planFromToday.identity.pins.node${NODE}.json`);

const raws = Object.fromEntries(readdirSync(PLANS).filter((f) => /^\d\d-.*\.json$/.test(f)).sort().map((f) => [f.slice(0, -5), JSON.parse(readFileSync(join(PLANS, f), 'utf8'))]));
// Write the pins (on the code before a change only): PIN_IDENTITY=1. Otherwise they are read, and must be there.
const WRITE = process.env.PIN_IDENTITY === '1';
const pinned = !WRITE && existsSync(PINS) ? JSON.parse(readFileSync(PINS, 'utf8')) : null;
const names = pinned ? Object.keys(pinned.fixtures) : Object.keys(raws);

/** JSON of a value with functions left out and numbers as given (`exact`) or to 6 significant figures (`sf6`). */
const digest = (v) => {
  const json = (round) => JSON.stringify(v, (k, x) => (typeof x === 'function' || k === 'potsAsOf' ? undefined
    : typeof x === 'number' ? (Number.isFinite(x) ? (round ? Number(x.toPrecision(6)) : x) : String(x)) : x));
  const sha = (s) => createHash('sha1').update(s == null ? 'undefined' : s).digest('hex').slice(0, 16);
  return { sf6: sha(json(true)), exact: sha(json(false)) };
};
/** deriveCompareConfigs holds functions of the plan year: each sampled over the run (k = 0 … N + 1) so the identity covers them. */
const sampledConfigs = (c, N) => {
  const out = {};
  for (const [key, cfg] of Object.entries(c)) {
    if (!cfg || typeof cfg !== 'object') { out[key] = cfg; continue; }
    const o = {};
    for (const [k, v] of Object.entries(cfg)) {
      if (typeof v !== 'function') { o[k] = v; continue; }
      if (['drawNetOfSp', 'floorDraw', 'amountAt'].includes(k)) o[k] = Array.from({ length: N + 2 }, (_, i) => v(i));
    }
    out[key] = o;
  }
  return out;
};
// The document stamps the app's version (a release number, not a figure): left out, or every release would move the pins.
const withoutAdded = (doc) => {
  if (!doc || !doc.timing) return doc;
  const timing = { ...doc.timing };
  for (const k of ADDED_TIMING) delete timing[k];
  const { appVersion, ...rest } = doc;
  return { ...rest, timing };
};

function outputsOf(name, now) {
  const plan = upgradeScenario(raws[name], { now }).scenario;
  const stress = effectiveStressSettings(plan, { now });
  const partnerName = name === '10-couple-b' ? '09-couple-a' : '10-couple-b';
  const partner = effectiveStressSettings(upgradeScenario(raws[partnerName], { now }).scenario, { now });
  const cfg = simulationConfigFromSettings({}, stress, now);
  const p = planFromSettings(stress, cfg, { yieldForYear: realYieldForYear, startAge: +stress.shapeAgeNow || 57, now });
  const configs = deriveCompareConfigs(p);
  const q = { ...p, mcRuns: 60, stride: 12 };
  const gilt = stressTestStrategy('full-il-gilt', q);
  const r = stressTestStrategy(stress.strategyId || 'pots-and-valves', q);
  const ds = (plan.decisionTool && plan.decisionTool.settings) || {};
  const doc = buildPlanDocument({ planName: (plan.planDetails && plan.planDetails.name) || 'Plan', settings: stress, p: q, r, lockedAt: '2026-01-01T00:00:00.000Z', lockedBy: 'identity test',
    journey: [], accumulation: (plan.accumulationTool && plan.accumulationTool.settings) || {}, holdings: plan.holdings || null, now });
  const por = planOfRecordFor({ ...ds, ...seedDecisionFromStress(stress, ds) }, now);
  const split = householdDrawSplit({ settings: stress, name: 'You' }, { settings: partner, name: 'Partner' }, { now });
  return {
    timing: deriveTiming(stress, now),
    outputs: {
      simulationConfigFromSettings: cfg,
      planFromSettings: p,
      deriveCompareConfigs: sampledConfigs(configs, p.durationYears),
      fullGiltTest: { ...gilt, samples: undefined },
      buildPlanDocument: withoutAdded(doc),
      planOfRecordFor: por,
      householdDrawSplit: split
    }
  };
}

const computed = {};
function run(name, clock) {
  const key = name + '@' + clock;
  if (!computed[key]) {
    const now = CLOCKS[clock];
    vi.useFakeTimers({ toFake: ['Date'], now });
    setLinkersOverride(GILTS, now);
    setEquityOverride(EQUITY);
    try { computed[key] = outputsOf(name, now); } finally { vi.useRealTimers(); }
  }
  return computed[key];
}

/** The clocks at which a saved plan has no year behind it: the clocks it is pinned at. */
function clocksInYear0OrBefore(name) {
  return Object.keys(CLOCKS).filter((clock) => {
    const now = CLOCKS[clock];
    const stress = effectiveStressSettings(upgradeScenario(raws[name], { now }).scenario, { now });
    return deriveTiming(stress, now).elapsedYears === 0;
  });
}

afterAll(() => {
  setLinkersOverride(null); setEquityOverride(null);
  if (!WRITE) return;
  const fixtures = {};
  for (const name of names) {
    const clocks = clocksInYear0OrBefore(name);
    if (!clocks.length) continue;   // a plan with a year behind it at every clock (fixture 13): the identity is not its rule
    fixtures[name] = {};
    for (const clock of clocks) fixtures[name][clock] = Object.fromEntries(Object.entries(run(name, clock).outputs).map(([fn, v]) => [fn, digest(v)]));
  }
  writeFileSync(PINS, JSON.stringify({ node: NODE, clocks: Object.fromEntries(Object.entries(CLOCKS).map(([k, d]) => [k, d.toISOString()])), fixtures }, null, 1) + '\n');
});

describe('a plan in year 0 or before: every figure as it was (the plan as seen from today is the identity)', () => {
  it('the pins exist and cover the corpus as it was (12 saved plans, each at every clock at which it has no year behind it)', () => {
    if (WRITE) return;   // written in afterAll
    expect(pinned, `tests/planFromToday.identity.pins.node${NODE}.json is missing: write it on the code before the change (PIN_IDENTITY=1, with this Node), never on this one`).not.toBeNull();
    expect(names.length).toBe(12);
    expect(Object.keys(pinned.clocks)).toEqual(Object.keys(CLOCKS));
    for (const name of names) expect(Object.keys(pinned.fixtures[name])).toEqual(clocksInYear0OrBefore(name));
    expect(names.filter((name) => pinned.fixtures[name].afterApril).length).toBe(11);   // all but fixture 04, in its year 1 by then
  });
  for (const name of names) {
    for (const clock of (pinned ? Object.keys(pinned.fixtures[name]) : Object.keys(CLOCKS))) {
      it(name + ' at ' + clock + ': no year lived yet, and every output the same', () => {
        const { timing, outputs } = run(name, clock);
        if (WRITE) return;
        expect(pinned).not.toBeNull();
        expect(timing.elapsedYears).toBe(0);
        expect(outputs.planFromSettings.yearOffset).toBeUndefined();
        const want = pinned.fixtures[name][clock];
        for (const [fn, v] of Object.entries(outputs)) {
          const got = digest(v);
          expect(fn + ' ' + got.sf6).toBe(fn + ' ' + want[fn].sf6);
          expect(fn + ' exact ' + got.exact).toBe(fn + ' exact ' + want[fn].exact);
        }
      }, 60000);
    }
  }
  it('every saved plan in the corpus with no year behind it at these clocks is pinned here', () => {
    if (WRITE) return;
    for (const name of Object.keys(raws)) {
      if (ADDED_AFTER_THE_PINS[name]) continue;
      for (const clock of Object.keys(CLOCKS)) {
        const now = CLOCKS[clock];
        const stress = effectiveStressSettings(upgradeScenario(raws[name], { now }).scenario, { now });
        if (deriveTiming(stress, now).elapsedYears === 0) expect(names).toContain(name);
      }
    }
  });
});
