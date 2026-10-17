/**
 * The planner's side of the hand-over from the preview (research/v7/your-plan.md 5; T7, T8, T9):
 *   - the request's contract (src/services/OpenPlace.js): read once and deleted; refused when old, of an unknown version,
 *     for a place not on the list, or with a way back that is not a plan page; every place's ids exist in index.html;
 *   - the planner module (src/ui/components/OpenPlace.js): at the first showMainApp it presses the real tab and sub-page
 *     buttons (so the page's loader runs and the boxes fill), scrolls to the section, and adds the line with the way
 *     back; a plan not in the account: the sentence and nothing else; the sign-in place: "Signed in. Back to your plans";
 *     the old one-shot pt_open_tab still works;
 *   - the window pin (ScenarioRepository): every "which plan is open" read prefers it while it names a plan in the list;
 *     the menu, a new open plan and deleting the pinned plan clear it; nothing is written to any plan;
 *   - index.html: one call in showMainApp, the release pop-up waits, the menu reads the window's plan.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const store = { list: [], active: null };
vi.mock('../src/firebase/index.js', () => ({ isFirebaseConfigured: () => true, isLoggedIn: () => true, isGuest: () => false, enterGuestMode: () => ({ uid: 'guest', isGuest: true }), onAuthStateChange: () => () => {} }));
vi.mock('../src/firebase/FirestoreService.js', () => ({
  loadAllScenarios: async () => store.list.map((s) => JSON.parse(JSON.stringify(s))),
  loadScenario: async (id) => store.list.find((s) => s.id === id) || null,
  saveScenario: vi.fn(async () => {}),
  createScenario: vi.fn(async (s) => { const id = 'new-' + (store.list.length + 1); store.list.push({ ...s, id }); return id; }),
  deleteScenarioDoc: vi.fn(async (id) => { store.list = store.list.filter((s) => s.id !== id); }),
  setActiveScenarioDoc: vi.fn(async (id) => { for (const s of store.list) s.isActive = s.id === id; }),
  isScenarioNewerThanApp: () => false,
  guestSnapshot: () => store.guest || []
}));

import { OPEN_PLACE_KEY, OPEN_PLAN_KEY, PLACES, SUB_ATTR, readRequest, makeRequest, backOk, REQUEST_MAX_AGE_MS } from '../src/services/OpenPlace.js';
import { startOpenPlace, takeRequest, NOTE_ID, OLD_TAB_KEY } from '../src/ui/components/OpenPlace.js';
import { getActiveScenarioAsync, getActiveScenarioId, switchScenario, createNewScenario, deleteScenario, invalidateScenarioCache, pinPlanInWindow, clearPinnedPlan, saveActiveHoldings } from '../src/storage/ScenarioRepository.js';
import { saveScenario } from '../src/firebase/FirestoreService.js';

const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');
const NOW = Date.parse('2026-10-02T14:03:00.000Z');
const good = (o = {}) => JSON.stringify({ v: 1, planId: 'Kq8LwT2mJv5PzYc9BnRd', place: 'month', back: '#/plan/Kq8LwT2mJv5PzYc9BnRd/month', at: new Date(NOW - 1000).toISOString(), ...o });

describe('T7 — the request (src/services/OpenPlace.js)', () => {
  it('a good request is read; the fields are exactly the five', () => {
    const r = readRequest(good(), NOW);
    expect(r.ok).toBe(true);
    expect(Object.keys(r.request).sort()).toEqual(['at', 'back', 'place', 'planId', 'v']);
    expect(makeRequest({ planId: 'abc', place: 'saving', back: '#/plans', at: new Date(NOW).toISOString() })).toBeTypeOf('string');
    expect(makeRequest({ planId: 'abc', place: 'saving', back: '#/plans', at: new Date(NOW).toISOString() })).not.toMatch(/£/);
  });
  it('refused: unreadable, an unknown version, a place not on the list, a bad plan id, a way back that is not a plan page, ten minutes old', () => {
    expect(readRequest(null, NOW)).toEqual({ ok: false, why: 'none' });
    expect(readRequest('{not json', NOW).why).toBe('unreadable');
    expect(readRequest(good({ v: 2 }), NOW).why).toBe('version');
    expect(readRequest(good({ place: 'nowhere' }), NOW).why).toBe('place');
    expect(readRequest(good({ planId: 'has space' }), NOW).why).toBe('plan');
    expect(readRequest(good({ planId: null }), NOW).why).toBe('plan');
    expect(readRequest(good({ back: '#/c/answer' }), NOW).why).toBe('back');
    expect(readRequest(good({ back: 'https://evil.example/#/plans' }), NOW).why).toBe('back');
    expect(readRequest(good({ at: new Date(NOW - REQUEST_MAX_AGE_MS - 1).toISOString() }), NOW).why).toBe('old');
    expect(readRequest(good({ at: 'yesterday' }), NOW).why).toBe('old');
    expect(readRequest(good({ place: 'signin', planId: null }), NOW).ok).toBe(true);
    expect(readRequest(good({ place: 'signin' }), NOW).why).toBe('plan');   // a plan id with the sign-in place is not one
    for (const b of ['#/plans', '#/plan/abc', '#/plan/abc/month']) expect(backOk(b), b).toBe(true);
    for (const b of ['#/', '#/plan/', '#/plan/abc/c/answer', '#/plan/abc/month?focus=x', 'plans', 42]) expect(backOk(b), String(b)).toBe(false);
  });
  it('every place names a tab, a sub-page and a section that exist in index.html', () => {
    for (const [id, p] of Object.entries(PLACES)) {
      if (p.tab) expect(html, `${id}: tab ${p.tab}`).toMatch(new RegExp(`<button class="tab[^"]*" data-tab="${p.tab}"`));
      if (p.sub) expect(html, `${id}: sub-page ${p.sub}`).toContain(`${SUB_ATTR[p.tab]}="${p.sub}"`);
      if (p.section) expect(html, `${id}: section ${p.section}`).toContain(`id="${p.section}"`);
      if (p.needs) expect(['stress', 'decision']).toContain(p.needs);
    }
    expect(PLACES.signin.tab).toBe(null);
  });
  it('the request is read once and deleted, whatever it held; the old tab key too', () => {
    sessionStorage.setItem(OPEN_PLACE_KEY, '{not json');
    sessionStorage.setItem(OLD_TAB_KEY, 'strategies');
    expect(takeRequest(sessionStorage, NOW)).toEqual({ request: null, oldTab: 'strategies' });
    expect(sessionStorage.getItem(OPEN_PLACE_KEY)).toBe(null);
    expect(sessionStorage.getItem(OLD_TAB_KEY)).toBe(null);
    expect(takeRequest(null, NOW)).toEqual({ request: null, oldTab: null });
  });
});

// ---- the planner module with a page like the planner's --------------------------------------------------------------

const PLAN = (id, name, extra = {}) => ({ id, planDetails: { name }, enabledTools: ['stress', 'decision'], isActive: false, decisionTool: { settings: {}, history: [], taxYears: {} }, stressTool: { settings: {} }, accumulationTool: { settings: { netMonthly: 600, employerMonthly: 450 } }, ...extra });

/** A page like index.html's: the tabs, the sub-pages, a section, and loaders on the click handlers (as the planner's are). */
function plannerPage() {
  document.body.innerHTML = `
    <div id="mainApp">
      <nav><button class="tab" data-tab="stress"></button><button class="tab active" data-tab="decision"></button><button class="tab" data-tab="accumulation"></button><button class="tab" data-tab="strategies"></button></nav>
      <div id="stress-content"><div class="sub-tabs"><button class="sub-tab" data-stresstab="montecarlo"></button><button class="sub-tab" data-stresstab="stresssettings"></button></div><div id="ssTimingBlock"></div><input id="ssAge"></div>
      <div id="decision-content"><div class="sub-tabs"><button class="sub-tab" data-decisiontab="entry"></button><button class="sub-tab" data-decisiontab="taxyears"></button></div></div>
      <div id="accumulation-content"><div id="acRecordSection"></div><input id="acNetMonthly"><input id="acEmployerMonthly"></div>
    </div>`;
  const loaded = [];
  // the loaders run only from the click handlers (index.html 5481): a tab switched by class alone leaves the boxes blank
  document.querySelector('.tab[data-tab="accumulation"]').addEventListener('click', () => { loaded.push('accumulation'); document.getElementById('acNetMonthly').value = '600'; document.getElementById('acEmployerMonthly').value = '450'; });
  document.querySelector('.tab[data-tab="stress"]').addEventListener('click', () => { loaded.push('stress'); });
  document.querySelector('.sub-tab[data-stresstab="stresssettings"]').addEventListener('click', () => { loaded.push('stresssettings'); document.getElementById('ssAge').value = '56'; });
  document.querySelector('.sub-tab[data-decisiontab="taxyears"]').addEventListener('click', () => { loaded.push('taxyears'); });
  const scrolled = [];
  document.getElementById('ssTimingBlock').scrollIntoView = () => scrolled.push('ssTimingBlock');
  document.getElementById('acRecordSection').scrollIntoView = () => scrolled.push('acRecordSection');
  return { loaded, scrolled };
}
const flush = () => new Promise((r) => setTimeout(r, 450));

describe('T8 — the planner with a request: the right plan, page and section, with its loader run', () => {
  beforeEach(() => { sessionStorage.clear(); localStorage.clear(); invalidateScenarioCache(); clearPinnedPlan(); store.list = [PLAN('A1', 'Ladder plan', { isActive: true }), PLAN('B2', 'Saving plan')]; vi.useFakeTimers(); });
  const run = async (request, initialTab = null) => {
    if (request) sessionStorage.setItem(OPEN_PLACE_KEY, JSON.stringify(request));
    vi.setSystemTime(new Date(NOW));
    const page = plannerPage();
    const op = startOpenPlace(window);
    const tab = op.atMainApp(initialTab, null);
    await vi.runAllTimersAsync();
    return { ...page, op, tab, note: document.getElementById(NOTE_ID) };
  };
  it('the Accumulation page opens through its own button, so the pay-in boxes are filled; the section is scrolled to; the line and the way back', async () => {
    const r = { v: 1, planId: 'B2', place: 'potRecord', back: '#/plan/B2/pot', at: new Date(NOW - 1000).toISOString() };
    const { loaded, scrolled, tab, note, op } = await run(r);
    expect(tab).toBe('accumulation');
    expect(loaded).toEqual(['accumulation']);                                   // the loader ran (5.1 cannot recur)
    expect(document.getElementById('acNetMonthly').value).toBe('600');
    expect(scrolled).toEqual(['acRecordSection']);
    expect(note).not.toBe(null);
    expect(note.textContent).toContain('Opened from the preview.');
    expect(note.querySelector('a').getAttribute('href')).toBe('v7/#/plan/B2/pot');
    expect(note.querySelector('a').textContent).toContain('Back to the preview');
    // B2 is not the account's open plan: opened in this window only, said so
    expect(note.textContent).toContain('‘Saving plan’ is open in this window only. Your other windows and devices stay on ‘Ladder plan’.');
    expect(sessionStorage.getItem(OPEN_PLAN_KEY)).toBe('B2');
    expect(await getActiveScenarioId()).toBe('B2');
    expect(op.showing()).toBe(true);
    expect(sessionStorage.getItem(OPEN_PLACE_KEY)).toBe(null);                  // read once
    expect(saveScenario).not.toHaveBeenCalled();                                // nothing written to any plan
  });
  it('a Stress settings place: the tab, then the sub-page (its loader fills the boxes), then the section', async () => {
    const r = { v: 1, planId: 'A1', place: 'about', back: '#/plan/A1/plan', at: new Date(NOW - 1000).toISOString() };
    const { loaded, scrolled, note } = await run(r);
    expect(loaded).toEqual(['stress', 'stresssettings']);
    expect(document.getElementById('ssAge').value).toBe('56');
    expect(scrolled).toEqual(['ssTimingBlock']);
    expect(note.textContent).not.toContain('in this window only');               // A1 is the account's open plan
  });
  it('a plan that is not in this account: the sentence and the way back, nothing else', async () => {
    const r = { v: 1, planId: 'Z9', place: 'month', back: '#/plans', at: new Date(NOW - 1000).toISOString() };
    const { loaded, note } = await run(r);
    expect(loaded).toEqual([]);
    expect(note.textContent).toContain('That plan is not in this account.');
    expect(note.querySelector('a').getAttribute('href')).toBe('v7/#/plans');
    expect(sessionStorage.getItem(OPEN_PLAN_KEY)).toBe(null);
    expect(await getActiveScenarioId()).toBe('A1');
  });
  it('the sign-in place: "Signed in. Back to your plans in the preview"; the window\'s plans without an account are stashed for "keep this work"', async () => {
    store.guest = [PLAN('g1', 'Kept plan')];
    const r = { v: 1, planId: null, place: 'signin', back: '#/plans', at: new Date(NOW - 1000).toISOString() };
    const { note, tab } = await run(r);
    expect(tab).toBe(null);
    expect(note.textContent).toContain('Signed in.');
    expect(note.querySelector('a').textContent).toBe('Back to your plans in the preview');
    expect(JSON.parse(localStorage.getItem('pt_guest_handoff')).scenarios.length).toBe(1);
    store.guest = [];
  });
  it('a page the plan has switched off: no button is pressed, the line still shows', async () => {
    store.list[1].enabledTools = ['decision'];
    const r = { v: 1, planId: 'B2', place: 'about', back: '#/plan/B2', at: new Date(NOW - 1000).toISOString() };
    const { loaded, note } = await run(r);
    expect(loaded).toEqual([]);
    expect(note).not.toBe(null);
  });
  it('the old one-shot pt_open_tab still works, and a page without a request adds no line; it acts once only', async () => {
    sessionStorage.setItem(OLD_TAB_KEY, 'strategies');
    const { tab, note, op } = await run(null, 'decision');
    expect(tab).toBe('strategies');
    expect(note).toBe(null);
    expect(op.atMainApp('decision')).toBe('decision');                          // the second showMainApp of the page: nothing
    expect(op.showing()).toBe(false);
    const none = await run(null, null);
    expect(none.tab).toBe(null);
  });
  it('an old request is dropped at start-up', async () => {
    const r = { v: 1, planId: 'B2', place: 'month', back: '#/plans', at: new Date(NOW - REQUEST_MAX_AGE_MS - 1).toISOString() };
    const { note } = await run(r);
    expect(note).toBe(null);
    expect(sessionStorage.getItem(OPEN_PLAN_KEY)).toBe(null);
  });
});

describe('T9 — the window pin (ScenarioRepository): this window only, nothing written', () => {
  beforeEach(() => { sessionStorage.clear(); invalidateScenarioCache(); clearPinnedPlan(); vi.clearAllMocks(); store.list = [PLAN('A1', 'Ladder plan', { isActive: true }), PLAN('B2', 'Saving plan')]; });
  it('every "which plan is open" read prefers the pin while it names a plan in the list', async () => {
    expect((await getActiveScenarioAsync()).id).toBe('A1');
    invalidateScenarioCache(); pinPlanInWindow('B2');
    expect((await getActiveScenarioAsync()).id).toBe('B2');
    expect(await getActiveScenarioId()).toBe('B2');
    expect(store.list.find((s) => s.id === 'A1').isActive).toBe(true);          // the account's open plan is unmoved
    expect(saveScenario).not.toHaveBeenCalled();
    invalidateScenarioCache(); pinPlanInWindow('nope');
    expect((await getActiveScenarioAsync()).id).toBe('A1');                     // a pin that names no plan is ignored
  });
  it('a save of the active plan goes to the pinned plan', async () => {
    pinPlanInWindow('B2');
    await saveActiveHoldings({ lines: [], updatedAt: null, source: 'none', version: 1 });
    expect(saveScenario).toHaveBeenCalled();
    expect(saveScenario.mock.calls[0][0]).toBe('B2');
  });
  it('choosing a plan from the menu, making a new plan the open one, and deleting the pinned plan clear the pin', async () => {
    pinPlanInWindow('B2');
    await switchScenario('A1');
    expect(sessionStorage.getItem(OPEN_PLAN_KEY)).toBe(null);
    pinPlanInWindow('B2');
    await createNewScenario('Third', '', ['stress', 'decision'], {}, true);
    expect(sessionStorage.getItem(OPEN_PLAN_KEY)).toBe(null);
    pinPlanInWindow('B2'); invalidateScenarioCache();
    await deleteScenario('B2');
    expect(sessionStorage.getItem(OPEN_PLAN_KEY)).toBe(null);
    pinPlanInWindow('A1'); invalidateScenarioCache();
    await deleteScenario('new-3');
    expect(sessionStorage.getItem(OPEN_PLAN_KEY)).toBe('A1');                   // deleting another plan leaves the pin
  });
});

describe('index.html: the hand-over is one call in the inline script', () => {
  const script = html.match(/<script type="module">([\s\S]*?)<\/script>/)[1];
  it('imports the module on an existing import line, starts it at module start, and calls it once from showMainApp', () => {
    expect(script).toMatch(/import \{ startOpenPlace \} from '\.\/src\/ui\/components\/OpenPlace\.js';/);
    expect(script).toMatch(/const openPlace = \(\(\) => \{ try \{ return startOpenPlace\(window\); \}/);
    expect(script.match(/openPlace\.atMainApp\(/g).length).toBe(1);
    expect(script).not.toMatch(/sessionStorage\.getItem\('pt_open_tab'\)/);          // the line moved into the module
    const main = script.slice(script.indexOf('async function showMainApp('), script.indexOf('window.openToolSettingsTab ='));
    expect(main).toContain("initialTab = openPlace.atMainApp(initialTab, (page) => showStrategyPage(page));");
  });
  it('the release pop-up waits while the line is on screen; the plan menu and What\'s new read the window\'s plan', () => {
    expect(script).toMatch(/\|\| openPlace\.showing\(\);\n\s*setTimeout\(\(\) => \{ if \(!blocked\(\)\) showWhatsNew\(rels\); \}, 600\);/);
    const menu = script.slice(script.indexOf('async function renderScenarioSelector()'), script.indexOf('async function renderScenarioSelector()') + 4000);
    expect(menu).toContain("const activeId = await getActiveScenarioId(), active = scenarios.find(s => s.id === activeId);");
    expect(menu).toContain("${s.id === activeId ? 'active' : ''}");
    expect(menu).toContain('const current = scenarios.find(s => s.id === activeId);');
    expect(script).toContain("const activeId = await getActiveScenarioId(), active = scenarios.find((sc) => sc.id === activeId) || scenarios[0];");
  });
});
