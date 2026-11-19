/**
 * Every change of the open plan sends what was typed first (lead4.md R3): a Settings, Accumulation or Budget save still
 * waiting goes to the plan it was typed in BEFORE the plan changes, or a copy is made. Without it the save fired after the
 * change, was refused as another plan's, and the typing was lost without a word (and Duplicate copied the plan without it).
 * The plan menu's switch and delete go through changePlan (src/ui/repaintPlan.js); these are the other ways a plan changes.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';

const order = [];
vi.mock('../src/storage/ScenarioRepository.js', () => ({
  getActiveScenarioAsStored: async () => { order.push('read'); return null; },
  getActiveScenarioAsync: async () => null,
  switchScenario: async (id) => { order.push('switch:' + id); },
  invalidateScenarioCache: () => {}
}));
vi.mock('../src/firebase/FirestoreService.js', () => ({ loadAllScenarios: async () => [], createScenario: async () => 'n1', saveScenario: async () => {} }));
vi.mock('../src/firebase/AuthService.js', () => ({ isGuest: () => false, isLoggedIn: () => true }));

const { installPlanClose } = await import('../src/ui/planCloseUi.js');

beforeEach(() => {
  order.length = 0;
  window.showToast = vi.fn();
  window.appConfirm = vi.fn(async () => false);
  window.flushSettings = vi.fn(async () => { order.push('flush'); });
  Object.defineProperty(window, 'location', { value: { reload: vi.fn() }, configurable: true });
  installPlanClose(window, document, {});
});

describe('the plan-close page', () => {
  it('opening another plan by its link sends what was typed first', async () => {
    await window.openPlanById('p2');
    expect(order).toEqual(['flush', 'switch:p2']);
  });
  it('"Move to a new plan…" sends what was typed before it reads the plan it closes', async () => {
    await window.movePlanToNew();
    expect(order[0]).toBe('flush');
    expect(order).toContain('read');
  });
});

describe('index.html: every other way the plan changes sends what was typed first', () => {
  const src = readFileSync('index.html', 'utf8');
  /** The text of a handler from its start marker to the first `call`, which must hold an await of flushSettings(). */
  const flushedBefore = (start, call) => {
    const at = src.indexOf(start);
    expect(at, start).toBeGreaterThan(-1);
    const body = src.slice(at, src.indexOf(call, at));
    return /await flushSettings\(\)/.test(body);
  };
  it('Duplicate', () => { expect(flushedBefore("getElementById('scenarioDuplicateBtn').addEventListener", 'duplicateScenario(')).toBe(true); });
  it('Try this strategy in a copy', () => { expect(flushedBefore('window.tryStrategyInCopy = async function', 'duplicateScenario(')).toBe(true); });
  it("Create your partner's plan", () => { expect(flushedBefore('window.createPartnerPlanReal = async function', 'createNewScenario(')).toBe(true); });
  it('the demo link, signed in', () => { expect(flushedBefore('has been added to your plans. Your current plan is untouched.', 'switchScenario(demoId)')).toBe(true); });
});
