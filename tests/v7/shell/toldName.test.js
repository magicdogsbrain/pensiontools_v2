/**
 * One name for a plan everywhere it is said (7.12.0; the second walk, walker 9: the list said ‘Stop at 63 · £2,200 a month’
 * while "Make a copy" made ‘… · paying £600 (copy)’ and "Make this my main plan" said ‘… · paying £600’ is now your main
 * plan). The toast, the copy's name and the "Use these in" line say the name every page shows (services/PlanName.js); the
 * stored name is still what a rename edits.
 *
 * Fictional Sam, kept from "Am I saving enough?" under the name it suggested in 7.11 ("Stop at 65 · £2,400 a month · paying
 * £…"), the stop then moved to 67 and the aim to £2,200. By hand, the name shown: "Stop at 67 · £2,200 a month".
 */
import { describe, it, expect } from 'vitest';
import { answerB } from '../../../src/answers/b/answer.js';
import { buildPlanSeed } from '../../../src/answers/keep/planSeed.js';
import { seedToScenario } from '../../../src/services/PlanFromSeed.js';
import { upgradeScenario } from '../../../src/firebase/scenarioMigration.js';
import { boxesOf as aboutBoxes, aboutPatch, applyPatch } from '../../../src/answers/plan/about.js';
import { boxesOf as spendBoxes, spendPatch } from '../../../src/answers/plan/spend.js';
import { startPlanWrite } from '../../../src/v7/effects/planWrite.js';
import { upgradedList, viewFor } from '../../../src/v7/effects/planSource.js';
import { createStore } from '../../../src/v7/effects/store.js';
import { initialState } from '../../../src/v7/state/initial.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { A } from '../../../src/v7/state/actions.js';
import { parse } from '../../../src/v7/router/routes.js';
import { noon } from '../plan/_plans.js';

const ON = '2025-11-12', TODAY = '2026-11-16';
const NOW = noon(TODAY);
const copy = (v) => JSON.parse(JSON.stringify(v));
const tick = async (n = 12) => { for (let i = 0; i < n; i++) await new Promise((r) => setTimeout(r, 0)); };
const SHOWN = 'Stop at 67 · £2,200 a month';

function sam() {
  const inputs = { household: 'single', you: { pot: 120000, age: 44, statePension: { kind: 'full' }, finalSalary: { has: false }, payIn: { kind: 'split', own: 375, employer: 250 } },
    stop: { age: 65 }, spend: { kind: 'amount', amount: 2400 }, endAge: 95 };
  const result = answerB(inputs, { today: ON, futures: 100, seed: 0, detail: 'answer' });
  const seed = buildPlanSeed({ source: 'b', result, env: { today: ON, appVersion: 'test' }, name: 'x', createdAt: ON + 'T10:00:00.000Z' });
  const made = seedToScenario(seed, ON).yours;
  made.id = 'Sam07';
  let plan = upgradeScenario(copy(made), { now: NOW }).scenario;
  // kept in 7.11 under the name the answer then suggested, the pay-in in it
  plan.fromAnswer.name.suggested = 'Stop at 65 · £2,400 a month · paying £630';
  plan.planDetails.name = plan.fromAnswer.name.suggested;
  plan = applyPatch(plan, aboutPatch(plan, { ...aboutBoxes(plan, { today: TODAY }), stopAge: '67' }, { today: TODAY }).patch);
  plan = applyPatch(plan, spendPatch(plan, { ...spendBoxes(plan, { today: TODAY }), 'first.amount': '2200' }, { today: TODAY }).patch);
  plan.isActive = false;
  return plan;
}
const other = () => ({ ...copy(sam()), id: 'Other1', isActive: true, planDetails: { name: 'Another plan' }, fromAnswer: undefined });

function fakeLite() {
  const writes = [], adds = [];
  return {
    writes, adds,
    doc: (db, ...path) => ({ db, path: path.join('/') }),
    collection: (db, ...path) => ({ db, path: path.join('/') }),
    updateDoc: (ref, data) => { writes.push({ path: ref.path, data: copy(data) }); return Promise.resolve(); },
    addDoc: (coll, data) => { adds.push({ path: coll.path, data: copy(data) }); return Promise.resolve({ id: 'New' + adds.length }); },
    deleteDoc: () => Promise.resolve()
  };
}
function page(raws) {
  const store = createStore(initialState({ today: TODAY, build: 'test' }), reduce);
  store.dispatch({ type: A.ROUTE_SET, route: parse('#/plans') });
  store.dispatch({ type: A.SESSION_SET, session: { kind: 'in', email: 'a@b.c' } });
  store.dispatch({ type: A.PLANS_SET, list: upgradedList(raws, NOW), source: 'account', readAt: '14:03' });
  store.dispatch({ type: A.PLANS_VIEW, view: viewFor(store.getState()) });
  const fb = fakeLite();
  const handles = () => ({ auth: {}, db: { name: 'db' }, user: { uid: 'u1', email: 'a@b.c', emailVerified: true }, reread: () => Promise.resolve() });
  const stop = startPlanWrite(store, { session: null, local: null, now: () => NOW, fb, client: null, handles });
  return { store, fb, stop, toast: () => store.getState().ui.toast };
}

describe('a plan is told by the name every page shows', () => {
  it('"Make this my main plan" says the shown name', async () => {
    const plan = sam();
    const p = page([plan, other()]);
    p.store.dispatch({ type: A.PLAN_MAIN, planId: plan.id });
    await tick();
    expect(p.toast()).toMatchObject({ op: 'main', slots: { name: SHOWN } });
    p.stop();
  }, 60000);
  it('"Make a copy" names the copy from the shown name, and says it', async () => {
    const plan = sam();
    const p = page([plan, other()]);
    p.store.dispatch({ type: A.PLAN_COPY, planId: plan.id, carry: false });
    await tick();
    expect(p.fb.adds.length).toBe(1);
    expect(p.fb.adds[0].data.planDetails.name).toBe(SHOWN + ' (copy)');
    expect(p.toast()).toMatchObject({ op: 'copied', slots: { name: SHOWN + ' (copy)' } });
    p.stop();
  }, 60000);
  it('the stored name is left as it was: what a rename edits', async () => {
    const plan = sam();
    const p = page([plan, other()]);
    p.store.dispatch({ type: A.PLAN_MAIN, planId: plan.id });
    await tick();
    for (const w of p.fb.writes) expect(Object.keys(w.data)).not.toContain('planDetails.name');
    p.stop();
  }, 60000);
});
