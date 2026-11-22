/**
 * "I accept this as my plan" (7.10.0; spec-7100 §3.3; answers/plan/agree.js): the Moving review's agreement, made from the run
 * held for the page — ONE write of `phases` and `planAmendments`; how the move was agreed; when it stops standing; withdraw
 * takes only its own entry; the bad-years panel's agreements and the review's never replace or withdraw each other; the
 * home's drift line rests while it stands. Fictional plans only (Alex).
 */
import { describe, it, expect } from 'vitest';
import { agreePatch, agreeWithdrawPatch, asHeldStateOf, howOf, agreementViewOf } from '../../../src/answers/plan/agree.js';
import { reviewOf, reviewRunKeyOf, runInputsOf, reviewSavePatch } from '../../../src/answers/plan/review.js';
import { stressKeyOf, stressAgreementOf, stressAmendPatch, stressWithdrawPatch, fingerprintOf, kindOfRow } from '../../../src/answers/plan/stressPanel.js';
import { homeOf } from '../../../src/answers/plan/home.js';
import { planPage } from '../../../src/answers/plan/read.js';
import { taskPatch } from '../../../src/answers/plan/tasks.js';
import { stageOf } from '../../../src/services/LifeStage.js';
import { agreementOf, phasesPatch, offCourseOf } from '../../../src/services/Phases.js';
import { documentAtOf } from '../../../src/services/PlanAmendments.js';
import { createStore } from '../../../src/v7/effects/store.js';
import { initialState } from '../../../src/v7/state/initial.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { A } from '../../../src/v7/state/actions.js';
import { startPlanWrite } from '../../../src/v7/effects/planWrite.js';
import { upgradedList, viewFor } from '../../../src/v7/effects/planSource.js';
import { parse } from '../../../src/v7/router/routes.js';
import { WEIGHT_ONE } from '../../../src/answers/shared/rules.js';
import { corpus, entryOf, noon, stateWith } from './_plans.js';
import { h, render } from 'preact';
import { App } from '../../../src/v7/App.jsx';

const C = corpus();
const copy = (v) => JSON.parse(JSON.stringify(v));
const DAY = '2026-10-02';
const AT = '2026-10-02T11:00:00.000Z';
const tick = async (n = 8) => { for (let i = 0; i < n; i++) await new Promise((r) => setTimeout(r, 0)); };
const ALEX = [
  { wrapper: 'SIPP', ticker: 'VLS60', name: 'Vanguard LifeStrategy 60% Equity', value: 100000 },
  { wrapper: 'SIPP', ticker: 'SGLN', name: 'iShares Physical Gold', value: 10000 },
  { wrapper: 'SIPP', ticker: 'VWRP', name: 'Vanguard FTSE All-World (Acc)', value: 50000 }
];
/** A row's result as runStressRow gives it for this plan today (its own key). */
const rowResult = (plan, today, { weighted = 0.9, fixedAge = 0.85, age = 95, left = 120000 } = {}) => ({ id: 'x', key: stressKeyOf(plan, today), runs: 1, na: null,
  a: { weighted, sumW: Math.round((1 - weighted) * 1000 * WEIGHT_ONE), n: 1000, fixedAge, futures: 1000, planToAge: age, typicalLeft: left, floor: null, coverage: null }, shortfall: { when: null } });
/** The run held for a plan's review page: as planned and (with a record) what is held, whole, for its own key. */
function heldFor(plan, today = DAY) {
  const R = reviewOf([{ plan, newer: false, failed: false }], plan.id, { today });
  const rows = Object.fromEntries(R.run.rows.map((id) => [id, rowResult(plan, today, { weighted: id === 'whole' ? 0.85 : 0.95 })]));
  return { key: R.run.key, planId: String(plan.id), status: 'done', order: R.run.rows, rows, pots: null, reason: null };
}
/** Fixture 19 (Moving, inside its window) with what is held given. */
function moving(lines = undefined) {
  const raw = copy(C['19-back-to-work-saving']);
  if (lines !== undefined) raw.holdings = lines === null ? undefined : { lines, updatedAt: '2026-09-30' };
  if (lines === null) delete raw.holdings;
  return entryOf(raw, DAY).plan;
}
const agreed = (plan, p) => ({ ...plan, phases: p.patch.phases, planAmendments: p.patch.planAmendments });

describe('the agreement: ONE write of `phases` and `planAmendments`, from the run held for the page', () => {
  it('each how: the move done inside the band, what is held as it is, no pension record to read', () => {
    expect(howOf(moving(), { today: DAY })).toMatchObject({ how: 'done' });
    const alex = howOf(moving(ALEX), { today: DAY });
    expect(alex.how).toBe('asHeld');
    expect(alex.heldMix).toMatchObject({ shares: 69, bonds: 25, diversifiers: 6, cash: 0 });
    const none = moving(null);
    expect(howOf(none, { today: DAY })).toEqual({ how: 'nothing', heldPct: null, heldMix: null });
    // with nothing to read the run is the plan as it stands, and the agreement keeps no mix
    const p = agreePatch(none, { today: DAY, at: AT, held: heldFor(none) });
    expect(p.ok).toBe(true);
    expect(p.patch.phases.moving.agreed).toMatchObject({ how: 'nothing', heldPct: null, entryAt: AT });
    expect(p.entry.result.heldMix).toBe(null);
  });

  it('the agreement and its one entry: kind asHeld, row whole; the review entry and a history line; the stage reads it', () => {
    const plan = moving(ALEX);
    const p = agreePatch(plan, { today: DAY, at: AT, held: heldFor(plan) });
    expect(p.ok).toBe(true);
    expect(Object.keys(p.patch).sort()).toEqual(['phases', 'planAmendments']);
    expect(p.patch.phases.moving.agreed).toMatchObject({ at: AT, strategyId: 'pots-and-valves', how: 'asHeld', entryAt: AT });
    expect(p.patch.phases.review.log).toHaveLength(1);
    expect(p.patch.phases.review.log[0]).toMatchObject({ phase: 'moving', reading: { source: 'run', weighted: 0.85 } });
    expect(p.patch.phases.history.map((x) => x.what)).toEqual(['moving.agreed']);
    const e = p.patch.planAmendments[p.patch.planAmendments.length - 1];
    expect(e).toMatchObject({ at: AT, kind: 'asHeld', test: { id: 'whole' }, result: { chance: 0.85, heldMix: { shares: 69, bonds: 25, diversifiers: 6, cash: 0 } } });
    expect(e.fingerprint).toBe(fingerprintOf(plan, 'asHeld', 'whole'));
    const after = agreed(plan, p);
    const life = stageOf(after, noon(DAY));
    expect(life).toMatchObject({ key: 'moving', by: 'agreement' });
    expect(agreementOf(after)).toMatchObject({ how: 'asHeld' });
    expect(asHeldStateOf(after, { today: DAY }).status).toBe('agreed');
    // nothing is due on a plan moving by its agreement
    expect(reviewOf([{ plan: after, newer: false, failed: false }], after.id, { today: DAY }).due).toMatchObject({ due: false, next: null });
  });

  it('one run saved with the review and then accepted is ONE reading: never "past your line at your last two reviews"', () => {
    const plan = moving(ALEX);
    const R = reviewOf([{ plan, newer: false, failed: false }], plan.id, { today: DAY });
    const low = { key: R.run.key, planId: String(plan.id), status: 'done', order: R.run.rows, rows: Object.fromEntries(R.run.rows.map((id) => [id, rowResult(plan, DAY, { weighted: 0.40, fixedAge: 0.4 })])), pots: null, reason: null };
    const s = reviewSavePatch(plan, { today: DAY, at: AT, held: low });
    expect(s.ok).toBe(true);
    const saved = { ...plan, phases: s.patch.phases };
    const a = agreePatch(saved, { today: DAY, at: '2026-10-02T11:05:00.000Z', held: low });
    expect(a.ok).toBe(true);
    const after = agreed(saved, a);
    expect(after.phases.review.log).toHaveLength(2);
    const pg = homeOf([{ plan: after, newer: false, failed: false }], after.id, { today: DAY });
    expect([...pg.todo.items, ...pg.todo.more].map((d) => d.id)).not.toContain('review.offCourse');
    expect(offCourseOf(after, { phase: 'moving' }).off).toBe(false);
  });

  it('refused: no run, a run for other figures, a saver, a closed plan, the example', () => {
    const plan = moving(ALEX);
    expect(agreePatch(plan, { today: DAY, at: AT, held: null })).toMatchObject({ ok: false, problem: 'noResult' });
    expect(agreePatch(plan, { today: DAY, at: AT, held: { ...heldFor(plan), key: 'another' } })).toMatchObject({ ok: false, problem: 'oldResult' });
    const saver = entryOf(copy(C['05-saver-committed']), DAY).plan;
    expect(agreePatch(saver, { today: DAY, at: AT, held: null })).toMatchObject({ ok: false, problem: 'notNow' });
    expect(agreePatch(entryOf(copy(C['18-moved-to-new-plan']), DAY).plan, { today: DAY, at: AT })).toMatchObject({ ok: false, problem: 'closed' });
    expect(agreePatch({ ...plan, example: true }, { today: DAY, at: AT })).toMatchObject({ ok: false, problem: 'example' });
  });
});

describe('the line under the headline follows the phase once the stop has passed', () => {
  it('accepted and past the stop: a plan lived on, not locked yet; not accepted and past the stop: the stop as the plan has it, and nothing about a window', () => {
    const plan = moving(ALEX);
    const after = agreed(plan, agreePatch(plan, { today: DAY, at: AT, held: heldFor(plan) }));
    const past = '2029-06-01';   // fixture 19 says work stops in November 2028
    const pa = homeOf([entryOf(after, past)], after.id, { today: past });
    expect(pa.stage.key).toBe('drawing');
    expect(pa.line).toEqual({ id: 'draft-retired', slots: {} });
    const pn = homeOf([entryOf(plan, past)], plan.id, { today: past });
    expect(pn.stage.key).toBe('moving');
    expect(pn.line).toEqual({ id: 'pastStop', slots: { month: 'November 2028' } });
    expect(pn.moveWindow).toBe(null);
    // "Did you stop work?" put off: the next sentence never says the window is still open
    const pg = planPage([entryOf(plan, past)], plan.id, null, { today: past });
    expect(pg.due.map((d) => d.id)).toContain('plan.confirmStop');
    const putOff = { ...plan, tasks: taskPatch(plan, pg.due.find((d) => d.id === 'plan.confirmStop').key, 'notNow', { at: past + 'T10:00:00.000Z' }).tasks };
    const pg2 = planPage([entryOf(putOff, past)], plan.id, null, { today: past });
    expect(pg2.due).toEqual([]);
    expect(pg2.next.id).not.toBe('P.window');
    expect(planPage([entryOf(plan, DAY)], plan.id, null, { today: DAY }).next.id).toBe('P.window');
    // inside the window it is as it was
    expect(homeOf([entryOf(plan, DAY)], plan.id, { today: DAY }).line).toEqual({ id: 'approaching', slots: {} });
  });
});

describe('when it stops standing (information: what was accepted still decides the stage while its way stands)', () => {
  it('what is held moved more than 5 points; a new version of the plan; another way of drawing', () => {
    const plan = moving(ALEX);
    const after = agreed(plan, agreePatch(plan, { today: DAY, at: AT, held: heldFor(plan) }));
    // a little drift: still agreed
    const little = copy(after); little.holdings.lines[2].value += 3000;
    expect(asHeldStateOf(little, { today: DAY }).status).toBe('agreed');
    // the world tracker sold for cash: moved
    const sold = copy(after); sold.holdings.lines[2] = { wrapper: 'SIPP', ticker: 'CSH2', name: 'Cash fund', value: 50000 };
    expect(asHeldStateOf(sold, { today: DAY })).toMatchObject({ status: 'stale', why: 'moved' });
    expect(agreementOf(sold)).not.toBe(null);
    // the plan's settings changed: a new version
    const changed = copy(after); changed.stressTool.settings.duration = (+changed.stressTool.settings.duration || 30) + 2;
    expect(asHeldStateOf(changed, { today: DAY })).toMatchObject({ status: 'stale', why: 'version' });
    // another way of drawing: no longer stands, and the stage no longer reads it
    const other = copy(after); other.stressTool.settings.strategyId = 'buckets-in-order';
    expect(asHeldStateOf(other, { today: DAY })).toMatchObject({ status: 'stale', why: 'strategy', strategyNow: 'buckets-in-order' });
    expect(agreementOf(other)).toBe(null);
  });
  it('a document version is compared only when the entry kept one', () => {
    const plan = moving(ALEX);
    const after = agreed(plan, agreePatch(plan, { today: DAY, at: AT, held: heldFor(plan) }));
    const e = after.planAmendments[after.planAmendments.length - 1];
    expect(e.documentAt).toBe(documentAtOf(plan) || null);
    const docless = copy(after); docless.planDocument = { createdAt: '2027-01-01T00:00:00.000Z' };
    if (e.documentAt == null) expect(asHeldStateOf(docless, { today: DAY }).why).not.toBe('version');
    const kept = copy(after); kept.planAmendments[kept.planAmendments.length - 1].documentAt = '2026-01-01T00:00:00.000Z';
    expect(asHeldStateOf(kept, { today: DAY })).toMatchObject({ status: 'stale', why: 'version' });
  });
});

describe('withdraw, and the panel\'s agreements: never each other\'s', () => {
  it('withdraw removes the agreement and only the entry it carried; the panel\'s "As planned" agreement stays', () => {
    let plan = moving(ALEX);
    const panel = stressAmendPatch(plan, { id: 'asPlanned', result: { ...rowResult(plan, DAY), shortfall: { when: { worst: 90, typical: 92, worstLasts: false } } }, same: false }, { at: '2026-10-01T09:00:00.000Z', today: DAY });
    expect(panel.ok).toBe(true);
    plan = { ...plan, planAmendments: panel.patch.planAmendments };
    const p = agreePatch(plan, { today: DAY, at: AT, held: heldFor(plan) });
    const after = agreed(plan, p);
    expect(after.planAmendments.map((e) => e.kind)).toEqual(['confidence', 'asHeld']);
    expect(stressAgreementOf(after, 'asPlanned').status).toBe('agreed');
    // the panel's held row id never reads the review's
    expect(kindOfRow('asHeld')).toBe(null);
    expect(stressAgreementOf(after, 'asHeld').status).toBe('none');
    // the panel's withdraw leaves the review's agreement
    const pw = stressWithdrawPatch(after, 'asPlanned');
    expect(pw.patch.planAmendments.map((e) => e.kind)).toEqual(['asHeld']);
    // the review's withdraw leaves the panel's
    const w = agreeWithdrawPatch(after, { at: '2026-10-03T09:00:00.000Z' });
    expect(w.ok).toBe(true);
    expect(w.patch.planAmendments.map((e) => e.kind)).toEqual(['confidence']);
    expect(w.patch.phases.moving.agreed).toBeUndefined();
    expect(w.patch.phases.history.map((x) => x.what)).toEqual(['moving.agreed', 'moving.withdrawn']);
    const gone = { ...after, phases: w.patch.phases, planAmendments: w.patch.planAmendments };
    expect(asHeldStateOf(gone, { today: DAY }).status).toBe('none');
    expect(stageOf(gone, noon(DAY)).by).toBe('facts');
    expect(agreeWithdrawPatch(gone, { at: AT })).toMatchObject({ ok: false, problem: 'none' });
  });
});

describe('the page and the plan write', () => {
  it('after a test the agreement can be made; its confirm says what it means; "Yes" is ONE write; Withdraw is ONE write', async () => {
    const raw = copy(C['19-back-to-work-saving']);
    raw.holdings = { lines: ALEX, updatedAt: '2026-09-30' };
    const writes = [];
    const fb = { doc: (db, ...path) => ({ path: path.join('/') }), updateDoc: (ref, data) => { writes.push({ ref, data }); return Promise.resolve(); }, addDoc: () => Promise.resolve({ id: 'x' }), deleteDoc: () => Promise.resolve(), collection: () => ({}) };
    const store = createStore(initialState({ today: DAY, build: 'test' }), reduce);
    store.dispatch({ type: A.SESSION_SET, session: { kind: 'in', email: 'a@b.c' } });
    store.dispatch({ type: A.PLANS_SET, list: upgradedList([raw], noon(DAY)), source: 'account', readAt: '14:03' });
    const go = (hash) => { store.dispatch({ type: A.ROUTE_SET, route: parse(hash) }); store.dispatch({ type: A.PLANS_VIEW, view: viewFor(store.getState()) }); };
    const handles = () => ({ db: { name: 'db' }, user: { uid: 'u1', email: 'a@b.c', emailVerified: true }, reread: () => Promise.resolve() });
    const stop = startPlanWrite(store, { session: null, local: null, now: () => new Date(DAY + 'T14:03:00.000Z'), fb, client: null, handles });
    go('#/plan/' + raw.id + '/review');
    const plan = store.getState().plans.list[0].plan;
    expect(store.getState().plans.view.page.review.agreement).toMatchObject({ status: 'none', canAccept: false });
    const held = heldFor(plan);
    store.dispatch({ type: A.REVIEW_RUN, key: held.key, planId: held.planId, rows: held.order, pots: null });
    for (const id of held.order) store.dispatch({ type: A.REVIEW_DONE, key: held.key, row: id, result: held.rows[id] });
    store.dispatch({ type: A.PLANS_VIEW, view: viewFor(store.getState()) });
    const G = store.getState().plans.view.page.review.agreement;
    expect(G).toMatchObject({ status: 'none', canAccept: true, confirm: { id: 'clauses', slots: { chance: '17 times in 20', age: '95' } } });
    // the screen: the press, then the confirm on the screen
    const draw = (state) => { const root = document.createElement('div'); const out = []; render(h(App, { state, dispatch: (a) => out.push(a) }), root); return { root, out }; };
    const d0 = draw(store.getState());
    expect(d0.root.querySelector('[data-testid="plan.review.agreement.accept"]').textContent).toBe('I accept this as my plan');
    store.dispatch({ type: A.UI_TOGGLE, id: 'agreeConfirm' });
    const d1 = draw(store.getState());
    const confirm = d1.root.querySelector('[data-testid="plan.review.agreement.confirm"]').textContent;
    expect(confirm).toContain('From the month you stop work, the plan is read as living on it.');
    expect(confirm).toContain('It is not advice');
    store.dispatch({ type: A.PLAN_AGREE, planId: String(raw.id) });
    await tick();
    expect(writes).toHaveLength(1);
    expect(Object.keys(writes[0].data).sort()).toEqual(['lastModified', 'phases', 'planAmendments']);
    expect(writes[0].data.phases.moving.agreed).toMatchObject({ how: 'asHeld' });
    expect(store.getState().ui.toast).toMatchObject({ op: 'agree', line: { id: 'agreed' } });
    // read back as stored, the review says it was accepted, and Withdraw is one write
    const stored = { ...raw, phases: writes[0].data.phases, planAmendments: writes[0].data.planAmendments };
    store.dispatch({ type: A.PLAN_TOAST_CLOSE });
    store.dispatch({ type: A.PLANS_SET, list: upgradedList([stored], noon(DAY)), source: 'account', readAt: '14:04' });
    go('#/plan/' + raw.id + '/review');
    expect(store.getState().plans.view.page.review.agreement).toMatchObject({ status: 'agreed', withdrawable: true, accepted: { id: 'accepted' } });
    store.dispatch({ type: A.PLAN_AGREE_WITHDRAW, planId: String(raw.id) });
    await tick();
    expect(writes).toHaveLength(2);
    expect(Object.keys(writes[1].data).sort()).toEqual(['lastModified', 'phases', 'planAmendments']);
    expect(writes[1].data.planAmendments).toEqual([]);
    stop();
  });

  it('with nothing recorded the words say the plan as it stands was accepted, never "what you hold"; nothing left is said as nothing', async () => {
    const raw = copy(C['19-back-to-work-saving']);
    delete raw.holdings;
    const writes = [];
    const fb = { doc: (db, ...path) => ({ path: path.join('/') }), updateDoc: (ref, data) => { writes.push({ ref, data }); return Promise.resolve(); }, addDoc: () => Promise.resolve({ id: 'x' }), deleteDoc: () => Promise.resolve(), collection: () => ({}) };
    const store = createStore(initialState({ today: DAY, build: 'test' }), reduce);
    store.dispatch({ type: A.SESSION_SET, session: { kind: 'in', email: 'a@b.c' } });
    store.dispatch({ type: A.PLANS_SET, list: upgradedList([raw], noon(DAY)), source: 'account', readAt: '14:03' });
    const go = (hash) => { store.dispatch({ type: A.ROUTE_SET, route: parse(hash) }); store.dispatch({ type: A.PLANS_VIEW, view: viewFor(store.getState()) }); };
    const handles = () => ({ db: { name: 'db' }, user: { uid: 'u1', email: 'a@b.c', emailVerified: true }, reread: () => Promise.resolve() });
    const stop = startPlanWrite(store, { session: null, local: null, now: () => new Date(DAY + 'T14:03:00.000Z'), fb, client: null, handles });
    go('#/plan/' + raw.id + '/review');
    const plan = store.getState().plans.list[0].plan;
    const R = reviewOf([{ plan, newer: false, failed: false }], plan.id, { today: DAY });
    expect(R.run.rows).toEqual(['asPlanned']);
    const held = { key: R.run.key, planId: String(plan.id), status: 'done', order: ['asPlanned'], rows: { asPlanned: rowResult(plan, DAY, { weighted: 0.55, left: 0 }) }, pots: null, reason: null };
    store.dispatch({ type: A.REVIEW_RUN, key: held.key, planId: held.planId, rows: held.order, pots: null });
    store.dispatch({ type: A.REVIEW_DONE, key: held.key, row: 'asPlanned', result: held.rows.asPlanned });
    store.dispatch({ type: A.PLANS_VIEW, view: viewFor(store.getState()) });
    expect(store.getState().plans.view.page.review.agreement).toMatchObject({ canAccept: true, howNow: 'nothing', of: 'asItStands' });
    const draw = (state) => { const root = document.createElement('div'); render(h(App, { state, dispatch: () => {} }), root); return root; };
    // the result: more than half the futures have nothing left, said as that (never "typically £0", never "where it lasts")
    const r0 = draw(store.getState());
    expect(r0.querySelector('[data-testid="plan.review.run.left"]').textContent).toBe('In more than half the futures nothing is left at 95.');
    store.dispatch({ type: A.UI_TOGGLE, id: 'agreeConfirm' });
    const r1 = draw(store.getState());
    const sect = r1.querySelector('[data-testid="plan.review.agreement"]').textContent;
    expect(sect).toContain('Your plan as it stands');
    expect(sect).toContain('You are saying you have seen what the money does with your plan as it stands');
    expect(sect).not.toContain('what you hold');
    store.dispatch({ type: A.PLAN_AGREE, planId: String(raw.id) });
    await tick();
    expect(writes).toHaveLength(1);
    expect(writes[0].data.phases.moving.agreed).toMatchObject({ how: 'nothing', heldPct: null });
    expect(store.getState().ui.toast).toMatchObject({ op: 'agree', line: { id: 'agreedAsItStands' } });
    const stored = { ...raw, phases: writes[0].data.phases, planAmendments: writes[0].data.planAmendments };
    store.dispatch({ type: A.PLAN_TOAST_CLOSE });
    store.dispatch({ type: A.PLANS_SET, list: upgradedList([stored], noon(DAY)), source: 'account', readAt: '14:04' });
    go('#/plan/' + raw.id + '/review');
    expect(store.getState().plans.view.page.review.agreement).toMatchObject({ status: 'agreed', of: 'asItStands', accepted: { id: 'acceptedNoneLeft' } });
    const r2 = draw(store.getState()).querySelector('[data-testid="plan.review.agreement.accepted"]').textContent;
    expect(r2).toMatch(/^On 2 October 2026 you accepted your plan as it stood, when the money lasted as long as you do .+; in more than half the futures nothing was left at 95\.$/);
    // the home says the same
    const home = homeOf([{ plan: entryOf(stored, DAY).plan, newer: false, failed: false }], raw.id, { today: DAY });
    expect(home.moveWindow).toMatchObject({ id: 'agreedAsItStands' });
    stop();
  });
});

describe('the home\'s drift line rests while what is held stands accepted', () => {
  it('a drawing plan holding a third of its shares in cash: the drift line; accepted and standing: none; moved since: the line again', () => {
    const third = copy(C['04-buckets-running']);
    const sh = third.holdings.lines.find((l) => l.wrapper === 'SIPP' && l.ticker === 'HMWO');
    const cash = third.holdings.lines.find((l) => l.wrapper === 'SIPP' && l.ticker === 'CSH2');
    const moved = Math.round(sh.value / 3); sh.value -= moved; cash.value += moved;
    const plan = entryOf(third, DAY).plan;
    expect(homeOf([{ plan, newer: false, failed: false }], plan.id, { today: DAY }).drift).toBeTruthy();
    // what is held accepted as the plan (made while moving; read here as it is stored)
    const mix = howOf(plan, { today: DAY }).heldMix;
    const ph = phasesPatch(plan, 'moving.agreed', { strategyId: 'buckets-in-order', how: 'asHeld', heldPct: 80, entryAt: AT }, { at: AT }).phases;
    const entry = { at: AT, kind: 'asHeld', test: { id: 'whole', inputs: {} }, result: { chance: 0.9, fixedAge: 0.85, planToAge: 95, heldMix: mix }, fingerprint: fingerprintOf(plan, 'asHeld', 'whole'), engineVersion: 'test', documentAt: documentAtOf(plan) || null, ageRule: 'birthday' };
    const accepted = { ...plan, phases: ph, planAmendments: [...(plan.planAmendments || []), entry] };
    const strategy = (plan.stressTool.settings.strategyId || 'pots-and-valves');
    accepted.phases.moving.agreed.strategyId = strategy;
    expect(asHeldStateOf(accepted, { today: DAY }).status).toBe('agreed');
    expect(homeOf([{ plan: accepted, newer: false, failed: false }], plan.id, { today: DAY }).drift).toBeUndefined();
    const since = copy(accepted);
    since.holdings.lines.find((l) => l.ticker === 'CSH2').value -= moved;
    since.holdings.lines.find((l) => l.ticker === 'HMWO').value += Math.round(moved / 2);
    expect(asHeldStateOf(since, { today: DAY }).why).toBe('moved');
    // (with the shares part-way back the line may or may not cross 10 points: the agreement no longer holds it back)
    const v = homeOf([{ plan: since, newer: false, failed: false }], plan.id, { today: DAY });
    expect(v.found).toBe(true);
  });
});

describe('Living on it: "Test with what I hold" from today, and accepting what is held quiets the home\'s line', () => {
  /** 04 with a third of its shares moved into cash: more than ten points from its mix. */
  function third() {
    const raw = copy(C['04-buckets-running']);
    const sh = raw.holdings.lines.find((l) => l.wrapper === 'SIPP' && l.ticker === 'HMWO');
    const cash = raw.holdings.lines.find((l) => l.wrapper === 'SIPP' && l.ticker === 'CSH2');
    const moved = Math.round(sh.value / 3); sh.value -= moved; cash.value += moved;
    return raw;
  }
  it('the line links to the review, which tests what is held on the pots entered; "Yes" is ONE write; the line then rests; Withdraw brings it back', () => {
    const raw = third();
    const plan = entryOf(raw, DAY).plan;
    const h0 = homeOf([{ plan, newer: false, failed: false }], plan.id, { today: DAY });
    expect(h0.drift).toMatchObject({ kind: 'buckets', href: '#/plan/' + plan.id + '/review' });
    const R = reviewOf([{ plan, newer: false, failed: false }], plan.id, { today: DAY });
    expect(R.run).toMatchObject({ rows: ['today', 'whole'], label: 'held' });
    expect(R.living.held.buckets.find((x) => x.bucket === 'cash').held).toBeGreaterThan(R.living.held.buckets.find((x) => x.bucket === 'cash').plan);
    // the run held for the page: as held, beside the plan's own mix
    const rows = { today: rowResult(plan, DAY, { weighted: 0.9 }), whole: rowResult(plan, DAY, { weighted: 0.8 }) };
    const held = { key: R.run.key, planId: String(plan.id), status: 'done', order: R.run.rows, rows, pots: R.run.pots, reason: null };
    const R2 = reviewOf([{ plan, newer: false, failed: false }], plan.id, { today: DAY, held });
    expect(R2.result).toMatchObject({ status: 'done', id: 'held', slots: { chance: '16 times in 20', ref: '18 times in 20' } });
    const G = agreementViewOf(plan, R2, { today: DAY });
    expect(G).toMatchObject({ canAccept: true, phase: 'drawing', of: 'held' });
    // without the held row (from today alone) it cannot be made
    expect(agreePatch(plan, { today: DAY, at: AT, held: { ...held, rows: { today: rows.today } } })).toMatchObject({ ok: false, problem: 'noResult' });
    const p = agreePatch(plan, { today: DAY, at: AT, held });
    expect(p.ok).toBe(true);
    expect(Object.keys(p.patch).sort()).toEqual(['phases', 'planAmendments']);
    expect(p.patch.phases.moving.agreed).toMatchObject({ how: 'asHeld', strategyId: plan.stressTool.settings.strategyId || 'pots-and-valves' });
    expect(p.patch.phases.review.log[0]).toMatchObject({ phase: 'drawing', reading: { source: 'run', weighted: 0.8 } });
    expect(p.entry).toMatchObject({ kind: 'asHeld', test: { id: 'whole' } });
    const after = agreed(plan, p);
    // the settings, the document and what is held are untouched
    for (const k of ['stressTool', 'planDocument', 'holdings', 'decisionTool']) expect(JSON.stringify(after[k]), k).toBe(JSON.stringify(plan[k]));
    expect(asHeldStateOf(after, { today: DAY }).status).toBe('agreed');
    expect(stageOf(after, noon(DAY)).key).toBe('drawing');
    expect(homeOf([{ plan: after, newer: false, failed: false }], plan.id, { today: DAY }).drift).toBeUndefined();
    // withdrawn: the line is back
    const w = agreeWithdrawPatch(after, { at: '2026-10-02T12:00:00.000Z' });
    const back = { ...after, phases: w.patch.phases, planAmendments: w.patch.planAmendments };
    expect(homeOf([{ plan: back, newer: false, failed: false }], plan.id, { today: DAY }).drift).toMatchObject({ kind: 'buckets' });
  });
  it('the page: what is held against the plan\'s mix, "Test with what I hold", the result beside the plan\'s own mix, and a confirm that never says "from the month you stop work"', () => {
    const raw = third();
    const plan = entryOf(raw, DAY).plan;
    const R = reviewOf([{ plan, newer: false, failed: false }], plan.id, { today: DAY });
    const rows = { today: rowResult(plan, DAY, { weighted: 0.9 }), whole: rowResult(plan, DAY, { weighted: 0.8 }) };
    let st = stateWith([{ plan: raw, newer: false, failed: false }].map((e) => entryOf(e.plan, DAY)), '#/plan/' + plan.id + '/review', { today: DAY });
    const draw = (state) => { const root = document.createElement('div'); render(h(App, { state, dispatch: () => {} }), root); return root; };
    const r0 = draw(st);
    expect(r0.querySelector('[data-testid="plan.review.run.button"]').textContent).toBe('Test with what I hold');
    expect(r0.querySelectorAll('[data-testid="plan.review.living.held.buckets"] li').length).toBeGreaterThan(0);
    expect(r0.querySelector('[data-testid="plan.review.living.held"]').textContent).toMatch(/Cash: \d+% of your pension now; your plan’s mix has \d+%\./);
    st = reduce(st, { type: A.REVIEW_RUN, key: R.run.key, planId: String(plan.id), rows: R.run.rows, pots: R.run.pots });
    for (const id of R.run.rows) st = reduce(st, { type: A.REVIEW_DONE, key: R.run.key, row: id, result: rows[id] });
    st = reduce(st, { type: A.UI_TOGGLE, id: 'agreeConfirm' });
    st = reduce(st, { type: A.PLANS_VIEW, view: viewFor(st) });
    const r1 = draw(st);
    expect(r1.querySelector('[data-testid="plan.review.run.line"]').textContent).toMatch(/^From today, on your pots as last recorded, with what you hold: .+ \(in your plan’s own mix: 18 times in 20\)\./);
    const confirm = r1.querySelector('[data-testid="plan.review.agreement.confirm"]').textContent;
    expect(confirm).toContain('You are saying you have seen what the money does with what you hold now');
    expect(confirm).not.toContain('From the month you stop work');
  });
  it('the plan write: "Yes, this is my plan" on the Living-on-it review is ONE write, made on the run of the boxes as typed', async () => {
    const raw = third();
    const writes = [];
    const fb = { doc: (db, ...path) => ({ path: path.join('/') }), updateDoc: (ref, data) => { writes.push({ ref, data }); return Promise.resolve(); }, addDoc: () => Promise.resolve({ id: 'x' }), deleteDoc: () => Promise.resolve(), collection: () => ({}) };
    const store = createStore(initialState({ today: DAY, build: 'test' }), reduce);
    store.dispatch({ type: A.SESSION_SET, session: { kind: 'in', email: 'a@b.c' } });
    store.dispatch({ type: A.PLANS_SET, list: upgradedList([raw], noon(DAY)), source: 'account', readAt: '14:03' });
    const go = (hash) => { store.dispatch({ type: A.ROUTE_SET, route: parse(hash) }); store.dispatch({ type: A.PLANS_VIEW, view: viewFor(store.getState()) }); };
    const handles = () => ({ db: { name: 'db' }, user: { uid: 'u1', email: 'a@b.c', emailVerified: true }, reread: () => Promise.resolve() });
    const stop = startPlanWrite(store, { session: null, local: null, now: () => new Date(DAY + 'T14:03:00.000Z'), fb, client: null, handles });
    go('#/plan/' + raw.id + '/review');
    store.dispatch({ type: A.PLAN_EDIT, planId: String(raw.id), path: 'rv.pension', value: '520000' });
    store.dispatch({ type: A.PLANS_VIEW, view: viewFor(store.getState()) });
    const run = store.getState().plans.view.page.review.run;
    expect(run).toMatchObject({ rows: ['today', 'whole'], pots: { pension: 520000 } });
    const plan = store.getState().plans.list[0].plan;
    store.dispatch({ type: A.REVIEW_RUN, key: run.key, planId: String(raw.id), rows: run.rows, pots: run.pots });
    store.dispatch({ type: A.REVIEW_DONE, key: run.key, row: 'today', result: rowResult(plan, DAY, { weighted: 0.9 }) });
    store.dispatch({ type: A.REVIEW_DONE, key: run.key, row: 'whole', result: rowResult(plan, DAY, { weighted: 0.8 }) });
    store.dispatch({ type: A.PLANS_VIEW, view: viewFor(store.getState()) });
    expect(store.getState().plans.view.page.review.agreement).toMatchObject({ canAccept: true });
    store.dispatch({ type: A.PLAN_AGREE, planId: String(raw.id) });
    await tick();
    expect(writes).toHaveLength(1);
    expect(Object.keys(writes[0].data).sort()).toEqual(['lastModified', 'phases', 'planAmendments']);
    expect(writes[0].data.phases.review.log[0]).toMatchObject({ phase: 'drawing', pots: { pension: 520000 }, entered: { pots: true } });
    stop();
  });
  it('the home: the line about what is held says where things stand, so "Nothing recorded to read against the plan yet" is not said above it', () => {
    const raw = copy(C['02-pnv-draft']);
    raw.holdings = { lines: [{ wrapper: 'SIPP', ticker: 'VWRP', name: 'Vanguard FTSE All-World (Acc)', value: 300000 }], updatedAt: '2026-09-30' };
    const st = stateWith([entryOf(raw, DAY)], '#/plan/' + raw.id, { today: DAY });
    const root = document.createElement('div');
    render(h(App, { state: st, dispatch: () => {} }), root);
    const where = root.querySelector('[data-testid="plan.home.where"]');
    expect(root.querySelector('[data-testid="plan.home.drift"]')).toBeTruthy();
    expect(where.textContent).not.toContain('Nothing recorded to read against the plan yet.');
    // with nothing held and nothing recorded, it is still said
    const bare = copy(C['02-pnv-draft']); delete bare.holdings;
    const r2 = document.createElement('div');
    render(h(App, { state: stateWith([entryOf(bare, DAY)], '#/plan/' + bare.id, { today: DAY }), dispatch: () => {} }), r2);
    if (!r2.querySelector('[data-testid="plan.home.where"] .home-where-block')) expect(r2.querySelector('[data-testid="plan.home.whereNone"]')).toBeTruthy();
  });
  it('a ladder\'s line links to What you hold, never to a review it cannot run', () => {
    const day = '2028-05-10';
    // 03 holds the gilt for 2029/30 in part, which is held (step F6: never "not held yet"); without it, that year is not held
    const raw = copy(C['03-gilt-ladder-locked']);
    raw.holdings = { ...raw.holdings, lines: raw.holdings.lines.filter((l) => String(l.ticker).toUpperCase() !== 'T29') };
    const plan = entryOf(raw, day).plan;
    const R = reviewOf([{ plan, newer: false, failed: false }], plan.id, { today: day });
    expect(R.run).toBe(null);
    const h = homeOf([{ plan, newer: false, failed: false }], plan.id, { today: day });
    expect(h.drift).toEqual({ kind: 'ladder', year: '2029/30', href: '#/plan/' + plan.id + '/hold' });
  });
});

describe('the agreement view on the review page', () => {
  it('a plan living on its money with nothing recorded, or a saver, shows none; with a record it is offered after "Test with what I hold"', () => {
    const bare = copy(C['04-buckets-running']); delete bare.holdings;
    const b = entryOf(bare, DAY).plan;
    expect(agreementViewOf(b, reviewOf([{ plan: b, newer: false, failed: false }], b.id, { today: DAY }), { today: DAY })).toBe(null);
    const sv = entryOf(copy(C['05-saver-committed']), DAY).plan;
    expect(agreementViewOf(sv, reviewOf([{ plan: sv, newer: false, failed: false }], sv.id, { today: DAY }), { today: DAY })).toBe(null);
    const plan = entryOf(copy(C['04-buckets-running']), DAY).plan;
    const R = reviewOf([{ plan, newer: false, failed: false }], plan.id, { today: DAY });
    expect(agreementViewOf(plan, R, { today: DAY })).toMatchObject({ status: 'none', phase: 'drawing', canAccept: false });
    // a key for the review's run is the plan's and its inputs'
    expect(reviewRunKeyOf(plan, DAY, runInputsOf(plan, { today: DAY, phase: 'drawing' }))).toMatch(/\|/);
  });
});
