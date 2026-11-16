/**
 * "Your review" (7.10.0; spec-7100 §4): one page in every phase on #/plan/<id>/review — the reader (answers/plan/review.js
 * reviewOf), the screen, "Save this review" and the choices (the rule, how often, the window, the saving level), each ONE
 * write of `phases` and the stamp through Phases.phasesPatch. Opening the page writes nothing. Fictional plans only.
 */
import { describe, it, expect } from 'vitest';
import { h, render } from 'preact';
import { App } from '../../../src/v7/App.jsx';
import { reviewOf, reviewSavePatch, phaseChoicePatch, reviewBoxesOf, checkReview, ruleOfChoice, onTrackOf, CHOICE_PARTS } from '../../../src/answers/plan/review.js';
import { REVIEW as W } from '../../../src/v7/copy/review.js';
import { parse, format, screenName } from '../../../src/v7/router/routes.js';
import { createStore } from '../../../src/v7/effects/store.js';
import { initialState } from '../../../src/v7/state/initial.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { A } from '../../../src/v7/state/actions.js';
import { startPlanWrite } from '../../../src/v7/effects/planWrite.js';
import { upgradedList, viewFor } from '../../../src/v7/effects/planSource.js';
import { lockedPlanWriteRefusal, phaseWriteRefusal } from '../../../src/services/LockedPlanGuard.js';
import { phasesPatch } from '../../../src/services/Phases.js';
import { whereAmIFor } from '../../../src/services/PlanReading.js';
import { getDefaultStressSettings } from '../../../src/storage/stressDefaults.js';
import { visibleText } from '../render/checkScreen.js';
import { corpus, entryOf, entriesAt, stateWith, noon } from './_plans.js';

const C = corpus();
const copy = (v) => JSON.parse(JSON.stringify(v));
const AT = '2027-04-06T10:00:00.000Z';
const tick = async (n = 8) => { for (let i = 0; i < n; i++) await new Promise((r) => setTimeout(r, 0)); };
const deepFreeze = (o) => { if (o && typeof o === 'object' && !Object.isFrozen(o)) { Object.freeze(o); for (const v of Object.values(o)) deepFreeze(v); } return o; };

function draw(state) {
  const root = document.createElement('div');
  const actions = [];
  render(h(App, { state, dispatch: (a) => actions.push(a) }), root);
  return { root, actions, text: visibleText(root) };
}
const q = (root, id) => root.querySelector(`[data-testid="${id}"]`);

/** A store with the plans read, the plan write started on fake Firestore; every write kept. */
function harness(raws, today) {
  const writes = [];
  const fb = { doc: (db, ...path) => ({ path: path.join('/') }), updateDoc: (ref, data) => { writes.push({ ref, data }); return Promise.resolve(); }, addDoc: () => Promise.resolve({ id: 'x' }), deleteDoc: () => Promise.resolve(), collection: () => ({}) };
  const store = createStore(initialState({ today, build: 'test' }), reduce);
  store.dispatch({ type: A.SESSION_SET, session: { kind: 'in', email: 'a@b.c' } });
  store.dispatch({ type: A.PLANS_SET, list: upgradedList(raws, noon(today)), source: 'account', readAt: '14:03' });
  const handles = () => ({ db: { name: 'db' }, user: { uid: 'u1', email: 'a@b.c', emailVerified: true }, reread: () => Promise.resolve() });
  const stop = startPlanWrite(store, { session: null, local: null, now: () => new Date(today + 'T14:03:00.000Z'), fb, client: null, handles });
  const go = (hash) => { store.dispatch({ type: A.ROUTE_SET, route: parse(hash) }); store.dispatch({ type: A.PLANS_VIEW, view: viewFor(store.getState()) }); };
  return { store, writes, stop, go };
}

describe('the address: #/plan/<id>/review draws "plan.review"', () => {
  it('parses, formats back and names its screen', () => {
    const r = parse('#/plan/Abc123/review');
    expect(r).toMatchObject({ screen: 'plan', planId: 'Abc123', step: 'review' });
    expect(format(r)).toBe('#/plan/Abc123/review');
    expect(screenName(r)).toBe('plan.review');
  });
});

describe('the reader: the phase, the choices and what each phase reads, with nothing written', () => {
  it('every plan of the corpus at three dates: the phase as the home reads it; every input byte-identical after', () => {
    for (const day of ['2026-10-02', '2027-04-05', '2027-04-06']) {
      const es = entriesAt(day);
      const before = JSON.stringify(es);
      deepFreeze(es);
      for (const e of es) {
        const R = reviewOf(es, e.plan.id, { today: day });
        expect(R.found, e.plan.id).toBe(true);
        expect([null, 'saving', 'moving', 'drawing', 'closed']).toContain(R.phase);
        expect(R.rule.value).toMatch(/^(success:\d{2}|guardrails)$/);
        if (R.phase === 'saving') { expect(R.every).toBe(null); expect(R.moveWindow && R.level).toBeTruthy(); expect(R.save).toBe(null); }
        if (R.phase === 'moving') { expect(R.moveWindow && R.level && R.moving).toBeTruthy(); }
        if (R.phase === 'drawing') { expect(R.moveWindow).toBe(null); expect(R.level).toBe(null); expect(R.living).toBeTruthy(); }
        if (R.phase === 'closed') { expect(R.editable).toBe(false); expect(R.save).toBe(null); }
      }
      expect(JSON.stringify(es)).toBe(before);
    }
  });

  it('Living on it, locked: the boxes start from the last month recorded; the band, the rate against the start and taken against planned', () => {
    const day = '2026-10-02';
    const es = entriesAt(day);
    const id = C['04-buckets-running'].id;
    const R = reviewOf(es, id, { today: day });
    expect(R).toMatchObject({ phase: 'drawing', locked: true, often: 'taxYear', due: { next: 'April 2027', due: false } });
    expect(R.living.start).toMatchObject({ potsFrom: 'record', potsAsOf: 'September 2026', tookFrom: 'record', tookMonths: 6 });
    expect(R.living.band).toMatchObject({ id: 'lower' });
    expect(R.living.guardrail).toMatchObject({ state: 'within' });
    // 7.12.0: the plan's figure for the year is the year's set-up, £2,600 a month × 12, never the document's row
    expect(R.living.taken).toMatchObject({ took: '£15,600', planned: '£' + (2600 * 12).toLocaleString('en-GB'), entered: false });
    expect(R.living.fields.map((f) => f.path)).toEqual(['rv.pension', 'rv.isa', 'rv.other', 'rv.took', 'rv.choice']);
    // what the person types is read: the pots against the band on the figures entered, said as entered
    const typed = { 'rv.pension': '500000', 'rv.took': '20000' };
    const R2 = reviewOf(es, id, { today: day, typed });
    expect(R2.living.entered).toEqual({ pots: true, took: true });
    expect(R2.living.band.id).toBe('below');
    expect(R2.living.taken).toMatchObject({ took: '£20,000', entered: true });
    // what the box holds is the plan's income for the year as "Where you are" adds it (the pension's draws, the State Pension
    // and other income, before tax), against the plan's own income: said as income, never "taken from your pots"
    const w = whereAmIFor(es.find((e) => e.plan.id === id).plan, { now: noon(day) });
    expect(reviewBoxesOf(es.find((e) => e.plan.id === id).plan, { today: day }).took).toBe(w.incomeThisYear.drawn);
    expect(W.living.fields['rv.took'].label).toMatch(/^Your income since 6 April \{year\}, before tax/);
    expect(JSON.stringify(W.living)).not.toMatch(/taken from your pots/);
    // the guardrails rule is offered where the rate against the start reads
    expect(R.rule.options.map((o) => o.value)).toEqual(['success:13', 'success:14', 'success:15', 'success:16', 'success:17', 'success:18', 'guardrails']);
  });

  it('Living on it: a plan stored with a later start says its year 0 and reads nothing against it; an unlocked plan its pots only', () => {
    const day = '2026-10-02';
    const es = entriesAt(day);
    const later = reviewOf(es, C['20-locked-start-after-stop'].id, { today: day });
    expect(later.living.later).toEqual({ year: '2027' });
    expect(later.living.band).toBe(null);
    expect(later.living.guardrail).toBe(null);
    expect(later.living.taken).toBe(null);
    const draft = reviewOf(es, C['02-pnv-draft'].id, { today: day });
    expect(draft).toMatchObject({ phase: 'drawing', locked: false });
    expect(draft.living.fields.map((f) => f.path)).toEqual(['rv.pension', 'rv.isa', 'rv.other']);
    expect(draft.living.start.potsFrom).toBe('plan');
    expect(draft.rule.options.some((o) => o.value === 'guardrails')).toBe(false);
    // drawn: the way to see what a change does, on "Does it last?" — the unlocked review offers it too
    const d = draw(stateWith(es, '#/plan/' + C['02-pnv-draft'].id + '/review', { today: day }));
    expect(q(d.root, 'plan.review.living.try').getAttribute('href')).toBe('#/plan/' + C['02-pnv-draft'].id + '/lasts');
    expect(q(d.root, 'plan.review.living.tryUnlocked').textContent).toContain(W.living.tryUnlocked);
  });

  it('Moving: months left, each bucket held against the mix the plan moves to, on course; a plan with no record reads the plan as it stands', () => {
    const day = '2026-10-02';
    const es = entriesAt(day);
    const R = reviewOf(es, C['19-back-to-work-saving'].id, { today: day });
    expect(R.phase).toBe('moving');
    expect(R.moving).toMatchObject({ record: true, runOn: 'held' });
    expect(R.moving.buckets.map((b) => b.bucket)).toEqual(['shares', 'bonds', 'cash']);
    expect(R.moving.onTrack.on).toBe(true);
    expect(R.moveWindow.years).toBe(3);
    const b = reviewOf(entriesAt('2027-04-06'), C['10-couple-b'].id, { today: '2027-04-06' });
    expect(b.phase).toBe('moving');
    expect(b.moving).toMatchObject({ record: false, runOn: 'asPlanned', buckets: null });
  });

  it('on course: within five points of where the move would be by now', () => {
    expect(onTrackOf({ kind: 'buckets', maxDrift: 16 }, { start: 20, monthsLeft: 18, windowMonths: 36 })).toEqual({ on: false, expected: 10 });
    expect(onTrackOf({ kind: 'buckets', maxDrift: 15 }, { start: 20, monthsLeft: 18, windowMonths: 36 })).toEqual({ on: true, expected: 10 });
    expect(onTrackOf({ kind: 'ladder' }, { start: 20, monthsLeft: 18, windowMonths: 36 })).toBe(null);
  });

  it('Saving: the check-in is the review; the window and the saving level are shown, read from what is held until chosen', () => {
    const day = '2026-10-02';
    const R = reviewOf(entriesAt(day), C['05-saver-committed'].id, { today: day });
    expect(R).toMatchObject({ phase: 'saving', every: null, due: { next: 'September 2027' } });
    expect(R.level).toMatchObject({ stored: false, options: ['cautious', 'balanced', 'adventurous'] });
    expect(R.moveWindow).toMatchObject({ years: 3, stored: false, options: [1, 2, 3, 4, 5] });
  });
});

describe('the screen', () => {
  it('Living on it: the boxes, the reading and "Save this review"; the choices with "Change"; opening it writes nothing', () => {
    const day = '2026-10-02';
    const id = C['04-buckets-running'].id;
    const { root, text } = draw(stateWith(entriesAt(day), '#/plan/' + id + '/review', { today: day }));
    expect(q(root, 'plan.step.review').getAttribute('data-phase')).toBe('drawing');
    expect(q(root, 'plan.review.often').textContent).toBe(W.often.taxYear);
    expect(q(root, 'plan.review.choice.every.line').textContent).toBe('Once a tax year, from 6 April');
    expect(q(root, 'plan.review.next').textContent).toBe('Your next review: April 2027.');
    expect(q(root, 'plan.review.rv.pension') || root.querySelector('[id="plan.review.rv.pension"]')).toBeTruthy();
    expect(q(root, 'plan.review.living.band').getAttribute('data-band')).toBe('lower');
    expect(q(root, 'plan.review.save')).toBeTruthy();
    for (const c of ['rule', 'every']) expect(q(root, 'plan.review.choice.' + c + '.change')).toBeTruthy();
    expect(q(root, 'plan.review.choice.window')).toBe(null);
    expect(text).not.toMatch(/\{\w+\}/);
  });

  it('Moving: the buckets and the move\'s pace; Saving: the check-in with the choices under it', () => {
    const day = '2026-10-02';
    const mv = draw(stateWith(entriesAt(day), '#/plan/' + C['19-back-to-work-saving'].id + '/review', { today: day }));
    expect(q(mv.root, 'plan.review.moving.buckets').querySelectorAll('li')).toHaveLength(3);
    expect(q(mv.root, 'plan.review.moving.onTrack').getAttribute('data-on')).toBe('1');
    expect(q(mv.root, 'plan.review.choice.window.change')).toBeTruthy();
    expect(q(mv.root, 'plan.review.choice.level.change')).toBeTruthy();
    // nothing falls due on it: no "Due once a year" above "whenever you like"; its how often is once a year, from the last review
    expect(q(mv.root, 'plan.review.often')).toBe(null);
    expect(q(mv.root, 'plan.review.next').textContent).toBe(W.nextAny);
    expect(q(mv.root, 'plan.review.choice.every.line').textContent).toBe('Once a year');
    expect(mv.text).not.toContain('Due once');
    const sv = draw(stateWith(entriesAt(day), '#/plan/' + C['05-saver-committed'].id + '/review', { today: day }));
    expect(q(sv.root, 'plan.step.checkin')).toBeTruthy();
    expect(q(sv.root, 'plan.review').getAttribute('data-phase')).toBe('saving');
    expect(q(sv.root, 'plan.review.choice.level.read')).toBeTruthy();
    // the note says where the level is read from: what 05 holds
    expect(q(sv.root, 'plan.review.choice.level.read').getAttribute('data-from')).toBe('held');
    expect(q(sv.root, 'plan.review.choice.level.read').textContent).toBe(W.level.read.held);
    // a plan with nothing held is never told the level was read from what it holds
    const bare = copy(C['10-couple-b']); delete bare.holdings;
    const nb = draw(stateWith([entryOf(bare, day)], '#/plan/' + bare.id + '/review', { today: day }));
    const note = q(nb.root, 'plan.review.choice.level.read');
    if (note) expect(note.textContent).not.toBe(W.level.read.held);
    expect(sv.text).not.toMatch(/\{\w+\}/);
  });

  it('the rail on the review: no step is "you are here" outside Saving, and its line names the review; a saver\'s Check in is current; no "Review now" to the page itself', () => {
    const day = '2026-10-02';
    for (const id of [C['04-buckets-running'].id, C['19-back-to-work-saving'].id]) {
      const { root } = draw(stateWith(entriesAt(day), '#/plan/' + id + '/review', { today: day }));
      expect(root.querySelectorAll('.plan-rail [aria-current="step"]'), id).toHaveLength(0);
      expect(q(root, 'rail.line').textContent).toContain('Your plan: Your review');
      const b = q(root, 'rail.next.button');
      expect(b ? b.getAttribute('href') : null, id).not.toBe('#/plan/' + id + '/review');
    }
    const sv = draw(stateWith(entriesAt(day), '#/plan/' + C['05-saver-committed'].id + '/review', { today: day }));
    const cur = sv.root.querySelectorAll('.plan-rail [aria-current="step"]');
    expect(cur).toHaveLength(1);
    expect(cur[0].getAttribute('data-testid')).toBe('rail.plan.checkin');
    // on any other step the rail is as it was: its first step current on the plan's own address
    const home = draw(stateWith(entriesAt(day), '#/plan/' + C['04-buckets-running'].id + '/month', { today: day }));
    expect(home.root.querySelectorAll('.plan-rail [aria-current="step"]')).toHaveLength(1);
  });

  it('"Change" opens the options; an option is a phaseSet of that part', () => {
    const day = '2026-10-02';
    const id = C['19-back-to-work-saving'].id;
    const { root, actions } = draw(stateWith(entriesAt(day), '#/plan/' + id + '/review', { today: day, open: ['reviewChange.window'] }));
    q(root, 'plan.review.choice.window.4').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(actions.pop()).toEqual({ type: 'plan/phaseSet', planId: id, part: 'window', value: 4 });
  });

  it('the option the plan only reads (the default 3 years, a level read from what is held) is the person\'s choice when pressed: written; once chosen, pressing it again closes the options', () => {
    const day = '2026-10-02';
    const id = C['19-back-to-work-saving'].id;
    const { root, actions } = draw(stateWith(entriesAt(day), '#/plan/' + id + '/review', { today: day, open: ['reviewChange.window', 'reviewChange.level'] }));
    expect(q(root, 'plan.review.choice.window.3').getAttribute('aria-pressed')).toBe('true');
    q(root, 'plan.review.choice.window.3').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(actions.pop()).toEqual({ type: 'plan/phaseSet', planId: id, part: 'window', value: 3 });
    const read = [...root.querySelectorAll('[data-testid^="plan.review.choice.level."][aria-pressed="true"]')];
    expect(read).toHaveLength(1);
    read[0].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(actions.pop()).toMatchObject({ type: 'plan/phaseSet', planId: id, part: 'saving.level' });
    // chosen (stored): the same option closes the options and writes nothing
    const chosen = copy(C['19-back-to-work-saving']);
    Object.assign(chosen, phasesPatch(chosen, 'window', 3, { at: AT }));
    const raws = Object.values(C).map((p) => (p.id === id ? chosen : p));
    const again = draw(stateWith(entriesAt(day, raws), '#/plan/' + id + '/review', { today: day, open: ['reviewChange.window'] }));
    q(again.root, 'plan.review.choice.window.3').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(again.actions.pop()).toEqual({ type: 'ui/toggle', id: 'reviewChange.window' });
  });

  it('a saver\'s review: a choice says itself in the review\'s own toast, with Undo; the check-in\'s toast stays for the check-in', () => {
    const day = '2026-10-02';
    const id = C['05-saver-committed'].id;
    let state = stateWith(entriesAt(day), '#/plan/' + id + '/review', { today: day });
    state = reduce(state, { type: A.PLAN_SAVED, planId: id, previous: { phases: undefined, lastModified: C['05-saver-committed'].lastModified }, line: { id: 'phase.saving.level', slots: { value: 'adventurous' } }, op: 'phase' });
    const { root } = draw(state);
    expect(q(root, 'plan.review.toast').textContent).toContain('Saved: while you save, the plan works out your pension as invested adventurously.');
    expect(q(root, 'plan.checkin.toast')).toBe(null);
  });

  it('a closed plan: no save, no choices', () => {
    const day = '2026-10-02';
    const { root } = draw(stateWith(entriesAt(day), '#/plan/' + C['18-moved-to-new-plan'].id + '/review', { today: day }));
    expect(q(root, 'plan.review.save')).toBe(null);
    expect(q(root, 'plan.review.choices')).toBe(null);
    expect(q(root, 'plan.review.closed')).toBeTruthy();
  });
});

describe('"Save this review" and the choices: ONE write of `phases` each', () => {
  it('reviewSavePatch: the stored keys after are the keys before, the log and `of`; the entry as entered; refused where it cannot go', () => {
    const day = '2027-04-06';
    const plan = entryOf(copy(C['04-buckets-running']), day).plan;
    const p = reviewSavePatch(plan, { today: day, typed: { 'rv.pension': '600000', 'rv.choice': 'keep' }, at: AT });
    expect(p.ok).toBe(true);
    expect(Object.keys(p.patch)).toEqual(['phases']);
    expect(Object.keys(p.patch.phases).sort()).toEqual(['of', 'review']);
    expect(p.patch.phases.of).toBe(plan.createdAt);
    expect(p.patch.phases.review.log).toHaveLength(1);
    expect(p.entry).toMatchObject({ at: AT, phase: 'drawing', pots: { pension: 600000 }, entered: { pots: true, took: false }, choice: 'keep', reading: null });
    expect(['within', 'above', 'below', null]).toContain(p.entry.guardrail);
    expect(p.entry.documentAt).toBe(plan.planDocument.createdAt || plan.planDocument.lockedAt);
    // a box with a problem
    expect(reviewSavePatch(plan, { today: day, typed: { 'rv.pension': 'lots' }, at: AT })).toMatchObject({ ok: false, problem: 'problems' });
    // a closed plan, the example, a saver (its review is the check-in)
    expect(reviewSavePatch(entryOf(copy(C['18-moved-to-new-plan']), day).plan, { today: day, at: AT })).toMatchObject({ ok: false, problem: 'closed' });
    expect(reviewSavePatch(entryOf(copy(C['05-saver-committed']), day).plan, { today: day, at: AT })).toMatchObject({ ok: false, problem: 'notNow' });
    // Moving: no pots, the drift kept
    const mv = reviewSavePatch(entryOf(copy(C['19-back-to-work-saving']), '2026-10-02').plan, { today: '2026-10-02', at: AT });
    expect(mv.entry).toMatchObject({ phase: 'moving', pots: null, took: null });
    expect(Object.keys(mv.entry.drift).sort()).toEqual(['bonds', 'cash', 'diversifiers', 'shares']);
  });

  it('phaseChoicePatch: each part sets that part alone and a history line; a value it cannot take is refused', () => {
    const day = '2026-10-02';
    const plan = entryOf(copy(C['19-back-to-work-saving']), day).plan;
    for (const [part, value, path] of [['window', 4, (ph) => ph.moving.window.years], ['saving.level', 'cautious', (ph) => ph.saving.strategy.level], ['review.every', 'quarter', (ph) => ph.review.every], ['review.rule', 'success:16', (ph) => ph.review.rule.floor]]) {
      const p = phaseChoicePatch(plan, part, value, { at: AT, today: day });
      expect(p.ok, part).toBe(true);
      expect(path(p.patch.phases)).toBe(part === 'review.rule' ? 0.8 : value);
      expect(p.patch.phases.history).toHaveLength(1);
      expect(p.patch.phases.history[0]).toMatchObject({ at: AT, what: part });
      expect(Object.keys(p.patch.phases).sort()).toEqual(['history', 'of', part === 'window' ? 'moving' : part === 'saving.level' ? 'saving' : 'review'].sort());
    }
    expect(phaseChoicePatch(plan, 'window', 6, { at: AT })).toMatchObject({ ok: false, problem: 'problems' });
    expect(phaseChoicePatch(plan, 'saving.level', 'bold', { at: AT })).toMatchObject({ ok: false });
    expect(phaseChoicePatch(plan, 'review.rule', 'success:12', { at: AT })).toMatchObject({ ok: false });
    expect(phaseChoicePatch(plan, 'moving.agreed', {}, { at: AT })).toMatchObject({ ok: false });
    expect(ruleOfChoice('guardrails')).toMatchObject({ kind: 'guardrails' });
    expect(CHOICE_PARTS).toEqual(['window', 'saving.level', 'review.every', 'review.rule']);
  });

  it('the plan write: a review saved on a locked plan is ONE write of `phases` and the stamp; settings, document and holdings untouched; Undo puts it back', async () => {
    const day = '2027-04-06';
    const raw = copy(C['04-buckets-running']);
    const H = harness([raw], day);
    H.go('#/plan/' + raw.id + '/review');
    H.store.dispatch({ type: A.PLAN_EDIT, planId: String(raw.id), path: 'rv.choice', value: 'less' });
    H.store.dispatch({ type: A.PLAN_REVIEW_SAVE, planId: String(raw.id) });
    await tick();
    expect(H.writes).toHaveLength(1);
    expect(Object.keys(H.writes[0].data).sort()).toEqual(['lastModified', 'phases']);
    expect(H.writes[0].data.phases.review.log[0]).toMatchObject({ phase: 'drawing', choice: 'less' });
    const plan = H.store.getState().plans.list[0].plan;
    expect(lockedPlanWriteRefusal(plan, H.writes[0].data, getDefaultStressSettings(), { now: noon(day) })).toBe(null);
    expect(phaseWriteRefusal(plan, H.writes[0].data, { now: noon(day) })).toBe(null);
    expect(H.store.getState().ui.toast).toMatchObject({ kind: 'saved', op: 'review', line: { id: 'reviewSaved', slots: { month: 'April 2028' } } });
    H.store.dispatch({ type: A.PLAN_UNDO, planId: String(raw.id) });
    await tick();
    expect(H.writes).toHaveLength(2);
    expect(H.writes[1].data).toEqual({ phases: null, lastModified: raw.lastModified });
    H.stop();
  });

  it('the plan write: a choice is ONE write of `phases` and the stamp; refused on a closed plan; the reducer takes only the four parts', async () => {
    const day = '2026-10-02';
    const raw = copy(C['05-saver-committed']);
    const closed = copy(C['18-moved-to-new-plan']);
    const H = harness([raw, closed], day);
    H.go('#/plan/' + raw.id + '/review');
    H.store.dispatch({ type: A.PLAN_PHASE_SET, planId: String(raw.id), part: 'saving.level', value: 'adventurous' });
    await tick();
    expect(H.writes).toHaveLength(1);
    expect(Object.keys(H.writes[0].data).sort()).toEqual(['lastModified', 'phases']);
    expect(H.writes[0].data.phases.saving.strategy).toMatchObject({ level: 'adventurous', endTarget: 'drawdown' });
    expect(H.store.getState().ui.toast).toMatchObject({ op: 'phase', line: { id: 'phase.saving.level' } });
    H.store.dispatch({ type: A.PLAN_TOAST_CLOSE });
    H.store.dispatch({ type: A.PLAN_PHASE_SET, planId: String(closed.id), part: 'window', value: 2 });
    await tick();
    expect(H.writes).toHaveLength(1);
    expect(H.store.getState().ui.saveProblem).toMatchObject({ problem: 'closed' });
    H.stop();
    const s0 = initialState({ today: day, build: 'test' });
    expect(() => reduce(s0, { type: A.PLAN_PHASE_SET, planId: 'x', part: 'moving.agreed', value: 'x' })).toThrow(/plan\/phaseSet/);
  });

  it('opening the review of every plan writes nothing', async () => {
    const day = '2027-04-06';
    const raws = Object.values(C).map(copy);
    const before = JSON.stringify(raws);
    const H = harness(raws, day);
    for (const raw of raws) H.go('#/plan/' + raw.id + '/review');
    await tick();
    expect(H.writes).toEqual([]);
    expect(JSON.stringify(raws)).toBe(before);
    H.stop();
  });
});

describe('the boxes', () => {
  it('start from the last month recorded; a figure typed the same as it started is not "entered"', () => {
    const day = '2026-10-02';
    const plan = entryOf(copy(C['04-buckets-running']), day).plan;
    const b = reviewBoxesOf(plan, { today: day });
    expect(b).toMatchObject({ potsFrom: 'record', potsAsOf: '2026-09', tookFrom: 'record', tookMonths: 6, took: 15600 });
    expect(checkReview(plan, { 'rv.pension': String(b.pots.pension) }, { today: day }).entered).toEqual({ pots: false, took: false });
    expect(checkReview(plan, { 'rv.pension': '' }, { today: day }).errors).toEqual({ 'rv.pension': 'required' });
  });
});
