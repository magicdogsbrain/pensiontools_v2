/**
 * "Use these in ‘{plan}’" (6.59.0): "Am I saving enough?" opened from a saver's plan writes its saving figures back onto THAT
 * plan, and only when the person presses it — trying figures writes nothing, and a new plan is made only by an explicit keep.
 *   - answers/plan/useAnswer.js: what goes in (a share of pay, or pounds, as the check-in's "Use these in my plan" writes it),
 *     at the pay-in chosen (as now, or on course), and nothing else of the plan; refused for a plan not still saving, an
 *     answer for two, an answer that says you have stopped;
 *   - the state: the rail's link records the plan's id in B's draft (kept by the draft store; dropped when B is started
 *     again, filled from another question, or the plan is gone, closed or no longer a saver's);
 *   - the one write file: ONE updateDoc of What you pay in's own settings and the stamp, with Undo; no addDoc;
 *   - the panel: "Use these in ‘…’" first; "Keep as a new plan" second, its name made different from every plan's.
 * Fictional: Sam, 41, still saving.
 */
import { describe, it, expect } from 'vitest';
import { h, render } from 'preact';
import { App } from '../../../src/v7/App.jsx';
import { answerB } from '../../../src/answers/b/answer.js';
import { SCHEMA_B } from '../../../src/answers/b/schema.js';
import { checkInputs, draftTextOf } from '../../../src/answers/shared/validate.js';
import { buildPlanSeed } from '../../../src/answers/keep/planSeed.js';
import { seedToScenario } from '../../../src/services/PlanFromSeed.js';
import { upgradeScenario } from '../../../src/firebase/scenarioMigration.js';
import { saverInputsOf } from '../../../src/answers/plan/saverInputs.js';
import { applyPatch } from '../../../src/answers/plan/about.js';
import { answerInPlanPatch, answerPayInOf } from '../../../src/answers/plan/useAnswer.js';
import { useInPlanPatch } from '../../../src/answers/plan/checkIn.js';
import { SAVER_STAGES } from '../../../src/answers/plan/steps.js';
import { SAVING_WRITES } from '../../../src/answers/plan/schema.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { A } from '../../../src/v7/state/actions.js';
import { parsedDraft, currentKey, keepView, useInOf, SAVER_STAGE_KEYS } from '../../../src/v7/state/select.js';
import { saveDraft, loadDraft, draftOf } from '../../../src/v7/effects/draftStore.js';
import { initialState } from '../../../src/v7/state/initial.js';
import { createStore } from '../../../src/v7/effects/store.js';
import { startPlanWrite } from '../../../src/v7/effects/planWrite.js';
import { upgradedList, viewFor } from '../../../src/v7/effects/planSource.js';
import { parse } from '../../../src/v7/router/routes.js';
import { KEEP } from '../../../src/v7/copy/keep.js';
import { railFor } from '../../../src/v7/rail/index.js';
import { noon } from './_plans.js';

const DAY = '2026-11-04';
const ENV = { today: DAY, futures: 100, seed: 0, detail: 'answer' };
const copy = (v) => JSON.parse(JSON.stringify(v));
const tick = async (n = 10) => { for (let i = 0; i < n; i++) await new Promise((r) => setTimeout(r, 0)); };

/** Sam, 41, still saving (fictional): question B's inputs, with the pay-in as given. */
const sam = (payIn, more = {}) => ({ household: 'single', you: { pot: 62000, age: 41, statePension: { kind: 'full' }, finalSalary: { has: false }, payIn },
  stop: { age: 63 }, spend: { kind: 'amount', amount: 1810 }, endAge: 95, ...more });
const checked = (inputs) => checkInputs(SCHEMA_B, inputs, { today: DAY }).inputs;

/** B's answer kept as a plan, as "Keep this as a plan" makes it, read as the plan source reads it. */
function keptPlan(inputs, { id = 'SamSaving01', name = 'Sam saving' } = {}) {
  const result = answerB(checked(inputs), ENV);
  const seed = buildPlanSeed({ source: 'b', result, env: { today: DAY, appVersion: 'test' }, name, createdAt: DAY + 'T10:00:00.000Z' });
  const made = seedToScenario(seed, DAY).yours;
  made.id = id;
  // stamped as the store stamps a new plan (FirestoreService.createScenario)
  made.createdAt = made.lastModified = DAY + 'T10:00:00.000Z';
  return upgradeScenario(copy(made), { now: noon(DAY) }).scenario;
}
const settingsOf = (plan) => plan.accumulationTool.settings;

describe('useAnswer.js: the answer\'s saving figures onto the plan, nothing else', () => {
  const plan = keptPlan(sam({ kind: 'split', own: 333.33, employer: 211.17 }));

  it('pounds: what lands from you and your employer, under the plan\'s scheme; the ages, the pot and the rise as the plan has them', () => {
    const tried = answerB(checked(sam({ kind: 'split', own: 500, employer: 250 }, { savingsIn: 120 })), ENV);
    const p = answerInPlanPatch(plan, tried, { today: DAY });
    expect(p.ok).toBe(true);
    expect(Object.keys(p.patch)).toEqual(['accumulationTool.settings']);
    for (const k of Object.keys(p.patch)) expect(SAVING_WRITES).toContain(k);
    const before = settingsOf(plan), after = p.patch['accumulationTool.settings'];
    expect(after.netMonthly).toBe(400);           // relief at source: £500 lands for £400 from take-home pay
    expect(after.employerMonthly).toBe(250);
    expect(after.isaMonthly).toBe(120);
    for (const k of ['currentAge', 'retirementAge', 'potNow', 'escalationPct', 'schemeType']) expect(after[k], k).toEqual(before[k]);
    expect(p.previous['accumulationTool.settings']).toEqual(before);
    // the plan as written reads back as the answer's pay-in
    const written = applyPatch(plan, p.patch);
    expect(saverInputsOf(written, { today: DAY }).inputs.you.payIn).toEqual({ kind: 'split', own: 500, employer: 250 });
    expect(p.line).toEqual({ id: 'usedAnswer', slots: { name: 'Sam saving', payIn: '£750 a month', savings: '£120' } });
  });

  it('the same figures as the plan: nothing to write, and it says so', () => {
    const same = answerB(checked(sam({ kind: 'split', own: 333.33, employer: 211.17 })), ENV);
    const p = answerInPlanPatch(plan, same, { today: DAY });
    expect(p).toMatchObject({ ok: true, patch: {}, line: { id: 'usedSame' } });
  });

  it('a share of pay is kept as the share; "on course" writes the answer\'s own on-course figure', () => {
    const sharePlan = keptPlan(sam({ kind: 'share', pay: 38000, ownPct: 6, employerPct: 4 }));
    const tried = answerB(checked(sam({ kind: 'share', pay: 38000, ownPct: 3, employerPct: 4 })), ENV);
    const now = answerInPlanPatch(sharePlan, tried, { today: DAY });
    expect(now.patch['accumulationTool.settings']).toMatchObject({ payInKind: 'share', ownPct: 3, employerPct: 4, salary: 38000 });
    expect(now.line.slots.payIn).toMatch(/^7% of your pay \(£\d{3} a month\)$/);
    if (tried.verdict.band !== 'yes' && tried.enough && tried.enough.atLevel) {
      const on = answerInPlanPatch(sharePlan, tried, { today: DAY, payIn: 'enough' });
      const a = answerPayInOf(tried, { payIn: 'enough' });
      expect(on.patch['accumulationTool.settings'].ownPct).toBe(a.payIn.ownPct);
      expect(a.payIn.ownPct).toBeGreaterThan(3);
    }
  });

  it('the same settings the check-in\'s "Use these in my plan" writes for the same pay-in', () => {
    const tried = answerB(checked(sam({ kind: 'split', own: 500, employer: 250 })), ENV);
    const fromAnswer = answerInPlanPatch(plan, tried, { today: DAY }).patch['accumulationTool.settings'];
    const ci = { date: DAY, pay: null, pot: { pension: 62000 }, payIn: { kind: 'split', own: 500, employer: 250, total: 750, savingsIn: 0 } };
    const withCheckIn = { ...copy(plan), accumulationTool: { ...copy(plan.accumulationTool), checkIns: [ci] } };
    expect(useInPlanPatch(withCheckIn, { today: DAY }).patch['accumulationTool.settings']).toEqual(fromAnswer);
  });

  it('refused: an answer for two, an answer that says you have stopped, a plan no longer saving', () => {
    const couple = answerB(checked({ ...sam({ kind: 'total', total: 700 }), household: 'couple', partner: { pot: 10000, age: 40, statePension: { kind: 'full' }, finalSalary: { has: false }, payIn: { kind: 'total', total: 200 } } }), ENV);
    expect(answerInPlanPatch(plan, couple, { today: DAY })).toEqual({ ok: false, problem: 'couple' });
    expect(answerPayInOf({ inputs: { household: 'single', you: {} }, saving: [{ who: 'you', yearsSaving: 0 }] })).toEqual({ ok: false, problem: 'stopped' });
    const retired = applyPatch(plan, { 'stressTool.settings.retired': true, 'stressTool.settings.retireAge': 41 });
    const p = answerInPlanPatch(retired, answerB(checked(sam({ kind: 'total', total: 900 })), ENV), { today: DAY });
    expect(p).toEqual({ ok: false, problem: 'notSaving' });
  });
});

describe('the state: B linked to the plan it was opened from', () => {
  const plan = keptPlan(sam({ kind: 'split', own: 333.33, employer: 211.17 }));
  const entries = [{ plan, newer: false, failed: false }];
  const onPlan = () => {
    let s = initialState({ today: DAY, build: 'test' });
    s = reduce(s, { type: A.ROUTE_SET, route: parse('#/plan/' + plan.id + '/saving') });
    s = reduce(s, { type: A.SESSION_SET, session: { kind: 'in', email: 'sam@example.com' } });
    s = reduce(s, { type: A.PLANS_SET, list: entries, source: 'account', readAt: '14:03' });
    return reduce(s, { type: A.PLANS_VIEW, view: viewFor(s) });
  };
  const values = draftTextOf(SCHEMA_B, checked(sam({ kind: 'split', own: 333.33, employer: 211.17 })));
  const opened = () => reduce(onPlan(), { type: A.DRAFT_LOAD, q: 'b', values, planId: plan.id });

  it('the shell names the same saver stages as the plan reader', () => {
    expect([...SAVER_STAGE_KEYS]).toEqual([...SAVER_STAGES]);
  });
  it('the rail\'s load records the plan; the tab keeps it across a reload; starting again or figures from another question drop it', () => {
    const s = opened();
    expect(s.draft.b.fromPlan).toBe(plan.id);
    expect(() => reduce(onPlan(), { type: A.DRAFT_LOAD, q: 'a', values: {}, planId: plan.id })).toThrow();
    const tab = new Map();
    const store = { getItem: (k) => (tab.has(k) ? tab.get(k) : null), setItem: (k, v) => tab.set(k, v), removeItem: (k) => tab.delete(k) };
    saveDraft(store, draftOf(s));
    expect(initialState({ today: DAY, draft: loadDraft(store) }).draft.b.fromPlan).toBe(plan.id);
    expect(reduce(s, { type: A.DRAFT_RESET, q: 'b' }).draft.b.fromPlan).toBeUndefined();
    expect(reduce(s, { type: A.DRAFT_LOAD, q: 'b', values }).draft.b.fromPlan).toBeUndefined();
  });
  it('the plan gone, closed or no longer a saver\'s, as the plans read say: the link goes', () => {
    const s = opened();
    const gone = reduce(reduce(s, { type: A.PLANS_SET, list: [], source: 'account', readAt: '14:04' }), { type: A.PLANS_VIEW, view: { today: DAY, rows: [], page: null } });
    expect(gone.draft.b.fromPlan).toBeUndefined();
    const closedRows = viewFor(s).rows.map((g) => ({ ...g, rows: g.rows.map((r) => ({ ...r, closed: true, stageKey: 'closed' })) }));
    expect(reduce(s, { type: A.PLANS_VIEW, view: { today: DAY, rows: closedRows, page: null } }).draft.b.fromPlan).toBeUndefined();
    const drawing = viewFor(s).rows.map((g) => ({ ...g, rows: g.rows.map((r) => ({ ...r, stageKey: 'draft-retired' })) }));
    expect(reduce(s, { type: A.PLANS_VIEW, view: { today: DAY, rows: drawing, page: null } }).draft.b.fromPlan).toBeUndefined();
    // still a saver's plan: kept
    expect(reduce(s, { type: A.PLANS_VIEW, view: viewFor(s) }).draft.b.fromPlan).toBe(plan.id);
  });
  it('the reader: the plan named once the answer is up to date; an answer for two refused in words', () => {
    let s = opened();
    expect(useInOf(s, 'b')).toMatchObject({ id: plan.id, name: 'Sam saving', from: 'opened', ready: true, can: false, why: 'noAnswer' });
    const key = currentKey(s, 'b');
    s = reduce(s, { type: A.ANSWER_WORKING, q: 'b', inputsKey: key });
    s = reduce(s, { type: A.ANSWER_FINAL, q: 'b', inputsKey: key, result: answerB(parsedDraft(s, 'b').inputs, ENV) });
    expect(useInOf(s, 'b')).toMatchObject({ can: true, why: null });
    expect(keepView(s, 'b').useIn.id).toBe(plan.id);
    // the person tries other figures: the answer is not for what is typed until it is worked out again
    const tried = reduce(s, { type: A.DRAFT_SET, q: 'b', path: 'you.payIn.own', value: '500' });
    expect(useInOf(tried, 'b').can).toBe(false);
    expect(reduce(tried, { type: A.KEEP_USE, q: 'b' }).ui.saving).toBe(null);
  });
});

/** A page signed in on B's answer, opened from the plan, the answer worked out for what is typed; the one write file running. */
function page(plan, payIn, { more = {}, others = [] } = {}) {
  const docs = [copy(plan), ...others.map(copy)];
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
    store.dispatch({ type: A.PLANS_SET, list: upgradedList(copy(docs), noon(DAY)), source: 'account', readAt: '14:03' });
    store.dispatch({ type: A.PLANS_VIEW, view: viewFor(store.getState()) });
  };
  store.dispatch({ type: A.SESSION_SET, session: { kind: 'in', email: 'sam@example.com' } });
  read();
  // the plan source reads the plans again after a write, as the page does (after the write's own dispatches)
  store.subscribe((s, a) => { if (a.type === A.PLANS_READING) Promise.resolve().then(read); });
  store.dispatch({ type: A.DRAFT_LOAD, q: 'b', values: draftTextOf(SCHEMA_B, checked(sam(payIn, more))), planId: plan.id });
  const key = currentKey(store.getState(), 'b');
  store.dispatch({ type: A.ANSWER_WORKING, q: 'b', inputsKey: key });
  store.dispatch({ type: A.ANSWER_FINAL, q: 'b', inputsKey: key, result: answerB(parsedDraft(store.getState(), 'b').inputs, ENV) });
  store.dispatch({ type: A.ROUTE_SET, route: parse('#/b/answer') });
  const handles = () => ({ db: { name: 'db' }, user: { uid: 'u1', email: 'sam@example.com', emailVerified: true }, reread: () => { read(); return Promise.resolve(); } });
  const stop = startPlanWrite(store, { win: null, session: null, local: null, now: () => new Date(DAY + 'T15:00:00.000Z'), fb, client: null, handles });
  return { store, writes, adds, docs, stop };
}

describe('the one write file: "Use these in ‘…’" is ONE write of What you pay in\'s settings, with Undo; never a new plan', () => {
  const plan = keptPlan(sam({ kind: 'split', own: 333.33, employer: 211.17 }));

  it('trying several sets of figures writes nothing; the press writes the plan B came from, once; Undo puts it back', async () => {
    const p = page(plan, { kind: 'split', own: 333.33, employer: 211.17 });
    for (const own of ['400', '450', '500']) p.store.dispatch({ type: A.DRAFT_SET, q: 'b', path: 'you.payIn.own', value: own });
    await tick();
    expect(p.writes).toEqual([]);
    expect(p.adds).toEqual([]);
    // worked out for what is typed now (£500 from you), then used
    const key = currentKey(p.store.getState(), 'b');
    p.store.dispatch({ type: A.ANSWER_WORKING, q: 'b', inputsKey: key });
    p.store.dispatch({ type: A.ANSWER_FINAL, q: 'b', inputsKey: key, result: answerB(parsedDraft(p.store.getState(), 'b').inputs, ENV) });
    p.store.dispatch({ type: A.KEEP_USE, q: 'b' });
    expect(p.store.getState().ui.saving).toMatchObject({ planId: plan.id, kind: 'useAnswer', payIn: 'now' });
    await tick();
    expect(p.adds).toEqual([]);
    expect(p.writes.length).toBe(1);
    expect(p.writes[0].id).toBe(plan.id);
    expect(Object.keys(p.writes[0].data).sort()).toEqual(['accumulationTool.settings', 'lastModified']);
    expect(p.writes[0].data['accumulationTool.settings']).toMatchObject({ netMonthly: 400, employerMonthly: 211.17 });
    const s = p.store.getState();
    expect(s.keep.b.used).toMatchObject({ planId: plan.id, name: 'Sam saving', line: { id: 'usedAnswer' } });
    expect(s.ui.toast).toMatchObject({ planId: plan.id, kind: 'saved', op: 'saving' });
    expect(s.keep.b.made).toBe(null);
    // Undo: the previous settings and stamp back, byte for byte
    p.store.dispatch({ type: A.PLAN_UNDO, planId: plan.id });
    await tick();
    expect(p.writes.length).toBe(2);
    expect(p.writes[1].data['accumulationTool.settings']).toEqual(settingsOf(plan));
    expect(p.writes[1].data.lastModified).toBe(plan.lastModified);
    expect(p.store.getState().keep.b.used).toBe(null);
    expect(p.adds).toEqual([]);
    p.stop();
  });

  it('a saver\'s plan with no settings of what goes in: Undo puts back null, the account\'s "absent", and the plan reads as before', async () => {
    const bare = copy(plan);
    delete bare.accumulationTool;
    const before = saverInputsOf(bare, { today: DAY });
    const p = page(bare, { kind: 'split', own: 500, employer: 250 });
    p.store.dispatch({ type: A.KEEP_USE, q: 'b' });
    await tick();
    expect(p.writes.length).toBe(1);
    p.store.dispatch({ type: A.PLAN_UNDO, planId: plan.id });
    await tick();
    expect(p.writes[1].data['accumulationTool.settings']).toBe(null);
    const back = p.docs.find((d) => d.id === plan.id);
    expect(saverInputsOf(back, { today: DAY })).toEqual(before);
    p.stop();
  });

  it('a locked saver\'s plan takes it too (what goes in is outside the lock, as the planner\'s own page is)', async () => {
    const locked = applyPatch(plan, { 'decisionTool.settings.locked': true, 'decisionTool.settings.lockedAt': DAY + 'T09:00:00.000Z' });
    const p = page(locked, { kind: 'split', own: 500, employer: 250 });
    p.store.dispatch({ type: A.KEEP_USE, q: 'b' });
    await tick();
    expect(p.writes.length).toBe(1);
    expect(p.store.getState().ui.saveProblem).toBe(null);
    p.stop();
  });
});

describe('the plan B was opened from last leads: a plan kept earlier from other figures never takes these', () => {
  // fictional: Alex's saving plan was kept from B earlier in this window; B is then opened from Sam's saving plan
  const alex = keptPlan(sam({ kind: 'split', own: 333.33, employer: 211.17 }), { id: 'KeptX1', name: 'Alex saving' });
  const samPlan = keptPlan(sam({ kind: 'split', own: 400, employer: 200 }), { id: 'OtherY1', name: 'Sam saving' });
  const KEPT = { type: A.KEEP_MADE, q: 'b', id: 'KeptX1', name: 'Alex saving', where: 'account', saverId: 'KeptX1' };
  const answered = (s) => {
    const key = currentKey(s, 'b');
    s = reduce(s, { type: A.ANSWER_WORKING, q: 'b', inputsKey: key });
    return reduce(s, { type: A.ANSWER_FINAL, q: 'b', inputsKey: key, result: answerB(parsedDraft(s, 'b').inputs, ENV) });
  };
  const both = () => {
    let s = initialState({ today: DAY, build: 'test' });
    s = reduce(s, { type: A.SESSION_SET, session: { kind: 'in', email: 'sam@example.com' } });
    s = reduce(s, { type: A.PLANS_SET, list: [alex, samPlan].map((plan) => ({ plan, newer: false, failed: false })), source: 'account', readAt: '14:03' });
    s = reduce(s, { type: A.ROUTE_SET, route: parse('#/plans') });
    return reduce(s, { type: A.PLANS_VIEW, view: viewFor(s) });
  };
  const fill = (plan, payIn) => ({ type: A.DRAFT_LOAD, q: 'b', values: draftTextOf(SCHEMA_B, checked(sam(payIn))), planId: plan.id });

  it('the reducer: kept from B, then B opened from another saver\'s plan — that plan is named and used; the earlier "Kept as" goes with its answer', () => {
    let s = answered(reduce(both(), fill(alex, { kind: 'split', own: 333.33, employer: 211.17 })));
    s = reduce(s, KEPT);
    expect(useInOf(s, 'b')).toMatchObject({ id: 'KeptX1', from: 'kept', can: true });
    s = answered(reduce(s, fill(samPlan, { kind: 'split', own: 450, employer: 200 })));
    expect(s.keep.b).toMatchObject({ made: null, used: null, pending: null });
    expect(useInOf(s, 'b')).toMatchObject({ id: 'OtherY1', name: 'Sam saving', from: 'opened', ready: true, can: true });
    expect(keepView(s, 'b').useIn.id).toBe('OtherY1');
    expect(reduce(s, { type: A.KEEP_USE, q: 'b' }).ui.saving).toMatchObject({ planId: 'OtherY1', kind: 'useAnswer' });
    // started again, or filled from another question: a new answer — the plan kept from the one before does not lead it
    const kept = reduce(answered(reduce(both(), fill(alex, { kind: 'split', own: 333.33, employer: 211.17 }))), KEPT);
    expect(reduce(kept, { type: A.DRAFT_RESET, q: 'b' }).keep.b.made).toBe(null);
    expect(reduce(kept, { type: A.DRAFT_CARRY, from: 'a', to: 'b' }).keep.b.made).toBe(null);
    // trying other figures on the same answer keeps it: the plan kept from this answer still leads
    expect(reduce(kept, { type: A.DRAFT_SET, q: 'b', path: 'you.payIn.own', value: '500' }).keep.b.made).toMatchObject({ id: 'KeptX1' });
  });

  it('the one write file: "Use these" writes the plan opened from, never the plan kept earlier', async () => {
    const p = page(alex, { kind: 'split', own: 333.33, employer: 211.17 }, { others: [samPlan] });
    p.store.dispatch(KEPT);
    p.store.dispatch(fill(samPlan, { kind: 'split', own: 450, employer: 200 }));
    const key = currentKey(p.store.getState(), 'b');
    p.store.dispatch({ type: A.ANSWER_WORKING, q: 'b', inputsKey: key });
    p.store.dispatch({ type: A.ANSWER_FINAL, q: 'b', inputsKey: key, result: answerB(parsedDraft(p.store.getState(), 'b').inputs, ENV) });
    p.store.dispatch({ type: A.KEEP_USE, q: 'b' });
    await tick();
    expect(p.writes.map((w) => w.id)).toEqual(['OtherY1']);
    expect(p.adds).toEqual([]);
    expect(p.store.getState().keep.b.used).toMatchObject({ planId: 'OtherY1', name: 'Sam saving' });
    p.stop();
  });

  it('a couple\'s keep whose saving plan is the partner\'s: never the plan "Use these" writes an answer for one person onto', () => {
    let s = answered(reduce(both(), fill(alex, { kind: 'split', own: 333.33, employer: 211.17 })));
    s = reduce(s, { type: A.KEEP_MADE, q: 'b', id: 'OtherY1', name: 'Sam saving', where: 'account', partnerId: 'KeptX1', partnerName: 'Alex saving', saverId: 'KeptX1' });
    const u = useInOf(s, 'b');
    expect(u.from).toBe('opened');
    expect(u.id).toBe('KeptX1');   // the plan B was opened from, which is why it is named: not because it was kept
    const noOpen = { ...s, draft: { ...s.draft, b: (({ fromPlan, ...rest }) => rest)(s.draft.b) } };
    expect(useInOf(noOpen, 'b')).toBe(null);
  });
});

describe('the rail and the keep step follow the panel: "Use these in your plan", never "Keep this as a plan"', () => {
  const plan = keptPlan(sam({ kind: 'split', own: 333.33, employer: 211.17 }));
  function draw(state) {
    const root = document.createElement('div');
    root.id = 'app';
    render(h(App, { state, dispatch: () => {} }), root);
    return root;
  }
  const one = (root, id) => root.querySelector(`[data-testid="${id}"]`);

  it('on course, opened from a plan: the next line and its button lead to using these figures in it', () => {
    const p = page(plan, { kind: 'split', own: 2500, employer: 1000 });
    const st = p.store.getState();
    expect(st.answers.b.result.onCourse).toBe(true);
    expect(railFor(st).next).toEqual({ id: 'b.onCourse', button: { labelId: 'b.action.useIn', href: '#/b/keep' } });
    const root = draw(st);
    expect(one(root, 'rail.next').querySelector('[data-next]').textContent).toBe('Next: you are on course. Try a change below, or use these figures in ‘Sam saving’.');
    expect(one(root, 'rail.next.button').textContent).toBe(KEEP.rail.buttons.useIn);
    expect(root.textContent).not.toContain('save this as a plan');
    p.stop();
  });

  it('the keep step: headed and led as "Use these in your plan", and its next line names the press that is on the page', () => {
    const p = page(plan, { kind: 'split', own: 500, employer: 250 });
    p.store.dispatch({ type: A.ROUTE_SET, route: parse('#/b/keep') });
    const st = p.store.getState();
    const root = draw(st);
    expect(root.querySelector('h1').textContent).toBe(KEEP.use.stepLabel);
    expect(root.querySelector('.lead').textContent).toBe(KEEP.use.stepLead);
    expect(one(root, 'rail.next').querySelector('[data-next]').textContent).toBe('Next: when you are happy with these figures, use them in ‘Sam saving’.');
    expect(root.textContent).not.toContain('press "Keep as a plan"');
    p.stop();
  });
});

describe('the panel: "Use these in ‘…’" first, "Keep as a new plan" second', () => {
  function draw(state) {
    const root = document.createElement('div');
    root.id = 'app';
    render(h(App, { state, dispatch: () => {} }), root);
    return root;
  }
  const one = (root, id) => root.querySelector(`[data-testid="${id}"]`);

  it('names the plan; the keep is plainly second with its own name box, never the plan\'s own name', () => {
    const tried = sam({ kind: 'split', own: 500, employer: 250 });
    const plan0 = keptPlan(sam({ kind: 'split', own: 333.33, employer: 211.17 }));
    const p = page(plan0, tried.you.payIn);
    // the plan's name is the suggestion the box would carry: the box makes it different
    const suggestion = keepView(p.store.getState(), 'b').suggested;
    p.stop();
    const named = { ...copy(plan0), planDetails: { ...plan0.planDetails, name: suggestion.replace(/ \(\d+\)$/, '') } };
    const q = page(named, tried.you.payIn);
    const st = q.store.getState();
    const root = draw(st);
    const name = named.planDetails.name;
    if (keepView(st, 'b').payIn) {
      // not on course: which pay-in the plan uses, two buttons, neither chosen — and the same choice, second, for a new plan
      expect(one(root, 'b.use.payIn').querySelector('legend').textContent).toBe('Which pay-in should ‘' + name + '’ use?');
      expect(one(root, 'b.action.use.now').textContent).toMatch(/^Use: paying in as now/);
      expect(one(root, 'b.action.use.now').className).toContain('primary');
      expect(one(root, 'b.action.use.enough').textContent).toMatch(/^Use: paying in .* \(on course\)$/);
      expect(one(root, 'b.action.save.now').className).not.toContain('primary');
    } else {
      expect(one(root, 'b.action.use').textContent).toBe('Use these in ‘' + name + '’');
      expect(one(root, 'b.action.use').className).toContain('primary');
      expect(one(root, 'b.action.save').textContent).toBe(KEEP.saveNew);
      expect(one(root, 'b.action.save').className).not.toContain('primary');
    }
    expect(one(root, 'b.keep.secondTitle').textContent).toBe(KEEP.newTitle);
    expect(one(root, 'b.keep.name').value).toBe(named.planDetails.name + ' (2)');
    expect(root.textContent).toContain('You opened this from ‘' + named.planDetails.name + '’. Trying figures here changes nothing in it until you use them.');
    q.stop();
  });

  it('after a keep from here, the plan kept leads "Use these", and that trying figures changes nothing in it is said once', () => {
    const opened = keptPlan(sam({ kind: 'split', own: 333.33, employer: 211.17 }), { id: 'OpenedP1', name: 'Alex saving' });
    const kept = keptPlan(sam({ kind: 'split', own: 500, employer: 250 }), { id: 'KeptZ1', name: 'Alex saving (2)' });
    const p = page(opened, { kind: 'split', own: 500, employer: 250 }, { others: [kept] });
    p.store.dispatch({ type: A.KEEP_MADE, q: 'b', id: 'KeptZ1', name: 'Alex saving (2)', where: 'account', saverId: 'KeptZ1' });
    const st = p.store.getState();
    expect(useInOf(st, 'b')).toMatchObject({ id: 'KeptZ1', from: 'kept' });
    const root = draw(st);
    expect(one(root, 'b.use').getAttribute('data-plan-id')).toBe('KeptZ1');
    expect(root.textContent.match(/changes nothing in/g).length).toBe(1);
    expect(KEEP.use.why.stopped).toBe('These figures say you have stopped work, so there is nothing to pay into ‘{name}’.');
    p.stop();
  });
});
