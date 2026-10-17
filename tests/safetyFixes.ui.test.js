/**
 * 6.20.2 — the safety fixes as the screen shows them (research/v7/square-one-audit.md §5 item 1):
 *  (a) the buttons that would change a locked plan's settings say so plainly and do nothing else;
 *  (d) Transition has a place in the phone menu;
 *  (e) the welcome tour is gone (6.23.0): its tests with it.
 * The repositories' own refusal is in tests/lockedPlanWrites.test.js; the banner in tests/nextStep.test.js; the
 * question before a saver's Decision month in tests/decisionLockAsk.test.js.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { enterGuestMode, leaveGuestMode } from '../src/firebase/AuthService.js';
import { clearGuestData, wipeAllUserData } from '../src/firebase/FirestoreService.js';
import { invalidateScenarioCache, getActiveScenarioAsync } from '../src/storage/ScenarioRepository.js';
import { invalidateStressCache } from '../src/storage/StressRepository.js';
import { invalidateCache as invalidateDecisionCache, wipeAllDecisionData } from '../src/storage/DecisionRepository.js';
import { refusedWhenLocked, sayIfLocked } from '../src/ui/lockedPlan.js';
import { PLAN_LOCKED_MESSAGE, PlanLockedError } from '../src/services/LockedPlanGuard.js';
import { moreSheetHtml, MORE_TABS } from '../src/ui/mobileMenu.js';
import { parse } from '../src/ui/inlineHandlers.js';

const html = readFileSync('index.html', 'utf8');
const GUEST_KEY = 'pt_guest_scenarios';
const fresh = () => { invalidateScenarioCache(); invalidateStressCache(); invalidateDecisionCache(); };
const fixture = (name) => JSON.parse(readFileSync('tests/fixtures/plans/' + name + '.json', 'utf8'));
const open = (plan) => { enterGuestMode(); clearGuestData(); sessionStorage.setItem(GUEST_KEY, JSON.stringify([{ ...plan, isActive: true }])); fresh(); };
const toasts = () => { const list = []; return { list, showToast: (m, type) => list.push([m, type]) }; };
afterEach(() => { leaveGuestMode(); clearGuestData(); fresh(); });

/** The source of a window.<name> handler in index.html's script (enough of it to see its first steps). */
const handler = (name, len = 1600) => { const i = html.indexOf('window.' + name + ' = async function'); expect(i, name + ' is defined').toBeGreaterThan(0); return html.slice(i, i + len); };

describe('(a) a button that would change a locked plan\'s settings: told plainly, nothing else happens', () => {
  it('refusedWhenLocked: a locked plan → the message, true; a draft → nothing said, false', async () => {
    open(fixture('05-saver-committed'));
    let w = toasts();
    expect(await refusedWhenLocked(w)).toBe(true);
    expect(w.list).toEqual([[PLAN_LOCKED_MESSAGE, 'info']]);
    open(fixture('02-pnv-draft'));
    w = toasts();
    expect(await refusedWhenLocked(w)).toBe(false);
    expect(w.list).toEqual([]);
  });
  it('sayIfLocked: a refusal from the save functions is shown in the same words; any other error is left to the caller', () => {
    const w = toasts();
    expect(sayIfLocked(new PlanLockedError(['x']), w)).toBe(true);
    expect(sayIfLocked(new Error('offline'), w)).toBe(false);
    expect(w.list).toEqual([[PLAN_LOCKED_MESSAGE, 'info']]);
  });

  it('Budget → "Use £X a month as my spending": the lock is checked before anything is read, asked or written', () => {
    const f = handler('applyBudgetToPlan', 2600);
    const check = f.indexOf('if (await refusedWhenLocked()) return;');
    expect(check).toBeGreaterThan(0);
    for (const later of ['getStressSettingsAsync(', 'appConfirm(', 'showLoading(', 'saveStressSettings(', 'saveDecisionSettings(', 'budgetSpendingPatch(']) expect(f.indexOf(later), later).toBeGreaterThan(check);
  });
  it('the walk-through\'s "Use £X a month as my spending & finish": refused before it saves, applies or closes', () => {
    const i = html.indexOf('window.budWizSave = async function');
    const f = html.slice(i, i + 400);
    const check = f.indexOf('if (alsoApply && await refusedWhenLocked()) return;');
    expect(check).toBeGreaterThan(0);
    expect(f.indexOf('saveBudgetUI()')).toBeGreaterThan(check);
    expect(f.indexOf('closeBudgetWizard()')).toBeGreaterThan(check);
  });
  it('the optimiser\'s "Apply this split": refused before the form fields are touched', () => {
    const i = html.indexOf('window.applyOptimisedAllocationUI = async function');
    const f = html.slice(i, i + 900);
    const check = f.indexOf('if (await refusedWhenLocked()) return;');
    expect(check).toBeGreaterThan(0);
    expect(f.indexOf('writeAlloc(')).toBeGreaterThan(check);
    expect(f.indexOf('saveStressSettings(')).toBeGreaterThan(check);
  });
  it('the Decision tool\'s "Reset": refused before it asks anything ("Copy from Decision" is gone, 6.23.0)', () => {
    for (const name of ['resetDecisionSettingsUI']) {
      const i = html.indexOf('window.' + name + ' = async function');
      const f = html.slice(i, i + 600);
      const check = f.indexOf('if (await refusedWhenLocked()) return;');
      expect(check, name).toBeGreaterThan(0);
      expect(f.indexOf('appConfirm('), name).toBeGreaterThan(check);
    }
  });
  it('the Monthly Entry\'s "how often" picker is a preference (v6 usability audit, decision 4): it writes decisionTool.cadence, never the locked settings, and a failed save puts the picker back', () => {
    const f = handler('setCadence', 400);
    const save = f.indexOf('await saveActiveDrawCadence(v)');
    expect(save).toBeGreaterThan(0);
    expect(f).not.toContain('saveDecisionSettings(');
    const catchAt = f.indexOf('catch (e) {', save);
    const onFail = f.slice(catchAt, f.indexOf('return; }', catchAt));
    expect(onFail).toContain('loadCadenceUI()');
  });
});

describe('Account → "Reset" with a locked plan open (guest)', () => {
  it('every plan is deleted first; the follow-up reset of the open plan\'s settings is refused, writes nothing, and is not a failure', async () => {
    open(fixture('05-saver-committed'));
    await getActiveScenarioAsync();
    await wipeAllUserData();
    expect(sessionStorage.getItem(GUEST_KEY)).toBeNull();
    await expect(wipeAllDecisionData()).rejects.toMatchObject({ code: 'plan-locked' });
    expect(sessionStorage.getItem(GUEST_KEY)).toBeNull();
    const src = readFileSync('src/ui/components/AuthPanel.js', 'utf8');
    expect(src).toContain('try { await wipeAllDecisionData(); await resetStressSettings(); } catch (e) { if (!isPlanLockedError(e)) throw e; }');
  });
});

describe('(d) the phone menu has Transition', () => {
  it('the More sheet lists it after the Accumulation planner, with a handler the page can run', () => {
    const sheet = moreSheetHtml({ version: '6.20.2', householdVisible: false });
    const acc = sheet.indexOf("mobileGo('accumulation')"), tr = sheet.indexOf("mobileGo('transition')");
    expect(acc).toBeGreaterThan(0);
    expect(tr).toBeGreaterThan(acc);
    expect(sheet).toContain('Transition');
    for (const m of sheet.matchAll(/data-on-click="([^"]+)"/g)) expect(() => parse(m[1].replace(/&#39;/g, "'"))).not.toThrow();
    expect(sheet).not.toContain("mobileGo('household')");
    expect(moreSheetHtml({ version: '6.20.2', householdVisible: true })).toContain("mobileGo('household')");
    expect(sheet).toContain('(v6.20.2)');
  });
  it('the bottom bar\'s More lights up on every tab it holds, Transition included', () => {
    expect(MORE_TABS).toEqual(['accumulation', 'transition', 'household']);
    expect(html).toContain('MORE_TABS.includes(act)');
  });
  it('index.html builds the sheet from the module', () => {
    const i = html.indexOf('window.openMobileMore = function');
    expect(html.slice(i, i + 400)).toContain('moreSheetHtml(');
  });
});
