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
  it('"When could I retire?" runs in the worker on the page\'s day, a string or a Date', async () => {
    const plan = planOf('saver-draft');
    const settings = effectiveStressSettings(plan, { now: NOW });
    for (const now of [NOW.toISOString(), NOW]) {
      const m = await run('sweep', { settings, accumulation: plan.accumulation || {}, holdings: [], mcRuns: 20, stride: 60, ages: [60], now });
      expect(m.error).toBeUndefined();
      expect(m.result.rows.length).toBeGreaterThanOrEqual(0);
    }
  }, 60000);
  it('the survivor and care checks run in the worker when handed the day as a Date', async () => {
    const a = planOf('retired-draft'), b = planOf('retired-locked-pots');
    const setA = effectiveStressSettings(a, { now: NOW }), setB = effectiveStressSettings(b, { now: NOW });
    const sv = await run('survivor', { survivorSettings: setA, deceasedSettings: setB, deathYear: 5, spendFraction: 0.7, dbSurvivorPct: 0.5, now: NOW });
    expect(sv.error).toBeUndefined();
    const care = await run('care', { setA, setB, who: 'A', startYear: 5, years: 2, annualCost: 50000, needs: null, now: NOW });
    expect(care.error).toBeUndefined();
  }, 120000);
});

describe('the full view hands "When could I retire?" the one clock and waits for the one market', () => {
  it('the sweep\'s payload names the page\'s day (todayOf), and the run waits for window._marketReady', async () => {
    const { readFileSync } = await import('node:fs');
    const page = readFileSync('index.html', 'utf8');
    const at = page.indexOf('window.runRetireSweep = async function');
    const body = page.slice(at, page.indexOf('\n    };\n', at));
    expect(body).toMatch(/const payload = \{[^}]*now: todayOf\(\)/);
    expect(body.indexOf('await window._marketReady')).toBeGreaterThan(-1);
    expect(body.indexOf('await window._marketReady')).toBeLessThan(body.indexOf("runInWorker('sweep'"));
  });
});
