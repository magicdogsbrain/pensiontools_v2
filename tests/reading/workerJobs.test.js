/**
 * Every job the full view hands its engine worker runs THERE, on the page's one clock (lead4.md R5): the day crosses the
 * worker boundary as the same day, whether the page hands it as a Date or as a string, and no job falls back to the page
 * thread because its day did not survive the trip. The payload is made exactly as engineClient.runInWorker makes it
 * (jobPayload), then handed to the worker's own message handler.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { cloneSafe } from '../../src/utils/cloneSafe.js';
import { jobPayload } from '../../src/workers/engineClient.js';
import { FIXTURES, PARITY_DAY } from '../../e2e/parity/fixtures/plans.js';
import { effectiveStressSettings } from '../../src/services/PlanReading.js';
import { upgradeScenario } from '../../src/firebase/scenarioMigration.js';
import { whenStopOf } from '../../src/reading/whenStop.js';

const noon = (day) => { const [y, m, d] = day.split('-').map(Number); return new Date(y, m - 1, d, 12); };
const NOW = noon(PARITY_DAY);

let handle;
const posted = [];
beforeAll(async () => {
  globalThis.self = { postMessage: (m) => posted.push(m) };
  await import('../../src/workers/engineWorker.js');
  handle = globalThis.self.onmessage;
});
let seq = 0;
async function run(type, payload) {
  const id = ++seq;
  posted.length = 0;
  await handle({ data: { id, type, payload: jobPayload(payload) } });
  return posted.find((m) => m.id === id && !m.progress);
}
const planOf = (key) => {
  const f = FIXTURES.find((x) => x.key === key);
  const raw = f.plans().find((p) => p.id === f.subject);
  return upgradeScenario(JSON.parse(JSON.stringify(raw)), { now: NOW }).scenario;
};

describe('a day crosses the worker boundary as the same day', () => {
  it('cloneSafe carries a Date as a Date', () => {
    const d = new Date(2026, 10, 16, 12);
    const c = cloneSafe({ now: d, deep: [{ at: d }] });
    expect(c.now).toBeInstanceOf(Date);
    expect(c.now.getTime()).toBe(d.getTime());
    expect(c.deep[0].at.getTime()).toBe(d.getTime());
    expect(c.now).not.toBe(d);
  });
  it('a job with no day is handed the page\'s one clock', () => {
    const p = jobPayload({ a: 1 });
    expect(typeof p.now === 'string' || p.now instanceof Date).toBe(true);
  });
});

describe('the engine worker runs every job on the day it is handed', () => {
  it('"When could I retire?" runs answer A in the worker on the plan\'s figures (step F3, lead4.md D11)', async () => {
    const plan = planOf('saver-draft');
    const w = whenStopOf(plan, { today: PARITY_DAY, plans: [{ plan }] });
    expect(w.ok).toBe(true);
    for (const now of [NOW.toISOString(), NOW]) {
      const m = await run('whenStop', { inputs: w.inputs, env: { ...w.env, futures: 40 }, now });   // fewer futures: the job, not the figures
      expect(m.error).toBeUndefined();
      expect(m.result.status).not.toBe('invalid');
      expect(m.result.ages.length).toBeGreaterThan(0);
    }
  }, 120000);
  it('the survivor and care checks run in the worker on the two plans and the day', async () => {
    const f = FIXTURES.find((x) => x.key === 'couple');
    const plans = f.plans().map((p) => upgradeScenario(JSON.parse(JSON.stringify(p)), { now: NOW }).scenario);
    const own = plans.find((p) => p.id === f.subject), partner = plans.find((p) => p.id !== own.id && (own.household?.partnerScenarioId === p.id || p.household?.partnerScenarioId === own.id));
    const sv = await run('householdSurvivor', { plan: own, partner, today: PARITY_DAY, boxes: { who: 'a', years: 5, spendPct: 70, dbPct: 50 }, now: NOW });
    expect(sv.error).toBeUndefined();
    const care = await run('householdCare', { plan: own, partner, today: PARITY_DAY, boxes: { who: 'a', startIn: 5, years: 2, cost: 50000 }, now: NOW });
    expect(care.error).toBeUndefined();
  }, 120000);
});

describe('the full view hands "When could I retire?" the one clock and waits for the one market', () => {
  it('the run reads the page\'s day (todayOf) through whenStopOf, and waits for window._marketReady', async () => {
    const { readFileSync } = await import('node:fs');
    const page = readFileSync('index.html', 'utf8');
    const at = page.indexOf('window.runWhenStop = async function');
    const body = page.slice(at, page.indexOf('\n    };\n', at));
    expect(body).toMatch(/const now = todayOf\(\), today = dayKeyOf\(now\)/);
    expect(body).toMatch(/whenStopOf\(entry\.plan, \{ today, plans: entries \}\)/);
    expect(body.indexOf('await window._marketReady')).toBeGreaterThan(-1);
    expect(body.indexOf('await window._marketReady')).toBeLessThan(body.indexOf("runInWorker('whenStop'"));
  });
});
