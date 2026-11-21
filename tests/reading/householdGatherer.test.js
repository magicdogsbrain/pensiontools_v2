/**
 * One gatherer for the household checks (lead4.md R6, D20): the full view's Household tab runs the couple's two plans, the
 * survivor and the care checks through the simple view's own functions (answers/plan/householdRun.js runHousehold,
 * runSurvivor, runCare), handed the two plans and the day, in its engine worker. It builds no settings, split or engine
 * configs of its own for a run, and the worker has no second household job.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'node:fs';
import { jobPayload } from '../../src/workers/engineClient.js';
import { FIXTURES, PARITY_DAY } from '../../e2e/parity/fixtures/plans.js';
import { upgradeScenario } from '../../src/firebase/scenarioMigration.js';
import { runHousehold, runSurvivor, runCare } from '../../src/answers/plan/householdRun.js';
import { ageNowOf } from '../../src/answers/plan/household.js';
import { effectiveStressSettings } from '../../src/services/PlanReading.js';

const noon = (day) => { const [y, m, d] = day.split('-').map(Number); return new Date(y, m - 1, d, 12); };
const NOW = noon(PARITY_DAY);
const page = readFileSync('index.html', 'utf8');
const bodyOf = (head) => { const at = page.indexOf(head); expect(at, head).toBeGreaterThan(-1); return page.slice(at, page.indexOf('\n    };\n', at)); };

let handle;
const posted = [];
beforeAll(async () => {
  globalThis.self = { postMessage: (m) => posted.push(m) };
  await import('../../src/workers/engineWorker.js');
  handle = globalThis.self.onmessage;
});
let seq = 1000;
async function run(type, payload) {
  const id = ++seq;
  posted.length = 0;
  await handle({ data: { id, type, payload: jobPayload(payload) } });
  return posted.find((m) => m.id === id && !m.progress);
}
const couple = () => {
  const f = FIXTURES.find((x) => x.key === 'couple');
  const plans = f.plans().map((p) => upgradeScenario(JSON.parse(JSON.stringify(p)), { now: NOW }).scenario);
  const own = plans.find((p) => p.id === f.subject);
  const partner = plans.find((p) => p.id !== own.id && (own.household?.partnerScenarioId === p.id || p.household?.partnerScenarioId === own.id));
  return { own, partner };
};
const plain = (v) => JSON.parse(JSON.stringify(v));

describe('the full view\'s Household tab runs the simple view\'s household functions', () => {
  it('runHouseholdCheck, runSurvivorUI and runCareUI hand the worker the two plans and the day, and build no run of their own', () => {
    const check = bodyOf('window.runHouseholdCheck = async function');
    expect(check).toMatch(/runInWorker\('household', \{ plan: own, partner, today/);
    for (const banned of ['runHouseholdWays(', 'createSimulationConfigFromSettings(', 'strategyPlanFor(', 'stressTestStrategy(', 'cfgOf(']) expect(check, banned).not.toContain(banned);
    const sv = bodyOf('window.runSurvivorUI = async function');
    expect(sv).toMatch(/runInWorker\('householdSurvivor', \{ plan: L\.own, partner: L\.partner, today: L\.today/);
    const care = bodyOf('window.runCareUI = async function');
    expect(care).toMatch(/runInWorker\('householdCare', \{ plan: L\.own, partner: L\.partner, today: L\.today/);
    for (const b of [sv, care]) for (const banned of ['runSurvivorCheck(', 'runCareCheck(', 'oneTestInline', 'strategyPlanFor(']) expect(b, banned).not.toContain(banned);
    expect(page).not.toMatch(/const oneTestInline\b/);
  });
  it('the engine worker has the three household jobs and no other', () => {
    const w = readFileSync('src/workers/engineWorker.js', 'utf8');
    expect(w).not.toMatch(/'household-ways'|type === 'survivor'|type === 'care'/);
    expect(w).toMatch(/type === 'household' \? runHousehold : type === 'householdSurvivor' \? runSurvivor : runCare/);
  });
  it('the worker\'s household job gives exactly the simple view\'s figures for the same couple on the same day', async () => {
    const { own, partner } = couple();
    const m = await run('household', { plan: own, partner, today: PARITY_DAY, limit: null });
    expect(m.error).toBeUndefined();
    const direct = runHousehold(own, partner, { today: PARITY_DAY });
    const { market, ...got } = m.result;
    expect(market).toBeTruthy();
    expect(plain(got)).toEqual(plain(direct));
  }, 120000);
  it('the full view\'s "years from now" asks the same question as the simple view\'s age', () => {
    const { own, partner } = couple();
    const s = effectiveStressSettings(own, { now: NOW });
    const ageNow = ageNowOf(s, NOW);
    const byYears = runSurvivor(own, partner, { today: PARITY_DAY, who: 'a', years: 6, spendPct: 70, dbPct: 50 });
    const byAge = runSurvivor(own, partner, { today: PARITY_DAY, who: 'a', atAge: ageNow + 6, spendPct: 70, dbPct: 50 });
    expect(byYears.deathYear).toBe(6);
    expect(plain({ ...byYears, atAge: null })).toEqual(plain({ ...byAge, atAge: null }));
    const careYears = runCare(own, partner, { today: PARITY_DAY, who: 'a', startIn: 4, years: 2, cost: 60000 });
    const careAge = runCare(own, partner, { today: PARITY_DAY, who: 'a', fromAge: ageNow + 4, years: 2, cost: 60000 });
    expect(careYears.startYear).toBe(4);
    expect(plain({ ...careYears, fromAge: null })).toEqual(plain({ ...careAge, fromAge: null }));
  }, 120000);
});

describe('Compare allocations is the simple view\'s "Which mix lasts best?" (one function, the same eight cells)', () => {
  it('the full view hands the worker the plan and the day, and draws the simple view\'s cells in its words', () => {
    const body = bodyOf('window.runCompareStrategiesUI = async function');
    expect(body).toMatch(/runInWorker\('mixCompare', \{ plan: sc, today \}/);
    expect(body).toMatch(/mixGridHtml\(mixCompareView\(res\.cells, sc, \{ today \}\)\)/);
    for (const banned of ['mixCells(', 'stressTestStrategy(', 'strategyPlanFor(', 'allocationGridHtml']) expect(body, banned).not.toContain(banned);
    expect(page).not.toMatch(/allocationGridHtml/);
  });
  it('the worker\'s cells are exactly the simple view\'s for the same plan on the same day', async () => {
    const { runMixCompare } = await import('../../src/answers/plan/mixRun.js');
    const f = FIXTURES.find((x) => x.key === 'retired-draft');
    const plan = upgradeScenario(JSON.parse(JSON.stringify(f.plans().find((p) => p.id === f.subject))), { now: NOW }).scenario;
    const m = await run('mixCompare', { plan, today: PARITY_DAY });
    expect(m.error).toBeUndefined();
    const { market, ...got } = m.result;
    expect(got.cells).toHaveLength(8);
    expect(plain(got)).toEqual(plain(runMixCompare(plan, { today: PARITY_DAY })));
  }, 180000);
});
