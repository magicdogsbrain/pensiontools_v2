/**
 * The saver's one question, everywhere (7.12.0): "I want £X a month after tax from age Y; I am A, I earn S, I have a pot of
 * B: what do I pay in, as a share of my pay and in pounds, and how sure is it?" — asked and changed on What you pay in,
 * read on the home, and followed when X, Y, the pay-in or a lump change. Fictional people only, made here from fictional
 * answers:
 *   - Jo, 33: £38,000 a year, £22,000 in a pension, 5% of pay going in and 3% from the employer; wants £2,000 a month from 60;
 *   - Pat, 52: £31,000 a year, £45,000 in a pension, 4% and 3%; wants more than paying in can reach.
 * Every figure expected is worked out by hand in the test, from the share or the pounds the answer gives.
 */
import { describe, it, expect } from 'vitest';
import { answerB } from '../../../src/answers/b/answer.js';
import { buildPlanSeed } from '../../../src/answers/keep/planSeed.js';
import { seedToScenario } from '../../../src/services/PlanFromSeed.js';
import { upgradeScenario } from '../../../src/firebase/scenarioMigration.js';
import { savingOf, savingPatch, applyPatch } from '../../../src/answers/plan/saving.js';
import { saverInputsOf } from '../../../src/answers/plan/saverInputs.js';
import { planPage } from '../../../src/answers/plan/read.js';
import { SAVING as W } from '../../../src/v7/copy/saving.js';
import { noon } from './_plans.js';

const copy = (v) => JSON.parse(JSON.stringify(v));
const fill = (text, slots) => String(text).replace(/\{(\w+)\}/g, (m, k) => (k in slots ? slots[k] : m));
const READ_ON = '2026-11-16';
const entry = (plan) => ({ plan, newer: false, failed: false });

/** A B answer kept as a plan on `on`, brought up to date as the plan source reads it on `readOn`. */
export function keptPlan(inputs, { on = READ_ON, readOn = on, id = 'Plan01', name = 'A plan' } = {}) {
  const result = answerB(inputs, { today: on, futures: 100, seed: 0, detail: 'answer' });
  const seed = buildPlanSeed({ source: 'b', result, env: { today: on, appVersion: 'test' }, name, createdAt: on + 'T10:00:00.000Z' });
  const made = seedToScenario(seed, on).yours;
  made.id = id;
  return upgradeScenario(copy(made), { now: noon(readOn) }).scenario;
}

export const JO = () => ({ household: 'single', you: { pot: 22000, age: 33, statePension: { kind: 'full' }, finalSalary: { has: false }, payIn: { kind: 'share', pay: 38000, ownPct: 5, employerPct: 3 } },
  stop: { age: 60 }, spend: { kind: 'amount', amount: 2000 }, endAge: 95 });

const linesOf = (page) => { const out = []; const walk = (x) => { if (Array.isArray(x)) x.forEach(walk); else if (x && typeof x === 'object') { if (x.sentence && x.id) out.push(x); Object.values(x).forEach(walk); } }; walk(page); return out; };

describe('"What you want" on What you pay in: the amount and the stop age beside what goes in, one Save', () => {
  it('Jo opens the page: the first section holds £2,000 and 60, as her plan has them', () => {
    const plan = keptPlan(JO(), { id: 'JoW1' });
    const v = savingOf([entry(plan)], plan.id, { today: READ_ON });
    expect(v.want).not.toBe(null);
    expect(v.want.locked).toBe(false);
    expect(v.want.fields.map((f) => [f.path, f.shown])).toEqual([['want.monthly', '2000'], ['want.stopAge', '60']]);
    // nothing typed: the answer is the plan's as saved
    expect(v.verdict.ok).toBe(true);
    expect(v.verdict.ifSaved).toBeUndefined();
  }, 30000);

  it('Jo types £2,500 from 65: the answer follows before Save ("if you save this"), Save makes ONE write, and the answer then is that same one', () => {
    const plan = keptPlan(JO(), { id: 'JoW2' });
    const typed = { 'want.monthly': '2,500', 'want.stopAge': '65' };
    const before = savingOf([entry(plan)], plan.id, { today: READ_ON });
    const v = savingOf([entry(plan)], plan.id, { today: READ_ON, typed });
    expect(v.ok).toBe(true);
    expect(v.verdict.ifSaved).toBe(true);
    expect(v.verdict.key).not.toBe(before.verdict.key);
    expect(v.verdict.notes.stopAge).toBe('65');
    // ONE patch: the stop age (About's paths), the amount (What you spend's) together; Undo has every one of them
    const p = savingPatch(plan, typed, { today: READ_ON });
    expect(p.ok).toBe(true);
    expect(p.patch['stressTool.settings.retireAge']).toBe(65);
    expect(p.patch['stressTool.settings.incomeSteps']).toBeDefined();
    expect(Object.keys(p.previous).sort()).toEqual(Object.keys(p.patch).sort());
    // never a path and a path inside it in the one write
    for (const k of Object.keys(p.patch)) for (const j of Object.keys(p.patch)) if (k !== j) expect(j.startsWith(k + '.')).toBe(false);
    // the toast says what was saved: the amount and the age first
    const t = v.savedLine;
    expect(fill(W.toast[t.id], t.slots)).toMatch(/^Saved\. £2,500 a month from 65\. You pay in 5% of your pay and your employer 3%: /);
    const after = applyPatch(plan, p.patch);
    const read = saverInputsOf(after, { today: READ_ON });
    expect(read.ok).toBe(true);
    expect(read.inputs.stop.age).toBe(65);
    // £2,500 a month after tax, grossed up for the tax year and read back after tax: within £1 of what was typed
    expect(Math.abs(read.notes.aimMonthly - 2500)).toBeLessThanOrEqual(1);
    const saved = savingOf([entry(after)], after.id, { today: READ_ON });
    expect(saved.verdict.ifSaved).toBeUndefined();
    // the answer shown before Save is the answer after it: one key
    expect(saved.verdict.key).toBe(v.verdict.key);
    expect(saved.want.fields.map((f) => f.shown)).toEqual(['2500', '65']);
    // "Your plan" says what it pays from the new stop
    const first = linesOf(planPage([entry(after)], after.id, 'plan', { today: READ_ON })).find((x) => x.id === 'pays.step');
    expect(first.sentence.text).toMatch(/^From age 65: /);
  }, 60000);

  it('a stop age at or before the age today, or an amount that is not a figure, is a problem and writes nothing', () => {
    const plan = keptPlan(JO(), { id: 'JoW3' });
    expect(savingPatch(plan, { 'want.stopAge': '33' }, { today: READ_ON })).toMatchObject({ ok: false, errors: { 'want.stopAge': 'notAhead' } });
    expect(savingPatch(plan, { 'want.monthly': 'lots' }, { today: READ_ON })).toMatchObject({ ok: false, errors: { 'want.monthly': 'notANumber' } });
    const v = savingOf([entry(plan)], plan.id, { today: READ_ON, typed: { 'want.stopAge': '33' } });
    expect(v.verdict.ifSaved).toBeUndefined();
  }, 30000);

  it('a locked plan says the amount and the age, and how to change them; Save writes only what goes in', () => {
    const plan = keptPlan(JO(), { id: 'JoW4' });
    plan.decisionTool.settings.locked = true;
    plan.decisionTool.settings.lockedAt = '2026-11-01T10:00:00.000Z';
    const v = savingOf([entry(plan)], plan.id, { today: READ_ON });
    expect(v.want.locked).toBe(true);
    const said = fill(W.want.locked, v.want.saved);
    expect(said).toBe('£2,000 a month after tax from 60. These are part of your locked plan. To change them, unlock it from “Your plan as locked”, change them here and lock it again. What you pay in can still be changed below.');
    const p = savingPatch(plan, { 'want.monthly': '2500', 'want.stopAge': '65', salary: '40000' }, { today: READ_ON });
    expect(p.ok).toBe(true);
    expect(Object.keys(p.patch)).toEqual(['accumulationTool.settings']);
  }, 30000);
});

describe('"What you want" saved through the one write file', () => {
  const tick = async (n = 12) => { for (let i = 0; i < n; i++) await new Promise((r) => setTimeout(r, 0)); };
  const STAMP = '2026-11-16T14:03:00.000Z';
  it('Jo types £2,500 from 65 and presses Save: ONE updateDoc of the want\'s paths and the stamp; Undo puts every one back', async () => {
    const { startPlanWrite } = await import('../../../src/v7/effects/planWrite.js');
    const { upgradedList, viewFor } = await import('../../../src/v7/effects/planSource.js');
    const { createStore } = await import('../../../src/v7/effects/store.js');
    const { initialState } = await import('../../../src/v7/state/initial.js');
    const { reduce } = await import('../../../src/v7/state/reduce.js');
    const { A } = await import('../../../src/v7/state/actions.js');
    const { parse } = await import('../../../src/v7/router/routes.js');
    const raw = keptPlan(JO(), { id: 'JoW5' });
    const writes = [];
    const fb = { doc: (db, ...path) => ({ db, path: path.join('/') }), updateDoc: (ref, data) => { writes.push(copy(data)); return Promise.resolve(); } };
    const store = createStore(initialState({ today: READ_ON, build: 'test' }), reduce);
    store.dispatch({ type: A.ROUTE_SET, route: parse('#/plan/' + raw.id + '/saving') });
    store.dispatch({ type: A.SESSION_SET, session: { kind: 'in', email: 'a@b.c' } });
    store.dispatch({ type: A.PLANS_SET, list: upgradedList([raw], noon(READ_ON)), source: 'account', readAt: '14:03' });
    store.dispatch({ type: A.PLAN_EDIT, planId: raw.id, path: 'want.monthly', value: '2500' });
    store.dispatch({ type: A.PLAN_EDIT, planId: raw.id, path: 'want.stopAge', value: '65' });
    store.dispatch({ type: A.PLANS_VIEW, view: viewFor(store.getState()) });
    const mem = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
    const stop = startPlanWrite(store, { win: null, session: mem, local: mem, now: () => new Date(STAMP), fb, handles: () => ({ db: { name: 'db' }, user: { uid: 'u1', email: 'a@b.c', emailVerified: true }, reread: () => Promise.resolve() }) });
    store.subscribe((state) => { if (state.plans && state.plans.status === 'read' && !state.plans.view) store.dispatch({ type: A.PLANS_VIEW, view: viewFor(state) }); });
    const plan = store.getState().plans.list[0].plan;
    store.dispatch({ type: A.PLAN_SAVE, planId: raw.id });
    await tick();
    expect(store.getState().ui.saveProblem).toBe(null);
    expect(writes.length).toBe(1);
    const want = savingPatch(plan, { 'want.monthly': '2500', 'want.stopAge': '65' }, { today: READ_ON });
    // (a plan that is not locked: the move of the start a stop age makes is written with it, as About's own Save does)
    expect(writes[0]).toMatchObject({ ...want.patch, lastModified: STAMP });
    expect(store.getState().ui.toast).toMatchObject({ kind: 'saved', op: 'saving', line: { id: 'savingWant.share' } });
    store.dispatch({ type: A.PLANS_SET, list: [{ plan: applyPatch(plan, writes[0]), newer: false, failed: false }], source: 'account', readAt: '14:04' });
    store.dispatch({ type: A.PLAN_UNDO, planId: raw.id });
    await tick();
    expect(writes.length).toBe(2);
    const back = applyPatch(applyPatch(plan, writes[0]), Object.fromEntries(Object.entries(writes[1]).map(([k, v]) => [k, v === null ? undefined : v])));
    expect(back.stressTool).toEqual(plan.stressTool);
    expect(back.decisionTool).toEqual(plan.decisionTool);
    expect(back.accumulationTool).toEqual(plan.accumulationTool);
    stop();
  }, 60000);
});
