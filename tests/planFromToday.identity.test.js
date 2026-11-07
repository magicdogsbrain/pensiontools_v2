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
import { deriveTiming, monthsUntilStart } from '../src/services/PlanTiming.js';
import { cleanParams } from '../src/services/StrategyState.js';
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
/**
 * Fixtures whose figures 7.4.0 moved on purpose, their pins retaken then on both Nodes (24 here, 20 in CI): a retiree's plan
 * starts in the tax year work stopped or this one, never next April. 02, 09 and 12 were saved with next April and were
 * rebuilt with year 0 the tax year work stopped; 01, 08 and 11 save no year (or no age) and now derive this tax year; 07, a
 * draft saved with next April, is read from this tax year (PlanMove.laterDraftOf); 10 is split with 09. 06, locked with no
 * year saved, keeps the year it was locked with (PlanMove.withLockedStart), so its pins are the ones taken before 7.4.0.
 * Every other fixture is held to its old pins byte for byte.
 */
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
  // 7.4.0: the start years offered end at this tax year; before, the range reached next April, one year more. That is a
  // choice offered, never a figure: the pins, taken before it, are read with that one year put back, so every plan whose
  // figures did not move is held to its pins byte for byte
  if (Array.isArray(timing.startOptions) && timing.startOptions.length) timing.startOptions = [...timing.startOptions, timing.startOptions[timing.startOptions.length - 1] + 1];
  // 7.4.1: the engine's version is a stamp too (strategies/version.js: nothing compares it). The pins, taken under 6.37.0,
  // are read with it put back, so a plan whose figures did not move under 6.38.0 or 6.39.0 is held to them byte for byte.
  const { appVersion, ...rest } = doc;
  return { ...rest, ...('engineVersion' in rest ? { engineVersion: '6.37.0' } : {}), timing };
};

/**
 * 7.4.2 removed fields, not figures, from every output: the timing's months to a start (`bridgeMonths`; a saver's renamed
 * `monthsToStop`), the document's copies of it and of a ladder's extra cash (`assumptions.bridgeMonths`/`bridgeCash`,
 * `decisionRun.bridgeMonths`), and the run's flag that said a plan's pots were its year 0's (`runUpSpent`) beside the extra
 * cash it passed on (`params.bridgeCash`). The pins, taken before, are read with each put back where it stood, worked out by
 * the rules of the code that wrote them (the extra cash a document recorded: none once spent, else the plan's own), so every
 * plan whose FIGURES did not move is held to them byte for byte. The ones that moved — a ladder with extra cash still unspent
 * on the run's pots — have their pins retaken (the note above the pins' fixtures).
 */
const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
function placed(obj, anchor, key, value, before = false) {
  if (!isObj(obj)) return obj;
  const out = {};
  let done = false;
  for (const [k, v] of Object.entries(obj)) {
    if (before && k === anchor && !done) { out[key] = value; done = true; }
    if (k !== key) out[k] = v;
    if (!before && k === anchor && !done) { out[key] = value; done = true; }
  }
  if (!done) out[key] = value;
  return out;
}
function asPinned(outputs, stress, now) {
  const p = outputs.planFromSettings;
  const t = deriveTiming(stress, now);
  const at = stress.potsAsOf;
  const spent = !(p.yearOffset > 0) && t.mode !== 'future' && (isObj(at) || (at === 'today' && t.planYearNow >= 0));
  const raw = stress.strategyId === 'pots-and-valves' ? undefined : (stress.strategyParams || {}).bridgeCash;
  const plan = (q) => {
    if (!isObj(q)) return q;
    let o = spent ? placed(q, 'stride', 'runUpSpent', true, true) : q;
    if (raw !== undefined && isObj(o.params)) o = { ...o, params: placed(o.params, 'cashYears', 'bridgeCash', raw) };
    return o;
  };
  const months = (timing) => (timing.mode === 'future' ? timing.monthsToStop : monthsUntilStart(timing.firstTaxYear, now));
  const doc = outputs.buildPlanDocument;
  let d = doc;
  if (isObj(doc) && isObj(doc.timing)) {
    const m = months(doc.timing);
    const { monthsToStop, ...timing } = doc.timing;
    const lived = p.yearOffset > 0;
    const extra = lived || spent ? 0 : (+cleanParams(doc.strategy.id, stress.strategyParams).bridgeCash || 0);
    let assumptions = placed(doc.assumptions, 'firstTaxYear', 'bridgeMonths', m);
    assumptions = placed(assumptions, 'cashYears', 'bridgeCash', extra);
    d = { ...doc, timing: placed(timing, 'startMonth', 'bridgeMonths', m), assumptions, decisionRun: placed(doc.decisionRun, 'year0', 'bridgeMonths', m),
      strategy: { ...doc.strategy, p: plan(doc.strategy.p) } };
  }
  return { ...outputs, planFromSettings: plan(p), buildPlanDocument: d };
}

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
    outputs: asPinned({
      simulationConfigFromSettings: cfg,
      planFromSettings: p,
      deriveCompareConfigs: sampledConfigs(configs, p.durationYears),
      fullGiltTest: { ...gilt, samples: undefined },
      buildPlanDocument: withoutAdded(doc),
      planOfRecordFor: { ...por, engineVersion: '6.37.0' },   // the engine's stamp as the pins had it (withoutAdded above)
      householdDrawSplit: split
    }, stress, now)
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
    if (ADDED_AFTER_THE_PINS[name]) continue;   // held by the corpus snapshot instead (above)
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
    // all but fixture 04, in its year 1 by then — and from 7.4.0 02, 09 and 12, whose year 0 is 2026/27
    expect(names.filter((name) => pinned.fixtures[name].afterApril).length).toBe(8);
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
