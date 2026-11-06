/**
 * Plans kept without an account (6.23.0, usability audit decision 7): up to three of the guest's own in the window,
 * and the example plan read-only beside them.
 */
import { describe, it, expect } from 'vitest';
import { GUEST_MAX_PLANS, GUEST_PLANS_FULL_MESSAGE, guestOwnPlans, guestHasRoom, guestPlanRefusal, isExamplePlan,
  examplePlanWriteRefusal, ExamplePlanError, isExamplePlanError, EXAMPLE_PLAN_MESSAGE, DEMO_PLANS, EXAMPLE_PLAN_KEY } from '../src/services/GuestPlans.js';
import { enterGuestMode, leaveGuestMode } from '../src/firebase/AuthService.js';
import { createScenario, saveScenario, loadAllScenarios, setActiveScenarioDoc, deleteScenarioDoc, clearGuestData } from '../src/firebase/FirestoreService.js';
import { invalidateScenarioCache, activePlanIsExample, getActiveScenarioAsync } from '../src/storage/ScenarioRepository.js';
import { refusedWhenLocked, sayIfLocked } from '../src/ui/lockedPlan.js';

const plan = (name, extra = {}) => ({ planDetails: { name }, ...extra });

describe('how many plans a guest may keep', () => {
  it('three of their own; the example does not count', () => {
    expect(GUEST_MAX_PLANS).toBe(3);
    expect(guestHasRoom([])).toBe(true);
    expect(guestHasRoom([plan('a'), plan('b')])).toBe(true);
    expect(guestHasRoom([plan('a'), plan('b'), plan('c')])).toBe(false);
    expect(guestHasRoom([plan('a'), plan('b'), plan('example', { example: true })])).toBe(true);
    expect(guestOwnPlans([plan('a'), plan('ex', { example: true })]).map((p) => p.planDetails.name)).toEqual(['a']);
  });
  it('the refusal says how many and what to do, in plain words; null while there is room', () => {
    expect(guestPlanRefusal([plan('a')])).toBeNull();
    expect(guestPlanRefusal([plan('a'), plan('b'), plan('c')])).toBe(GUEST_PLANS_FULL_MESSAGE);
    expect(GUEST_PLANS_FULL_MESSAGE).toMatch(/up to 3 plans in this browser window/);
    expect(GUEST_PLANS_FULL_MESSAGE).toMatch(/free account/);
    expect(GUEST_PLANS_FULL_MESSAGE).not.toMatch(/tab/);
  });
  it('handles junk', () => {
    expect(guestHasRoom(null)).toBe(true);
    expect(isExamplePlan(null)).toBe(false);
    expect(isExamplePlan({ example: 'yes' })).toBe(false);
  });
});

describe('the example plan is read-only', () => {
  it('a write to the example is refused unless it only opens or closes it', () => {
    const ex = plan('ex', { example: true });
    expect(examplePlanWriteRefusal(ex, { isActive: true })).toBeNull();
    expect(examplePlanWriteRefusal(ex, { isActive: false, lastModified: 'x' })).toBeNull();
    expect(examplePlanWriteRefusal(ex, { 'stressTool.settings.baseSalary': 1 })).toEqual(['stressTool.settings.baseSalary']);
    expect(examplePlanWriteRefusal(ex, { budgetTool: {} })).toEqual(['budgetTool']);
    expect(examplePlanWriteRefusal(plan('mine'), { budgetTool: {} })).toBeNull();
  });
  it('the error carries its code and plain message', () => {
    const e = new ExamplePlanError();
    expect(isExamplePlanError(e)).toBe(true);
    expect(isExamplePlanError(new Error('x'))).toBe(false);
    expect(e.message).toBe(EXAMPLE_PLAN_MESSAGE);
    expect(EXAMPLE_PLAN_MESSAGE).toMatch(/cannot be changed/);
    expect(EXAMPLE_PLAN_MESSAGE).toMatch(/start your own plan/i);
  });
  it('the example is the £1M story', () => {
    const s = DEMO_PLANS[EXAMPLE_PLAN_KEY].stress;
    expect(s.baseSalary).toBe(40000);
    expect(s.equityMin + s.bondMin + s.cashTarget).toBe(1000000);
  });
  it('the guest store refuses every change to it, and lets it be opened, closed and deleted', async () => {
    enterGuestMode(); clearGuestData(); invalidateScenarioCache();
    const mine = await createScenario({ planDetails: { name: 'Mine' }, isActive: true, stressTool: { settings: { baseSalary: 1 } } });
    const ex = await createScenario({ planDetails: { name: 'Example' }, example: true, isActive: false, stressTool: { settings: { baseSalary: 40000 } } });
    await expect(saveScenario(ex, { 'stressTool.settings.baseSalary': 2 })).rejects.toMatchObject({ code: 'example-plan', message: EXAMPLE_PLAN_MESSAGE });
    await expect(saveScenario(ex, { budgetTool: { settings: {} } })).rejects.toMatchObject({ code: 'example-plan' });
    expect((await loadAllScenarios()).find((p) => p.id === ex).stressTool.settings.baseSalary).toBe(40000);   // nothing written
    await saveScenario(mine, { 'stressTool.settings.baseSalary': 2 });                                          // the guest's own plan still saves
    await setActiveScenarioDoc(ex);
    invalidateScenarioCache();
    expect((await getActiveScenarioAsync()).id).toBe(ex);
    expect(await activePlanIsExample()).toBe(true);
    await setActiveScenarioDoc(mine);
    invalidateScenarioCache();
    expect(await activePlanIsExample()).toBe(false);
    await deleteScenarioDoc(ex);
    expect((await loadAllScenarios()).length).toBe(1);
    leaveGuestMode(); clearGuestData(); invalidateScenarioCache();
  });
  it('a button says so before it does anything, and a refusal from the store is shown in the same words', async () => {
    enterGuestMode(); clearGuestData(); invalidateScenarioCache();
    await createScenario({ planDetails: { name: 'Example' }, example: true, isActive: true, decisionTool: { settings: { locked: false } } });
    const list = []; const win = { showToast: (m, t) => list.push([m, t]) };
    expect(await refusedWhenLocked(win)).toBe(true);
    expect(list).toEqual([[EXAMPLE_PLAN_MESSAGE, 'info']]);
    expect(sayIfLocked(new ExamplePlanError(), win)).toBe(true);
    expect(list.length).toBe(2);
    leaveGuestMode(); clearGuestData(); invalidateScenarioCache();
  });
});
