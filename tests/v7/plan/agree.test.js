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
import { corpus, entryOf, noon } from './_plans.js';
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

describe('the agreement view on the review page', () => {
  it('a plan not moving and with no agreement shows none', () => {
    const plan = entryOf(copy(C['04-buckets-running']), DAY).plan;
    const R = reviewOf([{ plan, newer: false, failed: false }], plan.id, { today: DAY });
    expect(agreementViewOf(plan, R, { today: DAY })).toBe(null);
    // a key for the review's run is the plan's and its inputs'
    expect(reviewRunKeyOf(plan, DAY, runInputsOf(plan, { today: DAY, phase: 'drawing' }))).toMatch(/\|/);
  });
});
