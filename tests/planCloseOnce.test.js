/**
 * The planner's "Move to a new plan…" asks one question at a time (src/ui/planCloseUi.js movePlanToNew). It reads the plans
 * before it draws the question, so a double click reached the button again in that wait: two questions stacked, and
 * answering both made two new plans with the same name. Here the reads are held open, the button is pressed twice (and once
 * more while the plan is being made), and one question is asked and one plan made. The plan is fixture 13 (fictional).
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { upgradeScenario } from '../src/firebase/scenarioMigration.js';

const NOW = new Date(2026, 9, 2, 12);
const PLAN = upgradeScenario(JSON.parse(readFileSync('tests/fixtures/plans/13-stopped-drawing-since.json', 'utf8')), { now: NOW }).scenario;

const held = () => { let resolve; const p = new Promise((a) => { resolve = a; }); return { p, resolve }; };
const reads = [];
const store = { creates: [], saves: [] };

vi.mock('../src/storage/ScenarioRepository.js', () => ({
  getActiveScenarioAsStored: () => { const h = held(); reads.push(h); return h.p.then(() => JSON.parse(JSON.stringify(PLAN))); },
  getActiveScenarioAsync: async () => PLAN,
  switchScenario: async () => {},
  invalidateScenarioCache: () => {}
}));
vi.mock('../src/firebase/FirestoreService.js', () => ({
  loadAllScenarios: async () => [JSON.parse(JSON.stringify(PLAN))],
  createScenario: async (data) => { store.creates.push(data); return 'new' + store.creates.length; },
  saveScenario: async (id, data) => { store.saves.push({ id, data }); }
}));
vi.mock('../src/firebase/AuthService.js', () => ({ isGuest: () => false, isLoggedIn: () => true }));

const { installPlanClose } = await import('../src/ui/planCloseUi.js');

const flush = () => new Promise((r) => setTimeout(r, 0));
let asked;
beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(NOW);
  reads.length = 0; store.creates.length = 0; store.saves.length = 0;
  document.body.innerHTML = '';
  asked = [];
  window.showToast = vi.fn();
  // the page's question box: each call draws one; the test answers it
  window.appConfirm = vi.fn((message) => { const h = held(); asked.push(h); const d = document.createElement('div'); d.innerHTML = message.html; document.body.appendChild(d); return h.p; });
  Object.defineProperty(window, 'location', { value: { reload: vi.fn() }, configurable: true });
  installPlanClose(window, document, {});
});
afterEach(() => { vi.useRealTimers(); });

describe('"Move to a new plan…" asks one question at a time', () => {
  it('a double click while the plans are being read: one read, one question, one new plan', async () => {
    const first = window.movePlanToNew();
    const second = window.movePlanToNew();
    expect(reads.length).toBe(1);
    reads[0].resolve();
    await flush();
    expect(window.appConfirm).toHaveBeenCalledTimes(1);
    // pressed again while the question is open: nothing
    await window.movePlanToNew();
    expect(window.appConfirm).toHaveBeenCalledTimes(1);
    asked[0].resolve(true);
    await first; await second;
    expect(store.creates.length).toBe(1);
    expect(store.saves.filter((s) => s.data.closedAt).length).toBe(1);
  });

  it('done (answered "Not now"), the button asks again', async () => {
    const one = window.movePlanToNew();
    reads[0].resolve();
    await flush();
    asked[0].resolve(false);
    await one;
    expect(store.creates.length).toBe(0);
    const two = window.movePlanToNew();
    expect(reads.length).toBe(2);
    reads[1].resolve();
    await flush();
    expect(window.appConfirm).toHaveBeenCalledTimes(2);
    asked[1].resolve(false);
    await two;
  });
});
