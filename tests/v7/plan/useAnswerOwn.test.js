/**
 * "Am I saving enough?" with a saving plan of your own already (reported 16 Nov 2026): B started from the front door, a new
 * tab or after "Start again" knew no plan, so "Keep this as a plan" led and each keep made one more plan of the same name —
 * "Sam saving", "Sam saving (2)", … Now, with neither a plan kept from this answer nor one B was opened from:
 *   - your own saving plans as read (signed in: the account's; a visitor: this window's) — not closed, not the example, not
 *     shown as saved, not a partner's: one → "Use these in ‘{name}’" leads and "Keep as a new plan" is second; several → a
 *     choice of plan (keep/pick, nothing written), then that plan; none → B as it always was;
 *   - pressing it updates THAT plan: one write, no new plan;
 *   - every door's keep: a name you already have is said under the box before a keep makes a second of it, with the
 *     use-in choice where one applies;
 *   - B's steps read the plans where there may be some (someone signed in here, or a plan kept in this window); a visitor
 *     with neither loads nothing more than before.
 * Fictional: Sam, 41, still saving; Alex.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { h, render } from 'preact';
import { App } from '../../../src/v7/App.jsx';
import { answerB } from '../../../src/answers/b/answer.js';
import { SCHEMA_B } from '../../../src/answers/b/schema.js';
import { checkInputs, draftTextOf } from '../../../src/answers/shared/validate.js';
import { buildPlanSeed } from '../../../src/answers/keep/planSeed.js';
import { seedToScenario } from '../../../src/services/PlanFromSeed.js';
import { upgradeScenario } from '../../../src/firebase/scenarioMigration.js';
import { applyPatch } from '../../../src/answers/plan/about.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { A } from '../../../src/v7/state/actions.js';
import { parsedDraft, currentKey, keepView, useInOf, ownSavingPlans } from '../../../src/v7/state/select.js';
import { initialState } from '../../../src/v7/state/initial.js';
import { createStore } from '../../../src/v7/effects/store.js';
import { startPlanWrite } from '../../../src/v7/effects/planWrite.js';
import { upgradedList, viewFor } from '../../../src/v7/effects/planSource.js';
import { parse } from '../../../src/v7/router/routes.js';
import { KEEP } from '../../../src/v7/copy/keep.js';
import { noon } from './_plans.js';

const DAY = '2026-11-04';
const ENV = { today: DAY, futures: 100, seed: 0, detail: 'answer' };
const copy = (v) => JSON.parse(JSON.stringify(v));
const tick = async (n = 10) => { for (let i = 0; i < n; i++) await new Promise((r) => setTimeout(r, 0)); };

/** Sam, 41, still saving (fictional): question B's inputs, with the pay-in as given. */
const sam = (payIn) => ({ household: 'single', you: { pot: 62000, age: 41, statePension: { kind: 'full' }, finalSalary: { has: false }, payIn },
  stop: { age: 63 }, spend: { kind: 'amount', amount: 1810 }, endAge: 95 });
const checked = (inputs) => checkInputs(SCHEMA_B, inputs, { today: DAY }).inputs;
const PAY = { kind: 'split', own: 2500, employer: 1000 };            // on course: one "Use these" button, no pay-in choice

/** B's answer kept as a plan, as "Keep this as a plan" makes it, read as the plan source reads it. */
function keptPlan(inputs, { id, name, who = null, extra = {} }) {
  const result = answerB(checked(inputs), ENV);
  const seed = buildPlanSeed({ source: 'b', result, env: { today: DAY, appVersion: 'test' }, name, createdAt: DAY + 'T10:00:00.000Z' });
  const made = seedToScenario(seed, DAY).yours;
  made.id = id;
  made.createdAt = made.lastModified = DAY + 'T10:00:00.000Z';
  if (who) made.fromAnswer = { ...(made.fromAnswer || {}), who };
  return { ...upgradeScenario(copy(made), { now: noon(DAY) }).scenario, ...extra };
}

/**
 * A page on B's answer, B started afresh (no plan opened, nothing kept): the plans as the plan source reads them, the answer
 * worked out for what is typed, and the one write file running.
 */
function page(plans, { source = 'account', payIn = PAY } = {}) {
  const docs = plans.map(copy);
  const writes = [], adds = [];
  const fb = {
    doc: (db, ...path) => ({ path: path.join('/'), id: path[path.length - 1] }),
    collection: (db, ...path) => ({ path: path.join('/') }),
    updateDoc: (ref, data) => { writes.push({ id: ref.id, data: copy(data) }); const i = docs.findIndex((d) => d.id === ref.id); docs[i] = applyPatch(docs[i], copy(data)); return Promise.resolve(); },
    addDoc: (coll, data) => { adds.push(copy(data)); return Promise.resolve({ id: 'New' + adds.length }); },
    deleteDoc: () => Promise.resolve()
  };
  const store = createStore(initialState({ today: DAY, build: 'test' }), reduce);
  const read = () => {
    store.dispatch({ type: A.PLANS_SET, list: upgradedList(copy(docs), noon(DAY)), source, readAt: '14:03' });
    store.dispatch({ type: A.PLANS_VIEW, view: viewFor(store.getState()) });
  };
  store.dispatch({ type: A.SESSION_SET, session: source === 'account' ? { kind: 'in', email: 'sam@example.com' } : { kind: 'nobody', email: null } });
  read();
  store.subscribe((s, a) => { if (a.type === A.PLANS_READING) Promise.resolve().then(read); });
  // B from the front door: the figures typed, no plan named
  store.dispatch({ type: A.DRAFT_LOAD, q: 'b', values: draftTextOf(SCHEMA_B, checked(sam(payIn))) });
  const key = currentKey(store.getState(), 'b');
  store.dispatch({ type: A.ANSWER_WORKING, q: 'b', inputsKey: key });
  store.dispatch({ type: A.ANSWER_FINAL, q: 'b', inputsKey: key, result: answerB(parsedDraft(store.getState(), 'b').inputs, ENV) });
  store.dispatch({ type: A.ROUTE_SET, route: parse('#/b/answer') });
  const handles = () => ({ db: { name: 'db' }, user: { uid: 'u1', email: 'sam@example.com', emailVerified: true }, reread: () => { read(); return Promise.resolve(); } });
  const tab = new Map();
  const session = { getItem: (k) => (tab.has(k) ? tab.get(k) : null), setItem: (k, v) => tab.set(k, v), removeItem: (k) => tab.delete(k) };
  const stop = startPlanWrite(store, { handles, session, fb, now: () => noon(DAY), later: () => {} });
  return { store, writes, adds, docs, stop };
}

function draw(state) {
  const root = document.createElement('div');
  root.id = 'app';
  render(h(App, { state, dispatch: () => {} }), root);
  return root;
}
const one = (root, id) => root.querySelector(`[data-testid="${id}"]`);

const SAM = () => keptPlan(sam({ kind: 'split', own: 400, employer: 200 }), { id: 'SamSave01', name: 'Sam saving' });

describe('your own saving plan, when B knows no plan', () => {
  it('one: "Use these in ‘Sam saving’" leads, "Keep as a new plan" is second, its box a different name', () => {
    const p = page([SAM()]);
    const st = p.store.getState();
    expect(st.draft.b.fromPlan).toBeUndefined();
    expect(useInOf(st, 'b')).toMatchObject({ id: 'SamSave01', name: 'Sam saving', from: 'own', ready: true, can: true, why: null, choices: null });
    const root = draw(st);
    expect(one(root, 'b.use.own').textContent).toBe('You already have a saving plan, ‘Sam saving’. Trying figures here changes nothing in it until you use them.');
    expect(one(root, 'b.action.use').textContent).toBe('Use these in ‘Sam saving’');
    expect(one(root, 'b.action.use').className).toContain('primary');
    expect(one(root, 'b.action.save').textContent).toBe(KEEP.saveNew);
    expect(one(root, 'b.action.save').className).not.toContain('primary');
    expect(one(root, 'b.keep.secondTitle').textContent).toBe(KEEP.newTitle);
    expect(one(root, 'b.keep.name').value).not.toBe('Sam saving');
    p.stop();
  });

  it('pressing it updates that plan: one write, no new plan, and the plans stay one', async () => {
    const p = page([SAM()]);
    p.store.dispatch({ type: A.KEEP_USE, q: 'b' });
    await tick();
    expect(p.writes.map((w) => w.id)).toEqual(['SamSave01']);
    expect(p.adds).toEqual([]);
    expect(p.docs.length).toBe(1);
    expect(p.store.getState().keep.b.used).toMatchObject({ planId: 'SamSave01', name: 'Sam saving' });
    expect(p.store.getState().plans.list.length).toBe(1);
    p.stop();
  });

  it('a visitor: this window\'s plans, the same', () => {
    const p = page([SAM()], { source: 'window' });
    expect(useInOf(p.store.getState(), 'b')).toMatchObject({ id: 'SamSave01', from: 'own', can: true });
    p.stop();
  });

  it('several: a choice of plan, nothing pressable until one is picked; picking writes nothing', () => {
    const alex = keptPlan(sam({ kind: 'split', own: 300, employer: 150 }), { id: 'AlexSave1', name: 'Alex saving' });
    const p = page([SAM(), alex]);
    let st = p.store.getState();
    const u = useInOf(st, 'b');
    expect(u).toMatchObject({ id: null, name: null, from: 'own', can: false, why: 'pick' });
    expect(u.choices.map((c) => c.id).sort()).toEqual(['AlexSave1', 'SamSave01']);
    let root = draw(st);
    expect(one(root, 'b.use.pick').querySelector('legend').textContent).toBe(KEEP.use.pickLegend);
    expect(one(root, 'b.action.use')).toBe(null);
    expect(one(root, 'b.use.why')).toBe(null);
    expect(reduce(st, { type: A.KEEP_USE, q: 'b' }).ui.saving).toBe(null);
    // a plan that is not one of the choices is not picked
    expect(reduce(st, { type: A.KEEP_PICK, q: 'b', planId: 'Nope1' })).toBe(st);
    p.store.dispatch({ type: A.KEEP_PICK, q: 'b', planId: 'AlexSave1' });
    st = p.store.getState();
    expect(useInOf(st, 'b')).toMatchObject({ id: 'AlexSave1', name: 'Alex saving', can: true });
    root = draw(st);
    expect(one(root, 'b.use.pick.AlexSave1').checked).toBe(true);
    expect(one(root, 'b.action.use').textContent).toBe('Use these in ‘Alex saving’');
    expect(p.writes).toEqual([]);
    expect(reduce(st, { type: A.KEEP_USE, q: 'b' }).ui.saving).toMatchObject({ planId: 'AlexSave1', kind: 'useAnswer' });
    // started again: the pick goes with the answer
    expect(reduce(st, { type: A.DRAFT_RESET, q: 'b' }).keep.b.pick).toBeUndefined();
    p.stop();
  });

  it('none of your own: B as it always was (the example, a closed plan, a read-only one, a partner\'s, a drawing plan never count)', () => {
    const example = keptPlan(sam(PAY), { id: 'Example01', name: 'An example', extra: { example: true } });
    const partner = keptPlan(sam(PAY), { id: 'Partner01', name: 'Sam saving · partner', who: 'partner' });
    const p = page([example, partner]);
    expect(ownSavingPlans(p.store.getState())).toEqual([]);
    expect(useInOf(p.store.getState(), 'b')).toBe(null);
    const root = draw(p.store.getState());
    expect(one(root, 'b.use')).toBe(null);
    expect(one(root, 'b.action.save').className).toContain('primary');
    p.stop();
  });

  it('a household set up in the full view: the plan the main plan is linked with is the partner\'s', () => {
    const mine = keptPlan(sam(PAY), { id: 'Mine01', name: 'Sam saving', extra: { isActive: true, household: { partnerScenarioId: 'Theirs01' } } });
    const theirs = keptPlan(sam(PAY), { id: 'Theirs01', name: 'Alex saving', extra: { isActive: false } });
    const p = page([mine, theirs]);
    expect(ownSavingPlans(p.store.getState()).map((x) => x.id)).toEqual(['Mine01']);
    p.stop();
  });

  it('while the plans are not read, nothing is offered (no "Looking for your plan" for someone with none)', () => {
    let s = initialState({ today: DAY, build: 'test' });
    s = reduce(s, { type: A.DRAFT_LOAD, q: 'b', values: draftTextOf(SCHEMA_B, checked(sam(PAY))) });
    expect(ownSavingPlans(s)).toBe(null);
    expect(useInOf(s, 'b')).toBe(null);
  });
});

describe('a name you already have, said before a keep makes a second of it', () => {
  it('B: under the box, with what a keep would make; "Use these in ‘…’ instead" where that plan can take them', () => {
    const alex = keptPlan(sam({ kind: 'split', own: 300, employer: 150 }), { id: 'AlexSave1', name: 'Alex saving' });
    const p = page([SAM(), alex]);
    p.store.dispatch({ type: A.KEEP_NAME, q: 'b', value: 'sam saving' });
    const st = p.store.getState();
    expect(keepView(st, 'b').sameName).toEqual({ name: 'Sam saving', makes: 'sam saving (2)', useId: 'SamSave01' });
    const root = draw(st);
    expect(one(root, 'b.keep.sameName').textContent).toContain('You already have a plan called ‘Sam saving’. Keeping makes a new plan, ‘sam saving (2)’.');
    expect(one(root, 'b.keep.sameName.use').textContent).toBe('Use these in ‘Sam saving’ instead');
    // its press picks that plan: "Use these in ‘Sam saving’" is then on the page, and nothing has been written
    p.store.dispatch({ type: A.KEEP_PICK, q: 'b', planId: 'SamSave01' });
    expect(useInOf(p.store.getState(), 'b')).toMatchObject({ id: 'SamSave01', can: true });
    expect(p.writes).toEqual([]);
    expect(p.adds).toEqual([]);
    // a name nobody has: nothing said
    p.store.dispatch({ type: A.KEEP_NAME, q: 'b', value: 'Sam saving for later' });
    expect(keepView(p.store.getState(), 'b').sameName).toBe(null);
    p.stop();
  });

  it('every door: C\'s keep says it too, with no use-in choice', () => {
    let s = reduce(initialState({ today: DAY, build: 'test' }), { type: A.PLANS_SET, list: [{ plan: SAM(), newer: false, failed: false }], source: 'account', readAt: '14:03' });
    s = reduce(s, { type: A.DRAFT_SET, q: 'c', path: 'you.pot', value: '250000' });
    s = reduce(s, { type: A.DRAFT_SET, q: 'c', path: 'you.age', value: '58' });
    const key = currentKey(s, 'c');
    const result = { status: 'ok', level: 'balanced', levels: { careful: { monthly: 1000 }, balanced: { monthly: 1100 }, bold: { monthly: 1300 } }, basis: { historyEnd: '2025-12' }, inputs: parsedDraft(s, 'c').inputs };
    s = reduce(s, { type: A.ANSWER_WORKING, q: 'c', inputsKey: key });
    s = reduce(s, { type: A.ANSWER_FINAL, q: 'c', inputsKey: key, result });
    s = reduce(s, { type: A.KEEP_NAME, q: 'c', value: 'Sam saving' });
    const v = keepView(s, 'c');
    if (v.can) expect(v.sameName).toEqual({ name: 'Sam saving', makes: 'Sam saving (2)', useId: null });
    else expect(v.sameName).toBe(null);
  });
});

describe('B reads the plans on its steps, where there may be plans', () => {
  it('signed in here, or a plan kept in this window: the plan source loads on B\'s steps and when a keep name is typed; a visitor with neither loads nothing more', () => {
    const src = readFileSync(join(process.cwd(), 'src/v7/effects/index.js'), 'utf8');
    expect(src).toMatch(/const mayHavePlans = \(state\) => signedInHere \|\| keptInWindow\(state\);/);
    expect(src).toMatch(/const keptInWindow = \(state\) => [^;]*k\.made\.where === 'window'\);/);
    expect(src).toMatch(/const onB = \(state\) => !!state\.route && state\.route\.screen === 'step' && state\.route\.q === 'b'\s*&& \(!!\(state\.draft\.b && state\.draft\.b\.fromPlan\) \|\| keptSaver\(state\) \|\| mayHavePlans\(state\)\);/);
    expect(src).toMatch(/const naming = \(state\) => mayHavePlans\(state\) && /);
    expect(src).toMatch(/needsPlans = \(state\) => [^;]*onB\(state\) \|\| naming\(state\)/);
  });
});
