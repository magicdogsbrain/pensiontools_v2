/**
 * Gate 9 (research/v7/road-to-7.md step 9, §4: "the pooled verdict and the split equal the Household tab's"): "Your household"
 * in the preview is the planner's Household tab, on the couple fixtures (09 and 10, linked) and on a pair made from them whose
 * pots are unequal enough for "Who draws what" to apply (09's pots four times over and £70,000 a year; derived here, never a
 * new file).
 *   1. The pooled verdict (householdRun.js runHousehold, what the V7 worker runs) equals the planner's runHouseholdCheck
 *      path to the pound: both plans' effective settings, householdDrawSplit, each plan through the planner's strategyPlanFor
 *      (createSimulationConfigFromSettings, planFromSettings on the real-yield curve, the same clock) and stressTestStrategy,
 *      paired and pooled by runHouseholdWays / combineHouseholdStrategies, comparisonFigures on the two ways.
 *   2. The split (saving, tax, pots, steps) equals householdDrawSplit's; the split applied (household.js splitPatches, what the
 *      one write file writes) equals what applySplit writes on a fake store, key for key, on two unlocked plans — and makes
 *      copies with those settings when one is locked.
 *   3. The survivor and care questions (runSurvivor, runCare) equal runSurvivorCheck / runCareCheck on the planner's own
 *      boxes (years from now) to the pound.
 *   4. Everything is pinned once into householdIdentity.pins.json (numbers to a millionth: Node 20 and 24 differ in the last
 *      digit of some floats); delete the file to pin again — a diff there is a change to what the household runs and must be meant.
 * About twelve runs of the one test in all.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { runHousehold, runSurvivor, runCare, yearsFromAge } from '../../../src/answers/plan/householdRun.js';
import { splitPatches, ageNowOf, pairKeyOf, householdOf } from '../../../src/answers/plan/household.js';
import { applyPatch } from '../../../src/answers/plan/about.js';
import { effectiveStressSettings } from '../../../src/services/PlanReading.js';
import { createSimulationConfigFromSettings } from '../../../src/storage/StressRepository.js';
import { planFromSettings, stressTestStrategy } from '../../../src/strategies/stressTest.js';
import { realYieldForYear } from '../../../src/services/LinkerUniverse.js';
import { householdDrawSplit, comparisonFigures } from '../../../src/services/HouseholdDraw.js';
import { runHouseholdWays, runSurvivorCheck, runCareCheck, householdIncomeTimeline, startOffset } from '../../../src/services/HouseholdService.js';
import { applySplit, splitWriteMode, SPLIT_KEYS } from '../../../src/services/HouseholdSplitApply.js';
import { HOUSEHOLD_WRITES } from '../../../src/answers/plan/schema.js';
import { corpus, entryOf, TODAY, noon } from './_plans.js';

const C = corpus();
const now = noon(TODAY);
const PINS = join(process.cwd(), 'tests', 'v7', 'plan', 'householdIdentity.pins.json');
const sha = (v) => createHash('sha1').update(JSON.stringify(v, (k, x) => (typeof x === 'number' && Number.isFinite(x) ? Math.round(x * 1e6) / 1e6 : x))).digest('hex').slice(0, 16);
const r0 = (v) => Math.round(v || 0);
const copy = (v) => JSON.parse(JSON.stringify(v));

/** The couple as the fixtures have them, and the unequal pair derived from them (the owner's household shape: one pot far bigger). */
function pairs() {
  const a = entryOf(C['09-couple-a']).plan, b = entryOf(C['10-couple-b']).plan;
  const big = copy(C['09-couple-a']);
  const s = big.stressTool.settings;
  s.equityMin *= 4; s.bondMin *= 4; s.cashTarget *= 4; s.baseSalary = 70000;
  return { equal: { a, b }, unequal: { a: entryOf(big).plan, b } };
}
/** index.html runHouseholdCheck's inline path: strategyPlanFor on each plan, stressTestStrategy on its own way, paired and pooled. */
const plannerTest = (st, cfg, id) => { const p = planFromSettings(st, cfg, { yieldForYear: realYieldForYear, startAge: +st.shapeAgeNow || 57, now }); return { r: stressTestStrategy(id, p), p }; };
function plannerHousehold(a, b) {
  const sA = effectiveStressSettings(a, { now }), sB = effectiveStressSettings(b, { now });
  const names = { a: a.planDetails.name, b: b.planDetails.name };
  const split = householdDrawSplit({ settings: sA, name: names.a }, { settings: sB, name: names.b }, { now });
  const cfgOf = (st) => createSimulationConfigFromSettings({}, st);
  const ways = { own: { settingsA: sA, cfgA: cfgOf(sA), settingsB: sB, cfgB: cfgOf(sB) } };
  if (split.applies) ways.together = { settingsA: split.settings.a, cfgA: cfgOf(split.settings.a), settingsB: split.settings.b, cfgB: cfgOf(split.settings.b) };
  const res = runHouseholdWays(ways, split.needs, sA.strategyId || 'pots-and-valves', sB.strategyId || 'pots-and-valves', plannerTest);
  const fig = split.applies && res.together && res.together.combined ? comparisonFigures(split, res) : null;
  return { sA, sB, split, res, fig, timeline: householdIncomeTimeline(sA, sB, null, now), offsets: { a: startOffset(sA, now), b: startOffset(sB, now) } };
}
function fakeRepo(plans) {
  const store = new Map(plans.map((p) => [p.id, copy(p)]));
  const apply = (obj, key, value) => { const path = key.split('.'); let o = obj; for (let i = 0; i < path.length - 1; i++) { if (!o[path[i]]) o[path[i]] = {}; o = o[path[i]]; } o[path[path.length - 1]] = value; };
  return {
    store, writes: [],
    async saveScenario(id, data) { this.writes.push([id, data]); const cur = store.get(id); for (const [k, v] of Object.entries(data)) apply(cur, k, v); },
    async duplicateScenario(id, name) { const src = copy(store.get(id)); const nid = id + '-copy'; src.id = nid; src.planDetails.name = name; src.decisionTool.settings.locked = false; store.set(nid, src); return nid; },
    async loadScenario(id) { return copy(store.get(id) || null); }
  };
}
const combinedOf = (c) => ({ runs: c.runs, jointSuccess: c.jointSuccess, successA: c.successA, successB: c.successB, pooled: c.pooled, potFan: c.potFan.map((f) => ({ year: f.year, p10: r0(f.p10), p50: r0(f.p50), p90: r0(f.p90) })) });
const resultOf = (r) => ({ affordable: r.affordable, ruin: r.ruin, terminal: { p10: r0(r.terminal.p10), p50: r0(r.terminal.p50), p90: r0(r.terminal.p90) }, n: r.n });
const figOf = (f) => (f ? { ages: f.ages, own: wayOf(f.own), together: wayOf(f.together), betterOff90: r0(f.betterOff90), cost: { own: r0(f.cost.own), together: r0(f.cost.together) } } : null);
const wayOf = (w) => ({ lasts: { household: w.lasts.household, a: w.lasts.a, b: w.lasts.b, share: w.lasts.shareHousehold }, potA: w.potA.map(r0), potB: w.potB.map(r0), left90: w.left90 ? { p50: r0(w.left90.p50), p10: r0(w.left90.p10) } : null });
const splitOf = (s) => ({ applies: s.applies, unchanged: s.unchanged, smaller: s.smaller, untilAge: s.untilAge, saving: { year: r0(s.saving.year), until: r0(s.saving.until), whole: r0(s.saving.whole) }, pots: { a: r0(s.pots.a), b: r0(s.pots.b) },
  tax: { firstYear: s.tax.firstYear ? { own: r0(s.tax.firstYear.own), together: r0(s.tax.firstYear.together), year: s.tax.firstYear.year } : null, until: { own: r0(s.tax.until.own), together: r0(s.tax.until.together) }, whole: { own: r0(s.tax.whole.own), together: r0(s.tax.whole.together) } },
  steps: s.steps, schedules: { own: { a: s.schedules.own.a.map(r0), b: s.schedules.own.b.map(r0) }, together: { a: s.schedules.together.a.map(r0), b: s.schedules.together.b.map(r0) } }, unused: s.unused, note2028: s.note2028, ladderNote: s.ladderNote, fingerprint: s.fingerprint });

const pinned = existsSync(PINS) ? JSON.parse(readFileSync(PINS, 'utf8')) : null;
const made = {};
/** Each pair's two runs once (the V7 run and the planner's path), shared by the tests below: about eight runs of the one test in all for the two pairs. */
const ranPairs = {};
const runsOf = (name, a, b) => (ranPairs[name] ||= { mine: runHousehold(a, b, { today: TODAY }), theirs: plannerHousehold(a, b) });

describe('gate 9 — "Your household" equals the planner\'s Household tab on the couple fixtures', { timeout: 600_000 }, () => {
  const P = pairs();
  for (const [name, { a, b }] of Object.entries(P)) {
    it(`${name}: the pooled verdict, each plan alone, the split and its figures, to the pound; pinned once`, () => {
      const { mine, theirs } = runsOf(name, a, b);
      expect(mine.ok).toBe(true);
      expect(JSON.parse(JSON.stringify(mine))).toEqual(mine);
      expect(mine.basis.runs).toBe(theirs.split.applies ? 4 : 2);
      expect(mine.offsets).toEqual(theirs.offsets);
      // the pooled verdict and each plan alone
      expect(combinedOf(mine.own.combined)).toEqual(combinedOf(theirs.res.own.combined));
      expect(resultOf(mine.own.rA)).toEqual(resultOf(theirs.res.own.rA));
      expect(resultOf(mine.own.rB)).toEqual(resultOf(theirs.res.own.rB));
      // the split
      expect(splitOf(mine.split)).toEqual(splitOf(theirs.split));
      expect(mine.split.settings, 'the page rebuilds the settings from the schedules').toBeUndefined();
      expect(mine.split.needs).toEqual(theirs.split.needs);
      if (theirs.split.applies) {
        expect(combinedOf(mine.together.combined)).toEqual(combinedOf(theirs.res.together.combined));
        expect(figOf(mine.fig)).toEqual(figOf(theirs.fig));
      } else {
        expect(mine.together).toBe(null);
        expect(mine.fig).toBe(null);
      }
      expect(mine.timeline.map((r) => ({ year: r.year, need: r0(r.need), guaranteed: r0(r.guaranteed), drawNeed: r0(r.drawNeed), bridge: r.bridge }))).toEqual(theirs.timeline.map((r) => ({ year: r.year, need: r0(r.need), guaranteed: r0(r.guaranteed), drawNeed: r0(r.drawNeed), bridge: r.bridge })));
      made[name] = { ...(made[name] || {}), pooled: sha({ combined: combinedOf(mine.own.combined), rA: resultOf(mine.own.rA), rB: resultOf(mine.own.rB), split: splitOf(mine.split), fig: figOf(mine.fig) }) };
      // the figures as the page says them: the verdict's words and the split's pounds are the run's
      const view = householdOf([{ plan: a, newer: false, failed: false }, { plan: b, newer: false, failed: false }], a.id, { today: TODAY, H: { key: pairKeyOf(a, b), status: 'done', limit: null, result: mine, ms: 1, survivor: null, care: null, pick: null } });
      expect(view.verdict.share).toBe(theirs.res.own.combined.pooled ? theirs.res.own.combined.pooled.success : theirs.res.own.combined.jointSuccess);
      expect(view.split.applies).toBe(theirs.split.applies);
      if (theirs.split.applies) expect(view.split.saving.year).toBe('£' + r0(theirs.split.saving.year).toLocaleString('en-GB'));
    });
  }

  it('unequal: "Use this split" writes exactly what applySplit writes on two unlocked plans (the five keys of the income shape, per plan); with one plan locked, copies with those settings', async () => {
    const { a, b } = P.unequal;
    const { mine, theirs } = runsOf('unequal', a, b);
    expect(theirs.split.applies).toBe(true);
    const p = splitPatches(a, b, mine.split, { today: TODAY });
    expect(p.ok).toBe(true);
    expect(p.mode).toBe('write');
    expect(p.writes.map((w) => w.planId)).toEqual([a.id, b.id]);
    for (const w of p.writes) for (const k of Object.keys(w.patch)) expect(HOUSEHOLD_WRITES).toContain(k);
    // the planner's write on a fake store, with the same split
    const repo = fakeRepo([a, b]);
    const done = await applySplit({ own: copy(a), partner: copy(b), split: theirs.split, names: theirs.split.names, repo, now });
    expect(done.mode).toBe('write');
    const written = { a: repo.store.get(a.id), b: repo.store.get(b.id) };
    const ours = { a: applyPatch(a, p.writes[0].patch), b: applyPatch(b, p.writes[1].patch) };
    for (const k of ['a', 'b']) {
      for (const key of SPLIT_KEYS) expect(ours[k].stressTool.settings[key], `${k}.${key}`).toEqual(written[k].stressTool.settings[key]);
      // and the plan the engines then read is the same plan
      expect(effectiveStressSettings(ours[k], { now })).toEqual(effectiveStressSettings(written[k], { now }));
    }
    expect(p.changes.map((c) => c.changed)).toEqual([true, true]);
    made.unequal = { ...(made.unequal || {}), split: sha(p.writes.map((w) => w.patch)) };
    // one plan locked: copies, never a write to either (splitWriteMode's rule)
    const locked = copy(b);
    locked.decisionTool.settings = { ...locked.decisionTool.settings, locked: true, lockedAt: '2026-09-01T00:00:00.000Z' };
    const pc = splitPatches(a, locked, mine.split, { today: TODAY });
    expect(pc.mode).toBe('copies');
    expect(splitWriteMode(a, locked, mine.split.names).mode).toBe('copies');
    expect(pc.copies.map((c) => c.name)).toEqual([a.planDetails.name + ' — drawing together', locked.planDetails.name + ' — drawing together']);
    for (const key of SPLIT_KEYS) expect(pc.copies[0].settings[key]).toEqual(theirs.split.settings.a[key]);
    for (const key of SPLIT_KEYS) expect(pc.copies[1].settings[key]).toEqual(effectiveStressSettings(locked, { now })[key] === undefined ? theirs.split.settings.b[key] : theirs.split.settings.b[key]);
  });

  it('equal: the split does not apply (the pots are close), nothing to write; the limit the boxes make is the planner\'s limitFrom shape', () => {
    const { a, b } = P.equal;
    const { mine } = runsOf('equal', a, b);
    expect(mine.split.applies).toBe(false);
    expect(splitPatches(a, b, mine.split, { today: TODAY }).ok).toBe(false);
  });

  it('the survivor and care questions equal runSurvivorCheck / runCareCheck on the planner\'s boxes, to the pound', () => {
    const { a, b } = P.equal;
    const sA = effectiveStressSettings(a, { now }), sB = effectiveStressSettings(b, { now });
    const ageA = ageNowOf(sA, now);
    expect(yearsFromAge(ageA + 10, ageA)).toBe(10);
    const survivor = runSurvivor(a, b, { today: TODAY, who: 'a', atAge: ageA + 10, spendPct: 70, dbPct: 50 });
    const theirsS = runSurvivorCheck({ survivorSettings: sB, deceasedSettings: sA, deathYear: 10, spendFraction: 0.7, dbSurvivorPct: 0.5, now }, plannerTest);
    expect(survivor.deathYear).toBe(10);
    expect(survivor.affordable).toBe(true);
    expect(survivor.basis.runs).toBe(3);
    expect(survivor.settings).toBeUndefined();
    expect({ m: survivor.middling.a.share, b: survivor.bad.a.share, inh: r0(survivor.inherited.middling.total), bad: r0(survivor.inherited.bad.total), g: survivor.spending.gross, n: survivor.spending.net })
      .toEqual({ m: theirsS.middling.a.share, b: theirsS.bad.a.share, inh: r0(theirsS.inherited.middling.total), bad: r0(theirsS.inherited.bad.total), g: theirsS.spending.gross, n: theirsS.spending.net });
    const care = runCare(a, b, { today: TODAY, who: 'a', fromAge: ageA + 15, years: 3, cost: 90000 });
    const split = householdDrawSplit({ settings: sA, name: 'a' }, { settings: sB, name: 'b' }, { now });
    const theirsC = runCareCheck({ setA: sA, setB: sB, who: 'A', startYear: 15, years: 3, annualCost: 90000, needs: split.needs.own, now }, plannerTest);
    expect(care.startYear).toBe(15);
    expect(care.affordable).toBe(true);
    expect(care.settings).toBeUndefined();
    expect({ base: care.baseline, care: care.care, rows: care.rows, total: care.totalCareGross }).toEqual({ base: theirsC.baseline, care: theirsC.care, rows: theirsC.rows, total: theirsC.totalCareGross });
    made.equal = { ...(made.equal || {}), survivor: sha({ m: survivor.middling.a.share, b: survivor.bad.a.share, inh: survivor.inherited }), care: sha({ base: care.baseline, care: care.care, rows: care.rows }) };
  });

  it('the pins exist (written once from the same functions) and cover both pairs', () => {
    if (!pinned) { writeFileSync(PINS, JSON.stringify(made, null, 1) + '\n'); return; }
    expect(Object.keys(pinned).sort()).toEqual(['equal', 'unequal']);
    for (const name of Object.keys(pinned)) expect(made[name], `${name}: the household's figures have changed`).toEqual(pinned[name]);
  });
});
