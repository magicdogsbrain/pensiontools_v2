/**
 * A change of plan in the full view is safe (lead4.md R2, D1; the lead's rulings on step S's open problems):
 *   - changes are taken one at a time: a second plan chosen while the first switch is still drawing waits for it, so two
 *     repaints never run at once and none reads "the active plan" while another change moves it;
 *   - a plan that cannot be read empties every box and says so: no box keeps the figures of the plan open before;
 *   - a budget that cannot be read is never replaced by starter lines that could then be saved over the plan's own.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';

let active = 'p1';
let failRead = false;
const log = [];
vi.mock('../src/storage/ScenarioRepository.js', () => ({
  invalidateScenarioCache: () => {},
  getActiveScenarioAsync: async () => { if (failRead) throw new Error('read failed'); return { id: active, lastModified: 't' }; },
  getActiveScenarioId: async () => active,
  listScenariosAsync: async () => [],
  saveActiveJourney: async () => {}
}));
vi.mock('../src/storage/StressRepository.js', () => ({ invalidateStressCache: () => {} }));
vi.mock('../src/storage/DecisionRepository.js', () => ({ invalidateCache: () => {} }));
vi.mock('../src/ui/homeBannerUi.js', () => ({ openingTabOf: async () => ({ tab: 'decision' }) }));

const { installRepaint } = await import('../src/ui/repaintPlan.js');
const { createPlanState } = await import('../src/ui/planState.js');
const { emptyPlanBoxes } = await import('../src/ui/emptyPlanBoxes.js');
const { READ_FAULT_WORDS } = await import('../src/reading/readFault.js');

const tick = () => new Promise((r) => setTimeout(r, 0));

function page() {
  document.body.innerHTML = '<div id="mainApp">'
    + '<button class="tab active" data-tab="decision"></button>'
    + '<div id="decision-content" class="tab-content active"><input id="entryCash" value="20000"><input type="checkbox" id="monthFillTick" checked></div>'
    + '<div id="stress-content" class="tab-content"><input id="ssPot" value="350000"><select id="ssAccess"><option value="">-</option><option value="ufpls" selected>u</option></select>'
    + '<span data-fact="pot.today">£350,000</span><p data-example><input id="exampleBox" value="40000"></p><button id="ssLockBtn" value="x"></button></div>'
    + '<div id="budget-content" class="tab-content"><input id="budCurrentAge" value="58"></div>'
    + '<div id="acSweepResult"></div><div id="acOnTrack"></div></div>';
}

function install(o = {}) {
  const planState = createPlanState();
  const deps = {
    planState, resetCurrentDecision: () => {}, clearStressResults: () => {}, resetStressSubTabs: () => {}, resetDecisionSubTabs: () => {},
    renderHistory: async () => {}, renderTaxYears: async () => {},
    initializeAllInputsFromSettings: o.init || (async () => { log.push('fill:' + active); }),
    loadBudgetUI: async () => {}, renderScenarioSelector: async () => {}, refreshDecisionLock: async () => {}, loadHouseholdUI: async () => {},
    loadStressSettings: async () => {}, loadTransitionUI: async () => {}, loadDecisionSettings: async () => {}, updateDraftLines: () => {}
  };
  window.flushSettings = async () => { log.push('flush'); };
  window.loadAccumulationUI = async () => {};
  window.updateNextStepBanner = async () => {};
  window.renderDecisionStrategyPanel = async () => {};
  window.loadCadenceUI = async () => {};
  window.updateStrategyNote = () => {};
  window._ssAutosave = null; window._acAutosave = null;
  return { api: installRepaint(window, document, deps), planState };
}

beforeEach(() => { active = 'p1'; failRead = false; log.length = 0; page(); });

describe('changePlan is taken one change at a time', () => {
  it('a second change waits until the first has repainted, so each repaint fills the plan it was started for', async () => {
    let release;
    const gate = new Promise((r) => { release = r; });
    const { api } = install({ init: async () => { const at = active; log.push('fill-start:' + at); if (at === 'p2') await gate; log.push('fill-end:' + at); } });
    const first = api.changePlan('switch', async () => { active = 'p2'; log.push('switched:p2'); });
    const second = api.changePlan('switch', async () => { active = 'p3'; log.push('switched:p3'); });
    await tick(); await tick();
    expect(log).not.toContain('switched:p3');   // the first is still drawing: the second has not moved the plan
    release();
    await first; await second;
    expect(log.indexOf('fill-end:p2')).toBeLessThan(log.indexOf('switched:p3'));
    expect(log).toContain('fill-end:p3');
  });
  it('a change whose own step fails does not stop the next one', async () => {
    const { api } = install();
    await expect(api.changePlan('switch', async () => { throw new Error('no'); })).rejects.toThrow('no');
    await api.changePlan('switch', async () => { active = 'p4'; });
    expect(log).toContain('fill:p4');
  });
  it('a lock or unlock repaint waits its turn too', () => {
    const mod = readFileSync('src/ui/repaintPlan.js', 'utf8');
    expect(mod).toMatch(/const repaintPlan = \(reason\) => trackBusy\(inTurn\(/);
    expect(mod).toMatch(/const changePlan = \(reason, change\) => trackBusy\(inTurn\(/);
  });
});

describe('a plan that cannot be read empties every box and says so', () => {
  it('emptyPlanBoxes empties boxes, ticks, choices and marked figures; fixed and example text, and buttons, stay', () => {
    const n = emptyPlanBoxes(document);
    expect(document.getElementById('entryCash').value).toBe('');
    expect(document.getElementById('monthFillTick').checked).toBe(false);
    expect(document.getElementById('ssPot').value).toBe('');
    expect(document.getElementById('ssAccess').value).toBe('');
    expect(document.querySelector('[data-fact="pot.today"]').textContent).toBe('');
    expect(document.getElementById('exampleBox').value).toBe('40000');
    expect(document.getElementById('ssLockBtn').value).toBe('x');
    expect(document.getElementById('budCurrentAge').value).toBe('');
    expect(n).toBe(5);
  });
  it('the repaint of a plan whose read fails: the fault words at the top, no box of the plan before, nothing saved from the budget', async () => {
    const { api, planState } = install();
    planState.budFor = 'p1'; planState.budLoaded = true;
    await api.changePlan('switch', async () => { active = 'p2'; failRead = true; });
    expect(document.getElementById('planReadFault').textContent).toBe(READ_FAULT_WORDS);
    expect(document.getElementById('ssPot').value).toBe('');
    expect(document.getElementById('entryCash').value).toBe('');
    expect(planState.budFor).toBeNull();
    expect(planState.budLoaded).toBe(false);
  });
  it('a fault said by a loader (the settings recipe) empties the boxes as well', async () => {
    const { api } = install({ init: async () => { api.sayReadFault(READ_FAULT_WORDS); document.getElementById('ssPot').value = '1'; } });
    await api.repaintPlan('load');
    expect(document.getElementById('ssPot').value).toBe('');   // a box a loader filled before the fault is emptied at the end
  });
  it('the next plan read well takes the fault words away', async () => {
    const { api } = install();
    failRead = true; await api.repaintPlan('load');
    failRead = false; await api.repaintPlan('load');
    expect(document.getElementById('planReadFault')).toBeNull();
  });
});

describe('a budget that cannot be read', () => {
  it('getBudgetAsync says so (throws) instead of handing back the starter budget', async () => {
    vi.resetModules();
    vi.doMock('../src/storage/ScenarioRepository.js', () => ({ getActiveBudget: async () => { throw new Error('read failed'); }, saveActiveBudget: async () => {} }));
    const { getBudgetAsync } = await import('../src/storage/BudgetRepository.js');
    await expect(getBudgetAsync()).rejects.toThrow();
    vi.doUnmock('../src/storage/ScenarioRepository.js');
  });
  it('the full view\'s budget page: no starter lines on a fault, bound to the plan id read at the START, Save refused without a plan', () => {
    const src = readFileSync('index.html', 'utf8');
    const at = src.indexOf('async function loadBudgetUI');
    const fn = src.slice(at, src.indexOf('function updateTierButtons', at));
    expect(fn).not.toMatch(/normaliseBudget\(defaultBudget\(\)\)/);
    expect(fn).toMatch(/sayReadFault\(READ_FAULT_WORDS\)/);
    expect(fn).not.toMatch(/planState\.budFor = await getActiveScenarioId\(\)/);   // read once, before the budget, never at the end
    const save = src.slice(src.indexOf('window.saveBudgetUI = async function'), src.indexOf('window.saveBudgetUI = async function') + 600);
    expect(save).toMatch(/if \(!planState\.budFor\)/);
  });
});
