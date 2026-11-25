/**
 * The pot at the stop follows the plan, on the household too (7.12.0; the household brief's step 3, joined at integration
 * with the saver brief's PlanReading.withDerivedPots).
 *
 * Sam (fictional, tests/fixtures/kimAndSam.js) is saving, with a pot at the stop stored for 63 (£169,898, source
 * 'accumulation'). He moves his stop to 62 on "About you and when". The household's "What you would have left, combined"
 * must then start from Kim's money plus Sam's pot at 62 as his plan works it out now, never from the stored £169,898.
 * Both views run the household on the plans' effective settings (the simple view's householdRun.js, the full view's
 * Household tab in index.html), so one run here is what both show.
 *
 * Worked by hand:
 *   Kim's money at the start: pension 180,000 + 70,000 + 30,000 = £280,000, ISA £40,000: £320,000 in all; Sam's at the stop
 *   is each of his lives' own (a plan still saving runs whole lives), so the household's middle is £320,000 plus the middle
 *   of those lives.
 *   The stored, stale start: 320,000 + 169,898 = £489,898.
 *   A year less of saving takes off at least a year of what goes in, £300 net (£375 with tax relief) + £200 employer =
 *   £575 a month, 12 × 575 = £6,900 in today's prices; and at most that plus a tenth of a pot under £170,000 as a year's
 *   growth: 6,900 + 17,000 = £23,900.
 */
import { describe, it, expect } from 'vitest';
import { kimAndSam, KIM_AND_SAM_TODAY } from './fixtures/kimAndSam.js';
import { effectiveStressSettings } from '../src/services/PlanReading.js';
import { aboutPatch, applyPatch } from '../src/answers/plan/about.js';
import { runHousehold } from '../src/answers/plan/householdRun.js';
import { planFor } from '../src/answers/plan/lastsRun.js';
import { stressTestStrategy } from '../src/strategies/stressTest.js';
import { upgradeScenario } from '../src/firebase/scenarioMigration.js';
import { readFileSync } from 'node:fs';

const NOW = new Date(2026, 10, 16, 12);
const KIM_START = 180000 + 70000 + 30000 + 40000;   // £320,000
const STALE = KIM_START + 169898;                    // £489,898
const upgraded = (p) => upgradeScenario(p, { now: NOW }).scenario;

/** Sam's plan with the stop moved on "About you and when" to `age`, as the page writes it. */
function samStoppingAt(age, { lock = false, typed = false } = {}) {
  const { kim, sam } = kimAndSam();
  if (typed) sam.stressTool.settings.potAtRetirement = { sipp: 169898, isa: 0, source: 'override' };
  const step = aboutPatch(upgraded(sam), { stopAge: String(age) }, { today: KIM_AND_SAM_TODAY });
  const moved = age === 63 ? upgraded(sam) : applyPatch(upgraded(sam), step.patch);
  if (lock) moved.decisionTool.settings.locked = true;
  return { kim: upgraded(kim), sam: moved, patch: step.patch };
}
const atStop = (plan) => { const p = effectiveStressSettings(plan, { now: NOW }).potAtRetirement; return (+p.sipp || 0) + (+p.isa || 0); };

describe('the pot at the stop follows the stop', () => {
  it('moving the stop to 62 moves the pot at the stop by about a year of saving, and the stored figure is not believed', () => {
    const at63 = samStoppingAt(63), at62 = samStoppingAt(62);
    expect(at62.patch['stressTool.settings.retireAge']).toBe(62);
    const p63 = atStop(at63.sam), p62 = atStop(at62.sam);
    expect(p62).not.toBe(169898);
    expect(p63 - p62).toBeGreaterThanOrEqual(6900);
    expect(p63 - p62).toBeLessThanOrEqual(23900);
  });
  it('a locked plan keeps the figure it was locked with; a typed figure is not read on a plan not locked (step F1, lead4.md D4)', () => {
    const locked = samStoppingAt(62, { lock: true }).sam;
    expect(effectiveStressSettings(locked, { now: NOW }).potAtRetirement.sipp).toBe(169898);
    const typed = samStoppingAt(62, { typed: true }).sam;
    const plain = samStoppingAt(62).sam;
    expect(effectiveStressSettings(typed, { now: NOW }).potAtRetirement).toEqual(effectiveStressSettings(plain, { now: NOW }).potAtRetirement);
    expect(effectiveStressSettings(typed, { now: NOW }).potAtRetirement.source).toBe('worked');
  });
  it('reading writes nothing', () => {
    const { sam } = samStoppingAt(62);
    const before = JSON.stringify(sam);
    effectiveStressSettings(sam, { now: NOW });
    expect(JSON.stringify(sam)).toBe(before);
  });
});

describe('the household starts from the pot at the new stop', () => {
  it('"What you would have left, combined" starts in the year Sam stops: his pot at 62 beside Kim\'s money then, never the stale pot', () => {
    const { kim, sam } = samStoppingAt(62);
    const r = runHousehold(kim, sam, { today: KIM_AND_SAM_TODAY });
    expect(r.ok).toBe(true);
    const start = r.own.combined.potFan[0].p50;
    // Sam's plan still saves, so each of his futures starts from its own life's pots at 62 (whole lives): the household's
    // middle starts from Kim's £320,000 plus the middle of the lives the fan reads (Sam's run's own sampled futures), which
    // sits inside his 1-in-10 low and high at the stop. (Before whole lives every future started from his one middling pot.)
    const ss = effectiveStressSettings(sam, { now: NOW });
    const samRun = stressTestStrategy(ss.strategyId || 'pots-and-valves', planFor(ss, NOW));
    const lives = samRun.samples.wealth.map((w) => w[0]).sort((x, y) => x - y);
    const middle = lives[Math.min(lives.length - 1, Math.floor(0.5 * lives.length))];
    // (wrap-up) the combined rows are calendar years (HouseholdService.combineHouseholdStrategies startA / startB): the first
    // is the year Sam stops, his pot at 62 beside Kim's money that many years into her own run, future for future — her
    // £320,000 is this year's figure, which was the pots at the stop said against today's year
    const c0 = r.offsets.b;
    expect(r.offsets.a).toBe(0);
    expect(c0).toBeGreaterThan(0);
    const ks = effectiveStressSettings(kim, { now: NOW });
    const kimRun = stressTestStrategy(ks.strategyId || 'pots-and-valves', planFor(ks, NOW));
    expect(kimRun.samples.wealth[0][0]).toBe(KIM_START);
    const m = Math.min(kimRun.samples.wealth.length, samRun.samples.wealth.length);
    const both = Array.from({ length: m }, (_, i) => kimRun.samples.wealth[i][Math.min(c0, kimRun.samples.wealth[i].length - 1)] + samRun.samples.wealth[i][0]).sort((x, y) => x - y);
    expect(r.own.combined.potFan[0].year).toBe(c0);
    expect(Math.abs(start - both[Math.min(both.length - 1, Math.floor(0.5 * both.length))])).toBeLessThanOrEqual(1);
    const at = ss.potAtRetirement;
    expect(middle).toBeGreaterThan(at.careful);
    expect(middle).toBeLessThan(at.good);
    expect(lives[lives.length - 1] - lives[0]).toBeGreaterThan(1000);
    // not the old pot at the stop: Kim's same money with Sam's stale pot beside it is another figure
    const stale = Array.from({ length: m }, (_, i) => kimRun.samples.wealth[i][Math.min(c0, kimRun.samples.wealth[i].length - 1)] + (STALE - KIM_START)).sort((x, y) => x - y);
    expect(Math.abs(start - stale[Math.min(stale.length - 1, Math.floor(0.5 * stale.length))])).toBeGreaterThan(1000);
    // the same run from Sam's side: the same start
    const back = runHousehold(sam, kim, { today: KIM_AND_SAM_TODAY });
    expect(Math.abs(back.own.combined.potFan[0].p50 - start)).toBeLessThanOrEqual(1);
  }, 60000);
  it('the full view\'s Household tab reads both plans the same way, so it starts from the same figure', () => {
    const html = readFileSync('index.html', 'utf8');
    expect(html).toMatch(/const ownSettings = effectiveStressSettings\(own, \{ now \}\)/);   // from the one day (contextFor), as the simple view's household run (which the tab now runs: householdRun.js)
    expect(html).toMatch(/partnerSettings = partner \? effectiveStressSettings\(partner, \{ now \}\) : null/);   // read before the one rule asks whether it can be tested (7.12.0)
  });
});
